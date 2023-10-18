import yaml from 'yaml'
import * as jose from 'jose'
import moment from 'moment'
import { kv } from "@vercel/kv";
import transmute from '@transmute/verifiable-credentials'
import sd from '@transmute/vc-jwt-sd'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { protectedHeader, claimset } = await request.json();
  const secretKeyJwk = JSON.parse(process.env.PRIVATE_KEY_JWK as string)
  const {d, ...publicKeyJwk} = secretKeyJwk
  try {
    const validator = await transmute.vc.validator({
      issuer: async (token: string)=>{
        const parsed = sd.Parse.compact(token);
        const {kid} = await jose.decodeProtectedHeader(parsed.jwt)
        if (kid?.endsWith(publicKeyJwk.kid)){
          return publicKeyJwk
        }
        throw new Error('Unsupported public key id: ' + kid)
      },
      credentialSchema: async () => {
        // this resolver MUST return application/schema+json
        const schema = `
$id: https://dune.did.ai/schemas/VerifiableCredential.yml
title: W3C Verifiable Credential 
description: A JSON-LD Object of RDF type https://www.w3.org/2018/credentials#VerifiableCredential
type: object
properties:
  '@context':
    type: array
    readOnly: true
    default:
      - https://www.w3.org/ns/credentials/v2
    items:
      - type: string
        const: https://www.w3.org/ns/credentials/v2
    additionalItems:
      type: string
      enum:
        - https://www.w3.org/ns/credentials/examples/v2
        `.trim()

        return JSON.parse(JSON.stringify(yaml.parse(schema)))
      },
      credentialStatus: async (id: string) => {
        // this resolver MUST return application/vc+ld+json+sd-jwt
        if (id.startsWith('https://dune.did.ai/status-list/')){
          let existingList = await kv.get(id.replace('https://dune.did.ai/status-list/', ''))
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
          return statusListVc
        }
        throw new Error('Unsupported status list id: ' + id)
      }
    })
    const validation =  await validator.validate({
      protectedHeader, 
      claimset
    })
    return NextResponse.json(validation)
  } catch(e){
    console.error(e)
    return NextResponse.json({type: 'Validation Failed', detail: 'Validation Failed' }, {
      status: 500,
    })
  }
}