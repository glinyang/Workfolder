var User = Backbone.Model.extend({
	defaults: function() {
	    return {
	        "id": 0,
	        "name": "",
	        "access_token": "",
	        "refresh_token": "",
	        "expires_in": 0,
	        "logged_in_at": 0,
	        "link": "",
		    "expiredToken": true,
	        "collections": []
	    };
	},

	setDefaults: function() {
		this.set("id", 0);
		this.set("name", "");
		this.set("access_token", "");
		this.set("refresh_token", "");
		this.set("expires_in", 0);
		this.set("link", "");

		if (pm.features.isFeatureEnabled(FEATURES.USER)) {
			pm.storage.setValue({"user": this.toJSON()}, function() {
			});
		}
	},

	initialize: function() {
		var model = this;

		pm.storage.getValue("user", function(u) {
			if (u) {
				model.set("id", u.id);
				model.set("name", u.name);
				model.set("access_token", u.access_token);
				model.set("refresh_token", u.refresh_token);

				var expires_in = parseInt(u.expires_in, 10);

				model.set("expires_in", expires_in);
				model.set("logged_in_at", u.logged_in_at);

				var isTokenValid = model.isTokenValid();
				if(!isTokenValid) {
					model.set("expiredToken",true);
				}
				else {
					model.set("expiredToken",false);
				}

				if (pm.features.isFeatureEnabled(FEATURES.USER)) {
					if (u.id !== 0) {
						if(!isTokenValid) {
							pm.api.exchangeRefreshToken(function() {
								model.set("expiredToken",false);
								model.getCollections(function(){
									model.getPurchases();
								});
								model.trigger("login", model);
							});
						}
						else {
							model.getCollections(function(){
								model.getPurchases();
							});
							model.trigger("login", model);
						}
					}

				}
			}
		});

		pm.mediator.on("receiveTokenFromPurchaseFlow", this.receiveTokenFromPurchaseFlow, this);
		pm.mediator.on("refreshSharedCollections", this.getCollections, this);
		pm.mediator.on("downloadSharedCollection", this.onDownloadSharedCollection, this);
		pm.mediator.on("deleteSharedCollection", this.onDeleteSharedCollection, this);
		pm.mediator.on("invalidAccessToken", this.onTokenNotValid, this);
		pm.mediator.on("downloadAllSharedCollections", this.onDownloadAllSharedCollections, this);

		pm.mediator.on("onMessageExternal", function(request, sender, sendResponse) {
			if (request) {
				if (request.postmanMessage) {
					if (request.postmanMessage.type === "token") {
						pm.mediator.trigger("receiveTokenFromPurchaseFlow", request.postmanMessage.token);
						sendResponse({"result":"success"});
					}
				}
			}
		});
	},

	isTokenValid: function() {
		var expiresIn = this.get("expires_in");
		var loggedInAt = this.get("logged_in_at");

		var now = new Date().getTime();

		if (loggedInAt + expiresIn > now) {
			return true;
		}
		else {
			return false;
		}
	},


	onTokenNotValid: function() {
		// Indicate error
	},

	isLoggedIn: function() {
		return (this.get("id") !== 0 && this.get("expiredToken") !== true);
	},

	setAccessToken: function(data) {
		var model = this;

		var expires_in = parseInt(data.expires_in, 10);

		model.set("access_token", data.access_token);
		model.set("refresh_token", data.refresh_token);
		model.set("expires_in", expires_in);
		model.set("logged_in_at", new Date().getTime());
		model.set("expiredToken",false);

		pm.storage.setValue({"user": model.toJSON()}, function() {
		});
	},

	getRemoteIdForCollection: function(id) {
		var collections = this.get("collections");
		var index = arrayObjectIndexOf(collections, id, "id");

		if (index >= 0) {
			return collections[index].remote_id;
		}
		else {
			return 0;
		}
	},

	login: function() {
		var model = this;
		var appId = chrome.runtime.id;
		chrome.identity.launchWebAuthFlow({'url': pm.webUrl + '/signup?appId='+appId, 'interactive': true},
			function(redirect_url) {
				if (chrome.runtime.lastError) {
					model.trigger("logout", model);
					pm.mediator.trigger("notifyError", "Could not initiate OAuth 2 flow");
				}
				else {
					var params = getUrlVars(redirect_url, true);

					model.set("id", params.user_id);
					model.set("name", decodeURIComponent(params.name));
					model.set("access_token", decodeURIComponent(params.access_token));
					model.set("refresh_token", decodeURIComponent(params.refresh_token));
					model.set("expires_in", parseInt(params.expires_in, 10));
					model.set("logged_in_at", new Date().getTime());
					model.set("expiredToken",false);

					pm.storage.setValue({"user": model.toJSON()}, function() {
					});

					model.getCollections();
					model.getPurchases();

					tracker.sendEvent('user', 'login', 'header');

					model.trigger("login", model);
					/* Extract token from redirect_url */
				}

			}
		);
	},

	receiveTokenFromPurchaseFlow: function(params) {
		var model = this;

		model.set("id", params.user_id);
		model.set("name", params.name);
		model.set("access_token", params.access_token);
		model.set("refresh_token", params.refresh_token);
		model.set("expires_in", parseInt(params.expires_in, 10));
		model.set("logged_in_at", new Date().getTime());

		pm.storage.setValue({"user": model.toJSON()}, function() {
		});

		model.getCollections();
		model.getPurchases();

		model.trigger("login", model);
	},

	logout: function() {
		var model = this;

		pm.api.logoutUser(this.get("id"), this.get("access_token"), function() {
			model.setDefaults();
			model.trigger("logout");
		});

	},

	getCollections: function(callback) {
		var model = this;

		if (this.isLoggedIn()) {
			pm.api.getUserCollections(function(data) {
		    	if (data.hasOwnProperty("collections")) {
			    	for(var i = 0; i < data.collections.length; i++) {
			    		c = data.collections[i];
			    		c.is_public = c.is_public === "1" ? true : false;
			    		c.updated_at_formatted = new Date(c.updated_at).toDateString();
			    	}

			    	model.set("collections", data.collections);
			    	model.trigger("change:collections");
				    if(callback) {
					    callback();
				    }
		    	}
			});
		}
	},

	getPurchases: function() {
		var model = this;

		if (this.isLoggedIn()) {
			pm.api.getUserPurchases(function(data) {
		    	if (data.hasOwnProperty("purchases")) {
			    	pm.mediator.trigger("loadedPurchasesFromServer", data);
		    	}
			});
		}
	},

	onDeleteSharedCollection: function(id) {
		var model = this;
		pm.api.deleteSharedCollection(id, function(data) {
			var collections = model.get("collections");
			var index = arrayObjectIndexOf(collections, id, "id");
			var collection = _.clone(collections[index]);

			if (index >= 0) {
				collections.splice(index, 1);
			}

			pm.mediator.trigger("deletedSharedCollection", collection);

			model.trigger("change:collections");
		});
	},

	downloadSharedCollection: function(id, callback) {
		pm.api.getCollectionFromRemoteId(id, function(data) {
			pm.mediator.trigger("overwriteCollection", data);
			pm.mediator.trigger("notifySuccess", "Downloaded collection: " + data.name);

			if (callback) {
				callback();
			}
		});
	},

	onDownloadSharedCollection: function(id) {
		this.downloadSharedCollection(id);
	},

	onDownloadAllSharedCollections: function() {
		var collections = this.get("collections");

		for(var i = 0; i < collections.length; i++) {
			this.downloadSharedCollection(collections[i].remote_id);
		}
	},

	getRemoteIdForLinkId: function(linkId) {
		var link = pm.webUrl + "/collections/" + linkId;

		var collections = this.get("collections");
		var index = arrayObjectIndexOf(collections, link, "link");

		if (index >= 0) {
			return collections[index].remote_id;
		}
		else {
			return 0;
		}
	}

});