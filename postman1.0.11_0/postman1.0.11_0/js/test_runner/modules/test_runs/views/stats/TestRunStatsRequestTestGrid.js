var TestRunStatsRequestTestGrid = Backbone.View.extend({
	initialize: function() {
		var model = this.model;
		var view = this;

		$("#stats-request-test-grid .secondary-section-back").on("click", function() {
			pm.mediator.trigger("backToResults");
		});

		$("#stats-request-test-grid").on("click", ".test-row-filter a", function() {
			var filter = $(this).attr("data-filter");
			view.filterResults(filter);
		});

		pm.mediator.on("showRequestTestGrid", this.render, this);
	},

	filterResults: function(filter) {
		if (filter === "all") {
			$("#stats-request-test-grid .request-tests table tr").css("display", "table-row");
		}
		else if (filter === "pass") {
			$("#stats-request-test-grid .request-tests table tr[data-result='pass']").css("display", "table-row");
			$("#stats-request-test-grid .request-tests table tr[data-result='fail']").css("display", "none");
		}
		else if (filter === "fail") {
			$("#stats-request-test-grid .request-tests table tr[data-result='pass']").css("display", "none");
			$("#stats-request-test-grid .request-tests table tr[data-result='fail']").css("display", "table-row");
			
		}
	},

	render: function(testRuns, testRunId, resultId) {		
		var testRun = testRuns.get(testRunId);
		var resultIndex = arrayObjectIndexOf(testRun.get("results"), resultId, "id");	
		var results = testRun.get("results")[resultIndex];		

		// Show request details at the top
		$("#stats-request-test-grid .request-meta").html(Handlebars.templates.test_grid_request_meta(results));	

		var keys = testRun.getTestKeysAsArray(results.tests);

		var allTests = _.clone(results.allTests);
		var count = allTests.length;
		var renderArray = [];
		var el;
		var newEl;		
		var elTests;

		for(var i = 0; i < allTests.length; i++) {
			el = {};
			elTests = [];
			allTrue = true;

			for(key in allTests[i]) {
				if (allTests[i].hasOwnProperty(key)) {
                    allTests[i][key]=!!allTests[i][key];
					elTests.push({
						key: key,
						value: allTests[i][key]
					});

					if (allTrue) {
						allTrue = allTests[i][key];
					}
				}
			}

			if (allTrue) {
				el["result"] = "pass";
			}
			else {
				el["result"] = "fail";
			}
			el["tests"] = elTests;

			renderArray.push(el);
		}

		$("#stats-request-test-grid .request-tests table").html("");
		$("#stats-request-test-grid .request-tests table").append(Handlebars.templates.test_grid_request_tests_head({keys: keys}));		
		$("#stats-request-test-grid .request-tests table").append(Handlebars.templates.test_grid_request_tests_rows({tests: renderArray}));		
	}
});