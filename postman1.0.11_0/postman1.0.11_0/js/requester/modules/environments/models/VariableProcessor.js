var VariableProcessor = Backbone.Model.extend({
    defaults: function() {
        return {
            environments: null,
            globals: null,
            externalDataVariables: [],
            functions: {},
            selectedEnv:null,
            selectedEnvironmentId:""
        };
    },

    initialize: function() {
        this.get("environments").on("reset", this.setCurrentEnvironment, this);
        this.get("environments").on("change", this.setCurrentEnvironment, this);
        this.get("environments").on("add", this.setCurrentEnvironment, this);
        this.get("environments").on("remove", this.setCurrentEnvironment, this);

        this.set("selectedEnvironmentId", pm.settings.getSetting("selectedEnvironmentId"));
        this.set("selectedEnv", this.get("environments").get(pm.settings.getSetting("selectedEnvironmentId")));

        pm.mediator.on("setEnvironmentVariable", this.setEnvironmentVariable, this);
        pm.mediator.on("setGlobalVariable", this.setGlobalVariable, this);
        pm.mediator.on("clearEnvironmentVariables", this.clearEnvironmentVariables, this);
        pm.mediator.on("clearGlobalVariables", this.clearGlobalVariables, this);

        this.initializeFunctions();
    },

    setGlobalVariable: function(v) {
        var targetKey = v.key;
        var targetValue = v.value + '';

        var variableProcessor = this.get("variableProcessor");
        var globals = this.get("globals");
        var globalValues = _.clone(globals.get("globals"));

        var count = globalValues.length;
        var value;

        var found = false;

        for(var i = 0; i < count; i++) {
            value = globalValues[i];
            if (value.key === targetKey) {
                found = true;
                value.value = targetValue;
                break;
            }
        }

        if (!found) {
            globalValues.push({
                "key": targetKey,
                "type": "text",
                "value": targetValue
            });
        }

        globals.saveGlobals(globalValues);

        if(this.get("setGlobalsTimeout")) {
            clearTimeout(this.get("setGlobalsTimeout"));
        }
        this.set("setGlobalsTimeout",setTimeout(function() {
            globals.trigger("change:globals");
        },100));
    },

    setEnvironmentVariable: function(v) {
        var targetKey = v.key;
        var targetValue = v.value + '';

        var variableProcessor = this;
        var environments = this.get("environments");
        var selectedEnv = this.get("selectedEnv");
        var found = false;

        if (selectedEnv) {
            var values = _.clone(selectedEnv.get("values"));

            var count = values.length;
            for(var i = 0; i < count; i++) {
                value = values[i];
                if (value.key === targetKey) {
                    found = true;
                    value.value = targetValue;
                    break;
                }
            }

            if (!found) {
                values.push({
                    "key": targetKey,
                    "type": "text",
                    "value": targetValue
                });
            }

            var id = selectedEnv.get("id");
            var name = selectedEnv.get("name");            

            environments.updateEnvironment(id, name, values);            

            // TODO For random reasons, selectedEnv is getting updated
            var newEnvironment = environments.get(id);
            this.setEnvironment(newEnvironment);
        }
    },

    clearEnvironmentVariables: function() {
        var variableProcessor = this;
        var environments = this.get("environments");
        var selectedEnv = this.get("selectedEnv");
        var found = false;

        if (selectedEnv) {
            var id = selectedEnv.get("id");
            var name = selectedEnv.get("name");

            environments.clearEnvironment(id, name);

            // TODO For random reasons, selectedEnv is getting updated
            var newEnvironment = environments.get(id);
            this.setEnvironment(newEnvironment);
        }
    },

    clearGlobalVariables: function() {
        var variableProcessor = this.get("variableProcessor");
        var globals = this.get("globals");
        var globalValues = [];
        globals.saveGlobals(globalValues);
        globals.trigger("change:globals");
    },

    setExternalDataVariables: function(kvpairs) {        
        var vars = [];
        for(key in kvpairs) {
            if (kvpairs.hasOwnProperty(key)) {
                vars.push({
                    "key": key,
                    "value": kvpairs[key],
                    "type": "text"
                });
            }
        }

        this.set("externalDataVariables", vars);
    },

    initializeFunctions: function() {
        var functions = {
            "\\$guid": {
                key: "$guid",
                run: function() {
                    return guid();
                }
            },

            "\\$timestamp": {
                key: "$timestamp",
                run: function() {
                    return Math.round(new Date().getTime() / 1000);
                }
            },

            "\\$randomInt": {
                key: "$randomInt",
                run: function(min, max) {
                    if (!min) min = 0;
                    if (!max) max = 1000;
                    return getRandomInt(min, max);
                }
            },

            "\\$random [0-9]+,[0-9]+": {
                key: "$randomInt",
                run: function(min, max) {
                    if (!min) min = 0;
                    if (!max) max = 1000;

                    return getRandomArbitrary(min, max);
                }
            }
        };

        this.set("functions", functions);
    },

    setCurrentEnvironment: function() {
        this.set("selectedEnvironmentId", pm.settings.getSetting("selectedEnvironmentId"));
        this.set("selectedEnv", this.get("environments").get(pm.settings.getSetting("selectedEnvironmentId")));
    },

    setEnvironment: function(environment) {
        this.set("selectedEnvironmentId", environment.get("id"));
        this.set("selectedEnv", environment);
    },

    disableEnvironment: function() {        
        this.set("selectedEnvironmentId", "");
        this.set("selectedEnv", null);
    },

    setGlobals: function(globalsArray) {
        var globals = this.get("globals");
        globals.set("globals", globalsArray);
    },

    containsVariable:function (string, values) {        
        var variableDelimiter = pm.settings.getSetting("variableDelimiter");
        var startDelimiter = variableDelimiter.substring(0, 2);
        var endDelimiter = variableDelimiter.substring(variableDelimiter.length - 2);
        var patString = startDelimiter + "[^\r\n]*" + endDelimiter;

        var pattern = new RegExp(patString, 'g');        
        var matches = string.match(pattern);
        var count = values.length;
        var variable;

        if(matches === null) {
            return false;
        }

        for(var i = 0; i < count; i++) {
            if (values[i].type === "text") {
                variable = startDelimiter + values[i].key + endDelimiter;                
            }
            else if (values[i].type === "function") {
                variable = startDelimiter + values[i].matcher + endDelimiter;
            }
            
            if(_.indexOf(matches, variable) >= 0) {                
                return true;
            }
        }

        return false;
    },

	processString:function (string, values) {
		if (!values) return string;

		var count = values.length;
		var finalString = _.clone(string);
		var patString;
		var pattern;

		var variableDelimiter = pm.settings.getSetting("variableDelimiter");
		var startDelimiter = variableDelimiter.substring(0, 2);
		var endDelimiter = variableDelimiter.substring(variableDelimiter.length - 2);

		for (var i = 0; i < count; i++) {
			patString = startDelimiter + values[i].key + endDelimiter;
			pattern = new RegExp(patString, 'g');
			var valToUse = _.clone(values[i].value);
			//TODO: required because of zendesk ticket #163
			if(valToUse === null) {
				//error condition
				console.log("For this variable (key="+values[i].key+"), value is null. Not substituting...");
				continue;
			}

			if(typeof valToUse === "object") {
				var result = valToUse.run();
				finalString = finalString.replace(pattern, result);
			}
			else {
				finalString = finalString.replace(pattern,valToUse);
			}
		}

		if (this.containsVariable(finalString, values)) {
			finalString = this.processString(finalString, values);
			return finalString;
		}
		else {
			return finalString;
		}
	},

    getCurrentValue: function(string) {
        if (typeof string === "number") {
            return string;
        }

        var envModel = this.get("selectedEnv");
        var envValues = [];

        if (envModel) {
            var environment = envModel.toJSON();
            if (environment !== null) {
                envValues = environment.values;
            }
        }

        var globals = this.get("globals").get("globals");
        var values;

        var externalDataVariables = this.get("externalDataVariables");        

        if (externalDataVariables) {        
            values = externalDataVariables;
            values = _.union(values, envValues);
        }
        else {
            values = envValues;
        }

        if (globals) {
            values = _.union(values, globals);
        }        

        var functions = this.get("functions");
        var fs = [];
        for(f in functions) {
            if(functions.hasOwnProperty(f)) {
                var kvpair = {
                    "key": f,
                    "matcher": functions[f].key,
                    "value": functions[f],
                    "type": "function"
                };

                fs.push(kvpair);
            }
        }

        values = _.union(values, fs);            

        if (string) {            
            var finalString = _.clone(this.processString(string, values));

            return finalString;
        }
        else {
            return string;
        }

    }
});