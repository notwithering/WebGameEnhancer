# `src/frame-patches`

the purpose of the `frame-patches` directory is to store the source code of frame-level patches, they are injected into every web frame before being page content is loaded via preload

`src/frame-patches/src` directory contains multiple typescript files that get compiled to a CommonJS preload script at `dist/preload.cjs` via the `build:preload` script

after compilation, the preload is then used in the `electron.BrowserWindowConstructorOptions` and `electron.WebPreferences` so electron can automatically inject it into every web frame before loading it's contents

## patches (`src/frame-patches/src/*`)

| file             | function               | what it does                                                                                           | why                                                                                                                                                                                                       |
| ---------------- | ---------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `qol.ts`         | `removeFocusOutlines`  | injects CSS that removes all focus outlines                                                            | most websites do have CSS that remove focus outlines such as [poki](https://poki.com/), but some may not have it such as [slqnt's csgo web port](https://meow.slqnt.dev/)                                 |
| `qol.ts`         | `blockMouseNavigation` | prevents forward/back mouse keys from traversing navigationHistory                                     |                                                                                                                                                                                                           |
| `qol.ts`         | `patchPointerLock`     | replaces `Element`'s `requestPointerLock` prototype with one that is more tolerant against bad options | some games, such as [granny and verity on yandex games](https://yandex.com/games/app/granny-and-verity-581489) give up if requestPointerLock fails due to bad options instead of retrying without options |
| `qol.ts`         | `patchFullscreen`      | replaces `Element`'s fullscreen prototypes to use a custom implementation                              |
| `sensitivity.ts` | `install`              | replaces `MouseEvent`'s movement getter prototypes to apply a scalar value                             | many games don't have a sensitivity slider                                                                                                                                                                |

# bridge

`src/bridge.ts` listens for and executes [bridge](bridge.md) commands
