import { NextResponse } from 'next/server'

import did from '../../../services/did'
import doc from './did.json'

export async function GET(request: Request) {
  // TODO: dynamic did document properties do here.
  const revised = did.identifier.replace(doc, doc.id, 'did:web:dune.did.ai')
  return NextResponse.json(revised)
}