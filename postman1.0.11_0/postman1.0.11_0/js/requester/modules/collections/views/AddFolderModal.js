var AddFolderModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        model.on("showAddFolderModal", this.render, this);

        pm.mediator.on("switchCodeMirrorTheme", this.onSwitchCodeMirrorTheme, this);

        $('#form-add-folder').submit(function () {
            var parentId = $('#add-folder-parent-id').val();
            var name = $('#add-folder-name').val();
            var description = view.editor.getValue();
            model.addFolder(parentId, name, description);
            $('#add-folder-name').val("");
            $('#modal-add-folder').modal('hide');
            return false;
        });

        $('#modal-add-folder .btn-primary').click(function () {
            var parentId = $('#add-folder-parent-id').val();
            var name = $('#add-folder-name').val();
            var description = view.editor.getValue();
            model.addFolder(parentId, name, description);
            $('#add-folder-name').val("");
            $('#modal-add-folder').modal('hide');
            return false;
        });

        $("#modal-add-folder").on("shown", function () {
            $("#add-folder-name").focus();
            pm.app.trigger("modalOpen", "#modal-add-folder");
            if (!view.editor) {
                view.initializeEditor();
            }
            setTimeout(function() {
                view.editor.setValue("", -1);
                //view.editor.refresh();
                view.editor.gotoLine(0,0,false);
            }, 150);
        });

        $("#modal-add-folder").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        $("#modal-add-folder").on('keydown', 'div.input', function (event) {
            if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
                $('#form-add-folder').submit();
                event.preventDefault();
                return false;
            }
            return true;
        });
    },

    onSwitchCodeMirrorTheme: function(theme) {
        var codeMirror = this.editor;

        if (codeMirror) {
            codeMirror.setTheme("ace/theme/"+theme);
        }
    },

    render: function(c) {
        $("#add-folder-header").html("Add folder inside " + c.get("name"));
        $("#add-folder-parent-id").val(c.get("id"));
        $('#modal-add-folder').modal('show');
    },

    initializeEditor: function() {
        if (this.editor) {
            return;
        }

        this.editor = ace.edit(document.getElementById("add-folder-description"));

        pm.addFolderEditor = this.editor;
        var theme = (pm.settings.getSetting("postmanTheme")==="light")?"clouds":"monokai";
        this.editor.setTheme("ace/theme/"+theme);
        this.editor.getSession().setMode('ace/mode/markdown');
    }
});
