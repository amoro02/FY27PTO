# FY26 CRZ Time Off Management Web App

Production-oriented internal app built with **Next.js + TypeScript + Prisma + PostgreSQL**.

## Features Implemented
- Username/password auth with role-based access.
- Supervisor + VSM/Admin roles.
- Admin passcode confirmation required for PTO approvals/denials.
- Seeded users including active supervisors, 2 pending supervisor placeholders, and Arturo Montoya admin.
- OT weekend rotation management with PTO conflict warning.
- PTO request workflow (pending -> approve/deny) with overlap prevention.
- PTO approval dashboard + decision audit records.
- Aggregated PTO calendar including VSM informational PTO.
- Admin settings for fiscal year defaults and per-supervisor carryover/adjustments/comp time.
- User management (create, activate pending, disable).
- CSV exports (calendar and OT) and CSV imports (OT + PTO entries).

## Assumptions
1. Admin re-authentication is implemented via a secure `ADMIN_PASSCODE` confirmation field at approval time.
2. Weekend OT bulk generation is supported through CSV import and manual admin entry; this can be expanded to automated fiscal-year generation in a subsequent enhancement.
3. Remaining PTO balance formula is represented via stored fields + approved usage data; expose detailed computed balance UI as a next incremental enhancement.

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure env:
   ```bash
   cp .env.example .env
   ```
3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```
4. Seed initial users:
   ```bash
   npm run db:seed
   ```
5. Run app:
   ```bash
   npm run dev
   ```

## Deployment
- Use managed PostgreSQL (RDS, Cloud SQL, Azure PG, etc).
- Set env vars: `DATABASE_URL`, `JWT_SECRET`, `ADMIN_PASSCODE`.
- Build/start:
  ```bash
  npm run build
  npm run start
  ```

## Default Seed Credentials
- Admin: `arturo.montoya` / `AdminChangeMe123!`
- Active supervisors: `<first.last>` / `ChangeMe123!`
- Pending supervisors: no password, no login access until activated.

## How to Add a New Supervisor
1. Go to **Users** page as admin.
2. Enter name/username/shift/value stream/status.
3. Optionally provide password now, or activate later.

## How to Reset Fiscal Year
1. Open **Settings** page as admin.
2. Update fiscal year start and granted hour default.
3. For each supervisor, update carryover/adjustments/comp time as required for the new year.
4. Optionally import adjusted PTO entries via CSV import endpoint.
