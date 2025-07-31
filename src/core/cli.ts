#!/usr/bin/env node
import { CoreCLI } from "./cli/core-cli";

const server = new CoreCLI();
server.run();
