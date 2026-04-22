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

  public setLang(lang: LocalizeKey) {
    this.currentLang = lang;
  }

  public getLang(): LocalizeKey {
    return this.currentLang;
  }

  public t(key: PhraseKey): string {
    return this.dictionary[key][this.currentLang] ?? this.dictionary[key].EN;
  }
}

export const i18n = new Localize();
