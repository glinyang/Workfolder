var RequestTestsEditorSnippets = Backbone.View.extend({
	initialize: function() {
		var model = this.model;
		var view = this;

		this.render();

		pm.mediator.on("onShowSnippets", function() {
			view.showSnippets();
		});

		$("#request-tests-editor-snippets-minimize").on("click", function() {
			view.hideSnippets();
		});

		$("#request-tests-editor-snippets-list").on("click", ".test-snippet a", function() {
			// console.log("Add snippet");
			var id = $(this).attr("data-id");
			model.addSnippet(id);
		});
	},

	hideSnippets: function() {				
		pm.settings.setSetting("hideSnippets", true);		
		$(".request-tests-editor-snippets").css("display", "none");

		pm.mediator.trigger("onHideSnippets");
	},

	showSnippets: function() {		
		$(".request-tests-editor-snippets").css("display", "block");
	},

	render: function() {		
		$("#request-tests-editor-snippets-list").html("");
		$("#request-tests-editor-snippets-list").append(Handlebars.templates.test_snippets_list({"items": this.model.toJSON()}));
	}
});