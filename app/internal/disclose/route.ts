import { NextResponse } from 'next/server'

import transmute from '@transmute/verifiable-credentials';

export async function POST(request: Request) {
  const { audience, nonce, token, disclosure } = await request.json();
  const secretKeyJwk = JSON.parse(process.env.PRIVATE_KEY_JWK as string)
  try {
    const disclosedToken = await transmute.vc.sd.holder({
      kid: `did:web:dune.did.ai#${secretKeyJwk.kid}`,
      secretKeyJwk
    })
    .issue({
      audience,
      nonce,
      token,
      disclosure
    })
    return NextResponse.json({ token: disclosedToken })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ type: 'Disclosure Failed', detail: 'Disclosure Failed' }, {
      status: 500,
    })
  }
}