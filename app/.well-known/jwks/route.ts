import { NextResponse } from 'next/server'


export async function GET(request: Request) {
  const secretKeyJwk = JSON.parse(process.env.PRIVATE_KEY_JWK as string)
  const { d, ...publicKeyJwk } = secretKeyJwk
  const jwks = {
    keys: [publicKeyJwk]
  }
  return NextResponse.json(jwks)
}

// forces the route handler to be dynamic
export const dynamic = "force-dynamic";