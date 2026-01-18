import _defineProperty from "@babel/runtime/helpers/defineProperty";
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

import ClassOrder from './class-order';
import Collection from './collection';
import CanonicalDataFactory from './factories/canonical-data-factory';
import RDFlibNamedNode from './named-node';
import Namespace from './namespace';
import Node from './node-internal';
import { GraphTermType } from './types';
import { isStatement } from './utils/terms';
import Variable from './variable';
/**
 * A lightweight formula (set of RDF statements) without serialization
 */
export default class FormulaLite extends Node {
  /**
   * Initializes this formula
   * @constructor
   * @param statements - Initial array of statements
   * @param opts - Options for the formula
   */
  constructor(statements, opts = {}) {
    super('');
    _defineProperty(this, "termType", GraphTermType);
    _defineProperty(this, "classOrder", ClassOrder.Graph);
    _defineProperty(this, "isVar", 0);
    /**
     * A namespace for the specified namespace's URI
     * @param nsuri The URI for the namespace
     */
    _defineProperty(this, "ns", Namespace);
    /** The factory used to generate statements and terms */
    _defineProperty(this, "rdfFactory", void 0);
    /**
     * The stored statements
     */
    _defineProperty(this, "statements", []);
    this.statements = statements || [];
    this.rdfFactory = opts?.rdfFactory || CanonicalDataFactory;
  }

  /**
   * Gets the URI of this formula
   */
  get uri() {
    return this.value;
  }

  /**
   * Sets the URI of this formula
   */
  set uri(uri) {
    this.value = uri;
  }

  /**
   * Add a statement to this formula
   * @param subject - The subject of the statement
   * @param predicate - The predicate of the statement
   * @param object - The object of the statement
   * @param graph - The graph (optional)
   * @returns The added statement
   */
  add(subject, predicate, object, graph) {
    if (arguments.length === 1) {
      if (Array.isArray(subject)) {
        subject.forEach(st => this.add(st));
        return this.statements.length;
      }
      if (isStatement(subject)) {
        this.statements.push(subject);
        return subject;
      }
    }
    const st = this.rdfFactory.quad(subject, predicate, object, graph);
    this.statements.push(st);
    return st;
  }

  /**
   * Remove a statement from this formula
   */
  remove(st) {
    const index = this.statements.indexOf(st);
    if (index !== -1) {
      this.statements.splice(index, 1);
    }
    return this;
  }

  /**
   * Remove all statements matching a pattern
   */
  removeMatches(subject, predicate, object, graph) {
    this.statements = this.statements.filter(st => {
      return !((!subject || st.subject.equals(subject)) && (!predicate || st.predicate.equals(predicate)) && (!object || st.object.equals(object)) && (!graph || st.graph.equals(graph)));
    });
    return this;
  }

  /**
   * Check if formula holds a specific statement
   */
  holds(subject, predicate, object, graph) {
    return this.statements.some(st => st.subject.equals(subject) && st.predicate.equals(predicate) && st.object.equals(object) && (!graph || st.graph.equals(graph)));
  }

  /**
   * Match statements in the formula
   */
  match(subject, predicate, object, graph) {
    return this.statements.filter(st => {
      return (!subject || st.subject.equals(subject)) && (!predicate || st.predicate.equals(predicate)) && (!object || st.object.equals(object)) && (!graph || st.graph.equals(graph));
    });
  }

  /**
   * Returns the number of statements
   */
  get length() {
    return this.statements.length;
  }

  /**
   * Create a NamedNode from a URI string
   */
  sym(uri) {
    return new RDFlibNamedNode(uri);
  }

  /**
   * Create a literal
   */
  literal(value, languageOrDatatype) {
    return this.rdfFactory.literal(value, languageOrDatatype);
  }

  /**
   * Create a blank node
   */
  bnode(id) {
    return this.rdfFactory.blankNode(id);
  }

  /**
   * Create a variable
   */
  variable(name) {
    return new Variable(name);
  }

  /**
   * Create a collection
   */
  collection(elements) {
    return new Collection(elements);
  }
}