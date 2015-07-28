var TestResultViewer = Backbone.View.extend({
	initialize: function() {
		var model = this.model;

		model.on("change:testResults", this.renderResults, this);
		model.on("change:testErrors", this.renderErrors, this);

		$("#response-tests").on("click", ".know-more-collection-runner", function() {
			tracker.sendEvent('test_runner', 'know_more', 'test_result_viewer');
			pm.mediator.trigger("startPurchaseFlow", "test_runner");
		});
	},

	renderErrors: function(request) {
		// console.log("Render errors", request);
		if (pm.purchases.isUpgradeAvailable("collection-runner")) {
			if (request.get("testErrors")) {
				$('#response-tests').html("<h4>Test script execution failed</h4><h5>Error message:</h5>");
				$('#response-tests').append("<span class='test-error'>" + request.get("testErrors") + "</span>");	
			}	
		}
		else {
			this.renderPurchaseMessage();
		}		
	},

	renderPurchaseMessage: function() {
		$('#response-tests').html(Handlebars.templates.purchase_message_collection_runner({}));;

		// Deactivate trial button if trial completed
		$("#response-tests .try-jetpacks").remove();
	},

	renderResults: function() {
		if (pm.purchases.isUpgradeAvailable("collection-runner")) {
			var testResults = this.model.get("testResults");		

			if (testResults === null) {
				$('.response-tabs li[data-section="tests"]').html("Tests (0/0)");
				$('#response-tests').html("");
				return;
			}

			var d = "";
			var success = 0;
			var failure = 0;
			var total = 0;

			var results = [];
			var r;
			for (var key in testResults) {
			  if (testResults.hasOwnProperty(key)) {

			  	if (!!testResults[key]) {
			  		r = "pass";
			  	}
			  	else {
			  		r = "fail";
			  	}

			    results.push({
			    	key: key,
			    	value: r
			    });

			    if (!!testResults[key]) {
			    	success += 1;
			    }
			    else {
			    	failure += 1;
			    }

			    total += 1;
			  }
			}

			$('.response-tabs li[data-section="tests"]').css("display", "block");
			$('.response-tabs li[data-section="tests"]').html("Tests (" + success + "/" + total + ")");
			$('#response-tests').html(Handlebars.templates.response_tests({items: results}));
		}
		else {
			this.renderPurchaseMessage();
		}		
	}

});