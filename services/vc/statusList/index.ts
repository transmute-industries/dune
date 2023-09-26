import transmute from "@transmute/did-transmute"
import moment from 'moment'


import SD from "@transmute/vc-jwt-sd";
import { issue } from "../sd";

const length = 8;
const purpose = 'revocation'

export const getStatusList = async (id: string) => {
  // get or create list...
  const claimset = await transmute.w3c.vc.StatusList.create({
    id,
    length,
    purpose
  })
  claimset.issuer = {id: 'did:web:dune.did.ai'}
  claimset.validFrom = moment().toISOString()
  const disclosable = SD.YAML.dumps(claimset)
  return issue(claimset.issuer.id, disclosable)
}

const statusList = { getStatusList }

export default statusList