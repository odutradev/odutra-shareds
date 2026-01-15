const INTERNAL_SALT = "x9#mK2$nP!vL8@qR"; 

export const hashPin = async (pin: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const generateSessionSignature = (pinHash: string): string => {
  return btoa(`${pinHash}:${INTERNAL_SALT}`);
};

export const validateSessionSignature = (signature: string | null, correctEnvHash: string): boolean => {
  if (!signature) return false;
  try {
    const decoded = atob(signature);
    const [hash, salt] = decoded.split(':');
    return hash === correctEnvHash && salt === INTERNAL_SALT;
  } catch {
    return false;
  }
};