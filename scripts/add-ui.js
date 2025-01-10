import { execSync } from "node:child_process";

const repoUrl = "https://github.com/barbapapazes-sponsors/vue-ui";

export function addUi() {
  // git clone 这个仓库到一个临时目录
  const tempDir = path.join(os.tmpdir(), "vue-ui");
  execSync(`git clone ${repoUrl} ${tempDir}`);
  // 将这个仓库的 src/ 的内容复制到当前项目的 src/components/ui/ 目录下
  execSync(`cp -r ${tempDir}/src/ ${process.cwd()}/src/components/ui/`);
  // 删除临时目录
  execSync(`rm -rf ${tempDir}`);
}

addUi();
