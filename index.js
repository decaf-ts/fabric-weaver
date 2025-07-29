import { PeerMiddleware } from "./lib/core/middlewares/PeerMiddleware.cjs";

const peerMiddleware = new PeerMiddleware(3000);

peerMiddleware.listen();
