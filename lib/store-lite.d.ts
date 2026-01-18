/**
 * Lightweight Store (IndexedFormula) without query or serialization
 *
 * This is a minimal RDF store that supports basic CRUD operations
 * on triples/quads without the heavy query engine or serializers.
 *
 * @module store-lite
 */
import FormulaLite, { FormulaOpts } from './formula-lite';
import Statement from './statement';
import { Quad_Graph, Quad_Object, Quad_Predicate, Quad, Quad_Subject, Term } from './tf-types';
type FeaturesType = Quad[] | FormulaOpts;
/**
 * Lightweight indexed formula store
 */
export default class StoreLite extends FormulaLite {
    /**
     * An array of statements in the store
     */
    statements: Quad[];
    /**
     * Map of namespace prefixes to URIs
     */
    namespaces: {
        [prefix: string]: string;
    };
    /**
     * Index by subject
     */
    subjectIndex: {
        [key: string]: Quad[];
    };
    /**
     * Index by predicate
     */
    predicateIndex: {
        [key: string]: Quad[];
    };
    /**
     * Index by object
     */
    objectIndex: {
        [key: string]: Quad[];
    };
    /**
     * Index by graph/why
     */
    whyIndex: {
        [key: string]: Quad[];
    };
    constructor(features?: FeaturesType);
    private _initIndexes;
    private _getIndexKey;
    private _addToIndex;
    private _removeFromIndex;
    /**
     * Add a statement to the store
     */
    add(subject: Quad_Subject | Quad | Quad[], predicate?: Quad_Predicate, object?: Quad_Object, graph?: Quad_Graph): Statement | null | this | number;
    private _addStatement;
    /**
     * Remove a statement from the store
     */
    remove(st: Quad): this;
    /**
     * Remove all statements matching a pattern
     */
    removeMatches(subject?: Quad_Subject | null, predicate?: Quad_Predicate | null, object?: Quad_Object | null, graph?: Quad_Graph | null): this;
    /**
     * Find statements matching a pattern (alias for match)
     */
    statementsMatching(subject?: Quad_Subject | null, predicate?: Quad_Predicate | null, object?: Quad_Object | null, graph?: Quad_Graph | null, limit?: number): Quad[];
    /**
     * Match statements (RDFJS DatasetCore interface)
     */
    match(subject?: Quad_Subject | null, predicate?: Quad_Predicate | null, object?: Quad_Object | null, graph?: Quad_Graph | null): Quad[];
    /**
     * Check if the store contains any matching statement
     */
    any(subject?: Quad_Subject | null, predicate?: Quad_Predicate | null, object?: Quad_Object | null, graph?: Quad_Graph | null): Quad_Subject | Quad_Predicate | Quad_Object | Quad_Graph | undefined;
    /**
     * Check if store holds a statement
     */
    holds(subject: Quad_Subject, predicate: Quad_Predicate, object: Quad_Object, graph?: Quad_Graph): boolean;
    /**
     * Check if store holds a statement (same as holds but returns Quad or undefined)
     */
    holdsStatement(subject: Quad_Subject, predicate: Quad_Predicate, object: Quad_Object, graph?: Quad_Graph): Quad | undefined;
    /**
     * Get the number of statements
     */
    get length(): number;
    /**
     * Get the size (alias for length, for RDFJS compatibility)
     */
    get size(): number;
    /**
     * Check if store is empty
     */
    get empty(): boolean;
    /**
     * Each statement in the store
     */
    each(subject?: Quad_Subject | null, predicate?: Quad_Predicate | null, object?: Quad_Object | null, graph?: Quad_Graph | null): Term[];
    /**
     * Iterate over all statements
     */
    [Symbol.iterator](): Iterator<Quad>;
    /**
     * For each statement
     */
    forEach(callback: (quad: Quad) => void): void;
    /**
     * Remove all statements
     */
    removeAll(): this;
    /**
     * Copy this store
     */
    clone(): StoreLite;
}
export {};
