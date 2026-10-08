import { describe, it, expect, afterEach, vi } from "vitest";
import { suggestedCurrencyFor, guessCurrencyFromBrowser } from "./currency.js";

afterEach(() => vi.unstubAllGlobals());

describe("suggestedCurrencyFor", () => {
  it("impose la devise de la section pays, quelle que soit la langue du navigateur", () => {
    vi.stubGlobal("navigator", { languages: ["en-US"] });
    expect(suggestedCurrencyFor("/ch/simulateurs/epargne")).toBe("CHF");
    expect(suggestedCurrencyFor("/qc/simulateurs/epargne")).toBe("CAD");
    expect(suggestedCurrencyFor("/lu/simulateurs/epargne")).toBe("EUR");
    expect(suggestedCurrencyFor("/be")).toBe("EUR");
  });

  it("suit la région du navigateur hors section pays", () => {
    vi.stubGlobal("navigator", { languages: ["en-GB"] });
    expect(suggestedCurrencyFor("/en/simulators/savings")).toBe("GBP");
    vi.stubGlobal("navigator", { languages: ["fr-FR"] });
    expect(suggestedCurrencyFor("/simulateurs/epargne")).toBe("EUR");
  });

  it("ne confond pas un segment commençant par un code pays", () => {
    vi.stubGlobal("navigator", { languages: ["fr-FR"] });
    expect(suggestedCurrencyFor("/chroniques")).toBe("EUR");
  });
});

describe("guessCurrencyFromBrowser", () => {
  it("retombe sur la valeur de repli sans indice exploitable", () => {
    vi.stubGlobal("navigator", { languages: ["en"] });
    vi.spyOn(Intl, "DateTimeFormat").mockReturnValue({ resolvedOptions: () => ({ timeZone: "Etc/UTC" }) });
    expect(guessCurrencyFromBrowser("USD")).toBe("USD");
    expect(guessCurrencyFromBrowser()).toBe("EUR");
    vi.restoreAllMocks();
  });
});
