var ThemeManager = Backbone.Model.extend({
	defaults: function() {
		return {
			"theme": "light",
			"bootstrap_theme": "default",
			"codemirror_theme": "eclipse"
		}
	},

	initialize: function() {
		console.log("Initialized ThemeManager");

		pm.mediator.on("switchTheme", this.onSwitchTheme, this);

		this.initializeTheme();
	},

	initializeTheme: function() {
		var theme = pm.settings.getSetting("postmanTheme");		
		this.switchTheme(theme);
	},

	getCodeMirrorTheme: function() {
		return this.get("codemirror_theme");
	},

	addStylesheet: function(id, file) {		
		var head  = document.getElementsByTagName('head')[0];
	    var link  = document.createElement('link');
	    link.id   = id;
	    link.rel  = 'stylesheet';
	    link.type = 'text/css';
	    link.href = file;
	    link.media = 'all';
	    head.appendChild(link);
	},

	onSwitchTheme: function(theme) {
		this.switchTheme(theme);
	},

	switchTheme: function(theme) {
		$(".postman-navbar").css("display", "none");
		$("#container").css("display", "none");
		$(".tooltip").css("display", "none");

		if (theme === 'light') {
			this.set("theme", theme);
			this.set("bootstrap_theme", "default");
			this.set("codemirror_theme", "eclipse");
			
			$('link[rel=stylesheet][href~="css/bootstrap-modal.css"]').remove();
			this.addStylesheet("bootstrap-modal", "css/bootstrap-modal.css");

			this.addStylesheet("postman-theme-light", "css/requester/styles.css");
			this.addStylesheet("postman-theme-light-test", "css/test_runner/styles.css");
			
			$('link[rel=stylesheet][href~="css/bootstrap-slate.min.css"]').remove();
			$('link[rel=stylesheet][href~="css/bootstrap-slate.mod.css"]').remove();
			$('link[rel=stylesheet][href~="css/requester/styles.dark.css"]').remove();			
			$('link[rel=stylesheet][href~="css/test_runner/styles.dark.css"]').remove();

			pm.settings.setSetting("postmanTheme", "light");
			pm.settings.setSetting("postmanCodeMirrorTheme", "clouds");
		}
		else {
			this.set("theme", theme);
			this.set("bootstrap_theme", "slate");
			this.set("codemirror_theme", "dark");

			$('link[rel=stylesheet][href~="css/bootstrap-modal.css"]').remove();

			this.addStylesheet("bootstrap-slate", "css/bootstrap-slate.min.css");
			this.addStylesheet("bootstrap-slate-mod", "css/bootstrap-slate.mod.css");
			this.addStylesheet("bootstrap-modal", "css/bootstrap-modal.css");
			this.addStylesheet("postman-theme-dark", "css/requester/styles.dark.css");
			this.addStylesheet("postman-theme-dark-test-runner", "css/test_runner/styles.dark.css");

			$('link[rel=stylesheet][href~="css/requester/styles.css"]').remove();
			$('link[rel=stylesheet][href~="css/test_runner/styles.css"]').remove();

			pm.mediator.trigger("switchCodeMirrorTheme", "monokai");

			pm.settings.setSetting("postmanTheme", "dark");
			pm.settings.setSetting("postmanCodeMirrorTheme", "monokai");
		}

		setTimeout(function() {
			$(".postman-navbar").fadeIn();
			$("#container").fadeIn();
			
			$(".tooltip").css("display", "none");

			if (theme === 'light') {
				pm.mediator.trigger("switchCodeMirrorTheme", "eclipse");
			}
			else {
				pm.mediator.trigger("switchCodeMirrorTheme", "monokai");
			}
		}, 500);		
	}
});