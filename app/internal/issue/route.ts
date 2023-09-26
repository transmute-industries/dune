import { NextResponse } from 'next/server'

import vc from '../../../services/vc'

export async function POST(request: Request) {
  const issuer = 'did:web:dune.did.ai'
  const disclosable = await request.text();
  try{
    const token =  await vc.issue(issuer, disclosable)
    return NextResponse.json({ token })
  } catch(e){
    return NextResponse.json({type: 'Issuance Failed', detail: 'Issuance Failed' }, {
      status: 500,
    })
  }
}