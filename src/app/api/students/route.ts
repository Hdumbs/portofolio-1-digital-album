import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionFromCookies } from '@/lib/auth';
import { renderApiExplorerHtml } from '@/lib/apiExplorer';

export async function GET(request: Request) {
  const students = await prisma.student.findMany({
    select: {
      id: true,
      nisn: true,
      name: true,
      classId: true,
      academicYearId: true,
      avatar: true,
      quote: true,
      ambition: true,
      hobbies: true,
      socialMedia: true,
      email: true,
      phone: true,
      bio: true,
      funAward: true,
      isClassLeader: true,
    },
  });

  const acceptHeader = request.headers.get('accept') || '';
  if (acceptHeader.includes('text/html')) {
    const html = renderApiExplorerHtml({
      title: 'REST API - Biodata Siswa (Students)',
      endpoint: '/api/students',
      data: students,
    });
    return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  return new NextResponse(JSON.stringify(students, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function PUT(request: Request) {
  const session = await getSessionFromCookies();
  const body = await request.json();
  const { id, name, avatar, quote, ambition, hobbies, socialMedia, email, phone, bio, funAward } = body;

  if (!id) {
    return NextResponse.json({ error: 'ID Siswa diperlukan' }, { status: 400 });
  }

  if (session?.role !== 'admin' && session?.studentId !== id) {
    return NextResponse.json({ error: '403 Forbidden: Anda hanya bisa mengedit biodata milik Anda sendiri!' }, { status: 403 });
  }

  const updatedStudent = await prisma.student.update({
    where: { id },
    data: {
      ...(name && { name }),
      ...(avatar && { avatar }),
      ...(quote !== undefined && { quote }),
      ...(ambition !== undefined && { ambition }),
      ...(hobbies !== undefined && { hobbies }),
      ...(socialMedia !== undefined && { socialMedia }),
      ...(email !== undefined && { email }),
      ...(phone !== undefined && { phone }),
      ...(bio !== undefined && { bio }),
      ...(funAward !== undefined && { funAward }),
    },
  });

  return NextResponse.json(updatedStudent);
}
