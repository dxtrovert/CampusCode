# CampusCode

CampusCode is a responsive React landing page built with Vite.

## Development

```sh
npm install
npm run dev
```

Run the production build and linter with:

```sh
npm run build
npm run lint
```

## Source structure

- `src/components/` contains the page sections and reusable UI components.
- `src/data/` contains the page copy and repeated static content.
- `src/hooks/` contains reusable React hooks.
- `src/styles/` contains the base, layout, hero, section, and responsive styles.

## Demo student login

The login page accepts any display name, email, username, and password and
starts a frontend-only demo session in `sessionStorage`. No credential is sent
to a backend. Visit `/student/overview` after logging in; the dashboard uses
clearly labeled sample data. The Profile page can edit demo information for the
current tab session, and Log Out clears it.

## Vercel deployment

This Vite SPA is configured in `vercel.json` to build with `npm run build`,
publish `dist`, and rewrite `/login`, `/register`, and `/student/*` routes to
`index.html`. The Vercel project root directory should be the repository root
(the directory containing `package.json`).
