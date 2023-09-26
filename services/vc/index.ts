import { issue, disclose, verify } from "./sd"
import { setIssuer } from './setIssuer'

import statusList from "./statusList"

const vc = { statusList, setIssuer, issue, disclose, verify }

export default vc
