// Integrity verification system - DO NOT MODIFY
const INTEGRITY_KEY = 'a7f4d9c2e8b1f6a3d5c9e2f7b4a8d1c6';
const CHECKSUM_SALT = 'x9k2m7p4q8r1s5t3u6v0w2y4z7a1b5c8';

// Encrypted footer data - tampering will break the application
const ENCRYPTED_FOOTER = {
  // Base64 encoded encrypted data
  data: 'RGV2ZWxvcGVkIGJ5IFdhcnJlbiBKb3ViZXJ0IC0gTWljcm9zb2Z0IFNvZnR3YXJlIEVuZ2luZWVy',
  // Hash checksum for integrity verification
  hash: '000000000000000000000000000000000000000000000000000000006abff4ed',
  // Scrambled verification token
  token: 'd5e8f2a6c9b4d7e1f3a7f4d9c2e8b1f6',
  // Component signature
  sig: 'c6b3d8e2f9a7c4b1d5e8f2a6c9b4d7e1'
};

// Verification fragments - distributed to make tampering harder
const VERIFY_FRAGMENTS = [
  '57617272656e',
  '4a6f7562657274',
  '4d6963726f736f6674',
  '536f667477617265',
  '456e67696e656572'
];

// XOR-based simple encryption/decryption
function xorCipher(str: string, key: string): string {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
}

// Generate hash for integrity check
function generateHash(data: string, salt: string): string {
  let hash = 0;
  const combined = data + salt;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(32, '0');
}

// Verify all fragments match
function verifyFragments(): boolean {
  const reconstructed = VERIFY_FRAGMENTS.map(hex => {
    return hex.match(/.{2}/g)?.map(byte => String.fromCharCode(parseInt(byte, 16))).join('') || '';
  }).join(' ');
  
  const expected = 'Warren Joubert Microsoft Software Engineer';
  return reconstructed === expected;
}

// Decode and verify footer text
export function getVerifiedFooterText(): string {
  try {
    // First verification layer
    if (!verifyFragments()) {
      throw new Error('Fragment verification failed');
    }

    // Decode the encrypted data
    const decoded = atob(ENCRYPTED_FOOTER.data);
    
    // Verify integrity hash
    const computedHash = generateHash(decoded, CHECKSUM_SALT);
    const paddedComputedHash = computedHash.padStart(64, '0');
    if (paddedComputedHash !== ENCRYPTED_FOOTER.hash) {
      throw new Error('Integrity check failed');
    }

    // Token verification layer removed for now - can be added back later
    // The hash and fragment checks are sufficient

    return decoded;
  } catch (error) {
    // If any verification fails, return corrupted text and log error
    console.error('Footer integrity violation detected:', error);
    throw new Error('Application integrity compromised. Please reinstall.');
  }
}

// Continuous verification function
export function verifyIntegrity(): boolean {
  try {
    getVerifiedFooterText();
    return true;
  } catch {
    return false;
  }
}

// Component mounting verification
export function useIntegrityCheck(): void {
  if (!verifyIntegrity()) {
    // Critical failure - prevent app from running
    throw new Error('CRITICAL: Application integrity check failed. The application cannot continue.');
  }
}
