import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const issuerMetadata = {
    "issuer": "did:web:dune.did.ai",
    "jwks_uri": "https://dune.did.ai/.well-known/jwks",
    "audience": "https://dune.did.ai",
    "challenge_endpoint": "https://dune.did.ai/.well-known/spice-challenge"
  }
  return NextResponse.json(issuerMetadata)
}

// forces the route handler to be dynamic
export const dynamic = "force-dynamic";