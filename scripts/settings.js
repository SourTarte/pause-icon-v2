const MODULE_ID = "pause-icon";
const { DialogV2, HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;

class PauseIconSubmenu extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: 'pause-icon-settings-submenu',
    form: {
      handler: PauseIconSubmenu.handler,
      closeOnSubmit: false,
      submitOnChange: false
    },
    position: {
      width: 550,
      height: "auto"
    },
    tag: "form",
    window: {
      title: "PAUSEICON.app_title",
      contentClasses: ["standard-form"]
    },
    options: {
      scrollable: true
    }
  }
  static PARTS = {
    tabs: {
      template: "templates/generic/tab-navigation.hbs"
    },
    body: {
      template: "/modules/pause-icon/templates/settings-submenu.hbs"
    },
    footer: {
      template: "templates/generic/form-footer.hbs"
    }
  }
  static TABS = {
    category: {
      tabs: [
        { id: "image", icon: "fa-solid fa-image", label: "PAUSEICON.tab_image", active: true },
        { id: "font", icon: "fa-solid fa-font", label: "PAUSEICON.tab_font" }
      ],
      initial: "image"
    }
  }
  get title() {
    return `${game.i18n.format(this.options.window.title)}`;
  }
  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options);
    switch (partId) {
      case "footer":
        context.buttons = [{ type: "submit", action: "submit", icon: "fa-solid fa-upload", label: "Submit" }];
        break;
      case "body":
        let settings = game.settings.get(MODULE_ID, "allSettings");
        if (foundry.utils.isEmpty(settings)) {
          settings = {
            path: "icons/svg/clockwork.svg",
            secondaryPath: "",
            opacity: 50,
            dimensionX: 100,
            dimensionY: 100,
            text: game.i18n.format("GAME.Paused"),
            textColor: "#EEEEEE",
            shadow: false,
            gradient: true,
            fontSize: 1.75,
            fontCaps: "uppercase",
            speed: "5"
          };
        }
        foundry.utils.mergeObject(context, settings);
        break;
      default:
        break;
    }
    return context;
  }
  static async handler(event, form, formData) {
    if (event.submitter.dataset.action === "submit") {
      const settings = new foundry.applications.ux.FormDataExtended(form).object;
      await game.settings.set(MODULE_ID, "allSettings", settings);
      foundry.applications.settings.SettingsConfig.reloadConfirm({ world: true });
    }
  }
  populateElement(element, name, fontElement) {
    const font = CONFIG.fontDefinitions[fontElement.value] ?? game.settings.get("core", "fonts")[fontElement.value];
    const category = name === "fontWeight" ? "weight" : "style"
    const optionsSet = new Set(font.fonts.map(e => e[category]));
    const options = [...optionsSet].map(e => {
      return { value: e ?? "", label: e ?? "normal", selected: e === game.settings.get(MODULE_ID, "allSettings")[name] }
    });
    const outer = foundry.applications.fields.createSelectInput({
      blank: false,
      options,
      name
    }).outerHTML;
    element.outerHTML = outer;
  }
  _onRender(context, options) {
    const capsSelect = this.element.querySelector("[name=fontCaps]");
    capsSelect.value = context.fontCaps;
    let fontSelect = this.element.querySelector("[name=fontName]");
    const fontOptions = [...Object.keys(CONFIG.fontDefinitions).map(e => ({
      value: e,
      label: e,
      group: "Core",
      selected: e === game.settings.get(MODULE_ID, "allSettings").fontName
    })),
    ...Object.keys(game.settings.get("core", "fonts")).map(e => ({
      value: e,
      label: e,
      group: "Custom",
      selected: e === game.settings.get(MODULE_ID, "allSettings").fontName
    }))];
    const outer = foundry.applications.fields.createSelectInput({
      blank: false,
      options: fontOptions,
      name: fontSelect.name
    }).outerHTML;
    fontSelect.outerHTML = outer;
    fontSelect = this.element.querySelector("[name=fontName]");
    const weightSelect = this.element.querySelector("[name=fontWeight]");
    const styleSelect = this.element.querySelector("[name=fontStyle]");
    console.dir(fontSelect);
    this.populateElement(styleSelect, "fontStyle", fontSelect);
    this.populateElement(weightSelect, "fontWeight", fontSelect);
    this.element.addEventListener("change", (event) => {
      if (event.target.name === "fontName") {
        console.log(event.target.value)
        this.populateElement(this.element.querySelector("[name=fontStyle]"), "fontStyle", event.target);
        this.populateElement(this.element.querySelector("[name=fontWeight]"), "fontWeight", event.target);
      }
    })
  }
}
export const registerSettings = function () {
  game.settings.register("pause-icon", "allSettings", {
    scope: 'world',
    config: false,
    type: Object,
    default: {
      path: "icons/svg/clockwork.svg",
      secondaryPath: "",
      opacity: 50,
      dimensionX: 100,
      dimensionY: 100,
      text: game.i18n.format("GAME.Paused"),
      textColor: "#EEEEEE",
      shadow: false,
      gradient: true,
      fontSize: 1.75,
      fontCaps: "uppercase",
      speed: "5",
      pulse: true,
      positionX: 0,
      positionY: 50
    },
  });
  game.settings.registerMenu("pause-icon", "allSettings", {
    name: game.i18n.format("PAUSEICON.settings"),
    label: game.i18n.format("PAUSEICON.settingsButton"),
    icon: 'fas fa-atlas',
    type: PauseIconSubmenu,
    restricted: true
  })
};