import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create roles
  const roles = ['admin', 'mentor', 'academy_student', 'mentorship_student', 'community_student'];
  for (const roleName of roles) {
    await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    });
  }

  // Helper to create user and assign role
  async function createUserWithRole(email: string, name: string, password: string, roleName: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (role) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: user.id, roleId: role.id } },
        update: {},
        create: { userId: user.id, roleId: role.id },
      });
    }

    return user;
  }

  // Create users for each role
  const adminUser = await createUserWithRole('admin@example.com', 'Admin User', 'adminpassword', 'admin');
  await createUserWithRole('a', 'Alice Academy', 'academypassword', 'academy_student');
  await createUserWithRole('mentee@example.com', 'Mentee Mark', 'mentorshippassword', 'mentorship_student');
  await createUserWithRole('community@example.com', 'Community Chris', 'communitypassword', 'community_student');

  // Seed sample courses
  await prisma.course.createMany({
    data: [
      {
        title: 'Basic Trading Signals',
        content: 'Free signals for community students.',
        roleAccess: ['community_student'],
        uploadedBy: adminUser.id,
      },
      {
        title: 'Advanced Strategies',
        content: 'Premium academy content.',
        roleAccess: ['academy_student'],
        uploadedBy: adminUser.id,
      },
      {
        title: 'Personalized Trading Plan',
        content: 'Mentorship-specific sessions.',
        roleAccess: ['mentorship_student'],
        uploadedBy: adminUser.id,
      },
    ],
  });

  // Seed sample live sessions
  await prisma.liveSession.createMany({
    data: [
      {
        title: 'Weekly Q&A',
        description: 'Free community session.',
        date: new Date(),
        roleAccess: ['community_student'],
        uploadedBy: adminUser.id,
      },
      {
        title: 'Strategy Workshop',
        description: 'Academy live class.',
        date: new Date(),
        roleAccess: ['academy_student'],
        uploadedBy: adminUser.id,
      },
      {
        title: '1:1 Review',
        description: 'Mentorship session.',
        date: new Date(),
        roleAccess: ['mentorship_student'],
        uploadedBy: adminUser.id,
      },
    ],
  });

  // Seed sample signals
  await prisma.signal.createMany({
    data: [
      {
        title: 'Daily Signal',
        content: 'Free daily market signal.',
        roleAccess: ['community_student'],
        uploadedBy: adminUser.id,
      },
      {
        title: 'Premium Alert',
        content: 'Academy premium alert.',
        roleAccess: ['academy_student'],
        uploadedBy: adminUser.id,
      },
      {
        title: 'VIP Trade Setup',
        content: 'Mentorship VIP setup.',
        roleAccess: ['mentorship_student'],
        uploadedBy: adminUser.id,
      },
    ],
  });

  console.log('✅ Seeding completed: roles + users + courses + sessions + signals.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
