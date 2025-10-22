import { registerSettings } from "./settings.js"
Hooks.on('setup', () => {
	registerSettings();
});
Hooks.on("renderGamePause", function (_, html, options) {
	if (options.cssClass !== "paused") return;
	const path = game.settings.get("pause-icon", "allSettings").path || "None";
	const secondaryPath = game.settings.get("pause-icon", "allSettings").secondaryPath || "None";
	const opacity = game.settings.get("pause-icon", "allSettings").opacity / 100;
	const speed = game.settings.get("pause-icon", "allSettings").speed;
	const text = game.settings.get("pause-icon", "allSettings").text;
	const dimensionX = game.settings.get("pause-icon", "allSettings").dimensionX;
	const dimensionY = game.settings.get("pause-icon", "allSettings").dimensionY;
	const textColor = game.settings.get("pause-icon", "allSettings").textColor;
	const shadow = game.settings.get("pause-icon", "allSettings").shadow;
	const gradient = game.settings.get("pause-icon", "allSettings").gradient;
	const fontSize = game.settings.get("pause-icon", "allSettings").fontSize;
	const fontCaps = game.settings.get("pause-icon", "allSettings").fontCaps;
	const fontName = game.settings.get("pause-icon", "allSettings").fontName ?? "";
	const fontWeight = game.settings.get("pause-icon", "allSettings").fontWeight ?? "";
	const fontStyle = game.settings.get("pause-icon", "allSettings").fontStyle ?? "";
	const positionX = game.settings.get("pause-icon", "allSettings").positionX ?? 0;
	const positionY = game.settings.get("pause-icon", "allSettings").positionY ?? 50;
	const pulse = game.settings.get("pause-icon", "allSettings").pulse

	const imgElement = html.querySelector("img");
	const secondaryImgElement = new Image();
	secondaryImgElement.classList.add("secondary-img");
	imgElement.parentElement.appendChild(secondaryImgElement);

	const caption = html.querySelector("figcaption");
	html.style.height = `${80 + dimensionY}px`;
	html.style.left = `${positionX}vw`;
	html.style.top = `calc(${positionY}vh - ${100 + 0.5 * (dimensionY-100)}px)`;
	if (!gradient) html.style.background = "none";
	if (!pulse) html.style.animation = "none";
	if (path === "None" || dimensionX === 0 || dimensionY === 0) {
		imgElement.hidden = true;
	}
	else {
		console.log("rendering image");
		console.log(text);
		imgElement.src = path;
		imgElement.style.opacity = opacity;
		imgElement.style.width = `${dimensionX}px`;
		imgElement.style.height = `${dimensionY}px`;
		imgElement.style.cssText += `--fa-animation-duration: ${speed}s`;
		imgElement.style.top = `-${dimensionY/2}px`;
		imgElement.style.left = `calc(50% - (${dimensionX/2}px))`;
		imgElement.style.position = `absolute`;
	}

	if (secondaryPath === "None" || dimensionX === 0 || dimensionY === 0) {
		secondaryImgElement.hidden = true;
	}
	else {
		secondaryImgElement.src = secondaryPath;
		secondaryImgElement.style.opacity = opacity;
		secondaryImgElement.style.width = `${dimensionX}px`;
		secondaryImgElement.style.height = `${dimensionY}px`;
		secondaryImgElement.style.top = `-${dimensionY/2}px`;
		secondaryImgElement.style.left = `calc(50% - (${dimensionX/2}px))`;
		secondaryImgElement.style.position = `absolute`;
	}

	caption.innerText = text;
	caption.style.color = textColor;
	caption.style["text-transform"] = fontCaps;
	caption.style["font-size"] = `${fontSize}em`;
	caption.style.fontFamily = fontName;
	caption.style.fontWeight = fontWeight;
	caption.style.fontStyle = fontStyle;

	

	if (shadow) caption.style["text-shadow"] = "0px 0px 20px #000000";
});