# bridge

the bridge is an API between [`window-patches`](window-patches.md) and [`frame-patches`](frame-patches.md)

`window-patches` uses this to call one-shot functions that run in a specific web frame such as locking the pointer or setting sensitivity scale

commands are sent via `ipcRenderer` on channel `bridge` with args being of type:

```ts
{
	action: string;
	data: any;
}
```

## commands

| action                 | type of `data`                     | what it does                          |
| ---------------------- | ---------------------------------- | ------------------------------------- |
| `toast`                | `string`                           | show a toast with specified message   |
| `sensitivity/setScale` | `number`                           | set scalar value of sensitivity patch |
| `sensitivity/setMode`  | `<frame-patches/sensitivity>.Mode` | set mode of sensitivity patch         |
| `exitFullscreen`       |                                    | runs `document.exitFullscreen()`      |
| `lockPointer`          |                                    | locks the pointer                     |
| `maximizeFrames`       |                                    | maximizes all canvases and frames     |
