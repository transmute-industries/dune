import moment from 'moment'
import { NextResponse } from 'next/server'

import transmute from '@transmute/verifiable-credentials'

export async function GET(request: Request) {
  const secretKeyJwk = JSON.parse(process.env.PRIVATE_KEY_JWK as string)
  const iat = moment().subtract(1, 'second').unix()
  const exp = moment().add(5, 'minutes').unix()
  const claimset = `
iss: "did:web:dune.did.ai"
aud: "https://dune.did.ai"
iat: ${iat}
exp: ${exp}
  `.trim()
  const token =  await transmute.vc.sd.issuer({
    kid: `did:web:dune.did.ai#${secretKeyJwk.kid}`,
    secretKeyJwk,
  }).issue({
    claimset
  })

  const newHeaders = new Headers(request.headers)
  newHeaders.set('Content-Type', 'application/sd-jwt')
  return new NextResponse(Buffer.from(token),  {
    // New request headers
    headers: newHeaders,
  })
}

// forces the route handler to be dynamic
export const dynamic = "force-dynamic";