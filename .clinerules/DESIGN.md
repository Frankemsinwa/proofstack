**Proof Stack – Architecture & Technical Implementation**

---

### 🧱 Overview

Proof Stack is a mobile application built using **React Native + Expo** with a **Node.js + Express** backend. It uses **Prisma ORM** to manage a **PostgreSQL** database. The system enables users to log skills and achievements, refer others, and track contributions — all powered by a fast, secure backend and a mobile-optimized front-end.

---

### 📐 Architecture Diagram (Logical)

```
[Mobile App: React Native + Expo]
        │
        ▼
[API Layer: Node.js + Express]
        │
        ▼
[ORM: Prisma]
        │
        ▼
[Database: PostgreSQL (hosted on Prisma Data Platform)]
```

---

### ⚙️ Tech Stack


| Layer          | Tech Stack                                               |
| ---------------- | ---------------------------------------------------------- |
| **Frontend**   | React Native (via Expo SDK)                              |
| **Backend**    | Node.js, Express.js                                      |
| **Database**   | PostgreSQL (hosted via Prisma Data Platform)             |
| **ORM**        | Prisma                                                   |
| **Auth**       | JWT (email/password for now)                             |
| **Dev Tools**  | Prettier, ESLint, Git, GitHub                            |
| **Deployment** | Vercel (API), Expo Go/TestFlight (app)                   |
| **Hosting**    | Prisma Data Platform (PostgreSQL), Railway (if fallback) |

---

### 🧠 Key Entities & Features (Schema-Level View)

#### `User`

* id, name, email, password
* referredBy → `Referral`
* hasMany → `Skills`, `Referrals`, `Badges`

#### `Skill`

* title, description, proof (e.g., image, link)
* belongsTo → `User`

#### `Badge`

* system-defined achievement
* awarded based on milestones (e.g., first referral, 5 skills, etc.)

#### `Referral`

* inviter → `User`
* invitee → `User`
* timestamped, one-time

---

### 🌐 API Architecture

**RESTful Routing with Express**

* `/api/auth/*` – login, register, verify
* `/api/users/*` – get profile, update user
* `/api/skills/*` – create, list, delete skill
* `/api/referrals/*` – refer a friend, check referral
* `/api/badges/*` – claim badge, view badges

Each route is wired to:

* `controller` → handles logic
* `service` (optional) → reusable operations
* `middleware` → auth, validation, error handling

---

### 🧩 Component Abstractions (Frontend)


| Component              | Responsibility                         |
| ------------------------ | ---------------------------------------- |
| `SkillCard`            | Displays individual skill              |
| `AddSkillModal`        | Form for adding new skill              |
| `ReferralInviteScreen` | Share and track referral links         |
| `BadgeDisplay`         | Show unlocked badges                   |
| `AuthScreens`          | Login/Register/Password reset          |
| `DashboardScreen`      | Overview of progress and profile stats |

---

### 🧪 DevOps & Deployment


| Task               | Tool                                         |
| -------------------- | ---------------------------------------------- |
| **API Deployment** | Vercel / Railway (Node.js serverless)        |
| **Mobile Builds**  | Expo Go → EAS build (TestFlight/Play Store) |
| **Database**       | Prisma Data Platform (PostgreSQL)            |
| **Monitoring**     | Log-based, eventually add Sentry             |

---

### 🧱 Folder Structure (Backend)

```
/src
  /controllers
  /routes
  /middleware
  /utils
  /prisma
    schema.prisma
  .env
server.js
```

---

### 🚀 API & DB Versioning Strategy

* **Prisma migrations** will be managed via CLI (`npx prisma migrate dev`)
* Versioning of APIs may be handled by route prefixing later (e.g., `/v1/`, `/v2/`)
* Separate staging and production `.env` for credentials

---

### 🧩 AI Integration Notes

All AI agents generating code must follow:

* This system architecture
* This directory layout
* The schema in `/backend/prisma/schema.prisma`
* Avoid introducing Web3 or blockchain concepts

---

.
