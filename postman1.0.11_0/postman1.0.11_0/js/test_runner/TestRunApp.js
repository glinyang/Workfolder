var TestRunApp = Backbone.View.extend({
	initialize: function() {
		var view = this;

		var resizeTimeout;

		this.on("modalClose", this.onModalClose, this);
		this.on("modalOpen", this.onModalOpen, this);

		$(window).on("resize", function () {
		    clearTimeout(resizeTimeout);
		    resizeTimeout = setTimeout(function() {
		        view.setLayout();
		    }, 500);
		});

		pm.mediator.on("notifySuccess", function(message) {
			noty(
			    {
			        type:'success',
			        text: message,
			        layout:'topCenter',
			        timeout:750
			    });
		});

		pm.mediator.on("notifyError", function(message) {
			noty(
			    {
			        type:'error',
			        text: message,
			        layout:'topCenter',
			        timeout:750
			    });
		});
		
		this.setLayout();
	},

	setLayout:function () {
	    this.refreshScrollPanes();
	},

	refreshScrollPanes:function () {
	    var newMainHeight = $(document).height() - 55;
	    $('#main').height(newMainHeight + "px");
	    var newMainWidth = $('#container').width() - $('#sidebar').width() - 10;
	    $('#main').width(newMainWidth + "px");
	},

	onModalOpen:function (activeModal) {
		this.model.set("activeModal", activeModal);
		this.model.set("isModalOpen", true);
	},

	onModalClose:function () {
		// Shift focus to disable last shown tooltip
		$("#select-collection").focus();
		this.model.set("activeModal", null);
		this.model.set("isModalOpen", false);
	},

	isModalOpen: function() {
		return this.model.get("isModalOpen");
	},
});