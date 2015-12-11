var TestRun = Backbone.Model.extend({
	defaults: function() {
		return {
			"id": "",
			"name": "Default",
			"timestamp": 0,
			"collection_id": "",
			"folder_id": "",
			"target_type": "",
			"environment_id": "",
			"delay": 0,
			"count": 0,
			"collection": null,
			"folder": null,
			"environment": null,
			"globals": null,
			"results": null
		}
	},

	initialize: function() {
	},

	getAsJSON: function() {
		var collection;

		var obj = {
			"id": this.get("id"),
			"name": this.get("name"),
			"timestamp": this.get("timestamp"),
			"collection_id": this.get("collection_id"),
			"folder_id": this.get("folder_id"),
			"target_type": this.get("target_type"),
			"environment_id": this.get("environment_id"),
			"count": this.get("count"),
			"collection": null,
			"folder": this.get("folder"),
			"globals": this.get("globals"),
			"results": this.get("results"),
			"environment": null
		};

		if (this.get("collection")) {
			obj["collection"] = this.get("collection").getAsJSON();
		}

		if (this.get("environment")) {
			obj["environment"] = this.get("environment").toJSON();
		}

		return obj;
	},

	getTestsAsArray: function(tests, counts) {
		var d = "";
		var success = 0;
		var failure = 0;
		var total = 0;

		var testsArray = [];
		var r;
		var obj;

		for (var key in tests) {
			if (tests.hasOwnProperty(key)) {

				if (tests[key] && counts[key]["fail"] == 0) {
					r = "pass";
				}
				else {
					r = "fail";
				}

				obj = {
					key: key,
					value: r
				}

				if (counts) {
					obj["passCount"] = counts[key]["pass"];
					obj["failCount"] = counts[key]["fail"];
				}

				testsArray.push(obj);
			}
		}

		return testsArray;
	},

	getTestKeysAsArray: function(tests) {
		var keys = [];
		for (var key in tests) {
			if (tests.hasOwnProperty(key)) {
				keys.push(key);
			}
		}

		return keys;
	},

	// Do not store external data
	start: function(data) {
		var collection = this.get("collection");
		var folder = this.get("folder");
		var target_type = this.get("target_type");
		var environment = this.get("environment");
		var globals = this.get("globals");

		// Set up environment and globals
		if (environment) {
			// console.log("TESTRUNNER: Setting environment", environment);
			pm.envManager.setEnvironment(environment);
		}
		else {
			pm.envManager.disableEnvironment();
		}

		pm.envManager.setGlobals(globals);

		// Filter executable requests
		var allRequests;

		if (target_type === "folder") {
			allRequests = collection.getRequestsInFolder(folder);
		}
		else {
			allRequests = collection.getRequestsInCollection();
		}

		this.addToDataStore(this.getAsJSON());
		this.runRequests(allRequests, this.get("count"), data, this.get("delay"));
	},

	addToDataStore: function(testRun) {
		pm.indexedDB.testRuns.addTestRun(testRun, function(data) {			
		});
	},

	updateInDataStore: function(testRun) {
		pm.indexedDB.testRuns.updateTestRun(testRun, function(data) {			
		});
	},

	deleteFromDataStore: function(id) {
		pm.indexedDB.testRuns.deleteTestRun(id, function() {			
		});
	},

	runRequests: function(requests, runCount, data, delay) {
		var externalData = data;

		var model = this;

		var currentRunCount = 0;

		this.set("requests", requests);
		var requestCount = requests.length;
		var currentRequestIndex = 0;
		var request;
		var response;

		var result;

		var results = [];
		this.set("results", results);

		function setPassFailTestCounts(result, newResult) {
			for(key in newResult.tests) {
				if (newResult.tests.hasOwnProperty(key)) {						
					if (result["testPassFailCounts"].hasOwnProperty(key)) {
						if (!!newResult.tests[key]) {
							passedCount = result["testPassFailCounts"][key]["pass"] + 1;
							failedCount = result["testPassFailCounts"][key]["fail"];
						}
						else {
							passedCount = result["testPassFailCounts"][key]["pass"];
							failedCount = result["testPassFailCounts"][key]["fail"] + 1;
						}

						result["testPassFailCounts"][key] = {
							"pass": passedCount,
							"fail": failedCount
						};						
					}
					else {
						if (!!newResult.tests[key]) {
							passedCount = 1;
							failedCount = 0;
						}
						else {
							passedCount = 0;
							failedCount = 1;
						}

						result["testPassFailCounts"][key] = {
							"pass": passedCount,
							"fail": failedCount
						};	
					}					
				}
			}
		}

		function addResult(newResult) {
			var index = arrayObjectIndexOf(results, newResult.id, "id");
			var r;
			var passedCount = 0;
			var failedCount = 0;

			if (index >= 0) {
				r = results[index];				
				r["responseCode"] = newResult.responseCode;
				r["totalTime"] += newResult.time;				
				r["tests"] = newResult.tests;			

				setPassFailTestCounts(r, newResult);

				result["showCount"] = true;

				r["times"].push(newResult.responseTime);
				r["allTests"].push(newResult.tests);				

				// TODO through the tests array, calculate which counts of failures and successes of tests
				pm.mediator.trigger("updateResult", r, model);
			}
			else {				
				result["times"] = [newResult.responseTime];

				if ("tests" in newResult) {
					result["allTests"] = [newResult.tests];
					setPassFailTestCounts(result, newResult);
				}
				else {
					// result["testPassFailCounts"] = [];
					result["allTests"] = [];
				}
				
				results.push(result);
				pm.mediator.trigger("addResult", result, model);
			}
		}

		function onSentRequest(r) {
			result = {
				"id": request.get("id"),
				"name": request.get("name"),
				"url": request.get("url"),
				"totalTime": 0,
				"responseCode": {
					"code": 0,
					"name": "",
					"detail": ""
				},
				"tests": {},
				"testPassFailCounts": {},
				"times": [],
				"allTests": []
			}
		}

		function onLoadResponse(r) {
			// console.log("TESTRUNS: onLoadResponse", r);
			result["responseCode"] = response.get("responseCode");
			result["time"] = response.get("time");

			var tests = request.get("tests");

			var externalDataVariables = {};

			if (externalData) {
				if (externalData.length > 0) {
					if (currentRunCount < externalData.length) {
						externalDataVariables = externalData[currentRunCount];
					}
				}				
			}

			if (tests) {
				pm.mediator.trigger("runRequestTest", request, externalDataVariables, currentRunCount, onFinishTests);
			}
			else {
				finishRequestRun();
			}

		}

		function onFinishTests(data, testResultType) {
			// console.log("TESTRUNS: onFinishTests");

			if (testResultType === "result") {
				result["tests"] = data;
				finishRequestRun();					
			}
			else if (testResultType === "error") {
				result["tests"] = {"Error": false};
				pm.mediator.trigger("notifyError", "Something is wrong with your JSON tests. Please fix them in the editor first");
				model.updateInDataStore(model.getAsJSON());
				pm.mediator.trigger("finishedTestRun", model);
			}
		}

		function finishRequestRun() {
			// console.log("TESTRUNS: finishRequestRun", currentRequestIndex, requestCount, runCount);

			addResult(result);

			if (currentRequestIndex < requestCount - 1) {
				// console.log("TESTRUNS:finishRequestRun, Send another request");
				currentRequestIndex += 1;
				sendRequest(currentRequestIndex);
			}
			else {
				currentRunCount += 1;

				// console.log("TESTRUNS:finishRequestRun", currentRunCount, runCount);

				if (currentRunCount === runCount) {										
					// console.log("TESTRUNS:finishRequestRun, Finish run");
					model.updateInDataStore(model.getAsJSON());
					pm.mediator.trigger("finishedTestRun", model);
				}
				else {
					// console.log("TESTRUNS:finishRequestRun, Create another run");
					// Re-initiate run
					currentRequestIndex = 0;
					sendRequest(0);
				}
			}
		}

		function sendRequest(index) {		
			setTimeout(function() {
				// Set variables in envManager here
				if (externalData) {
					if (externalData.length > 0) {
						if (currentRunCount < externalData.length) {
							pm.envManager.setExternalDataVariables(externalData[currentRunCount]);	
						}
					}				
				}

				if (request) {
					// console.log("Destroy request");
				}

				request = new Request();
				request.loadRequest(requests[index], true, false, true);
				//request.disableHelpers(); // TODO Should get rid of this call later

				//add helper data
				var currentHelper = request.get("currentHelper") || "normal";
				var helperAttributes = request.get("helperAttributes");

				if(currentHelper!=="normal") {
					var helperModel = pm.helperModel.get(currentHelper);

					for (var property in helperAttributes) {
						if (helperAttributes.hasOwnProperty(property)) {
							helperModel.set(property,helperAttributes[property]);
						}
					}

					if(currentHelper === "oAuth1") {
						helperModel.generateHelper();
					}

					helperModel.processCustomRequest(request);
				}


				// Attach listeners for request and response
				request.on("sentRequest", onSentRequest);
				response = request.get("response");

				response.on("loadResponse", onLoadResponse);
                
                var thisRequest = request;
                //add a callback to restore env vars
                request.get("prScripter").runPreRequestScript(request, {}, 1, function(data, result) {
	                thisRequest.get("body").setDataForXHR();
                    thisRequest.send("text", "display", true);
                });
			}, delay);			
		}

		// Initiate request
		if (requestCount > 0) {
			sendRequest(0);
		}
		else {
			model.updateInDataStore(model.getAsJSON());
			pm.mediator.trigger("finishedTestRun", model);
		}
	},

	getPassCount: function() {
		// Results for all requests
		var results = this.get("results");

		if (!results) {
			return {
				"passed": 0,
				"total": 0,
				"percentage": 0
			};
		}

		var count = results.length;

		var r;
		var allTests;
		var allTestCount;
		var tests;

		var passedTestCount = 0;
		var totalTestCount = 0;

		for(var i = 0; i < count; i++) {
			r = results[i];
			allTests = r["allTests"];
			allTestCount = allTests.length;

			if (allTestCount > 0) {
				for(var k = 0; k < allTestCount; k++) {
					tests = allTests[k];

					for(var key in tests) {
						if (tests.hasOwnProperty(key)) {
							val = tests[key];
							totalTestCount++;

							if (!!val) {
								passedTestCount++;
							}
						}
					}
				}
			}			
		}

		var percentage = Math.round(passedTestCount/totalTestCount * 100);

		return {
			"passed": passedTestCount,
			"failed": totalTestCount - passedTestCount,
			"total": totalTestCount,
			"percentage": percentage
		};
	},

	getAverageResponseTime: function() {
		var results = this.get("results");

		if (!results) {
			return 0;
		}

		var count = results.length;
		
		var r;
		var totalTime = 0;

		for(var i = 0; i < count; i++) {
			r = results[i];
			totalTime += r["time"];
		}

		var average = Math.round(totalTime/count, 2);

		return average;
	}
});

// TODO Reload collection data when something is updated in the requester window
var TestRuns = Backbone.Collection.extend({
	model: TestRun,

	comparator: function(a, b) {
	    var counter;

	    var aTimestamp = a.get("timestamp");
	    var bTimestamp = b.get("timestamp");
	    
	    return aTimestamp < bTimestamp;
	},

	initialize: function() {
		var model = this;

		var areEnvironmentsLoaded = false;
		var areCollectionsLoaded = false;

		pm.mediator.on("loadedEnvironments", function() {
			areEnvironmentsLoaded = true;			

			if (areEnvironmentsLoaded === true && areCollectionsLoaded === true) {
				model.loadAllTestRuns();
			}
		});
		pm.mediator.on("loadedCollections", function() {
			areCollectionsLoaded = true;			

			if (areEnvironmentsLoaded === true && areCollectionsLoaded === true) {
				model.loadAllTestRuns();
			}
		});

		pm.mediator.on("loadTestRunFromId", this.loadTestRunStats, this);
		pm.mediator.on("startTestRun", this.onStartTestRun, this);
		pm.mediator.on("showTestRun", this.onShowTestRun, this);		
	},

	onShowTestRun: function(testRun) {
		pm.mediator.trigger("loadTestRun", testRun, this);
	},

	getAsJSON: function() {
		var runs = [];

		for(var i = 0; i < this.models.length; i++) {
			runs.push(this.models[i].getAsJSON());
		}

		return runs;
	},	

	loadTestRunStats: function(id) {
		var testRun = this.get(id);		
		pm.mediator.trigger("showTestRun", testRun);
	},

	deleteTestRun: function(id) {
		var collection = this;

		pm.indexedDB.testRuns.deleteTestRun(id, function() {
			collection.remove(id);
			pm.mediator.trigger("deleteTestRun", id);
		});
	},

	importTestRunData: function(testRunParams) {
		var existingRun = this.get(testRunParams.id);

		if (!existingRun) {
			var testRun = new TestRun(testRunParams);

			this.add(testRun);

			testRun.set("collection", new PmCollection(testRunParams.collection));
			testRun.set("environment", new Environment(testRunParams.environment));

			testRun.addToDataStore(testRunParams);

			pm.mediator.trigger("importedTestRun", testRun);
		}		
	},

	importTestRuns: function(files) {
		console.log(files);

		var collection = this;

        // Loop through the FileList
        for (var i = 0, f; f = files[i]; i++) {
            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function (theFile) {
                return function (e) {
                    // Render thumbnail.
                    var data = e.currentTarget.result;
                    try {
                        var testRun = JSON.parse(data);                        
                        collection.importTestRunData(testRun);
                    }
                    catch(e) {
                        pm.mediator.trigger("failedTestRunImport");
                    }
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsText(f);
        }
	},

	downloadTestRun:function (id) {
	    var testRun = this.get(id);

	    testRun.set("synced", false);

	    var collectionName = testRun.get("collection").get("name");
	    var name = collectionName + ".postman_test_run";
	    var type = "application/json";
	    var filedata = JSON.stringify(testRun.toJSON(), null, '\t');
	    pm.filesystem.saveAndOpenFile(name, filedata, type, function () {
	        noty(
	            {
	                type:'success',
	                text:'Saved test run to disk',
	                layout:'topCenter',
	                timeout:750
	            });
	    });
	},

	loadAllTestRuns: function() {

		var collection = this;
		var testRun;
		var environment_id;

		pm.indexedDB.testRuns.getAllTestRuns(function(testRuns) {
			var filteredRuns = [];

			for (var i = 0; i < testRuns.length; i++) {							
				testRun = testRuns[i];
				environment_id = testRun.environment_id;

				testRun.collection = pm.collections.get(testRun.collection_id);
				testRun.environment = pm.envManager.get("environments").get(environment_id);

				if (testRun.collection) {
					filteredRuns.push(testRun);
				}
			}

			collection.add(filteredRuns, { merge: true });
			pm.mediator.trigger("loadedAllTestRuns");
		});
	},

	onStartTestRun: function(params) {
		var files = params.files;
		var model = this;

		if (files.length > 0) {
			// TODO Only one file
			this.importDataFile(files[0], params.fileDataType, function(data) {
				params.data = data;

				console.log("Data loaded from file", params.data);

				pm.mediator.trigger("loadedDataFile");				
				model.startTestRun(params);
			});
		}
		else {
			params.data = [];
			this.startTestRun(params);
		}
	},

	startTestRun: function(params) {
		console.log(params);
		console.log(params.data);

		var data = [];
		if (params.hasOwnProperty("data")) {
			data = params.data;
		}

		var collection_id = params["collection_id"];
		var folder_id = params["folder_id"];
		var target_type = params["target_type"];
		var environment_id = params["environment_id"];
		var count = params["count"];
		var delay = params["delay"];

		var collection = pm.collections.get(collection_id);
		var folder;

		if (folder_id !== "0") {
			folder = collection.getFolderById(folder_id);
		}

		var environment;

		if (environment_id !== "0") {
			environment = pm.envManager.get("environments").get(environment_id);
		}

		var globals = pm.envManager.get("globals").get("globals");

		var testRunParams = {
			"id": guid(),
			"name": "Default",
			"timestamp": new Date().getTime(),
			"collection_id": collection_id,
			"folder_id": folder_id,
			"target_type": target_type,
			"environment_id": environment_id,
			"count": count,
			"delay": delay,
			"collection": collection,
			"folder": folder,
			"environment": environment,
			"globals": globals			
		};

		var testRun = new TestRun(testRunParams);
		testRun.start(data);

		this.add(testRun);

		pm.mediator.trigger("startedTestRun", testRun);
	},

	getPreviousRuns: function(testRun) {
		var count = this.length;
		var run;

		var targetCollectionId = testRun.get("collection_id");
		var targetFolderId = testRun.get("folder_id");
		var targetEnvironmentId = testRun.get("environment_id");
		var targetId = testRun.get("id");

		var itemCollectionId;
		var itemFolderId;
		var itemEnvironmentId;

		var matchedRuns = [];

		for(var i = 0; i < count; i++) {
			run = this.models[i];

			itemEnvironmentId = run.get("environment_id");
			itemFolderId = run.get("folder_id");
			itemCollectionId = run.get("collection_id");
			itemId = run.get("id");

			if (itemCollectionId === targetCollectionId
				&& itemEnvironmentId === targetEnvironmentId
				&& itemFolderId == targetFolderId
				&& itemId !== targetId) {
				matchedRuns.push(run);
			}
		}

		return matchedRuns;
	},

	loadDataFromFile: function(data, fileDataType, callback, errorCallback) {
		if (callback) {
			var object;
			var kvpair;
			var i, j;
			
			try {				
				if (fileDataType === "json") {
					object = JSON.parse(data);
					if(!(object instanceof Array)) {
						throw "The JSON must be an array";
					}
					callback(object);
				}
				else if (fileDataType === "csv") {
					object = [];
					var csvArray = CSV.csvToArray(data);

					console.log("DEBUG: Loaded CSV data", csvArray);

					if (csvArray.length > 0) {
						var keys = csvArray[0];
						var numKeys = keys.length;
						var count = csvArray.length;

						for (j = 0; j < numKeys; j++) {
							keys[j] = keys[j].trim();
						}

						for(i = 1; i < count; i++) {
							kvpair = {};
							if(csvArray[i].length!==numKeys) {
								throw "Each row must have an equal number of columns"
							}
							for (j = 0; j < numKeys; j++) {								
								kvpair[keys[j]] = csvArray[i][j];
							}

							object.push(kvpair);
						}
					}

					callback(object);
				}
				else {
					//Wrong format - not JSON or CSV
					pm.mediator.trigger("notifyError", "Unable to determine file format. Please select JSON or CSV");
					errorCallback();
				}
			}
			catch (e) {
				pm.mediator.trigger("notifyError", "Data file format is not right: " + e);
				errorCallback();
			}
			
		}
	},

	importDataFile: function(file, fileDataType, callback) {	
		var model = this;

	    var reader = new FileReader();

	    // Closure to capture the file information.
	    reader.onload = (function (theFile) {
	        return function (e) {
	            model.loadDataFromFile(e.currentTarget.result, fileDataType, callback, function(){});
	        };
	    })(file);

	    // Read in the image file as a data URL.
	    reader.readAsText(file);		
	}
});