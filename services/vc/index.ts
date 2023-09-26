import { issue, disclose, verify } from "./sd"
import { setIssuer } from './setIssuer'

const vc = { setIssuer, issue, disclose, verify }

export default vc
