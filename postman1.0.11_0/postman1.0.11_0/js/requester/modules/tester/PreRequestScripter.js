var PreRequestScripter = Backbone.Model.extend({
	defaults: function() {
		return {
			"sandbox": null
		};
	},

	runPreRequestScript: function(request, data, iteration, callback) {
		$("#prscript-error").hide();

		var prCode = request.get("preRequestScript");

		// Wrapper function
		var baseCode = "(function(){";
		baseCode += prCode;
		baseCode += "})()";

		var selectedEnv = pm.envManager.get("selectedEnv");
		var selectedEnvJson = {};
		var globals = getKeyValPairsAsAssociativeArray(pm.envManager.get("globals").get("globals"));

		if (selectedEnv) {
			selectedEnvJson = getKeyValPairsAsAssociativeArray(selectedEnv.toJSON().values);
		}

		var environment = {
			"request": request.getForPrscript(), // Get separately
			"environment": selectedEnvJson,
			"globals": globals
		};

		this.postCode(baseCode, environment);

		this.listenToOnce(pm.mediator, "resultReceivedPrscipt", function(data) {
			if (callback) {
				callback(data, "result");
			}
		});

		this.listenToOnce(pm.mediator, "resultErrorPrscipt", function(data) {
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
			scriptType: "prscript"
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
				pm.mediator.trigger("resultReceivedPrscipt", event.data.result);
			}
			if (event.data.type === "test_error" && event.data.scriptType=="prscript") {
				pm.mediator.trigger("resultErrorPrscript", event.data.errorMessage);
			}
			//All other events are handled in Tester.js
		});

		pm.mediator.on("runPreRequestScript", this.runPreRequestScript, this);

		pm.mediator.on("resultErrorPrscript", this.showPreRequestScriptError, this);
	},

	showPreRequestScriptError: function(msg) {
		$("#prscript-error").show().html("There was an error evaluating the Pre-request script. " + msg).css('display','inline-block');
	}
});