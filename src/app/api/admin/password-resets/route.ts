import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getSessionFromCookies } from '@/lib/auth';

export async function GET() {
  const session = await getSessionFromCookies();
  if (session?.role !== 'admin' && session?.role !== 'wali_kelas') {
    return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
  }

  const requests = await prisma.passwordResetRequest.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(requests);
}

export async function PUT(request: Request) {
  try {
    const session = await getSessionFromCookies();
    if (session?.role !== 'admin' && session?.role !== 'wali_kelas') {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { requestId, action } = await request.json(); // action: "approve" | "reject"

    if (!requestId || !action) {
      return NextResponse.json({ error: 'ID Permintaan dan aksi wajib diisi' }, { status: 400 });
    }

    const resetReq = await prisma.passwordResetRequest.findUnique({ where: { id: requestId } });
    if (!resetReq) {
      return NextResponse.json({ error: 'Permintaan riset password tidak ditemukan' }, { status: 404 });
    }

    if (action === 'approve') {
      // Hash new password and update student account
      const hashedPassword = await bcrypt.hash(resetReq.newPassword, 10);
      await prisma.student.update({
        where: { id: resetReq.studentId },
        data: { password: hashedPassword },
      });

      await prisma.passwordResetRequest.update({
        where: { id: requestId },
        data: { status: 'approved' },
      });

      return NextResponse.json({ success: true, message: `Password siswa ${resetReq.studentName} berhasil diubah oleh Admin/Wali Kelas!` });
    }

    if (action === 'reject') {
      await prisma.passwordResetRequest.update({
        where: { id: requestId },
        data: { status: 'rejected' },
      });

      return NextResponse.json({ success: true, message: `Permintaan riset password siswa ${resetReq.studentName} ditolak.` });
    }

    return NextResponse.json({ error: 'Aksi tidak valid' }, { status: 400 });
  } catch (error) {
    console.error('Password reset management error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
