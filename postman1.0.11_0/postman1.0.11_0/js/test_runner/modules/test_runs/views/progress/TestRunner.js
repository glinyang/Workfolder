    var TestRunner = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        this.files = [];
        this.fileDataType = "undetermined";

        var testRunProgressHeader = new TestRunProgressHeader({model: this.model});
        var testRunProgress = new TestRunProgress({model: this.model.get("testRuns")});

        model.on("loadedCollections", this.renderCollections, this);
        model.on("loadedEnvironments", this.renderEnvironments, this);

        var environments = model.get("envManager").get("environments");
        environments.on('change', this.renderEnvironments, this);
        environments.on('reset', this.renderEnvironments, this);
        environments.on('add', this.renderEnvironments, this);
        environments.on('remove', this.renderEnvironments, this);

        var collections = model.get("collections");

        collections.on("add", this.renderCollections, this);
        collections.on("remove", this.renderCollections, this);
        collections.on("updateCollection", this.renderCollections, this);

        $("#start-test-run").on("click", function() {
            view.startRun();
        });

        $('#test-data-file-input').on('change', function (event) {
            var files = event.target.files;
            view.files = files;

            $('#test-data-file-type-container').css("display", "block");

            var fileType = view.getFileType(view.files);
        });

	    $('#test-data-file-type').on('change', function(event) {
		    view.fileDataType = $("#test-data-file-type").val();
		    $("#test-data-file-remove-container").css("display", "block");
		    if (view.files.length > 0) {
			    var file = view.files[0];
			    pm.mediator.trigger('selectedDataFile', view.fileDataType, file);
		    }
	    });

        $('#test-data-file-remove').on("click", function() {
            view.files = [];
            view.fileDataType = "undetermined";
            $('#test-data-file-input').val("");
            $("#test-data-file-remove-container").css("display", "none");
            $('#test-data-file-type-container').css("display", "none");
        });
    },

	getFileType: function(files) {
	    var view = this;
	    if (files.length > 0) {
		    var file = files[0];
		    if (file.type.has("csv") || file.type.has("excel") || file.type.has("comma-separated-values")) {
			    view.fileDataType = "csv";
			    $("#test-data-file-type").val("csv");
		    }
		    else if(file.type.has("json")) {
			    view.fileDataType = "json";
			    $("#test-data-file-type").val("json");
		    }
		    else {
			    view.fileDataType = "undetermined";
			    $("#test-data-file-type").val("undetermined");
		    }
		    pm.mediator.trigger('selectedDataFile', view.fileDataType, file);
	    }
    },

    renderCollections: function() {
        var model = this.model;
        var items = _.clone(model.get("collections").toJSON());

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

        $("#select-collection").html("");
        $('#select-collection').html("<option value='0'>Select</option>");
        $('#select-collection').append(Handlebars.templates.collection_selector_list({items: items}));
    },

    renderEnvironments: function() {
        var model = this.model;
        var items = _.clone(model.get("envManager").get("environments").toJSON());
        $("#select-environment").html("");
        $('#select-environment').html("<option value='0'>No environment</option>");
        $('#select-environment').append(Handlebars.templates.environment_list({items: items}));
    },

    startRun: function() {
        var view = this;
        var target_id = $("#select-collection").val();
        if(target_id==="0") {
            pm.mediator.trigger("notifyError", "Please select a collection to begin the test run");
            return;
        }
        var target_type = $("#select-collection option[value='" + target_id + "']").attr("data-type");

        var collection_id = 0;
        var folder_id = 0;

        if (target_type === "folder") {
            folder_id = target_id;
            collection_id = $("#select-collection option[value='" + target_id + "']").attr("data-collection-id");
        }
        else {
            collection_id = target_id;
        }

        var environment_id = $("#select-environment").val();
        var count = parseInt($("#test-run-count").val(), 10);
        var delay = parseInt($("#test-run-delay").val(), 10);

        var params = {
            "collection_id": collection_id,
            "folder_id": folder_id,
            "target_type": target_type,
            "environment_id": environment_id,
            "delay": delay,
            "count": count,
            "files": view.files,
            "fileDataType": view.fileDataType
        };

        pm.mediator.trigger("startTestRun", params);
    }
    });