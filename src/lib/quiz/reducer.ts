import type { FunnelContext, FunnelAction, FunnelData } from "./types";

export const initialData: FunnelData = {
  accident_type: "",
  state: "",
  when: "",
  injured: "",
  has_lawyer: "",
  first_name: "",
  last_name: "",
  phone: "",
  phone_e164: "",
  email: "",
  otp: "",
  otp_verified: false,
  ip_address: "",
  consent_timestamp: "",
  source: "",
  source_state: "",
  locale: "en",
  trusted_form_cert_url: "",
};

export const initialContext: FunnelContext = {
  step: "accident",
  data: initialData,
  submitting: false,
  error: "",
};

export function funnelReducer(
  state: FunnelContext,
  action: FunnelAction
): FunnelContext {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step, error: "" };
    case "UPDATE":
      return {
        ...state,
        data: { ...state.data, [action.field]: action.value },
        error: "",
      };
    case "SET_SUBMITTING":
      return { ...state, submitting: action.value };
    case "SET_ERROR":
      return { ...state, error: action.error, submitting: false };
    default:
      return state;
  }
}
