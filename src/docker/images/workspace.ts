import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { WORKSPACE_PREFIX } from "./constants";
import type { Workspace, WorkspaceFactory } from "./types";

export async function createWorkspace(
  options: { keepWorkdir?: boolean } = {}
): Promise<Workspace> {
  const workspacePath = await fs.mkdtemp(
    path.join(os.tmpdir(), WORKSPACE_PREFIX)
  );
  let cleaned = false;
  return {
    path: workspacePath,
    cleanup: async () => {
      if (cleaned) {
        return;
      }
      cleaned = true;
      if (options.keepWorkdir) {
        return;
      }
      await fs.rm(workspacePath, { recursive: true, force: true });
    },
  };
}

export const defaultWorkspaceFactory: WorkspaceFactory = (options) =>
  createWorkspace(options);

export async function writeWorkspaceFile(
  workspace: Workspace,
  name: string,
  content: string
): Promise<string> {
  const filePath = path.join(workspace.path, name);
  await fs.writeFile(filePath, content, "utf8");
  return filePath;
}
