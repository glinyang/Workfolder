var TestRunAppHeader = Backbone.View.extend({
	initialize: function() {
		$("#navbar-crumbs-home").on("click", function() {
			pm.mediator.trigger("openModule", "requester");
		});

		$('a[data-toggle="popover"]').popover({
		    animation: true,
		    placement: "bottom",
		    trigger: "hover",
		});

		$('a[rel="tooltip"]').tooltip();

		pm.mediator.on("openModule", this.onOpenModule, this);
	},

	onOpenModule: function() {
	  chrome.app.window.create('requester.html', {
	    "bounds": {
	    	top: 100,
	    	left: 2100,
	      	width: 1200,
	      	height: 800
	    }
	  });
	}
});