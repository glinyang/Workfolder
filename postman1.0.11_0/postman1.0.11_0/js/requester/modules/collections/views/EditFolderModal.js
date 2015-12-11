var EditFolderModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        model.on("showEditFolderModal", this.render, this);

        pm.mediator.on("switchCodeMirrorTheme", this.onSwitchCodeMirrorTheme, this);

        $('#form-edit-folder').submit(function() {
            var id = $('#form-edit-folder .folder-id').val();
            var name = $('#form-edit-folder .folder-name').val();
            var description = view.editor.getValue();
            model.updateFolderMeta(id, name, description);
            $('#modal-edit-folder').modal('hide');
            return false;
        });

        $('#modal-edit-folder .btn-primary').click(function () {
            var id = $('#form-edit-folder .folder-id').val();
            var name = $('#form-edit-folder .folder-name').val();
            var description = view.editor.getValue();
            model.updateFolderMeta(id, name, description);
            $('#modal-edit-folder').modal('hide');
        });

        $("#modal-edit-folder").on("shown", function () {
            $("#modal-edit-folder .folder-name").focus();
            pm.app.trigger("modalOpen", "#modal-edit-folder");
        });

        $("#modal-edit-folder").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        $("#modal-edit-folder").on('keydown', 'div.input', function (event) {
            if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
                $('#form-edit-folder').submit();
                event.preventDefault();
                return false;
            }

            return true;
        });
    },

    onSwitchCodeMirrorTheme: function(theme) {
        var codeMirror = pm.editFolderEditor;

        if (codeMirror) {
            codeMirror.setTheme("ace/theme/"+theme);
        }
    },

    initializeEditor: function() {
        if (this.editor) {
            return;
        }

        this.editor = ace.edit(document.getElementById("edit-folder-description"));

        var theme = (pm.settings.getSetting("postmanTheme")==="light")?"clouds":"monokai";
        this.editor.setTheme("ace/theme/"+theme);
        this.editor.getSession().setMode('ace/mode/markdown');
        pm.editFolderEditor = this.editor;
    },

    render: function(folder) {
        // console.log("Render edit folder");

        $('#form-edit-folder .folder-id').val(folder.id);
        $('#form-edit-folder .folder-name').val(folder.name);

        $('#modal-edit-folder').modal('show');

        if (!this.editor) {
            this.initializeEditor();
        }

        var view = this;

        setTimeout(function() {
            view.editor.setValue(folder.description, -1);
            view.editor.gotoLine(0,0,false);
        }, 100);
    }
});
