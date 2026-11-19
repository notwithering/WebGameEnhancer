import * as toast from "./toast";
import * as sensitivity from "./sensitivity";
import * as electron from "electron";

export function install() {
	electron.ipcRenderer.on("bridge", (_e, args: { action: string; data: any }) => {
		switch (args.action) {
			case "toast":
				toast.showToast(args.data);
				break;
			case "sensitivity/setScale":
				sensitivity.setSensitivity(args.data);
				break;
			case "sensitivity/setMode":
				sensitivity.setMode(args.data);
				break;
			case "exitFullscreen":
				document.exitFullscreen();
				break;
			case "lockPointer":
				if (document.pointerLockElement) {
					document.exitPointerLock();
				} else {
					document.body.requestPointerLock().catch((err) => console.warn("Pointer lock failed:", err));
				}
				break;
			case "maximizeFrames":
				const root = document.documentElement;
				const keepTags = new Set(["canvas", "iframe"]);

				const makeFullscreen = (el: HTMLElement) => {
					Object.assign(el.style, {
						position: "fixed",
						top: "0",
						left: "0",
						width: "100%",
						height: "100%",
						zIndex: "999999",
						border: "none",
					});
					root.insertBefore(el, root.firstChild);
				};

				document.querySelectorAll<HTMLCanvasElement | HTMLIFrameElement>("canvas, iframe").forEach(makeFullscreen);

				[...root.childNodes].forEach((node) => {
					if (!(node instanceof Element) || !keepTags.has(node.tagName.toLowerCase())) {
						node.remove();
					}
				});

				break;
		}
	});
}
