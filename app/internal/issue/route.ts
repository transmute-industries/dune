import { NextResponse } from 'next/server'

import sd from '@transmute/vc-jwt-sd'

export async function POST(request: Request) {
  const disclosable = await request.text();
  const secretKeyJwk = JSON.parse(process.env.PRIVATE_KEY_JWK as string)
  try{
    const token =  await sd.issuer({
      kid: `did:web:dune.did.ai#${secretKeyJwk.kid}`,
      secretKeyJwk
    }).issue({
      claimset: disclosable
    })
    return NextResponse.json({ token })
  } catch(e){
    return NextResponse.json({type: 'Issuance Failed', detail: 'Issuance Failed' }, {
      status: 500,
    })
  }
}