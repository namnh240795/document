# Implementation Status Checklist

Cross-reference of `modules.yaml` features vs actual codebase. Last updated: 2026-08-20.

**Legend:**
- ✅ Fully implemented and working
- ⚠️ Partially implemented (stub/skeleton or missing integration)
- ❌ Not implemented

---

## AUTH Module (`apps/auth/`)

| # | Document Feature | Status | Backend | Frontend | Notes |
|---|-----------------|--------|---------|----------|-------|
| 1 | User Registration | ✅ | ✅ | ✅ | Email/password + verification code |
| 2 | User Login | ✅ | ✅ | ✅ | Email/password + Google OAuth |
| 3 | Phone Verification | ⚠️ | ⚠️ | — | SMS service exists, no Twilio — Discord webhook only |
| 4 | Email Verification | ✅ | ✅ | ✅ | Verification code via email |
| 5 | Password Reset | ⚠️ | ❌ | ⚠️ | Frontend modal exists, no backend endpoint |
| 6 | Organization Management | ✅ | ✅ | ✅ | Create, list, switch, roles |
| 7 | Team Management | ✅ | ✅ | ✅ | CRUD within orgs |
| 8 | Member Invitation | ✅ | ✅ | — | Invite with role assignment |
| 9 | RBAC | ✅ | ✅ | ✅ | Casbin-style permissions |
| 10 | Session Management | ✅ | ✅ | — | JWT + JWKS, cookies |
| 11 | Social Auth (Google) | ✅ | ✅ | ✅ | OAuth callback, account linking |

---

## EMAIL Module (`apps/email/`)

| # | Document Feature | Status | Backend | Frontend | Notes |
|---|-----------------|--------|---------|----------|-------|
| 12 | Send Email (REST) | ✅ | ✅ | — | JWT-protected endpoint |
| 13 | Send Email (RabbitMQ) | ✅ | ✅ | — | Async consumer on `email.send` queue |
| 14 | Email Tracking | ✅ | ✅ | — | Status tracking, logs, stats |
| 15 | Email Templates | ✅ | ✅ | ✅ | CRUD in admin panel |
| 16 | Discord Webhook | ✅ | ✅ | — | Email notifications via Discord |

---

## SMS Module (`apps/sms/`)

| # | Document Feature | Status | Backend | Frontend | Notes |
|---|-----------------|--------|---------|----------|-------|
| 17 | Send SMS (REST) | ✅ | ✅ | — | JWT-protected endpoint |
| 18 | SMS Tracking | ✅ | ✅ | — | Status tracking, logs, stats |
| 19 | SMS Templates | ✅ | ✅ | ✅ | CRUD in admin panel |
| 20 | Discord Webhook | ✅ | ✅ | — | SMS notifications via Discord |
| 21 | Twilio Integration | ❌ | ❌ | — | Only Discord, no real SMS provider |

---

## LOG Module (`apps/log-service/`)

| # | Document Feature | Status | Backend | Frontend | Notes |
|---|-----------------|--------|---------|----------|-------|
| 22 | Log Ingestion (RabbitMQ) | ✅ | ✅ | — | Consumer on `log.events` queue |
| 23 | OpenSearch Indexing | ✅ | ✅ | — | With in-memory fallback |
| 24 | Log Query API | ✅ | ✅ | ✅ | Filters: level, source, action, userId, date range |
| 25 | Log Analytics | ✅ | ✅ | — | Aggregations by level, source, timeline |

---

## RECR Module (`apps/recruitment/`)

| # | Document Feature | Status | Backend | Frontend | Notes |
|---|-----------------|--------|---------|----------|-------|
| 26 | Job Posting | ✅ | ✅ | ✅ | Full CRUD: create/update/delete/submit-for-approval, public browse with filtering, employer job list |
| 27 | Application Submission | ⚠️ | ⚠️ | ✅ | DB schema exists, apply endpoint returns stubs |
| 28 | Interview Scheduling | ✅ | ✅ | ✅ | Schedule, update, cancel — fully working |
| 29 | Offer Management | ⚠️ | ⚠️ | — | `recr_offers` table exists, no creation/update endpoints |
| 30 | Candidate Profile | ⚠️ | ⚠️ | ✅ | Endpoint exists, returns stubs |
| 31 | Employer Profile | ⚠️ | ⚠️ | ✅ | Endpoint exists, returns stubs |
| 32 | HR Profile | ⚠️ | ⚠️ | ✅ | Endpoint exists, returns stubs |
| 33 | Evaluations | ✅ | ✅ | ✅ | Submit, query, duplicate prevention |
| 34 | Reviews (Job) | ⚠️ | ⚠️ | ✅ | DB schema exists, endpoints return stubs |
| 35 | Reviews (Candidate) | ⚠️ | ⚠️ | ✅ | DB schema exists, endpoints return stubs |
| 36 | Recruitment Pipeline | ⚠️ | ⚠️ | — | Endpoint exists, returns stubs |
| 37 | Reports | ⚠️ | ⚠️ | — | Endpoint exists, returns stubs |
| 38 | Subscriptions | ⚠️ | ⚠️ | — | DB schema + endpoints exist, all return stubs |
| 39 | Dashboard Stats | ⚠️ | ⚠️ | ✅ | Endpoint exists, returns stubs |
| 40 | Elasticsearch | ❌ | ❌ | — | Listed in tech stack, not wired up |

---

## WALLET Module

| # | Document Feature | Status | Backend | Frontend | Notes |
|---|-----------------|--------|---------|----------|-------|
| 41 | Wallet Deposit | ❌ | ❌ | ❌ | No wallet service exists |
| 42 | Wallet Withdrawal | ❌ | ❌ | ❌ | No wallet service exists |
| 43 | Wallet Transfer | ❌ | ❌ | ❌ | No wallet service exists |
| 44 | Job Posting Payment | ❌ | ❌ | ❌ | No wallet service exists |
| 45 | Featured Job Payment | ❌ | ❌ | ❌ | No wallet service exists |
| 46 | Wallet Management | ❌ | ❌ | ❌ | No wallet service exists |

---

## Frontend (`global-talent-acquisition/`)

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 47 | Job Listings (Public) | ✅ | Hero search, filters, sorting, tabs |
| 48 | Login Page | ✅ | Email, Google OAuth, role selection |
| 49 | Registration Page | ✅ | Name, email, password, role |
| 50 | Candidate Dashboard | ✅ | Stats, recent activity |
| 51 | Applied Jobs View | ✅ | UI ready, depends on backend |
| 52 | Favorite Jobs View | ✅ | UI ready |
| 53 | My CV / Resume | ✅ | UI ready |
| 54 | Interview Schedule | ✅ | UI ready |
| 55 | Organization Dashboard | ✅ | Stats, overview |
| 56 | Job Management (Org) | ✅ | Create, list, edit UI |
| 57 | Candidate Management (Org) | ✅ | Browse, filter UI |
| 58 | Organization Creation | ✅ | Multi-field form with validation |
| 59 | Salary Calculator | ✅ | Gross/net + unemployment |
| 60 | Referral Wallet | ✅ | UI for referral tracking |

---

## Admin Panel (`onprem-admin/`)

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 61 | Admin Login | ✅ | |
| 62 | Dashboard Stats | ✅ | |
| 63 | User Management | ✅ | CRUD, ban/unban, sessions |
| 64 | Organization Management | ✅ | List, create |
| 65 | Team Management | ✅ | List, create |
| 66 | Email Templates | ✅ | CRUD |
| 67 | SMS Templates | ✅ | CRUD |
| 68 | Settings | ✅ | API URLs, maintenance mode |

---

## Webhook Events (from `modules.yaml`)

| # | From → To | Event | Status | Notes |
|---|-----------|-------|--------|-------|
| 69 | AUTH → SMS | `verification.requested` | ❌ | No Twilio integration |
| 70 | AUTH → SMS | `verification.resent` | ❌ | No Twilio integration |
| 71 | SMS → AUTH | `verification.delivered` | ❌ | No webhook callback |
| 72 | AUTH → LOG | `auth.event.logged` | ⚠️ | Logger exists, not wired to auth events |
| 73 | SMS → LOG | `sms.event.logged` | ⚠️ | Log service exists, not wired |
| 74 | AUTH → EMAIL | `verification.email.requested` | ⚠️ | Email service exists, no RabbitMQ publish from auth |
| 75 | AUTH → EMAIL | `verification.email.resent` | ⚠️ | Same as above |
| 76 | EMAIL → AUTH | `verification.email.delivered` | ❌ | No webhook callback |
| 77 | EMAIL → LOG | `email.event.logged` | ⚠️ | Log service exists, not wired |
| 78 | RECR → EMAIL | `application.submitted` | ❌ | No event publishing |
| 79 | RECR → EMAIL | `interview.scheduled` | ❌ | No event publishing |
| 80 | RECR → EMAIL | `offer.sent` | ❌ | No event publishing |
| 81 | RECR → LOG | `recruitment.event.logged` | ❌ | No event publishing |
| 82 | WALLET → RECR | `wallet.payment.completed` | ❌ | No wallet service |
| 83 | WALLET → LOG | `wallet.event.logged` | ❌ | No wallet service |
| 84 | AUTH → WALLET | `user.registered` | ❌ | No wallet service |

---

## Summary

| Category | ✅ Implemented | ⚠️ Partial | ❌ Not Implemented |
|----------|---------------|------------|-------------------|
| **15 Document Features** | 4 | 5 | **6** (entire WALLET module) |
| **Backend Services** | 5 (auth, email, sms, log, recr-jobs) | 1 (recr — other stubs) | **1** (wallet) |
| **Frontend/UI** | 14 | — | — |
| **Admin Panel** | 8 | — | — |
| **Webhook Events** | 0 | 3 | **13** |

### Priority Gaps

1. **WALLET module** — 6 features completely missing, needs new NestJS service + DB schema + frontend
2. **Recruitment backend** — application submission, candidate/employer profiles, pipeline, reports, subscriptions still return stubs
3. **Webhook events** — 13 out of 16 events not wired, services exist but don't publish/subscribe
4. **Twilio integration** — SMS service sends to Discord only
5. **Elasticsearch** — listed in tech stack for recruitment search, not connected
6. **Password Reset** — frontend modal exists, no backend flow
