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

import ClassOrder from './class-order'
import Collection from './collection'
import CanonicalDataFactory from './factories/canonical-data-factory'
import log from './log'
import RDFlibNamedNode from './named-node'
import Namespace from './namespace'
import Node from './node-internal'
import Statement from './statement'
import {
  Bindings,
  GraphTermType,
} from './types'
import { isStatement } from './utils/terms'
import Variable from './variable'
import {
  Indexable,
  TFIDFactoryTypes,
} from './factories/factory-types'
import { appliedFactoryMethods, arrayToStatements } from './utils'
import {
  RdfJsDataFactory,
  Quad_Graph,
  Quad_Object,
  Quad_Predicate,
  Quad,
  Quad_Subject,
  Term,
} from './tf-types'
import BlankNode from './blank-node'
import NamedNode from './named-node'

export interface FormulaOpts {
  dataCallback?: (q: Quad) => void
  dataRemovalCallback?: (q: Quad) => void;
  rdfArrayRemove?: (arr: Quad[], q: Quad) => void
  rdfFactory?: RdfJsDataFactory
}

interface BooleanMap {
  [uri: string]: boolean;
}

interface MembersMap {
  [uri: string]: Quad;
}

interface UriMap {
  [uri: string]: string;
}

/**
 * A lightweight formula (set of RDF statements) without serialization
 */
export default class FormulaLite extends Node {
  termType: typeof GraphTermType = GraphTermType

  classOrder = ClassOrder.Graph

  isVar = 0

  /**
   * A namespace for the specified namespace's URI
   * @param nsuri The URI for the namespace
   */
  ns = Namespace

  /** The factory used to generate statements and terms */
  rdfFactory: any

  /**
   * The stored statements
   */
  statements: Quad[] = []

  /**
   * Initializes this formula
   * @constructor
   * @param statements - Initial array of statements
   * @param opts - Options for the formula
   */
  constructor (statements?: Quad[], opts: FormulaOpts = {}) {
    super('')
    this.statements = statements || []
    this.rdfFactory = opts?.rdfFactory || CanonicalDataFactory
  }

  /**
   * Gets the URI of this formula
   */
  get uri(): string {
    return this.value
  }

  /**
   * Sets the URI of this formula
   */
  set uri(uri: string) {
    this.value = uri
  }

  /**
   * Add a statement to this formula
   * @param subject - The subject of the statement
   * @param predicate - The predicate of the statement
   * @param object - The object of the statement
   * @param graph - The graph (optional)
   * @returns The added statement
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
      if (isStatement(subject)) {
        this.statements.push(subject)
        return subject as Statement
      }
    }

    const st = this.rdfFactory.quad(subject, predicate, object, graph)
    this.statements.push(st)
    return st
  }

  /**
   * Remove a statement from this formula
   */
  remove (st: Quad): this {
    const index = this.statements.indexOf(st)
    if (index !== -1) {
      this.statements.splice(index, 1)
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
    this.statements = this.statements.filter(st => {
      return !(
        (!subject || st.subject.equals(subject)) &&
        (!predicate || st.predicate.equals(predicate)) &&
        (!object || st.object.equals(object)) &&
        (!graph || st.graph.equals(graph))
      )
    })
    return this
  }

  /**
   * Check if formula holds a specific statement
   */
  holds (
    subject: Quad_Subject,
    predicate: Quad_Predicate,
    object: Quad_Object,
    graph?: Quad_Graph
  ): boolean {
    return this.statements.some(st =>
      st.subject.equals(subject) &&
      st.predicate.equals(predicate) &&
      st.object.equals(object) &&
      (!graph || st.graph.equals(graph))
    )
  }

  /**
   * Match statements in the formula
   */
  match (
    subject?: Quad_Subject | null,
    predicate?: Quad_Predicate | null,
    object?: Quad_Object | null,
    graph?: Quad_Graph | null
  ): Quad[] {
    return this.statements.filter(st => {
      return (
        (!subject || st.subject.equals(subject)) &&
        (!predicate || st.predicate.equals(predicate)) &&
        (!object || st.object.equals(object)) &&
        (!graph || st.graph.equals(graph))
      )
    })
  }

  /**
   * Returns the number of statements
   */
  get length(): number {
    return this.statements.length
  }

  /**
   * Create a NamedNode from a URI string
   */
  sym (uri: string): RDFlibNamedNode {
    return new RDFlibNamedNode(uri)
  }

  /**
   * Create a literal
   */
  literal (value: string, languageOrDatatype?: string | NamedNode) {
    return this.rdfFactory.literal(value, languageOrDatatype)
  }

  /**
   * Create a blank node
   */
  bnode (id?: string): BlankNode {
    return this.rdfFactory.blankNode(id)
  }

  /**
   * Create a variable
   */
  variable (name: string): Variable {
    return new Variable(name)
  }

  /**
   * Create a collection
   */
  collection (elements?: Term[]): Collection {
    return new Collection(elements)
  }
}
