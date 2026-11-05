import { cpSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const target = resolve(root, "projects/portfolio-site");

for (const directory of ["app", "components", "lib"]) {
  const destination = resolve(target, "src", directory);
  mkdirSync(destination, { recursive: true });
  cpSync(resolve(root, directory), destination, { recursive: true, force: true });
}

mkdirSync(resolve(target, "public"), { recursive: true });
cpSync(resolve(root, "public"), resolve(target, "public"), {
  recursive: true,
  force: true,
});
cpSync(resolve(root, "next.config.mjs"), resolve(target, "next.config.mjs"));
