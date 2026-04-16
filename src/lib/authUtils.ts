export const isTokenExpired = (expirationTime: string): boolean => {
  try {
    const expiryDate = new Date(expirationTime).getTime();
    const now = Date.now();
    return now >= expiryDate;
  } catch {
    // Invalid expiry format, treat as expired
    return true;
  }
};

export const getTokenExpiryStatus = (expirationTime: string): 'valid' | 'expired' | 'unknown' => {
  try {
    const expiryDate = new Date(expirationTime).getTime();
    const now = Date.now();
    return now >= expiryDate ? 'expired' : 'valid';
  } catch {
    return 'unknown';
  }
};
