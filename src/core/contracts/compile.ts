import {
  ENTRY_PLACEHOLDER,
  NAME_PLACEHOLDER,
  VERSION_PLACEHOLDER,
} from "../constants/constants";

import fs from "fs";
import { Logging } from "@decaf-ts/logging";
import path from "path";
import ts from "typescript";

export function resolvePath(inputPath: string): string {
  return path.isAbsolute(inputPath)
    ? inputPath
    : path.resolve(process.cwd(), inputPath);
}

export function compileStandaloneFile(filePath: string, outDir: string) {
  const compilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.CommonJS,
    allowJs: true,
    checkJs: true,
    declaration: false,
    declarationMap: false,
    emitDeclarationOnly: false,
    isolatedModules: true,
    sourceMap: false,
    removeComments: true,
    strict: true,
    skipLibCheck: true,
    resolveJsonModule: true,
    forceConsistentCasingInFileNames: true,
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    noImplicitAny: true,
    useDefineForClassFields: true,
    allowSyntheticDefaultImports: true,
    esModuleInterop: false,
    outDir,
  };

  const host = ts.createCompilerHost(compilerOptions);
  host.writeFile = (fileName, content) => {
    const outputPath = path.join(outDir, path.basename(fileName));
    fs.writeFileSync(outputPath, content);
    console.log(`Written: ${outputPath}`);
  };

  const program = ts.createProgram(
    [path.join(resolvePath(filePath))],
    compilerOptions,
    host
  );
  const emitResult = program.emit();

  const diagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  diagnostics.forEach((diagnostic) => {
    if (diagnostic.file && diagnostic.start !== undefined) {
      const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start
      );
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        "\n"
      );
      console.log(
        `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
      );
    } else {
      console.log(
        ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
      );
    }
  });

  const exitCode = emitResult.emitSkipped ? 1 : 0;

  overrideContractImports(outDir);
  console.log(`Process exited with code ${exitCode}`);
}

export function overrideContractImports(folderPath: string) {
  folderPath = resolvePath(folderPath);
  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    console.log(filePath);

    if (fs.statSync(filePath).isFile() && file.toLowerCase().endsWith(".js")) {
      // Read file content
      const content = fs.readFileSync(filePath, "utf8");

      // Parse/transform
      const newContent = overrideDoubleDotImports(content);

      // Write back to file
      fs.writeFileSync(filePath, newContent, "utf8");
    }
  });
}

export function overrideDoubleDotImports(code: string) {
  return code.replace(
    /require\(\s*["']((?:\.\.\/)+(?:[^/"']+\/)*([^/"']+)|\.\/(?:[^/"']+\/)*([^/"']+))["']\s*\)/g,
    (match, p1, p2, p3) => {
      const lastSegment = p2 || p3;
      return `require("./${lastSegment}")`;
    }
  );
}
export async function addPackage(
  contractName: string,
  version: string,
  destinationDirectory: string
) {
  const log = Logging.for(addPackage);
  const inputFiles = ["package.json", "package-lock.json"];

  fs.mkdirSync(resolvePath(destinationDirectory), { recursive: true });

  for (const file of inputFiles) {
    const inputPath = path.join(__dirname, "../..", "assets", file);

    if (!fs.existsSync(inputPath)) {
      log.info(`File not found: ${inputPath}`);
      continue;
    }

    const content = fs.readFileSync(inputPath, "utf-8");

    const replacedContent = content
      .replaceAll(new RegExp(VERSION_PLACEHOLDER, "g"), version.toString())
      .replaceAll(new RegExp(NAME_PLACEHOLDER, "g"), contractName.toLowerCase())
      .replaceAll(
        new RegExp(ENTRY_PLACEHOLDER, "g"),
        `${contractName.toLowerCase()}.js`
      );

    fs.writeFileSync(
      path.join(resolvePath(destinationDirectory), file),
      replacedContent,
      "utf-8"
    );

    log.info(
      `Add ${file} to ${destinationDirectory} for contract ${contractName}`
    );
  }
}
