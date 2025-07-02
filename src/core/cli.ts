// import { CoreCLI } from "./cli/core-cli";
import { FabricCAServerCLI } from "./cli/fabric-ca-server-cli";

// Create and run the Core CLI
// const cli = new CoreCLI();
const server = new FabricCAServerCLI();
// cli.run();
server.run();
