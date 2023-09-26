import { NextResponse } from 'next/server'

import vc from '../../../services/vc'


export async function POST(request: Request) {
  const {token} = await request.json();
  try{
    const verification =  await vc.verify(token)
    return NextResponse.json(verification)
  } catch(e){
    return NextResponse.json({type: 'Verification Failed', detail: 'Verification Failed' }, {
      status: 500,
    })
  }
}