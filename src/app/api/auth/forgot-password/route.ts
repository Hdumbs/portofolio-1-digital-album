import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { nisn, newPassword } = await request.json();

    if (!nisn || !newPassword) {
      return NextResponse.json({ error: 'NISN dan Password Baru wajib diisi' }, { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: { nisn: nisn.trim() },
      include: { classItem: true },
    });

    if (!student) {
      return NextResponse.json({ error: `Siswa dengan NISN "${nisn}" tidak ditemukan` }, { status: 404 });
    }

    // Check if there is already a pending reset request
    const existingRequest = await prisma.passwordResetRequest.findFirst({
      where: {
        studentId: student.id,
        status: 'pending',
      },
    });

    if (existingRequest) {
      return NextResponse.json({ error: 'Permintaan riset password Anda sudah terdaftar dan sedang menunggu persetujuan Admin/Wali Kelas.' }, { status: 400 });
    }

    const resetRequest = await prisma.passwordResetRequest.create({
      data: {
        studentId: student.id,
        studentName: student.name,
        nisn: student.nisn,
        className: student.classItem?.name || 'Utama',
        newPassword: newPassword.trim(),
        status: 'pending',
      },
    });

    return NextResponse.json({
      success: true,
      message: `Permintaan riset password untuk ${student.name} berhasil terkirim. Harap hubungi Admin / Wali Kelas untuk konfirmasi persetujuan!`,
      request: resetRequest,
    });
  } catch (error) {
    console.error('Forgot password request error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
