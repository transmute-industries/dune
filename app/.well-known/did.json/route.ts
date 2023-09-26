import { NextResponse } from 'next/server'

import doc from './did.json'

export async function GET(request: Request) {
  // dynamic did document properties can happen here.
  return NextResponse.json(doc)
}