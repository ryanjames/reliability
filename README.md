![Reliability](https://ci3.googleusercontent.com/mail-sig/AIorK4w4c_zsr75LEdCxUrJHgFgm9CEZgjlKQIGvu1eVKeIjkRZ3_B_eki8iCQEVee9WxbmB9clrqoU)

## Frontend Interview Challenge Template

Develop an application that supports creating, deleting, and listing todos. When submitting a new todo, the UI should update immediately. Pending network requests should be communicated with some kind of indicator. Using something like [`JSON Server`](https://github.com/typicode/json-server) is acceptable. At the very least you should have typings defined for your `Todo` objects–typing responses/requests/errors will earn extra points.

Create your own repository using this template to begin and assign the Reliability point of contact as a collaborator once you're ready for us to review your work. :muscle:

---



## Requirements

- [ ] Adding a new todo
- [ ] Listing active/incomplete todos
- [ ] Deleting todos
- [ ] Editing todos

### Stack
- [Vite](https://vitejs.dev/)
- React
- Typescript
- [Tanstack Query](https://tanstack.com/query/latest)
- [Zustand](https://github.com/pmndrs/zustand) or [Valtio](https://github.com/pmndrs/valtio) if global application state is appropriate

## Extra Credit
- [ ] Implement a backend using language/framework of your choosing
- [ ] Support undo for editing and deleting
- [ ] Persist data to the client
- [ ] Persist database to disk (any db acceptable, including SQLite/LowDB)
- [ ] Support setting and changing priority for todos
- [ ] Implement crosstab state updates/communication
- [ ] Use [Radix](https://www.radix-ui.com/primitives) and/or [HeadlessUI](https://headlessui.com/) with [Tailwind](https://tailwindcss.com/) to create and style a component kit
