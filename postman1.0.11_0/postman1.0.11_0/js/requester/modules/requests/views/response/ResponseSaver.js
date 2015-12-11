var ResponseSaver = Backbone.View.extend({
    initialize: function() {
    	var model = this.model;
    	var view = this;

    	$("#response-sample-save-start").on("click", function() {
    		view.showSaveForm();
    	});

	    $("#response-sample-save").on("click", function() {
	    	view.saveResponse();
	    });

	    $("#response-sample-cancel").on("click", function() {
	    	view.cancelSaveResponse();
	    });
    },

    showSaveForm: function() {
		$("#response-sample-save-start").css("display", "none");
		$("#response-sample-save-form").css("display", "block");
    },

    hideSaveForm: function() {
    	$("#response-sample-save-start").css("display", "block");
    	$("#response-sample-save-form").css("display", "none");
    },

    // This needs the request model to be up to date
    saveResponse: function() {
        var view = this;

        pm.mediator.trigger("updateRequestModel", function() {
            view.hideSaveForm();

            var name = $("#response-sample-name").val();

            var response = view.model.get("response");
            $("#response-sample-name").val("");
            response.saveAsSample(name);
        });
    },

    cancelSaveResponse: function() {
        $("#response-sample-name").val("");
    	this.hideSaveForm();
    }
});