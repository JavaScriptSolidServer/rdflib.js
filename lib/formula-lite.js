"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _classOrder = _interopRequireDefault(require("./class-order"));
var _collection = _interopRequireDefault(require("./collection"));
var _canonicalDataFactory = _interopRequireDefault(require("./factories/canonical-data-factory"));
var _namedNode = _interopRequireDefault(require("./named-node"));
var _namespace = _interopRequireDefault(require("./namespace"));
var _nodeInternal = _interopRequireDefault(require("./node-internal"));
var _types = require("./types");
var _terms = require("./utils/terms");
var _variable = _interopRequireDefault(require("./variable"));
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

/**
 * A lightweight formula (set of RDF statements) without serialization
 */
class FormulaLite extends _nodeInternal.default {
  /**
   * Initializes this formula
   * @constructor
   * @param statements - Initial array of statements
   * @param opts - Options for the formula
   */
  constructor(statements, opts = {}) {
    super('');
    (0, _defineProperty2.default)(this, "termType", _types.GraphTermType);
    (0, _defineProperty2.default)(this, "classOrder", _classOrder.default.Graph);
    (0, _defineProperty2.default)(this, "isVar", 0);
    /**
     * A namespace for the specified namespace's URI
     * @param nsuri The URI for the namespace
     */
    (0, _defineProperty2.default)(this, "ns", _namespace.default);
    /** The factory used to generate statements and terms */
    (0, _defineProperty2.default)(this, "rdfFactory", void 0);
    /**
     * The stored statements
     */
    (0, _defineProperty2.default)(this, "statements", []);
    this.statements = statements || [];
    this.rdfFactory = opts?.rdfFactory || _canonicalDataFactory.default;
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
      if ((0, _terms.isStatement)(subject)) {
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
    return new _namedNode.default(uri);
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
    return new _variable.default(name);
  }

  /**
   * Create a collection
   */
  collection(elements) {
    return new _collection.default(elements);
  }
}
exports.default = FormulaLite;