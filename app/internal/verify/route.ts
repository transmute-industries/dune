import { NextResponse } from 'next/server'

import transmute from '@transmute/verifiable-credentials'


export async function POST(request: Request) {
  const { audience, nonce, token } = await request.json();

  const secretKeyJwk = JSON.parse(process.env.PRIVATE_KEY_JWK as string)
  const {d, ...publicKeyJwk} = secretKeyJwk

  try{
    const verification =  await transmute.vc.sd.verifier({
      resolver: {
        resolve: async (kid: string) => {
          if (kid === `did:web:dune.did.ai#${publicKeyJwk.kid}`){
            return publicKeyJwk
          } 
          throw new Error('Unsupported kid: ' + kid)
        }
      }
    }).verify({
      audience, 
      nonce,
      token
    })
    return NextResponse.json(verification)
  } catch(e){
    console.error(e)
    return NextResponse.json({type: 'Verification Failed', detail: 'Verification Failed' }, {
      status: 500,
    })
  }
}