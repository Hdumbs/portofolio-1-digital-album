import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getSessionFromCookies } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookies();
    const body = await request.json();
    const { targetType, adminSecretPassword, data } = body;

    // Admin Verification & Master Secret Password Check
    if (session?.role !== 'admin') {
      return NextResponse.json({ error: 'Akses ditolak (Hanya Admin)' }, { status: 403 });
    }

    if (!adminSecretPassword) {
      return NextResponse.json({ error: 'Password verifikasi admin wajib diisi' }, { status: 400 });
    }

    // Verify admin secret password against DB admin or master default
    const adminUser = await prisma.adminUser.findFirst({ where: { role: 'admin' } });
    let isValidPassword = adminSecretPassword === 'admin123' || adminSecretPassword === 'admin';

    if (adminUser && adminUser.password) {
      const match = await bcrypt.compare(adminSecretPassword, adminUser.password);
      if (match) isValidPassword = true;
    }

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Password Verifikasi Admin Salah!' }, { status: 401 });
    }

    // CREATE NEW ADMIN
    if (targetType === 'admin') {
      const { nip, name, password } = data;
      if (!nip || !name || !password) {
        return NextResponse.json({ error: 'NIP, Nama, dan Password Admin wajib diisi' }, { status: 400 });
      }

      const existing = await prisma.adminUser.findUnique({ where: { nip } });
      if (existing) {
        return NextResponse.json({ error: `Admin dengan NIP "${nip}" sudah terdaftar` }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = await prisma.adminUser.create({
        data: {
          nip,
          name,
          password: hashedPassword,
          role: 'admin',
        },
      });

      return NextResponse.json({
        success: true,
        message: `Admin baru ${newAdmin.name} (${newAdmin.nip}) berhasil ditambahkan!`,
      });
    }

    // CREATE NEW STUDENT
    if (targetType === 'student') {
      const { nisn, name, password, classId, academicYearId, isClassLeader } = data;
      if (!nisn || !name || !classId || !academicYearId) {
        return NextResponse.json({ error: 'NISN, Nama Siswa, Kelas, dan Tahun Ajaran wajib diisi' }, { status: 400 });
      }

      const existing = await prisma.student.findUnique({ where: { nisn } });
      if (existing) {
        return NextResponse.json({ error: `Siswa dengan NISN "${nisn}" sudah terdaftar` }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(password || '123456', 10);
      const newStudent = await prisma.student.create({
        data: {
          nisn,
          name,
          password: hashedPassword,
          classId,
          academicYearId,
          avatar: '',
          isClassLeader: Boolean(isClassLeader),
        },
      });

      return NextResponse.json({
        success: true,
        message: `Siswa baru ${newStudent.name} (NISN: ${newStudent.nisn}) berhasil ditambahkan!`,
      });
    }

    return NextResponse.json({ error: 'Tipe pembuatan user tidak valid' }, { status: 400 });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSessionFromCookies();
    if (session?.role !== 'admin') {
      return NextResponse.json({ error: 'Akses ditolak (Hanya Admin)' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json({ error: 'ID Siswa diperlukan' }, { status: 400 });
    }

    await prisma.student.delete({ where: { id: studentId } });
    return NextResponse.json({ success: true, message: 'Siswa berhasil dihapus dari database.' });
  } catch (error) {
    console.error('Delete student error:', error);
    return NextResponse.json({ error: 'Gagal menghapus siswa' }, { status: 500 });
  }
}
