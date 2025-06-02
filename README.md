![reliability-tasks-screenshot](https://github.com/user-attachments/assets/2a9e753b-7f33-44cf-b2c9-31bc03fdeb10)

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

- [ ] **Move schema out of reliability-tasks/server/db.ts**

- [ ] **More thorough commenting**

- [ ] **Auto-sort imports**  
       via eslint-plugin-simple-import-sort

- [ ] **TasksList props**  
       TaskList has a lot of props. Could have hoisted or consolidated some of these into e.g. a params object.

- [ ] **More scalable db structure**  
       Eventually migrate the db structure so that there is a per-user table.

- [ ] **Better svg handling**  
       Svg.tsx: I usually build a component that directly parses .svg files stored in some sort of /assets folder so that they can be more easily updated (direct Figma export workflow) and to avoid a lot of inline svgs. I don’t particularly like the pattern of just creating React components for each svg.

- [ ] **@reliability-ui package**  
       Eventually publish reliability-ui as an npm package so that we can version it.

- [ ] **Unit tests**  
       Tests in Storybook are just basically scaffolded. Would add more interactions.

- [x] **Fix date selection day offset**  
       The date picker appears one day behind due to timezone inconsistencies when reopening.

- [x] **Style sign in/register**  
       Improve visual appearance of the sign in/register view.

- [x] **Fix update/add task form auto-close**  
       The current add/update task form stays open when launching another form.

- [x] **Style modal**  
       Improve the visual appearance of the task editing modal.

- [x] **Fill out stories for components in library**  
       There are two components with rudimentary stories in Storybook: Button and Toast. Stories need to be written for the rest of the components.

- [x] **TProject imports**  
       Noticed on 6/1 that type TProject was moved from local definition in reliability-tasks to reliability-ui. Need to update a few paths, and I'm not immediately sure why eslint didn't sniff this out.
