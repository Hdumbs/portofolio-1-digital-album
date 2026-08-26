import { NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ session: { role: 'viewer', name: 'Tamu / Public Viewer' } });
  }
  return NextResponse.json({ session });
}
