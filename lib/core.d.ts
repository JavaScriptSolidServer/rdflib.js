/**
 * Core RDF primitives - no network dependencies, no heavy parsers
 *
 * This module provides the essential RDF data structures without
 * pulling in Fetcher, UpdateManager, serializers, or format-specific parsers.
 *
 * Bundle size: ~30KB minified (vs ~600KB for full rdflib)
 *
 * @example
 * import { Store, NamedNode, Literal } from 'rdflib/core'
 *
 * const store = new Store()
 * const subject = new NamedNode('http://example.org/subject')
 * const predicate = new NamedNode('http://example.org/predicate')
 * const object = new Literal('value')
 * store.add(subject, predicate, object)
 *
 * @module core
 */
import BlankNode from './blank-node';
import Collection from './collection';
import Empty from './empty';
import Literal from './literal';
import NamedNode from './named-node';
import Namespace from './namespace';
import Node from './node';
import Statement from './statement';
import Variable from './variable';
import Formula from './formula-lite';
import Store from './store-lite';
import * as uri from './uri';
import CanonicalDataFactory from './factories/canonical-data-factory';
declare const graph: () => Store;
declare const lit: (value: string, lang?: string) => Literal;
declare const st: (s: any, p: any, o: any, g?: any) => Statement<import("./types").SubjectType, import("./types").PredicateType, import("./types").ObjectType, import("./types").GraphType>;
declare const namedNode: (uri: string) => NamedNode;
declare const variable: (name: string) => Variable;
declare const blankNode: (id?: string) => BlankNode;
declare const defaultGraph: () => import("./default-graph").default;
declare const literal: (value: string, langOrDt?: string | NamedNode) => Literal;
declare const quad: (s: any, p: any, o: any, g?: any) => Statement<import("./types").SubjectType, import("./types").PredicateType, import("./types").ObjectType, import("./types").GraphType>;
declare const triple: (s: any, p: any, o: any) => Statement<import("./types").SubjectType, import("./types").PredicateType, import("./types").ObjectType, import("./types").GraphType>;
declare const term: <T extends import("./types").FromValueReturns>(value: import("./types").ValueType) => T;
declare const NextId: number;
export * from './utils/terms';
export { termValue } from './utils/termValue';
export { BlankNode, Collection, Empty, Formula, Literal, NamedNode, Namespace, Node, Statement, Store, Variable, CanonicalDataFactory, CanonicalDataFactory as DataFactory, uri, term, NextId, Store as IndexedFormula, graph, lit, st, namedNode, blankNode, defaultGraph, literal, quad, triple, variable, namedNode as sym, };
