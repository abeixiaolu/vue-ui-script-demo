import { execSync } from "node:child_process";
import path from "node:path";
import os from "node:os";

const repoUrl = "https://github.com/barbapapazes-sponsors/vue-ui";

export function addAllUIComponents() {
  // git clone 这个仓库到一个临时目录
  const tempDir = path.join(os.tmpdir(), "vue-ui");
  execSync(`git clone ${repoUrl} ${tempDir}`);
  // 删除 src/ 下的所有 .md 和 demo.vue 文件
  execSync(`find ${tempDir}/src/ -name "*.md" -type f -delete`);
  execSync(`find ${tempDir}/src/ -name "demo.vue" -type f -delete`);
  // 删除 src/ 下的所有子目录下的 __snapshots__ 文件夹及其内容
  execSync(
    `find ${tempDir}/src/ -type d -name "__snapshots__" -exec rm -rf {} +`
  );
  // 删除 src/usage 目录
  execSync(`rm -rf ${tempDir}/src/usage`);
  // 将这个仓库的 src/ 的内容复制到当前项目的 src/components/ui/ 目录下
  execSync(`cp -r ${tempDir}/src/ ${process.cwd()}/src/components/ui/`);
  // 删除临时目录
  execSync(`rm -rf ${tempDir}`);
}

addAllUIComponents();
