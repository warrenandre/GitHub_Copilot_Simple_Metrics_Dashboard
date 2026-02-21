import CryptoJS from 'crypto-js'

// Generate a unique secret key for this browser instance
// This is stored in localStorage to maintain consistency across sessions
const getSecretKey = (): string => {
  const STORAGE_KEY = 'app_encryption_key'
  let secretKey = localStorage.getItem(STORAGE_KEY)
  
  if (!secretKey) {
    // Generate a random secret key on first use
    secretKey = CryptoJS.lib.WordArray.random(256 / 8).toString()
    localStorage.setItem(STORAGE_KEY, secretKey)
  }
  
  return secretKey
}

/**
 * Encrypts a string using AES encryption
 * @param text - The plain text to encrypt
 * @returns The encrypted text as a string
 */
export const encrypt = (text: string): string => {
  if (!text) return ''
  
  try {
    const secretKey = getSecretKey()
    const encrypted = CryptoJS.AES.encrypt(text, secretKey)
    return encrypted.toString()
  } catch (error) {
    console.error('Encryption error:', error)
    return text // Fallback to plain text if encryption fails
  }
}

/**
 * Decrypts an AES encrypted string
 * @param encryptedText - The encrypted text to decrypt
 * @returns The decrypted plain text
 */
export const decrypt = (encryptedText: string): string => {
  if (!encryptedText) return ''
  
  try {
    const secretKey = getSecretKey()
    const decrypted = CryptoJS.AES.decrypt(encryptedText, secretKey)
    const plainText = decrypted.toString(CryptoJS.enc.Utf8)
    
    // If decryption results in empty string, the text might not be encrypted
    if (!plainText && encryptedText) {
      console.warn('Decryption returned empty - text may not be encrypted')
      return encryptedText
    }
    
    return plainText
  } catch (error) {
    console.error('Decryption error:', error)
    return encryptedText // Fallback to returning the original text
  }
}

/**
 * Encrypts an entire object's sensitive fields
 * @param obj - Object containing fields to encrypt
 * @param fields - Array of field names to encrypt
 * @returns New object with encrypted fields
 */
export const encryptObject = <T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[]
): T => {
  const encrypted = { ...obj }
  
  fields.forEach(field => {
    if (typeof encrypted[field] === 'string') {
      encrypted[field] = encrypt(encrypted[field] as string) as T[keyof T]
    }
  })
  
  return encrypted
}

/**
 * Decrypts an entire object's encrypted fields
 * @param obj - Object containing encrypted fields
 * @param fields - Array of field names to decrypt
 * @returns New object with decrypted fields
 */
export const decryptObject = <T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[]
): T => {
  const decrypted = { ...obj }
  
  fields.forEach(field => {
    if (typeof decrypted[field] === 'string') {
      decrypted[field] = decrypt(decrypted[field] as string) as T[keyof T]
    }
  })
  
  return decrypted
}

/**
 * Resets the encryption key by removing it from localStorage
 * This will generate a new key on next encryption/decryption
 */
export const resetEncryptionKey = (): void => {
  const STORAGE_KEY = 'app_encryption_key'
  localStorage.removeItem(STORAGE_KEY)
}
