type LocalizeKey = "EN" | "DE" | "NL" | "FR" | "ES";

type PhraseKey =
  | "FEED"
  | "CASH_OUT"
  | "YOU_WIN"
  | "COLLECT_WIN"
  | "RAPID_GROWTH";

export class Localize {
  private currentLang: LocalizeKey = "EN";

  private dictionary: Record<PhraseKey, Record<LocalizeKey, string>> = {
    FEED: {
      EN: "FEED",
      DE: "FÜTTERN",
      NL: "VOEDEN",
      FR: "NOURRIR",
      ES: "ALIMENTAR",
    },
    CASH_OUT: {
      EN: "Cash Out",
      DE: "AUSZAHLEN",
      NL: "UITBETALEN",
      FR: "ENCAISSER",
      ES: "COBRAR",
    },
    YOU_WIN: {
      EN: "You Win",
      DE: "DU GEWINNST",
      NL: "JE WINT",
      FR: "TU GAGNES",
      ES: "GANAS",
    },
    COLLECT_WIN: {
      EN: "Collect Win",
      DE: "GEWINN HOLEN",
      NL: "WINST OPNEMEN",
      FR: "RÉCUPÉRER LE GAIN",
      ES: "RECOGER GANANCIA",
    },
    RAPID_GROWTH: {
      EN: "RAPID GROWTH DETECTED",
      DE: "SCHNELLES WACHSTUM ERKANNT",
      NL: "SNELLE GROEI GEDETECTEERD",
      FR: "CROISSANCE RAPIDE DÉTECTÉE",
      ES: "CRECIMIENTO RÁPIDO DETECTADO",
    },
  };

  constructor() {
    this.initLanguage();
  }

  private mapLanguageToLocale(lang: string): LocalizeKey {
    const mapping: Record<string, LocalizeKey> = {
      en: "EN",
      de: "DE",
      nl: "NL",
      fr: "FR",
      es: "ES",

      EN: "EN",
      DE: "DE",
      NL: "NL",
      FR: "FR",
      ES: "ES",

      zh: "EN",
      hi: "EN",
      ar: "EN",
      ja: "EN",
      pt: "EN",
      auto: "EN",
    };

    return mapping[lang.toLowerCase()] ?? "EN";
  }

  private initLanguage() {
    try {
      // Проверяем наличие LANGUAGE
      if (typeof (window as any).LANGUAGE !== "undefined") {
        const detectedLang = (window as any).LANGUAGE;
        this.currentLang = this.mapLanguageToLocale(detectedLang);
      } else if (typeof LANGUAGE !== "undefined") {
        // Для случаев когда LANGUAGE доступна глобально
        this.currentLang = this.mapLanguageToLocale(LANGUAGE);
      }
    } catch (error) {
      console.warn(
        "Localize: Не удалось определить язык, используется EN",
        error,
      );
      this.currentLang = "EN";
    }
  }

  public setLang(lang: LocalizeKey) {
    this.currentLang = lang;
  }

  public getLang(): LocalizeKey {
    return this.currentLang;
  }

  public t(key: PhraseKey): string {
    const translation = this.dictionary[key]?.[this.currentLang];
    return translation ?? this.dictionary[key]?.EN ?? key;
  }
  public getAvailableLanguages(): LocalizeKey[] {
    return ["EN", "DE", "NL", "FR", "ES"];
  }

  public isLanguageSupported(lang: string): boolean {
    return this.getAvailableLanguages().includes(
      this.mapLanguageToLocale(lang) as LocalizeKey,
    );
  }
}

export const i18n = new Localize();
