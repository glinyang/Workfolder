var TestRunnerController = Backbone.View.extend({
	initialize: function() {
		var model = this.model;
		var view = this;

		this.numTestRuns = 0;

		var testRuns = this.model.get("testRuns");
		
		var testRunner = new TestRunner({model: this.model});
		var testRunCompleteStats = new TestRunCompleteStats({model: testRuns});
		var importTestRunModal = new ImportTestRunModal({model: testRuns});
		var dataPreviewModal = new DataPreviewModal();

		var testRunStatsRequestTestGrid = new TestRunStatsRequestTestGrid({model: this.model});
		// var testRunStatsAverageResponseTimes = new testRunStatsAverageResponseTimes({model: this.model});

		this.model.on("showView", this.showView, this);

		pm.mediator.on("backToResults", this.goBackToResults, this);
		pm.mediator.on("showTestRun", this.showStats, this);
		pm.mediator.on("startTestRun", this.onStartTestRun, this);
		pm.mediator.on("showRequestTestGrid", this.showRequestTestGrid, this);

		$(".request-helper-tabs").on("click", "li", function() {
			var id = $(this).attr("data-id");
			view.showSection(id);
		});
	},

	onStartTestRun: function() {
		this.numTestRuns++;
	},

	showSection: function(id) {
		if (id === "stats") {
			this.showStats();
		}
		else if (id === "start") {
			this.showStart();
		}
	},

	showStart: function() {
		$("#stats-request-test-grid").css("display", "none");

		$(".request-helper-tabs li[data-id='stats']").removeClass("active");
		$(".request-helper-tabs li[data-id='start']").addClass("active");

		if (this.numTestRuns > 0) {
			$("#results").css("display", "block");	
		}
		
		$("#test-run-starter").css("display", "block");
		$("#test-run-stats").css("display", "none");
	},

	showStats: function(testRun) {
		$("#test-run").css("display", "block");
		$("#stats-request-test-grid").css("display", "none");

		$(".test-run-stats-viewer-tabs-container").css("display", "block");

		$(".request-helper-tabs li[data-id='start']").removeClass("active");
		$(".request-helper-tabs li[data-id='stats']").addClass("active");

		$("#results").css("display", "none");
		$("#test-run-starter").css("display", "none");		
		$("#test-run-stats").css("display", "block");			
	},

	showView: function(key) {
		if (key === "status") {
			$("#test-run-starter-form").css("display", "none");
			$("#test-run-progress").css("display", "block");
		}
		else if (key === "default") {
			$("#test-run-starter-form").css("display", "block");
			$("#test-run-progress").css("display", "none");
		}
	},

	goBackToResults: function() {
		$("#stats-request-test-grid").css("display", "none");
		$("#test-run").css("display", "block");
	},

	showRequestTestGrid: function() {
		$("#test-run").css("display", "none");
		$("#results").css("display", "none");
		$("#stats-request-test-grid").css("display", "block");
	}
});