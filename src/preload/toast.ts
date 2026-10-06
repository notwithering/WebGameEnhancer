export function createToast() {
	const host = document.createElement("div");
	const shadowRoot = host.attachShadow({ mode: "closed" });

	const toastElement = document.createElement("div");
	toastElement.style.cssText = `
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translateX(-50%) translateY(-50%);

		background: rgba(0, 0, 0, 0.75);
		color: #fff;
		font: 600 32px system-ui, sans-serif;

		pointer-events: none;
		z-index: 2147483647;

		opacity: 0;
		transition: opacity 150ms;
	`;
	shadowRoot.appendChild(toastElement);

	let hideTimeoutId: NodeJS.Timeout;

	return function showToast(message: string, durationMs = 1500) {
		if (!host.isConnected) {
			(document.fullscreenElement ?? document.documentElement).appendChild(host);
		}

		toastElement.textContent = message;
		toastElement.style.opacity = "1";

		clearTimeout(hideTimeoutId);
		hideTimeoutId = setTimeout(() => {
			toastElement.style.opacity = "0";
		}, durationMs);
	};
}

export const showToast = createToast();
