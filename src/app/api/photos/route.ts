import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromCookies } from '@/lib/auth';
import { renderApiExplorerHtml } from '@/lib/apiExplorer';

export async function GET(request: Request) {
  const photos = await prisma.classPhoto.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const acceptHeader = request.headers.get('accept') || '';
  if (acceptHeader.includes('text/html')) {
    const html = renderApiExplorerHtml({
      title: 'REST API - Galeri Foto Momen (Class Photos)',
      endpoint: '/api/photos',
      data: photos,
    });
    return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  return new NextResponse(JSON.stringify(photos, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request: Request) {
  const session = await getSessionFromCookies();
  
  if (!session || (session.role !== 'student' && session.role !== 'class_leader' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Akses ditolak (Harus Siswa / Admin)' }, { status: 403 });
  }

  const { classId, academicYearId, url, caption } = await request.json();

  if (!classId || !url || !caption) {
    return NextResponse.json({ error: 'Data foto tidak lengkap' }, { status: 400 });
  }

  if (session.role !== 'admin' && session.classId !== classId) {
    return NextResponse.json({ error: '403 Forbidden: Anda hanya bisa upload foto ke kelas Anda sendiri!' }, { status: 403 });
  }

  const newPhoto = await prisma.classPhoto.create({
    data: {
      classId,
      academicYearId,
      uploaderId: session.studentId || 'admin-system',
      uploaderName: session.name,
      url,
      caption,
      status: 'pending',
    },
  });

  return NextResponse.json(newPhoto);
}

export async function PUT(request: Request) {
  const session = await getSessionFromCookies();
  const { id, status } = await request.json();

  if (!id || !status) {
    return NextResponse.json({ error: 'ID dan status foto diperlukan' }, { status: 400 });
  }

  const targetPhoto = await prisma.classPhoto.findUnique({ where: { id } });
  if (!targetPhoto) {
    return NextResponse.json({ error: 'Foto tidak ditemukan' }, { status: 404 });
  }

  const canModerate =
    session?.role === 'admin' ||
    (session?.role === 'wali_kelas' && session?.classId === targetPhoto.classId);

  if (!canModerate) {
    return NextResponse.json({ error: 'Akses ditolak (Moderasi Hanya oleh Admin / Wali Kelas Ybs)' }, { status: 403 });
  }

  const updatedPhoto = await prisma.classPhoto.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(updatedPhoto);
}

export async function DELETE(request: Request) {
  const session = await getSessionFromCookies();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID Foto diperlukan' }, { status: 400 });
  }

  const photo = await prisma.classPhoto.findUnique({ where: { id } });
  if (!photo) {
    return NextResponse.json({ error: 'Foto tidak ditemukan' }, { status: 404 });
  }

  if (session?.role !== 'admin' && session?.studentId !== photo.uploaderId) {
    return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
  }

  await prisma.classPhoto.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
