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
import Formula from './formula';
import { ContentType } from './types';
type CallbackFunc = (error: any, kb: Formula | null) => void;
type ParserFunc = (str: string, kb: Formula, base: string, callback?: CallbackFunc) => void;
/**
 * Register an additional parser for a content type
 */
export declare function registerParser(contentType: string, parser: ParserFunc): void;
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
export default function parseLite(str: string, kb: Formula, base: string, contentType?: string | ContentType, callback?: CallbackFunc): void;
export declare const supportedTypes: {
    'text/n3': boolean;
    'text/turtle': boolean;
};
export {};
