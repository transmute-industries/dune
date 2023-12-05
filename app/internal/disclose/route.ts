import { NextResponse } from 'next/server'

import transmute from '@transmute/verifiable-credentials';

export async function POST(request: Request) {
  const disclosure = await request.text();
  const url = new URL(request.url)
  const token = url.searchParams.get('token') || ''
  const audience = url.searchParams.get('audience') || ''
  const nonce = url.searchParams.get('nonce') || ''
  const secretKeyJwk = JSON.parse(process.env.PRIVATE_KEY_JWK as string)
  try {
    if (audience !== 'https://dune.did.ai'){
      throw new Error('This demo only supports key binding for itself as the audience.')
    }

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