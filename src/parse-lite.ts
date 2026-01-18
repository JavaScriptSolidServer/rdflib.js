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

import N3Parser from './n3parser'
import Formula from './formula'
import { ContentType, TurtleContentType, N3ContentType } from './types'

type CallbackFunc = (error: any, kb: Formula | null) => void
type ParserFunc = (str: string, kb: Formula, base: string, callback?: CallbackFunc) => void

// Registry for additional parsers
const parsers: Map<string, ParserFunc> = new Map()

/**
 * Register an additional parser for a content type
 */
export function registerParser(contentType: string, parser: ParserFunc): void {
  parsers.set(contentType, parser)
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
export default function parseLite(
  str: string,
  kb: Formula,
  base: string,
  contentType: string | ContentType = 'text/turtle',
  callback?: CallbackFunc
): void {
  contentType = contentType || TurtleContentType
  contentType = contentType.split(';')[0] as ContentType

  try {
    if (contentType === N3ContentType || contentType === TurtleContentType) {
      const p = N3Parser(kb, kb, base, base, null, null, '', null)
      p.loadBuf(str)
      if (callback) callback(null, kb)
    } else if (parsers.has(contentType)) {
      // Use registered parser
      const parser = parsers.get(contentType)!
      parser(str, kb, base, callback)
    } else {
      throw new Error(`No parser registered for ${contentType}. Use registerParser() to add one.`)
    }
  } catch (e) {
    if (callback) {
      callback(e, kb)
    } else {
      throw e
    }
  }
}

// Export supported content types
export const supportedTypes = {
  'text/n3': true,
  'text/turtle': true,
}
