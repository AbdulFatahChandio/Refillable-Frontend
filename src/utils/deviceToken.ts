export const getOrCreateDeviceToken = (): string => {
  if (typeof window === "undefined") return ""; // SSR safety

  // Step 1: Check if token already exists
  const existingToken = localStorage.getItem("deviceToken");
  if (existingToken) return existingToken;

  // Step 2: Generate new token using crypto.randomUUID()
  const newToken = crypto.randomUUID();

  // Step 3: Save to localStorage
  localStorage.setItem("deviceToken", newToken);

  return newToken;
};