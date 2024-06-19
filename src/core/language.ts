import * as i18next from "i18next";
import * as backend from "i18next-fs-backend";

i18next.use(backend as any).init({
  initImmediate: false,
  lng: "en",
  fallbackLng: "en",
  preload: ["en", "es"],
  ns: ["translation"],
  defaultNS: "translation",
  backend: {
    loadPath: "locales/{{lng}}/{{ns}}.json"
  }
});

export const i18n = i18next;
