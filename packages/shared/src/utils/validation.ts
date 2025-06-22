export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s-()]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

export function isValidBarcode(barcode: string): boolean {
  // Basic validation for common barcode formats
  const barcodeRegex = /^[0-9A-Za-z-]+$/;
  return barcodeRegex.test(barcode) && barcode.length >= 8;
}

export function isValidSKU(sku: string): boolean {
  // SKU format: alphanumeric with optional hyphens
  const skuRegex = /^[A-Za-z0-9-]+$/;
  return skuRegex.test(sku) && sku.length >= 3;
}

export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (password.length < 8) feedback.push('Password must be at least 8 characters');
  if (!/[a-z]/.test(password)) feedback.push('Include lowercase letters');
  if (!/[A-Z]/.test(password)) feedback.push('Include uppercase letters');
  if (!/\d/.test(password)) feedback.push('Include numbers');
  if (!/[^A-Za-z0-9]/.test(password)) feedback.push('Include special characters');

  return {
    isValid: password.length >= 8,
    score: Math.min(score / 6, 1),
    feedback,
  };
}