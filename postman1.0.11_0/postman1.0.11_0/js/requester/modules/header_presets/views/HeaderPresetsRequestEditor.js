var HeaderPresetsRequestEditor = Backbone.View.extend({
    initialize: function() {
        var view = this;

        this.model.on('add', this.render, this);
        this.model.on('remove', this.render, this);

        var model = this.model;

        var params = {
            placeHolderKey:"Key",
            placeHolderValue:"Value",
            deleteButton:'<span class="icon-delete"/>'
        };

        $("#header-presets-keyvaleditor").keyvalueeditor("init", params);

        $("#headers-keyvaleditor-actions-manage-presets").on("click", function () {
            $("#modal-header-presets").modal("show");
        });

        $("#headers-keyvaleditor-actions-add-preset").on("click", ".header-preset-dropdown-item", function() {
            var id = $(this).attr("data-id");
            var preset = model.getHeaderPreset(id);
            var headers = $('#headers-keyvaleditor').keyvalueeditor('getValues');

            var newHeaders = _.union(headers, preset.get("headers"));
            $('#headers-keyvaleditor').keyvalueeditor('reset', newHeaders);
            view.setHeadersInTextarea(newHeaders);
        });
    },

    render: function() {
        $('#headers-keyvaleditor-actions-add-preset ul').html("");
        $('#headers-keyvaleditor-actions-add-preset ul').append(Handlebars.templates.header_preset_dropdown({"items":this.model.toJSON()}));
    },

    //is called when a new header is added in the form
    setHeadersInTextarea: function(headers) {
        var ta = $("textarea#headers-direct");
        var numHeaders = headers.length;
        var str="";
        for(i=0;i<numHeaders;i++) {
            str+=headers[i]["key"]+": "+headers[i]["value"]+"\n";
        }
        ta.val(str);
        $("#headers-textarea-message").html("Enter headers in \"key\":\"value\" format.");
        $("#headers-textarea-message").removeClass('wrong-header');
        //#headers-textarea-message.wrong-header
    }
});