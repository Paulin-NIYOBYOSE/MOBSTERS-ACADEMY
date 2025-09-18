import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create roles (restored mentorship_student)
  const roles = ['admin', 'academy_student', 'mentorship_student', 'community_student'];
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
  }

  // Create initial admin user
  const adminEmail = 'admin@example.com';
  const adminPassword = 'adminpassword';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin User',
      password: hashedPassword,
    },
  });

  // Assign admin role to admin user
  const adminRole = await prisma.role.findUnique({ where: { name: 'admin' } });
  if (adminRole) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
      update: {},
      create: { userId: adminUser.id, roleId: adminRole.id },
    });
  }

  // Seed sample courses
  await prisma.course.createMany({
    data: [
      { title: 'Basic Trading Signals', content: 'Free signals for community students.', roleAccess: ['community_student'], uploadedBy: adminUser.id },
      { title: 'Advanced Strategies', content: 'Premium academy content.', roleAccess: ['academy_student'], uploadedBy: adminUser.id },
      { title: 'Personalized Trading Plan', content: 'Mentorship-specific sessions.', roleAccess: ['mentorship_student'], uploadedBy: adminUser.id },
    ],
  });

  // Seed sample live sessions
  await prisma.liveSession.createMany({
    data: [
      { title: 'Weekly Q&A', description: 'Free community session.', date: new Date(), roleAccess: ['community_student'], uploadedBy: adminUser.id },
      { title: 'Strategy Workshop', description: 'Academy live class.', date: new Date(), roleAccess: ['academy_student'], uploadedBy: adminUser.id },
      { title: '1:1 Review', description: 'Mentorship session.', date: new Date(), roleAccess: ['mentorship_student'], uploadedBy: adminUser.id },
    ],
  });

  // Seed sample signals
  await prisma.signal.createMany({
    data: [
      { title: 'Daily Signal', content: 'Free daily market signal.', roleAccess: ['community_student'], uploadedBy: adminUser.id },
      { title: 'Premium Alert', content: 'Academy premium alert.', roleAccess: ['academy_student'], uploadedBy: adminUser.id },
      { title: 'VIP Trade Setup', content: 'Mentorship VIP setup.', roleAccess: ['mentorship_student'], uploadedBy: adminUser.id },
    ],
  });

  console.log('Seeding completed: roles created, admin user created, sample courses/sessions/signals seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });