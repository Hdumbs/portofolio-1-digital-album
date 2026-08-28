'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserSession } from '@/types';
import { LogOut, Shield, UserCheck, Eye, BookOpen, Archive, Lock } from 'lucide-react';

interface HeaderProps {
  session: UserSession | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ session, onLogout }) => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-[#9E9898] text-white border-b border-[#888282] shadow-md backdrop-blur-md w-full">
      <div className="w-full px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="bg-white p-2 rounded-xl border border-gray-200 group-hover:scale-105 transition-all shadow-sm">
            <Image
              src="/logo/Logo-Skye-Digipreneur-School-Landscape-Stroke-207x71.png"
              alt="Skye Digitalpreneur Logo"
              width={150}
              height={50}
              priority
              className="h-9 w-auto object-contain"
            />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center space-x-1">
              <span className="text-[10px] uppercase font-black tracking-widest text-white/90 bg-[#787272] px-2 py-0.5 rounded-md">
                Digital Yearbook
              </span>
            </div>
            <span className="text-sm font-black tracking-tight text-white block mt-0.5">
              Skye Digitalpreneur
            </span>
          </div>
        </Link>

        {/* Navigation Bar */}
        <nav className="flex items-center space-x-1.5 sm:space-x-2.5">
          <Link
            href="/album"
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
              pathname === '/album' || pathname.startsWith('/class/')
                ? 'bg-white text-[#27272A] shadow-md'
                : 'text-white hover:bg-white/20'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Album Aktif</span>
          </Link>

          <Link
            href="/archive"
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
              pathname === '/archive'
                ? 'bg-white text-[#27272A] shadow-md'
                : 'text-white hover:bg-white/20'
            }`}
          >
            <Archive className="w-4 h-4" />
            <span>Arsip Album</span>
          </Link>

          {(session?.role === 'admin' || session?.role === 'wali_kelas') && (
            <Link
              href="/admin"
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all shadow-sm ${
                pathname === '/admin' || pathname.startsWith('/admin/')
                  ? 'bg-[#18181B] text-white ring-2 ring-white/40'
                  : 'bg-[#27272A] text-white hover:bg-[#18181B]'
              }`}
            >
              <Shield className="w-4 h-4 text-white" />
              <span>{session?.role === 'wali_kelas' ? 'Dashboard Wali Kelas' : 'Dashboard Admin'}</span>
            </Link>
          )}

          {(session?.role === 'student' || session?.role === 'class_leader') && (
            <Link
              href="/student"
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all shadow-sm ${
                pathname === '/student'
                  ? 'bg-[#18181B] text-white ring-2 ring-white/40'
                  : 'bg-[#27272A] text-white hover:bg-[#18181B]'
              }`}
            >
              <UserCheck className="w-4 h-4 text-white" />
              <span>Halaman Siswa</span>
            </Link>
          )}
        </nav>

        {/* User Session Bar */}
        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold text-white/80">Status Peran:</span>
            <div className="flex items-center space-x-1 font-black text-xs text-white">
              {session?.role === 'admin' && <Shield className="w-3.5 h-3.5" />}
              {session?.role === 'student' && <UserCheck className="w-3.5 h-3.5" />}
              {session?.role === 'viewer' && <Eye className="w-3.5 h-3.5" />}
              <span className="truncate max-w-[130px]">{session?.name || 'Tamu'}</span>
            </div>
          </div>

          {session?.role !== 'viewer' ? (
            <button
              onClick={onLogout}
              className="flex items-center space-x-1 px-3.5 py-2 rounded-xl text-xs font-black bg-[#27272A] text-white hover:bg-red-700 transition-colors shadow-sm"
              title="Keluar / Ganti Peran"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="flex items-center space-x-1 px-4 py-2 rounded-xl text-xs sm:text-sm font-black bg-[#27272A] text-white hover:bg-[#18181B] transition-all shadow-md"
            >
              <Lock className="w-3.5 h-3.5 text-[#9E9898]" />
              <span>Login Pengguna</span>
            </Link>
          )}
        </div>

      </div>
    </header>
  );
};
