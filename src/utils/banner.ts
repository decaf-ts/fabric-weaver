import { Logger, Logging } from "@decaf-ts/logging";
import { style } from "styled-string-builder";
import slogans from "../assets/slogans.json";

const bannerBorder: string =
  "##########################################################################################";
const banner1: string[] = [];
const banner2: string[] = [];
const banner3: string[] = [];

function banner1Creation(log: Logger) {
  banner1.push(
    "#                                                                                        #"
  );

  banner1.push(
    "# ░▒▓████████▓▒░▒▓██████▓▒░░▒▓███████▓▒░░▒▓███████▓▒░░▒▓█▓▒░░▒▓██████▓▒░                 #"
  );
  banner1.push(
    "# ░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░                #"
  );
  banner1.push(
    "# ░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░▒▓█▓▒░                       #"
  );
  banner1.push(
    "# ░▒▓██████▓▒░░▒▓████████▓▒░▒▓███████▓▒░░▒▓███████▓▒░░▒▓█▓▒░▒▓█▓▒░                       #"
  );
  banner1.push(
    "# ░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░▒▓█▓▒░                       #"
  );
  banner1.push(
    "# ░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░                #"
  );
  banner1.push(
    "# ░▒▓█▓▒░     ░▒▓█▓▒░░▒▓█▓▒░▒▓███████▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓██████▓▒░                 #"
  );

  banner1.push(
    "#                                                                                        #"
  );
  banner1.push(
    "#                                                                                        #"
  );

  banner1.forEach((line) => {
    log.info.bind(log)(style(line || "").raw(getColor()).text);
  });
}

function banner2Creation(log: Logger) {
  banner2.push(
    "# ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓████████▓▒░░▒▓██████▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓████████▓▒░▒▓███████▓▒░  #"
  );
  banner2.push(
    "# ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ #"
  );
  banner2.push(
    "# ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒▒▓█▓▒░░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ #"
  );
  banner2.push(
    "# ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓██████▓▒░ ░▒▓████████▓▒░░▒▓█▓▒▒▓█▓▒░░▒▓██████▓▒░ ░▒▓███████▓▒░  #"
  );
  banner2.push(
    "# ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▓█▓▒░ ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ #"
  );
  banner2.push(
    "# ░▒▓█▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ ░▒▓█▓▓█▓▒░ ░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░ #"
  );
  banner2.push(
    "#  ░▒▓█████████████▓▒░░▒▓████████▓▒░▒▓█▓▒░░▒▓█▓▒░  ░▒▓██▓▒░  ░▒▓████████▓▒░▒▓█▓▒░░▒▓█▓▒░ #"
  );
  banner2.push(
    "#                                                                                        #"
  );

  banner2.forEach((line) => {
    log.info.bind(log)(style(line || "").raw(getColor()).text);
  });
}

function banner3Creation(log: Logger) {
  const message = getSlogan();

  const maxLength = banner1.reduce(
    (max, line) => Math.max(max, line.length),
    0
  );

  banner3.push(`#  ${message.Slogan.padStart(maxLength - 5)} #`);

  message.Tags = message.Tags.split(", ")
    .map((tag) => `#${tag.split(" ").join("")}`)
    .join(" ");

  banner3.push(
    "#                                                                                        #"
  );

  banner3.push(`#  ${message.Tags.padStart(maxLength - 5)} #`);
  banner3.push(
    "#                                                                                        #"
  );

  banner3.forEach((line, index) => {
    log.info.bind(log)(style(line || "").raw(colors[index]).text);
  });
}

const colors = [
  "\x1b[38;5;215m", // soft orange
  "\x1b[38;5;209m", // coral
  "\x1b[38;5;205m", // pink
  "\x1b[38;5;210m", // peachy
  "\x1b[38;5;217m", // salmon
  "\x1b[38;5;216m", // light coral
  "\x1b[38;5;224m", // light peach
  "\x1b[38;5;230m", // soft cream
  "\x1b[38;5;230m", // soft cream
];

let counter = 0;
function getColor() {
  counter++;

  if (counter >= colors.length) {
    counter = 0;
  }

  return colors[counter];
}

export function getSlogan(i?: number): { Slogan: string; Tags: string } {
  try {
    i =
      typeof i === "undefined" ? Math.floor(Math.random() * slogans.length) : i;
    return slogans[i];
  } catch (error: unknown) {
    throw new Error(`Failed to retrieve slogans: ${error}`);
  }
}

export function printBanner(skipBanner: boolean = false) {
  if (skipBanner) return;

  const log = Logging.for(printBanner);

  log.setConfig({
    timestamp: false,
    style: false,
    context: false,
    logLevel: false,
  });

  const border = bannerBorder
    .split("")
    .map((c) => {
      return style(c || "").raw(getColor()).text;
    })
    .join("");

  log.info(border);

  banner1Creation(log);
  banner2Creation(log);
  banner3Creation(log);

  log.info(border);
}
