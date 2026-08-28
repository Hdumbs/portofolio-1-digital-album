import { AcademicYear, ClassItem, Student, ClassPhoto } from '@/types';

export const INITIAL_ACADEMIC_YEARS: AcademicYear[] = [
  { id: 'ay-2025-2026', name: 'Tahun Ajaran 2025/2026', isArchived: false, isActive: true },
  { id: 'ay-2024-2025', name: 'Tahun Ajaran 2024/2025', isArchived: true, isActive: false },
  { id: 'ay-2023-2024', name: 'Tahun Ajaran 2023/2024', isArchived: true, isActive: false },
];

export const INITIAL_CLASSES: ClassItem[] = [
  // Active Year 2025/2026
  {
    id: 'class-11-pplg-25',
    name: '11 PPLG',
    level: 'SMK',
    grade: 11,
    major: 'PPLG',
    academicYearId: 'ay-2025-2026',
    homeroomTeacher: 'Bu Rani, S.Kom',
    tagline: 'Coding today, transforming tomorrow.',
    description: 'Kelas unggulan SMK Skye jurusan Pengembangan Perangkat Lunak & Gim. Berfokus pada mobile & web development.',
    classLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    instagramUrl: 'https://instagram.com/11pplg.skye',
    classLeaderId: 'std-dimas',
    classLeaderName: 'Dimas Anggara (Ketua Kelas)',
  },
  {
    id: 'class-10-retail-25',
    name: '10 Retail',
    level: 'SMK',
    grade: 10,
    major: 'Retail',
    academicYearId: 'ay-2025-2026',
    homeroomTeacher: 'Pak Agus, M.M',
    tagline: 'Mastering modern digital commerce.',
    description: 'Generasi muda pencipta ekosistem bisnis digital dan e-commerce modern SMK Skye Digitalpreneur.',
    classLogo: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
    instagramUrl: 'https://instagram.com/10retail.skye',
    classLeaderId: 'std-anisa',
    classLeaderName: 'Anisa Putri (Ketua Kelas)',
  },
  {
    id: 'class-12-po-25',
    name: '12 Project Officer',
    level: 'SMK',
    grade: 12,
    major: 'Project Officer',
    academicYearId: 'ay-2025-2026',
    homeroomTeacher: 'Bu Maya, S.T',
    tagline: 'Leading innovation & managing future projects.',
    description: 'Para manajer proyek masa depan yang dilatih mengeksekusi ide kreatif menjadi produk nyata.',
    classLogo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    instagramUrl: 'https://instagram.com/12po.skye',
    classLeaderId: 'std-bintang',
    classLeaderName: 'Bintang Utama (Ketua Kelas)',
  },
  {
    id: 'class-7a-25',
    name: '7A Skye Junior',
    level: 'SMP',
    grade: 7,
    major: 'General',
    academicYearId: 'ay-2025-2026',
    homeroomTeacher: 'Pak Hendra, S.Pd',
    tagline: 'Awal langkah generasi digital unggul.',
    description: 'Siswa kelas 7 SMP Skye yang aktif, penuh semangat, dan antusias menyambut dunia digital.',
    classLogo: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    instagramUrl: 'https://instagram.com/7a.skyejunior',
  },
  {
    id: 'class-9b-25',
    name: '9B Skye Leader',
    level: 'SMP',
    grade: 9,
    major: 'General',
    academicYearId: 'ay-2025-2026',
    homeroomTeacher: 'Bu Dewi, M.Pd',
    tagline: 'Siap melangkah ke jenjang masa depan.',
    description: 'Angkatan senior SMP Skye yang siap melanjutkan prestasi ke jenjang SMA/SMK.',
    classLogo: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    instagramUrl: 'https://instagram.com/9b.skyeleader',
  },

  // Archived Year 2024/2025
  {
    id: 'class-12-pplg-24',
    name: '12 PPLG (Alumni 2025)',
    level: 'SMK',
    grade: 12,
    major: 'PPLG',
    academicYearId: 'ay-2024-2025',
    homeroomTeacher: 'Bu Rani, S.Kom',
    tagline: 'Angkatan Perintis Software Engineer Skye.',
    description: 'Alumni lulusan angkatan 2025 jurusan PPLG SMK Skye Digitalpreneur.',
    classLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    instagramUrl: 'https://instagram.com/alumni12pplg2025',
  }
];

export const INITIAL_STUDENTS: Student[] = [];

export const INITIAL_PHOTOS: ClassPhoto[] = [];
