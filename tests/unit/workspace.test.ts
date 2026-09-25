import fs from "node:fs/promises";
import path from "node:path";
import {
  createWorkspace,
  writeWorkspaceFile,
} from "../../src/docker/images/workspace";
import type { Workspace } from "../../src/docker/images/types";

describe("workspace", () => {
  const created: Workspace[] = [];

  afterEach(async () => {
    for (const workspace of created.splice(0)) {
      await fs.rm(workspace.path, { recursive: true, force: true });
    }
  });

  describe("createWorkspace", () => {
    it("creates a temporary directory with the weaver prefix", async () => {
      const workspace = await createWorkspace();
      created.push(workspace);
      expect(path.basename(workspace.path).startsWith("weaver-images-")).toBe(
        true
      );
      const stats = await fs.stat(workspace.path);
      expect(stats.isDirectory()).toBe(true);
    });

    it("removes the directory on cleanup", async () => {
      const workspace = await createWorkspace();
      await workspace.cleanup();
      await expect(fs.stat(workspace.path)).rejects.toThrow();
    });

    it("is idempotent on cleanup", async () => {
      const workspace = await createWorkspace();
      await workspace.cleanup();
      await expect(workspace.cleanup()).resolves.toBeUndefined();
    });

    it("keeps the directory when keepWorkdir is true", async () => {
      const workspace = await createWorkspace({ keepWorkdir: true });
      created.push(workspace);
      await workspace.cleanup();
      const stats = await fs.stat(workspace.path);
      expect(stats.isDirectory()).toBe(true);
    });
  });

  describe("writeWorkspaceFile", () => {
    it("writes content and returns an absolute path inside the workspace", async () => {
      const workspace = await createWorkspace();
      created.push(workspace);
      const filePath = await writeWorkspaceFile(
        workspace,
        "Dockerfile-ca",
        "FROM scratch\n"
      );
      expect(path.isAbsolute(filePath)).toBe(true);
      expect(filePath.startsWith(workspace.path)).toBe(true);
      expect(filePath).toBe(path.join(workspace.path, "Dockerfile-ca"));
      const content = await fs.readFile(filePath, "utf8");
      expect(content).toBe("FROM scratch\n");
    });
  });
});
