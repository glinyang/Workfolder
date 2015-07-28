var DataPreviewModal = Backbone.View.extend({
    initialize: function() {
        pm.mediator.on("selectedDataFile", this.handleDataFile, this);
    },

    handleDataFile: function(type, file) {
        var fileReader = new FileReader();
        var oldThis = this;
        fileReader.onload = function(e) {
            pm.testRuns.loadDataFromFile(e.target.result, fileReader.fileType, function(arr) {
                    oldThis.showTableFromArray(arr);
                },
                function() {
                    $("#previewDataButton").hide();
                    $("#modal-data-preview").modal('hide');
                }
            );
        }

        fileReader.fileType = type;
        fileReader.readAsText(file);
    },

    showTableFromArray: function(arr) {
        var firstRow = arr[0];
        var keys = [""];
        var tableHTML = "<table class='table table-condensed table-hover'><thead><tr><th>Iteration</th>";
        for(var key in firstRow) {
            if(firstRow.hasOwnProperty(key)) {
                key = _.escape(key);
                keys.push(key);
                tableHTML+=("<th>"+key+"</th>");
            }
        }
        tableHTML+=("</tr></thead><tbody>");
        var numKeys = keys.length;
        var numRows = arr.length;
        for(var i=0;i<numRows;i++) {
            tableHTML+=("<tr><td>"+(i+1)+"</td>");
            var j;
            for(j=1;j<numKeys;j++) { //to exclude first key
                tableHTML+=("<td>"+ _.escape(arr[i][_.unescape(keys[j])])+"</td>");
            }
            tableHTML+=("</tr>");
        }
        tableHTML+=("</tbody></table>");
        $("#data-preview-table-container").html(tableHTML);

	    this.adjustModalWidth();

        $("#previewDataButton").show();
    },

	adjustModalWidth: function() {
		var $container = $("#data-preview-table-container");
		var $table = $("#data-preview-table-container tbody");

		$container.css({ position: "absolute", visibility: "hidden", display: "block" });
		$table.css({ position: "absolute", visibility: "hidden", display: "block" });
		var defaultWidth = 	$("#data-preview-table-container").width();
		var tableWidth = $("#data-preview-table-container tbody").width();
		$table.css({ position: "", visibility: "", display: "" });
		$container.css({ position: "", visibility: "", display: "" });

	},
});