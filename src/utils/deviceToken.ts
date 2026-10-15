const generateUUID = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    return ("" + 1e7 + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: any) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const getOrCreateDeviceToken = (): string => {
  if (typeof window === "undefined") return ""; // SSR safety

  // Step 1: Check if token already exists
  const existingToken = localStorage.getItem("deviceToken");
  if (existingToken) return existingToken;

  // Step 2: Generate new token with fallback support
  const newToken = generateUUID();

  // Step 3: Save to localStorage
  localStorage.setItem("deviceToken", newToken);

  return newToken;
};