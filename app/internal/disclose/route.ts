import { NextResponse } from 'next/server'

import vc from '../../../services/vc'

export async function POST(request: Request) {
  const holder = 'did:web:dune.did.ai'
  const { token, disclosure } = await request.json();
  console.log(JSON.stringify({token, disclosure}, null, 2))
  try{
    const disclosedToken =  await vc.disclose(holder, token, disclosure)
    return NextResponse.json({ token: disclosedToken })
  } catch(e){
    return NextResponse.json({type: 'Disclosure Failed', detail: 'Disclosure Failed' }, {
      status: 500,
    })
  }
}