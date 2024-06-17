#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Check for the required arguments
if (process.argv.length !== 4) {
  console.log("Usage: <script> <manifest-path> <output-path>");
  process.exit(1);
}

const parseModelName = (model) => {
  // Define a set of known acronyms
  const acronyms = new Set(["ERC"]);

  return model.name
    .split("::")
    .pop()
    .split("_")
    .map((part) => {
      // If the part is a known acronym, keep it in uppercase
      if (acronyms.has(part.toUpperCase())) {
        return part.toUpperCase();
      }
      // If the part is fully numeric, keep it as is
      if (!isNaN(parseInt(part))) {
        return part;
      }
      // Capitalize the first letter and make the rest lowercase
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join("");
};

// Extract paths from command-line arguments
const manifestPath = path.resolve(process.argv[2]);
const jsFilePath = path.resolve(process.argv[3]);

// Extract recs package version
const isRecsVersion2 = true;
console.log(
  `...generating for @dojoengine/recs version ${
    isRecsVersion2
      ? "2 (bigint support, Entity as string)"
      : "1 (no bigint, EntityIndex as number)"
  }`,
);

const cairoToRecsType = {
  bool: "RecsType.Boolean",
  u8: "RecsType.Number",
  u16: "RecsType.Number",
  u32: "RecsType.Number",
  u64: "RecsType.Number",
  usize: "RecsType.Number",
  u128: isRecsVersion2 ? "RecsType.BigInt" : "RecsType.Number",
  u256: isRecsVersion2 ? "RecsType.BigInt" : "RecsType.NumberArray",
  felt252: isRecsVersion2 ? "RecsType.BigInt" : "RecsType.Number",
  ContractAddress: isRecsVersion2 ? "RecsType.String" : "RecsType.String",
};

const manifestStr = fs.readFileSync(manifestPath, "utf8");
const manifest = JSON.parse(manifestStr);

let fileContent = `/* Autogenerated file. Do not edit manually. */\n\n`;
fileContent += `import { defineComponent, Type as RecsType, World } from "@dojoengine/recs";\n\n`;

fileContent += `export type ContractComponents = Awaited<ReturnType<typeof defineContractComponents>>;\n\n`;

fileContent += `export function defineContractComponents(world: World) {\n  return {\n`;

manifest.models.forEach((model) => {
  let types = [];

  const tableName = parseModelName(model);
  fileContent += `    ${tableName}: (() => {\n`;
  fileContent += `      return defineComponent(\n        world,\n        {\n`;

  model.members.forEach((member) => {
    let memberType = cairoToRecsType[member.type] ?? "RecsType.Number"; // Default type set to Number
    fileContent += `          ${member.name}: ${memberType},\n`;
    types.push(member.type);
  });

  fileContent += `        },\n        {\n`;
  fileContent += `          metadata: {\n`;
  fileContent += `            name: "${tableName}",\n`;
  if (isRecsVersion2) {
    fileContent += `            types: ${JSON.stringify(types)},\n`;
  }
  fileContent += `          },\n        }\n      );\n    })(),\n`;
});

fileContent += `  };\n}\n`;

fs.writeFile(jsFilePath, fileContent, (err) => {
  if (err) {
    console.log("Error writing file:", err);
  } else {
    console.log("File generated successfully");
  }
});
