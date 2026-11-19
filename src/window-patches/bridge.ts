import * as electron from "electron";
import * as sensitivity from "../frame-patches/src/sensitivity";

const bridgeChannel: string = "bridge";

function send(frame: electron.WebFrameMain, action: string, data?: any) {
	frame.send(bridgeChannel, {
		action: action,
		data: data,
	});
}

export function showToast(frame: electron.WebFrameMain, message: string) {
	send(frame, "toast", message);
}

export function setSensitivityScale(frame: electron.WebFrameMain, scale: number) {
	send(frame, "sensitivity/setScale", scale);
}

export function setSensitivityMode(frame: electron.WebFrameMain, mode: sensitivity.Mode) {
	send(frame, "sensitivity/setMode", mode);
}

export function exitFullscreen(frame: electron.WebFrameMain) {
	send(frame, "exitFullscreen");
}

export function lockPointer(frame: electron.WebFrameMain) {
	send(frame, "lockPointer");
}

export function maximizeFrames(frame: electron.WebFrameMain) {
	send(frame, "maximizeFrames");
}
