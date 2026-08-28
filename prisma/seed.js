const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Skye Digital Yearbook database...');

  // Reset database tables
  await prisma.classPhoto.deleteMany();
  await prisma.student.deleteMany();
  await prisma.classItem.deleteMany();
  await prisma.academicYear.deleteMany();
  await prisma.adminUser.deleteMany();

  // Create Super Admin Account
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.adminUser.create({
    data: {
      nip: 'admin',
      name: 'Super Admin Sekolah',
      password: adminPassword,
      role: 'admin',
    },
  });

  // Create Academic Years
  const ayActive = await prisma.academicYear.create({
    data: {
      id: 'ay-2025-2026',
      name: 'Tahun Ajaran 2025/2026',
      isArchived: false,
      isActive: true,
    },
  });

  const ayArchived = await prisma.academicYear.create({
    data: {
      id: 'ay-2024-2025',
      name: 'Tahun Ajaran 2024/2025',
      isArchived: true,
      isActive: false,
    },
  });

  // Create Classes
  const class11PPLG = await prisma.classItem.create({
    data: {
      id: 'class-11-pplg-25',
      name: '11 PPLG',
      level: 'SMK',
      grade: 11,
      major: 'PPLG',
      academicYearId: ayActive.id,
      homeroomTeacher: 'Bu Rani, S.Kom',
      tagline: 'Coding today, transforming tomorrow.',
      description: 'Kelas unggulan SMK Skye jurusan Pengembangan Perangkat Lunak & Gim. Berfokus pada mobile & web development.',
      classLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      instagramUrl: 'https://instagram.com/11pplg.skye',
    },
  });

  const class10Retail = await prisma.classItem.create({
    data: {
      id: 'class-10-retail-25',
      name: '10 Retail',
      level: 'SMK',
      grade: 10,
      major: 'Retail',
      academicYearId: ayActive.id,
      homeroomTeacher: 'Pak Agus, M.M',
      tagline: 'Mastering modern digital commerce.',
      description: 'Generasi muda pencipta ekosistem bisnis digital dan e-commerce modern SMK Skye Digitalpreneur.',
      classLogo: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
      instagramUrl: 'https://instagram.com/10retail.skye',
    },
  });

  const class12PO = await prisma.classItem.create({
    data: {
      id: 'class-12-po-25',
      name: '12 Project Officer',
      level: 'SMK',
      grade: 12,
      major: 'Project Officer',
      academicYearId: ayActive.id,
      homeroomTeacher: 'Bu Maya, S.T',
      tagline: 'Leading innovation & managing future projects.',
      description: 'Para manajer proyek masa depan yang dilatih mengeksekusi ide kreatif menjadi produk nyata.',
      classLogo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
      instagramUrl: 'https://instagram.com/12po.skye',
    },
  });

  const class7A = await prisma.classItem.create({
    data: {
      id: 'class-7a-25',
      name: '7A Skye Junior',
      level: 'SMP',
      grade: 7,
      major: 'General',
      academicYearId: ayActive.id,
      homeroomTeacher: 'Pak Hendra, S.Pd',
      tagline: 'Awal langkah generasi digital unggul.',
      description: 'Siswa kelas 7 SMP Skye yang aktif, penuh semangat, dan antusias menyambut dunia digital.',
      classLogo: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=400&q=80',
      coverImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
      instagramUrl: 'https://instagram.com/7a.skyejunior',
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
