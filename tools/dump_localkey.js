// Frida script: lists the devices loaded in the Cecotec Home app (Tuya "Thing" SDK)
// with the fields tuya_local needs: device id, product id, protocol and local key.
//
// Usage (rooted emulator, app logged in and showing your devices):
//   frida -U -n Cecotec -l dump_localkey.js -q
//
// The local key is a secret for YOUR device. Do not paste it in issues or forums.

Java.perform(function () {
  var classes = [
    "com.thingclips.smart.sdk.bean.DeviceBean", // Cecotec Home 1.1.x - 1.2.x
    "com.tuya.smart.sdk.bean.DeviceBean",       // older Tuya-based apps
  ];
  var seen = {};
  classes.forEach(function (name) {
    try {
      Java.choose(name, {
        onMatch: function (d) {
          var id = String(d.getDevId());
          if (seen[id]) return;
          seen[id] = true;
          var out = { name: String(d.getName()), device_id: id };
          try { out.product_id = String(d.getProductId()); } catch (e) {}
          try { out.local_key = String(d.getLocalKey()); } catch (e) {}
          // getPv() is the Tuya "pv" field, NOT the LAN protocol (the Conga reports 2.2
          // but speaks 3.3). Use the UDP broadcast or tinytuya to confirm the protocol.
          try { out.pv = String(d.getPv()); } catch (e) {}
          console.log(JSON.stringify(out));
        },
        onComplete: function () {},
      });
    } catch (e) {
      // Class not present in this app version: try the next one.
    }
  });
  console.log("done (" + Object.keys(seen).length + " devices)");
});
