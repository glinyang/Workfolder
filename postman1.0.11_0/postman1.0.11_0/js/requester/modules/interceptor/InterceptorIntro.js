var InterceptorIntro = Backbone.View.extend({
	initialize: function() {
		var model = this.model;
		var view = this;

		$("#modal-interceptor-intro").on("shown", function () {
            $("#interceptor-intro-name").focus();
            pm.app.trigger("modalOpen", "#modal-interceptor-intro");
        });

        $("#modal-interceptor-intro").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        $("#modal-interceptor-install").on("click", function() {
        	view.triggerInstall();
        });
	},

	triggerInstall: function() {
		console.log("Trigger install");
		var url = "https://chrome.google.com/webstore/detail/" + postman_interceptor_id;
		window.open(url);
	}
});