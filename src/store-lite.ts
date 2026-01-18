/**
 * Lightweight Store (IndexedFormula) without query or serialization
 *
 * This is a minimal RDF store that supports basic CRUD operations
 * on triples/quads without the heavy query engine or serializers.
 *
 * @module store-lite
 */

import ClassOrder from './class-order'
import { defaultGraphURI } from './factories/canonical-data-factory'
import FormulaLite, { FormulaOpts } from './formula-lite'
import { ArrayIndexOf } from './utils'
import {
  isRDFlibSubject,
  isRDFlibPredicate,
  isRDFlibObject,
  isStore,
  isGraph,
  isQuad,
} from './utils/terms'
import Node from './node'
import Variable from './variable'
import {
  Bindings, BlankNodeTermType, CollectionTermType, DefaultGraphTermType,
  EmptyTermType, GraphTermType, LiteralTermType, NamedNodeTermType, VariableTermType
} from './types'
import Statement from './statement'
import { Indexable } from './factories/factory-types'
import NamedNode from './named-node'
import {
  Quad_Graph,
  Literal as TFLiteral,
  NamedNode as TFNamedNode,
  Quad_Object,
  Quad_Predicate,
  Quad,
  Quad_Subject,
  Term,
} from './tf-types'
import BlankNode from './blank-node'
import DefaultGraph from './default-graph'
import Empty from './empty'
import Literal from './literal'
import Collection from './collection'

const owlNamespaceURI = 'http://www.w3.org/2002/07/owl#'

type FeaturesType = Quad[] | FormulaOpts

/**
 * Lightweight indexed formula store
 */
export default class StoreLite extends FormulaLite {
  /**
   * An array of statements in the store
   */
  statements: Quad[]

  /**
   * Map of namespace prefixes to URIs
   */
  namespaces: { [prefix: string]: string } = {}

  /**
   * Index by subject
   */
  subjectIndex: { [key: string]: Quad[] } = {}

  /**
   * Index by predicate
   */
  predicateIndex: { [key: string]: Quad[] } = {}

  /**
   * Index by object
   */
  objectIndex: { [key: string]: Quad[] } = {}

  /**
   * Index by graph/why
   */
  whyIndex: { [key: string]: Quad[] } = {}

  constructor (features?: FeaturesType) {
    super(undefined, features as FormulaOpts)
    this.statements = []
    this._initIndexes()
  }

  private _initIndexes() {
    this.subjectIndex = {}
    this.predicateIndex = {}
    this.objectIndex = {}
    this.whyIndex = {}
  }

  private _getIndexKey(term: Term): string {
    if (!term) return ''
    return term.termType + ':' + term.value
  }

  private _addToIndex(index: { [key: string]: Quad[] }, key: string, st: Quad) {
    if (!index[key]) {
      index[key] = []
    }
    index[key].push(st)
  }

  private _removeFromIndex(index: { [key: string]: Quad[] }, key: string, st: Quad) {
    if (index[key]) {
      const idx = index[key].indexOf(st)
      if (idx !== -1) {
        index[key].splice(idx, 1)
      }
    }
  }

  /**
   * Add a statement to the store
   */
  add (
    subject: Quad_Subject | Quad | Quad[],
    predicate?: Quad_Predicate,
    object?: Quad_Object,
    graph?: Quad_Graph
  ): Statement | null | this | number {
    if (arguments.length === 1) {
      if (Array.isArray(subject)) {
        subject.forEach(st => this.add(st))
        return this.statements.length
      }
      if (isQuad(subject)) {
        return this._addStatement(subject as Quad)
      }
    }

    const st = this.rdfFactory.quad(subject, predicate, object, graph || this.rdfFactory.defaultGraph())
    return this._addStatement(st)
  }

  private _addStatement(st: Quad): Statement {
    this.statements.push(st)
    this._addToIndex(this.subjectIndex, this._getIndexKey(st.subject), st)
    this._addToIndex(this.predicateIndex, this._getIndexKey(st.predicate), st)
    this._addToIndex(this.objectIndex, this._getIndexKey(st.object), st)
    this._addToIndex(this.whyIndex, this._getIndexKey(st.graph), st)
    return st as Statement
  }

  /**
   * Remove a statement from the store
   */
  remove (st: Quad): this {
    const index = this.statements.indexOf(st)
    if (index !== -1) {
      this.statements.splice(index, 1)
      this._removeFromIndex(this.subjectIndex, this._getIndexKey(st.subject), st)
      this._removeFromIndex(this.predicateIndex, this._getIndexKey(st.predicate), st)
      this._removeFromIndex(this.objectIndex, this._getIndexKey(st.object), st)
      this._removeFromIndex(this.whyIndex, this._getIndexKey(st.graph), st)
    }
    return this
  }

  /**
   * Remove all statements matching a pattern
   */
  removeMatches (
    subject?: Quad_Subject | null,
    predicate?: Quad_Predicate | null,
    object?: Quad_Object | null,
    graph?: Quad_Graph | null
  ): this {
    const toRemove = this.statementsMatching(subject, predicate, object, graph)
    toRemove.forEach(st => this.remove(st))
    return this
  }

  /**
   * Find statements matching a pattern (alias for match)
   */
  statementsMatching (
    subject?: Quad_Subject | null,
    predicate?: Quad_Predicate | null,
    object?: Quad_Object | null,
    graph?: Quad_Graph | null,
    limit?: number
  ): Quad[] {
    // Use index for most selective term
    let candidates: Quad[] | undefined

    if (subject) {
      candidates = this.subjectIndex[this._getIndexKey(subject)]
    } else if (object) {
      candidates = this.objectIndex[this._getIndexKey(object)]
    } else if (predicate) {
      candidates = this.predicateIndex[this._getIndexKey(predicate)]
    } else if (graph) {
      candidates = this.whyIndex[this._getIndexKey(graph)]
    } else {
      candidates = this.statements
    }

    if (!candidates) return []

    const results: Quad[] = []
    for (const st of candidates) {
      if (
        (!subject || st.subject.equals(subject)) &&
        (!predicate || st.predicate.equals(predicate)) &&
        (!object || st.object.equals(object)) &&
        (!graph || st.graph.equals(graph))
      ) {
        results.push(st)
        if (limit && results.length >= limit) break
      }
    }

    return results
  }

  /**
   * Match statements (RDFJS DatasetCore interface)
   */
  match (
    subject?: Quad_Subject | null,
    predicate?: Quad_Predicate | null,
    object?: Quad_Object | null,
    graph?: Quad_Graph | null
  ): Quad[] {
    return this.statementsMatching(subject, predicate, object, graph)
  }

  /**
   * Check if the store contains any matching statement
   */
  any (
    subject?: Quad_Subject | null,
    predicate?: Quad_Predicate | null,
    object?: Quad_Object | null,
    graph?: Quad_Graph | null
  ): Quad_Subject | Quad_Predicate | Quad_Object | Quad_Graph | undefined {
    const st = this.statementsMatching(subject, predicate, object, graph, 1)[0]
    if (!st) return undefined

    if (!subject) return st.subject
    if (!predicate) return st.predicate
    if (!object) return st.object
    if (!graph) return st.graph
    return st.subject
  }

  /**
   * Check if store holds a statement
   */
  holds (
    subject: Quad_Subject,
    predicate: Quad_Predicate,
    object: Quad_Object,
    graph?: Quad_Graph
  ): boolean {
    return this.statementsMatching(subject, predicate, object, graph, 1).length > 0
  }

  /**
   * Check if store holds a statement (same as holds but returns Quad or undefined)
   */
  holdsStatement (
    subject: Quad_Subject,
    predicate: Quad_Predicate,
    object: Quad_Object,
    graph?: Quad_Graph
  ): Quad | undefined {
    return this.statementsMatching(subject, predicate, object, graph, 1)[0]
  }

  /**
   * Get the number of statements
   */
  get length(): number {
    return this.statements.length
  }

  /**
   * Get the size (alias for length, for RDFJS compatibility)
   */
  get size(): number {
    return this.statements.length
  }

  /**
   * Check if store is empty
   */
  get empty(): boolean {
    return this.statements.length === 0
  }

  /**
   * Each statement in the store
   */
  each (
    subject?: Quad_Subject | null,
    predicate?: Quad_Predicate | null,
    object?: Quad_Object | null,
    graph?: Quad_Graph | null
  ): Term[] {
    const foundStatements = this.statementsMatching(subject, predicate, object, graph)

    if (!subject) {
      return foundStatements.map(st => st.subject)
    } else if (!predicate) {
      return foundStatements.map(st => st.predicate)
    } else if (!object) {
      return foundStatements.map(st => st.object)
    } else if (!graph) {
      return foundStatements.map(st => st.graph)
    }
    return []
  }

  /**
   * Iterate over all statements
   */
  [Symbol.iterator](): Iterator<Quad> {
    return this.statements[Symbol.iterator]()
  }

  /**
   * For each statement
   */
  forEach (callback: (quad: Quad) => void): void {
    this.statements.forEach(callback)
  }

  /**
   * Remove all statements
   */
  removeAll(): this {
    this.statements = []
    this._initIndexes()
    return this
  }

  /**
   * Copy this store
   */
  clone(): StoreLite {
    const copy = new StoreLite()
    copy.namespaces = { ...this.namespaces }
    this.statements.forEach(st => copy.add(st))
    return copy
  }
}
