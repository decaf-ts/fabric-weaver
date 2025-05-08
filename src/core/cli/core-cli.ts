import { BaseCLI } from "./base-cli";

export class CoreCLI extends BaseCLI {
  constructor() {
    super("weaver-core", "CLI for Core functionality");
    this.setupCommands();
  }

  private setupCommands() {
    // Add docker-specific commands here
    this.program
      .command("hello")
      .description("A base command")
      .action(() => {
        this.log.info("Hello world");
      });
  }
}
