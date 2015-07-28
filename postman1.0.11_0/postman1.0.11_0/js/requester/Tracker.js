var Tracker = Backbone.Model.extend({
	defaults: function() {
		return {
		}
	},

	initialize: function() {
		pm.mediator.once("onTrialStart", this.onTrialStart, this);
		pm.mediator.once("onTrialEnd", this.onTrialEnd, this);
		pm.mediator.on("onStartPurchase", this.onStartPurchase, this);
	},

	onStartPurchase: function() {
		if (tracker) {
			tracker.sendEvent('test_runner', 'collection_runner', 'buy');
		}		
	},

	onTrialStart: function() {
		if (tracker) {
			tracker.sendEvent('test_runner', 'collection_runner', 'trial_start');
		}		
	},

	onTrialEnd: function() {
		if (tracker) {
			console.log("trial_end event fired");
			tracker.sendEvent('test_runner', 'collection_runner', 'trial_end');
		}		
	}
});