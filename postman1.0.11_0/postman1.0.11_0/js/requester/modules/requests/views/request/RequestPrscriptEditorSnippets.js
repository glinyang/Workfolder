var RequestPrscriptEditorSnippets = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        this.render();

        pm.mediator.on("onShowPrscriptSnippets", function() {
            view.showPrscriptSnippets();
        });

        $("#request-prscript-editor-snippets-minimize").on("click", function() {
            view.hidePrscriptSnippets();
        });

        $("#request-prscript-editor-snippets-list").on("click", ".prscript-snippet a", function() {
            // console.log("Add snippet");
            var id = $(this).attr("data-id");
            model.addPrscriptSnippet(id);
        });
    },

    hidePrscriptSnippets: function() {
        pm.settings.setSetting("hidePrscriptSnippets", true);
        $(".request-prscript-editor-snippets").css("display", "none");

        pm.mediator.trigger("onHidePrscriptSnippets");
    },

    showPrscriptSnippets: function() {
        $(".request-prscript-editor-snippets").css("display", "block");
    },

    render: function() {
        $("#request-prscript-editor-snippets-list").html("");
        $("#request-prscript-editor-snippets-list").append(Handlebars.templates.prscript_snippets_list({"items": this.model.toJSON()}));
    }
});