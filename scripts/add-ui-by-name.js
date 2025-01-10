import { execSync } from "node:child_process";
import path from "node:path";
import os from "node:os";
import fs from "node:fs";
import { parseModule } from "magicast";

const repoUrl = "https://github.com/barbapapazes-sponsors/vue-ui";
const pkgContent = fs.readFileSync(
  path.join(process.cwd(), "package.json"),
  "utf-8"
);
const pkg = JSON.parse(pkgContent);
const externalDependencies = new Set();
export function addUiComponentByName(name) {
  const tempDir = path.join(os.tmpdir(), "vue-ui");
  execSync(`rm -rf ${tempDir}`);

  execSync(`git clone ${repoUrl} ${tempDir}`);
  // remove un relevant files
  execSync(`find ${tempDir}/src/ -name "*.md" -type f -delete`);
  execSync(`find ${tempDir}/src/ -name "demo.vue" -type f -delete`);
  execSync(
    `find ${tempDir}/src/ -type d -name "__snapshots__" -exec rm -rf {} +`
  );
  execSync(`rm -rf ${tempDir}/src/usage`);

  addComponent(name, tempDir);

  execSync(`rm -rf ${tempDir}`);

  const existingDependencies = Object.keys(pkg.dependencies);
  const needInstallDependencies = Array.from(externalDependencies).filter(
    (dep) => !existingDependencies.includes(dep)
  );
  if (needInstallDependencies.length > 0) {
    console.log(
      "\x1b[31m%s\x1b[0m",
      `\nYou need to add these dependencies manually: "${needInstallDependencies.join(
        " "
      )}"`
    );
  }

  console.log(
    "\x1b[32m%s\x1b[0m",
    `\nDone! ${name} has been added to your project.`
  );
}

// 从命令行读取 name 参数
const name = process.argv[2];
addUiComponentByName(name);

function addComponent(name, tempDir) {
  execSync(`mkdir -p ${process.cwd()}/src/components/ui/components`);

  execSync(
    `cp -r ${tempDir}/src/components/${name} ${process.cwd()}/src/components/ui/components`
  );
  // analyze dependencies
  const componentFile = `${tempDir}/src/components/${name}/${name}.vue`;
  const componentContent = fs.readFileSync(componentFile, "utf-8");
  const optionsScript = extractComponentScriptTag(componentContent);
  const dependencies = getDependencies(optionsScript);
  addRelatedDeps(dependencies, tempDir);
}

function extractComponentScriptTag(content) {
  const scriptTag = content
    .match(/<script lang="ts">([\s\S]*?)<\/script>/)
    ?.at(1);

  if (!scriptTag) {
    throw new Error(`No script tag found in ${content}`);
  }

  return scriptTag;
}

function extractImports(module) {
  const imports = {
    components: new Set(),
    keys: new Set(),
    composables: new Set(),
    utils: new Set(),
    types: new Set(),
    theme: new Set(),
    icons: new Set(),
  };

  for (const item of module.$ast.body) {
    if (item.type === "ImportDeclaration") {
      if (item.source.value.startsWith("@/ui/")) {
        const spitedItem = item.source.value.split("/");
        if (item.source.value.endsWith(".vue")) {
          const componentName = spitedItem[spitedItem.length - 1].replace(
            ".vue",
            ""
          );
          imports.components.add(componentName);
        } else if (item.source.value.startsWith("@/ui/keys/")) {
          const keyName = spitedItem[spitedItem.length - 1].replace(".ts", "");
          imports.keys.add(keyName);
        } else if (item.source.value.startsWith("@/ui/composables/")) {
          const composableName = spitedItem[spitedItem.length - 1].replace(
            ".ts",
            ""
          );
          imports.composables.add(composableName);
        } else if (item.source.value.startsWith("@/ui/utils/")) {
          const utilsName = spitedItem[spitedItem.length - 1].replace(
            ".ts",
            ""
          );
          imports.utils.add(utilsName);
        } else if (item.source.value.startsWith("@/ui/types/")) {
          const typeName = spitedItem[spitedItem.length - 1].replace(".ts", "");
          imports.types.add(typeName);
        } else if (item.source.value.startsWith("@/ui/theme/")) {
          const themeName = spitedItem[spitedItem.length - 1].replace(
            ".ts",
            ""
          );
          imports.theme.add(themeName);
        } else if (item.source.value.startsWith("@/ui/icons")) {
          const iconName = spitedItem[spitedItem.length - 1].replace(".ts", "");
          imports.icons.add(iconName === "icons" ? "index" : iconName);
        }
      } else if (!item.source.value.startsWith(".")) {
        externalDependencies.add(item.source.value);
      }
    }
  }

  return imports;
}

function getDependencies(optionsScript) {
  const parsedOptionsScript = parseModule(optionsScript);
  const imports = extractImports(parsedOptionsScript);
  return imports;
}

function addRelatedDeps(dependencies, tempDir) {
  Object.keys(dependencies).forEach((key) => {
    dependencies[key].forEach((item) => {
      if (key === "components") {
        addComponent(item, tempDir);
      } else {
        // 确保目标目录存在
        execSync(`mkdir -p ${process.cwd()}/src/components/ui/${key}`);
        const depFile = `${tempDir}/src/${key}/${item}.ts`;
        const targetFile = `${process.cwd()}/src/components/ui/${key}/${item}.ts`;
        if (fs.existsSync(targetFile)) return;
        execSync(`cp -r ${depFile} ${targetFile}`);
        const depContent = fs.readFileSync(depFile, "utf-8");
        const depDependencies = getDependencies(depContent);
        addRelatedDeps(depDependencies, tempDir);
      }
    });
  });
}
