    var App = Backbone.View.extend({
    initialize:function () {
        var variableProcessor = this.model.get("variableProcessor");
        var globals = this.model.get("globals");

        this.on("modalClose", this.onModalClose, this);
        this.on("modalOpen", this.onModalOpen, this);

        variableProcessor.on('change:selectedEnv', this.renderContextMenu, this);
        globals.on('change', this.renderContextMenu, this);

        var view = this;


        view.menuIdPrefix = guid();
        view.contextMenuIds = {};

        setTimeout(function() {
            console.log("Add tooltips");
            $('a[rel="tooltip"]').tooltip();
        }, 500);

        $('input[rel="popover"]').popover();
        $(".html-source-pane").css('height',(window.innerHeight-300)+"px");

        var resizeTimeout;

        $(window).on("resize", function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                view.setLayout();
            }, 500);
            $(".html-source-pane").css('height',(window.innerHeight-300)+"px");
        });

        $('body').on('keydown', 'textarea', function (event) {
            if(view.isModalOpen()) {
                return;
            }

            if (event.keyCode === 27) {
                $(event.target).blur();
            }
        });

        $('body').on('keydown', 'select', function (event) {
            if (event.keyCode === 27) {
                $(event.target).blur();
            }
        });

        $(document).bind('keydown', 'esc', function () {
            if(view.isModalOpen()) {
                var activeModal = view.model.get("activeModal");
                if(activeModal !== "") {
                    $(activeModal).modal("hide");
                }
            }
        });

        var donated = pm.settings.getSetting("haveDonated");

        if(donated) {
            $("#donate-link").css("display", "none");
        }
        else {
            $("#donate-link").css("display", "inline");
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
                $("#donate-link").css("display", "inline");
            }
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

        pm.mediator.on("error", function() {
            noty(
                {
                    type:'error',
                    text:'Something went wrong.',
                    layout:'topCenter',
                    timeout:750
                });
        });

        pm.mediator.on("openModuleSection", this.openModuleSection, this);
        pm.mediator.on("openModule", this.openModule, this);

        this.renderContextMenu();
        this.setLayout();

        // @todo - remove below this line to unfix #CHROMEAPP-24
        pm.mediator.on("sidebarResize", this.positionSearchPanel, this);
        // @todo - remove above this line to unfix #CHROMEAPP-24

        //Hack-Fix for context menu items not appearing at all
        setTimeout(function() {
            pm.envManager.get("globals").trigger("change");
        },1000);
    },

    createOrUpdateContextMenuItem: function(id, title, parentId) {
        var view = this;

        var contextMenuIds = view.contextMenuIds;
        var obj = {
            title: title,
            contexts: ['selection']
        };

        if (contextMenuIds[id]) {
            id = chrome.contextMenus.update(id, obj);
        }
        else {
            obj.id = id;
            if (parentId) {
                obj.parentId = parentId;
            }
            id = chrome.contextMenus.create(obj);
            contextMenuIds[id] = true;
        }
    },

    createEnvironmentContextMenu: function(environment) {
        var view = this;
        var i;
        var count;
        var targetId;
        var value;
        var values;

        if (environment) {
            targetId = view.menuIdPrefix + "/postman_current_environment";

            this.createOrUpdateContextMenuItem(targetId, "Set: " + environment.get("name"), false);

            values = environment.get("values");
            count = values.length;

            for(i = 0; i < count; i++) {
                value = values[i];
                targetId = view.menuIdPrefix + "/environment/" + value.key;
                this.createOrUpdateContextMenuItem(targetId, value.key, view.menuIdPrefix + "/postman_current_environment");
            }
        }
    },

    createGlobalsContextMenu: function(globals) {
        var view = this;
        var i;
        var count;
        var targetId;
        var value;
        var values;

        if (globals) {
            targetId = view.menuIdPrefix + "/postman_globals";
            this.createOrUpdateContextMenuItem(targetId, "Set: Globals", false);

            values = globals.get("globals");
            count = values.length;

            for(i = 0; i < count; i++) {
                value = values[i];
                targetId = view.menuIdPrefix + "/globals/" + value.key;
                this.createOrUpdateContextMenuItem(targetId, value.key, view.menuIdPrefix + "/postman_globals");
            }
        }
    },

	createEncodingContextMenu: function() {
		var view = this;
		var targetId = view.menuIdPrefix + "/encodeURI";
		this.createOrUpdateContextMenuItem(targetId, "EncodeURIComponent", false);
		targetId = view.menuIdPrefix + "/decodeURI";
		this.createOrUpdateContextMenuItem(targetId, "DecodeURIComponent", false);
	},


	createContextMenu: function(environment, globals) {
		this.createEnvironmentContextMenu(environment);
		this.createGlobalsContextMenu(globals);
		this.createEncodingContextMenu();
	},

    renderContextMenu: function() {
        var variableProcessor = this.model.get("variableProcessor");
        var globals = this.model.get("globals");
        var environment = variableProcessor.get("selectedEnv");
        var view = this;

        chrome.contextMenus.removeAll(function() {
            view.contextMenuIds = {};
            _.bind(view.createContextMenu, view)(environment, globals);
        });


	    chrome.contextMenus.onClicked.addListener(function(info, tab) {
		    if (!document.hasFocus()) {
			    // console.log('Ignoring context menu click that happened in another window');
			    return;
		    }

		    var menuItemParts = info.menuItemId.split("/");
		    var category = menuItemParts[1];
		    var variable = menuItemParts[2];
		    if(category === "encodeURI") {
			    _.bind(view.userEncodeUri, view)(info, tab);
		    }
		    else if(category === "decodeURI") {
			    _.bind(view.userDecodeUri, view)(info, tab);
		    }
		    else {
			    _.bind(view.updateVariableFromContextMenu, view)(category, variable, info.selectionText);
		    }
	    });
    },

	userEncodeUri: function(info, tab) {
		var inputBox = document.activeElement;
		var selectionStart = inputBox.selectionStart;
		var selectionEnd = inputBox.selectionEnd;

		var oldValue = inputBox.value;
		var newValue = oldValue.substring(0,selectionStart) + encodeURIComponent(oldValue.substring(selectionStart, selectionEnd)) + oldValue.substring(selectionEnd, oldValue.length);
		inputBox.value = newValue;
		return;
	},

	userDecodeUri: function(info, tab) {
		var inputBox = document.activeElement;
		var selectionStart = inputBox.selectionStart;
		var selectionEnd = inputBox.selectionEnd;

		var oldValue = inputBox.value;
		var newValue = oldValue.substring(0,selectionStart) + decodeURIComponent(oldValue.substring(selectionStart, selectionEnd)) + oldValue.substring(selectionEnd, oldValue.length);
		inputBox.value = newValue;
		return;
	},

    updateEnvironmentVariableFromContextMenu: function(variable, selectionText) {
        var variableProcessor = this.model.get("variableProcessor");
        var environments = this.model.get("environments");
        var selectedEnv = variableProcessor.get("selectedEnv");

        if (selectedEnv) {
            var values = _.clone(selectedEnv.get("values"));
            var count = values.length;
            for(var i = 0; i < count; i++) {
                value = values[i];
                if (value.key === variable) {
                    value.value = selectionText;
                    break;
                }
            }
            var id = selectedEnv.get("id");
            var name = selectedEnv.get("name");
            environments.updateEnvironment(id, name, values);
        }
    },

    updateGlobalVariableFromContextMenu: function(variable, selectionText) {
        var variableProcessor = this.model.get("variableProcessor");
        var globals = this.model.get("globals");
        var globalValues = _.clone(globals.get("globals"));

        var count = globalValues.length;
        var value;

        for(var i = 0; i < count; i++) {
            value = globalValues[i];
            if (value.key === variable) {
                value.value = selectionText;
                break;
            }
        }

        globals.saveGlobals(globalValues);
        globals.trigger("change:globals");
    },

    updateVariableFromContextMenu: function(category, variable, selectionText) {
        if (category === "globals") {
            this.updateGlobalVariableFromContextMenu(variable, selectionText);
        }
        else if (category === "environment") {
            this.updateEnvironmentVariableFromContextMenu(variable, selectionText);
        }
    },

    onModalOpen:function (activeModal) {
        this.model.set("activeModal", activeModal);
        this.model.set("isModalOpen", true);
    },

    onModalClose:function () {
        // Shift focus to disable last shown tooltip
        $("#url").focus();
        this.model.set("activeModal", null);
        this.model.set("isModalOpen", false);

        //explicity remove all tooltips. Weird issue - Fix for Github Issue 760
        $(".tooltip").remove();
    },

    isModalOpen: function() {
        return this.model.get("isModalOpen");
    },

    setLayout:function () {
        this.refreshScrollPanes();
    },

    refreshScrollPanes:function () {
        var documentHeight = $(document).height();
        var newMainHeight = documentHeight - 55;
        $('#main').height(newMainHeight + "px");
        var newMainWidth = $('#container').width() - $('#sidebar').width() - 10;
        $('#main').width(newMainWidth + "px");

        pm.mediator.trigger("refreshLayout");
        pm.mediator.trigger("refreshPrscriptLayout");

        $('#directory-browser').height(newMainHeight + "px");

        var rightPaneWidth = $("div#main.content").css('width');
        rightPaneWidth = parseInt(rightPaneWidth.substring(0,rightPaneWidth.length-2));

        // @todo - toggle comment for unfixing #CHROMEAPP-24 after this line
        // $(".search-panel").css('width',rightPaneWidth+'px');
        // $(".search-field").css('width',(rightPaneWidth-50)+'px');
        this.positionSearchPanel();
        // @todo - toggle comment for unfixing #CHROMEAPP-24 before this line

        $(".xv-source-pane-inner").css('height',(documentHeight-331)+"px");
        $(".xv-outline").css('height',(documentHeight-301)+"px");
        $("#response-as-code>.CodeMirror").css('height',(documentHeight-295)+"px");
    },

    /**
     * This function positions the search bar at the bottom edge of the screen and also accounts for the space
     * encroached by other docked UI components (such as sidebar.)
     *
     * @param {object=} [overrrides] One can send computational overrides of dimensions for the dockable components
     * @param {number=} [overrrides.sidebarOuterWidth]
     *
     * @todo Remove this function when unfixing #CHROMEAPP-24
     */
    positionSearchPanel: function (overrrides) {
        var sidebarOuterWidth = (overrrides && overrrides.hasOwnProperty('sidebarOuterWidth')) ?
                overrrides.sidebarOuterWidth : ($('#sidebar').width() + $('#sidebar-toggle').width());

        $(".search-panel").css({
            width: $('#container').width() + 'px',
            paddingLeft: (sidebarOuterWidth + 15) + 'px'
        });

        $(".search-field").css({
            width: $('#main').width() + 'px'
        });
    },

    openModuleSection: function(section) {
        if (section === "requester") {
            $("#add-ons").css("display", "block");
            $("#back-to-requester-container").css("display", "none");
            $("#main-container").css("display", "block");
            $("#directory-browser").css("display", "none");
            pm.mediator.trigger("showSidebar");
        }
    },

    openModule: function(module) {
        if (module === "requester") {
            this.openRequester();
        }
        else if (module === "directory") {
            $("#add-ons").css("display", "none");
            $("#back-to-requester-container").css("display", "block");
            $("#main-container").css("display", "none");
            $("#directory-browser").css("display", "block");
            pm.mediator.trigger("hideSidebar");
        }
        else if (module === "test_runner") {
            if (pm.purchases.isUpgradeAvailable("collection-runner")) {
                this.openTestRunner();
                tracker.sendEvent('test_runner', 'collection_runner', 'new_window');
            }
            else {
                tracker.sendEvent('test_runner', 'collection_runner', 'purchase');
                pm.mediator.trigger("startPurchaseFlow", "test_runner");
            }

        }
    },

    startPurchase: function() {
        pm.mediator.trigger("startPurchaseFlow");
    },

    openRequester: function() {
        chrome.app.window.create('requester.html', {
        "bounds": {
          top: 60,
          left: 60,
          width: 1000,
          height: 800
        }
        }, function(win) {
            win.onClosed.addListener(function() {
            });
        });
    },

    openTestRunner: function() {
        chrome.app.window.create('test_runner.html', {
            "bounds": {
                top: 130,
                left: 130,
                width: 1000,
                height: 800
            }
        }, function(win) {
            win.onClosed.addListener(function() {
            });
        });
    }
    });
