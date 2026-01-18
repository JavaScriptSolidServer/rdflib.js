import _defineProperty from "@babel/runtime/helpers/defineProperty";
/**
 * Lightweight Store (IndexedFormula) without query or serialization
 *
 * This is a minimal RDF store that supports basic CRUD operations
 * on triples/quads without the heavy query engine or serializers.
 *
 * @module store-lite
 */

import FormulaLite from './formula-lite';
import { isQuad } from './utils/terms';
/**
 * Lightweight indexed formula store
 */
export default class StoreLite extends FormulaLite {
  constructor(features) {
    super(undefined, features);
    /**
     * An array of statements in the store
     */
    _defineProperty(this, "statements", void 0);
    /**
     * Map of namespace prefixes to URIs
     */
    _defineProperty(this, "namespaces", {});
    /**
     * Index by subject
     */
    _defineProperty(this, "subjectIndex", {});
    /**
     * Index by predicate
     */
    _defineProperty(this, "predicateIndex", {});
    /**
     * Index by object
     */
    _defineProperty(this, "objectIndex", {});
    /**
     * Index by graph/why
     */
    _defineProperty(this, "whyIndex", {});
    this.statements = [];
    this._initIndexes();
  }
  _initIndexes() {
    this.subjectIndex = {};
    this.predicateIndex = {};
    this.objectIndex = {};
    this.whyIndex = {};
  }
  _getIndexKey(term) {
    if (!term) return '';
    return term.termType + ':' + term.value;
  }
  _addToIndex(index, key, st) {
    if (!index[key]) {
      index[key] = [];
    }
    index[key].push(st);
  }
  _removeFromIndex(index, key, st) {
    if (index[key]) {
      const idx = index[key].indexOf(st);
      if (idx !== -1) {
        index[key].splice(idx, 1);
      }
    }
  }

  /**
   * Add a statement to the store
   */
  add(subject, predicate, object, graph) {
    if (arguments.length === 1) {
      if (Array.isArray(subject)) {
        subject.forEach(st => this.add(st));
        return this.statements.length;
      }
      if (isQuad(subject)) {
        return this._addStatement(subject);
      }
    }
    const st = this.rdfFactory.quad(subject, predicate, object, graph || this.rdfFactory.defaultGraph());
    return this._addStatement(st);
  }
  _addStatement(st) {
    this.statements.push(st);
    this._addToIndex(this.subjectIndex, this._getIndexKey(st.subject), st);
    this._addToIndex(this.predicateIndex, this._getIndexKey(st.predicate), st);
    this._addToIndex(this.objectIndex, this._getIndexKey(st.object), st);
    this._addToIndex(this.whyIndex, this._getIndexKey(st.graph), st);
    return st;
  }

  /**
   * Remove a statement from the store
   */
  remove(st) {
    const index = this.statements.indexOf(st);
    if (index !== -1) {
      this.statements.splice(index, 1);
      this._removeFromIndex(this.subjectIndex, this._getIndexKey(st.subject), st);
      this._removeFromIndex(this.predicateIndex, this._getIndexKey(st.predicate), st);
      this._removeFromIndex(this.objectIndex, this._getIndexKey(st.object), st);
      this._removeFromIndex(this.whyIndex, this._getIndexKey(st.graph), st);
    }
    return this;
  }

  /**
   * Remove all statements matching a pattern
   */
  removeMatches(subject, predicate, object, graph) {
    const toRemove = this.statementsMatching(subject, predicate, object, graph);
    toRemove.forEach(st => this.remove(st));
    return this;
  }

  /**
   * Find statements matching a pattern (alias for match)
   */
  statementsMatching(subject, predicate, object, graph, limit) {
    // Use index for most selective term
    let candidates;
    if (subject) {
      candidates = this.subjectIndex[this._getIndexKey(subject)];
    } else if (object) {
      candidates = this.objectIndex[this._getIndexKey(object)];
    } else if (predicate) {
      candidates = this.predicateIndex[this._getIndexKey(predicate)];
    } else if (graph) {
      candidates = this.whyIndex[this._getIndexKey(graph)];
    } else {
      candidates = this.statements;
    }
    if (!candidates) return [];
    const results = [];
    for (const st of candidates) {
      if ((!subject || st.subject.equals(subject)) && (!predicate || st.predicate.equals(predicate)) && (!object || st.object.equals(object)) && (!graph || st.graph.equals(graph))) {
        results.push(st);
        if (limit && results.length >= limit) break;
      }
    }
    return results;
  }

  /**
   * Match statements (RDFJS DatasetCore interface)
   */
  match(subject, predicate, object, graph) {
    return this.statementsMatching(subject, predicate, object, graph);
  }

  /**
   * Check if the store contains any matching statement
   */
  any(subject, predicate, object, graph) {
    const st = this.statementsMatching(subject, predicate, object, graph, 1)[0];
    if (!st) return undefined;
    if (!subject) return st.subject;
    if (!predicate) return st.predicate;
    if (!object) return st.object;
    if (!graph) return st.graph;
    return st.subject;
  }

  /**
   * Check if store holds a statement
   */
  holds(subject, predicate, object, graph) {
    return this.statementsMatching(subject, predicate, object, graph, 1).length > 0;
  }

  /**
   * Check if store holds a statement (same as holds but returns Quad or undefined)
   */
  holdsStatement(subject, predicate, object, graph) {
    return this.statementsMatching(subject, predicate, object, graph, 1)[0];
  }

  /**
   * Get the number of statements
   */
  get length() {
    return this.statements.length;
  }

  /**
   * Get the size (alias for length, for RDFJS compatibility)
   */
  get size() {
    return this.statements.length;
  }

  /**
   * Check if store is empty
   */
  get empty() {
    return this.statements.length === 0;
  }

  /**
   * Each statement in the store
   */
  each(subject, predicate, object, graph) {
    const foundStatements = this.statementsMatching(subject, predicate, object, graph);
    if (!subject) {
      return foundStatements.map(st => st.subject);
    } else if (!predicate) {
      return foundStatements.map(st => st.predicate);
    } else if (!object) {
      return foundStatements.map(st => st.object);
    } else if (!graph) {
      return foundStatements.map(st => st.graph);
    }
    return [];
  }

  /**
   * Iterate over all statements
   */
  [Symbol.iterator]() {
    return this.statements[Symbol.iterator]();
  }

  /**
   * For each statement
   */
  forEach(callback) {
    this.statements.forEach(callback);
  }

  /**
   * Remove all statements
   */
  removeAll() {
    this.statements = [];
    this._initIndexes();
    return this;
  }

  /**
   * Copy this store
   */
  clone() {
    const copy = new StoreLite();
    copy.namespaces = {
      ...this.namespaces
    };
    this.statements.forEach(st => copy.add(st));
    return copy;
  }
}