import { NextResponse } from 'next/server'

import transmute from '@transmute/verifiable-credentials'

export async function POST(request: Request) {
  const disclosable = await request.text();
  const secretKeyJwk = JSON.parse(process.env.PRIVATE_KEY_JWK as string)
  const {d, ...publicKeyJwk} = secretKeyJwk
  try{
    const token =  await transmute.vc.sd.issuer({
      kid: `did:web:dune.did.ai#${secretKeyJwk.kid}`,
      secretKeyJwk,
    }).issue({
      holder: publicKeyJwk,
      claimset: disclosable
    })
  
    return NextResponse.json({ token })
  } catch(e){
    return NextResponse.json({type: 'Issuance Failed', detail: 'Issuance Failed' }, {
      status: 500,
    })
  }
}