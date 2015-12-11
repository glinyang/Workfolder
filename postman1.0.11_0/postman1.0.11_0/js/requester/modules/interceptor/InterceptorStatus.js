var InterceptorStatus = Backbone.View.extend({
	initialize: function() {
		var model = this.model;
		var view = this;

		$(".interceptor-status-trigger").on("click", function() {
			view.toggleInterceptor();
		});

		$("#postman-interceptor-status").on("click", function() {
			view.toggleInterceptor();
		});

		pm.mediator.on("enableInterceptor", this.enableInterceptor, this);

		this.setIcon();
	},

	enableInterceptor: function() {
		pm.settings.setSetting("useInterceptor", true);
		this.setIcon();
	},

	setIcon: function() {		
		var status = pm.settings.getSetting("useInterceptor");

		if (status === false) {
			$("#postman-interceptor-status img").attr("src", "img/v2/interceptor.png");
		}
		else {
			$("#postman-interceptor-status img").attr("src", "img/v2/interceptor_connected.png");
		}
	},

	toggleInterceptor: function() {
		var foundExtension = false;
		var view = this;
		var message = {
			"postmanMessage": {
				"type": "detectExtension"
			}
		}

		//allow disabling the interceptor without it being installed
		var status = pm.settings.getSetting("useInterceptor");
		if (status === true) {
			pm.settings.setSetting("useInterceptor", false);
			view.setIcon();
		}
		else {
			chrome.runtime.sendMessage(postman_interceptor_id, message, function (extResponse) {
				if (typeof extResponse === "undefined") {
					foundExtension = false;
					console.log("show modal");
					$("#modal-interceptor-intro").modal("show");
				}
				else {
					foundExtension = true;
					var status = pm.settings.getSetting("useInterceptor");

					if (status === true) {
						pm.settings.setSetting("useInterceptor", false);
					}
					else {
						pm.settings.setSetting("useInterceptor", true);
					}

					view.setIcon();
				}
			});
		}
	}
});