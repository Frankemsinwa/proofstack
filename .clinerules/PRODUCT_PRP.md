### PRODUCT_PRP.md

**Proof Stack – Product Requirements Prompt (WHAT to Build)**

#### 🧠 Product Name: **Proof Stack**

A mobile platform that connects skilled digital talents with real-world jobs and proof-of-work tasks, helping users grow a public, verified portfolio and land trusted work opportunities.

---

### ✅ Core Value Proposition

* **For talents**: Build a mobile-first profile backed by practical work samples and challenge submissions. Grow reputation with proof of output.
* **For recruiters/clients**: Discover credible talent through their public proof history and real portfolio projects.

---

### 📱 Platform Overview

* **Frontend**: React Native + Expo (cross-platform mobile experience)
* **Backend**: Node.js + Express + Prisma ORM
* **Database**: PostgreSQL (hosted via Prisma Postgres)
* **Auth**: Email/password auth (JWT, Clerk optional later)

---

### 👥 Target Users

* **Freelancers & junior developers** building reputation and visibility.
* **Hiring managers/agencies** looking for verified skilled workers.
* **Online communities/tech trainers** issuing proof-based challenges.

---

### 📦 Core Features (Phase 1 MVP)

#### 1. **User Registration & Login**

* Email/password signup and secure login.
* JWT-based authentication.
* Support for roles: `TALENT`, `CLIENT`.

#### 2. **User Profile & Skills**

* Users can edit their name, bio, social links.
* Add/update/remove skills (many-to-many structure).
* Each skill has a name and optional description.

#### 3. **Portfolio Projects**

* Upload/display past projects.
* Each project includes title, description, and external link (e.g. GitHub, Dribbble).
* Associate projects with relevant skills.

#### 4. **Job Posting & Applications**

* CLIENTs can create jobs with title, description, and requirements.
* Talents can view jobs and submit proposals.
* Jobs have status tracking (`OPEN`, `IN_PROGRESS`, `COMPLETED`, etc.).

#### 5. **Referral System**

* Referral-based user growth.
* Referral types like `INVITE`, `EARN`, `CONTRIBUTE`.
* Track who referred whom and related metadata.

#### 6. **Proof Challenges**

* Post skill-based challenges/tasks (e.g., “Build a to-do app in 2 hrs”).
* Users submit proof of completion (link, screenshot, notes).
* Review and approve/reject proof submissions.

---

### 📊 Business Requirements

* Mobile-first UX (React Native Expo).
* Backend is RESTful API driven.
* Secure user sessions with JWT tokens.
* Store relational data with PostgreSQL (via Prisma).
* Modular controller-based API design.
* Cloud database (Prisma Postgres) for production.

---

### 📈 Future Additions (Post-MVP Ideas)

* AI-based proof review and grading.
* Public user reputation dashboard.
* Notification system for job matches or approvals.
* In-app direct messaging.
* Admin dashboard and analytics (separate module).

---

### 🚫 Out of Scope (MVP)

* Smart contracts or blockchain verification (Not a Web3 app)
* On-chain identity or DAO governance
* Desktop or web-first interfaces

---
