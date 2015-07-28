var CurlCapture = Backbone.Model.extend({
	defaults: function() {
		return {
		}
	},

	initialize: function() {
		pm.mediator.on("onMessageExternal", this.onMessageExternal, this);
	},

	onMessageExternal: function(request, sender, sendResponse) {
		if(request.curlImportMessage) {
			var curlCommandToImport = request.curlImportMessage.curlText;
			this.importCurl(curlCommandToImport);
		}
	},

	importCurl: function(rawText) {
		var fileFormat = pm.collections.guessFileFormat(rawText);
		if(fileFormat===0) {
			pm.mediator.trigger("failedCollectionImport", "format not recognized");
			return;
		}
		pm.collections.importData(rawText, fileFormat);
	}

});