import { NextResponse } from 'next/server'

import vc from '../../../services/vc'

export async function GET(request: Request) {
  return NextResponse.json(vc.issuer.jwks())
}

// forces the route handler to be dynamic
export const dynamic = "force-dynamic";