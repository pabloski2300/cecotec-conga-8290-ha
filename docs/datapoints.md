# Datapoints (DPs) del Conga 8290

Esquema completo que publica el robot (product key `kofl9ubyyyfznpxw`, protocolo Tuya 3.3).
Volcado desde la propia app el 2026-10-06. El JSON original está en `dp-schema.json`.

| DP | Código | Acceso | Tipo | Valores / rango |
|---|---|---|---|---|
| 1 | `switch_go` | lectura/escritura | bool |  |
| 2 | `pause` | lectura/escritura | bool |  |
| 3 | `switch_charge` | lectura/escritura | bool |  |
| 4 | `mode` | lectura/escritura | enum | `smart`, `zone`, `pose`, `select_room`, `game`, `manual` |
| 5 | `status` | solo lectura | enum | `standby`, `smart`, `zone_clean`, `paused`, `goto_pos`, `pos_arrived`, `pos_unarrive`, `goto_charge`, `charging`, `charge_done`, `sleep`, `select_room`, `part_clean`, `game`, `mapping`, `collecting_dust`, `manual` |
| 6 | `clean_time` | solo lectura | value | 0–9999 min |
| 7 | `clean_area` | solo lectura | value | 0–9999 ㎡ |
| 8 | `battery_percentage` | solo lectura | value | 0–100 % |
| 9 | `suction` | lectura/escritura | enum | `close`, `gentle`, `normal`, `strong`, `max` |
| 10 | `cistern` | lectura/escritura | enum | `close`, `low`, `middle`, `high` |
| 11 | `seek` | lectura/escritura | bool |  |
| 12 | `direction_control` | lectura/escritura | enum | `forward`, `backward`, `turn_left`, `turn_right`, `stop`, `exit`, `right_forward`, `left_forward` |
| 13 | `map_reset` | lectura/escritura | bool |  |
| 14 | `path_data` | lectura/escritura | raw |  |
| 15 | `command_trans` | lectura/escritura | raw |  |
| 16 | `request` | lectura/escritura | enum | `get_map`, `get_path`, `get_both` |
| 17 | `edge_brush_life` | lectura/escritura | value | 0–9000 min |
| 18 | `edge_brush_life_reset` | lectura/escritura | bool |  |
| 19 | `roll_brush_life` | lectura/escritura | value | 0–18000 min |
| 20 | `roll_brush_life_reset` | lectura/escritura | bool |  |
| 21 | `filter_life` | solo lectura | value | 0–9000 min |
| 22 | `filter_reset` | lectura/escritura | bool |  |
| 23 | `rag_life` | solo lectura | value | 0–9000 min |
| 24 | `rag_life_reset` | lectura/escritura | bool |  |
| 25 | `do_not_disturb` | lectura/escritura | bool |  |
| 26 | `volume_set` | lectura/escritura | value | 0–100 % |
| 27 | `break_clean` | lectura/escritura | bool |  |
| 28 | `fault` | lectura/escritura | bitmap | bits: `low_power`, `poweroff`, `wheel_trap`, `cannot_upgrade`, `collision_stuck`, `dust_station_full`, `tile_error`, `lidar_speed_err`, `lidar_cover`, `lidar_point_err`, `front_wall_dirty`, `psd_dirty`, `middle_sweep`, `side_sweep`, `fan_speed`, `dustbox_out`, `dustbox_full`, `no_dust_box`, `dustbox_fullout`, `trapped`, `pick_up`, `no_dust_water_box`, `water_box_empty`, `forbid_area`, `land_check`, `findcharge_fail`, `battery_err`, `kit_wheel`, `kit_lidar`, `kit_water_pump` |
| 29 | `clean_area_total` | solo lectura | value | 0–99999 ㎡ |
| 30 | `clean_count_total` | solo lectura | value | 0–99999 |
| 31 | `clean_time_total` | solo lectura | value | 0–99999 min |
| 32 | `device_timer` | lectura/escritura | raw |  |
| 33 | `disturb_time_set` | lectura/escritura | raw |  |
| 34 | `device_info` | solo lectura | raw |  |
| 35 | `voice_data` | lectura/escritura | raw |  |
| 36 | `language` | lectura/escritura | enum | `chinese_simplified`, `chinese_traditional`, `english`, `german`, `french`, `russian`, `spanish`, `korean`, `latin`, `portuguese`, `japanese`, `italian` |
| 37 | `dust_collection_num` | lectura/escritura | value | 0–4 |
| 38 | `dust_collection_switch` | lectura/escritura | bool |  |
| 39 | `customize_mode_switch` | lectura/escritura | bool |  |
| 40 | `mop_state` | solo lectura | enum | `none`, `installed` |
| 41 | `work_mode` | lectura/escritura | enum | `both_work`, `only_sweep`, `only_mop` |
| 42 | `unit_set` | lectura/escritura | enum | `square_meter`, `square_foot` |
| 43 | `estimated_area` | solo lectura | value | 0–99999999 ㎡ |
| 44 | `carpet_clean_prefer` | lectura/escritura | enum | `adaptive`, `evade`, `ignore` |
| 45 | `auto_boost` | lectura/escritura | bool |  |
| 46 | `cruise_switch` | lectura/escritura | bool |  |
| 47 | `child_lock` | lectura/escritura | bool |  |
| 49 | `self_clean` | lectura/escritura | bool |  |
| 50 | `drying` | lectura/escritura | bool |  |
| 51 | `self_clean_frequency` | lectura/escritura | value | 1–10 ㎡ |
| 52 | `self_clean_strength` | lectura/escritura | enum | `fast`, `daily`, `depth` |
| 53 | `land_strength` | lectura/escritura | enum | `slow`, `normal`, `fast` |
| 101 | `geofence_switch` | lectura/escritura | bool |  |
| 103 | `charge_type` | lectura/escritura | enum | `seat`, `station` |
| 104 | `y_mop_switch` | lectura/escritura | bool |  |
| 105 | `cleaning_way` | lectura/escritura | enum | `auto`, `clean_thoroughly`, `acrubbing`, `border`, `espiral`, `espiral_cuadrada` |
| 106 | `icons_to_robot` | solo escritura | enum | `icon1`, `icon2`, `icon3`, `icon4`, `icon5`, `icon6`, `icon7`, `icon8`, `icon9`, `icon10`, `icon11`, `icon12`, `icon13`, `icon14`, `icon15`, `icon16`, `icon17`, `icon18`, `icon19`, `icon20`, `icon21`, `icon22`, `icon23`, `icon24`, `icon25`, `icon26`, `icon27`, `icon28`, `icon29`, `icon30` |
| 107 | `icons_to_app` | solo lectura | raw |  |
| 108 | `sound_switch` | lectura/escritura | bool |  |
| 109 | `quick_map` | lectura/escritura | bool |  |
| 110 | `plan_icons` | lectura/escritura | raw |  |
| 120 | `status_unlock_game` | solo lectura | enum | `map_unstable`, `twice_cleaning_unfinished`, `allow_play` |
| 128 | `message_report` | lectura/escritura | enum | `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `10`, `11`, `12`, `13`, `14`, `15`, `16`, `17`, `18`, `19`, `20`, `21`, `22`, `23`, `24`, `25`, `26`, `27`, `28`, `29`, `30` |
| 142 | `depth_clean` | lectura/escritura | bool |  |
| 143 | `alongwall_clean` | lectura/escritura | bool |  |
| 144 | `spiral_clean` | lectura/escritura | bool |  |
| 145 | `square_clean` | lectura/escritura | bool |  |
| 146 | `findchgfanstatus` | lectura/escritura | bool |  |
| 147 | `score_alluser` | lectura/escritura | raw |  |
