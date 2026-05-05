# Consumer Proof

This repo is the external generated Todo consumer. It proves that the published
CLI, catalog, template, generator packages, generated app compile, and generated
runtime path work together.

## Required Gates

```bash
npm run check
npm run generate
npm run app:compile
npm run app:runtime
```

GitHub Actions `Demo Verification` must also run those surfaces.

The gate must:

- create a fresh Todo project from the default catalog alias with
  `topogram new <target> --template todo`;
- verify catalog and template visibility/status commands;
- run `topogram check`;
- run component conformance and component behavior proof;
- run template policy/update/trust checks;
- run `npm run generate`;
- run generated app compile;
- run generated runtime checks against Postgres.

## Not Acceptable

- Verifying only a checked-in catalog fixture.
- Skipping generated runtime because compile passed.
- Treating sentinel files or generated paths as the app proof.
- Hand-editing package-lock registry metadata instead of using the CLI update
  command.
