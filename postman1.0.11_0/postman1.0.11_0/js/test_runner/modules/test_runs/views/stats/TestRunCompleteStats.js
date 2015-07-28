var TestRunCompleteStats = Backbone.View.extend({
	initialize: function() {
		var view = this;
		var model = this.model;
		
		this.render();		
		pm.mediator.on("loadTestRun", this.onLoadTestRun, this);

		$("#test-run-stats").on("mouseenter", ".test-run-request-result", function(event) {			
			var testsEl = jQuery('.tests .tests-wrapper', this).children();

			if (testsEl.css("display") === "block") {
				var actionsEl = jQuery('.test-view-more', this);
				actionsEl.css('display', 'block');	
			}
			
		});

		$("#test-run-stats").on("mouseleave", ".test-run-request-result", function(event) {			
			var actionsEl = jQuery('.test-view-more', this);
			actionsEl.css('display', 'none');
		});

		$("#test-run-stats").on("click", ".test-view-more", function() {
			var testRunId = $(this).attr("data-test-run-id");
			var resultId = $(this).attr("data-result-id");
			pm.mediator.trigger("showRequestTestGrid", model, testRunId, resultId);	
		});
	},

	renderHeader: function(testRun) {
		$("#test-run-stats .test-run-meta").html(Handlebars.templates.test_run_stats_viewer_header(testRun.getAsJSON()));		
		$(".test-run-time").timeago();
	},

	renderOverview: function(testRun) {
		var id = testRun.get("id");
		var stats = {
			"id": id,
			"showTime": false,
			"timestamp": testRun.get("timestamp"),
			"count": testRun.getPassCount(),			
			"averageResponseTime": testRun.getAverageResponseTime()
		};		

		$("#test-run-stats-overview").html("");
		$("#test-run-stats-overview").append(Handlebars.templates.test_run_stats_overview(stats));

		$("#test-run-stats-overview-" + id + " .test-run-stats-pass-success").css("width", stats.count.percentage + "%");
	},

	renderPreviousRuns: function(testRun, testRuns) {
		var previousRuns = testRuns.getPreviousRuns(testRun);
		var count = previousRuns.length;
		var data = [];
		var run;
		var dataElement;
		var id;

		if (count > 0) {
			$("#test-run-stats-overview").append("<h5>Previous runs</h5>");
		}

		for(var i = 0; i < count; i++) {
			run = previousRuns[i];
			id = run.get("id");
			dataElement = {
				"id": id,
				"showTime": true,
				"timestamp": run.get("timestamp"),
				"count": run.getPassCount(),			
				"averageResponseTime": run.getAverageResponseTime()
			};

			$("#test-run-stats-overview").append(Handlebars.templates.test_run_stats_overview(dataElement));
			$("#test-run-stats-overview-" + id + " .test-run-stats-pass-success").css("width", dataElement.count.percentage + "%");
		}

		$(".test-run-stats-timestamp").timeago();
	},

	renderResponseTimes: function(testRun) {
		var results = testRun.get("results");

		d3.select(".chart")
		  .selectAll("div")
		    .data(results)
		  .enter().append("div")
		    .style("width", function(r) { return r.time * 10 + "px"; })
		    .text(function(r) { return r.time + "ms"; });
	},

	renderRequests: function(testRun) {
		var results = testRun.get("results");
		var result;

		$("#test-run-stats-requests").html("");		
		
		for(var i = 0; i < results.length; i++) {
			result = results[i];
			result["testRunId"] = testRun.get("id");
			result["testsArray"] = testRun.getTestsAsArray(result.tests, result.testPassFailCounts);		
			$("#test-run-stats-requests").append(Handlebars.templates.item_test_run_request_result(result));
		}
	},

	onLoadTestRun: function(testRun, testRuns) {
		$(".test-run-stats-empty-view").css("display", "none");
		$(".test-run-stats-content").css("display", "block");
		this.renderOverview(testRun);
		this.renderPreviousRuns(testRun, testRuns);
		this.renderHeader(testRun);
		this.renderRequests(testRun);
		this.renderResponseTimes(testRun);
	}

});