const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        username: 'admin',
        password: hashedPassword,
        role: 'ADMIN',
        isVerified: true,  // Admin should be verified by default
      },
    });

    // Create branches
    const branchNames = ['Mumbai', 'Delhi', 'Bangalore', 'Kolkata'];
    await prisma.branch.createMany({
      data: branchNames.map(name => ({ name })),
      skipDuplicates: true,
    });

    // Create financial years
    const currentYear = new Date().getFullYear();
    const years = [
      `${currentYear - 1}-${currentYear}`,
      `${currentYear}-${currentYear + 1}`,
    ];
    await prisma.financialYear.createMany({
      data: years.map(year => ({ year })),
      skipDuplicates: true,
    });

    console.log('Seed data created successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
