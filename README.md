# FY26 CRZ Time Off Management Web App

Production-oriented internal app built with **Next.js + TypeScript + Prisma + PostgreSQL (Neon compatible)**.

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

## Vercel + Neon Deployment Notes
If Vercel shows **"No Next.js version detected"**, the deployment is usually pointing to the wrong commit/branch or root directory.

Checklist:
1. In Vercel project settings, set the connected branch to your production branch (recommended: `main`).
2. Set **Root Directory** to the repository root (`/`) where `package.json` exists.
3. Confirm `package.json` contains `"next"` in dependencies (this repo does).
4. Add env vars in Vercel:
   - `DATABASE_URL` (Neon connection string)
   - `JWT_SECRET`
   - `ADMIN_PASSCODE`
5. Redeploy after branch + root directory are corrected.

## Branch Strategy (single branch)
For your requested workflow (GitHub -> Vercel -> Neon), keep only one long-lived branch:
- `main` = the only active branch for production.
- Delete temporary branches after merge.

Commands:
```bash
git checkout main
git branch -D <temp-branch>
git push origin --delete <temp-branch>
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
