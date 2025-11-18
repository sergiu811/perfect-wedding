/**
 * Message Encryption Utility
 * 
 * Uses AES-256-GCM encryption for message content
 * Key is derived from conversation ID + user's auth ID
 * 
 * Note: This provides encryption at rest in the database, but the encryption key
 * is derived from known values. For true E2E encryption, you would need to
 * implement a proper key exchange protocol (like Signal Protocol or similar).
 */

// Convert string to ArrayBuffer
function str2ab(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

// Convert ArrayBuffer to string
function ab2str(buf: ArrayBuffer): string {
  return String.fromCharCode.apply(null, Array.from(new Uint8Array(buf)));
}

// Convert ArrayBuffer to base64
function ab2base64(buffer: ArrayBuffer): string {
  const binary = ab2str(buffer);
  return btoa(binary);
}

// Convert base64 to ArrayBuffer
function base642ab(base64: string): ArrayBuffer {
  const binary = atob(base64);
  return str2ab(binary);
}

/**
 * Derive encryption key from conversation ID
 * Using conversation ID only ensures both parties can encrypt/decrypt messages
 * In production, use a proper key derivation function and secure key storage
 */
async function deriveKey(conversationId: string): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(conversationId),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode("perfect-wedding-salt"), // In production, use a random salt
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypt a message
 * Returns base64 encoded string: "iv:encryptedData"
 * Uses conversation ID only for key derivation so both parties can decrypt
 */
export async function encryptMessage(
  message: string,
  conversationId: string
): Promise<string> {
  try {
    const key = await deriveKey(conversationId);
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for GCM
    
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      new TextEncoder().encode(message)
    );

    // Return format: "iv:encryptedData" (both base64 encoded)
    return `${ab2base64(iv)}:${ab2base64(encrypted)}`;
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt message");
  }
}

/**
 * Decrypt a message
 * Expects format: "iv:encryptedData" (both base64 encoded)
 * Uses conversation ID only for key derivation so both parties can decrypt
 */
export async function decryptMessage(
  encryptedMessage: string,
  conversationId: string
): Promise<string> {
  try {
    const [ivBase64, encryptedBase64] = encryptedMessage.split(":");
    if (!ivBase64 || !encryptedBase64) {
      throw new Error("Invalid encrypted message format");
    }

    const key = await deriveKey(conversationId);
    const iv = base642ab(ivBase64);
    const encrypted = base642ab(encryptedBase64);

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encrypted
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error("Decryption error:", error);
    // Return a placeholder if decryption fails
    return "[Encrypted message - unable to decrypt]";
  }
}

/**
 * Check if a message is encrypted (contains ":" separator)
 */
export function isEncrypted(message: string): boolean {
  return message.includes(":") && message.split(":").length === 2;
}

