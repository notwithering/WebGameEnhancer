import electron from "electron";
import path from "path";
import { ElectronBlocker } from "@ghostery/adblocker-electron";
import { parseArgs } from "node:util";
import fs from "fs";
import * as framePatches from "./frame-patches/index";
import * as windowPatches from "./window-patches/index";

const { values: options, positionals: args } = parseArgs({
	args: process.argv.slice(process.defaultApp ? 2 : 1).filter((a) => !/^-{2,}$/.test(a)),
	options: {
		help: { type: "boolean", short: "h" },
		"no-adblock": { type: "boolean", default: false },
	},
	allowPositionals: true,
	strict: false,
});

const windowOptions: electron.BrowserWindowConstructorOptions = {
	webPreferences: {
		preload: framePatches.preloadPath,
		nodeIntegrationInSubFrames: true,
		backgroundThrottling: false,
		autoplayPolicy: "no-user-gesture-required",
		imageAnimationPolicy: "animate",
	},
};

electron.app.whenReady().then(async () => {
	if (options.help) {
		console.log(`usage: wge [options] <url>

options:
	--help, -h  : show this help message
	--no-adblock: disable adblocking`);
		electron.app.exit(0);
		return;
	}

	const url = args[0];
	if (!url) {
		console.error("no url provided");
		electron.app.exit(1);
		return;
	}

	const ses = electron.session.defaultSession;

	if (!options["no-adblock"]) {
		try {
			const blocker = await ElectronBlocker.fromLists(
				fetch,
				["https://easylist.to/easylist/easylist.txt"],
				{ enableCompression: true },
				{
					path: path.join(electron.app.getPath("userData"), "engine.bin"),
					read: fs.promises.readFile,
					write: fs.promises.writeFile,
				},
			);

			blocker.enableBlockingInSession(ses);
		} catch (err) {
			console.error("adblock failed to load:", err);
		}
	}

	const ALLOWED_PERMISSIONS = new Set(["fullscreen", "pointerLock"]);

	ses.setPermissionRequestHandler((_, permission, callback) => {
		callback(ALLOWED_PERMISSIONS.has(permission));
	});

	ses.setPermissionCheckHandler((_, permission) => {
		return ALLOWED_PERMISSIONS.has(permission);
	});

	ses.setDevicePermissionHandler(() => false);

	ses.setDisplayMediaRequestHandler((_, callback) => {
		callback({});
	});

	electron.Menu.setApplicationMenu(null);
	const win = new electron.BrowserWindow(windowOptions);
	win.loadURL(url);
});

electron.app.on("browser-window-created", (_e, window) => {
	window.webContents.setWindowOpenHandler(() => ({
		action: "allow",
		overrideBrowserWindowOptions: windowOptions,
	}));

	windowPatches.apply(window);
});

electron.app.on("window-all-closed", () => {
	electron.app.quit();
});
