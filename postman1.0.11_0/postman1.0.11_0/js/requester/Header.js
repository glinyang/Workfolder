var Header = Backbone.View.extend({
	initialize: function() {
		var donated = pm.settings.getSetting("haveDonated");
		var view = this;

		var interceptorStatus = new InterceptorStatus({model: {}});

		if(donated) {
			$("#donate-link").css("display", "none");
		}
		else {
			$("#donate-link").css("display", "inline-block");
		}

        var instantModals = pm.settings.getSetting("instantModals");
        if(instantModals) {
            $(".fade").removeClass("fade").addClass("fade_disable");
        }


        pm.mediator.on("donatedStatusChanged", function(donated) {
			if(donated) {
				$("#donate-link").css("display", "none");
			}
			else {
				$("#donate-link").css("display", "inline-block");
			}
		});

		$("#add-on-directory").on("click", function() {
			pm.mediator.trigger("openModule", "directory");
			pm.mediator.trigger("initializeDirectory");
		});

		$("#add-on-test-runner").on("click", function() {
			pm.mediator.trigger("openModule", "test_runner");
		});

		$("#logo a").on("click", function() {
			pm.mediator.trigger("openModule", "requester");
		});

		$("#back-to-request").on("click", function() {
			pm.mediator.trigger("openModuleSection", "requester");
		});

		$('a[data-toggle="popover"]').popover({
		    animation: true,
		    placement: "bottom",
		    trigger: "hover",
		});

        $("#twitter-profile").on("click", function() {
            tracker.sendEvent('social', 'profileview', 'twitter');
        });

		$("#postman-docs").on("click", function() {
            tracker.sendEvent('docs', 'view');
        });

        $("#toggle-import-bar").on("click", function() {
            $("#modal-importer").modal('show');
        });

        pm.mediator.on("loadedPurchases", function(purchases) {
        	view.updateJetpacksTrialStatus(purchases);
        });

		this.render();
	},

	createSupporterPopover: function() {
		var supportContent = "<div class='supporters'><div class='supporter clearfix'>";
		supportContent += "<div class='supporter-image supporter-image-mashape'>";
		supportContent += "<a href='http://www.getpostman.com/r?url=https://www.mashape.com/?utm_source=chrome%26utm_medium=app%26utm_campaign=postman' target='_blank'>";
		supportContent += "<img src='img/supporters/mashape.png'/></a></div>";
		supportContent += "<div class='supporter-tag'>Consume or provide cloud services with the Mashape API Platform</div></div>";

		supportContent += "<div class='supporter clearfix'>";
		supportContent += "<div class='supporter-image supporter-image-mashape'>";
		supportContent += "<a href='http://www.getpostman.com/r?url=http://restlet.com/?utm_source=POSTMAN' target='_blank'>";
		supportContent += "<img src='img/supporters/restlet.png'/></a></div>";
		supportContent += "<div class='supporter-tag'>The all-in-one platform for web APIs</div></div>";

		supportContent += "<div class='supporter clearfix'>";
		supportContent += "<div class='supporter-image supporter-image-datalogics'>";
		supportContent += "<a href='http://www.getpostman.com/r?url=http://www.datalogics.com//?utm_source=POSTMAN' target='_blank'>";
		supportContent += "<img src='img/supporters/datalogics.jpg'/></a></div>";
		supportContent += "<div class='supporter-tag'>Adobe eBook and PDF technologies for developers</div></div>";

		var donateTimeout;
        $('#donate-link').popover({
		    animation: false,
		    content: supportContent,
		    placement: "bottom",
		    trigger: "manual",
		    html: true,
		    title: "Postman is supported by amazing companies"
		}).on("mouseenter", function () {
		    var _this = this;
		    $(this).popover("show");
		    $(this).siblings(".popover").on("mouseleave", function () {
		        $(_this).popover('hide');
		    });
            donateTimeout = setTimeout(function () {
                //hover event here - number of times ad is seen
                tracker.sendEvent('sponsors', 'view');
            }, 1000);
		}).on("mouseleave", function () {
		    var _this = this;
            clearTimeout(donateTimeout);
		    setTimeout(function () {
		        if (!$(".popover:hover").length) {
		            $(_this).popover("hide")
		        }
		    }, 100);
		});
	},

	updateJetpacksTrialStatus: function(purchases) {
		var jetpacks = purchases.get("collection-runner");
		if (jetpacks) {
			if (jetpacks.isPurchased()) {
				$("#header-trial-status").css("display", "none");
			}
			else if (jetpacks.isTrialValid()) {
				var daysLeft = jetpacks.getDaysLeft();
				$("#header-trial-status").css("display", "block");
			    $("#header-trial-status").html("Upgrade (" + daysLeft + " days left)");
			}
			else if (jetpacks.isTrialCompleted()) {
				$("#header-trial-status").css("display", "block");
				$("#header-trial-status").attr("data-content", "Your trial period has expired");
				$("#header-trial-status").html("Upgrade");
			}
			else {
				$("#header-trial-status").css("display", "none");
			}
		}
	},

	render: function() {
		this.createSupporterPopover();

		if (pm.features.isFeatureEnabled(FEATURES.DIRECTORY)) {
			$("#add-ons").css("display", "block");
		}
	}


});