var FEATURES = {
	USER: "user",
	DIRECTORY: "directory",
	DRIVE_SYNC: "drive_sync",
	TESTER: "tester"
};

var Features = Backbone.Model.extend({
	defaults: function() {
		var obj = {};
		obj[FEATURES.USER] = true;
		obj[FEATURES.DIRECTORY] = true;
		obj[FEATURES.DRIVE_SYNC] = false;
		obj[FEATURES.TESTER] = true;

	    return obj;
	},

	isFeatureEnabled: function(feature) {
		return this.get(feature);
	}
})