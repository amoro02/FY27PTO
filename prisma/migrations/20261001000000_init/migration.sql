-- Create enums and tables generated from schema.prisma
CREATE TYPE "Role" AS ENUM ('SUPERVISOR', 'ADMIN');
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'PENDING', 'INACTIVE');
CREATE TYPE "Shift" AS ENUM ('FIRST', 'SECOND', 'THIRD');
CREATE TYPE "ValueStream" AS ENUM ('WCZ', 'BCZ');
CREATE TYPE "PtoType" AS ENUM ('PTO', 'COMP_TIME');
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED');
CREATE TYPE "Decision" AS ENUM ('APPROVED', 'DENIED');
CREATE TABLE "User" ("id" TEXT PRIMARY KEY, "name" TEXT NOT NULL, "username" TEXT NOT NULL UNIQUE, "role" "Role" NOT NULL, "valueStream" "ValueStream", "shift" "Shift", "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE', "email" TEXT, "passwordHash" TEXT, "carryoverHours" DOUBLE PRECISION NOT NULL DEFAULT 0, "adjustmentHours" DOUBLE PRECISION NOT NULL DEFAULT 0, "compTimeBalance" DOUBLE PRECISION NOT NULL DEFAULT 0, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL);
CREATE TABLE "PtoRequest" ("id" TEXT PRIMARY KEY, "userId" TEXT NOT NULL, "startDate" TIMESTAMP(3) NOT NULL, "endDate" TIMESTAMP(3) NOT NULL, "hoursPerDay" DOUBLE PRECISION NOT NULL, "type" "PtoType" NOT NULL, "notes" TEXT, "status" "RequestStatus" NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY ("userId") REFERENCES "User"("id"));
CREATE TABLE "PtoDecision" ("id" TEXT PRIMARY KEY, "requestId" TEXT UNIQUE NOT NULL, "decidedByUserId" TEXT NOT NULL, "decision" "Decision" NOT NULL, "reason" TEXT, "decidedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY ("requestId") REFERENCES "PtoRequest"("id"), FOREIGN KEY ("decidedByUserId") REFERENCES "User"("id"));
CREATE TABLE "PtoEntry" ("id" TEXT PRIMARY KEY, "userId" TEXT NOT NULL, "date" TIMESTAMP(3) NOT NULL, "hours" DOUBLE PRECISION NOT NULL, "type" "PtoType" NOT NULL, "sourceRequestId" TEXT, FOREIGN KEY ("userId") REFERENCES "User"("id"), FOREIGN KEY ("sourceRequestId") REFERENCES "PtoRequest"("id"));
CREATE UNIQUE INDEX "PtoEntry_userId_date_type_key" ON "PtoEntry"("userId","date","type");
CREATE TABLE "OtAssignment" ("id" TEXT PRIMARY KEY, "date" TIMESTAMP(3) NOT NULL, "shift" "Shift" NOT NULL, "valueStream" "ValueStream" NOT NULL, "assignedUserId" TEXT NOT NULL, "label" TEXT, FOREIGN KEY ("assignedUserId") REFERENCES "User"("id"));
CREATE UNIQUE INDEX "OtAssignment_date_shift_valueStream_key" ON "OtAssignment"("date","shift","valueStream");
CREATE TABLE "VsmOutOfOffice" ("id" TEXT PRIMARY KEY, "date" TIMESTAMP(3) NOT NULL, "note" TEXT);
CREATE TABLE "Settings" ("id" TEXT PRIMARY KEY, "fiscalYearStartMonth" INTEGER NOT NULL DEFAULT 4, "fiscalYearStartDay" INTEGER NOT NULL DEFAULT 1, "defaultGrantedHours" DOUBLE PRECISION NOT NULL DEFAULT 160);
