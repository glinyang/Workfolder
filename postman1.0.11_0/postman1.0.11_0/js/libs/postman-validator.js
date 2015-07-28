!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.postmanvalidator=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports={
    "type":"object",
    "$schema": "http://json-schema.org/draft-03/schema",
    "id": "http://jsonschema.net",
    "title": "Postman collection",
    "required":false,
    "extends":[
        {
            "required":false
        },
        {
            "required":false
        }
    ],
    "properties":{
        "id": {
            "type":"string",
            "id": "http://jsonschema.net/id",
            "required":true
        },
        "name": {
            "type":"string",
            "id": "http://jsonschema.net/name",
            "required":true
        },
        "order": {
            "type":["array","null"],
            "id": "http://jsonschema.net/order",
            "required":false,
            "items":
                {
                    "type":"string",
                    "id": "http://jsonschema.net/order/0",
                    "required":true
                }
        },
        "requests": {
            "type":"array",
            "id": "http://jsonschema.net/requests",
            "required":true,
            "items":
                {
                    "type":"object",
                    "id": "http://jsonschema.net/requests/0",
                    "required":true,
                    "properties":{
                        "collectionId": {
                            "type":"string",
                            "id": "http://jsonschema.net/requests/0/collectionId",
                            "required":true
                        },
                        "dataMode": {
                            "type":"string",
                            "id": "http://jsonschema.net/requests/0/dataMode",
                            "required":true
                        },
                        "data": {
                        	"type": ["string","array","null"],
                            "id": "http://jsonschema.net/requests/0/data",
                            "required":false
                        },
                        "descriptionFormat": {
                            "type":["string","null"],
                            "id": "http://jsonschema.net/requests/0/descriptionFormat",
                            "required":false
                        },
                        "description": {
                            "type":["string","null"],
                            "id": "http://jsonschema.net/requests/0/description",
                            "required":false
                        },
                        "headers": {
                            "type":["string","null"],
                            "id": "http://jsonschema.net/requests/0/headers",
                            "required":false
                        },
                        "id": {
                            "type":"string",
                            "id": "http://jsonschema.net/requests/0/id",
                            "required":true
                        },
                        "method": {
                            "type":"string",
                            "id": "http://jsonschema.net/requests/0/method",
                            "required":true
                        },
                        "name": {
                            "type":["string","null"],
                            "id": "http://jsonschema.net/requests/0/name",
                            "required":false
                        },
                        "pathVariables": {
                            "type":["object","null"],
                            "id": "http://jsonschema.net/requests/0/pathVariables",
                            "required":false
                        },
                        "preRequestScript": {
                            "type":["string","null"],
                            "id": "http://jsonschema.net/requests/0/preRequestScript",
                            "required":false
                        },
                        "responses": {
                            "type":["array","null"],
                            "id": "http://jsonschema.net/requests/0/responses",
                            "required":false
                        },
                        "synced": {
                            "type":["boolean","null"],
                            "id": "http://jsonschema.net/requests/0/synced",
                            "required":false
                        },
                        "tests": {
                            "type":["string","null"],
                            "id": "http://jsonschema.net/requests/0/tests",
                            "required":false
                        },
                        "time": {
                            "type":["number","null"],
                            "id": "http://jsonschema.net/requests/0/time",
                            "required":false
                        },
                        "url": {
                            "type":"string",
                            "id": "http://jsonschema.net/requests/0/url",
                            "required":true
                        },
                        "version": {
                            "type":["number","null"],
                            "id": "http://jsonschema.net/requests/0/version",
                            "required":false
                        }
                    }
                }
            

        },
        "synced": {
            "type":["boolean","null"],
            "id": "http://jsonschema.net/synced",
            "required":false
        },
        "timestamp": {
            "type":["number","null"],
            "id": "http://jsonschema.net/timestamp",
            "required":false
        }
    },
    "items":
        {
            "required":false
        }
}

},{}],2:[function(require,module,exports){
module.exports={
	"type":"object",
	"$schema": "http://json-schema.org/draft-03/schema",
	"id": "http://jsonschema.net",
	"title": "Postman environment",
	"required":false,
	"properties":{
		"id": {
			"type":"string",
			"id": "http://jsonschema.net/id",
			"required":true
		},
		"name": {
			"type":"string",
			"id": "http://jsonschema.net/name",
			"required":true
		},
		"syncedFilename": {
			"type":["string","null"],
			"id": "http://jsonschema.net/syncedFilename",
			"required":false
		},
		"synced": {
			"type":["boolean","null"],
			"id": "http://jsonschema.net/synced",
			"required":false
		},
		"timestamp": {
			"type":["number","null"],
			"id": "http://jsonschema.net/timestamp",
			"required":false
		},
		"values": {
			"type":"array",
			"id": "http://jsonschema.net/values",
			"required":true,
			"items":
				{
					"type":"object",
					"id": "http://jsonschema.net/values/0",
					"required":true,
					"properties":{
						"enabled": {
							"type":["boolean","null"],
							"id": "http://jsonschema.net/values/0/enabled",
							"required":false
						},
						"key": {
							"type":"string",
							"id": "http://jsonschema.net/values/0/key",
							"required":true
						},
						"name": {
							"type":["string","null"],
							"id": "http://jsonschema.net/values/0/name",
							"required":false
						},
						"type": {
							"type":["string","null"],
							"id": "http://jsonschema.net/values/0/type",
							"required":false
						},
						"value": {
							"type":"string",
							"id": "http://jsonschema.net/values/0/value",
							"required":true
						}
					}
				}
			

		}
	}
}

},{}],3:[function(require,module,exports){
module.exports={
  "type":"array",
  "id": "http://jsonschema.net",
  "required":false,
  "title": "Postman globals file",
  "items":
    {
      "anyOf" : [ 
              { 
                "type" : "object", 
                "properties" : { 
                  "key" : { "type" : "string", "required": true },
                  "value" : { "type" : "string", "required": true },
                  "type" : {"type":["string","null"] },
                  "name" : { "type":["string","null"] },
                  "enabled" : { "type":["boolean","null"] }
                }
          }
          ]
        }
    
}

},{}],4:[function(require,module,exports){
require("./json-schema-draft-01");
require("./json-schema-draft-02");
require("./json-schema-draft-03");
},{"./json-schema-draft-01":5,"./json-schema-draft-02":6,"./json-schema-draft-03":7}],5:[function(require,module,exports){
/**
 * json-schema-draft-01 Environment
 * 
 * @fileOverview Implementation of the first revision of the JSON Schema specification draft.
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @version 1.7.1
 * @see http://github.com/garycourt/JSV
 */

/*
 * Copyright 2010 Gary Court. All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, are
 * permitted provided that the following conditions are met:
 * 
 *    1. Redistributions of source code must retain the above copyright notice, this list of
 *       conditions and the following disclaimer.
 * 
 *    2. Redistributions in binary form must reproduce the above copyright notice, this list
 *       of conditions and the following disclaimer in the documentation and/or other materials
 *       provided with the distribution.
 * 
 * THIS SOFTWARE IS PROVIDED BY GARY COURT ``AS IS'' AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL GARY COURT OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 * The views and conclusions contained in the software and documentation are those of the
 * authors and should not be interpreted as representing official policies, either expressed
 * or implied, of Gary Court or the JSON Schema specification.
 */

/*jslint white: true, sub: true, onevar: true, undef: true, eqeqeq: true, newcap: true, immed: true, indent: 4 */
/*global require */

(function () {
	var O = {},
		JSV = require('./jsv').JSV,
		ENVIRONMENT,
		TYPE_VALIDATORS,
		SCHEMA,
		HYPERSCHEMA,
		LINKS;
	
	TYPE_VALIDATORS = {
		"string" : function (instance, report) {
			return instance.getType() === "string";
		},
		
		"number" : function (instance, report) {
			return instance.getType() === "number";
		},
		
		"integer" : function (instance, report) {
			return instance.getType() === "number" && instance.getValue() % 1 === 0;
		},
		
		"boolean" : function (instance, report) {
			return instance.getType() === "boolean";
		},
		
		"object" : function (instance, report) {
			return instance.getType() === "object";
		},
		
		"array" : function (instance, report) {
			return instance.getType() === "array";
		},
		
		"null" : function (instance, report) {
			return instance.getType() === "null";
		},
		
		"any" : function (instance, report) {
			return true;
		}
	};
	
	ENVIRONMENT = new JSV.Environment();
	ENVIRONMENT.setOption("defaultFragmentDelimiter", ".");
	ENVIRONMENT.setOption("defaultSchemaURI", "http://json-schema.org/schema#");  //updated later
	
	SCHEMA = ENVIRONMENT.createSchema({
		"$schema" : "http://json-schema.org/hyper-schema#",
		"id" : "http://json-schema.org/schema#",
		"type" : "object",
		
		"properties" : {
			"type" : {
				"type" : ["string", "array"],
				"items" : {
					"type" : ["string", {"$ref" : "#"}]
				},
				"optional" : true,
				"uniqueItems" : true,
				"default" : "any",
				
				"parser" : function (instance, self) {
					var parser;
					
					if (instance.getType() === "string") {
						return instance.getValue();
					} else if (instance.getType() === "object") {
						return instance.getEnvironment().createSchema(
							instance, 
							self.getEnvironment().findSchema(self.resolveURI("#"))
						);
					} else if (instance.getType() === "array") {
						parser = self.getValueOfProperty("parser");
						return JSV.mapArray(instance.getProperties(), function (prop) {
							return parser(prop, self);
						});
					}
					//else
					return "any";
				},
			
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var requiredTypes = JSV.toArray(schema.getAttribute("type")),
						x, xl, type, subreport, typeValidators;
					
					//for instances that are required to be a certain type
					if (instance.getType() !== "undefined" && requiredTypes && requiredTypes.length) {
						typeValidators = self.getValueOfProperty("typeValidators") || {};
						
						//ensure that type matches for at least one of the required types
						for (x = 0, xl = requiredTypes.length; x < xl; ++x) {
							type = requiredTypes[x];
							if (JSV.isJSONSchema(type)) {
								subreport = JSV.createObject(report);
								subreport.errors = [];
								subreport.validated = JSV.clone(report.validated);
								if (type.validate(instance, subreport, parent, parentSchema, name).errors.length === 0) {
									return true;  //instance matches this schema
								}
							} else {
								if (typeValidators[type] !== O[type] && typeof typeValidators[type] === "function") {
									if (typeValidators[type](instance, report)) {
										return true;  //type is valid
									}
								} else {
									return true;  //unknown types are assumed valid
								}
							}
						}
						
						//if we get to this point, type is invalid
						report.addError(instance, schema, "type", "Instance is not a required type", requiredTypes);
						return false;
					}
					//else, anything is allowed if no type is specified
					return true;
				},
				
				"typeValidators" : TYPE_VALIDATORS
			},
			
			"properties" : {
				"type" : "object",
				"additionalProperties" : {"$ref" : "#"},
				"optional" : true,
				"default" : {},
				
				"parser" : function (instance, self, arg) {
					var env = instance.getEnvironment(),
						selfEnv = self.getEnvironment();
					if (instance.getType() === "object") {
						if (arg) {
							return env.createSchema(instance.getProperty(arg), selfEnv.findSchema(self.resolveURI("#")));
						} else {
							return JSV.mapObject(instance.getProperties(), function (instance) {
								return env.createSchema(instance, selfEnv.findSchema(self.resolveURI("#")));
							});
						}
					}
					//else
					return {};
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var propertySchemas, key;
					//this attribute is for object type instances only
					if (instance.getType() === "object") {
						//for each property defined in the schema
						propertySchemas = schema.getAttribute("properties");
						for (key in propertySchemas) {
							if (propertySchemas[key] !== O[key] && propertySchemas[key]) {
								//ensure that instance property is valid
								propertySchemas[key].validate(instance.getProperty(key), report, instance, schema, key);
							}
						}
					}
				}
			},
			
			"items" : {
				"type" : [{"$ref" : "#"}, "array"],
				"items" : {"$ref" : "#"},
				"optional" : true,
				"default" : {},
				
				"parser" : function (instance, self) {
					if (instance.getType() === "object") {
						return instance.getEnvironment().createSchema(instance, self.getEnvironment().findSchema(self.resolveURI("#")));
					} else if (instance.getType() === "array") {
						return JSV.mapArray(instance.getProperties(), function (instance) {
							return instance.getEnvironment().createSchema(instance, self.getEnvironment().findSchema(self.resolveURI("#")));
						});
					}
					//else
					return instance.getEnvironment().createEmptySchema();
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var properties, items, x, xl, itemSchema, additionalProperties;
					
					if (instance.getType() === "array") {
						properties = instance.getProperties();
						items = schema.getAttribute("items");
						additionalProperties = schema.getAttribute("additionalProperties");
						
						if (JSV.typeOf(items) === "array") {
							for (x = 0, xl = properties.length; x < xl; ++x) {
								itemSchema = items[x] || additionalProperties;
								if (itemSchema !== false) {
									itemSchema.validate(properties[x], report, instance, schema, x);
								} else {
									report.addError(instance, schema, "additionalProperties", "Additional items are not allowed", itemSchema);
								}
							}
						} else {
							itemSchema = items || additionalProperties;
							for (x = 0, xl = properties.length; x < xl; ++x) {
								itemSchema.validate(properties[x], report, instance, schema, x);
							}
						}
					}
				}
			},
			
			"optional" : {
				"type" : "boolean",
				"optional" : true,
				"default" : false,
				
				"parser" : function (instance, self) {
					return !!instance.getValue();
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					if (instance.getType() === "undefined" && !schema.getAttribute("optional")) {
						report.addError(instance, schema, "optional", "Property is required", false);
					}
				},
				
				"validationRequired" : true
			},
			
			"additionalProperties" : {
				"type" : [{"$ref" : "#"}, "boolean"],
				"optional" : true,
				"default" : {},
				
				"parser" : function (instance, self) {
					if (instance.getType() === "object") {
						return instance.getEnvironment().createSchema(instance, self.getEnvironment().findSchema(self.resolveURI("#")));
					} else if (instance.getType() === "boolean" && instance.getValue() === false) {
						return false;
					}
					//else
					return instance.getEnvironment().createEmptySchema();
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var additionalProperties, propertySchemas, properties, key;
					//we only need to check against object types as arrays do their own checking on this property
					if (instance.getType() === "object") {
						additionalProperties = schema.getAttribute("additionalProperties");
						propertySchemas = schema.getAttribute("properties") || {};
						properties = instance.getProperties();
						for (key in properties) {
							if (properties[key] !== O[key] && properties[key] && !propertySchemas[key]) {
								if (JSV.isJSONSchema(additionalProperties)) {
									additionalProperties.validate(properties[key], report, instance, schema, key);
								} else if (additionalProperties === false) {
									report.addError(instance, schema, "additionalProperties", "Additional properties are not allowed", additionalProperties);
								}
							}
						}
					}
				}
			},
			
			"requires" : {
				"type" : ["string", {"$ref" : "#"}],
				"optional" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "string") {
						return instance.getValue();
					} else if (instance.getType() === "object") {
						return instance.getEnvironment().createSchema(instance, self.getEnvironment().findSchema(self.resolveURI("#")));
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var requires;
					if (instance.getType() !== "undefined" && parent && parent.getType() !== "undefined") {
						requires = schema.getAttribute("requires");
						if (typeof requires === "string") {
							if (parent.getProperty(requires).getType() === "undefined") {
								report.addError(instance, schema, "requires", 'Property requires sibling property "' + requires + '"', requires);
							}
						} else if (JSV.isJSONSchema(requires)) {
							requires.validate(parent, report);  //WATCH: A "requires" schema does not support the "requires" attribute
						}
					}
				}
			},
			
			"minimum" : {
				"type" : "number",
				"optional" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var minimum, minimumCanEqual;
					if (instance.getType() === "number") {
						minimum = schema.getAttribute("minimum");
						minimumCanEqual = schema.getAttribute("minimumCanEqual");
						if (typeof minimum === "number" && (instance.getValue() < minimum || (minimumCanEqual === false && instance.getValue() === minimum))) {
							report.addError(instance, schema, "minimum", "Number is less than the required minimum value", minimum);
						}
					}
				}
			},
			
			"maximum" : {
				"type" : "number",
				"optional" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var maximum, maximumCanEqual;
					if (instance.getType() === "number") {
						maximum = schema.getAttribute("maximum");
						maximumCanEqual = schema.getAttribute("maximumCanEqual");
						if (typeof maximum === "number" && (instance.getValue() > maximum || (maximumCanEqual === false && instance.getValue() === maximum))) {
							report.addError(instance, schema, "maximum", "Number is greater than the required maximum value", maximum);
						}
					}
				}
			},
			
			"minimumCanEqual" : {
				"type" : "boolean",
				"optional" : true,
				"requires" : "minimum",
				"default" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "boolean") {
						return instance.getValue();
					}
					//else
					return true;
				}
			},
			
			"maximumCanEqual" : {
				"type" : "boolean",
				"optional" : true,
				"requires" : "maximum",
				"default" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "boolean") {
						return instance.getValue();
					}
					//else
					return true;
				}
			},
			
			"minItems" : {
				"type" : "integer",
				"optional" : true,
				"minimum" : 0,
				"default" : 0,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
					//else
					return 0;
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var minItems;
					if (instance.getType() === "array") {
						minItems = schema.getAttribute("minItems");
						if (typeof minItems === "number" && instance.getProperties().length < minItems) {
							report.addError(instance, schema, "minItems", "The number of items is less than the required minimum", minItems);
						}
					}
				}
			},
			
			"maxItems" : {
				"type" : "integer",
				"optional" : true,
				"minimum" : 0,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var maxItems;
					if (instance.getType() === "array") {
						maxItems = schema.getAttribute("maxItems");
						if (typeof maxItems === "number" && instance.getProperties().length > maxItems) {
							report.addError(instance, schema, "maxItems", "The number of items is greater than the required maximum", maxItems);
						}
					}
				}
			},
			
			"pattern" : {
				"type" : "string",
				"optional" : true,
				"format" : "regex",
				
				"parser" : function (instance, self) {
					if (instance.getType() === "string") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var pattern;
					try {
						pattern = new RegExp(schema.getAttribute("pattern"));
						if (instance.getType() === "string" && pattern && !pattern.test(instance.getValue())) {
							report.addError(instance, schema, "pattern", "String does not match pattern", pattern.toString());
						}
					} catch (e) {
						report.addError(instance, schema, "pattern", "Invalid pattern", e);
					}
				}
			},
			
			"minLength" : {
				"type" : "integer",
				"optional" : true,
				"minimum" : 0,
				"default" : 0,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
					//else
					return 0;
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var minLength;
					if (instance.getType() === "string") {
						minLength = schema.getAttribute("minLength");
						if (typeof minLength === "number" && instance.getValue().length < minLength) {
							report.addError(instance, schema, "minLength", "String is less than the required minimum length", minLength);
						}
					}
				}
			},
			
			"maxLength" : {
				"type" : "integer",
				"optional" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var maxLength;
					if (instance.getType() === "string") {
						maxLength = schema.getAttribute("maxLength");
						if (typeof maxLength === "number" && instance.getValue().length > maxLength) {
							report.addError(instance, schema, "maxLength", "String is greater than the required maximum length", maxLength);
						}
					}
				}
			},
			
			"enum" : {
				"type" : "array",
				"optional" : true,
				"minItems" : 1,
				"uniqueItems" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "array") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var enums, x, xl;
					if (instance.getType() !== "undefined") {
						enums = schema.getAttribute("enum");
						if (enums) {
							for (x = 0, xl = enums.length; x < xl; ++x) {
								if (instance.equals(enums[x])) {
									return true;
								}
							}
							report.addError(instance, schema, "enum", "Instance is not one of the possible values", enums);
						}
					}
				}
			},
			
			"title" : {
				"type" : "string",
				"optional" : true
			},
			
			"description" : {
				"type" : "string",
				"optional" : true
			},
			
			"format" : {
				"type" : "string",
				"optional" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "string") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var format, formatValidators;
					if (instance.getType() === "string") {
						format = schema.getAttribute("format");
						formatValidators = self.getValueOfProperty("formatValidators");
						if (typeof format === "string" && formatValidators[format] !== O[format] && typeof formatValidators[format] === "function" && !formatValidators[format].call(this, instance, report)) {
							report.addError(instance, schema, "format", "String is not in the required format", format);
						}
					}
				},
				
				"formatValidators" : {}
			},
			
			"contentEncoding" : {
				"type" : "string",
				"optional" : true
			},
			
			"default" : {
				"type" : "any",
				"optional" : true
			},
			
			"maxDecimal" : {
				"type" : "integer",
				"optional" : true,
				"minimum" : 0,
								
				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var maxDecimal, decimals;
					if (instance.getType() === "number") {
						maxDecimal = schema.getAttribute("maxDecimal");
						if (typeof maxDecimal === "number") {
							decimals = instance.getValue().toString(10).split('.')[1];
							if (decimals && decimals.length > maxDecimal) {
								report.addError(instance, schema, "maxDecimal", "The number of decimal places is greater than the allowed maximum", maxDecimal);
							}
						}
					}
				}
			},
			
			"disallow" : {
				"type" : ["string", "array"],
				"items" : {"type" : "string"},
				"optional" : true,
				"uniqueItems" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "string" || instance.getType() === "array") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var disallowedTypes = JSV.toArray(schema.getAttribute("disallow")),
						x, xl, key, typeValidators;
					
					//for instances that are required to be a certain type
					if (instance.getType() !== "undefined" && disallowedTypes && disallowedTypes.length) {
						typeValidators = self.getValueOfProperty("typeValidators") || {};
						
						//ensure that type matches for at least one of the required types
						for (x = 0, xl = disallowedTypes.length; x < xl; ++x) {
							key = disallowedTypes[x];
							if (typeValidators[key] !== O[key] && typeof typeValidators[key] === "function") {
								if (typeValidators[key](instance, report)) {
									report.addError(instance, schema, "disallow", "Instance is a disallowed type", disallowedTypes);
									return false;
								}
							} 
							/*
							else {
								report.addError(instance, schema, "disallow", "Instance may be a disallowed type", disallowedTypes);
								return false;
							}
							*/
						}
						
						//if we get to this point, type is valid
						return true;
					}
					//else, everything is allowed if no disallowed types are specified
					return true;
				},
				
				"typeValidators" : TYPE_VALIDATORS
			},
		
			"extends" : {
				"type" : [{"$ref" : "#"}, "array"],
				"items" : {"$ref" : "#"},
				"optional" : true,
				"default" : {},
				
				"parser" : function (instance, self) {
					if (instance.getType() === "object") {
						return instance.getEnvironment().createSchema(instance, self.getEnvironment().findSchema(self.resolveURI("#")));
					} else if (instance.getType() === "array") {
						return JSV.mapArray(instance.getProperties(), function (instance) {
							return instance.getEnvironment().createSchema(instance, self.getEnvironment().findSchema(self.resolveURI("#")));
						});
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var extensions = schema.getAttribute("extends"), x, xl;
					if (extensions) {
						if (JSV.isJSONSchema(extensions)) {
							extensions.validate(instance, report, parent, parentSchema, name);
						} else if (JSV.typeOf(extensions) === "array") {
							for (x = 0, xl = extensions.length; x < xl; ++x) {
								extensions[x].validate(instance, report, parent, parentSchema, name);
							}
						}
					}
				}
			}
		},
		
		"optional" : true,
		"default" : {},
		"fragmentResolution" : "dot-delimited",
		
		"parser" : function (instance, self) {
			if (instance.getType() === "object") {
				return instance.getEnvironment().createSchema(instance, self);
			}
		},
		
		"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
			var propNames = schema.getPropertyNames(), 
				x, xl,
				attributeSchemas = self.getAttribute("properties"),
				validator;
			
			for (x in attributeSchemas) {
				if (attributeSchemas[x] !== O[x] && attributeSchemas[x].getValueOfProperty("validationRequired")) {
					JSV.pushUnique(propNames, x);
				}
			}
			
			for (x = 0, xl = propNames.length; x < xl; ++x) {
				if (attributeSchemas[propNames[x]] !== O[propNames[x]]) {
					validator = attributeSchemas[propNames[x]].getValueOfProperty("validator");
					if (typeof validator === "function") {
						validator(instance, schema, attributeSchemas[propNames[x]], report, parent, parentSchema, name);
					}
				}
			}
		},
				
		"initializer" : function (instance) {
			var link, extension, extended;
			
			//if there is a link to a different schema, set reference
			link = instance._schema.getLink("describedby", instance);
			if (link && instance._schema._uri !== link) {
				instance.setReference("describedby", link);
			}
			
			//if instance has a URI link to itself, update it's own URI
			link = instance._schema.getLink("self", instance);
			if (JSV.typeOf(link) === "string") {
				instance._uri = JSV.formatURI(link);
			}
			
			//if there is a link to the full representation, set reference
			link = instance._schema.getLink("full", instance);
			if (link && instance._uri !== link) {
				instance.setReference("full", link);
			}
			
			//extend schema
			extension = instance.getAttribute("extends");
			if (JSV.isJSONSchema(extension)) {
				extended = JSV.inherits(extension, instance, true);
				instance = instance._env.createSchema(extended, instance._schema, instance._uri);
			}
			
			return instance;
		}
	}, true, "http://json-schema.org/schema#");
	
	HYPERSCHEMA = ENVIRONMENT.createSchema(JSV.inherits(SCHEMA, ENVIRONMENT.createSchema({
		"$schema" : "http://json-schema.org/hyper-schema#",
		"id" : "http://json-schema.org/hyper-schema#",
	
		"properties" : {
			"links" : {
				"type" : "array",
				"items" : {"$ref" : "links#"},
				"optional" : true,
				
				"parser" : function (instance, self, arg) {
					var links,
						linkSchemaURI = self.getValueOfProperty("items")["$ref"],
						linkSchema = self.getEnvironment().findSchema(linkSchemaURI),
						linkParser = linkSchema && linkSchema.getValueOfProperty("parser");
					arg = JSV.toArray(arg);
					
					if (typeof linkParser === "function") {
						links = JSV.mapArray(instance.getProperties(), function (link) {
							return linkParser(link, linkSchema);
						});
					} else {
						links = JSV.toArray(instance.getValue());
					}
					
					if (arg[0]) {
						links = JSV.filterArray(links, function (link) {
							return link["rel"] === arg[0];
						});
					}
					
					if (arg[1]) {
						links = JSV.mapArray(links, function (link) {
							var instance = arg[1],
								href = link["href"];
							href = href.replace(/\{(.+)\}/g, function (str, p1, offset, s) {
								var value; 
								if (p1 === "-this") {
									value = instance.getValue();
								} else {
									value = instance.getValueOfProperty(p1);
								}
								return value !== undefined ? String(value) : "";
							});
							return href ? JSV.formatURI(instance.resolveURI(href)) : href;
						});
					}
					
					return links;
				}
			},
			
			"fragmentResolution" : {
				"type" : "string",
				"optional" : true,
				"default" : "dot-delimited"
			},
			
			"root" : {
				"type" : "boolean",
				"optional" : true,
				"default" : false
			},
			
			"readonly" : {
				"type" : "boolean",
				"optional" : true,
				"default" : false
			},
			
			"pathStart" : {
				"type" : "string",
				"optional" : true,
				"format" : "uri",
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var pathStart;
					if (instance.getType() !== "undefined") {
						pathStart = schema.getAttribute("pathStart");
						if (typeof pathStart === "string") {
							//TODO: Find out what pathStart is relative to
							if (instance.getURI().indexOf(pathStart) !== 0) {
								report.addError(instance, schema, "pathStart", "Instance's URI does not start with " + pathStart, pathStart);
							}
						}
					}
				}
			},
			
			"mediaType" : {
				"type" : "string",
				"optional" : true,
				"format" : "media-type"
			},
			
			"alternate" : {
				"type" : "array",
				"items" : {"$ref" : "#"},
				"optional" : true
			}
		},
		
		"links" : [
			{
				"href" : "{$ref}",
				"rel" : "full"
			},
			
			{
				"href" : "{$schema}",
				"rel" : "describedby"
			},
			
			{
				"href" : "{id}",
				"rel" : "self"
			}
		]//,
		
		//not needed as JSV.inherits does the job for us
		//"extends" : {"$ref" : "http://json-schema.org/schema#"}
	}, SCHEMA), true), true, "http://json-schema.org/hyper-schema#");
	
	ENVIRONMENT.setOption("defaultSchemaURI", "http://json-schema.org/hyper-schema#");
	
	LINKS = ENVIRONMENT.createSchema({
		"$schema" : "http://json-schema.org/hyper-schema#",
		"id" : "http://json-schema.org/links#",
		"type" : "object",
		
		"properties" : {
			"href" : {
				"type" : "string"
			},
			
			"rel" : {
				"type" : "string"
			},
			
			"method" : {
				"type" : "string",
				"default" : "GET",
				"optional" : true
			},
			
			"enctype" : {
				"type" : "string",
				"requires" : "method",
				"optional" : true
			},
			
			"properties" : {
				"type" : "object",
				"additionalProperties" : {"$ref" : "hyper-schema#"},
				"optional" : true,
				
				"parser" : function (instance, self, arg) {
					var env = instance.getEnvironment(),
						selfEnv = self.getEnvironment(),
						additionalPropertiesSchemaURI = self.getValueOfProperty("additionalProperties")["$ref"];
					if (instance.getType() === "object") {
						if (arg) {
							return env.createSchema(instance.getProperty(arg), selfEnv.findSchema(self.resolveURI(additionalPropertiesSchemaURI)));
						} else {
							return JSV.mapObject(instance.getProperties(), function (instance) {
								return env.createSchema(instance, selfEnv.findSchema(self.resolveURI(additionalPropertiesSchemaURI)));
							});
						}
					}
				}
			}
		},
		
		"parser" : function (instance, self) {
			var selfProperties = self.getProperty("properties");
			if (instance.getType() === "object") {
				return JSV.mapObject(instance.getProperties(), function (property, key) {
					var propertySchema = selfProperties.getProperty(key),
						parser = propertySchema && propertySchema.getValueOfProperty("parser");
					if (typeof parser === "function") {
						return parser(property, propertySchema);
					}
					//else
					return property.getValue();
				});
			}
			return instance.getValue();
		}
	}, HYPERSCHEMA, "http://json-schema.org/links#");
	
	JSV.registerEnvironment("json-schema-draft-00", ENVIRONMENT);
	JSV.registerEnvironment("json-schema-draft-01", JSV.createEnvironment("json-schema-draft-00"));
	
	if (!JSV.getDefaultEnvironmentID()) {
		JSV.setDefaultEnvironmentID("json-schema-draft-01");
	}
	
}());
},{"./jsv":8}],6:[function(require,module,exports){
/**
 * json-schema-draft-02 Environment
 * 
 * @fileOverview Implementation of the second revision of the JSON Schema specification draft.
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @version 1.7.1
 * @see http://github.com/garycourt/JSV
 */

/*
 * Copyright 2010 Gary Court. All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, are
 * permitted provided that the following conditions are met:
 * 
 *    1. Redistributions of source code must retain the above copyright notice, this list of
 *       conditions and the following disclaimer.
 * 
 *    2. Redistributions in binary form must reproduce the above copyright notice, this list
 *       of conditions and the following disclaimer in the documentation and/or other materials
 *       provided with the distribution.
 * 
 * THIS SOFTWARE IS PROVIDED BY GARY COURT ``AS IS'' AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL GARY COURT OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 * The views and conclusions contained in the software and documentation are those of the
 * authors and should not be interpreted as representing official policies, either expressed
 * or implied, of Gary Court or the JSON Schema specification.
 */

/*jslint white: true, sub: true, onevar: true, undef: true, eqeqeq: true, newcap: true, immed: true, indent: 4 */
/*global require */

(function () {
	var O = {},
		JSV = require('./jsv').JSV,
		ENVIRONMENT,
		TYPE_VALIDATORS,
		SCHEMA,
		HYPERSCHEMA,
		LINKS;
	
	TYPE_VALIDATORS = {
		"string" : function (instance, report) {
			return instance.getType() === "string";
		},
		
		"number" : function (instance, report) {
			return instance.getType() === "number";
		},
		
		"integer" : function (instance, report) {
			return instance.getType() === "number" && instance.getValue() % 1 === 0;
		},
		
		"boolean" : function (instance, report) {
			return instance.getType() === "boolean";
		},
		
		"object" : function (instance, report) {
			return instance.getType() === "object";
		},
		
		"array" : function (instance, report) {
			return instance.getType() === "array";
		},
		
		"null" : function (instance, report) {
			return instance.getType() === "null";
		},
		
		"any" : function (instance, report) {
			return true;
		}
	};
	
	ENVIRONMENT = new JSV.Environment();
	ENVIRONMENT.setOption("defaultFragmentDelimiter", "/");
	ENVIRONMENT.setOption("defaultSchemaURI", "http://json-schema.org/schema#");  //updated later
	
	SCHEMA = ENVIRONMENT.createSchema({
		"$schema" : "http://json-schema.org/hyper-schema#",
		"id" : "http://json-schema.org/schema#",
		"type" : "object",
		
		"properties" : {
			"type" : {
				"type" : ["string", "array"],
				"items" : {
					"type" : ["string", {"$ref" : "#"}]
				},
				"optional" : true,
				"uniqueItems" : true,
				"default" : "any",
				
				"parser" : function (instance, self) {
					var parser;
					
					if (instance.getType() === "string") {
						return instance.getValue();
					} else if (instance.getType() === "object") {
						return instance.getEnvironment().createSchema(
							instance, 
							self.getEnvironment().findSchema(self.resolveURI("#"))
						);
					} else if (instance.getType() === "array") {
						parser = self.getValueOfProperty("parser");
						return JSV.mapArray(instance.getProperties(), function (prop) {
							return parser(prop, self);
						});
					}
					//else
					return "any";
				},
			
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var requiredTypes = JSV.toArray(schema.getAttribute("type")),
						x, xl, type, subreport, typeValidators;
					
					//for instances that are required to be a certain type
					if (instance.getType() !== "undefined" && requiredTypes && requiredTypes.length) {
						typeValidators = self.getValueOfProperty("typeValidators") || {};
						
						//ensure that type matches for at least one of the required types
						for (x = 0, xl = requiredTypes.length; x < xl; ++x) {
							type = requiredTypes[x];
							if (JSV.isJSONSchema(type)) {
								subreport = JSV.createObject(report);
								subreport.errors = [];
								subreport.validated = JSV.clone(report.validated);
								if (type.validate(instance, subreport, parent, parentSchema, name).errors.length === 0) {
									return true;  //instance matches this schema
								}
							} else {
								if (typeValidators[type] !== O[type] && typeof typeValidators[type] === "function") {
									if (typeValidators[type](instance, report)) {
										return true;  //type is valid
									}
								} else {
									return true;  //unknown types are assumed valid
								}
							}
						}
						
						//if we get to this point, type is invalid
						report.addError(instance, schema, "type", "Instance is not a required type", requiredTypes);
						return false;
					}
					//else, anything is allowed if no type is specified
					return true;
				},
				
				"typeValidators" : TYPE_VALIDATORS
			},
			
			"properties" : {
				"type" : "object",
				"additionalProperties" : {"$ref" : "#"},
				"optional" : true,
				"default" : {},
				
				"parser" : function (instance, self, arg) {
					var env = instance.getEnvironment(),
						selfEnv = self.getEnvironment();
					if (instance.getType() === "object") {
						if (arg) {
							return env.createSchema(instance.getProperty(arg), selfEnv.findSchema(self.resolveURI("#")));
						} else {
							return JSV.mapObject(instance.getProperties(), function (instance) {
								return env.createSchema(instance, selfEnv.findSchema(self.resolveURI("#")));
							});
						}
					}
					//else
					return {};
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var propertySchemas, key;
					//this attribute is for object type instances only
					if (instance.getType() === "object") {
						//for each property defined in the schema
						propertySchemas = schema.getAttribute("properties");
						for (key in propertySchemas) {
							if (propertySchemas[key] !== O[key] && propertySchemas[key]) {
								//ensure that instance property is valid
								propertySchemas[key].validate(instance.getProperty(key), report, instance, schema, key);
							}
						}
					}
				}
			},
			
			"items" : {
				"type" : [{"$ref" : "#"}, "array"],
				"items" : {"$ref" : "#"},
				"optional" : true,
				"default" : {},
				
				"parser" : function (instance, self) {
					if (instance.getType() === "object") {
						return instance.getEnvironment().createSchema(instance, self.getEnvironment().findSchema(self.resolveURI("#")));
					} else if (instance.getType() === "array") {
						return JSV.mapArray(instance.getProperties(), function (instance) {
							return instance.getEnvironment().createSchema(instance, self.getEnvironment().findSchema(self.resolveURI("#")));
						});
					}
					//else
					return instance.getEnvironment().createEmptySchema();
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var properties, items, x, xl, itemSchema, additionalProperties;
					
					if (instance.getType() === "array") {
						properties = instance.getProperties();
						items = schema.getAttribute("items");
						additionalProperties = schema.getAttribute("additionalProperties");
						
						if (JSV.typeOf(items) === "array") {
							for (x = 0, xl = properties.length; x < xl; ++x) {
								itemSchema = items[x] || additionalProperties;
								if (itemSchema !== false) {
									itemSchema.validate(properties[x], report, instance, schema, x);
								} else {
									report.addError(instance, schema, "additionalProperties", "Additional items are not allowed", itemSchema);
								}
							}
						} else {
							itemSchema = items || additionalProperties;
							for (x = 0, xl = properties.length; x < xl; ++x) {
								itemSchema.validate(properties[x], report, instance, schema, x);
							}
						}
					}
				}
			},
			
			"optional" : {
				"type" : "boolean",
				"optional" : true,
				"default" : false,
				
				"parser" : function (instance, self) {
					return !!instance.getValue();
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					if (instance.getType() === "undefined" && !schema.getAttribute("optional")) {
						report.addError(instance, schema, "optional", "Property is required", false);
					}
				},
				
				"validationRequired" : true
			},
			
			"additionalProperties" : {
				"type" : [{"$ref" : "#"}, "boolean"],
				"optional" : true,
				"default" : {},
				
				"parser" : function (instance, self) {
					if (instance.getType() === "object") {
						return instance.getEnvironment().createSchema(instance, self.getEnvironment().findSchema(self.resolveURI("#")));
					} else if (instance.getType() === "boolean" && instance.getValue() === false) {
						return false;
					}
					//else
					return instance.getEnvironment().createEmptySchema();
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var additionalProperties, propertySchemas, properties, key;
					//we only need to check against object types as arrays do their own checking on this property
					if (instance.getType() === "object") {
						additionalProperties = schema.getAttribute("additionalProperties");
						propertySchemas = schema.getAttribute("properties") || {};
						properties = instance.getProperties();
						for (key in properties) {
							if (properties[key] !== O[key] && properties[key] && !propertySchemas[key]) {
								if (JSV.isJSONSchema(additionalProperties)) {
									additionalProperties.validate(properties[key], report, instance, schema, key);
								} else if (additionalProperties === false) {
									report.addError(instance, schema, "additionalProperties", "Additional properties are not allowed", additionalProperties);
								}
							}
						}
					}
				}
			},
			
			"requires" : {
				"type" : ["string", {"$ref" : "#"}],
				"optional" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "string") {
						return instance.getValue();
					} else if (instance.getType() === "object") {
						return instance.getEnvironment().createSchema(instance, self.getEnvironment().findSchema(self.resolveURI("#")));
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var requires;
					if (instance.getType() !== "undefined" && parent && parent.getType() !== "undefined") {
						requires = schema.getAttribute("requires");
						if (typeof requires === "string") {
							if (parent.getProperty(requires).getType() === "undefined") {
								report.addError(instance, schema, "requires", 'Property requires sibling property "' + requires + '"', requires);
							}
						} else if (JSV.isJSONSchema(requires)) {
							requires.validate(parent, report);  //WATCH: A "requires" schema does not support the "requires" attribute
						}
					}
				}
			},
			
			"minimum" : {
				"type" : "number",
				"optional" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var minimum, minimumCanEqual;
					if (instance.getType() === "number") {
						minimum = schema.getAttribute("minimum");
						minimumCanEqual = schema.getAttribute("minimumCanEqual");
						if (typeof minimum === "number" && (instance.getValue() < minimum || (minimumCanEqual === false && instance.getValue() === minimum))) {
							report.addError(instance, schema, "minimum", "Number is less than the required minimum value", minimum);
						}
					}
				}
			},
			
			"maximum" : {
				"type" : "number",
				"optional" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var maximum, maximumCanEqual;
					if (instance.getType() === "number") {
						maximum = schema.getAttribute("maximum");
						maximumCanEqual = schema.getAttribute("maximumCanEqual");
						if (typeof maximum === "number" && (instance.getValue() > maximum || (maximumCanEqual === false && instance.getValue() === maximum))) {
							report.addError(instance, schema, "maximum", "Number is greater than the required maximum value", maximum);
						}
					}
				}
			},
			
			"minimumCanEqual" : {
				"type" : "boolean",
				"optional" : true,
				"requires" : "minimum",
				"default" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "boolean") {
						return instance.getValue();
					}
					//else
					return true;
				}
			},
			
			"maximumCanEqual" : {
				"type" : "boolean",
				"optional" : true,
				"requires" : "maximum",
				"default" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "boolean") {
						return instance.getValue();
					}
					//else
					return true;
				}
			},
			
			"minItems" : {
				"type" : "integer",
				"optional" : true,
				"minimum" : 0,
				"default" : 0,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
					//else
					return 0;
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var minItems;
					if (instance.getType() === "array") {
						minItems = schema.getAttribute("minItems");
						if (typeof minItems === "number" && instance.getProperties().length < minItems) {
							report.addError(instance, schema, "minItems", "The number of items is less than the required minimum", minItems);
						}
					}
				}
			},
			
			"maxItems" : {
				"type" : "integer",
				"optional" : true,
				"minimum" : 0,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var maxItems;
					if (instance.getType() === "array") {
						maxItems = schema.getAttribute("maxItems");
						if (typeof maxItems === "number" && instance.getProperties().length > maxItems) {
							report.addError(instance, schema, "maxItems", "The number of items is greater than the required maximum", maxItems);
						}
					}
				}
			},
			
			"uniqueItems" : {
				"type" : "boolean",
				"optional" : true,
				"default" : false,
				
				"parser" : function (instance, self) {
					return !!instance.getValue();
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var value, x, xl, y, yl;
					if (instance.getType() === "array" && schema.getAttribute("uniqueItems")) {
						value = instance.getProperties();
						for (x = 0, xl = value.length - 1; x < xl; ++x) {
							for (y = x + 1, yl = value.length; y < yl; ++y) {
								if (value[x].equals(value[y])) {
									report.addError(instance, schema, "uniqueItems", "Array can only contain unique items", { x : x, y : y });
								}
							}
						}
					}
				}
			},
			
			"pattern" : {
				"type" : "string",
				"optional" : true,
				"format" : "regex",
				
				"parser" : function (instance, self) {
					if (instance.getType() === "string") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var pattern;
					try {
						pattern = new RegExp(schema.getAttribute("pattern"));
						if (instance.getType() === "string" && pattern && !pattern.test(instance.getValue())) {
							report.addError(instance, schema, "pattern", "String does not match pattern", pattern.toString());
						}
					} catch (e) {
						report.addError(instance, schema, "pattern", "Invalid pattern", e);
					}
				}
			},
			
			"minLength" : {
				"type" : "integer",
				"optional" : true,
				"minimum" : 0,
				"default" : 0,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
					//else
					return 0;
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var minLength;
					if (instance.getType() === "string") {
						minLength = schema.getAttribute("minLength");
						if (typeof minLength === "number" && instance.getValue().length < minLength) {
							report.addError(instance, schema, "minLength", "String is less than the required minimum length", minLength);
						}
					}
				}
			},
			
			"maxLength" : {
				"type" : "integer",
				"optional" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var maxLength;
					if (instance.getType() === "string") {
						maxLength = schema.getAttribute("maxLength");
						if (typeof maxLength === "number" && instance.getValue().length > maxLength) {
							report.addError(instance, schema, "maxLength", "String is greater than the required maximum length", maxLength);
						}
					}
				}
			},
			
			"enum" : {
				"type" : "array",
				"optional" : true,
				"minItems" : 1,
				"uniqueItems" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "array") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var enums, x, xl;
					if (instance.getType() !== "undefined") {
						enums = schema.getAttribute("enum");
						if (enums) {
							for (x = 0, xl = enums.length; x < xl; ++x) {
								if (instance.equals(enums[x])) {
									return true;
								}
							}
							report.addError(instance, schema, "enum", "Instance is not one of the possible values", enums);
						}
					}
				}
			},
			
			"title" : {
				"type" : "string",
				"optional" : true
			},
			
			"description" : {
				"type" : "string",
				"optional" : true
			},
			
			"format" : {
				"type" : "string",
				"optional" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "string") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var format, formatValidators;
					if (instance.getType() === "string") {
						format = schema.getAttribute("format");
						formatValidators = self.getValueOfProperty("formatValidators");
						if (typeof format === "string" && formatValidators[format] !== O[format] && typeof formatValidators[format] === "function" && !formatValidators[format].call(this, instance, report)) {
							report.addError(instance, schema, "format", "String is not in the required format", format);
						}
					}
				},
				
				"formatValidators" : {}
			},
			
			"contentEncoding" : {
				"type" : "string",
				"optional" : true
			},
			
			"default" : {
				"type" : "any",
				"optional" : true
			},
			
			"divisibleBy" : {
				"type" : "number",
				"minimum" : 0,
				"minimumCanEqual" : false,
				"optional" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var divisor;
					if (instance.getType() === "number") {
						divisor = schema.getAttribute("divisibleBy");
						if (divisor === 0) {
							report.addError(instance, schema, "divisibleBy", "Nothing is divisible by 0", divisor);
						} else if (divisor !== 1 && ((instance.getValue() / divisor) % 1) !== 0) {
							report.addError(instance, schema, "divisibleBy", "Number is not divisible by " + divisor, divisor);
						}
					}
				}
			},
			
			"disallow" : {
				"type" : ["string", "array"],
				"items" : {"type" : "string"},
				"optional" : true,
				"uniqueItems" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "string" || instance.getType() === "array") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var disallowedTypes = JSV.toArray(schema.getAttribute("disallow")),
						x, xl, key, typeValidators;
					
					//for instances that are required to be a certain type
					if (instance.getType() !== "undefined" && disallowedTypes && disallowedTypes.length) {
						typeValidators = self.getValueOfProperty("typeValidators") || {};
						
						//ensure that type matches for at least one of the required types
						for (x = 0, xl = disallowedTypes.length; x < xl; ++x) {
							key = disallowedTypes[x];
							if (typeValidators[key] !== O[key] && typeof typeValidators[key] === "function") {
								if (typeValidators[key](instance, report)) {
									report.addError(instance, schema, "disallow", "Instance is a disallowed type", disallowedTypes);
									return false;
								}
							} 
							/*
							else {
								report.addError(instance, schema, "disallow", "Instance may be a disallowed type", disallowedTypes);
								return false;
							}
							*/
						}
						
						//if we get to this point, type is valid
						return true;
					}
					//else, everything is allowed if no disallowed types are specified
					return true;
				},
				
				"typeValidators" : TYPE_VALIDATORS
			},
		
			"extends" : {
				"type" : [{"$ref" : "#"}, "array"],
				"items" : {"$ref" : "#"},
				"optional" : true,
				"default" : {},
				
				"parser" : function (instance, self) {
					if (instance.getType() === "object") {
						return instance.getEnvironment().createSchema(instance, self.getEnvironment().findSchema(self.resolveURI("#")));
					} else if (instance.getType() === "array") {
						return JSV.mapArray(instance.getProperties(), function (instance) {
							return instance.getEnvironment().createSchema(instance, self.getEnvironment().findSchema(self.resolveURI("#")));
						});
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var extensions = schema.getAttribute("extends"), x, xl;
					if (extensions) {
						if (JSV.isJSONSchema(extensions)) {
							extensions.validate(instance, report, parent, parentSchema, name);
						} else if (JSV.typeOf(extensions) === "array") {
							for (x = 0, xl = extensions.length; x < xl; ++x) {
								extensions[x].validate(instance, report, parent, parentSchema, name);
							}
						}
					}
				}
			}
		},
		
		"optional" : true,
		"default" : {},
		"fragmentResolution" : "slash-delimited",
		
		"parser" : function (instance, self) {
			if (instance.getType() === "object") {
				return instance.getEnvironment().createSchema(instance, self);
			}
		},
		
		"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
			var propNames = schema.getPropertyNames(), 
				x, xl,
				attributeSchemas = self.getAttribute("properties"),
				validator;
			
			for (x in attributeSchemas) {
				if (attributeSchemas[x] !== O[x] && attributeSchemas[x].getValueOfProperty("validationRequired")) {
					JSV.pushUnique(propNames, x);
				}
			}
			
			for (x = 0, xl = propNames.length; x < xl; ++x) {
				if (attributeSchemas[propNames[x]] !== O[propNames[x]]) {
					validator = attributeSchemas[propNames[x]].getValueOfProperty("validator");
					if (typeof validator === "function") {
						validator(instance, schema, attributeSchemas[propNames[x]], report, parent, parentSchema, name);
					}
				}
			}
		},
				
		"initializer" : function (instance) {
			var link, extension, extended;
			
			//if there is a link to a different schema, set reference
			link = instance._schema.getLink("describedby", instance);
			if (link && instance._schema._uri !== link) {
				instance.setReference("describedby", link);
			}
			
			//if instance has a URI link to itself, update it's own URI
			link = instance._schema.getLink("self", instance);
			if (JSV.typeOf(link) === "string") {
				instance._uri = JSV.formatURI(link);
			}
			
			//if there is a link to the full representation, set reference
			link = instance._schema.getLink("full", instance);
			if (link && instance._uri !== link) {
				instance.setReference("full", link);
			}
			
			//extend schema
			extension = instance.getAttribute("extends");
			if (JSV.isJSONSchema(extension)) {
				extended = JSV.inherits(extension, instance, true);
				instance = instance._env.createSchema(extended, instance._schema, instance._uri);
			}
			
			return instance;
		}
	}, true, "http://json-schema.org/schema#");
	
	HYPERSCHEMA = ENVIRONMENT.createSchema(JSV.inherits(SCHEMA, ENVIRONMENT.createSchema({
		"$schema" : "http://json-schema.org/hyper-schema#",
		"id" : "http://json-schema.org/hyper-schema#",
	
		"properties" : {
			"links" : {
				"type" : "array",
				"items" : {"$ref" : "links#"},
				"optional" : true,
				
				"parser" : function (instance, self, arg) {
					var links,
						linkSchemaURI = self.getValueOfProperty("items")["$ref"],
						linkSchema = self.getEnvironment().findSchema(linkSchemaURI),
						linkParser = linkSchema && linkSchema.getValueOfProperty("parser");
					arg = JSV.toArray(arg);
					
					if (typeof linkParser === "function") {
						links = JSV.mapArray(instance.getProperties(), function (link) {
							return linkParser(link, linkSchema);
						});
					} else {
						links = JSV.toArray(instance.getValue());
					}
					
					if (arg[0]) {
						links = JSV.filterArray(links, function (link) {
							return link["rel"] === arg[0];
						});
					}
					
					if (arg[1]) {
						links = JSV.mapArray(links, function (link) {
							var instance = arg[1],
								href = link["href"];
							href = href.replace(/\{(.+)\}/g, function (str, p1, offset, s) {
								var value; 
								if (p1 === "-this") {
									value = instance.getValue();
								} else {
									value = instance.getValueOfProperty(p1);
								}
								return value !== undefined ? String(value) : "";
							});
							return href ? JSV.formatURI(instance.resolveURI(href)) : href;
						});
					}
					
					return links;
				}
			},
			
			"fragmentResolution" : {
				"type" : "string",
				"optional" : true,
				"default" : "slash-delimited"
			},
			
			"root" : {
				"type" : "boolean",
				"optional" : true,
				"default" : false
			},
			
			"readonly" : {
				"type" : "boolean",
				"optional" : true,
				"default" : false
			},
			
			"pathStart" : {
				"type" : "string",
				"optional" : true,
				"format" : "uri",
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var pathStart;
					if (instance.getType() !== "undefined") {
						pathStart = schema.getAttribute("pathStart");
						if (typeof pathStart === "string") {
							//TODO: Find out what pathStart is relative to
							if (instance.getURI().indexOf(pathStart) !== 0) {
								report.addError(instance, schema, "pathStart", "Instance's URI does not start with " + pathStart, pathStart);
							}
						}
					}
				}
			},
			
			"mediaType" : {
				"type" : "string",
				"optional" : true,
				"format" : "media-type"
			},
			
			"alternate" : {
				"type" : "array",
				"items" : {"$ref" : "#"},
				"optional" : true
			}
		},
		
		"links" : [
			{
				"href" : "{$ref}",
				"rel" : "full"
			},
			
			{
				"href" : "{$schema}",
				"rel" : "describedby"
			},
			
			{
				"href" : "{id}",
				"rel" : "self"
			}
		]//,
		
		//not needed as JSV.inherits does the job for us
		//"extends" : {"$ref" : "http://json-schema.org/schema#"}
	}, SCHEMA), true), true, "http://json-schema.org/hyper-schema#");
	
	ENVIRONMENT.setOption("defaultSchemaURI", "http://json-schema.org/hyper-schema#");
	
	LINKS = ENVIRONMENT.createSchema({
		"$schema" : "http://json-schema.org/hyper-schema#",
		"id" : "http://json-schema.org/links#",
		"type" : "object",
		
		"properties" : {
			"href" : {
				"type" : "string"
			},
			
			"rel" : {
				"type" : "string"
			},
			
			"targetSchema" : {
				"$ref" : "hyper-schema#",
				
				//need this here because parsers are run before links are resolved
				"parser" : HYPERSCHEMA.getAttribute("parser")
			},
			
			"method" : {
				"type" : "string",
				"default" : "GET",
				"optional" : true
			},
			
			"enctype" : {
				"type" : "string",
				"requires" : "method",
				"optional" : true
			},
			
			"properties" : {
				"type" : "object",
				"additionalProperties" : {"$ref" : "hyper-schema#"},
				"optional" : true,
				
				"parser" : function (instance, self, arg) {
					var env = instance.getEnvironment(),
						selfEnv = self.getEnvironment(),
						additionalPropertiesSchemaURI = self.getValueOfProperty("additionalProperties")["$ref"];
					if (instance.getType() === "object") {
						if (arg) {
							return env.createSchema(instance.getProperty(arg), selfEnv.findSchema(self.resolveURI(additionalPropertiesSchemaURI)));
						} else {
							return JSV.mapObject(instance.getProperties(), function (instance) {
								return env.createSchema(instance, selfEnv.findSchema(self.resolveURI(additionalPropertiesSchemaURI)));
							});
						}
					}
				}
			}
		},
		
		"parser" : function (instance, self) {
			var selfProperties = self.getProperty("properties");
			if (instance.getType() === "object") {
				return JSV.mapObject(instance.getProperties(), function (property, key) {
					var propertySchema = selfProperties.getProperty(key),
						parser = propertySchema && propertySchema.getValueOfProperty("parser");
					if (typeof parser === "function") {
						return parser(property, propertySchema);
					}
					//else
					return property.getValue();
				});
			}
			return instance.getValue();
		}
	}, HYPERSCHEMA, "http://json-schema.org/links#");
	
	JSV.registerEnvironment("json-schema-draft-02", ENVIRONMENT);
	if (!JSV.getDefaultEnvironmentID() || JSV.getDefaultEnvironmentID() === "json-schema-draft-01") {
		JSV.setDefaultEnvironmentID("json-schema-draft-02");
	}
	
}());
},{"./jsv":8}],7:[function(require,module,exports){
/**
 * json-schema-draft-03 Environment
 * 
 * @fileOverview Implementation of the third revision of the JSON Schema specification draft.
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @version 1.5.1
 * @see http://github.com/garycourt/JSV
 */

/*
 * Copyright 2010 Gary Court. All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, are
 * permitted provided that the following conditions are met:
 * 
 *    1. Redistributions of source code must retain the above copyright notice, this list of
 *       conditions and the following disclaimer.
 * 
 *    2. Redistributions in binary form must reproduce the above copyright notice, this list
 *       of conditions and the following disclaimer in the documentation and/or other materials
 *       provided with the distribution.
 * 
 * THIS SOFTWARE IS PROVIDED BY GARY COURT ``AS IS'' AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL GARY COURT OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 * The views and conclusions contained in the software and documentation are those of the
 * authors and should not be interpreted as representing official policies, either expressed
 * or implied, of Gary Court or the JSON Schema specification.
 */

/*jslint white: true, sub: true, onevar: true, undef: true, eqeqeq: true, newcap: true, immed: true, indent: 4 */
/*global require */

(function () {
	var O = {},
		JSV = require('./jsv').JSV,
		TYPE_VALIDATORS,
		ENVIRONMENT,
		SCHEMA_00_JSON,
		HYPERSCHEMA_00_JSON,
		LINKS_00_JSON, 
		SCHEMA_00,
		HYPERSCHEMA_00,
		LINKS_00, 
		SCHEMA_01_JSON,
		HYPERSCHEMA_01_JSON,
		LINKS_01_JSON, 
		SCHEMA_01,
		HYPERSCHEMA_01,
		LINKS_01, 
		SCHEMA_02_JSON,
		HYPERSCHEMA_02_JSON,
		LINKS_02_JSON,
		SCHEMA_02,
		HYPERSCHEMA_02,
		LINKS_02, 
		SCHEMA_03_JSON,
		HYPERSCHEMA_03_JSON,
		LINKS_03_JSON,
		SCHEMA_03,
		HYPERSCHEMA_03,
		LINKS_03;
	
	TYPE_VALIDATORS = {
		"string" : function (instance, report) {
			return instance.getType() === "string";
		},
		
		"number" : function (instance, report) {
			return instance.getType() === "number";
		},
		
		"integer" : function (instance, report) {
			return instance.getType() === "number" && instance.getValue() % 1 === 0;
		},
		
		"boolean" : function (instance, report) {
			return instance.getType() === "boolean";
		},
		
		"object" : function (instance, report) {
			return instance.getType() === "object";
		},
		
		"array" : function (instance, report) {
			return instance.getType() === "array";
		},
		
		"null" : function (instance, report) {
			return instance.getType() === "null";
		},
		
		"any" : function (instance, report) {
			return true;
		}
	};
	
	ENVIRONMENT = new JSV.Environment();
	ENVIRONMENT.setOption("validateReferences", true);
	ENVIRONMENT.setOption("enforceReferences", false);
	ENVIRONMENT.setOption("strict", false);
	
	//
	// draft-00
	//
	
	SCHEMA_00_JSON = {
		"$schema" : "http://json-schema.org/draft-00/hyper-schema#",
		"id" : "http://json-schema.org/draft-00/schema#",
		"type" : "object",
		
		"properties" : {
			"type" : {
				"type" : ["string", "array"],
				"items" : {
					"type" : ["string", {"$ref" : "#"}]
				},
				"optional" : true,
				"uniqueItems" : true,
				"default" : "any",
				
				"parser" : function (instance, self) {
					var parser;
					
					if (instance.getType() === "string") {
						return instance.getValue();
					} else if (instance.getType() === "object") {
						return instance.getEnvironment().createSchema(
							instance, 
							self.getEnvironment().findSchema(self.resolveURI("#"))
						);
					} else if (instance.getType() === "array") {
						parser = self.getValueOfProperty("parser");
						return JSV.mapArray(instance.getProperties(), function (prop) {
							return parser(prop, self);
						});
					}
					//else
					return "any";
				},
			
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var requiredTypes = JSV.toArray(schema.getAttribute("type")),
						x, xl, type, subreport, typeValidators;
					
					//for instances that are required to be a certain type
					if (instance.getType() !== "undefined" && requiredTypes && requiredTypes.length) {
						typeValidators = self.getValueOfProperty("typeValidators") || {};
						
						//ensure that type matches for at least one of the required types
						for (x = 0, xl = requiredTypes.length; x < xl; ++x) {
							type = requiredTypes[x];
							if (JSV.isJSONSchema(type)) {
								subreport = JSV.createObject(report);
								subreport.errors = [];
								subreport.validated = JSV.clone(report.validated);
								if (type.validate(instance, subreport, parent, parentSchema, name).errors.length === 0) {
									return true;  //instance matches this schema
								}
							} else {
								if (typeValidators[type] !== O[type] && typeof typeValidators[type] === "function") {
									if (typeValidators[type](instance, report)) {
										return true;  //type is valid
									}
								} else {
									return true;  //unknown types are assumed valid
								}
							}
						}
						
						//if we get to this point, type is invalid
						report.addError(instance, schema, "type", "Instance is not a required type", requiredTypes);
						return false;
					}
					//else, anything is allowed if no type is specified
					return true;
				},
				
				"typeValidators" : TYPE_VALIDATORS
			},
			
			"properties" : {
				"type" : "object",
				"additionalProperties" : {"$ref" : "#"},
				"optional" : true,
				"default" : {},
				
				"parser" : function (instance, self, arg) {
					var env = instance.getEnvironment(),
						selfEnv = self.getEnvironment();
					if (instance.getType() === "object") {
						if (arg) {
							return env.createSchema(instance.getProperty(arg), selfEnv.findSchema(self.resolveURI("#")));
						} else {
							return JSV.mapObject(instance.getProperties(), function (instance) {
								return env.createSchema(instance, selfEnv.findSchema(self.resolveURI("#")));
							});
						}
					}
					//else
					return {};
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var propertySchemas, key;
					//this attribute is for object type instances only
					if (instance.getType() === "object") {
						//for each property defined in the schema
						propertySchemas = schema.getAttribute("properties");
						for (key in propertySchemas) {
							if (propertySchemas[key] !== O[key] && propertySchemas[key]) {
								//ensure that instance property is valid
								propertySchemas[key].validate(instance.getProperty(key), report, instance, schema, key);
							}
						}
					}
				}
			},
			
			"items" : {
				"type" : [{"$ref" : "#"}, "array"],
				"items" : {"$ref" : "#"},
				"optional" : true,
				"default" : {},
				
				"parser" : function (instance, self) {
					if (instance.getType() === "object") {
						return instance.getEnvironment().createSchema(instance, self.getEnvironment().findSchema(self.resolveURI("#")));
					} else if (instance.getType() === "array") {
						return JSV.mapArray(instance.getProperties(), function (instance) {
							return instance.getEnvironment().createSchema(instance, self.getEnvironment().findSchema(self.resolveURI("#")));
						});
					}
					//else
					return instance.getEnvironment().createEmptySchema();
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var properties, items, x, xl, itemSchema, additionalProperties;
					
					if (instance.getType() === "array") {
						properties = instance.getProperties();
						items = schema.getAttribute("items");
						additionalProperties = schema.getAttribute("additionalProperties");
						
						if (JSV.typeOf(items) === "array") {
							for (x = 0, xl = properties.length; x < xl; ++x) {
								itemSchema = items[x] || additionalProperties;
								if (itemSchema !== false) {
									itemSchema.validate(properties[x], report, instance, schema, x);
								} else {
									report.addError(instance, schema, "additionalProperties", "Additional items are not allowed", itemSchema);
								}
							}
						} else {
							itemSchema = items || additionalProperties;
							for (x = 0, xl = properties.length; x < xl; ++x) {
								itemSchema.validate(properties[x], report, instance, schema, x);
							}
						}
					}
				}
			},
			
			"optional" : {
				"type" : "boolean",
				"optional" : true,
				"default" : false,
				
				"parser" : function (instance, self) {
					return !!instance.getValue();
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					if (instance.getType() === "undefined" && !schema.getAttribute("optional")) {
						report.addError(instance, schema, "optional", "Property is required", false);
					}
				},
				
				"validationRequired" : true
			},
			
			"additionalProperties" : {
				"type" : [{"$ref" : "#"}, "boolean"],
				"optional" : true,
				"default" : {},
				
				"parser" : function (instance, self) {
					if (instance.getType() === "object") {
						return instance.getEnvironment().createSchema(instance, self.getEnvironment().findSchema(self.resolveURI("#")));
					} else if (instance.getType() === "boolean" && instance.getValue() === false) {
						return false;
					}
					//else
					return instance.getEnvironment().createEmptySchema();
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var additionalProperties, propertySchemas, properties, key;
					//we only need to check against object types as arrays do their own checking on this property
					if (instance.getType() === "object") {
						additionalProperties = schema.getAttribute("additionalProperties");
						propertySchemas = schema.getAttribute("properties") || {};
						properties = instance.getProperties();
						for (key in properties) {
							if (properties[key] !== O[key] && properties[key] && propertySchemas[key] === O[key]) {
								if (JSV.isJSONSchema(additionalProperties)) {
									additionalProperties.validate(properties[key], report, instance, schema, key);
								} else if (additionalProperties === false) {
									report.addError(instance, schema, "additionalProperties", "Additional properties are not allowed", additionalProperties);
								}
							}
						}
					}
				}
			},
			
			"requires" : {
				"type" : ["string", {"$ref" : "#"}],
				"optional" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "string") {
						return instance.getValue();
					} else if (instance.getType() === "object") {
						return instance.getEnvironment().createSchema(instance, self.getEnvironment().findSchema(self.resolveURI("#")));
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var requires;
					if (instance.getType() !== "undefined" && parent && parent.getType() !== "undefined") {
						requires = schema.getAttribute("requires");
						if (typeof requires === "string") {
							if (parent.getProperty(requires).getType() === "undefined") {
								report.addError(instance, schema, "requires", 'Property requires sibling property "' + requires + '"', requires);
							}
						} else if (JSV.isJSONSchema(requires)) {
							requires.validate(parent, report);  //WATCH: A "requires" schema does not support the "requires" attribute
						}
					}
				}
			},
			
			"minimum" : {
				"type" : "number",
				"optional" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var minimum, minimumCanEqual;
					if (instance.getType() === "number") {
						minimum = schema.getAttribute("minimum");
						minimumCanEqual = schema.getAttribute("minimumCanEqual");
						if (typeof minimum === "number" && (instance.getValue() < minimum || (minimumCanEqual === false && instance.getValue() === minimum))) {
							report.addError(instance, schema, "minimum", "Number is less than the required minimum value", minimum);
						}
					}
				}
			},
			
			"maximum" : {
				"type" : "number",
				"optional" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var maximum, maximumCanEqual;
					if (instance.getType() === "number") {
						maximum = schema.getAttribute("maximum");
						maximumCanEqual = schema.getAttribute("maximumCanEqual");
						if (typeof maximum === "number" && (instance.getValue() > maximum || (maximumCanEqual === false && instance.getValue() === maximum))) {
							report.addError(instance, schema, "maximum", "Number is greater than the required maximum value", maximum);
						}
					}
				}
			},
			
			"minimumCanEqual" : {
				"type" : "boolean",
				"optional" : true,
				"requires" : "minimum",
				"default" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "boolean") {
						return instance.getValue();
					}
					//else
					return true;
				}
			},
			
			"maximumCanEqual" : {
				"type" : "boolean",
				"optional" : true,
				"requires" : "maximum",
				"default" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "boolean") {
						return instance.getValue();
					}
					//else
					return true;
				}
			},
			
			"minItems" : {
				"type" : "integer",
				"optional" : true,
				"minimum" : 0,
				"default" : 0,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
					//else
					return 0;
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var minItems;
					if (instance.getType() === "array") {
						minItems = schema.getAttribute("minItems");
						if (typeof minItems === "number" && instance.getProperties().length < minItems) {
							report.addError(instance, schema, "minItems", "The number of items is less than the required minimum", minItems);
						}
					}
				}
			},
			
			"maxItems" : {
				"type" : "integer",
				"optional" : true,
				"minimum" : 0,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var maxItems;
					if (instance.getType() === "array") {
						maxItems = schema.getAttribute("maxItems");
						if (typeof maxItems === "number" && instance.getProperties().length > maxItems) {
							report.addError(instance, schema, "maxItems", "The number of items is greater than the required maximum", maxItems);
						}
					}
				}
			},
			
			"pattern" : {
				"type" : "string",
				"optional" : true,
				"format" : "regex",
				
				"parser" : function (instance, self) {
					if (instance.getType() === "string") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var pattern;
					try {
						pattern = new RegExp(schema.getAttribute("pattern"));
						if (instance.getType() === "string" && pattern && !pattern.test(instance.getValue())) {
							report.addError(instance, schema, "pattern", "String does not match pattern", pattern.toString());
						}
					} catch (e) {
						report.addError(schema, self, "pattern", "Invalid pattern", schema.getValueOfProperty("pattern"));
					}
				}
			},
			
			"minLength" : {
				"type" : "integer",
				"optional" : true,
				"minimum" : 0,
				"default" : 0,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
					//else
					return 0;
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var minLength;
					if (instance.getType() === "string") {
						minLength = schema.getAttribute("minLength");
						if (typeof minLength === "number" && instance.getValue().length < minLength) {
							report.addError(instance, schema, "minLength", "String is less than the required minimum length", minLength);
						}
					}
				}
			},
			
			"maxLength" : {
				"type" : "integer",
				"optional" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var maxLength;
					if (instance.getType() === "string") {
						maxLength = schema.getAttribute("maxLength");
						if (typeof maxLength === "number" && instance.getValue().length > maxLength) {
							report.addError(instance, schema, "maxLength", "String is greater than the required maximum length", maxLength);
						}
					}
				}
			},
			
			"enum" : {
				"type" : "array",
				"optional" : true,
				"minItems" : 1,
				"uniqueItems" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "array") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var enums, x, xl;
					if (instance.getType() !== "undefined") {
						enums = schema.getAttribute("enum");
						if (enums) {
							for (x = 0, xl = enums.length; x < xl; ++x) {
								if (instance.equals(enums[x])) {
									return true;
								}
							}
							report.addError(instance, schema, "enum", "Instance is not one of the possible values", enums);
						}
					}
				}
			},
			
			"title" : {
				"type" : "string",
				"optional" : true
			},
			
			"description" : {
				"type" : "string",
				"optional" : true
			},
			
			"format" : {
				"type" : "string",
				"optional" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "string") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var format, formatValidators;
					if (instance.getType() === "string") {
						format = schema.getAttribute("format");
						formatValidators = self.getValueOfProperty("formatValidators");
						if (typeof format === "string" && formatValidators[format] !== O[format] && typeof formatValidators[format] === "function" && !formatValidators[format].call(this, instance, report)) {
							report.addError(instance, schema, "format", "String is not in the required format", format);
						}
					}
				},
				
				"formatValidators" : {}
			},
			
			"contentEncoding" : {
				"type" : "string",
				"optional" : true
			},
			
			"default" : {
				"type" : "any",
				"optional" : true
			},
			
			"maxDecimal" : {
				"type" : "integer",
				"optional" : true,
				"minimum" : 0,
								
				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var maxDecimal, decimals;
					if (instance.getType() === "number") {
						maxDecimal = schema.getAttribute("maxDecimal");
						if (typeof maxDecimal === "number") {
							decimals = instance.getValue().toString(10).split('.')[1];
							if (decimals && decimals.length > maxDecimal) {
								report.addError(instance, schema, "maxDecimal", "The number of decimal places is greater than the allowed maximum", maxDecimal);
							}
						}
					}
				}
			},
			
			"disallow" : {
				"type" : ["string", "array"],
				"items" : {"type" : "string"},
				"optional" : true,
				"uniqueItems" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "string" || instance.getType() === "array") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var disallowedTypes = JSV.toArray(schema.getAttribute("disallow")),
						x, xl, key, typeValidators, subreport;
					
					//for instances that are required to be a certain type
					if (instance.getType() !== "undefined" && disallowedTypes && disallowedTypes.length) {
						typeValidators = self.getValueOfProperty("typeValidators") || {};
						
						//ensure that type matches for at least one of the required types
						for (x = 0, xl = disallowedTypes.length; x < xl; ++x) {
							key = disallowedTypes[x];
							if (JSV.isJSONSchema(key)) {  //this is supported draft-03 and on
								subreport = JSV.createObject(report);
								subreport.errors = [];
								subreport.validated = JSV.clone(report.validated);
								if (key.validate(instance, subreport, parent, parentSchema, name).errors.length === 0) {
									//instance matches this schema
									report.addError(instance, schema, "disallow", "Instance is a disallowed type", disallowedTypes);
									return false;  
								}
							} else if (typeValidators[key] !== O[key] && typeof typeValidators[key] === "function") {
								if (typeValidators[key](instance, report)) {
									report.addError(instance, schema, "disallow", "Instance is a disallowed type", disallowedTypes);
									return false;
								}
							} 
							/*
							else {
								report.addError(instance, schema, "disallow", "Instance may be a disallowed type", disallowedTypes);
								return false;
							}
							*/
						}
						
						//if we get to this point, type is valid
						return true;
					}
					//else, everything is allowed if no disallowed types are specified
					return true;
				},
				
				"typeValidators" : TYPE_VALIDATORS
			},
		
			"extends" : {
				"type" : [{"$ref" : "#"}, "array"],
				"items" : {"$ref" : "#"},
				"optional" : true,
				"default" : {},
				
				"parser" : function (instance, self) {
					if (instance.getType() === "object") {
						return instance.getEnvironment().createSchema(instance, self.getEnvironment().findSchema(self.resolveURI("#")));
					} else if (instance.getType() === "array") {
						return JSV.mapArray(instance.getProperties(), function (instance) {
							return instance.getEnvironment().createSchema(instance, self.getEnvironment().findSchema(self.resolveURI("#")));
						});
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var extensions = schema.getAttribute("extends"), x, xl;
					if (extensions) {
						if (JSV.isJSONSchema(extensions)) {
							extensions.validate(instance, report, parent, parentSchema, name);
						} else if (JSV.typeOf(extensions) === "array") {
							for (x = 0, xl = extensions.length; x < xl; ++x) {
								extensions[x].validate(instance, report, parent, parentSchema, name);
							}
						}
					}
				}
			}
		},
		
		"optional" : true,
		"default" : {},
		"fragmentResolution" : "dot-delimited",
		
		"parser" : function (instance, self) {
			if (instance.getType() === "object") {
				return instance.getEnvironment().createSchema(instance, self);
			}
		},
		
		"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
			var propNames = schema.getPropertyNames(), 
				x, xl,
				attributeSchemas = self.getAttribute("properties"),
				strict = instance.getEnvironment().getOption("strict"),
				validator;
			
			for (x in attributeSchemas) {
				if (attributeSchemas[x] !== O[x]) {
					if (attributeSchemas[x].getValueOfProperty("validationRequired")) {
						JSV.pushUnique(propNames, x);
					}
					if (strict && attributeSchemas[x].getValueOfProperty("deprecated")) {
						JSV.popFirst(propNames, x);
					}
				}
			}
			
			for (x = 0, xl = propNames.length; x < xl; ++x) {
				if (attributeSchemas[propNames[x]] !== O[propNames[x]]) {
					validator = attributeSchemas[propNames[x]].getValueOfProperty("validator");
					if (typeof validator === "function") {
						validator(instance, schema, attributeSchemas[propNames[x]], report, parent, parentSchema, name);
					}
				}
			}
		}
	};
	
	HYPERSCHEMA_00_JSON = {
		"$schema" : "http://json-schema.org/draft-00/hyper-schema#",
		"id" : "http://json-schema.org/draft-00/hyper-schema#",
	
		"properties" : {
			"links" : {
				"type" : "array",
				"items" : {"$ref" : "links#"},
				"optional" : true,
				
				"parser" : function (instance, self, arg) {
					var links,
						linkSchemaURI = self.getValueOfProperty("items")["$ref"],
						linkSchema = self.getEnvironment().findSchema(linkSchemaURI),
						linkParser = linkSchema && linkSchema.getValueOfProperty("parser"),
						selfReferenceVariable;
					arg = JSV.toArray(arg);
					
					if (typeof linkParser === "function") {
						links = JSV.mapArray(instance.getProperties(), function (link) {
							return linkParser(link, linkSchema);
						});
					} else {
						links = JSV.toArray(instance.getValue());
					}
					
					if (arg[0]) {
						links = JSV.filterArray(links, function (link) {
							return link["rel"] === arg[0];
						});
					}
					
					if (arg[1]) {
						selfReferenceVariable = self.getValueOfProperty("selfReferenceVariable");
						links = JSV.mapArray(links, function (link) {
							var instance = arg[1],
								href = link["href"];
							href = href.replace(/\{(.+)\}/g, function (str, p1, offset, s) {
								var value; 
								if (p1 === selfReferenceVariable) {
									value = instance.getValue();
								} else {
									value = instance.getValueOfProperty(p1);
								}
								return value !== undefined ? String(value) : "";
							});
							return href ? JSV.formatURI(instance.resolveURI(href)) : href;
						});
					}
					
					return links;
				},
				
				"selfReferenceVariable" : "-this"
			},
			
			"fragmentResolution" : {
				"type" : "string",
				"optional" : true,
				"default" : "dot-delimited"
			},
			
			"root" : {
				"type" : "boolean",
				"optional" : true,
				"default" : false
			},
			
			"readonly" : {
				"type" : "boolean",
				"optional" : true,
				"default" : false
			},
			
			"pathStart" : {
				"type" : "string",
				"optional" : true,
				"format" : "uri",
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var pathStart;
					if (instance.getType() !== "undefined") {
						pathStart = schema.getAttribute("pathStart");
						if (typeof pathStart === "string") {
							//TODO: Find out what pathStart is relative to
							if (instance.getURI().indexOf(pathStart) !== 0) {
								report.addError(instance, schema, "pathStart", "Instance's URI does not start with " + pathStart, pathStart);
							}
						}
					}
				}
			},
			
			"mediaType" : {
				"type" : "string",
				"optional" : true,
				"format" : "media-type"
			},
			
			"alternate" : {
				"type" : "array",
				"items" : {"$ref" : "#"},
				"optional" : true
			}
		},
		
		"links" : [
			{
				"href" : "{$ref}",
				"rel" : "full"
			},
			
			{
				"href" : "{$schema}",
				"rel" : "describedby"
			},
			
			{
				"href" : "{id}",
				"rel" : "self"
			}
		],
				
		"initializer" : function (instance) {
			var link, extension, extended;
			
			//if there is a link to a different schema, set reference
			link = instance._schema.getLink("describedby", instance);
			if (link && instance._schema._uri !== link) {
				instance.setReference("describedby", link);
			}
			
			//if instance has a URI link to itself, update it's own URI
			link = instance._schema.getLink("self", instance);
			if (JSV.typeOf(link) === "string") {
				instance._uri = JSV.formatURI(link);
			}
			
			//if there is a link to the full representation, set reference
			link = instance._schema.getLink("full", instance);
			if (link && instance._uri !== link) {
				instance.setReference("full", link);
			}
			
			//extend schema
			extension = instance.getAttribute("extends");
			if (JSV.isJSONSchema(extension)) {
				extended = JSV.inherits(extension, instance, true);
				instance = instance._env.createSchema(extended, instance._schema, instance._uri);
			}
			
			return instance;
		}
		
		//not needed as JSV.inherits does the job for us
		//"extends" : {"$ref" : "http://json-schema.org/schema#"}
	};
	
	LINKS_00_JSON = {
		"$schema" : "http://json-schema.org/draft-00/hyper-schema#",
		"id" : "http://json-schema.org/draft-00/links#",
		"type" : "object",
		
		"properties" : {
			"href" : {
				"type" : "string"
			},
			
			"rel" : {
				"type" : "string"
			},
			
			"method" : {
				"type" : "string",
				"default" : "GET",
				"optional" : true
			},
			
			"enctype" : {
				"type" : "string",
				"requires" : "method",
				"optional" : true
			},
			
			"properties" : {
				"type" : "object",
				"additionalProperties" : {"$ref" : "hyper-schema#"},
				"optional" : true,
				
				"parser" : function (instance, self, arg) {
					var env = instance.getEnvironment(),
						selfEnv = self.getEnvironment(),
						additionalPropertiesSchemaURI = self.getValueOfProperty("additionalProperties")["$ref"];
					if (instance.getType() === "object") {
						if (arg) {
							return env.createSchema(instance.getProperty(arg), selfEnv.findSchema(self.resolveURI(additionalPropertiesSchemaURI)));
						} else {
							return JSV.mapObject(instance.getProperties(), function (instance) {
								return env.createSchema(instance, selfEnv.findSchema(self.resolveURI(additionalPropertiesSchemaURI)));
							});
						}
					}
				}
			}
		},
		
		"parser" : function (instance, self) {
			var selfProperties = self.getProperty("properties");
			if (instance.getType() === "object") {
				return JSV.mapObject(instance.getProperties(), function (property, key) {
					var propertySchema = selfProperties.getProperty(key),
						parser = propertySchema && propertySchema.getValueOfProperty("parser");
					if (typeof parser === "function") {
						return parser(property, propertySchema);
					}
					//else
					return property.getValue();
				});
			}
			return instance.getValue();
		}
	};
	
	ENVIRONMENT.setOption("defaultFragmentDelimiter", ".");
	ENVIRONMENT.setOption("defaultSchemaURI", "http://json-schema.org/draft-00/schema#");  //updated later
	
	SCHEMA_00 = ENVIRONMENT.createSchema(SCHEMA_00_JSON, true, "http://json-schema.org/draft-00/schema#");
	HYPERSCHEMA_00 = ENVIRONMENT.createSchema(JSV.inherits(SCHEMA_00, ENVIRONMENT.createSchema(HYPERSCHEMA_00_JSON, true, "http://json-schema.org/draft-00/hyper-schema#"), true), true, "http://json-schema.org/draft-00/hyper-schema#");
	
	ENVIRONMENT.setOption("defaultSchemaURI", "http://json-schema.org/draft-00/hyper-schema#");
	
	LINKS_00 = ENVIRONMENT.createSchema(LINKS_00_JSON, HYPERSCHEMA_00, "http://json-schema.org/draft-00/links#");
	
	//
	// draft-01
	//
		
	SCHEMA_01_JSON = JSV.inherits(SCHEMA_00_JSON, {
		"$schema" : "http://json-schema.org/draft-01/hyper-schema#",
		"id" : "http://json-schema.org/draft-01/schema#"
	});
	
	HYPERSCHEMA_01_JSON = JSV.inherits(HYPERSCHEMA_00_JSON, {
		"$schema" : "http://json-schema.org/draft-01/hyper-schema#",
		"id" : "http://json-schema.org/draft-01/hyper-schema#"
	});
	
	LINKS_01_JSON = JSV.inherits(LINKS_00_JSON, {
		"$schema" : "http://json-schema.org/draft-01/hyper-schema#",
		"id" : "http://json-schema.org/draft-01/links#"
	});
	
	ENVIRONMENT.setOption("defaultSchemaURI", "http://json-schema.org/draft-01/schema#");  //update later
	
	SCHEMA_01 = ENVIRONMENT.createSchema(SCHEMA_01_JSON, true, "http://json-schema.org/draft-01/schema#");
	HYPERSCHEMA_01 = ENVIRONMENT.createSchema(JSV.inherits(SCHEMA_01, ENVIRONMENT.createSchema(HYPERSCHEMA_01_JSON, true, "http://json-schema.org/draft-01/hyper-schema#"), true), true, "http://json-schema.org/draft-01/hyper-schema#");
	
	ENVIRONMENT.setOption("defaultSchemaURI", "http://json-schema.org/draft-01/hyper-schema#");
	
	LINKS_01 = ENVIRONMENT.createSchema(LINKS_01_JSON, HYPERSCHEMA_01, "http://json-schema.org/draft-01/links#");
	
	//
	// draft-02
	//
	
	SCHEMA_02_JSON = JSV.inherits(SCHEMA_01_JSON, {
		"$schema" : "http://json-schema.org/draft-02/hyper-schema#",
		"id" : "http://json-schema.org/draft-02/schema#",
		
		"properties" : {
			"uniqueItems" : {
				"type" : "boolean",
				"optional" : true,
				"default" : false,
				
				"parser" : function (instance, self) {
					return !!instance.getValue();
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var value, x, xl, y, yl;
					if (instance.getType() === "array" && schema.getAttribute("uniqueItems")) {
						value = instance.getProperties();
						for (x = 0, xl = value.length - 1; x < xl; ++x) {
							for (y = x + 1, yl = value.length; y < yl; ++y) {
								if (value[x].equals(value[y])) {
									report.addError(instance, schema, "uniqueItems", "Array can only contain unique items", { x : x, y : y });
								}
							}
						}
					}
				}
			},
			
			"maxDecimal" : {
				"deprecated" : true
			},
			
			"divisibleBy" : {
				"type" : "number",
				"minimum" : 0,
				"minimumCanEqual" : false,
				"optional" : true,
				
				"parser" : function (instance, self) {
					if (instance.getType() === "number") {
						return instance.getValue();
					}
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var divisor, value, digits;
					if (instance.getType() === "number") {
						divisor = schema.getAttribute("divisibleBy");
						if (divisor === 0) {
							report.addError(instance, schema, "divisibleBy", "Nothing is divisible by 0", divisor);
						} else if (divisor !== 1) {
							value = instance.getValue();
							digits = Math.max((value.toString().split(".")[1] || " ").length, (divisor.toString().split(".")[1] || " ").length);
							digits = parseFloat(((value / divisor) % 1).toFixed(digits));  //cut out floating point errors
							if (0 < digits && digits < 1) {
								report.addError(instance, schema, "divisibleBy", "Number is not divisible by " + divisor, divisor);
							}
						}
					}
				}
			}
		},
		
		"fragmentResolution" : "slash-delimited"
	});
	
	HYPERSCHEMA_02_JSON = JSV.inherits(HYPERSCHEMA_01_JSON, {
		"id" : "http://json-schema.org/draft-02/hyper-schema#",
		
		"properties" : {
			"fragmentResolution" : {
				"default" : "slash-delimited"
			}
		}
	});
	
	LINKS_02_JSON = JSV.inherits(LINKS_01_JSON, {
		"$schema" : "http://json-schema.org/draft-02/hyper-schema#",
		"id" : "http://json-schema.org/draft-02/links#",
		
		"properties" : {
			"targetSchema" : {
				"$ref" : "hyper-schema#",
				
				//need this here because parsers are run before links are resolved
				"parser" : HYPERSCHEMA_01.getAttribute("parser")
			}
		}
	});
	
	ENVIRONMENT.setOption("defaultFragmentDelimiter", "/");
	ENVIRONMENT.setOption("defaultSchemaURI", "http://json-schema.org/draft-02/schema#");  //update later
	
	SCHEMA_02 = ENVIRONMENT.createSchema(SCHEMA_02_JSON, true, "http://json-schema.org/draft-02/schema#");
	HYPERSCHEMA_02 = ENVIRONMENT.createSchema(JSV.inherits(SCHEMA_02, ENVIRONMENT.createSchema(HYPERSCHEMA_02_JSON, true, "http://json-schema.org/draft-02/hyper-schema#"), true), true, "http://json-schema.org/draft-02/hyper-schema#");
	
	ENVIRONMENT.setOption("defaultSchemaURI", "http://json-schema.org/draft-02/hyper-schema#");
	
	LINKS_02 = ENVIRONMENT.createSchema(LINKS_02_JSON, HYPERSCHEMA_02, "http://json-schema.org/draft-02/links#");
	
	//
	// draft-03
	//
	
	function getMatchedPatternProperties(instance, schema, report, self) {
		var matchedProperties = {}, patternProperties, pattern, regexp, properties, key;
		
		if (instance.getType() === "object") {
			patternProperties = schema.getAttribute("patternProperties");
			properties = instance.getProperties();
			for (pattern in patternProperties) {
				if (patternProperties[pattern] !== O[pattern]) {
					regexp = null;
					try {
						regexp = new RegExp(pattern);
					} catch (e) {
						if (report) {
							report.addError(schema, self, "patternProperties", "Invalid pattern", pattern);
						}
					}
					
					if (regexp) {
						for (key in properties) {
							if (properties[key] !== O[key]  && regexp.test(key)) {
								matchedProperties[key] = matchedProperties[key] ? JSV.pushUnique(matchedProperties[key], patternProperties[pattern]) : [ patternProperties[pattern] ];
							}
						}
					}
				}
			}
		}
		
		return matchedProperties;
	}
	
	SCHEMA_03_JSON = JSV.inherits(SCHEMA_02_JSON, {
		"$schema" : "http://json-schema.org/draft-03/schema#",
		"id" : "http://json-schema.org/draft-03/schema#",
		
		"properties" : {
			"patternProperties" : {
				"type" : "object",
				"additionalProperties" : {"$ref" : "#"},
				"default" : {},
				
				"parser" : SCHEMA_02.getValueOfProperty("properties")["properties"]["parser"],
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var matchedProperties, key, x;
					if (instance.getType() === "object") {
						matchedProperties = getMatchedPatternProperties(instance, schema, report, self);
						for (key in matchedProperties) {
							if (matchedProperties[key] !== O[key]) {
								x = matchedProperties[key].length;
								while (x--) {
									matchedProperties[key][x].validate(instance.getProperty(key), report, instance, schema, key);
								}
							}
						}
					}
				}
			},
			
			"additionalProperties" : {
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var additionalProperties, propertySchemas, properties, matchedProperties, key;
					if (instance.getType() === "object") {
						additionalProperties = schema.getAttribute("additionalProperties");
						propertySchemas = schema.getAttribute("properties") || {};
						properties = instance.getProperties();
						matchedProperties = getMatchedPatternProperties(instance, schema);
						for (key in properties) {
							if (properties[key] !== O[key] && properties[key] && propertySchemas[key] === O[key] && matchedProperties[key] === O[key]) {
								if (JSV.isJSONSchema(additionalProperties)) {
									additionalProperties.validate(properties[key], report, instance, schema, key);
								} else if (additionalProperties === false) {
									report.addError(instance, schema, "additionalProperties", "Additional properties are not allowed", additionalProperties);
								}
							}
						}
					}
				}
			},
			
			"items" : {
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var properties, items, x, xl, itemSchema, additionalItems;
					
					if (instance.getType() === "array") {
						properties = instance.getProperties();
						items = schema.getAttribute("items");
						additionalItems = schema.getAttribute("additionalItems");
						
						if (JSV.typeOf(items) === "array") {
							for (x = 0, xl = properties.length; x < xl; ++x) {
								itemSchema = items[x] || additionalItems;
								if (itemSchema !== false) {
									itemSchema.validate(properties[x], report, instance, schema, x);
								} else {
									report.addError(instance, schema, "additionalItems", "Additional items are not allowed", itemSchema);
								}
							}
						} else {
							itemSchema = items || additionalItems;
							for (x = 0, xl = properties.length; x < xl; ++x) {
								itemSchema.validate(properties[x], report, instance, schema, x);
							}
						}
					}
				}
			},
			
			"additionalItems" : {
				"type" : [{"$ref" : "#"}, "boolean"],
				"default" : {},
				
				"parser" : SCHEMA_02.getValueOfProperty("properties")["additionalProperties"]["parser"],
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var additionalItems, properties, x, xl;
					//only validate if the "items" attribute is undefined
					if (instance.getType() === "array" && schema.getProperty("items").getType() === "undefined") {
						additionalItems = schema.getAttribute("additionalItems");
						properties = instance.getProperties();
						
						if (additionalItems !== false) {
							for (x = 0, xl = properties.length; x < xl; ++x) {
								additionalItems.validate(properties[x], report, instance, schema, x);
							}
						} else if (properties.length) {
							report.addError(instance, schema, "additionalItems", "Additional items are not allowed", additionalItems);
						}
					}
				}
			},
			
			"optional" : {
				"validationRequired" : false,
				"deprecated" : true
			},
			
			"required" : {
				"type" : "boolean",
				"default" : false,
				
				"parser" : function (instance, self) {
					return !!instance.getValue();
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					if (instance.getType() === "undefined" && schema.getAttribute("required")) {
						report.addError(instance, schema, "required", "Property is required", true);
					}
				}
			},
			
			"requires" : {
				"deprecated" : true
			},
			
			"dependencies" : {
				"type" : "object",
				"additionalProperties" : {
					"type" : ["string", "array", {"$ref" : "#"}],
					"items" : {
						"type" : "string"
					}
				},
				"default" : {},
				
				"parser" : function (instance, self, arg) {
					function parseProperty(property) {
						var type = property.getType();
						if (type === "string" || type === "array") {
							return property.getValue();
						} else if (type === "object") {
							return property.getEnvironment().createSchema(property, self.getEnvironment().findSchema(self.resolveURI("#")));
						}
					}
					
					if (instance.getType() === "object") {
						if (arg) {
							return parseProperty(instance.getProperty(arg));
						} else {
							return JSV.mapObject(instance.getProperties(), parseProperty);
						}
					}
					//else
					return {};
				},
				
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var dependencies, key, dependency, type, x, xl;
					if (instance.getType() === "object") {
						dependencies = schema.getAttribute("dependencies");
						for (key in dependencies) {
							if (dependencies[key] !== O[key] && instance.getProperty(key).getType() !== "undefined") {
								dependency = dependencies[key];
								type = JSV.typeOf(dependency);
								if (type === "string") {
									if (instance.getProperty(dependency).getType() === "undefined") {
										report.addError(instance, schema, "dependencies", 'Property "' + key + '" requires sibling property "' + dependency + '"', dependencies);
									}
								} else if (type === "array") {
									for (x = 0, xl = dependency.length; x < xl; ++x) {
										if (instance.getProperty(dependency[x]).getType() === "undefined") {
											report.addError(instance, schema, "dependencies", 'Property "' + key + '" requires sibling property "' + dependency[x] + '"', dependencies);
										}
									}
								} else if (JSV.isJSONSchema(dependency)) {
									dependency.validate(instance, report);
								}
							}
						}
					}
				}
			},
			
			"minimumCanEqual" : {
				"deprecated" : true
			},
			
			"maximumCanEqual" : {
				"deprecated" : true
			},
			
			"exclusiveMinimum" : {
				"type" : "boolean",
				"default" : false,
				
				"parser" : function (instance, self) {
					return !!instance.getValue();
				}
			},
			
			"exclusiveMaximum" : {
				"type" : "boolean",
				"default" : false,
				
				"parser" : function (instance, self) {
					return !!instance.getValue();
				}
			},
			
			"minimum" : {
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var minimum, exclusiveMinimum;
					if (instance.getType() === "number") {
						minimum = schema.getAttribute("minimum");
						exclusiveMinimum = schema.getAttribute("exclusiveMinimum") || (!instance.getEnvironment().getOption("strict") && !schema.getAttribute("minimumCanEqual"));
						if (typeof minimum === "number" && (instance.getValue() < minimum || (exclusiveMinimum === true && instance.getValue() === minimum))) {
							report.addError(instance, schema, "minimum", "Number is less than the required minimum value", minimum);
						}
					}
				}
			},
			
			"maximum" : {
				"validator" : function (instance, schema, self, report, parent, parentSchema, name) {
					var maximum, exclusiveMaximum;
					if (instance.getType() === "number") {
						maximum = schema.getAttribute("maximum");
						exclusiveMaximum = schema.getAttribute("exclusiveMaximum") || (!instance.getEnvironment().getOption("strict") && !schema.getAttribute("maximumCanEqual"));
						if (typeof maximum === "number" && (instance.getValue() > maximum || (exclusiveMaximum === true && instance.getValue() === maximum))) {
							report.addError(instance, schema, "maximum", "Number is greater than the required maximum value", maximum);
						}
					}
				}
			},
			
			"contentEncoding" : {
				"deprecated" : true
			},
			
			"divisibleBy" : {
				"exclusiveMinimum" : true
			},
			
			"disallow" : {
				"items" : {
					"type" : ["string", {"$ref" : "#"}]
				},
				
				"parser" : SCHEMA_02_JSON["properties"]["type"]["parser"]
			},
			
			"id" : {
				"type" : "string",
				"format" : "uri"
			},
			
			"$ref" : {
				"type" : "string",
				"format" : "uri"
			},
			
			"$schema" : {
				"type" : "string",
				"format" : "uri"
			}
		},
		
		"dependencies" : {
			"exclusiveMinimum" : "minimum",
			"exclusiveMaximum" : "maximum"
		},
		
		"initializer" : function (instance) {
			var link, extension, extended,
				schemaLink = instance.getValueOfProperty("$schema"),
				refLink = instance.getValueOfProperty("$ref"),
				idLink = instance.getValueOfProperty("id");
			
			//if there is a link to a different schema, set reference
			if (schemaLink) {
				link = instance.resolveURI(schemaLink);
				instance.setReference("describedby", link);
			}
			
			//if instance has a URI link to itself, update it's own URI
			if (idLink) {
				link = instance.resolveURI(idLink);
				if (JSV.typeOf(link) === "string") {
					instance._uri = JSV.formatURI(link);
				}
			}
			
			//if there is a link to the full representation, set reference
			if (refLink) {
				link = instance.resolveURI(refLink);
				instance.setReference("full", link);
			}
			
			//extend schema
			extension = instance.getAttribute("extends");
			if (JSV.isJSONSchema(extension)) {
				extended = JSV.inherits(extension, instance, true);
				instance = instance._env.createSchema(extended, instance._schema, instance._uri);
			}
			
			return instance;
		}
	});
	
	HYPERSCHEMA_03_JSON = JSV.inherits(HYPERSCHEMA_02_JSON, {
		"$schema" : "http://json-schema.org/draft-03/hyper-schema#",
		"id" : "http://json-schema.org/draft-03/hyper-schema#",
		
		"properties" : {
			"links" : {
				"selfReferenceVariable" : "@"
			},
			
			"root" : {
				"deprecated" : true
			},
			
			"contentEncoding" : {
				"deprecated" : false  //moved from core to hyper
			},
			
			"alternate" : {
				"deprecated" : true
			}
		}
	});
	
	LINKS_03_JSON = JSV.inherits(LINKS_02_JSON, {
		"$schema" : "http://json-schema.org/draft-03/hyper-schema#",
		"id" : "http://json-schema.org/draft-03/links#",
		
		"properties" : {
			"href" : {
				"required" : true,
				"format" : "link-description-object-template"
			},
			
			"rel" : {
				"required" : true
			},
			
			"properties" : {
				"deprecated" : true
			},
			
			"schema" : {"$ref" : "http://json-schema.org/draft-03/hyper-schema#"}
		}
	});
	
	ENVIRONMENT.setOption("defaultSchemaURI", "http://json-schema.org/draft-03/schema#");  //update later
	
	SCHEMA_03 = ENVIRONMENT.createSchema(SCHEMA_03_JSON, true, "http://json-schema.org/draft-03/schema#");
	HYPERSCHEMA_03 = ENVIRONMENT.createSchema(JSV.inherits(SCHEMA_03, ENVIRONMENT.createSchema(HYPERSCHEMA_03_JSON, true, "http://json-schema.org/draft-03/hyper-schema#"), true), true, "http://json-schema.org/draft-03/hyper-schema#");
	
	ENVIRONMENT.setOption("defaultSchemaURI", "http://json-schema.org/draft-03/hyper-schema#");
	
	LINKS_03 = ENVIRONMENT.createSchema(LINKS_03_JSON, true, "http://json-schema.org/draft-03/links#");
	
	ENVIRONMENT.setOption("latestJSONSchemaSchemaURI", "http://json-schema.org/draft-03/schema#");
	ENVIRONMENT.setOption("latestJSONSchemaHyperSchemaURI", "http://json-schema.org/draft-03/hyper-schema#");
	ENVIRONMENT.setOption("latestJSONSchemaLinksURI", "http://json-schema.org/draft-03/links#");
	
	//
	//Latest JSON Schema
	//
	
	//Hack, but WAY faster than instantiating a new schema
	ENVIRONMENT._schemas["http://json-schema.org/schema#"] = SCHEMA_03;
	ENVIRONMENT._schemas["http://json-schema.org/hyper-schema#"] = HYPERSCHEMA_03;
	ENVIRONMENT._schemas["http://json-schema.org/links#"] = LINKS_03;
	
	//
	//register environment
	//
	
	JSV.registerEnvironment("json-schema-draft-03", ENVIRONMENT);
	if (!JSV.getDefaultEnvironmentID() || JSV.getDefaultEnvironmentID() === "json-schema-draft-01" || JSV.getDefaultEnvironmentID() === "json-schema-draft-02") {
		JSV.setDefaultEnvironmentID("json-schema-draft-03");
	}
	
}());
},{"./jsv":8}],8:[function(require,module,exports){
/**
 * JSV: JSON Schema Validator
 * 
 * @fileOverview A JavaScript implementation of a extendable, fully compliant JSON Schema validator.
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @version 4.0.2
 * @see http://github.com/garycourt/JSV
 */

/*
 * Copyright 2010 Gary Court. All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, are
 * permitted provided that the following conditions are met:
 * 
 *    1. Redistributions of source code must retain the above copyright notice, this list of
 *       conditions and the following disclaimer.
 * 
 *    2. Redistributions in binary form must reproduce the above copyright notice, this list
 *       of conditions and the following disclaimer in the documentation and/or other materials
 *       provided with the distribution.
 * 
 * THIS SOFTWARE IS PROVIDED BY GARY COURT ``AS IS'' AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL GARY COURT OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 * The views and conclusions contained in the software and documentation are those of the
 * authors and should not be interpreted as representing official policies, either expressed
 * or implied, of Gary Court or the JSON Schema specification.
 */

/*jslint white: true, sub: true, onevar: true, undef: true, eqeqeq: true, newcap: true, immed: true, indent: 4 */

var exports = exports || this,
	require = require || function () {
		return exports;
	};

(function () {
	
	var URI = require("./uri/uri").URI,
		O = {},
		I2H = "0123456789abcdef".split(""),
		mapArray, filterArray, searchArray,
		
		JSV;
	
	//
	// Utility functions
	//
	
	function typeOf(o) {
		return o === undefined ? "undefined" : (o === null ? "null" : Object.prototype.toString.call(o).split(" ").pop().split("]").shift().toLowerCase());
	}
	
	/** @inner */
	function F() {}
	
	function createObject(proto) {
		F.prototype = proto || {};
		return new F();
	}
	
	function mapObject(obj, func, scope) {
		var newObj = {}, key;
		for (key in obj) {
			if (obj[key] !== O[key]) {
				newObj[key] = func.call(scope, obj[key], key, obj);
			}
		}
		return newObj;
	}
	
	/** @ignore */
	mapArray = function (arr, func, scope) {
		var x = 0, xl = arr.length, newArr = new Array(xl);
		for (; x < xl; ++x) {
			newArr[x] = func.call(scope, arr[x], x, arr);
		}
		return newArr;
	};
		
	if (Array.prototype.map) {
		/** @ignore */
		mapArray = function (arr, func, scope) {
			return Array.prototype.map.call(arr, func, scope);
		};
	}
	
	/** @ignore */
	filterArray = function (arr, func, scope) {
		var x = 0, xl = arr.length, newArr = [];
		for (; x < xl; ++x) {
			if (func.call(scope, arr[x], x, arr)) {
				newArr[newArr.length] = arr[x];
			}
		}
		return newArr;
	};
	
	if (Array.prototype.filter) {
		/** @ignore */
		filterArray = function (arr, func, scope) {
			return Array.prototype.filter.call(arr, func, scope);
		};
	}
	
	/** @ignore */
	searchArray = function (arr, o) {
		var x = 0, xl = arr.length;
		for (; x < xl; ++x) {
			if (arr[x] === o) {
				return x;
			}
		}
		return -1;
	};
	
	if (Array.prototype.indexOf) {
		/** @ignore */
		searchArray = function (arr, o) {
			return Array.prototype.indexOf.call(arr, o);
		};
	}
	
	function toArray(o) {
		return o !== undefined && o !== null ? (o instanceof Array && !o.callee ? o : (typeof o.length !== "number" || o.split || o.setInterval || o.call ? [ o ] : Array.prototype.slice.call(o))) : [];
	}
	
	function keys(o) {
		var result = [], key;
		
		switch (typeOf(o)) {
		case "object":
			for (key in o) {
				if (o[key] !== O[key]) {
					result[result.length] = key;
				}
			}
			break;
		case "array":
			for (key = o.length - 1; key >= 0; --key) {
				result[key] = key;
			}
			break;
		}
		
		return result;
	}
	
	function pushUnique(arr, o) {
		if (searchArray(arr, o) === -1) {
			arr.push(o);
		}
		return arr;
	}
	
	function popFirst(arr, o) {
		var index = searchArray(arr, o);
		if (index > -1) {
			arr.splice(index, 1);
		}
		return arr;
	}
	
	function randomUUID() {
		return [
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			"-",
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			"-4",  //set 4 high bits of time_high field to version
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			"-",
			I2H[(Math.floor(Math.random() * 0x10) & 0x3) | 0x8],  //specify 2 high bits of clock sequence
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			"-",
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)],
			I2H[Math.floor(Math.random() * 0x10)]
		].join("");
	}
	
	function escapeURIComponent(str) {
		return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A');
	}
	
	function formatURI(uri) {
		if (typeof uri === "string" && uri.indexOf("#") === -1) {
			uri += "#";
		}
		return uri;
	}
	
	function stripInstances(o) {
		if (o instanceof JSONInstance) {
			return o.getURI();
		}
		
		switch (typeOf(o)) {
		case "undefined":
		case "null":
		case "boolean":
		case "number":
		case "string":
			return o;  //do nothing
		
		case "object":
			return mapObject(o, stripInstances);
		
		case "array":
			return mapArray(o, stripInstances);
		
		default:
			return o.toString();
		}
	}
	
	/**
	 * The exception that is thrown when a schema fails to be created.
	 * 
	 * @name InitializationError
	 * @class
	 * @param {JSONInstance|String} instance The instance (or instance URI) that is invalid
	 * @param {JSONSchema|String} schema The schema (or schema URI) that was validating the instance
	 * @param {String} attr The attribute that failed to validated
	 * @param {String} message A user-friendly message on why the schema attribute failed to validate the instance
	 * @param {Any} details The value of the schema attribute
	 */
	
	function InitializationError(instance, schema, attr, message, details) {
		Error.call(this, message);
		
		this.uri = instance instanceof JSONInstance ? instance.getURI() : instance;
		this.schemaUri = schema instanceof JSONInstance ? schema.getURI() : schema;
		this.attribute = attr;
		this.message = message;
		this.description = message;  //IE
		this.details = details;
	}
	
	InitializationError.prototype = new Error();
	InitializationError.prototype.constructor = InitializationError;
	InitializationError.prototype.name = "InitializationError";
	
	/**
	 * Defines an error, found by a schema, with an instance.
	 * This class can only be instantiated by {@link Report#addError}. 
	 * 
	 * @name ValidationError
	 * @class
	 * @see Report#addError
	 */
	
	/**
	 * The URI of the instance that has the error.
	 * 
	 * @name ValidationError.prototype.uri
	 * @type String
	 */
	
	/**
	 * The URI of the schema that generated the error.
	 * 
	 * @name ValidationError.prototype.schemaUri
	 * @type String
	 */
	
	/**
	 * The name of the schema attribute that generated the error.
	 * 
	 * @name ValidationError.prototype.attribute
	 * @type String
	 */
	
	/**
	 * An user-friendly (English) message about what failed to validate.
	 * 
	 * @name ValidationError.prototype.message
	 * @type String
	 */
	
	/**
	 * The value of the schema attribute that generated the error.
	 * 
	 * @name ValidationError.prototype.details
	 * @type Any
	 */
	
	/**
	 * Reports are returned from validation methods to describe the result of a validation.
	 * 
	 * @name Report
	 * @class
	 * @see JSONSchema#validate
	 * @see Environment#validate
	 */
	
	function Report() {
		/**
		 * An array of {@link ValidationError} objects that define all the errors generated by the schema against the instance.
		 * 
		 * @name Report.prototype.errors
		 * @type Array
		 * @see Report#addError
		 */
		this.errors = [];
		
		/**
		 * A hash table of every instance and what schemas were validated against it.
		 * <p>
		 * The key of each item in the table is the URI of the instance that was validated.
		 * The value of this key is an array of strings of URIs of the schema that validated it.
		 * </p>
		 * 
		 * @name Report.prototype.validated
		 * @type Object
		 * @see Report#registerValidation
		 * @see Report#isValidatedBy
		 */
		this.validated = {};
		
		/**
		 * If the report is generated by {@link Environment#validate}, this field is the generated instance.
		 * 
		 * @name Report.prototype.instance
		 * @type JSONInstance
		 * @see Environment#validate
		 */
		
		/**
		 * If the report is generated by {@link Environment#validate}, this field is the generated schema.
		 * 
		 * @name Report.prototype.schema
		 * @type JSONSchema
		 * @see Environment#validate
		 */
		 
		/**
		 * If the report is generated by {@link Environment#validate}, this field is the schema's schema.
		 * This value is the same as calling <code>schema.getSchema()</code>.
		 * 
		 * @name Report.prototype.schemaSchema
		 * @type JSONSchema
		 * @see Environment#validate
		 * @see JSONSchema#getSchema
		 */
	}
	
	/**
	 * Adds a {@link ValidationError} object to the <a href="#errors"><code>errors</code></a> field.
	 * 
	 * @param {JSONInstance|String} instance The instance (or instance URI) that is invalid
	 * @param {JSONSchema|String} schema The schema (or schema URI) that was validating the instance
	 * @param {String} attr The attribute that failed to validated
	 * @param {String} message A user-friendly message on why the schema attribute failed to validate the instance
	 * @param {Any} details The value of the schema attribute
	 */
	
	Report.prototype.addError = function (instance, schema, attr, message, details) {
		this.errors.push({
			uri : instance instanceof JSONInstance ? instance.getURI() : instance,
			schemaUri : schema instanceof JSONInstance ? schema.getURI() : schema,
			attribute : attr,
			message : message,
			details : stripInstances(details)
		});
	};
	
	/**
	 * Registers that the provided instance URI has been validated by the provided schema URI. 
	 * This is recorded in the <a href="#validated"><code>validated</code></a> field.
	 * 
	 * @param {String} uri The URI of the instance that was validated
	 * @param {String} schemaUri The URI of the schema that validated the instance
	 */
	
	Report.prototype.registerValidation = function (uri, schemaUri) {
		if (!this.validated[uri]) {
			this.validated[uri] = [ schemaUri ];
		} else {
			this.validated[uri].push(schemaUri);
		}
	};
	
	/**
	 * Returns if an instance with the provided URI has been validated by the schema with the provided URI. 
	 * 
	 * @param {String} uri The URI of the instance
	 * @param {String} schemaUri The URI of a schema
	 * @returns {Boolean} If the instance has been validated by the schema.
	 */
	
	Report.prototype.isValidatedBy = function (uri, schemaUri) {
		return !!this.validated[uri] && searchArray(this.validated[uri], schemaUri) !== -1;
	};
	
	/**
	 * A wrapper class for binding an Environment, URI and helper methods to an instance. 
	 * This class is most commonly instantiated with {@link Environment#createInstance}.
	 * 
	 * @name JSONInstance
	 * @class
	 * @param {Environment} env The environment this instance belongs to
	 * @param {JSONInstance|Any} json The value of the instance
	 * @param {String} [uri] The URI of the instance. If undefined, the URI will be a randomly generated UUID. 
	 * @param {String} [fd] The fragment delimiter for properties. If undefined, uses the environment default.
	 */
	
	function JSONInstance(env, json, uri, fd) {
		if (json instanceof JSONInstance) {
			if (typeof fd !== "string") {
				fd = json._fd;
			}
			if (typeof uri !== "string") {
				uri = json._uri;
			}
			json = json._value;
		}
		
		if (typeof uri !== "string") {
			uri = "urn:uuid:" + randomUUID() + "#";
		} else if (uri.indexOf(":") === -1) {
			uri = formatURI(URI.resolve("urn:uuid:" + randomUUID() + "#", uri));
		}
		
		this._env = env;
		this._value = json;
		this._uri = uri;
		this._fd = fd || this._env._options["defaultFragmentDelimiter"];
	}
	
	/**
	 * Returns the environment the instance is bound to.
	 * 
	 * @returns {Environment} The environment of the instance
	 */
	
	JSONInstance.prototype.getEnvironment = function () {
		return this._env;
	};
	
	/**
	 * Returns the name of the type of the instance.
	 * 
	 * @returns {String} The name of the type of the instance
	 */
	
	JSONInstance.prototype.getType = function () {
		return typeOf(this._value);
	};
	
	/**
	 * Returns the JSON value of the instance.
	 * 
	 * @returns {Any} The actual JavaScript value of the instance
	 */
	
	JSONInstance.prototype.getValue = function () {
		return this._value;
	};
	
	/**
	 * Returns the URI of the instance.
	 * 
	 * @returns {String} The URI of the instance
	 */
	
	JSONInstance.prototype.getURI = function () {
		return this._uri;
	};
	
	/**
	 * Returns a resolved URI of a provided relative URI against the URI of the instance.
	 * 
	 * @param {String} uri The relative URI to resolve
	 * @returns {String} The resolved URI
	 */
	
	JSONInstance.prototype.resolveURI = function (uri) {
		return formatURI(URI.resolve(this._uri, uri));
	};
	
	/**
	 * Returns an array of the names of all the properties.
	 * 
	 * @returns {Array} An array of strings which are the names of all the properties
	 */
	
	JSONInstance.prototype.getPropertyNames = function () {
		return keys(this._value);
	};
	
	/**
	 * Returns a {@link JSONInstance} of the value of the provided property name. 
	 * 
	 * @param {String} key The name of the property to fetch
	 * @returns {JSONInstance} The instance of the property value
	 */
	
	JSONInstance.prototype.getProperty = function (key) {
		var value = this._value ? this._value[key] : undefined;
		if (value instanceof JSONInstance) {
			return value;
		}
		//else
		return new JSONInstance(this._env, value, this._uri + this._fd + escapeURIComponent(key), this._fd);
	};
	
	/**
	 * Returns all the property instances of the target instance.
	 * <p>
	 * If the target instance is an Object, then the method will return a hash table of {@link JSONInstance}s of all the properties. 
	 * If the target instance is an Array, then the method will return an array of {@link JSONInstance}s of all the items.
	 * </p> 
	 * 
	 * @returns {Object|Array|undefined} The list of instances for all the properties
	 */
	
	JSONInstance.prototype.getProperties = function () {
		var type = typeOf(this._value),
			self = this;
		
		if (type === "object") {
			return mapObject(this._value, function (value, key) {
				if (value instanceof JSONInstance) {
					return value;
				}
				return new JSONInstance(self._env, value, self._uri + self._fd + escapeURIComponent(key), self._fd);
			});
		} else if (type === "array") {
			return mapArray(this._value, function (value, key) {
				if (value instanceof JSONInstance) {
					return value;
				}
				return new JSONInstance(self._env, value, self._uri + self._fd + escapeURIComponent(key), self._fd);
			});
		}
	};
	
	/**
	 * Returns the JSON value of the provided property name. 
	 * This method is a faster version of calling <code>instance.getProperty(key).getValue()</code>.
	 * 
	 * @param {String} key The name of the property
	 * @returns {Any} The JavaScript value of the instance
	 * @see JSONInstance#getProperty
	 * @see JSONInstance#getValue
	 */
	
	JSONInstance.prototype.getValueOfProperty = function (key) {
		if (this._value) {
			if (this._value[key] instanceof JSONInstance) {
				return this._value[key]._value;
			}
			return this._value[key];
		}
	};
	
	/**
	 * Return if the provided value is the same as the value of the instance.
	 * 
	 * @param {JSONInstance|Any} instance The value to compare
	 * @returns {Boolean} If both the instance and the value match
	 */
	
	JSONInstance.prototype.equals = function (instance) {
		if (instance instanceof JSONInstance) {
			return this._value === instance._value;
		}
		//else
		return this._value === instance;
	};
	
	/**
	 * Warning: Not a generic clone function
	 * Produces a JSV acceptable clone
	 */
	
	function clone(obj, deep) {
		var newObj, x;
		
		if (obj instanceof JSONInstance) {
			obj = obj.getValue();
		}
		
		switch (typeOf(obj)) {
		case "object":
			if (deep) {
				newObj = {};
				for (x in obj) {
					if (obj[x] !== O[x]) {
						newObj[x] = clone(obj[x], deep);
					}
				}
				return newObj;
			} else {
				return createObject(obj);
			}
			break;
		case "array":
			if (deep) {
				newObj = new Array(obj.length);
				x = obj.length;
				while (--x >= 0) {
					newObj[x] = clone(obj[x], deep);
				}
				return newObj;
			} else {
				return Array.prototype.slice.call(obj);
			}
			break;
		default:
			return obj;
		}
	}
	
	/**
	 * This class binds a {@link JSONInstance} with a {@link JSONSchema} to provided context aware methods. 
	 * 
	 * @name JSONSchema
	 * @class
	 * @param {Environment} env The environment this schema belongs to
	 * @param {JSONInstance|Any} json The value of the schema
	 * @param {String} [uri] The URI of the schema. If undefined, the URI will be a randomly generated UUID. 
	 * @param {JSONSchema|Boolean} [schema] The schema to bind to the instance. If <code>undefined</code>, the environment's default schema will be used. If <code>true</code>, the instance's schema will be itself.
	 * @extends JSONInstance
	 */
	
	function JSONSchema(env, json, uri, schema) {
		var fr;
		JSONInstance.call(this, env, json, uri);
		
		if (schema === true) {
			this._schema = this;
		} else if (json instanceof JSONSchema && !(schema instanceof JSONSchema)) {
			this._schema = json._schema;  //TODO: Make sure cross environments don't mess everything up
		} else {
			this._schema = schema instanceof JSONSchema ? schema : this._env.getDefaultSchema() || this._env.createEmptySchema();
		}
		
		//determine fragment delimiter from schema
		fr = this._schema.getValueOfProperty("fragmentResolution");
		if (fr === "dot-delimited") {
			this._fd = ".";
		} else if (fr === "slash-delimited") {
			this._fd = "/";
		}
		
		return this.rebuild();  //this works even when called with "new"
	}
	
	JSONSchema.prototype = createObject(JSONInstance.prototype);
	
	/**
	 * Returns the schema of the schema.
	 * 
	 * @returns {JSONSchema} The schema of the schema
	 */
	
	JSONSchema.prototype.getSchema = function () {
		var uri = this._refs && this._refs["describedby"],
			newSchema;
		
		if (uri) {
			newSchema = uri && this._env.findSchema(uri);
			
			if (newSchema) {
				if (!newSchema.equals(this._schema)) {
					this._schema = newSchema;
					this.rebuild();  //if the schema has changed, the context has changed - so everything must be rebuilt
				}
			} else if (this._env._options["enforceReferences"]) {
				throw new InitializationError(this, this._schema, "{describedby}", "Unknown schema reference", uri);
			}
		}
		
		return this._schema;
	};
	
	/**
	 * Returns the value of the provided attribute name.
	 * <p>
	 * This method is different from {@link JSONInstance#getProperty} as the named property 
	 * is converted using a parser defined by the schema's schema before being returned. This
	 * makes the return value of this method attribute dependent.
	 * </p>
	 * 
	 * @param {String} key The name of the attribute
	 * @param {Any} [arg] Some attribute parsers accept special arguments for returning resolved values. This is attribute dependent.
	 * @returns {JSONSchema|Any} The value of the attribute
	 */
	
	JSONSchema.prototype.getAttribute = function (key, arg) {
		var schemaProperty, parser, property, result,
			schema = this.getSchema();  //we do this here to make sure the "describedby" reference has not changed, and that the attribute cache is up-to-date
		
		if (!arg && this._attributes && this._attributes.hasOwnProperty(key)) {
			return this._attributes[key];
		}
		
		schemaProperty = schema.getProperty("properties").getProperty(key);
		parser = schemaProperty.getValueOfProperty("parser");
		property = this.getProperty(key);
		if (typeof parser === "function") {
			result = parser(property, schemaProperty, arg);
			if (!arg && this._attributes) {
				this._attributes[key] = result;
			}
			return result;
		}
		//else
		return property.getValue();
	};
	
	/**
	 * Returns all the attributes of the schema.
	 * 
	 * @returns {Object} A map of all parsed attribute values
	 */
	
	JSONSchema.prototype.getAttributes = function () {
		var properties, schemaProperties, key, schemaProperty, parser,
			schema = this.getSchema();  //we do this here to make sure the "describedby" reference has not changed, and that the attribute cache is up-to-date
		
		if (!this._attributes && this.getType() === "object") {
			properties = this.getProperties();
			schemaProperties = schema.getProperty("properties");
			this._attributes = {};
			for (key in properties) {
				if (properties[key] !== O[key]) {
					schemaProperty = schemaProperties && schemaProperties.getProperty(key);
					parser = schemaProperty && schemaProperty.getValueOfProperty("parser");
					if (typeof parser === "function") {
						this._attributes[key] = parser(properties[key], schemaProperty);
					} else {
						this._attributes[key] = properties[key].getValue();
					}
				}
			}
		}
		
		return clone(this._attributes, false);
	};
	
	/**
	 * Convenience method for retrieving a link or link object from a schema. 
	 * This method is the same as calling <code>schema.getAttribute("links", [rel, instance])[0];</code>.
	 * 
	 * @param {String} rel The link relationship
	 * @param {JSONInstance} [instance] The instance to resolve any URIs from
	 * @returns {String|Object|undefined} If <code>instance</code> is provided, a string containing the resolve URI of the link is returned.
	 *   If <code>instance</code> is not provided, a link object is returned with details of the link.
	 *   If no link with the provided relationship exists, <code>undefined</code> is returned.
	 * @see JSONSchema#getAttribute
	 */
	
	JSONSchema.prototype.getLink = function (rel, instance) {
		var schemaLinks = this.getAttribute("links", [rel, instance]);
		if (schemaLinks && schemaLinks.length && schemaLinks[schemaLinks.length - 1]) {
			return schemaLinks[schemaLinks.length - 1];
		}
	};
	
	/**
	 * Validates the provided instance against the target schema and returns a {@link Report}.
	 * 
	 * @param {JSONInstance|Any} instance The instance to validate; may be a {@link JSONInstance} or any JavaScript value
	 * @param {Report} [report] A {@link Report} to concatenate the result of the validation to. If <code>undefined</code>, a new {@link Report} is created. 
	 * @param {JSONInstance} [parent] The parent/containing instance of the provided instance
	 * @param {JSONSchema} [parentSchema] The schema of the parent/containing instance
	 * @param {String} [name] The name of the parent object's property that references the instance
	 * @returns {Report} The result of the validation
	 */
	
	JSONSchema.prototype.validate = function (instance, report, parent, parentSchema, name) {
		var schemaSchema = this.getSchema(),
			validator = schemaSchema.getValueOfProperty("validator");
		
		if (!(instance instanceof JSONInstance)) {
			instance = this.getEnvironment().createInstance(instance);
		}
		
		if (!(report instanceof Report)) {
			report = new Report();
		}
		
		if (this._env._options["validateReferences"] && this._refs) {
			if (this._refs["describedby"] && !this._env.findSchema(this._refs["describedby"])) {
				report.addError(this, this._schema, "{describedby}", "Unknown schema reference", this._refs["describedby"]);
			}
			if (this._refs["full"] && !this._env.findSchema(this._refs["full"])) {
				report.addError(this, this._schema, "{full}", "Unknown schema reference", this._refs["full"]);
			}
		}
		
		if (typeof validator === "function" && !report.isValidatedBy(instance.getURI(), this.getURI())) {
			report.registerValidation(instance.getURI(), this.getURI());
			validator(instance, this, schemaSchema, report, parent, parentSchema, name);
		}
		
		return report;
	};
	
	/** @inner */
	function createFullLookupWrapper(func) {
		return /** @inner */ function fullLookupWrapper() {
			var scope = this,
				stack = [],
				uri = scope._refs && scope._refs["full"],
				schema;
			
			while (uri) {
				schema = scope._env.findSchema(uri);
				if (schema) {
					if (schema._value === scope._value) {
						break;
					}
					scope = schema;
					stack.push(uri);
					uri = scope._refs && scope._refs["full"];
					if (stack.indexOf(uri) > -1) {
						break;  //stop infinite loop
					}
				} else if (scope._env._options["enforceReferences"]) {
					throw new InitializationError(scope, scope._schema, "{full}", "Unknown schema reference", uri);
				} else {
					uri = null;
				}
			}
			return func.apply(scope, arguments);
		};
	}
	
	/**
	 * Wraps all JSONInstance methods with a function that resolves the "full" reference.
	 * 
	 * @inner
	 */
	
	(function () {
		var key;
		for (key in JSONSchema.prototype) {
			if (JSONSchema.prototype[key] !== O[key] && typeOf(JSONSchema.prototype[key]) === "function") {
				JSONSchema.prototype[key] = createFullLookupWrapper(JSONSchema.prototype[key]);
			}
		}
	}());
	
	/**
	 * Reinitializes/re-registers/rebuilds the schema.
	 * <br/>
	 * This is used internally, and should only be called when a schema's private variables are modified directly.
	 * 
	 * @private
	 * @return {JSONSchema} The newly rebuilt schema
	 */
	
	JSONSchema.prototype.rebuild = function () {
		var instance = this,
			initializer = instance.getSchema().getValueOfProperty("initializer");
		
		//clear previous built values
		instance._refs = null;
		instance._attributes = null;
		
		if (typeof initializer === "function") {
			instance = initializer(instance);
		}
		
		//register schema
		instance._env._schemas[instance._uri] = instance;
		
		//build & cache the rest of the schema
		instance.getAttributes();
		
		return instance;
	};
	
	/**
	 * Set the provided reference to the given value.
	 * <br/>
	 * References are used for establishing soft-links to other {@link JSONSchema}s.
	 * Currently, the following references are natively supported:
	 * <dl>
	 *   <dt><code>full</code></dt>
	 *   <dd>The value is the URI to the full instance of this instance.</dd>
	 *   <dt><code>describedby</code></dt>
	 *   <dd>The value is the URI to the schema of this instance.</dd>
	 * </dl>
	 * 
	 * @param {String} name The name of the reference
	 * @param {String} uri The URI of the schema to refer to
	 */
	
	JSONSchema.prototype.setReference = function (name, uri) {
		if (!this._refs) {
			this._refs = {};
		}
		this._refs[name] = this.resolveURI(uri);
	};
	
	/**
	 * Returns the value of the provided reference name.
	 * 
	 * @param {String} name The name of the reference
	 * @return {String} The value of the provided reference name
	 */
	
	JSONSchema.prototype.getReference = function (name) {
		return this._refs && this._refs[name];
	};
	
	/**
	 * Merges two schemas/instances together.
	 */
	
	function inherits(base, extra, extension) {
		var baseType = typeOf(base),
			extraType = typeOf(extra),
			child, x;
		
		if (extraType === "undefined") {
			return clone(base, true);
		} else if (baseType === "undefined" || extraType !== baseType) {
			return clone(extra, true);
		} else if (extraType === "object") {
			if (base instanceof JSONSchema) {
				base = base.getAttributes();
			}
			if (extra instanceof JSONSchema) {
				extra = extra.getAttributes();
				if (extra["extends"] && extension && extra["extends"] instanceof JSONSchema) {
					extra["extends"] = [ extra["extends"] ];
				}
			}
			child = clone(base, true);  //this could be optimized as some properties get overwritten
			for (x in extra) {
				if (extra[x] !== O[x]) {
					child[x] = inherits(base[x], extra[x], extension);
				}
			}
			return child;
		} else {
			return clone(extra, true);
		}
	}
	
	/**
	 * An Environment is a sandbox of schemas thats behavior is different from other environments.
	 * 
	 * @name Environment
	 * @class
	 */
	
	function Environment() {
		this._id = randomUUID();
		this._schemas = {};
		this._options = {};
		
		this.createSchema({}, true, "urn:jsv:empty-schema#");
	}
	
	/**
	 * Returns a clone of the target environment.
	 * 
	 * @returns {Environment} A new {@link Environment} that is a exact copy of the target environment 
	 */
	
	Environment.prototype.clone = function () {
		var env = new Environment();
		env._schemas = createObject(this._schemas);
		env._options = createObject(this._options);
		
		return env;
	};
	
	/**
	 * Returns a new {@link JSONInstance} of the provided data.
	 * 
	 * @param {JSONInstance|Any} data The value of the instance
	 * @param {String} [uri] The URI of the instance. If undefined, the URI will be a randomly generated UUID. 
	 * @returns {JSONInstance} A new {@link JSONInstance} from the provided data
	 */
	
	Environment.prototype.createInstance = function (data, uri) {
		uri = formatURI(uri);
		
		if (data instanceof JSONInstance && (!uri || data.getURI() === uri)) {
			return data;
		}

		return new JSONInstance(this, data, uri);
	};
	
	/**
	 * Creates a new {@link JSONSchema} from the provided data, and registers it with the environment. 
	 * 
	 * @param {JSONInstance|Any} data The value of the schema
	 * @param {JSONSchema|Boolean} [schema] The schema to bind to the instance. If <code>undefined</code>, the environment's default schema will be used. If <code>true</code>, the instance's schema will be itself.
	 * @param {String} [uri] The URI of the schema. If undefined, the URI will be a randomly generated UUID. 
	 * @returns {JSONSchema} A new {@link JSONSchema} from the provided data
	 * @throws {InitializationError} If a schema that is not registered with the environment is referenced 
	 */
	
	Environment.prototype.createSchema = function (data, schema, uri) {
		uri = formatURI(uri);
		
		if (data instanceof JSONSchema && (!uri || data._uri === uri) && (!schema || data.getSchema().equals(schema))) {
			return data;
		}
		
		return new JSONSchema(this, data, uri, schema);
	};
	
	/**
	 * Creates an empty schema.
	 * 
	 * @returns {JSONSchema} The empty schema, who's schema is itself.
	 */
	
	Environment.prototype.createEmptySchema = function () {
		return this._schemas["urn:jsv:empty-schema#"];
	};
	
	/**
	 * Returns the schema registered with the provided URI.
	 * 
	 * @param {String} uri The absolute URI of the required schema
	 * @returns {JSONSchema|undefined} The request schema, or <code>undefined</code> if not found
	 */
	
	Environment.prototype.findSchema = function (uri) {
		return this._schemas[formatURI(uri)];
	};
	
	/**
	 * Sets the specified environment option to the specified value.
	 * 
	 * @param {String} name The name of the environment option to set
	 * @param {Any} value The new value of the environment option
	 */
	
	Environment.prototype.setOption = function (name, value) {
		this._options[name] = value;
	};
	
	/**
	 * Returns the specified environment option.
	 * 
	 * @param {String} name The name of the environment option to set
	 * @returns {Any} The value of the environment option
	 */
	
	Environment.prototype.getOption = function (name) {
		return this._options[name];
	};
	
	/**
	 * Sets the default fragment delimiter of the environment.
	 * 
	 * @deprecated Use {@link Environment#setOption} with option "defaultFragmentDelimiter"
	 * @param {String} fd The fragment delimiter character
	 */
	
	Environment.prototype.setDefaultFragmentDelimiter = function (fd) {
		if (typeof fd === "string" && fd.length > 0) {
			this._options["defaultFragmentDelimiter"] = fd;
		}
	};
	
	/**
	 * Returns the default fragment delimiter of the environment.
	 * 
	 * @deprecated Use {@link Environment#getOption} with option "defaultFragmentDelimiter"
	 * @returns {String} The fragment delimiter character
	 */
	
	Environment.prototype.getDefaultFragmentDelimiter = function () {
		return this._options["defaultFragmentDelimiter"];
	};
	
	/**
	 * Sets the URI of the default schema for the environment.
	 * 
	 * @deprecated Use {@link Environment#setOption} with option "defaultSchemaURI"
	 * @param {String} uri The default schema URI
	 */
	
	Environment.prototype.setDefaultSchemaURI = function (uri) {
		if (typeof uri === "string") {
			this._options["defaultSchemaURI"] = formatURI(uri);
		}
	};
	
	/**
	 * Returns the default schema of the environment.
	 * 
	 * @returns {JSONSchema} The default schema
	 */
	
	Environment.prototype.getDefaultSchema = function () {
		return this.findSchema(this._options["defaultSchemaURI"]);
	};
	
	/**
	 * Validates both the provided schema and the provided instance, and returns a {@link Report}. 
	 * If the schema fails to validate, the instance will not be validated.
	 * 
	 * @param {JSONInstance|Any} instanceJSON The {@link JSONInstance} or JavaScript value to validate.
	 * @param {JSONSchema|Any} schemaJSON The {@link JSONSchema} or JavaScript value to use in the validation. This will also be validated againt the schema's schema.
	 * @returns {Report} The result of the validation
	 */
	
	Environment.prototype.validate = function (instanceJSON, schemaJSON) {
		var instance,
			schema,
			schemaSchema,
			report = new Report();
		
		try {
			instance = this.createInstance(instanceJSON);
			report.instance = instance;
		} catch (e) {
			report.addError(e.uri, e.schemaUri, e.attribute, e.message, e.details);
		}
		
		try {
			schema = this.createSchema(schemaJSON);
			report.schema = schema;
			
			schemaSchema = schema.getSchema();
			report.schemaSchema = schemaSchema;
		} catch (f) {
			report.addError(f.uri, f.schemaUri, f.attribute, f.message, f.details);
		}
		
		if (schemaSchema) {
			schemaSchema.validate(schema, report);
		}
			
		if (report.errors.length) {
			return report;
		}
		
		return schema.validate(instance, report);
	};
	
	/**
	 * @private
	 */
	
	Environment.prototype._checkForInvalidInstances = function (stackSize, schemaURI) {
		var result = [],
			stack = [
				[schemaURI, this._schemas[schemaURI]]
			], 
			counter = 0,
			item, uri, instance, properties, key;
		
		while (counter++ < stackSize && stack.length) {
			item = stack.shift();
			uri = item[0];
			instance = item[1];
			
			if (instance instanceof JSONSchema) {
				if (this._schemas[instance._uri] !== instance) {
					result.push("Instance " + uri + " does not match " + instance._uri);
				} else {
					//schema = instance.getSchema();
					//stack.push([uri + "/{schema}", schema]);
					
					properties = instance.getAttributes();
					for (key in properties) {
						if (properties[key] !== O[key]) {
							stack.push([uri + "/" + escapeURIComponent(key), properties[key]]);
						}
					}
				}
			} else if (typeOf(instance) === "object") {
				properties = instance;
				for (key in properties) {
					if (properties.hasOwnProperty(key)) {
						stack.push([uri + "/" + escapeURIComponent(key), properties[key]]);
					}
				}
			} else if (typeOf(instance) === "array") {
				properties = instance;
				for (key = 0; key < properties.length; ++key) {
					stack.push([uri + "/" + escapeURIComponent(key), properties[key]]);
				}
			}
		}
		
		return result.length ? result : counter;
	};
	
	/**
	 * A globaly accessible object that provides the ability to create and manage {@link Environments},
	 * as well as providing utility methods.
	 * 
	 * @namespace
	 */
	
	JSV = {
		_environments : {},
		_defaultEnvironmentID : "",
		
		/**
		 * Returns if the provide value is an instance of {@link JSONInstance}.
		 * 
		 * @param o The value to test
		 * @returns {Boolean} If the provide value is an instance of {@link JSONInstance}
		 */
		
		isJSONInstance : function (o) {
			return o instanceof JSONInstance;
		},
		
		/**
		 * Returns if the provide value is an instance of {@link JSONSchema}.
		 * 
		 * @param o The value to test
		 * @returns {Boolean} If the provide value is an instance of {@link JSONSchema}
		 */
		
		isJSONSchema : function (o) {
			return o instanceof JSONSchema;
		},
		
		/**
		 * Creates and returns a new {@link Environment} that is a clone of the environment registered with the provided ID.
		 * If no environment ID is provided, the default environment is cloned.
		 * 
		 * @param {String} [id] The ID of the environment to clone. If <code>undefined</code>, the default environment ID is used.
		 * @returns {Environment} A newly cloned {@link Environment}
		 * @throws {Error} If there is no environment registered with the provided ID
		 */
		
		createEnvironment : function (id) {
			id = id || this._defaultEnvironmentID;
			
			if (!this._environments[id]) {
				throw new Error("Unknown Environment ID");
			}
			//else
			return this._environments[id].clone();
		},
		
		Environment : Environment,
		
		/**
		 * Registers the provided {@link Environment} with the provided ID.
		 * 
		 * @param {String} id The ID of the environment
		 * @param {Environment} env The environment to register
		 */
		
		registerEnvironment : function (id, env) {
			id = id || (env || 0)._id;
			if (id && !this._environments[id] && env instanceof Environment) {
				env._id = id;
				this._environments[id] = env;
			}
		},
		
		/**
		 * Sets which registered ID is the default environment.
		 * 
		 * @param {String} id The ID of the registered environment that is default
		 * @throws {Error} If there is no registered environment with the provided ID
		 */
		
		setDefaultEnvironmentID : function (id) {
			if (typeof id === "string") {
				if (!this._environments[id]) {
					throw new Error("Unknown Environment ID");
				}
				
				this._defaultEnvironmentID = id;
			}
		},
		
		/**
		 * Returns the ID of the default environment.
		 * 
		 * @returns {String} The ID of the default environment
		 */
		
		getDefaultEnvironmentID : function () {
			return this._defaultEnvironmentID;
		},
		
		//
		// Utility Functions
		//
		
		/**
		 * Returns the name of the type of the provided value.
		 *
		 * @event //utility
		 * @param {Any} o The value to determine the type of
		 * @returns {String} The name of the type of the value
		 */
		typeOf : typeOf,
		
		/**
		 * Return a new object that inherits all of the properties of the provided object.
		 *
		 * @event //utility
		 * @param {Object} proto The prototype of the new object
		 * @returns {Object} A new object that inherits all of the properties of the provided object
		 */
		createObject : createObject,
		
		/**
		 * Returns a new object with each property transformed by the iterator.
		 *
		 * @event //utility
		 * @param {Object} obj The object to transform
		 * @param {Function} iterator A function that returns the new value of the provided property
		 * @param {Object} [scope] The value of <code>this</code> in the iterator
		 * @returns {Object} A new object with each property transformed
		 */
		mapObject : mapObject,
		
		/**
		 * Returns a new array with each item transformed by the iterator.
		 * 
		 * @event //utility
		 * @param {Array} arr The array to transform
		 * @param {Function} iterator A function that returns the new value of the provided item
		 * @param {Object} scope The value of <code>this</code> in the iterator
		 * @returns {Array} A new array with each item transformed
		 */
		mapArray : mapArray,
		
		/**
		 * Returns a new array that only contains the items allowed by the iterator.
		 *
		 * @event //utility
		 * @param {Array} arr The array to filter
		 * @param {Function} iterator The function that returns true if the provided property should be added to the array
		 * @param {Object} scope The value of <code>this</code> within the iterator
		 * @returns {Array} A new array that contains the items allowed by the iterator
		 */
		filterArray : filterArray,
		
		/**
		 * Returns the first index in the array that the provided item is located at.
		 *
		 * @event //utility
		 * @param {Array} arr The array to search
		 * @param {Any} o The item being searched for
		 * @returns {Number} The index of the item in the array, or <code>-1</code> if not found
		 */
		searchArray : searchArray,
			
		/**
		 * Returns an array representation of a value.
		 * <ul>
		 * <li>For array-like objects, the value will be casted as an Array type.</li>
		 * <li>If an array is provided, the function will simply return the same array.</li>
		 * <li>For a null or undefined value, the result will be an empty Array.</li>
		 * <li>For all other values, the value will be the first element in a new Array. </li>
		 * </ul>
		 *
		 * @event //utility
		 * @param {Any} o The value to convert into an array
		 * @returns {Array} The value as an array
		 */
		toArray : toArray,
		
		/**
		 * Returns an array of the names of all properties of an object.
		 * 
		 * @event //utility
		 * @param {Object|Array} o The object in question
		 * @returns {Array} The names of all properties
		 */
		keys : keys,
		
		/**
		 * Mutates the array by pushing the provided value onto the array only if it is not already there.
		 *
		 * @event //utility
		 * @param {Array} arr The array to modify
		 * @param {Any} o The object to add to the array if it is not already there
		 * @returns {Array} The provided array for chaining
		 */
		pushUnique : pushUnique,
		
		/**
		 * Mutates the array by removing the first item that matches the provided value in the array.
		 *
		 * @event //utility
		 * @param {Array} arr The array to modify
		 * @param {Any} o The object to remove from the array
		 * @returns {Array} The provided array for chaining
		 */
		popFirst : popFirst,
		
		/**
		 * Creates a copy of the target object.
		 * <p>
		 * This method will create a new instance of the target, and then mixin the properties of the target.
		 * If <code>deep</code> is <code>true</code>, then each property will be cloned before mixin.
		 * </p>
		 * <p><b>Warning</b>: This is not a generic clone function, as it will only properly clone objects and arrays.</p>
		 * 
		 * @event //utility
		 * @param {Any} o The value to clone 
		 * @param {Boolean} [deep=false] If each property should be recursively cloned
		 * @returns A cloned copy of the provided value
		 */
		clone : clone,
		
		/**
		 * Generates a pseudo-random UUID.
		 * 
		 * @event //utility
		 * @returns {String} A new universally unique ID
		 */
		randomUUID : randomUUID,
		
		/**
		 * Properly escapes a URI component for embedding into a URI string.
		 * 
		 * @event //utility
		 * @param {String} str The URI component to escape
		 * @returns {String} The escaped URI component
		 */
		escapeURIComponent : escapeURIComponent,
		
		/**
		 * Returns a URI that is formated for JSV. Currently, this only ensures that the URI ends with a hash tag (<code>#</code>).
		 * 
		 * @event //utility
		 * @param {String} uri The URI to format
		 * @returns {String} The URI formatted for JSV
		 */
		formatURI : formatURI,
		
		/**
		 * Merges two schemas/instance together.
		 * 
		 * @event //utility
		 * @param {JSONSchema|Any} base The old value to merge
		 * @param {JSONSchema|Any} extra The new value to merge
		 * @param {Boolean} extension If the merge is a JSON Schema extension
		 * @return {Any} The modified base value
		 */
		 
		inherits : inherits,
		
		/**
		 * @private
		 * @event //utility
		 */
		
		InitializationError : InitializationError
	};
	
	this.JSV = JSV;  //set global object
	exports.JSV = JSV;  //export to CommonJS
	
	require("./environments");  //load default environments
	
}());
},{"./environments":4,"./uri/uri":9}],9:[function(require,module,exports){
/**
 * URI.js
 * 
 * @fileoverview An RFC 3986 compliant, scheme extendable URI parsing/validating/resolving library for JavaScript.
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @version 1.3
 * @see http://github.com/garycourt/uri-js
 * @license URI.js v1.3 (c) 2010 Gary Court. License: http://github.com/garycourt/uri-js
 */

/**
 * Copyright 2010 Gary Court. All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, are
 * permitted provided that the following conditions are met:
 * 
 *    1. Redistributions of source code must retain the above copyright notice, this list of
 *       conditions and the following disclaimer.
 * 
 *    2. Redistributions in binary form must reproduce the above copyright notice, this list
 *       of conditions and the following disclaimer in the documentation and/or other materials
 *       provided with the distribution.
 * 
 * THIS SOFTWARE IS PROVIDED BY GARY COURT ``AS IS'' AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL GARY COURT OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 * The views and conclusions contained in the software and documentation are those of the
 * authors and should not be interpreted as representing official policies, either expressed
 * or implied, of Gary Court.
 */

/*jslint white: true, sub: true, onevar: true, undef: true, eqeqeq: true, newcap: true, immed: true, indent: 4 */
/*global exports:true, require:true */

if (typeof exports === "undefined") {
	exports = {}; 
}
if (typeof require !== "function") {
	require = function (id) {
		return exports;
	};
}
(function () {
	var	
		/**
		 * @param {...string} sets
		 * @return {string}
		 */
		mergeSet = function (sets) {
			var set = arguments[0],
				x = 1,
				nextSet = arguments[x];
			
			while (nextSet) {
				set = set.slice(0, -1) + nextSet.slice(1);
				nextSet = arguments[++x];
			}
			
			return set;
		},
		
		/**
		 * @param {string} str
		 * @return {string}
		 */
		subexp = function (str) {
			return "(?:" + str + ")";
		},
	
		ALPHA$$ = "[A-Za-z]",
		CR$ = "[\\x0D]",
		DIGIT$$ = "[0-9]",
		DQUOTE$$ = "[\\x22]",
		HEXDIG$$ = mergeSet(DIGIT$$, "[A-Fa-f]"),  //case-insensitive
		LF$$ = "[\\x0A]",
		SP$$ = "[\\x20]",
		PCT_ENCODED$ = subexp("%" + HEXDIG$$ + HEXDIG$$),
		GEN_DELIMS$$ = "[\\:\\/\\?\\#\\[\\]\\@]",
		SUB_DELIMS$$ = "[\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=]",
		RESERVED$$ = mergeSet(GEN_DELIMS$$, SUB_DELIMS$$),
		UNRESERVED$$ = mergeSet(ALPHA$$, DIGIT$$, "[\\-\\.\\_\\~]"),
		SCHEME$ = subexp(ALPHA$$ + mergeSet(ALPHA$$, DIGIT$$, "[\\+\\-\\.]") + "*"),
		USERINFO$ = subexp(subexp(PCT_ENCODED$ + "|" + mergeSet(UNRESERVED$$, SUB_DELIMS$$, "[\\:]")) + "*"),
		DEC_OCTET$ = subexp(subexp("25[0-5]") + "|" + subexp("2[0-4]" + DIGIT$$) + "|" + subexp("1" + DIGIT$$ + DIGIT$$) + "|" + subexp("[1-9]" + DIGIT$$) + "|" + DIGIT$$),
		IPV4ADDRESS$ = subexp(DEC_OCTET$ + "\\." + DEC_OCTET$ + "\\." + DEC_OCTET$ + "\\." + DEC_OCTET$),
		H16$ = subexp(HEXDIG$$ + "{1,4}"),
		LS32$ = subexp(subexp(H16$ + "\\:" + H16$) + "|" + IPV4ADDRESS$),
		IPV6ADDRESS$ = subexp(mergeSet(UNRESERVED$$, SUB_DELIMS$$, "[\\:]") + "+"),  //FIXME
		IPVFUTURE$ = subexp("v" + HEXDIG$$ + "+\\." + mergeSet(UNRESERVED$$, SUB_DELIMS$$, "[\\:]") + "+"),
		IP_LITERAL$ = subexp("\\[" + subexp(IPV6ADDRESS$ + "|" + IPVFUTURE$) + "\\]"),
		REG_NAME$ = subexp(subexp(PCT_ENCODED$ + "|" + mergeSet(UNRESERVED$$, SUB_DELIMS$$)) + "*"),
		HOST$ = subexp(IP_LITERAL$ + "|" + IPV4ADDRESS$ + "|" + REG_NAME$),
		PORT$ = subexp(DIGIT$$ + "*"),
		AUTHORITY$ = subexp(subexp(USERINFO$ + "@") + "?" + HOST$ + subexp("\\:" + PORT$) + "?"),
		PCHAR$ = subexp(PCT_ENCODED$ + "|" + mergeSet(UNRESERVED$$, SUB_DELIMS$$, "[\\:\\@]")),
		SEGMENT$ = subexp(PCHAR$ + "*"),
		SEGMENT_NZ$ = subexp(PCHAR$ + "+"),
		SEGMENT_NZ_NC$ = subexp(subexp(PCT_ENCODED$ + "|" + mergeSet(UNRESERVED$$, SUB_DELIMS$$, "[\\@]")) + "+"),
		PATH_ABEMPTY$ = subexp(subexp("\\/" + SEGMENT$) + "*"),
		PATH_ABSOLUTE$ = subexp("\\/" + subexp(SEGMENT_NZ$ + PATH_ABEMPTY$) + "?"),  //simplified
		PATH_NOSCHEME$ = subexp(SEGMENT_NZ_NC$ + PATH_ABEMPTY$),  //simplified
		PATH_ROOTLESS$ = subexp(SEGMENT_NZ$ + PATH_ABEMPTY$),  //simplified
		PATH_EMPTY$ = subexp(""),  //simplified
		PATH$ = subexp(PATH_ABEMPTY$ + "|" + PATH_ABSOLUTE$ + "|" + PATH_NOSCHEME$ + "|" + PATH_ROOTLESS$ + "|" + PATH_EMPTY$),
		QUERY$ = subexp(subexp(PCHAR$ + "|[\\/\\?]") + "*"),
		FRAGMENT$ = subexp(subexp(PCHAR$ + "|[\\/\\?]") + "*"),
		HIER_PART$ = subexp(subexp("\\/\\/" + AUTHORITY$ + PATH_ABEMPTY$) + "|" + PATH_ABSOLUTE$ + "|" + PATH_ROOTLESS$ + "|" + PATH_EMPTY$),
		URI$ = subexp(SCHEME$ + "\\:" + HIER_PART$ + subexp("\\?" + QUERY$) + "?" + subexp("\\#" + FRAGMENT$) + "?"),
		RELATIVE_PART$ = subexp(subexp("\\/\\/" + AUTHORITY$ + PATH_ABEMPTY$) + "|" + PATH_ABSOLUTE$ + "|" + PATH_NOSCHEME$ + "|" + PATH_EMPTY$),
		RELATIVE_REF$ = subexp(RELATIVE_PART$ + subexp("\\?" + QUERY$) + "?" + subexp("\\#" + FRAGMENT$) + "?"),
		URI_REFERENCE$ = subexp(URI$ + "|" + RELATIVE_REF$),
		ABSOLUTE_URI$ = subexp(SCHEME$ + "\\:" + HIER_PART$ + subexp("\\?" + QUERY$) + "?"),
		
		URI_REF = new RegExp("^" + subexp("(" + URI$ + ")|(" + RELATIVE_REF$ + ")") + "$"),
		GENERIC_REF  = new RegExp("^(" + SCHEME$ + ")\\:" + subexp(subexp("\\/\\/(" + subexp("(" + USERINFO$ + ")@") + "?(" + HOST$ + ")" + subexp("\\:(" + PORT$ + ")") + "?)") + "?(" + PATH_ABEMPTY$ + "|" + PATH_ABSOLUTE$ + "|" + PATH_ROOTLESS$ + "|" + PATH_EMPTY$ + ")") + subexp("\\?(" + QUERY$ + ")") + "?" + subexp("\\#(" + FRAGMENT$ + ")") + "?$"),
		RELATIVE_REF = new RegExp("^(){0}" + subexp(subexp("\\/\\/(" + subexp("(" + USERINFO$ + ")@") + "?(" + HOST$ + ")" + subexp("\\:(" + PORT$ + ")") + "?)") + "?(" + PATH_ABEMPTY$ + "|" + PATH_ABSOLUTE$ + "|" + PATH_NOSCHEME$ + "|" + PATH_EMPTY$ + ")") + subexp("\\?(" + QUERY$ + ")") + "?" + subexp("\\#(" + FRAGMENT$ + ")") + "?$"),
		ABSOLUTE_REF = new RegExp("^(" + SCHEME$ + ")\\:" + subexp(subexp("\\/\\/(" + subexp("(" + USERINFO$ + ")@") + "?(" + HOST$ + ")" + subexp("\\:(" + PORT$ + ")") + "?)") + "?(" + PATH_ABEMPTY$ + "|" + PATH_ABSOLUTE$ + "|" + PATH_ROOTLESS$ + "|" + PATH_EMPTY$ + ")") + subexp("\\?(" + QUERY$ + ")") + "?$"),
		SAMEDOC_REF = new RegExp("^" + subexp("\\#(" + FRAGMENT$ + ")") + "?$"),
		AUTHORITY = new RegExp("^" + subexp("(" + USERINFO$ + ")@") + "?(" + HOST$ + ")" + subexp("\\:(" + PORT$ + ")") + "?$"),
		
		NOT_SCHEME = new RegExp(mergeSet("[^]", ALPHA$$, DIGIT$$, "[\\+\\-\\.]"), "g"),
		NOT_USERINFO = new RegExp(mergeSet("[^\\%\\:]", UNRESERVED$$, SUB_DELIMS$$), "g"),
		NOT_HOST = new RegExp(mergeSet("[^\\%]", UNRESERVED$$, SUB_DELIMS$$), "g"),
		NOT_PATH = new RegExp(mergeSet("[^\\%\\/\\:\\@]", UNRESERVED$$, SUB_DELIMS$$), "g"),
		NOT_PATH_NOSCHEME = new RegExp(mergeSet("[^\\%\\/\\@]", UNRESERVED$$, SUB_DELIMS$$), "g"),
		NOT_QUERY = new RegExp(mergeSet("[^\\%]", UNRESERVED$$, SUB_DELIMS$$, "[\\:\\@\\/\\?]"), "g"),
		NOT_FRAGMENT = NOT_QUERY,
		ESCAPE = new RegExp(mergeSet("[^]", UNRESERVED$$, SUB_DELIMS$$), "g"),
		UNRESERVED = new RegExp(UNRESERVED$$, "g"),
		OTHER_CHARS = new RegExp(mergeSet("[^\\%]", UNRESERVED$$, RESERVED$$), "g"),
		PCT_ENCODEDS = new RegExp(PCT_ENCODED$ + "+", "g"),
		URI_PARSE = /^(?:([^:\/?#]+):)?(?:\/\/((?:([^\/?#@]*)@)?([^\/?#:]*)(?:\:(\d*))?))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/i,
		RDS1 = /^\.\.?\//,
		RDS2 = /^\/\.(\/|$)/,
		RDS3 = /^\/\.\.(\/|$)/,
		RDS4 = /^\.\.?$/,
		RDS5 = /^\/?.*?(?=\/|$)/,
		NO_MATCH_IS_UNDEFINED = ("").match(/(){0}/)[1] === undefined,
		
		/**
		 * @param {string} chr
		 * @return {string}
		 */
		pctEncChar = function (chr) {
			var c = chr.charCodeAt(0);
 
			if (c < 128) {
				return "%" + c.toString(16).toUpperCase();
			}
			else if ((c > 127) && (c < 2048)) {
				return "%" + ((c >> 6) | 192).toString(16).toUpperCase() + "%" + ((c & 63) | 128).toString(16).toUpperCase();
			}
			else {
				return "%" + ((c >> 12) | 224).toString(16).toUpperCase() + "%" + (((c >> 6) & 63) | 128).toString(16).toUpperCase() + "%" + ((c & 63) | 128).toString(16).toUpperCase();
			}
		},
		
		/**
		 * @param {string} str
		 * @return {string}
		 */
		pctDecUnreserved = function (str) {
			var newStr = "", 
				i = 0,
				c, s;
	 
			while (i < str.length) {
				c = parseInt(str.substr(i + 1, 2), 16);
	 
				if (c < 128) {
					s = String.fromCharCode(c);
					if (s.match(UNRESERVED)) {
						newStr += s;
					} else {
						newStr += str.substr(i, 3);
					}
					i += 3;
				}
				else if ((c > 191) && (c < 224)) {
					newStr += str.substr(i, 6);
					i += 6;
				}
				else {
					newStr += str.substr(i, 9);
					i += 9;
				}
			}
	 
			return newStr;
		},
		
		/**
		 * @param {string} str
		 * @return {string}
		 */
		pctDecChars = function (str) {
			var newStr = "", 
				i = 0,
				c, c2, c3;
	 
			while (i < str.length) {
				c = parseInt(str.substr(i + 1, 2), 16);
	 
				if (c < 128) {
					newStr += String.fromCharCode(c);
					i += 3;
				}
				else if ((c > 191) && (c < 224)) {
					c2 = parseInt(str.substr(i + 4, 2), 16);
					newStr += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
					i += 6;
				}
				else {
					c2 = parseInt(str.substr(i + 4, 2), 16);
					c3 = parseInt(str.substr(i + 7, 2), 16);
					newStr += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
					i += 9;
				}
			}
	 
			return newStr;
		},
		
		/**
		 * @return {string}
		 */
		typeOf = function (o) {
			return o === undefined ? "undefined" : (o === null ? "null" : Object.prototype.toString.call(o).split(" ").pop().split("]").shift().toLowerCase());
		},
		
		/**
		 * @constructor
		 * @implements URIComponents
		 */
		Components = function () {
			this.errors = [];
		}, 
		
		/** @namespace */ 
		URI = exports;
	
	/**
	 * Components
	 */
	
	Components.prototype = {
		/**
		 * @type String
		 */
		
		scheme : undefined,
		
		/**
		 * @type String
		 */
		
		authority : undefined,
		
		/**
		 * @type String
		 */
		
		userinfo : undefined,
		
		/**
		 * @type String
		 */
		
		host : undefined,
		
		/**
		 * @type number
		 */
		
		port : undefined,
		
		/**
		 * @type string
		 */
		
		path : undefined,
		
		/**
		 * @type string
		 */
		
		query : undefined,
		
		/**
		 * @type string
		 */
		
		fragment : undefined,
		
		/**
		 * @type string
		 * @values "uri", "absolute", "relative", "same-document"
		 */
		
		reference : undefined,
		
		/**
		 * @type Array
		 */
		
		errors : undefined
	};
	
	/**
	 * URI
	 */
	
	/**
	 * @namespace
	 */
	
	URI.SCHEMES = {};
	
	/**
	 * @param {string} uriString
	 * @param {Options} [options]
	 * @returns {URIComponents}
	 */
	
	URI.parse = function (uriString, options) {
		var matches, 
			components = new Components(),
			schemeHandler;
		
		uriString = uriString ? uriString.toString() : "";
		options = options || {};
		
		if (options.reference === "suffix") {
			uriString = (options.scheme ? options.scheme + ":" : "") + "//" + uriString;
		}
		
		matches = uriString.match(URI_REF);
		
		if (matches) {
			if (matches[1]) {
				//generic URI
				matches = uriString.match(GENERIC_REF);
			} else {
				//relative URI
				matches = uriString.match(RELATIVE_REF);
			}
		} 
		
		if (!matches) {
			if (!options.tolerant) {
				components.errors.push("URI is not strictly valid.");
			}
			matches = uriString.match(URI_PARSE);
		}
		
		if (matches) {
			if (NO_MATCH_IS_UNDEFINED) {
				//store each component
				components.scheme = matches[1];
				components.authority = matches[2];
				components.userinfo = matches[3];
				components.host = matches[4];
				components.port = parseInt(matches[5], 10);
				components.path = matches[6] || "";
				components.query = matches[7];
				components.fragment = matches[8];
				
				//fix port number
				if (isNaN(components.port)) {
					components.port = matches[5];
				}
			} else {  //IE FIX for improper RegExp matching
				//store each component
				components.scheme = matches[1] || undefined;
				components.authority = (uriString.indexOf("//") !== -1 ? matches[2] : undefined);
				components.userinfo = (uriString.indexOf("@") !== -1 ? matches[3] : undefined);
				components.host = (uriString.indexOf("//") !== -1 ? matches[4] : undefined);
				components.port = parseInt(matches[5], 10);
				components.path = matches[6] || "";
				components.query = (uriString.indexOf("?") !== -1 ? matches[7] : undefined);
				components.fragment = (uriString.indexOf("#") !== -1 ? matches[8] : undefined);
				
				//fix port number
				if (isNaN(components.port)) {
					components.port = (uriString.match(/\/\/.*\:(?:\/|\?|\#|$)/) ? matches[4] : undefined);
				}
			}
			
			//determine reference type
			if (!components.scheme && !components.authority && !components.path && !components.query) {
				components.reference = "same-document";
			} else if (!components.scheme) {
				components.reference = "relative";
			} else if (!components.fragment) {
				components.reference = "absolute";
			} else {
				components.reference = "uri";
			}
			
			//check for reference errors
			if (options.reference && options.reference !== "suffix" && options.reference !== components.reference) {
				components.errors.push("URI is not a " + options.reference + " reference.");
			}
			
			//check if a handler for the scheme exists
			schemeHandler = URI.SCHEMES[(components.scheme || options.scheme || "").toLowerCase()];
			if (schemeHandler && schemeHandler.parse) {
				//perform extra parsing
				schemeHandler.parse(components, options);
			}
		} else {
			components.errors.push("URI can not be parsed.");
		}
		
		return components;
	};
	
	/**
	 * @private
	 * @param {URIComponents} components
	 * @returns {string|undefined}
	 */
	
	URI._recomposeAuthority = function (components) {
		var uriTokens = [];
		
		if (components.userinfo !== undefined || components.host !== undefined || typeof components.port === "number") {
			if (components.userinfo !== undefined) {
				uriTokens.push(components.userinfo.toString().replace(NOT_USERINFO, pctEncChar));
				uriTokens.push("@");
			}
			if (components.host !== undefined) {
				uriTokens.push(components.host.toString().toLowerCase().replace(NOT_HOST, pctEncChar));
			}
			if (typeof components.port === "number") {
				uriTokens.push(":");
				uriTokens.push(components.port.toString(10));
			}
		}
		
		return uriTokens.length ? uriTokens.join("") : undefined;
	};
	
	/**
	 * @param {string} input
	 * @returns {string}
	 */
	
	URI.removeDotSegments = function (input) {
		var output = [], s;
		
		while (input.length) {
			if (input.match(RDS1)) {
				input = input.replace(RDS1, "");
			} else if (input.match(RDS2)) {
				input = input.replace(RDS2, "/");
			} else if (input.match(RDS3)) {
				input = input.replace(RDS3, "/");
				output.pop();
			} else if (input === "." || input === "..") {
				input = "";
			} else {
				s = input.match(RDS5)[0];
				input = input.slice(s.length);
				output.push(s);
			}
		}
		
		return output.join("");
	};
	
	/**
	 * @param {URIComponents} components
	 * @param {Options} [options]
	 * @returns {string}
	 */
	
	URI.serialize = function (components, options) {
		var uriTokens = [], 
			schemeHandler, 
			s;
		options = options || {};
		
		//check if a handler for the scheme exists
		schemeHandler = URI.SCHEMES[components.scheme || options.scheme];
		if (schemeHandler && schemeHandler.serialize) {
			//perform extra serialization
			schemeHandler.serialize(components, options);
		}
		
		if (options.reference !== "suffix" && components.scheme) {
			uriTokens.push(components.scheme.toString().toLowerCase().replace(NOT_SCHEME, ""));
			uriTokens.push(":");
		}
		
		components.authority = URI._recomposeAuthority(components);
		if (components.authority !== undefined) {
			if (options.reference !== "suffix") {
				uriTokens.push("//");
			}
			
			uriTokens.push(components.authority);
			
			if (components.path && components.path.charAt(0) !== "/") {
				uriTokens.push("/");
			}
		}
		
		if (components.path) {
			s = URI.removeDotSegments(components.path.toString().replace(/%2E/ig, "."));
			
			if (components.scheme) {
				s = s.replace(NOT_PATH, pctEncChar);
			} else {
				s = s.replace(NOT_PATH_NOSCHEME, pctEncChar);
			}
			
			if (components.authority === undefined) {
				s = s.replace(/^\/\//, "/%2F");  //don't allow the path to start with "//"
			}
			uriTokens.push(s);
		}
		
		if (components.query) {
			uriTokens.push("?");
			uriTokens.push(components.query.toString().replace(NOT_QUERY, pctEncChar));
		}
		
		if (components.fragment) {
			uriTokens.push("#");
			uriTokens.push(components.fragment.toString().replace(NOT_FRAGMENT, pctEncChar));
		}
		
		return uriTokens
			.join('')  //merge tokens into a string
			.replace(PCT_ENCODEDS, pctDecUnreserved)  //undecode unreserved characters
			//.replace(OTHER_CHARS, pctEncChar)  //replace non-URI characters
			.replace(/%[0-9A-Fa-f]{2}/g, function (str) {  //uppercase percent encoded characters
				return str.toUpperCase();
			})
		;
	};
	
	/**
	 * @param {URIComponents} base
	 * @param {URIComponents} relative
	 * @param {Options} [options]
	 * @param {boolean} [skipNormalization]
	 * @returns {URIComponents}
	 */
	
	URI.resolveComponents = function (base, relative, options, skipNormalization) {
		var target = new Components();
		
		if (!skipNormalization) {
			base = URI.parse(URI.serialize(base, options), options);  //normalize base components
			relative = URI.parse(URI.serialize(relative, options), options);  //normalize relative components
		}
		options = options || {};
		
		if (!options.tolerant && relative.scheme) {
			target.scheme = relative.scheme;
			target.authority = relative.authority;
			target.userinfo = relative.userinfo;
			target.host = relative.host;
			target.port = relative.port;
			target.path = URI.removeDotSegments(relative.path);
			target.query = relative.query;
		} else {
			if (relative.authority !== undefined) {
				target.authority = relative.authority;
				target.userinfo = relative.userinfo;
				target.host = relative.host;
				target.port = relative.port;
				target.path = URI.removeDotSegments(relative.path);
				target.query = relative.query;
			} else {
				if (!relative.path) {
					target.path = base.path;
					if (relative.query !== undefined) {
						target.query = relative.query;
					} else {
						target.query = base.query;
					}
				} else {
					if (relative.path.charAt(0) === "/") {
						target.path = URI.removeDotSegments(relative.path);
					} else {
						if (base.authority !== undefined && !base.path) {
							target.path = "/" + relative.path;
						} else if (!base.path) {
							target.path = relative.path;
						} else {
							target.path = base.path.slice(0, base.path.lastIndexOf("/") + 1) + relative.path;
						}
						target.path = URI.removeDotSegments(target.path);
					}
					target.query = relative.query;
				}
				target.authority = base.authority;
				target.userinfo = base.userinfo;
				target.host = base.host;
				target.port = base.port;
			}
			target.scheme = base.scheme;
		}
		
		target.fragment = relative.fragment;
		
		return target;
	};
	
	/**
	 * @param {string} baseURI
	 * @param {string} relativeURI
	 * @param {Options} [options]
	 * @returns {string}
	 */
	
	URI.resolve = function (baseURI, relativeURI, options) {
		return URI.serialize(URI.resolveComponents(URI.parse(baseURI, options), URI.parse(relativeURI, options), options, true), options);
	};
	
	/**
	 * @param {string|URIComponents} uri
	 * @param {Options} options
	 * @returns {string|URIComponents}
	 */
	
	URI.normalize = function (uri, options) {
		if (typeof uri === "string") {
			return URI.serialize(URI.parse(uri, options), options);
		} else if (typeOf(uri) === "object") {
			return URI.parse(URI.serialize(uri, options), options);
		}
		
		return uri;
	};
	
	/**
	 * @param {string|URIComponents} uriA
	 * @param {string|URIComponents} uriB
	 * @param {Options} options
	 */
	
	URI.equal = function (uriA, uriB, options) {
		if (typeof uriA === "string") {
			uriA = URI.serialize(URI.parse(uriA, options), options);
		} else if (typeOf(uriA) === "object") {
			uriA = URI.serialize(uriA, options);
		}
		
		if (typeof uriB === "string") {
			uriB = URI.serialize(URI.parse(uriB, options), options);
		} else if (typeOf(uriB) === "object") {
			uriB = URI.serialize(uriB, options);
		}
		
		return uriA === uriB;
	};
	
	/**
	 * @param {string} str
	 * @returns {string}
	 */
	
	URI.escapeComponent = function (str) {
		return str && str.toString().replace(ESCAPE, pctEncChar);
	};
	
	/**
	 * @param {string} str
	 * @returns {string}
	 */
	
	URI.unescapeComponent = function (str) {
		return str && str.toString().replace(PCT_ENCODEDS, pctDecChars);
	};
	
	//export API
	exports.pctEncChar = pctEncChar;
	exports.pctDecChars = pctDecChars;
	exports.Components = Components;
	exports.URI = URI;
	
	//name-safe export API
	exports["pctEncChar"] = pctEncChar;
	exports["pctDecChars"] = pctDecChars;
	exports["Components"] = Components;
	exports["URI"] = {
		"SCHEMES" : URI.SCHEMES,
		"parse" : URI.parse,
		"removeDotSegments" : URI.removeDotSegments,
		"serialize" : URI.serialize,
		"resolveComponents" : URI.resolveComponents,
		"resolve" : URI.resolve,
		"normalize" : URI.normalize,
		"equal" : URI.equal,
		"escapeComponent" : URI.escapeComponent,
		"unescapeComponent" : URI.unescapeComponent
	};
	
}());
},{}],10:[function(require,module,exports){
(function (process){

/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter;
var spawn = require('child_process').spawn;
var path = require('path');
var dirname = path.dirname;
var basename = path.basename;

/**
 * Expose the root command.
 */

exports = module.exports = new Command();

/**
 * Expose `Command`.
 */

exports.Command = Command;

/**
 * Expose `Option`.
 */

exports.Option = Option;

/**
 * Initialize a new `Option` with the given `flags` and `description`.
 *
 * @param {String} flags
 * @param {String} description
 * @api public
 */

function Option(flags, description) {
  this.flags = flags;
  this.required = ~flags.indexOf('<');
  this.optional = ~flags.indexOf('[');
  this.bool = !~flags.indexOf('-no-');
  flags = flags.split(/[ ,|]+/);
  if (flags.length > 1 && !/^[[<]/.test(flags[1])) this.short = flags.shift();
  this.long = flags.shift();
  this.description = description || '';
}

/**
 * Return option name.
 *
 * @return {String}
 * @api private
 */

Option.prototype.name = function() {
  return this.long
    .replace('--', '')
    .replace('no-', '');
};

/**
 * Check if `arg` matches the short or long flag.
 *
 * @param {String} arg
 * @return {Boolean}
 * @api private
 */

Option.prototype.is = function(arg) {
  return arg == this.short || arg == this.long;
};

/**
 * Initialize a new `Command`.
 *
 * @param {String} name
 * @api public
 */

function Command(name) {
  this.commands = [];
  this.options = [];
  this._execs = [];
  this._allowUnknownOption = false;
  this._args = [];
  this._name = name;
}

/**
 * Inherit from `EventEmitter.prototype`.
 */

Command.prototype.__proto__ = EventEmitter.prototype;

/**
 * Add command `name`.
 *
 * The `.action()` callback is invoked when the
 * command `name` is specified via __ARGV__,
 * and the remaining arguments are applied to the
 * function for access.
 *
 * When the `name` is "*" an un-matched command
 * will be passed as the first arg, followed by
 * the rest of __ARGV__ remaining.
 *
 * Examples:
 *
 *      program
 *        .version('0.0.1')
 *        .option('-C, --chdir <path>', 'change the working directory')
 *        .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
 *        .option('-T, --no-tests', 'ignore test hook')
 *
 *      program
 *        .command('setup')
 *        .description('run remote setup commands')
 *        .action(function() {
 *          console.log('setup');
 *        });
 *
 *      program
 *        .command('exec <cmd>')
 *        .description('run the given remote command')
 *        .action(function(cmd) {
 *          console.log('exec "%s"', cmd);
 *        });
 *
 *      program
 *        .command('teardown <dir> [otherDirs...]')
 *        .description('run teardown commands')
 *        .action(function(dir, otherDirs) {
 *          console.log('dir "%s"', dir);
 *          if (otherDirs) {
 *            otherDirs.forEach(function (oDir) {
 *              console.log('dir "%s"', oDir);
 *            });
 *          }
 *        });
 *
 *      program
 *        .command('*')
 *        .description('deploy the given env')
 *        .action(function(env) {
 *          console.log('deploying "%s"', env);
 *        });
 *
 *      program.parse(process.argv);
  *
 * @param {String} name
 * @param {String} [desc] for git-style sub-commands
 * @return {Command} the new command
 * @api public
 */

Command.prototype.command = function(name, desc) {
  var args = name.split(/ +/);
  var cmd = new Command(args.shift());

  if (desc) {
    cmd.description(desc);
    this.executables = true;
    this._execs[cmd._name] = true;
  }

  this.commands.push(cmd);
  cmd.parseExpectedArgs(args);
  cmd.parent = this;

  if (desc) return this;
  return cmd;
};

/**
 * Add an implicit `help [cmd]` subcommand
 * which invokes `--help` for the given command.
 *
 * @api private
 */

Command.prototype.addImplicitHelpCommand = function() {
  this.command('help [cmd]', 'display help for [cmd]');
};

/**
 * Parse expected `args`.
 *
 * For example `["[type]"]` becomes `[{ required: false, name: 'type' }]`.
 *
 * @param {Array} args
 * @return {Command} for chaining
 * @api public
 */

Command.prototype.parseExpectedArgs = function(args) {
  if (!args.length) return;
  var self = this;
  args.forEach(function(arg) {
    var argDetails = {
      required: false,
      name: '',
      variadic: false
    };

    switch (arg[0]) {
      case '<':
        argDetails.required = true;
        argDetails.name = arg.slice(1, -1);
        break;
      case '[':
        argDetails.name = arg.slice(1, -1);
        break;
    }

    if (argDetails.name.length > 3 && argDetails.name.slice(-3) === '...') {
      argDetails.variadic = true;
      argDetails.name = argDetails.name.slice(0, -3);
    }
    if (argDetails.name) {
      self._args.push(argDetails);
    }
  });
  return this;
};

/**
 * Register callback `fn` for the command.
 *
 * Examples:
 *
 *      program
 *        .command('help')
 *        .description('display verbose help')
 *        .action(function() {
 *           // output help here
 *        });
 *
 * @param {Function} fn
 * @return {Command} for chaining
 * @api public
 */

Command.prototype.action = function(fn) {
  var self = this;
  var listener = function(args, unknown) {
    // Parse any so-far unknown options
    args = args || [];
    unknown = unknown || [];

    var parsed = self.parseOptions(unknown);

    // Output help if necessary
    outputHelpIfNecessary(self, parsed.unknown);

    // If there are still any unknown options, then we simply
    // die, unless someone asked for help, in which case we give it
    // to them, and then we die.
    if (parsed.unknown.length > 0) {
      self.unknownOption(parsed.unknown[0]);
    }

    // Leftover arguments need to be pushed back. Fixes issue #56
    if (parsed.args.length) args = parsed.args.concat(args);

    self._args.forEach(function(arg, i) {
      if (arg.required && null == args[i]) {
        self.missingArgument(arg.name);
      } else if (arg.variadic) {
        if (i !== self._args.length - 1) {
          self.variadicArgNotLast(arg.name);
        }

        args[i] = args.splice(i);
      }
    });

    // Always append ourselves to the end of the arguments,
    // to make sure we match the number of arguments the user
    // expects
    if (self._args.length) {
      args[self._args.length] = self;
    } else {
      args.push(self);
    }

    fn.apply(self, args);
  };
  this.parent.on(this._name, listener);
  if (this._alias) this.parent.on(this._alias, listener);
  return this;
};

/**
 * Define option with `flags`, `description` and optional
 * coercion `fn`.
 *
 * The `flags` string should contain both the short and long flags,
 * separated by comma, a pipe or space. The following are all valid
 * all will output this way when `--help` is used.
 *
 *    "-p, --pepper"
 *    "-p|--pepper"
 *    "-p --pepper"
 *
 * Examples:
 *
 *     // simple boolean defaulting to false
 *     program.option('-p, --pepper', 'add pepper');
 *
 *     --pepper
 *     program.pepper
 *     // => Boolean
 *
 *     // simple boolean defaulting to true
 *     program.option('-C, --no-cheese', 'remove cheese');
 *
 *     program.cheese
 *     // => true
 *
 *     --no-cheese
 *     program.cheese
 *     // => false
 *
 *     // required argument
 *     program.option('-C, --chdir <path>', 'change the working directory');
 *
 *     --chdir /tmp
 *     program.chdir
 *     // => "/tmp"
 *
 *     // optional argument
 *     program.option('-c, --cheese [type]', 'add cheese [marble]');
 *
 * @param {String} flags
 * @param {String} description
 * @param {Function|Mixed} fn or default
 * @param {Mixed} defaultValue
 * @return {Command} for chaining
 * @api public
 */

Command.prototype.option = function(flags, description, fn, defaultValue) {
  var self = this
    , option = new Option(flags, description)
    , oname = option.name()
    , name = camelcase(oname);

  // default as 3rd arg
  if (typeof fn != 'function') {
    defaultValue = fn;
    fn = null;
  }

  // preassign default value only for --no-*, [optional], or <required>
  if (false == option.bool || option.optional || option.required) {
    // when --no-* we make sure default is true
    if (false == option.bool) defaultValue = true;
    // preassign only if we have a default
    if (undefined !== defaultValue) self[name] = defaultValue;
  }

  // register the option
  this.options.push(option);

  // when it's passed assign the value
  // and conditionally invoke the callback
  this.on(oname, function(val) {
    // coercion
    if (null !== val && fn) val = fn(val, undefined === self[name]
      ? defaultValue
      : self[name]);

    // unassigned or bool
    if ('boolean' == typeof self[name] || 'undefined' == typeof self[name]) {
      // if no value, bool true, and we have a default, then use it!
      if (null == val) {
        self[name] = option.bool
          ? defaultValue || true
          : false;
      } else {
        self[name] = val;
      }
    } else if (null !== val) {
      // reassign
      self[name] = val;
    }
  });

  return this;
};

/**
 * Allow unknown options on the command line.
 *
 * @param {Boolean} arg if `true` or omitted, no error will be thrown
 * for unknown options.
 * @api public
 */
Command.prototype.allowUnknownOption = function(arg) {
    this._allowUnknownOption = arguments.length === 0 || arg;
    return this;
};

/**
 * Parse `argv`, settings options and invoking commands when defined.
 *
 * @param {Array} argv
 * @return {Command} for chaining
 * @api public
 */

Command.prototype.parse = function(argv) {
  // implicit help
  if (this.executables) this.addImplicitHelpCommand();

  // store raw args
  this.rawArgs = argv;

  // guess name
  this._name = this._name || basename(argv[1], '.js');

  // process argv
  var parsed = this.parseOptions(this.normalize(argv.slice(2)));
  var args = this.args = parsed.args;

  var result = this.parseArgs(this.args, parsed.unknown);

  // executable sub-commands
  var name = result.args[0];
  if (this._execs[name] && typeof this._execs[name] != "function") {
    return this.executeSubCommand(argv, args, parsed.unknown);
  }

  return result;
};

/**
 * Execute a sub-command executable.
 *
 * @param {Array} argv
 * @param {Array} args
 * @param {Array} unknown
 * @api private
 */

Command.prototype.executeSubCommand = function(argv, args, unknown) {
  args = args.concat(unknown);

  if (!args.length) this.help();
  if ('help' == args[0] && 1 == args.length) this.help();

  // <cmd> --help
  if ('help' == args[0]) {
    args[0] = args[1];
    args[1] = '--help';
  }

  // executable
  var dir = dirname(argv[1]);
  var bin = basename(argv[1], '.js') + '-' + args[0];

  // check for ./<bin> first
  var local = path.join(dir, bin);

  // run it
  args = args.slice(1);
  args.unshift(local);
  var proc = spawn('node', args, { stdio: 'inherit', customFds: [0, 1, 2] });
  proc.on('error', function(err) {
    if (err.code == "ENOENT") {
      console.error('\n  %s(1) does not exist, try --help\n', bin);
    } else if (err.code == "EACCES") {
      console.error('\n  %s(1) not executable. try chmod or run with root\n', bin);
    }
  });

  this.runningCommand = proc;
};

/**
 * Normalize `args`, splitting joined short flags. For example
 * the arg "-abc" is equivalent to "-a -b -c".
 * This also normalizes equal sign and splits "--abc=def" into "--abc def".
 *
 * @param {Array} args
 * @return {Array}
 * @api private
 */

Command.prototype.normalize = function(args) {
  var ret = []
    , arg
    , lastOpt
    , index;

  for (var i = 0, len = args.length; i < len; ++i) {
    arg = args[i];
    if (i > 0) {
      lastOpt = this.optionFor(args[i-1]);
    }

    if (arg === '--') {
      // Honor option terminator
      ret = ret.concat(args.slice(i));
      break;
    } else if (lastOpt && lastOpt.required) {
      ret.push(arg);
    } else if (arg.length > 1 && '-' == arg[0] && '-' != arg[1]) {
      arg.slice(1).split('').forEach(function(c) {
        ret.push('-' + c);
      });
    } else if (/^--/.test(arg) && ~(index = arg.indexOf('='))) {
      ret.push(arg.slice(0, index), arg.slice(index + 1));
    } else {
      ret.push(arg);
    }
  }

  return ret;
};

/**
 * Parse command `args`.
 *
 * When listener(s) are available those
 * callbacks are invoked, otherwise the "*"
 * event is emitted and those actions are invoked.
 *
 * @param {Array} args
 * @return {Command} for chaining
 * @api private
 */

Command.prototype.parseArgs = function(args, unknown) {
  var name;

  if (args.length) {
    name = args[0];
    if (this.listeners(name).length) {
      this.emit(args.shift(), args, unknown);
    } else {
      this.emit('*', args);
    }
  } else {
    outputHelpIfNecessary(this, unknown);

    // If there were no args and we have unknown options,
    // then they are extraneous and we need to error.
    if (unknown.length > 0) {
      this.unknownOption(unknown[0]);
    }
  }

  return this;
};

/**
 * Return an option matching `arg` if any.
 *
 * @param {String} arg
 * @return {Option}
 * @api private
 */

Command.prototype.optionFor = function(arg) {
  for (var i = 0, len = this.options.length; i < len; ++i) {
    if (this.options[i].is(arg)) {
      return this.options[i];
    }
  }
};

/**
 * Parse options from `argv` returning `argv`
 * void of these options.
 *
 * @param {Array} argv
 * @return {Array}
 * @api public
 */

Command.prototype.parseOptions = function(argv) {
  var args = []
    , len = argv.length
    , literal
    , option
    , arg;

  var unknownOptions = [];

  // parse options
  for (var i = 0; i < len; ++i) {
    arg = argv[i];

    // literal args after --
    if ('--' == arg) {
      literal = true;
      continue;
    }

    if (literal) {
      args.push(arg);
      continue;
    }

    // find matching Option
    option = this.optionFor(arg);

    // option is defined
    if (option) {
      // requires arg
      if (option.required) {
        arg = argv[++i];
        if (null == arg) return this.optionMissingArgument(option);
        this.emit(option.name(), arg);
      // optional arg
      } else if (option.optional) {
        arg = argv[i+1];
        if (null == arg || ('-' == arg[0] && '-' != arg)) {
          arg = null;
        } else {
          ++i;
        }
        this.emit(option.name(), arg);
      // bool
      } else {
        this.emit(option.name());
      }
      continue;
    }

    // looks like an option
    if (arg.length > 1 && '-' == arg[0]) {
      unknownOptions.push(arg);

      // If the next argument looks like it might be
      // an argument for this option, we pass it on.
      // If it isn't, then it'll simply be ignored
      if (argv[i+1] && '-' != argv[i+1][0]) {
        unknownOptions.push(argv[++i]);
      }
      continue;
    }

    // arg
    args.push(arg);
  }

  return { args: args, unknown: unknownOptions };
};

/**
 * Return an object containing options as key-value pairs
 *
 * @return {Object}
 * @api public
 */
Command.prototype.opts = function() {
  var result = {}
    , len = this.options.length;

  for (var i = 0 ; i < len; i++) {
    var key = this.options[i].name();
    result[key] = key === 'version' ? this._version : this[key];
  }
  return result;
};

/**
 * Argument `name` is missing.
 *
 * @param {String} name
 * @api private
 */

Command.prototype.missingArgument = function(name) {
  console.error();
  console.error("  error: missing required argument `%s'", name);
  console.error();
  process.exit(1);
};

/**
 * `Option` is missing an argument, but received `flag` or nothing.
 *
 * @param {String} option
 * @param {String} flag
 * @api private
 */

Command.prototype.optionMissingArgument = function(option, flag) {
  console.error();
  if (flag) {
    console.error("  error: option `%s' argument missing, got `%s'", option.flags, flag);
  } else {
    console.error("  error: option `%s' argument missing", option.flags);
  }
  console.error();
  process.exit(1);
};

/**
 * Unknown option `flag`.
 *
 * @param {String} flag
 * @api private
 */

Command.prototype.unknownOption = function(flag) {
  if(this._allowUnknownOption) return;
  console.error();
  console.error("  error: unknown option `%s'", flag);
  console.error();
  process.exit(1);
};

/**
 * Variadic argument with `name` is not the last argument as required.
 *
 * @param {String} name
 * @api private
 */

Command.prototype.variadicArgNotLast = function(name) {
  console.error();
  console.error("  error: variadic arguments must be last `%s'", name);
  console.error();
  process.exit(1);
};

/**
 * Set the program version to `str`.
 *
 * This method auto-registers the "-V, --version" flag
 * which will print the version number when passed.
 *
 * @param {String} str
 * @param {String} flags
 * @return {Command} for chaining
 * @api public
 */

Command.prototype.version = function(str, flags) {
  if (0 == arguments.length) return this._version;
  this._version = str;
  flags = flags || '-V, --version';
  this.option(flags, 'output the version number');
  this.on('version', function() {
    process.stdout.write(str + '\n');
    process.exit(0);
  });
  return this;
};

/**
 * Set the description to `str`.
 *
 * @param {String} str
 * @return {String|Command}
 * @api public
 */

Command.prototype.description = function(str) {
  if (0 == arguments.length) return this._description;
  this._description = str;
  return this;
};

/**
 * Set an alias for the command
 *
 * @param {String} alias
 * @return {String|Command}
 * @api public
 */

Command.prototype.alias = function(alias) {
  if (0 == arguments.length) return this._alias;
  this._alias = alias;
  return this;
};

/**
 * Set / get the command usage `str`.
 *
 * @param {String} str
 * @return {String|Command}
 * @api public
 */

Command.prototype.usage = function(str) {
  var args = this._args.map(function(arg) {
    return humanReadableArgName(arg);
  });

  var usage = '[options]'
    + (this.commands.length ? ' [command]' : '')
    + (this._args.length ? ' ' + args.join(' ') : '');

  if (0 == arguments.length) return this._usage || usage;
  this._usage = str;

  return this;
};

/**
 * Get the name of the command
 *
 * @param {String} name
 * @return {String|Command}
 * @api public
 */

Command.prototype.name = function(name) {
  return this._name;
};

/**
 * Return the largest option length.
 *
 * @return {Number}
 * @api private
 */

Command.prototype.largestOptionLength = function() {
  return this.options.reduce(function(max, option) {
    return Math.max(max, option.flags.length);
  }, 0);
};

/**
 * Return help for options.
 *
 * @return {String}
 * @api private
 */

Command.prototype.optionHelp = function() {
  var width = this.largestOptionLength();

  // Prepend the help information
  return [pad('-h, --help', width) + '  ' + 'output usage information']
    .concat(this.options.map(function(option) {
      return pad(option.flags, width) + '  ' + option.description;
      }))
    .join('\n');
};

/**
 * Return command help documentation.
 *
 * @return {String}
 * @api private
 */

Command.prototype.commandHelp = function() {
  if (!this.commands.length) return '';

  var commands = this.commands.map(function(cmd) {
    var args = cmd._args.map(function(arg) {
      return humanReadableArgName(arg);
    }).join(' ');

    return [
      cmd._name
        + (cmd._alias
          ? '|' + cmd._alias
          : '')
        + (cmd.options.length
          ? ' [options]'
          : '')
        + ' ' + args
    , cmd.description()
    ];
  });

  var width = commands.reduce(function(max, command) {
    return Math.max(max, command[0].length);
  }, 0);

  return [
      ''
    , '  Commands:'
    , ''
    , commands.map(function(cmd) {
      return pad(cmd[0], width) + '  ' + cmd[1];
    }).join('\n').replace(/^/gm, '    ')
    , ''
  ].join('\n');
};

/**
 * Return program help documentation.
 *
 * @return {String}
 * @api private
 */

Command.prototype.helpInformation = function() {
  var desc = [];
  if (this._description) {
    desc = [
      '  ' + this._description
      , ''
    ];
  }

  var cmdName = this._name;
  if(this._alias) {
    cmdName = cmdName + '|' + this._alias;
  }
  var usage = [
    ''
    ,'  Usage: ' + cmdName + ' ' + this.usage()
    , ''
  ];

  var cmds = [];
  var commandHelp = this.commandHelp();
  if (commandHelp) cmds = [commandHelp];

  var options = [
    '  Options:'
    , ''
    , '' + this.optionHelp().replace(/^/gm, '    ')
    , ''
    , ''
  ];

  return usage
    .concat(cmds)
    .concat(desc)
    .concat(options)
    .join('\n');
};

/**
 * Output help information for this command
 *
 * @api public
 */

Command.prototype.outputHelp = function() {
  process.stdout.write(this.helpInformation());
  this.emit('--help');
};

/**
 * Output help information and exit.
 *
 * @api public
 */

Command.prototype.help = function() {
  this.outputHelp();
  process.exit();
};

/**
 * Camel-case the given `flag`
 *
 * @param {String} flag
 * @return {String}
 * @api private
 */

function camelcase(flag) {
  return flag.split('-').reduce(function(str, word) {
    return str + word[0].toUpperCase() + word.slice(1);
  });
}

/**
 * Pad `str` to `width`.
 *
 * @param {String} str
 * @param {Number} width
 * @return {String}
 * @api private
 */

function pad(str, width) {
  var len = Math.max(0, width - str.length);
  return str + Array(len + 1).join(' ');
}

/**
 * Output help information if necessary
 *
 * @param {Command} command to output help for
 * @param {Array} array of options to search for -h or --help
 * @api private
 */

function outputHelpIfNecessary(cmd, options) {
  options = options || [];
  for (var i = 0; i < options.length; i++) {
    if (options[i] == '--help' || options[i] == '-h') {
      cmd.outputHelp();
      process.exit(0);
    }
  }
}

/**
 * Takes an argument an returns its human readable equivalent for help usage.
 *
 * @param {Object} arg
 * @return {String}
 * @api private
 */

function humanReadableArgName(arg) {
  var nameOutput = arg.name + (arg.variadic === true ? '...' : '');

  return arg.required
    ? '<' + nameOutput + '>'
    : '[' + nameOutput + ']'
}

}).call(this,require('_process'))
},{"_process":17,"child_process":14,"events":15,"path":16}],11:[function(require,module,exports){
/*
 * JSFace Object Oriented Programming Library
 * https://github.com/tnhu/jsface
 *
 * Copyright (c) 2009-2013 Tan Nhu
 * Licensed under MIT license (https://github.com/tnhu/jsface/blob/master/LICENSE.txt)
 */
(function(context, OBJECT, NUMBER, LENGTH, toString, undefined, oldClass, jsface) {
  /**
   * Return a map itself or null. A map is a set of { key: value }
   * @param obj object to be checked
   * @return obj itself as a map or false
   */
  function mapOrNil(obj) { return (obj && typeof obj === OBJECT && !(typeof obj.length === NUMBER && !(obj.propertyIsEnumerable(LENGTH))) && obj) || null; }

  /**
   * Return an array itself or null
   * @param obj object to be checked
   * @return obj itself as an array or null
   */
  function arrayOrNil(obj) { return (obj && typeof obj === OBJECT && typeof obj.length === NUMBER && !(obj.propertyIsEnumerable(LENGTH)) && obj) || null; }

  /**
   * Return a function itself or null
   * @param obj object to be checked
   * @return obj itself as a function or null
   */
  function functionOrNil(obj) { return (obj && typeof obj === "function" && obj) || null; }

  /**
   * Return a string itself or null
   * @param obj object to be checked
   * @return obj itself as a string or null
   */
  function stringOrNil(obj) { return (toString.apply(obj) === "[object String]" && obj) || null; }

  /**
   * Return a class itself or null
   * @param obj object to be checked
   * @return obj itself as a class or false
   */
  function classOrNil(obj) { return (functionOrNil(obj) && (obj.prototype && obj === obj.prototype.constructor) && obj) || null; }

  /**
   * Util for extend() to copy a map of { key:value } to an object
   * @param key key
   * @param value value
   * @param ignoredKeys ignored keys
   * @param object object
   * @param iClass true if object is a class
   * @param oPrototype object prototype
   */
  function copier(key, value, ignoredKeys, object, iClass, oPrototype) {
    if ( !ignoredKeys || !ignoredKeys.hasOwnProperty(key)) {
      object[key] = value;
      if (iClass) { oPrototype[key] = value; }                       // class? copy to prototype as well
    }
  }

  /**
   * Extend object from subject, ignore properties in ignoredKeys
   * @param object the child
   * @param subject the parent
   * @param ignoredKeys (optional) keys should not be copied to child
   */
  function extend(object, subject, ignoredKeys) {
    if (arrayOrNil(subject)) {
      for (var len = subject.length; --len >= 0;) { extend(object, subject[len], ignoredKeys); }
    } else {
      ignoredKeys = ignoredKeys || { constructor: 1, $super: 1, prototype: 1, $superp: 1 };

      var iClass     = classOrNil(object),
          isSubClass = classOrNil(subject),
          oPrototype = object.prototype, supez, key, proto;

      // copy static properties and prototype.* to object
      if (mapOrNil(subject)) {
        for (key in subject) {
          copier(key, subject[key], ignoredKeys, object, iClass, oPrototype);
        }
      }

      if (isSubClass) {
        proto = subject.prototype;
        for (key in proto) {
          copier(key, proto[key], ignoredKeys, object, iClass, oPrototype);
        }
      }

      // prototype properties
      if (iClass && isSubClass) { extend(oPrototype, subject.prototype, ignoredKeys); }
    }
  }

  /**
   * Create a class.
   * @param parent parent class(es)
   * @param api class api
   * @return class
   */
  function Class(parent, api) {
    if ( !api) {
      parent = (api = parent, 0);                                     // !api means there's no parent
    }

    var clazz, constructor, singleton, statics, key, bindTo, len, i = 0, p,
        ignoredKeys = { constructor: 1, $singleton: 1, $statics: 1, prototype: 1, $super: 1, $superp: 1, main: 1, toString: 0 },
        plugins     = Class.plugins;

    api         = (typeof api === "function" ? api() : api) || {};             // execute api if it's a function
    constructor = api.hasOwnProperty("constructor") ? api.constructor : 0;     // hasOwnProperty is a must, constructor is special
    singleton   = api.$singleton;
    statics     = api.$statics;

    // add plugins' keys into ignoredKeys
    for (key in plugins) { ignoredKeys[key] = 1; }

    // construct constructor
    clazz  = singleton ? {} : (constructor ? constructor : function(){});

    // determine bindTo: where api should be bound
    bindTo = singleton ? clazz : clazz.prototype;

    // make sure parent is always an array
    parent = !parent || arrayOrNil(parent) ? parent : [ parent ];

    // do inherit
    len = parent && parent.length;
    while (i < len) {
      p = parent[i++];
      for (key in p) {
        if ( !ignoredKeys[key]) {
          bindTo[key] = p[key];
          if ( !singleton) { clazz[key] = p[key]; }
        }
      }
      for (key in p.prototype) { if ( !ignoredKeys[key]) { bindTo[key] = p.prototype[key]; } }
    }

    // copy properties from api to bindTo
    for (key in api) {
      if ( !ignoredKeys[key]) {
        bindTo[key] = api[key];
      }
    }

    // copy static properties from statics to both clazz and bindTo
    for (key in statics) { clazz[key] = bindTo[key] = statics[key]; }

    // if class is not a singleton, add $super and $superp
    if ( !singleton) {
      p = parent && parent[0] || parent;
      clazz.$super  = p;
      clazz.$superp = p && p.prototype ? p.prototype : p;
      bindTo.$class = clazz;
    }

    for (key in plugins) { plugins[key](clazz, parent, api); }                 // pass control to plugins
    if (functionOrNil(api.main)) { api.main.call(clazz, clazz); }              // execute main()
    return clazz;
  }

  /* Class plugins repository */
  Class.plugins = {};

  /* Initialization */
  jsface = {
    Class        : Class,
    extend       : extend,
    mapOrNil     : mapOrNil,
    arrayOrNil   : arrayOrNil,
    functionOrNil: functionOrNil,
    stringOrNil  : stringOrNil,
    classOrNil   : classOrNil
  };

  if (typeof module !== "undefined" && module.exports) {                       // NodeJS/CommonJS
    module.exports = jsface;
  } else {
    oldClass          = context.Class;                                         // save current Class namespace
    context.Class     = Class;                                                 // bind Class and jsface to global scope
    context.jsface    = jsface;
    jsface.noConflict = function() { context.Class = oldClass; };              // no conflict
  }
})(this, "object", "number", "length", Object.prototype.toString);
},{}],12:[function(require,module,exports){
(function (global){
/**
 * @license
 * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
 * Build: `lodash modern -o ./dist/lodash.js`
 * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <http://lodash.com/license>
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre ES5 environments */
  var undefined;

  /** Used to pool arrays and objects used internally */
  var arrayPool = [],
      objectPool = [];

  /** Used to generate unique IDs */
  var idCounter = 0;

  /** Used to prefix keys to avoid issues with `__proto__` and properties on `Object.prototype` */
  var keyPrefix = +new Date + '';

  /** Used as the size when optimizations are enabled for large arrays */
  var largeArraySize = 75;

  /** Used as the max size of the `arrayPool` and `objectPool` */
  var maxPoolSize = 40;

  /** Used to detect and test whitespace */
  var whitespace = (
    // whitespace
    ' \t\x0B\f\xA0\ufeff' +

    // line terminators
    '\n\r\u2028\u2029' +

    // unicode category "Zs" space separators
    '\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000'
  );

  /** Used to match empty string literals in compiled template source */
  var reEmptyStringLeading = /\b__p \+= '';/g,
      reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
      reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

  /**
   * Used to match ES6 template delimiters
   * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-literals-string-literals
   */
  var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

  /** Used to match regexp flags from their coerced string values */
  var reFlags = /\w*$/;

  /** Used to detected named functions */
  var reFuncName = /^\s*function[ \n\r\t]+\w/;

  /** Used to match "interpolate" template delimiters */
  var reInterpolate = /<%=([\s\S]+?)%>/g;

  /** Used to match leading whitespace and zeros to be removed */
  var reLeadingSpacesAndZeros = RegExp('^[' + whitespace + ']*0+(?=.$)');

  /** Used to ensure capturing order of template delimiters */
  var reNoMatch = /($^)/;

  /** Used to detect functions containing a `this` reference */
  var reThis = /\bthis\b/;

  /** Used to match unescaped characters in compiled string literals */
  var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;

  /** Used to assign default `context` object properties */
  var contextProps = [
    'Array', 'Boolean', 'Date', 'Function', 'Math', 'Number', 'Object',
    'RegExp', 'String', '_', 'attachEvent', 'clearTimeout', 'isFinite', 'isNaN',
    'parseInt', 'setTimeout'
  ];

  /** Used to make template sourceURLs easier to identify */
  var templateCounter = 0;

  /** `Object#toString` result shortcuts */
  var argsClass = '[object Arguments]',
      arrayClass = '[object Array]',
      boolClass = '[object Boolean]',
      dateClass = '[object Date]',
      funcClass = '[object Function]',
      numberClass = '[object Number]',
      objectClass = '[object Object]',
      regexpClass = '[object RegExp]',
      stringClass = '[object String]';

  /** Used to identify object classifications that `_.clone` supports */
  var cloneableClasses = {};
  cloneableClasses[funcClass] = false;
  cloneableClasses[argsClass] = cloneableClasses[arrayClass] =
  cloneableClasses[boolClass] = cloneableClasses[dateClass] =
  cloneableClasses[numberClass] = cloneableClasses[objectClass] =
  cloneableClasses[regexpClass] = cloneableClasses[stringClass] = true;

  /** Used as an internal `_.debounce` options object */
  var debounceOptions = {
    'leading': false,
    'maxWait': 0,
    'trailing': false
  };

  /** Used as the property descriptor for `__bindData__` */
  var descriptor = {
    'configurable': false,
    'enumerable': false,
    'value': null,
    'writable': false
  };

  /** Used to determine if values are of the language type Object */
  var objectTypes = {
    'boolean': false,
    'function': true,
    'object': true,
    'number': false,
    'string': false,
    'undefined': false
  };

  /** Used to escape characters for inclusion in compiled string literals */
  var stringEscapes = {
    '\\': '\\',
    "'": "'",
    '\n': 'n',
    '\r': 'r',
    '\t': 't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  /** Used as a reference to the global object */
  var root = (objectTypes[typeof window] && window) || this;

  /** Detect free variable `exports` */
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  /** Detect free variable `module` */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports` */
  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  /** Detect free variable `global` from Node.js or Browserified code and use it as `root` */
  var freeGlobal = objectTypes[typeof global] && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal)) {
    root = freeGlobal;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * The base implementation of `_.indexOf` without support for binary searches
   * or `fromIndex` constraints.
   *
   * @private
   * @param {Array} array The array to search.
   * @param {*} value The value to search for.
   * @param {number} [fromIndex=0] The index to search from.
   * @returns {number} Returns the index of the matched value or `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    var index = (fromIndex || 0) - 1,
        length = array ? array.length : 0;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * An implementation of `_.contains` for cache objects that mimics the return
   * signature of `_.indexOf` by returning `0` if the value is found, else `-1`.
   *
   * @private
   * @param {Object} cache The cache object to inspect.
   * @param {*} value The value to search for.
   * @returns {number} Returns `0` if `value` is found, else `-1`.
   */
  function cacheIndexOf(cache, value) {
    var type = typeof value;
    cache = cache.cache;

    if (type == 'boolean' || value == null) {
      return cache[value] ? 0 : -1;
    }
    if (type != 'number' && type != 'string') {
      type = 'object';
    }
    var key = type == 'number' ? value : keyPrefix + value;
    cache = (cache = cache[type]) && cache[key];

    return type == 'object'
      ? (cache && baseIndexOf(cache, value) > -1 ? 0 : -1)
      : (cache ? 0 : -1);
  }

  /**
   * Adds a given value to the corresponding cache object.
   *
   * @private
   * @param {*} value The value to add to the cache.
   */
  function cachePush(value) {
    var cache = this.cache,
        type = typeof value;

    if (type == 'boolean' || value == null) {
      cache[value] = true;
    } else {
      if (type != 'number' && type != 'string') {
        type = 'object';
      }
      var key = type == 'number' ? value : keyPrefix + value,
          typeCache = cache[type] || (cache[type] = {});

      if (type == 'object') {
        (typeCache[key] || (typeCache[key] = [])).push(value);
      } else {
        typeCache[key] = true;
      }
    }
  }

  /**
   * Used by `_.max` and `_.min` as the default callback when a given
   * collection is a string value.
   *
   * @private
   * @param {string} value The character to inspect.
   * @returns {number} Returns the code unit of given character.
   */
  function charAtCallback(value) {
    return value.charCodeAt(0);
  }

  /**
   * Used by `sortBy` to compare transformed `collection` elements, stable sorting
   * them in ascending order.
   *
   * @private
   * @param {Object} a The object to compare to `b`.
   * @param {Object} b The object to compare to `a`.
   * @returns {number} Returns the sort order indicator of `1` or `-1`.
   */
  function compareAscending(a, b) {
    var ac = a.criteria,
        bc = b.criteria,
        index = -1,
        length = ac.length;

    while (++index < length) {
      var value = ac[index],
          other = bc[index];

      if (value !== other) {
        if (value > other || typeof value == 'undefined') {
          return 1;
        }
        if (value < other || typeof other == 'undefined') {
          return -1;
        }
      }
    }
    // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
    // that causes it, under certain circumstances, to return the same value for
    // `a` and `b`. See https://github.com/jashkenas/underscore/pull/1247
    //
    // This also ensures a stable sort in V8 and other engines.
    // See http://code.google.com/p/v8/issues/detail?id=90
    return a.index - b.index;
  }

  /**
   * Creates a cache object to optimize linear searches of large arrays.
   *
   * @private
   * @param {Array} [array=[]] The array to search.
   * @returns {null|Object} Returns the cache object or `null` if caching should not be used.
   */
  function createCache(array) {
    var index = -1,
        length = array.length,
        first = array[0],
        mid = array[(length / 2) | 0],
        last = array[length - 1];

    if (first && typeof first == 'object' &&
        mid && typeof mid == 'object' && last && typeof last == 'object') {
      return false;
    }
    var cache = getObject();
    cache['false'] = cache['null'] = cache['true'] = cache['undefined'] = false;

    var result = getObject();
    result.array = array;
    result.cache = cache;
    result.push = cachePush;

    while (++index < length) {
      result.push(array[index]);
    }
    return result;
  }

  /**
   * Used by `template` to escape characters for inclusion in compiled
   * string literals.
   *
   * @private
   * @param {string} match The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeStringChar(match) {
    return '\\' + stringEscapes[match];
  }

  /**
   * Gets an array from the array pool or creates a new one if the pool is empty.
   *
   * @private
   * @returns {Array} The array from the pool.
   */
  function getArray() {
    return arrayPool.pop() || [];
  }

  /**
   * Gets an object from the object pool or creates a new one if the pool is empty.
   *
   * @private
   * @returns {Object} The object from the pool.
   */
  function getObject() {
    return objectPool.pop() || {
      'array': null,
      'cache': null,
      'criteria': null,
      'false': false,
      'index': 0,
      'null': false,
      'number': null,
      'object': null,
      'push': null,
      'string': null,
      'true': false,
      'undefined': false,
      'value': null
    };
  }

  /**
   * Releases the given array back to the array pool.
   *
   * @private
   * @param {Array} [array] The array to release.
   */
  function releaseArray(array) {
    array.length = 0;
    if (arrayPool.length < maxPoolSize) {
      arrayPool.push(array);
    }
  }

  /**
   * Releases the given object back to the object pool.
   *
   * @private
   * @param {Object} [object] The object to release.
   */
  function releaseObject(object) {
    var cache = object.cache;
    if (cache) {
      releaseObject(cache);
    }
    object.array = object.cache = object.criteria = object.object = object.number = object.string = object.value = null;
    if (objectPool.length < maxPoolSize) {
      objectPool.push(object);
    }
  }

  /**
   * Slices the `collection` from the `start` index up to, but not including,
   * the `end` index.
   *
   * Note: This function is used instead of `Array#slice` to support node lists
   * in IE < 9 and to ensure dense arrays are returned.
   *
   * @private
   * @param {Array|Object|string} collection The collection to slice.
   * @param {number} start The start index.
   * @param {number} end The end index.
   * @returns {Array} Returns the new array.
   */
  function slice(array, start, end) {
    start || (start = 0);
    if (typeof end == 'undefined') {
      end = array ? array.length : 0;
    }
    var index = -1,
        length = end - start || 0,
        result = Array(length < 0 ? 0 : length);

    while (++index < length) {
      result[index] = array[start + index];
    }
    return result;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Create a new `lodash` function using the given context object.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {Object} [context=root] The context object.
   * @returns {Function} Returns the `lodash` function.
   */
  function runInContext(context) {
    // Avoid issues with some ES3 environments that attempt to use values, named
    // after built-in constructors like `Object`, for the creation of literals.
    // ES5 clears this up by stating that literals must use built-in constructors.
    // See http://es5.github.io/#x11.1.5.
    context = context ? _.defaults(root.Object(), context, _.pick(root, contextProps)) : root;

    /** Native constructor references */
    var Array = context.Array,
        Boolean = context.Boolean,
        Date = context.Date,
        Function = context.Function,
        Math = context.Math,
        Number = context.Number,
        Object = context.Object,
        RegExp = context.RegExp,
        String = context.String,
        TypeError = context.TypeError;

    /**
     * Used for `Array` method references.
     *
     * Normally `Array.prototype` would suffice, however, using an array literal
     * avoids issues in Narwhal.
     */
    var arrayRef = [];

    /** Used for native method references */
    var objectProto = Object.prototype;

    /** Used to restore the original `_` reference in `noConflict` */
    var oldDash = context._;

    /** Used to resolve the internal [[Class]] of values */
    var toString = objectProto.toString;

    /** Used to detect if a method is native */
    var reNative = RegExp('^' +
      String(toString)
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/toString| for [^\]]+/g, '.*?') + '$'
    );

    /** Native method shortcuts */
    var ceil = Math.ceil,
        clearTimeout = context.clearTimeout,
        floor = Math.floor,
        fnToString = Function.prototype.toString,
        getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf,
        hasOwnProperty = objectProto.hasOwnProperty,
        push = arrayRef.push,
        setTimeout = context.setTimeout,
        splice = arrayRef.splice,
        unshift = arrayRef.unshift;

    /** Used to set meta data on functions */
    var defineProperty = (function() {
      // IE 8 only accepts DOM elements
      try {
        var o = {},
            func = isNative(func = Object.defineProperty) && func,
            result = func(o, o, o) && func;
      } catch(e) { }
      return result;
    }());

    /* Native method shortcuts for methods with the same name as other `lodash` methods */
    var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate,
        nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray,
        nativeIsFinite = context.isFinite,
        nativeIsNaN = context.isNaN,
        nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys,
        nativeMax = Math.max,
        nativeMin = Math.min,
        nativeParseInt = context.parseInt,
        nativeRandom = Math.random;

    /** Used to lookup a built-in constructor by [[Class]] */
    var ctorByClass = {};
    ctorByClass[arrayClass] = Array;
    ctorByClass[boolClass] = Boolean;
    ctorByClass[dateClass] = Date;
    ctorByClass[funcClass] = Function;
    ctorByClass[objectClass] = Object;
    ctorByClass[numberClass] = Number;
    ctorByClass[regexpClass] = RegExp;
    ctorByClass[stringClass] = String;

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object which wraps the given value to enable intuitive
     * method chaining.
     *
     * In addition to Lo-Dash methods, wrappers also have the following `Array` methods:
     * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`, `splice`,
     * and `unshift`
     *
     * Chaining is supported in custom builds as long as the `value` method is
     * implicitly or explicitly included in the build.
     *
     * The chainable wrapper functions are:
     * `after`, `assign`, `bind`, `bindAll`, `bindKey`, `chain`, `compact`,
     * `compose`, `concat`, `countBy`, `create`, `createCallback`, `curry`,
     * `debounce`, `defaults`, `defer`, `delay`, `difference`, `filter`, `flatten`,
     * `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`,
     * `functions`, `groupBy`, `indexBy`, `initial`, `intersection`, `invert`,
     * `invoke`, `keys`, `map`, `max`, `memoize`, `merge`, `min`, `object`, `omit`,
     * `once`, `pairs`, `partial`, `partialRight`, `pick`, `pluck`, `pull`, `push`,
     * `range`, `reject`, `remove`, `rest`, `reverse`, `shuffle`, `slice`, `sort`,
     * `sortBy`, `splice`, `tap`, `throttle`, `times`, `toArray`, `transform`,
     * `union`, `uniq`, `unshift`, `unzip`, `values`, `where`, `without`, `wrap`,
     * and `zip`
     *
     * The non-chainable wrapper functions are:
     * `clone`, `cloneDeep`, `contains`, `escape`, `every`, `find`, `findIndex`,
     * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `has`, `identity`,
     * `indexOf`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`,
     * `isEmpty`, `isEqual`, `isFinite`, `isFunction`, `isNaN`, `isNull`, `isNumber`,
     * `isObject`, `isPlainObject`, `isRegExp`, `isString`, `isUndefined`, `join`,
     * `lastIndexOf`, `mixin`, `noConflict`, `parseInt`, `pop`, `random`, `reduce`,
     * `reduceRight`, `result`, `shift`, `size`, `some`, `sortedIndex`, `runInContext`,
     * `template`, `unescape`, `uniqueId`, and `value`
     *
     * The wrapper functions `first` and `last` return wrapped values when `n` is
     * provided, otherwise they return unwrapped values.
     *
     * Explicit chaining can be enabled by using the `_.chain` method.
     *
     * @name _
     * @constructor
     * @category Chaining
     * @param {*} value The value to wrap in a `lodash` instance.
     * @returns {Object} Returns a `lodash` instance.
     * @example
     *
     * var wrapped = _([1, 2, 3]);
     *
     * // returns an unwrapped value
     * wrapped.reduce(function(sum, num) {
     *   return sum + num;
     * });
     * // => 6
     *
     * // returns a wrapped value
     * var squares = wrapped.map(function(num) {
     *   return num * num;
     * });
     *
     * _.isArray(squares);
     * // => false
     *
     * _.isArray(squares.value());
     * // => true
     */
    function lodash(value) {
      // don't wrap if already wrapped, even if wrapped by a different `lodash` constructor
      return (value && typeof value == 'object' && !isArray(value) && hasOwnProperty.call(value, '__wrapped__'))
       ? value
       : new lodashWrapper(value);
    }

    /**
     * A fast path for creating `lodash` wrapper objects.
     *
     * @private
     * @param {*} value The value to wrap in a `lodash` instance.
     * @param {boolean} chainAll A flag to enable chaining for all methods
     * @returns {Object} Returns a `lodash` instance.
     */
    function lodashWrapper(value, chainAll) {
      this.__chain__ = !!chainAll;
      this.__wrapped__ = value;
    }
    // ensure `new lodashWrapper` is an instance of `lodash`
    lodashWrapper.prototype = lodash.prototype;

    /**
     * An object used to flag environments features.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    var support = lodash.support = {};

    /**
     * Detect if functions can be decompiled by `Function#toString`
     * (all but PS3 and older Opera mobile browsers & avoided in Windows 8 apps).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.funcDecomp = !isNative(context.WinRTError) && reThis.test(runInContext);

    /**
     * Detect if `Function#name` is supported (all but IE).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.funcNames = typeof Function.name == 'string';

    /**
     * By default, the template delimiters used by Lo-Dash are similar to those in
     * embedded Ruby (ERB). Change the following template settings to use alternative
     * delimiters.
     *
     * @static
     * @memberOf _
     * @type Object
     */
    lodash.templateSettings = {

      /**
       * Used to detect `data` property values to be HTML-escaped.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'escape': /<%-([\s\S]+?)%>/g,

      /**
       * Used to detect code to be evaluated.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'evaluate': /<%([\s\S]+?)%>/g,

      /**
       * Used to detect `data` property values to inject.
       *
       * @memberOf _.templateSettings
       * @type RegExp
       */
      'interpolate': reInterpolate,

      /**
       * Used to reference the data object in the template text.
       *
       * @memberOf _.templateSettings
       * @type string
       */
      'variable': '',

      /**
       * Used to import variables into the compiled template.
       *
       * @memberOf _.templateSettings
       * @type Object
       */
      'imports': {

        /**
         * A reference to the `lodash` function.
         *
         * @memberOf _.templateSettings.imports
         * @type Function
         */
        '_': lodash
      }
    };

    /*--------------------------------------------------------------------------*/

    /**
     * The base implementation of `_.bind` that creates the bound function and
     * sets its meta data.
     *
     * @private
     * @param {Array} bindData The bind data array.
     * @returns {Function} Returns the new bound function.
     */
    function baseBind(bindData) {
      var func = bindData[0],
          partialArgs = bindData[2],
          thisArg = bindData[4];

      function bound() {
        // `Function#bind` spec
        // http://es5.github.io/#x15.3.4.5
        if (partialArgs) {
          // avoid `arguments` object deoptimizations by using `slice` instead
          // of `Array.prototype.slice.call` and not assigning `arguments` to a
          // variable as a ternary expression
          var args = slice(partialArgs);
          push.apply(args, arguments);
        }
        // mimic the constructor's `return` behavior
        // http://es5.github.io/#x13.2.2
        if (this instanceof bound) {
          // ensure `new bound` is an instance of `func`
          var thisBinding = baseCreate(func.prototype),
              result = func.apply(thisBinding, args || arguments);
          return isObject(result) ? result : thisBinding;
        }
        return func.apply(thisArg, args || arguments);
      }
      setBindData(bound, bindData);
      return bound;
    }

    /**
     * The base implementation of `_.clone` without argument juggling or support
     * for `thisArg` binding.
     *
     * @private
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep=false] Specify a deep clone.
     * @param {Function} [callback] The function to customize cloning values.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates clones with source counterparts.
     * @returns {*} Returns the cloned value.
     */
    function baseClone(value, isDeep, callback, stackA, stackB) {
      if (callback) {
        var result = callback(value);
        if (typeof result != 'undefined') {
          return result;
        }
      }
      // inspect [[Class]]
      var isObj = isObject(value);
      if (isObj) {
        var className = toString.call(value);
        if (!cloneableClasses[className]) {
          return value;
        }
        var ctor = ctorByClass[className];
        switch (className) {
          case boolClass:
          case dateClass:
            return new ctor(+value);

          case numberClass:
          case stringClass:
            return new ctor(value);

          case regexpClass:
            result = ctor(value.source, reFlags.exec(value));
            result.lastIndex = value.lastIndex;
            return result;
        }
      } else {
        return value;
      }
      var isArr = isArray(value);
      if (isDeep) {
        // check for circular references and return corresponding clone
        var initedStack = !stackA;
        stackA || (stackA = getArray());
        stackB || (stackB = getArray());

        var length = stackA.length;
        while (length--) {
          if (stackA[length] == value) {
            return stackB[length];
          }
        }
        result = isArr ? ctor(value.length) : {};
      }
      else {
        result = isArr ? slice(value) : assign({}, value);
      }
      // add array properties assigned by `RegExp#exec`
      if (isArr) {
        if (hasOwnProperty.call(value, 'index')) {
          result.index = value.index;
        }
        if (hasOwnProperty.call(value, 'input')) {
          result.input = value.input;
        }
      }
      // exit for shallow clone
      if (!isDeep) {
        return result;
      }
      // add the source value to the stack of traversed objects
      // and associate it with its clone
      stackA.push(value);
      stackB.push(result);

      // recursively populate clone (susceptible to call stack limits)
      (isArr ? forEach : forOwn)(value, function(objValue, key) {
        result[key] = baseClone(objValue, isDeep, callback, stackA, stackB);
      });

      if (initedStack) {
        releaseArray(stackA);
        releaseArray(stackB);
      }
      return result;
    }

    /**
     * The base implementation of `_.create` without support for assigning
     * properties to the created object.
     *
     * @private
     * @param {Object} prototype The object to inherit from.
     * @returns {Object} Returns the new object.
     */
    function baseCreate(prototype, properties) {
      return isObject(prototype) ? nativeCreate(prototype) : {};
    }
    // fallback for browsers without `Object.create`
    if (!nativeCreate) {
      baseCreate = (function() {
        function Object() {}
        return function(prototype) {
          if (isObject(prototype)) {
            Object.prototype = prototype;
            var result = new Object;
            Object.prototype = null;
          }
          return result || context.Object();
        };
      }());
    }

    /**
     * The base implementation of `_.createCallback` without support for creating
     * "_.pluck" or "_.where" style callbacks.
     *
     * @private
     * @param {*} [func=identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of the created callback.
     * @param {number} [argCount] The number of arguments the callback accepts.
     * @returns {Function} Returns a callback function.
     */
    function baseCreateCallback(func, thisArg, argCount) {
      if (typeof func != 'function') {
        return identity;
      }
      // exit early for no `thisArg` or already bound by `Function#bind`
      if (typeof thisArg == 'undefined' || !('prototype' in func)) {
        return func;
      }
      var bindData = func.__bindData__;
      if (typeof bindData == 'undefined') {
        if (support.funcNames) {
          bindData = !func.name;
        }
        bindData = bindData || !support.funcDecomp;
        if (!bindData) {
          var source = fnToString.call(func);
          if (!support.funcNames) {
            bindData = !reFuncName.test(source);
          }
          if (!bindData) {
            // checks if `func` references the `this` keyword and stores the result
            bindData = reThis.test(source);
            setBindData(func, bindData);
          }
        }
      }
      // exit early if there are no `this` references or `func` is bound
      if (bindData === false || (bindData !== true && bindData[1] & 1)) {
        return func;
      }
      switch (argCount) {
        case 1: return function(value) {
          return func.call(thisArg, value);
        };
        case 2: return function(a, b) {
          return func.call(thisArg, a, b);
        };
        case 3: return function(value, index, collection) {
          return func.call(thisArg, value, index, collection);
        };
        case 4: return function(accumulator, value, index, collection) {
          return func.call(thisArg, accumulator, value, index, collection);
        };
      }
      return bind(func, thisArg);
    }

    /**
     * The base implementation of `createWrapper` that creates the wrapper and
     * sets its meta data.
     *
     * @private
     * @param {Array} bindData The bind data array.
     * @returns {Function} Returns the new function.
     */
    function baseCreateWrapper(bindData) {
      var func = bindData[0],
          bitmask = bindData[1],
          partialArgs = bindData[2],
          partialRightArgs = bindData[3],
          thisArg = bindData[4],
          arity = bindData[5];

      var isBind = bitmask & 1,
          isBindKey = bitmask & 2,
          isCurry = bitmask & 4,
          isCurryBound = bitmask & 8,
          key = func;

      function bound() {
        var thisBinding = isBind ? thisArg : this;
        if (partialArgs) {
          var args = slice(partialArgs);
          push.apply(args, arguments);
        }
        if (partialRightArgs || isCurry) {
          args || (args = slice(arguments));
          if (partialRightArgs) {
            push.apply(args, partialRightArgs);
          }
          if (isCurry && args.length < arity) {
            bitmask |= 16 & ~32;
            return baseCreateWrapper([func, (isCurryBound ? bitmask : bitmask & ~3), args, null, thisArg, arity]);
          }
        }
        args || (args = arguments);
        if (isBindKey) {
          func = thisBinding[key];
        }
        if (this instanceof bound) {
          thisBinding = baseCreate(func.prototype);
          var result = func.apply(thisBinding, args);
          return isObject(result) ? result : thisBinding;
        }
        return func.apply(thisBinding, args);
      }
      setBindData(bound, bindData);
      return bound;
    }

    /**
     * The base implementation of `_.difference` that accepts a single array
     * of values to exclude.
     *
     * @private
     * @param {Array} array The array to process.
     * @param {Array} [values] The array of values to exclude.
     * @returns {Array} Returns a new array of filtered values.
     */
    function baseDifference(array, values) {
      var index = -1,
          indexOf = getIndexOf(),
          length = array ? array.length : 0,
          isLarge = length >= largeArraySize && indexOf === baseIndexOf,
          result = [];

      if (isLarge) {
        var cache = createCache(values);
        if (cache) {
          indexOf = cacheIndexOf;
          values = cache;
        } else {
          isLarge = false;
        }
      }
      while (++index < length) {
        var value = array[index];
        if (indexOf(values, value) < 0) {
          result.push(value);
        }
      }
      if (isLarge) {
        releaseObject(values);
      }
      return result;
    }

    /**
     * The base implementation of `_.flatten` without support for callback
     * shorthands or `thisArg` binding.
     *
     * @private
     * @param {Array} array The array to flatten.
     * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
     * @param {boolean} [isStrict=false] A flag to restrict flattening to arrays and `arguments` objects.
     * @param {number} [fromIndex=0] The index to start from.
     * @returns {Array} Returns a new flattened array.
     */
    function baseFlatten(array, isShallow, isStrict, fromIndex) {
      var index = (fromIndex || 0) - 1,
          length = array ? array.length : 0,
          result = [];

      while (++index < length) {
        var value = array[index];

        if (value && typeof value == 'object' && typeof value.length == 'number'
            && (isArray(value) || isArguments(value))) {
          // recursively flatten arrays (susceptible to call stack limits)
          if (!isShallow) {
            value = baseFlatten(value, isShallow, isStrict);
          }
          var valIndex = -1,
              valLength = value.length,
              resIndex = result.length;

          result.length += valLength;
          while (++valIndex < valLength) {
            result[resIndex++] = value[valIndex];
          }
        } else if (!isStrict) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * The base implementation of `_.isEqual`, without support for `thisArg` binding,
     * that allows partial "_.where" style comparisons.
     *
     * @private
     * @param {*} a The value to compare.
     * @param {*} b The other value to compare.
     * @param {Function} [callback] The function to customize comparing values.
     * @param {Function} [isWhere=false] A flag to indicate performing partial comparisons.
     * @param {Array} [stackA=[]] Tracks traversed `a` objects.
     * @param {Array} [stackB=[]] Tracks traversed `b` objects.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     */
    function baseIsEqual(a, b, callback, isWhere, stackA, stackB) {
      // used to indicate that when comparing objects, `a` has at least the properties of `b`
      if (callback) {
        var result = callback(a, b);
        if (typeof result != 'undefined') {
          return !!result;
        }
      }
      // exit early for identical values
      if (a === b) {
        // treat `+0` vs. `-0` as not equal
        return a !== 0 || (1 / a == 1 / b);
      }
      var type = typeof a,
          otherType = typeof b;

      // exit early for unlike primitive values
      if (a === a &&
          !(a && objectTypes[type]) &&
          !(b && objectTypes[otherType])) {
        return false;
      }
      // exit early for `null` and `undefined` avoiding ES3's Function#call behavior
      // http://es5.github.io/#x15.3.4.4
      if (a == null || b == null) {
        return a === b;
      }
      // compare [[Class]] names
      var className = toString.call(a),
          otherClass = toString.call(b);

      if (className == argsClass) {
        className = objectClass;
      }
      if (otherClass == argsClass) {
        otherClass = objectClass;
      }
      if (className != otherClass) {
        return false;
      }
      switch (className) {
        case boolClass:
        case dateClass:
          // coerce dates and booleans to numbers, dates to milliseconds and booleans
          // to `1` or `0` treating invalid dates coerced to `NaN` as not equal
          return +a == +b;

        case numberClass:
          // treat `NaN` vs. `NaN` as equal
          return (a != +a)
            ? b != +b
            // but treat `+0` vs. `-0` as not equal
            : (a == 0 ? (1 / a == 1 / b) : a == +b);

        case regexpClass:
        case stringClass:
          // coerce regexes to strings (http://es5.github.io/#x15.10.6.4)
          // treat string primitives and their corresponding object instances as equal
          return a == String(b);
      }
      var isArr = className == arrayClass;
      if (!isArr) {
        // unwrap any `lodash` wrapped values
        var aWrapped = hasOwnProperty.call(a, '__wrapped__'),
            bWrapped = hasOwnProperty.call(b, '__wrapped__');

        if (aWrapped || bWrapped) {
          return baseIsEqual(aWrapped ? a.__wrapped__ : a, bWrapped ? b.__wrapped__ : b, callback, isWhere, stackA, stackB);
        }
        // exit for functions and DOM nodes
        if (className != objectClass) {
          return false;
        }
        // in older versions of Opera, `arguments` objects have `Array` constructors
        var ctorA = a.constructor,
            ctorB = b.constructor;

        // non `Object` object instances with different constructors are not equal
        if (ctorA != ctorB &&
              !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) &&
              ('constructor' in a && 'constructor' in b)
            ) {
          return false;
        }
      }
      // assume cyclic structures are equal
      // the algorithm for detecting cyclic structures is adapted from ES 5.1
      // section 15.12.3, abstract operation `JO` (http://es5.github.io/#x15.12.3)
      var initedStack = !stackA;
      stackA || (stackA = getArray());
      stackB || (stackB = getArray());

      var length = stackA.length;
      while (length--) {
        if (stackA[length] == a) {
          return stackB[length] == b;
        }
      }
      var size = 0;
      result = true;

      // add `a` and `b` to the stack of traversed objects
      stackA.push(a);
      stackB.push(b);

      // recursively compare objects and arrays (susceptible to call stack limits)
      if (isArr) {
        // compare lengths to determine if a deep comparison is necessary
        length = a.length;
        size = b.length;
        result = size == length;

        if (result || isWhere) {
          // deep compare the contents, ignoring non-numeric properties
          while (size--) {
            var index = length,
                value = b[size];

            if (isWhere) {
              while (index--) {
                if ((result = baseIsEqual(a[index], value, callback, isWhere, stackA, stackB))) {
                  break;
                }
              }
            } else if (!(result = baseIsEqual(a[size], value, callback, isWhere, stackA, stackB))) {
              break;
            }
          }
        }
      }
      else {
        // deep compare objects using `forIn`, instead of `forOwn`, to avoid `Object.keys`
        // which, in this case, is more costly
        forIn(b, function(value, key, b) {
          if (hasOwnProperty.call(b, key)) {
            // count the number of properties.
            size++;
            // deep compare each property value.
            return (result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, callback, isWhere, stackA, stackB));
          }
        });

        if (result && !isWhere) {
          // ensure both objects have the same number of properties
          forIn(a, function(value, key, a) {
            if (hasOwnProperty.call(a, key)) {
              // `size` will be `-1` if `a` has more properties than `b`
              return (result = --size > -1);
            }
          });
        }
      }
      stackA.pop();
      stackB.pop();

      if (initedStack) {
        releaseArray(stackA);
        releaseArray(stackB);
      }
      return result;
    }

    /**
     * The base implementation of `_.merge` without argument juggling or support
     * for `thisArg` binding.
     *
     * @private
     * @param {Object} object The destination object.
     * @param {Object} source The source object.
     * @param {Function} [callback] The function to customize merging properties.
     * @param {Array} [stackA=[]] Tracks traversed source objects.
     * @param {Array} [stackB=[]] Associates values with source counterparts.
     */
    function baseMerge(object, source, callback, stackA, stackB) {
      (isArray(source) ? forEach : forOwn)(source, function(source, key) {
        var found,
            isArr,
            result = source,
            value = object[key];

        if (source && ((isArr = isArray(source)) || isPlainObject(source))) {
          // avoid merging previously merged cyclic sources
          var stackLength = stackA.length;
          while (stackLength--) {
            if ((found = stackA[stackLength] == source)) {
              value = stackB[stackLength];
              break;
            }
          }
          if (!found) {
            var isShallow;
            if (callback) {
              result = callback(value, source);
              if ((isShallow = typeof result != 'undefined')) {
                value = result;
              }
            }
            if (!isShallow) {
              value = isArr
                ? (isArray(value) ? value : [])
                : (isPlainObject(value) ? value : {});
            }
            // add `source` and associated `value` to the stack of traversed objects
            stackA.push(source);
            stackB.push(value);

            // recursively merge objects and arrays (susceptible to call stack limits)
            if (!isShallow) {
              baseMerge(value, source, callback, stackA, stackB);
            }
          }
        }
        else {
          if (callback) {
            result = callback(value, source);
            if (typeof result == 'undefined') {
              result = source;
            }
          }
          if (typeof result != 'undefined') {
            value = result;
          }
        }
        object[key] = value;
      });
    }

    /**
     * The base implementation of `_.random` without argument juggling or support
     * for returning floating-point numbers.
     *
     * @private
     * @param {number} min The minimum possible value.
     * @param {number} max The maximum possible value.
     * @returns {number} Returns a random number.
     */
    function baseRandom(min, max) {
      return min + floor(nativeRandom() * (max - min + 1));
    }

    /**
     * The base implementation of `_.uniq` without support for callback shorthands
     * or `thisArg` binding.
     *
     * @private
     * @param {Array} array The array to process.
     * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
     * @param {Function} [callback] The function called per iteration.
     * @returns {Array} Returns a duplicate-value-free array.
     */
    function baseUniq(array, isSorted, callback) {
      var index = -1,
          indexOf = getIndexOf(),
          length = array ? array.length : 0,
          result = [];

      var isLarge = !isSorted && length >= largeArraySize && indexOf === baseIndexOf,
          seen = (callback || isLarge) ? getArray() : result;

      if (isLarge) {
        var cache = createCache(seen);
        indexOf = cacheIndexOf;
        seen = cache;
      }
      while (++index < length) {
        var value = array[index],
            computed = callback ? callback(value, index, array) : value;

        if (isSorted
              ? !index || seen[seen.length - 1] !== computed
              : indexOf(seen, computed) < 0
            ) {
          if (callback || isLarge) {
            seen.push(computed);
          }
          result.push(value);
        }
      }
      if (isLarge) {
        releaseArray(seen.array);
        releaseObject(seen);
      } else if (callback) {
        releaseArray(seen);
      }
      return result;
    }

    /**
     * Creates a function that aggregates a collection, creating an object composed
     * of keys generated from the results of running each element of the collection
     * through a callback. The given `setter` function sets the keys and values
     * of the composed object.
     *
     * @private
     * @param {Function} setter The setter function.
     * @returns {Function} Returns the new aggregator function.
     */
    function createAggregator(setter) {
      return function(collection, callback, thisArg) {
        var result = {};
        callback = lodash.createCallback(callback, thisArg, 3);

        var index = -1,
            length = collection ? collection.length : 0;

        if (typeof length == 'number') {
          while (++index < length) {
            var value = collection[index];
            setter(result, value, callback(value, index, collection), collection);
          }
        } else {
          forOwn(collection, function(value, key, collection) {
            setter(result, value, callback(value, key, collection), collection);
          });
        }
        return result;
      };
    }

    /**
     * Creates a function that, when called, either curries or invokes `func`
     * with an optional `this` binding and partially applied arguments.
     *
     * @private
     * @param {Function|string} func The function or method name to reference.
     * @param {number} bitmask The bitmask of method flags to compose.
     *  The bitmask may be composed of the following flags:
     *  1 - `_.bind`
     *  2 - `_.bindKey`
     *  4 - `_.curry`
     *  8 - `_.curry` (bound)
     *  16 - `_.partial`
     *  32 - `_.partialRight`
     * @param {Array} [partialArgs] An array of arguments to prepend to those
     *  provided to the new function.
     * @param {Array} [partialRightArgs] An array of arguments to append to those
     *  provided to the new function.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {number} [arity] The arity of `func`.
     * @returns {Function} Returns the new function.
     */
    function createWrapper(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
      var isBind = bitmask & 1,
          isBindKey = bitmask & 2,
          isCurry = bitmask & 4,
          isCurryBound = bitmask & 8,
          isPartial = bitmask & 16,
          isPartialRight = bitmask & 32;

      if (!isBindKey && !isFunction(func)) {
        throw new TypeError;
      }
      if (isPartial && !partialArgs.length) {
        bitmask &= ~16;
        isPartial = partialArgs = false;
      }
      if (isPartialRight && !partialRightArgs.length) {
        bitmask &= ~32;
        isPartialRight = partialRightArgs = false;
      }
      var bindData = func && func.__bindData__;
      if (bindData && bindData !== true) {
        // clone `bindData`
        bindData = slice(bindData);
        if (bindData[2]) {
          bindData[2] = slice(bindData[2]);
        }
        if (bindData[3]) {
          bindData[3] = slice(bindData[3]);
        }
        // set `thisBinding` is not previously bound
        if (isBind && !(bindData[1] & 1)) {
          bindData[4] = thisArg;
        }
        // set if previously bound but not currently (subsequent curried functions)
        if (!isBind && bindData[1] & 1) {
          bitmask |= 8;
        }
        // set curried arity if not yet set
        if (isCurry && !(bindData[1] & 4)) {
          bindData[5] = arity;
        }
        // append partial left arguments
        if (isPartial) {
          push.apply(bindData[2] || (bindData[2] = []), partialArgs);
        }
        // append partial right arguments
        if (isPartialRight) {
          unshift.apply(bindData[3] || (bindData[3] = []), partialRightArgs);
        }
        // merge flags
        bindData[1] |= bitmask;
        return createWrapper.apply(null, bindData);
      }
      // fast path for `_.bind`
      var creater = (bitmask == 1 || bitmask === 17) ? baseBind : baseCreateWrapper;
      return creater([func, bitmask, partialArgs, partialRightArgs, thisArg, arity]);
    }

    /**
     * Used by `escape` to convert characters to HTML entities.
     *
     * @private
     * @param {string} match The matched character to escape.
     * @returns {string} Returns the escaped character.
     */
    function escapeHtmlChar(match) {
      return htmlEscapes[match];
    }

    /**
     * Gets the appropriate "indexOf" function. If the `_.indexOf` method is
     * customized, this method returns the custom method, otherwise it returns
     * the `baseIndexOf` function.
     *
     * @private
     * @returns {Function} Returns the "indexOf" function.
     */
    function getIndexOf() {
      var result = (result = lodash.indexOf) === indexOf ? baseIndexOf : result;
      return result;
    }

    /**
     * Checks if `value` is a native function.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a native function, else `false`.
     */
    function isNative(value) {
      return typeof value == 'function' && reNative.test(value);
    }

    /**
     * Sets `this` binding data on a given function.
     *
     * @private
     * @param {Function} func The function to set data on.
     * @param {Array} value The data array to set.
     */
    var setBindData = !defineProperty ? noop : function(func, value) {
      descriptor.value = value;
      defineProperty(func, '__bindData__', descriptor);
    };

    /**
     * A fallback implementation of `isPlainObject` which checks if a given value
     * is an object created by the `Object` constructor, assuming objects created
     * by the `Object` constructor have no inherited enumerable properties and that
     * there are no `Object.prototype` extensions.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     */
    function shimIsPlainObject(value) {
      var ctor,
          result;

      // avoid non Object objects, `arguments` objects, and DOM elements
      if (!(value && toString.call(value) == objectClass) ||
          (ctor = value.constructor, isFunction(ctor) && !(ctor instanceof ctor))) {
        return false;
      }
      // In most environments an object's own properties are iterated before
      // its inherited properties. If the last iterated property is an object's
      // own property then there are no inherited enumerable properties.
      forIn(value, function(value, key) {
        result = key;
      });
      return typeof result == 'undefined' || hasOwnProperty.call(value, result);
    }

    /**
     * Used by `unescape` to convert HTML entities to characters.
     *
     * @private
     * @param {string} match The matched character to unescape.
     * @returns {string} Returns the unescaped character.
     */
    function unescapeHtmlChar(match) {
      return htmlUnescapes[match];
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Checks if `value` is an `arguments` object.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is an `arguments` object, else `false`.
     * @example
     *
     * (function() { return _.isArguments(arguments); })(1, 2, 3);
     * // => true
     *
     * _.isArguments([1, 2, 3]);
     * // => false
     */
    function isArguments(value) {
      return value && typeof value == 'object' && typeof value.length == 'number' &&
        toString.call(value) == argsClass || false;
    }

    /**
     * Checks if `value` is an array.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is an array, else `false`.
     * @example
     *
     * (function() { return _.isArray(arguments); })();
     * // => false
     *
     * _.isArray([1, 2, 3]);
     * // => true
     */
    var isArray = nativeIsArray || function(value) {
      return value && typeof value == 'object' && typeof value.length == 'number' &&
        toString.call(value) == arrayClass || false;
    };

    /**
     * A fallback implementation of `Object.keys` which produces an array of the
     * given object's own enumerable property names.
     *
     * @private
     * @type Function
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns an array of property names.
     */
    var shimKeys = function(object) {
      var index, iterable = object, result = [];
      if (!iterable) return result;
      if (!(objectTypes[typeof object])) return result;
        for (index in iterable) {
          if (hasOwnProperty.call(iterable, index)) {
            result.push(index);
          }
        }
      return result
    };

    /**
     * Creates an array composed of the own enumerable property names of an object.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns an array of property names.
     * @example
     *
     * _.keys({ 'one': 1, 'two': 2, 'three': 3 });
     * // => ['one', 'two', 'three'] (property order is not guaranteed across environments)
     */
    var keys = !nativeKeys ? shimKeys : function(object) {
      if (!isObject(object)) {
        return [];
      }
      return nativeKeys(object);
    };

    /**
     * Used to convert characters to HTML entities:
     *
     * Though the `>` character is escaped for symmetry, characters like `>` and `/`
     * don't require escaping in HTML and have no special meaning unless they're part
     * of a tag or an unquoted attribute value.
     * http://mathiasbynens.be/notes/ambiguous-ampersands (under "semi-related fun fact")
     */
    var htmlEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };

    /** Used to convert HTML entities to characters */
    var htmlUnescapes = invert(htmlEscapes);

    /** Used to match HTML entities and HTML characters */
    var reEscapedHtml = RegExp('(' + keys(htmlUnescapes).join('|') + ')', 'g'),
        reUnescapedHtml = RegExp('[' + keys(htmlEscapes).join('') + ']', 'g');

    /*--------------------------------------------------------------------------*/

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object. Subsequent sources will overwrite property assignments of previous
     * sources. If a callback is provided it will be executed to produce the
     * assigned values. The callback is bound to `thisArg` and invoked with two
     * arguments; (objectValue, sourceValue).
     *
     * @static
     * @memberOf _
     * @type Function
     * @alias extend
     * @category Objects
     * @param {Object} object The destination object.
     * @param {...Object} [source] The source objects.
     * @param {Function} [callback] The function to customize assigning values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the destination object.
     * @example
     *
     * _.assign({ 'name': 'fred' }, { 'employer': 'slate' });
     * // => { 'name': 'fred', 'employer': 'slate' }
     *
     * var defaults = _.partialRight(_.assign, function(a, b) {
     *   return typeof a == 'undefined' ? b : a;
     * });
     *
     * var object = { 'name': 'barney' };
     * defaults(object, { 'name': 'fred', 'employer': 'slate' });
     * // => { 'name': 'barney', 'employer': 'slate' }
     */
    var assign = function(object, source, guard) {
      var index, iterable = object, result = iterable;
      if (!iterable) return result;
      var args = arguments,
          argsIndex = 0,
          argsLength = typeof guard == 'number' ? 2 : args.length;
      if (argsLength > 3 && typeof args[argsLength - 2] == 'function') {
        var callback = baseCreateCallback(args[--argsLength - 1], args[argsLength--], 2);
      } else if (argsLength > 2 && typeof args[argsLength - 1] == 'function') {
        callback = args[--argsLength];
      }
      while (++argsIndex < argsLength) {
        iterable = args[argsIndex];
        if (iterable && objectTypes[typeof iterable]) {
        var ownIndex = -1,
            ownProps = objectTypes[typeof iterable] && keys(iterable),
            length = ownProps ? ownProps.length : 0;

        while (++ownIndex < length) {
          index = ownProps[ownIndex];
          result[index] = callback ? callback(result[index], iterable[index]) : iterable[index];
        }
        }
      }
      return result
    };

    /**
     * Creates a clone of `value`. If `isDeep` is `true` nested objects will also
     * be cloned, otherwise they will be assigned by reference. If a callback
     * is provided it will be executed to produce the cloned values. If the
     * callback returns `undefined` cloning will be handled by the method instead.
     * The callback is bound to `thisArg` and invoked with one argument; (value).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to clone.
     * @param {boolean} [isDeep=false] Specify a deep clone.
     * @param {Function} [callback] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the cloned value.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * var shallow = _.clone(characters);
     * shallow[0] === characters[0];
     * // => true
     *
     * var deep = _.clone(characters, true);
     * deep[0] === characters[0];
     * // => false
     *
     * _.mixin({
     *   'clone': _.partialRight(_.clone, function(value) {
     *     return _.isElement(value) ? value.cloneNode(false) : undefined;
     *   })
     * });
     *
     * var clone = _.clone(document.body);
     * clone.childNodes.length;
     * // => 0
     */
    function clone(value, isDeep, callback, thisArg) {
      // allows working with "Collections" methods without using their `index`
      // and `collection` arguments for `isDeep` and `callback`
      if (typeof isDeep != 'boolean' && isDeep != null) {
        thisArg = callback;
        callback = isDeep;
        isDeep = false;
      }
      return baseClone(value, isDeep, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
    }

    /**
     * Creates a deep clone of `value`. If a callback is provided it will be
     * executed to produce the cloned values. If the callback returns `undefined`
     * cloning will be handled by the method instead. The callback is bound to
     * `thisArg` and invoked with one argument; (value).
     *
     * Note: This method is loosely based on the structured clone algorithm. Functions
     * and DOM nodes are **not** cloned. The enumerable properties of `arguments` objects and
     * objects created by constructors other than `Object` are cloned to plain `Object` objects.
     * See http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to deep clone.
     * @param {Function} [callback] The function to customize cloning values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the deep cloned value.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * var deep = _.cloneDeep(characters);
     * deep[0] === characters[0];
     * // => false
     *
     * var view = {
     *   'label': 'docs',
     *   'node': element
     * };
     *
     * var clone = _.cloneDeep(view, function(value) {
     *   return _.isElement(value) ? value.cloneNode(true) : undefined;
     * });
     *
     * clone.node == view.node;
     * // => false
     */
    function cloneDeep(value, callback, thisArg) {
      return baseClone(value, true, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 1));
    }

    /**
     * Creates an object that inherits from the given `prototype` object. If a
     * `properties` object is provided its own enumerable properties are assigned
     * to the created object.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} prototype The object to inherit from.
     * @param {Object} [properties] The properties to assign to the object.
     * @returns {Object} Returns the new object.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * function Circle() {
     *   Shape.call(this);
     * }
     *
     * Circle.prototype = _.create(Shape.prototype, { 'constructor': Circle });
     *
     * var circle = new Circle;
     * circle instanceof Circle;
     * // => true
     *
     * circle instanceof Shape;
     * // => true
     */
    function create(prototype, properties) {
      var result = baseCreate(prototype);
      return properties ? assign(result, properties) : result;
    }

    /**
     * Assigns own enumerable properties of source object(s) to the destination
     * object for all destination properties that resolve to `undefined`. Once a
     * property is set, additional defaults of the same property will be ignored.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {Object} object The destination object.
     * @param {...Object} [source] The source objects.
     * @param- {Object} [guard] Allows working with `_.reduce` without using its
     *  `key` and `object` arguments as sources.
     * @returns {Object} Returns the destination object.
     * @example
     *
     * var object = { 'name': 'barney' };
     * _.defaults(object, { 'name': 'fred', 'employer': 'slate' });
     * // => { 'name': 'barney', 'employer': 'slate' }
     */
    var defaults = function(object, source, guard) {
      var index, iterable = object, result = iterable;
      if (!iterable) return result;
      var args = arguments,
          argsIndex = 0,
          argsLength = typeof guard == 'number' ? 2 : args.length;
      while (++argsIndex < argsLength) {
        iterable = args[argsIndex];
        if (iterable && objectTypes[typeof iterable]) {
        var ownIndex = -1,
            ownProps = objectTypes[typeof iterable] && keys(iterable),
            length = ownProps ? ownProps.length : 0;

        while (++ownIndex < length) {
          index = ownProps[ownIndex];
          if (typeof result[index] == 'undefined') result[index] = iterable[index];
        }
        }
      }
      return result
    };

    /**
     * This method is like `_.findIndex` except that it returns the key of the
     * first element that passes the callback check, instead of the element itself.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [callback=identity] The function called per
     *  iteration. If a property name or object is provided it will be used to
     *  create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {string|undefined} Returns the key of the found element, else `undefined`.
     * @example
     *
     * var characters = {
     *   'barney': {  'age': 36, 'blocked': false },
     *   'fred': {    'age': 40, 'blocked': true },
     *   'pebbles': { 'age': 1,  'blocked': false }
     * };
     *
     * _.findKey(characters, function(chr) {
     *   return chr.age < 40;
     * });
     * // => 'barney' (property order is not guaranteed across environments)
     *
     * // using "_.where" callback shorthand
     * _.findKey(characters, { 'age': 1 });
     * // => 'pebbles'
     *
     * // using "_.pluck" callback shorthand
     * _.findKey(characters, 'blocked');
     * // => 'fred'
     */
    function findKey(object, callback, thisArg) {
      var result;
      callback = lodash.createCallback(callback, thisArg, 3);
      forOwn(object, function(value, key, object) {
        if (callback(value, key, object)) {
          result = key;
          return false;
        }
      });
      return result;
    }

    /**
     * This method is like `_.findKey` except that it iterates over elements
     * of a `collection` in the opposite order.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to search.
     * @param {Function|Object|string} [callback=identity] The function called per
     *  iteration. If a property name or object is provided it will be used to
     *  create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {string|undefined} Returns the key of the found element, else `undefined`.
     * @example
     *
     * var characters = {
     *   'barney': {  'age': 36, 'blocked': true },
     *   'fred': {    'age': 40, 'blocked': false },
     *   'pebbles': { 'age': 1,  'blocked': true }
     * };
     *
     * _.findLastKey(characters, function(chr) {
     *   return chr.age < 40;
     * });
     * // => returns `pebbles`, assuming `_.findKey` returns `barney`
     *
     * // using "_.where" callback shorthand
     * _.findLastKey(characters, { 'age': 40 });
     * // => 'fred'
     *
     * // using "_.pluck" callback shorthand
     * _.findLastKey(characters, 'blocked');
     * // => 'pebbles'
     */
    function findLastKey(object, callback, thisArg) {
      var result;
      callback = lodash.createCallback(callback, thisArg, 3);
      forOwnRight(object, function(value, key, object) {
        if (callback(value, key, object)) {
          result = key;
          return false;
        }
      });
      return result;
    }

    /**
     * Iterates over own and inherited enumerable properties of an object,
     * executing the callback for each property. The callback is bound to `thisArg`
     * and invoked with three arguments; (value, key, object). Callbacks may exit
     * iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * Shape.prototype.move = function(x, y) {
     *   this.x += x;
     *   this.y += y;
     * };
     *
     * _.forIn(new Shape, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'x', 'y', and 'move' (property order is not guaranteed across environments)
     */
    var forIn = function(collection, callback, thisArg) {
      var index, iterable = collection, result = iterable;
      if (!iterable) return result;
      if (!objectTypes[typeof iterable]) return result;
      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
        for (index in iterable) {
          if (callback(iterable[index], index, collection) === false) return result;
        }
      return result
    };

    /**
     * This method is like `_.forIn` except that it iterates over elements
     * of a `collection` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * Shape.prototype.move = function(x, y) {
     *   this.x += x;
     *   this.y += y;
     * };
     *
     * _.forInRight(new Shape, function(value, key) {
     *   console.log(key);
     * });
     * // => logs 'move', 'y', and 'x' assuming `_.forIn ` logs 'x', 'y', and 'move'
     */
    function forInRight(object, callback, thisArg) {
      var pairs = [];

      forIn(object, function(value, key) {
        pairs.push(key, value);
      });

      var length = pairs.length;
      callback = baseCreateCallback(callback, thisArg, 3);
      while (length--) {
        if (callback(pairs[length--], pairs[length], object) === false) {
          break;
        }
      }
      return object;
    }

    /**
     * Iterates over own enumerable properties of an object, executing the callback
     * for each property. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, key, object). Callbacks may exit iteration early by
     * explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.forOwn({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
     *   console.log(key);
     * });
     * // => logs '0', '1', and 'length' (property order is not guaranteed across environments)
     */
    var forOwn = function(collection, callback, thisArg) {
      var index, iterable = collection, result = iterable;
      if (!iterable) return result;
      if (!objectTypes[typeof iterable]) return result;
      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
        var ownIndex = -1,
            ownProps = objectTypes[typeof iterable] && keys(iterable),
            length = ownProps ? ownProps.length : 0;

        while (++ownIndex < length) {
          index = ownProps[ownIndex];
          if (callback(iterable[index], index, collection) === false) return result;
        }
      return result
    };

    /**
     * This method is like `_.forOwn` except that it iterates over elements
     * of a `collection` in the opposite order.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns `object`.
     * @example
     *
     * _.forOwnRight({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
     *   console.log(key);
     * });
     * // => logs 'length', '1', and '0' assuming `_.forOwn` logs '0', '1', and 'length'
     */
    function forOwnRight(object, callback, thisArg) {
      var props = keys(object),
          length = props.length;

      callback = baseCreateCallback(callback, thisArg, 3);
      while (length--) {
        var key = props[length];
        if (callback(object[key], key, object) === false) {
          break;
        }
      }
      return object;
    }

    /**
     * Creates a sorted array of property names of all enumerable properties,
     * own and inherited, of `object` that have function values.
     *
     * @static
     * @memberOf _
     * @alias methods
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns an array of property names that have function values.
     * @example
     *
     * _.functions(_);
     * // => ['all', 'any', 'bind', 'bindAll', 'clone', 'compact', 'compose', ...]
     */
    function functions(object) {
      var result = [];
      forIn(object, function(value, key) {
        if (isFunction(value)) {
          result.push(key);
        }
      });
      return result.sort();
    }

    /**
     * Checks if the specified property name exists as a direct property of `object`,
     * instead of an inherited property.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @param {string} key The name of the property to check.
     * @returns {boolean} Returns `true` if key is a direct property, else `false`.
     * @example
     *
     * _.has({ 'a': 1, 'b': 2, 'c': 3 }, 'b');
     * // => true
     */
    function has(object, key) {
      return object ? hasOwnProperty.call(object, key) : false;
    }

    /**
     * Creates an object composed of the inverted keys and values of the given object.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to invert.
     * @returns {Object} Returns the created inverted object.
     * @example
     *
     * _.invert({ 'first': 'fred', 'second': 'barney' });
     * // => { 'fred': 'first', 'barney': 'second' }
     */
    function invert(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = {};

      while (++index < length) {
        var key = props[index];
        result[object[key]] = key;
      }
      return result;
    }

    /**
     * Checks if `value` is a boolean value.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a boolean value, else `false`.
     * @example
     *
     * _.isBoolean(null);
     * // => false
     */
    function isBoolean(value) {
      return value === true || value === false ||
        value && typeof value == 'object' && toString.call(value) == boolClass || false;
    }

    /**
     * Checks if `value` is a date.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a date, else `false`.
     * @example
     *
     * _.isDate(new Date);
     * // => true
     */
    function isDate(value) {
      return value && typeof value == 'object' && toString.call(value) == dateClass || false;
    }

    /**
     * Checks if `value` is a DOM element.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a DOM element, else `false`.
     * @example
     *
     * _.isElement(document.body);
     * // => true
     */
    function isElement(value) {
      return value && value.nodeType === 1 || false;
    }

    /**
     * Checks if `value` is empty. Arrays, strings, or `arguments` objects with a
     * length of `0` and objects with no own enumerable properties are considered
     * "empty".
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Array|Object|string} value The value to inspect.
     * @returns {boolean} Returns `true` if the `value` is empty, else `false`.
     * @example
     *
     * _.isEmpty([1, 2, 3]);
     * // => false
     *
     * _.isEmpty({});
     * // => true
     *
     * _.isEmpty('');
     * // => true
     */
    function isEmpty(value) {
      var result = true;
      if (!value) {
        return result;
      }
      var className = toString.call(value),
          length = value.length;

      if ((className == arrayClass || className == stringClass || className == argsClass ) ||
          (className == objectClass && typeof length == 'number' && isFunction(value.splice))) {
        return !length;
      }
      forOwn(value, function() {
        return (result = false);
      });
      return result;
    }

    /**
     * Performs a deep comparison between two values to determine if they are
     * equivalent to each other. If a callback is provided it will be executed
     * to compare values. If the callback returns `undefined` comparisons will
     * be handled by the method instead. The callback is bound to `thisArg` and
     * invoked with two arguments; (a, b).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} a The value to compare.
     * @param {*} b The other value to compare.
     * @param {Function} [callback] The function to customize comparing values.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'name': 'fred' };
     * var copy = { 'name': 'fred' };
     *
     * object == copy;
     * // => false
     *
     * _.isEqual(object, copy);
     * // => true
     *
     * var words = ['hello', 'goodbye'];
     * var otherWords = ['hi', 'goodbye'];
     *
     * _.isEqual(words, otherWords, function(a, b) {
     *   var reGreet = /^(?:hello|hi)$/i,
     *       aGreet = _.isString(a) && reGreet.test(a),
     *       bGreet = _.isString(b) && reGreet.test(b);
     *
     *   return (aGreet || bGreet) ? (aGreet == bGreet) : undefined;
     * });
     * // => true
     */
    function isEqual(a, b, callback, thisArg) {
      return baseIsEqual(a, b, typeof callback == 'function' && baseCreateCallback(callback, thisArg, 2));
    }

    /**
     * Checks if `value` is, or can be coerced to, a finite number.
     *
     * Note: This is not the same as native `isFinite` which will return true for
     * booleans and empty strings. See http://es5.github.io/#x15.1.2.5.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is finite, else `false`.
     * @example
     *
     * _.isFinite(-101);
     * // => true
     *
     * _.isFinite('10');
     * // => true
     *
     * _.isFinite(true);
     * // => false
     *
     * _.isFinite('');
     * // => false
     *
     * _.isFinite(Infinity);
     * // => false
     */
    function isFinite(value) {
      return nativeIsFinite(value) && !nativeIsNaN(parseFloat(value));
    }

    /**
     * Checks if `value` is a function.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     */
    function isFunction(value) {
      return typeof value == 'function';
    }

    /**
     * Checks if `value` is the language type of Object.
     * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(1);
     * // => false
     */
    function isObject(value) {
      // check if the value is the ECMAScript language type of Object
      // http://es5.github.io/#x8
      // and avoid a V8 bug
      // http://code.google.com/p/v8/issues/detail?id=2291
      return !!(value && objectTypes[typeof value]);
    }

    /**
     * Checks if `value` is `NaN`.
     *
     * Note: This is not the same as native `isNaN` which will return `true` for
     * `undefined` and other non-numeric values. See http://es5.github.io/#x15.1.2.4.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is `NaN`, else `false`.
     * @example
     *
     * _.isNaN(NaN);
     * // => true
     *
     * _.isNaN(new Number(NaN));
     * // => true
     *
     * isNaN(undefined);
     * // => true
     *
     * _.isNaN(undefined);
     * // => false
     */
    function isNaN(value) {
      // `NaN` as a primitive is the only value that is not equal to itself
      // (perform the [[Class]] check first to avoid errors with some host objects in IE)
      return isNumber(value) && value != +value;
    }

    /**
     * Checks if `value` is `null`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is `null`, else `false`.
     * @example
     *
     * _.isNull(null);
     * // => true
     *
     * _.isNull(undefined);
     * // => false
     */
    function isNull(value) {
      return value === null;
    }

    /**
     * Checks if `value` is a number.
     *
     * Note: `NaN` is considered a number. See http://es5.github.io/#x8.5.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a number, else `false`.
     * @example
     *
     * _.isNumber(8.4 * 5);
     * // => true
     */
    function isNumber(value) {
      return typeof value == 'number' ||
        value && typeof value == 'object' && toString.call(value) == numberClass || false;
    }

    /**
     * Checks if `value` is an object created by the `Object` constructor.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
     * @example
     *
     * function Shape() {
     *   this.x = 0;
     *   this.y = 0;
     * }
     *
     * _.isPlainObject(new Shape);
     * // => false
     *
     * _.isPlainObject([1, 2, 3]);
     * // => false
     *
     * _.isPlainObject({ 'x': 0, 'y': 0 });
     * // => true
     */
    var isPlainObject = !getPrototypeOf ? shimIsPlainObject : function(value) {
      if (!(value && toString.call(value) == objectClass)) {
        return false;
      }
      var valueOf = value.valueOf,
          objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);

      return objProto
        ? (value == objProto || getPrototypeOf(value) == objProto)
        : shimIsPlainObject(value);
    };

    /**
     * Checks if `value` is a regular expression.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a regular expression, else `false`.
     * @example
     *
     * _.isRegExp(/fred/);
     * // => true
     */
    function isRegExp(value) {
      return value && typeof value == 'object' && toString.call(value) == regexpClass || false;
    }

    /**
     * Checks if `value` is a string.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is a string, else `false`.
     * @example
     *
     * _.isString('fred');
     * // => true
     */
    function isString(value) {
      return typeof value == 'string' ||
        value && typeof value == 'object' && toString.call(value) == stringClass || false;
    }

    /**
     * Checks if `value` is `undefined`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if the `value` is `undefined`, else `false`.
     * @example
     *
     * _.isUndefined(void 0);
     * // => true
     */
    function isUndefined(value) {
      return typeof value == 'undefined';
    }

    /**
     * Creates an object with the same keys as `object` and values generated by
     * running each own enumerable property of `object` through the callback.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, key, object).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new object with values of the results of each `callback` execution.
     * @example
     *
     * _.mapValues({ 'a': 1, 'b': 2, 'c': 3} , function(num) { return num * 3; });
     * // => { 'a': 3, 'b': 6, 'c': 9 }
     *
     * var characters = {
     *   'fred': { 'name': 'fred', 'age': 40 },
     *   'pebbles': { 'name': 'pebbles', 'age': 1 }
     * };
     *
     * // using "_.pluck" callback shorthand
     * _.mapValues(characters, 'age');
     * // => { 'fred': 40, 'pebbles': 1 }
     */
    function mapValues(object, callback, thisArg) {
      var result = {};
      callback = lodash.createCallback(callback, thisArg, 3);

      forOwn(object, function(value, key, object) {
        result[key] = callback(value, key, object);
      });
      return result;
    }

    /**
     * Recursively merges own enumerable properties of the source object(s), that
     * don't resolve to `undefined` into the destination object. Subsequent sources
     * will overwrite property assignments of previous sources. If a callback is
     * provided it will be executed to produce the merged values of the destination
     * and source properties. If the callback returns `undefined` merging will
     * be handled by the method instead. The callback is bound to `thisArg` and
     * invoked with two arguments; (objectValue, sourceValue).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The destination object.
     * @param {...Object} [source] The source objects.
     * @param {Function} [callback] The function to customize merging properties.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the destination object.
     * @example
     *
     * var names = {
     *   'characters': [
     *     { 'name': 'barney' },
     *     { 'name': 'fred' }
     *   ]
     * };
     *
     * var ages = {
     *   'characters': [
     *     { 'age': 36 },
     *     { 'age': 40 }
     *   ]
     * };
     *
     * _.merge(names, ages);
     * // => { 'characters': [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred', 'age': 40 }] }
     *
     * var food = {
     *   'fruits': ['apple'],
     *   'vegetables': ['beet']
     * };
     *
     * var otherFood = {
     *   'fruits': ['banana'],
     *   'vegetables': ['carrot']
     * };
     *
     * _.merge(food, otherFood, function(a, b) {
     *   return _.isArray(a) ? a.concat(b) : undefined;
     * });
     * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot] }
     */
    function merge(object) {
      var args = arguments,
          length = 2;

      if (!isObject(object)) {
        return object;
      }
      // allows working with `_.reduce` and `_.reduceRight` without using
      // their `index` and `collection` arguments
      if (typeof args[2] != 'number') {
        length = args.length;
      }
      if (length > 3 && typeof args[length - 2] == 'function') {
        var callback = baseCreateCallback(args[--length - 1], args[length--], 2);
      } else if (length > 2 && typeof args[length - 1] == 'function') {
        callback = args[--length];
      }
      var sources = slice(arguments, 1, length),
          index = -1,
          stackA = getArray(),
          stackB = getArray();

      while (++index < length) {
        baseMerge(object, sources[index], callback, stackA, stackB);
      }
      releaseArray(stackA);
      releaseArray(stackB);
      return object;
    }

    /**
     * Creates a shallow clone of `object` excluding the specified properties.
     * Property names may be specified as individual arguments or as arrays of
     * property names. If a callback is provided it will be executed for each
     * property of `object` omitting the properties the callback returns truey
     * for. The callback is bound to `thisArg` and invoked with three arguments;
     * (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The source object.
     * @param {Function|...string|string[]} [callback] The properties to omit or the
     *  function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns an object without the omitted properties.
     * @example
     *
     * _.omit({ 'name': 'fred', 'age': 40 }, 'age');
     * // => { 'name': 'fred' }
     *
     * _.omit({ 'name': 'fred', 'age': 40 }, function(value) {
     *   return typeof value == 'number';
     * });
     * // => { 'name': 'fred' }
     */
    function omit(object, callback, thisArg) {
      var result = {};
      if (typeof callback != 'function') {
        var props = [];
        forIn(object, function(value, key) {
          props.push(key);
        });
        props = baseDifference(props, baseFlatten(arguments, true, false, 1));

        var index = -1,
            length = props.length;

        while (++index < length) {
          var key = props[index];
          result[key] = object[key];
        }
      } else {
        callback = lodash.createCallback(callback, thisArg, 3);
        forIn(object, function(value, key, object) {
          if (!callback(value, key, object)) {
            result[key] = value;
          }
        });
      }
      return result;
    }

    /**
     * Creates a two dimensional array of an object's key-value pairs,
     * i.e. `[[key1, value1], [key2, value2]]`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns new array of key-value pairs.
     * @example
     *
     * _.pairs({ 'barney': 36, 'fred': 40 });
     * // => [['barney', 36], ['fred', 40]] (property order is not guaranteed across environments)
     */
    function pairs(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = Array(length);

      while (++index < length) {
        var key = props[index];
        result[index] = [key, object[key]];
      }
      return result;
    }

    /**
     * Creates a shallow clone of `object` composed of the specified properties.
     * Property names may be specified as individual arguments or as arrays of
     * property names. If a callback is provided it will be executed for each
     * property of `object` picking the properties the callback returns truey
     * for. The callback is bound to `thisArg` and invoked with three arguments;
     * (value, key, object).
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The source object.
     * @param {Function|...string|string[]} [callback] The function called per
     *  iteration or property names to pick, specified as individual property
     *  names or arrays of property names.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns an object composed of the picked properties.
     * @example
     *
     * _.pick({ 'name': 'fred', '_userid': 'fred1' }, 'name');
     * // => { 'name': 'fred' }
     *
     * _.pick({ 'name': 'fred', '_userid': 'fred1' }, function(value, key) {
     *   return key.charAt(0) != '_';
     * });
     * // => { 'name': 'fred' }
     */
    function pick(object, callback, thisArg) {
      var result = {};
      if (typeof callback != 'function') {
        var index = -1,
            props = baseFlatten(arguments, true, false, 1),
            length = isObject(object) ? props.length : 0;

        while (++index < length) {
          var key = props[index];
          if (key in object) {
            result[key] = object[key];
          }
        }
      } else {
        callback = lodash.createCallback(callback, thisArg, 3);
        forIn(object, function(value, key, object) {
          if (callback(value, key, object)) {
            result[key] = value;
          }
        });
      }
      return result;
    }

    /**
     * An alternative to `_.reduce` this method transforms `object` to a new
     * `accumulator` object which is the result of running each of its own
     * enumerable properties through a callback, with each callback execution
     * potentially mutating the `accumulator` object. The callback is bound to
     * `thisArg` and invoked with four arguments; (accumulator, value, key, object).
     * Callbacks may exit iteration early by explicitly returning `false`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Array|Object} object The object to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [accumulator] The custom accumulator value.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var squares = _.transform([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], function(result, num) {
     *   num *= num;
     *   if (num % 2) {
     *     return result.push(num) < 3;
     *   }
     * });
     * // => [1, 9, 25]
     *
     * var mapped = _.transform({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
     *   result[key] = num * 3;
     * });
     * // => { 'a': 3, 'b': 6, 'c': 9 }
     */
    function transform(object, callback, accumulator, thisArg) {
      var isArr = isArray(object);
      if (accumulator == null) {
        if (isArr) {
          accumulator = [];
        } else {
          var ctor = object && object.constructor,
              proto = ctor && ctor.prototype;

          accumulator = baseCreate(proto);
        }
      }
      if (callback) {
        callback = lodash.createCallback(callback, thisArg, 4);
        (isArr ? forEach : forOwn)(object, function(value, index, object) {
          return callback(accumulator, value, index, object);
        });
      }
      return accumulator;
    }

    /**
     * Creates an array composed of the own enumerable property values of `object`.
     *
     * @static
     * @memberOf _
     * @category Objects
     * @param {Object} object The object to inspect.
     * @returns {Array} Returns an array of property values.
     * @example
     *
     * _.values({ 'one': 1, 'two': 2, 'three': 3 });
     * // => [1, 2, 3] (property order is not guaranteed across environments)
     */
    function values(object) {
      var index = -1,
          props = keys(object),
          length = props.length,
          result = Array(length);

      while (++index < length) {
        result[index] = object[props[index]];
      }
      return result;
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates an array of elements from the specified indexes, or keys, of the
     * `collection`. Indexes may be specified as individual arguments or as arrays
     * of indexes.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {...(number|number[]|string|string[])} [index] The indexes of `collection`
     *   to retrieve, specified as individual indexes or arrays of indexes.
     * @returns {Array} Returns a new array of elements corresponding to the
     *  provided indexes.
     * @example
     *
     * _.at(['a', 'b', 'c', 'd', 'e'], [0, 2, 4]);
     * // => ['a', 'c', 'e']
     *
     * _.at(['fred', 'barney', 'pebbles'], 0, 2);
     * // => ['fred', 'pebbles']
     */
    function at(collection) {
      var args = arguments,
          index = -1,
          props = baseFlatten(args, true, false, 1),
          length = (args[2] && args[2][args[1]] === collection) ? 1 : props.length,
          result = Array(length);

      while(++index < length) {
        result[index] = collection[props[index]];
      }
      return result;
    }

    /**
     * Checks if a given value is present in a collection using strict equality
     * for comparisons, i.e. `===`. If `fromIndex` is negative, it is used as the
     * offset from the end of the collection.
     *
     * @static
     * @memberOf _
     * @alias include
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {*} target The value to check for.
     * @param {number} [fromIndex=0] The index to search from.
     * @returns {boolean} Returns `true` if the `target` element is found, else `false`.
     * @example
     *
     * _.contains([1, 2, 3], 1);
     * // => true
     *
     * _.contains([1, 2, 3], 1, 2);
     * // => false
     *
     * _.contains({ 'name': 'fred', 'age': 40 }, 'fred');
     * // => true
     *
     * _.contains('pebbles', 'eb');
     * // => true
     */
    function contains(collection, target, fromIndex) {
      var index = -1,
          indexOf = getIndexOf(),
          length = collection ? collection.length : 0,
          result = false;

      fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex) || 0;
      if (isArray(collection)) {
        result = indexOf(collection, target, fromIndex) > -1;
      } else if (typeof length == 'number') {
        result = (isString(collection) ? collection.indexOf(target, fromIndex) : indexOf(collection, target, fromIndex)) > -1;
      } else {
        forOwn(collection, function(value) {
          if (++index >= fromIndex) {
            return !(result = value === target);
          }
        });
      }
      return result;
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of `collection` through the callback. The corresponding value
     * of each key is the number of times the key was returned by the callback.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.countBy([4.3, 6.1, 6.4], function(num) { return Math.floor(num); });
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy([4.3, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
     * // => { '4': 1, '6': 2 }
     *
     * _.countBy(['one', 'two', 'three'], 'length');
     * // => { '3': 2, '5': 1 }
     */
    var countBy = createAggregator(function(result, value, key) {
      (hasOwnProperty.call(result, key) ? result[key]++ : result[key] = 1);
    });

    /**
     * Checks if the given callback returns truey value for **all** elements of
     * a collection. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias all
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {boolean} Returns `true` if all elements passed the callback check,
     *  else `false`.
     * @example
     *
     * _.every([true, 1, null, 'yes']);
     * // => false
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.every(characters, 'age');
     * // => true
     *
     * // using "_.where" callback shorthand
     * _.every(characters, { 'age': 36 });
     * // => false
     */
    function every(collection, callback, thisArg) {
      var result = true;
      callback = lodash.createCallback(callback, thisArg, 3);

      var index = -1,
          length = collection ? collection.length : 0;

      if (typeof length == 'number') {
        while (++index < length) {
          if (!(result = !!callback(collection[index], index, collection))) {
            break;
          }
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          return (result = !!callback(value, index, collection));
        });
      }
      return result;
    }

    /**
     * Iterates over elements of a collection, returning an array of all elements
     * the callback returns truey for. The callback is bound to `thisArg` and
     * invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias select
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of elements that passed the callback check.
     * @example
     *
     * var evens = _.filter([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
     * // => [2, 4, 6]
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36, 'blocked': false },
     *   { 'name': 'fred',   'age': 40, 'blocked': true }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.filter(characters, 'blocked');
     * // => [{ 'name': 'fred', 'age': 40, 'blocked': true }]
     *
     * // using "_.where" callback shorthand
     * _.filter(characters, { 'age': 36 });
     * // => [{ 'name': 'barney', 'age': 36, 'blocked': false }]
     */
    function filter(collection, callback, thisArg) {
      var result = [];
      callback = lodash.createCallback(callback, thisArg, 3);

      var index = -1,
          length = collection ? collection.length : 0;

      if (typeof length == 'number') {
        while (++index < length) {
          var value = collection[index];
          if (callback(value, index, collection)) {
            result.push(value);
          }
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          if (callback(value, index, collection)) {
            result.push(value);
          }
        });
      }
      return result;
    }

    /**
     * Iterates over elements of a collection, returning the first element that
     * the callback returns truey for. The callback is bound to `thisArg` and
     * invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias detect, findWhere
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the found element, else `undefined`.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36, 'blocked': false },
     *   { 'name': 'fred',    'age': 40, 'blocked': true },
     *   { 'name': 'pebbles', 'age': 1,  'blocked': false }
     * ];
     *
     * _.find(characters, function(chr) {
     *   return chr.age < 40;
     * });
     * // => { 'name': 'barney', 'age': 36, 'blocked': false }
     *
     * // using "_.where" callback shorthand
     * _.find(characters, { 'age': 1 });
     * // =>  { 'name': 'pebbles', 'age': 1, 'blocked': false }
     *
     * // using "_.pluck" callback shorthand
     * _.find(characters, 'blocked');
     * // => { 'name': 'fred', 'age': 40, 'blocked': true }
     */
    function find(collection, callback, thisArg) {
      callback = lodash.createCallback(callback, thisArg, 3);

      var index = -1,
          length = collection ? collection.length : 0;

      if (typeof length == 'number') {
        while (++index < length) {
          var value = collection[index];
          if (callback(value, index, collection)) {
            return value;
          }
        }
      } else {
        var result;
        forOwn(collection, function(value, index, collection) {
          if (callback(value, index, collection)) {
            result = value;
            return false;
          }
        });
        return result;
      }
    }

    /**
     * This method is like `_.find` except that it iterates over elements
     * of a `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the found element, else `undefined`.
     * @example
     *
     * _.findLast([1, 2, 3, 4], function(num) {
     *   return num % 2 == 1;
     * });
     * // => 3
     */
    function findLast(collection, callback, thisArg) {
      var result;
      callback = lodash.createCallback(callback, thisArg, 3);
      forEachRight(collection, function(value, index, collection) {
        if (callback(value, index, collection)) {
          result = value;
          return false;
        }
      });
      return result;
    }

    /**
     * Iterates over elements of a collection, executing the callback for each
     * element. The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection). Callbacks may exit iteration early by
     * explicitly returning `false`.
     *
     * Note: As with other "Collections" methods, objects with a `length` property
     * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
     * may be used for object iteration.
     *
     * @static
     * @memberOf _
     * @alias each
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2, 3]).forEach(function(num) { console.log(num); }).join(',');
     * // => logs each number and returns '1,2,3'
     *
     * _.forEach({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { console.log(num); });
     * // => logs each number and returns the object (property order is not guaranteed across environments)
     */
    function forEach(collection, callback, thisArg) {
      var index = -1,
          length = collection ? collection.length : 0;

      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
      if (typeof length == 'number') {
        while (++index < length) {
          if (callback(collection[index], index, collection) === false) {
            break;
          }
        }
      } else {
        forOwn(collection, callback);
      }
      return collection;
    }

    /**
     * This method is like `_.forEach` except that it iterates over elements
     * of a `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias eachRight
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array|Object|string} Returns `collection`.
     * @example
     *
     * _([1, 2, 3]).forEachRight(function(num) { console.log(num); }).join(',');
     * // => logs each number from right to left and returns '3,2,1'
     */
    function forEachRight(collection, callback, thisArg) {
      var length = collection ? collection.length : 0;
      callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
      if (typeof length == 'number') {
        while (length--) {
          if (callback(collection[length], length, collection) === false) {
            break;
          }
        }
      } else {
        var props = keys(collection);
        length = props.length;
        forOwn(collection, function(value, key, collection) {
          key = props ? props[--length] : --length;
          return callback(collection[key], key, collection);
        });
      }
      return collection;
    }

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of a collection through the callback. The corresponding value
     * of each key is an array of the elements responsible for generating the key.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * _.groupBy([4.2, 6.1, 6.4], function(num) { return Math.floor(num); });
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * _.groupBy([4.2, 6.1, 6.4], function(num) { return this.floor(num); }, Math);
     * // => { '4': [4.2], '6': [6.1, 6.4] }
     *
     * // using "_.pluck" callback shorthand
     * _.groupBy(['one', 'two', 'three'], 'length');
     * // => { '3': ['one', 'two'], '5': ['three'] }
     */
    var groupBy = createAggregator(function(result, value, key) {
      (hasOwnProperty.call(result, key) ? result[key] : result[key] = []).push(value);
    });

    /**
     * Creates an object composed of keys generated from the results of running
     * each element of the collection through the given callback. The corresponding
     * value of each key is the last element responsible for generating the key.
     * The callback is bound to `thisArg` and invoked with three arguments;
     * (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Object} Returns the composed aggregate object.
     * @example
     *
     * var keys = [
     *   { 'dir': 'left', 'code': 97 },
     *   { 'dir': 'right', 'code': 100 }
     * ];
     *
     * _.indexBy(keys, 'dir');
     * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(keys, function(key) { return String.fromCharCode(key.code); });
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     *
     * _.indexBy(characters, function(key) { this.fromCharCode(key.code); }, String);
     * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
     */
    var indexBy = createAggregator(function(result, value, key) {
      result[key] = value;
    });

    /**
     * Invokes the method named by `methodName` on each element in the `collection`
     * returning an array of the results of each invoked method. Additional arguments
     * will be provided to each invoked method. If `methodName` is a function it
     * will be invoked for, and `this` bound to, each element in the `collection`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|string} methodName The name of the method to invoke or
     *  the function invoked per iteration.
     * @param {...*} [arg] Arguments to invoke the method with.
     * @returns {Array} Returns a new array of the results of each invoked method.
     * @example
     *
     * _.invoke([[5, 1, 7], [3, 2, 1]], 'sort');
     * // => [[1, 5, 7], [1, 2, 3]]
     *
     * _.invoke([123, 456], String.prototype.split, '');
     * // => [['1', '2', '3'], ['4', '5', '6']]
     */
    function invoke(collection, methodName) {
      var args = slice(arguments, 2),
          index = -1,
          isFunc = typeof methodName == 'function',
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);

      forEach(collection, function(value) {
        result[++index] = (isFunc ? methodName : value[methodName]).apply(value, args);
      });
      return result;
    }

    /**
     * Creates an array of values by running each element in the collection
     * through the callback. The callback is bound to `thisArg` and invoked with
     * three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias collect
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of the results of each `callback` execution.
     * @example
     *
     * _.map([1, 2, 3], function(num) { return num * 3; });
     * // => [3, 6, 9]
     *
     * _.map({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { return num * 3; });
     * // => [3, 6, 9] (property order is not guaranteed across environments)
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.map(characters, 'name');
     * // => ['barney', 'fred']
     */
    function map(collection, callback, thisArg) {
      var index = -1,
          length = collection ? collection.length : 0;

      callback = lodash.createCallback(callback, thisArg, 3);
      if (typeof length == 'number') {
        var result = Array(length);
        while (++index < length) {
          result[index] = callback(collection[index], index, collection);
        }
      } else {
        result = [];
        forOwn(collection, function(value, key, collection) {
          result[++index] = callback(value, key, collection);
        });
      }
      return result;
    }

    /**
     * Retrieves the maximum value of a collection. If the collection is empty or
     * falsey `-Infinity` is returned. If a callback is provided it will be executed
     * for each value in the collection to generate the criterion by which the value
     * is ranked. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the maximum value.
     * @example
     *
     * _.max([4, 2, 8, 6]);
     * // => 8
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * _.max(characters, function(chr) { return chr.age; });
     * // => { 'name': 'fred', 'age': 40 };
     *
     * // using "_.pluck" callback shorthand
     * _.max(characters, 'age');
     * // => { 'name': 'fred', 'age': 40 };
     */
    function max(collection, callback, thisArg) {
      var computed = -Infinity,
          result = computed;

      // allows working with functions like `_.map` without using
      // their `index` argument as a callback
      if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
        callback = null;
      }
      if (callback == null && isArray(collection)) {
        var index = -1,
            length = collection.length;

        while (++index < length) {
          var value = collection[index];
          if (value > result) {
            result = value;
          }
        }
      } else {
        callback = (callback == null && isString(collection))
          ? charAtCallback
          : lodash.createCallback(callback, thisArg, 3);

        forEach(collection, function(value, index, collection) {
          var current = callback(value, index, collection);
          if (current > computed) {
            computed = current;
            result = value;
          }
        });
      }
      return result;
    }

    /**
     * Retrieves the minimum value of a collection. If the collection is empty or
     * falsey `Infinity` is returned. If a callback is provided it will be executed
     * for each value in the collection to generate the criterion by which the value
     * is ranked. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the minimum value.
     * @example
     *
     * _.min([4, 2, 8, 6]);
     * // => 2
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * _.min(characters, function(chr) { return chr.age; });
     * // => { 'name': 'barney', 'age': 36 };
     *
     * // using "_.pluck" callback shorthand
     * _.min(characters, 'age');
     * // => { 'name': 'barney', 'age': 36 };
     */
    function min(collection, callback, thisArg) {
      var computed = Infinity,
          result = computed;

      // allows working with functions like `_.map` without using
      // their `index` argument as a callback
      if (typeof callback != 'function' && thisArg && thisArg[callback] === collection) {
        callback = null;
      }
      if (callback == null && isArray(collection)) {
        var index = -1,
            length = collection.length;

        while (++index < length) {
          var value = collection[index];
          if (value < result) {
            result = value;
          }
        }
      } else {
        callback = (callback == null && isString(collection))
          ? charAtCallback
          : lodash.createCallback(callback, thisArg, 3);

        forEach(collection, function(value, index, collection) {
          var current = callback(value, index, collection);
          if (current < computed) {
            computed = current;
            result = value;
          }
        });
      }
      return result;
    }

    /**
     * Retrieves the value of a specified property from all elements in the collection.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {string} property The name of the property to pluck.
     * @returns {Array} Returns a new array of property values.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * _.pluck(characters, 'name');
     * // => ['barney', 'fred']
     */
    var pluck = map;

    /**
     * Reduces a collection to a value which is the accumulated result of running
     * each element in the collection through the callback, where each successive
     * callback execution consumes the return value of the previous execution. If
     * `accumulator` is not provided the first element of the collection will be
     * used as the initial `accumulator` value. The callback is bound to `thisArg`
     * and invoked with four arguments; (accumulator, value, index|key, collection).
     *
     * @static
     * @memberOf _
     * @alias foldl, inject
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [accumulator] Initial value of the accumulator.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var sum = _.reduce([1, 2, 3], function(sum, num) {
     *   return sum + num;
     * });
     * // => 6
     *
     * var mapped = _.reduce({ 'a': 1, 'b': 2, 'c': 3 }, function(result, num, key) {
     *   result[key] = num * 3;
     *   return result;
     * }, {});
     * // => { 'a': 3, 'b': 6, 'c': 9 }
     */
    function reduce(collection, callback, accumulator, thisArg) {
      if (!collection) return accumulator;
      var noaccum = arguments.length < 3;
      callback = lodash.createCallback(callback, thisArg, 4);

      var index = -1,
          length = collection.length;

      if (typeof length == 'number') {
        if (noaccum) {
          accumulator = collection[++index];
        }
        while (++index < length) {
          accumulator = callback(accumulator, collection[index], index, collection);
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          accumulator = noaccum
            ? (noaccum = false, value)
            : callback(accumulator, value, index, collection)
        });
      }
      return accumulator;
    }

    /**
     * This method is like `_.reduce` except that it iterates over elements
     * of a `collection` from right to left.
     *
     * @static
     * @memberOf _
     * @alias foldr
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function} [callback=identity] The function called per iteration.
     * @param {*} [accumulator] Initial value of the accumulator.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the accumulated value.
     * @example
     *
     * var list = [[0, 1], [2, 3], [4, 5]];
     * var flat = _.reduceRight(list, function(a, b) { return a.concat(b); }, []);
     * // => [4, 5, 2, 3, 0, 1]
     */
    function reduceRight(collection, callback, accumulator, thisArg) {
      var noaccum = arguments.length < 3;
      callback = lodash.createCallback(callback, thisArg, 4);
      forEachRight(collection, function(value, index, collection) {
        accumulator = noaccum
          ? (noaccum = false, value)
          : callback(accumulator, value, index, collection);
      });
      return accumulator;
    }

    /**
     * The opposite of `_.filter` this method returns the elements of a
     * collection that the callback does **not** return truey for.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of elements that failed the callback check.
     * @example
     *
     * var odds = _.reject([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
     * // => [1, 3, 5]
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36, 'blocked': false },
     *   { 'name': 'fred',   'age': 40, 'blocked': true }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.reject(characters, 'blocked');
     * // => [{ 'name': 'barney', 'age': 36, 'blocked': false }]
     *
     * // using "_.where" callback shorthand
     * _.reject(characters, { 'age': 36 });
     * // => [{ 'name': 'fred', 'age': 40, 'blocked': true }]
     */
    function reject(collection, callback, thisArg) {
      callback = lodash.createCallback(callback, thisArg, 3);
      return filter(collection, function(value, index, collection) {
        return !callback(value, index, collection);
      });
    }

    /**
     * Retrieves a random element or `n` random elements from a collection.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to sample.
     * @param {number} [n] The number of elements to sample.
     * @param- {Object} [guard] Allows working with functions like `_.map`
     *  without using their `index` arguments as `n`.
     * @returns {Array} Returns the random sample(s) of `collection`.
     * @example
     *
     * _.sample([1, 2, 3, 4]);
     * // => 2
     *
     * _.sample([1, 2, 3, 4], 2);
     * // => [3, 1]
     */
    function sample(collection, n, guard) {
      if (collection && typeof collection.length != 'number') {
        collection = values(collection);
      }
      if (n == null || guard) {
        return collection ? collection[baseRandom(0, collection.length - 1)] : undefined;
      }
      var result = shuffle(collection);
      result.length = nativeMin(nativeMax(0, n), result.length);
      return result;
    }

    /**
     * Creates an array of shuffled values, using a version of the Fisher-Yates
     * shuffle. See http://en.wikipedia.org/wiki/Fisher-Yates_shuffle.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to shuffle.
     * @returns {Array} Returns a new shuffled collection.
     * @example
     *
     * _.shuffle([1, 2, 3, 4, 5, 6]);
     * // => [4, 1, 6, 3, 5, 2]
     */
    function shuffle(collection) {
      var index = -1,
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);

      forEach(collection, function(value) {
        var rand = baseRandom(0, ++index);
        result[index] = result[rand];
        result[rand] = value;
      });
      return result;
    }

    /**
     * Gets the size of the `collection` by returning `collection.length` for arrays
     * and array-like objects or the number of own enumerable properties for objects.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to inspect.
     * @returns {number} Returns `collection.length` or number of own enumerable properties.
     * @example
     *
     * _.size([1, 2]);
     * // => 2
     *
     * _.size({ 'one': 1, 'two': 2, 'three': 3 });
     * // => 3
     *
     * _.size('pebbles');
     * // => 7
     */
    function size(collection) {
      var length = collection ? collection.length : 0;
      return typeof length == 'number' ? length : keys(collection).length;
    }

    /**
     * Checks if the callback returns a truey value for **any** element of a
     * collection. The function returns as soon as it finds a passing value and
     * does not iterate over the entire collection. The callback is bound to
     * `thisArg` and invoked with three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias any
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {boolean} Returns `true` if any element passed the callback check,
     *  else `false`.
     * @example
     *
     * _.some([null, 0, 'yes', false], Boolean);
     * // => true
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36, 'blocked': false },
     *   { 'name': 'fred',   'age': 40, 'blocked': true }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.some(characters, 'blocked');
     * // => true
     *
     * // using "_.where" callback shorthand
     * _.some(characters, { 'age': 1 });
     * // => false
     */
    function some(collection, callback, thisArg) {
      var result;
      callback = lodash.createCallback(callback, thisArg, 3);

      var index = -1,
          length = collection ? collection.length : 0;

      if (typeof length == 'number') {
        while (++index < length) {
          if ((result = callback(collection[index], index, collection))) {
            break;
          }
        }
      } else {
        forOwn(collection, function(value, index, collection) {
          return !(result = callback(value, index, collection));
        });
      }
      return !!result;
    }

    /**
     * Creates an array of elements, sorted in ascending order by the results of
     * running each element in a collection through the callback. This method
     * performs a stable sort, that is, it will preserve the original sort order
     * of equal elements. The callback is bound to `thisArg` and invoked with
     * three arguments; (value, index|key, collection).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an array of property names is provided for `callback` the collection
     * will be sorted by each property value.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Array|Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of sorted elements.
     * @example
     *
     * _.sortBy([1, 2, 3], function(num) { return Math.sin(num); });
     * // => [3, 1, 2]
     *
     * _.sortBy([1, 2, 3], function(num) { return this.sin(num); }, Math);
     * // => [3, 1, 2]
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36 },
     *   { 'name': 'fred',    'age': 40 },
     *   { 'name': 'barney',  'age': 26 },
     *   { 'name': 'fred',    'age': 30 }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.map(_.sortBy(characters, 'age'), _.values);
     * // => [['barney', 26], ['fred', 30], ['barney', 36], ['fred', 40]]
     *
     * // sorting by multiple properties
     * _.map(_.sortBy(characters, ['name', 'age']), _.values);
     * // = > [['barney', 26], ['barney', 36], ['fred', 30], ['fred', 40]]
     */
    function sortBy(collection, callback, thisArg) {
      var index = -1,
          isArr = isArray(callback),
          length = collection ? collection.length : 0,
          result = Array(typeof length == 'number' ? length : 0);

      if (!isArr) {
        callback = lodash.createCallback(callback, thisArg, 3);
      }
      forEach(collection, function(value, key, collection) {
        var object = result[++index] = getObject();
        if (isArr) {
          object.criteria = map(callback, function(key) { return value[key]; });
        } else {
          (object.criteria = getArray())[0] = callback(value, key, collection);
        }
        object.index = index;
        object.value = value;
      });

      length = result.length;
      result.sort(compareAscending);
      while (length--) {
        var object = result[length];
        result[length] = object.value;
        if (!isArr) {
          releaseArray(object.criteria);
        }
        releaseObject(object);
      }
      return result;
    }

    /**
     * Converts the `collection` to an array.
     *
     * @static
     * @memberOf _
     * @category Collections
     * @param {Array|Object|string} collection The collection to convert.
     * @returns {Array} Returns the new converted array.
     * @example
     *
     * (function() { return _.toArray(arguments).slice(1); })(1, 2, 3, 4);
     * // => [2, 3, 4]
     */
    function toArray(collection) {
      if (collection && typeof collection.length == 'number') {
        return slice(collection);
      }
      return values(collection);
    }

    /**
     * Performs a deep comparison of each element in a `collection` to the given
     * `properties` object, returning an array of all elements that have equivalent
     * property values.
     *
     * @static
     * @memberOf _
     * @type Function
     * @category Collections
     * @param {Array|Object|string} collection The collection to iterate over.
     * @param {Object} props The object of property values to filter by.
     * @returns {Array} Returns a new array of elements that have the given properties.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36, 'pets': ['hoppy'] },
     *   { 'name': 'fred',   'age': 40, 'pets': ['baby puss', 'dino'] }
     * ];
     *
     * _.where(characters, { 'age': 36 });
     * // => [{ 'name': 'barney', 'age': 36, 'pets': ['hoppy'] }]
     *
     * _.where(characters, { 'pets': ['dino'] });
     * // => [{ 'name': 'fred', 'age': 40, 'pets': ['baby puss', 'dino'] }]
     */
    var where = filter;

    /*--------------------------------------------------------------------------*/

    /**
     * Creates an array with all falsey values removed. The values `false`, `null`,
     * `0`, `""`, `undefined`, and `NaN` are all falsey.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to compact.
     * @returns {Array} Returns a new array of filtered values.
     * @example
     *
     * _.compact([0, 1, false, 2, '', 3]);
     * // => [1, 2, 3]
     */
    function compact(array) {
      var index = -1,
          length = array ? array.length : 0,
          result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result.push(value);
        }
      }
      return result;
    }

    /**
     * Creates an array excluding all values of the provided arrays using strict
     * equality for comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to process.
     * @param {...Array} [values] The arrays of values to exclude.
     * @returns {Array} Returns a new array of filtered values.
     * @example
     *
     * _.difference([1, 2, 3, 4, 5], [5, 2, 10]);
     * // => [1, 3, 4]
     */
    function difference(array) {
      return baseDifference(array, baseFlatten(arguments, true, true, 1));
    }

    /**
     * This method is like `_.find` except that it returns the index of the first
     * element that passes the callback check, instead of the element itself.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36, 'blocked': false },
     *   { 'name': 'fred',    'age': 40, 'blocked': true },
     *   { 'name': 'pebbles', 'age': 1,  'blocked': false }
     * ];
     *
     * _.findIndex(characters, function(chr) {
     *   return chr.age < 20;
     * });
     * // => 2
     *
     * // using "_.where" callback shorthand
     * _.findIndex(characters, { 'age': 36 });
     * // => 0
     *
     * // using "_.pluck" callback shorthand
     * _.findIndex(characters, 'blocked');
     * // => 1
     */
    function findIndex(array, callback, thisArg) {
      var index = -1,
          length = array ? array.length : 0;

      callback = lodash.createCallback(callback, thisArg, 3);
      while (++index < length) {
        if (callback(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * This method is like `_.findIndex` except that it iterates over elements
     * of a `collection` from right to left.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {number} Returns the index of the found element, else `-1`.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36, 'blocked': true },
     *   { 'name': 'fred',    'age': 40, 'blocked': false },
     *   { 'name': 'pebbles', 'age': 1,  'blocked': true }
     * ];
     *
     * _.findLastIndex(characters, function(chr) {
     *   return chr.age > 30;
     * });
     * // => 1
     *
     * // using "_.where" callback shorthand
     * _.findLastIndex(characters, { 'age': 36 });
     * // => 0
     *
     * // using "_.pluck" callback shorthand
     * _.findLastIndex(characters, 'blocked');
     * // => 2
     */
    function findLastIndex(array, callback, thisArg) {
      var length = array ? array.length : 0;
      callback = lodash.createCallback(callback, thisArg, 3);
      while (length--) {
        if (callback(array[length], length, array)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * Gets the first element or first `n` elements of an array. If a callback
     * is provided elements at the beginning of the array are returned as long
     * as the callback returns truey. The callback is bound to `thisArg` and
     * invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias head, take
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|number|string} [callback] The function called
     *  per element or the number of elements to return. If a property name or
     *  object is provided it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the first element(s) of `array`.
     * @example
     *
     * _.first([1, 2, 3]);
     * // => 1
     *
     * _.first([1, 2, 3], 2);
     * // => [1, 2]
     *
     * _.first([1, 2, 3], function(num) {
     *   return num < 3;
     * });
     * // => [1, 2]
     *
     * var characters = [
     *   { 'name': 'barney',  'blocked': true,  'employer': 'slate' },
     *   { 'name': 'fred',    'blocked': false, 'employer': 'slate' },
     *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.first(characters, 'blocked');
     * // => [{ 'name': 'barney', 'blocked': true, 'employer': 'slate' }]
     *
     * // using "_.where" callback shorthand
     * _.pluck(_.first(characters, { 'employer': 'slate' }), 'name');
     * // => ['barney', 'fred']
     */
    function first(array, callback, thisArg) {
      var n = 0,
          length = array ? array.length : 0;

      if (typeof callback != 'number' && callback != null) {
        var index = -1;
        callback = lodash.createCallback(callback, thisArg, 3);
        while (++index < length && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = callback;
        if (n == null || thisArg) {
          return array ? array[0] : undefined;
        }
      }
      return slice(array, 0, nativeMin(nativeMax(0, n), length));
    }

    /**
     * Flattens a nested array (the nesting can be to any depth). If `isShallow`
     * is truey, the array will only be flattened a single level. If a callback
     * is provided each element of the array is passed through the callback before
     * flattening. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to flatten.
     * @param {boolean} [isShallow=false] A flag to restrict flattening to a single level.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new flattened array.
     * @example
     *
     * _.flatten([1, [2], [3, [[4]]]]);
     * // => [1, 2, 3, 4];
     *
     * _.flatten([1, [2], [3, [[4]]]], true);
     * // => [1, 2, 3, [[4]]];
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 30, 'pets': ['hoppy'] },
     *   { 'name': 'fred',   'age': 40, 'pets': ['baby puss', 'dino'] }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.flatten(characters, 'pets');
     * // => ['hoppy', 'baby puss', 'dino']
     */
    function flatten(array, isShallow, callback, thisArg) {
      // juggle arguments
      if (typeof isShallow != 'boolean' && isShallow != null) {
        thisArg = callback;
        callback = (typeof isShallow != 'function' && thisArg && thisArg[isShallow] === array) ? null : isShallow;
        isShallow = false;
      }
      if (callback != null) {
        array = map(array, callback, thisArg);
      }
      return baseFlatten(array, isShallow);
    }

    /**
     * Gets the index at which the first occurrence of `value` is found using
     * strict equality for comparisons, i.e. `===`. If the array is already sorted
     * providing `true` for `fromIndex` will run a faster binary search.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {boolean|number} [fromIndex=0] The index to search from or `true`
     *  to perform a binary search on a sorted array.
     * @returns {number} Returns the index of the matched value or `-1`.
     * @example
     *
     * _.indexOf([1, 2, 3, 1, 2, 3], 2);
     * // => 1
     *
     * _.indexOf([1, 2, 3, 1, 2, 3], 2, 3);
     * // => 4
     *
     * _.indexOf([1, 1, 2, 2, 3, 3], 2, true);
     * // => 2
     */
    function indexOf(array, value, fromIndex) {
      if (typeof fromIndex == 'number') {
        var length = array ? array.length : 0;
        fromIndex = (fromIndex < 0 ? nativeMax(0, length + fromIndex) : fromIndex || 0);
      } else if (fromIndex) {
        var index = sortedIndex(array, value);
        return array[index] === value ? index : -1;
      }
      return baseIndexOf(array, value, fromIndex);
    }

    /**
     * Gets all but the last element or last `n` elements of an array. If a
     * callback is provided elements at the end of the array are excluded from
     * the result as long as the callback returns truey. The callback is bound
     * to `thisArg` and invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|number|string} [callback=1] The function called
     *  per element or the number of elements to exclude. If a property name or
     *  object is provided it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a slice of `array`.
     * @example
     *
     * _.initial([1, 2, 3]);
     * // => [1, 2]
     *
     * _.initial([1, 2, 3], 2);
     * // => [1]
     *
     * _.initial([1, 2, 3], function(num) {
     *   return num > 1;
     * });
     * // => [1]
     *
     * var characters = [
     *   { 'name': 'barney',  'blocked': false, 'employer': 'slate' },
     *   { 'name': 'fred',    'blocked': true,  'employer': 'slate' },
     *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.initial(characters, 'blocked');
     * // => [{ 'name': 'barney',  'blocked': false, 'employer': 'slate' }]
     *
     * // using "_.where" callback shorthand
     * _.pluck(_.initial(characters, { 'employer': 'na' }), 'name');
     * // => ['barney', 'fred']
     */
    function initial(array, callback, thisArg) {
      var n = 0,
          length = array ? array.length : 0;

      if (typeof callback != 'number' && callback != null) {
        var index = length;
        callback = lodash.createCallback(callback, thisArg, 3);
        while (index-- && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = (callback == null || thisArg) ? 1 : callback || n;
      }
      return slice(array, 0, nativeMin(nativeMax(0, length - n), length));
    }

    /**
     * Creates an array of unique values present in all provided arrays using
     * strict equality for comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {...Array} [array] The arrays to inspect.
     * @returns {Array} Returns an array of shared values.
     * @example
     *
     * _.intersection([1, 2, 3], [5, 2, 1, 4], [2, 1]);
     * // => [1, 2]
     */
    function intersection() {
      var args = [],
          argsIndex = -1,
          argsLength = arguments.length,
          caches = getArray(),
          indexOf = getIndexOf(),
          trustIndexOf = indexOf === baseIndexOf,
          seen = getArray();

      while (++argsIndex < argsLength) {
        var value = arguments[argsIndex];
        if (isArray(value) || isArguments(value)) {
          args.push(value);
          caches.push(trustIndexOf && value.length >= largeArraySize &&
            createCache(argsIndex ? args[argsIndex] : seen));
        }
      }
      var array = args[0],
          index = -1,
          length = array ? array.length : 0,
          result = [];

      outer:
      while (++index < length) {
        var cache = caches[0];
        value = array[index];

        if ((cache ? cacheIndexOf(cache, value) : indexOf(seen, value)) < 0) {
          argsIndex = argsLength;
          (cache || seen).push(value);
          while (--argsIndex) {
            cache = caches[argsIndex];
            if ((cache ? cacheIndexOf(cache, value) : indexOf(args[argsIndex], value)) < 0) {
              continue outer;
            }
          }
          result.push(value);
        }
      }
      while (argsLength--) {
        cache = caches[argsLength];
        if (cache) {
          releaseObject(cache);
        }
      }
      releaseArray(caches);
      releaseArray(seen);
      return result;
    }

    /**
     * Gets the last element or last `n` elements of an array. If a callback is
     * provided elements at the end of the array are returned as long as the
     * callback returns truey. The callback is bound to `thisArg` and invoked
     * with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|number|string} [callback] The function called
     *  per element or the number of elements to return. If a property name or
     *  object is provided it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {*} Returns the last element(s) of `array`.
     * @example
     *
     * _.last([1, 2, 3]);
     * // => 3
     *
     * _.last([1, 2, 3], 2);
     * // => [2, 3]
     *
     * _.last([1, 2, 3], function(num) {
     *   return num > 1;
     * });
     * // => [2, 3]
     *
     * var characters = [
     *   { 'name': 'barney',  'blocked': false, 'employer': 'slate' },
     *   { 'name': 'fred',    'blocked': true,  'employer': 'slate' },
     *   { 'name': 'pebbles', 'blocked': true,  'employer': 'na' }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.pluck(_.last(characters, 'blocked'), 'name');
     * // => ['fred', 'pebbles']
     *
     * // using "_.where" callback shorthand
     * _.last(characters, { 'employer': 'na' });
     * // => [{ 'name': 'pebbles', 'blocked': true, 'employer': 'na' }]
     */
    function last(array, callback, thisArg) {
      var n = 0,
          length = array ? array.length : 0;

      if (typeof callback != 'number' && callback != null) {
        var index = length;
        callback = lodash.createCallback(callback, thisArg, 3);
        while (index-- && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = callback;
        if (n == null || thisArg) {
          return array ? array[length - 1] : undefined;
        }
      }
      return slice(array, nativeMax(0, length - n));
    }

    /**
     * Gets the index at which the last occurrence of `value` is found using strict
     * equality for comparisons, i.e. `===`. If `fromIndex` is negative, it is used
     * as the offset from the end of the collection.
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to search.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=array.length-1] The index to search from.
     * @returns {number} Returns the index of the matched value or `-1`.
     * @example
     *
     * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2);
     * // => 4
     *
     * _.lastIndexOf([1, 2, 3, 1, 2, 3], 2, 3);
     * // => 1
     */
    function lastIndexOf(array, value, fromIndex) {
      var index = array ? array.length : 0;
      if (typeof fromIndex == 'number') {
        index = (fromIndex < 0 ? nativeMax(0, index + fromIndex) : nativeMin(fromIndex, index - 1)) + 1;
      }
      while (index--) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }

    /**
     * Removes all provided values from the given array using strict equality for
     * comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to modify.
     * @param {...*} [value] The values to remove.
     * @returns {Array} Returns `array`.
     * @example
     *
     * var array = [1, 2, 3, 1, 2, 3];
     * _.pull(array, 2, 3);
     * console.log(array);
     * // => [1, 1]
     */
    function pull(array) {
      var args = arguments,
          argsIndex = 0,
          argsLength = args.length,
          length = array ? array.length : 0;

      while (++argsIndex < argsLength) {
        var index = -1,
            value = args[argsIndex];
        while (++index < length) {
          if (array[index] === value) {
            splice.call(array, index--, 1);
            length--;
          }
        }
      }
      return array;
    }

    /**
     * Creates an array of numbers (positive and/or negative) progressing from
     * `start` up to but not including `end`. If `start` is less than `stop` a
     * zero-length range is created unless a negative `step` is specified.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {number} [start=0] The start of the range.
     * @param {number} end The end of the range.
     * @param {number} [step=1] The value to increment or decrement by.
     * @returns {Array} Returns a new range array.
     * @example
     *
     * _.range(4);
     * // => [0, 1, 2, 3]
     *
     * _.range(1, 5);
     * // => [1, 2, 3, 4]
     *
     * _.range(0, 20, 5);
     * // => [0, 5, 10, 15]
     *
     * _.range(0, -4, -1);
     * // => [0, -1, -2, -3]
     *
     * _.range(1, 4, 0);
     * // => [1, 1, 1]
     *
     * _.range(0);
     * // => []
     */
    function range(start, end, step) {
      start = +start || 0;
      step = typeof step == 'number' ? step : (+step || 1);

      if (end == null) {
        end = start;
        start = 0;
      }
      // use `Array(length)` so engines like Chakra and V8 avoid slower modes
      // http://youtu.be/XAqIpGU8ZZk#t=17m25s
      var index = -1,
          length = nativeMax(0, ceil((end - start) / (step || 1))),
          result = Array(length);

      while (++index < length) {
        result[index] = start;
        start += step;
      }
      return result;
    }

    /**
     * Removes all elements from an array that the callback returns truey for
     * and returns an array of removed elements. The callback is bound to `thisArg`
     * and invoked with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to modify.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a new array of removed elements.
     * @example
     *
     * var array = [1, 2, 3, 4, 5, 6];
     * var evens = _.remove(array, function(num) { return num % 2 == 0; });
     *
     * console.log(array);
     * // => [1, 3, 5]
     *
     * console.log(evens);
     * // => [2, 4, 6]
     */
    function remove(array, callback, thisArg) {
      var index = -1,
          length = array ? array.length : 0,
          result = [];

      callback = lodash.createCallback(callback, thisArg, 3);
      while (++index < length) {
        var value = array[index];
        if (callback(value, index, array)) {
          result.push(value);
          splice.call(array, index--, 1);
          length--;
        }
      }
      return result;
    }

    /**
     * The opposite of `_.initial` this method gets all but the first element or
     * first `n` elements of an array. If a callback function is provided elements
     * at the beginning of the array are excluded from the result as long as the
     * callback returns truey. The callback is bound to `thisArg` and invoked
     * with three arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias drop, tail
     * @category Arrays
     * @param {Array} array The array to query.
     * @param {Function|Object|number|string} [callback=1] The function called
     *  per element or the number of elements to exclude. If a property name or
     *  object is provided it will be used to create a "_.pluck" or "_.where"
     *  style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a slice of `array`.
     * @example
     *
     * _.rest([1, 2, 3]);
     * // => [2, 3]
     *
     * _.rest([1, 2, 3], 2);
     * // => [3]
     *
     * _.rest([1, 2, 3], function(num) {
     *   return num < 3;
     * });
     * // => [3]
     *
     * var characters = [
     *   { 'name': 'barney',  'blocked': true,  'employer': 'slate' },
     *   { 'name': 'fred',    'blocked': false,  'employer': 'slate' },
     *   { 'name': 'pebbles', 'blocked': true, 'employer': 'na' }
     * ];
     *
     * // using "_.pluck" callback shorthand
     * _.pluck(_.rest(characters, 'blocked'), 'name');
     * // => ['fred', 'pebbles']
     *
     * // using "_.where" callback shorthand
     * _.rest(characters, { 'employer': 'slate' });
     * // => [{ 'name': 'pebbles', 'blocked': true, 'employer': 'na' }]
     */
    function rest(array, callback, thisArg) {
      if (typeof callback != 'number' && callback != null) {
        var n = 0,
            index = -1,
            length = array ? array.length : 0;

        callback = lodash.createCallback(callback, thisArg, 3);
        while (++index < length && callback(array[index], index, array)) {
          n++;
        }
      } else {
        n = (callback == null || thisArg) ? 1 : nativeMax(0, callback);
      }
      return slice(array, n);
    }

    /**
     * Uses a binary search to determine the smallest index at which a value
     * should be inserted into a given sorted array in order to maintain the sort
     * order of the array. If a callback is provided it will be executed for
     * `value` and each element of `array` to compute their sort ranking. The
     * callback is bound to `thisArg` and invoked with one argument; (value).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to inspect.
     * @param {*} value The value to evaluate.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {number} Returns the index at which `value` should be inserted
     *  into `array`.
     * @example
     *
     * _.sortedIndex([20, 30, 50], 40);
     * // => 2
     *
     * // using "_.pluck" callback shorthand
     * _.sortedIndex([{ 'x': 20 }, { 'x': 30 }, { 'x': 50 }], { 'x': 40 }, 'x');
     * // => 2
     *
     * var dict = {
     *   'wordToNumber': { 'twenty': 20, 'thirty': 30, 'fourty': 40, 'fifty': 50 }
     * };
     *
     * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
     *   return dict.wordToNumber[word];
     * });
     * // => 2
     *
     * _.sortedIndex(['twenty', 'thirty', 'fifty'], 'fourty', function(word) {
     *   return this.wordToNumber[word];
     * }, dict);
     * // => 2
     */
    function sortedIndex(array, value, callback, thisArg) {
      var low = 0,
          high = array ? array.length : low;

      // explicitly reference `identity` for better inlining in Firefox
      callback = callback ? lodash.createCallback(callback, thisArg, 1) : identity;
      value = callback(value);

      while (low < high) {
        var mid = (low + high) >>> 1;
        (callback(array[mid]) < value)
          ? low = mid + 1
          : high = mid;
      }
      return low;
    }

    /**
     * Creates an array of unique values, in order, of the provided arrays using
     * strict equality for comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {...Array} [array] The arrays to inspect.
     * @returns {Array} Returns an array of combined values.
     * @example
     *
     * _.union([1, 2, 3], [5, 2, 1, 4], [2, 1]);
     * // => [1, 2, 3, 5, 4]
     */
    function union() {
      return baseUniq(baseFlatten(arguments, true, true));
    }

    /**
     * Creates a duplicate-value-free version of an array using strict equality
     * for comparisons, i.e. `===`. If the array is sorted, providing
     * `true` for `isSorted` will use a faster algorithm. If a callback is provided
     * each element of `array` is passed through the callback before uniqueness
     * is computed. The callback is bound to `thisArg` and invoked with three
     * arguments; (value, index, array).
     *
     * If a property name is provided for `callback` the created "_.pluck" style
     * callback will return the property value of the given element.
     *
     * If an object is provided for `callback` the created "_.where" style callback
     * will return `true` for elements that have the properties of the given object,
     * else `false`.
     *
     * @static
     * @memberOf _
     * @alias unique
     * @category Arrays
     * @param {Array} array The array to process.
     * @param {boolean} [isSorted=false] A flag to indicate that `array` is sorted.
     * @param {Function|Object|string} [callback=identity] The function called
     *  per iteration. If a property name or object is provided it will be used
     *  to create a "_.pluck" or "_.where" style callback, respectively.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns a duplicate-value-free array.
     * @example
     *
     * _.uniq([1, 2, 1, 3, 1]);
     * // => [1, 2, 3]
     *
     * _.uniq([1, 1, 2, 2, 3], true);
     * // => [1, 2, 3]
     *
     * _.uniq(['A', 'b', 'C', 'a', 'B', 'c'], function(letter) { return letter.toLowerCase(); });
     * // => ['A', 'b', 'C']
     *
     * _.uniq([1, 2.5, 3, 1.5, 2, 3.5], function(num) { return this.floor(num); }, Math);
     * // => [1, 2.5, 3]
     *
     * // using "_.pluck" callback shorthand
     * _.uniq([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
     * // => [{ 'x': 1 }, { 'x': 2 }]
     */
    function uniq(array, isSorted, callback, thisArg) {
      // juggle arguments
      if (typeof isSorted != 'boolean' && isSorted != null) {
        thisArg = callback;
        callback = (typeof isSorted != 'function' && thisArg && thisArg[isSorted] === array) ? null : isSorted;
        isSorted = false;
      }
      if (callback != null) {
        callback = lodash.createCallback(callback, thisArg, 3);
      }
      return baseUniq(array, isSorted, callback);
    }

    /**
     * Creates an array excluding all provided values using strict equality for
     * comparisons, i.e. `===`.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {Array} array The array to filter.
     * @param {...*} [value] The values to exclude.
     * @returns {Array} Returns a new array of filtered values.
     * @example
     *
     * _.without([1, 2, 1, 0, 3, 1, 4], 0, 1);
     * // => [2, 3, 4]
     */
    function without(array) {
      return baseDifference(array, slice(arguments, 1));
    }

    /**
     * Creates an array that is the symmetric difference of the provided arrays.
     * See http://en.wikipedia.org/wiki/Symmetric_difference.
     *
     * @static
     * @memberOf _
     * @category Arrays
     * @param {...Array} [array] The arrays to inspect.
     * @returns {Array} Returns an array of values.
     * @example
     *
     * _.xor([1, 2, 3], [5, 2, 1, 4]);
     * // => [3, 5, 4]
     *
     * _.xor([1, 2, 5], [2, 3, 5], [3, 4, 5]);
     * // => [1, 4, 5]
     */
    function xor() {
      var index = -1,
          length = arguments.length;

      while (++index < length) {
        var array = arguments[index];
        if (isArray(array) || isArguments(array)) {
          var result = result
            ? baseUniq(baseDifference(result, array).concat(baseDifference(array, result)))
            : array;
        }
      }
      return result || [];
    }

    /**
     * Creates an array of grouped elements, the first of which contains the first
     * elements of the given arrays, the second of which contains the second
     * elements of the given arrays, and so on.
     *
     * @static
     * @memberOf _
     * @alias unzip
     * @category Arrays
     * @param {...Array} [array] Arrays to process.
     * @returns {Array} Returns a new array of grouped elements.
     * @example
     *
     * _.zip(['fred', 'barney'], [30, 40], [true, false]);
     * // => [['fred', 30, true], ['barney', 40, false]]
     */
    function zip() {
      var array = arguments.length > 1 ? arguments : arguments[0],
          index = -1,
          length = array ? max(pluck(array, 'length')) : 0,
          result = Array(length < 0 ? 0 : length);

      while (++index < length) {
        result[index] = pluck(array, index);
      }
      return result;
    }

    /**
     * Creates an object composed from arrays of `keys` and `values`. Provide
     * either a single two dimensional array, i.e. `[[key1, value1], [key2, value2]]`
     * or two arrays, one of `keys` and one of corresponding `values`.
     *
     * @static
     * @memberOf _
     * @alias object
     * @category Arrays
     * @param {Array} keys The array of keys.
     * @param {Array} [values=[]] The array of values.
     * @returns {Object} Returns an object composed of the given keys and
     *  corresponding values.
     * @example
     *
     * _.zipObject(['fred', 'barney'], [30, 40]);
     * // => { 'fred': 30, 'barney': 40 }
     */
    function zipObject(keys, values) {
      var index = -1,
          length = keys ? keys.length : 0,
          result = {};

      if (!values && length && !isArray(keys[0])) {
        values = [];
      }
      while (++index < length) {
        var key = keys[index];
        if (values) {
          result[key] = values[index];
        } else if (key) {
          result[key[0]] = key[1];
        }
      }
      return result;
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a function that executes `func`, with  the `this` binding and
     * arguments of the created function, only after being called `n` times.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {number} n The number of times the function must be called before
     *  `func` is executed.
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var saves = ['profile', 'settings'];
     *
     * var done = _.after(saves.length, function() {
     *   console.log('Done saving!');
     * });
     *
     * _.forEach(saves, function(type) {
     *   asyncSave({ 'type': type, 'complete': done });
     * });
     * // => logs 'Done saving!', after all saves have completed
     */
    function after(n, func) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      return function() {
        if (--n < 1) {
          return func.apply(this, arguments);
        }
      };
    }

    /**
     * Creates a function that, when called, invokes `func` with the `this`
     * binding of `thisArg` and prepends any additional `bind` arguments to those
     * provided to the bound function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to bind.
     * @param {*} [thisArg] The `this` binding of `func`.
     * @param {...*} [arg] Arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var func = function(greeting) {
     *   return greeting + ' ' + this.name;
     * };
     *
     * func = _.bind(func, { 'name': 'fred' }, 'hi');
     * func();
     * // => 'hi fred'
     */
    function bind(func, thisArg) {
      return arguments.length > 2
        ? createWrapper(func, 17, slice(arguments, 2), null, thisArg)
        : createWrapper(func, 1, null, null, thisArg);
    }

    /**
     * Binds methods of an object to the object itself, overwriting the existing
     * method. Method names may be specified as individual arguments or as arrays
     * of method names. If no method names are provided all the function properties
     * of `object` will be bound.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Object} object The object to bind and assign the bound methods to.
     * @param {...string} [methodName] The object method names to
     *  bind, specified as individual method names or arrays of method names.
     * @returns {Object} Returns `object`.
     * @example
     *
     * var view = {
     *   'label': 'docs',
     *   'onClick': function() { console.log('clicked ' + this.label); }
     * };
     *
     * _.bindAll(view);
     * jQuery('#docs').on('click', view.onClick);
     * // => logs 'clicked docs', when the button is clicked
     */
    function bindAll(object) {
      var funcs = arguments.length > 1 ? baseFlatten(arguments, true, false, 1) : functions(object),
          index = -1,
          length = funcs.length;

      while (++index < length) {
        var key = funcs[index];
        object[key] = createWrapper(object[key], 1, null, null, object);
      }
      return object;
    }

    /**
     * Creates a function that, when called, invokes the method at `object[key]`
     * and prepends any additional `bindKey` arguments to those provided to the bound
     * function. This method differs from `_.bind` by allowing bound functions to
     * reference methods that will be redefined or don't yet exist.
     * See http://michaux.ca/articles/lazy-function-definition-pattern.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Object} object The object the method belongs to.
     * @param {string} key The key of the method.
     * @param {...*} [arg] Arguments to be partially applied.
     * @returns {Function} Returns the new bound function.
     * @example
     *
     * var object = {
     *   'name': 'fred',
     *   'greet': function(greeting) {
     *     return greeting + ' ' + this.name;
     *   }
     * };
     *
     * var func = _.bindKey(object, 'greet', 'hi');
     * func();
     * // => 'hi fred'
     *
     * object.greet = function(greeting) {
     *   return greeting + 'ya ' + this.name + '!';
     * };
     *
     * func();
     * // => 'hiya fred!'
     */
    function bindKey(object, key) {
      return arguments.length > 2
        ? createWrapper(key, 19, slice(arguments, 2), null, object)
        : createWrapper(key, 3, null, null, object);
    }

    /**
     * Creates a function that is the composition of the provided functions,
     * where each function consumes the return value of the function that follows.
     * For example, composing the functions `f()`, `g()`, and `h()` produces `f(g(h()))`.
     * Each function is executed with the `this` binding of the composed function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {...Function} [func] Functions to compose.
     * @returns {Function} Returns the new composed function.
     * @example
     *
     * var realNameMap = {
     *   'pebbles': 'penelope'
     * };
     *
     * var format = function(name) {
     *   name = realNameMap[name.toLowerCase()] || name;
     *   return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
     * };
     *
     * var greet = function(formatted) {
     *   return 'Hiya ' + formatted + '!';
     * };
     *
     * var welcome = _.compose(greet, format);
     * welcome('pebbles');
     * // => 'Hiya Penelope!'
     */
    function compose() {
      var funcs = arguments,
          length = funcs.length;

      while (length--) {
        if (!isFunction(funcs[length])) {
          throw new TypeError;
        }
      }
      return function() {
        var args = arguments,
            length = funcs.length;

        while (length--) {
          args = [funcs[length].apply(this, args)];
        }
        return args[0];
      };
    }

    /**
     * Creates a function which accepts one or more arguments of `func` that when
     * invoked either executes `func` returning its result, if all `func` arguments
     * have been provided, or returns a function that accepts one or more of the
     * remaining `func` arguments, and so on. The arity of `func` can be specified
     * if `func.length` is not sufficient.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to curry.
     * @param {number} [arity=func.length] The arity of `func`.
     * @returns {Function} Returns the new curried function.
     * @example
     *
     * var curried = _.curry(function(a, b, c) {
     *   console.log(a + b + c);
     * });
     *
     * curried(1)(2)(3);
     * // => 6
     *
     * curried(1, 2)(3);
     * // => 6
     *
     * curried(1, 2, 3);
     * // => 6
     */
    function curry(func, arity) {
      arity = typeof arity == 'number' ? arity : (+arity || func.length);
      return createWrapper(func, 4, null, null, null, arity);
    }

    /**
     * Creates a function that will delay the execution of `func` until after
     * `wait` milliseconds have elapsed since the last time it was invoked.
     * Provide an options object to indicate that `func` should be invoked on
     * the leading and/or trailing edge of the `wait` timeout. Subsequent calls
     * to the debounced function will return the result of the last `func` call.
     *
     * Note: If `leading` and `trailing` options are `true` `func` will be called
     * on the trailing edge of the timeout only if the the debounced function is
     * invoked more than once during the `wait` timeout.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to debounce.
     * @param {number} wait The number of milliseconds to delay.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=false] Specify execution on the leading edge of the timeout.
     * @param {number} [options.maxWait] The maximum time `func` is allowed to be delayed before it's called.
     * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
     * @returns {Function} Returns the new debounced function.
     * @example
     *
     * // avoid costly calculations while the window size is in flux
     * var lazyLayout = _.debounce(calculateLayout, 150);
     * jQuery(window).on('resize', lazyLayout);
     *
     * // execute `sendMail` when the click event is fired, debouncing subsequent calls
     * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
     *   'leading': true,
     *   'trailing': false
     * });
     *
     * // ensure `batchLog` is executed once after 1 second of debounced calls
     * var source = new EventSource('/stream');
     * source.addEventListener('message', _.debounce(batchLog, 250, {
     *   'maxWait': 1000
     * }, false);
     */
    function debounce(func, wait, options) {
      var args,
          maxTimeoutId,
          result,
          stamp,
          thisArg,
          timeoutId,
          trailingCall,
          lastCalled = 0,
          maxWait = false,
          trailing = true;

      if (!isFunction(func)) {
        throw new TypeError;
      }
      wait = nativeMax(0, wait) || 0;
      if (options === true) {
        var leading = true;
        trailing = false;
      } else if (isObject(options)) {
        leading = options.leading;
        maxWait = 'maxWait' in options && (nativeMax(wait, options.maxWait) || 0);
        trailing = 'trailing' in options ? options.trailing : trailing;
      }
      var delayed = function() {
        var remaining = wait - (now() - stamp);
        if (remaining <= 0) {
          if (maxTimeoutId) {
            clearTimeout(maxTimeoutId);
          }
          var isCalled = trailingCall;
          maxTimeoutId = timeoutId = trailingCall = undefined;
          if (isCalled) {
            lastCalled = now();
            result = func.apply(thisArg, args);
            if (!timeoutId && !maxTimeoutId) {
              args = thisArg = null;
            }
          }
        } else {
          timeoutId = setTimeout(delayed, remaining);
        }
      };

      var maxDelayed = function() {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        maxTimeoutId = timeoutId = trailingCall = undefined;
        if (trailing || (maxWait !== wait)) {
          lastCalled = now();
          result = func.apply(thisArg, args);
          if (!timeoutId && !maxTimeoutId) {
            args = thisArg = null;
          }
        }
      };

      return function() {
        args = arguments;
        stamp = now();
        thisArg = this;
        trailingCall = trailing && (timeoutId || !leading);

        if (maxWait === false) {
          var leadingCall = leading && !timeoutId;
        } else {
          if (!maxTimeoutId && !leading) {
            lastCalled = stamp;
          }
          var remaining = maxWait - (stamp - lastCalled),
              isCalled = remaining <= 0;

          if (isCalled) {
            if (maxTimeoutId) {
              maxTimeoutId = clearTimeout(maxTimeoutId);
            }
            lastCalled = stamp;
            result = func.apply(thisArg, args);
          }
          else if (!maxTimeoutId) {
            maxTimeoutId = setTimeout(maxDelayed, remaining);
          }
        }
        if (isCalled && timeoutId) {
          timeoutId = clearTimeout(timeoutId);
        }
        else if (!timeoutId && wait !== maxWait) {
          timeoutId = setTimeout(delayed, wait);
        }
        if (leadingCall) {
          isCalled = true;
          result = func.apply(thisArg, args);
        }
        if (isCalled && !timeoutId && !maxTimeoutId) {
          args = thisArg = null;
        }
        return result;
      };
    }

    /**
     * Defers executing the `func` function until the current call stack has cleared.
     * Additional arguments will be provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to defer.
     * @param {...*} [arg] Arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.defer(function(text) { console.log(text); }, 'deferred');
     * // logs 'deferred' after one or more milliseconds
     */
    function defer(func) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      var args = slice(arguments, 1);
      return setTimeout(function() { func.apply(undefined, args); }, 1);
    }

    /**
     * Executes the `func` function after `wait` milliseconds. Additional arguments
     * will be provided to `func` when it is invoked.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to delay.
     * @param {number} wait The number of milliseconds to delay execution.
     * @param {...*} [arg] Arguments to invoke the function with.
     * @returns {number} Returns the timer id.
     * @example
     *
     * _.delay(function(text) { console.log(text); }, 1000, 'later');
     * // => logs 'later' after one second
     */
    function delay(func, wait) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      var args = slice(arguments, 2);
      return setTimeout(function() { func.apply(undefined, args); }, wait);
    }

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided it will be used to determine the cache key for storing the result
     * based on the arguments provided to the memoized function. By default, the
     * first argument provided to the memoized function is used as the cache key.
     * The `func` is executed with the `this` binding of the memoized function.
     * The result cache is exposed as the `cache` property on the memoized function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] A function used to resolve the cache key.
     * @returns {Function} Returns the new memoizing function.
     * @example
     *
     * var fibonacci = _.memoize(function(n) {
     *   return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
     * });
     *
     * fibonacci(9)
     * // => 34
     *
     * var data = {
     *   'fred': { 'name': 'fred', 'age': 40 },
     *   'pebbles': { 'name': 'pebbles', 'age': 1 }
     * };
     *
     * // modifying the result cache
     * var get = _.memoize(function(name) { return data[name]; }, _.identity);
     * get('pebbles');
     * // => { 'name': 'pebbles', 'age': 1 }
     *
     * get.cache.pebbles.name = 'penelope';
     * get('pebbles');
     * // => { 'name': 'penelope', 'age': 1 }
     */
    function memoize(func, resolver) {
      if (!isFunction(func)) {
        throw new TypeError;
      }
      var memoized = function() {
        var cache = memoized.cache,
            key = resolver ? resolver.apply(this, arguments) : keyPrefix + arguments[0];

        return hasOwnProperty.call(cache, key)
          ? cache[key]
          : (cache[key] = func.apply(this, arguments));
      }
      memoized.cache = {};
      return memoized;
    }

    /**
     * Creates a function that is restricted to execute `func` once. Repeat calls to
     * the function will return the value of the first call. The `func` is executed
     * with the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to restrict.
     * @returns {Function} Returns the new restricted function.
     * @example
     *
     * var initialize = _.once(createApplication);
     * initialize();
     * initialize();
     * // `initialize` executes `createApplication` once
     */
    function once(func) {
      var ran,
          result;

      if (!isFunction(func)) {
        throw new TypeError;
      }
      return function() {
        if (ran) {
          return result;
        }
        ran = true;
        result = func.apply(this, arguments);

        // clear the `func` variable so the function may be garbage collected
        func = null;
        return result;
      };
    }

    /**
     * Creates a function that, when called, invokes `func` with any additional
     * `partial` arguments prepended to those provided to the new function. This
     * method is similar to `_.bind` except it does **not** alter the `this` binding.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [arg] Arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var greet = function(greeting, name) { return greeting + ' ' + name; };
     * var hi = _.partial(greet, 'hi');
     * hi('fred');
     * // => 'hi fred'
     */
    function partial(func) {
      return createWrapper(func, 16, slice(arguments, 1));
    }

    /**
     * This method is like `_.partial` except that `partial` arguments are
     * appended to those provided to the new function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to partially apply arguments to.
     * @param {...*} [arg] Arguments to be partially applied.
     * @returns {Function} Returns the new partially applied function.
     * @example
     *
     * var defaultsDeep = _.partialRight(_.merge, _.defaults);
     *
     * var options = {
     *   'variable': 'data',
     *   'imports': { 'jq': $ }
     * };
     *
     * defaultsDeep(options, _.templateSettings);
     *
     * options.variable
     * // => 'data'
     *
     * options.imports
     * // => { '_': _, 'jq': $ }
     */
    function partialRight(func) {
      return createWrapper(func, 32, null, slice(arguments, 1));
    }

    /**
     * Creates a function that, when executed, will only call the `func` function
     * at most once per every `wait` milliseconds. Provide an options object to
     * indicate that `func` should be invoked on the leading and/or trailing edge
     * of the `wait` timeout. Subsequent calls to the throttled function will
     * return the result of the last `func` call.
     *
     * Note: If `leading` and `trailing` options are `true` `func` will be called
     * on the trailing edge of the timeout only if the the throttled function is
     * invoked more than once during the `wait` timeout.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {Function} func The function to throttle.
     * @param {number} wait The number of milliseconds to throttle executions to.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.leading=true] Specify execution on the leading edge of the timeout.
     * @param {boolean} [options.trailing=true] Specify execution on the trailing edge of the timeout.
     * @returns {Function} Returns the new throttled function.
     * @example
     *
     * // avoid excessively updating the position while scrolling
     * var throttled = _.throttle(updatePosition, 100);
     * jQuery(window).on('scroll', throttled);
     *
     * // execute `renewToken` when the click event is fired, but not more than once every 5 minutes
     * jQuery('.interactive').on('click', _.throttle(renewToken, 300000, {
     *   'trailing': false
     * }));
     */
    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (!isFunction(func)) {
        throw new TypeError;
      }
      if (options === false) {
        leading = false;
      } else if (isObject(options)) {
        leading = 'leading' in options ? options.leading : leading;
        trailing = 'trailing' in options ? options.trailing : trailing;
      }
      debounceOptions.leading = leading;
      debounceOptions.maxWait = wait;
      debounceOptions.trailing = trailing;

      return debounce(func, wait, debounceOptions);
    }

    /**
     * Creates a function that provides `value` to the wrapper function as its
     * first argument. Additional arguments provided to the function are appended
     * to those provided to the wrapper function. The wrapper is executed with
     * the `this` binding of the created function.
     *
     * @static
     * @memberOf _
     * @category Functions
     * @param {*} value The value to wrap.
     * @param {Function} wrapper The wrapper function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var p = _.wrap(_.escape, function(func, text) {
     *   return '<p>' + func(text) + '</p>';
     * });
     *
     * p('Fred, Wilma, & Pebbles');
     * // => '<p>Fred, Wilma, &amp; Pebbles</p>'
     */
    function wrap(value, wrapper) {
      return createWrapper(wrapper, 16, [value]);
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a function that returns `value`.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {*} value The value to return from the new function.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var object = { 'name': 'fred' };
     * var getter = _.constant(object);
     * getter() === object;
     * // => true
     */
    function constant(value) {
      return function() {
        return value;
      };
    }

    /**
     * Produces a callback bound to an optional `thisArg`. If `func` is a property
     * name the created callback will return the property value for a given element.
     * If `func` is an object the created callback will return `true` for elements
     * that contain the equivalent object properties, otherwise it will return `false`.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {*} [func=identity] The value to convert to a callback.
     * @param {*} [thisArg] The `this` binding of the created callback.
     * @param {number} [argCount] The number of arguments the callback accepts.
     * @returns {Function} Returns a callback function.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * // wrap to create custom callback shorthands
     * _.createCallback = _.wrap(_.createCallback, function(func, callback, thisArg) {
     *   var match = /^(.+?)__([gl]t)(.+)$/.exec(callback);
     *   return !match ? func(callback, thisArg) : function(object) {
     *     return match[2] == 'gt' ? object[match[1]] > match[3] : object[match[1]] < match[3];
     *   };
     * });
     *
     * _.filter(characters, 'age__gt38');
     * // => [{ 'name': 'fred', 'age': 40 }]
     */
    function createCallback(func, thisArg, argCount) {
      var type = typeof func;
      if (func == null || type == 'function') {
        return baseCreateCallback(func, thisArg, argCount);
      }
      // handle "_.pluck" style callback shorthands
      if (type != 'object') {
        return property(func);
      }
      var props = keys(func),
          key = props[0],
          a = func[key];

      // handle "_.where" style callback shorthands
      if (props.length == 1 && a === a && !isObject(a)) {
        // fast path the common case of providing an object with a single
        // property containing a primitive value
        return function(object) {
          var b = object[key];
          return a === b && (a !== 0 || (1 / a == 1 / b));
        };
      }
      return function(object) {
        var length = props.length,
            result = false;

        while (length--) {
          if (!(result = baseIsEqual(object[props[length]], func[props[length]], null, true))) {
            break;
          }
        }
        return result;
      };
    }

    /**
     * Converts the characters `&`, `<`, `>`, `"`, and `'` in `string` to their
     * corresponding HTML entities.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} string The string to escape.
     * @returns {string} Returns the escaped string.
     * @example
     *
     * _.escape('Fred, Wilma, & Pebbles');
     * // => 'Fred, Wilma, &amp; Pebbles'
     */
    function escape(string) {
      return string == null ? '' : String(string).replace(reUnescapedHtml, escapeHtmlChar);
    }

    /**
     * This method returns the first argument provided to it.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {*} value Any value.
     * @returns {*} Returns `value`.
     * @example
     *
     * var object = { 'name': 'fred' };
     * _.identity(object) === object;
     * // => true
     */
    function identity(value) {
      return value;
    }

    /**
     * Adds function properties of a source object to the destination object.
     * If `object` is a function methods will be added to its prototype as well.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {Function|Object} [object=lodash] object The destination object.
     * @param {Object} source The object of functions to add.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.chain=true] Specify whether the functions added are chainable.
     * @example
     *
     * function capitalize(string) {
     *   return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
     * }
     *
     * _.mixin({ 'capitalize': capitalize });
     * _.capitalize('fred');
     * // => 'Fred'
     *
     * _('fred').capitalize().value();
     * // => 'Fred'
     *
     * _.mixin({ 'capitalize': capitalize }, { 'chain': false });
     * _('fred').capitalize();
     * // => 'Fred'
     */
    function mixin(object, source, options) {
      var chain = true,
          methodNames = source && functions(source);

      if (!source || (!options && !methodNames.length)) {
        if (options == null) {
          options = source;
        }
        ctor = lodashWrapper;
        source = object;
        object = lodash;
        methodNames = functions(source);
      }
      if (options === false) {
        chain = false;
      } else if (isObject(options) && 'chain' in options) {
        chain = options.chain;
      }
      var ctor = object,
          isFunc = isFunction(ctor);

      forEach(methodNames, function(methodName) {
        var func = object[methodName] = source[methodName];
        if (isFunc) {
          ctor.prototype[methodName] = function() {
            var chainAll = this.__chain__,
                value = this.__wrapped__,
                args = [value];

            push.apply(args, arguments);
            var result = func.apply(object, args);
            if (chain || chainAll) {
              if (value === result && isObject(result)) {
                return this;
              }
              result = new ctor(result);
              result.__chain__ = chainAll;
            }
            return result;
          };
        }
      });
    }

    /**
     * Reverts the '_' variable to its previous value and returns a reference to
     * the `lodash` function.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @returns {Function} Returns the `lodash` function.
     * @example
     *
     * var lodash = _.noConflict();
     */
    function noConflict() {
      context._ = oldDash;
      return this;
    }

    /**
     * A no-operation function.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @example
     *
     * var object = { 'name': 'fred' };
     * _.noop(object) === undefined;
     * // => true
     */
    function noop() {
      // no operation performed
    }

    /**
     * Gets the number of milliseconds that have elapsed since the Unix epoch
     * (1 January 1970 00:00:00 UTC).
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @example
     *
     * var stamp = _.now();
     * _.defer(function() { console.log(_.now() - stamp); });
     * // => logs the number of milliseconds it took for the deferred function to be called
     */
    var now = isNative(now = Date.now) && now || function() {
      return new Date().getTime();
    };

    /**
     * Converts the given value into an integer of the specified radix.
     * If `radix` is `undefined` or `0` a `radix` of `10` is used unless the
     * `value` is a hexadecimal, in which case a `radix` of `16` is used.
     *
     * Note: This method avoids differences in native ES3 and ES5 `parseInt`
     * implementations. See http://es5.github.io/#E.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} value The value to parse.
     * @param {number} [radix] The radix used to interpret the value to parse.
     * @returns {number} Returns the new integer value.
     * @example
     *
     * _.parseInt('08');
     * // => 8
     */
    var parseInt = nativeParseInt(whitespace + '08') == 8 ? nativeParseInt : function(value, radix) {
      // Firefox < 21 and Opera < 15 follow the ES3 specified implementation of `parseInt`
      return nativeParseInt(isString(value) ? value.replace(reLeadingSpacesAndZeros, '') : value, radix || 0);
    };

    /**
     * Creates a "_.pluck" style function, which returns the `key` value of a
     * given object.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} key The name of the property to retrieve.
     * @returns {Function} Returns the new function.
     * @example
     *
     * var characters = [
     *   { 'name': 'fred',   'age': 40 },
     *   { 'name': 'barney', 'age': 36 }
     * ];
     *
     * var getName = _.property('name');
     *
     * _.map(characters, getName);
     * // => ['barney', 'fred']
     *
     * _.sortBy(characters, getName);
     * // => [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred',   'age': 40 }]
     */
    function property(key) {
      return function(object) {
        return object[key];
      };
    }

    /**
     * Produces a random number between `min` and `max` (inclusive). If only one
     * argument is provided a number between `0` and the given number will be
     * returned. If `floating` is truey or either `min` or `max` are floats a
     * floating-point number will be returned instead of an integer.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {number} [min=0] The minimum possible value.
     * @param {number} [max=1] The maximum possible value.
     * @param {boolean} [floating=false] Specify returning a floating-point number.
     * @returns {number} Returns a random number.
     * @example
     *
     * _.random(0, 5);
     * // => an integer between 0 and 5
     *
     * _.random(5);
     * // => also an integer between 0 and 5
     *
     * _.random(5, true);
     * // => a floating-point number between 0 and 5
     *
     * _.random(1.2, 5.2);
     * // => a floating-point number between 1.2 and 5.2
     */
    function random(min, max, floating) {
      var noMin = min == null,
          noMax = max == null;

      if (floating == null) {
        if (typeof min == 'boolean' && noMax) {
          floating = min;
          min = 1;
        }
        else if (!noMax && typeof max == 'boolean') {
          floating = max;
          noMax = true;
        }
      }
      if (noMin && noMax) {
        max = 1;
      }
      min = +min || 0;
      if (noMax) {
        max = min;
        min = 0;
      } else {
        max = +max || 0;
      }
      if (floating || min % 1 || max % 1) {
        var rand = nativeRandom();
        return nativeMin(min + (rand * (max - min + parseFloat('1e-' + ((rand +'').length - 1)))), max);
      }
      return baseRandom(min, max);
    }

    /**
     * Resolves the value of property `key` on `object`. If `key` is a function
     * it will be invoked with the `this` binding of `object` and its result returned,
     * else the property value is returned. If `object` is falsey then `undefined`
     * is returned.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {Object} object The object to inspect.
     * @param {string} key The name of the property to resolve.
     * @returns {*} Returns the resolved value.
     * @example
     *
     * var object = {
     *   'cheese': 'crumpets',
     *   'stuff': function() {
     *     return 'nonsense';
     *   }
     * };
     *
     * _.result(object, 'cheese');
     * // => 'crumpets'
     *
     * _.result(object, 'stuff');
     * // => 'nonsense'
     */
    function result(object, key) {
      if (object) {
        var value = object[key];
        return isFunction(value) ? object[key]() : value;
      }
    }

    /**
     * A micro-templating method that handles arbitrary delimiters, preserves
     * whitespace, and correctly escapes quotes within interpolated code.
     *
     * Note: In the development build, `_.template` utilizes sourceURLs for easier
     * debugging. See http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
     *
     * For more information on precompiling templates see:
     * http://lodash.com/custom-builds
     *
     * For more information on Chrome extension sandboxes see:
     * http://developer.chrome.com/stable/extensions/sandboxingEval.html
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} text The template text.
     * @param {Object} data The data object used to populate the text.
     * @param {Object} [options] The options object.
     * @param {RegExp} [options.escape] The "escape" delimiter.
     * @param {RegExp} [options.evaluate] The "evaluate" delimiter.
     * @param {Object} [options.imports] An object to import into the template as local variables.
     * @param {RegExp} [options.interpolate] The "interpolate" delimiter.
     * @param {string} [sourceURL] The sourceURL of the template's compiled source.
     * @param {string} [variable] The data object variable name.
     * @returns {Function|string} Returns a compiled function when no `data` object
     *  is given, else it returns the interpolated text.
     * @example
     *
     * // using the "interpolate" delimiter to create a compiled template
     * var compiled = _.template('hello <%= name %>');
     * compiled({ 'name': 'fred' });
     * // => 'hello fred'
     *
     * // using the "escape" delimiter to escape HTML in data property values
     * _.template('<b><%- value %></b>', { 'value': '<script>' });
     * // => '<b>&lt;script&gt;</b>'
     *
     * // using the "evaluate" delimiter to generate HTML
     * var list = '<% _.forEach(people, function(name) { %><li><%- name %></li><% }); %>';
     * _.template(list, { 'people': ['fred', 'barney'] });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the ES6 delimiter as an alternative to the default "interpolate" delimiter
     * _.template('hello ${ name }', { 'name': 'pebbles' });
     * // => 'hello pebbles'
     *
     * // using the internal `print` function in "evaluate" delimiters
     * _.template('<% print("hello " + name); %>!', { 'name': 'barney' });
     * // => 'hello barney!'
     *
     * // using a custom template delimiters
     * _.templateSettings = {
     *   'interpolate': /{{([\s\S]+?)}}/g
     * };
     *
     * _.template('hello {{ name }}!', { 'name': 'mustache' });
     * // => 'hello mustache!'
     *
     * // using the `imports` option to import jQuery
     * var list = '<% jq.each(people, function(name) { %><li><%- name %></li><% }); %>';
     * _.template(list, { 'people': ['fred', 'barney'] }, { 'imports': { 'jq': jQuery } });
     * // => '<li>fred</li><li>barney</li>'
     *
     * // using the `sourceURL` option to specify a custom sourceURL for the template
     * var compiled = _.template('hello <%= name %>', null, { 'sourceURL': '/basic/greeting.jst' });
     * compiled(data);
     * // => find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector
     *
     * // using the `variable` option to ensure a with-statement isn't used in the compiled template
     * var compiled = _.template('hi <%= data.name %>!', null, { 'variable': 'data' });
     * compiled.source;
     * // => function(data) {
     *   var __t, __p = '', __e = _.escape;
     *   __p += 'hi ' + ((__t = ( data.name )) == null ? '' : __t) + '!';
     *   return __p;
     * }
     *
     * // using the `source` property to inline compiled templates for meaningful
     * // line numbers in error messages and a stack trace
     * fs.writeFileSync(path.join(cwd, 'jst.js'), '\
     *   var JST = {\
     *     "main": ' + _.template(mainText).source + '\
     *   };\
     * ');
     */
    function template(text, data, options) {
      // based on John Resig's `tmpl` implementation
      // http://ejohn.org/blog/javascript-micro-templating/
      // and Laura Doktorova's doT.js
      // https://github.com/olado/doT
      var settings = lodash.templateSettings;
      text = String(text || '');

      // avoid missing dependencies when `iteratorTemplate` is not defined
      options = defaults({}, options, settings);

      var imports = defaults({}, options.imports, settings.imports),
          importsKeys = keys(imports),
          importsValues = values(imports);

      var isEvaluating,
          index = 0,
          interpolate = options.interpolate || reNoMatch,
          source = "__p += '";

      // compile the regexp to match each delimiter
      var reDelimiters = RegExp(
        (options.escape || reNoMatch).source + '|' +
        interpolate.source + '|' +
        (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' +
        (options.evaluate || reNoMatch).source + '|$'
      , 'g');

      text.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
        interpolateValue || (interpolateValue = esTemplateValue);

        // escape characters that cannot be included in string literals
        source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar);

        // replace delimiters with snippets
        if (escapeValue) {
          source += "' +\n__e(" + escapeValue + ") +\n'";
        }
        if (evaluateValue) {
          isEvaluating = true;
          source += "';\n" + evaluateValue + ";\n__p += '";
        }
        if (interpolateValue) {
          source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
        }
        index = offset + match.length;

        // the JS engine embedded in Adobe products requires returning the `match`
        // string in order to produce the correct `offset` value
        return match;
      });

      source += "';\n";

      // if `variable` is not specified, wrap a with-statement around the generated
      // code to add the data object to the top of the scope chain
      var variable = options.variable,
          hasVariable = variable;

      if (!hasVariable) {
        variable = 'obj';
        source = 'with (' + variable + ') {\n' + source + '\n}\n';
      }
      // cleanup code by stripping empty strings
      source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
        .replace(reEmptyStringMiddle, '$1')
        .replace(reEmptyStringTrailing, '$1;');

      // frame code as the function body
      source = 'function(' + variable + ') {\n' +
        (hasVariable ? '' : variable + ' || (' + variable + ' = {});\n') +
        "var __t, __p = '', __e = _.escape" +
        (isEvaluating
          ? ', __j = Array.prototype.join;\n' +
            "function print() { __p += __j.call(arguments, '') }\n"
          : ';\n'
        ) +
        source +
        'return __p\n}';

      // Use a sourceURL for easier debugging.
      // http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl
      var sourceURL = '\n/*\n//# sourceURL=' + (options.sourceURL || '/lodash/template/source[' + (templateCounter++) + ']') + '\n*/';

      try {
        var result = Function(importsKeys, 'return ' + source + sourceURL).apply(undefined, importsValues);
      } catch(e) {
        e.source = source;
        throw e;
      }
      if (data) {
        return result(data);
      }
      // provide the compiled function's source by its `toString` method, in
      // supported environments, or the `source` property as a convenience for
      // inlining compiled templates during the build process
      result.source = source;
      return result;
    }

    /**
     * Executes the callback `n` times, returning an array of the results
     * of each callback execution. The callback is bound to `thisArg` and invoked
     * with one argument; (index).
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {number} n The number of times to execute the callback.
     * @param {Function} callback The function called per iteration.
     * @param {*} [thisArg] The `this` binding of `callback`.
     * @returns {Array} Returns an array of the results of each `callback` execution.
     * @example
     *
     * var diceRolls = _.times(3, _.partial(_.random, 1, 6));
     * // => [3, 6, 4]
     *
     * _.times(3, function(n) { mage.castSpell(n); });
     * // => calls `mage.castSpell(n)` three times, passing `n` of `0`, `1`, and `2` respectively
     *
     * _.times(3, function(n) { this.cast(n); }, mage);
     * // => also calls `mage.castSpell(n)` three times
     */
    function times(n, callback, thisArg) {
      n = (n = +n) > -1 ? n : 0;
      var index = -1,
          result = Array(n);

      callback = baseCreateCallback(callback, thisArg, 1);
      while (++index < n) {
        result[index] = callback(index);
      }
      return result;
    }

    /**
     * The inverse of `_.escape` this method converts the HTML entities
     * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to their
     * corresponding characters.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} string The string to unescape.
     * @returns {string} Returns the unescaped string.
     * @example
     *
     * _.unescape('Fred, Barney &amp; Pebbles');
     * // => 'Fred, Barney & Pebbles'
     */
    function unescape(string) {
      return string == null ? '' : String(string).replace(reEscapedHtml, unescapeHtmlChar);
    }

    /**
     * Generates a unique ID. If `prefix` is provided the ID will be appended to it.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {string} [prefix] The value to prefix the ID with.
     * @returns {string} Returns the unique ID.
     * @example
     *
     * _.uniqueId('contact_');
     * // => 'contact_104'
     *
     * _.uniqueId();
     * // => '105'
     */
    function uniqueId(prefix) {
      var id = ++idCounter;
      return String(prefix == null ? '' : prefix) + id;
    }

    /*--------------------------------------------------------------------------*/

    /**
     * Creates a `lodash` object that wraps the given value with explicit
     * method chaining enabled.
     *
     * @static
     * @memberOf _
     * @category Chaining
     * @param {*} value The value to wrap.
     * @returns {Object} Returns the wrapper object.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney',  'age': 36 },
     *   { 'name': 'fred',    'age': 40 },
     *   { 'name': 'pebbles', 'age': 1 }
     * ];
     *
     * var youngest = _.chain(characters)
     *     .sortBy('age')
     *     .map(function(chr) { return chr.name + ' is ' + chr.age; })
     *     .first()
     *     .value();
     * // => 'pebbles is 1'
     */
    function chain(value) {
      value = new lodashWrapper(value);
      value.__chain__ = true;
      return value;
    }

    /**
     * Invokes `interceptor` with the `value` as the first argument and then
     * returns `value`. The purpose of this method is to "tap into" a method
     * chain in order to perform operations on intermediate results within
     * the chain.
     *
     * @static
     * @memberOf _
     * @category Chaining
     * @param {*} value The value to provide to `interceptor`.
     * @param {Function} interceptor The function to invoke.
     * @returns {*} Returns `value`.
     * @example
     *
     * _([1, 2, 3, 4])
     *  .tap(function(array) { array.pop(); })
     *  .reverse()
     *  .value();
     * // => [3, 2, 1]
     */
    function tap(value, interceptor) {
      interceptor(value);
      return value;
    }

    /**
     * Enables explicit method chaining on the wrapper object.
     *
     * @name chain
     * @memberOf _
     * @category Chaining
     * @returns {*} Returns the wrapper object.
     * @example
     *
     * var characters = [
     *   { 'name': 'barney', 'age': 36 },
     *   { 'name': 'fred',   'age': 40 }
     * ];
     *
     * // without explicit chaining
     * _(characters).first();
     * // => { 'name': 'barney', 'age': 36 }
     *
     * // with explicit chaining
     * _(characters).chain()
     *   .first()
     *   .pick('age')
     *   .value();
     * // => { 'age': 36 }
     */
    function wrapperChain() {
      this.__chain__ = true;
      return this;
    }

    /**
     * Produces the `toString` result of the wrapped value.
     *
     * @name toString
     * @memberOf _
     * @category Chaining
     * @returns {string} Returns the string result.
     * @example
     *
     * _([1, 2, 3]).toString();
     * // => '1,2,3'
     */
    function wrapperToString() {
      return String(this.__wrapped__);
    }

    /**
     * Extracts the wrapped value.
     *
     * @name valueOf
     * @memberOf _
     * @alias value
     * @category Chaining
     * @returns {*} Returns the wrapped value.
     * @example
     *
     * _([1, 2, 3]).valueOf();
     * // => [1, 2, 3]
     */
    function wrapperValueOf() {
      return this.__wrapped__;
    }

    /*--------------------------------------------------------------------------*/

    // add functions that return wrapped values when chaining
    lodash.after = after;
    lodash.assign = assign;
    lodash.at = at;
    lodash.bind = bind;
    lodash.bindAll = bindAll;
    lodash.bindKey = bindKey;
    lodash.chain = chain;
    lodash.compact = compact;
    lodash.compose = compose;
    lodash.constant = constant;
    lodash.countBy = countBy;
    lodash.create = create;
    lodash.createCallback = createCallback;
    lodash.curry = curry;
    lodash.debounce = debounce;
    lodash.defaults = defaults;
    lodash.defer = defer;
    lodash.delay = delay;
    lodash.difference = difference;
    lodash.filter = filter;
    lodash.flatten = flatten;
    lodash.forEach = forEach;
    lodash.forEachRight = forEachRight;
    lodash.forIn = forIn;
    lodash.forInRight = forInRight;
    lodash.forOwn = forOwn;
    lodash.forOwnRight = forOwnRight;
    lodash.functions = functions;
    lodash.groupBy = groupBy;
    lodash.indexBy = indexBy;
    lodash.initial = initial;
    lodash.intersection = intersection;
    lodash.invert = invert;
    lodash.invoke = invoke;
    lodash.keys = keys;
    lodash.map = map;
    lodash.mapValues = mapValues;
    lodash.max = max;
    lodash.memoize = memoize;
    lodash.merge = merge;
    lodash.min = min;
    lodash.omit = omit;
    lodash.once = once;
    lodash.pairs = pairs;
    lodash.partial = partial;
    lodash.partialRight = partialRight;
    lodash.pick = pick;
    lodash.pluck = pluck;
    lodash.property = property;
    lodash.pull = pull;
    lodash.range = range;
    lodash.reject = reject;
    lodash.remove = remove;
    lodash.rest = rest;
    lodash.shuffle = shuffle;
    lodash.sortBy = sortBy;
    lodash.tap = tap;
    lodash.throttle = throttle;
    lodash.times = times;
    lodash.toArray = toArray;
    lodash.transform = transform;
    lodash.union = union;
    lodash.uniq = uniq;
    lodash.values = values;
    lodash.where = where;
    lodash.without = without;
    lodash.wrap = wrap;
    lodash.xor = xor;
    lodash.zip = zip;
    lodash.zipObject = zipObject;

    // add aliases
    lodash.collect = map;
    lodash.drop = rest;
    lodash.each = forEach;
    lodash.eachRight = forEachRight;
    lodash.extend = assign;
    lodash.methods = functions;
    lodash.object = zipObject;
    lodash.select = filter;
    lodash.tail = rest;
    lodash.unique = uniq;
    lodash.unzip = zip;

    // add functions to `lodash.prototype`
    mixin(lodash);

    /*--------------------------------------------------------------------------*/

    // add functions that return unwrapped values when chaining
    lodash.clone = clone;
    lodash.cloneDeep = cloneDeep;
    lodash.contains = contains;
    lodash.escape = escape;
    lodash.every = every;
    lodash.find = find;
    lodash.findIndex = findIndex;
    lodash.findKey = findKey;
    lodash.findLast = findLast;
    lodash.findLastIndex = findLastIndex;
    lodash.findLastKey = findLastKey;
    lodash.has = has;
    lodash.identity = identity;
    lodash.indexOf = indexOf;
    lodash.isArguments = isArguments;
    lodash.isArray = isArray;
    lodash.isBoolean = isBoolean;
    lodash.isDate = isDate;
    lodash.isElement = isElement;
    lodash.isEmpty = isEmpty;
    lodash.isEqual = isEqual;
    lodash.isFinite = isFinite;
    lodash.isFunction = isFunction;
    lodash.isNaN = isNaN;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isPlainObject = isPlainObject;
    lodash.isRegExp = isRegExp;
    lodash.isString = isString;
    lodash.isUndefined = isUndefined;
    lodash.lastIndexOf = lastIndexOf;
    lodash.mixin = mixin;
    lodash.noConflict = noConflict;
    lodash.noop = noop;
    lodash.now = now;
    lodash.parseInt = parseInt;
    lodash.random = random;
    lodash.reduce = reduce;
    lodash.reduceRight = reduceRight;
    lodash.result = result;
    lodash.runInContext = runInContext;
    lodash.size = size;
    lodash.some = some;
    lodash.sortedIndex = sortedIndex;
    lodash.template = template;
    lodash.unescape = unescape;
    lodash.uniqueId = uniqueId;

    // add aliases
    lodash.all = every;
    lodash.any = some;
    lodash.detect = find;
    lodash.findWhere = find;
    lodash.foldl = reduce;
    lodash.foldr = reduceRight;
    lodash.include = contains;
    lodash.inject = reduce;

    mixin(function() {
      var source = {}
      forOwn(lodash, function(func, methodName) {
        if (!lodash.prototype[methodName]) {
          source[methodName] = func;
        }
      });
      return source;
    }(), false);

    /*--------------------------------------------------------------------------*/

    // add functions capable of returning wrapped and unwrapped values when chaining
    lodash.first = first;
    lodash.last = last;
    lodash.sample = sample;

    // add aliases
    lodash.take = first;
    lodash.head = first;

    forOwn(lodash, function(func, methodName) {
      var callbackable = methodName !== 'sample';
      if (!lodash.prototype[methodName]) {
        lodash.prototype[methodName]= function(n, guard) {
          var chainAll = this.__chain__,
              result = func(this.__wrapped__, n, guard);

          return !chainAll && (n == null || (guard && !(callbackable && typeof n == 'function')))
            ? result
            : new lodashWrapper(result, chainAll);
        };
      }
    });

    /*--------------------------------------------------------------------------*/

    /**
     * The semantic version number.
     *
     * @static
     * @memberOf _
     * @type string
     */
    lodash.VERSION = '2.4.1';

    // add "Chaining" functions to the wrapper
    lodash.prototype.chain = wrapperChain;
    lodash.prototype.toString = wrapperToString;
    lodash.prototype.value = wrapperValueOf;
    lodash.prototype.valueOf = wrapperValueOf;

    // add `Array` functions that return unwrapped values
    forEach(['join', 'pop', 'shift'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        var chainAll = this.__chain__,
            result = func.apply(this.__wrapped__, arguments);

        return chainAll
          ? new lodashWrapper(result, chainAll)
          : result;
      };
    });

    // add `Array` functions that return the existing wrapped value
    forEach(['push', 'reverse', 'sort', 'unshift'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        func.apply(this.__wrapped__, arguments);
        return this;
      };
    });

    // add `Array` functions that return new wrapped values
    forEach(['concat', 'slice', 'splice'], function(methodName) {
      var func = arrayRef[methodName];
      lodash.prototype[methodName] = function() {
        return new lodashWrapper(func.apply(this.__wrapped__, arguments), this.__chain__);
      };
    });

    return lodash;
  }

  /*--------------------------------------------------------------------------*/

  // expose Lo-Dash
  var _ = runInContext();

  // some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose Lo-Dash to the global object even when an AMD loader is present in
    // case Lo-Dash is loaded with a RequireJS shim config.
    // See http://requirejs.org/docs/api.html#config-shim
    root._ = _;

    // define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module
    define(function() {
      return _;
    });
  }
  // check for `exports` after `define` in case a build optimizer adds an `exports` object
  else if (freeExports && freeModule) {
    // in Node.js or RingoJS
    if (moduleExports) {
      (freeModule.exports = _)._ = _;
    }
    // in Narwhal or Rhino -require
    else {
      freeExports._ = _;
    }
  }
  else {
    // in a browser or Rhino
    root._ = _;
  }
}.call(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],13:[function(require,module,exports){
(function (process){
/**
* @Author Abhijit Kane
* Main validator file
*/
 
var program = require('commander'),
	fs      = require('fs'),
	jsface	= require("jsface"),
	_       = require("lodash"),
	JSV 	= require("JSV").JSV;

var global_schema = require('./json-schemas/globals.schema.json');
var env_schema = require('./json-schemas/environment.schema.json');
var collection_schema = require('./json-schemas/collection.schema.json');

var schemas = {
	'c': collection_schema,
	'g': global_schema,
	'e': env_schema
};

var postman_validator = jsface.Class({
	$singleton: true,

	/*
	return schema:
	{
		"status": true / false,
		"message": "Schema validation failed",
		"error": {}
	}*/

	onlyOneValidator: function() {
		console.err("Only one file can be validated at one time.");
		process.exit(1);
	},

	validate: function (schemaCode, input) {
		try {
			input = this._loadJSONfile(input);
			console.log("JSON file loaded");
			return this.validateJSON(schemaCode,input);
		}
		catch(e) {
			return this._getReturnObj(false, e);
		}
	},


	/*
	options is an object
	currently, the only supported prop is correctDuplicates = true/false
	If true, duplicate entries in the order arrays in the collection are removed,
	and the order[] field is added to the old version
	*/
	validateJSON: function(schemaCode, input, options) {
		var schema = schemas[schemaCode];
		if(typeof schema === "undefined") {
			console.log("Invalid schema code");
			return this._getReturnObj(false,"Invalid schema code",{});
		}

		if(options.validateSchema!==false) {
			var env = JSV.createEnvironment();
			console.log("Env created");
			var report = env.validate(input, schema);
			if(report.errors.length) {
				console.log("Report errors: " + JSON.stringify(report.errors));
				return this._getReturnObj(false,"Validation failed",report.errors);
			}
		}
		
		//schema validation passed
		//semantic validation only for collections
		if(schemaCode==='c') {
			return this._validateCollectionSemantics(input, options)
		}
		else {
			return this._getReturnObj(true,"Validation successful",{});
		}
	},

	_getReturnObj: function(status,message,error, object) {
		return {
				"status": status,
				"message": message,
				"error": error,
				"finalObject": object
		};
	},

	printError: function(str) {
		process.stdout.write(str);
		process.exit(1);
	},

	_loadJSONfile: function(filename, encoding) {
		if(!fs.existsSync(filename)) {
			throw "File " + filename+" not found";
		}
		var contents=null;
		try {
			if (typeof (encoding) == 'undefined') encoding = 'utf8';
			var contents = fs.readFileSync(filename, encoding);
		} catch (err) {
			throw "Error reading file: " + err.message;
		}

		try {
			return JSON.parse(contents);
		} catch(err) {
			throw "Unable to parse JSON";
		}
	},


	_validateCollectionSemantics: function(json, options) {
		var correctDuplicates = !!(options && options.correctDuplicates);
		var duplicatesPresent = false;

		var ro = {
			"status": true,
			"message": "Valid Collection",
			"error": null,
			"finalObject": null
		};

		//must have a root id
		if(!json.hasOwnProperty("id")) {
			return this._getReturnObj(false, "Must have  a collection ID", {});
		}

		if(!json.hasOwnProperty("requests") || !(json.requests instanceof Array)) {
			return this._getReturnObj(false, "Requests[] must be present in the collection");
		}
		var requests = json.requests;
		var numRequest = json.requests.length;

		var collectionId = json.id;

		var order = json.order;
		if(order) {
			if (!(order instanceof Array)) {
				return this._getReturnObj(false, "Order must be an array")
			}
		}
		else {
			if(json.hasOwnProperty("folders")) {
				return this._getReturnObj(false, "Order[] must be present in the collection");
			}
			else {
				//old style collection
				console.log("Old style collection...adding requests to order");
				json.order = [];
				for(var i=0;i<numRequest;i++) {
					json.order.push(requests[i].id);
				}
				order = json.order;
			}
		}

		var rootOrder = order;

		var totalOrder = _.clone(order);

		var allOrders = [order];


		var requestIds = [];
		if(requests) {
			if (!(requests instanceof Array)) {
				return this._getReturnObj(false, "Requests must be an array")
			}

			for(var i=0;i<numRequest;i++) {
				if(!requests[i].hasOwnProperty("id") || (typeof requests[i].id !== "string")) return this._getReturnObj(false, "Each request must have an ID (string)");
				if(!requests[i].hasOwnProperty("collectionId") || (typeof requests[i].collectionId !== "string")) return this._getReturnObj(false, "Each request must have an collectionId field");
				if(requests[i].collectionId !== collectionId) return this._getReturnObj(false, "Each request must have the same collectionId as the root collection object");
				if(_.intersection([requests[i].id],requestIds).length!==0) {
					duplicatesPresent = true;
				}
				requestIds.push(requests[i].id);
			}
		}
		else {
			return this._getReturnObj(false, "Requests[] must be present in the collection");
		}

		var folders = json.folders;
		if(folders) {
			if(!(folders instanceof Array)) {
				return this._getReturnObj(false, "Folders must be an array")
			}

			var numFolder = folders.length;
			for(var i=0;i<numFolder;i++) {
				if(!folders[i].hasOwnProperty("id") || (typeof folders[i].id !== "string")) return this._getReturnObj(false, "Each folder must have an ID (String)");
				if(!folders[i].hasOwnProperty("order") || !(folders[i].order instanceof Array)) return this._getReturnObj(false, "Each folder must have an order[] field");
				if(_.intersection(folders[i].order,totalOrder).length!==0){
					duplicatesPresent = true;
				}
				totalOrder = totalOrder.concat(folders[i].order);
				allOrders.push(folders[i].order);
			}
		}


		//check for request duplication across orders
		if(duplicatesPresent) {
			if(correctDuplicates) {
				var numOrders = allOrders.length;
				var j;
				for(var i=0;i<numOrders-1;i++) {
					for(j=i+1;j<numOrders;j++) {
						var intersection = _.intersection(allOrders[i],allOrders[j]);
						var numIntersections = intersection.length;
						if(intersection.length!==0) {
							for(var sec=0;sec<numIntersections;sec++) {
								var indexToSplice = allOrders[j].indexOf(intersection[sec]);
								allOrders[j].splice(indexToSplice,1);
							}
						}
					}
				}
			}
			else {
				return this._getReturnObj(false, "Request IDs cannot be duplicated");
			}
		}

		var diff = _.difference(requestIds, totalOrder);
		if(diff.length!==0) {
			if(correctDuplicates) {
				console.log("Adding extra requests to root order");
				json.order = json.order.concat(diff);
			}
			else {
				var extraRequests = diff.join(", ");
				return this._getReturnObj(false, "Request count not matching. "+extraRequests+" are defined, but not present in any order array");
			}
		}

		diff = _.difference(totalOrder, requestIds);
		if(diff.length!==0) {
			var missing = diff.join(", ");
			return this._getReturnObj(false, "Request count not matching. "+missing+" are included in the order, but are not defined");
		}

		ro.finalObject = json;

		return ro;

	}

});

module.exports = postman_validator;



}).call(this,require('_process'))
},{"./json-schemas/collection.schema.json":1,"./json-schemas/environment.schema.json":2,"./json-schemas/globals.schema.json":3,"JSV":8,"_process":17,"commander":10,"fs":14,"jsface":11,"lodash":12}],14:[function(require,module,exports){

},{}],15:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],16:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":17}],17:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canMutationObserver = typeof window !== 'undefined'
    && window.MutationObserver;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    var queue = [];

    if (canMutationObserver) {
        var hiddenDiv = document.createElement("div");
        var observer = new MutationObserver(function () {
            var queueList = queue.slice();
            queue.length = 0;
            queueList.forEach(function (fn) {
                fn();
            });
        });

        observer.observe(hiddenDiv, { attributes: true });

        return function nextTick(fn) {
            if (!queue.length) {
                hiddenDiv.setAttribute('yes', 'no');
            }
            queue.push(fn);
        };
    }

    if (canPost) {
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}]},{},[13])(13)
});