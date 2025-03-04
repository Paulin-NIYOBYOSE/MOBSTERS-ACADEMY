// This is a simplified version for demonstration
// In production, use a proper encryption library like iron-session

export function encrypt(data: string): string {
    // In a real app, use proper encryption
    // This is just for demo purposes
    return Buffer.from(data).toString("base64")
  }
  
  export function decrypt(data: string): string {
    // In a real app, use proper decryption
    // This is just for demo purposes
    return Buffer.from(data, "base64").toString()
  }
  
  // Middleware to protect routes
  export function requireAuth(request: Request) {
    const cookie = request.headers.get("cookie")
    if (!cookie || !cookie.includes("session=")) {
      return false
    }
    return true
  }
  
  