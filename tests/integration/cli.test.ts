import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(__dirname, "..", "..");
const binPath = path.join(rootDir, "lib", "cjs", "bin", "weaver-images.cjs");
const hasBin = fs.existsSync(binPath);

const describeIntegration = hasBin ? describe : describe.skip;

describeIntegration("weaver-images CLI integration", () => {
  const run = (...args: string[]) =>
    spawnSync(process.execPath, [binPath, ...args], {
      cwd: rootDir,
      encoding: "utf8",
    });

  it("prints the package version for --version", () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(rootDir, "package.json"), "utf8")
    ) as { version: string };
    const result = run("--version");
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe(pkg.version);
  });

  it("prints help with the CLI name and dry-run flag", () => {
    const result = run("--help");
    expect(result.status).toBe(0);
    const output = `${result.stdout}${result.stderr}`;
    expect(output).toContain("weaver-images");
    expect(output).toContain("--dry-run");
  });

  it("plans a clean ca image without pushing on a dry run", () => {
    const result = run(
      "--dry-run",
      "--image-version",
      "9.9.9",
      "--component",
      "ca"
    );
    expect(result.status).toBe(0);
    const output = `${result.stdout}${result.stderr}`;
    expect(output).toContain("ca-base:9.9.9");
    expect(output).toContain("--target clean");
    expect(output).not.toContain("docker push");
  });

  it("accepts the leading build positional on a dry run", () => {
    const result = run(
      "build",
      "--dry-run",
      "--image-version",
      "9.9.9",
      "--component",
      "ca"
    );
    expect(result.status).toBe(0);
    const output = `${result.stdout}${result.stderr}`;
    expect(output).toContain("ca-base:9.9.9");
    expect(output).toContain("--target clean");
  });
});
