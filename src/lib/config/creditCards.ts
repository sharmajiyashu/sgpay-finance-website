/**
 * Partner credit card offers — product details + apply URLs from CREDIT_CARD_APPLY_URLS.
 * Change the apply link in `env.ts` (or NEXT_PUBLIC_ROAR_CREDIT_CARD_APPLY_URL).
 */

import { CREDIT_CARD_APPLY_URLS } from "@/lib/config/env";

export interface CreditCardPartner {
  id: string;
  name: string;
  bank: string;
  shortDescription: string;
  overview: string;
  applyUrl: string;
  features: string[];
  benefits: string[];
  eligibility: string[];
  documents: string[];
  /** Highlight badges shown on the card */
  highlights?: string[];
}

/** Roar Credit Card (Unity Small Finance Bank / Roarbank) */
export const ROAR_CREDIT_CARD: CreditCardPartner = {
  id: "roar-credit-card",
  name: "Roar Credit Card",
  bank: "Roarbank by Unity Small Finance Bank",
  shortDescription:
    "Lifetime-free RuPay credit card with UPI, up to 20% cashback, and a linked savings account.",
  overview:
    "Roar Credit Card is a 2-in-1 RuPay card that combines a credit line with a savings account and UPI payments in one app. Lifetime free with no joining or annual fee — apply online and submit your details securely.",
  applyUrl: CREDIT_CARD_APPLY_URLS.roar,
  highlights: [
    "Lifetime free",
    "Up to 20% cashback",
    "UPI on credit card",
    "Up to 62 days interest-free",
  ],
  features: [
    "Lifetime free RuPay credit card — no joining or annual fee",
    "Up to 20% cashback on two selected categories every month",
    "Credit + savings + UPI in one 2-in-1 card and app",
    "Interest-free credit period up to 62 days (incl. grace period)",
    "Instant virtual card after approval; physical card delivered to your door",
  ],
  benefits: [
    "Credit limit up to ₹3 lakhs based on profile assessment",
    "Starter limit available for new-to-credit customers",
    "Earn interest on linked Roarbank savings account",
    "Convert spends into EMIs (2–12 months) via the app",
    "Shake to Pay and in-app spend analytics",
  ],
  eligibility: [
    "Indian resident, age 21 to 60 years",
    "Valid PAN and Aadhaar",
    "Salaried or self-employed",
    "New-to-credit applicants may get a starter limit",
  ],
  documents: [
    "PAN Card",
    "Aadhaar Card",
    "Video KYC via the Roarbank app / apply link",
  ],
};

/** All partner credit cards shown on the public Credit Card page */
export const CREDIT_CARD_PARTNERS: CreditCardPartner[] = [ROAR_CREDIT_CARD];

export function getCreditCardPartner(id: string): CreditCardPartner | undefined {
  return CREDIT_CARD_PARTNERS.find((card) => card.id === id);
}
