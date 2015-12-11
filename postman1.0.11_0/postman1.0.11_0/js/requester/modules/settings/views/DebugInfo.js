var DebugInfo = Backbone.View.extend({
	initialize: function() {
		var model = this.model;
		var view = this;

		this.render();		
	},

	render: function() {
		var manifest = chrome.runtime.getManifest();
		$('.postman-version').html("Version " + manifest.version + " (packaged)");

		chrome.runtime.getPlatformInfo(function(platformInfo) {
			var osInfo = "OS: <strong>" + platformInfo.os + "</strong><br/>";
			osInfo += "Architecture: <strong>" + platformInfo.arch + "</strong><br/>";
			osInfo += "Native client architecture: <strong>" + platformInfo.nacl_arch + "</strong><br/>";

			$('.postman-os-info').html(osInfo);
		});
	}
});