import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // For now, we'll just pass through all requests
  // We'll handle auth checks client-side to avoid crypto issues
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [],
}

