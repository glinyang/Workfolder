var AppUpdateNotifier = Backbone.Model.extend({
	initialize: function() {
		pm.mediator.on("showVersionNotice", this.showVersionNotice, this);
		console.log("Checking for update notifications...");
		chrome.storage.local.get("lastKnownVersion", function (results) {
			var currentVersion = chrome.runtime.getManifest()["version"];
			if (!results.lastKnownVersion) {
				results.lastKnownVersion = "blank";
			}
			if (results.lastKnownVersion) {
				var lastVersion = results.lastKnownVersion;
				console.log("Stored version: " + lastVersion+", currentVersion: "+currentVersion);
				if (lastVersion !== currentVersion) {
					setTimeout(function() {
						pm.mediator.trigger("showVersionNotice", currentVersion);
					},2500);
				}
			}
			chrome.storage.local.set({"lastKnownVersion": currentVersion});
		});
	},

	showVersionNotice: function(version) {
		//version should be of the form "1.0.0.1"
		var processedVersion = version.replace(/\./g, "-");
		var templateName = "version_"+processedVersion;
		if(Handlebars.templates.hasOwnProperty(templateName)) {
			console.log("Showing notification for "+templateName);
			$("#modal-update-notif .modal-body").html("").append(Handlebars.templates[templateName]());
			$("#modal-update-notif").modal("show");
		}
	}
});