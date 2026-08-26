import { NextResponse } from 'next/server';
import { getCookieName } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(getCookieName(), '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });
  return response;
}
