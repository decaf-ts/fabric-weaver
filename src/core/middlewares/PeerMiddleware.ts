import { Express, Response, Request } from "express";
import express from "express";
import { DEFAULT_PORT, MiddlewareRoutes } from "../constants/peer-middleware";
import { Logger, Logging, LogLevel } from "@decaf-ts/logging";
// import { info, mkdir, rm } from "@aeon/fabric-integration";
// import * as express from "express";
// import * as fs from "fs";
// import * as path from "path";
// import { Express } from "express";
// import { execSync } from "child_process";
// import { peerBootConfig } from "../utils/types";
// import { copyAndOverrideYaml } from "../utils/genesis";
// import * as bodyParser from "body-parser";
// import { MiddlewareRoutes } from "../../shared";

export class PeerMiddleware {
  private readonly app: Express;
  private readonly port: number;
  private readonly log: Logger;

  //Change later mock security
  private accessKeys: string[] = []; // Mock security, replace with actual access keys

  constructor(port: number) {
    this.app = express();
    this.port = port || DEFAULT_PORT;
    this.log = Logging.for(PeerMiddleware);

    this.log.setConfig({
      level: LogLevel.debug,
    });

    //    this.app.use(bodyParser.json({ limit: '50mb' })); // Adjust the size as needed
    // this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

    // Middleware to parse JSON
    this.app.use(express.json());

    // Route Setup
    this.routes();
  }

  private routes(): void {
    const methodNames = Object.getOwnPropertyNames(
      Object.getPrototypeOf(this)
    ).filter(
      (name) =>
        name !== "constructor" &&
        typeof this[name as keyof PeerMiddleware] === "function" &&
        name !== "routes" &&
        name !== "listen"
    );

    for (const methodName of methodNames) {
      try {
        this[methodName as keyof PeerMiddleware]();
      } catch (error) {
        this.log.error(`Error calling method ${methodName}: ${error}`);
      }
    }
  }

  private addAccessKey(): void {
    this.log.info("Adding access key endpoint registered");

    const addKey = (req: Request, res: Response) => {
      this.log.info("Received request to add access key");

      const body = req.body;

      this.log.debug(`Received access key: ${body.accessKey}`);

      if (!body.accessKey) {
        return res.status(400).send({ error: "Missing access key" });
      }
      if (this.accessKeys.includes(body.accessKey)) {
        return res.status(409).send({ error: "Access key already exists" });
      }
      this.accessKeys.push(body.accessKey);

      this.log.debug(`Access keys: ${this.accessKeys.join(", ")}`);
      res
        .status(201)
        .contentType("application/json")
        .send({ message: "Access key added successfully" });
    };

    this.app.post(`${MiddlewareRoutes.ACCESS_KEY}`, addKey);
  }

  private hello(): void {
    this.app.get("/", (req, res) => {
      res.send("Hello, world!");
    });
  }

  private healthcheck(): void {
    this.log.info("Healthcheck endpoint registered");
    const healthcheck = (req: Request, res: Response) => {
      res.status(200).contentType("application/json").send({ message: "OK" });
    };

    this.app.get(`${MiddlewareRoutes.HEALTZ}`, healthcheck);
  }

  // private handleOrganizationEnroll(req: express.Request, res: express.Response): void{
  //     const orgDetails = req.body

  //     try {
  //         mkdir('./temp/');

  //         const replacements = {
  //             ORG_NAME: orgDetails.name,
  //             ORG_MSPID: orgDetails.id,
  //             ORG_MSPDIR: "/aeon/temp/ca/peers/peer-0/client/msp"
  //         }

  //         copyAndOverrideYaml('./configs/orgtx.yaml', './temp/configtx.yaml', replacements)

  //         fs.writeFileSync('./temp/mspdir.tar.gz', Buffer.from(orgDetails.mspdir));

  //         execSync('tar -xvf ./temp/mspdir.tar.gz -C ./temp');

  //         execSync(`peer channel fetch config ./temp/config_block.pb \
  //             --channelID '${this.config.channel.name}' \
  //             --orderer '${this.config.channel.ordererEndpoint}' \
  //             --tls \
  //             --cafile '${this.config.tls.tls}'`);

  //         execSync(`configtxlator proto_decode --input ./temp/config_block.pb \
  //             --type common.Block \
  //             --output ./temp/config_block.json`);

  //         execSync(`jq .data.data[0].payload.data.config ./temp/config_block.json > ./temp/config.json`);

  //         execSync(`cd temp && configtxgen -printOrg ${orgDetails.name} > ./org.json`) ;

  //         execSync( `jq -s '.[0] * {"channel_group":{"groups":{"Application":{"groups": {"${orgDetails.name}":.[1]}}}}}' \
  //             ./temp/config.json \
  //             ./temp/org.json > ./temp/modified_config.json`);

  //         execSync(`configtxlator proto_encode \
  //             --input ./temp/config.json \
  //             --type common.Config \
  //             --output ./temp/config.pb`);

  //         execSync( `configtxlator proto_encode \
  //             --input ./temp/modified_config.json \
  //             --type common.Config \
  //             --output ./temp/modified_config.pb`);

  //         execSync(`configtxlator compute_update \
  //             --channel_id aeon-main \
  //             --original ./temp/config.pb \
  //             --updated ./temp/modified_config.pb \
  //             --output ./temp/org_update.pb`);

  //         execSync(`configtxlator proto_decode \
  //             --input ./temp/org_update.pb \
  //             --type common.ConfigUpdate \
  //             --output ./temp/org_update.json`);

  //         execSync(`echo '{"payload":{"header":{"channel_header":{"channel_id":"'${this.config.channel.name}'", "type":2}},"data":{"config_update":'$(cat ./temp/org_update.json)'}}}' \
  //             | jq . > ./temp/org_update_in_envelope.json`);

  //         execSync( `configtxlator proto_encode \
  //             --input ./temp/org_update_in_envelope.json \
  //             --type common.Envelope \
  //             --output ./temp/org_update_in_envelope.pb`);

  //         execSync(`cd temp && peer channel signconfigtx \
  //             -f ./org_update_in_envelope.pb`);

  //         execSync(`peer channel update \
  //             -f ./temp/org_update_in_envelope.pb \
  //             -c ${this.config.channel.name} \
  //             -o ${this.config.channel.ordererEndpoint} \
  //             --tls \
  //             --cafile ${this.config.tls.tls}`);

  //         res.status(200).send({success:true})

  //     } catch(e:unknown) {
  //         res.status(500).send(e)
  //     } finally {
  //         rm("./temp");
  //     }
  // }

  // private handleOrganizationPeerAnchor(req: express.Request, res: express.Response): void{
  //     const body = req.body

  //     try {
  //         mkdir('./temp/');

  //         fs.writeFileSync(path.join(process.cwd(), "temp/anchor_update_in_envelope.pb"), Buffer.from(body.block))

  //         execSync(`peer channel update \
  //             -f /aeon/temp/anchor_update_in_envelope.pb \
  //             --channelID ${this.config.channel.name} \
  //             --orderer ${this.config.channel.ordererEndpoint} \
  //             --tls \
  //             --cafile ${this.config.channel.ordererCaFile}`);

  //         res.status(200).send({success:true})
  //     } catch (e: unknown) {
  //         res.status(500).send(e)
  //     } finally {
  //         rm("./temp");
  //     }
  // }

  listen(): void {
    this.app.listen(this.port, () => {
      this.log.info(`Peer Middleware running on port: ${this.port}`);
    });
  }
}
