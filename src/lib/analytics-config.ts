export const GOOGLE_MEASUREMENT_ID = "G-RZY47VR9T3";
export const GOOGLE_TAG_ID = "GT-TWR922VZ";

const configuredGtmId = import.meta.env.VITE_GTM_ID?.trim() ?? "";

export const GOOGLE_TAG_MANAGER_ID = /^GTM-[A-Z0-9]+$/.test(configuredGtmId) ? configuredGtmId : "";
