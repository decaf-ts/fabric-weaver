import { FabricCAServerCommandBuilder } from "../../src/fabric/fabric-ca-server-old/fabric-ca-server";
import { FabricCAServerCommand } from "../../src/fabric/fabric-ca-server-old/constants";
import { Logger } from "@decaf-ts/logging";

describe("FabricCAServerCommandBuilder", () => {
  describe("setCommand", () => {
    it("should set the command when a valid FabricCAServerCommand is provided", () => {
      const builder = new FabricCAServerCommandBuilder();
      const command = FabricCAServerCommand.START;

      // Mock the log.debug method
      const mockDebug = jest.fn();
      builder["log"] = { debug: mockDebug } as unknown as Logger;

      const result = builder.setCommand(command);

      expect(result).toBe(builder);
      expect(builder["command"]).toBe(command);
      expect(mockDebug).toHaveBeenCalledWith(`Setting command: ${command}`);
    });

    it("should not modify the command when undefined is passed", () => {
      const builder = new FabricCAServerCommandBuilder();
      const initialCommand = builder["command"];

      // Mock the log.debug method
      const mockDebug = jest.fn();
      builder["log"] = { debug: mockDebug } as unknown as Logger;

      const result = builder.setCommand(undefined);

      expect(result).toBe(builder);
      expect(builder["command"]).toBe(initialCommand);
      expect(mockDebug).not.toHaveBeenCalled();
    });

    it("should handle empty string as a valid command input", () => {
      const builder = new FabricCAServerCommandBuilder();

      // Mock the log.debug method
      const mockDebug = jest.fn();
      builder["log"] = { debug: mockDebug } as unknown as Logger;

      const result = builder.setCommand("" as FabricCAServerCommand);

      expect(result).toBe(builder);
      expect(builder["command"]).toBe("");
      expect(mockDebug).toHaveBeenCalledWith("Setting command: ");
    });

    it("should maintain the last set command when called multiple times", () => {
      const builder = new FabricCAServerCommandBuilder();

      builder.setCommand(FabricCAServerCommand.START);
      expect(builder["command"]).toBe(FabricCAServerCommand.START);

      builder.setCommand(FabricCAServerCommand.INIT);
      expect(builder["command"]).toBe(FabricCAServerCommand.INIT);

      builder.setCommand(FabricCAServerCommand.VERSION);
      expect(builder["command"]).toBe(FabricCAServerCommand.VERSION);
    });

    it("should work correctly when chained with other methods", () => {
      const builder = new FabricCAServerCommandBuilder();
      const result = builder
        .setCommand(FabricCAServerCommand.START)
        .setPort(7054)
        .enableDebug(true);

      expect(result).toBe(builder);
      expect(builder["command"]).toBe(FabricCAServerCommand.START);
      expect(builder["args"].get("port")).toBe(7054);
      expect(builder["args"].get("debug")).toBe(true);
    });

    it("should handle all possible values of the FabricCAServerCommand enum", () => {
      const builder = new FabricCAServerCommandBuilder();
      const commands = Object.values(FabricCAServerCommand);

      commands.forEach((command) => {
        const result = builder.setCommand(command);

        expect(result).toBe(builder);
        expect(builder["command"]).toBe(command);
      });

      expect(commands.length).toBeGreaterThan(0);
    });

    it("should only modify the 'command' property when setCommand is called", () => {
      const builder = new FabricCAServerCommandBuilder();
      const initialState = { ...builder };
      const newCommand = FabricCAServerCommand.INIT;

      builder.setCommand(newCommand);

      expect(builder["command"]).toBe(newCommand);
      Object.keys(initialState).forEach((key) => {
        if (key !== "command") {
          expect(builder[key]).toEqual(initialState[key]);
        }
      });
    });
  });
});
