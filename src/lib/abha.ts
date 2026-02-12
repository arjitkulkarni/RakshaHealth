// ABHA ID Generation and Validation Utility

export interface ABHAProfile {
  abhaNumber: string;
  abhaAddress: string;
  name: string;
  dateOfBirth: string;
  gender: 'M' | 'F' | 'O';
  mobile: string;
  email?: string;
  stateCode?: string;
  districtCode?: string;
  isActive: boolean;
  createdAt: string;
}

/**
 * Generate a unique ABHA number (14-digit format)
 * Format: XXXX-XXXX-XXXX (similar to Indian health ID format)
 */
export function generateABHANumber(): string {
  // Generate 14 random digits
  const digits = Array.from({ length: 14 }, () => Math.floor(Math.random() * 10));
  
  // Format as XXXX-XXXX-XXXX
  return `${digits.slice(0, 4).join('')}-${digits.slice(4, 8).join('')}-${digits.slice(8, 12).join('')}${digits.slice(12).join('')}`;
}

/**
 * Generate ABHA address (username-like identifier)
 * Format: Unique username with numbers
 */
export function generateABHAAddress(name: string): string {
  // Clean name: remove spaces and special chars, convert to lowercase
  const cleanName = name.replace(/[^a-zA-Z]/g, '').toLowerCase();
  const randomSuffix = Math.floor(Math.random() * 9999);
  return `${cleanName}${randomSuffix}@abha`;
}

/**
 * Validate ABHA number format
 */
export function validateABHANumber(abhaNumber: string): boolean {
  // Remove any dashes or spaces
  const cleanNumber = abhaNumber.replace(/[-\s]/g, '');
  
  // Check if it's exactly 14 digits
  if (!/^\d{14}$/.test(cleanNumber)) {
    return false;
  }
  
  // Reformat with dashes for consistency
  const formatted = `${cleanNumber.slice(0, 4)}-${cleanNumber.slice(4, 8)}-${cleanNumber.slice(8, 12)}${cleanNumber.slice(12)}`;
  return formatted === abhaNumber.replace(/[-\s]/g, '').match(/(\d{4})(\d{4})(\d{4})(\d{2})/)?.[1] + '-' + 
         cleanNumber.replace(/[-\s]/g, '').match(/(\d{4})(\d{4})(\d{4})(\d{2})/)?.[2] + '-' + 
         cleanNumber.replace(/[-\s]/g, '').match(/(\d{4})(\d{4})(\d{4})(\d{2})/)?.[3] + 
         cleanNumber.replace(/[-\s]/g, '').match(/(\d{4})(\d{4})(\d{4})(\d{2})/)?.[4];
}

/**
 * Validate ABHA address format
 */
export function validateABHAAddress(abhaAddress: string): boolean {
  // Basic validation: should end with @abha and contain alphanumeric characters
  const abhaRegex = /^[a-zA-Z0-9]+@abha$/;
  return abhaRegex.test(abhaAddress);
}

/**
 * Create a complete ABHA profile
 */
export function createABHAProfile(userData: {
  name: string;
  dateOfBirth: string;
  phoneNumber: string;
  gender?: 'M' | 'F' | 'O';
  email?: string;
}): ABHAProfile {
  const abhaNumber = generateABHANumber();
  const abhaAddress = generateABHAAddress(userData.name);
  
  return {
    abhaNumber,
    abhaAddress,
    name: userData.name,
    dateOfBirth: userData.dateOfBirth,
    gender: userData.gender || 'O',
    mobile: userData.phoneNumber,
    email: userData.email,
    isActive: true,
    createdAt: new Date().toISOString()
  };
}

/**
 * Format ABHA number for display
 */
export function formatABHANumber(abhaNumber: string): string {
  const cleanNumber = abhaNumber.replace(/[-\s]/g, '');
  if (cleanNumber.length !== 14) return abhaNumber;
  
  return `${cleanNumber.slice(0, 4)}-${cleanNumber.slice(4, 8)}-${cleanNumber.slice(8, 12)}${cleanNumber.slice(12)}`;
}

/**
 * Mask ABHA number for privacy (show only last 4 digits)
 */
export function maskABHANumber(abhaNumber: string): string {
  const cleanNumber = abhaNumber.replace(/[-\s]/g, '');
  if (cleanNumber.length !== 14) return abhaNumber;
  
  const formatted = formatABHANumber(abhaNumber);
  return formatted.replace(/\d(?=\d{4})/g, 'X');
}

/**
 * Check if ABHA profile is complete and valid
 */
export function validateABHAProfile(profile: ABHAProfile): boolean {
  return (
    validateABHANumber(profile.abhaNumber) &&
    validateABHAAddress(profile.abhaAddress) &&
    profile.name.trim().length > 0 &&
    profile.dateOfBirth.trim().length > 0 &&
    profile.mobile.trim().length > 0 &&
    profile.isActive
  );
}
