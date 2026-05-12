import fs from "fs";
import path from "path";

const root = process.cwd();
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf-8"));
let manifest = fs.readFileSync(path.join(root, "manifests", "vss-extension.json"), "utf-8");

manifest = manifest
    .replaceAll("#{Id}#", packageJson.name)
    .replaceAll("#{Version}#", packageJson.version)
    .replaceAll("#{Publisher}#", packageJson.author)
    .replaceAll("#{Description}#", packageJson.description);

fs.writeFileSync(
    path.join(root, "dist", "vss-extension.json"),
    manifest
);

console.log("Manifest vss-extension.json generated");