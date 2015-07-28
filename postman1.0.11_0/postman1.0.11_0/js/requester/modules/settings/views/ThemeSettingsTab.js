var ThemeSettingsTab = Backbone.View.extend({
	initialize: function() {
		var model = this.model;
		var view = this;		

		$('#postman-theme').change(function () {
            pm.mediator.trigger("switchTheme", $("#postman-theme").val());
            view.hideSettings();
        });

        $("body").on("click",".theme-thumbnail", function() {
            $(".theme-thumbnail").removeClass("selected-theme-thumb");
            $(this).addClass("selected-theme-thumb");
            pm.mediator.trigger("switchTheme", $(this).attr('data-theme'));
        });

        pm.mediator.on("purchaseComplete", function(newPurchase) {
            if (newPurchase.id === "collection-runner") {
                view.hidePurchaseMessage();
            }
        });

        pm.mediator.on("loadedPurchases", function(purchases) {
            if (purchases.isUpgradeAvailable("collection-runner")) {
                console.log("ThemeSettingsTab: Purchase is available");

                view.hidePurchaseMessage();
            }
            else {
                console.log("ThemeSettingsTab: Purchase is not available");

                // TODO: Theme can be activated
                view.hidePurchaseMessage();

                // view.showPurchaseMessage();

                if (pm.purchases.isTrialCompleted("collection-runner")) {
                    console.log("ThemeSettingsTab: Trial completed");
                }
            }
        });

        this.render();
	},

	hideSettings: function() {
		$("#modal-settings").modal("hide");
	},

	hidePurchaseMessage: function() {
		$("#settings-theme-buy-message").css("display", "none");
        $("#settings-theme-form").css("display", "block");
	},

	showPurchaseMessage: function() {		
        $("#settings-theme-form").css("display", "none");
        $("#settings-theme-buy-message").css("display", "block");
	},

	render: function() {
		$('#postman-theme').val(this.model.getSetting("postmanTheme"));
        $(".theme-thumbnail").removeClass("selected-theme-thumb");
        $(".theme-thumbnail[data-theme='"+this.model.getSetting("postmanTheme")+"']").addClass("selected-theme-thumb");
	}
});