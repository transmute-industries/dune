import { NextResponse } from 'next/server'
import { kv } from "@vercel/kv";
import moment from 'moment'
import transmute from '@transmute/verifiable-credentials'



export type RequestStatusListParameters = {
  params: {
    id: string
  }
}

export type RequestStatusUpdate = {
  position: number
  value: 0 | 1
}

const size = 8;

export async function GET(request: Request, { params }: RequestStatusListParameters) {
  const { id } = params
  try{
    const secretKeyJwk = JSON.parse(process.env.PRIVATE_KEY_JWK as string)
    const {d, ...publicKeyJwk} = secretKeyJwk
      const currentList = await kv.get(id)
      const statusListVc = await transmute.vc.sd.issuer({
        kid:  `did:web:dune.did.ai#${publicKeyJwk.kid}`,
        secretKeyJwk 
      })
      .issue({
        claimset: await transmute.vc.sl.create({
          id,
          purpose: 'revocation',
          issuer: 'did:web:dune.did.ai',
          validFrom: moment().toISOString(),
          validUntil: moment().add(1, 'year').toISOString(),
          encodedList: currentList as string
        })
      })
    return NextResponse.json(statusListVc)
  } catch(e){
    console.error(e)
    return NextResponse.json({type: 'Resolution Failed', detail: 'Resolution Failed' }, {
      status: 500,
    })
  }
}

export async function PATCH(request: Request, { params }: RequestStatusListParameters) {
  const { id } = params
  try {
    const secretKeyJwk = JSON.parse(process.env.PRIVATE_KEY_JWK as string)
    const {d, ...publicKeyJwk} = secretKeyJwk
    const { position, value } = await request.json() as RequestStatusUpdate
    let existingList = await kv.get(id)
    
    if (!existingList || `${existingList}`.trim() === ''){
      console.log('initialized as empty list.')
      const emptyList = await transmute.vc.sl.bs(size)
        .encode()
      await kv.set(id, emptyList)
      existingList = emptyList
    }
    // update compressed bitstring.
    const updatedList = await transmute.vc.sl.bs(existingList as string)
      .set(position, value === 1)
      .encode()
    await kv.set(id, updatedList)
    const statusListVc = await transmute.vc.sd.issuer({
      kid:  `did:web:dune.did.ai#${publicKeyJwk.kid}`,
      secretKeyJwk 
    })
    .issue({
      claimset: await transmute.vc.sl.create({
        id,
        purpose: 'revocation',
        issuer: 'did:web:dune.did.ai',
        validFrom: moment().toISOString(),
        validUntil: moment().add(1, 'year').toISOString(),
        encodedList: existingList as string
      })
    })
    return NextResponse.json(statusListVc)
  } catch(e){
    console.error(e)
    return NextResponse.json({type: 'Resolution Failed', detail: 'Resolution Failed' }, {
      status: 500,
    })
  }
}