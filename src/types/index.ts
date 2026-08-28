export type Role = 'admin' | 'wali_kelas' | 'class_leader' | 'student' | 'viewer';

export type Level = 'SMP' | 'SMK';

export type Major = 'PPLG' | 'Retail' | 'Project Officer' | 'General';

export interface AcademicYear {
  id: string;
  name: string; // e.g., "2025/2026", "2024/2025"
  isArchived: boolean;
  isActive: boolean;
}

export interface ClassItem {
  id: string;
  name: string; // e.g., "7A", "11 PPLG", "12 Retail"
  level: Level;
  grade: number; // 7, 8, 9 for SMP; 10, 11, 12 for SMK
  major?: Major;
  academicYearId: string;
  homeroomTeacher: string;
  tagline?: string;
  description?: string;
  coverImage?: string;
  classLogo?: string;
  instagramUrl?: string;
  classLeaderId?: string;
  classLeaderName?: string;
}

export interface Student {
  id: string;
  nisn: string;
  name: string;
  classId: string;
  academicYearId: string;
  avatar: string;
  quote: string;
  ambition: string; // Cita-cita
  hobbies: string;
  socialMedia: string;
  email: string;
  phone?: string;
  bio?: string;
  funAward?: string; // e.g. "Ter-Coding Master", "Ter-Estetik UI/UX", "Ter-Solutif"
  isClassLeader?: boolean;
}

export interface ClassPhoto {
  id: string;
  classId: string;
  academicYearId: string;
  uploaderId: string;
  uploaderName: string;
  url: string;
  caption: string;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
}

export interface UserSession {
  role: Role;
  studentId?: string;
  classId?: string; // Bound class for Wali Kelas / Student / Class Leader
  name: string;
  nisnOrNip?: string;
}
