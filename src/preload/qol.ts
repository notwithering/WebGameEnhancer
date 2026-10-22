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

export function patchFullscreen() {
	electron.contextBridge.executeInMainWorld({
		func: () => {
			let fullscreenElement: HTMLElement | null;
			let savedStyle: any;

			Element.prototype.requestFullscreen = function (this: HTMLElement) {
				if (fullscreenElement) Document.prototype.exitFullscreen();

				fullscreenElement = this;
				savedStyle = this.getAttribute("style");
				this.style.cssText += ";position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;max-width:none!important;max-height:none!important;margin:0!important;z-index:2147483647!important;background:#000;";
				this.dispatchEvent(new Event("fullscreenchange", { bubbles: true }));

				return Promise.resolve();
			};

			Document.prototype.exitFullscreen = function () {
				if (!fullscreenElement) return Promise.resolve();

				if (savedStyle === null) {
					fullscreenElement.removeAttribute("style");
				} else {
					fullscreenElement.setAttribute("style", savedStyle);
				}
				fullscreenElement.dispatchEvent(new Event("fullscreenchange", { bubbles: true }));
				fullscreenElement = null;

				return Promise.resolve();
			};

			const define = (name: string, get: () => any) =>
				Object.defineProperty(Document.prototype, name, {
					get,
					configurable: true,
				});
			define("fullscreenElement", () => fullscreenElement);
			define("fullscreenEnabled", () => true);
		},
	});
}
