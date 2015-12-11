var TestPurchaserWebView = Backbone.View.extend({
	initialize: function() {
		var model = this.model;
		var view = this;

		this.webview = document.getElementById("test-purchaser-webview");		
		this.webview.addEventListener("loadstart", this.onLoadStart);
		this.webview.addEventListener("loadstop", this.onLoadStop);		

		window.addEventListener("message", function(event) {
			if (event.hasOwnProperty("data")) {
				// console.log(event.data);
				if (event.data.message_type === "purchase") {
					tracker.sendEvent('test_runner', 'collection_runner', 'purchase_complete');
					pm.mediator.trigger("purchaseComplete", event.data.purchase);
				}
				else if (event.data.message_type === "token") {
					tracker.sendEvent('user', 'login', 'purchase');
					pm.mediator.trigger("receiveTokenFromPurchaseFlow", event.data.token);
				}
				else if (event.data.message_type == "finish_purchase") {
					pm.mediator.trigger("closeTestPurchaser");
				}
				
			}			
		});

		this.webview.addEventListener('newwindow', function(e) {
			var targetUrl = e.targetUrl;
			var a = document.createElement('a'); 
		    a.href = targetUrl; 
		    a.target='_blank'; 
		    a.click(); 
		});

		this.webview.addEventListener("contentload", function() {
			// console.log("Posting message");
			event.target.contentWindow.postMessage({}, "*");			
		});		
	},

	onContentLoad: function(event) {
		// console.log("Content load called");				
	},

	onLoadStart: function(event) {
		// console.log("onLoadStart");
		$("#modal-test-purchaser .preloader").css("display", "inline-block");
	},

	onLoadStop: function(event) {		
		// console.log("onLoadStop");
		$("#modal-test-purchaser .preloader").css("display", "none");
		event.target.executeScript({ code: "document.innerHTML = 'blah';" });
	},

	loadUrl: function(url) {
		this.webview.src = url;
	}
});