import * as electron from "electron";

export function removeFocusOutlines() {
	const applyCSS = () => {
		const style = document.createElement("style");
		style.textContent = `
			*:focus,
			*:focus-visible {
				outline: none !important;
				box-shadow: none !important;
			}
		`;
		document.head.appendChild(style);
	};

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", applyCSS);
	} else {
		applyCSS();
	}
}

export function blockMouseNavigation() {
	const fn = (e: MouseEvent) => {
		if (e.button === 3 || e.button === 4) e.preventDefault();
	};

	window.addEventListener("mouseup", fn, true);
	window.addEventListener("pointerup", fn, true);
	window.addEventListener("mousedown", fn, true);
	window.addEventListener("auxclick", fn, true);
}

export function patchPointerLock() {
	type PatchedFunction = ((...args: any[]) => unknown) & { __patched?: boolean };

	electron.contextBridge.executeInMainWorld({
		func: () => {
			const currentFunction = Element.prototype.requestPointerLock as PatchedFunction;

			if (currentFunction.__patched) return;
			const oldFunc = Element.prototype.requestPointerLock;

			const newFunc: PatchedFunction = function (this: Element, opts: PointerLockOptions) {
				const result = oldFunc.call(this, opts);
				if (!opts || !result || typeof result.catch !== "function") return result;

				return result.catch((err) => {
					if (err && err.name === "NotSupportedError") {
						return oldFunc.call(this);
					}
					throw err;
				});
			};

			newFunc.__patched = true;
			Element.prototype.requestPointerLock = newFunc as typeof oldFunc;
		},
	});
}
