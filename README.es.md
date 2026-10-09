# Cecotec Conga 8290 Immortal Ultra Power en Home Assistant

Control **local** (sin nube) del robot aspirador **Cecotec Conga 8290 Immortal Ultra Power** desde
Home Assistant con [`tuya_local`](https://github.com/make-all/tuya-local), y su publicación en
**Apple Home como robot aspirador de verdad** (Matter), no como un simple interruptor.

**Lo mejor:** el robot **sigue en la app Cecotec Home**. No hace falta borrarlo ni volver a
emparejarlo en Tuya Smart para sacar su clave local.

> 🇬🇧 [English version](README.md)

## Qué se consigue

- `vacuum.conga`: arrancar, pausar, parar, volver a la base, localizar, control manual y
  potencia de aspiración (Off, Gentle, Normal, Strong, Max).
- Selectores: aspirar / fregar / ambos, agua al fregar, modo de limpieza, tipo de recorrido y
  comportamiento en alfombras.
- Interruptores: turbo en alfombras, reanudar tras cargar, no molestar, sonido y modo personalizado.
- Bloqueo infantil, volumen y número de vaciados de la base por limpieza.
- Botones: vaciar el depósito y reiniciar los contadores de cepillo lateral, cepillo central,
  filtro y mopa.
- Sensores: batería, tiempo y área de la limpieza actual, totales, vida de los consumibles,
  mopa instalada y **las 30 averías** que reporta el robot, con su nombre.
- En Apple Home: tarjeta de robot aspirador con **Aspirar / Fregar / Aspirar y fregar**,
  potencia, cantidad de agua, estado y batería.

Las órdenes llegan al robot en 1-2 segundos.

| Dato | Valor |
|---|---|
| Product key Tuya | `kofl9ubyyyfznpxw` |
| Protocolo local | **3.3** |
| App oficial | Cecotec Home (`es.cecotec.forceclima`), basada en el SDK de Tuya |
| Datapoints | [`docs/datapoints.md`](docs/datapoints.md) |

## 1. Instalar el perfil en tuya_local

`tuya_local` no traía perfil para este product key. Copia
[`tuya_local/cecotec_conga8290_vacuum.yaml`](tuya_local/cecotec_conga8290_vacuum.yaml) en:

```
config/custom_components/tuya_local/devices/
```

> **Ojo:** HACS borra los perfiles propios al actualizar `tuya_local`. Vuelve a copiarlo después
> de cada actualización (o hasta que el perfil se incluya en el proyecto oficial).

Al dar de alta el aparato (**Ajustes → Dispositivos → Añadir integración → Tuya Local → manual**):

- **Protocolo: `3.3`. No uses `auto`.** La detección automática abre tantas conexiones seguidas
  que **cuelga el módulo wifi del robot**: deja de anunciarse en la red y cierra el puerto 6668.
  Solo se recupera **apagándolo de verdad** (fuera de la base, mantener el botón hasta que se
  apaguen las luces).
- Elige el tipo **"Cecotec Conga 8290 Immortal Ultra Power"**, que sale el primero de la lista.
- No tengas la app Cecotec Home abierta en casa mientras Home Assistant lo controla: el robot
  admite muy pocas conexiones locales y se las disputan.

## 2. Sacar la clave local sin quitarlo de Cecotec Home

El QR de `tuya_local` y la plataforma de desarrolladores de Tuya solo funcionan con cuentas de
**Tuya Smart / Smart Life**. Cecotec Home es una app de marca blanca y los rechaza. La alternativa
habitual, re-emparejar el robot en Tuya Smart, lo saca de la app de Cecotec.

Este método lee la clave de la propia app de Cecotec, en un Android emulado de tu PC, **con tu
propia cuenta**:

1. **Emulador Android 11 (API 30) `google_apis` x86_64** del SDK de Android. Esa imagen permite
   `adb root` y traduce código ARM de 32 y 64 bits. Las imágenes más nuevas (API 35) solo traducen
   ARM de 64 bits y la app se cierra.
2. **Cecotec Home versión 1.2.0.** Las versiones probadas:
   - 1.2.9 (la actual): solo trae código ARM de 32 bits y se cierra en el emulador.
   - 1.2.5: incluye la protección *pairip* de Google Play y se bloquea si no se instaló desde
     Play.
   - **1.2.0: funciona.**

   Todas tienen la misma firma (certificado SHA-256 `e93ba4c7…6ffd7142`); compruébala con
   `apksigner verify --print-certs` si la descargas de un espejo.
3. Inicia sesión en la app con tu cuenta (país **España**) y espera a que salga el robot.
4. La app guarda los datos **cifrados** (MMKV), así que no sirve leer sus ficheros. Se le pide la
   clave en caliente con [Frida](https://frida.re):

   ```bash
   adb root
   adb push frida-server-<versión>-android-x86_64 /data/local/tmp/fs
   adb shell "chmod 755 /data/local/tmp/fs; /data/local/tmp/fs -D &"
   frida -U -n Cecotec -l tools/dump_localkey.js -q
   ```

   [`tools/dump_localkey.js`](tools/dump_localkey.js) imprime `device_id`, `product_id` y
   `local_key` de cada aparato de tu cuenta. Sirve para cualquier aparato de Cecotec Home
   (aires, radiadores…), no solo para el Conga.
5. Apaga el emulador al terminar. **La clave cambia si algún día reseteas o vuelves a emparejar
   el robot.**

## 3. Apple Home: robot aspirador nativo (Matter)

El puente HomeKit de Home Assistant solo puede publicar un robot aspirador como **interruptor**.
Desde iOS 18.4, la app Casa tiene una tarjeta de robot aspirador, pero solo para aparatos
**Matter**. Para tenerla:

1. Instala **Home Assistant Matter Hub**, el fork mantenido de RiDDiX. Repositorio de
   complementos: `https://github.com/RiDDiX/home-assistant-addons`, canal estable `hamh`.
2. Crea un puente con [`matter-hub/bridge.json`](matter-hub/bridge.json):
   - **Server Mode** activado. Es obligatorio para robots en Apple Home; sin él se queda en
     "Actualizando".
   - Solo `vacuum.conga`.
   - `vacuumOnOff: false`.
   - Puerto **5541**, si ya usas el Matter Server oficial, que ocupa el 5540.
3. En **Entity Mappings** del Conga, aplica
   [`matter-hub/entity-mapping.json`](matter-hub/entity-mapping.json): `cleaningModeEntity` y
   `mopIntensityEntity`. **Reinicia el puente** después; el cambio no se aplica solo.
4. Empareja desde la app Casa → Añadir accesorio → código de emparejamiento del puente.

Comprobado con un **HomePod de 1.ª generación** como concentrador. Matter por wifi funciona; la
documentación de Apple solo lo excluye para Thread.

Limitaciones de Apple Home: solo tres niveles de potencia (Strong y Max salen juntos como
"Máximo"), sin habitaciones (el robot no las expone en local) y sin los ajustes avanzados, que
quedan en Home Assistant.

## 4. Panel de Home Assistant (opcional)

[`dashboard/robot-section.yaml`](dashboard/robot-section.yaml) es una sección para una vista de tipo
*sections*: tarjeta del robot con sus botones, aspirar/fregar, agua, averías y vaciado del depósito.

## Notas del modelo

- Las vidas de los consumibles son minutos y **pueden salir en negativo**: el robot informa así
  de que la pieza ya superó su vida útil. Reinicia el contador al cambiarla.
- Tras apagarlo y encenderlo, el robot puede volver con la aspiración y el fregado en `close`
  (apagados). No es un fallo de Home Assistant.
- `getPv()` en la app devuelve `2.2`, pero el protocolo local es **3.3**.

## Licencia

MIT. El perfil se ha propuesto para su inclusión en
[make-all/tuya-local](https://github.com/make-all/tuya-local/issues/6403) (issue #6403).
