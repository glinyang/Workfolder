var HelperManager = Backbone.View.extend({
	initialize: function() {
		var model = this.model;

		var basicAuthForm = new BasicAuthForm({model: model.get("basicAuth")});
		var digestAuthForm = new DigestAuthForm({model: model.get("digestAuth")});
		var oAuth1Form = new OAuth1Form({model: model.get("oAuth1")});
		var oAuth2Manager = new OAuth2Manager({model: model.get("oAuth2")});

		this.model.on("change:activeHelper", this.render, this);

		var request = model.get("request");

		request.on("loadRequest", this.onLoadRequest, this);

		var view = this;

		$("#request-types .request-helper-tabs li").on("click", function () {
			$("#request-types .request-helper-tabs li").removeClass("active");
			var node = (event)?event.currentTarget:this;
			$(node).addClass("active");
			var type = $(node).attr('data-id');
			view.showRequestHelper(type);
			view.render();
		});

		$(".checkbox-show-password").click(function() {
			var fieldId = $(this).attr("data-password-id");
			var field = $("#"+fieldId)[0];
			if($(this).is(":checked")) field.type = "text";
			else field.type = "password";
		});
	},

	getAuthTypes: function() {
		return ["normal","basicAuth","digestAuth","oAuth1","oAuth2"];
	},

	onLoadRequest: function(req) {
		var currentHelper = req.get("currentHelper");
		var helperAttributes = req.get("helperAttributes");
		if(this.getAuthTypes().indexOf(currentHelper)!==-1) {
			if(currentHelper!=="normal") {
				var helperModel = this.model.get(currentHelper);
				for (var property in helperAttributes) {
					if (helperAttributes.hasOwnProperty(property)) {
						helperModel.set(property,helperAttributes[property]);
					}
				}
			}
			this.showRequestHelper(currentHelper);
		}
		else {
			this.showRequestHelper("normal");
		}
	},

	getActiveHelperType: function() {
		return this.model.get("activeHelper");
	},

	getHelper: function(type) {
		return this.model.get(type);
	},

	showRequestHelper: function (type) {
		this.model.set("activeHelper", type);
		this.model.trigger('change:activeHelper');
		return false;
	},

	clearHelpers: function() {
		("#request-types ul li").removeClass("active");
		$('#request-types ul li[data-id=normal]').addClass('active');
		$('#request-helpers').css("display", "none");
	},

	render: function() {
		var type = this.model.get("activeHelper");

		$("#request-types ul li").removeClass("active");
		$('#request-types ul li[data-id=' + type + ']').addClass('active');
		if (type !== "normal") {
			$('#request-helpers').css("display", "block");
		}
		else {
			$('#request-helpers').css("display", "none");
		}

		if (type.toLowerCase() === 'oauth1') {
			this.model.get("oAuth1").generateHelper();
		}

		$('.request-helpers').css("display", "none");
		$('#request-helper-' + type).css("display", "block");

		//for the oauth2 debug url
		$("#oauth2-debug-url-group").hide();
	}
});