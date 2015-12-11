var EditCollectionModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        pm.mediator.on("switchCodeMirrorTheme", this.onSwitchCodeMirrorTheme, this);

        model.on("showEditModal", this.render, this);

        $('#form-edit-collection').submit(function() {
            var id = $('#form-edit-collection .collection-id').val();
            var name = $('#form-edit-collection .collection-name').val();
            var description = view.editor.getValue();
            model.updateCollectionMeta(id, name, description);
            $('#modal-edit-collection').modal('hide');
            return false;
        });

        $('#modal-edit-collection .btn-primary').click(function () {
            var id = $('#form-edit-collection .collection-id').val();
            var name = $('#form-edit-collection .collection-name').val();
            var description = view.editor.getValue();
            model.updateCollectionMeta(id, name, description);
            $('#modal-edit-collection').modal('hide');
        });

        $("#modal-edit-collection").on("shown", function () {
            $("#modal-edit-collection .collection-name").focus();
            pm.app.trigger("modalOpen", "#modal-edit-collection");
        });

        $("#modal-edit-collection").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        $("#modal-edit-collection").on('keydown', 'div.input', function (event) {
            if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
                $('#form-edit-collection').submit();
                event.preventDefault();
                return false;
            }

            return true;
        });
    },

    onSwitchCodeMirrorTheme: function(theme) {
        var codeMirror = pm.editCollectionEditor;

        if (codeMirror) {
            codeMirror.setTheme("ace/theme/"+theme);
        }
    },


    initializeEditor: function() {
        if (this.editor) {
            return;
        }

        this.editor = ace.edit(document.getElementById("edit-collection-description"));

        var theme = (pm.settings.getSetting("postmanTheme")==="light")?"clouds":"monokai";
        this.editor.setTheme("ace/theme/"+theme);
        this.editor.getSession().setMode('ace/mode/markdown');
        pm.editCollectionEditor = this.editor;
    },

    render: function(c) {
        var collection = c.toJSON();

        $('#form-edit-collection .collection-id').val(collection.id);
        $('#form-edit-collection .collection-name').val(collection.name);

        $('#modal-edit-collection').modal('show');

        if (!this.editor) {
            this.initializeEditor();
        }

        var view = this;

        setTimeout(function() {
            view.editor.setValue(collection.description, -1);
            view.editor.gotoLine(0,0,false);
        }, 100);
    }
});