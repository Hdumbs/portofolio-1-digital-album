import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromCookies } from '@/lib/auth';
import { renderApiExplorerHtml } from '@/lib/apiExplorer';

export async function GET(request: Request) {
  const years = await prisma.academicYear.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const acceptHeader = request.headers.get('accept') || '';
  if (acceptHeader.includes('text/html')) {
    const html = renderApiExplorerHtml({
      title: 'REST API - Tahun Ajaran & Arsip (Academic Years)',
      endpoint: '/api/academic-years',
      data: years,
    });
    return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  return new NextResponse(JSON.stringify(years, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request: Request) {
  const session = await getSessionFromCookies();
  if (session?.role !== 'admin') {
    return NextResponse.json({ error: 'Akses ditolak (Harus Admin)' }, { status: 403 });
  }

  const { name } = await request.json();
  if (!name) {
    return NextResponse.json({ error: 'Nama tahun ajaran wajib diisi' }, { status: 400 });
  }

  const newYear = await prisma.academicYear.create({
    data: {
      name,
      isActive: true,
      isArchived: false,
    },
  });

  return NextResponse.json(newYear);
}

export async function PUT(request: Request) {
  const session = await getSessionFromCookies();
  if (session?.role !== 'admin') {
    return NextResponse.json({ error: 'Akses ditolak (Harus Admin)' }, { status: 403 });
  }

  const { id, isArchived, isActive } = await request.json();

  const updatedYear = await prisma.academicYear.update({
    where: { id },
    data: {
      ...(isArchived !== undefined && { isArchived }),
      ...(isActive !== undefined && { isActive }),
    },
  });

  return NextResponse.json(updatedYear);
}
