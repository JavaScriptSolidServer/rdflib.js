"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  term: true,
  NextId: true,
  graph: true,
  lit: true,
  st: true,
  namedNode: true,
  sym: true,
  blankNode: true,
  defaultGraph: true,
  literal: true,
  quad: true,
  triple: true,
  variable: true,
  BlankNode: true,
  Collection: true,
  Empty: true,
  Literal: true,
  NamedNode: true,
  Namespace: true,
  Node: true,
  Statement: true,
  Variable: true,
  Formula: true,
  Store: true,
  IndexedFormula: true,
  uri: true,
  CanonicalDataFactory: true,
  DataFactory: true,
  termValue: true
};
Object.defineProperty(exports, "BlankNode", {
  enumerable: true,
  get: function () {
    return _blankNode.default;
  }
});
Object.defineProperty(exports, "CanonicalDataFactory", {
  enumerable: true,
  get: function () {
    return _canonicalDataFactory.default;
  }
});
Object.defineProperty(exports, "Collection", {
  enumerable: true,
  get: function () {
    return _collection.default;
  }
});
Object.defineProperty(exports, "DataFactory", {
  enumerable: true,
  get: function () {
    return _canonicalDataFactory.default;
  }
});
Object.defineProperty(exports, "Empty", {
  enumerable: true,
  get: function () {
    return _empty.default;
  }
});
Object.defineProperty(exports, "Formula", {
  enumerable: true,
  get: function () {
    return _formulaLite.default;
  }
});
Object.defineProperty(exports, "IndexedFormula", {
  enumerable: true,
  get: function () {
    return _storeLite.default;
  }
});
Object.defineProperty(exports, "Literal", {
  enumerable: true,
  get: function () {
    return _literal.default;
  }
});
Object.defineProperty(exports, "NamedNode", {
  enumerable: true,
  get: function () {
    return _namedNode.default;
  }
});
Object.defineProperty(exports, "Namespace", {
  enumerable: true,
  get: function () {
    return _namespace.default;
  }
});
exports.NextId = void 0;
Object.defineProperty(exports, "Node", {
  enumerable: true,
  get: function () {
    return _node.default;
  }
});
Object.defineProperty(exports, "Statement", {
  enumerable: true,
  get: function () {
    return _statement.default;
  }
});
Object.defineProperty(exports, "Store", {
  enumerable: true,
  get: function () {
    return _storeLite.default;
  }
});
Object.defineProperty(exports, "Variable", {
  enumerable: true,
  get: function () {
    return _variable.default;
  }
});
exports.term = exports.sym = exports.st = exports.quad = exports.namedNode = exports.literal = exports.lit = exports.graph = exports.defaultGraph = exports.blankNode = void 0;
Object.defineProperty(exports, "termValue", {
  enumerable: true,
  get: function () {
    return _termValue.termValue;
  }
});
exports.variable = exports.uri = exports.triple = void 0;
var _blankNode = _interopRequireDefault(require("./blank-node"));
var _collection = _interopRequireDefault(require("./collection"));
var _empty = _interopRequireDefault(require("./empty"));
var _literal = _interopRequireDefault(require("./literal"));
var _namedNode = _interopRequireDefault(require("./named-node"));
var _namespace = _interopRequireDefault(require("./namespace"));
var _node = _interopRequireDefault(require("./node"));
var _statement = _interopRequireDefault(require("./statement"));
var _variable = _interopRequireDefault(require("./variable"));
var _formulaLite = _interopRequireDefault(require("./formula-lite"));
var _storeLite = _interopRequireDefault(require("./store-lite"));
var uri = _interopRequireWildcard(require("./uri"));
exports.uri = uri;
var _canonicalDataFactory = _interopRequireDefault(require("./factories/canonical-data-factory"));
var _terms = require("./utils/terms");
Object.keys(_terms).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _terms[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _terms[key];
    }
  });
});
var _termValue = require("./utils/termValue");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
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

// Create factory functions using CanonicalDataFactory
const graph = () => new _storeLite.default();
exports.graph = graph;
const lit = (value, lang) => _canonicalDataFactory.default.literal(value, lang);
exports.lit = lit;
const st = (s, p, o, g) => _canonicalDataFactory.default.quad(s, p, o, g);
exports.st = st;
const namedNode = uri => _canonicalDataFactory.default.namedNode(uri);
exports.sym = exports.namedNode = namedNode;
const variable = name => new _variable.default(name);
exports.variable = variable;
const blankNode = id => _canonicalDataFactory.default.blankNode(id);
exports.blankNode = blankNode;
const defaultGraph = () => _canonicalDataFactory.default.defaultGraph();
exports.defaultGraph = defaultGraph;
const literal = (value, langOrDt) => _canonicalDataFactory.default.literal(value, langOrDt);
exports.literal = literal;
const quad = (s, p, o, g) => _canonicalDataFactory.default.quad(s, p, o, g);
exports.quad = quad;
const triple = (s, p, o) => _canonicalDataFactory.default.quad(s, p, o);
exports.triple = triple;
const term = exports.term = _node.default.fromValue;
const NextId = exports.NextId = _blankNode.default.nextId;