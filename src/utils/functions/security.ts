const INTERNAL_SALT = "x9#mK2$nP!vL8@qR";
const SESSION_DURATION = 1000 * 60 * 60 * 1;

export const MAX_LOGIN_ATTEMPTS = 3;
export const LOCKOUT_DURATION = 1000 * 60 * 5;

export const hashPin = async (pin: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const generateSessionSignature = (pinHash: string): string => {
  const timestamp = Date.now();
  return btoa(`${pinHash}:${timestamp}:${INTERNAL_SALT}`);
};

export const validateSessionSignature = (signature: string | null, correctEnvHash: string): boolean => {
  if (!signature) return false;
  try {
    const decoded = atob(signature);
    const [hash, timestampStr, salt] = decoded.split(':');
    
    if (!hash || !timestampStr || !salt) return false;

    const timestamp = parseInt(timestampStr, 10);
    const isValidTime = Date.now() - timestamp < SESSION_DURATION;
    const isValidHash = hash === correctEnvHash;
    const isValidSalt = salt === INTERNAL_SALT;

    return isValidHash && isValidSalt && isValidTime;
  } catch {
    return false;
  }
};