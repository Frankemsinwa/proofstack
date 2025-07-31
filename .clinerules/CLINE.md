

**Proof Stack – Context Engineering Framework (HOW to Build)**

---

### 🧠 Purpose of this Document

This file defines the **engineering methodology**, **coding standards**, and **AI prompting principles** that ensure consistent and reliable implementation across all parts of the project. It is designed for use by both **human developers** and **AI assistants** (like GPT) contributing to the codebase.

---

### 🧱 Foundational Assumptions

* The app is a **mobile-first platform**, built using **React Native + Expo**.
* Backend is written in **Node.js + Express**, using **Prisma ORM** to interface with **PostgreSQL**.
* The project prioritizes **clarity, modularity, and developer velocity** over premature optimization.
* AI is used **consistently and deterministically**, following prompt design best practices.

---

### 🧭 Development Philosophy

* **Simplicity > Cleverness**: Every line of code must be understandable by a junior dev.
* **Context-aware AI prompts** must be built from this root: always reference `PRODUCT_PRP.md`, `CLINE.md`, and `DESIGN.md` for alignment.
* **Modularity**: All controllers, routes, and services should be scoped clearly per entity (e.g., `user.controller.js`, `skill.routes.js`).
* **Human-first AI prompting**: Every generated file should serve the team, not just pass a test.

---

### ⚙️ Backend Coding Standards

| Topic               | Guideline                                                               |
| ------------------- | ----------------------------------------------------------------------- |
| **Framework**       | Node.js with Express.js                                                 |
| **ORM**             | Prisma for PostgreSQL                                                   |
| **File Structure**  | MVC-like: `/controllers`, `/routes`, `/prisma`, `/middleware`, `/utils` |
| **Naming**          | Use lowercase + underscores for tables, camelCase for variables         |
| **Authentication**  | JWT-based, email/password                                               |
| **Validation**      | Middleware-based validation using `zod` or `express-validator`          |
| **Error Handling**  | Centralized error handler with descriptive logs                         |
| **Security**        | Sanitize inputs, enforce role-based access, use HTTPS                   |
| **Version Control** | Git + conventional commits                                              |
| **Environment**     | Use `.env` file for all credentials (never hard-code)                   |

---

### ⚛️ Frontend Coding Standards (React Native + Expo)

| Topic              | Guideline                                                      |
| ------------------ | -------------------------------------------------------------- |
| **Framework**      | React Native using Expo SDK                                    |
| **Navigation**     | React Navigation                                               |
| **State Mgmt**     | Context API initially (later adopt Zustand or Redux if needed) |
| **API Calls**      | Axios with centralized service layer                           |
| **Form Handling**  | React Hook Form or Formik                                      |
| **Styling**        | Tailwind with NativeWind                                       |
| **Design**         | Mobile-first, component-based, accessible                      |
| **Error Handling** | User-friendly toast messages and fallback screens              |

---

### 🔁 AI Development Protocol (Context Engineering Prompting)

**For AI agents working on the project:**

1. **Always reference `PRODUCT_PRP.md` before coding.**
2. **Never make architectural assumptions.** Always stick to documented stack.
3. **Include only the requested code.** Don’t hallucinate extra files or features.
4. **Be modular.** All logic must live in controllers or services, never routes.
5. **If in doubt, ask for clarification.** Never fill gaps by guessing context.
6. **Always ensure schema alignment.** Do not mismatch field names/types with Prisma models.

---

### ✅ Checklist for AI-Assisted File Generation

When generating any new file (controller, route, schema, etc.), AI should:

* [x] Reference the relevant model from `/backend/prisma/schema.prisma`.
* [x] Respect existing project structure and naming.
* [x] Include only necessary logic — no extras.
* [x] Use async/await and try/catch in controllers.
* [x] Write clean, documented code blocks.
* [x] Ensure error handling is in place.
* [x] Format with Prettier-style consistency.





---

### 🧠 AI Prompt Template for Context Engineering

```bash
You are a senior Node.js + Prisma engineer building Proof Stack — a mobile app platform described in PRODUCT_PRP.md. Follow the coding standards and project philosophy in CLINE.md. Your job is to create [X FILE] with clean, modular, production-level code. Do not generate extra logic. Only include what's required. Respect naming, structure, and database schema.
```

---


