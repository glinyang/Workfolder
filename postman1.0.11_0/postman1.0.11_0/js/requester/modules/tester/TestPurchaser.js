var TestPurchaser = Backbone.View.extend({
	initialize: function() {
		var view = this;

		pm.mediator.on("startPurchaseFlow", this.onStartPurchaseFlow, this);		

		this.purchaserView = new TestPurchaserWebView();
		
		pm.mediator.on("closeTestPurchaser", this.onCloseTestPurchaser, this);
		pm.mediator.on("purchaseComplete", this.onPurchaseComplete, this);		

		$("#modal-test-purchaser").on("shown", function () {		    
		    pm.app.trigger("modalOpen", "#modal-test-purchaser");
		});

		$("#modal-test-purchaser").on("hidden", function () {
		    pm.app.trigger("modalClose");
		});

		pm.mediator.on("onMessageExternal", function(request, sender, sendResponse) {			
			if (request) {
				if (request.postmanMessage) {
					if (request.postmanMessage.type === "purchase") {
						tracker.sendEvent('test_runner', 'collection_runner', 'purchase_complete');
						pm.mediator.trigger("purchaseComplete", request.postmanMessage.purchase);

						sendResponse({"result":"success"});

						$("#modal-jetpacks-about").modal("hide");
						$("#modal-jetpacks-intro").modal("show");
					}
				}
			}
		});
		
		$("body").on("click", ".buy-jetpacks", function() {
			view.purchase();
		});

		$("body").on("click", ".try-jetpacks", function() {
			view.startTrial();
		});
	},

	onCloseTestPurchaser: function() {
		// console.log("Hide modal");
		$("#modal-test-purchaser").modal("hide");
	},

	onPurchaseComplete: function(purchase) {
		if (purchase.id === "collection-runner") {
			// console.log("Time to hide modal");
			// $("#modal-test-purchaser").modal("hide");
		}
	},

	startTrial: function() {
		pm.mediator.trigger("startTrial", "collection-runner");
		$("#modal-jetpacks-about").modal("hide");
	},

	purchase: function() {
		pm.mediator.trigger("onStartPurchase", "collection-runner");

		var url = pm.webUrl + '/buy/jetpacks';
		url += "?key=collection-runner";
		url += "&is_beta=" + pm.arePurchasesInBeta;
		url += "&user_id=" + pm.user.get("id");
    	url += "&access_token=" + pm.user.get("access_token");
    	url += "&random=" + Math.random();
    	url += "&ga_client_id=" + pm.gaClientId;
    	url += "&app_name=" + app_name;
    	url += "&app_version=" + chrome.runtime.getManifest().version;
    	url += "&tracker_id=" + tracker_id;

		window.open(url);
	},

	onStartPurchaseFlow: function() {
		if (pm.purchases.isTrialCompleted("collection-runner")) {
			$("#modal-jetpacks-about .try-jetpacks").remove();
		}

		$("#modal-jetpacks-about").modal("show");
	}

});