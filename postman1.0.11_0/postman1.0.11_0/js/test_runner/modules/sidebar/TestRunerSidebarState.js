var TestRunnerSidebarState = Backbone.Model.extend({
	defaults: function() {
		return {
			"isSidebarMaximized": true,
			"collections": null,
			"envManager": null,
			"testRuns": null
		}
	},

	initialize: function() {

	}
});