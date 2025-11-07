#!/usr/bin/env node
'use strict';

var commander = require('commander');
var fs = require('fs');
var path = require('path');
var process$1 = require('process');

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

const program = new commander.Command();
program
    .command("add-node-shebang")
    .description("Adds a shebang to the provided script")
    .option("--file <string>", "Path to the script file")
    .action(async (options) => {
    const log = Logging.for("She-Bang");
    const filePath = path.join(process$1.cwd(), options.file);
    let content = fs.readFileSync(filePath, "utf8");
    const shebang = "#!/usr/bin/env node";
    if (!content.startsWith(shebang)) {
        content = `${shebang}\n${content}`;
        fs.writeFileSync(filePath, content, "utf8");
        log.info(`Shebang added to ${filePath}`);
    }
    else {
        log.error(`Shebang already present in ${filePath}`);
    }
});
program.parse(process.argv);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hlLWJhbmcuY2pzIiwic291cmNlcyI6WyIuLi9ub2RlX21vZHVsZXMvc3R5bGVkLXN0cmluZy1idWlsZGVyL2xpYi9lc20vY29uc3RhbnRzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3N0eWxlZC1zdHJpbmctYnVpbGRlci9saWIvZXNtL2NvbG9ycy5qcyIsIi4uL25vZGVfbW9kdWxlcy9zdHlsZWQtc3RyaW5nLWJ1aWxkZXIvbGliL2VzbS9zdHJpbmdzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BkZWNhZi10cy9sb2dnaW5nL2xpYi9lc20vY29uc3RhbnRzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BkZWNhZi10cy9sb2dnaW5nL2xpYi9lc20vdGV4dC5qcyIsIi4uL25vZGVfbW9kdWxlcy90eXBlZC1vYmplY3QtYWNjdW11bGF0b3IvbGliL2VzbS9hY2N1bXVsYXRvci5qcyIsIi4uL25vZGVfbW9kdWxlcy9AZGVjYWYtdHMvbG9nZ2luZy9saWIvZXNtL3dlYi5qcyIsIi4uL25vZGVfbW9kdWxlcy9AZGVjYWYtdHMvbG9nZ2luZy9saWIvZXNtL2Vudmlyb25tZW50LmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BkZWNhZi10cy9sb2dnaW5nL2xpYi9lc20vbG9nZ2luZy5qcyIsIi4uL25vZGVfbW9kdWxlcy9AZGVjYWYtdHMvbG9nZ2luZy9saWIvZXNtL0xvZ2dlZENsYXNzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BkZWNhZi10cy9sb2dnaW5nL2xpYi9lc20vZmlsdGVycy9Mb2dGaWx0ZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvQGRlY2FmLXRzL2xvZ2dpbmcvbGliL2VzbS90aW1lLmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BkZWNhZi10cy9sb2dnaW5nL2xpYi9lc20vZGVjb3JhdG9ycy5qcyIsIi4uL25vZGVfbW9kdWxlcy9AZGVjYWYtdHMvbG9nZ2luZy9saWIvZXNtL2ZpbHRlcnMvUGF0dGVybkZpbHRlci5qcyIsIi4uL3NyYy9iaW4vc2hlLWJhbmcudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZGVzY3JpcHRpb24gQU5TSSBlc2NhcGUgY29kZSBmb3IgcmVzZXR0aW5nIHRleHQgZm9ybWF0dGluZy5cbiAqIEBzdW1tYXJ5IFRoaXMgY29uc3RhbnQgaG9sZHMgdGhlIEFOU0kgZXNjYXBlIHNlcXVlbmNlIHVzZWQgdG8gcmVzZXQgYWxsIHRleHQgZm9ybWF0dGluZyB0byBkZWZhdWx0LlxuICogQGNvbnN0IEFuc2lSZXNldFxuICogQG1lbWJlck9mIG1vZHVsZTpTdHlsZWRTdHJpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IEFuc2lSZXNldCA9IFwiXFx4MWJbMG1cIjtcbi8qKlxuICogQGRlc2NyaXB0aW9uIFN0YW5kYXJkIGZvcmVncm91bmQgY29sb3IgY29kZXMgZm9yIEFOU0kgdGV4dCBmb3JtYXR0aW5nLlxuICogQHN1bW1hcnkgVGhpcyBvYmplY3QgbWFwcyBjb2xvciBuYW1lcyB0byB0aGVpciBjb3JyZXNwb25kaW5nIEFOU0kgY29sb3IgY29kZXMgZm9yIHN0YW5kYXJkIGZvcmVncm91bmQgY29sb3JzLlxuICogQGNvbnN0IFN0YW5kYXJkRm9yZWdyb3VuZENvbG9yc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IGJsYWNrIC0gQU5TSSBjb2RlIGZvciBibGFjayB0ZXh0ICgzMCkuXG4gKiBAcHJvcGVydHkge251bWJlcn0gcmVkIC0gQU5TSSBjb2RlIGZvciByZWQgdGV4dCAoMzEpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGdyZWVuIC0gQU5TSSBjb2RlIGZvciBncmVlbiB0ZXh0ICgzMikuXG4gKiBAcHJvcGVydHkge251bWJlcn0geWVsbG93IC0gQU5TSSBjb2RlIGZvciB5ZWxsb3cgdGV4dCAoMzMpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGJsdWUgLSBBTlNJIGNvZGUgZm9yIGJsdWUgdGV4dCAoMzQpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IG1hZ2VudGEgLSBBTlNJIGNvZGUgZm9yIG1hZ2VudGEgdGV4dCAoMzUpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGN5YW4gLSBBTlNJIGNvZGUgZm9yIGN5YW4gdGV4dCAoMzYpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IHdoaXRlIC0gQU5TSSBjb2RlIGZvciB3aGl0ZSB0ZXh0ICgzNykuXG4gKiBAbWVtYmVyT2YgbW9kdWxlOlN0eWxlZFN0cmluZ1xuICovXG5leHBvcnQgY29uc3QgU3RhbmRhcmRGb3JlZ3JvdW5kQ29sb3JzID0ge1xuICAgIGJsYWNrOiAzMCxcbiAgICByZWQ6IDMxLFxuICAgIGdyZWVuOiAzMixcbiAgICB5ZWxsb3c6IDMzLFxuICAgIGJsdWU6IDM0LFxuICAgIG1hZ2VudGE6IDM1LFxuICAgIGN5YW46IDM2LFxuICAgIHdoaXRlOiAzNyxcbn07XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBCcmlnaHQgZm9yZWdyb3VuZCBjb2xvciBjb2RlcyBmb3IgQU5TSSB0ZXh0IGZvcm1hdHRpbmcuXG4gKiBAc3VtbWFyeSBUaGlzIG9iamVjdCBtYXBzIGNvbG9yIG5hbWVzIHRvIHRoZWlyIGNvcnJlc3BvbmRpbmcgQU5TSSBjb2xvciBjb2RlcyBmb3IgYnJpZ2h0IGZvcmVncm91bmQgY29sb3JzLlxuICogQGNvbnN0IEJyaWdodEZvcmVncm91bmRDb2xvcnNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBibGFjayAtIEFOU0kgY29kZSBmb3IgYnJpZ2h0IGJsYWNrIHRleHQgKDkwKS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSByZWQgLSBBTlNJIGNvZGUgZm9yIGJyaWdodCByZWQgdGV4dCAoOTEpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGdyZWVuIC0gQU5TSSBjb2RlIGZvciBicmlnaHQgZ3JlZW4gdGV4dCAoOTIpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IHllbGxvdyAtIEFOU0kgY29kZSBmb3IgYnJpZ2h0IHllbGxvdyB0ZXh0ICg5MykuXG4gKiBAcHJvcGVydHkge251bWJlcn0gYmx1ZSAtIEFOU0kgY29kZSBmb3IgYnJpZ2h0IGJsdWUgdGV4dCAoOTQpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IG1hZ2VudGEgLSBBTlNJIGNvZGUgZm9yIGJyaWdodCBtYWdlbnRhIHRleHQgKDk1KS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjeWFuIC0gQU5TSSBjb2RlIGZvciBicmlnaHQgY3lhbiB0ZXh0ICg5NikuXG4gKiBAcHJvcGVydHkge251bWJlcn0gd2hpdGUgLSBBTlNJIGNvZGUgZm9yIGJyaWdodCB3aGl0ZSB0ZXh0ICg5NykuXG4gKiBAbWVtYmVyT2YgbW9kdWxlOkBTdHlsZWRTdHJpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IEJyaWdodEZvcmVncm91bmRDb2xvcnMgPSB7XG4gICAgYnJpZ2h0QmxhY2s6IDkwLFxuICAgIGJyaWdodFJlZDogOTEsXG4gICAgYnJpZ2h0R3JlZW46IDkyLFxuICAgIGJyaWdodFllbGxvdzogOTMsXG4gICAgYnJpZ2h0Qmx1ZTogOTQsXG4gICAgYnJpZ2h0TWFnZW50YTogOTUsXG4gICAgYnJpZ2h0Q3lhbjogOTYsXG4gICAgYnJpZ2h0V2hpdGU6IDk3LFxufTtcbi8qKlxuICogQGRlc2NyaXB0aW9uIFN0YW5kYXJkIGJhY2tncm91bmQgY29sb3IgY29kZXMgZm9yIEFOU0kgdGV4dCBmb3JtYXR0aW5nLlxuICogQHN1bW1hcnkgVGhpcyBvYmplY3QgbWFwcyBjb2xvciBuYW1lcyB0byB0aGVpciBjb3JyZXNwb25kaW5nIEFOU0kgY29sb3IgY29kZXMgZm9yIHN0YW5kYXJkIGJhY2tncm91bmQgY29sb3JzLlxuICogQGNvbnN0IFN0YW5kYXJkQmFja2dyb3VuZENvbG9yc1xuICogQHByb3BlcnR5IHtudW1iZXJ9IGJnQmxhY2sgLSBBTlNJIGNvZGUgZm9yIGJsYWNrIGJhY2tncm91bmQgKDQwKS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBiZ1JlZCAtIEFOU0kgY29kZSBmb3IgcmVkIGJhY2tncm91bmQgKDQxKS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBiZ0dyZWVuIC0gQU5TSSBjb2RlIGZvciBncmVlbiBiYWNrZ3JvdW5kICg0MikuXG4gKiBAcHJvcGVydHkge251bWJlcn0gYmdZZWxsb3cgLSBBTlNJIGNvZGUgZm9yIHllbGxvdyBiYWNrZ3JvdW5kICg0MykuXG4gKiBAcHJvcGVydHkge251bWJlcn0gYmdCbHVlIC0gQU5TSSBjb2RlIGZvciBibHVlIGJhY2tncm91bmQgKDQ0KS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBiZ01hZ2VudGEgLSBBTlNJIGNvZGUgZm9yIG1hZ2VudGEgYmFja2dyb3VuZCAoNDUpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGJnQ3lhbiAtIEFOU0kgY29kZSBmb3IgY3lhbiBiYWNrZ3JvdW5kICg0NikuXG4gKiBAcHJvcGVydHkge251bWJlcn0gYmdXaGl0ZSAtIEFOU0kgY29kZSBmb3Igd2hpdGUgYmFja2dyb3VuZCAoNDcpLlxuICogQG1lbWJlck9mIG1vZHVsZTpAU3R5bGVkU3RyaW5nXG4gKi9cbmV4cG9ydCBjb25zdCBTdGFuZGFyZEJhY2tncm91bmRDb2xvcnMgPSB7XG4gICAgYmdCbGFjazogNDAsXG4gICAgYmdSZWQ6IDQxLFxuICAgIGJnR3JlZW46IDQyLFxuICAgIGJnWWVsbG93OiA0MyxcbiAgICBiZ0JsdWU6IDQ0LFxuICAgIGJnTWFnZW50YTogNDUsXG4gICAgYmdDeWFuOiA0NixcbiAgICBiZ1doaXRlOiA0Nyxcbn07XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBCcmlnaHQgYmFja2dyb3VuZCBjb2xvciBjb2RlcyBmb3IgQU5TSSB0ZXh0IGZvcm1hdHRpbmcuXG4gKiBAc3VtbWFyeSBUaGlzIG9iamVjdCBtYXBzIGNvbG9yIG5hbWVzIHRvIHRoZWlyIGNvcnJlc3BvbmRpbmcgQU5TSSBjb2xvciBjb2RlcyBmb3IgYnJpZ2h0IGJhY2tncm91bmQgY29sb3JzLlxuICogQGNvbnN0IEJyaWdodEJhY2tncm91bmRDb2xvcnNcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBiZ0JyaWdodEJsYWNrIC0gQU5TSSBjb2RlIGZvciBicmlnaHQgYmxhY2sgYmFja2dyb3VuZCAoMTAwKS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBiZ0JyaWdodFJlZCAtIEFOU0kgY29kZSBmb3IgYnJpZ2h0IHJlZCBiYWNrZ3JvdW5kICgxMDEpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGJnQnJpZ2h0R3JlZW4gLSBBTlNJIGNvZGUgZm9yIGJyaWdodCBncmVlbiBiYWNrZ3JvdW5kICgxMDIpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGJnQnJpZ2h0WWVsbG93IC0gQU5TSSBjb2RlIGZvciBicmlnaHQgeWVsbG93IGJhY2tncm91bmQgKDEwMykuXG4gKiBAcHJvcGVydHkge251bWJlcn0gYmdCcmlnaHRCbHVlIC0gQU5TSSBjb2RlIGZvciBicmlnaHQgYmx1ZSBiYWNrZ3JvdW5kICgxMDQpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGJnQnJpZ2h0TWFnZW50YSAtIEFOU0kgY29kZSBmb3IgYnJpZ2h0IG1hZ2VudGEgYmFja2dyb3VuZCAoMTA1KS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBiZ0JyaWdodEN5YW4gLSBBTlNJIGNvZGUgZm9yIGJyaWdodCBjeWFuIGJhY2tncm91bmQgKDEwNikuXG4gKiBAcHJvcGVydHkge251bWJlcn0gYmdCcmlnaHRXaGl0ZSAtIEFOU0kgY29kZSBmb3IgYnJpZ2h0IHdoaXRlIGJhY2tncm91bmQgKDEwNykuXG4gKiBAbWVtYmVyT2YgbW9kdWxlOkBTdHlsZWRTdHJpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IEJyaWdodEJhY2tncm91bmRDb2xvcnMgPSB7XG4gICAgYmdCcmlnaHRCbGFjazogMTAwLFxuICAgIGJnQnJpZ2h0UmVkOiAxMDEsXG4gICAgYmdCcmlnaHRHcmVlbjogMTAyLFxuICAgIGJnQnJpZ2h0WWVsbG93OiAxMDMsXG4gICAgYmdCcmlnaHRCbHVlOiAxMDQsXG4gICAgYmdCcmlnaHRNYWdlbnRhOiAxMDUsXG4gICAgYmdCcmlnaHRDeWFuOiAxMDYsXG4gICAgYmdCcmlnaHRXaGl0ZTogMTA3LFxufTtcbi8qKlxuICogQGRlc2NyaXB0aW9uIFRleHQgc3R5bGUgY29kZXMgZm9yIEFOU0kgdGV4dCBmb3JtYXR0aW5nLlxuICogQHN1bW1hcnkgVGhpcyBvYmplY3QgbWFwcyBzdHlsZSBuYW1lcyB0byB0aGVpciBjb3JyZXNwb25kaW5nIEFOU0kgY29kZXMgZm9yIHZhcmlvdXMgdGV4dCBzdHlsZXMuXG4gKiBAY29uc3Qgc3R5bGVzXG4gKiBAcHJvcGVydHkge251bWJlcn0gcmVzZXQgLSBBTlNJIGNvZGUgdG8gcmVzZXQgYWxsIHN0eWxlcyAoMCkuXG4gKiBAcHJvcGVydHkge251bWJlcn0gYm9sZCAtIEFOU0kgY29kZSBmb3IgYm9sZCB0ZXh0ICgxKS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBkaW0gLSBBTlNJIGNvZGUgZm9yIGRpbSB0ZXh0ICgyKS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBpdGFsaWMgLSBBTlNJIGNvZGUgZm9yIGl0YWxpYyB0ZXh0ICgzKS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB1bmRlcmxpbmUgLSBBTlNJIGNvZGUgZm9yIHVuZGVybGluZWQgdGV4dCAoNCkuXG4gKiBAcHJvcGVydHkge251bWJlcn0gYmxpbmsgLSBBTlNJIGNvZGUgZm9yIGJsaW5raW5nIHRleHQgKDUpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGludmVyc2UgLSBBTlNJIGNvZGUgZm9yIGludmVyc2UgY29sb3JzICg3KS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBoaWRkZW4gLSBBTlNJIGNvZGUgZm9yIGhpZGRlbiB0ZXh0ICg4KS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzdHJpa2V0aHJvdWdoIC0gQU5TSSBjb2RlIGZvciBzdHJpa2V0aHJvdWdoIHRleHQgKDkpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGRvdWJsZVVuZGVybGluZSAtIEFOU0kgY29kZSBmb3IgZG91YmxlIHVuZGVybGluZWQgdGV4dCAoMjEpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IG5vcm1hbENvbG9yIC0gQU5TSSBjb2RlIHRvIHJlc2V0IGNvbG9yIHRvIG5vcm1hbCAoMjIpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IG5vSXRhbGljT3JGcmFrdHVyIC0gQU5TSSBjb2RlIHRvIHR1cm4gb2ZmIGl0YWxpYyAoMjMpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IG5vVW5kZXJsaW5lIC0gQU5TSSBjb2RlIHRvIHR1cm4gb2ZmIHVuZGVybGluZSAoMjQpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IG5vQmxpbmsgLSBBTlNJIGNvZGUgdG8gdHVybiBvZmYgYmxpbmsgKDI1KS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBub0ludmVyc2UgLSBBTlNJIGNvZGUgdG8gdHVybiBvZmYgaW52ZXJzZSAoMjcpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IG5vSGlkZGVuIC0gQU5TSSBjb2RlIHRvIHR1cm4gb2ZmIGhpZGRlbiAoMjgpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IG5vU3RyaWtldGhyb3VnaCAtIEFOU0kgY29kZSB0byB0dXJuIG9mZiBzdHJpa2V0aHJvdWdoICgyOSkuXG4gKiBAbWVtYmVyT2YgbW9kdWxlOkBTdHlsZWRTdHJpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IHN0eWxlcyA9IHtcbiAgICByZXNldDogMCxcbiAgICBib2xkOiAxLFxuICAgIGRpbTogMixcbiAgICBpdGFsaWM6IDMsXG4gICAgdW5kZXJsaW5lOiA0LFxuICAgIGJsaW5rOiA1LFxuICAgIGludmVyc2U6IDcsXG4gICAgaGlkZGVuOiA4LFxuICAgIHN0cmlrZXRocm91Z2g6IDksXG4gICAgZG91YmxlVW5kZXJsaW5lOiAyMSxcbiAgICBub3JtYWxDb2xvcjogMjIsXG4gICAgbm9JdGFsaWNPckZyYWt0dXI6IDIzLFxuICAgIG5vVW5kZXJsaW5lOiAyNCxcbiAgICBub0JsaW5rOiAyNSxcbiAgICBub0ludmVyc2U6IDI3LFxuICAgIG5vSGlkZGVuOiAyOCxcbiAgICBub1N0cmlrZXRocm91Z2g6IDI5LFxufTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbk55WXk5amIyNXpkR0Z1ZEhNdWRITWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRMEU3T3pzN08wZEJTMGM3UVVGRFNDeE5RVUZOTEVOQlFVTXNUVUZCVFN4VFFVRlRMRWRCUVVjc1UwRkJVeXhEUVVGRE8wRkJSVzVET3pzN096czdPenM3T3pzN08wZEJZVWM3UVVGRFNDeE5RVUZOTEVOQlFVTXNUVUZCVFN4M1FrRkJkMElzUjBGQlJ6dEpRVU4wUXl4TFFVRkxMRVZCUVVVc1JVRkJSVHRKUVVOVUxFZEJRVWNzUlVGQlJTeEZRVUZGTzBsQlExQXNTMEZCU3l4RlFVRkZMRVZCUVVVN1NVRkRWQ3hOUVVGTkxFVkJRVVVzUlVGQlJUdEpRVU5XTEVsQlFVa3NSVUZCUlN4RlFVRkZPMGxCUTFJc1QwRkJUeXhGUVVGRkxFVkJRVVU3U1VGRFdDeEpRVUZKTEVWQlFVVXNSVUZCUlR0SlFVTlNMRXRCUVVzc1JVRkJSU3hGUVVGRk8wTkJRMVlzUTBGQlF6dEJRVVZHT3pzN096czdPenM3T3pzN08wZEJZVWM3UVVGRFNDeE5RVUZOTEVOQlFVTXNUVUZCVFN4elFrRkJjMElzUjBGQlJ6dEpRVU53UXl4WFFVRlhMRVZCUVVVc1JVRkJSVHRKUVVObUxGTkJRVk1zUlVGQlJTeEZRVUZGTzBsQlEySXNWMEZCVnl4RlFVRkZMRVZCUVVVN1NVRkRaaXhaUVVGWkxFVkJRVVVzUlVGQlJUdEpRVU5vUWl4VlFVRlZMRVZCUVVVc1JVRkJSVHRKUVVOa0xHRkJRV0VzUlVGQlJTeEZRVUZGTzBsQlEycENMRlZCUVZVc1JVRkJSU3hGUVVGRk8wbEJRMlFzVjBGQlZ5eEZRVUZGTEVWQlFVVTdRMEZEYUVJc1EwRkJRenRCUVVWR096czdPenM3T3pzN096czdPMGRCWVVjN1FVRkRTQ3hOUVVGTkxFTkJRVU1zVFVGQlRTeDNRa0ZCZDBJc1IwRkJSenRKUVVOMFF5eFBRVUZQTEVWQlFVVXNSVUZCUlR0SlFVTllMRXRCUVVzc1JVRkJSU3hGUVVGRk8wbEJRMVFzVDBGQlR5eEZRVUZGTEVWQlFVVTdTVUZEV0N4UlFVRlJMRVZCUVVVc1JVRkJSVHRKUVVOYUxFMUJRVTBzUlVGQlJTeEZRVUZGTzBsQlExWXNVMEZCVXl4RlFVRkZMRVZCUVVVN1NVRkRZaXhOUVVGTkxFVkJRVVVzUlVGQlJUdEpRVU5XTEU5QlFVOHNSVUZCUlN4RlFVRkZPME5CUTFvc1EwRkJRenRCUVVWR096czdPenM3T3pzN096czdPMGRCWVVjN1FVRkRTQ3hOUVVGTkxFTkJRVU1zVFVGQlRTeHpRa0ZCYzBJc1IwRkJSenRKUVVOd1F5eGhRVUZoTEVWQlFVVXNSMEZCUnp0SlFVTnNRaXhYUVVGWExFVkJRVVVzUjBGQlJ6dEpRVU5vUWl4aFFVRmhMRVZCUVVVc1IwRkJSenRKUVVOc1FpeGpRVUZqTEVWQlFVVXNSMEZCUnp0SlFVTnVRaXhaUVVGWkxFVkJRVVVzUjBGQlJ6dEpRVU5xUWl4bFFVRmxMRVZCUVVVc1IwRkJSenRKUVVOd1FpeFpRVUZaTEVWQlFVVXNSMEZCUnp0SlFVTnFRaXhoUVVGaExFVkJRVVVzUjBGQlJ6dERRVU51UWl4RFFVRkRPMEZCUlVZN096czdPenM3T3pzN096czdPenM3T3pzN096czdSMEZ6UWtjN1FVRkRTQ3hOUVVGTkxFTkJRVU1zVFVGQlRTeE5RVUZOTEVkQlFVYzdTVUZEY0VJc1MwRkJTeXhGUVVGRkxFTkJRVU03U1VGRFVpeEpRVUZKTEVWQlFVVXNRMEZCUXp0SlFVTlFMRWRCUVVjc1JVRkJSU3hEUVVGRE8wbEJRMDRzVFVGQlRTeEZRVUZGTEVOQlFVTTdTVUZEVkN4VFFVRlRMRVZCUVVVc1EwRkJRenRKUVVOYUxFdEJRVXNzUlVGQlJTeERRVUZETzBsQlExSXNUMEZCVHl4RlFVRkZMRU5CUVVNN1NVRkRWaXhOUVVGTkxFVkJRVVVzUTBGQlF6dEpRVU5VTEdGQlFXRXNSVUZCUlN4RFFVRkRPMGxCUTJoQ0xHVkJRV1VzUlVGQlJTeEZRVUZGTzBsQlEyNUNMRmRCUVZjc1JVRkJSU3hGUVVGRk8wbEJRMllzYVVKQlFXbENMRVZCUVVVc1JVRkJSVHRKUVVOeVFpeFhRVUZYTEVWQlFVVXNSVUZCUlR0SlFVTm1MRTlCUVU4c1JVRkJSU3hGUVVGRk8wbEJRMWdzVTBGQlV5eEZRVUZGTEVWQlFVVTdTVUZEWWl4UlFVRlJMRVZCUVVVc1JVRkJSVHRKUVVOYUxHVkJRV1VzUlVGQlJTeEZRVUZGTzBOQlEzQkNMRU5CUVVNaUxDSm1hV3hsSWpvaVkyOXVjM1JoYm5SekxtcHpJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpWEc0dktpcGNiaUFxSUVCa1pYTmpjbWx3ZEdsdmJpQkJUbE5KSUdWelkyRndaU0JqYjJSbElHWnZjaUJ5WlhObGRIUnBibWNnZEdWNGRDQm1iM0p0WVhSMGFXNW5MbHh1SUNvZ1FITjFiVzFoY25rZ1ZHaHBjeUJqYjI1emRHRnVkQ0JvYjJ4a2N5QjBhR1VnUVU1VFNTQmxjMk5oY0dVZ2MyVnhkV1Z1WTJVZ2RYTmxaQ0IwYnlCeVpYTmxkQ0JoYkd3Z2RHVjRkQ0JtYjNKdFlYUjBhVzVuSUhSdklHUmxabUYxYkhRdVhHNGdLaUJBWTI5dWMzUWdRVzV6YVZKbGMyVjBYRzRnS2lCQWJXVnRZbVZ5VDJZZ2JXOWtkV3hsT2xOMGVXeGxaRk4wY21sdVoxeHVJQ292WEc1bGVIQnZjblFnWTI5dWMzUWdRVzV6YVZKbGMyVjBJRDBnWENKY1hIZ3hZbHN3YlZ3aU8xeHVYRzR2S2lwY2JpQXFJRUJrWlhOamNtbHdkR2x2YmlCVGRHRnVaR0Z5WkNCbWIzSmxaM0p2ZFc1a0lHTnZiRzl5SUdOdlpHVnpJR1p2Y2lCQlRsTkpJSFJsZUhRZ1ptOXliV0YwZEdsdVp5NWNiaUFxSUVCemRXMXRZWEo1SUZSb2FYTWdiMkpxWldOMElHMWhjSE1nWTI5c2IzSWdibUZ0WlhNZ2RHOGdkR2hsYVhJZ1kyOXljbVZ6Y0c5dVpHbHVaeUJCVGxOSklHTnZiRzl5SUdOdlpHVnpJR1p2Y2lCemRHRnVaR0Z5WkNCbWIzSmxaM0p2ZFc1a0lHTnZiRzl5Y3k1Y2JpQXFJRUJqYjI1emRDQlRkR0Z1WkdGeVpFWnZjbVZuY205MWJtUkRiMnh2Y25OY2JpQXFJRUJ3Y205d1pYSjBlU0I3Ym5WdFltVnlmU0JpYkdGamF5QXRJRUZPVTBrZ1kyOWtaU0JtYjNJZ1lteGhZMnNnZEdWNGRDQW9NekFwTGx4dUlDb2dRSEJ5YjNCbGNuUjVJSHR1ZFcxaVpYSjlJSEpsWkNBdElFRk9VMGtnWTI5a1pTQm1iM0lnY21Wa0lIUmxlSFFnS0RNeEtTNWNiaUFxSUVCd2NtOXdaWEowZVNCN2JuVnRZbVZ5ZlNCbmNtVmxiaUF0SUVGT1Uwa2dZMjlrWlNCbWIzSWdaM0psWlc0Z2RHVjRkQ0FvTXpJcExseHVJQ29nUUhCeWIzQmxjblI1SUh0dWRXMWlaWEo5SUhsbGJHeHZkeUF0SUVGT1Uwa2dZMjlrWlNCbWIzSWdlV1ZzYkc5M0lIUmxlSFFnS0RNektTNWNiaUFxSUVCd2NtOXdaWEowZVNCN2JuVnRZbVZ5ZlNCaWJIVmxJQzBnUVU1VFNTQmpiMlJsSUdadmNpQmliSFZsSUhSbGVIUWdLRE0wS1M1Y2JpQXFJRUJ3Y205d1pYSjBlU0I3Ym5WdFltVnlmU0J0WVdkbGJuUmhJQzBnUVU1VFNTQmpiMlJsSUdadmNpQnRZV2RsYm5SaElIUmxlSFFnS0RNMUtTNWNiaUFxSUVCd2NtOXdaWEowZVNCN2JuVnRZbVZ5ZlNCamVXRnVJQzBnUVU1VFNTQmpiMlJsSUdadmNpQmplV0Z1SUhSbGVIUWdLRE0yS1M1Y2JpQXFJRUJ3Y205d1pYSjBlU0I3Ym5WdFltVnlmU0IzYUdsMFpTQXRJRUZPVTBrZ1kyOWtaU0JtYjNJZ2QyaHBkR1VnZEdWNGRDQW9NemNwTGx4dUlDb2dRRzFsYldKbGNrOW1JRzF2WkhWc1pUcFRkSGxzWldSVGRISnBibWRjYmlBcUwxeHVaWGh3YjNKMElHTnZibk4wSUZOMFlXNWtZWEprUm05eVpXZHliM1Z1WkVOdmJHOXljeUE5SUh0Y2JpQWdZbXhoWTJzNklETXdMRnh1SUNCeVpXUTZJRE14TEZ4dUlDQm5jbVZsYmpvZ016SXNYRzRnSUhsbGJHeHZkem9nTXpNc1hHNGdJR0pzZFdVNklETTBMRnh1SUNCdFlXZGxiblJoT2lBek5TeGNiaUFnWTNsaGJqb2dNellzWEc0Z0lIZG9hWFJsT2lBek55eGNibjA3WEc1Y2JpOHFLbHh1SUNvZ1FHUmxjMk55YVhCMGFXOXVJRUp5YVdkb2RDQm1iM0psWjNKdmRXNWtJR052Ykc5eUlHTnZaR1Z6SUdadmNpQkJUbE5KSUhSbGVIUWdabTl5YldGMGRHbHVaeTVjYmlBcUlFQnpkVzF0WVhKNUlGUm9hWE1nYjJKcVpXTjBJRzFoY0hNZ1kyOXNiM0lnYm1GdFpYTWdkRzhnZEdobGFYSWdZMjl5Y21WemNHOXVaR2x1WnlCQlRsTkpJR052Ykc5eUlHTnZaR1Z6SUdadmNpQmljbWxuYUhRZ1ptOXlaV2R5YjNWdVpDQmpiMnh2Y25NdVhHNGdLaUJBWTI5dWMzUWdRbkpwWjJoMFJtOXlaV2R5YjNWdVpFTnZiRzl5YzF4dUlDb2dRSEJ5YjNCbGNuUjVJSHR1ZFcxaVpYSjlJR0pzWVdOcklDMGdRVTVUU1NCamIyUmxJR1p2Y2lCaWNtbG5hSFFnWW14aFkyc2dkR1Y0ZENBb09UQXBMbHh1SUNvZ1FIQnliM0JsY25SNUlIdHVkVzFpWlhKOUlISmxaQ0F0SUVGT1Uwa2dZMjlrWlNCbWIzSWdZbkpwWjJoMElISmxaQ0IwWlhoMElDZzVNU2t1WEc0Z0tpQkFjSEp2Y0dWeWRIa2dlMjUxYldKbGNuMGdaM0psWlc0Z0xTQkJUbE5KSUdOdlpHVWdabTl5SUdKeWFXZG9kQ0JuY21WbGJpQjBaWGgwSUNnNU1pa3VYRzRnS2lCQWNISnZjR1Z5ZEhrZ2UyNTFiV0psY24wZ2VXVnNiRzkzSUMwZ1FVNVRTU0JqYjJSbElHWnZjaUJpY21sbmFIUWdlV1ZzYkc5M0lIUmxlSFFnS0RrektTNWNiaUFxSUVCd2NtOXdaWEowZVNCN2JuVnRZbVZ5ZlNCaWJIVmxJQzBnUVU1VFNTQmpiMlJsSUdadmNpQmljbWxuYUhRZ1lteDFaU0IwWlhoMElDZzVOQ2t1WEc0Z0tpQkFjSEp2Y0dWeWRIa2dlMjUxYldKbGNuMGdiV0ZuWlc1MFlTQXRJRUZPVTBrZ1kyOWtaU0JtYjNJZ1luSnBaMmgwSUcxaFoyVnVkR0VnZEdWNGRDQW9PVFVwTGx4dUlDb2dRSEJ5YjNCbGNuUjVJSHR1ZFcxaVpYSjlJR041WVc0Z0xTQkJUbE5KSUdOdlpHVWdabTl5SUdKeWFXZG9kQ0JqZVdGdUlIUmxlSFFnS0RrMktTNWNiaUFxSUVCd2NtOXdaWEowZVNCN2JuVnRZbVZ5ZlNCM2FHbDBaU0F0SUVGT1Uwa2dZMjlrWlNCbWIzSWdZbkpwWjJoMElIZG9hWFJsSUhSbGVIUWdLRGszS1M1Y2JpQXFJRUJ0WlcxaVpYSlBaaUJ0YjJSMWJHVTZRRk4wZVd4bFpGTjBjbWx1WjF4dUlDb3ZYRzVsZUhCdmNuUWdZMjl1YzNRZ1FuSnBaMmgwUm05eVpXZHliM1Z1WkVOdmJHOXljeUE5SUh0Y2JpQWdZbkpwWjJoMFFteGhZMnM2SURrd0xGeHVJQ0JpY21sbmFIUlNaV1E2SURreExGeHVJQ0JpY21sbmFIUkhjbVZsYmpvZ09USXNYRzRnSUdKeWFXZG9kRmxsYkd4dmR6b2dPVE1zWEc0Z0lHSnlhV2RvZEVKc2RXVTZJRGswTEZ4dUlDQmljbWxuYUhSTllXZGxiblJoT2lBNU5TeGNiaUFnWW5KcFoyaDBRM2xoYmpvZ09UWXNYRzRnSUdKeWFXZG9kRmRvYVhSbE9pQTVOeXhjYm4wN1hHNWNiaThxS2x4dUlDb2dRR1JsYzJOeWFYQjBhVzl1SUZOMFlXNWtZWEprSUdKaFkydG5jbTkxYm1RZ1kyOXNiM0lnWTI5a1pYTWdabTl5SUVGT1Uwa2dkR1Y0ZENCbWIzSnRZWFIwYVc1bkxseHVJQ29nUUhOMWJXMWhjbmtnVkdocGN5QnZZbXBsWTNRZ2JXRndjeUJqYjJ4dmNpQnVZVzFsY3lCMGJ5QjBhR1ZwY2lCamIzSnlaWE53YjI1a2FXNW5JRUZPVTBrZ1kyOXNiM0lnWTI5a1pYTWdabTl5SUhOMFlXNWtZWEprSUdKaFkydG5jbTkxYm1RZ1kyOXNiM0p6TGx4dUlDb2dRR052Ym5OMElGTjBZVzVrWVhKa1FtRmphMmR5YjNWdVpFTnZiRzl5YzF4dUlDb2dRSEJ5YjNCbGNuUjVJSHR1ZFcxaVpYSjlJR0puUW14aFkyc2dMU0JCVGxOSklHTnZaR1VnWm05eUlHSnNZV05ySUdKaFkydG5jbTkxYm1RZ0tEUXdLUzVjYmlBcUlFQndjbTl3WlhKMGVTQjdiblZ0WW1WeWZTQmlaMUpsWkNBdElFRk9VMGtnWTI5a1pTQm1iM0lnY21Wa0lHSmhZMnRuY205MWJtUWdLRFF4S1M1Y2JpQXFJRUJ3Y205d1pYSjBlU0I3Ym5WdFltVnlmU0JpWjBkeVpXVnVJQzBnUVU1VFNTQmpiMlJsSUdadmNpQm5jbVZsYmlCaVlXTnJaM0p2ZFc1a0lDZzBNaWt1WEc0Z0tpQkFjSEp2Y0dWeWRIa2dlMjUxYldKbGNuMGdZbWRaWld4c2IzY2dMU0JCVGxOSklHTnZaR1VnWm05eUlIbGxiR3h2ZHlCaVlXTnJaM0p2ZFc1a0lDZzBNeWt1WEc0Z0tpQkFjSEp2Y0dWeWRIa2dlMjUxYldKbGNuMGdZbWRDYkhWbElDMGdRVTVUU1NCamIyUmxJR1p2Y2lCaWJIVmxJR0poWTJ0bmNtOTFibVFnS0RRMEtTNWNiaUFxSUVCd2NtOXdaWEowZVNCN2JuVnRZbVZ5ZlNCaVowMWhaMlZ1ZEdFZ0xTQkJUbE5KSUdOdlpHVWdabTl5SUcxaFoyVnVkR0VnWW1GamEyZHliM1Z1WkNBb05EVXBMbHh1SUNvZ1FIQnliM0JsY25SNUlIdHVkVzFpWlhKOUlHSm5RM2xoYmlBdElFRk9VMGtnWTI5a1pTQm1iM0lnWTNsaGJpQmlZV05yWjNKdmRXNWtJQ2cwTmlrdVhHNGdLaUJBY0hKdmNHVnlkSGtnZTI1MWJXSmxjbjBnWW1kWGFHbDBaU0F0SUVGT1Uwa2dZMjlrWlNCbWIzSWdkMmhwZEdVZ1ltRmphMmR5YjNWdVpDQW9ORGNwTGx4dUlDb2dRRzFsYldKbGNrOW1JRzF2WkhWc1pUcEFVM1I1YkdWa1UzUnlhVzVuWEc0Z0tpOWNibVY0Y0c5eWRDQmpiMjV6ZENCVGRHRnVaR0Z5WkVKaFkydG5jbTkxYm1SRGIyeHZjbk1nUFNCN1hHNGdJR0puUW14aFkyczZJRFF3TEZ4dUlDQmlaMUpsWkRvZ05ERXNYRzRnSUdKblIzSmxaVzQ2SURReUxGeHVJQ0JpWjFsbGJHeHZkem9nTkRNc1hHNGdJR0puUW14MVpUb2dORFFzWEc0Z0lHSm5UV0ZuWlc1MFlUb2dORFVzWEc0Z0lHSm5RM2xoYmpvZ05EWXNYRzRnSUdKblYyaHBkR1U2SURRM0xGeHVmVHRjYmx4dUx5b3FYRzRnS2lCQVpHVnpZM0pwY0hScGIyNGdRbkpwWjJoMElHSmhZMnRuY205MWJtUWdZMjlzYjNJZ1kyOWtaWE1nWm05eUlFRk9VMGtnZEdWNGRDQm1iM0p0WVhSMGFXNW5MbHh1SUNvZ1FITjFiVzFoY25rZ1ZHaHBjeUJ2WW1wbFkzUWdiV0Z3Y3lCamIyeHZjaUJ1WVcxbGN5QjBieUIwYUdWcGNpQmpiM0p5WlhOd2IyNWthVzVuSUVGT1Uwa2dZMjlzYjNJZ1kyOWtaWE1nWm05eUlHSnlhV2RvZENCaVlXTnJaM0p2ZFc1a0lHTnZiRzl5Y3k1Y2JpQXFJRUJqYjI1emRDQkNjbWxuYUhSQ1lXTnJaM0p2ZFc1a1EyOXNiM0p6WEc0Z0tpQkFjSEp2Y0dWeWRIa2dlMjUxYldKbGNuMGdZbWRDY21sbmFIUkNiR0ZqYXlBdElFRk9VMGtnWTI5a1pTQm1iM0lnWW5KcFoyaDBJR0pzWVdOcklHSmhZMnRuY205MWJtUWdLREV3TUNrdVhHNGdLaUJBY0hKdmNHVnlkSGtnZTI1MWJXSmxjbjBnWW1kQ2NtbG5hSFJTWldRZ0xTQkJUbE5KSUdOdlpHVWdabTl5SUdKeWFXZG9kQ0J5WldRZ1ltRmphMmR5YjNWdVpDQW9NVEF4S1M1Y2JpQXFJRUJ3Y205d1pYSjBlU0I3Ym5WdFltVnlmU0JpWjBKeWFXZG9kRWR5WldWdUlDMGdRVTVUU1NCamIyUmxJR1p2Y2lCaWNtbG5hSFFnWjNKbFpXNGdZbUZqYTJkeWIzVnVaQ0FvTVRBeUtTNWNiaUFxSUVCd2NtOXdaWEowZVNCN2JuVnRZbVZ5ZlNCaVowSnlhV2RvZEZsbGJHeHZkeUF0SUVGT1Uwa2dZMjlrWlNCbWIzSWdZbkpwWjJoMElIbGxiR3h2ZHlCaVlXTnJaM0p2ZFc1a0lDZ3hNRE1wTGx4dUlDb2dRSEJ5YjNCbGNuUjVJSHR1ZFcxaVpYSjlJR0puUW5KcFoyaDBRbXgxWlNBdElFRk9VMGtnWTI5a1pTQm1iM0lnWW5KcFoyaDBJR0pzZFdVZ1ltRmphMmR5YjNWdVpDQW9NVEEwS1M1Y2JpQXFJRUJ3Y205d1pYSjBlU0I3Ym5WdFltVnlmU0JpWjBKeWFXZG9kRTFoWjJWdWRHRWdMU0JCVGxOSklHTnZaR1VnWm05eUlHSnlhV2RvZENCdFlXZGxiblJoSUdKaFkydG5jbTkxYm1RZ0tERXdOU2t1WEc0Z0tpQkFjSEp2Y0dWeWRIa2dlMjUxYldKbGNuMGdZbWRDY21sbmFIUkRlV0Z1SUMwZ1FVNVRTU0JqYjJSbElHWnZjaUJpY21sbmFIUWdZM2xoYmlCaVlXTnJaM0p2ZFc1a0lDZ3hNRFlwTGx4dUlDb2dRSEJ5YjNCbGNuUjVJSHR1ZFcxaVpYSjlJR0puUW5KcFoyaDBWMmhwZEdVZ0xTQkJUbE5KSUdOdlpHVWdabTl5SUdKeWFXZG9kQ0IzYUdsMFpTQmlZV05yWjNKdmRXNWtJQ2d4TURjcExseHVJQ29nUUcxbGJXSmxjazltSUcxdlpIVnNaVHBBVTNSNWJHVmtVM1J5YVc1blhHNGdLaTljYm1WNGNHOXlkQ0JqYjI1emRDQkNjbWxuYUhSQ1lXTnJaM0p2ZFc1a1EyOXNiM0p6SUQwZ2UxeHVJQ0JpWjBKeWFXZG9kRUpzWVdOck9pQXhNREFzWEc0Z0lHSm5RbkpwWjJoMFVtVmtPaUF4TURFc1hHNGdJR0puUW5KcFoyaDBSM0psWlc0NklERXdNaXhjYmlBZ1ltZENjbWxuYUhSWlpXeHNiM2M2SURFd015eGNiaUFnWW1kQ2NtbG5hSFJDYkhWbE9pQXhNRFFzWEc0Z0lHSm5RbkpwWjJoMFRXRm5aVzUwWVRvZ01UQTFMRnh1SUNCaVowSnlhV2RvZEVONVlXNDZJREV3Tml4Y2JpQWdZbWRDY21sbmFIUlhhR2wwWlRvZ01UQTNMRnh1ZlR0Y2JseHVMeW9xWEc0Z0tpQkFaR1Z6WTNKcGNIUnBiMjRnVkdWNGRDQnpkSGxzWlNCamIyUmxjeUJtYjNJZ1FVNVRTU0IwWlhoMElHWnZjbTFoZEhScGJtY3VYRzRnS2lCQWMzVnRiV0Z5ZVNCVWFHbHpJRzlpYW1WamRDQnRZWEJ6SUhOMGVXeGxJRzVoYldWeklIUnZJSFJvWldseUlHTnZjbkpsYzNCdmJtUnBibWNnUVU1VFNTQmpiMlJsY3lCbWIzSWdkbUZ5YVc5MWN5QjBaWGgwSUhOMGVXeGxjeTVjYmlBcUlFQmpiMjV6ZENCemRIbHNaWE5jYmlBcUlFQndjbTl3WlhKMGVTQjdiblZ0WW1WeWZTQnlaWE5sZENBdElFRk9VMGtnWTI5a1pTQjBieUJ5WlhObGRDQmhiR3dnYzNSNWJHVnpJQ2d3S1M1Y2JpQXFJRUJ3Y205d1pYSjBlU0I3Ym5WdFltVnlmU0JpYjJ4a0lDMGdRVTVUU1NCamIyUmxJR1p2Y2lCaWIyeGtJSFJsZUhRZ0tERXBMbHh1SUNvZ1FIQnliM0JsY25SNUlIdHVkVzFpWlhKOUlHUnBiU0F0SUVGT1Uwa2dZMjlrWlNCbWIzSWdaR2x0SUhSbGVIUWdLRElwTGx4dUlDb2dRSEJ5YjNCbGNuUjVJSHR1ZFcxaVpYSjlJR2wwWVd4cFl5QXRJRUZPVTBrZ1kyOWtaU0JtYjNJZ2FYUmhiR2xqSUhSbGVIUWdLRE1wTGx4dUlDb2dRSEJ5YjNCbGNuUjVJSHR1ZFcxaVpYSjlJSFZ1WkdWeWJHbHVaU0F0SUVGT1Uwa2dZMjlrWlNCbWIzSWdkVzVrWlhKc2FXNWxaQ0IwWlhoMElDZzBLUzVjYmlBcUlFQndjbTl3WlhKMGVTQjdiblZ0WW1WeWZTQmliR2x1YXlBdElFRk9VMGtnWTI5a1pTQm1iM0lnWW14cGJtdHBibWNnZEdWNGRDQW9OU2t1WEc0Z0tpQkFjSEp2Y0dWeWRIa2dlMjUxYldKbGNuMGdhVzUyWlhKelpTQXRJRUZPVTBrZ1kyOWtaU0JtYjNJZ2FXNTJaWEp6WlNCamIyeHZjbk1nS0RjcExseHVJQ29nUUhCeWIzQmxjblI1SUh0dWRXMWlaWEo5SUdocFpHUmxiaUF0SUVGT1Uwa2dZMjlrWlNCbWIzSWdhR2xrWkdWdUlIUmxlSFFnS0RncExseHVJQ29nUUhCeWIzQmxjblI1SUh0dWRXMWlaWEo5SUhOMGNtbHJaWFJvY205MVoyZ2dMU0JCVGxOSklHTnZaR1VnWm05eUlITjBjbWxyWlhSb2NtOTFaMmdnZEdWNGRDQW9PU2t1WEc0Z0tpQkFjSEp2Y0dWeWRIa2dlMjUxYldKbGNuMGdaRzkxWW14bFZXNWtaWEpzYVc1bElDMGdRVTVUU1NCamIyUmxJR1p2Y2lCa2IzVmliR1VnZFc1a1pYSnNhVzVsWkNCMFpYaDBJQ2d5TVNrdVhHNGdLaUJBY0hKdmNHVnlkSGtnZTI1MWJXSmxjbjBnYm05eWJXRnNRMjlzYjNJZ0xTQkJUbE5KSUdOdlpHVWdkRzhnY21WelpYUWdZMjlzYjNJZ2RHOGdibTl5YldGc0lDZ3lNaWt1WEc0Z0tpQkFjSEp2Y0dWeWRIa2dlMjUxYldKbGNuMGdibTlKZEdGc2FXTlBja1p5WVd0MGRYSWdMU0JCVGxOSklHTnZaR1VnZEc4Z2RIVnliaUJ2Wm1ZZ2FYUmhiR2xqSUNneU15a3VYRzRnS2lCQWNISnZjR1Z5ZEhrZ2UyNTFiV0psY24wZ2JtOVZibVJsY214cGJtVWdMU0JCVGxOSklHTnZaR1VnZEc4Z2RIVnliaUJ2Wm1ZZ2RXNWtaWEpzYVc1bElDZ3lOQ2t1WEc0Z0tpQkFjSEp2Y0dWeWRIa2dlMjUxYldKbGNuMGdibTlDYkdsdWF5QXRJRUZPVTBrZ1kyOWtaU0IwYnlCMGRYSnVJRzltWmlCaWJHbHVheUFvTWpVcExseHVJQ29nUUhCeWIzQmxjblI1SUh0dWRXMWlaWEo5SUc1dlNXNTJaWEp6WlNBdElFRk9VMGtnWTI5a1pTQjBieUIwZFhKdUlHOW1aaUJwYm5abGNuTmxJQ2d5TnlrdVhHNGdLaUJBY0hKdmNHVnlkSGtnZTI1MWJXSmxjbjBnYm05SWFXUmtaVzRnTFNCQlRsTkpJR052WkdVZ2RHOGdkSFZ5YmlCdlptWWdhR2xrWkdWdUlDZ3lPQ2t1WEc0Z0tpQkFjSEp2Y0dWeWRIa2dlMjUxYldKbGNuMGdibTlUZEhKcGEyVjBhSEp2ZFdkb0lDMGdRVTVUU1NCamIyUmxJSFJ2SUhSMWNtNGdiMlptSUhOMGNtbHJaWFJvY205MVoyZ2dLREk1S1M1Y2JpQXFJRUJ0WlcxaVpYSlBaaUJ0YjJSMWJHVTZRRk4wZVd4bFpGTjBjbWx1WjF4dUlDb3ZYRzVsZUhCdmNuUWdZMjl1YzNRZ2MzUjViR1Z6SUQwZ2UxeHVJQ0J5WlhObGREb2dNQ3hjYmlBZ1ltOXNaRG9nTVN4Y2JpQWdaR2x0T2lBeUxGeHVJQ0JwZEdGc2FXTTZJRE1zWEc0Z0lIVnVaR1Z5YkdsdVpUb2dOQ3hjYmlBZ1lteHBibXM2SURVc1hHNGdJR2x1ZG1WeWMyVTZJRGNzWEc0Z0lHaHBaR1JsYmpvZ09DeGNiaUFnYzNSeWFXdGxkR2h5YjNWbmFEb2dPU3hjYmlBZ1pHOTFZbXhsVlc1a1pYSnNhVzVsT2lBeU1TeGNiaUFnYm05eWJXRnNRMjlzYjNJNklESXlMRnh1SUNCdWIwbDBZV3hwWTA5eVJuSmhhM1IxY2pvZ01qTXNYRzRnSUc1dlZXNWtaWEpzYVc1bE9pQXlOQ3hjYmlBZ2JtOUNiR2x1YXpvZ01qVXNYRzRnSUc1dlNXNTJaWEp6WlRvZ01qY3NYRzRnSUc1dlNHbGtaR1Z1T2lBeU9DeGNiaUFnYm05VGRISnBhMlYwYUhKdmRXZG9PaUF5T1N4Y2JuMDdYRzRpWFgwPVxuIiwiaW1wb3J0IHsgQW5zaVJlc2V0LCBzdHlsZXMgfSBmcm9tIFwiLi9jb25zdGFudHNcIjtcbi8qKlxuICogQGRlc2NyaXB0aW9uIEFwcGxpZXMgYSBiYXNpYyBBTlNJIGNvbG9yIGNvZGUgdG8gdGV4dC5cbiAqIEBzdW1tYXJ5IFRoaXMgZnVuY3Rpb24gdGFrZXMgYSBzdHJpbmcsIGFuIEFOU0kgY29sb3IgY29kZSBudW1iZXIsIGFuZCBhbiBvcHRpb25hbCBiYWNrZ3JvdW5kIGZsYWcuXG4gKiBJdCByZXR1cm5zIHRoZSB0ZXh0IHdyYXBwZWQgaW4gdGhlIGFwcHJvcHJpYXRlIEFOU0kgZXNjYXBlIGNvZGVzIGZvciBlaXRoZXIgZm9yZWdyb3VuZCBvciBiYWNrZ3JvdW5kIGNvbG9yaW5nLlxuICogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIGZvciBiYXNpYyAxNi1jb2xvciBBTlNJIGZvcm1hdHRpbmcuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgLSBUaGUgdGV4dCB0byBiZSBjb2xvcmVkLlxuICogQHBhcmFtIHtudW1iZXJ9IG4gLSBUaGUgQU5TSSBjb2xvciBjb2RlIG51bWJlci5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2JnPWZhbHNlXSAtIElmIHRydWUsIGFwcGxpZXMgdGhlIGNvbG9yIHRvIHRoZSBiYWNrZ3JvdW5kIGluc3RlYWQgb2YgdGhlIGZvcmVncm91bmQuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSB0ZXh0IHdyYXBwZWQgaW4gQU5TSSBjb2xvciBjb2Rlcy5cbiAqXG4gKiBAZnVuY3Rpb24gY29sb3JpemVBTlNJXG4gKiBAbWVtYmVyT2YgbW9kdWxlOkBTdHlsZWRTdHJpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbG9yaXplQU5TSSh0ZXh0LCBuLCBiZyA9IGZhbHNlKSB7XG4gICAgaWYgKGlzTmFOKG4pKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgSW52YWxpZCBjb2xvciBudW1iZXIgb24gdGhlIEFOU0kgc2NhbGU6ICR7bn0uIGlnbm9yaW5nLi4uYCk7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cbiAgICBpZiAoYmcgJiYgKChuID4gMzAgJiYgbiA8PSA0MClcbiAgICAgICAgfHwgKG4gPiA5MCAmJiBuIDw9IDEwMCkpKSB7XG4gICAgICAgIG4gPSBuICsgMTA7XG4gICAgfVxuICAgIHJldHVybiBgXFx4MWJbJHtufW0ke3RleHR9JHtBbnNpUmVzZXR9YDtcbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uIEFwcGxpZXMgYSAyNTYtY29sb3IgQU5TSSBjb2RlIHRvIHRleHQuXG4gKiBAc3VtbWFyeSBUaGlzIGZ1bmN0aW9uIHRha2VzIGEgc3RyaW5nIGFuZCBhIGNvbG9yIG51bWJlciAoMC0yNTUpIGFuZCByZXR1cm5zIHRoZSB0ZXh0XG4gKiB3cmFwcGVkIGluIEFOU0kgZXNjYXBlIGNvZGVzIGZvciBlaXRoZXIgZm9yZWdyb3VuZCBvciBiYWNrZ3JvdW5kIGNvbG9yaW5nLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gVGhlIHRleHQgdG8gYmUgY29sb3JlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBuIC0gVGhlIGNvbG9yIG51bWJlciAoMC0yNTUpLlxuICogQHBhcmFtIHtib29sZWFufSBbYmc9ZmFsc2VdIC0gSWYgdHJ1ZSwgYXBwbGllcyB0aGUgY29sb3IgdG8gdGhlIGJhY2tncm91bmQgaW5zdGVhZCBvZiB0aGUgZm9yZWdyb3VuZC5cbiAqIEByZXR1cm4ge3N0cmluZ30gVGhlIHRleHQgd3JhcHBlZCBpbiBBTlNJIGNvbG9yIGNvZGVzLlxuICpcbiAqIEBmdW5jdGlvbiBjb2xvcml6ZTI1NlxuICogQG1lbWJlck9mIG1vZHVsZTpAU3R5bGVkU3RyaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb2xvcml6ZTI1Nih0ZXh0LCBuLCBiZyA9IGZhbHNlKSB7XG4gICAgaWYgKGlzTmFOKG4pKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgSW52YWxpZCBjb2xvciBudW1iZXIgb24gdGhlIDI1NiBzY2FsZTogJHtufS4gaWdub3JpbmcuLi5gKTtcbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICAgIGlmIChuIDwgMCB8fCBuID4gMjU1KSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgSW52YWxpZCBjb2xvciBudW1iZXIgb24gdGhlIDI1NiBzY2FsZTogJHtufS4gaWdub3JpbmcuLi5gKTtcbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICAgIHJldHVybiBgXFx4MWJbJHtiZyA/IDQ4IDogMzh9OzU7JHtufW0ke3RleHR9JHtBbnNpUmVzZXR9YDtcbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uIEFwcGxpZXMgYW4gUkdCIGNvbG9yIEFOU0kgY29kZSB0byB0ZXh0LlxuICogQHN1bW1hcnkgVGhpcyBmdW5jdGlvbiB0YWtlcyBhIHN0cmluZyBhbmQgUkdCIGNvbG9yIHZhbHVlcyAoMC0yNTUgZm9yIGVhY2ggY29tcG9uZW50KVxuICogYW5kIHJldHVybnMgdGhlIHRleHQgd3JhcHBlZCBpbiBBTlNJIGVzY2FwZSBjb2RlcyBmb3IgZWl0aGVyIGZvcmVncm91bmQgb3IgYmFja2dyb3VuZCBjb2xvcmluZy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRoZSB0ZXh0IHRvIGJlIGNvbG9yZWQuXG4gKiBAcGFyYW0ge251bWJlcn0gciAtIFRoZSByZWQgY29tcG9uZW50IG9mIHRoZSBjb2xvciAoMC0yNTUpLlxuICogQHBhcmFtIHtudW1iZXJ9IGcgLSBUaGUgZ3JlZW4gY29tcG9uZW50IG9mIHRoZSBjb2xvciAoMC0yNTUpLlxuICogQHBhcmFtIHtudW1iZXJ9IGIgLSBUaGUgYmx1ZSBjb21wb25lbnQgb2YgdGhlIGNvbG9yICgwLTI1NSkuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtiZz1mYWxzZV0gLSBJZiB0cnVlLCBhcHBsaWVzIHRoZSBjb2xvciB0byB0aGUgYmFja2dyb3VuZCBpbnN0ZWFkIG9mIHRoZSBmb3JlZ3JvdW5kLlxuICogQHJldHVybiB7c3RyaW5nfSBUaGUgdGV4dCB3cmFwcGVkIGluIEFOU0kgY29sb3IgY29kZXMuXG4gKlxuICogQGZ1bmN0aW9uIGNvbG9yaXplUkdCXG4gKiBAbWVtYmVyT2YgbW9kdWxlOlN0eWxlZFN0cmluZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gY29sb3JpemVSR0IodGV4dCwgciwgZywgYiwgYmcgPSBmYWxzZSkge1xuICAgIGlmIChpc05hTihyKSB8fCBpc05hTihnKSB8fCBpc05hTihiKSkge1xuICAgICAgICBjb25zb2xlLndhcm4oYEludmFsaWQgUkdCIGNvbG9yIHZhbHVlczogcj0ke3J9LCBnPSR7Z30sIGI9JHtifS4gSWdub3JpbmcuLi5gKTtcbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICAgIGlmIChbciwgZywgYl0uc29tZSh2ID0+IHYgPCAwIHx8IHYgPiAyNTUpKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgSW52YWxpZCBSR0IgY29sb3IgdmFsdWVzOiByPSR7cn0sIGc9JHtnfSwgYj0ke2J9LiBJZ25vcmluZy4uLmApO1xuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gICAgcmV0dXJuIGBcXHgxYlske2JnID8gNDggOiAzOH07Mjske3J9OyR7Z307JHtifW0ke3RleHR9JHtBbnNpUmVzZXR9YDtcbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uIEFwcGxpZXMgYW4gQU5TSSBzdHlsZSBjb2RlIHRvIHRleHQuXG4gKiBAc3VtbWFyeSBUaGlzIGZ1bmN0aW9uIHRha2VzIGEgc3RyaW5nIGFuZCBhIHN0eWxlIGNvZGUgKGVpdGhlciBhIG51bWJlciBvciBhIGtleSBmcm9tIHRoZSBzdHlsZXMgb2JqZWN0KVxuICogYW5kIHJldHVybnMgdGhlIHRleHQgd3JhcHBlZCBpbiB0aGUgYXBwcm9wcmlhdGUgQU5TSSBlc2NhcGUgY29kZXMgZm9yIHRoYXQgc3R5bGUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgLSBUaGUgdGV4dCB0byBiZSBzdHlsZWQuXG4gKiBAcGFyYW0ge251bWJlciB8IHN0cmluZ30gbiAtIFRoZSBzdHlsZSBjb2RlIG9yIHN0eWxlIG5hbWUuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSB0ZXh0IHdyYXBwZWQgaW4gQU5TSSBzdHlsZSBjb2Rlcy5cbiAqXG4gKiBAZnVuY3Rpb24gYXBwbHlTdHlsZVxuICogQG1lbWJlck9mIG1vZHVsZTpTdHlsZWRTdHJpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5U3R5bGUodGV4dCwgbikge1xuICAgIGNvbnN0IHN0eWxlQ29kZSA9IHR5cGVvZiBuID09PSBcIm51bWJlclwiID8gbiA6IHN0eWxlc1tuXTtcbiAgICByZXR1cm4gYFxceDFiWyR7c3R5bGVDb2RlfW0ke3RleHR9JHtBbnNpUmVzZXR9YDtcbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uIFJlbW92ZXMgYWxsIEFOU0kgZm9ybWF0dGluZyBjb2RlcyBmcm9tIHRleHQuXG4gKiBAc3VtbWFyeSBUaGlzIGZ1bmN0aW9uIHRha2VzIGEgc3RyaW5nIHRoYXQgbWF5IGNvbnRhaW4gQU5TSSBlc2NhcGUgY29kZXMgZm9yIGZvcm1hdHRpbmdcbiAqIGFuZCByZXR1cm5zIGEgbmV3IHN0cmluZyB3aXRoIGFsbCBzdWNoIGNvZGVzIHJlbW92ZWQsIGxlYXZpbmcgb25seSB0aGUgcGxhaW4gdGV4dCBjb250ZW50LlxuICogSXQgdXNlcyBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBtYXRjaCBhbmQgcmVtb3ZlIEFOU0kgZXNjYXBlIHNlcXVlbmNlcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRoZSB0ZXh0IHBvdGVudGlhbGx5IGNvbnRhaW5pbmcgQU5TSSBmb3JtYXR0aW5nIGNvZGVzLlxuICogQHJldHVybiB7c3RyaW5nfSBUaGUgaW5wdXQgdGV4dCB3aXRoIGFsbCBBTlNJIGZvcm1hdHRpbmcgY29kZXMgcmVtb3ZlZC5cbiAqXG4gKiBAZnVuY3Rpb24gY2xlYXJcbiAqIEBtZW1iZXJPZiBtb2R1bGU6U3R5bGVkU3RyaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGVhcih0ZXh0KSB7XG4gICAgLy8gUmVndWxhciBleHByZXNzaW9uIHRvIG1hdGNoIEFOU0kgZXNjYXBlIGNvZGVzXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnRyb2wtcmVnZXhcbiAgICBjb25zdCBhbnNpUmVnZXggPSAvXFx4MUIoPzpbQC1aXFxcXC1fXXxcXFtbMC0/XSpbIC0vXSpbQC1+XSkvZztcbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKGFuc2lSZWdleCwgJycpO1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gQXBwbGllcyByYXcgQU5TSSBlc2NhcGUgY29kZXMgdG8gdGV4dC5cbiAqIEBzdW1tYXJ5IFRoaXMgZnVuY3Rpb24gdGFrZXMgYSBzdHJpbmcgYW5kIGEgcmF3IEFOU0kgZXNjYXBlIGNvZGUsIGFuZCByZXR1cm5zIHRoZSB0ZXh0XG4gKiB3cmFwcGVkIGluIHRoZSBwcm92aWRlZCByYXcgQU5TSSBjb2RlIGFuZCB0aGUgcmVzZXQgY29kZS4gVGhpcyBhbGxvd3MgZm9yIGFwcGx5aW5nIGN1c3RvbVxuICogb3IgY29tcGxleCBBTlNJIGZvcm1hdHRpbmcgdGhhdCBtYXkgbm90IGJlIGNvdmVyZWQgYnkgb3RoZXIgdXRpbGl0eSBmdW5jdGlvbnMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgLSBUaGUgdGV4dCB0byBiZSBmb3JtYXR0ZWQuXG4gKiBAcGFyYW0ge3N0cmluZ30gcmF3IC0gVGhlIHJhdyBBTlNJIGVzY2FwZSBjb2RlIHRvIGJlIGFwcGxpZWQuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSB0ZXh0IHdyYXBwZWQgaW4gdGhlIHJhdyBBTlNJIGNvZGUgYW5kIHRoZSByZXNldCBjb2RlLlxuICpcbiAqIEBmdW5jdGlvbiByYXdcbiAqIEBtZW1iZXJPZiBtb2R1bGU6U3R5bGVkU3RyaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByYXcodGV4dCwgcmF3KSB7XG4gICAgcmV0dXJuIGAke3Jhd30ke3RleHR9JHtBbnNpUmVzZXR9YDtcbn1cblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbk55WXk5amIyeHZjbk11ZEhNaVhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWtGQlFVRXNUMEZCVHl4RlFVRkZMRk5CUVZNc1JVRkJSU3hOUVVGTkxFVkJRVVVzVFVGQlRTeGhRVUZoTEVOQlFVTTdRVUZIYUVRN096czdPenM3T3pzN096czdSMEZoUnp0QlFVTklMRTFCUVUwc1ZVRkJWU3haUVVGWkxFTkJRVU1zU1VGQldTeEZRVUZGTEVOQlFWTXNSVUZCUlN4RlFVRkZMRWRCUVVjc1MwRkJTenRKUVVVNVJDeEpRVUZKTEV0QlFVc3NRMEZCUXl4RFFVRkRMRU5CUVVNc1JVRkJReXhEUVVGRE8xRkJRMW9zVDBGQlR5eERRVUZETEVsQlFVa3NRMEZCUXl3eVEwRkJNa01zUTBGQlF5eGxRVUZsTEVOQlFVTXNRMEZCUXp0UlFVTXhSU3hQUVVGUExFbEJRVWtzUTBGQlF6dEpRVU5rTEVOQlFVTTdTVUZEUkN4SlFVRkpMRVZCUVVVc1NVRkJTU3hEUVVOU0xFTkJRVU1zUTBGQlF5eEhRVUZITEVWQlFVVXNTVUZCU1N4RFFVRkRMRWxCUVVrc1JVRkJSU3hEUVVGRE8xZEJRMmhDTEVOQlFVTXNRMEZCUXl4SFFVRkhMRVZCUVVVc1NVRkJTU3hEUVVGRExFbEJRVWtzUjBGQlJ5eERRVUZETEVOQlFVVXNSVUZCUXl4RFFVRkRPMUZCUXpOQ0xFTkJRVU1zUjBGQlJ5eERRVUZETEVkQlFVY3NSVUZCUlN4RFFVRkJPMGxCUTFvc1EwRkJRenRKUVVORUxFOUJRVThzVVVGQlVTeERRVUZETEVsQlFVa3NTVUZCU1N4SFFVRkhMRk5CUVZNc1JVRkJSU3hEUVVGRE8wRkJSWHBETEVOQlFVTTdRVUZIUkRzN096czdPenM3T3pzN08wZEJXVWM3UVVGRFNDeE5RVUZOTEZWQlFWVXNWMEZCVnl4RFFVRkRMRWxCUVZrc1JVRkJSU3hEUVVGVExFVkJRVVVzUlVGQlJTeEhRVUZITEV0QlFVczdTVUZGTjBRc1NVRkJTU3hMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETEVWQlFVTXNRMEZCUXp0UlFVTmFMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zTUVOQlFUQkRMRU5CUVVNc1pVRkJaU3hEUVVGRExFTkJRVU03VVVGRGVrVXNUMEZCVHl4SlFVRkpMRU5CUVVNN1NVRkRaQ3hEUVVGRE8wbEJRMFFzU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkJSeXhIUVVGSExFVkJRVVVzUTBGQlF6dFJRVU55UWl4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExEQkRRVUV3UXl4RFFVRkRMR1ZCUVdVc1EwRkJReXhEUVVGRE8xRkJRM3BGTEU5QlFVOHNTVUZCU1N4RFFVRkRPMGxCUTJRc1EwRkJRenRKUVVORUxFOUJRVThzVVVGQlVTeEZRVUZGTEVOQlFVTXNRMEZCUXl4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRExFTkJRVU1zUlVGQlJTeE5RVUZOTEVOQlFVTXNTVUZCU1N4SlFVRkpMRWRCUVVjc1UwRkJVeXhGUVVGRkxFTkJRVU03UVVGRE0wUXNRMEZCUXp0QlFVVkVPenM3T3pzN096czdPenM3T3p0SFFXTkhPMEZCUTBnc1RVRkJUU3hWUVVGVkxGZEJRVmNzUTBGQlF5eEpRVUZaTEVWQlFVVXNRMEZCVXl4RlFVRkZMRU5CUVZNc1JVRkJSU3hEUVVGVExFVkJRVVVzUlVGQlJTeEhRVUZITEV0QlFVczdTVUZEYmtZc1NVRkJTU3hMUVVGTExFTkJRVU1zUTBGQlF5eERRVUZETEVsQlFVa3NTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJReXhKUVVGSkxFdEJRVXNzUTBGQlF5eERRVUZETEVOQlFVTXNSVUZCUXl4RFFVRkRPMUZCUTNCRExFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNLMEpCUVN0Q0xFTkJRVU1zVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4bFFVRmxMRU5CUVVNc1EwRkJRenRSUVVNNVJTeFBRVUZQTEVsQlFVa3NRMEZCUXp0SlFVTmtMRU5CUVVNN1NVRkRSQ3hKUVVGSkxFTkJRVU1zUTBGQlF5eEZRVUZGTEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF5eERRVUZETEVWQlFVVXNRMEZCUXl4RFFVRkRMRWRCUVVjc1EwRkJReXhKUVVGSkxFTkJRVU1zUjBGQlJ5eEhRVUZITEVOQlFVTXNSVUZCUlN4RFFVRkRPMUZCUXpGRExFOUJRVThzUTBGQlF5eEpRVUZKTEVOQlFVTXNLMEpCUVN0Q0xFTkJRVU1zVDBGQlR5eERRVUZETEU5QlFVOHNRMEZCUXl4bFFVRmxMRU5CUVVNc1EwRkJRenRSUVVNNVJTeFBRVUZQTEVsQlFVa3NRMEZCUXp0SlFVTmtMRU5CUVVNN1NVRkRSQ3hQUVVGUExGRkJRVkVzUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUXl4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGRExFVkJRVVVzVFVGQlRTeERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hKUVVGSkxFZEJRVWNzVTBGQlV5eEZRVUZGTEVOQlFVTTdRVUZEY2tVc1EwRkJRenRCUVVWRU96czdPenM3T3pzN096dEhRVmRITzBGQlEwZ3NUVUZCVFN4VlFVRlZMRlZCUVZVc1EwRkJReXhKUVVGWkxFVkJRVVVzUTBGQkswSTdTVUZEZEVVc1RVRkJUU3hUUVVGVExFZEJRVWNzVDBGQlR5eERRVUZETEV0QlFVc3NVVUZCVVN4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRKUVVONFJDeFBRVUZQTEZGQlFWRXNVMEZCVXl4SlFVRkpMRWxCUVVrc1IwRkJSeXhUUVVGVExFVkJRVVVzUTBGQlF6dEJRVU5xUkN4RFFVRkRPMEZCUlVRN096czdPenM3T3pzN08wZEJWMGM3UVVGRFNDeE5RVUZOTEZWQlFWVXNTMEZCU3l4RFFVRkRMRWxCUVZrN1NVRkRhRU1zWjBSQlFXZEVPMGxCUTJoRUxEUkRRVUUwUXp0SlFVTTFReXhOUVVGTkxGTkJRVk1zUjBGQlJ5eDNRMEZCZDBNc1EwRkJRenRKUVVNelJDeFBRVUZQTEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNc1UwRkJVeXhGUVVGRkxFVkJRVVVzUTBGQlF5eERRVUZETzBGQlEzSkRMRU5CUVVNN1FVRkZSRHM3T3pzN096czdPenM3TzBkQldVYzdRVUZEU0N4TlFVRk5MRlZCUVZVc1IwRkJSeXhEUVVGRExFbEJRVmtzUlVGQlJTeEhRVUZYTzBsQlF6TkRMRTlCUVU4c1IwRkJSeXhIUVVGSExFZEJRVWNzU1VGQlNTeEhRVUZITEZOQlFWTXNSVUZCUlN4RFFVRkRPMEZCUTNKRExFTkJRVU1pTENKbWFXeGxJam9pWTI5c2IzSnpMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWFXMXdiM0owSUhzZ1FXNXphVkpsYzJWMExDQnpkSGxzWlhNZ2ZTQm1jbTl0SUZ3aUxpOWpiMjV6ZEdGdWRITmNJanRjYmx4dVhHNHZLaXBjYmlBcUlFQmtaWE5qY21sd2RHbHZiaUJCY0hCc2FXVnpJR0VnWW1GemFXTWdRVTVUU1NCamIyeHZjaUJqYjJSbElIUnZJSFJsZUhRdVhHNGdLaUJBYzNWdGJXRnllU0JVYUdseklHWjFibU4wYVc5dUlIUmhhMlZ6SUdFZ2MzUnlhVzVuTENCaGJpQkJUbE5KSUdOdmJHOXlJR052WkdVZ2JuVnRZbVZ5TENCaGJtUWdZVzRnYjNCMGFXOXVZV3dnWW1GamEyZHliM1Z1WkNCbWJHRm5MbHh1SUNvZ1NYUWdjbVYwZFhKdWN5QjBhR1VnZEdWNGRDQjNjbUZ3Y0dWa0lHbHVJSFJvWlNCaGNIQnliM0J5YVdGMFpTQkJUbE5KSUdWelkyRndaU0JqYjJSbGN5Qm1iM0lnWldsMGFHVnlJR1p2Y21WbmNtOTFibVFnYjNJZ1ltRmphMmR5YjNWdVpDQmpiMnh2Y21sdVp5NWNiaUFxSUZSb2FYTWdablZ1WTNScGIyNGdhWE1nZFhObFpDQm1iM0lnWW1GemFXTWdNVFl0WTI5c2IzSWdRVTVUU1NCbWIzSnRZWFIwYVc1bkxseHVJQ3BjYmlBcUlFQndZWEpoYlNCN2MzUnlhVzVuZlNCMFpYaDBJQzBnVkdobElIUmxlSFFnZEc4Z1ltVWdZMjlzYjNKbFpDNWNiaUFxSUVCd1lYSmhiU0I3Ym5WdFltVnlmU0J1SUMwZ1ZHaGxJRUZPVTBrZ1kyOXNiM0lnWTI5a1pTQnVkVzFpWlhJdVhHNGdLaUJBY0dGeVlXMGdlMkp2YjJ4bFlXNTlJRnRpWnoxbVlXeHpaVjBnTFNCSlppQjBjblZsTENCaGNIQnNhV1Z6SUhSb1pTQmpiMnh2Y2lCMGJ5QjBhR1VnWW1GamEyZHliM1Z1WkNCcGJuTjBaV0ZrSUc5bUlIUm9aU0JtYjNKbFozSnZkVzVrTGx4dUlDb2dRSEpsZEhWeWJpQjdjM1J5YVc1bmZTQlVhR1VnZEdWNGRDQjNjbUZ3Y0dWa0lHbHVJRUZPVTBrZ1kyOXNiM0lnWTI5a1pYTXVYRzRnS2x4dUlDb2dRR1oxYm1OMGFXOXVJR052Ykc5eWFYcGxRVTVUU1Z4dUlDb2dRRzFsYldKbGNrOW1JRzF2WkhWc1pUcEFVM1I1YkdWa1UzUnlhVzVuWEc0Z0tpOWNibVY0Y0c5eWRDQm1kVzVqZEdsdmJpQmpiMnh2Y21sNlpVRk9VMGtvZEdWNGREb2djM1J5YVc1bkxDQnVPaUJ1ZFcxaVpYSXNJR0puSUQwZ1ptRnNjMlVwSUh0Y2JseHVJQ0JwWmlBb2FYTk9ZVTRvYmlrcGUxeHVJQ0FnSUdOdmJuTnZiR1V1ZDJGeWJpaGdTVzUyWVd4cFpDQmpiMnh2Y2lCdWRXMWlaWElnYjI0Z2RHaGxJRUZPVTBrZ2MyTmhiR1U2SUNSN2JuMHVJR2xuYm05eWFXNW5MaTR1WUNrN1hHNGdJQ0FnY21WMGRYSnVJSFJsZUhRN1hHNGdJSDFjYmlBZ2FXWWdLR0puSUNZbUlDaGNiaUFnSUNBb2JpQStJRE13SUNZbUlHNGdQRDBnTkRBcFhHNGdJQ0FnZkh3Z0tHNGdQaUE1TUNBbUppQnVJRHc5SURFd01Da2dLU2w3WEc0Z0lDQWdiaUE5SUc0Z0t5QXhNRnh1SUNCOVhHNGdJSEpsZEhWeWJpQmdYRng0TVdKYkpIdHVmVzBrZTNSbGVIUjlKSHRCYm5OcFVtVnpaWFI5WUR0Y2JseHVmVnh1WEc1Y2JpOHFLbHh1SUNvZ1FHUmxjMk55YVhCMGFXOXVJRUZ3Y0d4cFpYTWdZU0F5TlRZdFkyOXNiM0lnUVU1VFNTQmpiMlJsSUhSdklIUmxlSFF1WEc0Z0tpQkFjM1Z0YldGeWVTQlVhR2x6SUdaMWJtTjBhVzl1SUhSaGEyVnpJR0VnYzNSeWFXNW5JR0Z1WkNCaElHTnZiRzl5SUc1MWJXSmxjaUFvTUMweU5UVXBJR0Z1WkNCeVpYUjFjbTV6SUhSb1pTQjBaWGgwWEc0Z0tpQjNjbUZ3Y0dWa0lHbHVJRUZPVTBrZ1pYTmpZWEJsSUdOdlpHVnpJR1p2Y2lCbGFYUm9aWElnWm05eVpXZHliM1Z1WkNCdmNpQmlZV05yWjNKdmRXNWtJR052Ykc5eWFXNW5MbHh1SUNwY2JpQXFJRUJ3WVhKaGJTQjdjM1J5YVc1bmZTQjBaWGgwSUMwZ1ZHaGxJSFJsZUhRZ2RHOGdZbVVnWTI5c2IzSmxaQzVjYmlBcUlFQndZWEpoYlNCN2JuVnRZbVZ5ZlNCdUlDMGdWR2hsSUdOdmJHOXlJRzUxYldKbGNpQW9NQzB5TlRVcExseHVJQ29nUUhCaGNtRnRJSHRpYjI5c1pXRnVmU0JiWW1jOVptRnNjMlZkSUMwZ1NXWWdkSEoxWlN3Z1lYQndiR2xsY3lCMGFHVWdZMjlzYjNJZ2RHOGdkR2hsSUdKaFkydG5jbTkxYm1RZ2FXNXpkR1ZoWkNCdlppQjBhR1VnWm05eVpXZHliM1Z1WkM1Y2JpQXFJRUJ5WlhSMWNtNGdlM04wY21sdVozMGdWR2hsSUhSbGVIUWdkM0poY0hCbFpDQnBiaUJCVGxOSklHTnZiRzl5SUdOdlpHVnpMbHh1SUNwY2JpQXFJRUJtZFc1amRHbHZiaUJqYjJ4dmNtbDZaVEkxTmx4dUlDb2dRRzFsYldKbGNrOW1JRzF2WkhWc1pUcEFVM1I1YkdWa1UzUnlhVzVuWEc0Z0tpOWNibVY0Y0c5eWRDQm1kVzVqZEdsdmJpQmpiMnh2Y21sNlpUSTFOaWgwWlhoME9pQnpkSEpwYm1jc0lHNDZJRzUxYldKbGNpd2dZbWNnUFNCbVlXeHpaU2tnZTF4dVhHNGdJR2xtSUNocGMwNWhUaWh1S1NsN1hHNGdJQ0FnWTI5dWMyOXNaUzUzWVhKdUtHQkpiblpoYkdsa0lHTnZiRzl5SUc1MWJXSmxjaUJ2YmlCMGFHVWdNalUySUhOallXeGxPaUFrZTI1OUxpQnBaMjV2Y21sdVp5NHVMbUFwTzF4dUlDQWdJSEpsZEhWeWJpQjBaWGgwTzF4dUlDQjlYRzRnSUdsbUlDaHVJRHdnTUNCOGZDQnVJRDRnTWpVMUtTQjdYRzRnSUNBZ1kyOXVjMjlzWlM1M1lYSnVLR0JKYm5aaGJHbGtJR052Ykc5eUlHNTFiV0psY2lCdmJpQjBhR1VnTWpVMklITmpZV3hsT2lBa2UyNTlMaUJwWjI1dmNtbHVaeTR1TG1BcE8xeHVJQ0FnSUhKbGRIVnliaUIwWlhoME8xeHVJQ0I5WEc0Z0lISmxkSFZ5YmlCZ1hGeDRNV0piSkh0aVp5QS9JRFE0SURvZ016aDlPelU3Skh0dWZXMGtlM1JsZUhSOUpIdEJibk5wVW1WelpYUjlZRHRjYm4xY2JseHVMeW9xWEc0Z0tpQkFaR1Z6WTNKcGNIUnBiMjRnUVhCd2JHbGxjeUJoYmlCU1IwSWdZMjlzYjNJZ1FVNVRTU0JqYjJSbElIUnZJSFJsZUhRdVhHNGdLaUJBYzNWdGJXRnllU0JVYUdseklHWjFibU4wYVc5dUlIUmhhMlZ6SUdFZ2MzUnlhVzVuSUdGdVpDQlNSMElnWTI5c2IzSWdkbUZzZFdWeklDZ3dMVEkxTlNCbWIzSWdaV0ZqYUNCamIyMXdiMjVsYm5RcFhHNGdLaUJoYm1RZ2NtVjBkWEp1Y3lCMGFHVWdkR1Y0ZENCM2NtRndjR1ZrSUdsdUlFRk9VMGtnWlhOallYQmxJR052WkdWeklHWnZjaUJsYVhSb1pYSWdabTl5WldkeWIzVnVaQ0J2Y2lCaVlXTnJaM0p2ZFc1a0lHTnZiRzl5YVc1bkxseHVJQ3BjYmlBcUlFQndZWEpoYlNCN2MzUnlhVzVuZlNCMFpYaDBJQzBnVkdobElIUmxlSFFnZEc4Z1ltVWdZMjlzYjNKbFpDNWNiaUFxSUVCd1lYSmhiU0I3Ym5WdFltVnlmU0J5SUMwZ1ZHaGxJSEpsWkNCamIyMXdiMjVsYm5RZ2IyWWdkR2hsSUdOdmJHOXlJQ2d3TFRJMU5Ta3VYRzRnS2lCQWNHRnlZVzBnZTI1MWJXSmxjbjBnWnlBdElGUm9aU0JuY21WbGJpQmpiMjF3YjI1bGJuUWdiMllnZEdobElHTnZiRzl5SUNnd0xUSTFOU2t1WEc0Z0tpQkFjR0Z5WVcwZ2UyNTFiV0psY24wZ1lpQXRJRlJvWlNCaWJIVmxJR052YlhCdmJtVnVkQ0J2WmlCMGFHVWdZMjlzYjNJZ0tEQXRNalUxS1M1Y2JpQXFJRUJ3WVhKaGJTQjdZbTl2YkdWaGJuMGdXMkpuUFdaaGJITmxYU0F0SUVsbUlIUnlkV1VzSUdGd2NHeHBaWE1nZEdobElHTnZiRzl5SUhSdklIUm9aU0JpWVdOclozSnZkVzVrSUdsdWMzUmxZV1FnYjJZZ2RHaGxJR1p2Y21WbmNtOTFibVF1WEc0Z0tpQkFjbVYwZFhKdUlIdHpkSEpwYm1kOUlGUm9aU0IwWlhoMElIZHlZWEJ3WldRZ2FXNGdRVTVUU1NCamIyeHZjaUJqYjJSbGN5NWNiaUFxWEc0Z0tpQkFablZ1WTNScGIyNGdZMjlzYjNKcGVtVlNSMEpjYmlBcUlFQnRaVzFpWlhKUFppQnRiMlIxYkdVNlUzUjViR1ZrVTNSeWFXNW5YRzRnS2k5Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCamIyeHZjbWw2WlZKSFFpaDBaWGgwT2lCemRISnBibWNzSUhJNklHNTFiV0psY2l3Z1p6b2diblZ0WW1WeUxDQmlPaUJ1ZFcxaVpYSXNJR0puSUQwZ1ptRnNjMlVwSUh0Y2JpQWdhV1lnS0dselRtRk9LSElwSUh4OElHbHpUbUZPS0djcElIeDhJR2x6VG1GT0tHSXBLWHRjYmlBZ0lDQmpiMjV6YjJ4bExuZGhjbTRvWUVsdWRtRnNhV1FnVWtkQ0lHTnZiRzl5SUhaaGJIVmxjem9nY2owa2UzSjlMQ0JuUFNSN1ozMHNJR0k5Skh0aWZTNGdTV2R1YjNKcGJtY3VMaTVnS1R0Y2JpQWdJQ0J5WlhSMWNtNGdkR1Y0ZER0Y2JpQWdmVnh1SUNCcFppQW9XM0lzSUdjc0lHSmRMbk52YldVb2RpQTlQaUIySUR3Z01DQjhmQ0IySUQ0Z01qVTFLU2tnZTF4dUlDQWdJR052Ym5OdmJHVXVkMkZ5YmloZ1NXNTJZV3hwWkNCU1IwSWdZMjlzYjNJZ2RtRnNkV1Z6T2lCeVBTUjdjbjBzSUdjOUpIdG5mU3dnWWowa2UySjlMaUJKWjI1dmNtbHVaeTR1TG1BcE8xeHVJQ0FnSUhKbGRIVnliaUIwWlhoME8xeHVJQ0I5WEc0Z0lISmxkSFZ5YmlCZ1hGeDRNV0piSkh0aVp5QS9JRFE0SURvZ016aDlPekk3Skh0eWZUc2tlMmQ5T3lSN1luMXRKSHQwWlhoMGZTUjdRVzV6YVZKbGMyVjBmV0E3WEc1OVhHNWNiaThxS2x4dUlDb2dRR1JsYzJOeWFYQjBhVzl1SUVGd2NHeHBaWE1nWVc0Z1FVNVRTU0J6ZEhsc1pTQmpiMlJsSUhSdklIUmxlSFF1WEc0Z0tpQkFjM1Z0YldGeWVTQlVhR2x6SUdaMWJtTjBhVzl1SUhSaGEyVnpJR0VnYzNSeWFXNW5JR0Z1WkNCaElITjBlV3hsSUdOdlpHVWdLR1ZwZEdobGNpQmhJRzUxYldKbGNpQnZjaUJoSUd0bGVTQm1jbTl0SUhSb1pTQnpkSGxzWlhNZ2IySnFaV04wS1Z4dUlDb2dZVzVrSUhKbGRIVnlibk1nZEdobElIUmxlSFFnZDNKaGNIQmxaQ0JwYmlCMGFHVWdZWEJ3Y205d2NtbGhkR1VnUVU1VFNTQmxjMk5oY0dVZ1kyOWtaWE1nWm05eUlIUm9ZWFFnYzNSNWJHVXVYRzRnS2x4dUlDb2dRSEJoY21GdElIdHpkSEpwYm1kOUlIUmxlSFFnTFNCVWFHVWdkR1Y0ZENCMGJ5QmlaU0J6ZEhsc1pXUXVYRzRnS2lCQWNHRnlZVzBnZTI1MWJXSmxjaUI4SUhOMGNtbHVaMzBnYmlBdElGUm9aU0J6ZEhsc1pTQmpiMlJsSUc5eUlITjBlV3hsSUc1aGJXVXVYRzRnS2lCQWNtVjBkWEp1SUh0emRISnBibWQ5SUZSb1pTQjBaWGgwSUhkeVlYQndaV1FnYVc0Z1FVNVRTU0J6ZEhsc1pTQmpiMlJsY3k1Y2JpQXFYRzRnS2lCQVpuVnVZM1JwYjI0Z1lYQndiSGxUZEhsc1pWeHVJQ29nUUcxbGJXSmxjazltSUcxdlpIVnNaVHBUZEhsc1pXUlRkSEpwYm1kY2JpQXFMMXh1Wlhod2IzSjBJR1oxYm1OMGFXOXVJR0Z3Y0d4NVUzUjViR1VvZEdWNGREb2djM1J5YVc1bkxDQnVPaUJ1ZFcxaVpYSWdmQ0JyWlhsdlppQjBlWEJsYjJZZ2MzUjViR1Z6S1RvZ2MzUnlhVzVuSUh0Y2JpQWdZMjl1YzNRZ2MzUjViR1ZEYjJSbElEMGdkSGx3Wlc5bUlHNGdQVDA5SUZ3aWJuVnRZbVZ5WENJZ1B5QnVJRG9nYzNSNWJHVnpXMjVkTzF4dUlDQnlaWFIxY200Z1lGeGNlREZpV3lSN2MzUjViR1ZEYjJSbGZXMGtlM1JsZUhSOUpIdEJibk5wVW1WelpYUjlZRHRjYm4xY2JseHVMeW9xWEc0Z0tpQkFaR1Z6WTNKcGNIUnBiMjRnVW1WdGIzWmxjeUJoYkd3Z1FVNVRTU0JtYjNKdFlYUjBhVzVuSUdOdlpHVnpJR1p5YjIwZ2RHVjRkQzVjYmlBcUlFQnpkVzF0WVhKNUlGUm9hWE1nWm5WdVkzUnBiMjRnZEdGclpYTWdZU0J6ZEhKcGJtY2dkR2hoZENCdFlYa2dZMjl1ZEdGcGJpQkJUbE5KSUdWelkyRndaU0JqYjJSbGN5Qm1iM0lnWm05eWJXRjBkR2x1WjF4dUlDb2dZVzVrSUhKbGRIVnlibk1nWVNCdVpYY2djM1J5YVc1bklIZHBkR2dnWVd4c0lITjFZMmdnWTI5a1pYTWdjbVZ0YjNabFpDd2diR1ZoZG1sdVp5QnZibXg1SUhSb1pTQndiR0ZwYmlCMFpYaDBJR052Ym5SbGJuUXVYRzRnS2lCSmRDQjFjMlZ6SUdFZ2NtVm5kV3hoY2lCbGVIQnlaWE56YVc5dUlIUnZJRzFoZEdOb0lHRnVaQ0J5WlcxdmRtVWdRVTVUU1NCbGMyTmhjR1VnYzJWeGRXVnVZMlZ6TGx4dUlDcGNiaUFxSUVCd1lYSmhiU0I3YzNSeWFXNW5mU0IwWlhoMElDMGdWR2hsSUhSbGVIUWdjRzkwWlc1MGFXRnNiSGtnWTI5dWRHRnBibWx1WnlCQlRsTkpJR1p2Y20xaGRIUnBibWNnWTI5a1pYTXVYRzRnS2lCQWNtVjBkWEp1SUh0emRISnBibWQ5SUZSb1pTQnBibkIxZENCMFpYaDBJSGRwZEdnZ1lXeHNJRUZPVTBrZ1ptOXliV0YwZEdsdVp5QmpiMlJsY3lCeVpXMXZkbVZrTGx4dUlDcGNiaUFxSUVCbWRXNWpkR2x2YmlCamJHVmhjbHh1SUNvZ1FHMWxiV0psY2s5bUlHMXZaSFZzWlRwVGRIbHNaV1JUZEhKcGJtZGNiaUFxTDF4dVpYaHdiM0owSUdaMWJtTjBhVzl1SUdOc1pXRnlLSFJsZUhRNklITjBjbWx1WnlrNklITjBjbWx1WnlCN1hHNGdJQzh2SUZKbFozVnNZWElnWlhod2NtVnpjMmx2YmlCMGJ5QnRZWFJqYUNCQlRsTkpJR1Z6WTJGd1pTQmpiMlJsYzF4dUlDQXZMeUJsYzJ4cGJuUXRaR2x6WVdKc1pTMXVaWGgwTFd4cGJtVWdibTh0WTI5dWRISnZiQzF5WldkbGVGeHVJQ0JqYjI1emRDQmhibk5wVW1WblpYZ2dQU0F2WEZ4NE1VSW9QenBiUUMxYVhGeGNYQzFmWFh4Y1hGdGJNQzAvWFNwYklDMHZYU3BiUUMxK1hTa3ZaenRjYmlBZ2NtVjBkWEp1SUhSbGVIUXVjbVZ3YkdGalpTaGhibk5wVW1WblpYZ3NJQ2NuS1R0Y2JuMWNibHh1THlvcVhHNGdLaUJBWkdWelkzSnBjSFJwYjI0Z1FYQndiR2xsY3lCeVlYY2dRVTVUU1NCbGMyTmhjR1VnWTI5a1pYTWdkRzhnZEdWNGRDNWNiaUFxSUVCemRXMXRZWEo1SUZSb2FYTWdablZ1WTNScGIyNGdkR0ZyWlhNZ1lTQnpkSEpwYm1jZ1lXNWtJR0VnY21GM0lFRk9VMGtnWlhOallYQmxJR052WkdVc0lHRnVaQ0J5WlhSMWNtNXpJSFJvWlNCMFpYaDBYRzRnS2lCM2NtRndjR1ZrSUdsdUlIUm9aU0J3Y205MmFXUmxaQ0J5WVhjZ1FVNVRTU0JqYjJSbElHRnVaQ0IwYUdVZ2NtVnpaWFFnWTI5a1pTNGdWR2hwY3lCaGJHeHZkM01nWm05eUlHRndjR3g1YVc1bklHTjFjM1J2YlZ4dUlDb2diM0lnWTI5dGNHeGxlQ0JCVGxOSklHWnZjbTFoZEhScGJtY2dkR2hoZENCdFlYa2dibTkwSUdKbElHTnZkbVZ5WldRZ1lua2diM1JvWlhJZ2RYUnBiR2wwZVNCbWRXNWpkR2x2Ym5NdVhHNGdLbHh1SUNvZ1FIQmhjbUZ0SUh0emRISnBibWQ5SUhSbGVIUWdMU0JVYUdVZ2RHVjRkQ0IwYnlCaVpTQm1iM0p0WVhSMFpXUXVYRzRnS2lCQWNHRnlZVzBnZTNOMGNtbHVaMzBnY21GM0lDMGdWR2hsSUhKaGR5QkJUbE5KSUdWelkyRndaU0JqYjJSbElIUnZJR0psSUdGd2NHeHBaV1F1WEc0Z0tpQkFjbVYwZFhKdUlIdHpkSEpwYm1kOUlGUm9aU0IwWlhoMElIZHlZWEJ3WldRZ2FXNGdkR2hsSUhKaGR5QkJUbE5KSUdOdlpHVWdZVzVrSUhSb1pTQnlaWE5sZENCamIyUmxMbHh1SUNwY2JpQXFJRUJtZFc1amRHbHZiaUJ5WVhkY2JpQXFJRUJ0WlcxaVpYSlBaaUJ0YjJSMWJHVTZVM1I1YkdWa1UzUnlhVzVuWEc0Z0tpOWNibVY0Y0c5eWRDQm1kVzVqZEdsdmJpQnlZWGNvZEdWNGREb2djM1J5YVc1bkxDQnlZWGM2SUhOMGNtbHVaeWs2SUhOMGNtbHVaeUI3WEc0Z0lISmxkSFZ5YmlCZ0pIdHlZWGQ5Skh0MFpYaDBmU1I3UVc1emFWSmxjMlYwZldBN1hHNTlJbDE5XG4iLCJpbXBvcnQgeyBCcmlnaHRCYWNrZ3JvdW5kQ29sb3JzLCBCcmlnaHRGb3JlZ3JvdW5kQ29sb3JzLCBTdGFuZGFyZEJhY2tncm91bmRDb2xvcnMsIFN0YW5kYXJkRm9yZWdyb3VuZENvbG9ycywgc3R5bGVzLCB9IGZyb20gXCIuL2NvbnN0YW50c1wiO1xuaW1wb3J0IHsgY2xlYXIsIGNvbG9yaXplMjU2LCBjb2xvcml6ZUFOU0ksIGNvbG9yaXplUkdCLCByYXcsIGFwcGx5U3R5bGUsIH0gZnJvbSBcIi4vY29sb3JzXCI7XG4vKipcbiAqIEBjbGFzcyBTdHlsZWRTdHJpbmdcbiAqIEBkZXNjcmlwdGlvbiBBIGNsYXNzIHRoYXQgZXh0ZW5kcyBzdHJpbmcgZnVuY3Rpb25hbGl0eSB3aXRoIEFOU0kgY29sb3IgYW5kIHN0eWxlIG9wdGlvbnMuXG4gKiBAc3VtbWFyeSBTdHlsZWRTdHJpbmcgcHJvdmlkZXMgbWV0aG9kcyB0byBhcHBseSB2YXJpb3VzIEFOU0kgY29sb3IgYW5kIHN0eWxlIG9wdGlvbnMgdG8gdGV4dCBzdHJpbmdzLlxuICogSXQgaW1wbGVtZW50cyB0aGUgQ29sb3JpemVPcHRpb25zIGludGVyZmFjZSBhbmQgcHJveGllcyBuYXRpdmUgc3RyaW5nIG1ldGhvZHMgdG8gdGhlIHVuZGVybHlpbmcgdGV4dC5cbiAqIFRoaXMgY2xhc3MgYWxsb3dzIGZvciBjaGFpbmluZyBvZiBzdHlsaW5nIG1ldGhvZHMgYW5kIGVhc3kgYXBwbGljYXRpb24gb2YgY29sb3JzIGFuZCBzdHlsZXMgdG8gdGV4dC5cbiAqXG4gKiBAaW1wbGVtZW50cyB7Q29sb3JpemVPcHRpb25zfVxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgLSBUaGUgaW5pdGlhbCB0ZXh0IHN0cmluZyB0byBiZSBzdHlsZWQuXG4gKi9cbmV4cG9ydCBjbGFzcyBTdHlsZWRTdHJpbmcge1xuICAgIGNvbnN0cnVjdG9yKHRleHQpIHtcbiAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcbiAgICAgICAgLy8gQmFzaWMgY29sb3JzXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKFN0YW5kYXJkRm9yZWdyb3VuZENvbG9ycykuZm9yRWFjaCgoW25hbWUsIGNvZGVdKSA9PiB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgbmFtZSwge1xuICAgICAgICAgICAgICAgIGdldDogKCkgPT4gdGhpcy5mb3JlZ3JvdW5kKGNvZGUpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBPYmplY3QuZW50cmllcyhCcmlnaHRGb3JlZ3JvdW5kQ29sb3JzKS5mb3JFYWNoKChbbmFtZSwgY29kZV0pID0+IHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBuYW1lLCB7XG4gICAgICAgICAgICAgICAgZ2V0OiAoKSA9PiB0aGlzLmZvcmVncm91bmQoY29kZSksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIEJhY2tncm91bmQgY29sb3JzXG4gICAgICAgIE9iamVjdC5lbnRyaWVzKFN0YW5kYXJkQmFja2dyb3VuZENvbG9ycykuZm9yRWFjaCgoW25hbWUsIGNvZGVdKSA9PiB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgbmFtZSwge1xuICAgICAgICAgICAgICAgIGdldDogKCkgPT4gdGhpcy5iYWNrZ3JvdW5kKGNvZGUpLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBPYmplY3QuZW50cmllcyhCcmlnaHRCYWNrZ3JvdW5kQ29sb3JzKS5mb3JFYWNoKChbbmFtZSwgY29kZV0pID0+IHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBuYW1lLCB7XG4gICAgICAgICAgICAgICAgZ2V0OiAoKSA9PiB0aGlzLmJhY2tncm91bmQoY29kZSksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIFN0eWxlc1xuICAgICAgICBPYmplY3QuZW50cmllcyhzdHlsZXMpLmZvckVhY2goKFtuYW1lLCBjb2RlXSkgPT4ge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIG5hbWUsIHtcbiAgICAgICAgICAgICAgICBnZXQ6ICgpID0+IHRoaXMuc3R5bGUoY29kZSksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBDbGVhcnMgYWxsIHN0eWxpbmcgZnJvbSB0aGUgdGV4dC5cbiAgICAgKiBAc3VtbWFyeSBSZW1vdmVzIGFsbCBBTlNJIGNvbG9yIGFuZCBzdHlsZSBjb2RlcyBmcm9tIHRoZSB0ZXh0LlxuICAgICAqIEByZXR1cm4ge1N0eWxlZFN0cmluZ30gVGhlIFN0eWxlZFN0cmluZyBpbnN0YW5jZSB3aXRoIGNsZWFyZWQgc3R5bGluZy5cbiAgICAgKi9cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy50ZXh0ID0gY2xlYXIodGhpcy50ZXh0KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBBcHBsaWVzIHJhdyBBTlNJIGNvZGVzIHRvIHRoZSB0ZXh0LlxuICAgICAqIEBzdW1tYXJ5IEFsbG93cyBkaXJlY3QgYXBwbGljYXRpb24gb2YgQU5TSSBlc2NhcGUgc2VxdWVuY2VzIHRvIHRoZSB0ZXh0LlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSByYXdBbnNpIC0gVGhlIHJhdyBBTlNJIGVzY2FwZSBzZXF1ZW5jZSB0byBhcHBseS5cbiAgICAgKiBAcmV0dXJuIHtTdHlsZWRTdHJpbmd9IFRoZSBTdHlsZWRTdHJpbmcgaW5zdGFuY2Ugd2l0aCB0aGUgcmF3IEFOU0kgY29kZSBhcHBsaWVkLlxuICAgICAqL1xuICAgIHJhdyhyYXdBbnNpKSB7XG4gICAgICAgIHRoaXMudGV4dCA9IHJhdyh0aGlzLnRleHQsIHJhd0Fuc2kpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEFwcGxpZXMgYSBmb3JlZ3JvdW5kIGNvbG9yIHRvIHRoZSB0ZXh0LlxuICAgICAqIEBzdW1tYXJ5IFNldHMgdGhlIHRleHQgY29sb3IgdXNpbmcgQU5TSSBjb2xvciBjb2Rlcy5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbiAtIFRoZSBBTlNJIGNvbG9yIGNvZGUgZm9yIHRoZSBmb3JlZ3JvdW5kIGNvbG9yLlxuICAgICAqIEByZXR1cm4ge1N0eWxlZFN0cmluZ30gVGhlIFN0eWxlZFN0cmluZyBpbnN0YW5jZSB3aXRoIHRoZSBmb3JlZ3JvdW5kIGNvbG9yIGFwcGxpZWQuXG4gICAgICovXG4gICAgZm9yZWdyb3VuZChuKSB7XG4gICAgICAgIHRoaXMudGV4dCA9IGNvbG9yaXplQU5TSSh0aGlzLnRleHQsIG4pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEFwcGxpZXMgYSBiYWNrZ3JvdW5kIGNvbG9yIHRvIHRoZSB0ZXh0LlxuICAgICAqIEBzdW1tYXJ5IFNldHMgdGhlIGJhY2tncm91bmQgY29sb3Igb2YgdGhlIHRleHQgdXNpbmcgQU5TSSBjb2xvciBjb2Rlcy5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbiAtIFRoZSBBTlNJIGNvbG9yIGNvZGUgZm9yIHRoZSBiYWNrZ3JvdW5kIGNvbG9yLlxuICAgICAqIEByZXR1cm4ge1N0eWxlZFN0cmluZ30gVGhlIFN0eWxlZFN0cmluZyBpbnN0YW5jZSB3aXRoIHRoZSBiYWNrZ3JvdW5kIGNvbG9yIGFwcGxpZWQuXG4gICAgICovXG4gICAgYmFja2dyb3VuZChuKSB7XG4gICAgICAgIHRoaXMudGV4dCA9IGNvbG9yaXplQU5TSSh0aGlzLnRleHQsIG4sIHRydWUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEFwcGxpZXMgYSB0ZXh0IHN0eWxlIHRvIHRoZSBzdHJpbmcuXG4gICAgICogQHN1bW1hcnkgU2V0cyB0ZXh0IHN0eWxlcyBzdWNoIGFzIGJvbGQsIGl0YWxpYywgb3IgdW5kZXJsaW5lIHVzaW5nIEFOU0kgc3R5bGUgY29kZXMuXG4gICAgICogQHBhcmFtIHtudW1iZXIgfCBzdHJpbmd9IG4gLSBUaGUgc3R5bGUgY29kZSBvciBrZXkgZnJvbSB0aGUgc3R5bGVzIG9iamVjdC5cbiAgICAgKiBAcmV0dXJuIHtTdHlsZWRTdHJpbmd9IFRoZSBTdHlsZWRTdHJpbmcgaW5zdGFuY2Ugd2l0aCB0aGUgc3R5bGUgYXBwbGllZC5cbiAgICAgKi9cbiAgICBzdHlsZShuKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbiA9PT0gXCJzdHJpbmdcIiAmJiAhKG4gaW4gc3R5bGVzKSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBJbnZhbGlkIHN0eWxlOiAke259YCk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRleHQgPSBhcHBseVN0eWxlKHRoaXMudGV4dCwgbik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gQXBwbGllcyBhIDI1Ni1jb2xvciBmb3JlZ3JvdW5kIGNvbG9yIHRvIHRoZSB0ZXh0LlxuICAgICAqIEBzdW1tYXJ5IFNldHMgdGhlIHRleHQgY29sb3IgdXNpbmcgdGhlIGV4dGVuZGVkIDI1Ni1jb2xvciBwYWxldHRlLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBuIC0gVGhlIGNvbG9yIG51bWJlciBmcm9tIHRoZSAyNTYtY29sb3IgcGFsZXR0ZS5cbiAgICAgKiBAcmV0dXJuIHtTdHlsZWRTdHJpbmd9IFRoZSBTdHlsZWRTdHJpbmcgaW5zdGFuY2Ugd2l0aCB0aGUgMjU2LWNvbG9yIGZvcmVncm91bmQgYXBwbGllZC5cbiAgICAgKi9cbiAgICBjb2xvcjI1NihuKSB7XG4gICAgICAgIHRoaXMudGV4dCA9IGNvbG9yaXplMjU2KHRoaXMudGV4dCwgbik7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gQXBwbGllcyBhIDI1Ni1jb2xvciBiYWNrZ3JvdW5kIGNvbG9yIHRvIHRoZSB0ZXh0LlxuICAgICAqIEBzdW1tYXJ5IFNldHMgdGhlIGJhY2tncm91bmQgY29sb3IgdXNpbmcgdGhlIGV4dGVuZGVkIDI1Ni1jb2xvciBwYWxldHRlLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBuIC0gVGhlIGNvbG9yIG51bWJlciBmcm9tIHRoZSAyNTYtY29sb3IgcGFsZXR0ZS5cbiAgICAgKiBAcmV0dXJuIHtTdHlsZWRTdHJpbmd9IFRoZSBTdHlsZWRTdHJpbmcgaW5zdGFuY2Ugd2l0aCB0aGUgMjU2LWNvbG9yIGJhY2tncm91bmQgYXBwbGllZC5cbiAgICAgKi9cbiAgICBiZ0NvbG9yMjU2KG4pIHtcbiAgICAgICAgdGhpcy50ZXh0ID0gY29sb3JpemUyNTYodGhpcy50ZXh0LCBuLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBBcHBsaWVzIGFuIFJHQiBmb3JlZ3JvdW5kIGNvbG9yIHRvIHRoZSB0ZXh0LlxuICAgICAqIEBzdW1tYXJ5IFNldHMgdGhlIHRleHQgY29sb3IgdXNpbmcgUkdCIHZhbHVlcy5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gciAtIFRoZSByZWQgY29tcG9uZW50ICgwLTI1NSkuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGcgLSBUaGUgZ3JlZW4gY29tcG9uZW50ICgwLTI1NSkuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGIgLSBUaGUgYmx1ZSBjb21wb25lbnQgKDAtMjU1KS5cbiAgICAgKiBAcmV0dXJuIHtTdHlsZWRTdHJpbmd9IFRoZSBTdHlsZWRTdHJpbmcgaW5zdGFuY2Ugd2l0aCB0aGUgUkdCIGZvcmVncm91bmQgY29sb3IgYXBwbGllZC5cbiAgICAgKi9cbiAgICByZ2IociwgZywgYikge1xuICAgICAgICB0aGlzLnRleHQgPSBjb2xvcml6ZVJHQih0aGlzLnRleHQsIHIsIGcsIGIpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEFwcGxpZXMgYW4gUkdCIGJhY2tncm91bmQgY29sb3IgdG8gdGhlIHRleHQuXG4gICAgICogQHN1bW1hcnkgU2V0cyB0aGUgYmFja2dyb3VuZCBjb2xvciB1c2luZyBSR0IgdmFsdWVzLlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByIC0gVGhlIHJlZCBjb21wb25lbnQgKDAtMjU1KS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZyAtIFRoZSBncmVlbiBjb21wb25lbnQgKDAtMjU1KS5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYiAtIFRoZSBibHVlIGNvbXBvbmVudCAoMC0yNTUpLlxuICAgICAqIEByZXR1cm4ge1N0eWxlZFN0cmluZ30gVGhlIFN0eWxlZFN0cmluZyBpbnN0YW5jZSB3aXRoIHRoZSBSR0IgYmFja2dyb3VuZCBjb2xvciBhcHBsaWVkLlxuICAgICAqL1xuICAgIGJnUmdiKHIsIGcsIGIpIHtcbiAgICAgICAgdGhpcy50ZXh0ID0gY29sb3JpemVSR0IodGhpcy50ZXh0LCByLCBnLCBiLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBDb252ZXJ0cyB0aGUgU3R5bGVkU3RyaW5nIHRvIGEgcmVndWxhciBzdHJpbmcuXG4gICAgICogQHN1bW1hcnkgUmV0dXJucyB0aGUgdW5kZXJseWluZyB0ZXh0IHdpdGggYWxsIGFwcGxpZWQgc3R5bGluZy5cbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBzdHlsZWQgdGV4dCBhcyBhIHJlZ3VsYXIgc3RyaW5nLlxuICAgICAqL1xuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy50ZXh0O1xuICAgIH1cbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uIEFwcGxpZXMgc3R5bGluZyB0byBhIGdpdmVuIHRleHQgc3RyaW5nLlxuICogQHN1bW1hcnkgVGhpcyBmdW5jdGlvbiB0YWtlcyBhIHN0cmluZyBhbmQgcmV0dXJucyBhIFN0eWxlZFN0cmluZyBvYmplY3QsIHdoaWNoIGlzIGFuIGVuaGFuY2VkXG4gKiB2ZXJzaW9uIG9mIHRoZSBvcmlnaW5hbCBzdHJpbmcgd2l0aCBhZGRpdGlvbmFsIG1ldGhvZHMgZm9yIGFwcGx5aW5nIHZhcmlvdXMgQU5TSSBjb2xvciBhbmQgc3R5bGVcbiAqIG9wdGlvbnMuIEl0IHNldHMgdXAgYSBtYXBwZXIgb2JqZWN0IHdpdGggbWV0aG9kcyBmb3IgZGlmZmVyZW50IHN0eWxpbmcgb3BlcmF0aW9ucyBhbmQgdGhlblxuICogZGVmaW5lcyBwcm9wZXJ0aWVzIG9uIHRoZSB0ZXh0IHN0cmluZyB0byBtYWtlIHRoZXNlIG1ldGhvZHMgYWNjZXNzaWJsZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSB0ICBUaGUgaW5wdXQgdGV4dCB0byBiZSBzdHlsZWQuXG4gKiBAcmV0dXJuIHtTdHlsZWRTdHJpbmd9IEEgU3R5bGVkU3RyaW5nIG9iamVjdCB3aXRoIGFkZGl0aW9uYWwgc3R5bGluZyBtZXRob2RzLlxuICpcbiAqIEBmdW5jdGlvbiBzdHlsZVxuICpcbiAqIEBtZW1iZXJPZiBTdHlsZWRTdHJpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN0eWxlKC4uLnQpIHtcbiAgICByZXR1cm4gbmV3IFN0eWxlZFN0cmluZyh0LmpvaW4oXCIgXCIpKTtcbn1cblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbk55WXk5emRISnBibWR6TG5SeklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJMRTlCUVU4c1JVRkRUQ3h6UWtGQmMwSXNSVUZEZEVJc2MwSkJRWE5DTEVWQlEzUkNMSGRDUVVGM1FpeEZRVU40UWl4M1FrRkJkMElzUlVGRGVFSXNUVUZCVFN4SFFVTlFMRTFCUVUwc1lVRkJZU3hEUVVGRE8wRkJRM0pDTEU5QlFVOHNSVUZEVEN4TFFVRkxMRVZCUTB3c1YwRkJWeXhGUVVOWUxGbEJRVmtzUlVGRFdpeFhRVUZYTEVWQlExZ3NSMEZCUnl4RlFVTklMRlZCUVZVc1IwRkRXQ3hOUVVGTkxGVkJRVlVzUTBGQlF6dEJRVFpEYkVJN096czdPenM3T3p0SFFWTkhPMEZCUTBnc1RVRkJUU3hQUVVGUExGbEJRVms3U1VFMlUzWkNMRmxCUVZrc1NVRkJXVHRSUVVOMFFpeEpRVUZKTEVOQlFVTXNTVUZCU1N4SFFVRkhMRWxCUVVrc1EwRkJRenRSUVVOcVFpeGxRVUZsTzFGQlEyWXNUVUZCVFN4RFFVRkRMRTlCUVU4c1EwRkJReXgzUWtGQmQwSXNRMEZCUXl4RFFVRkRMRTlCUVU4c1EwRkJReXhEUVVGRExFTkJRVU1zU1VGQlNTeEZRVUZGTEVsQlFVa3NRMEZCUXl4RlFVRkZMRVZCUVVVN1dVRkRhRVVzVFVGQlRTeERRVUZETEdOQlFXTXNRMEZCUXl4SlFVRkpMRVZCUVVVc1NVRkJTU3hGUVVGRk8yZENRVU5vUXl4SFFVRkhMRVZCUVVVc1IwRkJSeXhGUVVGRkxFTkJRVU1zU1VGQlNTeERRVUZETEZWQlFWVXNRMEZCUXl4SlFVRkpMRU5CUVVNN1lVRkRha01zUTBGQlF5eERRVUZETzFGQlEwd3NRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkZTQ3hOUVVGTkxFTkJRVU1zVDBGQlR5eERRVUZETEhOQ1FVRnpRaXhEUVVGRExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTXNRMEZCUXl4SlFVRkpMRVZCUVVVc1NVRkJTU3hEUVVGRExFVkJRVVVzUlVGQlJUdFpRVU01UkN4TlFVRk5MRU5CUVVNc1kwRkJZeXhEUVVGRExFbEJRVWtzUlVGQlJTeEpRVUZKTEVWQlFVVTdaMEpCUTJoRExFZEJRVWNzUlVGQlJTeEhRVUZITEVWQlFVVXNRMEZCUXl4SlFVRkpMRU5CUVVNc1ZVRkJWU3hEUVVGRExFbEJRVWtzUTBGQlF6dGhRVU5xUXl4RFFVRkRMRU5CUVVNN1VVRkRUQ3hEUVVGRExFTkJRVU1zUTBGQlF6dFJRVVZJTEc5Q1FVRnZRanRSUVVOd1FpeE5RVUZOTEVOQlFVTXNUMEZCVHl4RFFVRkRMSGRDUVVGM1FpeERRVUZETEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNc1EwRkJReXhKUVVGSkxFVkJRVVVzU1VGQlNTeERRVUZETEVWQlFVVXNSVUZCUlR0WlFVTm9SU3hOUVVGTkxFTkJRVU1zWTBGQll5eERRVUZETEVsQlFVa3NSVUZCUlN4SlFVRkpMRVZCUVVVN1owSkJRMmhETEVkQlFVY3NSVUZCUlN4SFFVRkhMRVZCUVVVc1EwRkJReXhKUVVGSkxFTkJRVU1zVlVGQlZTeERRVUZETEVsQlFVa3NRMEZCUXp0aFFVTnFReXhEUVVGRExFTkJRVU03VVVGRFRDeERRVUZETEVOQlFVTXNRMEZCUXp0UlFVVklMRTFCUVUwc1EwRkJReXhQUVVGUExFTkJRVU1zYzBKQlFYTkNMRU5CUVVNc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF5eERRVUZETEVsQlFVa3NSVUZCUlN4SlFVRkpMRU5CUVVNc1JVRkJSU3hGUVVGRk8xbEJRemxFTEUxQlFVMHNRMEZCUXl4alFVRmpMRU5CUVVNc1NVRkJTU3hGUVVGRkxFbEJRVWtzUlVGQlJUdG5Ra0ZEYUVNc1IwRkJSeXhGUVVGRkxFZEJRVWNzUlVGQlJTeERRVUZETEVsQlFVa3NRMEZCUXl4VlFVRlZMRU5CUVVNc1NVRkJTU3hEUVVGRE8yRkJRMnBETEVOQlFVTXNRMEZCUXp0UlFVTk1MRU5CUVVNc1EwRkJReXhEUVVGRE8xRkJSVWdzVTBGQlV6dFJRVU5VTEUxQlFVMHNRMEZCUXl4UFFVRlBMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTXNRMEZCUXl4SlFVRkpMRVZCUVVVc1NVRkJTU3hEUVVGRExFVkJRVVVzUlVGQlJUdFpRVU01UXl4TlFVRk5MRU5CUVVNc1kwRkJZeXhEUVVGRExFbEJRVWtzUlVGQlJTeEpRVUZKTEVWQlFVVTdaMEpCUTJoRExFZEJRVWNzUlVGQlJTeEhRVUZITEVWQlFVVXNRMEZCUXl4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUTBGQlF6dGhRVU0xUWl4RFFVRkRMRU5CUVVNN1VVRkRUQ3hEUVVGRExFTkJRVU1zUTBGQlF6dEpRVU5NTEVOQlFVTTdTVUZGUkRzN096dFBRVWxITzBsQlEwZ3NTMEZCU3p0UlFVTklMRWxCUVVrc1EwRkJReXhKUVVGSkxFZEJRVWNzUzBGQlN5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRSUVVNM1FpeFBRVUZQTEVsQlFVa3NRMEZCUXp0SlFVTmtMRU5CUVVNN1NVRkZSRHM3T3pzN1QwRkxSenRKUVVOSUxFZEJRVWNzUTBGQlF5eFBRVUZsTzFGQlEycENMRWxCUVVrc1EwRkJReXhKUVVGSkxFZEJRVWNzUjBGQlJ5eERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRVZCUVVVc1QwRkJUeXhEUVVGRExFTkJRVU03VVVGRGNFTXNUMEZCVHl4SlFVRkpMRU5CUVVNN1NVRkRaQ3hEUVVGRE8wbEJSVVE3T3pzN08wOUJTMGM3U1VGRFNDeFZRVUZWTEVOQlFVTXNRMEZCVXp0UlFVTnNRaXhKUVVGSkxFTkJRVU1zU1VGQlNTeEhRVUZITEZsQlFWa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hGUVVGRkxFTkJRVU1zUTBGQlF5eERRVUZETzFGQlEzWkRMRTlCUVU4c1NVRkJTU3hEUVVGRE8wbEJRMlFzUTBGQlF6dEpRVVZFT3pzN096dFBRVXRITzBsQlEwZ3NWVUZCVlN4RFFVRkRMRU5CUVZNN1VVRkRiRUlzU1VGQlNTeERRVUZETEVsQlFVa3NSMEZCUnl4WlFVRlpMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUlVGQlJTeERRVUZETEVWQlFVVXNTVUZCU1N4RFFVRkRMRU5CUVVNN1VVRkROME1zVDBGQlR5eEpRVUZKTEVOQlFVTTdTVUZEWkN4RFFVRkRPMGxCUlVRN096czdPMDlCUzBjN1NVRkRTQ3hMUVVGTExFTkJRVU1zUTBGQkswSTdVVUZEYmtNc1NVRkJTU3hQUVVGUExFTkJRVU1zUzBGQlN5eFJRVUZSTEVsQlFVa3NRMEZCUXl4RFFVRkRMRU5CUVVNc1NVRkJTU3hOUVVGTkxFTkJRVU1zUlVGQlJTeERRVUZETzFsQlF6VkRMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zYTBKQlFXdENMRU5CUVVNc1JVRkJSU3hEUVVGRExFTkJRVU03V1VGRGNFTXNUMEZCVHl4SlFVRkpMRU5CUVVNN1VVRkRaQ3hEUVVGRE8xRkJRMFFzU1VGQlNTeERRVUZETEVsQlFVa3NSMEZCUnl4VlFVRlZMRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUlVGQlJTeERRVUZETEVOQlFVTXNRMEZCUXp0UlFVTnlReXhQUVVGUExFbEJRVWtzUTBGQlF6dEpRVU5rTEVOQlFVTTdTVUZGUkRzN096czdUMEZMUnp0SlFVTklMRkZCUVZFc1EwRkJReXhEUVVGVE8xRkJRMmhDTEVsQlFVa3NRMEZCUXl4SlFVRkpMRWRCUVVjc1YwRkJWeXhEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVWQlFVVXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkRkRU1zVDBGQlR5eEpRVUZKTEVOQlFVTTdTVUZEWkN4RFFVRkRPMGxCUlVRN096czdPMDlCUzBjN1NVRkRTQ3hWUVVGVkxFTkJRVU1zUTBGQlV6dFJRVU5zUWl4SlFVRkpMRU5CUVVNc1NVRkJTU3hIUVVGSExGZEJRVmNzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RlFVRkZMRU5CUVVNc1JVRkJSU3hKUVVGSkxFTkJRVU1zUTBGQlF6dFJRVU0xUXl4UFFVRlBMRWxCUVVrc1EwRkJRenRKUVVOa0xFTkJRVU03U1VGRlJEczdPenM3T3p0UFFVOUhPMGxCUTBnc1IwRkJSeXhEUVVGRExFTkJRVk1zUlVGQlJTeERRVUZUTEVWQlFVVXNRMEZCVXp0UlFVTnFReXhKUVVGSkxFTkJRVU1zU1VGQlNTeEhRVUZITEZkQlFWY3NRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hGUVVGRkxFTkJRVU1zUlVGQlJTeERRVUZETEVWQlFVVXNRMEZCUXl4RFFVRkRMRU5CUVVNN1VVRkROVU1zVDBGQlR5eEpRVUZKTEVOQlFVTTdTVUZEWkN4RFFVRkRPMGxCUlVRN096czdPenM3VDBGUFJ6dEpRVU5JTEV0QlFVc3NRMEZCUXl4RFFVRlRMRVZCUVVVc1EwRkJVeXhGUVVGRkxFTkJRVk03VVVGRGJrTXNTVUZCU1N4RFFVRkRMRWxCUVVrc1IwRkJSeXhYUVVGWExFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NSVUZCUlN4RFFVRkRMRVZCUVVVc1EwRkJReXhGUVVGRkxFTkJRVU1zUlVGQlJTeEpRVUZKTEVOQlFVTXNRMEZCUXp0UlFVTnNSQ3hQUVVGUExFbEJRVWtzUTBGQlF6dEpRVU5rTEVOQlFVTTdTVUZGUkRzN096dFBRVWxITzBsQlEwZ3NVVUZCVVR0UlFVTk9MRTlCUVU4c1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF6dEpRVU51UWl4RFFVRkRPME5CUTBZN1FVRkZSRHM3T3pzN096czdPenM3T3p0SFFXRkhPMEZCUTBnc1RVRkJUU3hWUVVGVkxFdEJRVXNzUTBGQlF5eEhRVUZITEVOQlFWYzdTVUZEYkVNc1QwRkJUeXhKUVVGSkxGbEJRVmtzUTBGQlF5eERRVUZETEVOQlFVTXNTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRExFTkJRVU03UVVGRGRrTXNRMEZCUXlJc0ltWnBiR1VpT2lKemRISnBibWR6TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lhVzF3YjNKMElIdGNiaUFnUW5KcFoyaDBRbUZqYTJkeWIzVnVaRU52Ykc5eWN5eGNiaUFnUW5KcFoyaDBSbTl5WldkeWIzVnVaRU52Ykc5eWN5eGNiaUFnVTNSaGJtUmhjbVJDWVdOclozSnZkVzVrUTI5c2IzSnpMRnh1SUNCVGRHRnVaR0Z5WkVadmNtVm5jbTkxYm1SRGIyeHZjbk1zWEc0Z0lITjBlV3hsY3l4Y2JuMGdabkp2YlNCY0lpNHZZMjl1YzNSaGJuUnpYQ0k3WEc1cGJYQnZjblFnZTF4dUlDQmpiR1ZoY2l4Y2JpQWdZMjlzYjNKcGVtVXlOVFlzWEc0Z0lHTnZiRzl5YVhwbFFVNVRTU3hjYmlBZ1kyOXNiM0pwZW1WU1IwSXNYRzRnSUhKaGR5eGNiaUFnWVhCd2JIbFRkSGxzWlN4Y2JuMGdabkp2YlNCY0lpNHZZMjlzYjNKelhDSTdYRzVjYmk4cUtseHVJQ29nUUhSNWNHVmtaV1lnUTI5c2IzSnBlbVZQY0hScGIyNXpYRzRnS2lCQVpHVnpZM0pwY0hScGIyNGdUM0IwYVc5dWN5Qm1iM0lnZEdWNGRDQmpiMnh2Y21sNllYUnBiMjRnZFhOcGJtY2dRVTVUU1NCamIyUmxjeTVjYmlBcUlFQnpkVzF0WVhKNUlGUm9hWE1nZEhsd1pTQmtaV1pwYm1WeklIUm9aU0J6ZEhKMVkzUjFjbVVnYjJZZ2RHaGxJRzlpYW1WamRDQnlaWFIxY201bFpDQmllU0IwYUdVZ1kyOXNiM0pwZW1VZ1puVnVZM1JwYjI0dVhHNGdLaUJKZENCcGJtTnNkV1JsY3lCdFpYUm9iMlJ6SUdadmNpQmhjSEJzZVdsdVp5QjJZWEpwYjNWeklHTnZiRzl5SUdGdVpDQnpkSGxzWlNCdmNIUnBiMjV6SUhSdklIUmxlSFFnZFhOcGJtY2dRVTVUU1NCbGMyTmhjR1VnWTI5a1pYTXVYRzRnS2x4dUlDb2dRSEJ5YjNCbGNuUjVJSHRUZEhsc1pXUlRkSEpwYm1kOUlGTjBZVzVrWVhKa1JtOXlaV2R5YjNWdVpFTnZiRzl5Y3lCSFpYUjBaWElnWm05eUlHVmhZMmdnYzNSaGJtUmhjbVFnWm05eVpXZHliM1Z1WkNCamIyeHZjaTVjYmlBcUlFQndjbTl3WlhKMGVTQjdVM1I1YkdWa1UzUnlhVzVuZlNCQ2NtbG5hSFJHYjNKbFozSnZkVzVrUTI5c2IzSnpJRWRsZEhSbGNpQm1iM0lnWldGamFDQmljbWxuYUhRZ1ptOXlaV2R5YjNWdVpDQmpiMnh2Y2k1Y2JpQXFJRUJ3Y205d1pYSjBlU0I3VTNSNWJHVmtVM1J5YVc1bmZTQlRkR0Z1WkdGeVpFSmhZMnRuY205MWJtUkRiMnh2Y25NZ1IyVjBkR1Z5SUdadmNpQmxZV05vSUhOMFlXNWtZWEprSUdKaFkydG5jbTkxYm1RZ1kyOXNiM0l1WEc0Z0tpQkFjSEp2Y0dWeWRIa2dlMU4wZVd4bFpGTjBjbWx1WjMwZ1FuSnBaMmgwUW1GamEyZHliM1Z1WkVOdmJHOXljeUJIWlhSMFpYSWdabTl5SUdWaFkyZ2dZbkpwWjJoMElHSmhZMnRuY205MWJtUWdZMjlzYjNJdVhHNGdLaUJBY0hKdmNHVnlkSGtnZTFOMGVXeGxaRk4wY21sdVozMGdjM1I1YkdWeklFZGxkSFJsY2lCbWIzSWdaV0ZqYUNCMFpYaDBJSE4wZVd4bExseHVJQ29nUUhCeWIzQmxjblI1SUh0bWRXNWpkR2x2YmlncE9pQlRkSGxzWldSVGRISnBibWQ5SUdOc1pXRnlJRkpsYlc5MlpYTWdZV3hzSUhOMGVXeHBibWNnWm5KdmJTQjBhR1VnZEdWNGRDNWNiaUFxSUVCd2NtOXdaWEowZVNCN1puVnVZM1JwYjI0b2MzUnlhVzVuS1RvZ1UzUjViR1ZrVTNSeWFXNW5mU0J5WVhjZ1FYQndiR2xsY3lCeVlYY2dRVTVUU1NCamIyUmxjeUIwYnlCMGFHVWdkR1Y0ZEM1Y2JpQXFJRUJ3Y205d1pYSjBlU0I3Wm5WdVkzUnBiMjRvYm5WdFltVnlLVG9nVTNSNWJHVmtVM1J5YVc1bmZTQm1iM0psWjNKdmRXNWtJRUZ3Y0d4cFpYTWdZU0JtYjNKbFozSnZkVzVrSUdOdmJHOXlJSFZ6YVc1bklFRk9VMGtnWTI5a1pYTXVYRzRnS2lCQWNISnZjR1Z5ZEhrZ2UyWjFibU4wYVc5dUtHNTFiV0psY2lrNklGTjBlV3hsWkZOMGNtbHVaMzBnWW1GamEyZHliM1Z1WkNCQmNIQnNhV1Z6SUdFZ1ltRmphMmR5YjNWdVpDQmpiMnh2Y2lCMWMybHVaeUJCVGxOSklHTnZaR1Z6TGx4dUlDb2dRSEJ5YjNCbGNuUjVJSHRtZFc1amRHbHZiaWh6ZEhKcGJtY3BPaUJUZEhsc1pXUlRkSEpwYm1kOUlITjBlV3hsSUVGd2NHeHBaWE1nWVNCMFpYaDBJSE4wZVd4bElIVnphVzVuSUVGT1Uwa2dZMjlrWlhNdVhHNGdLaUJBY0hKdmNHVnlkSGtnZTJaMWJtTjBhVzl1S0c1MWJXSmxjaWs2SUZOMGVXeGxaRk4wY21sdVozMGdZMjlzYjNJeU5UWWdRWEJ3YkdsbGN5QmhJREkxTmkxamIyeHZjaUJtYjNKbFozSnZkVzVrSUdOdmJHOXlMbHh1SUNvZ1FIQnliM0JsY25SNUlIdG1kVzVqZEdsdmJpaHVkVzFpWlhJcE9pQlRkSGxzWldSVGRISnBibWQ5SUdKblEyOXNiM0l5TlRZZ1FYQndiR2xsY3lCaElESTFOaTFqYjJ4dmNpQmlZV05yWjNKdmRXNWtJR052Ykc5eUxseHVJQ29nUUhCeWIzQmxjblI1SUh0bWRXNWpkR2x2YmlodWRXMWlaWElzSUc1MWJXSmxjaXdnYm5WdFltVnlLVG9nVTNSNWJHVmtVM1J5YVc1bmZTQnlaMklnUVhCd2JHbGxjeUJoYmlCU1IwSWdabTl5WldkeWIzVnVaQ0JqYjJ4dmNpNWNiaUFxSUVCd2NtOXdaWEowZVNCN1puVnVZM1JwYjI0b2JuVnRZbVZ5TENCdWRXMWlaWElzSUc1MWJXSmxjaWs2SUZOMGVXeGxaRk4wY21sdVozMGdZbWRTWjJJZ1FYQndiR2xsY3lCaGJpQlNSMElnWW1GamEyZHliM1Z1WkNCamIyeHZjaTVjYmlBcUlFQndjbTl3WlhKMGVTQjdjM1J5YVc1bmZTQjBaWGgwSUZSb1pTQjFibVJsY214NWFXNW5JSFJsZUhRZ1kyOXVkR1Z1ZEM1Y2JpQXFYRzRnS2lCQWJXVnRZbVZ5VDJZZ2JXOWtkV3hsT2xOMGVXeGxaRk4wY21sdVoxeHVJQ292WEc1bGVIQnZjblFnZEhsd1pTQkRiMnh2Y21sNlpVOXdkR2x2Ym5NZ1BTQjdYRzRnSUZ0cklHbHVJR3RsZVc5bUlIUjVjR1Z2WmlCVGRHRnVaR0Z5WkVadmNtVm5jbTkxYm1SRGIyeHZjbk5kT2lCVGRIbHNaV1JUZEhKcGJtYzdYRzU5SUNZZ2V5QmJheUJwYmlCclpYbHZaaUIwZVhCbGIyWWdRbkpwWjJoMFJtOXlaV2R5YjNWdVpFTnZiRzl5YzEwNklGTjBlV3hsWkZOMGNtbHVaeUI5SUNZZ2UxeHVJQ0JiYXlCcGJpQnJaWGx2WmlCMGVYQmxiMllnVTNSaGJtUmhjbVJDWVdOclozSnZkVzVrUTI5c2IzSnpYVG9nVTNSNWJHVmtVM1J5YVc1bk8xeHVmU0FtSUhzZ1cyc2dhVzRnYTJWNWIyWWdkSGx3Wlc5bUlFSnlhV2RvZEVKaFkydG5jbTkxYm1SRGIyeHZjbk5kT2lCVGRIbHNaV1JUZEhKcGJtY2dmU0FtSUh0Y2JpQWdXMnNnYVc0Z2EyVjViMllnZEhsd1pXOW1JSE4wZVd4bGMxMDZJRk4wZVd4bFpGTjBjbWx1Wnp0Y2JuMGdKaUI3WEc0Z0lHTnNaV0Z5T2lBb0tTQTlQaUJUZEhsc1pXUlRkSEpwYm1jN1hHNGdJSEpoZHpvZ0tISmhkem9nYzNSeWFXNW5LU0E5UGlCVGRIbHNaV1JUZEhKcGJtYzdYRzRnSUdadmNtVm5jbTkxYm1RNklDaHVPaUJ1ZFcxaVpYSXBJRDArSUZOMGVXeGxaRk4wY21sdVp6dGNiaUFnWW1GamEyZHliM1Z1WkRvZ0tHNDZJRzUxYldKbGNpa2dQVDRnVTNSNWJHVmtVM1J5YVc1bk8xeHVJQ0J6ZEhsc1pUb2dLRzQ2SUc1MWJXSmxjaUI4SUd0bGVXOW1JSFI1Y0dWdlppQnpkSGxzWlhNcElEMCtJRk4wZVd4bFpGTjBjbWx1Wnp0Y2JpQWdZMjlzYjNJeU5UWTZJQ2h1T2lCdWRXMWlaWElwSUQwK0lGTjBlV3hsWkZOMGNtbHVaenRjYmlBZ1ltZERiMnh2Y2pJMU5qb2dLRzQ2SUc1MWJXSmxjaWtnUFQ0Z1UzUjViR1ZrVTNSeWFXNW5PMXh1SUNCeVoySTZJQ2h5T2lCdWRXMWlaWElzSUdjNklHNTFiV0psY2l3Z1lqb2diblZ0WW1WeUtTQTlQaUJUZEhsc1pXUlRkSEpwYm1jN1hHNGdJR0puVW1kaU9pQW9jam9nYm5WdFltVnlMQ0JuT2lCdWRXMWlaWElzSUdJNklHNTFiV0psY2lrZ1BUNGdVM1I1YkdWa1UzUnlhVzVuTzF4dUlDQjBaWGgwT2lCemRISnBibWM3WEc1OU8xeHVYRzR2S2lwY2JpQXFJRUJqYkdGemN5QlRkSGxzWldSVGRISnBibWRjYmlBcUlFQmtaWE5qY21sd2RHbHZiaUJCSUdOc1lYTnpJSFJvWVhRZ1pYaDBaVzVrY3lCemRISnBibWNnWm5WdVkzUnBiMjVoYkdsMGVTQjNhWFJvSUVGT1Uwa2dZMjlzYjNJZ1lXNWtJSE4wZVd4bElHOXdkR2x2Ym5NdVhHNGdLaUJBYzNWdGJXRnllU0JUZEhsc1pXUlRkSEpwYm1jZ2NISnZkbWxrWlhNZ2JXVjBhRzlrY3lCMGJ5QmhjSEJzZVNCMllYSnBiM1Z6SUVGT1Uwa2dZMjlzYjNJZ1lXNWtJSE4wZVd4bElHOXdkR2x2Ym5NZ2RHOGdkR1Y0ZENCemRISnBibWR6TGx4dUlDb2dTWFFnYVcxd2JHVnRaVzUwY3lCMGFHVWdRMjlzYjNKcGVtVlBjSFJwYjI1eklHbHVkR1Z5Wm1GalpTQmhibVFnY0hKdmVHbGxjeUJ1WVhScGRtVWdjM1J5YVc1bklHMWxkR2h2WkhNZ2RHOGdkR2hsSUhWdVpHVnliSGxwYm1jZ2RHVjRkQzVjYmlBcUlGUm9hWE1nWTJ4aGMzTWdZV3hzYjNkeklHWnZjaUJqYUdGcGJtbHVaeUJ2WmlCemRIbHNhVzVuSUcxbGRHaHZaSE1nWVc1a0lHVmhjM2tnWVhCd2JHbGpZWFJwYjI0Z2IyWWdZMjlzYjNKeklHRnVaQ0J6ZEhsc1pYTWdkRzhnZEdWNGRDNWNiaUFxSUZ4dUlDb2dRR2x0Y0d4bGJXVnVkSE1nZTBOdmJHOXlhWHBsVDNCMGFXOXVjMzFjYmlBcUlFQndZWEpoYlNCN2MzUnlhVzVuZlNCMFpYaDBJQzBnVkdobElHbHVhWFJwWVd3Z2RHVjRkQ0J6ZEhKcGJtY2dkRzhnWW1VZ2MzUjViR1ZrTGx4dUlDb3ZYRzVsZUhCdmNuUWdZMnhoYzNNZ1UzUjViR1ZrVTNSeWFXNW5JR2x0Y0d4bGJXVnVkSE1nUTI5c2IzSnBlbVZQY0hScGIyNXpJSHRjYmlBZ0x5b3FYRzRnSUNBcUlFQmtaWE5qY21sd2RHbHZiaUJCY0hCc2FXVnpJR0pzWVdOcklHTnZiRzl5SUhSdklIUm9aU0IwWlhoMExseHVJQ0FnS2lCQWMzVnRiV0Z5ZVNCSFpYUjBaWElnZEdoaGRDQnlaWFIxY201eklHRWdibVYzSUZOMGVXeGxaRk4wY21sdVp5QjNhWFJvSUdKc1lXTnJJR1p2Y21WbmNtOTFibVFnWTI5c2IzSXVYRzRnSUNBcUwxeHVJQ0JpYkdGamF5RTZJRk4wZVd4bFpGTjBjbWx1Wnp0Y2JseHVJQ0F2S2lwY2JpQWdJQ29nUUdSbGMyTnlhWEIwYVc5dUlFRndjR3hwWlhNZ2NtVmtJR052Ykc5eUlIUnZJSFJvWlNCMFpYaDBMbHh1SUNBZ0tpQkFjM1Z0YldGeWVTQkhaWFIwWlhJZ2RHaGhkQ0J5WlhSMWNtNXpJR0VnYm1WM0lGTjBlV3hsWkZOMGNtbHVaeUIzYVhSb0lISmxaQ0JtYjNKbFozSnZkVzVrSUdOdmJHOXlMbHh1SUNBZ0tpOWNiaUFnY21Wa0lUb2dVM1I1YkdWa1UzUnlhVzVuTzF4dVhHNGdJQzhxS2x4dUlDQWdLaUJBWkdWelkzSnBjSFJwYjI0Z1FYQndiR2xsY3lCbmNtVmxiaUJqYjJ4dmNpQjBieUIwYUdVZ2RHVjRkQzVjYmlBZ0lDb2dRSE4xYlcxaGNua2dSMlYwZEdWeUlIUm9ZWFFnY21WMGRYSnVjeUJoSUc1bGR5QlRkSGxzWldSVGRISnBibWNnZDJsMGFDQm5jbVZsYmlCbWIzSmxaM0p2ZFc1a0lHTnZiRzl5TGx4dUlDQWdLaTljYmlBZ1ozSmxaVzRoT2lCVGRIbHNaV1JUZEhKcGJtYzdYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFQmtaWE5qY21sd2RHbHZiaUJCY0hCc2FXVnpJSGxsYkd4dmR5QmpiMnh2Y2lCMGJ5QjBhR1VnZEdWNGRDNWNiaUFnSUNvZ1FITjFiVzFoY25rZ1IyVjBkR1Z5SUhSb1lYUWdjbVYwZFhKdWN5QmhJRzVsZHlCVGRIbHNaV1JUZEhKcGJtY2dkMmwwYUNCNVpXeHNiM2NnWm05eVpXZHliM1Z1WkNCamIyeHZjaTVjYmlBZ0lDb3ZYRzRnSUhsbGJHeHZkeUU2SUZOMGVXeGxaRk4wY21sdVp6dGNibHh1SUNBdktpcGNiaUFnSUNvZ1FHUmxjMk55YVhCMGFXOXVJRUZ3Y0d4cFpYTWdZbXgxWlNCamIyeHZjaUIwYnlCMGFHVWdkR1Y0ZEM1Y2JpQWdJQ29nUUhOMWJXMWhjbmtnUjJWMGRHVnlJSFJvWVhRZ2NtVjBkWEp1Y3lCaElHNWxkeUJUZEhsc1pXUlRkSEpwYm1jZ2QybDBhQ0JpYkhWbElHWnZjbVZuY205MWJtUWdZMjlzYjNJdVhHNGdJQ0FxTDF4dUlDQmliSFZsSVRvZ1UzUjViR1ZrVTNSeWFXNW5PMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkFaR1Z6WTNKcGNIUnBiMjRnUVhCd2JHbGxjeUJ0WVdkbGJuUmhJR052Ykc5eUlIUnZJSFJvWlNCMFpYaDBMbHh1SUNBZ0tpQkFjM1Z0YldGeWVTQkhaWFIwWlhJZ2RHaGhkQ0J5WlhSMWNtNXpJR0VnYm1WM0lGTjBlV3hsWkZOMGNtbHVaeUIzYVhSb0lHMWhaMlZ1ZEdFZ1ptOXlaV2R5YjNWdVpDQmpiMnh2Y2k1Y2JpQWdJQ292WEc0Z0lHMWhaMlZ1ZEdFaE9pQlRkSGxzWldSVGRISnBibWM3WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRUJrWlhOamNtbHdkR2x2YmlCQmNIQnNhV1Z6SUdONVlXNGdZMjlzYjNJZ2RHOGdkR2hsSUhSbGVIUXVYRzRnSUNBcUlFQnpkVzF0WVhKNUlFZGxkSFJsY2lCMGFHRjBJSEpsZEhWeWJuTWdZU0J1WlhjZ1UzUjViR1ZrVTNSeWFXNW5JSGRwZEdnZ1kzbGhiaUJtYjNKbFozSnZkVzVrSUdOdmJHOXlMbHh1SUNBZ0tpOWNiaUFnWTNsaGJpRTZJRk4wZVd4bFpGTjBjbWx1Wnp0Y2JseHVJQ0F2S2lwY2JpQWdJQ29nUUdSbGMyTnlhWEIwYVc5dUlFRndjR3hwWlhNZ2QyaHBkR1VnWTI5c2IzSWdkRzhnZEdobElIUmxlSFF1WEc0Z0lDQXFJRUJ6ZFcxdFlYSjVJRWRsZEhSbGNpQjBhR0YwSUhKbGRIVnlibk1nWVNCdVpYY2dVM1I1YkdWa1UzUnlhVzVuSUhkcGRHZ2dkMmhwZEdVZ1ptOXlaV2R5YjNWdVpDQmpiMnh2Y2k1Y2JpQWdJQ292WEc0Z0lIZG9hWFJsSVRvZ1UzUjViR1ZrVTNSeWFXNW5PMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkFaR1Z6WTNKcGNIUnBiMjRnUVhCd2JHbGxjeUJpY21sbmFIUWdZbXhoWTJzZ0tHZHlZWGtwSUdOdmJHOXlJSFJ2SUhSb1pTQjBaWGgwTGx4dUlDQWdLaUJBYzNWdGJXRnllU0JIWlhSMFpYSWdkR2hoZENCeVpYUjFjbTV6SUdFZ2JtVjNJRk4wZVd4bFpGTjBjbWx1WnlCM2FYUm9JR0p5YVdkb2RDQmliR0ZqYXlCbWIzSmxaM0p2ZFc1a0lHTnZiRzl5TGx4dUlDQWdLaTljYmlBZ1luSnBaMmgwUW14aFkyc2hPaUJUZEhsc1pXUlRkSEpwYm1jN1hHNWNiaUFnTHlvcVhHNGdJQ0FxSUVCa1pYTmpjbWx3ZEdsdmJpQkJjSEJzYVdWeklHSnlhV2RvZENCeVpXUWdZMjlzYjNJZ2RHOGdkR2hsSUhSbGVIUXVYRzRnSUNBcUlFQnpkVzF0WVhKNUlFZGxkSFJsY2lCMGFHRjBJSEpsZEhWeWJuTWdZU0J1WlhjZ1UzUjViR1ZrVTNSeWFXNW5JSGRwZEdnZ1luSnBaMmgwSUhKbFpDQm1iM0psWjNKdmRXNWtJR052Ykc5eUxseHVJQ0FnS2k5Y2JpQWdZbkpwWjJoMFVtVmtJVG9nVTNSNWJHVmtVM1J5YVc1bk8xeHVYRzRnSUM4cUtseHVJQ0FnS2lCQVpHVnpZM0pwY0hScGIyNGdRWEJ3YkdsbGN5QmljbWxuYUhRZ1ozSmxaVzRnWTI5c2IzSWdkRzhnZEdobElIUmxlSFF1WEc0Z0lDQXFJRUJ6ZFcxdFlYSjVJRWRsZEhSbGNpQjBhR0YwSUhKbGRIVnlibk1nWVNCdVpYY2dVM1I1YkdWa1UzUnlhVzVuSUhkcGRHZ2dZbkpwWjJoMElHZHlaV1Z1SUdadmNtVm5jbTkxYm1RZ1kyOXNiM0l1WEc0Z0lDQXFMMXh1SUNCaWNtbG5hSFJIY21WbGJpRTZJRk4wZVd4bFpGTjBjbWx1Wnp0Y2JseHVJQ0F2S2lwY2JpQWdJQ29nUUdSbGMyTnlhWEIwYVc5dUlFRndjR3hwWlhNZ1luSnBaMmgwSUhsbGJHeHZkeUJqYjJ4dmNpQjBieUIwYUdVZ2RHVjRkQzVjYmlBZ0lDb2dRSE4xYlcxaGNua2dSMlYwZEdWeUlIUm9ZWFFnY21WMGRYSnVjeUJoSUc1bGR5QlRkSGxzWldSVGRISnBibWNnZDJsMGFDQmljbWxuYUhRZ2VXVnNiRzkzSUdadmNtVm5jbTkxYm1RZ1kyOXNiM0l1WEc0Z0lDQXFMMXh1SUNCaWNtbG5hSFJaWld4c2IzY2hPaUJUZEhsc1pXUlRkSEpwYm1jN1hHNWNiaUFnTHlvcVhHNGdJQ0FxSUVCa1pYTmpjbWx3ZEdsdmJpQkJjSEJzYVdWeklHSnlhV2RvZENCaWJIVmxJR052Ykc5eUlIUnZJSFJvWlNCMFpYaDBMbHh1SUNBZ0tpQkFjM1Z0YldGeWVTQkhaWFIwWlhJZ2RHaGhkQ0J5WlhSMWNtNXpJR0VnYm1WM0lGTjBlV3hsWkZOMGNtbHVaeUIzYVhSb0lHSnlhV2RvZENCaWJIVmxJR1p2Y21WbmNtOTFibVFnWTI5c2IzSXVYRzRnSUNBcUwxeHVJQ0JpY21sbmFIUkNiSFZsSVRvZ1UzUjViR1ZrVTNSeWFXNW5PMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkFaR1Z6WTNKcGNIUnBiMjRnUVhCd2JHbGxjeUJpY21sbmFIUWdiV0ZuWlc1MFlTQmpiMnh2Y2lCMGJ5QjBhR1VnZEdWNGRDNWNiaUFnSUNvZ1FITjFiVzFoY25rZ1IyVjBkR1Z5SUhSb1lYUWdjbVYwZFhKdWN5QmhJRzVsZHlCVGRIbHNaV1JUZEhKcGJtY2dkMmwwYUNCaWNtbG5hSFFnYldGblpXNTBZU0JtYjNKbFozSnZkVzVrSUdOdmJHOXlMbHh1SUNBZ0tpOWNiaUFnWW5KcFoyaDBUV0ZuWlc1MFlTRTZJRk4wZVd4bFpGTjBjbWx1Wnp0Y2JseHVJQ0F2S2lwY2JpQWdJQ29nUUdSbGMyTnlhWEIwYVc5dUlFRndjR3hwWlhNZ1luSnBaMmgwSUdONVlXNGdZMjlzYjNJZ2RHOGdkR2hsSUhSbGVIUXVYRzRnSUNBcUlFQnpkVzF0WVhKNUlFZGxkSFJsY2lCMGFHRjBJSEpsZEhWeWJuTWdZU0J1WlhjZ1UzUjViR1ZrVTNSeWFXNW5JSGRwZEdnZ1luSnBaMmgwSUdONVlXNGdabTl5WldkeWIzVnVaQ0JqYjJ4dmNpNWNiaUFnSUNvdlhHNGdJR0p5YVdkb2RFTjVZVzRoT2lCVGRIbHNaV1JUZEhKcGJtYzdYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFQmtaWE5qY21sd2RHbHZiaUJCY0hCc2FXVnpJR0p5YVdkb2RDQjNhR2wwWlNCamIyeHZjaUIwYnlCMGFHVWdkR1Y0ZEM1Y2JpQWdJQ29nUUhOMWJXMWhjbmtnUjJWMGRHVnlJSFJvWVhRZ2NtVjBkWEp1Y3lCaElHNWxkeUJUZEhsc1pXUlRkSEpwYm1jZ2QybDBhQ0JpY21sbmFIUWdkMmhwZEdVZ1ptOXlaV2R5YjNWdVpDQmpiMnh2Y2k1Y2JpQWdJQ292WEc0Z0lHSnlhV2RvZEZkb2FYUmxJVG9nVTNSNWJHVmtVM1J5YVc1bk8xeHVYRzRnSUM4cUtseHVJQ0FnS2lCQVpHVnpZM0pwY0hScGIyNGdRWEJ3YkdsbGN5QmliR0ZqYXlCaVlXTnJaM0p2ZFc1a0lHTnZiRzl5SUhSdklIUm9aU0IwWlhoMExseHVJQ0FnS2lCQWMzVnRiV0Z5ZVNCSFpYUjBaWElnZEdoaGRDQnlaWFIxY201eklHRWdibVYzSUZOMGVXeGxaRk4wY21sdVp5QjNhWFJvSUdKc1lXTnJJR0poWTJ0bmNtOTFibVFnWTI5c2IzSXVYRzRnSUNBcUwxeHVJQ0JpWjBKc1lXTnJJVG9nVTNSNWJHVmtVM1J5YVc1bk8xeHVYRzRnSUM4cUtseHVJQ0FnS2lCQVpHVnpZM0pwY0hScGIyNGdRWEJ3YkdsbGN5QnlaV1FnWW1GamEyZHliM1Z1WkNCamIyeHZjaUIwYnlCMGFHVWdkR1Y0ZEM1Y2JpQWdJQ29nUUhOMWJXMWhjbmtnUjJWMGRHVnlJSFJvWVhRZ2NtVjBkWEp1Y3lCaElHNWxkeUJUZEhsc1pXUlRkSEpwYm1jZ2QybDBhQ0J5WldRZ1ltRmphMmR5YjNWdVpDQmpiMnh2Y2k1Y2JpQWdJQ292WEc0Z0lHSm5VbVZrSVRvZ1UzUjViR1ZrVTNSeWFXNW5PMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkFaR1Z6WTNKcGNIUnBiMjRnUVhCd2JHbGxjeUJuY21WbGJpQmlZV05yWjNKdmRXNWtJR052Ykc5eUlIUnZJSFJvWlNCMFpYaDBMbHh1SUNBZ0tpQkFjM1Z0YldGeWVTQkhaWFIwWlhJZ2RHaGhkQ0J5WlhSMWNtNXpJR0VnYm1WM0lGTjBlV3hsWkZOMGNtbHVaeUIzYVhSb0lHZHlaV1Z1SUdKaFkydG5jbTkxYm1RZ1kyOXNiM0l1WEc0Z0lDQXFMMXh1SUNCaVowZHlaV1Z1SVRvZ1UzUjViR1ZrVTNSeWFXNW5PMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkFaR1Z6WTNKcGNIUnBiMjRnUVhCd2JHbGxjeUI1Wld4c2IzY2dZbUZqYTJkeWIzVnVaQ0JqYjJ4dmNpQjBieUIwYUdVZ2RHVjRkQzVjYmlBZ0lDb2dRSE4xYlcxaGNua2dSMlYwZEdWeUlIUm9ZWFFnY21WMGRYSnVjeUJoSUc1bGR5QlRkSGxzWldSVGRISnBibWNnZDJsMGFDQjVaV3hzYjNjZ1ltRmphMmR5YjNWdVpDQmpiMnh2Y2k1Y2JpQWdJQ292WEc0Z0lHSm5XV1ZzYkc5M0lUb2dVM1I1YkdWa1UzUnlhVzVuTzF4dVhHNGdJQzhxS2x4dUlDQWdLaUJBWkdWelkzSnBjSFJwYjI0Z1FYQndiR2xsY3lCaWJIVmxJR0poWTJ0bmNtOTFibVFnWTI5c2IzSWdkRzhnZEdobElIUmxlSFF1WEc0Z0lDQXFJRUJ6ZFcxdFlYSjVJRWRsZEhSbGNpQjBhR0YwSUhKbGRIVnlibk1nWVNCdVpYY2dVM1I1YkdWa1UzUnlhVzVuSUhkcGRHZ2dZbXgxWlNCaVlXTnJaM0p2ZFc1a0lHTnZiRzl5TGx4dUlDQWdLaTljYmlBZ1ltZENiSFZsSVRvZ1UzUjViR1ZrVTNSeWFXNW5PMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkFaR1Z6WTNKcGNIUnBiMjRnUVhCd2JHbGxjeUJ0WVdkbGJuUmhJR0poWTJ0bmNtOTFibVFnWTI5c2IzSWdkRzhnZEdobElIUmxlSFF1WEc0Z0lDQXFJRUJ6ZFcxdFlYSjVJRWRsZEhSbGNpQjBhR0YwSUhKbGRIVnlibk1nWVNCdVpYY2dVM1I1YkdWa1UzUnlhVzVuSUhkcGRHZ2diV0ZuWlc1MFlTQmlZV05yWjNKdmRXNWtJR052Ykc5eUxseHVJQ0FnS2k5Y2JpQWdZbWROWVdkbGJuUmhJVG9nVTNSNWJHVmtVM1J5YVc1bk8xeHVYRzRnSUM4cUtseHVJQ0FnS2lCQVpHVnpZM0pwY0hScGIyNGdRWEJ3YkdsbGN5QmplV0Z1SUdKaFkydG5jbTkxYm1RZ1kyOXNiM0lnZEc4Z2RHaGxJSFJsZUhRdVhHNGdJQ0FxSUVCemRXMXRZWEo1SUVkbGRIUmxjaUIwYUdGMElISmxkSFZ5Ym5NZ1lTQnVaWGNnVTNSNWJHVmtVM1J5YVc1bklIZHBkR2dnWTNsaGJpQmlZV05yWjNKdmRXNWtJR052Ykc5eUxseHVJQ0FnS2k5Y2JpQWdZbWREZVdGdUlUb2dVM1I1YkdWa1UzUnlhVzVuTzF4dVhHNGdJQzhxS2x4dUlDQWdLaUJBWkdWelkzSnBjSFJwYjI0Z1FYQndiR2xsY3lCM2FHbDBaU0JpWVdOclozSnZkVzVrSUdOdmJHOXlJSFJ2SUhSb1pTQjBaWGgwTGx4dUlDQWdLaUJBYzNWdGJXRnllU0JIWlhSMFpYSWdkR2hoZENCeVpYUjFjbTV6SUdFZ2JtVjNJRk4wZVd4bFpGTjBjbWx1WnlCM2FYUm9JSGRvYVhSbElHSmhZMnRuY205MWJtUWdZMjlzYjNJdVhHNGdJQ0FxTDF4dUlDQmlaMWRvYVhSbElUb2dVM1I1YkdWa1UzUnlhVzVuTzF4dVhHNGdJQzhxS2x4dUlDQWdLaUJBWkdWelkzSnBjSFJwYjI0Z1FYQndiR2xsY3lCaWNtbG5hSFFnWW14aFkyc2dLR2R5WVhrcElHSmhZMnRuY205MWJtUWdZMjlzYjNJZ2RHOGdkR2hsSUhSbGVIUXVYRzRnSUNBcUlFQnpkVzF0WVhKNUlFZGxkSFJsY2lCMGFHRjBJSEpsZEhWeWJuTWdZU0J1WlhjZ1UzUjViR1ZrVTNSeWFXNW5JSGRwZEdnZ1luSnBaMmgwSUdKc1lXTnJJR0poWTJ0bmNtOTFibVFnWTI5c2IzSXVYRzRnSUNBcUwxeHVJQ0JpWjBKeWFXZG9kRUpzWVdOcklUb2dVM1I1YkdWa1UzUnlhVzVuTzF4dVhHNGdJQzhxS2x4dUlDQWdLaUJBWkdWelkzSnBjSFJwYjI0Z1FYQndiR2xsY3lCaWNtbG5hSFFnY21Wa0lHSmhZMnRuY205MWJtUWdZMjlzYjNJZ2RHOGdkR2hsSUhSbGVIUXVYRzRnSUNBcUlFQnpkVzF0WVhKNUlFZGxkSFJsY2lCMGFHRjBJSEpsZEhWeWJuTWdZU0J1WlhjZ1UzUjViR1ZrVTNSeWFXNW5JSGRwZEdnZ1luSnBaMmgwSUhKbFpDQmlZV05yWjNKdmRXNWtJR052Ykc5eUxseHVJQ0FnS2k5Y2JpQWdZbWRDY21sbmFIUlNaV1FoT2lCVGRIbHNaV1JUZEhKcGJtYzdYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFQmtaWE5qY21sd2RHbHZiaUJCY0hCc2FXVnpJR0p5YVdkb2RDQm5jbVZsYmlCaVlXTnJaM0p2ZFc1a0lHTnZiRzl5SUhSdklIUm9aU0IwWlhoMExseHVJQ0FnS2lCQWMzVnRiV0Z5ZVNCSFpYUjBaWElnZEdoaGRDQnlaWFIxY201eklHRWdibVYzSUZOMGVXeGxaRk4wY21sdVp5QjNhWFJvSUdKeWFXZG9kQ0JuY21WbGJpQmlZV05yWjNKdmRXNWtJR052Ykc5eUxseHVJQ0FnS2k5Y2JpQWdZbWRDY21sbmFIUkhjbVZsYmlFNklGTjBlV3hsWkZOMGNtbHVaenRjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRR1JsYzJOeWFYQjBhVzl1SUVGd2NHeHBaWE1nWW5KcFoyaDBJSGxsYkd4dmR5QmlZV05yWjNKdmRXNWtJR052Ykc5eUlIUnZJSFJvWlNCMFpYaDBMbHh1SUNBZ0tpQkFjM1Z0YldGeWVTQkhaWFIwWlhJZ2RHaGhkQ0J5WlhSMWNtNXpJR0VnYm1WM0lGTjBlV3hsWkZOMGNtbHVaeUIzYVhSb0lHSnlhV2RvZENCNVpXeHNiM2NnWW1GamEyZHliM1Z1WkNCamIyeHZjaTVjYmlBZ0lDb3ZYRzRnSUdKblFuSnBaMmgwV1dWc2JHOTNJVG9nVTNSNWJHVmtVM1J5YVc1bk8xeHVYRzRnSUM4cUtseHVJQ0FnS2lCQVpHVnpZM0pwY0hScGIyNGdRWEJ3YkdsbGN5QmljbWxuYUhRZ1lteDFaU0JpWVdOclozSnZkVzVrSUdOdmJHOXlJSFJ2SUhSb1pTQjBaWGgwTGx4dUlDQWdLaUJBYzNWdGJXRnllU0JIWlhSMFpYSWdkR2hoZENCeVpYUjFjbTV6SUdFZ2JtVjNJRk4wZVd4bFpGTjBjbWx1WnlCM2FYUm9JR0p5YVdkb2RDQmliSFZsSUdKaFkydG5jbTkxYm1RZ1kyOXNiM0l1WEc0Z0lDQXFMMXh1SUNCaVowSnlhV2RvZEVKc2RXVWhPaUJUZEhsc1pXUlRkSEpwYm1jN1hHNWNiaUFnTHlvcVhHNGdJQ0FxSUVCa1pYTmpjbWx3ZEdsdmJpQkJjSEJzYVdWeklHSnlhV2RvZENCdFlXZGxiblJoSUdKaFkydG5jbTkxYm1RZ1kyOXNiM0lnZEc4Z2RHaGxJSFJsZUhRdVhHNGdJQ0FxSUVCemRXMXRZWEo1SUVkbGRIUmxjaUIwYUdGMElISmxkSFZ5Ym5NZ1lTQnVaWGNnVTNSNWJHVmtVM1J5YVc1bklIZHBkR2dnWW5KcFoyaDBJRzFoWjJWdWRHRWdZbUZqYTJkeWIzVnVaQ0JqYjJ4dmNpNWNiaUFnSUNvdlhHNGdJR0puUW5KcFoyaDBUV0ZuWlc1MFlTRTZJRk4wZVd4bFpGTjBjbWx1Wnp0Y2JseHVJQ0F2S2lwY2JpQWdJQ29nUUdSbGMyTnlhWEIwYVc5dUlFRndjR3hwWlhNZ1luSnBaMmgwSUdONVlXNGdZbUZqYTJkeWIzVnVaQ0JqYjJ4dmNpQjBieUIwYUdVZ2RHVjRkQzVjYmlBZ0lDb2dRSE4xYlcxaGNua2dSMlYwZEdWeUlIUm9ZWFFnY21WMGRYSnVjeUJoSUc1bGR5QlRkSGxzWldSVGRISnBibWNnZDJsMGFDQmljbWxuYUhRZ1kzbGhiaUJpWVdOclozSnZkVzVrSUdOdmJHOXlMbHh1SUNBZ0tpOWNiaUFnWW1kQ2NtbG5hSFJEZVdGdUlUb2dVM1I1YkdWa1UzUnlhVzVuTzF4dVhHNGdJQzhxS2x4dUlDQWdLaUJBWkdWelkzSnBjSFJwYjI0Z1FYQndiR2xsY3lCaWNtbG5hSFFnZDJocGRHVWdZbUZqYTJkeWIzVnVaQ0JqYjJ4dmNpQjBieUIwYUdVZ2RHVjRkQzVjYmlBZ0lDb2dRSE4xYlcxaGNua2dSMlYwZEdWeUlIUm9ZWFFnY21WMGRYSnVjeUJoSUc1bGR5QlRkSGxzWldSVGRISnBibWNnZDJsMGFDQmljbWxuYUhRZ2QyaHBkR1VnWW1GamEyZHliM1Z1WkNCamIyeHZjaTVjYmlBZ0lDb3ZYRzRnSUdKblFuSnBaMmgwVjJocGRHVWhPaUJUZEhsc1pXUlRkSEpwYm1jN1hHNWNiaUFnTHlvcVhHNGdJQ0FxSUVCa1pYTmpjbWx3ZEdsdmJpQlNaWE5sZEhNZ1lXeHNJSE4wZVd4cGJtY2dZWEJ3YkdsbFpDQjBieUIwYUdVZ2RHVjRkQzVjYmlBZ0lDb2dRSE4xYlcxaGNua2dSMlYwZEdWeUlIUm9ZWFFnY21WMGRYSnVjeUJoSUc1bGR5QlRkSGxzWldSVGRISnBibWNnZDJsMGFDQmhiR3dnYzNSNWJHbHVaeUJ5WlhObGRDNWNiaUFnSUNvdlhHNGdJSEpsYzJWMElUb2dVM1I1YkdWa1UzUnlhVzVuTzF4dVhHNGdJQzhxS2x4dUlDQWdLaUJBWkdWelkzSnBjSFJwYjI0Z1FYQndiR2xsY3lCaWIyeGtJSE4wZVd4bElIUnZJSFJvWlNCMFpYaDBMbHh1SUNBZ0tpQkFjM1Z0YldGeWVTQkhaWFIwWlhJZ2RHaGhkQ0J5WlhSMWNtNXpJR0VnYm1WM0lGTjBlV3hsWkZOMGNtbHVaeUIzYVhSb0lHSnZiR1FnYzNSNWJHVXVYRzRnSUNBcUwxeHVJQ0JpYjJ4a0lUb2dVM1I1YkdWa1UzUnlhVzVuTzF4dVhHNGdJQzhxS2x4dUlDQWdLaUJBWkdWelkzSnBjSFJwYjI0Z1FYQndiR2xsY3lCa2FXMGdLR1JsWTNKbFlYTmxaQ0JwYm5SbGJuTnBkSGtwSUhOMGVXeGxJSFJ2SUhSb1pTQjBaWGgwTGx4dUlDQWdLaUJBYzNWdGJXRnllU0JIWlhSMFpYSWdkR2hoZENCeVpYUjFjbTV6SUdFZ2JtVjNJRk4wZVd4bFpGTjBjbWx1WnlCM2FYUm9JR1JwYlNCemRIbHNaUzVjYmlBZ0lDb3ZYRzRnSUdScGJTRTZJRk4wZVd4bFpGTjBjbWx1Wnp0Y2JseHVJQ0F2S2lwY2JpQWdJQ29nUUdSbGMyTnlhWEIwYVc5dUlFRndjR3hwWlhNZ2FYUmhiR2xqSUhOMGVXeGxJSFJ2SUhSb1pTQjBaWGgwTGx4dUlDQWdLaUJBYzNWdGJXRnllU0JIWlhSMFpYSWdkR2hoZENCeVpYUjFjbTV6SUdFZ2JtVjNJRk4wZVd4bFpGTjBjbWx1WnlCM2FYUm9JR2wwWVd4cFl5QnpkSGxzWlM1Y2JpQWdJQ292WEc0Z0lHbDBZV3hwWXlFNklGTjBlV3hsWkZOMGNtbHVaenRjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRR1JsYzJOeWFYQjBhVzl1SUVGd2NHeHBaWE1nZFc1a1pYSnNhVzVsSUhOMGVXeGxJSFJ2SUhSb1pTQjBaWGgwTGx4dUlDQWdLaUJBYzNWdGJXRnllU0JIWlhSMFpYSWdkR2hoZENCeVpYUjFjbTV6SUdFZ2JtVjNJRk4wZVd4bFpGTjBjbWx1WnlCM2FYUm9JSFZ1WkdWeWJHbHVaU0J6ZEhsc1pTNWNiaUFnSUNvdlhHNGdJSFZ1WkdWeWJHbHVaU0U2SUZOMGVXeGxaRk4wY21sdVp6dGNibHh1SUNBdktpcGNiaUFnSUNvZ1FHUmxjMk55YVhCMGFXOXVJRUZ3Y0d4cFpYTWdZbXhwYm10cGJtY2djM1I1YkdVZ2RHOGdkR2hsSUhSbGVIUXVYRzRnSUNBcUlFQnpkVzF0WVhKNUlFZGxkSFJsY2lCMGFHRjBJSEpsZEhWeWJuTWdZU0J1WlhjZ1UzUjViR1ZrVTNSeWFXNW5JSGRwZEdnZ1lteHBibXRwYm1jZ2MzUjViR1V1WEc0Z0lDQXFMMXh1SUNCaWJHbHVheUU2SUZOMGVXeGxaRk4wY21sdVp6dGNibHh1SUNBdktpcGNiaUFnSUNvZ1FHUmxjMk55YVhCMGFXOXVJRWx1ZG1WeWRITWdkR2hsSUdadmNtVm5jbTkxYm1RZ1lXNWtJR0poWTJ0bmNtOTFibVFnWTI5c2IzSnpJRzltSUhSb1pTQjBaWGgwTGx4dUlDQWdLaUJBYzNWdGJXRnllU0JIWlhSMFpYSWdkR2hoZENCeVpYUjFjbTV6SUdFZ2JtVjNJRk4wZVd4bFpGTjBjbWx1WnlCM2FYUm9JR2x1ZG1WeWRHVmtJR052Ykc5eWN5NWNiaUFnSUNvdlhHNGdJR2x1ZG1WeWMyVWhPaUJUZEhsc1pXUlRkSEpwYm1jN1hHNWNiaUFnTHlvcVhHNGdJQ0FxSUVCa1pYTmpjbWx3ZEdsdmJpQklhV1JsY3lCMGFHVWdkR1Y0ZENBb2MyRnRaU0JqYjJ4dmNpQmhjeUJpWVdOclozSnZkVzVrS1M1Y2JpQWdJQ29nUUhOMWJXMWhjbmtnUjJWMGRHVnlJSFJvWVhRZ2NtVjBkWEp1Y3lCaElHNWxkeUJUZEhsc1pXUlRkSEpwYm1jZ2QybDBhQ0JvYVdSa1pXNGdkR1Y0ZEM1Y2JpQWdJQ292WEc0Z0lHaHBaR1JsYmlFNklGTjBlV3hsWkZOMGNtbHVaenRjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRR1JsYzJOeWFYQjBhVzl1SUVGd2NHeHBaWE1nYzNSeWFXdGxkR2h5YjNWbmFDQnpkSGxzWlNCMGJ5QjBhR1VnZEdWNGRDNWNiaUFnSUNvZ1FITjFiVzFoY25rZ1IyVjBkR1Z5SUhSb1lYUWdjbVYwZFhKdWN5QmhJRzVsZHlCVGRIbHNaV1JUZEhKcGJtY2dkMmwwYUNCemRISnBhMlYwYUhKdmRXZG9JSE4wZVd4bExseHVJQ0FnS2k5Y2JpQWdjM1J5YVd0bGRHaHliM1ZuYUNFNklGTjBlV3hsWkZOMGNtbHVaenRjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRR1JsYzJOeWFYQjBhVzl1SUVGd2NHeHBaWE1nWkc5MVlteGxJSFZ1WkdWeWJHbHVaU0J6ZEhsc1pTQjBieUIwYUdVZ2RHVjRkQzVjYmlBZ0lDb2dRSE4xYlcxaGNua2dSMlYwZEdWeUlIUm9ZWFFnY21WMGRYSnVjeUJoSUc1bGR5QlRkSGxzWldSVGRISnBibWNnZDJsMGFDQmtiM1ZpYkdVZ2RXNWtaWEpzYVc1bElITjBlV3hsTGx4dUlDQWdLaTljYmlBZ1pHOTFZbXhsVlc1a1pYSnNhVzVsSVRvZ1UzUjViR1ZrVTNSeWFXNW5PMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkFaR1Z6WTNKcGNIUnBiMjRnVW1WelpYUnpJSFJvWlNCMFpYaDBJR052Ykc5eUlIUnZJRzV2Y20xaGJDQnBiblJsYm5OcGRIa3VYRzRnSUNBcUlFQnpkVzF0WVhKNUlFZGxkSFJsY2lCMGFHRjBJSEpsZEhWeWJuTWdZU0J1WlhjZ1UzUjViR1ZrVTNSeWFXNW5JSGRwZEdnZ2JtOXliV0ZzSUdOdmJHOXlJR2x1ZEdWdWMybDBlUzVjYmlBZ0lDb3ZYRzRnSUc1dmNtMWhiRU52Ykc5eUlUb2dVM1I1YkdWa1UzUnlhVzVuTzF4dVhHNGdJQzhxS2x4dUlDQWdLaUJBWkdWelkzSnBjSFJwYjI0Z1VtVnRiM1psY3lCcGRHRnNhV01nYjNJZ1puSmhhM1IxY2lCemRIbHNaU0JtY205dElIUm9aU0IwWlhoMExseHVJQ0FnS2lCQWMzVnRiV0Z5ZVNCSFpYUjBaWElnZEdoaGRDQnlaWFIxY201eklHRWdibVYzSUZOMGVXeGxaRk4wY21sdVp5QjNhWFJvSUdsMFlXeHBZeUJ2Y2lCbWNtRnJkSFZ5SUhOMGVXeGxJSEpsYlc5MlpXUXVYRzRnSUNBcUwxeHVJQ0J1YjBsMFlXeHBZMDl5Um5KaGEzUjFjaUU2SUZOMGVXeGxaRk4wY21sdVp6dGNibHh1SUNBdktpcGNiaUFnSUNvZ1FHUmxjMk55YVhCMGFXOXVJRkpsYlc5MlpYTWdkVzVrWlhKc2FXNWxJSE4wZVd4bElHWnliMjBnZEdobElIUmxlSFF1WEc0Z0lDQXFJRUJ6ZFcxdFlYSjVJRWRsZEhSbGNpQjBhR0YwSUhKbGRIVnlibk1nWVNCdVpYY2dVM1I1YkdWa1UzUnlhVzVuSUhkcGRHZ2dkVzVrWlhKc2FXNWxJSE4wZVd4bElISmxiVzkyWldRdVhHNGdJQ0FxTDF4dUlDQnViMVZ1WkdWeWJHbHVaU0U2SUZOMGVXeGxaRk4wY21sdVp6dGNibHh1SUNBdktpcGNiaUFnSUNvZ1FHUmxjMk55YVhCMGFXOXVJRkpsYlc5MlpYTWdZbXhwYm10cGJtY2djM1I1YkdVZ1puSnZiU0IwYUdVZ2RHVjRkQzVjYmlBZ0lDb2dRSE4xYlcxaGNua2dSMlYwZEdWeUlIUm9ZWFFnY21WMGRYSnVjeUJoSUc1bGR5QlRkSGxzWldSVGRISnBibWNnZDJsMGFDQmliR2x1YTJsdVp5QnpkSGxzWlNCeVpXMXZkbVZrTGx4dUlDQWdLaTljYmlBZ2JtOUNiR2x1YXlFNklGTjBlV3hsWkZOMGNtbHVaenRjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRR1JsYzJOeWFYQjBhVzl1SUZKbGJXOTJaWE1nWTI5c2IzSWdhVzUyWlhKemFXOXVJR1p5YjIwZ2RHaGxJSFJsZUhRdVhHNGdJQ0FxSUVCemRXMXRZWEo1SUVkbGRIUmxjaUIwYUdGMElISmxkSFZ5Ym5NZ1lTQnVaWGNnVTNSNWJHVmtVM1J5YVc1bklIZHBkR2dnWTI5c2IzSWdhVzUyWlhKemFXOXVJSEpsYlc5MlpXUXVYRzRnSUNBcUwxeHVJQ0J1YjBsdWRtVnljMlVoT2lCVGRIbHNaV1JUZEhKcGJtYzdYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFQmtaWE5qY21sd2RHbHZiaUJTWlcxdmRtVnpJR2hwWkdSbGJpQnpkSGxzWlNCbWNtOXRJSFJvWlNCMFpYaDBMbHh1SUNBZ0tpQkFjM1Z0YldGeWVTQkhaWFIwWlhJZ2RHaGhkQ0J5WlhSMWNtNXpJR0VnYm1WM0lGTjBlV3hsWkZOMGNtbHVaeUIzYVhSb0lHaHBaR1JsYmlCemRIbHNaU0J5WlcxdmRtVmtMbHh1SUNBZ0tpOWNiaUFnYm05SWFXUmtaVzRoT2lCVGRIbHNaV1JUZEhKcGJtYzdYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFQmtaWE5qY21sd2RHbHZiaUJTWlcxdmRtVnpJSE4wY21sclpYUm9jbTkxWjJnZ2MzUjViR1VnWm5KdmJTQjBhR1VnZEdWNGRDNWNiaUFnSUNvZ1FITjFiVzFoY25rZ1IyVjBkR1Z5SUhSb1lYUWdjbVYwZFhKdWN5QmhJRzVsZHlCVGRIbHNaV1JUZEhKcGJtY2dkMmwwYUNCemRISnBhMlYwYUhKdmRXZG9JSE4wZVd4bElISmxiVzkyWldRdVhHNGdJQ0FxTDF4dUlDQnViMU4wY21sclpYUm9jbTkxWjJnaE9pQlRkSGxzWldSVGRISnBibWM3WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRUJrWlhOamNtbHdkR2x2YmlCVWFHVWdkR1Y0ZEZ4dUlDQWdLaUJBYzNWdGJXRnllU0JVYUdVZ2MzUjViR1ZrSUhSbGVIUWdZWE1nWVNCeVpXZDFiR0Z5SUhOMGNtbHVaeTVjYmlBZ0lDb3ZYRzRnSUhSbGVIUWhPaUJ6ZEhKcGJtYzdYRzVjYmlBZ1kyOXVjM1J5ZFdOMGIzSW9kR1Y0ZERvZ2MzUnlhVzVuS1NCN1hHNGdJQ0FnZEdocGN5NTBaWGgwSUQwZ2RHVjRkRHRjYmlBZ0lDQXZMeUJDWVhOcFl5QmpiMnh2Y25OY2JpQWdJQ0JQWW1wbFkzUXVaVzUwY21sbGN5aFRkR0Z1WkdGeVpFWnZjbVZuY205MWJtUkRiMnh2Y25NcExtWnZja1ZoWTJnb0tGdHVZVzFsTENCamIyUmxYU2tnUFQ0Z2UxeHVJQ0FnSUNBZ1QySnFaV04wTG1SbFptbHVaVkJ5YjNCbGNuUjVLSFJvYVhNc0lHNWhiV1VzSUh0Y2JpQWdJQ0FnSUNBZ1oyVjBPaUFvS1NBOVBpQjBhR2x6TG1admNtVm5jbTkxYm1Rb1kyOWtaU2tzWEc0Z0lDQWdJQ0I5S1R0Y2JpQWdJQ0I5S1R0Y2JseHVJQ0FnSUU5aWFtVmpkQzVsYm5SeWFXVnpLRUp5YVdkb2RFWnZjbVZuY205MWJtUkRiMnh2Y25NcExtWnZja1ZoWTJnb0tGdHVZVzFsTENCamIyUmxYU2tnUFQ0Z2UxeHVJQ0FnSUNBZ1QySnFaV04wTG1SbFptbHVaVkJ5YjNCbGNuUjVLSFJvYVhNc0lHNWhiV1VzSUh0Y2JpQWdJQ0FnSUNBZ1oyVjBPaUFvS1NBOVBpQjBhR2x6TG1admNtVm5jbTkxYm1Rb1kyOWtaU2tzWEc0Z0lDQWdJQ0I5S1R0Y2JpQWdJQ0I5S1R0Y2JseHVJQ0FnSUM4dklFSmhZMnRuY205MWJtUWdZMjlzYjNKelhHNGdJQ0FnVDJKcVpXTjBMbVZ1ZEhKcFpYTW9VM1JoYm1SaGNtUkNZV05yWjNKdmRXNWtRMjlzYjNKektTNW1iM0pGWVdOb0tDaGJibUZ0WlN3Z1kyOWtaVjBwSUQwK0lIdGNiaUFnSUNBZ0lFOWlhbVZqZEM1a1pXWnBibVZRY205d1pYSjBlU2gwYUdsekxDQnVZVzFsTENCN1hHNGdJQ0FnSUNBZ0lHZGxkRG9nS0NrZ1BUNGdkR2hwY3k1aVlXTnJaM0p2ZFc1a0tHTnZaR1VwTEZ4dUlDQWdJQ0FnZlNrN1hHNGdJQ0FnZlNrN1hHNWNiaUFnSUNCUFltcGxZM1F1Wlc1MGNtbGxjeWhDY21sbmFIUkNZV05yWjNKdmRXNWtRMjlzYjNKektTNW1iM0pGWVdOb0tDaGJibUZ0WlN3Z1kyOWtaVjBwSUQwK0lIdGNiaUFnSUNBZ0lFOWlhbVZqZEM1a1pXWnBibVZRY205d1pYSjBlU2gwYUdsekxDQnVZVzFsTENCN1hHNGdJQ0FnSUNBZ0lHZGxkRG9nS0NrZ1BUNGdkR2hwY3k1aVlXTnJaM0p2ZFc1a0tHTnZaR1VwTEZ4dUlDQWdJQ0FnZlNrN1hHNGdJQ0FnZlNrN1hHNWNiaUFnSUNBdkx5QlRkSGxzWlhOY2JpQWdJQ0JQWW1wbFkzUXVaVzUwY21sbGN5aHpkSGxzWlhNcExtWnZja1ZoWTJnb0tGdHVZVzFsTENCamIyUmxYU2tnUFQ0Z2UxeHVJQ0FnSUNBZ1QySnFaV04wTG1SbFptbHVaVkJ5YjNCbGNuUjVLSFJvYVhNc0lHNWhiV1VzSUh0Y2JpQWdJQ0FnSUNBZ1oyVjBPaUFvS1NBOVBpQjBhR2x6TG5OMGVXeGxLR052WkdVcExGeHVJQ0FnSUNBZ2ZTazdYRzRnSUNBZ2ZTazdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nUUdSbGMyTnlhWEIwYVc5dUlFTnNaV0Z5Y3lCaGJHd2djM1I1YkdsdVp5Qm1jbTl0SUhSb1pTQjBaWGgwTGx4dUlDQWdLaUJBYzNWdGJXRnllU0JTWlcxdmRtVnpJR0ZzYkNCQlRsTkpJR052Ykc5eUlHRnVaQ0J6ZEhsc1pTQmpiMlJsY3lCbWNtOXRJSFJvWlNCMFpYaDBMbHh1SUNBZ0tpQkFjbVYwZFhKdUlIdFRkSGxzWldSVGRISnBibWQ5SUZSb1pTQlRkSGxzWldSVGRISnBibWNnYVc1emRHRnVZMlVnZDJsMGFDQmpiR1ZoY21Wa0lITjBlV3hwYm1jdVhHNGdJQ0FxTDF4dUlDQmpiR1ZoY2lncE9pQlRkSGxzWldSVGRISnBibWNnZTF4dUlDQWdJSFJvYVhNdWRHVjRkQ0E5SUdOc1pXRnlLSFJvYVhNdWRHVjRkQ2s3WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE03WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1FHUmxjMk55YVhCMGFXOXVJRUZ3Y0d4cFpYTWdjbUYzSUVGT1Uwa2dZMjlrWlhNZ2RHOGdkR2hsSUhSbGVIUXVYRzRnSUNBcUlFQnpkVzF0WVhKNUlFRnNiRzkzY3lCa2FYSmxZM1FnWVhCd2JHbGpZWFJwYjI0Z2IyWWdRVTVUU1NCbGMyTmhjR1VnYzJWeGRXVnVZMlZ6SUhSdklIUm9aU0IwWlhoMExseHVJQ0FnS2lCQWNHRnlZVzBnZTNOMGNtbHVaMzBnY21GM1FXNXphU0F0SUZSb1pTQnlZWGNnUVU1VFNTQmxjMk5oY0dVZ2MyVnhkV1Z1WTJVZ2RHOGdZWEJ3YkhrdVhHNGdJQ0FxSUVCeVpYUjFjbTRnZTFOMGVXeGxaRk4wY21sdVozMGdWR2hsSUZOMGVXeGxaRk4wY21sdVp5QnBibk4wWVc1alpTQjNhWFJvSUhSb1pTQnlZWGNnUVU1VFNTQmpiMlJsSUdGd2NHeHBaV1F1WEc0Z0lDQXFMMXh1SUNCeVlYY29jbUYzUVc1emFUb2djM1J5YVc1bktUb2dVM1I1YkdWa1UzUnlhVzVuSUh0Y2JpQWdJQ0IwYUdsekxuUmxlSFFnUFNCeVlYY29kR2hwY3k1MFpYaDBMQ0J5WVhkQmJuTnBLVHRjYmlBZ0lDQnlaWFIxY200Z2RHaHBjenRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCQVpHVnpZM0pwY0hScGIyNGdRWEJ3YkdsbGN5QmhJR1p2Y21WbmNtOTFibVFnWTI5c2IzSWdkRzhnZEdobElIUmxlSFF1WEc0Z0lDQXFJRUJ6ZFcxdFlYSjVJRk5sZEhNZ2RHaGxJSFJsZUhRZ1kyOXNiM0lnZFhOcGJtY2dRVTVUU1NCamIyeHZjaUJqYjJSbGN5NWNiaUFnSUNvZ1FIQmhjbUZ0SUh0dWRXMWlaWEo5SUc0Z0xTQlVhR1VnUVU1VFNTQmpiMnh2Y2lCamIyUmxJR1p2Y2lCMGFHVWdabTl5WldkeWIzVnVaQ0JqYjJ4dmNpNWNiaUFnSUNvZ1FISmxkSFZ5YmlCN1UzUjViR1ZrVTNSeWFXNW5mU0JVYUdVZ1UzUjViR1ZrVTNSeWFXNW5JR2x1YzNSaGJtTmxJSGRwZEdnZ2RHaGxJR1p2Y21WbmNtOTFibVFnWTI5c2IzSWdZWEJ3YkdsbFpDNWNiaUFnSUNvdlhHNGdJR1p2Y21WbmNtOTFibVFvYmpvZ2JuVnRZbVZ5S1RvZ1UzUjViR1ZrVTNSeWFXNW5JSHRjYmlBZ0lDQjBhR2x6TG5SbGVIUWdQU0JqYjJ4dmNtbDZaVUZPVTBrb2RHaHBjeTUwWlhoMExDQnVLVHRjYmlBZ0lDQnlaWFIxY200Z2RHaHBjenRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCQVpHVnpZM0pwY0hScGIyNGdRWEJ3YkdsbGN5QmhJR0poWTJ0bmNtOTFibVFnWTI5c2IzSWdkRzhnZEdobElIUmxlSFF1WEc0Z0lDQXFJRUJ6ZFcxdFlYSjVJRk5sZEhNZ2RHaGxJR0poWTJ0bmNtOTFibVFnWTI5c2IzSWdiMllnZEdobElIUmxlSFFnZFhOcGJtY2dRVTVUU1NCamIyeHZjaUJqYjJSbGN5NWNiaUFnSUNvZ1FIQmhjbUZ0SUh0dWRXMWlaWEo5SUc0Z0xTQlVhR1VnUVU1VFNTQmpiMnh2Y2lCamIyUmxJR1p2Y2lCMGFHVWdZbUZqYTJkeWIzVnVaQ0JqYjJ4dmNpNWNiaUFnSUNvZ1FISmxkSFZ5YmlCN1UzUjViR1ZrVTNSeWFXNW5mU0JVYUdVZ1UzUjViR1ZrVTNSeWFXNW5JR2x1YzNSaGJtTmxJSGRwZEdnZ2RHaGxJR0poWTJ0bmNtOTFibVFnWTI5c2IzSWdZWEJ3YkdsbFpDNWNiaUFnSUNvdlhHNGdJR0poWTJ0bmNtOTFibVFvYmpvZ2JuVnRZbVZ5S1RvZ1UzUjViR1ZrVTNSeWFXNW5JSHRjYmlBZ0lDQjBhR2x6TG5SbGVIUWdQU0JqYjJ4dmNtbDZaVUZPVTBrb2RHaHBjeTUwWlhoMExDQnVMQ0IwY25WbEtUdGNiaUFnSUNCeVpYUjFjbTRnZEdocGN6dGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJBWkdWelkzSnBjSFJwYjI0Z1FYQndiR2xsY3lCaElIUmxlSFFnYzNSNWJHVWdkRzhnZEdobElITjBjbWx1Wnk1Y2JpQWdJQ29nUUhOMWJXMWhjbmtnVTJWMGN5QjBaWGgwSUhOMGVXeGxjeUJ6ZFdOb0lHRnpJR0p2YkdRc0lHbDBZV3hwWXl3Z2IzSWdkVzVrWlhKc2FXNWxJSFZ6YVc1bklFRk9VMGtnYzNSNWJHVWdZMjlrWlhNdVhHNGdJQ0FxSUVCd1lYSmhiU0I3Ym5WdFltVnlJSHdnYzNSeWFXNW5mU0J1SUMwZ1ZHaGxJSE4wZVd4bElHTnZaR1VnYjNJZ2EyVjVJR1p5YjIwZ2RHaGxJSE4wZVd4bGN5QnZZbXBsWTNRdVhHNGdJQ0FxSUVCeVpYUjFjbTRnZTFOMGVXeGxaRk4wY21sdVozMGdWR2hsSUZOMGVXeGxaRk4wY21sdVp5QnBibk4wWVc1alpTQjNhWFJvSUhSb1pTQnpkSGxzWlNCaGNIQnNhV1ZrTGx4dUlDQWdLaTljYmlBZ2MzUjViR1VvYmpvZ2JuVnRZbVZ5SUh3Z2EyVjViMllnZEhsd1pXOW1JSE4wZVd4bGN5azZJRk4wZVd4bFpGTjBjbWx1WnlCN1hHNGdJQ0FnYVdZZ0tIUjVjR1Z2WmlCdUlEMDlQU0JjSW5OMGNtbHVaMXdpSUNZbUlDRW9iaUJwYmlCemRIbHNaWE1wS1NCN1hHNGdJQ0FnSUNCamIyNXpiMnhsTG5kaGNtNG9ZRWx1ZG1Gc2FXUWdjM1I1YkdVNklDUjdibjFnS1R0Y2JpQWdJQ0FnSUhKbGRIVnliaUIwYUdsek8xeHVJQ0FnSUgxY2JpQWdJQ0IwYUdsekxuUmxlSFFnUFNCaGNIQnNlVk4wZVd4bEtIUm9hWE11ZEdWNGRDd2diaWs3WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE03WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1FHUmxjMk55YVhCMGFXOXVJRUZ3Y0d4cFpYTWdZU0F5TlRZdFkyOXNiM0lnWm05eVpXZHliM1Z1WkNCamIyeHZjaUIwYnlCMGFHVWdkR1Y0ZEM1Y2JpQWdJQ29nUUhOMWJXMWhjbmtnVTJWMGN5QjBhR1VnZEdWNGRDQmpiMnh2Y2lCMWMybHVaeUIwYUdVZ1pYaDBaVzVrWldRZ01qVTJMV052Ykc5eUlIQmhiR1YwZEdVdVhHNGdJQ0FxSUVCd1lYSmhiU0I3Ym5WdFltVnlmU0J1SUMwZ1ZHaGxJR052Ykc5eUlHNTFiV0psY2lCbWNtOXRJSFJvWlNBeU5UWXRZMjlzYjNJZ2NHRnNaWFIwWlM1Y2JpQWdJQ29nUUhKbGRIVnliaUI3VTNSNWJHVmtVM1J5YVc1bmZTQlVhR1VnVTNSNWJHVmtVM1J5YVc1bklHbHVjM1JoYm1ObElIZHBkR2dnZEdobElESTFOaTFqYjJ4dmNpQm1iM0psWjNKdmRXNWtJR0Z3Y0d4cFpXUXVYRzRnSUNBcUwxeHVJQ0JqYjJ4dmNqSTFOaWh1T2lCdWRXMWlaWElwT2lCVGRIbHNaV1JUZEhKcGJtY2dlMXh1SUNBZ0lIUm9hWE11ZEdWNGRDQTlJR052Ykc5eWFYcGxNalUyS0hSb2FYTXVkR1Y0ZEN3Z2JpazdYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTTdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nUUdSbGMyTnlhWEIwYVc5dUlFRndjR3hwWlhNZ1lTQXlOVFl0WTI5c2IzSWdZbUZqYTJkeWIzVnVaQ0JqYjJ4dmNpQjBieUIwYUdVZ2RHVjRkQzVjYmlBZ0lDb2dRSE4xYlcxaGNua2dVMlYwY3lCMGFHVWdZbUZqYTJkeWIzVnVaQ0JqYjJ4dmNpQjFjMmx1WnlCMGFHVWdaWGgwWlc1a1pXUWdNalUyTFdOdmJHOXlJSEJoYkdWMGRHVXVYRzRnSUNBcUlFQndZWEpoYlNCN2JuVnRZbVZ5ZlNCdUlDMGdWR2hsSUdOdmJHOXlJRzUxYldKbGNpQm1jbTl0SUhSb1pTQXlOVFl0WTI5c2IzSWdjR0ZzWlhSMFpTNWNiaUFnSUNvZ1FISmxkSFZ5YmlCN1UzUjViR1ZrVTNSeWFXNW5mU0JVYUdVZ1UzUjViR1ZrVTNSeWFXNW5JR2x1YzNSaGJtTmxJSGRwZEdnZ2RHaGxJREkxTmkxamIyeHZjaUJpWVdOclozSnZkVzVrSUdGd2NHeHBaV1F1WEc0Z0lDQXFMMXh1SUNCaVowTnZiRzl5TWpVMktHNDZJRzUxYldKbGNpazZJRk4wZVd4bFpGTjBjbWx1WnlCN1hHNGdJQ0FnZEdocGN5NTBaWGgwSUQwZ1kyOXNiM0pwZW1VeU5UWW9kR2hwY3k1MFpYaDBMQ0J1TENCMGNuVmxLVHRjYmlBZ0lDQnlaWFIxY200Z2RHaHBjenRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCQVpHVnpZM0pwY0hScGIyNGdRWEJ3YkdsbGN5QmhiaUJTUjBJZ1ptOXlaV2R5YjNWdVpDQmpiMnh2Y2lCMGJ5QjBhR1VnZEdWNGRDNWNiaUFnSUNvZ1FITjFiVzFoY25rZ1UyVjBjeUIwYUdVZ2RHVjRkQ0JqYjJ4dmNpQjFjMmx1WnlCU1IwSWdkbUZzZFdWekxseHVJQ0FnS2lCQWNHRnlZVzBnZTI1MWJXSmxjbjBnY2lBdElGUm9aU0J5WldRZ1kyOXRjRzl1Wlc1MElDZ3dMVEkxTlNrdVhHNGdJQ0FxSUVCd1lYSmhiU0I3Ym5WdFltVnlmU0JuSUMwZ1ZHaGxJR2R5WldWdUlHTnZiWEJ2Ym1WdWRDQW9NQzB5TlRVcExseHVJQ0FnS2lCQWNHRnlZVzBnZTI1MWJXSmxjbjBnWWlBdElGUm9aU0JpYkhWbElHTnZiWEJ2Ym1WdWRDQW9NQzB5TlRVcExseHVJQ0FnS2lCQWNtVjBkWEp1SUh0VGRIbHNaV1JUZEhKcGJtZDlJRlJvWlNCVGRIbHNaV1JUZEhKcGJtY2dhVzV6ZEdGdVkyVWdkMmwwYUNCMGFHVWdVa2RDSUdadmNtVm5jbTkxYm1RZ1kyOXNiM0lnWVhCd2JHbGxaQzVjYmlBZ0lDb3ZYRzRnSUhKbllpaHlPaUJ1ZFcxaVpYSXNJR2M2SUc1MWJXSmxjaXdnWWpvZ2JuVnRZbVZ5S1RvZ1UzUjViR1ZrVTNSeWFXNW5JSHRjYmlBZ0lDQjBhR2x6TG5SbGVIUWdQU0JqYjJ4dmNtbDZaVkpIUWloMGFHbHpMblJsZUhRc0lISXNJR2NzSUdJcE8xeHVJQ0FnSUhKbGRIVnliaUIwYUdsek8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRUJrWlhOamNtbHdkR2x2YmlCQmNIQnNhV1Z6SUdGdUlGSkhRaUJpWVdOclozSnZkVzVrSUdOdmJHOXlJSFJ2SUhSb1pTQjBaWGgwTGx4dUlDQWdLaUJBYzNWdGJXRnllU0JUWlhSeklIUm9aU0JpWVdOclozSnZkVzVrSUdOdmJHOXlJSFZ6YVc1bklGSkhRaUIyWVd4MVpYTXVYRzRnSUNBcUlFQndZWEpoYlNCN2JuVnRZbVZ5ZlNCeUlDMGdWR2hsSUhKbFpDQmpiMjF3YjI1bGJuUWdLREF0TWpVMUtTNWNiaUFnSUNvZ1FIQmhjbUZ0SUh0dWRXMWlaWEo5SUdjZ0xTQlVhR1VnWjNKbFpXNGdZMjl0Y0c5dVpXNTBJQ2d3TFRJMU5Ta3VYRzRnSUNBcUlFQndZWEpoYlNCN2JuVnRZbVZ5ZlNCaUlDMGdWR2hsSUdKc2RXVWdZMjl0Y0c5dVpXNTBJQ2d3TFRJMU5Ta3VYRzRnSUNBcUlFQnlaWFIxY200Z2UxTjBlV3hsWkZOMGNtbHVaMzBnVkdobElGTjBlV3hsWkZOMGNtbHVaeUJwYm5OMFlXNWpaU0IzYVhSb0lIUm9aU0JTUjBJZ1ltRmphMmR5YjNWdVpDQmpiMnh2Y2lCaGNIQnNhV1ZrTGx4dUlDQWdLaTljYmlBZ1ltZFNaMklvY2pvZ2JuVnRZbVZ5TENCbk9pQnVkVzFpWlhJc0lHSTZJRzUxYldKbGNpazZJRk4wZVd4bFpGTjBjbWx1WnlCN1hHNGdJQ0FnZEdocGN5NTBaWGgwSUQwZ1kyOXNiM0pwZW1WU1IwSW9kR2hwY3k1MFpYaDBMQ0J5TENCbkxDQmlMQ0IwY25WbEtUdGNiaUFnSUNCeVpYUjFjbTRnZEdocGN6dGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJBWkdWelkzSnBjSFJwYjI0Z1EyOXVkbVZ5ZEhNZ2RHaGxJRk4wZVd4bFpGTjBjbWx1WnlCMGJ5QmhJSEpsWjNWc1lYSWdjM1J5YVc1bkxseHVJQ0FnS2lCQWMzVnRiV0Z5ZVNCU1pYUjFjbTV6SUhSb1pTQjFibVJsY214NWFXNW5JSFJsZUhRZ2QybDBhQ0JoYkd3Z1lYQndiR2xsWkNCemRIbHNhVzVuTGx4dUlDQWdLaUJBY21WMGRYSnVJSHR6ZEhKcGJtZDlJRlJvWlNCemRIbHNaV1FnZEdWNGRDQmhjeUJoSUhKbFozVnNZWElnYzNSeWFXNW5MbHh1SUNBZ0tpOWNiaUFnZEc5VGRISnBibWNvS1RvZ2MzUnlhVzVuSUh0Y2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3k1MFpYaDBPMXh1SUNCOVhHNTlYRzVjYmk4cUtseHVJQ29nUUdSbGMyTnlhWEIwYVc5dUlFRndjR3hwWlhNZ2MzUjViR2x1WnlCMGJ5QmhJR2RwZG1WdUlIUmxlSFFnYzNSeWFXNW5MbHh1SUNvZ1FITjFiVzFoY25rZ1ZHaHBjeUJtZFc1amRHbHZiaUIwWVd0bGN5QmhJSE4wY21sdVp5QmhibVFnY21WMGRYSnVjeUJoSUZOMGVXeGxaRk4wY21sdVp5QnZZbXBsWTNRc0lIZG9hV05vSUdseklHRnVJR1Z1YUdGdVkyVmtYRzRnS2lCMlpYSnphVzl1SUc5bUlIUm9aU0J2Y21sbmFXNWhiQ0J6ZEhKcGJtY2dkMmwwYUNCaFpHUnBkR2x2Ym1Gc0lHMWxkR2h2WkhNZ1ptOXlJR0Z3Y0d4NWFXNW5JSFpoY21sdmRYTWdRVTVUU1NCamIyeHZjaUJoYm1RZ2MzUjViR1ZjYmlBcUlHOXdkR2x2Ym5NdUlFbDBJSE5sZEhNZ2RYQWdZU0J0WVhCd1pYSWdiMkpxWldOMElIZHBkR2dnYldWMGFHOWtjeUJtYjNJZ1pHbG1abVZ5Wlc1MElITjBlV3hwYm1jZ2IzQmxjbUYwYVc5dWN5QmhibVFnZEdobGJseHVJQ29nWkdWbWFXNWxjeUJ3Y205d1pYSjBhV1Z6SUc5dUlIUm9aU0IwWlhoMElITjBjbWx1WnlCMGJ5QnRZV3RsSUhSb1pYTmxJRzFsZEdodlpITWdZV05qWlhOemFXSnNaUzVjYmlBcVhHNGdLaUJBY0dGeVlXMGdlM04wY21sdVoxdGRmU0IwSUNCVWFHVWdhVzV3ZFhRZ2RHVjRkQ0IwYnlCaVpTQnpkSGxzWldRdVhHNGdLaUJBY21WMGRYSnVJSHRUZEhsc1pXUlRkSEpwYm1kOUlFRWdVM1I1YkdWa1UzUnlhVzVuSUc5aWFtVmpkQ0IzYVhSb0lHRmtaR2wwYVc5dVlXd2djM1I1YkdsdVp5QnRaWFJvYjJSekxseHVJQ3BjYmlBcUlFQm1kVzVqZEdsdmJpQnpkSGxzWlZ4dUlDcGNiaUFxSUVCdFpXMWlaWEpQWmlCVGRIbHNaV1JUZEhKcGJtZGNiaUFxTDF4dVpYaHdiM0owSUdaMWJtTjBhVzl1SUhOMGVXeGxLQzR1TG5RNklITjBjbWx1WjF0ZEtUb2dVM1I1YkdWa1UzUnlhVzVuSUh0Y2JpQWdjbVYwZFhKdUlHNWxkeUJUZEhsc1pXUlRkSEpwYm1jb2RDNXFiMmx1S0Z3aUlGd2lLU2s3WEc1OUlsMTlcbiIsIi8qKlxuICogQGRlc2NyaXB0aW9uIEdsb2JhbCBrZXkgdXNlZCB0byBzdG9yZSBlbnZpcm9ubWVudCB2YXJpYWJsZXMgaW4gYnJvd3NlciBjb250ZXh0cy5cbiAqIEBzdW1tYXJ5IEVuYWJsZXMgdGhlIGxvZ2dpbmcgZW52aXJvbm1lbnQgaGVscGVycyB0byBsb2NhdGUgc2VyaWFsaXplZCBlbnZpcm9ubWVudCBjb25maWd1cmF0aW9uIG9uIGBnbG9iYWxUaGlzYC5cbiAqIEBjb25zdCBCcm93c2VyRW52S2V5XG4gKiBAdHlwZSB7c3RyaW5nfVxuICogQG1lbWJlck9mIG1vZHVsZTpMb2dnaW5nXG4gKi9cbmV4cG9ydCBjb25zdCBCcm93c2VyRW52S2V5ID0gXCJFTlZcIjtcbi8qKlxuICogQGRlc2NyaXB0aW9uIERlbGltaXRlciB1c2VkIGZvciBjb21wb3NpbmcgbmVzdGVkIGVudmlyb25tZW50IHZhcmlhYmxlIG5hbWVzLlxuICogQHN1bW1hcnkgSm9pbnMgcGFyZW50IGFuZCBjaGlsZCBrZXlzIHdoZW4gbWFwcGluZyBvYmplY3QgcGF0aHMgdG8gRU5WIHN0cmluZ3MuXG4gKiBAY29uc3QgRU5WX1BBVEhfREVMSU1JVEVSXG4gKiBAdHlwZSB7c3RyaW5nfVxuICogQG1lbWJlck9mIG1vZHVsZTpMb2dnaW5nXG4gKi9cbmV4cG9ydCBjb25zdCBFTlZfUEFUSF9ERUxJTUlURVIgPSBcIl9fXCI7XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBEZWZhdWx0IHByZWZpeCBhbmQgc3VmZml4IHVzZWQgZm9yIHRlbXBsYXRlIHBsYWNlaG9sZGVycy5cbiAqIEBzdW1tYXJ5IFByb3ZpZGVzIHdyYXBwZXIgc3RyaW5ncyBhcHBsaWVkIHdoZW4gaW50ZXJwb2xhdGluZyBtZXNzYWdlcyB3aXRoIHtAbGluayBwYXRjaFBsYWNlaG9sZGVyc30uXG4gKiBAY29uc3QgRGVmYXVsdFBsYWNlaG9sZGVyV3JhcHBlcnNcbiAqIEB0eXBlIHtzdHJpbmdbXX1cbiAqIEBtZW1iZXJPZiBtb2R1bGU6TG9nZ2luZ1xuICovXG5leHBvcnQgY29uc3QgRGVmYXVsdFBsYWNlaG9sZGVyV3JhcHBlcnMgPSBbXCIke1wiLCBcIn1cIl07XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBFbnVtIGZvciBsb2cgbGV2ZWxzLlxuICogQHN1bW1hcnkgRGVmaW5lcyBkaWZmZXJlbnQgbGV2ZWxzIG9mIGxvZ2dpbmcgZm9yIHRoZSBhcHBsaWNhdGlvbi5cbiAqIEBlbnVtIHtzdHJpbmd9XG4gKiBAcmVhZG9ubHlcbiAqIEBtZW1iZXJPZiBtb2R1bGU6TG9nZ2luZ1xuICovXG5leHBvcnQgdmFyIExvZ0xldmVsO1xuKGZ1bmN0aW9uIChMb2dMZXZlbCkge1xuICAgIC8qKiBAZGVzY3JpcHRpb24gQmVuY2htYXJrIGV2ZW50cyB0aGF0IGNhcHR1cmUgcGVyZm9ybWFuY2UgbWV0cmljcy4gKi9cbiAgICBMb2dMZXZlbFtcImJlbmNobWFya1wiXSA9IFwiYmVuY2htYXJrXCI7XG4gICAgLyoqIEBkZXNjcmlwdGlvbiBFcnJvciBldmVudHMgdGhhdCBpbmRpY2F0ZSBmYWlsdXJlcyByZXF1aXJpbmcgYXR0ZW50aW9uLiAqL1xuICAgIExvZ0xldmVsW1wiZXJyb3JcIl0gPSBcImVycm9yXCI7XG4gICAgLyoqIEBkZXNjcmlwdGlvbiBXYXJuaW5nIGV2ZW50cyB0aGF0IG1heSBpbmRpY2F0ZSBpc3N1ZXMuICovXG4gICAgTG9nTGV2ZWxbXCJ3YXJuXCJdID0gXCJ3YXJuXCI7XG4gICAgLyoqIEBkZXNjcmlwdGlvbiBJbmZvcm1hdGlvbmFsIGV2ZW50cyBkZXNjcmliaW5nIG5vcm1hbCBvcGVyYXRpb24uICovXG4gICAgTG9nTGV2ZWxbXCJpbmZvXCJdID0gXCJpbmZvXCI7XG4gICAgLyoqIEBkZXNjcmlwdGlvbiBWZXJib3NlIGRpYWdub3N0aWMgaW5mb3JtYXRpb24gZm9yIGRldGFpbGVkIHRyYWNpbmcuICovXG4gICAgTG9nTGV2ZWxbXCJ2ZXJib3NlXCJdID0gXCJ2ZXJib3NlXCI7XG4gICAgLyoqIEBkZXNjcmlwdGlvbiBEZWJ1ZyBvciB0cmFjZSBkZXRhaWxzIGFpbWVkIGF0IGRldmVsb3BlcnMuICovXG4gICAgTG9nTGV2ZWxbXCJkZWJ1Z1wiXSA9IFwiZGVidWdcIjtcbiAgICAvKiogQGRlc2NyaXB0aW9uIHRyYWNlIGRldGFpbHMgYWltZWQgYXQgZGV2ZWxvcGVycyAqL1xuICAgIExvZ0xldmVsW1widHJhY2VcIl0gPSBcInRyYWNlXCI7XG4gICAgLyoqIEBkZXNjcmlwdGlvbiBFeHRyZW1lbHkgY2hhdHR5IG9yIHBsYXlmdWwgbG9nIGVudHJpZXMuICovXG4gICAgTG9nTGV2ZWxbXCJzaWxseVwiXSA9IFwic2lsbHlcIjtcbn0pKExvZ0xldmVsIHx8IChMb2dMZXZlbCA9IHt9KSk7XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBOdW1lcmljIHZhbHVlcyBhc3NvY2lhdGVkIHdpdGggbG9nIGxldmVscy5cbiAqIEBzdW1tYXJ5IFByb3ZpZGVzIGEgbnVtZXJpYyByZXByZXNlbnRhdGlvbiBvZiBsb2cgbGV2ZWxzIGZvciBjb21wYXJpc29uIGFuZCBmaWx0ZXJpbmcuXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBOdW1lcmljTG9nTGV2ZWxzU2hhcGVcbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBiZW5jaG1hcmsgLSBOdW1lcmljIHZhbHVlIGZvciBiZW5jaG1hcmsgbGV2ZWwgKDApLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGVycm9yIC0gTnVtZXJpYyB2YWx1ZSBmb3IgZXJyb3IgbGV2ZWwgKDIpLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGluZm8gLSBOdW1lcmljIHZhbHVlIGZvciBpbmZvIGxldmVsICg0KS5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSB2ZXJib3NlIC0gTnVtZXJpYyB2YWx1ZSBmb3IgdmVyYm9zZSBsZXZlbCAoNikuXG4gKiBAcHJvcGVydHkge251bWJlcn0gZGVidWcgLSBOdW1lcmljIHZhbHVlIGZvciBkZWJ1ZyBsZXZlbCAoNykuXG4gKiBAcHJvcGVydHkge251bWJlcn0gc2lsbHkgLSBOdW1lcmljIHZhbHVlIGZvciBzaWxseSBsZXZlbCAoOSkuXG4gKiBAbWVtYmVyT2YgbW9kdWxlOkxvZ2dpbmdcbiAqL1xuLyoqXG4gKiBAZGVzY3JpcHRpb24gTnVtZXJpYyB2YWx1ZXMgYXNzb2NpYXRlZCB3aXRoIGxvZyBsZXZlbHMuXG4gKiBAc3VtbWFyeSBQcm92aWRlcyBhIG51bWVyaWMgcmVwcmVzZW50YXRpb24gb2YgbG9nIGxldmVscyBmb3IgY29tcGFyaXNvbiBhbmQgZmlsdGVyaW5nLlxuICogQGNvbnN0IE51bWVyaWNMb2dMZXZlbHNcbiAqIEB0eXBlIHtOdW1lcmljTG9nTGV2ZWxzU2hhcGV9XG4gKiBAbWVtYmVyT2YgbW9kdWxlOkxvZ2dpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IE51bWVyaWNMb2dMZXZlbHMgPSB7XG4gICAgYmVuY2htYXJrOiAwLFxuICAgIGVycm9yOiAzLFxuICAgIHdhcm46IDYsXG4gICAgaW5mbzogOSxcbiAgICB2ZXJib3NlOiAxMixcbiAgICBkZWJ1ZzogMTUsXG4gICAgdHJhY2U6IDE4LFxuICAgIHNpbGx5OiAyMSxcbn07XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBFbnVtIGZvciBsb2dnaW5nIG91dHB1dCBtb2Rlcy5cbiAqIEBzdW1tYXJ5IERlZmluZXMgZGlmZmVyZW50IG91dHB1dCBmb3JtYXRzIGZvciBsb2cgbWVzc2FnZXMuXG4gKiBAZW51bSB7c3RyaW5nfVxuICogQG1lbWJlck9mIG1vZHVsZTpMb2dnaW5nXG4gKi9cbmV4cG9ydCB2YXIgTG9nZ2luZ01vZGU7XG4oZnVuY3Rpb24gKExvZ2dpbmdNb2RlKSB7XG4gICAgLyoqIFJhdyB0ZXh0IGZvcm1hdCBmb3IgaHVtYW4gcmVhZGFiaWxpdHkgKi9cbiAgICBMb2dnaW5nTW9kZVtcIlJBV1wiXSA9IFwicmF3XCI7XG4gICAgLyoqIEpTT04gZm9ybWF0IGZvciBtYWNoaW5lIHBhcnNpbmcgKi9cbiAgICBMb2dnaW5nTW9kZVtcIkpTT05cIl0gPSBcImpzb25cIjtcbn0pKExvZ2dpbmdNb2RlIHx8IChMb2dnaW5nTW9kZSA9IHt9KSk7XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBEZWZhdWx0IHRoZW1lIGZvciBzdHlsaW5nIGxvZyBvdXRwdXQuXG4gKiBAc3VtbWFyeSBEZWZpbmVzIHRoZSBkZWZhdWx0IGNvbG9yIGFuZCBzdHlsZSBzZXR0aW5ncyBmb3IgdmFyaW91cyBjb21wb25lbnRzIG9mIGxvZyBtZXNzYWdlcy5cbiAqIEB0eXBlZGVmIHtUaGVtZX0gRGVmYXVsdFRoZW1lXG4gKiBAcHJvcGVydHkge09iamVjdH0gY2xhc3MgLSBTdHlsaW5nIGZvciBjbGFzcyBuYW1lcy5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjbGFzcy5mZyAtIEZvcmVncm91bmQgY29sb3IgY29kZSBmb3IgY2xhc3MgbmFtZXMgKDM0KS5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBpZCAtIFN0eWxpbmcgZm9yIGlkZW50aWZpZXJzLlxuICogQHByb3BlcnR5IHtudW1iZXJ9IGlkLmZnIC0gRm9yZWdyb3VuZCBjb2xvciBjb2RlIGZvciBpZGVudGlmaWVycyAoMzYpLlxuICogQHByb3BlcnR5IHtPYmplY3R9IHN0YWNrIC0gU3R5bGluZyBmb3Igc3RhY2sgdHJhY2VzIChlbXB0eSBvYmplY3QpLlxuICogQHByb3BlcnR5IHtPYmplY3R9IHRpbWVzdGFtcCAtIFN0eWxpbmcgZm9yIHRpbWVzdGFtcHMgKGVtcHR5IG9iamVjdCkuXG4gKiBAcHJvcGVydHkge09iamVjdH0gbWVzc2FnZSAtIFN0eWxpbmcgZm9yIGRpZmZlcmVudCB0eXBlcyBvZiBtZXNzYWdlcy5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBtZXNzYWdlLmVycm9yIC0gU3R5bGluZyBmb3IgZXJyb3IgbWVzc2FnZXMuXG4gKiBAcHJvcGVydHkge251bWJlcn0gbWVzc2FnZS5lcnJvci5mZyAtIEZvcmVncm91bmQgY29sb3IgY29kZSBmb3IgZXJyb3IgbWVzc2FnZXMgKDMxKS5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBtZXRob2QgLSBTdHlsaW5nIGZvciBtZXRob2QgbmFtZXMgKGVtcHR5IG9iamVjdCkuXG4gKiBAcHJvcGVydHkge09iamVjdH0gbG9nTGV2ZWwgLSBTdHlsaW5nIGZvciBkaWZmZXJlbnQgbG9nIGxldmVscy5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBsb2dMZXZlbC5lcnJvciAtIFN0eWxpbmcgZm9yIGVycm9yIGxldmVsIGxvZ3MuXG4gKiBAcHJvcGVydHkge251bWJlcn0gbG9nTGV2ZWwuZXJyb3IuZmcgLSBGb3JlZ3JvdW5kIGNvbG9yIGNvZGUgZm9yIGVycm9yIGxldmVsIGxvZ3MgKDMxKS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nW119IGxvZ0xldmVsLmVycm9yLnN0eWxlIC0gU3R5bGUgYXR0cmlidXRlcyBmb3IgZXJyb3IgbGV2ZWwgbG9ncyAoW1wiYm9sZFwiXSkuXG4gKiBAcHJvcGVydHkge09iamVjdH0gbG9nTGV2ZWwuaW5mbyAtIFN0eWxpbmcgZm9yIGluZm8gbGV2ZWwgbG9ncyAoZW1wdHkgb2JqZWN0KS5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBsb2dMZXZlbC52ZXJib3NlIC0gU3R5bGluZyBmb3IgdmVyYm9zZSBsZXZlbCBsb2dzIChlbXB0eSBvYmplY3QpLlxuICogQHByb3BlcnR5IHtPYmplY3R9IGxvZ0xldmVsLmRlYnVnIC0gU3R5bGluZyBmb3IgZGVidWcgbGV2ZWwgbG9ncy5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBsb2dMZXZlbC5kZWJ1Zy5mZyAtIEZvcmVncm91bmQgY29sb3IgY29kZSBmb3IgZGVidWcgbGV2ZWwgbG9ncyAoMzMpLlxuICogQGNvbnN0IERlZmF1bHRUaGVtZVxuICogQG1lbWJlck9mIG1vZHVsZTpMb2dnaW5nXG4gKi9cbmV4cG9ydCBjb25zdCBEZWZhdWx0VGhlbWUgPSB7XG4gICAgYXBwOiB7fSxcbiAgICBzZXBhcmF0b3I6IHt9LFxuICAgIGNsYXNzOiB7XG4gICAgICAgIGZnOiAzNCxcbiAgICB9LFxuICAgIGlkOiB7XG4gICAgICAgIGZnOiAzNixcbiAgICB9LFxuICAgIHN0YWNrOiB7fSxcbiAgICB0aW1lc3RhbXA6IHt9LFxuICAgIG1lc3NhZ2U6IHtcbiAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgIGZnOiAzMSxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIG1ldGhvZDoge30sXG4gICAgbG9nTGV2ZWw6IHtcbiAgICAgICAgYmVuY2htYXJrOiB7XG4gICAgICAgICAgICBmZzogMzIsXG4gICAgICAgICAgICBzdHlsZTogW1wiYm9sZFwiXSxcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IHtcbiAgICAgICAgICAgIGZnOiAzMSxcbiAgICAgICAgICAgIHN0eWxlOiBbXCJib2xkXCJdLFxuICAgICAgICB9LFxuICAgICAgICBpbmZvOiB7XG4gICAgICAgICAgICBmZzogMzQsXG4gICAgICAgICAgICBzdHlsZTogW1wiYm9sZFwiXSxcbiAgICAgICAgfSxcbiAgICAgICAgdmVyYm9zZToge1xuICAgICAgICAgICAgZmc6IDM0LFxuICAgICAgICAgICAgc3R5bGU6IFtcImJvbGRcIl0sXG4gICAgICAgIH0sXG4gICAgICAgIGRlYnVnOiB7XG4gICAgICAgICAgICBmZzogMzMsXG4gICAgICAgICAgICBzdHlsZTogW1wiYm9sZFwiXSxcbiAgICAgICAgfSxcbiAgICAgICAgdHJhY2U6IHtcbiAgICAgICAgICAgIGZnOiAzMyxcbiAgICAgICAgICAgIHN0eWxlOiBbXCJib2xkXCJdLFxuICAgICAgICB9LFxuICAgICAgICBzaWxseToge1xuICAgICAgICAgICAgZmc6IDMzLFxuICAgICAgICAgICAgc3R5bGU6IFtcImJvbGRcIl0sXG4gICAgICAgIH0sXG4gICAgfSxcbn07XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBEZWZhdWx0IGNvbmZpZ3VyYXRpb24gZm9yIGxvZ2dpbmcuXG4gKiBAc3VtbWFyeSBEZWZpbmVzIHRoZSBkZWZhdWx0IHNldHRpbmdzIGZvciB0aGUgbG9nZ2luZyBzeXN0ZW0sIGluY2x1ZGluZyB2ZXJib3NpdHksIGxvZyBsZXZlbCwgc3R5bGluZywgYW5kIHRpbWVzdGFtcCBmb3JtYXQuXG4gKiBAY29uc3QgRGVmYXVsdExvZ2dpbmdDb25maWdcbiAqIEB0eXBlZGVmIHtMb2dnaW5nQ29uZmlnfSBEZWZhdWx0TG9nZ2luZ0NvbmZpZ1xuICogQHByb3BlcnR5IHtudW1iZXJ9IHZlcmJvc2UgLSBWZXJib3NpdHkgbGV2ZWwgKDApLlxuICogQHByb3BlcnR5IHtMb2dMZXZlbH0gbGV2ZWwgLSBEZWZhdWx0IGxvZyBsZXZlbCAoTG9nTGV2ZWwuaW5mbykuXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGxvZ0xldmVsIC0gV2hldGhlciB0byBkaXNwbGF5IGxvZyBsZXZlbCBpbiBvdXRwdXQgKHRydWUpLlxuICogQHByb3BlcnR5IHtMb2dnaW5nTW9kZX0gbW9kZSAtIE91dHB1dCBmb3JtYXQgbW9kZSAoTG9nZ2luZ01vZGUuUkFXKS5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gc3R5bGUgLSBXaGV0aGVyIHRvIGFwcGx5IHN0eWxpbmcgdG8gbG9nIG91dHB1dCAoZmFsc2UpLlxuICogQHByb3BlcnR5IHtzdHJpbmd9IHNlcGFyYXRvciAtIFNlcGFyYXRvciBiZXR3ZWVuIGxvZyBjb21wb25lbnRzIChcIiAtIFwiKS5cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gdGltZXN0YW1wIC0gV2hldGhlciB0byBpbmNsdWRlIHRpbWVzdGFtcHMgaW4gbG9nIG1lc3NhZ2VzICh0cnVlKS5cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0aW1lc3RhbXBGb3JtYXQgLSBGb3JtYXQgZm9yIHRpbWVzdGFtcHMgKFwiSEg6bW06c3MuU1NTXCIpLlxuICogQHByb3BlcnR5IHtib29sZWFufSBjb250ZXh0IC0gV2hldGhlciB0byBpbmNsdWRlIGNvbnRleHQgaW5mb3JtYXRpb24gaW4gbG9nIG1lc3NhZ2VzICh0cnVlKS5cbiAqIEBwcm9wZXJ0eSB7VGhlbWV9IHRoZW1lIC0gVGhlIHRoZW1lIHRvIHVzZSBmb3Igc3R5bGluZyBsb2cgbWVzc2FnZXMgKERlZmF1bHRUaGVtZSkuXG4gKiBAbWVtYmVyT2YgbW9kdWxlOkxvZ2dpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IERlZmF1bHRMb2dnaW5nQ29uZmlnID0ge1xuICAgIGVudjogXCJkZXZlbG9wbWVudFwiLFxuICAgIHZlcmJvc2U6IDAsXG4gICAgbGV2ZWw6IExvZ0xldmVsLmluZm8sXG4gICAgbG9nTGV2ZWw6IHRydWUsXG4gICAgc3R5bGU6IGZhbHNlLFxuICAgIGNvbnRleHRTZXBhcmF0b3I6IFwiLlwiLFxuICAgIHNlcGFyYXRvcjogXCItXCIsXG4gICAgdGltZXN0YW1wOiB0cnVlLFxuICAgIHRpbWVzdGFtcEZvcm1hdDogXCJISDptbTpzcy5TU1NcIixcbiAgICBjb250ZXh0OiB0cnVlLFxuICAgIGZvcm1hdDogTG9nZ2luZ01vZGUuUkFXLFxuICAgIHBhdHRlcm46IFwie2xldmVsfSBbe3RpbWVzdGFtcH1dIHthcHB9IHtjb250ZXh0fSB7c2VwYXJhdG9yfSB7bWVzc2FnZX0ge3N0YWNrfVwiLFxuICAgIHRoZW1lOiBEZWZhdWx0VGhlbWUsXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29uc3RhbnRzLmpzLm1hcCIsImltcG9ydCB7IERlZmF1bHRQbGFjZWhvbGRlcldyYXBwZXJzIH0gZnJvbSBcIi4vY29uc3RhbnRzLmpzXCI7XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBQYWRzIHRoZSBlbmQgb2YgYSBzdHJpbmcgd2l0aCBhIHNwZWNpZmllZCBjaGFyYWN0ZXIuXG4gKiBAc3VtbWFyeSBFeHRlbmRzIHRoZSBpbnB1dCBzdHJpbmcgdG8gYSBzcGVjaWZpZWQgbGVuZ3RoIGJ5IGFkZGluZyBhIHBhZGRpbmcgY2hhcmFjdGVyIHRvIHRoZSBlbmQuXG4gKiBJZiB0aGUgaW5wdXQgc3RyaW5nIGlzIGFscmVhZHkgbG9uZ2VyIHRoYW4gdGhlIHNwZWNpZmllZCBsZW5ndGgsIGl0IGlzIHJldHVybmVkIHVuY2hhbmdlZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyIC0gVGhlIGlucHV0IHN0cmluZyB0byBiZSBwYWRkZWQuXG4gKiBAcGFyYW0ge251bWJlcn0gbGVuZ3RoIC0gVGhlIGRlc2lyZWQgdG90YWwgbGVuZ3RoIG9mIHRoZSByZXN1bHRpbmcgc3RyaW5nLlxuICogQHBhcmFtIHtzdHJpbmd9IFtjaGFyPVwiIFwiXSAtIFRoZSBjaGFyYWN0ZXIgdG8gdXNlIGZvciBwYWRkaW5nLiBEZWZhdWx0cyB0byBhIHNwYWNlLlxuICogQHJldHVybiB7c3RyaW5nfSBUaGUgcGFkZGVkIHN0cmluZy5cbiAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgcGFkZGluZyBjaGFyYWN0ZXIgaXMgbm90IGV4YWN0bHkgb25lIGNoYXJhY3RlciBsb25nLlxuICpcbiAqIEBmdW5jdGlvbiBwYWRFbmRcbiAqXG4gKiBAbWVtYmVyT2YgbW9kdWxlOkxvZ2dpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhZEVuZChzdHIsIGxlbmd0aCwgY2hhciA9IFwiIFwiKSB7XG4gICAgaWYgKGNoYXIubGVuZ3RoICE9PSAxKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNoYXJhY3RlciBsZW5ndGggZm9yIHBhZGRpbmcuIG11c3QgYmUgb25lIVwiKTtcbiAgICByZXR1cm4gc3RyLnBhZEVuZChsZW5ndGgsIGNoYXIpO1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gUmVwbGFjZXMgcGxhY2Vob2xkZXJzIGluIGEgc3RyaW5nIHdpdGggcHJvdmlkZWQgdmFsdWVzLlxuICogQHN1bW1hcnkgSW50ZXJwb2xhdGVzIGEgc3RyaW5nIGJ5IHJlcGxhY2luZyBwbGFjZWhvbGRlcnMgb2YgdGhlIGZvcm0gJHt2YXJpYWJsZU5hbWV9XG4gKiB3aXRoIGNvcnJlc3BvbmRpbmcgdmFsdWVzIGZyb20gdGhlIHByb3ZpZGVkIG9iamVjdC4gSWYgYSBwbGFjZWhvbGRlciBkb2Vzbid0IGhhdmVcbiAqIGEgY29ycmVzcG9uZGluZyB2YWx1ZSwgaXQgaXMgbGVmdCB1bmNoYW5nZWQgaW4gdGhlIHN0cmluZy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gaW5wdXQgLSBUaGUgaW5wdXQgc3RyaW5nIGNvbnRhaW5pbmcgcGxhY2Vob2xkZXJzIHRvIGJlIHJlcGxhY2VkLlxuICogQHBhcmFtIHtSZWNvcmQ8c3RyaW5nLCBudW1iZXIgfCBzdHJpbmc+fSB2YWx1ZXMgLSBBbiBvYmplY3QgY29udGFpbmluZyBrZXktdmFsdWUgcGFpcnMgZm9yIHJlcGxhY2VtZW50LlxuICogQHBhcmFtIHByZWZpeFxuICogQHBhcmFtIHN1ZmZpeFxuICogQHBhcmFtIGZsYWdzXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBpbnRlcnBvbGF0ZWQgc3RyaW5nIHdpdGggcGxhY2Vob2xkZXJzIHJlcGxhY2VkIGJ5IHRoZWlyIGNvcnJlc3BvbmRpbmcgdmFsdWVzLlxuICpcbiAqIEBmdW5jdGlvbiBwYXRjaFBsYWNlaG9sZGVyc1xuICpcbiAqIEBtZXJtYWlkXG4gKiBzZXF1ZW5jZURpYWdyYW1cbiAqICAgcGFydGljaXBhbnQgQ2FsbGVyXG4gKiAgIHBhcnRpY2lwYW50IHBhdGNoU3RyaW5nXG4gKiAgIHBhcnRpY2lwYW50IFN0cmluZy5yZXBsYWNlXG4gKiAgIENhbGxlci0+PnBhdGNoU3RyaW5nOiBDYWxsIHdpdGggaW5wdXQgYW5kIHZhbHVlc1xuICogICBwYXRjaFN0cmluZy0+PlN0cmluZy5yZXBsYWNlOiBDYWxsIHdpdGggcmVnZXggYW5kIHJlcGxhY2VtZW50IGZ1bmN0aW9uXG4gKiAgIFN0cmluZy5yZXBsYWNlLT4+cGF0Y2hTdHJpbmc6IFJldHVybiByZXBsYWNlZCBzdHJpbmdcbiAqICAgcGF0Y2hTdHJpbmctLT4+Q2FsbGVyOiBSZXR1cm4gcGF0Y2hlZCBzdHJpbmdcbiAqXG4gKiBAbWVtYmVyT2YgbW9kdWxlOkxvZ2dpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhdGNoUGxhY2Vob2xkZXJzKGlucHV0LCB2YWx1ZXMsIHByZWZpeCA9IERlZmF1bHRQbGFjZWhvbGRlcldyYXBwZXJzWzBdLCBzdWZmaXggPSBEZWZhdWx0UGxhY2Vob2xkZXJXcmFwcGVyc1sxXSwgZmxhZ3MgPSBcImdcIikge1xuICAgIGNvbnN0IHBsYWNlaG9sZGVycyA9IE9iamVjdC5lbnRyaWVzKHZhbHVlcykucmVkdWNlKChhY2MsIFtrZXksIHZhbF0pID0+IHtcbiAgICAgICAgYWNjW2Ake3ByZWZpeH0ke2tleX0ke3N1ZmZpeH1gXSA9IHZhbDtcbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB7fSk7XG4gICAgcmV0dXJuIHBhdGNoU3RyaW5nKGlucHV0LCBwbGFjZWhvbGRlcnMsIGZsYWdzKTtcbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uIFJlcGxhY2VzIG9jY3VycmVuY2VzIG9mIGtleXMgd2l0aCB0aGVpciBjb3JyZXNwb25kaW5nIHZhbHVlcyBpbiBhIHN0cmluZy5cbiAqIEBzdW1tYXJ5IEl0ZXJhdGVzIHRocm91Z2ggYSBzZXQgb2Yga2V5LXZhbHVlIHBhaXJzIGFuZCByZXBsYWNlcyBhbGwgb2NjdXJyZW5jZXMgb2YgZWFjaCBrZXlcbiAqIGluIHRoZSBpbnB1dCBzdHJpbmcgd2l0aCBpdHMgY29ycmVzcG9uZGluZyB2YWx1ZS4gU3VwcG9ydHMgcmVndWxhciBleHByZXNzaW9uIGZsYWdzIGZvciBjdXN0b21pemVkIHJlcGxhY2VtZW50LlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBpbnB1dCAtIFRoZSBpbnB1dCBzdHJpbmcgaW4gd2hpY2ggcmVwbGFjZW1lbnRzIHdpbGwgYmUgbWFkZS5cbiAqIEBwYXJhbSB7UmVjb3JkPHN0cmluZywgbnVtYmVyIHwgc3RyaW5nPn0gdmFsdWVzIC0gQW4gb2JqZWN0IGNvbnRhaW5pbmcga2V5LXZhbHVlIHBhaXJzIGZvciByZXBsYWNlbWVudC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBbZmxhZ3M9XCJnXCJdIC0gUmVndWxhciBleHByZXNzaW9uIGZsYWdzIHRvIGNvbnRyb2wgdGhlIHJlcGxhY2VtZW50IGJlaGF2aW9yLlxuICogQHJldHVybiB7c3RyaW5nfSBUaGUgc3RyaW5nIHdpdGggYWxsIHNwZWNpZmllZCByZXBsYWNlbWVudHMgYXBwbGllZC5cbiAqXG4gKiBAZnVuY3Rpb24gcGF0Y2hTdHJpbmdcbiAqXG4gKiBAbWVtYmVyT2YgbW9kdWxlOkxvZ2dpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhdGNoU3RyaW5nKGlucHV0LCB2YWx1ZXMsIGZsYWdzID0gXCJnXCIpIHtcbiAgICBPYmplY3QuZW50cmllcyh2YWx1ZXMpLmZvckVhY2goKFtrZXksIHZhbF0pID0+IHtcbiAgICAgICAgY29uc3QgcmVnZXhwID0gbmV3IFJlZ0V4cChlc2NhcGVSZWdFeHAoa2V5KSwgZmxhZ3MpO1xuICAgICAgICBpbnB1dCA9IGlucHV0LnJlcGxhY2UocmVnZXhwLCB2YWwpO1xuICAgIH0pO1xuICAgIHJldHVybiBpbnB1dDtcbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uIENvbnZlcnRzIGEgc3RyaW5nIHRvIGNhbWVsQ2FzZS5cbiAqIEBzdW1tYXJ5IFRyYW5zZm9ybXMgdGhlIGlucHV0IHN0cmluZyBpbnRvIGNhbWVsQ2FzZSBmb3JtYXQsIHdoZXJlIHdvcmRzIGFyZSBqb2luZWQgd2l0aG91dCBzcGFjZXNcbiAqIGFuZCBlYWNoIHdvcmQgYWZ0ZXIgdGhlIGZpcnN0IHN0YXJ0cyB3aXRoIGEgY2FwaXRhbCBsZXR0ZXIuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgLSBUaGUgaW5wdXQgc3RyaW5nIHRvIGJlIGNvbnZlcnRlZC5cbiAqIEByZXR1cm4ge3N0cmluZ30gVGhlIGlucHV0IHN0cmluZyBjb252ZXJ0ZWQgdG8gY2FtZWxDYXNlLlxuICpcbiAqIEBmdW5jdGlvbiB0b0NhbWVsQ2FzZVxuICpcbiAqIEBtZW1iZXJPZiBtb2R1bGU6TG9nZ2luZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gdG9DYW1lbENhc2UodGV4dCkge1xuICAgIHJldHVybiB0ZXh0XG4gICAgICAgIC5yZXBsYWNlKC8oPzpeXFx3fFtBLVpdfFxcYlxcdykvZywgKHdvcmQsIGluZGV4KSA9PiBpbmRleCA9PT0gMCA/IHdvcmQudG9Mb3dlckNhc2UoKSA6IHdvcmQudG9VcHBlckNhc2UoKSlcbiAgICAgICAgLnJlcGxhY2UoL1xccysvZywgXCJcIik7XG59XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBDb252ZXJ0cyBhIHN0cmluZyB0byBFTlZJUk9OTUVOVF9WQVJJQUJMRSBmb3JtYXQuXG4gKiBAc3VtbWFyeSBUcmFuc2Zvcm1zIHRoZSBpbnB1dCBzdHJpbmcgaW50byB1cHBlcmNhc2Ugd2l0aCB3b3JkcyBzZXBhcmF0ZWQgYnkgdW5kZXJzY29yZXMsXG4gKiB0eXBpY2FsbHkgdXNlZCBmb3IgZW52aXJvbm1lbnQgdmFyaWFibGUgbmFtZXMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRleHQgLSBUaGUgaW5wdXQgc3RyaW5nIHRvIGJlIGNvbnZlcnRlZC5cbiAqIEByZXR1cm4ge3N0cmluZ30gVGhlIGlucHV0IHN0cmluZyBjb252ZXJ0ZWQgdG8gRU5WSVJPTk1FTlRfVkFSSUFCTEUgZm9ybWF0LlxuICpcbiAqIEBmdW5jdGlvbiB0b0VOVkZvcm1hdFxuICpcbiAqIEBtZW1iZXJPZiBtb2R1bGU6TG9nZ2luZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gdG9FTlZGb3JtYXQodGV4dCkge1xuICAgIHJldHVybiB0b1NuYWtlQ2FzZSh0ZXh0KS50b1VwcGVyQ2FzZSgpO1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gQ29udmVydHMgYSBzdHJpbmcgdG8gc25ha2VfY2FzZS5cbiAqIEBzdW1tYXJ5IFRyYW5zZm9ybXMgdGhlIGlucHV0IHN0cmluZyBpbnRvIGxvd2VyY2FzZSB3aXRoIHdvcmRzIHNlcGFyYXRlZCBieSB1bmRlcnNjb3Jlcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRoZSBpbnB1dCBzdHJpbmcgdG8gYmUgY29udmVydGVkLlxuICogQHJldHVybiB7c3RyaW5nfSBUaGUgaW5wdXQgc3RyaW5nIGNvbnZlcnRlZCB0byBzbmFrZV9jYXNlLlxuICpcbiAqIEBmdW5jdGlvbiB0b1NuYWtlQ2FzZVxuICpcbiAqIEBtZW1iZXJPZiBtb2R1bGU6TG9nZ2luZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gdG9TbmFrZUNhc2UodGV4dCkge1xuICAgIHJldHVybiB0ZXh0XG4gICAgICAgIC5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCBcIiQxXyQyXCIpXG4gICAgICAgIC5yZXBsYWNlKC9bXFxzLV0rL2csIFwiX1wiKVxuICAgICAgICAudG9Mb3dlckNhc2UoKTtcbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uIENvbnZlcnRzIGEgc3RyaW5nIHRvIGtlYmFiLWNhc2UuXG4gKiBAc3VtbWFyeSBUcmFuc2Zvcm1zIHRoZSBpbnB1dCBzdHJpbmcgaW50byBsb3dlcmNhc2Ugd2l0aCB3b3JkcyBzZXBhcmF0ZWQgYnkgaHlwaGVucy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIFRoZSBpbnB1dCBzdHJpbmcgdG8gYmUgY29udmVydGVkLlxuICogQHJldHVybiB7c3RyaW5nfSBUaGUgaW5wdXQgc3RyaW5nIGNvbnZlcnRlZCB0byBrZWJhYi1jYXNlLlxuICpcbiAqIEBmdW5jdGlvbiB0b0tlYmFiQ2FzZVxuICpcbiAqIEBtZW1iZXJPZiBtb2R1bGU6TG9nZ2luZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gdG9LZWJhYkNhc2UodGV4dCkge1xuICAgIHJldHVybiB0ZXh0XG4gICAgICAgIC5yZXBsYWNlKC8oW2Etel0pKFtBLVpdKS9nLCBcIiQxLSQyXCIpXG4gICAgICAgIC5yZXBsYWNlKC9bXFxzX10rL2csIFwiLVwiKVxuICAgICAgICAudG9Mb3dlckNhc2UoKTtcbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uIENvbnZlcnRzIGEgc3RyaW5nIHRvIFBhc2NhbENhc2UuXG4gKiBAc3VtbWFyeSBUcmFuc2Zvcm1zIHRoZSBpbnB1dCBzdHJpbmcgaW50byBQYXNjYWxDYXNlIGZvcm1hdCwgd2hlcmUgd29yZHMgYXJlIGpvaW5lZCB3aXRob3V0IHNwYWNlc1xuICogYW5kIGVhY2ggd29yZCBzdGFydHMgd2l0aCBhIGNhcGl0YWwgbGV0dGVyLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gVGhlIGlucHV0IHN0cmluZyB0byBiZSBjb252ZXJ0ZWQuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBpbnB1dCBzdHJpbmcgY29udmVydGVkIHRvIFBhc2NhbENhc2UuXG4gKlxuICogQGZ1bmN0aW9uIHRvUGFzY2FsQ2FzZVxuICpcbiAqIEBtZW1iZXJPZiBtb2R1bGU6TG9nZ2luZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gdG9QYXNjYWxDYXNlKHRleHQpIHtcbiAgICByZXR1cm4gdGV4dFxuICAgICAgICAucmVwbGFjZSgvKD86Xlxcd3xbQS1aXXxcXGJcXHcpL2csICh3b3JkKSA9PiB3b3JkLnRvVXBwZXJDYXNlKCkpXG4gICAgICAgIC5yZXBsYWNlKC9cXHMrL2csIFwiXCIpO1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gRXNjYXBlcyBzcGVjaWFsIGNoYXJhY3RlcnMgaW4gYSBzdHJpbmcgZm9yIHVzZSBpbiBhIHJlZ3VsYXIgZXhwcmVzc2lvbi5cbiAqIEBzdW1tYXJ5IEFkZHMgYmFja3NsYXNoZXMgYmVmb3JlIGNoYXJhY3RlcnMgdGhhdCBoYXZlIHNwZWNpYWwgbWVhbmluZyBpbiByZWd1bGFyIGV4cHJlc3Npb25zLFxuICogYWxsb3dpbmcgdGhlIHN0cmluZyB0byBiZSB1c2VkIGFzIGEgbGl0ZXJhbCBtYXRjaCBpbiBhIFJlZ0V4cC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIC0gVGhlIHN0cmluZyB0byBlc2NhcGUgZm9yIHJlZ3VsYXIgZXhwcmVzc2lvbiB1c2UuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBlc2NhcGVkIHN0cmluZyBzYWZlIGZvciB1c2UgaW4gcmVndWxhciBleHByZXNzaW9ucy5cbiAqXG4gKiBAZnVuY3Rpb24gZXNjYXBlUmVnRXhwXG4gKlxuICogQG1lbWJlck9mIG1vZHVsZTpMb2dnaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlc2NhcGVSZWdFeHAoc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgXCJcXFxcJCZcIik7IC8vICQmIG1lYW5zIHRoZSB3aG9sZSBtYXRjaGVkIHN0cmluZ1xufVxuLyoqXG4gKiBAc3VtbWFyeSBVdGlsIGZ1bmN0aW9uIHRvIHByb3ZpZGUgc3RyaW5nIGZvcm1hdCBmdW5jdGlvbmFsaXR5IHNpbWlsYXIgdG8gQyMncyBzdHJpbmcuZm9ybWF0XG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZ1xuICogQHBhcmFtIHtBcnJheTxzdHJpbmcgfCBudW1iZXI+IHwgUmVjb3JkPHN0cmluZywgYW55Pn0gW2FyZ3NdIHJlcGxhY2VtZW50cyBtYWRlIGJ5IG9yZGVyIG9mIGFwcGVhcmFuY2UgKHJlcGxhY2VtZW50MCB3aWwgcmVwbGFjZSB7MH0gYW5kIHNvIG9uKVxuICogQHJldHVybiB7c3RyaW5nfSBmb3JtYXR0ZWQgc3RyaW5nXG4gKlxuICogQGZ1bmN0aW9uIHNmXG4gKiBAbWVtYmVyT2YgbW9kdWxlOkxvZ2dpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNmKHN0cmluZywgLi4uYXJncykge1xuICAgIGlmIChhcmdzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgaWYgKCFhcmdzLmV2ZXJ5KChhcmcpID0+IHR5cGVvZiBhcmcgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIGFyZyA9PT0gXCJudW1iZXJcIikpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE9ubHkgc3RyaW5nIGFuZCBudW1iZXIgYXJndW1lbnRzIGFyZSBzdXBwb3J0ZWQgZm9yIG11bHRpcGxlIHJlcGxhY2VtZW50cy5gKTtcbiAgICB9XG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAxICYmIHR5cGVvZiBhcmdzWzBdID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIGNvbnN0IG9iaiA9IGFyZ3NbMF07XG4gICAgICAgIHJldHVybiBPYmplY3QuZW50cmllcyhvYmopLnJlZHVjZSgoYWNjLCBba2V5LCB2YWxdKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gYWNjLnJlcGxhY2UobmV3IFJlZ0V4cChgXFxcXHske2tleX1cXFxcfWAsIFwiZ1wiKSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgc3RyaW5nKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC97KFxcZCspfS9nLCBmdW5jdGlvbiAobWF0Y2gsIG51bWJlcikge1xuICAgICAgICByZXR1cm4gdHlwZW9mIGFyZ3NbbnVtYmVyXSAhPT0gXCJ1bmRlZmluZWRcIlxuICAgICAgICAgICAgPyBhcmdzW251bWJlcl0udG9TdHJpbmcoKVxuICAgICAgICAgICAgOiBcInVuZGVmaW5lZFwiO1xuICAgIH0pO1xufVxuLyoqXG4gKiBAc3VtbWFyeSBVdGlsIGZ1bmN0aW9uIHRvIHByb3ZpZGUgc3RyaW5nIGZvcm1hdCBmdW5jdGlvbmFsaXR5IHNpbWlsYXIgdG8gQyMncyBzdHJpbmcuZm9ybWF0XG4gKlxuICogQHNlZSBzZlxuICpcbiAqIEBkZXByZWNhdGVkXG4gKiBAZnVuY3Rpb24gc3RyaW5nRm9ybWF0XG4gKiBAbWVtYmVyT2YgbW9kdWxlOkxvZ2dpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IHN0cmluZ0Zvcm1hdCA9IHNmO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGV4dC5qcy5tYXAiLCIvKipcbiAqIEBjbGFzcyBPYmplY3RBY2N1bXVsYXRvclxuICogQHRlbXBsYXRlIFQgLSBUaGUgdHlwZSBvZiB0aGUgYWNjdW11bGF0ZWQgb2JqZWN0LCBleHRlbmRzIG9iamVjdFxuICogQGRlc2NyaXB0aW9uIEEgY2xhc3MgdGhhdCBhY2N1bXVsYXRlcyBvYmplY3RzIGFuZCBwcm92aWRlcyB0eXBlLXNhZmUgYWNjZXNzIHRvIHRoZWlyIHByb3BlcnRpZXMuXG4gKiBJdCBhbGxvd3MgZm9yIGR5bmFtaWMgYWRkaXRpb24gb2YgcHJvcGVydGllcyB3aGlsZSBtYWludGFpbmluZyB0eXBlIGluZm9ybWF0aW9uLlxuICogQHN1bW1hcnkgQWNjdW11bGF0ZXMgb2JqZWN0cyBhbmQgbWFpbnRhaW5zIHR5cGUgaW5mb3JtYXRpb24gZm9yIGFjY3VtdWxhdGVkIHByb3BlcnRpZXNcbiAqIEBtZW1iZXJPZiB1dGlsc1xuICovXG5leHBvcnQgY2xhc3MgT2JqZWN0QWNjdW11bGF0b3Ige1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJfX3NpemVcIiwge1xuICAgICAgICAgICAgdmFsdWU6IDAsXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKiBAZGVzY3JpcHRpb24gRXhwYW5kcyB0aGUgYWNjdW11bGF0b3Igd2l0aCBwcm9wZXJ0aWVzIGZyb20gYSBuZXcgb2JqZWN0XG4gICAgICogQHN1bW1hcnkgQWRkcyBuZXcgcHJvcGVydGllcyB0byB0aGUgYWNjdW11bGF0b3JcbiAgICAgKiBAdGVtcGxhdGUgViAtIFRoZSB0eXBlIG9mIHRoZSBvYmplY3QgYmVpbmcgZXhwYW5kZWRcbiAgICAgKiBAcGFyYW0ge1Z9IHZhbHVlIC0gVGhlIG9iamVjdCB0byBleHBhbmQgd2l0aFxuICAgICAqIEByZXR1cm5zIHt2b2lkfVxuICAgICAqL1xuICAgIGV4cGFuZCh2YWx1ZSkge1xuICAgICAgICBPYmplY3QuZW50cmllcyh2YWx1ZSkuZm9yRWFjaCgoW2ssIHZdKSA9PiB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgaywge1xuICAgICAgICAgICAgICAgIGdldDogKCkgPT4gdixcbiAgICAgICAgICAgICAgICBzZXQ6ICh2YWwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdiA9IHZhbDtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gQWNjdW11bGF0ZXMgYSBuZXcgb2JqZWN0IGludG8gdGhlIGFjY3VtdWxhdG9yXG4gICAgICogQHN1bW1hcnkgQWRkcyBwcm9wZXJ0aWVzIGZyb20gYSBuZXcgb2JqZWN0IHRvIHRoZSBhY2N1bXVsYXRvciwgbWFpbnRhaW5pbmcgdHlwZSBpbmZvcm1hdGlvblxuICAgICAqIEB0ZW1wbGF0ZSBWIC0gVGhlIHR5cGUgb2YgdGhlIG9iamVjdCBiZWluZyBhY2N1bXVsYXRlZFxuICAgICAqIEBwYXJhbSB7Vn0gdmFsdWUgLSBUaGUgb2JqZWN0IHRvIGFjY3VtdWxhdGVcbiAgICAgKiBAcmV0dXJucyBBIG5ldyBPYmplY3RBY2N1bXVsYXRvciBpbnN0YW5jZSB3aXRoIHVwZGF0ZWQgdHlwZSBpbmZvcm1hdGlvblxuICAgICAqIEBtZXJtYWlkXG4gICAgICogc2VxdWVuY2VEaWFncmFtXG4gICAgICogICBwYXJ0aWNpcGFudCBBIGFzIEFjY3VtdWxhdG9yXG4gICAgICogICBwYXJ0aWNpcGFudCBPIGFzIE9iamVjdFxuICAgICAqICAgQS0+Pk86IEdldCBlbnRyaWVzXG4gICAgICogICBsb29wIEZvciBlYWNoIGVudHJ5XG4gICAgICogICAgIEEtPj5BOiBEZWZpbmUgcHJvcGVydHlcbiAgICAgKiAgIGVuZFxuICAgICAqICAgQS0+PkE6IFVwZGF0ZSBzaXplXG4gICAgICogICBBLT4+QTogUmV0dXJuIHVwZGF0ZWQgYWNjdW11bGF0b3JcbiAgICAgKi9cbiAgICBhY2N1bXVsYXRlKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuZXhwYW5kKHZhbHVlKTtcbiAgICAgICAgdGhpcy5fX3NpemUgPSB0aGlzLl9fc2l6ZSArIE9iamVjdC5rZXlzKHZhbHVlKS5sZW5ndGg7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gUmV0cmlldmVzIGEgdmFsdWUgZnJvbSB0aGUgYWNjdW11bGF0b3IgYnkgaXRzIGtleVxuICAgICAqIEBzdW1tYXJ5IEdldHMgYSB2YWx1ZSBmcm9tIHRoZSBhY2N1bXVsYXRlZCBvYmplY3QgdXNpbmcgYSB0eXBlLXNhZmUga2V5XG4gICAgICogQHRlbXBsYXRlIFQgLSB2YWx1ZSB0eXBlXG4gICAgICogQHRlbXBsYXRlIEsgLSBUaGUga2V5IHR5cGUsIG11c3QgYmUgYSBrZXkgb2YgdGhpc1xuICAgICAqIEBwYXJhbSB7S30ga2V5IC0gVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmV0cmlldmVcbiAgICAgKiBAcmV0dXJucyBUaGUgdmFsdWUgYXNzb2NpYXRlZCB3aXRoIHRoZSBrZXlcbiAgICAgKi9cbiAgICBnZXQoa2V5KSB7XG4gICAgICAgIGlmICghKGtleSBpbiB0aGlzKSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgS2V5ICR7a2V5fSBkb2VzIG5vdCBleGlzdCBpbiBhY2N1bXVsYXRvci4gQXZhaWxhYmxlIGtleXM6ICR7dGhpcy5rZXlzKCkuam9pbihcIiwgXCIpfWApO1xuICAgICAgICByZXR1cm4gdGhpc1trZXldO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gUmV0cmlldmVzIGEgdmFsdWUgZnJvbSB0aGUgYWNjdW11bGF0b3IgYnkgaXRzIGtleVxuICAgICAqIEBzdW1tYXJ5IEdldHMgYSB2YWx1ZSBmcm9tIHRoZSBhY2N1bXVsYXRlZCBvYmplY3QgdXNpbmcgYSB0eXBlLXNhZmUga2V5XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSAtIFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJldHJpZXZlXG4gICAgICogQHBhcmFtIHthbnl9IHZhbHVlIC0gVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gcmV0cmlldmVcbiAgICAgKi9cbiAgICBwdXQoa2V5LCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5hY2N1bXVsYXRlKHsgW2tleV06IHZhbHVlIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gQ2hlY2tzIGlmIGEga2V5IGV4aXN0cyBpbiB0aGUgYWNjdW11bGF0b3JcbiAgICAgKiBAc3VtbWFyeSBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIGFjY3VtdWxhdG9yIGNvbnRhaW5zIGEgc3BlY2lmaWMga2V5XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSAtIFRoZSBrZXkgdG8gY2hlY2sgZm9yIGV4aXN0ZW5jZVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBUcnVlIGlmIHRoZSBrZXkgZXhpc3RzLCBmYWxzZSBvdGhlcndpc2VcbiAgICAgKi9cbiAgICBoYXMoa2V5KSB7XG4gICAgICAgIHJldHVybiAhIXRoaXNba2V5XTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFJlbW92ZXMgYSBrZXktdmFsdWUgcGFpciBmcm9tIHRoZSBhY2N1bXVsYXRvclxuICAgICAqIEBzdW1tYXJ5IERlbGV0ZXMgYSBwcm9wZXJ0eSBmcm9tIHRoZSBhY2N1bXVsYXRlZCBvYmplY3RcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5IC0gVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gcmVtb3ZlXG4gICAgICogQHJldHVybnMge30gVGhlIGFjY3VtdWxhdG9yIGluc3RhbmNlIHdpdGggdGhlIHNwZWNpZmllZCBwcm9wZXJ0eSByZW1vdmVkXG4gICAgICovXG4gICAgcmVtb3ZlKGtleSkge1xuICAgICAgICBpZiAoIShrZXkgaW4gdGhpcykpXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgZGVsZXRlIHRoaXNba2V5XTtcbiAgICAgICAgdGhpcy5fX3NpemUtLTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBSZXRyaWV2ZXMgYWxsIGtleXMgZnJvbSB0aGUgYWNjdW11bGF0b3JcbiAgICAgKiBAc3VtbWFyeSBHZXRzIGFuIGFycmF5IG9mIGFsbCBhY2N1bXVsYXRlZCBwcm9wZXJ0eSBrZXlzXG4gICAgICogQHJldHVybnMge3N0cmluZ1tdfSBBbiBhcnJheSBvZiBrZXlzIGFzIHN0cmluZ3NcbiAgICAgKi9cbiAgICBrZXlzKCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXModGhpcyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBSZXRyaWV2ZXMgYWxsIHZhbHVlcyBmcm9tIHRoZSBhY2N1bXVsYXRvclxuICAgICAqIEBzdW1tYXJ5IEdldHMgYW4gYXJyYXkgb2YgYWxsIGFjY3VtdWxhdGVkIHByb3BlcnR5IHZhbHVlc1xuICAgICAqIEByZXR1cm5zIEFuIGFycmF5IG9mIHZhbHVlc1xuICAgICAqL1xuICAgIHZhbHVlcygpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC52YWx1ZXModGhpcyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBHZXRzIHRoZSBudW1iZXIgb2Yga2V5LXZhbHVlIHBhaXJzIGluIHRoZSBhY2N1bXVsYXRvclxuICAgICAqIEBzdW1tYXJ5IFJldHVybnMgdGhlIGNvdW50IG9mIGFjY3VtdWxhdGVkIHByb3BlcnRpZXNcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBUaGUgbnVtYmVyIG9mIGtleS12YWx1ZSBwYWlyc1xuICAgICAqL1xuICAgIHNpemUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fc2l6ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIENsZWFycyBhbGwgYWNjdW11bGF0ZWQga2V5LXZhbHVlIHBhaXJzXG4gICAgICogQHN1bW1hcnkgUmVtb3ZlcyBhbGwgcHJvcGVydGllcyBmcm9tIHRoZSBhY2N1bXVsYXRvciBhbmQgcmV0dXJucyBhIG5ldyBlbXB0eSBpbnN0YW5jZVxuICAgICAqIEByZXR1cm5zIHtPYmplY3RBY2N1bXVsYXRvcjxuZXZlcj59IEEgbmV3IGVtcHR5IE9iamVjdEFjY3VtdWxhdG9yIGluc3RhbmNlXG4gICAgICovXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIHJldHVybiBuZXcgT2JqZWN0QWNjdW11bGF0b3IoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEV4ZWN1dGVzIGEgY2FsbGJhY2sgZm9yIGVhY2gga2V5LXZhbHVlIHBhaXIgaW4gdGhlIGFjY3VtdWxhdG9yXG4gICAgICogQHN1bW1hcnkgSXRlcmF0ZXMgb3ZlciBhbGwgYWNjdW11bGF0ZWQgcHJvcGVydGllcywgY2FsbGluZyBhIGZ1bmN0aW9uIGZvciBlYWNoXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihhbnksIHN0cmluZywgbnVtYmVyKTogdm9pZH0gY2FsbGJhY2sgLSBUaGUgZnVuY3Rpb24gdG8gZXhlY3V0ZSBmb3IgZWFjaCBlbnRyeVxuICAgICAqIEByZXR1cm5zIHt2b2lkfVxuICAgICAqL1xuICAgIGZvckVhY2goY2FsbGJhY2spIHtcbiAgICAgICAgT2JqZWN0LmVudHJpZXModGhpcykuZm9yRWFjaCgoW2tleSwgdmFsdWVdLCBpKSA9PiBjYWxsYmFjayh2YWx1ZSwga2V5LCBpKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBDcmVhdGVzIGEgbmV3IGFycmF5IHdpdGggdGhlIHJlc3VsdHMgb2YgY2FsbGluZyBhIHByb3ZpZGVkIGZ1bmN0aW9uIG9uIGV2ZXJ5IGVsZW1lbnQgaW4gdGhlIGFjY3VtdWxhdG9yXG4gICAgICogQHN1bW1hcnkgTWFwcyBlYWNoIGFjY3VtdWxhdGVkIHByb3BlcnR5IHRvIGEgbmV3IHZhbHVlIHVzaW5nIGEgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKiBAdGVtcGxhdGUgUiAtIFRoZSB0eXBlIG9mIHRoZSBtYXBwZWQgdmFsdWVzXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbihhbnksIHN0cmluZyxudW1iZXIpOiBSfSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRoYXQgcHJvZHVjZXMgYW4gZWxlbWVudCBvZiB0aGUgbmV3IGFycmF5XG4gICAgICogQHJldHVybnMge1JbXX0gQSBuZXcgYXJyYXkgd2l0aCBlYWNoIGVsZW1lbnQgYmVpbmcgdGhlIHJlc3VsdCBvZiB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKi9cbiAgICBtYXAoY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHRoaXMpLm1hcCgoW2tleSwgdmFsdWVdLCBpKSA9PiBjYWxsYmFjayh2YWx1ZSwga2V5LCBpKSk7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKbWFXeGxJam9pWVdOamRXMTFiR0YwYjNJdWFuTWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUlpd2ljMjkxY21ObGN5STZXeUl1TGk4dUxpOXpjbU12WVdOamRXMTFiR0YwYjNJdWRITWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklrRkJRVUU3T3pzN096czdSMEZQUnp0QlFVTklMRTFCUVUwc1QwRkJUeXhwUWtGQmFVSTdTVUZSTlVJN1VVRkRSU3hOUVVGTkxFTkJRVU1zWTBGQll5eERRVUZETEVsQlFVa3NSVUZCUlN4UlFVRlJMRVZCUVVVN1dVRkRjRU1zUzBGQlN5eEZRVUZGTEVOQlFVTTdXVUZEVWl4UlFVRlJMRVZCUVVVc1NVRkJTVHRaUVVOa0xGbEJRVmtzUlVGQlJTeExRVUZMTzFsQlEyNUNMRlZCUVZVc1JVRkJSU3hMUVVGTE8xTkJRMnhDTEVOQlFVTXNRMEZCUXp0SlFVTk1MRU5CUVVNN1NVRkZSRHM3T3pzN096dFBRVTlITzBsQlEwOHNUVUZCVFN4RFFVRnRRaXhMUVVGUk8xRkJRM3BETEUxQlFVMHNRMEZCUXl4UFFVRlBMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRVZCUVVVc1EwRkJReXhEUVVGRExFVkJRVVVzUlVGQlJUdFpRVU4yUXl4TlFVRk5MRU5CUVVNc1kwRkJZeXhEUVVGRExFbEJRVWtzUlVGQlJTeERRVUZETEVWQlFVVTdaMEpCUXpkQ0xFZEJRVWNzUlVGQlJTeEhRVUZITEVWQlFVVXNRMEZCUXl4RFFVRkRPMmRDUVVOYUxFZEJRVWNzUlVGQlJTeERRVUZETEVkQlFXVXNSVUZCUlN4RlFVRkZPMjlDUVVOMlFpeERRVUZETEVkQlFVY3NSMEZCUnl4RFFVRkRPMmRDUVVOV0xFTkJRVU03WjBKQlEwUXNXVUZCV1N4RlFVRkZMRWxCUVVrN1owSkJRMnhDTEZWQlFWVXNSVUZCUlN4SlFVRkpPMkZCUTJwQ0xFTkJRVU1zUTBGQlF6dFJRVU5NTEVOQlFVTXNRMEZCUXl4RFFVRkRPMGxCUTB3c1EwRkJRenRKUVVWRU96czdPenM3T3pzN096czdPenM3TzA5QlowSkhPMGxCUTBnc1ZVRkJWU3hEUVVGdFFpeExRVUZSTzFGQlEyNURMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdVVUZEYmtJc1NVRkJTU3hEUVVGRExFMUJRVTBzUjBGQlJ5eEpRVUZKTEVOQlFVTXNUVUZCVFN4SFFVRkhMRTFCUVUwc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNUVUZCVFN4RFFVRkRPMUZCUTNSRUxFOUJRVThzU1VGQmJVUXNRMEZCUXp0SlFVTTNSQ3hEUVVGRE8wbEJSVVE3T3pzN096czdUMEZQUnp0SlFVTklMRWRCUVVjc1EwRkJiMElzUjBGQlRUdFJRVU16UWl4SlFVRkpMRU5CUVVNc1EwRkJReXhIUVVGSExFbEJRVWtzU1VGQlNTeERRVUZETzFsQlEyaENMRTFCUVUwc1NVRkJTU3hMUVVGTExFTkJRMklzVDBGQlR5eEhRVUZoTEcxRVFVRnRSQ3hKUVVGSkxFTkJRVU1zU1VGQlNTeEZRVUZGTEVOQlFVTXNTVUZCU1N4RFFVTnlSaXhKUVVGSkxFTkJRMHdzUlVGQlJTeERRVU5LTEVOQlFVTTdVVUZEU2l4UFFVRlJMRWxCUVZrc1EwRkJReXhIUVVGUkxFTkJRVk1zUTBGQlF6dEpRVU42UXl4RFFVRkRPMGxCUlVRN096czdPMDlCUzBjN1NVRkRTQ3hIUVVGSExFTkJRVU1zUjBGQlZ5eEZRVUZGTEV0QlFWVTdVVUZEZWtJc1QwRkJUeXhKUVVGSkxFTkJRVU1zVlVGQlZTeERRVUZETEVWQlFVVXNRMEZCUXl4SFFVRkhMRU5CUVVNc1JVRkJSU3hMUVVGTExFVkJRVVVzUTBGQlF5eERRVUZETzBsQlF6TkRMRU5CUVVNN1NVRkZSRHM3T3pzN1QwRkxSenRKUVVOSUxFZEJRVWNzUTBGQlF5eEhRVUZYTzFGQlEySXNUMEZCVHl4RFFVRkRMRU5CUVVNc1NVRkJTU3hEUVVGRExFZEJRV2xDTEVOQlFVTXNRMEZCUXp0SlFVTnVReXhEUVVGRE8wbEJSVVE3T3pzN08wOUJTMGM3U1VGRFNDeE5RVUZOTEVOQlEwb3NSMEZCZDBJN1VVRkplRUlzU1VGQlNTeERRVUZETEVOQlFVTXNSMEZCUnl4SlFVRkpMRWxCUVVrc1EwRkJRenRaUVVGRkxFOUJRVThzU1VGQlNTeERRVUZETzFGQlJXaERMRTlCUVU4c1NVRkJTU3hEUVVGRExFZEJRV2xDTEVOQlFVTXNRMEZCUXp0UlFVTXZRaXhKUVVGSkxFTkJRVU1zVFVGQlRTeEZRVUZGTEVOQlFVTTdVVUZEWkN4UFFVRlBMRWxCUTI5RExFTkJRVU03U1VGRE9VTXNRMEZCUXp0SlFVVkVPenM3TzA5QlNVYzdTVUZEU0N4SlFVRkpPMUZCUTBZc1QwRkJUeXhOUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMGxCUXpOQ0xFTkJRVU03U1VGRlJEczdPenRQUVVsSE8wbEJRMGdzVFVGQlRUdFJRVU5LTEU5QlFVOHNUVUZCVFN4RFFVRkRMRTFCUVUwc1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF6dEpRVU0zUWl4RFFVRkRPMGxCUlVRN096czdUMEZKUnp0SlFVTklMRWxCUVVrN1VVRkRSaXhQUVVGUExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTTdTVUZEY2tJc1EwRkJRenRKUVVWRU96czdPMDlCU1VjN1NVRkRTQ3hMUVVGTE8xRkJRMGdzVDBGQlR5eEpRVUZKTEdsQ1FVRnBRaXhGUVVGRkxFTkJRVU03U1VGRGFrTXNRMEZCUXp0SlFVVkVPenM3T3p0UFFVdEhPMGxCUTBnc1QwRkJUeXhEUVVOTUxGRkJRWFZGTzFGQlJYWkZMRTFCUVUwc1EwRkJReXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNc1EwRkJReXhIUVVGSExFVkJRVVVzUzBGQlN5eERRVUZETEVWQlFVVXNRMEZCUXl4RlFVRkZMRVZCUVVVc1EwRkRMME1zVVVGQlVTeERRVUZETEV0QlFVc3NSVUZCUlN4SFFVRnBRaXhGUVVGRkxFTkJRVU1zUTBGQlF5eERRVU4wUXl4RFFVRkRPMGxCUTBvc1EwRkJRenRKUVVWRU96czdPenM3VDBGTlJ6dEpRVU5JTEVkQlFVY3NRMEZEUkN4UlFVRnZSVHRSUVVWd1JTeFBRVUZQTEUxQlFVMHNRMEZCUXl4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTXNRMEZCUXl4SFFVRkhMRVZCUVVVc1MwRkJTeXhEUVVGRExFVkJRVVVzUTBGQlF5eEZRVUZGTEVWQlFVVXNRMEZEYkVRc1VVRkJVU3hEUVVGRExFdEJRVXNzUlVGQlJTeEhRVUZwUWl4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVOMFF5eERRVUZETzBsQlEwb3NRMEZCUXp0RFFVTkdJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpTHlvcVhHNGdLaUJBWTJ4aGMzTWdUMkpxWldOMFFXTmpkVzExYkdGMGIzSmNiaUFxSUVCMFpXMXdiR0YwWlNCVUlDMGdWR2hsSUhSNWNHVWdiMllnZEdobElHRmpZM1Z0ZFd4aGRHVmtJRzlpYW1WamRDd2daWGgwWlc1a2N5QnZZbXBsWTNSY2JpQXFJRUJrWlhOamNtbHdkR2x2YmlCQklHTnNZWE56SUhSb1lYUWdZV05qZFcxMWJHRjBaWE1nYjJKcVpXTjBjeUJoYm1RZ2NISnZkbWxrWlhNZ2RIbHdaUzF6WVdabElHRmpZMlZ6Y3lCMGJ5QjBhR1ZwY2lCd2NtOXdaWEowYVdWekxseHVJQ29nU1hRZ1lXeHNiM2R6SUdadmNpQmtlVzVoYldsaklHRmtaR2wwYVc5dUlHOW1JSEJ5YjNCbGNuUnBaWE1nZDJocGJHVWdiV0ZwYm5SaGFXNXBibWNnZEhsd1pTQnBibVp2Y20xaGRHbHZiaTVjYmlBcUlFQnpkVzF0WVhKNUlFRmpZM1Z0ZFd4aGRHVnpJRzlpYW1WamRITWdZVzVrSUcxaGFXNTBZV2x1Y3lCMGVYQmxJR2x1Wm05eWJXRjBhVzl1SUdadmNpQmhZMk4xYlhWc1lYUmxaQ0J3Y205d1pYSjBhV1Z6WEc0Z0tpQkFiV1Z0WW1WeVQyWWdkWFJwYkhOY2JpQXFMMXh1Wlhod2IzSjBJR05zWVhOeklFOWlhbVZqZEVGalkzVnRkV3hoZEc5eVBGUWdaWGgwWlc1a2N5QnZZbXBsWTNRK0lIdGNiaUFnTHlvcVhHNGdJQ0FxSUVCd2NtbDJZWFJsWEc0Z0lDQXFJRUJrWlhOamNtbHdkR2x2YmlCVWFHVWdjMmw2WlNCdlppQjBhR1VnWVdOamRXMTFiR0YwWldRZ2IySnFaV04wWEc0Z0lDQXFJRUIwZVhCbElIdHVkVzFpWlhKOVhHNGdJQ0FxTDF4dUlDQndjbWwyWVhSbElGOWZjMmw2WlNFNklHNTFiV0psY2p0Y2JseHVJQ0JqYjI1emRISjFZM1J2Y2lncElIdGNiaUFnSUNCUFltcGxZM1F1WkdWbWFXNWxVSEp2Y0dWeWRIa29kR2hwY3l3Z1hDSmZYM05wZW1WY0lpd2dlMXh1SUNBZ0lDQWdkbUZzZFdVNklEQXNYRzRnSUNBZ0lDQjNjbWwwWVdKc1pUb2dkSEoxWlN4Y2JpQWdJQ0FnSUdOdmJtWnBaM1Z5WVdKc1pUb2dabUZzYzJVc1hHNGdJQ0FnSUNCbGJuVnRaWEpoWW14bE9pQm1ZV3h6WlN4Y2JpQWdJQ0I5S1R0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkFjSEp2ZEdWamRHVmtYRzRnSUNBcUlFQmtaWE5qY21sd2RHbHZiaUJGZUhCaGJtUnpJSFJvWlNCaFkyTjFiWFZzWVhSdmNpQjNhWFJvSUhCeWIzQmxjblJwWlhNZ1puSnZiU0JoSUc1bGR5QnZZbXBsWTNSY2JpQWdJQ29nUUhOMWJXMWhjbmtnUVdSa2N5QnVaWGNnY0hKdmNHVnlkR2xsY3lCMGJ5QjBhR1VnWVdOamRXMTFiR0YwYjNKY2JpQWdJQ29nUUhSbGJYQnNZWFJsSUZZZ0xTQlVhR1VnZEhsd1pTQnZaaUIwYUdVZ2IySnFaV04wSUdKbGFXNW5JR1Y0Y0dGdVpHVmtYRzRnSUNBcUlFQndZWEpoYlNCN1ZuMGdkbUZzZFdVZ0xTQlVhR1VnYjJKcVpXTjBJSFJ2SUdWNGNHRnVaQ0IzYVhSb1hHNGdJQ0FxSUVCeVpYUjFjbTV6SUh0MmIybGtmVnh1SUNBZ0tpOWNiaUFnY0hKdmRHVmpkR1ZrSUdWNGNHRnVaRHhXSUdWNGRHVnVaSE1nYjJKcVpXTjBQaWgyWVd4MVpUb2dWaWs2SUhadmFXUWdlMXh1SUNBZ0lFOWlhbVZqZEM1bGJuUnlhV1Z6S0haaGJIVmxLUzVtYjNKRllXTm9LQ2hiYXl3Z2RsMHBJRDArSUh0Y2JpQWdJQ0FnSUU5aWFtVmpkQzVrWldacGJtVlFjbTl3WlhKMGVTaDBhR2x6TENCckxDQjdYRzRnSUNBZ0lDQWdJR2RsZERvZ0tDa2dQVDRnZGl4Y2JpQWdJQ0FnSUNBZ2MyVjBPaUFvZG1Gc09pQldXMnRsZVc5bUlGWmRLU0E5UGlCN1hHNGdJQ0FnSUNBZ0lDQWdkaUE5SUhaaGJEdGNiaUFnSUNBZ0lDQWdmU3hjYmlBZ0lDQWdJQ0FnWTI5dVptbG5kWEpoWW14bE9pQjBjblZsTEZ4dUlDQWdJQ0FnSUNCbGJuVnRaWEpoWW14bE9pQjBjblZsTEZ4dUlDQWdJQ0FnZlNrN1hHNGdJQ0FnZlNrN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRR1JsYzJOeWFYQjBhVzl1SUVGalkzVnRkV3hoZEdWeklHRWdibVYzSUc5aWFtVmpkQ0JwYm5SdklIUm9aU0JoWTJOMWJYVnNZWFJ2Y2x4dUlDQWdLaUJBYzNWdGJXRnllU0JCWkdSeklIQnliM0JsY25ScFpYTWdabkp2YlNCaElHNWxkeUJ2WW1wbFkzUWdkRzhnZEdobElHRmpZM1Z0ZFd4aGRHOXlMQ0J0WVdsdWRHRnBibWx1WnlCMGVYQmxJR2x1Wm05eWJXRjBhVzl1WEc0Z0lDQXFJRUIwWlcxd2JHRjBaU0JXSUMwZ1ZHaGxJSFI1Y0dVZ2IyWWdkR2hsSUc5aWFtVmpkQ0JpWldsdVp5QmhZMk4xYlhWc1lYUmxaRnh1SUNBZ0tpQkFjR0Z5WVcwZ2UxWjlJSFpoYkhWbElDMGdWR2hsSUc5aWFtVmpkQ0IwYnlCaFkyTjFiWFZzWVhSbFhHNGdJQ0FxSUVCeVpYUjFjbTV6SUVFZ2JtVjNJRTlpYW1WamRFRmpZM1Z0ZFd4aGRHOXlJR2x1YzNSaGJtTmxJSGRwZEdnZ2RYQmtZWFJsWkNCMGVYQmxJR2x1Wm05eWJXRjBhVzl1WEc0Z0lDQXFJRUJ0WlhKdFlXbGtYRzRnSUNBcUlITmxjWFZsYm1ObFJHbGhaM0poYlZ4dUlDQWdLaUFnSUhCaGNuUnBZMmx3WVc1MElFRWdZWE1nUVdOamRXMTFiR0YwYjNKY2JpQWdJQ29nSUNCd1lYSjBhV05wY0dGdWRDQlBJR0Z6SUU5aWFtVmpkRnh1SUNBZ0tpQWdJRUV0UGo1UE9pQkhaWFFnWlc1MGNtbGxjMXh1SUNBZ0tpQWdJR3h2YjNBZ1JtOXlJR1ZoWTJnZ1pXNTBjbmxjYmlBZ0lDb2dJQ0FnSUVFdFBqNUJPaUJFWldacGJtVWdjSEp2Y0dWeWRIbGNiaUFnSUNvZ0lDQmxibVJjYmlBZ0lDb2dJQ0JCTFQ0K1FUb2dWWEJrWVhSbElITnBlbVZjYmlBZ0lDb2dJQ0JCTFQ0K1FUb2dVbVYwZFhKdUlIVndaR0YwWldRZ1lXTmpkVzExYkdGMGIzSmNiaUFnSUNvdlhHNGdJR0ZqWTNWdGRXeGhkR1U4VmlCbGVIUmxibVJ6SUc5aWFtVmpkRDRvZG1Gc2RXVTZJRllwT2lCVUlDWWdWaUFtSUU5aWFtVmpkRUZqWTNWdGRXeGhkRzl5UEZRZ0ppQldQaUI3WEc0Z0lDQWdkR2hwY3k1bGVIQmhibVFvZG1Gc2RXVXBPMXh1SUNBZ0lIUm9hWE11WDE5emFYcGxJRDBnZEdocGN5NWZYM05wZW1VZ0t5QlBZbXBsWTNRdWEyVjVjeWgyWVd4MVpTa3ViR1Z1WjNSb08xeHVJQ0FnSUhKbGRIVnliaUIwYUdseklHRnpJSFZ1YTI1dmQyNGdZWE1nVkNBbUlGWWdKaUJQWW1wbFkzUkJZMk4xYlhWc1lYUnZjanhVSUNZZ1ZqNDdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nUUdSbGMyTnlhWEIwYVc5dUlGSmxkSEpwWlhabGN5QmhJSFpoYkhWbElHWnliMjBnZEdobElHRmpZM1Z0ZFd4aGRHOXlJR0o1SUdsMGN5QnJaWGxjYmlBZ0lDb2dRSE4xYlcxaGNua2dSMlYwY3lCaElIWmhiSFZsSUdaeWIyMGdkR2hsSUdGalkzVnRkV3hoZEdWa0lHOWlhbVZqZENCMWMybHVaeUJoSUhSNWNHVXRjMkZtWlNCclpYbGNiaUFnSUNvZ1FIUmxiWEJzWVhSbElGUWdMU0IyWVd4MVpTQjBlWEJsWEc0Z0lDQXFJRUIwWlcxd2JHRjBaU0JMSUMwZ1ZHaGxJR3RsZVNCMGVYQmxMQ0J0ZFhOMElHSmxJR0VnYTJWNUlHOW1JSFJvYVhOY2JpQWdJQ29nUUhCaGNtRnRJSHRMZlNCclpYa2dMU0JVYUdVZ2EyVjVJRzltSUhSb1pTQjJZV3gxWlNCMGJ5QnlaWFJ5YVdWMlpWeHVJQ0FnS2lCQWNtVjBkWEp1Y3lCVWFHVWdkbUZzZFdVZ1lYTnpiMk5wWVhSbFpDQjNhWFJvSUhSb1pTQnJaWGxjYmlBZ0lDb3ZYRzRnSUdkbGREeExJR1Y0ZEdWdVpITWdhMlY1YjJZZ1ZENG9hMlY1T2lCTEtUb2dWRnRMWFNCN1hHNGdJQ0FnYVdZZ0tDRW9hMlY1SUdsdUlIUm9hWE1wS1Z4dUlDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLRnh1SUNBZ0lDQWdJQ0JnUzJWNUlDUjdhMlY1SUdGeklITjBjbWx1WjMwZ1pHOWxjeUJ1YjNRZ1pYaHBjM1FnYVc0Z1lXTmpkVzExYkdGMGIzSXVJRUYyWVdsc1lXSnNaU0JyWlhsek9pQWtlM1JvYVhNdWEyVjVjeWdwTG1wdmFXNG9YRzRnSUNBZ0lDQWdJQ0FnWENJc0lGd2lYRzRnSUNBZ0lDQWdJQ2w5WUZ4dUlDQWdJQ0FnS1R0Y2JpQWdJQ0J5WlhSMWNtNGdLSFJvYVhNZ1lYTWdZVzU1S1Z0clpYa2dZWE1nUzEwZ1lYTWdWRnRMWFR0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkFaR1Z6WTNKcGNIUnBiMjRnVW1WMGNtbGxkbVZ6SUdFZ2RtRnNkV1VnWm5KdmJTQjBhR1VnWVdOamRXMTFiR0YwYjNJZ1lua2dhWFJ6SUd0bGVWeHVJQ0FnS2lCQWMzVnRiV0Z5ZVNCSFpYUnpJR0VnZG1Gc2RXVWdabkp2YlNCMGFHVWdZV05qZFcxMWJHRjBaV1FnYjJKcVpXTjBJSFZ6YVc1bklHRWdkSGx3WlMxellXWmxJR3RsZVZ4dUlDQWdLaUJBY0dGeVlXMGdlM04wY21sdVozMGdhMlY1SUMwZ1ZHaGxJR3RsZVNCdlppQjBhR1VnZG1Gc2RXVWdkRzhnY21WMGNtbGxkbVZjYmlBZ0lDb2dRSEJoY21GdElIdGhibmw5SUhaaGJIVmxJQzBnVkdobElHdGxlU0J2WmlCMGFHVWdkbUZzZFdVZ2RHOGdjbVYwY21sbGRtVmNiaUFnSUNvdlhHNGdJSEIxZENoclpYazZJSE4wY21sdVp5d2dkbUZzZFdVNklHRnVlU2tnZTF4dUlDQWdJSEpsZEhWeWJpQjBhR2x6TG1GalkzVnRkV3hoZEdVb2V5QmJhMlY1WFRvZ2RtRnNkV1VnZlNrN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRR1JsYzJOeWFYQjBhVzl1SUVOb1pXTnJjeUJwWmlCaElHdGxlU0JsZUdsemRITWdhVzRnZEdobElHRmpZM1Z0ZFd4aGRHOXlYRzRnSUNBcUlFQnpkVzF0WVhKNUlFUmxkR1Z5YldsdVpYTWdkMmhsZEdobGNpQjBhR1VnWVdOamRXMTFiR0YwYjNJZ1kyOXVkR0ZwYm5NZ1lTQnpjR1ZqYVdacFl5QnJaWGxjYmlBZ0lDb2dRSEJoY21GdElIdHpkSEpwYm1kOUlHdGxlU0F0SUZSb1pTQnJaWGtnZEc4Z1kyaGxZMnNnWm05eUlHVjRhWE4wWlc1alpWeHVJQ0FnS2lCQWNtVjBkWEp1Y3lCN1ltOXZiR1ZoYm4wZ1ZISjFaU0JwWmlCMGFHVWdhMlY1SUdWNGFYTjBjeXdnWm1Gc2MyVWdiM1JvWlhKM2FYTmxYRzRnSUNBcUwxeHVJQ0JvWVhNb2EyVjVPaUJ6ZEhKcGJtY3BPaUJpYjI5c1pXRnVJSHRjYmlBZ0lDQnlaWFIxY200Z0lTRjBhR2x6VzJ0bGVTQmhjeUJyWlhsdlppQjBhR2x6WFR0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkFaR1Z6WTNKcGNIUnBiMjRnVW1WdGIzWmxjeUJoSUd0bGVTMTJZV3gxWlNCd1lXbHlJR1p5YjIwZ2RHaGxJR0ZqWTNWdGRXeGhkRzl5WEc0Z0lDQXFJRUJ6ZFcxdFlYSjVJRVJsYkdWMFpYTWdZU0J3Y205d1pYSjBlU0JtY205dElIUm9aU0JoWTJOMWJYVnNZWFJsWkNCdlltcGxZM1JjYmlBZ0lDb2dRSEJoY21GdElIdHpkSEpwYm1kOUlHdGxlU0F0SUZSb1pTQnJaWGtnYjJZZ2RHaGxJSEJ5YjNCbGNuUjVJSFJ2SUhKbGJXOTJaVnh1SUNBZ0tpQkFjbVYwZFhKdWN5QjdmU0JVYUdVZ1lXTmpkVzExYkdGMGIzSWdhVzV6ZEdGdVkyVWdkMmwwYUNCMGFHVWdjM0JsWTJsbWFXVmtJSEJ5YjNCbGNuUjVJSEpsYlc5MlpXUmNiaUFnSUNvdlhHNGdJSEpsYlc5MlpTaGNiaUFnSUNCclpYazZJR3RsZVc5bUlIUm9hWE1nZkNCemRISnBibWRjYmlBZ0tUcGNiaUFnSUNCOElDaFBiV2wwUEhSb2FYTXNJSFI1Y0dWdlppQnJaWGsrSUNZZ1QySnFaV04wUVdOamRXMTFiR0YwYjNJOFQyMXBkRHgwYUdsekxDQjBlWEJsYjJZZ2EyVjVQajRwWEc0Z0lDQWdmQ0IwYUdseklIdGNiaUFnSUNCcFppQW9JU2hyWlhrZ2FXNGdkR2hwY3lrcElISmxkSFZ5YmlCMGFHbHpPMXh1WEc0Z0lDQWdaR1ZzWlhSbElIUm9hWE5iYTJWNUlHRnpJR3RsZVc5bUlIUm9hWE5kTzF4dUlDQWdJSFJvYVhNdVgxOXphWHBsTFMwN1hHNGdJQ0FnY21WMGRYSnVJSFJvYVhNZ1lYTWdkVzVyYm05M2JpQmhjeUJQYldsMFBIUm9hWE1zSUhSNWNHVnZaaUJyWlhrK0lDWmNiaUFnSUNBZ0lFOWlhbVZqZEVGalkzVnRkV3hoZEc5eVBFOXRhWFE4ZEdocGN5d2dkSGx3Wlc5bUlHdGxlVDQrTzF4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFQmtaWE5qY21sd2RHbHZiaUJTWlhSeWFXVjJaWE1nWVd4c0lHdGxlWE1nWm5KdmJTQjBhR1VnWVdOamRXMTFiR0YwYjNKY2JpQWdJQ29nUUhOMWJXMWhjbmtnUjJWMGN5QmhiaUJoY25KaGVTQnZaaUJoYkd3Z1lXTmpkVzExYkdGMFpXUWdjSEp2Y0dWeWRIa2dhMlY1YzF4dUlDQWdLaUJBY21WMGRYSnVjeUI3YzNSeWFXNW5XMTE5SUVGdUlHRnljbUY1SUc5bUlHdGxlWE1nWVhNZ2MzUnlhVzVuYzF4dUlDQWdLaTljYmlBZ2EyVjVjeWdwT2lCemRISnBibWRiWFNCN1hHNGdJQ0FnY21WMGRYSnVJRTlpYW1WamRDNXJaWGx6S0hSb2FYTXBPMXh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUVCa1pYTmpjbWx3ZEdsdmJpQlNaWFJ5YVdWMlpYTWdZV3hzSUhaaGJIVmxjeUJtY205dElIUm9aU0JoWTJOMWJYVnNZWFJ2Y2x4dUlDQWdLaUJBYzNWdGJXRnllU0JIWlhSeklHRnVJR0Z5Y21GNUlHOW1JR0ZzYkNCaFkyTjFiWFZzWVhSbFpDQndjbTl3WlhKMGVTQjJZV3gxWlhOY2JpQWdJQ29nUUhKbGRIVnlibk1nUVc0Z1lYSnlZWGtnYjJZZ2RtRnNkV1Z6WEc0Z0lDQXFMMXh1SUNCMllXeDFaWE1vS1RvZ1ZGdHJaWGx2WmlCVVhWdGRJSHRjYmlBZ0lDQnlaWFIxY200Z1QySnFaV04wTG5aaGJIVmxjeWgwYUdsektUdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJBWkdWelkzSnBjSFJwYjI0Z1IyVjBjeUIwYUdVZ2JuVnRZbVZ5SUc5bUlHdGxlUzEyWVd4MVpTQndZV2x5Y3lCcGJpQjBhR1VnWVdOamRXMTFiR0YwYjNKY2JpQWdJQ29nUUhOMWJXMWhjbmtnVW1WMGRYSnVjeUIwYUdVZ1kyOTFiblFnYjJZZ1lXTmpkVzExYkdGMFpXUWdjSEp2Y0dWeWRHbGxjMXh1SUNBZ0tpQkFjbVYwZFhKdWN5QjdiblZ0WW1WeWZTQlVhR1VnYm5WdFltVnlJRzltSUd0bGVTMTJZV3gxWlNCd1lXbHljMXh1SUNBZ0tpOWNiaUFnYzJsNlpTZ3BPaUJ1ZFcxaVpYSWdlMXh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpMbDlmYzJsNlpUdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJBWkdWelkzSnBjSFJwYjI0Z1EyeGxZWEp6SUdGc2JDQmhZMk4xYlhWc1lYUmxaQ0JyWlhrdGRtRnNkV1VnY0dGcGNuTmNiaUFnSUNvZ1FITjFiVzFoY25rZ1VtVnRiM1psY3lCaGJHd2djSEp2Y0dWeWRHbGxjeUJtY205dElIUm9aU0JoWTJOMWJYVnNZWFJ2Y2lCaGJtUWdjbVYwZFhKdWN5QmhJRzVsZHlCbGJYQjBlU0JwYm5OMFlXNWpaVnh1SUNBZ0tpQkFjbVYwZFhKdWN5QjdUMkpxWldOMFFXTmpkVzExYkdGMGIzSThibVYyWlhJK2ZTQkJJRzVsZHlCbGJYQjBlU0JQWW1wbFkzUkJZMk4xYlhWc1lYUnZjaUJwYm5OMFlXNWpaVnh1SUNBZ0tpOWNiaUFnWTJ4bFlYSW9LVG9nVDJKcVpXTjBRV05qZFcxMWJHRjBiM0k4Ym1WMlpYSStJSHRjYmlBZ0lDQnlaWFIxY200Z2JtVjNJRTlpYW1WamRFRmpZM1Z0ZFd4aGRHOXlLQ2s3WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1FHUmxjMk55YVhCMGFXOXVJRVY0WldOMWRHVnpJR0VnWTJGc2JHSmhZMnNnWm05eUlHVmhZMmdnYTJWNUxYWmhiSFZsSUhCaGFYSWdhVzRnZEdobElHRmpZM1Z0ZFd4aGRHOXlYRzRnSUNBcUlFQnpkVzF0WVhKNUlFbDBaWEpoZEdWeklHOTJaWElnWVd4c0lHRmpZM1Z0ZFd4aGRHVmtJSEJ5YjNCbGNuUnBaWE1zSUdOaGJHeHBibWNnWVNCbWRXNWpkR2x2YmlCbWIzSWdaV0ZqYUZ4dUlDQWdLaUJBY0dGeVlXMGdlMloxYm1OMGFXOXVLR0Z1ZVN3Z2MzUnlhVzVuTENCdWRXMWlaWElwT2lCMmIybGtmU0JqWVd4c1ltRmpheUF0SUZSb1pTQm1kVzVqZEdsdmJpQjBieUJsZUdWamRYUmxJR1p2Y2lCbFlXTm9JR1Z1ZEhKNVhHNGdJQ0FxSUVCeVpYUjFjbTV6SUh0MmIybGtmVnh1SUNBZ0tpOWNiaUFnWm05eVJXRmphQ2hjYmlBZ0lDQmpZV3hzWW1GamF6b2dLSFpoYkhWbE9pQjBhR2x6VzJ0bGVXOW1JSFJvYVhOZExDQnJaWGs2SUd0bGVXOW1JSFJvYVhNc0lHazZJRzUxYldKbGNpa2dQVDRnZG05cFpGeHVJQ0FwT2lCMmIybGtJSHRjYmlBZ0lDQlBZbXBsWTNRdVpXNTBjbWxsY3loMGFHbHpLUzVtYjNKRllXTm9LQ2hiYTJWNUxDQjJZV3gxWlYwc0lHa3BJRDArWEc0Z0lDQWdJQ0JqWVd4c1ltRmpheWgyWVd4MVpTd2dhMlY1SUdGeklHdGxlVzltSUhSb2FYTXNJR2twWEc0Z0lDQWdLVHRjYmlBZ2ZWeHVYRzRnSUM4cUtseHVJQ0FnS2lCQVpHVnpZM0pwY0hScGIyNGdRM0psWVhSbGN5QmhJRzVsZHlCaGNuSmhlU0IzYVhSb0lIUm9aU0J5WlhOMWJIUnpJRzltSUdOaGJHeHBibWNnWVNCd2NtOTJhV1JsWkNCbWRXNWpkR2x2YmlCdmJpQmxkbVZ5ZVNCbGJHVnRaVzUwSUdsdUlIUm9aU0JoWTJOMWJYVnNZWFJ2Y2x4dUlDQWdLaUJBYzNWdGJXRnllU0JOWVhCeklHVmhZMmdnWVdOamRXMTFiR0YwWldRZ2NISnZjR1Z5ZEhrZ2RHOGdZU0J1WlhjZ2RtRnNkV1VnZFhOcGJtY2dZU0JqWVd4c1ltRmpheUJtZFc1amRHbHZibHh1SUNBZ0tpQkFkR1Z0Y0d4aGRHVWdVaUF0SUZSb1pTQjBlWEJsSUc5bUlIUm9aU0J0WVhCd1pXUWdkbUZzZFdWelhHNGdJQ0FxSUVCd1lYSmhiU0I3Wm5WdVkzUnBiMjRvWVc1NUxDQnpkSEpwYm1jc2JuVnRZbVZ5S1RvZ1VuMGdZMkZzYkdKaFkyc2dMU0JHZFc1amRHbHZiaUIwYUdGMElIQnliMlIxWTJWeklHRnVJR1ZzWlcxbGJuUWdiMllnZEdobElHNWxkeUJoY25KaGVWeHVJQ0FnS2lCQWNtVjBkWEp1Y3lCN1VsdGRmU0JCSUc1bGR5QmhjbkpoZVNCM2FYUm9JR1ZoWTJnZ1pXeGxiV1Z1ZENCaVpXbHVaeUIwYUdVZ2NtVnpkV3gwSUc5bUlIUm9aU0JqWVd4c1ltRmpheUJtZFc1amRHbHZibHh1SUNBZ0tpOWNiaUFnYldGd1BGSStLRnh1SUNBZ0lHTmhiR3hpWVdOck9pQW9kbUZzZFdVNklIUm9hWE5iYTJWNWIyWWdkR2hwYzEwc0lHdGxlVG9nYTJWNWIyWWdkR2hwY3l3Z2FUb2diblZ0WW1WeUtTQTlQaUJTWEc0Z0lDazZJRkpiWFNCN1hHNGdJQ0FnY21WMGRYSnVJRTlpYW1WamRDNWxiblJ5YVdWektIUm9hWE1wTG0xaGNDZ29XMnRsZVN3Z2RtRnNkV1ZkTENCcEtTQTlQbHh1SUNBZ0lDQWdZMkZzYkdKaFkyc29kbUZzZFdVc0lHdGxlU0JoY3lCclpYbHZaaUIwYUdsekxDQnBLVnh1SUNBZ0lDazdYRzRnSUgxY2JuMWNiaUpkZlE9PSIsIi8qKlxuICogQGRlc2NyaXB0aW9uIERldGVybWluZXMgaWYgdGhlIGN1cnJlbnQgZW52aXJvbm1lbnQgaXMgYSBicm93c2VyIGJ5IGNoZWNraW5nIHRoZSBwcm90b3R5cGUgY2hhaW4gb2YgdGhlIGdsb2JhbCBvYmplY3QuXG4gKiBAc3VtbWFyeSBDaGVja3MgaWYgdGhlIGNvZGUgaXMgcnVubmluZyBpbiBhIGJyb3dzZXIgZW52aXJvbm1lbnQuXG4gKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHRoZSBlbnZpcm9ubWVudCBpcyBhIGJyb3dzZXIsIGZhbHNlIG90aGVyd2lzZS5cbiAqIEBmdW5jdGlvbiBpc0Jyb3dzZXJcbiAqIEBtZW1iZXJPZiBtb2R1bGU6TG9nZ2luZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gaXNCcm93c2VyKCkge1xuICAgIHJldHVybiAoT2JqZWN0LmdldFByb3RvdHlwZU9mKE9iamVjdC5nZXRQcm90b3R5cGVPZihnbG9iYWxUaGlzKSkgIT09XG4gICAgICAgIE9iamVjdC5wcm90b3R5cGUpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d2ViLmpzLm1hcCIsImltcG9ydCB7IE9iamVjdEFjY3VtdWxhdG9yIH0gZnJvbSBcInR5cGVkLW9iamVjdC1hY2N1bXVsYXRvclwiO1xuaW1wb3J0IHsgdG9FTlZGb3JtYXQgfSBmcm9tIFwiLi90ZXh0LmpzXCI7XG5pbXBvcnQgeyBpc0Jyb3dzZXIgfSBmcm9tIFwiLi93ZWIuanNcIjtcbmltcG9ydCB7IEJyb3dzZXJFbnZLZXksIERlZmF1bHRMb2dnaW5nQ29uZmlnLCBFTlZfUEFUSF9ERUxJTUlURVIsIH0gZnJvbSBcIi4vY29uc3RhbnRzLmpzXCI7XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBFbnZpcm9ubWVudCBhY2N1bXVsYXRvciB0aGF0IGxhemlseSByZWFkcyBmcm9tIHJ1bnRpbWUgc291cmNlcy5cbiAqIEBzdW1tYXJ5IEV4dGVuZHMge0BsaW5rIE9iamVjdEFjY3VtdWxhdG9yfSB0byBtZXJnZSBjb25maWd1cmF0aW9uIG9iamVjdHMgd2hpbGUgcmVzb2x2aW5nIHZhbHVlcyBmcm9tIE5vZGUgb3IgYnJvd3NlciBlbnZpcm9ubWVudCB2YXJpYWJsZXMgb24gZGVtYW5kLlxuICogQHRlbXBsYXRlIFRcbiAqIEBjbGFzcyBFbnZpcm9ubWVudFxuICogQGV4YW1wbGVcbiAqIGNvbnN0IENvbmZpZyA9IEVudmlyb25tZW50LmFjY3VtdWxhdGUoeyBsb2dnaW5nOiB7IGxldmVsOiBcImluZm9cIiB9IH0pO1xuICogY29uc29sZS5sb2coQ29uZmlnLmxvZ2dpbmcubGV2ZWwpO1xuICogY29uc29sZS5sb2coU3RyaW5nKENvbmZpZy5sb2dnaW5nLmxldmVsKSk7IC8vID0+IExPR0dJTkdfX0xFVkVMIGtleSB3aGVuIHNlcmlhbGl6ZWRcbiAqIEBtZXJtYWlkXG4gKiBzZXF1ZW5jZURpYWdyYW1cbiAqICAgcGFydGljaXBhbnQgQ2xpZW50XG4gKiAgIHBhcnRpY2lwYW50IEVudiBhcyBFbnZpcm9ubWVudFxuICogICBwYXJ0aWNpcGFudCBQcm9jZXNzIGFzIHByb2Nlc3MuZW52XG4gKiAgIHBhcnRpY2lwYW50IEJyb3dzZXIgYXMgZ2xvYmFsVGhpcy5FTlZcbiAqICAgQ2xpZW50LT4+RW52OiBhY2N1bXVsYXRlKHBhcnRpYWxDb25maWcpXG4gKiAgIEVudi0+PkVudjogZXhwYW5kKHZhbHVlcylcbiAqICAgQ2xpZW50LT4+RW52OiBDb25maWcubG9nZ2luZy5sZXZlbFxuICogICBhbHQgQnJvd3NlciBydW50aW1lXG4gKiAgICAgRW52LT4+QnJvd3NlcjogbG9va3VwIEVOViBrZXlcbiAqICAgICBCcm93c2VyLS0+PkVudjogcmVzb2x2ZWQgdmFsdWVcbiAqICAgZWxzZSBOb2RlIHJ1bnRpbWVcbiAqICAgICBFbnYtPj5Qcm9jZXNzOiBsb29rdXAgRU5WIGtleVxuICogICAgIFByb2Nlc3MtLT4+RW52OiByZXNvbHZlZCB2YWx1ZVxuICogICBlbmRcbiAqICAgRW52LS0+PkNsaWVudDogbWVyZ2VkIHZhbHVlXG4gKi9cbmNvbnN0IEVtcHR5VmFsdWUgPSBTeW1ib2woXCJFbnZpcm9ubWVudEVtcHR5XCIpO1xuY29uc3QgTW9kZWxTeW1ib2wgPSBTeW1ib2woXCJFbnZpcm9ubWVudE1vZGVsXCIpO1xuZXhwb3J0IGNsYXNzIEVudmlyb25tZW50IGV4dGVuZHMgT2JqZWN0QWNjdW11bGF0b3Ige1xuICAgIC8qKlxuICAgICAqIEBzdGF0aWNcbiAgICAgKiBAcHJvdGVjdGVkXG4gICAgICogQGRlc2NyaXB0aW9uIEEgZmFjdG9yeSBmdW5jdGlvbiBmb3IgY3JlYXRpbmcgRW52aXJvbm1lbnQgaW5zdGFuY2VzLlxuICAgICAqIEBzdW1tYXJ5IERlZmluZXMgaG93IG5ldyBpbnN0YW5jZXMgb2YgdGhlIEVudmlyb25tZW50IGNsYXNzIHNob3VsZCBiZSBjcmVhdGVkLlxuICAgICAqIEByZXR1cm4ge0Vudmlyb25tZW50PGFueT59IEEgbmV3IGluc3RhbmNlIG9mIHRoZSBFbnZpcm9ubWVudCBjbGFzcy5cbiAgICAgKi9cbiAgICBzdGF0aWMgeyB0aGlzLmZhY3RvcnkgPSAoKSA9PiBuZXcgRW52aXJvbm1lbnQoKTsgfVxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgTW9kZWxTeW1ib2wsIHtcbiAgICAgICAgICAgIHZhbHVlOiB7fSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFJldHJpZXZlcyBhIHZhbHVlIGZyb20gdGhlIHJ1bnRpbWUgZW52aXJvbm1lbnQuXG4gICAgICogQHN1bW1hcnkgSGFuZGxlcyBicm93c2VyIGFuZCBOb2RlLmpzIGVudmlyb25tZW50cyBieSBub3JtYWxpemluZyBrZXlzIGFuZCBwYXJzaW5nIHZhbHVlcy5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gayAtIEtleSB0byByZXNvbHZlIGZyb20gdGhlIGVudmlyb25tZW50LlxuICAgICAqIEByZXR1cm4ge3Vua25vd259IFZhbHVlIHJlc29sdmVkIGZyb20gdGhlIGVudmlyb25tZW50IG9yIGB1bmRlZmluZWRgIHdoZW4gYWJzZW50LlxuICAgICAqL1xuICAgIGZyb21FbnYoaykge1xuICAgICAgICBsZXQgZW52O1xuICAgICAgICBpZiAoaXNCcm93c2VyKCkpIHtcbiAgICAgICAgICAgIGVudiA9XG4gICAgICAgICAgICAgICAgZ2xvYmFsVGhpc1tCcm93c2VyRW52S2V5XSB8fCB7fTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGVudiA9IGdsb2JhbFRoaXMucHJvY2Vzcy5lbnY7XG4gICAgICAgICAgICBrID0gdG9FTlZGb3JtYXQoayk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VFbnZWYWx1ZShlbnZba10pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gQ29udmVydHMgc3RyaW5naWZpZWQgZW52aXJvbm1lbnQgdmFsdWVzIGludG8gbmF0aXZlIHR5cGVzLlxuICAgICAqIEBzdW1tYXJ5IEludGVycHJldHMgYm9vbGVhbnMgYW5kIG51bWJlcnMgd2hpbGUgbGVhdmluZyBvdGhlciB0eXBlcyB1bmNoYW5nZWQuXG4gICAgICogQHBhcmFtIHt1bmtub3dufSB2YWwgLSBSYXcgdmFsdWUgcmV0cmlldmVkIGZyb20gdGhlIGVudmlyb25tZW50LlxuICAgICAqIEByZXR1cm4ge3Vua25vd259IFBhcnNlZCB2YWx1ZSBjb252ZXJ0ZWQgdG8gYm9vbGVhbiwgbnVtYmVyLCBvciBsZWZ0IGFzLWlzLlxuICAgICAqL1xuICAgIHBhcnNlRW52VmFsdWUodmFsKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsICE9PSBcInN0cmluZ1wiKVxuICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgaWYgKHZhbCA9PT0gXCJ0cnVlXCIpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgaWYgKHZhbCA9PT0gXCJmYWxzZVwiKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICBjb25zdCByZXN1bHQgPSBwYXJzZUZsb2F0KHZhbCk7XG4gICAgICAgIGlmICghaXNOYU4ocmVzdWx0KSlcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIHJldHVybiB2YWw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBFeHBhbmRzIGFuIG9iamVjdCBpbnRvIHRoZSBlbnZpcm9ubWVudC5cbiAgICAgKiBAc3VtbWFyeSBEZWZpbmVzIGxhenkgcHJvcGVydGllcyB0aGF0IGZpcnN0IGNvbnN1bHQgcnVudGltZSB2YXJpYWJsZXMgYmVmb3JlIGZhbGxpbmcgYmFjayB0byBzZWVkZWQgdmFsdWVzLlxuICAgICAqIEB0ZW1wbGF0ZSBWIC0gVHlwZSBvZiB0aGUgb2JqZWN0IGJlaW5nIGV4cGFuZGVkLlxuICAgICAqIEBwYXJhbSB7Vn0gdmFsdWUgLSBPYmplY3QgdG8gZXhwb3NlIHRocm91Z2ggZW52aXJvbm1lbnQgZ2V0dGVycyBhbmQgc2V0dGVycy5cbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIGV4cGFuZCh2YWx1ZSkge1xuICAgICAgICBPYmplY3QuZW50cmllcyh2YWx1ZSkuZm9yRWFjaCgoW2ssIHZdKSA9PiB7XG4gICAgICAgICAgICBFbnZpcm9ubWVudC5tZXJnZU1vZGVsKHRoaXNbTW9kZWxTeW1ib2xdLCBrLCB2KTtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBrLCB7XG4gICAgICAgICAgICAgICAgZ2V0OiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZyb21FbnYgPSB0aGlzLmZyb21FbnYoayk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgZnJvbUVudiAhPT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmcm9tRW52O1xuICAgICAgICAgICAgICAgICAgICBpZiAodiAmJiB0eXBlb2YgdiA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEVudmlyb25tZW50LmJ1aWxkRW52UHJveHkodiwgW2tdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgbW9kZWwgcHJvdmlkZXMgYW4gZW1wdHkgc3RyaW5nLCBtYXJrIHdpdGggRW1wdHlWYWx1ZSBzbyBpbnN0YW5jZSBwcm94eSBjYW4gcmV0dXJuIHVuZGVmaW5lZCB3aXRob3V0IGVuYWJsaW5nIGtleSBjb21wb3NpdGlvblxuICAgICAgICAgICAgICAgICAgICBpZiAodiA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEVtcHR5VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHY7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzZXQ6ICh2YWwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdiA9IHZhbDtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gUmV0dXJucyBhIHByb3h5IGVuZm9yY2luZyByZXF1aXJlZCBlbnZpcm9ubWVudCB2YXJpYWJsZXMuXG4gICAgICogQHN1bW1hcnkgQWNjZXNzaW5nIGEgcHJvcGVydHkgdGhhdCByZXNvbHZlcyB0byBgdW5kZWZpbmVkYCBvciBhbiBlbXB0eSBzdHJpbmcgd2hlbiBkZWNsYXJlZCBpbiB0aGUgbW9kZWwgdGhyb3dzIGFuIGVycm9yLlxuICAgICAqIEByZXR1cm4ge3RoaXN9IFByb3h5IG9mIHRoZSBlbnZpcm9ubWVudCBlbmZvcmNpbmcgcmVxdWlyZWQgdmFyaWFibGVzLlxuICAgICAqL1xuICAgIG9yVGhyb3coKSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdGhpcy1hbGlhc1xuICAgICAgICBjb25zdCBiYXNlID0gdGhpcztcbiAgICAgICAgY29uc3QgbW9kZWxSb290ID0gYmFzZVtNb2RlbFN5bWJvbF07XG4gICAgICAgIGNvbnN0IGJ1aWxkS2V5ID0gKHBhdGgpID0+IHBhdGgubWFwKChzZWdtZW50KSA9PiB0b0VOVkZvcm1hdChzZWdtZW50KSkuam9pbihFTlZfUEFUSF9ERUxJTUlURVIpO1xuICAgICAgICBjb25zdCByZWFkUnVudGltZSA9IChrZXkpID0+IEVudmlyb25tZW50LnJlYWRSdW50aW1lRW52KGtleSk7XG4gICAgICAgIGNvbnN0IHBhcnNlUnVudGltZSA9IChyYXcpID0+IHR5cGVvZiByYXcgIT09IFwidW5kZWZpbmVkXCIgPyB0aGlzLnBhcnNlRW52VmFsdWUocmF3KSA6IHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3QgbWlzc2luZyA9IChrZXksIGVtcHR5ID0gZmFsc2UpID0+IEVudmlyb25tZW50Lm1pc3NpbmdFbnZFcnJvcihrZXksIGVtcHR5KTtcbiAgICAgICAgY29uc3QgY3JlYXRlTmVzdGVkUHJveHkgPSAobW9kZWwsIHBhdGgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSB7XG4gICAgICAgICAgICAgICAgZ2V0KF90YXJnZXQsIHByb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9wICE9PSBcInN0cmluZ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmV4dFBhdGggPSBbLi4ucGF0aCwgcHJvcF07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGVudktleSA9IGJ1aWxkS2V5KG5leHRQYXRoKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcnVudGltZVJhdyA9IHJlYWRSdW50aW1lKGVudktleSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcnVudGltZVJhdyA9PT0gXCJzdHJpbmdcIiAmJiBydW50aW1lUmF3Lmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG1pc3NpbmcoZW52S2V5LCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcnVudGltZVZhbHVlID0gcGFyc2VSdW50aW1lKHJ1bnRpbWVSYXcpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJ1bnRpbWVWYWx1ZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBydW50aW1lVmFsdWUgPT09IFwic3RyaW5nXCIgJiYgcnVudGltZVZhbHVlLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBtaXNzaW5nKGVudktleSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcnVudGltZVZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGhhc1Byb3AgPSBtb2RlbCAmJiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9kZWwsIHByb3ApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWhhc1Byb3ApXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBtaXNzaW5nKGVudktleSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vZGVsVmFsdWUgPSBtb2RlbFtwcm9wXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBtb2RlbFZhbHVlID09PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1vZGVsVmFsdWUgPT09IFwiXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBtaXNzaW5nKGVudktleSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtb2RlbFZhbHVlICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2YgbW9kZWxWYWx1ZSA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgIUFycmF5LmlzQXJyYXkobW9kZWxWYWx1ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVOZXN0ZWRQcm94eShtb2RlbFZhbHVlLCBuZXh0UGF0aCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1vZGVsVmFsdWU7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvd25LZXlzKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbW9kZWwgPyBSZWZsZWN0Lm93bktleXMobW9kZWwpIDogW107XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoX3RhcmdldCwgcHJvcCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIW1vZGVsKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2RlbCwgcHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb3h5KHt9LCBoYW5kbGVyKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IHtcbiAgICAgICAgICAgIGdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9wICE9PSBcInN0cmluZ1wiKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcik7XG4gICAgICAgICAgICAgICAgY29uc3QgaGFzTW9kZWxQcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZGVsUm9vdCwgcHJvcCk7XG4gICAgICAgICAgICAgICAgaWYgKCFoYXNNb2RlbFByb3ApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKTtcbiAgICAgICAgICAgICAgICBjb25zdCBlbnZLZXkgPSBidWlsZEtleShbcHJvcF0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJ1bnRpbWVSYXcgPSByZWFkUnVudGltZShlbnZLZXkpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcnVudGltZVJhdyA9PT0gXCJzdHJpbmdcIiAmJiBydW50aW1lUmF3Lmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbWlzc2luZyhlbnZLZXksIHRydWUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJ1bnRpbWVWYWx1ZSA9IHBhcnNlUnVudGltZShydW50aW1lUmF3KTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJ1bnRpbWVWYWx1ZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJ1bnRpbWVWYWx1ZSA9PT0gXCJzdHJpbmdcIiAmJiBydW50aW1lVmFsdWUubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbWlzc2luZyhlbnZLZXksIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcnVudGltZVZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBtb2RlbFZhbHVlID0gbW9kZWxSb290W3Byb3BdO1xuICAgICAgICAgICAgICAgIGlmIChtb2RlbFZhbHVlICYmXG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiBtb2RlbFZhbHVlID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgICAgICAgICAgICFBcnJheS5pc0FycmF5KG1vZGVsVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVOZXN0ZWRQcm94eShtb2RlbFZhbHVlLCBbcHJvcF0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG1vZGVsVmFsdWUgPT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKTtcbiAgICAgICAgICAgICAgICBjb25zdCBhY3R1YWwgPSBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3ApO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYWN0dWFsID09PSBcInVuZGVmaW5lZFwiIHx8IGFjdHVhbCA9PT0gXCJcIilcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbWlzc2luZyhlbnZLZXksIGFjdHVhbCA9PT0gXCJcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjdHVhbDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBuZXcgUHJveHkoYmFzZSwgaGFuZGxlcik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwcm90ZWN0ZWRcbiAgICAgKiBAc3RhdGljXG4gICAgICogQGRlc2NyaXB0aW9uIFJldHJpZXZlcyBvciBjcmVhdGVzIHRoZSBzaW5nbGV0b24gaW5zdGFuY2Ugb2YgdGhlIEVudmlyb25tZW50IGNsYXNzLlxuICAgICAqIEBzdW1tYXJ5IEVuc3VyZXMgb25seSBvbmUge0BsaW5rIEVudmlyb25tZW50fSBpbnN0YW5jZSBpcyBjcmVhdGVkLCB3cmFwcGluZyBpdCBpbiBhIHByb3h5IHRvIGNvbXBvc2UgRU5WIGtleXMgb24gZGVtYW5kLlxuICAgICAqIEB0ZW1wbGF0ZSBFXG4gICAgICogQHBhcmFtIHsuLi51bmtub3duW119IGFyZ3MgLSBBcmd1bWVudHMgZm9yd2FyZGVkIHRvIHRoZSBmYWN0b3J5IHdoZW4gaW5zdGFudGlhdGluZyB0aGUgc2luZ2xldG9uLlxuICAgICAqIEByZXR1cm4ge0V9IFNpbmdsZXRvbiBlbnZpcm9ubWVudCBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBzdGF0aWMgaW5zdGFuY2UoLi4uYXJncykge1xuICAgICAgICBpZiAoIUVudmlyb25tZW50Ll9pbnN0YW5jZSkge1xuICAgICAgICAgICAgY29uc3QgYmFzZSA9IEVudmlyb25tZW50LmZhY3RvcnkoLi4uYXJncyk7XG4gICAgICAgICAgICBjb25zdCBwcm94aWVkID0gbmV3IFByb3h5KGJhc2UsIHtcbiAgICAgICAgICAgICAgICBnZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IEVtcHR5VmFsdWUpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgcHJvcGVydHkgZXhpc3RzIG9uIHRoZSBpbnN0YW5jZSBidXQgcmVzb2x2ZXMgdG8gdW5kZWZpbmVkLCByZXR1cm4gdW5kZWZpbmVkIChubyBwcm94eSlcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBwcm9wID09PSBcInN0cmluZ1wiICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGFyZ2V0LCBwcm9wKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvcCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXZvaWQgaW50ZXJmZXJpbmcgd2l0aCBsb2dnaW5nIGNvbmZpZyBsb29rdXBzIGZvciBvcHRpb25hbCBmaWVsZHMgbGlrZSAnYXBwJ1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3AgPT09IFwiYXBwXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBFbnZpcm9ubWVudC5idWlsZEVudlByb3h5KHVuZGVmaW5lZCwgW3Byb3BdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgRW52aXJvbm1lbnQuX2luc3RhbmNlID0gcHJveGllZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRW52aXJvbm1lbnQuX2luc3RhbmNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAc3RhdGljXG4gICAgICogQGRlc2NyaXB0aW9uIEFjY3VtdWxhdGVzIHRoZSBnaXZlbiB2YWx1ZSBpbnRvIHRoZSBlbnZpcm9ubWVudC5cbiAgICAgKiBAc3VtbWFyeSBBZGRzIG5ldyBwcm9wZXJ0aWVzLCBoaWRpbmcgcmF3IGRlc2NyaXB0b3JzIHRvIGF2b2lkIGxlYWtpbmcgZW51bWVyYXRpb24gc2VtYW50aWNzLlxuICAgICAqIEB0ZW1wbGF0ZSBUXG4gICAgICogQHRlbXBsYXRlIFZcbiAgICAgKiBAcGFyYW0ge1Z9IHZhbHVlIC0gT2JqZWN0IHRvIG1lcmdlIGludG8gdGhlIGVudmlyb25tZW50LlxuICAgICAqIEByZXR1cm4ge0Vudmlyb25tZW50fSBVcGRhdGVkIGVudmlyb25tZW50IHJlZmVyZW5jZS5cbiAgICAgKi9cbiAgICBzdGF0aWMgYWNjdW11bGF0ZSh2YWx1ZSkge1xuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IEVudmlyb25tZW50Lmluc3RhbmNlKCk7XG4gICAgICAgIE9iamVjdC5rZXlzKGluc3RhbmNlKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGluc3RhbmNlLCBrZXkpO1xuICAgICAgICAgICAgaWYgKGRlc2MgJiYgZGVzYy5jb25maWd1cmFibGUgJiYgZGVzYy5lbnVtZXJhYmxlKSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGluc3RhbmNlLCBrZXksIHtcbiAgICAgICAgICAgICAgICAgICAgLi4uZGVzYyxcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gaW5zdGFuY2UuYWNjdW11bGF0ZSh2YWx1ZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBSZXRyaWV2ZXMgYSB2YWx1ZSB1c2luZyBhIGRvdC1wYXRoIGtleSBmcm9tIHRoZSBhY2N1bXVsYXRlZCBlbnZpcm9ubWVudC5cbiAgICAgKiBAc3VtbWFyeSBEZWxlZ2F0ZXMgdG8gdGhlIHNpbmdsZXRvbiBpbnN0YW5jZSB0byBhY2Nlc3Mgc3RvcmVkIGNvbmZpZ3VyYXRpb24uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSAtIEtleSB0byByZXNvbHZlIGZyb20gdGhlIGVudmlyb25tZW50IHN0b3JlLlxuICAgICAqIEByZXR1cm4ge3Vua25vd259IFN0b3JlZCB2YWx1ZSBjb3JyZXNwb25kaW5nIHRvIHRoZSBwcm92aWRlZCBrZXkuXG4gICAgICovXG4gICAgc3RhdGljIGdldChrZXkpIHtcbiAgICAgICAgcmV0dXJuIEVudmlyb25tZW50Ll9pbnN0YW5jZS5nZXQoa2V5KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEJ1aWxkcyBhIHByb3h5IHRoYXQgY29tcG9zZXMgZW52aXJvbm1lbnQga2V5cyBmb3IgbmVzdGVkIHByb3BlcnRpZXMuXG4gICAgICogQHN1bW1hcnkgQWxsb3dzIGNoYWluZWQgcHJvcGVydHkgYWNjZXNzIHRvIGVtaXQgdXBwZXJjYXNlIEVOViBpZGVudGlmaWVycyB3aGlsZSBob25vcmluZyBleGlzdGluZyBydW50aW1lIG92ZXJyaWRlcy5cbiAgICAgKiBAcGFyYW0ge2FueX0gY3VycmVudCAtIFNlZWQgbW9kZWwgc2VnbWVudCB1c2VkIHdoZW4gcHJvamVjdGluZyBuZXN0ZWQgc3RydWN0dXJlcy5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBwYXRoIC0gQWNjdW11bGF0ZWQgcGF0aCBzZWdtZW50cyBsZWFkaW5nIHRvIHRoZSBwcm94eS5cbiAgICAgKiBAcmV0dXJuIHthbnl9IFByb3h5IHRoYXQgcmVzb2x2ZXMgZW52aXJvbm1lbnQgdmFsdWVzIG9yIGNvbXBvc2VzIGFkZGl0aW9uYWwgcHJveGllcyBmb3IgZGVlcGVyIHBhdGhzLlxuICAgICAqL1xuICAgIHN0YXRpYyBidWlsZEVudlByb3h5KGN1cnJlbnQsIHBhdGgpIHtcbiAgICAgICAgY29uc3QgYnVpbGRLZXkgPSAocCkgPT4gcC5tYXAoKHNlZykgPT4gdG9FTlZGb3JtYXQoc2VnKSkuam9pbihFTlZfUEFUSF9ERUxJTUlURVIpO1xuICAgICAgICAvLyBIZWxwZXIgdG8gcmVhZCBmcm9tIHRoZSBhY3RpdmUgZW52aXJvbm1lbnQgZ2l2ZW4gYSBjb21wb3NlZCBrZXlcbiAgICAgICAgY29uc3QgcmVhZEVudiA9IChrZXkpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBFbnZpcm9ubWVudC5yZWFkUnVudGltZUVudihrZXkpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBoYW5kbGVyID0ge1xuICAgICAgICAgICAgZ2V0KF90YXJnZXQsIHByb3ApIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvcCA9PT0gU3ltYm9sLnRvUHJpbWl0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoKSA9PiBidWlsZEtleShwYXRoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHByb3AgPT09IFwidG9TdHJpbmdcIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4gYnVpbGRLZXkocGF0aCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwcm9wID09PSBcInZhbHVlT2ZcIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4gYnVpbGRLZXkocGF0aCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvcCA9PT0gXCJzeW1ib2xcIilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBjb25zdCBoYXNQcm9wID0gISFjdXJyZW50ICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChjdXJyZW50LCBwcm9wKTtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0TW9kZWwgPSBoYXNQcm9wID8gY3VycmVudFtwcm9wXSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0UGF0aCA9IFsuLi5wYXRoLCBwcm9wXTtcbiAgICAgICAgICAgICAgICBjb25zdCBjb21wb3NlZEtleSA9IGJ1aWxkS2V5KG5leHRQYXRoKTtcbiAgICAgICAgICAgICAgICAvLyBJZiBhbiBFTlYgdmFsdWUgZXhpc3RzIGZvciB0aGlzIHBhdGgsIHJldHVybiBpdCBkaXJlY3RseVxuICAgICAgICAgICAgICAgIGNvbnN0IGVudlZhbHVlID0gcmVhZEVudihjb21wb3NlZEtleSk7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBlbnZWYWx1ZSAhPT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVudlZhbHVlO1xuICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgaWYgdGhlIG1vZGVsIGhhcyBhbiBvYmplY3QgYXQgdGhpcyBwYXRoLCBrZWVwIGRyaWxsaW5nIHdpdGggYSBwcm94eVxuICAgICAgICAgICAgICAgIGNvbnN0IGlzTmV4dE9iamVjdCA9IG5leHRNb2RlbCAmJiB0eXBlb2YgbmV4dE1vZGVsID09PSBcIm9iamVjdFwiO1xuICAgICAgICAgICAgICAgIGlmIChpc05leHRPYmplY3QpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBFbnZpcm9ubWVudC5idWlsZEVudlByb3h5KG5leHRNb2RlbCwgbmV4dFBhdGgpO1xuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBtb2RlbCBtYXJrcyB0aGlzIGxlYWYgYXMgYW4gZW1wdHkgc3RyaW5nLCB0cmVhdCBhcyB1bmRlZmluZWQgKG5vIHByb3h5KVxuICAgICAgICAgICAgICAgIGlmIChoYXNQcm9wICYmIG5leHRNb2RlbCA9PT0gXCJcIilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgbW9kZWwgZXhwbGljaXRseSBjb250YWlucyB0aGUgcHJvcGVydHkgd2l0aCB2YWx1ZSB1bmRlZmluZWQsIHRyZWF0IGFzIHVuZGVmaW5lZCAobm8gcHJveHkpXG4gICAgICAgICAgICAgICAgaWYgKGhhc1Byb3AgJiYgdHlwZW9mIG5leHRNb2RlbCA9PT0gXCJ1bmRlZmluZWRcIilcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAvLyBBbHdheXMgcmV0dXJuIGEgcHJveHkgZm9yIGZ1cnRoZXIgcGF0aCBjb21wb3NpdGlvbiB3aGVuIG5vIEVOViB2YWx1ZTtcbiAgICAgICAgICAgICAgICAvLyBkbyBub3Qgc3VyZmFjZSBwcmltaXRpdmUgbW9kZWwgZGVmYXVsdHMgaGVyZSAodGhpcyBBUEkgaXMgZm9yIGtleSBjb21wb3NpdGlvbikuXG4gICAgICAgICAgICAgICAgcmV0dXJuIEVudmlyb25tZW50LmJ1aWxkRW52UHJveHkodW5kZWZpbmVkLCBuZXh0UGF0aCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3duS2V5cygpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudCA/IFJlZmxlY3Qub3duS2V5cyhjdXJyZW50KSA6IFtdO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihfdCwgcCkge1xuICAgICAgICAgICAgICAgIGlmICghY3VycmVudClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGN1cnJlbnQsIHApKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0ge307XG4gICAgICAgIHJldHVybiBuZXcgUHJveHkodGFyZ2V0LCBoYW5kbGVyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHN0YXRpY1xuICAgICAqIEBkZXNjcmlwdGlvbiBSZXRyaWV2ZXMgdGhlIGtleXMgb2YgdGhlIGVudmlyb25tZW50LCBvcHRpb25hbGx5IGNvbnZlcnRpbmcgdGhlbSB0byBFTlYgZm9ybWF0LlxuICAgICAqIEBzdW1tYXJ5IEdldHMgYWxsIGtleXMgaW4gdGhlIGVudmlyb25tZW50LCB3aXRoIGFuIG9wdGlvbiB0byBmb3JtYXQgdGhlbSBmb3IgZW52aXJvbm1lbnQgdmFyaWFibGVzLlxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3RvRW52PXRydWVdIC0gV2hldGhlciB0byBjb252ZXJ0IHRoZSBrZXlzIHRvIEVOViBmb3JtYXQuXG4gICAgICogQHJldHVybiB7c3RyaW5nW119IEFuIGFycmF5IG9mIGtleXMgZnJvbSB0aGUgZW52aXJvbm1lbnQuXG4gICAgICovXG4gICAgc3RhdGljIGtleXModG9FbnYgPSB0cnVlKSB7XG4gICAgICAgIHJldHVybiBFbnZpcm9ubWVudC5pbnN0YW5jZSgpXG4gICAgICAgICAgICAua2V5cygpXG4gICAgICAgICAgICAubWFwKChrKSA9PiAodG9FbnYgPyB0b0VOVkZvcm1hdChrKSA6IGspKTtcbiAgICB9XG4gICAgc3RhdGljIG1lcmdlTW9kZWwobW9kZWwsIGtleSwgdmFsdWUpIHtcbiAgICAgICAgaWYgKCFtb2RlbClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nID0gbW9kZWxba2V5XTtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IGV4aXN0aW5nICYmIHR5cGVvZiBleGlzdGluZyA9PT0gXCJvYmplY3RcIiAmJiAhQXJyYXkuaXNBcnJheShleGlzdGluZylcbiAgICAgICAgICAgICAgICA/IGV4aXN0aW5nXG4gICAgICAgICAgICAgICAgOiB7fTtcbiAgICAgICAgICAgIG1vZGVsW2tleV0gPSB0YXJnZXQ7XG4gICAgICAgICAgICBPYmplY3QuZW50cmllcyh2YWx1ZSkuZm9yRWFjaCgoW2NoaWxkS2V5LCBjaGlsZFZhbHVlXSkgPT4ge1xuICAgICAgICAgICAgICAgIEVudmlyb25tZW50Lm1lcmdlTW9kZWwodGFyZ2V0LCBjaGlsZEtleSwgY2hpbGRWYWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBtb2RlbFtrZXldID0gdmFsdWU7XG4gICAgfVxuICAgIHN0YXRpYyByZWFkUnVudGltZUVudihrZXkpIHtcbiAgICAgICAgaWYgKGlzQnJvd3NlcigpKSB7XG4gICAgICAgICAgICBjb25zdCBlbnYgPSBnbG9iYWxUaGlzW0Jyb3dzZXJFbnZLZXldO1xuICAgICAgICAgICAgcmV0dXJuIGVudiA/IGVudltrZXldIDogdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBnbG9iYWxUaGlzPy5wcm9jZXNzPy5lbnY/LltrZXldO1xuICAgIH1cbiAgICBzdGF0aWMgbWlzc2luZ0VudkVycm9yKGtleSwgZW1wdHkpIHtcbiAgICAgICAgY29uc3Qgc3VmZml4ID0gZW1wdHkgPyBcImFuIGVtcHR5IHN0cmluZ1wiIDogXCJ1bmRlZmluZWRcIjtcbiAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihgRW52aXJvbm1lbnQgdmFyaWFibGUgJHtrZXl9IGlzIHJlcXVpcmVkIGJ1dCB3YXMgJHtzdWZmaXh9LmApO1xuICAgIH1cbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uIFNpbmdsZXRvbiBlbnZpcm9ubWVudCBpbnN0YW5jZSBzZWVkZWQgd2l0aCBkZWZhdWx0IGxvZ2dpbmcgY29uZmlndXJhdGlvbi5cbiAqIEBzdW1tYXJ5IENvbWJpbmVzIHtAbGluayBEZWZhdWx0TG9nZ2luZ0NvbmZpZ30gd2l0aCBydW50aW1lIGVudmlyb25tZW50IHZhcmlhYmxlcyB0byBwcm92aWRlIGNvbnNpc3RlbnQgbG9nZ2luZyBkZWZhdWx0cyBhY3Jvc3MgcGxhdGZvcm1zLlxuICogQGNvbnN0IExvZ2dlZEVudmlyb25tZW50XG4gKiBAbWVtYmVyT2YgbW9kdWxlOkxvZ2dpbmdcbiAqL1xuZXhwb3J0IGNvbnN0IExvZ2dlZEVudmlyb25tZW50ID0gRW52aXJvbm1lbnQuYWNjdW11bGF0ZShPYmplY3QuYXNzaWduKHt9LCBEZWZhdWx0TG9nZ2luZ0NvbmZpZywge1xuICAgIGVudjogKGlzQnJvd3NlcigpICYmIGdsb2JhbFRoaXNbQnJvd3NlckVudktleV1cbiAgICAgICAgPyBnbG9iYWxUaGlzW0Jyb3dzZXJFbnZLZXldW1wiTk9ERV9FTlZcIl1cbiAgICAgICAgOiBnbG9iYWxUaGlzLnByb2Nlc3MuZW52W1wiTk9ERV9FTlZcIl0pIHx8IFwiZGV2ZWxvcG1lbnRcIixcbn0pKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWVudmlyb25tZW50LmpzLm1hcCIsImltcG9ydCB7IHN0eWxlIH0gZnJvbSBcInN0eWxlZC1zdHJpbmctYnVpbGRlclwiO1xuaW1wb3J0IHsgRGVmYXVsdFRoZW1lLCBMb2dMZXZlbCwgTnVtZXJpY0xvZ0xldmVscyB9IGZyb20gXCIuL2NvbnN0YW50cy5qc1wiO1xuaW1wb3J0IHsgc2YgfSBmcm9tIFwiLi90ZXh0LmpzXCI7XG5pbXBvcnQgeyBMb2dnZWRFbnZpcm9ubWVudCB9IGZyb20gXCIuL2Vudmlyb25tZW50LmpzXCI7XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBBIG1pbmltYWwgbG9nZ2VyIGltcGxlbWVudGF0aW9uLlxuICogQHN1bW1hcnkgTWluaUxvZ2dlciBpcyBhIGxpZ2h0d2VpZ2h0IGxvZ2dpbmcgY2xhc3MgdGhhdCBpbXBsZW1lbnRzIHRoZSBMb2dnZXIgaW50ZXJmYWNlLlxuICogSXQgcHJvdmlkZXMgYmFzaWMgbG9nZ2luZyBmdW5jdGlvbmFsaXR5IHdpdGggc3VwcG9ydCBmb3IgZGlmZmVyZW50IGxvZyBsZXZlbHMsIHZlcmJvc2l0eSxcbiAqIGNvbnRleHQtYXdhcmUgbG9nZ2luZywgYW5kIGN1c3RvbWl6YWJsZSBmb3JtYXR0aW5nLlxuICogQHBhcmFtIHtzdHJpbmd9IGNvbnRleHQgLSBUaGUgY29udGV4dCAodHlwaWNhbGx5IGNsYXNzIG5hbWUpIHRoaXMgbG9nZ2VyIGlzIGFzc29jaWF0ZWQgd2l0aFxuICogQHBhcmFtIHtQYXJ0aWFsPExvZ2dpbmdDb25maWc+fSBjb25mIC0gT3B0aW9uYWwgY29uZmlndXJhdGlvbiB0byBvdmVycmlkZSBnbG9iYWwgc2V0dGluZ3NcbiAqIEBjbGFzcyBNaW5pTG9nZ2VyXG4gKiBAZXhhbXBsZVxuICogLy8gQ3JlYXRlIGEgbmV3IGxvZ2dlciBmb3IgYSBjbGFzc1xuICogY29uc3QgbG9nZ2VyID0gbmV3IE1pbmlMb2dnZXIoJ015Q2xhc3MnKTtcbiAqXG4gKiAvLyBMb2cgbWVzc2FnZXMgYXQgZGlmZmVyZW50IGxldmVsc1xuICogbG9nZ2VyLmluZm8oJ1RoaXMgaXMgYW4gaW5mbyBtZXNzYWdlJyk7XG4gKiBsb2dnZXIuZGVidWcoJ1RoaXMgaXMgYSBkZWJ1ZyBtZXNzYWdlJyk7XG4gKiBsb2dnZXIuZXJyb3IoJ1NvbWV0aGluZyB3ZW50IHdyb25nJyk7XG4gKlxuICogLy8gQ3JlYXRlIGEgY2hpbGQgbG9nZ2VyIGZvciBhIHNwZWNpZmljIG1ldGhvZFxuICogY29uc3QgbWV0aG9kTG9nZ2VyID0gbG9nZ2VyLmZvcignbXlNZXRob2QnKTtcbiAqIG1ldGhvZExvZ2dlci52ZXJib3NlKCdEZXRhaWxlZCBpbmZvcm1hdGlvbicsIDIpO1xuICpcbiAqIC8vIExvZyB3aXRoIGN1c3RvbSBjb25maWd1cmF0aW9uXG4gKiBsb2dnZXIuZm9yKCdzcGVjaWFsTWV0aG9kJywgeyBzdHlsZTogdHJ1ZSB9KS5pbmZvKCdTdHlsZWQgbWVzc2FnZScpO1xuICovXG5leHBvcnQgY2xhc3MgTWluaUxvZ2dlciB7XG4gICAgY29uc3RydWN0b3IoY29udGV4dCwgY29uZikge1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICB0aGlzLmNvbmYgPSBjb25mO1xuICAgIH1cbiAgICBjb25maWcoa2V5KSB7XG4gICAgICAgIGlmICh0aGlzLmNvbmYgJiYga2V5IGluIHRoaXMuY29uZilcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbmZba2V5XTtcbiAgICAgICAgcmV0dXJuIExvZ2dpbmcuZ2V0Q29uZmlnKClba2V5XTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIENyZWF0ZXMgYSBjaGlsZCBsb2dnZXIgZm9yIGEgc3BlY2lmaWMgbWV0aG9kIG9yIGNvbnRleHRcbiAgICAgKiBAc3VtbWFyeSBSZXR1cm5zIGEgbmV3IGxvZ2dlciBpbnN0YW5jZSB3aXRoIHRoZSBjdXJyZW50IGNvbnRleHQgZXh0ZW5kZWQgYnkgdGhlIHNwZWNpZmllZCBtZXRob2QgbmFtZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nIHwgRnVuY3Rpb259IG1ldGhvZCAtIFRoZSBtZXRob2QgbmFtZSBvciBmdW5jdGlvbiB0byBjcmVhdGUgYSBsb2dnZXIgZm9yXG4gICAgICogQHBhcmFtIHtQYXJ0aWFsPExvZ2dpbmdDb25maWc+fSBjb25maWcgLSBPcHRpb25hbCBjb25maWd1cmF0aW9uIHRvIG92ZXJyaWRlIHNldHRpbmdzXG4gICAgICogQHBhcmFtIHsuLi5hbnlbXX0gYXJncyAtIEFkZGl0aW9uYWwgYXJndW1lbnRzIHRvIHBhc3MgdG8gdGhlIGxvZ2dlciBmYWN0b3J5XG4gICAgICogQHJldHVybiB7TG9nZ2VyfSBBIG5ldyBsb2dnZXIgaW5zdGFuY2UgZm9yIHRoZSBzcGVjaWZpZWQgbWV0aG9kXG4gICAgICovXG4gICAgZm9yKG1ldGhvZCwgY29uZmlnLCBcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG4gICAgLi4uYXJncykge1xuICAgICAgICBpZiAoIWNvbmZpZyAmJiB0eXBlb2YgbWV0aG9kID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICBjb25maWcgPSBtZXRob2Q7XG4gICAgICAgICAgICBtZXRob2QgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBtZXRob2QgPSBtZXRob2RcbiAgICAgICAgICAgICAgICA/IHR5cGVvZiBtZXRob2QgPT09IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgPyBtZXRob2RcbiAgICAgICAgICAgICAgICAgICAgOiBtZXRob2QubmFtZVxuICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgUHJveHkodGhpcywge1xuICAgICAgICAgICAgZ2V0OiAodGFyZ2V0LCBwLCByZWNlaXZlcikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IFJlZmxlY3QuZ2V0KHRhcmdldCwgcCwgcmVjZWl2ZXIpO1xuICAgICAgICAgICAgICAgIGlmIChwID09PSBcImNvbmZpZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJveHkodGhpcy5jb25maWcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdldDogKHRhcmdldCwgcCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb25maWcgJiYgcCBpbiBjb25maWcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb25maWdbcF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgcCwgcmVjZWl2ZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwID09PSBcImNvbnRleHRcIiAmJiBtZXRob2QpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtyZXN1bHQsIG1ldGhvZF0uam9pbihcIi5cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIENyZWF0ZXMgYSBmb3JtYXR0ZWQgbG9nIHN0cmluZ1xuICAgICAqIEBzdW1tYXJ5IEdlbmVyYXRlcyBhIGxvZyBzdHJpbmcgd2l0aCB0aW1lc3RhbXAsIGNvbG9yZWQgbG9nIGxldmVsLCBjb250ZXh0LCBhbmQgbWVzc2FnZVxuICAgICAqIEBwYXJhbSB7TG9nTGV2ZWx9IGxldmVsIC0gVGhlIGxvZyBsZXZlbCBmb3IgdGhpcyBtZXNzYWdlXG4gICAgICogQHBhcmFtIHtTdHJpbmdMaWtlIHwgRXJyb3J9IG1lc3NhZ2UgLSBUaGUgbWVzc2FnZSB0byBsb2cgb3IgYW4gRXJyb3Igb2JqZWN0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtlcnJvcl0gLSBPcHRpb25hbCBlcnJvciB0byBleHRyYWN0IHN0YWNrIHRyYWNlIHRvIGluY2x1ZGUgaW4gdGhlIGxvZ1xuICAgICAqIEByZXR1cm4ge3N0cmluZ30gQSBmb3JtYXR0ZWQgbG9nIHN0cmluZyB3aXRoIGFsbCBjb21wb25lbnRzXG4gICAgICovXG4gICAgY3JlYXRlTG9nKGxldmVsLCBtZXNzYWdlLCBlcnJvcikge1xuICAgICAgICBjb25zdCBsb2cgPSB7fTtcbiAgICAgICAgY29uc3Qgc3R5bGUgPSB0aGlzLmNvbmZpZyhcInN0eWxlXCIpO1xuICAgICAgICBjb25zdCBzZXBhcmF0b3IgPSB0aGlzLmNvbmZpZyhcInNlcGFyYXRvclwiKTtcbiAgICAgICAgY29uc3QgYXBwID0gdGhpcy5jb25maWcoXCJhcHBcIik7XG4gICAgICAgIGlmIChhcHApXG4gICAgICAgICAgICBsb2cuYXBwID0gc3R5bGVcbiAgICAgICAgICAgICAgICA/IExvZ2dpbmcudGhlbWUoYXBwLCBcImFwcFwiLCBsZXZlbClcbiAgICAgICAgICAgICAgICA6IGFwcDtcbiAgICAgICAgaWYgKHNlcGFyYXRvcilcbiAgICAgICAgICAgIGxvZy5zZXBhcmF0b3IgPSBzdHlsZVxuICAgICAgICAgICAgICAgID8gTG9nZ2luZy50aGVtZShzZXBhcmF0b3IsIFwic2VwYXJhdG9yXCIsIGxldmVsKVxuICAgICAgICAgICAgICAgIDogc2VwYXJhdG9yO1xuICAgICAgICBpZiAodGhpcy5jb25maWcoXCJ0aW1lc3RhbXBcIikpIHtcbiAgICAgICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7XG4gICAgICAgICAgICBjb25zdCB0aW1lc3RhbXAgPSBzdHlsZSA/IExvZ2dpbmcudGhlbWUoZGF0ZSwgXCJ0aW1lc3RhbXBcIiwgbGV2ZWwpIDogZGF0ZTtcbiAgICAgICAgICAgIGxvZy50aW1lc3RhbXAgPSB0aW1lc3RhbXA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuY29uZmlnKFwibG9nTGV2ZWxcIikpIHtcbiAgICAgICAgICAgIGNvbnN0IGx2bCA9IHN0eWxlXG4gICAgICAgICAgICAgICAgPyBMb2dnaW5nLnRoZW1lKGxldmVsLCBcImxvZ0xldmVsXCIsIGxldmVsKVxuICAgICAgICAgICAgICAgIDogbGV2ZWw7XG4gICAgICAgICAgICBsb2cubGV2ZWwgPSBsdmwudG9VcHBlckNhc2UoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jb25maWcoXCJjb250ZXh0XCIpKSB7XG4gICAgICAgICAgICBjb25zdCBjb250ZXh0ID0gc3R5bGVcbiAgICAgICAgICAgICAgICA/IExvZ2dpbmcudGhlbWUodGhpcy5jb250ZXh0LCBcImNsYXNzXCIsIGxldmVsKVxuICAgICAgICAgICAgICAgIDogdGhpcy5jb250ZXh0O1xuICAgICAgICAgICAgbG9nLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmNvbmZpZyhcImNvcnJlbGF0aW9uSWRcIikpIHtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpZCA9IHN0eWxlXG4gICAgICAgICAgICAgICAgICAgID8gTG9nZ2luZy50aGVtZSh0aGlzLmNvbmZpZyhcImNvcnJlbGF0aW9uSWRcIikudG9TdHJpbmcoKSwgXCJpZFwiLCBsZXZlbClcbiAgICAgICAgICAgICAgICAgICAgOiB0aGlzLmNvbmZpZyhcImNvcnJlbGF0aW9uSWRcIikudG9TdHJpbmcoKTtcbiAgICAgICAgICAgICAgICBsb2cuY29ycmVsYXRpb25JZCA9IGlkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1zZyA9IHN0eWxlXG4gICAgICAgICAgICA/IExvZ2dpbmcudGhlbWUodHlwZW9mIG1lc3NhZ2UgPT09IFwic3RyaW5nXCIgPyBtZXNzYWdlIDogbWVzc2FnZS5tZXNzYWdlLCBcIm1lc3NhZ2VcIiwgbGV2ZWwpXG4gICAgICAgICAgICA6IHR5cGVvZiBtZXNzYWdlID09PSBcInN0cmluZ1wiXG4gICAgICAgICAgICAgICAgPyBtZXNzYWdlXG4gICAgICAgICAgICAgICAgOiBtZXNzYWdlLm1lc3NhZ2U7XG4gICAgICAgIGxvZy5tZXNzYWdlID0gbXNnO1xuICAgICAgICBpZiAoZXJyb3IgfHwgbWVzc2FnZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgICBjb25zdCBzdGFjayA9IHN0eWxlXG4gICAgICAgICAgICAgICAgPyBMb2dnaW5nLnRoZW1lKChlcnJvcj8uc3RhY2sgfHwgbWVzc2FnZS5zdGFjayksIFwic3RhY2tcIiwgbGV2ZWwpXG4gICAgICAgICAgICAgICAgOiBlcnJvcj8uc3RhY2sgfHwgXCJcIjtcbiAgICAgICAgICAgIGxvZy5zdGFjayA9IGAgfCAkeyhlcnJvciB8fCBtZXNzYWdlKS5tZXNzYWdlfSAtIFN0YWNrIHRyYWNlOlxcbiR7c3RhY2t9YDtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKHRoaXMuY29uZmlnKFwiZm9ybWF0XCIpKSB7XG4gICAgICAgICAgICBjYXNlIFwianNvblwiOlxuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShsb2cpO1xuICAgICAgICAgICAgY2FzZSBcInJhd1wiOlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbmZpZyhcInBhdHRlcm5cIilcbiAgICAgICAgICAgICAgICAgICAgLnNwbGl0KFwiIFwiKVxuICAgICAgICAgICAgICAgICAgICAubWFwKChzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcy5tYXRjaCgvXFx7Lio/fS9nKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3JtYXR0ZWRTID0gc2YocywgbG9nKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZvcm1hdHRlZFMgIT09IHMpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0dGVkUztcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKChzKSA9PiBzKVxuICAgICAgICAgICAgICAgICAgICAuam9pbihcIiBcIik7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5zdXBwb3J0ZWQgbG9nZ2luZyBmb3JtYXQ6ICR7dGhpcy5jb25maWcoXCJmb3JtYXRcIil9YCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIExvZ3MgYSBtZXNzYWdlIHdpdGggdGhlIHNwZWNpZmllZCBsb2cgbGV2ZWxcbiAgICAgKiBAc3VtbWFyeSBDaGVja3MgaWYgdGhlIG1lc3NhZ2Ugc2hvdWxkIGJlIGxvZ2dlZCBiYXNlZCBvbiB0aGUgY3VycmVudCBsb2cgbGV2ZWwsXG4gICAgICogdGhlbiB1c2VzIHRoZSBhcHByb3ByaWF0ZSBjb25zb2xlIG1ldGhvZCB0byBvdXRwdXQgdGhlIGZvcm1hdHRlZCBsb2dcbiAgICAgKiBAcGFyYW0ge0xvZ0xldmVsfSBsZXZlbCAtIFRoZSBsb2cgbGV2ZWwgb2YgdGhlIG1lc3NhZ2VcbiAgICAgKiBAcGFyYW0ge1N0cmluZ0xpa2UgfCBFcnJvcn0gbXNnIC0gVGhlIG1lc3NhZ2UgdG8gYmUgbG9nZ2VkIG9yIGFuIEVycm9yIG9iamVjdFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbZXJyb3JdIC0gT3B0aW9uYWwgc3RhY2sgdHJhY2UgdG8gaW5jbHVkZSBpbiB0aGUgbG9nXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBsb2cobGV2ZWwsIG1zZywgZXJyb3IpIHtcbiAgICAgICAgY29uc3QgY29uZkx2bCA9IHRoaXMuY29uZmlnKFwibGV2ZWxcIik7XG4gICAgICAgIGlmIChOdW1lcmljTG9nTGV2ZWxzW2NvbmZMdmxdIDwgTnVtZXJpY0xvZ0xldmVsc1tsZXZlbF0pXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGxldCBtZXRob2Q7XG4gICAgICAgIHN3aXRjaCAobGV2ZWwpIHtcbiAgICAgICAgICAgIGNhc2UgTG9nTGV2ZWwuYmVuY2htYXJrOlxuICAgICAgICAgICAgICAgIG1ldGhvZCA9IGNvbnNvbGUubG9nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBMb2dMZXZlbC5pbmZvOlxuICAgICAgICAgICAgICAgIG1ldGhvZCA9IGNvbnNvbGUubG9nO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBMb2dMZXZlbC52ZXJib3NlOlxuICAgICAgICAgICAgY2FzZSBMb2dMZXZlbC5kZWJ1ZzpcbiAgICAgICAgICAgICAgICBtZXRob2QgPSBjb25zb2xlLmRlYnVnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBMb2dMZXZlbC5lcnJvcjpcbiAgICAgICAgICAgICAgICBtZXRob2QgPSBjb25zb2xlLmVycm9yO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBMb2dMZXZlbC50cmFjZTpcbiAgICAgICAgICAgICAgICBtZXRob2QgPSBjb25zb2xlLnRyYWNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBMb2dMZXZlbC5zaWxseTpcbiAgICAgICAgICAgICAgICBtZXRob2QgPSBjb25zb2xlLnRyYWNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGxvZyBsZXZlbFwiKTtcbiAgICAgICAgfVxuICAgICAgICBtZXRob2QodGhpcy5jcmVhdGVMb2cobGV2ZWwsIG1zZywgZXJyb3IpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIExvZ3MgYSBtZXNzYWdlIGF0IHRoZSBiZW5jaG1hcmsgbGV2ZWxcbiAgICAgKiBAc3VtbWFyeSBMb2dzIGEgbWVzc2FnZSBhdCB0aGUgYmVuY2htYXJrIGxldmVsIGlmIHRoZSBjdXJyZW50IHZlcmJvc2l0eSBzZXR0aW5nIGFsbG93cyBpdFxuICAgICAqIEBwYXJhbSB7U3RyaW5nTGlrZX0gbXNnIC0gVGhlIG1lc3NhZ2UgdG8gYmUgbG9nZ2VkXG4gICAgICogQHJldHVybiB7dm9pZH1cbiAgICAgKi9cbiAgICBiZW5jaG1hcmsobXNnKSB7XG4gICAgICAgIHRoaXMubG9nKExvZ0xldmVsLmJlbmNobWFyaywgbXNnKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIExvZ3MgYSBtZXNzYWdlIGF0IHRoZSBzaWxseSBsZXZlbFxuICAgICAqIEBzdW1tYXJ5IExvZ3MgYSBtZXNzYWdlIGF0IHRoZSBzaWxseSBsZXZlbCBpZiB0aGUgY3VycmVudCB2ZXJib3NpdHkgc2V0dGluZyBhbGxvd3MgaXRcbiAgICAgKiBAcGFyYW0ge1N0cmluZ0xpa2V9IG1zZyAtIFRoZSBtZXNzYWdlIHRvIGJlIGxvZ2dlZFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbdmVyYm9zaXR5PTBdIC0gVGhlIHZlcmJvc2l0eSBsZXZlbCBvZiB0aGUgbWVzc2FnZVxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgc2lsbHkobXNnLCB2ZXJib3NpdHkgPSAwKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbmZpZyhcInZlcmJvc2VcIikgPj0gdmVyYm9zaXR5KVxuICAgICAgICAgICAgdGhpcy5sb2coTG9nTGV2ZWwudmVyYm9zZSwgbXNnKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIExvZ3MgYSBtZXNzYWdlIGF0IHRoZSB2ZXJib3NlIGxldmVsXG4gICAgICogQHN1bW1hcnkgTG9ncyBhIG1lc3NhZ2UgYXQgdGhlIHZlcmJvc2UgbGV2ZWwgaWYgdGhlIGN1cnJlbnQgdmVyYm9zaXR5IHNldHRpbmcgYWxsb3dzIGl0XG4gICAgICogQHBhcmFtIHtTdHJpbmdMaWtlfSBtc2cgLSBUaGUgbWVzc2FnZSB0byBiZSBsb2dnZWRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3ZlcmJvc2l0eT0wXSAtIFRoZSB2ZXJib3NpdHkgbGV2ZWwgb2YgdGhlIG1lc3NhZ2VcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIHZlcmJvc2UobXNnLCB2ZXJib3NpdHkgPSAwKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbmZpZyhcInZlcmJvc2VcIikgPj0gdmVyYm9zaXR5KVxuICAgICAgICAgICAgdGhpcy5sb2coTG9nTGV2ZWwudmVyYm9zZSwgbXNnKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIExvZ3MgYSBtZXNzYWdlIGF0IHRoZSBpbmZvIGxldmVsXG4gICAgICogQHN1bW1hcnkgTG9ncyBhIG1lc3NhZ2UgYXQgdGhlIGluZm8gbGV2ZWwgZm9yIGdlbmVyYWwgYXBwbGljYXRpb24gaW5mb3JtYXRpb25cbiAgICAgKiBAcGFyYW0ge1N0cmluZ0xpa2V9IG1zZyAtIFRoZSBtZXNzYWdlIHRvIGJlIGxvZ2dlZFxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgaW5mbyhtc2cpIHtcbiAgICAgICAgdGhpcy5sb2coTG9nTGV2ZWwuaW5mbywgbXNnKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIExvZ3MgYSBtZXNzYWdlIGF0IHRoZSBkZWJ1ZyBsZXZlbFxuICAgICAqIEBzdW1tYXJ5IExvZ3MgYSBtZXNzYWdlIGF0IHRoZSBkZWJ1ZyBsZXZlbCBmb3IgZGV0YWlsZWQgdHJvdWJsZXNob290aW5nIGluZm9ybWF0aW9uXG4gICAgICogQHBhcmFtIHtTdHJpbmdMaWtlfSBtc2cgLSBUaGUgbWVzc2FnZSB0byBiZSBsb2dnZWRcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIGRlYnVnKG1zZykge1xuICAgICAgICB0aGlzLmxvZyhMb2dMZXZlbC5kZWJ1ZywgbXNnKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIExvZ3MgYSBtZXNzYWdlIGF0IHRoZSBlcnJvciBsZXZlbFxuICAgICAqIEBzdW1tYXJ5IExvZ3MgYSBtZXNzYWdlIGF0IHRoZSBlcnJvciBsZXZlbCBmb3IgZXJyb3JzIGFuZCBleGNlcHRpb25zXG4gICAgICogQHBhcmFtIHtTdHJpbmdMaWtlIHwgRXJyb3J9IG1zZyAtIFRoZSBtZXNzYWdlIHRvIGJlIGxvZ2dlZCBvciBhbiBFcnJvciBvYmplY3RcbiAgICAgKiBAcGFyYW0gZVxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgZXJyb3IobXNnLCBlKSB7XG4gICAgICAgIHRoaXMubG9nKExvZ0xldmVsLmVycm9yLCBtc2csIGUpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gTG9ncyBhIG1lc3NhZ2UgYXQgdGhlIGVycm9yIGxldmVsXG4gICAgICogQHN1bW1hcnkgTG9ncyBhIG1lc3NhZ2UgYXQgdGhlIGVycm9yIGxldmVsIGZvciBlcnJvcnMgYW5kIGV4Y2VwdGlvbnNcbiAgICAgKiBAcGFyYW0ge1N0cmluZ0xpa2V9IG1zZyAtIFRoZSBtZXNzYWdlIHRvIGJlIGxvZ2dlZCBvciBhbiBFcnJvciBvYmplY3RcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIHdhcm4obXNnKSB7XG4gICAgICAgIHRoaXMubG9nKExvZ0xldmVsLndhcm4sIG1zZyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBMb2dzIGEgbWVzc2FnZSBhdCB0aGUgZXJyb3IgbGV2ZWxcbiAgICAgKiBAc3VtbWFyeSBMb2dzIGEgbWVzc2FnZSBhdCB0aGUgZXJyb3IgbGV2ZWwgZm9yIGVycm9ycyBhbmQgZXhjZXB0aW9uc1xuICAgICAqIEBwYXJhbSB7U3RyaW5nTGlrZX0gbXNnIC0gVGhlIG1lc3NhZ2UgdG8gYmUgbG9nZ2VkIG9yIGFuIEVycm9yIG9iamVjdFxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgdHJhY2UobXNnKSB7XG4gICAgICAgIHRoaXMubG9nKExvZ0xldmVsLnRyYWNlLCBtc2cpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gVXBkYXRlcyB0aGUgbG9nZ2VyIGNvbmZpZ3VyYXRpb25cbiAgICAgKiBAc3VtbWFyeSBNZXJnZXMgdGhlIHByb3ZpZGVkIGNvbmZpZ3VyYXRpb24gd2l0aCB0aGUgZXhpc3RpbmcgY29uZmlndXJhdGlvblxuICAgICAqIEBwYXJhbSB7UGFydGlhbDxMb2dnaW5nQ29uZmlnPn0gY29uZmlnIC0gVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyB0byBhcHBseVxuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgc2V0Q29uZmlnKGNvbmZpZykge1xuICAgICAgICB0aGlzLmNvbmYgPSB7IC4uLih0aGlzLmNvbmYgfHwge30pLCAuLi5jb25maWcgfTtcbiAgICB9XG59XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBBIHN0YXRpYyBjbGFzcyBmb3IgbWFuYWdpbmcgbG9nZ2luZyBvcGVyYXRpb25zXG4gKiBAc3VtbWFyeSBUaGUgTG9nZ2luZyBjbGFzcyBwcm92aWRlcyBhIGNlbnRyYWxpemVkIGxvZ2dpbmcgbWVjaGFuaXNtIHdpdGggc3VwcG9ydCBmb3JcbiAqIGRpZmZlcmVudCBsb2cgbGV2ZWxzLCB2ZXJib3NpdHksIGFuZCBzdHlsaW5nLiBJdCB1c2VzIGEgc2luZ2xldG9uIHBhdHRlcm4gdG8gbWFpbnRhaW4gYSBnbG9iYWxcbiAqIGxvZ2dlciBpbnN0YW5jZSBhbmQgYWxsb3dzIGNyZWF0aW5nIHNwZWNpZmljIGxvZ2dlcnMgZm9yIGRpZmZlcmVudCBjbGFzc2VzIGFuZCBtZXRob2RzLlxuICogQGNsYXNzIExvZ2dpbmdcbiAqIEBleGFtcGxlXG4gKiAvLyBTZXQgZ2xvYmFsIGNvbmZpZ3VyYXRpb25cbiAqIExvZ2dpbmcuc2V0Q29uZmlnKHsgbGV2ZWw6IExvZ0xldmVsLmRlYnVnLCBzdHlsZTogdHJ1ZSB9KTtcbiAqXG4gKiAvLyBHZXQgYSBsb2dnZXIgZm9yIGEgc3BlY2lmaWMgY2xhc3NcbiAqIGNvbnN0IGxvZ2dlciA9IExvZ2dpbmcuZm9yKCdNeUNsYXNzJyk7XG4gKlxuICogLy8gTG9nIG1lc3NhZ2VzIGF0IGRpZmZlcmVudCBsZXZlbHNcbiAqIGxvZ2dlci5pbmZvKCdBcHBsaWNhdGlvbiBzdGFydGVkJyk7XG4gKiBsb2dnZXIuZGVidWcoJ1Byb2Nlc3NpbmcgZGF0YS4uLicpO1xuICpcbiAqIC8vIExvZyB3aXRoIGNvbnRleHRcbiAqIGNvbnN0IG1ldGhvZExvZ2dlciA9IExvZ2dpbmcuZm9yKCdNeUNsYXNzLm15TWV0aG9kJyk7XG4gKiBtZXRob2RMb2dnZXIudmVyYm9zZSgnRGV0YWlsZWQgb3BlcmF0aW9uIGluZm9ybWF0aW9uJywgMSk7XG4gKlxuICogLy8gTG9nIGVycm9yc1xuICogdHJ5IHtcbiAqICAgLy8gc29tZSBvcGVyYXRpb25cbiAqIH0gY2F0Y2ggKGVycm9yKSB7XG4gKiAgIGxvZ2dlci5lcnJvcihlcnJvcik7XG4gKiB9XG4gKiBAbWVybWFpZFxuICogY2xhc3NEaWFncmFtXG4gKiAgIGNsYXNzIExvZ2dlciB7XG4gKiAgICAgPDxpbnRlcmZhY2U+PlxuICogICAgICtmb3IobWV0aG9kLCBjb25maWcsIC4uLmFyZ3MpXG4gKiAgICAgK3NpbGx5KG1zZywgdmVyYm9zaXR5KVxuICogICAgICt2ZXJib3NlKG1zZywgdmVyYm9zaXR5KVxuICogICAgICtpbmZvKG1zZylcbiAqICAgICArZGVidWcobXNnKVxuICogICAgICtlcnJvcihtc2cpXG4gKiAgICAgK3NldENvbmZpZyhjb25maWcpXG4gKiAgIH1cbiAqXG4gKiAgIGNsYXNzIExvZ2dpbmcge1xuICogICAgIC1nbG9iYWw6IExvZ2dlclxuICogICAgIC1fZmFjdG9yeTogTG9nZ2VyRmFjdG9yeVxuICogICAgIC1fY29uZmlnOiBMb2dnaW5nQ29uZmlnXG4gKiAgICAgK3NldEZhY3RvcnkoZmFjdG9yeSlcbiAqICAgICArc2V0Q29uZmlnKGNvbmZpZylcbiAqICAgICArZ2V0Q29uZmlnKClcbiAqICAgICArZ2V0KClcbiAqICAgICArdmVyYm9zZShtc2csIHZlcmJvc2l0eSlcbiAqICAgICAraW5mbyhtc2cpXG4gKiAgICAgK2RlYnVnKG1zZylcbiAqICAgICArc2lsbHkobXNnKVxuICogICAgICtlcnJvcihtc2cpXG4gKiAgICAgK2ZvcihvYmplY3QsIGNvbmZpZywgLi4uYXJncylcbiAqICAgICArYmVjYXVzZShyZWFzb24sIGlkKVxuICogICAgICt0aGVtZSh0ZXh0LCB0eXBlLCBsb2dnZXJMZXZlbCwgdGVtcGxhdGUpXG4gKiAgIH1cbiAqXG4gKiAgIGNsYXNzIE1pbmlMb2dnZXIge1xuICogICAgICtjb25zdHJ1Y3Rvcihjb250ZXh0LCBjb25mPylcbiAqICAgfVxuICpcbiAqICAgTG9nZ2luZyAuLj4gTG9nZ2VyIDogY3JlYXRlc1xuICogICBMb2dnaW5nIC4uPiBNaW5pTG9nZ2VyIDogY3JlYXRlcyBieSBkZWZhdWx0XG4gKi9cbmV4cG9ydCBjbGFzcyBMb2dnaW5nIHtcbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gRmFjdG9yeSBmdW5jdGlvbiBmb3IgY3JlYXRpbmcgbG9nZ2VyIGluc3RhbmNlc1xuICAgICAqIEBzdW1tYXJ5IEEgZnVuY3Rpb24gdGhhdCBjcmVhdGVzIG5ldyBMb2dnZXIgaW5zdGFuY2VzLiBCeSBkZWZhdWx0LCBpdCBjcmVhdGVzIGEgTWluaUxvZ2dlci5cbiAgICAgKi9cbiAgICBzdGF0aWMgeyB0aGlzLl9mYWN0b3J5ID0gKG9iamVjdCwgY29uZmlnKSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgTWluaUxvZ2dlcihvYmplY3QsIGNvbmZpZyk7XG4gICAgfTsgfVxuICAgIHN0YXRpYyB7IHRoaXMuX2NvbmZpZyA9IExvZ2dlZEVudmlyb25tZW50OyB9XG4gICAgY29uc3RydWN0b3IoKSB7IH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gU2V0cyB0aGUgZmFjdG9yeSBmdW5jdGlvbiBmb3IgY3JlYXRpbmcgbG9nZ2VyIGluc3RhbmNlc1xuICAgICAqIEBzdW1tYXJ5IEFsbG93cyBjdXN0b21pemluZyBob3cgbG9nZ2VyIGluc3RhbmNlcyBhcmUgY3JlYXRlZFxuICAgICAqIEBwYXJhbSB7TG9nZ2VyRmFjdG9yeX0gZmFjdG9yeSAtIFRoZSBmYWN0b3J5IGZ1bmN0aW9uIHRvIHVzZSBmb3IgY3JlYXRpbmcgbG9nZ2Vyc1xuICAgICAqIEByZXR1cm4ge3ZvaWR9XG4gICAgICovXG4gICAgc3RhdGljIHNldEZhY3RvcnkoZmFjdG9yeSkge1xuICAgICAgICBMb2dnaW5nLl9mYWN0b3J5ID0gZmFjdG9yeTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFVwZGF0ZXMgdGhlIGdsb2JhbCBsb2dnaW5nIGNvbmZpZ3VyYXRpb25cbiAgICAgKiBAc3VtbWFyeSBBbGxvd3MgdXBkYXRpbmcgdGhlIGdsb2JhbCBsb2dnaW5nIGNvbmZpZ3VyYXRpb24gd2l0aCBuZXcgc2V0dGluZ3NcbiAgICAgKiBAcGFyYW0ge1BhcnRpYWw8TG9nZ2luZ0NvbmZpZz59IGNvbmZpZyAtIFRoZSBjb25maWd1cmF0aW9uIG9wdGlvbnMgdG8gYXBwbHlcbiAgICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgICAqL1xuICAgIHN0YXRpYyBzZXRDb25maWcoY29uZmlnKSB7XG4gICAgICAgIE9iamVjdC5lbnRyaWVzKGNvbmZpZykuZm9yRWFjaCgoW2ssIHZdKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9jb25maWdba10gPSB2O1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEdldHMgYSBjb3B5IG9mIHRoZSBjdXJyZW50IGdsb2JhbCBsb2dnaW5nIGNvbmZpZ3VyYXRpb25cbiAgICAgKiBAc3VtbWFyeSBSZXR1cm5zIGEgY29weSBvZiB0aGUgY3VycmVudCBnbG9iYWwgbG9nZ2luZyBjb25maWd1cmF0aW9uXG4gICAgICogQHJldHVybiB7TG9nZ2luZ0NvbmZpZ30gQSBjb3B5IG9mIHRoZSBjdXJyZW50IGNvbmZpZ3VyYXRpb25cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0Q29uZmlnKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29uZmlnO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gUmV0cmlldmVzIG9yIGNyZWF0ZXMgdGhlIGdsb2JhbCBsb2dnZXIgaW5zdGFuY2UuXG4gICAgICogQHN1bW1hcnkgUmV0dXJucyB0aGUgZXhpc3RpbmcgZ2xvYmFsIGxvZ2dlciBvciBjcmVhdGVzIGEgbmV3IG9uZSBpZiBpdCBkb2Vzbid0IGV4aXN0LlxuICAgICAqXG4gICAgICogQHJldHVybiBUaGUgZ2xvYmFsIFZlcmJvc2l0eUxvZ2dlciBpbnN0YW5jZS5cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0KCkge1xuICAgICAgICB0aGlzLmdsb2JhbCA9IHRoaXMuZ2xvYmFsID8gdGhpcy5nbG9iYWwgOiB0aGlzLl9mYWN0b3J5KFwiTG9nZ2luZ1wiKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2xvYmFsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gTG9ncyBhIHZlcmJvc2UgbWVzc2FnZS5cbiAgICAgKiBAc3VtbWFyeSBEZWxlZ2F0ZXMgdGhlIHZlcmJvc2UgbG9nZ2luZyB0byB0aGUgZ2xvYmFsIGxvZ2dlciBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBtc2cgLSBUaGUgbWVzc2FnZSB0byBiZSBsb2dnZWQuXG4gICAgICogQHBhcmFtIHZlcmJvc2l0eSAtIFRoZSB2ZXJib3NpdHkgbGV2ZWwgb2YgdGhlIG1lc3NhZ2UgKGRlZmF1bHQ6IDApLlxuICAgICAqL1xuICAgIHN0YXRpYyB2ZXJib3NlKG1zZywgdmVyYm9zaXR5ID0gMCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQoKS52ZXJib3NlKG1zZywgdmVyYm9zaXR5KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIExvZ3MgYW4gaW5mbyBtZXNzYWdlLlxuICAgICAqIEBzdW1tYXJ5IERlbGVnYXRlcyB0aGUgaW5mbyBsb2dnaW5nIHRvIHRoZSBnbG9iYWwgbG9nZ2VyIGluc3RhbmNlLlxuICAgICAqXG4gICAgICogQHBhcmFtIG1zZyAtIFRoZSBtZXNzYWdlIHRvIGJlIGxvZ2dlZC5cbiAgICAgKi9cbiAgICBzdGF0aWMgaW5mbyhtc2cpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KCkuaW5mbyhtc2cpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gTG9ncyBhbiBpbmZvIG1lc3NhZ2UuXG4gICAgICogQHN1bW1hcnkgRGVsZWdhdGVzIHRoZSBpbmZvIGxvZ2dpbmcgdG8gdGhlIGdsb2JhbCBsb2dnZXIgaW5zdGFuY2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbXNnIC0gVGhlIG1lc3NhZ2UgdG8gYmUgbG9nZ2VkLlxuICAgICAqL1xuICAgIHN0YXRpYyB0cmFjZShtc2cpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KCkudHJhY2UobXNnKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIExvZ3MgYSBkZWJ1ZyBtZXNzYWdlLlxuICAgICAqIEBzdW1tYXJ5IERlbGVnYXRlcyB0aGUgZGVidWcgbG9nZ2luZyB0byB0aGUgZ2xvYmFsIGxvZ2dlciBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBtc2cgLSBUaGUgbWVzc2FnZSB0byBiZSBsb2dnZWQuXG4gICAgICovXG4gICAgc3RhdGljIGRlYnVnKG1zZykge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQoKS5kZWJ1Zyhtc2cpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gTG9ncyBhIGJlbmNobWFyayBtZXNzYWdlLlxuICAgICAqIEBzdW1tYXJ5IERlbGVnYXRlcyB0aGUgYmVuY2htYXJrIGxvZ2dpbmcgdG8gdGhlIGdsb2JhbCBsb2dnZXIgaW5zdGFuY2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbXNnIC0gVGhlIG1lc3NhZ2UgdG8gYmUgbG9nZ2VkLlxuICAgICAqL1xuICAgIHN0YXRpYyBiZW5jaG1hcmsobXNnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldCgpLmJlbmNobWFyayhtc2cpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gTG9ncyBhIHNpbGx5IG1lc3NhZ2UuXG4gICAgICogQHN1bW1hcnkgRGVsZWdhdGVzIHRoZSBkZWJ1ZyBsb2dnaW5nIHRvIHRoZSBnbG9iYWwgbG9nZ2VyIGluc3RhbmNlLlxuICAgICAqXG4gICAgICogQHBhcmFtIG1zZyAtIFRoZSBtZXNzYWdlIHRvIGJlIGxvZ2dlZC5cbiAgICAgKi9cbiAgICBzdGF0aWMgc2lsbHkobXNnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldCgpLnNpbGx5KG1zZyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBMb2dzIGEgc2lsbHkgbWVzc2FnZS5cbiAgICAgKiBAc3VtbWFyeSBEZWxlZ2F0ZXMgdGhlIGRlYnVnIGxvZ2dpbmcgdG8gdGhlIGdsb2JhbCBsb2dnZXIgaW5zdGFuY2UuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbXNnIC0gVGhlIG1lc3NhZ2UgdG8gYmUgbG9nZ2VkLlxuICAgICAqL1xuICAgIHN0YXRpYyB3YXJuKG1zZykge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQoKS53YXJuKG1zZyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBMb2dzIGFuIGVycm9yIG1lc3NhZ2UuXG4gICAgICogQHN1bW1hcnkgRGVsZWdhdGVzIHRoZSBlcnJvciBsb2dnaW5nIHRvIHRoZSBnbG9iYWwgbG9nZ2VyIGluc3RhbmNlLlxuICAgICAqXG4gICAgICogQHBhcmFtIG1zZyAtIFRoZSBtZXNzYWdlIHRvIGJlIGxvZ2dlZC5cbiAgICAgKiBAcGFyYW0gZVxuICAgICAqL1xuICAgIHN0YXRpYyBlcnJvcihtc2csIGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KCkuZXJyb3IobXNnLCBlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIENyZWF0ZXMgYSBsb2dnZXIgZm9yIGEgc3BlY2lmaWMgb2JqZWN0IG9yIGNvbnRleHRcbiAgICAgKiBAc3VtbWFyeSBDcmVhdGVzIGEgbmV3IGxvZ2dlciBpbnN0YW5jZSBmb3IgdGhlIGdpdmVuIG9iamVjdCBvciBjb250ZXh0IHVzaW5nIHRoZSBmYWN0b3J5IGZ1bmN0aW9uXG4gICAgICogQHBhcmFtIHtMb2dnaW5nQ29udGV4dH0gb2JqZWN0IC0gVGhlIG9iamVjdCwgY2xhc3MsIG9yIGNvbnRleHQgdG8gY3JlYXRlIGEgbG9nZ2VyIGZvclxuICAgICAqIEBwYXJhbSB7UGFydGlhbDxMb2dnaW5nQ29uZmlnPn0gW2NvbmZpZ10gLSBPcHRpb25hbCBjb25maWd1cmF0aW9uIHRvIG92ZXJyaWRlIGdsb2JhbCBzZXR0aW5nc1xuICAgICAqIEBwYXJhbSB7Li4uYW55fSBhcmdzIC0gQWRkaXRpb25hbCBhcmd1bWVudHMgdG8gcGFzcyB0byB0aGUgbG9nZ2VyIGZhY3RvcnlcbiAgICAgKiBAcmV0dXJuIHtMb2dnZXJ9IEEgbmV3IGxvZ2dlciBpbnN0YW5jZSBmb3IgdGhlIHNwZWNpZmllZCBvYmplY3Qgb3IgY29udGV4dFxuICAgICAqL1xuICAgIHN0YXRpYyBmb3Iob2JqZWN0LCBjb25maWcsIC4uLmFyZ3MpIHtcbiAgICAgICAgb2JqZWN0ID1cbiAgICAgICAgICAgIHR5cGVvZiBvYmplY3QgPT09IFwic3RyaW5nXCJcbiAgICAgICAgICAgICAgICA/IG9iamVjdFxuICAgICAgICAgICAgICAgIDogb2JqZWN0LmNvbnN0cnVjdG9yXG4gICAgICAgICAgICAgICAgICAgID8gb2JqZWN0LmNvbnN0cnVjdG9yLm5hbWVcbiAgICAgICAgICAgICAgICAgICAgOiBvYmplY3QubmFtZTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZhY3Rvcnkob2JqZWN0LCBjb25maWcsIC4uLmFyZ3MpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gQ3JlYXRlcyBhIGxvZ2dlciBmb3IgYSBzcGVjaWZpYyByZWFzb24gb3IgY29ycmVsYXRpb24gY29udGV4dFxuICAgICAqIEBzdW1tYXJ5IFV0aWxpdHkgdG8gcXVpY2tseSBjcmVhdGUgYSBsb2dnZXIgbGFiZWxlZCB3aXRoIGEgZnJlZS1mb3JtIHJlYXNvbiBhbmQgb3B0aW9uYWwgaWRlbnRpZmllclxuICAgICAqIHNvIHRoYXQgYWQtaG9jIG9wZXJhdGlvbnMgY2FuIGJlIHRyYWNlZCB3aXRob3V0IHR5aW5nIHRoZSBsb2dnZXIgdG8gYSBjbGFzcyBvciBtZXRob2QgbmFtZS5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gcmVhc29uIC0gQSB0ZXh0dWFsIHJlYXNvbiBvciBjb250ZXh0IGxhYmVsIGZvciB0aGlzIGxvZ2dlciBpbnN0YW5jZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbaWRdIC0gT3B0aW9uYWwgaWRlbnRpZmllciB0byBoZWxwIGNvcnJlbGF0ZSByZWxhdGVkIGxvZyBlbnRyaWVzXG4gICAgICogQHJldHVybiB7TG9nZ2VyfSBBIG5ldyBsb2dnZXIgaW5zdGFuY2UgbGFiZWxlZCB3aXRoIHRoZSBwcm92aWRlZCByZWFzb24gYW5kIGlkXG4gICAgICovXG4gICAgc3RhdGljIGJlY2F1c2UocmVhc29uLCBpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZmFjdG9yeShyZWFzb24sIHRoaXMuX2NvbmZpZywgaWQpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gQXBwbGllcyB0aGVtZSBzdHlsaW5nIHRvIHRleHRcbiAgICAgKiBAc3VtbWFyeSBBcHBsaWVzIHN0eWxpbmcgKGNvbG9ycywgZm9ybWF0dGluZykgdG8gdGV4dCBiYXNlZCBvbiB0aGUgdGhlbWUgY29uZmlndXJhdGlvblxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IC0gVGhlIHRleHQgdG8gc3R5bGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSAtIFRoZSB0eXBlIG9mIGVsZW1lbnQgdG8gc3R5bGUgKGUuZy4sIFwiY2xhc3NcIiwgXCJtZXNzYWdlXCIsIFwibG9nTGV2ZWxcIilcbiAgICAgKiBAcGFyYW0ge0xvZ0xldmVsfSBsb2dnZXJMZXZlbCAtIFRoZSBsb2cgbGV2ZWwgdG8gdXNlIGZvciBzdHlsaW5nXG4gICAgICogQHBhcmFtIHtUaGVtZX0gW3RlbXBsYXRlPURlZmF1bHRUaGVtZV0gLSBUaGUgdGhlbWUgdG8gdXNlIGZvciBzdHlsaW5nXG4gICAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgc3R5bGVkIHRleHRcbiAgICAgKiBAbWVybWFpZFxuICAgICAqIHNlcXVlbmNlRGlhZ3JhbVxuICAgICAqICAgcGFydGljaXBhbnQgQ2FsbGVyXG4gICAgICogICBwYXJ0aWNpcGFudCBUaGVtZSBhcyBMb2dnaW5nLnRoZW1lXG4gICAgICogICBwYXJ0aWNpcGFudCBBcHBseSBhcyBhcHBseSBmdW5jdGlvblxuICAgICAqICAgcGFydGljaXBhbnQgU3R5bGUgYXMgc3R5bGVkLXN0cmluZy1idWlsZGVyXG4gICAgICpcbiAgICAgKiAgIENhbGxlci0+PlRoZW1lOiB0aGVtZSh0ZXh0LCB0eXBlLCBsb2dnZXJMZXZlbClcbiAgICAgKiAgIFRoZW1lLT4+VGhlbWU6IENoZWNrIGlmIHN0eWxpbmcgaXMgZW5hYmxlZFxuICAgICAqICAgYWx0IHN0eWxpbmcgZGlzYWJsZWRcbiAgICAgKiAgICAgVGhlbWUtLT4+Q2FsbGVyOiByZXR1cm4gb3JpZ2luYWwgdGV4dFxuICAgICAqICAgZWxzZSBzdHlsaW5nIGVuYWJsZWRcbiAgICAgKiAgICAgVGhlbWUtPj5UaGVtZTogR2V0IHRoZW1lIGZvciB0eXBlXG4gICAgICogICAgIGFsdCB0aGVtZSBub3QgZm91bmRcbiAgICAgKiAgICAgICBUaGVtZS0tPj5DYWxsZXI6IHJldHVybiBvcmlnaW5hbCB0ZXh0XG4gICAgICogICAgIGVsc2UgdGhlbWUgZm91bmRcbiAgICAgKiAgICAgICBUaGVtZS0+PlRoZW1lOiBEZXRlcm1pbmUgYWN0dWFsIHRoZW1lIGJhc2VkIG9uIGxvZyBsZXZlbFxuICAgICAqICAgICAgIFRoZW1lLT4+QXBwbHk6IEFwcGx5IGVhY2ggc3R5bGUgcHJvcGVydHlcbiAgICAgKiAgICAgICBBcHBseS0+PlN0eWxlOiBBcHBseSBjb2xvcnMgYW5kIGZvcm1hdHRpbmdcbiAgICAgKiAgICAgICBTdHlsZS0tPj5BcHBseTogUmV0dXJuIHN0eWxlZCB0ZXh0XG4gICAgICogICAgICAgQXBwbHktLT4+VGhlbWU6IFJldHVybiBzdHlsZWQgdGV4dFxuICAgICAqICAgICAgIFRoZW1lLS0+PkNhbGxlcjogUmV0dXJuIGZpbmFsIHN0eWxlZCB0ZXh0XG4gICAgICogICAgIGVuZFxuICAgICAqICAgZW5kXG4gICAgICovXG4gICAgc3RhdGljIHRoZW1lKHRleHQsIHR5cGUsIGxvZ2dlckxldmVsLCB0ZW1wbGF0ZSA9IERlZmF1bHRUaGVtZSkge1xuICAgICAgICBpZiAoIXRoaXMuX2NvbmZpZy5zdHlsZSlcbiAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICBmdW5jdGlvbiBhcHBseSh0eHQsIG9wdGlvbiwgdmFsdWUpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdCA9IHR4dDtcbiAgICAgICAgICAgICAgICBsZXQgYyA9IHN0eWxlKHQpO1xuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGFwcGx5Q29sb3IodmFsLCBpc0JnID0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGYgPSBpc0JnID8gYy5iYWNrZ3JvdW5kIDogYy5mb3JlZ3JvdW5kO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkodmFsKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGYuY2FsbChjLCB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh2YWwubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZiA9IGlzQmcgPyBjLmJnQ29sb3IyNTYgOiBjLmNvbG9yMjU2O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmKHZhbFswXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZiA9IGlzQmcgPyBjLmJnUmdiIDogYy5yZ2I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGMucmdiKHZhbFswXSwgdmFsWzFdLCB2YWxbMl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBOb3QgYSB2YWxpZCBjb2xvciBvcHRpb246ICR7b3B0aW9ufWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdHlsZSh0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBhcHBseVN0eWxlKHYpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2ID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjID0gYy5zdHlsZSh2KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGMgPSBjW3ZdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN3aXRjaCAob3B0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJiZ1wiOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZmdcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhcHBseUNvbG9yKHZhbHVlKS50ZXh0O1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwic3R5bGVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLmZvckVhY2goYXBwbHlTdHlsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcHBseVN0eWxlKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjLnRleHQ7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGBOb3QgYSB2YWxpZCB0aGVtZSBvcHRpb246ICR7b3B0aW9ufWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgYXBwbHlpbmcgc3R5bGU6ICR7b3B0aW9ufSB3aXRoIHZhbHVlICR7dmFsdWV9YCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHR4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpbmRpdmlkdWFsVGhlbWUgPSB0ZW1wbGF0ZVt0eXBlXTtcbiAgICAgICAgaWYgKCFpbmRpdmlkdWFsVGhlbWUgfHwgIU9iamVjdC5rZXlzKGluZGl2aWR1YWxUaGVtZSkubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgYWN0dWFsVGhlbWUgPSBpbmRpdmlkdWFsVGhlbWU7XG4gICAgICAgIGNvbnN0IGxvZ0xldmVscyA9IE9iamVjdC5hc3NpZ24oe30sIExvZ0xldmVsKTtcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKGluZGl2aWR1YWxUaGVtZSlbMF0gaW4gbG9nTGV2ZWxzKVxuICAgICAgICAgICAgYWN0dWFsVGhlbWUgPVxuICAgICAgICAgICAgICAgIGluZGl2aWR1YWxUaGVtZVtsb2dnZXJMZXZlbF0gfHwge307XG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhhY3R1YWxUaGVtZSkucmVkdWNlKChhY2MsIGtleSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdmFsID0gYWN0dWFsVGhlbWVba2V5XTtcbiAgICAgICAgICAgIGlmICh2YWwpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFwcGx5KGFjYywga2V5LCB2YWwpO1xuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfSwgdGV4dCk7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bG9nZ2luZy5qcy5tYXAiLCJpbXBvcnQgeyBMb2dnaW5nIH0gZnJvbSBcIi4vbG9nZ2luZy5qc1wiO1xuLyoqXG4gKiBAZGVzY3JpcHRpb24gQmFzZSBjbGFzcyB0aGF0IHByb3ZpZGVzIGEgcmVhZHktdG8tdXNlIGxvZ2dlciBpbnN0YW5jZS5cbiAqIEBzdW1tYXJ5IFN1cHBsaWVzIGluaGVyaXRpbmcgY2xhc3NlcyB3aXRoIGEgbGF6aWx5IGNyZWF0ZWQsIGNvbnRleHQtYXdhcmUge0BsaW5rIExvZ2dlcn0gdmlhIHRoZSBwcm90ZWN0ZWQgYGxvZ2AgZ2V0dGVyLCBwcm9tb3RpbmcgY29uc2lzdGVudCBzdHJ1Y3R1cmVkIGxvZ2dpbmcgd2l0aG91dCBtYW51YWwgd2lyaW5nLlxuICogQGNsYXNzIExvZ2dlZENsYXNzXG4gKiBAZXhhbXBsZVxuICogY2xhc3MgVXNlclNlcnZpY2UgZXh0ZW5kcyBMb2dnZWRDbGFzcyB7XG4gKiAgIGNyZWF0ZSh1c2VyOiBVc2VyKSB7XG4gKiAgICAgdGhpcy5sb2cuaW5mbyhgQ3JlYXRpbmcgdXNlciAke3VzZXIuaWR9YCk7XG4gKiAgIH1cbiAqIH1cbiAqXG4gKiBjb25zdCBzdmMgPSBuZXcgVXNlclNlcnZpY2UoKTtcbiAqIHN2Yy5jcmVhdGUoeyBpZDogXCI0MlwiIH0pO1xuICogQG1lcm1haWRcbiAqIHNlcXVlbmNlRGlhZ3JhbVxuICogICBwYXJ0aWNpcGFudCBDbGllbnRcbiAqICAgcGFydGljaXBhbnQgSW5zdGFuY2UgYXMgU3ViY2xhc3MgSW5zdGFuY2VcbiAqICAgcGFydGljaXBhbnQgR2V0dGVyIGFzIExvZ2dlZENsYXNzLmxvZ1xuICogICBwYXJ0aWNpcGFudCBMb2dnaW5nIGFzIExvZ2dpbmdcbiAqICAgcGFydGljaXBhbnQgTG9nZ2VyIGFzIExvZ2dlclxuICpcbiAqICAgQ2xpZW50LT4+SW5zdGFuY2U6IGNhbGwgc29tZU1ldGhvZCgpXG4gKiAgIEluc3RhbmNlLT4+R2V0dGVyOiBhY2Nlc3MgdGhpcy5sb2dcbiAqICAgR2V0dGVyLT4+TG9nZ2luZzogTG9nZ2luZy5mb3IodGhpcylcbiAqICAgTG9nZ2luZy0tPj5HZXR0ZXI6IHJldHVybiBMb2dnZXJcbiAqICAgR2V0dGVyLS0+Pkluc3RhbmNlOiByZXR1cm4gTG9nZ2VyXG4gKiAgIEluc3RhbmNlLT4+TG9nZ2VyOiBpbmZvL2RlYnVnL2Vycm9yKC4uLilcbiAqL1xuZXhwb3J0IGNsYXNzIExvZ2dlZENsYXNzIHtcbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gTGF6aWx5IHByb3ZpZGVzIGEgY29udGV4dC1hd2FyZSBsb2dnZXIgZm9yIHRoZSBjdXJyZW50IGluc3RhbmNlLlxuICAgICAqIEBzdW1tYXJ5IENhbGxzIHtAbGluayBMb2dnaW5nLmZvcn0gd2l0aCB0aGUgc3ViY2xhc3MgaW5zdGFuY2UgdG8gb2J0YWluIGEgbG9nZ2VyIHdob3NlIGNvbnRleHQgbWF0Y2hlcyB0aGUgc3ViY2xhc3MgbmFtZS5cbiAgICAgKiBAcmV0dXJuIHtMb2dnZXJ9IExvZ2dlciBib3VuZCB0byB0aGUgc3ViY2xhc3MgY29udGV4dC5cbiAgICAgKi9cbiAgICBnZXQgbG9nKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2xvZylcbiAgICAgICAgICAgIHRoaXMuX2xvZyA9IExvZ2dpbmcuZm9yKHRoaXMpO1xuICAgICAgICByZXR1cm4gdGhpcy5fbG9nO1xuICAgIH1cbiAgICBjb25zdHJ1Y3RvcigpIHsgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9TG9nZ2VkQ2xhc3MuanMubWFwIiwiaW1wb3J0IHsgTG9nZ2VkQ2xhc3MgfSBmcm9tIFwiLi8uLi9Mb2dnZWRDbGFzcy5qc1wiO1xuLyoqXG4gKiBAZGVzY3JpcHRpb24gQmFzZSBjbGFzcyBmb3IgbWVzc2FnZSBmaWx0ZXJzIHRoYXQgcGx1ZyBpbnRvIHRoZSBsb2dnaW5nIHBpcGVsaW5lLlxuICogQHN1bW1hcnkgRXh0ZW5kcyB7QGxpbmsgTG9nZ2VkQ2xhc3N9IHRvIHN1cHBseSBhIHNjb3BlZCBsb2dnZXIgYW5kIGRlZmluZXMgdGhlIGNvbnRyYWN0IHJlcXVpcmVkIGJ5IHtAbGluayBMb2dnaW5nRmlsdGVyfSBpbXBsZW1lbnRlcnMgdGhhdCB0cmFuc2Zvcm0gb3IgZHJvcCBsb2cgbWVzc2FnZXMgYmVmb3JlIGVtaXNzaW9uLlxuICogQGNsYXNzIExvZ0ZpbHRlclxuICogQGV4YW1wbGVcbiAqIGNsYXNzIFJlZGFjdFNlY3JldHNGaWx0ZXIgZXh0ZW5kcyBMb2dGaWx0ZXIge1xuICogICBmaWx0ZXIoY29uZmlnOiBMb2dnaW5nQ29uZmlnLCBtZXNzYWdlOiBzdHJpbmcpOiBzdHJpbmcge1xuICogICAgIHJldHVybiBtZXNzYWdlLnJlcGxhY2UoL3NlY3JldC9naSwgXCIqKipcIik7XG4gKiAgIH1cbiAqIH1cbiAqXG4gKiBjb25zdCBmaWx0ZXIgPSBuZXcgUmVkYWN0U2VjcmV0c0ZpbHRlcigpO1xuICogZmlsdGVyLmZpbHRlcih7IC4uLkRlZmF1bHRMb2dnaW5nQ29uZmlnLCB2ZXJib3NlOiAwIH0sIFwic2VjcmV0IHRva2VuXCIpO1xuICogQG1lcm1haWRcbiAqIHNlcXVlbmNlRGlhZ3JhbVxuICogICBwYXJ0aWNpcGFudCBMb2dnZXJcbiAqICAgcGFydGljaXBhbnQgRmlsdGVyIGFzIExvZ0ZpbHRlclxuICogICBwYXJ0aWNpcGFudCBJbXBsIGFzIENvbmNyZXRlRmlsdGVyXG4gKiAgIHBhcnRpY2lwYW50IE91dHB1dFxuICogICBMb2dnZXItPj5GaWx0ZXI6IGZpbHRlcihjb25maWcsIG1lc3NhZ2UsIGNvbnRleHQpXG4gKiAgIEZpbHRlci0+PkltcGw6IGRlbGVnYXRlIHRvIHN1YmNsYXNzIGltcGxlbWVudGF0aW9uXG4gKiAgIEltcGwtLT4+RmlsdGVyOiB0cmFuc2Zvcm1lZCBtZXNzYWdlXG4gKiAgIEZpbHRlci0tPj5PdXRwdXQ6IHJldHVybiBmaWx0ZXJlZCBtZXNzYWdlXG4gKi9cbmV4cG9ydCBjbGFzcyBMb2dGaWx0ZXIgZXh0ZW5kcyBMb2dnZWRDbGFzcyB7XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFNjb3BlZCBsb2dnZXIgdGhhdCBleGNsdWRlcyBvdGhlciBmaWx0ZXJzIGZyb20gdGhlIGNoYWluLlxuICAgICAqIEBzdW1tYXJ5IFJldHVybnMgYSBjaGlsZCBsb2dnZXIgZGVkaWNhdGVkIHRvIHRoZSBmaWx0ZXIsIHByZXZlbnRpbmcgcmVjdXJzaXZlIGZpbHRlciBpbnZvY2F0aW9uIHdoZW4gZW1pdHRpbmcgZGlhZ25vc3RpYyBtZXNzYWdlcy5cbiAgICAgKiBAcmV0dXJuIHtMb2dnZXJ9IENvbnRleHQtYXdhcmUgbG9nZ2VyIGZvciB0aGUgZmlsdGVyIGluc3RhbmNlLlxuICAgICAqL1xuICAgIGdldCBsb2coKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5sb2cuZm9yKHRoaXMsIHsgZmlsdGVyczogW10gfSk7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9TG9nRmlsdGVyLmpzLm1hcCIsImZ1bmN0aW9uIHNhZmVOb3coKSB7XG4gICAgLy8gUHJlZmVyIHBlcmZvcm1hbmNlLm5vdyB3aGVuIGF2YWlsYWJsZVxuICAgIGlmICh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgICAgICB0eXBlb2YgZ2xvYmFsVGhpcy5wZXJmb3JtYW5jZT8ubm93ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuICgpID0+IGdsb2JhbFRoaXMucGVyZm9ybWFuY2Uubm93KCk7XG4gICAgfVxuICAgIC8vIE5vZGU6IHVzZSBwcm9jZXNzLmhydGltZS5iaWdpbnQgZm9yIGhpZ2hlciBwcmVjaXNpb24gaWYgYXZhaWxhYmxlXG4gICAgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgICAgIHR5cGVvZiBwcm9jZXNzLmhydGltZT8uYmlnaW50ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG5zID0gcHJvY2Vzcy5ocnRpbWUuYmlnaW50KCk7IC8vIG5hbm9zZWNvbmRzXG4gICAgICAgICAgICByZXR1cm4gTnVtYmVyKG5zKSAvIDFfMDAwXzAwMDsgLy8gdG8gbXNcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLy8gRmFsbGJhY2tcbiAgICByZXR1cm4gKCkgPT4gRGF0ZS5ub3coKTtcbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uIEhpZ2gtcmVzb2x1dGlvbiBjbG9jayBhY2Nlc3NvciByZXR1cm5pbmcgbWlsbGlzZWNvbmRzLlxuICogQHN1bW1hcnkgQ2hvb3NlcyB0aGUgbW9zdCBwcmVjaXNlIHRpbWVyIGF2YWlsYWJsZSBpbiB0aGUgY3VycmVudCBydW50aW1lLCBwcmVmZXJyaW5nIGBwZXJmb3JtYW5jZS5ub3dgIG9yIGBwcm9jZXNzLmhydGltZS5iaWdpbnRgLlxuICogQHJldHVybiB7bnVtYmVyfSBNaWxsaXNlY29uZHMgZWxhcHNlZCBhY2NvcmRpbmcgdG8gdGhlIGJlc3QgYXZhaWxhYmxlIGNsb2NrLlxuICovXG5leHBvcnQgY29uc3Qgbm93ID0gc2FmZU5vdygpO1xuLyoqXG4gKiBAZGVzY3JpcHRpb24gSGlnaC1yZXNvbHV0aW9uIHN0b3B3YXRjaCB3aXRoIHBhdXNlLCByZXN1bWUsIGFuZCBsYXAgdHJhY2tpbmcuXG4gKiBAc3VtbWFyeSBUcmFja3MgZWxhcHNlZCB0aW1lIHVzaW5nIHRoZSBoaWdoZXN0IHByZWNpc2lvbiB0aW1lciBhdmFpbGFibGUsIHN1cHBvcnRzIHBhdXNpbmcsIHJlc3VtaW5nLCBhbmQgcmVjb3JkaW5nIGxhYmVsZWQgbGFwcyBmb3IgZGlhZ25vc3RpY3MgYW5kIGJlbmNobWFya2luZy5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2F1dG9TdGFydD1mYWxzZV0gLSBXaGVuIHRydWUsIHRoZSBzdG9wd2F0Y2ggc3RhcnRzIGltbWVkaWF0ZWx5IHVwb24gY29uc3RydWN0aW9uLlxuICogQGNsYXNzIFN0b3BXYXRjaFxuICogQGV4YW1wbGVcbiAqIGNvbnN0IHN3ID0gbmV3IFN0b3BXYXRjaCh0cnVlKTtcbiAqIC8vIC4uLiB3b3JrIC4uLlxuICogY29uc3QgbGFwID0gc3cubGFwKFwicGhhc2UgMVwiKTtcbiAqIHN3LnBhdXNlKCk7XG4gKiBjb25zb2xlLmxvZyhgRWxhcHNlZDogJHtsYXAudG90YWxNc31tc2ApO1xuICogQG1lcm1haWRcbiAqIHNlcXVlbmNlRGlhZ3JhbVxuICogICBwYXJ0aWNpcGFudCBDbGllbnRcbiAqICAgcGFydGljaXBhbnQgU3RvcFdhdGNoXG4gKiAgIHBhcnRpY2lwYW50IENsb2NrIGFzIG5vdygpXG4gKiAgIENsaWVudC0+PlN0b3BXYXRjaDogc3RhcnQoKVxuICogICBTdG9wV2F0Y2gtPj5DbG9jazogbm93KClcbiAqICAgQ2xvY2stLT4+U3RvcFdhdGNoOiB0aW1lc3RhbXBcbiAqICAgQ2xpZW50LT4+U3RvcFdhdGNoOiBsYXAoKVxuICogICBTdG9wV2F0Y2gtPj5DbG9jazogbm93KClcbiAqICAgQ2xvY2stLT4+U3RvcFdhdGNoOiB0aW1lc3RhbXBcbiAqICAgU3RvcFdhdGNoLS0+PkNsaWVudDogTGFwXG4gKiAgIENsaWVudC0+PlN0b3BXYXRjaDogcGF1c2UoKVxuICogICBTdG9wV2F0Y2gtPj5DbG9jazogbm93KClcbiAqICAgQ2xvY2stLT4+U3RvcFdhdGNoOiB0aW1lc3RhbXBcbiAqL1xuZXhwb3J0IGNsYXNzIFN0b3BXYXRjaCB7XG4gICAgY29uc3RydWN0b3IoYXV0b1N0YXJ0ID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5fc3RhcnRNcyA9IG51bGw7XG4gICAgICAgIHRoaXMuX2VsYXBzZWRNcyA9IDA7XG4gICAgICAgIHRoaXMuX3J1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fbGFwcyA9IFtdO1xuICAgICAgICB0aGlzLl9sYXN0TGFwVG90YWxNcyA9IDA7XG4gICAgICAgIGlmIChhdXRvU3RhcnQpXG4gICAgICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgc3RvcHdhdGNoIGlzIGFjdGl2ZWx5IHJ1bm5pbmcuXG4gICAgICogQHN1bW1hcnkgUmV0dXJucyBgdHJ1ZWAgd2hlbiB0aW1pbmcgaXMgaW4gcHJvZ3Jlc3MgYW5kIGBmYWxzZWAgd2hlbiBwYXVzZWQgb3Igc3RvcHBlZC5cbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSBDdXJyZW50IHJ1bm5pbmcgc3RhdGUuXG4gICAgICovXG4gICAgZ2V0IHJ1bm5pbmcoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ydW5uaW5nO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gRWxhcHNlZCB0aW1lIGNhcHR1cmVkIGJ5IHRoZSBzdG9wd2F0Y2guXG4gICAgICogQHN1bW1hcnkgQ29tcHV0ZXMgdGhlIHRvdGFsIGVsYXBzZWQgdGltZSBpbiBtaWxsaXNlY29uZHMsIGluY2x1ZGluZyB0aGUgY3VycmVudCBzZXNzaW9uIGlmIHJ1bm5pbmcuXG4gICAgICogQHJldHVybiB7bnVtYmVyfSBNaWxsaXNlY29uZHMgZWxhcHNlZCBzaW5jZSB0aGUgc3RvcHdhdGNoIHN0YXJ0ZWQuXG4gICAgICovXG4gICAgZ2V0IGVsYXBzZWRNcygpIHtcbiAgICAgICAgaWYgKCF0aGlzLl9ydW5uaW5nIHx8IHRoaXMuX3N0YXJ0TXMgPT0gbnVsbClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9lbGFwc2VkTXM7XG4gICAgICAgIHJldHVybiB0aGlzLl9lbGFwc2VkTXMgKyAobm93KCkgLSB0aGlzLl9zdGFydE1zKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFN0YXJ0cyB0aW1pbmcgaWYgdGhlIHN0b3B3YXRjaCBpcyBub3QgYWxyZWFkeSBydW5uaW5nLlxuICAgICAqIEBzdW1tYXJ5IFJlY29yZHMgdGhlIGN1cnJlbnQgdGltZXN0YW1wIGFuZCB0cmFuc2l0aW9ucyB0aGUgc3RvcHdhdGNoIGludG8gdGhlIHJ1bm5pbmcgc3RhdGUuXG4gICAgICogQHJldHVybiB7dGhpc30gRmx1ZW50IHJlZmVyZW5jZSB0byB0aGUgc3RvcHdhdGNoLlxuICAgICAqL1xuICAgIHN0YXJ0KCkge1xuICAgICAgICBpZiAoIXRoaXMuX3J1bm5pbmcpIHtcbiAgICAgICAgICAgIHRoaXMuX3J1bm5pbmcgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRNcyA9IG5vdygpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gUGF1c2VzIHRpbWluZyBhbmQgYWNjdW11bGF0ZXMgZWxhcHNlZCBtaWxsaXNlY29uZHMuXG4gICAgICogQHN1bW1hcnkgQ2FwdHVyZXMgdGhlIHBhcnRpYWwgZHVyYXRpb24sIHVwZGF0ZXMgdGhlIGFjY3VtdWxhdG9yLCBhbmQga2VlcHMgdGhlIHN0b3B3YXRjaCByZWFkeSB0byByZXN1bWUgbGF0ZXIuXG4gICAgICogQHJldHVybiB7dGhpc30gRmx1ZW50IHJlZmVyZW5jZSB0byB0aGUgc3RvcHdhdGNoLlxuICAgICAqL1xuICAgIHBhdXNlKCkge1xuICAgICAgICBpZiAodGhpcy5fcnVubmluZyAmJiB0aGlzLl9zdGFydE1zICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuX2VsYXBzZWRNcyArPSBub3coKSAtIHRoaXMuX3N0YXJ0TXM7XG4gICAgICAgICAgICB0aGlzLl9zdGFydE1zID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuX3J1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFJlc3VtZXMgdGltaW5nIGFmdGVyIGEgcGF1c2UuXG4gICAgICogQHN1bW1hcnkgQ2FwdHVyZXMgYSBmcmVzaCBzdGFydCB0aW1lc3RhbXAgd2hpbGUga2VlcGluZyBwcmV2aW91cyBlbGFwc2VkIHRpbWUgaW50YWN0LlxuICAgICAqIEByZXR1cm4ge3RoaXN9IEZsdWVudCByZWZlcmVuY2UgdG8gdGhlIHN0b3B3YXRjaC5cbiAgICAgKi9cbiAgICByZXN1bWUoKSB7XG4gICAgICAgIGlmICghdGhpcy5fcnVubmluZykge1xuICAgICAgICAgICAgdGhpcy5fcnVubmluZyA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLl9zdGFydE1zID0gbm93KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBTdG9wcyB0aW1pbmcgYW5kIHJldHVybnMgdGhlIHRvdGFsIGVsYXBzZWQgbWlsbGlzZWNvbmRzLlxuICAgICAqIEBzdW1tYXJ5IEludm9rZXMge0BsaW5rIFN0b3BXYXRjaC5wYXVzZX0gdG8gY29uc29saWRhdGUgZWxhcHNlZCB0aW1lLCBsZWF2aW5nIHRoZSBzdG9wd2F0Y2ggaW4gYSBub24tcnVubmluZyBzdGF0ZS5cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IE1pbGxpc2Vjb25kcyBhY2N1bXVsYXRlZCBhY3Jvc3MgYWxsIHJ1bnMuXG4gICAgICovXG4gICAgc3RvcCgpIHtcbiAgICAgICAgdGhpcy5wYXVzZSgpO1xuICAgICAgICByZXR1cm4gdGhpcy5fZWxhcHNlZE1zO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gUmVzZXRzIHRoZSBzdG9wd2F0Y2ggc3RhdGUgd2hpbGUgb3B0aW9uYWxseSBjb250aW51aW5nIHRvIHJ1bi5cbiAgICAgKiBAc3VtbWFyeSBDbGVhcnMgZWxhcHNlZCB0aW1lIGFuZCBsYXAgaGlzdG9yeSwgcHJlc2VydmluZyB3aGV0aGVyIHRoZSBzdG9wd2F0Y2ggc2hvdWxkIGNvbnRpbnVlIHRpY2tpbmcuXG4gICAgICogQHJldHVybiB7dGhpc30gRmx1ZW50IHJlZmVyZW5jZSB0byB0aGUgc3RvcHdhdGNoLlxuICAgICAqL1xuICAgIHJlc2V0KCkge1xuICAgICAgICBjb25zdCB3YXNSdW5uaW5nID0gdGhpcy5fcnVubmluZztcbiAgICAgICAgdGhpcy5fc3RhcnRNcyA9IHdhc1J1bm5pbmcgPyBub3coKSA6IG51bGw7XG4gICAgICAgIHRoaXMuX2VsYXBzZWRNcyA9IDA7XG4gICAgICAgIHRoaXMuX2xhcHMgPSBbXTtcbiAgICAgICAgdGhpcy5fbGFzdExhcFRvdGFsTXMgPSAwO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFJlY29yZHMgYSBsYXAgc3BsaXQgc2luY2UgdGhlIHN0b3B3YXRjaCBzdGFydGVkIG9yIHNpbmNlIHRoZSBwcmV2aW91cyBsYXAuXG4gICAgICogQHN1bW1hcnkgU3RvcmVzIHRoZSBsYXAgbWV0YWRhdGEsIHVwZGF0ZXMgY3VtdWxhdGl2ZSB0cmFja2luZywgYW5kIHJldHVybnMgdGhlIG5ld2x5IGNyZWF0ZWQge0BsaW5rIExhcH0uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtsYWJlbF0gLSBPcHRpb25hbCBsYWJlbCBkZXNjcmliaW5nIHRoZSBsYXAuXG4gICAgICogQHJldHVybiB7TGFwfSBMYXAgc25hcHNob3QgY2FwdHVyaW5nIGluY3JlbWVudGFsIGFuZCBjdW11bGF0aXZlIHRpbWluZ3MuXG4gICAgICovXG4gICAgbGFwKGxhYmVsKSB7XG4gICAgICAgIGNvbnN0IHRvdGFsID0gdGhpcy5lbGFwc2VkTXM7XG4gICAgICAgIGNvbnN0IG1zID0gdG90YWwgLSB0aGlzLl9sYXN0TGFwVG90YWxNcztcbiAgICAgICAgY29uc3QgbGFwID0ge1xuICAgICAgICAgICAgaW5kZXg6IHRoaXMuX2xhcHMubGVuZ3RoLFxuICAgICAgICAgICAgbGFiZWwsXG4gICAgICAgICAgICBtcyxcbiAgICAgICAgICAgIHRvdGFsTXM6IHRvdGFsLFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9sYXBzLnB1c2gobGFwKTtcbiAgICAgICAgdGhpcy5fbGFzdExhcFRvdGFsTXMgPSB0b3RhbDtcbiAgICAgICAgcmV0dXJuIGxhcDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFJldHJpZXZlcyB0aGUgcmVjb3JkZWQgbGFwIGhpc3RvcnkuXG4gICAgICogQHN1bW1hcnkgUmV0dXJucyB0aGUgaW50ZXJuYWwgbGFwIGFycmF5IGFzIGEgcmVhZC1vbmx5IHZpZXcgdG8gcHJldmVudCBleHRlcm5hbCBtdXRhdGlvbi5cbiAgICAgKiBAcmV0dXJuIHtMYXBbXX0gTGFwcyBjYXB0dXJlZCBieSB0aGUgc3RvcHdhdGNoLlxuICAgICAqL1xuICAgIGdldCBsYXBzKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGFwcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIEZvcm1hdHMgdGhlIGVsYXBzZWQgdGltZSBpbiBhIGh1bWFuLXJlYWRhYmxlIHJlcHJlc2VudGF0aW9uLlxuICAgICAqIEBzdW1tYXJ5IFVzZXMge0BsaW5rIGZvcm1hdE1zfSB0byBwcm9kdWNlIGFuIGBoaDptbTpzcy5tbW1gIHN0cmluZyBmb3IgZGlzcGxheSBhbmQgbG9nZ2luZy5cbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IEVsYXBzZWQgdGltZSBmb3JtYXR0ZWQgZm9yIHByZXNlbnRhdGlvbi5cbiAgICAgKi9cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIGZvcm1hdE1zKHRoaXMuZWxhcHNlZE1zKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIFNlcmlhbGl6ZXMgdGhlIHN0b3B3YXRjaCBzdGF0ZS5cbiAgICAgKiBAc3VtbWFyeSBQcm92aWRlcyBhIEpTT04tZnJpZW5kbHkgc25hcHNob3QgaW5jbHVkaW5nIHJ1bm5pbmcgc3RhdGUsIGVsYXBzZWQgdGltZSwgYW5kIGxhcCBkZXRhaWxzLlxuICAgICAqIEByZXR1cm4ge3tydW5uaW5nOiBib29sZWFuLCBlbGFwc2VkTXM6IG51bWJlciwgbGFwczogTGFwW119fSBTZXJpYWxpemFibGUgc3RvcHdhdGNoIHJlcHJlc2VudGF0aW9uLlxuICAgICAqL1xuICAgIHRvSlNPTigpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJ1bm5pbmc6IHRoaXMuX3J1bm5pbmcsXG4gICAgICAgICAgICBlbGFwc2VkTXM6IHRoaXMuZWxhcHNlZE1zLFxuICAgICAgICAgICAgbGFwczogdGhpcy5fbGFwcy5zbGljZSgpLFxuICAgICAgICB9O1xuICAgIH1cbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uIEZvcm1hdHMgbWlsbGlzZWNvbmRzIGludG8gYGhoOm1tOnNzLm1tbWAuXG4gKiBAc3VtbWFyeSBCcmVha3MgdGhlIGR1cmF0aW9uIGludG8gaG91cnMsIG1pbnV0ZXMsIHNlY29uZHMsIGFuZCBtaWxsaXNlY29uZHMsIHJldHVybmluZyBhIHplcm8tcGFkZGVkIHN0cmluZy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBtcyAtIE1pbGxpc2Vjb25kcyB0byBmb3JtYXQuXG4gKiBAcmV0dXJuIHtzdHJpbmd9IEZvcm1hdHRlZCBkdXJhdGlvbiBzdHJpbmcuXG4gKiBAZnVuY3Rpb24gZm9ybWF0TXNcbiAqIEBtZW1iZXJPZiBtb2R1bGU6TG9nZ2luZ1xuICogQG1lcm1haWRcbiAqIHNlcXVlbmNlRGlhZ3JhbVxuICogICBwYXJ0aWNpcGFudCBDYWxsZXJcbiAqICAgcGFydGljaXBhbnQgRm9ybWF0dGVyIGFzIGZvcm1hdE1zXG4gKiAgIENhbGxlci0+PkZvcm1hdHRlcjogZm9ybWF0TXMobXMpXG4gKiAgIEZvcm1hdHRlci0+PkZvcm1hdHRlcjogZGVyaXZlIGhvdXJzL21pbnV0ZXMvc2Vjb25kc1xuICogICBGb3JtYXR0ZXItPj5Gb3JtYXR0ZXI6IHBhZCBzZWdtZW50c1xuICogICBGb3JtYXR0ZXItLT4+Q2FsbGVyOiBoaDptbTpzcy5tbW1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdE1zKG1zKSB7XG4gICAgY29uc3Qgc2lnbiA9IG1zIDwgMCA/IFwiLVwiIDogXCJcIjtcbiAgICBjb25zdCBhYnMgPSBNYXRoLmFicyhtcyk7XG4gICAgY29uc3QgaG91cnMgPSBNYXRoLmZsb29yKGFicyAvIDNfNjAwXzAwMCk7XG4gICAgY29uc3QgbWludXRlcyA9IE1hdGguZmxvb3IoKGFicyAlIDNfNjAwXzAwMCkgLyA2MF8wMDApO1xuICAgIGNvbnN0IHNlY29uZHMgPSBNYXRoLmZsb29yKChhYnMgJSA2MF8wMDApIC8gMTAwMCk7XG4gICAgY29uc3QgbWlsbGlzID0gTWF0aC5mbG9vcihhYnMgJSAxMDAwKTtcbiAgICBjb25zdCBwYWQgPSAobiwgdykgPT4gbi50b1N0cmluZygpLnBhZFN0YXJ0KHcsIFwiMFwiKTtcbiAgICByZXR1cm4gYCR7c2lnbn0ke3BhZChob3VycywgMil9OiR7cGFkKG1pbnV0ZXMsIDIpfToke3BhZChzZWNvbmRzLCAyKX0uJHtwYWQobWlsbGlzLCAzKX1gO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGltZS5qcy5tYXAiLCJpbXBvcnQgeyBMb2dMZXZlbCB9IGZyb20gXCIuL2NvbnN0YW50cy5qc1wiO1xuaW1wb3J0IHsgTG9nZ2luZyB9IGZyb20gXCIuL2xvZ2dpbmcuanNcIjtcbmltcG9ydCB7IG5vdyB9IGZyb20gXCIuL3RpbWUuanNcIjtcbmltcG9ydCB7IExvZ2dlZENsYXNzIH0gZnJvbSBcIi4vTG9nZ2VkQ2xhc3MuanNcIjtcbi8qKlxuICogQGRlc2NyaXB0aW9uIE1ldGhvZCBkZWNvcmF0b3IgZm9yIGxvZ2dpbmcgZnVuY3Rpb24gY2FsbHMuXG4gKiBAc3VtbWFyeSBXcmFwcyBjbGFzcyBtZXRob2RzIHRvIGF1dG9tYXRpY2FsbHkgbG9nIGVudHJ5LCBleGl0LCB0aW1pbmcsIGFuZCBvcHRpb25hbCBjdXN0b20gbWVzc2FnZXMgYXQgYSBjb25maWd1cmFibGUge0BsaW5rIExvZ0xldmVsfS5cbiAqIEBwYXJhbSB7TG9nTGV2ZWx9IGxldmVsIC0gTG9nIGxldmVsIGFwcGxpZWQgdG8gdGhlIGdlbmVyYXRlZCBsb2cgc3RhdGVtZW50cyAoZGVmYXVsdHMgdG8gYExvZ0xldmVsLmluZm9gKS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbdmVyYm9zaXR5PTBdIC0gVmVyYm9zaXR5IHRocmVzaG9sZCByZXF1aXJlZCBmb3IgdGhlIGVudHJ5IGxvZyB0byBhcHBlYXIuXG4gKiBAcGFyYW0ge0FyZ0Zvcm1hdEZ1bmN0aW9ufSBbZW50cnlNZXNzYWdlXSAtIEZvcm1hdHRlciBpbnZva2VkIHdpdGggdGhlIG9yaWdpbmFsIG1ldGhvZCBhcmd1bWVudHMgdG8gZGVzY3JpYmUgdGhlIGludm9jYXRpb24uXG4gKiBAcGFyYW0ge1JldHVybkZvcm1hdEZ1bmN0aW9ufSBbZXhpdE1lc3NhZ2VdIC0gT3B0aW9uYWwgZm9ybWF0dGVyIHRoYXQgZGVzY3JpYmVzIHRoZSBvdXRjb21lIG9yIGZhaWx1cmUgb2YgdGhlIGNhbGwuXG4gKiBAcmV0dXJuIHtmdW5jdGlvbihhbnksIGFueSwgUHJvcGVydHlEZXNjcmlwdG9yKTogdm9pZH0gTWV0aG9kIGRlY29yYXRvciBwcm94eSB0aGF0IGluamVjdHMgbG9nZ2luZyBiZWhhdmlvci5cbiAqIEBmdW5jdGlvbiBsb2dcbiAqIEBtZXJtYWlkXG4gKiBzZXF1ZW5jZURpYWdyYW1cbiAqICAgcGFydGljaXBhbnQgQ2xpZW50XG4gKiAgIHBhcnRpY2lwYW50IERlY29yYXRvciBhcyBsb2cgZGVjb3JhdG9yXG4gKiAgIHBhcnRpY2lwYW50IE1ldGhvZCBhcyBPcmlnaW5hbCBNZXRob2RcbiAqICAgcGFydGljaXBhbnQgTG9nZ2VyIGFzIExvZ2dpbmcgaW5zdGFuY2VcbiAqXG4gKiAgIENsaWVudC0+PkRlY29yYXRvcjogY2FsbCBkZWNvcmF0ZWQgbWV0aG9kXG4gKiAgIERlY29yYXRvci0+PkxvZ2dlcjogbG9nIG1ldGhvZCBjYWxsXG4gKiAgIERlY29yYXRvci0+Pk1ldGhvZDogY2FsbCBvcmlnaW5hbCBtZXRob2RcbiAqICAgYWx0IHJlc3VsdCBpcyBQcm9taXNlXG4gKiAgICAgTWV0aG9kLS0+PkRlY29yYXRvcjogcmV0dXJuIFByb21pc2VcbiAqICAgICBEZWNvcmF0b3ItPj5EZWNvcmF0b3I6IGF0dGFjaCB0aGVuIGhhbmRsZXJcbiAqICAgICBOb3RlIG92ZXIgRGVjb3JhdG9yOiBQcm9taXNlIHJlc29sdmVzXG4gKiAgICAgRGVjb3JhdG9yLT4+TG9nZ2VyOiBsb2cgYmVuY2htYXJrIChpZiBlbmFibGVkKVxuICogICAgIERlY29yYXRvci0tPj5DbGllbnQ6IHJldHVybiByZXN1bHRcbiAqICAgZWxzZSByZXN1bHQgaXMgbm90IFByb21pc2VcbiAqICAgICBNZXRob2QtLT4+RGVjb3JhdG9yOiByZXR1cm4gcmVzdWx0XG4gKiAgICAgRGVjb3JhdG9yLT4+TG9nZ2VyOiBsb2cgYmVuY2htYXJrIChpZiBlbmFibGVkKVxuICogICAgIERlY29yYXRvci0tPj5DbGllbnQ6IHJldHVybiByZXN1bHRcbiAqICAgZW5kXG4gKiBAY2F0ZWdvcnkgTWV0aG9kIERlY29yYXRvcnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxvZyhsZXZlbCA9IExvZ0xldmVsLmluZm8sIHZlcmJvc2l0eSA9IDAsIGVudHJ5TWVzc2FnZSA9ICguLi5hcmdzKSA9PiBgY2FsbGVkIHdpdGggJHthcmdzfWAsIGV4aXRNZXNzYWdlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIGxvZyh0YXJnZXQsIHByb3BlcnR5S2V5LCBkZXNjcmlwdG9yKSB7XG4gICAgICAgIGlmICghZGVzY3JpcHRvciB8fCB0eXBlb2YgZGVzY3JpcHRvciA9PT0gXCJudW1iZXJcIilcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTG9nZ2luZyBkZWNvcmF0aW9uIG9ubHkgYXBwbGllcyB0byBtZXRob2RzYCk7XG4gICAgICAgIGNvbnN0IGxvZ2dlciA9IHRhcmdldCBpbnN0YW5jZW9mIExvZ2dlZENsYXNzXG4gICAgICAgICAgICA/IHRhcmdldFtcImxvZ1wiXS5mb3IodGFyZ2V0W3Byb3BlcnR5S2V5XSlcbiAgICAgICAgICAgIDogTG9nZ2luZy5mb3IodGFyZ2V0KS5mb3IodGFyZ2V0W3Byb3BlcnR5S2V5XSk7XG4gICAgICAgIGNvbnN0IG1ldGhvZCA9IGxvZ2dlcltsZXZlbF0uYmluZChsb2dnZXIpO1xuICAgICAgICBjb25zdCBvcmlnaW5hbE1ldGhvZCA9IGRlc2NyaXB0b3IudmFsdWU7XG4gICAgICAgIGRlc2NyaXB0b3IudmFsdWUgPSBuZXcgUHJveHkob3JpZ2luYWxNZXRob2QsIHtcbiAgICAgICAgICAgIGFwcGx5KGZuLCB0aGlzQXJnLCBhcmdzKSB7XG4gICAgICAgICAgICAgICAgbWV0aG9kKGVudHJ5TWVzc2FnZSguLi5hcmdzKSwgdmVyYm9zaXR5KTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBSZWZsZWN0LmFwcGx5KGZuLCB0aGlzQXJnLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbigocikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChleGl0TWVzc2FnZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kKGV4aXRNZXNzYWdlKHVuZGVmaW5lZCwgcikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhpdE1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihleGl0TWVzc2FnZShlKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChleGl0TWVzc2FnZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZChleGl0TWVzc2FnZSh1bmRlZmluZWQsIHJlc3VsdCkpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChleGl0TWVzc2FnZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihleGl0TWVzc2FnZShlcnIpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZGVzY3JpcHRvcjtcbiAgICB9O1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gTWV0aG9kIGRlY29yYXRvciB0aGF0IHJlY29yZHMgZXhlY3V0aW9uIHRpbWUgYXQgdGhlIGJlbmNobWFyayBsZXZlbC5cbiAqIEBzdW1tYXJ5IFdyYXBzIHRoZSB0YXJnZXQgbWV0aG9kIHRvIGVtaXQge0BsaW5rIExvZ2dlci5iZW5jaG1hcmt9IGVudHJpZXMgY2FwdHVyaW5nIGNvbXBsZXRpb24gdGltZSBvciBmYWlsdXJlIGxhdGVuY3kuXG4gKiBAcmV0dXJuIHtmdW5jdGlvbihhbnksIGFueSwgIFByb3BlcnR5RGVzY3JpcHRvcik6IHZvaWR9IE1ldGhvZCBkZWNvcmF0b3IgcHJveHkgdGhhdCBiZW5jaG1hcmtzIHRoZSBvcmlnaW5hbCBpbXBsZW1lbnRhdGlvbi5cbiAqIEBmdW5jdGlvbiBiZW5jaG1hcmtcbiAqIEBtZXJtYWlkXG4gKiBzZXF1ZW5jZURpYWdyYW1cbiAqICAgcGFydGljaXBhbnQgQ2FsbGVyXG4gKiAgIHBhcnRpY2lwYW50IERlY29yYXRvciBhcyBiZW5jaG1hcmtcbiAqICAgcGFydGljaXBhbnQgTWV0aG9kIGFzIE9yaWdpbmFsIE1ldGhvZFxuICogICBDYWxsZXItPj5EZWNvcmF0b3I6IGludm9rZSgpXG4gKiAgIERlY29yYXRvci0+Pk1ldGhvZDogUmVmbGVjdC5hcHBseSguLi4pXG4gKiAgIGFsdCBQcm9taXNlIHJlc3VsdFxuICogICAgIE1ldGhvZC0tPj5EZWNvcmF0b3I6IFByb21pc2VcbiAqICAgICBEZWNvcmF0b3ItPj5EZWNvcmF0b3I6IGF0dGFjaCB0aGVuKClcbiAqICAgICBEZWNvcmF0b3ItPj5EZWNvcmF0b3I6IGxvZyBjb21wbGV0aW9uIGR1cmF0aW9uXG4gKiAgIGVsc2UgU3luY2hyb25vdXMgcmVzdWx0XG4gKiAgICAgTWV0aG9kLS0+PkRlY29yYXRvcjogdmFsdWVcbiAqICAgICBEZWNvcmF0b3ItPj5EZWNvcmF0b3I6IGxvZyBjb21wbGV0aW9uIGR1cmF0aW9uXG4gKiAgIGVuZFxuICogICBEZWNvcmF0b3ItLT4+Q2FsbGVyOiByZXR1cm4gcmVzdWx0XG4gKiBAY2F0ZWdvcnkgTWV0aG9kIERlY29yYXRvcnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJlbmNobWFyaygpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gYmVuY2htYXJrKHRhcmdldCwgcHJvcGVydHlLZXksIGRlc2NyaXB0b3IpIHtcbiAgICAgICAgaWYgKCFkZXNjcmlwdG9yIHx8IHR5cGVvZiBkZXNjcmlwdG9yID09PSBcIm51bWJlclwiKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBiZW5jaG1hcmsgZGVjb3JhdGlvbiBvbmx5IGFwcGxpZXMgdG8gbWV0aG9kc2ApO1xuICAgICAgICBjb25zdCBsb2dnZXIgPSB0YXJnZXQgaW5zdGFuY2VvZiBMb2dnZWRDbGFzc1xuICAgICAgICAgICAgPyB0YXJnZXRbXCJsb2dcIl0uZm9yKHRhcmdldFtwcm9wZXJ0eUtleV0pXG4gICAgICAgICAgICA6IExvZ2dpbmcuZm9yKHRhcmdldCkuZm9yKHRhcmdldFtwcm9wZXJ0eUtleV0pO1xuICAgICAgICBjb25zdCBvcmlnaW5hbE1ldGhvZCA9IGRlc2NyaXB0b3IudmFsdWU7XG4gICAgICAgIGRlc2NyaXB0b3IudmFsdWUgPSBuZXcgUHJveHkob3JpZ2luYWxNZXRob2QsIHtcbiAgICAgICAgICAgIGFwcGx5KGZuLCB0aGlzQXJnLCBhcmdzKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhcnQgPSBub3coKTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBSZWZsZWN0LmFwcGx5KGZuLCB0aGlzQXJnLCBhcmdzKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbigocikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2dlci5iZW5jaG1hcmsoYGNvbXBsZXRlZCBpbiAke25vdygpIC0gc3RhcnR9bXNgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmJlbmNobWFyayhgZmFpbGVkIGluICR7bm93KCkgLSBzdGFydH1tc2ApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuYmVuY2htYXJrKGBjb21wbGV0ZWQgaW4gJHtub3coKSAtIHN0YXJ0fW1zYCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgbG9nZ2VyLmJlbmNobWFyayhgZmFpbGVkIGluICR7bm93KCkgLSBzdGFydH1tc2ApO1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBkZXNjcmlwdG9yO1xuICAgIH07XG59XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBNZXRob2QgZGVjb3JhdG9yIGZvciBsb2dnaW5nIGZ1bmN0aW9uIGNhbGxzIHdpdGggZGVidWcgbGV2ZWwuXG4gKiBAc3VtbWFyeSBDb252ZW5pZW5jZSB3cmFwcGVyIGFyb3VuZCB7QGxpbmsgbG9nfSB0aGF0IGxvZ3MgdXNpbmcgYExvZ0xldmVsLmRlYnVnYC5cbiAqIEByZXR1cm4ge2Z1bmN0aW9uKGFueSwgYW55LCBQcm9wZXJ0eURlc2NyaXB0b3IpOiB2b2lkfSBEZWJ1Zy1sZXZlbCBsb2dnaW5nIGRlY29yYXRvci5cbiAqIEBmdW5jdGlvbiBkZWJ1Z1xuICogQGNhdGVnb3J5IE1ldGhvZCBEZWNvcmF0b3JzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWJ1ZygpIHtcbiAgICByZXR1cm4gbG9nKExvZ0xldmVsLmRlYnVnLCAwLCAoLi4uYXJncykgPT4gYGNhbGxlZCB3aXRoICR7YXJnc31gLCAoZSwgcmVzdWx0KSA9PiBlXG4gICAgICAgID8gYEZhaWxlZCB3aXRoOiAke2V9YFxuICAgICAgICA6IHJlc3VsdFxuICAgICAgICAgICAgPyBgQ29tcGxldGVkIHdpdGggJHtKU09OLnN0cmluZ2lmeShyZXN1bHQpfWBcbiAgICAgICAgICAgIDogXCJjb21wbGV0ZWRcIik7XG59XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBNZXRob2QgZGVjb3JhdG9yIGZvciBsb2dnaW5nIGZ1bmN0aW9uIGNhbGxzIHdpdGggaW5mbyBsZXZlbC5cbiAqIEBzdW1tYXJ5IENvbnZlbmllbmNlIHdyYXBwZXIgYXJvdW5kIHtAbGluayBsb2d9IHRoYXQgbG9ncyB1c2luZyBgTG9nTGV2ZWwuaW5mb2AuXG4gKiBAcmV0dXJuIHtmdW5jdGlvbihhbnksIGFueSwgUHJvcGVydHlEZXNjcmlwdG9yKTogdm9pZH0gSW5mby1sZXZlbCBsb2dnaW5nIGRlY29yYXRvci5cbiAqIEBmdW5jdGlvbiBpbmZvXG4gKiBAY2F0ZWdvcnkgTWV0aG9kIERlY29yYXRvcnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluZm8oKSB7XG4gICAgcmV0dXJuIGxvZyhMb2dMZXZlbC5pbmZvKTtcbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uIE1ldGhvZCBkZWNvcmF0b3IgZm9yIGxvZ2dpbmcgZnVuY3Rpb24gY2FsbHMgd2l0aCBzaWxseSBsZXZlbC5cbiAqIEBzdW1tYXJ5IENvbnZlbmllbmNlIHdyYXBwZXIgYXJvdW5kIHtAbGluayBsb2d9IHRoYXQgbG9ncyB1c2luZyBgTG9nTGV2ZWwuc2lsbHlgLlxuICogQHJldHVybiB7ZnVuY3Rpb24oYW55LCBhbnksIFByb3BlcnR5RGVzY3JpcHRvcik6IHZvaWR9IFNpbGx5LWxldmVsIGxvZ2dpbmcgZGVjb3JhdG9yLlxuICogQGZ1bmN0aW9uIHNpbGx5XG4gKiBAY2F0ZWdvcnkgTWV0aG9kIERlY29yYXRvcnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNpbGx5KCkge1xuICAgIHJldHVybiBsb2coTG9nTGV2ZWwuc2lsbHkpO1xufVxuLyoqXG4gKiBAZGVzY3JpcHRpb24gTWV0aG9kIGRlY29yYXRvciBmb3IgbG9nZ2luZyBmdW5jdGlvbiBjYWxscyB3aXRoIHRyYWNlIGxldmVsLlxuICogQHN1bW1hcnkgQ29udmVuaWVuY2Ugd3JhcHBlciBhcm91bmQge0BsaW5rIGxvZ30gdGhhdCBsb2dzIHVzaW5nIGBMb2dMZXZlbC50cmFjZWAuXG4gKiBAcmV0dXJuIHtmdW5jdGlvbihhbnksIGFueSwgUHJvcGVydHlEZXNjcmlwdG9yKTogdm9pZH0gVHJhY2UtbGV2ZWwgbG9nZ2luZyBkZWNvcmF0b3IuXG4gKiBAZnVuY3Rpb24gdHJhY2VcbiAqIEBjYXRlZ29yeSBNZXRob2QgRGVjb3JhdG9yc1xuICovXG5leHBvcnQgZnVuY3Rpb24gdHJhY2UoKSB7XG4gICAgcmV0dXJuIGxvZyhMb2dMZXZlbC50cmFjZSk7XG59XG4vKipcbiAqIEBkZXNjcmlwdGlvbiBNZXRob2QgZGVjb3JhdG9yIGZvciBsb2dnaW5nIGZ1bmN0aW9uIGNhbGxzIHdpdGggdmVyYm9zZSBsZXZlbC5cbiAqIEBzdW1tYXJ5IENvbnZlbmllbmNlIHdyYXBwZXIgYXJvdW5kIHtAbGluayBsb2d9IHRoYXQgbG9ncyB1c2luZyBgTG9nTGV2ZWwudmVyYm9zZWAgd2l0aCBjb25maWd1cmFibGUgdmVyYm9zaXR5IGFuZCBvcHRpb25hbCBiZW5jaG1hcmtpbmcuXG4gKiBAcGFyYW0ge251bWJlcnxib29sZWFufSB2ZXJib3NpdHkgLSBWZXJib3NpdHkgbGV2ZWwgZm9yIGxvZyBmaWx0ZXJpbmcgb3IgZmxhZyB0byBlbmFibGUgYmVuY2htYXJraW5nLlxuICogQHJldHVybiB7ZnVuY3Rpb24oYW55LCBhbnksUHJvcGVydHlEZXNjcmlwdG9yKTogdm9pZH0gVmVyYm9zZSBsb2dnaW5nIGRlY29yYXRvci5cbiAqIEBmdW5jdGlvbiB2ZXJib3NlXG4gKiBAY2F0ZWdvcnkgTWV0aG9kIERlY29yYXRvcnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZlcmJvc2UodmVyYm9zaXR5ID0gMCkge1xuICAgIGlmICghdmVyYm9zaXR5KSB7XG4gICAgICAgIHZlcmJvc2l0eSA9IDA7XG4gICAgfVxuICAgIHJldHVybiBsb2coTG9nTGV2ZWwudmVyYm9zZSwgdmVyYm9zaXR5KTtcbn1cbi8qKlxuICogQGRlc2NyaXB0aW9uIENyZWF0ZXMgYSBkZWNvcmF0b3IgdGhhdCBtYWtlcyBhIG1ldGhvZCBub24tY29uZmlndXJhYmxlLlxuICogQHN1bW1hcnkgUHJldmVudHMgb3ZlcnJpZGluZyBieSBtYXJraW5nIHRoZSBtZXRob2QgZGVzY3JpcHRvciBhcyBub24tY29uZmlndXJhYmxlLCB0aHJvd2luZyBpZiBhcHBsaWVkIHRvIG5vbi1tZXRob2QgdGFyZ2V0cy5cbiAqIEByZXR1cm4ge2Z1bmN0aW9uKG9iamVjdCwgYW55LCBQcm9wZXJ0eURlc2NyaXB0b3IpOiBQcm9wZXJ0eURlc2NyaXB0b3J8dW5kZWZpbmVkfSBEZWNvcmF0b3IgdGhhdCBoYXJkZW5zIHRoZSBtZXRob2QgZGVzY3JpcHRvci5cbiAqIEBmdW5jdGlvbiBmaW5hbFxuICogQGNhdGVnb3J5IE1ldGhvZCBEZWNvcmF0b3JzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5hbCgpIHtcbiAgICByZXR1cm4gKHRhcmdldCwgcHJvcGVydHlLZXksIGRlc2NyaXB0b3IpID0+IHtcbiAgICAgICAgaWYgKCFkZXNjcmlwdG9yKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZmluYWwgZGVjb3JhdG9yIGNhbiBvbmx5IGJlIHVzZWQgb24gbWV0aG9kc1wiKTtcbiAgICAgICAgaWYgKGRlc2NyaXB0b3I/LmNvbmZpZ3VyYWJsZSkge1xuICAgICAgICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVzY3JpcHRvcjtcbiAgICB9O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGVjb3JhdG9ycy5qcy5tYXAiLCJ2YXIgX19kZWNvcmF0ZSA9ICh0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSkgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcbn07XG52YXIgX19tZXRhZGF0YSA9ICh0aGlzICYmIHRoaXMuX19tZXRhZGF0YSkgfHwgZnVuY3Rpb24gKGssIHYpIHtcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEoaywgdik7XG59O1xuaW1wb3J0IHsgTG9nRmlsdGVyIH0gZnJvbSBcIi4vTG9nRmlsdGVyLmpzXCI7XG5pbXBvcnQgeyBmaW5hbCB9IGZyb20gXCIuLy4uL2RlY29yYXRvcnMuanNcIjtcbi8qKlxuICogQGRlc2NyaXB0aW9uIEZpbHRlciB0aGF0IHBhdGNoZXMgbG9nIG1lc3NhZ2VzIHVzaW5nIHJlZ3VsYXIgZXhwcmVzc2lvbnMuXG4gKiBAc3VtbWFyeSBBcHBsaWVzIGEgY29uZmlndXJlZCB7QGxpbmsgUmVnRXhwfSBhbmQgcmVwbGFjZW1lbnQgc3RyYXRlZ3kgdG8gcmVkYWN0LCBtYXNrLCBvciByZXN0cnVjdHVyZSBsb2cgcGF5bG9hZHMgYmVmb3JlIHRoZXkgYXJlIGVtaXR0ZWQuXG4gKiBAcGFyYW0ge1JlZ0V4cH0gcmVnZXhwIC0gRXhwcmVzc2lvbiB1c2VkIHRvIGRldGVjdCBzZW5zaXRpdmUgb3IgZm9ybWF0dGVkIHRleHQuXG4gKiBAcGFyYW0ge3N0cmluZ3xSZXBsYWNlbWVudEZ1bmN0aW9ufSByZXBsYWNlbWVudCAtIFJlcGxhY2VtZW50IHN0cmluZyBvciBjYWxsYmFjayBpbnZva2VkIGZvciBlYWNoIG1hdGNoLlxuICogQGNsYXNzIFBhdHRlcm5GaWx0ZXJcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBmaWx0ZXIgPSBuZXcgUGF0dGVybkZpbHRlcigvdG9rZW49W14mXSsvZywgXCJ0b2tlbj0qKipcIik7XG4gKiBjb25zdCBzYW5pdGl6ZWQgPSBmaWx0ZXIuZmlsdGVyKGNvbmZpZywgXCJ0b2tlbj0xMjMmdXNlcj10b21cIiwgW10pO1xuICogLy8gc2FuaXRpemVkID09PSBcInRva2VuPSoqKiZ1c2VyPXRvbVwiXG4gKiBAbWVybWFpZFxuICogc2VxdWVuY2VEaWFncmFtXG4gKiAgIHBhcnRpY2lwYW50IExvZ2dlclxuICogICBwYXJ0aWNpcGFudCBGaWx0ZXIgYXMgUGF0dGVybkZpbHRlclxuICogICBwYXJ0aWNpcGFudCBSZWdFeHBcbiAqICAgTG9nZ2VyLT4+RmlsdGVyOiBmaWx0ZXIoY29uZmlnLCBtZXNzYWdlLCBjb250ZXh0KVxuICogICBGaWx0ZXItPj5SZWdFeHA6IGV4ZWN1dGUgbWF0Y2goKVxuICogICBhbHQgbWF0Y2ggZm91bmRcbiAqICAgICBSZWdFeHAtLT4+RmlsdGVyOiBjYXB0dXJlc1xuICogICAgIEZpbHRlci0+PlJlZ0V4cDogcmVwbGFjZShtZXNzYWdlLCByZXBsYWNlbWVudClcbiAqICAgICBSZWdFeHAtLT4+RmlsdGVyOiB0cmFuc2Zvcm1lZCBtZXNzYWdlXG4gKiAgIGVsc2Ugbm8gbWF0Y2hcbiAqICAgICBSZWdFeHAtLT4+RmlsdGVyOiBudWxsXG4gKiAgIGVuZFxuICogICBGaWx0ZXItLT4+TG9nZ2VyOiBzYW5pdGl6ZWQgbWVzc2FnZVxuICovXG5leHBvcnQgY2xhc3MgUGF0dGVybkZpbHRlciBleHRlbmRzIExvZ0ZpbHRlciB7XG4gICAgY29uc3RydWN0b3IocmVnZXhwLCByZXBsYWNlbWVudCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnJlZ2V4cCA9IHJlZ2V4cDtcbiAgICAgICAgdGhpcy5yZXBsYWNlbWVudCA9IHJlcGxhY2VtZW50O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gRW5zdXJlcyBkZXRlcm1pbmlzdGljIFJlZ0V4cCBtYXRjaGluZy5cbiAgICAgKiBAc3VtbWFyeSBSdW5zIHRoZSBjb25maWd1cmVkIGV4cHJlc3Npb24sIHRoZW4gcmVzZXRzIGl0cyBzdGF0ZSBzbyByZXBlYXRlZCBpbnZvY2F0aW9ucyBiZWhhdmUgY29uc2lzdGVudGx5LlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlIC0gTWVzc2FnZSB0byB0ZXN0IGZvciBtYXRjaGVzLlxuICAgICAqIEByZXR1cm4ge1JlZ0V4cEV4ZWNBcnJheXxudWxsfSBNYXRjaCByZXN1bHQgb3IgbnVsbCB3aGVuIG5vIG1hdGNoIGlzIGZvdW5kLlxuICAgICAqL1xuICAgIG1hdGNoKG1lc3NhZ2UpIHtcbiAgICAgICAgY29uc3QgbWF0Y2ggPSB0aGlzLnJlZ2V4cC5leGVjKG1lc3NhZ2UpO1xuICAgICAgICB0aGlzLnJlZ2V4cC5sYXN0SW5kZXggPSAwO1xuICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBkZXNjcmlwdGlvbiBBcHBsaWVzIHRoZSByZXBsYWNlbWVudCBzdHJhdGVneSB0byB0aGUgaW5jb21pbmcgbWVzc2FnZS5cbiAgICAgKiBAc3VtbWFyeSBFeGVjdXRlcyB7QGxpbmsgUGF0dGVybkZpbHRlci5tYXRjaH0gYW5kLCB3aGVuIGEgbWF0Y2ggaXMgZm91bmQsIHJlcGxhY2VzIGV2ZXJ5IG9jY3VycmVuY2UgdXNpbmcgdGhlIGNvbmZpZ3VyZWQgcmVwbGFjZW1lbnQgaGFuZGxlci5cbiAgICAgKiBAcGFyYW0ge0xvZ2dpbmdDb25maWd9IGNvbmZpZyAtIEFjdGl2ZSBsb2dnaW5nIGNvbmZpZ3VyYXRpb24gKHVudXNlZCBidXQgcGFydCBvZiB0aGUgZmlsdGVyIGNvbnRyYWN0KS5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZSAtIE1lc3NhZ2UgdG8gYmUgc2FuaXRpemVkLlxuICAgICAqIEBwYXJhbSB7c3RyaW5nW119IGNvbnRleHQgLSBDb250ZXh0IGVudHJpZXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBsb2cgZXZlbnQuXG4gICAgICogQHJldHVybiB7c3RyaW5nfSBTYW5pdGl6ZWQgbG9nIG1lc3NhZ2UuXG4gICAgICovXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuICAgIGZpbHRlcihjb25maWcsIG1lc3NhZ2UsIGNvbnRleHQpIHtcbiAgICAgICAgY29uc3QgbG9nID0gdGhpcy5sb2cuZm9yKHRoaXMuZmlsdGVyKTtcbiAgICAgICAgY29uc3QgbWF0Y2ggPSB0aGlzLm1hdGNoKG1lc3NhZ2UpO1xuICAgICAgICBpZiAoIW1hdGNoKVxuICAgICAgICAgICAgcmV0dXJuIG1lc3NhZ2U7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gbWVzc2FnZS5yZXBsYWNlKHRoaXMucmVnZXhwLCB0aGlzLnJlcGxhY2VtZW50KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgbG9nLmVycm9yKGBQYXR0ZXJuRmlsdGVyIHJlcGxhY2VtZW50IGVycm9yOiAke2V9YCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxufVxuX19kZWNvcmF0ZShbXG4gICAgZmluYWwoKSxcbiAgICBfX21ldGFkYXRhKFwiZGVzaWduOnR5cGVcIiwgRnVuY3Rpb24pLFxuICAgIF9fbWV0YWRhdGEoXCJkZXNpZ246cGFyYW10eXBlc1wiLCBbU3RyaW5nXSksXG4gICAgX19tZXRhZGF0YShcImRlc2lnbjpyZXR1cm50eXBlXCIsIHZvaWQgMClcbl0sIFBhdHRlcm5GaWx0ZXIucHJvdG90eXBlLCBcIm1hdGNoXCIsIG51bGwpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9UGF0dGVybkZpbHRlci5qcy5tYXAiLCJpbXBvcnQgeyBMb2dnaW5nIH0gZnJvbSBcIkBkZWNhZi10cy9sb2dnaW5nXCI7XG5pbXBvcnQgeyBDb21tYW5kIH0gZnJvbSBcImNvbW1hbmRlclwiO1xuaW1wb3J0IGZzIGZyb20gXCJmc1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGN3ZCB9IGZyb20gXCJwcm9jZXNzXCI7XG5cbmNvbnN0IHByb2dyYW0gPSBuZXcgQ29tbWFuZCgpO1xuXG5wcm9ncmFtXG4gIC5jb21tYW5kKFwiYWRkLW5vZGUtc2hlYmFuZ1wiKVxuICAuZGVzY3JpcHRpb24oXCJBZGRzIGEgc2hlYmFuZyB0byB0aGUgcHJvdmlkZWQgc2NyaXB0XCIpXG4gIC5vcHRpb24oXCItLWZpbGUgPHN0cmluZz5cIiwgXCJQYXRoIHRvIHRoZSBzY3JpcHQgZmlsZVwiKVxuICAuYWN0aW9uKGFzeW5jIChvcHRpb25zKSA9PiB7XG4gICAgY29uc3QgbG9nID0gTG9nZ2luZy5mb3IoXCJTaGUtQmFuZ1wiKTtcbiAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihjd2QoKSwgb3B0aW9ucy5maWxlKTtcbiAgICBsZXQgY29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhmaWxlUGF0aCwgXCJ1dGY4XCIpO1xuXG4gICAgY29uc3Qgc2hlYmFuZyA9IFwiIyEvdXNyL2Jpbi9lbnYgbm9kZVwiO1xuXG4gICAgaWYgKCFjb250ZW50LnN0YXJ0c1dpdGgoc2hlYmFuZykpIHtcbiAgICAgIGNvbnRlbnQgPSBgJHtzaGViYW5nfVxcbiR7Y29udGVudH1gO1xuICAgICAgZnMud3JpdGVGaWxlU3luYyhmaWxlUGF0aCwgY29udGVudCwgXCJ1dGY4XCIpO1xuICAgICAgbG9nLmluZm8oYFNoZWJhbmcgYWRkZWQgdG8gJHtmaWxlUGF0aH1gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9nLmVycm9yKGBTaGViYW5nIGFscmVhZHkgcHJlc2VudCBpbiAke2ZpbGVQYXRofWApO1xuICAgIH1cbiAgfSk7XG5cbnByb2dyYW0ucGFyc2UocHJvY2Vzcy5hcmd2KTtcbiJdLCJuYW1lcyI6WyJ0aGlzIiwiQ29tbWFuZCIsImN3ZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLE1BQU0sU0FBUyxHQUFHLFNBQVM7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLE1BQU0sd0JBQXdCLEdBQUc7QUFDeEMsSUFBSSxLQUFLLEVBQUUsRUFBRTtBQUNiLElBQUksR0FBRyxFQUFFLEVBQUU7QUFDWCxJQUFJLEtBQUssRUFBRSxFQUFFO0FBQ2IsSUFBSSxNQUFNLEVBQUUsRUFBRTtBQUNkLElBQUksSUFBSSxFQUFFLEVBQUU7QUFDWixJQUFJLE9BQU8sRUFBRSxFQUFFO0FBQ2YsSUFBSSxJQUFJLEVBQUUsRUFBRTtBQUNaLElBQUksS0FBSyxFQUFFLEVBQUU7QUFDYixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLE1BQU0sc0JBQXNCLEdBQUc7QUFDdEMsSUFBSSxXQUFXLEVBQUUsRUFBRTtBQUNuQixJQUFJLFNBQVMsRUFBRSxFQUFFO0FBQ2pCLElBQUksV0FBVyxFQUFFLEVBQUU7QUFDbkIsSUFBSSxZQUFZLEVBQUUsRUFBRTtBQUNwQixJQUFJLFVBQVUsRUFBRSxFQUFFO0FBQ2xCLElBQUksYUFBYSxFQUFFLEVBQUU7QUFDckIsSUFBSSxVQUFVLEVBQUUsRUFBRTtBQUNsQixJQUFJLFdBQVcsRUFBRSxFQUFFO0FBQ25CLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sTUFBTSx3QkFBd0IsR0FBRztBQUN4QyxJQUFJLE9BQU8sRUFBRSxFQUFFO0FBQ2YsSUFBSSxLQUFLLEVBQUUsRUFB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RUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNyRixRQUFRLE9BQU8sSUFBSTtBQUNuQjtBQUNBLElBQUksT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxTQUFTLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFO0FBQ3BDLElBQUksTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLEtBQUssUUFBUSxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQzNELElBQUksT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sU0FBUyxLQUFLLENBQUMsSUFBSSxFQUFFO0FBQzVCO0FBQ0E7QUFDQSxJQUFJLE1BQU0sU0FBUyxHQUFHLHdDQUF3QztBQUM5RCxJQUFJLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxTQUFTLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFO0FBQy9CLElBQUksT0FBTyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDdEM7O0FDM0hBO0FBQ0E7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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxNQUFNLFlBQVksR0FBRztBQUM1QixJQUFJLEdBQUcsRUFBRSxFQUFFO0FBQ1gsSUFBSSxTQUFTLEVBQUUsRUFBRTtBQUNqQixJQUFJLEtBQUssRUFBRTtBQUNYLFFBQVEsRUFBRSxFQUFFLEVBQUU7QUFDZCxLQUFLO0FBQ0wsSUFBSSxFQUFFLEVBQUU7QUFDUixRQUFRLEVBQUUsRUFBRSxFQUFFO0FBQ2QsS0FBSztBQUNMLElBQUksS0FBSyxFQUFFLEVBQUU7QUFDYixJQUFJLFNBQVMsRUFBRSxFQUFFO0FBQ2pCLElBQUksT0FBTyxFQUFFO0FBQ2IsUUFBUSxLQUFLLEVBQUU7QUFDZixZQUFZLEVBQUUsRUFBRSxFQUFFO0FBQ2xCLFNBQVM7QUFDVCxLQUFLO0FBQ0wsSUFBSSxNQUFNLEVBQUUsRUFBRTtBQUNkLElBQUksUUFBUSxFQUFFO0FBQ2QsUUFBUSxTQUFTLEVBQUU7QUFDbkIsWUFBWSxFQUFFLEVBQUUsRUFBRTtBQUNsQixZQUFZLEtBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQztBQUMzQixTQUFTO0FBQ1QsUUFBUSxLQUFLLEVBQUU7QUFDZixZQUFZLEVBQUUsRUFBRSxFQUFFO0FBQ2xCLFlBQVksS0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDO0FBQzNCLFNBQVM7QUFDVCxRQUFRLElBQUksRUFBRTtBQUNkLFlBQVksRUFBRSxFQUFFLEVBQUU7QUFDbEIsWUFBWSxLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUM7QUFDM0IsU0FBUztBQUNULFFBQVEsT0FBTyxFQUFFO0FBQ2pCLFlBQVksRUFBRSxFQUFFLEVBQUU7QUFDbEIsWUFBWSxLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUM7QUFDM0IsU0FBUztBQUNULFFBQVEsS0FBSyxFQUFFO0FBQ2YsWUFBWSxFQUFFLEVBQUUsRUFBRTtBQUNsQixZQUFZLEtBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQztBQUMzQixTQUFTO0FBQ1QsUUFBUSxLQUFLLEVBQUU7QUFDZixZQUFZLEVBQUUsRUFBRSxFQUFFO0FBQ2xCLFlBQVksS0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDO0FBQzNCLFNBQVM7QUFDVCxRQUFRLEtBQUssRUFBRTtBQUNmLFlBQVksRUFBRSxFQUFFLEVBQUU7QUFDbEIsWUFBWSxLQUFLLEVBQUUsQ0FBQyxNQUFNLENBQUM7QUFDM0IsU0FBUztBQUNULEtBQUs7QUFDTCxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLE1BQU0sb0JBQW9CLEdBQUc7QUFDcEMsSUFBSSxHQUFHLEVBQUUsYUFBYTtBQUN0QixJQUFJLE9BQU8sRUFBRSxDQUFDO0FBQ2QsSUFBSSxLQUFLLEVBQUUsUUFBUSxDQUFDLElBQUk7QUFDeEIsSUFBSSxRQUFRLEVBQUUsSUFBSTtBQUNsQixJQUFJLEtBQUssRUFBRSxLQUFLO0FBQ2hCLElBQUksZ0JBQWdCLEVBQUUsR0FBRztBQUN6QixJQUFJLFNBQVMsRUFBRSxHQUFHO0FBQ2xCLElBQUksU0FBUyxFQUFFLElBQUk7QUFDbkIsSUFBSSxlQUFlLEVBQUUsY0FBYztBQUNuQyxJQUFJLE9BQU8sRUFBRSxJQUFJO0FBQ2pCLElBQUksTUFBTSxFQUFFLFdBQVcsQ0FBQyxHQUFHO0FBQzNCLElBQUksT0FBTyxFQUFFLHFFQUFxRTtBQUNsRixJQUFJLEtBQUssRUFBRSxZQUFZO0FBQ3ZCLENBQUM7O0FDdkdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLFNBQVMsV0FBVyxDQUFDLElBQUksRUFBRTtBQUNsQyxJQUFJLE9BQU8sV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsRUFBRTtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxTQUFTLFdBQVcsQ0FBQyxJQUFJLEVBQUU7QUFDbEMsSUFBSSxPQUFPO0FBQ1gsU0FBUyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsT0FBTztBQUMzQyxTQUFTLE9BQU8sQ0FBQyxTQUFTLEVBQUUsR0FBRztBQUMvQixTQUFTLFdBQVcsRUFBRTtBQUN0QjtBQWtEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLFNBQVMsRUFBRSxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksRUFBRTtBQUNwQyxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDekIsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxPQUFPLEdBQUcsS0FBSyxRQUFRLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxDQUFDO0FBQ3BGLFlBQVksTUFBTSxJQUFJLEtBQUssQ0FBQyxDQUFDLHlFQUF5RSxDQUFDLENBQUM7QUFDeEc7QUFDQSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxFQUFFO0FBQzFELFFBQVEsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMzQixRQUFRLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEtBQUs7QUFDL0QsWUFBWSxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLFlBQVk7QUFDNUUsZ0JBQWdCLE9BQU8sR0FBRztBQUMxQixhQUFhLENBQUM7QUFDZCxTQUFTLEVBQUUsTUFBTSxDQUFDO0FBQ2xCO0FBQ0EsSUFBSSxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLFVBQVUsS0FBSyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLE9BQU8sT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUs7QUFDdkMsY0FBYyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUTtBQUNuQyxjQUFjLFdBQVc7QUFDekIsS0FBSyxDQUFDO0FBQ047O0FDMU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxNQUFNLGlCQUFpQixDQUFDO0FBQy9CLElBQUksV0FBVyxHQUFHO0FBQ2xCLFFBQVEsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO0FBQzlDLFlBQVksS0FBSyxFQUFFLENBQUM7QUFDcEIsWUFBWSxRQUFRLEVBQUUsSUFBSTtBQUMxQixZQUFZLFlBQVksRUFBRSxLQUFLO0FBQy9CLFlBQVksVUFBVSxFQUFFLEtBQUs7QUFDN0IsU0FBUyxDQUFDO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxNQUFNLENBQUMsS0FBSyxFQUFFO0FBQ2xCLFFBQVEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSztBQUNsRCxZQUFZLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRTtBQUMzQyxnQkFBZ0IsR0FBRyxFQUFFLE1BQU0sQ0FBQztBQUM1QixnQkFBZ0IsR0FBRyxFQUFFLENBQUMsR0FBRyxLQUFLO0FBQzlCLG9CQUFvQixDQUFDLEdBQUcsR0FBRztBQUMzQixpQkFBaUI7QUFDakIsZ0JBQWdCLFlBQVksRUFBRSxJQUFJO0FBQ2xDLGdCQUFnQixVQUFVLEVBQUUsSUFBSTtBQUNoQyxhQUFhLENBQUM7QUFDZCxTQUFTLENBQUM7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFVBQVUsQ0FBQyxLQUFLLEVBQUU7QUFDdEIsUUFBUSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUMxQixRQUFRLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU07QUFDN0QsUUFBUSxPQUFPLElBQUk7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFO0FBQ2IsUUFBUSxJQUFJLEVBQUUsR0FBRyxJQUFJLElBQUksQ0FBQztBQUMxQixZQUFZLE1BQU0sSUFBSSxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLGdEQUFnRCxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xILFFBQVEsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRTtBQUNwQixRQUFRLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEtBQUssRUFBRSxDQUFDO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFO0FBQ2IsUUFBUSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFFO0FBQ2hCLFFBQVEsSUFBSSxFQUFFLEdBQUcsSUFBSSxJQUFJLENBQUM7QUFDMUIsWUFBWSxPQUFPLElBQUk7QUFDdkIsUUFBUSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDeEIsUUFBUSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ3JCLFFBQVEsT0FBTyxJQUFJO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksSUFBSSxHQUFHO0FBQ1gsUUFBUSxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksTUFBTSxHQUFHO0FBQ2IsUUFBUSxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksSUFBSSxHQUFHO0FBQ1gsUUFBUSxPQUFPLElBQUksQ0FBQyxNQUFNO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksS0FBSyxHQUFHO0FBQ1osUUFBUSxPQUFPLElBQUksaUJBQWlCLEVBQUU7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE9BQU8sQ0FBQyxRQUFRLEVBQUU7QUFDdEIsUUFBUSxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxHQUFHLENBQUMsUUFBUSxFQUFFO0FBQ2xCLFFBQVEsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNyRjtBQUNBOztBQzFKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLFNBQVMsU0FBUyxHQUFHO0FBQzVCLElBQUksUUFBUSxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEUsUUFBUSxNQUFNLENBQUMsU0FBUztBQUN4Qjs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsa0JBQWtCLENBQUM7QUFDN0MsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFDO0FBQ3ZDLE1BQU0sV0FBVyxTQUFTLGlCQUFpQixDQUFDO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxTQUFTLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxJQUFJLFdBQVcsRUFBRSxDQUFDO0FBQ3BELElBQUksV0FBVyxHQUFHO0FBQ2xCLFFBQVEsS0FBSyxFQUFFO0FBQ2YsUUFBUSxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7QUFDakQsWUFBWSxLQUFLLEVBQUUsRUFBRTtBQUNyQixZQUFZLFFBQVEsRUFBRSxJQUFJO0FBQzFCLFlBQVksVUFBVSxFQUFFLEtBQUs7QUFDN0IsWUFBWSxZQUFZLEVBQUUsS0FBSztBQUMvQixTQUFTLENBQUM7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksT0FBTyxDQUFDLENBQUMsRUFBRTtBQUNmLFFBQVEsSUFBSSxHQUFHO0FBQ2YsUUFBUSxJQUFJLFNBQVMsRUFBRSxFQUFFO0FBQ3pCLFlBQVksR0FBRztBQUNmLGdCQUFnQixVQUFVLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRTtBQUMvQztBQUNBLGFBQWE7QUFDYixZQUFZLEdBQUcsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUc7QUFDeEMsWUFBWSxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQztBQUM5QjtBQUNBLFFBQVEsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksYUFBYSxDQUFDLEdBQUcsRUFBRTtBQUN2QixRQUFRLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUTtBQUNuQyxZQUFZLE9BQU8sR0FBRztBQUN0QixRQUFRLElBQUksR0FBRyxLQUFLLE1BQU07QUFDMUIsWUFBWSxPQUFPLElBQUk7QUFDdkIsUUFBUSxJQUFJLEdBQUcsS0FBSyxPQUFPO0FBQzNCLFlBQVksT0FBTyxLQUFLO0FBQ3hCLFFBQVEsTUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQztBQUN0QyxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQzFCLFlBQVksT0FBTyxNQUFNO0FBQ3pCLFFBQVEsT0FBTyxHQUFHO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUU7QUFDbEIsUUFBUSxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLO0FBQ2xELFlBQVksV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMzRCxZQUFZLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRTtBQUMzQyxnQkFBZ0IsR0FBRyxFQUFFLE1BQU07QUFDM0Isb0JBQW9CLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQ25ELG9CQUFvQixJQUFJLE9BQU8sT0FBTyxLQUFLLFdBQVc7QUFDdEQsd0JBQXdCLE9BQU8sT0FBTztBQUN0QyxvQkFBb0IsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxFQUFFO0FBQ3BELHdCQUF3QixPQUFPLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEU7QUFDQTtBQUNBLG9CQUFvQixJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUU7QUFDbEMsd0JBQXdCLE9BQU8sVUFBVTtBQUN6QztBQUNBLG9CQUFvQixPQUFPLENBQUM7QUFDNUIsaUJBQWlCO0FBQ2pCLGdCQUFnQixHQUFHLEVBQUUsQ0FBQyxHQUFHLEtBQUs7QUFDOUIsb0JBQW9CLENBQUMsR0FBRyxHQUFHO0FBQzNCLGlCQUFpQjtBQUNqQixnQkFBZ0IsWUFBWSxFQUFFLElBQUk7QUFDbEMsZ0JBQWdCLFVBQVUsRUFBRSxJQUFJO0FBQ2hDLGFBQWEsQ0FBQztBQUNkLFNBQVMsQ0FBQztBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksT0FBTyxHQUFHO0FBQ2Q7QUFDQSxRQUFRLE1BQU0sSUFBSSxHQUFHLElBQUk7QUFDekIsUUFBUSxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO0FBQzNDLFFBQVEsTUFBTSxRQUFRLEdBQUcsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sS0FBSyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUM7QUFDdkcsUUFBUSxNQUFNLFdBQVcsR0FBRyxDQUFDLEdBQUcsS0FBSyxXQUFXLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQztBQUNwRSxRQUFRLE1BQU0sWUFBWSxHQUFHLENBQUMsR0FBRyxLQUFLLE9BQU8sR0FBRyxLQUFLLFdBQVcsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFNBQVM7QUFDdEcsUUFBUSxNQUFNLE9BQU8sR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLEdBQUcsS0FBSyxLQUFLLFdBQVcsQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQztBQUN2RixRQUFRLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxLQUFLO0FBQ25ELFlBQVksTUFBTSxPQUFPLEdBQUc7QUFDNUIsZ0JBQWdCLEdBQUcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFO0FBQ25DLG9CQUFvQixJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVE7QUFDaEQsd0JBQXdCLE9BQU8sU0FBUztBQUN4QyxvQkFBb0IsTUFBTSxRQUFRLEdBQUcsQ0FBQyxHQUFHLElBQUksRUFBRSxJQUFJLENBQUM7QUFDcEQsb0JBQW9CLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUM7QUFDckQsb0JBQW9CLE1BQU0sVUFBVSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7QUFDMUQsb0JBQW9CLElBQUksT0FBTyxVQUFVLEtBQUssUUFBUSxJQUFJLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQztBQUNqRix3QkFBd0IsTUFBTSxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQztBQUNuRCxvQkFBb0IsTUFBTSxZQUFZLEdBQUcsWUFBWSxDQUFDLFVBQVUsQ0FBQztBQUNqRSxvQkFBb0IsSUFBSSxPQUFPLFlBQVksS0FBSyxXQUFXLEVBQUU7QUFDN0Qsd0JBQXdCLElBQUksT0FBTyxZQUFZLEtBQUssUUFBUSxJQUFJLFlBQVksQ0FBQyxNQUFNLEtBQUssQ0FBQztBQUN6Riw0QkFBNEIsTUFBTSxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQztBQUN2RCx3QkFBd0IsT0FBTyxZQUFZO0FBQzNDO0FBQ0Esb0JBQW9CLE1BQU0sT0FBTyxHQUFHLEtBQUssSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQztBQUM5RixvQkFBb0IsSUFBSSxDQUFDLE9BQU87QUFDaEMsd0JBQXdCLE1BQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQztBQUM3QyxvQkFBb0IsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztBQUNsRCxvQkFBb0IsSUFBSSxPQUFPLFVBQVUsS0FBSyxXQUFXO0FBQ3pELHdCQUF3QixPQUFPLFNBQVM7QUFDeEMsb0JBQW9CLElBQUksVUFBVSxLQUFLLEVBQUU7QUFDekMsd0JBQXdCLE1BQU0sT0FBTyxDQUFDLE1BQU0sQ0FBQztBQUM3QyxvQkFBb0IsSUFBSSxVQUFVO0FBQ2xDLHdCQUF3QixPQUFPLFVBQVUsS0FBSyxRQUFRO0FBQ3RELHdCQUF3QixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUU7QUFDcEQsd0JBQXdCLE9BQU8saUJBQWlCLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQztBQUN0RTtBQUNBLG9CQUFvQixPQUFPLFVBQVU7QUFDckMsaUJBQWlCO0FBQ2pCLGdCQUFnQixPQUFPLEdBQUc7QUFDMUIsb0JBQW9CLE9BQU8sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRTtBQUM5RCxpQkFBaUI7QUFDakIsZ0JBQWdCLHdCQUF3QixDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUU7QUFDeEQsb0JBQW9CLElBQUksQ0FBQyxLQUFLO0FBQzlCLHdCQUF3QixPQUFPLFNBQVM7QUFDeEMsb0JBQW9CLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRTtBQUMzRSx3QkFBd0IsT0FBTztBQUMvQiw0QkFBNEIsVUFBVSxFQUFFLElBQUk7QUFDNUMsNEJBQTRCLFlBQVksRUFBRSxJQUFJO0FBQzlDLHlCQUF5QjtBQUN6QjtBQUNBLG9CQUFvQixPQUFPLFNBQVM7QUFDcEMsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYixZQUFZLE9BQU8sSUFBSSxLQUFLLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQztBQUN6QyxTQUFTO0FBQ1QsUUFBUSxNQUFNLE9BQU8sR0FBRztBQUN4QixZQUFZLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtBQUN4QyxnQkFBZ0IsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRO0FBQzVDLG9CQUFvQixPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUM7QUFDOUQsZ0JBQWdCLE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDO0FBQzFGLGdCQUFnQixJQUFJLENBQUMsWUFBWTtBQUNqQyxvQkFBb0IsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDO0FBQzlELGdCQUFnQixNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMvQyxnQkFBZ0IsTUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztBQUN0RCxnQkFBZ0IsSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLElBQUksVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDO0FBQzdFLG9CQUFvQixNQUFNLE9BQU8sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDO0FBQy9DLGdCQUFnQixNQUFNLFlBQVksR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDO0FBQzdELGdCQUFnQixJQUFJLE9BQU8sWUFBWSxLQUFLLFdBQVcsRUFBRTtBQUN6RCxvQkFBb0IsSUFBSSxPQUFPLFlBQVksS0FBSyxRQUFRLElBQUksWUFBWSxDQUFDLE1BQU0sS0FBSyxDQUFDO0FBQ3JGLHdCQUF3QixNQUFNLE9BQU8sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDO0FBQ25ELG9CQUFvQixPQUFPLFlBQVk7QUFDdkM7QUFDQSxnQkFBZ0IsTUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQztBQUNsRCxnQkFBZ0IsSUFBSSxVQUFVO0FBQzlCLG9CQUFvQixPQUFPLFVBQVUsS0FBSyxRQUFRO0FBQ2xELG9CQUFvQixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUU7QUFDaEQsb0JBQW9CLE9BQU8saUJBQWlCLENBQUMsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEU7QUFDQSxnQkFBZ0IsSUFBSSxPQUFPLFVBQVUsS0FBSyxXQUFXO0FBQ3JELG9CQUFvQixPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUM7QUFDOUQsZ0JBQWdCLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQztBQUN4RCxnQkFBZ0IsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksTUFBTSxLQUFLLEVBQUU7QUFDbEUsb0JBQW9CLE1BQU0sT0FBTyxDQUFDLE1BQU0sRUFBRSxNQUFNLEtBQUssRUFBRSxDQUFDO0FBQ3hELGdCQUFnQixPQUFPLE1BQU07QUFDN0IsYUFBYTtBQUNiLFNBQVM7QUFDVCxRQUFRLE9BQU8sSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksT0FBTyxRQUFRLENBQUMsR0FBRyxJQUFJLEVBQUU7QUFDN0IsUUFBUSxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRTtBQUNwQyxZQUFZLE1BQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUM7QUFDckQsWUFBWSxNQUFNLE9BQU8sR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQUU7QUFDNUMsZ0JBQWdCLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRTtBQUM1QyxvQkFBb0IsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQztBQUNyRSxvQkFBb0IsSUFBSSxLQUFLLEtBQUssVUFBVTtBQUM1Qyx3QkFBd0IsT0FBTyxTQUFTO0FBQ3hDO0FBQ0Esb0JBQW9CLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUTtBQUNoRCx3QkFBd0IsTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRTtBQUM1RSx3QkFBd0IsSUFBSSxPQUFPLEtBQUssS0FBSyxXQUFXO0FBQ3hELDRCQUE0QixPQUFPLFNBQVM7QUFDNUM7QUFDQSxvQkFBb0IsSUFBSSxPQUFPLEtBQUssS0FBSyxXQUFXO0FBQ3BELHdCQUF3QixPQUFPLEtBQUs7QUFDcEMsb0JBQW9CLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO0FBQ2xEO0FBQ0Esd0JBQXdCLElBQUksSUFBSSxLQUFLLEtBQUs7QUFDMUMsNEJBQTRCLE9BQU8sU0FBUztBQUM1Qyx3QkFBd0IsT0FBTyxXQUFXLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNFO0FBQ0Esb0JBQW9CLE9BQU8sS0FBSztBQUNoQyxpQkFBaUI7QUFDakIsYUFBYSxDQUFDO0FBQ2QsWUFBWSxXQUFXLENBQUMsU0FBUyxHQUFHLE9BQU87QUFDM0M7QUFDQSxRQUFRLE9BQU8sV0FBVyxDQUFDLFNBQVM7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE9BQU8sVUFBVSxDQUFDLEtBQUssRUFBRTtBQUM3QixRQUFRLE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxRQUFRLEVBQUU7QUFDL0MsUUFBUSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsS0FBSztBQUMvQyxZQUFZLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDO0FBQ3ZFLFlBQVksSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO0FBQzlELGdCQUFnQixNQUFNLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7QUFDckQsb0JBQW9CLEdBQUcsSUFBSTtBQUMzQixvQkFBb0IsVUFBVSxFQUFFLEtBQUs7QUFDckMsaUJBQWlCLENBQUM7QUFDbEI7QUFDQSxTQUFTLENBQUM7QUFDVixRQUFRLE9BQU8sUUFBUSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE9BQU8sR0FBRyxDQUFDLEdBQUcsRUFBRTtBQUNwQixRQUFRLE9BQU8sV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE9BQU8sYUFBYSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUU7QUFDeEMsUUFBUSxNQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxLQUFLLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQztBQUN6RjtBQUNBLFFBQVEsTUFBTSxPQUFPLEdBQUcsQ0FBQyxHQUFHLEtBQUs7QUFDakMsWUFBWSxPQUFPLFdBQVcsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDO0FBQ2xELFNBQVM7QUFDVCxRQUFRLE1BQU0sT0FBTyxHQUFHO0FBQ3hCLFlBQVksR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUU7QUFDL0IsZ0JBQWdCLElBQUksSUFBSSxLQUFLLE1BQU0sQ0FBQyxXQUFXLEVBQUU7QUFDakQsb0JBQW9CLE9BQU8sTUFBTSxRQUFRLENBQUMsSUFBSSxDQUFDO0FBQy9DO0FBQ0EsZ0JBQWdCLElBQUksSUFBSSxLQUFLLFVBQVUsRUFBRTtBQUN6QyxvQkFBb0IsT0FBTyxNQUFNLFFBQVEsQ0FBQyxJQUFJLENBQUM7QUFDL0M7QUFDQSxnQkFBZ0IsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO0FBQ3hDLG9CQUFvQixPQUFPLE1BQU0sUUFBUSxDQUFDLElBQUksQ0FBQztBQUMvQztBQUNBLGdCQUFnQixJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVE7QUFDNUMsb0JBQW9CLE9BQU8sU0FBUztBQUNwQyxnQkFBZ0IsTUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQztBQUNoRyxnQkFBZ0IsTUFBTSxTQUFTLEdBQUcsT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTO0FBQ3JFLGdCQUFnQixNQUFNLFFBQVEsR0FBRyxDQUFDLEdBQUcsSUFBSSxFQUFFLElBQUksQ0FBQztBQUNoRCxnQkFBZ0IsTUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztBQUN0RDtBQUNBLGdCQUFnQixNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO0FBQ3JELGdCQUFnQixJQUFJLE9BQU8sUUFBUSxLQUFLLFdBQVc7QUFDbkQsb0JBQW9CLE9BQU8sUUFBUTtBQUNuQztBQUNBLGdCQUFnQixNQUFNLFlBQVksR0FBRyxTQUFTLElBQUksT0FBTyxTQUFTLEtBQUssUUFBUTtBQUMvRSxnQkFBZ0IsSUFBSSxZQUFZO0FBQ2hDLG9CQUFvQixPQUFPLFdBQVcsQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQztBQUN6RTtBQUNBLGdCQUFnQixJQUFJLE9BQU8sSUFBSSxTQUFTLEtBQUssRUFBRTtBQUMvQyxvQkFBb0IsT0FBTyxTQUFTO0FBQ3BDO0FBQ0EsZ0JBQWdCLElBQUksT0FBTyxJQUFJLE9BQU8sU0FBUyxLQUFLLFdBQVc7QUFDL0Qsb0JBQW9CLE9BQU8sU0FBUztBQUNwQztBQUNBO0FBQ0EsZ0JBQWdCLE9BQU8sV0FBVyxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDO0FBQ3JFLGFBQWE7QUFDYixZQUFZLE9BQU8sR0FBRztBQUN0QixnQkFBZ0IsT0FBTyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFO0FBQzlELGFBQWE7QUFDYixZQUFZLHdCQUF3QixDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUU7QUFDNUMsZ0JBQWdCLElBQUksQ0FBQyxPQUFPO0FBQzVCLG9CQUFvQixPQUFPLFNBQVM7QUFDcEMsZ0JBQWdCLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRTtBQUN0RSxvQkFBb0IsT0FBTyxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRTtBQUNuRTtBQUNBLGdCQUFnQixPQUFPLFNBQVM7QUFDaEMsYUFBYTtBQUNiLFNBQVM7QUFDVCxRQUFRLE1BQU0sTUFBTSxHQUFHLEVBQUU7QUFDekIsUUFBUSxPQUFPLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUM7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksRUFBRTtBQUM5QixRQUFRLE9BQU8sV0FBVyxDQUFDLFFBQVE7QUFDbkMsYUFBYSxJQUFJO0FBQ2pCLGFBQWEsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDckQ7QUFDQSxJQUFJLE9BQU8sVUFBVSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO0FBQ3pDLFFBQVEsSUFBSSxDQUFDLEtBQUs7QUFDbEIsWUFBWTtBQUNaLFFBQVEsSUFBSSxLQUFLLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUN6RSxZQUFZLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUM7QUFDdkMsWUFBWSxNQUFNLE1BQU0sR0FBRyxRQUFRLElBQUksT0FBTyxRQUFRLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRO0FBQzlGLGtCQUFrQjtBQUNsQixrQkFBa0IsRUFBRTtBQUNwQixZQUFZLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNO0FBQy9CLFlBQVksTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsS0FBSztBQUN0RSxnQkFBZ0IsV0FBVyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFVBQVUsQ0FBQztBQUNwRSxhQUFhLENBQUM7QUFDZCxZQUFZO0FBQ1o7QUFDQSxRQUFRLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLO0FBQzFCO0FBQ0EsSUFBSSxPQUFPLGNBQWMsQ0FBQyxHQUFHLEVBQUU7QUFDL0IsUUFBUSxJQUFJLFNBQVMsRUFBRSxFQUFFO0FBQ3pCLFlBQVksTUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLGFBQWEsQ0FBQztBQUNqRCxZQUFZLE9BQU8sR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTO0FBQzdDO0FBQ0EsUUFBUSxPQUFPLFVBQVUsRUFBRSxPQUFPLEVBQUUsR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUM5QztBQUNBLElBQUksT0FBTyxlQUFlLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRTtBQUN2QyxRQUFRLE1BQU0sTUFBTSxHQUFHLEtBQUssR0FBRyxpQkFBaUIsR0FBRyxXQUFXO0FBQzlELFFBQVEsT0FBTyxJQUFJLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixFQUFFLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLE1BQU0saUJBQWlCLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxvQkFBb0IsRUFBRTtBQUNoRyxJQUFJLEdBQUcsRUFBRSxDQUFDLFNBQVMsRUFBRSxJQUFJLFVBQVUsQ0FBQyxhQUFhO0FBQ2pELFVBQVUsVUFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFVBQVU7QUFDOUMsVUFBVSxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxhQUFhO0FBQzlELENBQUMsQ0FBQyxDQUFDOztBQ3ZZSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxNQUFNLFVBQVUsQ0FBQztBQUN4QixJQUFJLFdBQVcsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFO0FBQy9CLFFBQVEsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPO0FBQzlCLFFBQVEsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJO0FBQ3hCO0FBQ0EsSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFFO0FBQ2hCLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSTtBQUN6QyxZQUFZLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDakMsUUFBUSxPQUFPLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU07QUFDdEI7QUFDQSxJQUFJLEdBQUcsSUFBSSxFQUFFO0FBQ2IsUUFBUSxJQUFJLENBQUMsTUFBTSxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsRUFBRTtBQUNuRCxZQUFZLE1BQU0sR0FBRyxNQUFNO0FBQzNCLFlBQVksTUFBTSxHQUFHLFNBQVM7QUFDOUI7QUFDQSxhQUFhO0FBQ2IsWUFBWSxNQUFNLEdBQUc7QUFDckIsa0JBQWtCLE9BQU8sTUFBTSxLQUFLO0FBQ3BDLHNCQUFzQjtBQUN0QixzQkFBc0IsTUFBTSxDQUFDO0FBQzdCLGtCQUFrQixTQUFTO0FBQzNCO0FBQ0EsUUFBUSxPQUFPLElBQUksS0FBSyxDQUFDLElBQUksRUFBRTtBQUMvQixZQUFZLEdBQUcsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsUUFBUSxLQUFLO0FBQzFDLGdCQUFnQixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDO0FBQy9ELGdCQUFnQixJQUFJLENBQUMsS0FBSyxRQUFRLEVBQUU7QUFDcEMsb0JBQW9CLE9BQU8sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNsRCx3QkFBd0IsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSztBQUM1Qyw0QkFBNEIsSUFBSSxNQUFNLElBQUksQ0FBQyxJQUFJLE1BQU07QUFDckQsZ0NBQWdDLE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQztBQUNoRCw0QkFBNEIsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDO0FBQ25FLHlCQUF5QjtBQUN6QixxQkFBcUIsQ0FBQztBQUN0QjtBQUNBLGdCQUFnQixJQUFJLENBQUMsS0FBSyxTQUFTLElBQUksTUFBTSxFQUFFO0FBQy9DLG9CQUFvQixPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDckQ7QUFDQSxnQkFBZ0IsT0FBTyxNQUFNO0FBQzdCLGFBQWE7QUFDYixTQUFTLENBQUM7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRTtBQUNyQyxRQUFRLE1BQU0sR0FBRyxHQUFHLEVBQUU7QUFDdEIsUUFBUSxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztBQUMxQyxRQUFRLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO0FBQ2xELFFBQVEsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDdEMsUUFBUSxJQUFJLEdBQUc7QUFDZixZQUFZLEdBQUcsQ0FBQyxHQUFHLEdBQUc7QUFDdEIsa0JBQWtCLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLO0FBQ2pELGtCQUFrQixHQUFHO0FBQ3JCLFFBQVEsSUFBSSxTQUFTO0FBQ3JCLFlBQVksR0FBRyxDQUFDLFNBQVMsR0FBRztBQUM1QixrQkFBa0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLEtBQUs7QUFDN0Qsa0JBQWtCLFNBQVM7QUFDM0IsUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUU7QUFDdEMsWUFBWSxNQUFNLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRTtBQUNqRCxZQUFZLE1BQU0sU0FBUyxHQUFHLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsS0FBSyxDQUFDLEdBQUcsSUFBSTtBQUNwRixZQUFZLEdBQUcsQ0FBQyxTQUFTLEdBQUcsU0FBUztBQUNyQztBQUNBLFFBQVEsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFO0FBQ3JDLFlBQVksTUFBTSxHQUFHLEdBQUc7QUFDeEIsa0JBQWtCLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxLQUFLO0FBQ3hELGtCQUFrQixLQUFLO0FBQ3ZCLFlBQVksR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsV0FBVyxFQUFFO0FBQ3pDO0FBQ0EsUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEVBQUU7QUFDcEMsWUFBWSxNQUFNLE9BQU8sR0FBRztBQUM1QixrQkFBa0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLO0FBQzVELGtCQUFrQixJQUFJLENBQUMsT0FBTztBQUM5QixZQUFZLEdBQUcsQ0FBQyxPQUFPLEdBQUcsT0FBTztBQUNqQztBQUNBLFFBQVEsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxFQUFFO0FBQzFDLFlBQVk7QUFDWixnQkFBZ0IsTUFBTSxFQUFFLEdBQUc7QUFDM0Isc0JBQXNCLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSztBQUN4RixzQkFBc0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQyxRQUFRLEVBQUU7QUFDN0QsZ0JBQWdCLEdBQUcsQ0FBQyxhQUFhLEdBQUcsRUFBRTtBQUN0QztBQUNBO0FBQ0EsUUFBUSxNQUFNLEdBQUcsR0FBRztBQUNwQixjQUFjLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxPQUFPLEtBQUssUUFBUSxHQUFHLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLO0FBQ3JHLGNBQWMsT0FBTyxPQUFPLEtBQUs7QUFDakMsa0JBQWtCO0FBQ2xCLGtCQUFrQixPQUFPLENBQUMsT0FBTztBQUNqQyxRQUFRLEdBQUcsQ0FBQyxPQUFPLEdBQUcsR0FBRztBQUN6QixRQUFRLElBQUksS0FBSyxJQUFJLE9BQU8sWUFBWSxLQUFLLEVBQUU7QUFDL0MsWUFBWSxNQUFNLEtBQUssR0FBRztBQUMxQixrQkFBa0IsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxJQUFJLE9BQU8sQ0FBQyxLQUFLLEdBQUcsT0FBTyxFQUFFLEtBQUs7QUFDL0Usa0JBQWtCLEtBQUssRUFBRSxLQUFLLElBQUksRUFBRTtBQUNwQyxZQUFZLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLElBQUksT0FBTyxFQUFFLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNuRjtBQUNBLFFBQVEsUUFBUSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUNyQyxZQUFZLEtBQUssTUFBTTtBQUN2QixnQkFBZ0IsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQztBQUMxQyxZQUFZLEtBQUssS0FBSztBQUN0QixnQkFBZ0IsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVM7QUFDNUMscUJBQXFCLEtBQUssQ0FBQyxHQUFHO0FBQzlCLHFCQUFxQixHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUs7QUFDaEMsb0JBQW9CLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztBQUMzQyx3QkFBd0IsT0FBTyxDQUFDO0FBQ2hDLG9CQUFvQixNQUFNLFVBQVUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQztBQUNqRCxvQkFBb0IsSUFBSSxVQUFVLEtBQUssQ0FBQztBQUN4Qyx3QkFBd0IsT0FBTyxVQUFVO0FBQ3pDLG9CQUFvQixPQUFPLFNBQVM7QUFDcEMsaUJBQWlCO0FBQ2pCLHFCQUFxQixNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUNwQyxxQkFBcUIsSUFBSSxDQUFDLEdBQUcsQ0FBQztBQUM5QixZQUFZO0FBQ1osZ0JBQWdCLE1BQU0sSUFBSSxLQUFLLENBQUMsQ0FBQyw0QkFBNEIsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUU7QUFDM0IsUUFBUSxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQztBQUM1QyxRQUFRLElBQUksZ0JBQWdCLENBQUMsT0FBTyxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxDQUFDO0FBQy9ELFlBQVk7QUFDWixRQUFRLElBQUksTUFBTTtBQUNsQixRQUFRLFFBQVEsS0FBSztBQUNyQixZQUFZLEtBQUssUUFBUSxDQUFDLFNBQVM7QUFDbkMsZ0JBQWdCLE1BQU0sR0FBRyxPQUFPLENBQUMsR0FBRztBQUNwQyxnQkFBZ0I7QUFDaEIsWUFBWSxLQUFLLFFBQVEsQ0FBQyxJQUFJO0FBQzlCLGdCQUFnQixNQUFNLEdBQUcsT0FBTyxDQUFDLEdBQUc7QUFDcEMsZ0JBQWdCO0FBQ2hCLFlBQVksS0FBSyxRQUFRLENBQUMsT0FBTztBQUNqQyxZQUFZLEtBQUssUUFBUSxDQUFDLEtBQUs7QUFDL0IsZ0JBQWdCLE1BQU0sR0FBRyxPQUFPLENBQUMsS0FBSztBQUN0QyxnQkFBZ0I7QUFDaEIsWUFBWSxLQUFLLFFBQVEsQ0FBQyxLQUFLO0FBQy9CLGdCQUFnQixNQUFNLEdBQUcsT0FBTyxDQUFDLEtBQUs7QUFDdEMsZ0JBQWdCO0FBQ2hCLFlBQVksS0FBSyxRQUFRLENBQUMsS0FBSztBQUMvQixnQkFBZ0IsTUFBTSxHQUFHLE9BQU8sQ0FBQyxLQUFLO0FBQ3RDLGdCQUFnQjtBQUNoQixZQUFZLEtBQUssUUFBUSxDQUFDLEtBQUs7QUFDL0IsZ0JBQWdCLE1BQU0sR0FBRyxPQUFPLENBQUMsS0FBSztBQUN0QyxnQkFBZ0I7QUFDaEIsWUFBWTtBQUNaLGdCQUFnQixNQUFNLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDO0FBQ3BEO0FBQ0EsUUFBUSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFO0FBQ25CLFFBQVEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFLFNBQVMsR0FBRyxDQUFDLEVBQUU7QUFDOUIsUUFBUSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksU0FBUztBQUMvQyxZQUFZLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFO0FBQ2hDLFFBQVEsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLFNBQVM7QUFDL0MsWUFBWSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQ2QsUUFBUSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxLQUFLLENBQUMsR0FBRyxFQUFFO0FBQ2YsUUFBUSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFO0FBQ2xCLFFBQVEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUU7QUFDZCxRQUFRLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxHQUFHLENBQUM7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLEtBQUssQ0FBQyxHQUFHLEVBQUU7QUFDZixRQUFRLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUM7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFNBQVMsQ0FBQyxNQUFNLEVBQUU7QUFDdEIsUUFBUSxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEdBQUcsTUFBTSxFQUFFO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sTUFBTSxPQUFPLENBQUM7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLFNBQVMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLEtBQUs7QUFDakQsUUFBUSxPQUFPLElBQUksVUFBVSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7QUFDN0MsS0FBSyxDQUFDO0FBQ04sSUFBSSxTQUFTLElBQUksQ0FBQyxPQUFPLEdBQUcsaUJBQWlCLENBQUM7QUFDOUMsSUFBSSxXQUFXLEdBQUc7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxPQUFPLFVBQVUsQ0FBQyxPQUFPLEVBQUU7QUFDL0IsUUFBUSxPQUFPLENBQUMsUUFBUSxHQUFHLE9BQU87QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE9BQU8sU0FBUyxDQUFDLE1BQU0sRUFBRTtBQUM3QixRQUFRLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUs7QUFDbkQsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7QUFDL0IsU0FBUyxDQUFDO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxPQUFPLFNBQVMsR0FBRztBQUN2QixRQUFRLE9BQU8sSUFBSSxDQUFDLE9BQU87QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE9BQU8sR0FBRyxHQUFHO0FBQ2pCLFFBQVEsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7QUFDMUUsUUFBUSxPQUFPLElBQUksQ0FBQyxNQUFNO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE9BQU8sT0FBTyxDQUFDLEdBQUcsRUFBRSxTQUFTLEdBQUcsQ0FBQyxFQUFFO0FBQ3ZDLFFBQVEsT0FBTyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUM7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNyQixRQUFRLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE9BQU8sS0FBSyxDQUFDLEdBQUcsRUFBRTtBQUN0QixRQUFRLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE9BQU8sS0FBSyxDQUFDLEdBQUcsRUFBRTtBQUN0QixRQUFRLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE9BQU8sU0FBUyxDQUFDLEdBQUcsRUFBRTtBQUMxQixRQUFRLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUM7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE9BQU8sS0FBSyxDQUFDLEdBQUcsRUFBRTtBQUN0QixRQUFRLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNyQixRQUFRLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksT0FBTyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRTtBQUN6QixRQUFRLE9BQU8sSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksT0FBTyxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksRUFBRTtBQUN4QyxRQUFRLE1BQU07QUFDZCxZQUFZLE9BQU8sTUFBTSxLQUFLO0FBQzlCLGtCQUFrQjtBQUNsQixrQkFBa0IsTUFBTSxDQUFDO0FBQ3pCLHNCQUFzQixNQUFNLENBQUMsV0FBVyxDQUFDO0FBQ3pDLHNCQUFzQixNQUFNLENBQUMsSUFBSTtBQUNqQyxRQUFRLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksT0FBTyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRTtBQUMvQixRQUFRLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUM7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE9BQU8sS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFFBQVEsR0FBRyxZQUFZLEVBQUU7QUFDbkUsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLO0FBQy9CLFlBQVksT0FBTyxJQUFJO0FBQ3ZCLFFBQVEsU0FBUyxLQUFLLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7QUFDM0MsWUFBWSxJQUFJO0FBQ2hCLGdCQUFnQixNQUFNLENBQUMsR0FBRyxHQUFHO0FBQzdCLGdCQUFnQixJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQ2hDLGdCQUFnQixTQUFTLFVBQVUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxHQUFHLEtBQUssRUFBRTtBQUN2RCxvQkFBb0IsSUFBSSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLFVBQVU7QUFDOUQsb0JBQW9CLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQzdDLHdCQUF3QixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQztBQUMvQztBQUNBLG9CQUFvQixRQUFRLEdBQUcsQ0FBQyxNQUFNO0FBQ3RDLHdCQUF3QixLQUFLLENBQUM7QUFDOUIsNEJBQTRCLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsUUFBUTtBQUNoRSw0QkFBNEIsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVDLHdCQUF3QixLQUFLLENBQUM7QUFDOUIsNEJBQTRCLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRztBQUN0RCw0QkFBNEIsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hFLHdCQUF3QjtBQUN4Qiw0QkFBNEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLDBCQUEwQixFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDaEYsNEJBQTRCLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQztBQUMzQztBQUNBO0FBQ0EsZ0JBQWdCLFNBQVMsVUFBVSxDQUFDLENBQUMsRUFBRTtBQUN2QyxvQkFBb0IsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLEVBQUU7QUFDL0Msd0JBQXdCLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUN0QztBQUNBLHlCQUF5QjtBQUN6Qix3QkFBd0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEM7QUFDQTtBQUNBLGdCQUFnQixRQUFRLE1BQU07QUFDOUIsb0JBQW9CLEtBQUssSUFBSTtBQUM3QixvQkFBb0IsS0FBSyxJQUFJO0FBQzdCLHdCQUF3QixPQUFPLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJO0FBQ3JELG9CQUFvQixLQUFLLE9BQU87QUFDaEMsd0JBQXdCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUNsRCw0QkFBNEIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7QUFDckQ7QUFDQSw2QkFBNkI7QUFDN0IsNEJBQTRCLFVBQVUsQ0FBQyxLQUFLLENBQUM7QUFDN0M7QUFDQSx3QkFBd0IsT0FBTyxDQUFDLENBQUMsSUFBSTtBQUNyQyxvQkFBb0I7QUFDcEIsd0JBQXdCLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQywwQkFBMEIsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQzVFLHdCQUF3QixPQUFPLENBQUM7QUFDaEM7QUFDQTtBQUNBO0FBQ0EsWUFBWSxPQUFPLENBQUMsRUFBRTtBQUN0QixnQkFBZ0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLHNCQUFzQixFQUFFLE1BQU0sQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNwRixnQkFBZ0IsT0FBTyxHQUFHO0FBQzFCO0FBQ0E7QUFDQSxRQUFRLE1BQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7QUFDOUMsUUFBUSxJQUFJLENBQUMsZUFBZSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxNQUFNLEVBQUU7QUFDdEUsWUFBWSxPQUFPLElBQUk7QUFDdkI7QUFDQSxRQUFRLElBQUksV0FBVyxHQUFHLGVBQWU7QUFDekMsUUFBUSxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUM7QUFDckQsUUFBUSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksU0FBUztBQUN4RCxZQUFZLFdBQVc7QUFDdkIsZ0JBQWdCLGVBQWUsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFO0FBQ2xELFFBQVEsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEtBQUs7QUFDN0QsWUFBWSxNQUFNLEdBQUcsR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDO0FBQ3hDLFlBQVksSUFBSSxHQUFHO0FBQ25CLGdCQUFnQixPQUFPLEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztBQUMzQyxZQUFZLE9BQU8sR0FBRztBQUN0QixTQUFTLEVBQUUsSUFBSSxDQUFDO0FBQ2hCO0FBQ0E7O0FDemxCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLE1BQU0sV0FBVyxDQUFDO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLElBQUksR0FBRyxHQUFHO0FBQ2QsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUk7QUFDdEIsWUFBWSxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO0FBQ3pDLFFBQVEsT0FBTyxJQUFJLENBQUMsSUFBSTtBQUN4QjtBQUNBLElBQUksV0FBVyxHQUFHO0FBQ2xCOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxNQUFNLFNBQVMsU0FBUyxXQUFXLENBQUM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksSUFBSSxHQUFHLEdBQUc7QUFDZCxRQUFRLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxDQUFDO0FBQ25EO0FBQ0E7O0FDbENBLFNBQVMsT0FBTyxHQUFHO0FBQ25CO0FBQ0EsSUFBSSxJQUFJLE9BQU8sVUFBVSxLQUFLLFdBQVc7QUFDekMsUUFBUSxPQUFPLFVBQVUsQ0FBQyxXQUFXLEVBQUUsR0FBRyxLQUFLLFVBQVUsRUFBRTtBQUMzRCxRQUFRLE9BQU8sTUFBTSxVQUFVLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRTtBQUNqRDtBQUNBO0FBQ0EsSUFBSSxJQUFJLE9BQU8sT0FBTyxLQUFLLFdBQVc7QUFDdEMsUUFBUSxPQUFPLE9BQU8sQ0FBQyxNQUFNLEVBQUUsTUFBTSxLQUFLLFVBQVUsRUFBRTtBQUN0RCxRQUFRLE9BQU8sTUFBTTtBQUNyQixZQUFZLE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDL0MsWUFBWSxPQUFPLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUM7QUFDMUMsU0FBUztBQUNUO0FBQ0E7QUFDQSxJQUFJLE9BQU8sTUFBTSxJQUFJLENBQUMsR0FBRyxFQUFFO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNtQixPQUFPOztBQzRLMUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxTQUFTLEtBQUssR0FBRztBQUN4QixJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLFVBQVUsS0FBSztBQUNoRCxRQUFRLElBQUksQ0FBQyxVQUFVO0FBQ3ZCLFlBQVksTUFBTSxJQUFJLEtBQUssQ0FBQyw2Q0FBNkMsQ0FBQztBQUMxRSxRQUFRLElBQUksVUFBVSxFQUFFLFlBQVksRUFBRTtBQUN0QyxZQUFZLFVBQVUsQ0FBQyxZQUFZLEdBQUcsS0FBSztBQUMzQztBQUNBLFFBQVEsT0FBTyxVQUFVO0FBQ3pCLEtBQUs7QUFDTDs7QUNsTkEsSUFBSSxVQUFVLEdBQUcsQ0FBQ0EsU0FBSSxJQUFJQSxTQUFJLENBQUMsVUFBVSxLQUFLLFVBQVUsVUFBVSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFO0FBQ3ZGLElBQUksSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLEdBQUcsSUFBSSxLQUFLLElBQUksR0FBRyxJQUFJLEdBQUcsTUFBTSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQztBQUNoSSxJQUFJLElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxJQUFJLE9BQU8sT0FBTyxDQUFDLFFBQVEsS0FBSyxVQUFVLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDO0FBQ2xJLFNBQVMsS0FBSyxJQUFJLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQztBQUNySixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUM7QUFDakUsQ0FBQztBQUNELElBQUksVUFBVSxHQUFHLENBQUNBLFNBQUksSUFBSUEsU0FBSSxDQUFDLFVBQVUsS0FBSyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUU7QUFDOUQsSUFBSSxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsSUFBSSxPQUFPLE9BQU8sQ0FBQyxRQUFRLEtBQUssVUFBVSxFQUFFLE9BQU8sT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzVHLENBQUM7QUFHRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sTUFBTSxhQUFhLFNBQVMsU0FBUyxDQUFDO0FBQzdDLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUU7QUFDckMsUUFBUSxLQUFLLEVBQUU7QUFDZixRQUFRLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTTtBQUM1QixRQUFRLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRTtBQUNuQixRQUFRLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztBQUMvQyxRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxHQUFHLENBQUM7QUFDakMsUUFBUSxPQUFPLEtBQUs7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtBQUNyQyxRQUFRLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDN0MsUUFBUSxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztBQUN6QyxRQUFRLElBQUksQ0FBQyxLQUFLO0FBQ2xCLFlBQVksT0FBTyxPQUFPO0FBQzFCLFFBQVEsSUFBSTtBQUNaLFlBQVksT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQztBQUNqRTtBQUNBLFFBQVEsT0FBTyxDQUFDLEVBQUU7QUFDbEIsWUFBWSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsaUNBQWlDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5RDtBQUNBLFFBQVEsT0FBTyxFQUFFO0FBQ2pCO0FBQ0E7QUFDQSxVQUFVLENBQUM7QUFDWCxJQUFJLEtBQUssRUFBRTtBQUNYLElBQUksVUFBVSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUM7QUFDdkMsSUFBSSxVQUFVLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QyxJQUFJLFVBQVUsQ0FBQyxtQkFBbUIsRUFBRSxNQUFNO0FBQzFDLENBQUMsRUFBRSxhQUFhLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUM7O0FDNUUxQyxNQUFNLE9BQU8sR0FBRyxJQUFJQyxpQkFBTyxFQUFFO0FBRTdCO0tBQ0csT0FBTyxDQUFDLGtCQUFrQjtLQUMxQixXQUFXLENBQUMsdUNBQXVDO0FBQ25ELEtBQUEsTUFBTSxDQUFDLGlCQUFpQixFQUFFLHlCQUF5QjtBQUNuRCxLQUFBLE1BQU0sQ0FBQyxPQUFPLE9BQU8sS0FBSTtJQUN4QixNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQztBQUNuQyxJQUFBLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUNDLGFBQUcsRUFBRSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDL0MsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDO0lBRS9DLE1BQU0sT0FBTyxHQUFHLHFCQUFxQjtJQUVyQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNoQyxRQUFBLE9BQU8sR0FBRyxDQUFHLEVBQUEsT0FBTyxDQUFLLEVBQUEsRUFBQSxPQUFPLEVBQUU7UUFDbEMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQztBQUMzQyxRQUFBLEdBQUcsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLFFBQVEsQ0FBQSxDQUFFLENBQUM7O1NBQ25DO0FBQ0wsUUFBQSxHQUFHLENBQUMsS0FBSyxDQUFDLDhCQUE4QixRQUFRLENBQUEsQ0FBRSxDQUFDOztBQUV2RCxDQUFDLENBQUM7QUFFSixPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7OyIsInhfZ29vZ2xlX2lnbm9yZUxpc3QiOlswLDEsMiwzLDQsNSw2LDcsOCw5LDEwLDExLDEyLDEzXX0=
