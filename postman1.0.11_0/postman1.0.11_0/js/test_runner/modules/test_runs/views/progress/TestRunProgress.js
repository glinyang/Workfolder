var TestRunProgress = Backbone.View.extend({
	initialize: function() {
		var model = this.model;

		pm.mediator.on("startedTestRun", this.startNewTest, this);
		pm.mediator.on("hideResults", this.hideResults, this);
		pm.mediator.on("clearResults", this.clearResults, this);
		pm.mediator.on("addResult", this.addResult, this);
		pm.mediator.on("updateResult", this.updateResult, this);
	},

	startNewTest: function() {
		this.showResults();
		this.clearResults();
	},

	showResults: function() {
		$("#results").css("display", "block");
	},

	hideResults: function() {
		$("#results").css("display", "none");
	},

	clearResults: function() {
		$("#test-run-status").html("");
	},

	addResult: function(_result, testRun) {
		var result = _.clone(_result);
		result["testsArray"] = testRun.getTestsAsArray(result.tests, result.testPassFailCounts);
		$("#test-run-status").append(Handlebars.templates.item_test_run_request_result(result));
	},

	updateResult: function(_result, testRun) {
		var result = _.clone(_result);
		result["testsArray"] = testRun.getTestsAsArray(result.tests, result.testPassFailCounts);

		$("#test-run-request-result-" + result.id + " .time").html(result.time + " ms");
		$("#test-run-request-result-" + result.id + " .status-code .code").html(result.responseCode.code);
		$("#test-run-request-result-" + result.id + " .status-code .name").html(result.responseCode.name);
		$("#test-run-request-result-" + result.id + " .tests").html(Handlebars.templates.tests(result));
	}
});