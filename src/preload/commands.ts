import * as electron from "electron";
import * as sensitivity from "./sensitivity";

const commands: Record<string, () => void> = {
	d: () => electron.ipcRenderer.send("devtools"),
	f: () => electron.ipcRenderer.send("fullscreen"),
	m: () => {
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
	},
	p: () => {
		if (document.pointerLockElement) {
			document.exitPointerLock();
		} else {
			const tryLock2 = () => document.body.requestPointerLock().catch((err) => console.warn("Pointer lock failed:", err));
			const tryLock = () => document.body.requestPointerLock().catch(() => tryLock2());
			tryLock();
		}
	},
	q: () => electron.ipcRenderer.send("quit"),
	r: () => location.reload(),
	arrowleft: () => history.back(),
	arrowright: () => history.forward(),

	s: () => sensitivity.nextMode(),
	"\\": () => sensitivity.setSensitivity(1),
	"]": () => sensitivity.adjustSensitivity(1),
	"[": () => sensitivity.adjustSensitivity(-1),
};

export function install() {
	const COMMAND_KEY = "ControlRight";
	let commanding = false;

	window.addEventListener(
		"keydown",
		async (e) => {
			if (e.code === COMMAND_KEY) {
				e.preventDefault();
				commanding = true;
				return;
			}
			if (!commanding) return;

			e.preventDefault();
			commands[e.key.toLowerCase()]?.();
		},
		true,
	);

	window.addEventListener(
		"keyup",
		(e) => {
			if (e.code === COMMAND_KEY) {
				e.preventDefault();
				commanding = false;
			}
		},
		true,
	);

	window.addEventListener("blur", () => {
		commanding = false;
	});
}
