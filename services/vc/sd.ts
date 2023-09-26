import crypto from 'crypto'
import { base64url } from 'jose'

import SD from "@transmute/vc-jwt-sd";

import { setIssuer } from './setIssuer';

const salter = () => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  const encoded = base64url.encode(array);
  return encoded
}

const digester =  {
  name: 'sha-256' as 'sha-256',
  digest: async (json: string) => {
    const content = new TextEncoder().encode(json);
    const digest = await crypto.createHash('sha256').update(content).digest();
    return base64url.encode(new Uint8Array(digest));
  }
}

export const issue = async (id: string, disclosable: string): Promise<string> => {
  const secretKeyJwk = JSON.parse(process.env.PRIVATE_KEY_JWK as string)
  const { alg } = secretKeyJwk
  const issuerSigner = await SD.JWS.signer(secretKeyJwk)
  const issuer = new SD.Issuer({
    alg,
    digester,
    signer: issuerSigner,
    salter
  })
  const revised = setIssuer(disclosable, id)
  const sdClaims = SD.YAML.load(revised)
  return issuer.issue({
    claims: sdClaims
  })
}

export const disclose = async (id: string, token: string, disclosure: string) => {
  const secretKeyJwk = JSON.parse(process.env.PRIVATE_KEY_JWK as string)
  const { alg } = secretKeyJwk
  const holder = new SD.Holder({
    alg,
    digester,
  })
  const sdDisclosure = SD.YAML.load(disclosure)
  return holder.present({
    credential: token,
    disclosure: sdDisclosure,
  })
}

export const verify = async (token: string) => {
  const secretKeyJwk = JSON.parse(process.env.PRIVATE_KEY_JWK as string)
  const {d, ...publicKeyJwk} = secretKeyJwk
  const { alg } = publicKeyJwk
  const verifier = new SD.Verifier({
    alg,
    digester,
    verifier: {
      verify: async (token :string) => {
        const parsed = SD.Parse.compact(token)
        const verifier = await SD.JWS.verifier(publicKeyJwk)
        return verifier.verify(parsed.jwt)
      }
    }
  })
  return verifier.verify({
    presentation: token,
  })
}