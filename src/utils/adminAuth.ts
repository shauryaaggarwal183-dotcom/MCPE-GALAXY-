export async function verifyAdminPassword(inputPassword: string): Promise<boolean> {
  const trimmed = inputPassword.trim();
  if (!trimmed) return false;

  // 1. Try backend server verification
  try {
    const response = await fetch('/api/admin/verify-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: trimmed })
    });

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      if (data && typeof data.success === 'boolean') {
        return data.success;
      }
    }
  } catch {
    // Endpoint unavailable or returning non-JSON (e.g. static hosting)
  }

  // 2. Cryptographic hash verification fallback for static deployments
  try {
    const msgUint8 = new TextEncoder().encode(trimmed);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // SHA-256 hash of default password 'mcpegalaxy123'
    const defaultPasswordHash = '1410675f1338b877141ec96e37ec8641d2e8e4ba3cf2c5789555414bcfc69b38';

    const customEnvPassword = (import.meta as any).env?.VITE_ADMIN_PASSWORD;
    if (customEnvPassword) {
      return trimmed === customEnvPassword;
    }

    return hashHex === defaultPasswordHash;
  } catch {
    return false;
  }
}
