"use client";

/**
 * Encryption utilities for securely storing sensitive data
 * Uses Web Crypto API for secure encryption/decryption
 */

const ENCRYPTION_KEY = 'genspecs_key_v1';

/**
 * Encrypts a string using AES-GCM
 */
export async function encrypt(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  // Derive key from constant
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(ENCRYPTION_KEY),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );

  // Combine salt + iv + encrypted data
  const encryptedArray = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  encryptedArray.set(salt, 0);
  encryptedArray.set(iv, salt.length);
  encryptedArray.set(new Uint8Array(encrypted), salt.length + iv.length);

  // Convert to base64 without spread operator
  return btoa(Array.from(encryptedArray).map(byte => String.fromCharCode(byte)).join(''));
}

/**
 * Decrypts an encrypted string using AES-GCM
 */
export async function decrypt(encryptedText: string): Promise<string> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  
  // Convert base64 to array
  const encryptedArray = new Uint8Array(
    atob(encryptedText).split('').map(char => char.charCodeAt(0))
  );

  // Extract salt, iv and encrypted data
  const salt = encryptedArray.slice(0, 16);
  const iv = encryptedArray.slice(16, 28);
  const data = encryptedArray.slice(28);

  // Derive key from constant
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(ENCRYPTION_KEY),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );

  return decoder.decode(decrypted);
} 