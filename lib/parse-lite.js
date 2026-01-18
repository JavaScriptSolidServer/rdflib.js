"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseLite;
exports.registerParser = registerParser;
exports.supportedTypes = void 0;
var _n3parser = _interopRequireDefault(require("./n3parser"));
var _types = require("./types");
/**
 * Lightweight parse function - only includes N3/Turtle parser
 *
 * For a smaller bundle, import this instead of the full parse module.
 * You can register additional parsers as needed.
 *
 * @example
 * import { parseLite, registerParser } from 'rdflib/parse-lite'
 * import { parseRDFaDOM } from 'rdflib/parsers/rdfa'
 *
 * // Register additional parsers if needed
 * registerParser('application/rdf+xml', rdfxmlParser)
 *
 * @module parse-lite
 */

// Registry for additional parsers
const parsers = new Map();

/**
 * Register an additional parser for a content type
 */
function registerParser(contentType, parser) {
  parsers.set(contentType, parser);
}

/**
 * Parse a string and put the result into the graph kb.
 * By default only supports N3/Turtle. Use registerParser() to add more formats.
 *
 * @param str - The input string to parse
 * @param kb - The store to use
 * @param base - The base URI to use
 * @param contentType - The MIME content type string for the input - defaults to text/turtle
 * @param callback - Optional callback for async parsers
 */
function parseLite(str, kb, base, contentType = 'text/turtle', callback) {
  contentType = contentType || _types.TurtleContentType;
  contentType = contentType.split(';')[0];
  try {
    if (contentType === _types.N3ContentType || contentType === _types.TurtleContentType) {
      const p = (0, _n3parser.default)(kb, kb, base, base, null, null, '', null);
      p.loadBuf(str);
      if (callback) callback(null, kb);
    } else if (parsers.has(contentType)) {
      // Use registered parser
      const parser = parsers.get(contentType);
      parser(str, kb, base, callback);
    } else {
      throw new Error(`No parser registered for ${contentType}. Use registerParser() to add one.`);
    }
  } catch (e) {
    if (callback) {
      callback(e, kb);
    } else {
      throw e;
    }
  }
}

// Export supported content types
const supportedTypes = exports.supportedTypes = {
  'text/n3': true,
  'text/turtle': true
};