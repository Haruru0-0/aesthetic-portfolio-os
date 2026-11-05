# Gotchas

See [[architecture]].

- **`src/data/blog-posts.ts` is generated.** Do not edit it by hand; run `yarn fetch-blog`. The daily workflow commits it, so pull before pushing.
- **`graphql-request` is no longer used** by the blog code but is still listed in `package.json`.
- **The README is out of date:** it says React 18 in a badge and lists no terminal or achievements. Check `package.json` for versions.
- **The routes file `routeTree.gen.ts` is generated** by TanStack Router.
- **`node_modules` is not installed in this checkout,** so the site has not been built or looked at since the 2026-11-02 changes.
- **`graphify.exe` is blocked on this machine;** use `python -m graphify update .`.
- **Project links and screenshots live in `src/components/pages/projects.tsx` and `src/assets/*.png`** (1843x1020 each). On 2026-11-05 Nebula's demo became `https://nebula-ai0.vercel.app/` and NotionCraft's `https://notioncraft-ai-silk.vercel.app/` (the older addresses came from accounts the author lost), and both screenshots were retaken from the live landing pages with headless Chromium (`--window-size=1843,1020 --virtual-time-budget=10000`). `vite build` rewrites the generated `src/routeTree.gen.ts`; revert it before committing. There are no tests, and `yarn install` needed about five minutes on a slow network.
