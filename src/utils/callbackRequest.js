export function formatCallbackRequest(preview) {
  return [
    "Hospo Hub Prototype Callback Request",
    "------------------------------------",
    "",
    "IMPORTANT: This request has not been submitted to Auckland Council.",
    "",
    ...Object.entries(preview).map(([key, value]) => `${key}: ${value}`),
  ].join("\n");
}
