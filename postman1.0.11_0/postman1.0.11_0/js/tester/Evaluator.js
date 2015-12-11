    var Evaluator = Backbone.Model.extend({
    initialize: function() {
        this.setupListener();
    },

    setupListener: function() {
        window.addEventListener('message', function(event) {
            source = event.source;

            var command = event.data.command;
            var code = event.data.code;
            var testEnvironment = event.data.environment;
            var scriptType = event.data.scriptType; //prscript or test

            request = testEnvironment.request;
            responseBody = testEnvironment.responseBody;
            responseHeaders = testEnvironment.responseHeaders;
            responseCookies = testEnvironment.responseCookies;
            responseTime = testEnvironment.responseTime;
            responseCode = testEnvironment.responseCode;

            environment = testEnvironment.environment;
            globals = testEnvironment.globals;

            if ("iteration" in testEnvironment) {
                iteration = testEnvironment.iteration;
            }

            if ("data" in testEnvironment) {
                data = testEnvironment.data;
            }
            else {
                data = {};
            }

            postman = {
                getResponseCookie: function(cookieName) {
                    var numCookies = responseCookies.length || 0;
                    for(var i=0;i<numCookies;i++) {
                        var thisCookie = responseCookies[i];
                        if(thisCookie.name.toLowerCase()===cookieName.toLowerCase()) {
                            return thisCookie;
                        }
                    }
                    return null;
                },

                getResponseHeader: function(headerString) {
                    var headers = responseHeaders;
                    for(var key in headers) {
                        if(headers.hasOwnProperty(key)) {
                            if(key.toLowerCase()==headerString.toLowerCase()) {
                                return headers[key];
                            }
                        }
                    }
                    return null;
                },

                setEnvironmentVariable: function(key, value) {
                    var object = {
                        "type": "set_environment_variable",
                        "variable": {
                            "key": key,
                            "value": value
                        }
                    };
                    environment[key]=value;

                    event.source.postMessage(object, event.origin);
                },

                getEnvironmentVariable: function(key) {
                    return environment[key];
                },

                setGlobalVariable: function(key, value) {
                    var object = {
                        "type": "set_global_variable",
                        "variable": {
                            "key": key,
                            "value": value
                        }
                    };

                    globals[key]=value;

                    event.source.postMessage(object, event.origin);
                },

                getGlobalVariable: function(key) {
                    return globals[key];
                },

                clearEnvironmentVariables: function() {
                    var object = {
                        "type": "clear_environment_variables"
                    };
                    event.source.postMessage(object, event.origin);
                },

                clearGlobalVariables: function() {
                    var object = {
                        "type": "clear_global_variables"
                    };
                    event.source.postMessage(object, event.origin);
                }
            };


            if (command === "runcode") {
                try {
                    var result = eval(code);
                    event.source.postMessage({'type': 'test_result', 'result': result, 'scriptType': scriptType}, event.origin);
                }
                catch(e) {
                    console.log(e);
                    event.source.postMessage({'type': 'test_error', 'errorMessage': e.message, 'scriptType': scriptType}, event.origin);
                }

            }
        });
    }
    });