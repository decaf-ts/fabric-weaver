import { Contract } from "fabric-contract-api";
import crypto from "crypto";

class BasicContract extends Contract {
  constructor() {
    super("BasicContract");
  }

  async instantiate() {
    // function that will be invoked on chaincode instantiation
  }

  async put(ctx, key, value) {
    console.log("KEY: ", key);
    console.log("VALUE: ", value);
    await ctx.stub.putState(key, Buffer.from(value));
    return { success: "OK" };
  }

  async get(ctx, key) {
    console.log("KEY: ", key);
    const buffer = await ctx.stub.getState(key);
    console.log("BUFFER: ", buffer);
    if (!buffer || !buffer.length) return { error: "NOT_FOUND" };
    return { success: buffer.toString() };
  }

  async putPrivateMessage(ctx, collection) {
    const transient = ctx.stub.getTransient();
    const message = transient.get("message");
    await ctx.stub.putPrivateData(collection, "message", message);
    return { success: "OK" };
  }

  async getPrivateMessage(ctx, collection) {
    const message = await ctx.stub.getPrivateData(collection, "message");
    const messageString = message.toBuffer
      ? message.toBuffer().toString()
      : message.toString();
    return { success: messageString };
  }

  async verifyPrivateMessage(ctx, collection) {
    const transient = ctx.stub.getTransient();
    const message = transient.get("message");
    const messageString = message.toBuffer
      ? message.toBuffer().toString()
      : message.toString();
    const currentHash = crypto
      .createHash("sha256")
      .update(messageString)
      .digest("hex");
    const privateDataHash = (
      await ctx.stub.getPrivateDataHash(collection, "message")
    ).toString("hex");
    if (privateDataHash !== currentHash) {
      return { error: "VERIFICATION_FAILED" };
    }
    return { success: "OK" };
  }
}

exports.contracts = [BasicContract];
