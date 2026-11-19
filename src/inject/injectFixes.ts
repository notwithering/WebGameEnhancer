import electron from "electron";
import * as commands from "./commands";

export default function injectFixes(window: electron.BrowserWindow) {
	window.webContents.on("will-prevent-unload", (event) => {
		event.preventDefault();
	});

	commands.install(window);

	// window.webContents.on("dom-ready", () => {
	// 	window.webContents.insertCSS(inject.getSnippet("styles.css"));
	// });
}
