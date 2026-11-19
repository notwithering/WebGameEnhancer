import * as path from "node:path";
import * as electron from "electron";

export const preloadPath = path.join(electron.app.getAppPath(), "dist", "preload.cjs");
