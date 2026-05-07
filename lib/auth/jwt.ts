"use server"

// Simple JWT implementation without external dependencies
// Uses HMAC-SHA256 for signing

const JWT_SECRET = process.env.JWT_SECRET || "portfolio-secret-key-change-in-production-32chars"

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, "+").replace(/_/g, "/")
  while (str.length % 4) {
    str += "="
  }
  return Buffer.from(str, "base64").toString("utf8")
}

async function hmacSha256(key: string, message: string): Promise<string> {
  const crypto = await import("crypto")
  const hmac = crypto.createHmac("sha256", key)
  hmac.update(message)
  return hmac.digest("base64url")
}

export interface JWTPayload {
  sub: string
  email: string
  name: string
  role: string
  iat: number
  exp: number
}

export async function signJWT(payload: Omit<JWTPayload, "iat" | "exp">, expiresIn: string = "7d"): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  
  // Parse expiration
  let expSeconds = 7 * 24 * 60 * 60 // default 7 days
  if (expiresIn.endsWith("d")) {
    expSeconds = parseInt(expiresIn) * 24 * 60 * 60
  } else if (expiresIn.endsWith("h")) {
    expSeconds = parseInt(expiresIn) * 60 * 60
  } else if (expiresIn.endsWith("m")) {
    expSeconds = parseInt(expiresIn) * 60
  }

  const fullPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + expSeconds,
  }

  const header = { alg: "HS256", typ: "JWT" }
  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload))
  const signature = await hmacSha256(JWT_SECRET, `${encodedHeader}.${encodedPayload}`)

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) {
      return null
    }

    const [encodedHeader, encodedPayload, signature] = parts
    
    // Verify signature
    const expectedSignature = await hmacSha256(JWT_SECRET, `${encodedHeader}.${encodedPayload}`)
    if (signature !== expectedSignature) {
      return null
    }

    // Decode payload
    const payload: JWTPayload = JSON.parse(base64UrlDecode(encodedPayload))

    // Check expiration
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp < now) {
      return null
    }

    return payload
  } catch {
    return null
  }
}
