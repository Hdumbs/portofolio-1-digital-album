import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromCookies } from '@/lib/auth';
import { renderApiExplorerHtml } from '@/lib/apiExplorer';

export async function GET(request: Request) {
  const classes = await prisma.classItem.findMany({
    orderBy: { name: 'asc' },
  });

  const acceptHeader = request.headers.get('accept') || '';
  if (acceptHeader.includes('text/html')) {
    const html = renderApiExplorerHtml({
      title: 'REST API - Daftar Kelas (Classes)',
      endpoint: '/api/classes',
      data: classes,
    });
    return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  return new NextResponse(JSON.stringify(classes, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request: Request) {
  const session = await getSessionFromCookies();
  if (session?.role !== 'admin') {
    return NextResponse.json({ error: 'Akses ditolak (Harus Admin)' }, { status: 403 });
  }

  const body = await request.json();
  const { name, level, grade, major, academicYearId, homeroomTeacher, tagline, description, coverImage, classLogo, instagramUrl } = body;

  if (!name || !level || !academicYearId || !homeroomTeacher) {
    return NextResponse.json({ error: 'Data kelas tidak lengkap' }, { status: 400 });
  }

  const newClass = await prisma.classItem.create({
    data: {
      name,
      level,
      grade: Number(grade) || 10,
      major: major || 'General',
      academicYearId,
      homeroomTeacher,
      tagline: tagline || '',
      description: description || '',
      coverImage: coverImage || '',
      classLogo: classLogo || '',
      instagramUrl: instagramUrl || '',
    },
  });

  return NextResponse.json(newClass);
}

export async function PUT(request: Request) {
  const session = await getSessionFromCookies();
  const body = await request.json();
  const { id, instagramUrl, ...rest } = body;

  if (!id) {
    return NextResponse.json({ error: 'ID Kelas diperlukan' }, { status: 400 });
  }

  const canEditIg = session?.role === 'admin' || (session?.role === 'class_leader' && session?.classId === id);

  if (instagramUrl !== undefined && !canEditIg) {
    return NextResponse.json({ error: 'Akses ditolak (Hanya Admin & Ketua Kelas)' }, { status: 403 });
  }

  if (Object.keys(rest).length > 0 && session?.role !== 'admin') {
    return NextResponse.json({ error: 'Pengeditan data kelas hanya boleh oleh Admin' }, { status: 403 });
  }

  const updatedClass = await prisma.classItem.update({
    where: { id },
    data: {
      ...(instagramUrl !== undefined && { instagramUrl }),
      ...rest,
    },
  });

  return NextResponse.json(updatedClass);
}

export async function DELETE(request: Request) {
  const session = await getSessionFromCookies();
  if (session?.role !== 'admin') {
    return NextResponse.json({ error: 'Akses ditolak (Harus Admin)' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID Kelas diperlukan' }, { status: 400 });
  }

  await prisma.classItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
