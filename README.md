# Cecotec Conga 8290 Immortal Ultra Power in Home Assistant

**Local** (cloud-free) control of the **Cecotec Conga 8290 Immortal Ultra Power** robot vacuum from
Home Assistant with [`tuya_local`](https://github.com/make-all/tuya-local), plus exposing it to
**Apple Home as a real robot vacuum** (Matter), not just an on/off switch.

**The best part:** the robot **stays in the Cecotec Home app**. You don't need to remove it or
re-pair it in Tuya Smart to get its local key.

> 🇪🇸 [Versión en español](README.es.md)

## What you get

- `vacuum.conga`: start, pause, stop, return to dock, locate, manual control and suction power
  (Off, Gentle, Normal, Strong, Max).
- Selects: vacuum / mop / both, mop water level, cleaning mode, cleaning route and carpet
  behaviour.
- Switches: carpet boost, resume after charging, do not disturb, sound and custom mode.
- Child lock, volume and number of dock emptyings per clean.
- Buttons: empty the dustbin, and reset the side brush, main brush, filter and mop counters.
- Sensors: battery, current clean time and area, lifetime totals, consumable life, mop
  installed and **all 30 faults** the robot reports, by name.
- In Apple Home: a robot vacuum tile with **Vacuum / Mop / Vacuum and mop**, suction, water
  level, status and battery.

Commands reach the robot in 1-2 seconds.

| Item | Value |
|---|---|
| Tuya product key | `kofl9ubyyyfznpxw` |
| Local protocol | **3.3** |
| Official app | Cecotec Home (`es.cecotec.forceclima`), built on the Tuya SDK |
| Datapoints | [`docs/datapoints.md`](docs/datapoints.md) |

## 1. Install the tuya_local profile

`tuya_local` has no profile for this product key yet (an English version is ready to be
submitted upstream). Until it ships, copy
[`tuya_local/cecotec_conga8290_vacuum.yaml`](tuya_local/cecotec_conga8290_vacuum.yaml) into:

```
config/custom_components/tuya_local/devices/
```

> **Note:** HACS deletes custom profiles when it updates `tuya_local`. Copy it again after each
> update, until the profile ships with the integration.

When adding the device (**Settings → Devices → Add integration → Tuya Local → manual**):

- **Protocol: `3.3`. Do not use `auto`.** Auto-detection opens so many connections in a row that
  it **hangs the robot's Wi-Fi module**: it stops announcing itself on the network and closes
  port 6668. It only recovers after a **real power-off** (off the dock, hold the button until the
  lights go out).
- Pick the type **"Cecotec Conga 8290 Immortal Ultra Power"**; it is listed first.
- Don't keep the Cecotec Home app open at home while Home Assistant controls the robot: it
  accepts very few local connections and they compete for them.

> The entity names in this repo's profile are in Spanish (it is the one running at my home). The
> version submitted upstream uses English names and translation keys.

## 2. Get the local key without removing it from Cecotec Home

The `tuya_local` QR login and the Tuya developer platform only work with **Tuya Smart / Smart
Life** accounts. Cecotec Home is a white-label app and is rejected. The usual workaround,
re-pairing the robot in Tuya Smart, removes it from the Cecotec app.

This method reads the key from the Cecotec app itself, in an emulated Android on your PC, **with
your own account**:

1. **Android 11 (API 30) `google_apis` x86_64 emulator** from the Android SDK. That image allows
   `adb root` and translates both 32- and 64-bit ARM code. Newer images (API 35) only translate
   64-bit ARM and the app crashes.
2. **Cecotec Home version 1.2.0.** Versions tested:
   - 1.2.9 (current): ships only 32-bit ARM code and crashes in the emulator.
   - 1.2.5: includes Google Play's *pairip* protection and blocks itself if not installed from
     Play.
   - **1.2.0: works.**

   All of them carry the same signature (certificate SHA-256 `e93ba4c7…6ffd7142`); check it with
   `apksigner verify --print-certs` if you download from a mirror.
3. Log in to the app with your account (country **Spain**) and wait for the robot to show up.
4. The app stores its data **encrypted** (MMKV), so reading its files doesn't work. Ask the
   running app for the key with [Frida](https://frida.re):

   ```bash
   adb root
   adb push frida-server-<version>-android-x86_64 /data/local/tmp/fs
   adb shell "chmod 755 /data/local/tmp/fs; /data/local/tmp/fs -D &"
   frida -U -n Cecotec -l tools/dump_localkey.js -q
   ```

   [`tools/dump_localkey.js`](tools/dump_localkey.js) prints `device_id`, `product_id` and
   `local_key` for every device in your account. It works for any Cecotec Home device (air
   conditioners, heaters…), not only the Conga.
5. Shut the emulator down when done. **The key changes if you ever reset or re-pair the robot.**

## 3. Apple Home: native robot vacuum (Matter)

Home Assistant's HomeKit Bridge can only expose a robot vacuum as a **switch**. Since iOS 18.4
the Home app has a robot vacuum tile, but only for **Matter** devices. To get it:

1. Install **Home Assistant Matter Hub**, the fork maintained by RiDDiX. Add-on repository:
   `https://github.com/RiDDiX/home-assistant-addons`, stable channel `hamh`.
2. Create a bridge with [`matter-hub/bridge.json`](matter-hub/bridge.json):
   - **Server Mode** on. Required for robot vacuums in Apple Home; without it the tile stays on
     "Updating".
   - Only `vacuum.conga`.
   - `vacuumOnOff: false`.
   - Port **5541**, if you already run the official Matter Server, which uses 5540.
3. In the Conga's **Entity Mappings**, apply
   [`matter-hub/entity-mapping.json`](matter-hub/entity-mapping.json): `cleaningModeEntity` and
   `mopIntensityEntity`. **Restart the bridge** afterwards; the change is not applied on its own.
4. Pair it from the Home app → Add accessory → the bridge's pairing code.

Tested with a **1st-generation HomePod** as the home hub. Matter over Wi-Fi works; Apple's
documentation only excludes it for Thread.

Apple Home limitations: only three suction levels (Strong and Max both show as "Max"), no rooms
(the robot doesn't expose them locally) and none of the advanced settings, which stay in Home
Assistant.

## 4. Home Assistant dashboard (optional)

[`dashboard/robot-section.yaml`](dashboard/robot-section.yaml) is a section for a *sections* view:
the robot tile with its buttons, vacuum/mop, water, faults and dustbin emptying.

## Model notes

- Consumable life is reported in minutes and **can go negative**: that's how the robot says the
  part is past its lifetime. Reset the counter when you replace it.
- After a power cycle the robot can come back with suction and mop set to `close` (off). That's
  not a Home Assistant bug.
- `getPv()` in the app returns `2.2`, but the local protocol is **3.3**.

## License

MIT. The profile is offered for inclusion in
[make-all/tuya-local](https://github.com/make-all/tuya-local).
