var EnvironmentManagerModal = Backbone.View.extend({
    environments: null,
    globals: null,
    setEnvTimeout: null,

    initialize: function() {
        this.environments = this.options.environments;
        this.globals = this.options.globals;

        this.environments.on('change', this.render, this);
        this.environments.on('reset', this.render, this);
        this.environments.on('add', this.render, this);
        this.environments.on('remove', this.render, this);
        this.environments.on("importedEnvironment", this.onImportedEnvironment, this);

        this.globals.on('change:globals', this.render, this);

        var environments = this.environments;
        var globals = this.globals;
        var view = this;

        $("#modal-environments").on("shown", function () {
            pm.app.trigger("modalOpen", "#modal-environments");
        });

        $("#modal-environments").on("hidden", function () {
            pm.app.trigger("modalClose");
            //view.showSelector();
        });

        $('#environments-list').on("click", ".environment-action-delete", function () {
            var id = $(this).attr('data-id');
            $('a[rel="tooltip"]').tooltip('hide');
            environments.deleteEnvironment(id);
        });

        $('#environments-list').on("click", ".environment-action-edit", function () {
            var id = $(this).attr('data-id');
            view.showEditor(id);
        });

        $('#environments-list').on("click", ".environment-action-duplicate", function () {
            var id = $(this).attr('data-id');
            environments.duplicateEnvironment(id);
        });

        $('#environments-list').on("click", ".environment-action-download", function () {
            var id = $(this).attr('data-id');
            environments.downloadEnvironment(id);
        });

        $('.environment-action-back').on("click", function () {
            view.showSelector();
        });

        $('#environment-files-input').on('change', function (event) {
            var files = event.target.files;
            console.log("Start importEnvironments");
            environments.importEnvironments(files);
            $('#environment-files-input').val("");
        });

        $('.environments-actions-add').on("click", function () {
            view.showEditor();
        });

        $('.environments-actions-import').on('click', function () {
            view.showImporter();
        });

        $('.environments-actions-manage-globals').on('click', function () {
            view.showGlobals();
        });

        $("#environment-globals-download").on('click', function() {
            view.downloadGlobals();
        });

        function submitEnvironmentEditorForm() {
            var id = $('#environment-editor-id').val();
            var name = $('#environment-editor-name').val();
            var values = $('#environment-keyvaleditor').keyvalueeditor('getValues');

            if (id === "0") {
                if(!name || name.length==0) {
                    $("#new-env-name-missing").show();
                    return;
                }
                else {
                    $("#new-env-name-missing").hide();
                }
                environments.addEnvironment(name, values);
            }
            else {
                environments.updateEnvironment(id, name, values);
            }

            $('#environment-editor-name').val("");
            $('#environment-keyvaleditor').keyvalueeditor('reset', []);

            view.showSelector();
        }

        $('#environment-editor-form').submit(function() {
            submitEnvironmentEditorForm();
        });

        $('.environments-actions-add-submit').on("click", function () {
            submitEnvironmentEditorForm();
        });

	    $("#environment-editor").keydown(function (event) {
		    if (event.keyCode === 13) {
			    submitEnvironmentEditorForm();
			    event.preventDefault();
			    return false;
		    }

		    return true;
	    });


	    $("#globals-editor").keydown(function (event) {
		    if (event.keyCode === 13) {
			    $("a.environments-actions-add-back").click();
			    event.preventDefault();
			    return false;
		    }

		    return true;
	    });

	    $('.environments-actions-add-back').on("click", function () {
            var values = $('#globals-keyvaleditor').keyvalueeditor('getValues');
            globals.saveGlobals(values);
            view.showSelector();
            $('#environment-editor-name').val("");
            $('#environment-keyvaleditor').keyvalueeditor('reset', []);
        });

        $('#environments-list-help-toggle').on("click", function (event) {
            var d = $('#environments-list-help-detail').css("display");
            if (d === "none") {
                $('#environments-list-help-detail').css("display", "inline");
                $(event.currentTarget).html("Hide");
            }
            else {
                $('#environments-list-help-detail').css("display", "none");
                $(event.currentTarget).html("Tell me more");
            }
        });

        var params = {
            placeHolderKey:"Key",
            placeHolderValue:"Value",
            deleteButton:'<span class="icon-delete"/>'
        };

        $('#environment-keyvaleditor').keyvalueeditor('init', params);
        $('#globals-keyvaleditor').keyvalueeditor('init', params);

        $(document).bind('keydown', 'e', function () {
            if(pm.app.isModalOpen()) {
                return;
            }

            $('#modal-environments').modal({
                keyboard:true
            });
        });

        this.render();
    },

    onImportedEnvironment: function(environment) {
        noty(
        {
            type:'success',
            dismissQueue: true,
            text:'Imported ' + environment.name,
            layout:'topCenter',
            timeout: 2500
        });
    },

    showEditor:function (id) {
        if (id) {
            var environment = this.environments.get(id).toJSON();
            $('#environment-editor-name').val(environment.name);
            $('#environment-editor-id').val(id);
            $('#environment-keyvaleditor').keyvalueeditor('reset', environment.values);
        }
        else {
            $('#environment-editor-id').val(0);
        }

        $('#environments-list-wrapper').css("display", "none");
        $('#environment-editor').css("display", "block");
        $('#globals-editor').css("display", "none");
        $("#new-env-name-missing").hide();
        $('#modal-environments .modal-footer').css("display", "block");
    },

    downloadGlobals: function() {
        pm.mediator.trigger("downloadGlobals");
    },

    showSelector:function () {
        $('#environments-list-wrapper').css("display", "block");
        $('#environment-editor').css("display", "none");
        $('#environment-importer').css("display", "none");
        $('#globals-editor').css("display", "none");
        $('.environments-actions-add-submit').css("display", "inline");
        $('#modal-environments .modal-footer').css("display", "none");
    },

    showImporter:function () {
        $('#environments-list-wrapper').css("display", "none");
        $('#environment-editor').css("display", "none");
        $('#globals-editor').css("display", "none");
        $('#environment-importer').css("display", "block");
        $('.environments-actions-add-submit').css("display", "none");
        $('#modal-environments .modal-footer').css("display", "block");
    },

    showGlobals:function () {
        $('#environments-list-wrapper').css("display", "none");
        $('#environment-editor').css("display", "none");
        $('#globals-editor').css("display", "block");
        $('#environment-importer').css("display", "none");
        $('.environments-actions-add-submit').css("display", "none");
        $('#modal-environments .modal-footer').css("display", "block");
    },

    render: function() {
        var oldThis = this;
        if(this.setEnvTimeout) {
            clearTimeout(this.setEnvTimeout);
        }
        this.setEnvTimeout = setTimeout(function() {
            $('#environments-list tbody').html("");
            $('#environments-list tbody').append(Handlebars.templates.environment_list({"items": oldThis.environments.toJSON()}));
            $('#environments-list tbody .environment-actions a[rel="tooltip"]').tooltip();
            $('#globals-keyvaleditor').keyvalueeditor('reset', oldThis.globals.get("globals"));
        },100);
    }
});