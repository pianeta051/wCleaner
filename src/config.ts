// Build-time configuration. Vite replaces `import.meta.env.VITE_*` when building.
//
// `VITE_SWITCH_TO_NEW_INFRA=true` switches the app from Amplify to our own
// infrastructure. Anything else (absent, empty, "false"...) keeps Amplify.
export const config = {
  switchToNewInfra: import.meta.env.VITE_SWITCH_TO_NEW_INFRA === "true",
};
