import * as electron from "electron";
import * as sensitivity from "../frame-patches/src/sensitivity";
import * as bridge from "./bridge";

const STEP_RATIO = 1.1;
let scale = 1;

export function setScale(top: electron.WebFrameMain, val: number) {
	scale = val;
	top.frames.forEach((frame) => {
		bridge.setSensitivityScale(frame, scale);
	});
	bridge.showToast(top, `sensitivity: ${scale.toFixed(3)}x`);
	console.log(scale);
}

export function adjustScale(top: electron.WebFrameMain, direction: 1 | -1) {
	const val = direction === 1 ? scale * STEP_RATIO : scale / STEP_RATIO;
	setScale(top, val);
}

let mode: sensitivity.Mode = "fraction";

export function setMode(top: electron.WebFrameMain, val: sensitivity.Mode) {
	mode = val;
	top.frames.forEach((frame) => {
		bridge.setSensitivityMode(frame, mode);
	});
	bridge.showToast(top, `sensitivity mode: ${mode}`);
}

export function nextMode(top: electron.WebFrameMain) {
	setMode(top, mode === "fraction" ? "integer" : "fraction");
}
