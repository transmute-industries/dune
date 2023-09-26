import { NextResponse } from 'next/server'

import vc from '../../../services/vc'

export type RequestStatusListParameters = {
  params: {
    id: string
  }
}

export async function GET(request: Request, { params }: RequestStatusListParameters) {
  const {id} = params
  try{
    // const doc = await did.web.resolve(id)
    const doc = await vc.statusList.getStatusList(id)
    return NextResponse.json(doc)
  } catch(e){
    return NextResponse.json({type: 'Resolution Failed', detail: 'Resolution Failed' }, {
      status: 500,
    })
  }
}