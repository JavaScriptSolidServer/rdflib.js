/**
 * Simple N-Quads/N-Triples parser
 *
 * N-Quads format: <subject> <predicate> <object> <graph> .
 * N-Triples format: <subject> <predicate> <object> .
 *
 * This replaces the heavyweight 'n3' library dependency for N-Quads parsing.
 */
import { RdfJsDataFactory, Quad } from './tf-types';
/**
 * Parse N-Quads/N-Triples string and call callback for each quad
 */
export declare function parseNQuads(input: string, factory: RdfJsDataFactory, callback: (error: Error | null, quad: Quad | null) => void): void;
export default parseNQuads;
