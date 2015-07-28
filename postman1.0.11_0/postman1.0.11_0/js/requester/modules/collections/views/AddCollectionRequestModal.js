var AddCollectionRequestModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        pm.mediator.on("switchCodeMirrorTheme", this.onSwitchCodeMirrorTheme, this);

        view.pendingDescription = null;

        model.on("add", this.onChanged, this);
        model.on("remove", this.onChanged, this);
        model.on("change", this.onChanged, this);

        model.on("updateCollection", this.onChanged, this);
        model.on("updateCollectionMeta", this.onChanged, this);

        model.on("addFolder", this.onChanged, this);
        model.on("updateFolder", this.onChanged, this);
        model.on("deleteFolder", this.onChanged, this);

        var view = this;

        $('#form-add-to-collection').submit(function () {
            _.bind(view.addRequestToCollection, view)();
            $('#modal-add-to-collection').modal('hide');
            $('#new-collection').val("");
        });

        $('#modal-add-to-collection .btn-primary').click(function () {
            _.bind(view.addRequestToCollection, view)();
            $('#modal-add-to-collection').modal('hide');
            $('#new-collection').val("");
        });

        $("#modal-add-to-collection").on("shown", function () {            
            $("#select-collection").focus();
            pm.app.trigger("modalOpen", "#modal-add-to-collection");

            if (!view.editor) {
                view.initializeEditor();
            }
        });

        $("#modal-add-to-collection").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

	    $("#modal-add-to-collection").on('keydown', 'div.input', function (event) {
		    if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
			    $('#form-add-to-collection').submit();
			    event.preventDefault();
			    return false;
		    }

		    return true;
	    });

	    $("#modal-add-to-collection").keydown(function (event) {
		    if (event.keyCode === 13) {
			    $('#form-add-to-collection').submit();
			    event.preventDefault();
			    return false;
		    }

		    return true;
	    });

        //Initialize select-collection options

        $(document).bind('keydown', 'a', function () {
            if(pm.app.isModalOpen()) {
                return;
            }

            $('#modal-add-to-collection').modal({
                keyboard:true
            });

            $('#modal-add-to-collection').modal('show');
            return false;
        });

        pm.mediator.on("showAddCollectionModal", this.onShowAddCollectionModal, this);
    },

    onSwitchCodeMirrorTheme: function(theme) {
        var codeMirror = pm.addRequestToCollectionEditor;

        if (codeMirror) {
            codeMirror.setTheme("ace/theme/"+theme);
        }
    },

    onShowAddCollectionModal: function(name, description) {
        var view = this;

        $("#new-request-name").val(name);

        if (this.editor) {
            if (description) {
                this.editor.setValue(description, -1);
            }
            else {
                this.editor.setValue("", -1);
            }

            this.pendingDescription = null;
            
        }
        else {
            this.pendingDescription = description;
        }        

        $("#modal-add-to-collection").modal("show");
    },


    initializeEditor: function() {
        if (this.editor) {
            return;
        }

        this.editor = ace.edit(document.getElementById("new-request-description"));

        var theme = (pm.settings.getSetting("postmanTheme")==="light")?"clouds":"monokai";
        this.editor.setTheme("ace/theme/"+theme);
        this.editor.getSession().setMode('ace/mode/markdown');
        pm.addRequestToCollectionEditor = this.editor;

        if (this.pendingDescription) {
            this.editor.setValue(this.pendingDescription, -1);
            this.pendingDescription = null;
        }
        else {
            this.editor.setValue("", -1);
            this.pendingDescription = null;
        }

    },

    add: function(model, pmCollection) {
        $('#select-collection').append(Handlebars.templates.item_collection_selector_list(model.toJSON()));
    },

    remove: function(model, pmCollection) {
        var collection = model.toJSON();
        $('#select-collection option[value="' + collection.id + '"]').remove();
    },

    onChanged: function() {        
        var items = _.clone(this.model.toJSON());
        var folders;

        for(var i = 0; i < items.length; i++) {
            if("folders" in items[i]) {
                folders = items[i].folders;

                folders.sort(sortAlphabetical);

                for(var j = 0; j < folders.length; j++) {
                    folders[j].collection_name = items[i].name;
                    folders[j].collection_id = items[i].id;
                }
            }
        }

        $('#select-collection').html("<option>Select</option>");
        $('#select-collection').append(Handlebars.templates.collection_selector_list({items: this.model.toJSON()}));

        $('#select-collection').val(this.lastSelectValue);
    },

    addRequestToCollection: function() {
        var selectValue = $("#select-collection").val();
        this.lastSelectValue = selectValue;

        var $option = $("#select-collection option[value='" + selectValue + "']");
        var targetType = $option.attr("data-type");

        var collectionId;
        var folderId;

        if (targetType === "collection") {
            collectionId = $option.attr("data-collection-id");
        }
        else if (targetType === "folder") {
            collectionId = $option.attr("data-collection-id");
            folderId = $option.attr("data-folder-id");
        }

        var newCollection = $("#new-collection").val();

        var collection = {};

        if (newCollection) {
            targetType = "collection";
            collection.id = guid();
            collection.name = newCollection;
        }
        else {
            collection.id = collectionId;
        }

        var newRequestName = $('#new-request-name').val();
        var newRequestDescription = this.editor.getValue();

        var model = this.model;

        pm.mediator.trigger("getRequest", function(request) {
            var body = request.get("body");

            var url = request.get("url");
            if (newRequestName === "") {
                newRequestName = url;
            }

            var currentHelper = pm.helpers.getActiveHelperType();
	        var helperData, helperAttributes, saveHelperToRequest;
	        if(currentHelper!=="normal") {
                helperData = pm.helpers.getHelper(currentHelper).attributes;
                helperAttributes = request.getHelperProperties(helperData);
		        saveHelperToRequest = $("#request-helper-"+currentHelper+"-saveHelper").is(":checked");
	        }
	        else {
		        saveHelperToRequest = false;
	        }

            if(saveHelperToRequest===false) {
                currentHelper = "normal";
                helperAttributes = {};
            }

            // TODO Get some of this from getAsJson
            var collectionRequest = {
                id: guid(),
                headers: request.getPackedHeaders(),
                url: url,
                pathVariables: request.get("pathVariables"),
                preRequestScript: request.get("preRequestScript"),
                method: request.get("method"),
                data: body.get("dataAsObjects"),
                dataMode: body.get("dataMode"),
                name: newRequestName,
                description: newRequestDescription,
                descriptionFormat: "html",
                time: new Date().getTime(),
                version: 2,
                responses: [],
                tests: request.get("tests"),
                currentHelper: currentHelper,
                helperAttributes: helperAttributes
            };

            if (targetType === "folder") {
                model.addRequestToFolder(collectionRequest, collectionId, folderId);
            }
            else {
                model.addRequestToCollection(collectionRequest, collection);
            }
        });
    }
});