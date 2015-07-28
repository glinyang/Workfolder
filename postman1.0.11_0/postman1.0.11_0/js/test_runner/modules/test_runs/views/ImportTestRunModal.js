var ImportTestRunModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;

        pm.mediator.on("importedTestRun", this.addAlert, this);

        var dropZone = document.getElementById('import-test-run-dropzone');
        dropZone.addEventListener('dragover', function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        }, false);

        dropZone.addEventListener('drop', function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            var files = evt.dataTransfer.files; // FileList object.

            model.importTestRun(files);
        }, false);

        $('#test-run-files-input').on('change', function (event) {
            var files = event.target.files;
            model.importTestRuns(files);
            $('#test-run-files-input').val("");
        });

        $("#modal-import-test-run").on("shown", function () {
            pm.app.trigger("modalOpen", "#modal-import-test-run");
        });

        $("#modal-import-test-run").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        pm.mediator.on("failedTestRunImport", function() {
            noty(
                {
                    type:'error',
                    text:'Failed importing test run. Check your file again.',
                    layout:'topCenter',
                    timeout:750
                });
        });
    },

    addAlert: function(testRun) {
        var data = testRun.getAsJSON();
        $('.modal-import-alerts').append(Handlebars.templates.message_test_run_added(data));
    }
});