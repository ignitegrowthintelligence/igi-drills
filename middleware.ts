import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const secret = process.env.NEXT_PUBLIC_DRILLS_API_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Server auth not configured' }, { status: 500 });
  }
  if (req.headers.get('x-igi-auth') !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.next();
}

export const config = { matcher: '/api/:path*' };
