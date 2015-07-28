var RunsSidebar = Backbone.View.extend({
	initialize: function() {
		var model = this.model;
		var view = this;

		$('#test-run-items').on("click", ".test-run", function() {
			var test_run_id = $(this).attr('data-test-run-id');
			model.loadTestRunStats(test_run_id);
		});

		$('#test-run-items').on("mouseenter", ".sidebar-test-run", function () {
		    var actionsEl = jQuery('.test-run-actions', this);
		    actionsEl.css('display', 'block');
		});

		$('#test-run-items').on("mouseleave", ".sidebar-test-run", function () {
		    var actionsEl = jQuery('.test-run-actions', this);
		    actionsEl.css('display', 'none');
		});

		$('#test-run-items').on("click", ".test-run-actions-download", function () {
		    var test_run_id = $(this).attr('data-test-run-id');
		    model.downloadTestRun(test_run_id);
		});

		$('#test-run-items').on("click", ".test-run-actions-delete", function () {
		    var test_run_id = $(this).attr('data-test-run-id');
		    model.deleteTestRun(test_run_id);
		});

		pm.mediator.on("startedTestRun", this.addRun, this);
		pm.mediator.on("importedTestRun", this.addRun, this);
		pm.mediator.on("deleteTestRun", this.deleteRun, this);
		pm.mediator.on("loadedAllTestRuns", this.render, this);

		this.render();
	},

	addEmptyMessage:function () {
	    $('#test-run-items').append(Handlebars.templates.message_no_test_runs());
	},

	clearEmptyMessage: function() {
		$("#test-run-items .empty-message").remove();
	},

	addRun: function(testRun) {
		this.clearEmptyMessage();
		$('#test-run-items').prepend(Handlebars.templates.item_test_run_sidebar(testRun.getAsJSON()));
		jQuery(".test-run-time").timeago();
	},

	deleteRun: function(id) {
		if (this.model.toJSON().length == 0) {
			this.addEmptyMessage();
		}

		$("#sidebar-test-run-" + id).remove();
	},

	render: function() {
		var model = this.model;
		var testRuns = model.getAsJSON();

		$('#test-run-items').html("");

		if (testRuns.length > 0) {
			$('#test-run-items').append(Handlebars.templates.sidebar_test_run_list({items: testRuns}));
		}
		else {
			this.addEmptyMessage();
		}

		jQuery(".test-run-time").timeago();

	}
});