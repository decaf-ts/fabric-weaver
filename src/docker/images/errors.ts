import type { WeaverImagesErrorContext } from "./types";

export class WeaverImagesError extends Error {
  readonly operation?: string;
  readonly component?: string;
  readonly variant?: string;
  readonly command?: string;
  override readonly cause?: unknown;

  constructor(message: string, context: WeaverImagesErrorContext = {}) {
    super(message);
    this.name = "WeaverImagesError";
    this.operation = context.operation;
    this.component = context.component;
    this.variant = context.variant;
    this.command = context.command;
    this.cause = context.cause;
  }
}
