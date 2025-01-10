import { execSync } from "node:child_process";
import path from "node:path";
import os from "node:os";

const repoUrl = "https://github.com/barbapapazes-sponsors/vue-ui";

export function addAllUIComponents() {
  const tempDir = path.join(os.tmpdir(), "vue-ui");
  execSync(`git clone ${repoUrl} ${tempDir}`);
  // remove un relevant files
  execSync(`find ${tempDir}/src/ -name "*.md" -type f -delete`);
  execSync(`find ${tempDir}/src/ -name "demo.vue" -type f -delete`);
  execSync(
    `find ${tempDir}/src/ -type d -name "__snapshots__" -exec rm -rf {} +`
  );
  execSync(`rm -rf ${tempDir}/src/usage`);

  // copy all components to src/components/ui/
  execSync(`cp -r ${tempDir}/src/ ${process.cwd()}/src/components/ui/`);
  execSync(`rm -rf ${tempDir}`);
}

addAllUIComponents();
