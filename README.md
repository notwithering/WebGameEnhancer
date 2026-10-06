# WebGameEnhancer

i love playing online shovelware, whether it be from poki.com or playhop/yandex games

frustrating thing is that a lot of the games are very badly made and dont mesh well with browsers (crouch + forward = ctrl+w = close tab)

this should make web games feel native

use with `bun run start -- <url>`

## features

`mod` = `right control`

| shortcut        | description                   |
| --------------- | ----------------------------- |
| `mod` + `]`     | increase sensitivity          |
| `mod` + `[`     | decrease sensitivity          |
| `mod` + `\`     | reset sensitivity             |
| `mod` + `s`     | next sensitivity mode         |
| `mod` + `f`     | toggle fullscreen             |
| `mod` + `p`     | lock mouse pointer            |
| `mod` + `m`     | maximize canvases and iframes |
| `mod` + `q`     | quit                          |
| `mod` + `r`     | reload                        |
| `mod` + `left`  | browser back                  |
| `mod` + `right` | browser forward               |
| `mod` + `d`     | open devtools                 |

### patches

patches various functions to guard against lazily made games

for example, requestPointerLock is patched to prevent the pointer failing to lock

### no shortcuts

in an attempt to make crapware feel nice to play, there are no shortcuts you can accidently hit when playing besides your os-level ones. you cant hit ctrl+w on accident when trying to move forward while crouching without closing the tab

### adblock

shovelware is ripe with ads, adblock is built in and can be disabled by adding the flag `--no-adblock`

### sensitivity modifer

a lot of the very low quality games dont even provide a sensitivity slider and force the most diabolical sensitivities out

this patches the MouseEvent prototype to apply a sensitivity scalar adjustable with `mod` + `[`/`]` and resetable with `mod` + `\`

theres 2 sensitivity modes switchable with `mod` + `s`:

- `fraction` (default): leaves scaled values as fractions. meant for use on js-native games that support fractional axes such as krunker.io
- `integer`: rounds scaled values to integers and stores remainder to add to next mouse event. meant for use on games that round the axes such as eaglercraft and most lower quality games. will be jumpy at extreme sensitivities. **use this if theres no movement at slow mouse movements when using fraction mode**

### maximize canvases and iframes

some games wont let you fullscreen. by pressing `mod` + `m`, itll maximize all canvases and iframes, essentially forcing full screen

## indiscriminate speedrun

this speedrun was made possibly by only this wrapper. it was essentially impossible to play without the patches

https://youtu.be/IFlVth6Xx7Y
