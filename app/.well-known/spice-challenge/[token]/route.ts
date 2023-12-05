import moment from 'moment'
import { NextResponse } from 'next/server'

import transmute from '@transmute/verifiable-credentials'

export type PostChallengeTokenParams = {
  token: string
}

export async function POST(request: Request, {params}: { params: PostChallengeTokenParams }) {


  const challenge = params.token;

  const secretKeyJwk = JSON.parse(process.env.PRIVATE_KEY_JWK as string)
  const {d, ...publicKeyJwk} = secretKeyJwk
  let audienceForChallenge = ''
  try {
    const verifiedChallengeToken =  await transmute.vc.sd.verifier({
      resolver: {
        resolve: async (kid: string) => {
          if (kid === `did:web:dune.did.ai#${publicKeyJwk.kid}`){
            return publicKeyJwk
          } 
          throw new Error('Unsupported kid: ' + kid)
        }
      }
    }).verify({
      token: challenge
    })
    const {iss, iat, exp, aud} = verifiedChallengeToken.claimset
    if (iss !== 'did:web:dune.did.ai') {
      throw new Error('Unknown challenge token issuer.')
    }
    const now = moment();
    if (now.isBefore(moment.unix(iat))) {
      throw new Error('Challenge token cannot be issued in the future.')
    }
    if (now.isAfter(moment.unix(exp))) {
      throw new Error('Challenge token cannot be expired in the past.')
    }
    if (aud !== 'https://dune.did.ai') {
      throw new Error('Challenge token must be issued for https://dune.did.ai')
    }
    audienceForChallenge = aud;
  } catch(e){
    console.error(e)
    return NextResponse.json({type: 'Verification Failed', detail: 'Challenge token was not signed for this audience' }, {
      status: 500,
    })
  }

  try {
    const token = await request.json();
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
      audience: audienceForChallenge, 
      nonce: challenge,
      token
    })
    return NextResponse.json({message: "Challenge accepted"})
  } catch(e){
    console.error(e)
    return NextResponse.json({type: 'Verification Failed', detail: 'Verification Failed' }, {
      status: 500,
    })
  }
}

// forces the route handler to be dynamic
export const dynamic = "force-dynamic";