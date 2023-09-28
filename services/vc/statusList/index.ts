import transmute from "@transmute/did-transmute"
import moment from 'moment'

import { gzip } from 'pako';
import { base64url } from 'jose';

import SD from "@transmute/vc-jwt-sd";
import { issue } from "../sd";
import { kv } from "@vercel/kv";

const encoder = new TextEncoder();

const setVKVBit = async (name: string, size: number, index: number, value: 0 | 1) => {
  const offset = size-1-index;
  await kv.setbit(name, offset, value);
}

const getVKVBitstring = async (name: string)=>{
  let list = await kv.get(name) as string;
  const encoded = encoder.encode(list)
  const compressed = gzip(encoded)
  const serialized = base64url.encode(compressed);
  return serialized
}

export const getStatusList = async (id: string) => {
  const name = 'status-list'
  const size = 8;
  const purpose = 'revocation'
  // we will flip a coin for the sake of testability...
  const bit = Math.random() > .5 ? 0 : 1;
  setVKVBit(name, size, 0, bit)
  const encodedList = await getVKVBitstring(name)
  const claimset = await transmute.w3c.vc.StatusList.create({
    id,
    length: size,
    purpose: purpose
  })
  claimset.issuer = { id: 'did:web:dune.did.ai' }
  claimset.validFrom = moment().toISOString()
  claimset.credentialSubject.encodedList = encodedList
  const disclosable = SD.YAML.dumps(claimset)
  const token = await issue(claimset.issuer.id, disclosable)
  return token
}

const statusList = { getStatusList }

export default statusList