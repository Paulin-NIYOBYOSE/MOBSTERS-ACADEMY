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

  // Create initial admin user
  const adminEmail = 'admin@example.com';
  const adminPassword = 'adminpassword';
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin User',
      password: hashedAdminPassword,
    },
  });

  // Assign admin role
  const adminRole = await prisma.role.findUnique({ where: { name: 'admin' } });
  if (adminRole) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
      update: {},
      create: { userId: adminUser.id, roleId: adminRole.id },
    });
  }

  // Create sample normal users
  const sampleUsers = [
    { email: 'alice@example.com', name: 'Alice', password: 'alice123', role: 'academy_student' },
    { email: 'bob@example.com', name: 'Bob', password: 'bob123', role: 'mentorship_student' },
    { email: 'charlie@example.com', name: 'Charlie', password: 'charlie123', role: 'community_student' },
  ];

  for (const u of sampleUsers) {
    const hashedPw = await bcrypt.hash(u.password, 10);
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        name: u.name,
        password: hashedPw,
      },
    });

    const role = await prisma.role.findUnique({ where: { name: u.role } });
    if (role) {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: user.id, roleId: role.id } },
        update: {},
        create: { userId: user.id, roleId: role.id },
      });
    }

    // Give them a refresh token
    await prisma.refreshToken.create({
      data: {
        hashedToken: `token-${u.email}`,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
      },
    });

    // Add one pending role request
    await prisma.pendingRoleRequest.create({
      data: {
        userId: user.id,
        program: 'academy',
        status: 'pending',
      },
    });
  }

  console.log('✅ Seeding completed: roles, admin, and sample users created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
