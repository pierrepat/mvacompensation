export type FunnelStep =
  | "accident"    // Screen 1: accident type + state
  | "details"     // Screen 2: when + injured?
  | "lawyer"      // Screen 3: have a lawyer?
  | "contact"     // Screen 4: name + phone + email
  | "otp"         // Screen 5: verify phone
  | "thanks";     // Done

export interface FunnelData {
  state: string;
  when: "less_1mo" | "1_6mo" | "6_12mo" | "over_1yr" | "";
  injured: "yes" | "no" | "";
  has_lawyer: "yes" | "no" | "";
  first_name: string;
  last_name: string;
  phone: string;
  phone_e164: string;
  email: string;
  otp: string;
  otp_verified: boolean;
  ip_address: string;
  consent_timestamp: string;
  source: string;
  source_state: string;
  locale: "en" | "es";
  trusted_form_cert_url: string;
}

export interface FunnelContext {
  step: FunnelStep;
  data: FunnelData;
  submitting: boolean;
  error: string;
}

export type FunnelAction =
  | { type: "SET_STEP"; step: FunnelStep }
  | { type: "UPDATE"; field: keyof FunnelData; value: string | boolean }
  | { type: "SET_SUBMITTING"; value: boolean }
  | { type: "SET_ERROR"; error: string };

export const STEP_ORDER: FunnelStep[] = [
  "accident",
  "details",
  "lawyer",
  "contact",
  "otp",
  "thanks",
];

export const STEP_PROGRESS: Record<FunnelStep, number> = {
  accident: 1,
  details: 2,
  lawyer: 3,
  contact: 4,
  otp: 5,
  thanks: 5,
};
