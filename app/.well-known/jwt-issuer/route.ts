import { NextResponse } from 'next/server'



export async function GET(request: Request) {
  const issuerMetadata = {
    "issuer": "did:web:dune.did.ai",
    "jwks_uri": "https://dune.did.ai/.well-known/jwks"
    }
  return NextResponse.json(issuerMetadata)
}