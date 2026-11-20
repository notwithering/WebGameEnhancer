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
			case "fullscreenNextFrame":
				const elements = document.querySelectorAll<HTMLCanvasElement | HTMLIFrameElement>("canvas, iframe");

				var currentElementIndex = -1;
				elements.forEach((el: HTMLElement, i) => {
					if (el == document.fullscreenElement) {
						currentElementIndex = i;
						return;
					}
				});

				// no need to check if currentElementIndex === -1

				const nextElement = elements[(currentElementIndex + 1) % elements.length];
				if (!nextElement) {
					break;
				}

				nextElement.requestFullscreen();
				break;
		}
	});
}
