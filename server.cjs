var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/braintree/package.json
var require_package = __commonJS({
  "node_modules/braintree/package.json"(exports2, module2) {
    module2.exports = {
      name: "braintree",
      version: "3.29.0",
      description: "A library for server-side integrating with Braintree.",
      keywords: [
        "braintree",
        "payments"
      ],
      homepage: "https://github.com/braintree/braintree_node",
      author: "Braintree <code@braintreepayments.com> (https://www.braintreepayments.com)",
      main: "index",
      directories: {
        lib: "./lib"
      },
      repository: {
        type: "git",
        url: "https://github.com/braintree/braintree_node.git"
      },
      engines: {
        node: ">=10.0",
        npm: ">=6"
      },
      dependencies: {
        "@braintree/wrap-promise": "2.1.0",
        dateformat: "4.5.1",
        xml2js: "0.5.0"
      },
      devDependencies: {
        chai: "^4.3.4",
        eslint: "^7.26.0",
        "eslint-config-braintree": "^4.0.0",
        "eslint-config-prettier": "^8.5.0",
        mocha: "^8.4.0",
        "mocha-junit-reporter": "^2.1.0",
        prettier: "^2.7.1",
        sinon: "^10.0.0"
      },
      license: "MIT",
      scripts: {
        prettier: "prettier --write .",
        prelint: "prettier --check .",
        lint: "eslint lib/ test/",
        pretest: "npm run lint",
        "test:unit": "mocha test/unit --recursive -r test/spec_helper",
        "test:unit:report": "mocha test/unit --recursive -r test/spec_helper --reporter mocha-junit-reporter  --reporter-options mochaFile=tmp/build/unit_test_results.junit.xml",
        "test:integration": "mocha --timeout 60000 --slow 2000 test/integration --recursive -r test/spec_helper",
        "test:integration:report": "mocha --timeout 60000 --slow 2000 test/integration --recursive -r test/spec_helper --reporter mocha-junit-reporter  --reporter-options mochaFile=tmp/build/integration_test_results.junit.xml",
        test: "npm run test:unit"
      }
    };
  }
});

// node_modules/braintree/lib/braintree/environment.js
var require_environment = __commonJS({
  "node_modules/braintree/lib/braintree/environment.js"(exports2, module2) {
    "use strict";
    var Environment = class _Environment {
      static initClass() {
        const DEVELOPMENT_PORT = process.env.GATEWAY_PORT || "3000";
        const DEVELOPMENT_HOST = process.env.GATEWAY_HOST || "localhost";
        const DEVELOPMENT_SSL = process.env.GATEWAY_SSL === "true" || false;
        this.Development = new _Environment(
          DEVELOPMENT_HOST,
          DEVELOPMENT_PORT,
          "http://auth.venmo.dev:9292",
          DEVELOPMENT_SSL,
          "graphql.bt.local",
          8080
        );
        this.Qa = new _Environment(
          "gateway.qa.braintreepayments.com",
          "443",
          "https://auth.venmo.qa2.braintreegateway.com",
          true,
          "payments-qa.dev.braintree-api.com",
          "443"
        );
        this.Sandbox = new _Environment(
          "api.sandbox.braintreegateway.com",
          "443",
          "https://auth.sandbox.venmo.com",
          true,
          "payments.sandbox.braintree-api.com",
          "443"
        );
        this.Production = new _Environment(
          "api.braintreegateway.com",
          "443",
          "https://auth.venmo.com",
          true,
          "payments.braintree-api.com",
          "443"
        );
      }
      constructor(server, port, authUrl, ssl, graphQLServer, graphQLPort) {
        this.server = server;
        this.port = port;
        this.authUrl = authUrl;
        this.ssl = ssl;
        this.graphQLServer = graphQLServer;
        this.graphQLPort = graphQLPort;
      }
      baseUrl() {
        let url = this.uriScheme() + this.server;
        if (this === _Environment.Development) {
          url += `:${this.port}`;
        }
        return url;
      }
      baseGraphQLUrl() {
        let url = this.uriScheme() + this.graphQLServer;
        if (this === _Environment.Development) {
          url += `:${this.graphQLPort}`;
        }
        url += "/graphql";
        return url;
      }
      uriScheme() {
        return this.ssl ? "https://" : "http://";
      }
    };
    Environment.initClass();
    module2.exports = { Environment };
  }
});

// node_modules/xml2js/lib/defaults.js
var require_defaults = __commonJS({
  "node_modules/xml2js/lib/defaults.js"(exports2) {
    (function() {
      exports2.defaults = {
        "0.1": {
          explicitCharkey: false,
          trim: true,
          normalize: true,
          normalizeTags: false,
          attrkey: "@",
          charkey: "#",
          explicitArray: false,
          ignoreAttrs: false,
          mergeAttrs: false,
          explicitRoot: false,
          validator: null,
          xmlns: false,
          explicitChildren: false,
          childkey: "@@",
          charsAsChildren: false,
          includeWhiteChars: false,
          async: false,
          strict: true,
          attrNameProcessors: null,
          attrValueProcessors: null,
          tagNameProcessors: null,
          valueProcessors: null,
          emptyTag: ""
        },
        "0.2": {
          explicitCharkey: false,
          trim: false,
          normalize: false,
          normalizeTags: false,
          attrkey: "$",
          charkey: "_",
          explicitArray: true,
          ignoreAttrs: false,
          mergeAttrs: false,
          explicitRoot: true,
          validator: null,
          xmlns: false,
          explicitChildren: false,
          preserveChildrenOrder: false,
          childkey: "$$",
          charsAsChildren: false,
          includeWhiteChars: false,
          async: false,
          strict: true,
          attrNameProcessors: null,
          attrValueProcessors: null,
          tagNameProcessors: null,
          valueProcessors: null,
          rootName: "root",
          xmldec: {
            "version": "1.0",
            "encoding": "UTF-8",
            "standalone": true
          },
          doctype: null,
          renderOpts: {
            "pretty": true,
            "indent": "  ",
            "newline": "\n"
          },
          headless: false,
          chunkSize: 1e4,
          emptyTag: "",
          cdata: false
        }
      };
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/Utility.js
var require_Utility = __commonJS({
  "node_modules/xmlbuilder/lib/Utility.js"(exports2, module2) {
    (function() {
      var assign, getValue, isArray, isEmpty, isFunction, isObject, isPlainObject, slice = [].slice, hasProp = {}.hasOwnProperty;
      assign = function() {
        var i, key, len, source, sources, target;
        target = arguments[0], sources = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        if (isFunction(Object.assign)) {
          Object.assign.apply(null, arguments);
        } else {
          for (i = 0, len = sources.length; i < len; i++) {
            source = sources[i];
            if (source != null) {
              for (key in source) {
                if (!hasProp.call(source, key)) continue;
                target[key] = source[key];
              }
            }
          }
        }
        return target;
      };
      isFunction = function(val) {
        return !!val && Object.prototype.toString.call(val) === "[object Function]";
      };
      isObject = function(val) {
        var ref;
        return !!val && ((ref = typeof val) === "function" || ref === "object");
      };
      isArray = function(val) {
        if (isFunction(Array.isArray)) {
          return Array.isArray(val);
        } else {
          return Object.prototype.toString.call(val) === "[object Array]";
        }
      };
      isEmpty = function(val) {
        var key;
        if (isArray(val)) {
          return !val.length;
        } else {
          for (key in val) {
            if (!hasProp.call(val, key)) continue;
            return false;
          }
          return true;
        }
      };
      isPlainObject = function(val) {
        var ctor, proto;
        return isObject(val) && (proto = Object.getPrototypeOf(val)) && (ctor = proto.constructor) && typeof ctor === "function" && ctor instanceof ctor && Function.prototype.toString.call(ctor) === Function.prototype.toString.call(Object);
      };
      getValue = function(obj) {
        if (isFunction(obj.valueOf)) {
          return obj.valueOf();
        } else {
          return obj;
        }
      };
      module2.exports.assign = assign;
      module2.exports.isFunction = isFunction;
      module2.exports.isObject = isObject;
      module2.exports.isArray = isArray;
      module2.exports.isEmpty = isEmpty;
      module2.exports.isPlainObject = isPlainObject;
      module2.exports.getValue = getValue;
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDOMImplementation.js
var require_XMLDOMImplementation = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDOMImplementation.js"(exports2, module2) {
    (function() {
      var XMLDOMImplementation;
      module2.exports = XMLDOMImplementation = function() {
        function XMLDOMImplementation2() {
        }
        XMLDOMImplementation2.prototype.hasFeature = function(feature, version) {
          return true;
        };
        XMLDOMImplementation2.prototype.createDocumentType = function(qualifiedName, publicId, systemId) {
          throw new Error("This DOM method is not implemented.");
        };
        XMLDOMImplementation2.prototype.createDocument = function(namespaceURI, qualifiedName, doctype) {
          throw new Error("This DOM method is not implemented.");
        };
        XMLDOMImplementation2.prototype.createHTMLDocument = function(title) {
          throw new Error("This DOM method is not implemented.");
        };
        XMLDOMImplementation2.prototype.getFeature = function(feature, version) {
          throw new Error("This DOM method is not implemented.");
        };
        return XMLDOMImplementation2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDOMErrorHandler.js
var require_XMLDOMErrorHandler = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDOMErrorHandler.js"(exports2, module2) {
    (function() {
      var XMLDOMErrorHandler;
      module2.exports = XMLDOMErrorHandler = function() {
        function XMLDOMErrorHandler2() {
        }
        XMLDOMErrorHandler2.prototype.handleError = function(error) {
          throw new Error(error);
        };
        return XMLDOMErrorHandler2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDOMStringList.js
var require_XMLDOMStringList = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDOMStringList.js"(exports2, module2) {
    (function() {
      var XMLDOMStringList;
      module2.exports = XMLDOMStringList = function() {
        function XMLDOMStringList2(arr) {
          this.arr = arr || [];
        }
        Object.defineProperty(XMLDOMStringList2.prototype, "length", {
          get: function() {
            return this.arr.length;
          }
        });
        XMLDOMStringList2.prototype.item = function(index) {
          return this.arr[index] || null;
        };
        XMLDOMStringList2.prototype.contains = function(str) {
          return this.arr.indexOf(str) !== -1;
        };
        return XMLDOMStringList2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDOMConfiguration.js
var require_XMLDOMConfiguration = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDOMConfiguration.js"(exports2, module2) {
    (function() {
      var XMLDOMConfiguration, XMLDOMErrorHandler, XMLDOMStringList;
      XMLDOMErrorHandler = require_XMLDOMErrorHandler();
      XMLDOMStringList = require_XMLDOMStringList();
      module2.exports = XMLDOMConfiguration = function() {
        function XMLDOMConfiguration2() {
          var clonedSelf;
          this.defaultParams = {
            "canonical-form": false,
            "cdata-sections": false,
            "comments": false,
            "datatype-normalization": false,
            "element-content-whitespace": true,
            "entities": true,
            "error-handler": new XMLDOMErrorHandler(),
            "infoset": true,
            "validate-if-schema": false,
            "namespaces": true,
            "namespace-declarations": true,
            "normalize-characters": false,
            "schema-location": "",
            "schema-type": "",
            "split-cdata-sections": true,
            "validate": false,
            "well-formed": true
          };
          this.params = clonedSelf = Object.create(this.defaultParams);
        }
        Object.defineProperty(XMLDOMConfiguration2.prototype, "parameterNames", {
          get: function() {
            return new XMLDOMStringList(Object.keys(this.defaultParams));
          }
        });
        XMLDOMConfiguration2.prototype.getParameter = function(name) {
          if (this.params.hasOwnProperty(name)) {
            return this.params[name];
          } else {
            return null;
          }
        };
        XMLDOMConfiguration2.prototype.canSetParameter = function(name, value) {
          return true;
        };
        XMLDOMConfiguration2.prototype.setParameter = function(name, value) {
          if (value != null) {
            return this.params[name] = value;
          } else {
            return delete this.params[name];
          }
        };
        return XMLDOMConfiguration2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/NodeType.js
var require_NodeType = __commonJS({
  "node_modules/xmlbuilder/lib/NodeType.js"(exports2, module2) {
    (function() {
      module2.exports = {
        Element: 1,
        Attribute: 2,
        Text: 3,
        CData: 4,
        EntityReference: 5,
        EntityDeclaration: 6,
        ProcessingInstruction: 7,
        Comment: 8,
        Document: 9,
        DocType: 10,
        DocumentFragment: 11,
        NotationDeclaration: 12,
        Declaration: 201,
        Raw: 202,
        AttributeDeclaration: 203,
        ElementDeclaration: 204,
        Dummy: 205
      };
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLAttribute.js
var require_XMLAttribute = __commonJS({
  "node_modules/xmlbuilder/lib/XMLAttribute.js"(exports2, module2) {
    (function() {
      var NodeType, XMLAttribute, XMLNode;
      NodeType = require_NodeType();
      XMLNode = require_XMLNode();
      module2.exports = XMLAttribute = function() {
        function XMLAttribute2(parent, name, value) {
          this.parent = parent;
          if (this.parent) {
            this.options = this.parent.options;
            this.stringify = this.parent.stringify;
          }
          if (name == null) {
            throw new Error("Missing attribute name. " + this.debugInfo(name));
          }
          this.name = this.stringify.name(name);
          this.value = this.stringify.attValue(value);
          this.type = NodeType.Attribute;
          this.isId = false;
          this.schemaTypeInfo = null;
        }
        Object.defineProperty(XMLAttribute2.prototype, "nodeType", {
          get: function() {
            return this.type;
          }
        });
        Object.defineProperty(XMLAttribute2.prototype, "ownerElement", {
          get: function() {
            return this.parent;
          }
        });
        Object.defineProperty(XMLAttribute2.prototype, "textContent", {
          get: function() {
            return this.value;
          },
          set: function(value) {
            return this.value = value || "";
          }
        });
        Object.defineProperty(XMLAttribute2.prototype, "namespaceURI", {
          get: function() {
            return "";
          }
        });
        Object.defineProperty(XMLAttribute2.prototype, "prefix", {
          get: function() {
            return "";
          }
        });
        Object.defineProperty(XMLAttribute2.prototype, "localName", {
          get: function() {
            return this.name;
          }
        });
        Object.defineProperty(XMLAttribute2.prototype, "specified", {
          get: function() {
            return true;
          }
        });
        XMLAttribute2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLAttribute2.prototype.toString = function(options) {
          return this.options.writer.attribute(this, this.options.writer.filterOptions(options));
        };
        XMLAttribute2.prototype.debugInfo = function(name) {
          name = name || this.name;
          if (name == null) {
            return "parent: <" + this.parent.name + ">";
          } else {
            return "attribute: {" + name + "}, parent: <" + this.parent.name + ">";
          }
        };
        XMLAttribute2.prototype.isEqualNode = function(node) {
          if (node.namespaceURI !== this.namespaceURI) {
            return false;
          }
          if (node.prefix !== this.prefix) {
            return false;
          }
          if (node.localName !== this.localName) {
            return false;
          }
          if (node.value !== this.value) {
            return false;
          }
          return true;
        };
        return XMLAttribute2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLNamedNodeMap.js
var require_XMLNamedNodeMap = __commonJS({
  "node_modules/xmlbuilder/lib/XMLNamedNodeMap.js"(exports2, module2) {
    (function() {
      var XMLNamedNodeMap;
      module2.exports = XMLNamedNodeMap = function() {
        function XMLNamedNodeMap2(nodes) {
          this.nodes = nodes;
        }
        Object.defineProperty(XMLNamedNodeMap2.prototype, "length", {
          get: function() {
            return Object.keys(this.nodes).length || 0;
          }
        });
        XMLNamedNodeMap2.prototype.clone = function() {
          return this.nodes = null;
        };
        XMLNamedNodeMap2.prototype.getNamedItem = function(name) {
          return this.nodes[name];
        };
        XMLNamedNodeMap2.prototype.setNamedItem = function(node) {
          var oldNode;
          oldNode = this.nodes[node.nodeName];
          this.nodes[node.nodeName] = node;
          return oldNode || null;
        };
        XMLNamedNodeMap2.prototype.removeNamedItem = function(name) {
          var oldNode;
          oldNode = this.nodes[name];
          delete this.nodes[name];
          return oldNode || null;
        };
        XMLNamedNodeMap2.prototype.item = function(index) {
          return this.nodes[Object.keys(this.nodes)[index]] || null;
        };
        XMLNamedNodeMap2.prototype.getNamedItemNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented.");
        };
        XMLNamedNodeMap2.prototype.setNamedItemNS = function(node) {
          throw new Error("This DOM method is not implemented.");
        };
        XMLNamedNodeMap2.prototype.removeNamedItemNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented.");
        };
        return XMLNamedNodeMap2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLElement.js
var require_XMLElement = __commonJS({
  "node_modules/xmlbuilder/lib/XMLElement.js"(exports2, module2) {
    (function() {
      var NodeType, XMLAttribute, XMLElement, XMLNamedNodeMap, XMLNode, getValue, isFunction, isObject, ref, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      ref = require_Utility(), isObject = ref.isObject, isFunction = ref.isFunction, getValue = ref.getValue;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      XMLAttribute = require_XMLAttribute();
      XMLNamedNodeMap = require_XMLNamedNodeMap();
      module2.exports = XMLElement = function(superClass) {
        extend(XMLElement2, superClass);
        function XMLElement2(parent, name, attributes) {
          var child, j, len, ref1;
          XMLElement2.__super__.constructor.call(this, parent);
          if (name == null) {
            throw new Error("Missing element name. " + this.debugInfo());
          }
          this.name = this.stringify.name(name);
          this.type = NodeType.Element;
          this.attribs = {};
          this.schemaTypeInfo = null;
          if (attributes != null) {
            this.attribute(attributes);
          }
          if (parent.type === NodeType.Document) {
            this.isRoot = true;
            this.documentObject = parent;
            parent.rootObject = this;
            if (parent.children) {
              ref1 = parent.children;
              for (j = 0, len = ref1.length; j < len; j++) {
                child = ref1[j];
                if (child.type === NodeType.DocType) {
                  child.name = this.name;
                  break;
                }
              }
            }
          }
        }
        Object.defineProperty(XMLElement2.prototype, "tagName", {
          get: function() {
            return this.name;
          }
        });
        Object.defineProperty(XMLElement2.prototype, "namespaceURI", {
          get: function() {
            return "";
          }
        });
        Object.defineProperty(XMLElement2.prototype, "prefix", {
          get: function() {
            return "";
          }
        });
        Object.defineProperty(XMLElement2.prototype, "localName", {
          get: function() {
            return this.name;
          }
        });
        Object.defineProperty(XMLElement2.prototype, "id", {
          get: function() {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        });
        Object.defineProperty(XMLElement2.prototype, "className", {
          get: function() {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        });
        Object.defineProperty(XMLElement2.prototype, "classList", {
          get: function() {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        });
        Object.defineProperty(XMLElement2.prototype, "attributes", {
          get: function() {
            if (!this.attributeMap || !this.attributeMap.nodes) {
              this.attributeMap = new XMLNamedNodeMap(this.attribs);
            }
            return this.attributeMap;
          }
        });
        XMLElement2.prototype.clone = function() {
          var att, attName, clonedSelf, ref1;
          clonedSelf = Object.create(this);
          if (clonedSelf.isRoot) {
            clonedSelf.documentObject = null;
          }
          clonedSelf.attribs = {};
          ref1 = this.attribs;
          for (attName in ref1) {
            if (!hasProp.call(ref1, attName)) continue;
            att = ref1[attName];
            clonedSelf.attribs[attName] = att.clone();
          }
          clonedSelf.children = [];
          this.children.forEach(function(child) {
            var clonedChild;
            clonedChild = child.clone();
            clonedChild.parent = clonedSelf;
            return clonedSelf.children.push(clonedChild);
          });
          return clonedSelf;
        };
        XMLElement2.prototype.attribute = function(name, value) {
          var attName, attValue;
          if (name != null) {
            name = getValue(name);
          }
          if (isObject(name)) {
            for (attName in name) {
              if (!hasProp.call(name, attName)) continue;
              attValue = name[attName];
              this.attribute(attName, attValue);
            }
          } else {
            if (isFunction(value)) {
              value = value.apply();
            }
            if (this.options.keepNullAttributes && value == null) {
              this.attribs[name] = new XMLAttribute(this, name, "");
            } else if (value != null) {
              this.attribs[name] = new XMLAttribute(this, name, value);
            }
          }
          return this;
        };
        XMLElement2.prototype.removeAttribute = function(name) {
          var attName, j, len;
          if (name == null) {
            throw new Error("Missing attribute name. " + this.debugInfo());
          }
          name = getValue(name);
          if (Array.isArray(name)) {
            for (j = 0, len = name.length; j < len; j++) {
              attName = name[j];
              delete this.attribs[attName];
            }
          } else {
            delete this.attribs[name];
          }
          return this;
        };
        XMLElement2.prototype.toString = function(options) {
          return this.options.writer.element(this, this.options.writer.filterOptions(options));
        };
        XMLElement2.prototype.att = function(name, value) {
          return this.attribute(name, value);
        };
        XMLElement2.prototype.a = function(name, value) {
          return this.attribute(name, value);
        };
        XMLElement2.prototype.getAttribute = function(name) {
          if (this.attribs.hasOwnProperty(name)) {
            return this.attribs[name].value;
          } else {
            return null;
          }
        };
        XMLElement2.prototype.setAttribute = function(name, value) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getAttributeNode = function(name) {
          if (this.attribs.hasOwnProperty(name)) {
            return this.attribs[name];
          } else {
            return null;
          }
        };
        XMLElement2.prototype.setAttributeNode = function(newAttr) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.removeAttributeNode = function(oldAttr) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getElementsByTagName = function(name) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getAttributeNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.setAttributeNS = function(namespaceURI, qualifiedName, value) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.removeAttributeNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getAttributeNodeNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.setAttributeNodeNS = function(newAttr) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getElementsByTagNameNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.hasAttribute = function(name) {
          return this.attribs.hasOwnProperty(name);
        };
        XMLElement2.prototype.hasAttributeNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.setIdAttribute = function(name, isId) {
          if (this.attribs.hasOwnProperty(name)) {
            return this.attribs[name].isId;
          } else {
            return isId;
          }
        };
        XMLElement2.prototype.setIdAttributeNS = function(namespaceURI, localName, isId) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.setIdAttributeNode = function(idAttr, isId) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getElementsByTagName = function(tagname) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getElementsByTagNameNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.getElementsByClassName = function(classNames) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLElement2.prototype.isEqualNode = function(node) {
          var i, j, ref1;
          if (!XMLElement2.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
            return false;
          }
          if (node.namespaceURI !== this.namespaceURI) {
            return false;
          }
          if (node.prefix !== this.prefix) {
            return false;
          }
          if (node.localName !== this.localName) {
            return false;
          }
          if (node.attribs.length !== this.attribs.length) {
            return false;
          }
          for (i = j = 0, ref1 = this.attribs.length - 1; 0 <= ref1 ? j <= ref1 : j >= ref1; i = 0 <= ref1 ? ++j : --j) {
            if (!this.attribs[i].isEqualNode(node.attribs[i])) {
              return false;
            }
          }
          return true;
        };
        return XMLElement2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLCharacterData.js
var require_XMLCharacterData = __commonJS({
  "node_modules/xmlbuilder/lib/XMLCharacterData.js"(exports2, module2) {
    (function() {
      var XMLCharacterData, XMLNode, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLNode = require_XMLNode();
      module2.exports = XMLCharacterData = function(superClass) {
        extend(XMLCharacterData2, superClass);
        function XMLCharacterData2(parent) {
          XMLCharacterData2.__super__.constructor.call(this, parent);
          this.value = "";
        }
        Object.defineProperty(XMLCharacterData2.prototype, "data", {
          get: function() {
            return this.value;
          },
          set: function(value) {
            return this.value = value || "";
          }
        });
        Object.defineProperty(XMLCharacterData2.prototype, "length", {
          get: function() {
            return this.value.length;
          }
        });
        Object.defineProperty(XMLCharacterData2.prototype, "textContent", {
          get: function() {
            return this.value;
          },
          set: function(value) {
            return this.value = value || "";
          }
        });
        XMLCharacterData2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLCharacterData2.prototype.substringData = function(offset, count) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLCharacterData2.prototype.appendData = function(arg) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLCharacterData2.prototype.insertData = function(offset, arg) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLCharacterData2.prototype.deleteData = function(offset, count) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLCharacterData2.prototype.replaceData = function(offset, count, arg) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLCharacterData2.prototype.isEqualNode = function(node) {
          if (!XMLCharacterData2.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
            return false;
          }
          if (node.data !== this.data) {
            return false;
          }
          return true;
        };
        return XMLCharacterData2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLCData.js
var require_XMLCData = __commonJS({
  "node_modules/xmlbuilder/lib/XMLCData.js"(exports2, module2) {
    (function() {
      var NodeType, XMLCData, XMLCharacterData, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      NodeType = require_NodeType();
      XMLCharacterData = require_XMLCharacterData();
      module2.exports = XMLCData = function(superClass) {
        extend(XMLCData2, superClass);
        function XMLCData2(parent, text) {
          XMLCData2.__super__.constructor.call(this, parent);
          if (text == null) {
            throw new Error("Missing CDATA text. " + this.debugInfo());
          }
          this.name = "#cdata-section";
          this.type = NodeType.CData;
          this.value = this.stringify.cdata(text);
        }
        XMLCData2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLCData2.prototype.toString = function(options) {
          return this.options.writer.cdata(this, this.options.writer.filterOptions(options));
        };
        return XMLCData2;
      }(XMLCharacterData);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLComment.js
var require_XMLComment = __commonJS({
  "node_modules/xmlbuilder/lib/XMLComment.js"(exports2, module2) {
    (function() {
      var NodeType, XMLCharacterData, XMLComment, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      NodeType = require_NodeType();
      XMLCharacterData = require_XMLCharacterData();
      module2.exports = XMLComment = function(superClass) {
        extend(XMLComment2, superClass);
        function XMLComment2(parent, text) {
          XMLComment2.__super__.constructor.call(this, parent);
          if (text == null) {
            throw new Error("Missing comment text. " + this.debugInfo());
          }
          this.name = "#comment";
          this.type = NodeType.Comment;
          this.value = this.stringify.comment(text);
        }
        XMLComment2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLComment2.prototype.toString = function(options) {
          return this.options.writer.comment(this, this.options.writer.filterOptions(options));
        };
        return XMLComment2;
      }(XMLCharacterData);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDeclaration.js
var require_XMLDeclaration = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDeclaration.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDeclaration, XMLNode, isObject, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      isObject = require_Utility().isObject;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      module2.exports = XMLDeclaration = function(superClass) {
        extend(XMLDeclaration2, superClass);
        function XMLDeclaration2(parent, version, encoding, standalone) {
          var ref;
          XMLDeclaration2.__super__.constructor.call(this, parent);
          if (isObject(version)) {
            ref = version, version = ref.version, encoding = ref.encoding, standalone = ref.standalone;
          }
          if (!version) {
            version = "1.0";
          }
          this.type = NodeType.Declaration;
          this.version = this.stringify.xmlVersion(version);
          if (encoding != null) {
            this.encoding = this.stringify.xmlEncoding(encoding);
          }
          if (standalone != null) {
            this.standalone = this.stringify.xmlStandalone(standalone);
          }
        }
        XMLDeclaration2.prototype.toString = function(options) {
          return this.options.writer.declaration(this, this.options.writer.filterOptions(options));
        };
        return XMLDeclaration2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDTDAttList.js
var require_XMLDTDAttList = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDTDAttList.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDTDAttList, XMLNode, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      module2.exports = XMLDTDAttList = function(superClass) {
        extend(XMLDTDAttList2, superClass);
        function XMLDTDAttList2(parent, elementName, attributeName, attributeType, defaultValueType, defaultValue) {
          XMLDTDAttList2.__super__.constructor.call(this, parent);
          if (elementName == null) {
            throw new Error("Missing DTD element name. " + this.debugInfo());
          }
          if (attributeName == null) {
            throw new Error("Missing DTD attribute name. " + this.debugInfo(elementName));
          }
          if (!attributeType) {
            throw new Error("Missing DTD attribute type. " + this.debugInfo(elementName));
          }
          if (!defaultValueType) {
            throw new Error("Missing DTD attribute default. " + this.debugInfo(elementName));
          }
          if (defaultValueType.indexOf("#") !== 0) {
            defaultValueType = "#" + defaultValueType;
          }
          if (!defaultValueType.match(/^(#REQUIRED|#IMPLIED|#FIXED|#DEFAULT)$/)) {
            throw new Error("Invalid default value type; expected: #REQUIRED, #IMPLIED, #FIXED or #DEFAULT. " + this.debugInfo(elementName));
          }
          if (defaultValue && !defaultValueType.match(/^(#FIXED|#DEFAULT)$/)) {
            throw new Error("Default value only applies to #FIXED or #DEFAULT. " + this.debugInfo(elementName));
          }
          this.elementName = this.stringify.name(elementName);
          this.type = NodeType.AttributeDeclaration;
          this.attributeName = this.stringify.name(attributeName);
          this.attributeType = this.stringify.dtdAttType(attributeType);
          if (defaultValue) {
            this.defaultValue = this.stringify.dtdAttDefault(defaultValue);
          }
          this.defaultValueType = defaultValueType;
        }
        XMLDTDAttList2.prototype.toString = function(options) {
          return this.options.writer.dtdAttList(this, this.options.writer.filterOptions(options));
        };
        return XMLDTDAttList2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDTDEntity.js
var require_XMLDTDEntity = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDTDEntity.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDTDEntity, XMLNode, isObject, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      isObject = require_Utility().isObject;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      module2.exports = XMLDTDEntity = function(superClass) {
        extend(XMLDTDEntity2, superClass);
        function XMLDTDEntity2(parent, pe, name, value) {
          XMLDTDEntity2.__super__.constructor.call(this, parent);
          if (name == null) {
            throw new Error("Missing DTD entity name. " + this.debugInfo(name));
          }
          if (value == null) {
            throw new Error("Missing DTD entity value. " + this.debugInfo(name));
          }
          this.pe = !!pe;
          this.name = this.stringify.name(name);
          this.type = NodeType.EntityDeclaration;
          if (!isObject(value)) {
            this.value = this.stringify.dtdEntityValue(value);
            this.internal = true;
          } else {
            if (!value.pubID && !value.sysID) {
              throw new Error("Public and/or system identifiers are required for an external entity. " + this.debugInfo(name));
            }
            if (value.pubID && !value.sysID) {
              throw new Error("System identifier is required for a public external entity. " + this.debugInfo(name));
            }
            this.internal = false;
            if (value.pubID != null) {
              this.pubID = this.stringify.dtdPubID(value.pubID);
            }
            if (value.sysID != null) {
              this.sysID = this.stringify.dtdSysID(value.sysID);
            }
            if (value.nData != null) {
              this.nData = this.stringify.dtdNData(value.nData);
            }
            if (this.pe && this.nData) {
              throw new Error("Notation declaration is not allowed in a parameter entity. " + this.debugInfo(name));
            }
          }
        }
        Object.defineProperty(XMLDTDEntity2.prototype, "publicId", {
          get: function() {
            return this.pubID;
          }
        });
        Object.defineProperty(XMLDTDEntity2.prototype, "systemId", {
          get: function() {
            return this.sysID;
          }
        });
        Object.defineProperty(XMLDTDEntity2.prototype, "notationName", {
          get: function() {
            return this.nData || null;
          }
        });
        Object.defineProperty(XMLDTDEntity2.prototype, "inputEncoding", {
          get: function() {
            return null;
          }
        });
        Object.defineProperty(XMLDTDEntity2.prototype, "xmlEncoding", {
          get: function() {
            return null;
          }
        });
        Object.defineProperty(XMLDTDEntity2.prototype, "xmlVersion", {
          get: function() {
            return null;
          }
        });
        XMLDTDEntity2.prototype.toString = function(options) {
          return this.options.writer.dtdEntity(this, this.options.writer.filterOptions(options));
        };
        return XMLDTDEntity2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDTDElement.js
var require_XMLDTDElement = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDTDElement.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDTDElement, XMLNode, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      module2.exports = XMLDTDElement = function(superClass) {
        extend(XMLDTDElement2, superClass);
        function XMLDTDElement2(parent, name, value) {
          XMLDTDElement2.__super__.constructor.call(this, parent);
          if (name == null) {
            throw new Error("Missing DTD element name. " + this.debugInfo());
          }
          if (!value) {
            value = "(#PCDATA)";
          }
          if (Array.isArray(value)) {
            value = "(" + value.join(",") + ")";
          }
          this.name = this.stringify.name(name);
          this.type = NodeType.ElementDeclaration;
          this.value = this.stringify.dtdElementValue(value);
        }
        XMLDTDElement2.prototype.toString = function(options) {
          return this.options.writer.dtdElement(this, this.options.writer.filterOptions(options));
        };
        return XMLDTDElement2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDTDNotation.js
var require_XMLDTDNotation = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDTDNotation.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDTDNotation, XMLNode, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      module2.exports = XMLDTDNotation = function(superClass) {
        extend(XMLDTDNotation2, superClass);
        function XMLDTDNotation2(parent, name, value) {
          XMLDTDNotation2.__super__.constructor.call(this, parent);
          if (name == null) {
            throw new Error("Missing DTD notation name. " + this.debugInfo(name));
          }
          if (!value.pubID && !value.sysID) {
            throw new Error("Public or system identifiers are required for an external entity. " + this.debugInfo(name));
          }
          this.name = this.stringify.name(name);
          this.type = NodeType.NotationDeclaration;
          if (value.pubID != null) {
            this.pubID = this.stringify.dtdPubID(value.pubID);
          }
          if (value.sysID != null) {
            this.sysID = this.stringify.dtdSysID(value.sysID);
          }
        }
        Object.defineProperty(XMLDTDNotation2.prototype, "publicId", {
          get: function() {
            return this.pubID;
          }
        });
        Object.defineProperty(XMLDTDNotation2.prototype, "systemId", {
          get: function() {
            return this.sysID;
          }
        });
        XMLDTDNotation2.prototype.toString = function(options) {
          return this.options.writer.dtdNotation(this, this.options.writer.filterOptions(options));
        };
        return XMLDTDNotation2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDocType.js
var require_XMLDocType = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDocType.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDocType, XMLNamedNodeMap, XMLNode, isObject, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      isObject = require_Utility().isObject;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      XMLDTDAttList = require_XMLDTDAttList();
      XMLDTDEntity = require_XMLDTDEntity();
      XMLDTDElement = require_XMLDTDElement();
      XMLDTDNotation = require_XMLDTDNotation();
      XMLNamedNodeMap = require_XMLNamedNodeMap();
      module2.exports = XMLDocType = function(superClass) {
        extend(XMLDocType2, superClass);
        function XMLDocType2(parent, pubID, sysID) {
          var child, i, len, ref, ref1, ref2;
          XMLDocType2.__super__.constructor.call(this, parent);
          this.type = NodeType.DocType;
          if (parent.children) {
            ref = parent.children;
            for (i = 0, len = ref.length; i < len; i++) {
              child = ref[i];
              if (child.type === NodeType.Element) {
                this.name = child.name;
                break;
              }
            }
          }
          this.documentObject = parent;
          if (isObject(pubID)) {
            ref1 = pubID, pubID = ref1.pubID, sysID = ref1.sysID;
          }
          if (sysID == null) {
            ref2 = [pubID, sysID], sysID = ref2[0], pubID = ref2[1];
          }
          if (pubID != null) {
            this.pubID = this.stringify.dtdPubID(pubID);
          }
          if (sysID != null) {
            this.sysID = this.stringify.dtdSysID(sysID);
          }
        }
        Object.defineProperty(XMLDocType2.prototype, "entities", {
          get: function() {
            var child, i, len, nodes, ref;
            nodes = {};
            ref = this.children;
            for (i = 0, len = ref.length; i < len; i++) {
              child = ref[i];
              if (child.type === NodeType.EntityDeclaration && !child.pe) {
                nodes[child.name] = child;
              }
            }
            return new XMLNamedNodeMap(nodes);
          }
        });
        Object.defineProperty(XMLDocType2.prototype, "notations", {
          get: function() {
            var child, i, len, nodes, ref;
            nodes = {};
            ref = this.children;
            for (i = 0, len = ref.length; i < len; i++) {
              child = ref[i];
              if (child.type === NodeType.NotationDeclaration) {
                nodes[child.name] = child;
              }
            }
            return new XMLNamedNodeMap(nodes);
          }
        });
        Object.defineProperty(XMLDocType2.prototype, "publicId", {
          get: function() {
            return this.pubID;
          }
        });
        Object.defineProperty(XMLDocType2.prototype, "systemId", {
          get: function() {
            return this.sysID;
          }
        });
        Object.defineProperty(XMLDocType2.prototype, "internalSubset", {
          get: function() {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        });
        XMLDocType2.prototype.element = function(name, value) {
          var child;
          child = new XMLDTDElement(this, name, value);
          this.children.push(child);
          return this;
        };
        XMLDocType2.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
          var child;
          child = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
          this.children.push(child);
          return this;
        };
        XMLDocType2.prototype.entity = function(name, value) {
          var child;
          child = new XMLDTDEntity(this, false, name, value);
          this.children.push(child);
          return this;
        };
        XMLDocType2.prototype.pEntity = function(name, value) {
          var child;
          child = new XMLDTDEntity(this, true, name, value);
          this.children.push(child);
          return this;
        };
        XMLDocType2.prototype.notation = function(name, value) {
          var child;
          child = new XMLDTDNotation(this, name, value);
          this.children.push(child);
          return this;
        };
        XMLDocType2.prototype.toString = function(options) {
          return this.options.writer.docType(this, this.options.writer.filterOptions(options));
        };
        XMLDocType2.prototype.ele = function(name, value) {
          return this.element(name, value);
        };
        XMLDocType2.prototype.att = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
          return this.attList(elementName, attributeName, attributeType, defaultValueType, defaultValue);
        };
        XMLDocType2.prototype.ent = function(name, value) {
          return this.entity(name, value);
        };
        XMLDocType2.prototype.pent = function(name, value) {
          return this.pEntity(name, value);
        };
        XMLDocType2.prototype.not = function(name, value) {
          return this.notation(name, value);
        };
        XMLDocType2.prototype.up = function() {
          return this.root() || this.documentObject;
        };
        XMLDocType2.prototype.isEqualNode = function(node) {
          if (!XMLDocType2.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
            return false;
          }
          if (node.name !== this.name) {
            return false;
          }
          if (node.publicId !== this.publicId) {
            return false;
          }
          if (node.systemId !== this.systemId) {
            return false;
          }
          return true;
        };
        return XMLDocType2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLRaw.js
var require_XMLRaw = __commonJS({
  "node_modules/xmlbuilder/lib/XMLRaw.js"(exports2, module2) {
    (function() {
      var NodeType, XMLNode, XMLRaw, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      NodeType = require_NodeType();
      XMLNode = require_XMLNode();
      module2.exports = XMLRaw = function(superClass) {
        extend(XMLRaw2, superClass);
        function XMLRaw2(parent, text) {
          XMLRaw2.__super__.constructor.call(this, parent);
          if (text == null) {
            throw new Error("Missing raw text. " + this.debugInfo());
          }
          this.type = NodeType.Raw;
          this.value = this.stringify.raw(text);
        }
        XMLRaw2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLRaw2.prototype.toString = function(options) {
          return this.options.writer.raw(this, this.options.writer.filterOptions(options));
        };
        return XMLRaw2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLText.js
var require_XMLText = __commonJS({
  "node_modules/xmlbuilder/lib/XMLText.js"(exports2, module2) {
    (function() {
      var NodeType, XMLCharacterData, XMLText, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      NodeType = require_NodeType();
      XMLCharacterData = require_XMLCharacterData();
      module2.exports = XMLText = function(superClass) {
        extend(XMLText2, superClass);
        function XMLText2(parent, text) {
          XMLText2.__super__.constructor.call(this, parent);
          if (text == null) {
            throw new Error("Missing element text. " + this.debugInfo());
          }
          this.name = "#text";
          this.type = NodeType.Text;
          this.value = this.stringify.text(text);
        }
        Object.defineProperty(XMLText2.prototype, "isElementContentWhitespace", {
          get: function() {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        });
        Object.defineProperty(XMLText2.prototype, "wholeText", {
          get: function() {
            var next, prev, str;
            str = "";
            prev = this.previousSibling;
            while (prev) {
              str = prev.data + str;
              prev = prev.previousSibling;
            }
            str += this.data;
            next = this.nextSibling;
            while (next) {
              str = str + next.data;
              next = next.nextSibling;
            }
            return str;
          }
        });
        XMLText2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLText2.prototype.toString = function(options) {
          return this.options.writer.text(this, this.options.writer.filterOptions(options));
        };
        XMLText2.prototype.splitText = function(offset) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLText2.prototype.replaceWholeText = function(content) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        return XMLText2;
      }(XMLCharacterData);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLProcessingInstruction.js
var require_XMLProcessingInstruction = __commonJS({
  "node_modules/xmlbuilder/lib/XMLProcessingInstruction.js"(exports2, module2) {
    (function() {
      var NodeType, XMLCharacterData, XMLProcessingInstruction, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      NodeType = require_NodeType();
      XMLCharacterData = require_XMLCharacterData();
      module2.exports = XMLProcessingInstruction = function(superClass) {
        extend(XMLProcessingInstruction2, superClass);
        function XMLProcessingInstruction2(parent, target, value) {
          XMLProcessingInstruction2.__super__.constructor.call(this, parent);
          if (target == null) {
            throw new Error("Missing instruction target. " + this.debugInfo());
          }
          this.type = NodeType.ProcessingInstruction;
          this.target = this.stringify.insTarget(target);
          this.name = this.target;
          if (value) {
            this.value = this.stringify.insValue(value);
          }
        }
        XMLProcessingInstruction2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLProcessingInstruction2.prototype.toString = function(options) {
          return this.options.writer.processingInstruction(this, this.options.writer.filterOptions(options));
        };
        XMLProcessingInstruction2.prototype.isEqualNode = function(node) {
          if (!XMLProcessingInstruction2.__super__.isEqualNode.apply(this, arguments).isEqualNode(node)) {
            return false;
          }
          if (node.target !== this.target) {
            return false;
          }
          return true;
        };
        return XMLProcessingInstruction2;
      }(XMLCharacterData);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDummy.js
var require_XMLDummy = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDummy.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDummy, XMLNode, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      module2.exports = XMLDummy = function(superClass) {
        extend(XMLDummy2, superClass);
        function XMLDummy2(parent) {
          XMLDummy2.__super__.constructor.call(this, parent);
          this.type = NodeType.Dummy;
        }
        XMLDummy2.prototype.clone = function() {
          return Object.create(this);
        };
        XMLDummy2.prototype.toString = function(options) {
          return "";
        };
        return XMLDummy2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLNodeList.js
var require_XMLNodeList = __commonJS({
  "node_modules/xmlbuilder/lib/XMLNodeList.js"(exports2, module2) {
    (function() {
      var XMLNodeList;
      module2.exports = XMLNodeList = function() {
        function XMLNodeList2(nodes) {
          this.nodes = nodes;
        }
        Object.defineProperty(XMLNodeList2.prototype, "length", {
          get: function() {
            return this.nodes.length || 0;
          }
        });
        XMLNodeList2.prototype.clone = function() {
          return this.nodes = null;
        };
        XMLNodeList2.prototype.item = function(index) {
          return this.nodes[index] || null;
        };
        return XMLNodeList2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/DocumentPosition.js
var require_DocumentPosition = __commonJS({
  "node_modules/xmlbuilder/lib/DocumentPosition.js"(exports2, module2) {
    (function() {
      module2.exports = {
        Disconnected: 1,
        Preceding: 2,
        Following: 4,
        Contains: 8,
        ContainedBy: 16,
        ImplementationSpecific: 32
      };
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLNode.js
var require_XMLNode = __commonJS({
  "node_modules/xmlbuilder/lib/XMLNode.js"(exports2, module2) {
    (function() {
      var DocumentPosition, NodeType, XMLCData, XMLComment, XMLDeclaration, XMLDocType, XMLDummy, XMLElement, XMLNamedNodeMap, XMLNode, XMLNodeList, XMLProcessingInstruction, XMLRaw, XMLText, getValue, isEmpty, isFunction, isObject, ref1, hasProp = {}.hasOwnProperty;
      ref1 = require_Utility(), isObject = ref1.isObject, isFunction = ref1.isFunction, isEmpty = ref1.isEmpty, getValue = ref1.getValue;
      XMLElement = null;
      XMLCData = null;
      XMLComment = null;
      XMLDeclaration = null;
      XMLDocType = null;
      XMLRaw = null;
      XMLText = null;
      XMLProcessingInstruction = null;
      XMLDummy = null;
      NodeType = null;
      XMLNodeList = null;
      XMLNamedNodeMap = null;
      DocumentPosition = null;
      module2.exports = XMLNode = function() {
        function XMLNode2(parent1) {
          this.parent = parent1;
          if (this.parent) {
            this.options = this.parent.options;
            this.stringify = this.parent.stringify;
          }
          this.value = null;
          this.children = [];
          this.baseURI = null;
          if (!XMLElement) {
            XMLElement = require_XMLElement();
            XMLCData = require_XMLCData();
            XMLComment = require_XMLComment();
            XMLDeclaration = require_XMLDeclaration();
            XMLDocType = require_XMLDocType();
            XMLRaw = require_XMLRaw();
            XMLText = require_XMLText();
            XMLProcessingInstruction = require_XMLProcessingInstruction();
            XMLDummy = require_XMLDummy();
            NodeType = require_NodeType();
            XMLNodeList = require_XMLNodeList();
            XMLNamedNodeMap = require_XMLNamedNodeMap();
            DocumentPosition = require_DocumentPosition();
          }
        }
        Object.defineProperty(XMLNode2.prototype, "nodeName", {
          get: function() {
            return this.name;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "nodeType", {
          get: function() {
            return this.type;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "nodeValue", {
          get: function() {
            return this.value;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "parentNode", {
          get: function() {
            return this.parent;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "childNodes", {
          get: function() {
            if (!this.childNodeList || !this.childNodeList.nodes) {
              this.childNodeList = new XMLNodeList(this.children);
            }
            return this.childNodeList;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "firstChild", {
          get: function() {
            return this.children[0] || null;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "lastChild", {
          get: function() {
            return this.children[this.children.length - 1] || null;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "previousSibling", {
          get: function() {
            var i;
            i = this.parent.children.indexOf(this);
            return this.parent.children[i - 1] || null;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "nextSibling", {
          get: function() {
            var i;
            i = this.parent.children.indexOf(this);
            return this.parent.children[i + 1] || null;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "ownerDocument", {
          get: function() {
            return this.document() || null;
          }
        });
        Object.defineProperty(XMLNode2.prototype, "textContent", {
          get: function() {
            var child, j, len, ref2, str;
            if (this.nodeType === NodeType.Element || this.nodeType === NodeType.DocumentFragment) {
              str = "";
              ref2 = this.children;
              for (j = 0, len = ref2.length; j < len; j++) {
                child = ref2[j];
                if (child.textContent) {
                  str += child.textContent;
                }
              }
              return str;
            } else {
              return null;
            }
          },
          set: function(value) {
            throw new Error("This DOM method is not implemented." + this.debugInfo());
          }
        });
        XMLNode2.prototype.setParent = function(parent) {
          var child, j, len, ref2, results;
          this.parent = parent;
          if (parent) {
            this.options = parent.options;
            this.stringify = parent.stringify;
          }
          ref2 = this.children;
          results = [];
          for (j = 0, len = ref2.length; j < len; j++) {
            child = ref2[j];
            results.push(child.setParent(this));
          }
          return results;
        };
        XMLNode2.prototype.element = function(name, attributes, text) {
          var childNode, item, j, k, key, lastChild, len, len1, ref2, ref3, val;
          lastChild = null;
          if (attributes === null && text == null) {
            ref2 = [{}, null], attributes = ref2[0], text = ref2[1];
          }
          if (attributes == null) {
            attributes = {};
          }
          attributes = getValue(attributes);
          if (!isObject(attributes)) {
            ref3 = [attributes, text], text = ref3[0], attributes = ref3[1];
          }
          if (name != null) {
            name = getValue(name);
          }
          if (Array.isArray(name)) {
            for (j = 0, len = name.length; j < len; j++) {
              item = name[j];
              lastChild = this.element(item);
            }
          } else if (isFunction(name)) {
            lastChild = this.element(name.apply());
          } else if (isObject(name)) {
            for (key in name) {
              if (!hasProp.call(name, key)) continue;
              val = name[key];
              if (isFunction(val)) {
                val = val.apply();
              }
              if (!this.options.ignoreDecorators && this.stringify.convertAttKey && key.indexOf(this.stringify.convertAttKey) === 0) {
                lastChild = this.attribute(key.substr(this.stringify.convertAttKey.length), val);
              } else if (!this.options.separateArrayItems && Array.isArray(val) && isEmpty(val)) {
                lastChild = this.dummy();
              } else if (isObject(val) && isEmpty(val)) {
                lastChild = this.element(key);
              } else if (!this.options.keepNullNodes && val == null) {
                lastChild = this.dummy();
              } else if (!this.options.separateArrayItems && Array.isArray(val)) {
                for (k = 0, len1 = val.length; k < len1; k++) {
                  item = val[k];
                  childNode = {};
                  childNode[key] = item;
                  lastChild = this.element(childNode);
                }
              } else if (isObject(val)) {
                if (!this.options.ignoreDecorators && this.stringify.convertTextKey && key.indexOf(this.stringify.convertTextKey) === 0) {
                  lastChild = this.element(val);
                } else {
                  lastChild = this.element(key);
                  lastChild.element(val);
                }
              } else {
                lastChild = this.element(key, val);
              }
            }
          } else if (!this.options.keepNullNodes && text === null) {
            lastChild = this.dummy();
          } else {
            if (!this.options.ignoreDecorators && this.stringify.convertTextKey && name.indexOf(this.stringify.convertTextKey) === 0) {
              lastChild = this.text(text);
            } else if (!this.options.ignoreDecorators && this.stringify.convertCDataKey && name.indexOf(this.stringify.convertCDataKey) === 0) {
              lastChild = this.cdata(text);
            } else if (!this.options.ignoreDecorators && this.stringify.convertCommentKey && name.indexOf(this.stringify.convertCommentKey) === 0) {
              lastChild = this.comment(text);
            } else if (!this.options.ignoreDecorators && this.stringify.convertRawKey && name.indexOf(this.stringify.convertRawKey) === 0) {
              lastChild = this.raw(text);
            } else if (!this.options.ignoreDecorators && this.stringify.convertPIKey && name.indexOf(this.stringify.convertPIKey) === 0) {
              lastChild = this.instruction(name.substr(this.stringify.convertPIKey.length), text);
            } else {
              lastChild = this.node(name, attributes, text);
            }
          }
          if (lastChild == null) {
            throw new Error("Could not create any elements with: " + name + ". " + this.debugInfo());
          }
          return lastChild;
        };
        XMLNode2.prototype.insertBefore = function(name, attributes, text) {
          var child, i, newChild, refChild, removed;
          if (name != null ? name.type : void 0) {
            newChild = name;
            refChild = attributes;
            newChild.setParent(this);
            if (refChild) {
              i = children.indexOf(refChild);
              removed = children.splice(i);
              children.push(newChild);
              Array.prototype.push.apply(children, removed);
            } else {
              children.push(newChild);
            }
            return newChild;
          } else {
            if (this.isRoot) {
              throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
            }
            i = this.parent.children.indexOf(this);
            removed = this.parent.children.splice(i);
            child = this.parent.element(name, attributes, text);
            Array.prototype.push.apply(this.parent.children, removed);
            return child;
          }
        };
        XMLNode2.prototype.insertAfter = function(name, attributes, text) {
          var child, i, removed;
          if (this.isRoot) {
            throw new Error("Cannot insert elements at root level. " + this.debugInfo(name));
          }
          i = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i + 1);
          child = this.parent.element(name, attributes, text);
          Array.prototype.push.apply(this.parent.children, removed);
          return child;
        };
        XMLNode2.prototype.remove = function() {
          var i, ref2;
          if (this.isRoot) {
            throw new Error("Cannot remove the root element. " + this.debugInfo());
          }
          i = this.parent.children.indexOf(this);
          [].splice.apply(this.parent.children, [i, i - i + 1].concat(ref2 = [])), ref2;
          return this.parent;
        };
        XMLNode2.prototype.node = function(name, attributes, text) {
          var child, ref2;
          if (name != null) {
            name = getValue(name);
          }
          attributes || (attributes = {});
          attributes = getValue(attributes);
          if (!isObject(attributes)) {
            ref2 = [attributes, text], text = ref2[0], attributes = ref2[1];
          }
          child = new XMLElement(this, name, attributes);
          if (text != null) {
            child.text(text);
          }
          this.children.push(child);
          return child;
        };
        XMLNode2.prototype.text = function(value) {
          var child;
          if (isObject(value)) {
            this.element(value);
          }
          child = new XMLText(this, value);
          this.children.push(child);
          return this;
        };
        XMLNode2.prototype.cdata = function(value) {
          var child;
          child = new XMLCData(this, value);
          this.children.push(child);
          return this;
        };
        XMLNode2.prototype.comment = function(value) {
          var child;
          child = new XMLComment(this, value);
          this.children.push(child);
          return this;
        };
        XMLNode2.prototype.commentBefore = function(value) {
          var child, i, removed;
          i = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i);
          child = this.parent.comment(value);
          Array.prototype.push.apply(this.parent.children, removed);
          return this;
        };
        XMLNode2.prototype.commentAfter = function(value) {
          var child, i, removed;
          i = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i + 1);
          child = this.parent.comment(value);
          Array.prototype.push.apply(this.parent.children, removed);
          return this;
        };
        XMLNode2.prototype.raw = function(value) {
          var child;
          child = new XMLRaw(this, value);
          this.children.push(child);
          return this;
        };
        XMLNode2.prototype.dummy = function() {
          var child;
          child = new XMLDummy(this);
          return child;
        };
        XMLNode2.prototype.instruction = function(target, value) {
          var insTarget, insValue, instruction, j, len;
          if (target != null) {
            target = getValue(target);
          }
          if (value != null) {
            value = getValue(value);
          }
          if (Array.isArray(target)) {
            for (j = 0, len = target.length; j < len; j++) {
              insTarget = target[j];
              this.instruction(insTarget);
            }
          } else if (isObject(target)) {
            for (insTarget in target) {
              if (!hasProp.call(target, insTarget)) continue;
              insValue = target[insTarget];
              this.instruction(insTarget, insValue);
            }
          } else {
            if (isFunction(value)) {
              value = value.apply();
            }
            instruction = new XMLProcessingInstruction(this, target, value);
            this.children.push(instruction);
          }
          return this;
        };
        XMLNode2.prototype.instructionBefore = function(target, value) {
          var child, i, removed;
          i = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i);
          child = this.parent.instruction(target, value);
          Array.prototype.push.apply(this.parent.children, removed);
          return this;
        };
        XMLNode2.prototype.instructionAfter = function(target, value) {
          var child, i, removed;
          i = this.parent.children.indexOf(this);
          removed = this.parent.children.splice(i + 1);
          child = this.parent.instruction(target, value);
          Array.prototype.push.apply(this.parent.children, removed);
          return this;
        };
        XMLNode2.prototype.declaration = function(version, encoding, standalone) {
          var doc, xmldec;
          doc = this.document();
          xmldec = new XMLDeclaration(doc, version, encoding, standalone);
          if (doc.children.length === 0) {
            doc.children.unshift(xmldec);
          } else if (doc.children[0].type === NodeType.Declaration) {
            doc.children[0] = xmldec;
          } else {
            doc.children.unshift(xmldec);
          }
          return doc.root() || doc;
        };
        XMLNode2.prototype.dtd = function(pubID, sysID) {
          var child, doc, doctype, i, j, k, len, len1, ref2, ref3;
          doc = this.document();
          doctype = new XMLDocType(doc, pubID, sysID);
          ref2 = doc.children;
          for (i = j = 0, len = ref2.length; j < len; i = ++j) {
            child = ref2[i];
            if (child.type === NodeType.DocType) {
              doc.children[i] = doctype;
              return doctype;
            }
          }
          ref3 = doc.children;
          for (i = k = 0, len1 = ref3.length; k < len1; i = ++k) {
            child = ref3[i];
            if (child.isRoot) {
              doc.children.splice(i, 0, doctype);
              return doctype;
            }
          }
          doc.children.push(doctype);
          return doctype;
        };
        XMLNode2.prototype.up = function() {
          if (this.isRoot) {
            throw new Error("The root node has no parent. Use doc() if you need to get the document object.");
          }
          return this.parent;
        };
        XMLNode2.prototype.root = function() {
          var node;
          node = this;
          while (node) {
            if (node.type === NodeType.Document) {
              return node.rootObject;
            } else if (node.isRoot) {
              return node;
            } else {
              node = node.parent;
            }
          }
        };
        XMLNode2.prototype.document = function() {
          var node;
          node = this;
          while (node) {
            if (node.type === NodeType.Document) {
              return node;
            } else {
              node = node.parent;
            }
          }
        };
        XMLNode2.prototype.end = function(options) {
          return this.document().end(options);
        };
        XMLNode2.prototype.prev = function() {
          var i;
          i = this.parent.children.indexOf(this);
          if (i < 1) {
            throw new Error("Already at the first node. " + this.debugInfo());
          }
          return this.parent.children[i - 1];
        };
        XMLNode2.prototype.next = function() {
          var i;
          i = this.parent.children.indexOf(this);
          if (i === -1 || i === this.parent.children.length - 1) {
            throw new Error("Already at the last node. " + this.debugInfo());
          }
          return this.parent.children[i + 1];
        };
        XMLNode2.prototype.importDocument = function(doc) {
          var clonedRoot;
          clonedRoot = doc.root().clone();
          clonedRoot.parent = this;
          clonedRoot.isRoot = false;
          this.children.push(clonedRoot);
          return this;
        };
        XMLNode2.prototype.debugInfo = function(name) {
          var ref2, ref3;
          name = name || this.name;
          if (name == null && !((ref2 = this.parent) != null ? ref2.name : void 0)) {
            return "";
          } else if (name == null) {
            return "parent: <" + this.parent.name + ">";
          } else if (!((ref3 = this.parent) != null ? ref3.name : void 0)) {
            return "node: <" + name + ">";
          } else {
            return "node: <" + name + ">, parent: <" + this.parent.name + ">";
          }
        };
        XMLNode2.prototype.ele = function(name, attributes, text) {
          return this.element(name, attributes, text);
        };
        XMLNode2.prototype.nod = function(name, attributes, text) {
          return this.node(name, attributes, text);
        };
        XMLNode2.prototype.txt = function(value) {
          return this.text(value);
        };
        XMLNode2.prototype.dat = function(value) {
          return this.cdata(value);
        };
        XMLNode2.prototype.com = function(value) {
          return this.comment(value);
        };
        XMLNode2.prototype.ins = function(target, value) {
          return this.instruction(target, value);
        };
        XMLNode2.prototype.doc = function() {
          return this.document();
        };
        XMLNode2.prototype.dec = function(version, encoding, standalone) {
          return this.declaration(version, encoding, standalone);
        };
        XMLNode2.prototype.e = function(name, attributes, text) {
          return this.element(name, attributes, text);
        };
        XMLNode2.prototype.n = function(name, attributes, text) {
          return this.node(name, attributes, text);
        };
        XMLNode2.prototype.t = function(value) {
          return this.text(value);
        };
        XMLNode2.prototype.d = function(value) {
          return this.cdata(value);
        };
        XMLNode2.prototype.c = function(value) {
          return this.comment(value);
        };
        XMLNode2.prototype.r = function(value) {
          return this.raw(value);
        };
        XMLNode2.prototype.i = function(target, value) {
          return this.instruction(target, value);
        };
        XMLNode2.prototype.u = function() {
          return this.up();
        };
        XMLNode2.prototype.importXMLBuilder = function(doc) {
          return this.importDocument(doc);
        };
        XMLNode2.prototype.replaceChild = function(newChild, oldChild) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.removeChild = function(oldChild) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.appendChild = function(newChild) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.hasChildNodes = function() {
          return this.children.length !== 0;
        };
        XMLNode2.prototype.cloneNode = function(deep) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.normalize = function() {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.isSupported = function(feature, version) {
          return true;
        };
        XMLNode2.prototype.hasAttributes = function() {
          return this.attribs.length !== 0;
        };
        XMLNode2.prototype.compareDocumentPosition = function(other) {
          var ref, res;
          ref = this;
          if (ref === other) {
            return 0;
          } else if (this.document() !== other.document()) {
            res = DocumentPosition.Disconnected | DocumentPosition.ImplementationSpecific;
            if (Math.random() < 0.5) {
              res |= DocumentPosition.Preceding;
            } else {
              res |= DocumentPosition.Following;
            }
            return res;
          } else if (ref.isAncestor(other)) {
            return DocumentPosition.Contains | DocumentPosition.Preceding;
          } else if (ref.isDescendant(other)) {
            return DocumentPosition.Contains | DocumentPosition.Following;
          } else if (ref.isPreceding(other)) {
            return DocumentPosition.Preceding;
          } else {
            return DocumentPosition.Following;
          }
        };
        XMLNode2.prototype.isSameNode = function(other) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.lookupPrefix = function(namespaceURI) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.isDefaultNamespace = function(namespaceURI) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.lookupNamespaceURI = function(prefix) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.isEqualNode = function(node) {
          var i, j, ref2;
          if (node.nodeType !== this.nodeType) {
            return false;
          }
          if (node.children.length !== this.children.length) {
            return false;
          }
          for (i = j = 0, ref2 = this.children.length - 1; 0 <= ref2 ? j <= ref2 : j >= ref2; i = 0 <= ref2 ? ++j : --j) {
            if (!this.children[i].isEqualNode(node.children[i])) {
              return false;
            }
          }
          return true;
        };
        XMLNode2.prototype.getFeature = function(feature, version) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.setUserData = function(key, data, handler) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.getUserData = function(key) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLNode2.prototype.contains = function(other) {
          if (!other) {
            return false;
          }
          return other === this || this.isDescendant(other);
        };
        XMLNode2.prototype.isDescendant = function(node) {
          var child, isDescendantChild, j, len, ref2;
          ref2 = this.children;
          for (j = 0, len = ref2.length; j < len; j++) {
            child = ref2[j];
            if (node === child) {
              return true;
            }
            isDescendantChild = child.isDescendant(node);
            if (isDescendantChild) {
              return true;
            }
          }
          return false;
        };
        XMLNode2.prototype.isAncestor = function(node) {
          return node.isDescendant(this);
        };
        XMLNode2.prototype.isPreceding = function(node) {
          var nodePos, thisPos;
          nodePos = this.treePosition(node);
          thisPos = this.treePosition(this);
          if (nodePos === -1 || thisPos === -1) {
            return false;
          } else {
            return nodePos < thisPos;
          }
        };
        XMLNode2.prototype.isFollowing = function(node) {
          var nodePos, thisPos;
          nodePos = this.treePosition(node);
          thisPos = this.treePosition(this);
          if (nodePos === -1 || thisPos === -1) {
            return false;
          } else {
            return nodePos > thisPos;
          }
        };
        XMLNode2.prototype.treePosition = function(node) {
          var found, pos;
          pos = 0;
          found = false;
          this.foreachTreeNode(this.document(), function(childNode) {
            pos++;
            if (!found && childNode === node) {
              return found = true;
            }
          });
          if (found) {
            return pos;
          } else {
            return -1;
          }
        };
        XMLNode2.prototype.foreachTreeNode = function(node, func) {
          var child, j, len, ref2, res;
          node || (node = this.document());
          ref2 = node.children;
          for (j = 0, len = ref2.length; j < len; j++) {
            child = ref2[j];
            if (res = func(child)) {
              return res;
            } else {
              res = this.foreachTreeNode(child, func);
              if (res) {
                return res;
              }
            }
          }
        };
        return XMLNode2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLStringifier.js
var require_XMLStringifier = __commonJS({
  "node_modules/xmlbuilder/lib/XMLStringifier.js"(exports2, module2) {
    (function() {
      var XMLStringifier, bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      }, hasProp = {}.hasOwnProperty;
      module2.exports = XMLStringifier = function() {
        function XMLStringifier2(options) {
          this.assertLegalName = bind(this.assertLegalName, this);
          this.assertLegalChar = bind(this.assertLegalChar, this);
          var key, ref, value;
          options || (options = {});
          this.options = options;
          if (!this.options.version) {
            this.options.version = "1.0";
          }
          ref = options.stringify || {};
          for (key in ref) {
            if (!hasProp.call(ref, key)) continue;
            value = ref[key];
            this[key] = value;
          }
        }
        XMLStringifier2.prototype.name = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalName("" + val || "");
        };
        XMLStringifier2.prototype.text = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar(this.textEscape("" + val || ""));
        };
        XMLStringifier2.prototype.cdata = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          val = "" + val || "";
          val = val.replace("]]>", "]]]]><![CDATA[>");
          return this.assertLegalChar(val);
        };
        XMLStringifier2.prototype.comment = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          val = "" + val || "";
          if (val.match(/--/)) {
            throw new Error("Comment text cannot contain double-hypen: " + val);
          }
          return this.assertLegalChar(val);
        };
        XMLStringifier2.prototype.raw = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return "" + val || "";
        };
        XMLStringifier2.prototype.attValue = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar(this.attEscape(val = "" + val || ""));
        };
        XMLStringifier2.prototype.insTarget = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.insValue = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          val = "" + val || "";
          if (val.match(/\?>/)) {
            throw new Error("Invalid processing instruction value: " + val);
          }
          return this.assertLegalChar(val);
        };
        XMLStringifier2.prototype.xmlVersion = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          val = "" + val || "";
          if (!val.match(/1\.[0-9]+/)) {
            throw new Error("Invalid version number: " + val);
          }
          return val;
        };
        XMLStringifier2.prototype.xmlEncoding = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          val = "" + val || "";
          if (!val.match(/^[A-Za-z](?:[A-Za-z0-9._-])*$/)) {
            throw new Error("Invalid encoding: " + val);
          }
          return this.assertLegalChar(val);
        };
        XMLStringifier2.prototype.xmlStandalone = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          if (val) {
            return "yes";
          } else {
            return "no";
          }
        };
        XMLStringifier2.prototype.dtdPubID = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.dtdSysID = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.dtdElementValue = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.dtdAttType = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.dtdAttDefault = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.dtdEntityValue = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.dtdNData = function(val) {
          if (this.options.noValidation) {
            return val;
          }
          return this.assertLegalChar("" + val || "");
        };
        XMLStringifier2.prototype.convertAttKey = "@";
        XMLStringifier2.prototype.convertPIKey = "?";
        XMLStringifier2.prototype.convertTextKey = "#text";
        XMLStringifier2.prototype.convertCDataKey = "#cdata";
        XMLStringifier2.prototype.convertCommentKey = "#comment";
        XMLStringifier2.prototype.convertRawKey = "#raw";
        XMLStringifier2.prototype.assertLegalChar = function(str) {
          var regex, res;
          if (this.options.noValidation) {
            return str;
          }
          regex = "";
          if (this.options.version === "1.0") {
            regex = /[\0-\x08\x0B\f\x0E-\x1F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
            if (res = str.match(regex)) {
              throw new Error("Invalid character in string: " + str + " at index " + res.index);
            }
          } else if (this.options.version === "1.1") {
            regex = /[\0\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
            if (res = str.match(regex)) {
              throw new Error("Invalid character in string: " + str + " at index " + res.index);
            }
          }
          return str;
        };
        XMLStringifier2.prototype.assertLegalName = function(str) {
          var regex;
          if (this.options.noValidation) {
            return str;
          }
          this.assertLegalChar(str);
          regex = /^([:A-Z_a-z\xC0-\xD6\xD8-\xF6\xF8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])([\x2D\.0-:A-Z_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/;
          if (!str.match(regex)) {
            throw new Error("Invalid character in name");
          }
          return str;
        };
        XMLStringifier2.prototype.textEscape = function(str) {
          var ampregex;
          if (this.options.noValidation) {
            return str;
          }
          ampregex = this.options.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
          return str.replace(ampregex, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r/g, "&#xD;");
        };
        XMLStringifier2.prototype.attEscape = function(str) {
          var ampregex;
          if (this.options.noValidation) {
            return str;
          }
          ampregex = this.options.noDoubleEncoding ? /(?!&\S+;)&/g : /&/g;
          return str.replace(ampregex, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/\t/g, "&#x9;").replace(/\n/g, "&#xA;").replace(/\r/g, "&#xD;");
        };
        return XMLStringifier2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/WriterState.js
var require_WriterState = __commonJS({
  "node_modules/xmlbuilder/lib/WriterState.js"(exports2, module2) {
    (function() {
      module2.exports = {
        None: 0,
        OpenTag: 1,
        InsideTag: 2,
        CloseTag: 3
      };
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLWriterBase.js
var require_XMLWriterBase = __commonJS({
  "node_modules/xmlbuilder/lib/XMLWriterBase.js"(exports2, module2) {
    (function() {
      var NodeType, WriterState, XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLDummy, XMLElement, XMLProcessingInstruction, XMLRaw, XMLText, XMLWriterBase, assign, hasProp = {}.hasOwnProperty;
      assign = require_Utility().assign;
      NodeType = require_NodeType();
      XMLDeclaration = require_XMLDeclaration();
      XMLDocType = require_XMLDocType();
      XMLCData = require_XMLCData();
      XMLComment = require_XMLComment();
      XMLElement = require_XMLElement();
      XMLRaw = require_XMLRaw();
      XMLText = require_XMLText();
      XMLProcessingInstruction = require_XMLProcessingInstruction();
      XMLDummy = require_XMLDummy();
      XMLDTDAttList = require_XMLDTDAttList();
      XMLDTDElement = require_XMLDTDElement();
      XMLDTDEntity = require_XMLDTDEntity();
      XMLDTDNotation = require_XMLDTDNotation();
      WriterState = require_WriterState();
      module2.exports = XMLWriterBase = function() {
        function XMLWriterBase2(options) {
          var key, ref, value;
          options || (options = {});
          this.options = options;
          ref = options.writer || {};
          for (key in ref) {
            if (!hasProp.call(ref, key)) continue;
            value = ref[key];
            this["_" + key] = this[key];
            this[key] = value;
          }
        }
        XMLWriterBase2.prototype.filterOptions = function(options) {
          var filteredOptions, ref, ref1, ref2, ref3, ref4, ref5, ref6;
          options || (options = {});
          options = assign({}, this.options, options);
          filteredOptions = {
            writer: this
          };
          filteredOptions.pretty = options.pretty || false;
          filteredOptions.allowEmpty = options.allowEmpty || false;
          filteredOptions.indent = (ref = options.indent) != null ? ref : "  ";
          filteredOptions.newline = (ref1 = options.newline) != null ? ref1 : "\n";
          filteredOptions.offset = (ref2 = options.offset) != null ? ref2 : 0;
          filteredOptions.dontPrettyTextNodes = (ref3 = (ref4 = options.dontPrettyTextNodes) != null ? ref4 : options.dontprettytextnodes) != null ? ref3 : 0;
          filteredOptions.spaceBeforeSlash = (ref5 = (ref6 = options.spaceBeforeSlash) != null ? ref6 : options.spacebeforeslash) != null ? ref5 : "";
          if (filteredOptions.spaceBeforeSlash === true) {
            filteredOptions.spaceBeforeSlash = " ";
          }
          filteredOptions.suppressPrettyCount = 0;
          filteredOptions.user = {};
          filteredOptions.state = WriterState.None;
          return filteredOptions;
        };
        XMLWriterBase2.prototype.indent = function(node, options, level) {
          var indentLevel;
          if (!options.pretty || options.suppressPrettyCount) {
            return "";
          } else if (options.pretty) {
            indentLevel = (level || 0) + options.offset + 1;
            if (indentLevel > 0) {
              return new Array(indentLevel).join(options.indent);
            }
          }
          return "";
        };
        XMLWriterBase2.prototype.endline = function(node, options, level) {
          if (!options.pretty || options.suppressPrettyCount) {
            return "";
          } else {
            return options.newline;
          }
        };
        XMLWriterBase2.prototype.attribute = function(att, options, level) {
          var r;
          this.openAttribute(att, options, level);
          r = " " + att.name + '="' + att.value + '"';
          this.closeAttribute(att, options, level);
          return r;
        };
        XMLWriterBase2.prototype.cdata = function(node, options, level) {
          var r;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level) + "<![CDATA[";
          options.state = WriterState.InsideTag;
          r += node.value;
          options.state = WriterState.CloseTag;
          r += "]]>" + this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        };
        XMLWriterBase2.prototype.comment = function(node, options, level) {
          var r;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level) + "<!-- ";
          options.state = WriterState.InsideTag;
          r += node.value;
          options.state = WriterState.CloseTag;
          r += " -->" + this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        };
        XMLWriterBase2.prototype.declaration = function(node, options, level) {
          var r;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level) + "<?xml";
          options.state = WriterState.InsideTag;
          r += ' version="' + node.version + '"';
          if (node.encoding != null) {
            r += ' encoding="' + node.encoding + '"';
          }
          if (node.standalone != null) {
            r += ' standalone="' + node.standalone + '"';
          }
          options.state = WriterState.CloseTag;
          r += options.spaceBeforeSlash + "?>";
          r += this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        };
        XMLWriterBase2.prototype.docType = function(node, options, level) {
          var child, i, len, r, ref;
          level || (level = 0);
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level);
          r += "<!DOCTYPE " + node.root().name;
          if (node.pubID && node.sysID) {
            r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
          } else if (node.sysID) {
            r += ' SYSTEM "' + node.sysID + '"';
          }
          if (node.children.length > 0) {
            r += " [";
            r += this.endline(node, options, level);
            options.state = WriterState.InsideTag;
            ref = node.children;
            for (i = 0, len = ref.length; i < len; i++) {
              child = ref[i];
              r += this.writeChildNode(child, options, level + 1);
            }
            options.state = WriterState.CloseTag;
            r += "]";
          }
          options.state = WriterState.CloseTag;
          r += options.spaceBeforeSlash + ">";
          r += this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        };
        XMLWriterBase2.prototype.element = function(node, options, level) {
          var att, child, childNodeCount, firstChildNode, i, j, len, len1, name, prettySuppressed, r, ref, ref1, ref2;
          level || (level = 0);
          prettySuppressed = false;
          r = "";
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r += this.indent(node, options, level) + "<" + node.name;
          ref = node.attribs;
          for (name in ref) {
            if (!hasProp.call(ref, name)) continue;
            att = ref[name];
            r += this.attribute(att, options, level);
          }
          childNodeCount = node.children.length;
          firstChildNode = childNodeCount === 0 ? null : node.children[0];
          if (childNodeCount === 0 || node.children.every(function(e) {
            return (e.type === NodeType.Text || e.type === NodeType.Raw) && e.value === "";
          })) {
            if (options.allowEmpty) {
              r += ">";
              options.state = WriterState.CloseTag;
              r += "</" + node.name + ">" + this.endline(node, options, level);
            } else {
              options.state = WriterState.CloseTag;
              r += options.spaceBeforeSlash + "/>" + this.endline(node, options, level);
            }
          } else if (options.pretty && childNodeCount === 1 && (firstChildNode.type === NodeType.Text || firstChildNode.type === NodeType.Raw) && firstChildNode.value != null) {
            r += ">";
            options.state = WriterState.InsideTag;
            options.suppressPrettyCount++;
            prettySuppressed = true;
            r += this.writeChildNode(firstChildNode, options, level + 1);
            options.suppressPrettyCount--;
            prettySuppressed = false;
            options.state = WriterState.CloseTag;
            r += "</" + node.name + ">" + this.endline(node, options, level);
          } else {
            if (options.dontPrettyTextNodes) {
              ref1 = node.children;
              for (i = 0, len = ref1.length; i < len; i++) {
                child = ref1[i];
                if ((child.type === NodeType.Text || child.type === NodeType.Raw) && child.value != null) {
                  options.suppressPrettyCount++;
                  prettySuppressed = true;
                  break;
                }
              }
            }
            r += ">" + this.endline(node, options, level);
            options.state = WriterState.InsideTag;
            ref2 = node.children;
            for (j = 0, len1 = ref2.length; j < len1; j++) {
              child = ref2[j];
              r += this.writeChildNode(child, options, level + 1);
            }
            options.state = WriterState.CloseTag;
            r += this.indent(node, options, level) + "</" + node.name + ">";
            if (prettySuppressed) {
              options.suppressPrettyCount--;
            }
            r += this.endline(node, options, level);
            options.state = WriterState.None;
          }
          this.closeNode(node, options, level);
          return r;
        };
        XMLWriterBase2.prototype.writeChildNode = function(node, options, level) {
          switch (node.type) {
            case NodeType.CData:
              return this.cdata(node, options, level);
            case NodeType.Comment:
              return this.comment(node, options, level);
            case NodeType.Element:
              return this.element(node, options, level);
            case NodeType.Raw:
              return this.raw(node, options, level);
            case NodeType.Text:
              return this.text(node, options, level);
            case NodeType.ProcessingInstruction:
              return this.processingInstruction(node, options, level);
            case NodeType.Dummy:
              return "";
            case NodeType.Declaration:
              return this.declaration(node, options, level);
            case NodeType.DocType:
              return this.docType(node, options, level);
            case NodeType.AttributeDeclaration:
              return this.dtdAttList(node, options, level);
            case NodeType.ElementDeclaration:
              return this.dtdElement(node, options, level);
            case NodeType.EntityDeclaration:
              return this.dtdEntity(node, options, level);
            case NodeType.NotationDeclaration:
              return this.dtdNotation(node, options, level);
            default:
              throw new Error("Unknown XML node type: " + node.constructor.name);
          }
        };
        XMLWriterBase2.prototype.processingInstruction = function(node, options, level) {
          var r;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level) + "<?";
          options.state = WriterState.InsideTag;
          r += node.target;
          if (node.value) {
            r += " " + node.value;
          }
          options.state = WriterState.CloseTag;
          r += options.spaceBeforeSlash + "?>";
          r += this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        };
        XMLWriterBase2.prototype.raw = function(node, options, level) {
          var r;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level);
          options.state = WriterState.InsideTag;
          r += node.value;
          options.state = WriterState.CloseTag;
          r += this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        };
        XMLWriterBase2.prototype.text = function(node, options, level) {
          var r;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level);
          options.state = WriterState.InsideTag;
          r += node.value;
          options.state = WriterState.CloseTag;
          r += this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        };
        XMLWriterBase2.prototype.dtdAttList = function(node, options, level) {
          var r;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level) + "<!ATTLIST";
          options.state = WriterState.InsideTag;
          r += " " + node.elementName + " " + node.attributeName + " " + node.attributeType;
          if (node.defaultValueType !== "#DEFAULT") {
            r += " " + node.defaultValueType;
          }
          if (node.defaultValue) {
            r += ' "' + node.defaultValue + '"';
          }
          options.state = WriterState.CloseTag;
          r += options.spaceBeforeSlash + ">" + this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        };
        XMLWriterBase2.prototype.dtdElement = function(node, options, level) {
          var r;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level) + "<!ELEMENT";
          options.state = WriterState.InsideTag;
          r += " " + node.name + " " + node.value;
          options.state = WriterState.CloseTag;
          r += options.spaceBeforeSlash + ">" + this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        };
        XMLWriterBase2.prototype.dtdEntity = function(node, options, level) {
          var r;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level) + "<!ENTITY";
          options.state = WriterState.InsideTag;
          if (node.pe) {
            r += " %";
          }
          r += " " + node.name;
          if (node.value) {
            r += ' "' + node.value + '"';
          } else {
            if (node.pubID && node.sysID) {
              r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
            } else if (node.sysID) {
              r += ' SYSTEM "' + node.sysID + '"';
            }
            if (node.nData) {
              r += " NDATA " + node.nData;
            }
          }
          options.state = WriterState.CloseTag;
          r += options.spaceBeforeSlash + ">" + this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        };
        XMLWriterBase2.prototype.dtdNotation = function(node, options, level) {
          var r;
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          r = this.indent(node, options, level) + "<!NOTATION";
          options.state = WriterState.InsideTag;
          r += " " + node.name;
          if (node.pubID && node.sysID) {
            r += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
          } else if (node.pubID) {
            r += ' PUBLIC "' + node.pubID + '"';
          } else if (node.sysID) {
            r += ' SYSTEM "' + node.sysID + '"';
          }
          options.state = WriterState.CloseTag;
          r += options.spaceBeforeSlash + ">" + this.endline(node, options, level);
          options.state = WriterState.None;
          this.closeNode(node, options, level);
          return r;
        };
        XMLWriterBase2.prototype.openNode = function(node, options, level) {
        };
        XMLWriterBase2.prototype.closeNode = function(node, options, level) {
        };
        XMLWriterBase2.prototype.openAttribute = function(att, options, level) {
        };
        XMLWriterBase2.prototype.closeAttribute = function(att, options, level) {
        };
        return XMLWriterBase2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLStringWriter.js
var require_XMLStringWriter = __commonJS({
  "node_modules/xmlbuilder/lib/XMLStringWriter.js"(exports2, module2) {
    (function() {
      var XMLStringWriter, XMLWriterBase, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      XMLWriterBase = require_XMLWriterBase();
      module2.exports = XMLStringWriter = function(superClass) {
        extend(XMLStringWriter2, superClass);
        function XMLStringWriter2(options) {
          XMLStringWriter2.__super__.constructor.call(this, options);
        }
        XMLStringWriter2.prototype.document = function(doc, options) {
          var child, i, len, r, ref;
          options = this.filterOptions(options);
          r = "";
          ref = doc.children;
          for (i = 0, len = ref.length; i < len; i++) {
            child = ref[i];
            r += this.writeChildNode(child, options, 0);
          }
          if (options.pretty && r.slice(-options.newline.length) === options.newline) {
            r = r.slice(0, -options.newline.length);
          }
          return r;
        };
        return XMLStringWriter2;
      }(XMLWriterBase);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDocument.js
var require_XMLDocument = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDocument.js"(exports2, module2) {
    (function() {
      var NodeType, XMLDOMConfiguration, XMLDOMImplementation, XMLDocument, XMLNode, XMLStringWriter, XMLStringifier, isPlainObject, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      isPlainObject = require_Utility().isPlainObject;
      XMLDOMImplementation = require_XMLDOMImplementation();
      XMLDOMConfiguration = require_XMLDOMConfiguration();
      XMLNode = require_XMLNode();
      NodeType = require_NodeType();
      XMLStringifier = require_XMLStringifier();
      XMLStringWriter = require_XMLStringWriter();
      module2.exports = XMLDocument = function(superClass) {
        extend(XMLDocument2, superClass);
        function XMLDocument2(options) {
          XMLDocument2.__super__.constructor.call(this, null);
          this.name = "#document";
          this.type = NodeType.Document;
          this.documentURI = null;
          this.domConfig = new XMLDOMConfiguration();
          options || (options = {});
          if (!options.writer) {
            options.writer = new XMLStringWriter();
          }
          this.options = options;
          this.stringify = new XMLStringifier(options);
        }
        Object.defineProperty(XMLDocument2.prototype, "implementation", {
          value: new XMLDOMImplementation()
        });
        Object.defineProperty(XMLDocument2.prototype, "doctype", {
          get: function() {
            var child, i, len, ref;
            ref = this.children;
            for (i = 0, len = ref.length; i < len; i++) {
              child = ref[i];
              if (child.type === NodeType.DocType) {
                return child;
              }
            }
            return null;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "documentElement", {
          get: function() {
            return this.rootObject || null;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "inputEncoding", {
          get: function() {
            return null;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "strictErrorChecking", {
          get: function() {
            return false;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "xmlEncoding", {
          get: function() {
            if (this.children.length !== 0 && this.children[0].type === NodeType.Declaration) {
              return this.children[0].encoding;
            } else {
              return null;
            }
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "xmlStandalone", {
          get: function() {
            if (this.children.length !== 0 && this.children[0].type === NodeType.Declaration) {
              return this.children[0].standalone === "yes";
            } else {
              return false;
            }
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "xmlVersion", {
          get: function() {
            if (this.children.length !== 0 && this.children[0].type === NodeType.Declaration) {
              return this.children[0].version;
            } else {
              return "1.0";
            }
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "URL", {
          get: function() {
            return this.documentURI;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "origin", {
          get: function() {
            return null;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "compatMode", {
          get: function() {
            return null;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "characterSet", {
          get: function() {
            return null;
          }
        });
        Object.defineProperty(XMLDocument2.prototype, "contentType", {
          get: function() {
            return null;
          }
        });
        XMLDocument2.prototype.end = function(writer) {
          var writerOptions;
          writerOptions = {};
          if (!writer) {
            writer = this.options.writer;
          } else if (isPlainObject(writer)) {
            writerOptions = writer;
            writer = this.options.writer;
          }
          return writer.document(this, writer.filterOptions(writerOptions));
        };
        XMLDocument2.prototype.toString = function(options) {
          return this.options.writer.document(this, this.options.writer.filterOptions(options));
        };
        XMLDocument2.prototype.createElement = function(tagName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createDocumentFragment = function() {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createTextNode = function(data) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createComment = function(data) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createCDATASection = function(data) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createProcessingInstruction = function(target, data) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createAttribute = function(name) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createEntityReference = function(name) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.getElementsByTagName = function(tagname) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.importNode = function(importedNode, deep) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createElementNS = function(namespaceURI, qualifiedName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createAttributeNS = function(namespaceURI, qualifiedName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.getElementsByTagNameNS = function(namespaceURI, localName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.getElementById = function(elementId) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.adoptNode = function(source) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.normalizeDocument = function() {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.renameNode = function(node, namespaceURI, qualifiedName) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.getElementsByClassName = function(classNames) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createEvent = function(eventInterface) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createRange = function() {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createNodeIterator = function(root, whatToShow, filter) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        XMLDocument2.prototype.createTreeWalker = function(root, whatToShow, filter) {
          throw new Error("This DOM method is not implemented." + this.debugInfo());
        };
        return XMLDocument2;
      }(XMLNode);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLDocumentCB.js
var require_XMLDocumentCB = __commonJS({
  "node_modules/xmlbuilder/lib/XMLDocumentCB.js"(exports2, module2) {
    (function() {
      var NodeType, WriterState, XMLAttribute, XMLCData, XMLComment, XMLDTDAttList, XMLDTDElement, XMLDTDEntity, XMLDTDNotation, XMLDeclaration, XMLDocType, XMLDocument, XMLDocumentCB, XMLElement, XMLProcessingInstruction, XMLRaw, XMLStringWriter, XMLStringifier, XMLText, getValue, isFunction, isObject, isPlainObject, ref, hasProp = {}.hasOwnProperty;
      ref = require_Utility(), isObject = ref.isObject, isFunction = ref.isFunction, isPlainObject = ref.isPlainObject, getValue = ref.getValue;
      NodeType = require_NodeType();
      XMLDocument = require_XMLDocument();
      XMLElement = require_XMLElement();
      XMLCData = require_XMLCData();
      XMLComment = require_XMLComment();
      XMLRaw = require_XMLRaw();
      XMLText = require_XMLText();
      XMLProcessingInstruction = require_XMLProcessingInstruction();
      XMLDeclaration = require_XMLDeclaration();
      XMLDocType = require_XMLDocType();
      XMLDTDAttList = require_XMLDTDAttList();
      XMLDTDEntity = require_XMLDTDEntity();
      XMLDTDElement = require_XMLDTDElement();
      XMLDTDNotation = require_XMLDTDNotation();
      XMLAttribute = require_XMLAttribute();
      XMLStringifier = require_XMLStringifier();
      XMLStringWriter = require_XMLStringWriter();
      WriterState = require_WriterState();
      module2.exports = XMLDocumentCB = function() {
        function XMLDocumentCB2(options, onData, onEnd) {
          var writerOptions;
          this.name = "?xml";
          this.type = NodeType.Document;
          options || (options = {});
          writerOptions = {};
          if (!options.writer) {
            options.writer = new XMLStringWriter();
          } else if (isPlainObject(options.writer)) {
            writerOptions = options.writer;
            options.writer = new XMLStringWriter();
          }
          this.options = options;
          this.writer = options.writer;
          this.writerOptions = this.writer.filterOptions(writerOptions);
          this.stringify = new XMLStringifier(options);
          this.onDataCallback = onData || function() {
          };
          this.onEndCallback = onEnd || function() {
          };
          this.currentNode = null;
          this.currentLevel = -1;
          this.openTags = {};
          this.documentStarted = false;
          this.documentCompleted = false;
          this.root = null;
        }
        XMLDocumentCB2.prototype.createChildNode = function(node) {
          var att, attName, attributes, child, i, len, ref1, ref2;
          switch (node.type) {
            case NodeType.CData:
              this.cdata(node.value);
              break;
            case NodeType.Comment:
              this.comment(node.value);
              break;
            case NodeType.Element:
              attributes = {};
              ref1 = node.attribs;
              for (attName in ref1) {
                if (!hasProp.call(ref1, attName)) continue;
                att = ref1[attName];
                attributes[attName] = att.value;
              }
              this.node(node.name, attributes);
              break;
            case NodeType.Dummy:
              this.dummy();
              break;
            case NodeType.Raw:
              this.raw(node.value);
              break;
            case NodeType.Text:
              this.text(node.value);
              break;
            case NodeType.ProcessingInstruction:
              this.instruction(node.target, node.value);
              break;
            default:
              throw new Error("This XML node type is not supported in a JS object: " + node.constructor.name);
          }
          ref2 = node.children;
          for (i = 0, len = ref2.length; i < len; i++) {
            child = ref2[i];
            this.createChildNode(child);
            if (child.type === NodeType.Element) {
              this.up();
            }
          }
          return this;
        };
        XMLDocumentCB2.prototype.dummy = function() {
          return this;
        };
        XMLDocumentCB2.prototype.node = function(name, attributes, text) {
          var ref1;
          if (name == null) {
            throw new Error("Missing node name.");
          }
          if (this.root && this.currentLevel === -1) {
            throw new Error("Document can only have one root node. " + this.debugInfo(name));
          }
          this.openCurrent();
          name = getValue(name);
          if (attributes == null) {
            attributes = {};
          }
          attributes = getValue(attributes);
          if (!isObject(attributes)) {
            ref1 = [attributes, text], text = ref1[0], attributes = ref1[1];
          }
          this.currentNode = new XMLElement(this, name, attributes);
          this.currentNode.children = false;
          this.currentLevel++;
          this.openTags[this.currentLevel] = this.currentNode;
          if (text != null) {
            this.text(text);
          }
          return this;
        };
        XMLDocumentCB2.prototype.element = function(name, attributes, text) {
          var child, i, len, oldValidationFlag, ref1, root;
          if (this.currentNode && this.currentNode.type === NodeType.DocType) {
            this.dtdElement.apply(this, arguments);
          } else {
            if (Array.isArray(name) || isObject(name) || isFunction(name)) {
              oldValidationFlag = this.options.noValidation;
              this.options.noValidation = true;
              root = new XMLDocument(this.options).element("TEMP_ROOT");
              root.element(name);
              this.options.noValidation = oldValidationFlag;
              ref1 = root.children;
              for (i = 0, len = ref1.length; i < len; i++) {
                child = ref1[i];
                this.createChildNode(child);
                if (child.type === NodeType.Element) {
                  this.up();
                }
              }
            } else {
              this.node(name, attributes, text);
            }
          }
          return this;
        };
        XMLDocumentCB2.prototype.attribute = function(name, value) {
          var attName, attValue;
          if (!this.currentNode || this.currentNode.children) {
            throw new Error("att() can only be used immediately after an ele() call in callback mode. " + this.debugInfo(name));
          }
          if (name != null) {
            name = getValue(name);
          }
          if (isObject(name)) {
            for (attName in name) {
              if (!hasProp.call(name, attName)) continue;
              attValue = name[attName];
              this.attribute(attName, attValue);
            }
          } else {
            if (isFunction(value)) {
              value = value.apply();
            }
            if (this.options.keepNullAttributes && value == null) {
              this.currentNode.attribs[name] = new XMLAttribute(this, name, "");
            } else if (value != null) {
              this.currentNode.attribs[name] = new XMLAttribute(this, name, value);
            }
          }
          return this;
        };
        XMLDocumentCB2.prototype.text = function(value) {
          var node;
          this.openCurrent();
          node = new XMLText(this, value);
          this.onData(this.writer.text(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.cdata = function(value) {
          var node;
          this.openCurrent();
          node = new XMLCData(this, value);
          this.onData(this.writer.cdata(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.comment = function(value) {
          var node;
          this.openCurrent();
          node = new XMLComment(this, value);
          this.onData(this.writer.comment(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.raw = function(value) {
          var node;
          this.openCurrent();
          node = new XMLRaw(this, value);
          this.onData(this.writer.raw(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.instruction = function(target, value) {
          var i, insTarget, insValue, len, node;
          this.openCurrent();
          if (target != null) {
            target = getValue(target);
          }
          if (value != null) {
            value = getValue(value);
          }
          if (Array.isArray(target)) {
            for (i = 0, len = target.length; i < len; i++) {
              insTarget = target[i];
              this.instruction(insTarget);
            }
          } else if (isObject(target)) {
            for (insTarget in target) {
              if (!hasProp.call(target, insTarget)) continue;
              insValue = target[insTarget];
              this.instruction(insTarget, insValue);
            }
          } else {
            if (isFunction(value)) {
              value = value.apply();
            }
            node = new XMLProcessingInstruction(this, target, value);
            this.onData(this.writer.processingInstruction(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          }
          return this;
        };
        XMLDocumentCB2.prototype.declaration = function(version, encoding, standalone) {
          var node;
          this.openCurrent();
          if (this.documentStarted) {
            throw new Error("declaration() must be the first node.");
          }
          node = new XMLDeclaration(this, version, encoding, standalone);
          this.onData(this.writer.declaration(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.doctype = function(root, pubID, sysID) {
          this.openCurrent();
          if (root == null) {
            throw new Error("Missing root node name.");
          }
          if (this.root) {
            throw new Error("dtd() must come before the root node.");
          }
          this.currentNode = new XMLDocType(this, pubID, sysID);
          this.currentNode.rootNodeName = root;
          this.currentNode.children = false;
          this.currentLevel++;
          this.openTags[this.currentLevel] = this.currentNode;
          return this;
        };
        XMLDocumentCB2.prototype.dtdElement = function(name, value) {
          var node;
          this.openCurrent();
          node = new XMLDTDElement(this, name, value);
          this.onData(this.writer.dtdElement(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.attList = function(elementName, attributeName, attributeType, defaultValueType, defaultValue) {
          var node;
          this.openCurrent();
          node = new XMLDTDAttList(this, elementName, attributeName, attributeType, defaultValueType, defaultValue);
          this.onData(this.writer.dtdAttList(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.entity = function(name, value) {
          var node;
          this.openCurrent();
          node = new XMLDTDEntity(this, false, name, value);
          this.onData(this.writer.dtdEntity(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.pEntity = function(name, value) {
          var node;
          this.openCurrent();
          node = new XMLDTDEntity(this, true, name, value);
          this.onData(this.writer.dtdEntity(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.notation = function(name, value) {
          var node;
          this.openCurrent();
          node = new XMLDTDNotation(this, name, value);
          this.onData(this.writer.dtdNotation(node, this.writerOptions, this.currentLevel + 1), this.currentLevel + 1);
          return this;
        };
        XMLDocumentCB2.prototype.up = function() {
          if (this.currentLevel < 0) {
            throw new Error("The document node has no parent.");
          }
          if (this.currentNode) {
            if (this.currentNode.children) {
              this.closeNode(this.currentNode);
            } else {
              this.openNode(this.currentNode);
            }
            this.currentNode = null;
          } else {
            this.closeNode(this.openTags[this.currentLevel]);
          }
          delete this.openTags[this.currentLevel];
          this.currentLevel--;
          return this;
        };
        XMLDocumentCB2.prototype.end = function() {
          while (this.currentLevel >= 0) {
            this.up();
          }
          return this.onEnd();
        };
        XMLDocumentCB2.prototype.openCurrent = function() {
          if (this.currentNode) {
            this.currentNode.children = true;
            return this.openNode(this.currentNode);
          }
        };
        XMLDocumentCB2.prototype.openNode = function(node) {
          var att, chunk, name, ref1;
          if (!node.isOpen) {
            if (!this.root && this.currentLevel === 0 && node.type === NodeType.Element) {
              this.root = node;
            }
            chunk = "";
            if (node.type === NodeType.Element) {
              this.writerOptions.state = WriterState.OpenTag;
              chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + "<" + node.name;
              ref1 = node.attribs;
              for (name in ref1) {
                if (!hasProp.call(ref1, name)) continue;
                att = ref1[name];
                chunk += this.writer.attribute(att, this.writerOptions, this.currentLevel);
              }
              chunk += (node.children ? ">" : "/>") + this.writer.endline(node, this.writerOptions, this.currentLevel);
              this.writerOptions.state = WriterState.InsideTag;
            } else {
              this.writerOptions.state = WriterState.OpenTag;
              chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + "<!DOCTYPE " + node.rootNodeName;
              if (node.pubID && node.sysID) {
                chunk += ' PUBLIC "' + node.pubID + '" "' + node.sysID + '"';
              } else if (node.sysID) {
                chunk += ' SYSTEM "' + node.sysID + '"';
              }
              if (node.children) {
                chunk += " [";
                this.writerOptions.state = WriterState.InsideTag;
              } else {
                this.writerOptions.state = WriterState.CloseTag;
                chunk += ">";
              }
              chunk += this.writer.endline(node, this.writerOptions, this.currentLevel);
            }
            this.onData(chunk, this.currentLevel);
            return node.isOpen = true;
          }
        };
        XMLDocumentCB2.prototype.closeNode = function(node) {
          var chunk;
          if (!node.isClosed) {
            chunk = "";
            this.writerOptions.state = WriterState.CloseTag;
            if (node.type === NodeType.Element) {
              chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + "</" + node.name + ">" + this.writer.endline(node, this.writerOptions, this.currentLevel);
            } else {
              chunk = this.writer.indent(node, this.writerOptions, this.currentLevel) + "]>" + this.writer.endline(node, this.writerOptions, this.currentLevel);
            }
            this.writerOptions.state = WriterState.None;
            this.onData(chunk, this.currentLevel);
            return node.isClosed = true;
          }
        };
        XMLDocumentCB2.prototype.onData = function(chunk, level) {
          this.documentStarted = true;
          return this.onDataCallback(chunk, level + 1);
        };
        XMLDocumentCB2.prototype.onEnd = function() {
          this.documentCompleted = true;
          return this.onEndCallback();
        };
        XMLDocumentCB2.prototype.debugInfo = function(name) {
          if (name == null) {
            return "";
          } else {
            return "node: <" + name + ">";
          }
        };
        XMLDocumentCB2.prototype.ele = function() {
          return this.element.apply(this, arguments);
        };
        XMLDocumentCB2.prototype.nod = function(name, attributes, text) {
          return this.node(name, attributes, text);
        };
        XMLDocumentCB2.prototype.txt = function(value) {
          return this.text(value);
        };
        XMLDocumentCB2.prototype.dat = function(value) {
          return this.cdata(value);
        };
        XMLDocumentCB2.prototype.com = function(value) {
          return this.comment(value);
        };
        XMLDocumentCB2.prototype.ins = function(target, value) {
          return this.instruction(target, value);
        };
        XMLDocumentCB2.prototype.dec = function(version, encoding, standalone) {
          return this.declaration(version, encoding, standalone);
        };
        XMLDocumentCB2.prototype.dtd = function(root, pubID, sysID) {
          return this.doctype(root, pubID, sysID);
        };
        XMLDocumentCB2.prototype.e = function(name, attributes, text) {
          return this.element(name, attributes, text);
        };
        XMLDocumentCB2.prototype.n = function(name, attributes, text) {
          return this.node(name, attributes, text);
        };
        XMLDocumentCB2.prototype.t = function(value) {
          return this.text(value);
        };
        XMLDocumentCB2.prototype.d = function(value) {
          return this.cdata(value);
        };
        XMLDocumentCB2.prototype.c = function(value) {
          return this.comment(value);
        };
        XMLDocumentCB2.prototype.r = function(value) {
          return this.raw(value);
        };
        XMLDocumentCB2.prototype.i = function(target, value) {
          return this.instruction(target, value);
        };
        XMLDocumentCB2.prototype.att = function() {
          if (this.currentNode && this.currentNode.type === NodeType.DocType) {
            return this.attList.apply(this, arguments);
          } else {
            return this.attribute.apply(this, arguments);
          }
        };
        XMLDocumentCB2.prototype.a = function() {
          if (this.currentNode && this.currentNode.type === NodeType.DocType) {
            return this.attList.apply(this, arguments);
          } else {
            return this.attribute.apply(this, arguments);
          }
        };
        XMLDocumentCB2.prototype.ent = function(name, value) {
          return this.entity(name, value);
        };
        XMLDocumentCB2.prototype.pent = function(name, value) {
          return this.pEntity(name, value);
        };
        XMLDocumentCB2.prototype.not = function(name, value) {
          return this.notation(name, value);
        };
        return XMLDocumentCB2;
      }();
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/XMLStreamWriter.js
var require_XMLStreamWriter = __commonJS({
  "node_modules/xmlbuilder/lib/XMLStreamWriter.js"(exports2, module2) {
    (function() {
      var NodeType, WriterState, XMLStreamWriter, XMLWriterBase, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      NodeType = require_NodeType();
      XMLWriterBase = require_XMLWriterBase();
      WriterState = require_WriterState();
      module2.exports = XMLStreamWriter = function(superClass) {
        extend(XMLStreamWriter2, superClass);
        function XMLStreamWriter2(stream, options) {
          this.stream = stream;
          XMLStreamWriter2.__super__.constructor.call(this, options);
        }
        XMLStreamWriter2.prototype.endline = function(node, options, level) {
          if (node.isLastRootNode && options.state === WriterState.CloseTag) {
            return "";
          } else {
            return XMLStreamWriter2.__super__.endline.call(this, node, options, level);
          }
        };
        XMLStreamWriter2.prototype.document = function(doc, options) {
          var child, i, j, k, len, len1, ref, ref1, results;
          ref = doc.children;
          for (i = j = 0, len = ref.length; j < len; i = ++j) {
            child = ref[i];
            child.isLastRootNode = i === doc.children.length - 1;
          }
          options = this.filterOptions(options);
          ref1 = doc.children;
          results = [];
          for (k = 0, len1 = ref1.length; k < len1; k++) {
            child = ref1[k];
            results.push(this.writeChildNode(child, options, 0));
          }
          return results;
        };
        XMLStreamWriter2.prototype.attribute = function(att, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.attribute.call(this, att, options, level));
        };
        XMLStreamWriter2.prototype.cdata = function(node, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.cdata.call(this, node, options, level));
        };
        XMLStreamWriter2.prototype.comment = function(node, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.comment.call(this, node, options, level));
        };
        XMLStreamWriter2.prototype.declaration = function(node, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.declaration.call(this, node, options, level));
        };
        XMLStreamWriter2.prototype.docType = function(node, options, level) {
          var child, j, len, ref;
          level || (level = 0);
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          this.stream.write(this.indent(node, options, level));
          this.stream.write("<!DOCTYPE " + node.root().name);
          if (node.pubID && node.sysID) {
            this.stream.write(' PUBLIC "' + node.pubID + '" "' + node.sysID + '"');
          } else if (node.sysID) {
            this.stream.write(' SYSTEM "' + node.sysID + '"');
          }
          if (node.children.length > 0) {
            this.stream.write(" [");
            this.stream.write(this.endline(node, options, level));
            options.state = WriterState.InsideTag;
            ref = node.children;
            for (j = 0, len = ref.length; j < len; j++) {
              child = ref[j];
              this.writeChildNode(child, options, level + 1);
            }
            options.state = WriterState.CloseTag;
            this.stream.write("]");
          }
          options.state = WriterState.CloseTag;
          this.stream.write(options.spaceBeforeSlash + ">");
          this.stream.write(this.endline(node, options, level));
          options.state = WriterState.None;
          return this.closeNode(node, options, level);
        };
        XMLStreamWriter2.prototype.element = function(node, options, level) {
          var att, child, childNodeCount, firstChildNode, j, len, name, prettySuppressed, ref, ref1;
          level || (level = 0);
          this.openNode(node, options, level);
          options.state = WriterState.OpenTag;
          this.stream.write(this.indent(node, options, level) + "<" + node.name);
          ref = node.attribs;
          for (name in ref) {
            if (!hasProp.call(ref, name)) continue;
            att = ref[name];
            this.attribute(att, options, level);
          }
          childNodeCount = node.children.length;
          firstChildNode = childNodeCount === 0 ? null : node.children[0];
          if (childNodeCount === 0 || node.children.every(function(e) {
            return (e.type === NodeType.Text || e.type === NodeType.Raw) && e.value === "";
          })) {
            if (options.allowEmpty) {
              this.stream.write(">");
              options.state = WriterState.CloseTag;
              this.stream.write("</" + node.name + ">");
            } else {
              options.state = WriterState.CloseTag;
              this.stream.write(options.spaceBeforeSlash + "/>");
            }
          } else if (options.pretty && childNodeCount === 1 && (firstChildNode.type === NodeType.Text || firstChildNode.type === NodeType.Raw) && firstChildNode.value != null) {
            this.stream.write(">");
            options.state = WriterState.InsideTag;
            options.suppressPrettyCount++;
            prettySuppressed = true;
            this.writeChildNode(firstChildNode, options, level + 1);
            options.suppressPrettyCount--;
            prettySuppressed = false;
            options.state = WriterState.CloseTag;
            this.stream.write("</" + node.name + ">");
          } else {
            this.stream.write(">" + this.endline(node, options, level));
            options.state = WriterState.InsideTag;
            ref1 = node.children;
            for (j = 0, len = ref1.length; j < len; j++) {
              child = ref1[j];
              this.writeChildNode(child, options, level + 1);
            }
            options.state = WriterState.CloseTag;
            this.stream.write(this.indent(node, options, level) + "</" + node.name + ">");
          }
          this.stream.write(this.endline(node, options, level));
          options.state = WriterState.None;
          return this.closeNode(node, options, level);
        };
        XMLStreamWriter2.prototype.processingInstruction = function(node, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.processingInstruction.call(this, node, options, level));
        };
        XMLStreamWriter2.prototype.raw = function(node, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.raw.call(this, node, options, level));
        };
        XMLStreamWriter2.prototype.text = function(node, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.text.call(this, node, options, level));
        };
        XMLStreamWriter2.prototype.dtdAttList = function(node, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.dtdAttList.call(this, node, options, level));
        };
        XMLStreamWriter2.prototype.dtdElement = function(node, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.dtdElement.call(this, node, options, level));
        };
        XMLStreamWriter2.prototype.dtdEntity = function(node, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.dtdEntity.call(this, node, options, level));
        };
        XMLStreamWriter2.prototype.dtdNotation = function(node, options, level) {
          return this.stream.write(XMLStreamWriter2.__super__.dtdNotation.call(this, node, options, level));
        };
        return XMLStreamWriter2;
      }(XMLWriterBase);
    }).call(exports2);
  }
});

// node_modules/xmlbuilder/lib/index.js
var require_lib = __commonJS({
  "node_modules/xmlbuilder/lib/index.js"(exports2, module2) {
    (function() {
      var NodeType, WriterState, XMLDOMImplementation, XMLDocument, XMLDocumentCB, XMLStreamWriter, XMLStringWriter, assign, isFunction, ref;
      ref = require_Utility(), assign = ref.assign, isFunction = ref.isFunction;
      XMLDOMImplementation = require_XMLDOMImplementation();
      XMLDocument = require_XMLDocument();
      XMLDocumentCB = require_XMLDocumentCB();
      XMLStringWriter = require_XMLStringWriter();
      XMLStreamWriter = require_XMLStreamWriter();
      NodeType = require_NodeType();
      WriterState = require_WriterState();
      module2.exports.create = function(name, xmldec, doctype, options) {
        var doc, root;
        if (name == null) {
          throw new Error("Root element needs a name.");
        }
        options = assign({}, xmldec, doctype, options);
        doc = new XMLDocument(options);
        root = doc.element(name);
        if (!options.headless) {
          doc.declaration(options);
          if (options.pubID != null || options.sysID != null) {
            doc.dtd(options);
          }
        }
        return root;
      };
      module2.exports.begin = function(options, onData, onEnd) {
        var ref1;
        if (isFunction(options)) {
          ref1 = [options, onData], onData = ref1[0], onEnd = ref1[1];
          options = {};
        }
        if (onData) {
          return new XMLDocumentCB(options, onData, onEnd);
        } else {
          return new XMLDocument(options);
        }
      };
      module2.exports.stringWriter = function(options) {
        return new XMLStringWriter(options);
      };
      module2.exports.streamWriter = function(stream, options) {
        return new XMLStreamWriter(stream, options);
      };
      module2.exports.implementation = new XMLDOMImplementation();
      module2.exports.nodeType = NodeType;
      module2.exports.writerState = WriterState;
    }).call(exports2);
  }
});

// node_modules/xml2js/lib/builder.js
var require_builder = __commonJS({
  "node_modules/xml2js/lib/builder.js"(exports2) {
    (function() {
      "use strict";
      var builder, defaults, escapeCDATA, requiresCDATA, wrapCDATA, hasProp = {}.hasOwnProperty;
      builder = require_lib();
      defaults = require_defaults().defaults;
      requiresCDATA = function(entry) {
        return typeof entry === "string" && (entry.indexOf("&") >= 0 || entry.indexOf(">") >= 0 || entry.indexOf("<") >= 0);
      };
      wrapCDATA = function(entry) {
        return "<![CDATA[" + escapeCDATA(entry) + "]]>";
      };
      escapeCDATA = function(entry) {
        return entry.replace("]]>", "]]]]><![CDATA[>");
      };
      exports2.Builder = function() {
        function Builder(opts) {
          var key, ref, value;
          this.options = {};
          ref = defaults["0.2"];
          for (key in ref) {
            if (!hasProp.call(ref, key)) continue;
            value = ref[key];
            this.options[key] = value;
          }
          for (key in opts) {
            if (!hasProp.call(opts, key)) continue;
            value = opts[key];
            this.options[key] = value;
          }
        }
        Builder.prototype.buildObject = function(rootObj) {
          var attrkey, charkey, render, rootElement, rootName;
          attrkey = this.options.attrkey;
          charkey = this.options.charkey;
          if (Object.keys(rootObj).length === 1 && this.options.rootName === defaults["0.2"].rootName) {
            rootName = Object.keys(rootObj)[0];
            rootObj = rootObj[rootName];
          } else {
            rootName = this.options.rootName;
          }
          render = /* @__PURE__ */ function(_this) {
            return function(element, obj) {
              var attr, child, entry, index, key, value;
              if (typeof obj !== "object") {
                if (_this.options.cdata && requiresCDATA(obj)) {
                  element.raw(wrapCDATA(obj));
                } else {
                  element.txt(obj);
                }
              } else if (Array.isArray(obj)) {
                for (index in obj) {
                  if (!hasProp.call(obj, index)) continue;
                  child = obj[index];
                  for (key in child) {
                    entry = child[key];
                    element = render(element.ele(key), entry).up();
                  }
                }
              } else {
                for (key in obj) {
                  if (!hasProp.call(obj, key)) continue;
                  child = obj[key];
                  if (key === attrkey) {
                    if (typeof child === "object") {
                      for (attr in child) {
                        value = child[attr];
                        element = element.att(attr, value);
                      }
                    }
                  } else if (key === charkey) {
                    if (_this.options.cdata && requiresCDATA(child)) {
                      element = element.raw(wrapCDATA(child));
                    } else {
                      element = element.txt(child);
                    }
                  } else if (Array.isArray(child)) {
                    for (index in child) {
                      if (!hasProp.call(child, index)) continue;
                      entry = child[index];
                      if (typeof entry === "string") {
                        if (_this.options.cdata && requiresCDATA(entry)) {
                          element = element.ele(key).raw(wrapCDATA(entry)).up();
                        } else {
                          element = element.ele(key, entry).up();
                        }
                      } else {
                        element = render(element.ele(key), entry).up();
                      }
                    }
                  } else if (typeof child === "object") {
                    element = render(element.ele(key), child).up();
                  } else {
                    if (typeof child === "string" && _this.options.cdata && requiresCDATA(child)) {
                      element = element.ele(key).raw(wrapCDATA(child)).up();
                    } else {
                      if (child == null) {
                        child = "";
                      }
                      element = element.ele(key, child.toString()).up();
                    }
                  }
                }
              }
              return element;
            };
          }(this);
          rootElement = builder.create(rootName, this.options.xmldec, this.options.doctype, {
            headless: this.options.headless,
            allowSurrogateChars: this.options.allowSurrogateChars
          });
          return render(rootElement, rootObj).end(this.options.renderOpts);
        };
        return Builder;
      }();
    }).call(exports2);
  }
});

// node_modules/sax/lib/sax.js
var require_sax = __commonJS({
  "node_modules/sax/lib/sax.js"(exports2) {
    (function(sax) {
      sax.parser = function(strict, opt) {
        return new SAXParser(strict, opt);
      };
      sax.SAXParser = SAXParser;
      sax.SAXStream = SAXStream;
      sax.createStream = createStream;
      sax.MAX_BUFFER_LENGTH = 64 * 1024;
      var buffers = [
        "comment",
        "sgmlDecl",
        "textNode",
        "tagName",
        "doctype",
        "procInstName",
        "procInstBody",
        "entity",
        "attribName",
        "attribValue",
        "cdata",
        "script"
      ];
      sax.EVENTS = [
        "text",
        "processinginstruction",
        "sgmldeclaration",
        "doctype",
        "comment",
        "opentagstart",
        "attribute",
        "opentag",
        "closetag",
        "opencdata",
        "cdata",
        "closecdata",
        "error",
        "end",
        "ready",
        "script",
        "opennamespace",
        "closenamespace"
      ];
      function SAXParser(strict, opt) {
        if (!(this instanceof SAXParser)) {
          return new SAXParser(strict, opt);
        }
        var parser = this;
        clearBuffers(parser);
        parser.q = parser.c = "";
        parser.bufferCheckPosition = sax.MAX_BUFFER_LENGTH;
        parser.opt = opt || {};
        parser.opt.lowercase = parser.opt.lowercase || parser.opt.lowercasetags;
        parser.looseCase = parser.opt.lowercase ? "toLowerCase" : "toUpperCase";
        parser.tags = [];
        parser.closed = parser.closedRoot = parser.sawRoot = false;
        parser.tag = parser.error = null;
        parser.strict = !!strict;
        parser.noscript = !!(strict || parser.opt.noscript);
        parser.state = S.BEGIN;
        parser.strictEntities = parser.opt.strictEntities;
        parser.ENTITIES = parser.strictEntities ? Object.create(sax.XML_ENTITIES) : Object.create(sax.ENTITIES);
        parser.attribList = [];
        if (parser.opt.xmlns) {
          parser.ns = Object.create(rootNS);
        }
        parser.trackPosition = parser.opt.position !== false;
        if (parser.trackPosition) {
          parser.position = parser.line = parser.column = 0;
        }
        emit(parser, "onready");
      }
      if (!Object.create) {
        Object.create = function(o) {
          function F() {
          }
          F.prototype = o;
          var newf = new F();
          return newf;
        };
      }
      if (!Object.keys) {
        Object.keys = function(o) {
          var a = [];
          for (var i in o) if (o.hasOwnProperty(i)) a.push(i);
          return a;
        };
      }
      function checkBufferLength(parser) {
        var maxAllowed = Math.max(sax.MAX_BUFFER_LENGTH, 10);
        var maxActual = 0;
        for (var i = 0, l = buffers.length; i < l; i++) {
          var len = parser[buffers[i]].length;
          if (len > maxAllowed) {
            switch (buffers[i]) {
              case "textNode":
                closeText(parser);
                break;
              case "cdata":
                emitNode(parser, "oncdata", parser.cdata);
                parser.cdata = "";
                break;
              case "script":
                emitNode(parser, "onscript", parser.script);
                parser.script = "";
                break;
              default:
                error(parser, "Max buffer length exceeded: " + buffers[i]);
            }
          }
          maxActual = Math.max(maxActual, len);
        }
        var m = sax.MAX_BUFFER_LENGTH - maxActual;
        parser.bufferCheckPosition = m + parser.position;
      }
      function clearBuffers(parser) {
        for (var i = 0, l = buffers.length; i < l; i++) {
          parser[buffers[i]] = "";
        }
      }
      function flushBuffers(parser) {
        closeText(parser);
        if (parser.cdata !== "") {
          emitNode(parser, "oncdata", parser.cdata);
          parser.cdata = "";
        }
        if (parser.script !== "") {
          emitNode(parser, "onscript", parser.script);
          parser.script = "";
        }
      }
      SAXParser.prototype = {
        end: function() {
          end(this);
        },
        write,
        resume: function() {
          this.error = null;
          return this;
        },
        close: function() {
          return this.write(null);
        },
        flush: function() {
          flushBuffers(this);
        }
      };
      var Stream;
      try {
        Stream = require("stream").Stream;
      } catch (ex) {
        Stream = function() {
        };
      }
      if (!Stream) Stream = function() {
      };
      var streamWraps = sax.EVENTS.filter(function(ev) {
        return ev !== "error" && ev !== "end";
      });
      function createStream(strict, opt) {
        return new SAXStream(strict, opt);
      }
      function SAXStream(strict, opt) {
        if (!(this instanceof SAXStream)) {
          return new SAXStream(strict, opt);
        }
        Stream.apply(this);
        this._parser = new SAXParser(strict, opt);
        this.writable = true;
        this.readable = true;
        var me = this;
        this._parser.onend = function() {
          me.emit("end");
        };
        this._parser.onerror = function(er) {
          me.emit("error", er);
          me._parser.error = null;
        };
        this._decoder = null;
        streamWraps.forEach(function(ev) {
          Object.defineProperty(me, "on" + ev, {
            get: function() {
              return me._parser["on" + ev];
            },
            set: function(h) {
              if (!h) {
                me.removeAllListeners(ev);
                me._parser["on" + ev] = h;
                return h;
              }
              me.on(ev, h);
            },
            enumerable: true,
            configurable: false
          });
        });
      }
      SAXStream.prototype = Object.create(Stream.prototype, {
        constructor: {
          value: SAXStream
        }
      });
      SAXStream.prototype.write = function(data) {
        if (typeof Buffer === "function" && typeof Buffer.isBuffer === "function" && Buffer.isBuffer(data)) {
          if (!this._decoder) {
            var SD = require("string_decoder").StringDecoder;
            this._decoder = new SD("utf8");
          }
          data = this._decoder.write(data);
        }
        this._parser.write(data.toString());
        this.emit("data", data);
        return true;
      };
      SAXStream.prototype.end = function(chunk) {
        if (chunk && chunk.length) {
          this.write(chunk);
        }
        this._parser.end();
        return true;
      };
      SAXStream.prototype.on = function(ev, handler) {
        var me = this;
        if (!me._parser["on" + ev] && streamWraps.indexOf(ev) !== -1) {
          me._parser["on" + ev] = function() {
            var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
            args.splice(0, 0, ev);
            me.emit.apply(me, args);
          };
        }
        return Stream.prototype.on.call(me, ev, handler);
      };
      var CDATA = "[CDATA[";
      var DOCTYPE = "DOCTYPE";
      var XML_NAMESPACE = "http://www.w3.org/XML/1998/namespace";
      var XMLNS_NAMESPACE = "http://www.w3.org/2000/xmlns/";
      var rootNS = { xml: XML_NAMESPACE, xmlns: XMLNS_NAMESPACE };
      var nameStart = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
      var nameBody = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
      var entityStart = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
      var entityBody = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
      function isWhitespace(c) {
        return c === " " || c === "\n" || c === "\r" || c === "	";
      }
      function isQuote(c) {
        return c === '"' || c === "'";
      }
      function isAttribEnd(c) {
        return c === ">" || isWhitespace(c);
      }
      function isMatch(regex, c) {
        return regex.test(c);
      }
      function notMatch(regex, c) {
        return !isMatch(regex, c);
      }
      var S = 0;
      sax.STATE = {
        BEGIN: S++,
        // leading byte order mark or whitespace
        BEGIN_WHITESPACE: S++,
        // leading whitespace
        TEXT: S++,
        // general stuff
        TEXT_ENTITY: S++,
        // &amp and such.
        OPEN_WAKA: S++,
        // <
        SGML_DECL: S++,
        // <!BLARG
        SGML_DECL_QUOTED: S++,
        // <!BLARG foo "bar
        DOCTYPE: S++,
        // <!DOCTYPE
        DOCTYPE_QUOTED: S++,
        // <!DOCTYPE "//blah
        DOCTYPE_DTD: S++,
        // <!DOCTYPE "//blah" [ ...
        DOCTYPE_DTD_QUOTED: S++,
        // <!DOCTYPE "//blah" [ "foo
        COMMENT_STARTING: S++,
        // <!-
        COMMENT: S++,
        // <!--
        COMMENT_ENDING: S++,
        // <!-- blah -
        COMMENT_ENDED: S++,
        // <!-- blah --
        CDATA: S++,
        // <![CDATA[ something
        CDATA_ENDING: S++,
        // ]
        CDATA_ENDING_2: S++,
        // ]]
        PROC_INST: S++,
        // <?hi
        PROC_INST_BODY: S++,
        // <?hi there
        PROC_INST_ENDING: S++,
        // <?hi "there" ?
        OPEN_TAG: S++,
        // <strong
        OPEN_TAG_SLASH: S++,
        // <strong /
        ATTRIB: S++,
        // <a
        ATTRIB_NAME: S++,
        // <a foo
        ATTRIB_NAME_SAW_WHITE: S++,
        // <a foo _
        ATTRIB_VALUE: S++,
        // <a foo=
        ATTRIB_VALUE_QUOTED: S++,
        // <a foo="bar
        ATTRIB_VALUE_CLOSED: S++,
        // <a foo="bar"
        ATTRIB_VALUE_UNQUOTED: S++,
        // <a foo=bar
        ATTRIB_VALUE_ENTITY_Q: S++,
        // <foo bar="&quot;"
        ATTRIB_VALUE_ENTITY_U: S++,
        // <foo bar=&quot
        CLOSE_TAG: S++,
        // </a
        CLOSE_TAG_SAW_WHITE: S++,
        // </a   >
        SCRIPT: S++,
        // <script> ...
        SCRIPT_ENDING: S++
        // <script> ... <
      };
      sax.XML_ENTITIES = {
        "amp": "&",
        "gt": ">",
        "lt": "<",
        "quot": '"',
        "apos": "'"
      };
      sax.ENTITIES = {
        "amp": "&",
        "gt": ">",
        "lt": "<",
        "quot": '"',
        "apos": "'",
        "AElig": 198,
        "Aacute": 193,
        "Acirc": 194,
        "Agrave": 192,
        "Aring": 197,
        "Atilde": 195,
        "Auml": 196,
        "Ccedil": 199,
        "ETH": 208,
        "Eacute": 201,
        "Ecirc": 202,
        "Egrave": 200,
        "Euml": 203,
        "Iacute": 205,
        "Icirc": 206,
        "Igrave": 204,
        "Iuml": 207,
        "Ntilde": 209,
        "Oacute": 211,
        "Ocirc": 212,
        "Ograve": 210,
        "Oslash": 216,
        "Otilde": 213,
        "Ouml": 214,
        "THORN": 222,
        "Uacute": 218,
        "Ucirc": 219,
        "Ugrave": 217,
        "Uuml": 220,
        "Yacute": 221,
        "aacute": 225,
        "acirc": 226,
        "aelig": 230,
        "agrave": 224,
        "aring": 229,
        "atilde": 227,
        "auml": 228,
        "ccedil": 231,
        "eacute": 233,
        "ecirc": 234,
        "egrave": 232,
        "eth": 240,
        "euml": 235,
        "iacute": 237,
        "icirc": 238,
        "igrave": 236,
        "iuml": 239,
        "ntilde": 241,
        "oacute": 243,
        "ocirc": 244,
        "ograve": 242,
        "oslash": 248,
        "otilde": 245,
        "ouml": 246,
        "szlig": 223,
        "thorn": 254,
        "uacute": 250,
        "ucirc": 251,
        "ugrave": 249,
        "uuml": 252,
        "yacute": 253,
        "yuml": 255,
        "copy": 169,
        "reg": 174,
        "nbsp": 160,
        "iexcl": 161,
        "cent": 162,
        "pound": 163,
        "curren": 164,
        "yen": 165,
        "brvbar": 166,
        "sect": 167,
        "uml": 168,
        "ordf": 170,
        "laquo": 171,
        "not": 172,
        "shy": 173,
        "macr": 175,
        "deg": 176,
        "plusmn": 177,
        "sup1": 185,
        "sup2": 178,
        "sup3": 179,
        "acute": 180,
        "micro": 181,
        "para": 182,
        "middot": 183,
        "cedil": 184,
        "ordm": 186,
        "raquo": 187,
        "frac14": 188,
        "frac12": 189,
        "frac34": 190,
        "iquest": 191,
        "times": 215,
        "divide": 247,
        "OElig": 338,
        "oelig": 339,
        "Scaron": 352,
        "scaron": 353,
        "Yuml": 376,
        "fnof": 402,
        "circ": 710,
        "tilde": 732,
        "Alpha": 913,
        "Beta": 914,
        "Gamma": 915,
        "Delta": 916,
        "Epsilon": 917,
        "Zeta": 918,
        "Eta": 919,
        "Theta": 920,
        "Iota": 921,
        "Kappa": 922,
        "Lambda": 923,
        "Mu": 924,
        "Nu": 925,
        "Xi": 926,
        "Omicron": 927,
        "Pi": 928,
        "Rho": 929,
        "Sigma": 931,
        "Tau": 932,
        "Upsilon": 933,
        "Phi": 934,
        "Chi": 935,
        "Psi": 936,
        "Omega": 937,
        "alpha": 945,
        "beta": 946,
        "gamma": 947,
        "delta": 948,
        "epsilon": 949,
        "zeta": 950,
        "eta": 951,
        "theta": 952,
        "iota": 953,
        "kappa": 954,
        "lambda": 955,
        "mu": 956,
        "nu": 957,
        "xi": 958,
        "omicron": 959,
        "pi": 960,
        "rho": 961,
        "sigmaf": 962,
        "sigma": 963,
        "tau": 964,
        "upsilon": 965,
        "phi": 966,
        "chi": 967,
        "psi": 968,
        "omega": 969,
        "thetasym": 977,
        "upsih": 978,
        "piv": 982,
        "ensp": 8194,
        "emsp": 8195,
        "thinsp": 8201,
        "zwnj": 8204,
        "zwj": 8205,
        "lrm": 8206,
        "rlm": 8207,
        "ndash": 8211,
        "mdash": 8212,
        "lsquo": 8216,
        "rsquo": 8217,
        "sbquo": 8218,
        "ldquo": 8220,
        "rdquo": 8221,
        "bdquo": 8222,
        "dagger": 8224,
        "Dagger": 8225,
        "bull": 8226,
        "hellip": 8230,
        "permil": 8240,
        "prime": 8242,
        "Prime": 8243,
        "lsaquo": 8249,
        "rsaquo": 8250,
        "oline": 8254,
        "frasl": 8260,
        "euro": 8364,
        "image": 8465,
        "weierp": 8472,
        "real": 8476,
        "trade": 8482,
        "alefsym": 8501,
        "larr": 8592,
        "uarr": 8593,
        "rarr": 8594,
        "darr": 8595,
        "harr": 8596,
        "crarr": 8629,
        "lArr": 8656,
        "uArr": 8657,
        "rArr": 8658,
        "dArr": 8659,
        "hArr": 8660,
        "forall": 8704,
        "part": 8706,
        "exist": 8707,
        "empty": 8709,
        "nabla": 8711,
        "isin": 8712,
        "notin": 8713,
        "ni": 8715,
        "prod": 8719,
        "sum": 8721,
        "minus": 8722,
        "lowast": 8727,
        "radic": 8730,
        "prop": 8733,
        "infin": 8734,
        "ang": 8736,
        "and": 8743,
        "or": 8744,
        "cap": 8745,
        "cup": 8746,
        "int": 8747,
        "there4": 8756,
        "sim": 8764,
        "cong": 8773,
        "asymp": 8776,
        "ne": 8800,
        "equiv": 8801,
        "le": 8804,
        "ge": 8805,
        "sub": 8834,
        "sup": 8835,
        "nsub": 8836,
        "sube": 8838,
        "supe": 8839,
        "oplus": 8853,
        "otimes": 8855,
        "perp": 8869,
        "sdot": 8901,
        "lceil": 8968,
        "rceil": 8969,
        "lfloor": 8970,
        "rfloor": 8971,
        "lang": 9001,
        "rang": 9002,
        "loz": 9674,
        "spades": 9824,
        "clubs": 9827,
        "hearts": 9829,
        "diams": 9830
      };
      Object.keys(sax.ENTITIES).forEach(function(key) {
        var e = sax.ENTITIES[key];
        var s2 = typeof e === "number" ? String.fromCharCode(e) : e;
        sax.ENTITIES[key] = s2;
      });
      for (var s in sax.STATE) {
        sax.STATE[sax.STATE[s]] = s;
      }
      S = sax.STATE;
      function emit(parser, event, data) {
        parser[event] && parser[event](data);
      }
      function emitNode(parser, nodeType, data) {
        if (parser.textNode) closeText(parser);
        emit(parser, nodeType, data);
      }
      function closeText(parser) {
        parser.textNode = textopts(parser.opt, parser.textNode);
        if (parser.textNode) emit(parser, "ontext", parser.textNode);
        parser.textNode = "";
      }
      function textopts(opt, text) {
        if (opt.trim) text = text.trim();
        if (opt.normalize) text = text.replace(/\s+/g, " ");
        return text;
      }
      function error(parser, er) {
        closeText(parser);
        if (parser.trackPosition) {
          er += "\nLine: " + parser.line + "\nColumn: " + parser.column + "\nChar: " + parser.c;
        }
        er = new Error(er);
        parser.error = er;
        emit(parser, "onerror", er);
        return parser;
      }
      function end(parser) {
        if (parser.sawRoot && !parser.closedRoot) strictFail(parser, "Unclosed root tag");
        if (parser.state !== S.BEGIN && parser.state !== S.BEGIN_WHITESPACE && parser.state !== S.TEXT) {
          error(parser, "Unexpected end");
        }
        closeText(parser);
        parser.c = "";
        parser.closed = true;
        emit(parser, "onend");
        SAXParser.call(parser, parser.strict, parser.opt);
        return parser;
      }
      function strictFail(parser, message) {
        if (typeof parser !== "object" || !(parser instanceof SAXParser)) {
          throw new Error("bad call to strictFail");
        }
        if (parser.strict) {
          error(parser, message);
        }
      }
      function newTag(parser) {
        if (!parser.strict) parser.tagName = parser.tagName[parser.looseCase]();
        var parent = parser.tags[parser.tags.length - 1] || parser;
        var tag = parser.tag = { name: parser.tagName, attributes: {} };
        if (parser.opt.xmlns) {
          tag.ns = parent.ns;
        }
        parser.attribList.length = 0;
        emitNode(parser, "onopentagstart", tag);
      }
      function qname(name, attribute) {
        var i = name.indexOf(":");
        var qualName = i < 0 ? ["", name] : name.split(":");
        var prefix = qualName[0];
        var local = qualName[1];
        if (attribute && name === "xmlns") {
          prefix = "xmlns";
          local = "";
        }
        return { prefix, local };
      }
      function attrib(parser) {
        if (!parser.strict) {
          parser.attribName = parser.attribName[parser.looseCase]();
        }
        if (parser.attribList.indexOf(parser.attribName) !== -1 || parser.tag.attributes.hasOwnProperty(parser.attribName)) {
          parser.attribName = parser.attribValue = "";
          return;
        }
        if (parser.opt.xmlns) {
          var qn = qname(parser.attribName, true);
          var prefix = qn.prefix;
          var local = qn.local;
          if (prefix === "xmlns") {
            if (local === "xml" && parser.attribValue !== XML_NAMESPACE) {
              strictFail(
                parser,
                "xml: prefix must be bound to " + XML_NAMESPACE + "\nActual: " + parser.attribValue
              );
            } else if (local === "xmlns" && parser.attribValue !== XMLNS_NAMESPACE) {
              strictFail(
                parser,
                "xmlns: prefix must be bound to " + XMLNS_NAMESPACE + "\nActual: " + parser.attribValue
              );
            } else {
              var tag = parser.tag;
              var parent = parser.tags[parser.tags.length - 1] || parser;
              if (tag.ns === parent.ns) {
                tag.ns = Object.create(parent.ns);
              }
              tag.ns[local] = parser.attribValue;
            }
          }
          parser.attribList.push([parser.attribName, parser.attribValue]);
        } else {
          parser.tag.attributes[parser.attribName] = parser.attribValue;
          emitNode(parser, "onattribute", {
            name: parser.attribName,
            value: parser.attribValue
          });
        }
        parser.attribName = parser.attribValue = "";
      }
      function openTag(parser, selfClosing) {
        if (parser.opt.xmlns) {
          var tag = parser.tag;
          var qn = qname(parser.tagName);
          tag.prefix = qn.prefix;
          tag.local = qn.local;
          tag.uri = tag.ns[qn.prefix] || "";
          if (tag.prefix && !tag.uri) {
            strictFail(parser, "Unbound namespace prefix: " + JSON.stringify(parser.tagName));
            tag.uri = qn.prefix;
          }
          var parent = parser.tags[parser.tags.length - 1] || parser;
          if (tag.ns && parent.ns !== tag.ns) {
            Object.keys(tag.ns).forEach(function(p) {
              emitNode(parser, "onopennamespace", {
                prefix: p,
                uri: tag.ns[p]
              });
            });
          }
          for (var i = 0, l = parser.attribList.length; i < l; i++) {
            var nv = parser.attribList[i];
            var name = nv[0];
            var value = nv[1];
            var qualName = qname(name, true);
            var prefix = qualName.prefix;
            var local = qualName.local;
            var uri = prefix === "" ? "" : tag.ns[prefix] || "";
            var a = {
              name,
              value,
              prefix,
              local,
              uri
            };
            if (prefix && prefix !== "xmlns" && !uri) {
              strictFail(parser, "Unbound namespace prefix: " + JSON.stringify(prefix));
              a.uri = prefix;
            }
            parser.tag.attributes[name] = a;
            emitNode(parser, "onattribute", a);
          }
          parser.attribList.length = 0;
        }
        parser.tag.isSelfClosing = !!selfClosing;
        parser.sawRoot = true;
        parser.tags.push(parser.tag);
        emitNode(parser, "onopentag", parser.tag);
        if (!selfClosing) {
          if (!parser.noscript && parser.tagName.toLowerCase() === "script") {
            parser.state = S.SCRIPT;
          } else {
            parser.state = S.TEXT;
          }
          parser.tag = null;
          parser.tagName = "";
        }
        parser.attribName = parser.attribValue = "";
        parser.attribList.length = 0;
      }
      function closeTag(parser) {
        if (!parser.tagName) {
          strictFail(parser, "Weird empty close tag.");
          parser.textNode += "</>";
          parser.state = S.TEXT;
          return;
        }
        if (parser.script) {
          if (parser.tagName !== "script") {
            parser.script += "</" + parser.tagName + ">";
            parser.tagName = "";
            parser.state = S.SCRIPT;
            return;
          }
          emitNode(parser, "onscript", parser.script);
          parser.script = "";
        }
        var t = parser.tags.length;
        var tagName = parser.tagName;
        if (!parser.strict) {
          tagName = tagName[parser.looseCase]();
        }
        var closeTo = tagName;
        while (t--) {
          var close = parser.tags[t];
          if (close.name !== closeTo) {
            strictFail(parser, "Unexpected close tag");
          } else {
            break;
          }
        }
        if (t < 0) {
          strictFail(parser, "Unmatched closing tag: " + parser.tagName);
          parser.textNode += "</" + parser.tagName + ">";
          parser.state = S.TEXT;
          return;
        }
        parser.tagName = tagName;
        var s2 = parser.tags.length;
        while (s2-- > t) {
          var tag = parser.tag = parser.tags.pop();
          parser.tagName = parser.tag.name;
          emitNode(parser, "onclosetag", parser.tagName);
          var x = {};
          for (var i in tag.ns) {
            x[i] = tag.ns[i];
          }
          var parent = parser.tags[parser.tags.length - 1] || parser;
          if (parser.opt.xmlns && tag.ns !== parent.ns) {
            Object.keys(tag.ns).forEach(function(p) {
              var n = tag.ns[p];
              emitNode(parser, "onclosenamespace", { prefix: p, uri: n });
            });
          }
        }
        if (t === 0) parser.closedRoot = true;
        parser.tagName = parser.attribValue = parser.attribName = "";
        parser.attribList.length = 0;
        parser.state = S.TEXT;
      }
      function parseEntity(parser) {
        var entity = parser.entity;
        var entityLC = entity.toLowerCase();
        var num;
        var numStr = "";
        if (parser.ENTITIES[entity]) {
          return parser.ENTITIES[entity];
        }
        if (parser.ENTITIES[entityLC]) {
          return parser.ENTITIES[entityLC];
        }
        entity = entityLC;
        if (entity.charAt(0) === "#") {
          if (entity.charAt(1) === "x") {
            entity = entity.slice(2);
            num = parseInt(entity, 16);
            numStr = num.toString(16);
          } else {
            entity = entity.slice(1);
            num = parseInt(entity, 10);
            numStr = num.toString(10);
          }
        }
        entity = entity.replace(/^0+/, "");
        if (isNaN(num) || numStr.toLowerCase() !== entity) {
          strictFail(parser, "Invalid character entity");
          return "&" + parser.entity + ";";
        }
        return String.fromCodePoint(num);
      }
      function beginWhiteSpace(parser, c) {
        if (c === "<") {
          parser.state = S.OPEN_WAKA;
          parser.startTagPosition = parser.position;
        } else if (!isWhitespace(c)) {
          strictFail(parser, "Non-whitespace before first tag.");
          parser.textNode = c;
          parser.state = S.TEXT;
        }
      }
      function charAt(chunk, i) {
        var result = "";
        if (i < chunk.length) {
          result = chunk.charAt(i);
        }
        return result;
      }
      function write(chunk) {
        var parser = this;
        if (this.error) {
          throw this.error;
        }
        if (parser.closed) {
          return error(
            parser,
            "Cannot write after close. Assign an onready handler."
          );
        }
        if (chunk === null) {
          return end(parser);
        }
        if (typeof chunk === "object") {
          chunk = chunk.toString();
        }
        var i = 0;
        var c = "";
        while (true) {
          c = charAt(chunk, i++);
          parser.c = c;
          if (!c) {
            break;
          }
          if (parser.trackPosition) {
            parser.position++;
            if (c === "\n") {
              parser.line++;
              parser.column = 0;
            } else {
              parser.column++;
            }
          }
          switch (parser.state) {
            case S.BEGIN:
              parser.state = S.BEGIN_WHITESPACE;
              if (c === "\uFEFF") {
                continue;
              }
              beginWhiteSpace(parser, c);
              continue;
            case S.BEGIN_WHITESPACE:
              beginWhiteSpace(parser, c);
              continue;
            case S.TEXT:
              if (parser.sawRoot && !parser.closedRoot) {
                var starti = i - 1;
                while (c && c !== "<" && c !== "&") {
                  c = charAt(chunk, i++);
                  if (c && parser.trackPosition) {
                    parser.position++;
                    if (c === "\n") {
                      parser.line++;
                      parser.column = 0;
                    } else {
                      parser.column++;
                    }
                  }
                }
                parser.textNode += chunk.substring(starti, i - 1);
              }
              if (c === "<" && !(parser.sawRoot && parser.closedRoot && !parser.strict)) {
                parser.state = S.OPEN_WAKA;
                parser.startTagPosition = parser.position;
              } else {
                if (!isWhitespace(c) && (!parser.sawRoot || parser.closedRoot)) {
                  strictFail(parser, "Text data outside of root node.");
                }
                if (c === "&") {
                  parser.state = S.TEXT_ENTITY;
                } else {
                  parser.textNode += c;
                }
              }
              continue;
            case S.SCRIPT:
              if (c === "<") {
                parser.state = S.SCRIPT_ENDING;
              } else {
                parser.script += c;
              }
              continue;
            case S.SCRIPT_ENDING:
              if (c === "/") {
                parser.state = S.CLOSE_TAG;
              } else {
                parser.script += "<" + c;
                parser.state = S.SCRIPT;
              }
              continue;
            case S.OPEN_WAKA:
              if (c === "!") {
                parser.state = S.SGML_DECL;
                parser.sgmlDecl = "";
              } else if (isWhitespace(c)) {
              } else if (isMatch(nameStart, c)) {
                parser.state = S.OPEN_TAG;
                parser.tagName = c;
              } else if (c === "/") {
                parser.state = S.CLOSE_TAG;
                parser.tagName = "";
              } else if (c === "?") {
                parser.state = S.PROC_INST;
                parser.procInstName = parser.procInstBody = "";
              } else {
                strictFail(parser, "Unencoded <");
                if (parser.startTagPosition + 1 < parser.position) {
                  var pad = parser.position - parser.startTagPosition;
                  c = new Array(pad).join(" ") + c;
                }
                parser.textNode += "<" + c;
                parser.state = S.TEXT;
              }
              continue;
            case S.SGML_DECL:
              if ((parser.sgmlDecl + c).toUpperCase() === CDATA) {
                emitNode(parser, "onopencdata");
                parser.state = S.CDATA;
                parser.sgmlDecl = "";
                parser.cdata = "";
              } else if (parser.sgmlDecl + c === "--") {
                parser.state = S.COMMENT;
                parser.comment = "";
                parser.sgmlDecl = "";
              } else if ((parser.sgmlDecl + c).toUpperCase() === DOCTYPE) {
                parser.state = S.DOCTYPE;
                if (parser.doctype || parser.sawRoot) {
                  strictFail(
                    parser,
                    "Inappropriately located doctype declaration"
                  );
                }
                parser.doctype = "";
                parser.sgmlDecl = "";
              } else if (c === ">") {
                emitNode(parser, "onsgmldeclaration", parser.sgmlDecl);
                parser.sgmlDecl = "";
                parser.state = S.TEXT;
              } else if (isQuote(c)) {
                parser.state = S.SGML_DECL_QUOTED;
                parser.sgmlDecl += c;
              } else {
                parser.sgmlDecl += c;
              }
              continue;
            case S.SGML_DECL_QUOTED:
              if (c === parser.q) {
                parser.state = S.SGML_DECL;
                parser.q = "";
              }
              parser.sgmlDecl += c;
              continue;
            case S.DOCTYPE:
              if (c === ">") {
                parser.state = S.TEXT;
                emitNode(parser, "ondoctype", parser.doctype);
                parser.doctype = true;
              } else {
                parser.doctype += c;
                if (c === "[") {
                  parser.state = S.DOCTYPE_DTD;
                } else if (isQuote(c)) {
                  parser.state = S.DOCTYPE_QUOTED;
                  parser.q = c;
                }
              }
              continue;
            case S.DOCTYPE_QUOTED:
              parser.doctype += c;
              if (c === parser.q) {
                parser.q = "";
                parser.state = S.DOCTYPE;
              }
              continue;
            case S.DOCTYPE_DTD:
              parser.doctype += c;
              if (c === "]") {
                parser.state = S.DOCTYPE;
              } else if (isQuote(c)) {
                parser.state = S.DOCTYPE_DTD_QUOTED;
                parser.q = c;
              }
              continue;
            case S.DOCTYPE_DTD_QUOTED:
              parser.doctype += c;
              if (c === parser.q) {
                parser.state = S.DOCTYPE_DTD;
                parser.q = "";
              }
              continue;
            case S.COMMENT:
              if (c === "-") {
                parser.state = S.COMMENT_ENDING;
              } else {
                parser.comment += c;
              }
              continue;
            case S.COMMENT_ENDING:
              if (c === "-") {
                parser.state = S.COMMENT_ENDED;
                parser.comment = textopts(parser.opt, parser.comment);
                if (parser.comment) {
                  emitNode(parser, "oncomment", parser.comment);
                }
                parser.comment = "";
              } else {
                parser.comment += "-" + c;
                parser.state = S.COMMENT;
              }
              continue;
            case S.COMMENT_ENDED:
              if (c !== ">") {
                strictFail(parser, "Malformed comment");
                parser.comment += "--" + c;
                parser.state = S.COMMENT;
              } else {
                parser.state = S.TEXT;
              }
              continue;
            case S.CDATA:
              if (c === "]") {
                parser.state = S.CDATA_ENDING;
              } else {
                parser.cdata += c;
              }
              continue;
            case S.CDATA_ENDING:
              if (c === "]") {
                parser.state = S.CDATA_ENDING_2;
              } else {
                parser.cdata += "]" + c;
                parser.state = S.CDATA;
              }
              continue;
            case S.CDATA_ENDING_2:
              if (c === ">") {
                if (parser.cdata) {
                  emitNode(parser, "oncdata", parser.cdata);
                }
                emitNode(parser, "onclosecdata");
                parser.cdata = "";
                parser.state = S.TEXT;
              } else if (c === "]") {
                parser.cdata += "]";
              } else {
                parser.cdata += "]]" + c;
                parser.state = S.CDATA;
              }
              continue;
            case S.PROC_INST:
              if (c === "?") {
                parser.state = S.PROC_INST_ENDING;
              } else if (isWhitespace(c)) {
                parser.state = S.PROC_INST_BODY;
              } else {
                parser.procInstName += c;
              }
              continue;
            case S.PROC_INST_BODY:
              if (!parser.procInstBody && isWhitespace(c)) {
                continue;
              } else if (c === "?") {
                parser.state = S.PROC_INST_ENDING;
              } else {
                parser.procInstBody += c;
              }
              continue;
            case S.PROC_INST_ENDING:
              if (c === ">") {
                emitNode(parser, "onprocessinginstruction", {
                  name: parser.procInstName,
                  body: parser.procInstBody
                });
                parser.procInstName = parser.procInstBody = "";
                parser.state = S.TEXT;
              } else {
                parser.procInstBody += "?" + c;
                parser.state = S.PROC_INST_BODY;
              }
              continue;
            case S.OPEN_TAG:
              if (isMatch(nameBody, c)) {
                parser.tagName += c;
              } else {
                newTag(parser);
                if (c === ">") {
                  openTag(parser);
                } else if (c === "/") {
                  parser.state = S.OPEN_TAG_SLASH;
                } else {
                  if (!isWhitespace(c)) {
                    strictFail(parser, "Invalid character in tag name");
                  }
                  parser.state = S.ATTRIB;
                }
              }
              continue;
            case S.OPEN_TAG_SLASH:
              if (c === ">") {
                openTag(parser, true);
                closeTag(parser);
              } else {
                strictFail(parser, "Forward-slash in opening tag not followed by >");
                parser.state = S.ATTRIB;
              }
              continue;
            case S.ATTRIB:
              if (isWhitespace(c)) {
                continue;
              } else if (c === ">") {
                openTag(parser);
              } else if (c === "/") {
                parser.state = S.OPEN_TAG_SLASH;
              } else if (isMatch(nameStart, c)) {
                parser.attribName = c;
                parser.attribValue = "";
                parser.state = S.ATTRIB_NAME;
              } else {
                strictFail(parser, "Invalid attribute name");
              }
              continue;
            case S.ATTRIB_NAME:
              if (c === "=") {
                parser.state = S.ATTRIB_VALUE;
              } else if (c === ">") {
                strictFail(parser, "Attribute without value");
                parser.attribValue = parser.attribName;
                attrib(parser);
                openTag(parser);
              } else if (isWhitespace(c)) {
                parser.state = S.ATTRIB_NAME_SAW_WHITE;
              } else if (isMatch(nameBody, c)) {
                parser.attribName += c;
              } else {
                strictFail(parser, "Invalid attribute name");
              }
              continue;
            case S.ATTRIB_NAME_SAW_WHITE:
              if (c === "=") {
                parser.state = S.ATTRIB_VALUE;
              } else if (isWhitespace(c)) {
                continue;
              } else {
                strictFail(parser, "Attribute without value");
                parser.tag.attributes[parser.attribName] = "";
                parser.attribValue = "";
                emitNode(parser, "onattribute", {
                  name: parser.attribName,
                  value: ""
                });
                parser.attribName = "";
                if (c === ">") {
                  openTag(parser);
                } else if (isMatch(nameStart, c)) {
                  parser.attribName = c;
                  parser.state = S.ATTRIB_NAME;
                } else {
                  strictFail(parser, "Invalid attribute name");
                  parser.state = S.ATTRIB;
                }
              }
              continue;
            case S.ATTRIB_VALUE:
              if (isWhitespace(c)) {
                continue;
              } else if (isQuote(c)) {
                parser.q = c;
                parser.state = S.ATTRIB_VALUE_QUOTED;
              } else {
                strictFail(parser, "Unquoted attribute value");
                parser.state = S.ATTRIB_VALUE_UNQUOTED;
                parser.attribValue = c;
              }
              continue;
            case S.ATTRIB_VALUE_QUOTED:
              if (c !== parser.q) {
                if (c === "&") {
                  parser.state = S.ATTRIB_VALUE_ENTITY_Q;
                } else {
                  parser.attribValue += c;
                }
                continue;
              }
              attrib(parser);
              parser.q = "";
              parser.state = S.ATTRIB_VALUE_CLOSED;
              continue;
            case S.ATTRIB_VALUE_CLOSED:
              if (isWhitespace(c)) {
                parser.state = S.ATTRIB;
              } else if (c === ">") {
                openTag(parser);
              } else if (c === "/") {
                parser.state = S.OPEN_TAG_SLASH;
              } else if (isMatch(nameStart, c)) {
                strictFail(parser, "No whitespace between attributes");
                parser.attribName = c;
                parser.attribValue = "";
                parser.state = S.ATTRIB_NAME;
              } else {
                strictFail(parser, "Invalid attribute name");
              }
              continue;
            case S.ATTRIB_VALUE_UNQUOTED:
              if (!isAttribEnd(c)) {
                if (c === "&") {
                  parser.state = S.ATTRIB_VALUE_ENTITY_U;
                } else {
                  parser.attribValue += c;
                }
                continue;
              }
              attrib(parser);
              if (c === ">") {
                openTag(parser);
              } else {
                parser.state = S.ATTRIB;
              }
              continue;
            case S.CLOSE_TAG:
              if (!parser.tagName) {
                if (isWhitespace(c)) {
                  continue;
                } else if (notMatch(nameStart, c)) {
                  if (parser.script) {
                    parser.script += "</" + c;
                    parser.state = S.SCRIPT;
                  } else {
                    strictFail(parser, "Invalid tagname in closing tag.");
                  }
                } else {
                  parser.tagName = c;
                }
              } else if (c === ">") {
                closeTag(parser);
              } else if (isMatch(nameBody, c)) {
                parser.tagName += c;
              } else if (parser.script) {
                parser.script += "</" + parser.tagName;
                parser.tagName = "";
                parser.state = S.SCRIPT;
              } else {
                if (!isWhitespace(c)) {
                  strictFail(parser, "Invalid tagname in closing tag");
                }
                parser.state = S.CLOSE_TAG_SAW_WHITE;
              }
              continue;
            case S.CLOSE_TAG_SAW_WHITE:
              if (isWhitespace(c)) {
                continue;
              }
              if (c === ">") {
                closeTag(parser);
              } else {
                strictFail(parser, "Invalid characters in closing tag");
              }
              continue;
            case S.TEXT_ENTITY:
            case S.ATTRIB_VALUE_ENTITY_Q:
            case S.ATTRIB_VALUE_ENTITY_U:
              var returnState;
              var buffer;
              switch (parser.state) {
                case S.TEXT_ENTITY:
                  returnState = S.TEXT;
                  buffer = "textNode";
                  break;
                case S.ATTRIB_VALUE_ENTITY_Q:
                  returnState = S.ATTRIB_VALUE_QUOTED;
                  buffer = "attribValue";
                  break;
                case S.ATTRIB_VALUE_ENTITY_U:
                  returnState = S.ATTRIB_VALUE_UNQUOTED;
                  buffer = "attribValue";
                  break;
              }
              if (c === ";") {
                if (parser.opt.unparsedEntities) {
                  var parsedEntity = parseEntity(parser);
                  parser.entity = "";
                  parser.state = returnState;
                  parser.write(parsedEntity);
                } else {
                  parser[buffer] += parseEntity(parser);
                  parser.entity = "";
                  parser.state = returnState;
                }
              } else if (isMatch(parser.entity.length ? entityBody : entityStart, c)) {
                parser.entity += c;
              } else {
                strictFail(parser, "Invalid character in entity name");
                parser[buffer] += "&" + parser.entity + c;
                parser.entity = "";
                parser.state = returnState;
              }
              continue;
            default: {
              throw new Error(parser, "Unknown state: " + parser.state);
            }
          }
        }
        if (parser.position >= parser.bufferCheckPosition) {
          checkBufferLength(parser);
        }
        return parser;
      }
      if (!String.fromCodePoint) {
        (function() {
          var stringFromCharCode = String.fromCharCode;
          var floor = Math.floor;
          var fromCodePoint = function() {
            var MAX_SIZE = 16384;
            var codeUnits = [];
            var highSurrogate;
            var lowSurrogate;
            var index = -1;
            var length = arguments.length;
            if (!length) {
              return "";
            }
            var result = "";
            while (++index < length) {
              var codePoint = Number(arguments[index]);
              if (!isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
              codePoint < 0 || // not a valid Unicode code point
              codePoint > 1114111 || // not a valid Unicode code point
              floor(codePoint) !== codePoint) {
                throw RangeError("Invalid code point: " + codePoint);
              }
              if (codePoint <= 65535) {
                codeUnits.push(codePoint);
              } else {
                codePoint -= 65536;
                highSurrogate = (codePoint >> 10) + 55296;
                lowSurrogate = codePoint % 1024 + 56320;
                codeUnits.push(highSurrogate, lowSurrogate);
              }
              if (index + 1 === length || codeUnits.length > MAX_SIZE) {
                result += stringFromCharCode.apply(null, codeUnits);
                codeUnits.length = 0;
              }
            }
            return result;
          };
          if (Object.defineProperty) {
            Object.defineProperty(String, "fromCodePoint", {
              value: fromCodePoint,
              configurable: true,
              writable: true
            });
          } else {
            String.fromCodePoint = fromCodePoint;
          }
        })();
      }
    })(typeof exports2 === "undefined" ? exports2.sax = {} : exports2);
  }
});

// node_modules/xml2js/lib/bom.js
var require_bom = __commonJS({
  "node_modules/xml2js/lib/bom.js"(exports2) {
    (function() {
      "use strict";
      exports2.stripBOM = function(str) {
        if (str[0] === "\uFEFF") {
          return str.substring(1);
        } else {
          return str;
        }
      };
    }).call(exports2);
  }
});

// node_modules/xml2js/lib/processors.js
var require_processors = __commonJS({
  "node_modules/xml2js/lib/processors.js"(exports2) {
    (function() {
      "use strict";
      var prefixMatch;
      prefixMatch = new RegExp(/(?!xmlns)^.*:/);
      exports2.normalize = function(str) {
        return str.toLowerCase();
      };
      exports2.firstCharLowerCase = function(str) {
        return str.charAt(0).toLowerCase() + str.slice(1);
      };
      exports2.stripPrefix = function(str) {
        return str.replace(prefixMatch, "");
      };
      exports2.parseNumbers = function(str) {
        if (!isNaN(str)) {
          str = str % 1 === 0 ? parseInt(str, 10) : parseFloat(str);
        }
        return str;
      };
      exports2.parseBooleans = function(str) {
        if (/^(?:true|false)$/i.test(str)) {
          str = str.toLowerCase() === "true";
        }
        return str;
      };
    }).call(exports2);
  }
});

// node_modules/xml2js/lib/parser.js
var require_parser = __commonJS({
  "node_modules/xml2js/lib/parser.js"(exports2) {
    (function() {
      "use strict";
      var bom, defaults, events, isEmpty, processItem, processors, sax, setImmediate, bind = function(fn, me) {
        return function() {
          return fn.apply(me, arguments);
        };
      }, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      sax = require_sax();
      events = require("events");
      bom = require_bom();
      processors = require_processors();
      setImmediate = require("timers").setImmediate;
      defaults = require_defaults().defaults;
      isEmpty = function(thing) {
        return typeof thing === "object" && thing != null && Object.keys(thing).length === 0;
      };
      processItem = function(processors2, item, key) {
        var i, len, process2;
        for (i = 0, len = processors2.length; i < len; i++) {
          process2 = processors2[i];
          item = process2(item, key);
        }
        return item;
      };
      exports2.Parser = function(superClass) {
        extend(Parser, superClass);
        function Parser(opts) {
          this.parseStringPromise = bind(this.parseStringPromise, this);
          this.parseString = bind(this.parseString, this);
          this.reset = bind(this.reset, this);
          this.assignOrPush = bind(this.assignOrPush, this);
          this.processAsync = bind(this.processAsync, this);
          var key, ref, value;
          if (!(this instanceof exports2.Parser)) {
            return new exports2.Parser(opts);
          }
          this.options = {};
          ref = defaults["0.2"];
          for (key in ref) {
            if (!hasProp.call(ref, key)) continue;
            value = ref[key];
            this.options[key] = value;
          }
          for (key in opts) {
            if (!hasProp.call(opts, key)) continue;
            value = opts[key];
            this.options[key] = value;
          }
          if (this.options.xmlns) {
            this.options.xmlnskey = this.options.attrkey + "ns";
          }
          if (this.options.normalizeTags) {
            if (!this.options.tagNameProcessors) {
              this.options.tagNameProcessors = [];
            }
            this.options.tagNameProcessors.unshift(processors.normalize);
          }
          this.reset();
        }
        Parser.prototype.processAsync = function() {
          var chunk, err;
          try {
            if (this.remaining.length <= this.options.chunkSize) {
              chunk = this.remaining;
              this.remaining = "";
              this.saxParser = this.saxParser.write(chunk);
              return this.saxParser.close();
            } else {
              chunk = this.remaining.substr(0, this.options.chunkSize);
              this.remaining = this.remaining.substr(this.options.chunkSize, this.remaining.length);
              this.saxParser = this.saxParser.write(chunk);
              return setImmediate(this.processAsync);
            }
          } catch (error1) {
            err = error1;
            if (!this.saxParser.errThrown) {
              this.saxParser.errThrown = true;
              return this.emit(err);
            }
          }
        };
        Parser.prototype.assignOrPush = function(obj, key, newValue) {
          if (!(key in obj)) {
            if (!this.options.explicitArray) {
              return obj[key] = newValue;
            } else {
              return obj[key] = [newValue];
            }
          } else {
            if (!(obj[key] instanceof Array)) {
              obj[key] = [obj[key]];
            }
            return obj[key].push(newValue);
          }
        };
        Parser.prototype.reset = function() {
          var attrkey, charkey, ontext, stack;
          this.removeAllListeners();
          this.saxParser = sax.parser(this.options.strict, {
            trim: false,
            normalize: false,
            xmlns: this.options.xmlns
          });
          this.saxParser.errThrown = false;
          this.saxParser.onerror = /* @__PURE__ */ function(_this) {
            return function(error) {
              _this.saxParser.resume();
              if (!_this.saxParser.errThrown) {
                _this.saxParser.errThrown = true;
                return _this.emit("error", error);
              }
            };
          }(this);
          this.saxParser.onend = /* @__PURE__ */ function(_this) {
            return function() {
              if (!_this.saxParser.ended) {
                _this.saxParser.ended = true;
                return _this.emit("end", _this.resultObject);
              }
            };
          }(this);
          this.saxParser.ended = false;
          this.EXPLICIT_CHARKEY = this.options.explicitCharkey;
          this.resultObject = null;
          stack = [];
          attrkey = this.options.attrkey;
          charkey = this.options.charkey;
          this.saxParser.onopentag = /* @__PURE__ */ function(_this) {
            return function(node) {
              var key, newValue, obj, processedKey, ref;
              obj = /* @__PURE__ */ Object.create(null);
              obj[charkey] = "";
              if (!_this.options.ignoreAttrs) {
                ref = node.attributes;
                for (key in ref) {
                  if (!hasProp.call(ref, key)) continue;
                  if (!(attrkey in obj) && !_this.options.mergeAttrs) {
                    obj[attrkey] = /* @__PURE__ */ Object.create(null);
                  }
                  newValue = _this.options.attrValueProcessors ? processItem(_this.options.attrValueProcessors, node.attributes[key], key) : node.attributes[key];
                  processedKey = _this.options.attrNameProcessors ? processItem(_this.options.attrNameProcessors, key) : key;
                  if (_this.options.mergeAttrs) {
                    _this.assignOrPush(obj, processedKey, newValue);
                  } else {
                    obj[attrkey][processedKey] = newValue;
                  }
                }
              }
              obj["#name"] = _this.options.tagNameProcessors ? processItem(_this.options.tagNameProcessors, node.name) : node.name;
              if (_this.options.xmlns) {
                obj[_this.options.xmlnskey] = {
                  uri: node.uri,
                  local: node.local
                };
              }
              return stack.push(obj);
            };
          }(this);
          this.saxParser.onclosetag = /* @__PURE__ */ function(_this) {
            return function() {
              var cdata, emptyStr, key, node, nodeName, obj, objClone, old, s, xpath;
              obj = stack.pop();
              nodeName = obj["#name"];
              if (!_this.options.explicitChildren || !_this.options.preserveChildrenOrder) {
                delete obj["#name"];
              }
              if (obj.cdata === true) {
                cdata = obj.cdata;
                delete obj.cdata;
              }
              s = stack[stack.length - 1];
              if (obj[charkey].match(/^\s*$/) && !cdata) {
                emptyStr = obj[charkey];
                delete obj[charkey];
              } else {
                if (_this.options.trim) {
                  obj[charkey] = obj[charkey].trim();
                }
                if (_this.options.normalize) {
                  obj[charkey] = obj[charkey].replace(/\s{2,}/g, " ").trim();
                }
                obj[charkey] = _this.options.valueProcessors ? processItem(_this.options.valueProcessors, obj[charkey], nodeName) : obj[charkey];
                if (Object.keys(obj).length === 1 && charkey in obj && !_this.EXPLICIT_CHARKEY) {
                  obj = obj[charkey];
                }
              }
              if (isEmpty(obj)) {
                if (typeof _this.options.emptyTag === "function") {
                  obj = _this.options.emptyTag();
                } else {
                  obj = _this.options.emptyTag !== "" ? _this.options.emptyTag : emptyStr;
                }
              }
              if (_this.options.validator != null) {
                xpath = "/" + function() {
                  var i, len, results;
                  results = [];
                  for (i = 0, len = stack.length; i < len; i++) {
                    node = stack[i];
                    results.push(node["#name"]);
                  }
                  return results;
                }().concat(nodeName).join("/");
                (function() {
                  var err;
                  try {
                    return obj = _this.options.validator(xpath, s && s[nodeName], obj);
                  } catch (error1) {
                    err = error1;
                    return _this.emit("error", err);
                  }
                })();
              }
              if (_this.options.explicitChildren && !_this.options.mergeAttrs && typeof obj === "object") {
                if (!_this.options.preserveChildrenOrder) {
                  node = /* @__PURE__ */ Object.create(null);
                  if (_this.options.attrkey in obj) {
                    node[_this.options.attrkey] = obj[_this.options.attrkey];
                    delete obj[_this.options.attrkey];
                  }
                  if (!_this.options.charsAsChildren && _this.options.charkey in obj) {
                    node[_this.options.charkey] = obj[_this.options.charkey];
                    delete obj[_this.options.charkey];
                  }
                  if (Object.getOwnPropertyNames(obj).length > 0) {
                    node[_this.options.childkey] = obj;
                  }
                  obj = node;
                } else if (s) {
                  s[_this.options.childkey] = s[_this.options.childkey] || [];
                  objClone = /* @__PURE__ */ Object.create(null);
                  for (key in obj) {
                    if (!hasProp.call(obj, key)) continue;
                    objClone[key] = obj[key];
                  }
                  s[_this.options.childkey].push(objClone);
                  delete obj["#name"];
                  if (Object.keys(obj).length === 1 && charkey in obj && !_this.EXPLICIT_CHARKEY) {
                    obj = obj[charkey];
                  }
                }
              }
              if (stack.length > 0) {
                return _this.assignOrPush(s, nodeName, obj);
              } else {
                if (_this.options.explicitRoot) {
                  old = obj;
                  obj = /* @__PURE__ */ Object.create(null);
                  obj[nodeName] = old;
                }
                _this.resultObject = obj;
                _this.saxParser.ended = true;
                return _this.emit("end", _this.resultObject);
              }
            };
          }(this);
          ontext = /* @__PURE__ */ function(_this) {
            return function(text) {
              var charChild, s;
              s = stack[stack.length - 1];
              if (s) {
                s[charkey] += text;
                if (_this.options.explicitChildren && _this.options.preserveChildrenOrder && _this.options.charsAsChildren && (_this.options.includeWhiteChars || text.replace(/\\n/g, "").trim() !== "")) {
                  s[_this.options.childkey] = s[_this.options.childkey] || [];
                  charChild = {
                    "#name": "__text__"
                  };
                  charChild[charkey] = text;
                  if (_this.options.normalize) {
                    charChild[charkey] = charChild[charkey].replace(/\s{2,}/g, " ").trim();
                  }
                  s[_this.options.childkey].push(charChild);
                }
                return s;
              }
            };
          }(this);
          this.saxParser.ontext = ontext;
          return this.saxParser.oncdata = /* @__PURE__ */ function(_this) {
            return function(text) {
              var s;
              s = ontext(text);
              if (s) {
                return s.cdata = true;
              }
            };
          }(this);
        };
        Parser.prototype.parseString = function(str, cb) {
          var err;
          if (cb != null && typeof cb === "function") {
            this.on("end", function(result) {
              this.reset();
              return cb(null, result);
            });
            this.on("error", function(err2) {
              this.reset();
              return cb(err2);
            });
          }
          try {
            str = str.toString();
            if (str.trim() === "") {
              this.emit("end", null);
              return true;
            }
            str = bom.stripBOM(str);
            if (this.options.async) {
              this.remaining = str;
              setImmediate(this.processAsync);
              return this.saxParser;
            }
            return this.saxParser.write(str).close();
          } catch (error1) {
            err = error1;
            if (!(this.saxParser.errThrown || this.saxParser.ended)) {
              this.emit("error", err);
              return this.saxParser.errThrown = true;
            } else if (this.saxParser.ended) {
              throw err;
            }
          }
        };
        Parser.prototype.parseStringPromise = function(str) {
          return new Promise(/* @__PURE__ */ function(_this) {
            return function(resolve, reject) {
              return _this.parseString(str, function(err, value) {
                if (err) {
                  return reject(err);
                } else {
                  return resolve(value);
                }
              });
            };
          }(this));
        };
        return Parser;
      }(events);
      exports2.parseString = function(str, a, b) {
        var cb, options, parser;
        if (b != null) {
          if (typeof b === "function") {
            cb = b;
          }
          if (typeof a === "object") {
            options = a;
          }
        } else {
          if (typeof a === "function") {
            cb = a;
          }
          options = {};
        }
        parser = new exports2.Parser(options);
        return parser.parseString(str, cb);
      };
      exports2.parseStringPromise = function(str, a) {
        var options, parser;
        if (typeof a === "object") {
          options = a;
        }
        parser = new exports2.Parser(options);
        return parser.parseStringPromise(str);
      };
    }).call(exports2);
  }
});

// node_modules/xml2js/lib/xml2js.js
var require_xml2js = __commonJS({
  "node_modules/xml2js/lib/xml2js.js"(exports2) {
    (function() {
      "use strict";
      var builder, defaults, parser, processors, extend = function(child, parent) {
        for (var key in parent) {
          if (hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
      }, hasProp = {}.hasOwnProperty;
      defaults = require_defaults();
      builder = require_builder();
      parser = require_parser();
      processors = require_processors();
      exports2.defaults = defaults.defaults;
      exports2.processors = processors;
      exports2.ValidationError = function(superClass) {
        extend(ValidationError, superClass);
        function ValidationError(message) {
          this.message = message;
        }
        return ValidationError;
      }(Error);
      exports2.Builder = builder.Builder;
      exports2.Parser = parser.Parser;
      exports2.parseString = parser.parseString;
      exports2.parseStringPromise = parser.parseStringPromise;
    }).call(exports2);
  }
});

// node_modules/braintree/lib/braintree/error_types.js
var require_error_types = __commonJS({
  "node_modules/braintree/lib/braintree/error_types.js"(exports2, module2) {
    "use strict";
    var errorTypes = {
      authenticationError: "authenticationError",
      authorizationError: "authorizationError",
      gatewayTimeoutError: "gatewayTimeoutError",
      invalidChallengeError: "invalidChallengeError",
      invalidKeysError: "invalidKeysError",
      invalidSignatureError: "invalidSignatureError",
      notFoundError: "notFoundError",
      requestTimeoutError: "requestTimeoutError",
      serverError: "serverError",
      serviceUnavailableError: "serviceUnavailableError",
      testOperationPerformedInProductionError: "testOperationPerformedInProductionError",
      tooManyRequestsError: "tooManyRequestsError",
      unexpectedError: "unexpectedError",
      upgradeRequired: "upgradeRequired"
    };
    module2.exports = {
      errorTypes
    };
  }
});

// node_modules/braintree/lib/braintree/exceptions.js
var require_exceptions = __commonJS({
  "node_modules/braintree/lib/braintree/exceptions.js"(exports2, module2) {
    "use strict";
    var errorTypes = require_error_types().errorTypes;
    function errorMaker(type) {
      return function(message) {
        let err = new Error(message || "");
        err.type = err.name = type;
        return err;
      };
    }
    module2.exports = {
      AuthenticationError: errorMaker(errorTypes.authenticationError),
      AuthorizationError: errorMaker(errorTypes.authorizationError),
      GatewayTimeoutError: errorMaker(errorTypes.gatewayTimeoutError),
      InvalidChallengeError: errorMaker(errorTypes.invalidChallengeError),
      InvalidKeysError: errorMaker(errorTypes.invalidKeysError),
      InvalidSignatureError: errorMaker(errorTypes.invalidSignatureError),
      NotFoundError: errorMaker(errorTypes.notFoundError),
      RequestTimeoutError: errorMaker(errorTypes.requestTimeoutError),
      ServerError: errorMaker(errorTypes.serverError),
      ServiceUnavailableError: errorMaker(errorTypes.serviceUnavailableError),
      TestOperationPerformedInProductionError: errorMaker(
        errorTypes.testOperationPerformedInProductionError
      ),
      TooManyRequestsError: errorMaker(errorTypes.tooManyRequestsError),
      UnexpectedError: errorMaker(errorTypes.unexpectedError),
      UpgradeRequired: errorMaker(errorTypes.upgradeRequired)
    };
  }
});

// node_modules/braintree/lib/braintree/util.js
var require_util = __commonJS({
  "node_modules/braintree/lib/braintree/util.js"(exports2, module2) {
    "use strict";
    var exceptions = require_exceptions();
    var Util = class _Util {
      static convertObjectKeysToUnderscores(obj) {
        let newObj = {};
        for (let key in obj) {
          if (!obj.hasOwnProperty(key)) {
            continue;
          }
          let value = obj[key];
          let newKey = _Util.toUnderscore(key);
          if (value instanceof Array) {
            newObj[newKey] = value.map(
              (item) => typeof item === "object" ? _Util.convertObjectKeysToUnderscores(item) : item
            );
          } else if (typeof value === "object") {
            if (value instanceof Date || value === null) {
              newObj[newKey] = value;
            } else {
              newObj[newKey] = _Util.convertObjectKeysToUnderscores(value);
            }
          } else {
            newObj[newKey] = value;
          }
        }
        return newObj;
      }
      static convertObjectKeysToCamelCase(obj) {
        let newObj = {};
        for (let key in obj) {
          if (!obj.hasOwnProperty(key)) {
            continue;
          }
          let value = obj[key];
          let newKey = _Util.toCamelCase(key);
          if (value instanceof Array) {
            newObj[newKey] = value.map(
              (item) => typeof item === "object" ? _Util.convertObjectKeysToCamelCase(item) : item
            );
          } else if (typeof value === "object") {
            if (value instanceof Date || value === null) {
              newObj[newKey] = value;
            } else {
              newObj[newKey] = _Util.convertObjectKeysToCamelCase(value);
            }
          } else {
            newObj[newKey] = value;
          }
        }
        return newObj;
      }
      // eslint-disable-next-line complexity
      static convertNodeToObject(obj) {
        if (typeof obj === "object" && obj["@"]) {
          if (obj["@"].type === "array") {
            let newArray = [];
            Object.keys(obj).forEach((key) => {
              let value = obj[key];
              if (key !== "@") {
                if (value instanceof Array) {
                  for (let item of value) {
                    newArray.push(this.convertNodeToObject(item));
                  }
                } else {
                  newArray.push(this.convertNodeToObject(value));
                }
              }
            });
            return newArray;
          } else if (obj["@"].type === "collection") {
            let newObj = {};
            Object.keys(obj).forEach((key) => {
              let value = obj[key];
              if (key !== "@") {
                newObj[this.toCamelCase(key)] = this.convertNodeToObject(value);
              }
            });
            return newObj;
          } else if (obj["@"].nil === "true") {
            return null;
          } else if (obj["@"].type === "integer") {
            return parseInt(obj["#"], 10);
          } else if (obj["@"].type === "boolean") {
            return obj["#"] === "true";
          }
          return obj["#"];
        } else if (obj instanceof Array) {
          return obj.map((item) => this.convertNodeToObject(item));
        } else if (typeof obj === "object" && this.objectIsEmpty(obj)) {
          return "";
        } else if (typeof obj === "object") {
          let newObj = {};
          Object.keys(obj).forEach((key) => {
            let value = obj[key];
            newObj[this.toCamelCase(key)] = this.convertNodeToObject(value);
          });
          return newObj;
        }
        return obj;
      }
      static objectIsEmpty(obj) {
        if (Object.keys(obj).length !== 0) {
          return false;
        }
        return true;
      }
      static arrayIsEmpty(array) {
        if (!(array instanceof Array)) {
          return false;
        }
        if (array.length > 0) {
          return false;
        }
        return true;
      }
      static toCamelCase(string) {
        return string.replace(
          /([\-\_][a-z0-9])/g,
          (match) => match.toUpperCase().replace("-", "").replace("_", "")
        );
      }
      static toUnderscore(string) {
        return string.replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
      }
      static flatten(array) {
        while (this._containsArray(array)) {
          array = array.reduce((first, rest) => {
            first = first instanceof Array ? first : [first];
            rest = rest instanceof Array ? this.flatten(rest) : rest;
            return first.concat(rest);
          });
        }
        return array;
      }
      static merge(obj1, obj2) {
        for (let key in obj2) {
          if (!obj2.hasOwnProperty(key)) {
            continue;
          }
          let value = obj2[key];
          obj1[key] = value;
        }
        return obj1;
      }
      static without(array1, array2) {
        let newArray = [];
        for (let value of array1) {
          if (!this._containsValue(array2, value)) {
            newArray.push(value);
          }
        }
        return newArray;
      }
      static withoutIgnoreCaseStyle(array1, array2) {
        let newArray = [];
        let array2CamelCased = array2.map((x) => this.toCamelCase(x));
        this.convertObjectKeysToCamelCase(array2);
        for (let value of array1) {
          if (!this._containsValue(array2CamelCased, value) && !this._containsValue(array2CamelCased, this.toCamelCase(value))) {
            newArray.push(value);
          }
        }
        return newArray;
      }
      static flattenKeys(obj, prefix) {
        let keys = [];
        for (let key in obj) {
          if (!obj.hasOwnProperty(key)) {
            continue;
          }
          let value = obj[key];
          if (typeof value === "object") {
            let keyToPush = null;
            if (this.isNumeric(key)) {
              keyToPush = prefix ? prefix : key;
            } else {
              keyToPush = prefix ? prefix + "[" + key + "]" : key;
            }
            keys.push(_Util.flattenKeys(value, keyToPush));
          } else if (prefix) {
            keys.push(prefix + "[" + key + "]");
          } else {
            keys.push(key);
          }
        }
        return this.flatten(keys);
      }
      static isNumeric(value) {
        return !isNaN(value);
      }
      // eslint-disable-next-line consistent-return
      static verifyKeys(keys, obj) {
        let invalidKeys;
        let unrecognizedKeys = this.withoutIgnoreCaseStyle(
          this.flattenKeys(obj),
          keys.valid
        );
        if (keys.ignore) {
          invalidKeys = unrecognizedKeys.filter(function(key) {
            for (let ignoredKey of keys.ignore) {
              if (key.indexOf(ignoredKey) === 0 || _Util.toCamelCase(key).indexOf(ignoredKey) === 0) {
                return false;
              }
            }
            return true;
          });
        } else {
          invalidKeys = unrecognizedKeys;
        }
        if (invalidKeys.length > 0) {
          return exceptions.InvalidKeysError(
            `These keys are invalid: ${invalidKeys.join(", ")}`
          );
        }
      }
      static _containsValue(array, element) {
        return array.indexOf(element) !== -1;
      }
      static _containsArray(array) {
        for (let element of array) {
          if (element instanceof Array) {
            return true;
          }
        }
        return false;
      }
      static zip(...arrays) {
        const longestLength = arrays.reduce(
          (prev, current) => prev > current.length ? prev : current.length,
          0
        );
        const finalArray = [];
        let currentIndex = 0;
        while (currentIndex < longestLength) {
          const nextArray = [];
          const i = currentIndex;
          arrays.forEach((array) => {
            nextArray.push(array[i]);
          });
          finalArray.push(nextArray);
          currentIndex++;
        }
        return finalArray;
      }
    };
    module2.exports = { Util };
  }
});

// node_modules/@braintree/wrap-promise/dist/lib/deferred.js
var require_deferred = __commonJS({
  "node_modules/@braintree/wrap-promise/dist/lib/deferred.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    function deferred(fn) {
      return function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        setTimeout(function() {
          try {
            fn.apply(void 0, args);
          } catch (err) {
            console.log("Error in callback function");
            console.log(err);
          }
        }, 1);
      };
    }
    exports2.deferred = deferred;
  }
});

// node_modules/@braintree/wrap-promise/dist/lib/once.js
var require_once = __commonJS({
  "node_modules/@braintree/wrap-promise/dist/lib/once.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    function once(fn) {
      var called = false;
      return function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        if (!called) {
          called = true;
          fn.apply(void 0, args);
        }
      };
    }
    exports2.once = once;
  }
});

// node_modules/@braintree/wrap-promise/dist/lib/promise-or-callback.js
var require_promise_or_callback = __commonJS({
  "node_modules/@braintree/wrap-promise/dist/lib/promise-or-callback.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    function promiseOrCallback(promise, callback) {
      if (!callback) {
        return promise;
      }
      promise.then(function(data) {
        return callback(null, data);
      }).catch(function(err) {
        return callback(err);
      });
    }
    exports2.promiseOrCallback = promiseOrCallback;
  }
});

// node_modules/@braintree/wrap-promise/dist/wrap-promise.js
var require_wrap_promise = __commonJS({
  "node_modules/@braintree/wrap-promise/dist/wrap-promise.js"(exports2, module2) {
    "use strict";
    var deferred_1 = require_deferred();
    var once_1 = require_once();
    var promise_or_callback_1 = require_promise_or_callback();
    function wrapPromise(fn) {
      return function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        var callback;
        var lastArg = args[args.length - 1];
        if (typeof lastArg === "function") {
          callback = args.pop();
          callback = once_1.once(deferred_1.deferred(callback));
        }
        return promise_or_callback_1.promiseOrCallback(fn.apply(this, args), callback);
      };
    }
    wrapPromise.wrapPrototype = function(target, options) {
      if (options === void 0) {
        options = {};
      }
      var ignoreMethods = options.ignoreMethods || [];
      var includePrivateMethods = options.transformPrivateMethods === true;
      var methods = Object.getOwnPropertyNames(target.prototype).filter(function(method) {
        var isNotPrivateMethod;
        var isNonConstructorFunction = method !== "constructor" && typeof target.prototype[method] === "function";
        var isNotAnIgnoredMethod = ignoreMethods.indexOf(method) === -1;
        if (includePrivateMethods) {
          isNotPrivateMethod = true;
        } else {
          isNotPrivateMethod = method.charAt(0) !== "_";
        }
        return isNonConstructorFunction && isNotPrivateMethod && isNotAnIgnoredMethod;
      });
      methods.forEach(function(method) {
        var original = target.prototype[method];
        target.prototype[method] = wrapPromise(original);
      });
      return target;
    };
    module2.exports = wrapPromise;
  }
});

// node_modules/braintree/lib/braintree/http.js
var require_http = __commonJS({
  "node_modules/braintree/lib/braintree/http.js"(exports2, module2) {
    "use strict";
    var http2 = require("http");
    var https2 = require("https");
    var zlib = require("zlib");
    var Buffer2 = require("buffer").Buffer;
    var fs2 = require("fs");
    var path2 = require("path");
    var version = require_package().version;
    var xml2js = require_xml2js();
    var exceptions = require_exceptions();
    var Util = require_util().Util;
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var Http = class {
      constructor(config) {
        this.config = config;
      }
      checkHttpStatus(status) {
        switch (status.toString()) {
          case "200":
          case "201":
          case "422":
            return null;
          case "401":
            return exceptions.AuthenticationError("Authentication Error");
          case "403":
            return exceptions.AuthorizationError("Authorization Error");
          case "404":
            return exceptions.NotFoundError("Not Found");
          case "408":
            return exceptions.RequestTimeoutError("Request Timeout Error");
          case "426":
            return exceptions.UpgradeRequired("Upgrade Required");
          case "429":
            return exceptions.TooManyRequestsError("Too Many Requests");
          case "500":
            return exceptions.ServerError("Server Error");
          case "503":
            return exceptions.ServiceUnavailableError("Service Unavailable Error");
          case "504":
            return exceptions.GatewayTimeoutError("Gateway Timeout Error");
          default:
            return exceptions.UnexpectedError(
              `Unexpected HTTP response: ${status}`
            );
        }
      }
      delete(url) {
        return this.httpRequest("DELETE", url, null);
      }
      get(url) {
        return this.httpRequest("GET", url, null);
      }
      post(url, body) {
        return this.httpRequest("POST", url, body);
      }
      postMultipart(url, body, file) {
        return this.httpRequest("POST", url, body, file);
      }
      put(url, body) {
        return this.httpRequest("PUT", url, body);
      }
      httpRequest(method, url, body, file, host, port, headers) {
        let boundary, requestBody, requestAborted;
        let client = this.config.environment.ssl ? https2 : http2;
        let options = {
          host: host || this.config.environment.server,
          port: port || this.config.environment.port,
          method,
          path: url,
          headers: Object.assign({}, this._headers(), headers)
        };
        if (this.config.customHttpAgent) {
          options.agent = this.config.customHttpAgent;
        }
        if (file) {
          boundary = "boundary" + Date.now();
          requestBody = this._prepareMultipart(boundary, body, file);
          options.headers["Content-Type"] = `multipart/form-data; boundary=${boundary}`;
        } else if (body) {
          if ("application/json".match(options.headers.Accept)) {
            requestBody = JSON.stringify(body);
          } else {
            requestBody = JSON.stringify(Util.convertObjectKeysToUnderscores(body));
          }
        }
        if (requestBody) {
          options.headers["Content-Length"] = Buffer2.byteLength(requestBody).toString();
        }
        return new Promise((resolve, reject) => {
          let theRequest = client.request(options, (response) => {
            let chunks = [];
            response.on("data", (responseBody) => {
              chunks.push(responseBody);
            });
            response.on("end", () => {
              let buffer = Buffer2.concat(chunks);
              let error = this.checkHttpStatus(response.statusCode);
              if (error) {
                reject(error);
                return;
              }
              if (buffer.length > 0) {
                if (response.headers["content-encoding"] === "gzip") {
                  zlib.gunzip(buffer, (gunzipError, result) => {
                    if (gunzipError) {
                      reject(gunzipError);
                    } else {
                      parseResponse(
                        result.toString("utf8"),
                        response.headers["content-type"]
                      );
                    }
                  });
                } else {
                  parseResponse(
                    buffer.toString("utf8"),
                    response.headers["content-type"]
                  );
                }
              } else {
                resolve();
              }
            });
            response.on("error", function(err) {
              let error = exceptions.UnexpectedError(
                `Unexpected response error: ${err}`
              );
              reject(error);
            });
          });
          function parseResponse(responseBody, contentType) {
            if (responseBody.match(/^\s+$/)) {
              resolve({});
            } else if (contentType && contentType.match("application/xml")) {
              xml2js.parseStringPromise(responseBody, {
                attrkey: "@",
                charkey: "#",
                explicitArray: false
              }).then((result) => {
                resolve(Util.convertNodeToObject(result));
              }).catch(reject);
            } else if (contentType && contentType.match("application/json")) {
              resolve(JSON.parse(responseBody));
            } else {
              resolve(responseBody);
            }
          }
          function timeoutHandler() {
            theRequest.abort();
            requestAborted = true;
            let error = exceptions.UnexpectedError("Request timed out");
            reject(error);
          }
          theRequest.setTimeout(this.config.timeout, timeoutHandler);
          let requestSocket;
          theRequest.on("socket", (socket) => {
            requestSocket = socket;
          });
          theRequest.on("error", (err) => {
            if (requestAborted) {
              return;
            }
            if (this.config.timeout > 0 && requestSocket) {
              requestSocket.removeListener("timeout", timeoutHandler);
            }
            let error = exceptions.UnexpectedError(
              `Unexpected request error: ${err}`
            );
            reject(error);
          });
          if (body) {
            theRequest.write(requestBody);
          }
          theRequest.end();
        });
      }
      _prepareMultipart(boundary, body, file) {
        let requestBody = Buffer2.concat([this._filePart("file", file, boundary)]);
        for (const key of Object.keys(body)) {
          let val = body[key];
          requestBody = Buffer2.concat([
            requestBody,
            this._formPart(key, val, boundary)
          ]);
        }
        return Buffer2.concat([requestBody, Buffer2.from(`--${boundary}--\r
\r
`)]);
      }
      _partHeader(key, filename, boundary) {
        let part = `--${boundary}`;
        part += "\r\n";
        part += `Content-Disposition: form-data; name="${key}"`;
        if (filename) {
          part += `; filename="${filename}"`;
          part += "\r\n";
          part += `Content-Type: ${this._filetype(filename)}`;
        }
        part += "\r\n\r\n";
        return part;
      }
      _formPart(key, formPart, boundary) {
        return Buffer2.concat([
          Buffer2.from(this._partHeader(key, null, boundary)),
          Buffer2.from(formPart + "\r\n")
        ]);
      }
      _filePart(key, readStream, boundary) {
        let part = Buffer2.from(
          this._partHeader(key, path2.basename(readStream.path), boundary)
        );
        let fileData = fs2.readFileSync(readStream.path);
        return Buffer2.concat([part, fileData, Buffer2.from("\r\n")]);
      }
      _filetype(filename) {
        let ext = path2.extname(filename);
        if (ext === ".jpeg" || ext === ".jpg") {
          return "image/jpeg";
        } else if (ext === ".png") {
          return "image/png";
        } else if (ext === ".pdf") {
          return "application/pdf";
        }
        return "application/octet-stream";
      }
      _headers() {
        return {
          Authorization: this.authorizationHeader(),
          "X-ApiVersion": this.config.apiVersion,
          Accept: "application/xml",
          "Content-Type": "application/json",
          "User-Agent": `Braintree Node ${version}`,
          "Accept-Encoding": "gzip"
        };
      }
      authorizationHeader() {
        if (this.config.accessToken) {
          return `Bearer ${this.config.accessToken}`;
        } else if (this.config.clientId) {
          return `Basic ${Buffer2.from(
            this.config.clientId + ":" + this.config.clientSecret
          ).toString("base64")}`;
        }
        return `Basic ${Buffer2.from(
          this.config.publicKey + ":" + this.config.privateKey
        ).toString("base64")}`;
      }
    };
    module2.exports = { Http: wrapPrototype(Http) };
  }
});

// node_modules/braintree/lib/braintree/credentials_parser.js
var require_credentials_parser = __commonJS({
  "node_modules/braintree/lib/braintree/credentials_parser.js"(exports2, module2) {
    "use strict";
    var Environment = require_environment().Environment;
    var CredentialsParser = class {
      parseClientCredentials(clientId, clientSecret) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        if (!this.clientId) {
          throw new Error("Missing clientId");
        }
        if (!this.clientSecret) {
          throw new Error("Missing clientSecret");
        }
        if (this.clientId.indexOf("client_id") !== 0) {
          throw new Error("Value passed for clientId is not a client id");
        }
        if (this.clientSecret.indexOf("client_secret") !== 0) {
          throw new Error("Value passed for clientSecret is not a client secret");
        }
        let clientIdEnvironment = this.parseEnvironment(this.clientId);
        let clientSecretEnvironment = this.parseEnvironment(this.clientSecret);
        if (clientIdEnvironment !== clientSecretEnvironment) {
          throw new Error(
            `Mismatched credential environments: clientId environment is ${clientIdEnvironment} and clientSecret environment is ${clientSecretEnvironment}`
          );
        }
        this.environment = clientIdEnvironment;
        return this.environment;
      }
      parseAccessToken(accessToken) {
        this.accessToken = accessToken;
        if (!this.accessToken) {
          throw new Error("Missing access token");
        }
        if (this.accessToken.indexOf("access_token") !== 0) {
          throw new Error(
            "Value passed for accessToken is not a valid access token"
          );
        }
        this.merchantId = this.accessToken.split("$")[2];
        this.environment = this.parseEnvironment(this.accessToken);
        return this.environment;
      }
      parseEnvironment(credential) {
        let env = credential.split("$")[1];
        switch (env) {
          case "development":
          case "integration":
            return Environment.Development;
          case "qa":
            return Environment.Qa;
          case "sandbox":
            return Environment.Sandbox;
          case "production":
            return Environment.Production;
          default:
            throw new Error(`Unknown environment: ${env}`);
        }
      }
    };
    module2.exports = { CredentialsParser };
  }
});

// node_modules/braintree/lib/braintree/config.js
var require_config = __commonJS({
  "node_modules/braintree/lib/braintree/config.js"(exports2, module2) {
    "use strict";
    var CredentialsParser = require_credentials_parser().CredentialsParser;
    var Config = class {
      constructor(rawConfig) {
        this.timeout = 6e4;
        this.apiVersion = "6";
        this.graphQLApiVersion = "2018-09-10";
        this.customHttpAgent = rawConfig.customHttpAgent;
        let parser = new CredentialsParser();
        if (rawConfig.clientId || rawConfig.clientSecret) {
          parser.parseClientCredentials(rawConfig.clientId, rawConfig.clientSecret);
          this.clientId = parser.clientId;
          this.clientSecret = parser.clientSecret;
          this.environment = parser.environment;
        } else if (rawConfig.accessToken) {
          parser.parseAccessToken(rawConfig.accessToken);
          if (rawConfig.environment && parser.environment !== rawConfig.environment) {
            throw new Error(
              "AccessToken environment does not match environment passed in config"
            );
          }
          this.accessToken = parser.accessToken;
          this.environment = parser.environment;
          this.merchantId = parser.merchantId;
        } else {
          this.publicKey = rawConfig.publicKey;
          this.privateKey = rawConfig.privateKey;
          this.merchantId = rawConfig.merchantId || rawConfig.partnerId;
          this.environment = rawConfig.environment;
          if (!this.publicKey) {
            throw new Error("Missing publicKey");
          }
          if (!this.privateKey) {
            throw new Error("Missing privateKey");
          }
          if (!this.merchantId) {
            throw new Error("Missing merchantId");
          }
          if (!this.environment) {
            throw new Error("Missing environment");
          }
        }
      }
      baseMerchantPath() {
        return `/merchants/${this.merchantId}`;
      }
      baseUrl() {
        return this.environment.baseUrl();
      }
      baseMerchantUrl() {
        return this.baseUrl() + this.baseMerchantPath();
      }
      baseGraphQLUrl() {
        return this.environment.baseGraphQLUrl();
      }
    };
    module2.exports = { Config };
  }
});

// node_modules/braintree/lib/braintree/graphql/graphql.js
var require_graphql = __commonJS({
  "node_modules/braintree/lib/braintree/graphql/graphql.js"(exports2, module2) {
    "use strict";
    var Http = require_http().Http;
    var exceptions = require_exceptions();
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var GraphQL = class extends Http {
      constructor(config) {
        super(config);
      }
      checkGraphQLErrors(response) {
        if (!("errors" in response) || !response.errors) {
          return null;
        }
        for (let i = 0; i < response.errors.length; i++) {
          let error = response.errors[i];
          let message = error.message;
          if (!error.extensions) {
            return exceptions.UnexpectedError(
              `Unexpected HTTP response: ${message}`
            );
          }
          switch (error.extensions.errorClass) {
            case "VALIDATION":
              continue;
            case "AUTHENTICATION":
              return exceptions.AuthenticationError("Authentication Error");
            case "AUTHORIZATION":
              return exceptions.AuthorizationError("Authorization Error");
            case "NOT_FOUND":
              return exceptions.NotFoundError("Not Found");
            case "UNSUPPORTED_CLIENT":
              return exceptions.UpgradeRequired("Upgrade Required");
            case "RESOURCE_LIMIT":
              return exceptions.TooManyRequestsError("Too Many Requests");
            case "INTERNAL":
              return exceptions.ServerError("Server Error");
            case "SERVICE_AVAILABILITY":
              return exceptions.ServiceUnavailableError("Service Unavailable");
            default:
              return exceptions.UnexpectedError(
                `Unexpected HTTP response: ${message}`
              );
          }
        }
        return null;
      }
      headers() {
        return {
          Accept: "application/json",
          "Braintree-Version": this.config.graphQLApiVersion,
          "Content-Type": "application/json"
        };
      }
      request(definition, variables) {
        let graphQLRequest = { query: definition };
        if (variables) {
          graphQLRequest.variables = variables;
        }
        return super.httpRequest(
          "POST",
          this.config.baseGraphQLUrl(),
          graphQLRequest,
          null,
          this.config.environment.graphQLServer,
          this.config.environment.graphQLPort,
          this.headers()
        ).then((response) => {
          const error = this.checkGraphQLErrors(response);
          if (error) {
            return Promise.reject(error);
          }
          return Promise.resolve(response);
        });
      }
    };
    module2.exports = { GraphQL: wrapPrototype(GraphQL) };
  }
});

// node_modules/braintree/lib/braintree/graphql/enums/recommended_payment_option.js
var require_recommended_payment_option = __commonJS({
  "node_modules/braintree/lib/braintree/graphql/enums/recommended_payment_option.js"(exports2, module2) {
    "use strict";
    var RecommendedPaymentOption = {
      PAYPAL: "PAYPAL",
      VENMO: "VENMO"
    };
    module2.exports = RecommendedPaymentOption;
  }
});

// node_modules/braintree/lib/braintree/graphql/enums/recommendations.js
var require_recommendations = __commonJS({
  "node_modules/braintree/lib/braintree/graphql/enums/recommendations.js"(exports2, module2) {
    "use strict";
    var Recommendations = {
      PAYMENT_RECOMMENDATIONS: "PAYMENT_RECOMMENDATIONS"
    };
    module2.exports = Recommendations;
  }
});

// node_modules/braintree/lib/braintree/graphql/enums/index.js
var require_enums = __commonJS({
  "node_modules/braintree/lib/braintree/graphql/enums/index.js"(exports2, module2) {
    "use strict";
    var RecommendedPaymentOption = require_recommended_payment_option();
    var Recommendations = require_recommendations();
    module2.exports = { RecommendedPaymentOption, Recommendations };
  }
});

// node_modules/braintree/lib/braintree/graphql/inputs/create_customer_session_input.js
var require_create_customer_session_input = __commonJS({
  "node_modules/braintree/lib/braintree/graphql/inputs/create_customer_session_input.js"(exports2, module2) {
    "use strict";
    var CreateCustomerSessionInput = class {
      constructor(builder) {
        this._merchantAccountId = builder._merchantAccountId;
        this._sessionId = builder._sessionId;
        this._customer = builder._customer;
        this._domain = builder._domain;
      }
      /**
       *
       * @return A dictionary representing the input object, to pass as variables to a GraphQL mutation
       */
      toGraphQLVariables() {
        const variables = {};
        if (this._merchantAccountId) {
          variables.merchantAccountId = this._merchantAccountId;
        }
        if (this._sessionId) {
          variables.sessionId = this._sessionId;
        }
        if (this._customer) {
          variables.customer = this._customer.toGraphQLVariables();
        }
        if (this._domain) {
          variables.domain = this._domain;
        }
        return variables;
      }
      /**
       * Creates a builder instance for fluent construction of CreateCustomerSessionInput objects.
       *
       * @return CreateCustomerSessionInput.Builder
       */
      static builder() {
        return new Builder();
      }
    };
    var Builder = class {
      constructor() {
        this._merchantAccountId = null;
        this._sessionId = null;
        this._customer = null;
        this._domain = null;
      }
      /**
       * Sets the merchant account ID.
       *
       * @param {string} merchantAccountId The merchant account ID.
       *
       * @return this
       */
      merchantAccountId(merchantAccountId) {
        this._merchantAccountId = merchantAccountId;
        return this;
      }
      /**
       * Sets the customer session ID.
       *
       * @param {string} $sessionId The customer session ID.
       *
       * @return this
       */
      sessionId(sessionId) {
        this._sessionId = sessionId;
        return this;
      }
      /**
       * Sets the input object representing customer information relevant to the customer session.
       *
       * @param {CustomerSessionInput} customer The input object representing the customer information relevant to the customer session.
       *
       * @return this
       */
      customer(customer) {
        this._customer = customer;
        return this;
      }
      /**
       * Sets the customer domain.
       *
       * @param {string} domain The customer domain.
       *
       * @return this
       */
      domain(domain) {
        this._domain = domain;
        return this;
      }
      build() {
        return new CreateCustomerSessionInput(this);
      }
    };
    module2.exports = CreateCustomerSessionInput;
  }
});

// node_modules/braintree/lib/braintree/graphql/inputs/customer_recommendations_input.js
var require_customer_recommendations_input = __commonJS({
  "node_modules/braintree/lib/braintree/graphql/inputs/customer_recommendations_input.js"(exports2, module2) {
    "use strict";
    var CustomerRecommendationsInput = class {
      constructor(builder) {
        this._merchantAccountId = builder._merchantAccountId;
        this._sessionId = builder._sessionId;
        this._recommendations = builder._recommendations;
        this._customer = builder._customer;
      }
      /**
       *
       * @return A dictionary representing the input object, to pass as variables to a GraphQL mutation
       */
      toGraphQLVariables() {
        const variables = {};
        if (this._merchantAccountId) {
          variables.merchantAccountId = this._merchantAccountId;
        }
        variables.sessionId = this._sessionId;
        if (this._recommendations) {
          variables.recommendations = this._recommendations;
        }
        if (this._customer) {
          variables.customer = this._customer.toGraphQLVariables();
        }
        return variables;
      }
      /**
       * Creates a builder instance for fluent construction of CustomerRecommendationsInput objects.
       *
       * @param {string} sessionId The customer session id
       * @param {Recommendations[]}  recommendations  The types of recommendations to be requested
       *
       * @return CustomerRecommendationsInput.Builder
       */
      static builder(sessionId, recommendations) {
        return new Builder(sessionId, recommendations);
      }
    };
    var Builder = class {
      constructor(sessionId, recommendations) {
        this._sessionId = sessionId;
        this._recommendations = recommendations;
      }
      /**
       * Sets the merchant account ID.
       *
       * @param {string} merchantAccountId The merchant account ID.
       *
       * @return this
       */
      merchantAccountId(merchantAccountId) {
        this._merchantAccountId = merchantAccountId;
        return this;
      }
      /**
       * Sets the input object representing customer information relevant to the customer session.
       *
       * @param {CustomerSessionInput} customer The input object representing the customer information relevant to the customer session.
       *
       * @return this
       */
      customer(customer) {
        this._customer = customer;
        return this;
      }
      build() {
        return new CustomerRecommendationsInput(this);
      }
    };
    module2.exports = CustomerRecommendationsInput;
  }
});

// node_modules/braintree/lib/braintree/graphql/inputs/customer_session_input.js
var require_customer_session_input = __commonJS({
  "node_modules/braintree/lib/braintree/graphql/inputs/customer_session_input.js"(exports2, module2) {
    "use strict";
    var CustomerSessionInput = class {
      constructor(builder) {
        this._email = builder._email;
        this._phone = builder._phone;
        this._deviceFingerprintId = builder._deviceFingerprintId;
        this._paypalAppInstalled = builder._paypalAppInstalled;
        this._venmoAppInstalled = builder._venmoAppInstalled;
        this._userAgent = builder._userAgent;
      }
      /**
       *
       * @return A dictionary representing the input object, to pass as variables to a GraphQL mutation
       */
      toGraphQLVariables() {
        const variables = {};
        if (this._email) {
          variables.email = this._email;
        }
        if (this._phone) {
          variables.phone = this._phone.toGraphQLVariables();
        }
        if (this._deviceFingerprintId) {
          variables.deviceFingerprintId = this._deviceFingerprintId;
        }
        variables.paypalAppInstalled = this._paypalAppInstalled;
        variables.venmoAppInstalled = this._venmoAppInstalled;
        if (this._userAgent) {
          variables.userAgent = this._userAgent;
        }
        return variables;
      }
      /**
       * Creates a builder instance for fluent construction of CustomerSessionInput objects.
       *
       * @return CustomerSessionInput.Builder
       */
      static builder() {
        return new Builder();
      }
    };
    var Builder = class {
      constructor() {
        this._email = null;
        this._phone = null;
        this._deviceFingerprintId = null;
        this._paypalAppInstalled = null;
        this._venmoAppInstalled = null;
        this._userAgent = null;
      }
      /**
       * Sets the customer email address.
       *
       * @param {string} email The customer email address.
       *
       * @return this
       */
      email(email) {
        this._email = email;
        return this;
      }
      /**
       * Sets the customer phone number input object.
       *
       * @param {PhoneInput} phone The input object representing the customer phone number.
       *
       * @return this
       */
      phone(phone) {
        this._phone = phone;
        return this;
      }
      /**
       * Sets the customer device fingerprint ID.
       *
       * @param {string} deviceFingerprintId The customer device fingerprint ID.
       *
       * @return this
       */
      deviceFingerprintId(deviceFingerprintId) {
        this._deviceFingerprintId = deviceFingerprintId;
        return this;
      }
      /**
       * Sets whether the PayPal app is installed on the customer's device.
       *
       * @param {boolean} paypalAppInstalled True if the PayPal app is installed, false otherwise.
       *
       * @return this
       */
      paypalAppInstalled(paypalAppInstalled) {
        this._paypalAppInstalled = paypalAppInstalled;
        return this;
      }
      /**
       * Sets whether the Venmo app is installed on the customer's device.
       *
       * @param {boolean} venmoAppInstalled True if the Venmo app is installed, false otherwise.
       *
       * @return this
       */
      venmoAppInstalled(venmoAppInstalled) {
        this._venmoAppInstalled = venmoAppInstalled;
        return this;
      }
      /**
       * Sets the user agent from the request originating from the customer's device.
       * This will be used to identify the customer's operating system and browser versions.
       *
       * @param {string} userAgent The user agent.
       *
       * @return this
       */
      userAgent(userAgent) {
        this._userAgent = userAgent;
        return this;
      }
      build() {
        return new CustomerSessionInput(this);
      }
    };
    module2.exports = CustomerSessionInput;
  }
});

// node_modules/braintree/lib/braintree/graphql/inputs/phone_input.js
var require_phone_input = __commonJS({
  "node_modules/braintree/lib/braintree/graphql/inputs/phone_input.js"(exports2, module2) {
    "use strict";
    var PhoneInput = class {
      constructor(builder) {
        this._countryPhoneCode = builder._countryPhoneCode;
        this._phoneNumber = builder._phoneNumber;
        this._extensionNumber = builder._extensionNumber;
      }
      /**
       *
       * @return A dictionary representing the input object, to pass as variables to a GraphQL mutation
       */
      toGraphQLVariables() {
        const variables = {};
        if (this._countryPhoneCode) {
          variables.countryPhoneCode = this._countryPhoneCode;
        }
        if (this._phoneNumber) {
          variables.phoneNumber = this._phoneNumber;
        }
        if (this._extensionNumber) {
          variables.extensionNumber = this._extensionNumber;
        }
        return variables;
      }
      /**
       * Creates a builder instance for fluent construction of PhoneInput objects.
       *
       * @return PhoneInput.Builder
       */
      static builder() {
        return new Builder();
      }
    };
    var Builder = class {
      /**
       * Sets the country phone code.
       *
       * @param {string} countryPhoneCode The country phone code.
       *
       * @return this
       */
      countryPhoneCode(countryPhoneCode) {
        this._countryPhoneCode = countryPhoneCode;
        return this;
      }
      /**
       * Sets the phone number.
       *
       * @param {string} phoneNumber The phone number.
       *
       * @return this
       */
      phoneNumber(phoneNumber) {
        this._phoneNumber = phoneNumber;
        return this;
      }
      /**
       * Sets the extension number.
       *
       * @param {string} extensionNumber The extension number.
       *
       * @return self
       */
      extensionNumber(extensionNumber) {
        this._extensionNumber = extensionNumber;
        return this;
      }
      build() {
        return new PhoneInput(this);
      }
    };
    module2.exports = PhoneInput;
  }
});

// node_modules/braintree/lib/braintree/graphql/inputs/update_customer_session_input.js
var require_update_customer_session_input = __commonJS({
  "node_modules/braintree/lib/braintree/graphql/inputs/update_customer_session_input.js"(exports2, module2) {
    "use strict";
    var UpdateCustomerSessionInput = class {
      constructor(builder) {
        this._merchantAccountId = builder._merchantAccountId;
        this._sessionId = builder._sessionId;
        this._customer = builder._customer;
      }
      /**
       *
       * @return A dictionary representing the input object, to pass as variables to a GraphQL mutation
       */
      toGraphQLVariables() {
        const variables = {};
        if (this._merchantAccountId) {
          variables.merchantAccountId = this._merchantAccountId;
        }
        variables.sessionId = this._sessionId;
        if (this._customer) {
          variables.customer = this._customer.toGraphQLVariables();
        }
        return variables;
      }
      /**
       * Creates a builder instance for fluent construction of UpdateCustomerSessionInput objects.
       *
       * @param {string} sessionId ID of the customer session to be updated.
       *
       * @return UpdateCustomerSessionInput.Builder
       */
      static builder(sessionId) {
        return new Builder(sessionId);
      }
    };
    var Builder = class {
      constructor(sessionId) {
        this._sessionId = sessionId;
        this._merchantAccountId = null;
        this._customer = null;
      }
      /**
       * Sets the merchant account ID.
       *
       * @param {string} merchantAccountId The merchant account ID.
       *
       * @return this
       */
      merchantAccountId(merchantAccountId) {
        this._merchantAccountId = merchantAccountId;
        return this;
      }
      /**
       * Sets the input object representing customer information relevant to the customer session.
       *
       * @param {CustomerSessionInput} customer The input object representing the customer information relevant to the customer session.
       *
       * @return this
       */
      customer(customer) {
        this._customer = customer;
        return this;
      }
      build() {
        return new UpdateCustomerSessionInput(this);
      }
    };
    module2.exports = UpdateCustomerSessionInput;
  }
});

// node_modules/braintree/lib/braintree/graphql/inputs/index.js
var require_inputs = __commonJS({
  "node_modules/braintree/lib/braintree/graphql/inputs/index.js"(exports2, module2) {
    "use strict";
    var CreateCustomerSessionInput = require_create_customer_session_input();
    var CustomerRecommendationsInput = require_customer_recommendations_input();
    var CustomerSessionInput = require_customer_session_input();
    var PhoneInput = require_phone_input();
    var UpdateCustomerSessionInput = require_update_customer_session_input();
    module2.exports = {
      CreateCustomerSessionInput,
      UpdateCustomerSessionInput,
      CustomerRecommendationsInput,
      CustomerSessionInput,
      PhoneInput
    };
  }
});

// node_modules/braintree/lib/braintree/graphql/types/customer_recommendations_payload.js
var require_customer_recommendations_payload = __commonJS({
  "node_modules/braintree/lib/braintree/graphql/types/customer_recommendations_payload.js"(exports2, module2) {
    "use strict";
    var CustomerRecommendationsPayload = class {
      constructor(isInPayPalNetwork, recommendations) {
        this.isInPayPalNetwork = isInPayPalNetwork;
        this.recommendations = recommendations;
      }
    };
    module2.exports = CustomerRecommendationsPayload;
  }
});

// node_modules/braintree/lib/braintree/graphql/types/payment_options.js
var require_payment_options = __commonJS({
  "node_modules/braintree/lib/braintree/graphql/types/payment_options.js"(exports2, module2) {
    "use strict";
    var PaymentOptions = class {
      constructor(paymentOption, recommendedPriority) {
        this.paymentOption = paymentOption;
        this.recommendedPriority = recommendedPriority;
      }
    };
    module2.exports = PaymentOptions;
  }
});

// node_modules/braintree/lib/braintree/graphql/types/index.js
var require_types = __commonJS({
  "node_modules/braintree/lib/braintree/graphql/types/index.js"(exports2, module2) {
    "use strict";
    var CustomerRecommendationsPayload = require_customer_recommendations_payload();
    var PaymentOptions = require_payment_options();
    module2.exports = { CustomerRecommendationsPayload, PaymentOptions };
  }
});

// node_modules/braintree/lib/braintree/graphql/unions/customer_recommendations.js
var require_customer_recommendations = __commonJS({
  "node_modules/braintree/lib/braintree/graphql/unions/customer_recommendations.js"(exports2, module2) {
    "use strict";
    var CustomerRecommendations = class {
      constructor(paymentOptions) {
        this.paymentOptions = paymentOptions;
      }
    };
    module2.exports = CustomerRecommendations;
  }
});

// node_modules/braintree/lib/braintree/graphql/unions/index.js
var require_unions = __commonJS({
  "node_modules/braintree/lib/braintree/graphql/unions/index.js"(exports2, module2) {
    "use strict";
    var CustomerRecommendations = require_customer_recommendations();
    module2.exports = { CustomerRecommendations };
  }
});

// node_modules/braintree/lib/braintree/graphql/index.js
var require_graphql2 = __commonJS({
  "node_modules/braintree/lib/braintree/graphql/index.js"(exports2, module2) {
    "use strict";
    var GraphQL = require_graphql().GraphQL;
    var { RecommendedPaymentOption, Recommendations } = require_enums();
    var {
      CreateCustomerSessionInput,
      UpdateCustomerSessionInput,
      CustomerRecommendationsInput,
      CustomerSessionInput,
      PhoneInput
    } = require_inputs();
    var { CustomerRecommendationsPayload, PaymentOptions } = require_types();
    var { CustomerRecommendations } = require_unions();
    module2.exports = {
      GraphQL,
      RecommendedPaymentOption,
      Recommendations,
      CreateCustomerSessionInput,
      UpdateCustomerSessionInput,
      CustomerRecommendationsInput,
      CustomerSessionInput,
      PhoneInput,
      CustomerRecommendationsPayload,
      PaymentOptions,
      CustomerRecommendations
    };
  }
});

// node_modules/braintree/lib/braintree/validation_error.js
var require_validation_error = __commonJS({
  "node_modules/braintree/lib/braintree/validation_error.js"(exports2, module2) {
    "use strict";
    var ValidationError = class {
      constructor(error) {
        this.attribute = error.attribute;
        this.code = error.code;
        this.message = error.message;
      }
    };
    module2.exports = { ValidationError };
  }
});

// node_modules/braintree/lib/braintree/validation_errors_collection.js
var require_validation_errors_collection = __commonJS({
  "node_modules/braintree/lib/braintree/validation_errors_collection.js"(exports2, module2) {
    "use strict";
    var Util = require_util().Util;
    var ValidationError = require_validation_error().ValidationError;
    var ValidationErrorsCollection = class _ValidationErrorsCollection {
      constructor(errorAttributes) {
        this.validationErrors = {};
        this.errorCollections = {};
        for (let key in errorAttributes) {
          if (!errorAttributes.hasOwnProperty(key)) {
            continue;
          }
          let val = errorAttributes[key];
          if (key === "errors") {
            this.buildErrors(val);
          } else {
            this.errorCollections[key] = new _ValidationErrorsCollection(val);
          }
        }
      }
      buildErrors(errors) {
        return errors.map((item) => {
          let key = Util.toCamelCase(item.attribute);
          this.validationErrors[key] = this.validationErrors[key] || [];
          return this.validationErrors[key].push(new ValidationError(item));
        });
      }
      deepErrors() {
        let errors = [];
        for (let key in this.validationErrors) {
          if (!this.validationErrors.hasOwnProperty(key)) {
            continue;
          }
          let val = this.validationErrors[key];
          errors = errors.concat(val);
        }
        for (let key in this.errorCollections) {
          if (!this.errorCollections.hasOwnProperty(key)) {
            continue;
          }
          let val = this.errorCollections[key];
          errors = errors.concat(val.deepErrors());
        }
        return errors;
      }
      for(name) {
        return this.errorCollections[name];
      }
      forIndex(index) {
        return this.errorCollections[`index${index}`];
      }
      on(name) {
        return this.validationErrors[name];
      }
    };
    module2.exports = { ValidationErrorsCollection };
  }
});

// node_modules/braintree/lib/braintree/graphql_client.js
var require_graphql_client = __commonJS({
  "node_modules/braintree/lib/braintree/graphql_client.js"(exports2, module2) {
    "use strict";
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var GraphQL = require_graphql2().GraphQL;
    var ValidationErrorsCollection = require_validation_errors_collection().ValidationErrorsCollection;
    var GraphQLClient = class {
      constructor(config) {
        this._service = new GraphQL(config);
      }
      query(definition, variables) {
        return this._service.request(definition, variables);
      }
      static getValidationErrorCode(error) {
        const extensions = error.extensions;
        if (!extensions) {
          return null;
        }
        const code = extensions.legacyCode;
        if (!code) {
          return null;
        }
        return code;
      }
      static getValidationErrors(response) {
        const errors = response.errors;
        if (!errors) {
          return null;
        }
        const validationErrors = [];
        for (const error of errors) {
          validationErrors.push({
            attribute: "",
            // The GraphQL response doesn't include an attribute
            code: this.getValidationErrorCode(error),
            message: error.message
          });
        }
        const validationErrorsCollection = new ValidationErrorsCollection({
          errors: validationErrors
        });
        return validationErrorsCollection;
      }
    };
    module2.exports = { GraphQLClient: wrapPrototype(GraphQLClient) };
  }
});

// node_modules/braintree/lib/braintree/attribute_setter.js
var require_attribute_setter = __commonJS({
  "node_modules/braintree/lib/braintree/attribute_setter.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = class {
      constructor(attributes) {
        for (let key in attributes) {
          if (!attributes.hasOwnProperty(key)) {
            continue;
          }
          let value = attributes[key];
          this[key] = value;
          if (key === "globalId") {
            this.graphQLId = attributes.globalId;
          }
        }
      }
    };
    module2.exports = { AttributeSetter };
  }
});

// node_modules/braintree/lib/braintree/add_on.js
var require_add_on = __commonJS({
  "node_modules/braintree/lib/braintree/add_on.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var AddOn = class extends AttributeSetter {
    };
    module2.exports = { AddOn };
  }
});

// node_modules/braintree/lib/braintree/apple_pay_card.js
var require_apple_pay_card = __commonJS({
  "node_modules/braintree/lib/braintree/apple_pay_card.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var ApplePayCard = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
      }
    };
    module2.exports = { ApplePayCard };
  }
});

// node_modules/braintree/lib/braintree/android_pay_card.js
var require_android_pay_card = __commonJS({
  "node_modules/braintree/lib/braintree/android_pay_card.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var AndroidPayCard = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
        if (attributes) {
          this.cardType = attributes.virtualCardType;
          this.last4 = attributes.virtualCardLast4;
        }
      }
    };
    module2.exports = { AndroidPayCard };
  }
});

// node_modules/braintree/lib/braintree/authorization_adjustment.js
var require_authorization_adjustment = __commonJS({
  "node_modules/braintree/lib/braintree/authorization_adjustment.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var AuthorizationAdjustment = class extends AttributeSetter {
    };
    module2.exports = { AuthorizationAdjustment };
  }
});

// node_modules/braintree/lib/braintree/liability_shift.js
var require_liability_shift = __commonJS({
  "node_modules/braintree/lib/braintree/liability_shift.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var LiabilityShift = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
      }
    };
    module2.exports = { LiabilityShift };
  }
});

// node_modules/braintree/lib/braintree/risk_data.js
var require_risk_data = __commonJS({
  "node_modules/braintree/lib/braintree/risk_data.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var LiabilityShift = require_liability_shift().LiabilityShift;
    var RiskData = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
        if (attributes.liabilityShift) {
          this.liabilityShift = new LiabilityShift(attributes.liabilityShift);
        }
      }
    };
    module2.exports = { RiskData };
  }
});

// node_modules/braintree/lib/braintree/three_d_secure_info.js
var require_three_d_secure_info = __commonJS({
  "node_modules/braintree/lib/braintree/three_d_secure_info.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var ThreeDSecureInfo = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
      }
    };
    module2.exports = { ThreeDSecureInfo };
  }
});

// node_modules/braintree/lib/braintree/credit_card_verification.js
var require_credit_card_verification = __commonJS({
  "node_modules/braintree/lib/braintree/credit_card_verification.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var RiskData = require_risk_data().RiskData;
    var ThreeDSecureInfo = require_three_d_secure_info().ThreeDSecureInfo;
    var CreditCardVerification = class extends AttributeSetter {
      static initClass() {
        this.StatusType = {
          Failed: "failed",
          GatewayRejected: "gateway_rejected",
          ProcessorDeclined: "processor_declined",
          Verified: "verified",
          All() {
            let all = [];
            for (let key in this) {
              if (!this.hasOwnProperty(key)) {
                continue;
              }
              let value = this[key];
              if (key !== "All") {
                all.push(value);
              }
            }
            return all;
          }
        };
      }
      constructor(attributes) {
        super(attributes);
        if (attributes.riskData) {
          this.riskData = new RiskData(attributes.riskData);
        }
        if (attributes.threeDSecureInfo) {
          this.threeDSecureInfo = new ThreeDSecureInfo(attributes.threeDSecureInfo);
        }
      }
    };
    CreditCardVerification.initClass();
    module2.exports = { CreditCardVerification };
  }
});

// node_modules/braintree/lib/braintree/credit_card.js
var require_credit_card = __commonJS({
  "node_modules/braintree/lib/braintree/credit_card.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var CreditCardVerification = require_credit_card_verification().CreditCardVerification;
    var CreditCard = class extends AttributeSetter {
      static initClass() {
        this.CardType = {
          AmEx: "American Express",
          CarteBlanche: "Carte Blanche",
          ChinaUnionPay: "China UnionPay",
          DinersClubInternational: "Diners Club",
          Discover: "Discover",
          Elo: "Elo",
          JCB: "JCB",
          Laser: "Laser",
          UKMaestro: "UK Maestro",
          Maestro: "Maestro",
          MasterCard: "MasterCard",
          Solo: "Solo",
          Switch: "Switch",
          Visa: "Visa",
          Unknown: "Unknown",
          All() {
            let all = [];
            for (let key in this) {
              if (!this.hasOwnProperty(key)) {
                continue;
              }
              let value = this[key];
              if (key !== "All") {
                all.push(value);
              }
            }
            return all;
          }
        };
        this.CustomerLocation = {
          International: "international",
          US: "us"
        };
        this.CardTypeIndicator = {
          Yes: "Yes",
          No: "No",
          Unknown: "Unknown"
        };
        this.DebitNetwork = {
          Accel: "ACCEL",
          Nyce: "NYCE",
          Pulse: "PULSE",
          Star: "STAR",
          StarAccess: "STAR_ACCESS",
          Maestro: "MAESTRO",
          All() {
            let all = [];
            for (let key in this) {
              if (!this.hasOwnProperty(key)) {
                continue;
              }
              let value = this[key];
              if (key !== "All") {
                all.push(value);
              }
            }
            return all;
          }
        };
        this.Commercial = this.CountryOfIssuance = this.Debit = this.DurbinRegulated = this.Healthcare = this.IssuingBank = this.Payroll = this.Prepaid = this.PrepaidReloadable = this.ProductId = this.CardTypeIndicator;
      }
      constructor(attributes) {
        super(attributes);
        this.maskedNumber = `${this.bin}******${this.last4}`;
        this.expirationDate = `${this.expirationMonth}/${this.expirationYear}`;
        if (attributes) {
          let sortedVerifications = (attributes.verifications || []).sort(
            (a, b) => b.created_at - a.created_at
          );
          if (sortedVerifications[0]) {
            this.verification = new CreditCardVerification(sortedVerifications[0]);
          }
        }
      }
    };
    CreditCard.initClass();
    module2.exports = { CreditCard };
  }
});

// node_modules/braintree/lib/braintree/paypal_account.js
var require_paypal_account = __commonJS({
  "node_modules/braintree/lib/braintree/paypal_account.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var PayPalAccount = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
      }
    };
    module2.exports = { PayPalAccount };
  }
});

// node_modules/braintree/lib/braintree/paypal_here_details.js
var require_paypal_here_details = __commonJS({
  "node_modules/braintree/lib/braintree/paypal_here_details.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var PayPalHereDetails = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
      }
    };
    module2.exports = { PayPalHereDetails };
  }
});

// node_modules/braintree/lib/braintree/local_payment.js
var require_local_payment = __commonJS({
  "node_modules/braintree/lib/braintree/local_payment.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var LocalPayment = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
      }
    };
    module2.exports = { LocalPayment };
  }
});

// node_modules/braintree/lib/braintree/meta_checkout_card.js
var require_meta_checkout_card = __commonJS({
  "node_modules/braintree/lib/braintree/meta_checkout_card.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var MetaCheckoutCard = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
      }
    };
    module2.exports = { MetaCheckoutCard };
  }
});

// node_modules/braintree/lib/braintree/meta_checkout_token.js
var require_meta_checkout_token = __commonJS({
  "node_modules/braintree/lib/braintree/meta_checkout_token.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var MetaCheckoutToken = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
      }
    };
    module2.exports = { MetaCheckoutToken };
  }
});

// node_modules/braintree/lib/braintree/disbursement_details.js
var require_disbursement_details = __commonJS({
  "node_modules/braintree/lib/braintree/disbursement_details.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var DisbursementDetails = class extends AttributeSetter {
      isValid() {
        return this.disbursementDate != null;
      }
    };
    module2.exports = { DisbursementDetails };
  }
});

// node_modules/braintree/lib/braintree/transaction_details.js
var require_transaction_details = __commonJS({
  "node_modules/braintree/lib/braintree/transaction_details.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var TransactionDetails = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
      }
    };
    module2.exports = { TransactionDetails };
  }
});

// node_modules/braintree/lib/braintree/dispute.js
var require_dispute = __commonJS({
  "node_modules/braintree/lib/braintree/dispute.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var TransactionDetails = require_transaction_details().TransactionDetails;
    var Dispute = class _Dispute extends AttributeSetter {
      static initClass() {
        this.Status = {
          Accepted: "accepted",
          AutoAccepted: "auto_accepted",
          Disputed: "disputed",
          Expired: "expired",
          Lost: "lost",
          Open: "open",
          UnderReview: "under_review",
          Won: "won"
        };
        this.Reason = {
          CancelledRecurringTransaction: "cancelled_recurring_transaction",
          CreditNotProcessed: "credit_not_processed",
          Duplicate: "duplicate",
          Fraud: "fraud",
          General: "general",
          InvalidAccount: "invalid_account",
          NotRecognized: "not_recognized",
          ProductNotReceived: "product_not_received",
          ProductUnsatisfactory: "product_unsatisfactory",
          Retrieval: "retrieval",
          TransactionAmountDiffers: "transaction_amount_differs"
        };
        this.Kind = {
          Chargeback: "chargeback",
          PreArbitration: "pre_arbitration",
          Retrieval: "retrieval"
        };
        this.ChargebackProtectionLevel = {
          Effortless: "effortless",
          Standard: "standard",
          NotProtected: "not_protected"
        };
        this.ProtectionLevel = {
          EffortlessCBP: "Effortless Chargeback Protection tool",
          StandardCBP: "Chargeback Protection tool",
          NoProtection: "No Protection"
        };
        this.PreDisputeProgram = {
          None: "none",
          VisaRdr: "visa_rdr"
        };
      }
      constructor(attributes) {
        super(attributes);
        this.transactionDetails = new TransactionDetails(attributes.transaction);
        let protectionLevel = {
          effortless: _Dispute.ProtectionLevel.EffortlessCBP,
          standard: _Dispute.ProtectionLevel.StandardCBP,
          not_protected: _Dispute.ProtectionLevel.NoProtection
          // eslint-disable-line camelcase
        };
        this.protectionLevel = protectionLevel[this.chargebackProtectionLevel] || _Dispute.ProtectionLevel.NoProtection;
      }
    };
    Dispute.initClass();
    module2.exports = { Dispute };
  }
});

// node_modules/braintree/lib/braintree/facilitated_details.js
var require_facilitated_details = __commonJS({
  "node_modules/braintree/lib/braintree/facilitated_details.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var FacilitatedDetails = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
      }
    };
    module2.exports = { FacilitatedDetails };
  }
});

// node_modules/braintree/lib/braintree/facilitator_details.js
var require_facilitator_details = __commonJS({
  "node_modules/braintree/lib/braintree/facilitator_details.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var FacilitatorDetails = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
      }
    };
    module2.exports = { FacilitatorDetails };
  }
});

// node_modules/braintree/lib/braintree/sepa_direct_debit_account_details.js
var require_sepa_direct_debit_account_details = __commonJS({
  "node_modules/braintree/lib/braintree/sepa_direct_debit_account_details.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var SepaDirectDebitAccountDetails = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
      }
    };
    module2.exports = {
      SepaDirectDebitAccountDetails
    };
  }
});

// node_modules/braintree/lib/braintree/packages.js
var require_packages = __commonJS({
  "node_modules/braintree/lib/braintree/packages.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var Packages = class extends AttributeSetter {
    };
    module2.exports = { Packages };
  }
});

// node_modules/braintree/lib/braintree/ach_mandate.js
var require_ach_mandate = __commonJS({
  "node_modules/braintree/lib/braintree/ach_mandate.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var AchMandate = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
        this.acceptedAt = new Date(this.acceptedAt);
      }
    };
    module2.exports = { AchMandate };
  }
});

// node_modules/braintree/lib/braintree/us_bank_account_verification.js
var require_us_bank_account_verification = __commonJS({
  "node_modules/braintree/lib/braintree/us_bank_account_verification.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var UsBankAccountVerification = class extends AttributeSetter {
      static initClass() {
        this.StatusType = {
          Failed: "failed",
          GatewayRejected: "gateway_rejected",
          Pending: "pending",
          ProcessorDeclined: "processor_declined",
          Verified: "verified",
          All() {
            let all = [];
            for (let key in this) {
              if (!this.hasOwnProperty(key)) {
                continue;
              }
              let value = this[key];
              if (key !== "All") {
                all.push(value);
              }
            }
            return all;
          }
        };
        this.VerificationMethod = {
          IndependentCheck: "independent_check",
          MicroTransfers: "micro_transfers",
          NetworkCheck: "network_check",
          TokenizedCheck: "tokenized_check",
          All() {
            let all = [];
            for (let key in this) {
              if (!this.hasOwnProperty(key)) {
                continue;
              }
              let value = this[key];
              if (key !== "All") {
                all.push(value);
              }
            }
            return all;
          }
        };
        this.VerificationAddOns = {
          CustomerVerification: "customer_verification",
          All() {
            let all = [];
            for (let key in this) {
              if (!this.hasOwnProperty(key)) {
                continue;
              }
              let value = this[key];
              if (key !== "All") {
                all.push(value);
              }
            }
            return all;
          }
        };
      }
    };
    UsBankAccountVerification.initClass();
    module2.exports = { UsBankAccountVerification };
  }
});

// node_modules/braintree/lib/braintree/us_bank_account.js
var require_us_bank_account = __commonJS({
  "node_modules/braintree/lib/braintree/us_bank_account.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var AchMandate = require_ach_mandate().AchMandate;
    var UsBankAccountVerification = require_us_bank_account_verification().UsBankAccountVerification;
    var UsBankAccount = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
        this.achMandate = new AchMandate(this.achMandate);
        if (this.verifications) {
          this.verifications = this.verifications.map(
            (usBankAccountVerification) => {
              return new UsBankAccountVerification(usBankAccountVerification);
            }
          );
        } else {
          this.verifications = [];
        }
      }
    };
    module2.exports = { UsBankAccount };
  }
});

// node_modules/braintree/lib/braintree/venmo_account_details.js
var require_venmo_account_details = __commonJS({
  "node_modules/braintree/lib/braintree/venmo_account_details.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var VenmoAccountDetails = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
      }
    };
    module2.exports = { VenmoAccountDetails };
  }
});

// node_modules/braintree/lib/braintree/visa_checkout_card.js
var require_visa_checkout_card = __commonJS({
  "node_modules/braintree/lib/braintree/visa_checkout_card.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var VisaCheckoutCard = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
      }
    };
    module2.exports = { VisaCheckoutCard };
  }
});

// node_modules/braintree/lib/braintree/samsung_pay_card.js
var require_samsung_pay_card = __commonJS({
  "node_modules/braintree/lib/braintree/samsung_pay_card.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var SamsungPayCard = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
      }
    };
    module2.exports = { SamsungPayCard };
  }
});

// node_modules/braintree/lib/braintree/transaction.js
var require_transaction = __commonJS({
  "node_modules/braintree/lib/braintree/transaction.js"(exports2, module2) {
    "use strict";
    var gatewaySymbol = Symbol();
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var ApplePayCard = require_apple_pay_card().ApplePayCard;
    var AndroidPayCard = require_android_pay_card().AndroidPayCard;
    var AuthorizationAdjustment = require_authorization_adjustment().AuthorizationAdjustment;
    var CreditCard = require_credit_card().CreditCard;
    var PayPalAccount = require_paypal_account().PayPalAccount;
    var PayPalHereDetails = require_paypal_here_details().PayPalHereDetails;
    var LocalPayment = require_local_payment().LocalPayment;
    var MetaCheckoutCard = require_meta_checkout_card().MetaCheckoutCard;
    var MetaCheckoutToken = require_meta_checkout_token().MetaCheckoutToken;
    var DisbursementDetails = require_disbursement_details().DisbursementDetails;
    var Dispute = require_dispute().Dispute;
    var FacilitatedDetails = require_facilitated_details().FacilitatedDetails;
    var FacilitatorDetails = require_facilitator_details().FacilitatorDetails;
    var RiskData = require_risk_data().RiskData;
    var SepaDirectDebitAccountDetails = require_sepa_direct_debit_account_details().SepaDirectDebitAccountDetails;
    var Packages = require_packages().Packages;
    var ThreeDSecureInfo = require_three_d_secure_info().ThreeDSecureInfo;
    var UsBankAccount = require_us_bank_account().UsBankAccount;
    var VenmoAccountDetails = require_venmo_account_details().VenmoAccountDetails;
    var VisaCheckoutCard = require_visa_checkout_card().VisaCheckoutCard;
    var SamsungPayCard = require_samsung_pay_card().SamsungPayCard;
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var Transaction = class extends AttributeSetter {
      static initClass() {
        this.CreatedUsing = {
          FullInformation: "full_information",
          Token: "token"
        };
        this.EscrowStatus = {
          HoldPending: "hold_pending",
          Held: "held",
          ReleasePending: "release_pending",
          Released: "released",
          Refunded: "refunded"
        };
        this.Source = {
          Api: "api",
          ControlPanel: "control_panel",
          Recurring: "recurring"
        };
        this.Type = {
          Credit: "credit",
          Sale: "sale",
          All() {
            let all = [];
            for (let key in this) {
              if (!this.hasOwnProperty(key)) {
                continue;
              }
              let value = this[key];
              if (key !== "All") {
                all.push(value);
              }
            }
            return all;
          }
        };
        this.GatewayRejectionReason = {
          ApplicationIncomplete: "application_incomplete",
          Avs: "avs",
          Cvv: "cvv",
          AvsAndCvv: "avs_and_cvv",
          Duplicate: "duplicate",
          Fraud: "fraud",
          RiskThreshold: "risk_threshold",
          ThreeDSecure: "three_d_secure",
          TokenIssuance: "token_issuance"
        };
        this.IndustryData = {
          Lodging: "lodging",
          TravelAndCruise: "travel_cruise",
          TravelAndFlight: "travel_flight"
        };
        this.AdditionalCharge = {
          Restaurant: "restaurant",
          GiftShop: "gift_shop",
          MiniBar: "mini_bar",
          Telephone: "telephone",
          Laundry: "laundry",
          Other: "other"
        };
        this.Status = {
          AuthorizationExpired: "authorization_expired",
          Authorizing: "authorizing",
          Authorized: "authorized",
          GatewayRejected: "gateway_rejected",
          Failed: "failed",
          ProcessorDeclined: "processor_declined",
          Settled: "settled",
          Settling: "settling",
          SettlementConfirmed: "settlement_confirmed",
          SettlementDeclined: "settlement_declined",
          SettlementPending: "settlement_pending",
          SubmittedForSettlement: "submitted_for_settlement",
          Voided: "voided",
          All() {
            let all = [];
            for (let key in this) {
              if (!this.hasOwnProperty(key)) {
                continue;
              }
              let value = this[key];
              if (key !== "All") {
                all.push(value);
              }
            }
            return all;
          }
        };
        this.ExternalVault = {
          WillVault: "will_vault",
          Vaulted: "vaulted"
        };
        this.ReasonCode = {
          Any: "any_reason_code"
        };
      }
      constructor(attributes, passedInGateway) {
        super(attributes);
        this.creditCard = new CreditCard(attributes.creditCard);
        this.paypalAccount = new PayPalAccount(attributes.paypal);
        this.paypalHereDetails = new PayPalHereDetails(attributes.paypalHere);
        this.localPayment = new LocalPayment(attributes.localPayment);
        this.applePayCard = new ApplePayCard(attributes.applePay);
        this.androidPayCard = new AndroidPayCard(attributes.androidPayCard);
        this.disbursementDetails = new DisbursementDetails(
          attributes.disbursementDetails
        );
        this.visaCheckoutCard = new VisaCheckoutCard(attributes.visaCheckoutCard);
        this.samsungPayCard = new SamsungPayCard(attributes.samsungPayCard);
        if (attributes.metaCheckoutCard) {
          this.metaCheckoutCard = new MetaCheckoutCard(attributes.metaCheckoutCard);
        }
        if (attributes.metaCheckoutToken) {
          this.metaCheckoutToken = new MetaCheckoutToken(
            attributes.metaCheckoutToken
          );
        }
        if (attributes.sepaDebitAccountDetail) {
          this.sepaDirectDebitAccountDetails = new SepaDirectDebitAccountDetails(
            attributes.sepaDebitAccountDetail
          );
        }
        if (attributes.disputes != null) {
          this.disputes = attributes.disputes.map(
            (disputeAttributes) => new Dispute(disputeAttributes)
          );
        }
        if (attributes.facilitatedDetails) {
          this.facilitatedDetails = new FacilitatedDetails(
            attributes.facilitatedDetails
          );
        }
        if (attributes.facilitatorDetails) {
          this.facilitatorDetails = new FacilitatorDetails(
            attributes.facilitatorDetails
          );
        }
        if (attributes.shipments) {
          this.packages = new Packages(attributes.shipments);
        }
        if (attributes.riskData) {
          this.riskData = new RiskData(attributes.riskData);
        }
        if (attributes.threeDSecureInfo) {
          this.threeDSecureInfo = new ThreeDSecureInfo(attributes.threeDSecureInfo);
        }
        if (attributes.usBankAccount) {
          this.usBankAccount = new UsBankAccount(attributes.usBankAccount);
        }
        if (attributes.authorizationAdjustments) {
          this.authorizationAdjustments = attributes.authorizationAdjustments.map(
            (authorizationAdjustmentAttributes) => new AuthorizationAdjustment(authorizationAdjustmentAttributes)
          );
        }
        if (attributes.venmoAccount) {
          this.venmoAccountDetails = new VenmoAccountDetails(
            attributes.venmoAccount
          );
        }
        this[gatewaySymbol] = passedInGateway;
      }
      isDisbursed() {
        return this.disbursementDetails.isValid();
      }
      lineItems() {
        return this[gatewaySymbol].transactionLineItem.findAll(this.id);
      }
    };
    Transaction.initClass();
    module2.exports = { Transaction: wrapPrototype(Transaction, {}) };
  }
});

// node_modules/braintree/lib/braintree/error_response.js
var require_error_response = __commonJS({
  "node_modules/braintree/lib/braintree/error_response.js"(exports2, module2) {
    "use strict";
    var Transaction = require_transaction().Transaction;
    var ValidationErrorsCollection = require_validation_errors_collection().ValidationErrorsCollection;
    var ErrorResponse = class {
      constructor(attributes, gateway2) {
        for (let key in attributes) {
          if (!attributes.hasOwnProperty(key)) {
            continue;
          }
          let value = attributes[key];
          this[key] = value;
        }
        this.success = false;
        this.errors = new ValidationErrorsCollection(attributes.errors);
        if (attributes.transaction) {
          this.transaction = new Transaction(attributes.transaction, gateway2);
        }
      }
    };
    module2.exports = { ErrorResponse };
  }
});

// node_modules/braintree/lib/braintree/search_response_stream.js
var require_search_response_stream = __commonJS({
  "node_modules/braintree/lib/braintree/search_response_stream.js"(exports2, module2) {
    "use strict";
    var { Readable } = require("stream");
    var SearchResponseStream = class extends Readable {
      constructor(searchResponse) {
        super({ objectMode: true });
        this.searchResponse = searchResponse;
        this.currentItem = 0;
        this.currentOffset = 0;
        this.bufferedResults = [];
      }
      nextItem() {
        if (this.searchResponse.fatalError != null) {
          this.emit("error", this.searchResponse.fatalError);
          this.push(null);
          return;
        } else if (this.bufferedResults.length > 0) {
          this.pushBufferedResults();
          return;
        } else if (this.currentItem >= this.searchResponse.ids.length) {
          this.push(null);
          return;
        }
        let index = 0;
        this.searchResponse.pagingFunction(
          this.searchResponse.ids.slice(
            this.currentOffset,
            this.currentOffset + this.searchResponse.pageSize
          ),
          (err, item) => {
            if (err != null) {
              this.emit("error", err);
            } else {
              this.bufferedResults.push(item);
            }
            this.currentItem += 1;
            index += 1;
            if (index === this.searchResponse.pageSize || this.currentItem === this.searchResponse.ids.length) {
              this.push(this.bufferedResults.shift());
            }
          }
        );
        this.currentOffset += this.searchResponse.pageSize;
      }
      pushBufferedResults() {
        return (() => {
          let result1 = [];
          while (this.bufferedResults.length > 0) {
            let item;
            let result = this.push(this.bufferedResults.shift());
            if (result === false) {
              break;
            }
            result1.push(item);
          }
          return result1;
        })();
      }
      ready() {
        this.readyToStart = true;
        return this.emit("ready");
      }
      _read() {
        if (this.readyToStart != null) {
          return this.nextItem();
        }
        return this.on("ready", () => {
          return this.nextItem();
        });
      }
    };
    module2.exports = { SearchResponseStream };
  }
});

// node_modules/braintree/lib/braintree/search_response.js
var require_search_response = __commonJS({
  "node_modules/braintree/lib/braintree/search_response.js"(exports2, module2) {
    "use strict";
    var SearchResponseStream = require_search_response_stream().SearchResponseStream;
    var SearchResponse = class {
      constructor(pagingFunction, results) {
        if (pagingFunction != null) {
          this.setPagingFunction(pagingFunction);
        }
        if (results != null) {
          this.setResponse(results);
        }
        this.stream = new SearchResponseStream(this);
        this.success = true;
      }
      each(callback) {
        const ids = this.ids;
        const pageSize = this.pageSize;
        const pageIndicies = [];
        let current = 0;
        while (current < ids.length) {
          pageIndicies.push(current);
          current += pageSize;
        }
        return pageIndicies.forEach(
          (pageIndex) => this.pagingFunction(ids.slice(pageIndex, pageIndex + pageSize), callback)
        );
      }
      first(callback) {
        if (this.ids.length === 0) {
          return callback(null, null);
        }
        return this.pagingFunction([this.ids[0]], callback);
      }
      length() {
        return this.ids.length;
      }
      ready() {
        return this.stream.ready();
      }
      setFatalError(error) {
        this.fatalError = error;
      }
      setResponse(results) {
        this.ids = results.searchResults.ids;
        this.pageSize = parseInt(results.searchResults.pageSize, 10);
      }
      setPagingFunction(pagingFunction) {
        this.pagingFunction = pagingFunction;
      }
    };
    module2.exports = { SearchResponse };
  }
});

// node_modules/braintree/lib/braintree/gateway.js
var require_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/gateway.js"(exports2, module2) {
    "use strict";
    var ErrorResponse = require_error_response().ErrorResponse;
    var SearchResponse = require_search_response().SearchResponse;
    var exceptions = require_exceptions();
    var Gateway = class {
      createResponseHandler(attributeKlassMap, Klass) {
        let gateway2 = this.gateway;
        return function(response) {
          if (response.apiErrorResponse) {
            return Promise.resolve(
              new ErrorResponse(response.apiErrorResponse, gateway2)
            );
          }
          response.success = true;
          if (attributeKlassMap === null) {
            return Promise.resolve(response);
          } else if (typeof attributeKlassMap === "string") {
            let attributeName = attributeKlassMap;
            if (response[attributeName]) {
              if (Klass != null) {
                response[attributeName] = new Klass(
                  response[attributeName],
                  gateway2
                );
              }
            }
            return Promise.resolve(response);
          }
          let unknown = true;
          for (let attributeName in attributeKlassMap) {
            if (!attributeKlassMap.hasOwnProperty(attributeName)) {
              continue;
            }
            Klass = attributeKlassMap[attributeName];
            if (response[attributeName]) {
              unknown = false;
              if (Klass != null) {
                response[attributeName] = new Klass(
                  response[attributeName],
                  gateway2
                );
              }
              return Promise.resolve(response);
            }
          }
          if (unknown) {
            return Promise.resolve(response);
          }
        };
      }
      createSearchResponse(url, search, pagingFunction, callback) {
        let gateway2 = this.gateway;
        if (callback != null) {
          return gateway2.http.post(
            url,
            { search: search.toHash() },
            this.searchResponseHandler(pagingFunction, callback)
          );
        }
        let searchResponse = new SearchResponse();
        gateway2.http.post(
          url,
          { search: search.toHash() },
          function(err, response) {
            if (err != null) {
              searchResponse.setFatalError(err);
            } else if (response.searchResults) {
              searchResponse.setResponse(response);
              searchResponse.setPagingFunction(pagingFunction);
            } else if (response.apiErrorResponse) {
              searchResponse.setFatalError(
                new ErrorResponse(response.apiErrorResponse, gateway2)
              );
            } else {
              searchResponse.setFatalError(
                // eslint-disable-next-line new-cap
                exceptions.UnexpectedError("Unexpected Error")
              );
            }
            return searchResponse.ready();
          }
        );
        return searchResponse.stream;
      }
      searchResponseHandler(pagingFunction, callback) {
        let gateway2 = this.gateway;
        return function(err, response) {
          if (err) {
            return callback(err, response);
          }
          if (response.searchResults) {
            let container = new SearchResponse(pagingFunction, response);
            return callback(null, container);
          } else if (response.apiErrorResponse) {
            return callback(
              null,
              new ErrorResponse(response.apiErrorResponse, gateway2)
            );
          }
          return callback(exceptions.UnexpectedError("Unexpected Error"), null);
        };
      }
      pagingFunctionGenerator(search, url, SubjectType, pagedResultsKey, getSubject) {
        return (ids, callback) => {
          search.ids().in(ids);
          let gateway2 = this.gateway;
          gateway2.http.post(
            `${this.config.baseMerchantPath()}/${url}`,
            { search: search.toHash() },
            (err, response) => {
              if (err) {
                callback(err, null);
                return;
              } else if (pagedResultsKey in response) {
                if (Array.isArray(getSubject(response))) {
                  getSubject(response).forEach((subject) => {
                    callback(null, new SubjectType(subject, gateway2));
                  });
                  return;
                }
                callback(null, new SubjectType(getSubject(response), gateway2));
                return;
              }
              callback(exceptions.UnexpectedError("Unexpected Error"), null);
            }
          );
        };
      }
    };
    module2.exports = { Gateway };
  }
});

// node_modules/braintree/lib/braintree/add_on_gateway.js
var require_add_on_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/add_on_gateway.js"(exports2, module2) {
    "use strict";
    var AddOn = require_add_on().AddOn;
    var Gateway = require_gateway().Gateway;
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var AddOnGateway = class extends Gateway {
      constructor(gateway2) {
        super();
        this.gateway = gateway2;
        this.config = this.gateway.config;
      }
      all() {
        return this.gateway.http.get(`${this.config.baseMerchantPath()}/add_ons`).then(this.createResponseHandler("add_on", AddOn)).then((response) => {
          if (!response.success) {
            return response;
          }
          const collection = response.addOns;
          collection.success = response.success;
          collection.addOns = response.addOns;
          return collection;
        });
      }
    };
    module2.exports = { AddOnGateway: wrapPrototype(AddOnGateway) };
  }
});

// node_modules/braintree/lib/braintree/address.js
var require_address = __commonJS({
  "node_modules/braintree/lib/braintree/address.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var Address = class extends AttributeSetter {
    };
    module2.exports = { Address };
  }
});

// node_modules/braintree/lib/braintree/address_gateway.js
var require_address_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/address_gateway.js"(exports2, module2) {
    "use strict";
    var Gateway = require_gateway().Gateway;
    var Address = require_address().Address;
    var exceptions = require_exceptions();
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var AddressGateway = class extends Gateway {
      constructor(gateway2) {
        super();
        this.gateway = gateway2;
        this.config = this.gateway.config;
      }
      create(attributes) {
        let customerId = attributes.customerId;
        delete attributes.customerId;
        return this.gateway.http.post(
          `${this.config.baseMerchantPath()}/customers/${customerId}/addresses`,
          { address: attributes }
        ).then(this.responseHandler());
      }
      delete(customerId, id) {
        let path2 = `${this.config.baseMerchantPath()}/customers/${customerId}/addresses/${id}`;
        return this.gateway.http.delete(path2);
      }
      find(customerId, id) {
        if (customerId.trim() === "" || id.trim() === "") {
          return Promise.reject(exceptions.NotFoundError("Not Found"));
        }
        return this.gateway.http.get(
          `${this.config.baseMerchantPath()}/customers/${customerId}/addresses/${id}`
        ).then((response) => {
          return response.address;
        });
      }
      update(customerId, id, attributes) {
        return this.gateway.http.put(
          `${this.config.baseMerchantPath()}/customers/${customerId}/addresses/${id}`,
          { address: attributes }
        ).then(this.responseHandler());
      }
      responseHandler() {
        return this.createResponseHandler("address", Address);
      }
      sharedSignature(prefix) {
        let signatureKeys = [
          "company",
          "countryCodeAlpha2",
          "countryCodeAlpha3",
          "countryCodeNumeric",
          "countryName",
          "extendedAddress",
          "firstName",
          "lastName",
          "locality",
          "phoneNumber",
          "postalCode",
          "region",
          "streetAddress"
        ];
        let signature = [];
        for (let val of signatureKeys) {
          signature.push(prefix + "[" + val + "]");
        }
        if (prefix) {
          signature.push(prefix + "[internationalPhone][countryCode]");
          signature.push(prefix + "[internationalPhone][nationalNumber]");
        } else {
          signature.push("internationalPhone[countryCode]");
          signature.push("internationalPhone[nationalNumber]");
        }
        return signature;
      }
    };
    module2.exports = { AddressGateway: wrapPrototype(AddressGateway) };
  }
});

// node_modules/braintree/lib/braintree/client_token_gateway.js
var require_client_token_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/client_token_gateway.js"(exports2, module2) {
    "use strict";
    var Gateway = require_gateway().Gateway;
    var ErrorResponse = require_error_response().ErrorResponse;
    var Util = require_util().Util;
    var exceptions = require_exceptions();
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var DEFAULT_VERSION = 2;
    var ClientTokenGateway = class extends Gateway {
      constructor(gateway2) {
        super();
        this.gateway = gateway2;
        this.config = this.gateway.config;
      }
      generate(params) {
        let err;
        params = params || {};
        if (!params.version) {
          params.version = DEFAULT_VERSION;
        }
        err = this.validateParams(params);
        if (!err) {
          err = Util.verifyKeys(this._generateSignature(), params);
        }
        if (err) {
          return Promise.reject(err);
        }
        params = { client_token: params };
        return this.gateway.http.post(`${this.config.baseMerchantPath()}/client_token`, params).then(this.responseHandler());
      }
      validateParams(params) {
        if (params.customerId || !params.options) {
          return;
        }
        let options = [
          "failOnDuplicatePaymentMethod",
          "failOnDuplicatePaymentMethodForCustomer",
          "makeDefault",
          "verifyCard"
        ];
        let invalidOptions = options.filter((name) => params.options[name]).map((name) => name);
        if (invalidOptions.length > 0) {
          return exceptions.UnexpectedError(
            `A customer id is required for the following options: ${invalidOptions.join(
              ", "
            )}`
          );
        }
        return null;
      }
      responseHandler() {
        let gateway2 = this.gateway;
        return function(response) {
          if (response.clientToken) {
            response.success = true;
            response.clientToken = response.clientToken.value;
            return response;
          } else if (response.apiErrorResponse) {
            return new ErrorResponse(response.apiErrorResponse, gateway2);
          }
        };
      }
      _generateSignature() {
        return {
          valid: [
            "addressId",
            "customerId",
            "proxyMerchantId",
            "merchantAccountId",
            "version",
            "options",
            "options[makeDefault]",
            "options[verifyCard]",
            "options[failOnDuplicatePaymentMethod]",
            "options[failOnDuplicatePaymentMethodForCustomer]"
          ],
          ignore: ["domains"]
        };
      }
    };
    module2.exports = { ClientTokenGateway: wrapPrototype(ClientTokenGateway) };
  }
});

// node_modules/braintree/lib/braintree/advanced_search.js
var require_advanced_search = __commonJS({
  "node_modules/braintree/lib/braintree/advanced_search.js"(exports2, module2) {
    "use strict";
    var Util = require_util().Util;
    function argsToArray(argsObject) {
      return Array.prototype.slice.call(argsObject);
    }
    var AdvancedSearch = class {
      static equalityFields() {
        let fields = argsToArray(arguments);
        return this._createFieldAccessors(fields, EqualityNode);
      }
      static partialMatchFields() {
        let fields = argsToArray(arguments);
        return this._createFieldAccessors(fields, PartialMatchNode);
      }
      static endsWithFields() {
        let fields = argsToArray(arguments);
        return this._createFieldAccessors(fields, EndsWithNode);
      }
      static textFields() {
        let fields = argsToArray(arguments);
        return this._createFieldAccessors(fields, TextNode);
      }
      static keyValueFields() {
        let fields = argsToArray(arguments);
        return this._createFieldAccessors(fields, KeyValueNode);
      }
      static multipleValueField(field, options) {
        options = options || {};
        return this._createFieldAccessors([field], MultipleValueNode, options);
      }
      static multipleValueOrTextField(field, options) {
        options = options || {};
        return this._createFieldAccessors(
          [field],
          MultipleValueOrTextNode,
          options
        );
      }
      static rangeFields() {
        let fields = argsToArray(arguments);
        return this._createFieldAccessors(fields, RangeNode);
      }
      static _createFieldAccessors(fields, nodeClass, options) {
        return fields.map((field) => {
          this.prototype[field] = this._fieldTemplate(field, nodeClass, options);
          return this.prototype[field];
        });
      }
      static _fieldTemplate(field, NodeClass, options) {
        return function() {
          return new NodeClass(field, this, options);
        };
      }
      constructor() {
        this.criteria = {};
      }
      // eslint-disable-next-line consistent-return
      addCriteria(key, value) {
        if (this.criteria[key] === Object(this.criteria[key]) && !Array.isArray(this.criteria[key])) {
          return Util.merge(this.criteria[key], value);
        }
        this.criteria[key] = value;
      }
      toHash() {
        return this.criteria;
      }
    };
    var SearchNode = class {
      static operators() {
        let operators = argsToArray(arguments);
        let operatorTemplate = (operator) => {
          return function(value) {
            let criterion = {};
            criterion[operator] = `${value}`;
            return this.parent.addCriteria(this.nodeName, criterion);
          };
        };
        return operators.map((operator) => {
          this.prototype[operator] = operatorTemplate(operator);
        });
      }
      constructor(nodeName, parent) {
        this.nodeName = nodeName;
        this.parent = parent;
      }
    };
    var EqualityNode = class extends SearchNode {
      static initClass() {
        this.operators("is", "isNot");
      }
    };
    EqualityNode.initClass();
    var PartialMatchNode = class extends EqualityNode {
      static initClass() {
        this.operators("endsWith", "startsWith");
      }
    };
    PartialMatchNode.initClass();
    var EndsWithNode = class extends SearchNode {
      static initClass() {
        this.operators("endsWith");
      }
    };
    EndsWithNode.initClass();
    var TextNode = class extends PartialMatchNode {
      static initClass() {
        this.operators("contains");
      }
    };
    TextNode.initClass();
    var KeyValueNode = class extends SearchNode {
      is(value) {
        return this.parent.addCriteria(this.nodeName, value);
      }
    };
    var MultipleValueNode = class extends SearchNode {
      constructor(nodeName, parent, options) {
        super(nodeName, parent);
        this.options = options;
      }
      allowedValues() {
        return this.options.allows;
      }
      in() {
        let values = argsToArray(arguments);
        values = Util.flatten(values);
        if (__guardMethod__(this, "allowedValues", (o) => o.allowedValues())) {
          let allowedValues = this.allowedValues();
          let badValues = Util.without(values, allowedValues);
          if (!Util.arrayIsEmpty(badValues)) {
            throw new Error(`Invalid argument(s) for ${this.nodeName}`);
          }
        }
        return this.parent.addCriteria(this.nodeName, values);
      }
      is(value) {
        return this.in(value);
      }
    };
    var MultipleValueOrTextNode = class extends MultipleValueNode {
      static initClass() {
        this.delegators("contains", "endsWith", "is", "isNot", "startsWith");
      }
      static delegators() {
        let delegatedMethods = argsToArray(arguments);
        let delegatorTemplate = (methodName) => {
          return function(value) {
            return this.textNode[methodName](value);
          };
        };
        return delegatedMethods.map((methodName) => {
          this.prototype[methodName] = delegatorTemplate(methodName);
        });
      }
      constructor(nodeName, parent, options) {
        super(nodeName, parent, options);
        this.textNode = new TextNode(nodeName, parent);
      }
    };
    MultipleValueOrTextNode.initClass();
    var RangeNode = class extends SearchNode {
      static initClass() {
        this.operators("is");
      }
      between(min, max) {
        this.min(min);
        return this.max(max);
      }
      max(value) {
        return this.parent.addCriteria(this.nodeName, { max: value });
      }
      min(value) {
        return this.parent.addCriteria(this.nodeName, { min: value });
      }
    };
    RangeNode.initClass();
    module2.exports = { AdvancedSearch };
    function __guardMethod__(obj, methodName, transform) {
      if (typeof obj !== "undefined" && obj !== null && typeof obj[methodName] === "function") {
        return transform(obj, methodName);
      }
    }
  }
});

// node_modules/braintree/lib/braintree/credit_card_search.js
var require_credit_card_search = __commonJS({
  "node_modules/braintree/lib/braintree/credit_card_search.js"(exports2, module2) {
    "use strict";
    var { AdvancedSearch } = require_advanced_search();
    var CreditCardSearch = class extends AdvancedSearch {
      static initClass() {
        this.multipleValueField("ids");
      }
    };
    CreditCardSearch.initClass();
    module2.exports = { CreditCardSearch };
  }
});

// node_modules/braintree/lib/braintree/credit_card_gateway.js
var require_credit_card_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/credit_card_gateway.js"(exports2, module2) {
    "use strict";
    var { Gateway } = require_gateway();
    var { CreditCard } = require_credit_card();
    var exceptions = require_exceptions();
    var { CreditCardSearch } = require_credit_card_search();
    var { wrapPrototype } = require_wrap_promise();
    var CreditCardGateway = class extends Gateway {
      constructor(gateway2) {
        super();
        this.gateway = gateway2;
        this.config = this.gateway.config;
      }
      create(attributes) {
        this._checkForDeprecatedAttributes(attributes);
        return this.gateway.http.post(`${this.config.baseMerchantPath()}/payment_methods`, {
          creditCard: attributes
        }).then(this.responseHandler());
      }
      delete(token) {
        let path2 = `${this.config.baseMerchantPath()}/payment_methods/credit_card/${token}`;
        return this.gateway.http.delete(path2);
      }
      find(token) {
        if (token.trim() === "") {
          return Promise.reject(exceptions.NotFoundError("Not Found"));
        }
        return this.gateway.http.get(
          `${this.config.baseMerchantPath()}/payment_methods/credit_card/${token}`
        ).then(function(response) {
          return new CreditCard(response.creditCard);
        });
      }
      fromNonce(nonce) {
        if (nonce.trim() === "") {
          return Promise.reject(exceptions.NotFoundError("Not Found"));
        }
        return this.gateway.http.get(
          `${this.config.baseMerchantPath()}/payment_methods/from_nonce/${nonce}`
        ).then((response) => {
          return new CreditCard(response.creditCard);
        }).catch((err) => {
          err.message = `Payment method with nonce ${nonce} locked, consumed or not found`;
          return Promise.reject(err);
        });
      }
      update(token, attributes) {
        this._checkForDeprecatedAttributes(attributes);
        return this.gateway.http.put(
          `${this.config.baseMerchantPath()}/payment_methods/credit_card/${token}`,
          { creditCard: attributes }
        ).then(this.responseHandler());
      }
      responseHandler() {
        return this.createResponseHandler("creditCard", CreditCard);
      }
      expired(callback) {
        const searchUrl = `${this.config.baseMerchantPath()}/payment_methods/all/expired_ids`;
        const search = new CreditCardSearch();
        const pagingFunction = this.pagingFunctionGenerator(
          search,
          "payment_methods/all/expired"
        );
        return this.createSearchResponse(
          searchUrl,
          search,
          pagingFunction,
          callback
        );
      }
      expiringBetween(startDate, endDate, callback) {
        const query = `start=${this.dateFormat(startDate)}&end=${this.dateFormat(
          endDate
        )}`;
        const searchUrl = `${this.config.baseMerchantPath()}/payment_methods/all/expiring_ids?${query}`;
        const search = new CreditCardSearch();
        const pagingFunction = this.pagingFunctionGenerator(
          search,
          `payment_methods/all/expiring?${query}`
        );
        return this.createSearchResponse(
          searchUrl,
          search,
          pagingFunction,
          callback
        );
      }
      dateFormat(date) {
        let month = date.getMonth() + 1;
        if (month < 10) {
          month = `0${month}`;
        } else {
          month = `${month}`;
        }
        return month + date.getFullYear();
      }
      pagingFunctionGenerator(search, url) {
        return super.pagingFunctionGenerator(
          search,
          url,
          CreditCard,
          "paymentMethods",
          (response) => response.paymentMethods.creditCard
        );
      }
      _checkForDeprecatedAttributes(attributes) {
        if (attributes.deviceSessionId != null) {
          console.warn(
            "[DEPRECATED] `deviceSessionId` is a deprecated param for CreditCard objects. Use `deviceData` instead"
          );
        }
        if (attributes.fraudMerchantId != null) {
          console.warn(
            "[DEPRECATED] `fraudMerchantId` is a deprecated param for CreditCard objects. Use `deviceData` instead"
          );
        }
        if (attributes.venmoSdkPaymentMethodCode != null) {
          console.warn(
            "The Venmo SDK integration is Unsupported. Please update your integration to use Pay with Venmo instead (https://developer.paypal.com/braintree/docs/guides/venmo/overview)"
          );
        }
        if (attributes.options != null && attributes.options.venmoSdkSession != null) {
          console.warn(
            "The Venmo SDK integration is Unsupported. Please update your integration to use Pay with Venmo instead (https://developer.paypal.com/braintree/docs/guides/venmo/overview)"
          );
        }
      }
    };
    module2.exports = {
      CreditCardGateway: wrapPrototype(CreditCardGateway, {
        ignoreMethods: ["expired", "expiringBetween"]
      })
    };
  }
});

// node_modules/braintree/lib/braintree/credit_card_verification_search.js
var require_credit_card_verification_search = __commonJS({
  "node_modules/braintree/lib/braintree/credit_card_verification_search.js"(exports2, module2) {
    "use strict";
    var AdvancedSearch = require_advanced_search().AdvancedSearch;
    var CreditCard = require_credit_card().CreditCard;
    var CreditCardVerification = require_credit_card_verification().CreditCardVerification;
    var CreditCardVerificationSearch = class extends AdvancedSearch {
      static initClass() {
        this.textFields(
          "billingAddressDetailsPostalCode",
          "creditCardCardholderName",
          "customerEmail",
          "customerId",
          "id",
          "paymentMethodToken"
        );
        this.equalityFields("creditCardExpirationDate");
        this.partialMatchFields("creditCardNumber");
        this.multipleValueField("creditCardCardType", {
          // eslint-disable-next-line new-cap
          allows: CreditCard.CardType.All()
        });
        this.multipleValueField("status", {
          // eslint-disable-next-line new-cap
          allows: CreditCardVerification.StatusType.All()
        });
        this.multipleValueField("ids");
        this.rangeFields("createdAt");
      }
    };
    CreditCardVerificationSearch.initClass();
    module2.exports = { CreditCardVerificationSearch };
  }
});

// node_modules/braintree/lib/braintree/credit_card_verification_gateway.js
var require_credit_card_verification_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/credit_card_verification_gateway.js"(exports2, module2) {
    "use strict";
    var Gateway = require_gateway().Gateway;
    var CreditCardVerification = require_credit_card_verification().CreditCardVerification;
    var CreditCardVerificationSearch = require_credit_card_verification_search().CreditCardVerificationSearch;
    var Util = require_util().Util;
    var exceptions = require_exceptions();
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var CreditCardVerificationGateway = class extends Gateway {
      constructor(gateway2) {
        super();
        this.gateway = gateway2;
        this.config = this.gateway.config;
      }
      find(creditCardVerificationId) {
        if (creditCardVerificationId.trim() === "") {
          return Promise.reject(exceptions.NotFoundError("Not Found"));
        }
        return this.gateway.http.get(
          `${this.config.baseMerchantPath()}/verifications/${creditCardVerificationId}`
        ).then(function(response) {
          return new CreditCardVerification(response.verification);
        });
      }
      search(fn, callback) {
        let search = new CreditCardVerificationSearch();
        fn(search);
        return this.createSearchResponse(
          `${this.config.baseMerchantPath()}/verifications/advanced_search_ids`,
          search,
          this.pagingFunctionGenerator(search),
          callback
        );
      }
      create(params) {
        let invalidKeysError = Util.verifyKeys(this._createSignature(), params);
        if (invalidKeysError) {
          return Promise.reject(invalidKeysError, null);
        }
        return this.gateway.http.post(`${this.config.baseMerchantPath()}/verifications`, {
          verification: params
        }).then(this.createResponseHandler("verification", CreditCardVerification));
      }
      responseHandler() {
        return this.createResponseHandler(
          "creditCardVerification",
          CreditCardVerification
        );
      }
      pagingFunctionGenerator(search) {
        return (ids, callback) => {
          let searchCriteria = search.toHash();
          searchCriteria.ids = ids;
          return this.gateway.http.post(
            `${this.config.baseMerchantPath()}/verifications/advanced_search`,
            { search: searchCriteria },
            function(err, response) {
              if (err) {
                return callback(err, null);
              } else if (Array.isArray(response.creditCardVerifications.verification)) {
                return response.creditCardVerifications.verification.map(
                  (creditCardVerification) => callback(
                    null,
                    new CreditCardVerification(creditCardVerification)
                  )
                );
              }
              return callback(
                null,
                new CreditCardVerification(
                  response.creditCardVerifications.verification
                )
              );
            }
          );
        };
      }
      _createSignature() {
        return {
          valid: [
            "creditCard",
            "creditCard[billingAddress]",
            "creditCard[billingAddress][company]",
            "creditCard[billingAddress][countryCodeAlpha2]",
            "creditCard[billingAddress][countryCodeAlpha3]",
            "creditCard[billingAddress][countryCodeNumeric]",
            "creditCard[billingAddress][countryName]",
            "creditCard[billingAddress][extendedAddress]",
            "creditCard[billingAddress][firstName]",
            "creditCard[billingAddress][lastName]",
            "creditCard[billingAddress][locality]",
            "creditCard[billingAddress][postalCode]",
            "creditCard[billingAddress][region]",
            "creditCard[billingAddress][streetAddress]",
            "creditCard[cardholderName]",
            "creditCard[cvv]",
            "creditCard[expirationDate]",
            "creditCard[expirationMonth]",
            "creditCard[expirationYear]",
            "creditCard[number]",
            "externalVault",
            "externalVault[previousNetworkTransactionId]",
            "externalVault[status]",
            "intendedTransactionSource",
            "paymentMethodNonce",
            "options",
            "options[accountType]",
            "options[amount]",
            "options[merchantAccountId]",
            "riskData",
            "riskData[customerBrowser]",
            "riskData[customerIp]",
            "threeDSecureAuthenticationId",
            "threeDSecurePassThru",
            "threeDSecurePassThru[authenticationResponse]",
            "threeDSecurePassThru[cavv]",
            "threeDSecurePassThru[cavvAlgorithm]",
            "threeDSecurePassThru[directoryResponse]",
            "threeDSecurePassThru[dsTransactionId]",
            "threeDSecurePassThru[eciFlag]",
            "threeDSecurePassThru[xid]",
            "threeDSecurePassThru[threeDSecureVersion]"
          ]
        };
      }
    };
    module2.exports = {
      CreditCardVerificationGateway: wrapPrototype(CreditCardVerificationGateway, {
        ignoreMethods: ["search"]
      })
    };
  }
});

// node_modules/braintree/lib/braintree/venmo_account.js
var require_venmo_account = __commonJS({
  "node_modules/braintree/lib/braintree/venmo_account.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var VenmoAccount = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
      }
    };
    module2.exports = { VenmoAccount };
  }
});

// node_modules/braintree/lib/braintree/sepa_direct_debit_account.js
var require_sepa_direct_debit_account = __commonJS({
  "node_modules/braintree/lib/braintree/sepa_direct_debit_account.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var SepaDirectDebitAccount = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
      }
    };
    module2.exports = { SepaDirectDebitAccount };
  }
});

// node_modules/braintree/lib/braintree/customer.js
var require_customer = __commonJS({
  "node_modules/braintree/lib/braintree/customer.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var ApplePayCard = require_apple_pay_card().ApplePayCard;
    var AndroidPayCard = require_android_pay_card().AndroidPayCard;
    var CreditCard = require_credit_card().CreditCard;
    var PayPalAccount = require_paypal_account().PayPalAccount;
    var VenmoAccount = require_venmo_account().VenmoAccount;
    var SepaDirectDebitAccount = require_sepa_direct_debit_account().SepaDirectDebitAccount;
    var UsBankAccount = require_us_bank_account().UsBankAccount;
    var Customer = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
        this.paymentMethods = [];
        if (attributes.creditCards) {
          this.creditCards = attributes.creditCards.map(
            (cardAttributes) => new CreditCard(cardAttributes)
          );
          this._addPaymentMethods(this.creditCards);
        }
        if (attributes.applePayCards) {
          this.applePayCards = attributes.applePayCards.map(
            (cardAttributes) => new ApplePayCard(cardAttributes)
          );
          this._addPaymentMethods(this.applePayCards);
        }
        if (attributes.androidPayCards) {
          this.androidPayCards = attributes.androidPayCards.map(
            (cardAttributes) => new AndroidPayCard(cardAttributes)
          );
          this._addPaymentMethods(this.androidPayCards);
        }
        if (attributes.paypalAccounts) {
          this.paypalAccounts = attributes.paypalAccounts.map(
            (paypalAccountAttributes) => new PayPalAccount(paypalAccountAttributes)
          );
          this._addPaymentMethods(this.paypalAccounts);
        }
        if (attributes.sepaDebitAccounts) {
          this.sepaDirectDebitAccounts = attributes.sepaDebitAccounts.map(
            (sepaDebitAccountAttributes) => new SepaDirectDebitAccount(sepaDebitAccountAttributes)
          );
          this._addPaymentMethods(this.sepaDirectDebitAccounts);
        }
        if (attributes.venmoAccounts) {
          this.venmoAccounts = attributes.venmoAccounts.map(
            (venmoAccountAttributes) => new VenmoAccount(venmoAccountAttributes)
          );
          this._addPaymentMethods(this.venmoAccounts);
        }
        if (attributes.usBankAccounts) {
          this.usBankAccounts = attributes.usBankAccounts.map(
            (usBankAccountAttributes) => new UsBankAccount(usBankAccountAttributes)
          );
          this._addPaymentMethods(this.usBankAccounts);
        }
      }
      _addPaymentMethods(paymentMethods) {
        return paymentMethods.map(
          (paymentMethod) => this.paymentMethods.push(paymentMethod)
        );
      }
    };
    module2.exports = { Customer };
  }
});

// node_modules/braintree/lib/braintree/customer_search.js
var require_customer_search = __commonJS({
  "node_modules/braintree/lib/braintree/customer_search.js"(exports2, module2) {
    "use strict";
    var AdvancedSearch = require_advanced_search().AdvancedSearch;
    var CustomerSearch = class extends AdvancedSearch {
      static initClass() {
        this.textFields(
          "addressCountryName",
          "addressExtendedAddress",
          "addressFirstName",
          "addressLastName",
          "addressLocality",
          "addressPostalCode",
          "addressRegion",
          "addressStreetAddress",
          "cardholderName",
          "company",
          "email",
          "fax",
          "firstName",
          "id",
          "lastName",
          "paymentMethodToken",
          "paypalAccountEmail",
          "phone",
          "website",
          "paymentMethodTokenWithDuplicates"
        );
        this.equalityFields("creditCardExpirationDate");
        this.partialMatchFields("creditCardNumber");
        this.multipleValueField("ids");
        this.rangeFields("createdAt");
      }
    };
    CustomerSearch.initClass();
    module2.exports = { CustomerSearch };
  }
});

// node_modules/braintree/lib/braintree/customer_gateway.js
var require_customer_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/customer_gateway.js"(exports2, module2) {
    "use strict";
    var Gateway = require_gateway().Gateway;
    var Util = require_util().Util;
    var Customer = require_customer().Customer;
    var CustomerSearch = require_customer_search().CustomerSearch;
    var exceptions = require_exceptions();
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var CustomerGateway = class extends Gateway {
      constructor(gateway2) {
        super();
        this.gateway = gateway2;
        this.config = this.gateway.config;
      }
      create(attributes) {
        let invalidKeysError = Util.verifyKeys(this._createSignature(), attributes);
        if (invalidKeysError) {
          return Promise.reject(invalidKeysError);
        }
        this._checkForDeprecatedAttributes(attributes);
        return this.gateway.http.post(`${this.config.baseMerchantPath()}/customers`, {
          customer: attributes
        }).then(this.responseHandler());
      }
      delete(customerId) {
        return this.gateway.http.delete(
          `${this.config.baseMerchantPath()}/customers/${customerId}`
        );
      }
      find(customerId, associationFilterId) {
        let queryParams = "";
        if (customerId.trim() === "") {
          return Promise.reject(exceptions.NotFoundError("Not Found"), null);
        }
        if (associationFilterId) {
          queryParams = `?association_filter_id=${associationFilterId}`;
        }
        return this.gateway.http.get(
          `${this.config.baseMerchantPath()}/customers/${customerId}${queryParams}`
        ).then(function(response) {
          return new Customer(response.customer);
        });
      }
      update(customerId, attributes) {
        this._checkForDeprecatedAttributes(attributes);
        return this.gateway.http.put(`${this.config.baseMerchantPath()}/customers/${customerId}`, {
          customer: attributes
        }).then(this.responseHandler());
      }
      search(fn, callback) {
        let search = new CustomerSearch();
        fn(search);
        return this.createSearchResponse(
          `${this.config.baseMerchantPath()}/customers/advanced_search_ids`,
          search,
          this.pagingFunctionGenerator(search),
          callback
        );
      }
      responseHandler() {
        return this.createResponseHandler("customer", Customer);
      }
      pagingFunctionGenerator(search) {
        return super.pagingFunctionGenerator(
          search,
          "customers/advanced_search",
          Customer,
          "customers",
          (response) => response.customers.customer
        );
      }
      _createSignature() {
        return {
          valid: [
            "id",
            "company",
            "email",
            "fax",
            "firstName",
            "internationalPhone[countryCode]",
            "internationalPhone[nationalNumber]",
            "lastName",
            "phone",
            "website",
            "deviceData",
            // NEXT_MAJOR_VERSION remove deviceSessionId
            "deviceSessionId",
            // NEXT_MAJOR_VERSION remove fraudMerchantId
            "fraudMerchantId",
            "paymentMethodNonce",
            "riskData",
            "riskData[customerBrowser]",
            "riskData[customerIp]",
            "creditCard",
            "creditCard[token]",
            "creditCard[cardholderName]",
            "creditCard[cvv]",
            "creditCard[expirationDate]",
            "creditCard[expirationMonth]",
            "creditCard[expirationYear]",
            "creditCard[number]",
            "creditCard[paymentMethodNonce]",
            // NEXT_MAJOR_VERSION remove "creditCard[venmoSdkPaymentMethodCode]"
            "creditCard[venmoSdkPaymentMethodCode]",
            "creditCard[options]",
            "creditCard[threeDSecurePassThru]",
            "creditCard[threeDSecurePassThru][eciFlag]",
            "creditCard[threeDSecurePassThru][cavv]",
            "creditCard[threeDSecurePassThru][xid]",
            "creditCard[threeDSecurePassThru][threeDSecureVersion]",
            "creditCard[threeDSecurePassThru][authenticationResponse]",
            "creditCard[threeDSecurePassThru][directoryResponse]",
            "creditCard[threeDSecurePassThru][cavvAlgorithm]",
            "creditCard[threeDSecurePassThru][dsTransactionId]",
            "creditCard[options][failOnDuplicatePaymentMethod]",
            "creditCard[options][makeDefault]",
            "creditCard[options][skipAdvancedFraudChecking]",
            "creditCard[options][verificationAmount]",
            "creditCard[options][verificationMerchantAccountId]",
            "creditCard[options][verifyCard]",
            "creditCard[options][verificationAccountType]",
            // NEXT_MAJOR_VERSION remove "creditCard[options][venmoSdkSession]"
            "creditCard[options][venmoSdkSession]",
            "creditCard[billingAddress]",
            "creditCard[billingAddress][company]",
            "creditCard[billingAddress][countryCodeAlpha2]",
            "creditCard[billingAddress][countryCodeAlpha3]",
            "creditCard[billingAddress][countryCodeNumeric]",
            "creditCard[billingAddress][countryName]",
            "creditCard[billingAddress][extendedAddress]",
            "creditCard[billingAddress][firstName]",
            "creditCard[billingAddress][lastName]",
            "creditCard[billingAddress][locality]",
            "creditCard[billingAddress][postalCode]",
            "creditCard[billingAddress][region]",
            "creditCard[billingAddress][streetAddress]",
            "creditCard[billingAddress][phoneNumber]",
            "creditCard[billingAddress][options]",
            "creditCard[billingAddress][options][updateExisting]",
            "taxIdentifiers[countryCode]",
            "taxIdentifiers[identifier]",
            "options",
            "options[paypal]",
            "options[paypal][payeeEmail]",
            "options[paypal][orderId]",
            "options[paypal][amount]",
            "options[paypal][description]",
            "options[paypal][shipping]",
            "options[paypal][shipping][firstName]",
            "options[paypal][shipping][lastName]",
            "options[paypal][shipping][company]",
            "options[paypal][shipping][countryName]",
            "options[paypal][shipping][countryCodeAlpha2]",
            "options[paypal][shipping][countryCodeAlpha3]",
            "options[paypal][shipping][countryCodeNumeric]",
            "options[paypal][shipping][extendedAddress]",
            "options[paypal][shipping][locality]",
            "options[paypal][shipping][postalCode]",
            "options[paypal][shipping][region]",
            "options[paypal][shipping][streetAddress]",
            "options[paypal][shipping][phoneNumber]"
          ],
          ignore: ["customFields", "options[paypal][customField]"]
        };
      }
      _checkForDeprecatedAttributes(attributes) {
        if (attributes.deviceSessionId != null) {
          console.warn(
            "[DEPRECATED] `deviceSessionId` is a deprecated param for Customer objects. Use `deviceData` instead"
          );
        }
        if (attributes.fraudMerchantId != null) {
          console.warn(
            "[DEPRECATED] `fraudMerchantId` is a deprecated param for Customer objects. Use `deviceData` instead"
          );
        }
        if (attributes.creditCard != null) {
          if (attributes.creditCard.venmoSdkPaymentMethodCode != null) {
            console.warn(
              "The Venmo SDK integration is Unsupported. Please update your integration to use Pay with Venmo instead (https://developer.paypal.com/braintree/docs/guides/venmo/overview)"
            );
          }
          if (attributes.creditCard.options != null && attributes.creditCard.options.venmoSdkSession != null) {
            console.warn(
              "The Venmo SDK integration is Unsupported. Please update your integration to use Pay with Venmo instead (https://developer.paypal.com/braintree/docs/guides/venmo/overview)"
            );
          }
        }
      }
    };
    module2.exports = {
      CustomerGateway: wrapPrototype(CustomerGateway, {
        ignoreMethods: ["search"]
      })
    };
  }
});

// node_modules/braintree/lib/braintree/customer_session_gateway.js
var require_customer_session_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/customer_session_gateway.js"(exports2, module2) {
    "use strict";
    var Gateway = require_gateway().Gateway;
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var exceptions = require_exceptions();
    var { GraphQLClient } = require_graphql_client();
    var {
      CreateCustomerSessionInput,
      CustomerRecommendations,
      CustomerRecommendationsInput,
      CustomerRecommendationsPayload,
      RecommendedPaymentOption,
      PaymentOptions,
      UpdateCustomerSessionInput
    } = require_graphql2();
    var CustomerSessionGateway = class extends Gateway {
      constructor(gateway2) {
        super();
        this._graphQLClient = gateway2.graphQLClient;
      }
      /**
       * Creates a new customer session.
       *
       * Customer sessions can be created with or without a merchant-provided session
       * ID. If a session ID is not provided in the input, one will be generated by
       * the gateway. Attempt to create a duplicate session will result in an error.
       * Customer specific information such as email, phone number and device
       * information can be optionally included in the input object.
       *
       * Example:
       *
       * <pre>
       * <code>
       *   var input = CreateCustomerSessionInput
       *     .builder()
       *     .sessionId(...)
       *     .customer(...)
       *     .build();
       *
       *   gateway.customerSession()
       *     .createCustomerSession(input)
       *     .then(function (result) {
       *       if (result.success) {
       *         console.log("session id",result.target);
       *       }
       *     });
       *
       * </code>
       * </pre>
       *
       * @param {CreateCustomerSessionInput} input The input parameters for creating a customer session.
       *
       * @return {object} A result object containing the session ID if successful, or errors otherwise.
       *
       * @throws {InvalidKeysError} If invalid input object is provided.
       * @throws {UnexpectedError} If an unexpected error occurs.
       */
      createCustomerSession(input) {
        if (!(input instanceof CreateCustomerSessionInput)) {
          return Promise.reject(
            // eslint-disable-next-line new-cap
            exceptions.InvalidKeysError(
              "Invalid input type. Use CreateCustomerSessionInput to build the input object."
            )
          );
        }
        return this._executeMutation(
          `mutation CreateCustomerSession($input: CreateCustomerSessionInput!) { 
        createCustomerSession(input: $input) {
          sessionId
        }
      }`,
          input,
          "createCustomerSession"
        );
      }
      /**
       * Updates an existing customer session.
       *
       * Example:
       *
       * <pre>
       * <code>
       *   var input = UpdateCustomerSessionInput
       *     .builder(sessionId)
       *     .customer(...)
       *     .build();
       *
       *   gateway
       *     .customerSession()
       *     .updateCustomerSession(input)
       *     .then((result) => {
       *       if (result.success) {
       *         console.log("session id", result.target);
       *       }
       *     });
       *
       * </code>
       * </pre>
       *
       * @param {UpdateCustomerSessionInput} input The input parameters for updating a customer session.
       *
       * @return {object} A result object containing the session ID if successful, or errors otherwise.
       *
       * @throws {InvalidKeysError} If invalid input object is provided.
       * @throws {UnexpectedError} If an unexpected error occurs.
       */
      updateCustomerSession(input) {
        if (!(input instanceof UpdateCustomerSessionInput)) {
          return Promise.reject(
            // eslint-disable-next-line new-cap
            exceptions.InvalidKeysError(
              "Invalid input type. Use UpdateCustomerSessionInput to build the input object."
            )
          );
        }
        return this._executeMutation(
          `mutation UpdateCustomerSession($input: UpdateCustomerSessionInput!) { 
        updateCustomerSession(input: $input) {
          sessionId
        }
      }`,
          input,
          "updateCustomerSession"
        );
      }
      /**
       * Retrieves customer recommendations associated with a customer session.
       *
       * Example:
       * <pre>
       * <code>
       *
       *   var input = CustomerRecommendationsInput
       *               .builder(
       *                  sessionId,
       *                  [Recommendations.PAYMENT_RECOMMENDATIONS]
       *               )
       *               .build();
       *
       *    gateway.customerSession().getCustomerRecommendations(input)
       *      .then(function (result) {
       *         if (result.success) {
       *           var payload = result.target;
       *           console.log("Payment options", payload.recommendations.paymentOptions);
       *         }
       *      });
       *
       *
       * </code>
       * </pre>
       * @param {CustomerRecommendationsInput} input The input parameters for retrieving customer recommendations.
       *
       * @return {object} A result object containing the customer recommendations if successful, or errors otherwise.
       *
       * @throws {InvalidKeysError} If invalid input object is provided.
       * @throws {UnexpectedError} If an unexpected error occurs.
       */
      getCustomerRecommendations(input) {
        if (!(input instanceof CustomerRecommendationsInput)) {
          return Promise.reject(
            // eslint-disable-next-line new-cap
            exceptions.InvalidKeysError(
              "Invalid input type. Use CustomerRecommendationsInput to build the input object."
            )
          );
        }
        const variables = { input: input.toGraphQLVariables() };
        try {
          return this._graphQLClient.query(
            `query CustomerRecommendations($input: CustomerRecommendationsInput!) {
          customerRecommendations(input: $input) {
            isInPayPalNetwork
            recommendations {
              ... on PaymentRecommendations {
                paymentOptions {
                  paymentOption
                  recommendedPriority
                }
              }
            }
          }
        }`,
            variables
          ).then((response) => {
            const validationErrorCollection = GraphQLClient.getValidationErrors(response);
            if (validationErrorCollection) {
              return Promise.resolve({
                success: false,
                errors: validationErrorCollection
              });
            }
            return Promise.resolve({
              success: true,
              target: this._extractCustomerRecommendationsPayload(response)
            });
          });
        } catch (error) {
          throw exceptions.UnexpectedError(error.message);
        }
      }
      _executeMutation(query, input, operationName) {
        const variables = { input: input.toGraphQLVariables() };
        try {
          return this._graphQLClient.query(query, variables).then((response) => {
            const validationErrorCollection = GraphQLClient.getValidationErrors(response);
            if (validationErrorCollection) {
              return Promise.resolve({
                success: false,
                errors: validationErrorCollection
              });
            }
            const sessionId = this._getValue(
              response,
              `data.${operationName}.sessionId`
            );
            return Promise.resolve({ success: true, target: sessionId });
          });
        } catch (error) {
          throw exceptions.UnexpectedError(error.message);
        }
      }
      _extractCustomerRecommendationsPayload(response) {
        const isInPayPalNetwork = this._getValue(
          response,
          "data.customerRecommendations.isInPayPalNetwork"
        );
        const recommendationsMap = this._getValue(
          response,
          "data.customerRecommendations.recommendations"
        );
        const recommendations = new CustomerRecommendations(
          this._getPaymentOptions(recommendationsMap)
        );
        return new CustomerRecommendationsPayload(
          isInPayPalNetwork,
          recommendations
        );
      }
      _getPaymentOptions(recommendationObj) {
        if (!recommendationObj) {
          return [];
        }
        const paymentOptionObjs = this._getValue(
          recommendationObj,
          "paymentOptions"
        );
        return paymentOptionObjs.map((paymentOptionObj) => {
          const recommendedPriority = this._getValue(
            paymentOptionObj,
            "recommendedPriority"
          );
          const paymentOptionString = this._getValue(
            paymentOptionObj,
            "paymentOption"
          );
          const paymentOption = RecommendedPaymentOption[paymentOptionString];
          return new PaymentOptions(paymentOption, recommendedPriority);
        });
      }
      _getValue(nestedMap, path2) {
        var map = nestedMap;
        const keys = path2.split(".");
        for (const key of keys.slice(0, keys.length - 1)) {
          map = this._popValue(map, key);
        }
        const lastKey = keys[keys.length - 1];
        return this._popValue(map, lastKey);
      }
      _popValue(map, key) {
        if (!(key in map)) {
          throw exceptions.UnexpectedError("Couldn't parse response" + key);
        }
        return map[key];
      }
    };
    module2.exports = {
      CustomerSessionGateway: wrapPrototype(CustomerSessionGateway)
    };
  }
});

// node_modules/braintree/lib/braintree/disbursement_gateway.js
var require_disbursement_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/disbursement_gateway.js"(exports2, module2) {
    "use strict";
    var Gateway = require_gateway().Gateway;
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var DisbursementGateway = class extends Gateway {
      constructor(gateway2) {
        super();
        this.gateway = gateway2;
        this.config = this.gateway.config;
      }
      transactions(disbursement) {
        let transactionIds = disbursement.transactionIds;
        return new Promise((resolve, reject) => {
          this.gateway.transaction.search(
            (search) => {
              search.ids().in(transactionIds);
            },
            (err, response) => {
              if (err) {
                reject(err);
              } else {
                resolve(response);
              }
            }
          );
        });
      }
    };
    module2.exports = { DisbursementGateway: wrapPrototype(DisbursementGateway) };
  }
});

// node_modules/braintree/lib/braintree/discount.js
var require_discount = __commonJS({
  "node_modules/braintree/lib/braintree/discount.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var Discount = class extends AttributeSetter {
    };
    module2.exports = { Discount };
  }
});

// node_modules/braintree/lib/braintree/discount_gateway.js
var require_discount_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/discount_gateway.js"(exports2, module2) {
    "use strict";
    var Discount = require_discount().Discount;
    var Gateway = require_gateway().Gateway;
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var DiscountGateway = class extends Gateway {
      constructor(gateway2) {
        super();
        this.gateway = gateway2;
        this.config = this.gateway.config;
      }
      all() {
        return this.gateway.http.get(`${this.config.baseMerchantPath()}/discounts`).then(this.createResponseHandler("discount", Discount)).then((response) => {
          if (!response.success) {
            return response;
          }
          const collection = response.discounts;
          collection.success = response.success;
          collection.discounts = response.discounts;
          return collection;
        });
      }
    };
    module2.exports = { DiscountGateway: wrapPrototype(DiscountGateway) };
  }
});

// node_modules/braintree/lib/braintree/dispute_search.js
var require_dispute_search = __commonJS({
  "node_modules/braintree/lib/braintree/dispute_search.js"(exports2, module2) {
    "use strict";
    var AdvancedSearch = require_advanced_search().AdvancedSearch;
    var DisputeSearch = class extends AdvancedSearch {
      static initClass() {
        this.textFields(
          "caseNumber",
          "customerId",
          "id",
          "referenceNumber",
          "transactionId"
        );
        this.multipleValueField("chargebackProtectionLevel");
        this.multipleValueField("protectionLevel");
        this.multipleValueField("kind");
        this.multipleValueField("merchantAccountId");
        this.multipleValueField("preDisputeProgram");
        this.multipleValueField("reason");
        this.multipleValueField("reasonCode");
        this.multipleValueField("status");
        this.multipleValueField("transactionSource");
        this.rangeFields(
          "amountDisputed",
          "amountWon",
          "disbursementDate",
          "effectiveDate",
          "receivedDate",
          "replyByDate"
        );
      }
    };
    DisputeSearch.initClass();
    module2.exports = { DisputeSearch };
  }
});

// node_modules/braintree/lib/braintree/paginated_response_stream.js
var require_paginated_response_stream = __commonJS({
  "node_modules/braintree/lib/braintree/paginated_response_stream.js"(exports2, module2) {
    "use strict";
    var { Readable } = require("stream");
    var PaginatedResponseStream = class extends Readable {
      constructor(paginatedResponse, options) {
        super({ objectMode: true });
        options = options || {};
        this.paginatedResponse = paginatedResponse;
        this.pageSize = 0;
        this.currentPage = 0;
        this.index = 0;
        this.totalItems = 0;
        this.items = [];
        this.search = options.search;
      }
      nextItem() {
        if (this.currentPage === 0 || this.index % this.pageSize === 0 && this.index < this.totalItems) {
          let callback = (err, totalItems, pageSize, items) => {
            if (err) {
              this.emit("error", err);
              return;
            }
            this.totalItems = totalItems;
            this.pageSize = pageSize;
            this.items = items;
            this.index++;
            this.push(this.items.shift());
          };
          this.currentPage++;
          if (this.search) {
            this.paginatedResponse.pagingFunction(
              this.currentPage,
              this.search,
              callback
            );
          } else {
            this.paginatedResponse.pagingFunction(this.currentPage, callback);
          }
        } else if (this.index >= this.totalItems) {
          this.push(null);
        } else {
          this.index++;
          this.push(this.items.shift());
        }
      }
      ready() {
        this.readyToStart = true;
        this.emit("ready");
      }
      _read() {
        if (this.readyToStart) {
          this.nextItem();
        } else {
          this.on("ready", () => this.nextItem());
        }
      }
    };
    module2.exports = { PaginatedResponseStream };
  }
});

// node_modules/braintree/lib/braintree/paginated_response.js
var require_paginated_response = __commonJS({
  "node_modules/braintree/lib/braintree/paginated_response.js"(exports2, module2) {
    "use strict";
    var PaginatedResponseStream = require_paginated_response_stream().PaginatedResponseStream;
    var PaginatedResponse = class {
      constructor(pagingFunction, options) {
        this.pagingFunction = pagingFunction;
        this.stream = new PaginatedResponseStream(this, options);
      }
      all(callback) {
        var results = [];
        this.stream.on("data", function(data) {
          return results.push(data);
        });
        this.stream.on("end", function() {
          return callback(null, results);
        });
        this.stream.on("error", function(err) {
          return callback(err);
        });
        return this.stream.ready();
      }
      ready() {
        return this.stream.ready();
      }
    };
    module2.exports = { PaginatedResponse };
  }
});

// node_modules/braintree/lib/braintree/dispute_gateway.js
var require_dispute_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/dispute_gateway.js"(exports2, module2) {
    "use strict";
    var Gateway = require_gateway().Gateway;
    var Dispute = require_dispute().Dispute;
    var DisputeSearch = require_dispute_search().DisputeSearch;
    var InvalidKeysError = require_exceptions().InvalidKeysError;
    var NotFoundError = require_exceptions().NotFoundError;
    var PaginatedResponse = require_paginated_response().PaginatedResponse;
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var DisputeGateway = class extends Gateway {
      constructor(gateway2) {
        super();
        this.gateway = gateway2;
        this.config = this.gateway.config;
      }
      accept(id) {
        let notFoundError = new NotFoundError(
          "dispute with id '" + id + "' not found"
        );
        if (id == null || id.trim() === "") {
          return Promise.reject(notFoundError);
        }
        return this.gateway.http.put(`${this.config.baseMerchantPath()}/disputes/${id}/accept`).then(this.createResponseHandler("dispute", Dispute)).catch(this.createRejectionHandler(notFoundError));
      }
      addTextEvidence(id, contentOrRequest) {
        const isRequest = contentOrRequest != null && typeof contentOrRequest === "object";
        const request = isRequest ? contentOrRequest : { content: contentOrRequest };
        let notFoundError = new NotFoundError(
          "dispute with id '" + id + "' not found"
        );
        if (id == null || id.trim() === "") {
          return Promise.reject(notFoundError);
        }
        if (request.content == null || request.content.trim() === "") {
          return Promise.reject(
            new InvalidKeysError("content cannot be null or empty")
          );
        }
        const evidence = {
          comments: request.content
        };
        if (request.sequenceNumber != null) {
          if (String(request.sequenceNumber) !== String(parseInt(request.sequenceNumber, 10))) {
            return Promise.reject(
              new InvalidKeysError("sequenceNumber must be a number")
            );
          }
          evidence.sequence_number = parseInt(request.sequenceNumber, 10);
        }
        if (request.category != null) {
          if (typeof request.category !== "string") {
            return Promise.reject(
              new InvalidKeysError("category must be a string")
            );
          } else if (request.category.trim() === "") {
            return Promise.reject(new InvalidKeysError("category cannot be empty"));
          }
          evidence.category = request.category;
        }
        return this.gateway.http.post(`${this.config.baseMerchantPath()}/disputes/${id}/evidence`, {
          evidence
        }).then(this.createResponseHandler()).catch(this.createRejectionHandler(notFoundError));
      }
      addFileEvidence(disputeId, documentIdOrRequest) {
        const isRequest = documentIdOrRequest != null && typeof documentIdOrRequest === "object";
        const request = isRequest ? documentIdOrRequest : { documentId: documentIdOrRequest };
        let notFoundError = new NotFoundError(
          "dispute with id '" + disputeId + "' not found"
        );
        if (disputeId == null || disputeId.trim() === "") {
          return Promise.reject(notFoundError);
        }
        if (request.documentId == null || request.documentId.trim() === "") {
          return Promise.reject(
            new NotFoundError(
              "document with id '" + request.documentId + "' not found"
            )
          );
        }
        const evidence = {
          document_upload_id: request.documentId,
          // eslint-disable-line camelcase
          category: request.category
        };
        return this.gateway.http.post(
          `${this.config.baseMerchantPath()}/disputes/${disputeId}/evidence`,
          {
            evidence
          }
        ).then(this.createResponseHandler()).catch(this.createRejectionHandler(notFoundError));
      }
      finalize(id) {
        let notFoundError = new NotFoundError(`dispute with id '${id}' not found`);
        if (id == null || id.trim() === "") {
          return Promise.reject(notFoundError);
        }
        return this.gateway.http.put(`${this.config.baseMerchantPath()}/disputes/${id}/finalize`).then(this.createResponseHandler()).catch(this.createRejectionHandler(notFoundError));
      }
      find(id) {
        let notFoundError = new NotFoundError(`dispute with id '${id}' not found`);
        if (id == null || id.trim() === "") {
          return Promise.reject(notFoundError);
        }
        return this.gateway.http.get(`${this.config.baseMerchantPath()}/disputes/${id}`).then(this.createResponseHandler("dispute", Dispute)).catch(this.createRejectionHandler(notFoundError));
      }
      removeEvidence(disputeId, evidenceId) {
        let notFoundError = new NotFoundError(
          "evidence with id '" + evidenceId + "' for dispute with id '" + disputeId + "' not found"
        );
        if (disputeId == null || disputeId.trim() === "" || evidenceId == null || evidenceId.trim() === "") {
          return Promise.reject(notFoundError);
        }
        return this.gateway.http.delete(
          `${this.config.baseMerchantPath()}/disputes/${disputeId}/evidence/${evidenceId}`
        ).then(this.createResponseHandler()).catch(this.createRejectionHandler(notFoundError));
      }
      search(searchFunction, callback) {
        let search = new DisputeSearch();
        searchFunction(search);
        let response = new PaginatedResponse(this.fetchDisputes.bind(this), {
          search: search.toHash()
        });
        if (callback != null) {
          return response.all(callback);
        }
        response.ready();
        return response.stream;
      }
      fetchDisputes(pageNumber, search, callback) {
        return this.gateway.http.post(
          `${this.config.baseMerchantPath()}/disputes/advanced_search?page=${pageNumber}`,
          { search },
          (err, response) => {
            if (err) {
              return callback(err);
            }
            let totalItems = response.disputes.totalItems;
            let pageSize = response.disputes.pageSize;
            let disputes = response.disputes.dispute;
            if (!disputes) {
              disputes = [null];
            } else if (!Array.isArray(disputes)) {
              disputes = [disputes];
            }
            return callback(null, totalItems, pageSize, disputes);
          }
        );
      }
      createRejectionHandler(notFoundError) {
        return function(err) {
          if (err.type === "notFoundError") {
            err = notFoundError;
          }
          return Promise.reject(err);
        };
      }
    };
    module2.exports = {
      DisputeGateway: wrapPrototype(DisputeGateway, {
        ignoreMethods: ["search", "fetchDisputes"]
      })
    };
  }
});

// node_modules/braintree/lib/braintree/document_upload.js
var require_document_upload = __commonJS({
  "node_modules/braintree/lib/braintree/document_upload.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var DocumentUpload = class extends AttributeSetter {
      static initClass() {
        this.Kind = {
          EvidenceDocument: "evidence_document"
        };
      }
    };
    DocumentUpload.initClass();
    module2.exports = { DocumentUpload };
  }
});

// node_modules/braintree/lib/braintree/document_upload_gateway.js
var require_document_upload_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/document_upload_gateway.js"(exports2, module2) {
    "use strict";
    var DocumentUpload = require_document_upload().DocumentUpload;
    var Gateway = require_gateway().Gateway;
    var InvalidKeysError = require_exceptions().InvalidKeysError;
    var Readable = require("stream").Readable;
    var Util = require_util().Util;
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var DocumentUploadGateway = class extends Gateway {
      constructor(gateway2) {
        super();
        this.gateway = gateway2;
        this.config = this.gateway.config;
      }
      create(options) {
        if (!options.file || !(options.file instanceof Readable)) {
          return Promise.reject(
            new InvalidKeysError("file must be a Readable stream")
          );
        }
        let params = {
          file: {
            path: options.file.path
          },
          kind: options.kind
        };
        let invalidKeysError = Util.verifyKeys(this._createSignature(), params);
        if (invalidKeysError) {
          return Promise.reject(invalidKeysError);
        }
        return this.gateway.http.postMultipart(
          `${this.config.baseMerchantPath()}/document_uploads`,
          {
            "document_upload[kind]": params.kind
          },
          params.file
        ).then(this.createResponseHandler("documentUpload", DocumentUpload));
      }
      _createSignature() {
        return {
          valid: ["kind", "file[path]"]
        };
      }
    };
    module2.exports = {
      DocumentUploadGateway: wrapPrototype(DocumentUploadGateway)
    };
  }
});

// node_modules/braintree/lib/braintree/monetary_amount.js
var require_monetary_amount = __commonJS({
  "node_modules/braintree/lib/braintree/monetary_amount.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var MonetaryAmount = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
      }
    };
    module2.exports = { MonetaryAmount };
  }
});

// node_modules/braintree/lib/braintree/exchange_rate_quote.js
var require_exchange_rate_quote = __commonJS({
  "node_modules/braintree/lib/braintree/exchange_rate_quote.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var MonetaryAmount = require_monetary_amount().MonetaryAmount;
    var ExchangeRateQuote = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
        if (attributes.baseAmount) {
          this.baseAmount = new MonetaryAmount(attributes.baseAmount);
        }
        if (attributes.quoteAmount) {
          this.quoteAmount = new MonetaryAmount(attributes.quoteAmount);
        }
      }
    };
    module2.exports = { ExchangeRateQuote };
  }
});

// node_modules/braintree/lib/braintree/exchange_rate_quote_payload.js
var require_exchange_rate_quote_payload = __commonJS({
  "node_modules/braintree/lib/braintree/exchange_rate_quote_payload.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var ExchangeRateQuote = require_exchange_rate_quote().ExchangeRateQuote;
    var ExchangeRateQuotePayload = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
        if (attributes.quotes) {
          this.quotes = attributes.quotes.map(
            (quote) => new ExchangeRateQuote(quote)
          );
        }
      }
    };
    module2.exports = { ExchangeRateQuotePayload };
  }
});

// node_modules/braintree/lib/braintree/exchange_rate_quote_gateway.js
var require_exchange_rate_quote_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/exchange_rate_quote_gateway.js"(exports2, module2) {
    "use strict";
    var Gateway = require_gateway().Gateway;
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var GraphQLClient = require_graphql_client().GraphQLClient;
    var Util = require_util().Util;
    var ExchangeRateQuotePayload = require_exchange_rate_quote_payload().ExchangeRateQuotePayload;
    var ExchangeRateQuoteGateway = class extends Gateway {
      constructor(gateway2) {
        super();
        this.gateway = gateway2;
        this.config = this.gateway.config;
      }
      generate(attributes) {
        let invalidKeysError = Util.verifyKeys(
          this._generateSignature(),
          attributes
        );
        if (invalidKeysError) {
          return Promise.reject(invalidKeysError, null);
        }
        const exchangeRateQuoteMutation = `mutation ($exchangeRateQuoteRequest: GenerateExchangeRateQuoteInput!) {
        generateExchangeRateQuote(input: $exchangeRateQuoteRequest) {
          quotes {
            id
            baseAmount {value, currencyCode}
            quoteAmount {value, currencyCode}
            exchangeRate
            tradeRate
            expiresAt
            refreshesAt
          }
        }
      }`;
        let graphQLClient = new GraphQLClient(this.config);
        let exchangeRateQuoteRequest = { exchangeRateQuoteRequest: attributes };
        return graphQLClient.query(exchangeRateQuoteMutation, exchangeRateQuoteRequest).then((response) => {
          if (response && !response.errors) {
            response.success = true;
            response.exchangeRateQuotePayload = new ExchangeRateQuotePayload(
              response.data.generateExchangeRateQuote
            );
          }
          return response;
        });
      }
      _generateSignature() {
        let validKeys = [
          "quotes[baseCurrency]",
          "quotes[quoteCurrency]",
          "quotes[baseAmount]",
          "quotes[markup]"
        ];
        return {
          valid: validKeys
        };
      }
    };
    module2.exports = {
      ExchangeRateQuoteGateway: wrapPrototype(ExchangeRateQuoteGateway)
    };
  }
});

// node_modules/braintree/lib/braintree/merchant_account.js
var require_merchant_account = __commonJS({
  "node_modules/braintree/lib/braintree/merchant_account.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var MerchantAccount = class _MerchantAccount extends AttributeSetter {
      static initClass() {
        this.Status = {
          Pending: "pending",
          Active: "active",
          Suspended: "suspended"
        };
        this.FundingDestination = {
          Bank: "bank",
          Email: "email",
          MobilePhone: "mobile_phone"
        };
      }
      constructor(attributes) {
        super(attributes);
        if (attributes.masterMerchantAccount) {
          this.masterMerchantAccount = new _MerchantAccount(
            attributes.masterMerchantAccount
          );
        }
      }
    };
    MerchantAccount.initClass();
    module2.exports = { MerchantAccount };
  }
});

// node_modules/braintree/lib/braintree/merchant_account_gateway.js
var require_merchant_account_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/merchant_account_gateway.js"(exports2, module2) {
    "use strict";
    var Gateway = require_gateway().Gateway;
    var MerchantAccount = require_merchant_account().MerchantAccount;
    var PaginatedResponse = require_paginated_response().PaginatedResponse;
    var exceptions = require_exceptions();
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var MerchantAccountGateway = class extends Gateway {
      constructor(gateway2) {
        super();
        this.gateway = gateway2;
        this.config = this.gateway.config;
      }
      create(attributes) {
        return this.gateway.http.post(
          `${this.config.baseMerchantPath()}/merchant_accounts/create_via_api`,
          { merchantAccount: attributes }
        ).then(this.responseHandler());
      }
      update(id, attributes) {
        return this.gateway.http.put(
          `${this.config.baseMerchantPath()}/merchant_accounts/${id}/update_via_api`,
          { merchantAccount: attributes }
        ).then(this.responseHandler());
      }
      find(id) {
        if (id.trim() === "") {
          return Promise.reject(exceptions.NotFoundError("Not Found"), null);
        }
        return this.gateway.http.get(`${this.config.baseMerchantPath()}/merchant_accounts/${id}`).then(function(response) {
          return new MerchantAccount(response.merchantAccount);
        });
      }
      responseHandler() {
        return this.createResponseHandler("merchantAccount", MerchantAccount);
      }
      all(callback) {
        let response = new PaginatedResponse(this.fetchMerchantAccounts.bind(this));
        if (callback != null) {
          return response.all(callback);
        }
        response.ready();
        return response.stream;
      }
      fetchMerchantAccounts(pageNumber, callback) {
        return this.gateway.http.get(
          this.config.baseMerchantPath() + "/merchant_accounts?page=" + pageNumber,
          (err, response) => {
            let body, merchantAccounts, pageSize, ref, totalItems;
            if (err) {
              return callback(err);
            }
            body = response.merchantAccounts;
            ref = response.merchantAccounts;
            totalItems = ref.totalItems;
            pageSize = ref.pageSize;
            merchantAccounts = body.merchantAccount;
            if (!Array.isArray(merchantAccounts)) {
              merchantAccounts = [merchantAccounts];
            }
            return callback(null, totalItems, pageSize, merchantAccounts);
          }
        );
      }
      createForCurrency(attributes) {
        return this.gateway.http.post(
          this.config.baseMerchantPath() + "/merchant_accounts/create_for_currency",
          {
            merchantAccount: attributes
          }
        ).then(this.createForCurrencyResponseHandler());
      }
      createForCurrencyResponseHandler() {
        let handler = this.createResponseHandler(null, null);
        return function(payload) {
          return handler(payload).then((response) => {
            if (response.success) {
              response.merchantAccount = new MerchantAccount(
                response.response.merchantAccount
              );
              delete response.response;
            }
            return response;
          });
        };
      }
    };
    module2.exports = {
      MerchantAccountGateway: wrapPrototype(MerchantAccountGateway, {
        ignoreMethods: ["all", "fetchMerchantAccounts"]
      })
    };
  }
});

// node_modules/braintree/lib/braintree/merchant.js
var require_merchant = __commonJS({
  "node_modules/braintree/lib/braintree/merchant.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var MerchantAccount = require_merchant_account().MerchantAccount;
    var Merchant = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
        if (attributes.merchantAccounts) {
          this.merchantAccounts = attributes.merchantAccounts.map(
            (merchantAccountAttributes) => new MerchantAccount(merchantAccountAttributes)
          );
        }
      }
    };
    module2.exports = { Merchant };
  }
});

// node_modules/braintree/lib/braintree/oauth_credentials.js
var require_oauth_credentials = __commonJS({
  "node_modules/braintree/lib/braintree/oauth_credentials.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var OAuthCredentials = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
      }
    };
    module2.exports = { OAuthCredentials };
  }
});

// node_modules/braintree/lib/braintree/merchant_gateway.js
var require_merchant_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/merchant_gateway.js"(exports2, module2) {
    "use strict";
    var Gateway = require_gateway().Gateway;
    var Merchant = require_merchant().Merchant;
    var OAuthCredentials = require_oauth_credentials().OAuthCredentials;
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var MerchantGateway = class extends Gateway {
      constructor(gateway2) {
        super();
        this.gateway = gateway2;
        this.config = this.gateway.config;
      }
      create(attributes) {
        return this.gateway.http.post("/merchants/create_via_api", { merchant: attributes }).then(this.responseHandler());
      }
      responseHandler() {
        let handler = this.createResponseHandler(null, null);
        return function(payload) {
          return handler(payload).then((response) => {
            if (response.success) {
              response.merchant = new Merchant(response.response.merchant);
              response.credentials = new OAuthCredentials(
                response.response.credentials
              );
              delete response.response;
            }
            return response;
          });
        };
      }
    };
    module2.exports = { MerchantGateway: wrapPrototype(MerchantGateway) };
  }
});

// node_modules/braintree/lib/braintree/oauth_gateway.js
var require_oauth_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/oauth_gateway.js"(exports2, module2) {
    "use strict";
    var Gateway = require_gateway().Gateway;
    var OAuthCredentials = require_oauth_credentials().OAuthCredentials;
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var Util = require_util().Util;
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var OAuthGateway = class extends Gateway {
      constructor(gateway2) {
        super();
        this.gateway = gateway2;
        this.config = this.gateway.config;
      }
      createTokenFromCode(attributes) {
        attributes.grantType = "authorization_code";
        return this.gateway.http.post("/oauth/access_tokens", attributes).then(this.responseHandler());
      }
      createTokenFromRefreshToken(attributes) {
        attributes.grantType = "refresh_token";
        return this.gateway.http.post("/oauth/access_tokens", attributes).then(this.responseHandler());
      }
      revokeAccessToken(accessToken) {
        return this.gateway.http.post("/oauth/revoke_access_token", { token: accessToken }).then(this.createResponseHandler("result", AttributeSetter));
      }
      responseHandler() {
        return this.createResponseHandler("credentials", OAuthCredentials);
      }
      connectUrl(rawParams) {
        const params = Object.assign({ clientId: this.config.clientId }, rawParams);
        return this.config.baseUrl() + "/oauth/connect?" + this.buildQuery(params);
      }
      buildQuery(params) {
        params = Util.convertObjectKeysToUnderscores(params);
        let paramsArray = this.buildSubQuery("user", params.user);
        paramsArray.push.apply(
          paramsArray,
          this.buildSubQuery("business", params.business)
        );
        paramsArray.push.apply(
          paramsArray,
          this.buildSubArrayQuery("payment_methods", params.payment_methods)
        );
        delete params.user;
        delete params.business;
        delete params.payment_methods;
        paramsArray.push.apply(
          paramsArray,
          (() => {
            let result = [];
            for (let key in params) {
              if (!params.hasOwnProperty(key)) {
                continue;
              }
              let val = params[key];
              result.push([key, val]);
            }
            return result;
          })()
        );
        let queryStringParts = paramsArray.map((paramParts) => {
          let key = paramParts[0];
          let value = paramParts[1];
          return `${this._encodeValue(key)}=${this._encodeValue(value)}`;
        });
        return queryStringParts.join("&");
      }
      buildSubQuery(key, subParams) {
        let arr = [];
        for (let subKey in subParams) {
          if (!subParams.hasOwnProperty(subKey)) {
            continue;
          }
          let value = subParams[subKey];
          arr.push([`${key}[${subKey}]`, value]);
        }
        return arr;
      }
      _encodeValue(value) {
        return encodeURIComponent(value).replace(/[!'()]/g, escape).replace(/\*/g, "%2A");
      }
      buildSubArrayQuery(key, values) {
        return (values || []).map((value) => [`${key}[]`, value]);
      }
    };
    module2.exports = { OAuthGateway: wrapPrototype(OAuthGateway) };
  }
});

// node_modules/braintree/lib/braintree/unknown_payment_method.js
var require_unknown_payment_method = __commonJS({
  "node_modules/braintree/lib/braintree/unknown_payment_method.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var UnknownPaymentMethod = class extends AttributeSetter {
      constructor(attributes) {
        let name = (() => {
          let result = [];
          for (let keys of Object.keys(attributes)) {
            result.push(keys);
          }
          return result;
        })()[0];
        if (typeof attributes[name] === "object") {
          attributes[name].imageUrl = "https://assets.braintreegateway.com/payment_method_logo/unknown.png";
        }
        super(attributes[name]);
      }
    };
    module2.exports = { UnknownPaymentMethod };
  }
});

// node_modules/braintree/lib/braintree/sepa_direct_debit_nonce_details.js
var require_sepa_direct_debit_nonce_details = __commonJS({
  "node_modules/braintree/lib/braintree/sepa_direct_debit_nonce_details.js"(exports2, module2) {
    "use strict";
    var SepaDirectDebitNonceDetails = class {
      constructor(attributes) {
        const sepaDirectDebitKeys = [
          "bankReferenceToken",
          "correlationId",
          "ibanLastChars",
          "mandateType",
          "merchantOrPartnerCustomerId"
        ];
        for (let key in attributes) {
          if (!sepaDirectDebitKeys.includes(key)) {
            continue;
          }
          this[key] = attributes[key];
        }
      }
    };
    module2.exports = { SepaDirectDebitNonceDetails };
  }
});

// node_modules/braintree/lib/braintree/payment_method_nonce.js
var require_payment_method_nonce = __commonJS({
  "node_modules/braintree/lib/braintree/payment_method_nonce.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var ThreeDSecureInfo = require_three_d_secure_info().ThreeDSecureInfo;
    var SepaDirectDebitNonceDetails = require_sepa_direct_debit_nonce_details().SepaDirectDebitNonceDetails;
    var PaymentMethodNonce = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
        if (attributes.threeDSecureInfo) {
          this.threeDSecureInfo = new ThreeDSecureInfo(attributes.threeDSecureInfo);
        } else if (attributes.bankReferenceToken && attributes.ibanLastChars) {
          this.sepaDirectDebitNonceDetails = new SepaDirectDebitNonceDetails(
            attributes
          );
        }
      }
    };
    module2.exports = { PaymentMethodNonce };
  }
});

// node_modules/braintree/lib/braintree/payment_method_parser.js
var require_payment_method_parser = __commonJS({
  "node_modules/braintree/lib/braintree/payment_method_parser.js"(exports2, module2) {
    "use strict";
    var ApplePayCard = require_apple_pay_card().ApplePayCard;
    var AndroidPayCard = require_android_pay_card().AndroidPayCard;
    var CreditCard = require_credit_card().CreditCard;
    var PayPalAccount = require_paypal_account().PayPalAccount;
    var UnknownPaymentMethod = require_unknown_payment_method().UnknownPaymentMethod;
    var PaymentMethodNonce = require_payment_method_nonce().PaymentMethodNonce;
    var UsBankAccount = require_us_bank_account().UsBankAccount;
    var VenmoAccount = require_venmo_account().VenmoAccount;
    var VisaCheckoutCard = require_visa_checkout_card().VisaCheckoutCard;
    var SamsungPayCard = require_samsung_pay_card().SamsungPayCard;
    var SepaDirectDebitAccount = require_sepa_direct_debit_account().SepaDirectDebitAccount;
    var PaymentMethodParser = class {
      static parsePaymentMethod(response) {
        if (response.creditCard) {
          return new CreditCard(response.creditCard);
        } else if (response.paypalAccount) {
          return new PayPalAccount(response.paypalAccount);
        } else if (response.applePayCard) {
          return new ApplePayCard(response.applePayCard);
        } else if (response.androidPayCard) {
          return new AndroidPayCard(response.androidPayCard);
        } else if (response.paymentMethodNonce) {
          return new PaymentMethodNonce(response.paymentMethodNonce);
        } else if (response.usBankAccount) {
          return new UsBankAccount(response.usBankAccount);
        } else if (response.venmoAccount) {
          return new VenmoAccount(response.venmoAccount);
        } else if (response.visaCheckoutCard) {
          return new VisaCheckoutCard(response.visaCheckoutCard);
        } else if (response.samsungPayCard) {
          console.warn(
            "[DEPRECATED] `SamsungPayCard` is deprecated and no longer a supported payment method type"
          );
          return new SamsungPayCard(response.samsungPayCard);
        } else if (response.sepaDebitAccount) {
          return new SepaDirectDebitAccount(response.sepaDebitAccount);
        }
        return new UnknownPaymentMethod(response);
      }
    };
    module2.exports = { PaymentMethodParser };
  }
});

// node_modules/braintree/vendor/querystring.node.js.511d6a2/util.js
var require_util2 = __commonJS({
  "node_modules/braintree/vendor/querystring.node.js.511d6a2/util.js"(exports2) {
    exports2.is = is;
    exports2.isNull = isNull;
    exports2.isUndefined = isUndefined;
    exports2.isString = isString;
    exports2.isNumber = isNumber;
    exports2.isBoolean = isBoolean;
    exports2.isArray = isArray;
    exports2.isObject = isObject;
    function is(type, obj) {
      return Object.prototype.toString.call(obj) === "[object " + type + "]";
    }
    function isArray(obj) {
      return is("Array", obj);
    }
    function isObject(obj) {
      return is("Object", obj);
    }
    function isString(obj) {
      return is("String", obj);
    }
    function isNumber(obj) {
      return is("Number", obj);
    }
    function isBoolean(obj) {
      return is("Boolean", obj);
    }
    function isNull(obj) {
      return typeof obj === "object" && !obj;
    }
    function isUndefined(obj) {
      return typeof obj === "undefined";
    }
  }
});

// node_modules/braintree/vendor/querystring.node.js.511d6a2/querystring-parse.js
var require_querystring_parse = __commonJS({
  "node_modules/braintree/vendor/querystring.node.js.511d6a2/querystring-parse.js"(exports2) {
    var util = require("util");
    var braintree_util = require_util2();
    exports2.parse = querystring_parse;
    function querystring_parse(qs, sep, eq, unesc) {
      return qs.split(sep || "&").map(pieceParser(eq || "=", unesc || unescape)).reduce(mergeParams, {});
    }
    function unescape(s) {
      return decodeURIComponent(s.replace(/\+/g, " "));
    }
    function pieceParser(eq, unesc) {
      return function parsePiece(key, val) {
        if (arguments.length !== 2) {
          key = key.split(eq);
          return parsePiece(
            unesc(key.shift()),
            unesc(key.join(eq))
          );
        }
        key = key.replace(/^\s+|\s+$/g, "");
        if (braintree_util.isString(val)) {
          val = val.replace(/^\s+|\s+$/g, "");
          if (!isNaN(val)) {
            var numVal = +val;
            if (val === numVal.toString(10)) val = numVal;
          }
        }
        var sliced = /(.*)\[([^\]]*)\]$/.exec(key);
        if (!sliced) {
          var ret = {};
          if (key) ret[key] = val;
          return ret;
        }
        var tail = sliced[2], head = sliced[1];
        if (!tail) return parsePiece(head, [val]);
        var ret = {};
        ret[tail] = val;
        return parsePiece(head, ret);
      };
    }
    function mergeParams(params, addition) {
      var ret;
      if (!params) {
        ret = addition;
      } else if (braintree_util.isArray(params)) {
        ret = params.concat(addition);
      } else if (!braintree_util.isObject(params) || !braintree_util.isObject(addition)) {
        ret = [params].concat(addition);
      } else {
        ret = mergeObjects(params, addition);
      }
      return ret;
    }
    function mergeObjects(params, addition) {
      for (var i in addition) if (i && addition.hasOwnProperty(i)) {
        params[i] = mergeParams(params[i], addition[i]);
      }
      return params;
    }
  }
});

// node_modules/braintree/vendor/querystring.node.js.511d6a2/querystring-stringify.js
var require_querystring_stringify = __commonJS({
  "node_modules/braintree/vendor/querystring.node.js.511d6a2/querystring-stringify.js"(exports2) {
    var util = require_util2();
    exports2.stringify = querystring_stringify;
    var stack = [];
    function querystring_stringify(obj, sep, eq, name, escape2) {
      sep = sep || "&";
      eq = eq || "=";
      escape2 = escape2 || encodeURIComponent;
      if (util.isNull(obj) || util.isUndefined(obj) || typeof obj === "function") {
        return name ? escape2(name) + eq : "";
      }
      if (util.isBoolean(obj)) obj = +obj;
      if (util.isNumber(obj) || util.isString(obj)) {
        return escape2(name) + eq + escape2(obj);
      }
      if (util.isArray(obj)) {
        var s = [];
        name = name + "[]";
        for (var i = 0, l = obj.length; i < l; i++) {
          s.push(querystring_stringify(obj[i], sep, eq, name, escape2));
        }
        return s.join(sep);
      }
      for (var i = stack.length - 1; i >= 0; --i) if (stack[i] === obj) {
        throw new Error("querystring_stringify. Cyclical reference");
      }
      stack.push(obj);
      var s = [];
      var begin = name ? name + "[" : "";
      var end = name ? "]" : "";
      for (var i in obj) if (obj.hasOwnProperty(i)) {
        var n = begin + i + end;
        s.push(querystring_stringify(obj[i], sep, eq, n, escape2));
      }
      stack.pop();
      s = s.join(sep);
      if (!s && name) return name + "=";
      return s;
    }
  }
});

// node_modules/braintree/vendor/querystring.node.js.511d6a2/querystring.js
var require_querystring = __commonJS({
  "node_modules/braintree/vendor/querystring.node.js.511d6a2/querystring.js"(exports2) {
    [
      require_querystring_parse(),
      require_querystring_stringify()
    ].forEach(function(q) {
      for (var i in q) if (q.hasOwnProperty(i)) exports2[i] = q[i];
    });
  }
});

// node_modules/braintree/lib/braintree/payment_method_gateway.js
var require_payment_method_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/payment_method_gateway.js"(exports2, module2) {
    "use strict";
    var Gateway = require_gateway().Gateway;
    var ApplePayCard = require_apple_pay_card().ApplePayCard;
    var AndroidPayCard = require_android_pay_card().AndroidPayCard;
    var CreditCard = require_credit_card().CreditCard;
    var PaymentMethodParser = require_payment_method_parser().PaymentMethodParser;
    var PayPalAccount = require_paypal_account().PayPalAccount;
    var PaymentMethodNonce = require_payment_method_nonce().PaymentMethodNonce;
    var SepaDirectDebitAccount = require_sepa_direct_debit_account().SepaDirectDebitAccount;
    var Util = require_util().Util;
    var exceptions = require_exceptions();
    var querystring2 = require_querystring();
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var PaymentMethodGateway = class extends Gateway {
      constructor(gateway2) {
        super();
        this.gateway = gateway2;
        this.config = this.gateway.config;
      }
      responseHandler() {
        let responseMapping = {
          paypalAccount: PayPalAccount,
          sepaDirectDebitAccount: SepaDirectDebitAccount,
          creditCard: CreditCard,
          applePayCard: ApplePayCard,
          // NEXT_MAJOR_VERSION rename Android Pay to Google Pay
          androidPayCard: AndroidPayCard,
          paymentMethodNonce: PaymentMethodNonce
        };
        let handler = this.createResponseHandler(responseMapping, null);
        return function(payload) {
          return handler(payload).then(function(response) {
            let parsedResponse = PaymentMethodParser.parsePaymentMethod(response);
            if (parsedResponse instanceof PaymentMethodNonce) {
              response.paymentMethodNonce = parsedResponse;
            } else {
              response.paymentMethod = parsedResponse;
            }
            return response;
          });
        };
      }
      create(attributes) {
        this._checkForDeprecatedAttributes(attributes);
        return this.gateway.http.post(`${this.config.baseMerchantPath()}/payment_methods`, {
          paymentMethod: attributes
        }).then(this.responseHandler());
      }
      find(token) {
        if (token.trim() === "") {
          return Promise.reject(exceptions.NotFoundError("Not Found"), null);
        }
        return this.gateway.http.get(`${this.config.baseMerchantPath()}/payment_methods/any/${token}`).then((response) => {
          return PaymentMethodParser.parsePaymentMethod(response);
        });
      }
      update(token, attributes) {
        if (token.trim() === "") {
          return Promise.reject(exceptions.NotFoundError("Not Found"), null);
        }
        this._checkForDeprecatedAttributes(attributes);
        return this.gateway.http.put(`${this.config.baseMerchantPath()}/payment_methods/any/${token}`, {
          paymentMethod: attributes
        }).then(this.responseHandler());
      }
      grant(token, attributes) {
        if (token.trim() === "") {
          return Promise.reject(exceptions.NotFoundError("Not Found"), null);
        }
        let grantOptions = {
          sharedPaymentMethodToken: token
        };
        if (typeof attributes === "boolean") {
          attributes = { allow_vaulting: attributes };
        }
        grantOptions = Util.merge(grantOptions, attributes);
        return this.gateway.http.post(`${this.config.baseMerchantPath()}/payment_methods/grant`, {
          // eslint-disable-next-line camelcase
          payment_method: grantOptions
        }).then(this.responseHandler());
      }
      revoke(token) {
        if (token.trim() === "") {
          return Promise.reject(exceptions.NotFoundError("Not Found"), null);
        }
        return this.gateway.http.post(`${this.config.baseMerchantPath()}/payment_methods/revoke`, {
          // eslint-disable-next-line camelcase
          payment_method: {
            sharedPaymentMethodToken: token
          }
        }).then(this.responseHandler());
      }
      delete(token, options) {
        let queryParam, invalidKeysError;
        if (typeof options === "function") {
          options = null;
        }
        invalidKeysError = Util.verifyKeys(this._deleteSignature(), options);
        if (invalidKeysError) {
          return Promise.reject(invalidKeysError);
        }
        queryParam = options != null ? "?" + querystring2.stringify(Util.convertObjectKeysToUnderscores(options)) : "";
        return this.gateway.http.delete(
          this.config.baseMerchantPath() + "/payment_methods/any/" + token + queryParam
        );
      }
      _deleteSignature() {
        return {
          valid: ["revokeAllGrants"]
        };
      }
      _checkForDeprecatedAttributes(attributes) {
        if (attributes.deviceSessionId != null) {
          console.warn(
            "[DEPRECATED] `deviceSessionId` is a deprecated param for PaymentMethod objects. Use `deviceData` instead"
          );
        }
        if (attributes.fraudMerchantId != null) {
          console.warn(
            "[DEPRECATED] `fraudMerchantId` is a deprecated param for PaymentMethod objects. Use `deviceData` instead"
          );
        }
      }
    };
    module2.exports = { PaymentMethodGateway: wrapPrototype(PaymentMethodGateway) };
  }
});

// node_modules/braintree/lib/braintree/payment_method_nonce_gateway.js
var require_payment_method_nonce_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/payment_method_nonce_gateway.js"(exports2, module2) {
    "use strict";
    var Gateway = require_gateway().Gateway;
    var Util = require_util().Util;
    var PaymentMethodNonce = require_payment_method_nonce().PaymentMethodNonce;
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var PaymentMethodNonceGateway = class extends Gateway {
      constructor(gateway2) {
        super();
        this.gateway = gateway2;
        this.config = this.gateway.config;
      }
      responseHandler() {
        let handler = this.createResponseHandler(
          "payment_method_nonce",
          PaymentMethodNonce
        );
        return function(payload) {
          return handler(payload).then((response) => {
            response.paymentMethodNonce = new PaymentMethodNonce(
              response.paymentMethodNonce
            );
            return response;
          });
        };
      }
      create(paymentMethodToken, params) {
        let schema = {
          valid: [
            "paymentMethodNonce[merchantAccountId]",
            "paymentMethodNonce[authenticationInsight]",
            "paymentMethodNonce[authenticationInsightOptions][amount]",
            "paymentMethodNonce[authenticationInsightOptions][recurringCustomerConsent]",
            "paymentMethodNonce[authenticationInsightOptions][recurringMaxAmount]"
          ]
        };
        let invalidKeysError = Util.verifyKeys(schema, params);
        if (invalidKeysError) {
          return Promise.reject(invalidKeysError);
        }
        return this.gateway.http.post(
          `${this.config.baseMerchantPath()}/payment_methods/${paymentMethodToken}/nonces`,
          params
        ).then(this.responseHandler());
      }
      find(paymentMethodNonce) {
        return this.gateway.http.get(
          `${this.config.baseMerchantPath()}/payment_method_nonces/${paymentMethodNonce}`
        ).then((response) => {
          return new PaymentMethodNonce(response.paymentMethodNonce);
        });
      }
    };
    module2.exports = {
      PaymentMethodNonceGateway: wrapPrototype(PaymentMethodNonceGateway)
    };
  }
});

// node_modules/braintree/lib/braintree/paypal_account_gateway.js
var require_paypal_account_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/paypal_account_gateway.js"(exports2, module2) {
    "use strict";
    var Gateway = require_gateway().Gateway;
    var PayPalAccount = require_paypal_account().PayPalAccount;
    var exceptions = require_exceptions();
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var PayPalAccountGateway = class extends Gateway {
      constructor(gateway2) {
        super();
        this.gateway = gateway2;
        this.config = this.gateway.config;
      }
      find(token) {
        if (token.trim() === "") {
          return Promise.reject(exceptions.NotFoundError("Not Found"), null);
        }
        return this.gateway.http.get(
          `${this.config.baseMerchantPath()}/payment_methods/paypal_account/${token}`
        ).then((response) => {
          return new PayPalAccount(response.paypalAccount);
        });
      }
      update(token, attributes) {
        return this.gateway.http.put(
          `${this.config.baseMerchantPath()}/payment_methods/paypal_account/${token}`,
          { paypalAccount: attributes }
        ).then(this.responseHandler());
      }
      delete(token) {
        let path2 = `${this.config.baseMerchantPath()}/payment_methods/paypal_account/${token}`;
        return this.gateway.http.delete(path2);
      }
      responseHandler() {
        return this.createResponseHandler("paypalAccount", PayPalAccount);
      }
    };
    module2.exports = { PayPalAccountGateway: wrapPrototype(PayPalAccountGateway) };
  }
});

// node_modules/braintree/lib/braintree/paypal_payment_resource_gateway.js
var require_paypal_payment_resource_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/paypal_payment_resource_gateway.js"(exports2, module2) {
    "use strict";
    var Gateway = require_gateway().Gateway;
    var Util = require_util().Util;
    var PaymentMethodNonce = require_payment_method_nonce().PaymentMethodNonce;
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var PayPalPaymentResourceGateway = class extends Gateway {
      constructor(gateway2) {
        super();
        this.gateway = gateway2;
        this.config = this.gateway.config;
      }
      update(attributes) {
        let invalidKeysError = Util.verifyKeys(this._updateSignature(), attributes);
        if (invalidKeysError) {
          return Promise.reject(invalidKeysError);
        }
        return this.gateway.http.put(`${this.config.baseMerchantPath()}/paypal/payment_resource`, {
          paypalPaymentResource: attributes
        }).then(this.responseHandler());
      }
      responseHandler() {
        return this.createResponseHandler(
          "payment_method_nonce",
          PaymentMethodNonce
        );
      }
      _updateSignature() {
        return {
          valid: [
            "amount",
            "amountBreakdown[discount]",
            "amountBreakdown[handling]",
            "amountBreakdown[insurance]",
            "amountBreakdown[itemTotal]",
            "amountBreakdown[shipping]",
            "amountBreakdown[shippingDiscount]",
            "amountBreakdown[taxTotal]",
            "currencyIsoCode",
            "customField",
            "description",
            "lineItems[commodityCode]",
            "lineItems[description]",
            "lineItems[discountAmount]",
            "lineItems[imageUrl]",
            "lineItems[itemType]",
            "lineItems[kind]",
            "lineItems[name]",
            "lineItems[productCode]",
            "lineItems[quantity]",
            "lineItems[taxAmount]",
            "lineItems[totalAmount]",
            "lineItems[unitAmount]",
            "lineItems[unitOfMeasure]",
            "lineItems[unitTaxAmount]",
            "lineItems[upcCode]",
            "lineItems[upcType]",
            "lineItems[url]",
            "orderId",
            "payeeEmail",
            "paymentMethodNonce",
            "shipping[company]",
            "shipping[countryCodeAlpha2]",
            "shipping[countryCodeAlpha3]",
            "shipping[countryCodeNumeric]",
            "shipping[countryName]",
            "shipping[extendedAddress]",
            "shipping[firstName]",
            "shipping[internationalPhone][countryCode]",
            "shipping[internationalPhone][nationalNumber]",
            "shipping[lastName]",
            "shipping[locality]",
            "shipping[phoneNumber]",
            "shipping[postalCode]",
            "shipping[region]",
            "shipping[streetAddress]",
            "shippingOptions[amount]",
            "shippingOptions[id]",
            "shippingOptions[label]",
            "shippingOptions[selected]",
            "shippingOptions[type]"
          ]
        };
      }
    };
    module2.exports = {
      PayPalPaymentResourceGateway: wrapPrototype(PayPalPaymentResourceGateway)
    };
  }
});

// node_modules/braintree/lib/braintree/plan.js
var require_plan = __commonJS({
  "node_modules/braintree/lib/braintree/plan.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var Plan = class extends AttributeSetter {
    };
    module2.exports = { Plan };
  }
});

// node_modules/braintree/lib/braintree/plan_gateway.js
var require_plan_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/plan_gateway.js"(exports2, module2) {
    "use strict";
    var Gateway = require_gateway().Gateway;
    var Plan = require_plan().Plan;
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var exceptions = require_exceptions();
    var PlanGateway = class extends Gateway {
      constructor(gateway2) {
        super();
        this.gateway = gateway2;
        this.config = this.gateway.config;
      }
      all() {
        return this.gateway.http.get(`${this.config.baseMerchantPath()}/plans`).then(this.createResponseHandler("plan", Plan)).then((response) => {
          if (!response.success) {
            return response;
          }
          const collection = response.plans;
          collection.success = response.success;
          collection.plans = response.plans;
          return collection;
        });
      }
      create(attributes) {
        return this.gateway.http.post(`${this.config.baseMerchantPath()}/plans`, { plan: attributes }).then(this.responseHandler());
      }
      find(planId) {
        if (planId.trim() === "") {
          return Promise.reject(exceptions.NotFoundError("Not Found"), null);
        }
        return this.gateway.http.get(`${this.config.baseMerchantPath()}/plans/${planId}`).then((response) => {
          return new Plan(response.plan, this.gateway);
        });
      }
      update(planId, attributes) {
        return this.gateway.http.put(`${this.config.baseMerchantPath()}/plans/${planId}`, {
          plan: attributes
        }).then(this.responseHandler());
      }
      responseHandler() {
        return this.createResponseHandler("plan", Plan);
      }
    };
    module2.exports = { PlanGateway: wrapPrototype(PlanGateway) };
  }
});

// node_modules/braintree/lib/braintree/sepa_direct_debit_account_gateway.js
var require_sepa_direct_debit_account_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/sepa_direct_debit_account_gateway.js"(exports2, module2) {
    "use strict";
    var Gateway = require_gateway().Gateway;
    var SepaDirectDebitAccount = require_sepa_direct_debit_account().SepaDirectDebitAccount;
    var exceptions = require_exceptions();
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var SepaDirectDebitAccountGateway = class extends Gateway {
      constructor(gateway2) {
        super();
        this.gateway = gateway2;
        this.config = this.gateway.config;
      }
      find(token) {
        if (token.trim() === "") {
          return Promise.reject(exceptions.NotFoundError("Not Found"), null);
        }
        return this.gateway.http.get(
          `${this.config.baseMerchantPath()}/payment_methods/sepa_debit_account/${token}`
        ).then((response) => {
          return new SepaDirectDebitAccount(response.sepaDebitAccount);
        });
      }
      delete(token) {
        let path2 = `${this.config.baseMerchantPath()}/payment_methods/sepa_debit_account/${token}`;
        return this.gateway.http.delete(path2);
      }
      responseHandler() {
        return this.createResponseHandler(
          "sepa_direct_debitAccount",
          SepaDirectDebitAccount
        );
      }
    };
    module2.exports = {
      SepaDirectDebitAccountGateway: wrapPrototype(SepaDirectDebitAccountGateway)
    };
  }
});

// node_modules/braintree/lib/braintree/settlement_batch_summary.js
var require_settlement_batch_summary = __commonJS({
  "node_modules/braintree/lib/braintree/settlement_batch_summary.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var SettlementBatchSummary = class extends AttributeSetter {
    };
    module2.exports = { SettlementBatchSummary };
  }
});

// node_modules/braintree/lib/braintree/settlement_batch_summary_gateway.js
var require_settlement_batch_summary_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/settlement_batch_summary_gateway.js"(exports2, module2) {
    "use strict";
    var Gateway = require_gateway().Gateway;
    var Util = require_util().Util;
    var SettlementBatchSummary = require_settlement_batch_summary().SettlementBatchSummary;
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var SettlementBatchSummaryGateway = class extends Gateway {
      constructor(gateway2) {
        super();
        this.gateway = gateway2;
        this.config = this.gateway.config;
      }
      generate(criteria) {
        return this.gateway.http.post(`${this.config.baseMerchantPath()}/settlement_batch_summary`, {
          settlementBatchSummary: criteria
        }).then(this.responseHandler(criteria));
      }
      responseHandler(criteria) {
        let handler = this.createResponseHandler(
          "settlementBatchSummary",
          SettlementBatchSummary
        );
        return (payload) => {
          return handler(payload).then((response) => {
            return this.underscoreCustomField(criteria, response);
          });
        };
      }
      underscoreCustomField(criteria, response) {
        if (response.success && "groupByCustomField" in criteria) {
          if (criteria.groupByCustomField.indexOf("_") === -1) {
            return response;
          }
          let camelCustomField = Util.toCamelCase(criteria.groupByCustomField);
          for (let record of response.settlementBatchSummary.records) {
            record[criteria.groupByCustomField] = record[camelCustomField];
            delete record[camelCustomField];
          }
        }
        return response;
      }
    };
    module2.exports = {
      SettlementBatchSummaryGateway: wrapPrototype(SettlementBatchSummaryGateway)
    };
  }
});

// node_modules/braintree/lib/braintree/subscription.js
var require_subscription = __commonJS({
  "node_modules/braintree/lib/braintree/subscription.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var Transaction = require_transaction().Transaction;
    var Subscription = class extends AttributeSetter {
      static initClass() {
        this.Source = {
          Api: "api",
          ControlPanel: "control_panel",
          Recurring: "recurring"
        };
        this.Status = {
          Active: "Active",
          Canceled: "Canceled",
          Expired: "Expired",
          PastDue: "Past Due",
          Pending: "Pending",
          All() {
            let all = [];
            for (let key in this) {
              if (!this.hasOwnProperty(key)) {
                continue;
              }
              let value = this[key];
              if (key !== "All") {
                all.push(value);
              }
            }
            return all;
          }
        };
      }
      constructor(attributes, gateway2) {
        super(attributes, gateway2);
        this.transactions = attributes.transactions.map(
          (transactionAttributes) => new Transaction(transactionAttributes, gateway2)
        );
      }
    };
    Subscription.initClass();
    module2.exports = { Subscription };
  }
});

// node_modules/braintree/lib/braintree/subscription_search.js
var require_subscription_search = __commonJS({
  "node_modules/braintree/lib/braintree/subscription_search.js"(exports2, module2) {
    "use strict";
    var AdvancedSearch = require_advanced_search().AdvancedSearch;
    var Subscription = require_subscription().Subscription;
    var SubscriptionSearch = class extends AdvancedSearch {
      static initClass() {
        this.multipleValueField("inTrialPeriod");
        this.multipleValueField("ids");
        this.textFields("id", "transactionId");
        this.multipleValueOrTextField("planId");
        this.multipleValueField("status", { allows: Subscription.Status.All() });
        this.multipleValueField("merchantAccountId");
        this.rangeFields(
          "price",
          "daysPastDue",
          "billingCyclesRemaining",
          "nextBillingDate",
          "createdAt"
        );
      }
    };
    SubscriptionSearch.initClass();
    module2.exports = { SubscriptionSearch };
  }
});

// node_modules/braintree/lib/braintree/transaction_search.js
var require_transaction_search = __commonJS({
  "node_modules/braintree/lib/braintree/transaction_search.js"(exports2, module2) {
    "use strict";
    var AdvancedSearch = require_advanced_search().AdvancedSearch;
    var Transaction = require_transaction().Transaction;
    var CreditCard = require_credit_card().CreditCard;
    var TransactionSearch = class extends AdvancedSearch {
      static initClass() {
        this.textFields(
          "billingCompany",
          "billingCountryName",
          "billingExtendedAddress",
          "billingFirstName",
          "billingLastName",
          "billingLocality",
          "billingPostalCode",
          "billingRegion",
          "billingStreetAddress",
          "creditCardCardholderName",
          "creditCardUniqueIdentifier",
          "currency",
          "customerCompany",
          "customerEmail",
          "customerFax",
          "customerFirstName",
          "customerId",
          "customerLastName",
          "customerPhone",
          "customerWebsite",
          "id",
          "orderId",
          "paymentMethodToken",
          "paypalPayerEmail",
          "paypalPaymentId",
          "paypalAuthorizationId",
          "processorAuthorizationCode",
          "sepaDebitPaypalV2_OrderId",
          "settlementBatchId",
          "shippingCompany",
          "shippingCountryName",
          "shippingExtendedAddress",
          "shippingFirstName",
          "shippingLastName",
          "shippingLocality",
          "shippingPostalCode",
          "shippingRegion",
          "shippingStreetAddress",
          "storeId"
        );
        this.equalityFields("creditCardExpirationDate");
        this.partialMatchFields("creditCardNumber");
        this.multipleValueField("createdUsing", {
          allows: [
            Transaction.CreatedUsing.FullInformation,
            Transaction.CreatedUsing.Token
          ]
        });
        this.multipleValueField("creditCardCardType", {
          // eslint-disable-next-line new-cap
          allows: CreditCard.CardType.All()
        });
        this.multipleValueField("creditCardCustomerLocation", {
          allows: [
            CreditCard.CustomerLocation.International,
            CreditCard.CustomerLocation.US
          ]
        });
        this.multipleValueField("debitNetwork", {
          // eslint-disable-next-line new-cap
          allows: CreditCard.DebitNetwork.All()
        });
        this.multipleValueField("ids");
        this.multipleValueField("merchantAccountId");
        this.multipleValueField("paymentInstrumentType");
        this.multipleValueField("reasonCode");
        this.multipleValueField("source");
        this.multipleValueField("status", { allows: Transaction.Status.All() });
        this.multipleValueField("storeIds");
        this.multipleValueField("type", { allows: Transaction.Type.All() });
        this.multipleValueField("user");
        this.keyValueFields("refund");
        this.rangeFields(
          "amount",
          "authorizationExpiredAt",
          "authorizedAt",
          "createdAt",
          "disbursementDate",
          "disputeDate",
          "failedAt",
          "gatewayRejectedAt",
          "processorDeclinedAt",
          "settledAt",
          "submittedForSettlementAt",
          "voidedAt",
          "achReturnResponsesCreatedAt"
        );
      }
    };
    TransactionSearch.initClass();
    module2.exports = { TransactionSearch };
  }
});

// node_modules/braintree/lib/braintree/transaction_gateway.js
var require_transaction_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/transaction_gateway.js"(exports2, module2) {
    "use strict";
    var AddressGateway = require_address_gateway().AddressGateway;
    var Gateway = require_gateway().Gateway;
    var Transaction = require_transaction().Transaction;
    var TransactionSearch = require_transaction_search().TransactionSearch;
    var Util = require_util().Util;
    var exceptions = require_exceptions();
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var TransactionGateway = class extends Gateway {
      constructor(gateway2) {
        super();
        this.gateway = gateway2;
        this.config = this.gateway.config;
      }
      adjustAuthorization(transactionId, amount) {
        return this.gateway.http.put(
          `${this.config.baseMerchantPath()}/transactions/${transactionId}/adjust_authorization`,
          {
            transaction: { amount }
          }
        ).then(this.responseHandler());
      }
      cancelRelease(transactionId) {
        let path2 = `${this.config.baseMerchantPath()}/transactions/${transactionId}/cancel_release`;
        let body = {};
        return this.gateway.http.put(path2, body).then(this.responseHandler());
      }
      cloneTransaction(transactionId, attributes) {
        return this.gateway.http.post(
          `${this.config.baseMerchantPath()}/transactions/${transactionId}/clone`,
          {
            transactionClone: attributes
          }
        ).then(this.responseHandler());
      }
      create(attributes) {
        return this.gateway.http.post(`${this.config.baseMerchantPath()}/transactions`, {
          transaction: attributes
        }).then(this.responseHandler());
      }
      credit(attributes) {
        attributes.type = "credit";
        return this.create(attributes);
      }
      find(transactionId) {
        if (transactionId.trim() === "") {
          return Promise.reject(exceptions.NotFoundError("Not Found"), null);
        }
        return this.gateway.http.get(`${this.config.baseMerchantPath()}/transactions/${transactionId}`).then((response) => {
          return new Transaction(response.transaction, this.gateway);
        });
      }
      holdInEscrow(transactionId) {
        return this.gateway.http.put(
          `${this.config.baseMerchantPath()}/transactions/${transactionId}/hold_in_escrow`,
          {}
        ).then(this.responseHandler());
      }
      refund(transactionId, options) {
        if (typeof options === "function") {
          options = {};
        } else if (typeof options !== "object") {
          options = { amount: options };
        }
        return this.gateway.http.post(
          `${this.config.baseMerchantPath()}/transactions/${transactionId}/refund`,
          { transaction: options }
        ).then(this.responseHandler());
      }
      responseHandler() {
        return this.createResponseHandler("transaction", Transaction);
      }
      sale(attributes) {
        let invalidKeysError;
        this._checkForDeprecatedAttributes(attributes);
        attributes.type = "sale";
        invalidKeysError = Util.verifyKeys(this._createSignature(), attributes);
        if (invalidKeysError) {
          return Promise.reject(invalidKeysError, null);
        }
        return this.create(attributes);
      }
      search(fn, callback) {
        let search = new TransactionSearch();
        fn(search);
        return this.createSearchResponse(
          `${this.config.baseMerchantPath()}/transactions/advanced_search_ids`,
          search,
          this.pagingFunctionGenerator(search),
          callback
        );
      }
      releaseFromEscrow(transactionId) {
        return this.gateway.http.put(
          `${this.config.baseMerchantPath()}/transactions/${transactionId}/release_from_escrow`,
          {}
        ).then(this.responseHandler());
      }
      submitForSettlement(transactionId, amount, options) {
        let invalidKeysError;
        options = options || {};
        invalidKeysError = Util.verifyKeys(
          this._submitForSettlementSignature(),
          options
        );
        if (invalidKeysError) {
          return Promise.reject(invalidKeysError, null);
        }
        return this.gateway.http.put(
          `${this.config.baseMerchantPath()}/transactions/${transactionId}/submit_for_settlement`,
          {
            transaction: Object.assign(
              {
                amount
              },
              options
            )
          }
        ).then(this.responseHandler());
      }
      updateDetails(transactionId, options) {
        let invalidKeysError = Util.verifyKeys(
          this._updateDetailsSignature(),
          options
        );
        if (invalidKeysError) {
          return Promise.reject(invalidKeysError, null);
        }
        return this.gateway.http.put(
          `${this.config.baseMerchantPath()}/transactions/${transactionId}/update_details`,
          {
            transaction: options
          }
        ).then(this.responseHandler());
      }
      packageTracking(transactionId, attributes) {
        let invalidKeysError = Util.verifyKeys(
          this._packageTrackingSignature(),
          attributes
        );
        if (invalidKeysError) {
          return Promise.reject(invalidKeysError, null);
        }
        return this.gateway.http.post(
          `${this.config.baseMerchantPath()}/transactions/${transactionId}/shipments`,
          {
            shipment: attributes
          }
        ).then(this.responseHandler());
      }
      submitForPartialSettlement(transactionId, amount, options) {
        let invalidKeysError;
        options = options || {};
        invalidKeysError = Util.verifyKeys(
          this._submitForPartialSettlementSignature(),
          options
        );
        if (invalidKeysError) {
          return Promise.reject(invalidKeysError, null);
        }
        return this.gateway.http.post(
          `${this.config.baseMerchantPath()}/transactions/${transactionId}/submit_for_partial_settlement`,
          {
            transaction: Object.assign(
              {
                amount
              },
              options
            )
          }
        ).then(this.responseHandler());
      }
      void(transactionId) {
        return this.gateway.http.put(
          `${this.config.baseMerchantPath()}/transactions/${transactionId}/void`,
          null
        ).then(this.responseHandler());
      }
      pagingFunctionGenerator(search) {
        return super.pagingFunctionGenerator(
          search,
          "transactions/advanced_search",
          Transaction,
          "creditCardTransactions",
          (response) => response.creditCardTransactions.transaction
        );
      }
      _submitForSettlementSignature() {
        return {
          valid: [
            "descriptor[name]",
            "descriptor[phone]",
            "descriptor[url]",
            "discountAmount",
            "industry",
            "industry[data]",
            "industry[data][additionalCharges][amount]",
            "industry[data][additionalCharges][kind]",
            "industry[data][advancedDeposit]",
            "industry[data][arrivalDate]",
            "industry[data][checkInDate]",
            "industry[data][checkOutDate]",
            "industry[data][countryCode]",
            "industry[data][customerCode]",
            "industry[data][dateOfBirth]",
            "industry[data][departureDate]",
            "industry[data][fareAmount]",
            "industry[data][feeAmount]",
            "industry[data][fireSafe]",
            "industry[data][folioNumber]",
            "industry[data][issuedDate]",
            "industry[data][issuingCarrierCode]",
            "industry[data][legs][arrivalAirportCode]",
            "industry[data][legs][arrivalTime]",
            "industry[data][legs][carrierCode]",
            "industry[data][legs][conjunctionTicket]",
            "industry[data][legs][couponNumber]",
            "industry[data][legs][departureAirportCode]",
            "industry[data][legs][departureDate]",
            "industry[data][legs][departureTime]",
            "industry[data][legs][endorsementOrRestrictions]",
            "industry[data][legs][exchangeTicket]",
            "industry[data][legs][fareAmount]",
            "industry[data][legs][fareBasisCode]",
            "industry[data][legs][feeAmount]",
            "industry[data][legs][flightNumber]",
            "industry[data][legs][serviceClass]",
            "industry[data][legs][stopoverPermitted]",
            "industry[data][legs][taxAmount]",
            "industry[data][lodgingCheckInDate]",
            "industry[data][lodgingCheckOutDate]",
            "industry[data][lodgingName]",
            "industry[data][noShow]",
            "industry[data][passengerFirstName]",
            "industry[data][passengerLastName]",
            "industry[data][passengerMiddleInitial]",
            "industry[data][passengerTitle]",
            "industry[data][propertyPhone]",
            "industry[data][restrictedTicket]",
            "industry[data][roomRate]",
            "industry[data][roomTax]",
            "industry[data][taxAmount]",
            "industry[data][ticketIssuerAddress]",
            "industry[data][ticketNumber]",
            "industry[data][travelAgencyName]",
            "industry[data][travelAgencyCode]",
            "industry[data][travelPackage]",
            "industry[industryType]",
            "lineItems[commodityCode]",
            "lineItems[description]",
            "lineItems[discountAmount]",
            "lineItems[imageUrl]",
            "lineItems[itemType]",
            "lineItems[kind]",
            "lineItems[name]",
            "lineItems[productCode]",
            "lineItems[quantity]",
            "lineItems[taxAmount]",
            "lineItems[totalAmount]",
            "lineItems[unitAmount]",
            "lineItems[unitOfMeasure]",
            "lineItems[unitTaxAmount]",
            "lineItems[upcCode]",
            "lineItems[upcType]",
            "lineItems[url]",
            "orderId",
            "purchaseOrderNumber",
            "shipping[company]",
            "shipping[countryCodeAlpha2]",
            "shipping[countryCodeAlpha3]",
            "shipping[countryCodeNumeric]",
            "shipping[countryName]",
            "shipping[extendedAddress]",
            "shipping[firstName]",
            "shipping[internationalPhone][countryCode]",
            "shipping[internationalPhone][nationalNumber]",
            "shipping[lastName]",
            "shipping[locality]",
            "shipping[phoneNumber]",
            "shipping[postalCode]",
            "shipping[region]",
            "shipping[streetAddress]",
            "shippingAddressId",
            "shippingAmount",
            "shippingTaxAmount",
            "shipsFromPostalCode",
            "taxAmount",
            "taxExempt"
          ]
        };
      }
      _submitForPartialSettlementSignature() {
        let validKeys = this._submitForSettlementSignature();
        validKeys.valid.push("finalCapture");
        return validKeys;
      }
      _updateDetailsSignature() {
        return {
          valid: [
            "amount",
            "orderId",
            "descriptor[name]",
            "descriptor[phone]",
            "descriptor[url]"
          ]
        };
      }
      _packageTrackingSignature() {
        return {
          valid: [
            "carrier",
            "lineItems[commodityCode]",
            "lineItems[description]",
            "lineItems[discountAmount]",
            "lineItems[imageUrl]",
            "lineItems[kind]",
            "lineItems[name]",
            "lineItems[productCode]",
            "lineItems[quantity]",
            "lineItems[taxAmount]",
            "lineItems[totalAmount]",
            "lineItems[unitAmount]",
            "lineItems[unitOfMeasure]",
            "lineItems[unitTaxAmount]",
            "lineItems[upcCode]",
            "lineItems[upcType]",
            "lineItems[url]",
            "notifyPayer",
            "trackingNumber"
          ]
        };
      }
      _createSignature() {
        let validKeys = [
          "amount",
          "customerId",
          "exchangeRateQuoteId",
          "merchantAccountId",
          "orderId",
          "channel",
          "paymentMethodToken",
          "purchaseOrderNumber",
          "recurring",
          "transactionSource",
          "shippingAddressId",
          "type",
          "taxAmount",
          "taxExempt",
          // NEXT_MAJOR_VERSION remove "venmoSdkPaymentMethodCode"
          "venmoSdkPaymentMethodCode",
          // NEXT_MAJOR_VERSION remove deviceSessionId
          "deviceSessionId",
          "serviceFeeAmount",
          "deviceData",
          // NEXT_MAJOR_VERSION remove fraudMerchantId
          "fraudMerchantId",
          "billingAddressId",
          "paymentMethodNonce",
          "paymentMethodToken",
          "acquirerReferenceNumber",
          // NEXT_MAJOR_VERSION remove threeDSecureToken
          "threeDSecureToken",
          "threeDSecureAuthenticationId",
          "sharedPaymentMethodToken",
          "sharedPaymentMethodNonce",
          "sharedBillingAddressId",
          "sharedCustomerId",
          "sharedShippingAddressId",
          "riskData",
          "riskData[customerBrowser]",
          "riskData[customerDeviceId]",
          "riskData[customerIp]",
          "riskData[customerLocationZip]",
          "riskData[customerTenure]",
          "creditCard",
          "creditCard[token]",
          "creditCard[cardholderName]",
          "creditCard[cvv]",
          "creditCard[expirationDate]",
          "creditCard[expirationMonth]",
          "creditCard[expirationYear]",
          "creditCard[networkTokenizationAttributes][cryptogram]",
          "creditCard[networkTokenizationAttributes][ecommerceIndicator]",
          "creditCard[networkTokenizationAttributes][tokenRequestorId]",
          "creditCard[number]",
          "creditCard[paymentReaderCardDetails][encryptedCardData]",
          "creditCard[paymentReaderCardDetails][keySerialNumber]",
          "customer",
          "customer[id]",
          "customer[company]",
          "customer[email]",
          "customer[fax]",
          "customer[firstName]",
          "customer[lastName]",
          "customer[phone]",
          "customer[website]",
          "threeDSecurePassThru",
          "threeDSecurePassThru[eciFlag]",
          "threeDSecurePassThru[cavv]",
          "threeDSecurePassThru[xid]",
          "threeDSecurePassThru[threeDSecureVersion]",
          "threeDSecurePassThru[authenticationResponse]",
          "threeDSecurePassThru[directoryResponse]",
          "threeDSecurePassThru[cavvAlgorithm]",
          "threeDSecurePassThru[dsTransactionId]",
          "options",
          "options[addBillingAddressToPaymentMethod]",
          "options[amexRewards]",
          "options[amexRewards][currencyAmount]",
          "options[amexRewards][currencyIsoCode]",
          "options[amexRewards][requestId]",
          "options[amexRewards][points]",
          "options[credit_card][accountType]",
          "options[credit_card][processDebitAsCredit]",
          "options[holdInEscrow]",
          // NEXT_MAJOR_VERSION remove "options[venmoSdkSession]"
          "options[payeeId]",
          "options[payeeEmail]",
          "options[paypal]",
          "options[paypal][customField]",
          "options[paypal][payeeId]",
          "options[paypal][payeeEmail]",
          "options[paypal][description]",
          "options[paypal][recipientEmail]",
          "options[paypal][recipientPhone][countryCode]",
          "options[paypal][recipientPhone][nationalNumber]",
          "options[processingOverrides]",
          "options[processingOverrides][customerEmail]",
          "options[processingOverrides][customerFirstName]",
          "options[processingOverrides][customerLastName]",
          "options[processingOverrides][customerTaxIdentifier]",
          "options[skipAdvancedFraudChecking]",
          "options[skipAvs]",
          "options[skipCvv]",
          "options[storeInVault]",
          "options[storeInVaultOnSuccess]",
          "options[storeShippingAddressInVault]",
          "options[submitForSettlement]",
          "options[threeDSecure]",
          "options[threeDSecure][required]",
          "options[venmo]",
          "options[venmo][profileId]",
          "options[venmoSdkSession]",
          "descriptor",
          "descriptor[name]",
          "descriptor[phone]",
          "descriptor[url]",
          "paypalAccount",
          "paypalAccount[email]",
          "paypalAccount[token]",
          "paypalAccount[paypalData]",
          "paypalAccount[payeeId]",
          "paypalAccount[payeeEmail]",
          "paypalAccount[payerId]",
          "paypalAccount[paymentId]",
          "productSku",
          "industry",
          "industry[data]",
          "industry[data][additionalCharges][kind]",
          "industry[data][additionalCharges][amount]",
          "industry[data][advancedDeposit]",
          "industry[data][arrivalDate]",
          "industry[data][checkInDate]",
          "industry[data][checkOutDate]",
          "industry[data][countryCode]",
          "industry[data][customerCode]",
          "industry[data][dateOfBirth]",
          "industry[data][departureDate]",
          "industry[data][fareAmount]",
          "industry[data][feeAmount]",
          "industry[data][fireSafe]",
          "industry[data][folioNumber]",
          "industry[data][issuedDate]",
          "industry[data][issuingCarrierCode]",
          "industry[data][legs][arrivalAirportCode]",
          "industry[data][legs][arrivalTime]",
          "industry[data][legs][carrierCode]",
          "industry[data][legs][conjunctionTicket]",
          "industry[data][legs][couponNumber]",
          "industry[data][legs][departureAirportCode]",
          "industry[data][legs][departureDate]",
          "industry[data][legs][departureTime]",
          "industry[data][legs][endorsementOrRestrictions]",
          "industry[data][legs][exchangeTicket]",
          "industry[data][legs][fareAmount]",
          "industry[data][legs][fareBasisCode]",
          "industry[data][legs][feeAmount]",
          "industry[data][legs][flightNumber]",
          "industry[data][legs][serviceClass]",
          "industry[data][legs][stopoverPermitted]",
          "industry[data][legs][taxAmount]",
          "industry[data][lodgingCheckInDate]",
          "industry[data][lodgingCheckOutDate]",
          "industry[data][lodgingName]",
          "industry[data][noShow]",
          "industry[data][passengerFirstName]",
          "industry[data][passengerLastName]",
          "industry[data][passengerMiddleInitial]",
          "industry[data][passengerTitle]",
          "industry[data][propertyPhone]",
          "industry[data][restrictedTicket]",
          "industry[data][roomRate]",
          "industry[data][roomTax]",
          "industry[data][taxAmount]",
          "industry[data][ticketIssuerAddress]",
          "industry[data][ticketNumber]",
          "industry[data][travelAgencyCode]",
          "industry[data][travelAgencyName]",
          "industry[data][travelPackage]",
          "industry[industryType]",
          "installments[count]",
          "discountAmount",
          "shippingAmount",
          "shippingTaxAmount",
          "shipsFromPostalCode",
          "lineItems[commodityCode]",
          "lineItems[description]",
          "lineItems[discountAmount]",
          "lineItems[imageUrl]",
          "lineItems[kind]",
          "lineItems[name]",
          "lineItems[productCode]",
          "lineItems[quantity]",
          "lineItems[taxAmount]",
          "lineItems[totalAmount]",
          "lineItems[unitAmount]",
          "lineItems[unitOfMeasure]",
          "lineItems[unitTaxAmount]",
          "lineItems[upcCode]",
          "lineItems[upcType]",
          "lineItems[url]",
          "applePayCard",
          "applePayCard[number]",
          "applePayCard[cardholderName]",
          "applePayCard[cryptogram]",
          "applePayCard[expirationMonth]",
          "applePayCard[expirationYear]",
          "applePayCard[eciIndicator]",
          // NEXT_MAJOR_VERSION rename Android Pay to Google Pay
          "androidPayCard",
          "androidPayCard[number]",
          "androidPayCard[cryptogram]",
          "androidPayCard[googleTransactionId]",
          "androidPayCard[expirationMonth]",
          "androidPayCard[expirationYear]",
          "androidPayCard[sourceCardType]",
          "androidPayCard[sourceCardLastFour]",
          "androidPayCard[eciIndicator]",
          "subscriptionId",
          "externalVault",
          "externalVault[status]",
          "externalVault[previousNetworkTransactionId]",
          "scaExemption",
          "foreignRetailer"
        ];
        let validShippingKeys = new AddressGateway(this).sharedSignature("shipping").concat("shipping[shippingMethod]");
        let validBillingKeys = new AddressGateway(this).sharedSignature("billing");
        validKeys = validKeys.concat(validShippingKeys, validBillingKeys);
        return {
          valid: validKeys,
          ignore: ["customFields", "options[paypal][supplementaryData]"]
        };
      }
      _checkForDeprecatedAttributes(attributes) {
        if (attributes.recurring != null) {
          console.warn(
            "[DEPRECATED] `recurring` is a deprecated param for transaction.sale calls. Use `transactionSource` instead"
          );
        }
        if (attributes.deviceSessionId != null) {
          console.warn(
            "[DEPRECATED] `deviceSessionId` is a deprecated param for transaction.sale calls. Use `deviceData` instead"
          );
        }
        if (attributes.fraudMerchantId != null) {
          console.warn(
            "[DEPRECATED] `fraudMerchantId` is a deprecated param for transaction.sale calls. Use `deviceData` instead"
          );
        }
        if (attributes.threeDSecureToken != null) {
          console.warn(
            "[DEPRECATED] `threeDSecureToken` is a deprecated param for transaction.sale calls. Use `threeDSecureAuthenticationId` instead"
          );
        }
        if (attributes.venmoSdkPaymentMethodCode != null) {
          console.warn(
            "The Venmo SDK integration is Unsupported. Please update your integration to use Pay with Venmo instead (https://developer.paypal.com/braintree/docs/guides/venmo/overview)"
          );
        }
        if (attributes.options != null && attributes.options.venmoSdkSession != null) {
          console.warn(
            "The Venmo SDK integration is Unsupported. Please update your integration to use Pay with Venmo instead (https://developer.paypal.com/braintree/docs/guides/venmo/overview)"
          );
        }
      }
    };
    module2.exports = {
      TransactionGateway: wrapPrototype(TransactionGateway, {
        ignoreMethods: ["search"]
      })
    };
  }
});

// node_modules/braintree/lib/braintree/subscription_gateway.js
var require_subscription_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/subscription_gateway.js"(exports2, module2) {
    "use strict";
    var Gateway = require_gateway().Gateway;
    var Subscription = require_subscription().Subscription;
    var SubscriptionSearch = require_subscription_search().SubscriptionSearch;
    var TransactionGateway = require_transaction_gateway().TransactionGateway;
    var exceptions = require_exceptions();
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var SubscriptionGateway = class extends Gateway {
      constructor(gateway2) {
        super();
        this.gateway = gateway2;
        this.config = this.gateway.config;
      }
      create(attributes) {
        return this.gateway.http.post(`${this.config.baseMerchantPath()}/subscriptions`, {
          subscription: attributes
        }).then(this.responseHandler());
      }
      cancel(subscriptionId) {
        return this.gateway.http.put(
          `${this.config.baseMerchantPath()}/subscriptions/${subscriptionId}/cancel`,
          null
        ).then(this.responseHandler());
      }
      find(subscriptionId) {
        if (subscriptionId.trim() === "") {
          return Promise.reject(exceptions.NotFoundError("Not Found"), null);
        }
        return this.gateway.http.get(`${this.config.baseMerchantPath()}/subscriptions/${subscriptionId}`).then((response) => {
          return new Subscription(response.subscription, this.gateway);
        });
      }
      responseHandler() {
        return this.createResponseHandler("subscription", Subscription);
      }
      retryCharge(subscriptionId, amount, submitForSettlement) {
        if (typeof amount === "function") {
          amount = void 0;
        }
        if (typeof submitForSettlement === "function") {
          submitForSettlement = false;
        }
        return new TransactionGateway(this.gateway).sale({
          amount,
          subscriptionId,
          options: {
            submitForSettlement
          }
        });
      }
      search(fn, callback) {
        let search = new SubscriptionSearch();
        fn(search);
        return this.createSearchResponse(
          `${this.config.baseMerchantPath()}/subscriptions/advanced_search_ids`,
          search,
          this.pagingFunctionGenerator(search),
          callback
        );
      }
      update(subscriptionId, attributes) {
        return this.gateway.http.put(
          `${this.config.baseMerchantPath()}/subscriptions/${subscriptionId}`,
          { subscription: attributes }
        ).then(this.responseHandler());
      }
      pagingFunctionGenerator(search) {
        return super.pagingFunctionGenerator(
          search,
          "subscriptions/advanced_search",
          Subscription,
          "subscriptions",
          (response) => response.subscriptions.subscription
        );
      }
    };
    module2.exports = {
      SubscriptionGateway: wrapPrototype(SubscriptionGateway, {
        ignoreMethods: ["search"]
      })
    };
  }
});

// node_modules/braintree/lib/braintree/testing_gateway.js
var require_testing_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/testing_gateway.js"(exports2, module2) {
    "use strict";
    var Gateway = require_gateway().Gateway;
    var Environment = require_environment().Environment;
    var exceptions = require_exceptions();
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var TestingGateway = class extends Gateway {
      constructor(gateway2) {
        super();
        this.gateway = gateway2;
        this.config = this.gateway.config;
      }
      settle(transactionId) {
        return this.settlementOperationWithEnvironmentCheck(
          transactionId,
          "settle"
        );
      }
      settlementPending(transactionId) {
        return this.settlementOperationWithEnvironmentCheck(
          transactionId,
          "settlement_pending"
        );
      }
      settlementConfirm(transactionId) {
        return this.settlementOperationWithEnvironmentCheck(
          transactionId,
          "settlement_confirm"
        );
      }
      settlementDecline(transactionId) {
        return this.settlementOperationWithEnvironmentCheck(
          transactionId,
          "settlement_decline"
        );
      }
      settlementOperationWithEnvironmentCheck(transactionId, operation) {
        if (this.config.environment === Environment.Production) {
          return Promise.reject(
            // eslint-disable-next-line new-cap
            exceptions.TestOperationPerformedInProductionError(
              "Test operation performed in production"
            ),
            null
          );
        }
        return this.gateway.http.put(
          `${this.config.baseMerchantPath()}/transactions/${transactionId}/${operation}`,
          null
        );
      }
    };
    module2.exports = { TestingGateway: wrapPrototype(TestingGateway) };
  }
});

// node_modules/braintree/lib/braintree/transaction_line_item.js
var require_transaction_line_item = __commonJS({
  "node_modules/braintree/lib/braintree/transaction_line_item.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var TransactionLineItem = class extends AttributeSetter {
      static initClass() {
        this.Kind = {
          Credit: "credit",
          Debit: "debit",
          All() {
            let all = [];
            for (let key in this) {
              if (!this.hasOwnProperty(key)) {
                continue;
              }
              let value = this[key];
              if (key !== "All") {
                all.push(value);
              }
            }
            return all;
          }
        };
      }
      constructor(attributes) {
        super(attributes);
      }
    };
    TransactionLineItem.initClass();
    module2.exports = { TransactionLineItem };
  }
});

// node_modules/braintree/lib/braintree/transaction_line_item_gateway.js
var require_transaction_line_item_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/transaction_line_item_gateway.js"(exports2, module2) {
    "use strict";
    var Gateway = require_gateway().Gateway;
    var TransactionLineItem = require_transaction_line_item().TransactionLineItem;
    var exceptions = require_exceptions();
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var TransactionLineItemGateway = class extends Gateway {
      constructor(gateway2) {
        super();
        this.gateway = gateway2;
        this.config = this.gateway.config;
      }
      findAll(transactionId) {
        if (transactionId.trim() === "") {
          return Promise.reject(exceptions.NotFoundError("Not Found"), null);
        }
        return this.gateway.http.get(
          `${this.config.baseMerchantPath()}/transactions/${transactionId}/line_items`
        ).then((response) => {
          return response.lineItems.map(function(lineItem) {
            return new TransactionLineItem(lineItem);
          });
        });
      }
    };
    module2.exports = {
      TransactionLineItemGateway: wrapPrototype(TransactionLineItemGateway, {})
    };
  }
});

// node_modules/braintree/lib/braintree/us_bank_account_gateway.js
var require_us_bank_account_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/us_bank_account_gateway.js"(exports2, module2) {
    "use strict";
    var Gateway = require_gateway().Gateway;
    var UsBankAccount = require_us_bank_account().UsBankAccount;
    var TransactionGateway = require_transaction_gateway().TransactionGateway;
    var exceptions = require_exceptions();
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var UsBankAccountGateway = class extends Gateway {
      constructor(gateway2) {
        super();
        this.gateway = gateway2;
        this.config = this.gateway.config;
      }
      find(token) {
        if (token.trim() === "") {
          return Promise.reject(exceptions.NotFoundError("Not Found"), null);
        }
        return this.gateway.http.get(
          `${this.config.baseMerchantPath()}/payment_methods/us_bank_account/${token}`
        ).then(function(response) {
          return new UsBankAccount(response.usBankAccount);
        });
      }
      sale(token, transactionRequest) {
        transactionRequest.paymentMethodToken = token;
        if (!transactionRequest.options) {
          transactionRequest.options = {};
        }
        transactionRequest.options.submitForSettlement = true;
        return new TransactionGateway(this.gateway).sale(transactionRequest);
      }
    };
    module2.exports = { UsBankAccountGateway: wrapPrototype(UsBankAccountGateway) };
  }
});

// node_modules/braintree/lib/braintree/us_bank_account_verification_search.js
var require_us_bank_account_verification_search = __commonJS({
  "node_modules/braintree/lib/braintree/us_bank_account_verification_search.js"(exports2, module2) {
    "use strict";
    var AdvancedSearch = require_advanced_search().AdvancedSearch;
    var UsBankAccountVerification = require_us_bank_account_verification().UsBankAccountVerification;
    var UsBankAccountVerificationSearch = class extends AdvancedSearch {
      static initClass() {
        this.textFields(
          "accountHolderName",
          "customerEmail",
          "customerId",
          "id",
          "paymentMethodToken",
          "routingNumber"
        );
        this.multipleValueField("ids");
        this.multipleValueField("status", {
          // eslint-disable-next-line new-cap
          allows: UsBankAccountVerification.StatusType.All()
        });
        this.multipleValueField("verificationMethod", {
          // eslint-disable-next-line new-cap
          allows: UsBankAccountVerification.VerificationMethod.All()
        });
        this.rangeFields("createdAt");
        this.equalityFields("accountType");
        this.endsWithFields("accountNumber");
      }
    };
    UsBankAccountVerificationSearch.initClass();
    module2.exports = {
      UsBankAccountVerificationSearch
    };
  }
});

// node_modules/braintree/lib/braintree/us_bank_account_verification_gateway.js
var require_us_bank_account_verification_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/us_bank_account_verification_gateway.js"(exports2, module2) {
    "use strict";
    var Gateway = require_gateway().Gateway;
    var UsBankAccountVerification = require_us_bank_account_verification().UsBankAccountVerification;
    var UsBankAccountVerificationSearch = require_us_bank_account_verification_search().UsBankAccountVerificationSearch;
    var exceptions = require_exceptions();
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var UsBankAccountVerificationGateway = class extends Gateway {
      constructor(gateway2) {
        super();
        this.gateway = gateway2;
        this.config = this.gateway.config;
      }
      find(usBankAccountVerificationId) {
        if (usBankAccountVerificationId.trim() === "") {
          return Promise.reject(exceptions.NotFoundError("Not Found"));
        }
        return this.gateway.http.get(
          `${this.config.baseMerchantPath()}/us_bank_account_verifications/${usBankAccountVerificationId}`
        ).then(function(response) {
          return new UsBankAccountVerification(
            response.usBankAccountVerification
          );
        });
      }
      search(fn, callback) {
        let search = new UsBankAccountVerificationSearch();
        fn(search);
        return this.createSearchResponse(
          `${this.config.baseMerchantPath()}/us_bank_account_verifications/advanced_search_ids`,
          search,
          this.pagingFunctionGenerator(search),
          callback
        );
      }
      confirmMicroTransferAmounts(usBankAccountVerificationId, depositAmounts, callback) {
        let params = {
          usBankAccountVerification: {
            depositAmounts
          }
        };
        return this.gateway.http.put(
          `${this.config.baseMerchantPath()}/us_bank_account_verifications/${usBankAccountVerificationId}/confirm_micro_transfer_amounts`,
          params,
          callback
        ).then(this.responseHandler());
      }
      responseHandler() {
        return this.createResponseHandler(
          "usBankAccountVerification",
          UsBankAccountVerification
        );
      }
      pagingFunctionGenerator(search) {
        return (ids, callback) => {
          let searchCriteria = search.toHash();
          searchCriteria.ids = ids;
          return this.gateway.http.post(
            `${this.config.baseMerchantPath()}/us_bank_account_verifications/advanced_search`,
            { search: searchCriteria },
            function(err, response) {
              if (err) {
                return callback(err, null);
              } else if (Array.isArray(
                response.usBankAccountVerifications.usBankAccountVerification
              )) {
                return response.usBankAccountVerifications.usBankAccountVerification.map(
                  (usBankAccountVerification) => callback(
                    null,
                    new UsBankAccountVerification(usBankAccountVerification)
                  )
                );
              }
              return callback(
                null,
                new UsBankAccountVerification(
                  response.usBankAccountVerifications.usBankAccountVerification
                )
              );
            }
          );
        };
      }
    };
    module2.exports = {
      UsBankAccountVerificationGateway: wrapPrototype(
        UsBankAccountVerificationGateway,
        {
          ignoreMethods: ["search"]
        }
      )
    };
  }
});

// node_modules/braintree/lib/braintree/digest.js
var require_digest = __commonJS({
  "node_modules/braintree/lib/braintree/digest.js"(exports2, module2) {
    "use strict";
    var crypto = require("crypto");
    var {
      Util: { zip }
    } = require_util();
    var Digest = class _Digest {
      static Sha1hexdigest(privateKey, string) {
        return new _Digest().hmacSha1(privateKey, string);
      }
      static secureCompare(left, right) {
        return new _Digest().secureCompare(left, right);
      }
      hmacSha256(key, data) {
        let hmac = crypto.createHmac("sha256", this.sha256(key));
        hmac.update(data, "binary");
        return hmac.digest("hex");
      }
      hmacSha1(key, data) {
        let hmac = crypto.createHmac("sha1", this.sha1(key));
        hmac.update(data, "binary");
        return hmac.digest("hex");
      }
      secureCompare(left, right) {
        if (left == null || right == null) {
          return false;
        }
        let leftBytes = this.unpack(left);
        let rightBytes = this.unpack(right);
        let result = 0;
        for (let [leftByte, rightByte] of zip(leftBytes, rightBytes)) {
          result |= leftByte ^ rightByte;
        }
        return result === 0;
      }
      sha1(data) {
        let hash = crypto.createHash("sha1");
        hash.update(data, "binary");
        return hash.digest();
      }
      sha256(data) {
        let hash = crypto.createHash("sha256");
        hash.update(data, "binary");
        return hash.digest();
      }
      unpack(string) {
        let bytes = [];
        for (let index = 0; index < string.length; index++) {
          bytes.push(string.charCodeAt(index));
        }
        return bytes;
      }
    };
    module2.exports = { Digest };
  }
});

// node_modules/braintree/lib/braintree/account_updater_daily_report.js
var require_account_updater_daily_report = __commonJS({
  "node_modules/braintree/lib/braintree/account_updater_daily_report.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var AccountUpdaterDailyReport = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
      }
    };
    module2.exports = { AccountUpdaterDailyReport };
  }
});

// node_modules/braintree/lib/braintree/connected_merchant_paypal_status_changed.js
var require_connected_merchant_paypal_status_changed = __commonJS({
  "node_modules/braintree/lib/braintree/connected_merchant_paypal_status_changed.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var ConnectedMerchantPayPalStatusChanged = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
        this.merchantId = this.merchantPublicId;
      }
    };
    module2.exports = { ConnectedMerchantPayPalStatusChanged };
  }
});

// node_modules/braintree/lib/braintree/connected_merchant_status_transitioned.js
var require_connected_merchant_status_transitioned = __commonJS({
  "node_modules/braintree/lib/braintree/connected_merchant_status_transitioned.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var ConnectedMerchantStatusTransitioned = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
        this.merchantId = this.merchantPublicId;
      }
    };
    module2.exports = { ConnectedMerchantStatusTransitioned };
  }
});

// node_modules/braintree/lib/braintree/disbursement.js
var require_disbursement = __commonJS({
  "node_modules/braintree/lib/braintree/disbursement.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var Disbursement = class _Disbursement extends AttributeSetter {
      static initClass() {
        this.Types = {
          Credit: "credit",
          Debit: "debit"
        };
      }
      constructor(attributes) {
        super(attributes);
      }
      isDebit() {
        return this.disbursementType === _Disbursement.Types.Debit;
      }
      isCredit() {
        return this.disbursementType === _Disbursement.Types.Credit;
      }
    };
    Disbursement.initClass();
    module2.exports = { Disbursement };
  }
});

// node_modules/braintree/lib/braintree/granted_payment_instrument_update.js
var require_granted_payment_instrument_update = __commonJS({
  "node_modules/braintree/lib/braintree/granted_payment_instrument_update.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var PaymentMethodNonce = require_payment_method_nonce().PaymentMethodNonce;
    var GrantedPaymentInstrumentUpdate = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
        if (attributes.paymentMethodNonce) {
          this.paymentMethodNonce = new PaymentMethodNonce(
            attributes.paymentMethodNonce
          );
        }
      }
    };
    module2.exports = {
      GrantedPaymentInstrumentUpdate
    };
  }
});

// node_modules/braintree/lib/braintree/local_payment_completed.js
var require_local_payment_completed = __commonJS({
  "node_modules/braintree/lib/braintree/local_payment_completed.js"(exports2, module2) {
    "use strict";
    var Transaction = require_transaction().Transaction;
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var LocalPaymentCompleted = class extends AttributeSetter {
      constructor(attributes, gateway2) {
        super(attributes);
        if (attributes.transaction) {
          this.transaction = new Transaction(attributes.transaction, gateway2);
        }
      }
    };
    module2.exports = { LocalPaymentCompleted };
  }
});

// node_modules/braintree/lib/braintree/local_payment_expired.js
var require_local_payment_expired = __commonJS({
  "node_modules/braintree/lib/braintree/local_payment_expired.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var LocalPaymentExpired = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
      }
    };
    module2.exports = { LocalPaymentExpired };
  }
});

// node_modules/braintree/lib/braintree/local_payment_funded.js
var require_local_payment_funded = __commonJS({
  "node_modules/braintree/lib/braintree/local_payment_funded.js"(exports2, module2) {
    "use strict";
    var Transaction = require_transaction().Transaction;
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var LocalPaymentFunded = class extends AttributeSetter {
      constructor(attributes, gateway2) {
        super(attributes);
        if (attributes.transaction) {
          this.transaction = new Transaction(attributes.transaction, gateway2);
        }
      }
    };
    module2.exports = { LocalPaymentFunded };
  }
});

// node_modules/braintree/lib/braintree/local_payment_reversed.js
var require_local_payment_reversed = __commonJS({
  "node_modules/braintree/lib/braintree/local_payment_reversed.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var LocalPaymentReversed = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
      }
    };
    module2.exports = { LocalPaymentReversed };
  }
});

// node_modules/braintree/lib/braintree/oauth_access_revocation.js
var require_oauth_access_revocation = __commonJS({
  "node_modules/braintree/lib/braintree/oauth_access_revocation.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var OAuthAccessRevocation = class extends AttributeSetter {
    };
    module2.exports = { OAuthAccessRevocation };
  }
});

// node_modules/braintree/lib/braintree/partner_merchant.js
var require_partner_merchant = __commonJS({
  "node_modules/braintree/lib/braintree/partner_merchant.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var PartnerMerchant = class extends AttributeSetter {
    };
    module2.exports = { PartnerMerchant };
  }
});

// node_modules/braintree/lib/braintree/venmo_profile_data.js
var require_venmo_profile_data = __commonJS({
  "node_modules/braintree/lib/braintree/venmo_profile_data.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var VenmoProfileData = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
      }
    };
    module2.exports = { VenmoProfileData };
  }
});

// node_modules/braintree/lib/braintree/enriched_customer_data.js
var require_enriched_customer_data = __commonJS({
  "node_modules/braintree/lib/braintree/enriched_customer_data.js"(exports2, module2) {
    "use strict";
    var VenmoProfileData = require_venmo_profile_data().VenmoProfileData;
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var EnrichedCustomerData = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
        this.profileData = new VenmoProfileData(attributes.profileData);
      }
    };
    module2.exports = { EnrichedCustomerData };
  }
});

// node_modules/braintree/lib/braintree/payment_method_customer_data_updated_metadata.js
var require_payment_method_customer_data_updated_metadata = __commonJS({
  "node_modules/braintree/lib/braintree/payment_method_customer_data_updated_metadata.js"(exports2, module2) {
    "use strict";
    var EnrichedCustomerData = require_enriched_customer_data().EnrichedCustomerData;
    var PaymentMethodParser = require_payment_method_parser().PaymentMethodParser;
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var PaymentMethodCustomerDataUpdatedMetadata = class extends AttributeSetter {
      constructor(attributes) {
        super(attributes);
        this.paymentMethod = PaymentMethodParser.parsePaymentMethod(
          attributes.paymentMethod
        );
        if (attributes.enrichedCustomerData) {
          this.enrichedCustomerData = new EnrichedCustomerData(
            attributes.enrichedCustomerData
          );
        }
      }
    };
    module2.exports = {
      PaymentMethodCustomerDataUpdatedMetadata
    };
  }
});

// node_modules/braintree/lib/braintree/revoked_payment_method_metadata.js
var require_revoked_payment_method_metadata = __commonJS({
  "node_modules/braintree/lib/braintree/revoked_payment_method_metadata.js"(exports2, module2) {
    "use strict";
    var PaymentMethodParser = require_payment_method_parser().PaymentMethodParser;
    var RevokedPaymentMethodMetadata = class {
      constructor(attributes) {
        this.revokedPaymentMethod = PaymentMethodParser.parsePaymentMethod(attributes);
        this.customerId = this.revokedPaymentMethod.customerId;
        this.token = this.revokedPaymentMethod.token;
      }
    };
    module2.exports = { RevokedPaymentMethodMetadata };
  }
});

// node_modules/braintree/lib/braintree/transaction_review.js
var require_transaction_review = __commonJS({
  "node_modules/braintree/lib/braintree/transaction_review.js"(exports2, module2) {
    "use strict";
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var TransactionReview = class extends AttributeSetter {
    };
    module2.exports = { TransactionReview };
  }
});

// node_modules/braintree/lib/braintree/webhook_notification.js
var require_webhook_notification = __commonJS({
  "node_modules/braintree/lib/braintree/webhook_notification.js"(exports2, module2) {
    "use strict";
    var AccountUpdaterDailyReport = require_account_updater_daily_report().AccountUpdaterDailyReport;
    var AttributeSetter = require_attribute_setter().AttributeSetter;
    var ConnectedMerchantPayPalStatusChanged = require_connected_merchant_paypal_status_changed().ConnectedMerchantPayPalStatusChanged;
    var ConnectedMerchantStatusTransitioned = require_connected_merchant_status_transitioned().ConnectedMerchantStatusTransitioned;
    var Disbursement = require_disbursement().Disbursement;
    var Dispute = require_dispute().Dispute;
    var GrantedPaymentInstrumentUpdate = require_granted_payment_instrument_update().GrantedPaymentInstrumentUpdate;
    var LocalPaymentCompleted = require_local_payment_completed().LocalPaymentCompleted;
    var LocalPaymentExpired = require_local_payment_expired().LocalPaymentExpired;
    var LocalPaymentFunded = require_local_payment_funded().LocalPaymentFunded;
    var LocalPaymentReversed = require_local_payment_reversed().LocalPaymentReversed;
    var MerchantAccount = require_merchant_account().MerchantAccount;
    var OAuthAccessRevocation = require_oauth_access_revocation().OAuthAccessRevocation;
    var PartnerMerchant = require_partner_merchant().PartnerMerchant;
    var PaymentMethodCustomerDataUpdatedMetadata = require_payment_method_customer_data_updated_metadata().PaymentMethodCustomerDataUpdatedMetadata;
    var RevokedPaymentMethodMetadata = require_revoked_payment_method_metadata().RevokedPaymentMethodMetadata;
    var Subscription = require_subscription().Subscription;
    var Transaction = require_transaction().Transaction;
    var TransactionReview = require_transaction_review().TransactionReview;
    var ValidationErrorsCollection = require_validation_errors_collection().ValidationErrorsCollection;
    var Kind = {
      AccountUpdaterDailyReport: "account_updater_daily_report",
      Check: "check",
      ConnectedMerchantPayPalStatusChanged: "connected_merchant_paypal_status_changed",
      ConnectedMerchantStatusTransitioned: "connected_merchant_status_transitioned",
      Disbursement: "disbursement",
      DisbursementException: "disbursement_exception",
      DisputeUnderReview: "dispute_under_review",
      DisputeOpened: "dispute_opened",
      DisputeLost: "dispute_lost",
      DisputeWon: "dispute_won",
      DisputeAccepted: "dispute_accepted",
      DisputeAutoAccepted: "dispute_auto_accepted",
      DisputeDisputed: "dispute_disputed",
      DisputeExpired: "dispute_expired",
      GrantorUpdatedGrantedPaymentMethod: "grantor_updated_granted_payment_method",
      GrantedPaymentInstrumentUpdate: "granted_payment_instrument_update",
      GrantedPaymentMethodRevoked: "granted_payment_method_revoked",
      LocalPaymentCompleted: "local_payment_completed",
      LocalPaymentExpired: "local_payment_expired",
      LocalPaymentFunded: "local_payment_funded",
      LocalPaymentReversed: "local_payment_reversed",
      PartnerMerchantConnected: "partner_merchant_connected",
      PartnerMerchantDisconnected: "partner_merchant_disconnected",
      PartnerMerchantDeclined: "partner_merchant_declined",
      PaymentMethodCustomerDataUpdated: "payment_method_customer_data_updated",
      PaymentMethodRevokedByCustomer: "payment_method_revoked_by_customer",
      OAuthAccessRevoked: "oauth_access_revoked",
      RecipientUpdatedGrantedPaymentMethod: "recipient_updated_granted_payment_method",
      RefundFailed: "refund_failed",
      SubscriptionBillingSkipped: "subscription_billing_skipped",
      SubscriptionCanceled: "subscription_canceled",
      SubscriptionChargedSuccessfully: "subscription_charged_successfully",
      SubscriptionChargedUnsuccessfully: "subscription_charged_unsuccessfully",
      SubscriptionExpired: "subscription_expired",
      SubscriptionTrialEnded: "subscription_trial_ended",
      SubscriptionWentActive: "subscription_went_active",
      SubscriptionWentPastDue: "subscription_went_past_due",
      SubMerchantAccountApproved: "sub_merchant_account_approved",
      SubMerchantAccountDeclined: "sub_merchant_account_declined",
      TransactionDisbursed: "transaction_disbursed",
      TransactionReviewed: "transaction_reviewed",
      TransactionSettled: "transaction_settled",
      TransactionSettlementDeclined: "transaction_settlement_declined"
    };
    var WebhookNotification = class extends AttributeSetter {
      static initClass() {
        this.Kind = Kind;
      }
      // eslint-disable-next-line complexity
      constructor(attributes, gateway2) {
        super(attributes, gateway2);
        let wrapperNode;
        if (attributes.subject.apiErrorResponse != null) {
          wrapperNode = attributes.subject.apiErrorResponse;
        } else {
          wrapperNode = attributes.subject;
        }
        if (wrapperNode.subscription != null) {
          this.subscription = new Subscription(wrapperNode.subscription, gateway2);
        }
        if (wrapperNode.merchantAccount != null) {
          this.merchantAccount = new MerchantAccount(wrapperNode.merchantAccount);
        }
        if (wrapperNode.disbursement != null) {
          this.disbursement = new Disbursement(wrapperNode.disbursement);
        }
        if (wrapperNode.transaction != null) {
          this.transaction = new Transaction(wrapperNode.transaction, gateway2);
        }
        if (wrapperNode.transactionReview != null) {
          this.transactionReview = new TransactionReview(
            wrapperNode.transactionReview
          );
        }
        if (wrapperNode.partnerMerchant != null) {
          this.partnerMerchant = new PartnerMerchant(wrapperNode.partnerMerchant);
        }
        if (wrapperNode.oauthApplicationRevocation != null) {
          this.oauthAccessRevocation = new OAuthAccessRevocation(
            wrapperNode.oauthApplicationRevocation
          );
        }
        if (wrapperNode.connectedMerchantStatusTransitioned != null) {
          this.connectedMerchantStatusTransitioned = new ConnectedMerchantStatusTransitioned(
            wrapperNode.connectedMerchantStatusTransitioned
          );
        }
        if (wrapperNode.connectedMerchantPaypalStatusChanged != null) {
          this.connectedMerchantPayPalStatusChanged = new ConnectedMerchantPayPalStatusChanged(
            wrapperNode.connectedMerchantPaypalStatusChanged
          );
        }
        if (wrapperNode.dispute != null) {
          this.dispute = new Dispute(wrapperNode.dispute);
        }
        if (wrapperNode.accountUpdaterDailyReport != null) {
          this.accountUpdaterDailyReport = new AccountUpdaterDailyReport(
            wrapperNode.accountUpdaterDailyReport
          );
        }
        if (wrapperNode.grantedPaymentInstrumentUpdate != null && [
          Kind.GrantorUpdatedGrantedPaymentMethod,
          Kind.RecipientUpdatedGrantedPaymentMethod
        ].indexOf(attributes.kind) !== -1) {
          this.grantedPaymentInstrumentUpdate = new GrantedPaymentInstrumentUpdate(
            wrapperNode.grantedPaymentInstrumentUpdate
          );
        }
        if ([
          Kind.GrantedPaymentMethodRevoked,
          Kind.PaymentMethodRevokedByCustomer
        ].indexOf(attributes.kind) !== -1) {
          this.revokedPaymentMethodMetadata = new RevokedPaymentMethodMetadata(
            wrapperNode
          );
        }
        if (wrapperNode.localPayment != null && Kind.LocalPaymentCompleted === attributes.kind) {
          this.localPaymentCompleted = new LocalPaymentCompleted(
            wrapperNode.localPayment,
            gateway2
          );
        }
        if (wrapperNode.localPaymentExpired != null && Kind.LocalPaymentExpired === attributes.kind) {
          this.localPaymentExpired = new LocalPaymentExpired(
            wrapperNode.localPaymentExpired,
            gateway2
          );
        }
        if (wrapperNode.localPaymentFunded != null && Kind.LocalPaymentFunded === attributes.kind) {
          this.localPaymentFunded = new LocalPaymentFunded(
            wrapperNode.localPaymentFunded,
            gateway2
          );
        }
        if (wrapperNode.localPaymentReversed != null && Kind.LocalPaymentReversed === attributes.kind) {
          this.localPaymentReversed = new LocalPaymentReversed(
            wrapperNode.localPaymentReversed,
            gateway2
          );
        }
        if (wrapperNode.paymentMethodCustomerDataUpdatedMetadata != null && Kind.PaymentMethodCustomerDataUpdated === attributes.kind) {
          this.paymentMethodCustomerDataUpdatedMetadata = new PaymentMethodCustomerDataUpdatedMetadata(
            wrapperNode.paymentMethodCustomerDataUpdatedMetadata
          );
        }
        if (wrapperNode.errors != null) {
          this.errors = new ValidationErrorsCollection(wrapperNode.errors);
          this.message = wrapperNode.message;
        }
      }
    };
    WebhookNotification.initClass();
    module2.exports = { WebhookNotification };
  }
});

// node_modules/braintree/lib/braintree/webhook_notification_gateway.js
var require_webhook_notification_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/webhook_notification_gateway.js"(exports2, module2) {
    "use strict";
    var xml2js = require_xml2js();
    var Digest = require_digest().Digest;
    var Gateway = require_gateway().Gateway;
    var exceptions = require_exceptions();
    var Util = require_util().Util;
    var WebhookNotification = require_webhook_notification().WebhookNotification;
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var WebhookNotificationGateway = class extends Gateway {
      constructor(gateway2) {
        super();
        this.gateway = gateway2;
        this.config = this.gateway.config;
      }
      parse(signature, payload) {
        if (!signature) {
          return Promise.reject(
            exceptions.InvalidSignatureError("signature parameter is required")
          );
        }
        if (!payload) {
          return Promise.reject(
            exceptions.InvalidSignatureError("payload parameter is required")
          );
        }
        if (payload.match(/[^A-Za-z0-9+=\/\n]/)) {
          return Promise.reject(
            exceptions.InvalidSignatureError("payload contains illegal characters")
          );
        }
        let err = this.validateSignature(signature, payload);
        if (err) {
          return Promise.reject(err);
        }
        const xmlPayload = Buffer.from(payload, "base64").toString("utf8");
        return xml2js.parseStringPromise(xmlPayload, {
          attrkey: "@",
          charkey: "#",
          explicitArray: false
        }).then((result) => {
          const attributes = Util.convertNodeToObject(result);
          const handler = this.createResponseHandler(
            "notification",
            WebhookNotification
          );
          return handler(attributes);
        }).then((responseHandlerResponse) => {
          return responseHandlerResponse.notification;
        });
      }
      validateSignature(signatureString, payload) {
        let signaturePairs = signatureString.split("&").filter((pair) => pair.indexOf("|") !== -1).map((pair) => pair.split("|"));
        let signature = this.matchingSignature(signaturePairs);
        if (!signature) {
          return exceptions.InvalidSignatureError("no matching public key");
        }
        let self = this;
        const matches = [payload, `${payload}
`].some(
          (data) => Digest.secureCompare(
            signature,
            Digest.Sha1hexdigest(self.gateway.config.privateKey, data)
          )
        );
        if (!matches) {
          return exceptions.InvalidSignatureError(
            "signature does not match payload - one has been modified"
          );
        }
        return null;
      }
      verify(challenge, callback) {
        if (!challenge.match(/^[a-f0-9]{20,32}$/)) {
          if (callback != null) {
            callback(
              exceptions.InvalidChallengeError(
                "challenge contains non-hex characters"
              ),
              null
            );
            return;
          }
          throw exceptions.InvalidChallengeError(
            "challenge contains non-hex characters"
          );
        }
        let digest = Digest.Sha1hexdigest(
          this.gateway.config.privateKey,
          challenge
        );
        return `${this.gateway.config.publicKey}|${digest}`;
      }
      matchingSignature(signaturePairs) {
        for (let keyPair of signaturePairs) {
          let publicKey = keyPair[0];
          let signature = keyPair[1];
          if (this.gateway.config.publicKey === publicKey) {
            return signature;
          }
        }
        return null;
      }
    };
    module2.exports = {
      WebhookNotificationGateway: wrapPrototype(WebhookNotificationGateway, {
        ignoreMethods: ["verify"]
      })
    };
  }
});

// node_modules/dateformat/lib/dateformat.js
var require_dateformat = __commonJS({
  "node_modules/dateformat/lib/dateformat.js"(exports2, module2) {
    "use strict";
    function _typeof(obj) {
      "@babel/helpers - typeof";
      if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
        _typeof = function _typeof2(obj2) {
          return typeof obj2;
        };
      } else {
        _typeof = function _typeof2(obj2) {
          return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
        };
      }
      return _typeof(obj);
    }
    (function(global) {
      var _arguments = arguments;
      var dateFormat = /* @__PURE__ */ function() {
        var token = /d{1,4}|D{3,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|W{1,2}|[LlopSZN]|"[^"]*"|'[^']*'/g;
        var timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
        var timezoneClip = /[^-+\dA-Z]/g;
        return function(date, mask, utc, gmt) {
          if (_arguments.length === 1 && kindOf(date) === "string" && !/\d/.test(date)) {
            mask = date;
            date = void 0;
          }
          date = date || date === 0 ? date : /* @__PURE__ */ new Date();
          if (!(date instanceof Date)) {
            date = new Date(date);
          }
          if (isNaN(date)) {
            throw TypeError("Invalid date");
          }
          mask = String(dateFormat.masks[mask] || mask || dateFormat.masks["default"]);
          var maskSlice = mask.slice(0, 4);
          if (maskSlice === "UTC:" || maskSlice === "GMT:") {
            mask = mask.slice(4);
            utc = true;
            if (maskSlice === "GMT:") {
              gmt = true;
            }
          }
          var _ = function _2() {
            return utc ? "getUTC" : "get";
          };
          var _d = function d() {
            return date[_() + "Date"]();
          };
          var D = function D2() {
            return date[_() + "Day"]();
          };
          var _m = function m() {
            return date[_() + "Month"]();
          };
          var y = function y2() {
            return date[_() + "FullYear"]();
          };
          var _H = function H() {
            return date[_() + "Hours"]();
          };
          var _M = function M() {
            return date[_() + "Minutes"]();
          };
          var _s = function s() {
            return date[_() + "Seconds"]();
          };
          var _L = function L() {
            return date[_() + "Milliseconds"]();
          };
          var _o = function o() {
            return utc ? 0 : date.getTimezoneOffset();
          };
          var _W = function W() {
            return getWeek(date);
          };
          var _N = function N() {
            return getDayOfWeek(date);
          };
          var flags = { d: function d() {
            return _d();
          }, dd: function dd() {
            return pad(_d());
          }, ddd: function ddd() {
            return dateFormat.i18n.dayNames[D()];
          }, DDD: function DDD() {
            return getDayName({ y: y(), m: _m(), d: _d(), _: _(), dayName: dateFormat.i18n.dayNames[D()], short: true });
          }, dddd: function dddd() {
            return dateFormat.i18n.dayNames[D() + 7];
          }, DDDD: function DDDD() {
            return getDayName({ y: y(), m: _m(), d: _d(), _: _(), dayName: dateFormat.i18n.dayNames[D() + 7] });
          }, m: function m() {
            return _m() + 1;
          }, mm: function mm() {
            return pad(_m() + 1);
          }, mmm: function mmm() {
            return dateFormat.i18n.monthNames[_m()];
          }, mmmm: function mmmm() {
            return dateFormat.i18n.monthNames[_m() + 12];
          }, yy: function yy() {
            return String(y()).slice(2);
          }, yyyy: function yyyy() {
            return pad(y(), 4);
          }, h: function h() {
            return _H() % 12 || 12;
          }, hh: function hh() {
            return pad(_H() % 12 || 12);
          }, H: function H() {
            return _H();
          }, HH: function HH() {
            return pad(_H());
          }, M: function M() {
            return _M();
          }, MM: function MM() {
            return pad(_M());
          }, s: function s() {
            return _s();
          }, ss: function ss() {
            return pad(_s());
          }, l: function l() {
            return pad(_L(), 3);
          }, L: function L() {
            return pad(Math.floor(_L() / 10));
          }, t: function t() {
            return _H() < 12 ? dateFormat.i18n.timeNames[0] : dateFormat.i18n.timeNames[1];
          }, tt: function tt() {
            return _H() < 12 ? dateFormat.i18n.timeNames[2] : dateFormat.i18n.timeNames[3];
          }, T: function T() {
            return _H() < 12 ? dateFormat.i18n.timeNames[4] : dateFormat.i18n.timeNames[5];
          }, TT: function TT() {
            return _H() < 12 ? dateFormat.i18n.timeNames[6] : dateFormat.i18n.timeNames[7];
          }, Z: function Z() {
            return gmt ? "GMT" : utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, "").replace(/GMT\+0000/g, "UTC");
          }, o: function o() {
            return (_o() > 0 ? "-" : "+") + pad(Math.floor(Math.abs(_o()) / 60) * 100 + Math.abs(_o()) % 60, 4);
          }, p: function p() {
            return (_o() > 0 ? "-" : "+") + pad(Math.floor(Math.abs(_o()) / 60), 2) + ":" + pad(Math.floor(Math.abs(_o()) % 60), 2);
          }, S: function S() {
            return ["th", "st", "nd", "rd"][_d() % 10 > 3 ? 0 : (_d() % 100 - _d() % 10 != 10) * _d() % 10];
          }, W: function W() {
            return _W();
          }, WW: function WW() {
            return pad(_W());
          }, N: function N() {
            return _N();
          } };
          return mask.replace(token, function(match) {
            if (match in flags) {
              return flags[match]();
            }
            return match.slice(1, match.length - 1);
          });
        };
      }();
      dateFormat.masks = { default: "ddd mmm dd yyyy HH:MM:ss", shortDate: "m/d/yy", paddedShortDate: "mm/dd/yyyy", mediumDate: "mmm d, yyyy", longDate: "mmmm d, yyyy", fullDate: "dddd, mmmm d, yyyy", shortTime: "h:MM TT", mediumTime: "h:MM:ss TT", longTime: "h:MM:ss TT Z", isoDate: "yyyy-mm-dd", isoTime: "HH:MM:ss", isoDateTime: "yyyy-mm-dd'T'HH:MM:sso", isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'", expiresHeaderFormat: "ddd, dd mmm yyyy HH:MM:ss Z" };
      dateFormat.i18n = { dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], timeNames: ["a", "p", "am", "pm", "A", "P", "AM", "PM"] };
      var pad = function pad2(val, len) {
        val = String(val);
        len = len || 2;
        while (val.length < len) {
          val = "0" + val;
        }
        return val;
      };
      var getDayName = function getDayName2(_ref) {
        var y = _ref.y, m = _ref.m, d = _ref.d, _ = _ref._, dayName = _ref.dayName, _ref$short = _ref["short"], _short = _ref$short === void 0 ? false : _ref$short;
        var today = /* @__PURE__ */ new Date();
        var yesterday = /* @__PURE__ */ new Date();
        yesterday.setDate(yesterday[_ + "Date"]() - 1);
        var tomorrow = /* @__PURE__ */ new Date();
        tomorrow.setDate(tomorrow[_ + "Date"]() + 1);
        var today_d = function today_d2() {
          return today[_ + "Date"]();
        };
        var today_m = function today_m2() {
          return today[_ + "Month"]();
        };
        var today_y = function today_y2() {
          return today[_ + "FullYear"]();
        };
        var yesterday_d = function yesterday_d2() {
          return yesterday[_ + "Date"]();
        };
        var yesterday_m = function yesterday_m2() {
          return yesterday[_ + "Month"]();
        };
        var yesterday_y = function yesterday_y2() {
          return yesterday[_ + "FullYear"]();
        };
        var tomorrow_d = function tomorrow_d2() {
          return tomorrow[_ + "Date"]();
        };
        var tomorrow_m = function tomorrow_m2() {
          return tomorrow[_ + "Month"]();
        };
        var tomorrow_y = function tomorrow_y2() {
          return tomorrow[_ + "FullYear"]();
        };
        if (today_y() === y && today_m() === m && today_d() === d) {
          return _short ? "Tdy" : "Today";
        } else if (yesterday_y() === y && yesterday_m() === m && yesterday_d() === d) {
          return _short ? "Ysd" : "Yesterday";
        } else if (tomorrow_y() === y && tomorrow_m() === m && tomorrow_d() === d) {
          return _short ? "Tmw" : "Tomorrow";
        }
        return dayName;
      };
      var getWeek = function getWeek2(date) {
        var targetThursday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        targetThursday.setDate(targetThursday.getDate() - (targetThursday.getDay() + 6) % 7 + 3);
        var firstThursday = new Date(targetThursday.getFullYear(), 0, 4);
        firstThursday.setDate(firstThursday.getDate() - (firstThursday.getDay() + 6) % 7 + 3);
        var ds = targetThursday.getTimezoneOffset() - firstThursday.getTimezoneOffset();
        targetThursday.setHours(targetThursday.getHours() - ds);
        var weekDiff = (targetThursday - firstThursday) / (864e5 * 7);
        return 1 + Math.floor(weekDiff);
      };
      var getDayOfWeek = function getDayOfWeek2(date) {
        var dow = date.getDay();
        if (dow === 0) {
          dow = 7;
        }
        return dow;
      };
      var kindOf = function kindOf2(val) {
        if (val === null) {
          return "null";
        }
        if (val === void 0) {
          return "undefined";
        }
        if (_typeof(val) !== "object") {
          return _typeof(val);
        }
        if (Array.isArray(val)) {
          return "array";
        }
        return {}.toString.call(val).slice(8, -1).toLowerCase();
      };
      if (typeof define === "function" && define.amd) {
        define(function() {
          return dateFormat;
        });
      } else if ((typeof exports2 === "undefined" ? "undefined" : _typeof(exports2)) === "object") {
        module2.exports = dateFormat;
      } else {
        global.dateFormat = dateFormat;
      }
    })(void 0);
  }
});

// node_modules/braintree/lib/braintree/webhook_testing_gateway.js
var require_webhook_testing_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/webhook_testing_gateway.js"(exports2, module2) {
    "use strict";
    var Buffer2 = require("buffer").Buffer;
    var Digest = require_digest().Digest;
    var Gateway = require_gateway().Gateway;
    var WebhookNotification = require_webhook_notification().WebhookNotification;
    var dateFormat = require_dateformat();
    var wrapPrototype = require_wrap_promise().wrapPrototype;
    var WebhookTestingGateway = class extends Gateway {
      constructor(gateway2) {
        super();
        this.gateway = gateway2;
        this.config = this.gateway.config;
      }
      sampleNotification(kind, id, sourceMerchantId) {
        const xml = this.sampleXml(kind, id, sourceMerchantId);
        const payload = Buffer2.from(xml).toString("base64") + "\n";
        const signature = this.sampleSignature(payload);
        return {
          bt_signature: signature,
          // eslint-disable-line camelcase
          bt_payload: payload
          // eslint-disable-line camelcase
        };
      }
      sampleSignature(payload) {
        return `${this.gateway.config.publicKey}|${Digest.Sha1hexdigest(
          this.gateway.config.privateKey,
          payload
        )}`;
      }
      sampleXml(kind, id, sourceMerchantId) {
        let sourceMerchantIdXml = "";
        if (sourceMerchantId) {
          sourceMerchantIdXml = `<source-merchant-id>${sourceMerchantId}</source-merchant-id>`;
        }
        return `<notification>
    <timestamp type="datetime">${dateFormat(
          /* @__PURE__ */ new Date(),
          dateFormat.masks.isoUtcDateTime,
          true
        )}</timestamp>
    <kind>${kind}</kind>
    ${sourceMerchantIdXml}
    <subject>${this.subjectXmlFor(kind, id)}</subject>
</notification>`;
      }
      // eslint-disable-next-line complexity
      subjectXmlFor(kind, id) {
        switch (kind) {
          case WebhookNotification.Kind.AccountUpdaterDailyReport:
            return this.subjectXmlForAccountUpdaterDailyReport();
          case WebhookNotification.Kind.Check:
            return this.subjectXmlForCheck();
          case WebhookNotification.Kind.ConnectedMerchantPayPalStatusChanged:
            return this.subjectXmlForConnectedMerchantPayPalStatusChanged(id);
          case WebhookNotification.Kind.ConnectedMerchantStatusTransitioned:
            return this.subjectXmlForConnectedMerchantStatusTransitioned(id);
          case WebhookNotification.Kind.Disbursement:
            return this.subjectXmlForDisbursement(id);
          case WebhookNotification.Kind.DisbursementException:
            return this.subjectXmlForDisbursementException(id);
          case WebhookNotification.Kind.DisputeAccepted:
            return this.subjectXmlForDisputeAccepted(id);
          case WebhookNotification.Kind.DisputeAutoAccepted:
            return this.subjectXmlForDisputeAutoAccepted(id);
          case WebhookNotification.Kind.DisputeDisputed:
            return this.subjectXmlForDisputeDisputed(id);
          case WebhookNotification.Kind.DisputeExpired:
            return this.subjectXmlForDisputeExpired(id);
          case WebhookNotification.Kind.DisputeLost:
            return this.subjectXmlForDisputeLost(id);
          case WebhookNotification.Kind.DisputeOpened:
            return this.subjectXmlForDisputeOpened(id);
          case WebhookNotification.Kind.DisputeUnderReview:
            return this.subjectXmlForDisputeUnderReview(id);
          case WebhookNotification.Kind.DisputeWon:
            return this.subjectXmlForDisputeWon(id);
          case WebhookNotification.Kind.GrantedPaymentMethodRevoked:
            return this.subjectXmlForGrantedPaymentMethodRevoked(id);
          case WebhookNotification.Kind.GrantorUpdatedGrantedPaymentMethod:
            return this.subjectXmlForGrantedPaymentInstrumentUpdate();
          case WebhookNotification.Kind.LocalPaymentCompleted:
            return this.subjectXmlForLocalPaymentCompleted(id);
          case WebhookNotification.Kind.LocalPaymentExpired:
            return this.subjectXmlForLocalPaymentExpired(id);
          case WebhookNotification.Kind.LocalPaymentFunded:
            return this.subjectXmlForLocalPaymentFunded(id);
          case WebhookNotification.Kind.LocalPaymentReversed:
            return this.subjectXmlForLocalPaymentReversed(id);
          case WebhookNotification.Kind.OAuthAccessRevoked:
            return this.subjectXmlForOAuthAccessRevocation(id);
          case WebhookNotification.Kind.PartnerMerchantConnected:
            return this.subjectXmlForPartnerMerchantConnected();
          case WebhookNotification.Kind.PartnerMerchantDeclined:
            return this.subjectXmlForPartnerMerchantDeclined();
          case WebhookNotification.Kind.PartnerMerchantDisconnected:
            return this.subjectXmlForPartnerMerchantDisconnected();
          case WebhookNotification.Kind.PaymentMethodCustomerDataUpdated:
            return this.subjectXmlForPaymentMethodCustomerDataUpdated(id);
          case WebhookNotification.Kind.PaymentMethodRevokedByCustomer:
            return this.subjectXmlForPaymentMethodRevokedByCustomer(id);
          case WebhookNotification.Kind.RecipientUpdatedGrantedPaymentMethod:
            return this.subjectXmlForGrantedPaymentInstrumentUpdate();
          case WebhookNotification.Kind.RefundFailed:
            return this.subjectXmlForRefundFailed(id);
          case WebhookNotification.Kind.SubMerchantAccountApproved:
            return this.subjectXmlForSubMerchantAccountApproved(id);
          case WebhookNotification.Kind.SubMerchantAccountDeclined:
            return this.subjectXmlForSubMerchantAccountDeclined(id);
          case WebhookNotification.Kind.SubscriptionBillingSkipped:
            return this.subjectXmlForSubscriptionBillingSkipped(id);
          case WebhookNotification.Kind.SubscriptionChargedSuccessfully:
            return this.subjectXmlForSubscriptionChargedSuccessfully(id);
          case WebhookNotification.Kind.SubscriptionChargedUnsuccessfully:
            return this.subjectXmlForSubscriptionChargedUnsuccessfully(id);
          case WebhookNotification.Kind.TransactionDisbursed:
            return this.subjectXmlForTransactionDisbursed(id);
          case WebhookNotification.Kind.TransactionReviewed:
            return this.subjectXmlForTransactionReviewed(id);
          case WebhookNotification.Kind.TransactionSettled:
            return this.subjectXmlForTransactionSettled(id);
          case WebhookNotification.Kind.TransactionSettlementDeclined:
            return this.subjectXmlForTransactionSettlementDeclined(id);
          default:
            return this.subjectXmlForSubscription(id);
        }
      }
      subjectXmlForAccountUpdaterDailyReport() {
        return `<account-updater-daily-report>
  <report-date type="date">2016-01-14</report-date>
  <report-url>link-to-csv-report</report-url>
</account-updater-daily-report>`;
      }
      subjectXmlForCheck() {
        return '<check type="boolean">true</check>';
      }
      subjectXmlForTransactionDisbursed(id) {
        return `<transaction>
  <id>${id}</id>
  <amount>100</amount>
  <disbursement-details>
    <disbursement-date type="datetime">2013-07-09T18:23:29Z</disbursement-date>
  </disbursement-details>
</transaction>`;
      }
      subjectXmlForTransactionReviewed(id) {
        return `<transaction-review>
  <transaction-id>${id}</transaction-id>
  <decision>a smart decision</decision>
  <reviewer-email>hey@girl.com</reviewer-email>
  <reviewer-note>I reviewed this</reviewer-note>
  <reviewed-time type="datetime">2021-04-20T06:09:00Z</reviewed-time>
</transaction-review>`;
      }
      subjectXmlForTransactionSettled(id) {
        return `<transaction>
  <id>${id}</id>
  <status>settled</status>
  <type>sale</type>
  <currency-iso-code>USD</currency-iso-code>
  <amount>100</amount>
  <merchant-account-id>ogaotkivejpfayqfeaimuktty</merchant-account-id>
  <payment-instrument-type>us_bank_account</payment-instrument-type>
  <us-bank-account>
    <routing-number>123456789</routing-number>
    <last-4>1234</last-4>
    <account-type>checking</account-type>
    <account-holder-name>Dan Schulman</account-holder-name>
  </us-bank-account>
</transaction>`;
      }
      subjectXmlForTransactionSettlementDeclined(id) {
        return `<transaction>
  <id>${id}</id>
  <status>settlement_declined</status>
  <type>sale</type>
  <currency-iso-code>USD</currency-iso-code>
  <amount>100</amount>
  <merchant-account-id>ogaotkivejpfayqfeaimuktty</merchant-account-id>
  <payment-instrument-type>us_bank_account</payment-instrument-type>
  <us-bank-account>
    <routing-number>123456789</routing-number>
    <last-4>1234</last-4>
    <account-type>checking</account-type>
    <account-holder-name>Dan Schulman</account-holder-name>
  </us-bank-account>
</transaction>`;
      }
      subjectXmlForDisputeUnderReview(id) {
        return `<dispute>
    <amount>250.00</amount>
    <amount-disputed>250.0</amount-disputed>
    <amount-won>245.00</amount-won>
    <currency-iso-code>USD</currency-iso-code>
    <received-date type="date">2014-03-01</received-date>
    <reply-by-date type="date">2014-03-21</reply-by-date>
    <kind>chargeback</kind>
    <status>under_review</status>
    <reason>fraud</reason>
    <id>${id}</id>
    <transaction>
      <id>${id}</id>
      <amount>250.00</amount>
    </transaction>
    <date-opened type="date">2014-03-28</date-opened>
</dispute>`;
      }
      subjectXmlForDisputeOpened(id) {
        return `<dispute>
  <amount>250.00</amount>
  <amount-disputed>250.0</amount-disputed>
  <amount-won>245.00</amount-won>
  <currency-iso-code>USD</currency-iso-code>
  <received-date type="date">2014-03-01</received-date>
  <reply-by-date type="date">2014-03-21</reply-by-date>
  <kind>chargeback</kind>
  <status>open</status>
  <reason>fraud</reason>
  <id>${id}</id>
  <transaction>
    <id>${id}</id>
    <amount>250.00</amount>
  </transaction>
  <date-opened type="date">2014-03-28</date-opened>
</dispute>`;
      }
      subjectXmlForDisputeLost(id) {
        return `<dispute>
  <amount>250.00</amount>
  <amount-disputed>250.0</amount-disputed>
  <amount-won>245.00</amount-won>
  <currency-iso-code>USD</currency-iso-code>
  <received-date type="date">2014-03-01</received-date>
  <reply-by-date type="date">2014-03-21</reply-by-date>
  <kind>chargeback</kind>
  <status>lost</status>
  <reason>fraud</reason>
  <id>${id}</id>
  <transaction>
    <id>${id}</id>
    <amount>250.00</amount>
  </transaction>
  <date-opened type="date">2014-03-28</date-opened>
</dispute>`;
      }
      subjectXmlForDisputeWon(id) {
        return `<dispute>
  <amount>250.00</amount>
  <amount-disputed>250.0</amount-disputed>
  <amount-won>245.00</amount-won>
  <currency-iso-code>USD</currency-iso-code>
  <received-date type="date">2014-03-01</received-date>
  <reply-by-date type="date">2014-03-21</reply-by-date>
  <kind>chargeback</kind>
  <status>won</status>
  <reason>fraud</reason>
  <id>${id}</id>
  <transaction>
    <id>${id}</id>
    <amount>250.00</amount>
  </transaction>
  <date-opened type="date">2014-03-28</date-opened>
  <date-won type="date">2014-09-01</date-won>
</dispute>`;
      }
      subjectXmlForDisputeAccepted(id) {
        return `<dispute>
  <amount>250.00</amount>
  <amount-disputed>250.0</amount-disputed>
  <amount-won>245.00</amount-won>
  <currency-iso-code>USD</currency-iso-code>
  <received-date type="date">2014-03-01</received-date>
  <reply-by-date type="date">2014-03-21</reply-by-date>
  <kind>chargeback</kind>
  <status>accepted</status>
  <reason>fraud</reason>
  <id>${id}</id>
  <transaction>
    <id>${id}</id>
    <amount>250.00</amount>
  </transaction>
  <date-opened type="date">2014-03-28</date-opened>
</dispute>`;
      }
      subjectXmlForDisputeAutoAccepted(id) {
        return `<dispute>
  <amount>250.00</amount>
  <amount-disputed>250.0</amount-disputed>
  <amount-won>245.00</amount-won>
  <currency-iso-code>USD</currency-iso-code>
  <received-date type="date">2014-03-01</received-date>
  <reply-by-date type="date">2014-03-21</reply-by-date>
  <kind>chargeback</kind>
  <status>auto_accepted</status>
  <reason>fraud</reason>
  <id>${id}</id>
  <transaction>
    <id>${id}</id>
    <amount>250.00</amount>
  </transaction>
  <date-opened type="date">2014-03-28</date-opened>
</dispute>`;
      }
      subjectXmlForDisputeDisputed(id) {
        return `<dispute>
  <amount>250.00</amount>
  <amount-disputed>250.0</amount-disputed>
  <amount-won>245.00</amount-won>
  <currency-iso-code>USD</currency-iso-code>
  <received-date type="date">2014-03-01</received-date>
  <reply-by-date type="date">2014-03-21</reply-by-date>
  <kind>chargeback</kind>
  <status>disputed</status>
  <reason>fraud</reason>
  <id>${id}</id>
  <transaction>
    <id>${id}</id>
    <amount>250.00</amount>
  </transaction>
  <date-opened type="date">2014-03-28</date-opened>
</dispute>`;
      }
      subjectXmlForDisputeExpired(id) {
        return `<dispute>
  <amount>250.00</amount>
  <amount-disputed>250.0</amount-disputed>
  <amount-won>245.00</amount-won>
  <currency-iso-code>USD</currency-iso-code>
  <received-date type="date">2014-03-01</received-date>
  <reply-by-date type="date">2014-03-21</reply-by-date>
  <kind>chargeback</kind>
  <status>expired</status>
  <reason>fraud</reason>
  <id>${id}</id>
  <transaction>
    <id>${id}</id>
    <amount>250.00</amount>
  </transaction>
  <date-opened type="date">2014-03-28</date-opened>
</dispute>`;
      }
      subjectXmlForDisbursementException(id) {
        return `<disbursement>
  <id>${id}</id>
  <transaction-ids type="array">
    <item>afv56j</item>
    <item>kj8hjk</item>
  </transaction-ids>
  <success type="boolean">false</success>
  <retry type="boolean">false</retry>
  <merchant-account>
    <id>merchant_account_token</id>
    <currency-iso-code>USD</currency-iso-code>
    <sub-merchant-account type="boolean">false</sub-merchant-account>
    <status>active</status>
  </merchant-account>
  <amount>100.00</amount>
  <disbursement-date type="date">2014-02-10</disbursement-date>
  <exception-message>bank_rejected</exception-message>
  <follow-up-action>update_funding_information</follow-up-action>
</disbursement>`;
      }
      subjectXmlForDisbursement(id) {
        return `<disbursement>
  <id>${id}</id>
  <transaction-ids type="array">
    <item>afv56j</item>
    <item>kj8hjk</item>
  </transaction-ids>
  <success type="boolean">true</success>
  <retry type="boolean">false</retry>
  <merchant-account>
    <id>merchant_account_token</id>
    <currency-iso-code>USD</currency-iso-code>
    <sub-merchant-account type="boolean">false</sub-merchant-account>
    <status>active</status>
  </merchant-account>
  <amount>100.00</amount>
  <disbursement-date type="date">2014-02-10</disbursement-date>
  <exception-message nil="true"/>
  <follow-up-action nil="true"/>
</disbursement>`;
      }
      subjectXmlForGrantedPaymentInstrumentUpdate() {
        return `<granted-payment-instrument-update>
    <grant-owner-merchant-id>vczo7jqrpwrsi2px</grant-owner-merchant-id>
    <grant-recipient-merchant-id>cf0i8wgarszuy6hc</grant-recipient-merchant-id>
    <payment-method-nonce>
      <nonce>ee257d98-de40-47e8-96b3-a6954ea7a9a4</nonce>
      <consumed type="boolean">false</consumed>
      <locked type="boolean">false</locked>
    </payment-method-nonce>
    <token>abc123z</token>
    <updated-fields type="array">
      <item>expiration-month</item>
      <item>expiration-year</item>
    </updated-fields>
  </granted-payment-instrument-update>`;
      }
      subjectXmlForRefundFailed(id) {
        return `<transaction>
  <id>${id}</id>
  <amount>100</amount>
  <credit-card>
    <number>1234560000001234</number>
    <cvv>123</cvv>
    <card-type>MasterCard</card-type>
  </credit-card>
  <status>processor_declined</status>
  <refunded-transaction-fk>1</refunded-transaction-fk>
</transaction>`;
      }
      subjectXmlForSubMerchantAccountApproved(id) {
        return `<merchant_account>
  <id>${id}</id>
</merchant_account>`;
      }
      errorSampleXml() {
        return `<error>
  <code>82621</code>
  <message>Credit score is too low</message>
  <attribute type="symbol">base</attribute>
</error>`;
      }
      subjectXmlForSubMerchantAccountDeclined(id) {
        return `<api-error-response>
  <message>Credit score is too low</message>
  <errors>
    <merchant-account>
      <errors type="array">
        ${this.errorSampleXml()}
      </errors>
    </merchant-account>
  </errors>
  ${this.merchantAccountSampleXml(id)}
</api-error-response>`;
      }
      merchantAccountSampleXml(id) {
        return `<merchant_account>
  <id>${id}</id>
  <master_merchant_account>
    <id>master_ma_for_${id}</id>
    <status>suspended</status>
  </master_merchant_account>
  <status>suspended</status>
</merchant_account>`;
      }
      subjectXmlForSubscription(id) {
        return `<subscription>
    <id>${id}</id>
    <transactions type="array"></transactions>
    <add_ons type="array"></add_ons>
    <discounts type="array"></discounts>
</subscription>`;
      }
      subjectXmlForSubscriptionBillingSkipped(id) {
        return `<subscription>
    <id>${id}</id>
    <transactions type="array"></transactions>
    <add_ons type="array"></add_ons>
    <discounts type="array"></discounts>
</subscription>`;
      }
      subjectXmlForSubscriptionChargedSuccessfully(id) {
        return `<subscription>
    <id>${id}</id>
    <transactions type="array">
      <transaction>
        <id>${id}</id>
        <status>submitted_for_settlement</status>
        <amount>49.99</amount>
      </transaction>
    </transactions>
    <add_ons type="array"></add_ons>
    <discounts type="array"></discounts>
</subscription>`;
      }
      subjectXmlForSubscriptionChargedUnsuccessfully(id) {
        return `<subscription>
    <id>${id}</id>
    <transactions type="array">
      <transaction>
        <id>${id}</id>
        <status>failed</status>
        <amount>49.99</amount>
      </transaction>
    </transactions>
    <add_ons type="array"></add_ons>
    <discounts type="array"></discounts>
</subscription>`;
      }
      subjectXmlForGrantedPaymentMethodRevoked(id) {
        return this._venmoAccountXml(id);
      }
      subjectXmlForPartnerMerchantConnected() {
        return `<partner-merchant>
  <merchant-public-id>public_id</merchant-public-id>
  <public-key>public_key</public-key>
  <private-key>private_key</private-key>
  <partner-merchant-id>abc123</partner-merchant-id>
  <client-side-encryption-key>cse_key</client-side-encryption-key>
</partner-merchant>`;
      }
      subjectXmlForPartnerMerchantDisconnected() {
        return `<partner-merchant>
  <partner-merchant-id>abc123</partner-merchant-id>
</partner-merchant>`;
      }
      subjectXmlForConnectedMerchantStatusTransitioned(id) {
        return `<connected-merchant-status-transitioned>
        <merchant-public-id>${id}</merchant-public-id>
        <status>new_status</status>
        <oauth-application-client-id>oauth_application_client_id</oauth-application-client-id>
      </connected-merchant-status-transitioned>`;
      }
      subjectXmlForConnectedMerchantPayPalStatusChanged(id) {
        return `<connected-merchant-paypal-status-changed>
        <merchant-public-id>${id}</merchant-public-id>
        <action>link</action>
        <oauth-application-client-id>oauth_application_client_id</oauth-application-client-id>
      </connected-merchant-paypal-status-changed>`;
      }
      subjectXmlForPartnerMerchantDeclined() {
        return `<partner-merchant>
  <partner-merchant-id>abc123</partner-merchant-id>
</partner-merchant>`;
      }
      subjectXmlForOAuthAccessRevocation(id) {
        return `<oauth-application-revocation>
      <merchant-id>${id}</merchant-id>
      <oauth-application-client-id>oauth_application_client_id</oauth-application-client-id>
    </oauth-application-revocation>`;
      }
      subjectXmlForPaymentMethodRevokedByCustomer(id) {
        return `<paypal-account>
      <billing-agreement-id>a-billing-agreement-id</billing-agreement-id>
      <created-at type="datetime">2019-01-01T12:00:00Z</created-at>
      <customer-id>a-customer-id</customer-id>
      <default type="boolean">true</default>
      <email>name@email.com</email>
      <global-id>cGF5bWVudG1ldGhvZF9jaDZieXNz</global-id>
      <image-url>https://assets.braintreegateway.com/payment_method_logo/paypal.png?environment=test</image-url>
      <subscriptions type="array"/>
      <token>${id}</token>
      <updated-at type="datetime">2019-01-02T12:00:00Z</updated-at>
      <is-channel-initiated nil="true"/>
      <payer-id>a-payer-id</payer-id>
      <payer-info nil="true"/>
      <limited-use-order-id nil="true"/>
      <revoked-at type="datetime">2019-01-02T12:00:00Z</revoked-at>
    </paypal-account>`;
      }
      subjectXmlForLocalPaymentCompleted(id) {
        if (id === "blik_one_click_id") {
          return this.blikOneClickSubjectXmlForLocalPaymentCompleted();
        }
        return this.defaultSubjectXmlForLocalPaymentCompleted();
      }
      defaultSubjectXmlForLocalPaymentCompleted() {
        return `<local-payment>
      <bic>a-bic</bic>
      <iban-last-chars>1234</iban-last-chars>
      <payer-id>a-payer-id</payer-id>
      <payer-name>a-payer-name</payer-name>
      <payment-id>a-payment-id</payment-id>
      <payment-method-nonce>ee257d98-de40-47e8-96b3-a6954ea7a9a4</payment-method-nonce>
      <transaction>
        <id>1</id>
        <status>authorizing</status>
        <amount>10.00</amount>
        <order-id>order1234</order-id>
      </transaction>
    </local-payment>`;
      }
      blikOneClickSubjectXmlForLocalPaymentCompleted() {
        return `<local-payment>
      <bic>a-bic</bic>
      <blik-aliases type='array'>
        <blik-alias>
          <key>alias-key-1</key>
          <label>alias-label-1</label>
        </blik-alias>
      </blik-aliases>
      <iban-last-chars>1234</iban-last-chars>
      <payer-id>a-payer-id</payer-id>
      <payer-name>a-payer-name</payer-name>
      <payment-id>a-payment-id</payment-id>
      <payment-method-nonce>ee257d98-de40-47e8-96b3-a6954ea7a9a4</payment-method-nonce>
      <transaction>
        <id>1</id>
        <status>authorizing</status>
        <amount>10.00</amount>
        <order-id>order1234</order-id>
      </transaction>
    </local-payment>`;
      }
      subjectXmlForLocalPaymentExpired() {
        return `<local-payment-expired>
      <payment-id>a-payment-id</payment-id>
      <payment-context-id>a-payment-context-id</payment-context-id>
    </local-payment-expired>`;
      }
      subjectXmlForLocalPaymentFunded() {
        return `<local-payment-funded>
      <payment-id>a-payment-id</payment-id>
      <payment-context-id>a-payment-context-id</payment-context-id>
      <transaction>
        <id>1</id>
        <status>settled</status>
        <amount>10.00</amount>
        <order-id>order1234</order-id>
      </transaction>
    </local-payment-funded>`;
      }
      subjectXmlForLocalPaymentReversed() {
        return `<local-payment-reversed>
      <payment-id>a-payment-id</payment-id>
    </local-payment-reversed>`;
      }
      subjectXmlForPaymentMethodCustomerDataUpdated(id) {
        return `<payment-method-customer-data-updated-metadata>
      <token>TOKEN-12345</token>
      <payment-method>
        ${this._venmoAccountXml(id)}
      </payment-method>
      <datetime-updated type='dateTime'>2022-01-01T21:28:37Z</datetime-updated>
      <enriched-customer-data>
        <fields-updated type='array'>
          <item>username</item>
        </fields-updated>
        <profile-data>
          <username>venmo_username</username>
          <first-name>John</first-name>
          <last-name>Doe</last-name>
          <phone-number>1231231234</phone-number>
          <email>john.doe@paypal.com</email>
          <billing-address>
            <street-address>Billing Street Address</street-address>
            <extended-address>Billing Extended Address</extended-address>
            <locality>Locality</locality>
            <region>Region</region>
            <postal-code>Postal Code</postal-code>
          </billing-address>
          <shipping-address>
            <street-address>Shipping Street Address</street-address>
            <extended-address>Shipping Extended Address</extended-address>
            <locality>Locality</locality>
            <region>Region</region>
            <postal-code>Postal Code</postal-code>
          </shipping-address>
        </profile-data>
      </enriched-customer-data>
    </payment-method-customer-data-updated-metadata>`;
      }
      _venmoAccountXml(id) {
        return `<venmo-account>
      <default type="boolean">true</default>
      <image-url>https://assets.braintreegateway.com/payment_method_logo/venmo.png?environment=test</image-url>
      <token>${id}</token>
      <source-description>Venmo Account: venmojoe</source-description>
      <username>venmojoe</username>
      <venmo-user-id>456</venmo-user-id>
      <subscriptions type="array"/>
      <customer-id>venmo_customer_id</customer-id>
      <global-id>cGF5bWVudG1ldGhvZF92ZW5tb2FjY291bnQ</global-id>
    </venmo-account>`;
      }
    };
    module2.exports = {
      WebhookTestingGateway: wrapPrototype(WebhookTestingGateway)
    };
  }
});

// node_modules/braintree/lib/braintree/braintree_gateway.js
var require_braintree_gateway = __commonJS({
  "node_modules/braintree/lib/braintree/braintree_gateway.js"(exports2, module2) {
    "use strict";
    var Http = require_http().Http;
    var Config = require_config().Config;
    var GraphQLClient = require_graphql_client().GraphQLClient;
    var AddOnGateway = require_add_on_gateway().AddOnGateway;
    var AddressGateway = require_address_gateway().AddressGateway;
    var ClientTokenGateway = require_client_token_gateway().ClientTokenGateway;
    var CreditCardGateway = require_credit_card_gateway().CreditCardGateway;
    var CreditCardVerificationGateway = require_credit_card_verification_gateway().CreditCardVerificationGateway;
    var CustomerGateway = require_customer_gateway().CustomerGateway;
    var CustomerSessionGateway = require_customer_session_gateway().CustomerSessionGateway;
    var DisbursementGateway = require_disbursement_gateway().DisbursementGateway;
    var DiscountGateway = require_discount_gateway().DiscountGateway;
    var DisputeGateway = require_dispute_gateway().DisputeGateway;
    var DocumentUploadGateway = require_document_upload_gateway().DocumentUploadGateway;
    var ExchangeRateQuoteGateway = require_exchange_rate_quote_gateway().ExchangeRateQuoteGateway;
    var MerchantAccountGateway = require_merchant_account_gateway().MerchantAccountGateway;
    var MerchantGateway = require_merchant_gateway().MerchantGateway;
    var OAuthGateway = require_oauth_gateway().OAuthGateway;
    var PaymentMethodGateway = require_payment_method_gateway().PaymentMethodGateway;
    var PaymentMethodNonceGateway = require_payment_method_nonce_gateway().PaymentMethodNonceGateway;
    var PayPalAccountGateway = require_paypal_account_gateway().PayPalAccountGateway;
    var PayPalPaymentResourceGateway = require_paypal_payment_resource_gateway().PayPalPaymentResourceGateway;
    var PlanGateway = require_plan_gateway().PlanGateway;
    var SepaDirectDebitAccountGateway = require_sepa_direct_debit_account_gateway().SepaDirectDebitAccountGateway;
    var SettlementBatchSummaryGateway = require_settlement_batch_summary_gateway().SettlementBatchSummaryGateway;
    var SubscriptionGateway = require_subscription_gateway().SubscriptionGateway;
    var TestingGateway = require_testing_gateway().TestingGateway;
    var TransactionGateway = require_transaction_gateway().TransactionGateway;
    var TransactionLineItemGateway = require_transaction_line_item_gateway().TransactionLineItemGateway;
    var UsBankAccountGateway = require_us_bank_account_gateway().UsBankAccountGateway;
    var UsBankAccountVerificationGateway = require_us_bank_account_verification_gateway().UsBankAccountVerificationGateway;
    var WebhookNotificationGateway = require_webhook_notification_gateway().WebhookNotificationGateway;
    var WebhookTestingGateway = require_webhook_testing_gateway().WebhookTestingGateway;
    var BraintreeGateway = class {
      constructor(config) {
        if (this.config instanceof Config) {
          this.config = config;
        } else {
          this.config = new Config(config);
        }
        this.graphQLClient = new GraphQLClient(this.config);
        this.http = new Http(this.config);
        this.addOn = new AddOnGateway(this);
        this.address = new AddressGateway(this);
        this.clientToken = new ClientTokenGateway(this);
        this.creditCard = new CreditCardGateway(this);
        this.creditCardVerification = new CreditCardVerificationGateway(this);
        this.customer = new CustomerGateway(this);
        this.customerSession = new CustomerSessionGateway(this);
        this.disbursement = new DisbursementGateway(this);
        this.discount = new DiscountGateway(this);
        this.dispute = new DisputeGateway(this);
        this.documentUpload = new DocumentUploadGateway(this);
        this.exchangeRateQuote = new ExchangeRateQuoteGateway(this);
        this.merchantAccount = new MerchantAccountGateway(this);
        this.merchant = new MerchantGateway(this);
        this.oauth = new OAuthGateway(this);
        this.paymentMethod = new PaymentMethodGateway(this);
        this.paymentMethodNonce = new PaymentMethodNonceGateway(this);
        this.paypalAccount = new PayPalAccountGateway(this);
        this.paypalPaymentResource = new PayPalPaymentResourceGateway(this);
        this.plan = new PlanGateway(this);
        this.sepaDirectDebitAccount = new SepaDirectDebitAccountGateway(this);
        this.settlementBatchSummary = new SettlementBatchSummaryGateway(this);
        this.subscription = new SubscriptionGateway(this);
        this.testing = new TestingGateway(this);
        this.transaction = new TransactionGateway(this);
        this.transactionLineItem = new TransactionLineItemGateway(this);
        this.usBankAccount = new UsBankAccountGateway(this);
        this.usBankAccountVerification = new UsBankAccountVerificationGateway(this);
        this.webhookNotification = new WebhookNotificationGateway(this);
        this.webhookTesting = new WebhookTestingGateway(this);
      }
    };
    module2.exports = { BraintreeGateway };
  }
});

// node_modules/braintree/lib/braintree/payment_instrument_types.js
var require_payment_instrument_types = __commonJS({
  "node_modules/braintree/lib/braintree/payment_instrument_types.js"(exports2, module2) {
    "use strict";
    var PaymentInstrumentTypes = {
      // NEXT_MAJOR_VERSION rename Android Pay to Google Pay
      AndroidPayCard: "android_pay_card",
      ApplePayCard: "apple_pay_card",
      CreditCard: "credit_card",
      EuropeBankAccount: "europe_bank_account",
      LocalPayment: "local_payment",
      MetaCheckoutCard: "meta_checkout_card",
      MetaCheckoutToken: "meta_checkout_token",
      PayPalAccount: "paypal_account",
      PayPalHere: "paypal_here",
      SepaDirectDebitAccount: "sepa_debit_account",
      UsBankAccount: "us_bank_account",
      VenmoAccount: "venmo_account",
      VisaCheckoutCard: "visa_checkout_card"
    };
    module2.exports = { PaymentInstrumentTypes };
  }
});

// node_modules/braintree/lib/braintree/validation_error_codes.js
var require_validation_error_codes = __commonJS({
  "node_modules/braintree/lib/braintree/validation_error_codes.js"(exports2, module2) {
    "use strict";
    var ValidationErrorCodes = class {
      static initClass() {
        this.Address = {
          CannotBeBlank: "81801",
          CompanyIsInvalid: "91821",
          CompanyIsTooLong: "81802",
          CountryCodeAlpha2IsNotAccepted: "91814",
          CountryCodeAlpha3IsNotAccepted: "91816",
          CountryCodeNumericIsNotAccepted: "91817",
          CountryNameIsNotAccepted: "91803",
          ExtendedAddressIsInvalid: "91823",
          ExtendedAddressIsTooLong: "81804",
          FirstNameIsInvalid: "91819",
          FirstNameIsTooLong: "81805",
          InconsistentCountry: "91815",
          IsInvalid: "91828",
          LastNameIsInvalid: "91820",
          LastNameIsTooLong: "81806",
          LocalityIsInvalid: "91824",
          LocalityIsTooLong: "81807",
          PostalCodeInvalidCharacters: "81813",
          PostalCodeIsInvalid: "91826",
          PostalCodeIsRequired: "81808",
          PostalCodeIsRequiredForCardBrandAndProcessor: "81828",
          PostalCodeIsTooLong: "81809",
          RegionIsInvalid: "91825",
          RegionIsTooLong: "81810",
          StateIsInvalidForSellerProtection: "81827",
          StreetAddressIsInvalid: "91822",
          StreetAddressIsRequired: "81811",
          StreetAddressIsTooLong: "81812",
          TooManyAddressesPerCustomer: "91818"
        };
        this.AndroidPayCard = {
          AndroidPayCardsAreNotAccepted: "83708"
        };
        this.ApplePayCard = {
          ApplePayCardsAreNotAccepted: "83501",
          CustomerIdIsRequiredForVaulting: "83502",
          TokenIsInUse: "93503",
          PaymentMethodNonceConsumed: "93504",
          PaymentMethodNonceUnknown: "93505",
          PaymentMethodNonceLocked: "93506",
          PaymentMethodNonceCardTypeIsNotAccepted: "83518",
          CannotUpdateApplePayCardUsingPaymentMethodNonce: "93507",
          NumberIsRequired: "93508",
          ExpirationMonthIsRequired: "93509",
          ExpirationYearIsRequired: "93510",
          CryptogramIsRequired: "93511",
          DecryptionFailed: "83512",
          Disabled: "93513",
          MerchantNotConfigured: "93514",
          MerchantKeysAlreadyConfigured: "93515",
          MerchantKeysNotConfigured: "93516",
          CertificateInvalid: "93517",
          CertificateMismatch: "93519",
          InvalidToken: "83520",
          PrivateKeyMismatch: "93521",
          KeyMismatchStoringCertificate: "93522"
        };
        this.AuthorizationFingerprint = {
          InvalidCreatedAt: "93204",
          InvalidFormat: "93202",
          InvalidPublicKey: "93205",
          InvalidSignature: "93206",
          MissingFingerprint: "93201",
          OptionsNotAllowedWithoutCustomer: "93207",
          SignatureRevoked: "93203"
        };
        this.ClientToken = {
          CustomerDoesNotExist: "92804",
          FailOnDuplicatePaymentMethodRequiresCustomerId: "92803",
          FailOnDuplicatePaymentMethodForCustomerRequiresCustomerId: "92805",
          InvalidDomainFormat: "92011",
          MakeDefaultRequiresCustomerId: "92801",
          MerchantAccountDoesNotExist: "92807",
          ProxyMerchantDoesNotExist: "92805",
          TooManyDomains: "92810",
          UnsupportedVersion: "92806",
          VerifyCardRequiresCustomerId: "92802"
        };
        this.CreditCard = {
          BillingAddressConflict: "91701",
          BillingAddressFormatIsInvalid: "91744",
          BillingAddressIdIsInvalid: "91702",
          CannotUpdateCardUsingPaymentMethodNonce: "91735",
          CardholderNameIsTooLong: "81723",
          CreditCardTypeIsNotAccepted: "81703",
          CreditCardTypeIsNotAcceptedBySubscriptionMerchantAccount: "81718",
          CustomerIdIsInvalid: "91705",
          CustomerIdIsRequired: "91704",
          CvvIsInvalid: "81707",
          CvvIsRequired: "81706",
          CvvVerificationFailed: "81736",
          DuplicateCardExists: "81724",
          DuplicateCardExistsForCustomer: "81763",
          ExpirationDateConflict: "91708",
          ExpirationDateIsInvalid: "81710",
          ExpirationDateIsRequired: "81709",
          ExpirationDateYearIsInvalid: "81711",
          ExpirationMonthIsInvalid: "81712",
          ExpirationYearIsInvalid: "81713",
          InvalidParamsForCreditCardUpdate: "91745",
          InvalidVenmoSDKPaymentMethodCode: "91727",
          LimitExceededforDuplicatePaymentMethodCheckForCustomer: "81764",
          NetworkTokenizationAttributeCryptogramIsRequired: "81762",
          NumberHasInvalidLength: "81716",
          NumberIsInvalid: "81715",
          NumberIsProhibited: "81750",
          NumberIsRequired: "81714",
          NumberLengthIsInvalid: "81716",
          NumberMustBeTestNumber: "81717",
          PaymentMethodConflict: "81725",
          PaymentMethodIsNotACreditCard: "91738",
          PaymentMethodNonceCardTypeIsNotAccepted: "91734",
          PaymentMethodNonceConsumed: "91731",
          PaymentMethodNonceLocked: "91733",
          PaymentMethodNonceUnknown: "91732",
          PostalCodeVerificationFailed: "81737",
          TokenFormatIsInvalid: "91718",
          TokenInvalid: "91718",
          TokenIsInUse: "91719",
          TokenIsNotAllowed: "91721",
          TokenIsRequired: "91722",
          TokenIsTooLong: "91720",
          VenmoSDKPaymentMethodCodeCardTypeIsNotAccepted: "91726",
          VerificationNotSupportedOnThisMerchantAccount: "91730",
          VerificationAccountTypeIsInvald: "91757",
          VerificationAccountTypeNotSupported: "91758",
          Options: {
            UpdateExistingTokenIsInvalid: "91723",
            UpdateExistingTokenNotAllowed: "91729",
            VerificationAmountCannotBeNegative: "91739",
            VerificationAmountFormatIsInvalid: "91740",
            VerificationAmountIsTooLarge: "91752",
            VerificationAmountNotSupportedByProcessor: "91741",
            VerificationMerchantAccountIdIsInvalid: "91728",
            VerificationMerchantAccountIsForbidden: "91743",
            VerificationMerchantAccountIsSuspended: "91742",
            VerificationMerchantAccountCannotBeSubMerchantAccount: "91755"
          }
        };
        this.Customer = {
          CompanyIsTooLong: "81601",
          CustomFieldIsInvalid: "91602",
          CustomFieldIsTooLong: "81603",
          EmailFormatIsInvalid: "81604",
          EmailIsRequired: "81606",
          EmailIsTooLong: "81605",
          FaxIsTooLong: "81607",
          FirstNameIsTooLong: "81608",
          IdIsInUse: "91609",
          IdIsInvalid: "91610",
          IdIsNotAllowed: "91611",
          IdIsRequired: "91613",
          IdIsTooLong: "91612",
          LastNameIsTooLong: "81613",
          PhoneIsTooLong: "81614",
          VaultedPaymentInstrumentNonceBelongsToDifferentCustomer: "91617",
          WebsiteFormatIsInvalid: "81616",
          WebsiteIsTooLong: "81615"
        };
        this.Descriptor = {
          InternationalNameFormatIsInvalid: "92204",
          PhoneFormatIsInvalid: "92202",
          DynamicDescriptorsDisabled: "92203",
          NameFormatIsInvalid: "92201",
          InternationalPhoneFormatIsInvalid: "92205",
          UrlFormatIsInvalid: "92206"
        };
        this.Dispute = {
          CanOnlyAddEvidenceToOpenDispute: "95701",
          CanOnlyRemoveEvidenceFromOpenDispute: "95702",
          CanOnlyAddEvidenceDocumentToDispute: "95703",
          CanOnlyAcceptOpenDispute: "95704",
          CanOnlyFinalizeOpenDispute: "95705",
          CanOnlyCreateEvidenceWithValidCategory: "95706",
          EvidenceContentDateInvalid: "95707",
          EvidenceContentTooLong: "95708",
          EvidenceContentARNTooLong: "95709",
          EvidenceContentPhoneTooLong: "95710",
          EvidenceCategoryTextOnly: "95711",
          EvidenceCategoryDocumentOnly: "95712",
          EvidenceCategoryNotForReasonCode: "95713",
          EvidenceCategoryDuplicate: "95714",
          EvidenceContentEmailInvalid: "95715",
          DigitalGoodsMissingEvidence: "95720",
          DigitalGoodsMissingDownloadDate: "95721",
          NonDisputedPriorTransactionEvidenceMissingARN: "95722",
          NonDisputedPriorTransactionEvidenceMissingDate: "95723",
          RecurringTransactionEvidenceMissingDate: "95724",
          RecurringTransactionEvidenceMissingARN: "95725",
          ValidEvidenceRequiredToFinalize: "95726",
          OptionalEvidenceRequiredForPriorTransactionResponses: "95727"
        };
        this.DocumentUpload = {
          KindIsInvalid: "84901",
          FileIsTooLarge: "84902",
          FileTypeIsInvalid: "84903",
          FileIsMalformedOrEncrypted: "84904",
          FileIsTooLong: "84905",
          FileIsEmpty: "84906"
        };
        this.Merchant = {
          CountryCannotBeBlank: "83603",
          CountryCodeAlpha2IsInvalid: "93607",
          CountryCodeAlpha2IsNotAccepted: "93606",
          CountryCodeAlpha3IsInvalid: "93605",
          CountryCodeAlpha3IsNotAccepted: "93604",
          CountryCodeNumericIsInvalid: "93609",
          CountryCodeNumericIsNotAccepted: "93608",
          CountryNameIsInvalid: "93611",
          CountryNameIsNotAccepted: "93610",
          CurrenciesAreInvalid: "93614",
          EmailFormatIsInvalid: "93602",
          EmailIsRequired: "83601",
          InconsistentCountry: "93612",
          PaymentMethodsAreInvalid: "93613",
          PaymentMethodsAreNotAllowed: "93615",
          MerchantAccountExistsForCurrency: "93616",
          CurrencyIsRequired: "93617",
          CurrencyIsInvalid: "93618",
          NoMerchantAccounts: "93619",
          MerchantAccountExistsForId: "93620",
          MerchantAccountNotAuthOnboarded: "93621"
        };
        this.MerchantAccount = {
          ApplicantDetails: {
            AccountNumberIsInvalid: "82670",
            AccountNumberIsRequired: "82614",
            Address: {
              LocalityIsRequired: "82618",
              PostalCodeIsInvalid: "82630",
              PostalCodeIsRequired: "82619",
              RegionIsInvalid: "82664",
              RegionIsRequired: "82620",
              StreetAddressIsInvalid: "82629",
              StreetAddressIsRequired: "82617"
            },
            CompanyNameIsInvalid: "82631",
            CompanyNameIsRequiredWithTaxId: "82633",
            DateOfBirthIsInvalid: "82663",
            DateOfBirthIsRequired: "82612",
            Declined: "82626",
            DeclinedFailedKYC: "82623",
            DeclinedMasterCardMatch: "82622",
            DeclinedOFAC: "82621",
            DeclinedSsnInvalid: "82624",
            DeclinedSsnMatchesDeceased: "82625",
            EmailAddressIsInvalid: "82616",
            EmailAddressIsRequired: "82665",
            FirstNameIsInvalid: "82627",
            FirstNameIsRequired: "82609",
            LastNameIsInvalid: "82628",
            LastNameIsRequired: "82611",
            PhoneIsInvalid: "82636",
            RoutingNumberIsInvalid: "82635",
            RoutingNumberIsRequired: "82613",
            SsnIsInvalid: "82615",
            TaxIdIsInvalid: "82632",
            TaxIdIsRequiredWithCompanyName: "82634",
            TaxIdMustBeBlank: "82673"
          },
          Individual: {
            DateOfBirthIsInvalid: "82666",
            DateOfBirthIsRequired: "82639",
            EmailIsInvalid: "82643",
            EmailIsRequired: "82667",
            FirstNameIsInvalid: "82644",
            FirstNameIsRequired: "82637",
            LastNameIsInvalid: "82645",
            LastNameIsRequired: "82638",
            PhoneIsInvalid: "82656",
            SsnIsInvalid: "82642",
            Address: {
              StreetAddressIsRequired: "82657",
              LocalityIsRequired: "82658",
              PostalCodeIsRequired: "82659",
              RegionIsRequired: "82660",
              StreetAddressIsInvalid: "82661",
              PostalCodeIsInvalid: "82662",
              RegionIsInvalid: "82668"
            }
          },
          Business: {
            DbaNameIsInvalid: "82646",
            LegalNameIsInvalid: "82677",
            LegalNameIsRequiredWithTaxId: "82669",
            TaxIdIsInvalid: "82647",
            TaxIdIsRequiredWithLegalName: "82648",
            TaxIdMustBeBlank: "82672",
            Address: {
              StreetAddressIsInvalid: "82685",
              PostalCodeIsInvalid: "82686",
              RegionIsInvalid: "82684"
            }
          },
          Funding: {
            AccountNumberIsInvalid: "82671",
            AccountNumberIsRequired: "82641",
            DestinationIsInvalid: "82679",
            DestinationIsRequired: "82678",
            EmailIsInvalid: "82681",
            EmailIsRequired: "82680",
            MobilePhoneIsInvalid: "82683",
            MobilePhoneIsRequired: "82682",
            RoutingNumberIsInvalid: "82649",
            RoutingNumberIsRequired: "82640"
          },
          CannotBeUpdated: "82674",
          IdCannotBeUpdated: "82675",
          IdFormatIsInvalid: "82603",
          IdIsInUse: "82604",
          IdIsNotAllowed: "82605",
          IdIsTooLong: "82602",
          MasterMerchantAccountIdCannotBeUpdated: "82676",
          MasterMerchantAccountIdIsInvalid: "82607",
          MasterMerchantAccountIdIsRequired: "82606",
          MasterMerchantAccountMustBeActive: "82608",
          TosAcceptedIsRequired: "82610"
        };
        this.OAuth = {
          InvalidGrant: "93801",
          InvalidCredentials: "93802",
          InvalidScope: "93803",
          InvalidRequest: "93804",
          UnsupportedGrantType: "93805"
        };
        this.PaymentMethod = {
          CannotForwardPaymentMethodType: "93106",
          CustomerIdIsInvalid: "93105",
          CustomerIdIsRequired: "93104",
          NonceIsInvalid: "93102",
          NonceIsRequired: "93103",
          PaymentMethodParamsAreRequired: "93101",
          PaymentMethodNonceConsumed: "93107",
          PaymentMethodNonceUnknown: "93108",
          PaymentMethodNonceLocked: "93109",
          PaymentMethodNoLongerSupported: "93117",
          UsBankAccountVerificationMethodIsInvalid: "93121"
        };
        this.PayPalAccount = {
          AuthExpired: "92911",
          CannotHaveBothAccessTokenAndConsentCode: "82903",
          CannotHaveFundingSourceWithoutAccessToken: "92912",
          CannotUpdatePayPalAccountUsingPaymentMethodNonce: "92914",
          CannotVaultOneTimeUsePayPalAccount: "82902",
          ConsentCodeOrAccessTokenIsRequired: "82901",
          CustomerIdIsRequiredForVaulting: "82905",
          InvalidFundingSourceSelection: "92913",
          InvalidParamsForPayPalAccountUpdate: "92915",
          PayPalAccountsAreNotAccepted: "82904",
          PayPalCommunicationError: "92910",
          PaymentMethodNonceConsumed: "92907",
          PaymentMethodNonceLocked: "92909",
          PaymentMethodNonceUnknown: "92908",
          TokenIsInUse: "92906"
        };
        this.PayPalPaymentResource = {
          NonceExpired: "97301",
          IdNotSupported: "97302",
          NonceRequired: "97303",
          InvalidEmail: "97304",
          EmialTooLong: "97305",
          ExpectedLineItemColletion: "97306",
          ExpectedLineItemHash: "97307",
          ExpectedLineItemDebit: "97308",
          InvalidUnitAmount: "97309",
          InvalidUnitTaxAmount: "97310",
          IsoCodeRequired: "97311",
          IsoCodeUnsupported: "97312",
          ShippingFieldsMIissing: "97313",
          InvalidAmountBreakdown: "97314",
          ExpectedShippingOptionCollection: "97315",
          ShippingOptionsRequired: "97316",
          ShippingOptionFieldsMissing: "97317",
          InavlidShippingOptionType: "97318",
          ShippingOptionIdReused: "97319",
          TooManyShippingOptionsSelected: "97320",
          ShippingOptionMustMatchBreakdown: "97321",
          LineItemsShouldMatchTotal: "97322",
          LineItemsTaxShouldMatchTotal: "97323",
          PatchCallFailed: "97324",
          InvalidAmount: "97325",
          ShippingIdTooLong: "97326",
          ShippingLabelTooLong: "97327",
          ShippingFullNameTooLong: "97328",
          ShippingAddressTooLong: "97329",
          ShippingExtendedAddressTooLong: "97330",
          ShippingLocalityTooLong: "97331",
          ShippingRegionTooLong: "97332",
          CountryCodeTooLong: "97333",
          NationalNumberTooLong: "97334",
          PostalCodeTooLong: "97335",
          DescriptionTooLong: "97336",
          CustomFieldTooLong: "97337",
          OrderIdTooLong: "97338"
        };
        this.SepaDirectDebitAccount = {
          PaymentMethodMandateTypeIsNotSupported: "87115",
          PaymentMethodCustomerIdIsInvalid: "87116",
          PaymentMethodCustomerIdIsRequired: "87117"
        };
        this.SettlementBatchSummary = {
          SettlementDateIsInvalid: "82302",
          SettlementDateIsRequired: "82301",
          CustomFieldIsInvalid: "82303"
        };
        this.Subscription = {
          BillingDayOfMonthCannotBeUpdated: "91918",
          BillingDayOfMonthIsInvalid: "91914",
          BillingDayOfMonthMustBeNumeric: "91913",
          CannotAddDuplicateAddonOrDiscount: "91911",
          CannotEditCanceledSubscription: "81901",
          CannotEditExpiredSubscription: "81910",
          CannotEditPriceChangingFieldsOnPastDueSubscription: "91920",
          FirstBillingDateCannotBeInThePast: "91916",
          FirstBillingDateCannotBeUpdated: "91919",
          FirstBillingDateIsInvalid: "91915",
          IdIsInUse: "81902",
          InconsistentNumberOfBillingCycles: "91908",
          InconsistentStartDate: "91917",
          InvalidRequestFormat: "91921",
          MerchantAccountDoesNotSupportInstrumentType: "91930",
          MerchantAccountIdIsInvalid: "91901",
          MismatchCurrencyISOCode: "91923",
          NumberOfBillingCyclesCannotBeBlank: "91912",
          NumberOfBillingCyclesIsTooSmall: "91909",
          NumberOfBillingCyclesMustBeGreaterThanZero: "91907",
          NumberOfBillingCyclesMustBeNumeric: "91906",
          PaymentMethodNonceCardTypeIsNotAccepted: "91924",
          PaymentMethodNonceInstrumentTypeDoesNotSupportSubscriptions: "91929",
          PaymentMethodNonceIsInvalid: "91925",
          PaymentMethodNonceNotAssociatedWithCustomer: "91926",
          PaymentMethodNonceUnvaultedCardIsNotAccepted: "91927",
          PaymentMethodTokenCardTypeIsNotAccepted: "91902",
          PaymentMethodTokenInstrumentTypeDoesNotSupportSubscriptions: "91928",
          PaymentMethodTokenIsInvalid: "91903",
          PaymentMethodTokenNotAssociatedWithCustomer: "91905",
          PlanBillingFrequencyCannotBeUpdated: "91922",
          PlanIdIsInvalid: "91904",
          PriceCannotBeBlank: "81903",
          PriceFormatIsInvalid: "81904",
          PriceIsTooLarge: "81923",
          StatusIsCanceled: "81905",
          TokenFormatIsInvalid: "81906",
          TrialDurationFormatIsInvalid: "81907",
          TrialDurationIsRequired: "81908",
          TrialDurationUnitIsInvalid: "81909",
          Modification: {
            AmountCannotBeBlank: "92003",
            AmountIsInvalid: "92002",
            AmountIsTooLarge: "92023",
            CannotEditModificationsOnPastDueSubscription: "92022",
            CannotUpdateAndRemove: "92015",
            ExistingIdIsIncorrectKind: "92020",
            ExistingIdIsInvalid: "92011",
            ExistingIdIsRequired: "92012",
            IdToRemoveIsIncorrectKind: "92021",
            IdToRemoveIsInvalid: "92025",
            IdToRemoveIsNotPresent: "92016",
            InconsistentNumberOfBillingCycles: "92018",
            InheritedFromIdIsInvalid: "92013",
            InheritedFromIdIsRequired: "92014",
            Missing: "92024",
            NumberOfBillingCyclesCannotBeBlank: "92017",
            NumberOfBillingCyclesIsInvalid: "92005",
            NumberOfBillingCyclesMustBeGreaterThanZero: "92019",
            QuantityCannotBeBlank: "92004",
            QuantityIsInvalid: "92001",
            QuantityMustBeGreaterThanZero: "92010"
          }
        };
        this.Transaction = {
          AdjustmentAmountMustBeGreaterThanZero: "95605",
          AmountCannotBeNegative: "81501",
          AmountDoesNotMatch3DSecureAmount: "91585",
          AmountFormatIsInvalid: "81503",
          AmountIsRequired: "81502",
          AmountIsTooLarge: "81528",
          AmountMustBeGreaterThanZero: "81531",
          AmountNotSupportedByProcessor: "815193",
          BillingAddressConflict: "91530",
          BillingPhoneNumberIsInvalid: "915206",
          CannotBeVoided: "91504",
          CannotCancelRelease: "91562",
          CannotCloneCredit: "91543",
          CannotCloneMarketplaceTransaction: "915137",
          CannotCloneTransactionWithPayPalAccount: "91573",
          CannotCloneTransactionWithVaultCreditCard: "91540",
          CannotCloneUnsuccessfulTransaction: "91542",
          CannotCloneVoiceAuthorizations: "91541",
          CannotHoldInEscrow: "91560",
          CannotPartiallyRefundEscrowedTransaction: "91563",
          CannotRefundCredit: "91505",
          CannotRefundSettlingTransaction: "91574",
          CannotRefundUnlessSettled: "91506",
          CannotRefundWithPendingMerchantAccount: "91559",
          CannotRefundWithSuspendedMerchantAccount: "91538",
          CannotReleaseFromEscrow: "91561",
          CannotSimulateSettlement: "91575",
          CannotSubmitForPartialSettlement: "915103",
          CannotSubmitForSettlement: "91507",
          CannotUpdateTransactionDetailsNotSubmittedForSettlement: "915129",
          ChannelIsTooLong: "91550",
          CreditCardIsRequired: "91508",
          CustomFieldIsInvalid: "91526",
          CustomFieldIsTooLong: "81527",
          CustomerDefaultPaymentMethodCardTypeIsNotAccepted: "81509",
          CustomerDoesNotHaveCreditCard: "91511",
          CustomerIdIsInvalid: "91510",
          DiscountAmountFormatIsInvalid: "915159",
          DiscountAmountCannotBeNegative: "915160",
          DiscountAmountIsTooLarge: "915161",
          ExternalVault: {
            StatusIsInvalid: "915175",
            StatusWithPreviousNetworkTransactionIdIsInvalid: "915177",
            PreviousNetworkTransactionIdIsInvalid: "915179",
            // NEXT_MAJOR_VERSION remove this validation error as it is no longer returned by the gateway
            CardTypeIsInvalid: "915178"
          },
          ExchangeRateQuoteIdIsTooLong: "915229",
          FailedAuthAdjustmentAllowRetry: "95603",
          FailedAuthAdjustmentHardDecline: "95602",
          FinalAuthSubmitForSettlementForDifferentAmount: "95601",
          HasAlreadyBeenRefunded: "91512",
          MerchantAccountDoesNotMatch3DSecureMerchantAccount: "91584",
          MerchantAccountDoesNotSupportMOTO: "91558",
          MerchantAccountDoesNotSupportRefunds: "91547",
          MerchantAccountIdDoesNotMatchSubscription: "915180",
          MerchantAccountIdIsInvalid: "91513",
          MerchantAccountIsSuspended: "91514",
          NoNetAmountToPerformAuthAdjustment: "95606",
          Options: {
            PayPal: {
              CustomFieldTooLong: "91580"
            },
            CreditCard: {
              AccountTypeIsInvalid: "915184",
              AccountTypeNotSupported: "915185",
              AccountTypeDebitDoesNotSupportAuths: "915186"
            },
            SubmitForSettlementIsRequiredForCloning: "91544",
            SubmitForSettlementIsRequiredForPayPalUnilateral: "91582",
            UseBillingForShippingDisabled: "91572",
            VaultIsDisabled: "91525"
          },
          OrderIdIsTooLong: "91501",
          PayPalAuthExpired: "91579",
          PayPalNotEnabled: "91576",
          PayPalVaultRecordMissingData: "91583",
          PaymentInstrumentNotSupportedByMerchantAccount: "91577",
          PaymentInstrumentTypeIsNotAccepted: "915101",
          PaymentInstrumentWithExternalVaultIsInvalid: "915176",
          PaymentMethodConflict: "91515",
          PaymentMethodConflictWithVenmoSDK: "91549",
          PaymentMethodDoesNotBelongToCustomer: "91516",
          PaymentMethodDoesNotBelongToSubscription: "91527",
          PaymentMethodNonceCardTypeIsNotAccepted: "91567",
          PaymentMethodNonceConsumed: "91564",
          PaymentMethodNonceHasNoValidPaymentInstrumentType: "91569",
          PaymentMethodNonceLocked: "91566",
          PaymentMethodNonceUnknown: "91565",
          PaymentMethodTokenCardTypeIsNotAccepted: "91517",
          PaymentMethodTokenIsInvalid: "91518",
          ProcessorAuthorizationCodeCannotBeSet: "91519",
          ProcessorAuthorizationCodeIsInvalid: "81520",
          ProcessorDoesNotSupportAuths: "915104",
          ProcessorDoesNotSupportAuthAdjustment: "915222",
          ProcessorDoesNotSupportCredits: "91546",
          ProcessorDoesNotSupportIncrementalAuth: "915220",
          ProcessorDoesNotSupportMotoForCardType: "915195",
          ProcessorDoesNotSupportPartialAuthReversal: "915221",
          ProcessorDoesNotSupportPartialSettlement: "915102",
          ProcessorDoesNotSupportUpdatingOrderId: "915107",
          ProcessorDoesNotSupportUpdatingDescriptor: "915108",
          ProcessorDoesNotSupportUpdatingTransactionDetails: "915130",
          ProcessorDoesNotSupportVoiceAuthorizations: "91545",
          ProductSkuIsInvalid: "915202",
          PurchaseOrderNumberIsInvalid: "91548",
          PurchaseOrderNumberIsTooLong: "91537",
          RefundAmountIsTooLarge: "91521",
          RefundAuthHardDeclined: "915200",
          RefundAuthSoftDeclined: "915201",
          ScaExemptionIsInvalid: "915213",
          ServiceFeeAmountCannotBeNegative: "91554",
          ServiceFeeAmountFormatIsInvalid: "91555",
          ServiceFeeAmountIsTooLarge: "91556",
          ServiceFeeAmountNotAllowedOnMasterMerchantAccount: "91557",
          ServiceFeeIsNotAllowedOnCredits: "91552",
          ServiceFeeNotAcceptedForPayPal: "91578",
          SettlementAmountIsLessThanServiceFeeAmount: "91551",
          SettlementAmountIsTooLarge: "91522",
          ShippingAddressDoesntMatchCustomer: "91581",
          ShippingAmountFormatIsInvalid: "915162",
          ShippingAmountCannotBeNegative: "915163",
          ShippingAmountIsTooLarge: "915164",
          ShippingMethodIsInvalid: "915203",
          ShippingPhoneNumberIsInvalid: "915204",
          ShipsFromPostalCodeIsTooLong: "915165",
          ShipsFromPostalCodeIsInvalid: "915166",
          ShipsFromPostalCodeInvalidCharacters: "915167",
          SubMerchantAccountRequiresServiceFeeAmount: "91553",
          SubscriptionDoesNotBelongToCustomer: "91529",
          SubscriptionIdIsInvalid: "91528",
          SubscriptionStatusMustBePastDue: "91531",
          TaxAmountCannotBeNegative: "81534",
          TaxAmountFormatIsInvalid: "81535",
          TaxAmountIsRequiredForAibSwedish: "815224",
          TaxAmountIsTooLarge: "81536",
          // NEXT_MAJOR_VERSION `threeDSecureToken` is deprecated. Remove this error code
          ThreeDSecureTokenIsInvalid: "91568",
          // NEXT_MAJOR_VERSION `threeDSecureToken` is deprecated. Remove this error code
          ThreeDSecureTransactionDataDoesntMatchVerify: "91570",
          ThreeDSecureAuthenticationFailed: "81571",
          ThreeDSecureEciFlagIsRequired: "915113",
          ThreeDSecureEciFlagIsInvalid: "915114",
          ThreeDSecureXidIsRequired: "915115",
          ThreeDSecureCavvIsRequired: "915116",
          ThreeDSecureThreeDSecureVersionIsInvalid: "915119",
          ThreeDSecureAuthenticationResponseIsInvalid: "915120",
          ThreeDSecureDirectoryResponseIsInvalid: "915121",
          ThreeDSecureCavvAlgorithmIsInvalid: "915122",
          ThreeDSecureMerchantAccountDoesNotSupportCardType: "915131",
          ThreeDSecureAuthenticationIdIsInvalid: "915196",
          ThreeDSecurePaymentMethodDoesntMatchThreeDSecureAuthenticationPaymentMethod: "915197",
          TransactionIsNotEligibleForAdjustment: "915219",
          TransactionMustBeInStateAuthorized: "915218",
          TransactionSettlementAmountIsLessThanServiceFeeAmount: "91551",
          TooManyLineItems: "915157",
          LineItemsExpected: "915158",
          TypeIsInvalid: "91523",
          TypeIsRequired: "91524",
          UnsupportedVoiceAuthorization: "91539",
          UsBankAccountNonceMustBePlaidVerified: "915171",
          UsBankAccountNotVerified: "915172",
          TransactionSourceIsInvalid: "915133",
          IndustryData: {
            IndustryTypeIsInvalid: "93401",
            Lodging: {
              EmptyData: "93402",
              FolioNumberIsInvalid: "93403",
              CheckInDateIsInvalid: "93404",
              CheckOutDateIsInvalid: "93405",
              CheckOutDateMustFollowCheckInDate: "93406",
              UnknownDataField: "93407",
              RoomRateMustBeGreaterThanZero: "93433",
              RoomRateFormatIsInvalid: "93434",
              RoomRateIsTooLarge: "93435",
              RoomTaxMustBeGreaterThanZero: "93436",
              RoomTaxFormatIsInvalid: "93437",
              RoomTaxIsTooLarge: "93438",
              NoShowIndicatorIsInvalid: "93439",
              AdvancedDepositIndicatorIsInvalid: "93440",
              FireSafetyIndicatorIsInvalid: "93441",
              PropertyPhoneIsInvalid: "93442"
            },
            TravelCruise: {
              EmptyData: "93408",
              UnknownDataField: "93409",
              TravelPackageIsInvalid: "93410",
              DepartureDateIsInvalid: "93411",
              CheckInDateIsInvalid: "93412",
              CheckOutDateIsInvalid: "93413"
            },
            TravelFlight: {
              EmptyData: "93414",
              UnknownDataField: "93415",
              CustomerCodeIsTooLong: "93416",
              FareAmountCannotBeNegative: "93417",
              FareAmountFormatIsInvalid: "93418",
              FareAmountIsTooLarge: "93419",
              FeeAmountCannotBeNegative: "93420",
              FeeAmountFormatIsInvalid: "93421",
              FeeAmountIsTooLarge: "93422",
              IssuedDateFormatIsInvalid: "93423",
              IssuingCarrierCodeIsTooLong: "93424",
              PassengerMiddleInitialIsTooLong: "93425",
              RestrictedTicketIsRequired: "93426",
              TaxAmountCannotBeNegative: "93427",
              TaxAmountFormatIsInvalid: "93428",
              TaxAmountIsTooLarge: "93429",
              TicketNumberIsTooLong: "93430",
              LegsExpected: "93431",
              TooManyLegs: "93432"
            },
            Leg: {
              TravelFlight: {
                ArrivalAirportCodeIsTooLong: "96301",
                ArrivalTimeFormatIsInvalid: "96302",
                CarrierCodeIsTooLong: "96303",
                ConjunctionTicketIsTooLong: "96304",
                CouponNumberIsTooLong: "96305",
                DepartureAirportCodeIsTooLong: "96306",
                DepartureTimeFormatIsInvalid: "96307",
                ExchangeTicketIsTooLong: "96308",
                FareAmountCannotBeNegative: "96309",
                FareAmountFormatIsInvalid: "96310",
                FareAmountIsTooLarge: "96311",
                FareBasisCodeIsTooLong: "96312",
                FeeAmountCannotBeNegative: "96313",
                FeeAmountFormatIsInvalid: "96314",
                FeeAmountIsTooLarge: "96315",
                ServiceClassIsTooLong: "96316",
                TaxAmountCannotBeNegative: "96317",
                TaxAmountFormatIsInvalid: "96318",
                TaxAmountIsTooLarge: "96319",
                TicketNumberIsTooLong: "96320"
              }
            },
            AdditionalCharge: {
              KindIsInvalid: "96601",
              KindMustBeUnique: "96602",
              AmountMustBeGreaterThanZero: "96603",
              AmountFormatIsInvalid: "96604",
              AmountIsTooLarge: "96605",
              AmountIsRequired: "96606"
            }
          },
          LineItem: {
            CommodityCodeIsTooLong: "95801",
            DescriptionIsTooLong: "95803",
            DiscountAmountFormatIsInvalid: "95804",
            DiscountAmountIsTooLarge: "95805",
            DiscountAmountCannotBeNegative: "95806",
            KindIsInvalid: "95807",
            KindIsRequired: "95808",
            NameIsRequired: "95822",
            NameIsTooLong: "95823",
            ProductCodeIsTooLong: "95809",
            QuantityFormatIsInvalid: "95810",
            QuantityIsRequired: "95811",
            QuantityIsTooLarge: "95812",
            TotalAmountFormatIsInvalid: "95813",
            TotalAmountIsRequired: "95814",
            TotalAmountIsTooLarge: "95815",
            TotalAmountMustBeGreaterThanZero: "95816",
            UnitAmountFormatIsInvalid: "95817",
            UnitAmountIsRequired: "95818",
            UnitAmountIsTooLarge: "95819",
            UnitAmountMustBeGreaterThanZero: "95820",
            UnitOfMeasureIsTooLong: "95821",
            UnitTaxAmountFormatIsInvalid: "95824",
            UnitTaxAmountIsTooLarge: "95825",
            UnitTaxAmountCannotBeNegative: "95826",
            TaxAmountFormatIsInvalid: "95827",
            TaxAmountIsTooLarge: "95828",
            TaxAmountCannotBeNegative: "95829",
            UpcCodeIsMissing: "95830",
            UpcCodeIsTooLong: "95831",
            UpcTypeIsMissing: "95832",
            UpcTypeIsInvalid: "95833"
          }
        };
        this.UsBankAccountVerification = {
          NotConfirmable: "96101",
          MustBeMicroTransfersVerification: "96102",
          AmountsDoNotMatch: "96103",
          TooManyConfirmationAttempts: "96104",
          UnableToConfirmDepositAmounts: "96105",
          InvalidDepositAmounts: "96106"
        };
        this.Verification = {
          Options: {
            AmountCannotBeNegative: "94201",
            AmountFormatIsInvalid: "94202",
            AmountIsTooLarge: "94207",
            AmountNotSupportedByProcessor: "94203",
            MerchantAccountIdIsInvalid: "94204",
            MerchantAccountIsSuspended: "94205",
            MerchantAccountIsForbidden: "94206",
            MerchantAccountCannotBeSubMerchantAccount: "94208",
            AccountTypeIsInvalid: "942184",
            AccountTypeNotSupported: "942185"
          },
          ThreeDSecureAuthenticationIdIsInvalid: "942196",
          ThreeDSecureAuthenticationIdDoesntMatchNonceThreeDSecureAuthentication: "942198",
          ThreeDSecureTransactionPaymentMethodDoesntMatchThreeDSecureAuthenticationPaymentMethod: "942197",
          ThreeDSecureAuthenticationIdWithThreeDSecurePassThruIsInvalid: "942199",
          ThreeDSecureAuthenticationFailed: "94271",
          // NEXT_MAJOR_VERSION `threeDSecureToken` is deprecated. Remove this error code
          ThreeDSecureTokenIsInvalid: "94268",
          ThreeDSecureVerificationDataDoesntMatchVerify: "94270",
          MerchantAccountDoesNotSupport3DSecure: "942169",
          MerchantAcountDoesNotMatch3DSecureMerchantAccount: "94284",
          AmountDoesNotMatch3DSecureAmount: "94285",
          ThreeDSecurePassThru: {
            EciFlagIsRequired: "942113",
            EciFlagIsInvalid: "942114",
            CavvIsRequired: "942116",
            ThreeDSecureVersionIsRequired: "942117",
            ThreeDSecureVersionIsInvalid: "942119",
            AuthenticationResponseIsInvalid: "942120",
            DirectoryResponseIsInvalid: "942121",
            CavvAlgorithmIsInvalid: "942122"
          }
        };
        this.RiskData = {
          // NEXT_MAJOR_VERSION Remove CustomerBrowserIsTooLong code as it is no longer applied
          CustomerBrowserIsTooLong: "94701",
          CustomerDeviceIdIsTooLong: "94702",
          CustomerLocationZipInvalidCharacters: "94703",
          CustomerLocationZipIsInvalid: "94704",
          CustomerLocationZipIsTooLong: "94705",
          CustomerTenureIsTooLong: "94706"
        };
      }
    };
    ValidationErrorCodes.initClass();
    module2.exports = { ValidationErrorCodes };
  }
});

// node_modules/braintree/lib/braintree/test_values/credit_card_defaults.js
var require_credit_card_defaults = __commonJS({
  "node_modules/braintree/lib/braintree/test_values/credit_card_defaults.js"(exports2, module2) {
    "use strict";
    var CreditCardDefaults = {
      CountryOfIssuance: "USA",
      IssuingBank: "NETWORK ONLY"
    };
    module2.exports = { CreditCardDefaults };
  }
});

// node_modules/braintree/lib/braintree/test_values/credit_card_numbers.js
var require_credit_card_numbers = __commonJS({
  "node_modules/braintree/lib/braintree/test_values/credit_card_numbers.js"(exports2, module2) {
    "use strict";
    var CreditCardNumbers = {
      CardTypeIndicators: {
        Commercial: "4111111111131010",
        CountryOfIssuance: "4111111111121102",
        Debit: "4117101010101010",
        DurbinRegulated: "4111161010101010",
        Fraud: "4000111111111511",
        Healthcare: "4111111510101010",
        Hiper: "6370950000000005",
        HiperCard: "6062820524845321",
        IssuingBank: "4111111141010101",
        No: "4111111111310101",
        Prepaid: "4111111111111210",
        PrepaidReloadable: "4229989900000002",
        Payroll: "4111111114101010",
        RiskThresholds: "4111130000000003",
        Unknown: "4111111111112101",
        Visa: "4012888888881881"
      },
      AmexPayWithPoints: {
        Success: "371260714673002",
        IneligibleCard: "378267515471109",
        InsufficientPoints: "371544868764018"
      },
      Dispute: {
        Chargeback: "4023898493988028"
      }
    };
    module2.exports = { CreditCardNumbers };
  }
});

// node_modules/braintree/lib/braintree/test_values/merchant_account.js
var require_merchant_account2 = __commonJS({
  "node_modules/braintree/lib/braintree/test_values/merchant_account.js"(exports2, module2) {
    "use strict";
    var MerchantAccountTest = {
      Approve: "approve_me",
      InsufficientFundsContactUs: "insufficient_funds__contact",
      AccountNotAuthorizedContactUs: "account_not_authorized__contact",
      BankRejectedUpdateFundingInformation: "bank_rejected__update",
      BankRejectedNone: "bank_rejected__none",
      UsBankMerchantAccount: "us_bank_merchant_account",
      AnotherUsBankMerchantAccount: "another_us_bank_merchant_account"
    };
    module2.exports = { MerchantAccountTest };
  }
});

// node_modules/braintree/lib/braintree/test_values/nonces.js
var require_nonces = __commonJS({
  "node_modules/braintree/lib/braintree/test_values/nonces.js"(exports2, module2) {
    "use strict";
    var Nonces = {
      Transactable: "fake-valid-nonce",
      Consumed: "fake-consumed-nonce",
      PayPalOneTimePayment: "fake-paypal-one-time-nonce",
      // NEXT_MAJOR_VERSION - no longer supported in the Gateway, remove this constant
      PayPalFuturePayment: "fake-paypal-future-nonce",
      PayPalBillingAgreement: "fake-paypal-billing-agreement-nonce",
      ApplePayVisa: "fake-apple-pay-visa-nonce",
      ApplePayMasterCard: "fake-apple-pay-mastercard-nonce",
      ApplePayAmEx: "fake-apple-pay-amex-nonce",
      ApplePayMpan: "fake-apple-pay-mpan-nonce",
      AbstractTransactable: "fake-abstract-transactable-nonce",
      Europe: "fake-europe-bank-account-nonce",
      // NEXT_MAJOR_VERSION rename Android Pay to Google Pay
      AndroidPay: "fake-android-pay-nonce",
      AndroidPayDiscover: "fake-android-pay-discover-nonce",
      AndroidPayVisa: "fake-android-pay-visa-nonce",
      AndroidPayMasterCard: "fake-android-pay-mastercard-nonce",
      AndroidPayAmEx: "fake-android-pay-amex-nonce",
      ThreeDSecureVisaFullAuthentication: "fake-three-d-secure-visa-full-authentication-nonce",
      ThreeDSecureVisaLookupTimeout: "fake-three-d-secure-visa-lookup-timeout-nonce",
      ThreeDSecureVisaFailedSignature: "fake-three-d-secure-visa-failed-signature-nonce",
      ThreeDSecureVisaFailedAuthentication: "fake-three-d-secure-visa-failed-authentication-nonce",
      ThreeDSecureVisaAttemptsNonParticipating: "fake-three-d-secure-visa-attempts-non-participating-nonce",
      ThreeDSecureVisaNoteEnrolled: "fake-three-d-secure-visa-not-enrolled-nonce",
      ThreeDSecureVisaUnavailable: "fake-three-d-secure-visa-unavailable-nonce",
      ThreeDSecureVisaMPILookupError: "fake-three-d-secure-visa-mpi-lookup-error-nonce",
      ThreeDSecureVisaMPIAuthenticateError: "fake-three-d-secure-visa-mpi-authenticate-error-nonce",
      ThreeDSecureVisaAuthenticationUnavailable: "fake-three-d-secure-visa-authentication-unavailable-nonce",
      ThreeDSecureVisaBypassedAuthentication: "fake-three-d-secure-visa-bypassed-authentication-nonce",
      ThreeDSecureTwoVisaSuccessfulFrictionlessAuthentication: "fake-three-d-secure-two-visa-successful-frictionless-authentication-nonce",
      ThreeDSecureTwoVisaSuccessfulStepUpAuthentication: "fake-three-d-secure-two-visa-successful-step-up-authentication-nonce",
      ThreeDSecureTwoVisaErrorOnLookup: "fake-three-d-secure-two-visa-error-on-lookup-nonce",
      ThreeDSecureTwoVisaTimeoutOnLookup: "fake-three-d-secure-two-visa-timeout-on-lookup-nonce",
      TransactableVisa: "fake-valid-visa-nonce",
      TransactableAmEx: "fake-valid-amex-nonce",
      TransactableMasterCard: "fake-valid-mastercard-nonce",
      TransactableDiscover: "fake-valid-discover-nonce",
      TransactableJCB: "fake-valid-jcb-nonce",
      TransactableMaestro: "fake-valid-maestro-nonce",
      TransactableDinersClub: "fake-valid-dinersclub-nonce",
      TransactablePrepaid: "fake-valid-prepaid-nonce",
      TransactablePrepaidReloadable: "fake-valid-prepaid-reloadable-nonce",
      TransactableCommercial: "fake-valid-commercial-nonce",
      TransactableDurbinRegulated: "fake-valid-durbin-regulated-nonce",
      TransactableHealthcare: "fake-valid-healthcare-nonce",
      TransactableDebit: "fake-valid-debit-nonce",
      TransactablePayroll: "fake-valid-payroll-nonce",
      TransactableNoIndicators: "fake-valid-no-indicators-nonce",
      TransactableUnknownIndicators: "fake-valid-unknown-indicators-nonce",
      TransactableCountryOfIssuanceUSA: "fake-valid-country-of-issuance-usa-nonce",
      TransactableCountryOfIssuanceCAD: "fake-valid-country-of-issuance-cad-nonce",
      TransactableIssuingBankNetworkOnly: "fake-valid-issuing-bank-network-only-nonce",
      TransactablePinlessDebitVisa: "fake-pinless-debit-visa-nonce",
      ProcessorDeclinedVisa: "fake-processor-declined-visa-nonce",
      ProcessorDeclinedMasterCard: "fake-processor-declined-mastercard-nonce",
      ProcessorDeclinedAmEx: "fake-processor-declined-amex-nonce",
      ProcessorDeclinedDiscover: "fake-processor-declined-discover-nonce",
      ProcessorFailureJCB: "fake-processor-failure-jcb-nonce",
      LuhnInvalid: "fake-luhn-invalid-nonce",
      LocalPayment: "fake-local-payment-method-nonce",
      PayPalFuturePaymentRefreshToken: "fake-paypal-future-refresh-token-nonce",
      GatewayRejectedFraud: "fake-gateway-rejected-fraud-nonce",
      GatewayRejectedRiskThresholds: "fake-gateway-rejected-risk-thresholds-nonce",
      VenmoAccount: "fake-venmo-account-nonce",
      VenmoAccountTokenIssuanceError: "fake-token-issuance-error-venmo-account-nonce",
      VisaCheckoutAmEx: "fake-visa-checkout-amex-nonce",
      VisaCheckoutDiscover: "fake-visa-checkout-discover-nonce",
      VisaCheckoutMasterCard: "fake-visa-checkout-mastercard-nonce",
      VisaCheckoutVisa: "fake-visa-checkout-visa-nonce",
      // NEXT_MAJOR_VERSION SamsungPayCard is deprecated, remove all associated nonces
      SamsungPayAmEx: "tokensam_fake_american_express",
      SamsungPayDiscover: "tokensam_fake_discover",
      SamsungPayMasterCard: "tokensam_fake_mastercard",
      SamsungPayVisa: "tokensam_fake_visa",
      SepaDirectDebit: "fake-sepa-direct-debit-nonce",
      UsBankAccount: "fake-us-bank-account-nonce",
      MetaCheckoutCard: "fake-meta-checkout-card-nonce",
      MetaCheckoutToken: "fake-meta-checkout-token-nonce"
    };
    module2.exports = { Nonces };
  }
});

// node_modules/braintree/lib/braintree/test_values/transaction_amounts.js
var require_transaction_amounts = __commonJS({
  "node_modules/braintree/lib/braintree/test_values/transaction_amounts.js"(exports2, module2) {
    "use strict";
    var TransactionAmounts = {
      Authorize: "1000.00",
      Decline: "2000.00",
      Fail: "3000.00"
    };
    module2.exports = { TransactionAmounts };
  }
});

// node_modules/braintree/lib/braintree.js
var require_braintree = __commonJS({
  "node_modules/braintree/lib/braintree.js"(exports2, module2) {
    "use strict";
    var version = require_package().version;
    var Environment = require_environment().Environment;
    var BraintreeGateway = require_braintree_gateway().BraintreeGateway;
    var GraphQL = require_graphql2();
    var errorTypes = require_error_types().errorTypes;
    var exceptions = require_exceptions();
    var Transaction = require_transaction().Transaction;
    var CreditCard = require_credit_card().CreditCard;
    var Dispute = require_dispute().Dispute;
    var PayPalAccount = require_paypal_account().PayPalAccount;
    var AndroidPayCard = require_android_pay_card().AndroidPayCard;
    var ApplePayCard = require_apple_pay_card().ApplePayCard;
    var VenmoAccount = require_venmo_account().VenmoAccount;
    var VisaCheckoutCard = require_visa_checkout_card().VisaCheckoutCard;
    var SamsungPayCard = require_samsung_pay_card().SamsungPayCard;
    var CreditCardVerification = require_credit_card_verification().CreditCardVerification;
    var Plan = require_plan().Plan;
    var Subscription = require_subscription().Subscription;
    var MerchantAccount = require_merchant_account().MerchantAccount;
    var PaymentInstrumentTypes = require_payment_instrument_types().PaymentInstrumentTypes;
    var WebhookNotification = require_webhook_notification().WebhookNotification;
    var TestingGateway = require_testing_gateway().TestingGateway;
    var UsBankAccountVerification = require_us_bank_account_verification().UsBankAccountVerification;
    var ValidationErrorCodes = require_validation_error_codes().ValidationErrorCodes;
    var CreditCardDefaults = require_credit_card_defaults().CreditCardDefaults;
    var CreditCardNumbers = require_credit_card_numbers().CreditCardNumbers;
    var MerchantAccountTest = require_merchant_account2().MerchantAccountTest;
    var Nonces = require_nonces().Nonces;
    var TransactionAmounts = require_transaction_amounts().TransactionAmounts;
    var Test = {
      CreditCardDefaults,
      CreditCardNumbers,
      MerchantAccountTest,
      Nonces,
      TransactionAmounts
    };
    module2.exports = {
      BraintreeGateway,
      GraphQL,
      version,
      Environment,
      errorTypes,
      exceptions,
      Transaction,
      CreditCard,
      Dispute,
      PayPalAccount,
      AndroidPayCard,
      ApplePayCard,
      VenmoAccount,
      VisaCheckoutCard,
      SamsungPayCard,
      CreditCardVerification,
      Plan,
      Subscription,
      MerchantAccount,
      PaymentInstrumentTypes,
      WebhookNotification,
      TestingGateway,
      UsBankAccountVerification,
      ValidationErrorCodes,
      Test
    };
  }
});

// node_modules/braintree/index.js
var require_braintree2 = __commonJS({
  "node_modules/braintree/index.js"(exports2, module2) {
    "use strict";
    module2.exports = require_braintree();
  }
});

// node_modules/dotenv/package.json
var require_package2 = __commonJS({
  "node_modules/dotenv/package.json"(exports2, module2) {
    module2.exports = {
      name: "dotenv",
      version: "16.4.7",
      description: "Loads environment variables from .env file",
      main: "lib/main.js",
      types: "lib/main.d.ts",
      exports: {
        ".": {
          types: "./lib/main.d.ts",
          require: "./lib/main.js",
          default: "./lib/main.js"
        },
        "./config": "./config.js",
        "./config.js": "./config.js",
        "./lib/env-options": "./lib/env-options.js",
        "./lib/env-options.js": "./lib/env-options.js",
        "./lib/cli-options": "./lib/cli-options.js",
        "./lib/cli-options.js": "./lib/cli-options.js",
        "./package.json": "./package.json"
      },
      scripts: {
        "dts-check": "tsc --project tests/types/tsconfig.json",
        lint: "standard",
        pretest: "npm run lint && npm run dts-check",
        test: "tap run --allow-empty-coverage --disable-coverage --timeout=60000",
        "test:coverage": "tap run --show-full-coverage --timeout=60000 --coverage-report=lcov",
        prerelease: "npm test",
        release: "standard-version"
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git"
      },
      funding: "https://dotenvx.com",
      keywords: [
        "dotenv",
        "env",
        ".env",
        "environment",
        "variables",
        "config",
        "settings"
      ],
      readmeFilename: "README.md",
      license: "BSD-2-Clause",
      devDependencies: {
        "@types/node": "^18.11.3",
        decache: "^4.6.2",
        sinon: "^14.0.1",
        standard: "^17.0.0",
        "standard-version": "^9.5.0",
        tap: "^19.2.0",
        typescript: "^4.8.4"
      },
      engines: {
        node: ">=12"
      },
      browser: {
        fs: false
      }
    };
  }
});

// node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/dotenv/lib/main.js"(exports2, module2) {
    var fs2 = require("fs");
    var path2 = require("path");
    var os = require("os");
    var crypto = require("crypto");
    var packageJson = require_package2();
    var version = packageJson.version;
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse2(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      const vaultPath = _vaultPath(options);
      const result = DotenvModule.configDotenv({ path: vaultPath });
      if (!result.parsed) {
        const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
        err.code = "MISSING_DATA";
        throw err;
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _log(message) {
      console.log(`[dotenv@${version}][INFO] ${message}`);
    }
    function _warn(message) {
      console.log(`[dotenv@${version}][WARN] ${message}`);
    }
    function _debug(message) {
      console.log(`[dotenv@${version}][DEBUG] ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error("INVALID_DOTENV_KEY: Missing key part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
        err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
        throw err;
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs2.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path2.resolve(process.cwd(), ".env.vault");
      }
      if (fs2.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path2.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    function _configVault(options) {
      _log("Loading env from encrypted .env.vault");
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      const dotenvPath = path2.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      const debug = Boolean(options && options.debug);
      if (options && options.encoding) {
        encoding = options.encoding;
      } else {
        if (debug) {
          _debug("No encoding is specified. UTF-8 is used by default");
        }
      }
      let optionPaths = [dotenvPath];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [_resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(_resolveHome(filepath));
          }
        }
      }
      let lastError;
      const parsedAll = {};
      for (const path3 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(fs2.readFileSync(path3, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`Failed to load ${path3} ${e.message}`);
          }
          lastError = e;
        }
      }
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsedAll, options);
      if (lastError) {
        return { parsed: parsedAll, error: lastError };
      } else {
        return { parsed: parsedAll };
      }
    }
    function config(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        } else if (decryptionFailed) {
          const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
          err.code = "DECRYPTION_FAILED";
          throw err;
        } else {
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      if (typeof parsed !== "object") {
        const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        err.code = "OBJECT_REQUIRED";
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
        }
      }
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config,
      decrypt,
      parse: parse2,
      populate
    };
    module2.exports.configDotenv = DotenvModule.configDotenv;
    module2.exports._configVault = DotenvModule._configVault;
    module2.exports._parseVault = DotenvModule._parseVault;
    module2.exports.config = DotenvModule.config;
    module2.exports.decrypt = DotenvModule.decrypt;
    module2.exports.parse = DotenvModule.parse;
    module2.exports.populate = DotenvModule.populate;
    module2.exports = DotenvModule;
  }
});

// server.ts
var http = __toESM(require("http"), 1);
var https = __toESM(require("https"), 1);
var fs = __toESM(require("fs"), 1);
var path = __toESM(require("path"), 1);
var querystring = __toESM(require("querystring"), 1);
var import_braintree = __toESM(require_braintree2(), 1);
var import_dotenv = __toESM(require_main(), 1);
import_dotenv.default.config();
var serverConfig = {
  protocol: "http",
  host: "localhost",
  port: 3e3,
  startpage: "index.html"
};
var gateway = new import_braintree.default.BraintreeGateway({
  environment: import_braintree.default.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY
});
function getEnvVar(name, defaultValue) {
  return process.env[name] || defaultValue;
}
function setHeaders(response, statusCode, contentType = "application/json") {
  response.writeHead(statusCode, {
    "Content-Type": contentType,
    "Access-Control-Allow-Origin": "*",
    // Adjust to your front-end URL if needed.
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
}
async function getRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}
var routes = {
  "/config": {
    GET: (request, response, cfg) => {
      const config = {
        clientId: getEnvVar("BRAINTREE_CLIENT_ID", ""),
        apiKey: getEnvVar("BRAINTREE_API_KEY", "")
      };
      setHeaders(response, 200);
      response.end(JSON.stringify(config));
    }
  },
  "/client-token": {
    GET: async (request, response, cfg) => {
      try {
        const res = await gateway.clientToken.generate({});
        setHeaders(response, 200);
        response.end(JSON.stringify({ clientToken: res.clientToken }));
      } catch (err) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: "Failed to generate client token" }));
      }
    }
  },
  "/transaction": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const { transactionId } = JSON.parse(body);
        const transaction = await gateway.transaction.find(transactionId);
        setHeaders(response, 200);
        response.end(JSON.stringify({ transaction }));
      } catch (err) {
        setHeaders(response, 404);
        response.end(JSON.stringify({ error: "Transaction not found" }));
      }
    }
  },
  "/checkout": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const { customerId, amount } = JSON.parse(body);
        const saleRequest = {
          amount,
          customerId,
          options: {
            submitForSettlement: true
          }
        };
        const result = await gateway.transaction.sale(saleRequest);
        if (!result.success) {
          setHeaders(response, 500);
          response.end(JSON.stringify({ error: result.message }));
        } else {
          setHeaders(response, 200);
          response.end(JSON.stringify({
            success: true,
            transactionId: result.transaction.id
          }));
        }
      } catch (err) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: "Checkout failed" }));
      }
    }
  },
  "/create-customer": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const { firstName, lastName, email, paymentMethodNonce } = JSON.parse(body);
        const result = await gateway.customer.create({
          firstName,
          lastName,
          email,
          paymentMethodNonce
        });
        if (!result.success) {
          setHeaders(response, 500);
          response.end(JSON.stringify({ error: result.message }));
        } else {
          setHeaders(response, 200);
          response.end(JSON.stringify({
            success: true,
            customerId: result.customer.id
          }));
        }
      } catch (err) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: "Failed to create customer" }));
      }
    }
  },
  "/get-customer": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const { customerId } = JSON.parse(body);
        const customer = await gateway.customer.find(customerId);
        setHeaders(response, 200);
        response.end(JSON.stringify({ customer }));
      } catch (err) {
        setHeaders(response, 404);
        response.end(JSON.stringify({ error: "Customer not found" }));
      }
    }
  },
  "/update-customer": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const { customerId, firstName, lastName, email, address, city, state, zip, country } = JSON.parse(body);
        const result = await gateway.customer.update(customerId, {
          firstName,
          lastName,
          email,
          creditCard: {
            billingAddress: {
              streetAddress: address,
              locality: city,
              region: state,
              postalCode: zip,
              countryCodeAlpha2: country
            }
          }
        });
        if (!result.success) {
          setHeaders(response, 500);
          response.end(JSON.stringify({ error: result.message }));
        } else {
          setHeaders(response, 200);
          response.end(JSON.stringify({ success: true }));
        }
      } catch (err) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: "Failed to update customer" }));
      }
    }
  },
  "/create-submerchant": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const bodyJson = JSON.parse(body);
        const masterMerchantAccountId = process.env.BRAINTREE_MASTER_MERCHANT_ID;
        const result = await gateway.merchantAccount.create({
          individual: bodyJson.individual,
          funding: bodyJson.funding,
          tosAccepted: true,
          masterMerchantAccountId
        });
        if (!result.success) {
          setHeaders(response, 500);
          response.end(JSON.stringify({ error: result.message }));
          return;
        }
        const subMerchantAccountId = result.merchantAccount.id;
        setHeaders(response, 200);
        response.end(JSON.stringify({
          success: true,
          subMerchantAccountId
        }));
      } catch (err) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: "Failed to create submerchant" }));
      }
    }
  },
  "/split-transaction": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const bodyJson = JSON.parse(body);
        const { subMerchantAccountId, amount, nonce, customerId } = bodyJson;
        const decimalAmount = parseFloat(amount);
        const serviceFeeDecimal = decimalAmount * 0.02;
        const serviceFeeAmount = serviceFeeDecimal.toFixed(2);
        const saleRequest = {
          merchantAccountId: subMerchantAccountId,
          amount,
          serviceFeeAmount,
          options: { submitForSettlement: true }
        };
        if (customerId) {
          saleRequest.customerId = customerId;
        } else if (nonce) {
          saleRequest.paymentMethodNonce = nonce;
        }
        const result = await gateway.transaction.sale(saleRequest);
        if (!result.success) {
          setHeaders(response, 500);
          response.end(JSON.stringify({ error: result.message }));
          return;
        }
        setHeaders(response, 200);
        response.end(JSON.stringify({
          success: true,
          transactionId: result.transaction.id,
          subMerchantEarnings: (decimalAmount - parseFloat(serviceFeeAmount)).toFixed(2),
          masterMerchantEarnings: serviceFeeAmount
        }));
      } catch (err) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: "Failed to process split transaction" }));
      }
    }
  },
  // GET /transactions - Return all transactions (filtered by createdAt)
  "/transactions": {
    GET: async (request, response, cfg) => {
      try {
        const transactions = await new Promise((resolve, reject) => {
          const result = [];
          gateway.transaction.search(
            (search) => {
              search.createdAt().min(new Date(2e3, 0, 1));
            },
            //@ts-ignore
            (err, collection) => {
              if (err) return reject(err);
              collection.each((err2, transaction) => {
                if (err2) return reject(err2);
                result.push(transaction);
              }, () => resolve(result));
            }
          );
        });
        setHeaders(response, 200);
        response.end(JSON.stringify({ transactions }));
      } catch (err) {
        console.error(err);
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: "Failed to fetch transactions" }));
      }
    }
  },
  // GET /customers - Return all customers
  "/customers": {
    GET: async (request, response, cfg) => {
      try {
        const customers = await new Promise((resolve, reject) => {
          const result = [];
          gateway.customer.search(
            (search) => {
            },
            //@ts-ignore
            (err, collection) => {
              if (err) return reject(err);
              collection.each((err2, customer) => {
                if (err2) return reject(err2);
                result.push(customer);
              }, () => resolve(result));
            }
          );
        });
        setHeaders(response, 200);
        response.end(JSON.stringify({ customers }));
      } catch (err) {
        console.error(err);
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: "Failed to fetch customers" }));
      }
    }
  },
  // POST /get-submerchant - Return a single submerchant account using its ID
  "/get-submerchant": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const { merchantAccountId } = JSON.parse(body);
        const subMerchant = await new Promise((resolve, reject) => {
          gateway.merchantAccount.find(merchantAccountId).then((merchantAccount) => {
            resolve(merchantAccount);
          }).catch((err) => {
            if (err) return reject(err);
          });
        });
        setHeaders(response, 200);
        response.end(JSON.stringify({ subMerchant }));
      } catch (err) {
        console.error(err);
        setHeaders(response, 404);
        response.end(JSON.stringify({ error: "Submerchant not found" }));
      }
    }
  },
  // GET /submerchants - Parse the approved submerchant file and return submerchant details
  "/submerchants": {
    GET: async (request, response, cfg) => {
      try {
        if (!fs.existsSync("approved_submerchants.txt")) {
          setHeaders(response, 200);
          response.end(JSON.stringify({ submerchants: [] }));
          return;
        }
        const data = await fs.promises.readFile("approved_submerchants.txt", "utf-8");
        const submerchantIds = data.split("\n").filter((line) => line.trim() !== "");
        const submerchants = await Promise.all(
          submerchantIds.map(async (id) => {
            try {
              const merchantAccount = await gateway.merchantAccount.find(id);
              return merchantAccount;
            } catch (err) {
              return { id, error: "Submerchant not found" };
            }
          })
        );
        setHeaders(response, 200);
        response.end(JSON.stringify({ submerchants }));
      } catch (err) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: "Failed to fetch submerchants" }));
      }
    }
  },
  // --- Webhook Endpoint --- https url needs to be configured: https://developer.paypal.com/braintree/docs/guides/webhooks/create/node
  "/webhook": {
    POST: async (request, response, cfg) => {
      try {
        const body = await getRequestBody(request);
        const parsedBody = querystring.parse(body);
        const btSignature = parsedBody.bt_signature;
        const btPayload = parsedBody.bt_payload;
        gateway.webhookNotification.parse(
          btSignature,
          btPayload,
          //@ts-ignore    
          (err, webhookNotification) => {
            if (err) {
              setHeaders(response, 500);
              response.end(JSON.stringify({ error: "Failed to parse webhook notification" }));
              return;
            }
            console.log("\n WEBHOOK NOTIFICATION: ", webhookNotification.message);
            switch (webhookNotification.kind) {
              //@ts-ignore   
              case import_braintree.default.WebHookNotification.Kind.SubMerchantAccountApproved:
                fs.appendFile("approved_submerchants.txt", webhookNotification.merchantAccount.id + "\n", (err2) => {
                  if (err2) console.error("Error writing approved submerchant:", err2);
                });
                break;
              //@ts-ignore   
              case import_braintree.default.WebhookNotification.Kind.SubMerchantAccountDeclined:
                break;
              //@ts-ignore   
              case import_braintree.default.WebhookNotification.Kind.TransactionDisbursed:
              //@ts-ignore   
              case import_braintree.default.WebhookNotification.Kind.TransactionSettled:
                fs.appendFile("successful_transactions.txt", webhookNotification.transaction.id + "\n", (err2) => {
                  if (err2) console.error("Error writing successful transaction:", err2);
                });
                break;
              //@ts-ignore   
              case import_braintree.default.WebhookNotification.Kind.TransactionSettlementDeclined:
                fs.appendFile("declined_transactions.txt", webhookNotification.transaction.id + "\n", (err2) => {
                  if (err2) console.error("Error writing declined transaction:", err2);
                });
                break;
              default:
                console.log("Received webhook notification of kind:", webhookNotification.kind);
            }
            setHeaders(response, 200);
            response.end(JSON.stringify({ received: true }));
          }
        );
      } catch (err) {
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: "Failed to process webhook" }));
      }
    }
  }
};
function onRequest(request, response, cfg) {
  if (request.method === "OPTIONS") {
    setHeaders(response, 200);
    response.end();
    return;
  }
  const route = routes[request.url || ""];
  if (route) {
    const methodHandler = route[request.method || ""];
    if (methodHandler) {
      Promise.resolve(methodHandler(request, response, cfg)).catch((err) => {
        console.error(err);
        setHeaders(response, 500);
        response.end(JSON.stringify({ error: "Internal Server Error" }));
      });
      return;
    } else {
      setHeaders(response, 405, "text/html");
      response.end("Method Not Allowed");
      return;
    }
  }
  const requestURL = "." + (request.url || "");
  if (fs.existsSync(requestURL)) {
    fs.readFile(requestURL, (error, content) => {
      if (error) {
        setHeaders(response, 500, "text/html");
        response.end("Internal Server Error");
      } else {
        const extname2 = String(path.extname(requestURL)).toLowerCase();
        const mimeType = {
          ".html": "text/html",
          ".js": "application/javascript",
          ".json": "application/json"
        };
        setHeaders(response, 200, mimeType[extname2] || "application/octet-stream");
        response.end(content, "utf-8");
      }
    });
  } else {
    setHeaders(response, 404, "text/html");
    response.end("404 Not Found", "utf-8");
  }
}
function createServer3(cfg) {
  if (cfg.protocol === "http") {
    return http.createServer(
      (request, response) => onRequest(request, response, cfg)
    );
  } else if (cfg.protocol === "https") {
    const options = {
      key: fs.readFileSync(cfg.keypath),
      cert: fs.readFileSync(cfg.certpath)
    };
    return https.createServer(
      options,
      (request, response) => onRequest(request, response, cfg)
    );
  }
  throw new Error("Invalid protocol specified");
}
function startServer(cfg) {
  cfg.port = Number(getEnvVar("PORT", cfg.port));
  const server = createServer3(cfg);
  server.listen(cfg.port, cfg.host, () => {
    console.log(`Server running at ${cfg.protocol}://${cfg.host}:${cfg.port}/`);
  });
  return server;
}
startServer(serverConfig);
/*! Bundled license information:

sax/lib/sax.js:
  (*! http://mths.be/fromcodepoint v0.1.0 by @mathias *)
*/
