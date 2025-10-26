import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Admin user (password hash is placeholder)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tc.local' },
    update: {},
    create: { email: 'admin@tc.local', passwordHash: 'hashed', role: 'ADMIN', firstName: 'Admin' }
  });

  // Therapist A
  const tUser = await prisma.user.upsert({
    where: { email: 'a@tc.local' },
    update: {},
    create: { email: 'a@tc.local', passwordHash: 'hashed', role: 'THERAPIST', firstName: 'Άννα', lastName: 'Τ.' }
  });
  const t = await prisma.therapist.upsert({
    where: { userId: tUser.id },
    update: {},
    create: { userId: tUser.id, specialty: 'SLP' }
  });

  // Schedule (Mon & Thu 09:00–17:00)
  await prisma.therapistSchedule.createMany({
    data: [
      { therapistId: t.id, weekday: 1, startTime: '09:00', endTime: '17:00' },
      { therapistId: t.id, weekday: 4, startTime: '09:00', endTime: '17:00' },
    ],
    skipDuplicates: true
  });

  // One demo client + a few appointments today
  const c = await prisma.client.upsert({
    where: { email: 'demo@client.local' },
    update: {},
    create: { fullName: 'Γιάννης Παπαδόπουλος', email: 'demo@client.local' }
  });

  const base = new Date();
  base.setHours(9,0,0,0);
  for (let i = 0; i < 4; i++) {
    const start = new Date(base.getTime() + i * 45 * 60000);
    const end = new Date(start.getTime() + 45 * 60000);
    await prisma.appointment.upsert({
      where: { therapistId_startDt: { therapistId: t.id, startDt: start } },
      update: {},
      create: { clientId: c.id, therapistId: t.id, startDt: start, endDt: end, status: i === 1 ? 'PRESENT' : 'SCHEDULED' }
    });
  }
}

main().finally(() => prisma.$disconnect());
