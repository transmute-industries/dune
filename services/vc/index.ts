import { issue, disclose, verify } from "./sd"
import { setIssuer } from './setIssuer'

const secretKeyJwk = JSON.parse(process.env.PRIVATE_KEY_JWK as string)
const { d, ...publicKeyJwk } = secretKeyJwk

const issuer = {
  jwks: {
    keys: [publicKeyJwk]
  }
}

const vc = { issuer, setIssuer, issue, disclose, verify }

export default vc
