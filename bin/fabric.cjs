#!/usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');
var axios = require('axios');
var child_process = require('child_process');
var commander = require('commander');
require('@decaf-ts/utils');
require('js-yaml');

/**
 * @module build-scripts
 * @description Custom build scripts for the fabric-weaver project.
 * @summary This module extends the BuildScripts class from @decaf-ts/utils to provide custom build functionality for the fabric-weaver project. It includes utilities for building command-line interfaces and handling different module formats (CommonJS and ES Modules).
 */
/**
 * @description Enumeration of module modes.
 * @summary Defines the different module formats supported in the build process.
 * @enum {string}
 * @readonly
 * @memberOf module:build-scripts
 */
var Modes;
(function (Modes) {
    /** CommonJS module format */
    Modes["CJS"] = "commonjs";
    /** ECMAScript module format (ES2022) */
    Modes["ESM"] = "es2022";
})(Modes || (Modes = {}));

const COMMA_SEPARATOR = ",";

function safeParseCSV(csv) {
    if (!csv.trim())
        return [];
    return csv.split(COMMA_SEPARATOR).map((item) => item.trim());
}

/**
 * @description ANSI escape code for resetting text formatting.
 * @summary This constant holds the ANSI escape sequence used to reset all text formatting to default.
 * @const AnsiReset
 * @memberOf module:StyledString
 */
const AnsiReset = "\x1b[0m";
/**
 * @description Standard foreground color codes for ANSI text formatting.
 * @summary This object maps color names to their corresponding ANSI color codes for standard foreground colors.
 * @const StandardForegroundColors
 * @property {number} black - ANSI code for black text (30).
 * @property {number} red - ANSI code for red text (31).
 * @property {number} green - ANSI code for green text (32).
 * @property {number} yellow - ANSI code for yellow text (33).
 * @property {number} blue - ANSI code for blue text (34).
 * @property {number} magenta - ANSI code for magenta text (35).
 * @property {number} cyan - ANSI code for cyan text (36).
 * @property {number} white - ANSI code for white text (37).
 * @memberOf module:StyledString
 */
const StandardForegroundColors = {
    black: 30,
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    magenta: 35,
    cyan: 36,
    white: 37,
};
/**
 * @description Bright foreground color codes for ANSI text formatting.
 * @summary This object maps color names to their corresponding ANSI color codes for bright foreground colors.
 * @const BrightForegroundColors
 * @property {number} black - ANSI code for bright black text (90).
 * @property {number} red - ANSI code for bright red text (91).
 * @property {number} green - ANSI code for bright green text (92).
 * @property {number} yellow - ANSI code for bright yellow text (93).
 * @property {number} blue - ANSI code for bright blue text (94).
 * @property {number} magenta - ANSI code for bright magenta text (95).
 * @property {number} cyan - ANSI code for bright cyan text (96).
 * @property {number} white - ANSI code for bright white text (97).
 * @memberOf module:@StyledString
 */
const BrightForegroundColors = {
    brightBlack: 90,
    brightRed: 91,
    brightGreen: 92,
    brightYellow: 93,
    brightBlue: 94,
    brightMagenta: 95,
    brightCyan: 96,
    brightWhite: 97,
};
/**
 * @description Standard background color codes for ANSI text formatting.
 * @summary This object maps color names to their corresponding ANSI color codes for standard background colors.
 * @const StandardBackgroundColors
 * @property {number} bgBlack - ANSI code for black background (40).
 * @property {number} bgRed - ANSI code for red background (41).
 * @property {number} bgGreen - ANSI code for green background (42).
 * @property {number} bgYellow - ANSI code for yellow background (43).
 * @property {number} bgBlue - ANSI code for blue background (44).
 * @property {number} bgMagenta - ANSI code for magenta background (45).
 * @property {number} bgCyan - ANSI code for cyan background (46).
 * @property {number} bgWhite - ANSI code for white background (47).
 * @memberOf module:@StyledString
 */
const StandardBackgroundColors = {
    bgBlack: 40,
    bgRed: 41,
    bgGreen: 42,
    bgYellow: 43,
    bgBlue: 44,
    bgMagenta: 45,
    bgCyan: 46,
    bgWhite: 47,
};
/**
 * @description Bright background color codes for ANSI text formatting.
 * @summary This object maps color names to their corresponding ANSI color codes for bright background colors.
 * @const BrightBackgroundColors
 * @property {number} bgBrightBlack - ANSI code for bright black background (100).
 * @property {number} bgBrightRed - ANSI code for bright red background (101).
 * @property {number} bgBrightGreen - ANSI code for bright green background (102).
 * @property {number} bgBrightYellow - ANSI code for bright yellow background (103).
 * @property {number} bgBrightBlue - ANSI code for bright blue background (104).
 * @property {number} bgBrightMagenta - ANSI code for bright magenta background (105).
 * @property {number} bgBrightCyan - ANSI code for bright cyan background (106).
 * @property {number} bgBrightWhite - ANSI code for bright white background (107).
 * @memberOf module:@StyledString
 */
const BrightBackgroundColors = {
    bgBrightBlack: 100,
    bgBrightRed: 101,
    bgBrightGreen: 102,
    bgBrightYellow: 103,
    bgBrightBlue: 104,
    bgBrightMagenta: 105,
    bgBrightCyan: 106,
    bgBrightWhite: 107,
};
/**
 * @description Text style codes for ANSI text formatting.
 * @summary This object maps style names to their corresponding ANSI codes for various text styles.
 * @const styles
 * @property {number} reset - ANSI code to reset all styles (0).
 * @property {number} bold - ANSI code for bold text (1).
 * @property {number} dim - ANSI code for dim text (2).
 * @property {number} italic - ANSI code for italic text (3).
 * @property {number} underline - ANSI code for underlined text (4).
 * @property {number} blink - ANSI code for blinking text (5).
 * @property {number} inverse - ANSI code for inverse colors (7).
 * @property {number} hidden - ANSI code for hidden text (8).
 * @property {number} strikethrough - ANSI code for strikethrough text (9).
 * @property {number} doubleUnderline - ANSI code for double underlined text (21).
 * @property {number} normalColor - ANSI code to reset color to normal (22).
 * @property {number} noItalicOrFraktur - ANSI code to turn off italic (23).
 * @property {number} noUnderline - ANSI code to turn off underline (24).
 * @property {number} noBlink - ANSI code to turn off blink (25).
 * @property {number} noInverse - ANSI code to turn off inverse (27).
 * @property {number} noHidden - ANSI code to turn off hidden (28).
 * @property {number} noStrikethrough - ANSI code to turn off strikethrough (29).
 * @memberOf module:@StyledString
 */
const styles = {
    reset: 0,
    bold: 1,
    dim: 2,
    italic: 3,
    underline: 4,
    blink: 5,
    inverse: 7,
    hidden: 8,
    strikethrough: 9,
    doubleUnderline: 21,
    normalColor: 22,
    noItalicOrFraktur: 23,
    noUnderline: 24,
    noBlink: 25,
    noInverse: 27,
    noHidden: 28,
    noStrikethrough: 29,
};

/**
 * @description Applies a basic ANSI color code to text.
 * @summary This function takes a string, an ANSI color code number, and an optional background flag.
 * It returns the text wrapped in the appropriate ANSI escape codes for either foreground or background coloring.
 * This function is used for basic 16-color ANSI formatting.
 *
 * @param {string} text - The text to be colored.
 * @param {number} n - The ANSI color code number.
 * @param {boolean} [bg=false] - If true, applies the color to the background instead of the foreground.
 * @return {string} The text wrapped in ANSI color codes.
 *
 * @function colorizeANSI
 * @memberOf module:@StyledString
 */
function colorizeANSI(text, n, bg = false) {
    if (isNaN(n)) {
        console.warn(`Invalid color number on the ANSI scale: ${n}. ignoring...`);
        return text;
    }
    if (bg && ((n > 30 && n <= 40)
        || (n > 90 && n <= 100))) {
        n = n + 10;
    }
    return `\x1b[${n}m${text}${AnsiReset}`;
}
/**
 * @description Applies a 256-color ANSI code to text.
 * @summary This function takes a string and a color number (0-255) and returns the text
 * wrapped in ANSI escape codes for either foreground or background coloring.
 *
 * @param {string} text - The text to be colored.
 * @param {number} n - The color number (0-255).
 * @param {boolean} [bg=false] - If true, applies the color to the background instead of the foreground.
 * @return {string} The text wrapped in ANSI color codes.
 *
 * @function colorize256
 * @memberOf module:@StyledString
 */
function colorize256(text, n, bg = false) {
    if (isNaN(n)) {
        console.warn(`Invalid color number on the 256 scale: ${n}. ignoring...`);
        return text;
    }
    if (n < 0 || n > 255) {
        console.warn(`Invalid color number on the 256 scale: ${n}. ignoring...`);
        return text;
    }
    return `\x1b[${bg ? 48 : 38};5;${n}m${text}${AnsiReset}`;
}
/**
 * @description Applies an RGB color ANSI code to text.
 * @summary This function takes a string and RGB color values (0-255 for each component)
 * and returns the text wrapped in ANSI escape codes for either foreground or background coloring.
 *
 * @param {string} text - The text to be colored.
 * @param {number} r - The red component of the color (0-255).
 * @param {number} g - The green component of the color (0-255).
 * @param {number} b - The blue component of the color (0-255).
 * @param {boolean} [bg=false] - If true, applies the color to the background instead of the foreground.
 * @return {string} The text wrapped in ANSI color codes.
 *
 * @function colorizeRGB
 * @memberOf module:StyledString
 */
function colorizeRGB(text, r, g, b, bg = false) {
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
        console.warn(`Invalid RGB color values: r=${r}, g=${g}, b=${b}. Ignoring...`);
        return text;
    }
    if ([r, g, b].some(v => v < 0 || v > 255)) {
        console.warn(`Invalid RGB color values: r=${r}, g=${g}, b=${b}. Ignoring...`);
        return text;
    }
    return `\x1b[${bg ? 48 : 38};2;${r};${g};${b}m${text}${AnsiReset}`;
}
/**
 * @description Applies an ANSI style code to text.
 * @summary This function takes a string and a style code (either a number or a key from the styles object)
 * and returns the text wrapped in the appropriate ANSI escape codes for that style.
 *
 * @param {string} text - The text to be styled.
 * @param {number | string} n - The style code or style name.
 * @return {string} The text wrapped in ANSI style codes.
 *
 * @function applyStyle
 * @memberOf module:StyledString
 */
function applyStyle(text, n) {
    const styleCode = typeof n === "number" ? n : styles[n];
    return `\x1b[${styleCode}m${text}${AnsiReset}`;
}
/**
 * @description Removes all ANSI formatting codes from text.
 * @summary This function takes a string that may contain ANSI escape codes for formatting
 * and returns a new string with all such codes removed, leaving only the plain text content.
 * It uses a regular expression to match and remove ANSI escape sequences.
 *
 * @param {string} text - The text potentially containing ANSI formatting codes.
 * @return {string} The input text with all ANSI formatting codes removed.
 *
 * @function clear
 * @memberOf module:StyledString
 */
function clear(text) {
    // Regular expression to match ANSI escape codes
    // eslint-disable-next-line no-control-regex
    const ansiRegex = /\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g;
    return text.replace(ansiRegex, '');
}
/**
 * @description Applies raw ANSI escape codes to text.
 * @summary This function takes a string and a raw ANSI escape code, and returns the text
 * wrapped in the provided raw ANSI code and the reset code. This allows for applying custom
 * or complex ANSI formatting that may not be covered by other utility functions.
 *
 * @param {string} text - The text to be formatted.
 * @param {string} raw - The raw ANSI escape code to be applied.
 * @return {string} The text wrapped in the raw ANSI code and the reset code.
 *
 * @function raw
 * @memberOf module:StyledString
 */
function raw(text, raw) {
    return `${raw}${text}${AnsiReset}`;
}

/**
 * @class StyledString
 * @description A class that extends string functionality with ANSI color and style options.
 * @summary StyledString provides methods to apply various ANSI color and style options to text strings.
 * It implements the ColorizeOptions interface and proxies native string methods to the underlying text.
 * This class allows for chaining of styling methods and easy application of colors and styles to text.
 *
 * @implements {ColorizeOptions}
 * @param {string} text - The initial text string to be styled.
 */
class StyledString {
    constructor(text) {
        this.text = text;
        // Basic colors
        Object.entries(StandardForegroundColors).forEach(([name, code]) => {
            Object.defineProperty(this, name, {
                get: () => this.foreground(code),
            });
        });
        Object.entries(BrightForegroundColors).forEach(([name, code]) => {
            Object.defineProperty(this, name, {
                get: () => this.foreground(code),
            });
        });
        // Background colors
        Object.entries(StandardBackgroundColors).forEach(([name, code]) => {
            Object.defineProperty(this, name, {
                get: () => this.background(code),
            });
        });
        Object.entries(BrightBackgroundColors).forEach(([name, code]) => {
            Object.defineProperty(this, name, {
                get: () => this.background(code),
            });
        });
        // Styles
        Object.entries(styles).forEach(([name, code]) => {
            Object.defineProperty(this, name, {
                get: () => this.style(code),
            });
        });
    }
    /**
     * @description Clears all styling from the text.
     * @summary Removes all ANSI color and style codes from the text.
     * @return {StyledString} The StyledString instance with cleared styling.
     */
    clear() {
        this.text = clear(this.text);
        return this;
    }
    /**
     * @description Applies raw ANSI codes to the text.
     * @summary Allows direct application of ANSI escape sequences to the text.
     * @param {string} rawAnsi - The raw ANSI escape sequence to apply.
     * @return {StyledString} The StyledString instance with the raw ANSI code applied.
     */
    raw(rawAnsi) {
        this.text = raw(this.text, rawAnsi);
        return this;
    }
    /**
     * @description Applies a foreground color to the text.
     * @summary Sets the text color using ANSI color codes.
     * @param {number} n - The ANSI color code for the foreground color.
     * @return {StyledString} The StyledString instance with the foreground color applied.
     */
    foreground(n) {
        this.text = colorizeANSI(this.text, n);
        return this;
    }
    /**
     * @description Applies a background color to the text.
     * @summary Sets the background color of the text using ANSI color codes.
     * @param {number} n - The ANSI color code for the background color.
     * @return {StyledString} The StyledString instance with the background color applied.
     */
    background(n) {
        this.text = colorizeANSI(this.text, n, true);
        return this;
    }
    /**
     * @description Applies a text style to the string.
     * @summary Sets text styles such as bold, italic, or underline using ANSI style codes.
     * @param {number | string} n - The style code or key from the styles object.
     * @return {StyledString} The StyledString instance with the style applied.
     */
    style(n) {
        if (typeof n === "string" && !(n in styles)) {
            console.warn(`Invalid style: ${n}`);
            return this;
        }
        this.text = applyStyle(this.text, n);
        return this;
    }
    /**
     * @description Applies a 256-color foreground color to the text.
     * @summary Sets the text color using the extended 256-color palette.
     * @param {number} n - The color number from the 256-color palette.
     * @return {StyledString} The StyledString instance with the 256-color foreground applied.
     */
    color256(n) {
        this.text = colorize256(this.text, n);
        return this;
    }
    /**
     * @description Applies a 256-color background color to the text.
     * @summary Sets the background color using the extended 256-color palette.
     * @param {number} n - The color number from the 256-color palette.
     * @return {StyledString} The StyledString instance with the 256-color background applied.
     */
    bgColor256(n) {
        this.text = colorize256(this.text, n, true);
        return this;
    }
    /**
     * @description Applies an RGB foreground color to the text.
     * @summary Sets the text color using RGB values.
     * @param {number} r - The red component (0-255).
     * @param {number} g - The green component (0-255).
     * @param {number} b - The blue component (0-255).
     * @return {StyledString} The StyledString instance with the RGB foreground color applied.
     */
    rgb(r, g, b) {
        this.text = colorizeRGB(this.text, r, g, b);
        return this;
    }
    /**
     * @description Applies an RGB background color to the text.
     * @summary Sets the background color using RGB values.
     * @param {number} r - The red component (0-255).
     * @param {number} g - The green component (0-255).
     * @param {number} b - The blue component (0-255).
     * @return {StyledString} The StyledString instance with the RGB background color applied.
     */
    bgRgb(r, g, b) {
        this.text = colorizeRGB(this.text, r, g, b, true);
        return this;
    }
    /**
     * @description Converts the StyledString to a regular string.
     * @summary Returns the underlying text with all applied styling.
     * @return {string} The styled text as a regular string.
     */
    toString() {
        return this.text;
    }
}
/**
 * @description Applies styling to a given text string.
 * @summary This function takes a string and returns a StyledString object, which is an enhanced
 * version of the original string with additional methods for applying various ANSI color and style
 * options. It sets up a mapper object with methods for different styling operations and then
 * defines properties on the text string to make these methods accessible.
 *
 * @param {string[]} t  The input text to be styled.
 * @return {StyledString} A StyledString object with additional styling methods.
 *
 * @function style
 *
 * @memberOf StyledString
 */
function style(...t) {
    return new StyledString(t.join(" "));
}

/**
 * @description Global key used to store environment variables in browser contexts.
 * @summary Enables the logging environment helpers to locate serialized environment configuration on `globalThis`.
 * @const BrowserEnvKey
 * @type {string}
 * @memberOf module:Logging
 */
const BrowserEnvKey = "ENV";
/**
 * @description Delimiter used for composing nested environment variable names.
 * @summary Joins parent and child keys when mapping object paths to ENV strings.
 * @const ENV_PATH_DELIMITER
 * @type {string}
 * @memberOf module:Logging
 */
const ENV_PATH_DELIMITER = "__";
/**
 * @description Enum for log levels.
 * @summary Defines different levels of logging for the application.
 * @enum {string}
 * @readonly
 * @memberOf module:Logging
 */
var LogLevel;
(function (LogLevel) {
    /** @description Benchmark events that capture performance metrics. */
    LogLevel["benchmark"] = "benchmark";
    /** @description Error events that indicate failures requiring attention. */
    LogLevel["error"] = "error";
    /** @description Warning events that may indicate issues. */
    LogLevel["warn"] = "warn";
    /** @description Informational events describing normal operation. */
    LogLevel["info"] = "info";
    /** @description Verbose diagnostic information for detailed tracing. */
    LogLevel["verbose"] = "verbose";
    /** @description Debug or trace details aimed at developers. */
    LogLevel["debug"] = "debug";
    /** @description trace details aimed at developers */
    LogLevel["trace"] = "trace";
    /** @description Extremely chatty or playful log entries. */
    LogLevel["silly"] = "silly";
})(LogLevel || (LogLevel = {}));
/**
 * @description Numeric values associated with log levels.
 * @summary Provides a numeric representation of log levels for comparison and filtering.
 * @typedef {Object} NumericLogLevelsShape
 * @property {number} benchmark - Numeric value for benchmark level (0).
 * @property {number} error - Numeric value for error level (2).
 * @property {number} info - Numeric value for info level (4).
 * @property {number} verbose - Numeric value for verbose level (6).
 * @property {number} debug - Numeric value for debug level (7).
 * @property {number} silly - Numeric value for silly level (9).
 * @memberOf module:Logging
 */
/**
 * @description Numeric values associated with log levels.
 * @summary Provides a numeric representation of log levels for comparison and filtering.
 * @const NumericLogLevels
 * @type {NumericLogLevelsShape}
 * @memberOf module:Logging
 */
const NumericLogLevels = {
    benchmark: 0,
    error: 3,
    warn: 6,
    info: 9,
    verbose: 12,
    debug: 15,
    trace: 18,
    silly: 21,
};
/**
 * @description Enum for logging output modes.
 * @summary Defines different output formats for log messages.
 * @enum {string}
 * @memberOf module:Logging
 */
var LoggingMode;
(function (LoggingMode) {
    /** Raw text format for human readability */
    LoggingMode["RAW"] = "raw";
    /** JSON format for machine parsing */
    LoggingMode["JSON"] = "json";
})(LoggingMode || (LoggingMode = {}));
/**
 * @description Default theme for styling log output.
 * @summary Defines the default color and style settings for various components of log messages.
 * @typedef {Theme} DefaultTheme
 * @property {Object} class - Styling for class names.
 * @property {number} class.fg - Foreground color code for class names (34).
 * @property {Object} id - Styling for identifiers.
 * @property {number} id.fg - Foreground color code for identifiers (36).
 * @property {Object} stack - Styling for stack traces (empty object).
 * @property {Object} timestamp - Styling for timestamps (empty object).
 * @property {Object} message - Styling for different types of messages.
 * @property {Object} message.error - Styling for error messages.
 * @property {number} message.error.fg - Foreground color code for error messages (31).
 * @property {Object} method - Styling for method names (empty object).
 * @property {Object} logLevel - Styling for different log levels.
 * @property {Object} logLevel.error - Styling for error level logs.
 * @property {number} logLevel.error.fg - Foreground color code for error level logs (31).
 * @property {string[]} logLevel.error.style - Style attributes for error level logs (["bold"]).
 * @property {Object} logLevel.info - Styling for info level logs (empty object).
 * @property {Object} logLevel.verbose - Styling for verbose level logs (empty object).
 * @property {Object} logLevel.debug - Styling for debug level logs.
 * @property {number} logLevel.debug.fg - Foreground color code for debug level logs (33).
 * @const DefaultTheme
 * @memberOf module:Logging
 */
const DefaultTheme = {
    app: {},
    separator: {},
    class: {
        fg: 34,
    },
    id: {
        fg: 36,
    },
    stack: {},
    timestamp: {},
    message: {
        error: {
            fg: 31,
        },
    },
    method: {},
    logLevel: {
        benchmark: {
            fg: 32,
            style: ["bold"],
        },
        error: {
            fg: 31,
            style: ["bold"],
        },
        info: {
            fg: 34,
            style: ["bold"],
        },
        verbose: {
            fg: 34,
            style: ["bold"],
        },
        debug: {
            fg: 33,
            style: ["bold"],
        },
        trace: {
            fg: 33,
            style: ["bold"],
        },
        silly: {
            fg: 33,
            style: ["bold"],
        },
    },
};
/**
 * @description Default configuration for logging.
 * @summary Defines the default settings for the logging system, including verbosity, log level, styling, and timestamp format.
 * @const DefaultLoggingConfig
 * @typedef {LoggingConfig} DefaultLoggingConfig
 * @property {number} verbose - Verbosity level (0).
 * @property {LogLevel} level - Default log level (LogLevel.info).
 * @property {boolean} logLevel - Whether to display log level in output (true).
 * @property {LoggingMode} mode - Output format mode (LoggingMode.RAW).
 * @property {boolean} style - Whether to apply styling to log output (false).
 * @property {string} separator - Separator between log components (" - ").
 * @property {boolean} timestamp - Whether to include timestamps in log messages (true).
 * @property {string} timestampFormat - Format for timestamps ("HH:mm:ss.SSS").
 * @property {boolean} context - Whether to include context information in log messages (true).
 * @property {Theme} theme - The theme to use for styling log messages (DefaultTheme).
 * @memberOf module:Logging
 */
const DefaultLoggingConfig = {
    env: "development",
    verbose: 0,
    level: LogLevel.info,
    logLevel: true,
    style: false,
    contextSeparator: ".",
    separator: "-",
    timestamp: true,
    timestampFormat: "HH:mm:ss.SSS",
    context: true,
    format: LoggingMode.RAW,
    pattern: "{level} [{timestamp}] {app} {context} {separator} {message} {stack}",
    theme: DefaultTheme,
};

/**
 * @description Converts a string to ENVIRONMENT_VARIABLE format.
 * @summary Transforms the input string into uppercase with words separated by underscores,
 * typically used for environment variable names.
 *
 * @param {string} text - The input string to be converted.
 * @return {string} The input string converted to ENVIRONMENT_VARIABLE format.
 *
 * @function toENVFormat
 *
 * @memberOf module:Logging
 */
function toENVFormat(text) {
    return toSnakeCase(text).toUpperCase();
}
/**
 * @description Converts a string to snake_case.
 * @summary Transforms the input string into lowercase with words separated by underscores.
 *
 * @param {string} text - The input string to be converted.
 * @return {string} The input string converted to snake_case.
 *
 * @function toSnakeCase
 *
 * @memberOf module:Logging
 */
function toSnakeCase(text) {
    return text
        .replace(/([a-z])([A-Z])/g, "$1_$2")
        .replace(/[\s-]+/g, "_")
        .toLowerCase();
}
/**
 * @summary Util function to provide string format functionality similar to C#'s string.format
 *
 * @param {string} string
 * @param {Array<string | number> | Record<string, any>} [args] replacements made by order of appearance (replacement0 wil replace {0} and so on)
 * @return {string} formatted string
 *
 * @function sf
 * @memberOf module:Logging
 */
function sf(string, ...args) {
    if (args.length > 1) {
        if (!args.every((arg) => typeof arg === "string" || typeof arg === "number"))
            throw new Error(`Only string and number arguments are supported for multiple replacements.`);
    }
    if (args.length === 1 && typeof args[0] === "object") {
        const obj = args[0];
        return Object.entries(obj).reduce((acc, [key, val]) => {
            return acc.replace(new RegExp(`\\{${key}\\}`, "g"), function () {
                return val;
            });
        }, string);
    }
    return string.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] !== "undefined"
            ? args[number].toString()
            : "undefined";
    });
}

/**
 * @class ObjectAccumulator
 * @template T - The type of the accumulated object, extends object
 * @description A class that accumulates objects and provides type-safe access to their properties.
 * It allows for dynamic addition of properties while maintaining type information.
 * @summary Accumulates objects and maintains type information for accumulated properties
 * @memberOf utils
 */
class ObjectAccumulator {
    constructor() {
        Object.defineProperty(this, "__size", {
            value: 0,
            writable: true,
            configurable: false,
            enumerable: false,
        });
    }
    /**
     * @protected
     * @description Expands the accumulator with properties from a new object
     * @summary Adds new properties to the accumulator
     * @template V - The type of the object being expanded
     * @param {V} value - The object to expand with
     * @returns {void}
     */
    expand(value) {
        Object.entries(value).forEach(([k, v]) => {
            Object.defineProperty(this, k, {
                get: () => v,
                set: (val) => {
                    v = val;
                },
                configurable: true,
                enumerable: true,
            });
        });
    }
    /**
     * @description Accumulates a new object into the accumulator
     * @summary Adds properties from a new object to the accumulator, maintaining type information
     * @template V - The type of the object being accumulated
     * @param {V} value - The object to accumulate
     * @returns A new ObjectAccumulator instance with updated type information
     * @mermaid
     * sequenceDiagram
     *   participant A as Accumulator
     *   participant O as Object
     *   A->>O: Get entries
     *   loop For each entry
     *     A->>A: Define property
     *   end
     *   A->>A: Update size
     *   A->>A: Return updated accumulator
     */
    accumulate(value) {
        this.expand(value);
        this.__size = this.__size + Object.keys(value).length;
        return this;
    }
    /**
     * @description Retrieves a value from the accumulator by its key
     * @summary Gets a value from the accumulated object using a type-safe key
     * @template T - value type
     * @template K - The key type, must be a key of this
     * @param {K} key - The key of the value to retrieve
     * @returns The value associated with the key
     */
    get(key) {
        if (!(key in this))
            throw new Error(`Key ${key} does not exist in accumulator. Available keys: ${this.keys().join(", ")}`);
        return this[key];
    }
    /**
     * @description Retrieves a value from the accumulator by its key
     * @summary Gets a value from the accumulated object using a type-safe key
     * @param {string} key - The key of the value to retrieve
     * @param {any} value - The key of the value to retrieve
     */
    put(key, value) {
        return this.accumulate({ [key]: value });
    }
    /**
     * @description Checks if a key exists in the accumulator
     * @summary Determines whether the accumulator contains a specific key
     * @param {string} key - The key to check for existence
     * @returns {boolean} True if the key exists, false otherwise
     */
    has(key) {
        return !!this[key];
    }
    /**
     * @description Removes a key-value pair from the accumulator
     * @summary Deletes a property from the accumulated object
     * @param {string} key - The key of the property to remove
     * @returns {} The accumulator instance with the specified property removed
     */
    remove(key) {
        if (!(key in this))
            return this;
        delete this[key];
        this.__size--;
        return this;
    }
    /**
     * @description Retrieves all keys from the accumulator
     * @summary Gets an array of all accumulated property keys
     * @returns {string[]} An array of keys as strings
     */
    keys() {
        return Object.keys(this);
    }
    /**
     * @description Retrieves all values from the accumulator
     * @summary Gets an array of all accumulated property values
     * @returns An array of values
     */
    values() {
        return Object.values(this);
    }
    /**
     * @description Gets the number of key-value pairs in the accumulator
     * @summary Returns the count of accumulated properties
     * @returns {number} The number of key-value pairs
     */
    size() {
        return this.__size;
    }
    /**
     * @description Clears all accumulated key-value pairs
     * @summary Removes all properties from the accumulator and returns a new empty instance
     * @returns {ObjectAccumulator<never>} A new empty ObjectAccumulator instance
     */
    clear() {
        return new ObjectAccumulator();
    }
    /**
     * @description Executes a callback for each key-value pair in the accumulator
     * @summary Iterates over all accumulated properties, calling a function for each
     * @param {function(any, string, number): void} callback - The function to execute for each entry
     * @returns {void}
     */
    forEach(callback) {
        Object.entries(this).forEach(([key, value], i) => callback(value, key, i));
    }
    /**
     * @description Creates a new array with the results of calling a provided function on every element in the accumulator
     * @summary Maps each accumulated property to a new value using a callback function
     * @template R - The type of the mapped values
     * @param {function(any, string,number): R} callback - Function that produces an element of the new array
     * @returns {R[]} A new array with each element being the result of the callback function
     */
    map(callback) {
        return Object.entries(this).map(([key, value], i) => callback(value, key, i));
    }
}

/**
 * @description Determines if the current environment is a browser by checking the prototype chain of the global object.
 * @summary Checks if the code is running in a browser environment.
 * @return {boolean} True if the environment is a browser, false otherwise.
 * @function isBrowser
 * @memberOf module:Logging
 */
function isBrowser() {
    return (Object.getPrototypeOf(Object.getPrototypeOf(globalThis)) !==
        Object.prototype);
}

/**
 * @description Environment accumulator that lazily reads from runtime sources.
 * @summary Extends {@link ObjectAccumulator} to merge configuration objects while resolving values from Node or browser environment variables on demand.
 * @template T
 * @class Environment
 * @example
 * const Config = Environment.accumulate({ logging: { level: "info" } });
 * console.log(Config.logging.level);
 * console.log(String(Config.logging.level)); // => LOGGING__LEVEL key when serialized
 * @mermaid
 * sequenceDiagram
 *   participant Client
 *   participant Env as Environment
 *   participant Process as process.env
 *   participant Browser as globalThis.ENV
 *   Client->>Env: accumulate(partialConfig)
 *   Env->>Env: expand(values)
 *   Client->>Env: Config.logging.level
 *   alt Browser runtime
 *     Env->>Browser: lookup ENV key
 *     Browser-->>Env: resolved value
 *   else Node runtime
 *     Env->>Process: lookup ENV key
 *     Process-->>Env: resolved value
 *   end
 *   Env-->>Client: merged value
 */
const EmptyValue = Symbol("EnvironmentEmpty");
const ModelSymbol = Symbol("EnvironmentModel");
class Environment extends ObjectAccumulator {
    /**
     * @static
     * @protected
     * @description A factory function for creating Environment instances.
     * @summary Defines how new instances of the Environment class should be created.
     * @return {Environment<any>} A new instance of the Environment class.
     */
    static { this.factory = () => new Environment(); }
    constructor() {
        super();
        Object.defineProperty(this, ModelSymbol, {
            value: {},
            writable: true,
            enumerable: false,
            configurable: false,
        });
    }
    /**
     * @description Retrieves a value from the runtime environment.
     * @summary Handles browser and Node.js environments by normalizing keys and parsing values.
     * @param {string} k - Key to resolve from the environment.
     * @return {unknown} Value resolved from the environment or `undefined` when absent.
     */
    fromEnv(k) {
        let env;
        if (isBrowser()) {
            env =
                globalThis[BrowserEnvKey] || {};
        }
        else {
            env = globalThis.process.env;
            k = toENVFormat(k);
        }
        return this.parseEnvValue(env[k]);
    }
    /**
     * @description Converts stringified environment values into native types.
     * @summary Interprets booleans and numbers while leaving other types unchanged.
     * @param {unknown} val - Raw value retrieved from the environment.
     * @return {unknown} Parsed value converted to boolean, number, or left as-is.
     */
    parseEnvValue(val) {
        if (typeof val !== "string")
            return val;
        if (val === "true")
            return true;
        if (val === "false")
            return false;
        const result = parseFloat(val);
        if (!isNaN(result))
            return result;
        return val;
    }
    /**
     * @description Expands an object into the environment.
     * @summary Defines lazy properties that first consult runtime variables before falling back to seeded values.
     * @template V - Type of the object being expanded.
     * @param {V} value - Object to expose through environment getters and setters.
     * @return {void}
     */
    expand(value) {
        Object.entries(value).forEach(([k, v]) => {
            Environment.mergeModel(this[ModelSymbol], k, v);
            Object.defineProperty(this, k, {
                get: () => {
                    const fromEnv = this.fromEnv(k);
                    if (typeof fromEnv !== "undefined")
                        return fromEnv;
                    if (v && typeof v === "object") {
                        return Environment.buildEnvProxy(v, [k]);
                    }
                    // If the model provides an empty string, mark with EmptyValue so instance proxy can return undefined without enabling key composition
                    if (v === "") {
                        return EmptyValue;
                    }
                    return v;
                },
                set: (val) => {
                    v = val;
                },
                configurable: true,
                enumerable: true,
            });
        });
    }
    /**
     * @description Returns a proxy enforcing required environment variables.
     * @summary Accessing a property that resolves to `undefined` or an empty string when declared in the model throws an error.
     * @return {this} Proxy of the environment enforcing required variables.
     */
    orThrow() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const base = this;
        const modelRoot = base[ModelSymbol];
        const buildKey = (path) => path.map((segment) => toENVFormat(segment)).join(ENV_PATH_DELIMITER);
        const readRuntime = (key) => Environment.readRuntimeEnv(key);
        const parseRuntime = (raw) => typeof raw !== "undefined" ? this.parseEnvValue(raw) : undefined;
        const missing = (key, empty = false) => Environment.missingEnvError(key, empty);
        const createNestedProxy = (model, path) => {
            const handler = {
                get(_target, prop) {
                    if (typeof prop !== "string")
                        return undefined;
                    const nextPath = [...path, prop];
                    const envKey = buildKey(nextPath);
                    const runtimeRaw = readRuntime(envKey);
                    if (typeof runtimeRaw === "string" && runtimeRaw.length === 0)
                        throw missing(envKey, true);
                    const runtimeValue = parseRuntime(runtimeRaw);
                    if (typeof runtimeValue !== "undefined") {
                        if (typeof runtimeValue === "string" && runtimeValue.length === 0)
                            throw missing(envKey, true);
                        return runtimeValue;
                    }
                    const hasProp = model && Object.prototype.hasOwnProperty.call(model, prop);
                    if (!hasProp)
                        throw missing(envKey);
                    const modelValue = model[prop];
                    if (typeof modelValue === "undefined")
                        return undefined;
                    if (modelValue === "")
                        throw missing(envKey);
                    if (modelValue &&
                        typeof modelValue === "object" &&
                        !Array.isArray(modelValue)) {
                        return createNestedProxy(modelValue, nextPath);
                    }
                    return modelValue;
                },
                ownKeys() {
                    return model ? Reflect.ownKeys(model) : [];
                },
                getOwnPropertyDescriptor(_target, prop) {
                    if (!model)
                        return undefined;
                    if (Object.prototype.hasOwnProperty.call(model, prop)) {
                        return {
                            enumerable: true,
                            configurable: true,
                        };
                    }
                    return undefined;
                },
            };
            return new Proxy({}, handler);
        };
        const handler = {
            get(target, prop, receiver) {
                if (typeof prop !== "string")
                    return Reflect.get(target, prop, receiver);
                const hasModelProp = Object.prototype.hasOwnProperty.call(modelRoot, prop);
                if (!hasModelProp)
                    return Reflect.get(target, prop, receiver);
                const envKey = buildKey([prop]);
                const runtimeRaw = readRuntime(envKey);
                if (typeof runtimeRaw === "string" && runtimeRaw.length === 0)
                    throw missing(envKey, true);
                const runtimeValue = parseRuntime(runtimeRaw);
                if (typeof runtimeValue !== "undefined") {
                    if (typeof runtimeValue === "string" && runtimeValue.length === 0)
                        throw missing(envKey, true);
                    return runtimeValue;
                }
                const modelValue = modelRoot[prop];
                if (modelValue &&
                    typeof modelValue === "object" &&
                    !Array.isArray(modelValue)) {
                    return createNestedProxy(modelValue, [prop]);
                }
                if (typeof modelValue === "undefined")
                    return Reflect.get(target, prop, receiver);
                const actual = Reflect.get(target, prop);
                if (typeof actual === "undefined" || actual === "")
                    throw missing(envKey, actual === "");
                return actual;
            },
        };
        return new Proxy(base, handler);
    }
    /**
     * @protected
     * @static
     * @description Retrieves or creates the singleton instance of the Environment class.
     * @summary Ensures only one {@link Environment} instance is created, wrapping it in a proxy to compose ENV keys on demand.
     * @template E
     * @param {...unknown[]} args - Arguments forwarded to the factory when instantiating the singleton.
     * @return {E} Singleton environment instance.
     */
    static instance(...args) {
        if (!Environment._instance) {
            const base = Environment.factory(...args);
            const proxied = new Proxy(base, {
                get(target, prop, receiver) {
                    const value = Reflect.get(target, prop, receiver);
                    if (value === EmptyValue)
                        return undefined;
                    // If the property exists on the instance but resolves to undefined, return undefined (no proxy)
                    if (typeof prop === "string" &&
                        Object.prototype.hasOwnProperty.call(target, prop)) {
                        if (typeof value === "undefined")
                            return undefined;
                    }
                    if (typeof value !== "undefined")
                        return value;
                    if (typeof prop === "string") {
                        // Avoid interfering with logging config lookups for optional fields like 'app'
                        if (prop === "app")
                            return undefined;
                        return Environment.buildEnvProxy(undefined, [prop]);
                    }
                    return value;
                },
            });
            Environment._instance = proxied;
        }
        return Environment._instance;
    }
    /**
     * @static
     * @description Accumulates the given value into the environment.
     * @summary Adds new properties, hiding raw descriptors to avoid leaking enumeration semantics.
     * @template T
     * @template V
     * @param {V} value - Object to merge into the environment.
     * @return {Environment} Updated environment reference.
     */
    static accumulate(value) {
        const instance = Environment.instance();
        Object.keys(instance).forEach((key) => {
            const desc = Object.getOwnPropertyDescriptor(instance, key);
            if (desc && desc.configurable && desc.enumerable) {
                Object.defineProperty(instance, key, {
                    ...desc,
                    enumerable: false,
                });
            }
        });
        return instance.accumulate(value);
    }
    /**
     * @description Retrieves a value using a dot-path key from the accumulated environment.
     * @summary Delegates to the singleton instance to access stored configuration.
     * @param {string} key - Key to resolve from the environment store.
     * @return {unknown} Stored value corresponding to the provided key.
     */
    static get(key) {
        return Environment._instance.get(key);
    }
    /**
     * @description Builds a proxy that composes environment keys for nested properties.
     * @summary Allows chained property access to emit uppercase ENV identifiers while honoring existing runtime overrides.
     * @param {any} current - Seed model segment used when projecting nested structures.
     * @param {string[]} path - Accumulated path segments leading to the proxy.
     * @return {any} Proxy that resolves environment values or composes additional proxies for deeper paths.
     */
    static buildEnvProxy(current, path) {
        const buildKey = (p) => p.map((seg) => toENVFormat(seg)).join(ENV_PATH_DELIMITER);
        // Helper to read from the active environment given a composed key
        const readEnv = (key) => {
            return Environment.readRuntimeEnv(key);
        };
        const handler = {
            get(_target, prop) {
                if (prop === Symbol.toPrimitive) {
                    return () => buildKey(path);
                }
                if (prop === "toString") {
                    return () => buildKey(path);
                }
                if (prop === "valueOf") {
                    return () => buildKey(path);
                }
                if (typeof prop === "symbol")
                    return undefined;
                const hasProp = !!current && Object.prototype.hasOwnProperty.call(current, prop);
                const nextModel = hasProp ? current[prop] : undefined;
                const nextPath = [...path, prop];
                const composedKey = buildKey(nextPath);
                // If an ENV value exists for this path, return it directly
                const envValue = readEnv(composedKey);
                if (typeof envValue !== "undefined")
                    return envValue;
                // Otherwise, if the model has an object at this path, keep drilling with a proxy
                const isNextObject = nextModel && typeof nextModel === "object";
                if (isNextObject)
                    return Environment.buildEnvProxy(nextModel, nextPath);
                // If the model marks this leaf as an empty string, treat as undefined (no proxy)
                if (hasProp && nextModel === "")
                    return undefined;
                // If the model explicitly contains the property with value undefined, treat as undefined (no proxy)
                if (hasProp && typeof nextModel === "undefined")
                    return undefined;
                // Always return a proxy for further path composition when no ENV value;
                // do not surface primitive model defaults here (this API is for key composition).
                return Environment.buildEnvProxy(undefined, nextPath);
            },
            ownKeys() {
                return current ? Reflect.ownKeys(current) : [];
            },
            getOwnPropertyDescriptor(_t, p) {
                if (!current)
                    return undefined;
                if (Object.prototype.hasOwnProperty.call(current, p)) {
                    return { enumerable: true, configurable: true };
                }
                return undefined;
            },
        };
        const target = {};
        return new Proxy(target, handler);
    }
    /**
     * @static
     * @description Retrieves the keys of the environment, optionally converting them to ENV format.
     * @summary Gets all keys in the environment, with an option to format them for environment variables.
     * @param {boolean} [toEnv=true] - Whether to convert the keys to ENV format.
     * @return {string[]} An array of keys from the environment.
     */
    static keys(toEnv = true) {
        return Environment.instance()
            .keys()
            .map((k) => (toEnv ? toENVFormat(k) : k));
    }
    static mergeModel(model, key, value) {
        if (!model)
            return;
        if (value && typeof value === "object" && !Array.isArray(value)) {
            const existing = model[key];
            const target = existing && typeof existing === "object" && !Array.isArray(existing)
                ? existing
                : {};
            model[key] = target;
            Object.entries(value).forEach(([childKey, childValue]) => {
                Environment.mergeModel(target, childKey, childValue);
            });
            return;
        }
        model[key] = value;
    }
    static readRuntimeEnv(key) {
        if (isBrowser()) {
            const env = globalThis[BrowserEnvKey];
            return env ? env[key] : undefined;
        }
        return globalThis?.process?.env?.[key];
    }
    static missingEnvError(key, empty) {
        const suffix = empty ? "an empty string" : "undefined";
        return new Error(`Environment variable ${key} is required but was ${suffix}.`);
    }
}
/**
 * @description Singleton environment instance seeded with default logging configuration.
 * @summary Combines {@link DefaultLoggingConfig} with runtime environment variables to provide consistent logging defaults across platforms.
 * @const LoggedEnvironment
 * @memberOf module:Logging
 */
const LoggedEnvironment = Environment.accumulate(Object.assign({}, DefaultLoggingConfig, {
    env: (isBrowser() && globalThis[BrowserEnvKey]
        ? globalThis[BrowserEnvKey]["NODE_ENV"]
        : globalThis.process.env["NODE_ENV"]) || "development",
}));

/**
 * @description A minimal logger implementation.
 * @summary MiniLogger is a lightweight logging class that implements the Logger interface.
 * It provides basic logging functionality with support for different log levels, verbosity,
 * context-aware logging, and customizable formatting.
 * @param {string} context - The context (typically class name) this logger is associated with
 * @param {Partial<LoggingConfig>} conf - Optional configuration to override global settings
 * @class MiniLogger
 * @example
 * // Create a new logger for a class
 * const logger = new MiniLogger('MyClass');
 *
 * // Log messages at different levels
 * logger.info('This is an info message');
 * logger.debug('This is a debug message');
 * logger.error('Something went wrong');
 *
 * // Create a child logger for a specific method
 * const methodLogger = logger.for('myMethod');
 * methodLogger.verbose('Detailed information', 2);
 *
 * // Log with custom configuration
 * logger.for('specialMethod', { style: true }).info('Styled message');
 */
class MiniLogger {
    constructor(context, conf) {
        this.context = context;
        this.conf = conf;
    }
    config(key) {
        if (this.conf && key in this.conf)
            return this.conf[key];
        return Logging.getConfig()[key];
    }
    /**
     * @description Creates a child logger for a specific method or context
     * @summary Returns a new logger instance with the current context extended by the specified method name
     * @param {string | Function} method - The method name or function to create a logger for
     * @param {Partial<LoggingConfig>} config - Optional configuration to override settings
     * @param {...any[]} args - Additional arguments to pass to the logger factory
     * @return {Logger} A new logger instance for the specified method
     */
    for(method, config, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ...args) {
        if (!config && typeof method === "object") {
            config = method;
            method = undefined;
        }
        else {
            method = method
                ? typeof method === "string"
                    ? method
                    : method.name
                : undefined;
        }
        return new Proxy(this, {
            get: (target, p, receiver) => {
                const result = Reflect.get(target, p, receiver);
                if (p === "config") {
                    return new Proxy(this.config, {
                        get: (target, p) => {
                            if (config && p in config)
                                return config[p];
                            return Reflect.get(target, p, receiver);
                        },
                    });
                }
                if (p === "context" && method) {
                    return [result, method].join(".");
                }
                return result;
            },
        });
    }
    /**
     * @description Creates a formatted log string
     * @summary Generates a log string with timestamp, colored log level, context, and message
     * @param {LogLevel} level - The log level for this message
     * @param {StringLike | Error} message - The message to log or an Error object
     * @param {string} [error] - Optional error to extract stack trace to include in the log
     * @return {string} A formatted log string with all components
     */
    createLog(level, message, error) {
        const log = {};
        const style = this.config("style");
        const separator = this.config("separator");
        const app = this.config("app");
        if (app)
            log.app = style
                ? Logging.theme(app, "app", level)
                : app;
        if (separator)
            log.separator = style
                ? Logging.theme(separator, "separator", level)
                : separator;
        if (this.config("timestamp")) {
            const date = new Date().toISOString();
            const timestamp = style ? Logging.theme(date, "timestamp", level) : date;
            log.timestamp = timestamp;
        }
        if (this.config("logLevel")) {
            const lvl = style
                ? Logging.theme(level, "logLevel", level)
                : level;
            log.level = lvl.toUpperCase();
        }
        if (this.config("context")) {
            const context = style
                ? Logging.theme(this.context, "class", level)
                : this.context;
            log.context = context;
        }
        if (this.config("correlationId")) {
            {
                const id = style
                    ? Logging.theme(this.config("correlationId").toString(), "id", level)
                    : this.config("correlationId").toString();
                log.correlationId = id;
            }
        }
        const msg = style
            ? Logging.theme(typeof message === "string" ? message : message.message, "message", level)
            : typeof message === "string"
                ? message
                : message.message;
        log.message = msg;
        if (error || message instanceof Error) {
            const stack = style
                ? Logging.theme((error?.stack || message.stack), "stack", level)
                : error?.stack || "";
            log.stack = ` | ${(error || message).message} - Stack trace:\n${stack}`;
        }
        switch (this.config("format")) {
            case "json":
                return JSON.stringify(log);
            case "raw":
                return this.config("pattern")
                    .split(" ")
                    .map((s) => {
                    if (!s.match(/\{.*?}/g))
                        return s;
                    const formattedS = sf(s, log);
                    if (formattedS !== s)
                        return formattedS;
                    return undefined;
                })
                    .filter((s) => s)
                    .join(" ");
            default:
                throw new Error(`Unsupported logging format: ${this.config("format")}`);
        }
    }
    /**
     * @description Logs a message with the specified log level
     * @summary Checks if the message should be logged based on the current log level,
     * then uses the appropriate console method to output the formatted log
     * @param {LogLevel} level - The log level of the message
     * @param {StringLike | Error} msg - The message to be logged or an Error object
     * @param {string} [error] - Optional stack trace to include in the log
     * @return {void}
     */
    log(level, msg, error) {
        const confLvl = this.config("level");
        if (NumericLogLevels[confLvl] < NumericLogLevels[level])
            return;
        let method;
        switch (level) {
            case LogLevel.benchmark:
                method = console.log;
                break;
            case LogLevel.info:
                method = console.log;
                break;
            case LogLevel.verbose:
            case LogLevel.debug:
                method = console.debug;
                break;
            case LogLevel.error:
                method = console.error;
                break;
            case LogLevel.trace:
                method = console.trace;
                break;
            case LogLevel.silly:
                method = console.trace;
                break;
            default:
                throw new Error("Invalid log level");
        }
        method(this.createLog(level, msg, error));
    }
    /**
     * @description Logs a message at the benchmark level
     * @summary Logs a message at the benchmark level if the current verbosity setting allows it
     * @param {StringLike} msg - The message to be logged
     * @return {void}
     */
    benchmark(msg) {
        this.log(LogLevel.benchmark, msg);
    }
    /**
     * @description Logs a message at the silly level
     * @summary Logs a message at the silly level if the current verbosity setting allows it
     * @param {StringLike} msg - The message to be logged
     * @param {number} [verbosity=0] - The verbosity level of the message
     * @return {void}
     */
    silly(msg, verbosity = 0) {
        if (this.config("verbose") >= verbosity)
            this.log(LogLevel.verbose, msg);
    }
    /**
     * @description Logs a message at the verbose level
     * @summary Logs a message at the verbose level if the current verbosity setting allows it
     * @param {StringLike} msg - The message to be logged
     * @param {number} [verbosity=0] - The verbosity level of the message
     * @return {void}
     */
    verbose(msg, verbosity = 0) {
        if (this.config("verbose") >= verbosity)
            this.log(LogLevel.verbose, msg);
    }
    /**
     * @description Logs a message at the info level
     * @summary Logs a message at the info level for general application information
     * @param {StringLike} msg - The message to be logged
     * @return {void}
     */
    info(msg) {
        this.log(LogLevel.info, msg);
    }
    /**
     * @description Logs a message at the debug level
     * @summary Logs a message at the debug level for detailed troubleshooting information
     * @param {StringLike} msg - The message to be logged
     * @return {void}
     */
    debug(msg) {
        this.log(LogLevel.debug, msg);
    }
    /**
     * @description Logs a message at the error level
     * @summary Logs a message at the error level for errors and exceptions
     * @param {StringLike | Error} msg - The message to be logged or an Error object
     * @param e
     * @return {void}
     */
    error(msg, e) {
        this.log(LogLevel.error, msg, e);
    }
    /**
     * @description Logs a message at the error level
     * @summary Logs a message at the error level for errors and exceptions
     * @param {StringLike} msg - The message to be logged or an Error object
     * @return {void}
     */
    warn(msg) {
        this.log(LogLevel.warn, msg);
    }
    /**
     * @description Logs a message at the error level
     * @summary Logs a message at the error level for errors and exceptions
     * @param {StringLike} msg - The message to be logged or an Error object
     * @return {void}
     */
    trace(msg) {
        this.log(LogLevel.trace, msg);
    }
    /**
     * @description Updates the logger configuration
     * @summary Merges the provided configuration with the existing configuration
     * @param {Partial<LoggingConfig>} config - The configuration options to apply
     * @return {void}
     */
    setConfig(config) {
        this.conf = { ...(this.conf || {}), ...config };
    }
}
/**
 * @description A static class for managing logging operations
 * @summary The Logging class provides a centralized logging mechanism with support for
 * different log levels, verbosity, and styling. It uses a singleton pattern to maintain a global
 * logger instance and allows creating specific loggers for different classes and methods.
 * @class Logging
 * @example
 * // Set global configuration
 * Logging.setConfig({ level: LogLevel.debug, style: true });
 *
 * // Get a logger for a specific class
 * const logger = Logging.for('MyClass');
 *
 * // Log messages at different levels
 * logger.info('Application started');
 * logger.debug('Processing data...');
 *
 * // Log with context
 * const methodLogger = Logging.for('MyClass.myMethod');
 * methodLogger.verbose('Detailed operation information', 1);
 *
 * // Log errors
 * try {
 *   // some operation
 * } catch (error) {
 *   logger.error(error);
 * }
 * @mermaid
 * classDiagram
 *   class Logger {
 *     <<interface>>
 *     +for(method, config, ...args)
 *     +silly(msg, verbosity)
 *     +verbose(msg, verbosity)
 *     +info(msg)
 *     +debug(msg)
 *     +error(msg)
 *     +setConfig(config)
 *   }
 *
 *   class Logging {
 *     -global: Logger
 *     -_factory: LoggerFactory
 *     -_config: LoggingConfig
 *     +setFactory(factory)
 *     +setConfig(config)
 *     +getConfig()
 *     +get()
 *     +verbose(msg, verbosity)
 *     +info(msg)
 *     +debug(msg)
 *     +silly(msg)
 *     +error(msg)
 *     +for(object, config, ...args)
 *     +because(reason, id)
 *     +theme(text, type, loggerLevel, template)
 *   }
 *
 *   class MiniLogger {
 *     +constructor(context, conf?)
 *   }
 *
 *   Logging ..> Logger : creates
 *   Logging ..> MiniLogger : creates by default
 */
class Logging {
    /**
     * @description Factory function for creating logger instances
     * @summary A function that creates new Logger instances. By default, it creates a MiniLogger.
     */
    static { this._factory = (object, config) => {
        return new MiniLogger(object, config);
    }; }
    static { this._config = LoggedEnvironment; }
    constructor() { }
    /**
     * @description Sets the factory function for creating logger instances
     * @summary Allows customizing how logger instances are created
     * @param {LoggerFactory} factory - The factory function to use for creating loggers
     * @return {void}
     */
    static setFactory(factory) {
        Logging._factory = factory;
    }
    /**
     * @description Updates the global logging configuration
     * @summary Allows updating the global logging configuration with new settings
     * @param {Partial<LoggingConfig>} config - The configuration options to apply
     * @return {void}
     */
    static setConfig(config) {
        Object.entries(config).forEach(([k, v]) => {
            this._config[k] = v;
        });
    }
    /**
     * @description Gets a copy of the current global logging configuration
     * @summary Returns a copy of the current global logging configuration
     * @return {LoggingConfig} A copy of the current configuration
     */
    static getConfig() {
        return this._config;
    }
    /**
     * @description Retrieves or creates the global logger instance.
     * @summary Returns the existing global logger or creates a new one if it doesn't exist.
     *
     * @return The global VerbosityLogger instance.
     */
    static get() {
        this.global = this.global ? this.global : this._factory("Logging");
        return this.global;
    }
    /**
     * @description Logs a verbose message.
     * @summary Delegates the verbose logging to the global logger instance.
     *
     * @param msg - The message to be logged.
     * @param verbosity - The verbosity level of the message (default: 0).
     */
    static verbose(msg, verbosity = 0) {
        return this.get().verbose(msg, verbosity);
    }
    /**
     * @description Logs an info message.
     * @summary Delegates the info logging to the global logger instance.
     *
     * @param msg - The message to be logged.
     */
    static info(msg) {
        return this.get().info(msg);
    }
    /**
     * @description Logs an info message.
     * @summary Delegates the info logging to the global logger instance.
     *
     * @param msg - The message to be logged.
     */
    static trace(msg) {
        return this.get().trace(msg);
    }
    /**
     * @description Logs a debug message.
     * @summary Delegates the debug logging to the global logger instance.
     *
     * @param msg - The message to be logged.
     */
    static debug(msg) {
        return this.get().debug(msg);
    }
    /**
     * @description Logs a benchmark message.
     * @summary Delegates the benchmark logging to the global logger instance.
     *
     * @param msg - The message to be logged.
     */
    static benchmark(msg) {
        return this.get().benchmark(msg);
    }
    /**
     * @description Logs a silly message.
     * @summary Delegates the debug logging to the global logger instance.
     *
     * @param msg - The message to be logged.
     */
    static silly(msg) {
        return this.get().silly(msg);
    }
    /**
     * @description Logs a silly message.
     * @summary Delegates the debug logging to the global logger instance.
     *
     * @param msg - The message to be logged.
     */
    static warn(msg) {
        return this.get().warn(msg);
    }
    /**
     * @description Logs an error message.
     * @summary Delegates the error logging to the global logger instance.
     *
     * @param msg - The message to be logged.
     * @param e
     */
    static error(msg, e) {
        return this.get().error(msg, e);
    }
    /**
     * @description Creates a logger for a specific object or context
     * @summary Creates a new logger instance for the given object or context using the factory function
     * @param {LoggingContext} object - The object, class, or context to create a logger for
     * @param {Partial<LoggingConfig>} [config] - Optional configuration to override global settings
     * @param {...any} args - Additional arguments to pass to the logger factory
     * @return {Logger} A new logger instance for the specified object or context
     */
    static for(object, config, ...args) {
        object =
            typeof object === "string"
                ? object
                : object.constructor
                    ? object.constructor.name
                    : object.name;
        return this._factory(object, config, ...args);
    }
    /**
     * @description Creates a logger for a specific reason or correlation context
     * @summary Utility to quickly create a logger labeled with a free-form reason and optional identifier
     * so that ad-hoc operations can be traced without tying the logger to a class or method name.
     * @param {string} reason - A textual reason or context label for this logger instance
     * @param {string} [id] - Optional identifier to help correlate related log entries
     * @return {Logger} A new logger instance labeled with the provided reason and id
     */
    static because(reason, id) {
        return this._factory(reason, this._config, id);
    }
    /**
     * @description Applies theme styling to text
     * @summary Applies styling (colors, formatting) to text based on the theme configuration
     * @param {string} text - The text to style
     * @param {string} type - The type of element to style (e.g., "class", "message", "logLevel")
     * @param {LogLevel} loggerLevel - The log level to use for styling
     * @param {Theme} [template=DefaultTheme] - The theme to use for styling
     * @return {string} The styled text
     * @mermaid
     * sequenceDiagram
     *   participant Caller
     *   participant Theme as Logging.theme
     *   participant Apply as apply function
     *   participant Style as styled-string-builder
     *
     *   Caller->>Theme: theme(text, type, loggerLevel)
     *   Theme->>Theme: Check if styling is enabled
     *   alt styling disabled
     *     Theme-->>Caller: return original text
     *   else styling enabled
     *     Theme->>Theme: Get theme for type
     *     alt theme not found
     *       Theme-->>Caller: return original text
     *     else theme found
     *       Theme->>Theme: Determine actual theme based on log level
     *       Theme->>Apply: Apply each style property
     *       Apply->>Style: Apply colors and formatting
     *       Style-->>Apply: Return styled text
     *       Apply-->>Theme: Return styled text
     *       Theme-->>Caller: Return final styled text
     *     end
     *   end
     */
    static theme(text, type, loggerLevel, template = DefaultTheme) {
        if (!this._config.style)
            return text;
        function apply(txt, option, value) {
            try {
                const t = txt;
                let c = style(t);
                function applyColor(val, isBg = false) {
                    let f = isBg ? c.background : c.foreground;
                    if (!Array.isArray(val)) {
                        return f.call(c, value);
                    }
                    switch (val.length) {
                        case 1:
                            f = isBg ? c.bgColor256 : c.color256;
                            return f(val[0]);
                        case 3:
                            f = isBg ? c.bgRgb : c.rgb;
                            return c.rgb(val[0], val[1], val[2]);
                        default:
                            console.error(`Not a valid color option: ${option}`);
                            return style(t);
                    }
                }
                function applyStyle(v) {
                    if (typeof v === "number") {
                        c = c.style(v);
                    }
                    else {
                        c = c[v];
                    }
                }
                switch (option) {
                    case "bg":
                    case "fg":
                        return applyColor(value).text;
                    case "style":
                        if (Array.isArray(value)) {
                            value.forEach(applyStyle);
                        }
                        else {
                            applyStyle(value);
                        }
                        return c.text;
                    default:
                        console.error(`Not a valid theme option: ${option}`);
                        return t;
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            }
            catch (e) {
                console.error(`Error applying style: ${option} with value ${value}`);
                return txt;
            }
        }
        const individualTheme = template[type];
        if (!individualTheme || !Object.keys(individualTheme).length) {
            return text;
        }
        let actualTheme = individualTheme;
        const logLevels = Object.assign({}, LogLevel);
        if (Object.keys(individualTheme)[0] in logLevels)
            actualTheme =
                individualTheme[loggerLevel] || {};
        return Object.keys(actualTheme).reduce((acc, key) => {
            const val = actualTheme[key];
            if (val)
                return apply(acc, key, val);
            return acc;
        }, text);
    }
}

/**
 * @description Base class that provides a ready-to-use logger instance.
 * @summary Supplies inheriting classes with a lazily created, context-aware {@link Logger} via the protected `log` getter, promoting consistent structured logging without manual wiring.
 * @class LoggedClass
 * @example
 * class UserService extends LoggedClass {
 *   create(user: User) {
 *     this.log.info(`Creating user ${user.id}`);
 *   }
 * }
 *
 * const svc = new UserService();
 * svc.create({ id: "42" });
 * @mermaid
 * sequenceDiagram
 *   participant Client
 *   participant Instance as Subclass Instance
 *   participant Getter as LoggedClass.log
 *   participant Logging as Logging
 *   participant Logger as Logger
 *
 *   Client->>Instance: call someMethod()
 *   Instance->>Getter: access this.log
 *   Getter->>Logging: Logging.for(this)
 *   Logging-->>Getter: return Logger
 *   Getter-->>Instance: return Logger
 *   Instance->>Logger: info/debug/error(...)
 */
class LoggedClass {
    /**
     * @description Lazily provides a context-aware logger for the current instance.
     * @summary Calls {@link Logging.for} with the subclass instance to obtain a logger whose context matches the subclass name.
     * @return {Logger} Logger bound to the subclass context.
     */
    get log() {
        if (!this._log)
            this._log = Logging.for(this);
        return this._log;
    }
    constructor() { }
}

/**
 * @description Base class for message filters that plug into the logging pipeline.
 * @summary Extends {@link LoggedClass} to supply a scoped logger and defines the contract required by {@link LoggingFilter} implementers that transform or drop log messages before emission.
 * @class LogFilter
 * @example
 * class RedactSecretsFilter extends LogFilter {
 *   filter(config: LoggingConfig, message: string): string {
 *     return message.replace(/secret/gi, "***");
 *   }
 * }
 *
 * const filter = new RedactSecretsFilter();
 * filter.filter({ ...DefaultLoggingConfig, verbose: 0 }, "secret token");
 * @mermaid
 * sequenceDiagram
 *   participant Logger
 *   participant Filter as LogFilter
 *   participant Impl as ConcreteFilter
 *   participant Output
 *   Logger->>Filter: filter(config, message, context)
 *   Filter->>Impl: delegate to subclass implementation
 *   Impl-->>Filter: transformed message
 *   Filter-->>Output: return filtered message
 */
class LogFilter extends LoggedClass {
    /**
     * @description Scoped logger that excludes other filters from the chain.
     * @summary Returns a child logger dedicated to the filter, preventing recursive filter invocation when emitting diagnostic messages.
     * @return {Logger} Context-aware logger for the filter instance.
     */
    get log() {
        return super.log.for(this, { filters: [] });
    }
}

function safeNow() {
    // Prefer performance.now when available
    if (typeof globalThis !== "undefined" &&
        typeof globalThis.performance?.now === "function") {
        return () => globalThis.performance.now();
    }
    // Node: use process.hrtime.bigint for higher precision if available
    if (typeof process !== "undefined" &&
        typeof process.hrtime?.bigint === "function") {
        return () => {
            const ns = process.hrtime.bigint(); // nanoseconds
            return Number(ns) / 1_000_000; // to ms
        };
    }
    // Fallback
    return () => Date.now();
}
/**
 * @description High-resolution clock accessor returning milliseconds.
 * @summary Chooses the most precise timer available in the current runtime, preferring `performance.now` or `process.hrtime.bigint`.
 * @return {number} Milliseconds elapsed according to the best available clock.
 */
safeNow();

/**
 * @description Creates a decorator that makes a method non-configurable.
 * @summary Prevents overriding by marking the method descriptor as non-configurable, throwing if applied to non-method targets.
 * @return {function(object, any, PropertyDescriptor): PropertyDescriptor|undefined} Decorator that hardens the method descriptor.
 * @function final
 * @category Method Decorators
 */
function final() {
    return (target, propertyKey, descriptor) => {
        if (!descriptor)
            throw new Error("final decorator can only be used on methods");
        if (descriptor?.configurable) {
            descriptor.configurable = false;
        }
        return descriptor;
    };
}

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * @description Filter that patches log messages using regular expressions.
 * @summary Applies a configured {@link RegExp} and replacement strategy to redact, mask, or restructure log payloads before they are emitted.
 * @param {RegExp} regexp - Expression used to detect sensitive or formatted text.
 * @param {string|ReplacementFunction} replacement - Replacement string or callback invoked for each match.
 * @class PatternFilter
 * @example
 * const filter = new PatternFilter(/token=[^&]+/g, "token=***");
 * const sanitized = filter.filter(config, "token=123&user=tom", []);
 * // sanitized === "token=***&user=tom"
 * @mermaid
 * sequenceDiagram
 *   participant Logger
 *   participant Filter as PatternFilter
 *   participant RegExp
 *   Logger->>Filter: filter(config, message, context)
 *   Filter->>RegExp: execute match()
 *   alt match found
 *     RegExp-->>Filter: captures
 *     Filter->>RegExp: replace(message, replacement)
 *     RegExp-->>Filter: transformed message
 *   else no match
 *     RegExp-->>Filter: null
 *   end
 *   Filter-->>Logger: sanitized message
 */
class PatternFilter extends LogFilter {
    constructor(regexp, replacement) {
        super();
        this.regexp = regexp;
        this.replacement = replacement;
    }
    /**
     * @description Ensures deterministic RegExp matching.
     * @summary Runs the configured expression, then resets its state so repeated invocations behave consistently.
     * @param {string} message - Message to test for matches.
     * @return {RegExpExecArray|null} Match result or null when no match is found.
     */
    match(message) {
        const match = this.regexp.exec(message);
        this.regexp.lastIndex = 0;
        return match;
    }
    /**
     * @description Applies the replacement strategy to the incoming message.
     * @summary Executes {@link PatternFilter.match} and, when a match is found, replaces every occurrence using the configured replacement handler.
     * @param {LoggingConfig} config - Active logging configuration (unused but part of the filter contract).
     * @param {string} message - Message to be sanitized.
     * @param {string[]} context - Context entries associated with the log event.
     * @return {string} Sanitized log message.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    filter(config, message, context) {
        const log = this.log.for(this.filter);
        const match = this.match(message);
        if (!match)
            return message;
        try {
            return message.replace(this.regexp, this.replacement);
        }
        catch (e) {
            log.error(`PatternFilter replacement error: ${e}`);
        }
        return "";
    }
}
__decorate([
    final(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PatternFilter.prototype, "match", null);

Logging.for("yaml");

var FabricBinaries;
(function (FabricBinaries) {
    FabricBinaries["CONFIGTXLATOR"] = "configtxlator";
    FabricBinaries["CLIENT"] = "fabric-ca-client";
    FabricBinaries["SERVER"] = "fabric-ca-server";
    FabricBinaries["ORDERER"] = "orderer";
    FabricBinaries["PEER"] = "peer";
    FabricBinaries["CONFIGTXGEN"] = "configtxgen";
    FabricBinaries["OSNADMIN"] = "osnadmin";
})(FabricBinaries || (FabricBinaries = {}));

var ConfigtxlatorCommand;
(function (ConfigtxlatorCommand) {
    ConfigtxlatorCommand["START"] = "start";
    ConfigtxlatorCommand["PROTO_ENCODE"] = "proto_encode";
    ConfigtxlatorCommand["PROTO_DECODE"] = "proto_decode";
    ConfigtxlatorCommand["PROTO_COMPARE"] = "proto_compare";
    ConfigtxlatorCommand["COMPUTE_UPDATE"] = "compute_update";
    ConfigtxlatorCommand["VERSION"] = "version";
    ConfigtxlatorCommand["HELP"] = "help";
})(ConfigtxlatorCommand || (ConfigtxlatorCommand = {}));
var ConfigtxlatorProtoMessage;
(function (ConfigtxlatorProtoMessage) {
    ConfigtxlatorProtoMessage["BLOCK"] = "common.Block";
    ConfigtxlatorProtoMessage["BLOCK_DATA"] = "common.BlockData";
    ConfigtxlatorProtoMessage["BLOCK_METADATA"] = "common.BlockMetadata";
    ConfigtxlatorProtoMessage["CONFIG"] = "common.Config";
    ConfigtxlatorProtoMessage["CONFIG_ENVELOPE"] = "common.ConfigEnvelope";
    ConfigtxlatorProtoMessage["CONFIG_UPDATE"] = "common.ConfigUpdate";
    ConfigtxlatorProtoMessage["CONFIG_UPDATE_ENVELOPE"] = "common.ConfigUpdateEnvelope";
    ConfigtxlatorProtoMessage["ENVELOPE"] = "common.Envelope";
    ConfigtxlatorProtoMessage["SIGNED_ENVELOPE"] = "common.SignedEnvelope";
    ConfigtxlatorProtoMessage["CHAINCODE_DEFINITION"] = "peer.ChaincodeDefinition";
})(ConfigtxlatorProtoMessage || (ConfigtxlatorProtoMessage = {}));

/**
 * @description Fabric CA Server command options.
 * @summary Enumeration of available commands for the Fabric CA Server.
 * @enum {string}
 * @readonly
 * @memberOf module:fabric-ca-server
 */
var FabricCAServerCommand;
(function (FabricCAServerCommand) {
    /** Generate bash completion script */
    FabricCAServerCommand["COMPLETION"] = "completion";
    /** Show help */
    FabricCAServerCommand["HELP"] = "help";
    /** Initialize the Fabric CA server */
    FabricCAServerCommand["INIT"] = "init";
    /** Start the Fabric CA server */
    FabricCAServerCommand["START"] = "start";
    /** Show version information */
    FabricCAServerCommand["VERSION"] = "version";
})(FabricCAServerCommand || (FabricCAServerCommand = {}));
var ClientAuthType;
(function (ClientAuthType) {
    ClientAuthType["NoClientCert"] = "noclientcert";
    ClientAuthType["RequestClientCert"] = "requestclientcert";
    ClientAuthType["RequireAnyClientCert"] = "requireanyclientcert";
    ClientAuthType["VerifyClientCertIfGiven"] = "verifyclientcertifgiven";
    ClientAuthType["RequireAndVerifyClientCert"] = "requireandverifyclientcert";
})(ClientAuthType || (ClientAuthType = {}));
/**
 * @description Fabric CA Server database types.
 * @summary Enumeration of supported database types for the Fabric CA Server.
 * @enum {string}
 * @readonly
 * @memberOf module:fabric-ca-server
 */
var FabricCAServerDBTypes;
(function (FabricCAServerDBTypes) {
    /** SQLite3 database */
    FabricCAServerDBTypes["SQLITE3"] = "sqlite3";
    /** PostgreSQL database */
    FabricCAServerDBTypes["POSTGRES"] = "postgres";
    /** MySQL database */
    FabricCAServerDBTypes["MYSQL"] = "mysql";
})(FabricCAServerDBTypes || (FabricCAServerDBTypes = {}));
/**
 * @description Fabric CA Server elliptic curve names.
 * @summary Enumeration of supported elliptic curves for cryptographic operations in the Fabric CA Server.
 * @enum {string}
 * @readonly
 * @memberOf module:fabric-ca-server
 */
var FabricCAServerCurveName;
(function (FabricCAServerCurveName) {
    /** AMCL Fp256bn curve */
    FabricCAServerCurveName["FP256BN"] = "amcl.Fp256bn";
    /** Gurvy Bn254 curve */
    FabricCAServerCurveName["BN254"] = "gurvy.Bn254";
    /** AMCL Fp256Miraclbn curve */
    FabricCAServerCurveName["FP256MIRACLBN"] = "amcl.Fp256Miraclbn";
})(FabricCAServerCurveName || (FabricCAServerCurveName = {}));
/**
 * @description Fabric CA Server enrollment types.
 * @summary Enumeration of supported enrollment types for the Fabric CA Server.
 * @enum {string}
 * @readonly
 * @memberOf module:fabric-ca-server
 */
var FabricCAServerEnrollmentType;
(function (FabricCAServerEnrollmentType) {
    /** X.509 certificate-based enrollment */
    FabricCAServerEnrollmentType["X509"] = "x509";
    /** Identity Mixer (Idemix) credential-based enrollment */
    FabricCAServerEnrollmentType["IDEMIX"] = "idemix";
})(FabricCAServerEnrollmentType || (FabricCAServerEnrollmentType = {}));
path.join(__dirname, "../../../server/ca-cert.pem");

/**
 * @enum {string}
 * @description Enumeration of available Fabric CA Client commands.
 * @summary This enum represents all the possible commands that can be executed using the Fabric CA Client.
 */
var FabricCAClientCommand;
(function (FabricCAClientCommand) {
    /** Manage affiliations */
    FabricCAClientCommand["AFFILIATION"] = "affiliation";
    /** Manage certificates */
    FabricCAClientCommand["CERTIFICATE"] = "certificate";
    /** Generate the autocompletion script for the specified shell */
    FabricCAClientCommand["COMPLETION"] = "completion";
    /** Enroll an identity */
    FabricCAClientCommand["ENROLL"] = "enroll";
    /** Generate a CRL (Certificate Revocation List) */
    FabricCAClientCommand["GENCRL"] = "gencrl";
    /** Generate a CSR (Certificate Signing Request) */
    FabricCAClientCommand["GENCSR"] = "gencsr";
    /** Get CA certificate chain and Idemix public key */
    FabricCAClientCommand["GETCAINFO"] = "getcainfo";
    /** Help about any command */
    FabricCAClientCommand["HELP"] = "help";
    /** Manage identities */
    FabricCAClientCommand["IDENTITY"] = "identity";
    /** Reenroll an identity */
    FabricCAClientCommand["REENROLL"] = "reenroll";
    /** Register an identity */
    FabricCAClientCommand["REGISTER"] = "register";
    /** Revoke an identity */
    FabricCAClientCommand["REVOKE"] = "revoke";
    /** Prints Fabric CA Client version */
    FabricCAClientCommand["VERSION"] = "version";
})(FabricCAClientCommand || (FabricCAClientCommand = {}));

/**
 * @description Fabric account types.
 * @summary Enumeration of supported account types in Hyperledger Fabric.
 * @enum {string}
 * @readonly
 * @memberOf module:fabric-general
 */
var FabricAccountType;
(function (FabricAccountType) {
    /** Client account type */
    FabricAccountType["CLIENT"] = "client";
    /** Peer account type */
    FabricAccountType["PEER"] = "peer";
    /** Orderer account type */
    FabricAccountType["ORDERER"] = "orderer";
    /** Admin account type */
    FabricAccountType["ADMIN"] = "admin";
    /** User account type */
    FabricAccountType["USER"] = "user";
})(FabricAccountType || (FabricAccountType = {}));
/**
 * @description Log levels for Fabric components.
 * @summary Enumeration of available log levels for Hyperledger Fabric components.
 * These levels determine the verbosity and type of information logged by the system.
 * @enum {string}
 * @readonly
 */
var FabricLogLevel;
(function (FabricLogLevel) {
    /** Standard information messages */
    FabricLogLevel["INFO"] = "info";
    /** Warning messages for potential issues */
    FabricLogLevel["WARNING"] = "warning";
    /** Detailed debugging information */
    FabricLogLevel["DEBUG"] = "debug";
    /** Error messages for issues that don't stop execution */
    FabricLogLevel["ERROR"] = "error";
    /** Fatal error messages that may stop execution */
    FabricLogLevel["FATAL"] = "fatal";
    /** Critical error messages that require immediate attention */
    FabricLogLevel["CRITICAL"] = "critical";
})(FabricLogLevel || (FabricLogLevel = {}));

var OrdererCommand;
(function (OrdererCommand) {
    /** Start the Orderer */
    OrdererCommand["START"] = "start";
})(OrdererCommand || (OrdererCommand = {}));
var OSN_ADMIN_SUBCOMMANDS;
(function (OSN_ADMIN_SUBCOMMANDS) {
    /** Join a channel */
    OSN_ADMIN_SUBCOMMANDS["JOIN"] = "join";
    /** List channels */
    OSN_ADMIN_SUBCOMMANDS["LIST"] = "list";
    /** Remove a channel */
    OSN_ADMIN_SUBCOMMANDS["REMOVE"] = "remove";
})(OSN_ADMIN_SUBCOMMANDS || (OSN_ADMIN_SUBCOMMANDS = {}));

var PeerCommands;
(function (PeerCommands) {
    PeerCommands["CHAINCODE"] = "chaincode";
    PeerCommands["CHANNEL"] = "channel";
    PeerCommands["NODE"] = "node";
    //   VERSION = "version",
    PeerCommands["LIFECYCLE_CHAINCODE"] = "lifecycle chaincode";
})(PeerCommands || (PeerCommands = {}));
var PeerNodeCommands;
(function (PeerNodeCommands) {
    PeerNodeCommands["PAUSE"] = "pause";
    PeerNodeCommands["REBUILD_DBS"] = "rebuild-dbs";
    PeerNodeCommands["RESET"] = "reset";
    PeerNodeCommands["RESUME"] = "resume";
    PeerNodeCommands["ROLLBACK"] = "rollback";
    PeerNodeCommands["START"] = "start";
    PeerNodeCommands["UNJOIN"] = "unjoin";
    PeerNodeCommands["UPGRADE_DBS"] = "upgrade-dbs";
})(PeerNodeCommands || (PeerNodeCommands = {}));
var PeerChannelCommands;
(function (PeerChannelCommands) {
    PeerChannelCommands["CREATE"] = "create";
    PeerChannelCommands["FETCH"] = "fetch";
    PeerChannelCommands["GETINFO"] = "getinfo";
    PeerChannelCommands["JOIN"] = "join";
    PeerChannelCommands["JOINBYSNAPSHOT"] = "joinbysnapshot";
    PeerChannelCommands["JOINBYSNAPSHOTSTATUS"] = "joinbysnapshotstatus";
    PeerChannelCommands["LIST"] = "list";
    PeerChannelCommands["SIGNCONFIGTX"] = "signconfigtx";
    PeerChannelCommands["UPDATE"] = "update";
})(PeerChannelCommands || (PeerChannelCommands = {}));
var PeerChaincodeCommands;
(function (PeerChaincodeCommands) {
    PeerChaincodeCommands["INSTALL"] = "install";
    PeerChaincodeCommands["INSTANTIATE"] = "instantiate";
    PeerChaincodeCommands["INVOKE"] = "invoke";
    PeerChaincodeCommands["LIST"] = "list";
    PeerChaincodeCommands["PACKAGE"] = "package";
    PeerChaincodeCommands["QUERY"] = "query";
    PeerChaincodeCommands["SIGNPACKAGE"] = "signpackage";
    PeerChaincodeCommands["UPGRADE"] = "upgrade";
})(PeerChaincodeCommands || (PeerChaincodeCommands = {}));
var PeerLifecycleChaincodeCommands;
(function (PeerLifecycleChaincodeCommands) {
    PeerLifecycleChaincodeCommands["PACKAGE"] = "package";
    PeerLifecycleChaincodeCommands["INSTALL"] = "install";
    PeerLifecycleChaincodeCommands["QUERYINSTALLED"] = "queryinstalled";
    PeerLifecycleChaincodeCommands["GETINSTALLEDPACKAGE"] = "getinstalledpackage";
    PeerLifecycleChaincodeCommands["CALCULATEPACKAGEID"] = "calculatepackageid";
    PeerLifecycleChaincodeCommands["APPROVEFORMYORG"] = "approveformyorg";
    PeerLifecycleChaincodeCommands["QUERYAPPROVED"] = "queryapproved";
    PeerLifecycleChaincodeCommands["CHECKCOMMITREADINESS"] = "checkcommitreadiness";
    PeerLifecycleChaincodeCommands["COMMIT"] = "commit";
    PeerLifecycleChaincodeCommands["QUERYCOMMITTED"] = "querycommitted";
})(PeerLifecycleChaincodeCommands || (PeerLifecycleChaincodeCommands = {}));

/**
 * @module fabric-weaver
 * @description This module serves as the main entry point for the fabric-weaver library, providing TypeScript integration with Hyperledger Fabric.
 * @summary Aggregates and exports functionality for managing Hyperledger Fabric infrastructures.
 *
 * The module includes:
 * 1. Utility functions and types from the "./utils" directory:
 *    - Helper functions for interacting with Fabric binaries.
 *    - Utilities for generating and managing Docker Compose files.
 *    - Functions to assist in creating, maintaining, and updating Hyperledger Fabric networks.
 *
 * 2. Core functionality from the "./core" directory:
 *    - TypeScript interfaces and classes representing Fabric concepts.
 *    - Implementation of Fabric operations and interactions.
 *
 * 3. A VERSION constant:
 *    - Represents the current version of the fabric-weaver module.
 *    - Useful for version checking and compatibility purposes.
 *
 * This structure provides a comprehensive toolkit for working with Hyperledger Fabric in TypeScript,
 * allowing developers to easily set up, manage, and interact with Fabric networks and components.
 */
/**
 * @const VERSION
 * @name VERSION
 * @description Represents the current version of the fabric-weaver module.
 * @summary The actual version number is replaced during the build process.
 * @type {string}
 */
const VERSION = "##VERSION##";

/**
 * @module fabric-cli
 * @description Command-line interface for Fabric setup and update operations
 * @summary This module provides a CLI for managing Hyperledger Fabric installations.
 * It exposes commands for updating the Fabric install script and setting up Fabric
 * components. The module uses the Commander.js library to parse command-line
 * arguments and execute the appropriate actions.
 *
 * Key exports:
 * - {@link updateFabric}: Function to update the Fabric install script
 * - {@link setupFabric}: Function to set up Fabric components
 *
 * @example
 * // Update Fabric install script
 * node fabric.js update
 *
 * // Setup Fabric components
 * node fabric.js setup --fabric-version 2.5.12 --ca-version 1.5.15 --components binary docker
 *
 * @mermaid
 * sequenceDiagram
 *   participant User
 *   participant CLI
 *   participant UpdateFabric
 *   participant SetupFabric
 *   User->>CLI: Run command
 *   CLI->>CLI: Parse arguments
 *   alt update command
 *     CLI->>UpdateFabric: Call updateFabric()
 *     UpdateFabric->>UpdateFabric: Download install script
 *     UpdateFabric->>UpdateFabric: Make script executable
 *   else setup command
 *     CLI->>SetupFabric: Call setupFabric(config)
 *     SetupFabric->>SetupFabric: Install components
 *   end
 *   CLI->>User: Display result
 */
const INSTALL_SCRIPT = path.join(__dirname, "..", "bin", "install-fabric.sh");
// Default configuration
const defaultConfig = {
    fabricVersion: "2.5.12",
    caVersion: "1.5.15",
    components: ["binary"],
};
const program = new commander.Command();
program.version(VERSION).description("Fabric setup and update utility");
program
    .command("update")
    .description("Update the Fabric install script")
    .action(async () => {
    await updateFabric();
});
program
    .command("setup")
    .description("Set up Fabric components")
    .option("-f, --fabric-version <version>", "Fabric version", defaultConfig.fabricVersion)
    .option("-c, --ca-version <version>", "Fabric CA version", defaultConfig.caVersion)
    .option("--components <components...>", "Components to install (binary, docker, podman, samples)", safeParseCSV, defaultConfig.components)
    .action(async (options) => {
    const config = {
        fabricVersion: options.fabricVersion || defaultConfig.fabricVersion,
        caVersion: options.caVersion || defaultConfig.caVersion,
        components: options.components || defaultConfig.components,
    };
    await setupFabric(config);
});
program.parse(process.argv);
/**
 * @function updateFabric
 * @description Updates the Fabric install script by downloading the latest version
 * @summary This function removes the existing install script (if present), downloads
 * the latest version from the Hyperledger Fabric GitHub repository, and makes it executable.
 * @returns {Promise<void>}
 * @throws {Error} If the download fails or file operations encounter issues
 * @memberOf module:fabric-cli
 *
 * @example
 * await updateFabric();
 *
 * @mermaid
 * sequenceDiagram
 *   participant Function
 *   participant FileSystem
 *   participant GitHub
 *   Function->>FileSystem: Check if script exists
 *   alt Script exists
 *     Function->>FileSystem: Remove existing script
 *   end
 *   Function->>GitHub: Download latest script
 *   GitHub-->>Function: Return script content
 *   Function->>FileSystem: Write new script
 *   Function->>FileSystem: Make script executable
 */
async function updateFabric() {
    console.log("Executing update...");
    const SCRIPT_URL = "https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh";
    // Remove the existing file if it exists
    if (fs.existsSync(INSTALL_SCRIPT)) {
        console.log("Removing existing install-fabric.sh...");
        fs.unlinkSync(INSTALL_SCRIPT);
    }
    // Download the new file
    console.log("Downloading new install-fabric.sh...");
    try {
        const response = await axios.get(SCRIPT_URL, {
            responseType: "arraybuffer",
        });
        fs.writeFileSync(INSTALL_SCRIPT, response.data);
        console.log("Download successful.");
        // Make the file executable
        fs.chmodSync(INSTALL_SCRIPT, "755");
        console.log("Made install-fabric.sh executable.");
    }
    catch (error) {
        console.error("Error: Failed to download the file.");
        console.error(error);
        process.exit(1);
    }
}
/**
 * @function setupFabric
 * @description Sets up Fabric components based on the provided configuration
 * @summary This function installs the specified Fabric components using the
 * install-fabric.sh script. It iterates through the components list and executes
 * the script for each component with the specified Fabric and CA versions.
 * After installation, it copies configuration files to the root config folder.
 * @param {Object} config - Configuration object for Fabric setup
 * @param {string} config.fabricVersion - Fabric version to install
 * @param {string} config.caVersion - Fabric CA version to install
 * @param {string[]} config.components - List of components to install
 * @returns {Promise<void>}
 * @throws {Error} If the install script is not found, component installation fails, or file copying fails
 * @memberOf module:fabric-cli
 *
 * @example
 * const config = {
 *   fabricVersion: "2.5.12",
 *   caVersion: "1.5.15",
 *   components: ["binary", "docker"]
 * };
 * await setupFabric(config);
 *
 * @mermaid
 * sequenceDiagram
 *   participant Function
 *   participant FileSystem
 *   participant InstallScript
 *   Function->>FileSystem: Check if install script exists
 *   alt Script not found
 *     Function->>Function: Log error and exit
 *   else Script found
 *     loop For each component
 *       Function->>InstallScript: Execute install script
 *       InstallScript-->>Function: Installation result
 *       alt Installation failed
 *         Function->>Function: Log error and exit
 *       end
 *     end
 *     Function->>FileSystem: Copy config files
 *     alt Copy failed
 *       Function->>Function: Log error
 *     end
 *   end
 *   Function->>Function: Log success message
 */
async function setupFabric(config) {
    console.log("Executing setup...");
    if (fs.existsSync(INSTALL_SCRIPT)) {
        console.log("Executing install-fabric.sh...");
        for (const component of config.components) {
            console.log(`Installing component: ${component}`);
            try {
                child_process.execSync(`bash "${INSTALL_SCRIPT}" "${component}" -f "${config.fabricVersion}" -c "${config.caVersion}"`, { stdio: "inherit" });
            }
            catch (error) {
                console.error(`Error installing component: ${component}`);
                console.error(error);
                process.exit(1);
            }
        }
        try {
            const srcConfigDir = path.join(__dirname, "..", "src", "configs");
            const baseConfigDir = path.join(__dirname, "..", "fabric-samples", "config");
            const destConfigDir = path.join(__dirname, "..", "config");
            // Create the destination directory if it doesn't exist
            if (!fs.existsSync(destConfigDir)) {
                fs.mkdirSync(destConfigDir, { recursive: true });
            }
            // Copy files from src/configs to rootDir/config
            fs.readdirSync(srcConfigDir).forEach((file) => {
                const srcPath = path.join(srcConfigDir, file);
                const destPath = path.join(destConfigDir, file);
                fs.copyFileSync(srcPath, destPath);
                console.log(`Copied ${file} to ${destConfigDir}`);
            });
            if (fs.existsSync(baseConfigDir))
                // In case install script installed config in fabric-samples
                fs.readdirSync(baseConfigDir).forEach((file) => {
                    const srcPath = path.join(srcConfigDir, file);
                    const destPath = path.join(destConfigDir, file);
                    fs.copyFileSync(srcPath, destPath);
                    console.log(`Copied ${file} to ${destConfigDir}`);
                });
            console.log("Configuration files copied successfully.");
        }
        catch (error) {
            console.error("Error copying configuration files:");
            console.error(error);
        }
        console.log("All components installed successfully.");
    }
    else {
        console.error("Error: install-fabric.sh not found. Please run the update command first.");
        console.error(INSTALL_SCRIPT);
        process.exit(1);
    }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFicmljLmNqcyIsInNvdXJjZXMiOlsiLi4vc3JjL3V0aWxzLW9sZC9idWlsZC1zY3JpcHRzLnRzIiwiLi4vc3JjL2NvcmUvY29uc3RhbnRzL2NvbnN0YW50cy50cyIsIi4uL3NyYy91dGlscy9wYXJzZXJzLnRzIiwiLi4vbm9kZV9tb2R1bGVzL3N0eWxlZC1zdHJpbmctYnVpbGRlci9saWIvZXNtL2NvbnN0YW50cy5qcyIsIi4uL25vZGVfbW9kdWxlcy9zdHlsZWQtc3RyaW5nLWJ1aWxkZXIvbGliL2VzbS9jb2xvcnMuanMiLCIuLi9ub2RlX21vZHVsZXMvc3R5bGVkLXN0cmluZy1idWlsZGVyL2xpYi9lc20vc3RyaW5ncy5qcyIsIi4uL25vZGVfbW9kdWxlcy9AZGVjYWYtdHMvbG9nZ2luZy9saWIvZXNtL2NvbnN0YW50cy5qcyIsIi4uL25vZGVfbW9kdWxlcy9AZGVjYWYtdHMvbG9nZ2luZy9saWIvZXNtL3RleHQuanMiLCIuLi9ub2RlX21vZHVsZXMvdHlwZWQtb2JqZWN0LWFjY3VtdWxhdG9yL2xpYi9lc20vYWNjdW11bGF0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvQGRlY2FmLXRzL2xvZ2dpbmcvbGliL2VzbS93ZWIuanMiLCIuLi9ub2RlX21vZHVsZXMvQGRlY2FmLXRzL2xvZ2dpbmcvbGliL2VzbS9lbnZpcm9ubWVudC5qcyIsIi4uL25vZGVfbW9kdWxlcy9AZGVjYWYtdHMvbG9nZ2luZy9saWIvZXNtL2xvZ2dpbmcuanMiLCIuLi9ub2RlX21vZHVsZXMvQGRlY2FmLXRzL2xvZ2dpbmcvbGliL2VzbS9Mb2dnZWRDbGFzcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9AZGVjYWYtdHMvbG9nZ2luZy9saWIvZXNtL2ZpbHRlcnMvTG9nRmlsdGVyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BkZWNhZi10cy9sb2dnaW5nL2xpYi9lc20vdGltZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9AZGVjYWYtdHMvbG9nZ2luZy9saWIvZXNtL2RlY29yYXRvcnMuanMiLCIuLi9ub2RlX21vZHVsZXMvQGRlY2FmLXRzL2xvZ2dpbmcvbGliL2VzbS9maWx0ZXJzL1BhdHRlcm5GaWx0ZXIuanMiLCIuLi9zcmMvdXRpbHMveWFtbC50cyIsIi4uL3NyYy9mYWJyaWMvY29uc3RhbnRzL2ZhYnJpYy1iaW5hcmllcy50cyIsIi4uL3NyYy9mYWJyaWMvY29uZmlndHhsYXRvci9jb25maWd0eGxhdG9yLWNvbW1hbmQtYnVpbGRlci50cyIsIi4uL3NyYy9mYWJyaWMvY29uc3RhbnRzL2ZhYnJpYy1jYS1zZXJ2ZXIudHMiLCIuLi9zcmMvZmFicmljL2NvbnN0YW50cy9mYWJyaWMtY2EtY2xpZW50LnRzIiwiLi4vc3JjL2ZhYnJpYy9jb25zdGFudHMvZmFicmljLWdlbmVyYWwudHMiLCIuLi9zcmMvZmFicmljL2NvbnN0YW50cy9mYWJyaWMtb3JkZXJlci50cyIsIi4uL3NyYy9mYWJyaWMvY29uc3RhbnRzL2ZhYnJpYy1wZWVyLnRzIiwiLi4vc3JjL2luZGV4LnRzIiwiLi4vc3JjL2Jpbi9mYWJyaWMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbW9kdWxlIGJ1aWxkLXNjcmlwdHNcbiAqIEBkZXNjcmlwdGlvbiBDdXN0b20gYnVpbGQgc2NyaXB0cyBmb3IgdGhlIGZhYnJpYy13ZWF2ZXIgcHJvamVjdC5cbiAqIEBzdW1tYXJ5IFRoaXMgbW9kdWxlIGV4dGVuZHMgdGhlIEJ1aWxkU2NyaXB0cyBjbGFzcyBmcm9tIEBkZWNhZi10cy91dGlscyB0byBwcm92aWRlIGN1c3RvbSBidWlsZCBmdW5jdGlvbmFsaXR5IGZvciB0aGUgZmFicmljLXdlYXZlciBwcm9qZWN0LiBJdCBpbmNsdWRlcyB1dGlsaXRpZXMgZm9yIGJ1aWxkaW5nIGNvbW1hbmQtbGluZSBpbnRlcmZhY2VzIGFuZCBoYW5kbGluZyBkaWZmZXJlbnQgbW9kdWxlIGZvcm1hdHMgKENvbW1vbkpTIGFuZCBFUyBNb2R1bGVzKS5cbiAqL1xuXG5pbXBvcnQgeyBCdWlsZFNjcmlwdHMsIHJlYWRGaWxlLCB3cml0ZUZpbGUgfSBmcm9tIFwiQGRlY2FmLXRzL3V0aWxzXCI7XG5pbXBvcnQgZnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiBFbnVtZXJhdGlvbiBvZiBtb2R1bGUgbW9kZXMuXG4gKiBAc3VtbWFyeSBEZWZpbmVzIHRoZSBkaWZmZXJlbnQgbW9kdWxlIGZvcm1hdHMgc3VwcG9ydGVkIGluIHRoZSBidWlsZCBwcm9jZXNzLlxuICogQGVudW0ge3N0cmluZ31cbiAqIEByZWFkb25seVxuICogQG1lbWJlck9mIG1vZHVsZTpidWlsZC1zY3JpcHRzXG4gKi9cbmVudW0gTW9kZXMge1xuICAvKiogQ29tbW9uSlMgbW9kdWxlIGZvcm1hdCAqL1xuICBDSlMgPSBcImNvbW1vbmpzXCIsXG4gIC8qKiBFQ01BU2NyaXB0IG1vZHVsZSBmb3JtYXQgKEVTMjAyMikgKi9cbiAgRVNNID0gXCJlczIwMjJcIixcbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb24gQ3VzdG9tIGJ1aWxkIHNjcmlwdHMgZm9yIHRoZSBmYWJyaWMtd2VhdmVyIHByb2plY3QuXG4gKiBAc3VtbWFyeSBFeHRlbmRzIHRoZSBCdWlsZFNjcmlwdHMgY2xhc3MgdG8gcHJvdmlkZSBwcm9qZWN0LXNwZWNpZmljIGJ1aWxkIGZ1bmN0aW9uYWxpdHksIGluY2x1ZGluZyBjb21tYW5kIGJ1bmRsaW5nIGFuZCBmaWxlIG1hbmlwdWxhdGlvbi5cbiAqIEBjbGFzcyBCdWlsZFNjcmlwdHNDdXN0b21cbiAqIEBleHRlbmRzIEJ1aWxkU2NyaXB0c1xuICovXG5leHBvcnQgY2xhc3MgQnVpbGRTY3JpcHRzQ3VzdG9tIGV4dGVuZHMgQnVpbGRTY3JpcHRzIHtcbiAgLyoqXG4gICAqIEBkZXNjcmlwdGlvbiBCdWlsZHMgY29tbWFuZC1saW5lIGludGVyZmFjZXMgZm9yIHRoZSBwcm9qZWN0LlxuICAgKiBAc3VtbWFyeSBQcm9jZXNzZXMgZWFjaCBjb21tYW5kIGluIHRoZSBDb21tYW5kcyBhcnJheSwgYnVuZGxpbmcgdGhlIFR5cGVTY3JpcHQgZmlsZXMsIGFkZGluZyBhIHNoZWJhbmcgbGluZSwgYW5kIHNldHRpbmcgYXBwcm9wcmlhdGUgcGVybWlzc2lvbnMuXG4gICAqIEByZXR1cm4ge1Byb21pc2U8dm9pZD59XG4gICAqIEBtZXJtYWlkXG4gICAqIHNlcXVlbmNlRGlhZ3JhbVxuICAgKiAgIHBhcnRpY2lwYW50IEJ1aWxkU2NyaXB0c0N1c3RvbVxuICAgKiAgIHBhcnRpY2lwYW50IEZpbGVTeXN0ZW1cbiAgICogICBsb29wIEZvciBlYWNoIGNvbW1hbmRcbiAgICogICAgIEJ1aWxkU2NyaXB0c0N1c3RvbS0+PkJ1aWxkU2NyaXB0c0N1c3RvbTogYnVuZGxlKE1vZGVzLkNKUywgdHJ1ZSwgdHJ1ZSwgYHNyYy9iaW4vJHtjbWR9LnRzYCwgY21kKVxuICAgKiAgICAgQnVpbGRTY3JpcHRzQ3VzdG9tLT4+RmlsZVN5c3RlbTogcmVhZEZpbGUoYGJpbi8ke2NtZH0uY2pzYClcbiAgICogICAgIEZpbGVTeXN0ZW0tLT4+QnVpbGRTY3JpcHRzQ3VzdG9tOiBmaWxlIGNvbnRlbnRcbiAgICogICAgIEJ1aWxkU2NyaXB0c0N1c3RvbS0+PkJ1aWxkU2NyaXB0c0N1c3RvbTogQWRkIHNoZWJhbmcgdG8gZmlsZSBjb250ZW50XG4gICAqICAgICBCdWlsZFNjcmlwdHNDdXN0b20tPj5GaWxlU3lzdGVtOiB3cml0ZUZpbGUoYGJpbi8ke2NtZH0uY2pzYCwgbW9kaWZpZWQgY29udGVudClcbiAgICogICAgIEJ1aWxkU2NyaXB0c0N1c3RvbS0+PkZpbGVTeXN0ZW06IGNobW9kU3luYyhgYmluLyR7Y21kfS5janNgLCBcIjc1NVwiKVxuICAgKiAgIGVuZFxuICAgKi9cbiAgb3ZlcnJpZGUgYXN5bmMgYnVpbGRDb21tYW5kcygpIHtcbiAgICBjb25zdCBjb21tYW5kcyA9IGZzLnJlYWRkaXJTeW5jKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpICsgXCIvc3JjL2JpblwiKSk7XG4gICAgZm9yIChjb25zdCBjbWQgb2YgY29tbWFuZHMpIHtcbiAgICAgIGlmICghY21kLmVuZHNXaXRoKFwiLnRzXCIpKSBjb250aW51ZTtcblxuICAgICAgY29uc3QgY29tbWFuZE5hbWUgPSBjbWQucmVwbGFjZSgvXFwudHMkLywgXCJcIik7XG4gICAgICBhd2FpdCB0aGlzLmJ1bmRsZShNb2Rlcy5DSlMsIHRydWUsIHRydWUsIGBzcmMvYmluLyR7Y21kfWAsIGNvbW1hbmROYW1lKTtcbiAgICAgIGxldCBkYXRhID0gcmVhZEZpbGUoYGJpbi8ke2NvbW1hbmROYW1lfS5janNgKTtcbiAgICAgIGRhdGEgPSBcIiMhL3Vzci9iaW4vZW52IG5vZGVcXG5cIiArIGRhdGE7XG4gICAgICB3cml0ZUZpbGUoYGJpbi8ke2NvbW1hbmROYW1lfS5janNgLCBkYXRhKTtcbiAgICAgIGZzLmNobW9kU3luYyhgYmluLyR7Y29tbWFuZE5hbWV9LmNqc2AsIFwiNzU1XCIpO1xuICAgIH1cbiAgfVxufVxuIiwiZXhwb3J0IGNvbnN0IENPTU1BX1NFUEFSQVRPUiA9IFwiLFwiO1xuZXhwb3J0IGNvbnN0IENPTE9OX1NFUEFSQVRPUiA9IFwiOlwiO1xuZXhwb3J0IGNvbnN0IFBJUEVfU0VQQVJBVE9SID0gXCJ8XCI7XG5leHBvcnQgY29uc3QgU0xBU0hfU0VQQVJBVE9SID0gXCIvXCI7XG5cbmV4cG9ydCBjb25zdCBOQU1FX1BMQUNFSE9MREVSID0gXCIjI05BTUUjI1wiO1xuZXhwb3J0IGNvbnN0IFZFUlNJT05fUExBQ0VIT0xERVIgPSBcIiMjVkVSIyNcIjtcbmV4cG9ydCBjb25zdCBFTlRSWV9QTEFDRUhPTERFUiA9IFwiIyNFTlRSWSMjXCI7XG4iLCJpbXBvcnQgeyBDT01NQV9TRVBBUkFUT1IsIFNMQVNIX1NFUEFSQVRPUiB9IGZyb20gXCIuLi9jb3JlL2NvbnN0YW50cy9jb25zdGFudHNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHNhZmVQYXJzZUpTT04odjogc3RyaW5nKTogdW5rbm93biB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2Uodik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgSlNPTjogJHsoZSBhcyBFcnJvcikubWVzc2FnZX1gKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2FmZVBhcnNlSW50KHY6IHN0cmluZyB8IG51bWJlcik6IG51bWJlciB7XG4gIGlmICh0eXBlb2YgdiA9PT0gXCJudW1iZXJcIikgcmV0dXJuIE1hdGguZmxvb3Iodik7XG5cbiAgY29uc3QgdmFsdWUgPSBOdW1iZXIodik7XG5cbiAgaWYgKCFOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBpbnRlZ2VyIHZhbHVlOiAke3Z9YCk7XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYWZlUGFyc2VDU1YoY3N2OiBzdHJpbmcpOiBzdHJpbmdbXSB7XG4gIGlmICghY3N2LnRyaW0oKSkgcmV0dXJuIFtdO1xuXG4gIHJldHVybiBjc3Yuc3BsaXQoQ09NTUFfU0VQQVJBVE9SKS5tYXAoKGl0ZW0pID0+IGl0ZW0udHJpbSgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhZmVQYXJzZVNTVihjc3Y6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgY29uc29sZS5sb2coY3N2KTtcbiAgaWYgKCFjc3YudHJpbSgpKSByZXR1cm4gW107XG5cbiAgcmV0dXJuIGNzdi5zcGxpdChTTEFTSF9TRVBBUkFUT1IpLm1hcCgoaXRlbSkgPT4gYFwiJHtpdGVtLnRyaW0oKX1cImApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWFwUGFyc2VyKFxuICBtYXA6IE1hcDxzdHJpbmcsIHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfCBzdHJpbmdbXT5cbik6IHN0cmluZ1tdIHtcbiAgY29uc3QgYXJneiA9IEFycmF5LmZyb20obWFwLCAoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgIHJldHVybiB2YWx1ZSA/IFtgLS0ke2tleX1gXSA6IFtdO1xuICAgIH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBbYC0tJHtrZXl9YCwgdmFsdWUuam9pbihcIixcIildO1xuICAgIH1cbiAgICByZXR1cm4gW2AtLSR7a2V5fWAsIHZhbHVlLnRvU3RyaW5nKCldO1xuICB9KTtcblxuICByZXR1cm4gYXJnei5tYXAoKGVsKSA9PiBlbC5qb2luKFwiIFwiKSk7XG59XG4iLCIvKipcbiAqIEBkZXNjcmlwdGlvbiBBTlNJIGVzY2FwZSBjb2RlIGZvciByZXNldHRpbmcgdGV4dCBmb3JtYXR0aW5nLlxuICogQHN1bW1hcnkgVGhpcyBjb25zdGFudCBob2xkcyB0aGUgQU5TSSBlc2NhcGUgc2VxdWVuY2UgdXNlZCB0byByZXNldCBhbGwgdGV4dCBmb3JtYXR0aW5nIHRvIGRlZmF1bHQuXG4gKiBAY29uc3QgQW5zaVJlc2V0XG4gKiBAbWVtYmVyT2YgbW9kdWxlOlN0eWxlZFN0cmluZ1xuICovXG5leHBvcnQgY29uc3QgQW5zaVJlc2V0ID0gXCJcXHgxYlswbVwiO1xuLyoqXG4gKiBAZGVzY3JpcHRpb24gU3RhbmRhcmQgZm9yZWdyb3VuZCBjb2xvciBjb2RlcyBmb3IgQU5TSSB0ZXh0IGZvcm1hdHRpbmcuXG4gKiBAc3VtbWFyeSBUaGlzIG9iamVjdCBtYXBzIGNvbG9yIG5hbWVzIHRvIHRoZWlyIGNvcnJlc3BvbmRpbmcgQU5TSSBjb2xvciBjb2RlcyBmb3Igc3RhbmRhcmQgZm9yZWdyb3VuZCBjb2xvcnMuXG4gKiBAY29uc3QgU3RhbmRhcmRGb3JlZ3JvdW5kQ29sb3JzXG4gKiBAcHJvcGVydHkge251bWJlcn0gYmxhY2sgLSBBTlNJIGNvZGUgZm9yIGJsYWNrIHRleHQgKDMwKS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSByZWQgLSBBTlNJIGNvZGUgZm9yIHJlZCB0ZXh0ICgzMSkuXG4gKiBAcHJvcGVydHkge251bWJlcn0gZ3JlZW4gLSBBTlNJIGNvZGUgZm9yIGdyZWVuIHRleHQgKDMyKS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB5ZWxsb3cgLSBBTlNJIGNvZGUgZm9yIHllbGxvdyB0ZXh0ICgzMykuXG4gKiBAcHJvcGVydHkge251bWJlcn0gYmx1ZSAtIEFOU0kgY29kZSBmb3IgYmx1ZSB0ZXh0ICgzNCkuXG4gKiBAcHJvcGVydHkge251bWJlcn0gbWFnZW50YSAtIEFOU0kgY29kZSBmb3IgbWFnZW50YSB0ZXh0ICgzNSkuXG4gKiBAcHJvcGVydHkge251bWJlcn0gY3lhbiAtIEFOU0kgY29kZSBmb3IgY3lhbiB0ZXh0ICgzNikuXG4gKiBAcHJvcGVydHkge251bWJlcn0gd2hpdGUgLSBBTlNJIGNvZGUgZm9yIHdoaXRlIHRleHQgKDM3KS5cbiAqIEBtZW1iZXJPZiBtb2R1bGU6U3R5bGVkU3RyaW5nXG4gKi9cbmV4cG9ydCBjb25zdCBTdGFuZGFyZEZvcmVncm91bmRDb2xvcnMgPSB7XG4gICAgYmxhY2s6IDMwLFxuICAgIHJlZDogMzEsXG4gICAgZ3JlZW46IDMyLFxuICAgIHllbGxvdzogMzMsXG4gICAgYmx1ZTogMzQsXG4gICAgbWFnZW50YTogMzUsXG4gICAgY3lhbjogMzYsXG4gICAgd2hpdGU6IDM3LFxufTtcbi8qKlxuICogQGRlc2NyaXB0aW9uIEJyaWdodCBmb3JlZ3JvdW5kIGNvbG9yIGNvZGVzIGZvciBBTlNJIHRleHQgZm9ybWF0dGluZy5cbiAqIEBzdW1tYXJ5IFRoaXMgb2JqZWN0IG1hcHMgY29sb3IgbmFtZXMgdG8gdGhlaXIgY29ycmVzcG9uZGluZyBBTlNJIGNvbG9yIGNvZGVzIGZvciBicmlnaHQgZm9yZWdyb3VuZCBjb2xvcnMuXG4gKiBAY29uc3QgQnJpZ2h0Rm9yZWdyb3VuZENvbG9yc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IGJsYWNrIC0gQU5TSSBjb2RlIGZvciBicmlnaHQgYmxhY2sgdGV4dCAoOTApLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IHJlZCAtIEFOU0kgY29kZSBmb3IgYnJpZ2h0IHJlZCB0ZXh0ICg5MSkuXG4gKiBAcHJvcGVydHkge251bWJlcn0gZ3JlZW4gLSBBTlNJIGNvZGUgZm9yIGJyaWdodCBncmVlbiB0ZXh0ICg5MikuXG4gKiBAcHJvcGVydHkge251bWJlcn0geWVsbG93IC0gQU5TSSBjb2RlIGZvciBicmlnaHQgeWVsbG93IHRleHQgKDkzKS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBibHVlIC0gQU5TSSBjb2RlIGZvciBicmlnaHQgYmx1ZSB0ZXh0ICg5NCkuXG4gKiBAcHJvcGVydHkge251bWJlcn0gbWFnZW50YSAtIEFOU0kgY29kZSBmb3IgYnJpZ2h0IG1hZ2VudGEgdGV4dCAoOTUpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGN5YW4gLSBBTlNJIGNvZGUgZm9yIGJyaWdodCBjeWFuIHRleHQgKDk2KS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB3aGl0ZSAtIEFOU0kgY29kZSBmb3IgYnJpZ2h0IHdoaXRlIHRleHQgKDk3KS5cbiAqIEBtZW1iZXJPZiBtb2R1bGU6QFN0eWxlZFN0cmluZ1xuICovXG5leHBvcnQgY29uc3QgQnJpZ2h0Rm9yZWdyb3VuZENvbG9ycyA9IHtcbiAgICBicmlnaHRCbGFjazogOTAsXG4gICAgYnJpZ2h0UmVkOiA5MSxcbiAgICBicmlnaHRHcmVlbjogOTIsXG4gICAgYnJpZ2h0WWVsbG93OiA5MyxcbiAgICBicmlnaHRCbHVlOiA5NCxcbiAgICBicmlnaHRNYWdlbnRhOiA5NSxcbiAgICBicmlnaHRDeWFuOiA5NixcbiAgICBicmlnaHRXaGl0ZTogOTcsXG59O1xuLyoqXG4gKiBAZGVzY3JpcHRpb24gU3RhbmRhcmQgYmFja2dyb3VuZCBjb2xvciBjb2RlcyBmb3IgQU5TSSB0ZXh0IGZvcm1hdHRpbmcuXG4gKiBAc3VtbWFyeSBUaGlzIG9iamVjdCBtYXBzIGNvbG9yIG5hbWVzIHRvIHRoZWlyIGNvcnJlc3BvbmRpbmcgQU5TSSBjb2xvciBjb2RlcyBmb3Igc3RhbmRhcmQgYmFja2dyb3VuZCBjb2xvcnMuXG4gKiBAY29uc3QgU3RhbmRhcmRCYWNrZ3JvdW5kQ29sb3JzXG4gKiBAcHJvcGVydHkge251bWJlcn0gYmdCbGFjayAtIEFOU0kgY29kZSBmb3IgYmxhY2sgYmFja2dyb3VuZCAoNDApLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGJnUmVkIC0gQU5TSSBjb2RlIGZvciByZWQgYmFja2dyb3VuZCAoNDEpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGJnR3JlZW4gLSBBTlNJIGNvZGUgZm9yIGdyZWVuIGJhY2tncm91bmQgKDQyKS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBiZ1llbGxvdyAtIEFOU0kgY29kZSBmb3IgeWVsbG93IGJhY2tncm91bmQgKDQzKS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBiZ0JsdWUgLSBBTlNJIGNvZGUgZm9yIGJsdWUgYmFja2dyb3VuZCAoNDQpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGJnTWFnZW50YSAtIEFOU0kgY29kZSBmb3IgbWFnZW50YSBiYWNrZ3JvdW5kICg0NSkuXG4gKiBAcHJvcGVydHkge251bWJlcn0gYmdDeWFuIC0gQU5TSSBjb2RlIGZvciBjeWFuIGJhY2tncm91bmQgKDQ2KS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBiZ1doaXRlIC0gQU5TSSBjb2RlIGZvciB3aGl0ZSBiYWNrZ3JvdW5kICg0NykuXG4gKiBAbWVtYmVyT2YgbW9kdWxlOkBTdHlsZWRTdHJpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IFN0YW5kYXJkQmFja2dyb3VuZENvbG9ycyA9IHtcbiAgICBiZ0JsYWNrOiA0MCxcbiAgICBiZ1JlZDogNDEsXG4gICAgYmdHcmVlbjogNDIsXG4gICAgYmdZZWxsb3c6IDQzLFxuICAgIGJnQmx1ZTogNDQsXG4gICAgYmdNYWdlbnRhOiA0NSxcbiAgICBiZ0N5YW46IDQ2LFxuICAgIGJnV2hpdGU6IDQ3LFxufTtcbi8qKlxuICogQGRlc2NyaXB0aW9uIEJyaWdodCBiYWNrZ3JvdW5kIGNvbG9yIGNvZGVzIGZvciBBTlNJIHRleHQgZm9ybWF0dGluZy5cbiAqIEBzdW1tYXJ5IFRoaXMgb2JqZWN0IG1hcHMgY29sb3IgbmFtZXMgdG8gdGhlaXIgY29ycmVzcG9uZGluZyBBTlNJIGNvbG9yIGNvZGVzIGZvciBicmlnaHQgYmFja2dyb3VuZCBjb2xvcnMuXG4gKiBAY29uc3QgQnJpZ2h0QmFja2dyb3VuZENvbG9yc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IGJnQnJpZ2h0QmxhY2sgLSBBTlNJIGNvZGUgZm9yIGJyaWdodCBibGFjayBiYWNrZ3JvdW5kICgxMDApLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGJnQnJpZ2h0UmVkIC0gQU5TSSBjb2RlIGZvciBicmlnaHQgcmVkIGJhY2tncm91bmQgKDEwMSkuXG4gKiBAcHJvcGVydHkge251bWJlcn0gYmdCcmlnaHRHcmVlbiAtIEFOU0kgY29kZSBmb3IgYnJpZ2h0IGdyZWVuIGJhY2tncm91bmQgKDEwMikuXG4gKiBAcHJvcGVydHkge251bWJlcn0gYmdCcmlnaHRZZWxsb3cgLSBBTlNJIGNvZGUgZm9yIGJyaWdodCB5ZWxsb3cgYmFja2dyb3VuZCAoMTAzKS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBiZ0JyaWdodEJsdWUgLSBBTlNJIGNvZGUgZm9yIGJyaWdodCBibHVlIGJhY2tncm91bmQgKDEwNCkuXG4gKiBAcHJvcGVydHkge251bWJlcn0gYmdCcmlnaHRNYWdlbnRhIC0gQU5TSSBjb2RlIGZvciBicmlnaHQgbWFnZW50YSBiYWNrZ3JvdW5kICgxMDUpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGJnQnJpZ2h0Q3lhbiAtIEFOU0kgY29kZSBmb3IgYnJpZ2h0IGN5YW4gYmFja2dyb3VuZCAoMTA2KS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBiZ0JyaWdodFdoaXRlIC0gQU5TSSBjb2RlIGZvciBicmlnaHQgd2hpdGUgYmFja2dyb3VuZCAoMTA3KS5cbiAqIEBtZW1iZXJPZiBtb2R1bGU6QFN0eWxlZFN0cmluZ1xuICovXG5leHBvcnQgY29uc3QgQnJpZ2h0QmFja2dyb3VuZENvbG9ycyA9IHtcbiAgICBiZ0JyaWdodEJsYWNrOiAxMDAsXG4gICAgYmdCcmlnaHRSZWQ6IDEwMSxcbiAgICBiZ0JyaWdodEdyZWVuOiAxMDIsXG4gICAgYmdCcmlnaHRZZWxsb3c6IDEwMyxcbiAgICBiZ0JyaWdodEJsdWU6IDEwNCxcbiAgICBiZ0JyaWdodE1hZ2VudGE6IDEwNSxcbiAgICBiZ0JyaWdodEN5YW46IDEwNixcbiAgICBiZ0JyaWdodFdoaXRlOiAxMDcsXG59O1xuLyoqXG4gKiBAZGVzY3JpcHRpb24gVGV4dCBzdHlsZSBjb2RlcyBmb3IgQU5TSSB0ZXh0IGZvcm1hdHRpbmcuXG4gKiBAc3VtbWFyeSBUaGlzIG9iamVjdCBtYXBzIHN0eWxlIG5hbWVzIHRvIHRoZWlyIGNvcnJlc3BvbmRpbmcgQU5TSSBjb2RlcyBmb3IgdmFyaW91cyB0ZXh0IHN0eWxlcy5cbiAqIEBjb25zdCBzdHlsZXNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSByZXNldCAtIEFOU0kgY29kZSB0byByZXNldCBhbGwgc3R5bGVzICgwKS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBib2xkIC0gQU5TSSBjb2RlIGZvciBib2xkIHRleHQgKDEpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGRpbSAtIEFOU0kgY29kZSBmb3IgZGltIHRleHQgKDIpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGl0YWxpYyAtIEFOU0kgY29kZSBmb3IgaXRhbGljIHRleHQgKDMpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IHVuZGVybGluZSAtIEFOU0kgY29kZSBmb3IgdW5kZXJsaW5lZCB0ZXh0ICg0KS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBibGluayAtIEFOU0kgY29kZSBmb3IgYmxpbmtpbmcgdGV4dCAoNSkuXG4gKiBAcHJvcGVydHkge251bWJlcn0gaW52ZXJzZSAtIEFOU0kgY29kZSBmb3IgaW52ZXJzZSBjb2xvcnMgKDcpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGhpZGRlbiAtIEFOU0kgY29kZSBmb3IgaGlkZGVuIHRleHQgKDgpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IHN0cmlrZXRocm91Z2ggLSBBTlNJIGNvZGUgZm9yIHN0cmlrZXRocm91Z2ggdGV4dCAoOSkuXG4gKiBAcHJvcGVydHkge251bWJlcn0gZG91YmxlVW5kZXJsaW5lIC0gQU5TSSBjb2RlIGZvciBkb3VibGUgdW5kZXJsaW5lZCB0ZXh0ICgyMSkuXG4gKiBAcHJvcGVydHkge251bWJlcn0gbm9ybWFsQ29sb3IgLSBBTlNJIGNvZGUgdG8gcmVzZXQgY29sb3IgdG8gbm9ybWFsICgyMikuXG4gKiBAcHJvcGVydHkge251bWJlcn0gbm9JdGFsaWNPckZyYWt0dXIgLSBBTlNJIGNvZGUgdG8gdHVybiBvZmYgaXRhbGljICgyMykuXG4gKiBAcHJvcGVydHkge251bWJlcn0gbm9VbmRlcmxpbmUgLSBBTlNJIGNvZGUgdG8gdHVybiBvZmYgdW5kZXJsaW5lICgyNCkuXG4gKiBAcHJvcGVydHkge251bWJlcn0gbm9CbGluayAtIEFOU0kgY29kZSB0byB0dXJuIG9mZiBibGluayAoMjUpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IG5vSW52ZXJzZSAtIEFOU0kgY29kZSB0byB0dXJuIG9mZiBpbnZlcnNlICgyNykuXG4gKiBAcHJvcGVydHkge251bWJlcn0gbm9IaWRkZW4gLSBBTlNJIGNvZGUgdG8gdHVybiBvZmYgaGlkZGVuICgyOCkuXG4gKiBAcHJvcGVydHkge251bWJlcn0gbm9TdHJpa2V0aHJvdWdoIC0gQU5TSSBjb2RlIHRvIHR1cm4gb2ZmIHN0cmlrZXRocm91Z2ggKDI5KS5cbiAqIEBtZW1iZXJPZiBtb2R1bGU6QFN0eWxlZFN0cmluZ1xuICovXG5leHBvcnQgY29uc3Qgc3R5bGVzID0ge1xuICAgIHJlc2V0OiAwLFxuICAgIGJvbGQ6IDEsXG4gICAgZGltOiAyLFxuICAgIGl0YWxpYzogMyxcbiAgICB1bmRlcmxpbmU6IDQsXG4gICAgYmxpbms6IDUsXG4gICAgaW52ZXJzZTogNyxcbiAgICBoaWRkZW46IDgsXG4gICAgc3RyaWtldGhyb3VnaDogOSxcbiAgICBkb3VibGVVbmRlcmxpbmU6IDIxLFxuICAgIG5vcm1hbENvbG9yOiAyMixcbiAgICBub0l0YWxpY09yRnJha3R1cjogMjMsXG4gICAgbm9VbmRlcmxpbmU6IDI0LFxuICAgIG5vQmxpbms6IDI1LFxuICAgIG5vSW52ZXJzZTogMjcsXG4gICAgbm9IaWRkZW46IDI4LFxuICAgIG5vU3RyaWtldGhyb3VnaDogMjksXG59O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGY4O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkluTnlZeTlqYjI1emRHRnVkSE11ZEhNaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlEwRTdPenM3TzBkQlMwYzdRVUZEU0N4TlFVRk5MRU5CUVVNc1RVRkJUU3hUUVVGVExFZEJRVWNzVTBGQlV5eERRVUZETzBGQlJXNURPenM3T3pzN096czdPenM3TzBkQllVYzdRVUZEU0N4TlFVRk5MRU5CUVVNc1RVRkJUU3gzUWtGQmQwSXNSMEZCUnp0SlFVTjBReXhMUVVGTExFVkJRVVVzUlVGQlJUdEpRVU5VTEVkQlFVY3NSVUZCUlN4RlFVRkZPMGxCUTFBc1MwRkJTeXhGUVVGRkxFVkJRVVU3U1VGRFZDeE5RVUZOTEVWQlFVVXNSVUZCUlR0SlFVTldMRWxCUVVrc1JVRkJSU3hGUVVGRk8wbEJRMUlzVDBGQlR5eEZRVUZGTEVWQlFVVTdTVUZEV0N4SlFVRkpMRVZCUVVVc1JVRkJSVHRKUVVOU0xFdEJRVXNzUlVGQlJTeEZRVUZGTzBOQlExWXNRMEZCUXp0QlFVVkdPenM3T3pzN096czdPenM3TzBkQllVYzdRVUZEU0N4TlFVRk5MRU5CUVVNc1RVRkJUU3h6UWtGQmMwSXNSMEZCUnp0SlFVTndReXhYUVVGWExFVkJRVVVzUlVGQlJUdEpRVU5tTEZOQlFWTXNSVUZCUlN4RlFVRkZPMGxCUTJJc1YwRkJWeXhGUVVGRkxFVkJRVVU3U1VGRFppeFpRVUZaTEVWQlFVVXNSVUZCUlR0SlFVTm9RaXhWUVVGVkxFVkJRVVVzUlVGQlJUdEpRVU5rTEdGQlFXRXNSVUZCUlN4RlFVRkZPMGxCUTJwQ0xGVkJRVlVzUlVGQlJTeEZRVUZGTzBsQlEyUXNWMEZCVnl4RlFVRkZMRVZCUVVVN1EwRkRhRUlzUTBGQlF6dEJRVVZHT3pzN096czdPenM3T3pzN08wZEJZVWM3UVVGRFNDeE5RVUZOTEVOQlFVTXNUVUZCVFN4M1FrRkJkMElzUjBGQlJ6dEpRVU4wUXl4UFFVRlBMRVZCUVVVc1JVRkJSVHRKUVVOWUxFdEJRVXNzUlVGQlJTeEZRVUZGTzBsQlExUXNUMEZCVHl4RlFVRkZMRVZCUVVVN1NVRkRXQ3hSUVVGUkxFVkJRVVVzUlVGQlJUdEpRVU5hTEUxQlFVMHNSVUZCUlN4RlFVRkZPMGxCUTFZc1UwRkJVeXhGUVVGRkxFVkJRVVU3U1VGRFlpeE5RVUZOTEVWQlFVVXNSVUZCUlR0SlFVTldMRTlCUVU4c1JVRkJSU3hGUVVGRk8wTkJRMW9zUTBGQlF6dEJRVVZHT3pzN096czdPenM3T3pzN08wZEJZVWM3UVVGRFNDeE5RVUZOTEVOQlFVTXNUVUZCVFN4elFrRkJjMElzUjBGQlJ6dEpRVU53UXl4aFFVRmhMRVZCUVVVc1IwRkJSenRKUVVOc1FpeFhRVUZYTEVWQlFVVXNSMEZCUnp0SlFVTm9RaXhoUVVGaExFVkJRVVVzUjBGQlJ6dEpRVU5zUWl4alFVRmpMRVZCUVVVc1IwRkJSenRKUVVOdVFpeFpRVUZaTEVWQlFVVXNSMEZCUnp0SlFVTnFRaXhsUVVGbExFVkJRVVVzUjBGQlJ6dEpRVU53UWl4WlFVRlpMRVZCUVVVc1IwRkJSenRKUVVOcVFpeGhRVUZoTEVWQlFVVXNSMEZCUnp0RFFVTnVRaXhEUVVGRE8wRkJSVVk3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN1IwRnpRa2M3UVVGRFNDeE5RVUZOTEVOQlFVTXNUVUZCVFN4TlFVRk5MRWRCUVVjN1NVRkRjRUlzUzBGQlN5eEZRVUZGTEVOQlFVTTdTVUZEVWl4SlFVRkpMRVZCUVVVc1EwRkJRenRKUVVOUUxFZEJRVWNzUlVGQlJTeERRVUZETzBsQlEwNHNUVUZCVFN4RlFVRkZMRU5CUVVNN1NVRkRWQ3hUUVVGVExFVkJRVVVzUTBGQlF6dEpRVU5hTEV0QlFVc3NSVUZCUlN4RFFVRkRPMGxCUTFJc1QwRkJUeXhGUVVGRkxFTkJRVU03U1VGRFZpeE5RVUZOTEVWQlFVVXNRMEZCUXp0SlFVTlVMR0ZCUVdFc1JVRkJSU3hEUVVGRE8wbEJRMmhDTEdWQlFXVXNSVUZCUlN4RlFVRkZPMGxCUTI1Q0xGZEJRVmNzUlVGQlJTeEZRVUZGTzBsQlEyWXNhVUpCUVdsQ0xFVkJRVVVzUlVGQlJUdEpRVU55UWl4WFFVRlhMRVZCUVVVc1JVRkJSVHRKUVVObUxFOUJRVThzUlVGQlJTeEZRVUZGTzBsQlExZ3NVMEZCVXl4RlFVRkZMRVZCUVVVN1NVRkRZaXhSUVVGUkxFVkJRVVVzUlVGQlJUdEpRVU5hTEdWQlFXVXNSVUZCUlN4RlFVRkZPME5CUTNCQ0xFTkJRVU1pTENKbWFXeGxJam9pWTI5dWMzUmhiblJ6TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lYRzR2S2lwY2JpQXFJRUJrWlhOamNtbHdkR2x2YmlCQlRsTkpJR1Z6WTJGd1pTQmpiMlJsSUdadmNpQnlaWE5sZEhScGJtY2dkR1Y0ZENCbWIzSnRZWFIwYVc1bkxseHVJQ29nUUhOMWJXMWhjbmtnVkdocGN5QmpiMjV6ZEdGdWRDQm9iMnhrY3lCMGFHVWdRVTVUU1NCbGMyTmhjR1VnYzJWeGRXVnVZMlVnZFhObFpDQjBieUJ5WlhObGRDQmhiR3dnZEdWNGRDQm1iM0p0WVhSMGFXNW5JSFJ2SUdSbFptRjFiSFF1WEc0Z0tpQkFZMjl1YzNRZ1FXNXphVkpsYzJWMFhHNGdLaUJBYldWdFltVnlUMllnYlc5a2RXeGxPbE4wZVd4bFpGTjBjbWx1WjF4dUlDb3ZYRzVsZUhCdmNuUWdZMjl1YzNRZ1FXNXphVkpsYzJWMElEMGdYQ0pjWEhneFlsc3diVndpTzF4dVhHNHZLaXBjYmlBcUlFQmtaWE5qY21sd2RHbHZiaUJUZEdGdVpHRnlaQ0JtYjNKbFozSnZkVzVrSUdOdmJHOXlJR052WkdWeklHWnZjaUJCVGxOSklIUmxlSFFnWm05eWJXRjBkR2x1Wnk1Y2JpQXFJRUJ6ZFcxdFlYSjVJRlJvYVhNZ2IySnFaV04wSUcxaGNITWdZMjlzYjNJZ2JtRnRaWE1nZEc4Z2RHaGxhWElnWTI5eWNtVnpjRzl1WkdsdVp5QkJUbE5KSUdOdmJHOXlJR052WkdWeklHWnZjaUJ6ZEdGdVpHRnlaQ0JtYjNKbFozSnZkVzVrSUdOdmJHOXljeTVjYmlBcUlFQmpiMjV6ZENCVGRHRnVaR0Z5WkVadmNtVm5jbTkxYm1SRGIyeHZjbk5jYmlBcUlFQndjbTl3WlhKMGVTQjdiblZ0WW1WeWZTQmliR0ZqYXlBdElFRk9VMGtnWTI5a1pTQm1iM0lnWW14aFkyc2dkR1Y0ZENBb016QXBMbHh1SUNvZ1FIQnliM0JsY25SNUlIdHVkVzFpWlhKOUlISmxaQ0F0SUVGT1Uwa2dZMjlrWlNCbWIzSWdjbVZrSUhSbGVIUWdLRE14S1M1Y2JpQXFJRUJ3Y205d1pYSjBlU0I3Ym5WdFltVnlmU0JuY21WbGJpQXRJRUZPVTBrZ1kyOWtaU0JtYjNJZ1ozSmxaVzRnZEdWNGRDQW9NeklwTGx4dUlDb2dRSEJ5YjNCbGNuUjVJSHR1ZFcxaVpYSjlJSGxsYkd4dmR5QXRJRUZPVTBrZ1kyOWtaU0JtYjNJZ2VXVnNiRzkzSUhSbGVIUWdLRE16S1M1Y2JpQXFJRUJ3Y205d1pYSjBlU0I3Ym5WdFltVnlmU0JpYkhWbElDMGdRVTVUU1NCamIyUmxJR1p2Y2lCaWJIVmxJSFJsZUhRZ0tETTBLUzVjYmlBcUlFQndjbTl3WlhKMGVTQjdiblZ0WW1WeWZTQnRZV2RsYm5SaElDMGdRVTVUU1NCamIyUmxJR1p2Y2lCdFlXZGxiblJoSUhSbGVIUWdLRE0xS1M1Y2JpQXFJRUJ3Y205d1pYSjBlU0I3Ym5WdFltVnlmU0JqZVdGdUlDMGdRVTVUU1NCamIyUmxJR1p2Y2lCamVXRnVJSFJsZUhRZ0tETTJLUzVjYmlBcUlFQndjbTl3WlhKMGVTQjdiblZ0WW1WeWZTQjNhR2wwWlNBdElFRk9VMGtnWTI5a1pTQm1iM0lnZDJocGRHVWdkR1Y0ZENBb016Y3BMbHh1SUNvZ1FHMWxiV0psY2s5bUlHMXZaSFZzWlRwVGRIbHNaV1JUZEhKcGJtZGNiaUFxTDF4dVpYaHdiM0owSUdOdmJuTjBJRk4wWVc1a1lYSmtSbTl5WldkeWIzVnVaRU52Ykc5eWN5QTlJSHRjYmlBZ1lteGhZMnM2SURNd0xGeHVJQ0J5WldRNklETXhMRnh1SUNCbmNtVmxiam9nTXpJc1hHNGdJSGxsYkd4dmR6b2dNek1zWEc0Z0lHSnNkV1U2SURNMExGeHVJQ0J0WVdkbGJuUmhPaUF6TlN4Y2JpQWdZM2xoYmpvZ016WXNYRzRnSUhkb2FYUmxPaUF6Tnl4Y2JuMDdYRzVjYmk4cUtseHVJQ29nUUdSbGMyTnlhWEIwYVc5dUlFSnlhV2RvZENCbWIzSmxaM0p2ZFc1a0lHTnZiRzl5SUdOdlpHVnpJR1p2Y2lCQlRsTkpJSFJsZUhRZ1ptOXliV0YwZEdsdVp5NWNiaUFxSUVCemRXMXRZWEo1SUZSb2FYTWdiMkpxWldOMElHMWhjSE1nWTI5c2IzSWdibUZ0WlhNZ2RHOGdkR2hsYVhJZ1kyOXljbVZ6Y0c5dVpHbHVaeUJCVGxOSklHTnZiRzl5SUdOdlpHVnpJR1p2Y2lCaWNtbG5hSFFnWm05eVpXZHliM1Z1WkNCamIyeHZjbk11WEc0Z0tpQkFZMjl1YzNRZ1FuSnBaMmgwUm05eVpXZHliM1Z1WkVOdmJHOXljMXh1SUNvZ1FIQnliM0JsY25SNUlIdHVkVzFpWlhKOUlHSnNZV05ySUMwZ1FVNVRTU0JqYjJSbElHWnZjaUJpY21sbmFIUWdZbXhoWTJzZ2RHVjRkQ0FvT1RBcExseHVJQ29nUUhCeWIzQmxjblI1SUh0dWRXMWlaWEo5SUhKbFpDQXRJRUZPVTBrZ1kyOWtaU0JtYjNJZ1luSnBaMmgwSUhKbFpDQjBaWGgwSUNnNU1Ta3VYRzRnS2lCQWNISnZjR1Z5ZEhrZ2UyNTFiV0psY24wZ1ozSmxaVzRnTFNCQlRsTkpJR052WkdVZ1ptOXlJR0p5YVdkb2RDQm5jbVZsYmlCMFpYaDBJQ2c1TWlrdVhHNGdLaUJBY0hKdmNHVnlkSGtnZTI1MWJXSmxjbjBnZVdWc2JHOTNJQzBnUVU1VFNTQmpiMlJsSUdadmNpQmljbWxuYUhRZ2VXVnNiRzkzSUhSbGVIUWdLRGt6S1M1Y2JpQXFJRUJ3Y205d1pYSjBlU0I3Ym5WdFltVnlmU0JpYkhWbElDMGdRVTVUU1NCamIyUmxJR1p2Y2lCaWNtbG5hSFFnWW14MVpTQjBaWGgwSUNnNU5Da3VYRzRnS2lCQWNISnZjR1Z5ZEhrZ2UyNTFiV0psY24wZ2JXRm5aVzUwWVNBdElFRk9VMGtnWTI5a1pTQm1iM0lnWW5KcFoyaDBJRzFoWjJWdWRHRWdkR1Y0ZENBb09UVXBMbHh1SUNvZ1FIQnliM0JsY25SNUlIdHVkVzFpWlhKOUlHTjVZVzRnTFNCQlRsTkpJR052WkdVZ1ptOXlJR0p5YVdkb2RDQmplV0Z1SUhSbGVIUWdLRGsyS1M1Y2JpQXFJRUJ3Y205d1pYSjBlU0I3Ym5WdFltVnlmU0IzYUdsMFpTQXRJRUZPVTBrZ1kyOWtaU0JtYjNJZ1luSnBaMmgwSUhkb2FYUmxJSFJsZUhRZ0tEazNLUzVjYmlBcUlFQnRaVzFpWlhKUFppQnRiMlIxYkdVNlFGTjBlV3hsWkZOMGNtbHVaMXh1SUNvdlhHNWxlSEJ2Y25RZ1kyOXVjM1FnUW5KcFoyaDBSbTl5WldkeWIzVnVaRU52Ykc5eWN5QTlJSHRjYmlBZ1luSnBaMmgwUW14aFkyczZJRGt3TEZ4dUlDQmljbWxuYUhSU1pXUTZJRGt4TEZ4dUlDQmljbWxuYUhSSGNtVmxiam9nT1RJc1hHNGdJR0p5YVdkb2RGbGxiR3h2ZHpvZ09UTXNYRzRnSUdKeWFXZG9kRUpzZFdVNklEazBMRnh1SUNCaWNtbG5hSFJOWVdkbGJuUmhPaUE1TlN4Y2JpQWdZbkpwWjJoMFEzbGhiam9nT1RZc1hHNGdJR0p5YVdkb2RGZG9hWFJsT2lBNU55eGNibjA3WEc1Y2JpOHFLbHh1SUNvZ1FHUmxjMk55YVhCMGFXOXVJRk4wWVc1a1lYSmtJR0poWTJ0bmNtOTFibVFnWTI5c2IzSWdZMjlrWlhNZ1ptOXlJRUZPVTBrZ2RHVjRkQ0JtYjNKdFlYUjBhVzVuTGx4dUlDb2dRSE4xYlcxaGNua2dWR2hwY3lCdlltcGxZM1FnYldGd2N5QmpiMnh2Y2lCdVlXMWxjeUIwYnlCMGFHVnBjaUJqYjNKeVpYTndiMjVrYVc1bklFRk9VMGtnWTI5c2IzSWdZMjlrWlhNZ1ptOXlJSE4wWVc1a1lYSmtJR0poWTJ0bmNtOTFibVFnWTI5c2IzSnpMbHh1SUNvZ1FHTnZibk4wSUZOMFlXNWtZWEprUW1GamEyZHliM1Z1WkVOdmJHOXljMXh1SUNvZ1FIQnliM0JsY25SNUlIdHVkVzFpWlhKOUlHSm5RbXhoWTJzZ0xTQkJUbE5KSUdOdlpHVWdabTl5SUdKc1lXTnJJR0poWTJ0bmNtOTFibVFnS0RRd0tTNWNiaUFxSUVCd2NtOXdaWEowZVNCN2JuVnRZbVZ5ZlNCaVoxSmxaQ0F0SUVGT1Uwa2dZMjlrWlNCbWIzSWdjbVZrSUdKaFkydG5jbTkxYm1RZ0tEUXhLUzVjYmlBcUlFQndjbTl3WlhKMGVTQjdiblZ0WW1WeWZTQmlaMGR5WldWdUlDMGdRVTVUU1NCamIyUmxJR1p2Y2lCbmNtVmxiaUJpWVdOclozSnZkVzVrSUNnME1pa3VYRzRnS2lCQWNISnZjR1Z5ZEhrZ2UyNTFiV0psY24wZ1ltZFpaV3hzYjNjZ0xTQkJUbE5KSUdOdlpHVWdabTl5SUhsbGJHeHZkeUJpWVdOclozSnZkVzVrSUNnME15a3VYRzRnS2lCQWNISnZjR1Z5ZEhrZ2UyNTFiV0psY24wZ1ltZENiSFZsSUMwZ1FVNVRTU0JqYjJSbElHWnZjaUJpYkhWbElHSmhZMnRuY205MWJtUWdLRFEwS1M1Y2JpQXFJRUJ3Y205d1pYSjBlU0I3Ym5WdFltVnlmU0JpWjAxaFoyVnVkR0VnTFNCQlRsTkpJR052WkdVZ1ptOXlJRzFoWjJWdWRHRWdZbUZqYTJkeWIzVnVaQ0FvTkRVcExseHVJQ29nUUhCeWIzQmxjblI1SUh0dWRXMWlaWEo5SUdKblEzbGhiaUF0SUVGT1Uwa2dZMjlrWlNCbWIzSWdZM2xoYmlCaVlXTnJaM0p2ZFc1a0lDZzBOaWt1WEc0Z0tpQkFjSEp2Y0dWeWRIa2dlMjUxYldKbGNuMGdZbWRYYUdsMFpTQXRJRUZPVTBrZ1kyOWtaU0JtYjNJZ2QyaHBkR1VnWW1GamEyZHliM1Z1WkNBb05EY3BMbHh1SUNvZ1FHMWxiV0psY2s5bUlHMXZaSFZzWlRwQVUzUjViR1ZrVTNSeWFXNW5YRzRnS2k5Y2JtVjRjRzl5ZENCamIyNXpkQ0JUZEdGdVpHRnlaRUpoWTJ0bmNtOTFibVJEYjJ4dmNuTWdQU0I3WEc0Z0lHSm5RbXhoWTJzNklEUXdMRnh1SUNCaVoxSmxaRG9nTkRFc1hHNGdJR0puUjNKbFpXNDZJRFF5TEZ4dUlDQmlaMWxsYkd4dmR6b2dORE1zWEc0Z0lHSm5RbXgxWlRvZ05EUXNYRzRnSUdKblRXRm5aVzUwWVRvZ05EVXNYRzRnSUdKblEzbGhiam9nTkRZc1hHNGdJR0puVjJocGRHVTZJRFEzTEZ4dWZUdGNibHh1THlvcVhHNGdLaUJBWkdWelkzSnBjSFJwYjI0Z1FuSnBaMmgwSUdKaFkydG5jbTkxYm1RZ1kyOXNiM0lnWTI5a1pYTWdabTl5SUVGT1Uwa2dkR1Y0ZENCbWIzSnRZWFIwYVc1bkxseHVJQ29nUUhOMWJXMWhjbmtnVkdocGN5QnZZbXBsWTNRZ2JXRndjeUJqYjJ4dmNpQnVZVzFsY3lCMGJ5QjBhR1ZwY2lCamIzSnlaWE53YjI1a2FXNW5JRUZPVTBrZ1kyOXNiM0lnWTI5a1pYTWdabTl5SUdKeWFXZG9kQ0JpWVdOclozSnZkVzVrSUdOdmJHOXljeTVjYmlBcUlFQmpiMjV6ZENCQ2NtbG5hSFJDWVdOclozSnZkVzVrUTI5c2IzSnpYRzRnS2lCQWNISnZjR1Z5ZEhrZ2UyNTFiV0psY24wZ1ltZENjbWxuYUhSQ2JHRmpheUF0SUVGT1Uwa2dZMjlrWlNCbWIzSWdZbkpwWjJoMElHSnNZV05ySUdKaFkydG5jbTkxYm1RZ0tERXdNQ2t1WEc0Z0tpQkFjSEp2Y0dWeWRIa2dlMjUxYldKbGNuMGdZbWRDY21sbmFIUlNaV1FnTFNCQlRsTkpJR052WkdVZ1ptOXlJR0p5YVdkb2RDQnlaV1FnWW1GamEyZHliM1Z1WkNBb01UQXhLUzVjYmlBcUlFQndjbTl3WlhKMGVTQjdiblZ0WW1WeWZTQmlaMEp5YVdkb2RFZHlaV1Z1SUMwZ1FVNVRTU0JqYjJSbElHWnZjaUJpY21sbmFIUWdaM0psWlc0Z1ltRmphMmR5YjNWdVpDQW9NVEF5S1M1Y2JpQXFJRUJ3Y205d1pYSjBlU0I3Ym5WdFltVnlmU0JpWjBKeWFXZG9kRmxsYkd4dmR5QXRJRUZPVTBrZ1kyOWtaU0JtYjNJZ1luSnBaMmgwSUhsbGJHeHZkeUJpWVdOclozSnZkVzVrSUNneE1ETXBMbHh1SUNvZ1FIQnliM0JsY25SNUlIdHVkVzFpWlhKOUlHSm5RbkpwWjJoMFFteDFaU0F0SUVGT1Uwa2dZMjlrWlNCbWIzSWdZbkpwWjJoMElHSnNkV1VnWW1GamEyZHliM1Z1WkNBb01UQTBLUzVjYmlBcUlFQndjbTl3WlhKMGVTQjdiblZ0WW1WeWZTQmlaMEp5YVdkb2RFMWhaMlZ1ZEdFZ0xTQkJUbE5KSUdOdlpHVWdabTl5SUdKeWFXZG9kQ0J0WVdkbGJuUmhJR0poWTJ0bmNtOTFibVFnS0RFd05Ta3VYRzRnS2lCQWNISnZjR1Z5ZEhrZ2UyNTFiV0psY24wZ1ltZENjbWxuYUhSRGVXRnVJQzBnUVU1VFNTQmpiMlJsSUdadmNpQmljbWxuYUhRZ1kzbGhiaUJpWVdOclozSnZkVzVrSUNneE1EWXBMbHh1SUNvZ1FIQnliM0JsY25SNUlIdHVkVzFpWlhKOUlHSm5RbkpwWjJoMFYyaHBkR1VnTFNCQlRsTkpJR052WkdVZ1ptOXlJR0p5YVdkb2RDQjNhR2wwWlNCaVlXTnJaM0p2ZFc1a0lDZ3hNRGNwTGx4dUlDb2dRRzFsYldKbGNrOW1JRzF2WkhWc1pUcEFVM1I1YkdWa1UzUnlhVzVuWEc0Z0tpOWNibVY0Y0c5eWRDQmpiMjV6ZENCQ2NtbG5hSFJDWVdOclozSnZkVzVrUTI5c2IzSnpJRDBnZTF4dUlDQmlaMEp5YVdkb2RFSnNZV05yT2lBeE1EQXNYRzRnSUdKblFuSnBaMmgwVW1Wa09pQXhNREVzWEc0Z0lHSm5RbkpwWjJoMFIzSmxaVzQ2SURFd01peGNiaUFnWW1kQ2NtbG5hSFJaWld4c2IzYzZJREV3TXl4Y2JpQWdZbWRDY21sbmFIUkNiSFZsT2lBeE1EUXNYRzRnSUdKblFuSnBaMmgwVFdGblpXNTBZVG9nTVRBMUxGeHVJQ0JpWjBKeWFXZG9kRU41WVc0NklERXdOaXhjYmlBZ1ltZENjbWxuYUhSWGFHbDBaVG9nTVRBM0xGeHVmVHRjYmx4dUx5b3FYRzRnS2lCQVpHVnpZM0pwY0hScGIyNGdWR1Y0ZENCemRIbHNaU0JqYjJSbGN5Qm1iM0lnUVU1VFNTQjBaWGgwSUdadmNtMWhkSFJwYm1jdVhHNGdLaUJBYzNWdGJXRnllU0JVYUdseklHOWlhbVZqZENCdFlYQnpJSE4wZVd4bElHNWhiV1Z6SUhSdklIUm9aV2x5SUdOdmNuSmxjM0J2Ym1ScGJtY2dRVTVUU1NCamIyUmxjeUJtYjNJZ2RtRnlhVzkxY3lCMFpYaDBJSE4wZVd4bGN5NWNiaUFxSUVCamIyNXpkQ0J6ZEhsc1pYTmNiaUFxSUVCd2NtOXdaWEowZVNCN2JuVnRZbVZ5ZlNCeVpYTmxkQ0F0SUVGT1Uwa2dZMjlrWlNCMGJ5QnlaWE5sZENCaGJHd2djM1I1YkdWeklDZ3dLUzVjYmlBcUlFQndjbTl3WlhKMGVTQjdiblZ0WW1WeWZTQmliMnhrSUMwZ1FVNVRTU0JqYjJSbElHWnZjaUJpYjJ4a0lIUmxlSFFnS0RFcExseHVJQ29nUUhCeWIzQmxjblI1SUh0dWRXMWlaWEo5SUdScGJTQXRJRUZPVTBrZ1kyOWtaU0JtYjNJZ1pHbHRJSFJsZUhRZ0tESXBMbHh1SUNvZ1FIQnliM0JsY25SNUlIdHVkVzFpWlhKOUlHbDBZV3hwWXlBdElFRk9VMGtnWTI5a1pTQm1iM0lnYVhSaGJHbGpJSFJsZUhRZ0tETXBMbHh1SUNvZ1FIQnliM0JsY25SNUlIdHVkVzFpWlhKOUlIVnVaR1Z5YkdsdVpTQXRJRUZPVTBrZ1kyOWtaU0JtYjNJZ2RXNWtaWEpzYVc1bFpDQjBaWGgwSUNnMEtTNWNiaUFxSUVCd2NtOXdaWEowZVNCN2JuVnRZbVZ5ZlNCaWJHbHVheUF0SUVGT1Uwa2dZMjlrWlNCbWIzSWdZbXhwYm10cGJtY2dkR1Y0ZENBb05Ta3VYRzRnS2lCQWNISnZjR1Z5ZEhrZ2UyNTFiV0psY24wZ2FXNTJaWEp6WlNBdElFRk9VMGtnWTI5a1pTQm1iM0lnYVc1MlpYSnpaU0JqYjJ4dmNuTWdLRGNwTGx4dUlDb2dRSEJ5YjNCbGNuUjVJSHR1ZFcxaVpYSjlJR2hwWkdSbGJpQXRJRUZPVTBrZ1kyOWtaU0JtYjNJZ2FHbGtaR1Z1SUhSbGVIUWdLRGdwTGx4dUlDb2dRSEJ5YjNCbGNuUjVJSHR1ZFcxaVpYSjlJSE4wY21sclpYUm9jbTkxWjJnZ0xTQkJUbE5KSUdOdlpHVWdabTl5SUhOMGNtbHJaWFJvY205MVoyZ2dkR1Y0ZENBb09Ta3VYRzRnS2lCQWNISnZjR1Z5ZEhrZ2UyNTFiV0psY24wZ1pHOTFZbXhsVlc1a1pYSnNhVzVsSUMwZ1FVNVRTU0JqYjJSbElHWnZjaUJrYjNWaWJHVWdkVzVrWlhKc2FXNWxaQ0IwWlhoMElDZ3lNU2t1WEc0Z0tpQkFjSEp2Y0dWeWRIa2dlMjUxYldKbGNuMGdibTl5YldGc1EyOXNiM0lnTFNCQlRsTkpJR052WkdVZ2RHOGdjbVZ6WlhRZ1kyOXNiM0lnZEc4Z2JtOXliV0ZzSUNneU1pa3VYRzRnS2lCQWNISnZjR1Z5ZEhrZ2UyNTFiV0psY24wZ2JtOUpkR0ZzYVdOUGNrWnlZV3QwZFhJZ0xTQkJUbE5KSUdOdlpHVWdkRzhnZEhWeWJpQnZabVlnYVhSaGJHbGpJQ2d5TXlrdVhHNGdLaUJBY0hKdmNHVnlkSGtnZTI1MWJXSmxjbjBnYm05VmJtUmxjbXhwYm1VZ0xTQkJUbE5KSUdOdlpHVWdkRzhnZEhWeWJpQnZabVlnZFc1a1pYSnNhVzVsSUNneU5Da3VYRzRnS2lCQWNISnZjR1Z5ZEhrZ2UyNTFiV0psY24wZ2JtOUNiR2x1YXlBdElFRk9VMGtnWTI5a1pTQjBieUIwZFhKdUlHOW1aaUJpYkdsdWF5QW9NalVwTGx4dUlDb2dRSEJ5YjNCbGNuUjVJSHR1ZFcxaVpYSjlJRzV2U1c1MlpYSnpaU0F0SUVGT1Uwa2dZMjlrWlNCMGJ5QjBkWEp1SUc5bVppQnBiblpsY25ObElDZ3lOeWt1WEc0Z0tpQkFjSEp2Y0dWeWRIa2dlMjUxYldKbGNuMGdibTlJYVdSa1pXNGdMU0JCVGxOSklHTnZaR1VnZEc4Z2RIVnliaUJ2Wm1ZZ2FHbGtaR1Z1SUNneU9Da3VYRzRnS2lCQWNISnZjR1Z5ZEhrZ2UyNTFiV0psY24wZ2JtOVRkSEpwYTJWMGFISnZkV2RvSUMwZ1FVNVRTU0JqYjJSbElIUnZJSFIxY200Z2IyWm1JSE4wY21sclpYUm9jbTkxWjJnZ0tESTVLUzVjYmlBcUlFQnRaVzFpWlhKUFppQnRiMlIxYkdVNlFGTjBlV3hsWkZOMGNtbHVaMXh1SUNvdlhHNWxlSEJ2Y25RZ1kyOXVjM1FnYzNSNWJHVnpJRDBnZTF4dUlDQnlaWE5sZERvZ01DeGNiaUFnWW05c1pEb2dNU3hjYmlBZ1pHbHRPaUF5TEZ4dUlDQnBkR0ZzYVdNNklETXNYRzRnSUhWdVpHVnliR2x1WlRvZ05DeGNiaUFnWW14cGJtczZJRFVzWEc0Z0lHbHVkbVZ5YzJVNklEY3NYRzRnSUdocFpHUmxiam9nT0N4Y2JpQWdjM1J5YVd0bGRHaHliM1ZuYURvZ09TeGNiaUFnWkc5MVlteGxWVzVrWlhKc2FXNWxPaUF5TVN4Y2JpQWdibTl5YldGc1EyOXNiM0k2SURJeUxGeHVJQ0J1YjBsMFlXeHBZMDl5Um5KaGEzUjFjam9nTWpNc1hHNGdJRzV2Vlc1a1pYSnNhVzVsT2lBeU5DeGNiaUFnYm05Q2JHbHVhem9nTWpVc1hHNGdJRzV2U1c1MlpYSnpaVG9nTWpjc1hHNGdJRzV2U0dsa1pHVnVPaUF5T0N4Y2JpQWdibTlUZEhKcGEyVjBhSEp2ZFdkb09pQXlPU3hjYm4wN1hHNGlYWDA9XG4iLCJpbXBvcnQgeyBBbnNpUmVzZXQsIHN0eWxlcyB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuLyoqXG4gKiBAZGVzY3JpcHRpb24gQXBwbGllcyBhIGJhc2ljIEFOU0kgY29sb3IgY29kZSB0byB0ZXh0LlxuICogQHN1bW1hcnkgVGhpcyBmdW5jdGlvbiB0YWtlcyBhIHN0cmluZywgYW4gQU5TSSBjb2xvciBjb2RlIG51bWJlciwgYW5kIGFuIG9wdGlvbmFsIGJhY2tncm91bmQgZmxhZy5cbiAqIEl0IHJldHVybnMgdGhlIHRleHQgd3JhcHBlZCBpbiB0aGUgYXBwcm9wcmlhdGUgQU5TSSBlc2NhcGUgY29kZXMgZm9yIGVpdGhlciBmb3JlZ3JvdW5kIG9yIGJhY2tncm91bmQgY29sb3JpbmcuXG4gKiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgZm9yIGJhc2ljIDE2LWNvbG9yIEFOU0kgZm9ybWF0dGluZy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRoZSB0ZXh0IHRvIGJlIGNvbG9yZWQuXG4gKiBAcGFyYW0ge251bWJlcn0gbiAtIFRoZSBBTlNJIGNvbG9yIGNvZGUgbnVtYmVyLlxuICogQHBhcmFtIHtib29sZWFufSBbYmc9ZmFsc2VdIC0gSWYgdHJ1ZSwgYXBwbGllcyB0aGUgY29sb3IgdG8gdGhlIGJhY2tncm91bmQgaW5zdGVhZCBvZiB0aGUgZm9yZWdyb3VuZC5cbiAqIEByZXR1cm4ge3N0cmluZ30gVGhlIHRleHQgd3JhcHBlZCBpbiBBTlNJIGNvbG9yIGNvZGVzLlxuICpcbiAqIEBmdW5jdGlvbiBjb2xvcml6ZUFOU0lcbiAqIEBtZW1iZXJPZiBtb2R1bGU6QFN0eWxlZFN0cmluZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gY29sb3JpemVBTlNJKHRleHQsIG4sIGJnID0gZmFsc2UpIHtcbiAgICBpZiAoaXNOYU4obikpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBJbnZhbGlkIGNvbG9yIG51bWJlciBvbiB0aGUgQU5TSSBzY2FsZTogJHtufS4gaWdub3JpbmcuLi5gKTtcbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICAgIGlmIChiZyAmJiAoKG4gPiAzMCAmJiBuIDw9IDQwKVxuICAgICAgICB8fCAobiA+IDkwICYmIG4gPD0gMTAwKSkpIHtcbiAgICAgICAgbiA9IG4gKyAxMDtcbiAgICB9XG4gICAgcmV0dXJuIGBcXHgxYlske259bSR7dGV4dH0ke0Fuc2lSZXNldH1gO1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gQXBwbGllcyBhIDI1Ni1jb2xvciBBTlNJIGNvZGUgdG8gdGV4dC5cbiAqIEBzdW1tYXJ5IFRoaXMgZnVuY3Rpb24gdGFrZXMgYSBzdHJpbmcgYW5kIGEgY29sb3IgbnVtYmVyICgwLTI1NSkgYW5kIHJldHVybnMgdGhlIHRleHRcbiAqIHdyYXBwZWQgaW4gQU5TSSBlc2NhcGUgY29kZXMgZm9yIGVpdGhlciBmb3JlZ3JvdW5kIG9yIGJhY2tncm91bmQgY29sb3JpbmcuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgLSBUaGUgdGV4dCB0byBiZSBjb2xvcmVkLlxuICogQHBhcmFtIHtudW1iZXJ9IG4gLSBUaGUgY29sb3IgbnVtYmVyICgwLTI1NSkuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtiZz1mYWxzZV0gLSBJZiB0cnVlLCBhcHBsaWVzIHRoZSBjb2xvciB0byB0aGUgYmFja2dyb3VuZCBpbnN0ZWFkIG9mIHRoZSBmb3JlZ3JvdW5kLlxuICogQHJldHVybiB7c3RyaW5nfSBUaGUgdGV4dCB3cmFwcGVkIGluIEFOU0kgY29sb3IgY29kZXMuXG4gKlxuICogQGZ1bmN0aW9uIGNvbG9yaXplMjU2XG4gKiBAbWVtYmVyT2YgbW9kdWxlOkBTdHlsZWRTdHJpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbG9yaXplMjU2KHRleHQsIG4sIGJnID0gZmFsc2UpIHtcbiAgICBpZiAoaXNOYU4obikpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBJbnZhbGlkIGNvbG9yIG51bWJlciBvbiB0aGUgMjU2IHNjYWxlOiAke259LiBpZ25vcmluZy4uLmApO1xuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gICAgaWYgKG4gPCAwIHx8IG4gPiAyNTUpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBJbnZhbGlkIGNvbG9yIG51bWJlciBvbiB0aGUgMjU2IHNjYWxlOiAke259LiBpZ25vcmluZy4uLmApO1xuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gICAgcmV0dXJuIGBcXHgxYlske2JnID8gNDggOiAzOH07NTske259bSR7dGV4dH0ke0Fuc2lSZXNldH1gO1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gQXBwbGllcyBhbiBSR0IgY29sb3IgQU5TSSBjb2RlIHRvIHRleHQuXG4gKiBAc3VtbWFyeSBUaGlzIGZ1bmN0aW9uIHRha2VzIGEgc3RyaW5nIGFuZCBSR0IgY29sb3IgdmFsdWVzICgwLTI1NSBmb3IgZWFjaCBjb21wb25lbnQpXG4gKiBhbmQgcmV0dXJucyB0aGUgdGV4dCB3cmFwcGVkIGluIEFOU0kgZXNjYXBlIGNvZGVzIGZvciBlaXRoZXIgZm9yZWdyb3VuZCBvciBiYWNrZ3JvdW5kIGNvbG9yaW5nLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gVGhlIHRleHQgdG8gYmUgY29sb3JlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSByIC0gVGhlIHJlZCBjb21wb25lbnQgb2YgdGhlIGNvbG9yICgwLTI1NSkuXG4gKiBAcGFyYW0ge251bWJlcn0gZyAtIFRoZSBncmVlbiBjb21wb25lbnQgb2YgdGhlIGNvbG9yICgwLTI1NSkuXG4gKiBAcGFyYW0ge251bWJlcn0gYiAtIFRoZSBibHVlIGNvbXBvbmVudCBvZiB0aGUgY29sb3IgKDAtMjU1KS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2JnPWZhbHNlXSAtIElmIHRydWUsIGFwcGxpZXMgdGhlIGNvbG9yIHRvIHRoZSBiYWNrZ3JvdW5kIGluc3RlYWQgb2YgdGhlIGZvcmVncm91bmQuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSB0ZXh0IHdyYXBwZWQgaW4gQU5TSSBjb2xvciBjb2Rlcy5cbiAqXG4gKiBAZnVuY3Rpb24gY29sb3JpemVSR0JcbiAqIEBtZW1iZXJPZiBtb2R1bGU6U3R5bGVkU3RyaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb2xvcml6ZVJHQih0ZXh0LCByLCBnLCBiLCBiZyA9IGZhbHNlKSB7XG4gICAgaWYgKGlzTmFOKHIpIHx8IGlzTmFOKGcpIHx8IGlzTmFOKGIpKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgSW52YWxpZCBSR0IgY29sb3IgdmFsdWVzOiByPSR7cn0sIGc9JHtnfSwgYj0ke2J9LiBJZ25vcmluZy4uLmApO1xuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gICAgaWYgKFtyLCBnLCBiXS5zb21lKHYgPT4gdiA8IDAgfHwgdiA+IDI1NSkpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBJbnZhbGlkIFJHQiBjb2xvciB2YWx1ZXM6IHI9JHtyfSwgZz0ke2d9LCBiPSR7Yn0uIElnbm9yaW5nLi4uYCk7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgICByZXR1cm4gYFxceDFiWyR7YmcgPyA0OCA6IDM4fTsyOyR7cn07JHtnfTske2J9bSR7dGV4dH0ke0Fuc2lSZXNldH1gO1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gQXBwbGllcyBhbiBBTlNJIHN0eWxlIGNvZGUgdG8gdGV4dC5cbiAqIEBzdW1tYXJ5IFRoaXMgZnVuY3Rpb24gdGFrZXMgYSBzdHJpbmcgYW5kIGEgc3R5bGUgY29kZSAoZWl0aGVyIGEgbnVtYmVyIG9yIGEga2V5IGZyb20gdGhlIHN0eWxlcyBvYmplY3QpXG4gKiBhbmQgcmV0dXJucyB0aGUgdGV4dCB3cmFwcGVkIGluIHRoZSBhcHByb3ByaWF0ZSBBTlNJIGVzY2FwZSBjb2RlcyBmb3IgdGhhdCBzdHlsZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRoZSB0ZXh0IHRvIGJlIHN0eWxlZC5cbiAqIEBwYXJhbSB7bnVtYmVyIHwgc3RyaW5nfSBuIC0gVGhlIHN0eWxlIGNvZGUgb3Igc3R5bGUgbmFtZS5cbiAqIEByZXR1cm4ge3N0cmluZ30gVGhlIHRleHQgd3JhcHBlZCBpbiBBTlNJIHN0eWxlIGNvZGVzLlxuICpcbiAqIEBmdW5jdGlvbiBhcHBseVN0eWxlXG4gKiBAbWVtYmVyT2YgbW9kdWxlOlN0eWxlZFN0cmluZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlTdHlsZSh0ZXh0LCBuKSB7XG4gICAgY29uc3Qgc3R5bGVDb2RlID0gdHlwZW9mIG4gPT09IFwibnVtYmVyXCIgPyBuIDogc3R5bGVzW25dO1xuICAgIHJldHVybiBgXFx4MWJbJHtzdHlsZUNvZGV9bSR7dGV4dH0ke0Fuc2lSZXNldH1gO1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gUmVtb3ZlcyBhbGwgQU5TSSBmb3JtYXR0aW5nIGNvZGVzIGZyb20gdGV4dC5cbiAqIEBzdW1tYXJ5IFRoaXMgZnVuY3Rpb24gdGFrZXMgYSBzdHJpbmcgdGhhdCBtYXkgY29udGFpbiBBTlNJIGVzY2FwZSBjb2RlcyBmb3IgZm9ybWF0dGluZ1xuICogYW5kIHJldHVybnMgYSBuZXcgc3RyaW5nIHdpdGggYWxsIHN1Y2ggY29kZXMgcmVtb3ZlZCwgbGVhdmluZyBvbmx5IHRoZSBwbGFpbiB0ZXh0IGNvbnRlbnQuXG4gKiBJdCB1c2VzIGEgcmVndWxhciBleHByZXNzaW9uIHRvIG1hdGNoIGFuZCByZW1vdmUgQU5TSSBlc2NhcGUgc2VxdWVuY2VzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gVGhlIHRleHQgcG90ZW50aWFsbHkgY29udGFpbmluZyBBTlNJIGZvcm1hdHRpbmcgY29kZXMuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBpbnB1dCB0ZXh0IHdpdGggYWxsIEFOU0kgZm9ybWF0dGluZyBjb2RlcyByZW1vdmVkLlxuICpcbiAqIEBmdW5jdGlvbiBjbGVhclxuICogQG1lbWJlck9mIG1vZHVsZTpTdHlsZWRTdHJpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyKHRleHQpIHtcbiAgICAvLyBSZWd1bGFyIGV4cHJlc3Npb24gdG8gbWF0Y2ggQU5TSSBlc2NhcGUgY29kZXNcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29udHJvbC1yZWdleFxuICAgIGNvbnN0IGFuc2lSZWdleCA9IC9cXHgxQig/OltALVpcXFxcLV9dfFxcW1swLT9dKlsgLS9dKltALX5dKS9nO1xuICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoYW5zaVJlZ2V4LCAnJyk7XG59XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBBcHBsaWVzIHJhdyBBTlNJIGVzY2FwZSBjb2RlcyB0byB0ZXh0LlxuICogQHN1bW1hcnkgVGhpcyBmdW5jdGlvbiB0YWtlcyBhIHN0cmluZyBhbmQgYSByYXcgQU5TSSBlc2NhcGUgY29kZSwgYW5kIHJldHVybnMgdGhlIHRleHRcbiAqIHdyYXBwZWQgaW4gdGhlIHByb3ZpZGVkIHJhdyBBTlNJIGNvZGUgYW5kIHRoZSByZXNldCBjb2RlLiBUaGlzIGFsbG93cyBmb3IgYXBwbHlpbmcgY3VzdG9tXG4gKiBvciBjb21wbGV4IEFOU0kgZm9ybWF0dGluZyB0aGF0IG1heSBub3QgYmUgY292ZXJlZCBieSBvdGhlciB1dGlsaXR5IGZ1bmN0aW9ucy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRoZSB0ZXh0IHRvIGJlIGZvcm1hdHRlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSByYXcgLSBUaGUgcmF3IEFOU0kgZXNjYXBlIGNvZGUgdG8gYmUgYXBwbGllZC5cbiAqIEByZXR1cm4ge3N0cmluZ30gVGhlIHRleHQgd3JhcHBlZCBpbiB0aGUgcmF3IEFOU0kgY29kZSBhbmQgdGhlIHJlc2V0IGNvZGUuXG4gKlxuICogQGZ1bmN0aW9uIHJhd1xuICogQG1lbWJlck9mIG1vZHVsZTpTdHlsZWRTdHJpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJhdyh0ZXh0LCByYXcpIHtcbiAgICByZXR1cm4gYCR7cmF3fSR7dGV4dH0ke0Fuc2lSZXNldH1gO1xufVxuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGY4O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkluTnlZeTlqYjJ4dmNuTXVkSE1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJa0ZCUVVFc1QwRkJUeXhGUVVGRkxGTkJRVk1zUlVGQlJTeE5RVUZOTEVWQlFVVXNUVUZCVFN4aFFVRmhMRU5CUVVNN1FVRkhhRVE3T3pzN096czdPenM3T3pzN1IwRmhSenRCUVVOSUxFMUJRVTBzVlVGQlZTeFpRVUZaTEVOQlFVTXNTVUZCV1N4RlFVRkZMRU5CUVZNc1JVRkJSU3hGUVVGRkxFZEJRVWNzUzBGQlN6dEpRVVU1UkN4SlFVRkpMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU1zUlVGQlF5eERRVUZETzFGQlExb3NUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXd5UTBGQk1rTXNRMEZCUXl4bFFVRmxMRU5CUVVNc1EwRkJRenRSUVVNeFJTeFBRVUZQTEVsQlFVa3NRMEZCUXp0SlFVTmtMRU5CUVVNN1NVRkRSQ3hKUVVGSkxFVkJRVVVzU1VGQlNTeERRVU5TTEVOQlFVTXNRMEZCUXl4SFFVRkhMRVZCUVVVc1NVRkJTU3hEUVVGRExFbEJRVWtzUlVGQlJTeERRVUZETzFkQlEyaENMRU5CUVVNc1EwRkJReXhIUVVGSExFVkJRVVVzU1VGQlNTeERRVUZETEVsQlFVa3NSMEZCUnl4RFFVRkRMRU5CUVVVc1JVRkJReXhEUVVGRE8xRkJRek5DTEVOQlFVTXNSMEZCUnl4RFFVRkRMRWRCUVVjc1JVRkJSU3hEUVVGQk8wbEJRMW9zUTBGQlF6dEpRVU5FTEU5QlFVOHNVVUZCVVN4RFFVRkRMRWxCUVVrc1NVRkJTU3hIUVVGSExGTkJRVk1zUlVGQlJTeERRVUZETzBGQlJYcERMRU5CUVVNN1FVRkhSRHM3T3pzN096czdPenM3TzBkQldVYzdRVUZEU0N4TlFVRk5MRlZCUVZVc1YwRkJWeXhEUVVGRExFbEJRVmtzUlVGQlJTeERRVUZUTEVWQlFVVXNSVUZCUlN4SFFVRkhMRXRCUVVzN1NVRkZOMFFzU1VGQlNTeExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRVZCUVVNc1EwRkJRenRSUVVOYUxFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNNRU5CUVRCRExFTkJRVU1zWlVGQlpTeERRVUZETEVOQlFVTTdVVUZEZWtVc1QwRkJUeXhKUVVGSkxFTkJRVU03U1VGRFpDeERRVUZETzBsQlEwUXNTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhKUVVGSkxFTkJRVU1zUjBGQlJ5eEhRVUZITEVWQlFVVXNRMEZCUXp0UlFVTnlRaXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETERCRFFVRXdReXhEUVVGRExHVkJRV1VzUTBGQlF5eERRVUZETzFGQlEzcEZMRTlCUVU4c1NVRkJTU3hEUVVGRE8wbEJRMlFzUTBGQlF6dEpRVU5FTEU5QlFVOHNVVUZCVVN4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGRExFVkJRVVVzUTBGQlF5eERRVUZETEVOQlFVTXNSVUZCUlN4TlFVRk5MRU5CUVVNc1NVRkJTU3hKUVVGSkxFZEJRVWNzVTBGQlV5eEZRVUZGTEVOQlFVTTdRVUZETTBRc1EwRkJRenRCUVVWRU96czdPenM3T3pzN096czdPenRIUVdOSE8wRkJRMGdzVFVGQlRTeFZRVUZWTEZkQlFWY3NRMEZCUXl4SlFVRlpMRVZCUVVVc1EwRkJVeXhGUVVGRkxFTkJRVk1zUlVGQlJTeERRVUZUTEVWQlFVVXNSVUZCUlN4SFFVRkhMRXRCUVVzN1NVRkRia1lzU1VGQlNTeExRVUZMTEVOQlFVTXNRMEZCUXl4RFFVRkRMRWxCUVVrc1MwRkJTeXhEUVVGRExFTkJRVU1zUTBGQlF5eEpRVUZKTEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1JVRkJReXhEUVVGRE8xRkJRM0JETEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc0swSkJRU3RDTEVOQlFVTXNUMEZCVHl4RFFVRkRMRTlCUVU4c1EwRkJReXhsUVVGbExFTkJRVU1zUTBGQlF6dFJRVU01UlN4UFFVRlBMRWxCUVVrc1EwRkJRenRKUVVOa0xFTkJRVU03U1VGRFJDeEpRVUZKTEVOQlFVTXNRMEZCUXl4RlFVRkZMRU5CUVVNc1JVRkJSU3hEUVVGRExFTkJRVU1zUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXl4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRExFZEJRVWNzUTBGQlF5eEpRVUZKTEVOQlFVTXNSMEZCUnl4SFFVRkhMRU5CUVVNc1JVRkJSU3hEUVVGRE8xRkJRekZETEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc0swSkJRU3RDTEVOQlFVTXNUMEZCVHl4RFFVRkRMRTlCUVU4c1EwRkJReXhsUVVGbExFTkJRVU1zUTBGQlF6dFJRVU01UlN4UFFVRlBMRWxCUVVrc1EwRkJRenRKUVVOa0xFTkJRVU03U1VGRFJDeFBRVUZQTEZGQlFWRXNSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJReXhGUVVGRkxFTkJRVU1zUTBGQlF5eERRVUZETEVWQlFVVXNUVUZCVFN4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeEpRVUZKTEVkQlFVY3NVMEZCVXl4RlFVRkZMRU5CUVVNN1FVRkRja1VzUTBGQlF6dEJRVVZFT3pzN096czdPenM3T3p0SFFWZEhPMEZCUTBnc1RVRkJUU3hWUVVGVkxGVkJRVlVzUTBGQlF5eEpRVUZaTEVWQlFVVXNRMEZCSzBJN1NVRkRkRVVzVFVGQlRTeFRRVUZUTEVkQlFVY3NUMEZCVHl4RFFVRkRMRXRCUVVzc1VVRkJVU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRTFCUVUwc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dEpRVU40UkN4UFFVRlBMRkZCUVZFc1UwRkJVeXhKUVVGSkxFbEJRVWtzUjBGQlJ5eFRRVUZUTEVWQlFVVXNRMEZCUXp0QlFVTnFSQ3hEUVVGRE8wRkJSVVE3T3pzN096czdPenM3TzBkQlYwYzdRVUZEU0N4TlFVRk5MRlZCUVZVc1MwRkJTeXhEUVVGRExFbEJRVms3U1VGRGFFTXNaMFJCUVdkRU8wbEJRMmhFTERSRFFVRTBRenRKUVVNMVF5eE5RVUZOTEZOQlFWTXNSMEZCUnl4M1EwRkJkME1zUTBGQlF6dEpRVU16UkN4UFFVRlBMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zVTBGQlV5eEZRVUZGTEVWQlFVVXNRMEZCUXl4RFFVRkRPMEZCUTNKRExFTkJRVU03UVVGRlJEczdPenM3T3pzN096czdPMGRCV1VjN1FVRkRTQ3hOUVVGTkxGVkJRVlVzUjBGQlJ5eERRVUZETEVsQlFWa3NSVUZCUlN4SFFVRlhPMGxCUXpORExFOUJRVThzUjBGQlJ5eEhRVUZITEVkQlFVY3NTVUZCU1N4SFFVRkhMRk5CUVZNc1JVRkJSU3hEUVVGRE8wRkJRM0pETEVOQlFVTWlMQ0ptYVd4bElqb2lZMjlzYjNKekxtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYVcxd2IzSjBJSHNnUVc1emFWSmxjMlYwTENCemRIbHNaWE1nZlNCbWNtOXRJRndpTGk5amIyNXpkR0Z1ZEhOY0lqdGNibHh1WEc0dktpcGNiaUFxSUVCa1pYTmpjbWx3ZEdsdmJpQkJjSEJzYVdWeklHRWdZbUZ6YVdNZ1FVNVRTU0JqYjJ4dmNpQmpiMlJsSUhSdklIUmxlSFF1WEc0Z0tpQkFjM1Z0YldGeWVTQlVhR2x6SUdaMWJtTjBhVzl1SUhSaGEyVnpJR0VnYzNSeWFXNW5MQ0JoYmlCQlRsTkpJR052Ykc5eUlHTnZaR1VnYm5WdFltVnlMQ0JoYm1RZ1lXNGdiM0IwYVc5dVlXd2dZbUZqYTJkeWIzVnVaQ0JtYkdGbkxseHVJQ29nU1hRZ2NtVjBkWEp1Y3lCMGFHVWdkR1Y0ZENCM2NtRndjR1ZrSUdsdUlIUm9aU0JoY0hCeWIzQnlhV0YwWlNCQlRsTkpJR1Z6WTJGd1pTQmpiMlJsY3lCbWIzSWdaV2wwYUdWeUlHWnZjbVZuY205MWJtUWdiM0lnWW1GamEyZHliM1Z1WkNCamIyeHZjbWx1Wnk1Y2JpQXFJRlJvYVhNZ1puVnVZM1JwYjI0Z2FYTWdkWE5sWkNCbWIzSWdZbUZ6YVdNZ01UWXRZMjlzYjNJZ1FVNVRTU0JtYjNKdFlYUjBhVzVuTGx4dUlDcGNiaUFxSUVCd1lYSmhiU0I3YzNSeWFXNW5mU0IwWlhoMElDMGdWR2hsSUhSbGVIUWdkRzhnWW1VZ1kyOXNiM0psWkM1Y2JpQXFJRUJ3WVhKaGJTQjdiblZ0WW1WeWZTQnVJQzBnVkdobElFRk9VMGtnWTI5c2IzSWdZMjlrWlNCdWRXMWlaWEl1WEc0Z0tpQkFjR0Z5WVcwZ2UySnZiMnhsWVc1OUlGdGlaejFtWVd4elpWMGdMU0JKWmlCMGNuVmxMQ0JoY0hCc2FXVnpJSFJvWlNCamIyeHZjaUIwYnlCMGFHVWdZbUZqYTJkeWIzVnVaQ0JwYm5OMFpXRmtJRzltSUhSb1pTQm1iM0psWjNKdmRXNWtMbHh1SUNvZ1FISmxkSFZ5YmlCN2MzUnlhVzVuZlNCVWFHVWdkR1Y0ZENCM2NtRndjR1ZrSUdsdUlFRk9VMGtnWTI5c2IzSWdZMjlrWlhNdVhHNGdLbHh1SUNvZ1FHWjFibU4wYVc5dUlHTnZiRzl5YVhwbFFVNVRTVnh1SUNvZ1FHMWxiV0psY2s5bUlHMXZaSFZzWlRwQVUzUjViR1ZrVTNSeWFXNW5YRzRnS2k5Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCamIyeHZjbWw2WlVGT1Uwa29kR1Y0ZERvZ2MzUnlhVzVuTENCdU9pQnVkVzFpWlhJc0lHSm5JRDBnWm1Gc2MyVXBJSHRjYmx4dUlDQnBaaUFvYVhOT1lVNG9iaWtwZTF4dUlDQWdJR052Ym5OdmJHVXVkMkZ5YmloZ1NXNTJZV3hwWkNCamIyeHZjaUJ1ZFcxaVpYSWdiMjRnZEdobElFRk9VMGtnYzJOaGJHVTZJQ1I3Ym4wdUlHbG5ibTl5YVc1bkxpNHVZQ2s3WEc0Z0lDQWdjbVYwZFhKdUlIUmxlSFE3WEc0Z0lIMWNiaUFnYVdZZ0tHSm5JQ1ltSUNoY2JpQWdJQ0FvYmlBK0lETXdJQ1ltSUc0Z1BEMGdOREFwWEc0Z0lDQWdmSHdnS0c0Z1BpQTVNQ0FtSmlCdUlEdzlJREV3TUNrZ0tTbDdYRzRnSUNBZ2JpQTlJRzRnS3lBeE1GeHVJQ0I5WEc0Z0lISmxkSFZ5YmlCZ1hGeDRNV0piSkh0dWZXMGtlM1JsZUhSOUpIdEJibk5wVW1WelpYUjlZRHRjYmx4dWZWeHVYRzVjYmk4cUtseHVJQ29nUUdSbGMyTnlhWEIwYVc5dUlFRndjR3hwWlhNZ1lTQXlOVFl0WTI5c2IzSWdRVTVUU1NCamIyUmxJSFJ2SUhSbGVIUXVYRzRnS2lCQWMzVnRiV0Z5ZVNCVWFHbHpJR1oxYm1OMGFXOXVJSFJoYTJWeklHRWdjM1J5YVc1bklHRnVaQ0JoSUdOdmJHOXlJRzUxYldKbGNpQW9NQzB5TlRVcElHRnVaQ0J5WlhSMWNtNXpJSFJvWlNCMFpYaDBYRzRnS2lCM2NtRndjR1ZrSUdsdUlFRk9VMGtnWlhOallYQmxJR052WkdWeklHWnZjaUJsYVhSb1pYSWdabTl5WldkeWIzVnVaQ0J2Y2lCaVlXTnJaM0p2ZFc1a0lHTnZiRzl5YVc1bkxseHVJQ3BjYmlBcUlFQndZWEpoYlNCN2MzUnlhVzVuZlNCMFpYaDBJQzBnVkdobElIUmxlSFFnZEc4Z1ltVWdZMjlzYjNKbFpDNWNiaUFxSUVCd1lYSmhiU0I3Ym5WdFltVnlmU0J1SUMwZ1ZHaGxJR052Ykc5eUlHNTFiV0psY2lBb01DMHlOVFVwTGx4dUlDb2dRSEJoY21GdElIdGliMjlzWldGdWZTQmJZbWM5Wm1Gc2MyVmRJQzBnU1dZZ2RISjFaU3dnWVhCd2JHbGxjeUIwYUdVZ1kyOXNiM0lnZEc4Z2RHaGxJR0poWTJ0bmNtOTFibVFnYVc1emRHVmhaQ0J2WmlCMGFHVWdabTl5WldkeWIzVnVaQzVjYmlBcUlFQnlaWFIxY200Z2UzTjBjbWx1WjMwZ1ZHaGxJSFJsZUhRZ2QzSmhjSEJsWkNCcGJpQkJUbE5KSUdOdmJHOXlJR052WkdWekxseHVJQ3BjYmlBcUlFQm1kVzVqZEdsdmJpQmpiMnh2Y21sNlpUSTFObHh1SUNvZ1FHMWxiV0psY2s5bUlHMXZaSFZzWlRwQVUzUjViR1ZrVTNSeWFXNW5YRzRnS2k5Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCamIyeHZjbWw2WlRJMU5paDBaWGgwT2lCemRISnBibWNzSUc0NklHNTFiV0psY2l3Z1ltY2dQU0JtWVd4elpTa2dlMXh1WEc0Z0lHbG1JQ2hwYzA1aFRpaHVLU2w3WEc0Z0lDQWdZMjl1YzI5c1pTNTNZWEp1S0dCSmJuWmhiR2xrSUdOdmJHOXlJRzUxYldKbGNpQnZiaUIwYUdVZ01qVTJJSE5qWVd4bE9pQWtlMjU5TGlCcFoyNXZjbWx1Wnk0dUxtQXBPMXh1SUNBZ0lISmxkSFZ5YmlCMFpYaDBPMXh1SUNCOVhHNGdJR2xtSUNodUlEd2dNQ0I4ZkNCdUlENGdNalUxS1NCN1hHNGdJQ0FnWTI5dWMyOXNaUzUzWVhKdUtHQkpiblpoYkdsa0lHTnZiRzl5SUc1MWJXSmxjaUJ2YmlCMGFHVWdNalUySUhOallXeGxPaUFrZTI1OUxpQnBaMjV2Y21sdVp5NHVMbUFwTzF4dUlDQWdJSEpsZEhWeWJpQjBaWGgwTzF4dUlDQjlYRzRnSUhKbGRIVnliaUJnWEZ4NE1XSmJKSHRpWnlBL0lEUTRJRG9nTXpoOU96VTdKSHR1Zlcwa2UzUmxlSFI5Skh0QmJuTnBVbVZ6WlhSOVlEdGNibjFjYmx4dUx5b3FYRzRnS2lCQVpHVnpZM0pwY0hScGIyNGdRWEJ3YkdsbGN5QmhiaUJTUjBJZ1kyOXNiM0lnUVU1VFNTQmpiMlJsSUhSdklIUmxlSFF1WEc0Z0tpQkFjM1Z0YldGeWVTQlVhR2x6SUdaMWJtTjBhVzl1SUhSaGEyVnpJR0VnYzNSeWFXNW5JR0Z1WkNCU1IwSWdZMjlzYjNJZ2RtRnNkV1Z6SUNnd0xUSTFOU0JtYjNJZ1pXRmphQ0JqYjIxd2IyNWxiblFwWEc0Z0tpQmhibVFnY21WMGRYSnVjeUIwYUdVZ2RHVjRkQ0IzY21Gd2NHVmtJR2x1SUVGT1Uwa2daWE5qWVhCbElHTnZaR1Z6SUdadmNpQmxhWFJvWlhJZ1ptOXlaV2R5YjNWdVpDQnZjaUJpWVdOclozSnZkVzVrSUdOdmJHOXlhVzVuTGx4dUlDcGNiaUFxSUVCd1lYSmhiU0I3YzNSeWFXNW5mU0IwWlhoMElDMGdWR2hsSUhSbGVIUWdkRzhnWW1VZ1kyOXNiM0psWkM1Y2JpQXFJRUJ3WVhKaGJTQjdiblZ0WW1WeWZTQnlJQzBnVkdobElISmxaQ0JqYjIxd2IyNWxiblFnYjJZZ2RHaGxJR052Ykc5eUlDZ3dMVEkxTlNrdVhHNGdLaUJBY0dGeVlXMGdlMjUxYldKbGNuMGdaeUF0SUZSb1pTQm5jbVZsYmlCamIyMXdiMjVsYm5RZ2IyWWdkR2hsSUdOdmJHOXlJQ2d3TFRJMU5Ta3VYRzRnS2lCQWNHRnlZVzBnZTI1MWJXSmxjbjBnWWlBdElGUm9aU0JpYkhWbElHTnZiWEJ2Ym1WdWRDQnZaaUIwYUdVZ1kyOXNiM0lnS0RBdE1qVTFLUzVjYmlBcUlFQndZWEpoYlNCN1ltOXZiR1ZoYm4wZ1cySm5QV1poYkhObFhTQXRJRWxtSUhSeWRXVXNJR0Z3Y0d4cFpYTWdkR2hsSUdOdmJHOXlJSFJ2SUhSb1pTQmlZV05yWjNKdmRXNWtJR2x1YzNSbFlXUWdiMllnZEdobElHWnZjbVZuY205MWJtUXVYRzRnS2lCQWNtVjBkWEp1SUh0emRISnBibWQ5SUZSb1pTQjBaWGgwSUhkeVlYQndaV1FnYVc0Z1FVNVRTU0JqYjJ4dmNpQmpiMlJsY3k1Y2JpQXFYRzRnS2lCQVpuVnVZM1JwYjI0Z1kyOXNiM0pwZW1WU1IwSmNiaUFxSUVCdFpXMWlaWEpQWmlCdGIyUjFiR1U2VTNSNWJHVmtVM1J5YVc1blhHNGdLaTljYm1WNGNHOXlkQ0JtZFc1amRHbHZiaUJqYjJ4dmNtbDZaVkpIUWloMFpYaDBPaUJ6ZEhKcGJtY3NJSEk2SUc1MWJXSmxjaXdnWnpvZ2JuVnRZbVZ5TENCaU9pQnVkVzFpWlhJc0lHSm5JRDBnWm1Gc2MyVXBJSHRjYmlBZ2FXWWdLR2x6VG1GT0tISXBJSHg4SUdselRtRk9LR2NwSUh4OElHbHpUbUZPS0dJcEtYdGNiaUFnSUNCamIyNXpiMnhsTG5kaGNtNG9ZRWx1ZG1Gc2FXUWdVa2RDSUdOdmJHOXlJSFpoYkhWbGN6b2djajBrZTNKOUxDQm5QU1I3WjMwc0lHSTlKSHRpZlM0Z1NXZHViM0pwYm1jdUxpNWdLVHRjYmlBZ0lDQnlaWFIxY200Z2RHVjRkRHRjYmlBZ2ZWeHVJQ0JwWmlBb1czSXNJR2NzSUdKZExuTnZiV1VvZGlBOVBpQjJJRHdnTUNCOGZDQjJJRDRnTWpVMUtTa2dlMXh1SUNBZ0lHTnZibk52YkdVdWQyRnliaWhnU1c1MllXeHBaQ0JTUjBJZ1kyOXNiM0lnZG1Gc2RXVnpPaUJ5UFNSN2NuMHNJR2M5Skh0bmZTd2dZajBrZTJKOUxpQkpaMjV2Y21sdVp5NHVMbUFwTzF4dUlDQWdJSEpsZEhWeWJpQjBaWGgwTzF4dUlDQjlYRzRnSUhKbGRIVnliaUJnWEZ4NE1XSmJKSHRpWnlBL0lEUTRJRG9nTXpoOU96STdKSHR5ZlRza2UyZDlPeVI3WW4xdEpIdDBaWGgwZlNSN1FXNXphVkpsYzJWMGZXQTdYRzU5WEc1Y2JpOHFLbHh1SUNvZ1FHUmxjMk55YVhCMGFXOXVJRUZ3Y0d4cFpYTWdZVzRnUVU1VFNTQnpkSGxzWlNCamIyUmxJSFJ2SUhSbGVIUXVYRzRnS2lCQWMzVnRiV0Z5ZVNCVWFHbHpJR1oxYm1OMGFXOXVJSFJoYTJWeklHRWdjM1J5YVc1bklHRnVaQ0JoSUhOMGVXeGxJR052WkdVZ0tHVnBkR2hsY2lCaElHNTFiV0psY2lCdmNpQmhJR3RsZVNCbWNtOXRJSFJvWlNCemRIbHNaWE1nYjJKcVpXTjBLVnh1SUNvZ1lXNWtJSEpsZEhWeWJuTWdkR2hsSUhSbGVIUWdkM0poY0hCbFpDQnBiaUIwYUdVZ1lYQndjbTl3Y21saGRHVWdRVTVUU1NCbGMyTmhjR1VnWTI5a1pYTWdabTl5SUhSb1lYUWdjM1I1YkdVdVhHNGdLbHh1SUNvZ1FIQmhjbUZ0SUh0emRISnBibWQ5SUhSbGVIUWdMU0JVYUdVZ2RHVjRkQ0IwYnlCaVpTQnpkSGxzWldRdVhHNGdLaUJBY0dGeVlXMGdlMjUxYldKbGNpQjhJSE4wY21sdVozMGdiaUF0SUZSb1pTQnpkSGxzWlNCamIyUmxJRzl5SUhOMGVXeGxJRzVoYldVdVhHNGdLaUJBY21WMGRYSnVJSHR6ZEhKcGJtZDlJRlJvWlNCMFpYaDBJSGR5WVhCd1pXUWdhVzRnUVU1VFNTQnpkSGxzWlNCamIyUmxjeTVjYmlBcVhHNGdLaUJBWm5WdVkzUnBiMjRnWVhCd2JIbFRkSGxzWlZ4dUlDb2dRRzFsYldKbGNrOW1JRzF2WkhWc1pUcFRkSGxzWldSVGRISnBibWRjYmlBcUwxeHVaWGh3YjNKMElHWjFibU4wYVc5dUlHRndjR3g1VTNSNWJHVW9kR1Y0ZERvZ2MzUnlhVzVuTENCdU9pQnVkVzFpWlhJZ2ZDQnJaWGx2WmlCMGVYQmxiMllnYzNSNWJHVnpLVG9nYzNSeWFXNW5JSHRjYmlBZ1kyOXVjM1FnYzNSNWJHVkRiMlJsSUQwZ2RIbHdaVzltSUc0Z1BUMDlJRndpYm5WdFltVnlYQ0lnUHlCdUlEb2djM1I1YkdWelcyNWRPMXh1SUNCeVpYUjFjbTRnWUZ4Y2VERmlXeVI3YzNSNWJHVkRiMlJsZlcwa2UzUmxlSFI5Skh0QmJuTnBVbVZ6WlhSOVlEdGNibjFjYmx4dUx5b3FYRzRnS2lCQVpHVnpZM0pwY0hScGIyNGdVbVZ0YjNabGN5QmhiR3dnUVU1VFNTQm1iM0p0WVhSMGFXNW5JR052WkdWeklHWnliMjBnZEdWNGRDNWNiaUFxSUVCemRXMXRZWEo1SUZSb2FYTWdablZ1WTNScGIyNGdkR0ZyWlhNZ1lTQnpkSEpwYm1jZ2RHaGhkQ0J0WVhrZ1kyOXVkR0ZwYmlCQlRsTkpJR1Z6WTJGd1pTQmpiMlJsY3lCbWIzSWdabTl5YldGMGRHbHVaMXh1SUNvZ1lXNWtJSEpsZEhWeWJuTWdZU0J1WlhjZ2MzUnlhVzVuSUhkcGRHZ2dZV3hzSUhOMVkyZ2dZMjlrWlhNZ2NtVnRiM1psWkN3Z2JHVmhkbWx1WnlCdmJteDVJSFJvWlNCd2JHRnBiaUIwWlhoMElHTnZiblJsYm5RdVhHNGdLaUJKZENCMWMyVnpJR0VnY21WbmRXeGhjaUJsZUhCeVpYTnphVzl1SUhSdklHMWhkR05vSUdGdVpDQnlaVzF2ZG1VZ1FVNVRTU0JsYzJOaGNHVWdjMlZ4ZFdWdVkyVnpMbHh1SUNwY2JpQXFJRUJ3WVhKaGJTQjdjM1J5YVc1bmZTQjBaWGgwSUMwZ1ZHaGxJSFJsZUhRZ2NHOTBaVzUwYVdGc2JIa2dZMjl1ZEdGcGJtbHVaeUJCVGxOSklHWnZjbTFoZEhScGJtY2dZMjlrWlhNdVhHNGdLaUJBY21WMGRYSnVJSHR6ZEhKcGJtZDlJRlJvWlNCcGJuQjFkQ0IwWlhoMElIZHBkR2dnWVd4c0lFRk9VMGtnWm05eWJXRjBkR2x1WnlCamIyUmxjeUJ5WlcxdmRtVmtMbHh1SUNwY2JpQXFJRUJtZFc1amRHbHZiaUJqYkdWaGNseHVJQ29nUUcxbGJXSmxjazltSUcxdlpIVnNaVHBUZEhsc1pXUlRkSEpwYm1kY2JpQXFMMXh1Wlhod2IzSjBJR1oxYm1OMGFXOXVJR05zWldGeUtIUmxlSFE2SUhOMGNtbHVaeWs2SUhOMGNtbHVaeUI3WEc0Z0lDOHZJRkpsWjNWc1lYSWdaWGh3Y21WemMybHZiaUIwYnlCdFlYUmphQ0JCVGxOSklHVnpZMkZ3WlNCamIyUmxjMXh1SUNBdkx5QmxjMnhwYm5RdFpHbHpZV0pzWlMxdVpYaDBMV3hwYm1VZ2JtOHRZMjl1ZEhKdmJDMXlaV2RsZUZ4dUlDQmpiMjV6ZENCaGJuTnBVbVZuWlhnZ1BTQXZYRng0TVVJb1B6cGJRQzFhWEZ4Y1hDMWZYWHhjWEZ0Yk1DMC9YU3BiSUMwdlhTcGJRQzErWFNrdlp6dGNiaUFnY21WMGRYSnVJSFJsZUhRdWNtVndiR0ZqWlNoaGJuTnBVbVZuWlhnc0lDY25LVHRjYm4xY2JseHVMeW9xWEc0Z0tpQkFaR1Z6WTNKcGNIUnBiMjRnUVhCd2JHbGxjeUJ5WVhjZ1FVNVRTU0JsYzJOaGNHVWdZMjlrWlhNZ2RHOGdkR1Y0ZEM1Y2JpQXFJRUJ6ZFcxdFlYSjVJRlJvYVhNZ1puVnVZM1JwYjI0Z2RHRnJaWE1nWVNCemRISnBibWNnWVc1a0lHRWdjbUYzSUVGT1Uwa2daWE5qWVhCbElHTnZaR1VzSUdGdVpDQnlaWFIxY201eklIUm9aU0IwWlhoMFhHNGdLaUIzY21Gd2NHVmtJR2x1SUhSb1pTQndjbTkyYVdSbFpDQnlZWGNnUVU1VFNTQmpiMlJsSUdGdVpDQjBhR1VnY21WelpYUWdZMjlrWlM0Z1ZHaHBjeUJoYkd4dmQzTWdabTl5SUdGd2NHeDVhVzVuSUdOMWMzUnZiVnh1SUNvZ2IzSWdZMjl0Y0d4bGVDQkJUbE5KSUdadmNtMWhkSFJwYm1jZ2RHaGhkQ0J0WVhrZ2JtOTBJR0psSUdOdmRtVnlaV1FnWW5rZ2IzUm9aWElnZFhScGJHbDBlU0JtZFc1amRHbHZibk11WEc0Z0tseHVJQ29nUUhCaGNtRnRJSHR6ZEhKcGJtZDlJSFJsZUhRZ0xTQlVhR1VnZEdWNGRDQjBieUJpWlNCbWIzSnRZWFIwWldRdVhHNGdLaUJBY0dGeVlXMGdlM04wY21sdVozMGdjbUYzSUMwZ1ZHaGxJSEpoZHlCQlRsTkpJR1Z6WTJGd1pTQmpiMlJsSUhSdklHSmxJR0Z3Y0d4cFpXUXVYRzRnS2lCQWNtVjBkWEp1SUh0emRISnBibWQ5SUZSb1pTQjBaWGgwSUhkeVlYQndaV1FnYVc0Z2RHaGxJSEpoZHlCQlRsTkpJR052WkdVZ1lXNWtJSFJvWlNCeVpYTmxkQ0JqYjJSbExseHVJQ3BjYmlBcUlFQm1kVzVqZEdsdmJpQnlZWGRjYmlBcUlFQnRaVzFpWlhKUFppQnRiMlIxYkdVNlUzUjViR1ZrVTNSeWFXNW5YRzRnS2k5Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCeVlYY29kR1Y0ZERvZ2MzUnlhVzVuTENCeVlYYzZJSE4wY21sdVp5azZJSE4wY21sdVp5QjdYRzRnSUhKbGRIVnliaUJnSkh0eVlYZDlKSHQwWlhoMGZTUjdRVzV6YVZKbGMyVjBmV0E3WEc1OUlsMTlcbiIsImltcG9ydCB7IEJyaWdodEJhY2tncm91bmRDb2xvcnMsIEJyaWdodEZvcmVncm91bmRDb2xvcnMsIFN0YW5kYXJkQmFja2dyb3VuZENvbG9ycywgU3RhbmRhcmRGb3JlZ3JvdW5kQ29sb3JzLCBzdHlsZXMsIH0gZnJvbSBcIi4vY29uc3RhbnRzXCI7XG5pbXBvcnQgeyBjbGVhciwgY29sb3JpemUyNTYsIGNvbG9yaXplQU5TSSwgY29sb3JpemVSR0IsIHJhdywgYXBwbHlTdHlsZSwgfSBmcm9tIFwiLi9jb2xvcnNcIjtcbi8qKlxuICogQGNsYXNzIFN0eWxlZFN0cmluZ1xuICogQGRlc2NyaXB0aW9uIEEgY2xhc3MgdGhhdCBleHRlbmRzIHN0cmluZyBmdW5jdGlvbmFsaXR5IHdpdGggQU5TSSBjb2xvciBhbmQgc3R5bGUgb3B0aW9ucy5cbiAqIEBzdW1tYXJ5IFN0eWxlZFN0cmluZyBwcm92aWRlcyBtZXRob2RzIHRvIGFwcGx5IHZhcmlvdXMgQU5TSSBjb2xvciBhbmQgc3R5bGUgb3B0aW9ucyB0byB0ZXh0IHN0cmluZ3MuXG4gKiBJdCBpbXBsZW1lbnRzIHRoZSBDb2xvcml6ZU9wdGlvbnMgaW50ZXJmYWNlIGFuZCBwcm94aWVzIG5hdGl2ZSBzdHJpbmcgbWV0aG9kcyB0byB0aGUgdW5kZXJseWluZyB0ZXh0LlxuICogVGhpcyBjbGFzcyBhbGxvd3MgZm9yIGNoYWluaW5nIG9mIHN0eWxpbmcgbWV0aG9kcyBhbmQgZWFzeSBhcHBsaWNhdGlvbiBvZiBjb2xvcnMgYW5kIHN0eWxlcyB0byB0ZXh0LlxuICpcbiAqIEBpbXBsZW1lbnRzIHtDb2xvcml6ZU9wdGlvbnN9XG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRoZSBpbml0aWFsIHRleHQgc3RyaW5nIHRvIGJlIHN0eWxlZC5cbiAqL1xuZXhwb3J0IGNsYXNzIFN0eWxlZFN0cmluZyB7XG4gICAgY29uc3RydWN0b3IodGV4dCkge1xuICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xuICAgICAgICAvLyBCYXNpYyBjb2xvcnNcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoU3RhbmRhcmRGb3JlZ3JvdW5kQ29sb3JzKS5mb3JFYWNoKChbbmFtZSwgY29kZV0pID0+IHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBuYW1lLCB7XG4gICAgICAgICAgICAgICAgZ2V0OiAoKSA9PiB0aGlzLmZvcmVncm91bmQoY29kZSksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIE9iamVjdC5lbnRyaWVzKEJyaWdodEZvcmVncm91bmRDb2xvcnMpLmZvckVhY2goKFtuYW1lLCBjb2RlXSkgPT4ge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIG5hbWUsIHtcbiAgICAgICAgICAgICAgICBnZXQ6ICgpID0+IHRoaXMuZm9yZWdyb3VuZChjb2RlKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gQmFja2dyb3VuZCBjb2xvcnNcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoU3RhbmRhcmRCYWNrZ3JvdW5kQ29sb3JzKS5mb3JFYWNoKChbbmFtZSwgY29kZV0pID0+IHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBuYW1lLCB7XG4gICAgICAgICAgICAgICAgZ2V0OiAoKSA9PiB0aGlzLmJhY2tncm91bmQoY29kZSksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIE9iamVjdC5lbnRyaWVzKEJyaWdodEJhY2tncm91bmRDb2xvcnMpLmZvckVhY2goKFtuYW1lLCBjb2RlXSkgPT4ge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIG5hbWUsIHtcbiAgICAgICAgICAgICAgICBnZXQ6ICgpID0+IHRoaXMuYmFja2dyb3VuZChjb2RlKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gU3R5bGVzXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHN0eWxlcykuZm9yRWFjaCgoW25hbWUsIGNvZGVdKSA9PiB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgbmFtZSwge1xuICAgICAgICAgICAgICAgIGdldDogKCkgPT4gdGhpcy5zdHlsZShjb2RlKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIENsZWFycyBhbGwgc3R5bGluZyBmcm9tIHRoZSB0ZXh0LlxuICAgICAqIEBzdW1tYXJ5IFJlbW92ZXMgYWxsIEFOU0kgY29sb3IgYW5kIHN0eWxlIGNvZGVzIGZyb20gdGhlIHRleHQuXG4gICAgICogQHJldHVybiB7U3R5bGVkU3RyaW5nfSBUaGUgU3R5bGVkU3RyaW5nIGluc3RhbmNlIHdpdGggY2xlYXJlZCBzdHlsaW5nLlxuICAgICAqL1xuICAgIGNsZWFyKCkge1xuICAgICAgICB0aGlzLnRleHQgPSBjbGVhcih0aGlzLnRleHQpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEFwcGxpZXMgcmF3IEFOU0kgY29kZXMgdG8gdGhlIHRleHQuXG4gICAgICogQHN1bW1hcnkgQWxsb3dzIGRpcmVjdCBhcHBsaWNhdGlvbiBvZiBBTlNJIGVzY2FwZSBzZXF1ZW5jZXMgdG8gdGhlIHRleHQuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHJhd0Fuc2kgLSBUaGUgcmF3IEFOU0kgZXNjYXBlIHNlcXVlbmNlIHRvIGFwcGx5LlxuICAgICAqIEByZXR1cm4ge1N0eWxlZFN0cmluZ30gVGhlIFN0eWxlZFN0cmluZyBpbnN0YW5jZSB3aXRoIHRoZSByYXcgQU5TSSBjb2RlIGFwcGxpZWQuXG4gICAgICovXG4gICAgcmF3KHJhd0Fuc2kpIHtcbiAgICAgICAgdGhpcy50ZXh0ID0gcmF3KHRoaXMudGV4dCwgcmF3QW5zaSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gQXBwbGllcyBhIGZvcmVncm91bmQgY29sb3IgdG8gdGhlIHRleHQuXG4gICAgICogQHN1bW1hcnkgU2V0cyB0aGUgdGV4dCBjb2xvciB1c2luZyBBTlNJIGNvbG9yIGNvZGVzLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBuIC0gVGhlIEFOU0kgY29sb3IgY29kZSBmb3IgdGhlIGZvcmVncm91bmQgY29sb3IuXG4gICAgICogQHJldHVybiB7U3R5bGVkU3RyaW5nfSBUaGUgU3R5bGVkU3RyaW5nIGluc3RhbmNlIHdpdGggdGhlIGZvcmVncm91bmQgY29sb3IgYXBwbGllZC5cbiAgICAgKi9cbiAgICBmb3JlZ3JvdW5kKG4pIHtcbiAgICAgICAgdGhpcy50ZXh0ID0gY29sb3JpemVBTlNJKHRoaXMudGV4dCwgbik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gQXBwbGllcyBhIGJhY2tncm91bmQgY29sb3IgdG8gdGhlIHRleHQuXG4gICAgICogQHN1bW1hcnkgU2V0cyB0aGUgYmFja2dyb3VuZCBjb2xvciBvZiB0aGUgdGV4dCB1c2luZyBBTlNJIGNvbG9yIGNvZGVzLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBuIC0gVGhlIEFOU0kgY29sb3IgY29kZSBmb3IgdGhlIGJhY2tncm91bmQgY29sb3IuXG4gICAgICogQHJldHVybiB7U3R5bGVkU3RyaW5nfSBUaGUgU3R5bGVkU3RyaW5nIGluc3RhbmNlIHdpdGggdGhlIGJhY2tncm91bmQgY29sb3IgYXBwbGllZC5cbiAgICAgKi9cbiAgICBiYWNrZ3JvdW5kKG4pIHtcbiAgICAgICAgdGhpcy50ZXh0ID0gY29sb3JpemVBTlNJKHRoaXMudGV4dCwgbiwgdHJ1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gQXBwbGllcyBhIHRleHQgc3R5bGUgdG8gdGhlIHN0cmluZy5cbiAgICAgKiBAc3VtbWFyeSBTZXRzIHRleHQgc3R5bGVzIHN1Y2ggYXMgYm9sZCwgaXRhbGljLCBvciB1bmRlcmxpbmUgdXNpbmcgQU5TSSBzdHlsZSBjb2Rlcy5cbiAgICAgKiBAcGFyYW0ge251bWJlciB8IHN0cmluZ30gbiAtIFRoZSBzdHlsZSBjb2RlIG9yIGtleSBmcm9tIHRoZSBzdHlsZXMgb2JqZWN0LlxuICAgICAqIEByZXR1cm4ge1N0eWxlZFN0cmluZ30gVGhlIFN0eWxlZFN0cmluZyBpbnN0YW5jZSB3aXRoIHRoZSBzdHlsZSBhcHBsaWVkLlxuICAgICAqL1xuICAgIHN0eWxlKG4pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBuID09PSBcInN0cmluZ1wiICYmICEobiBpbiBzdHlsZXMpKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oYEludmFsaWQgc3R5bGU6ICR7bn1gKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudGV4dCA9IGFwcGx5U3R5bGUodGhpcy50ZXh0LCBuKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBBcHBsaWVzIGEgMjU2LWNvbG9yIGZvcmVncm91bmQgY29sb3IgdG8gdGhlIHRleHQuXG4gICAgICogQHN1bW1hcnkgU2V0cyB0aGUgdGV4dCBjb2xvciB1c2luZyB0aGUgZXh0ZW5kZWQgMjU2LWNvbG9yIHBhbGV0dGUuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG4gLSBUaGUgY29sb3IgbnVtYmVyIGZyb20gdGhlIDI1Ni1jb2xvciBwYWxldHRlLlxuICAgICAqIEByZXR1cm4ge1N0eWxlZFN0cmluZ30gVGhlIFN0eWxlZFN0cmluZyBpbnN0YW5jZSB3aXRoIHRoZSAyNTYtY29sb3IgZm9yZWdyb3VuZCBhcHBsaWVkLlxuICAgICAqL1xuICAgIGNvbG9yMjU2KG4pIHtcbiAgICAgICAgdGhpcy50ZXh0ID0gY29sb3JpemUyNTYodGhpcy50ZXh0LCBuKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBBcHBsaWVzIGEgMjU2LWNvbG9yIGJhY2tncm91bmQgY29sb3IgdG8gdGhlIHRleHQuXG4gICAgICogQHN1bW1hcnkgU2V0cyB0aGUgYmFja2dyb3VuZCBjb2xvciB1c2luZyB0aGUgZXh0ZW5kZWQgMjU2LWNvbG9yIHBhbGV0dGUuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG4gLSBUaGUgY29sb3IgbnVtYmVyIGZyb20gdGhlIDI1Ni1jb2xvciBwYWxldHRlLlxuICAgICAqIEByZXR1cm4ge1N0eWxlZFN0cmluZ30gVGhlIFN0eWxlZFN0cmluZyBpbnN0YW5jZSB3aXRoIHRoZSAyNTYtY29sb3IgYmFja2dyb3VuZCBhcHBsaWVkLlxuICAgICAqL1xuICAgIGJnQ29sb3IyNTYobikge1xuICAgICAgICB0aGlzLnRleHQgPSBjb2xvcml6ZTI1Nih0aGlzLnRleHQsIG4sIHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEFwcGxpZXMgYW4gUkdCIGZvcmVncm91bmQgY29sb3IgdG8gdGhlIHRleHQuXG4gICAgICogQHN1bW1hcnkgU2V0cyB0aGUgdGV4dCBjb2xvciB1c2luZyBSR0IgdmFsdWVzLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByIC0gVGhlIHJlZCBjb21wb25lbnQgKDAtMjU1KS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZyAtIFRoZSBncmVlbiBjb21wb25lbnQgKDAtMjU1KS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYiAtIFRoZSBibHVlIGNvbXBvbmVudCAoMC0yNTUpLlxuICAgICAqIEByZXR1cm4ge1N0eWxlZFN0cmluZ30gVGhlIFN0eWxlZFN0cmluZyBpbnN0YW5jZSB3aXRoIHRoZSBSR0IgZm9yZWdyb3VuZCBjb2xvciBhcHBsaWVkLlxuICAgICAqL1xuICAgIHJnYihyLCBnLCBiKSB7XG4gICAgICAgIHRoaXMudGV4dCA9IGNvbG9yaXplUkdCKHRoaXMudGV4dCwgciwgZywgYik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gQXBwbGllcyBhbiBSR0IgYmFja2dyb3VuZCBjb2xvciB0byB0aGUgdGV4dC5cbiAgICAgKiBAc3VtbWFyeSBTZXRzIHRoZSBiYWNrZ3JvdW5kIGNvbG9yIHVzaW5nIFJHQiB2YWx1ZXMuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHIgLSBUaGUgcmVkIGNvbXBvbmVudCAoMC0yNTUpLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBnIC0gVGhlIGdyZWVuIGNvbXBvbmVudCAoMC0yNTUpLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiIC0gVGhlIGJsdWUgY29tcG9uZW50ICgwLTI1NSkuXG4gICAgICogQHJldHVybiB7U3R5bGVkU3RyaW5nfSBUaGUgU3R5bGVkU3RyaW5nIGluc3RhbmNlIHdpdGggdGhlIFJHQiBiYWNrZ3JvdW5kIGNvbG9yIGFwcGxpZWQuXG4gICAgICovXG4gICAgYmdSZ2IociwgZywgYikge1xuICAgICAgICB0aGlzLnRleHQgPSBjb2xvcml6ZVJHQih0aGlzLnRleHQsIHIsIGcsIGIsIHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIENvbnZlcnRzIHRoZSBTdHlsZWRTdHJpbmcgdG8gYSByZWd1bGFyIHN0cmluZy5cbiAgICAgKiBAc3VtbWFyeSBSZXR1cm5zIHRoZSB1bmRlcmx5aW5nIHRleHQgd2l0aCBhbGwgYXBwbGllZCBzdHlsaW5nLlxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gVGhlIHN0eWxlZCB0ZXh0IGFzIGEgcmVndWxhciBzdHJpbmcuXG4gICAgICovXG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHQ7XG4gICAgfVxufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gQXBwbGllcyBzdHlsaW5nIHRvIGEgZ2l2ZW4gdGV4dCBzdHJpbmcuXG4gKiBAc3VtbWFyeSBUaGlzIGZ1bmN0aW9uIHRha2VzIGEgc3RyaW5nIGFuZCByZXR1cm5zIGEgU3R5bGVkU3RyaW5nIG9iamVjdCwgd2hpY2ggaXMgYW4gZW5oYW5jZWRcbiAqIHZlcnNpb24gb2YgdGhlIG9yaWdpbmFsIHN0cmluZyB3aXRoIGFkZGl0aW9uYWwgbWV0aG9kcyBmb3IgYXBwbHlpbmcgdmFyaW91cyBBTlNJIGNvbG9yIGFuZCBzdHlsZVxuICogb3B0aW9ucy4gSXQgc2V0cyB1cCBhIG1hcHBlciBvYmplY3Qgd2l0aCBtZXRob2RzIGZvciBkaWZmZXJlbnQgc3R5bGluZyBvcGVyYXRpb25zIGFuZCB0aGVuXG4gKiBkZWZpbmVzIHByb3BlcnRpZXMgb24gdGhlIHRleHQgc3RyaW5nIHRvIG1ha2UgdGhlc2UgbWV0aG9kcyBhY2Nlc3NpYmxlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nW119IHQgIFRoZSBpbnB1dCB0ZXh0IHRvIGJlIHN0eWxlZC5cbiAqIEByZXR1cm4ge1N0eWxlZFN0cmluZ30gQSBTdHlsZWRTdHJpbmcgb2JqZWN0IHdpdGggYWRkaXRpb25hbCBzdHlsaW5nIG1ldGhvZHMuXG4gKlxuICogQGZ1bmN0aW9uIHN0eWxlXG4gKlxuICogQG1lbWJlck9mIFN0eWxlZFN0cmluZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gc3R5bGUoLi4udCkge1xuICAgIHJldHVybiBuZXcgU3R5bGVkU3RyaW5nKHQuam9pbihcIiBcIikpO1xufVxuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGY4O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkluTnlZeTl6ZEhKcGJtZHpMblJ6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUpCUVVGQkxFOUJRVThzUlVGRFRDeHpRa0ZCYzBJc1JVRkRkRUlzYzBKQlFYTkNMRVZCUTNSQ0xIZENRVUYzUWl4RlFVTjRRaXgzUWtGQmQwSXNSVUZEZUVJc1RVRkJUU3hIUVVOUUxFMUJRVTBzWVVGQllTeERRVUZETzBGQlEzSkNMRTlCUVU4c1JVRkRUQ3hMUVVGTExFVkJRMHdzVjBGQlZ5eEZRVU5ZTEZsQlFWa3NSVUZEV2l4WFFVRlhMRVZCUTFnc1IwRkJSeXhGUVVOSUxGVkJRVlVzUjBGRFdDeE5RVUZOTEZWQlFWVXNRMEZCUXp0QlFUWkRiRUk3T3pzN096czdPenRIUVZOSE8wRkJRMGdzVFVGQlRTeFBRVUZQTEZsQlFWazdTVUUyVTNaQ0xGbEJRVmtzU1VGQldUdFJRVU4wUWl4SlFVRkpMRU5CUVVNc1NVRkJTU3hIUVVGSExFbEJRVWtzUTBGQlF6dFJRVU5xUWl4bFFVRmxPMUZCUTJZc1RVRkJUU3hEUVVGRExFOUJRVThzUTBGQlF5eDNRa0ZCZDBJc1EwRkJReXhEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETEVOQlFVTXNTVUZCU1N4RlFVRkZMRWxCUVVrc1EwRkJReXhGUVVGRkxFVkJRVVU3V1VGRGFFVXNUVUZCVFN4RFFVRkRMR05CUVdNc1EwRkJReXhKUVVGSkxFVkJRVVVzU1VGQlNTeEZRVUZGTzJkQ1FVTm9ReXhIUVVGSExFVkJRVVVzUjBGQlJ5eEZRVUZGTEVOQlFVTXNTVUZCU1N4RFFVRkRMRlZCUVZVc1EwRkJReXhKUVVGSkxFTkJRVU03WVVGRGFrTXNRMEZCUXl4RFFVRkRPMUZCUTB3c1EwRkJReXhEUVVGRExFTkJRVU03VVVGRlNDeE5RVUZOTEVOQlFVTXNUMEZCVHl4RFFVRkRMSE5DUVVGelFpeERRVUZETEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNc1EwRkJReXhKUVVGSkxFVkJRVVVzU1VGQlNTeERRVUZETEVWQlFVVXNSVUZCUlR0WlFVTTVSQ3hOUVVGTkxFTkJRVU1zWTBGQll5eERRVUZETEVsQlFVa3NSVUZCUlN4SlFVRkpMRVZCUVVVN1owSkJRMmhETEVkQlFVY3NSVUZCUlN4SFFVRkhMRVZCUVVVc1EwRkJReXhKUVVGSkxFTkJRVU1zVlVGQlZTeERRVUZETEVsQlFVa3NRMEZCUXp0aFFVTnFReXhEUVVGRExFTkJRVU03VVVGRFRDeERRVUZETEVOQlFVTXNRMEZCUXp0UlFVVklMRzlDUVVGdlFqdFJRVU53UWl4TlFVRk5MRU5CUVVNc1QwRkJUeXhEUVVGRExIZENRVUYzUWl4RFFVRkRMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU1zUTBGQlF5eEpRVUZKTEVWQlFVVXNTVUZCU1N4RFFVRkRMRVZCUVVVc1JVRkJSVHRaUVVOb1JTeE5RVUZOTEVOQlFVTXNZMEZCWXl4RFFVRkRMRWxCUVVrc1JVRkJSU3hKUVVGSkxFVkJRVVU3WjBKQlEyaERMRWRCUVVjc1JVRkJSU3hIUVVGSExFVkJRVVVzUTBGQlF5eEpRVUZKTEVOQlFVTXNWVUZCVlN4RFFVRkRMRWxCUVVrc1EwRkJRenRoUVVOcVF5eERRVUZETEVOQlFVTTdVVUZEVEN4RFFVRkRMRU5CUVVNc1EwRkJRenRSUVVWSUxFMUJRVTBzUTBGQlF5eFBRVUZQTEVOQlFVTXNjMEpCUVhOQ0xFTkJRVU1zUTBGQlF5eFBRVUZQTEVOQlFVTXNRMEZCUXl4RFFVRkRMRWxCUVVrc1JVRkJSU3hKUVVGSkxFTkJRVU1zUlVGQlJTeEZRVUZGTzFsQlF6bEVMRTFCUVUwc1EwRkJReXhqUVVGakxFTkJRVU1zU1VGQlNTeEZRVUZGTEVsQlFVa3NSVUZCUlR0blFrRkRhRU1zUjBGQlJ5eEZRVUZGTEVkQlFVY3NSVUZCUlN4RFFVRkRMRWxCUVVrc1EwRkJReXhWUVVGVkxFTkJRVU1zU1VGQlNTeERRVUZETzJGQlEycERMRU5CUVVNc1EwRkJRenRSUVVOTUxFTkJRVU1zUTBGQlF5eERRVUZETzFGQlJVZ3NVMEZCVXp0UlFVTlVMRTFCUVUwc1EwRkJReXhQUVVGUExFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNc1EwRkJReXhKUVVGSkxFVkJRVVVzU1VGQlNTeERRVUZETEVWQlFVVXNSVUZCUlR0WlFVTTVReXhOUVVGTkxFTkJRVU1zWTBGQll5eERRVUZETEVsQlFVa3NSVUZCUlN4SlFVRkpMRVZCUVVVN1owSkJRMmhETEVkQlFVY3NSVUZCUlN4SFFVRkhMRVZCUVVVc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVsQlFVa3NRMEZCUXp0aFFVTTFRaXhEUVVGRExFTkJRVU03VVVGRFRDeERRVUZETEVOQlFVTXNRMEZCUXp0SlFVTk1MRU5CUVVNN1NVRkZSRHM3T3p0UFFVbEhPMGxCUTBnc1MwRkJTenRSUVVOSUxFbEJRVWtzUTBGQlF5eEpRVUZKTEVkQlFVY3NTMEZCU3l4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dFJRVU0zUWl4UFFVRlBMRWxCUVVrc1EwRkJRenRKUVVOa0xFTkJRVU03U1VGRlJEczdPenM3VDBGTFJ6dEpRVU5JTEVkQlFVY3NRMEZCUXl4UFFVRmxPMUZCUTJwQ0xFbEJRVWtzUTBGQlF5eEpRVUZKTEVkQlFVY3NSMEZCUnl4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFVkJRVVVzVDBGQlR5eERRVUZETEVOQlFVTTdVVUZEY0VNc1QwRkJUeXhKUVVGSkxFTkJRVU03U1VGRFpDeERRVUZETzBsQlJVUTdPenM3TzA5QlMwYzdTVUZEU0N4VlFVRlZMRU5CUVVNc1EwRkJVenRSUVVOc1FpeEpRVUZKTEVOQlFVTXNTVUZCU1N4SFFVRkhMRmxCUVZrc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeEZRVUZGTEVOQlFVTXNRMEZCUXl4RFFVRkRPMUZCUTNaRExFOUJRVThzU1VGQlNTeERRVUZETzBsQlEyUXNRMEZCUXp0SlFVVkVPenM3T3p0UFFVdEhPMGxCUTBnc1ZVRkJWU3hEUVVGRExFTkJRVk03VVVGRGJFSXNTVUZCU1N4RFFVRkRMRWxCUVVrc1IwRkJSeXhaUVVGWkxFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NSVUZCUlN4RFFVRkRMRVZCUVVVc1NVRkJTU3hEUVVGRExFTkJRVU03VVVGRE4wTXNUMEZCVHl4SlFVRkpMRU5CUVVNN1NVRkRaQ3hEUVVGRE8wbEJSVVE3T3pzN08wOUJTMGM3U1VGRFNDeExRVUZMTEVOQlFVTXNRMEZCSzBJN1VVRkRia01zU1VGQlNTeFBRVUZQTEVOQlFVTXNTMEZCU3l4UlFVRlJMRWxCUVVrc1EwRkJReXhEUVVGRExFTkJRVU1zU1VGQlNTeE5RVUZOTEVOQlFVTXNSVUZCUlN4RFFVRkRPMWxCUXpWRExFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNhMEpCUVd0Q0xFTkJRVU1zUlVGQlJTeERRVUZETEVOQlFVTTdXVUZEY0VNc1QwRkJUeXhKUVVGSkxFTkJRVU03VVVGRFpDeERRVUZETzFGQlEwUXNTVUZCU1N4RFFVRkRMRWxCUVVrc1IwRkJSeXhWUVVGVkxFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJRenRSUVVOeVF5eFBRVUZQTEVsQlFVa3NRMEZCUXp0SlFVTmtMRU5CUVVNN1NVRkZSRHM3T3pzN1QwRkxSenRKUVVOSUxGRkJRVkVzUTBGQlF5eERRVUZUTzFGQlEyaENMRWxCUVVrc1EwRkJReXhKUVVGSkxFZEJRVWNzVjBGQlZ5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRGRFTXNUMEZCVHl4SlFVRkpMRU5CUVVNN1NVRkRaQ3hEUVVGRE8wbEJSVVE3T3pzN08wOUJTMGM3U1VGRFNDeFZRVUZWTEVOQlFVTXNRMEZCVXp0UlFVTnNRaXhKUVVGSkxFTkJRVU1zU1VGQlNTeEhRVUZITEZkQlFWY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hGUVVGRkxFTkJRVU1zUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXp0UlFVTTFReXhQUVVGUExFbEJRVWtzUTBGQlF6dEpRVU5rTEVOQlFVTTdTVUZGUkRzN096czdPenRQUVU5SE8wbEJRMGdzUjBGQlJ5eERRVUZETEVOQlFWTXNSVUZCUlN4RFFVRlRMRVZCUVVVc1EwRkJVenRSUVVOcVF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4SFFVRkhMRmRCUVZjc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeEZRVUZGTEVOQlFVTXNSVUZCUlN4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU03VVVGRE5VTXNUMEZCVHl4SlFVRkpMRU5CUVVNN1NVRkRaQ3hEUVVGRE8wbEJSVVE3T3pzN096czdUMEZQUnp0SlFVTklMRXRCUVVzc1EwRkJReXhEUVVGVExFVkJRVVVzUTBGQlV5eEZRVUZGTEVOQlFWTTdVVUZEYmtNc1NVRkJTU3hEUVVGRExFbEJRVWtzUjBGQlJ5eFhRVUZYTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1JVRkJSU3hEUVVGRExFVkJRVVVzUTBGQlF5eEZRVUZGTEVOQlFVTXNSVUZCUlN4SlFVRkpMRU5CUVVNc1EwRkJRenRSUVVOc1JDeFBRVUZQTEVsQlFVa3NRMEZCUXp0SlFVTmtMRU5CUVVNN1NVRkZSRHM3T3p0UFFVbEhPMGxCUTBnc1VVRkJVVHRSUVVOT0xFOUJRVThzU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXp0SlFVTnVRaXhEUVVGRE8wTkJRMFk3UVVGRlJEczdPenM3T3pzN096czdPenRIUVdGSE8wRkJRMGdzVFVGQlRTeFZRVUZWTEV0QlFVc3NRMEZCUXl4SFFVRkhMRU5CUVZjN1NVRkRiRU1zVDBGQlR5eEpRVUZKTEZsQlFWa3NRMEZCUXl4RFFVRkRMRU5CUVVNc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVOQlFVTTdRVUZEZGtNc1EwRkJReUlzSW1acGJHVWlPaUp6ZEhKcGJtZHpMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWFXMXdiM0owSUh0Y2JpQWdRbkpwWjJoMFFtRmphMmR5YjNWdVpFTnZiRzl5Y3l4Y2JpQWdRbkpwWjJoMFJtOXlaV2R5YjNWdVpFTnZiRzl5Y3l4Y2JpQWdVM1JoYm1SaGNtUkNZV05yWjNKdmRXNWtRMjlzYjNKekxGeHVJQ0JUZEdGdVpHRnlaRVp2Y21WbmNtOTFibVJEYjJ4dmNuTXNYRzRnSUhOMGVXeGxjeXhjYm4wZ1puSnZiU0JjSWk0dlkyOXVjM1JoYm5SelhDSTdYRzVwYlhCdmNuUWdlMXh1SUNCamJHVmhjaXhjYmlBZ1kyOXNiM0pwZW1VeU5UWXNYRzRnSUdOdmJHOXlhWHBsUVU1VFNTeGNiaUFnWTI5c2IzSnBlbVZTUjBJc1hHNGdJSEpoZHl4Y2JpQWdZWEJ3YkhsVGRIbHNaU3hjYm4wZ1puSnZiU0JjSWk0dlkyOXNiM0p6WENJN1hHNWNiaThxS2x4dUlDb2dRSFI1Y0dWa1pXWWdRMjlzYjNKcGVtVlBjSFJwYjI1elhHNGdLaUJBWkdWelkzSnBjSFJwYjI0Z1QzQjBhVzl1Y3lCbWIzSWdkR1Y0ZENCamIyeHZjbWw2WVhScGIyNGdkWE5wYm1jZ1FVNVRTU0JqYjJSbGN5NWNiaUFxSUVCemRXMXRZWEo1SUZSb2FYTWdkSGx3WlNCa1pXWnBibVZ6SUhSb1pTQnpkSEoxWTNSMWNtVWdiMllnZEdobElHOWlhbVZqZENCeVpYUjFjbTVsWkNCaWVTQjBhR1VnWTI5c2IzSnBlbVVnWm5WdVkzUnBiMjR1WEc0Z0tpQkpkQ0JwYm1Oc2RXUmxjeUJ0WlhSb2IyUnpJR1p2Y2lCaGNIQnNlV2x1WnlCMllYSnBiM1Z6SUdOdmJHOXlJR0Z1WkNCemRIbHNaU0J2Y0hScGIyNXpJSFJ2SUhSbGVIUWdkWE5wYm1jZ1FVNVRTU0JsYzJOaGNHVWdZMjlrWlhNdVhHNGdLbHh1SUNvZ1FIQnliM0JsY25SNUlIdFRkSGxzWldSVGRISnBibWQ5SUZOMFlXNWtZWEprUm05eVpXZHliM1Z1WkVOdmJHOXljeUJIWlhSMFpYSWdabTl5SUdWaFkyZ2djM1JoYm1SaGNtUWdabTl5WldkeWIzVnVaQ0JqYjJ4dmNpNWNiaUFxSUVCd2NtOXdaWEowZVNCN1UzUjViR1ZrVTNSeWFXNW5mU0JDY21sbmFIUkdiM0psWjNKdmRXNWtRMjlzYjNKeklFZGxkSFJsY2lCbWIzSWdaV0ZqYUNCaWNtbG5hSFFnWm05eVpXZHliM1Z1WkNCamIyeHZjaTVjYmlBcUlFQndjbTl3WlhKMGVTQjdVM1I1YkdWa1UzUnlhVzVuZlNCVGRHRnVaR0Z5WkVKaFkydG5jbTkxYm1SRGIyeHZjbk1nUjJWMGRHVnlJR1p2Y2lCbFlXTm9JSE4wWVc1a1lYSmtJR0poWTJ0bmNtOTFibVFnWTI5c2IzSXVYRzRnS2lCQWNISnZjR1Z5ZEhrZ2UxTjBlV3hsWkZOMGNtbHVaMzBnUW5KcFoyaDBRbUZqYTJkeWIzVnVaRU52Ykc5eWN5QkhaWFIwWlhJZ1ptOXlJR1ZoWTJnZ1luSnBaMmgwSUdKaFkydG5jbTkxYm1RZ1kyOXNiM0l1WEc0Z0tpQkFjSEp2Y0dWeWRIa2dlMU4wZVd4bFpGTjBjbWx1WjMwZ2MzUjViR1Z6SUVkbGRIUmxjaUJtYjNJZ1pXRmphQ0IwWlhoMElITjBlV3hsTGx4dUlDb2dRSEJ5YjNCbGNuUjVJSHRtZFc1amRHbHZiaWdwT2lCVGRIbHNaV1JUZEhKcGJtZDlJR05zWldGeUlGSmxiVzkyWlhNZ1lXeHNJSE4wZVd4cGJtY2dabkp2YlNCMGFHVWdkR1Y0ZEM1Y2JpQXFJRUJ3Y205d1pYSjBlU0I3Wm5WdVkzUnBiMjRvYzNSeWFXNW5LVG9nVTNSNWJHVmtVM1J5YVc1bmZTQnlZWGNnUVhCd2JHbGxjeUJ5WVhjZ1FVNVRTU0JqYjJSbGN5QjBieUIwYUdVZ2RHVjRkQzVjYmlBcUlFQndjbTl3WlhKMGVTQjdablZ1WTNScGIyNG9iblZ0WW1WeUtUb2dVM1I1YkdWa1UzUnlhVzVuZlNCbWIzSmxaM0p2ZFc1a0lFRndjR3hwWlhNZ1lTQm1iM0psWjNKdmRXNWtJR052Ykc5eUlIVnphVzVuSUVGT1Uwa2dZMjlrWlhNdVhHNGdLaUJBY0hKdmNHVnlkSGtnZTJaMWJtTjBhVzl1S0c1MWJXSmxjaWs2SUZOMGVXeGxaRk4wY21sdVozMGdZbUZqYTJkeWIzVnVaQ0JCY0hCc2FXVnpJR0VnWW1GamEyZHliM1Z1WkNCamIyeHZjaUIxYzJsdVp5QkJUbE5KSUdOdlpHVnpMbHh1SUNvZ1FIQnliM0JsY25SNUlIdG1kVzVqZEdsdmJpaHpkSEpwYm1jcE9pQlRkSGxzWldSVGRISnBibWQ5SUhOMGVXeGxJRUZ3Y0d4cFpYTWdZU0IwWlhoMElITjBlV3hsSUhWemFXNW5JRUZPVTBrZ1kyOWtaWE11WEc0Z0tpQkFjSEp2Y0dWeWRIa2dlMloxYm1OMGFXOXVLRzUxYldKbGNpazZJRk4wZVd4bFpGTjBjbWx1WjMwZ1kyOXNiM0l5TlRZZ1FYQndiR2xsY3lCaElESTFOaTFqYjJ4dmNpQm1iM0psWjNKdmRXNWtJR052Ykc5eUxseHVJQ29nUUhCeWIzQmxjblI1SUh0bWRXNWpkR2x2YmlodWRXMWlaWElwT2lCVGRIbHNaV1JUZEhKcGJtZDlJR0puUTI5c2IzSXlOVFlnUVhCd2JHbGxjeUJoSURJMU5pMWpiMnh2Y2lCaVlXTnJaM0p2ZFc1a0lHTnZiRzl5TGx4dUlDb2dRSEJ5YjNCbGNuUjVJSHRtZFc1amRHbHZiaWh1ZFcxaVpYSXNJRzUxYldKbGNpd2diblZ0WW1WeUtUb2dVM1I1YkdWa1UzUnlhVzVuZlNCeVoySWdRWEJ3YkdsbGN5QmhiaUJTUjBJZ1ptOXlaV2R5YjNWdVpDQmpiMnh2Y2k1Y2JpQXFJRUJ3Y205d1pYSjBlU0I3Wm5WdVkzUnBiMjRvYm5WdFltVnlMQ0J1ZFcxaVpYSXNJRzUxYldKbGNpazZJRk4wZVd4bFpGTjBjbWx1WjMwZ1ltZFNaMklnUVhCd2JHbGxjeUJoYmlCU1IwSWdZbUZqYTJkeWIzVnVaQ0JqYjJ4dmNpNWNiaUFxSUVCd2NtOXdaWEowZVNCN2MzUnlhVzVuZlNCMFpYaDBJRlJvWlNCMWJtUmxjbXg1YVc1bklIUmxlSFFnWTI5dWRHVnVkQzVjYmlBcVhHNGdLaUJBYldWdFltVnlUMllnYlc5a2RXeGxPbE4wZVd4bFpGTjBjbWx1WjF4dUlDb3ZYRzVsZUhCdmNuUWdkSGx3WlNCRGIyeHZjbWw2WlU5d2RHbHZibk1nUFNCN1hHNGdJRnRySUdsdUlHdGxlVzltSUhSNWNHVnZaaUJUZEdGdVpHRnlaRVp2Y21WbmNtOTFibVJEYjJ4dmNuTmRPaUJUZEhsc1pXUlRkSEpwYm1jN1hHNTlJQ1lnZXlCYmF5QnBiaUJyWlhsdlppQjBlWEJsYjJZZ1FuSnBaMmgwUm05eVpXZHliM1Z1WkVOdmJHOXljMTA2SUZOMGVXeGxaRk4wY21sdVp5QjlJQ1lnZTF4dUlDQmJheUJwYmlCclpYbHZaaUIwZVhCbGIyWWdVM1JoYm1SaGNtUkNZV05yWjNKdmRXNWtRMjlzYjNKelhUb2dVM1I1YkdWa1UzUnlhVzVuTzF4dWZTQW1JSHNnVzJzZ2FXNGdhMlY1YjJZZ2RIbHdaVzltSUVKeWFXZG9kRUpoWTJ0bmNtOTFibVJEYjJ4dmNuTmRPaUJUZEhsc1pXUlRkSEpwYm1jZ2ZTQW1JSHRjYmlBZ1cyc2dhVzRnYTJWNWIyWWdkSGx3Wlc5bUlITjBlV3hsYzEwNklGTjBlV3hsWkZOMGNtbHVaenRjYm4wZ0ppQjdYRzRnSUdOc1pXRnlPaUFvS1NBOVBpQlRkSGxzWldSVGRISnBibWM3WEc0Z0lISmhkem9nS0hKaGR6b2djM1J5YVc1bktTQTlQaUJUZEhsc1pXUlRkSEpwYm1jN1hHNGdJR1p2Y21WbmNtOTFibVE2SUNodU9pQnVkVzFpWlhJcElEMCtJRk4wZVd4bFpGTjBjbWx1Wnp0Y2JpQWdZbUZqYTJkeWIzVnVaRG9nS0c0NklHNTFiV0psY2lrZ1BUNGdVM1I1YkdWa1UzUnlhVzVuTzF4dUlDQnpkSGxzWlRvZ0tHNDZJRzUxYldKbGNpQjhJR3RsZVc5bUlIUjVjR1Z2WmlCemRIbHNaWE1wSUQwK0lGTjBlV3hsWkZOMGNtbHVaenRjYmlBZ1kyOXNiM0l5TlRZNklDaHVPaUJ1ZFcxaVpYSXBJRDArSUZOMGVXeGxaRk4wY21sdVp6dGNiaUFnWW1kRGIyeHZjakkxTmpvZ0tHNDZJRzUxYldKbGNpa2dQVDRnVTNSNWJHVmtVM1J5YVc1bk8xeHVJQ0J5WjJJNklDaHlPaUJ1ZFcxaVpYSXNJR2M2SUc1MWJXSmxjaXdnWWpvZ2JuVnRZbVZ5S1NBOVBpQlRkSGxzWldSVGRISnBibWM3WEc0Z0lHSm5VbWRpT2lBb2Nqb2diblZ0WW1WeUxDQm5PaUJ1ZFcxaVpYSXNJR0k2SUc1MWJXSmxjaWtnUFQ0Z1UzUjViR1ZrVTNSeWFXNW5PMXh1SUNCMFpYaDBPaUJ6ZEhKcGJtYzdYRzU5TzF4dVhHNHZLaXBjYmlBcUlFQmpiR0Z6Y3lCVGRIbHNaV1JUZEhKcGJtZGNiaUFxSUVCa1pYTmpjbWx3ZEdsdmJpQkJJR05zWVhOeklIUm9ZWFFnWlhoMFpXNWtjeUJ6ZEhKcGJtY2dablZ1WTNScGIyNWhiR2wwZVNCM2FYUm9JRUZPVTBrZ1kyOXNiM0lnWVc1a0lITjBlV3hsSUc5d2RHbHZibk11WEc0Z0tpQkFjM1Z0YldGeWVTQlRkSGxzWldSVGRISnBibWNnY0hKdmRtbGtaWE1nYldWMGFHOWtjeUIwYnlCaGNIQnNlU0IyWVhKcGIzVnpJRUZPVTBrZ1kyOXNiM0lnWVc1a0lITjBlV3hsSUc5d2RHbHZibk1nZEc4Z2RHVjRkQ0J6ZEhKcGJtZHpMbHh1SUNvZ1NYUWdhVzF3YkdWdFpXNTBjeUIwYUdVZ1EyOXNiM0pwZW1WUGNIUnBiMjV6SUdsdWRHVnlabUZqWlNCaGJtUWdjSEp2ZUdsbGN5QnVZWFJwZG1VZ2MzUnlhVzVuSUcxbGRHaHZaSE1nZEc4Z2RHaGxJSFZ1WkdWeWJIbHBibWNnZEdWNGRDNWNiaUFxSUZSb2FYTWdZMnhoYzNNZ1lXeHNiM2R6SUdadmNpQmphR0ZwYm1sdVp5QnZaaUJ6ZEhsc2FXNW5JRzFsZEdodlpITWdZVzVrSUdWaGMza2dZWEJ3YkdsallYUnBiMjRnYjJZZ1kyOXNiM0p6SUdGdVpDQnpkSGxzWlhNZ2RHOGdkR1Y0ZEM1Y2JpQXFJRnh1SUNvZ1FHbHRjR3hsYldWdWRITWdlME52Ykc5eWFYcGxUM0IwYVc5dWMzMWNiaUFxSUVCd1lYSmhiU0I3YzNSeWFXNW5mU0IwWlhoMElDMGdWR2hsSUdsdWFYUnBZV3dnZEdWNGRDQnpkSEpwYm1jZ2RHOGdZbVVnYzNSNWJHVmtMbHh1SUNvdlhHNWxlSEJ2Y25RZ1kyeGhjM01nVTNSNWJHVmtVM1J5YVc1bklHbHRjR3hsYldWdWRITWdRMjlzYjNKcGVtVlBjSFJwYjI1eklIdGNiaUFnTHlvcVhHNGdJQ0FxSUVCa1pYTmpjbWx3ZEdsdmJpQkJjSEJzYVdWeklHSnNZV05ySUdOdmJHOXlJSFJ2SUhSb1pTQjBaWGgwTGx4dUlDQWdLaUJBYzNWdGJXRnllU0JIWlhSMFpYSWdkR2hoZENCeVpYUjFjbTV6SUdFZ2JtVjNJRk4wZVd4bFpGTjBjbWx1WnlCM2FYUm9JR0pzWVdOcklHWnZjbVZuY205MWJtUWdZMjlzYjNJdVhHNGdJQ0FxTDF4dUlDQmliR0ZqYXlFNklGTjBlV3hsWkZOMGNtbHVaenRjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRR1JsYzJOeWFYQjBhVzl1SUVGd2NHeHBaWE1nY21Wa0lHTnZiRzl5SUhSdklIUm9aU0IwWlhoMExseHVJQ0FnS2lCQWMzVnRiV0Z5ZVNCSFpYUjBaWElnZEdoaGRDQnlaWFIxY201eklHRWdibVYzSUZOMGVXeGxaRk4wY21sdVp5QjNhWFJvSUhKbFpDQm1iM0psWjNKdmRXNWtJR052Ykc5eUxseHVJQ0FnS2k5Y2JpQWdjbVZrSVRvZ1UzUjViR1ZrVTNSeWFXNW5PMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkFaR1Z6WTNKcGNIUnBiMjRnUVhCd2JHbGxjeUJuY21WbGJpQmpiMnh2Y2lCMGJ5QjBhR1VnZEdWNGRDNWNiaUFnSUNvZ1FITjFiVzFoY25rZ1IyVjBkR1Z5SUhSb1lYUWdjbVYwZFhKdWN5QmhJRzVsZHlCVGRIbHNaV1JUZEhKcGJtY2dkMmwwYUNCbmNtVmxiaUJtYjNKbFozSnZkVzVrSUdOdmJHOXlMbHh1SUNBZ0tpOWNiaUFnWjNKbFpXNGhPaUJUZEhsc1pXUlRkSEpwYm1jN1hHNWNiaUFnTHlvcVhHNGdJQ0FxSUVCa1pYTmpjbWx3ZEdsdmJpQkJjSEJzYVdWeklIbGxiR3h2ZHlCamIyeHZjaUIwYnlCMGFHVWdkR1Y0ZEM1Y2JpQWdJQ29nUUhOMWJXMWhjbmtnUjJWMGRHVnlJSFJvWVhRZ2NtVjBkWEp1Y3lCaElHNWxkeUJUZEhsc1pXUlRkSEpwYm1jZ2QybDBhQ0I1Wld4c2IzY2dabTl5WldkeWIzVnVaQ0JqYjJ4dmNpNWNiaUFnSUNvdlhHNGdJSGxsYkd4dmR5RTZJRk4wZVd4bFpGTjBjbWx1Wnp0Y2JseHVJQ0F2S2lwY2JpQWdJQ29nUUdSbGMyTnlhWEIwYVc5dUlFRndjR3hwWlhNZ1lteDFaU0JqYjJ4dmNpQjBieUIwYUdVZ2RHVjRkQzVjYmlBZ0lDb2dRSE4xYlcxaGNua2dSMlYwZEdWeUlIUm9ZWFFnY21WMGRYSnVjeUJoSUc1bGR5QlRkSGxzWldSVGRISnBibWNnZDJsMGFDQmliSFZsSUdadmNtVm5jbTkxYm1RZ1kyOXNiM0l1WEc0Z0lDQXFMMXh1SUNCaWJIVmxJVG9nVTNSNWJHVmtVM1J5YVc1bk8xeHVYRzRnSUM4cUtseHVJQ0FnS2lCQVpHVnpZM0pwY0hScGIyNGdRWEJ3YkdsbGN5QnRZV2RsYm5SaElHTnZiRzl5SUhSdklIUm9aU0IwWlhoMExseHVJQ0FnS2lCQWMzVnRiV0Z5ZVNCSFpYUjBaWElnZEdoaGRDQnlaWFIxY201eklHRWdibVYzSUZOMGVXeGxaRk4wY21sdVp5QjNhWFJvSUcxaFoyVnVkR0VnWm05eVpXZHliM1Z1WkNCamIyeHZjaTVjYmlBZ0lDb3ZYRzRnSUcxaFoyVnVkR0VoT2lCVGRIbHNaV1JUZEhKcGJtYzdYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFQmtaWE5qY21sd2RHbHZiaUJCY0hCc2FXVnpJR041WVc0Z1kyOXNiM0lnZEc4Z2RHaGxJSFJsZUhRdVhHNGdJQ0FxSUVCemRXMXRZWEo1SUVkbGRIUmxjaUIwYUdGMElISmxkSFZ5Ym5NZ1lTQnVaWGNnVTNSNWJHVmtVM1J5YVc1bklIZHBkR2dnWTNsaGJpQm1iM0psWjNKdmRXNWtJR052Ykc5eUxseHVJQ0FnS2k5Y2JpQWdZM2xoYmlFNklGTjBlV3hsWkZOMGNtbHVaenRjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRR1JsYzJOeWFYQjBhVzl1SUVGd2NHeHBaWE1nZDJocGRHVWdZMjlzYjNJZ2RHOGdkR2hsSUhSbGVIUXVYRzRnSUNBcUlFQnpkVzF0WVhKNUlFZGxkSFJsY2lCMGFHRjBJSEpsZEhWeWJuTWdZU0J1WlhjZ1UzUjViR1ZrVTNSeWFXNW5JSGRwZEdnZ2QyaHBkR1VnWm05eVpXZHliM1Z1WkNCamIyeHZjaTVjYmlBZ0lDb3ZYRzRnSUhkb2FYUmxJVG9nVTNSNWJHVmtVM1J5YVc1bk8xeHVYRzRnSUM4cUtseHVJQ0FnS2lCQVpHVnpZM0pwY0hScGIyNGdRWEJ3YkdsbGN5QmljbWxuYUhRZ1lteGhZMnNnS0dkeVlYa3BJR052Ykc5eUlIUnZJSFJvWlNCMFpYaDBMbHh1SUNBZ0tpQkFjM1Z0YldGeWVTQkhaWFIwWlhJZ2RHaGhkQ0J5WlhSMWNtNXpJR0VnYm1WM0lGTjBlV3hsWkZOMGNtbHVaeUIzYVhSb0lHSnlhV2RvZENCaWJHRmpheUJtYjNKbFozSnZkVzVrSUdOdmJHOXlMbHh1SUNBZ0tpOWNiaUFnWW5KcFoyaDBRbXhoWTJzaE9pQlRkSGxzWldSVGRISnBibWM3WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRUJrWlhOamNtbHdkR2x2YmlCQmNIQnNhV1Z6SUdKeWFXZG9kQ0J5WldRZ1kyOXNiM0lnZEc4Z2RHaGxJSFJsZUhRdVhHNGdJQ0FxSUVCemRXMXRZWEo1SUVkbGRIUmxjaUIwYUdGMElISmxkSFZ5Ym5NZ1lTQnVaWGNnVTNSNWJHVmtVM1J5YVc1bklIZHBkR2dnWW5KcFoyaDBJSEpsWkNCbWIzSmxaM0p2ZFc1a0lHTnZiRzl5TGx4dUlDQWdLaTljYmlBZ1luSnBaMmgwVW1Wa0lUb2dVM1I1YkdWa1UzUnlhVzVuTzF4dVhHNGdJQzhxS2x4dUlDQWdLaUJBWkdWelkzSnBjSFJwYjI0Z1FYQndiR2xsY3lCaWNtbG5hSFFnWjNKbFpXNGdZMjlzYjNJZ2RHOGdkR2hsSUhSbGVIUXVYRzRnSUNBcUlFQnpkVzF0WVhKNUlFZGxkSFJsY2lCMGFHRjBJSEpsZEhWeWJuTWdZU0J1WlhjZ1UzUjViR1ZrVTNSeWFXNW5JSGRwZEdnZ1luSnBaMmgwSUdkeVpXVnVJR1p2Y21WbmNtOTFibVFnWTI5c2IzSXVYRzRnSUNBcUwxeHVJQ0JpY21sbmFIUkhjbVZsYmlFNklGTjBlV3hsWkZOMGNtbHVaenRjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRR1JsYzJOeWFYQjBhVzl1SUVGd2NHeHBaWE1nWW5KcFoyaDBJSGxsYkd4dmR5QmpiMnh2Y2lCMGJ5QjBhR1VnZEdWNGRDNWNiaUFnSUNvZ1FITjFiVzFoY25rZ1IyVjBkR1Z5SUhSb1lYUWdjbVYwZFhKdWN5QmhJRzVsZHlCVGRIbHNaV1JUZEhKcGJtY2dkMmwwYUNCaWNtbG5hSFFnZVdWc2JHOTNJR1p2Y21WbmNtOTFibVFnWTI5c2IzSXVYRzRnSUNBcUwxeHVJQ0JpY21sbmFIUlpaV3hzYjNjaE9pQlRkSGxzWldSVGRISnBibWM3WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRUJrWlhOamNtbHdkR2x2YmlCQmNIQnNhV1Z6SUdKeWFXZG9kQ0JpYkhWbElHTnZiRzl5SUhSdklIUm9aU0IwWlhoMExseHVJQ0FnS2lCQWMzVnRiV0Z5ZVNCSFpYUjBaWElnZEdoaGRDQnlaWFIxY201eklHRWdibVYzSUZOMGVXeGxaRk4wY21sdVp5QjNhWFJvSUdKeWFXZG9kQ0JpYkhWbElHWnZjbVZuY205MWJtUWdZMjlzYjNJdVhHNGdJQ0FxTDF4dUlDQmljbWxuYUhSQ2JIVmxJVG9nVTNSNWJHVmtVM1J5YVc1bk8xeHVYRzRnSUM4cUtseHVJQ0FnS2lCQVpHVnpZM0pwY0hScGIyNGdRWEJ3YkdsbGN5QmljbWxuYUhRZ2JXRm5aVzUwWVNCamIyeHZjaUIwYnlCMGFHVWdkR1Y0ZEM1Y2JpQWdJQ29nUUhOMWJXMWhjbmtnUjJWMGRHVnlJSFJvWVhRZ2NtVjBkWEp1Y3lCaElHNWxkeUJUZEhsc1pXUlRkSEpwYm1jZ2QybDBhQ0JpY21sbmFIUWdiV0ZuWlc1MFlTQm1iM0psWjNKdmRXNWtJR052Ykc5eUxseHVJQ0FnS2k5Y2JpQWdZbkpwWjJoMFRXRm5aVzUwWVNFNklGTjBlV3hsWkZOMGNtbHVaenRjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRR1JsYzJOeWFYQjBhVzl1SUVGd2NHeHBaWE1nWW5KcFoyaDBJR041WVc0Z1kyOXNiM0lnZEc4Z2RHaGxJSFJsZUhRdVhHNGdJQ0FxSUVCemRXMXRZWEo1SUVkbGRIUmxjaUIwYUdGMElISmxkSFZ5Ym5NZ1lTQnVaWGNnVTNSNWJHVmtVM1J5YVc1bklIZHBkR2dnWW5KcFoyaDBJR041WVc0Z1ptOXlaV2R5YjNWdVpDQmpiMnh2Y2k1Y2JpQWdJQ292WEc0Z0lHSnlhV2RvZEVONVlXNGhPaUJUZEhsc1pXUlRkSEpwYm1jN1hHNWNiaUFnTHlvcVhHNGdJQ0FxSUVCa1pYTmpjbWx3ZEdsdmJpQkJjSEJzYVdWeklHSnlhV2RvZENCM2FHbDBaU0JqYjJ4dmNpQjBieUIwYUdVZ2RHVjRkQzVjYmlBZ0lDb2dRSE4xYlcxaGNua2dSMlYwZEdWeUlIUm9ZWFFnY21WMGRYSnVjeUJoSUc1bGR5QlRkSGxzWldSVGRISnBibWNnZDJsMGFDQmljbWxuYUhRZ2QyaHBkR1VnWm05eVpXZHliM1Z1WkNCamIyeHZjaTVjYmlBZ0lDb3ZYRzRnSUdKeWFXZG9kRmRvYVhSbElUb2dVM1I1YkdWa1UzUnlhVzVuTzF4dVhHNGdJQzhxS2x4dUlDQWdLaUJBWkdWelkzSnBjSFJwYjI0Z1FYQndiR2xsY3lCaWJHRmpheUJpWVdOclozSnZkVzVrSUdOdmJHOXlJSFJ2SUhSb1pTQjBaWGgwTGx4dUlDQWdLaUJBYzNWdGJXRnllU0JIWlhSMFpYSWdkR2hoZENCeVpYUjFjbTV6SUdFZ2JtVjNJRk4wZVd4bFpGTjBjbWx1WnlCM2FYUm9JR0pzWVdOcklHSmhZMnRuY205MWJtUWdZMjlzYjNJdVhHNGdJQ0FxTDF4dUlDQmlaMEpzWVdOcklUb2dVM1I1YkdWa1UzUnlhVzVuTzF4dVhHNGdJQzhxS2x4dUlDQWdLaUJBWkdWelkzSnBjSFJwYjI0Z1FYQndiR2xsY3lCeVpXUWdZbUZqYTJkeWIzVnVaQ0JqYjJ4dmNpQjBieUIwYUdVZ2RHVjRkQzVjYmlBZ0lDb2dRSE4xYlcxaGNua2dSMlYwZEdWeUlIUm9ZWFFnY21WMGRYSnVjeUJoSUc1bGR5QlRkSGxzWldSVGRISnBibWNnZDJsMGFDQnlaV1FnWW1GamEyZHliM1Z1WkNCamIyeHZjaTVjYmlBZ0lDb3ZYRzRnSUdKblVtVmtJVG9nVTNSNWJHVmtVM1J5YVc1bk8xeHVYRzRnSUM4cUtseHVJQ0FnS2lCQVpHVnpZM0pwY0hScGIyNGdRWEJ3YkdsbGN5Qm5jbVZsYmlCaVlXTnJaM0p2ZFc1a0lHTnZiRzl5SUhSdklIUm9aU0IwWlhoMExseHVJQ0FnS2lCQWMzVnRiV0Z5ZVNCSFpYUjBaWElnZEdoaGRDQnlaWFIxY201eklHRWdibVYzSUZOMGVXeGxaRk4wY21sdVp5QjNhWFJvSUdkeVpXVnVJR0poWTJ0bmNtOTFibVFnWTI5c2IzSXVYRzRnSUNBcUwxeHVJQ0JpWjBkeVpXVnVJVG9nVTNSNWJHVmtVM1J5YVc1bk8xeHVYRzRnSUM4cUtseHVJQ0FnS2lCQVpHVnpZM0pwY0hScGIyNGdRWEJ3YkdsbGN5QjVaV3hzYjNjZ1ltRmphMmR5YjNWdVpDQmpiMnh2Y2lCMGJ5QjBhR1VnZEdWNGRDNWNiaUFnSUNvZ1FITjFiVzFoY25rZ1IyVjBkR1Z5SUhSb1lYUWdjbVYwZFhKdWN5QmhJRzVsZHlCVGRIbHNaV1JUZEhKcGJtY2dkMmwwYUNCNVpXeHNiM2NnWW1GamEyZHliM1Z1WkNCamIyeHZjaTVjYmlBZ0lDb3ZYRzRnSUdKbldXVnNiRzkzSVRvZ1UzUjViR1ZrVTNSeWFXNW5PMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkFaR1Z6WTNKcGNIUnBiMjRnUVhCd2JHbGxjeUJpYkhWbElHSmhZMnRuY205MWJtUWdZMjlzYjNJZ2RHOGdkR2hsSUhSbGVIUXVYRzRnSUNBcUlFQnpkVzF0WVhKNUlFZGxkSFJsY2lCMGFHRjBJSEpsZEhWeWJuTWdZU0J1WlhjZ1UzUjViR1ZrVTNSeWFXNW5JSGRwZEdnZ1lteDFaU0JpWVdOclozSnZkVzVrSUdOdmJHOXlMbHh1SUNBZ0tpOWNiaUFnWW1kQ2JIVmxJVG9nVTNSNWJHVmtVM1J5YVc1bk8xeHVYRzRnSUM4cUtseHVJQ0FnS2lCQVpHVnpZM0pwY0hScGIyNGdRWEJ3YkdsbGN5QnRZV2RsYm5SaElHSmhZMnRuY205MWJtUWdZMjlzYjNJZ2RHOGdkR2hsSUhSbGVIUXVYRzRnSUNBcUlFQnpkVzF0WVhKNUlFZGxkSFJsY2lCMGFHRjBJSEpsZEhWeWJuTWdZU0J1WlhjZ1UzUjViR1ZrVTNSeWFXNW5JSGRwZEdnZ2JXRm5aVzUwWVNCaVlXTnJaM0p2ZFc1a0lHTnZiRzl5TGx4dUlDQWdLaTljYmlBZ1ltZE5ZV2RsYm5SaElUb2dVM1I1YkdWa1UzUnlhVzVuTzF4dVhHNGdJQzhxS2x4dUlDQWdLaUJBWkdWelkzSnBjSFJwYjI0Z1FYQndiR2xsY3lCamVXRnVJR0poWTJ0bmNtOTFibVFnWTI5c2IzSWdkRzhnZEdobElIUmxlSFF1WEc0Z0lDQXFJRUJ6ZFcxdFlYSjVJRWRsZEhSbGNpQjBhR0YwSUhKbGRIVnlibk1nWVNCdVpYY2dVM1I1YkdWa1UzUnlhVzVuSUhkcGRHZ2dZM2xoYmlCaVlXTnJaM0p2ZFc1a0lHTnZiRzl5TGx4dUlDQWdLaTljYmlBZ1ltZERlV0Z1SVRvZ1UzUjViR1ZrVTNSeWFXNW5PMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkFaR1Z6WTNKcGNIUnBiMjRnUVhCd2JHbGxjeUIzYUdsMFpTQmlZV05yWjNKdmRXNWtJR052Ykc5eUlIUnZJSFJvWlNCMFpYaDBMbHh1SUNBZ0tpQkFjM1Z0YldGeWVTQkhaWFIwWlhJZ2RHaGhkQ0J5WlhSMWNtNXpJR0VnYm1WM0lGTjBlV3hsWkZOMGNtbHVaeUIzYVhSb0lIZG9hWFJsSUdKaFkydG5jbTkxYm1RZ1kyOXNiM0l1WEc0Z0lDQXFMMXh1SUNCaVoxZG9hWFJsSVRvZ1UzUjViR1ZrVTNSeWFXNW5PMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkFaR1Z6WTNKcGNIUnBiMjRnUVhCd2JHbGxjeUJpY21sbmFIUWdZbXhoWTJzZ0tHZHlZWGtwSUdKaFkydG5jbTkxYm1RZ1kyOXNiM0lnZEc4Z2RHaGxJSFJsZUhRdVhHNGdJQ0FxSUVCemRXMXRZWEo1SUVkbGRIUmxjaUIwYUdGMElISmxkSFZ5Ym5NZ1lTQnVaWGNnVTNSNWJHVmtVM1J5YVc1bklIZHBkR2dnWW5KcFoyaDBJR0pzWVdOcklHSmhZMnRuY205MWJtUWdZMjlzYjNJdVhHNGdJQ0FxTDF4dUlDQmlaMEp5YVdkb2RFSnNZV05ySVRvZ1UzUjViR1ZrVTNSeWFXNW5PMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkFaR1Z6WTNKcGNIUnBiMjRnUVhCd2JHbGxjeUJpY21sbmFIUWdjbVZrSUdKaFkydG5jbTkxYm1RZ1kyOXNiM0lnZEc4Z2RHaGxJSFJsZUhRdVhHNGdJQ0FxSUVCemRXMXRZWEo1SUVkbGRIUmxjaUIwYUdGMElISmxkSFZ5Ym5NZ1lTQnVaWGNnVTNSNWJHVmtVM1J5YVc1bklIZHBkR2dnWW5KcFoyaDBJSEpsWkNCaVlXTnJaM0p2ZFc1a0lHTnZiRzl5TGx4dUlDQWdLaTljYmlBZ1ltZENjbWxuYUhSU1pXUWhPaUJUZEhsc1pXUlRkSEpwYm1jN1hHNWNiaUFnTHlvcVhHNGdJQ0FxSUVCa1pYTmpjbWx3ZEdsdmJpQkJjSEJzYVdWeklHSnlhV2RvZENCbmNtVmxiaUJpWVdOclozSnZkVzVrSUdOdmJHOXlJSFJ2SUhSb1pTQjBaWGgwTGx4dUlDQWdLaUJBYzNWdGJXRnllU0JIWlhSMFpYSWdkR2hoZENCeVpYUjFjbTV6SUdFZ2JtVjNJRk4wZVd4bFpGTjBjbWx1WnlCM2FYUm9JR0p5YVdkb2RDQm5jbVZsYmlCaVlXTnJaM0p2ZFc1a0lHTnZiRzl5TGx4dUlDQWdLaTljYmlBZ1ltZENjbWxuYUhSSGNtVmxiaUU2SUZOMGVXeGxaRk4wY21sdVp6dGNibHh1SUNBdktpcGNiaUFnSUNvZ1FHUmxjMk55YVhCMGFXOXVJRUZ3Y0d4cFpYTWdZbkpwWjJoMElIbGxiR3h2ZHlCaVlXTnJaM0p2ZFc1a0lHTnZiRzl5SUhSdklIUm9aU0IwWlhoMExseHVJQ0FnS2lCQWMzVnRiV0Z5ZVNCSFpYUjBaWElnZEdoaGRDQnlaWFIxY201eklHRWdibVYzSUZOMGVXeGxaRk4wY21sdVp5QjNhWFJvSUdKeWFXZG9kQ0I1Wld4c2IzY2dZbUZqYTJkeWIzVnVaQ0JqYjJ4dmNpNWNiaUFnSUNvdlhHNGdJR0puUW5KcFoyaDBXV1ZzYkc5M0lUb2dVM1I1YkdWa1UzUnlhVzVuTzF4dVhHNGdJQzhxS2x4dUlDQWdLaUJBWkdWelkzSnBjSFJwYjI0Z1FYQndiR2xsY3lCaWNtbG5hSFFnWW14MVpTQmlZV05yWjNKdmRXNWtJR052Ykc5eUlIUnZJSFJvWlNCMFpYaDBMbHh1SUNBZ0tpQkFjM1Z0YldGeWVTQkhaWFIwWlhJZ2RHaGhkQ0J5WlhSMWNtNXpJR0VnYm1WM0lGTjBlV3hsWkZOMGNtbHVaeUIzYVhSb0lHSnlhV2RvZENCaWJIVmxJR0poWTJ0bmNtOTFibVFnWTI5c2IzSXVYRzRnSUNBcUwxeHVJQ0JpWjBKeWFXZG9kRUpzZFdVaE9pQlRkSGxzWldSVGRISnBibWM3WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRUJrWlhOamNtbHdkR2x2YmlCQmNIQnNhV1Z6SUdKeWFXZG9kQ0J0WVdkbGJuUmhJR0poWTJ0bmNtOTFibVFnWTI5c2IzSWdkRzhnZEdobElIUmxlSFF1WEc0Z0lDQXFJRUJ6ZFcxdFlYSjVJRWRsZEhSbGNpQjBhR0YwSUhKbGRIVnlibk1nWVNCdVpYY2dVM1I1YkdWa1UzUnlhVzVuSUhkcGRHZ2dZbkpwWjJoMElHMWhaMlZ1ZEdFZ1ltRmphMmR5YjNWdVpDQmpiMnh2Y2k1Y2JpQWdJQ292WEc0Z0lHSm5RbkpwWjJoMFRXRm5aVzUwWVNFNklGTjBlV3hsWkZOMGNtbHVaenRjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRR1JsYzJOeWFYQjBhVzl1SUVGd2NHeHBaWE1nWW5KcFoyaDBJR041WVc0Z1ltRmphMmR5YjNWdVpDQmpiMnh2Y2lCMGJ5QjBhR1VnZEdWNGRDNWNiaUFnSUNvZ1FITjFiVzFoY25rZ1IyVjBkR1Z5SUhSb1lYUWdjbVYwZFhKdWN5QmhJRzVsZHlCVGRIbHNaV1JUZEhKcGJtY2dkMmwwYUNCaWNtbG5hSFFnWTNsaGJpQmlZV05yWjNKdmRXNWtJR052Ykc5eUxseHVJQ0FnS2k5Y2JpQWdZbWRDY21sbmFIUkRlV0Z1SVRvZ1UzUjViR1ZrVTNSeWFXNW5PMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkFaR1Z6WTNKcGNIUnBiMjRnUVhCd2JHbGxjeUJpY21sbmFIUWdkMmhwZEdVZ1ltRmphMmR5YjNWdVpDQmpiMnh2Y2lCMGJ5QjBhR1VnZEdWNGRDNWNiaUFnSUNvZ1FITjFiVzFoY25rZ1IyVjBkR1Z5SUhSb1lYUWdjbVYwZFhKdWN5QmhJRzVsZHlCVGRIbHNaV1JUZEhKcGJtY2dkMmwwYUNCaWNtbG5hSFFnZDJocGRHVWdZbUZqYTJkeWIzVnVaQ0JqYjJ4dmNpNWNiaUFnSUNvdlhHNGdJR0puUW5KcFoyaDBWMmhwZEdVaE9pQlRkSGxzWldSVGRISnBibWM3WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRUJrWlhOamNtbHdkR2x2YmlCU1pYTmxkSE1nWVd4c0lITjBlV3hwYm1jZ1lYQndiR2xsWkNCMGJ5QjBhR1VnZEdWNGRDNWNiaUFnSUNvZ1FITjFiVzFoY25rZ1IyVjBkR1Z5SUhSb1lYUWdjbVYwZFhKdWN5QmhJRzVsZHlCVGRIbHNaV1JUZEhKcGJtY2dkMmwwYUNCaGJHd2djM1I1YkdsdVp5QnlaWE5sZEM1Y2JpQWdJQ292WEc0Z0lISmxjMlYwSVRvZ1UzUjViR1ZrVTNSeWFXNW5PMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkFaR1Z6WTNKcGNIUnBiMjRnUVhCd2JHbGxjeUJpYjJ4a0lITjBlV3hsSUhSdklIUm9aU0IwWlhoMExseHVJQ0FnS2lCQWMzVnRiV0Z5ZVNCSFpYUjBaWElnZEdoaGRDQnlaWFIxY201eklHRWdibVYzSUZOMGVXeGxaRk4wY21sdVp5QjNhWFJvSUdKdmJHUWdjM1I1YkdVdVhHNGdJQ0FxTDF4dUlDQmliMnhrSVRvZ1UzUjViR1ZrVTNSeWFXNW5PMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkFaR1Z6WTNKcGNIUnBiMjRnUVhCd2JHbGxjeUJrYVcwZ0tHUmxZM0psWVhObFpDQnBiblJsYm5OcGRIa3BJSE4wZVd4bElIUnZJSFJvWlNCMFpYaDBMbHh1SUNBZ0tpQkFjM1Z0YldGeWVTQkhaWFIwWlhJZ2RHaGhkQ0J5WlhSMWNtNXpJR0VnYm1WM0lGTjBlV3hsWkZOMGNtbHVaeUIzYVhSb0lHUnBiU0J6ZEhsc1pTNWNiaUFnSUNvdlhHNGdJR1JwYlNFNklGTjBlV3hsWkZOMGNtbHVaenRjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRR1JsYzJOeWFYQjBhVzl1SUVGd2NHeHBaWE1nYVhSaGJHbGpJSE4wZVd4bElIUnZJSFJvWlNCMFpYaDBMbHh1SUNBZ0tpQkFjM1Z0YldGeWVTQkhaWFIwWlhJZ2RHaGhkQ0J5WlhSMWNtNXpJR0VnYm1WM0lGTjBlV3hsWkZOMGNtbHVaeUIzYVhSb0lHbDBZV3hwWXlCemRIbHNaUzVjYmlBZ0lDb3ZYRzRnSUdsMFlXeHBZeUU2SUZOMGVXeGxaRk4wY21sdVp6dGNibHh1SUNBdktpcGNiaUFnSUNvZ1FHUmxjMk55YVhCMGFXOXVJRUZ3Y0d4cFpYTWdkVzVrWlhKc2FXNWxJSE4wZVd4bElIUnZJSFJvWlNCMFpYaDBMbHh1SUNBZ0tpQkFjM1Z0YldGeWVTQkhaWFIwWlhJZ2RHaGhkQ0J5WlhSMWNtNXpJR0VnYm1WM0lGTjBlV3hsWkZOMGNtbHVaeUIzYVhSb0lIVnVaR1Z5YkdsdVpTQnpkSGxzWlM1Y2JpQWdJQ292WEc0Z0lIVnVaR1Z5YkdsdVpTRTZJRk4wZVd4bFpGTjBjbWx1Wnp0Y2JseHVJQ0F2S2lwY2JpQWdJQ29nUUdSbGMyTnlhWEIwYVc5dUlFRndjR3hwWlhNZ1lteHBibXRwYm1jZ2MzUjViR1VnZEc4Z2RHaGxJSFJsZUhRdVhHNGdJQ0FxSUVCemRXMXRZWEo1SUVkbGRIUmxjaUIwYUdGMElISmxkSFZ5Ym5NZ1lTQnVaWGNnVTNSNWJHVmtVM1J5YVc1bklIZHBkR2dnWW14cGJtdHBibWNnYzNSNWJHVXVYRzRnSUNBcUwxeHVJQ0JpYkdsdWF5RTZJRk4wZVd4bFpGTjBjbWx1Wnp0Y2JseHVJQ0F2S2lwY2JpQWdJQ29nUUdSbGMyTnlhWEIwYVc5dUlFbHVkbVZ5ZEhNZ2RHaGxJR1p2Y21WbmNtOTFibVFnWVc1a0lHSmhZMnRuY205MWJtUWdZMjlzYjNKeklHOW1JSFJvWlNCMFpYaDBMbHh1SUNBZ0tpQkFjM1Z0YldGeWVTQkhaWFIwWlhJZ2RHaGhkQ0J5WlhSMWNtNXpJR0VnYm1WM0lGTjBlV3hsWkZOMGNtbHVaeUIzYVhSb0lHbHVkbVZ5ZEdWa0lHTnZiRzl5Y3k1Y2JpQWdJQ292WEc0Z0lHbHVkbVZ5YzJVaE9pQlRkSGxzWldSVGRISnBibWM3WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRUJrWlhOamNtbHdkR2x2YmlCSWFXUmxjeUIwYUdVZ2RHVjRkQ0FvYzJGdFpTQmpiMnh2Y2lCaGN5QmlZV05yWjNKdmRXNWtLUzVjYmlBZ0lDb2dRSE4xYlcxaGNua2dSMlYwZEdWeUlIUm9ZWFFnY21WMGRYSnVjeUJoSUc1bGR5QlRkSGxzWldSVGRISnBibWNnZDJsMGFDQm9hV1JrWlc0Z2RHVjRkQzVjYmlBZ0lDb3ZYRzRnSUdocFpHUmxiaUU2SUZOMGVXeGxaRk4wY21sdVp6dGNibHh1SUNBdktpcGNiaUFnSUNvZ1FHUmxjMk55YVhCMGFXOXVJRUZ3Y0d4cFpYTWdjM1J5YVd0bGRHaHliM1ZuYUNCemRIbHNaU0IwYnlCMGFHVWdkR1Y0ZEM1Y2JpQWdJQ29nUUhOMWJXMWhjbmtnUjJWMGRHVnlJSFJvWVhRZ2NtVjBkWEp1Y3lCaElHNWxkeUJUZEhsc1pXUlRkSEpwYm1jZ2QybDBhQ0J6ZEhKcGEyVjBhSEp2ZFdkb0lITjBlV3hsTGx4dUlDQWdLaTljYmlBZ2MzUnlhV3RsZEdoeWIzVm5hQ0U2SUZOMGVXeGxaRk4wY21sdVp6dGNibHh1SUNBdktpcGNiaUFnSUNvZ1FHUmxjMk55YVhCMGFXOXVJRUZ3Y0d4cFpYTWdaRzkxWW14bElIVnVaR1Z5YkdsdVpTQnpkSGxzWlNCMGJ5QjBhR1VnZEdWNGRDNWNiaUFnSUNvZ1FITjFiVzFoY25rZ1IyVjBkR1Z5SUhSb1lYUWdjbVYwZFhKdWN5QmhJRzVsZHlCVGRIbHNaV1JUZEhKcGJtY2dkMmwwYUNCa2IzVmliR1VnZFc1a1pYSnNhVzVsSUhOMGVXeGxMbHh1SUNBZ0tpOWNiaUFnWkc5MVlteGxWVzVrWlhKc2FXNWxJVG9nVTNSNWJHVmtVM1J5YVc1bk8xeHVYRzRnSUM4cUtseHVJQ0FnS2lCQVpHVnpZM0pwY0hScGIyNGdVbVZ6WlhSeklIUm9aU0IwWlhoMElHTnZiRzl5SUhSdklHNXZjbTFoYkNCcGJuUmxibk5wZEhrdVhHNGdJQ0FxSUVCemRXMXRZWEo1SUVkbGRIUmxjaUIwYUdGMElISmxkSFZ5Ym5NZ1lTQnVaWGNnVTNSNWJHVmtVM1J5YVc1bklIZHBkR2dnYm05eWJXRnNJR052Ykc5eUlHbHVkR1Z1YzJsMGVTNWNiaUFnSUNvdlhHNGdJRzV2Y20xaGJFTnZiRzl5SVRvZ1UzUjViR1ZrVTNSeWFXNW5PMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkFaR1Z6WTNKcGNIUnBiMjRnVW1WdGIzWmxjeUJwZEdGc2FXTWdiM0lnWm5KaGEzUjFjaUJ6ZEhsc1pTQm1jbTl0SUhSb1pTQjBaWGgwTGx4dUlDQWdLaUJBYzNWdGJXRnllU0JIWlhSMFpYSWdkR2hoZENCeVpYUjFjbTV6SUdFZ2JtVjNJRk4wZVd4bFpGTjBjbWx1WnlCM2FYUm9JR2wwWVd4cFl5QnZjaUJtY21GcmRIVnlJSE4wZVd4bElISmxiVzkyWldRdVhHNGdJQ0FxTDF4dUlDQnViMGwwWVd4cFkwOXlSbkpoYTNSMWNpRTZJRk4wZVd4bFpGTjBjbWx1Wnp0Y2JseHVJQ0F2S2lwY2JpQWdJQ29nUUdSbGMyTnlhWEIwYVc5dUlGSmxiVzkyWlhNZ2RXNWtaWEpzYVc1bElITjBlV3hsSUdaeWIyMGdkR2hsSUhSbGVIUXVYRzRnSUNBcUlFQnpkVzF0WVhKNUlFZGxkSFJsY2lCMGFHRjBJSEpsZEhWeWJuTWdZU0J1WlhjZ1UzUjViR1ZrVTNSeWFXNW5JSGRwZEdnZ2RXNWtaWEpzYVc1bElITjBlV3hsSUhKbGJXOTJaV1F1WEc0Z0lDQXFMMXh1SUNCdWIxVnVaR1Z5YkdsdVpTRTZJRk4wZVd4bFpGTjBjbWx1Wnp0Y2JseHVJQ0F2S2lwY2JpQWdJQ29nUUdSbGMyTnlhWEIwYVc5dUlGSmxiVzkyWlhNZ1lteHBibXRwYm1jZ2MzUjViR1VnWm5KdmJTQjBhR1VnZEdWNGRDNWNiaUFnSUNvZ1FITjFiVzFoY25rZ1IyVjBkR1Z5SUhSb1lYUWdjbVYwZFhKdWN5QmhJRzVsZHlCVGRIbHNaV1JUZEhKcGJtY2dkMmwwYUNCaWJHbHVhMmx1WnlCemRIbHNaU0J5WlcxdmRtVmtMbHh1SUNBZ0tpOWNiaUFnYm05Q2JHbHVheUU2SUZOMGVXeGxaRk4wY21sdVp6dGNibHh1SUNBdktpcGNiaUFnSUNvZ1FHUmxjMk55YVhCMGFXOXVJRkpsYlc5MlpYTWdZMjlzYjNJZ2FXNTJaWEp6YVc5dUlHWnliMjBnZEdobElIUmxlSFF1WEc0Z0lDQXFJRUJ6ZFcxdFlYSjVJRWRsZEhSbGNpQjBhR0YwSUhKbGRIVnlibk1nWVNCdVpYY2dVM1I1YkdWa1UzUnlhVzVuSUhkcGRHZ2dZMjlzYjNJZ2FXNTJaWEp6YVc5dUlISmxiVzkyWldRdVhHNGdJQ0FxTDF4dUlDQnViMGx1ZG1WeWMyVWhPaUJUZEhsc1pXUlRkSEpwYm1jN1hHNWNiaUFnTHlvcVhHNGdJQ0FxSUVCa1pYTmpjbWx3ZEdsdmJpQlNaVzF2ZG1WeklHaHBaR1JsYmlCemRIbHNaU0JtY205dElIUm9aU0IwWlhoMExseHVJQ0FnS2lCQWMzVnRiV0Z5ZVNCSFpYUjBaWElnZEdoaGRDQnlaWFIxY201eklHRWdibVYzSUZOMGVXeGxaRk4wY21sdVp5QjNhWFJvSUdocFpHUmxiaUJ6ZEhsc1pTQnlaVzF2ZG1Wa0xseHVJQ0FnS2k5Y2JpQWdibTlJYVdSa1pXNGhPaUJUZEhsc1pXUlRkSEpwYm1jN1hHNWNiaUFnTHlvcVhHNGdJQ0FxSUVCa1pYTmpjbWx3ZEdsdmJpQlNaVzF2ZG1WeklITjBjbWxyWlhSb2NtOTFaMmdnYzNSNWJHVWdabkp2YlNCMGFHVWdkR1Y0ZEM1Y2JpQWdJQ29nUUhOMWJXMWhjbmtnUjJWMGRHVnlJSFJvWVhRZ2NtVjBkWEp1Y3lCaElHNWxkeUJUZEhsc1pXUlRkSEpwYm1jZ2QybDBhQ0J6ZEhKcGEyVjBhSEp2ZFdkb0lITjBlV3hsSUhKbGJXOTJaV1F1WEc0Z0lDQXFMMXh1SUNCdWIxTjBjbWxyWlhSb2NtOTFaMmdoT2lCVGRIbHNaV1JUZEhKcGJtYzdYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFQmtaWE5qY21sd2RHbHZiaUJVYUdVZ2RHVjRkRnh1SUNBZ0tpQkFjM1Z0YldGeWVTQlVhR1VnYzNSNWJHVmtJSFJsZUhRZ1lYTWdZU0J5WldkMWJHRnlJSE4wY21sdVp5NWNiaUFnSUNvdlhHNGdJSFJsZUhRaE9pQnpkSEpwYm1jN1hHNWNiaUFnWTI5dWMzUnlkV04wYjNJb2RHVjRkRG9nYzNSeWFXNW5LU0I3WEc0Z0lDQWdkR2hwY3k1MFpYaDBJRDBnZEdWNGREdGNiaUFnSUNBdkx5QkNZWE5wWXlCamIyeHZjbk5jYmlBZ0lDQlBZbXBsWTNRdVpXNTBjbWxsY3loVGRHRnVaR0Z5WkVadmNtVm5jbTkxYm1SRGIyeHZjbk1wTG1admNrVmhZMmdvS0Z0dVlXMWxMQ0JqYjJSbFhTa2dQVDRnZTF4dUlDQWdJQ0FnVDJKcVpXTjBMbVJsWm1sdVpWQnliM0JsY25SNUtIUm9hWE1zSUc1aGJXVXNJSHRjYmlBZ0lDQWdJQ0FnWjJWME9pQW9LU0E5UGlCMGFHbHpMbVp2Y21WbmNtOTFibVFvWTI5a1pTa3NYRzRnSUNBZ0lDQjlLVHRjYmlBZ0lDQjlLVHRjYmx4dUlDQWdJRTlpYW1WamRDNWxiblJ5YVdWektFSnlhV2RvZEVadmNtVm5jbTkxYm1SRGIyeHZjbk1wTG1admNrVmhZMmdvS0Z0dVlXMWxMQ0JqYjJSbFhTa2dQVDRnZTF4dUlDQWdJQ0FnVDJKcVpXTjBMbVJsWm1sdVpWQnliM0JsY25SNUtIUm9hWE1zSUc1aGJXVXNJSHRjYmlBZ0lDQWdJQ0FnWjJWME9pQW9LU0E5UGlCMGFHbHpMbVp2Y21WbmNtOTFibVFvWTI5a1pTa3NYRzRnSUNBZ0lDQjlLVHRjYmlBZ0lDQjlLVHRjYmx4dUlDQWdJQzh2SUVKaFkydG5jbTkxYm1RZ1kyOXNiM0p6WEc0Z0lDQWdUMkpxWldOMExtVnVkSEpwWlhNb1UzUmhibVJoY21SQ1lXTnJaM0p2ZFc1a1EyOXNiM0p6S1M1bWIzSkZZV05vS0NoYmJtRnRaU3dnWTI5a1pWMHBJRDArSUh0Y2JpQWdJQ0FnSUU5aWFtVmpkQzVrWldacGJtVlFjbTl3WlhKMGVTaDBhR2x6TENCdVlXMWxMQ0I3WEc0Z0lDQWdJQ0FnSUdkbGREb2dLQ2tnUFQ0Z2RHaHBjeTVpWVdOclozSnZkVzVrS0dOdlpHVXBMRnh1SUNBZ0lDQWdmU2s3WEc0Z0lDQWdmU2s3WEc1Y2JpQWdJQ0JQWW1wbFkzUXVaVzUwY21sbGN5aENjbWxuYUhSQ1lXTnJaM0p2ZFc1a1EyOXNiM0p6S1M1bWIzSkZZV05vS0NoYmJtRnRaU3dnWTI5a1pWMHBJRDArSUh0Y2JpQWdJQ0FnSUU5aWFtVmpkQzVrWldacGJtVlFjbTl3WlhKMGVTaDBhR2x6TENCdVlXMWxMQ0I3WEc0Z0lDQWdJQ0FnSUdkbGREb2dLQ2tnUFQ0Z2RHaHBjeTVpWVdOclozSnZkVzVrS0dOdlpHVXBMRnh1SUNBZ0lDQWdmU2s3WEc0Z0lDQWdmU2s3WEc1Y2JpQWdJQ0F2THlCVGRIbHNaWE5jYmlBZ0lDQlBZbXBsWTNRdVpXNTBjbWxsY3loemRIbHNaWE1wTG1admNrVmhZMmdvS0Z0dVlXMWxMQ0JqYjJSbFhTa2dQVDRnZTF4dUlDQWdJQ0FnVDJKcVpXTjBMbVJsWm1sdVpWQnliM0JsY25SNUtIUm9hWE1zSUc1aGJXVXNJSHRjYmlBZ0lDQWdJQ0FnWjJWME9pQW9LU0E5UGlCMGFHbHpMbk4wZVd4bEtHTnZaR1VwTEZ4dUlDQWdJQ0FnZlNrN1hHNGdJQ0FnZlNrN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRR1JsYzJOeWFYQjBhVzl1SUVOc1pXRnljeUJoYkd3Z2MzUjViR2x1WnlCbWNtOXRJSFJvWlNCMFpYaDBMbHh1SUNBZ0tpQkFjM1Z0YldGeWVTQlNaVzF2ZG1WeklHRnNiQ0JCVGxOSklHTnZiRzl5SUdGdVpDQnpkSGxzWlNCamIyUmxjeUJtY205dElIUm9aU0IwWlhoMExseHVJQ0FnS2lCQWNtVjBkWEp1SUh0VGRIbHNaV1JUZEhKcGJtZDlJRlJvWlNCVGRIbHNaV1JUZEhKcGJtY2dhVzV6ZEdGdVkyVWdkMmwwYUNCamJHVmhjbVZrSUhOMGVXeHBibWN1WEc0Z0lDQXFMMXh1SUNCamJHVmhjaWdwT2lCVGRIbHNaV1JUZEhKcGJtY2dlMXh1SUNBZ0lIUm9hWE11ZEdWNGRDQTlJR05zWldGeUtIUm9hWE11ZEdWNGRDazdYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTTdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nUUdSbGMyTnlhWEIwYVc5dUlFRndjR3hwWlhNZ2NtRjNJRUZPVTBrZ1kyOWtaWE1nZEc4Z2RHaGxJSFJsZUhRdVhHNGdJQ0FxSUVCemRXMXRZWEo1SUVGc2JHOTNjeUJrYVhKbFkzUWdZWEJ3YkdsallYUnBiMjRnYjJZZ1FVNVRTU0JsYzJOaGNHVWdjMlZ4ZFdWdVkyVnpJSFJ2SUhSb1pTQjBaWGgwTGx4dUlDQWdLaUJBY0dGeVlXMGdlM04wY21sdVozMGdjbUYzUVc1emFTQXRJRlJvWlNCeVlYY2dRVTVUU1NCbGMyTmhjR1VnYzJWeGRXVnVZMlVnZEc4Z1lYQndiSGt1WEc0Z0lDQXFJRUJ5WlhSMWNtNGdlMU4wZVd4bFpGTjBjbWx1WjMwZ1ZHaGxJRk4wZVd4bFpGTjBjbWx1WnlCcGJuTjBZVzVqWlNCM2FYUm9JSFJvWlNCeVlYY2dRVTVUU1NCamIyUmxJR0Z3Y0d4cFpXUXVYRzRnSUNBcUwxeHVJQ0J5WVhjb2NtRjNRVzV6YVRvZ2MzUnlhVzVuS1RvZ1UzUjViR1ZrVTNSeWFXNW5JSHRjYmlBZ0lDQjBhR2x6TG5SbGVIUWdQU0J5WVhjb2RHaHBjeTUwWlhoMExDQnlZWGRCYm5OcEtUdGNiaUFnSUNCeVpYUjFjbTRnZEdocGN6dGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJBWkdWelkzSnBjSFJwYjI0Z1FYQndiR2xsY3lCaElHWnZjbVZuY205MWJtUWdZMjlzYjNJZ2RHOGdkR2hsSUhSbGVIUXVYRzRnSUNBcUlFQnpkVzF0WVhKNUlGTmxkSE1nZEdobElIUmxlSFFnWTI5c2IzSWdkWE5wYm1jZ1FVNVRTU0JqYjJ4dmNpQmpiMlJsY3k1Y2JpQWdJQ29nUUhCaGNtRnRJSHR1ZFcxaVpYSjlJRzRnTFNCVWFHVWdRVTVUU1NCamIyeHZjaUJqYjJSbElHWnZjaUIwYUdVZ1ptOXlaV2R5YjNWdVpDQmpiMnh2Y2k1Y2JpQWdJQ29nUUhKbGRIVnliaUI3VTNSNWJHVmtVM1J5YVc1bmZTQlVhR1VnVTNSNWJHVmtVM1J5YVc1bklHbHVjM1JoYm1ObElIZHBkR2dnZEdobElHWnZjbVZuY205MWJtUWdZMjlzYjNJZ1lYQndiR2xsWkM1Y2JpQWdJQ292WEc0Z0lHWnZjbVZuY205MWJtUW9iam9nYm5WdFltVnlLVG9nVTNSNWJHVmtVM1J5YVc1bklIdGNiaUFnSUNCMGFHbHpMblJsZUhRZ1BTQmpiMnh2Y21sNlpVRk9VMGtvZEdocGN5NTBaWGgwTENCdUtUdGNiaUFnSUNCeVpYUjFjbTRnZEdocGN6dGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJBWkdWelkzSnBjSFJwYjI0Z1FYQndiR2xsY3lCaElHSmhZMnRuY205MWJtUWdZMjlzYjNJZ2RHOGdkR2hsSUhSbGVIUXVYRzRnSUNBcUlFQnpkVzF0WVhKNUlGTmxkSE1nZEdobElHSmhZMnRuY205MWJtUWdZMjlzYjNJZ2IyWWdkR2hsSUhSbGVIUWdkWE5wYm1jZ1FVNVRTU0JqYjJ4dmNpQmpiMlJsY3k1Y2JpQWdJQ29nUUhCaGNtRnRJSHR1ZFcxaVpYSjlJRzRnTFNCVWFHVWdRVTVUU1NCamIyeHZjaUJqYjJSbElHWnZjaUIwYUdVZ1ltRmphMmR5YjNWdVpDQmpiMnh2Y2k1Y2JpQWdJQ29nUUhKbGRIVnliaUI3VTNSNWJHVmtVM1J5YVc1bmZTQlVhR1VnVTNSNWJHVmtVM1J5YVc1bklHbHVjM1JoYm1ObElIZHBkR2dnZEdobElHSmhZMnRuY205MWJtUWdZMjlzYjNJZ1lYQndiR2xsWkM1Y2JpQWdJQ292WEc0Z0lHSmhZMnRuY205MWJtUW9iam9nYm5WdFltVnlLVG9nVTNSNWJHVmtVM1J5YVc1bklIdGNiaUFnSUNCMGFHbHpMblJsZUhRZ1BTQmpiMnh2Y21sNlpVRk9VMGtvZEdocGN5NTBaWGgwTENCdUxDQjBjblZsS1R0Y2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3p0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkFaR1Z6WTNKcGNIUnBiMjRnUVhCd2JHbGxjeUJoSUhSbGVIUWdjM1I1YkdVZ2RHOGdkR2hsSUhOMGNtbHVaeTVjYmlBZ0lDb2dRSE4xYlcxaGNua2dVMlYwY3lCMFpYaDBJSE4wZVd4bGN5QnpkV05vSUdGeklHSnZiR1FzSUdsMFlXeHBZeXdnYjNJZ2RXNWtaWEpzYVc1bElIVnphVzVuSUVGT1Uwa2djM1I1YkdVZ1kyOWtaWE11WEc0Z0lDQXFJRUJ3WVhKaGJTQjdiblZ0WW1WeUlId2djM1J5YVc1bmZTQnVJQzBnVkdobElITjBlV3hsSUdOdlpHVWdiM0lnYTJWNUlHWnliMjBnZEdobElITjBlV3hsY3lCdlltcGxZM1F1WEc0Z0lDQXFJRUJ5WlhSMWNtNGdlMU4wZVd4bFpGTjBjbWx1WjMwZ1ZHaGxJRk4wZVd4bFpGTjBjbWx1WnlCcGJuTjBZVzVqWlNCM2FYUm9JSFJvWlNCemRIbHNaU0JoY0hCc2FXVmtMbHh1SUNBZ0tpOWNiaUFnYzNSNWJHVW9iam9nYm5WdFltVnlJSHdnYTJWNWIyWWdkSGx3Wlc5bUlITjBlV3hsY3lrNklGTjBlV3hsWkZOMGNtbHVaeUI3WEc0Z0lDQWdhV1lnS0hSNWNHVnZaaUJ1SUQwOVBTQmNJbk4wY21sdVoxd2lJQ1ltSUNFb2JpQnBiaUJ6ZEhsc1pYTXBLU0I3WEc0Z0lDQWdJQ0JqYjI1emIyeGxMbmRoY200b1lFbHVkbUZzYVdRZ2MzUjViR1U2SUNSN2JuMWdLVHRjYmlBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TzF4dUlDQWdJSDFjYmlBZ0lDQjBhR2x6TG5SbGVIUWdQU0JoY0hCc2VWTjBlV3hsS0hSb2FYTXVkR1Y0ZEN3Z2JpazdYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTTdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nUUdSbGMyTnlhWEIwYVc5dUlFRndjR3hwWlhNZ1lTQXlOVFl0WTI5c2IzSWdabTl5WldkeWIzVnVaQ0JqYjJ4dmNpQjBieUIwYUdVZ2RHVjRkQzVjYmlBZ0lDb2dRSE4xYlcxaGNua2dVMlYwY3lCMGFHVWdkR1Y0ZENCamIyeHZjaUIxYzJsdVp5QjBhR1VnWlhoMFpXNWtaV1FnTWpVMkxXTnZiRzl5SUhCaGJHVjBkR1V1WEc0Z0lDQXFJRUJ3WVhKaGJTQjdiblZ0WW1WeWZTQnVJQzBnVkdobElHTnZiRzl5SUc1MWJXSmxjaUJtY205dElIUm9aU0F5TlRZdFkyOXNiM0lnY0dGc1pYUjBaUzVjYmlBZ0lDb2dRSEpsZEhWeWJpQjdVM1I1YkdWa1UzUnlhVzVuZlNCVWFHVWdVM1I1YkdWa1UzUnlhVzVuSUdsdWMzUmhibU5sSUhkcGRHZ2dkR2hsSURJMU5pMWpiMnh2Y2lCbWIzSmxaM0p2ZFc1a0lHRndjR3hwWldRdVhHNGdJQ0FxTDF4dUlDQmpiMnh2Y2pJMU5paHVPaUJ1ZFcxaVpYSXBPaUJUZEhsc1pXUlRkSEpwYm1jZ2UxeHVJQ0FnSUhSb2FYTXVkR1Y0ZENBOUlHTnZiRzl5YVhwbE1qVTJLSFJvYVhNdWRHVjRkQ3dnYmlrN1hHNGdJQ0FnY21WMGRYSnVJSFJvYVhNN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRR1JsYzJOeWFYQjBhVzl1SUVGd2NHeHBaWE1nWVNBeU5UWXRZMjlzYjNJZ1ltRmphMmR5YjNWdVpDQmpiMnh2Y2lCMGJ5QjBhR1VnZEdWNGRDNWNiaUFnSUNvZ1FITjFiVzFoY25rZ1UyVjBjeUIwYUdVZ1ltRmphMmR5YjNWdVpDQmpiMnh2Y2lCMWMybHVaeUIwYUdVZ1pYaDBaVzVrWldRZ01qVTJMV052Ykc5eUlIQmhiR1YwZEdVdVhHNGdJQ0FxSUVCd1lYSmhiU0I3Ym5WdFltVnlmU0J1SUMwZ1ZHaGxJR052Ykc5eUlHNTFiV0psY2lCbWNtOXRJSFJvWlNBeU5UWXRZMjlzYjNJZ2NHRnNaWFIwWlM1Y2JpQWdJQ29nUUhKbGRIVnliaUI3VTNSNWJHVmtVM1J5YVc1bmZTQlVhR1VnVTNSNWJHVmtVM1J5YVc1bklHbHVjM1JoYm1ObElIZHBkR2dnZEdobElESTFOaTFqYjJ4dmNpQmlZV05yWjNKdmRXNWtJR0Z3Y0d4cFpXUXVYRzRnSUNBcUwxeHVJQ0JpWjBOdmJHOXlNalUyS0c0NklHNTFiV0psY2lrNklGTjBlV3hsWkZOMGNtbHVaeUI3WEc0Z0lDQWdkR2hwY3k1MFpYaDBJRDBnWTI5c2IzSnBlbVV5TlRZb2RHaHBjeTUwWlhoMExDQnVMQ0IwY25WbEtUdGNiaUFnSUNCeVpYUjFjbTRnZEdocGN6dGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJBWkdWelkzSnBjSFJwYjI0Z1FYQndiR2xsY3lCaGJpQlNSMElnWm05eVpXZHliM1Z1WkNCamIyeHZjaUIwYnlCMGFHVWdkR1Y0ZEM1Y2JpQWdJQ29nUUhOMWJXMWhjbmtnVTJWMGN5QjBhR1VnZEdWNGRDQmpiMnh2Y2lCMWMybHVaeUJTUjBJZ2RtRnNkV1Z6TGx4dUlDQWdLaUJBY0dGeVlXMGdlMjUxYldKbGNuMGdjaUF0SUZSb1pTQnlaV1FnWTI5dGNHOXVaVzUwSUNnd0xUSTFOU2t1WEc0Z0lDQXFJRUJ3WVhKaGJTQjdiblZ0WW1WeWZTQm5JQzBnVkdobElHZHlaV1Z1SUdOdmJYQnZibVZ1ZENBb01DMHlOVFVwTGx4dUlDQWdLaUJBY0dGeVlXMGdlMjUxYldKbGNuMGdZaUF0SUZSb1pTQmliSFZsSUdOdmJYQnZibVZ1ZENBb01DMHlOVFVwTGx4dUlDQWdLaUJBY21WMGRYSnVJSHRUZEhsc1pXUlRkSEpwYm1kOUlGUm9aU0JUZEhsc1pXUlRkSEpwYm1jZ2FXNXpkR0Z1WTJVZ2QybDBhQ0IwYUdVZ1VrZENJR1p2Y21WbmNtOTFibVFnWTI5c2IzSWdZWEJ3YkdsbFpDNWNiaUFnSUNvdlhHNGdJSEpuWWloeU9pQnVkVzFpWlhJc0lHYzZJRzUxYldKbGNpd2dZam9nYm5WdFltVnlLVG9nVTNSNWJHVmtVM1J5YVc1bklIdGNiaUFnSUNCMGFHbHpMblJsZUhRZ1BTQmpiMnh2Y21sNlpWSkhRaWgwYUdsekxuUmxlSFFzSUhJc0lHY3NJR0lwTzF4dUlDQWdJSEpsZEhWeWJpQjBhR2x6TzF4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFQmtaWE5qY21sd2RHbHZiaUJCY0hCc2FXVnpJR0Z1SUZKSFFpQmlZV05yWjNKdmRXNWtJR052Ykc5eUlIUnZJSFJvWlNCMFpYaDBMbHh1SUNBZ0tpQkFjM1Z0YldGeWVTQlRaWFJ6SUhSb1pTQmlZV05yWjNKdmRXNWtJR052Ykc5eUlIVnphVzVuSUZKSFFpQjJZV3gxWlhNdVhHNGdJQ0FxSUVCd1lYSmhiU0I3Ym5WdFltVnlmU0J5SUMwZ1ZHaGxJSEpsWkNCamIyMXdiMjVsYm5RZ0tEQXRNalUxS1M1Y2JpQWdJQ29nUUhCaGNtRnRJSHR1ZFcxaVpYSjlJR2NnTFNCVWFHVWdaM0psWlc0Z1kyOXRjRzl1Wlc1MElDZ3dMVEkxTlNrdVhHNGdJQ0FxSUVCd1lYSmhiU0I3Ym5WdFltVnlmU0JpSUMwZ1ZHaGxJR0pzZFdVZ1kyOXRjRzl1Wlc1MElDZ3dMVEkxTlNrdVhHNGdJQ0FxSUVCeVpYUjFjbTRnZTFOMGVXeGxaRk4wY21sdVozMGdWR2hsSUZOMGVXeGxaRk4wY21sdVp5QnBibk4wWVc1alpTQjNhWFJvSUhSb1pTQlNSMElnWW1GamEyZHliM1Z1WkNCamIyeHZjaUJoY0hCc2FXVmtMbHh1SUNBZ0tpOWNiaUFnWW1kU1oySW9jam9nYm5WdFltVnlMQ0JuT2lCdWRXMWlaWElzSUdJNklHNTFiV0psY2lrNklGTjBlV3hsWkZOMGNtbHVaeUI3WEc0Z0lDQWdkR2hwY3k1MFpYaDBJRDBnWTI5c2IzSnBlbVZTUjBJb2RHaHBjeTUwWlhoMExDQnlMQ0JuTENCaUxDQjBjblZsS1R0Y2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3p0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkFaR1Z6WTNKcGNIUnBiMjRnUTI5dWRtVnlkSE1nZEdobElGTjBlV3hsWkZOMGNtbHVaeUIwYnlCaElISmxaM1ZzWVhJZ2MzUnlhVzVuTGx4dUlDQWdLaUJBYzNWdGJXRnllU0JTWlhSMWNtNXpJSFJvWlNCMWJtUmxjbXg1YVc1bklIUmxlSFFnZDJsMGFDQmhiR3dnWVhCd2JHbGxaQ0J6ZEhsc2FXNW5MbHh1SUNBZ0tpQkFjbVYwZFhKdUlIdHpkSEpwYm1kOUlGUm9aU0J6ZEhsc1pXUWdkR1Y0ZENCaGN5QmhJSEpsWjNWc1lYSWdjM1J5YVc1bkxseHVJQ0FnS2k5Y2JpQWdkRzlUZEhKcGJtY29LVG9nYzNSeWFXNW5JSHRjYmlBZ0lDQnlaWFIxY200Z2RHaHBjeTUwWlhoME8xeHVJQ0I5WEc1OVhHNWNiaThxS2x4dUlDb2dRR1JsYzJOeWFYQjBhVzl1SUVGd2NHeHBaWE1nYzNSNWJHbHVaeUIwYnlCaElHZHBkbVZ1SUhSbGVIUWdjM1J5YVc1bkxseHVJQ29nUUhOMWJXMWhjbmtnVkdocGN5Qm1kVzVqZEdsdmJpQjBZV3RsY3lCaElITjBjbWx1WnlCaGJtUWdjbVYwZFhKdWN5QmhJRk4wZVd4bFpGTjBjbWx1WnlCdlltcGxZM1FzSUhkb2FXTm9JR2x6SUdGdUlHVnVhR0Z1WTJWa1hHNGdLaUIyWlhKemFXOXVJRzltSUhSb1pTQnZjbWxuYVc1aGJDQnpkSEpwYm1jZ2QybDBhQ0JoWkdScGRHbHZibUZzSUcxbGRHaHZaSE1nWm05eUlHRndjR3g1YVc1bklIWmhjbWx2ZFhNZ1FVNVRTU0JqYjJ4dmNpQmhibVFnYzNSNWJHVmNiaUFxSUc5d2RHbHZibk11SUVsMElITmxkSE1nZFhBZ1lTQnRZWEJ3WlhJZ2IySnFaV04wSUhkcGRHZ2diV1YwYUc5a2N5Qm1iM0lnWkdsbVptVnlaVzUwSUhOMGVXeHBibWNnYjNCbGNtRjBhVzl1Y3lCaGJtUWdkR2hsYmx4dUlDb2daR1ZtYVc1bGN5QndjbTl3WlhKMGFXVnpJRzl1SUhSb1pTQjBaWGgwSUhOMGNtbHVaeUIwYnlCdFlXdGxJSFJvWlhObElHMWxkR2h2WkhNZ1lXTmpaWE56YVdKc1pTNWNiaUFxWEc0Z0tpQkFjR0Z5WVcwZ2UzTjBjbWx1WjF0ZGZTQjBJQ0JVYUdVZ2FXNXdkWFFnZEdWNGRDQjBieUJpWlNCemRIbHNaV1F1WEc0Z0tpQkFjbVYwZFhKdUlIdFRkSGxzWldSVGRISnBibWQ5SUVFZ1UzUjViR1ZrVTNSeWFXNW5JRzlpYW1WamRDQjNhWFJvSUdGa1pHbDBhVzl1WVd3Z2MzUjViR2x1WnlCdFpYUm9iMlJ6TGx4dUlDcGNiaUFxSUVCbWRXNWpkR2x2YmlCemRIbHNaVnh1SUNwY2JpQXFJRUJ0WlcxaVpYSlBaaUJUZEhsc1pXUlRkSEpwYm1kY2JpQXFMMXh1Wlhod2IzSjBJR1oxYm1OMGFXOXVJSE4wZVd4bEtDNHVMblE2SUhOMGNtbHVaMXRkS1RvZ1UzUjViR1ZrVTNSeWFXNW5JSHRjYmlBZ2NtVjBkWEp1SUc1bGR5QlRkSGxzWldSVGRISnBibWNvZEM1cWIybHVLRndpSUZ3aUtTazdYRzU5SWwxOVxuIiwiLyoqXG4gKiBAZGVzY3JpcHRpb24gR2xvYmFsIGtleSB1c2VkIHRvIHN0b3JlIGVudmlyb25tZW50IHZhcmlhYmxlcyBpbiBicm93c2VyIGNvbnRleHRzLlxuICogQHN1bW1hcnkgRW5hYmxlcyB0aGUgbG9nZ2luZyBlbnZpcm9ubWVudCBoZWxwZXJzIHRvIGxvY2F0ZSBzZXJpYWxpemVkIGVudmlyb25tZW50IGNvbmZpZ3VyYXRpb24gb24gYGdsb2JhbFRoaXNgLlxuICogQGNvbnN0IEJyb3dzZXJFbnZLZXlcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKiBAbWVtYmVyT2YgbW9kdWxlOkxvZ2dpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IEJyb3dzZXJFbnZLZXkgPSBcIkVOVlwiO1xuLyoqXG4gKiBAZGVzY3JpcHRpb24gRGVsaW1pdGVyIHVzZWQgZm9yIGNvbXBvc2luZyBuZXN0ZWQgZW52aXJvbm1lbnQgdmFyaWFibGUgbmFtZXMuXG4gKiBAc3VtbWFyeSBKb2lucyBwYXJlbnQgYW5kIGNoaWxkIGtleXMgd2hlbiBtYXBwaW5nIG9iamVjdCBwYXRocyB0byBFTlYgc3RyaW5ncy5cbiAqIEBjb25zdCBFTlZfUEFUSF9ERUxJTUlURVJcbiAqIEB0eXBlIHtzdHJpbmd9XG4gKiBAbWVtYmVyT2YgbW9kdWxlOkxvZ2dpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IEVOVl9QQVRIX0RFTElNSVRFUiA9IFwiX19cIjtcbi8qKlxuICogQGRlc2NyaXB0aW9uIERlZmF1bHQgcHJlZml4IGFuZCBzdWZmaXggdXNlZCBmb3IgdGVtcGxhdGUgcGxhY2Vob2xkZXJzLlxuICogQHN1bW1hcnkgUHJvdmlkZXMgd3JhcHBlciBzdHJpbmdzIGFwcGxpZWQgd2hlbiBpbnRlcnBvbGF0aW5nIG1lc3NhZ2VzIHdpdGgge0BsaW5rIHBhdGNoUGxhY2Vob2xkZXJzfS5cbiAqIEBjb25zdCBEZWZhdWx0UGxhY2Vob2xkZXJXcmFwcGVyc1xuICogQHR5cGUge3N0cmluZ1tdfVxuICogQG1lbWJlck9mIG1vZHVsZTpMb2dnaW5nXG4gKi9cbmV4cG9ydCBjb25zdCBEZWZhdWx0UGxhY2Vob2xkZXJXcmFwcGVycyA9IFtcIiR7XCIsIFwifVwiXTtcbi8qKlxuICogQGRlc2NyaXB0aW9uIEVudW0gZm9yIGxvZyBsZXZlbHMuXG4gKiBAc3VtbWFyeSBEZWZpbmVzIGRpZmZlcmVudCBsZXZlbHMgb2YgbG9nZ2luZyBmb3IgdGhlIGFwcGxpY2F0aW9uLlxuICogQGVudW0ge3N0cmluZ31cbiAqIEByZWFkb25seVxuICogQG1lbWJlck9mIG1vZHVsZTpMb2dnaW5nXG4gKi9cbmV4cG9ydCB2YXIgTG9nTGV2ZWw7XG4oZnVuY3Rpb24gKExvZ0xldmVsKSB7XG4gICAgLyoqIEBkZXNjcmlwdGlvbiBCZW5jaG1hcmsgZXZlbnRzIHRoYXQgY2FwdHVyZSBwZXJmb3JtYW5jZSBtZXRyaWNzLiAqL1xuICAgIExvZ0xldmVsW1wiYmVuY2htYXJrXCJdID0gXCJiZW5jaG1hcmtcIjtcbiAgICAvKiogQGRlc2NyaXB0aW9uIEVycm9yIGV2ZW50cyB0aGF0IGluZGljYXRlIGZhaWx1cmVzIHJlcXVpcmluZyBhdHRlbnRpb24uICovXG4gICAgTG9nTGV2ZWxbXCJlcnJvclwiXSA9IFwiZXJyb3JcIjtcbiAgICAvKiogQGRlc2NyaXB0aW9uIFdhcm5pbmcgZXZlbnRzIHRoYXQgbWF5IGluZGljYXRlIGlzc3Vlcy4gKi9cbiAgICBMb2dMZXZlbFtcIndhcm5cIl0gPSBcIndhcm5cIjtcbiAgICAvKiogQGRlc2NyaXB0aW9uIEluZm9ybWF0aW9uYWwgZXZlbnRzIGRlc2NyaWJpbmcgbm9ybWFsIG9wZXJhdGlvbi4gKi9cbiAgICBMb2dMZXZlbFtcImluZm9cIl0gPSBcImluZm9cIjtcbiAgICAvKiogQGRlc2NyaXB0aW9uIFZlcmJvc2UgZGlhZ25vc3RpYyBpbmZvcm1hdGlvbiBmb3IgZGV0YWlsZWQgdHJhY2luZy4gKi9cbiAgICBMb2dMZXZlbFtcInZlcmJvc2VcIl0gPSBcInZlcmJvc2VcIjtcbiAgICAvKiogQGRlc2NyaXB0aW9uIERlYnVnIG9yIHRyYWNlIGRldGFpbHMgYWltZWQgYXQgZGV2ZWxvcGVycy4gKi9cbiAgICBMb2dMZXZlbFtcImRlYnVnXCJdID0gXCJkZWJ1Z1wiO1xuICAgIC8qKiBAZGVzY3JpcHRpb24gdHJhY2UgZGV0YWlscyBhaW1lZCBhdCBkZXZlbG9wZXJzICovXG4gICAgTG9nTGV2ZWxbXCJ0cmFjZVwiXSA9IFwidHJhY2VcIjtcbiAgICAvKiogQGRlc2NyaXB0aW9uIEV4dHJlbWVseSBjaGF0dHkgb3IgcGxheWZ1bCBsb2cgZW50cmllcy4gKi9cbiAgICBMb2dMZXZlbFtcInNpbGx5XCJdID0gXCJzaWxseVwiO1xufSkoTG9nTGV2ZWwgfHwgKExvZ0xldmVsID0ge30pKTtcbi8qKlxuICogQGRlc2NyaXB0aW9uIE51bWVyaWMgdmFsdWVzIGFzc29jaWF0ZWQgd2l0aCBsb2cgbGV2ZWxzLlxuICogQHN1bW1hcnkgUHJvdmlkZXMgYSBudW1lcmljIHJlcHJlc2VudGF0aW9uIG9mIGxvZyBsZXZlbHMgZm9yIGNvbXBhcmlzb24gYW5kIGZpbHRlcmluZy5cbiAqIEB0eXBlZGVmIHtPYmplY3R9IE51bWVyaWNMb2dMZXZlbHNTaGFwZVxuICogQHByb3BlcnR5IHtudW1iZXJ9IGJlbmNobWFyayAtIE51bWVyaWMgdmFsdWUgZm9yIGJlbmNobWFyayBsZXZlbCAoMCkuXG4gKiBAcHJvcGVydHkge251bWJlcn0gZXJyb3IgLSBOdW1lcmljIHZhbHVlIGZvciBlcnJvciBsZXZlbCAoMikuXG4gKiBAcHJvcGVydHkge251bWJlcn0gaW5mbyAtIE51bWVyaWMgdmFsdWUgZm9yIGluZm8gbGV2ZWwgKDQpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IHZlcmJvc2UgLSBOdW1lcmljIHZhbHVlIGZvciB2ZXJib3NlIGxldmVsICg2KS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBkZWJ1ZyAtIE51bWVyaWMgdmFsdWUgZm9yIGRlYnVnIGxldmVsICg3KS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzaWxseSAtIE51bWVyaWMgdmFsdWUgZm9yIHNpbGx5IGxldmVsICg5KS5cbiAqIEBtZW1iZXJPZiBtb2R1bGU6TG9nZ2luZ1xuICovXG4vKipcbiAqIEBkZXNjcmlwdGlvbiBOdW1lcmljIHZhbHVlcyBhc3NvY2lhdGVkIHdpdGggbG9nIGxldmVscy5cbiAqIEBzdW1tYXJ5IFByb3ZpZGVzIGEgbnVtZXJpYyByZXByZXNlbnRhdGlvbiBvZiBsb2cgbGV2ZWxzIGZvciBjb21wYXJpc29uIGFuZCBmaWx0ZXJpbmcuXG4gKiBAY29uc3QgTnVtZXJpY0xvZ0xldmVsc1xuICogQHR5cGUge051bWVyaWNMb2dMZXZlbHNTaGFwZX1cbiAqIEBtZW1iZXJPZiBtb2R1bGU6TG9nZ2luZ1xuICovXG5leHBvcnQgY29uc3QgTnVtZXJpY0xvZ0xldmVscyA9IHtcbiAgICBiZW5jaG1hcms6IDAsXG4gICAgZXJyb3I6IDMsXG4gICAgd2FybjogNixcbiAgICBpbmZvOiA5LFxuICAgIHZlcmJvc2U6IDEyLFxuICAgIGRlYnVnOiAxNSxcbiAgICB0cmFjZTogMTgsXG4gICAgc2lsbHk6IDIxLFxufTtcbi8qKlxuICogQGRlc2NyaXB0aW9uIEVudW0gZm9yIGxvZ2dpbmcgb3V0cHV0IG1vZGVzLlxuICogQHN1bW1hcnkgRGVmaW5lcyBkaWZmZXJlbnQgb3V0cHV0IGZvcm1hdHMgZm9yIGxvZyBtZXNzYWdlcy5cbiAqIEBlbnVtIHtzdHJpbmd9XG4gKiBAbWVtYmVyT2YgbW9kdWxlOkxvZ2dpbmdcbiAqL1xuZXhwb3J0IHZhciBMb2dnaW5nTW9kZTtcbihmdW5jdGlvbiAoTG9nZ2luZ01vZGUpIHtcbiAgICAvKiogUmF3IHRleHQgZm9ybWF0IGZvciBodW1hbiByZWFkYWJpbGl0eSAqL1xuICAgIExvZ2dpbmdNb2RlW1wiUkFXXCJdID0gXCJyYXdcIjtcbiAgICAvKiogSlNPTiBmb3JtYXQgZm9yIG1hY2hpbmUgcGFyc2luZyAqL1xuICAgIExvZ2dpbmdNb2RlW1wiSlNPTlwiXSA9IFwianNvblwiO1xufSkoTG9nZ2luZ01vZGUgfHwgKExvZ2dpbmdNb2RlID0ge30pKTtcbi8qKlxuICogQGRlc2NyaXB0aW9uIERlZmF1bHQgdGhlbWUgZm9yIHN0eWxpbmcgbG9nIG91dHB1dC5cbiAqIEBzdW1tYXJ5IERlZmluZXMgdGhlIGRlZmF1bHQgY29sb3IgYW5kIHN0eWxlIHNldHRpbmdzIGZvciB2YXJpb3VzIGNvbXBvbmVudHMgb2YgbG9nIG1lc3NhZ2VzLlxuICogQHR5cGVkZWYge1RoZW1lfSBEZWZhdWx0VGhlbWVcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBjbGFzcyAtIFN0eWxpbmcgZm9yIGNsYXNzIG5hbWVzLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGNsYXNzLmZnIC0gRm9yZWdyb3VuZCBjb2xvciBjb2RlIGZvciBjbGFzcyBuYW1lcyAoMzQpLlxuICogQHByb3BlcnR5IHtPYmplY3R9IGlkIC0gU3R5bGluZyBmb3IgaWRlbnRpZmllcnMuXG4gKiBAcHJvcGVydHkge251bWJlcn0gaWQuZmcgLSBGb3JlZ3JvdW5kIGNvbG9yIGNvZGUgZm9yIGlkZW50aWZpZXJzICgzNikuXG4gKiBAcHJvcGVydHkge09iamVjdH0gc3RhY2sgLSBTdHlsaW5nIGZvciBzdGFjayB0cmFjZXMgKGVtcHR5IG9iamVjdCkuXG4gKiBAcHJvcGVydHkge09iamVjdH0gdGltZXN0YW1wIC0gU3R5bGluZyBmb3IgdGltZXN0YW1wcyAoZW1wdHkgb2JqZWN0KS5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBtZXNzYWdlIC0gU3R5bGluZyBmb3IgZGlmZmVyZW50IHR5cGVzIG9mIG1lc3NhZ2VzLlxuICogQHByb3BlcnR5IHtPYmplY3R9IG1lc3NhZ2UuZXJyb3IgLSBTdHlsaW5nIGZvciBlcnJvciBtZXNzYWdlcy5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBtZXNzYWdlLmVycm9yLmZnIC0gRm9yZWdyb3VuZCBjb2xvciBjb2RlIGZvciBlcnJvciBtZXNzYWdlcyAoMzEpLlxuICogQHByb3BlcnR5IHtPYmplY3R9IG1ldGhvZCAtIFN0eWxpbmcgZm9yIG1ldGhvZCBuYW1lcyAoZW1wdHkgb2JqZWN0KS5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBsb2dMZXZlbCAtIFN0eWxpbmcgZm9yIGRpZmZlcmVudCBsb2cgbGV2ZWxzLlxuICogQHByb3BlcnR5IHtPYmplY3R9IGxvZ0xldmVsLmVycm9yIC0gU3R5bGluZyBmb3IgZXJyb3IgbGV2ZWwgbG9ncy5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBsb2dMZXZlbC5lcnJvci5mZyAtIEZvcmVncm91bmQgY29sb3IgY29kZSBmb3IgZXJyb3IgbGV2ZWwgbG9ncyAoMzEpLlxuICogQHByb3BlcnR5IHtzdHJpbmdbXX0gbG9nTGV2ZWwuZXJyb3Iuc3R5bGUgLSBTdHlsZSBhdHRyaWJ1dGVzIGZvciBlcnJvciBsZXZlbCBsb2dzIChbXCJib2xkXCJdKS5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBsb2dMZXZlbC5pbmZvIC0gU3R5bGluZyBmb3IgaW5mbyBsZXZlbCBsb2dzIChlbXB0eSBvYmplY3QpLlxuICogQHByb3BlcnR5IHtPYmplY3R9IGxvZ0xldmVsLnZlcmJvc2UgLSBTdHlsaW5nIGZvciB2ZXJib3NlIGxldmVsIGxvZ3MgKGVtcHR5IG9iamVjdCkuXG4gKiBAcHJvcGVydHkge09iamVjdH0gbG9nTGV2ZWwuZGVidWcgLSBTdHlsaW5nIGZvciBkZWJ1ZyBsZXZlbCBsb2dzLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGxvZ0xldmVsLmRlYnVnLmZnIC0gRm9yZWdyb3VuZCBjb2xvciBjb2RlIGZvciBkZWJ1ZyBsZXZlbCBsb2dzICgzMykuXG4gKiBAY29uc3QgRGVmYXVsdFRoZW1lXG4gKiBAbWVtYmVyT2YgbW9kdWxlOkxvZ2dpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IERlZmF1bHRUaGVtZSA9IHtcbiAgICBhcHA6IHt9LFxuICAgIHNlcGFyYXRvcjoge30sXG4gICAgY2xhc3M6IHtcbiAgICAgICAgZmc6IDM0LFxuICAgIH0sXG4gICAgaWQ6IHtcbiAgICAgICAgZmc6IDM2LFxuICAgIH0sXG4gICAgc3RhY2s6IHt9LFxuICAgIHRpbWVzdGFtcDoge30sXG4gICAgbWVzc2FnZToge1xuICAgICAgICBlcnJvcjoge1xuICAgICAgICAgICAgZmc6IDMxLFxuICAgICAgICB9LFxuICAgIH0sXG4gICAgbWV0aG9kOiB7fSxcbiAgICBsb2dMZXZlbDoge1xuICAgICAgICBiZW5jaG1hcms6IHtcbiAgICAgICAgICAgIGZnOiAzMixcbiAgICAgICAgICAgIHN0eWxlOiBbXCJib2xkXCJdLFxuICAgICAgICB9LFxuICAgICAgICBlcnJvcjoge1xuICAgICAgICAgICAgZmc6IDMxLFxuICAgICAgICAgICAgc3R5bGU6IFtcImJvbGRcIl0sXG4gICAgICAgIH0sXG4gICAgICAgIGluZm86IHtcbiAgICAgICAgICAgIGZnOiAzNCxcbiAgICAgICAgICAgIHN0eWxlOiBbXCJib2xkXCJdLFxuICAgICAgICB9LFxuICAgICAgICB2ZXJib3NlOiB7XG4gICAgICAgICAgICBmZzogMzQsXG4gICAgICAgICAgICBzdHlsZTogW1wiYm9sZFwiXSxcbiAgICAgICAgfSxcbiAgICAgICAgZGVidWc6IHtcbiAgICAgICAgICAgIGZnOiAzMyxcbiAgICAgICAgICAgIHN0eWxlOiBbXCJib2xkXCJdLFxuICAgICAgICB9LFxuICAgICAgICB0cmFjZToge1xuICAgICAgICAgICAgZmc6IDMzLFxuICAgICAgICAgICAgc3R5bGU6IFtcImJvbGRcIl0sXG4gICAgICAgIH0sXG4gICAgICAgIHNpbGx5OiB7XG4gICAgICAgICAgICBmZzogMzMsXG4gICAgICAgICAgICBzdHlsZTogW1wiYm9sZFwiXSxcbiAgICAgICAgfSxcbiAgICB9LFxufTtcbi8qKlxuICogQGRlc2NyaXB0aW9uIERlZmF1bHQgY29uZmlndXJhdGlvbiBmb3IgbG9nZ2luZy5cbiAqIEBzdW1tYXJ5IERlZmluZXMgdGhlIGRlZmF1bHQgc2V0dGluZ3MgZm9yIHRoZSBsb2dnaW5nIHN5c3RlbSwgaW5jbHVkaW5nIHZlcmJvc2l0eSwgbG9nIGxldmVsLCBzdHlsaW5nLCBhbmQgdGltZXN0YW1wIGZvcm1hdC5cbiAqIEBjb25zdCBEZWZhdWx0TG9nZ2luZ0NvbmZpZ1xuICogQHR5cGVkZWYge0xvZ2dpbmdDb25maWd9IERlZmF1bHRMb2dnaW5nQ29uZmlnXG4gKiBAcHJvcGVydHkge251bWJlcn0gdmVyYm9zZSAtIFZlcmJvc2l0eSBsZXZlbCAoMCkuXG4gKiBAcHJvcGVydHkge0xvZ0xldmVsfSBsZXZlbCAtIERlZmF1bHQgbG9nIGxldmVsIChMb2dMZXZlbC5pbmZvKS5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gbG9nTGV2ZWwgLSBXaGV0aGVyIHRvIGRpc3BsYXkgbG9nIGxldmVsIGluIG91dHB1dCAodHJ1ZSkuXG4gKiBAcHJvcGVydHkge0xvZ2dpbmdNb2RlfSBtb2RlIC0gT3V0cHV0IGZvcm1hdCBtb2RlIChMb2dnaW5nTW9kZS5SQVcpLlxuICogQHByb3BlcnR5IHtib29sZWFufSBzdHlsZSAtIFdoZXRoZXIgdG8gYXBwbHkgc3R5bGluZyB0byBsb2cgb3V0cHV0IChmYWxzZSkuXG4gKiBAcHJvcGVydHkge3N0cmluZ30gc2VwYXJhdG9yIC0gU2VwYXJhdG9yIGJldHdlZW4gbG9nIGNvbXBvbmVudHMgKFwiIC0gXCIpLlxuICogQHByb3BlcnR5IHtib29sZWFufSB0aW1lc3RhbXAgLSBXaGV0aGVyIHRvIGluY2x1ZGUgdGltZXN0YW1wcyBpbiBsb2cgbWVzc2FnZXMgKHRydWUpLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IHRpbWVzdGFtcEZvcm1hdCAtIEZvcm1hdCBmb3IgdGltZXN0YW1wcyAoXCJISDptbTpzcy5TU1NcIikuXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGNvbnRleHQgLSBXaGV0aGVyIHRvIGluY2x1ZGUgY29udGV4dCBpbmZvcm1hdGlvbiBpbiBsb2cgbWVzc2FnZXMgKHRydWUpLlxuICogQHByb3BlcnR5IHtUaGVtZX0gdGhlbWUgLSBUaGUgdGhlbWUgdG8gdXNlIGZvciBzdHlsaW5nIGxvZyBtZXNzYWdlcyAoRGVmYXVsdFRoZW1lKS5cbiAqIEBtZW1iZXJPZiBtb2R1bGU6TG9nZ2luZ1xuICovXG5leHBvcnQgY29uc3QgRGVmYXVsdExvZ2dpbmdDb25maWcgPSB7XG4gICAgZW52OiBcImRldmVsb3BtZW50XCIsXG4gICAgdmVyYm9zZTogMCxcbiAgICBsZXZlbDogTG9nTGV2ZWwuaW5mbyxcbiAgICBsb2dMZXZlbDogdHJ1ZSxcbiAgICBzdHlsZTogZmFsc2UsXG4gICAgY29udGV4dFNlcGFyYXRvcjogXCIuXCIsXG4gICAgc2VwYXJhdG9yOiBcIi1cIixcbiAgICB0aW1lc3RhbXA6IHRydWUsXG4gICAgdGltZXN0YW1wRm9ybWF0OiBcIkhIOm1tOnNzLlNTU1wiLFxuICAgIGNvbnRleHQ6IHRydWUsXG4gICAgZm9ybWF0OiBMb2dnaW5nTW9kZS5SQVcsXG4gICAgcGF0dGVybjogXCJ7bGV2ZWx9IFt7dGltZXN0YW1wfV0ge2FwcH0ge2NvbnRleHR9IHtzZXBhcmF0b3J9IHttZXNzYWdlfSB7c3RhY2t9XCIsXG4gICAgdGhlbWU6IERlZmF1bHRUaGVtZSxcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb25zdGFudHMuanMubWFwIiwiaW1wb3J0IHsgRGVmYXVsdFBsYWNlaG9sZGVyV3JhcHBlcnMgfSBmcm9tIFwiLi9jb25zdGFudHMuanNcIjtcbi8qKlxuICogQGRlc2NyaXB0aW9uIFBhZHMgdGhlIGVuZCBvZiBhIHN0cmluZyB3aXRoIGEgc3BlY2lmaWVkIGNoYXJhY3Rlci5cbiAqIEBzdW1tYXJ5IEV4dGVuZHMgdGhlIGlucHV0IHN0cmluZyB0byBhIHNwZWNpZmllZCBsZW5ndGggYnkgYWRkaW5nIGEgcGFkZGluZyBjaGFyYWN0ZXIgdG8gdGhlIGVuZC5cbiAqIElmIHRoZSBpbnB1dCBzdHJpbmcgaXMgYWxyZWFkeSBsb25nZXIgdGhhbiB0aGUgc3BlY2lmaWVkIGxlbmd0aCwgaXQgaXMgcmV0dXJuZWQgdW5jaGFuZ2VkLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgLSBUaGUgaW5wdXQgc3RyaW5nIHRvIGJlIHBhZGRlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBsZW5ndGggLSBUaGUgZGVzaXJlZCB0b3RhbCBsZW5ndGggb2YgdGhlIHJlc3VsdGluZyBzdHJpbmcuXG4gKiBAcGFyYW0ge3N0cmluZ30gW2NoYXI9XCIgXCJdIC0gVGhlIGNoYXJhY3RlciB0byB1c2UgZm9yIHBhZGRpbmcuIERlZmF1bHRzIHRvIGEgc3BhY2UuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBwYWRkZWQgc3RyaW5nLlxuICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBwYWRkaW5nIGNoYXJhY3RlciBpcyBub3QgZXhhY3RseSBvbmUgY2hhcmFjdGVyIGxvbmcuXG4gKlxuICogQGZ1bmN0aW9uIHBhZEVuZFxuICpcbiAqIEBtZW1iZXJPZiBtb2R1bGU6TG9nZ2luZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gcGFkRW5kKHN0ciwgbGVuZ3RoLCBjaGFyID0gXCIgXCIpIHtcbiAgICBpZiAoY2hhci5sZW5ndGggIT09IDEpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgY2hhcmFjdGVyIGxlbmd0aCBmb3IgcGFkZGluZy4gbXVzdCBiZSBvbmUhXCIpO1xuICAgIHJldHVybiBzdHIucGFkRW5kKGxlbmd0aCwgY2hhcik7XG59XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBSZXBsYWNlcyBwbGFjZWhvbGRlcnMgaW4gYSBzdHJpbmcgd2l0aCBwcm92aWRlZCB2YWx1ZXMuXG4gKiBAc3VtbWFyeSBJbnRlcnBvbGF0ZXMgYSBzdHJpbmcgYnkgcmVwbGFjaW5nIHBsYWNlaG9sZGVycyBvZiB0aGUgZm9ybSAke3ZhcmlhYmxlTmFtZX1cbiAqIHdpdGggY29ycmVzcG9uZGluZyB2YWx1ZXMgZnJvbSB0aGUgcHJvdmlkZWQgb2JqZWN0LiBJZiBhIHBsYWNlaG9sZGVyIGRvZXNuJ3QgaGF2ZVxuICogYSBjb3JyZXNwb25kaW5nIHZhbHVlLCBpdCBpcyBsZWZ0IHVuY2hhbmdlZCBpbiB0aGUgc3RyaW5nLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBpbnB1dCAtIFRoZSBpbnB1dCBzdHJpbmcgY29udGFpbmluZyBwbGFjZWhvbGRlcnMgdG8gYmUgcmVwbGFjZWQuXG4gKiBAcGFyYW0ge1JlY29yZDxzdHJpbmcsIG51bWJlciB8IHN0cmluZz59IHZhbHVlcyAtIEFuIG9iamVjdCBjb250YWluaW5nIGtleS12YWx1ZSBwYWlycyBmb3IgcmVwbGFjZW1lbnQuXG4gKiBAcGFyYW0gcHJlZml4XG4gKiBAcGFyYW0gc3VmZml4XG4gKiBAcGFyYW0gZmxhZ3NcbiAqIEByZXR1cm4ge3N0cmluZ30gVGhlIGludGVycG9sYXRlZCBzdHJpbmcgd2l0aCBwbGFjZWhvbGRlcnMgcmVwbGFjZWQgYnkgdGhlaXIgY29ycmVzcG9uZGluZyB2YWx1ZXMuXG4gKlxuICogQGZ1bmN0aW9uIHBhdGNoUGxhY2Vob2xkZXJzXG4gKlxuICogQG1lcm1haWRcbiAqIHNlcXVlbmNlRGlhZ3JhbVxuICogICBwYXJ0aWNpcGFudCBDYWxsZXJcbiAqICAgcGFydGljaXBhbnQgcGF0Y2hTdHJpbmdcbiAqICAgcGFydGljaXBhbnQgU3RyaW5nLnJlcGxhY2VcbiAqICAgQ2FsbGVyLT4+cGF0Y2hTdHJpbmc6IENhbGwgd2l0aCBpbnB1dCBhbmQgdmFsdWVzXG4gKiAgIHBhdGNoU3RyaW5nLT4+U3RyaW5nLnJlcGxhY2U6IENhbGwgd2l0aCByZWdleCBhbmQgcmVwbGFjZW1lbnQgZnVuY3Rpb25cbiAqICAgU3RyaW5nLnJlcGxhY2UtPj5wYXRjaFN0cmluZzogUmV0dXJuIHJlcGxhY2VkIHN0cmluZ1xuICogICBwYXRjaFN0cmluZy0tPj5DYWxsZXI6IFJldHVybiBwYXRjaGVkIHN0cmluZ1xuICpcbiAqIEBtZW1iZXJPZiBtb2R1bGU6TG9nZ2luZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gcGF0Y2hQbGFjZWhvbGRlcnMoaW5wdXQsIHZhbHVlcywgcHJlZml4ID0gRGVmYXVsdFBsYWNlaG9sZGVyV3JhcHBlcnNbMF0sIHN1ZmZpeCA9IERlZmF1bHRQbGFjZWhvbGRlcldyYXBwZXJzWzFdLCBmbGFncyA9IFwiZ1wiKSB7XG4gICAgY29uc3QgcGxhY2Vob2xkZXJzID0gT2JqZWN0LmVudHJpZXModmFsdWVzKS5yZWR1Y2UoKGFjYywgW2tleSwgdmFsXSkgPT4ge1xuICAgICAgICBhY2NbYCR7cHJlZml4fSR7a2V5fSR7c3VmZml4fWBdID0gdmFsO1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbiAgICByZXR1cm4gcGF0Y2hTdHJpbmcoaW5wdXQsIHBsYWNlaG9sZGVycywgZmxhZ3MpO1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gUmVwbGFjZXMgb2NjdXJyZW5jZXMgb2Yga2V5cyB3aXRoIHRoZWlyIGNvcnJlc3BvbmRpbmcgdmFsdWVzIGluIGEgc3RyaW5nLlxuICogQHN1bW1hcnkgSXRlcmF0ZXMgdGhyb3VnaCBhIHNldCBvZiBrZXktdmFsdWUgcGFpcnMgYW5kIHJlcGxhY2VzIGFsbCBvY2N1cnJlbmNlcyBvZiBlYWNoIGtleVxuICogaW4gdGhlIGlucHV0IHN0cmluZyB3aXRoIGl0cyBjb3JyZXNwb25kaW5nIHZhbHVlLiBTdXBwb3J0cyByZWd1bGFyIGV4cHJlc3Npb24gZmxhZ3MgZm9yIGN1c3RvbWl6ZWQgcmVwbGFjZW1lbnQuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGlucHV0IC0gVGhlIGlucHV0IHN0cmluZyBpbiB3aGljaCByZXBsYWNlbWVudHMgd2lsbCBiZSBtYWRlLlxuICogQHBhcmFtIHtSZWNvcmQ8c3RyaW5nLCBudW1iZXIgfCBzdHJpbmc+fSB2YWx1ZXMgLSBBbiBvYmplY3QgY29udGFpbmluZyBrZXktdmFsdWUgcGFpcnMgZm9yIHJlcGxhY2VtZW50LlxuICogQHBhcmFtIHtzdHJpbmd9IFtmbGFncz1cImdcIl0gLSBSZWd1bGFyIGV4cHJlc3Npb24gZmxhZ3MgdG8gY29udHJvbCB0aGUgcmVwbGFjZW1lbnQgYmVoYXZpb3IuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBzdHJpbmcgd2l0aCBhbGwgc3BlY2lmaWVkIHJlcGxhY2VtZW50cyBhcHBsaWVkLlxuICpcbiAqIEBmdW5jdGlvbiBwYXRjaFN0cmluZ1xuICpcbiAqIEBtZW1iZXJPZiBtb2R1bGU6TG9nZ2luZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gcGF0Y2hTdHJpbmcoaW5wdXQsIHZhbHVlcywgZmxhZ3MgPSBcImdcIikge1xuICAgIE9iamVjdC5lbnRyaWVzKHZhbHVlcykuZm9yRWFjaCgoW2tleSwgdmFsXSkgPT4ge1xuICAgICAgICBjb25zdCByZWdleHAgPSBuZXcgUmVnRXhwKGVzY2FwZVJlZ0V4cChrZXkpLCBmbGFncyk7XG4gICAgICAgIGlucHV0ID0gaW5wdXQucmVwbGFjZShyZWdleHAsIHZhbCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGlucHV0O1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gQ29udmVydHMgYSBzdHJpbmcgdG8gY2FtZWxDYXNlLlxuICogQHN1bW1hcnkgVHJhbnNmb3JtcyB0aGUgaW5wdXQgc3RyaW5nIGludG8gY2FtZWxDYXNlIGZvcm1hdCwgd2hlcmUgd29yZHMgYXJlIGpvaW5lZCB3aXRob3V0IHNwYWNlc1xuICogYW5kIGVhY2ggd29yZCBhZnRlciB0aGUgZmlyc3Qgc3RhcnRzIHdpdGggYSBjYXBpdGFsIGxldHRlci5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRoZSBpbnB1dCBzdHJpbmcgdG8gYmUgY29udmVydGVkLlxuICogQHJldHVybiB7c3RyaW5nfSBUaGUgaW5wdXQgc3RyaW5nIGNvbnZlcnRlZCB0byBjYW1lbENhc2UuXG4gKlxuICogQGZ1bmN0aW9uIHRvQ2FtZWxDYXNlXG4gKlxuICogQG1lbWJlck9mIG1vZHVsZTpMb2dnaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b0NhbWVsQ2FzZSh0ZXh0KSB7XG4gICAgcmV0dXJuIHRleHRcbiAgICAgICAgLnJlcGxhY2UoLyg/Ol5cXHd8W0EtWl18XFxiXFx3KS9nLCAod29yZCwgaW5kZXgpID0+IGluZGV4ID09PSAwID8gd29yZC50b0xvd2VyQ2FzZSgpIDogd29yZC50b1VwcGVyQ2FzZSgpKVxuICAgICAgICAucmVwbGFjZSgvXFxzKy9nLCBcIlwiKTtcbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uIENvbnZlcnRzIGEgc3RyaW5nIHRvIEVOVklST05NRU5UX1ZBUklBQkxFIGZvcm1hdC5cbiAqIEBzdW1tYXJ5IFRyYW5zZm9ybXMgdGhlIGlucHV0IHN0cmluZyBpbnRvIHVwcGVyY2FzZSB3aXRoIHdvcmRzIHNlcGFyYXRlZCBieSB1bmRlcnNjb3JlcyxcbiAqIHR5cGljYWxseSB1c2VkIGZvciBlbnZpcm9ubWVudCB2YXJpYWJsZSBuYW1lcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRoZSBpbnB1dCBzdHJpbmcgdG8gYmUgY29udmVydGVkLlxuICogQHJldHVybiB7c3RyaW5nfSBUaGUgaW5wdXQgc3RyaW5nIGNvbnZlcnRlZCB0byBFTlZJUk9OTUVOVF9WQVJJQUJMRSBmb3JtYXQuXG4gKlxuICogQGZ1bmN0aW9uIHRvRU5WRm9ybWF0XG4gKlxuICogQG1lbWJlck9mIG1vZHVsZTpMb2dnaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b0VOVkZvcm1hdCh0ZXh0KSB7XG4gICAgcmV0dXJuIHRvU25ha2VDYXNlKHRleHQpLnRvVXBwZXJDYXNlKCk7XG59XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBDb252ZXJ0cyBhIHN0cmluZyB0byBzbmFrZV9jYXNlLlxuICogQHN1bW1hcnkgVHJhbnNmb3JtcyB0aGUgaW5wdXQgc3RyaW5nIGludG8gbG93ZXJjYXNlIHdpdGggd29yZHMgc2VwYXJhdGVkIGJ5IHVuZGVyc2NvcmVzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gVGhlIGlucHV0IHN0cmluZyB0byBiZSBjb252ZXJ0ZWQuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBpbnB1dCBzdHJpbmcgY29udmVydGVkIHRvIHNuYWtlX2Nhc2UuXG4gKlxuICogQGZ1bmN0aW9uIHRvU25ha2VDYXNlXG4gKlxuICogQG1lbWJlck9mIG1vZHVsZTpMb2dnaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b1NuYWtlQ2FzZSh0ZXh0KSB7XG4gICAgcmV0dXJuIHRleHRcbiAgICAgICAgLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csIFwiJDFfJDJcIilcbiAgICAgICAgLnJlcGxhY2UoL1tcXHMtXSsvZywgXCJfXCIpXG4gICAgICAgIC50b0xvd2VyQ2FzZSgpO1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gQ29udmVydHMgYSBzdHJpbmcgdG8ga2ViYWItY2FzZS5cbiAqIEBzdW1tYXJ5IFRyYW5zZm9ybXMgdGhlIGlucHV0IHN0cmluZyBpbnRvIGxvd2VyY2FzZSB3aXRoIHdvcmRzIHNlcGFyYXRlZCBieSBoeXBoZW5zLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gVGhlIGlucHV0IHN0cmluZyB0byBiZSBjb252ZXJ0ZWQuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBpbnB1dCBzdHJpbmcgY29udmVydGVkIHRvIGtlYmFiLWNhc2UuXG4gKlxuICogQGZ1bmN0aW9uIHRvS2ViYWJDYXNlXG4gKlxuICogQG1lbWJlck9mIG1vZHVsZTpMb2dnaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b0tlYmFiQ2FzZSh0ZXh0KSB7XG4gICAgcmV0dXJuIHRleHRcbiAgICAgICAgLnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csIFwiJDEtJDJcIilcbiAgICAgICAgLnJlcGxhY2UoL1tcXHNfXSsvZywgXCItXCIpXG4gICAgICAgIC50b0xvd2VyQ2FzZSgpO1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gQ29udmVydHMgYSBzdHJpbmcgdG8gUGFzY2FsQ2FzZS5cbiAqIEBzdW1tYXJ5IFRyYW5zZm9ybXMgdGhlIGlucHV0IHN0cmluZyBpbnRvIFBhc2NhbENhc2UgZm9ybWF0LCB3aGVyZSB3b3JkcyBhcmUgam9pbmVkIHdpdGhvdXQgc3BhY2VzXG4gKiBhbmQgZWFjaCB3b3JkIHN0YXJ0cyB3aXRoIGEgY2FwaXRhbCBsZXR0ZXIuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgLSBUaGUgaW5wdXQgc3RyaW5nIHRvIGJlIGNvbnZlcnRlZC5cbiAqIEByZXR1cm4ge3N0cmluZ30gVGhlIGlucHV0IHN0cmluZyBjb252ZXJ0ZWQgdG8gUGFzY2FsQ2FzZS5cbiAqXG4gKiBAZnVuY3Rpb24gdG9QYXNjYWxDYXNlXG4gKlxuICogQG1lbWJlck9mIG1vZHVsZTpMb2dnaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b1Bhc2NhbENhc2UodGV4dCkge1xuICAgIHJldHVybiB0ZXh0XG4gICAgICAgIC5yZXBsYWNlKC8oPzpeXFx3fFtBLVpdfFxcYlxcdykvZywgKHdvcmQpID0+IHdvcmQudG9VcHBlckNhc2UoKSlcbiAgICAgICAgLnJlcGxhY2UoL1xccysvZywgXCJcIik7XG59XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBFc2NhcGVzIHNwZWNpYWwgY2hhcmFjdGVycyBpbiBhIHN0cmluZyBmb3IgdXNlIGluIGEgcmVndWxhciBleHByZXNzaW9uLlxuICogQHN1bW1hcnkgQWRkcyBiYWNrc2xhc2hlcyBiZWZvcmUgY2hhcmFjdGVycyB0aGF0IGhhdmUgc3BlY2lhbCBtZWFuaW5nIGluIHJlZ3VsYXIgZXhwcmVzc2lvbnMsXG4gKiBhbGxvd2luZyB0aGUgc3RyaW5nIHRvIGJlIHVzZWQgYXMgYSBsaXRlcmFsIG1hdGNoIGluIGEgUmVnRXhwLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgLSBUaGUgc3RyaW5nIHRvIGVzY2FwZSBmb3IgcmVndWxhciBleHByZXNzaW9uIHVzZS5cbiAqIEByZXR1cm4ge3N0cmluZ30gVGhlIGVzY2FwZWQgc3RyaW5nIHNhZmUgZm9yIHVzZSBpbiByZWd1bGFyIGV4cHJlc3Npb25zLlxuICpcbiAqIEBmdW5jdGlvbiBlc2NhcGVSZWdFeHBcbiAqXG4gKiBAbWVtYmVyT2YgbW9kdWxlOkxvZ2dpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVzY2FwZVJlZ0V4cChzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCBcIlxcXFwkJlwiKTsgLy8gJCYgbWVhbnMgdGhlIHdob2xlIG1hdGNoZWQgc3RyaW5nXG59XG4vKipcbiAqIEBzdW1tYXJ5IFV0aWwgZnVuY3Rpb24gdG8gcHJvdmlkZSBzdHJpbmcgZm9ybWF0IGZ1bmN0aW9uYWxpdHkgc2ltaWxhciB0byBDIydzIHN0cmluZy5mb3JtYXRcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nXG4gKiBAcGFyYW0ge0FycmF5PHN0cmluZyB8IG51bWJlcj4gfCBSZWNvcmQ8c3RyaW5nLCBhbnk+fSBbYXJnc10gcmVwbGFjZW1lbnRzIG1hZGUgYnkgb3JkZXIgb2YgYXBwZWFyYW5jZSAocmVwbGFjZW1lbnQwIHdpbCByZXBsYWNlIHswfSBhbmQgc28gb24pXG4gKiBAcmV0dXJuIHtzdHJpbmd9IGZvcm1hdHRlZCBzdHJpbmdcbiAqXG4gKiBAZnVuY3Rpb24gc2ZcbiAqIEBtZW1iZXJPZiBtb2R1bGU6TG9nZ2luZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gc2Yoc3RyaW5nLCAuLi5hcmdzKSB7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID4gMSkge1xuICAgICAgICBpZiAoIWFyZ3MuZXZlcnkoKGFyZykgPT4gdHlwZW9mIGFyZyA9PT0gXCJzdHJpbmdcIiB8fCB0eXBlb2YgYXJnID09PSBcIm51bWJlclwiKSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgT25seSBzdHJpbmcgYW5kIG51bWJlciBhcmd1bWVudHMgYXJlIHN1cHBvcnRlZCBmb3IgbXVsdGlwbGUgcmVwbGFjZW1lbnRzLmApO1xuICAgIH1cbiAgICBpZiAoYXJncy5sZW5ndGggPT09IDEgJiYgdHlwZW9mIGFyZ3NbMF0gPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgY29uc3Qgb2JqID0gYXJnc1swXTtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKG9iaikucmVkdWNlKChhY2MsIFtrZXksIHZhbF0pID0+IHtcbiAgICAgICAgICAgIHJldHVybiBhY2MucmVwbGFjZShuZXcgUmVnRXhwKGBcXFxceyR7a2V5fVxcXFx9YCwgXCJnXCIpLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LCBzdHJpbmcpO1xuICAgIH1cbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoL3soXFxkKyl9L2csIGZ1bmN0aW9uIChtYXRjaCwgbnVtYmVyKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgYXJnc1tudW1iZXJdICE9PSBcInVuZGVmaW5lZFwiXG4gICAgICAgICAgICA/IGFyZ3NbbnVtYmVyXS50b1N0cmluZygpXG4gICAgICAgICAgICA6IFwidW5kZWZpbmVkXCI7XG4gICAgfSk7XG59XG4vKipcbiAqIEBzdW1tYXJ5IFV0aWwgZnVuY3Rpb24gdG8gcHJvdmlkZSBzdHJpbmcgZm9ybWF0IGZ1bmN0aW9uYWxpdHkgc2ltaWxhciB0byBDIydzIHN0cmluZy5mb3JtYXRcbiAqXG4gKiBAc2VlIHNmXG4gKlxuICogQGRlcHJlY2F0ZWRcbiAqIEBmdW5jdGlvbiBzdHJpbmdGb3JtYXRcbiAqIEBtZW1iZXJPZiBtb2R1bGU6TG9nZ2luZ1xuICovXG5leHBvcnQgY29uc3Qgc3RyaW5nRm9ybWF0ID0gc2Y7XG4vLyMgc291cmNlTWFwcGluZ1VSTD10ZXh0LmpzLm1hcCIsIi8qKlxuICogQGNsYXNzIE9iamVjdEFjY3VtdWxhdG9yXG4gKiBAdGVtcGxhdGUgVCAtIFRoZSB0eXBlIG9mIHRoZSBhY2N1bXVsYXRlZCBvYmplY3QsIGV4dGVuZHMgb2JqZWN0XG4gKiBAZGVzY3JpcHRpb24gQSBjbGFzcyB0aGF0IGFjY3VtdWxhdGVzIG9iamVjdHMgYW5kIHByb3ZpZGVzIHR5cGUtc2FmZSBhY2Nlc3MgdG8gdGhlaXIgcHJvcGVydGllcy5cbiAqIEl0IGFsbG93cyBmb3IgZHluYW1pYyBhZGRpdGlvbiBvZiBwcm9wZXJ0aWVzIHdoaWxlIG1haW50YWluaW5nIHR5cGUgaW5mb3JtYXRpb24uXG4gKiBAc3VtbWFyeSBBY2N1bXVsYXRlcyBvYmplY3RzIGFuZCBtYWludGFpbnMgdHlwZSBpbmZvcm1hdGlvbiBmb3IgYWNjdW11bGF0ZWQgcHJvcGVydGllc1xuICogQG1lbWJlck9mIHV0aWxzXG4gKi9cbmV4cG9ydCBjbGFzcyBPYmplY3RBY2N1bXVsYXRvciB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcIl9fc2l6ZVwiLCB7XG4gICAgICAgICAgICB2YWx1ZTogMCxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqIEBkZXNjcmlwdGlvbiBFeHBhbmRzIHRoZSBhY2N1bXVsYXRvciB3aXRoIHByb3BlcnRpZXMgZnJvbSBhIG5ldyBvYmplY3RcbiAgICAgKiBAc3VtbWFyeSBBZGRzIG5ldyBwcm9wZXJ0aWVzIHRvIHRoZSBhY2N1bXVsYXRvclxuICAgICAqIEB0ZW1wbGF0ZSBWIC0gVGhlIHR5cGUgb2YgdGhlIG9iamVjdCBiZWluZyBleHBhbmRlZFxuICAgICAqIEBwYXJhbSB7Vn0gdmFsdWUgLSBUaGUgb2JqZWN0IHRvIGV4cGFuZCB3aXRoXG4gICAgICogQHJldHVybnMge3ZvaWR9XG4gICAgICovXG4gICAgZXhwYW5kKHZhbHVlKSB7XG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHZhbHVlKS5mb3JFYWNoKChbaywgdl0pID0+IHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBrLCB7XG4gICAgICAgICAgICAgICAgZ2V0OiAoKSA9PiB2LFxuICAgICAgICAgICAgICAgIHNldDogKHZhbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2ID0gdmFsO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBBY2N1bXVsYXRlcyBhIG5ldyBvYmplY3QgaW50byB0aGUgYWNjdW11bGF0b3JcbiAgICAgKiBAc3VtbWFyeSBBZGRzIHByb3BlcnRpZXMgZnJvbSBhIG5ldyBvYmplY3QgdG8gdGhlIGFjY3VtdWxhdG9yLCBtYWludGFpbmluZyB0eXBlIGluZm9ybWF0aW9uXG4gICAgICogQHRlbXBsYXRlIFYgLSBUaGUgdHlwZSBvZiB0aGUgb2JqZWN0IGJlaW5nIGFjY3VtdWxhdGVkXG4gICAgICogQHBhcmFtIHtWfSB2YWx1ZSAtIFRoZSBvYmplY3QgdG8gYWNjdW11bGF0ZVxuICAgICAqIEByZXR1cm5zIEEgbmV3IE9iamVjdEFjY3VtdWxhdG9yIGluc3RhbmNlIHdpdGggdXBkYXRlZCB0eXBlIGluZm9ybWF0aW9uXG4gICAgICogQG1lcm1haWRcbiAgICAgKiBzZXF1ZW5jZURpYWdyYW1cbiAgICAgKiAgIHBhcnRpY2lwYW50IEEgYXMgQWNjdW11bGF0b3JcbiAgICAgKiAgIHBhcnRpY2lwYW50IE8gYXMgT2JqZWN0XG4gICAgICogICBBLT4+TzogR2V0IGVudHJpZXNcbiAgICAgKiAgIGxvb3AgRm9yIGVhY2ggZW50cnlcbiAgICAgKiAgICAgQS0+PkE6IERlZmluZSBwcm9wZXJ0eVxuICAgICAqICAgZW5kXG4gICAgICogICBBLT4+QTogVXBkYXRlIHNpemVcbiAgICAgKiAgIEEtPj5BOiBSZXR1cm4gdXBkYXRlZCBhY2N1bXVsYXRvclxuICAgICAqL1xuICAgIGFjY3VtdWxhdGUodmFsdWUpIHtcbiAgICAgICAgdGhpcy5leHBhbmQodmFsdWUpO1xuICAgICAgICB0aGlzLl9fc2l6ZSA9IHRoaXMuX19zaXplICsgT2JqZWN0LmtleXModmFsdWUpLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBSZXRyaWV2ZXMgYSB2YWx1ZSBmcm9tIHRoZSBhY2N1bXVsYXRvciBieSBpdHMga2V5XG4gICAgICogQHN1bW1hcnkgR2V0cyBhIHZhbHVlIGZyb20gdGhlIGFjY3VtdWxhdGVkIG9iamVjdCB1c2luZyBhIHR5cGUtc2FmZSBrZXlcbiAgICAgKiBAdGVtcGxhdGUgVCAtIHZhbHVlIHR5cGVcbiAgICAgKiBAdGVtcGxhdGUgSyAtIFRoZSBrZXkgdHlwZSwgbXVzdCBiZSBhIGtleSBvZiB0aGlzXG4gICAgICogQHBhcmFtIHtLfSBrZXkgLSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZXRyaWV2ZVxuICAgICAqIEByZXR1cm5zIFRoZSB2YWx1ZSBhc3NvY2lhdGVkIHdpdGggdGhlIGtleVxuICAgICAqL1xuICAgIGdldChrZXkpIHtcbiAgICAgICAgaWYgKCEoa2V5IGluIHRoaXMpKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBLZXkgJHtrZXl9IGRvZXMgbm90IGV4aXN0IGluIGFjY3VtdWxhdG9yLiBBdmFpbGFibGUga2V5czogJHt0aGlzLmtleXMoKS5qb2luKFwiLCBcIil9YCk7XG4gICAgICAgIHJldHVybiB0aGlzW2tleV07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBSZXRyaWV2ZXMgYSB2YWx1ZSBmcm9tIHRoZSBhY2N1bXVsYXRvciBieSBpdHMga2V5XG4gICAgICogQHN1bW1hcnkgR2V0cyBhIHZhbHVlIGZyb20gdGhlIGFjY3VtdWxhdGVkIG9iamVjdCB1c2luZyBhIHR5cGUtc2FmZSBrZXlcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0gVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmV0cmlldmVcbiAgICAgKiBAcGFyYW0ge2FueX0gdmFsdWUgLSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZXRyaWV2ZVxuICAgICAqL1xuICAgIHB1dChrZXksIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFjY3VtdWxhdGUoeyBba2V5XTogdmFsdWUgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBDaGVja3MgaWYgYSBrZXkgZXhpc3RzIGluIHRoZSBhY2N1bXVsYXRvclxuICAgICAqIEBzdW1tYXJ5IERldGVybWluZXMgd2hldGhlciB0aGUgYWNjdW11bGF0b3IgY29udGFpbnMgYSBzcGVjaWZpYyBrZXlcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0gVGhlIGtleSB0byBjaGVjayBmb3IgZXhpc3RlbmNlXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgaWYgdGhlIGtleSBleGlzdHMsIGZhbHNlIG90aGVyd2lzZVxuICAgICAqL1xuICAgIGhhcyhrZXkpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpc1trZXldO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gUmVtb3ZlcyBhIGtleS12YWx1ZSBwYWlyIGZyb20gdGhlIGFjY3VtdWxhdG9yXG4gICAgICogQHN1bW1hcnkgRGVsZXRlcyBhIHByb3BlcnR5IGZyb20gdGhlIGFjY3VtdWxhdGVkIG9iamVjdFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgLSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byByZW1vdmVcbiAgICAgKiBAcmV0dXJucyB7fSBUaGUgYWNjdW11bGF0b3IgaW5zdGFuY2Ugd2l0aCB0aGUgc3BlY2lmaWVkIHByb3BlcnR5IHJlbW92ZWRcbiAgICAgKi9cbiAgICByZW1vdmUoa2V5KSB7XG4gICAgICAgIGlmICghKGtleSBpbiB0aGlzKSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICBkZWxldGUgdGhpc1trZXldO1xuICAgICAgICB0aGlzLl9fc2l6ZS0tO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFJldHJpZXZlcyBhbGwga2V5cyBmcm9tIHRoZSBhY2N1bXVsYXRvclxuICAgICAqIEBzdW1tYXJ5IEdldHMgYW4gYXJyYXkgb2YgYWxsIGFjY3VtdWxhdGVkIHByb3BlcnR5IGtleXNcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nW119IEFuIGFycmF5IG9mIGtleXMgYXMgc3RyaW5nc1xuICAgICAqL1xuICAgIGtleXMoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFJldHJpZXZlcyBhbGwgdmFsdWVzIGZyb20gdGhlIGFjY3VtdWxhdG9yXG4gICAgICogQHN1bW1hcnkgR2V0cyBhbiBhcnJheSBvZiBhbGwgYWNjdW11bGF0ZWQgcHJvcGVydHkgdmFsdWVzXG4gICAgICogQHJldHVybnMgQW4gYXJyYXkgb2YgdmFsdWVzXG4gICAgICovXG4gICAgdmFsdWVzKCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnZhbHVlcyh0aGlzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEdldHMgdGhlIG51bWJlciBvZiBrZXktdmFsdWUgcGFpcnMgaW4gdGhlIGFjY3VtdWxhdG9yXG4gICAgICogQHN1bW1hcnkgUmV0dXJucyB0aGUgY291bnQgb2YgYWNjdW11bGF0ZWQgcHJvcGVydGllc1xuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IFRoZSBudW1iZXIgb2Yga2V5LXZhbHVlIHBhaXJzXG4gICAgICovXG4gICAgc2l6ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19zaXplO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gQ2xlYXJzIGFsbCBhY2N1bXVsYXRlZCBrZXktdmFsdWUgcGFpcnNcbiAgICAgKiBAc3VtbWFyeSBSZW1vdmVzIGFsbCBwcm9wZXJ0aWVzIGZyb20gdGhlIGFjY3VtdWxhdG9yIGFuZCByZXR1cm5zIGEgbmV3IGVtcHR5IGluc3RhbmNlXG4gICAgICogQHJldHVybnMge09iamVjdEFjY3VtdWxhdG9yPG5ldmVyPn0gQSBuZXcgZW1wdHkgT2JqZWN0QWNjdW11bGF0b3IgaW5zdGFuY2VcbiAgICAgKi9cbiAgICBjbGVhcigpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBPYmplY3RBY2N1bXVsYXRvcigpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gRXhlY3V0ZXMgYSBjYWxsYmFjayBmb3IgZWFjaCBrZXktdmFsdWUgcGFpciBpbiB0aGUgYWNjdW11bGF0b3JcbiAgICAgKiBAc3VtbWFyeSBJdGVyYXRlcyBvdmVyIGFsbCBhY2N1bXVsYXRlZCBwcm9wZXJ0aWVzLCBjYWxsaW5nIGEgZnVuY3Rpb24gZm9yIGVhY2hcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKGFueSwgc3RyaW5nLCBudW1iZXIpOiB2b2lkfSBjYWxsYmFjayAtIFRoZSBmdW5jdGlvbiB0byBleGVjdXRlIGZvciBlYWNoIGVudHJ5XG4gICAgICogQHJldHVybnMge3ZvaWR9XG4gICAgICovXG4gICAgZm9yRWFjaChjYWxsYmFjaykge1xuICAgICAgICBPYmplY3QuZW50cmllcyh0aGlzKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0sIGkpID0+IGNhbGxiYWNrKHZhbHVlLCBrZXksIGkpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIENyZWF0ZXMgYSBuZXcgYXJyYXkgd2l0aCB0aGUgcmVzdWx0cyBvZiBjYWxsaW5nIGEgcHJvdmlkZWQgZnVuY3Rpb24gb24gZXZlcnkgZWxlbWVudCBpbiB0aGUgYWNjdW11bGF0b3JcbiAgICAgKiBAc3VtbWFyeSBNYXBzIGVhY2ggYWNjdW11bGF0ZWQgcHJvcGVydHkgdG8gYSBuZXcgdmFsdWUgdXNpbmcgYSBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqIEB0ZW1wbGF0ZSBSIC0gVGhlIHR5cGUgb2YgdGhlIG1hcHBlZCB2YWx1ZXNcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9uKGFueSwgc3RyaW5nLG51bWJlcik6IFJ9IGNhbGxiYWNrIC0gRnVuY3Rpb24gdGhhdCBwcm9kdWNlcyBhbiBlbGVtZW50IG9mIHRoZSBuZXcgYXJyYXlcbiAgICAgKiBAcmV0dXJucyB7UltdfSBBIG5ldyBhcnJheSB3aXRoIGVhY2ggZWxlbWVudCBiZWluZyB0aGUgcmVzdWx0IG9mIHRoZSBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqL1xuICAgIG1hcChjYWxsYmFjaykge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmVudHJpZXModGhpcykubWFwKChba2V5LCB2YWx1ZV0sIGkpID0+IGNhbGxiYWNrKHZhbHVlLCBrZXksIGkpKTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2lZV05qZFcxMWJHRjBiM0l1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sY3lJNld5SXVMaTh1TGk5emNtTXZZV05qZFcxMWJHRjBiM0l1ZEhNaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRTdPenM3T3pzN1IwRlBSenRCUVVOSUxFMUJRVTBzVDBGQlR5eHBRa0ZCYVVJN1NVRlJOVUk3VVVGRFJTeE5RVUZOTEVOQlFVTXNZMEZCWXl4RFFVRkRMRWxCUVVrc1JVRkJSU3hSUVVGUkxFVkJRVVU3V1VGRGNFTXNTMEZCU3l4RlFVRkZMRU5CUVVNN1dVRkRVaXhSUVVGUkxFVkJRVVVzU1VGQlNUdFpRVU5rTEZsQlFWa3NSVUZCUlN4TFFVRkxPMWxCUTI1Q0xGVkJRVlVzUlVGQlJTeExRVUZMTzFOQlEyeENMRU5CUVVNc1EwRkJRenRKUVVOTUxFTkJRVU03U1VGRlJEczdPenM3T3p0UFFVOUhPMGxCUTA4c1RVRkJUU3hEUVVGdFFpeExRVUZSTzFGQlEzcERMRTFCUVUwc1EwRkJReXhQUVVGUExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFVkJRVVVzUTBGQlF5eERRVUZETEVWQlFVVXNSVUZCUlR0WlFVTjJReXhOUVVGTkxFTkJRVU1zWTBGQll5eERRVUZETEVsQlFVa3NSVUZCUlN4RFFVRkRMRVZCUVVVN1owSkJRemRDTEVkQlFVY3NSVUZCUlN4SFFVRkhMRVZCUVVVc1EwRkJReXhEUVVGRE8yZENRVU5hTEVkQlFVY3NSVUZCUlN4RFFVRkRMRWRCUVdVc1JVRkJSU3hGUVVGRk8yOUNRVU4yUWl4RFFVRkRMRWRCUVVjc1IwRkJSeXhEUVVGRE8yZENRVU5XTEVOQlFVTTdaMEpCUTBRc1dVRkJXU3hGUVVGRkxFbEJRVWs3WjBKQlEyeENMRlZCUVZVc1JVRkJSU3hKUVVGSk8yRkJRMnBDTEVOQlFVTXNRMEZCUXp0UlFVTk1MRU5CUVVNc1EwRkJReXhEUVVGRE8wbEJRMHdzUTBGQlF6dEpRVVZFT3pzN096czdPenM3T3pzN096czdPMDlCWjBKSE8wbEJRMGdzVlVGQlZTeERRVUZ0UWl4TFFVRlJPMUZCUTI1RExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNN1VVRkRia0lzU1VGQlNTeERRVUZETEUxQlFVMHNSMEZCUnl4SlFVRkpMRU5CUVVNc1RVRkJUU3hIUVVGSExFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1RVRkJUU3hEUVVGRE8xRkJRM1JFTEU5QlFVOHNTVUZCYlVRc1EwRkJRenRKUVVNM1JDeERRVUZETzBsQlJVUTdPenM3T3pzN1QwRlBSenRKUVVOSUxFZEJRVWNzUTBGQmIwSXNSMEZCVFR0UlFVTXpRaXhKUVVGSkxFTkJRVU1zUTBGQlF5eEhRVUZITEVsQlFVa3NTVUZCU1N4RFFVRkRPMWxCUTJoQ0xFMUJRVTBzU1VGQlNTeExRVUZMTEVOQlEySXNUMEZCVHl4SFFVRmhMRzFFUVVGdFJDeEpRVUZKTEVOQlFVTXNTVUZCU1N4RlFVRkZMRU5CUVVNc1NVRkJTU3hEUVVOeVJpeEpRVUZKTEVOQlEwd3NSVUZCUlN4RFFVTktMRU5CUVVNN1VVRkRTaXhQUVVGUkxFbEJRVmtzUTBGQlF5eEhRVUZSTEVOQlFWTXNRMEZCUXp0SlFVTjZReXhEUVVGRE8wbEJSVVE3T3pzN08wOUJTMGM3U1VGRFNDeEhRVUZITEVOQlFVTXNSMEZCVnl4RlFVRkZMRXRCUVZVN1VVRkRla0lzVDBGQlR5eEpRVUZKTEVOQlFVTXNWVUZCVlN4RFFVRkRMRVZCUVVVc1EwRkJReXhIUVVGSExFTkJRVU1zUlVGQlJTeExRVUZMTEVWQlFVVXNRMEZCUXl4RFFVRkRPMGxCUXpORExFTkJRVU03U1VGRlJEczdPenM3VDBGTFJ6dEpRVU5JTEVkQlFVY3NRMEZCUXl4SFFVRlhPMUZCUTJJc1QwRkJUeXhEUVVGRExFTkJRVU1zU1VGQlNTeERRVUZETEVkQlFXbENMRU5CUVVNc1EwRkJRenRKUVVOdVF5eERRVUZETzBsQlJVUTdPenM3TzA5QlMwYzdTVUZEU0N4TlFVRk5MRU5CUTBvc1IwRkJkMEk3VVVGSmVFSXNTVUZCU1N4RFFVRkRMRU5CUVVNc1IwRkJSeXhKUVVGSkxFbEJRVWtzUTBGQlF6dFpRVUZGTEU5QlFVOHNTVUZCU1N4RFFVRkRPMUZCUldoRExFOUJRVThzU1VGQlNTeERRVUZETEVkQlFXbENMRU5CUVVNc1EwRkJRenRSUVVNdlFpeEpRVUZKTEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNN1VVRkRaQ3hQUVVGUExFbEJRMjlETEVOQlFVTTdTVUZET1VNc1EwRkJRenRKUVVWRU96czdPMDlCU1VjN1NVRkRTQ3hKUVVGSk8xRkJRMFlzVDBGQlR5eE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhEUVVGRE8wbEJRek5DTEVOQlFVTTdTVUZGUkRzN096dFBRVWxITzBsQlEwZ3NUVUZCVFR0UlFVTktMRTlCUVU4c1RVRkJUU3hEUVVGRExFMUJRVTBzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0SlFVTTNRaXhEUVVGRE8wbEJSVVE3T3pzN1QwRkpSenRKUVVOSUxFbEJRVWs3VVVGRFJpeFBRVUZQTEVsQlFVa3NRMEZCUXl4TlFVRk5MRU5CUVVNN1NVRkRja0lzUTBGQlF6dEpRVVZFT3pzN08wOUJTVWM3U1VGRFNDeExRVUZMTzFGQlEwZ3NUMEZCVHl4SlFVRkpMR2xDUVVGcFFpeEZRVUZGTEVOQlFVTTdTVUZEYWtNc1EwRkJRenRKUVVWRU96czdPenRQUVV0SE8wbEJRMGdzVDBGQlR5eERRVU5NTEZGQlFYVkZPMUZCUlhaRkxFMUJRVTBzUTBGQlF5eFBRVUZQTEVOQlFVTXNTVUZCU1N4RFFVRkRMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU1zUTBGQlF5eEhRVUZITEVWQlFVVXNTMEZCU3l4RFFVRkRMRVZCUVVVc1EwRkJReXhGUVVGRkxFVkJRVVVzUTBGREwwTXNVVUZCVVN4RFFVRkRMRXRCUVVzc1JVRkJSU3hIUVVGcFFpeEZRVUZGTEVOQlFVTXNRMEZCUXl4RFFVTjBReXhEUVVGRE8wbEJRMG9zUTBGQlF6dEpRVVZFT3pzN096czdUMEZOUnp0SlFVTklMRWRCUVVjc1EwRkRSQ3hSUVVGdlJUdFJRVVZ3UlN4UFFVRlBMRTFCUVUwc1EwRkJReXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJReXhIUVVGSExFVkJRVVVzUzBGQlN5eERRVUZETEVWQlFVVXNRMEZCUXl4RlFVRkZMRVZCUVVVc1EwRkRiRVFzVVVGQlVTeERRVUZETEV0QlFVc3NSVUZCUlN4SFFVRnBRaXhGUVVGRkxFTkJRVU1zUTBGQlF5eERRVU4wUXl4RFFVRkRPMGxCUTBvc1EwRkJRenREUVVOR0lpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lMeW9xWEc0Z0tpQkFZMnhoYzNNZ1QySnFaV04wUVdOamRXMTFiR0YwYjNKY2JpQXFJRUIwWlcxd2JHRjBaU0JVSUMwZ1ZHaGxJSFI1Y0dVZ2IyWWdkR2hsSUdGalkzVnRkV3hoZEdWa0lHOWlhbVZqZEN3Z1pYaDBaVzVrY3lCdlltcGxZM1JjYmlBcUlFQmtaWE5qY21sd2RHbHZiaUJCSUdOc1lYTnpJSFJvWVhRZ1lXTmpkVzExYkdGMFpYTWdiMkpxWldOMGN5QmhibVFnY0hKdmRtbGtaWE1nZEhsd1pTMXpZV1psSUdGalkyVnpjeUIwYnlCMGFHVnBjaUJ3Y205d1pYSjBhV1Z6TGx4dUlDb2dTWFFnWVd4c2IzZHpJR1p2Y2lCa2VXNWhiV2xqSUdGa1pHbDBhVzl1SUc5bUlIQnliM0JsY25ScFpYTWdkMmhwYkdVZ2JXRnBiblJoYVc1cGJtY2dkSGx3WlNCcGJtWnZjbTFoZEdsdmJpNWNiaUFxSUVCemRXMXRZWEo1SUVGalkzVnRkV3hoZEdWeklHOWlhbVZqZEhNZ1lXNWtJRzFoYVc1MFlXbHVjeUIwZVhCbElHbHVabTl5YldGMGFXOXVJR1p2Y2lCaFkyTjFiWFZzWVhSbFpDQndjbTl3WlhKMGFXVnpYRzRnS2lCQWJXVnRZbVZ5VDJZZ2RYUnBiSE5jYmlBcUwxeHVaWGh3YjNKMElHTnNZWE56SUU5aWFtVmpkRUZqWTNWdGRXeGhkRzl5UEZRZ1pYaDBaVzVrY3lCdlltcGxZM1ErSUh0Y2JpQWdMeW9xWEc0Z0lDQXFJRUJ3Y21sMllYUmxYRzRnSUNBcUlFQmtaWE5qY21sd2RHbHZiaUJVYUdVZ2MybDZaU0J2WmlCMGFHVWdZV05qZFcxMWJHRjBaV1FnYjJKcVpXTjBYRzRnSUNBcUlFQjBlWEJsSUh0dWRXMWlaWEo5WEc0Z0lDQXFMMXh1SUNCd2NtbDJZWFJsSUY5ZmMybDZaU0U2SUc1MWJXSmxjanRjYmx4dUlDQmpiMjV6ZEhKMVkzUnZjaWdwSUh0Y2JpQWdJQ0JQWW1wbFkzUXVaR1ZtYVc1bFVISnZjR1Z5ZEhrb2RHaHBjeXdnWENKZlgzTnBlbVZjSWl3Z2UxeHVJQ0FnSUNBZ2RtRnNkV1U2SURBc1hHNGdJQ0FnSUNCM2NtbDBZV0pzWlRvZ2RISjFaU3hjYmlBZ0lDQWdJR052Ym1acFozVnlZV0pzWlRvZ1ptRnNjMlVzWEc0Z0lDQWdJQ0JsYm5WdFpYSmhZbXhsT2lCbVlXeHpaU3hjYmlBZ0lDQjlLVHRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCQWNISnZkR1ZqZEdWa1hHNGdJQ0FxSUVCa1pYTmpjbWx3ZEdsdmJpQkZlSEJoYm1SeklIUm9aU0JoWTJOMWJYVnNZWFJ2Y2lCM2FYUm9JSEJ5YjNCbGNuUnBaWE1nWm5KdmJTQmhJRzVsZHlCdlltcGxZM1JjYmlBZ0lDb2dRSE4xYlcxaGNua2dRV1JrY3lCdVpYY2djSEp2Y0dWeWRHbGxjeUIwYnlCMGFHVWdZV05qZFcxMWJHRjBiM0pjYmlBZ0lDb2dRSFJsYlhCc1lYUmxJRllnTFNCVWFHVWdkSGx3WlNCdlppQjBhR1VnYjJKcVpXTjBJR0psYVc1bklHVjRjR0Z1WkdWa1hHNGdJQ0FxSUVCd1lYSmhiU0I3Vm4wZ2RtRnNkV1VnTFNCVWFHVWdiMkpxWldOMElIUnZJR1Y0Y0dGdVpDQjNhWFJvWEc0Z0lDQXFJRUJ5WlhSMWNtNXpJSHQyYjJsa2ZWeHVJQ0FnS2k5Y2JpQWdjSEp2ZEdWamRHVmtJR1Y0Y0dGdVpEeFdJR1Y0ZEdWdVpITWdiMkpxWldOMFBpaDJZV3gxWlRvZ1ZpazZJSFp2YVdRZ2UxeHVJQ0FnSUU5aWFtVmpkQzVsYm5SeWFXVnpLSFpoYkhWbEtTNW1iM0pGWVdOb0tDaGJheXdnZGwwcElEMCtJSHRjYmlBZ0lDQWdJRTlpYW1WamRDNWtaV1pwYm1WUWNtOXdaWEowZVNoMGFHbHpMQ0JyTENCN1hHNGdJQ0FnSUNBZ0lHZGxkRG9nS0NrZ1BUNGdkaXhjYmlBZ0lDQWdJQ0FnYzJWME9pQW9kbUZzT2lCV1cydGxlVzltSUZaZEtTQTlQaUI3WEc0Z0lDQWdJQ0FnSUNBZ2RpQTlJSFpoYkR0Y2JpQWdJQ0FnSUNBZ2ZTeGNiaUFnSUNBZ0lDQWdZMjl1Wm1sbmRYSmhZbXhsT2lCMGNuVmxMRnh1SUNBZ0lDQWdJQ0JsYm5WdFpYSmhZbXhsT2lCMGNuVmxMRnh1SUNBZ0lDQWdmU2s3WEc0Z0lDQWdmU2s3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1FHUmxjMk55YVhCMGFXOXVJRUZqWTNWdGRXeGhkR1Z6SUdFZ2JtVjNJRzlpYW1WamRDQnBiblJ2SUhSb1pTQmhZMk4xYlhWc1lYUnZjbHh1SUNBZ0tpQkFjM1Z0YldGeWVTQkJaR1J6SUhCeWIzQmxjblJwWlhNZ1puSnZiU0JoSUc1bGR5QnZZbXBsWTNRZ2RHOGdkR2hsSUdGalkzVnRkV3hoZEc5eUxDQnRZV2x1ZEdGcGJtbHVaeUIwZVhCbElHbHVabTl5YldGMGFXOXVYRzRnSUNBcUlFQjBaVzF3YkdGMFpTQldJQzBnVkdobElIUjVjR1VnYjJZZ2RHaGxJRzlpYW1WamRDQmlaV2x1WnlCaFkyTjFiWFZzWVhSbFpGeHVJQ0FnS2lCQWNHRnlZVzBnZTFaOUlIWmhiSFZsSUMwZ1ZHaGxJRzlpYW1WamRDQjBieUJoWTJOMWJYVnNZWFJsWEc0Z0lDQXFJRUJ5WlhSMWNtNXpJRUVnYm1WM0lFOWlhbVZqZEVGalkzVnRkV3hoZEc5eUlHbHVjM1JoYm1ObElIZHBkR2dnZFhCa1lYUmxaQ0IwZVhCbElHbHVabTl5YldGMGFXOXVYRzRnSUNBcUlFQnRaWEp0WVdsa1hHNGdJQ0FxSUhObGNYVmxibU5sUkdsaFozSmhiVnh1SUNBZ0tpQWdJSEJoY25ScFkybHdZVzUwSUVFZ1lYTWdRV05qZFcxMWJHRjBiM0pjYmlBZ0lDb2dJQ0J3WVhKMGFXTnBjR0Z1ZENCUElHRnpJRTlpYW1WamRGeHVJQ0FnS2lBZ0lFRXRQajVQT2lCSFpYUWdaVzUwY21sbGMxeHVJQ0FnS2lBZ0lHeHZiM0FnUm05eUlHVmhZMmdnWlc1MGNubGNiaUFnSUNvZ0lDQWdJRUV0UGo1Qk9pQkVaV1pwYm1VZ2NISnZjR1Z5ZEhsY2JpQWdJQ29nSUNCbGJtUmNiaUFnSUNvZ0lDQkJMVDQrUVRvZ1ZYQmtZWFJsSUhOcGVtVmNiaUFnSUNvZ0lDQkJMVDQrUVRvZ1VtVjBkWEp1SUhWd1pHRjBaV1FnWVdOamRXMTFiR0YwYjNKY2JpQWdJQ292WEc0Z0lHRmpZM1Z0ZFd4aGRHVThWaUJsZUhSbGJtUnpJRzlpYW1WamRENG9kbUZzZFdVNklGWXBPaUJVSUNZZ1ZpQW1JRTlpYW1WamRFRmpZM1Z0ZFd4aGRHOXlQRlFnSmlCV1BpQjdYRzRnSUNBZ2RHaHBjeTVsZUhCaGJtUW9kbUZzZFdVcE8xeHVJQ0FnSUhSb2FYTXVYMTl6YVhwbElEMGdkR2hwY3k1ZlgzTnBlbVVnS3lCUFltcGxZM1F1YTJWNWN5aDJZV3gxWlNrdWJHVnVaM1JvTzF4dUlDQWdJSEpsZEhWeWJpQjBhR2x6SUdGeklIVnVhMjV2ZDI0Z1lYTWdWQ0FtSUZZZ0ppQlBZbXBsWTNSQlkyTjFiWFZzWVhSdmNqeFVJQ1lnVmo0N1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRR1JsYzJOeWFYQjBhVzl1SUZKbGRISnBaWFpsY3lCaElIWmhiSFZsSUdaeWIyMGdkR2hsSUdGalkzVnRkV3hoZEc5eUlHSjVJR2wwY3lCclpYbGNiaUFnSUNvZ1FITjFiVzFoY25rZ1IyVjBjeUJoSUhaaGJIVmxJR1p5YjIwZ2RHaGxJR0ZqWTNWdGRXeGhkR1ZrSUc5aWFtVmpkQ0IxYzJsdVp5QmhJSFI1Y0dVdGMyRm1aU0JyWlhsY2JpQWdJQ29nUUhSbGJYQnNZWFJsSUZRZ0xTQjJZV3gxWlNCMGVYQmxYRzRnSUNBcUlFQjBaVzF3YkdGMFpTQkxJQzBnVkdobElHdGxlU0IwZVhCbExDQnRkWE4wSUdKbElHRWdhMlY1SUc5bUlIUm9hWE5jYmlBZ0lDb2dRSEJoY21GdElIdExmU0JyWlhrZ0xTQlVhR1VnYTJWNUlHOW1JSFJvWlNCMllXeDFaU0IwYnlCeVpYUnlhV1YyWlZ4dUlDQWdLaUJBY21WMGRYSnVjeUJVYUdVZ2RtRnNkV1VnWVhOemIyTnBZWFJsWkNCM2FYUm9JSFJvWlNCclpYbGNiaUFnSUNvdlhHNGdJR2RsZER4TElHVjRkR1Z1WkhNZ2EyVjViMllnVkQ0b2EyVjVPaUJMS1RvZ1ZGdExYU0I3WEc0Z0lDQWdhV1lnS0NFb2EyVjVJR2x1SUhSb2FYTXBLVnh1SUNBZ0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtGeHVJQ0FnSUNBZ0lDQmdTMlY1SUNSN2EyVjVJR0Z6SUhOMGNtbHVaMzBnWkc5bGN5QnViM1FnWlhocGMzUWdhVzRnWVdOamRXMTFiR0YwYjNJdUlFRjJZV2xzWVdKc1pTQnJaWGx6T2lBa2UzUm9hWE11YTJWNWN5Z3BMbXB2YVc0b1hHNGdJQ0FnSUNBZ0lDQWdYQ0lzSUZ3aVhHNGdJQ0FnSUNBZ0lDbDlZRnh1SUNBZ0lDQWdLVHRjYmlBZ0lDQnlaWFIxY200Z0tIUm9hWE1nWVhNZ1lXNTVLVnRyWlhrZ1lYTWdTMTBnWVhNZ1ZGdExYVHRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCQVpHVnpZM0pwY0hScGIyNGdVbVYwY21sbGRtVnpJR0VnZG1Gc2RXVWdabkp2YlNCMGFHVWdZV05qZFcxMWJHRjBiM0lnWW5rZ2FYUnpJR3RsZVZ4dUlDQWdLaUJBYzNWdGJXRnllU0JIWlhSeklHRWdkbUZzZFdVZ1puSnZiU0IwYUdVZ1lXTmpkVzExYkdGMFpXUWdiMkpxWldOMElIVnphVzVuSUdFZ2RIbHdaUzF6WVdabElHdGxlVnh1SUNBZ0tpQkFjR0Z5WVcwZ2UzTjBjbWx1WjMwZ2EyVjVJQzBnVkdobElHdGxlU0J2WmlCMGFHVWdkbUZzZFdVZ2RHOGdjbVYwY21sbGRtVmNiaUFnSUNvZ1FIQmhjbUZ0SUh0aGJubDlJSFpoYkhWbElDMGdWR2hsSUd0bGVTQnZaaUIwYUdVZ2RtRnNkV1VnZEc4Z2NtVjBjbWxsZG1WY2JpQWdJQ292WEc0Z0lIQjFkQ2hyWlhrNklITjBjbWx1Wnl3Z2RtRnNkV1U2SUdGdWVTa2dlMXh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpMbUZqWTNWdGRXeGhkR1VvZXlCYmEyVjVYVG9nZG1Gc2RXVWdmU2s3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1FHUmxjMk55YVhCMGFXOXVJRU5vWldOcmN5QnBaaUJoSUd0bGVTQmxlR2x6ZEhNZ2FXNGdkR2hsSUdGalkzVnRkV3hoZEc5eVhHNGdJQ0FxSUVCemRXMXRZWEo1SUVSbGRHVnliV2x1WlhNZ2QyaGxkR2hsY2lCMGFHVWdZV05qZFcxMWJHRjBiM0lnWTI5dWRHRnBibk1nWVNCemNHVmphV1pwWXlCclpYbGNiaUFnSUNvZ1FIQmhjbUZ0SUh0emRISnBibWQ5SUd0bGVTQXRJRlJvWlNCclpYa2dkRzhnWTJobFkyc2dabTl5SUdWNGFYTjBaVzVqWlZ4dUlDQWdLaUJBY21WMGRYSnVjeUI3WW05dmJHVmhibjBnVkhKMVpTQnBaaUIwYUdVZ2EyVjVJR1Y0YVhOMGN5d2dabUZzYzJVZ2IzUm9aWEozYVhObFhHNGdJQ0FxTDF4dUlDQm9ZWE1vYTJWNU9pQnpkSEpwYm1jcE9pQmliMjlzWldGdUlIdGNiaUFnSUNCeVpYUjFjbTRnSVNGMGFHbHpXMnRsZVNCaGN5QnJaWGx2WmlCMGFHbHpYVHRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCQVpHVnpZM0pwY0hScGIyNGdVbVZ0YjNabGN5QmhJR3RsZVMxMllXeDFaU0J3WVdseUlHWnliMjBnZEdobElHRmpZM1Z0ZFd4aGRHOXlYRzRnSUNBcUlFQnpkVzF0WVhKNUlFUmxiR1YwWlhNZ1lTQndjbTl3WlhKMGVTQm1jbTl0SUhSb1pTQmhZMk4xYlhWc1lYUmxaQ0J2WW1wbFkzUmNiaUFnSUNvZ1FIQmhjbUZ0SUh0emRISnBibWQ5SUd0bGVTQXRJRlJvWlNCclpYa2diMllnZEdobElIQnliM0JsY25SNUlIUnZJSEpsYlc5MlpWeHVJQ0FnS2lCQWNtVjBkWEp1Y3lCN2ZTQlVhR1VnWVdOamRXMTFiR0YwYjNJZ2FXNXpkR0Z1WTJVZ2QybDBhQ0IwYUdVZ2MzQmxZMmxtYVdWa0lIQnliM0JsY25SNUlISmxiVzkyWldSY2JpQWdJQ292WEc0Z0lISmxiVzkyWlNoY2JpQWdJQ0JyWlhrNklHdGxlVzltSUhSb2FYTWdmQ0J6ZEhKcGJtZGNiaUFnS1RwY2JpQWdJQ0I4SUNoUGJXbDBQSFJvYVhNc0lIUjVjR1Z2WmlCclpYaytJQ1lnVDJKcVpXTjBRV05qZFcxMWJHRjBiM0k4VDIxcGREeDBhR2x6TENCMGVYQmxiMllnYTJWNVBqNHBYRzRnSUNBZ2ZDQjBhR2x6SUh0Y2JpQWdJQ0JwWmlBb0lTaHJaWGtnYVc0Z2RHaHBjeWtwSUhKbGRIVnliaUIwYUdsek8xeHVYRzRnSUNBZ1pHVnNaWFJsSUhSb2FYTmJhMlY1SUdGeklHdGxlVzltSUhSb2FYTmRPMXh1SUNBZ0lIUm9hWE11WDE5emFYcGxMUzA3WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE1nWVhNZ2RXNXJibTkzYmlCaGN5QlBiV2wwUEhSb2FYTXNJSFI1Y0dWdlppQnJaWGsrSUNaY2JpQWdJQ0FnSUU5aWFtVmpkRUZqWTNWdGRXeGhkRzl5UEU5dGFYUThkR2hwY3l3Z2RIbHdaVzltSUd0bGVUNCtPMXh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUVCa1pYTmpjbWx3ZEdsdmJpQlNaWFJ5YVdWMlpYTWdZV3hzSUd0bGVYTWdabkp2YlNCMGFHVWdZV05qZFcxMWJHRjBiM0pjYmlBZ0lDb2dRSE4xYlcxaGNua2dSMlYwY3lCaGJpQmhjbkpoZVNCdlppQmhiR3dnWVdOamRXMTFiR0YwWldRZ2NISnZjR1Z5ZEhrZ2EyVjVjMXh1SUNBZ0tpQkFjbVYwZFhKdWN5QjdjM1J5YVc1blcxMTlJRUZ1SUdGeWNtRjVJRzltSUd0bGVYTWdZWE1nYzNSeWFXNW5jMXh1SUNBZ0tpOWNiaUFnYTJWNWN5Z3BPaUJ6ZEhKcGJtZGJYU0I3WEc0Z0lDQWdjbVYwZFhKdUlFOWlhbVZqZEM1clpYbHpLSFJvYVhNcE8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRUJrWlhOamNtbHdkR2x2YmlCU1pYUnlhV1YyWlhNZ1lXeHNJSFpoYkhWbGN5Qm1jbTl0SUhSb1pTQmhZMk4xYlhWc1lYUnZjbHh1SUNBZ0tpQkFjM1Z0YldGeWVTQkhaWFJ6SUdGdUlHRnljbUY1SUc5bUlHRnNiQ0JoWTJOMWJYVnNZWFJsWkNCd2NtOXdaWEowZVNCMllXeDFaWE5jYmlBZ0lDb2dRSEpsZEhWeWJuTWdRVzRnWVhKeVlYa2diMllnZG1Gc2RXVnpYRzRnSUNBcUwxeHVJQ0IyWVd4MVpYTW9LVG9nVkZ0clpYbHZaaUJVWFZ0ZElIdGNiaUFnSUNCeVpYUjFjbTRnVDJKcVpXTjBMblpoYkhWbGN5aDBhR2x6S1R0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkFaR1Z6WTNKcGNIUnBiMjRnUjJWMGN5QjBhR1VnYm5WdFltVnlJRzltSUd0bGVTMTJZV3gxWlNCd1lXbHljeUJwYmlCMGFHVWdZV05qZFcxMWJHRjBiM0pjYmlBZ0lDb2dRSE4xYlcxaGNua2dVbVYwZFhKdWN5QjBhR1VnWTI5MWJuUWdiMllnWVdOamRXMTFiR0YwWldRZ2NISnZjR1Z5ZEdsbGMxeHVJQ0FnS2lCQWNtVjBkWEp1Y3lCN2JuVnRZbVZ5ZlNCVWFHVWdiblZ0WW1WeUlHOW1JR3RsZVMxMllXeDFaU0J3WVdseWMxeHVJQ0FnS2k5Y2JpQWdjMmw2WlNncE9pQnVkVzFpWlhJZ2UxeHVJQ0FnSUhKbGRIVnliaUIwYUdsekxsOWZjMmw2WlR0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkFaR1Z6WTNKcGNIUnBiMjRnUTJ4bFlYSnpJR0ZzYkNCaFkyTjFiWFZzWVhSbFpDQnJaWGt0ZG1Gc2RXVWdjR0ZwY25OY2JpQWdJQ29nUUhOMWJXMWhjbmtnVW1WdGIzWmxjeUJoYkd3Z2NISnZjR1Z5ZEdsbGN5Qm1jbTl0SUhSb1pTQmhZMk4xYlhWc1lYUnZjaUJoYm1RZ2NtVjBkWEp1Y3lCaElHNWxkeUJsYlhCMGVTQnBibk4wWVc1alpWeHVJQ0FnS2lCQWNtVjBkWEp1Y3lCN1QySnFaV04wUVdOamRXMTFiR0YwYjNJOGJtVjJaWEkrZlNCQklHNWxkeUJsYlhCMGVTQlBZbXBsWTNSQlkyTjFiWFZzWVhSdmNpQnBibk4wWVc1alpWeHVJQ0FnS2k5Y2JpQWdZMnhsWVhJb0tUb2dUMkpxWldOMFFXTmpkVzExYkdGMGIzSThibVYyWlhJK0lIdGNiaUFnSUNCeVpYUjFjbTRnYm1WM0lFOWlhbVZqZEVGalkzVnRkV3hoZEc5eUtDazdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nUUdSbGMyTnlhWEIwYVc5dUlFVjRaV04xZEdWeklHRWdZMkZzYkdKaFkyc2dabTl5SUdWaFkyZ2dhMlY1TFhaaGJIVmxJSEJoYVhJZ2FXNGdkR2hsSUdGalkzVnRkV3hoZEc5eVhHNGdJQ0FxSUVCemRXMXRZWEo1SUVsMFpYSmhkR1Z6SUc5MlpYSWdZV3hzSUdGalkzVnRkV3hoZEdWa0lIQnliM0JsY25ScFpYTXNJR05oYkd4cGJtY2dZU0JtZFc1amRHbHZiaUJtYjNJZ1pXRmphRnh1SUNBZ0tpQkFjR0Z5WVcwZ2UyWjFibU4wYVc5dUtHRnVlU3dnYzNSeWFXNW5MQ0J1ZFcxaVpYSXBPaUIyYjJsa2ZTQmpZV3hzWW1GamF5QXRJRlJvWlNCbWRXNWpkR2x2YmlCMGJ5QmxlR1ZqZFhSbElHWnZjaUJsWVdOb0lHVnVkSEo1WEc0Z0lDQXFJRUJ5WlhSMWNtNXpJSHQyYjJsa2ZWeHVJQ0FnS2k5Y2JpQWdabTl5UldGamFDaGNiaUFnSUNCallXeHNZbUZqYXpvZ0tIWmhiSFZsT2lCMGFHbHpXMnRsZVc5bUlIUm9hWE5kTENCclpYazZJR3RsZVc5bUlIUm9hWE1zSUdrNklHNTFiV0psY2lrZ1BUNGdkbTlwWkZ4dUlDQXBPaUIyYjJsa0lIdGNiaUFnSUNCUFltcGxZM1F1Wlc1MGNtbGxjeWgwYUdsektTNW1iM0pGWVdOb0tDaGJhMlY1TENCMllXeDFaVjBzSUdrcElEMCtYRzRnSUNBZ0lDQmpZV3hzWW1GamF5aDJZV3gxWlN3Z2EyVjVJR0Z6SUd0bGVXOW1JSFJvYVhNc0lHa3BYRzRnSUNBZ0tUdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJBWkdWelkzSnBjSFJwYjI0Z1EzSmxZWFJsY3lCaElHNWxkeUJoY25KaGVTQjNhWFJvSUhSb1pTQnlaWE4xYkhSeklHOW1JR05oYkd4cGJtY2dZU0J3Y205MmFXUmxaQ0JtZFc1amRHbHZiaUJ2YmlCbGRtVnllU0JsYkdWdFpXNTBJR2x1SUhSb1pTQmhZMk4xYlhWc1lYUnZjbHh1SUNBZ0tpQkFjM1Z0YldGeWVTQk5ZWEJ6SUdWaFkyZ2dZV05qZFcxMWJHRjBaV1FnY0hKdmNHVnlkSGtnZEc4Z1lTQnVaWGNnZG1Gc2RXVWdkWE5wYm1jZ1lTQmpZV3hzWW1GamF5Qm1kVzVqZEdsdmJseHVJQ0FnS2lCQWRHVnRjR3hoZEdVZ1VpQXRJRlJvWlNCMGVYQmxJRzltSUhSb1pTQnRZWEJ3WldRZ2RtRnNkV1Z6WEc0Z0lDQXFJRUJ3WVhKaGJTQjdablZ1WTNScGIyNG9ZVzU1TENCemRISnBibWNzYm5WdFltVnlLVG9nVW4wZ1kyRnNiR0poWTJzZ0xTQkdkVzVqZEdsdmJpQjBhR0YwSUhCeWIyUjFZMlZ6SUdGdUlHVnNaVzFsYm5RZ2IyWWdkR2hsSUc1bGR5QmhjbkpoZVZ4dUlDQWdLaUJBY21WMGRYSnVjeUI3VWx0ZGZTQkJJRzVsZHlCaGNuSmhlU0IzYVhSb0lHVmhZMmdnWld4bGJXVnVkQ0JpWldsdVp5QjBhR1VnY21WemRXeDBJRzltSUhSb1pTQmpZV3hzWW1GamF5Qm1kVzVqZEdsdmJseHVJQ0FnS2k5Y2JpQWdiV0Z3UEZJK0tGeHVJQ0FnSUdOaGJHeGlZV05yT2lBb2RtRnNkV1U2SUhSb2FYTmJhMlY1YjJZZ2RHaHBjMTBzSUd0bGVUb2dhMlY1YjJZZ2RHaHBjeXdnYVRvZ2JuVnRZbVZ5S1NBOVBpQlNYRzRnSUNrNklGSmJYU0I3WEc0Z0lDQWdjbVYwZFhKdUlFOWlhbVZqZEM1bGJuUnlhV1Z6S0hSb2FYTXBMbTFoY0Nnb1cydGxlU3dnZG1Gc2RXVmRMQ0JwS1NBOVBseHVJQ0FnSUNBZ1kyRnNiR0poWTJzb2RtRnNkV1VzSUd0bGVTQmhjeUJyWlhsdlppQjBhR2x6TENCcEtWeHVJQ0FnSUNrN1hHNGdJSDFjYm4xY2JpSmRmUT09IiwiLyoqXG4gKiBAZGVzY3JpcHRpb24gRGV0ZXJtaW5lcyBpZiB0aGUgY3VycmVudCBlbnZpcm9ubWVudCBpcyBhIGJyb3dzZXIgYnkgY2hlY2tpbmcgdGhlIHByb3RvdHlwZSBjaGFpbiBvZiB0aGUgZ2xvYmFsIG9iamVjdC5cbiAqIEBzdW1tYXJ5IENoZWNrcyBpZiB0aGUgY29kZSBpcyBydW5uaW5nIGluIGEgYnJvd3NlciBlbnZpcm9ubWVudC5cbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhlIGVudmlyb25tZW50IGlzIGEgYnJvd3NlciwgZmFsc2Ugb3RoZXJ3aXNlLlxuICogQGZ1bmN0aW9uIGlzQnJvd3NlclxuICogQG1lbWJlck9mIG1vZHVsZTpMb2dnaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Jyb3dzZXIoKSB7XG4gICAgcmV0dXJuIChPYmplY3QuZ2V0UHJvdG90eXBlT2YoT2JqZWN0LmdldFByb3RvdHlwZU9mKGdsb2JhbFRoaXMpKSAhPT1cbiAgICAgICAgT2JqZWN0LnByb3RvdHlwZSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD13ZWIuanMubWFwIiwiaW1wb3J0IHsgT2JqZWN0QWNjdW11bGF0b3IgfSBmcm9tIFwidHlwZWQtb2JqZWN0LWFjY3VtdWxhdG9yXCI7XG5pbXBvcnQgeyB0b0VOVkZvcm1hdCB9IGZyb20gXCIuL3RleHQuanNcIjtcbmltcG9ydCB7IGlzQnJvd3NlciB9IGZyb20gXCIuL3dlYi5qc1wiO1xuaW1wb3J0IHsgQnJvd3NlckVudktleSwgRGVmYXVsdExvZ2dpbmdDb25maWcsIEVOVl9QQVRIX0RFTElNSVRFUiwgfSBmcm9tIFwiLi9jb25zdGFudHMuanNcIjtcbi8qKlxuICogQGRlc2NyaXB0aW9uIEVudmlyb25tZW50IGFjY3VtdWxhdG9yIHRoYXQgbGF6aWx5IHJlYWRzIGZyb20gcnVudGltZSBzb3VyY2VzLlxuICogQHN1bW1hcnkgRXh0ZW5kcyB7QGxpbmsgT2JqZWN0QWNjdW11bGF0b3J9IHRvIG1lcmdlIGNvbmZpZ3VyYXRpb24gb2JqZWN0cyB3aGlsZSByZXNvbHZpbmcgdmFsdWVzIGZyb20gTm9kZSBvciBicm93c2VyIGVudmlyb25tZW50IHZhcmlhYmxlcyBvbiBkZW1hbmQuXG4gKiBAdGVtcGxhdGUgVFxuICogQGNsYXNzIEVudmlyb25tZW50XG4gKiBAZXhhbXBsZVxuICogY29uc3QgQ29uZmlnID0gRW52aXJvbm1lbnQuYWNjdW11bGF0ZSh7IGxvZ2dpbmc6IHsgbGV2ZWw6IFwiaW5mb1wiIH0gfSk7XG4gKiBjb25zb2xlLmxvZyhDb25maWcubG9nZ2luZy5sZXZlbCk7XG4gKiBjb25zb2xlLmxvZyhTdHJpbmcoQ29uZmlnLmxvZ2dpbmcubGV2ZWwpKTsgLy8gPT4gTE9HR0lOR19fTEVWRUwga2V5IHdoZW4gc2VyaWFsaXplZFxuICogQG1lcm1haWRcbiAqIHNlcXVlbmNlRGlhZ3JhbVxuICogICBwYXJ0aWNpcGFudCBDbGllbnRcbiAqICAgcGFydGljaXBhbnQgRW52IGFzIEVudmlyb25tZW50XG4gKiAgIHBhcnRpY2lwYW50IFByb2Nlc3MgYXMgcHJvY2Vzcy5lbnZcbiAqICAgcGFydGljaXBhbnQgQnJvd3NlciBhcyBnbG9iYWxUaGlzLkVOVlxuICogICBDbGllbnQtPj5FbnY6IGFjY3VtdWxhdGUocGFydGlhbENvbmZpZylcbiAqICAgRW52LT4+RW52OiBleHBhbmQodmFsdWVzKVxuICogICBDbGllbnQtPj5FbnY6IENvbmZpZy5sb2dnaW5nLmxldmVsXG4gKiAgIGFsdCBCcm93c2VyIHJ1bnRpbWVcbiAqICAgICBFbnYtPj5Ccm93c2VyOiBsb29rdXAgRU5WIGtleVxuICogICAgIEJyb3dzZXItLT4+RW52OiByZXNvbHZlZCB2YWx1ZVxuICogICBlbHNlIE5vZGUgcnVudGltZVxuICogICAgIEVudi0+PlByb2Nlc3M6IGxvb2t1cCBFTlYga2V5XG4gKiAgICAgUHJvY2Vzcy0tPj5FbnY6IHJlc29sdmVkIHZhbHVlXG4gKiAgIGVuZFxuICogICBFbnYtLT4+Q2xpZW50OiBtZXJnZWQgdmFsdWVcbiAqL1xuY29uc3QgRW1wdHlWYWx1ZSA9IFN5bWJvbChcIkVudmlyb25tZW50RW1wdHlcIik7XG5jb25zdCBNb2RlbFN5bWJvbCA9IFN5bWJvbChcIkVudmlyb25tZW50TW9kZWxcIik7XG5leHBvcnQgY2xhc3MgRW52aXJvbm1lbnQgZXh0ZW5kcyBPYmplY3RBY2N1bXVsYXRvciB7XG4gICAgLyoqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKiBAZGVzY3JpcHRpb24gQSBmYWN0b3J5IGZ1bmN0aW9uIGZvciBjcmVhdGluZyBFbnZpcm9ubWVudCBpbnN0YW5jZXMuXG4gICAgICogQHN1bW1hcnkgRGVmaW5lcyBob3cgbmV3IGluc3RhbmNlcyBvZiB0aGUgRW52aXJvbm1lbnQgY2xhc3Mgc2hvdWxkIGJlIGNyZWF0ZWQuXG4gICAgICogQHJldHVybiB7RW52aXJvbm1lbnQ8YW55Pn0gQSBuZXcgaW5zdGFuY2Ugb2YgdGhlIEVudmlyb25tZW50IGNsYXNzLlxuICAgICAqL1xuICAgIHN0YXRpYyB7IHRoaXMuZmFjdG9yeSA9ICgpID0+IG5ldyBFbnZpcm9ubWVudCgpOyB9XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBNb2RlbFN5bWJvbCwge1xuICAgICAgICAgICAgdmFsdWU6IHt9LFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gUmV0cmlldmVzIGEgdmFsdWUgZnJvbSB0aGUgcnVudGltZSBlbnZpcm9ubWVudC5cbiAgICAgKiBAc3VtbWFyeSBIYW5kbGVzIGJyb3dzZXIgYW5kIE5vZGUuanMgZW52aXJvbm1lbnRzIGJ5IG5vcm1hbGl6aW5nIGtleXMgYW5kIHBhcnNpbmcgdmFsdWVzLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrIC0gS2V5IHRvIHJlc29sdmUgZnJvbSB0aGUgZW52aXJvbm1lbnQuXG4gICAgICogQHJldHVybiB7dW5rbm93bn0gVmFsdWUgcmVzb2x2ZWQgZnJvbSB0aGUgZW52aXJvbm1lbnQgb3IgYHVuZGVmaW5lZGAgd2hlbiBhYnNlbnQuXG4gICAgICovXG4gICAgZnJvbUVudihrKSB7XG4gICAgICAgIGxldCBlbnY7XG4gICAgICAgIGlmIChpc0Jyb3dzZXIoKSkge1xuICAgICAgICAgICAgZW52ID1cbiAgICAgICAgICAgICAgICBnbG9iYWxUaGlzW0Jyb3dzZXJFbnZLZXldIHx8IHt9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZW52ID0gZ2xvYmFsVGhpcy5wcm9jZXNzLmVudjtcbiAgICAgICAgICAgIGsgPSB0b0VOVkZvcm1hdChrKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5wYXJzZUVudlZhbHVlKGVudltrXSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBDb252ZXJ0cyBzdHJpbmdpZmllZCBlbnZpcm9ubWVudCB2YWx1ZXMgaW50byBuYXRpdmUgdHlwZXMuXG4gICAgICogQHN1bW1hcnkgSW50ZXJwcmV0cyBib29sZWFucyBhbmQgbnVtYmVycyB3aGlsZSBsZWF2aW5nIG90aGVyIHR5cGVzIHVuY2hhbmdlZC5cbiAgICAgKiBAcGFyYW0ge3Vua25vd259IHZhbCAtIFJhdyB2YWx1ZSByZXRyaWV2ZWQgZnJvbSB0aGUgZW52aXJvbm1lbnQuXG4gICAgICogQHJldHVybiB7dW5rbm93bn0gUGFyc2VkIHZhbHVlIGNvbnZlcnRlZCB0byBib29sZWFuLCBudW1iZXIsIG9yIGxlZnQgYXMtaXMuXG4gICAgICovXG4gICAgcGFyc2VFbnZWYWx1ZSh2YWwpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWwgIT09IFwic3RyaW5nXCIpXG4gICAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICBpZiAodmFsID09PSBcInRydWVcIilcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBpZiAodmFsID09PSBcImZhbHNlXCIpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlRmxvYXQodmFsKTtcbiAgICAgICAgaWYgKCFpc05hTihyZXN1bHQpKVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgcmV0dXJuIHZhbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEV4cGFuZHMgYW4gb2JqZWN0IGludG8gdGhlIGVudmlyb25tZW50LlxuICAgICAqIEBzdW1tYXJ5IERlZmluZXMgbGF6eSBwcm9wZXJ0aWVzIHRoYXQgZmlyc3QgY29uc3VsdCBydW50aW1lIHZhcmlhYmxlcyBiZWZvcmUgZmFsbGluZyBiYWNrIHRvIHNlZWRlZCB2YWx1ZXMuXG4gICAgICogQHRlbXBsYXRlIFYgLSBUeXBlIG9mIHRoZSBvYmplY3QgYmVpbmcgZXhwYW5kZWQuXG4gICAgICogQHBhcmFtIHtWfSB2YWx1ZSAtIE9iamVjdCB0byBleHBvc2UgdGhyb3VnaCBlbnZpcm9ubWVudCBnZXR0ZXJzIGFuZCBzZXR0ZXJzLlxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgZXhwYW5kKHZhbHVlKSB7XG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHZhbHVlKS5mb3JFYWNoKChbaywgdl0pID0+IHtcbiAgICAgICAgICAgIEVudmlyb25tZW50Lm1lcmdlTW9kZWwodGhpc1tNb2RlbFN5bWJvbF0sIGssIHYpO1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIGssIHtcbiAgICAgICAgICAgICAgICBnZXQ6ICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZnJvbUVudiA9IHRoaXMuZnJvbUVudihrKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBmcm9tRW52ICE9PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZyb21FbnY7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2ICYmIHR5cGVvZiB2ID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gRW52aXJvbm1lbnQuYnVpbGRFbnZQcm94eSh2LCBba10pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBtb2RlbCBwcm92aWRlcyBhbiBlbXB0eSBzdHJpbmcsIG1hcmsgd2l0aCBFbXB0eVZhbHVlIHNvIGluc3RhbmNlIHByb3h5IGNhbiByZXR1cm4gdW5kZWZpbmVkIHdpdGhvdXQgZW5hYmxpbmcga2V5IGNvbXBvc2l0aW9uXG4gICAgICAgICAgICAgICAgICAgIGlmICh2ID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gRW1wdHlWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdjtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNldDogKHZhbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB2ID0gdmFsO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBSZXR1cm5zIGEgcHJveHkgZW5mb3JjaW5nIHJlcXVpcmVkIGVudmlyb25tZW50IHZhcmlhYmxlcy5cbiAgICAgKiBAc3VtbWFyeSBBY2Nlc3NpbmcgYSBwcm9wZXJ0eSB0aGF0IHJlc29sdmVzIHRvIGB1bmRlZmluZWRgIG9yIGFuIGVtcHR5IHN0cmluZyB3aGVuIGRlY2xhcmVkIGluIHRoZSBtb2RlbCB0aHJvd3MgYW4gZXJyb3IuXG4gICAgICogQHJldHVybiB7dGhpc30gUHJveHkgb2YgdGhlIGVudmlyb25tZW50IGVuZm9yY2luZyByZXF1aXJlZCB2YXJpYWJsZXMuXG4gICAgICovXG4gICAgb3JUaHJvdygpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby10aGlzLWFsaWFzXG4gICAgICAgIGNvbnN0IGJhc2UgPSB0aGlzO1xuICAgICAgICBjb25zdCBtb2RlbFJvb3QgPSBiYXNlW01vZGVsU3ltYm9sXTtcbiAgICAgICAgY29uc3QgYnVpbGRLZXkgPSAocGF0aCkgPT4gcGF0aC5tYXAoKHNlZ21lbnQpID0+IHRvRU5WRm9ybWF0KHNlZ21lbnQpKS5qb2luKEVOVl9QQVRIX0RFTElNSVRFUik7XG4gICAgICAgIGNvbnN0IHJlYWRSdW50aW1lID0gKGtleSkgPT4gRW52aXJvbm1lbnQucmVhZFJ1bnRpbWVFbnYoa2V5KTtcbiAgICAgICAgY29uc3QgcGFyc2VSdW50aW1lID0gKHJhdykgPT4gdHlwZW9mIHJhdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHRoaXMucGFyc2VFbnZWYWx1ZShyYXcpIDogdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCBtaXNzaW5nID0gKGtleSwgZW1wdHkgPSBmYWxzZSkgPT4gRW52aXJvbm1lbnQubWlzc2luZ0VudkVycm9yKGtleSwgZW1wdHkpO1xuICAgICAgICBjb25zdCBjcmVhdGVOZXN0ZWRQcm94eSA9IChtb2RlbCwgcGF0aCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaGFuZGxlciA9IHtcbiAgICAgICAgICAgICAgICBnZXQoX3RhcmdldCwgcHJvcCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHByb3AgIT09IFwic3RyaW5nXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXh0UGF0aCA9IFsuLi5wYXRoLCBwcm9wXTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZW52S2V5ID0gYnVpbGRLZXkobmV4dFBhdGgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBydW50aW1lUmF3ID0gcmVhZFJ1bnRpbWUoZW52S2V5KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBydW50aW1lUmF3ID09PSBcInN0cmluZ1wiICYmIHJ1bnRpbWVSYXcubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbWlzc2luZyhlbnZLZXksIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBydW50aW1lVmFsdWUgPSBwYXJzZVJ1bnRpbWUocnVudGltZVJhdyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcnVudGltZVZhbHVlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJ1bnRpbWVWYWx1ZSA9PT0gXCJzdHJpbmdcIiAmJiBydW50aW1lVmFsdWUubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG1pc3NpbmcoZW52S2V5LCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBydW50aW1lVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaGFzUHJvcCA9IG1vZGVsICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2RlbCwgcHJvcCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaGFzUHJvcClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG1pc3NpbmcoZW52S2V5KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbW9kZWxWYWx1ZSA9IG1vZGVsW3Byb3BdO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG1vZGVsVmFsdWUgPT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICBpZiAobW9kZWxWYWx1ZSA9PT0gXCJcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG1pc3NpbmcoZW52S2V5KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1vZGVsVmFsdWUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiBtb2RlbFZhbHVlID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAhQXJyYXkuaXNBcnJheShtb2RlbFZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZU5lc3RlZFByb3h5KG1vZGVsVmFsdWUsIG5leHRQYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbW9kZWxWYWx1ZTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG93bktleXMoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtb2RlbCA/IFJlZmxlY3Qub3duS2V5cyhtb2RlbCkgOiBbXTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihfdGFyZ2V0LCBwcm9wKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghbW9kZWwpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZGVsLCBwcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJveHkoe30sIGhhbmRsZXIpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBoYW5kbGVyID0ge1xuICAgICAgICAgICAgZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHByb3AgIT09IFwic3RyaW5nXCIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKTtcbiAgICAgICAgICAgICAgICBjb25zdCBoYXNNb2RlbFByb3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kZWxSb290LCBwcm9wKTtcbiAgICAgICAgICAgICAgICBpZiAoIWhhc01vZGVsUHJvcClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGVudktleSA9IGJ1aWxkS2V5KFtwcm9wXSk7XG4gICAgICAgICAgICAgICAgY29uc3QgcnVudGltZVJhdyA9IHJlYWRSdW50aW1lKGVudktleSk7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBydW50aW1lUmF3ID09PSBcInN0cmluZ1wiICYmIHJ1bnRpbWVSYXcubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBtaXNzaW5nKGVudktleSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgY29uc3QgcnVudGltZVZhbHVlID0gcGFyc2VSdW50aW1lKHJ1bnRpbWVSYXcpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcnVudGltZVZhbHVlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcnVudGltZVZhbHVlID09PSBcInN0cmluZ1wiICYmIHJ1bnRpbWVWYWx1ZS5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBtaXNzaW5nKGVudktleSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBydW50aW1lVmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IG1vZGVsVmFsdWUgPSBtb2RlbFJvb3RbcHJvcF07XG4gICAgICAgICAgICAgICAgaWYgKG1vZGVsVmFsdWUgJiZcbiAgICAgICAgICAgICAgICAgICAgdHlwZW9mIG1vZGVsVmFsdWUgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgICAgICAgICAgIUFycmF5LmlzQXJyYXkobW9kZWxWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZU5lc3RlZFByb3h5KG1vZGVsVmFsdWUsIFtwcm9wXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbW9kZWxWYWx1ZSA9PT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGFjdHVhbCA9IFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcCk7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBhY3R1YWwgPT09IFwidW5kZWZpbmVkXCIgfHwgYWN0dWFsID09PSBcIlwiKVxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBtaXNzaW5nKGVudktleSwgYWN0dWFsID09PSBcIlwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYWN0dWFsO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eShiYXNlLCBoYW5kbGVyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHByb3RlY3RlZFxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAZGVzY3JpcHRpb24gUmV0cmlldmVzIG9yIGNyZWF0ZXMgdGhlIHNpbmdsZXRvbiBpbnN0YW5jZSBvZiB0aGUgRW52aXJvbm1lbnQgY2xhc3MuXG4gICAgICogQHN1bW1hcnkgRW5zdXJlcyBvbmx5IG9uZSB7QGxpbmsgRW52aXJvbm1lbnR9IGluc3RhbmNlIGlzIGNyZWF0ZWQsIHdyYXBwaW5nIGl0IGluIGEgcHJveHkgdG8gY29tcG9zZSBFTlYga2V5cyBvbiBkZW1hbmQuXG4gICAgICogQHRlbXBsYXRlIEVcbiAgICAgKiBAcGFyYW0gey4uLnVua25vd25bXX0gYXJncyAtIEFyZ3VtZW50cyBmb3J3YXJkZWQgdG8gdGhlIGZhY3Rvcnkgd2hlbiBpbnN0YW50aWF0aW5nIHRoZSBzaW5nbGV0b24uXG4gICAgICogQHJldHVybiB7RX0gU2luZ2xldG9uIGVudmlyb25tZW50IGluc3RhbmNlLlxuICAgICAqL1xuICAgIHN0YXRpYyBpbnN0YW5jZSguLi5hcmdzKSB7XG4gICAgICAgIGlmICghRW52aXJvbm1lbnQuX2luc3RhbmNlKSB7XG4gICAgICAgICAgICBjb25zdCBiYXNlID0gRW52aXJvbm1lbnQuZmFjdG9yeSguLi5hcmdzKTtcbiAgICAgICAgICAgIGNvbnN0IHByb3hpZWQgPSBuZXcgUHJveHkoYmFzZSwge1xuICAgICAgICAgICAgICAgIGdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcik7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gRW1wdHlWYWx1ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBwcm9wZXJ0eSBleGlzdHMgb24gdGhlIGluc3RhbmNlIGJ1dCByZXNvbHZlcyB0byB1bmRlZmluZWQsIHJldHVybiB1bmRlZmluZWQgKG5vIHByb3h5KVxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHByb3AgPT09IFwic3RyaW5nXCIgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0YXJnZXQsIHByb3ApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9wID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBdm9pZCBpbnRlcmZlcmluZyB3aXRoIGxvZ2dpbmcgY29uZmlnIGxvb2t1cHMgZm9yIG9wdGlvbmFsIGZpZWxkcyBsaWtlICdhcHAnXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcCA9PT0gXCJhcHBcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEVudmlyb25tZW50LmJ1aWxkRW52UHJveHkodW5kZWZpbmVkLCBbcHJvcF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBFbnZpcm9ubWVudC5faW5zdGFuY2UgPSBwcm94aWVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBFbnZpcm9ubWVudC5faW5zdGFuY2U7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAZGVzY3JpcHRpb24gQWNjdW11bGF0ZXMgdGhlIGdpdmVuIHZhbHVlIGludG8gdGhlIGVudmlyb25tZW50LlxuICAgICAqIEBzdW1tYXJ5IEFkZHMgbmV3IHByb3BlcnRpZXMsIGhpZGluZyByYXcgZGVzY3JpcHRvcnMgdG8gYXZvaWQgbGVha2luZyBlbnVtZXJhdGlvbiBzZW1hbnRpY3MuXG4gICAgICogQHRlbXBsYXRlIFRcbiAgICAgKiBAdGVtcGxhdGUgVlxuICAgICAqIEBwYXJhbSB7Vn0gdmFsdWUgLSBPYmplY3QgdG8gbWVyZ2UgaW50byB0aGUgZW52aXJvbm1lbnQuXG4gICAgICogQHJldHVybiB7RW52aXJvbm1lbnR9IFVwZGF0ZWQgZW52aXJvbm1lbnQgcmVmZXJlbmNlLlxuICAgICAqL1xuICAgIHN0YXRpYyBhY2N1bXVsYXRlKHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gRW52aXJvbm1lbnQuaW5zdGFuY2UoKTtcbiAgICAgICAgT2JqZWN0LmtleXMoaW5zdGFuY2UpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaW5zdGFuY2UsIGtleSk7XG4gICAgICAgICAgICBpZiAoZGVzYyAmJiBkZXNjLmNvbmZpZ3VyYWJsZSAmJiBkZXNjLmVudW1lcmFibGUpIHtcbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoaW5zdGFuY2UsIGtleSwge1xuICAgICAgICAgICAgICAgICAgICAuLi5kZXNjLFxuICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBpbnN0YW5jZS5hY2N1bXVsYXRlKHZhbHVlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFJldHJpZXZlcyBhIHZhbHVlIHVzaW5nIGEgZG90LXBhdGgga2V5IGZyb20gdGhlIGFjY3VtdWxhdGVkIGVudmlyb25tZW50LlxuICAgICAqIEBzdW1tYXJ5IERlbGVnYXRlcyB0byB0aGUgc2luZ2xldG9uIGluc3RhbmNlIHRvIGFjY2VzcyBzdG9yZWQgY29uZmlndXJhdGlvbi5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0gS2V5IHRvIHJlc29sdmUgZnJvbSB0aGUgZW52aXJvbm1lbnQgc3RvcmUuXG4gICAgICogQHJldHVybiB7dW5rbm93bn0gU3RvcmVkIHZhbHVlIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHByb3ZpZGVkIGtleS5cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0KGtleSkge1xuICAgICAgICByZXR1cm4gRW52aXJvbm1lbnQuX2luc3RhbmNlLmdldChrZXkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gQnVpbGRzIGEgcHJveHkgdGhhdCBjb21wb3NlcyBlbnZpcm9ubWVudCBrZXlzIGZvciBuZXN0ZWQgcHJvcGVydGllcy5cbiAgICAgKiBAc3VtbWFyeSBBbGxvd3MgY2hhaW5lZCBwcm9wZXJ0eSBhY2Nlc3MgdG8gZW1pdCB1cHBlcmNhc2UgRU5WIGlkZW50aWZpZXJzIHdoaWxlIGhvbm9yaW5nIGV4aXN0aW5nIHJ1bnRpbWUgb3ZlcnJpZGVzLlxuICAgICAqIEBwYXJhbSB7YW55fSBjdXJyZW50IC0gU2VlZCBtb2RlbCBzZWdtZW50IHVzZWQgd2hlbiBwcm9qZWN0aW5nIG5lc3RlZCBzdHJ1Y3R1cmVzLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nW119IHBhdGggLSBBY2N1bXVsYXRlZCBwYXRoIHNlZ21lbnRzIGxlYWRpbmcgdG8gdGhlIHByb3h5LlxuICAgICAqIEByZXR1cm4ge2FueX0gUHJveHkgdGhhdCByZXNvbHZlcyBlbnZpcm9ubWVudCB2YWx1ZXMgb3IgY29tcG9zZXMgYWRkaXRpb25hbCBwcm94aWVzIGZvciBkZWVwZXIgcGF0aHMuXG4gICAgICovXG4gICAgc3RhdGljIGJ1aWxkRW52UHJveHkoY3VycmVudCwgcGF0aCkge1xuICAgICAgICBjb25zdCBidWlsZEtleSA9IChwKSA9PiBwLm1hcCgoc2VnKSA9PiB0b0VOVkZvcm1hdChzZWcpKS5qb2luKEVOVl9QQVRIX0RFTElNSVRFUik7XG4gICAgICAgIC8vIEhlbHBlciB0byByZWFkIGZyb20gdGhlIGFjdGl2ZSBlbnZpcm9ubWVudCBnaXZlbiBhIGNvbXBvc2VkIGtleVxuICAgICAgICBjb25zdCByZWFkRW52ID0gKGtleSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIEVudmlyb25tZW50LnJlYWRSdW50aW1lRW52KGtleSk7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSB7XG4gICAgICAgICAgICBnZXQoX3RhcmdldCwgcHJvcCkge1xuICAgICAgICAgICAgICAgIGlmIChwcm9wID09PSBTeW1ib2wudG9QcmltaXRpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgpID0+IGJ1aWxkS2V5KHBhdGgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocHJvcCA9PT0gXCJ0b1N0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiBidWlsZEtleShwYXRoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHByb3AgPT09IFwidmFsdWVPZlwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiBidWlsZEtleShwYXRoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9wID09PSBcInN5bWJvbFwiKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGNvbnN0IGhhc1Byb3AgPSAhIWN1cnJlbnQgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGN1cnJlbnQsIHByb3ApO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5leHRNb2RlbCA9IGhhc1Byb3AgPyBjdXJyZW50W3Byb3BdIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5leHRQYXRoID0gWy4uLnBhdGgsIHByb3BdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbXBvc2VkS2V5ID0gYnVpbGRLZXkobmV4dFBhdGgpO1xuICAgICAgICAgICAgICAgIC8vIElmIGFuIEVOViB2YWx1ZSBleGlzdHMgZm9yIHRoaXMgcGF0aCwgcmV0dXJuIGl0IGRpcmVjdGx5XG4gICAgICAgICAgICAgICAgY29uc3QgZW52VmFsdWUgPSByZWFkRW52KGNvbXBvc2VkS2V5KTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGVudlZhbHVlICE9PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZW52VmFsdWU7XG4gICAgICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCBpZiB0aGUgbW9kZWwgaGFzIGFuIG9iamVjdCBhdCB0aGlzIHBhdGgsIGtlZXAgZHJpbGxpbmcgd2l0aCBhIHByb3h5XG4gICAgICAgICAgICAgICAgY29uc3QgaXNOZXh0T2JqZWN0ID0gbmV4dE1vZGVsICYmIHR5cGVvZiBuZXh0TW9kZWwgPT09IFwib2JqZWN0XCI7XG4gICAgICAgICAgICAgICAgaWYgKGlzTmV4dE9iamVjdClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEVudmlyb25tZW50LmJ1aWxkRW52UHJveHkobmV4dE1vZGVsLCBuZXh0UGF0aCk7XG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIG1vZGVsIG1hcmtzIHRoaXMgbGVhZiBhcyBhbiBlbXB0eSBzdHJpbmcsIHRyZWF0IGFzIHVuZGVmaW5lZCAobm8gcHJveHkpXG4gICAgICAgICAgICAgICAgaWYgKGhhc1Byb3AgJiYgbmV4dE1vZGVsID09PSBcIlwiKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBtb2RlbCBleHBsaWNpdGx5IGNvbnRhaW5zIHRoZSBwcm9wZXJ0eSB3aXRoIHZhbHVlIHVuZGVmaW5lZCwgdHJlYXQgYXMgdW5kZWZpbmVkIChubyBwcm94eSlcbiAgICAgICAgICAgICAgICBpZiAoaGFzUHJvcCAmJiB0eXBlb2YgbmV4dE1vZGVsID09PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIC8vIEFsd2F5cyByZXR1cm4gYSBwcm94eSBmb3IgZnVydGhlciBwYXRoIGNvbXBvc2l0aW9uIHdoZW4gbm8gRU5WIHZhbHVlO1xuICAgICAgICAgICAgICAgIC8vIGRvIG5vdCBzdXJmYWNlIHByaW1pdGl2ZSBtb2RlbCBkZWZhdWx0cyBoZXJlICh0aGlzIEFQSSBpcyBmb3Iga2V5IGNvbXBvc2l0aW9uKS5cbiAgICAgICAgICAgICAgICByZXR1cm4gRW52aXJvbm1lbnQuYnVpbGRFbnZQcm94eSh1bmRlZmluZWQsIG5leHRQYXRoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvd25LZXlzKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50ID8gUmVmbGVjdC5vd25LZXlzKGN1cnJlbnQpIDogW107XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKF90LCBwKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFjdXJyZW50KVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoY3VycmVudCwgcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCB0YXJnZXQgPSB7fTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eSh0YXJnZXQsIGhhbmRsZXIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAc3RhdGljXG4gICAgICogQGRlc2NyaXB0aW9uIFJldHJpZXZlcyB0aGUga2V5cyBvZiB0aGUgZW52aXJvbm1lbnQsIG9wdGlvbmFsbHkgY29udmVydGluZyB0aGVtIHRvIEVOViBmb3JtYXQuXG4gICAgICogQHN1bW1hcnkgR2V0cyBhbGwga2V5cyBpbiB0aGUgZW52aXJvbm1lbnQsIHdpdGggYW4gb3B0aW9uIHRvIGZvcm1hdCB0aGVtIGZvciBlbnZpcm9ubWVudCB2YXJpYWJsZXMuXG4gICAgICogQHBhcmFtIHtib29sZWFufSBbdG9FbnY9dHJ1ZV0gLSBXaGV0aGVyIHRvIGNvbnZlcnQgdGhlIGtleXMgdG8gRU5WIGZvcm1hdC5cbiAgICAgKiBAcmV0dXJuIHtzdHJpbmdbXX0gQW4gYXJyYXkgb2Yga2V5cyBmcm9tIHRoZSBlbnZpcm9ubWVudC5cbiAgICAgKi9cbiAgICBzdGF0aWMga2V5cyh0b0VudiA9IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIEVudmlyb25tZW50Lmluc3RhbmNlKClcbiAgICAgICAgICAgIC5rZXlzKClcbiAgICAgICAgICAgIC5tYXAoKGspID0+ICh0b0VudiA/IHRvRU5WRm9ybWF0KGspIDogaykpO1xuICAgIH1cbiAgICBzdGF0aWMgbWVyZ2VNb2RlbChtb2RlbCwga2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAoIW1vZGVsKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgY29uc3QgZXhpc3RpbmcgPSBtb2RlbFtrZXldO1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gZXhpc3RpbmcgJiYgdHlwZW9mIGV4aXN0aW5nID09PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KGV4aXN0aW5nKVxuICAgICAgICAgICAgICAgID8gZXhpc3RpbmdcbiAgICAgICAgICAgICAgICA6IHt9O1xuICAgICAgICAgICAgbW9kZWxba2V5XSA9IHRhcmdldDtcbiAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKHZhbHVlKS5mb3JFYWNoKChbY2hpbGRLZXksIGNoaWxkVmFsdWVdKSA9PiB7XG4gICAgICAgICAgICAgICAgRW52aXJvbm1lbnQubWVyZ2VNb2RlbCh0YXJnZXQsIGNoaWxkS2V5LCBjaGlsZFZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIG1vZGVsW2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gICAgc3RhdGljIHJlYWRSdW50aW1lRW52KGtleSkge1xuICAgICAgICBpZiAoaXNCcm93c2VyKCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGVudiA9IGdsb2JhbFRoaXNbQnJvd3NlckVudktleV07XG4gICAgICAgICAgICByZXR1cm4gZW52ID8gZW52W2tleV0gOiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGdsb2JhbFRoaXM/LnByb2Nlc3M/LmVudj8uW2tleV07XG4gICAgfVxuICAgIHN0YXRpYyBtaXNzaW5nRW52RXJyb3Ioa2V5LCBlbXB0eSkge1xuICAgICAgICBjb25zdCBzdWZmaXggPSBlbXB0eSA/IFwiYW4gZW1wdHkgc3RyaW5nXCIgOiBcInVuZGVmaW5lZFwiO1xuICAgICAgICByZXR1cm4gbmV3IEVycm9yKGBFbnZpcm9ubWVudCB2YXJpYWJsZSAke2tleX0gaXMgcmVxdWlyZWQgYnV0IHdhcyAke3N1ZmZpeH0uYCk7XG4gICAgfVxufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gU2luZ2xldG9uIGVudmlyb25tZW50IGluc3RhbmNlIHNlZWRlZCB3aXRoIGRlZmF1bHQgbG9nZ2luZyBjb25maWd1cmF0aW9uLlxuICogQHN1bW1hcnkgQ29tYmluZXMge0BsaW5rIERlZmF1bHRMb2dnaW5nQ29uZmlnfSB3aXRoIHJ1bnRpbWUgZW52aXJvbm1lbnQgdmFyaWFibGVzIHRvIHByb3ZpZGUgY29uc2lzdGVudCBsb2dnaW5nIGRlZmF1bHRzIGFjcm9zcyBwbGF0Zm9ybXMuXG4gKiBAY29uc3QgTG9nZ2VkRW52aXJvbm1lbnRcbiAqIEBtZW1iZXJPZiBtb2R1bGU6TG9nZ2luZ1xuICovXG5leHBvcnQgY29uc3QgTG9nZ2VkRW52aXJvbm1lbnQgPSBFbnZpcm9ubWVudC5hY2N1bXVsYXRlKE9iamVjdC5hc3NpZ24oe30sIERlZmF1bHRMb2dnaW5nQ29uZmlnLCB7XG4gICAgZW52OiAoaXNCcm93c2VyKCkgJiYgZ2xvYmFsVGhpc1tCcm93c2VyRW52S2V5XVxuICAgICAgICA/IGdsb2JhbFRoaXNbQnJvd3NlckVudktleV1bXCJOT0RFX0VOVlwiXVxuICAgICAgICA6IGdsb2JhbFRoaXMucHJvY2Vzcy5lbnZbXCJOT0RFX0VOVlwiXSkgfHwgXCJkZXZlbG9wbWVudFwiLFxufSkpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZW52aXJvbm1lbnQuanMubWFwIiwiaW1wb3J0IHsgc3R5bGUgfSBmcm9tIFwic3R5bGVkLXN0cmluZy1idWlsZGVyXCI7XG5pbXBvcnQgeyBEZWZhdWx0VGhlbWUsIExvZ0xldmVsLCBOdW1lcmljTG9nTGV2ZWxzIH0gZnJvbSBcIi4vY29uc3RhbnRzLmpzXCI7XG5pbXBvcnQgeyBzZiB9IGZyb20gXCIuL3RleHQuanNcIjtcbmltcG9ydCB7IExvZ2dlZEVudmlyb25tZW50IH0gZnJvbSBcIi4vZW52aXJvbm1lbnQuanNcIjtcbi8qKlxuICogQGRlc2NyaXB0aW9uIEEgbWluaW1hbCBsb2dnZXIgaW1wbGVtZW50YXRpb24uXG4gKiBAc3VtbWFyeSBNaW5pTG9nZ2VyIGlzIGEgbGlnaHR3ZWlnaHQgbG9nZ2luZyBjbGFzcyB0aGF0IGltcGxlbWVudHMgdGhlIExvZ2dlciBpbnRlcmZhY2UuXG4gKiBJdCBwcm92aWRlcyBiYXNpYyBsb2dnaW5nIGZ1bmN0aW9uYWxpdHkgd2l0aCBzdXBwb3J0IGZvciBkaWZmZXJlbnQgbG9nIGxldmVscywgdmVyYm9zaXR5LFxuICogY29udGV4dC1hd2FyZSBsb2dnaW5nLCBhbmQgY3VzdG9taXphYmxlIGZvcm1hdHRpbmcuXG4gKiBAcGFyYW0ge3N0cmluZ30gY29udGV4dCAtIFRoZSBjb250ZXh0ICh0eXBpY2FsbHkgY2xhc3MgbmFtZSkgdGhpcyBsb2dnZXIgaXMgYXNzb2NpYXRlZCB3aXRoXG4gKiBAcGFyYW0ge1BhcnRpYWw8TG9nZ2luZ0NvbmZpZz59IGNvbmYgLSBPcHRpb25hbCBjb25maWd1cmF0aW9uIHRvIG92ZXJyaWRlIGdsb2JhbCBzZXR0aW5nc1xuICogQGNsYXNzIE1pbmlMb2dnZXJcbiAqIEBleGFtcGxlXG4gKiAvLyBDcmVhdGUgYSBuZXcgbG9nZ2VyIGZvciBhIGNsYXNzXG4gKiBjb25zdCBsb2dnZXIgPSBuZXcgTWluaUxvZ2dlcignTXlDbGFzcycpO1xuICpcbiAqIC8vIExvZyBtZXNzYWdlcyBhdCBkaWZmZXJlbnQgbGV2ZWxzXG4gKiBsb2dnZXIuaW5mbygnVGhpcyBpcyBhbiBpbmZvIG1lc3NhZ2UnKTtcbiAqIGxvZ2dlci5kZWJ1ZygnVGhpcyBpcyBhIGRlYnVnIG1lc3NhZ2UnKTtcbiAqIGxvZ2dlci5lcnJvcignU29tZXRoaW5nIHdlbnQgd3JvbmcnKTtcbiAqXG4gKiAvLyBDcmVhdGUgYSBjaGlsZCBsb2dnZXIgZm9yIGEgc3BlY2lmaWMgbWV0aG9kXG4gKiBjb25zdCBtZXRob2RMb2dnZXIgPSBsb2dnZXIuZm9yKCdteU1ldGhvZCcpO1xuICogbWV0aG9kTG9nZ2VyLnZlcmJvc2UoJ0RldGFpbGVkIGluZm9ybWF0aW9uJywgMik7XG4gKlxuICogLy8gTG9nIHdpdGggY3VzdG9tIGNvbmZpZ3VyYXRpb25cbiAqIGxvZ2dlci5mb3IoJ3NwZWNpYWxNZXRob2QnLCB7IHN0eWxlOiB0cnVlIH0pLmluZm8oJ1N0eWxlZCBtZXNzYWdlJyk7XG4gKi9cbmV4cG9ydCBjbGFzcyBNaW5pTG9nZ2VyIHtcbiAgICBjb25zdHJ1Y3Rvcihjb250ZXh0LCBjb25mKSB7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgIHRoaXMuY29uZiA9IGNvbmY7XG4gICAgfVxuICAgIGNvbmZpZyhrZXkpIHtcbiAgICAgICAgaWYgKHRoaXMuY29uZiAmJiBrZXkgaW4gdGhpcy5jb25mKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uZltrZXldO1xuICAgICAgICByZXR1cm4gTG9nZ2luZy5nZXRDb25maWcoKVtrZXldO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gQ3JlYXRlcyBhIGNoaWxkIGxvZ2dlciBmb3IgYSBzcGVjaWZpYyBtZXRob2Qgb3IgY29udGV4dFxuICAgICAqIEBzdW1tYXJ5IFJldHVybnMgYSBuZXcgbG9nZ2VyIGluc3RhbmNlIHdpdGggdGhlIGN1cnJlbnQgY29udGV4dCBleHRlbmRlZCBieSB0aGUgc3BlY2lmaWVkIG1ldGhvZCBuYW1lXG4gICAgICogQHBhcmFtIHtzdHJpbmcgfCBGdW5jdGlvbn0gbWV0aG9kIC0gVGhlIG1ldGhvZCBuYW1lIG9yIGZ1bmN0aW9uIHRvIGNyZWF0ZSBhIGxvZ2dlciBmb3JcbiAgICAgKiBAcGFyYW0ge1BhcnRpYWw8TG9nZ2luZ0NvbmZpZz59IGNvbmZpZyAtIE9wdGlvbmFsIGNvbmZpZ3VyYXRpb24gdG8gb3ZlcnJpZGUgc2V0dGluZ3NcbiAgICAgKiBAcGFyYW0gey4uLmFueVtdfSBhcmdzIC0gQWRkaXRpb25hbCBhcmd1bWVudHMgdG8gcGFzcyB0byB0aGUgbG9nZ2VyIGZhY3RvcnlcbiAgICAgKiBAcmV0dXJuIHtMb2dnZXJ9IEEgbmV3IGxvZ2dlciBpbnN0YW5jZSBmb3IgdGhlIHNwZWNpZmllZCBtZXRob2RcbiAgICAgKi9cbiAgICBmb3IobWV0aG9kLCBjb25maWcsIFxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnNcbiAgICAuLi5hcmdzKSB7XG4gICAgICAgIGlmICghY29uZmlnICYmIHR5cGVvZiBtZXRob2QgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICAgIGNvbmZpZyA9IG1ldGhvZDtcbiAgICAgICAgICAgIG1ldGhvZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG1ldGhvZCA9IG1ldGhvZFxuICAgICAgICAgICAgICAgID8gdHlwZW9mIG1ldGhvZCA9PT0gXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgICAgICA/IG1ldGhvZFxuICAgICAgICAgICAgICAgICAgICA6IG1ldGhvZC5uYW1lXG4gICAgICAgICAgICAgICAgOiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eSh0aGlzLCB7XG4gICAgICAgICAgICBnZXQ6ICh0YXJnZXQsIHAsIHJlY2VpdmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gUmVmbGVjdC5nZXQodGFyZ2V0LCBwLCByZWNlaXZlcik7XG4gICAgICAgICAgICAgICAgaWYgKHAgPT09IFwiY29uZmlnXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm94eSh0aGlzLmNvbmZpZywge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2V0OiAodGFyZ2V0LCBwKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbmZpZyAmJiBwIGluIGNvbmZpZylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbmZpZ1twXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5nZXQodGFyZ2V0LCBwLCByZWNlaXZlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHAgPT09IFwiY29udGV4dFwiICYmIG1ldGhvZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW3Jlc3VsdCwgbWV0aG9kXS5qb2luKFwiLlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gQ3JlYXRlcyBhIGZvcm1hdHRlZCBsb2cgc3RyaW5nXG4gICAgICogQHN1bW1hcnkgR2VuZXJhdGVzIGEgbG9nIHN0cmluZyB3aXRoIHRpbWVzdGFtcCwgY29sb3JlZCBsb2cgbGV2ZWwsIGNvbnRleHQsIGFuZCBtZXNzYWdlXG4gICAgICogQHBhcmFtIHtMb2dMZXZlbH0gbGV2ZWwgLSBUaGUgbG9nIGxldmVsIGZvciB0aGlzIG1lc3NhZ2VcbiAgICAgKiBAcGFyYW0ge1N0cmluZ0xpa2UgfCBFcnJvcn0gbWVzc2FnZSAtIFRoZSBtZXNzYWdlIHRvIGxvZyBvciBhbiBFcnJvciBvYmplY3RcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW2Vycm9yXSAtIE9wdGlvbmFsIGVycm9yIHRvIGV4dHJhY3Qgc3RhY2sgdHJhY2UgdG8gaW5jbHVkZSBpbiB0aGUgbG9nXG4gICAgICogQHJldHVybiB7c3RyaW5nfSBBIGZvcm1hdHRlZCBsb2cgc3RyaW5nIHdpdGggYWxsIGNvbXBvbmVudHNcbiAgICAgKi9cbiAgICBjcmVhdGVMb2cobGV2ZWwsIG1lc3NhZ2UsIGVycm9yKSB7XG4gICAgICAgIGNvbnN0IGxvZyA9IHt9O1xuICAgICAgICBjb25zdCBzdHlsZSA9IHRoaXMuY29uZmlnKFwic3R5bGVcIik7XG4gICAgICAgIGNvbnN0IHNlcGFyYXRvciA9IHRoaXMuY29uZmlnKFwic2VwYXJhdG9yXCIpO1xuICAgICAgICBjb25zdCBhcHAgPSB0aGlzLmNvbmZpZyhcImFwcFwiKTtcbiAgICAgICAgaWYgKGFwcClcbiAgICAgICAgICAgIGxvZy5hcHAgPSBzdHlsZVxuICAgICAgICAgICAgICAgID8gTG9nZ2luZy50aGVtZShhcHAsIFwiYXBwXCIsIGxldmVsKVxuICAgICAgICAgICAgICAgIDogYXBwO1xuICAgICAgICBpZiAoc2VwYXJhdG9yKVxuICAgICAgICAgICAgbG9nLnNlcGFyYXRvciA9IHN0eWxlXG4gICAgICAgICAgICAgICAgPyBMb2dnaW5nLnRoZW1lKHNlcGFyYXRvciwgXCJzZXBhcmF0b3JcIiwgbGV2ZWwpXG4gICAgICAgICAgICAgICAgOiBzZXBhcmF0b3I7XG4gICAgICAgIGlmICh0aGlzLmNvbmZpZyhcInRpbWVzdGFtcFwiKSkge1xuICAgICAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcbiAgICAgICAgICAgIGNvbnN0IHRpbWVzdGFtcCA9IHN0eWxlID8gTG9nZ2luZy50aGVtZShkYXRlLCBcInRpbWVzdGFtcFwiLCBsZXZlbCkgOiBkYXRlO1xuICAgICAgICAgICAgbG9nLnRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jb25maWcoXCJsb2dMZXZlbFwiKSkge1xuICAgICAgICAgICAgY29uc3QgbHZsID0gc3R5bGVcbiAgICAgICAgICAgICAgICA/IExvZ2dpbmcudGhlbWUobGV2ZWwsIFwibG9nTGV2ZWxcIiwgbGV2ZWwpXG4gICAgICAgICAgICAgICAgOiBsZXZlbDtcbiAgICAgICAgICAgIGxvZy5sZXZlbCA9IGx2bC50b1VwcGVyQ2FzZSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNvbmZpZyhcImNvbnRleHRcIikpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRleHQgPSBzdHlsZVxuICAgICAgICAgICAgICAgID8gTG9nZ2luZy50aGVtZSh0aGlzLmNvbnRleHQsIFwiY2xhc3NcIiwgbGV2ZWwpXG4gICAgICAgICAgICAgICAgOiB0aGlzLmNvbnRleHQ7XG4gICAgICAgICAgICBsb2cuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY29uZmlnKFwiY29ycmVsYXRpb25JZFwiKSkge1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gc3R5bGVcbiAgICAgICAgICAgICAgICAgICAgPyBMb2dnaW5nLnRoZW1lKHRoaXMuY29uZmlnKFwiY29ycmVsYXRpb25JZFwiKS50b1N0cmluZygpLCBcImlkXCIsIGxldmVsKVxuICAgICAgICAgICAgICAgICAgICA6IHRoaXMuY29uZmlnKFwiY29ycmVsYXRpb25JZFwiKS50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgIGxvZy5jb3JyZWxhdGlvbklkID0gaWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbXNnID0gc3R5bGVcbiAgICAgICAgICAgID8gTG9nZ2luZy50aGVtZSh0eXBlb2YgbWVzc2FnZSA9PT0gXCJzdHJpbmdcIiA/IG1lc3NhZ2UgOiBtZXNzYWdlLm1lc3NhZ2UsIFwibWVzc2FnZVwiLCBsZXZlbClcbiAgICAgICAgICAgIDogdHlwZW9mIG1lc3NhZ2UgPT09IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICA/IG1lc3NhZ2VcbiAgICAgICAgICAgICAgICA6IG1lc3NhZ2UubWVzc2FnZTtcbiAgICAgICAgbG9nLm1lc3NhZ2UgPSBtc2c7XG4gICAgICAgIGlmIChlcnJvciB8fCBtZXNzYWdlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YWNrID0gc3R5bGVcbiAgICAgICAgICAgICAgICA/IExvZ2dpbmcudGhlbWUoKGVycm9yPy5zdGFjayB8fCBtZXNzYWdlLnN0YWNrKSwgXCJzdGFja1wiLCBsZXZlbClcbiAgICAgICAgICAgICAgICA6IGVycm9yPy5zdGFjayB8fCBcIlwiO1xuICAgICAgICAgICAgbG9nLnN0YWNrID0gYCB8ICR7KGVycm9yIHx8IG1lc3NhZ2UpLm1lc3NhZ2V9IC0gU3RhY2sgdHJhY2U6XFxuJHtzdGFja31gO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAodGhpcy5jb25maWcoXCJmb3JtYXRcIikpIHtcbiAgICAgICAgICAgIGNhc2UgXCJqc29uXCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGxvZyk7XG4gICAgICAgICAgICBjYXNlIFwicmF3XCI6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlnKFwicGF0dGVyblwiKVxuICAgICAgICAgICAgICAgICAgICAuc3BsaXQoXCIgXCIpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoKHMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzLm1hdGNoKC9cXHsuKj99L2cpKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHM7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZvcm1hdHRlZFMgPSBzZihzLCBsb2cpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZm9ybWF0dGVkUyAhPT0gcylcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXR0ZWRTO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoKHMpID0+IHMpXG4gICAgICAgICAgICAgICAgICAgIC5qb2luKFwiIFwiKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBsb2dnaW5nIGZvcm1hdDogJHt0aGlzLmNvbmZpZyhcImZvcm1hdFwiKX1gKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gTG9ncyBhIG1lc3NhZ2Ugd2l0aCB0aGUgc3BlY2lmaWVkIGxvZyBsZXZlbFxuICAgICAqIEBzdW1tYXJ5IENoZWNrcyBpZiB0aGUgbWVzc2FnZSBzaG91bGQgYmUgbG9nZ2VkIGJhc2VkIG9uIHRoZSBjdXJyZW50IGxvZyBsZXZlbCxcbiAgICAgKiB0aGVuIHVzZXMgdGhlIGFwcHJvcHJpYXRlIGNvbnNvbGUgbWV0aG9kIHRvIG91dHB1dCB0aGUgZm9ybWF0dGVkIGxvZ1xuICAgICAqIEBwYXJhbSB7TG9nTGV2ZWx9IGxldmVsIC0gVGhlIGxvZyBsZXZlbCBvZiB0aGUgbWVzc2FnZVxuICAgICAqIEBwYXJhbSB7U3RyaW5nTGlrZSB8IEVycm9yfSBtc2cgLSBUaGUgbWVzc2FnZSB0byBiZSBsb2dnZWQgb3IgYW4gRXJyb3Igb2JqZWN0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtlcnJvcl0gLSBPcHRpb25hbCBzdGFjayB0cmFjZSB0byBpbmNsdWRlIGluIHRoZSBsb2dcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIGxvZyhsZXZlbCwgbXNnLCBlcnJvcikge1xuICAgICAgICBjb25zdCBjb25mTHZsID0gdGhpcy5jb25maWcoXCJsZXZlbFwiKTtcbiAgICAgICAgaWYgKE51bWVyaWNMb2dMZXZlbHNbY29uZkx2bF0gPCBOdW1lcmljTG9nTGV2ZWxzW2xldmVsXSlcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgbGV0IG1ldGhvZDtcbiAgICAgICAgc3dpdGNoIChsZXZlbCkge1xuICAgICAgICAgICAgY2FzZSBMb2dMZXZlbC5iZW5jaG1hcms6XG4gICAgICAgICAgICAgICAgbWV0aG9kID0gY29uc29sZS5sb2c7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIExvZ0xldmVsLmluZm86XG4gICAgICAgICAgICAgICAgbWV0aG9kID0gY29uc29sZS5sb2c7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIExvZ0xldmVsLnZlcmJvc2U6XG4gICAgICAgICAgICBjYXNlIExvZ0xldmVsLmRlYnVnOlxuICAgICAgICAgICAgICAgIG1ldGhvZCA9IGNvbnNvbGUuZGVidWc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIExvZ0xldmVsLmVycm9yOlxuICAgICAgICAgICAgICAgIG1ldGhvZCA9IGNvbnNvbGUuZXJyb3I7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIExvZ0xldmVsLnRyYWNlOlxuICAgICAgICAgICAgICAgIG1ldGhvZCA9IGNvbnNvbGUudHJhY2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIExvZ0xldmVsLnNpbGx5OlxuICAgICAgICAgICAgICAgIG1ldGhvZCA9IGNvbnNvbGUudHJhY2U7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgbG9nIGxldmVsXCIpO1xuICAgICAgICB9XG4gICAgICAgIG1ldGhvZCh0aGlzLmNyZWF0ZUxvZyhsZXZlbCwgbXNnLCBlcnJvcikpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gTG9ncyBhIG1lc3NhZ2UgYXQgdGhlIGJlbmNobWFyayBsZXZlbFxuICAgICAqIEBzdW1tYXJ5IExvZ3MgYSBtZXNzYWdlIGF0IHRoZSBiZW5jaG1hcmsgbGV2ZWwgaWYgdGhlIGN1cnJlbnQgdmVyYm9zaXR5IHNldHRpbmcgYWxsb3dzIGl0XG4gICAgICogQHBhcmFtIHtTdHJpbmdMaWtlfSBtc2cgLSBUaGUgbWVzc2FnZSB0byBiZSBsb2dnZWRcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIGJlbmNobWFyayhtc2cpIHtcbiAgICAgICAgdGhpcy5sb2coTG9nTGV2ZWwuYmVuY2htYXJrLCBtc2cpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gTG9ncyBhIG1lc3NhZ2UgYXQgdGhlIHNpbGx5IGxldmVsXG4gICAgICogQHN1bW1hcnkgTG9ncyBhIG1lc3NhZ2UgYXQgdGhlIHNpbGx5IGxldmVsIGlmIHRoZSBjdXJyZW50IHZlcmJvc2l0eSBzZXR0aW5nIGFsbG93cyBpdFxuICAgICAqIEBwYXJhbSB7U3RyaW5nTGlrZX0gbXNnIC0gVGhlIG1lc3NhZ2UgdG8gYmUgbG9nZ2VkXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt2ZXJib3NpdHk9MF0gLSBUaGUgdmVyYm9zaXR5IGxldmVsIG9mIHRoZSBtZXNzYWdlXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBzaWxseShtc2csIHZlcmJvc2l0eSA9IDApIHtcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnKFwidmVyYm9zZVwiKSA+PSB2ZXJib3NpdHkpXG4gICAgICAgICAgICB0aGlzLmxvZyhMb2dMZXZlbC52ZXJib3NlLCBtc2cpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gTG9ncyBhIG1lc3NhZ2UgYXQgdGhlIHZlcmJvc2UgbGV2ZWxcbiAgICAgKiBAc3VtbWFyeSBMb2dzIGEgbWVzc2FnZSBhdCB0aGUgdmVyYm9zZSBsZXZlbCBpZiB0aGUgY3VycmVudCB2ZXJib3NpdHkgc2V0dGluZyBhbGxvd3MgaXRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ0xpa2V9IG1zZyAtIFRoZSBtZXNzYWdlIHRvIGJlIGxvZ2dlZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbdmVyYm9zaXR5PTBdIC0gVGhlIHZlcmJvc2l0eSBsZXZlbCBvZiB0aGUgbWVzc2FnZVxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgdmVyYm9zZShtc2csIHZlcmJvc2l0eSA9IDApIHtcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnKFwidmVyYm9zZVwiKSA+PSB2ZXJib3NpdHkpXG4gICAgICAgICAgICB0aGlzLmxvZyhMb2dMZXZlbC52ZXJib3NlLCBtc2cpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gTG9ncyBhIG1lc3NhZ2UgYXQgdGhlIGluZm8gbGV2ZWxcbiAgICAgKiBAc3VtbWFyeSBMb2dzIGEgbWVzc2FnZSBhdCB0aGUgaW5mbyBsZXZlbCBmb3IgZ2VuZXJhbCBhcHBsaWNhdGlvbiBpbmZvcm1hdGlvblxuICAgICAqIEBwYXJhbSB7U3RyaW5nTGlrZX0gbXNnIC0gVGhlIG1lc3NhZ2UgdG8gYmUgbG9nZ2VkXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBpbmZvKG1zZykge1xuICAgICAgICB0aGlzLmxvZyhMb2dMZXZlbC5pbmZvLCBtc2cpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gTG9ncyBhIG1lc3NhZ2UgYXQgdGhlIGRlYnVnIGxldmVsXG4gICAgICogQHN1bW1hcnkgTG9ncyBhIG1lc3NhZ2UgYXQgdGhlIGRlYnVnIGxldmVsIGZvciBkZXRhaWxlZCB0cm91Ymxlc2hvb3RpbmcgaW5mb3JtYXRpb25cbiAgICAgKiBAcGFyYW0ge1N0cmluZ0xpa2V9IG1zZyAtIFRoZSBtZXNzYWdlIHRvIGJlIGxvZ2dlZFxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgZGVidWcobXNnKSB7XG4gICAgICAgIHRoaXMubG9nKExvZ0xldmVsLmRlYnVnLCBtc2cpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gTG9ncyBhIG1lc3NhZ2UgYXQgdGhlIGVycm9yIGxldmVsXG4gICAgICogQHN1bW1hcnkgTG9ncyBhIG1lc3NhZ2UgYXQgdGhlIGVycm9yIGxldmVsIGZvciBlcnJvcnMgYW5kIGV4Y2VwdGlvbnNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ0xpa2UgfCBFcnJvcn0gbXNnIC0gVGhlIG1lc3NhZ2UgdG8gYmUgbG9nZ2VkIG9yIGFuIEVycm9yIG9iamVjdFxuICAgICAqIEBwYXJhbSBlXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBlcnJvcihtc2csIGUpIHtcbiAgICAgICAgdGhpcy5sb2coTG9nTGV2ZWwuZXJyb3IsIG1zZywgZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBMb2dzIGEgbWVzc2FnZSBhdCB0aGUgZXJyb3IgbGV2ZWxcbiAgICAgKiBAc3VtbWFyeSBMb2dzIGEgbWVzc2FnZSBhdCB0aGUgZXJyb3IgbGV2ZWwgZm9yIGVycm9ycyBhbmQgZXhjZXB0aW9uc1xuICAgICAqIEBwYXJhbSB7U3RyaW5nTGlrZX0gbXNnIC0gVGhlIG1lc3NhZ2UgdG8gYmUgbG9nZ2VkIG9yIGFuIEVycm9yIG9iamVjdFxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgd2Fybihtc2cpIHtcbiAgICAgICAgdGhpcy5sb2coTG9nTGV2ZWwud2FybiwgbXNnKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIExvZ3MgYSBtZXNzYWdlIGF0IHRoZSBlcnJvciBsZXZlbFxuICAgICAqIEBzdW1tYXJ5IExvZ3MgYSBtZXNzYWdlIGF0IHRoZSBlcnJvciBsZXZlbCBmb3IgZXJyb3JzIGFuZCBleGNlcHRpb25zXG4gICAgICogQHBhcmFtIHtTdHJpbmdMaWtlfSBtc2cgLSBUaGUgbWVzc2FnZSB0byBiZSBsb2dnZWQgb3IgYW4gRXJyb3Igb2JqZWN0XG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICB0cmFjZShtc2cpIHtcbiAgICAgICAgdGhpcy5sb2coTG9nTGV2ZWwudHJhY2UsIG1zZyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBVcGRhdGVzIHRoZSBsb2dnZXIgY29uZmlndXJhdGlvblxuICAgICAqIEBzdW1tYXJ5IE1lcmdlcyB0aGUgcHJvdmlkZWQgY29uZmlndXJhdGlvbiB3aXRoIHRoZSBleGlzdGluZyBjb25maWd1cmF0aW9uXG4gICAgICogQHBhcmFtIHtQYXJ0aWFsPExvZ2dpbmdDb25maWc+fSBjb25maWcgLSBUaGUgY29uZmlndXJhdGlvbiBvcHRpb25zIHRvIGFwcGx5XG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBzZXRDb25maWcoY29uZmlnKSB7XG4gICAgICAgIHRoaXMuY29uZiA9IHsgLi4uKHRoaXMuY29uZiB8fCB7fSksIC4uLmNvbmZpZyB9O1xuICAgIH1cbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uIEEgc3RhdGljIGNsYXNzIGZvciBtYW5hZ2luZyBsb2dnaW5nIG9wZXJhdGlvbnNcbiAqIEBzdW1tYXJ5IFRoZSBMb2dnaW5nIGNsYXNzIHByb3ZpZGVzIGEgY2VudHJhbGl6ZWQgbG9nZ2luZyBtZWNoYW5pc20gd2l0aCBzdXBwb3J0IGZvclxuICogZGlmZmVyZW50IGxvZyBsZXZlbHMsIHZlcmJvc2l0eSwgYW5kIHN0eWxpbmcuIEl0IHVzZXMgYSBzaW5nbGV0b24gcGF0dGVybiB0byBtYWludGFpbiBhIGdsb2JhbFxuICogbG9nZ2VyIGluc3RhbmNlIGFuZCBhbGxvd3MgY3JlYXRpbmcgc3BlY2lmaWMgbG9nZ2VycyBmb3IgZGlmZmVyZW50IGNsYXNzZXMgYW5kIG1ldGhvZHMuXG4gKiBAY2xhc3MgTG9nZ2luZ1xuICogQGV4YW1wbGVcbiAqIC8vIFNldCBnbG9iYWwgY29uZmlndXJhdGlvblxuICogTG9nZ2luZy5zZXRDb25maWcoeyBsZXZlbDogTG9nTGV2ZWwuZGVidWcsIHN0eWxlOiB0cnVlIH0pO1xuICpcbiAqIC8vIEdldCBhIGxvZ2dlciBmb3IgYSBzcGVjaWZpYyBjbGFzc1xuICogY29uc3QgbG9nZ2VyID0gTG9nZ2luZy5mb3IoJ015Q2xhc3MnKTtcbiAqXG4gKiAvLyBMb2cgbWVzc2FnZXMgYXQgZGlmZmVyZW50IGxldmVsc1xuICogbG9nZ2VyLmluZm8oJ0FwcGxpY2F0aW9uIHN0YXJ0ZWQnKTtcbiAqIGxvZ2dlci5kZWJ1ZygnUHJvY2Vzc2luZyBkYXRhLi4uJyk7XG4gKlxuICogLy8gTG9nIHdpdGggY29udGV4dFxuICogY29uc3QgbWV0aG9kTG9nZ2VyID0gTG9nZ2luZy5mb3IoJ015Q2xhc3MubXlNZXRob2QnKTtcbiAqIG1ldGhvZExvZ2dlci52ZXJib3NlKCdEZXRhaWxlZCBvcGVyYXRpb24gaW5mb3JtYXRpb24nLCAxKTtcbiAqXG4gKiAvLyBMb2cgZXJyb3JzXG4gKiB0cnkge1xuICogICAvLyBzb21lIG9wZXJhdGlvblxuICogfSBjYXRjaCAoZXJyb3IpIHtcbiAqICAgbG9nZ2VyLmVycm9yKGVycm9yKTtcbiAqIH1cbiAqIEBtZXJtYWlkXG4gKiBjbGFzc0RpYWdyYW1cbiAqICAgY2xhc3MgTG9nZ2VyIHtcbiAqICAgICA8PGludGVyZmFjZT4+XG4gKiAgICAgK2ZvcihtZXRob2QsIGNvbmZpZywgLi4uYXJncylcbiAqICAgICArc2lsbHkobXNnLCB2ZXJib3NpdHkpXG4gKiAgICAgK3ZlcmJvc2UobXNnLCB2ZXJib3NpdHkpXG4gKiAgICAgK2luZm8obXNnKVxuICogICAgICtkZWJ1Zyhtc2cpXG4gKiAgICAgK2Vycm9yKG1zZylcbiAqICAgICArc2V0Q29uZmlnKGNvbmZpZylcbiAqICAgfVxuICpcbiAqICAgY2xhc3MgTG9nZ2luZyB7XG4gKiAgICAgLWdsb2JhbDogTG9nZ2VyXG4gKiAgICAgLV9mYWN0b3J5OiBMb2dnZXJGYWN0b3J5XG4gKiAgICAgLV9jb25maWc6IExvZ2dpbmdDb25maWdcbiAqICAgICArc2V0RmFjdG9yeShmYWN0b3J5KVxuICogICAgICtzZXRDb25maWcoY29uZmlnKVxuICogICAgICtnZXRDb25maWcoKVxuICogICAgICtnZXQoKVxuICogICAgICt2ZXJib3NlKG1zZywgdmVyYm9zaXR5KVxuICogICAgICtpbmZvKG1zZylcbiAqICAgICArZGVidWcobXNnKVxuICogICAgICtzaWxseShtc2cpXG4gKiAgICAgK2Vycm9yKG1zZylcbiAqICAgICArZm9yKG9iamVjdCwgY29uZmlnLCAuLi5hcmdzKVxuICogICAgICtiZWNhdXNlKHJlYXNvbiwgaWQpXG4gKiAgICAgK3RoZW1lKHRleHQsIHR5cGUsIGxvZ2dlckxldmVsLCB0ZW1wbGF0ZSlcbiAqICAgfVxuICpcbiAqICAgY2xhc3MgTWluaUxvZ2dlciB7XG4gKiAgICAgK2NvbnN0cnVjdG9yKGNvbnRleHQsIGNvbmY/KVxuICogICB9XG4gKlxuICogICBMb2dnaW5nIC4uPiBMb2dnZXIgOiBjcmVhdGVzXG4gKiAgIExvZ2dpbmcgLi4+IE1pbmlMb2dnZXIgOiBjcmVhdGVzIGJ5IGRlZmF1bHRcbiAqL1xuZXhwb3J0IGNsYXNzIExvZ2dpbmcge1xuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBGYWN0b3J5IGZ1bmN0aW9uIGZvciBjcmVhdGluZyBsb2dnZXIgaW5zdGFuY2VzXG4gICAgICogQHN1bW1hcnkgQSBmdW5jdGlvbiB0aGF0IGNyZWF0ZXMgbmV3IExvZ2dlciBpbnN0YW5jZXMuIEJ5IGRlZmF1bHQsIGl0IGNyZWF0ZXMgYSBNaW5pTG9nZ2VyLlxuICAgICAqL1xuICAgIHN0YXRpYyB7IHRoaXMuX2ZhY3RvcnkgPSAob2JqZWN0LCBjb25maWcpID0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBNaW5pTG9nZ2VyKG9iamVjdCwgY29uZmlnKTtcbiAgICB9OyB9XG4gICAgc3RhdGljIHsgdGhpcy5fY29uZmlnID0gTG9nZ2VkRW52aXJvbm1lbnQ7IH1cbiAgICBjb25zdHJ1Y3RvcigpIHsgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBTZXRzIHRoZSBmYWN0b3J5IGZ1bmN0aW9uIGZvciBjcmVhdGluZyBsb2dnZXIgaW5zdGFuY2VzXG4gICAgICogQHN1bW1hcnkgQWxsb3dzIGN1c3RvbWl6aW5nIGhvdyBsb2dnZXIgaW5zdGFuY2VzIGFyZSBjcmVhdGVkXG4gICAgICogQHBhcmFtIHtMb2dnZXJGYWN0b3J5fSBmYWN0b3J5IC0gVGhlIGZhY3RvcnkgZnVuY3Rpb24gdG8gdXNlIGZvciBjcmVhdGluZyBsb2dnZXJzXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBzdGF0aWMgc2V0RmFjdG9yeShmYWN0b3J5KSB7XG4gICAgICAgIExvZ2dpbmcuX2ZhY3RvcnkgPSBmYWN0b3J5O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gVXBkYXRlcyB0aGUgZ2xvYmFsIGxvZ2dpbmcgY29uZmlndXJhdGlvblxuICAgICAqIEBzdW1tYXJ5IEFsbG93cyB1cGRhdGluZyB0aGUgZ2xvYmFsIGxvZ2dpbmcgY29uZmlndXJhdGlvbiB3aXRoIG5ldyBzZXR0aW5nc1xuICAgICAqIEBwYXJhbSB7UGFydGlhbDxMb2dnaW5nQ29uZmlnPn0gY29uZmlnIC0gVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyB0byBhcHBseVxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgc3RhdGljIHNldENvbmZpZyhjb25maWcpIHtcbiAgICAgICAgT2JqZWN0LmVudHJpZXMoY29uZmlnKS5mb3JFYWNoKChbaywgdl0pID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZ1trXSA9IHY7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gR2V0cyBhIGNvcHkgb2YgdGhlIGN1cnJlbnQgZ2xvYmFsIGxvZ2dpbmcgY29uZmlndXJhdGlvblxuICAgICAqIEBzdW1tYXJ5IFJldHVybnMgYSBjb3B5IG9mIHRoZSBjdXJyZW50IGdsb2JhbCBsb2dnaW5nIGNvbmZpZ3VyYXRpb25cbiAgICAgKiBAcmV0dXJuIHtMb2dnaW5nQ29uZmlnfSBBIGNvcHkgb2YgdGhlIGN1cnJlbnQgY29uZmlndXJhdGlvblxuICAgICAqL1xuICAgIHN0YXRpYyBnZXRDb25maWcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jb25maWc7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBSZXRyaWV2ZXMgb3IgY3JlYXRlcyB0aGUgZ2xvYmFsIGxvZ2dlciBpbnN0YW5jZS5cbiAgICAgKiBAc3VtbWFyeSBSZXR1cm5zIHRoZSBleGlzdGluZyBnbG9iYWwgbG9nZ2VyIG9yIGNyZWF0ZXMgYSBuZXcgb25lIGlmIGl0IGRvZXNuJ3QgZXhpc3QuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIFRoZSBnbG9iYWwgVmVyYm9zaXR5TG9nZ2VyIGluc3RhbmNlLlxuICAgICAqL1xuICAgIHN0YXRpYyBnZXQoKSB7XG4gICAgICAgIHRoaXMuZ2xvYmFsID0gdGhpcy5nbG9iYWwgPyB0aGlzLmdsb2JhbCA6IHRoaXMuX2ZhY3RvcnkoXCJMb2dnaW5nXCIpO1xuICAgICAgICByZXR1cm4gdGhpcy5nbG9iYWw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBMb2dzIGEgdmVyYm9zZSBtZXNzYWdlLlxuICAgICAqIEBzdW1tYXJ5IERlbGVnYXRlcyB0aGUgdmVyYm9zZSBsb2dnaW5nIHRvIHRoZSBnbG9iYWwgbG9nZ2VyIGluc3RhbmNlLlxuICAgICAqXG4gICAgICogQHBhcmFtIG1zZyAtIFRoZSBtZXNzYWdlIHRvIGJlIGxvZ2dlZC5cbiAgICAgKiBAcGFyYW0gdmVyYm9zaXR5IC0gVGhlIHZlcmJvc2l0eSBsZXZlbCBvZiB0aGUgbWVzc2FnZSAoZGVmYXVsdDogMCkuXG4gICAgICovXG4gICAgc3RhdGljIHZlcmJvc2UobXNnLCB2ZXJib3NpdHkgPSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldCgpLnZlcmJvc2UobXNnLCB2ZXJib3NpdHkpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gTG9ncyBhbiBpbmZvIG1lc3NhZ2UuXG4gICAgICogQHN1bW1hcnkgRGVsZWdhdGVzIHRoZSBpbmZvIGxvZ2dpbmcgdG8gdGhlIGdsb2JhbCBsb2dnZXIgaW5zdGFuY2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbXNnIC0gVGhlIG1lc3NhZ2UgdG8gYmUgbG9nZ2VkLlxuICAgICAqL1xuICAgIHN0YXRpYyBpbmZvKG1zZykge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQoKS5pbmZvKG1zZyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBMb2dzIGFuIGluZm8gbWVzc2FnZS5cbiAgICAgKiBAc3VtbWFyeSBEZWxlZ2F0ZXMgdGhlIGluZm8gbG9nZ2luZyB0byB0aGUgZ2xvYmFsIGxvZ2dlciBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBtc2cgLSBUaGUgbWVzc2FnZSB0byBiZSBsb2dnZWQuXG4gICAgICovXG4gICAgc3RhdGljIHRyYWNlKG1zZykge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQoKS50cmFjZShtc2cpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gTG9ncyBhIGRlYnVnIG1lc3NhZ2UuXG4gICAgICogQHN1bW1hcnkgRGVsZWdhdGVzIHRoZSBkZWJ1ZyBsb2dnaW5nIHRvIHRoZSBnbG9iYWwgbG9nZ2VyIGluc3RhbmNlLlxuICAgICAqXG4gICAgICogQHBhcmFtIG1zZyAtIFRoZSBtZXNzYWdlIHRvIGJlIGxvZ2dlZC5cbiAgICAgKi9cbiAgICBzdGF0aWMgZGVidWcobXNnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldCgpLmRlYnVnKG1zZyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBMb2dzIGEgYmVuY2htYXJrIG1lc3NhZ2UuXG4gICAgICogQHN1bW1hcnkgRGVsZWdhdGVzIHRoZSBiZW5jaG1hcmsgbG9nZ2luZyB0byB0aGUgZ2xvYmFsIGxvZ2dlciBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBtc2cgLSBUaGUgbWVzc2FnZSB0byBiZSBsb2dnZWQuXG4gICAgICovXG4gICAgc3RhdGljIGJlbmNobWFyayhtc2cpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KCkuYmVuY2htYXJrKG1zZyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBMb2dzIGEgc2lsbHkgbWVzc2FnZS5cbiAgICAgKiBAc3VtbWFyeSBEZWxlZ2F0ZXMgdGhlIGRlYnVnIGxvZ2dpbmcgdG8gdGhlIGdsb2JhbCBsb2dnZXIgaW5zdGFuY2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbXNnIC0gVGhlIG1lc3NhZ2UgdG8gYmUgbG9nZ2VkLlxuICAgICAqL1xuICAgIHN0YXRpYyBzaWxseShtc2cpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KCkuc2lsbHkobXNnKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIExvZ3MgYSBzaWxseSBtZXNzYWdlLlxuICAgICAqIEBzdW1tYXJ5IERlbGVnYXRlcyB0aGUgZGVidWcgbG9nZ2luZyB0byB0aGUgZ2xvYmFsIGxvZ2dlciBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBtc2cgLSBUaGUgbWVzc2FnZSB0byBiZSBsb2dnZWQuXG4gICAgICovXG4gICAgc3RhdGljIHdhcm4obXNnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldCgpLndhcm4obXNnKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIExvZ3MgYW4gZXJyb3IgbWVzc2FnZS5cbiAgICAgKiBAc3VtbWFyeSBEZWxlZ2F0ZXMgdGhlIGVycm9yIGxvZ2dpbmcgdG8gdGhlIGdsb2JhbCBsb2dnZXIgaW5zdGFuY2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbXNnIC0gVGhlIG1lc3NhZ2UgdG8gYmUgbG9nZ2VkLlxuICAgICAqIEBwYXJhbSBlXG4gICAgICovXG4gICAgc3RhdGljIGVycm9yKG1zZywgZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQoKS5lcnJvcihtc2csIGUpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gQ3JlYXRlcyBhIGxvZ2dlciBmb3IgYSBzcGVjaWZpYyBvYmplY3Qgb3IgY29udGV4dFxuICAgICAqIEBzdW1tYXJ5IENyZWF0ZXMgYSBuZXcgbG9nZ2VyIGluc3RhbmNlIGZvciB0aGUgZ2l2ZW4gb2JqZWN0IG9yIGNvbnRleHQgdXNpbmcgdGhlIGZhY3RvcnkgZnVuY3Rpb25cbiAgICAgKiBAcGFyYW0ge0xvZ2dpbmdDb250ZXh0fSBvYmplY3QgLSBUaGUgb2JqZWN0LCBjbGFzcywgb3IgY29udGV4dCB0byBjcmVhdGUgYSBsb2dnZXIgZm9yXG4gICAgICogQHBhcmFtIHtQYXJ0aWFsPExvZ2dpbmdDb25maWc+fSBbY29uZmlnXSAtIE9wdGlvbmFsIGNvbmZpZ3VyYXRpb24gdG8gb3ZlcnJpZGUgZ2xvYmFsIHNldHRpbmdzXG4gICAgICogQHBhcmFtIHsuLi5hbnl9IGFyZ3MgLSBBZGRpdGlvbmFsIGFyZ3VtZW50cyB0byBwYXNzIHRvIHRoZSBsb2dnZXIgZmFjdG9yeVxuICAgICAqIEByZXR1cm4ge0xvZ2dlcn0gQSBuZXcgbG9nZ2VyIGluc3RhbmNlIGZvciB0aGUgc3BlY2lmaWVkIG9iamVjdCBvciBjb250ZXh0XG4gICAgICovXG4gICAgc3RhdGljIGZvcihvYmplY3QsIGNvbmZpZywgLi4uYXJncykge1xuICAgICAgICBvYmplY3QgPVxuICAgICAgICAgICAgdHlwZW9mIG9iamVjdCA9PT0gXCJzdHJpbmdcIlxuICAgICAgICAgICAgICAgID8gb2JqZWN0XG4gICAgICAgICAgICAgICAgOiBvYmplY3QuY29uc3RydWN0b3JcbiAgICAgICAgICAgICAgICAgICAgPyBvYmplY3QuY29uc3RydWN0b3IubmFtZVxuICAgICAgICAgICAgICAgICAgICA6IG9iamVjdC5uYW1lO1xuICAgICAgICByZXR1cm4gdGhpcy5fZmFjdG9yeShvYmplY3QsIGNvbmZpZywgLi4uYXJncyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBDcmVhdGVzIGEgbG9nZ2VyIGZvciBhIHNwZWNpZmljIHJlYXNvbiBvciBjb3JyZWxhdGlvbiBjb250ZXh0XG4gICAgICogQHN1bW1hcnkgVXRpbGl0eSB0byBxdWlja2x5IGNyZWF0ZSBhIGxvZ2dlciBsYWJlbGVkIHdpdGggYSBmcmVlLWZvcm0gcmVhc29uIGFuZCBvcHRpb25hbCBpZGVudGlmaWVyXG4gICAgICogc28gdGhhdCBhZC1ob2Mgb3BlcmF0aW9ucyBjYW4gYmUgdHJhY2VkIHdpdGhvdXQgdHlpbmcgdGhlIGxvZ2dlciB0byBhIGNsYXNzIG9yIG1ldGhvZCBuYW1lLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSByZWFzb24gLSBBIHRleHR1YWwgcmVhc29uIG9yIGNvbnRleHQgbGFiZWwgZm9yIHRoaXMgbG9nZ2VyIGluc3RhbmNlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtpZF0gLSBPcHRpb25hbCBpZGVudGlmaWVyIHRvIGhlbHAgY29ycmVsYXRlIHJlbGF0ZWQgbG9nIGVudHJpZXNcbiAgICAgKiBAcmV0dXJuIHtMb2dnZXJ9IEEgbmV3IGxvZ2dlciBpbnN0YW5jZSBsYWJlbGVkIHdpdGggdGhlIHByb3ZpZGVkIHJlYXNvbiBhbmQgaWRcbiAgICAgKi9cbiAgICBzdGF0aWMgYmVjYXVzZShyZWFzb24sIGlkKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9mYWN0b3J5KHJlYXNvbiwgdGhpcy5fY29uZmlnLCBpZCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBBcHBsaWVzIHRoZW1lIHN0eWxpbmcgdG8gdGV4dFxuICAgICAqIEBzdW1tYXJ5IEFwcGxpZXMgc3R5bGluZyAoY29sb3JzLCBmb3JtYXR0aW5nKSB0byB0ZXh0IGJhc2VkIG9uIHRoZSB0aGVtZSBjb25maWd1cmF0aW9uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRleHQgLSBUaGUgdGV4dCB0byBzdHlsZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIC0gVGhlIHR5cGUgb2YgZWxlbWVudCB0byBzdHlsZSAoZS5nLiwgXCJjbGFzc1wiLCBcIm1lc3NhZ2VcIiwgXCJsb2dMZXZlbFwiKVxuICAgICAqIEBwYXJhbSB7TG9nTGV2ZWx9IGxvZ2dlckxldmVsIC0gVGhlIGxvZyBsZXZlbCB0byB1c2UgZm9yIHN0eWxpbmdcbiAgICAgKiBAcGFyYW0ge1RoZW1lfSBbdGVtcGxhdGU9RGVmYXVsdFRoZW1lXSAtIFRoZSB0aGVtZSB0byB1c2UgZm9yIHN0eWxpbmdcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBzdHlsZWQgdGV4dFxuICAgICAqIEBtZXJtYWlkXG4gICAgICogc2VxdWVuY2VEaWFncmFtXG4gICAgICogICBwYXJ0aWNpcGFudCBDYWxsZXJcbiAgICAgKiAgIHBhcnRpY2lwYW50IFRoZW1lIGFzIExvZ2dpbmcudGhlbWVcbiAgICAgKiAgIHBhcnRpY2lwYW50IEFwcGx5IGFzIGFwcGx5IGZ1bmN0aW9uXG4gICAgICogICBwYXJ0aWNpcGFudCBTdHlsZSBhcyBzdHlsZWQtc3RyaW5nLWJ1aWxkZXJcbiAgICAgKlxuICAgICAqICAgQ2FsbGVyLT4+VGhlbWU6IHRoZW1lKHRleHQsIHR5cGUsIGxvZ2dlckxldmVsKVxuICAgICAqICAgVGhlbWUtPj5UaGVtZTogQ2hlY2sgaWYgc3R5bGluZyBpcyBlbmFibGVkXG4gICAgICogICBhbHQgc3R5bGluZyBkaXNhYmxlZFxuICAgICAqICAgICBUaGVtZS0tPj5DYWxsZXI6IHJldHVybiBvcmlnaW5hbCB0ZXh0XG4gICAgICogICBlbHNlIHN0eWxpbmcgZW5hYmxlZFxuICAgICAqICAgICBUaGVtZS0+PlRoZW1lOiBHZXQgdGhlbWUgZm9yIHR5cGVcbiAgICAgKiAgICAgYWx0IHRoZW1lIG5vdCBmb3VuZFxuICAgICAqICAgICAgIFRoZW1lLS0+PkNhbGxlcjogcmV0dXJuIG9yaWdpbmFsIHRleHRcbiAgICAgKiAgICAgZWxzZSB0aGVtZSBmb3VuZFxuICAgICAqICAgICAgIFRoZW1lLT4+VGhlbWU6IERldGVybWluZSBhY3R1YWwgdGhlbWUgYmFzZWQgb24gbG9nIGxldmVsXG4gICAgICogICAgICAgVGhlbWUtPj5BcHBseTogQXBwbHkgZWFjaCBzdHlsZSBwcm9wZXJ0eVxuICAgICAqICAgICAgIEFwcGx5LT4+U3R5bGU6IEFwcGx5IGNvbG9ycyBhbmQgZm9ybWF0dGluZ1xuICAgICAqICAgICAgIFN0eWxlLS0+PkFwcGx5OiBSZXR1cm4gc3R5bGVkIHRleHRcbiAgICAgKiAgICAgICBBcHBseS0tPj5UaGVtZTogUmV0dXJuIHN0eWxlZCB0ZXh0XG4gICAgICogICAgICAgVGhlbWUtLT4+Q2FsbGVyOiBSZXR1cm4gZmluYWwgc3R5bGVkIHRleHRcbiAgICAgKiAgICAgZW5kXG4gICAgICogICBlbmRcbiAgICAgKi9cbiAgICBzdGF0aWMgdGhlbWUodGV4dCwgdHlwZSwgbG9nZ2VyTGV2ZWwsIHRlbXBsYXRlID0gRGVmYXVsdFRoZW1lKSB7XG4gICAgICAgIGlmICghdGhpcy5fY29uZmlnLnN0eWxlKVxuICAgICAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgICAgIGZ1bmN0aW9uIGFwcGx5KHR4dCwgb3B0aW9uLCB2YWx1ZSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0ID0gdHh0O1xuICAgICAgICAgICAgICAgIGxldCBjID0gc3R5bGUodCk7XG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gYXBwbHlDb2xvcih2YWwsIGlzQmcgPSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZiA9IGlzQmcgPyBjLmJhY2tncm91bmQgOiBjLmZvcmVncm91bmQ7XG4gICAgICAgICAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZi5jYWxsKGMsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHZhbC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmID0gaXNCZyA/IGMuYmdDb2xvcjI1NiA6IGMuY29sb3IyNTY7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGYodmFsWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmID0gaXNCZyA/IGMuYmdSZ2IgOiBjLnJnYjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYy5yZ2IodmFsWzBdLCB2YWxbMV0sIHZhbFsyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYE5vdCBhIHZhbGlkIGNvbG9yIG9wdGlvbjogJHtvcHRpb259YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0eWxlKHQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGFwcGx5U3R5bGUodikge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHYgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGMgPSBjLnN0eWxlKHYpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYyA9IGNbdl07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3dpdGNoIChvcHRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImJnXCI6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJmZ1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFwcGx5Q29sb3IodmFsdWUpLnRleHQ7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzdHlsZVwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUuZm9yRWFjaChhcHBseVN0eWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwcGx5U3R5bGUodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGMudGV4dDtcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYE5vdCBhIHZhbGlkIHRoZW1lIG9wdGlvbjogJHtvcHRpb259YCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBFcnJvciBhcHBseWluZyBzdHlsZTogJHtvcHRpb259IHdpdGggdmFsdWUgJHt2YWx1ZX1gKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGluZGl2aWR1YWxUaGVtZSA9IHRlbXBsYXRlW3R5cGVdO1xuICAgICAgICBpZiAoIWluZGl2aWR1YWxUaGVtZSB8fCAhT2JqZWN0LmtleXMoaW5kaXZpZHVhbFRoZW1lKS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICB9XG4gICAgICAgIGxldCBhY3R1YWxUaGVtZSA9IGluZGl2aWR1YWxUaGVtZTtcbiAgICAgICAgY29uc3QgbG9nTGV2ZWxzID0gT2JqZWN0LmFzc2lnbih7fSwgTG9nTGV2ZWwpO1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMoaW5kaXZpZHVhbFRoZW1lKVswXSBpbiBsb2dMZXZlbHMpXG4gICAgICAgICAgICBhY3R1YWxUaGVtZSA9XG4gICAgICAgICAgICAgICAgaW5kaXZpZHVhbFRoZW1lW2xvZ2dlckxldmVsXSB8fCB7fTtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGFjdHVhbFRoZW1lKS5yZWR1Y2UoKGFjYywga2V5KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2YWwgPSBhY3R1YWxUaGVtZVtrZXldO1xuICAgICAgICAgICAgaWYgKHZhbClcbiAgICAgICAgICAgICAgICByZXR1cm4gYXBwbHkoYWNjLCBrZXksIHZhbCk7XG4gICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCB0ZXh0KTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1sb2dnaW5nLmpzLm1hcCIsImltcG9ydCB7IExvZ2dpbmcgfSBmcm9tIFwiLi9sb2dnaW5nLmpzXCI7XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBCYXNlIGNsYXNzIHRoYXQgcHJvdmlkZXMgYSByZWFkeS10by11c2UgbG9nZ2VyIGluc3RhbmNlLlxuICogQHN1bW1hcnkgU3VwcGxpZXMgaW5oZXJpdGluZyBjbGFzc2VzIHdpdGggYSBsYXppbHkgY3JlYXRlZCwgY29udGV4dC1hd2FyZSB7QGxpbmsgTG9nZ2VyfSB2aWEgdGhlIHByb3RlY3RlZCBgbG9nYCBnZXR0ZXIsIHByb21vdGluZyBjb25zaXN0ZW50IHN0cnVjdHVyZWQgbG9nZ2luZyB3aXRob3V0IG1hbnVhbCB3aXJpbmcuXG4gKiBAY2xhc3MgTG9nZ2VkQ2xhc3NcbiAqIEBleGFtcGxlXG4gKiBjbGFzcyBVc2VyU2VydmljZSBleHRlbmRzIExvZ2dlZENsYXNzIHtcbiAqICAgY3JlYXRlKHVzZXI6IFVzZXIpIHtcbiAqICAgICB0aGlzLmxvZy5pbmZvKGBDcmVhdGluZyB1c2VyICR7dXNlci5pZH1gKTtcbiAqICAgfVxuICogfVxuICpcbiAqIGNvbnN0IHN2YyA9IG5ldyBVc2VyU2VydmljZSgpO1xuICogc3ZjLmNyZWF0ZSh7IGlkOiBcIjQyXCIgfSk7XG4gKiBAbWVybWFpZFxuICogc2VxdWVuY2VEaWFncmFtXG4gKiAgIHBhcnRpY2lwYW50IENsaWVudFxuICogICBwYXJ0aWNpcGFudCBJbnN0YW5jZSBhcyBTdWJjbGFzcyBJbnN0YW5jZVxuICogICBwYXJ0aWNpcGFudCBHZXR0ZXIgYXMgTG9nZ2VkQ2xhc3MubG9nXG4gKiAgIHBhcnRpY2lwYW50IExvZ2dpbmcgYXMgTG9nZ2luZ1xuICogICBwYXJ0aWNpcGFudCBMb2dnZXIgYXMgTG9nZ2VyXG4gKlxuICogICBDbGllbnQtPj5JbnN0YW5jZTogY2FsbCBzb21lTWV0aG9kKClcbiAqICAgSW5zdGFuY2UtPj5HZXR0ZXI6IGFjY2VzcyB0aGlzLmxvZ1xuICogICBHZXR0ZXItPj5Mb2dnaW5nOiBMb2dnaW5nLmZvcih0aGlzKVxuICogICBMb2dnaW5nLS0+PkdldHRlcjogcmV0dXJuIExvZ2dlclxuICogICBHZXR0ZXItLT4+SW5zdGFuY2U6IHJldHVybiBMb2dnZXJcbiAqICAgSW5zdGFuY2UtPj5Mb2dnZXI6IGluZm8vZGVidWcvZXJyb3IoLi4uKVxuICovXG5leHBvcnQgY2xhc3MgTG9nZ2VkQ2xhc3Mge1xuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBMYXppbHkgcHJvdmlkZXMgYSBjb250ZXh0LWF3YXJlIGxvZ2dlciBmb3IgdGhlIGN1cnJlbnQgaW5zdGFuY2UuXG4gICAgICogQHN1bW1hcnkgQ2FsbHMge0BsaW5rIExvZ2dpbmcuZm9yfSB3aXRoIHRoZSBzdWJjbGFzcyBpbnN0YW5jZSB0byBvYnRhaW4gYSBsb2dnZXIgd2hvc2UgY29udGV4dCBtYXRjaGVzIHRoZSBzdWJjbGFzcyBuYW1lLlxuICAgICAqIEByZXR1cm4ge0xvZ2dlcn0gTG9nZ2VyIGJvdW5kIHRvIHRoZSBzdWJjbGFzcyBjb250ZXh0LlxuICAgICAqL1xuICAgIGdldCBsb2coKSB7XG4gICAgICAgIGlmICghdGhpcy5fbG9nKVxuICAgICAgICAgICAgdGhpcy5fbG9nID0gTG9nZ2luZy5mb3IodGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzLl9sb2c7XG4gICAgfVxuICAgIGNvbnN0cnVjdG9yKCkgeyB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1Mb2dnZWRDbGFzcy5qcy5tYXAiLCJpbXBvcnQgeyBMb2dnZWRDbGFzcyB9IGZyb20gXCIuLy4uL0xvZ2dlZENsYXNzLmpzXCI7XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBCYXNlIGNsYXNzIGZvciBtZXNzYWdlIGZpbHRlcnMgdGhhdCBwbHVnIGludG8gdGhlIGxvZ2dpbmcgcGlwZWxpbmUuXG4gKiBAc3VtbWFyeSBFeHRlbmRzIHtAbGluayBMb2dnZWRDbGFzc30gdG8gc3VwcGx5IGEgc2NvcGVkIGxvZ2dlciBhbmQgZGVmaW5lcyB0aGUgY29udHJhY3QgcmVxdWlyZWQgYnkge0BsaW5rIExvZ2dpbmdGaWx0ZXJ9IGltcGxlbWVudGVycyB0aGF0IHRyYW5zZm9ybSBvciBkcm9wIGxvZyBtZXNzYWdlcyBiZWZvcmUgZW1pc3Npb24uXG4gKiBAY2xhc3MgTG9nRmlsdGVyXG4gKiBAZXhhbXBsZVxuICogY2xhc3MgUmVkYWN0U2VjcmV0c0ZpbHRlciBleHRlbmRzIExvZ0ZpbHRlciB7XG4gKiAgIGZpbHRlcihjb25maWc6IExvZ2dpbmdDb25maWcsIG1lc3NhZ2U6IHN0cmluZyk6IHN0cmluZyB7XG4gKiAgICAgcmV0dXJuIG1lc3NhZ2UucmVwbGFjZSgvc2VjcmV0L2dpLCBcIioqKlwiKTtcbiAqICAgfVxuICogfVxuICpcbiAqIGNvbnN0IGZpbHRlciA9IG5ldyBSZWRhY3RTZWNyZXRzRmlsdGVyKCk7XG4gKiBmaWx0ZXIuZmlsdGVyKHsgLi4uRGVmYXVsdExvZ2dpbmdDb25maWcsIHZlcmJvc2U6IDAgfSwgXCJzZWNyZXQgdG9rZW5cIik7XG4gKiBAbWVybWFpZFxuICogc2VxdWVuY2VEaWFncmFtXG4gKiAgIHBhcnRpY2lwYW50IExvZ2dlclxuICogICBwYXJ0aWNpcGFudCBGaWx0ZXIgYXMgTG9nRmlsdGVyXG4gKiAgIHBhcnRpY2lwYW50IEltcGwgYXMgQ29uY3JldGVGaWx0ZXJcbiAqICAgcGFydGljaXBhbnQgT3V0cHV0XG4gKiAgIExvZ2dlci0+PkZpbHRlcjogZmlsdGVyKGNvbmZpZywgbWVzc2FnZSwgY29udGV4dClcbiAqICAgRmlsdGVyLT4+SW1wbDogZGVsZWdhdGUgdG8gc3ViY2xhc3MgaW1wbGVtZW50YXRpb25cbiAqICAgSW1wbC0tPj5GaWx0ZXI6IHRyYW5zZm9ybWVkIG1lc3NhZ2VcbiAqICAgRmlsdGVyLS0+Pk91dHB1dDogcmV0dXJuIGZpbHRlcmVkIG1lc3NhZ2VcbiAqL1xuZXhwb3J0IGNsYXNzIExvZ0ZpbHRlciBleHRlbmRzIExvZ2dlZENsYXNzIHtcbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gU2NvcGVkIGxvZ2dlciB0aGF0IGV4Y2x1ZGVzIG90aGVyIGZpbHRlcnMgZnJvbSB0aGUgY2hhaW4uXG4gICAgICogQHN1bW1hcnkgUmV0dXJucyBhIGNoaWxkIGxvZ2dlciBkZWRpY2F0ZWQgdG8gdGhlIGZpbHRlciwgcHJldmVudGluZyByZWN1cnNpdmUgZmlsdGVyIGludm9jYXRpb24gd2hlbiBlbWl0dGluZyBkaWFnbm9zdGljIG1lc3NhZ2VzLlxuICAgICAqIEByZXR1cm4ge0xvZ2dlcn0gQ29udGV4dC1hd2FyZSBsb2dnZXIgZm9yIHRoZSBmaWx0ZXIgaW5zdGFuY2UuXG4gICAgICovXG4gICAgZ2V0IGxvZygpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmxvZy5mb3IodGhpcywgeyBmaWx0ZXJzOiBbXSB9KTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1Mb2dGaWx0ZXIuanMubWFwIiwiZnVuY3Rpb24gc2FmZU5vdygpIHtcbiAgICAvLyBQcmVmZXIgcGVyZm9ybWFuY2Uubm93IHdoZW4gYXZhaWxhYmxlXG4gICAgaWYgKHR5cGVvZiBnbG9iYWxUaGlzICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgICAgIHR5cGVvZiBnbG9iYWxUaGlzLnBlcmZvcm1hbmNlPy5ub3cgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gKCkgPT4gZ2xvYmFsVGhpcy5wZXJmb3JtYW5jZS5ub3coKTtcbiAgICB9XG4gICAgLy8gTm9kZTogdXNlIHByb2Nlc3MuaHJ0aW1lLmJpZ2ludCBmb3IgaGlnaGVyIHByZWNpc2lvbiBpZiBhdmFpbGFibGVcbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgIT09IFwidW5kZWZpbmVkXCIgJiZcbiAgICAgICAgdHlwZW9mIHByb2Nlc3MuaHJ0aW1lPy5iaWdpbnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbnMgPSBwcm9jZXNzLmhydGltZS5iaWdpbnQoKTsgLy8gbmFub3NlY29uZHNcbiAgICAgICAgICAgIHJldHVybiBOdW1iZXIobnMpIC8gMV8wMDBfMDAwOyAvLyB0byBtc1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvLyBGYWxsYmFja1xuICAgIHJldHVybiAoKSA9PiBEYXRlLm5vdygpO1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gSGlnaC1yZXNvbHV0aW9uIGNsb2NrIGFjY2Vzc29yIHJldHVybmluZyBtaWxsaXNlY29uZHMuXG4gKiBAc3VtbWFyeSBDaG9vc2VzIHRoZSBtb3N0IHByZWNpc2UgdGltZXIgYXZhaWxhYmxlIGluIHRoZSBjdXJyZW50IHJ1bnRpbWUsIHByZWZlcnJpbmcgYHBlcmZvcm1hbmNlLm5vd2Agb3IgYHByb2Nlc3MuaHJ0aW1lLmJpZ2ludGAuXG4gKiBAcmV0dXJuIHtudW1iZXJ9IE1pbGxpc2Vjb25kcyBlbGFwc2VkIGFjY29yZGluZyB0byB0aGUgYmVzdCBhdmFpbGFibGUgY2xvY2suXG4gKi9cbmV4cG9ydCBjb25zdCBub3cgPSBzYWZlTm93KCk7XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBIaWdoLXJlc29sdXRpb24gc3RvcHdhdGNoIHdpdGggcGF1c2UsIHJlc3VtZSwgYW5kIGxhcCB0cmFja2luZy5cbiAqIEBzdW1tYXJ5IFRyYWNrcyBlbGFwc2VkIHRpbWUgdXNpbmcgdGhlIGhpZ2hlc3QgcHJlY2lzaW9uIHRpbWVyIGF2YWlsYWJsZSwgc3VwcG9ydHMgcGF1c2luZywgcmVzdW1pbmcsIGFuZCByZWNvcmRpbmcgbGFiZWxlZCBsYXBzIGZvciBkaWFnbm9zdGljcyBhbmQgYmVuY2htYXJraW5nLlxuICogQHBhcmFtIHtib29sZWFufSBbYXV0b1N0YXJ0PWZhbHNlXSAtIFdoZW4gdHJ1ZSwgdGhlIHN0b3B3YXRjaCBzdGFydHMgaW1tZWRpYXRlbHkgdXBvbiBjb25zdHJ1Y3Rpb24uXG4gKiBAY2xhc3MgU3RvcFdhdGNoXG4gKiBAZXhhbXBsZVxuICogY29uc3Qgc3cgPSBuZXcgU3RvcFdhdGNoKHRydWUpO1xuICogLy8gLi4uIHdvcmsgLi4uXG4gKiBjb25zdCBsYXAgPSBzdy5sYXAoXCJwaGFzZSAxXCIpO1xuICogc3cucGF1c2UoKTtcbiAqIGNvbnNvbGUubG9nKGBFbGFwc2VkOiAke2xhcC50b3RhbE1zfW1zYCk7XG4gKiBAbWVybWFpZFxuICogc2VxdWVuY2VEaWFncmFtXG4gKiAgIHBhcnRpY2lwYW50IENsaWVudFxuICogICBwYXJ0aWNpcGFudCBTdG9wV2F0Y2hcbiAqICAgcGFydGljaXBhbnQgQ2xvY2sgYXMgbm93KClcbiAqICAgQ2xpZW50LT4+U3RvcFdhdGNoOiBzdGFydCgpXG4gKiAgIFN0b3BXYXRjaC0+PkNsb2NrOiBub3coKVxuICogICBDbG9jay0tPj5TdG9wV2F0Y2g6IHRpbWVzdGFtcFxuICogICBDbGllbnQtPj5TdG9wV2F0Y2g6IGxhcCgpXG4gKiAgIFN0b3BXYXRjaC0+PkNsb2NrOiBub3coKVxuICogICBDbG9jay0tPj5TdG9wV2F0Y2g6IHRpbWVzdGFtcFxuICogICBTdG9wV2F0Y2gtLT4+Q2xpZW50OiBMYXBcbiAqICAgQ2xpZW50LT4+U3RvcFdhdGNoOiBwYXVzZSgpXG4gKiAgIFN0b3BXYXRjaC0+PkNsb2NrOiBub3coKVxuICogICBDbG9jay0tPj5TdG9wV2F0Y2g6IHRpbWVzdGFtcFxuICovXG5leHBvcnQgY2xhc3MgU3RvcFdhdGNoIHtcbiAgICBjb25zdHJ1Y3RvcihhdXRvU3RhcnQgPSBmYWxzZSkge1xuICAgICAgICB0aGlzLl9zdGFydE1zID0gbnVsbDtcbiAgICAgICAgdGhpcy5fZWxhcHNlZE1zID0gMDtcbiAgICAgICAgdGhpcy5fcnVubmluZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9sYXBzID0gW107XG4gICAgICAgIHRoaXMuX2xhc3RMYXBUb3RhbE1zID0gMDtcbiAgICAgICAgaWYgKGF1dG9TdGFydClcbiAgICAgICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEluZGljYXRlcyB3aGV0aGVyIHRoZSBzdG9wd2F0Y2ggaXMgYWN0aXZlbHkgcnVubmluZy5cbiAgICAgKiBAc3VtbWFyeSBSZXR1cm5zIGB0cnVlYCB3aGVuIHRpbWluZyBpcyBpbiBwcm9ncmVzcyBhbmQgYGZhbHNlYCB3aGVuIHBhdXNlZCBvciBzdG9wcGVkLlxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IEN1cnJlbnQgcnVubmluZyBzdGF0ZS5cbiAgICAgKi9cbiAgICBnZXQgcnVubmluZygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3J1bm5pbmc7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBFbGFwc2VkIHRpbWUgY2FwdHVyZWQgYnkgdGhlIHN0b3B3YXRjaC5cbiAgICAgKiBAc3VtbWFyeSBDb21wdXRlcyB0aGUgdG90YWwgZWxhcHNlZCB0aW1lIGluIG1pbGxpc2Vjb25kcywgaW5jbHVkaW5nIHRoZSBjdXJyZW50IHNlc3Npb24gaWYgcnVubmluZy5cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IE1pbGxpc2Vjb25kcyBlbGFwc2VkIHNpbmNlIHRoZSBzdG9wd2F0Y2ggc3RhcnRlZC5cbiAgICAgKi9cbiAgICBnZXQgZWxhcHNlZE1zKCkge1xuICAgICAgICBpZiAoIXRoaXMuX3J1bm5pbmcgfHwgdGhpcy5fc3RhcnRNcyA9PSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2VsYXBzZWRNcztcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VsYXBzZWRNcyArIChub3coKSAtIHRoaXMuX3N0YXJ0TXMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gU3RhcnRzIHRpbWluZyBpZiB0aGUgc3RvcHdhdGNoIGlzIG5vdCBhbHJlYWR5IHJ1bm5pbmcuXG4gICAgICogQHN1bW1hcnkgUmVjb3JkcyB0aGUgY3VycmVudCB0aW1lc3RhbXAgYW5kIHRyYW5zaXRpb25zIHRoZSBzdG9wd2F0Y2ggaW50byB0aGUgcnVubmluZyBzdGF0ZS5cbiAgICAgKiBAcmV0dXJuIHt0aGlzfSBGbHVlbnQgcmVmZXJlbmNlIHRvIHRoZSBzdG9wd2F0Y2guXG4gICAgICovXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIGlmICghdGhpcy5fcnVubmluZykge1xuICAgICAgICAgICAgdGhpcy5fcnVubmluZyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLl9zdGFydE1zID0gbm93KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBQYXVzZXMgdGltaW5nIGFuZCBhY2N1bXVsYXRlcyBlbGFwc2VkIG1pbGxpc2Vjb25kcy5cbiAgICAgKiBAc3VtbWFyeSBDYXB0dXJlcyB0aGUgcGFydGlhbCBkdXJhdGlvbiwgdXBkYXRlcyB0aGUgYWNjdW11bGF0b3IsIGFuZCBrZWVwcyB0aGUgc3RvcHdhdGNoIHJlYWR5IHRvIHJlc3VtZSBsYXRlci5cbiAgICAgKiBAcmV0dXJuIHt0aGlzfSBGbHVlbnQgcmVmZXJlbmNlIHRvIHRoZSBzdG9wd2F0Y2guXG4gICAgICovXG4gICAgcGF1c2UoKSB7XG4gICAgICAgIGlmICh0aGlzLl9ydW5uaW5nICYmIHRoaXMuX3N0YXJ0TXMgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5fZWxhcHNlZE1zICs9IG5vdygpIC0gdGhpcy5fc3RhcnRNcztcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0TXMgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fcnVubmluZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gUmVzdW1lcyB0aW1pbmcgYWZ0ZXIgYSBwYXVzZS5cbiAgICAgKiBAc3VtbWFyeSBDYXB0dXJlcyBhIGZyZXNoIHN0YXJ0IHRpbWVzdGFtcCB3aGlsZSBrZWVwaW5nIHByZXZpb3VzIGVsYXBzZWQgdGltZSBpbnRhY3QuXG4gICAgICogQHJldHVybiB7dGhpc30gRmx1ZW50IHJlZmVyZW5jZSB0byB0aGUgc3RvcHdhdGNoLlxuICAgICAqL1xuICAgIHJlc3VtZSgpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9ydW5uaW5nKSB7XG4gICAgICAgICAgICB0aGlzLl9ydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0TXMgPSBub3coKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFN0b3BzIHRpbWluZyBhbmQgcmV0dXJucyB0aGUgdG90YWwgZWxhcHNlZCBtaWxsaXNlY29uZHMuXG4gICAgICogQHN1bW1hcnkgSW52b2tlcyB7QGxpbmsgU3RvcFdhdGNoLnBhdXNlfSB0byBjb25zb2xpZGF0ZSBlbGFwc2VkIHRpbWUsIGxlYXZpbmcgdGhlIHN0b3B3YXRjaCBpbiBhIG5vbi1ydW5uaW5nIHN0YXRlLlxuICAgICAqIEByZXR1cm4ge251bWJlcn0gTWlsbGlzZWNvbmRzIGFjY3VtdWxhdGVkIGFjcm9zcyBhbGwgcnVucy5cbiAgICAgKi9cbiAgICBzdG9wKCkge1xuICAgICAgICB0aGlzLnBhdXNlKCk7XG4gICAgICAgIHJldHVybiB0aGlzLl9lbGFwc2VkTXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBSZXNldHMgdGhlIHN0b3B3YXRjaCBzdGF0ZSB3aGlsZSBvcHRpb25hbGx5IGNvbnRpbnVpbmcgdG8gcnVuLlxuICAgICAqIEBzdW1tYXJ5IENsZWFycyBlbGFwc2VkIHRpbWUgYW5kIGxhcCBoaXN0b3J5LCBwcmVzZXJ2aW5nIHdoZXRoZXIgdGhlIHN0b3B3YXRjaCBzaG91bGQgY29udGludWUgdGlja2luZy5cbiAgICAgKiBAcmV0dXJuIHt0aGlzfSBGbHVlbnQgcmVmZXJlbmNlIHRvIHRoZSBzdG9wd2F0Y2guXG4gICAgICovXG4gICAgcmVzZXQoKSB7XG4gICAgICAgIGNvbnN0IHdhc1J1bm5pbmcgPSB0aGlzLl9ydW5uaW5nO1xuICAgICAgICB0aGlzLl9zdGFydE1zID0gd2FzUnVubmluZyA/IG5vdygpIDogbnVsbDtcbiAgICAgICAgdGhpcy5fZWxhcHNlZE1zID0gMDtcbiAgICAgICAgdGhpcy5fbGFwcyA9IFtdO1xuICAgICAgICB0aGlzLl9sYXN0TGFwVG90YWxNcyA9IDA7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gUmVjb3JkcyBhIGxhcCBzcGxpdCBzaW5jZSB0aGUgc3RvcHdhdGNoIHN0YXJ0ZWQgb3Igc2luY2UgdGhlIHByZXZpb3VzIGxhcC5cbiAgICAgKiBAc3VtbWFyeSBTdG9yZXMgdGhlIGxhcCBtZXRhZGF0YSwgdXBkYXRlcyBjdW11bGF0aXZlIHRyYWNraW5nLCBhbmQgcmV0dXJucyB0aGUgbmV3bHkgY3JlYXRlZCB7QGxpbmsgTGFwfS5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW2xhYmVsXSAtIE9wdGlvbmFsIGxhYmVsIGRlc2NyaWJpbmcgdGhlIGxhcC5cbiAgICAgKiBAcmV0dXJuIHtMYXB9IExhcCBzbmFwc2hvdCBjYXB0dXJpbmcgaW5jcmVtZW50YWwgYW5kIGN1bXVsYXRpdmUgdGltaW5ncy5cbiAgICAgKi9cbiAgICBsYXAobGFiZWwpIHtcbiAgICAgICAgY29uc3QgdG90YWwgPSB0aGlzLmVsYXBzZWRNcztcbiAgICAgICAgY29uc3QgbXMgPSB0b3RhbCAtIHRoaXMuX2xhc3RMYXBUb3RhbE1zO1xuICAgICAgICBjb25zdCBsYXAgPSB7XG4gICAgICAgICAgICBpbmRleDogdGhpcy5fbGFwcy5sZW5ndGgsXG4gICAgICAgICAgICBsYWJlbCxcbiAgICAgICAgICAgIG1zLFxuICAgICAgICAgICAgdG90YWxNczogdG90YWwsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX2xhcHMucHVzaChsYXApO1xuICAgICAgICB0aGlzLl9sYXN0TGFwVG90YWxNcyA9IHRvdGFsO1xuICAgICAgICByZXR1cm4gbGFwO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gUmV0cmlldmVzIHRoZSByZWNvcmRlZCBsYXAgaGlzdG9yeS5cbiAgICAgKiBAc3VtbWFyeSBSZXR1cm5zIHRoZSBpbnRlcm5hbCBsYXAgYXJyYXkgYXMgYSByZWFkLW9ubHkgdmlldyB0byBwcmV2ZW50IGV4dGVybmFsIG11dGF0aW9uLlxuICAgICAqIEByZXR1cm4ge0xhcFtdfSBMYXBzIGNhcHR1cmVkIGJ5IHRoZSBzdG9wd2F0Y2guXG4gICAgICovXG4gICAgZ2V0IGxhcHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sYXBzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gRm9ybWF0cyB0aGUgZWxhcHNlZCB0aW1lIGluIGEgaHVtYW4tcmVhZGFibGUgcmVwcmVzZW50YXRpb24uXG4gICAgICogQHN1bW1hcnkgVXNlcyB7QGxpbmsgZm9ybWF0TXN9IHRvIHByb2R1Y2UgYW4gYGhoOm1tOnNzLm1tbWAgc3RyaW5nIGZvciBkaXNwbGF5IGFuZCBsb2dnaW5nLlxuICAgICAqIEByZXR1cm4ge3N0cmluZ30gRWxhcHNlZCB0aW1lIGZvcm1hdHRlZCBmb3IgcHJlc2VudGF0aW9uLlxuICAgICAqL1xuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gZm9ybWF0TXModGhpcy5lbGFwc2VkTXMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gU2VyaWFsaXplcyB0aGUgc3RvcHdhdGNoIHN0YXRlLlxuICAgICAqIEBzdW1tYXJ5IFByb3ZpZGVzIGEgSlNPTi1mcmllbmRseSBzbmFwc2hvdCBpbmNsdWRpbmcgcnVubmluZyBzdGF0ZSwgZWxhcHNlZCB0aW1lLCBhbmQgbGFwIGRldGFpbHMuXG4gICAgICogQHJldHVybiB7e3J1bm5pbmc6IGJvb2xlYW4sIGVsYXBzZWRNczogbnVtYmVyLCBsYXBzOiBMYXBbXX19IFNlcmlhbGl6YWJsZSBzdG9wd2F0Y2ggcmVwcmVzZW50YXRpb24uXG4gICAgICovXG4gICAgdG9KU09OKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcnVubmluZzogdGhpcy5fcnVubmluZyxcbiAgICAgICAgICAgIGVsYXBzZWRNczogdGhpcy5lbGFwc2VkTXMsXG4gICAgICAgICAgICBsYXBzOiB0aGlzLl9sYXBzLnNsaWNlKCksXG4gICAgICAgIH07XG4gICAgfVxufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gRm9ybWF0cyBtaWxsaXNlY29uZHMgaW50byBgaGg6bW06c3MubW1tYC5cbiAqIEBzdW1tYXJ5IEJyZWFrcyB0aGUgZHVyYXRpb24gaW50byBob3VycywgbWludXRlcywgc2Vjb25kcywgYW5kIG1pbGxpc2Vjb25kcywgcmV0dXJuaW5nIGEgemVyby1wYWRkZWQgc3RyaW5nLlxuICogQHBhcmFtIHtudW1iZXJ9IG1zIC0gTWlsbGlzZWNvbmRzIHRvIGZvcm1hdC5cbiAqIEByZXR1cm4ge3N0cmluZ30gRm9ybWF0dGVkIGR1cmF0aW9uIHN0cmluZy5cbiAqIEBmdW5jdGlvbiBmb3JtYXRNc1xuICogQG1lbWJlck9mIG1vZHVsZTpMb2dnaW5nXG4gKiBAbWVybWFpZFxuICogc2VxdWVuY2VEaWFncmFtXG4gKiAgIHBhcnRpY2lwYW50IENhbGxlclxuICogICBwYXJ0aWNpcGFudCBGb3JtYXR0ZXIgYXMgZm9ybWF0TXNcbiAqICAgQ2FsbGVyLT4+Rm9ybWF0dGVyOiBmb3JtYXRNcyhtcylcbiAqICAgRm9ybWF0dGVyLT4+Rm9ybWF0dGVyOiBkZXJpdmUgaG91cnMvbWludXRlcy9zZWNvbmRzXG4gKiAgIEZvcm1hdHRlci0+PkZvcm1hdHRlcjogcGFkIHNlZ21lbnRzXG4gKiAgIEZvcm1hdHRlci0tPj5DYWxsZXI6IGhoOm1tOnNzLm1tbVxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0TXMobXMpIHtcbiAgICBjb25zdCBzaWduID0gbXMgPCAwID8gXCItXCIgOiBcIlwiO1xuICAgIGNvbnN0IGFicyA9IE1hdGguYWJzKG1zKTtcbiAgICBjb25zdCBob3VycyA9IE1hdGguZmxvb3IoYWJzIC8gM182MDBfMDAwKTtcbiAgICBjb25zdCBtaW51dGVzID0gTWF0aC5mbG9vcigoYWJzICUgM182MDBfMDAwKSAvIDYwXzAwMCk7XG4gICAgY29uc3Qgc2Vjb25kcyA9IE1hdGguZmxvb3IoKGFicyAlIDYwXzAwMCkgLyAxMDAwKTtcbiAgICBjb25zdCBtaWxsaXMgPSBNYXRoLmZsb29yKGFicyAlIDEwMDApO1xuICAgIGNvbnN0IHBhZCA9IChuLCB3KSA9PiBuLnRvU3RyaW5nKCkucGFkU3RhcnQodywgXCIwXCIpO1xuICAgIHJldHVybiBgJHtzaWdufSR7cGFkKGhvdXJzLCAyKX06JHtwYWQobWludXRlcywgMil9OiR7cGFkKHNlY29uZHMsIDIpfS4ke3BhZChtaWxsaXMsIDMpfWA7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD10aW1lLmpzLm1hcCIsImltcG9ydCB7IExvZ0xldmVsIH0gZnJvbSBcIi4vY29uc3RhbnRzLmpzXCI7XG5pbXBvcnQgeyBMb2dnaW5nIH0gZnJvbSBcIi4vbG9nZ2luZy5qc1wiO1xuaW1wb3J0IHsgbm93IH0gZnJvbSBcIi4vdGltZS5qc1wiO1xuaW1wb3J0IHsgTG9nZ2VkQ2xhc3MgfSBmcm9tIFwiLi9Mb2dnZWRDbGFzcy5qc1wiO1xuLyoqXG4gKiBAZGVzY3JpcHRpb24gTWV0aG9kIGRlY29yYXRvciBmb3IgbG9nZ2luZyBmdW5jdGlvbiBjYWxscy5cbiAqIEBzdW1tYXJ5IFdyYXBzIGNsYXNzIG1ldGhvZHMgdG8gYXV0b21hdGljYWxseSBsb2cgZW50cnksIGV4aXQsIHRpbWluZywgYW5kIG9wdGlvbmFsIGN1c3RvbSBtZXNzYWdlcyBhdCBhIGNvbmZpZ3VyYWJsZSB7QGxpbmsgTG9nTGV2ZWx9LlxuICogQHBhcmFtIHtMb2dMZXZlbH0gbGV2ZWwgLSBMb2cgbGV2ZWwgYXBwbGllZCB0byB0aGUgZ2VuZXJhdGVkIGxvZyBzdGF0ZW1lbnRzIChkZWZhdWx0cyB0byBgTG9nTGV2ZWwuaW5mb2ApLlxuICogQHBhcmFtIHtudW1iZXJ9IFt2ZXJib3NpdHk9MF0gLSBWZXJib3NpdHkgdGhyZXNob2xkIHJlcXVpcmVkIGZvciB0aGUgZW50cnkgbG9nIHRvIGFwcGVhci5cbiAqIEBwYXJhbSB7QXJnRm9ybWF0RnVuY3Rpb259IFtlbnRyeU1lc3NhZ2VdIC0gRm9ybWF0dGVyIGludm9rZWQgd2l0aCB0aGUgb3JpZ2luYWwgbWV0aG9kIGFyZ3VtZW50cyB0byBkZXNjcmliZSB0aGUgaW52b2NhdGlvbi5cbiAqIEBwYXJhbSB7UmV0dXJuRm9ybWF0RnVuY3Rpb259IFtleGl0TWVzc2FnZV0gLSBPcHRpb25hbCBmb3JtYXR0ZXIgdGhhdCBkZXNjcmliZXMgdGhlIG91dGNvbWUgb3IgZmFpbHVyZSBvZiB0aGUgY2FsbC5cbiAqIEByZXR1cm4ge2Z1bmN0aW9uKGFueSwgYW55LCBQcm9wZXJ0eURlc2NyaXB0b3IpOiB2b2lkfSBNZXRob2QgZGVjb3JhdG9yIHByb3h5IHRoYXQgaW5qZWN0cyBsb2dnaW5nIGJlaGF2aW9yLlxuICogQGZ1bmN0aW9uIGxvZ1xuICogQG1lcm1haWRcbiAqIHNlcXVlbmNlRGlhZ3JhbVxuICogICBwYXJ0aWNpcGFudCBDbGllbnRcbiAqICAgcGFydGljaXBhbnQgRGVjb3JhdG9yIGFzIGxvZyBkZWNvcmF0b3JcbiAqICAgcGFydGljaXBhbnQgTWV0aG9kIGFzIE9yaWdpbmFsIE1ldGhvZFxuICogICBwYXJ0aWNpcGFudCBMb2dnZXIgYXMgTG9nZ2luZyBpbnN0YW5jZVxuICpcbiAqICAgQ2xpZW50LT4+RGVjb3JhdG9yOiBjYWxsIGRlY29yYXRlZCBtZXRob2RcbiAqICAgRGVjb3JhdG9yLT4+TG9nZ2VyOiBsb2cgbWV0aG9kIGNhbGxcbiAqICAgRGVjb3JhdG9yLT4+TWV0aG9kOiBjYWxsIG9yaWdpbmFsIG1ldGhvZFxuICogICBhbHQgcmVzdWx0IGlzIFByb21pc2VcbiAqICAgICBNZXRob2QtLT4+RGVjb3JhdG9yOiByZXR1cm4gUHJvbWlzZVxuICogICAgIERlY29yYXRvci0+PkRlY29yYXRvcjogYXR0YWNoIHRoZW4gaGFuZGxlclxuICogICAgIE5vdGUgb3ZlciBEZWNvcmF0b3I6IFByb21pc2UgcmVzb2x2ZXNcbiAqICAgICBEZWNvcmF0b3ItPj5Mb2dnZXI6IGxvZyBiZW5jaG1hcmsgKGlmIGVuYWJsZWQpXG4gKiAgICAgRGVjb3JhdG9yLS0+PkNsaWVudDogcmV0dXJuIHJlc3VsdFxuICogICBlbHNlIHJlc3VsdCBpcyBub3QgUHJvbWlzZVxuICogICAgIE1ldGhvZC0tPj5EZWNvcmF0b3I6IHJldHVybiByZXN1bHRcbiAqICAgICBEZWNvcmF0b3ItPj5Mb2dnZXI6IGxvZyBiZW5jaG1hcmsgKGlmIGVuYWJsZWQpXG4gKiAgICAgRGVjb3JhdG9yLS0+PkNsaWVudDogcmV0dXJuIHJlc3VsdFxuICogICBlbmRcbiAqIEBjYXRlZ29yeSBNZXRob2QgRGVjb3JhdG9yc1xuICovXG5leHBvcnQgZnVuY3Rpb24gbG9nKGxldmVsID0gTG9nTGV2ZWwuaW5mbywgdmVyYm9zaXR5ID0gMCwgZW50cnlNZXNzYWdlID0gKC4uLmFyZ3MpID0+IGBjYWxsZWQgd2l0aCAke2FyZ3N9YCwgZXhpdE1lc3NhZ2UpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gbG9nKHRhcmdldCwgcHJvcGVydHlLZXksIGRlc2NyaXB0b3IpIHtcbiAgICAgICAgaWYgKCFkZXNjcmlwdG9yIHx8IHR5cGVvZiBkZXNjcmlwdG9yID09PSBcIm51bWJlclwiKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBMb2dnaW5nIGRlY29yYXRpb24gb25seSBhcHBsaWVzIHRvIG1ldGhvZHNgKTtcbiAgICAgICAgY29uc3QgbG9nZ2VyID0gdGFyZ2V0IGluc3RhbmNlb2YgTG9nZ2VkQ2xhc3NcbiAgICAgICAgICAgID8gdGFyZ2V0W1wibG9nXCJdLmZvcih0YXJnZXRbcHJvcGVydHlLZXldKVxuICAgICAgICAgICAgOiBMb2dnaW5nLmZvcih0YXJnZXQpLmZvcih0YXJnZXRbcHJvcGVydHlLZXldKTtcbiAgICAgICAgY29uc3QgbWV0aG9kID0gbG9nZ2VyW2xldmVsXS5iaW5kKGxvZ2dlcik7XG4gICAgICAgIGNvbnN0IG9yaWdpbmFsTWV0aG9kID0gZGVzY3JpcHRvci52YWx1ZTtcbiAgICAgICAgZGVzY3JpcHRvci52YWx1ZSA9IG5ldyBQcm94eShvcmlnaW5hbE1ldGhvZCwge1xuICAgICAgICAgICAgYXBwbHkoZm4sIHRoaXNBcmcsIGFyZ3MpIHtcbiAgICAgICAgICAgICAgICBtZXRob2QoZW50cnlNZXNzYWdlKC4uLmFyZ3MpLCB2ZXJib3NpdHkpO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IFJlZmxlY3QuYXBwbHkoZm4sIHRoaXNBcmcsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXRNZXNzYWdlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2QoZXhpdE1lc3NhZ2UodW5kZWZpbmVkLCByKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleGl0TWVzc2FnZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGV4aXRNZXNzYWdlKGUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXRNZXNzYWdlKVxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kKGV4aXRNZXNzYWdlKHVuZGVmaW5lZCwgcmVzdWx0KSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV4aXRNZXNzYWdlKVxuICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmVycm9yKGV4aXRNZXNzYWdlKGVycikpO1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBkZXNjcmlwdG9yO1xuICAgIH07XG59XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBNZXRob2QgZGVjb3JhdG9yIHRoYXQgcmVjb3JkcyBleGVjdXRpb24gdGltZSBhdCB0aGUgYmVuY2htYXJrIGxldmVsLlxuICogQHN1bW1hcnkgV3JhcHMgdGhlIHRhcmdldCBtZXRob2QgdG8gZW1pdCB7QGxpbmsgTG9nZ2VyLmJlbmNobWFya30gZW50cmllcyBjYXB0dXJpbmcgY29tcGxldGlvbiB0aW1lIG9yIGZhaWx1cmUgbGF0ZW5jeS5cbiAqIEByZXR1cm4ge2Z1bmN0aW9uKGFueSwgYW55LCAgUHJvcGVydHlEZXNjcmlwdG9yKTogdm9pZH0gTWV0aG9kIGRlY29yYXRvciBwcm94eSB0aGF0IGJlbmNobWFya3MgdGhlIG9yaWdpbmFsIGltcGxlbWVudGF0aW9uLlxuICogQGZ1bmN0aW9uIGJlbmNobWFya1xuICogQG1lcm1haWRcbiAqIHNlcXVlbmNlRGlhZ3JhbVxuICogICBwYXJ0aWNpcGFudCBDYWxsZXJcbiAqICAgcGFydGljaXBhbnQgRGVjb3JhdG9yIGFzIGJlbmNobWFya1xuICogICBwYXJ0aWNpcGFudCBNZXRob2QgYXMgT3JpZ2luYWwgTWV0aG9kXG4gKiAgIENhbGxlci0+PkRlY29yYXRvcjogaW52b2tlKClcbiAqICAgRGVjb3JhdG9yLT4+TWV0aG9kOiBSZWZsZWN0LmFwcGx5KC4uLilcbiAqICAgYWx0IFByb21pc2UgcmVzdWx0XG4gKiAgICAgTWV0aG9kLS0+PkRlY29yYXRvcjogUHJvbWlzZVxuICogICAgIERlY29yYXRvci0+PkRlY29yYXRvcjogYXR0YWNoIHRoZW4oKVxuICogICAgIERlY29yYXRvci0+PkRlY29yYXRvcjogbG9nIGNvbXBsZXRpb24gZHVyYXRpb25cbiAqICAgZWxzZSBTeW5jaHJvbm91cyByZXN1bHRcbiAqICAgICBNZXRob2QtLT4+RGVjb3JhdG9yOiB2YWx1ZVxuICogICAgIERlY29yYXRvci0+PkRlY29yYXRvcjogbG9nIGNvbXBsZXRpb24gZHVyYXRpb25cbiAqICAgZW5kXG4gKiAgIERlY29yYXRvci0tPj5DYWxsZXI6IHJldHVybiByZXN1bHRcbiAqIEBjYXRlZ29yeSBNZXRob2QgRGVjb3JhdG9yc1xuICovXG5leHBvcnQgZnVuY3Rpb24gYmVuY2htYXJrKCkge1xuICAgIHJldHVybiBmdW5jdGlvbiBiZW5jaG1hcmsodGFyZ2V0LCBwcm9wZXJ0eUtleSwgZGVzY3JpcHRvcikge1xuICAgICAgICBpZiAoIWRlc2NyaXB0b3IgfHwgdHlwZW9mIGRlc2NyaXB0b3IgPT09IFwibnVtYmVyXCIpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYGJlbmNobWFyayBkZWNvcmF0aW9uIG9ubHkgYXBwbGllcyB0byBtZXRob2RzYCk7XG4gICAgICAgIGNvbnN0IGxvZ2dlciA9IHRhcmdldCBpbnN0YW5jZW9mIExvZ2dlZENsYXNzXG4gICAgICAgICAgICA/IHRhcmdldFtcImxvZ1wiXS5mb3IodGFyZ2V0W3Byb3BlcnR5S2V5XSlcbiAgICAgICAgICAgIDogTG9nZ2luZy5mb3IodGFyZ2V0KS5mb3IodGFyZ2V0W3Byb3BlcnR5S2V5XSk7XG4gICAgICAgIGNvbnN0IG9yaWdpbmFsTWV0aG9kID0gZGVzY3JpcHRvci52YWx1ZTtcbiAgICAgICAgZGVzY3JpcHRvci52YWx1ZSA9IG5ldyBQcm94eShvcmlnaW5hbE1ldGhvZCwge1xuICAgICAgICAgICAgYXBwbHkoZm4sIHRoaXNBcmcsIGFyZ3MpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGFydCA9IG5vdygpO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IFJlZmxlY3QuYXBwbHkoZm4sIHRoaXNBcmcsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0IGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmJlbmNobWFyayhgY29tcGxldGVkIGluICR7bm93KCkgLSBzdGFydH1tc2ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsb2dnZXIuYmVuY2htYXJrKGBmYWlsZWQgaW4gJHtub3coKSAtIHN0YXJ0fW1zYCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5iZW5jaG1hcmsoYGNvbXBsZXRlZCBpbiAke25vdygpIC0gc3RhcnR9bXNgKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuYmVuY2htYXJrKGBmYWlsZWQgaW4gJHtub3coKSAtIHN0YXJ0fW1zYCk7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3I7XG4gICAgfTtcbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uIE1ldGhvZCBkZWNvcmF0b3IgZm9yIGxvZ2dpbmcgZnVuY3Rpb24gY2FsbHMgd2l0aCBkZWJ1ZyBsZXZlbC5cbiAqIEBzdW1tYXJ5IENvbnZlbmllbmNlIHdyYXBwZXIgYXJvdW5kIHtAbGluayBsb2d9IHRoYXQgbG9ncyB1c2luZyBgTG9nTGV2ZWwuZGVidWdgLlxuICogQHJldHVybiB7ZnVuY3Rpb24oYW55LCBhbnksIFByb3BlcnR5RGVzY3JpcHRvcik6IHZvaWR9IERlYnVnLWxldmVsIGxvZ2dpbmcgZGVjb3JhdG9yLlxuICogQGZ1bmN0aW9uIGRlYnVnXG4gKiBAY2F0ZWdvcnkgTWV0aG9kIERlY29yYXRvcnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlYnVnKCkge1xuICAgIHJldHVybiBsb2coTG9nTGV2ZWwuZGVidWcsIDAsICguLi5hcmdzKSA9PiBgY2FsbGVkIHdpdGggJHthcmdzfWAsIChlLCByZXN1bHQpID0+IGVcbiAgICAgICAgPyBgRmFpbGVkIHdpdGg6ICR7ZX1gXG4gICAgICAgIDogcmVzdWx0XG4gICAgICAgICAgICA/IGBDb21wbGV0ZWQgd2l0aCAke0pTT04uc3RyaW5naWZ5KHJlc3VsdCl9YFxuICAgICAgICAgICAgOiBcImNvbXBsZXRlZFwiKTtcbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uIE1ldGhvZCBkZWNvcmF0b3IgZm9yIGxvZ2dpbmcgZnVuY3Rpb24gY2FsbHMgd2l0aCBpbmZvIGxldmVsLlxuICogQHN1bW1hcnkgQ29udmVuaWVuY2Ugd3JhcHBlciBhcm91bmQge0BsaW5rIGxvZ30gdGhhdCBsb2dzIHVzaW5nIGBMb2dMZXZlbC5pbmZvYC5cbiAqIEByZXR1cm4ge2Z1bmN0aW9uKGFueSwgYW55LCBQcm9wZXJ0eURlc2NyaXB0b3IpOiB2b2lkfSBJbmZvLWxldmVsIGxvZ2dpbmcgZGVjb3JhdG9yLlxuICogQGZ1bmN0aW9uIGluZm9cbiAqIEBjYXRlZ29yeSBNZXRob2QgRGVjb3JhdG9yc1xuICovXG5leHBvcnQgZnVuY3Rpb24gaW5mbygpIHtcbiAgICByZXR1cm4gbG9nKExvZ0xldmVsLmluZm8pO1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gTWV0aG9kIGRlY29yYXRvciBmb3IgbG9nZ2luZyBmdW5jdGlvbiBjYWxscyB3aXRoIHNpbGx5IGxldmVsLlxuICogQHN1bW1hcnkgQ29udmVuaWVuY2Ugd3JhcHBlciBhcm91bmQge0BsaW5rIGxvZ30gdGhhdCBsb2dzIHVzaW5nIGBMb2dMZXZlbC5zaWxseWAuXG4gKiBAcmV0dXJuIHtmdW5jdGlvbihhbnksIGFueSwgUHJvcGVydHlEZXNjcmlwdG9yKTogdm9pZH0gU2lsbHktbGV2ZWwgbG9nZ2luZyBkZWNvcmF0b3IuXG4gKiBAZnVuY3Rpb24gc2lsbHlcbiAqIEBjYXRlZ29yeSBNZXRob2QgRGVjb3JhdG9yc1xuICovXG5leHBvcnQgZnVuY3Rpb24gc2lsbHkoKSB7XG4gICAgcmV0dXJuIGxvZyhMb2dMZXZlbC5zaWxseSk7XG59XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBNZXRob2QgZGVjb3JhdG9yIGZvciBsb2dnaW5nIGZ1bmN0aW9uIGNhbGxzIHdpdGggdHJhY2UgbGV2ZWwuXG4gKiBAc3VtbWFyeSBDb252ZW5pZW5jZSB3cmFwcGVyIGFyb3VuZCB7QGxpbmsgbG9nfSB0aGF0IGxvZ3MgdXNpbmcgYExvZ0xldmVsLnRyYWNlYC5cbiAqIEByZXR1cm4ge2Z1bmN0aW9uKGFueSwgYW55LCBQcm9wZXJ0eURlc2NyaXB0b3IpOiB2b2lkfSBUcmFjZS1sZXZlbCBsb2dnaW5nIGRlY29yYXRvci5cbiAqIEBmdW5jdGlvbiB0cmFjZVxuICogQGNhdGVnb3J5IE1ldGhvZCBEZWNvcmF0b3JzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0cmFjZSgpIHtcbiAgICByZXR1cm4gbG9nKExvZ0xldmVsLnRyYWNlKTtcbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uIE1ldGhvZCBkZWNvcmF0b3IgZm9yIGxvZ2dpbmcgZnVuY3Rpb24gY2FsbHMgd2l0aCB2ZXJib3NlIGxldmVsLlxuICogQHN1bW1hcnkgQ29udmVuaWVuY2Ugd3JhcHBlciBhcm91bmQge0BsaW5rIGxvZ30gdGhhdCBsb2dzIHVzaW5nIGBMb2dMZXZlbC52ZXJib3NlYCB3aXRoIGNvbmZpZ3VyYWJsZSB2ZXJib3NpdHkgYW5kIG9wdGlvbmFsIGJlbmNobWFya2luZy5cbiAqIEBwYXJhbSB7bnVtYmVyfGJvb2xlYW59IHZlcmJvc2l0eSAtIFZlcmJvc2l0eSBsZXZlbCBmb3IgbG9nIGZpbHRlcmluZyBvciBmbGFnIHRvIGVuYWJsZSBiZW5jaG1hcmtpbmcuXG4gKiBAcmV0dXJuIHtmdW5jdGlvbihhbnksIGFueSxQcm9wZXJ0eURlc2NyaXB0b3IpOiB2b2lkfSBWZXJib3NlIGxvZ2dpbmcgZGVjb3JhdG9yLlxuICogQGZ1bmN0aW9uIHZlcmJvc2VcbiAqIEBjYXRlZ29yeSBNZXRob2QgRGVjb3JhdG9yc1xuICovXG5leHBvcnQgZnVuY3Rpb24gdmVyYm9zZSh2ZXJib3NpdHkgPSAwKSB7XG4gICAgaWYgKCF2ZXJib3NpdHkpIHtcbiAgICAgICAgdmVyYm9zaXR5ID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIGxvZyhMb2dMZXZlbC52ZXJib3NlLCB2ZXJib3NpdHkpO1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gQ3JlYXRlcyBhIGRlY29yYXRvciB0aGF0IG1ha2VzIGEgbWV0aG9kIG5vbi1jb25maWd1cmFibGUuXG4gKiBAc3VtbWFyeSBQcmV2ZW50cyBvdmVycmlkaW5nIGJ5IG1hcmtpbmcgdGhlIG1ldGhvZCBkZXNjcmlwdG9yIGFzIG5vbi1jb25maWd1cmFibGUsIHRocm93aW5nIGlmIGFwcGxpZWQgdG8gbm9uLW1ldGhvZCB0YXJnZXRzLlxuICogQHJldHVybiB7ZnVuY3Rpb24ob2JqZWN0LCBhbnksIFByb3BlcnR5RGVzY3JpcHRvcik6IFByb3BlcnR5RGVzY3JpcHRvcnx1bmRlZmluZWR9IERlY29yYXRvciB0aGF0IGhhcmRlbnMgdGhlIG1ldGhvZCBkZXNjcmlwdG9yLlxuICogQGZ1bmN0aW9uIGZpbmFsXG4gKiBAY2F0ZWdvcnkgTWV0aG9kIERlY29yYXRvcnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmFsKCkge1xuICAgIHJldHVybiAodGFyZ2V0LCBwcm9wZXJ0eUtleSwgZGVzY3JpcHRvcikgPT4ge1xuICAgICAgICBpZiAoIWRlc2NyaXB0b3IpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJmaW5hbCBkZWNvcmF0b3IgY2FuIG9ubHkgYmUgdXNlZCBvbiBtZXRob2RzXCIpO1xuICAgICAgICBpZiAoZGVzY3JpcHRvcj8uY29uZmlndXJhYmxlKSB7XG4gICAgICAgICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZXNjcmlwdG9yO1xuICAgIH07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kZWNvcmF0b3JzLmpzLm1hcCIsInZhciBfX2RlY29yYXRlID0gKHRoaXMgJiYgdGhpcy5fX2RlY29yYXRlKSB8fCBmdW5jdGlvbiAoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xufTtcbnZhciBfX21ldGFkYXRhID0gKHRoaXMgJiYgdGhpcy5fX21ldGFkYXRhKSB8fCBmdW5jdGlvbiAoaywgdikge1xuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5tZXRhZGF0YSA9PT0gXCJmdW5jdGlvblwiKSByZXR1cm4gUmVmbGVjdC5tZXRhZGF0YShrLCB2KTtcbn07XG5pbXBvcnQgeyBMb2dGaWx0ZXIgfSBmcm9tIFwiLi9Mb2dGaWx0ZXIuanNcIjtcbmltcG9ydCB7IGZpbmFsIH0gZnJvbSBcIi4vLi4vZGVjb3JhdG9ycy5qc1wiO1xuLyoqXG4gKiBAZGVzY3JpcHRpb24gRmlsdGVyIHRoYXQgcGF0Y2hlcyBsb2cgbWVzc2FnZXMgdXNpbmcgcmVndWxhciBleHByZXNzaW9ucy5cbiAqIEBzdW1tYXJ5IEFwcGxpZXMgYSBjb25maWd1cmVkIHtAbGluayBSZWdFeHB9IGFuZCByZXBsYWNlbWVudCBzdHJhdGVneSB0byByZWRhY3QsIG1hc2ssIG9yIHJlc3RydWN0dXJlIGxvZyBwYXlsb2FkcyBiZWZvcmUgdGhleSBhcmUgZW1pdHRlZC5cbiAqIEBwYXJhbSB7UmVnRXhwfSByZWdleHAgLSBFeHByZXNzaW9uIHVzZWQgdG8gZGV0ZWN0IHNlbnNpdGl2ZSBvciBmb3JtYXR0ZWQgdGV4dC5cbiAqIEBwYXJhbSB7c3RyaW5nfFJlcGxhY2VtZW50RnVuY3Rpb259IHJlcGxhY2VtZW50IC0gUmVwbGFjZW1lbnQgc3RyaW5nIG9yIGNhbGxiYWNrIGludm9rZWQgZm9yIGVhY2ggbWF0Y2guXG4gKiBAY2xhc3MgUGF0dGVybkZpbHRlclxuICogQGV4YW1wbGVcbiAqIGNvbnN0IGZpbHRlciA9IG5ldyBQYXR0ZXJuRmlsdGVyKC90b2tlbj1bXiZdKy9nLCBcInRva2VuPSoqKlwiKTtcbiAqIGNvbnN0IHNhbml0aXplZCA9IGZpbHRlci5maWx0ZXIoY29uZmlnLCBcInRva2VuPTEyMyZ1c2VyPXRvbVwiLCBbXSk7XG4gKiAvLyBzYW5pdGl6ZWQgPT09IFwidG9rZW49KioqJnVzZXI9dG9tXCJcbiAqIEBtZXJtYWlkXG4gKiBzZXF1ZW5jZURpYWdyYW1cbiAqICAgcGFydGljaXBhbnQgTG9nZ2VyXG4gKiAgIHBhcnRpY2lwYW50IEZpbHRlciBhcyBQYXR0ZXJuRmlsdGVyXG4gKiAgIHBhcnRpY2lwYW50IFJlZ0V4cFxuICogICBMb2dnZXItPj5GaWx0ZXI6IGZpbHRlcihjb25maWcsIG1lc3NhZ2UsIGNvbnRleHQpXG4gKiAgIEZpbHRlci0+PlJlZ0V4cDogZXhlY3V0ZSBtYXRjaCgpXG4gKiAgIGFsdCBtYXRjaCBmb3VuZFxuICogICAgIFJlZ0V4cC0tPj5GaWx0ZXI6IGNhcHR1cmVzXG4gKiAgICAgRmlsdGVyLT4+UmVnRXhwOiByZXBsYWNlKG1lc3NhZ2UsIHJlcGxhY2VtZW50KVxuICogICAgIFJlZ0V4cC0tPj5GaWx0ZXI6IHRyYW5zZm9ybWVkIG1lc3NhZ2VcbiAqICAgZWxzZSBubyBtYXRjaFxuICogICAgIFJlZ0V4cC0tPj5GaWx0ZXI6IG51bGxcbiAqICAgZW5kXG4gKiAgIEZpbHRlci0tPj5Mb2dnZXI6IHNhbml0aXplZCBtZXNzYWdlXG4gKi9cbmV4cG9ydCBjbGFzcyBQYXR0ZXJuRmlsdGVyIGV4dGVuZHMgTG9nRmlsdGVyIHtcbiAgICBjb25zdHJ1Y3RvcihyZWdleHAsIHJlcGxhY2VtZW50KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucmVnZXhwID0gcmVnZXhwO1xuICAgICAgICB0aGlzLnJlcGxhY2VtZW50ID0gcmVwbGFjZW1lbnQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBFbnN1cmVzIGRldGVybWluaXN0aWMgUmVnRXhwIG1hdGNoaW5nLlxuICAgICAqIEBzdW1tYXJ5IFJ1bnMgdGhlIGNvbmZpZ3VyZWQgZXhwcmVzc2lvbiwgdGhlbiByZXNldHMgaXRzIHN0YXRlIHNvIHJlcGVhdGVkIGludm9jYXRpb25zIGJlaGF2ZSBjb25zaXN0ZW50bHkuXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2UgLSBNZXNzYWdlIHRvIHRlc3QgZm9yIG1hdGNoZXMuXG4gICAgICogQHJldHVybiB7UmVnRXhwRXhlY0FycmF5fG51bGx9IE1hdGNoIHJlc3VsdCBvciBudWxsIHdoZW4gbm8gbWF0Y2ggaXMgZm91bmQuXG4gICAgICovXG4gICAgbWF0Y2gobWVzc2FnZSkge1xuICAgICAgICBjb25zdCBtYXRjaCA9IHRoaXMucmVnZXhwLmV4ZWMobWVzc2FnZSk7XG4gICAgICAgIHRoaXMucmVnZXhwLmxhc3RJbmRleCA9IDA7XG4gICAgICAgIHJldHVybiBtYXRjaDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEFwcGxpZXMgdGhlIHJlcGxhY2VtZW50IHN0cmF0ZWd5IHRvIHRoZSBpbmNvbWluZyBtZXNzYWdlLlxuICAgICAqIEBzdW1tYXJ5IEV4ZWN1dGVzIHtAbGluayBQYXR0ZXJuRmlsdGVyLm1hdGNofSBhbmQsIHdoZW4gYSBtYXRjaCBpcyBmb3VuZCwgcmVwbGFjZXMgZXZlcnkgb2NjdXJyZW5jZSB1c2luZyB0aGUgY29uZmlndXJlZCByZXBsYWNlbWVudCBoYW5kbGVyLlxuICAgICAqIEBwYXJhbSB7TG9nZ2luZ0NvbmZpZ30gY29uZmlnIC0gQWN0aXZlIGxvZ2dpbmcgY29uZmlndXJhdGlvbiAodW51c2VkIGJ1dCBwYXJ0IG9mIHRoZSBmaWx0ZXIgY29udHJhY3QpLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIC0gTWVzc2FnZSB0byBiZSBzYW5pdGl6ZWQuXG4gICAgICogQHBhcmFtIHtzdHJpbmdbXX0gY29udGV4dCAtIENvbnRleHQgZW50cmllcyBhc3NvY2lhdGVkIHdpdGggdGhlIGxvZyBldmVudC5cbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IFNhbml0aXplZCBsb2cgbWVzc2FnZS5cbiAgICAgKi9cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG4gICAgZmlsdGVyKGNvbmZpZywgbWVzc2FnZSwgY29udGV4dCkge1xuICAgICAgICBjb25zdCBsb2cgPSB0aGlzLmxvZy5mb3IodGhpcy5maWx0ZXIpO1xuICAgICAgICBjb25zdCBtYXRjaCA9IHRoaXMubWF0Y2gobWVzc2FnZSk7XG4gICAgICAgIGlmICghbWF0Y2gpXG4gICAgICAgICAgICByZXR1cm4gbWVzc2FnZTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBtZXNzYWdlLnJlcGxhY2UodGhpcy5yZWdleHAsIHRoaXMucmVwbGFjZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBsb2cuZXJyb3IoYFBhdHRlcm5GaWx0ZXIgcmVwbGFjZW1lbnQgZXJyb3I6ICR7ZX1gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG59XG5fX2RlY29yYXRlKFtcbiAgICBmaW5hbCgpLFxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246dHlwZVwiLCBGdW5jdGlvbiksXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpwYXJhbXR5cGVzXCIsIFtTdHJpbmddKSxcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnJldHVybnR5cGVcIiwgdm9pZCAwKVxuXSwgUGF0dGVybkZpbHRlci5wcm90b3R5cGUsIFwibWF0Y2hcIiwgbnVsbCk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1QYXR0ZXJuRmlsdGVyLmpzLm1hcCIsImltcG9ydCBmcyBmcm9tIFwiZnNcIjtcbmltcG9ydCB5YW1sIGZyb20gXCJqcy15YW1sXCI7XG5pbXBvcnQgeyBMb2dnaW5nIH0gZnJvbSBcIkBkZWNhZi10cy9sb2dnaW5nXCI7XG5cbmNvbnN0IGxvZ2dlciA9IExvZ2dpbmcuZm9yKFwieWFtbFwiKTtcblxuLyoqXG4gKiBAZGVzY3JpcHRpb24gUmVhZHMgYW5kIHBhcnNlcyBhIFlBTUwgZmlsZSwgb3B0aW9uYWxseSByZXRyaWV2aW5nIGEgc3BlY2lmaWMgcHJvcGVydHkuXG4gKiBAc3VtbWFyeSBUaGlzIGZ1bmN0aW9uIHJlYWRzIGEgWUFNTCBmaWxlIGZyb20gdGhlIGdpdmVuIHBhdGgsIHBhcnNlcyBpdHMgY29udGVudCwgYW5kIHJldHVybnMgZWl0aGVyIHRoZSBlbnRpcmUgcGFyc2VkIFlBTUwgb2JqZWN0IG9yIGEgc3BlY2lmaWMgcHJvcGVydHkgdmFsdWUgYmFzZWQgb24gdGhlIHByb3ZpZGVkIHBhdGguXG4gKlxuICogQGZ1bmN0aW9uIHJlYWRGaWxlWWFtbFxuICogQHRlbXBsYXRlIFQgLSBUaGUgdHlwZSBvZiB0aGUgcmV0dXJuZWQgdmFsdWUgd2hlbiBhIHNwZWNpZmljIHByb3BlcnR5IGlzIHJlcXVlc3RlZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSB5YW1sRmlsZVBhdGggLSBUaGUgcGF0aCB0byB0aGUgWUFNTCBmaWxlIHRvIGJlIHJlYWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gW3ZhcmlhYmxlXSAtIE9wdGlvbmFsLiBBIGRvdC1ub3RhdGVkIHBhdGggc3RyaW5nIHRoYXQgc3BlY2lmaWVzIHRoZSBwcm9wZXJ0eSB0byByZXRyaWV2ZSBmcm9tIHRoZSBwYXJzZWQgWUFNTC5cbiAqIEByZXR1cm4ge1JlY29yZDxzdHJpbmcsIGFueT4gfCBUfSBSZXR1cm5zIHRoZSBlbnRpcmUgcGFyc2VkIFlBTUwgb2JqZWN0IGlmIG5vIGB2YXJpYWJsZWAgaXMgcHJvdmlkZWQsIG9yIHRoZSB2YWx1ZSBvZiB0aGUgc3BlY2lmaWVkIHByb3BlcnR5IGlmIGB2YXJpYWJsZWAgaXMgcHJvdmlkZWQuXG4gKlxuICogQG1lbWJlck9mIG1vZHVsZTpmYWJyaWMtd2VhdmVyLlV0aWxzXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIEV4YW1wbGUgMTogUmVhZCB0aGUgZW50aXJlIFlBTUwgZmlsZVxuICogY29uc3QgY29uZmlnID0gcmVhZEZpbGVZYW1sKFwiY29uZmlnL3NldHRpbmdzLnlhbWxcIik7XG4gKiBjb25zb2xlLmxvZyhjb25maWcpO1xuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBFeGFtcGxlIDI6IFJldHJpZXZlIGEgc3BlY2lmaWMgcHJvcGVydHkgZnJvbSB0aGUgWUFNTCBmaWxlXG4gKiBjb25zdCBkYkhvc3QgPSByZWFkRmlsZVlhbWwoXCJjb25maWcvc2V0dGluZ3MueWFtbFwiLCBcImRhdGFiYXNlLmhvc3RcIik7XG4gKiBjb25zb2xlLmxvZyhkYkhvc3QpO1xuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBFeGFtcGxlIDM6IEhhbmRsZSBhbiBlcnJvciBpZiB0aGUgcHJvcGVydHkgZG9lcyBub3QgZXhpc3RcbiAqIGNvbnN0IGludmFsaWRQcm9wZXJ0eSA9IHJlYWRGaWxlWWFtbChcImNvbmZpZy9zZXR0aW5ncy55YW1sXCIsIFwic2VydmVyLnBvcnRcIik7XG4gKlxuICogQG1lcm1haWRcbiAqIHNlcXVlbmNlRGlhZ3JhbVxuICogICBwYXJ0aWNpcGFudCBDYWxsZXJcbiAqICAgcGFydGljaXBhbnQgcmVhZEZpbGVZYW1sXG4gKiAgIHBhcnRpY2lwYW50IGxvZ2dlclxuICogICBwYXJ0aWNpcGFudCBmc1xuICogICBwYXJ0aWNpcGFudCB5YW1sXG4gKlxuICogICBDYWxsZXItPj5yZWFkRmlsZVlhbWw6IENhbGwgd2l0aCB5YW1sRmlsZVBhdGggYW5kIG9wdGlvbmFsIHZhcmlhYmxlXG4gKiAgIHJlYWRGaWxlWWFtbC0+PmxvZ2dlcjogTG9nIHZlcmJvc2UgbWVzc2FnZSAoUmVhZGluZyBZQU1MIGZpbGUpXG4gKiAgIHJlYWRGaWxlWWFtbC0+PmZzOiBSZWFkIGZpbGUgY29udGVudFxuICogICByZWFkRmlsZVlhbWwtPj5sb2dnZXI6IExvZyB2ZXJib3NlIG1lc3NhZ2UgKFBhcnNlZCBZQU1MIGNvbnRlbnQpXG4gKiAgIHJlYWRGaWxlWWFtbC0+PnlhbWw6IFBhcnNlIFlBTUwgY29udGVudFxuICogICByZWFkRmlsZVlhbWwtPj5sb2dnZXI6IExvZyB2ZXJib3NlIG1lc3NhZ2UgKFBhcnNlZCBZQU1MIG9iamVjdClcbiAqICAgYWx0IHZhcmlhYmxlIGlzIHByb3ZpZGVkXG4gKiAgICAgcmVhZEZpbGVZYW1sLT4+cmVhZEZpbGVZYW1sOiBOYXZpZ2F0ZSB0aHJvdWdoIHBhcnNlZCBZQU1MIHVzaW5nIHZhcmlhYmxlIHBhdGhcbiAqICAgICBhbHQgUHJvcGVydHkgZXhpc3RzXG4gKiAgICAgICByZWFkRmlsZVlhbWwtLT4+Q2FsbGVyOiBSZXR1cm4gc3BlY2lmaWMgcHJvcGVydHkgdmFsdWVcbiAqICAgICBlbHNlIFByb3BlcnR5IGRvZXNuJ3QgZXhpc3RcbiAqICAgICAgIHJlYWRGaWxlWWFtbC0+PmxvZ2dlcjogTG9nIGVycm9yIG1lc3NhZ2VcbiAqICAgICAgIHJlYWRGaWxlWWFtbC0tPj5DYWxsZXI6IFJldHVybiBlcnJvclxuICogICAgIGVuZFxuICogICBlbHNlIHZhcmlhYmxlIGlzIG5vdCBwcm92aWRlZFxuICogICAgIHJlYWRGaWxlWWFtbC0tPj5DYWxsZXI6IFJldHVybiBlbnRpcmUgcGFyc2VkIFlBTUwgb2JqZWN0XG4gKiAgIGVuZFxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVhZEZpbGVZYW1sPFQ+KFxuICB5YW1sRmlsZVBhdGg6IHN0cmluZyxcbiAgdmFyaWFibGU/OiBzdHJpbmdcbik6IFJlY29yZDxzdHJpbmcsIGFueT4gfCBUIHtcbiAgY29uc3QgbG9nID0gbG9nZ2VyLmZvcihyZWFkRmlsZVlhbWwpO1xuXG4gIGxvZy5kZWJ1ZyhgUmVhZGluZyBZQU1MIGZpbGU6ICR7eWFtbEZpbGVQYXRofWApO1xuICBjb25zdCBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKHlhbWxGaWxlUGF0aCwgXCJ1dGY4XCIpO1xuXG4gIGxvZy5kZWJ1ZyhgUGFyc2VkIFlBTUwgY29udGVudDogJHtjb250ZW50fWApO1xuICBjb25zdCBwYXJzZWRZQU1MID0geWFtbC5sb2FkKGNvbnRlbnQpIGFzIFJlY29yZDxzdHJpbmcsIGFueT47XG5cbiAgbG9nLmRlYnVnKGBQYXJzZWQgWUFNTCBvYmplY3Q6ICR7SlNPTi5zdHJpbmdpZnkocGFyc2VkWUFNTCwgbnVsbCwgMil9YCk7XG5cbiAgbG9nLmluZm8oXG4gICAgYFJldHVybmluZyAke3ZhcmlhYmxlID8gYHByb3BlcnR5ICcke3ZhcmlhYmxlfSdgIDogXCJ0aGUgZW50aXJlIHBhcnNlZCBZQU1MIG9iamVjdFwifWBcbiAgKTtcbiAgaWYgKCF2YXJpYWJsZSkgcmV0dXJuIHBhcnNlZFlBTUw7XG5cbiAgY29uc3QgdmFyaWFibGVQYXRoID0gdmFyaWFibGUuc3BsaXQoXCIuXCIpO1xuXG4gIHJldHVybiB2YXJpYWJsZVBhdGgucmVkdWNlKChhY2MsIGtleSkgPT4ge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbiAgICBpZiAoIWFjYy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBVbmFibGUgdG8gbG9jYXRlIGEgcHJvcGVydHkgbmFtZWQgJyR7a2V5fScgZnJvbSBwYXRoICcke3ZhcmlhYmxlfScgaW4gZmlsZTogXFxuPiAke3lhbWxGaWxlUGF0aH1gXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gdHlwZW9mIGFjY1trZXldID09PSBcInN0cmluZ1wiID8gYWNjW2tleV0udHJpbSgpIDogYWNjW2tleV07XG4gIH0sIHBhcnNlZFlBTUwpO1xufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiBXcml0ZXMgYSBKU09OIG9iamVjdCB0byBhIFlBTUwgZmlsZS5cbiAqIEBzdW1tYXJ5IFRoaXMgZnVuY3Rpb24gdGFrZXMgYSBKU09OIG9iamVjdCBhbmQgd3JpdGVzIGl0IHRvIGEgc3BlY2lmaWVkIGZpbGUgcGF0aCBpbiBZQU1MIGZvcm1hdC5cbiAqIEl0IHVzZXMganMteWFtbCB0byBjb252ZXJ0IHRoZSBKU09OIHRvIFlBTUwsIGFuZCB0aGVuIHdyaXRlcyB0aGUgY29udGVudCB0byB0aGUgZmlsZS5cbiAqXG4gKiBAZnVuY3Rpb24gd3JpdGVGaWxlWWFtbFxuICogQHRlbXBsYXRlIFQgLSBUaGUgdHlwZSBvZiB0aGUgSlNPTiBvYmplY3QgdG8gYmUgd3JpdHRlbi5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gVGhlIGZpbGUgcGF0aCB3aGVyZSB0aGUgWUFNTCBjb250ZW50IHdpbGwgYmUgd3JpdHRlbi5cbiAqIEBwYXJhbSB7VH0ganNvbiAtIFRoZSBKU09OIG9iamVjdCB0byBiZSBjb252ZXJ0ZWQgdG8gWUFNTCBhbmQgd3JpdHRlbiB0byB0aGUgZmlsZS5cbiAqIEByZXR1cm4ge3ZvaWR9XG4gKlxuICogQG1lbWJlck9mIG1vZHVsZTpmYWJyaWMtd2VhdmVyLlV0aWxzXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IGNvbmZpZyA9IHsgZGF0YWJhc2U6IHsgaG9zdDogJ2xvY2FsaG9zdCcsIHBvcnQ6IDU0MzIgfSB9O1xuICogd3JpdGVGaWxlWWFtbCgnY29uZmlnL3NldHRpbmdzLnlhbWwnLCBjb25maWcpO1xuICpcbiAqIEBtZXJtYWlkXG4gKiBzZXF1ZW5jZURpYWdyYW1cbiAqICAgcGFydGljaXBhbnQgQ2FsbGVyXG4gKiAgIHBhcnRpY2lwYW50IHdyaXRlRmlsZVlhbWxcbiAqICAgcGFydGljaXBhbnQgbG9nZ2VyXG4gKiAgIHBhcnRpY2lwYW50IHlhbWxcbiAqICAgcGFydGljaXBhbnQgZnNcbiAqXG4gKiAgIENhbGxlci0+PndyaXRlRmlsZVlhbWw6IENhbGwgd2l0aCBwYXRoIGFuZCBKU09OXG4gKiAgIHdyaXRlRmlsZVlhbWwtPj5sb2dnZXI6IExvZyB2ZXJib3NlIG1lc3NhZ2UgKFdyaXRpbmcgWUFNTCBmaWxlKVxuICogICB3cml0ZUZpbGVZYW1sLT4+bG9nZ2VyOiBMb2cgdmVyYm9zZSBtZXNzYWdlIChXcml0aW5nIFlBTUwgY29udGVudClcbiAqICAgd3JpdGVGaWxlWWFtbC0+PnlhbWw6IENvbnZlcnQgSlNPTiB0byBZQU1MXG4gKiAgIHdyaXRlRmlsZVlhbWwtPj5sb2dnZXI6IExvZyB2ZXJib3NlIG1lc3NhZ2UgKFdyaXRpbmcgWUFNTCBjb250ZW50IHRvIGZpbGUpXG4gKiAgIHdyaXRlRmlsZVlhbWwtPj5mczogV3JpdGUgWUFNTCBjb250ZW50IHRvIGZpbGVcbiAqICAgd3JpdGVGaWxlWWFtbC0tPj5DYWxsZXI6IFJldHVybiAodm9pZClcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdyaXRlRmlsZVlhbWw8VD4ocGF0aDogc3RyaW5nLCBqc29uOiBUKSB7XG4gIGNvbnN0IGxvZyA9IGxvZ2dlci5mb3Iod3JpdGVGaWxlWWFtbCk7XG5cbiAgbG9nLmRlYnVnKGBXcml0aW5nIFlBTUwgZmlsZTogJHtwYXRofWApO1xuICBsb2cuZGVidWcoYFdyaXRpbmcgWUFNTCBjb250ZW50OiAke0pTT04uc3RyaW5naWZ5KGpzb24sIG51bGwsIDIpfWApO1xuICBjb25zdCBjb250ZW50ID0geWFtbC5kdW1wKGpzb24sIHsgaW5kZW50OiAyLCBsaW5lV2lkdGg6IC0xIH0pO1xuXG4gIGxvZy5kZWJ1ZyhgV3JpdGluZyBZQU1MIGNvbnRlbnQgdG8gZmlsZTogJHtjb250ZW50fWApO1xuICBmcy53cml0ZUZpbGVTeW5jKHBhdGgsIGNvbnRlbnQucmVwbGFjZSgvIG51bGwkL2dtLCBcIlwiKSwgXCJ1dGY4XCIpO1xufVxuIiwiZXhwb3J0IGVudW0gRmFicmljQmluYXJpZXMge1xuICBDT05GSUdUWExBVE9SID0gXCJjb25maWd0eGxhdG9yXCIsXG4gIENMSUVOVCA9IFwiZmFicmljLWNhLWNsaWVudFwiLFxuICBTRVJWRVIgPSBcImZhYnJpYy1jYS1zZXJ2ZXJcIixcbiAgT1JERVJFUiA9IFwib3JkZXJlclwiLFxuICBQRUVSID0gXCJwZWVyXCIsXG4gIENPTkZJR1RYR0VOID0gXCJjb25maWd0eGdlblwiLFxuICBPU05BRE1JTiA9IFwib3NuYWRtaW5cIixcbn1cbiIsImltcG9ydCB7IExvZ2dlciwgTG9nZ2luZyB9IGZyb20gXCJAZGVjYWYtdHMvbG9nZ2luZ1wiO1xuaW1wb3J0IHsgRmFicmljQmluYXJpZXMgfSBmcm9tIFwiLi4vY29uc3RhbnRzL2ZhYnJpYy1iaW5hcmllc1wiO1xuaW1wb3J0IHsgbWFwUGFyc2VyIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3BhcnNlcnNcIjtcbmltcG9ydCB7IHJ1bkNvbW1hbmQgfSBmcm9tIFwiLi4vLi4vdXRpbHMvY2hpbGQtcHJvY2Vzc1wiO1xuXG5leHBvcnQgZW51bSBDb25maWd0eGxhdG9yQ29tbWFuZCB7XG4gIFNUQVJUID0gXCJzdGFydFwiLFxuICBQUk9UT19FTkNPREUgPSBcInByb3RvX2VuY29kZVwiLFxuICBQUk9UT19ERUNPREUgPSBcInByb3RvX2RlY29kZVwiLFxuICBQUk9UT19DT01QQVJFID0gXCJwcm90b19jb21wYXJlXCIsXG4gIENPTVBVVEVfVVBEQVRFID0gXCJjb21wdXRlX3VwZGF0ZVwiLFxuICBWRVJTSU9OID0gXCJ2ZXJzaW9uXCIsXG4gIEhFTFAgPSBcImhlbHBcIixcbn1cblxuZXhwb3J0IGVudW0gQ29uZmlndHhsYXRvclByb3RvTWVzc2FnZSB7XG4gIEJMT0NLID0gXCJjb21tb24uQmxvY2tcIixcbiAgQkxPQ0tfREFUQSA9IFwiY29tbW9uLkJsb2NrRGF0YVwiLFxuICBCTE9DS19NRVRBREFUQSA9IFwiY29tbW9uLkJsb2NrTWV0YWRhdGFcIixcbiAgQ09ORklHID0gXCJjb21tb24uQ29uZmlnXCIsXG4gIENPTkZJR19FTlZFTE9QRSA9IFwiY29tbW9uLkNvbmZpZ0VudmVsb3BlXCIsXG4gIENPTkZJR19VUERBVEUgPSBcImNvbW1vbi5Db25maWdVcGRhdGVcIixcbiAgQ09ORklHX1VQREFURV9FTlZFTE9QRSA9IFwiY29tbW9uLkNvbmZpZ1VwZGF0ZUVudmVsb3BlXCIsXG4gIEVOVkVMT1BFID0gXCJjb21tb24uRW52ZWxvcGVcIixcbiAgU0lHTkVEX0VOVkVMT1BFID0gXCJjb21tb24uU2lnbmVkRW52ZWxvcGVcIixcbiAgQ0hBSU5DT0RFX0RFRklOSVRJT04gPSBcInBlZXIuQ2hhaW5jb2RlRGVmaW5pdGlvblwiLFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvbmZpZ3R4bGF0b3JTdGFydE9wdGlvbnMge1xuICBhZGRyZXNzPzogc3RyaW5nO1xuICBwb3J0PzogbnVtYmVyO1xuICB0bHM/OiBib29sZWFuO1xuICBjYWZpbGU/OiBzdHJpbmc7XG4gIGNlcnRmaWxlPzogc3RyaW5nO1xuICBrZXlmaWxlPzogc3RyaW5nO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvbmZpZ3R4bGF0b3JQcm90b09wdGlvbnMge1xuICBpbnB1dD86IHN0cmluZztcbiAgb3V0cHV0Pzogc3RyaW5nO1xuICB0eXBlPzogQ29uZmlndHhsYXRvclByb3RvTWVzc2FnZSB8IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb25maWd0eGxhdG9yUHJvdG9Db21wYXJlT3B0aW9ucyB7XG4gIG9yaWdpbmFsPzogc3RyaW5nO1xuICB1cGRhdGVkPzogc3RyaW5nO1xuICBvdXRwdXQ/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29uZmlndHhsYXRvckNvbXB1dGVVcGRhdGVPcHRpb25zIHtcbiAgY2hhbm5lbElkPzogc3RyaW5nO1xuICBvcmlnaW5hbD86IHN0cmluZztcbiAgdXBkYXRlZD86IHN0cmluZztcbiAgb3V0cHV0Pzogc3RyaW5nO1xufVxuXG50eXBlIENvbmZpZ3R4bGF0b3JBcmdWYWx1ZSA9IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfCBzdHJpbmdbXTtcblxuZXhwb3J0IGNsYXNzIENvbmZpZ3R4bGF0b3JDb21tYW5kQnVpbGRlciB7XG4gIHByaXZhdGUgcmVhZG9ubHkgbG9nOiBMb2dnZXI7XG4gIHByaXZhdGUgcmVhZG9ubHkgYmluTmFtZTogRmFicmljQmluYXJpZXMgPSBGYWJyaWNCaW5hcmllcy5DT05GSUdUWExBVE9SO1xuICBwcml2YXRlIGNvbW1hbmQ6IENvbmZpZ3R4bGF0b3JDb21tYW5kID0gQ29uZmlndHhsYXRvckNvbW1hbmQuSEVMUDtcbiAgcHJpdmF0ZSByZWFkb25seSBhcmdzOiBNYXA8XG4gICAgQ29uZmlndHhsYXRvckNvbW1hbmQsXG4gICAgTWFwPHN0cmluZywgQ29uZmlndHhsYXRvckFyZ1ZhbHVlPlxuICA+ID0gbmV3IE1hcCgpO1xuXG4gIGNvbnN0cnVjdG9yKGxvZ2dlcj86IExvZ2dlcikge1xuICAgIHRoaXMubG9nID0gbG9nZ2VyXG4gICAgICA/IGxvZ2dlci5mb3IoQ29uZmlndHhsYXRvckNvbW1hbmRCdWlsZGVyLm5hbWUpXG4gICAgICA6IExvZ2dpbmcuZm9yKENvbmZpZ3R4bGF0b3JDb21tYW5kQnVpbGRlcik7XG4gIH1cblxuICBzZXRDb21tYW5kKGNvbW1hbmQ6IENvbmZpZ3R4bGF0b3JDb21tYW5kKTogdGhpcyB7XG4gICAgdGhpcy5sb2cuZGVidWcoYFNldHRpbmcgY29tbWFuZDogJHtjb21tYW5kfWApO1xuICAgIHRoaXMuY29tbWFuZCA9IGNvbW1hbmQ7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXRTdGFydE9wdGlvbnMob3B0aW9ucz86IENvbmZpZ3R4bGF0b3JTdGFydE9wdGlvbnMpOiB0aGlzIHtcbiAgICBpZiAoIW9wdGlvbnMpIHJldHVybiB0aGlzO1xuICAgIHRoaXMuYXNzZXJ0Q29tbWFuZChDb25maWd0eGxhdG9yQ29tbWFuZC5TVEFSVCk7XG5cbiAgICBjb25zdCB7IGFkZHJlc3MsIHBvcnQsIHRscywgY2FmaWxlLCBjZXJ0ZmlsZSwga2V5ZmlsZSB9ID0gb3B0aW9ucztcbiAgICB0aGlzLnNldENvbW1hbmRBcmcoQ29uZmlndHhsYXRvckNvbW1hbmQuU1RBUlQsIFwiYWRkcmVzc1wiLCBhZGRyZXNzKTtcbiAgICB0aGlzLnNldENvbW1hbmRBcmcoQ29uZmlndHhsYXRvckNvbW1hbmQuU1RBUlQsIFwicG9ydFwiLCBwb3J0KTtcbiAgICB0aGlzLnNldENvbW1hbmRBcmcoQ29uZmlndHhsYXRvckNvbW1hbmQuU1RBUlQsIFwidGxzXCIsIHRscyk7XG4gICAgdGhpcy5zZXRDb21tYW5kQXJnKENvbmZpZ3R4bGF0b3JDb21tYW5kLlNUQVJULCBcImNhZmlsZVwiLCBjYWZpbGUpO1xuICAgIHRoaXMuc2V0Q29tbWFuZEFyZyhDb25maWd0eGxhdG9yQ29tbWFuZC5TVEFSVCwgXCJjZXJ0ZmlsZVwiLCBjZXJ0ZmlsZSk7XG4gICAgdGhpcy5zZXRDb21tYW5kQXJnKENvbmZpZ3R4bGF0b3JDb21tYW5kLlNUQVJULCBcImtleWZpbGVcIiwga2V5ZmlsZSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNldFByb3RvT3B0aW9ucyhvcHRpb25zPzogQ29uZmlndHhsYXRvclByb3RvT3B0aW9ucyk6IHRoaXMge1xuICAgIGlmICghb3B0aW9ucykgcmV0dXJuIHRoaXM7XG4gICAgdGhpcy5hc3NlcnRDb21tYW5kKFxuICAgICAgQ29uZmlndHhsYXRvckNvbW1hbmQuUFJPVE9fRU5DT0RFLFxuICAgICAgQ29uZmlndHhsYXRvckNvbW1hbmQuUFJPVE9fREVDT0RFXG4gICAgKTtcblxuICAgIGNvbnN0IHRhcmdldENvbW1hbmQgPSB0aGlzLmNvbW1hbmQ7XG4gICAgY29uc3QgeyBpbnB1dCwgb3V0cHV0LCB0eXBlIH0gPSBvcHRpb25zO1xuXG4gICAgdGhpcy5zZXRDb21tYW5kQXJnKHRhcmdldENvbW1hbmQsIFwiaW5wdXRcIiwgaW5wdXQpO1xuICAgIHRoaXMuc2V0Q29tbWFuZEFyZyh0YXJnZXRDb21tYW5kLCBcIm91dHB1dFwiLCBvdXRwdXQpO1xuICAgIGlmICh0eXBlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuc2V0Q29tbWFuZEFyZyh0YXJnZXRDb21tYW5kLCBcInR5cGVcIiwgU3RyaW5nKHR5cGUpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNldFByb3RvQ29tcGFyZU9wdGlvbnMob3B0aW9ucz86IENvbmZpZ3R4bGF0b3JQcm90b0NvbXBhcmVPcHRpb25zKTogdGhpcyB7XG4gICAgaWYgKCFvcHRpb25zKSByZXR1cm4gdGhpcztcbiAgICB0aGlzLmFzc2VydENvbW1hbmQoQ29uZmlndHhsYXRvckNvbW1hbmQuUFJPVE9fQ09NUEFSRSk7XG5cbiAgICBjb25zdCB7IG9yaWdpbmFsLCB1cGRhdGVkLCBvdXRwdXQgfSA9IG9wdGlvbnM7XG4gICAgdGhpcy5zZXRDb21tYW5kQXJnKENvbmZpZ3R4bGF0b3JDb21tYW5kLlBST1RPX0NPTVBBUkUsIFwib3JpZ2luYWxcIiwgb3JpZ2luYWwpO1xuICAgIHRoaXMuc2V0Q29tbWFuZEFyZyhDb25maWd0eGxhdG9yQ29tbWFuZC5QUk9UT19DT01QQVJFLCBcInVwZGF0ZWRcIiwgdXBkYXRlZCk7XG4gICAgdGhpcy5zZXRDb21tYW5kQXJnKENvbmZpZ3R4bGF0b3JDb21tYW5kLlBST1RPX0NPTVBBUkUsIFwib3V0cHV0XCIsIG91dHB1dCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNldENvbXB1dGVVcGRhdGVPcHRpb25zKG9wdGlvbnM/OiBDb25maWd0eGxhdG9yQ29tcHV0ZVVwZGF0ZU9wdGlvbnMpOiB0aGlzIHtcbiAgICBpZiAoIW9wdGlvbnMpIHJldHVybiB0aGlzO1xuICAgIHRoaXMuYXNzZXJ0Q29tbWFuZChDb25maWd0eGxhdG9yQ29tbWFuZC5DT01QVVRFX1VQREFURSk7XG5cbiAgICBjb25zdCB7IGNoYW5uZWxJZCwgb3JpZ2luYWwsIHVwZGF0ZWQsIG91dHB1dCB9ID0gb3B0aW9ucztcbiAgICB0aGlzLnNldENvbW1hbmRBcmcoXG4gICAgICBDb25maWd0eGxhdG9yQ29tbWFuZC5DT01QVVRFX1VQREFURSxcbiAgICAgIFwiY2hhbm5lbF9pZFwiLFxuICAgICAgY2hhbm5lbElkXG4gICAgKTtcbiAgICB0aGlzLnNldENvbW1hbmRBcmcoQ29uZmlndHhsYXRvckNvbW1hbmQuQ09NUFVURV9VUERBVEUsIFwib3JpZ2luYWxcIiwgb3JpZ2luYWwpO1xuICAgIHRoaXMuc2V0Q29tbWFuZEFyZyhDb25maWd0eGxhdG9yQ29tbWFuZC5DT01QVVRFX1VQREFURSwgXCJ1cGRhdGVkXCIsIHVwZGF0ZWQpO1xuICAgIHRoaXMuc2V0Q29tbWFuZEFyZyhDb25maWd0eGxhdG9yQ29tbWFuZC5DT01QVVRFX1VQREFURSwgXCJvdXRwdXRcIiwgb3V0cHV0KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgYnVpbGQoKTogc3RyaW5nIHtcbiAgICBjb25zdCBjb21tYW5kTGluZSA9IFt0aGlzLmdldEJpbmFyeSgpLCAuLi50aGlzLmdldEFyZ3MoKV0uam9pbihcIiBcIik7XG4gICAgdGhpcy5sb2cuZGVidWcoYEJ1aWx0IGNvbW1hbmQ6ICR7Y29tbWFuZExpbmV9YCk7XG4gICAgcmV0dXJuIGNvbW1hbmRMaW5lO1xuICB9XG5cbiAgZ2V0QmluYXJ5KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuYmluTmFtZTtcbiAgfVxuXG4gIGdldEFyZ3MoKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IGFyZ3NNYXAgPVxuICAgICAgdGhpcy5hcmdzLmdldCh0aGlzLmNvbW1hbmQpID8/XG4gICAgICBuZXcgTWFwPHN0cmluZywgQ29uZmlndHhsYXRvckFyZ1ZhbHVlPigpO1xuICAgIHJldHVybiBbdGhpcy5jb21tYW5kLCAuLi5tYXBQYXJzZXIoYXJnc01hcCldO1xuICB9XG5cbiAgYXN5bmMgZXhlY3V0ZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgcnVuQ29tbWFuZCh0aGlzLmdldEJpbmFyeSgpLCB0aGlzLmdldEFyZ3MoKSk7XG4gICAgfSBjYXRjaCAoZXJyb3I6IHVua25vd24pIHtcbiAgICAgIHRoaXMubG9nLmVycm9yKGBFcnJvcjogRmFpbGVkIHRvIGV4ZWN1dGUgdGhlIGNvbW1hbmQ6ICR7ZXJyb3J9YCk7XG4gICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXRDb21tYW5kQXJnKFxuICAgIGNvbW1hbmQ6IENvbmZpZ3R4bGF0b3JDb21tYW5kLFxuICAgIGtleTogc3RyaW5nLFxuICAgIHZhbHVlPzogQ29uZmlndHhsYXRvckFyZ1ZhbHVlXG4gICk6IHZvaWQge1xuICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG4gICAgY29uc3QgYXJnc01hcCA9IHRoaXMuYXJncy5nZXQoY29tbWFuZCkgPz8gbmV3IE1hcDxzdHJpbmcsIENvbmZpZ3R4bGF0b3JBcmdWYWx1ZT4oKTtcbiAgICBhcmdzTWFwLnNldChrZXksIHZhbHVlKTtcbiAgICB0aGlzLmFyZ3Muc2V0KGNvbW1hbmQsIGFyZ3NNYXApO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3NlcnRDb21tYW5kKFxuICAgIC4uLmFsbG93ZWQ6IENvbmZpZ3R4bGF0b3JDb21tYW5kW11cbiAgKTogYXNzZXJ0cyB0aGlzIGlzIHRoaXMge1xuICAgIGlmICghYWxsb3dlZC5pbmNsdWRlcyh0aGlzLmNvbW1hbmQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBJbnZhbGlkIGNvbW1hbmQgXCIke3RoaXMuY29tbWFuZH1cIiBmb3IgdGhlIHJlcXVlc3RlZCBvcGVyYXRpb24uIEFsbG93ZWQ6ICR7YWxsb3dlZC5qb2luKFxuICAgICAgICAgIFwiLCBcIlxuICAgICAgICApfWBcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuLyoqXG4gKiBAZGVzY3JpcHRpb24gRmFicmljIENBIFNlcnZlciBjb21tYW5kIG9wdGlvbnMuXG4gKiBAc3VtbWFyeSBFbnVtZXJhdGlvbiBvZiBhdmFpbGFibGUgY29tbWFuZHMgZm9yIHRoZSBGYWJyaWMgQ0EgU2VydmVyLlxuICogQGVudW0ge3N0cmluZ31cbiAqIEByZWFkb25seVxuICogQG1lbWJlck9mIG1vZHVsZTpmYWJyaWMtY2Etc2VydmVyXG4gKi9cbmV4cG9ydCBlbnVtIEZhYnJpY0NBU2VydmVyQ29tbWFuZCB7XG4gIC8qKiBHZW5lcmF0ZSBiYXNoIGNvbXBsZXRpb24gc2NyaXB0ICovXG4gIENPTVBMRVRJT04gPSBcImNvbXBsZXRpb25cIixcbiAgLyoqIFNob3cgaGVscCAqL1xuICBIRUxQID0gXCJoZWxwXCIsXG4gIC8qKiBJbml0aWFsaXplIHRoZSBGYWJyaWMgQ0Egc2VydmVyICovXG4gIElOSVQgPSBcImluaXRcIixcbiAgLyoqIFN0YXJ0IHRoZSBGYWJyaWMgQ0Egc2VydmVyICovXG4gIFNUQVJUID0gXCJzdGFydFwiLFxuICAvKiogU2hvdyB2ZXJzaW9uIGluZm9ybWF0aW9uICovXG4gIFZFUlNJT04gPSBcInZlcnNpb25cIixcbn1cblxuZXhwb3J0IGVudW0gQ2xpZW50QXV0aFR5cGUge1xuICBOb0NsaWVudENlcnQgPSBcIm5vY2xpZW50Y2VydFwiLFxuICBSZXF1ZXN0Q2xpZW50Q2VydCA9IFwicmVxdWVzdGNsaWVudGNlcnRcIixcbiAgUmVxdWlyZUFueUNsaWVudENlcnQgPSBcInJlcXVpcmVhbnljbGllbnRjZXJ0XCIsXG4gIFZlcmlmeUNsaWVudENlcnRJZkdpdmVuID0gXCJ2ZXJpZnljbGllbnRjZXJ0aWZnaXZlblwiLFxuICBSZXF1aXJlQW5kVmVyaWZ5Q2xpZW50Q2VydCA9IFwicmVxdWlyZWFuZHZlcmlmeWNsaWVudGNlcnRcIixcbn1cblxuLyoqXG4gKiBAZGVzY3JpcHRpb24gRmFicmljIENBIFNlcnZlciBkYXRhYmFzZSB0eXBlcy5cbiAqIEBzdW1tYXJ5IEVudW1lcmF0aW9uIG9mIHN1cHBvcnRlZCBkYXRhYmFzZSB0eXBlcyBmb3IgdGhlIEZhYnJpYyBDQSBTZXJ2ZXIuXG4gKiBAZW51bSB7c3RyaW5nfVxuICogQHJlYWRvbmx5XG4gKiBAbWVtYmVyT2YgbW9kdWxlOmZhYnJpYy1jYS1zZXJ2ZXJcbiAqL1xuZXhwb3J0IGVudW0gRmFicmljQ0FTZXJ2ZXJEQlR5cGVzIHtcbiAgLyoqIFNRTGl0ZTMgZGF0YWJhc2UgKi9cbiAgU1FMSVRFMyA9IFwic3FsaXRlM1wiLFxuICAvKiogUG9zdGdyZVNRTCBkYXRhYmFzZSAqL1xuICBQT1NUR1JFUyA9IFwicG9zdGdyZXNcIixcbiAgLyoqIE15U1FMIGRhdGFiYXNlICovXG4gIE1ZU1FMID0gXCJteXNxbFwiLFxufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiBGYWJyaWMgQ0EgU2VydmVyIGVsbGlwdGljIGN1cnZlIG5hbWVzLlxuICogQHN1bW1hcnkgRW51bWVyYXRpb24gb2Ygc3VwcG9ydGVkIGVsbGlwdGljIGN1cnZlcyBmb3IgY3J5cHRvZ3JhcGhpYyBvcGVyYXRpb25zIGluIHRoZSBGYWJyaWMgQ0EgU2VydmVyLlxuICogQGVudW0ge3N0cmluZ31cbiAqIEByZWFkb25seVxuICogQG1lbWJlck9mIG1vZHVsZTpmYWJyaWMtY2Etc2VydmVyXG4gKi9cbmV4cG9ydCBlbnVtIEZhYnJpY0NBU2VydmVyQ3VydmVOYW1lIHtcbiAgLyoqIEFNQ0wgRnAyNTZibiBjdXJ2ZSAqL1xuICBGUDI1NkJOID0gXCJhbWNsLkZwMjU2Ym5cIixcbiAgLyoqIEd1cnZ5IEJuMjU0IGN1cnZlICovXG4gIEJOMjU0ID0gXCJndXJ2eS5CbjI1NFwiLFxuICAvKiogQU1DTCBGcDI1Nk1pcmFjbGJuIGN1cnZlICovXG4gIEZQMjU2TUlSQUNMQk4gPSBcImFtY2wuRnAyNTZNaXJhY2xiblwiLFxufVxuXG4vKipcbiAqIEBkZXNjcmlwdGlvbiBGYWJyaWMgQ0EgU2VydmVyIGVucm9sbG1lbnQgdHlwZXMuXG4gKiBAc3VtbWFyeSBFbnVtZXJhdGlvbiBvZiBzdXBwb3J0ZWQgZW5yb2xsbWVudCB0eXBlcyBmb3IgdGhlIEZhYnJpYyBDQSBTZXJ2ZXIuXG4gKiBAZW51bSB7c3RyaW5nfVxuICogQHJlYWRvbmx5XG4gKiBAbWVtYmVyT2YgbW9kdWxlOmZhYnJpYy1jYS1zZXJ2ZXJcbiAqL1xuZXhwb3J0IGVudW0gRmFicmljQ0FTZXJ2ZXJFbnJvbGxtZW50VHlwZSB7XG4gIC8qKiBYLjUwOSBjZXJ0aWZpY2F0ZS1iYXNlZCBlbnJvbGxtZW50ICovXG4gIFg1MDkgPSBcIng1MDlcIixcbiAgLyoqIElkZW50aXR5IE1peGVyIChJZGVtaXgpIGNyZWRlbnRpYWwtYmFzZWQgZW5yb2xsbWVudCAqL1xuICBJREVNSVggPSBcImlkZW1peFwiLFxufVxuXG5leHBvcnQgY29uc3QgREVGQVVMVF9DQV9DRVJUX1BBVEggPSBwYXRoLmpvaW4oXG4gIF9fZGlybmFtZSxcbiAgXCIuLi8uLi8uLi9zZXJ2ZXIvY2EtY2VydC5wZW1cIlxuKTtcbiIsIi8qKlxuICogQGVudW0ge3N0cmluZ31cbiAqIEBkZXNjcmlwdGlvbiBFbnVtZXJhdGlvbiBvZiBhdmFpbGFibGUgRmFicmljIENBIENsaWVudCBjb21tYW5kcy5cbiAqIEBzdW1tYXJ5IFRoaXMgZW51bSByZXByZXNlbnRzIGFsbCB0aGUgcG9zc2libGUgY29tbWFuZHMgdGhhdCBjYW4gYmUgZXhlY3V0ZWQgdXNpbmcgdGhlIEZhYnJpYyBDQSBDbGllbnQuXG4gKi9cbmV4cG9ydCBlbnVtIEZhYnJpY0NBQ2xpZW50Q29tbWFuZCB7XG4gIC8qKiBNYW5hZ2UgYWZmaWxpYXRpb25zICovXG4gIEFGRklMSUFUSU9OID0gXCJhZmZpbGlhdGlvblwiLFxuXG4gIC8qKiBNYW5hZ2UgY2VydGlmaWNhdGVzICovXG4gIENFUlRJRklDQVRFID0gXCJjZXJ0aWZpY2F0ZVwiLFxuXG4gIC8qKiBHZW5lcmF0ZSB0aGUgYXV0b2NvbXBsZXRpb24gc2NyaXB0IGZvciB0aGUgc3BlY2lmaWVkIHNoZWxsICovXG4gIENPTVBMRVRJT04gPSBcImNvbXBsZXRpb25cIixcblxuICAvKiogRW5yb2xsIGFuIGlkZW50aXR5ICovXG4gIEVOUk9MTCA9IFwiZW5yb2xsXCIsXG5cbiAgLyoqIEdlbmVyYXRlIGEgQ1JMIChDZXJ0aWZpY2F0ZSBSZXZvY2F0aW9uIExpc3QpICovXG4gIEdFTkNSTCA9IFwiZ2VuY3JsXCIsXG5cbiAgLyoqIEdlbmVyYXRlIGEgQ1NSIChDZXJ0aWZpY2F0ZSBTaWduaW5nIFJlcXVlc3QpICovXG4gIEdFTkNTUiA9IFwiZ2VuY3NyXCIsXG5cbiAgLyoqIEdldCBDQSBjZXJ0aWZpY2F0ZSBjaGFpbiBhbmQgSWRlbWl4IHB1YmxpYyBrZXkgKi9cbiAgR0VUQ0FJTkZPID0gXCJnZXRjYWluZm9cIixcblxuICAvKiogSGVscCBhYm91dCBhbnkgY29tbWFuZCAqL1xuICBIRUxQID0gXCJoZWxwXCIsXG5cbiAgLyoqIE1hbmFnZSBpZGVudGl0aWVzICovXG4gIElERU5USVRZID0gXCJpZGVudGl0eVwiLFxuXG4gIC8qKiBSZWVucm9sbCBhbiBpZGVudGl0eSAqL1xuICBSRUVOUk9MTCA9IFwicmVlbnJvbGxcIixcblxuICAvKiogUmVnaXN0ZXIgYW4gaWRlbnRpdHkgKi9cbiAgUkVHSVNURVIgPSBcInJlZ2lzdGVyXCIsXG5cbiAgLyoqIFJldm9rZSBhbiBpZGVudGl0eSAqL1xuICBSRVZPS0UgPSBcInJldm9rZVwiLFxuXG4gIC8qKiBQcmludHMgRmFicmljIENBIENsaWVudCB2ZXJzaW9uICovXG4gIFZFUlNJT04gPSBcInZlcnNpb25cIixcbn1cbiIsIi8qKlxuICogQGRlc2NyaXB0aW9uIEZhYnJpYyBhY2NvdW50IHR5cGVzLlxuICogQHN1bW1hcnkgRW51bWVyYXRpb24gb2Ygc3VwcG9ydGVkIGFjY291bnQgdHlwZXMgaW4gSHlwZXJsZWRnZXIgRmFicmljLlxuICogQGVudW0ge3N0cmluZ31cbiAqIEByZWFkb25seVxuICogQG1lbWJlck9mIG1vZHVsZTpmYWJyaWMtZ2VuZXJhbFxuICovXG5leHBvcnQgZW51bSBGYWJyaWNBY2NvdW50VHlwZSB7XG4gIC8qKiBDbGllbnQgYWNjb3VudCB0eXBlICovXG4gIENMSUVOVCA9IFwiY2xpZW50XCIsXG4gIC8qKiBQZWVyIGFjY291bnQgdHlwZSAqL1xuICBQRUVSID0gXCJwZWVyXCIsXG4gIC8qKiBPcmRlcmVyIGFjY291bnQgdHlwZSAqL1xuICBPUkRFUkVSID0gXCJvcmRlcmVyXCIsXG4gIC8qKiBBZG1pbiBhY2NvdW50IHR5cGUgKi9cbiAgQURNSU4gPSBcImFkbWluXCIsXG4gIC8qKiBVc2VyIGFjY291bnQgdHlwZSAqL1xuICBVU0VSID0gXCJ1c2VyXCIsXG59XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uIExvZyBsZXZlbHMgZm9yIEZhYnJpYyBjb21wb25lbnRzLlxuICogQHN1bW1hcnkgRW51bWVyYXRpb24gb2YgYXZhaWxhYmxlIGxvZyBsZXZlbHMgZm9yIEh5cGVybGVkZ2VyIEZhYnJpYyBjb21wb25lbnRzLlxuICogVGhlc2UgbGV2ZWxzIGRldGVybWluZSB0aGUgdmVyYm9zaXR5IGFuZCB0eXBlIG9mIGluZm9ybWF0aW9uIGxvZ2dlZCBieSB0aGUgc3lzdGVtLlxuICogQGVudW0ge3N0cmluZ31cbiAqIEByZWFkb25seVxuICovXG5leHBvcnQgZW51bSBGYWJyaWNMb2dMZXZlbCB7XG4gIC8qKiBTdGFuZGFyZCBpbmZvcm1hdGlvbiBtZXNzYWdlcyAqL1xuICBJTkZPID0gXCJpbmZvXCIsXG4gIC8qKiBXYXJuaW5nIG1lc3NhZ2VzIGZvciBwb3RlbnRpYWwgaXNzdWVzICovXG4gIFdBUk5JTkcgPSBcIndhcm5pbmdcIixcbiAgLyoqIERldGFpbGVkIGRlYnVnZ2luZyBpbmZvcm1hdGlvbiAqL1xuICBERUJVRyA9IFwiZGVidWdcIixcbiAgLyoqIEVycm9yIG1lc3NhZ2VzIGZvciBpc3N1ZXMgdGhhdCBkb24ndCBzdG9wIGV4ZWN1dGlvbiAqL1xuICBFUlJPUiA9IFwiZXJyb3JcIixcbiAgLyoqIEZhdGFsIGVycm9yIG1lc3NhZ2VzIHRoYXQgbWF5IHN0b3AgZXhlY3V0aW9uICovXG4gIEZBVEFMID0gXCJmYXRhbFwiLFxuICAvKiogQ3JpdGljYWwgZXJyb3IgbWVzc2FnZXMgdGhhdCByZXF1aXJlIGltbWVkaWF0ZSBhdHRlbnRpb24gKi9cbiAgQ1JJVElDQUwgPSBcImNyaXRpY2FsXCIsXG59XG4iLCJleHBvcnQgZW51bSBPcmRlcmVyQ29tbWFuZCB7XG4gIC8qKiBTdGFydCB0aGUgT3JkZXJlciAqL1xuICBTVEFSVCA9IFwic3RhcnRcIixcbn1cblxuZXhwb3J0IGNvbnN0IE9TTl9BRE1JTl9CQVNFX0NPTU1BTkQgPSBcImNoYW5uZWxcIjtcblxuZXhwb3J0IGVudW0gT1NOX0FETUlOX1NVQkNPTU1BTkRTIHtcbiAgLyoqIEpvaW4gYSBjaGFubmVsICovXG4gIEpPSU4gPSBcImpvaW5cIixcblxuICAvKiogTGlzdCBjaGFubmVscyAqL1xuICBMSVNUID0gXCJsaXN0XCIsXG5cbiAgLyoqIFJlbW92ZSBhIGNoYW5uZWwgKi9cbiAgUkVNT1ZFID0gXCJyZW1vdmVcIixcbn1cbiIsImV4cG9ydCBlbnVtIFBlZXJDb21tYW5kcyB7XG4gIENIQUlOQ09ERSA9IFwiY2hhaW5jb2RlXCIsXG4gIENIQU5ORUwgPSBcImNoYW5uZWxcIixcbiAgTk9ERSA9IFwibm9kZVwiLFxuICAvLyAgIFZFUlNJT04gPSBcInZlcnNpb25cIixcbiAgTElGRUNZQ0xFX0NIQUlOQ09ERSA9IFwibGlmZWN5Y2xlIGNoYWluY29kZVwiLFxufVxuXG5leHBvcnQgZW51bSBQZWVyTm9kZUNvbW1hbmRzIHtcbiAgUEFVU0UgPSBcInBhdXNlXCIsXG4gIFJFQlVJTERfREJTID0gXCJyZWJ1aWxkLWRic1wiLFxuICBSRVNFVCA9IFwicmVzZXRcIixcbiAgUkVTVU1FID0gXCJyZXN1bWVcIixcbiAgUk9MTEJBQ0sgPSBcInJvbGxiYWNrXCIsXG4gIFNUQVJUID0gXCJzdGFydFwiLFxuICBVTkpPSU4gPSBcInVuam9pblwiLFxuICBVUEdSQURFX0RCUyA9IFwidXBncmFkZS1kYnNcIixcbn1cblxuZXhwb3J0IGVudW0gUGVlckNoYW5uZWxDb21tYW5kcyB7XG4gIENSRUFURSA9IFwiY3JlYXRlXCIsXG4gIEZFVENIID0gXCJmZXRjaFwiLFxuICBHRVRJTkZPID0gXCJnZXRpbmZvXCIsXG4gIEpPSU4gPSBcImpvaW5cIixcbiAgSk9JTkJZU05BUFNIT1QgPSBcImpvaW5ieXNuYXBzaG90XCIsXG4gIEpPSU5CWVNOQVBTSE9UU1RBVFVTID0gXCJqb2luYnlzbmFwc2hvdHN0YXR1c1wiLFxuICBMSVNUID0gXCJsaXN0XCIsXG4gIFNJR05DT05GSUdUWCA9IFwic2lnbmNvbmZpZ3R4XCIsXG4gIFVQREFURSA9IFwidXBkYXRlXCIsXG59XG5cbmV4cG9ydCBlbnVtIFBlZXJDaGFpbmNvZGVDb21tYW5kcyB7XG4gIElOU1RBTEwgPSBcImluc3RhbGxcIixcbiAgSU5TVEFOVElBVEUgPSBcImluc3RhbnRpYXRlXCIsXG4gIElOVk9LRSA9IFwiaW52b2tlXCIsXG4gIExJU1QgPSBcImxpc3RcIixcbiAgUEFDS0FHRSA9IFwicGFja2FnZVwiLFxuICBRVUVSWSA9IFwicXVlcnlcIixcbiAgU0lHTlBBQ0tBR0UgPSBcInNpZ25wYWNrYWdlXCIsXG4gIFVQR1JBREUgPSBcInVwZ3JhZGVcIixcbn1cblxuZXhwb3J0IGVudW0gUGVlckxpZmVjeWNsZUNoYWluY29kZUNvbW1hbmRzIHtcbiAgUEFDS0FHRSA9IFwicGFja2FnZVwiLFxuICBJTlNUQUxMID0gXCJpbnN0YWxsXCIsXG4gIFFVRVJZSU5TVEFMTEVEID0gXCJxdWVyeWluc3RhbGxlZFwiLFxuICBHRVRJTlNUQUxMRURQQUNLQUdFID0gXCJnZXRpbnN0YWxsZWRwYWNrYWdlXCIsXG4gIENBTENVTEFURVBBQ0tBR0VJRCA9IFwiY2FsY3VsYXRlcGFja2FnZWlkXCIsXG4gIEFQUFJPVkVGT1JNWU9SRyA9IFwiYXBwcm92ZWZvcm15b3JnXCIsXG4gIFFVRVJZQVBQUk9WRUQgPSBcInF1ZXJ5YXBwcm92ZWRcIixcbiAgQ0hFQ0tDT01NSVRSRUFESU5FU1MgPSBcImNoZWNrY29tbWl0cmVhZGluZXNzXCIsXG4gIENPTU1JVCA9IFwiY29tbWl0XCIsXG4gIFFVRVJZQ09NTUlUVEVEID0gXCJxdWVyeWNvbW1pdHRlZFwiLFxufVxuIiwiLyoqXG4gKiBAbW9kdWxlIGZhYnJpYy13ZWF2ZXJcbiAqIEBkZXNjcmlwdGlvbiBUaGlzIG1vZHVsZSBzZXJ2ZXMgYXMgdGhlIG1haW4gZW50cnkgcG9pbnQgZm9yIHRoZSBmYWJyaWMtd2VhdmVyIGxpYnJhcnksIHByb3ZpZGluZyBUeXBlU2NyaXB0IGludGVncmF0aW9uIHdpdGggSHlwZXJsZWRnZXIgRmFicmljLlxuICogQHN1bW1hcnkgQWdncmVnYXRlcyBhbmQgZXhwb3J0cyBmdW5jdGlvbmFsaXR5IGZvciBtYW5hZ2luZyBIeXBlcmxlZGdlciBGYWJyaWMgaW5mcmFzdHJ1Y3R1cmVzLlxuICpcbiAqIFRoZSBtb2R1bGUgaW5jbHVkZXM6XG4gKiAxLiBVdGlsaXR5IGZ1bmN0aW9ucyBhbmQgdHlwZXMgZnJvbSB0aGUgXCIuL3V0aWxzXCIgZGlyZWN0b3J5OlxuICogICAgLSBIZWxwZXIgZnVuY3Rpb25zIGZvciBpbnRlcmFjdGluZyB3aXRoIEZhYnJpYyBiaW5hcmllcy5cbiAqICAgIC0gVXRpbGl0aWVzIGZvciBnZW5lcmF0aW5nIGFuZCBtYW5hZ2luZyBEb2NrZXIgQ29tcG9zZSBmaWxlcy5cbiAqICAgIC0gRnVuY3Rpb25zIHRvIGFzc2lzdCBpbiBjcmVhdGluZywgbWFpbnRhaW5pbmcsIGFuZCB1cGRhdGluZyBIeXBlcmxlZGdlciBGYWJyaWMgbmV0d29ya3MuXG4gKlxuICogMi4gQ29yZSBmdW5jdGlvbmFsaXR5IGZyb20gdGhlIFwiLi9jb3JlXCIgZGlyZWN0b3J5OlxuICogICAgLSBUeXBlU2NyaXB0IGludGVyZmFjZXMgYW5kIGNsYXNzZXMgcmVwcmVzZW50aW5nIEZhYnJpYyBjb25jZXB0cy5cbiAqICAgIC0gSW1wbGVtZW50YXRpb24gb2YgRmFicmljIG9wZXJhdGlvbnMgYW5kIGludGVyYWN0aW9ucy5cbiAqXG4gKiAzLiBBIFZFUlNJT04gY29uc3RhbnQ6XG4gKiAgICAtIFJlcHJlc2VudHMgdGhlIGN1cnJlbnQgdmVyc2lvbiBvZiB0aGUgZmFicmljLXdlYXZlciBtb2R1bGUuXG4gKiAgICAtIFVzZWZ1bCBmb3IgdmVyc2lvbiBjaGVja2luZyBhbmQgY29tcGF0aWJpbGl0eSBwdXJwb3Nlcy5cbiAqXG4gKiBUaGlzIHN0cnVjdHVyZSBwcm92aWRlcyBhIGNvbXByZWhlbnNpdmUgdG9vbGtpdCBmb3Igd29ya2luZyB3aXRoIEh5cGVybGVkZ2VyIEZhYnJpYyBpbiBUeXBlU2NyaXB0LFxuICogYWxsb3dpbmcgZGV2ZWxvcGVycyB0byBlYXNpbHkgc2V0IHVwLCBtYW5hZ2UsIGFuZCBpbnRlcmFjdCB3aXRoIEZhYnJpYyBuZXR3b3JrcyBhbmQgY29tcG9uZW50cy5cbiAqL1xuXG5leHBvcnQgKiBmcm9tIFwiLi91dGlscy1vbGRcIjtcbmV4cG9ydCAqIGZyb20gXCIuL3V0aWxzXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9mYWJyaWNcIjtcblxuLyoqXG4gKiBAY29uc3QgVkVSU0lPTlxuICogQG5hbWUgVkVSU0lPTlxuICogQGRlc2NyaXB0aW9uIFJlcHJlc2VudHMgdGhlIGN1cnJlbnQgdmVyc2lvbiBvZiB0aGUgZmFicmljLXdlYXZlciBtb2R1bGUuXG4gKiBAc3VtbWFyeSBUaGUgYWN0dWFsIHZlcnNpb24gbnVtYmVyIGlzIHJlcGxhY2VkIGR1cmluZyB0aGUgYnVpbGQgcHJvY2Vzcy5cbiAqIEB0eXBlIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBjb25zdCBWRVJTSU9OID0gXCIjI1ZFUlNJT04jI1wiO1xuIiwiLyoqXG4gKiBAbW9kdWxlIGZhYnJpYy1jbGlcbiAqIEBkZXNjcmlwdGlvbiBDb21tYW5kLWxpbmUgaW50ZXJmYWNlIGZvciBGYWJyaWMgc2V0dXAgYW5kIHVwZGF0ZSBvcGVyYXRpb25zXG4gKiBAc3VtbWFyeSBUaGlzIG1vZHVsZSBwcm92aWRlcyBhIENMSSBmb3IgbWFuYWdpbmcgSHlwZXJsZWRnZXIgRmFicmljIGluc3RhbGxhdGlvbnMuXG4gKiBJdCBleHBvc2VzIGNvbW1hbmRzIGZvciB1cGRhdGluZyB0aGUgRmFicmljIGluc3RhbGwgc2NyaXB0IGFuZCBzZXR0aW5nIHVwIEZhYnJpY1xuICogY29tcG9uZW50cy4gVGhlIG1vZHVsZSB1c2VzIHRoZSBDb21tYW5kZXIuanMgbGlicmFyeSB0byBwYXJzZSBjb21tYW5kLWxpbmVcbiAqIGFyZ3VtZW50cyBhbmQgZXhlY3V0ZSB0aGUgYXBwcm9wcmlhdGUgYWN0aW9ucy5cbiAqXG4gKiBLZXkgZXhwb3J0czpcbiAqIC0ge0BsaW5rIHVwZGF0ZUZhYnJpY306IEZ1bmN0aW9uIHRvIHVwZGF0ZSB0aGUgRmFicmljIGluc3RhbGwgc2NyaXB0XG4gKiAtIHtAbGluayBzZXR1cEZhYnJpY306IEZ1bmN0aW9uIHRvIHNldCB1cCBGYWJyaWMgY29tcG9uZW50c1xuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBVcGRhdGUgRmFicmljIGluc3RhbGwgc2NyaXB0XG4gKiBub2RlIGZhYnJpYy5qcyB1cGRhdGVcbiAqXG4gKiAvLyBTZXR1cCBGYWJyaWMgY29tcG9uZW50c1xuICogbm9kZSBmYWJyaWMuanMgc2V0dXAgLS1mYWJyaWMtdmVyc2lvbiAyLjUuMTIgLS1jYS12ZXJzaW9uIDEuNS4xNSAtLWNvbXBvbmVudHMgYmluYXJ5IGRvY2tlclxuICpcbiAqIEBtZXJtYWlkXG4gKiBzZXF1ZW5jZURpYWdyYW1cbiAqICAgcGFydGljaXBhbnQgVXNlclxuICogICBwYXJ0aWNpcGFudCBDTElcbiAqICAgcGFydGljaXBhbnQgVXBkYXRlRmFicmljXG4gKiAgIHBhcnRpY2lwYW50IFNldHVwRmFicmljXG4gKiAgIFVzZXItPj5DTEk6IFJ1biBjb21tYW5kXG4gKiAgIENMSS0+PkNMSTogUGFyc2UgYXJndW1lbnRzXG4gKiAgIGFsdCB1cGRhdGUgY29tbWFuZFxuICogICAgIENMSS0+PlVwZGF0ZUZhYnJpYzogQ2FsbCB1cGRhdGVGYWJyaWMoKVxuICogICAgIFVwZGF0ZUZhYnJpYy0+PlVwZGF0ZUZhYnJpYzogRG93bmxvYWQgaW5zdGFsbCBzY3JpcHRcbiAqICAgICBVcGRhdGVGYWJyaWMtPj5VcGRhdGVGYWJyaWM6IE1ha2Ugc2NyaXB0IGV4ZWN1dGFibGVcbiAqICAgZWxzZSBzZXR1cCBjb21tYW5kXG4gKiAgICAgQ0xJLT4+U2V0dXBGYWJyaWM6IENhbGwgc2V0dXBGYWJyaWMoY29uZmlnKVxuICogICAgIFNldHVwRmFicmljLT4+U2V0dXBGYWJyaWM6IEluc3RhbGwgY29tcG9uZW50c1xuICogICBlbmRcbiAqICAgQ0xJLT4+VXNlcjogRGlzcGxheSByZXN1bHRcbiAqL1xuXG5pbXBvcnQgZnMgZnJvbSBcImZzXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IGF4aW9zIGZyb20gXCJheGlvc1wiO1xuaW1wb3J0IHsgZXhlY1N5bmMgfSBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xuaW1wb3J0IHsgQ29tbWFuZCB9IGZyb20gXCJjb21tYW5kZXJcIjtcbmltcG9ydCB7IHNhZmVQYXJzZUNTViwgVkVSU0lPTiB9IGZyb20gXCIuLi9pbmRleFwiO1xuXG5jb25zdCBJTlNUQUxMX1NDUklQVCA9IHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi5cIiwgXCJiaW5cIiwgXCJpbnN0YWxsLWZhYnJpYy5zaFwiKTtcblxuLy8gRGVmYXVsdCBjb25maWd1cmF0aW9uXG5jb25zdCBkZWZhdWx0Q29uZmlnID0ge1xuICBmYWJyaWNWZXJzaW9uOiBcIjIuNS4xMlwiLFxuICBjYVZlcnNpb246IFwiMS41LjE1XCIsXG4gIGNvbXBvbmVudHM6IFtcImJpbmFyeVwiXSxcbn07XG5cbmNvbnN0IHByb2dyYW0gPSBuZXcgQ29tbWFuZCgpO1xuXG5wcm9ncmFtLnZlcnNpb24oVkVSU0lPTikuZGVzY3JpcHRpb24oXCJGYWJyaWMgc2V0dXAgYW5kIHVwZGF0ZSB1dGlsaXR5XCIpO1xuXG5wcm9ncmFtXG4gIC5jb21tYW5kKFwidXBkYXRlXCIpXG4gIC5kZXNjcmlwdGlvbihcIlVwZGF0ZSB0aGUgRmFicmljIGluc3RhbGwgc2NyaXB0XCIpXG4gIC5hY3Rpb24oYXN5bmMgKCkgPT4ge1xuICAgIGF3YWl0IHVwZGF0ZUZhYnJpYygpO1xuICB9KTtcblxucHJvZ3JhbVxuICAuY29tbWFuZChcInNldHVwXCIpXG4gIC5kZXNjcmlwdGlvbihcIlNldCB1cCBGYWJyaWMgY29tcG9uZW50c1wiKVxuICAub3B0aW9uKFxuICAgIFwiLWYsIC0tZmFicmljLXZlcnNpb24gPHZlcnNpb24+XCIsXG4gICAgXCJGYWJyaWMgdmVyc2lvblwiLFxuICAgIGRlZmF1bHRDb25maWcuZmFicmljVmVyc2lvblxuICApXG4gIC5vcHRpb24oXG4gICAgXCItYywgLS1jYS12ZXJzaW9uIDx2ZXJzaW9uPlwiLFxuICAgIFwiRmFicmljIENBIHZlcnNpb25cIixcbiAgICBkZWZhdWx0Q29uZmlnLmNhVmVyc2lvblxuICApXG4gIC5vcHRpb24oXG4gICAgXCItLWNvbXBvbmVudHMgPGNvbXBvbmVudHMuLi4+XCIsXG4gICAgXCJDb21wb25lbnRzIHRvIGluc3RhbGwgKGJpbmFyeSwgZG9ja2VyLCBwb2RtYW4sIHNhbXBsZXMpXCIsXG4gICAgc2FmZVBhcnNlQ1NWLFxuICAgIGRlZmF1bHRDb25maWcuY29tcG9uZW50c1xuICApXG4gIC5hY3Rpb24oYXN5bmMgKG9wdGlvbnMpID0+IHtcbiAgICBjb25zdCBjb25maWcgPSB7XG4gICAgICBmYWJyaWNWZXJzaW9uOiBvcHRpb25zLmZhYnJpY1ZlcnNpb24gfHwgZGVmYXVsdENvbmZpZy5mYWJyaWNWZXJzaW9uLFxuICAgICAgY2FWZXJzaW9uOiBvcHRpb25zLmNhVmVyc2lvbiB8fCBkZWZhdWx0Q29uZmlnLmNhVmVyc2lvbixcbiAgICAgIGNvbXBvbmVudHM6IG9wdGlvbnMuY29tcG9uZW50cyB8fCBkZWZhdWx0Q29uZmlnLmNvbXBvbmVudHMsXG4gICAgfTtcbiAgICBhd2FpdCBzZXR1cEZhYnJpYyhjb25maWcpO1xuICB9KTtcblxucHJvZ3JhbS5wYXJzZShwcm9jZXNzLmFyZ3YpO1xuXG4vKipcbiAqIEBmdW5jdGlvbiB1cGRhdGVGYWJyaWNcbiAqIEBkZXNjcmlwdGlvbiBVcGRhdGVzIHRoZSBGYWJyaWMgaW5zdGFsbCBzY3JpcHQgYnkgZG93bmxvYWRpbmcgdGhlIGxhdGVzdCB2ZXJzaW9uXG4gKiBAc3VtbWFyeSBUaGlzIGZ1bmN0aW9uIHJlbW92ZXMgdGhlIGV4aXN0aW5nIGluc3RhbGwgc2NyaXB0IChpZiBwcmVzZW50KSwgZG93bmxvYWRzXG4gKiB0aGUgbGF0ZXN0IHZlcnNpb24gZnJvbSB0aGUgSHlwZXJsZWRnZXIgRmFicmljIEdpdEh1YiByZXBvc2l0b3J5LCBhbmQgbWFrZXMgaXQgZXhlY3V0YWJsZS5cbiAqIEByZXR1cm5zIHtQcm9taXNlPHZvaWQ+fVxuICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBkb3dubG9hZCBmYWlscyBvciBmaWxlIG9wZXJhdGlvbnMgZW5jb3VudGVyIGlzc3Vlc1xuICogQG1lbWJlck9mIG1vZHVsZTpmYWJyaWMtY2xpXG4gKlxuICogQGV4YW1wbGVcbiAqIGF3YWl0IHVwZGF0ZUZhYnJpYygpO1xuICpcbiAqIEBtZXJtYWlkXG4gKiBzZXF1ZW5jZURpYWdyYW1cbiAqICAgcGFydGljaXBhbnQgRnVuY3Rpb25cbiAqICAgcGFydGljaXBhbnQgRmlsZVN5c3RlbVxuICogICBwYXJ0aWNpcGFudCBHaXRIdWJcbiAqICAgRnVuY3Rpb24tPj5GaWxlU3lzdGVtOiBDaGVjayBpZiBzY3JpcHQgZXhpc3RzXG4gKiAgIGFsdCBTY3JpcHQgZXhpc3RzXG4gKiAgICAgRnVuY3Rpb24tPj5GaWxlU3lzdGVtOiBSZW1vdmUgZXhpc3Rpbmcgc2NyaXB0XG4gKiAgIGVuZFxuICogICBGdW5jdGlvbi0+PkdpdEh1YjogRG93bmxvYWQgbGF0ZXN0IHNjcmlwdFxuICogICBHaXRIdWItLT4+RnVuY3Rpb246IFJldHVybiBzY3JpcHQgY29udGVudFxuICogICBGdW5jdGlvbi0+PkZpbGVTeXN0ZW06IFdyaXRlIG5ldyBzY3JpcHRcbiAqICAgRnVuY3Rpb24tPj5GaWxlU3lzdGVtOiBNYWtlIHNjcmlwdCBleGVjdXRhYmxlXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUZhYnJpYygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc29sZS5sb2coXCJFeGVjdXRpbmcgdXBkYXRlLi4uXCIpO1xuICBjb25zdCBTQ1JJUFRfVVJMID1cbiAgICBcImh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9oeXBlcmxlZGdlci9mYWJyaWMvbWFpbi9zY3JpcHRzL2luc3RhbGwtZmFicmljLnNoXCI7XG5cbiAgLy8gUmVtb3ZlIHRoZSBleGlzdGluZyBmaWxlIGlmIGl0IGV4aXN0c1xuICBpZiAoZnMuZXhpc3RzU3luYyhJTlNUQUxMX1NDUklQVCkpIHtcbiAgICBjb25zb2xlLmxvZyhcIlJlbW92aW5nIGV4aXN0aW5nIGluc3RhbGwtZmFicmljLnNoLi4uXCIpO1xuICAgIGZzLnVubGlua1N5bmMoSU5TVEFMTF9TQ1JJUFQpO1xuICB9XG5cbiAgLy8gRG93bmxvYWQgdGhlIG5ldyBmaWxlXG4gIGNvbnNvbGUubG9nKFwiRG93bmxvYWRpbmcgbmV3IGluc3RhbGwtZmFicmljLnNoLi4uXCIpO1xuICB0cnkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYXhpb3MuZ2V0KFNDUklQVF9VUkwsIHtcbiAgICAgIHJlc3BvbnNlVHlwZTogXCJhcnJheWJ1ZmZlclwiLFxuICAgIH0pO1xuXG4gICAgZnMud3JpdGVGaWxlU3luYyhJTlNUQUxMX1NDUklQVCwgcmVzcG9uc2UuZGF0YSk7XG4gICAgY29uc29sZS5sb2coXCJEb3dubG9hZCBzdWNjZXNzZnVsLlwiKTtcblxuICAgIC8vIE1ha2UgdGhlIGZpbGUgZXhlY3V0YWJsZVxuICAgIGZzLmNobW9kU3luYyhJTlNUQUxMX1NDUklQVCwgXCI3NTVcIik7XG4gICAgY29uc29sZS5sb2coXCJNYWRlIGluc3RhbGwtZmFicmljLnNoIGV4ZWN1dGFibGUuXCIpO1xuICB9IGNhdGNoIChlcnJvcjogdW5rbm93bikge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvcjogRmFpbGVkIHRvIGRvd25sb2FkIHRoZSBmaWxlLlwiKTtcbiAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICBwcm9jZXNzLmV4aXQoMSk7XG4gIH1cbn1cblxuLyoqXG4gKiBAZnVuY3Rpb24gc2V0dXBGYWJyaWNcbiAqIEBkZXNjcmlwdGlvbiBTZXRzIHVwIEZhYnJpYyBjb21wb25lbnRzIGJhc2VkIG9uIHRoZSBwcm92aWRlZCBjb25maWd1cmF0aW9uXG4gKiBAc3VtbWFyeSBUaGlzIGZ1bmN0aW9uIGluc3RhbGxzIHRoZSBzcGVjaWZpZWQgRmFicmljIGNvbXBvbmVudHMgdXNpbmcgdGhlXG4gKiBpbnN0YWxsLWZhYnJpYy5zaCBzY3JpcHQuIEl0IGl0ZXJhdGVzIHRocm91Z2ggdGhlIGNvbXBvbmVudHMgbGlzdCBhbmQgZXhlY3V0ZXNcbiAqIHRoZSBzY3JpcHQgZm9yIGVhY2ggY29tcG9uZW50IHdpdGggdGhlIHNwZWNpZmllZCBGYWJyaWMgYW5kIENBIHZlcnNpb25zLlxuICogQWZ0ZXIgaW5zdGFsbGF0aW9uLCBpdCBjb3BpZXMgY29uZmlndXJhdGlvbiBmaWxlcyB0byB0aGUgcm9vdCBjb25maWcgZm9sZGVyLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyAtIENvbmZpZ3VyYXRpb24gb2JqZWN0IGZvciBGYWJyaWMgc2V0dXBcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcuZmFicmljVmVyc2lvbiAtIEZhYnJpYyB2ZXJzaW9uIHRvIGluc3RhbGxcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb25maWcuY2FWZXJzaW9uIC0gRmFicmljIENBIHZlcnNpb24gdG8gaW5zdGFsbFxuICogQHBhcmFtIHtzdHJpbmdbXX0gY29uZmlnLmNvbXBvbmVudHMgLSBMaXN0IG9mIGNvbXBvbmVudHMgdG8gaW5zdGFsbFxuICogQHJldHVybnMge1Byb21pc2U8dm9pZD59XG4gKiBAdGhyb3dzIHtFcnJvcn0gSWYgdGhlIGluc3RhbGwgc2NyaXB0IGlzIG5vdCBmb3VuZCwgY29tcG9uZW50IGluc3RhbGxhdGlvbiBmYWlscywgb3IgZmlsZSBjb3B5aW5nIGZhaWxzXG4gKiBAbWVtYmVyT2YgbW9kdWxlOmZhYnJpYy1jbGlcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgY29uZmlnID0ge1xuICogICBmYWJyaWNWZXJzaW9uOiBcIjIuNS4xMlwiLFxuICogICBjYVZlcnNpb246IFwiMS41LjE1XCIsXG4gKiAgIGNvbXBvbmVudHM6IFtcImJpbmFyeVwiLCBcImRvY2tlclwiXVxuICogfTtcbiAqIGF3YWl0IHNldHVwRmFicmljKGNvbmZpZyk7XG4gKlxuICogQG1lcm1haWRcbiAqIHNlcXVlbmNlRGlhZ3JhbVxuICogICBwYXJ0aWNpcGFudCBGdW5jdGlvblxuICogICBwYXJ0aWNpcGFudCBGaWxlU3lzdGVtXG4gKiAgIHBhcnRpY2lwYW50IEluc3RhbGxTY3JpcHRcbiAqICAgRnVuY3Rpb24tPj5GaWxlU3lzdGVtOiBDaGVjayBpZiBpbnN0YWxsIHNjcmlwdCBleGlzdHNcbiAqICAgYWx0IFNjcmlwdCBub3QgZm91bmRcbiAqICAgICBGdW5jdGlvbi0+PkZ1bmN0aW9uOiBMb2cgZXJyb3IgYW5kIGV4aXRcbiAqICAgZWxzZSBTY3JpcHQgZm91bmRcbiAqICAgICBsb29wIEZvciBlYWNoIGNvbXBvbmVudFxuICogICAgICAgRnVuY3Rpb24tPj5JbnN0YWxsU2NyaXB0OiBFeGVjdXRlIGluc3RhbGwgc2NyaXB0XG4gKiAgICAgICBJbnN0YWxsU2NyaXB0LS0+PkZ1bmN0aW9uOiBJbnN0YWxsYXRpb24gcmVzdWx0XG4gKiAgICAgICBhbHQgSW5zdGFsbGF0aW9uIGZhaWxlZFxuICogICAgICAgICBGdW5jdGlvbi0+PkZ1bmN0aW9uOiBMb2cgZXJyb3IgYW5kIGV4aXRcbiAqICAgICAgIGVuZFxuICogICAgIGVuZFxuICogICAgIEZ1bmN0aW9uLT4+RmlsZVN5c3RlbTogQ29weSBjb25maWcgZmlsZXNcbiAqICAgICBhbHQgQ29weSBmYWlsZWRcbiAqICAgICAgIEZ1bmN0aW9uLT4+RnVuY3Rpb246IExvZyBlcnJvclxuICogICAgIGVuZFxuICogICBlbmRcbiAqICAgRnVuY3Rpb24tPj5GdW5jdGlvbjogTG9nIHN1Y2Nlc3MgbWVzc2FnZVxuICovXG5hc3luYyBmdW5jdGlvbiBzZXR1cEZhYnJpYyhjb25maWc6IHR5cGVvZiBkZWZhdWx0Q29uZmlnKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnNvbGUubG9nKFwiRXhlY3V0aW5nIHNldHVwLi4uXCIpO1xuICBpZiAoZnMuZXhpc3RzU3luYyhJTlNUQUxMX1NDUklQVCkpIHtcbiAgICBjb25zb2xlLmxvZyhcIkV4ZWN1dGluZyBpbnN0YWxsLWZhYnJpYy5zaC4uLlwiKTtcblxuICAgIGZvciAoY29uc3QgY29tcG9uZW50IG9mIGNvbmZpZy5jb21wb25lbnRzKSB7XG4gICAgICBjb25zb2xlLmxvZyhgSW5zdGFsbGluZyBjb21wb25lbnQ6ICR7Y29tcG9uZW50fWApO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZXhlY1N5bmMoXG4gICAgICAgICAgYGJhc2ggXCIke0lOU1RBTExfU0NSSVBUfVwiIFwiJHtjb21wb25lbnR9XCIgLWYgXCIke2NvbmZpZy5mYWJyaWNWZXJzaW9ufVwiIC1jIFwiJHtjb25maWcuY2FWZXJzaW9ufVwiYCxcbiAgICAgICAgICB7IHN0ZGlvOiBcImluaGVyaXRcIiB9XG4gICAgICAgICk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBFcnJvciBpbnN0YWxsaW5nIGNvbXBvbmVudDogJHtjb21wb25lbnR9YCk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHNyY0NvbmZpZ0RpciA9IHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi5cIiwgXCJzcmNcIiwgXCJjb25maWdzXCIpO1xuICAgICAgY29uc3QgYmFzZUNvbmZpZ0RpciA9IHBhdGguam9pbihcbiAgICAgICAgX19kaXJuYW1lLFxuICAgICAgICBcIi4uXCIsXG4gICAgICAgIFwiZmFicmljLXNhbXBsZXNcIixcbiAgICAgICAgXCJjb25maWdcIlxuICAgICAgKTtcbiAgICAgIGNvbnN0IGRlc3RDb25maWdEaXIgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCBcIi4uXCIsIFwiY29uZmlnXCIpO1xuXG4gICAgICAvLyBDcmVhdGUgdGhlIGRlc3RpbmF0aW9uIGRpcmVjdG9yeSBpZiBpdCBkb2Vzbid0IGV4aXN0XG4gICAgICBpZiAoIWZzLmV4aXN0c1N5bmMoZGVzdENvbmZpZ0RpcikpIHtcbiAgICAgICAgZnMubWtkaXJTeW5jKGRlc3RDb25maWdEaXIsIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyBDb3B5IGZpbGVzIGZyb20gc3JjL2NvbmZpZ3MgdG8gcm9vdERpci9jb25maWdcbiAgICAgIGZzLnJlYWRkaXJTeW5jKHNyY0NvbmZpZ0RpcikuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgICBjb25zdCBzcmNQYXRoID0gcGF0aC5qb2luKHNyY0NvbmZpZ0RpciwgZmlsZSk7XG4gICAgICAgIGNvbnN0IGRlc3RQYXRoID0gcGF0aC5qb2luKGRlc3RDb25maWdEaXIsIGZpbGUpO1xuICAgICAgICBmcy5jb3B5RmlsZVN5bmMoc3JjUGF0aCwgZGVzdFBhdGgpO1xuICAgICAgICBjb25zb2xlLmxvZyhgQ29waWVkICR7ZmlsZX0gdG8gJHtkZXN0Q29uZmlnRGlyfWApO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKGJhc2VDb25maWdEaXIpKVxuICAgICAgICAvLyBJbiBjYXNlIGluc3RhbGwgc2NyaXB0IGluc3RhbGxlZCBjb25maWcgaW4gZmFicmljLXNhbXBsZXNcbiAgICAgICAgZnMucmVhZGRpclN5bmMoYmFzZUNvbmZpZ0RpcikuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHNyY1BhdGggPSBwYXRoLmpvaW4oc3JjQ29uZmlnRGlyLCBmaWxlKTtcbiAgICAgICAgICBjb25zdCBkZXN0UGF0aCA9IHBhdGguam9pbihkZXN0Q29uZmlnRGlyLCBmaWxlKTtcbiAgICAgICAgICBmcy5jb3B5RmlsZVN5bmMoc3JjUGF0aCwgZGVzdFBhdGgpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKGBDb3BpZWQgJHtmaWxlfSB0byAke2Rlc3RDb25maWdEaXJ9YCk7XG4gICAgICAgIH0pO1xuXG4gICAgICBjb25zb2xlLmxvZyhcIkNvbmZpZ3VyYXRpb24gZmlsZXMgY29waWVkIHN1Y2Nlc3NmdWxseS5cIik7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBjb3B5aW5nIGNvbmZpZ3VyYXRpb24gZmlsZXM6XCIpO1xuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coXCJBbGwgY29tcG9uZW50cyBpbnN0YWxsZWQgc3VjY2Vzc2Z1bGx5LlwiKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmVycm9yKFxuICAgICAgXCJFcnJvcjogaW5zdGFsbC1mYWJyaWMuc2ggbm90IGZvdW5kLiBQbGVhc2UgcnVuIHRoZSB1cGRhdGUgY29tbWFuZCBmaXJzdC5cIlxuICAgICk7XG4gICAgY29uc29sZS5lcnJvcihJTlNUQUxMX1NDUklQVCk7XG4gICAgcHJvY2Vzcy5leGl0KDEpO1xuICB9XG59XG4iXSwibmFtZXMiOlsidGhpcyIsIkNvbW1hbmQiLCJleGVjU3luYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7O0FBSUc7QUFNSDs7Ozs7O0FBTUc7QUFDSCxJQUFLLEtBS0o7QUFMRCxDQUFBLFVBQUssS0FBSyxFQUFBOztBQUVSLElBQUEsS0FBQSxDQUFBLEtBQUEsQ0FBQSxH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LFFBQVEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRTtBQUNsQixRQUFRLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQ2QsUUFBUSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFO0FBQ2YsUUFBUSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxTQUFTLENBQUMsTUFBTSxFQUFFO0FBQ3RCLFFBQVEsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsRUFBRSxHQUFHLE1BQU0sRUFBRTtBQUN2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLE1BQU0sT0FBTyxDQUFDO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxTQUFTLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxLQUFLO0FBQ2pELFFBQVEsT0FBTyxJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO0FBQzdDLEtBQUssQ0FBQztBQUNOLElBQUksU0FBUyxJQUFJLENBQUMsT0FBTyxHQUFHLGlCQUFpQixDQUFDO0FBQzlDLElBQUksV0FBVyxHQUFHO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksT0FBTyxVQUFVLENBQUMsT0FBTyxFQUFFO0FBQy9CLFFBQVEsT0FBTyxDQUFDLFFBQVEsR0FBRyxPQUFPO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxPQUFPLFNBQVMsQ0FBQyxNQUFNLEVBQUU7QUFDN0IsUUFBUSxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLO0FBQ25ELFlBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0FBQy9CLFNBQVMsQ0FBQztBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksT0FBTyxTQUFTLEdBQUc7QUFDdkIsUUFBUSxPQUFPLElBQUksQ0FBQyxPQUFPO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxPQUFPLEdBQUcsR0FBRztBQUNqQixRQUFRLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDO0FBQzFFLFFBQVEsT0FBTyxJQUFJLENBQUMsTUFBTTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxPQUFPLE9BQU8sQ0FBQyxHQUFHLEVBQUUsU0FBUyxHQUFHLENBQUMsRUFBRTtBQUN2QyxRQUFRLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFDckIsUUFBUSxPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxPQUFPLEtBQUssQ0FBQyxHQUFHLEVBQUU7QUFDdEIsUUFBUSxPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxPQUFPLEtBQUssQ0FBQyxHQUFHLEVBQUU7QUFDdEIsUUFBUSxPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxPQUFPLFNBQVMsQ0FBQyxHQUFHLEVBQUU7QUFDMUIsUUFBUSxPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxPQUFPLEtBQUssQ0FBQyxHQUFHLEVBQUU7QUFDdEIsUUFBUSxPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxPQUFPLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFD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QUFhLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEtBQUk7b0JBQzdDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQztvQkFDN0MsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDO0FBQy9DLG9CQUFBLEVBQUUsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQztvQkFDbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBLE9BQUEsRUFBVSxJQUFJLENBQU8sSUFBQSxFQUFBLGFBQWEsQ0FBRSxDQUFBLENBQUM7QUFDbkQsaUJBQUMsQ0FBQztBQUVKLFlBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQ0FBMEMsQ0FBQzs7UUFDdkQsT0FBTyxLQUFLLEVBQUU7QUFDZCxZQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0NBQW9DLENBQUM7QUFDbkQsWUFBQSxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQzs7QUFHdEIsUUFBQSxPQUFPLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxDQUFDOztTQUNoRDtBQUNMLFFBQUEsT0FBTyxDQUFDLEtBQUssQ0FDWCwwRUFBMEUsQ0FDM0U7QUFDRCxRQUFBLE9BQU8sQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDO0FBQzdCLFFBQUEsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7O0FBRW5COzsiLCJ4X2dvb2dsZV9pZ25vcmVMaXN0IjpbMyw0LDUsNiw3LDgsOSwxMCwxMSwxMiwxMywxNCwxNSwxNl19
