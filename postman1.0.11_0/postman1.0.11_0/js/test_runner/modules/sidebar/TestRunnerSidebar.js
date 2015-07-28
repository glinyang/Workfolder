var TestRunnerSidebar = Backbone.View.extend({
	initialize: function() {
		var view = this;

		$('#sidebar-toggle').on("click", function () {
		    view.toggleSidebar();
		});

		var runsSidebar = new RunsSidebar({model: this.model.get("testRuns")});
	},

	minimizeSidebar:function () {
		var model = this.model;

	    model.set("width", $("#sidebar").width());

	    var animationDuration = model.get("animationDuration");

	    $('#sidebar-toggle').animate({left:"0"}, animationDuration);
	    $('#sidebar').animate({width:"0px", marginLeft: "-10px"}, animationDuration);
	    $('#sidebar-filler').animate({width:"0px", marginLeft: "-10px"}, animationDuration);
	    $('#sidebar-search-container').css("display", "none");
	    $('#sidebar div').animate({opacity:0}, animationDuration);
	    var newMainWidth = $(document).width();
	    $('#main').animate({width:newMainWidth + "px", "margin-left":"5px"}, animationDuration);
	    $('#sidebar-toggle img').attr('src', 'img/tri_arrow_right.png');
	},

	maximizeSidebar:function () {
		var model = this.model;
		var animationDuration = model.get("animationDuration");
		var sidebarWidth = model.get("width");

	    $('#sidebar-toggle').animate({left:"350px"}, animationDuration, function () {
	    });

	    $('#sidebar').animate({width:sidebarWidth + "px", marginLeft: "0px"}, animationDuration);
	    $('#sidebar-filler').animate({width:sidebarWidth + "px", marginLeft: "0px"}, animationDuration);
	    $('#sidebar-search-container').fadeIn(animationDuration);
	    $('#sidebar div').animate({opacity:1}, animationDuration);
	    $('#sidebar-toggle img').attr('src', 'img/tri_arrow_left.png');
	    var newMainWidth = $(document).width() - sidebarWidth - 10;
	    var marginLeft = sidebarWidth + 10;
	    $('#main').animate({width:newMainWidth + "px", "margin-left": marginLeft+ "px"}, animationDuration);
	},

	toggleSidebar:function () {
		var model = this.model;
		var isSidebarMaximized = model.get("isSidebarMaximized");

	    if (isSidebarMaximized) {
	        this.minimizeSidebar();
	    }
	    else {
	        this.maximizeSidebar();
	    }

	    model.set("isSidebarMaximized", !isSidebarMaximized);
	}
});