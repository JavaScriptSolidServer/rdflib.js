/**
 * Lightweight Formula class without serialize method
 *
 * This is the same as Formula but without the serialize() method
 * to avoid pulling in the heavy Serializer dependency.
 *
 * If you need serialization, import the full Formula from './formula'
 * or use the standalone serialize() function.
 *
 * @module formula-lite
 */
import Collection from './collection';
import RDFlibNamedNode from './named-node';
import Namespace from './namespace';
import Node from './node-internal';
import Statement from './statement';
import { GraphTermType } from './types';
import Variable from './variable';
import { RdfJsDataFactory, Quad_Graph, Quad_Object, Quad_Predicate, Quad, Quad_Subject, Term } from './tf-types';
import BlankNode from './blank-node';
import NamedNode from './named-node';
export interface FormulaOpts {
    dataCallback?: (q: Quad) => void;
    dataRemovalCallback?: (q: Quad) => void;
    rdfArrayRemove?: (arr: Quad[], q: Quad) => void;
    rdfFactory?: RdfJsDataFactory;
}
/**
 * A lightweight formula (set of RDF statements) without serialization
 */
export default class FormulaLite extends Node {
    termType: typeof GraphTermType;
    classOrder: number;
    isVar: number;
    /**
     * A namespace for the specified namespace's URI
     * @param nsuri The URI for the namespace
     */
    ns: typeof Namespace;
    /** The factory used to generate statements and terms */
    rdfFactory: any;
    /**
     * The stored statements
     */
    statements: Quad[];
    /**
     * Initializes this formula
     * @constructor
     * @param statements - Initial array of statements
     * @param opts - Options for the formula
     */
    constructor(statements?: Quad[], opts?: FormulaOpts);
    /**
     * Gets the URI of this formula
     */
    get uri(): string;
    /**
     * Sets the URI of this formula
     */
    set uri(uri: string);
    /**
     * Add a statement to this formula
     * @param subject - The subject of the statement
     * @param predicate - The predicate of the statement
     * @param object - The object of the statement
     * @param graph - The graph (optional)
     * @returns The added statement
     */
    add(subject: Quad_Subject | Quad | Quad[], predicate?: Quad_Predicate, object?: Quad_Object, graph?: Quad_Graph): Statement | null | this | number;
    /**
     * Remove a statement from this formula
     */
    remove(st: Quad): this;
    /**
     * Remove all statements matching a pattern
     */
    removeMatches(subject?: Quad_Subject | null, predicate?: Quad_Predicate | null, object?: Quad_Object | null, graph?: Quad_Graph | null): this;
    /**
     * Check if formula holds a specific statement
     */
    holds(subject: Quad_Subject, predicate: Quad_Predicate, object: Quad_Object, graph?: Quad_Graph): boolean;
    /**
     * Match statements in the formula
     */
    match(subject?: Quad_Subject | null, predicate?: Quad_Predicate | null, object?: Quad_Object | null, graph?: Quad_Graph | null): Quad[];
    /**
     * Returns the number of statements
     */
    get length(): number;
    /**
     * Create a NamedNode from a URI string
     */
    sym(uri: string): RDFlibNamedNode;
    /**
     * Create a literal
     */
    literal(value: string, languageOrDatatype?: string | NamedNode): any;
    /**
     * Create a blank node
     */
    bnode(id?: string): BlankNode;
    /**
     * Create a variable
     */
    variable(name: string): Variable;
    /**
     * Create a collection
     */
    collection(elements?: Term[]): Collection;
}
