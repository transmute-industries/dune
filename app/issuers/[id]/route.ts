import { NextResponse } from 'next/server'

import did from '../../../services/did'

export type GetIssuerControllerParams = {
  params: {
    id: string
  }
}

export async function GET(request: Request, { params }: GetIssuerControllerParams) {
  const {id} = params
  try{
    const doc = await did.web.resolve(id)
    return NextResponse.json(doc)
  } catch(e){
    return NextResponse.json({type: 'Resolution Failed', detail: 'Resolution Failed' }, {
      status: 500,
    })
  }
}