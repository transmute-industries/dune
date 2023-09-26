import { NextResponse } from 'next/server'

import doc from './did.json'

export async function GET(request: Request) {
  // TODO: dynamic did document properties do here.
  return NextResponse.json(doc)
}