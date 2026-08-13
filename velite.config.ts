import { defineConfig } from 'velite';

export default defineConfig({
  // why: root and output both equal the library defaults and are declared
  // anyway. project.md §1 fixes content/ at the repository root and §2.3 of
  // architecture.md maps #site/content to this output path — a default that
  // shifts in a minor would move both in silence.
  root: 'content',
  // why: `clean` and `strict` are deliberately absent. Both are readable here
  // and both are dead under the CLI: velite's argument parser defaults each
  // flag to `false`, and resolveConfig merges with `??`, so the config value is
  // never consulted. They live on the command line in package.json instead
  // (D-139). Every other option below is read from this file.
  output: {
    data: '.velite',
  },
  // why: empty until T-20. content/ does not exist and §1 of project.md forbids
  // committing an empty directory, so this task ships the pipeline alone and
  // T-20 ships the first collection together with the files that justify it.
  collections: {},
});
