/**
 * Simple N-Quads/N-Triples parser
 *
 * N-Quads format: <subject> <predicate> <object> <graph> .
 * N-Triples format: <subject> <predicate> <object> .
 *
 * This replaces the heavyweight 'n3' library dependency for N-Quads parsing.
 */

import { RdfJsDataFactory, Quad } from './tf-types'

// Regex patterns for N-Quads/N-Triples
const IRI_PATTERN = /<([^>]*)>/
const BLANK_NODE_PATTERN = /_:([^\s]+)/
const LITERAL_PATTERN = /"([^"\\]*(?:\\.[^"\\]*)*)"/
const LANG_TAG_PATTERN = /@([a-zA-Z]+(?:-[a-zA-Z0-9]+)*)/
const DATATYPE_PATTERN = /\^\^<([^>]*)>/

interface ParsedTerm {
  type: 'iri' | 'blank' | 'literal'
  value: string
  language?: string
  datatype?: string
}

function unescapeString(str: string): string {
  return str
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
}

function parseTerm(token: string): ParsedTerm | null {
  token = token.trim()

  // IRI
  const iriMatch = token.match(/^<([^>]*)>/)
  if (iriMatch) {
    return { type: 'iri', value: iriMatch[1] }
  }

  // Blank node
  const blankMatch = token.match(/^_:([^\s]+)/)
  if (blankMatch) {
    return { type: 'blank', value: blankMatch[1] }
  }

  // Literal with possible language tag or datatype
  const litMatch = token.match(/^"([^"\\]*(?:\\.[^"\\]*)*)"/)
  if (litMatch) {
    const value = unescapeString(litMatch[1])
    const rest = token.slice(litMatch[0].length)

    // Check for language tag
    const langMatch = rest.match(/^@([a-zA-Z]+(?:-[a-zA-Z0-9]+)*)/)
    if (langMatch) {
      return { type: 'literal', value, language: langMatch[1] }
    }

    // Check for datatype
    const dtMatch = rest.match(/^\^\^<([^>]*)>/)
    if (dtMatch) {
      return { type: 'literal', value, datatype: dtMatch[1] }
    }

    return { type: 'literal', value }
  }

  return null
}

function createTerm(factory: RdfJsDataFactory, parsed: ParsedTerm) {
  switch (parsed.type) {
    case 'iri':
      return factory.namedNode(parsed.value)
    case 'blank':
      return factory.blankNode(parsed.value)
    case 'literal':
      if (parsed.language) {
        return factory.literal(parsed.value, parsed.language)
      } else if (parsed.datatype) {
        return factory.literal(parsed.value, factory.namedNode(parsed.datatype))
      } else {
        // Plain literal with xsd:string datatype
        return factory.literal(parsed.value, factory.namedNode('http://www.w3.org/2001/XMLSchema#string'))
      }
  }
}

/**
 * Parse N-Quads/N-Triples string and call callback for each quad
 */
export function parseNQuads(
  input: string,
  factory: RdfJsDataFactory,
  callback: (error: Error | null, quad: Quad | null) => void
): void {
  const lines = input.split(/\r?\n/)

  for (const line of lines) {
    const trimmed = line.trim()

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }

    // Remove trailing dot and whitespace
    const content = trimmed.replace(/\s*\.\s*$/, '')

    // Tokenize - split on whitespace but respect quoted strings
    const tokens: string[] = []
    let current = ''
    let inQuotes = false
    let escape = false

    for (let i = 0; i < content.length; i++) {
      const char = content[i]

      if (escape) {
        current += char
        escape = false
        continue
      }

      if (char === '\\') {
        current += char
        escape = true
        continue
      }

      if (char === '"') {
        current += char
        inQuotes = !inQuotes
        continue
      }

      if (!inQuotes && (char === ' ' || char === '\t')) {
        if (current) {
          tokens.push(current)
          current = ''
        }
        continue
      }

      current += char
    }

    if (current) {
      tokens.push(current)
    }

    if (tokens.length < 3) {
      continue // Invalid line
    }

    try {
      const subject = parseTerm(tokens[0])
      const predicate = parseTerm(tokens[1])
      const object = parseTerm(tokens[2])
      const graph = tokens[3] ? parseTerm(tokens[3]) : null

      if (!subject || !predicate || !object) {
        callback(new Error(`Failed to parse line: ${line}`), null)
        continue
      }

      const quad = factory.quad(
        createTerm(factory, subject),
        createTerm(factory, predicate),
        createTerm(factory, object),
        graph ? createTerm(factory, graph) : factory.defaultGraph()
      )

      callback(null, quad)
    } catch (err) {
      callback(err as Error, null)
    }
  }

  // Signal end of parsing
  callback(null, null)
}

export default parseNQuads
