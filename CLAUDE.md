# Aesthetic Portfolio OS

Portfolio website that mimics a desktop OS. Vite + React + TanStack Router + Tailwind + GSAP. See `README.md`.

## Commands
- `yarn install`, `yarn dev` (port 3000), `yarn build` (fetches the blog first), `yarn test`, `yarn fetch-blog`.

## Conventions
- Default branch is `main`. Commit messages are plain, with no `Co-Authored-By` trailer.
- `src/data/blog-posts.ts` and `src/routeTree.gen.ts` are generated; do not edit them by hand.
- Contact and link targets use the `Haruru0-0` GitHub account and the proton email.

## Memory and code map
- At session start read `docs/memory/index.md`. Save durable decisions there as Markdown.
- `graphify-out/GRAPH_REPORT.md` summarizes code structure; refresh with `python -m graphify update .` (the `.exe` is blocked on this machine).
