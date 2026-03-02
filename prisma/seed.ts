import { PrismaClient, Role, Shift, UserStatus, ValueStream } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function upsertSupervisor(name: string, username: string, valueStream: ValueStream, shift: Shift, status: UserStatus, password?: string) {
  return prisma.user.upsert({
    where: { username },
    update: { name, valueStream, shift, status, passwordHash: password ? await bcrypt.hash(password, 10) : null },
    create: {
      name,
      username,
      valueStream,
      shift,
      role: Role.SUPERVISOR,
      status,
      passwordHash: password ? await bcrypt.hash(password, 10) : null,
    },
  });
}

async function main() {
  await prisma.settings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: { id: 'singleton', fiscalYearStartMonth: 4, fiscalYearStartDay: 1, defaultGrantedHours: 160 },
  });

  await upsertSupervisor('Chris Evans', 'chris.evans', ValueStream.WCZ, Shift.FIRST, UserStatus.ACTIVE, 'ChangeMe123!');
  await upsertSupervisor('Aaron Walker', 'aaron.walker', ValueStream.WCZ, Shift.FIRST, UserStatus.ACTIVE, 'ChangeMe123!');
  await upsertSupervisor('Brittney Lowry', 'brittney.lowry', ValueStream.BCZ, Shift.FIRST, UserStatus.ACTIVE, 'ChangeMe123!');
  await upsertSupervisor('Matt Youngman', 'matt.youngman', ValueStream.WCZ, Shift.SECOND, UserStatus.ACTIVE, 'ChangeMe123!');
  await upsertSupervisor('Bridgett Nieto', 'bridgett.nieto', ValueStream.BCZ, Shift.SECOND, UserStatus.ACTIVE, 'ChangeMe123!');
  await upsertSupervisor('Thomas Hooper', 'thomas.hooper', ValueStream.WCZ, Shift.THIRD, UserStatus.ACTIVE, 'ChangeMe123!');
  await upsertSupervisor('Ruy Palomo', 'ruy.palomo', ValueStream.BCZ, Shift.THIRD, UserStatus.ACTIVE, 'ChangeMe123!');

  await upsertSupervisor('WCZ Supervisor – Pending', 'wcz.pending', ValueStream.WCZ, Shift.FIRST, UserStatus.PENDING);
  await upsertSupervisor('BCZ Supervisor – Pending', 'bcz.pending', ValueStream.BCZ, Shift.FIRST, UserStatus.PENDING);

  await prisma.user.upsert({
    where: { username: 'arturo.montoya' },
    update: {},
    create: {
      name: 'Arturo Montoya',
      username: 'arturo.montoya',
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      passwordHash: await bcrypt.hash('AdminChangeMe123!', 10),
    },
  });
}

main().finally(() => prisma.$disconnect());
