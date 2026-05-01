# timer

ただのタイマーです

## Usage

最大99分。

### 1分間計測したい場合のリンク

- `sec` または `s` で秒
- `min` または `m` で分
- `target` で `HH:mm` までの時間
- `url` で時間になったら該当URLに遷移

```
https://tanjoin.github.io/timer?m=1&s=0
```

## Keyboard shortcut

- `s` スタート・ストップ
- `c` 時計モード ON/OFF
- `u` 遷移するURL
- `t` 終了時間
- `h` 機能説明の表示

## Development

- `node -v`
  - v20.11.1
- `npm -v`
  - 10.2.4
- `uname -v`
  - Darwin Kernel Version 23.2.0: Wed Nov 15 21:53:34 PST 2023; root:xnu-10002.61.3~2/RELEASE_ARM64_T8103
- `sw_vers`
  - ProductName:            macOS
  - ProductVersion:         14.2.1
  - BuildVersion:           23C71