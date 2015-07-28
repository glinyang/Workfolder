var Purchase = Backbone.Model.extend({
	defaults: function() {
		return {
			"id": "",
			"license_key": "",
			"timestamp": "",
			"is_beta": false, // is_beta is for non-production versions
			"is_trial": false,
			"trial_completed": false,
			"trial_start_time": 0,
			"trial_elapsed_time": 0,
			"trial_end_time": 0,
			"trial_duration": postman_trial_duration // All times in millisecs
		}
	},

	isPurchased: function() {
		if (this.get("license_key") !== "") {
			return true;
		}
		else {
			return false;
		}
	},

	isTrialCompleted: function() {
		return this.get("trial_completed");
	},

	getDaysLeft: function() {
		var startTime = this.get("trial_start_time");
		var elapsedTime = this.get("trial_elapsed_time");

		var days = Math.round(14 - (elapsedTime - startTime) / (1000 * 60 * 60 * 24));
		return days;
	},

	isTrialValid: function() {
		var startTime = this.get("trial_start_time");
		var elapsedTime = this.get("trial_elapsed_time");
		var duration = this.get("trial_duration");
		var completed = this.get("trial_completed");

		if (startTime === 0 || completed === true) {
			return false;
		}
		else {
			if (elapsedTime - startTime <= duration) {
				return true;
			}
			else {
				return false;
			}
		}
	}
});
var Purchases = Backbone.Collection.extend({
	model: Purchase,

	initialize: function() {
		var collection = this;

		this.loadPurchases();

		pm.mediator.on("startTrial", this.onStartTrial, this);

		pm.mediator.on("purchaseComplete", this.onPurchaseComplete, this);
		pm.mediator.on("loadedPurchasesFromServer", this.onLoadedPurchasesFromServer, this);

		pm.mediator.on("postmanInitialized", function() {
			pm.mediator.trigger("loadedPurchases", collection);
		});

		pm.mediator.on("loadedPurchases", function() {
			// Check for trials. Update elapsed trial time
			collection.updateTrialElapsedTimes();
		});
	},

	onStartTrial: function(key) {
		this.startTrial(key);
	},

	isTrialCompleted: function(key) {
		var purchase = this.get(key);

		if (purchase) {
			return purchase.isTrialCompleted();
		}
		else {
			return false;
		}

	},

	isUpgradeAvailable: function(key) {
		var purchase = this.get(key);

		if (postman_all_purchases_available) {
			return true;
		}
		else {
			if (!purchase) {
				return false;
			}
			else {
				if (purchase.get("license_key") !== "" || purchase.isTrialValid()) {
					return true;
				}
				else {
					return false;
				}
			}
		}
	},

	onPurchaseComplete: function(newPurchase) {
		var p = new Purchase();
		p.set("id", newPurchase.id);
		p.set("license_key", newPurchase.license_key);
		p.set("timestamp", new Date().getTime());
		p.set("is_beta", newPurchase.is_beta);

		this.add(p, { merge: true });

		this.savePurchases();
	},

	onLoadedPurchasesFromServer: function(data) {
		// Do not override if a trial is already active
		// and the purchases length is 0
		if (data.hasOwnProperty("purchases")) {
			if (data.purchases.length > 0) {
				this.reset([]);
				var purchases = data.purchases;
				for(var i = 0; i < purchases.length; i++) {
					purchases[i].timestamp = new Date(purchases[i].created_at).getTime();
				}

				this.add(data.purchases, { merge: true });

				this.savePurchases();

				pm.mediator.trigger("loadedPurchases", this);
			}
		}
	},

	loadPurchases: function() {
		var collection = this;

		pm.storage.getValue("purchases", function(kvpair) {
			if (kvpair != null) {
				collection.add(kvpair);
			}

			pm.mediator.trigger("loadedPurchases", this);
		});
	},

	savePurchases: function() {
		var purchases = {
			"purchases": this.toJSON()
		};

		pm.storage.setValue(purchases, function() {
			console.log("Purchase saved");
		})
	},

	// TODO Need to add body
	startTrial: function(key) {
		var p = new Purchase();
		p.set("id", key);
		p.set("license_key", "");
		p.set("timestamp", new Date().getTime());
		p.set("is_beta", false);

		p.set("is_trial", true);
		p.set("trial_completed", false);
		p.set("trial_start_time", new Date().getTime());
		p.set("trial_elapsed_time", new Date().getTime());
		p.set("trial_end_time", 0);
		p.set("trial_duration", postman_trial_duration); // Change this to a configurable setValue

		this.add(p, { merge: true });

		this.savePurchases();

		pm.mediator.trigger("loadedPurchases", this);

		// TODO trackEvent call
		pm.mediator.trigger("onTrialStart", p);
	},

	// key and id are the same
	endTrial: function(key) {
		var p = this.get(key);

		p.set("trial_elapsed_time", new Date().getTime());
		p.set("trial_completed", true);
		p.set("trial_end_time", new Date().getTime());

		this.add(p, { merge: true });

		this.savePurchases();

		// TODO trackEvent call
		pm.mediator.trigger("onTrialEnd", p);
	},

	updateTrialElapsedTimes: function() {
		var i;
		var p;

		for (i = 0; i < this.models.length; i++) {
			p = this.models[i];

			if (!p.isPurchased()) {
				if (!p.isTrialCompleted()) {
					if (!p.isTrialValid()) {
						this.endTrial(p.get("id"));
					}
					else {
						p.set("trial_elapsed_time", new Date().getTime());
						this.add(p, { merge: true });
						this.savePurchases();
					}
				}
			}
		}
	}


});