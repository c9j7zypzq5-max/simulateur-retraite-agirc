import { describe, it, expect } from "vitest";
import { buildAmortization, mensualite } from "../utils/amortization.js";

describe("buildAmortization", () => {
  const base = { capitalPrincipal: 200_000, taux: 3, dureeAns: 20 };

  it("amortit le capital en totalité sur la durée", () => {
    const a = buildAmortization(base);
    // Dernier point annuel : capital restant quasi nul.
    const last = a.yearly[a.yearly.length - 1];
    expect(last.restant).toBeLessThan(5);
    expect(a.dureeReelleMois).toBe(240);
  });

  it("somme intérêts + capital ≈ total des mensualités versées", () => {
    const a = buildAmortization(base);
    const men = mensualite(200_000, 3, 20);
    const totalVerse = men * 240;
    expect(a.totalInterets + a.capitalTotal).toBeCloseTo(totalVerse, -1);
  });

  it("un versement anticipé réduit les intérêts totaux", () => {
    const sans = buildAmortization(base);
    const avec = buildAmortization({ ...base, prepayments: [{ month: 24, amount: 30_000 }] });
    expect(avec.totalInterets).toBeLessThan(sans.totalInterets);
    expect(avec.economieInterets).toBeGreaterThan(0);
  });

  it("mode durée : raccourcit le prêt ; mode mensualité : conserve la durée", () => {
    const duree = buildAmortization({ ...base, prepayMode: "duree", prepayments: [{ month: 24, amount: 30_000 }] });
    const mens = buildAmortization({ ...base, prepayMode: "mensualite", prepayments: [{ month: 24, amount: 30_000 }] });
    expect(duree.dureeReelleMois).toBeLessThan(240);
    expect(mens.dureeReelleMois).toBe(240);
  });

  it("suivi : capital remboursé + restant = capital total", () => {
    const a = buildAmortization({ ...base, elapsedMonths: 60 });
    expect(a.capitalRembourseAujourdhui + a.capitalRestantAujourdhui).toBeCloseTo(a.capitalTotal, -1);
    expect(a.capitalRestantAujourdhui).toBeLessThan(a.capitalTotal);
  });

  it("gère deux tranches (PTZ) sans dépasser le capital", () => {
    const a = buildAmortization({ capitalPrincipal: 180_000, taux: 3.5, primoCapital: 20_000, primoTaux: 1.95, dureeAns: 25 });
    expect(a.capitalTotal).toBe(200_000);
    expect(a.yearly[0].restant).toBe(200_000);
    expect(a.yearly[a.yearly.length - 1].restant).toBeLessThan(5);
  });
});
