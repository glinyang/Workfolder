var AddCollectionModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        pm.mediator.on("switchCodeMirrorTheme", this.onSwitchCodeMirrorTheme, this);

        $('#form-new-collection').submit(function () {
            var name = $('#new-collection-blank').val();
            var description = view.editor.getValue();
            model.addCollection(name, description);
            $('#new-collection-blank').val("");
            $('#modal-new-collection').modal('hide');
            return false;
        });

        $('#modal-new-collection .btn-primary').click(function () {
            var name = $('#new-collection-blank').val();
            var description = view.editor.getValue();
            model.addCollection(name, description);
            $('#new-collection-blank').val("");
            $('#modal-new-collection').modal('hide');
            return false;
        });

        $("#modal-new-collection").on("shown", function () {
            $("#new-collection-blank").focus();
            pm.app.trigger("modalOpen", "#modal-new-collection");

            if (!view.editor) {
                view.initializeEditor();
            }
            setTimeout(function() {
                view.editor.setValue("", -1);
                //view.editor.refresh();
                view.editor.gotoLine(0,0,false);
            }, 150);
        });

        $("#modal-new-collection").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        $("#modal-new-collection").on('keydown', 'div.input', function (event) {
            if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
                $('#form-new-collection').submit();
                event.preventDefault();
                return false;
            }

            return true;
        });
    },

    onSwitchCodeMirrorTheme: function(theme) {
        var codeMirror = pm.addCollectionEditor;

        if (codeMirror) {
            codeMirror.setTheme("ace/theme/"+theme);
        }
    },

    initializeEditor: function() {
        if (this.editor) {
            return;
        }
        this.editor = ace.edit(document.getElementById("new-collection-description"));

        pm.addCollectionEditor = this.editor;
        var theme = (pm.settings.getSetting("postmanTheme")==="light")?"clouds":"monokai";
        this.editor.setTheme("ace/theme/"+theme);
    }
});
