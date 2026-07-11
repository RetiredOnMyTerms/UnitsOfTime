# Contributing

Thanks for taking a look at UnitsOfTime. This is a small personal project, so the process is deliberately lightweight.

## Workflow

1. Fork the repository (or, if you have write access, create a branch directly).
2. Make your change. Try to keep pull requests focused on one thing.
3. Run the checks below before opening a pull request.
4. Open a pull request against `main` describing what changed and why.

`main` requires a passing review before merging, so expect a round of feedback rather than an instant merge.

## Local setup

```bash
npm install
npm run dev      # dev server with hot reload
npm run build     # type-check + production build
npm run lint       # oxlint
```

## Before opening a PR

- [ ] `npm run build` passes (this runs the TypeScript compiler and the production build)
- [ ] `npm run lint` passes
- [ ] You've manually exercised the part of the app you changed in a browser

There's no automated test suite yet — manual verification in the browser is the bar for now.

## Code style

- No unnecessary comments — code should read clearly on its own
- Keep components presentational where possible; app state and mutations live in `src/units/useUnitsApp.ts`, derived/view-model logic in `src/units/logic.ts`
- Don't add dependencies for something a few lines of code can do

## Security

Please don't open a public issue for a security vulnerability — see [SECURITY.md](SECURITY.md).
