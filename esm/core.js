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

// Create factory functions using CanonicalDataFactory
const graph = () => new Store();
const lit = (value, lang) => CanonicalDataFactory.literal(value, lang);
const st = (s, p, o, g) => CanonicalDataFactory.quad(s, p, o, g);
const namedNode = uri => CanonicalDataFactory.namedNode(uri);
const variable = name => new Variable(name);
const blankNode = id => CanonicalDataFactory.blankNode(id);
const defaultGraph = () => CanonicalDataFactory.defaultGraph();
const literal = (value, langOrDt) => CanonicalDataFactory.literal(value, langOrDt);
const quad = (s, p, o, g) => CanonicalDataFactory.quad(s, p, o, g);
const triple = (s, p, o) => CanonicalDataFactory.quad(s, p, o);
const term = Node.fromValue;
const NextId = BlankNode.nextId;
export * from './utils/terms';
export { termValue } from './utils/termValue';
export {
// Core classes
BlankNode, Collection, Empty, Formula, Literal, NamedNode, Namespace, Node, Statement, Store, Variable,
// Factories
CanonicalDataFactory, CanonicalDataFactory as DataFactory,
// Utilities
uri, term, NextId,
// Alias
Store as IndexedFormula,
// RDFJS DataFactory interface
graph, lit, st, namedNode, blankNode, defaultGraph, literal, quad, triple, variable, namedNode as sym };