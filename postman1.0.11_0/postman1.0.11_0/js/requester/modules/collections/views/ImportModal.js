var ImportModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;

        model.on("importCollection", this.addAlert, this);
        pm.mediator.on("failedCollectionImport", this.onFailedImport, this);

        $('#import-submit-link').on("click", function () {
            var url = $('#importLink').val();
            model.importFileFromUrl(url);
            $('#import-submit-link').html("Importing...").attr('disabled','disabled');
        });

        var dropZone = document.getElementById('import-collection-dropzone');
        dropZone.addEventListener('dragover', function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        }, false);

        dropZone.addEventListener('drop', function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            var files = evt.dataTransfer.files; // FileList object.

            model.importFiles(files);
        }, false);

        $('#collection-files-input').on('change', function (event) {
            var files = event.target.files;
            model.importFiles(files);
            $('#collection-files-input').val("");
        });

        $("#modal-importer").on("shown", function () {
            pm.app.trigger("modalOpen", "#modal-importer");
        });

        $("#modal-importer").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        $('#import-submit-rawtext').on("click", function () {
            var rawText = $('#importRawText').val();
            var fileFormat = pm.collections.guessFileFormat(rawText);
            if(fileFormat===0) {
                pm.mediator.trigger("failedCollectionImport", "format not recognized");
                return;
            }
            pm.collections.importData(rawText, fileFormat);
        });

        pm.mediator.on("failedCollectionImport", function(reason) {
            if(reason) {
                reason = ": "+reason;
            }
            noty(
                {
                    type:'error',
                    text:'Failed to import data'+reason,
                    layout:'topCenter',
                    timeout:750
                });
        });

    },

    onFailedImport: function() {
        $('#import-submit-link').html("Import!").removeAttr('disabled');
    },

    addAlert: function(message) {
        $(".modal-import-alerts>.alert.alert-block").remove();
        $('#import-submit-link').html("Import!").removeAttr('disabled');
        if(message.type==="collection") {
            $('.modal-import-alerts').append(Handlebars.templates.message_collection_added(message));
        }
        else if(message.type==="request") {
            $('.modal-import-alerts').append(Handlebars.templates.message_request_added(message));
        }

    }
});