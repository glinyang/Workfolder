var Tester = Backbone.Model.extend({
    defaults: function() {
        return {
            "sandbox": null
        };
    },

    runTest: function(request, data, iteration, callback) {
        $("#test-error").hide();

        var testCode = request.get("tests");

        // Wrapper function
        var baseCode = "(function(){var tests={};";
        baseCode += testCode;
        baseCode += "return tests;})()";

        var response = request.get("response");

        var selectedEnv = pm.envManager.get("selectedEnv");
        var selectedEnvJson = {};
        var globals = getKeyValPairsAsAssociativeArray(pm.envManager.get("globals").get("globals"));

        if (selectedEnv) {
            selectedEnvJson = getKeyValPairsAsAssociativeArray(selectedEnv.toJSON().values);
        }

        var environment = {
            "request": request.getForTester(), // Get separately
            "responseBody": response.get("text"),
            "responseHeaders": response.getHeadersAsKvPairs(), // TODO Get key value pairs
            "responseTime": response.get("time"),
            "responseCookies": response.get("cookies"),
            "responseCode": response.get("responseCode"),
            "environment": selectedEnvJson,
            "globals": globals,
            "data": data,
            "iteration": iteration
        };

        this.postCode(baseCode, environment);

        this.listenToOnce(pm.mediator, "resultReceived", function(data) {
            if (callback) {
                callback(data, "result");
            }
        });

        this.listenToOnce(pm.mediator, "resultError", function(data) {
            if (callback) {
                callback(data, "error");
            }
        });
    },

    postCode: function(code, environment) {
        var sandbox = this.get("sandbox");
        var message = {
            command: "runcode",
            code: code,
            environment: environment,
            scriptType: "test"
        };

        sandbox.contentWindow.postMessage(message, '*');
    },

    initialize: function() {
        var model = this;

        var sandbox = document.getElementById("tester_sandbox");
        this.set("sandbox", sandbox);

        window.addEventListener('message', function(event) {
            var type = event.data.type;

            if (event.data.type === "test_result") {
                pm.mediator.trigger("resultReceived", event.data.result);
            }
            if (event.data.type === "test_error" && event.data.scriptType=="test") {
                pm.mediator.trigger("resultError", event.data.errorMessage);
            }
            else if (type === "set_environment_variable") {
                pm.mediator.trigger("setEnvironmentVariable", event.data.variable);
            }
            else if (type === "set_global_variable") {
                pm.mediator.trigger("setGlobalVariable", event.data.variable);
            }
            else if (type === "clear_environment_variables") {
                pm.mediator.trigger("clearEnvironmentVariables");
            }
            else if (type === "clear_global_variables") {
                pm.mediator.trigger("clearGlobalVariables");
            }
        });

        pm.mediator.on("resultError", this.showTestScriptError, this);
        pm.mediator.on("runRequestTest", this.runTest, this);
    },

    showTestScriptError: function(msg) {
        $("#test-error").show().html("There was an error evaluating the test script. " + msg).css('display','inline-block');
    }
});