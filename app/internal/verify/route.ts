import { NextResponse } from 'next/server'

import sd from '@transmute/vc-jwt-sd'


export async function POST(request: Request) {
  const { token } = await request.json();
  const secretKeyJwk = JSON.parse(process.env.PRIVATE_KEY_JWK as string)
  const {d, ...publicKeyJwk} = secretKeyJwk
  try{
    const verification =  await sd.verifier({
      resolver: {
        resolve: async (kid: string) => {
          if (kid === `did:web:dune.did.ai#${publicKeyJwk.kid}`){
            return publicKeyJwk
          } 
          throw new Error('Unsupported kid: ' + kid)
        }
      }
    }).verify({
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