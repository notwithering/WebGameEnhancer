import electron from "electron";
import * as bridge from "./bridge";
import * as sensitivity from "./sensitivity";

const COMMAND_KEY = "ControlRight";

export function install(window: electron.BrowserWindow) {
	const contents = window.webContents;
	const top = contents.mainFrame;

	const commands: Record<string, () => void> = {
		KeyD: () => contents.toggleDevTools(),
		KeyF: () => window.setFullScreen(!window.isFullScreen()),
		KeyM: () => bridge.fullscreenNextFrame(top),
		KeyP: () => bridge.lockPointer(top),
		KeyQ: () => electron.app.quit(),
		KeyR: () => contents.reload(),
		ArrowLeft: () => contents.navigationHistory.goBack(),
		ArrowRight: () => contents.navigationHistory.goForward(),
		Escape: () => bridge.exitFullscreen(top),

		KeyS: () => sensitivity.nextMode(top),
		Backslash: () => sensitivity.setScale(top, 1),
		BracketRight: () => sensitivity.adjustScale(top, 1),
		BracketLeft: () => sensitivity.adjustScale(top, -1),
	};

	let commanding = false;

	contents.on("before-input-event", (event: electron.Event, input: electron.Input) => {
		if (input.code === COMMAND_KEY) {
			commanding = input.type === "keyDown";
			return;
		}
		if (!commanding || input.type !== "keyDown") return;

		// cant preventDefault because it stops keyUp events: electron #37336
		commands[input.code]?.();
	});

	contents.on("blur", () => {
		commanding = false;
	});
}
