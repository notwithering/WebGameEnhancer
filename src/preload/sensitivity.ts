import * as electron from "electron";

// TODO: cleanup
export function install() {
	electron.contextBridge.executeInMainWorld({
		func: () => {
			let sensitivityMultiplier = 1;
			let mode: Mode = "fraction";
			let leftoverX = 0;
			let leftoverY = 0;
			const wholeMovementByEvent = new WeakMap<MouseEvent, { x: number; y: number }>();

			window.addEventListener("set-mouse-sensitivity-scale", (event) => {
				if (event instanceof CustomEvent && Number.isFinite(event.detail)) {
					sensitivityMultiplier = event.detail;
				}
			});
			window.addEventListener("set-sensitivity-mode", (event) => {
				if (event instanceof CustomEvent && (event.detail === "integer" || event.detail === "fraction")) {
					mode = event.detail;
					leftoverX = 0;
					leftoverY = 0;
				}
			});

			const mouseEventPrototype = MouseEvent.prototype;
			const originalGetMovementX = Object.getOwnPropertyDescriptor(mouseEventPrototype, "movementX")?.get;
			const originalGetMovementY = Object.getOwnPropertyDescriptor(mouseEventPrototype, "movementY")?.get;
			if (!originalGetMovementX || !originalGetMovementY) {
				console.error("original movement getters undefined");
				return;
			}

			document.addEventListener("pointerlockchange", () => {
				leftoverX = 0;
				leftoverY = 0;
			});

			const getWholeMovement = (mouseEvent: MouseEvent) => {
				let wholeMovement = wholeMovementByEvent.get(mouseEvent);
				if (!wholeMovement) {
					const exactX = originalGetMovementX.call(mouseEvent) * sensitivityMultiplier + leftoverX;
					const exactY = originalGetMovementY.call(mouseEvent) * sensitivityMultiplier + leftoverY;

					const wholeX = Math.round(exactX);
					const wholeY = Math.round(exactY);

					leftoverX = exactX - wholeX;
					leftoverY = exactY - wholeY;

					wholeMovement = { x: wholeX, y: wholeY };
					wholeMovementByEvent.set(mouseEvent, wholeMovement);
				}
				return wholeMovement;
			};

			const patchProperty = (name: string, originalGetter: () => number, axis: "x" | "y") =>
				Object.defineProperty(mouseEventPrototype, name, {
					configurable: true,
					enumerable: true,
					get(this: MouseEvent) {
						if (sensitivityMultiplier === 1 || !document.pointerLockElement) {
							return originalGetter.call(this);
						}
						if (mode === "integer") {
							return getWholeMovement(this)[axis];
						}
						return originalGetter.call(this) * sensitivityMultiplier;
					},
				});

			patchProperty("movementX", originalGetMovementX, "x");
			patchProperty("movementY", originalGetMovementY, "y");
		},
	});
}

export function setSensitivity(scale: number) {
	window.dispatchEvent(new CustomEvent("set-mouse-sensitivity-scale", { detail: scale }));
}

export type Mode = "fraction" | "integer";

export function setMode(mode: Mode) {
	window.dispatchEvent(new CustomEvent("set-sensitivity-mode", { detail: mode }));
}
