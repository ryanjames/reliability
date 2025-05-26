# Reliability Monorepo

This monorepo hosts the Reliability Tasks app as well as the Reliability UI component library. Built using tools such as Vite, React, TypeScript, Tailwind CSS, Radix UI, and TanStack Query.

---

## Getting started

#### Install packages

```bash
pnpm install
```

#### Run the app

```bash
pnpm dev:app
```

#### Run the component library Storybook

```bash
pnpm dev:ui
```

## 📦 Monorepo Structure

```
reliability/
├── apps/
│ └── reliability-tasks/ # Main task management application
└── packages/
  └── reliability-ui/ # Shared UI component library
```

---

## Requirements

- Node 24
- [pnpm](https://pnpm.io/installation)

---

## 🔧 Tech Stack

### Frontend

- **React** (with Hooks)
- **TypeScript**
- **Vite** for blazing-fast builds
- **Tailwind CSS v4** — fully JIT-compiled, with safelisting and monorepo-aware purging
- **Radix UI** + **@radix-ui/themes** — for consistent, accessible UI primitives
- **TanStack Query v5** — for efficient data fetching and caching
- **Hono** — lightweight backend (colocated within `apps/reliability-tasks`, if enabled)

### Tooling

- **pnpm** — fast and disk-efficient package manager with workspace support
- **ESLint** with TypeScript + React + Tailwind plugins
- **Prettier** — enforced formatting
- **Vitest** — modern unit testing
- **Storybook 8** — component explorer and documentation (integrated into UI package)
- **Sonner** — elegant toast notifications
- **cva** — class-variance-authority for composable styling

---

## 📁 Key Packages

### `apps/reliability-ui`

The main frontend application. Features:

- Project-based task organization
- Drag-and-drop task reordering via `@dnd-kit`
- Inline task editing
- UTC-based due date handling with timezone-safe conversions
- Fully responsive design with Radix primitives and Tailwind 4

## 📝 TODO

- [ ] **Fix date selection day offset**  
       The date picker appears one day behind due to timezone inconsistencies when reopening.

- [ ] **Fix update/add task form auto-close**  
       The current add/update task form stays open when launching another form.

- [ ] **Style modal**  
       Improve the visual appearance of the task editing modal.

- [ ] **Fill out stories for components in library**  
       There are two components with rudimentary stories in Storybook: Button and Toast. Stories need to be written for the rest of the components.
