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
/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */
"use strict";

var pm = {};

pm.targets = {
    CHROME_LEGACY_APP: 0,
    CHROME_PACKAGED_APP: 1
};

pm.target = pm.targets.CHROME_PACKAGED_APP;

// Flags are set inside config.js
pm.isTesting = postman_flag_is_testing;
pm.databaseName = postman_database_name;
pm.webUrl = postman_web_url;

pm.features = new Features();

pm.debug = false;

pm.arePurchasesInBeta = "false";

pm.indexedDB = {};
pm.indexedDB.db = null;
pm.indexedDB.modes = {
    readwrite:"readwrite",
    readonly:"readonly"
};

pm.fs = {};
pm.gaClientId = "";
pm.hasPostmanInitialized = false;

// TODO Check if still being used
pm.bannedHeaders = [
    'accept-charset',
    'accept-encoding',
    'access-control-request-headers',
    'access-control-request-method',
    'connection',
    'content-length',
    'cookie',
    'cookie2',
    'content-transfer-encoding',
    'date',
    'expect',
    'host',
    'keep-alive',
    'origin',
    'referer',
    'te',
    'trailer',
    'transfer-encoding',
    'upgrade',
    'user-agent',
    'via'
];

// IndexedDB implementations still use API prefixes
var indexedDB = window.indexedDB || // Use the standard DB API
    window.mozIndexedDB || // Or Firefox's early version of it
    window.webkitIndexedDB;            // Or Chrome's early version
// Firefox does not prefix these two:
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
var IDBCursor = window.IDBCursor || window.webkitIDBCursor;

window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

pm.init = function () {
    Handlebars.partials = Handlebars.templates;

    function initializePurchases() {
        var testPurchaser = new TestPurchaser({model: {}});
        pm.purchases = new Purchases();
    }

    function initializeTester() {
        var tester = new Tester();
        var prScripter = new PreRequestScripter();
        // pm.tester = tester;
    }


    function initializeTCPReader() {
        var tcpReader = new TCPReader();
        var tcpReaderStatus = new TCPReaderStatus({model: tcpReader});
        var tcpManager = new TCPManager({model: tcpReader});

        pm.tcpReader = tcpReader;
    }

    function initializePostmanAPI() {
        pm.api = new PostmanAPI();
    }

    function initializeInterceptor() {
        console.log("Initialize interceptor");
        var interceptorIntro = new InterceptorIntro({model: {}});        
        var interceptorCapture = new InterceptorCapture();
        var curlCapture = new CurlCapture();
    }

    function initializeCollections() {
        pm.collectionValidator = postmanvalidator;

        var pmCollections = new PmCollections();

        var addCollectionModal = new AddCollectionModal({model: pmCollections});
        var addFolderModal = new AddFolderModal({model: pmCollections});
        var editFolderModal = new EditFolderModal({model: pmCollections});
        var deleteFolderModal = new DeleteFolderModal({model: pmCollections});
        var editCollectionModal = new EditCollectionModal({model: pmCollections});
        var deleteCollectionModal = new DeleteCollectionModal({model: pmCollections});
        var importModal = new ImportModal({model: pmCollections});
        var shareCollectionModal = new ShareCollectionModal({model: pmCollections});
        var overwriteCollectionModal = new OverwriteCollectionModal({model: pmCollections});

        var addCollectionRequestModal = new AddCollectionRequestModal({model: pmCollections});
        var editCollectionRequestModal = new EditCollectionRequestModal({model: pmCollections});
        var deleteCollectionRequestModal = new DeleteCollectionRequestModal({model: pmCollections});
        pm.collections = pmCollections;
    }

    function initializeHistory() {
        var history = new History();
        pm.history = history;
    }

    function initializeEnvironments() {
        var globals = new Globals();
        var environments = new Environments();

        var variableProcessor = new VariableProcessor({
            "environments": environments,
            "globals": globals
        });

        var environmentSelector = new EnvironmentSelector({
            "environments": environments,
            "variableProcessor": variableProcessor
        });

        var environmentManagerModal = new EnvironmentManagerModal({
            "environments": environments,
            "globals": globals
        });

        var quicklookPopOver = new QuickLookPopOver({
            "environments": environments,
            "globals": globals,
            "variableProcessor": variableProcessor
        });

        pm.envManager = variableProcessor;

        var appState = new AppState({
            "globals": globals,
            "environments": environments,
            "variableProcessor": variableProcessor
        });

        var appView = new App({model: appState});
        pm.app = appView;
    }

    function initializeHeaderPresets() {
        pm.headerPresets = new HeaderPresets();

        var headerPresetsModal = new HeaderPresetsModal({model: pm.headerPresets});
        var headerPresetsRequestEditor = new HeaderPresetsRequestEditor({model: pm.headerPresets});
    }

    function initializeRequester() {
        var urlCache = new URLCache();
        pm.urlCache = urlCache;

        var request = new Request();
        var requestEditor = new RequestEditor({model: request});
        var responseViewer = new ResponseViewer({model: request});

        var basicAuthProcessor = new BasicAuthProcessor({request: request});
        var digestAuthProcessor = new DigestAuthProcessor({request: request});
        var oAuth1Processor = new OAuth1Processor({request: request});
        var oAuth2TokenFetcher = new OAuth2TokenFetcher({request: request});

        var helpers = new Helpers({
            "basicAuth": basicAuthProcessor,
            "digestAuth": digestAuthProcessor,
            "oAuth1": oAuth1Processor,
            "oAuth2": oAuth2TokenFetcher,
            "request": request
        });

        var oAuth2Tokens = new OAuth2Tokens();
        var oAuth2TokenList = new OAuth2TokenList({model: oAuth2Tokens});

        var helperManager = new HelperManager({model: helpers});
        pm.helpers = helperManager;

        pm.request = request;
        initializeExtensionListener();
        initializeUpdateNotifier();
    }

    function initializeExtensionListener() {
        chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {            
            pm.mediator.trigger("onMessageExternal", request, sender, sendResponse);
        });
    }

    function initializeUpdateNotifier() {
        var UpdateNotifier = new AppUpdateNotifier();
    }

    function initializeStorage() {
        var storage = new Storage();
        pm.storage = storage;
    }

    function initializeRequestMethods() {
        var requestMethods = new RequestMethods();
        pm.methods = requestMethods;
    }

    function initializeSidebar() {
        var sidebarState = new SidebarState({history: pm.history, collections: pm.collections});
        var sidebar = new Sidebar({ model: sidebarState });
    }

    function initializeDriveSync() {
        if (pm.features.isFeatureEnabled(FEATURES.DRIVE_SYNC)) {
            var driveSyncLog = new DriveSyncLog();
            var driveSyncLogger = new DriveSyncLogger({model: driveSyncLog});
            var driveSync = new DriveSync({log: driveSyncLog});
            var driveSyncIntroduction = new DriveSyncIntroduction({model: driveSync});
        }
        else {
            // console.log("Drive sync is disabled");
        }
    }

    function initializeDirectory() {
        var directory = new Directory();
        var directoryBrowser = new DirectoryBrowser({model: directory});
    }

    function initializeTracker() {
        var tracker = new Tracker();
    }

    function initializeUser() {
        var header = new Header();

        var user = new User();
        var userStatus = new UserStatus({model: user});
        var userCollections = new UserCollections({model: user});
        pm.user = user;
    }

    pm.mediator = new Mediator();

    // Local storage or chrome.storage
    initializeStorage();
    initializePurchases();

    // Current app window
    pm.appWindow = new AppWindow();
    pm.settings = new Settings();

    // RequestMethods is not being used right now
    pm.methods = new RequestMethods(function() {
        pm.settings.init(function() {
            var settingsModal = new SettingsModal({model: pm.settings});

            // TODO
            // Initialize theme here
            pm.themeManager = new ThemeManager();

            pm.filesystem.init();
            pm.indexedDB.open(function() {
                initializePostmanAPI();
                initializeRequester();
                initializeInterceptor();
                initializeHistory();
                initializeCollections();
                initializeTester();

                initializeEnvironments();
                initializeHeaderPresets();

                initializeSidebar();

                pm.broadcasts.init();

                initializeDriveSync();
                initializeUser();
                initializeDirectory();

                initializeTracker();

                initializeTCPReader();

                pm.hasPostmanInitialized = true;

                pm.mediator.trigger("postmanInitialized");

                // This is actually used somewhere
                try {
                    pm.gaClientId = window.fu;                    
                }
                catch(e) {
                    // console.log("Could not find client id for GA");
                }                
            });
        });
    });
};

var GruntLiveReload = GruntLiveReload || {};
GruntLiveReload.init = function() {
  var ws = new WebSocket("ws://localhost:35729/livereload");
  ws.onopen = function() {
    console.log("LiveReload WebSocket initialized and ready.");
  };
  ws.onmessage = function(evt) {
    var wsData = JSON.parse(evt.data);
    if (wsData.command == "reload") {
      chrome.runtime.reload();
    } else {
      console.log("LiveReload Message", evt.data);
    }
  };
  ws.onerror = function(evt) {
    console.error("LiveReload WebSocket Error", evt);
  };
};

// GruntLiveReload.init();

$(document).ready(function () {
    pm.init();
});
var AppState = Backbone.Model.extend({
    defaults: function() {
        return {
        	variableProcessor:null,
            isModalOpen:false,
            activeModal: ""
        };
    }
});
var AppUpdateNotifier = Backbone.Model.extend({
	initialize: function() {
		pm.mediator.on("showVersionNotice", this.showVersionNotice, this);
		console.log("Checking for update notifications...");
		chrome.storage.local.get("lastKnownVersion", function (results) {
			var currentVersion = chrome.runtime.getManifest()["version"];
			if (!results.lastKnownVersion) {
				results.lastKnownVersion = "blank";
			}
			if (results.lastKnownVersion) {
				var lastVersion = results.lastKnownVersion;
				console.log("Stored version: " + lastVersion+", currentVersion: "+currentVersion);
				if (lastVersion !== currentVersion) {
					setTimeout(function() {
						pm.mediator.trigger("showVersionNotice", currentVersion);
					},2500);
				}
			}
			chrome.storage.local.set({"lastKnownVersion": currentVersion});
		});
	},

	showVersionNotice: function(version) {
		//version should be of the form "1.0.0.1"
		var processedVersion = version.replace(/\./g, "-");
		var templateName = "version_"+processedVersion;
		if(Handlebars.templates.hasOwnProperty(templateName)) {
			console.log("Showing notification for "+templateName);
			$("#modal-update-notif .modal-body").html("").append(Handlebars.templates[templateName]());
			$("#modal-update-notif").modal("show");
		}
	}
});
var AppWindow = Backbone.Model.extend({
    defaults: function() {
        return {
        	id:0,        	
            internalEvents: {}
        };
    },

    initialize: function(options) {
    	this.set("id", guid());        
    	this.initializeInternalMessaging();
    },

    onRegisterInternalEvent: function(e, func, context) {
        var internalEvents = this.get("internalEvents");
        internalEvents[e] = {
            "handler": func,
            "context": context
        }
    },

    sendMessageObject: function(e, object) {
    	var message = {
    		"id": this.get("id"),
    		"event": e,
    		"object": object
    	};

    	chrome.runtime.sendMessage(message);
    },

    initializeInternalMessaging: function() {
    	var model = this;
        this.on("registerInternalEvent", this.onRegisterInternalEvent, this);
    	this.on("sendMessageObject", this.sendMessageObject, this);

    	chrome.runtime.onMessage.addListener(function(message) {
    		if (model.get("id") !== message.id) {
                var internalEvents = model.get("internalEvents");
                if (message.event in internalEvents) {
                    var e = message.event;
                    var object = message.object;
                    _.bind(internalEvents[e].handler, internalEvents[e].context)(object);
                }
    		}
    	});
    }
});
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
var Mediator = Backbone.Model.extend({
    defaults: function() {
        return {
        }
    }
});
pm.broadcasts = {
    items: [],

    init:function () {
        pm.storage.getValue("broadcasts", function(broadcasts) {
            pm.storage.getValue("broadcast_last_update_time", function(last_update_time) {
                var today = new Date();

                pm.broadcasts.showBlank();
                pm.broadcasts.fetch();
                if (last_update_time) {
                    var last_update = new Date(last_update_time);
                    pm.broadcasts.setLastUpdateTime(today);
                }
                else {
                    pm.broadcasts.setLastUpdateTime(today);
                }

                $("#broadcasts-count").on("click", function () {
                    pm.broadcasts.markAllAsRead();
                });
            });
        });
    },

    showBlank:function() {
        var $broadcasts_count = $("#broadcasts-count");
        $broadcasts_count.removeClass();
        $broadcasts_count.addClass("no-new-broadcasts");
        $broadcasts_count.html("0");
    },

    fetch:function () {
        var broadcast_url = "http://www.getpostman.com/broadcasts";
        $.get(broadcast_url, function (data) {
            pm.broadcasts.setBroadcasts(data["broadcasts"]);
            pm.broadcasts.renderBroadcasts();
        });
    },

    setLastUpdateTime:function (last_update) {
        pm.storage.setValue({"broadcast_last_update_time": last_update.toUTCString()});
    },

    setBroadcasts:function (broadcasts) {
        var old_broadcasts;
        var broadcastsJson;
        var b;

        function oldBroadCastsFinder(br) {
            return br.id === b.id;
        }

        pm.storage.getValue("broadcasts", function(broadcastsJson) {
            if (broadcastsJson) {
                old_broadcasts = JSON.parse(broadcastsJson);
            }
            else {
                old_broadcasts = [];
            }

            var i, c, count;
            if (old_broadcasts.length === 0) {
                c = broadcasts.length;
                for (i = 0; i < c; i++) {
                    broadcasts[i]["status"] = "unread";
                }
                count = broadcasts.length;
                broadcastsJson = JSON.stringify(broadcasts);
                pm.storage.setValue({"broadcasts": broadcastsJson}, function() {
                });
            }
            else {
                c = broadcasts.length;
                var new_broadcasts = [];
                for (i = 0; i < c; i++) {
                    b = broadcasts[i];

                    var existing = _.find(old_broadcasts, oldBroadCastsFinder);

                    if (!existing) {
                        b["status"] = "unread";
                        new_broadcasts.push(b);
                    }
                }

                count = new_broadcasts.length;
                old_broadcasts = _.union(new_broadcasts, old_broadcasts);
                broadcastsJson = JSON.stringify(old_broadcasts);
                pm.storage.setValue({"broadcasts": broadcastsJson}, function() {
                });
            }

            var $broadcasts_count = $("#broadcasts-count");
            $broadcasts_count.html(count);
            $broadcasts_count.removeClass();
            if (count > 0) {
                $broadcasts_count.addClass("new-broadcasts");
            }
            else {
                $broadcasts_count.addClass("no-new-broadcasts");
            }
        });
    },

    markAllAsRead:function () {
        var $broadcasts_count = $("#broadcasts-count");
        $broadcasts_count.removeClass();
        $broadcasts_count.addClass("no-new-broadcasts");
        $broadcasts_count.html("0");

        pm.storage.getValue("broadcasts", function(broadcastsJson) {
            var broadcasts;

            if (broadcastsJson) {
                broadcasts = JSON.parse(broadcastsJson);
            }
            else {
                broadcasts = [];
            }

            var c = broadcasts.length;
            for (var i = 0; i < c; i++) {
                broadcasts[i]["status"] = "read";
            }

            var outBroadcastsJsons = JSON.stringify(broadcasts);
            pm.storage.setValue({"broadcasts": outBroadcastsJsons}, function() {
            });

            pm.broadcasts.renderBroadcasts();
        });
    },

    renderBroadcasts:function () {
        pm.storage.getValue("broadcasts", function(broadcastsJson) {
            var broadcasts = JSON.parse(broadcastsJson);
            $("#broadcasts .dropdown-menu").html("");
            $("#broadcasts .dropdown-menu").append(Handlebars.templates.broadcasts({"items":broadcasts}));
        });
    }
};
/****

collectionRequest = {
    id: guid(),
    headers: request.getPackedHeaders(),
    url: url,
    method: request.get("method"),
    preRequestScript: request.get("preRequestScript"),
    data: body.get("dataAsObjects"),
    dataMode: body.get("dataMode"),
    name: newRequestName,
    description: newRequestDescription,
    descriptionFormat: "html",
    time: new Date().getTime(),
    version: 2,
    responses: []
};

*****/
var PmCollection = Backbone.Model.extend({
    defaults: function() {
        return {
            "id": "",
            "name": "",
            "description": "",
            "order": [],
            "folders": [],
            "requests": [],
            "timestamp": 0,
            "synced": false,
            "syncedFilename": "",
            "remote_id": 0,
            "remoteLink": ""
        };
    },

    toSyncableJSON: function() {
        var j = this.getAsJSON();
        j.synced = true;
        return j;
    },

    setRequests: function(requests) {
        this.set("requests", requests);
    },

    getRequestIndex: function(newRequest) {
    	var requests = this.get("requests");
    	var count = requests.length;
    	var request;
    	var found;
    	var location;

    	for(var i = 0; i < count; i++) {
    		request = requests[i];
    		if(request.id === newRequest.id) {
    			found = true;
    			location = i;
    			break;
    		}
    	}

    	if (found) {
    		return location;
    	}
    	else {
    		return -1;
    	}
    },

    addRequest: function(newRequest) {
        var location = this.getRequestIndex(newRequest);
        var requests = this.get("requests");
        if (location !== -1) {
            requests.splice(location, 1, newRequest);
        }
        else {
            requests.push(newRequest);
        }
    },

    deleteRequest: function(requestId) {
        var requests = _.clone(this.get("requests"));
    	var location = arrayObjectIndexOf(requests, requestId, "id");
    	if (location !== -1) {
            this.removeRequestIdFromOrderOrFolder(requestId);
    		requests.splice(location, 1);
            this.set("requests", requests);
    	}
    },

    updateRequest: function(newRequest) {
    	var location = this.getRequestIndex(newRequest);
    	var requests = this.get("requests");
    	if (location !== -1) {
    		requests.splice(location, 1, newRequest);
    	}
    },

    getFolderById: function(folderId) {
        var folders = _.clone(this.get("folders"));
        var location = arrayObjectIndexOf(folders, folderId, "id");
        return folders[location];
    },

    getFolders: function() {
        var folders = _.clone(this.get("folders"));
        return folders;
    },


    getRequestsInCollection: function() {
        var requests = _.clone(this.get("requests"));
        var order = _.clone(this.get("order"));
        var orderedRequests = [];

        var folders = this.get("folders");
        var folderCount = folders.length;

        if (folderCount > 0) {
            for(var i = 0; i < folderCount; i++) {
                folder = _.clone(folders[i]);
                folderOrder = folder.order;
                folderRequests = [];

                for(var j = 0; j < folderOrder.length; j++) {
                    id = folderOrder[j];

                    var index = arrayObjectIndexOf(requests, id, "id");

                    if(index >= 0) {
                        folderRequests.push(requests[index]);
                        requests.splice(index, 1);
                    }
                }

                folderRequests = this.orderRequests(folderRequests, folderOrder);
                orderedRequests = _.union(orderedRequests, folderRequests);
            }

            orderedRequests = _.union(orderedRequests, this.orderRequests(requests, order));
        }
        else {
            orderedRequests = this.orderRequests(requests, order)
        }

        return orderedRequests;
    },

    getRequestsInFolder: function(folder) {
        var folderOrder = folder.order;
        var requests = _.clone(this.get("requests"));
        var count = folderOrder.length;
        var index;
        var folderRequests = [];

        for(var i = 0; i < count; i++) {
            index = arrayObjectIndexOf(requests, folderOrder[i], "id");
            if (index >= 0) {
                folderRequests.push(requests[index]);
            }
        }

        var orderedRequests = this.orderRequests(folderRequests, folder.order);

        return orderedRequests;
    },

    addFolder: function(folder) {
        var folders = _.clone(this.get("folders"));
        folders.push(folder);
        this.set("folders", folders);
    },

    editFolder: function(folder) {
        function existingFolderFinder(f) {
            return f.id === id;
        }

        var id = folder.id;
        var folders = _.clone(this.get("folders"));
        var index = arrayObjectIndexOf(folders, id, "id");

        if (index !== -1) {
            folders.splice(index, 1, folder);
            this.set("folders", folders);
        }
    },

    deleteFolder: function(id) {
        var folders = _.clone(this.get("folders"));
        var index = arrayObjectIndexOf(folders, id, "id");
        folders.splice(index, 1);
        this.set("folders", folders);
    },

    getAsJSON: function() {
        return {
            "id": this.get("id"),
            "name": this.get("name"),
            "description": this.get("description"),
            "order": this.get("order"),
            "folders": this.get("folders"),
            "timestamp": this.get("timestamp"),
            "synced": this.get("synced"),
            "remote_id": this.get("remote_id"),
            "remoteLink": this.get("remoteLink")
        }
    },

    addRequestIdToFolder: function(id, requestId) {
        this.removeRequestIdFromOrderOrFolder(requestId);

        var folders = _.clone(this.get("folders"));
        var index = arrayObjectIndexOf(folders, id, "id");
        folders[index].order.push(requestId);
        this.set("folders", folders);
    },

    addRequestIdToOrder: function(requestId) {
        this.removeRequestIdFromOrderOrFolder(requestId);

        var order = _.clone(this.get("order"));
        order.push(requestId);
        this.set("order", order);
    },

    removeRequestIdFromOrderOrFolder: function(requestId) {
        var order = _.clone(this.get("order"));
        var indexInFolder;
        var folders = _.clone(this.get("folders"));

        var indexInOrder = order.indexOf(requestId);

        if (indexInOrder >= 0) {
            order.splice(indexInOrder, 1);
            this.set("order", order);
        }

        for(var i = 0; i < folders.length; i++) {
            indexInFolder = folders[i].order.indexOf(requestId);
            if(indexInFolder >= 0) {
                break;
            }
        }

        if(indexInFolder >= 0) {
            folders[i].order.splice(indexInFolder, 1);
            this.set("folders", folders);
        }
    },

    isUploaded: function() {
        return this.get("remote_id") !== 0;
    },

    // Uses arrays
    orderRequests: function() {

        var folders = this.get("folders");
        var requests = this.get("requests");

        var folderCount = folders.length;
        var folder;
        var folderOrder;
        var id;
        var existsInOrder;
        var folderRequests;

        var newFolders = [];

        for(var i = 0; i < folderCount; i++) {
            folder = _.clone(folders[i]);
            folderOrder = folder.order;
            folderRequests = [];

            for(var j = 0; j < folderOrder.length; j++) {
                id = folderOrder[j];

                var index = arrayObjectIndexOf(requests, id, "id");

                if(index >= 0) {
                    folderRequests.push(requests[index]);
                    requests.splice(index, 1);
                }
            }

            folder["requests"] = this.orderRequests(folderRequests, folderOrder);
            newFolders.push(folder);
        }

        this.set("folders", newFolders);
        this.set("requests", this.orderRequests(requests, this.get("order")));

        return collection;
    },

    orderRequests: function(inRequests, order) {
        var requests = _.clone(inRequests);

        function requestFinder(request) {
            return request.id === order[j];
        }

        if (order.length === 0) {
            requests.sort(sortAlphabetical);
        }
        else {
            var orderedRequests = [];
            for (var j = 0, len = order.length; j < len; j++) {
                var element = _.find(requests, requestFinder);
                if(element) {
                    orderedRequests.push(element);
                }
            }

            requests = orderedRequests;
        }

        return requests;
    }
});
var PmCollectionRequest = Backbone.Model.extend({
    defaults: function() {
        return {
        };
    }
});
var PmCollections = Backbone.Collection.extend({
    originalCollectionId: "",
    toBeImportedCollection:{},

    model: PmCollection,

    isLoaded: false,
    initializedSyncing: false,
    syncFileTypeCollection: "collection",
    syncFileTypeCollectionRequest: "collection_request",

    comparator: function(a, b) {
        var counter;

        var aName = a.get("name");
        var bName = b.get("name");

        if (aName.length > bName.legnth)
            counter = bName.length;
        else
            counter = aName.length;

        for (var i = 0; i < counter; i++) {
            if (aName[i] == bName[i]) {
                continue;
            } else if (aName[i] > bName[i]) {
                return 1;
            } else {
                return -1;
            }
        }
        return 1;
    },

    initialize: function() {
        this.loadAllCollections();

        // TODO Add events for in-memory updates
        pm.appWindow.trigger("registerInternalEvent", "addedCollection", this.onAddedCollection, this);
        pm.appWindow.trigger("registerInternalEvent", "updatedCollection", this.onUpdatedCollection, this);
        pm.appWindow.trigger("registerInternalEvent", "deletedCollection", this.onDeletedCollection, this);

        pm.appWindow.trigger("registerInternalEvent", "addedCollectionRequest", this.onAddedCollectionRequest, this);
        pm.appWindow.trigger("registerInternalEvent", "updatedCollectionRequest", this.onUpdatedCollectionRequest, this);
        pm.appWindow.trigger("registerInternalEvent", "deletedCollectionRequest", this.onDeletedCollectionRequest, this);

        pm.mediator.on("addDirectoryCollection", this.onAddDirectoryCollection, this);
        pm.mediator.on("addResponseToCollectionRequest", this.addResponseToCollectionRequest, this);
        pm.mediator.on("updateResponsesForCollectionRequest", this.updateResponsesForCollectionRequest, this);
        pm.mediator.on("deletedSharedCollection", this.onDeletedSharedCollection, this);
        pm.mediator.on("overwriteCollection", this.onOverwriteCollection, this);
        pm.mediator.on("uploadAllLocalCollections", this.onUploadAllLocalCollections, this);
    },

    onAddedCollection: function(collection) {
        this.add(collection, { merge: true });
    },

    onUpdatedCollection: function(collection) {
        this.add(collection, { merge: true });
        this.trigger("updateCollection");
    },

    onDeletedCollection: function(id) {
        this.remove(id);
    },

    onAddedCollectionRequest: function(request) {
        var collection = this.get(request.collectionId);

        if (collection) {
            collection.addRequest(request);
        }
    },

    onUpdatedCollectionRequest: function(request) {
        var collection = this.get(request.collectionId);

        if (collection) {
            collection.updateRequest(request);
        }
    },

    onDeletedCollectionRequest: function(id) {
        var collection = this.get(request.collectionId);

        if (collection) {
            collection.deleteRequest(id);
        }
    },

    onUploadAllLocalCollections: function() {

        var uploaded = 0;
        var count = this.models.length;

        function callback() {
            uploaded++;

            if (uploaded === count) {
                pm.mediator.trigger("refreshSharedCollections");
            }
        }

        for(var i = 0; i < this.models.length; i++) {
            this.uploadCollection(this.models[i].get("id"), false, false, callback);
        }
    },

    getCollectionById: function(id) {
        for(var i = 0; i < this.models.length; i++) {
            if(id===this.models[i].get("id")) {
                return this.models[i];
            }
        }
        return null;
    },

    getAllCollections: function() {
        return this.models;
    },

    // Load all collections
    loadAllCollections:function () {
        var pmCollection = this;

        this.startListeningForFileSystemSyncEvents();

        pm.indexedDB.getCollections(function (items) {
            var itemsLength = items.length;
            var loaded = 0;

            function onGetAllRequestsInCollection(collection, requests) {
                var c = new PmCollection(collection);
                c.setRequests(requests);
                pmCollection.add(c, {merge: true});

                loaded++;

                for(var i = 0; i < requests.length; i++) {
                    pm.mediator.trigger("addToURLCache", requests[i].url);
                }

                if (loaded === itemsLength) {
                    pmCollection.isLoaded = true;
                    pmCollection.trigger("startSync");

                    pm.mediator.trigger("refreshCollections");
                    pm.mediator.trigger("loadedCollections");
                }
            }

            if (itemsLength === 0) {
                pmCollection.isLoaded = true;
                pmCollection.trigger("startSync");
            }
            else {
                for (var i = 0; i < itemsLength; i++) {
                    var collection = items[i];
                    pm.indexedDB.getAllRequestsInCollection(collection, onGetAllRequestsInCollection);
                }
            }
        });
    },

    startListeningForFileSystemSyncEvents: function() {
        var pmCollection = this;
        var isLoaded = pmCollection.isLoaded;
        var initializedSyncing = pmCollection.initializedSyncing;

        pm.mediator.on("initializedSyncableFileSystem", function() {
            pmCollection.initializedSyncing = true;
            pmCollection.trigger("startSync");
        });

        this.on("startSync", this.startSyncing, this);
    },

    startSyncing: function() {
        var i;
        var j;
        var pmCollection = this;
        var collection;
        var requests;
        var request;
        var synced;
        var syncableFile;

        if (this.isLoaded && this.initializedSyncing) {

            pm.mediator.on("addSyncableFileFromRemote", function(type, data) {
                if (type === "collection") {
                    pmCollection.onReceivingSyncableFileData(data);
                }
                else if (type === "collection_request") {
                    pmCollection.onReceivingSyncableFileDataForRequests(data);
                }
            });

            pm.mediator.on("updateSyncableFileFromRemote", function(type, data) {
                if (type === "collection") {
                    pmCollection.onReceivingSyncableFileData(data);
                }
                else if (type === "collection_request") {
                    pmCollection.onReceivingSyncableFileDataForRequests(data);
                }
            });

            pm.mediator.on("deleteSyncableFileFromRemote", function(type, id) {
                if (type === "collection") {
                    pmCollection.onRemoveSyncableFile(id);
                }
                else if (type === "collection_request") {
                    pmCollection.onRemoveSyncableFileForRequests(id);
                }
            });

            // And this
            for(i = 0; i < this.models.length; i++) {
                collection = this.models[i];
                synced = collection.get("synced");

                if (!synced) {
                    this.addToSyncableFilesystem(collection.get("id"));
                }

                requests = collection.get("requests");

                for(j = 0; j < requests.length; j++) {
                    request = requests[j];

                    if (request.hasOwnProperty("synced")) {
                        if (!request.synced) {
                            this.addRequestToSyncableFilesystem(request.id);
                        }
                    }
                    else {
                        this.addRequestToSyncableFilesystem(request.id);
                    }
                }
            }
        }
        else {
        }
    },

    onReceivingSyncableFileData: function(data) {
        var collection = JSON.parse(data);
        this.addCollectionFromSyncableFileSystem(collection);
    },

    onRemoveSyncableFile: function(id) {
        this.deleteCollectionFromDataStore(id, false, function() {
        });
    },

    onReceivingSyncableFileDataForRequests: function(data) {
        var request = JSON.parse(data);
        this.addRequestFromSyncableFileSystem(request);
    },

    onRemoveSyncableFileForRequests: function(id) {
        this.deleteRequestFromDataStore(id, false, false, function() {
        });
    },

    onOverwriteCollection: function(collection) {
        this.overwriteCollection(collection);
    },

    onDeletedSharedCollection: function(collection) {
        var c;
        var pmCollection = this;

        for(var i = 0; i < this.models.length; i++) {
            var c = this.models[i];
            if (c.get("remote_id") === collection.remote_id) {
                c.set("remote_id", 0);
                pmCollection.updateCollectionInDataStore(c.getAsJSON(), true, function (c) {
                });
                break;
            }
        }
    },

    getAsSyncableFile: function(id) {
        var collection = this.get(id);
        var name = id + ".collection";
        var type = "collection";

        var data = JSON.stringify(collection.toSyncableJSON());

        return {
            "name": name,
            "type": type,
            "data": data
        };
    },

    getRequestAsSyncableFile: function(id) {
        var request = this.getRequestById(id);
        var name = id + ".collection_request";
        var type = "collection_request";

        request.synced = true;

        var data = JSON.stringify(request);

        return {
            "name": name,
            "type": type,
            "data": data
        };
    },

    addToSyncableFilesystem: function(id) {
        var pmCollection = this;

        var syncableFile = this.getAsSyncableFile(id);
        pm.mediator.trigger("addSyncableFile", syncableFile, function(result) {
            if(result === "success") {
                pmCollection.updateCollectionSyncStatus(id, true);
            }
        });
    },

    removeFromSyncableFilesystem: function(id) {
        var name = id + ".collection";
        pm.mediator.trigger("removeSyncableFile", name, function(result) {
        });
    },

    addRequestToSyncableFilesystem: function(id) {
        var pmCollection = this;

        var syncableFile = this.getRequestAsSyncableFile(id);
        pm.mediator.trigger("addSyncableFile", syncableFile, function(result) {
            if(result === "success") {
                pmCollection.updateCollectionRequestSyncStatus(id, true);
            }
        });
    },

    removeRequestFromSyncableFilesystem: function(id) {
        var name = id + ".collection_request";
        pm.mediator.trigger("removeSyncableFile", name, function(result) {
        });
    },

    /* Base data store functions*/
    addCollectionToDataStore: function(collectionJSON, sync, callback) {
        var pmCollection = this;

        pm.indexedDB.addCollection(collectionJSON, function (c) {
            var collection = new PmCollection(c);

            pmCollection.add(collection, {merge: true});
            pm.appWindow.trigger("sendMessageObject", "addedCollection", collection);

            pm.mediator.trigger("refreshCollections");


            if (sync) {
                pmCollection.addToSyncableFilesystem(collection.get("id"));
            }

            if (callback) {
                callback(c);
            }
        });
    },

    updateCollectionInDataStore: function(collectionJSON, sync, callback) {
        var pmCollection = this;

        pm.indexedDB.updateCollection(collectionJSON, function (c) {
            var collection = pmCollection.get(c.id);
            pmCollection.add(collection, {merge: true});
            pm.appWindow.trigger("sendMessageObject", "updatedCollection", collection);

            pm.mediator.trigger("refreshCollections");

            if (sync) {
                pmCollection.addToSyncableFilesystem(collection.get("id"));
            }

            if (callback) {
                callback(c);
            }
        });
    },

    deleteCollectionFromDataStore: function(id, sync, callback) {
        var pmCollection = this;

        pm.indexedDB.deleteCollection(id, function () {
            pmCollection.remove(id);
            pm.appWindow.trigger("sendMessageObject", "deletedCollection", id);

            if (sync) {
                pmCollection.removeFromSyncableFilesystem(id);
            }

            pm.indexedDB.getAllRequestsForCollectionId(id, function(requests) {
                var deleted = 0;
                var requestCount = requests.length;
                var request;
                var i;

                if (requestCount > 0) {
                    for(i = 0; i < requestCount; i++) {
                        request = requests[i];

                        pm.indexedDB.deleteCollectionRequest(request.id, function (requestId) {
                            deleted++;

                            if (sync) {
                                pmCollection.removeRequestFromSyncableFilesystem(requestId);
                            }

                            if (deleted === requestCount) {
                                pm.mediator.trigger("refreshCollections");
                                if (callback) {
                                    callback();
                                }
                            }
                        });
                    }
                }
                else {
                    if (callback) {
                        callback();
                    }
                }
            });
        });
    },

    addRequestToDataStore: function(request, sync, callback) {
        var pmCollection = this;

        pm.indexedDB.addCollectionRequest(request, function (req) {
            pm.mediator.trigger("addToURLCache", request.url);

            var collection = pmCollection.get(request.collectionId);

            if (collection) {
                collection.addRequest(request);
                pm.appWindow.trigger("sendMessageObject", "addedCollectionRequest", request);
            }

            if (sync) {
                pmCollection.addRequestToSyncableFilesystem(request.id);
            }

            if (callback) {
                callback(request);
            }
        });
    },

    updateRequestInDataStore: function(request, sync, callback) {
        var pmCollection = this;

        if (!request.name) {
            request.name = request.url;
        }

        pm.indexedDB.updateCollectionRequest(request, function (req) {
            var collection = pmCollection.get(request.collectionId);

            if (collection) {
                collection.updateRequest(request);
                pm.appWindow.trigger("sendMessageObject", "updatedCollectionRequest", request);
            }

            if (sync) {
                pmCollection.addRequestToSyncableFilesystem(request.id);
            }

            if (callback) {
                callback(request);
            }
        });
    },

    deleteRequestFromDataStore: function(id, sync, syncCollection, callback) {
        var pmCollection = this;

        var request = this.getRequestById(id);

        var targetCollection;

        if (request) {
            targetCollection = this.get(request.collectionId);
        }

        pm.indexedDB.deleteCollectionRequest(id, function () {
            if (targetCollection) {
                targetCollection.deleteRequest(id);
                collection = targetCollection.getAsJSON();

                if (sync) {
                    pmCollection.removeRequestFromSyncableFilesystem(id);
                    pm.appWindow.trigger("sendMessageObject", "deletedCollectionRequest", id);
                }

                if(callback) {
                    callback();
                }

                // This is called because the request would be deleted from "order"
                pmCollection.updateCollectionInDataStore(collection, syncCollection, function(c) {
                });
            }
            else {
                if (sync) {
                    pmCollection.removeRequestFromSyncableFilesystem(id);
                }

                if(callback) {
                    callback();
                }
            }
        });
    },

    /* Finish base data store functions*/

    // Get collection by folder ID
    getCollectionForFolderId: function(id) {
        function existingFolderFinder(r) {
            return r.id === id;
        }

        for(var i = 0; i < this.length; i++) {
            var collection = this.models[i];
            var folders = collection.get("folders");
            var folder = _.find(folders, existingFolderFinder);
            if (folder) {
                return collection;
            }
        }

        return null;
    },

    // Add collection
    addCollection:function (name, description) {
        var pmCollection = this;

        var collection = {};

        if (name) {
            collection.id = guid();
            collection.name = name;
            collection.description = description;
            collection.order = [];
            collection.timestamp = new Date().getTime();

            pmCollection.addCollectionToDataStore(collection, true);
        }
    },

    addCollectionFromSyncableFileSystem:function (collection) {
        var pmCollection = this;

        pmCollection.addCollectionToDataStore(collection, false, function(c) {
            pm.indexedDB.getAllRequestsInCollection(c, function(c, requests) {
                var collectionModel = pmCollection.get(c.id);
                collectionModel.set("synced", true);
                collectionModel.setRequests(requests);
                pmCollection.trigger("updateCollection", collectionModel);
            });
        });
    },

    addRequestFromSyncableFileSystem: function(request) {
        var pmCollection = this;

        pmCollection.addRequestToDataStore(request, false, function(r) {
            var collectionModel = pmCollection.get(request.collectionId);
            var folderId;
            var folder;
            var requestLocation;

            if (collectionModel) {
                requestLocation = pmCollection.getRequestLocation(request.id);

                if (requestLocation.type === "collection") {
                    pmCollection.trigger("moveRequestToCollection", collectionModel, request);
                }
                else if (requestLocation.type === "folder") {
                    folder = pmCollection.getFolderById(requestLocation.folderId);
                    pmCollection.trigger("moveRequestToFolder", collectionModel, folder, request);
                }
            }

        });
    },

    // Deprecated
    // Rename this
    // Add collection data to the database with new IDs
    addAsNewCollection:function(collection) {
        var pmCollection = this;
        var folders = [];
        var folder;
        var order;
        var j, count;
        var idHashTable = {};

        var dbCollection = _.clone(collection);
        dbCollection["requests"] = [];

        pmCollection.addCollectionToDataStore(dbCollection, true, function(c) {
            var collectionModel;
            var requests;
            var ordered;
            var i;
            var request;
            var newId;
            var currentId;
            var loc;

            collectionModel = pmCollection.get(c.id);

            // Shows successs message
            pmCollection.trigger("importCollection", {
                type: "collection",
                name:collection.name,
                action:"added"
            });

            requests = [];

            ordered = false;

            // Check against legacy collections which do not have an order
            if ("order" in collection) {
                ordered = true;
            }
            else {
                ordered = false;
                collection["order"] = [];
                collection.requests.sort(sortAlphabetical);
            }

            // Change ID of request - Also need to change collection order
            // and add request to indexedDB
            for (i = 0; i < collection.requests.length; i++) {
                request = collection.requests[i];
                request.collectionId = collection.id;

                if(request.hasOwnProperty("rawModeData")) {
                    request.data = request.rawModeData;
                    delete request.rawModeData;
                }

                var newId = guid();
                idHashTable[request.id] = newId;

                if (ordered) {
                    currentId = request.id;
                    loc = _.indexOf(collection["order"], currentId);
                    collection["order"][loc] = newId;
                }
                else {
                    collection["order"].push(newId);
                }

                request.id = newId;

                if ("responses" in request) {
                    for (j = 0, count = request["responses"].length; j < count; j++) {
                        request["responses"][j].id = guid();
                        request["responses"][j].collectionRequestId = newId;
                    }
                }

                requests.push(request);
            }

            // Change order inside folders with new IDs
            if ("folders" in collection) {
                folders = collection["folders"];

                for(i = 0; i < folders.length; i++) {
                    folders[i].id = guid();
                    order = folders[i].order;
                    for(j = 0; j < order.length; j++) {
                        order[j] = idHashTable[order[j]];
                    }

                }
            }

            collectionModel.setRequests(requests);
            collectionModel.set("folders", folders);
            collectionModel.set("order", collection["order"]);


            // Check for remote_id

            if (pm.user.isLoggedIn()) {
                var remoteId = pm.user.getRemoteIdForCollection(c.id);
                collectionModel.set("remote_id", remoteId);
            }

            // Add new collection to the database
            pmCollection.updateCollectionInDataStore(collectionModel.getAsJSON(), true, function() {
                var i;
                var request;

                for (i = 0; i < requests.length; i++) {
                    request = requests[i];
                    pmCollection.addRequestToDataStore(request, true, function(r) {
                    });
                }

                pmCollection.trigger("updateCollection", collectionModel);
            });
        });
    },

    updateCollectionOrder: function(id, order) {
        var pmCollection = this;

        var targetCollection = pmCollection.get(id);
        targetCollection.set("order", order);

        pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), true, function (collection) {
        });
    },

    updateCollectionSyncStatus: function(id, status) {
        var pmCollection = this;

        var targetCollection = pmCollection.get(id);
        targetCollection.set("synced", status);

        pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), false, function (collection) {
        });
    },

    updateCollectionMeta: function(id, name, description) {
        var pmCollection = this;

        var targetCollection = pmCollection.get(id);
        targetCollection.set("name", name);
        targetCollection.set("description", description);

        pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), true, function (collection) {
            pmCollection.trigger("updateCollectionMeta", targetCollection);
        });
    },

    deleteCollection:function (id, sync, callback) {
        this.deleteCollectionFromDataStore(id, true, function() {
        });
    },

    // Get collection data for file
    getCollectionDataForFile:function (id, callback) {
        pm.indexedDB.getCollection(id, function (data) {
            var c = data;
            var i;
            var name;
            var type;
            var filedata;

            pm.indexedDB.getAllRequestsInCollection(c, function (collection, requests) {
                for (i = 0, count = requests.length; i < count; i++) {
                    requests[i]["synced"] = false;

                    if(requests[i]["dataMode"]==="raw") {
                        requests[i]["rawModeData"]=requests[i]["data"];
                        requests[i]["data"]=[];
                    }
                }

                if (collection.hasOwnProperty("remote_id")) {
                    delete collection['remote_id'];
                }

                //Get all collection requests with one call
                collection['synced'] = false;
                collection['requests'] = requests;

                name = collection['name'] + ".json";
                type = "application/json";

                filedata = JSON.stringify(collection, null, '\t');
                callback(name, type, filedata);
            });
        });
    },

    // Save collection as a file
    saveCollection:function (id) {
        this.getCollectionDataForFile(id, function (name, type, filedata) {
            var filename = name + ".postman_collection";
            pm.filesystem.saveAndOpenFile(filename, filedata, type, function () {
                noty(
                    {
                        type:'success',
                        text:'Saved collection to disk',
                        layout:'topCenter',
                        timeout:750
                    });
            });
        });
    },

    // Upload collection
    uploadCollection:function (id, isPublic, refreshSharedCollections, callback) {
        var pmCollection = this;

        this.getCollectionDataForFile(id, function (name, type, filedata) {
            pm.api.uploadCollection(filedata, isPublic, function (data) {
                var link = data.link;

                if (callback) {
                    callback(link);
                }

                if (refreshSharedCollections) {
                    pm.mediator.trigger("refreshSharedCollections");
                }

                var collection = pmCollection.get(id);
                var remote_id = parseInt(data.id, 10);
                collection.set("remote_id", remote_id);
                collection.set("remoteLink", link);
                pmCollection.updateCollectionInDataStore(collection.getAsJSON(), true, function (c) {
                });
            });
        });
    },

    escapeScript: function(str) {
        if(!str) return "";

        return str.replace(/[\\]/g, '\\\\')
            .replace(/[\/]/g, '\\/')
            .replace(/[\b]/g, '\\b')
            .replace(/[\f]/g, '\\f')
            .replace(/[\n]/g, '\\n')
            .replace(/[\r]/g, '\\r')
            .replace(/[\t]/g, '\\t');
    },

    // New version of overwrite collection
    overwriteCollection:function(collection) {
        var pmCollection = this;

        if (collection.hasOwnProperty("order")) {
            ordered = true;
        }
        else {
            ordered = false;
            collection["order"] = [];

            for (i = 0; i < collection["requests"].length; i++) {
                collection["order"].push(collection.requests[i].id);
            }
        }

        var dbCollection = _.clone(collection);

        // Do not save requests in the same IndexedDB table
        if ("requests" in collection) {
            delete dbCollection['requests'];
        }

        pmCollection.addCollectionToDataStore(dbCollection, true, function(c) {
            var collectionModel;
            var requests = collection.requests;
            var i;
            var request;

            collectionModel = pmCollection.get(collection.id);

            if (collection.hasOwnProperty("requests")) {
                for (i = 0; i < requests.length; i++) {
                    if(collection.requests[i].dataMode==="raw") {
                        if(collection.requests[i].hasOwnProperty("rawModeData")) {
                            collection.requests[i].data=collection.requests[i].rawModeData;
                        }
                    }
                    if(!collection.requests[i].hasOwnProperty("preRequestScript")) {
                        collection.requests[i]["preRequestScript"] = "";
                    }
                    if(!collection.requests[i].hasOwnProperty("tests")) {
                        collection.requests[i]["tests"] = "";
                    }
                }

                collectionModel.set("requests", collection.requests);

                for (i = 0; i < requests.length; i++) {
                    request = requests[i];
                    
                    pmCollection.addRequestToDataStore(request, true, function(r) {
                    });
                }
            }
            else {
                collectionModel.set("requests", []);
            }

            pmCollection.trigger("updateCollection", collectionModel);

            // Shows successs message
            pmCollection.trigger("importCollection", { type: "collection", name:collection.name, action:"added" });
        });
    },

    // Duplicate collection
    duplicateCollection:function(collection) {
        this.addAsNewCollection(collection);
    },

    // Merge collection
    // Being used in IndexedDB bulk import
    mergeCollection: function(collection) {
        var validationResult = pm.collectionValidator.validateJSON('c', collection, {correctDuplicates: true, validateSchema: false});
        if(validationResult.status == false) {
            noty(
                {
                    type: 'warning',
                    text: 'Invalid collection file: ' + validationResult.message,
                    layout: 'topCenter',
                    timeout: 5000
                }
            );
        }

        var pmCollection = this;

        //Update local collection
        var newCollection = {
            id: collection.id,
            name: collection.name,
            timestamp: collection.timestamp
        };

        var targetCollection;
        targetCollection = new PmCollection(newCollection);
        targetCollection.set("name", collection.name);

        targetCollection.set("requests", collection.requests);

        if ("order" in collection) {
            targetCollection.set("order", collection.order);
        }
        else {
            var order = [];
            var requests = targetCollection.get("requests");
            for(var j = 0; j < requests.length; j++) {
                order.push(requests[j].id);
            }

            targetCollection.set("order", order);
        }

        if ("folders" in collection) {
            targetCollection.set("folders", collection.folders);
        }

        pmCollection.add(targetCollection, {merge: true});
        pm.appWindow.trigger("sendMessageObject", "updatedCollection", targetCollection);

        pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), true, function (c) {
            var driveCollectionRequests = collection.requests;

            pm.indexedDB.getAllRequestsInCollection(collection, function(collection, oldCollectionRequests) {
                var updatedRequests = [];
                var deletedRequests = [];
                var newRequests = [];
                var finalRequests = [];
                var i = 0;
                var driveRequest;
                var existingRequest;
                var sizeOldRequests;
                var loc;
                var j;
                var sizeUpdatedRequests;
                var sizeNewRequests;
                var sizeDeletedRequests;
                var size = driveCollectionRequests.length;

                function existingRequestFinder(r) {
                    return driveRequest.id === r.id;
                }

                for (i = 0; i < size; i++) {
                    driveRequest = driveCollectionRequests[i];
                    driveRequest.preRequestScript = pmCollection.escapeScript(driveRequest.preRequestScript);
                    driveRequest.tests = pmCollection.escapeScript(driveRequest.tests);

                    existingRequest = _.find(oldCollectionRequests, existingRequestFinder);

                    if (existingRequest) {
                        updatedRequests.push(driveRequest);

                        sizeOldRequests = oldCollectionRequests.length;
                        loc = -1;
                        for (j = 0; j < sizeOldRequests; j++) {
                            if (oldCollectionRequests[j].id === existingRequest.id) {
                                loc = j;
                                break;
                            }
                        }

                        if (loc >= 0) {
                            oldCollectionRequests.splice(loc, 1);
                        }
                    }
                    else {
                        newRequests.push(driveRequest);
                    }
                }

                deletedRequests = oldCollectionRequests;

                sizeUpdatedRequests = updatedRequests.length;
                for(i = 0; i < sizeUpdatedRequests; i++) {
                    pmCollection.updateRequestInDataStore(updatedRequests[i], true);
                }

                sizeNewRequests = newRequests.length;
                for(i = 0; i < sizeNewRequests; i++) {
                    pmCollection.addRequestToDataStore(newRequests[i], true);
                }

                sizeDeletedRequests = deletedRequests.length;
                for(i = 0; i < sizeDeletedRequests; i++) {
                    pmCollection.deleteRequestFromDataStore(deletedRequests[i], true);
                }

                pmCollection.trigger("updateCollection", targetCollection);
            });
        });
    },

    // Merge multiple collections. Used in bulk data import
    mergeCollections: function (collections) {
        var pmCollection = this;

        var size = collections.length;
        for(var i = 0; i < size; i++) {
            var collection = collections[i];
            pmCollection.mergeCollection(collection, true);
        }
    },

    importCollectionData:function (collection, forceAdd) {
        var validationResult = pm.collectionValidator.validateJSON('c', collection, {correctDuplicates: true, validateSchema: false});
        if(validationResult.status == false) {
            noty(
                {
                    type: 'warning',
                    text: 'Invalid collection file: ' + validationResult.message,
                    layout: 'topCenter',
                    timeout: 5000
                }
            );
        }

        if(this.getCollectionById(collection.id)!==null) {
            this.originalCollectionId = collection.id;
            this.toBeImportedCollection = collection;
            this.trigger("overwriteCollectionChoice", collection);
        }
        else {
            this.overwriteCollection(collection);
        }
    },

    setNewCollectionId: function(collection) {
        var newId = guid();
        var numFolders = (collection.folders)?collection.folders.length:0;
        for(var i=0;i<numFolders;i++) {
            collection.folders[i].collection_id = newId;

        }

        var numRequests = (collection.requests)?collection.requests.length:0;
        for(var i=0;i<numRequests;i++) {
            collection.requests[i].collectionId = newId;
        }

        collection.id = newId;
    },

    onAddDirectoryCollection: function(collection) {
        this.setNewCollectionId(collection);
        this.addAsNewCollection(collection);
    },

    guessFileFormat: function(data, alreadyJson) {
        //check if it is JSON:
        var jsonObj;
        try {
            if(alreadyJson===true) {
                jsonObj = data;
            }
            else {
                jsonObj = JSON.parse(data);
            }
            if(jsonObj.hasOwnProperty("swaggerVersion")) return "SWAGGER1.2";
            if(jsonObj.hasOwnProperty("folders") || jsonObj.hasOwnProperty("requests") || jsonObj.hasOwnProperty("order")) return "COLLECTION";

            //Is JSON, but not collection or swagger
            return 0;
        }
        catch(e) {
            if(data instanceof Node) {
                var xs = new XMLSerializer();
                data = xs.serializeToString(data);
            }
            data = data.trim();
            var firstLine = data.split("\n")[0];
            if(firstLine.indexOf("#%RAML")===0) return "RAML";  //check raml = first line is #%RAML
            if(firstLine.toLowerCase().indexOf("curl")===0) return "CURL";
	        if(data.substring(0,5).indexOf("<")!==-1 && data.substring(0,400).indexOf("<application")!==-1) return "WADL";

            //Not JSON, and not raml, curl, wadl
            return 0;
        }
    },

    showImportError: function(type, message) {
        noty({
                type:'error',
                text:'Errow while importing '+type+': '+message,
                layout:'center',
                timeout:2000
            });
    },

    importData: function(data, format, alreadyJson) {
        var pmCollection = this;
        if(format==="SWAGGER1.2") {
            var swaggerJson = alreadyJson?data:JSON.parse(data);
            swaggerConverter.convertJSON(
                swaggerJson, 
                {
                    group: true,
                    test: false
                },  
                function(collection, env) {
                    pm.collections.importCollectionData(collection);
                }, function(errorMessage) {
                    pm.collections.showImportError("Swagger", errorMessage);
                }
            ); 
        }
        else if(format === "COLLECTION") {
            var collection = alreadyJson?data:JSON.parse(data);
            // collection.id = guid();
            pmCollection.importCollectionData(collection);
        }
        else if(format==="RAML") {
            ramlConverter.parseString(data, function(op, env) {
                pm.collections.importCollectionData(op);
            }, function(errorMessage) {
                if(errorMessage.indexOf("cannot fetch")!==-1) {
                    errorMessage = "External references are not supported yet. " + errorMessage;
                }
                pm.collections.showImportError("RAML", errorMessage);
            });
        }
        else if(format==="CURL") {
            try {
                var requestJSON = curlConverter.convertCurlToRequest(data);
                if (requestJSON.error) {
                    pm.collections.showImportError("Curl", requestJSON.error);
                }
                else {
                    var re = /\\n/gi
                    requestJSON.headers = requestJSON.headers.replace(re, "\n");
                    pm.mediator.trigger("loadRequest", requestJSON, true);
                    pmCollection.trigger("importCollection", {
                        type: "request",
                        name: (requestJSON.name != "" && requestJSON.name != null) ? requestJSON.name : requestJSON.url,
                        action: "added"
                    });
                }
            }
            catch(e) {
                pm.collections.showImportError("Curl", e.message);
            }
        }
        else if(format==="WADL") {
	        wadlConverter.convertXMLString(data,{},function(collection) {
		        pm.collections.importCollectionData(collection);
	        }, function(error) {
                pm.collections.showImportError("WADL", error);
            });
        }
        else {
            console.log("Unknown format");
        }
    },

    importFiles: function(files) {
        var pmCollection = this;
        for (var i = 0, f; f = files[i]; i++) {
            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function (theFile) {
                return function (e) {
                    // Render thumbnail.
                    var data = e.currentTarget.result;
                    try {
                        data = data.trim();
                        var fileFormat = pmCollection.guessFileFormat(data);
                        if(fileFormat===0) {
                            throw "Could not parse";
                        }
                        pmCollection.importData(data, fileFormat);
                    }
                    catch(e) {
                        pm.mediator.trigger("failedCollectionImport","format not recognized");
                    }
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsText(f);
        }
    },

    // Import multiple collections
    importCollections:function (files) {
        var pmCollection = this;

        // Loop through the FileList
        for (var i = 0, f; f = files[i]; i++) {
            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function (theFile) {
                return function (e) {
                    // Render thumbnail.
                    var data = e.currentTarget.result;
                    try {
                        data = data.trim();
                        var collection = jsonlint.parse(data);
                        // collection.id = guid();
                        pmCollection.importCollectionData(collection);
                    }
                    catch(e) {
                        pm.mediator.trigger("failedCollectionImport", "could not import collection - " + e.message);
                    }
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsText(f);
        }
    },

    importFileFromUrl:function (url) {
        var pmCollection = this;

        $.ajax({
            type: 'GET',
            url: url,
            success: function(data) {
                try {
                    if(typeof data === "object" && !(data instanceof Node)) {
                        //already Json
                        var fileFormat = pmCollection.guessFileFormat(data, true);
                        if(fileFormat===0) {
                            throw "Could not parse";
                        }
                        pmCollection.importData(data, fileFormat, true);
                    }
                    else if(data instanceof Node) {
                        //it's an xml element. don't trim
                        var fileFormat = pmCollection.guessFileFormat(data, false);
                        if(fileFormat===0) {
                            throw "Could not parse";
                        }

                        var xs = new XMLSerializer();
                        data = xs.serializeToString(data);

                        pmCollection.importData(data, fileFormat, false);
                    }
                    else {
                        data = data.trim();
                        var fileFormat = pmCollection.guessFileFormat(data, false);
                        if(fileFormat===0) {
                            throw "Could not parse";
                        }
                        pmCollection.importData(data, fileFormat, false);
                    }
                }
                catch(e) {
                    pm.mediator.trigger("failedCollectionImport", "format not recognized");
                }
            }
        });
    },

    // Get request by ID
    getRequestById: function(id) {
        function existingRequestFinder(r) {
            return r.id === id;
        }

        for(var i = 0; i < this.models.length; i++) {
            var collection = this.models[i];

            var requests = collection.get("requests");

            var request = _.find(requests, existingRequestFinder);
            if (request) {
                return request;
            }
        }

        return null;
    },

    getRequestLocation: function(id) {
        var i;
        var collection;
        var indexCollection;
        var folders;
        var indexFolder;

        for(var i = 0; i < this.models.length; i++) {
            collection = this.models[i];

            indexCollection = _.indexOf(collection.get("order"), id);

            if (indexCollection >= 0) {
                return {
                    "type": "collection",
                    "collectionId": collection.get("id")
                };
            }
            else {
                folders = collection.get("folders");
                for(j = 0; j < folders.length; j++) {
                    indexFolder = _.indexOf(folders[j].order, id);

                    if (indexFolder >= 0) {
                        return {
                            "type": "folder",
                            "folderId": folders[j].id,
                            "collectionId": collection.get("id")
                        };
                    }
                }
            }
        }

        return {
            "type": "not_found"
        };
    },

    // Load collection request in the editor
    loadCollectionRequest:function (id) {
        var pmCollection = this;

        pm.indexedDB.getCollectionRequest(id, function (request) {
            request.isFromCollection = true;
            request.collectionRequestId = id;
            pm.mediator.trigger("loadRequest", request, true);
            pmCollection.trigger("selectedCollectionRequest", request);
        });
    },

    // For the TCPReader. Not for the current request
    addRequestToCollectionId: function(collectionRequest, collectionId) {
        var pmCollection = this;

        collectionRequest.collectionId = collectionId;

        var targetCollection = pmCollection.get(collectionId);
        targetCollection.addRequestIdToOrder(collectionRequest.id);


        pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), true, function() {
            pmCollection.addRequestToDataStore(collectionRequest, true, function(req) {
                pmCollection.trigger("addCollectionRequest", req);
            });
        });
    },

    // Add request to collection. For the current request
    addRequestToCollection:function (collectionRequest, collection, noNotif) {
        if(typeof(noNotif)==='undefined') noNotif = false;

        var pmCollection = this;

        if (collection.name) {
            collection.requests = [];
            collection.order = [collectionRequest.id];
            collection.timestamp = new Date().getTime();

            pmCollection.addCollectionToDataStore(collection, true, function(newCollection) {
                collectionRequest.collectionId = newCollection.id;

                pmCollection.addRequestToDataStore(collectionRequest, true, function(req) {
                    pmCollection.trigger("addCollectionRequest", req);
                    pmCollection.loadCollectionRequest(req.id);
                });
            });
        }
        else {
            collectionRequest.collectionId = collection.id;

            var targetCollection = pmCollection.get(collection.id);
            targetCollection.addRequestIdToOrder(collectionRequest.id);


            pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), true, function() {
                pmCollection.addRequestToDataStore(collectionRequest, true, function(req) {
                    pmCollection.trigger("addCollectionRequest", req);
                    pmCollection.loadCollectionRequest(req.id);
                });
            });
        }

        this.trigger("updateCollectionRequest", collectionRequest, noNotif);
        pm.mediator.trigger("updateCollectionRequest", collectionRequest);
    },


    // Add request to folder
    addRequestToFolder: function(collectionRequest, collectionId, folderId, noNotif) {
        if(typeof(noNotif)==='undefined') noNotif = false;

        var pmCollection = this;

        var collection = this.get(collectionId);
        collectionRequest.collectionId = collectionId;
        collection.addRequestIdToOrder(collectionRequest.id);

        pmCollection.addRequestToDataStore(collectionRequest, true, function(req) {
            pmCollection.moveRequestToFolder(req.id, folderId);
            pmCollection.loadCollectionRequest(req.id);
        });

        if(!noNotif) {
        noty(
            {
                type:'success',
                text:'Saved request',
                layout:'topCenter',
                timeout:750
            });
        }


    },


    addResponseToCollectionRequest: function(collectionRequestId, response) {
        var pmCollection = this;

        pm.indexedDB.getCollectionRequest(collectionRequestId, function (collectionRequest) {
            var responses;

            if (collectionRequest.hasOwnProperty("responses")) {
                responses = collectionRequest["responses"];
            }
            else {
                responses = [];
            }

            responses.push(response);

            pmCollection.updateRequestInDataStore(collectionRequest, true, function(request) {
                pmCollection.trigger("updateCollectionRequest", request);
                pm.mediator.trigger("updateCollectionRequest", request);
            });
        });
    },

    updateResponsesForCollectionRequest: function(collectionRequestId, responses) {
        var pmCollection = this;

        pm.indexedDB.getCollectionRequest(collectionRequestId, function (collectionRequest) {
            var c = _.clone(collectionRequest);
            c.responses = responses;
            pmCollection.updateRequestInDataStore(c, true, function(request) {
                pmCollection.trigger("updateCollectionRequest", request);
                pm.mediator.trigger("updateCollectionRequest", request);
            });
        });
    },

    // Update collection request
    updateCollectionRequest:function (collectionRequest) {
        var pmCollection = this;

        pm.indexedDB.getCollectionRequest(collectionRequest.id, function (req) {
            collectionRequest.name = req.name;
            collectionRequest.description = req.description;
            collectionRequest.collectionId = req.collectionId;
            collectionRequest.responses = req.responses;

            pmCollection.updateRequestInDataStore(collectionRequest, true, function(request) {
                pmCollection.trigger("updateCollectionRequest", request);
                pm.mediator.trigger("updateCollectionRequest", request);
            });
        });
    },

    updateCollectionRequestMeta: function(id, name, description) {
        var pmCollection = this;

        pm.indexedDB.getCollectionRequest(id, function (req) {
            req.name = name;
            req.description = description;

            pmCollection.updateRequestInDataStore(req, true, function(request) {
                pmCollection.trigger("updateCollectionRequest", request);
                pm.mediator.trigger("updateCollectionRequest", request);
            });
        });
    },

    updateCollectionRequestSyncStatus: function(id, status) {
        var pmCollection = this;

        pm.indexedDB.getCollectionRequest(id, function (req) {
            req.synced = status;

            pmCollection.updateRequestInDataStore(req, false, function(request) {
            });
        });
    },

    updateCollectionRequestTests: function(id, tests) {
        var pmCollection = this;

        pm.indexedDB.getCollectionRequest(id, function (req) {
            req.tests = tests;

            pmCollection.updateRequestInDataStore(req, true, function(request) {
                pmCollection.trigger("updateCollectionRequest", request);
                pm.mediator.trigger("updateCollectionRequest", request);
            });
        });
    },

    // Delete collection request
    deleteCollectionRequest:function (id, callback) {
        var pmCollection = this;

        pmCollection.deleteRequestFromDataStore(id, true, true, function() {
            pmCollection.trigger("removeCollectionRequest", id);

            if (callback) {
                callback();
            }
        });
    },

    moveRequestToFolder: function(requestId, targetFolderId) {
        pm.requestTransferInProgress = true;
        setTimeout(function() {
                        pm.requestTransferInProgress = false;
        },200);

        var pmCollection = this;
        var request = _.clone(this.getRequestById(requestId));
        var folder = this.getFolderById(targetFolderId);
        var targetCollection = this.getCollectionForFolderId(targetFolderId);

        if(targetCollection.id === request.collectionId) {
            targetCollection.addRequestIdToFolder(folder.id, request.id);
            pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), true, function() {
                pmCollection.trigger("moveRequestToFolder", targetCollection, folder, request);
            });
        }
        else {
            // Different collection
            pmCollection.deleteCollectionRequest(requestId, function() {
                request.id = guid();
                request.collectionId = targetCollection.get("id");

                targetCollection.addRequestIdToOrder(request.id);

                pmCollection.addRequestToDataStore(request, true, function(req) {
                    targetCollection.addRequestIdToFolder(folder.id, req.id);
                    var collection = targetCollection.getAsJSON();
                    pmCollection.updateCollectionInDataStore(collection, true, function(c) {
                        pmCollection.trigger("moveRequestToFolder", targetCollection, folder, request);
                    });
                });
            });

        }
    },

    moveRequestToCollection: function(requestId, targetCollectionId) {
        pm.requestTransferInProgress = true;
        setTimeout(function() {
            pm.requestTransferInProgress = false;
        },200);
        var pmCollection = this;
        var targetCollection = this.get(targetCollectionId);
        var request = _.clone(this.getRequestById(requestId));

        if(targetCollectionId === request.collectionId) {
            targetCollection.addRequestIdToOrder(request.id);

            pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), true, function(c) {
                pmCollection.trigger("moveRequestToCollection", targetCollection, request);
            });
        }
        else {
            var oldCollection = pmCollection.get(request.collectionId);

            pmCollection.deleteCollectionRequest(requestId, function() {
                request.id = guid();
                request.collectionId = targetCollectionId;

                targetCollection.addRequestIdToOrder(request.id);

                pmCollection.addRequestToDataStore(request, true, function(req) {
                    pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), true, function(c) {
                        pmCollection.trigger("moveRequestToCollection", targetCollection, request);
                    });
                });
            });
        }
    },

    // Get folder by ID
    getFolderById: function(id) {
        function existingFolderFinder(r) {
            return r.id === id;
        }

        for(var i = 0; i < this.length; i++) {
            var collection = this.models[i];
            var folders = collection.get("folders");
            var folder = _.find(folders, existingFolderFinder);
            if (folder) {
                return folder;
            }
        }

        return null;
    },

    addFolder: function(parentId, folderName, description) {
        var collection = this.get(parentId);

        var newFolder = {
            "id": guid(),
            "name": folderName,
            "description": description,
            "order": []
        };

        collection.addFolder(newFolder);
        this.trigger("addFolder", collection, newFolder);
        this.updateCollectionInDataStore(collection.getAsJSON(), true);
    },

    addExistingFolder: function(parentId, folder) {
        var collection = this.get(parentId);
        collection.addFolder(folder);
        this.trigger("addFolder", collection, folder);
        this.updateCollectionInDataStore(collection.getAsJSON(), true);
    },

    updateFolderOrder: function(collectionId, folderId, order) {
        var folder = this.getFolderById(folderId);
        folder.order = order;
        var collection = this.get(collectionId);
        collection.editFolder(folder);

        this.updateCollectionInDataStore(collection.getAsJSON(), true);
    },

    updateFolderMeta: function(id, name, description) {
        var folder = this.getFolderById(id);
        folder.name = name;
        folder.description = description;
        var collection = this.getCollectionForFolderId(id);
        collection.editFolder(folder);
        this.trigger("updateFolder", collection, folder);

        this.updateCollectionInDataStore(collection.getAsJSON(), true);
    },

    deleteFolder: function(id) {
        var folder = this.getFolderById(id);
        var folderRequestsIds = _.clone(folder.order);
        var i;
        var collection;

        for(i = 0; i < folderRequestsIds.length; i++) {
            this.deleteRequestFromDataStore(folderRequestsIds[i], true, false);
        }

        collection = this.getCollectionForFolderId(id);
        collection.deleteFolder(id);

        this.trigger("deleteFolder", collection, id);
        this.updateCollectionInDataStore(collection.getAsJSON(), true);
    },

    filter: function(term) {
        term = term.toLowerCase();
        var collections = this.toJSON();
        var collectionCount = collections.length;
        var filteredCollections = [];
        var name;
        var requests;
        var requestsCount;
        var i, j, k, c, r, f;
        var folders;
        var folderOrder;
        var visibleRequestHash = {};

        for(i = 0; i < collectionCount; i++) {
            c = {
                id: collections[i].id,
                name: collections[i].name,
                requests: [],
                folders: [],
                toShow: false
            };

            name = collections[i].name.toLowerCase();

            if (name.search(term) >= 0) {
                c.toShow = true;
            }

            requests = collections[i].requests;

            if (requests) {
                requestsCount = requests.length;

                for(j = 0; j < requestsCount; j++) {
                    r = {
                        id: requests[j].id,
                        name: requests[j].name,
                        toShow: false
                    };

                    name = requests[j].name.toLowerCase();

                    if (name.search(term) >= 0) {
                        r.toShow = true;
                        c.toShow = true;
                        visibleRequestHash[r.id] = true;
                    }
                    else {
                        r.toShow = false;
                        visibleRequestHash[r.id] = false;
                    }

                    c.requests.push(r);
                }
            }

            if("folders" in collections[i]) {
                folders = collections[i].folders;
                for (j = 0; j < folders.length; j++) {
                    f = {
                        id: folders[j].id,
                        name: folders[j].name,
                        toShow: false
                    };

                    name = folders[j].name.toLowerCase();

                    if (name.search(term) >= 0) {
                        f.toShow = true;
                        c.toShow = true;
                    }

                    folderOrder = folders[j].order;

                    // Check if any requests are to be shown
                    for(k = 0; k < folderOrder.length; k++) {
                        if (visibleRequestHash[folderOrder[k]] === true) {
                            f.toShow = true;
                            c.toShow = true;
                            break;
                        }
                    }

                    c.folders.push(f);
                }
            }

            filteredCollections.push(c);
        }

        this.trigger("filter", filteredCollections);
        return filteredCollections;
    },

    revert: function() {
        this.trigger("revertFilter");
    }
});
var AddCollectionModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        pm.mediator.on("switchCodeMirrorTheme", this.onSwitchCodeMirrorTheme, this);

        $('#form-new-collection').submit(function () {
            var name = $('#new-collection-blank').val();
            var description = view.editor.getValue();
            model.addCollection(name, description);
            $('#new-collection-blank').val("");
            $('#modal-new-collection').modal('hide');
            return false;
        });

        $('#modal-new-collection .btn-primary').click(function () {
            var name = $('#new-collection-blank').val();
            var description = view.editor.getValue();
            model.addCollection(name, description);
            $('#new-collection-blank').val("");
            $('#modal-new-collection').modal('hide');
            return false;
        });

        $("#modal-new-collection").on("shown", function () {
            $("#new-collection-blank").focus();
            pm.app.trigger("modalOpen", "#modal-new-collection");

            if (!view.editor) {
                view.initializeEditor();
            }
            setTimeout(function() {
                view.editor.setValue("", -1);
                //view.editor.refresh();
                view.editor.gotoLine(0,0,false);
            }, 150);
        });

        $("#modal-new-collection").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        $("#modal-new-collection").on('keydown', 'div.input', function (event) {
            if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
                $('#form-new-collection').submit();
                event.preventDefault();
                return false;
            }

            return true;
        });
    },

    onSwitchCodeMirrorTheme: function(theme) {
        var codeMirror = pm.addCollectionEditor;

        if (codeMirror) {
            codeMirror.setTheme("ace/theme/"+theme);
        }
    },

    initializeEditor: function() {
        if (this.editor) {
            return;
        }
        this.editor = ace.edit(document.getElementById("new-collection-description"));

        pm.addCollectionEditor = this.editor;
        var theme = (pm.settings.getSetting("postmanTheme")==="light")?"clouds":"monokai";
        this.editor.setTheme("ace/theme/"+theme);
    }
});

var AddCollectionRequestModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        pm.mediator.on("switchCodeMirrorTheme", this.onSwitchCodeMirrorTheme, this);

        view.pendingDescription = null;

        model.on("add", this.onChanged, this);
        model.on("remove", this.onChanged, this);
        model.on("change", this.onChanged, this);

        model.on("updateCollection", this.onChanged, this);
        model.on("updateCollectionMeta", this.onChanged, this);

        model.on("addFolder", this.onChanged, this);
        model.on("updateFolder", this.onChanged, this);
        model.on("deleteFolder", this.onChanged, this);

        var view = this;

        $('#form-add-to-collection').submit(function () {
            _.bind(view.addRequestToCollection, view)();
            $('#modal-add-to-collection').modal('hide');
            $('#new-collection').val("");
        });

        $('#modal-add-to-collection .btn-primary').click(function () {
            _.bind(view.addRequestToCollection, view)();
            $('#modal-add-to-collection').modal('hide');
            $('#new-collection').val("");
        });

        $("#modal-add-to-collection").on("shown", function () {            
            $("#select-collection").focus();
            pm.app.trigger("modalOpen", "#modal-add-to-collection");

            if (!view.editor) {
                view.initializeEditor();
            }
        });

        $("#modal-add-to-collection").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

	    $("#modal-add-to-collection").on('keydown', 'div.input', function (event) {
		    if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
			    $('#form-add-to-collection').submit();
			    event.preventDefault();
			    return false;
		    }

		    return true;
	    });

	    $("#modal-add-to-collection").keydown(function (event) {
		    if (event.keyCode === 13) {
			    $('#form-add-to-collection').submit();
			    event.preventDefault();
			    return false;
		    }

		    return true;
	    });

        //Initialize select-collection options

        $(document).bind('keydown', 'a', function () {
            if(pm.app.isModalOpen()) {
                return;
            }

            $('#modal-add-to-collection').modal({
                keyboard:true
            });

            $('#modal-add-to-collection').modal('show');
            return false;
        });

        pm.mediator.on("showAddCollectionModal", this.onShowAddCollectionModal, this);
    },

    onSwitchCodeMirrorTheme: function(theme) {
        var codeMirror = pm.addRequestToCollectionEditor;

        if (codeMirror) {
            codeMirror.setTheme("ace/theme/"+theme);
        }
    },

    onShowAddCollectionModal: function(name, description) {
        var view = this;

        $("#new-request-name").val(name);

        if (this.editor) {
            if (description) {
                this.editor.setValue(description, -1);
            }
            else {
                this.editor.setValue("", -1);
            }

            this.pendingDescription = null;
            
        }
        else {
            this.pendingDescription = description;
        }        

        $("#modal-add-to-collection").modal("show");
    },


    initializeEditor: function() {
        if (this.editor) {
            return;
        }

        this.editor = ace.edit(document.getElementById("new-request-description"));

        var theme = (pm.settings.getSetting("postmanTheme")==="light")?"clouds":"monokai";
        this.editor.setTheme("ace/theme/"+theme);
        this.editor.getSession().setMode('ace/mode/markdown');
        pm.addRequestToCollectionEditor = this.editor;

        if (this.pendingDescription) {
            this.editor.setValue(this.pendingDescription, -1);
            this.pendingDescription = null;
        }
        else {
            this.editor.setValue("", -1);
            this.pendingDescription = null;
        }

    },

    add: function(model, pmCollection) {
        $('#select-collection').append(Handlebars.templates.item_collection_selector_list(model.toJSON()));
    },

    remove: function(model, pmCollection) {
        var collection = model.toJSON();
        $('#select-collection option[value="' + collection.id + '"]').remove();
    },

    onChanged: function() {        
        var items = _.clone(this.model.toJSON());
        var folders;

        for(var i = 0; i < items.length; i++) {
            if("folders" in items[i]) {
                folders = items[i].folders;

                folders.sort(sortAlphabetical);

                for(var j = 0; j < folders.length; j++) {
                    folders[j].collection_name = items[i].name;
                    folders[j].collection_id = items[i].id;
                }
            }
        }

        $('#select-collection').html("<option>Select</option>");
        $('#select-collection').append(Handlebars.templates.collection_selector_list({items: this.model.toJSON()}));

        $('#select-collection').val(this.lastSelectValue);
    },

    addRequestToCollection: function() {
        var selectValue = $("#select-collection").val();
        this.lastSelectValue = selectValue;

        var $option = $("#select-collection option[value='" + selectValue + "']");
        var targetType = $option.attr("data-type");

        var collectionId;
        var folderId;

        if (targetType === "collection") {
            collectionId = $option.attr("data-collection-id");
        }
        else if (targetType === "folder") {
            collectionId = $option.attr("data-collection-id");
            folderId = $option.attr("data-folder-id");
        }

        var newCollection = $("#new-collection").val();

        var collection = {};

        if (newCollection) {
            targetType = "collection";
            collection.id = guid();
            collection.name = newCollection;
        }
        else {
            collection.id = collectionId;
        }

        var newRequestName = $('#new-request-name').val();
        var newRequestDescription = this.editor.getValue();

        var model = this.model;

        pm.mediator.trigger("getRequest", function(request) {
            var body = request.get("body");

            var url = request.get("url");
            if (newRequestName === "") {
                newRequestName = url;
            }

            var currentHelper = pm.helpers.getActiveHelperType();
	        var helperData, helperAttributes, saveHelperToRequest;
	        if(currentHelper!=="normal") {
                helperData = pm.helpers.getHelper(currentHelper).attributes;
                helperAttributes = request.getHelperProperties(helperData);
		        saveHelperToRequest = $("#request-helper-"+currentHelper+"-saveHelper").is(":checked");
	        }
	        else {
		        saveHelperToRequest = false;
	        }

            if(saveHelperToRequest===false) {
                currentHelper = "normal";
                helperAttributes = {};
            }

            // TODO Get some of this from getAsJson
            var collectionRequest = {
                id: guid(),
                headers: request.getPackedHeaders(),
                url: url,
                pathVariables: request.get("pathVariables"),
                preRequestScript: request.get("preRequestScript"),
                method: request.get("method"),
                data: body.get("dataAsObjects"),
                dataMode: body.get("dataMode"),
                name: newRequestName,
                description: newRequestDescription,
                descriptionFormat: "html",
                time: new Date().getTime(),
                version: 2,
                responses: [],
                tests: request.get("tests"),
                currentHelper: currentHelper,
                helperAttributes: helperAttributes
            };

            if (targetType === "folder") {
                model.addRequestToFolder(collectionRequest, collectionId, folderId);
            }
            else {
                model.addRequestToCollection(collectionRequest, collection);
            }
        });
    }
});
var AddFolderModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        model.on("showAddFolderModal", this.render, this);

        pm.mediator.on("switchCodeMirrorTheme", this.onSwitchCodeMirrorTheme, this);

        $('#form-add-folder').submit(function () {
            var parentId = $('#add-folder-parent-id').val();
            var name = $('#add-folder-name').val();
            var description = view.editor.getValue();
            model.addFolder(parentId, name, description);
            $('#add-folder-name').val("");
            $('#modal-add-folder').modal('hide');
            return false;
        });

        $('#modal-add-folder .btn-primary').click(function () {
            var parentId = $('#add-folder-parent-id').val();
            var name = $('#add-folder-name').val();
            var description = view.editor.getValue();
            model.addFolder(parentId, name, description);
            $('#add-folder-name').val("");
            $('#modal-add-folder').modal('hide');
            return false;
        });

        $("#modal-add-folder").on("shown", function () {
            $("#add-folder-name").focus();
            pm.app.trigger("modalOpen", "#modal-add-folder");
            if (!view.editor) {
                view.initializeEditor();
            }
            setTimeout(function() {
                view.editor.setValue("", -1);
                //view.editor.refresh();
                view.editor.gotoLine(0,0,false);
            }, 150);
        });

        $("#modal-add-folder").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        $("#modal-add-folder").on('keydown', 'div.input', function (event) {
            if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
                $('#form-add-folder').submit();
                event.preventDefault();
                return false;
            }
            return true;
        });
    },

    onSwitchCodeMirrorTheme: function(theme) {
        var codeMirror = this.editor;

        if (codeMirror) {
            codeMirror.setTheme("ace/theme/"+theme);
        }
    },

    render: function(c) {
        $("#add-folder-header").html("Add folder inside " + c.get("name"));
        $("#add-folder-parent-id").val(c.get("id"));
        $('#modal-add-folder').modal('show');
    },

    initializeEditor: function() {
        if (this.editor) {
            return;
        }

        this.editor = ace.edit(document.getElementById("add-folder-description"));

        pm.addFolderEditor = this.editor;
        var theme = (pm.settings.getSetting("postmanTheme")==="light")?"clouds":"monokai";
        this.editor.setTheme("ace/theme/"+theme);
        this.editor.getSession().setMode('ace/mode/markdown');
    }
});

var CollectionSidebar = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        model.on("add", this.renderOneCollection, this);
        model.on("remove", this.removeOneCollection, this);

        model.on("updateCollection", this.renderOneCollection, this);
        model.on("updateCollectionMeta", this.updateCollectionMeta, this);

        model.on("addCollectionRequest", this.addCollectionRequest, this);
        model.on("selectedCollectionRequest", this.selectedCollectionRequest, this);
        model.on("removeCollectionRequest", this.removeCollectionRequest, this);
        model.on("updateCollectionRequest", this.updateCollectionRequest, this);
        model.on("moveRequestToCollection", this.onMoveRequestToCollection, this);
        model.on("moveRequestToFolder", this.onMoveRequestToFolder, this);

        model.on("duplicateCollection", this.duplicateCollection, this);
        model.on("duplicateCollectionRequest", this.duplicateCollectionRequest, this);
        model.on("duplicateFolder", this.duplicateFolder, this);

        model.on("addFolder", this.onAddFolder, this);
        model.on("updateFolder", this.onUpdateFolder, this);
        model.on("deleteFolder", this.onDeleteFolder, this);

        model.on("filter", this.onFilter, this);
        model.on("revertFilter", this.onRevertFilter, this);

        $('#collection-items').html("");
        $('#collection-items').append(Handlebars.templates.message_no_collection({}));

        var $collection_items = $('#collection-items');

        $collection_items.on("mouseover", ".sidebar-collection .sidebar-collection-head", function () {
	        jQuery(".folder-head-actions,.collection-head-actions,.request-actions").hide();
            var actionsEl = jQuery('.collection-head-actions', this);
            actionsEl.css('display', 'block');
        });

        $collection_items.on("mouseleave", ".sidebar-collection .sidebar-collection-head", function () {
            var actionsEl = jQuery('.collection-head-actions', this);
            actionsEl.css('display', 'none');
        });

	    //$collection_items.on("mouseover", ".collection-head-actions>.tooltip", function () {
		 //   var actionsEl = jQuery(this);
	    //});


        $collection_items.on("mouseover", ".folder .folder-head", function () {
	        jQuery(".folder-head-actions,.collection-head-actions,.request-actions").hide();
            var actionsEl = jQuery('.folder-head-actions', this);
            actionsEl.css('display', 'block');
        });

        $collection_items.on("mouseleave", ".folder .folder-head", function () {
            var actionsEl = jQuery('.folder-head-actions', this);
            actionsEl.css('display', 'none');
        });

	    //$collection_items.on("mouseenter", ".folder-head-actions>.tooltip", function () {
		 //   var actionsEl = jQuery(this);
	    //});

        $collection_items.on("click", ".sidebar-collection-head-name", function () {
            var id = $(this).attr('data-id');
            view.toggleRequestList(id);
        });

        $collection_items.on("click", ".folder-head-name", function () {
            var id = $(this).attr('data-id');
            view.toggleSubRequestList(id);
        });

        $collection_items.on("click", ".collection-action-duplicate", function () {
            var id = $(this).attr('data-id');
            var c = model.get(id);
            model.trigger("duplicateCollection", c);
        });

        $collection_items.on("click", ".collection-head-actions .label", function () {
            var id = $(this).parent().parent().parent().attr('data-id');
            view.toggleRequestList(id);
        });

        $collection_items.on("click", ".collection-actions-add-folder", function () {
            var id = $(this).attr('data-id');
            var c = model.get(id);
            model.trigger("showAddFolderModal", c);
        });

        $collection_items.on("click", ".collection-actions-edit", function () {
            var id = $(this).attr('data-id');
            var c = model.get(id);
            model.trigger("showEditModal", c);
        });

        $collection_items.on("click", ".collection-actions-delete", function () {
            var id = $(this).attr('data-id');
            var name = $(this).attr('data-name');

            $('#modal-delete-collection-yes').attr('data-id', id);
            $('#modal-delete-collection-name').html(name);
        });

        $collection_items.on("click", ".folder-actions-edit", function () {
            var id = $(this).attr('data-id');
            var folder = model.getFolderById(id);
            model.trigger("showEditFolderModal", folder);
        });

        $collection_items.on("click", ".folder-actions-delete", function () {
            var id = $(this).attr('data-id');
            var name = $(this).attr('data-name');

            $('#modal-delete-folder-yes').attr('data-id', id);
            $('#modal-delete-folder-name').html(name);
        });

        $collection_items.on("click", ".collection-actions-download", function () {
            var id = $(this).attr('data-id');
            model.trigger("shareCollectionModal", id);
        });

        $('#collection-items').on("mouseover", ".sidebar-request", function () {
	        jQuery(".folder-head-actions,.collection-head-actions,.request-actions").hide();
            var actionsEl = jQuery('.request-actions', this);
            actionsEl.css('display', 'block');
        });

        $('#collection-items').on("mouseleave", ".sidebar-request", function () {
            var actionsEl = jQuery('.request-actions', this);
            actionsEl.css('display', 'none');
        });

        $('#collection-items').on("mouseenter", ".sidebar-collection-request",function() {
            $(this).toggleClass('hover');
        });

        $('#collection-items').on("mouseleave", ".sidebar-collection-request",function() {
            $(this).toggleClass('hover');
        });


        $collection_items.on("click", ".request-actions-load", function () {
            var id = $(this).attr('data-id');
            model.loadCollectionRequest(id);
            $('.sidebar-history-request').removeClass('sidebar-history-request-active');
        });

        $collection_items.on("click", ".request-actions-delete", function () {
            var id = $(this).attr('data-id');
            var request = model.getRequestById(id);            
            model.trigger("deleteCollectionRequest", request);
        });

        $collection_items.on("click", ".request-actions-edit", function () {
            var id = $(this).attr('data-id');
            var request = model.getRequestById(id);

            model.trigger("editCollectionRequest", request);
        });

        $collection_items.on("click", ".request-actions-duplicate", function () {
            var id = $(this).attr('data-id');
            var request = model.getRequestById(id);
            model.trigger("duplicateCollectionRequest", request);
        });

        $collection_items.on("click", ".folder-actions-duplicate", function () {
            var id = $(this).attr('data-id');
            var request = model.getFolderById(id);
            model.trigger("duplicateFolder", request);
        });
    },

    _updateSidebar: function() {
        $("#sidebar-section-collections a[rel='tooltip']").tooltip();
    },

    duplicateCollectionRequest: function(oldRequest) {
        if(!oldRequest) {
            return;
        }
        var collection = this.model.getCollectionById(oldRequest.collectionId);
        if(!collection) {
            return;
        }
        var oldId = oldRequest.id;

        var newRequest = _.clone(oldRequest);
        newRequest.name = oldRequest.name + " copy";
        newRequest.id = guid();

        var orderRequests = collection.get("order");
        var folders = collection.get("folders");

        if(orderRequests.indexOf(oldId)>=0) {
            this.model.addRequestToCollection(newRequest,collection, true);
            return;
        }
        else {
            var sidebar = this;
            _.each(folders,function(folder) {
                if(folder.order.indexOf(oldId)>=0) {
                    sidebar.model.addRequestToFolder(newRequest, collection.id, folder.id, true);
                    return;
                }
            });
        }
    },

    duplicateFolder: function(oldFolder) {
        var collection = this.model.getCollectionById(oldFolder.collection_id);
        if(!collection) {
            //error condition
            return;
        }

        var newFolder = this.cloneFolder(oldFolder);
        newFolder.name = oldFolder.name + " copy";

        this.model.addExistingFolder(collection.id, newFolder);

        //clone and add all requests of the folder
        var sidebar = this;
        _.each(oldFolder.order,function(requestId) {
            var oldRequest = sidebar.model.getRequestById(requestId);
            var newRequest = _.clone(oldRequest);
            newRequest.folderId=newFolder.id;
            newRequest.id = guid();
            sidebar.model.addRequestToFolder(newRequest,collection.id, newFolder.id, true);
        });
    },

    duplicateCollection: function(collection) {
        if(!collection) {
            return;
        }
        var newCollection = {};
        newCollection.id = guid();
        newCollection.name = collection.get("name") + " copy";
        newCollection.description = collection.get("description");
        newCollection.order = [];
        newCollection.timestamp = new Date().getTime();
        var sidebar = this;
        this.model.addCollectionToDataStore(newCollection,true, function() {
            var newCollection1 = sidebar.model.getCollectionById(newCollection.id);

            //Add all the folders
            var folderIdMap = {};
            _.each(collection.get("folders"),function(folder) {
                var newFolder = sidebar.cloneFolder(folder);
                folderIdMap[folder.id] = newFolder.id;
                sidebar.model.addExistingFolder(newCollection1.id, newFolder);
            });

            //Add add all requests
            var orderRequests = collection.get("order");
            var folders = collection.get("folders");
            var collectionRequests = collection.get("requests");

            //add root collection requests (those not in folders)
            _.each(orderRequests, function(requestId) {
                //find request with Id=requestId
                var thisRequest = _.find(collectionRequests, function(request){
                    return request.id==requestId
                });
                var newRequest = _.clone(thisRequest);
                newRequest.id = guid();
                newRequest.collectionId = newCollection1.id;
                sidebar.model.addRequestToCollection(newRequest,newCollection1, true);
            });

            //add requests in folders
            _.each(folders, function(folder) {
                _.each(folder.order, function(requestId) {
                    var thisRequest = _.find(collectionRequests, function(request){
                        return request.id==requestId
                    });
                    var newRequest = _.clone(thisRequest);
                    newRequest.id = guid();
                    newRequest.collectionId = newCollection1.id;
                    sidebar.model.addRequestToFolder(newRequest, newCollection1.id, folderIdMap[folder.id], true);
                });
            });

        });


    },

    cloneFolder: function(oldFolder) {
        var newFolder = _.clone(oldFolder);
        newFolder.id = guid();
        newFolder.order = [];
        return newFolder;
    },

    selectedCollectionRequest: function(request) {
        var id = request.id;
        $('.sidebar-collection-request').removeClass('sidebar-collection-request-active');
        $('#sidebar-request-' + id).addClass('sidebar-collection-request-active');
    },

    addRequestListeners:function () {
        $('#sidebar-sections').on("mouseenter", ".sidebar-request", function () {
            var actionsEl = jQuery('.request-actions', this);
            actionsEl.css('display', 'block');
        });

        $('#sidebar-sections').on("mouseleave", ".sidebar-request", function () {
            var actionsEl = jQuery('.request-actions', this);
            actionsEl.css('display', 'none');
        });
    },

    emptyCollectionInSidebar:function (id) {
        $('#collection-requests-' + id).html("");
    },

    removeOneCollection:function (model, pmCollection) {
        var collection = model.toJSON();
        $('#collection-' + collection.id).remove();

        if(pmCollection.length === 0) {
            $('#sidebar-section-collections .empty-message').css("display", "block");
        }
    },

    organizeRequestsInFolders: function(collection) {
        if(!("folders" in collection)) {
            return collection;
        }

        if(!("requests" in collection)) {
            return collection;
        }

        var folders = _.clone(collection["folders"]);
        var requests = _.clone(collection["requests"]);

        var folderCount = folders.length;
        var folder;
        var folderOrder;
        var id;
        var existsInOrder;
        var folderRequests;

        var newFolders = [];

        for(var i = 0; i < folderCount; i++) {
            folder = _.clone(folders[i]);
            folderOrder = folder.order;
            folderRequests = [];

            for(var j = 0; j < folderOrder.length; j++) {
                id = folderOrder[j];

                var index = arrayObjectIndexOf(requests, id, "id");

                if(index >= 0) {
                    folderRequests.push(requests[index]);
                    requests.splice(index, 1);
                }
            }

            folder["requests"] = this.orderRequests(folderRequests, folderOrder);
            newFolders.push(folder);
        }

        collection.folders = newFolders;
        collection.requests = requests;

        collection.requests = this.orderRequests(collection.requests, collection.order);

        return collection;
    },

    orderRequests: function(inRequests, order) {
        var requests = _.clone(inRequests);

        function requestFinder(request) {
            return request.id === order[j];
        }

        if (order.length === 0) {
            requests.sort(sortAlphabetical);
        }
        else {
            var orderedRequests = [];
            for (var j = 0, len = order.length; j < len; j++) {
                var element = _.find(requests, requestFinder);
                if(element) {
                    orderedRequests.push(element);
                }
            }

            requests = orderedRequests;
        }

        return requests;
    },

    renderOneCollection:function (model, pmCollection) {
        var folders = [];
        var wasOpen = false;
        var collection = _.clone(model.toJSON());

        collection = this.organizeRequestsInFolders(collection);

        $('#sidebar-section-collections .empty-message').css("display", "none");

        var currentEl = $("#collection-" + collection.id + " .sidebar-collection-head-dt");
        if (currentEl.length) {
            var currentClass = currentEl.attr("class");
            wasOpen = currentClass.search("open") >= 0;
        }

        this.renderCollectionContainerInSidebar(collection);
        this.renderFoldersInSidebar(collection);

        var requests = collection.requests;
        var targetElement = "#collection-requests-" + collection.id;

        this.renderRequestsInSidebar(targetElement, requests);

        if (wasOpen) {
            this.openCollection(collection.id, false);
        }
    },

    renderCollectionContainerInSidebar: function(collection) {
        var currentEl = $('#collection-' + collection.id);

        var collectionSidebarListPosition = -1;
        var insertionType;
        var insertTarget;

        var model = this.model;
        var view = this;
        var collections = this.model.toJSON();

        collectionSidebarListPosition = arrayObjectIndexOf(collections, collection.id, "id");

        if (currentEl.length) {
            if (collectionSidebarListPosition === 0) {
                if(collections[collectionSidebarListPosition + 1]) {
                    insertionType = "before";
                    insertTarget = $('#collection-' + collections[collectionSidebarListPosition + 1].id);
                }
                else {
                    insertionType = "none";
                }
            }
            else {
                insertionType = "after";
                insertTarget = $('#collection-' + collections[collectionSidebarListPosition - 1].id);
            }

            currentEl.remove();
        }
        else {
            //New element
            if (collectionSidebarListPosition === collections.length - 1) {
                insertionType = "append";
            }
            else {
                var nextCollectionId = collections[collectionSidebarListPosition + 1].id;
                insertTarget = $("#collection-" + nextCollectionId);

                if (insertTarget.length > 0) {
                    insertionType = "before";
                }
                else {
                    insertionType = "append";
                }
            }
        }

        if (insertionType) {
            if (insertionType === "after") {
                $(insertTarget).after(Handlebars.templates.item_collection_sidebar_head(collection));
            }
            else if (insertionType === "before") {
                $(insertTarget).before(Handlebars.templates.item_collection_sidebar_head(collection));
            }
            else {
                $("#collection-items").append(Handlebars.templates.item_collection_sidebar_head(collection));
            }
        } else {
            $("#collection-items").append(Handlebars.templates.item_collection_sidebar_head(collection));
        }

        // TODO Need a better way to initialize these tooltips
        setTimeout(function() {
            $('a[rel="tooltip"]').tooltip();
        },500);

        $('#collection-' + collection.id + " .sidebar-collection-head").droppable({
            accept: ".sidebar-collection-request",
            hoverClass: "ui-state-hover",
            drop: _.bind(this.handleRequestDropOnCollection, this)
        });
    },

    renderFoldersInSidebar: function(collection) {
        var folders;
        var targetElement;
        var folderContainer;
        var i;

        if("folders" in collection) {
            folders = collection["folders"];
            folders.sort(sortAlphabetical);

            folderContainer = "#folders-" + collection.id;
            $(folderContainer).append(Handlebars.templates.collection_sidebar_folders({"folders": folders}));

            $('#collection-' + collection.id + " .folder-head").droppable({
                accept: ".sidebar-collection-request",
                hoverClass: "ui-state-hover",
                drop: _.bind(this.handleRequestDropOnFolder, this)
            });

            for(i = 0; i < folders.length; i++) {
                targetElement = "#folder-requests-" + folders[i].id;
                this.renderRequestsInSidebar(targetElement, folders[i].requests);
            }
        }
    },

    renderRequestsInSidebar: function(targetElement, requests) {
        if (!requests) return;

        var view = this;

        var count = requests.length;
        var requestTargetElement;

        if (count > 0) {
            for (var i = 0; i < count; i++) {
                if (typeof requests[i].name === "undefined") {
                    requests[i].name = requests[i].url;
                }
                //requests[i].name = limitStringLineWidth(requests[i].name, 40);
                requestTargetElement = "#sidebar-request-" + requests[i].id;
                $(requestTargetElement).draggable({});
            }

            $(targetElement).html("");

            $(targetElement).append(Handlebars.templates.collection_sidebar_requests({"items":requests}));
            $(targetElement).sortable({
                delay: 150,
                update: _.bind(view.onUpdateSortableCollectionRequestList, view)
            });
        }
    },

    onUpdateSortableCollectionRequestList: function(event, ui) {
        //hack to prevent sortable and droppable being called immediately
        if(pm.requestTransferInProgress) {
           return;
        }

        var pmCollection = this.model;

        var isInFolder = $(event.target).attr("class").search("folder-requests") >= 0;

        if(isInFolder) {
            var folder_id = $(event.target).attr("data-id");
            var target_parent = $(event.target).parent(".folder-requests");
            var target_parent_collection = $(event.target).parents(".sidebar-collection");
            var collection_id = $(target_parent_collection).attr("data-id");
            var ul_id = $(target_parent.context).attr("id");
            var collection_requests = $(target_parent.context).children("li");
            var count = collection_requests.length;
            var order = [];

            for (var i = 0; i < count; i++) {
                var li_id = $(collection_requests[i]).attr("id");
                var request_id = $("#" + li_id + " .request").attr("data-id");
                order.push(request_id);
            }

            pmCollection.updateFolderOrder(collection_id, folder_id, order);
        }
        else {
            var target_parent = $(event.target).parents(".sidebar-collection-requests");
            var target_parent_collection = $(event.target).parents(".sidebar-collection");
            var collection_id = $(target_parent_collection).attr("data-id");
            var ul_id = $(target_parent.context).attr("id");
            var collection_requests = $(target_parent.context).children("li");
            var count = collection_requests.length;
            var order = [];

            for (var i = 0; i < count; i++) {
                var li_id = $(collection_requests[i]).attr("id");
                var request_id = $("#" + li_id + " .request").attr("data-id");
                order.push(request_id);
            }

            pmCollection.updateCollectionOrder(collection_id, order);
        }
        this._updateSidebar();
    },

    updateCollectionMeta: function(collection) {
        var id = collection.get("id");

        var currentClass = $("#collection-" + id + " .sidebar-collection-head-dt").attr("class");
        var collectionHeadHtml = '<span class="sidebar-collection-head-dt"><img src="img/dt.png"/></span>';
        collectionHeadHtml += " " + collection.get("name");

        $('#collection-' + collection.id + " .sidebar-collection-head-name").html(collectionHeadHtml);
        $('#select-collection option[value="' + collection.get("id") + '"]').html(collection.get("name"));

        if(currentClass.indexOf("open") >= 0) {
            $("#collection-" + id + " .sidebar-collection-head-dt").addClass("disclosure-triangle-open");
        }
        else {
            $("#collection-" + id + " .sidebar-collection-head-dt").addClass("disclosure-triangle-close");
        }
    },

    onAddFolder: function(collection, folder) {
        var folderContainer = "#folders-" + collection.id;
        $(folderContainer).append(Handlebars.templates.item_collection_folder(folder));

        $('#collection-' + collection.id + " .folder-head").droppable({
            accept: ".sidebar-collection-request",
            hoverClass: "ui-state-hover",
            drop: _.bind(this.handleRequestDropOnFolder, this)
        });
        this._updateSidebar();
    },

    onUpdateFolder: function(collection, folder) {
        $("#folder-" + folder.id + " .folder-head-name .name").html(folder.name);
    },

    onDeleteFolder: function(collection, id) {
        $("#folder-" + id).remove();
    },

    onMoveRequestToFolder: function(targetCollection, folder, request) {
        this.removeCollectionRequest(request.id);
        var targetElement = $("#folder-requests-" + folder.id);
        this.addRequestToFolder(folder, request);
        this._updateSidebar();
    },

    onMoveRequestToCollection: function(targetCollection, request) {
        this.removeCollectionRequest(request.id);

        var targetElement = "#collection-requests-" + request.collectionId;
        this.addRequestToList(targetElement, request);
        this._updateSidebar();
    },

    addRequestToList: function(targetElement, request) {
        var view = this;

        $('#sidebar-request-' + request.id).draggable({});

        if (typeof request.name === "undefined") {
            request.name = request.url;
        }

        //request.name = limitStringLineWidth(request.name, 43);

        $(targetElement).append(Handlebars.templates.item_collection_sidebar_request(request));

        request.isFromCollection = true;
        request.collectionRequestId = request.id;

        $(targetElement).sortable({
            delay: 150,
            update: _.bind(view.onUpdateSortableCollectionRequestList, view)
        });

        $('#collection-' + request.collectionId + " .sidebar-collection-head").droppable({
            accept: ".sidebar-collection-request",
            hoverClass: "ui-state-hover",
            drop: _.bind(this.handleRequestDropOnCollection, this)
        });
    },

    addRequestToFolder: function(folder, request) {
        var targetElement = "#folder-requests-" + folder.id;
        this.addRequestToList(targetElement, request);
    },

    addCollectionRequest: function(request) {
        var targetElement = "#collection-requests-" + request.collectionId;

        $('.sidebar-collection-request').removeClass('sidebar-collection-request-active');
        $('#sidebar-request-' + request.id).addClass('sidebar-collection-request-active');

        this.addRequestToList(targetElement, request);
        this.openCollection(request.collectionId);
        pm.mediator.trigger("loadRequest", request);
    },

    removeCollectionRequest: function(id) {
        $('#sidebar-request-' + id).remove();
    },

    updateCollectionRequest: function(request, noNotif) {
        if(typeof(noNotif)==='undefined') noNotif = false;

        var requestName;
        //requestName = limitStringLineWidth(request.name, 43);
        requestName = request.name;
        $('#sidebar-request-' + request.id + " .request .request-name").html(requestName);
        $('#sidebar-request-' + request.id + " .request .label").html(request.method);
            
        var labelClasses = ['GET', 'PUT', 'POST', 'DELETE'];

        for(var i = 0; i < labelClasses.length; i++) {
            $('#sidebar-request-' + request.id + " .request .label").removeClass('label-method-' + labelClasses[i]);    
        }        

        $('#sidebar-request-' + request.id + " .request .label").addClass('label-method-' + request.method);

        if(!noNotif) {
            noty({
            type:'success',
            text:'Saved request',
            layout:'topCenter',
            timeout:750
            });
        }
    },

    openCollection:function (id, toAnimate) {
        var target = "#collection-children-" + id;
        $("#collection-" + id + " .sidebar-collection-head-dt").removeClass("disclosure-triangle-close");
        $("#collection-" + id + " .sidebar-collection-head-dt").addClass("disclosure-triangle-open");

        if ($(target).css("display") === "none") {
            if(toAnimate === false) {
                $(target).css("display", "block");
            }
            else {
                $(target).slideDown(100, function () {
                });
            }
        }
    },

    toggleRequestList:function (id) {
        var target = "#collection-children-" + id;
        if ($(target).css("display") === "none") {
            $("#collection-" + id + " .sidebar-collection-head-dt").removeClass("disclosure-triangle-close");
            $("#collection-" + id + " .sidebar-collection-head-dt").addClass("disclosure-triangle-open");

            $(target).slideDown(100, function () {
            });
        }
        else {
            $("#collection-" + id + " .sidebar-collection-head-dt").removeClass("disclosure-triangle-open");
            $("#collection-" + id + " .sidebar-collection-head-dt").addClass("disclosure-triangle-close");
            $(target).slideUp(100, function () {
            });
        }
    },

    toggleSubRequestList: function(id) {
        var target = "#folder-requests-" + id;

        if ($(target).css("display") === "none") {
            $("#folder-" + id + " .folder-head-dt").removeClass("disclosure-triangle-close");
            $("#folder-" + id + " .folder-head-dt").addClass("disclosure-triangle-open");

            $(target).slideDown(100, function () {
            });
        }
        else {
            $("#folder-" + id + " .folder-head-dt").removeClass("disclosure-triangle-open");
            $("#folder-" + id + " .folder-head-dt").addClass("disclosure-triangle-close");
            $(target).slideUp(100, function () {
            });
        }
    },

    handleRequestDropOnCollection: function(event, ui) {
        var id = ui.draggable.context.id;
        var requestId = $('#' + id + ' .request').attr("data-id");
        var targetCollectionId = $($(event.target).find('.sidebar-collection-head-name')[0]).attr('data-id');
        this.model.moveRequestToCollection(requestId, targetCollectionId);
    },

    handleRequestDropOnFolder: function(event, ui) {
        var id = ui.draggable.context.id;
        var requestId = $('#' + id + ' .request').attr("data-id");
        var targetFolderId = $($(event.target).find('.folder-head-name')[0]).attr('data-id');        
        this.model.moveRequestToFolder(requestId, targetFolderId);
    },

    onFilter: function(filteredCollectionItems) {
        var collectionsCount = filteredCollectionItems.length;        

        for(var i = 0; i < collectionsCount; i++) {
            var c = filteredCollectionItems[i];
            var collectionDomId = "#collection-" + c.id;
            var collectionFoldersDomId = "#folders-" + c.id;
            var collectionChildrenDomId = "#collection-children-" + c.id;
            var dtDomId = "#collection-" + c.id + " .sidebar-collection-head-dt";

            if(c.toShow) {
                $(collectionDomId).css("display", "block");
                $(collectionChildrenDomId).css("display", "block");

                $(dtDomId).removeClass("disclosure-triangle-close");
                $(dtDomId).addClass("disclosure-triangle-open");

                var requests = c.requests;

                if(requests) {
                    var requestsCount = requests.length;
                    for(var j = 0; j < requestsCount; j++) {
                        var r = requests[j];
                        var requestDomId = "#sidebar-request-" + r.id;
                        if(r.toShow) {
                            $(requestDomId).css("display", "block");
                        }
                        else {
                            $(requestDomId).css("display", "none");
                        }
                    }
                }

                if("folders" in c) {
                    var folders = c["folders"];
                    for(var k = 0; k < folders.length; k++) {
                        var folderDomId = "#folder-" + folders[k].id;
                        var folderRequestsDomId = folderDomId + " .folder-requests";
                        var dtFolderDomId = folderDomId + " .folder-head .folder-head-dt";

                        if(folders[k].toShow) {
                            $(folderDomId).css("display", "block");
                            $(folderRequestsDomId).css("display", "block");
                            $(dtFolderDomId).removeClass("disclosure-triangle-close");
                            $(dtFolderDomId).addClass("disclosure-triangle-open");
                        }
                        else {
                            $(folderDomId).css("display", "none");
                            $(folderRequestsDomId).css("display", "none");
                            $(dtFolderDomId).addClass("disclosure-triangle-close");
                            $(dtFolderDomId).removeClass("disclosure-triangle-open");
                        }
                    }
                }
            }
            else {
                $(collectionDomId).css("display", "none");
                $(collectionChildrenDomId).css("display", "none");
                $(dtDomId).removeClass("disclosure-triangle-open");
                $(dtDomId).addClass("disclosure-triangle-close");
            }
        }
    },

    onRevertFilter: function() {
        $(".sidebar-collection").css("display", "block");
        $(".folder").css("display", "block");
        $(".sidebar-collection-request").css("display", "block");
    }
});
var DeleteCollectionModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;

        $('#modal-delete-collection-yes').on("click", function () {
            var id = $(this).attr('data-id');
            model.deleteCollection(id);
        });

        $("#modal-delete-collection").on("shown", function () {
            pm.app.trigger("modalOpen", "#modal-delete-collection");
        });

        $("#modal-delete-collection").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        $("#modal-delete-collection").on('keydown', function (event) {
            if (event.keyCode === 13) {
                var id=$("#modal-delete-collection-yes").attr('data-id');
                model.deleteCollection(id);
                $("#modal-delete-collection").modal('hide');
                event.preventDefault();
                return false;
            }
        });
    },

    render: function() {

    }
});

var DeleteCollectionRequestModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;

        model.on("deleteCollectionRequest", this.render, this);

        $('#modal-delete-collection-request-yes').on("click", function () {
            var id = $(this).attr('data-id');
            model.deleteCollectionRequest(id);
        });

        $("#modal-delete-collection-request").on('keydown', function (event) {
            if (event.keyCode === 13) {
                var id=$("#modal-delete-collection-request-yes").attr('data-id');
                model.deleteCollectionRequest(id);
                $("#modal-delete-collection-request").modal('hide');
                event.preventDefault();
                return false;
            }
        });
    },

    render: function(request) {
        $('#modal-delete-collection-request-yes').attr('data-id', request.id);
        $('#modal-delete-collection-request-name').html(request.name);
        $('#modal-delete-collection-request').modal('show');
    }
});

var DeleteFolderModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;

        $('#modal-delete-folder-yes').on("click", function () {
            var id = $(this).attr('data-id');
            model.deleteFolder(id, true);
        });

        $("#modal-delete-folder").on("shown", function () {
            pm.app.trigger("modalOpen", "#modal-delete-folder");
        });

        $("#modal-delete-folder").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        $("#modal-delete-folder").on('keydown', function (event) {
            if (event.keyCode === 13) {
                var id=$("#modal-delete-folder-yes").attr('data-id');
                model.deleteFolder(id, true);
                $("#modal-delete-folder").modal('hide');
                event.preventDefault();
                return false;
            }
        });
    },

    render: function() {

    }
});

var EditCollectionModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        pm.mediator.on("switchCodeMirrorTheme", this.onSwitchCodeMirrorTheme, this);

        model.on("showEditModal", this.render, this);

        $('#form-edit-collection').submit(function() {
            var id = $('#form-edit-collection .collection-id').val();
            var name = $('#form-edit-collection .collection-name').val();
            var description = view.editor.getValue();
            model.updateCollectionMeta(id, name, description);
            $('#modal-edit-collection').modal('hide');
            return false;
        });

        $('#modal-edit-collection .btn-primary').click(function () {
            var id = $('#form-edit-collection .collection-id').val();
            var name = $('#form-edit-collection .collection-name').val();
            var description = view.editor.getValue();
            model.updateCollectionMeta(id, name, description);
            $('#modal-edit-collection').modal('hide');
        });

        $("#modal-edit-collection").on("shown", function () {
            $("#modal-edit-collection .collection-name").focus();
            pm.app.trigger("modalOpen", "#modal-edit-collection");
        });

        $("#modal-edit-collection").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        $("#modal-edit-collection").on('keydown', 'div.input', function (event) {
            if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
                $('#form-edit-collection').submit();
                event.preventDefault();
                return false;
            }

            return true;
        });
    },

    onSwitchCodeMirrorTheme: function(theme) {
        var codeMirror = pm.editCollectionEditor;

        if (codeMirror) {
            codeMirror.setTheme("ace/theme/"+theme);
        }
    },


    initializeEditor: function() {
        if (this.editor) {
            return;
        }

        this.editor = ace.edit(document.getElementById("edit-collection-description"));

        var theme = (pm.settings.getSetting("postmanTheme")==="light")?"clouds":"monokai";
        this.editor.setTheme("ace/theme/"+theme);
        this.editor.getSession().setMode('ace/mode/markdown');
        pm.editCollectionEditor = this.editor;
    },

    render: function(c) {
        var collection = c.toJSON();

        $('#form-edit-collection .collection-id').val(collection.id);
        $('#form-edit-collection .collection-name').val(collection.name);

        $('#modal-edit-collection').modal('show');

        if (!this.editor) {
            this.initializeEditor();
        }

        var view = this;

        setTimeout(function() {
            view.editor.setValue(collection.description, -1);
            view.editor.gotoLine(0,0,false);
        }, 100);
    }
});
var EditCollectionRequestModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;

        model.on("editCollectionRequest", this.render, this);

        var view = this;

        pm.mediator.on("switchCodeMirrorTheme", this.onSwitchCodeMirrorTheme, this);

        $('#form-edit-collection-request').submit(function() {
            var id = $('#form-edit-collection-request .collection-request-id').val();
            var name = $('#form-edit-collection-request .collection-request-name').val();
            var description = view.editor.getValue();
            model.updateCollectionRequestMeta(id, name, description);
            return false;
        });

        $('#modal-edit-collection-request .btn-primary').click(function () {
            var id = $('#form-edit-collection-request .collection-request-id').val();
            var name = $('#form-edit-collection-request .collection-request-name').val();
            var description = view.editor.getValue();
            // console.log("Update with", description);
            model.updateCollectionRequestMeta(id, name, description);
            $('#modal-edit-collection-request').modal('hide');
        });

        $("#modal-edit-collection-request").on('keydown', 'div.input', function (event) {
            if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
                $('#form-edit-collection-request').submit();
                event.preventDefault();
                return false;
            }
            return true;
        });

        $("#modal-edit-collection-request").on("shown", function () {
            $("#modal-edit-collection-request .collection-request-name").focus();
            pm.app.trigger("modalOpen", "#modal-edit-collection-request");
        });

        $("#modal-edit-collection-request").on("hidden", function () {
            pm.app.trigger("modalClose");
        });
    },

    onSwitchCodeMirrorTheme: function(theme) {
        var codeMirror = pm.editCollectionRequestEditor;

        if (codeMirror) {
            codeMirror.setTheme("ace/theme/"+theme);
        }
    },

    initializeEditor: function() {
        if (this.editor) {
            return;
        }

        this.editor = ace.edit(document.getElementById("collection-request-description"));

        var theme = (pm.settings.getSetting("postmanTheme")==="light")?"clouds":"monokai";
        this.editor.setTheme("ace/theme/"+theme);
        this.editor.getSession().setMode('ace/mode/markdown');
        pm.editCollectionRequestEditor = this.editor;
    },

    render: function(request) {
        $('#form-edit-collection-request .collection-request-id').val(request.id);
        $('#form-edit-collection-request .collection-request-name').val(request.name);
        $('#modal-edit-collection-request').modal('show');

        if (!this.editor) {
            this.initializeEditor();
        }

        var view = this;

        setTimeout(function() {
            view.editor.setValue(request.description, -1);

            view.editor.gotoLine(0,0,false);
        }, 150);

    }
});

var EditFolderModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        model.on("showEditFolderModal", this.render, this);

        pm.mediator.on("switchCodeMirrorTheme", this.onSwitchCodeMirrorTheme, this);

        $('#form-edit-folder').submit(function() {
            var id = $('#form-edit-folder .folder-id').val();
            var name = $('#form-edit-folder .folder-name').val();
            var description = view.editor.getValue();
            model.updateFolderMeta(id, name, description);
            $('#modal-edit-folder').modal('hide');
            return false;
        });

        $('#modal-edit-folder .btn-primary').click(function () {
            var id = $('#form-edit-folder .folder-id').val();
            var name = $('#form-edit-folder .folder-name').val();
            var description = view.editor.getValue();
            model.updateFolderMeta(id, name, description);
            $('#modal-edit-folder').modal('hide');
        });

        $("#modal-edit-folder").on("shown", function () {
            $("#modal-edit-folder .folder-name").focus();
            pm.app.trigger("modalOpen", "#modal-edit-folder");
        });

        $("#modal-edit-folder").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        $("#modal-edit-folder").on('keydown', 'div.input', function (event) {
            if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
                $('#form-edit-folder').submit();
                event.preventDefault();
                return false;
            }

            return true;
        });
    },

    onSwitchCodeMirrorTheme: function(theme) {
        var codeMirror = pm.editFolderEditor;

        if (codeMirror) {
            codeMirror.setTheme("ace/theme/"+theme);
        }
    },

    initializeEditor: function() {
        if (this.editor) {
            return;
        }

        this.editor = ace.edit(document.getElementById("edit-folder-description"));

        var theme = (pm.settings.getSetting("postmanTheme")==="light")?"clouds":"monokai";
        this.editor.setTheme("ace/theme/"+theme);
        this.editor.getSession().setMode('ace/mode/markdown');
        pm.editFolderEditor = this.editor;
    },

    render: function(folder) {
        // console.log("Render edit folder");

        $('#form-edit-folder .folder-id').val(folder.id);
        $('#form-edit-folder .folder-name').val(folder.name);

        $('#modal-edit-folder').modal('show');

        if (!this.editor) {
            this.initializeEditor();
        }

        var view = this;

        setTimeout(function() {
            view.editor.setValue(folder.description, -1);
            view.editor.gotoLine(0,0,false);
        }, 100);
    }
});

var ImportModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;

        model.on("importCollection", this.addAlert, this);
        pm.mediator.on("failedCollectionImport", this.onFailedImport, this);

        $('#import-submit-link').on("click", function () {
            var url = $('#importLink').val();
            model.importFileFromUrl(url);
            $('#import-submit-link').html("Importing...").attr('disabled','disabled');
        });

        var dropZone = document.getElementById('import-collection-dropzone');
        dropZone.addEventListener('dragover', function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        }, false);

        dropZone.addEventListener('drop', function (evt) {
            evt.stopPropagation();
            evt.preventDefault();
            var files = evt.dataTransfer.files; // FileList object.

            model.importFiles(files);
        }, false);

        $('#collection-files-input').on('change', function (event) {
            var files = event.target.files;
            model.importFiles(files);
            $('#collection-files-input').val("");
        });

        $("#modal-importer").on("shown", function () {
            pm.app.trigger("modalOpen", "#modal-importer");
        });

        $("#modal-importer").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        $('#import-submit-rawtext').on("click", function () {
            var rawText = $('#importRawText').val();
            var fileFormat = pm.collections.guessFileFormat(rawText);
            if(fileFormat===0) {
                pm.mediator.trigger("failedCollectionImport", "format not recognized");
                return;
            }
            pm.collections.importData(rawText, fileFormat);
        });

        pm.mediator.on("failedCollectionImport", function(reason) {
            if(reason) {
                reason = ": "+reason;
            }
            noty(
                {
                    type:'error',
                    text:'Failed to import data'+reason,
                    layout:'topCenter',
                    timeout:750
                });
        });

    },

    onFailedImport: function() {
        $('#import-submit-link').html("Import!").removeAttr('disabled');
    },

    addAlert: function(message) {
        $(".modal-import-alerts>.alert.alert-block").remove();
        $('#import-submit-link').html("Import!").removeAttr('disabled');
        if(message.type==="collection") {
            $('.modal-import-alerts').append(Handlebars.templates.message_collection_added(message));
        }
        else if(message.type==="request") {
            $('.modal-import-alerts').append(Handlebars.templates.message_request_added(message));
        }

    }
});
var OverwriteCollectionModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;

        model.on("overwriteCollectionChoice", this.render, this);

        $("#modal-overwrite-collection-duplicate").on("click", function() {
            var originalCollectionId = model.originalCollectionId;
            var toBeImportedCollection = model.toBeImportedCollection;
            toBeImportedCollection.id = guid();
            toBeImportedCollection.name = toBeImportedCollection.name + " copy";
            model.duplicateCollection(toBeImportedCollection);
        });

        $("#modal-overwrite-collection-overwrite").on("click", function() {
            var originalCollectionId = model.originalCollectionId;
            var toBeImportedCollection = model.toBeImportedCollection;
            model.overwriteCollection(toBeImportedCollection);
        });

    },

    render: function(collection) {
        var originalCollectionId = this.model.originalCollectionId;
        $("#existingCollectionName").html(this.model.getCollectionById(originalCollectionId).get("name"));
        $("#modal-overwrite-collection").modal("show");
    }
});

var ShareCollectionModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;

        if (pm.features.isFeatureEnabled(FEATURES.DIRECTORY)) {
            $("share-collection-directory-features").css("display", "block");
        }

        $('#share-collection-get-link').on("click", function () {
            var id = $(this).attr('data-collection-id');
            var isChecked = $("#share-collection-is-public").is(":checked");

            model.uploadCollection(id, isChecked, true, function (link) {
                $('#share-collection-link').css("display", "block");
                $('#share-collection-link').html(link);
                $('#copy-collection-url').show();
            });
        });

        $('#share-collection-download').on("click", function () {
            var id = $(this).attr('data-collection-id');
            model.saveCollection(id);
        });

        $("#modal-share-collection").on("shown", function () {
            pm.app.trigger("modalOpen", "#modal-share-collection");
        });

        $("#modal-share-collection").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        $("#copy-collection-url").click(function() {
            copyToClipboard($('#share-collection-link').html());
        });

        model.on("shareCollectionModal", this.show, this);
    },

    show: function(id) {
        var collection = this.model.get(id);

        $("#modal-share-collection").modal("show");

        $('#share-collection-get-link').attr("data-collection-id", id);
        $('#share-collection-download').attr("data-collection-id", id);
        $('#copy-collection-url').hide();
        $('#share-collection-link').css("display", "none");

        if (pm.user.isLoggedIn()) {
            if (collection.get("remote_id") !== 0) {
                $('#share-collection-directory-features').css("display", "none");
                $('#share-collection-get-link').html("Update");
                $('#share-collection-link').html(collection.get("remoteLink")).show();
                $('#copy-collection-url').show();
            }
            else {
                $('#share-collection-directory-features').css("display", "block");
                $('#share-collection-get-link').html("Upload");
                $('#share-collection-link').hide();
            }
        }
        else {
            $('#share-collection-directory-features').css("display", "none");
            $('#share-collection-get-link').html("Upload");
        }
    },

    render: function() {

    }
});

var DirectoryCollection = Backbone.Model.extend({
    defaults: function() {
        return {
            "id": "",
            "name": "",
            "user_id": 0,
            "user_name": "",
            "description": "",
            "order": [],
            "folders": [],
            "requests": [],
            "timestamp": 0,
            "updated_at": "",
            "updated_at_formatted": ""
        };
    }
});

var Directory = Backbone.Collection.extend({
    model: DirectoryCollection,

    startId: 0,
    endId: 0,
    fetchCount: 44,
    lastCount: 0,
    totalCount: 0,
    order: "descending",

    isInitialized: false,

    reload: function() {
        this.startId = 0;
        this.fetchCount = 44;
        this.lastCount = 0;
        this.totalCount = 0;
        this.getCollections(this.startId, this.fetchCount, "descending");
    },

    comparator: function(a, b) {
        var aName = a.get("timestamp");
        var bName = b.get("timestamp");

        return aName > bName;
    },

    initialize: function() {
    	pm.mediator.on("initializeDirectory", this.onInitializeDirectory, this);
        pm.mediator.on("getDirectoryCollection", this.onGetDirectoryCollection, this);
        pm.mediator.on("showNextDirectoryPage", this.onShowNextDirectoryPage, this);
        pm.mediator.on("showNextDirectoryPage", this.onShowNextDirectoryPage, this);
    },

    onInitializeDirectory: function() {
    	if (!this.isInitialized) {
    		this.isInitialized = true;
    	}

        this.getCollections(this.startId, this.fetchCount, "descending");
    },

    onGetDirectoryCollection: function(link_id) {
        this.downloadCollection(link_id);
    },

    loadNext: function() {
        this.getCollections(this.endId, this.fetchCount, "descending");
    },

    loadPrevious: function() {
        this.getCollections(this.startId, this.fetchCount, "ascending");
    },

    getCollections: function(startId, count, order) {
    	var collection = this;

        // console.log("Getting collections", startId, "Count", count, "Order", order);

    	pm.api.getDirectoryCollections(startId, count, order, function (collections) {
            var c;
            var i;
            var updated_at_formatted;

            if (order === "descending") {
                collection.totalCount += collections.length;
            }
            else {
                collection.totalCount -= collection.lastCount;
            }

            collection.lastCount = collections.length;

	    	if(collections.hasOwnProperty("message")) {
	    		// Signal error
	    	}
	    	else {
                for(i = 0; i < collections.length; i++) {
                    c = collections[i];
                    updated_at_formatted = new Date(c.updated_at).toDateString();
                    c.updated_at_formatted = updated_at_formatted;
                    c.timestamp = new Date(c.updated_at).getTime();
                }

                collections.sort(sortById);

                collection.reset([]);
                collection.add(collections, {merge: true});

                collection.startId = parseInt(collections[0].id, 10);
                collection.endId = parseInt(collections[collections.length - 1].id, 10);
	    	}
        });
    },

    downloadCollection: function(linkId) {
        // TODO Check if the collection is uploaded by the user
        // TODO Download using remote ID
        var remoteId = pm.user.getRemoteIdForLinkId(linkId);

        // console.log("Found remoteId", remoteId);
        if (remoteId) {
            pm.user.downloadSharedCollection(remoteId, function() {

                pm.mediator.trigger("notifySuccess", "Downloaded collection");
            });
        }
        else {
            pm.api.downloadDirectoryCollection(linkId, function (data) {
                try {
                    var collection = data;
                    pm.mediator.trigger("notifySuccess", "Downloaded collection");

                    pm.mediator.trigger("addDirectoryCollection", collection);
                }
                catch(e) {
                    pm.mediator.trigger("notifyError", "Failed to download collection");
                    pm.mediator.trigger("failedCollectionImport");
                }
            });
        }
    }

});
var DirectoryBrowser = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        this.directoryCollectionViewer = new DirectoryCollectionViewer({model: this.model});

        model.on("add", this.addDirectoryCollection, this);
        model.on("remove", this.removeDirectoryCollection, this);
        model.on("reset", this.render, this);

        $(".directory-browser-header").on("click", function() {
            model.reload();
        });

        $("#directory-collections").on("click", ".directory-collection-action-view", function() {
            var id = $(this).attr("data-id");
            var collection = model.get(id);
            view.directoryCollectionViewer.showCollection(collection);
        });

        $("#directory-collections").on("click", ".directory-collection-action-download", function() {
            var link_id = $(this).attr("data-link-id");
            pm.mediator.trigger("getDirectoryCollection", link_id);
        });

        $(".directory-browser-navigator-next").on("click", function() {
            if(!$(this).hasClass("disabled")) {
                model.loadNext();
            }
        });

        $(".directory-browser-navigator-previous").on("click", function() {
            if(!$(this).hasClass("disabled")) {
                model.loadPrevious();
            }
        });
    },

    render: function() {
        $("#directory-collections").html("");
    },

    renderNavigator: function() {
        var model = this.model;
        var startId = model.startId;
        var length = model.length;

        if (model.lastCount < model.fetchCount) {
            // Disable next
            $(".directory-browser-navigator-next").removeClass("enabled");
            $(".directory-browser-navigator-next").addClass("disabled");
        }
        else {
            $(".directory-browser-navigator-next").removeClass("disabled");
            $(".directory-browser-navigator-next").addClass("enabled");
        }

        if (model.totalCount <= model.fetchCount) {
            $(".directory-browser-navigator-previous").removeClass("enabled");
            $(".directory-browser-navigator-previous").addClass("disabled");
        }
        else {
            $(".directory-browser-navigator-previous").removeClass("disabled");
            $(".directory-browser-navigator-previous").addClass("enabled");
        }

        var start = model.totalCount - model.lastCount + 1;

        if (start < 0) {
            start = 1;
        }

        var end = model.totalCount;

        $(".directory-browser-navigator-status .start").html(start);
        $(".directory-browser-navigator-status .end").html(end);
    },

    addDirectoryCollection: function(collection) {
        this.renderNavigator();
        var c = _.clone(collection.toJSON());
        c.description = markdown.toHTML(c.description);
        $("#directory-collections").append(Handlebars.templates.item_directory_collection(c));
    },

    removeDirectoryCollection: function(collection) {
        this.renderNavigator();
    },
});
var DirectoryCollectionViewer = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        $("#directory-collection-viewer").on("click", ".btn-primary", function() {
        	var link_id = $(this).attr("data-link-id");
        	pm.mediator.trigger("getDirectoryCollection", link_id);
        });
    },

    showCollection: function(collection) {
    	$("#directory-collection-viewer-name").html(collection.get("name"));
        $("#directory-collection-viewer-user-name").html(collection.get("user_name"));
    	$("#directory-collection-viewer-description").html(markdown.toHTML(collection.get("description")));
    	$("#directory-collection-viewer-updated-at").html("Last updated: " + collection.get("updated_at_formatted"));
    	$("#directory-collection-viewer-count-requests").html(collection.get("count_requests") + " endpoints");
    	$("#directory-collection-viewer-download").attr("data-id", collection.get("id"));
    	$("#directory-collection-viewer-download").attr("data-link-id", collection.get("link_id"));

    	$("#directory-collection-viewer").modal("show");
    }
});
var DriveSync = Backbone.Model.extend({
    defaults: function() {
        return {
        	initializedSync: false,
        	lastSynced: "",
        	canSync: false,
        	isSyncing: false,
        	fileSystem: null,
        	queue: [],
            log: null
        };
    },

    initialize: function(options) {
        var model = this;

        var canSync = pm.settings.getSetting("driveSyncEnabled");

        if (canSync) {
            this.openSyncableFileSystem();
        }

        pm.mediator.on("driveSyncStatusChanged", function() {
            canSync = pm.settings.getSetting("driveSyncEnabled");

            if (canSync) {
                model.openSyncableFileSystem();
            }

        });
    },

    errorHandler:function (e) {
        var msg = '';

        switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        default:
            msg = 'Unknown Error';
            break;
        }

        this.get("log").addToLog("DriveSync", 'Error: ' + msg);
    },

    openSyncableFileSystem: function() {
        this.get("log").addToLog("Opening Google Drive file system");

    	var model = this;

        var canSync = pm.settings.getSetting("driveSyncEnabled");

        if (!canSync) {
            this.get("log").addToLog("Can not sync");
            return false;
        }
        else {
            chrome.syncFileSystem.requestFileSystem(function (fs) {
                model.get("log").addToLog("Opened Google Drive file system");

                if (chrome.runtime.lastError) {
                    // TODO Need to handle this in a better way
                    model.errorHandler('requestFileSystem: ' + chrome.runtime.lastError.message);
                    return;
                }

                _.bind(model.onFileSystemOpened, model)(fs);
            });

            return true;
        }
    },

    isSyncingInitialized: function() {
    	return this.get("initializedSync");
    },

    onFileSystemOpened: function(fs) {
    	var model = this;

    	this.set("fileSystem", fs);
    	this.set("initializedSync", true);
    	pm.mediator.trigger("initializedSyncableFileSystem");

    	pm.mediator.on("addSyncableFile", function(syncableFile, callback) {
    		model.get("log").logChangeOnDrive("addSyncableFile", syncableFile.name);
    		model.syncFile(syncableFile, callback);
    	});

    	pm.mediator.on("updateSyncableFile", function(syncableFile, callback) {
    		model.get("log").logChangeOnDrive("updateSyncableFile", syncableFile.name);
    		model.syncFile(syncableFile, callback);
    	});

    	pm.mediator.on("removeSyncableFile", function(name, callback) {
    		model.get("log").logChangeOnDrive("removeSyncableFile", name);
    		model.removeFile(name);
    	});

    	pm.mediator.on("getSyncableFileData", function(fileEntry, callback) {
            model.get("log").logChangeOnDrive("getSyncableFileData");
    		model.getFile(fileEntry, callback);
    	});

    	this.startListeningForChanges();
    },

    removeFileIfExists:function (name, callback) {
    	var fileSystem = this.get("fileSystem");

        fileSystem.root.getFile(name, {create:false},
        	function (fileEntry) {
                fileEntry.remove(function () {
                	if (callback) {
                		callback();
                	}

                }, function () {
                	if (callback) {
                		callback();
                	}

                });
            },
            function () {
            	if (callback) {
            		callback();
            	}
        	}
    	);
    },

    // Add/edit file
    syncFile: function(syncableFile, callback) {

    	var fileSystem = this.get("fileSystem");
    	var name = syncableFile.name;
    	var data = syncableFile.data;
    	var errorHandler = this.errorHandler;

    	fileSystem.root.getFile(name,
    	    {create:true},
    	    function (fileEntry) {
    	        if (!fileEntry) {
                    return;
                }

                fileEntry.createWriter(function(writer) {
                    var truncated = false;

                    writer.onerror = function (e) {
                    	if (callback) {
                    		callback("failed");
                    	}
                    };

                    writer.onwriteend = function(e) {
                        if (!truncated) {
                            truncated = true;
                            this.truncate(this.position);
                            return;
                        }

                        if (callback) {
                        	callback("success");
                        }

                    };

                    blob = new Blob([data], {type:'text/plain'});

                    writer.write(blob);
                }, errorHandler);
    	    }, errorHandler
    	);
    },

    getFile: function(fileEntry, callback) {

    	var errorHandler = this.errorHandler;

    	fileEntry.file(function(file) {

			var reader = new FileReader();
			reader.readAsText(file, "utf-8");

			reader.onload = function(ev) {
				if (callback) {
					callback(ev.target.result);
				}
			};
    	}, errorHandler);
    },

    // Remove file
    removeFile: function(name, callback) {
    	this.removeFileIfExists(name, callback);
    },

    startListeningForChanges: function() {
    	var model = this;

    	chrome.syncFileSystem.onFileStatusChanged.addListener(
			function(detail) {
				_.bind(model.onSyncableFileStatusChanged, model)(detail);
			}
		);
    },

    onSyncableFileStatusChanged: function(detail) {
        var model = this;

    	var direction = detail.direction;
    	var action = detail.action;
    	var name = detail.fileEntry.name;
    	var status = detail.status;
    	var s = splitSyncableFilename(name);

    	var id = s.id;
    	var type = s.type;

    	if (status === "synced") {
    	    if (direction === "remote_to_local") {
    	        if (action === "added") {
    	            model.get("log").logFileStatusChange("Add file", name);
    	            this.getFile(detail.fileEntry, function(data) {
    	            	pm.mediator.trigger("addSyncableFileFromRemote", type, data);
    	            });
    	        }
    	        else if (action === "updated") {
    	        	model.get("log").logFileStatusChange("Update file", name);
    	        	this.getFile(detail.fileEntry, function(data) {
    	        		pm.mediator.trigger("updateSyncableFileFromRemote", type, data);
    	        	});
    	        }
    	        else if (action === "deleted") {
    	            model.get("log").logFileStatusChange("Delete file", name);
    	            pm.mediator.trigger("deleteSyncableFileFromRemote", type, id);
    	        }
    	    }
    	    else {
                model.get("log").logFileStatusChange("local_to_remote", name);
    	    }
    	}
    	else {
            model.get("log").logFileStatusChange("Not synced", name);
    	}
    }
});
var DriveSyncIntroduction = Backbone.View.extend({
    initialize: function() {
        var permissionStatus = pm.settings.getSetting("driveSyncPermissionStatus");
        console.log("Permission status is ", permissionStatus);
        if (permissionStatus === "not_asked") {
            $("#modal-drive-first-time-sync").modal("show");
        }

        $("#drive-sync-backup").on("click", function() {
            pm.indexedDB.downloadAllData(function() {
                noty(
                {
                    type:'success',
                    text:'Saved the data dump',
                    layout:'topCenter',
                    timeout:750
                });
            });
        });

        $("#drive-sync-start").on("click", function() {
            pm.settings.setSetting("driveSyncPermissionStatus", "asked");
            pm.settings.setSetting("driveSyncEnabled", true);
            $("#modal-drive-first-time-sync").modal("hide");
        });

        $("#drive-sync-cancel").on("click", function() {
            pm.settings.setSetting("driveSyncPermissionStatus", "disabled");
            pm.settings.setSetting("driveSyncEnabled", false);
            $("#modal-drive-first-time-sync").modal("hide");
        });
    }
});

var DriveSyncLog = Backbone.Collection.extend({
	model: DriveSyncLogItem,

	initialize: function() {
		console.log("Initialized DriveSyncLog");
	},

	addToLog: function(message) {
	    var obj = new DriveSyncLogItem({
	    	class: "default",
	        time: new Date().toUTCString(),
	        message: message
	    });

	    this.add(obj);
	},

	logChangeOnDrive: function(event, filename) {
		var obj = new DriveSyncLogItem({
			class: "change-on-drive",
		    time: new Date().toUTCString(),
		    message: "Local DB to Google Drive: " + event + ", " + filename
		});

		this.add(obj);
	},

	logFileStatusChange: function(event, filename) {
		var obj = new DriveSyncLogItem({
			class: "file-status-change",
		    time: new Date().toUTCString(),
		    message: "Google Drive to local DB: " + event + ", " + filename
		});

		this.add(obj);
	}
});

var DriveSyncLogItem = Backbone.Model.extend({
    defaults: function() {
        return {
            "class": "",
            "time": 0,
            "message": ""
        };
    }
});

var DriveSyncLogger = Backbone.View.extend({
    initialize: function() {
    	var wait;

    	var view = this;
        this.model.on("add", this.render, this);

        $("#google-drive-toggle").on("click", function() {
            view.toggleGoogleDriveSync();
        });

        $("#google-drive-status a").on("click", function() {
            view.toggleLoggerDisplay();
        });

        $("#google-drive-close-logger").on("click", function() {
            view.toggleLoggerDisplay();
        });

        $(document).bind('keydown', 'alt+g', function () {
            view.toggleLoggerDisplay();
        });

        var canSync = pm.settings.getSetting("driveSyncEnabled");

        if(canSync) {
            $("#logger-drivesync-log-empty-view").css("display", "none");
            $("#logger-drivesync-log-container").css("display", "block");
            $("#google-drive-toggle").html("Disable syncing with Google Drive");
            $("#google-drive-toggle").addClass("btn btn-danger");
        }
        else {
            $("#logger-drivesync-log-empty-view").css("display", "block");
            $("#logger-drivesync-log-container").css("display", "none");
            $("#google-drive-toggle").html("Enable syncing with Google Drive");
            $("#google-drive-toggle").addClass("btn btn-primary");
        }
    },

    toggleGoogleDriveSync: function() {
        var canSync = pm.settings.getSetting("driveSyncEnabled");

        if(canSync) {
            pm.settings.setSetting("driveSyncEnabled", false);
            $("#google-drive-toggle").html("Enable syncing with Google Drive");
            $("#logger-drivesync-log-empty-view").css("display", "block");
            $("#logger-drivesync-log-container").css("display", "none");
            $("#google-drive-toggle").removeClass();
            $("#google-drive-toggle").addClass("btn btn-primary");
            $("#google-drive-toggle").html("Enable syncing with Google Drive");

            pm.mediator.trigger("driveSyncStatusChanged");
        }
        else {
            pm.settings.setSetting("driveSyncEnabled", true);

            $("#logger-drivesync-log-empty-view").css("display", "none");
            $("#logger-drivesync-log-container").css("display", "block");

            $("#google-drive-toggle").html("Disable syncing with Google Drive");
            $("#google-drive-toggle").removeClass();
            $("#google-drive-toggle").addClass("btn btn-danger");

            pm.mediator.trigger("driveSyncStatusChanged");
        }
    },

    toggleLoggerDisplay: function() {
        var displayed = $("#logger-drivesync").css("display") === "block";

        if (displayed) {
            $("#logger-drivesync").css("display", "none");
        }
        else {
            $("#logger-drivesync").css("display", "block");
        }
    },

    render: function() {
        var logItems = this.model.toJSON();
        $('#logger-drivesync-items').html("");
        $('#logger-drivesync-items').append(Handlebars.templates.logger_drivesync({items: logItems}));
        $('#logger-drivesync-log-container').scrollTop($('#logger-drivesync-items').height());
    }

});

var Environment = Backbone.Model.extend({
    defaults: function() {
        return {
            "id": "",
            "name": "",
            "values": [],
            "timestamp": 0,
            "synced": false,
            "syncedFilename": ""
        };
    },

    toSyncableJSON: function() {
        var j = this.toJSON();
        j.synced = true;
        return j;
    }
});

var Environments = Backbone.Collection.extend({
    model: Environment,

    isLoaded: false,
    initializedSyncing: false,

    comparator: function(a, b) {
        var counter;

        var aName = a.get("name");
        var bName = b.get("name");

        if (aName.length > bName.legnth)
            counter = bName.length;
        else
            counter = aName.length;

        for (var i = 0; i < counter; i++) {
            if (aName[i] == bName[i]) {
                continue;
            } else if (aName[i] > bName[i]) {
                return 1;
            } else {
                return -1;
            }
        }
        return 1;
    },

    initialize:function () {
        var collection = this;

        // TODO Events for in-memory updates
        pm.appWindow.trigger("registerInternalEvent", "addedEnvironment", this.onAddedEnvironment, this);
        pm.appWindow.trigger("registerInternalEvent", "updatedEnvironment", this.onUpdatedEnvironment, this);
        pm.appWindow.trigger("registerInternalEvent", "deletedEnvironment", this.onDeletedEnvironment, this);

        this.startListeningForFileSystemSyncEvents();

        pm.indexedDB.environments.getAllEnvironments(function (environments) {        
            environments.sort(sortAlphabetical);
            collection.add(environments, {merge: true});

            collection.isLoaded = true;
            collection.trigger("startSync");
            collection.trigger("loadedEnvironments");
            pm.mediator.trigger("loadedEnvironments");
        })
    },

    // Functions for internal app window messaging
    onAddedEnvironment: function(environment) {
        this.add(environment, { merge: true });
    },

    onUpdatedEnvironment: function(environment) {
        this.add(environment, { merge: true });
    },

    onDeletedEnvironment: function(id) {
        this.remove(id);
    },

    startListeningForFileSystemSyncEvents: function() {
        var collection = this;
        var isLoaded = collection.isLoaded;
        var initializedSyncing = collection.initializedSyncing;

        pm.mediator.on("initializedSyncableFileSystem", function() {
            collection.initializedSyncing = true;
            collection.trigger("startSync");
        });

        this.on("startSync", this.startSyncing, this);
    },

    startSyncing: function() {
        var i = 0;
        var collection = this;
        var environment;
        var synced;
        var syncableFile;

        if (this.isLoaded && this.initializedSyncing) {
            pm.mediator.on("addSyncableFileFromRemote", function(type, data) {
                if (type === "environment") {
                    collection.onReceivingSyncableFileData(data);
                }
            });

            pm.mediator.on("updateSyncableFileFromRemote", function(type, data) {
                if (type === "environment") {
                    collection.onReceivingSyncableFileData(data);
                }
            });

            pm.mediator.on("deleteSyncableFileFromRemote", function(type, id) {
                if (type === "environment") {
                    collection.onRemoveSyncableFile(id);
                }
            });

            // And this
            for(i = 0; i < this.models.length; i++) {
                environment = this.models[i];
                synced = environment.get("synced");

                if (!synced) {
                    this.addToSyncableFilesystem(environment.get("id"));
                }
            }
        }
        else {
        }
    },

    onReceivingSyncableFileData: function(data) {
        this.importEnvironment(data, true);
    },

    onRemoveSyncableFile: function(id) {
        this.deleteEnvironment(id, true);
    },

    getAsSyncableFile: function(id) {
        var environment = this.get(id);
        var name = id + ".environment";
        var type = "environment";
        var data = JSON.stringify(environment.toSyncableJSON());

        return {
            "name": name,
            "type": type,
            "data": data
        };
    },

    addToSyncableFilesystem: function(id) {
        var collection = this;

        var syncableFile = this.getAsSyncableFile(id);
        pm.mediator.trigger("addSyncableFile", syncableFile, function(result) {
            if(result === "success") {
                collection.updateEnvironmentSyncStatus(id, true);
            }
        });
    },

    removeFromSyncableFilesystem: function(id) {
        var name = id + ".environment";
        pm.mediator.trigger("removeSyncableFile", name, function(result) {
        });
    },

    addEnvironment:function (name, values, doNotSync) {
        var collection = this;

        var environment = {
            id:guid(),
            name:name,
            values:values,
            timestamp:new Date().getTime(),
            synced: false
        };

        var envModel = new Environment(environment);
        collection.add(envModel);

        pm.appWindow.trigger("sendMessageObject", "addedEnvironment", environment);

        pm.indexedDB.environments.addEnvironment(environment, function () {
            if (doNotSync) {
                // console.log("Do not sync this change");
            }
            else {
                collection.addToSyncableFilesystem(environment.id);
            }

        });
    },

    updateEnvironment:function (id, name, values, doNotSync) {
        var collection = this;

        var environment = {
            id:id,
            name:name,
            values:values,
            timestamp:new Date().getTime()
        };

        var envModel = new Environment(environment);
        collection.add(envModel, {merge: true});
        
        pm.indexedDB.environments.updateEnvironment(environment, function () {            
            pm.appWindow.trigger("sendMessageObject", "updatedEnvironment", environment);

            if (doNotSync) {
                // console.log("Do not sync this change");
            }
            else {
                collection.addToSyncableFilesystem(environment.id);
            }
        });
    },

    clearEnvironment: function(id, name) {
        var collection = this;
        var environment = {
            id:id,
            name:name,
            values:[],
            timestamp:new Date().getTime()
        };
        var envModel = new Environment(environment);
        collection.add(envModel, {merge: true});

        pm.indexedDB.environments.updateEnvironment(environment, function () {
            pm.appWindow.trigger("sendMessageObject", "clearedEnvironment", environment);
        });
    },

    updateEnvironmentSyncStatus: function(id, status) {
        var collection = this;

        var environment = this.get(id);
        environment.set("synced", status);
        collection.add(environment, {merge: true});
        pm.appWindow.trigger("sendMessageObject", "updatedEnvironment", environment);

        pm.indexedDB.environments.updateEnvironment(environment.toJSON(), function () {
        });
    },

    deleteEnvironment:function (id, doNotSync) {
        var collection = this;

        pm.indexedDB.environments.deleteEnvironment(id, function () {
            collection.remove(id);
            pm.appWindow.trigger("sendMessageObject", "deletedEnvironment", id);

            if (doNotSync) {
                // console.log("Do not sync this");
            }
            else {
                collection.removeFromSyncableFilesystem(id);
            }
        });
    },

    downloadEnvironment:function (id) {
        var environment = this.get(id);

        environment.set("synced", false);

        var name = environment.get("name") + ".postman_environment";
        var type = "application/json";
        var filedata = JSON.stringify(environment.toJSON(), null, '\t');
        pm.filesystem.saveAndOpenFile(name, filedata, type, function () {
            noty(
                {
                    type:'success',
                    text:'Saved environment to disk',
                    layout:'topCenter',
                    timeout:750
                });
        });
    },

    duplicateEnvironment:function (id) {
        var oldEnvironment = this.get(id).toJSON();
        var environment = _.clone(oldEnvironment);
        environment.name = environment.name + " " + "copy";
        environment.id = guid();

        var collection = this;

        pm.indexedDB.environments.addEnvironment(environment, function () {
            var envModel = new Environment(environment);
            collection.add(envModel);
            pm.appWindow.trigger("sendMessageObject", "addedEnvironment", environment);
            collection.addToSyncableFilesystem(environment.id);
        });
    },

    importEnvironment: function(data, doNotSync) {
        var collection = this;
		var environment;
	    try {
            environment = JSON.parse(data);
	    }
	    catch(err) {
		    console.log("Error - File is not a valid JSON file");
		    noty(
			    {
				    type:'error',
				    text: 'Error - File is not a valid JSON file',
				    layout:'topCenter',
				    timeout:750
			    });
	    }

        pm.indexedDB.environments.addEnvironment(environment, function () {
            var envModel = new Environment(environment);
            collection.add(envModel, {merge: true});
            pm.appWindow.trigger("sendMessageObject", "updatedEnvironment", environment);

            if (doNotSync) {
                // console.log("Do not sync this");
            }
            else {
                collection.trigger("importedEnvironment", environment);
                collection.addToSyncableFilesystem(environment.id);
            }

        });
    },

    importEnvironments:function (files) {
        var collection = this;

        // Loop through the FileList
        for (var i = 0, f; f = files[i]; i++) {
            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function (theFile) {
                return function (e) {
                    // Render thumbnail.
                    collection.importEnvironment(e.currentTarget.result);
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsText(f);
        }
    },

    mergeEnvironments: function(environments) {
        var size = environments.length;
        var collection = this;

        function onUpdateEnvironment(environment) {
            var envModel = new Environment(environment);
            collection.add(envModel, {merge: true});
            pm.mediator.trigger("sendMessageObject", "updatedEnvironment", environment);

            collection.addToSyncableFilesystem(environment.id);
        }

        for(var i = 0; i < size; i++) {
            var environment = environments[i];
            pm.indexedDB.environments.updateEnvironment(environment, onUpdateEnvironment);
        }
    }
});


var Globals = Backbone.Model.extend({
    isLoaded: false,
    initializedSyncing: false,

    defaults: function() {
        return {
            "globals": [],
            "syncFileID": "postman_globals",
            "synced": false
        };
    },

    initialize:function () {
        this.set({"globals": []});

        var model = this;

        pm.appWindow.trigger("registerInternalEvent", "updatedGlobals", this.onUpdatedGlobals, this);

        pm.mediator.on("downloadGlobals", this.downloadGlobals, this);

        this.startListeningForFileSystemSyncEvents();

        pm.storage.getValue('globals', function(s) {
            if (s) {
                model.set({"globals": JSON.parse(s)});
            }
            else {
                model.set({"globals": []});
            }

            model.isLoaded = true;
            model.trigger("startSync");
        });
    },

    startListeningForFileSystemSyncEvents: function() {
        var model = this;
        var isLoaded = model.isLoaded;
        var initializedSyncing = model.initializedSyncing;

        pm.mediator.on("initializedSyncableFileSystem", function() {
            model.initializedSyncing = true;
            model.trigger("startSync");
        });

        this.on("startSync", this.startSyncing, this);
    },

    startSyncing: function() {
        var i = 0;
        var model = this;
        var globals;
        var synced;
        var syncableFile;

        if (this.isLoaded && this.initializedSyncing) {
            pm.mediator.on("addSyncableFileFromRemote", function(type, data) {
                if (type === "globals") {
                    model.onReceivingSyncableFileData(data);
                }
            });

            pm.mediator.on("updateSyncableFileFromRemote", function(type, data) {
                if (type === "globals") {
                    model.onReceivingSyncableFileData(data);
                }
            });

            pm.mediator.on("deleteSyncableFileFromRemote", function(type, id) {
                if (type === "globals") {
                    model.onRemoveSyncableFile(id);
                }
            });

            synced = pm.settings.getSetting("syncedGlobals");

            if (!synced) {
                this.addToSyncableFilesystem(this.get("syncFileID"));
            }
        }
        else {
        }
    },

    onReceivingSyncableFileData: function(data) {
        var globals = JSON.parse(data);
        this.mergeGlobals(globals);
    },

    onRemoveSyncableFile: function(id) {
        // console.log("Do nothing");
        // this.deleteEnvironment(id, true);
    },

    getAsSyncableFile: function(id) {
        var name = id + ".globals";
        var type = "globals";
        var data = JSON.stringify(this.get("globals"));

        return {
            "name": name,
            "type": type,
            "data": data
        };
    },

    addToSyncableFilesystem: function(id) {
        var model = this;

        var syncableFile = this.getAsSyncableFile(id);

        pm.mediator.trigger("addSyncableFile", syncableFile, function(result) {
            if(result === "success") {
                model.updateGlobalSyncStatus(id, true);
            }
        });
    },

    removeFromSyncableFilesystem: function(id) {
        var name = id + ".globals";
        pm.mediator.trigger("removeSyncableFile", name, function(result) {
            model.saveGlobals([]);
        });
    },

    updateGlobalSyncStatus: function(id, status) {
        pm.settings.setSetting("syncedGlobals", status);
    },

    onUpdatedGlobals: function(globals) {
        // console.log("Globals: This is ", this);
        // console.log("Globals are now", globals);
        this.set({"globals": globals});
    },

    downloadGlobals: function() {
        var name = "globals.postman_globals";
        var type = "application/json";

        globalsJSON = this.get("globals");

        var filedata = JSON.stringify(globalsJSON, null, '\t');

        pm.filesystem.saveAndOpenFile(name, filedata, type, function () {
            noty(
                {
                    type:'success',
                    text:'Saved globals to disk',
                    layout:'topCenter',
                    timeout:750
                });
        });
    },

    saveGlobals:function (globals) {
        var model = this;

        this.set({"globals": globals});

        var o = {'globals': JSON.stringify(globals)};

        pm.storage.setValue(o, function() {
            pm.appWindow.trigger("sendMessageObject", "updatedGlobals", globals);
            model.addToSyncableFilesystem(model.get("syncFileID"));
        });
    },

    clearGlobals: function () {
        var model = this;

        this.set({"globals": []});

        var o = {'globals': JSON.stringify([])};

        pm.storage.setValue(o, function() {
            pm.appWindow.trigger("sendMessageObject", "clearedGlobals", []);
            model.addToSyncableFilesystem(model.get("syncFileID"));
        });
    },

    mergeGlobals: function(globals) {
        this.set({"globals": globals});
        var o = {'globals': JSON.stringify(globals)};
        pm.storage.setValue(o, function() {
            pm.appWindow.trigger("sendMessageObject", "updatedGlobals", globals);
        });
    }
});

var VariableProcessor = Backbone.Model.extend({
    defaults: function() {
        return {
            environments: null,
            globals: null,
            externalDataVariables: [],
            functions: {},
            selectedEnv:null,
            selectedEnvironmentId:""
        };
    },

    initialize: function() {
        this.get("environments").on("reset", this.setCurrentEnvironment, this);
        this.get("environments").on("change", this.setCurrentEnvironment, this);
        this.get("environments").on("add", this.setCurrentEnvironment, this);
        this.get("environments").on("remove", this.setCurrentEnvironment, this);

        this.set("selectedEnvironmentId", pm.settings.getSetting("selectedEnvironmentId"));
        this.set("selectedEnv", this.get("environments").get(pm.settings.getSetting("selectedEnvironmentId")));

        pm.mediator.on("setEnvironmentVariable", this.setEnvironmentVariable, this);
        pm.mediator.on("setGlobalVariable", this.setGlobalVariable, this);
        pm.mediator.on("clearEnvironmentVariables", this.clearEnvironmentVariables, this);
        pm.mediator.on("clearGlobalVariables", this.clearGlobalVariables, this);

        this.initializeFunctions();
    },

    setGlobalVariable: function(v) {
        var targetKey = v.key;
        var targetValue = v.value + '';

        var variableProcessor = this.get("variableProcessor");
        var globals = this.get("globals");
        var globalValues = _.clone(globals.get("globals"));

        var count = globalValues.length;
        var value;

        var found = false;

        for(var i = 0; i < count; i++) {
            value = globalValues[i];
            if (value.key === targetKey) {
                found = true;
                value.value = targetValue;
                break;
            }
        }

        if (!found) {
            globalValues.push({
                "key": targetKey,
                "type": "text",
                "value": targetValue
            });
        }

        globals.saveGlobals(globalValues);

        if(this.get("setGlobalsTimeout")) {
            clearTimeout(this.get("setGlobalsTimeout"));
        }
        this.set("setGlobalsTimeout",setTimeout(function() {
            globals.trigger("change:globals");
        },100));
    },

    setEnvironmentVariable: function(v) {
        var targetKey = v.key;
        var targetValue = v.value + '';

        var variableProcessor = this;
        var environments = this.get("environments");
        var selectedEnv = this.get("selectedEnv");
        var found = false;

        if (selectedEnv) {
            var values = _.clone(selectedEnv.get("values"));

            var count = values.length;
            for(var i = 0; i < count; i++) {
                value = values[i];
                if (value.key === targetKey) {
                    found = true;
                    value.value = targetValue;
                    break;
                }
            }

            if (!found) {
                values.push({
                    "key": targetKey,
                    "type": "text",
                    "value": targetValue
                });
            }

            var id = selectedEnv.get("id");
            var name = selectedEnv.get("name");            

            environments.updateEnvironment(id, name, values);            

            // TODO For random reasons, selectedEnv is getting updated
            var newEnvironment = environments.get(id);
            this.setEnvironment(newEnvironment);
        }
    },

    clearEnvironmentVariables: function() {
        var variableProcessor = this;
        var environments = this.get("environments");
        var selectedEnv = this.get("selectedEnv");
        var found = false;

        if (selectedEnv) {
            var id = selectedEnv.get("id");
            var name = selectedEnv.get("name");

            environments.clearEnvironment(id, name);

            // TODO For random reasons, selectedEnv is getting updated
            var newEnvironment = environments.get(id);
            this.setEnvironment(newEnvironment);
        }
    },

    clearGlobalVariables: function() {
        var variableProcessor = this.get("variableProcessor");
        var globals = this.get("globals");
        var globalValues = [];
        globals.saveGlobals(globalValues);
        globals.trigger("change:globals");
    },

    setExternalDataVariables: function(kvpairs) {        
        var vars = [];
        for(key in kvpairs) {
            if (kvpairs.hasOwnProperty(key)) {
                vars.push({
                    "key": key,
                    "value": kvpairs[key],
                    "type": "text"
                });
            }
        }

        this.set("externalDataVariables", vars);
    },

    initializeFunctions: function() {
        var functions = {
            "\\$guid": {
                key: "$guid",
                run: function() {
                    return guid();
                }
            },

            "\\$timestamp": {
                key: "$timestamp",
                run: function() {
                    return Math.round(new Date().getTime() / 1000);
                }
            },

            "\\$randomInt": {
                key: "$randomInt",
                run: function(min, max) {
                    if (!min) min = 0;
                    if (!max) max = 1000;
                    return getRandomInt(min, max);
                }
            },

            "\\$random [0-9]+,[0-9]+": {
                key: "$randomInt",
                run: function(min, max) {
                    if (!min) min = 0;
                    if (!max) max = 1000;

                    return getRandomArbitrary(min, max);
                }
            }
        };

        this.set("functions", functions);
    },

    setCurrentEnvironment: function() {
        this.set("selectedEnvironmentId", pm.settings.getSetting("selectedEnvironmentId"));
        this.set("selectedEnv", this.get("environments").get(pm.settings.getSetting("selectedEnvironmentId")));
    },

    setEnvironment: function(environment) {
        this.set("selectedEnvironmentId", environment.get("id"));
        this.set("selectedEnv", environment);
    },

    disableEnvironment: function() {        
        this.set("selectedEnvironmentId", "");
        this.set("selectedEnv", null);
    },

    setGlobals: function(globalsArray) {
        var globals = this.get("globals");
        globals.set("globals", globalsArray);
    },

    containsVariable:function (string, values) {        
        var variableDelimiter = pm.settings.getSetting("variableDelimiter");
        var startDelimiter = variableDelimiter.substring(0, 2);
        var endDelimiter = variableDelimiter.substring(variableDelimiter.length - 2);
        var patString = startDelimiter + "[^\r\n]*" + endDelimiter;

        var pattern = new RegExp(patString, 'g');        
        var matches = string.match(pattern);
        var count = values.length;
        var variable;

        if(matches === null) {
            return false;
        }

        for(var i = 0; i < count; i++) {
            if (values[i].type === "text") {
                variable = startDelimiter + values[i].key + endDelimiter;                
            }
            else if (values[i].type === "function") {
                variable = startDelimiter + values[i].matcher + endDelimiter;
            }
            
            if(_.indexOf(matches, variable) >= 0) {                
                return true;
            }
        }

        return false;
    },

	processString:function (string, values) {
		if (!values) return string;

		var count = values.length;
		var finalString = _.clone(string);
		var patString;
		var pattern;

		var variableDelimiter = pm.settings.getSetting("variableDelimiter");
		var startDelimiter = variableDelimiter.substring(0, 2);
		var endDelimiter = variableDelimiter.substring(variableDelimiter.length - 2);

		for (var i = 0; i < count; i++) {
			patString = startDelimiter + values[i].key + endDelimiter;
			pattern = new RegExp(patString, 'g');
			var valToUse = _.clone(values[i].value);
			//TODO: required because of zendesk ticket #163
			if(valToUse === null) {
				//error condition
				console.log("For this variable (key="+values[i].key+"), value is null. Not substituting...");
				continue;
			}

			if(typeof valToUse === "object") {
				var result = valToUse.run();
				finalString = finalString.replace(pattern, result);
			}
			else {
				finalString = finalString.replace(pattern,valToUse);
			}
		}

		if (this.containsVariable(finalString, values)) {
			finalString = this.processString(finalString, values);
			return finalString;
		}
		else {
			return finalString;
		}
	},

    getCurrentValue: function(string) {
        if (typeof string === "number") {
            return string;
        }

        var envModel = this.get("selectedEnv");
        var envValues = [];

        if (envModel) {
            var environment = envModel.toJSON();
            if (environment !== null) {
                envValues = environment.values;
            }
        }

        var globals = this.get("globals").get("globals");
        var values;

        var externalDataVariables = this.get("externalDataVariables");        

        if (externalDataVariables) {        
            values = externalDataVariables;
            values = _.union(values, envValues);
        }
        else {
            values = envValues;
        }

        if (globals) {
            values = _.union(values, globals);
        }        

        var functions = this.get("functions");
        var fs = [];
        for(f in functions) {
            if(functions.hasOwnProperty(f)) {
                var kvpair = {
                    "key": f,
                    "matcher": functions[f].key,
                    "value": functions[f],
                    "type": "function"
                };

                fs.push(kvpair);
            }
        }

        values = _.union(values, fs);            

        if (string) {            
            var finalString = _.clone(this.processString(string, values));

            return finalString;
        }
        else {
            return string;
        }

    }
});
var EnvironmentManagerModal = Backbone.View.extend({
    environments: null,
    globals: null,
    setEnvTimeout: null,

    initialize: function() {
        this.environments = this.options.environments;
        this.globals = this.options.globals;

        this.environments.on('change', this.render, this);
        this.environments.on('reset', this.render, this);
        this.environments.on('add', this.render, this);
        this.environments.on('remove', this.render, this);
        this.environments.on("importedEnvironment", this.onImportedEnvironment, this);

        this.globals.on('change:globals', this.render, this);

        var environments = this.environments;
        var globals = this.globals;
        var view = this;

        $("#modal-environments").on("shown", function () {
            pm.app.trigger("modalOpen", "#modal-environments");
        });

        $("#modal-environments").on("hidden", function () {
            pm.app.trigger("modalClose");
            //view.showSelector();
        });

        $('#environments-list').on("click", ".environment-action-delete", function () {
            var id = $(this).attr('data-id');
            $('a[rel="tooltip"]').tooltip('hide');
            environments.deleteEnvironment(id);
        });

        $('#environments-list').on("click", ".environment-action-edit", function () {
            var id = $(this).attr('data-id');
            view.showEditor(id);
        });

        $('#environments-list').on("click", ".environment-action-duplicate", function () {
            var id = $(this).attr('data-id');
            environments.duplicateEnvironment(id);
        });

        $('#environments-list').on("click", ".environment-action-download", function () {
            var id = $(this).attr('data-id');
            environments.downloadEnvironment(id);
        });

        $('.environment-action-back').on("click", function () {
            view.showSelector();
        });

        $('#environment-files-input').on('change', function (event) {
            var files = event.target.files;
            console.log("Start importEnvironments");
            environments.importEnvironments(files);
            $('#environment-files-input').val("");
        });

        $('.environments-actions-add').on("click", function () {
            view.showEditor();
        });

        $('.environments-actions-import').on('click', function () {
            view.showImporter();
        });

        $('.environments-actions-manage-globals').on('click', function () {
            view.showGlobals();
        });

        $("#environment-globals-download").on('click', function() {
            view.downloadGlobals();
        });

        function submitEnvironmentEditorForm() {
            var id = $('#environment-editor-id').val();
            var name = $('#environment-editor-name').val();
            var values = $('#environment-keyvaleditor').keyvalueeditor('getValues');

            if (id === "0") {
                if(!name || name.length==0) {
                    $("#new-env-name-missing").show();
                    return;
                }
                else {
                    $("#new-env-name-missing").hide();
                }
                environments.addEnvironment(name, values);
            }
            else {
                environments.updateEnvironment(id, name, values);
            }

            $('#environment-editor-name').val("");
            $('#environment-keyvaleditor').keyvalueeditor('reset', []);

            view.showSelector();
        }

        $('#environment-editor-form').submit(function() {
            submitEnvironmentEditorForm();
        });

        $('.environments-actions-add-submit').on("click", function () {
            submitEnvironmentEditorForm();
        });

	    $("#environment-editor").keydown(function (event) {
		    if (event.keyCode === 13) {
			    submitEnvironmentEditorForm();
			    event.preventDefault();
			    return false;
		    }

		    return true;
	    });


	    $("#globals-editor").keydown(function (event) {
		    if (event.keyCode === 13) {
			    $("a.environments-actions-add-back").click();
			    event.preventDefault();
			    return false;
		    }

		    return true;
	    });

	    $('.environments-actions-add-back').on("click", function () {
            var values = $('#globals-keyvaleditor').keyvalueeditor('getValues');
            globals.saveGlobals(values);
            view.showSelector();
            $('#environment-editor-name').val("");
            $('#environment-keyvaleditor').keyvalueeditor('reset', []);
        });

        $('#environments-list-help-toggle').on("click", function (event) {
            var d = $('#environments-list-help-detail').css("display");
            if (d === "none") {
                $('#environments-list-help-detail').css("display", "inline");
                $(event.currentTarget).html("Hide");
            }
            else {
                $('#environments-list-help-detail').css("display", "none");
                $(event.currentTarget).html("Tell me more");
            }
        });

        var params = {
            placeHolderKey:"Key",
            placeHolderValue:"Value",
            deleteButton:'<span class="icon-delete"/>'
        };

        $('#environment-keyvaleditor').keyvalueeditor('init', params);
        $('#globals-keyvaleditor').keyvalueeditor('init', params);

        $(document).bind('keydown', 'e', function () {
            if(pm.app.isModalOpen()) {
                return;
            }

            $('#modal-environments').modal({
                keyboard:true
            });
        });

        this.render();
    },

    onImportedEnvironment: function(environment) {
        noty(
        {
            type:'success',
            dismissQueue: true,
            text:'Imported ' + environment.name,
            layout:'topCenter',
            timeout: 2500
        });
    },

    showEditor:function (id) {
        if (id) {
            var environment = this.environments.get(id).toJSON();
            $('#environment-editor-name').val(environment.name);
            $('#environment-editor-id').val(id);
            $('#environment-keyvaleditor').keyvalueeditor('reset', environment.values);
        }
        else {
            $('#environment-editor-id').val(0);
        }

        $('#environments-list-wrapper').css("display", "none");
        $('#environment-editor').css("display", "block");
        $('#globals-editor').css("display", "none");
        $("#new-env-name-missing").hide();
        $('#modal-environments .modal-footer').css("display", "block");
    },

    downloadGlobals: function() {
        pm.mediator.trigger("downloadGlobals");
    },

    showSelector:function () {
        $('#environments-list-wrapper').css("display", "block");
        $('#environment-editor').css("display", "none");
        $('#environment-importer').css("display", "none");
        $('#globals-editor').css("display", "none");
        $('.environments-actions-add-submit').css("display", "inline");
        $('#modal-environments .modal-footer').css("display", "none");
    },

    showImporter:function () {
        $('#environments-list-wrapper').css("display", "none");
        $('#environment-editor').css("display", "none");
        $('#globals-editor').css("display", "none");
        $('#environment-importer').css("display", "block");
        $('.environments-actions-add-submit').css("display", "none");
        $('#modal-environments .modal-footer').css("display", "block");
    },

    showGlobals:function () {
        $('#environments-list-wrapper').css("display", "none");
        $('#environment-editor').css("display", "none");
        $('#globals-editor').css("display", "block");
        $('#environment-importer').css("display", "none");
        $('.environments-actions-add-submit').css("display", "none");
        $('#modal-environments .modal-footer').css("display", "block");
    },

    render: function() {
        var oldThis = this;
        if(this.setEnvTimeout) {
            clearTimeout(this.setEnvTimeout);
        }
        this.setEnvTimeout = setTimeout(function() {
            $('#environments-list tbody').html("");
            $('#environments-list tbody').append(Handlebars.templates.environment_list({"items": oldThis.environments.toJSON()}));
            $('#environments-list tbody .environment-actions a[rel="tooltip"]').tooltip();
            $('#globals-keyvaleditor').keyvalueeditor('reset', oldThis.globals.get("globals"));
        },100);
    }
});
var EnvironmentSelector = Backbone.View.extend({
    environments: null,
    variableProcessor: null,

    initialize: function() {
        this.environments = this.options.environments;
        this.variableProcessor = this.options.variableProcessor;

        this.environments.on('change', this.render, this);
        this.environments.on('reset', this.render, this);
        this.environments.on('add', this.render, this);
        this.environments.on('remove', this.render, this);

        this.variableProcessor.on('change:selectedEnv', this.render, this);

        var environments = this.environments;
        var variableProcessor = this.variableProcessor;

        $('#environment-selector').on("click", ".environment-list-item", function () {
            var id = $(this).attr('data-id');
            var selectedEnv = environments.get(id);

            variableProcessor.set({"selectedEnv": selectedEnv});
            pm.settings.setSetting("selectedEnvironmentId", selectedEnv.id);
            $('#environment-selector .environment-list-item-selected').html(selectedEnv.name);
        });

        $('#environment-selector').on("click", ".environment-list-item-noenvironment", function () {
            variableProcessor.set({"selectedEnv": null});
            pm.settings.setSetting("selectedEnvironmentId", "");
            $('#environment-selector .environment-list-item-selected').html("No environment");
        });

        this.render();
    },

    render: function() {
        var oldThis = this;
        if(this.setEnvTimeout) {
            clearTimeout(this.setEnvTimeout);
        }
        this.setEnvTimeout = setTimeout(function() {
            $('#environment-selector .dropdown-menu').html("");
            $('#environment-selector .dropdown-menu').append(Handlebars.templates.environment_selector({"items": oldThis.environments.toJSON()}));
            $('#environment-selector .dropdown-menu').append(Handlebars.templates.environment_selector_actions());

            var selectedEnv = oldThis.variableProcessor.get("selectedEnv");

            if (selectedEnv) {
                $('#environment-selector .environment-list-item-selected').html(selectedEnv.toJSON().name);
            }
            else {
                $('#environment-selector .environment-list-item-selected').html("No environment");
            }
        }, 100);
    }
});

var QuickLookPopOver = Backbone.View.extend({
    initialize: function() {
        var view = this;
        
        this.environments = this.options.environments;
        this.variableProcessor = this.options.variableProcessor;
        this.globals = this.options.globals;

        this.environments.on('change', this.render, this);
        this.variableProcessor.on('change:selectedEnv', this.render, this);

        this.globals.on('change:globals', this.render, this);

        $('#environment-quicklook').on("mouseenter", function () {
            $('#environment-quicklook-content').css("display", "block");
        });

        $('#environment-quicklook').on("mouseleave", function () {
            $('#environment-quicklook-content').css("display", "none");
        });


        $(document).bind('keydown', 'q', function () {
            view.toggleDisplay();
            return false;
        });

        this.render();
    },

    render: function() {
        var oldThis = this;
        if(this.setEnvTimeout) {
            clearTimeout(this.setEnvTimeout);
        }
        this.setEnvTimeout = setTimeout(function() {
            var environment = oldThis.environments.get(oldThis.variableProcessor.get("selectedEnv"));

            if (!environment) {
                $('#environment-quicklook-environments h6').html("No environment");
                $('#environment-quicklook-environments ul').html("");
            }
            else {
                $('#environment-quicklook-environments h6').html(environment.get("name"));
                $('#environment-quicklook-environments ul').html("");
                $('#environment-quicklook-environments ul').append(Handlebars.templates.environment_quicklook({
                    "items": environment.toJSON().values
                }));
            }

            if (!oldThis.globals) {
                return;
            }

            $('#environment-quicklook-globals ul').html("");
            $('#environment-quicklook-globals ul').append(Handlebars.templates.environment_quicklook({
                "items": oldThis.globals.get("globals")
            }));
        },100);
    },

    toggleDisplay:function () {
        var display = $('#environment-quicklook-content').css("display");

        if (display === "none") {
            $('#environment-quicklook-content').css("display", "block");
        }
        else {
            $('#environment-quicklook-content').css("display", "none");
        }
    }
});
var HeaderPreset = Backbone.Model.extend({
    defaults: function() {
        return {
            "id": "",
            "name": "",
            "headers": [],
            "timestamp": 0,
            "synced": false
        };
    },

    toSyncableJSON: function() {
        var j = this.toJSON();
        j.synced = true;
        return j;
    }
});

var HeaderPresets = Backbone.Collection.extend({
    model: HeaderPreset,

    isLoaded: false,
    initializedSyncing: false,
    syncFileType: "header_preset",

    comparator: function(a, b) {
        var counter;

        var aName = a.get("name");
        var bName = b.get("name");

        if (aName.length > bName.legnth)
            counter = bName.length;
        else
            counter = aName.length;

        for (var i = 0; i < counter; i++) {
            if (aName[i] == bName[i]) {
                continue;
            } else if (aName[i] > bName[i]) {
                return 1;
            } else {
                return -1;
            }
        }
        return 1;
    },

    presetsForAutoComplete:[],

    initialize:function () {
        this.on("change", this.refreshAutoCompleteList, this);
        this.loadPresets();
    },

    // Initialize all models
    loadPresets:function () {
        var collection = this;

        this.startListeningForFileSystemSyncEvents();

        pm.indexedDB.headerPresets.getAllHeaderPresets(function (items) {
            collection.add(items, {merge: true});
            collection.refreshAutoCompleteList();

            collection.isLoaded = true;
            collection.trigger("startSync");
        });
    },

    startListeningForFileSystemSyncEvents: function() {
        var collection = this;
        var isLoaded = collection.isLoaded;
        var initializedSyncing = collection.initializedSyncing;

        pm.mediator.on("initializedSyncableFileSystem", function() {
            collection.initializedSyncing = true;
            collection.trigger("startSync");
        });

        this.on("startSync", this.startSyncing, this);
    },

    startSyncing: function() {
        var i = 0;
        var collection = this;
        var headerPreset;
        var synced;
        var syncableFile;

        if (this.isLoaded && this.initializedSyncing) {
            pm.mediator.on("addSyncableFileFromRemote", function(type, data) {
                if (type === collection.syncFileType) {
                    collection.onReceivingSyncableFileData(data);
                }
            });

            pm.mediator.on("updateSyncableFileFromRemote", function(type, data) {
                if (type === collection.syncFileType) {
                    collection.onReceivingSyncableFileData(data);
                }
            });

            pm.mediator.on("deleteSyncableFileFromRemote", function(type, id) {
                if (type === collection.syncFileType) {
                    collection.onRemoveSyncableFile(id);
                }
            });

            // And this
            for(i = 0; i < this.models.length; i++) {
                headerPreset = this.models[i];
                synced = headerPreset.get("synced");

                if (!synced) {
                    this.addToSyncableFilesystem(headerPreset.get("id"));
                }
            }
        }
        else {
        }
    },

    onReceivingSyncableFileData: function(data) {
        this.mergeHeaderPreset(JSON.parse(data), true);
    },

    onRemoveSyncableFile: function(id) {
        this.deleteHeaderPreset(id, true);
    },

    getAsSyncableFile: function(id) {
        var collection = this;
        var headerPreset = this.get(id);
        var name = id + "." + collection.syncFileType;
        var type = collection.syncFileType;
        var data = JSON.stringify(headerPreset.toSyncableJSON());

        return {
            "name": name,
            "type": type,
            "data": data
        };
    },

    addToSyncableFilesystem: function(id) {
        var collection = this;

        var syncableFile = this.getAsSyncableFile(id);
        pm.mediator.trigger("addSyncableFile", syncableFile, function(result) {
            if(result === "success") {
                collection.updateHeaderPresetSyncStatus(id, true);
            }
        });
    },

    removeFromSyncableFilesystem: function(id) {
        var collection = this;

        var name = id + "." + collection.syncFileType;
        pm.mediator.trigger("removeSyncableFile", name, function(result) {
        });
    },

    // Iterate through models
    getHeaderPreset:function (id) {
        var presets = this.models;
        var preset;
        for (var i = 0, count = presets.length; i < count; i++) {
            preset = presets[i];
            if (preset.get("id") === id) {
                break;
            }
        }

        return preset;
    },

    // Add to models
    addHeaderPreset:function (name, headers, doNotSync) {
        var id = guid();

        var headerPreset = {
            "id":id,
            "name":name,
            "headers":headers,
            "timestamp":new Date().getTime()
        };

        var collection = this;

        pm.indexedDB.headerPresets.addHeaderPreset(headerPreset, function () {
            collection.add(headerPreset, {merge: true});

            if (!doNotSync) {
                collection.addToSyncableFilesystem(id);
            }
        });
    },

    // Update local model
    editHeaderPreset:function (id, name, headers, doNotSync) {
        var collection = this;

        pm.indexedDB.headerPresets.getHeaderPreset(id, function (preset) {
            var headerPreset = {
                "id":id,
                "name":name,
                "headers":headers,
                "timestamp":preset.timestamp
            };

            pm.indexedDB.headerPresets.updateHeaderPreset(headerPreset, function () {
                collection.add(headerPreset, {merge: true});

                if (!doNotSync) {
                    collection.addToSyncableFilesystem(id);
                }
            });
        });
    },

    updateHeaderPresetSyncStatus: function(id, status) {
        var collection = this;

        var headerPreset = this.get(id);
        headerPreset.set("synced", status);
        collection.add(headerPreset, {merge: true});

        pm.indexedDB.headerPresets.updateHeaderPreset(headerPreset.toJSON(), function () {
        });
    },

    // Remove from local model
    deleteHeaderPreset:function (id, doNotSync) {
        var collection = this;

        pm.indexedDB.headerPresets.deleteHeaderPreset(id, function () {
            collection.remove(id);

            if (!doNotSync) {
                collection.removeFromSyncableFilesystem(id);
            }
        });
    },

    getPresetsForAutoComplete:function () {
        var list = [];
        var presets = this.toJSON();

        for (var i = 0, count = presets.length; i < count; i++) {
            var preset = presets[i];
            var item = {
                "id":preset.id,
                "type":"preset",
                "label":preset.name,
                "category":"Header presets"
            };

            list.push(item);
        }

        list = _.union(list, allowedChromeHeaders);
        list = _.union(list, restrictedChromeHeaders);

        return list;
    },

    refreshAutoCompleteList:function () {
        var presets = this.getPresetsForAutoComplete();
        this.presetsForAutoComplete = presets;
    },

    mergeHeaderPreset: function(preset, doNotSync) {
        var collection = this;

        pm.indexedDB.headerPresets.addHeaderPreset(preset, function(headerPreset) {
            collection.add(headerPreset, {merge: true});

            if (!doNotSync) {
                collection.addToSyncableFilesystem(headerPreset.id);
            }
        });

    },

    mergeHeaderPresets: function(hp) {
        var size = hp.length;
        var collection = this;
        var headerPreset;

        for(var i = 0; i < size; i++) {
            headerPreset = hp[i];
            collection.mergeHeaderPreset(headerPreset);
        }
    }
});
var HeaderPresetsModal = Backbone.View.extend({
    el: $("#modal-header-presets"),

    initialize: function() {
        this.model.on('add', this.render, this);
        this.model.on('remove', this.render, this);
        this.model.on('change', this.render, this);

        var headerPresets = this.model;
        var view = this;

        $("#modal-header-presets").on("shown", function () {
            $(".header-presets-actions-add").focus();
            pm.app.trigger("modalOpen", "#modal-header-presets");
        });

        $("#modal-header-presets").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        $(".header-presets-actions-add").on("click", function () {
            view.showEditor();
        });

        $(".header-presets-actions-back").on("click", function () {
            view.showList();
        });

        $(".header-presets-actions-submit").on("click", function () {
            var id = $('#header-presets-editor-id').val();
            var name = $("#header-presets-editor-name").val();
            var headers = $("#header-presets-keyvaleditor").keyvalueeditor("getValues");

            // TODO Hacky
            if (id === "0") {
                _.bind(headerPresets.addHeaderPreset, headerPresets)(name, headers);
            }
            else {
                _.bind(headerPresets.editHeaderPreset, headerPresets)(id, name, headers);
            }

            view.showList();
        });

        $("#header-presets-list").on("click", ".header-preset-action-edit", function (event) {
            var id = $(event.currentTarget).attr("data-id");
            var preset = _.bind(headerPresets.getHeaderPreset, headerPresets)(id);
            $('#header-presets-editor-name').val(preset.get("name"));
            $('#header-presets-editor-id').val(preset.get("id"));
            $('#header-presets-keyvaleditor').keyvalueeditor('reset', preset.get("headers"));
            view.showEditor();
        });

        $("#header-presets-list").on("click", ".header-preset-action-delete", function (event) {
            var id = $(event.currentTarget).attr("data-id");
            headerPresets.deleteHeaderPreset(id);
        });
    },


    showList:function () {
        $("#header-presets-list-wrapper").css("display", "block");
        $("#header-presets-editor").css("display", "none");
        $("#header-presets-editor-name").attr("value", "");
        $("#header-presets-editor-id").attr("value", 0);
        $('#header-presets-keyvaleditor').keyvalueeditor('reset', []);
        $("#modal-header-presets .modal-footer").css("display", "none");
    },

    showEditor:function () {
        $("#modal-header-presets .modal-footer").css("display", "block");
        $("#header-presets-list-wrapper").css("display", "none");
        $("#header-presets-editor").css("display", "block");
    },

    render: function() {
        $('#header-presets-list tbody').html("");
        $('#header-presets-list tbody').append(Handlebars.templates.header_preset_list({"items":this.model.toJSON()}));
    }
});
var HeaderPresetsRequestEditor = Backbone.View.extend({
    initialize: function() {
        var view = this;

        this.model.on('add', this.render, this);
        this.model.on('remove', this.render, this);

        var model = this.model;

        var params = {
            placeHolderKey:"Key",
            placeHolderValue:"Value",
            deleteButton:'<span class="icon-delete"/>'
        };

        $("#header-presets-keyvaleditor").keyvalueeditor("init", params);

        $("#headers-keyvaleditor-actions-manage-presets").on("click", function () {
            $("#modal-header-presets").modal("show");
        });

        $("#headers-keyvaleditor-actions-add-preset").on("click", ".header-preset-dropdown-item", function() {
            var id = $(this).attr("data-id");
            var preset = model.getHeaderPreset(id);
            var headers = $('#headers-keyvaleditor').keyvalueeditor('getValues');

            var newHeaders = _.union(headers, preset.get("headers"));
            $('#headers-keyvaleditor').keyvalueeditor('reset', newHeaders);
            view.setHeadersInTextarea(newHeaders);
        });
    },

    render: function() {
        $('#headers-keyvaleditor-actions-add-preset ul').html("");
        $('#headers-keyvaleditor-actions-add-preset ul').append(Handlebars.templates.header_preset_dropdown({"items":this.model.toJSON()}));
    },

    //is called when a new header is added in the form
    setHeadersInTextarea: function(headers) {
        var ta = $("textarea#headers-direct");
        var numHeaders = headers.length;
        var str="";
        for(i=0;i<numHeaders;i++) {
            str+=headers[i]["key"]+": "+headers[i]["value"]+"\n";
        }
        ta.val(str);
        $("#headers-textarea-message").html("Enter headers in \"key\":\"value\" format.");
        $("#headers-textarea-message").removeClass('wrong-header');
        //#headers-textarea-message.wrong-header
    }
});
var BasicAuthProcessor = Backbone.Model.extend({
    defaults: function() {
        return {
            "username": null,
            "password": null,
            "request": null
        };
    },

    initialize: function() {
        this.on("change", this.updateDB, this);

        var model = this;

        pm.indexedDB.helpers.getHelper("basic", function(helper) {
            if (helper) {
                model.set(helper);
            }
        });
    },

    process: function() {
        this.processCustomRequest(this.get("request"));
    },

	processCustomRequest: function(request) {
		request.trigger("updateModel");

		var headers = request.get("headers");
		var authHeaderKey = "Authorization";
		var pos = findPosition(headers, "key", authHeaderKey);

		var username = this.get("username");
		var password = this.get("password");

		username = pm.envManager.getCurrentValue(username);
		password = pm.envManager.getCurrentValue(password);

		var rawString = username + ":" + password;
		var encodedString = "Basic " + btoa(rawString);

		request.setHeader(authHeaderKey, encodedString);
		request.trigger("customHeaderUpdate");
	},

    updateDB: function() {
        var helper = {
            id: "basic",
            username: this.get("username"),
            password: this.get("password"),
            timestamp: new Date().getTime()
        };

        pm.indexedDB.helpers.addHelper(helper, function(helper) {
        });
    }
});
var DigestAuthProcessor = Backbone.Model.extend({
    defaults: function() {
        return {
            "id": "",
            "time": 0,
            "algorithm": "",
            "username": "",
            "realm": "",
            "password": "",
            "nonce": "",
            "nonceCount": "",
            "clientNonce": "",
            "opaque": "",
            "qop": "",
            "request": null
        };
    },

    initialize: function() {
        this.on("change", this.updateDB, this);

        var model = this;

        pm.indexedDB.helpers.getHelper("digest", function(helper) {
            if (helper) {
                model.set(helper);
            }
        });
    },

    getHeader: function (request) {
        //var request = this.get("request");
        request.trigger("updateModel");
        
        var algorithm = pm.envManager.getCurrentValue(this.get("algorithm"));

        var username = pm.envManager.getCurrentValue(this.get("username"));
        var realm = pm.envManager.getCurrentValue(this.get("realm"));
        var password = pm.envManager.getCurrentValue(this.get("password"));

        var method = request.get("method");

        var nonce = pm.envManager.getCurrentValue(this.get("nonce"));
        var nonceCount = pm.envManager.getCurrentValue(this.get("nonceCount"));
        var clientNonce = pm.envManager.getCurrentValue(this.get("clientNonce"));

        var opaque = pm.envManager.getCurrentValue(this.get("opaque"));
        var qop = pm.envManager.getCurrentValue(this.get("qop"));
        var body = request.getRequestBodyPreview();        
        var url = request.processUrl(request.get("url"));

        var urlParts = request.splitUrlIntoHostAndPath(url);

        var digestUri = urlParts.path;

        var a1;

        if(algorithm === "MD5-sess") {
            var a0 = CryptoJS.MD5(username + ":" + realm + ":" + password);
            a1 = a0 + ":" + nonce + ":" + clientNonce;
        }
        else {
            a1 = username + ":" + realm + ":" + password;
        }

        var a2;

        if(qop === "auth-int") {
            a2 = method + ":" + digestUri + ":" + body;
        }
        else {
            a2 = method + ":" + digestUri;
        }


        var ha1 = CryptoJS.MD5(a1);
        var ha2 = CryptoJS.MD5(a2);

        var response;

        if(qop === "auth-int" || qop === "auth") {
            response = CryptoJS.MD5(ha1 + ":"
                + nonce + ":"
                + nonceCount + ":"
                + clientNonce + ":"
                + qop + ":"
                + ha2);
        }
        else {
            response = CryptoJS.MD5(ha1 + ":" + nonce + ":" + ha2);
        }

        var headerVal = " ";
        headerVal += "username=\"" + username + "\", ";
        headerVal += "realm=\"" + realm + "\", ";
        headerVal += "nonce=\"" + nonce + "\", ";
        headerVal += "uri=\"" + digestUri + "\", ";

        if(qop === "auth" || qop === "auth-int") {
            headerVal += "qop=" + qop + ", ";
        }

        if(qop === "auth" || qop === "auth-int" || algorithm === "MD5-sess") {
            headerVal += "nc=" + nonceCount + ", ";
            headerVal += "cnonce=\"" + clientNonce + "\", ";
        }

        headerVal += "response=\"" + response + "\", ";
        headerVal += "opaque=\"" + opaque + "\"";

        return headerVal;
    },

	process: function() {
		var request = this.get("request");
		this.processCustomRequest(request);
	},

    processCustomRequest: function (request) {
        var headers = request.get("headers");
        var authHeaderKey = "Authorization";

        //Generate digest header here
        var algorithm = $("#request-helper-digestAuth-realm").val();
        var headerVal = this.getHeader(request);
        headerVal = "Digest" + headerVal;

        request.setHeader(authHeaderKey, headerVal);
        request.trigger("customHeaderUpdate");
    },

    updateDB: function() {
        var h = {
            id: "digest",
            time: new Date().getTime(),
            realm: this.get("realm"),
            username: this.get("username"),
            password: this.get("password"),
            nonce: this.get("nonce"),
            algorithm: this.get("algorithm"),
            nonceCount: this.get("nonceCount"),
            clientNonce: this.get("clientNonce"),
            opaque: this.get("opaque"),
            qop: this.get("qop")
        };

        pm.indexedDB.helpers.addHelper(h, function(h) {
        });
    }
});

var Helpers = Backbone.Model.extend({
    defaults: function() {
        return {
            "activeHelper": "normal",
            "basicAuth": null,
            "digestAuth": null,
            "oAuth1": null,
            "oAuth2": null
        };
    }
});
var OAuth1Processor = Backbone.Model.extend({
    defaults: function() {
        return {
            "id": "oAuth1",
            "time": 0,
            "consumerKey": "",
            "consumerSecret": "",
            "token": "",
            "tokenSecret": "",
            "signatureMethod": "HMAC-SHA1",
            "timestamp": "",
            "nonce": "",
            "version": "",
            "realm": "",
            "header": "",
            "auto": "",
            "encodeSignature": false,
            "includeEmpty": false,
            "request": null
        };
    },

    initialize: function() {
        var model = this;

        this.on("change", this.updateDB, this);

        pm.indexedDB.helpers.getHelper("oAuth1", function(helper) {
            if (helper) {
                model.set(helper);
                model.generateHelper()
            }
        });
    },

    updateDB: function() {
        var helper = {
            id: "oAuth1",
            time: new Date().getTime(),
            consumerKey: this.get("consumerKey"),
            consumerSecret: this.get("consumerSecret"),
            token: this.get("token"),
            tokenSecret: this.get("tokenSecret"),
            signatureMethod: this.get("signatureMethod"),
            timestamp: this.get("timestamp"),
            nonce: this.get("nonce"),
            version: this.get("version"),
            realm: this.get("realm"),
            header: this.get("header"),
            auto: this.get("auto"),
            encodeSignature: this.get("encodeSignature"),
            includeEmpty: this.get("includeEmpty")
        };

        pm.indexedDB.helpers.addHelper(helper, function(helper) {
        });
    },

    generateHelper: function () {
        if(this.get("version") === "") {
            this.set("version", "1.0");
        }

        if(this.get("signatureMethod" === "")) {
            this.set("signatureMethod", "HMAC-SHA1");
        }

        this.set("timestamp", OAuth.timestamp() + "");
        this.set("nonce", OAuth.nonce(6));
    },

    generateSignature: function (request) {
        //Make sure the URL is urlencoded properly
        //Set the URL keyval editor as well. Other get params disappear when you click on URL params again
        //var request = this.get("request");
        var i;
        var url = request.get("url");
        if (url === '') {
            noty(
                {
                    type:'success',
                    text:'Please enter a URL first',
                    layout:'topCenter',
                    timeout:750
                });

            return null;
        }

        var processedUrl;

        var realm = this.get("realm");
        var method = request.get("method");
        var requestBody = request.get("body");

        processedUrl = pm.envManager.getCurrentValue(url).trim();
        processedUrl = ensureProperUrl(processedUrl);

        if (processedUrl.indexOf('?') > 0) {
            processedUrl = processedUrl.split("?")[0];
        }

        var message = {
            action: processedUrl,
            method: method,
            parameters: []
        };

        var signatureParams = [
            {key: "oauth_consumer_key", value: this.get("consumerKey")},
            {key: "oauth_token", value: this.get("token")},
            {key: "oauth_signature_method", value: this.get("signatureMethod")},
            {key: "oauth_timestamp", value: this.get("timestamp")},
            {key: "oauth_nonce", value: this.get("nonce")},
            {key: "oauth_version", value: this.get("version")}
        ];

        for(i = 0; i < signatureParams.length; i++) {
            var param = signatureParams[i];
            param.value = pm.envManager.getCurrentValue(param.value);
            if(param.value!="" || this.get("includeEmpty")===true) {
                message.parameters.push([param.key, param.value]);
            }
        }

        //Get parameters
        var urlParams = request.getUrlParams();

        var bodyParams;

        if (pm.methods.isMethodWithBody(method)) {
            bodyParams = requestBody.get("dataAsObjects");

            if (typeof bodyParams === "undefined") {
                bodyParams = [];
            }
        }
        else {
            bodyParams = [];
        }

        var params = _.union(urlParams, bodyParams);
        var param;
        var existingOAuthParams = _.union(signatureParams, [{key: "oauth_signature", value: ""}]);
        var pos;

        for (i = 0; i < params.length; i++) {
            param = params[i];
            if (param.key) {
                pos = findPosition(existingOAuthParams, "key", param.key);
                if (pos < 0) {
                    param.value = pm.envManager.getCurrentValue(param.value);
                    if(param.value != "" || this.get("includeEmpty")===true) {
                        message.parameters.push([param.key, param.value]);
                    }
                }
            }
        }

        var accessor = {};
        if (this.get("consumerSecret") !=='') {
            accessor.consumerSecret = this.get("consumerSecret");
            accessor.consumerSecret = pm.envManager.getCurrentValue(accessor.consumerSecret);
        }
        if (this.get("tokenSecret") !=='') {
            accessor.tokenSecret = this.get("tokenSecret");
            accessor.tokenSecret = pm.envManager.getCurrentValue(accessor.tokenSecret);
        }

        return OAuth.SignatureMethod.sign(message, accessor);
    },

    removeOAuthKeys: function (params) {
        var i, count;
        var oauthParams = [
            "oauth_consumer_key",
            "oauth_token",
            "oauth_signature_method",
            "oauth_timestamp",
            "oauth_nonce",
            "oauth_version",
            "oauth_signature"
        ];

        var newParams = [];
        var oauthIndexes = [];

        for (i = 0, count = params.length; i < count; i++) {
            var index = _.indexOf(oauthParams, params[i].key);
            if (index < 0) {
                newParams.push(params[i]);
            }
        }

        return newParams;
    },

	process: function() {
		var request = this.get("request");
		this.processCustomRequest(request);
        this.generateHelper();
	},

	processCustomRequest: function (request) {
        request.trigger("updateModel");

        var i, j, count, length;
        var params = [];

        var urlParams = request.getUrlParams();
        var bodyParams = [];

        var url = request.get("url");
        var body = request.get("body");
        var dataMode = body.get("dataMode");
        var method = request.get("method");

        var bodyParams = body.get("dataAsObjects");

        params = params.concat(urlParams);

        if (typeof bodyParams !== "undefined") {
            params = params.concat(bodyParams);
        }       

        params = this.removeOAuthKeys(params);        

        var signatureKey = "oauth_signature";

        var oAuthParams = [];

        var signatureParams = [
            {key: "oauth_consumer_key", value: this.get("consumerKey")},
            {key: "oauth_token", value: this.get("token")},
            {key: "oauth_signature_method", value: this.get("signatureMethod")},
            {key: "oauth_timestamp", value: this.get("timestamp")},
            {key: "oauth_nonce", value: this.get("nonce")},
            {key: "oauth_version", value: this.get("version")}
        ];

        for(i = 0; i < signatureParams.length; i++) {
            var param = signatureParams[i];
            param.value = pm.envManager.getCurrentValue(param.value);
            oAuthParams.push(param);
        }

        //Convert environment values
        for (i = 0, length = params.length; i < length; i++) {
            params[i].value = pm.envManager.getCurrentValue(params[i].value);
        }

        var signature = this.generateSignature(request);

        if (signature === null) {
            return;
        }

        if(this.get("encodeSignature") === true) {
            signature = encodeURIComponent(signature);
        }

        oAuthParams.push({key: signatureKey, value: signature});

        var addToHeader = this.get("header");

        if (addToHeader) {
            var realm = this.get("realm");
            var authHeaderKey = "Authorization";
            var rawString = "OAuth ";
	        if(realm!=null && realm.trim()!=="") {
		        rawString += "realm=\"" + encodeURIComponent(realm) + "\",";
	        }
            var len = oAuthParams.length;

            for (i = 0; i < len; i++) {
	            if(oAuthParams[i].value==null || oAuthParams[i].value.trim()=="") {
		            continue;
	            }
                rawString += encodeURIComponent(oAuthParams[i].key) + "=\"" + encodeURIComponent(oAuthParams[i].value) + "\",";
            }

            rawString = rawString.substring(0, rawString.length - 1);
            request.setHeader(authHeaderKey, rawString);
            request.trigger("customHeaderUpdate");
        } else {
            params = params.concat(oAuthParams);

            if (!request.isMethodWithBody(method)) {
                // console.log("Setting URL params", params);

                request.setUrlParamStringWithOptBlankValRemoval(params, null, true);
                request.trigger("customURLParamUpdate");
            } else {
                if (dataMode === 'urlencoded') {
                    body.loadData("urlencoded", params, true);
                }
                else if (dataMode === 'params') {
                    body.loadData("params", params, true);
                }
                else if (dataMode === 'raw') {
                    request.setUrlParamString(params);
                    request.trigger("customURLParamUpdate");
                }
            }
        }
    }
});

var OAuth2TokenFetcher = Backbone.Model.extend({
    defaults: function() {
        return {
            "id": "oAuth2",
            "authorization_url": "",
            "access_token_url": "",
            "client_id": "",
            "client_secret": "",
            "scope": ""
        };
    },

    initialize: function() {
        var model = this;

        this.on("startAuthorization", this.startAuthorization);

        this.on("change", this.updateDB, this);

        pm.indexedDB.helpers.getHelper("oAuth2", function(helper) {
            if (helper) {
                model.set(helper);
            }
        });
    },

    updateDB: function() {
        var helper = {
            "id": this.get("id"),
            "authorization_url": this.get("authorization_url"),
            "access_token_url": this.get("access_token_url"),
            "client_id": this.get("client_id"),
            "client_secret": this.get("client_secret"),
            "scope": this.get("scope"),
            "timestamp": new Date().getTime()
        };

        pm.indexedDB.helpers.addHelper(helper, function(h) {
        });
    },

    startAuthorization: function(params) {
        var authParams = {
            "authorization_url": pm.envManager.getCurrentValue(_.clone(params["authorization_url"])),
            "access_token_url": pm.envManager.getCurrentValue(_.clone(params["access_token_url"])),
            "client_id": pm.envManager.getCurrentValue(_.clone(params["client_id"])),
            "client_secret": pm.envManager.getCurrentValue(_.clone(params["client_secret"])),
            "scope": pm.envManager.getCurrentValue(_.clone(params["scope"])),
        };

        this.set(params);

        var postmanAuthUrl = pm.webUrl + "/oauth2/start";
        postmanAuthUrl += "?authorization_url=" + encodeURIComponent(authParams["authorization_url"]);
        postmanAuthUrl += "&access_token_url=" + encodeURIComponent(authParams["access_token_url"]);
        postmanAuthUrl += "&client_id=" + encodeURIComponent(authParams["client_id"]);
        postmanAuthUrl += "&client_secret=" + encodeURIComponent(authParams["client_secret"]);
        postmanAuthUrl += "&scope=" + encodeURIComponent(authParams["scope"]);
        // console.log(postmanAuthUrl);

        chrome.identity.launchWebAuthFlow({'url': postmanAuthUrl, 'interactive': true},
            function(redirect_url) {
                if (chrome.runtime.lastError) {
                    pm.mediator.trigger("notifyError", "Could not initiate OAuth 2 flow. Check debug URL.");
                    $("#oauth2-debug-url-group .controls").html('<a class="selectable" target="_blank" href="'+postmanAuthUrl+'">'+postmanAuthUrl+'</a>');
                    $("#oauth2-debug-url-group").show();
                }
                else {
                    var params = getUrlVars(redirect_url);
                    console.log("Show form", params);
                    pm.mediator.trigger("addOAuth2Token", params);
                }
            }
        );
    }
});
var OAuth2Token = Backbone.Model.extend({
	defaults: function() {
		return {
		    "id": "",
		    "name": "OAuth2 Token",
		    "access_token": "",
		    "expires_in": 0,
		    "timestamp": 0
		};
	}

});

var OAuth2Tokens = Backbone.Collection.extend({
	model: OAuth2Token,

	comparator: function(a, b) {
	    var counter;

	    var at = a.get("timestamp");
	    var bt = b.get("timestamp");

	    return at > bt;
	},

	initialize: function() {
		pm.mediator.on("addOAuth2Token", this.addAccessToken, this);
		pm.mediator.on("updateOAuth2Token", this.updateAccessToken, this);
		this.loadAllAccessTokens();
	},

	loadAllAccessTokens: function() {
		var collection = this;

		pm.indexedDB.oAuth2AccessTokens.getAllAccessTokens(function(accessTokens) {
			collection.add(accessTokens, {merge: true});
			collection.trigger("change");
		});
	},

	addAccessToken: function(tokenData) {
		var collection = this;

		var id = guid();
		var accessToken = {
			"id": guid(),
			"timestamp": new Date().getTime(),
			"data": tokenData
		};

		if (tokenData.hasOwnProperty("access_token")) {
			accessToken.access_token = tokenData.access_token;
		}

		pm.indexedDB.oAuth2AccessTokens.addAccessToken(accessToken, function(a) {
			var at = new OAuth2Token(accessToken);
			collection.add(at, {merge: true});
			// console.log("OAuth2Tokens, Calling addedOAuth2Token");
			pm.mediator.trigger("addedOAuth2Token", a);
		});
	},

	updateAccessToken: function(params) {
		var token = this.get(params.id);
		token.set("name", params.name);
		pm.indexedDB.oAuth2AccessTokens.updateAccessToken(token.toJSON(), function(a) {
			// console.log("Updated access token");
			pm.mediator.trigger("updatedOAuth2Token", a.id);
		});
	},

	deleteAccessToken: function(id) {
		// console.log("Removing access token");
		this.remove(id);
		pm.indexedDB.oAuth2AccessTokens.deleteAccessToken(id, function() {
			// console.log("Deleted token");
		});
	},

	addAccessTokenToRequest: function(id, type) {
		var token = this.get(id);
		var data = token.get("data");
		var index = arrayObjectIndexOf(data, "access_token", "key");

		if (type === "url") {
			var accessTokenParam = {
				key: "access_token",
				value: data[index].value
			};
			pm.mediator.trigger("addRequestURLParam", accessTokenParam);
		}
		else if (type === "header") {
			var accessTokenHeader = {
				key: "Authorization",
				value: "Bearer " + data[index].value
			};
			pm.mediator.trigger("addRequestHeader", accessTokenHeader);
			// TODO Not implemented yet
		}

	}
});
var BasicAuthForm = Backbone.View.extend({
    initialize: function() {
        this.model.on("change:username", this.render, this);
        this.model.on("change:password", this.render, this);

        var view = this;
        var model = this.model;

        $('#request-helper-basicAuth .request-helper-submit').on("click", function () {
            $('#request-helpers').css("display", "none");
            var username = $('#request-helper-basicAuth-username').val();
            var password = $('#request-helper-basicAuth-password').val();

            model.set({"username": username, "password": password});
            model.process();
        });

        $('#request-helper-basicAuth input').on("blur", function () {            
            view.save();
        });

        $('#request-helper-basicAuth .request-helper-clear').on("click", function () {
            view.clearFields();
        });
    },

    clearFields: function() {
        this.model.set({"username": "", "password": ""});
        $('#request-helper-basicAuth-username').val("");
        $('#request-helper-basicAuth-password').val("");
    },

    save: function() {
        var username = $('#request-helper-basicAuth-username').val();
        var password = $('#request-helper-basicAuth-password').val();

        this.model.set({"username": username, "password": password});
    },

    render: function() {
        $('#request-helper-basicAuth-username').val(this.model.get("username"));
        $('#request-helper-basicAuth-password').val(this.model.get("password"));
    }
});

var DigestAuthForm = Backbone.View.extend({
    initialize: function() {
        this.model.on("change", this.render, this);

        var view = this;
        var model = this.model;

        $('#request-helper-digestAuth .request-helper-submit').on("click", function () {
            $('#request-helpers').css("display", "none");
            var helper = {
                id: "digest",
                time: new Date().getTime(),
                realm: $("#request-helper-digestAuth-realm").val(),
                username: $("#request-helper-digestAuth-username").val(),
                password: $("#request-helper-digestAuth-password").val(),
                nonce: $("#request-helper-digestAuth-nonce").val(),
                algorithm: $("#request-helper-digestAuth-algorithm").val(),
                nonceCount: $("#request-helper-digestAuth-nonceCount").val(),
                clientNonce: $("#request-helper-digestAuth-clientNonce").val(),
                opaque: $("#request-helper-digestAuth-opaque").val(),
                qop: $("#request-helper-digestAuth-qop").val()
            };

            model.set(helper);
            model.process();
        });

        $('#request-helper-digestAuth .request-helper-clear').on("click", function () {
            view.clearFields();
        });

        $('#request-helper-digestAuth input').on("blur", function () {            
            view.save();
        });
    },

    clearFields: function () {
        $("#request-helper-digestAuth-realm").val("");
        $("#request-helper-digestAuth-username").val("");
        $("#request-helper-digestAuth-password").val("");
        $("#request-helper-digestAuth-nonce").val("");
        $("#request-helper-digestAuth-algorithm").val("");
        $("#request-helper-digestAuth-nonceCount").val("");
        $("#request-helper-digestAuth-clientNonce").val("");
        $("#request-helper-digestAuth-opaque").val("");
        $("#request-helper-digestAuth-qop").val("");

        //set values in the model
        var helper = {
            id: "digest",
            time: new Date().getTime(),
            realm: "",
            username: "",
            password: "",
            nonce: "",
            algorithm: "",
            nonceCount: "",
            clientNonce: "",
            opaque: "",
            qop: ""
        };

        this.model.set(helper);
    },

    save: function() {
        var helper = {
            id: "digest",
            time: new Date().getTime(),
            realm: $("#request-helper-digestAuth-realm").val(),
            username: $("#request-helper-digestAuth-username").val(),
            password: $("#request-helper-digestAuth-password").val(),
            nonce: $("#request-helper-digestAuth-nonce").val(),
            algorithm: $("#request-helper-digestAuth-algorithm").val(),
            nonceCount: $("#request-helper-digestAuth-nonceCount").val(),
            clientNonce: $("#request-helper-digestAuth-clientNonce").val(),
            opaque: $("#request-helper-digestAuth-opaque").val(),
            qop: $("#request-helper-digestAuth-qop").val()
        };

        //Replace this with the call to the model
        this.model.set(helper);
    },

    render: function() {
        $("#request-helper-digestAuth-realm").val(this.model.get("realm"));
        $("#request-helper-digestAuth-username").val(this.model.get("username"));
        $("#request-helper-digestAuth-algorithm").val(this.model.get("algorithm"));
        $("#request-helper-digestAuth-password").val(this.model.get("password"));
        $("#request-helper-digestAuth-nonce").val(this.model.get("nonce"));
        $("#request-helper-digestAuth-nonceCount").val(this.model.get("nonceCount"));
        $("#request-helper-digestAuth-clientNonce").val(this.model.get("clientNonce"));
        $("#request-helper-digestAuth-opaque").val(this.model.get("opaque"));
        $("#request-helper-digestAuth-qop").val(this.model.get("qop"));
    }
});
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
var OAuth1Form = Backbone.View.extend({
    initialize: function() {
        this.model.on("change", this.render, this);

        var view = this;
        var model = this.model;

        $('#request-helper-oAuth1 .request-helper-submit').on("click", function () {
            $('#request-helpers').css("display", "none");
            view.save();
            model.process();
        });

        $('#request-helper-oAuth1 input').on("blur", function () {
            // console.log("Save helper");
            view.save();
        });

        $('#request-helper-oAuth1 .request-helper-clear').on("click", function () {
            view.clearFields();
        });

        $('#request-helper-oauth1-auto').change(function () {
            var isAutoEnabled = $('#request-helper-oauth1-auto').attr('checked') ? true : false;
            view.save();
            model.set("auto", isAutoEnabled);

            if (!isAutoEnabled) {
                $('#request-helper-oAuth1 .request-helper-submit').css("display", "inline-block");
            }
            else {
                $('#request-helper-oAuth1 .request-helper-submit').css("display", "none");
            }
        });

        $('#request-helper-oauth1-header').click(function () {
            view.save();
        });
    },

    clearFields: function() {
        $("#request-helper-oauth1-consumerKey").val("");
        $("#request-helper-oauth1-consumerSecret").val("");
        $("#request-helper-oauth1-token").val("");
        $("#request-helper-oauth1-tokenSecret").val("");
        $("#request-helper-oauth1-signatureMethod").val("HMAC-SHA1");
        $("#request-helper-oauth1-timestamp").val("");
        $("#request-helper-oauth1-nonce").val("");
        $("#request-helper-oauth1-version").val("");
        $("#request-helper-oauth1-realm").val("");
        $("#request-helper-oauth1-header").prop("checked", false);
        $("#request-helper-oauth1-auto").prop("checked", false);
        $("#request-helper-oauth1-empty-params").prop("checked", false);
        $("#request-helper-oauth1-encode-signature").prop("checked", false);

        var helper = {
            id: "oAuth1",
            time: new Date().getTime(),
            consumerKey: "",
            consumerSecret: "",
            token: "",
            tokenSecret: "",
            signatureMethod: "HMAC-SHA1",
            timestamp: "",
            nonce: "",
            version: "",
            realm: "",
            header: false,
            auto: false,
            encodeSignature: false,
            includeEmpty: false
        };

        this.model.set(helper);
    },

    save: function() {
        var helper = {
            id: "oAuth1",
            time: new Date().getTime(),
            consumerKey: $("#request-helper-oauth1-consumerKey").val(),
            consumerSecret: $("#request-helper-oauth1-consumerSecret").val(),
            token: $("#request-helper-oauth1-token").val(),
            tokenSecret: $("#request-helper-oauth1-tokenSecret").val(),
            signatureMethod: $("#request-helper-oauth1-signatureMethod").val(),
            timestamp: $("#request-helper-oauth1-timestamp").val(),
            nonce: $("#request-helper-oauth1-nonce").val(),
            version: $("#request-helper-oauth1-version").val(),
            realm: $("#request-helper-oauth1-realm").val(),
            header: $("#request-helper-oauth1-header").prop("checked"),
            auto: $("#request-helper-oauth1-auto").prop("checked"),
            encodeSignature: $("#request-helper-oauth1-encode-signature").prop("checked"),
            includeEmpty: $("#request-helper-oauth1-empty-params").prop("checked")
        };

        this.model.set(helper);
    },

    render: function() {
        $("#request-helper-oauth1-consumerKey").val(this.model.get("consumerKey"));
        $("#request-helper-oauth1-consumerSecret").val(this.model.get("consumerSecret"));
        $("#request-helper-oauth1-token").val(this.model.get("token"));
        $("#request-helper-oauth1-tokenSecret").val(this.model.get("tokenSecret"));
        $("#request-helper-oauth1-signatureMethod").val(this.model.get("signatureMethod"));
        $("#request-helper-oauth1-timestamp").val(this.model.get("timestamp"));
        $("#request-helper-oauth1-nonce").val(this.model.get("nonce"));
        $("#request-helper-oauth1-version").val(this.model.get("version"));
        $("#request-helper-oauth1-realm").val(this.model.get("realm"));

        $("#request-helper-oauth1-header").prop("checked", this.model.get("header"));
        $("#request-helper-oauth1-auto").prop("checked", this.model.get("auto"));
        $("#request-helper-oauth1-encode-signature").prop("checked", this.model.get("encodeSignature"));
        $("#request-helper-oauth1-empty-params").prop("checked", this.model.get("includeEmpty"));

        if (this.model.get("auto")) {
            $('#request-helper-oAuth1 .request-helper-submit').css("display", "none");
        }
        else {
            $('#request-helper-oAuth1 .request-helper-submit').css("display", "inline-block");
        }
    }
});

var OAuth2Form = Backbone.View.extend({
    initialize: function() {
        this.model.on("change", this.render, this);

        var view = this;
        var model = this.model;

        $("#request-helper-oauth2-authorization-url").autocomplete({
            source: oAuth2AuthorizationUrls,
            delay: 50
        });

        $("#request-helper-oauth2-access-token-url").autocomplete({
            source: oAuth2TokenUrls,
            delay: 50
        });

        $("#request-helper-oAuth2 .request-helper-back").on("click", function () {
            view.save();
            view.showAccessTokens();
        });

        $('#request-helper-oAuth2 .request-helper-submit').on("click", function () {
            var params = {
                "authorization_url": $("#request-helper-oauth2-authorization-url").val(),
                "access_token_url": $("#request-helper-oauth2-access-token-url").val(),
                "client_id": $("#request-helper-oauth2-client-id").val(),
                "client_secret": $("#request-helper-oauth2-client-secret").val(),
                "scope": $("#request-helper-oauth2-scope").val()
            };

            view.save();
            $("#oauth2-debug-url-group").hide();
            model.trigger("startAuthorization", params);
        });

        $('#request-helper-oAuth2 .request-helper-save').on("click", function () {
            var name = $("#request-helper-oauth2-name").val();
            var id = $(this).attr("data-id");

            var params = {
                "id": id,
                "name": name
            };

            pm.mediator.trigger("updateOAuth2Token", params);
        });

        pm.mediator.on("addedOAuth2Token", this.onAddedOAuth2Token, this);
    },

    onAddedOAuth2Token: function(params) {
        // console.log(params);
        $('#request-helper-oAuth2-access-token-data').html("");
        $('#request-helper-oAuth2-access-token-data').append(Handlebars.templates.environment_quicklook({"items": params.data}));
        $("#request-helper-oAuth2 .request-helper-save").attr("data-id", params.id);
        this.showSaveForm();
    },

    showSaveForm: function() {
        $("#request-helper-oAuth2-access-tokens-container").css("display", "none");
        $("#request-helper-oAuth2-access-token-form").css("display", "none");
        $("#request-helper-oAuth2-access-token-save-form").css("display", "block");
    },

    showAccessTokens: function() {
        $("#request-helper-oAuth2-access-tokens-container").css("display", "block");
        $("#request-helper-oAuth2-access-token-save-form").css("display", "none");
        $("#request-helper-oAuth2-access-token-form").css("display", "none");
    },

    save: function() {
        var helper = {
            "id": "oAuth2",
            "authorization_url": $("#request-helper-oauth2-authorization-url").val(),
            "access_token_url": $("#request-helper-oauth2-access-token-url").val(),
            "client_id": $("#request-helper-oauth2-client-id").val(),
            "client_secret": $("#request-helper-oauth2-client-secret").val(),
            "scope": $("#request-helper-oauth2-scope").val(),
            "time": new Date().getTime()
        };

        // console.log("Save", helper);

        this.model.set(helper);
    },

    render: function() {
        $("#request-helper-oauth2-authorization-url").val(this.model.get("authorization_url"));
        $("#request-helper-oauth2-access-token-url").val(this.model.get("access_token_url"));
        $("#request-helper-oauth2-client-id").val(this.model.get("client_id"));
        $("#request-helper-oauth2-client-secret").val(this.model.get("client_secret"));
        $("#request-helper-oauth2-scope").val(this.model.get("scope"));
        $("#oauth2-debug-url-group").hide();
    }
});

var OAuth2Manager = Backbone.View.extend({
	initialize: function() {
		var model = this;
		var view = this;

		var oAuth2Form = new OAuth2Form({model: this.model});

		pm.mediator.on("showAccessTokens", this.showAccessTokens, this);
		pm.mediator.on("updatedOAuth2Token", this.showAccessTokens, this);

		// Click event to load access_token
		// Delete event
		$("#request-helper-oAuth2-access-token-get").on("click", function () {
		    view.showAccessTokenForm();
		});
	},

	showAccessTokenForm: function() {
	    $("#request-helper-oAuth2-access-tokens-container").css("display", "none");
	    $("#request-helper-oAuth2-access-token-save-form").css("display", "none");
	    $("#request-helper-oAuth2-access-token-form").css("display", "block");
	},

	showAccessTokens: function() {
	    $("#request-helper-oAuth2-access-tokens-container").css("display", "block");
	    $("#request-helper-oAuth2-access-token-save-form").css("display", "none");
	    $("#request-helper-oAuth2-access-token-form").css("display", "none");
	},

	render: function() {
		// Render list event
	}

});
var OAuth2TokenList = Backbone.View.extend({
	initialize: function() {
		var model = this.model;

		model.on("add", this.render, this);
		model.on("remove", this.render, this);
		model.on("change", this.render, this);

		// Click event to load access_token
		// Delete event

		$("#request-helper-oAuth2-access-tokens").on("mouseenter", ".oauth2-access-token-container", function() {
			var actionsEl = $('.oauth2-access-token-actions', this);
			actionsEl.css('display', 'block');
		});

		$("#request-helper-oAuth2-access-tokens").on("mouseleave", ".oauth2-access-token-container", function() {
		    var actionsEl = $('.oauth2-access-token-actions', this);
		    actionsEl.css('display', 'none');
		});

		$("#request-helper-oAuth2-access-tokens").on("click", ".oauth2-access-token-actions-load", function() {
		    var id = $(this).attr("data-id");
		    var location = $("#request-helper-oAuth2-options input[name='oAuth2-token-location']:checked").val();
		    model.addAccessTokenToRequest(id, location);
		});

		$("#request-helper-oAuth2-access-tokens").on("click", ".oauth2-access-token-actions-delete", function() {
		    var id = $(this).attr("data-id");
		    model.deleteAccessToken(id);
		});
	},

	render: function() {
		var tokens = this.model.toJSON();
		$("#request-helper-oAuth2-access-tokens").html("");
		$("#request-helper-oAuth2-access-tokens").append(Handlebars.templates.oauth2_access_tokens({"items": tokens}));
	}

});
var HistoryRequest = Backbone.Model.extend({
    defaults: function() {
        return {
        };
    }
});

var History = Backbone.Collection.extend({
    model: HistoryRequest,

    initialize: function() {
        var model = this;

        pm.indexedDB.getAllRequestItems(function (historyRequests) {
            var outAr = [];
            var count = historyRequests.length;

            if (count === 0) {
                historyRequests = [];
            }
            else {
                for (var i = 0; i < count; i++) {
                    var r = historyRequests[i];
                    pm.mediator.trigger("addToURLCache", r.url);

                    var request = r;
                    request.position = "top";

                    outAr.push(request);
                }
            }

            model.add(outAr, {merge: true});
        });
    },

    requestExists:function (request) {
        var index = -1;
        var method = request.method.toLowerCase();

        if (isMethodWithBody(method)) {
            return -1;
        }

        var requests = this.toJSON();
        var len = requests.length;

        for (var i = 0; i < len; i++) {
            var r = requests[i];
            if (r.url.length !== request.url.length ||
                r.headers.length !== request.headers.length ||
                r.method !== request.method) {
                index = -1;
            }
            else {
                if (r.url === request.url) {
                    if (r.headers === request.headers) {
                        index = i;
                    }
                }
            }

            if (index >= 0) {
                break;
            }
        }

        return index;
    },

    loadRequest:function (id) {
        var request = this.get(id).toJSON();
        // console.log("Load request: ", request);
        pm.mediator.trigger("loadRequest", request, false, false);
        this.trigger("loadRequest");
    },

    addRequestFromJSON: function(requestJSON) {
        request = JSON.parse(requestJSON);
        this.addRequest(request.url, request.method, request.headers, request.data, request.dataMode, request.preRequestScript, request.currentHelper, request.helperAttributes);
    },

    addRequestFromObject: function(request) {
        this.addRequest(request.url, request.method, request.headers, request.data, request.dataMode, request.preRequestScript, request.currentHelper, request.helperAttributes);
    },

    addRequest:function (url, method, headers, data, dataMode, tests, prScript, pathVariables, currentHelper, helperAttributes) {
        var id = guid();
        var maxHistoryCount = pm.settings.getSetting("historyCount");
        var requests = this.toJSON();
        var requestsCount = requests.length;

        var saveHelperToRequest = $("#request-helper-"+currentHelper+"-saveHelper").is(":checked");
        if(saveHelperToRequest===false) {
            currentHelper = "normal";
            helperAttributes = {};
        }

        var collection = this;

        if(maxHistoryCount > 0) {
            if (requestsCount >= maxHistoryCount) {

                //Delete the last request
                var lastRequest = requests[0];
                this.deleteRequest(lastRequest.id);
            }
        }

        var historyRequest = {
            "id":id,
            "url":url.toString(),
            "method":method.toString(),
            "headers":headers.toString(),
            "data":data,
            "dataMode":dataMode.toString(),
            "tests": tests,
            "preRequestScript": prScript,
            "currentHelper": currentHelper,
            "helperAttributes": helperAttributes,
            "pathVariables": pathVariables,
            "timestamp":new Date().getTime(),
            "version": 2
        };

        // console.log("History request: ", historyRequest);

        var index = this.requestExists(historyRequest);

        if (index >= 0) {
            var deletedId = requests[index].id;
            this.deleteRequest(deletedId);
        }

        pm.indexedDB.addRequest(historyRequest, function (request) {
            pm.mediator.trigger("addToURLCache", request.url);
            var historyRequestModel = new HistoryRequest(request);
            historyRequestModel.set("position", "top");
            collection.add(historyRequestModel);
            collection.trigger("historyRequestAdded");
        });
    },


    deleteRequest:function (id) {
        var collection = this;

        pm.indexedDB.deleteRequest(id, function (request_id) {
            collection.remove(request_id);
        });
    },

    clear:function () {
        var collection = this;
        pm.indexedDB.deleteHistory(function () {
            collection.reset([]);
        });
    },

    filter: function(term) {
        var requests = this.toJSON();

        var count = requests.length;
        var filteredItems = [];
        for (var i = 0; i < count; i++) {
            var id = requests[i].id;
            var url = requests[i].url;

            var filteredItem = {
                id: id,
                url: url,
                toShow: false
            };
            url = url.toLowerCase();
            if (url.indexOf(term) >= 0) {
                filteredItem.toShow = true;
            }
            else {
                filteredItem.toShow = false;
            }

            filteredItems.push(filteredItem);
        }

        this.trigger("filter", filteredItems);

        return filteredItems;
    },

    revert: function() {
        this.trigger("revertFilter");
    }
});

var HistorySidebar = Backbone.View.extend({
    initialize: function() {
        var model = this.model;


        //Event: Load all
        //Event: Add request
        this.model.on("reset", this.render, this);
        this.model.on("add", this.addOne, this);
        this.model.on("remove", this.removeOne, this);

        this.model.on("filter", this.onFilter, this);
        this.model.on("revertFilter", this.onRevertFilter, this);
        //Event: Delete request


        $('.history-actions-delete').click(function () {
            model.clear();
        });

        $('#history-items').on("click", ".request-actions-delete", function () {
            var nextLi = $(this).parent().parent().next();
            var request_id = $(this).attr('data-request-id');
            model.deleteRequest(request_id);
            nextLi.addClass("hover");
            nextLi.children(".request-actions").show();
        });

        $('#history-items').on("click", ".request", function () {
            var request_id = $(this).attr('data-request-id');
            $('.sidebar-history-request').removeClass('sidebar-history-request-active');
            $(this).parent().addClass('sidebar-history-request-active');
            model.loadRequest(request_id);
        });

        $('#history-items').on("mouseenter", ".sidebar-request", function () {
            var actionsEl = jQuery('.request-actions', this);
            actionsEl.css('display', 'block');
        });

        $('#history-items').on("mouseleave", ".sidebar-request", function () {
            var actionsEl = jQuery('.request-actions', this);
            actionsEl.css('display', 'none');
        });

        $('#history-items').on("mouseenter", ".sidebar-history-request",function() {
            $(this).addClass('hover');
        });

        $('#history-items').on("mouseleave", ".sidebar-history-request",function() {
            $(this).removeClass('hover');
        });

        var clearHistoryHandler = function () {
            if(pm.app.isModalOpen()) {
                return;
            }

            pm.history.clear();
            return false;
        };

        $(document).bind('keydown', 'alt+c', clearHistoryHandler);

        this.showEmptyMessage();
    },

    addOne: function(model, collection) {
        var request = model.toJSON();

        var displayUrl = _.clone(request.url);
        var method = request.method;
        var id = request.id;
        var position = request.position;

        if (displayUrl.length > 80) {
            displayUrl = displayUrl.substring(0, 80) + "...";
        }

        displayUrl = limitStringLineWidth(displayUrl, 40);

        var request = {
            url:displayUrl,
            method:method,
            id:id,
            position:position
        };

        if (position === "top") {
            $('#history-items').prepend(Handlebars.templates.item_history_sidebar_request(request));
        }
        else {
            $('#history-items').append(Handlebars.templates.item_history_sidebar_request(request));
        }

        this.hideEmptyMessage();
    },

    showEmptyMessage:function () {
        $('#history-items').append(Handlebars.templates.message_no_history());
    },

    hideEmptyMessage:function () {
        $('#history-items .empty-message').remove();
    },

    removeOne:function (model, collection) {
        var historyRequest = model.toJSON();
        var id = historyRequest.id;

        $("#sidebar-request-" + model.id).remove();

        var requests = collection.toJSON();

        if (requests.length === 0) {
            this.showEmptyMessage();
        }
        else {
            this.hideEmptyMessage();
        }
    },

    render: function() {
        var requests = this.model.toJSON();

        if (requests.length === 0) {
            $('#history-items').html("");
            this.showEmptyMessage();
        }
        else {
            this.hideEmptyMessage();
            $('#history-items').append(Handlebars.templates.history_sidebar_requests({"items":requests}));
            $('#history-items').fadeIn();
        }
    },

    onFilter: function(filteredHistoryItems) {
        var count = filteredHistoryItems.length;
        for(var i = 0; i < count; i++) {
            var item = filteredHistoryItems[i];
            var id = "#sidebar-request-" + item.id;

            if(item.toShow) {
                $(id).css("display", "block");
            }
            else {
                $(id).css("display", "none");
            }
        }
    },

    onRevertFilter: function() {
        $("#history-items li").css("display", "block");
    }
});
var CurlCapture = Backbone.Model.extend({
	defaults: function() {
		return {
		}
	},

	initialize: function() {
		pm.mediator.on("onMessageExternal", this.onMessageExternal, this);
	},

	onMessageExternal: function(request, sender, sendResponse) {
		if(request.curlImportMessage) {
			var curlCommandToImport = request.curlImportMessage.curlText;
			this.importCurl(curlCommandToImport);
		}
	},

	importCurl: function(rawText) {
		var fileFormat = pm.collections.guessFileFormat(rawText);
		if(fileFormat===0) {
			pm.mediator.trigger("failedCollectionImport", "format not recognized");
			return;
		}
		pm.collections.importData(rawText, fileFormat);
	}

});
var InterceptorCapture = Backbone.Model.extend({
	defaults: function() {
		return {
		}
	},

	initialize: function() {
		pm.mediator.on("onMessageExternal", this.onMessageExternal, this);
	},

	onMessageExternal: function(request, sender, sendResponse) {
		if(request.postmanMessage) {
			var useInterceptor = pm.settings.getSetting("useInterceptor");
			if (request.postmanMessage.type === "capturedRequest" && useInterceptor===true) {
				var requestObject = this.getRequestJSON(request.postmanMessage.request);
				pm.history.addRequestFromObject(requestObject);
				sendResponse({"success": true});
			}
		}
	},

	isUrlEncodedHeaderPresent: function(headers) {		
		for(var i = 0; i < headers.length; i++) {
			if (headers[i].name.toLowerCase() === "content-type") {
				if (headers[i].value.search("urlencoded") >= 0) {
					return true;
				}
			}
		}

		return false;
	},

	getFormData: function(data) {		
		var formData = [];
		for(var key in data) {
			if (data.hasOwnProperty(key)) {
				formData.push({
					"key": key,
					"value": data[key][0]
				})
			}
		}

		return formData;
	},

	getUrlEncodedData: function(data) {
		var urlencodedData = [];
		var i;
		for(var key in data) {
			if (data.hasOwnProperty(key)) {
				var itemLength = data[key].length;
				for(i=0;i<itemLength;i++) {
					urlencodedData.push({
						"key": key,
						"value": data[key][i]
					});
				}
			}
		}

		return urlencodedData;
	},

	getRawData: function(data) {
		return arrayBufferToString(ArrayBufferEncoderDecoder.decode(data));
	},

	getRequestJSON: function(request) {
		var requestObject = {
			"url": request.url,
			"method": request.method,
			"headers": packHeaders(request.requestHeaders),
			"data": null,
			"dataMode": "params",
            "preRequestScript": request.preRequestScript
		};

		if (isMethodWithBody(request.method)) {
			if (request.requestBodyType === "formData") {
				if (this.isUrlEncodedHeaderPresent(request.requestHeaders)) {
					requestObject.dataMode = "urlencoded";
					requestObject.data = this.getUrlEncodedData(request.requestBody.formData);						
				}
				else {					
					requestObject.dataMode = "params";
					requestObject.data = this.getFormData(request.requestBody.formData);
				}

			}
			else {
				requestObject.dataMode = "raw";
				requestObject.data = this.getRawData(
					(request.requestBody)?
						((request.requestBody.rawData)?request.requestBody.rawData:""):
						""
				);
			}
		}

		return requestObject;
	}

});
var InterceptorIntro = Backbone.View.extend({
	initialize: function() {
		var model = this.model;
		var view = this;

		$("#modal-interceptor-intro").on("shown", function () {
            $("#interceptor-intro-name").focus();
            pm.app.trigger("modalOpen", "#modal-interceptor-intro");
        });

        $("#modal-interceptor-intro").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        $("#modal-interceptor-install").on("click", function() {
        	view.triggerInstall();
        });
	},

	triggerInstall: function() {
		console.log("Trigger install");
		var url = "https://chrome.google.com/webstore/detail/" + postman_interceptor_id;
		window.open(url);
	}
});
var InterceptorStatus = Backbone.View.extend({
	initialize: function() {
		var model = this.model;
		var view = this;

		$(".interceptor-status-trigger").on("click", function() {
			view.toggleInterceptor();
		});

		$("#postman-interceptor-status").on("click", function() {
			view.toggleInterceptor();
		});

		pm.mediator.on("enableInterceptor", this.enableInterceptor, this);

		this.setIcon();
	},

	enableInterceptor: function() {
		pm.settings.setSetting("useInterceptor", true);
		this.setIcon();
	},

	setIcon: function() {		
		var status = pm.settings.getSetting("useInterceptor");

		if (status === false) {
			$("#postman-interceptor-status img").attr("src", "img/v2/interceptor.png");
		}
		else {
			$("#postman-interceptor-status img").attr("src", "img/v2/interceptor_connected.png");
		}
	},

	toggleInterceptor: function() {
		var foundExtension = false;
		var view = this;
		var message = {
			"postmanMessage": {
				"type": "detectExtension"
			}
		}

		//allow disabling the interceptor without it being installed
		var status = pm.settings.getSetting("useInterceptor");
		if (status === true) {
			pm.settings.setSetting("useInterceptor", false);
			view.setIcon();
		}
		else {
			chrome.runtime.sendMessage(postman_interceptor_id, message, function (extResponse) {
				if (typeof extResponse === "undefined") {
					foundExtension = false;
					console.log("show modal");
					$("#modal-interceptor-intro").modal("show");
				}
				else {
					foundExtension = true;
					var status = pm.settings.getSetting("useInterceptor");

					if (status === true) {
						pm.settings.setSetting("useInterceptor", false);
					}
					else {
						pm.settings.setSetting("useInterceptor", true);
					}

					view.setIcon();
				}
			});
		}
	}
});
var PostmanAPI = Backbone.Model.extend({
	defaults: function() {
		return {
			"web_url": pm.webUrl
		}
	},

	initialize: function() {
		// console.log("This is going to be the awesome postman API!");
	},

	isTokenValid: function() {
		var user = pm.user;

		var expiresIn = user.get("expires_in");
		var loggedInAt = user.get("logged_in_at");

		var now = new Date().getTime();

		if (loggedInAt + expiresIn > now) {
			return true;
		}
		else {
			return false;
		}
	},

	exchangeRefreshToken: function(successCallback) {
		// console.log("Trying to exchangeRefreshToken");

		var postUrl = pm.webUrl + "/client-oauth2-refresh";
		postUrl += "?user_id=" + pm.user.get("id");

		var parameters = {
			"grant_type": "refresh_token",
			"refresh_token": pm.user.get("refresh_token")
		};

		$.ajax({
			type: 'POST',
			url: postUrl,
			data: parameters,
			success: function(data) {
				// console.log("Received refresh_token", data);

				if (data.hasOwnProperty("result")) {
					var result = data.hasOwnProperty("result");
					if (!result) {
						pm.mediator.trigger("invalidRefreshToken");
					}
				}
				else if (data.hasOwnProperty("access_token")) {
					pm.user.setAccessToken(data);
					if (successCallback) {
						successCallback();
					}
				}
			}
		})
	},

	logoutUser: function(userId, accessToken, successCallback) {
		var postUrl = pm.webUrl + '/client-logout';
	    postUrl += "?user_id=" + userId;
	    postUrl += "&access_token=" + accessToken;

		$.ajax({
			type: 'POST',
			url: postUrl,
			success: function() {
				if (successCallback) {
					successCallback();
				}
			}
		})
	},

	executeAuthenticatedRequest: function(func) {
		var isTokenValid = this.isTokenValid();

		if (isTokenValid) {
			func();
		}
		else {
			this.exchangeRefreshToken(function() {
				func();
			});
		}
	},

	uploadCollection: function(collectionData, isPublic, successCallback) {
		var uploadUrl = pm.webUrl + '/collections?is_public=' + isPublic;

		if (pm.user.isLoggedIn()) {
		    this.executeAuthenticatedRequest(function() {
		    	uploadUrl += "&user_id=" + pm.user.get("id");
		    	uploadUrl += "&access_token=" + pm.user.get("access_token");

		    	$.ajax({
		    	    type:'POST',
		    	    url:uploadUrl,
		    	    data:collectionData,
		    	    success:function (data) {
		    	    	if (successCallback) {
		    	    		successCallback(data);
		    	    	}
		    	    }
		    	});
		    });
		}
		else {
			$.ajax({
			    type:'POST',
			    url:uploadUrl,
			    data:collectionData,
			    success:function (data) {
			    	if (successCallback) {
			    		successCallback(data);
			    	}
			    }
			});
		}
	},

	getDirectoryCollections: function(startId, count, order, successCallback) {
		var getUrl = pm.webUrl + "/collections";
		getUrl += "?user_id=" + pm.user.get("id");
		getUrl += "&access_token=" + pm.user.get("access_token");
		getUrl += "&start_id=" + startId;
		getUrl += "&count=" + count;
		getUrl += "&order=" + order;

		$.ajax({
		    type:'GET',
		    url:getUrl,
		    success:function (collections) {
		    	if (successCallback) {
		    		successCallback(collections);
		    	}
		    }
		});
	},

	downloadDirectoryCollection: function(link_id, successCallback) {
	    var getUrl = pm.webUrl + "/collections/" + link_id;
	    getUrl += "?user_id=" + pm.user.get("id");
	    getUrl += "&access_token=" + pm.user.get("access_token");

	    $.get(getUrl, function (data) {
	    	if (successCallback) {
	    		successCallback(data);
	    	}
	    });
	},

	getUserPurchases: function(successCallback) {
		this.executeAuthenticatedRequest(function() {
			var user = pm.user;

			var getUrl = pm.webUrl + "/users/" + user.get("id") + "/purchases";
			getUrl += "?user_id=" + user.get("id");
			getUrl += "&access_token=" + user.get("access_token");

			$.ajax({
			    type:'GET',
			    url:getUrl,
			    success:function (data) {
			    	if (successCallback) {
			    		successCallback(data);
			    	}
			    }
			});
		});
	},

	getUserCollections: function(successCallback) {
		this.executeAuthenticatedRequest(function() {
			var user = pm.user;

			var getUrl = pm.webUrl + "/users/" + user.get("id") + "/collections";
			getUrl += "?user_id=" + user.get("id");
			getUrl += "&access_token=" + user.get("access_token");

			$.ajax({
			    type:'GET',
			    url:getUrl,
			    success:function (data) {
			    	if (successCallback) {
			    		successCallback(data);
			    	}
			    }
			});
		});
	},

	deleteSharedCollection: function(id, successCallback) {
		this.executeAuthenticatedRequest(function() {
			var user = pm.user;

			var deleteUrl = pm.webUrl + "/users/" + user.get("id") + "/collections/" + id;
			deleteUrl += "?user_id=" + user.get("id");
			deleteUrl += "&access_token=" + user.get("access_token");

			$.ajax({
			    type:'DELETE',
			    url:deleteUrl,
			    success:function (data) {
			    	if (successCallback) {
			    		successCallback(data);
			    	}
			    }
			});
		});
	},

	getCollectionFromRemoteId: function(id, successCallback) {
		var getUrl = pm.webUrl + "/collections/" + id;
		getUrl += "?id_type=remote&user_id=" + pm.user.get("id");
		getUrl += "&access_token=" + pm.user.get("access_token");

		$.get(getUrl, function (data) {
			if (successCallback) {
				successCallback(data);
			}
		});
	}

})
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
var PrscriptSnippet = Backbone.Model.extend({
	default: function() {
		return {
			"id": "",
			"name": "",
			"description": "",
			"version": "",
			"code": ""
		};
	},

	initialize: function() {		
	}
});

var PrscriptSnippets = Backbone.Collection.extend({
	model: PrscriptSnippet,

	comparator: function(a, b) {
	    var counter;

	    var aName = a.get("name");
	    var bName = b.get("name");

	    if (aName.length > bName.legnth)
	        counter = bName.length;
	    else
	        counter = aName.length;

	    for (var i = 0; i < counter; i++) {
	        if (aName[i] == bName[i]) {
	            continue;
	        } else if (aName[i] > bName[i]) {
	            return 1;
	        } else {
	            return -1;
	        }
	    }
	    return 1;
	},

	initialize: function() {
		this.add(postmanPrscriptSnippets, { merge: true });
	},

	addPrscriptSnippet: function(id) {
		var snippet = this.get(id);
		pm.mediator.trigger("addPrscriptSnippetToEditor", snippet);
	}
})
var Request = Backbone.Model.extend({
    defaults: function() {
        return {
            id:"",
            url:"",
            pathVariables:{},
            urlParams:{},
            name:"",
            description:"",
            descriptionFormat:"markdown",
            bodyParams:{},
            headers:[],
            method:"GET",
            dataMode:"params",

            transformedUrl:"",

            isFromCollection:false,
            collectionRequestId:"",
            methodsWithBody:["POST", "PUT", "PATCH", "DELETE", "LINK", "UNLINK", "LOCK", "PROPFIND"],
            areListenersAdded:false,
            startTime:0,
            endTime:0,
            xhr:null,
            editorMode:0,
            responses:[],
            body:null,
            data:null,
            previewHtml:"",
            curlHtml:"",
            preRequestScript:null,
            tests:null,
            testResults:null,
            testErrors:null,
            areHelpersEnabled:true,
            selectedHelper:null,

            jsonIsCurrent: false,
            xmlIsCurrent: false,
            htmlIsCurrent: false,
            jsonPreParse: "",
            xmlPreParse: "",
            htmlPreParse: "",
            jsonSearchString: "",
            xmlSearchString: "",
            htmlSearchString: "",
            inHtmlMode: false
        };
    },

    // Fixed
    initialize: function() {
        var requestBody = new RequestBody();
        var preRequestScripter = new PreRequestScripter();
        var response = new Response();

        this.set("body", requestBody);
        this.set("prScripter", preRequestScripter);
        this.set("response", response);

        this.on("cancelRequest", this.onCancelRequest, this);
        this.on("startNew", this.onStartNew, this);
        this.on("send", this.onSend, this);

        response.on("finishedLoadResponse", this.onFinishedResponseLoaded, this);

        pm.mediator.on("addRequestURLParam", this.onAddRequestURLParam, this);
        pm.mediator.on("addRequestHeader", this.onAddRequestHeader, this);

        pm.mediator.on("loadRequest", this.loadRequest, this);
        pm.mediator.on("saveSampleResponse", this.saveSampleResponse, this);
        pm.mediator.on("loadSampleResponse", this.loadSampleResponse, this);
        pm.mediator.on("getRequest", this.onGetRequest, this);
        pm.mediator.on("updateCollectionRequest", this.checkIfCurrentRequestIsUpdated, this);
    },

    destroy: function() {
    },

    // Used to communicate with the Postman Interceptor
    onExternalExtensionMessage: function(request, sender, sendResponse) {
        // console.log("onExternalExtensionMessage called", request);
        if(this.get("waitingForInterceptorResponse")!==true) {
            console.log("Not expecting interceptor response. Ignoring. Cancel request may have been hit.");
            return;
        }
        this.set("waitingForInterceptorResponse", false);
        if(request.postmanMessage) {
            if (request.postmanMessage.type === "xhrResponse") {
                var xhrResponse = request.postmanMessage.response;
                var xhrCookies = request.postmanMessage.cookies;
                var messageGuid = request.postmanMessage.guid;

                if (messageGuid === this.get("messageGuid")) {
                    this.get("response").set("cookies", xhrCookies);

                    xhrResponse.getResponseHeader = function(header) {
                        return xhrResponse.headers[header];
                    }

                    xhrResponse.getAllResponseHeaders = function() {
                        return xhrResponse.rawHeaders;
                    }

                    // console.log("Response received from extension", xhrResponse);
                    xhrResponse.fromInterceptor = true;
                    _.bind(this.get("response").load, this)(xhrResponse);
                }
            }
            else if (request.postmanMessage.type === "xhrError") {
                var messageGuid = request.postmanMessage.guid;

                if (messageGuid === this.get("messageGuid")) {
                    var xhrError = request.postmanMessage.error;
                    var errorUrl = pm.envManager.getCurrentValue(this.get("url"));
                    this.get("response").trigger("failedRequest", errorUrl);
                }
            }
        }
    },

    onAddRequestURLParam: function(param) {
        var urlParams = this.getUrlParams();
        var index = arrayObjectIndexOf(urlParams, "access_token", "key");

        if (index >= 0) {
            urlParams.splice(index, 1);
        }

        urlParams.push(param);
        this.setUrlParamString(urlParams);
        this.trigger("customURLParamUpdate");
    },

    onAddRequestHeader: function(param) {
        this.setHeader(param.key, param.value);
        this.trigger("customHeaderUpdate");
    },

    onGetRequest: function(callback) {
        callback(this);
    },

    onCancelRequest: function() {
        this.cancel();
    },

    onStartNew: function() {
        this.startNew();
    },

    onSend: function(type, action) {
        var thisRequest = this;
        //add a callback to restore env vars
        thisRequest.send(type, action);
    },

    onFinishedResponseLoaded: function() {
        var request = this;
        var tests = this.get("tests");

        if (tests !== null) {
            pm.mediator.trigger("runRequestTest", this, {}, 1, function(data, result) {
                if (result === "result") {
                    request.set("testResults", data);
                    request.set("testErrors", null);
                }
                else if (result === "error") {
                    console.log("Error message", data);
                    request.set("testResults", null);
                    request.set("testErrors", data);
                }

                //Hack for github https://github.com/a85/POSTMan-Chrome-Extension/issues/889
                pm.envManager.get("globals").trigger("change");
            });
        }
        else {
            this.set("testResults", null);
            this.set("testErrors", null);
        }

    },

    isMethodWithBody:function (method) {
        return pm.methods.isMethodWithBody(method);
    },

	packHeaders:function (headers) {
		var headersLength = headers.length;
		var paramString = "";
		for (var i = 0; i < headersLength; i++) {
			var h = headers[i];
            var prefix = "";
			if(h.enabled === false) {
				prefix = "//";
			}
			if (h.name && h.name !== "") {
				paramString += prefix + h.name + ": " + h.value + "\n";
			}
		}

		return paramString;
	},

    getHeaderValue:function (key) {
        var headers = this.get("headers");

        key = key.toLowerCase();
        for (var i = 0, count = headers.length; i < count; i++) {
            var headerKey = headers[i].key.toLowerCase();

            if (headerKey === key) {
                return headers[i].value;
            }
        }

        return false;
    },

    saveCurrentRequestToLocalStorage:function () {
        pm.settings.setSetting("lastRequest", this.getAsJson());
    },

    getTotalTime:function () {
        var totalTime = this.get("endTime") - this.get("startTime");
        this.set("totalTime", totalTime);
        return totalTime;
    },

    getPackedHeaders:function () {
        return this.packHeaders(this.get("headers"));
    },

    unpackHeaders:function (data) {
        if (data === null || data === "") {
            return [];
        }
        else {
            var vars = [], hash;
            var hashes = data.split('\n');
            var header;

            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i];
                if (!hash) {
                    continue;
                }

                var loc = hash.search(':');

                if (loc !== -1) {
                    var name = $.trim(hash.substr(0, loc));
                    var enabled=true;
                    if(name.indexOf("//")==0) {
                        enabled = false;
                        name = name.substring(2);
                    }
                    var value = $.trim(hash.substr(loc + 1));
                    header = {
                        "name":$.trim(name),
                        "key":$.trim(name),
                        "value":$.trim(value),
                        "enabled":enabled,
                        "description":headerDetails[$.trim(name).toLowerCase()]
                    };

                    vars.push(header);
                }
            }

            return vars;
        }
    },

    // Add Github bug number
    decodeLink:function (link) {
        return $(document.createElement('div')).html(link).text();
    },

    setPathVariables: function(params) {
        this.set("pathVariables", params);
    },

    getPathVariables: function() {
        return this.get("pathVariables");
    },

    getUrlParams: function() {
        var params = getUrlVars(this.get("url"));
        return params;
    },

    setUrlParams: function(params) {
        this.set("urlParams", params);
    },

	setUrlParamStringWithOptBlankValRemoval: function(params, silent, removeBlankParams, url) {
		if(!url) {
			url = this.get("url");
		}
		var paramArr = [];

		for (var i = 0; i < params.length; i++) {
			var p = params[i];
			if (p.key && p.key !== "") {
				p.key = p.key.replace(/&/g, '%26');
				p.value = p.value.replace(/&/g, '%26');
				if(removeBlankParams == false || p.value !== "") {
					var equals = (p.value.length===0)?"":"=";
					paramArr.push(p.key + equals + p.value);
				}
			}
		}

		var baseUrl = url.split("?")[0];
		if (paramArr.length > 0) {
			url = baseUrl + "?" + paramArr.join('&');
		}
		else {
			//Has key/val pair
			if (url.indexOf("?") > 0 && url.indexOf("=") > 0) {
				url = baseUrl;
			}
		}

		if (silent) {
			this.set("url", url, { "silent": true });
			this.trigger("updateURLInputText");
		}
		else {
			this.set("url", url);
		}

	},

    setUrlParamString:function (params, silent, url) {
        this.setUrlParamStringWithOptBlankValRemoval(params, silent, false, url);
    },

    encodeUrl:function (url) {
        var quesLocation = url.indexOf('?');

        if (quesLocation > 0) {
            var urlVars = getUrlVars(url);
            var baseUrl = url.substring(0, quesLocation);
            var urlVarsCount = urlVars.length;
            var newUrl = baseUrl + "?";
            for (var i = 0; i < urlVarsCount; i++) {
                newUrl += (urlVars[i].key) + "=" + (urlVars[i].value) + "&";
            }

            newUrl = newUrl.substr(0, newUrl.length - 1);
            return url;
        }
        else {
            return url;
        }
    },

    getFinalRequestUrl: function(url) {
        var finalUrl;

        finalUrl = replaceURLPathVariables(url, this.get("pathVariables"));
        finalUrl = this.encodeUrl(finalUrl);
        finalUrl = pm.envManager.getCurrentValue(finalUrl);
        finalUrl = ensureProperUrl(finalUrl);

        return finalUrl.trim();
    },

    prepareHeadersForProxy:function (headers) {
        var count = headers.length;
        for (var i = 0; i < count; i++) {
            var key = headers[i].key.toLowerCase();
            if (_.indexOf(pm.bannedHeaders, key) >= 0) {
                headers[i].key = "Postman-" + headers[i].key;
                headers[i].name = "Postman-" + headers[i].name;
            }
        }

        return headers;
    },

    processUrl:function (url) {
        var finalUrl = pm.envManager.getCurrentValue(url);
        finalUrl = ensureProperUrl(finalUrl);
        return finalUrl;
    },

	splitUrlIntoHostAndPath: function(url) {
		var path = "";
		var host;

		var parts = url.split('/');
		host = parts[2];
		var prefix=parts[0]+"/"+parts[1]+"/";
		var partsCount = parts.length;
		for(var i = 3; i < partsCount; i++) {
			path += "/" + parts[i];
		}

		var quesLocation = path.indexOf('?');
		var hasParams = quesLocation >= 0 ? true : false;

		if (hasParams) {
			parts = getUrlVars(path);
			var count = parts.length;
			var encodedPath = path.substr(0, quesLocation + 1);
			for (var j = 0; j < count; j++) {
				var value = parts[j].value;
				var key = parts[j].key;
//				value = encodeURIComponent(value);
//				key = encodeURIComponent(key);
				var equals = (value.length===0)?"":"=";
				encodedPath += key + equals + value + "&";
			}

            //only do this to remove the trailing '&' if params are present
            if(count>0) {
                encodedPath = encodedPath.substr(0, encodedPath.length - 1);
            }

			path = encodedPath;
		}

		return { host: host, path: path, prefix: prefix};
	},

    getAsObject: function() {
        var body = this.get("body");

        var request = {
            url: this.get("url"),
            pathVariables: this.get("pathVariables"),
            data: body.get("dataAsObjects"),
            headers: this.getPackedHeaders(),
            dataMode: body.get("dataMode"),
            method: this.get("method"),
            tests: this.get("tests"),
            version: 2
        };

        return request;
    },

    getAsJson:function () {
        var body = this.get("body");

        var request = {
            url: this.get("url"),
            pathVariables: this.get("pathVariables"),
            data: body.get("dataAsObjects"), //TODO This should be available in the model itself, asObjects = true
            headers: this.getPackedHeaders(),
            dataMode: body.get("dataMode"),
            method: this.get("method"),
            tests: this.get("tests"),
            version: 2
        };

        return JSON.stringify(request);
    },

    getHeadersAsKvPairs: function() {
        var headers = this.get("headers");
        var count = headers.length;
        var kvpairs = {};
        for(var i = 0; i < count; i++) {
            kvpairs[headers[i].key] = headers[i].value;
        }

        return kvpairs;
    },

    saveFinalRequest: function(url, method, headers, data, dataMode) {
        // this.set("finalRequest", finalRequest);
    },

    getForTester:function () {
        var body = this.get("body");
        var data;
        var dataMode = body.get("dataMode");

        // TODO
        // URL should be transformed data after variable processing
        // Because function parameters and scripts might transform
        // the data. Headers already have the final value

        var transformedData = body.get("transformedData");

        if (dataMode === "params") {
            data = body.getDataAsKvPairs(transformedData);
        }
        else if (dataMode === "urlencoded") {
            data = body.getDataAsKvPairs(transformedData);
        }
        else if (dataMode === "raw") {
            data = transformedData;
        }
        else if (dataMode === "binary") {
            data = "";
        }

        var request = {
            url: this.get("transformedUrl"),
            data: data,
            headers: this.getHeadersAsKvPairs(),
            dataMode: body.get("dataMode"),
            method: this.get("method")
        };

        return request;
    },

    getForPrscript:function () {
        var body = this.get("body");
        var data;
        var dataMode = body.get("dataMode");

        // TODO
        // URL should be transformed data after variable processing
        // Because function parameters and scripts might transform
        // the data. Headers already have the final value

        var oldData = body.get("data");

        if (dataMode === "params") {
            data = body.getDataAsKvPairs(oldData);
        }
        else if (dataMode === "urlencoded") {
            data = body.getDataAsKvPairs(oldData);
        }
        else if (dataMode === "raw") {
            data = oldData;
        }
        else if (dataMode === "binary") {
            data = "";
        }

        var request = {
            url: this.get("url"),
            data: data,
            headers: this.getHeadersAsKvPairs(),
            dataMode: body.get("dataMode"),
            method: this.get("method")
        };

        return request;
    },

    startNew:function () {
        var body = this.get("body");
        var response = this.get("response");

        // TODO RequestEditor should be listening to this
        // TODO Needs to be made clearer
        this.set("editorMode", 0);

        var xhr = this.get("xhr");

        if (xhr) {
            xhr.abort();
            this.unset("xhr");
        }

        this.set("url", "");
        this.set("urlParams", {});
        this.set("bodyParams", {});
        this.set("name", "");
        this.set("description", "");
        this.set("headers", []);
        this.set("method", "GET");
        this.set("dataMode", "");
        this.set("isFromCollection", false);
        this.set("collectionRequestId", "");
        this.set("responses", []);

        this.set("tests", "");

        body.set("data", "");

        this.trigger("loadRequest", this);
        response.trigger("clearResponse");
    },

    cancel:function () {

        var response = this.get("response");
        var useInterceptor = pm.settings.getSetting("useInterceptor");
        if(useInterceptor) {
            this.set("waitingForInterceptorResponse", false);
            var errorUrl = pm.envManager.getCurrentValue(this.get("url"));
            response.trigger("failedRequest", errorUrl);
        }
        else {
            var xhr = this.get("xhr");
            if (xhr !== null) {
                xhr.abort();
            }
        }
        response.clear();
    },

    saveSampleResponse: function(r) {
        var sampleRequest = this.getAsObject();
        var response = r;
        var collectionRequestId = this.get("collectionRequestId");

        response.request = sampleRequest;

        if (collectionRequestId) {
            var responses = this.get("responses");
            responses.push(response);
            this.trigger("change:responses");
            pm.mediator.trigger("addResponseToCollectionRequest", collectionRequestId, response);
        }
    },

    loadSampleResponseById: function(responseId) {
        var responses = this.get("responses");
        var location = arrayObjectIndexOf(responses, responseId, "id");
        this.loadSampleResponse(responses[location]);
    },

    deleteSampleResponseById: function(responseId) {
        var collectionRequestId = this.get("collectionRequestId");

        if (collectionRequestId) {
            var responses = this.get("responses");
            var location = arrayObjectIndexOf(responses, responseId, "id");
            responses.splice(location, 1);
            this.trigger("change:responses");
            pm.mediator.trigger("updateResponsesForCollectionRequest", collectionRequestId, responses);
        }
    },

    loadSampleResponse: function(response) {
        var responseRequest = response.request;
        this.set("url", responseRequest.url);
        this.set("method", responseRequest.method);

        this.set("headers", this.unpackHeaders(responseRequest.headers));

        // This should trigger change events in Backbone
        this.set("data", responseRequest.data);
        this.set("dataMode", responseRequest.dataMode);

        var body = this.get("body");

        if(this.isMethodWithBody(responseRequest.method)) {
            body.set("dataMode", responseRequest.dataMode);
            body.loadData(responseRequest.dataMode, responseRequest.data, true);
        }

        this.trigger("loadRequest", this);

        var r = this.get("response");
        r.loadSampleResponse(this, response);
    },

    loadRequest: function(request, isFromCollection, isFromSample, isFromTestRunner) {
        var body = this.get("body");
        var response = this.get("response");

        this.set("id", request.id);

        this.set("editorMode", 0);

        this.set("url", request.url);

        if ("pathVariables" in request) {
            this.set("pathVariables", request.pathVariables);
        }
        else {
            this.set("pathVariables", []);
        }

        if ("currentHelper" in request) {
            this.set("currentHelper", request.currentHelper);
            this.set("helperAttributes", request.helperAttributes);
        }
        else {
            this.set("currentHelper", "normal");
            this.set("helperAttributes", []);
        }

        this.set("isFromCollection", isFromCollection);
        this.set("isFromSample", isFromSample);
        this.set("method", request.method.toUpperCase());

        if (isFromCollection) {
            this.set("collectionId", request.collectionId);
            this.set("collectionRequestId", request.id);

            if (typeof request.name !== "undefined") {
                this.set("name", request.name);
            }
            else {
                this.set("name", "");
            }

            if (typeof request.description !== "undefined") {
                this.set("description", request.description);
            }
            else {
                this.set("description", "");
            }



            if ("responses" in request) {
                this.set("responses", request.responses);
                if (request.responses) {
                }
                else {
                    this.set("responses", []);
                }
            }
            else {
                this.set("responses", []);
            }
        }
        else if (isFromSample) {
        }
        else {
            this.set("name", "");
        }


        if (request.hasOwnProperty("tests")) {
            this.set("tests", request.tests);
            this.set("testResults", null);
        }
        else {
            this.set("tests", null);
            this.set("testResults", null);
        }

        if (request.hasOwnProperty("preRequestScript")) {
            this.set("preRequestScript", request.preRequestScript);
        }
        else {
            this.set("preRequestScript", null);
        }

        if (typeof request.headers !== "undefined") {
            this.set("headers", this.unpackHeaders(request.headers));
        }
        else {
            this.set("headers", []);
        }

        response.clear();

        if (this.isMethodWithBody(this.get("method"))) {
            body.set("dataMode", request.dataMode);

            if("version" in request) {
                if(request.version === 2) {
                    body.loadData(request.dataMode, request.data, true);
                }
                else {
                    body.loadData(request.dataMode, request.data, false);
                }
            }
            else {
                body.loadData(request.dataMode, request.data, false);
            }

        }
        else {
            if("version" in request) {
                if(request.version === 2) {
                    body.loadData("raw", "", true);
                }
                else {
                    body.loadData("raw","", false);
                }
            }
            else {
                body.loadData("raw","", false);
            }
            body.set("dataMode", "params");
        }

        response.trigger("clearResponse");
        this.trigger("loadRequest", this);
    },

    loadRequestFromLink:function (link, headers) {
        this.trigger("startNew");

        this.set("url", this.decodeLink(link));
        this.set("method", "GET");
        this.set("isFromCollection", false);

        if (pm.settings.getSetting("retainLinkHeaders") === true) {
            if (headers) {
                this.set("headers", headers);
            }
        }

        var newRows = getUrlVars($('#url').val(), false);
        $('#url-keyvaleditor').keyvalueeditor('reset', newRows);

    },

    disableHelpers: function() {
        this.set("areHelpersEnabled", false);
    },

    prepareForSending: function() {
        this.set("startTime", new Date().getTime());
    },

    removeHeader: function(key) {
        var headers = _.clone(this.get("headers"));

        var contentTypeHeaderKey = key;
        var pos = findPosition(headers, "key", contentTypeHeaderKey);
        if (pos >= 0) {
            headers.splice(pos, 1);
            this.set("headers", headers);
        }
    },

    setHeaderInArray: function(headers, key, value) {
        var contentTypeHeaderKey = key;
        var pos = findPosition(headers, "key", contentTypeHeaderKey);

        if (value === 'text') {
            if (pos >= 0) {
                headers.splice(pos, 1);
            }
        }
        else {
            if (pos >= 0) {
                headers[pos] = {
                    key: contentTypeHeaderKey,
                    type: "text",
                    name: contentTypeHeaderKey,
                    value: value
                };
            }
            else {
                headers.push({key: contentTypeHeaderKey, name: contentTypeHeaderKey, value: value});
            }
        }

        return headers;
    },

    setHeader: function(key, value) {
        var headers = _.clone(this.get("headers"));

        var contentTypeHeaderKey = key;
        var pos = findPosition(headers, "key", contentTypeHeaderKey);

        if (value === 'text') {
            if (pos >= 0) {
                headers.splice(pos, 1);
            }
        }
        else {
            if (pos >= 0) {
                headers[pos] = {
                    key: contentTypeHeaderKey,
                    type: "text",
                    name: contentTypeHeaderKey,
                    value: value
                };
            }
            else {
                headers.push({key: contentTypeHeaderKey, name: contentTypeHeaderKey, value: value});
            }
        }

        this.set("headers", headers);
    },

	getXhrHeaders: function() {
		var body = this.get("body");

		var headers = _.clone(this.get("headers"));

		if(pm.settings.getSetting("sendNoCacheHeader") === true) {
			this.setHeaderInArray(headers, "Cache-Control", "no-cache");
		}

		if(pm.settings.getSetting("sendPostmanTokenHeader") === true) {
			this.setHeaderInArray(headers, "Postman-Token", guid());
		}

		if (this.isMethodWithBody(this.get("method"))) {
			if(body.get("dataMode") === "urlencoded") {
				this.setHeaderInArray(headers, "Content-Type", "application/x-www-form-urlencoded");
			}
		}

		if (pm.settings.getSetting("usePostmanProxy") === true) {
			headers = this.prepareHeadersForProxy(headers);
		}

		var i;
		var finalHeaders = [];
		for (i = 0; i < headers.length; i++) {
			var header = _.clone(headers[i]);
			if (!_.isEmpty(header.value) && !_.isEmpty(header.key) && header.enabled!==false) {
                header.key = pm.envManager.getCurrentValue(header.key);
				header.value = pm.envManager.getCurrentValue(header.value);
				finalHeaders.push(header);
			}
		}

		return finalHeaders;
	},

    getRequestBodyPreview: function() {
        var body = this.get("body");
        return body.get("dataAsPreview");
    },

    getRequestBodyForCurl: function() {
        var body = this.get("body");
        return body.getBodyForCurl();
    },

    getSerializedFormData: function(formData) {
        // console.log("FormData is", formData);
    },

    getHelperProperties: function(helperAttributes) {
        var ret = {};
        for (var property in helperAttributes) {
            if (helperAttributes.hasOwnProperty(property)) {
                if(property==="request") continue;
                ret[property]=helperAttributes[property];
            }
        }
        return ret;
    },

    send:function (responseRawDataType, action, disableHistory) {
        pm.mediator.once("onMessageExternal", this.onExternalExtensionMessage, this);

        this.set("action", action);

        var model = this;
        var body = this.get("body");
        var dataMode = body.get("dataMode");
        var response = this.get("response");

        var finalRequest;

        var xhrTimeout = pm.settings.getSetting("xhrTimeout");


        if (this.get("url") === "") {
            return;
        }

        var originalUrl = this.get("url"); //Store this for saving the request
        var url = this.getFinalRequestUrl(this.get("url"));
        var parts = this.splitUrlIntoHostAndPath(url);
		url = parts.prefix+parts.host+parts.path;

        // Saving for request test scripts
        this.set("transformedUrl", url);

        var method = this.get("method").toUpperCase();
        //Response raw data type is used for fetching binary responses while generating PDFs
        if (!responseRawDataType) {
            responseRawDataType = "text";
        }

        var headers = this.getXhrHeaders();
        var useInterceptor = pm.settings.getSetting("useInterceptor");
        var isMethodWithBody = this.isMethodWithBody(method);

        if (useInterceptor) {
            var remoteRequest = {
                "url": url,
                "xhrTimeout": xhrTimeout,
                "method": method,
                "dataMode": this.get("dataMode"),
                "responseType": responseRawDataType,
                "headers": headers
            };

            if (isMethodWithBody) {
                var dataToBeSent = body.get("dataToBeSent");
                remoteRequest.dataMode = dataMode;
                if (dataMode === "params") {
                    remoteRequest.body = body.get("serializedData");
                    // console.log("PARAMS BODY:", remoteRequest.body);
                }
                else if (dataMode === "binary") {
                    remoteRequest.body = ArrayBufferEncoderDecoder.encode(dataToBeSent);
                }
                else {
                    remoteRequest.body = dataToBeSent;
                }
            }

            this.set("messageGuid", guid());
            var followRedirect = pm.settings.getSetting("interceptorRedirect");

            var message = {
                "postmanMessage": {
                    "guid": this.get("messageGuid"),
                    "type": "xhrRequest",
                    "request": remoteRequest,
                    "autoRedirect": followRedirect
                }
            };

            // console.log("Sending request message", message);
            this.prepareForSending();
            this.set("waitingForInterceptorResponse", true);
            chrome.runtime.sendMessage(postman_interceptor_id, message, function(extResponse) {
            });
        }
        else {
            //Start setting up XHR
            var xhr = new XMLHttpRequest();
            try {
                xhr.open(method, url, true); //Open the XHR request. Will be sent later

                if (xhrTimeout !== 0) {
                    xhr.timeout = xhrTimeout;
                }

                xhr.onreadystatechange = function (event) {
                    _.bind(response.load, model)(event.target);
                };


                xhr.responseType = responseRawDataType;

                for (var i = 0; i < headers.length; i++) {
                    xhr.setRequestHeader(headers[i].key, headers[i].value);
                }

                // TODO Set getForTester params here

                this.prepareForSending();
                // Prepare body
                if (isMethodWithBody) {
                    var data = body.get("dataToBeSent");
                    // console.log("Data to be sent", data);
                    if (data === false) {
                        xhr.send();
                    }
                    else {
                        xhr.send(data);
                    }
                } else {
                    xhr.send();
                }

                this.unset("xhr");
                this.set("xhr", xhr);
            }
            catch(e) {
                console.log("Error while sending request: " + e.message);
                noty({
                    type:'error',
                    text:'Error while sending request: '+ e.message,
                    layout:'top',
                    timeout:3000
                });
                return;
            }
        }

	    //set helper data
	    var currentHelper, helperData, helperAttributes;
	    if(pm.helpers) {
		    //this will only be executed in the main window, not in the collection runner
		    currentHelper = pm.helpers.getActiveHelperType();
		    if(currentHelper!=="normal") {
			    helperData = pm.helpers.getHelper(currentHelper).attributes;
			    helperAttributes = this.getHelperProperties(helperData);
		    }
	    }
		else {
			currentHelper = this.get("currentHelper");
		    if(currentHelper!=="normal") {
			    helperAttributes = this.get("helperAttributes");
		    }
	    }

        //Save the request
        if (pm.settings.getSetting("autoSaveRequest") && !disableHistory) {
            pm.history.addRequest(originalUrl,
                method,
                this.getPackedHeaders(),
                body.get("dataAsObjects"),
                body.get("dataMode"),
                this.get("tests"),
                this.get("preRequestScript"),
                this.get("pathVariables"),
                currentHelper,
                helperAttributes
            );
        }

        var response = this.get("response");
        this.saveCurrentRequestToLocalStorage();
        response.trigger("sentRequest", this);
        this.trigger("sentRequest", this);
    },

    generateCurl: function() {
        var method = this.get("method").toUpperCase();

        var url = this.getFinalRequestUrl(this.get("url"));

        var headers = this.getXhrHeaders();

        var dataMode = this.get("body").get("dataMode");

        if (this.isMethodWithBody(method)) {
            if (dataMode === "params") {
                headers = this.setHeaderInArray(headers, "Content-Type", this.getDummyFormDataHeader());
            }
        }

        var hasBody = this.isMethodWithBody(method);
        var body;

        if(hasBody) {
            body = this.getRequestBodyForCurl();
        }

        var requestPreview;
        requestPreview = "<pre>";
        requestPreview += "curl -X " + method;
        var headersCount = headers.length;

        for(var i = 0; i < headersCount; i++) {
            requestPreview += " -H \"" + headers[i].key + ": " + headers[i].value + "\"";
        }

        if(hasBody && body !== false) {
            requestPreview += body;
        }

        requestPreview += " " + url;

        requestPreview += "</pre>";

        this.set("curlHtml", requestPreview);
    },

    getDummyFormDataHeader: function() {
        var boundary = "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW";
        return boundary;
    },

    generateHTTPRequest:function() {
        var method = this.get("method").toUpperCase();
        var httpVersion = "HTTP/1.1";

        var url = this.getFinalRequestUrl(this.get("url"));

        var hostAndPath = this.splitUrlIntoHostAndPath(url);

        var path = hostAndPath.path;
        var host = hostAndPath.host;

        //to escape html escape sequences
        path=path.replace(/&/g, "&amp;");

        var headers = this.getXhrHeaders();

        var dataMode = this.get("body").get("dataMode");

        if (this.isMethodWithBody(method)) {
            if (dataMode === "params") {
                headers = this.setHeaderInArray(headers, "Content-Type", this.getDummyFormDataHeader());
            }
        }

        var hasBody = this.isMethodWithBody(method);
        var body;

        if(hasBody) {
            body = this.getRequestBodyPreview();
        }
        var requestPreview;

        requestPreview = "<pre>";
        requestPreview += method + " " + path + " " + httpVersion + "<br/>";
        requestPreview += "Host: " + host + "<br/>";

        var headersCount = headers.length;
        for(var i = 0; i < headersCount; i++) {
            requestPreview += headers[i].name + ": " + headers[i].value + "<br/>";
        }

        if(hasBody && body !== false) {
            requestPreview += "<br/>" + body;
        }

        requestPreview += "</pre>";

        this.set("previewHtml", requestPreview);
    },

    generatePreview: function() {
        this.generateCurl();
        this.generateHTTPRequest();
    },

    stripScriptTag:function (text) {
        if (!text) return text;

        var re = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
        text = text.replace(re, "");
        return text;
    },

    checkIfCurrentRequestIsUpdated: function(request) {
        var id = this.get("collectionRequestId");
        if(id === request.id) {
            this.set("name", request.name);
            this.set("description", request.description);
            this.set("tests", request.tests);
            // TODO Why is this being set?
            // this.set("testResults", request.testResults);
        }
    }
});
var RequestBody = Backbone.Model.extend({
    defaults: function() {
        return {
            data: "",
            transformedData: "",
            dataToBeSent: "",
            dataMode:"params",
            isEditorInitialized:false,
            codeMirror:false,
            rawEditorType:"editor",
            bodyParams: {},
            editorMode:"html",
            language:""
        };
    },

    initialize: function() {

    },

    getFormDataForCurl: function() {
        var dataAsObjects = this.get("dataAsObjects");
        var kv;
        var value;

        var body = "";
        for(var i = 0; i < dataAsObjects.length; i++) {
            value = pm.envManager.getCurrentValue(dataAsObjects[i].value);
            body += " -F \"" + dataAsObjects[i].key + "=" + value + "\"";
        }

        return body;
    },

    getBodyForCurl: function() {
        var dataMode = this.get("dataMode");
        var preview;

        if (dataMode !== "params") {
            preview = pm.envManager.getCurrentValue(this.get("dataAsPreview"));
            return " -d '" + preview + "'";
        }
        else {
            return this.getFormDataForCurl();
        }
    },

    // Fixed
    getBodyParamString:function (params) {
        var paramsLength = params.length;
        var paramArr = [];
        for (var i = 0; i < paramsLength; i++) {
            var p = params[i];
            if (p.key && p.key !== "") {
                paramArr.push(p.key + "=" + p.value);
            }
        }
        return paramArr.join('&');
    },

    getDataMode:function () {
        return this.get("dataMode");
    },

    loadData:function (mode, data, asObjects) {
        // console.log("Load body data", mode, data, asObjects);
        this.set("dataMode", mode);
        this.set("asObjects", asObjects);

        if (mode !== "raw") {
            if (asObjects) {
                if (mode === "params") {
                    // Change made through an event in RequestBodyFormDataEditor
                    this.set("data", _.clone(data));
                    this.set("dataAsObjects", _.clone(data));
                    this.set("dataToBeSent", _.clone(data));
                    this.set("serializedData", _.clone(data));
                }
                else {
                    this.set("data", _.clone(data));
                    this.set("dataToBeSent", _.clone(data));
                    this.set("dataAsObjects", _.clone(data));
                }
            }
            else {
                var params = getBodyVars(data, false);
                this.set("data", _.clone(params));
                this.set("dataToBeSent", _.clone(params));
                this.set("dataAsObjects", _.clone(params));
            }
            this.trigger("change:dataAsObjects");
        }
        else {
            //No need for objects
            this.set("data", _.clone(data));
            this.set("dataToBeSent", _.clone(data));
        }

        // console.log("loadData: dataToBeSent", this.get("dataToBeSent"));
        this.trigger("dataLoaded", this);
        this.trigger("change:data");

    },

    // TODO Store transformedData
    getUrlEncodedBody: function() {
        var rows, count, j;
        var row, key, value;
        var urlEncodedBodyData = "";
        var transformedData = [];

        rows = this.get("data");
        count = rows.length;

        if (count > 0) {
            for (j = 0; j < count; j++) {
                row = rows[j];
                value = row.value;

                if (pm.settings.getSetting("trimKeysAndValues")) {
                    value = $.trim(value);
                }

                value = pm.envManager.getCurrentValue(value);
                value = encodeURIComponent(value);
                value = value.replace(/%20/g, '+');
                key = encodeURIComponent(row.key);
                key = key.replace(/%20/g, '+');

                if (pm.settings.getSetting("trimKeysAndValues")) {
                    key = $.trim(key);
                }

                urlEncodedBodyData += key + "=" + value + "&";

                transformedData.push({
                    "key": key,
                    "value": value
                });
            }

            urlEncodedBodyData = urlEncodedBodyData.substr(0, urlEncodedBodyData.length - 1);

            this.set("transformedData", transformedData);

            return urlEncodedBodyData;
        }
        else {
            return false;
        }
    },

    // TODO Store transformedData
    getFormDataBody: function() {
        var rows, count, j;
        var i;
        var row, key, value;
        var paramsBodyData = new FormData();
        var transformedData = [];

        rows = this.get("data");

        if (rows) {
            count = rows.length;
        }
        else {
            count = 0;
        }


        if (count > 0) {
            for (j = 0; j < count; j++) {
                row = rows[j];
                key = row.key;

                if (pm.settings.getSetting("trimKeysAndValues")) {
                    key = $.trim(key);
                }

                value = row.value;
                value = pm.envManager.getCurrentValue(value);

                if (pm.settings.getSetting("trimKeysAndValues")) {
                    value = $.trim(value);
                }

                paramsBodyData.append(key, value);

                transformedData.push({
                    "key": key,
                    "value": value
                });
            }

            this.set("transformedData", transformedData);

            return paramsBodyData;
        }
        else {
            return false;
        }
    },

    getDataAsKvPairs: function(dataPairs) {
        var count = dataPairs.length;
        var kvpairs = {};
        for(var i = 0; i < count; i++) {
            kvpairs[dataPairs[i].key] = dataPairs[i].value;
        }

        return kvpairs;
    },

    // Note: Used inside collection runner
    // TODO Clean request body management first
    // This is horribly wrong. Need to fix this properly
    setDataForXHR: function() {
        console.log("setDataForXHR called");

        var mode = this.get("dataMode");
        if (mode === "params") {
            this.set("data", this.get("dataAsObjects"));
            var formdata = this.getFormDataBody();
            this.set("data", formdata);
            this.set("dataToBeSent", formdata);
        }
        else if (mode === "urlencoded") {
            var paramdata = this.getUrlEncodedBody();
            // console.log("param data is", paramdata);
            this.set("data", paramdata);
            this.set("dataToBeSent", paramdata);
        }
        else if (mode === "raw") {
            // TODO Store transformedData
            var transformedData = pm.envManager.getCurrentValue(this.get("data"));
            this.set("transformedData", transformedData);
            this.set("dataToBeSent", transformedData);
        }
    }
});
var RequestMethods = Backbone.Model.extend({
    defaults: function() {
    	var defaultMethods = [
    		{"verb": "GET", "hasBody": false},
    		{"verb": "POST", "hasBody": true},
    		{"verb": "PUT", "hasBody": true},
    		{"verb": "PATCH", "hasBody": true},
    		{"verb": "DELETE", "hasBody": true},
    		{"verb": "COPY", "hasBody": false},
    		{"verb": "HEAD", "hasBody": false},
    		{"verb": "OPTIONS", "hasBody": false},
    		{"verb": "LINK", "hasBody": true},
    		{"verb": "UNLINK", "hasBody": true},
    		{"verb": "PURGE", "hasBody": false},
            {"verb": "LOCK", "hasBody": true},
            {"verb": "UNLOCK", "hasBody": false},
            {"verb": "PROPFIND", "hasBody": true}
    	];

        return {
            methods: defaultMethods
        };
    },

    initialize: function(callback) {
    	var model = this;

    	pm.storage.getValue("requestMethods", function(requestMethods) {
    		if (requestMethods !== null) {
    			// model.set("methods", requestMethods);

    			if (callback) {
    				callback();
    			}
    		}
    		else {
    			var o = {"requestMethods": model.get("methods")};
    			pm.storage.setValue(o, function() {
    				if (callback) {
    					callback();
    				}
    			});
    		}

    	});
	},

    isMethodWithBody: function(verb) {
    	var methods = this.get("methods");
    	var index = arrayObjectIndexOf(methods, verb, "verb");

    	if (index >= 0) {
    		return methods[index].hasBody;
    	}
    	else {
    		return false;
    	}
    },

    saveMethods: function() {
    	var o = {"requestMethods": this.get("methods")};
    	pm.storage.setValue(o, function() {
    		if (callback) {
    			callback();
    		}
    	});
    },

    addMethod: function(method) {
    	var index = arrayObjectIndexOf(this.get("methods"), method.verb, "verb");
    	if (index === -1) {
    		this.get("methods").push(method);
    		this.saveMethods();
    	}
    },

    updateMethod: function(method) {
    	var index = arrayObjectIndexOf(this.get("methods"), method.verb, "verb");
    	if (index >= 0) {
    		var methods = this.get("methods");
    		methods[index] = method;
    		this.set("methods", methods);
    		this.saveMethods();
    	}
    },

    deleteMethod: function(verb) {
    	var index = arrayObjectIndexOf(this.get("methods"), method.verb, "verb");
    	if (index >= 0) {
    		var methods = this.get("methods");
    		methods.splice(index, 1);
    		this.set("methods", methods);
    		this.saveMethods();
    	}
    }
});
var Response = Backbone.Model.extend({
    defaults: function() {
        return {
            status:"",
            responseCode:{},
            time:0,
            headers:[],
            cookies:[],
            mime:"",
            text:"",
            language:"",
            rawDataType:"",
            state:{size:"normal"},
            previewType:"parsed",
            searchResultScrolledTo:-1,
            forceRaw: false
        };
    },

    initialize: function() {
    },

    setResponseCode: function(response) {
        var responseCodeName;
        var responseCodeDetail;

        if ("statusText" in response) {
            responseCodeName = response.statusText;
            responseCodeDetail = "";

            if (response.status in httpStatusCodes) {
                responseCodeDetail = httpStatusCodes[response.status]['detail'];
            }
        }
        else {
            if (response.status in httpStatusCodes) {
                responseCodeName = httpStatusCodes[response.status]['name'];
                responseCodeDetail = httpStatusCodes[response.status]['detail'];
            }
            else {
                responseCodeName = "";
                responseCodeDetail = "";
            }
        }

        var responseCode = {
            'code':response.status,
            'name':responseCodeName,
            'detail':responseCodeDetail
        };

        this.set("responseCode", responseCode);
    },

    setResponseTime: function(startTime) {
        var endTime = Date.now();
        var diff = endTime - startTime;
        this.set("time", diff);
    },

    setResponseData: function(response) {
        var responseData;

        if (response.responseType === "arraybuffer") {
            this.set("responseData", response.response);
        }
        else {
            this.set("text", response.responseText);
        }
    },

    // getAllResponseHeaders - Headers are separated by \n
    setHeaders: function(response) {
        var headers = this.unpackResponseHeaders(response.getAllResponseHeaders());

        if(pm.settings.getSetting("usePostmanProxy") === true) {
            var count = headers.length;
            for(var i = 0; i < count; i++) {
                if(headers[i].key === "Postman-Location") {
                    headers[i].key = "Location";
                    headers[i].name = "Location";
                    break;
                }
            }
        }

        // TODO Set this in the model
        headers = _.sortBy(headers, function (header) {
            return header.name;
        });

        this.set("headers", headers);
    },

    setCookies: function(url) {
        var model = this;
        /* TODO: Not available in Chrome packaged apps
        chrome.cookies.getAll({url:url}, function (cookies) {
            var count;
            model.set("cookies", cookies);
        });
        */
    },

    getHeadersAsKvPairs: function() {
        var headers = this.get("headers");
        var count = headers.length;
        var kvpairs = {};
        for(var i = 0; i < count; i++) {
            kvpairs[headers[i].key] = headers[i].value;
        }

        return kvpairs;
    },

    doesContentTypeExist: function(contentType) {
        return (!_.isUndefined(contentType) && !_.isNull(contentType))
    },

    isContentTypeJavascript: function(contentType) {
        return (contentType.search(/json/i) !== -1 || contentType.search(/javascript/i) !== -1 || pm.settings.getSetting("languageDetection") === 'javascript');
    },

    isContentTypeXML: function(contentType) {
        return (contentType.search(/xml/i) !== -1);
    },

    isContentTypeImage: function(contentType) {
        return (contentType.search(/image/i) >= 0);
    },

    isContentTypePDF: function(contentType) {
        return (contentType.search(/pdf/i) >= 0);
    },

    saveAsSample: function(name) {
        var response = this.toJSON();
        response.state = {size: "normal"};
        response.id = guid();
        response.name = name;

        pm.mediator.trigger("saveSampleResponse", response);
    },

    loadSampleResponse: function(requestModel, response) {
        this.set("status", response.status);
        this.set("responseCode", response.responseCode);
        this.set("time", response.time);
        this.set("headers", response.headers);
        this.set("cookies", response.cookies);
        this.set("mime", response.mime);
        this.set("language", response.language);
        this.set("text", response.text);
        this.set("rawDataType", response.rawDataType);
        this.set("state", response.state);
        this.set("previewType", response.previewType);

        this.trigger("loadResponse", requestModel);
    },


    // Renders the response from a request
    // Called with this = request
    load:function (response) {
        var request = this;
        var model = request.get("response");
        model.setResponseTime(request.get("startTime"));

        // TODO These need to be renamed something else
        var presetPreviewType = pm.settings.getSetting("previewType");
        var languageDetection = pm.settings.getSetting("languageDetection");

        if (response.readyState === 4) {
            //Something went wrong
            if (response.status === 0) {
                var errorUrl = pm.envManager.getCurrentValue(request.get("url"));
                model.trigger("failedRequest", errorUrl);
                return;
            }
            else {
                var url = request.get("url");
                model.setResponseCode(response);
                //time has been set earlier
                model.setResponseData(response);
                model.setHeaders(response);                

                var responseHeaders = getResponseHeadersAsLowercaseArray(response.getAllResponseHeaders());
                var contentType = getCaseInsensitiveHeader("content-type", responseHeaders);
                var language = 'html';

                var responseLength = 0;
                var contentLength = getCaseInsensitiveHeader("content-length", responseHeaders);
                if(contentLength !== null) {
                    responseLength = parseInt(contentLength);
                }

                var JSON_SIZE_THRESHOLD = 1000000;
                var XML_SIZE_THRESHOLD = 500000;

                var responsePreviewType = 'html';
                model.set("forceRaw",false);
                if (model.doesContentTypeExist(contentType)) {
                    if (model.isContentTypeJavascript(contentType)) {
                        language = 'javascript';
                    }
                    else if (model.isContentTypeXML(contentType)) {
                        language = 'xml';
                    }

                    if (model.isContentTypeImage(contentType)) {
                        responsePreviewType = 'image';
                    }
                    else if (model.isContentTypePDF(contentType) && response.responseType === "arraybuffer") {
                        responsePreviewType = 'pdf';
                    }
                    else if (model.isContentTypePDF(contentType) && response.responseType === "text") {
                        responsePreviewType = 'pdf';
                    }
                    else if ((model.isContentTypeJavascript(contentType) && responseLength>JSON_SIZE_THRESHOLD)
                    || (model.isContentTypeXML(contentType) && responseLength>XML_SIZE_THRESHOLD)) {
                       responsePreviewType = 'raw';
                       model.set("forceRaw",true);
                    }
                    else {
                        responsePreviewType = 'html';
                    }
                }
                else {
                    if (languageDetection === 'javascript') {
                        language = 'javascript';
                    }
                    else {
                        language = 'html';
                    }
                }

                model.set("language", language);
                model.set("previewType", responsePreviewType);
                model.set("rawDataType", response.responseType);
                model.set("state", {size: "normal"});

                model.trigger("loadResponse", model);
            }
        }
    },

    clear: function() {
        this.trigger("clearResponse");
    },

    unpackResponseHeaders: function(data) {
        if (data === null || data === "") {
            return [];
        }
        else {
            var vars = [], hash;
            var hashes = data.split('\n');
            var header;

            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i];
                var loc = hash.search(':');

                if (loc !== -1) {
                    var name = $.trim(hash.substr(0, loc));
                    var value = $.trim(hash.substr(loc + 1));
                    var description = headerDetails[name.toLowerCase()] || "Custom header";
                    header = {
                        "name":name,
                        "key":name,
                        "value":value,
                        "description":description
                    };

                    if (name.toLowerCase() === "link") {
                        header.isLink = true;
                    }

                    vars.push(header);
                }
            }

            return vars;
        }
    }
});
var ResponseBody = Backbone.Model.extend({

});
var Snippet = Backbone.Model.extend({
	default: function() {
		return {
			"id": "",
			"name": "",
			"description": "",
			"version": "",
			"code": ""
		};
	},

	initialize: function() {		
	}
});

var Snippets = Backbone.Collection.extend({
	model: Snippet,

	comparator: function(a, b) {
	    var counter;

	    var aName = a.get("name");
	    var bName = b.get("name");

	    if (aName.length > bName.legnth)
	        counter = bName.length;
	    else
	        counter = aName.length;

	    for (var i = 0; i < counter; i++) {
	        if (aName[i] == bName[i]) {
	            continue;
	        } else if (aName[i] > bName[i]) {
	            return 1;
	        } else {
	            return -1;
	        }
	    }
	    return 1;
	},

	initialize: function() {
		this.add(postmanTestSnippets, { merge: true });
	},

	addSnippet: function(id) {
		var snippet = this.get(id);
		pm.mediator.trigger("addSnippetToEditor", snippet);
	}
})
var RequestBodyBinaryEditor = Backbone.View.extend({
    initialize: function() {
        this.model.on("startNew", this.onStartNew, this);
        var body = this.model.get("body");        
        var model = this.model;
        var view = this;

        $('#body-data-binary').on('change', function (event) {
            var files = event.target.files;            
            _.bind(view.readFile, view)(files[0]);
        });
    },

    onStartNew: function() {
    },

    readFile: function(f) {
        var model = this.model;        
        var reader = new FileReader();
        var view = this;

        // Closure to capture the file information.
        reader.onload = (function (theFile) {
            return function (e) {
                view.binaryData = e.currentTarget.result;
            };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsArrayBuffer(f);
    },

    getBinaryBody: function() {
        // console.log(this.binaryData);
        return this.binaryData;
    }
});
var RequestBodyEditor = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;
        var body = model.get("body");

        model.on("change:method", this.onChangeMethod, this);

        body.on("change:dataMode", this.onChangeDataMode, this);
        body.on("change:data", this.onChangeData, this);

        this.bodyFormDataEditor = new RequestBodyFormDataEditor({model: this.model});
        this.bodyURLEncodedEditor = new RequestBodyURLEncodedEditor({model: this.model});
        this.bodyRawEditor = new RequestBodyRawEditor({model: this.model});
        this.bodyBinaryEditor = new RequestBodyBinaryEditor({model: this.model});

        $('#data-mode-selector').on("click", "a", function () {
            var mode = $(this).attr("data-mode");
            view.setDataMode(mode);
        });

        $('#body-editor-mode-selector .dropdown-menu').on("click", "a", function (event) {
            var editorMode = $(event.target).attr("data-editor-mode");
            var language = $(event.target).attr("data-language");
            view.bodyRawEditor.setEditorMode(editorMode, language, true);
        });

        // 'Format code' button listener.
        $('#body-editor-mode-selector-format').on('click.postman', function(evt) {
            var editorMode = $(event.target).attr("data-editor-mode");

            if ($(evt.currentTarget).hasClass('disabled')) {
                return;
            }
        });

        var type = pm.settings.getSetting("requestBodyEditorContainerType");
        $('#request-body-editor-container-type a').removeClass('active');
        $('#request-body-editor-container-type a[data-container-type="' + type + '"]').addClass('active');

        $('#request-body-editor-container-type').on('click', 'a', function(evt) {
            var type = $(this).attr('data-container-type');
            pm.settings.setSetting("requestBodyEditorContainerType", type);
        });


        $(document).bind('keydown', 'p', function () {
            if(pm.app.isModalOpen()) {
                return;
            }

            if (model.isMethodWithBody(model.get("method"))) {
                $('#formdata-keyvaleditor div:first-child input:first-child').focus();
                return false;
            }
        });

        this.setDataMode("params");
    },

    onChangeData: function() {
    },

    resetBody: function() {
        this.bodyRawEditor.resetBody();
    },

    getRequestBodyPreview: function() {
        var body = this.model.get("body");
        var dataMode = body.get("dataMode");

        if (dataMode === 'raw') {
            var rawBodyData = body.get("data");
            rawBodyData = htmlEncode(rawBodyData);
            rawBodyData = pm.envManager.getCurrentValue(rawBodyData);
            return rawBodyData;
        }
        else if (dataMode === 'params') {
            var formDataBody = this.bodyFormDataEditor.getFormDataPreview(false);
            if(formDataBody !== false) {
                return formDataBody;
            }
            else {
                return false;
            }
        }
        else if (dataMode === 'urlencoded') {
            var urlEncodedBodyData = this.bodyURLEncodedEditor.getUrlEncodedBody(false);
            if(urlEncodedBodyData !== false) {
                return urlEncodedBodyData;
            }
            else {
                return false;
            }
        }
    },

    // TODO
    // Set transformedData here?
    getRequestBodyToBeSent: function(getDisabled) {
        var model = this.model;
        var body = model.get("body");

        var dataMode = body.get("dataMode");

        if (dataMode === 'raw') {
            var rawBodyData = _.clone(this.getData(true));
            rawBodyData = pm.envManager.getCurrentValue(rawBodyData);

            body.set("transformedData", rawBodyData);

            return rawBodyData;
        }
        else if (dataMode === 'params') {
            var formDataBody = this.bodyFormDataEditor.getFormDataBody(getDisabled);

            if(formDataBody !== false) {
                return formDataBody;
            }
            else {
                return false;
            }
        }
        else if (dataMode === 'urlencoded') {
            var urlEncodedBodyData = this.bodyURLEncodedEditor.getUrlEncodedBody(getDisabled);
            if(urlEncodedBodyData !== false) {
                return urlEncodedBodyData;
            }
            else {
                return false;
            }
        }
        else if (dataMode === 'binary') {
            var binaryBody = this.bodyBinaryEditor.getBinaryBody();
            return binaryBody;
        }
    },

    // TODO
    // URGENT
    // Refactor this. Figure out why it's needed when the value
    // is being obtained from editors in another place
    // Gets data from the key value editors
    getData:function (asObjects, getDisabled) {
        var model = this.model;
        var body = this.model.get("body");
        var mode = body.get("dataMode");

        var data;
        var params;
        var newParams;
        var param;
        var i;

        if (mode === "params") {
            params = $('#formdata-keyvaleditor').keyvalueeditor('getValues');
            newParams = [];
            for (i = 0; i < params.length; i++) {
                if(getDisabled==false && params[i].enabled==false) {
                    continue;
                }
                param = {
                    key:params[i].key,
                    value:params[i].value,
                    type:params[i].type,
                    enabled: params[i].enabled
                };

                newParams.push(param);
            }

            if(asObjects === true) {
                return newParams;
            }
            else {
                data = model.getBodyParamString(newParams);
            }
        }
        else if (mode === "raw") {
            data = this.bodyRawEditor.getRawData();
        }
        else if (mode === "urlencoded") {
            params = $('#urlencoded-keyvaleditor').keyvalueeditor('getValues');
            newParams = [];
            for (i = 0; i < params.length; i++) {
                if(getDisabled==false && params[i].enabled==false) {
                    continue;
                }
                param = {
                    key:params[i].key,
                    value:params[i].value,
                    type:params[i].type,
                    enabled: params[i].enabled
                };

                newParams.push(param);
            }

            if(asObjects === true) {
                return newParams;
            }
            else {
                data = model.getBodyParamString(newParams);
            }
        }

        return data;
    },

    // TODO Needs to be in this order for updating the data property
    updateModel: function(getDisabled) {
        var body = this.model.get("body");
        var dataMode = body.get("dataMode");
        var data = this.getRequestBodyToBeSent(getDisabled);

        body.set("data", this.getData(true, getDisabled));

        // TODO
        // Transform data first and then set dataToBeSent
        body.set("dataToBeSent", this.getRequestBodyToBeSent(getDisabled));

        if (dataMode === "urlencoded") {
            body.set("transformedData", getBodyVars(body.get("dataToBeSent")));
        }

        var dataAsObjects = this.getData(true, getDisabled);

        // TODO
        // Triggers change in dataAsObjects which causes form-data to refresh and lose files
        body.set("dataAsObjects", dataAsObjects, { silent: true });

        var dataAsPreview = this.getRequestBodyPreview();
        body.set("dataAsPreview", dataAsPreview);

        // TODO
        // Only needed for form-data. What about params?
        var useInterceptor = pm.settings.getSetting("useInterceptor");

        if (useInterceptor) {
            if (dataMode === "params") {
                var serializedFormData = this.bodyFormDataEditor.getSerializedFormDataBody();
                body.set("serializedData", serializedFormData);
            }
        }
    },

    openFormDataEditor:function () {
        var containerId = "#formdata-keyvaleditor-container";
        $(containerId).css("display", "block");

        var editorId = "#formdata-keyvaleditor";
        var params = $(editorId).keyvalueeditor('getValues');
        var newParams = [];
        for (var i = 0; i < params.length; i++) {
            var param = {
                key:params[i].key,
                value:params[i].value
            };

            newParams.push(param);
        }
    },

    closeFormDataEditor:function () {
        var containerId = "#formdata-keyvaleditor-container";
        $(containerId).css("display", "none");
    },

    openUrlEncodedEditor:function () {
        var containerId = "#urlencoded-keyvaleditor-container";
        $(containerId).css("display", "block");

        var editorId = "#urlencoded-keyvaleditor";
        var params = $(editorId).keyvalueeditor('getValues');
        var newParams = [];
        for (var i = 0; i < params.length; i++) {
            var param = {
                key:params[i].key,
                value:params[i].value
            };

            newParams.push(param);
        }
    },

    closeUrlEncodedEditor:function () {
        var containerId = "#urlencoded-keyvaleditor-container";
        $(containerId).css("display", "none");
    },

    onChangeMethod: function(event) {
        var method = this.model.get("method");

        if (this.model.isMethodWithBody(method)) {
            $("#data").css("display", "block");
        } else {
            $("#data").css("display", "none");
        }
    },

    onChangeDataMode: function(event) {
        var body = this.model.get("body");
        var dataMode = body.get("dataMode");
        this.setDataMode(dataMode);
    },

    setDataMode:function (mode) {
        var model = this.model;
        var view = this;
        var body = this.model.get("body");

        body.set("dataMode", mode);

        $('#data-mode-selector a').removeClass("active");
        $('#data-mode-selector a[data-mode="' + mode + '"]').addClass("active");

        $("#body-editor-mode-selector").css("display", "none");
        if (mode === "params") {
            view.openFormDataEditor();
            view.closeUrlEncodedEditor();
            $('#body-data-container').css("display", "none");
            $('#body-data-binary-container').css("display", "none");
        }
        else if (mode === "raw") {
            view.closeUrlEncodedEditor();
            view.closeFormDataEditor();
            $('#body-data-container').css("display", "block");

            var isEditorInitialized = body.get("isEditorInitialized");
            var codeMirror = body.get("codeMirror");
            if (isEditorInitialized === false) {
                view.bodyRawEditor.initCodeMirrorEditor();
            }
            else {
                //codeMirror.refresh();
            }

            $("#body-editor-mode-selector").css("display", "block");
            $('#body-data-binary-container').css("display", "none");
        }
        else if (mode === "urlencoded") {
            view.closeFormDataEditor();
            view.openUrlEncodedEditor();
            $('#body-data-container').css("display", "none");
            $('#body-data-binary-container').css("display", "none");
        }
        else if (mode === "binary") {
            view.closeFormDataEditor();
            view.closeUrlEncodedEditor();
            $('#body-data-container').css("display", "none");
            $('#body-data-binary-container').css("display", "block");
        }
    },
});
var RequestBodyFormDataEditor = Backbone.View.extend({
    initialize: function() {
        var view = this;

        this.model.on("startNew", this.onStartNew, this);
        this.files = {};

        var body = this.model.get("body");
        body.on("change:dataAsObjects", this.onChangeBodyData, this);

        var editorId = "#formdata-keyvaleditor";

        var params = {
            placeHolderKey:"Key",
            placeHolderValue:"Value",
            valueTypes:["text", "file"],
            deleteButton:'<span class="icon-delete"/>',
            onDeleteRow:function () {
            },

            onBlurElement:function () {
            }
        };

        $("#formdata-keyvaleditor").on("change", "input[type='file']", function(event) {
            view.onHandleFileChange(event);
        });

        $(editorId).keyvalueeditor('init', params);
    },

    clearFilenamesFromInput: function(element) {
        $(element).attr("data-filenames", "");
    },


    appendFilenameToInput: function(element, name) {
        var filenames = $(element).attr("data-filenames");
        if (filenames === "") {
            filenames = name;
        }
        else {
            filenames += "," + name;
        }

        $(element).attr("data-filenames", filenames);
    },

    // TODO Only handles single files right now
    onHandleFileChange: function(event) {
        var view = this;
        var files = this.files;

        view.clearFilenamesFromInput(event.currentTarget);

        if (event.target.files.length > 0) {
            for(var i = 0; i < event.target.files.length; i++) {
                var reader = new FileReader();
                reader.onload = (function (theFile) {
                    return function (e) {
                        if(pm.settings.getSetting("useInterceptor")) {
                        	//slower
                        	var binaryData = e.currentTarget.result;
                            var encodedData = ArrayBufferEncoderDecoder.encode(binaryData);
                        }
                        
                        var name = encodeURIComponent(theFile.name);

                        view.appendFilenameToInput(event.currentTarget, name);

                        var parent = $(event.currentTarget).parent();
                        var key = $($(parent).children(".keyvalueeditor-key")[0]).val();

                        if(pm.settings.getSetting("useInterceptor")) {
                            files[name] = encodedData;
                        }
                        else {
                        	files[name] = theFile;
                    	}
                    };
                })(event.target.files[i]);
                reader.readAsArrayBuffer(event.target.files[i]);
            }
        }
    },

    onStartNew: function() {
        this.files = {};
        $('#formdata-keyvaleditor').keyvalueeditor('reset');
    },

    // Sets the data variable
    onChangeBodyData: function() {
        var body = this.model.get("body");
        var mode = body.get("dataMode");
        var asObjects = body.get("asObjects");
        var data = body.get("dataAsObjects");

        if (mode === "params") {
            if (data) {
                try {
                    this.files = {};
                    $('#formdata-keyvaleditor').keyvalueeditor('reset', data);
                    body.set("dataToBeSent", this.getFormDataBody());
                }
                catch(e) {
                }
            }
        }
    },

    getFormDataBody: function(getDisabled) {
        var rows, count, j;
        var i;
        var row, key, value;
        var paramsBodyData = new FormData();
        var transformedData = [];
        var body = this.model.get("body");

        rows = $('#formdata-keyvaleditor').keyvalueeditor('getElements');
        count = rows.length;

        if (count > 0) {
            for (j = 0; j < count; j++) {
                row = rows[j];
                key = row.keyElement.val();
                var valueType = row.valueType;
                var valueElement = row.valueElement;
                var enabled = row.enabled;
                if(row.enabled==false && getDisabled==false) continue;

                if (pm.settings.getSetting("trimKeysAndValues")) {
                    key = $.trim(key);
                }

                if (valueType === "file") {
                    var domEl = valueElement.get(0);
                    var len = domEl.files.length;
                    if(len>0) {
                        var filenames = valueElement.attr('data-filenames').split(",");
                        for (i = 0; i < len; i++) {
                            paramsBodyData.append(key, domEl.files[i], filenames[i]);
                        }
                    }
                }
                else {
                    value = valueElement.val();
                    value = pm.envManager.getCurrentValue(value);

                    if (pm.settings.getSetting("trimKeysAndValues")) {
                        value = $.trim(value);
                    }

                    paramsBodyData.append(key, value);

                    transformedData.push({
                        "key": key,
                        "value": value,
                        "enabled": enabled
                    });
                }
            }

            body.set("transformedData", transformedData);

            return paramsBodyData;
        }
        else {
            return false;
        }
    },

    // Fixed
    getDummyFormDataBoundary: function() {
        var boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW";
        return boundary;
    },

    getSerializedFormDataBody: function(getDisabled) {
        var rows, count, j;
        var i;
        var row, key, value;
        var paramsBodyData = [];
        var transformedData = [];

        var body = this.model.get("body");

        rows = $('#formdata-keyvaleditor').keyvalueeditor('getElements');
        count = rows.length;
        var files = this.files;

        if (count > 0) {
            for (j = 0; j < count; j++) {
                row = rows[j];
                key = row.keyElement.val();
                var valueType = row.valueType;
                var valueElement = row.valueElement;
                var enabled = row.enabled;
                if(row.enabled==false && getDisabled==false) continue;

                if (pm.settings.getSetting("trimKeysAndValues")) {
                    key = $.trim(key);
                }

                if (valueType === "file") {
                    // console.log($(valueElement[0]));
                    var filenameAttribute = $(valueElement[0]).attr("data-filenames");

                    if (filenameAttribute) {
                        var filenames = filenameAttribute.split(",")
                        // console.log(valueElement, filenames);
                        var param = {
                            "name": key,
                            "value": [],
                            "fileName": filenames[0],
                            "type": valueType
                        };

                        for(var k = 0; k < filenames.length; k++) {
                            // console.log(filenames[k]);
                            param["value"].push(files[filenames[k]]);
                        }

                        paramsBodyData.push(param);
                    }
                }
                else {
                    value = valueElement.val();
                    value = pm.envManager.getCurrentValue(value);

                    if (pm.settings.getSetting("trimKeysAndValues")) {
                        value = $.trim(value);
                    }

                    var param = {
                        "name": key,
                        "value": value,
                        "type": valueType,
                        "enabled": enabled
                    };

                    paramsBodyData.push(param);

                    transformedData.push({
                        "key": key,
                        "value": value,
                        "enabled": enabled
                    });
                }
            }

            body.set("transformedData", transformedData);

            return paramsBodyData;
        }
        else {
            return false;
        }
    },

    getFormDataPreview: function(getDisabled) {
        var rows, count, j;
        var row, key, value;
        var i;
        rows = $('#formdata-keyvaleditor').keyvalueeditor('getElements');
        count = rows.length;
        var params = [];

        if (count > 0) {
            for (j = 0; j < count; j++) {
                row = rows[j];
                key = row.keyElement.val();
                var valueType = row.valueType;
                var valueElement = row.valueElement;
                var enabled = row.enabled;
                if(row.enabled==false && getDisabled==false) continue;

                if (pm.settings.getSetting("trimKeysAndValues")) {
                    key = $.trim(key);
                }

                if (valueType === "file") {
                    var domEl = valueElement.get(0);
                    var len = domEl.files.length;

                    for (i = 0; i < len; i++) {
                        var fileObj = {
                            key: key,
                            value: domEl.files[i],
                            type: "file",
                        }
                        params.push(fileObj);
                    }
                }
                else {
                    value = valueElement.val();
                    value = pm.envManager.getCurrentValue(value);

                    if (pm.settings.getSetting("trimKeysAndValues")) {
                        value = $.trim(value);
                    }

                    var textObj = {
                        key: key,
                        value: value,
                        type: "text",
                        enabled: enabled
                    }
                    params.push(textObj);
                }
            }

            var paramsCount = params.length;
            var body = "";
            for(i = 0; i < paramsCount; i++) {
                var param = params[i];
                body += this.getDummyFormDataBoundary();
                if(param.type === "text") {
                    body += "<br/>Content-Disposition: form-data; name=\"" + param.key + "\"<br/><br/>";
                    body += param.value;
                    body += "<br/>";
                }
                else if(param.type === "file") {
                    body += "<br/>Content-Disposition: form-data; name=\"" + param.key + "\"; filename=";
                    body += "\"" + param.value.name + "\"<br/>";
                    body += "Content-Type: " + param.value.type;
                    body += "<br/><br/><br/>"
                }
            }

            body += this.getDummyFormDataBoundary();

            return body;
        }
        else {
            return false;
        }
    }
});
var RequestBodyRawEditor = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;
        var body = this.model.get("body");

        body.on("change:data", this.onChangeBodyData, this);
        model.on("change:headers", this.onChangeHeaders, this);

        pm.mediator.on("switchCodeMirrorTheme", this.onSwitchCodeMirrorTheme, this);
    },

    onSwitchCodeMirrorTheme: function(theme) {
        var codeMirror = this.model.get("body").get("codeMirror");

        if (codeMirror) {
            codeMirror.setTheme("ace/theme/"+theme);
        }
    },

    onChangeHeaders: function() {
        var body = this.model.get("body");

        //Set raw body editor value if Content-Type is present
        var contentType = this.model.getHeaderValue("Content-Type");
        var editorMode = "text";
        var language = "text";

        if (contentType) {
            if (contentType.search(/json/i) !== -1 || contentType.search(/javascript/i) !== -1) {
                editorMode = 'javascript';
                language = contentType;
            }
            else if (contentType.search(/xml/i) !== -1) {
                editorMode = 'xml';
                language = contentType;
            }
            else if (contentType.search(/html/i) !== -1) {
                editorMode = 'xml';
                language = contentType;
            }
            else {
                editorMode = 'text';
                language = 'text';
            }
        }


        body.set("editorMode", editorMode);
        body.set("language", language);

        this.setEditorMode(editorMode, language, false);
    },

    resetBody: function() {
        this.loadRawData("");
    },

    onChangeBodyData: function() {
        var body = this.model.get("body");
        var mode = body.get("dataMode");
        var asObjects = body.get("asObjects");
        var data = body.get("data");

        // console.log("onChangeBodyData", body, data);

        var language = body.get("language");
        var editorMode = body.get("editorMode");

        if (mode === "raw") {
            if (typeof data === "string") {
                this.loadRawData(data);
            }
            else {
                this.loadRawData("");
            }
        }
        else {
            this.loadRawData("");
        }
    },

    initCodeMirrorEditor:function () {
        var model = this.model;
        var view = this;
        var body = this.model.get("body");
        var editorMode = body.get("editorMode");

        body.set("isEditorInitialized", true);

        var theme = pm.settings.getSetting("postmanCodeMirrorTheme");

        var bodyTextarea = document.getElementById("body");
        this.editor = ace.edit(bodyTextarea);

        pm.addFolderEditor = this.editor;
        var theme = (pm.settings.getSetting("postmanTheme")==="light")?"clouds":"monokai";
        this.editor.setTheme("ace/theme/"+theme);

        body.set("codeMirror", this.editor);


        var codemirror = this.editor;
        $("#body-data-container .aceeditor-div").resizable({
            stop: function() {
                codemirror.resize(true);
            }
        });

        if (editorMode) {
            if (editorMode === "javascript") {
               // codeMirror.setOption("mode", {"name":"javascript", "json":true});
                this.editor.getSession().setMode('ace/mode/javascript');
            }
            else if(editorMode === "text") {
                //codeMirror.setOption("mode", editorMode);
                this.editor.getSession().setMode('ace/mode/plain_text');
            }
            else if(editorMode === "xml") {
                //codeMirror.setOption("mode", editorMode);
                this.editor.getSession().setMode('ace/mode/xml');
            }

            if (editorMode === "text") {
                $('#body-editor-mode-selector-format').addClass('disabled');
            } else {
                $('#body-editor-mode-selector-format').removeClass('disabled');
            }
        }

        $("#body-data-container .CodeMirror-scroll").css("height", "200px");
    },

    setEditorMode:function (mode, language, toSetHeader) {
        var model = this.model;
        var body = model.get("body");
        var codeMirror = body.get("codeMirror");
        var isEditorInitialized = body.get("isEditorInitialized");

        var displayMode = $("#body-editor-mode-selector a[data-language='" + language + "']").html();

        $('#body-editor-mode-item-selected').html(displayMode);

        if (isEditorInitialized) {
            if (mode === "javascript") {
                codeMirror.getSession().setMode('ace/mode/javascript');
            }
            else if(mode === "text") {
                //codeMirror.setOption("mode", editorMode);
                codeMirror.getSession().setMode('ace/mode/plain_text');
            }
            else if(mode==="xml") {
                codeMirror.getSession().setMode('ace/mode/xml');
            }

            if (mode === "text") {
                $('#body-editor-mode-selector-format').addClass('disabled');
            } else {
                $('#body-editor-mode-selector-format').removeClass('disabled');
            }

            if (toSetHeader) {
                model.setHeader("Content-Type", language);
            }

            //codeMirror.refresh();
        }
    },

    autoFormatEditor:function (mode) {
        var model = this.model;
        var view = this;
        var body = model.get("body");
        var isEditorInitialized = body.get("isEditorInitialized");
        var codeMirror = body.get("codeMirror");

        var content = codeMirror.getValue(),
        validated = null, result = null;

        $('#body-editor-mode-selector-format-result').empty().hide();

        console.error("Auto format not currently supported for ace editor");
        return;

        if (isEditorInitialized) {
            // In case its a JSON then just properly stringify it.
            // CodeMirror does not work well with pure JSON format.
            if (mode === 'javascript') {

                // Validate code first.
                try {
                    validated = pm.jsonlint.instance.parse(content);
                    if (validated) {
                        content = JSON.parse(codeMirror.getValue());
                        codeMirror.setValue(JSON.stringify(content, null, 4), -1);
                    }
                } catch(e) {
                    result = e.message;
                    // Show jslint result.
                    // We could also highlight the line with error here.
                    $('#body-editor-mode-selector-format-result').html(result).show();
                }
            } else { // Otherwise use internal CodeMirror.autoFormatRage method for a specific mode.
                var totalLines = codeMirror.lineCount(),
                totalChars = codeMirror.getValue().length;

                codeMirror.autoFormatRange(
                    {line: 0, ch: 0},
                    {line: totalLines - 1, ch: codeMirror.getLine(totalLines - 1).length}
                );
            }
        }
    },

    loadRawData:function (data) {
        // console.log("loadRawData: data", data);
        var body = this.model.get("body");
        var isEditorInitialized = body.get("isEditorInitialized");
        var codeMirror = body.get("codeMirror");

        if (isEditorInitialized === true) {
            if (data) {
                codeMirror.setValue(data, -1);
            }
            else {
                codeMirror.setValue("", -1);
            }
        }
    },

    getRawData:function () {
        var model = this.model;
        var body = model.get("body");
        var isEditorInitialized = body.get("isEditorInitialized");
        var codeMirror = body.get("codeMirror");

        if (isEditorInitialized) {
            var data = codeMirror.getValue();

            if (pm.settings.getSetting("forceWindowsLineEndings") === true) {
                data = data.replace(/\r/g, '');
                data = data.replace(/\n/g, "\r\n");
            }

            return data;
        }
        else {
            return "";
        }
    }
});
var RequestBodyURLEncodedEditor = Backbone.View.extend({
    initialize: function() {
        this.model.on("startNew", this.onStartNew, this);

        var body = this.model.get("body");
        body.on("change:dataAsObjects", this.onChangeBodyData, this);

        var editorId = "#urlencoded-keyvaleditor";

        var params = {
            placeHolderKey:"Key",
            placeHolderValue:"Value",
            valueTypes:["text"],
            deleteButton:'<span class="icon-delete"/>',
            onDeleteRow:function () {
            },

            onBlurElement:function () {
            }
        };

        $(editorId).keyvalueeditor('init', params);
    },

    onStartNew: function() {
        $('#urlencoded-keyvaleditor').keyvalueeditor('reset');
    },

    onChangeBodyData: function() {
        var body = this.model.get("body");
        var mode = body.get("dataMode");
        var asObjects = body.get("asObjects");
        var data = body.get("dataAsObjects");

        if (mode === "urlencoded") {
            if (data) {
                try {
                    $('#urlencoded-keyvaleditor').keyvalueeditor('reset', data);
                }
                catch(e) {
                    console.log(e);
                }
            }

        }
    },

    getUrlEncodedBody: function(getDisabled) {
        var rows, count, j;
        var row, key, value;
        var urlEncodedBodyData = "";
        rows = $('#urlencoded-keyvaleditor').keyvalueeditor('getElements');
        count = rows.length;

        if (count > 0) {
            for (j = 0; j < count; j++) {
                row = rows[j];
                value = row.valueElement.val();
                if(row.enabled==false && getDisabled==false) {
                    continue;
                }
                if (pm.settings.getSetting("trimKeysAndValues")) {
                    // console.log("Trim value", value);
                    value = $.trim(value);
                }

                value = pm.envManager.getCurrentValue(value);
                value = encodeURIComponent(value);
                value = value.replace(/%20/g, '+');
                key = encodeURIComponent(row.keyElement.val());
                key = key.replace(/%20/g, '+');

                if (pm.settings.getSetting("trimKeysAndValues")) {
                    key = $.trim(key);
                }

                urlEncodedBodyData += key + "=" + value + "&";
            }

            urlEncodedBodyData = urlEncodedBodyData.substr(0, urlEncodedBodyData.length - 1);

            return urlEncodedBodyData;
        }
        else {
            return false;
        }
    }
});
var RequestClipboard = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var response = model.get("response");

        $("#response-copy-button").on("click", function() {
            var scrollTop = $(window).scrollTop();
            if($("#currentPrettyMode").html()=="JSON") {
                var possiblyUncleanJSON=response.get("text");
                var cleanJSON = possiblyUncleanJSON.substring(possiblyUncleanJSON.indexOf('{'));
                copyToClipboard(vkbeautify.json(cleanJSON));
            }
            else {
                copyToClipboard(response.get("text"));
            }
            $(document).scrollTop(scrollTop);
        });
    }
})
var RequestEditor = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var responseModel = model.get("response");
        var view = this;
        var body = model.get("body");

        this.isTestsEditor = false;
        this.isPrScriptEditor=false;

        this.requestMetaViewer = new RequestMetaViewer({model: this.model});
        this.requestMethodEditor = new RequestMethodEditor({model: this.model});
        this.requestHeaderEditor = new RequestHeaderEditor({model: this.model});
        this.requestURLPathVariablesEditor = new RequestURLPathVariablesEditor({model: this.model});
        this.requestURLEditor = new RequestURLEditor({model: this.model});
        this.requestBodyEditor = new RequestBodyEditor({model: this.model});
        this.requestClipboard = new RequestClipboard({model: this.model});
        this.requestPreviewer = new RequestPreviewer({model: this.model});
        this.requestTestEditor = new RequestTestsEditor({model: this.model});
        this.requestPrscriptEditor = new RequestPrscriptEditor({model: this.model});

        model.on("loadRequest", this.onLoadRequest, this);
        model.on("sentRequest", this.onSentRequest, this);
        model.on("startNew", this.onStartNew, this);
        model.on("updateModel", this.updateModel, this);

        responseModel.on("failedRequest", this.onFailedRequest, this);
        responseModel.on("finishedLoadResponse", this.onFinishedLoadResponse, this);

        this.on("send", this.onSend, this);
        this.on("preview", this.onPreview, this);

        //Github issue https://github.com/a85/POSTMan-Chrome-Extension/issues/712
        //submit-request event handler doesn't register
        setTimeout(function() {
            if( !$._data(document.getElementById("submit-request"), "events" ) ||
                $._data(document.getElementById("submit-request"), "events" ).click.length!==1) {
                console.log("Submit request event handler not registered..reregistering");
                $("#submit-request").click(function() {
                    view.trigger("send", "text");
                });
            }
            else {
                console.log("Submit request event handler already registered");
            }
        },1000);

        pm.mediator.on("updateRequestModel", this.onUpdateRequestModel, this);

        $('#url-keyvaleditor-actions-close').on("click", function () {
            view.requestURLPathVariablesEditor.closeEditor();
            view.requestURLEditor.closeUrlEditor();
        });

        $('#url-keyvaleditor-actions-open').on("click", function () {
            var isDisplayed = $('#url-keyvaleditor-container').css("display") === "block";
            if (isDisplayed) {
                view.requestURLPathVariablesEditor.closeEditor();
                view.requestURLEditor.closeUrlEditor();
            }
            else {
                view.requestURLPathVariablesEditor.openEditor();
                view.requestURLEditor.openAndInitUrlEditor();
            }
        });

        $("button#prettySearchToggle").on("click",function() {
            $(".CodeMirror-dialog.CodeMirror-dialog-top").remove();
            var currentStatus = $("#prettySearchToggle").hasClass("active");
            var currentMode = $("#currentPrettyMode").html();
            if(currentStatus) {
                $(".search-panel").hide();
                $("#prettySearchToggle").removeClass("active");
                if(currentMode==="JSON") {
                    $(".jv-search-panel>.sidebar-search-cancel").hide();
                }
                if(currentMode==="XML") {
                    $(".xv-search-panel>.sidebar-search-cancel").hide();
                }
            }
            else if($("#response-as-code").css('display')==="block"){
                var cmArray = $('.CodeMirror').not(".ui-resizable");
                if(cmArray.length>0) {
                    //CodeMirror.commands["find"](($('.CodeMirror').not(".ui-resizable"))[0].CodeMirror);
                }
                $('#response-language a[data-mode="html"]').addClass("active");

                $("#prettySearchToggle").addClass("active");
                if($(".search-panel").css('display') !== "none") {
                    $(".search-panel .search-field").focus();
                }
                if(currentMode==="JSON") {
                    $(".jv-search-panel>.sidebar-search-cancel").show();
                    $(".jv-search-panel").show();
                }
                if(currentMode==="XML") {
                    $(".xv-search-panel>.sidebar-search-cancel").show();
                    $(".xv-search-panel").show();
                }

            }
            $("span.jv_searchFound").contents().unwrap();
            $(".jv-search-field").val("");
            view.model.set("scrollToNextResult",0);
        });

        $("#update-request-in-collection").on("click", function() {
            view.updateCollectionRequest();
        });;

        $("#cancel-request").on("click", function () {
            model.trigger("cancelRequest", model);
        });

        $("#request-actions-reset").on("click", function () {
            view.requestBodyEditor.resetBody();
            view.requestPrscriptEditor.clearTextarea();
            model.trigger("startNew", model);
        });

        $('#add-to-collection').on("click", function () {
            view.updateModel(true);

            var name = model.get("name");
            var description = model.get("description");

            pm.mediator.trigger("showAddCollectionModal", name, description);
        });

        $("#submit-request").on("click", function () {
            view.trigger("send", "text");
        });

        $("#submit-request-download").on("click", function () {
            view.trigger("send", "arraybuffer", "download");
        });

        $("#write-tests").on("click", function () {
            view.toggleTestsEditor();
        });

        $("#write-prscript").on("click", function () {
            view.togglePrScriptEditor();
        });

        $("#preview-request").on("click", function () {
            _.bind(view.onPreviewRequestClick, view)();
        });

        $(document).bind('keydown', 'alt+s', function() {
            if(pm.app.isModalOpen()) {
                return;
            }

            view.updateCollectionRequest();

            return true;
        });

        $('body').on('keydown', 'input', function (event) {
            if(pm.app.isModalOpen()) {
                return;
            }

            if($("#prettySearchToggle").hasClass("active")) {
                return;
            }

            var targetId = event.target.id;

            if (event.keyCode === 27) {
                $(event.target).blur();
            }
            else if (event.keyCode === 13) {
                if (targetId !== "url") {
                    view.triggerSend();
                }
                else {
                    var cancelEnter = $("#url").attr("data-cancel-enter") === "true";

                    if (!cancelEnter) {
                        view.triggerSend();
                    }

                    $("#url").attr("data-cancel-enter", "false");
                }


            }

            return true;
        });

        $('body').on('keydown', 'div#body-data-container-editor', function (event) {
            if ((event.ctrlKey || event.metaKey) && event.keyCode === 13) {
                view.trigger("send", "text");
                event.preventDefault();
                return false;
            }

            return true;
        });

        $(document).bind('keydown', 'return', function () {
            if(pm.app.isModalOpen()) {
                return;
            }

            view.triggerSend();

            return false;
        });

        var newRequestHandler = function () {
            if(pm.app.isModalOpen()) {
                return;
            }

            model.trigger("startNew", model);
        };


        $(document).bind('keydown', 'alt+p', function() {
            _.bind(view.onPreviewRequestClick, view)();
        });

        $(document).bind('keydown', 'alt+n', newRequestHandler);

        $(document).bind('keydown', 'ctrl+s', function() {
            view.updateCollectionRequest();
        });

        $(document).bind('keydown', 'ctrl+f', function() {
            view.toggleSearchField();
        });

        $(document).bind('keydown', 'meta+f', function() {
            view.toggleSearchField();
        });

        $(document).bind('keydown', 'ctrl+g', function() {
            view.scrollToNextResult();
        });

        $(document).bind('keydown', 'ctrl+t', function() {
            view.scrollToTop();
        });

        $(document).bind('keydown', 'meta+g', function() {
            view.scrollToNextResult();
        });

        this.loadLastSavedRequest();
    },

    triggerSend: function() {
        if(pm.app.isModalOpen()) {
            return;
        }

        //close URL autocomplete
        $("#url").autocomplete("close");

        this.trigger("send", "text");
    },

    toggleSearchField: function() {
        var currentStatus = $("#prettySearchToggle").hasClass("active");
        var currentMode = $("#currentPrettyMode").html();
        if(currentMode==="JSON" || currentMode==="XML") {
            if(currentStatus) {
                $(".search-panel").hide();
                $("#prettySearchToggle").removeClass("active");
                $(".CodeMirror-dialog.CodeMirror-dialog-top").remove();
                if(currentMode==="JSON") {
                    $(".jv-search-panel>.sidebar-search-cancel").hide();
                }
                if(currentMode==="XML") {
                    $(".xv-search-panel>.sidebar-search-cancel").hide();
                }
            }
            else if($("#response-as-code").css('display')==="block"){
                $("#prettySearchToggle").addClass("active");
                if($(".search-panel").css('display') !== "none") {
                    $(".search-panel .search-field").focus();
                }
                if(currentMode==="JSON") {
                    $(".jv-search-panel>.sidebar-search-cancel").show();
                    $(".jv-search-panel").show();
                }
                if(currentMode==="XML") {
                    $(".xv-search-panel>.sidebar-search-cancel").show();
                    $(".xv-search-panel").show();
                }
            }
            $("span.jv_searchFound").contents().unwrap();
            $(".jv-search-field").val("");
            this.model.set("scrollToNextResult",0);
        }
    },

    scrollToTop: function() {
        $("#main").scrollTop(0);
    },

    scrollToNextResult: function() {
        var currentScrollValue = this.model.get("scrollToNextResult");
        if(currentScrollValue==-1) return;
        $("span.jv_searchFound").removeClass("jv_searching");
        if($("span.jv_searchFound").length==currentScrollValue+1) currentScrollValue=-1;

        if($("span.jv_searchFound").length>currentScrollValue+1) {
            var cur_node = $("span.jv_searchFound")[currentScrollValue+1];
            $(cur_node).addClass("jv_searching");
            if ('scrollIntoViewIfNeeded' in cur_node)
                cur_node.scrollIntoViewIfNeeded();
            else
                cur_node.scrollIntoView();
            this.model.set("scrollToNextResult",currentScrollValue+1);
        }
    },

    updateCollectionRequest: function() {
        var model = this.model;
        var view = this;

        view.updateModel(true);

        var current = model.getAsObject();

	    var currentHelper = pm.helpers.getActiveHelperType();
	    var helperData, helperAttributes, saveHelperToRequest;
	    if(currentHelper!=="normal") {
		    helperData = pm.helpers.getHelper(currentHelper).attributes;
		    helperAttributes = model.getHelperProperties(helperData);
		    saveHelperToRequest = $("#request-helper-"+currentHelper+"-saveHelper").is(":checked");
	    }
	    else {
		    saveHelperToRequest = false;
	    }

	    if(saveHelperToRequest===false) {
		    currentHelper = "normal";
		    helperAttributes = {};
	    }


	    var collectionRequest = {
            id: model.get("collectionRequestId"),
            headers: current.headers,
            url: current.url,
            preRequestScript: model.get("preRequestScript"),
            pathVariables: current.pathVariables,
            method: current.method,
            data: current.data,
            dataMode: current.dataMode,
            version: current.version,
            tests: current.tests,
		    currentHelper: currentHelper,
		    helperAttributes: helperAttributes,
            time: new Date().getTime()
        };

        pm.collections.updateCollectionRequest(collectionRequest);
    },

    loadLastSavedRequest: function() {
        var lastRequest = pm.settings.getSetting("lastRequest");

        // TODO Have a generic function for falsy values
        if (lastRequest !== "" && lastRequest !== undefined) {

            var lastRequestParsed = JSON.parse(lastRequest);
            // TODO Be able to set isFromCollection too
            this.model.set("isFromCollection", false);
            pm.mediator.trigger("loadRequest", lastRequestParsed, false, false);
        }
    },

    onStartNew: function() {
        // TODO Needs to be handled by the Sidebar
        if (this.isTestsEditor) {
            $("#write-tests").removeClass("active");
            this.isTestsEditor = false;
        }

        if (this.isPrScriptEditor) {
            this.isPrScriptEditor = false;
            $("#write-prscript").removeClass("active");
        }

        $('#submit-request').button("reset");
        $('.sidebar-collection-request').removeClass('sidebar-collection-request-active');
        $('.sidebar-history-request').removeClass('sidebar-history-request-active');
        $('#update-request-in-collection').css("display", "none");
    },


    onUpdateRequestModel: function(callback) {
        this.updateModel(true);
        callback();
    },

    /*
    Called before
    1. Sending
    2. Previewing
    3. Saving to a collection
    4. Adding to a collection
    5. Processing OAuth and Digest params
    */
    updateModel: function(getDisabled) {
        this.requestPrscriptEditor.updateModel();
        this.requestHeaderEditor.updateModel();
        this.requestURLPathVariablesEditor.updateModel();
        this.requestURLEditor.updateModel();
        this.requestBodyEditor.updateModel(getDisabled);
        this.requestTestEditor.updateModel();
    },

    processHelpers: function() {
        var activeHelperType = pm.helpers.getActiveHelperType();

        if (activeHelperType === "oAuth1" && pm.helpers.getHelper("oAuth1").get("auto")) {
            pm.helpers.getHelper("oAuth1").process();
            pm.helpers.getHelper("oAuth1").generateHelper();
        }
        else if (activeHelperType === "basicAuth") {
            pm.helpers.getHelper("basicAuth").process();
        }
        else if (activeHelperType === "digestAuth") {
            pm.helpers.getHelper("digestAuth").process();
        }
    },

    onSend: function(type, action) {
        if (!type) {
            type = "text";
        }

        if (!action) {
            action = "display";
        }

        var oldThis = this;
        this.requestPrscriptEditor.updateModel();
        this.model.get("prScripter").runPreRequestScript(this.model, {}, 1, function(data, result) {
            oldThis.processHelpers();
            oldThis.updateModel(false);
            oldThis.model.trigger("send", type, action);
        });
    },

    onPreview: function() {
        this.updateModel(false);
        pm.mediator.trigger("showPreview");
    },

    onSentRequest: function() {
        $('#submit-request').button("loading");
    },

    onFailedRequest: function() {
        $('#submit-request').button("reset");
    },

    onFinishedLoadResponse: function() {
    	this.model.set("jsonIsCurrent",false);
    	this.model.set("xmlIsCurrent",false);
    	this.model.set("htmlIsCurrent",false);
        $('#submit-request').button("reset");
    },

    onLoadRequest: function(m) {        
        var model = this.model;
        var body = model.get("body");

        var method = model.get("method");
        var isMethodWithBody = model.isMethodWithBody(method);
        var url = model.get("url");
        var pathVariables = model.get("pathVariables");
        var headers = model.get("headers");
        var data = model.get("data");
        var name = model.get("name");
        var description = model.get("description");
        var responses = model.get("responses");
        var isFromSample = model.get("isFromSample");
        var isFromCollection = model.get("isFromCollection");

        this.showRequestBuilder();

        if (isFromCollection) {
            $('#update-request-in-collection').css("display", "inline-block");
        }
        else if (isFromSample) {
            $('#update-request-in-collection').css("display", "inline-block");
        }
        else {
            $('#update-request-in-collection').css("display", "none");
        }

        $('#headers-keyvaleditor-actions-open .headers-count').html(headers.length);

        $('#url').val(url);

        var newUrlParams = getUrlVars(url, false);

        //@todoSet params using keyvalueeditor function
        $('#url-keyvaleditor').keyvalueeditor('reset', newUrlParams);
        $('#headers-keyvaleditor').keyvalueeditor('reset', headers);

        this.requestURLPathVariablesEditor.loadEditorParams(pathVariables);

        $('#request-method-selector').val(method);

        if (isMethodWithBody) {
            $('#data').css("display", "block");
        }
        else {
            this.requestBodyEditor.resetBody();
            $('#data').css("display", "none");
        }

        // TODO What about tests?
        this.requestTestEditor.loadTests();
        this.requestPrscriptEditor.loadPrscript();
    },

    showRequestBuilder: function() {        
        $("#preview-request").html("Preview");
        this.model.set("editorMode", 0);        
        $("#request-preview").css("display", "none");
        $("#request-builder").css("display", "block");        
    },

    // TODO Implement this using events
    onPreviewRequestClick: function(event) {
        var editorMode = this.model.get("editorMode");
        if(editorMode === 1) {
            this.showRequestBuilder();
        }
        else {
            this.trigger("preview", this);
        }
    },

    toggleTestsEditor: function() {
        if (pm.purchases.isUpgradeAvailable("collection-runner")) {
            if (this.isTestsEditor === false) {
                this.isTestsEditor = true;
                $("#write-tests").addClass("active");
                this.requestTestEditor.showTests();
                this.requestTestEditor.loadTests();
            }
            else {
                $("#write-tests").removeClass("active");
                this.isTestsEditor = false;
                this.requestTestEditor.hideTests();
                this.requestTestEditor.updateModel();
            }
        }
        else {
            $("#modal-jetpacks-about").modal("show");
        }
        
    },

    togglePrScriptEditor: function() {
        if (pm.purchases.isUpgradeAvailable("collection-runner")) {
            if (this.isPrScriptEditor === false) {
                this.isPrScriptEditor = true;
                $("#write-prscript").addClass("active");
                this.requestPrscriptEditor.showPrscript();
                this.requestPrscriptEditor.loadPrscript();
            }
            else {
                $("#write-prscript").removeClass("active");
                this.isPrScriptEditor = false;
                this.requestPrscriptEditor.hidePrscript();
                this.requestTestEditor.updateModel();
            }
        }
        else {
            $("#modal-jetpacks-about").modal("show");
        }
        
    }
});
var RequestHeaderEditor = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;
        model.on("change:headers", this.onChangeHeaders, this);
        model.on("customHeaderUpdate", this.onCustomHeaderUpdate, this);
        model.on("loadRequest", this.onLoadRequest,this);
        var contentTypes = [
            "application/json"
        ];

        var params = {
            placeHolderKey:"Header",
            placeHolderValue:"Value",
            deleteButton:'<span class="icon-delete"/>',
            onInit:function () {
            },

            onAddedParam:function () {
                $("#headers-keyvaleditor .keyvalueeditor-key").catcomplete({
                    source:pm.headerPresets.getPresetsForAutoComplete(),
                    delay:50,
                    select:function (event, item) {
                        view.onHeaderAutoCompleteItemSelect(item.item);
                    }
                });
            },

            onDeleteRow:function () {
                var headers = view.getHeaderEditorParams();
                view.setHeadersInTextarea(headers);
                $('#headers-keyvaleditor-actions-open .headers-count').html(headers.length);
                model.set("headers", headers, { silent: true });
            },

            onFocusElement:function (event) {
                view.currentFocusedRow = $(event.currentTarget).parent()[0];

                var thisInputIsAValue = $(event.currentTarget).attr("class").search("keyvalueeditor-value") >= 0;

                if(thisInputIsAValue) {
                    var parent = view.currentFocusedRow;
                    var keyInput = $(parent).children(".keyvalueeditor-key")[0];
                    var keyValue = $(keyInput).val().toLowerCase();
                    if (keyValue === "content-type") {
                        $(event.currentTarget).autocomplete({
                            source: mediatypes,
                            delay: 50
                        });
                    }
                }

                $("#headers-keyvaleditor .keyvalueeditor-key").catcomplete({
                    source:pm.headerPresets.getPresetsForAutoComplete(),
                    delay:50,
                    select:function (event, item) {
                        _.bind(view.onHeaderAutoCompleteItemSelect, view)(item.item);
                    }
                });
            },

            onBlurElement:function () {
                $("#headers-keyvaleditor .keyvalueeditor-key").catcomplete({
                    source:pm.headerPresets.getPresetsForAutoComplete(),
                    delay:50,
                    select:function (event, item) {
                        view.onHeaderAutoCompleteItemSelect(item.item);
                    }
                });

                var headers = view.getHeaderEditorParams();
                view.setHeadersInTextarea(headers);
                $('#headers-keyvaleditor-actions-open .headers-count').html(headers.length);
                model.set("headers", headers, { silent: true });
            },

            onReset:function () {
                var headers = $('#headers-keyvaleditor').keyvalueeditor('getValues');
                $('#headers-keyvaleditor-actions-open .headers-count').html(headers.length);
                model.set("headers", headers, { silent: true });
            }
        };

        $('#headers-keyvaleditor').keyvalueeditor('init', params);

        $('#headers-keyvaleditor-actions-close').on("click", function () {
            $('#headers-keyvaleditor-actions-open').removeClass("active");
            view.closeHeaderEditor();
        });

        $('#headers-keyvaleditor-actions-open').on("click", function () {
            var isDisplayed = $('#headers-keyvaleditor-container').css("display") === "block";
            if (isDisplayed) {
                view.closeHeaderEditor();
            }
            else {
                view.openHeaderEditor();
            }
        });

        $("textarea#headers-direct").on("change",function() {
           view.onDirectHeaderInput(this.value.trim());
        });


        $(document).bind('keydown', 'h', function () {
            if(pm.app.isModalOpen()) {
                return;
            }

            var display = $("#headers-keyvaleditor-container").css("display");

            if (display === "block") {
                view.closeHeaderEditor();
            }
            else {
                view.openHeaderEditor();
                $('#headers-keyvaleditor div:first-child input:first-child').focus();
            }

            return false;
        });
    },

    onCustomHeaderUpdate: function() {
        this.openHeaderEditor();
    },

    onChangeHeaders: function() {
        var newHeaders = _.cloneDeep(this.model.get("headers"));
        $('#headers-keyvaleditor').keyvalueeditor('reset', newHeaders);
    },

    openHeaderEditor:function () {
        $('#headers-keyvaleditor-actions-open').addClass("active");
        var containerId = "#headers-keyvaleditor-container";
        $(containerId).css("display", "block");
    },

    closeHeaderEditor:function () {
        $('#headers-keyvaleditor-actions-open').removeClass("active");
        var containerId = "#headers-keyvaleditor-container";
        $(containerId).css("display", "none");
    },

    onLoadRequest: function(m) {
        var model = this.model;
        var headers = model.get("headers");
        this.setHeadersInTextarea(headers);
    },

    setHeaderValue:function (key, value) {
        var headers = this.model.get("headers");
        var origKey = key;
        key = key.toLowerCase();
        var found = false;
        for (var i = 0, count = headers.length; i < count; i++) {
            var headerKey = headers[i].key.toLowerCase();

            if (headerKey === key && value !== "text") {
                headers[i].value = value;
                found = true;
            }
        }

        var editorId = "#headers-keyvaleditor";
        if (!found && value !== "text") {
            var header = {
                "key":origKey,
                "name":origKey,
                "value":value
            };
            headers.push(header);
        }

        $(editorId).keyvalueeditor('reset', headers);
    },

    updateModel: function() {
        this.model.set("headers", this.getHeaderEditorParams(), {silent: true});
        var headers = this.model.get("headers");

        $('#headers-keyvaleditor-actions-open .headers-count').html(headers.length);
    },

	getHeaderEditorParams:function () {
		var hs = $('#headers-keyvaleditor').keyvalueeditor('getValues');
		var newHeaders = [];
		for (var i = 0; i < hs.length; i++) {
			var header = {
				key:hs[i].key,
				value:hs[i].value,
				name:hs[i].key,
				enabled: hs[i].enabled
			};

			newHeaders.push(header);
		}

		return newHeaders;
	},

    onHeaderAutoCompleteItemSelect:function(item) {
        if(item.type === "preset") {
            $(this.currentFocusedRow).remove();

            var preset = pm.headerPresets.getHeaderPreset(item.id);

            var headers = $('#headers-keyvaleditor').keyvalueeditor('getValues');
            var newHeaders = _.union(headers, preset.get("headers"));
            $('#headers-keyvaleditor').keyvalueeditor('reset', newHeaders);

            //Ensures that the key gets focus
            var element = $('#headers-keyvaleditor .keyvalueeditor-last input:first-child')[0];
            $('#headers-keyvaleditor .keyvalueeditor-last input:first-child')[0].focus();
            setTimeout(function() {
                element.focus();
            }, 10);

        }
    },

    //should be called when the textarea is updated
    onDirectHeaderInput:function(text) {
        //attempt to split text
        $("#headers-textarea-message").html("Enter headers in \"key\":\"value\" format.");
        $("#headers-textarea-message").removeClass('wrong-header');
        var lines = text.split("\n");
        var numLines = lines.length;
        var newHeaders=[];
        var kvpair = $('#headers-keyvaleditor');

        for(i=0;i<numLines;i++) {
            var newHeader={};
            var thisPair = lines[i].split(":");
            if(thisPair.length<2) {
                $("#headers-textarea-message").html('<span id="wrong-headers-format">Incorrect format for headers in line [  '+lines[i]+'  ]. Use \"key\":\"value\"</span>');
                $("#headers-textarea-message").addClass('wrong-header');
                continue;
            }
            newHeader["key"]=newHeader["name"]=thisPair.shift();
            newHeader["type"]="text";
            newHeader["value"]=thisPair.join(":").trim();
            newHeaders.push(newHeader);
        }

        kvpair.keyvalueeditor('reset', newHeaders);
    },

    //is called when a new header is added in the form
    setHeadersInTextarea: function(headers) {
        var ta = $("textarea#headers-direct");
        var numHeaders = headers.length;
        var str="";
        for(i=0;i<numHeaders;i++) {
            str+=headers[i]["key"]+": "+headers[i]["value"]+"\n";
        }
        ta.val(str);
        $("#headers-textarea-message").html("Enter headers in \"key\":\"value\" format.");
        $("#headers-textarea-message").removeClass('wrong-header');
        //#headers-textarea-message.wrong-header
    }


});
var RequestMetaViewer = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        model.on("loadRequest", this.render, this);
        model.on("change:name", this.render, this);
        model.on("change:description", this.render, this);

        this.requestSampleResponseList = new RequestSampleResponseList({model: this.model});

        $('.request-meta-actions-togglesize').on("click", function () {
            var action = $(this).attr('data-action');

            if (action === "minimize") {
                $(this).attr("data-action", "maximize");
                $('.request-meta-actions-togglesize span').removeClass("icon-circle-minus");
                $('.request-meta-actions-togglesize span').addClass("icon-circle-plus");
                $("#request-description-container").slideUp(100);
            }
            else {
                $('.request-meta-actions-togglesize span').removeClass("icon-circle-plus");
                $('.request-meta-actions-togglesize span').addClass("icon-circle-minus");                
                $(this).attr("data-action", "minimize");
                $("#request-description-container").slideDown(100);
            }
        });

        $('#request-description-container').on("click", "a", function() {            
            var url = $(this).attr("href");
            window.open(url);
            return false;
        });

        $('#request-meta').on("mouseenter", function () {
            $('.request-meta-actions').css("display", "block");
        });

        $('#request-meta').on("mouseleave", function () {
            $('.request-meta-actions').css("display", "none");
        });
    },

    show: function() {
        $("#request-description-container").css("display", "block");
        $('#request-meta').css("display", "block");
        $('#request-name').css("display", "block");
        $('#request-description').css("display", "block");
    },

    hide: function() {
        $('#request-meta').css("display", "none");
    },

    render: function() {
        var request = this.model;
        var isFromCollection = this.model.get("isFromCollection");

        if (isFromCollection) {
            this.show();

            var name = request.get("name");
            var description = _.clone(request.get("description"));

            var descriptionFormat = request.get("descriptionFormat");

            if(descriptionFormat === "markdown") {
                description = markdown.toHTML(description);
            }

            if (typeof name !== "undefined") {
                $('#request-meta').css("display", "block");
                $('#request-name').html(name);
                $('#request-name').css("display", "inline-block");
            }
            else {
                $('#request-meta').css("display", "none");
                $('#request-name').css("display", "none");
            }

            if (typeof description !== "undefined") {
                $('#request-description').html(description);
                $('#request-description').css("display", "block");
            }
            else {
                $('#request-description').css("display", "none");
            }

            $('.request-meta-actions-togglesize').attr('data-action', 'minimize');
            $('.request-meta-actions-togglesize span').attr('class', 'icon-circle-minus');
        }
        else {
            this.hide();
        }
    }
});
var RequestMethodEditor = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        // TODO Set select values using RequestMethods
        // console.log("Initialized request methods editor");

        model.on("startNew", this.onStartNew, this);

        $('#request-method-selector').change(function () {
            var val = $(this).val();
            _.bind(view.setMethod, view)(val);
        });
    },

    onStartNew: function() {
        $('#request-method-selector').val("GET");
    },

    setMethod:function (method) {
        var body = this.model.get("body");

        this.model.set("url", $('#url').val());
        this.model.set("method", method);

        // Change only for methods not with body to make sure
        // current body type is not switched
        if (!this.model.isMethodWithBody(method)) {
            body.set("dataMode", "params");
        }
    }
})
var RequestPreviewer = Backbone.View.extend({
    initialize: function() {
    	var model = this.model;
    	var view = this;

        $(".request-preview-header-limitations").dropdown();

        pm.mediator.on("showPreview", this.showPreview, this);

        $("#request-preview-header .request-helper-tabs li").on("click", function () {
            $("#request-preview-header .request-helper-tabs li").removeClass("active");
            $(event.currentTarget).addClass("active");
            var type = $(event.currentTarget).attr('data-id');
            view.showPreviewType(type);
        });
    },

    showPreview: function() {
    	this.model.generatePreview();
    	this.render();
    },

    showPreviewType: function(type) {
    	$("#request-preview-content div").css("display", "none");
    	$("#request-preview-content-" + type).css("display", "block");
    },

    render: function() {
        this.model.set("editorMode", 1);

        var previewHtml = this.model.get("previewHtml");
        var curlHtml = this.model.get("curlHtml");

        $("#request-preview-content-http-request").html(previewHtml);
        $("#request-preview-content-curl").html(curlHtml);
        $("#preview-request").html("Build");
        $("#request-builder").css("display", "none");
        $("#request-preview").css("display", "block");
    }
});
var RequestPrscriptEditor = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        pm.mediator.on("refreshPrscriptLayout", this.onRefreshLayout, this);
        pm.mediator.on("addPrscriptSnippetToEditor", this.addPrscriptSnippetToEditor, this);

        var snippets = new PrscriptSnippets();
        this.snippetsList = new RequestPrscriptEditorSnippets({ model: snippets });

        this.model.on("startNew", this.onStartNew, this);

        pm.mediator.on("onHidePrscriptSnippets", function() {
            view.setLayout();
        });

        pm.mediator.on("purchaseComplete", function(newPurchase) {
            if (newPurchase.id === "collection-runner") {
                view.hidePurchaseMessage();
            }
        });

        pm.mediator.on("loadedPurchases", function(purchases) {
            if (purchases.isUpgradeAvailable("collection-runner")) {
                view.hidePurchaseMessage();
            }
            else {
                view.showPurchaseMessage();

                if (pm.purchases.isTrialCompleted("collection-runner")) {
                    $("#request-helper-prscript .try-jetpacks").remove();
                }
            }
        });

        pm.mediator.on("switchCodeMirrorTheme", this.onSwitchCodeMirrorTheme, this);

        $("#request-prscript-editor-snippets-maximize").on("click", function() {
            pm.settings.setSetting("hidePrscriptSnippets", false);
            pm.mediator.trigger("onShowPrscriptSnippets");
            view.setLayout();
        });

        $("#request-helper-prscript").on("click", ".know-more-collection-runner", function() {
            tracker.sendEvent('test_runner', 'know_more', 'test_editor');
            pm.mediator.trigger("startPurchaseFlow", "test_runner");
        });

        //Hack - codemirror rendering issues
        $('li[data-id="prscript"]').on("click",function() {
            var oldWidth = window.innerWidth;
            window.resizeTo(window.innerWidth-1);
            window.resizeTo(oldWidth);
        });

        setTimeout(function() {
            view.setLayout();
        }, 1000);

        if (!this.editor) {
            this.initializeEditor();
        }
    },

    onSwitchCodeMirrorTheme: function(theme) {        
        var codeMirror = this.editor;

        if (codeMirror) {
            //codeMirror.setOption("theme", theme);
            codeMirror.setTheme("ace/theme/"+theme);
        }        
    },

    clearTextarea: function() {
        if (this.editor) {
            this.editor.setValue("",1);
        }
    },

    hidePurchaseMessage: function() {
        var view = this;

        $(".request-prscript-purchase-message").css("display", "none");
        $(".request-prscript-wrapper").css("display", "block");
        setTimeout(function() {
            view.setLayout();
            view.loadPrscript();
        }, 1000);
    },

    showPurchaseMessage: function() {
        $(".request-prscript-purchase-message").css("display", "block");
        $(".request-prscript-wrapper").css("display", "none");
    },

    addPrscriptSnippetToEditor: function(snippet) {
        if (this.editor) {
            var code = this.editor.getValue();

            if(code !== "") {
                code += "\n\n";
            }

            code += snippet.get("code");
            this.editor.setValue(code,0);
        }
    },

    setLayout: function() {
        var areSnippetsHidden = pm.settings.getSetting("hidePrscriptSnippets");

        // TODO Change these to fluid layouts later
        var containerWidth = $(document).width() - 385;
        var testEditorWidth;

        if (!areSnippetsHidden) {
            testEditorWidth = containerWidth - 200;
            $("#request-prscript-editor-snippets-maximize").css("display", "none");
            $(".request-prscript-editor-snippets").css("display", "block");
        }
        else {
            testEditorWidth = containerWidth;
            $("#request-prscript-editor-snippets-maximize").css("display", "block");
            $(".request-prscript-editor-snippets").css("display", "none");
        }

        $(".request-prscript-editor-codemirror").css("width", testEditorWidth + "px");

        // Reenable resizing
        // $(".request-prscript-editor-codemirror").css("height", "300px");
        // $(".request-prscript-editor-snippets").css("height", "300px");
        $(".request-prscript-editor-snippets").css("width", "197px");
    },

    onRefreshLayout: function() {
        this.setLayout();
    },

    onStartNew: function() {
        this.hidePrscript();
    },

    initializeEditor: function() {
        var view = this;

        if (this.editor) {
            return;
        }

        view.setLayout();

        var theme = pm.settings.getSetting("postmanCodeMirrorTheme");

        this.editor = ace.edit(document.getElementById("prscript-aceeditor"));
        this.editor.getSession().setMode('ace/mode/javascript');

        var codeMirror = this.editor;

        $(".request-prscript-editor-codemirror").resizable({
            stop: function() {
                codeMirror.resize(true);
            }
        });

        this.editor.resize();

        setTimeout(function() {
            view.setLayout();
            pm.mediator.trigger("refreshPrscriptLayout");
        }, 750);
    },

    showPrscript: function() {
        $("#request-helper-prscript").css("display", "block");
    },

    hidePrscript: function() {
        $("#request-helper-prscript").css("display", "none");
    },

    loadPrscript: function() {
        var model = this.model;
        var view = this;

        // TODO Should only be called if the textarea is visible        
        if (!this.editor) {
            this.initializeEditor();
        }

        setTimeout(function() {
            view.editor.setValue("",0);
            if (model.get("preRequestScript")) {
                view.editor.setValue(model.get("preRequestScript"),-1);
            }
            else {
                view.editor.setValue("",-1);
            }
            //CodeMirror.commands["goDocStart"](view.editor);
            view.editor.gotoLine(0,0,false);
        }, 300);
    },

    updateModel: function() {
        if (this.editor) {
            this.model.set("preRequestScript", this.editor.getValue());
        }
    }

});

var RequestPrscriptEditorSnippets = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        this.render();

        pm.mediator.on("onShowPrscriptSnippets", function() {
            view.showPrscriptSnippets();
        });

        $("#request-prscript-editor-snippets-minimize").on("click", function() {
            view.hidePrscriptSnippets();
        });

        $("#request-prscript-editor-snippets-list").on("click", ".prscript-snippet a", function() {
            // console.log("Add snippet");
            var id = $(this).attr("data-id");
            model.addPrscriptSnippet(id);
        });
    },

    hidePrscriptSnippets: function() {
        pm.settings.setSetting("hidePrscriptSnippets", true);
        $(".request-prscript-editor-snippets").css("display", "none");

        pm.mediator.trigger("onHidePrscriptSnippets");
    },

    showPrscriptSnippets: function() {
        $(".request-prscript-editor-snippets").css("display", "block");
    },

    render: function() {
        $("#request-prscript-editor-snippets-list").html("");
        $("#request-prscript-editor-snippets-list").append(Handlebars.templates.prscript_snippets_list({"items": this.model.toJSON()}));
    }
});
var RequestSampleResponseList = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        model.on("loadRequest", this.render, this);
        model.on("change:responses", this.render, this);

        $("#request-samples").on("mouseenter", ".sample-response-container", function() {
        	var actionsEl = $('.sample-response-actions', this);
        	actionsEl.css('display', 'block');
        });

        $("#request-samples").on("mouseleave", ".sample-response-container", function() {
            var actionsEl = $('.sample-response-actions', this);
            actionsEl.css('display', 'none');
        });

        $("#request-samples").on("click", ".sample-response-actions-load", function() {
            var id = $(this).attr("data-id");
            view.loadResponse(id);
        });

        $("#request-samples").on("click", ".sample-response-actions-delete", function() {
            var id = $(this).attr("data-id");
            view.deleteResponse(id);
        });

        this.render();
    },

    loadResponse: function(id) {
        this.model.loadSampleResponseById(id);
    },

    deleteResponse: function(id) {
        this.model.deleteSampleResponseById(id);
    },

    render: function() {
    	var responses = this.model.get("responses");
        $("#request-samples-list").html("");


        if (responses) {
            if (responses.length > 0) {
                $("#request-samples").css("display", "block");
                $("#request-samples-list").append(Handlebars.templates.sample_responses({"items": responses}));
            }
            else {
                $("#request-samples").css("display", "none");
            }    
        }
        else {
            $("#request-samples").css("display", "none");
        }
    	
    }
});
var RequestTestsEditor = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        pm.mediator.on("refreshLayout", this.onRefreshLayout, this);
        pm.mediator.on("addSnippetToEditor", this.addSnippetToEditor, this);

        var snippets = new Snippets();
        this.snippetsList = new RequestTestsEditorSnippets({ model: snippets });

        this.model.on("startNew", this.onStartNew, this);    

        pm.mediator.on("onHideSnippets", function() {
            view.setLayout();
        });

        pm.mediator.on("purchaseComplete", function(newPurchase) {
            if (newPurchase.id === "collection-runner") {
                view.hidePurchaseMessage();
            }
        });

        pm.mediator.on("loadedPurchases", function(purchases) {            
            if (purchases.isUpgradeAvailable("collection-runner")) {
                view.hidePurchaseMessage();
            }
            else {
                view.showPurchaseMessage();

                if (pm.purchases.isTrialCompleted("collection-runner")) {
                    $("#request-tests .try-jetpacks").remove();
                }
            }
        });

        pm.mediator.on("switchCodeMirrorTheme", this.onSwitchCodeMirrorTheme, this);

        $("#request-tests-editor-snippets-maximize").on("click", function() {
            pm.settings.setSetting("hideSnippets", false);
            pm.mediator.trigger("onShowSnippets");
            view.setLayout();
        });

        $("#request-tests").on("click", ".know-more-collection-runner", function() {
            tracker.sendEvent('test_runner', 'know_more', 'test_editor');
            pm.mediator.trigger("startPurchaseFlow", "test_runner");
        });

        setTimeout(function() {
            view.setLayout();
        }, 1000);

        if (!this.editor) {
            this.initializeEditor();
        }

    },

    onSwitchCodeMirrorTheme: function(theme) {        
        var codeMirror = this.editor;

        if (codeMirror) {
            codeMirror.setTheme("ace/theme/"+theme);
        }        
    },

    hidePurchaseMessage: function() {
        var view = this;

        $(".request-tests-purchase-message").css("display", "none");
        $(".request-tests-wrapper").css("display", "block");
        setTimeout(function() {
            view.setLayout();
            view.loadTests();
        }, 1000);
    },

    showPurchaseMessage: function() {
        $(".request-tests-purchase-message").css("display", "block");
        $(".request-tests-wrapper").css("display", "none");
    },

    addSnippetToEditor: function(snippet) {        
        if (this.editor) {
            var code = this.editor.getValue();

            if(code !== "") {
                code += "\n\n";    
            }
            
            code += snippet.get("code");
            this.editor.setValue(code,1);
        }
    },

    setLayout: function() {        
        var areSnippetsHidden = pm.settings.getSetting("hideSnippets");

        // TODO Change these to fluid layouts later
        var containerWidth = $(document).width() - 385;
        var testEditorWidth;

        if (!areSnippetsHidden) {
            testEditorWidth = containerWidth - 200;
            $("#request-tests-editor-snippets-maximize").css("display", "none");
            $(".request-tests-editor-snippets").css("display", "block");
        }
        else {
            testEditorWidth = containerWidth;
            $("#request-tests-editor-snippets-maximize").css("display", "block");
            $(".request-tests-editor-snippets").css("display", "none");
        }

        $(".request-tests-editor-codemirror").css("width", testEditorWidth + "px");

        // Reenable resizing
        // $(".request-tests-editor-codemirror").css("height", "300px"); 
        // $(".request-tests-editor-snippets").css("height", "300px");
        $(".request-tests-editor-snippets").css("width", "197px");
    },

    onRefreshLayout: function() {
        this.setLayout();
    },

    onStartNew: function() {
        this.hideTests();
    },

    initializeEditor: function() {
        var view = this;
        
        if (this.editor) {
            return;
        }

        view.setLayout();

        var theme = pm.settings.getSetting("postmanCodeMirrorTheme");

        this.editor = ace.edit(document.getElementById("tests-aceeditor"));
        this.editor.getSession().setMode('ace/mode/javascript');

        var codeMirror = this.editor;

        $(".request-tests-editor-codemirror").resizable({
            stop: function() {
                codeMirror.resize(true);
            }
        });

        this.editor.resize();

        setTimeout(function() {            
            view.setLayout();            
            pm.mediator.trigger("refreshLayout");
        }, 750);
    },

    showTests: function() {
        $("#request-tests").css("display", "block");    
    },

    hideTests: function() {        
        $("#request-tests").css("display", "none");
    },

    loadTests: function() {
        var model = this.model;
        var view = this;

        // TODO Should only be called if the textarea is visible        
        if (!this.editor) {
            this.initializeEditor();
        }

        setTimeout(function() {
            view.editor.setValue("",-1);
            if (model.get("tests")) {
                view.editor.setValue(model.get("tests"), -1);
            }
            else {
                view.editor.setValue("", -1);
            }

            view.editor.gotoLine(0,0,false);
        }, 250);
    },

    updateModel: function() {        
        if (this.editor) {            
            this.model.set("tests", this.editor.getValue());    
        }        
    }

});

var RequestTestsEditorSnippets = Backbone.View.extend({
	initialize: function() {
		var model = this.model;
		var view = this;

		this.render();

		pm.mediator.on("onShowSnippets", function() {
			view.showSnippets();
		});

		$("#request-tests-editor-snippets-minimize").on("click", function() {
			view.hideSnippets();
		});

		$("#request-tests-editor-snippets-list").on("click", ".test-snippet a", function() {
			// console.log("Add snippet");
			var id = $(this).attr("data-id");
			model.addSnippet(id);
		});
	},

	hideSnippets: function() {				
		pm.settings.setSetting("hideSnippets", true);		
		$(".request-tests-editor-snippets").css("display", "none");

		pm.mediator.trigger("onHideSnippets");
	},

	showSnippets: function() {		
		$(".request-tests-editor-snippets").css("display", "block");
	},

	render: function() {		
		$("#request-tests-editor-snippets-list").html("");
		$("#request-tests-editor-snippets-list").append(Handlebars.templates.test_snippets_list({"items": this.model.toJSON()}));
	}
});
var RequestURLEditor = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        var editorId;
        editorId = "#url-keyvaleditor";

        this.editorId = editorId;

        model.on("change:url", this.onChangeUrl, this);
        model.on("updateURLInputText", this.onUpdateURLInputText, this);
        model.on("startNew", this.onStartNew, this);
        model.on("customURLParamUpdate", this.onCustomUrlParamUpdate, this);

	    var params = {
		    placeHolderKey:"URL Parameter Key",
		    placeHolderValue:"Value",
		    deleteButton:'<span class="icon-delete"/>',
		    encodeValues: false,
		    disableOption: false,
		    onDeleteRow:function () {
			    var params = view.getUrlEditorParams();
			    // TODO Simplify this
			    model.set("url", $("#url").val());
			    model.setUrlParams(params);
			    model.setUrlParamString(params, true);
		    },

		    onBlurElement:function () {
			    var params = view.getUrlEditorParams();
			    var url = $("#url").val();
			    model.setUrlParams(params);
			    model.setUrlParamString(params, true, url);
		    }
	    };

        $(editorId).keyvalueeditor('init', params);

        $('#url').keyup(function () {
            var newRows = getUrlVars($('#url').val(), false);
            $('#url-keyvaleditor').keyvalueeditor('reset', newRows);
        });

        var urlFocusHandler = function () {
            if(pm.app.isModalOpen()) {
                return;
            }

            $('#url').focus();
            return false;
        };

        try {
            $("#url").autocomplete({
                source: pm.urlCache.getUrls(),
                delay: 50,
                select: function(event, ui) {
                    $("#url").attr("data-cancel-enter", "true");
                    return false;
                }
            });
        }
        catch(e) {

        }

        $(document).bind('keydown', 'backspace', urlFocusHandler);
    },

    onCustomUrlParamUpdate: function() {
        this.openUrlEditor();
    },

    onUpdateURLInputText: function() {
        var url = this.model.get("url");
        $("#url").val(url);
    },

    onChangeUrl: function() {
        var url = this.model.get("url");
        $("#url").val(url);

        var newRows = getUrlVars(url, false);
        $('#url-keyvaleditor').keyvalueeditor('reset', newRows);
    },

    onStartNew: function(model) {
        $("#url").val("");
        var newRows = [];
        $(this.editorId).keyvalueeditor('reset', newRows);
        $('#url').focus();
    },

    updateModel: function() {
        this.model.set("url", $("#url").val());
        this.model.setUrlParamString(this.getUrlEditorParams(), true);
    },

    openAndInitUrlEditor: function() {
        var newRows = getUrlVars($('#url').val(), false);
        $("#url-keyvaleditor").keyvalueeditor('reset', newRows);
        this.openUrlEditor();
    },

    openUrlEditor:function () {
        $('#url-keyvaleditor-actions-open').addClass("active");
        var containerId = "#url-keyvaleditor-container";
        $(containerId).css("display", "block");
    },

    closeUrlEditor:function () {
        $('#url-keyvaleditor-actions-open').removeClass("active");
        var containerId = "#url-keyvaleditor-container";
        $(containerId).css("display", "none");
    },

    getUrlEditorParams:function () {
        var editorId = "#url-keyvaleditor";
        var params = $(editorId).keyvalueeditor('getValues');
        var newParams = [];
        for (var i = 0; i < params.length; i++) {
            var param = {
                //key:encodeURIComponent(params[i].key).replace(/%7B%7B/,"{{").replace(/%7D%7D/,"}}"),
                //value:encodeURIComponent(params[i].value).replace(/%7B%7B/,"{{").replace(/%7D%7D/,"}}").replace(/%3B/,";")
                key:params[i].key,
                value:params[i].value
            };

            newParams.push(param);
        }

        return newParams;
    }
});
var RequestURLPathVariablesEditor = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        var editorId = "#pathvariables-keyvaleditor";
        this.editorId = editorId;

        model.on("change:url", this.onChangeUrl, this);
        model.on("startNew", this.onStartNew, this);

        var params = {
            placeHolderKey:"Path variable key",
            placeHolderValue:"Value",
            deleteButton:'<span class="icon-delete"/>',
            editableKeys: false,
            onDeleteRow:function () {
                view.setUrl();
            },

            onBlurElement:function () {
                view.setUrl();
            }
        };

        $('#url').keyup(function () {
            var url = $(this).val();
            view.setEditorParams(url);
        });

        $(editorId).keyvalueeditor('init', params);
    },

    setUrl: function() {
        var params = this.getEditorParams();

        // TODO Simplify this
        this.model.set("url", $("#url").val());
        this.model.setPathVariables(params);
    },

    loadEditorParams: function(params) {
        var rows = [];
        var row;

        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                row = {
                    "key": key,
                    "value": params[key]
                }

                rows.push(row);
            }
        }

        $(this.editorId).keyvalueeditor('reset', rows);
    },

    setEditorParams: function(url) {
        var newKeys = getURLPathVariables(url);
        var currentParams = $(this.editorId).keyvalueeditor('getValues');
        var param;
        var keyExists;
        var newParams = [];
        var newParam;

        for (var i = 0; i < currentParams.length; i++) {
            param = currentParams[i];
            keyIndex = _.indexOf(newKeys, param.key);

            if (keyIndex >= 0) {
                newParams.push(param);
                newKeys.splice(keyIndex, 1);
            }
        }

        for (i = 0; i < newKeys.length; i++) {
            newParam = {
                "key": newKeys[i],
                "value": ""
            };

            newParams.push(newParam);
        }

        $(this.editorId).keyvalueeditor('reset', newParams);
    },

    onChangeUrl: function() {
        // Generate keyvaleditor rows
        this.setEditorParams($("#url").val());
    },

    startNew: function() {
        var newRows = [];
        $(this.editorId).keyvalueeditor('reset', newRows);
    },

    updateModel: function() {
        this.setUrl();
    },

    getEditorParams: function() {
        var params = $(this.editorId).keyvalueeditor('getValues');
        var assocParams = {};

        for (var i = 0; i < params.length; i++) {
            assocParams[params[i].key] = params[i].value;
        }

        return assocParams;
    },

    openEditor:function () {
        var containerId = "#pathvariables-keyvaleditor-container";
        $(containerId).css("display", "block");
        var val = $("#url").val();
        this.setEditorParams(val);
    },

    closeEditor:function () {
        var containerId = "#pathvariables-keyvaleditor-container";
        $(containerId).css("display", "none");
        this.updateModel();
    }
});
var ResponseBodyIFrameViewer = Backbone.View.extend({
    initialize: function() {
    	var model = this.model;
    	var response = model.get("response");
    	response.on("finishedLoadResponse", this.render, this);
    },

    render: function() {
    	var model = this.model;
    	var request = model;
    	var response = model.get("response");
    	var previewType = response.get("previewType");
    	var text = response.get("text");

    	if (previewType === "html") {
    	    $("#response-as-preview").html("");
    	    var cleanResponseText = model.stripScriptTag(text);
    	    pm.filesystem.renderResponsePreview("response.html", cleanResponseText, "html", function (response_url) {
    	        $("#response-as-preview").html("<iframe scrolling='yes' id='previewIframe'></iframe>");
    	        $("#response-as-preview iframe").attr("src", response_url);
                $('#previewIframe').removeAttr('sandbox');
    	        $('#previewIframe').load(function(){
                    var iframe = document.getElementById('previewIframe');
					try {
						iframe.height = Math.max(
							document.getElementById('previewIframe').contentWindow.document.body.scrollHeight,
							document.getElementById('previewIframe').contentWindow.outerHeight
						);
					}
					catch(e) {
						iframe.height = 600;
					}
                    iframe.contentWindow.document.body.style["-webkit-user-select"] = "initial";
                    iframe.contentWindow.document.body.style["word-break"] = "break-word";
                    iframe.contentWindow.document.body.style["-webkit-user-select"] = "text";

					if(pm.settings.getSetting("postmanTheme")==="dark" && response.get("language")!=="html") {
						iframe.contentWindow.document.body.style["color"] = "rgb(202,202,202)";
					}
					else {
						iframe.contentWindow.document.body.style["color"] = "rgb(20,20,20)";
					}
                    $('#previewIframe').attr('sandbox','');
                });
    	    });
    	    
    	}
    }
});
var ResponseBodyImageViewer = Backbone.View.extend({
    initialize: function() {
    	var model = this.model;
    	var response = model.get("response");
    	response.on("finishedLoadResponse", this.render, this);
    },

    // Source: http://stackoverflow.com/questions/8022425/getting-blob-data-from-xhr-request
    renderAsImage: function(responseData) {
        var uInt8Array = new Uint8Array(responseData);
        var i = uInt8Array.length;
        var binaryString = new Array(i);
        while (i--)
        {
          binaryString[i] = String.fromCharCode(uInt8Array[i]);
        }
        var data = binaryString.join('');

        var base64 = window.btoa(data);
        this.createBase64Image(base64);
    },

    createBase64Image: function(base64) {
        $("#response-as-image").html("<img id='response-as-image-inline'/>");
        document.getElementById("response-as-image-inline").src="data:image/png;base64,"+base64;
    },

    render: function() {
    	var model = this.model;
    	var request = model;
    	var response = model.get("response");
    	var previewType = response.get("previewType");
        var responseRawDataType = response.get("rawDataType");

        var useInterceptor = pm.settings.getSetting("useInterceptor");

    	if (previewType === "image" && responseRawDataType === "text") {
    		$('#response-as-image').css("display", "block");
            if (!useInterceptor) {
                model.trigger("send", "arraybuffer");
            }            
        }
        else if (previewType === "image" && responseRawDataType === "arraybuffer") {
            if (!useInterceptor) {
                var responseData = response.get("responseData");
                this.renderAsImage(responseData);    
            }
            else {                
                var base64 = response.get("responseData");
                this.createBase64Image(base64);
            }            
        }    	
    }
});
var ResponseBodyPDFViewer = Backbone.View.extend({
    initialize: function() {
    	var model = this.model;
    	var response = model.get("response");
    	response.on("finishedLoadResponse", this.render, this);
    },

    render: function() {
    	var model = this.model;
    	var response = model.get("response");
    	var previewType = response.get("previewType");
    	var responseRawDataType = response.get("rawDataType");

    	if (previewType === "pdf" && responseRawDataType === "arraybuffer") {
            // console.log("Render the PDF");
            
	    	var responseData = response.get("responseData");    	
	    	$("#response-as-preview").html("");
	    	$("#response-as-preview").css("display", "block");

            var filename = "response.pdf";
            var type = "pdf";

            pm.filesystem.saveAndOpenFile(filename, responseData, type, function () {
                noty(
                    {
                        type:'success',
                        text:'Saved PDF to disk',
                        layout:'topCenter',
                        timeout:750
                    });
            });
    	}    	
    	else if (previewType === "pdf" && responseRawDataType === "text") {
    	 	// Trigger an arraybuffer request with the same parameters       	 	
            model.trigger("send", "arraybuffer");
    	}
    }
});
var ResponseBodyPrettyViewer = Backbone.View.extend({
	defineCodeMirrorLinksMode:function () {
		var editorMode = this.mode;
	},

	toggleLineWrapping:function () {
        var pMode = $("span#currentPrettyMode").html();
        var buttonStatus = $("#response-body-line-wrapping").hasClass("active");
        if(pMode==="HTML" || pMode==="Text") {
            var codeMirror = this.codeMirror;

            var lineWrapping = codeMirror.getSession().getUseWrapMode();
            if (lineWrapping === true) {
                $('#response-body-line-wrapping').removeClass("active");
                lineWrapping = false;
                codeMirror.getSession().setUseWrapMode(false);
            }
            else {
                $('#response-body-line-wrapping').addClass("active");
                lineWrapping = true;
                codeMirror.getSession().setUseWrapMode(true);
            }

            pm.settings.setSetting("lineWrapping", lineWrapping);
            //codeMirror.refresh();
        }
        else {
            if(buttonStatus) {
                $("#response-as-code").css('word-wrap','normal');
                $(".xv-wrap").removeClass("xv-wrap");
            }
            else {
                $("#response-as-code").css('word-wrap','break-word');
                $(".xv-attr,.xv-text,.xv-tag-name").addClass("xv-wrap");
            }
        }

        $("#response-body-line-wrapping").toggleClass("active");
	},

	initialize: function() {
		this.codeMirror = null;
		this.mode = "text";
		this.defineCodeMirrorLinksMode();

		pm.cmp = this.codeMirror;

        pm.mediator.on("switchCodeMirrorTheme", this.onSwitchCodeMirrorTheme, this);

		pm.mediator.on("focusPrettyViewer", this.onFocusPrettyViewer, this);
	},

    onSwitchCodeMirrorTheme: function(theme) {
        var codeMirror = this.codeMirror;

        if (codeMirror) {
            codeMirror.setTheme("ace/theme/"+theme);
        }
    },

	onFocusPrettyViewer: function() {
		// console.log("Trigger keydown on CodeMirror");
	},

	showJSONPretty: function(response) {
        $("#prettySearchToggle").addClass("active");
        $("#prettySearchToggle").click();
		$("span#currentPrettyMode").html("JSON");
		$("div#response-as-code>div.CodeMirror").hide();
		$("div.treeView#jsonTree").show();
		this.model.set("jsonPreParse",response);
		if(!this.model.get("jsonIsCurrent")) {
            if(!pm.isTesting) {
                this.jv_processJSON_worker(response);
            }
            else {
                var renderedJSON = jv_processJSON(response);
                this.renderJSON(renderedJSON);
            }
        }
		this.model.set("jsonIsCurrent",true)
	},

    jv_processJSON_worker: function(content) {
        var jsonWorker = new Worker("jsonWorker.js");
        var oldThis = this;
        $(".jv-source-pane-inner").html("Loading...");
        //console.log("Sending to jsonview");
        jsonWorker.onmessage = function(content) {
            //console.log("Recd from jsonview");
            if(content.data==="error") {
                $(".jv-source-pane-inner").html("Malformed JSON");
            }
            else {
                oldThis.renderJSON(content.data);
            }

        }
        jsonWorker.postMessage(content);
    },

    renderJSON: function(content) {
        $(".jv-source-pane-inner").html(content);
        //console.log("first part done");
        setTimeout(function() {
            //console.log("Timeout started");
            var items = $(".collapsible.jv");//document.getElementsByClassName('collapsible jv');
            for( var i = 0; i < items.length; i++) {
                jv_addCollapser(items[i].parentNode);
            }

            $("li.jv:not(:last-child)").append(",");
            //console.log("Timoeut complete");
        },10);
    },


    showXMLPretty: function(response) {
        $("#prettySearchToggle").addClass("active");
        $("#prettySearchToggle").click();
		$("span#currentPrettyMode").html("XML");
		$("div#response-as-code>div.CodeMirror").hide();
		$("div.treeView#xmlTree").show();
		if(!this.model.get("xmlIsCurrent")) xv_controller.process(response);
		this.model.set("xmlIsCurrent",true);
	},

	showHTMLPretty: function(response) {
        $("#prettySearchToggle").addClass("active");
        $("#prettySearchToggle").click();
		$("span#currentPrettyMode").html("HTML");
		$("div#response-as-code>div.CodeMirror").hide();
		$("div.treeView#htmlView").show();
		this.model.set("htmlPreParse",response);
		if(!this.model.get("htmlIsCurrent")) {
			$("code.html-source-pane-inner").html("Loading...");
			//response = html_beautify(response);
			//Rainbow.color(response, 'html', function(highlighted_code) {
			//	$("code.html-source-pane-inner").html(highlighted_code);
			//	$("code.html-source-pane-inner").html($("code.html-source-pane-inner").html().replace(/<\/span>((.|\n)+?)(?=<span)/g,'<\/span><span class="rainbow plainText">$1</span>'));
			//});
		}
		this.model.set("htmlIsCurrent",true)
	},

    showHTMLPretty_new: function(language, format, response, codeDataArea, renderMode, lineWrapping) {
        var foldFunc;
        var mode;

        $("span#currentPrettyMode").html("HTML");
        $("#htmlView").show();
        this.model.set("htmlPreParse",response);
        this.model.set("inHtmlMode",true);
        if(!this.model.get("htmlIsCurrent") && format === 'parsed') {
            response = vkbeautify.xml(response);
            mode = 'xml';
            $('#response-language a[data-mode="html"]').addClass("active");
            this.model.set("htmlIsCurrent",true);
        }

        if (pm.settings.getSetting("lineWrapping") === true) {
            $('#response-body-line-wrapping').addClass("active");
            lineWrapping = true;
        }
        else {
            $('#response-body-line-wrapping').removeClass("active");
            lineWrapping = false;
        }

        this.mode = mode;
        this.defineCodeMirrorLinksMode();

        var codeMirror = this.codeMirror;

        var theme = pm.settings.getSetting("postmanCodeMirrorTheme");
        if (!codeMirror) {
            $('#response .CodeMirror').remove();

            codeMirror = ace.edit(codeDataArea);
            codeMirror.setReadOnly(true);

            codeMirror.setValue(response, -1);
            var theme = (pm.settings.getSetting("postmanTheme")==="light")?"clouds":"monokai";
            codeMirror.setTheme("ace/theme/"+theme);
            codeMirror.getSession().on('tokenizerUpdate', function() {
                console.log("changed");
            });
            //codeMirror.refresh();

            this.codeMirror = codeMirror;
        }
        else {
            codeMirror.setReadOnly(true);
            codeMirror.setValue(response, -1);
            codeMirror.gotoLine(0,0,false);
            $(window).scrollTop(0);
        }
        if(language==="html") {
            codeMirror.getSession().setMode('ace/mode/html');
            $("span#currentPrettyMode").html("HTML");

            setTimeout(function() {
                var hrefs = $(".ace_entity.ace_other.ace_attribute-name");
                hrefs.each(function(index) {
                    var href = $(this);
                    if(href.html().toLowerCase()==="href") {
                        var next = href.next();
                        if(next) {
                            var url = next.next();
                            url.addClass("ace-editor-link");
                        }
                    }
                });
            },1000);
        }
        else {
            codeMirror.getSession().setMode('ace/mode/plain_text');
            $("span#currentPrettyMode").html("Text");
        }
    }
});

var ResponseBodyRawViewer = Backbone.View.extend({
    initialize: function() {

    }
});
var ResponseBodyViewer = Backbone.View.extend({
    initialize: function() {
        var view = this;
        var model = this.model;
        var response = model.get("response");
        response.on("finishedLoadResponse", this.load, this);        

        this.responseBodyPrettyViewer = new ResponseBodyPrettyViewer({model: this.model});
        this.responseBodyRawViewer = new ResponseBodyRawViewer({model: this.model});
        this.responseBodyIFrameViewer = new ResponseBodyIFrameViewer({model: this.model});

        this.responseBodyImageViewer = new ResponseBodyImageViewer({model: this.model});
        this.responseBodyPDFViewer = new ResponseBodyPDFViewer({model: this.model});        

        $(document).bind('keydown', 'ctrl+f', function() {
            view.searchResponse();
        });

        $(document).bind('keydown', 'meta+f', function() {
            view.searchResponse();
        });

        // REFACTOR: This needs to be refactored more and put in a different function
        // Need to ensure that function sizes are as small as possible

        //Bind search events for JSON/XML/HTML pretty modes
        $(".jv-search-field").keyup(function(e) {
            if(e.keyCode==27) {
                $("span.jv_searchFound").contents().unwrap();
                view.model.set("jsonSearchString","");
                $(".search-panel").hide();
                $("#prettySearchToggle").removeClass("active");
                $(this).val("");
            }
            if(e.keyCode==13) {
                e.preventDefault();

                jv_processJSON(view.model.get("jsonPreParse"));
                $("span.jv_searchFound").contents().unwrap();
                view.model.set("jsonSearchString",this.value);
                var searchString = view.model.get("jsonSearchString");
                if(searchString == "") {
                    $(".jv-search-panel>.sidebar-search-cancel").hide();
                    return;
                }

                var regExSpecial = "+?^[]()$*|.";
                var ns="";
                for(i=0;i<searchString.length;i++) {
                    if(regExSpecial.indexOf(searchString[i])==-1) {
                        ns+=searchString[i]
                    }
                    else ns+="\\"+searchString[i]
                }
                var searchStringReg=ns;


                $(".jv-search-panel>.sidebar-search-cancel").show();
                $("span.jv.string , span.jv.num , span.jv.prop , span.jv.bool , a.jv.link").each(function() {
                    if(this.innerHTML.toLowerCase().indexOf(searchString.toLowerCase())!=-1) {
                        var ih = this.innerHTML;
                        var regex = new RegExp( '(' + searchStringReg + ')', 'gi' );
                        ih = ih.replace(regex,'<span class="jv_searchFound">$1</span>');
                        this.innerHTML = ih;
                    }
                });
                if($("span.jv_searchFound").length>0) {
                    var cur_node = $("span.jv_searchFound")[0];
                    if ('scrollIntoViewIfNeeded' in cur_node)
                        cur_node.scrollIntoViewIfNeeded();
                    else
                        cur_node.scrollIntoView();
                    view.model.set("scrollToNextResult",0);
                }

                $(".search-panel").hide();
                $("#prettySearchToggle").removeClass("active");
                $(this).val("")
            }
        });
        
        // REFACTOR: This needs to be refactored more and put in a different function
        // Need to ensure that function sizes are as small as possible
        $(".html-search-field").keyup(function(e) {
            e.stopPropagation();

            $("span.jv_searchFound").contents().unwrap();

            view.model.set("htmlSearchString",this.value);
            var searchString = view.model.get("htmlSearchString");
            if(searchString == "") {
                $(".html-search-panel>.sidebar-search-cancel").hide();
                return;
            }
            var regExSpecial = "+?^[]()$*|.";
            var ns="";
            for(i=0;i<searchString.length;i++) {
                if(regExSpecial.indexOf(searchString[i])==-1) {
                    ns+=searchString[i];
                }
                else ns+="\\"+searchString[i]
            }
            var searchStringReg=ns;

            $(".html-search-panel>.sidebar-search-cancel").show();

            $("span.rainbow.support.tag-name , span.rainbow.comment.html , span.rainbow.support.attribute , span.rainbow.string.value , span.rainbow.plainText , span.rainbow.entity.tag.script , span.rainbow.entity.tag.style").each(function() {
                if($(this).hasClass("plainText") && $(this).children().length!=0) {
                    return true;
                }
                if(this.innerHTML.toLowerCase().indexOf(searchString.toLowerCase())!=-1) {
                    var ih = this.innerHTML;
                    var regex = new RegExp( '(' + searchStringReg + ')', 'gi' );
                    ih = ih.replace(regex,'<span class="jv_searchFound">$1</span>');
                    this.innerHTML = ih;
                }
            });

            if($("span.jv_searchFound").length>0) {
                var cur_node = $("span.jv_searchFound")[0];
                if ('scrollIntoViewIfNeeded' in cur_node)
                    cur_node.scrollIntoViewIfNeeded();
                else
                    cur_node.scrollIntoView();
                view.model.set("scrollToNextResult",0);
            }
        });
        
        $(".sidebar-search-cancel").click(function() {
        	var t=$(this);
        	t.parent().children(".search-field").val("");
        	t.hide();
        	$("span.jv_searchFound").contents().unwrap();
            $(".search-panel").hide();
            $("#prettySearchToggle").removeClass("active");
            view.model.set("jsonSearchString","");
            view.model.set("xmlSearchString","");
            view.model.set("htmlSearchString","");
        });

    },

    searchResponse: function() {
        //this.changePreviewType("parsed");
        //CodeMirror.commands.find(this.responseBodyPrettyViewer.codeMirror);
    },

    downloadBody: function(response) {
        var previewType = response.get("previewType");
        var responseRawDataType = response.get("rawDataType");
        var filedata;
        var type = previewType;
        var filename = "response" + "." + previewType;

        var useInterceptor = pm.settings.getSetting("useInterceptor");
        if (responseRawDataType === "arraybuffer") {
            filedata = response.get("responseData");

            if (useInterceptor) {
                filedata = ArrayBufferEncoderDecoder.decode(filedata);                
            }
        }
        else {
            filedata = text;
        }

        pm.filesystem.saveAndOpenFile(filename, filedata, type, function () {
            noty(
                {
                    type:'success',
                    text:'Saved response to disk',
                    layout:'topCenter',
                    timeout:750
                });
        });
    },

    load: function() {
        var model = this.model;
        var request = model;
        var response = model.get("response");
        var previewType = response.get("previewType");
        var responseRawDataType = response.get("rawDataType");
        var presetPreviewType = pm.settings.getSetting("previewType");
        var language = response.get("language");
        var text = response.get("text");

        var activeDataSection = pm.settings.getSetting("responsePreviewDataSection");

        var action = model.get("action");
        var forceRaw = response.get("forceRaw");
        if(forceRaw === true) {
            presetPreviewType = 'raw';
            noty(
                {
                    type:'warning',
                    text:'Response too big for Pretty mode. Click \'Pretty\' to force. Doing so may result in unexpected behavior',
                    layout:'topCenter',
	                timeout: 750
                });
        }

        if (action === "download") {
            $('#response-data-container').css("display", "none");
            this.downloadBody(response);
        }
        else {
            if (model.get("method") !== "HEAD") {
                $('#response-data-container').css("display", "block");
            }

            if (previewType === "image") {
                $('#response-as-code').css("display", "none");
                $('#response-as-text').css("display", "none");
                $('#response-as-image').css("display", "block");

                $('#response-formatting').css("display", "none");
                $('#response-actions').css("display", "none");
                $("#response-language").css("display", "none");
                $("#response-as-preview").css("display", "none");
                $("#response-copy-container").css("display", "none");
                $("#response-pretty-modifiers").css("display", "none");
            }
            else if (previewType === "pdf" && responseRawDataType === "arraybuffer") {
                // Hide everything else
                $('#response-as-code').css("display", "none");
                $('#response-as-text').css("display", "none");
                $('#response-as-image').css("display", "none");

                $('#response-formatting').css("display", "none");
                $('#response-actions').css("display", "none");
                $("#response-language").css("display", "none");
                $("#response-copy-container").css("display", "none");
                $("#response-pretty-modifiers").css("display", "none");
            }
            else if (previewType === "pdf" && responseRawDataType === "text") {
            }
            else {
                this.displayTextResponse(language, text, presetPreviewType, true);
            }

            if (activeDataSection !== "body") {
                $("#response-data-container").css("display", "none");
            }
        }
    },

    displayTextResponse:function (language, response, format, forceCreate) {
        //var codeDataArea = document.getElementById("code-data");
        var htmlDiv = $("#html-aceeditor")[0];
        var codeDataWidth = $(document).width() - $('#sidebar').width() - 60;
        var mode;
        var lineWrapping;
        var renderMode = mode;

        //Keep CodeMirror div visible otherwise the response gets cut off
        $("#response-copy-container").css("display", "block");

        $('#response-as-code').css("display", "block");
        $('#response-as-text').css("display", "none");
        $('#response-as-image').css("display", "none");

        $('#response-formatting').css("display", "block");
        $('#response-actions').css("display", "block");

        $('#response-formatting a').removeClass('active');
        $('#response-formatting a[data-type="' + format + '"]').addClass('active');

        $('#code-data').css("display", "none");
        $('#code-data').attr("data-mime", language);

        $('#response-language').css("display", "block");
        //$('#response-language a').removeClass("active");
        $("span#currentPrettyMode").html("Default");
        this.model.set("inHtmlMode",false);
        $("div.treeView").hide();
        
        if (language === 'javascript' && format=== 'parsed') {
        	this.responseBodyPrettyViewer.showJSONPretty(response);
        }
        else if(language === 'xml' && format=== 'parsed') {
            console.log("Render XML response");
        	this.responseBodyPrettyViewer.showXMLPretty(response);
        }
        else {
            // REFACTOR: This needs to be refactored more and put in a different function
            // Need to ensure that function sizes are as small as possible
        	$("div#response-as-code>div.CodeMirror").show();
            $(".search-panel").hide();
            $("#prettySearchToggle").removeClass("active");
            $(".CodeMirror-dialog.CodeMirror-dialog-top").remove();

            if(format === 'parsed') {
                this.responseBodyPrettyViewer.showHTMLPretty_new(language, format, response, htmlDiv, renderMode, lineWrapping);
            }

        }
        if (format === "parsed") {
            $('#response-as-code').css("display", "block");
            $('#response-as-text').css("display", "none");
            $('#response-as-preview').css("display", "none");
            $('#response-pretty-modifiers').css("display", "block");
        }
        else if (format === "raw") {
            $('#code-data-raw').val(response);
            $('#code-data-raw').css("width", codeDataWidth + "px");
            $('#code-data-raw').css("height", "600px");
            $('#response-as-code').css("display", "none");
            $('#response-as-text').css("display", "block");
            $('#response-pretty-modifiers').css("display", "none");
        }
        else if (format === "preview") {
            $('#response-as-code').css("display", "none");
            $('#response-as-text').css("display", "none");
            $('#response-as-preview').css("display", "block");
            $('#response-pretty-modifiers').css("display", "none");
        }

        var documentHeight = $(document).height();
        $(".xv-source-pane-inner").css('height',(documentHeight-331)+"px");
        $(".xv-outline").css('height',(documentHeight-301)+"px");
        $("#response-as-code>.CodeMirror").css('height',(documentHeight-295)+"px");
    },

    loadImage: function(url) {
        var remoteImage = new RAL.RemoteImage({
            priority: 0,
            src: imgLink,
            headers: this.model.getXhrHeaders()
        });

        remoteImage.addEventListener('loaded', function(remoteImage) {
        });

        $("#response-as-image").html("");
        var container = document.querySelector('#response-as-image');
        container.appendChild(remoteImage.element);

        RAL.Queue.add(remoteImage);
        RAL.Queue.setMaxConnections(4);
        RAL.Queue.start();
    },

    changePreviewType:function (newType) {
        var request = this.model;
        var response = request.get("response");
        var previewType = response.get("previewType");
        var text = response.get("text");

        if (previewType === newType) {
            return;
        }

        var language = this.model.get("response").get("language");

        previewType = newType;
        response.set("previewType", newType);
        pm.settings.setSetting("previewType", newType);

        $('#response-formatting a').removeClass('active');
        $('#response-formatting a[data-type="' + previewType + '"]').addClass('active');

        if (previewType === 'raw') {
            $('#response-as-text').css("display", "block");
            $('#response-as-code').css("display", "none");
            $('#response-as-preview').css("display", "none");
            $('#code-data-raw').val(text);
            var codeDataWidth = $(document).width() - $('#sidebar').width() - 60;
            $('#code-data-raw').css("width", codeDataWidth + "px");
            $('#code-data-raw').css("height", "600px");
            $('#response-pretty-modifiers').css("display", "none");
        }
        else if (previewType === 'parsed') {
            if(language==="javascript" && !this.model.get("jsonIsCurrent")) {
                this.responseBodyPrettyViewer.showJSONPretty(text);
            }
            else if(language==="xml" && !this.model.get("xmlIsCurrent")) {
                this.responseBodyPrettyViewer.showXMLPretty(text);
            }
            else if(language==="html" && !this.model.get("htmlIsCurrent")) {
                this.responseBodyPrettyViewer.showHTMLPretty(text);
            }

            $('#response-as-text').css("display", "none");
            $('#response-as-code').css("display", "block");
            $('#response-as-preview').css("display", "none");
            $('#code-data').css("display", "none");
            $('#response-pretty-modifiers').css("display", "block");
            // TODO Throwing an error
            // this.responseBodyPrettyViewer.codeMirror.refresh();
        }
        else if (previewType === 'preview') {
            $('#response-as-text').css("display", "none");
            $('#response-as-code').css("display", "none");
            $('#code-data').css("display", "none");
            $('#response-as-preview').css("display", "block");
            $('#response-pretty-modifiers').css("display", "none");
        }
    },

    toggleBodySize:function () {
        var request = this.model;
        var response = request.get("response");
        var state = response.get("state");

        if ($('#response').css("display") === "none") {
            return false;
        }

        $('a[rel="tooltip"]').tooltip('hide');

        if (state.size === "normal") {
            state.size = "maximized";
            $('#response-body-toggle span').removeClass("icon-size-toggle-maximize");
            $('#response-body-toggle span').addClass("icon-size-toggle-minimize");
            state.width = $('#response-data').width();
            state.height = $('#response-data').height();
            state.display = $('#response-data').css("display");
            state.overflow = $('#response-data').css("overflow");
            state.position = $('#response-data').css("position");

            $('#response-data').css("position", "absolute");
            $('#response-data').css("overflow", "scroll");
            $('#response-data').css("left", 0);
            $('#response-data').css("top", "-15px");
            $('#response-data').css("width", $(document).width() - 20);
            $('#response-data').css("height", $(document).height());
            $('#response-data').css("z-index", 100);
            $('#response-data').css("padding", "10px");
        }
        else {
            state.size = "normal";
            $('#response-body-toggle span').removeClass("icon-size-toggle-minimize");
            $('#response-body-toggle span').addClass("icon-size-toggle-maximize");
            $('#response-data').css("position", state.position);
            $('#response-data').css("overflow", state.overflow);
            $('#response-data').css("left", 0);
            $('#response-data').css("top", 0);
            $('#response-data').css("width", state.width);
            $('#response-data').css("height", state.height);
            $('#response-data').css("z-index", 10);
            $('#response-data').css("padding", "0px");
        }

        $('#response-body-toggle').focus();

        response.set("state", state);
    },

    toggleLineWrapping: function() {
        this.responseBodyPrettyViewer.toggleLineWrapping();
    },

    setMode:function (mode) {
        var model = this.model;
        var request = model;
        var response = model.get("response");
        var responseBody = response.get("body");

        var text = response.get("text");

        // TODO Make sure this is being stored properly
        var previewType = pm.settings.getSetting("previewType");
        this.displayTextResponse(mode, text, previewType, true);
    }
});
var ResponseCookieViewer = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var response = model.get("response");
        response.on("finishedLoadResponse", this.load, this);
    },

    load: function() {
        var model = this.model;
        var response = model.get("response");
        var cookies = response.get("cookies");

        if (cookies) {
            var count = 0;
            if (!cookies) {
                count = 0;
            }
            else {
                count = cookies.length;
            }

            if (count === 0) {
                $("#response-tabs-cookies").html("Cookies");                
                $('#response-tabs-cookies').css("display", "block");

                $('#response-cookies').css("display", "none");
                $('#response-cookies-not-found-message').css("display", "block");
            }
            else {
                $("#response-tabs-cookies").html("Cookies (" + count + ")");
                $('#response-tabs-cookies').css("display", "block");

                $('#response-cookies').css("display", "table");
                $('#response-cookies-not-found-message').css("display", "none");
                
                cookies = _.sortBy(cookies, function (cookie) {
                    return cookie.name;
                });

                for (var i = 0; i < count; i++) {
                    var cookie = cookies[i];
                    cookie.name = limitStringLineWidth(cookie.name, 20);
                    cookie.value = limitStringLineWidth(cookie.value, 20);
                    cookie.path = limitStringLineWidth(cookie.path, 20);
                    if ("expirationDate" in cookie) {
                        var date = new Date(cookie.expirationDate * 1000);
                        cookies[i].expires = date.toLocaleString();
                    }
                }

                $('#response-cookies-items').html(Handlebars.templates.response_cookies({"items":cookies}));
            }
        }

    }
});
var ResponseHeaderViewer = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var response = model.get("response");
        response.on("finishedLoadResponse", this.load, this);
    },

    load:function (data) {
        var model = this.model;
        var request = model;
        var response = model.get("response");
        var headers = response.get("headers");        

        $('.response-tabs li[data-section="headers"]').html("Headers (" + headers.length + ")");
        $('#response-headers').html("");
        $("#response-headers").append(Handlebars.templates.response_headers({"items":headers}));
        $('.response-header-name').popover({
            trigger: "hover"
        });
    },
});
var ResponseMetaViewer = Backbone.View.extend({
    initialize: function() {
    	var model = this.model;
    	var response = model.get("response");
    	response.on("finishedLoadResponse", this.render, this);
    },

    render: function() {
    	var model = this.model;
    	var request = model;
    	var response = model.get("response");
    	var time = response.get("time");

    	$('#response-status').css("display", "block");

    	$('#response-status').html(Handlebars.templates.item_response_code(response.get("responseCode")));
    	$('.response-code').popover({
    	    trigger: "hover"
    	});

    	$('#response-time .data').html(time + " ms");
    }
});
var ResponseSaver = Backbone.View.extend({
    initialize: function() {
    	var model = this.model;
    	var view = this;

    	$("#response-sample-save-start").on("click", function() {
    		view.showSaveForm();
    	});

	    $("#response-sample-save").on("click", function() {
	    	view.saveResponse();
	    });

	    $("#response-sample-cancel").on("click", function() {
	    	view.cancelSaveResponse();
	    });
    },

    showSaveForm: function() {
		$("#response-sample-save-start").css("display", "none");
		$("#response-sample-save-form").css("display", "block");
    },

    hideSaveForm: function() {
    	$("#response-sample-save-start").css("display", "block");
    	$("#response-sample-save-form").css("display", "none");
    },

    // This needs the request model to be up to date
    saveResponse: function() {
        var view = this;

        pm.mediator.trigger("updateRequestModel", function() {
            view.hideSaveForm();

            var name = $("#response-sample-name").val();

            var response = view.model.get("response");
            $("#response-sample-name").val("");
            response.saveAsSample(name);
        });
    },

    cancelSaveResponse: function() {
        $("#response-sample-name").val("");
    	this.hideSaveForm();
    }
});
var ResponseViewer = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var responseModel = model.get("response");
        var view = this;

        this.defaultSection = "body";

        this.responseBodyViewer = new ResponseBodyViewer({model: this.model});
        this.responseHeaderViewer = new ResponseHeaderViewer({model: this.model});
        this.responseCookieViewer = new ResponseCookieViewer({model: this.model});
        this.responseMetaViewer = new ResponseMetaViewer({model: this.model});
        this.responseSaver = new ResponseSaver({model: this.model});

        this.testResultViewer = new TestResultViewer({model: this.model});

        responseModel.on("failedRequest", this.onFailedRequest, this);
        responseModel.on("clearResponse", this.clear, this);
        responseModel.on("sentRequest", this.onSentRequest, this);
        responseModel.on("loadResponse", this.load, this);

        $('#response-body-toggle').on("click", function () {
            view.responseBodyViewer.toggleBodySize();
        });

        $('#response-body-line-wrapping').on("click", function () {
            view.responseBodyViewer.toggleLineWrapping();
            return true;
        });

        $('#response-formatting').on("click", "a", function () {
            var previewType = $(this).attr('data-type');
            view.responseBodyViewer.changePreviewType(previewType);
        });

        $('#response-language').on("click", "a", function () {
            var language = $(this).attr("data-mode");
            view.responseBodyViewer.setMode(language);
        });

        $('#response-data,#response-headers').on("mousedown", ".cm-link", function () {
            var link = $(this).html();
            if(link[0]=='/') {
                var currentUrl = model.get("url");
                //get the first part of the URL (after http:// and before the first /)
                function getFirstPart(url) {
                    var indexOfTS = url.indexOf("//");
                    if(indexOfTS==-1) {
                        return url.split("/")[0];
                    }
                    else {
                        var fp = url.substring(indexOfTS+2);
                        return url.substring(0,indexOfTS)+"//"+fp.split("/")[0];
                    }

                }
                link = getFirstPart(currentUrl) + link;

            }
            var headers = $('#headers-keyvaleditor').keyvalueeditor('getValues');
            model.loadRequestFromLink(link, headers);
        });

        $('.response-tabs').on("click", "li", function () {
            var section = $(this).attr('data-section');
            pm.settings.setSetting("responsePreviewDataSection", section);

            if (section === "body") {
                view.showBody();
            }
            else if (section === "headers") {
                view.showHeaders();
            }
            else if (section === "cookies") {
                view.showCookies();
            }
            else if (section === "tests") {
                view.showTests();
            }
        });


        $(document).bind('keydown', 'f', function () {
            if(pm.app.isModalOpen()) {
                return;
            }

            view.responseBodyViewer.toggleBodySize();
        });

        //Helper funcs for detecting links in the response header - POSTman pull request 795
        var linkRegex = /(\s*<\s*)([^>]*)(\s*>[^,]*,?)/g;

        var linkFunc = function (all, pre_uri, uri, post_uri) {
            return Handlebars.Utils.escapeExpression(pre_uri)
                + "<span class=\"cm-link\">"
                + uri
                + "</span>"
                + Handlebars.Utils.escapeExpression(post_uri);
        };

        Handlebars.registerHelper('link_to_hyperlink', function(linkValue) {
            var output = linkValue.replace(linkRegex, linkFunc);
            return new Handlebars.SafeString(output);
        });
    },

    onSentRequest: function() {
        this.showScreen("waiting");
    },

    onFailedRequest: function(errorUrl) {
        $('#connection-error-url').html("<a href='" + errorUrl + "' target='_blank'>" + errorUrl + "</a>");
        this.showScreen("failed");
    },

    clear: function() {
        $('#response').css("display", "none");
    },

    load:function () {
        var model = this.model;
        var request = model;
        var response = model.get("response");
        var headers = response.get("headers");
        var time = response.get("time");

        var previewType = response.get("previewType");
        var language = response.get("language");
        var responseRawDataType = response.get("rawDataType");
        var responseData = response.get("responseData");
        var text = response.get("text");
        var method = request.get("method");
        var action = model.get("action");
        var presetPreviewType = pm.settings.getSetting("previewType");

        var activeSection = pm.settings.getSetting("responsePreviewDataSection");

        this.showScreen("success");

        $('#response').css("display", "block");
        $("#response-data").css("display", "block");

        if (action === "download") {
            this.showHeaders();
        }
        else {
            if (method === "HEAD") {
                this.showHeaders();
            }
            else {
                if (activeSection === "body") {
                    this.showBody();
                }
                else if (activeSection === "headers") {
                    this.showHeaders();
                }
                else if (activeSection === "tests") {
                    this.showTests();
                }
                else if (activeSection === "cookies") {
                    this.showCookies();
                }
                else {
                    this.showBody();
                }
            }
        }

        if (request.get("isFromCollection") === true) {
            $("#response-collection-request-actions").css("display", "block");
        }
        else {
            $("#response-collection-request-actions").css("display", "none");
        }

        response.trigger("finishedLoadResponse");
        $("#response-as-code, #response-as-code .CodeMirror, textarea#code-data-raw").css("font-size", pm.settings.getSetting("responseFontSize")+"px");
    },

    showHeaders:function () {
        $('.response-tabs li').removeClass("active");
        $('.response-tabs li[data-section="headers"]').addClass("active");
        $('#response-data-container').css("display", "none");
        $('#response-headers-container').css("display", "block");
        $('#response-cookies-container').css("display", "none");
        $('#response-tests-container').css("display", "none");
    },

    showBody:function () {
        $('.response-tabs li').removeClass("active");
        $('.response-tabs li[data-section="body"]').addClass("active");
        $('#response-data-container').css("display", "block");
        $('#response-headers-container').css("display", "none");
        $('#response-cookies-container').css("display", "none");
        $('#response-tests-container').css("display", "none");
    },

    showCookies:function () {
        $('.response-tabs li').removeClass("active");
        $('.response-tabs li[data-section="cookies"]').addClass("active");
        $('#response-data-container').css("display", "none");
        $('#response-headers-container').css("display", "none");
        $('#response-cookies-container').css("display", "block");
        $('#response-tests-container').css("display", "none");
    },

    showTests:function () {
        $('.response-tabs li').removeClass("active");
        $('.response-tabs li[data-section="tests"]').addClass("active");
        $('#response-data-container').css("display", "none");
        $('#response-headers-container').css("display", "none");
        $('#response-cookies-container').css("display", "none");
        $('#response-tests-container').css("display", "block");
    },

    showScreen:function (screen) {
        $("#response").css("display", "block");
        var active_id = "#response-" + screen + "-container";
        var all_ids = ["#response-waiting-container",
            "#response-failed-container",
            "#response-success-container"];
        for (var i = 0; i < 3; i++) {
            $(all_ids[i]).css("display", "none");
        }

        $(active_id).css("display", "block");
    }
});
var URLCache = Backbone.Model.extend({
    defaults: function() {
        return {
            "urls": []
        }
    },

    initialize: function() {
        var model = this;

        pm.mediator.on("addToURLCache", function(url) {
            model.addUrl(url);
        });
    },

    addUrl:function (url) {
        var urls = this.get("urls");

        if ($.inArray(url, urls) === -1) {
            urls.push(url);
        }
    },

    getUrls: function() {
        return this.get("urls");
    }
});
pm.filesystem = {
    fs:{},

    onInitFs:function (filesystem) {
        pm.filesystem.fs = filesystem;
    },

    errorHandler:function (e) {
        var msg = '';

        switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        default:
            msg = 'Unknown Error';
            break;
        }

        console.log('Error: ' + msg);
    },

    init:function () {
        window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, this.onInitFs, this.errorHandler);
    },

    removeFileIfExists:function (name, callback) {
        pm.filesystem.fs.root.getFile(name,
            {create:false}, function (fileEntry) {
                fileEntry.remove(function () {
                    callback();
                }, function () {
                    callback();
                });
            }, function () {
                callback();
            });
    },

    renderResponsePreview:function (name, data, type, callback) {
        name = encodeURI(name);
        name = name.replace("/", "_");
        pm.filesystem.removeFileIfExists(name, function () {
            pm.filesystem.fs.root.getFile(name,
                {create:true},
                function (fileEntry) {
                    fileEntry.createWriter(function (fileWriter) {

                        fileWriter.onwriteend = function (e) {
                            var properties = {
                                url:fileEntry.toURL()
                            };

                            callback(properties.url);
                        };

                        fileWriter.onerror = function (e) {
                            callback(false);
                        };

                        var blob;
                        if (type === "pdf") {
                            blob = new Blob([data], {type:'application/pdf'});
                        }
                        else {
                            blob = new Blob([data], {type:'text/plain'});
                        }
                        fileWriter.write(blob);


                    }, pm.filesystem.errorHandler);


                }, pm.filesystem.errorHandler
            );
        });
    },

    saveAndOpenFile:function (name, data, type, callback) {
        name = encodeURIComponent(name);
        chrome.fileSystem.chooseEntry({type: 'saveFile', suggestedName: name}, function(writableFileEntry) {
            if (!writableFileEntry) {
                return;
            }

            writableFileEntry.createWriter(function(writer) {
                var truncated = false;

                writer.onerror = function (e) {
                    callback();
                };

                writer.onwriteend = function(e) {
                    if (!truncated) {
                        truncated = true;
                        this.truncate(this.position);
                        return;
                    }

                    // console.log('write complete');
                    callback();
                };

                var blob;
                if (type === "pdf") {
                    blob = new Blob([data], {type:'application/pdf'});
                }
                else {
                    blob = new Blob([data], {type:'text/plain'});
                }
                
                writer.write(blob);
            }, pm.filesystem.errorHandler);
        });

    }
};
pm.indexedDB = {
    TABLE_HEADER_PRESETS: "header_presets",
    TABLE_HELPERS: "helpers",
    TABLE_DRIVE_FILES: "drive_files",
    TABLE_DRIVE_CHANGES: "drive_changes",
    TABLE_OAUTH2_ACCESS_TOKENS: "oauth2_access_tokens",
    TABLE_TEST_RUNS: "test_runs",

    onTransactionComplete: function(callback) {
        if (pm.isTesting) {
            pm.indexedDB.clearAllObjectStores(function() {
                callback();
            });
        }
        else {
            callback();
        }
    },

    onerror:function (event, callback) {
        console.log("Could not load DB", event);
        pm.mediator.trigger("error");
    },

    open_v21:function (callback) {
        var request = indexedDB.open(pm.databaseName, "POSTman request history");
        request.onsuccess = function (e) {
            var v = "0.7.8";
            pm.indexedDB.db = e.target.result;
            var db = pm.indexedDB.db;

            //We can only create Object stores in a setVersion transaction
            if (v !== db.version) {
                var setVrequest = db.setVersion(v);

                setVrequest.onfailure = function (e) {
                    console.log(e);
                };

                setVrequest.onsuccess = function (event) {
                    //Only create if does not already exist
                    if (!db.objectStoreNames.contains("requests")) {
                        var requestStore = db.createObjectStore("requests", {keyPath:"id"});
                        requestStore.createIndex("timestamp", "timestamp", { unique:false});
                    }

                    if (!db.objectStoreNames.contains("collections")) {
                        var collectionsStore = db.createObjectStore("collections", {keyPath:"id"});
                        collectionsStore.createIndex("timestamp", "timestamp", { unique:false});
                    }

                    if (!db.objectStoreNames.contains("collection_requests")) {
                        var collectionRequestsStore = db.createObjectStore("collection_requests", {keyPath:"id"});
                        collectionRequestsStore.createIndex("timestamp", "timestamp", { unique:false});
                        collectionRequestsStore.createIndex("collectionId", "collectionId", { unique:false});
                    }

                    if (db.objectStoreNames.contains("collection_responses")) {
                        db.deleteObjectStore("collection_responses");
                    }

                    if (!db.objectStoreNames.contains("environments")) {
                        var environmentsStore = db.createObjectStore("environments", {keyPath:"id"});
                        environmentsStore.createIndex("timestamp", "timestamp", { unique:false});
                        environmentsStore.createIndex("id", "id", { unique:false});
                    }

                    if (!db.objectStoreNames.contains("header_presets")) {
                        var headerPresetsStore = db.createObjectStore("header_presets", {keyPath:"id"});
                        headerPresetsStore.createIndex("timestamp", "timestamp", { unique:false});
                    }

                    if (!db.objectStoreNames.contains(pm.indexedDB.TABLE_HELPERS)) {
                        var helpersStore = db.createObjectStore(pm.indexedDB.TABLE_HELPERS, {keyPath:"id"});
                        helpersStore.createIndex("timestamp", "timestamp", { unique:false});
                    }

                    if (!db.objectStoreNames.contains(pm.indexedDB.TABLE_DRIVE_FILES)) {
                        var driveFilesStore = db.createObjectStore(pm.indexedDB.TABLE_DRIVE_FILES, {keyPath:"id"});
                        driveFilesStore.createIndex("timestamp", "timestamp", { unique:false});
                        driveFilesStore.createIndex("fileId", "fileId", { unique:false});
                    }
                    else {
                        var driveFilesStoreForIndex = request.transaction.objectStore(pm.indexedDB.TABLE_DRIVE_FILES);
                        driveFilesStoreForIndex.createIndex("fileId", "fileId", { unique:false});
                    }

                    if (!db.objectStoreNames.contains(pm.indexedDB.TABLE_DRIVE_CHANGES)) {
                        var driveChangesStore = db.createObjectStore(pm.indexedDB.TABLE_DRIVE_CHANGES, {keyPath:"id"});
                        driveChangesStore.createIndex("timestamp", "timestamp", { unique:false});
                    }

                    if (!db.objectStoreNames.contains(pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS)) {
                        var accessTokenStore = db.createObjectStore(pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS, {keyPath:"id"});
                        accessTokenStore.createIndex("timestamp", "timestamp", { unique:false});
                    }

                    if (!db.objectStoreNames.contains(pm.indexedDB.TABLE_TEST_RUNS)) {
                        var environmentsStore = db.createObjectStore(pm.indexedDB.TABLE_TEST_RUNS, {keyPath:"id"});
                        environmentsStore.createIndex("timestamp", "timestamp", { unique:false});
                    }

                    var transaction = event.target.result;
                    transaction.oncomplete = pm.indexedDB.onTransactionComplete;
                };

                setVrequest.onupgradeneeded = function (evt) {
                };
            }
        };

        request.onfailure = pm.indexedDB.onerror;
    },

    open_latest:function (callback) {
        var v = 34;
        var request = indexedDB.open(pm.databaseName, v);
        request.onupgradeneeded = function (e) {
            console.log("Upgrade DB");
            var db = e.target.result;
            pm.indexedDB.db = db;

            if (!db.objectStoreNames.contains("requests")) {
                var requestStore = db.createObjectStore("requests", {keyPath:"id"});
                requestStore.createIndex("timestamp", "timestamp", { unique:false});
            }

            if (!db.objectStoreNames.contains("collections")) {
                var collectionsStore = db.createObjectStore("collections", {keyPath:"id"});
                collectionsStore.createIndex("timestamp", "timestamp", { unique:false});
            }

            if (!db.objectStoreNames.contains("collection_requests")) {
                var collectionRequestsStore = db.createObjectStore("collection_requests", {keyPath:"id"});
                collectionRequestsStore.createIndex("timestamp", "timestamp", { unique:false});
                collectionRequestsStore.createIndex("collectionId", "collectionId", { unique:false});
            }

            if (db.objectStoreNames.contains("collection_responses")) {
                db.deleteObjectStore("collection_responses");
            }

            if (!db.objectStoreNames.contains("environments")) {
                var environmentsStore = db.createObjectStore("environments", {keyPath:"id"});
                environmentsStore.createIndex("timestamp", "timestamp", { unique:false});
                environmentsStore.createIndex("id", "id", { unique:false});
            }

            if (!db.objectStoreNames.contains("header_presets")) {
                var headerPresetsStore = db.createObjectStore("header_presets", {keyPath:"id"});
                headerPresetsStore.createIndex("timestamp", "timestamp", { unique:false});
            }

            if (!db.objectStoreNames.contains(pm.indexedDB.TABLE_HELPERS)) {
                var helpersStore = db.createObjectStore(pm.indexedDB.TABLE_HELPERS, {keyPath:"id"});
                helpersStore.createIndex("timestamp", "timestamp", { unique:false});
            }

            if (!db.objectStoreNames.contains(pm.indexedDB.TABLE_DRIVE_FILES)) {
                var driveFilesStore = db.createObjectStore(pm.indexedDB.TABLE_DRIVE_FILES, {keyPath:"id"});
                driveFilesStore.createIndex("timestamp", "timestamp", { unique:false});
                driveFilesStore.createIndex("fileId", "fileId", { unique:false});
            }

            if (!db.objectStoreNames.contains(pm.indexedDB.TABLE_DRIVE_CHANGES)) {
                var driveChangesStore = db.createObjectStore(pm.indexedDB.TABLE_DRIVE_CHANGES, {keyPath:"id"});
                driveChangesStore.createIndex("timestamp", "timestamp", { unique:false});
            }

            if (!db.objectStoreNames.contains(pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS)) {
                var accessTokenStore = db.createObjectStore(pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS, {keyPath:"id"});
                accessTokenStore.createIndex("timestamp", "timestamp", { unique:false});
            }

            if (!db.objectStoreNames.contains(pm.indexedDB.TABLE_TEST_RUNS)) {
                var environmentsStore = db.createObjectStore(pm.indexedDB.TABLE_TEST_RUNS, {keyPath:"id"});
                environmentsStore.createIndex("timestamp", "timestamp", { unique:false});
            }
        };

        request.onsuccess = function (e) {
            pm.indexedDB.db = e.target.result;
            pm.indexedDB.onTransactionComplete(callback);
        };

        request.onerror = pm.indexedDB.onerror;
    },

    open:function (callback) {
        if (parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2]) < 23) {
            pm.indexedDB.open_v21(callback);
        }
        else {
            console.log("Open latest DB");
            pm.indexedDB.open_latest(callback);
        }

        pm.mediator.on("initiateBackup", pm.indexedDB.downloadAllData);
    },    

    addCollection:function (collection, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collections"], "readwrite");
        var store = trans.objectStore("collections");

        var request;

        request = store.put(collection);

        request.onsuccess = function () {
            callback(collection);
        };

        request.onerror = function (e) {
            console.log(e.value);
        };
    },

    updateCollection:function (collection, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collections"], "readwrite");
        var store = trans.objectStore("collections");

        var boundKeyRange = IDBKeyRange.only(collection.id);
        var request = store.put(collection);

        request.onsuccess = function (e) {
            callback(collection);
        };

        request.onerror = function (e) {
            console.log(e.value);
        };
    },

    addCollectionRequest:function (req, callback) {        
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collection_requests"], "readwrite");
        var store = trans.objectStore("collection_requests");

        var collectionRequest = store.put(req);

        collectionRequest.onsuccess = function () {
            callback(req);
        };

        collectionRequest.onerror = function (e) {
            console.log(e.value);
        };
    },

    updateCollectionRequest:function (req, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collection_requests"], "readwrite");
        var store = trans.objectStore("collection_requests");

        var boundKeyRange = IDBKeyRange.only(req.id);
        var request = store.put(req);

        request.onsuccess = function (e) {
            callback(req);
        };

        request.onerror = function (e) {
            console.log(e.value);
        };
    },

    getCollection:function (id, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collections"], "readwrite");
        var store = trans.objectStore("collections");

        //Get everything in the store
        var cursorRequest = store.get(id);

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;
            callback(result);
        };
        cursorRequest.onerror = pm.indexedDB.onerror;
    },

    getCollections:function (callback) {
        var db = pm.indexedDB.db;

        if (db === null) {
            return;
        }

        var trans = db.transaction(["collections"], "readwrite");
        var store = trans.objectStore("collections");

        //Get everything in the store
        var keyRange = IDBKeyRange.lowerBound(0);
        var cursorRequest = store.openCursor(keyRange);
        var numCollections = 0;
        var items = [];
        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;
            if (!result) {
                callback(items);
                return;
            }

            var collection = result.value;
            numCollections++;

            items.push(collection);

            result['continue']();
        };

        cursorRequest.onerror = function (e) {
            console.log(e);
        };
    },

    getAllCollectionRequests:function (callback) {
        var db = pm.indexedDB.db;
        if (db === null) {
            return;
        }

        var trans = db.transaction(["collection_requests"], "readwrite");
        var store = trans.objectStore("collection_requests");

        //Get everything in the store
        var keyRange = IDBKeyRange.lowerBound(0);
        var index = store.index("timestamp");
        var cursorRequest = index.openCursor(keyRange);
        var collectionRequests = [];

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;

            if (!result) {
                if (callback) {
                    callback(collectionRequests);
                }

                return;
            }

            var request = result.value;
            collectionRequests.push(request);

            //This wil call onsuccess again and again until no more request is left
            result['continue']();
        };

        cursorRequest.onerror = pm.indexedDB.onerror;
    },

    getAllRequestsForCollectionId:function (id, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collection_requests"], "readwrite");

        //Get everything in the store
        var keyRange = IDBKeyRange.only(id);
        var store = trans.objectStore("collection_requests");

        var index = store.index("collectionId");
        var cursorRequest = index.openCursor(keyRange);

        var requests = [];

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;

            if (!result) {
                callback(requests);
                return;
            }

            var request = result.value;
            requests.push(request);

            //This wil call onsuccess again and again until no more request is left
            result['continue']();
        };
        cursorRequest.onerror = pm.indexedDB.onerror;
    },

    getAllRequestsInCollection:function (collection, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collection_requests"], "readwrite");

        //Get everything in the store
        var keyRange = IDBKeyRange.only(collection.id);
        var store = trans.objectStore("collection_requests");

        var index = store.index("collectionId");
        var cursorRequest = index.openCursor(keyRange);

        var requests = [];

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;

            if (!result) {
                callback(collection, requests);
                return;
            }

            var request = result.value;
            requests.push(request);

            //This wil call onsuccess again and again until no more request is left
            result['continue']();
        };
        cursorRequest.onerror = pm.indexedDB.onerror;
    },

    addRequest:function (historyRequest, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["requests"], "readwrite");
        var store = trans.objectStore("requests");
        var request = store.put(historyRequest);

        request.onsuccess = function (e) {
            callback(historyRequest);
        };

        request.onerror = function (e) {
            console.log(e.value);
        };
    },

    getRequest:function (id, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["requests"], "readwrite");
        var store = trans.objectStore("requests");

        //Get everything in the store
        var cursorRequest = store.get(id);

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;
            if (!result) {
                return;
            }

            callback(result);
        };
        cursorRequest.onerror = pm.indexedDB.onerror;
    },

    getCollectionRequest:function (id, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collection_requests"], "readwrite");
        var store = trans.objectStore("collection_requests");

        //Get everything in the store
        var cursorRequest = store.get(id);

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;
            if (!result) {
                return;
            }

            callback(result);
            return result;
        };
        cursorRequest.onerror = pm.indexedDB.onerror;
    },


    getAllRequestItems:function (callback) {
        var db = pm.indexedDB.db;
        if (db === null) {
            return;
        }

        var trans = db.transaction(["requests"], "readwrite");
        var store = trans.objectStore("requests");

        //Get everything in the store
        var keyRange = IDBKeyRange.lowerBound(0);
        var index = store.index("timestamp");
        var cursorRequest = index.openCursor(keyRange);
        var historyRequests = [];

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;

            if (!result) {
                callback(historyRequests);
                return;
            }

            var request = result.value;
            historyRequests.push(request);

            //This wil call onsuccess again and again until no more request is left
            result['continue']();
        };

        cursorRequest.onerror = pm.indexedDB.onerror;
    },

    deleteRequest:function (id, callback) {
        try {
            var db = pm.indexedDB.db;
            var trans = db.transaction(["requests"], "readwrite");
            var store = trans.objectStore(["requests"]);

            var request = store['delete'](id);

            request.onsuccess = function () {
                callback(id);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        }
        catch (e) {
            console.log(e);
        }
    },

    deleteHistory:function (callback) {
        var db = pm.indexedDB.db;
        var clearTransaction = db.transaction(["requests"], "readwrite");
        var clearRequest = clearTransaction.objectStore(["requests"]).clear();
        clearRequest.onsuccess = function (event) {
            callback();
        };
    },

    deleteCollectionRequest:function (id, callback) {
        pm.indexedDB.getCollectionRequest(id, function(collectionRequest) {
            var db = pm.indexedDB.db;
            var trans = db.transaction(["collection_requests"], "readwrite");
            var store = trans.objectStore(["collection_requests"]);

            var request = store['delete'](id);

            request.onsuccess = function (e) {
                callback(id);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        });
    },

    deleteAllCollectionRequests:function (id) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collection_requests"], "readwrite");

        //Get everything in the store
        var keyRange = IDBKeyRange.only(id);
        var store = trans.objectStore("collection_requests");

        var index = store.index("collectionId");
        var cursorRequest = index.openCursor(keyRange);

        cursorRequest.onsuccess = function (e) {
            var result = e.target.result;

            if (!result) {
                return;
            }

            var request = result.value;
            pm.indexedDB.deleteCollectionRequest(request.id, function() {                
            });
            result['continue']();
        };
        cursorRequest.onerror = pm.indexedDB.onerror;
    },

    deleteCollection:function (id, callback) {
        var db = pm.indexedDB.db;
        var trans = db.transaction(["collections"], "readwrite");
        var store = trans.objectStore(["collections"]);

        var request = store['delete'](id);

        request.onsuccess = function () {
            // pm.indexedDB.deleteAllCollectionRequests(id);
            callback(id);
        };

        request.onerror = function (e) {
            console.log(e);
        };
    },

    environments:{
        addEnvironment:function (environment, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction(["environments"], "readwrite");
            var store = trans.objectStore("environments");
            var request = store.put(environment);

            request.onsuccess = function (e) {
                callback(environment);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        getEnvironment:function (id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction(["environments"], "readwrite");
            var store = trans.objectStore("environments");

            //Get everything in the store
            var cursorRequest = store.get(id);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                callback(result);
            };
            cursorRequest.onerror = pm.indexedDB.onerror;
        },

        deleteEnvironment:function (id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction(["environments"], "readwrite");
            var store = trans.objectStore(["environments"]);

            var request = store['delete'](id);

            request.onsuccess = function () {
                callback(id);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        getAllEnvironments:function (callback) {
            var db = pm.indexedDB.db;
            if (db === null) {
                return;
            }

            var trans = db.transaction(["environments"], "readwrite");
            var store = trans.objectStore("environments");

            //Get everything in the store
            var keyRange = IDBKeyRange.lowerBound(0);
            var index = store.index("timestamp");
            var cursorRequest = index.openCursor(keyRange);
            var environments = [];

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;

                if (!result) {
                    callback(environments);
                    return;
                }

                var request = result.value;
                environments.push(request);

                //This wil call onsuccess again and again until no more request is left
                result['continue']();
            };

            cursorRequest.onerror = pm.indexedDB.onerror;
        },

        updateEnvironment:function (environment, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction(["environments"], "readwrite");
            var store = trans.objectStore("environments");

            var boundKeyRange = IDBKeyRange.only(environment.id);
            var request = store.put(environment);

            request.onsuccess = function (e) {
                callback(environment);
            };

            request.onerror = function (e) {
                console.log(e.value);
            };
        }
    },

    helpers:{
        addHelper:function (helper, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_HELPERS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_HELPERS);
            var request = store.put(helper);

            request.onsuccess = function (e) {
                callback(helper);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        getHelper:function (id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_HELPERS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_HELPERS);

            //Get everything in the store
            var cursorRequest = store.get(id);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                callback(result);
            };

            cursorRequest.onerror = pm.indexedDB.onerror;
        }
    },

    headerPresets:{
        addHeaderPreset:function (headerPreset, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_HEADER_PRESETS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_HEADER_PRESETS);
            var request = store.put(headerPreset);

            request.onsuccess = function (e) {
                callback(headerPreset);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        getHeaderPreset:function (id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_HEADER_PRESETS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_HEADER_PRESETS);

            //Get everything in the store
            var cursorRequest = store.get(id);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                callback(result);
            };
            cursorRequest.onerror = pm.indexedDB.onerror;
        },

        deleteHeaderPreset:function (id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_HEADER_PRESETS], "readwrite");
            var store = trans.objectStore([pm.indexedDB.TABLE_HEADER_PRESETS]);

            var request = store['delete'](id);

            request.onsuccess = function () {
                callback(id);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        getAllHeaderPresets:function (callback) {
            var db = pm.indexedDB.db;
            if (db === null) {
                return;
            }

            var trans = db.transaction([pm.indexedDB.TABLE_HEADER_PRESETS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_HEADER_PRESETS);

            //Get everything in the store
            var keyRange = IDBKeyRange.lowerBound(0);
            var index = store.index("timestamp");
            var cursorRequest = index.openCursor(keyRange);
            var headerPresets = [];

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;

                if (!result) {
                    callback(headerPresets);
                    return;
                }

                var request = result.value;
                headerPresets.push(request);

                //This wil call onsuccess again and again until no more request is left
                result['continue']();
            };

            cursorRequest.onerror = pm.indexedDB.onerror;
        },

        updateHeaderPreset:function (headerPreset, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_HEADER_PRESETS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_HEADER_PRESETS);

            var boundKeyRange = IDBKeyRange.only(headerPreset.id);
            var request = store.put(headerPreset);

            request.onsuccess = function (e) {
                callback(headerPreset);
            };

            request.onerror = function (e) {
                console.log(e.value);
            };
        }
    },

    driveFiles: {
        addDriveFile:function (driveFile, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_FILES], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_DRIVE_FILES);
            var request = store.put(driveFile);

            request.onsuccess = function (e) {                
                callback(driveFile);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        getDriveFile:function (id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_FILES], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_DRIVE_FILES);

            //Get everything in the store
            var cursorRequest = store.get(id);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                callback(result);
            };

            cursorRequest.onerror = pm.indexedDB.onerror;
        },

        getDriveFileByFileId:function (fileId, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_FILES], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_DRIVE_FILES);

            //Get everything in the store
            var keyRange = IDBKeyRange.only(fileId);
            var index = store.index("fileId");
            var cursorRequest = index.openCursor(keyRange);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;                
                if(result) {
                    callback(result.value);
                }
                else {
                    callback(null);
                }

            };

            cursorRequest.onerror = function(e) {
                callback(null);
            };
        },

        deleteDriveFile:function (id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_FILES], "readwrite");
            var store = trans.objectStore([pm.indexedDB.TABLE_DRIVE_FILES]);

            var request = store['delete'](id);

            request.onsuccess = function () {
                callback(id);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        getAllDriveFiles:function (callback) {
            var db = pm.indexedDB.db;
            if (db === null) {
                return;
            }

            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_FILES], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_DRIVE_FILES);

            //Get everything in the store
            var keyRange = IDBKeyRange.lowerBound(0);
            var index = store.index("timestamp");
            var cursorRequest = index.openCursor(keyRange);
            var driveFiles = [];

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;

                if (!result) {
                    callback(driveFiles);
                    return;
                }

                var request = result.value;
                driveFiles.push(request);

                //This wil call onsuccess again and again until no more request is left
                result['continue']();
            };

            cursorRequest.onerror = pm.indexedDB.onerror;
        },

        updateDriveFile:function (driveFile, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_FILES], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_DRIVE_FILES);

            var boundKeyRange = IDBKeyRange.only(driveFile.id);
            var request = store.put(driveFile);

            request.onsuccess = function (e) {
                callback(driveFile);
            };

            request.onerror = function (e) {
                console.log(e.value);
            };
        }
    },


    driveChanges: {
        addDriveChange:function (driveChange, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_CHANGES], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_DRIVE_CHANGES);
            var request = store.put(driveChange);

            request.onsuccess = function (e) {
                callback(driveChange);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        getDriveChange:function (id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_CHANGES], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_DRIVE_CHANGES);

            //Get everything in the store
            var cursorRequest = store.get(id);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                callback(result);
            };
            cursorRequest.onerror = pm.indexedDB.onerror;
        },

        deleteDriveChange:function (id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_CHANGES], "readwrite");
            var store = trans.objectStore([pm.indexedDB.TABLE_DRIVE_CHANGES]);

            var request = store['delete'](id);

            request.onsuccess = function () {
                callback(id);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        getAllDriveChanges:function (callback) {
            var db = pm.indexedDB.db;
            if (db === null) {
                return;
            }

            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_CHANGES], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_DRIVE_CHANGES);

            //Get everything in the store
            var keyRange = IDBKeyRange.lowerBound(0);
            var index = store.index("timestamp");
            var cursorRequest = index.openCursor(keyRange);
            var driveChanges = [];

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;

                if (!result) {
                    driveChanges.sort(sortAscending);
                    callback(driveChanges);
                    return;
                }

                var request = result.value;
                driveChanges.push(request);

                //This wil call onsuccess again and again until no more request is left
                result['continue']();
            };

            cursorRequest.onerror = pm.indexedDB.onerror;
        },

        updateDriveChange:function (driveChange, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_DRIVE_CHANGES], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_DRIVE_CHANGES);

            var boundKeyRange = IDBKeyRange.only(driveChange.id);
            var request = store.put(driveChange);

            request.onsuccess = function (e) {
                callback(driveChange);
            };

            request.onerror = function (e) {
                console.log(e.value);
            };
        }
    },

    oAuth2AccessTokens: {
        addAccessToken: function(token, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS);
            var request = store.put(token);

            request.onsuccess = function (e) {
                callback(token);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        deleteAccessToken: function(id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS);

            //Get everything in the store
            var request = store['delete'](id);

            request.onsuccess = function (e) {
                callback(id);
            };
            request.onerror = pm.indexedDB.onerror;
        },

        getAllAccessTokens: function(callback) {
            var db = pm.indexedDB.db;
            if (db === null) {
                return;
            }

            var trans = db.transaction([pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS);

            //Get everything in the store
            var keyRange = IDBKeyRange.lowerBound(0);
            var index = store.index("timestamp");
            var cursorRequest = index.openCursor(keyRange);
            var accessTokens = [];

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;

                if (!result) {
                    callback(accessTokens);
                    return;
                }

                var request = result.value;
                accessTokens.push(request);

                //This wil call onsuccess again and again until no more request is left
                result['continue']();
            };

            cursorRequest.onerror = pm.indexedDB.onerror;
        },

        updateAccessToken:function (accessToken, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS);

            var boundKeyRange = IDBKeyRange.only(accessToken.id);
            var request = store.put(accessToken);

            request.onsuccess = function (e) {
                callback(accessToken);
            };

            request.onerror = function (e) {
                console.log(e.value);
            };
        },

        getAccessToken: function(id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_OAUTH2_ACCESS_TOKENS);

            //Get everything in the store
            var cursorRequest = store.get(id);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                callback(result);
            };
            cursorRequest.onerror = pm.indexedDB.onerror;
        }
    },

    testRuns: {
        addTestRun: function(testRun, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_TEST_RUNS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_TEST_RUNS);
            var request = store.put(testRun);

            request.onsuccess = function (e) {
                callback(testRun);
            };

            request.onerror = function (e) {
                console.log(e);
            };
        },

        deleteTestRun: function(id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_TEST_RUNS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_TEST_RUNS);

            //Get everything in the store
            var request = store['delete'](id);

            request.onsuccess = function (e) {
                callback(id);
            };
            request.onerror = pm.indexedDB.onerror;
        },

        getAllTestRuns: function(callback) {
            var db = pm.indexedDB.db;
            if (db === null) {
                return;
            }

            var trans = db.transaction([pm.indexedDB.TABLE_TEST_RUNS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_TEST_RUNS);

            //Get everything in the store
            var keyRange = IDBKeyRange.lowerBound(0);
            var index = store.index("timestamp");
            var cursorRequest = index.openCursor(keyRange);
            var testRuns = [];

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;

                if (!result) {
                    callback(testRuns);
                    return;
                }

                var request = result.value;
                testRuns.push(request);

                //This wil call onsuccess again and again until no more request is left
                result['continue']();
            };

            cursorRequest.onerror = pm.indexedDB.onerror;
        },

        updateTestRun:function (testRun, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_TEST_RUNS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_TEST_RUNS);

            var boundKeyRange = IDBKeyRange.only(testRun.id);
            var request = store.put(testRun);

            request.onsuccess = function (e) {
                callback(testRun);
            };

            request.onerror = function (e) {
                console.log(e.value);
            };
        },

        getTestRun: function(id, callback) {
            var db = pm.indexedDB.db;
            var trans = db.transaction([pm.indexedDB.TABLE_TEST_RUNS], "readwrite");
            var store = trans.objectStore(pm.indexedDB.TABLE_TEST_RUNS);

            //Get everything in the store
            var cursorRequest = store.get(id);

            cursorRequest.onsuccess = function (e) {
                var result = e.target.result;
                callback(result);
            };
            cursorRequest.onerror = pm.indexedDB.onerror;
        }
    },

    // TODO Refactor this. Needs to reduce dependencies
    downloadAllData: function(callback) {
        console.log("Starting to download all data");

        //Get globals
        var totalCount = 0;
        var currentCount = 0;
        var collections = [];
        var globals = [];
        var environments = [];
        var headerPresets = [];

        var onFinishGettingCollectionRequests = function(collection) {
            collections.push(collection);

            currentCount++;

            if (currentCount === totalCount) {
                onFinishExportingCollections(collections);
            }
        }

        var onFinishExportingCollections = function(c) {
            console.log(pm.envManager);

            globals = pm.envManager.get("globals").get("globals");

            //Get environments
            pm.indexedDB.environments.getAllEnvironments(function (e) {
                environments = e;
                pm.indexedDB.headerPresets.getAllHeaderPresets(function (hp) {
                    headerPresets = hp;
                    onFinishExporttingAllData(callback);
                });
            });
        }

        var onFinishExporttingAllData = function() {
            console.log("collections", collections);
            console.log("environments", environments);
            console.log("headerPresets", headerPresets);
            console.log("globals", globals);

            var dump = {
                version: 1,
                collections: collections,
                environments: environments,
                headerPresets: headerPresets,
                globals: globals
            };

            var name = "Backup.postman_dump";
            var filedata = JSON.stringify(dump, null, '\t');
            var type = "application/json";
            pm.filesystem.saveAndOpenFile(name, filedata, type, function () {
                if (callback) {
                    callback();
                }
            });
        }

        //Get collections
        //Get header presets
        pm.indexedDB.getCollections(function (items) {
            totalCount = items.length;
            pm.collections.items = items;
            var itemsLength = items.length;

            function onGetAllRequestsInCollection(collection, requests) {
                collection.requests = requests;
                onFinishGettingCollectionRequests(collection);
            }

            if (itemsLength !== 0) {
                for (var i = 0; i < itemsLength; i++) {
                    var collection = items[i];
                    pm.indexedDB.getAllRequestsInCollection(collection, onGetAllRequestsInCollection);
                }
            }
            else {
                globals = pm.envManager.get("globals").get("globals");

                pm.indexedDB.environments.getAllEnvironments(function (e) {
                    environments = e;
                    pm.indexedDB.headerPresets.getAllHeaderPresets(function (hp) {
                        headerPresets = hp;
                        onFinishExporttingAllData(callback);
                    });
                });
            }
        });
    },

    importAllData: function(files, callback, failCallback) {
        if (files.length !== 1) {
            return;
        }

        var f = files[0];
        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function (theFile) {
            return function (e) {
                // Render thumbnail.
                var data = e.currentTarget.result;
                var j = "";
                try {
                    j = jsonlint.parse(data);
                }
                catch(e) {
                    failCallback(e.message);
                    return;
                }
                var version = j.version;
                pm.indexedDB.importDataForVersion(version, j, callback);
            };
        })(files[0]);

        // Read in the image file as a data URL.
        reader.readAsText(files[0]);
    },

    importDataForVersion: function(version, data, callback) {
        if (version === 1) {
            var environments = pm.envManager.get("environments");
            var globals = pm.envManager.get("globals");

            if ("collections" in data) {
                console.log("Import collections");
                pm.collections.mergeCollections(data.collections);
            }

            if ("environments" in data) {
                console.log("Import environments");
                environments.mergeEnvironments(data.environments);
            }

            if ("globals" in data) {
                console.log("Import globals");
                globals.mergeGlobals(data.globals);
            }

            if ("headerPresets" in data) {
                console.log("Import headerPresets");
                pm.headerPresets.mergeHeaderPresets(data.headerPresets);
            }
        }

        callback();
    }
};
var Logger = Backbone.Model.extend({
	defaults: function() {
		return {
			toShow: true
		};
	},

	//For debug messages
	debug: function() {
		console.log(arguments);
	},

	//For stuff that is ok to be logged in production code. For ex. error messages
	message: function() {
		console.log(arguments);
	}
});
var Storage = Backbone.Model.extend({
    defaults: function() {
    },

    getValue: function(key, callback) {
        if (pm.target === pm.targets.CHROME_LEGACY_APP) {            
            callback(localStorage[key]);
        }
        else if (pm.target === pm.targets.CHROME_PACKAGED_APP) {
            var obj = {};
            obj[key] = null;
            chrome.storage.local.get(obj, function(result) {
                callback(result[key]);
            });
        }
    },

    setValue: function(kvpair, callback) {
        if (pm.target === pm.targets.CHROME_LEGACY_APP) {
            //Implementation here
            // console.log("Set value for legacy app");
            for(key in kvpair) {
                if (kvpair.hasOwnProperty(key)) {
                    localStorage[key] = kvpair[key];                    
                }
            }

            if (callback) {
                callback();    
            }            
        }
        else if (pm.target === pm.targets.CHROME_PACKAGED_APP) {
            chrome.storage.local.set(kvpair, function() {
                if (callback) {
                    callback();
                }                
            });
        }
    }
});
var Settings = Backbone.Model.extend({
    defaults: function() {
        return {
            lastRequest:"",
            autoSaveRequest:true,
            selectedEnvironmentId:"",
            type: "chromeStorageArea",
            items: {}
        };
    },

    resetSettings: function() {
        this.setSetting("historyCount", 100);
        this.setSetting("autoSaveRequest", true);
        this.setSetting("selectedEnvironmentId", true);
        this.setSetting("lineWrapping", true);
        this.setSetting("previewType", "parsed");
        this.setSetting("trimKeysAndValues", false);
        this.setSetting("retainLinkHeaders", false);
        this.setSetting("sendNoCacheHeader", true);
        this.setSetting("sendPostmanTokenHeader", true);
        this.setSetting("usePostmanProxy", false);
        this.setSetting("useInterceptor", false);
        this.setSetting("proxyURL", "");
        this.setSetting("lastRequest", "");
        this.setSetting("launcherNotificationCount", 0);
        this.setSetting("xhrTimeout", 0);
        this.setSetting("variableDelimiter", "{{...}}");
        this.setSetting("languageDetection", "auto");
        this.setSetting("haveDonated", false);
        this.setSetting("instantModals",true);
        this.setSetting("responseFontSize",13);

        this.setSetting("postmanTheme", "light");
        this.setSetting("postmanCodeMirrorTheme", "eclipse");


        this.setSetting("responsePreviewDataSection", "body");
        this.setSetting("requestBodyEditorContainerType", "editor");

        //Google Drive related
        this.setSetting("driveSyncPermissionStatus", "disabled"); //notconnected, connected, disabled
        this.setSetting("driveSyncEnabled", false);
        this.setSetting("driveStartChangeId", 0);
        this.setSetting("driveAppDataFolderId", 0);
        this.setSetting("lastDriveChangeTime", "");
        this.setSetting("syncedGlobals", false);

        this.setSetting("hideSnippets", false);
        this.setSetting("hidePrscriptSnippets", false);

        this.setSetting("interceptorRedirect", true);
    },

    initValues: function(callback) {
        this.set({"items": {}});

        var func = function(settingsJson) {
            if (settingsJson !== null) {
                this.set({"items": JSON.parse(settingsJson)});
            }

            this.create("historyCount", 100);
            this.create("autoSaveRequest", true);
            this.create("selectedEnvironmentId", true);
            this.create("lineWrapping", true);
            this.create("previewType", "parsed");
            this.create("trimKeysAndValues", false);
            this.create("retainLinkHeaders", false);
            this.create("sendNoCacheHeader", true);
            this.create("sendPostmanTokenHeader", true);
            this.create("usePostmanProxy", false);
            this.create("useInterceptor", false);
            this.create("proxyURL", "");
            this.create("lastRequest", "");
            this.create("xhrTimeout", 0);
            this.create("launcherNotificationCount", 0);
            this.create("variableDelimiter", "{{...}}");
            this.create("languageDetection", "auto");
            this.create("haveDonated", false);
            this.create("instantModals",true);

            this.create("postmanTheme", "light");
            this.create("postmanCodeMirrorTheme", "eclipse");

            this.create("responsePreviewDataSection", "body");
            this.create("requestBodyEditorContainerType", "editor");

            this.create("responseFontSize", 13);

            //Google Drive related
            this.create("driveSyncPermissionStatus", "not_asked"); //not_asked, asked, disabled
            this.create("driveSyncEnabled", false);
            this.create("driveStartChangeId", 0);
            this.create("driveAppDataFolderId", 0);
            this.create("lastDriveChangeTime", "");

            this.create("syncedGlobals", false);
            this.create("syncedHeaderPresets", false);

            this.create("hideSnippets", false);
            this.create("hidePrscriptSnippets", false);

            this.create("interceptorRedirect", true);

            if (pm.isTesting) {
                this.resetSettings();
            }

            callback();
        };

        func = _.bind(func, this);
        pm.storage.getValue("settings", func);
    },

    //This moves to the view initialize script?
    initListeners: function() {
    },

    test: function() {
        // console.log("Testing the function");
    },

    init:function (callback) {
        this.initValues(callback);
    },

    create:function (key, defaultVal) {
        if (!(key in this.get("items"))) {
            if (defaultVal !== "undefined") {
                this.setSetting(key, defaultVal);
            }
        }
    },

    setSetting:function (key, value) {
        //Need to clone otherwise Backbone will not fire the correct event
        var newItems = _.clone(this.get("items"));
        newItems[key] = value;
        this.set({items: newItems});

        var o = {'settings': JSON.stringify(this.get("items"))};
        pm.storage.setValue(o, function() {
        });
    },

    getSetting:function (key) {
        var val = this.get("items")[key];

        if (val === "true") {
            return true;
        }
        else if (val === "false") {
            return false;
        }
        else {
            return val;
        }
    },

    update: function(settings) {
        this.setSetting("historyCount", settings.historyCount, false);
        this.setSetting("autoSaveRequest", settings.autoSaveRequest, false);
        this.setSetting("retainLinkHeaders", settings.retainLinkHeaders, false);
        this.setSetting("sendNoCacheHeader", settings.sendNoCacheHeader, false);
        this.setSetting("variableDelimiter", settings.variableDelimiter, false);
        this.setSetting("languageDetection", settings.languageDetection, false);
        this.setSetting("haveDonated", settings.haveDonated, false);
        this.setSetting("instantModals",settings.instantModals, false);

        this.setSetting("responseFontSize", settings.responseFontSize, false);
        this.setSetting("interceptorRedirect", settings.interceptorRedirect, true);

        this.initValues();
        this.initListeners();
    },

    getAsJson: function() {
        var settings = {
            historyCount: this.getSetting("historyCount"),
            autoSaveRequest: this.getSetting("autoSaveRequest"),
            retainLinkHeaders: this.getSetting("retainLinkHeaders"),
            sendNoCacheHeader: this.getSetting("sendNoCacheHeader"),
            variableDelimiter: this.getSetting("variableDelimiter"),
            languageDetection: this.getSetting("languageDetection"),
            haveDonated: this.getSetting("haveDonated"),
            instantModals: this.getSetting("instantModals"),
            responseFontSize: this.getSetting("responseFontSize"),
            interceptorRedirect: this.getSetting("interceptorRedirect")
        };

        return settings;
    }
});
var DebugInfo = Backbone.View.extend({
	initialize: function() {
		var model = this.model;
		var view = this;

		this.render();		
	},

	render: function() {
		var manifest = chrome.runtime.getManifest();
		$('.postman-version').html("Version " + manifest.version + " (packaged)");

		chrome.runtime.getPlatformInfo(function(platformInfo) {
			var osInfo = "OS: <strong>" + platformInfo.os + "</strong><br/>";
			osInfo += "Architecture: <strong>" + platformInfo.arch + "</strong><br/>";
			osInfo += "Native client architecture: <strong>" + platformInfo.nacl_arch + "</strong><br/>";

			$('.postman-os-info').html(osInfo);
		});
	}
});
var SettingsModal = Backbone.View.extend({
    el: $("#modal-settings"),

    initialize: function() {
        var settings = this.model;
        var debugInfo = new DebugInfo({model: this.model});

        var themeSettingsTab = new ThemeSettingsTab({model: settings});

        this.model.on('change:items', this.render, this);

        $("#modal-settings").on("shown", function () {
            $("#history-count").focus();
            pm.app.trigger("modalOpen", "#modal-settings");
        });

        $("#modal-settings").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        $('#history-count').change(function () {
            settings.setSetting("historyCount", $('#history-count').val());
        });


        $('#auto-save-request').change(function () {
            var val = $('#auto-save-request').val();
            if (val === "true") {
                settings.setSetting("autoSaveRequest", true);
            }
            else {
                settings.setSetting("autoSaveRequest", false);
            }
        });

        $('#trim-keys-and-values').change(function () {
            var val = $('#trim-keys-and-values').val();
            if (val === "true") {
                settings.setSetting("trimKeysAndValues", true);
            }
            else {
                settings.setSetting("trimKeysAndValues", false);
            }
        });

        $('#retain-link-headers').change(function () {
            var val = $('#retain-link-headers').val();
            if (val === "true") {
                settings.setSetting("retainLinkHeaders", true);
            }
            else {
                settings.setSetting("retainLinkHeaders", false);
            }
        });

        $('#send-no-cache-header').change(function () {
            var val = $('#send-no-cache-header').val();
            if (val === "true") {
                settings.setSetting("sendNoCacheHeader", true);
            }
            else {
                settings.setSetting("sendNoCacheHeader", false);
            }
        });

        $('#send-postman-token-header').change(function () {
            var val = $('#send-postman-token-header').val();
            if (val === "true") {
                settings.setSetting("sendPostmanTokenHeader", true);
            }
            else {
                settings.setSetting("sendPostmanTokenHeader", false);
            }
        });

        $('#use-postman-proxy').change(function () {
            var val = $('#use-postman-proxy').val();
            if (val === "true") {
                settings.setSetting("usePostmanProxy", true);
            }
            else {
                settings.setSetting("usePostmanProxy", false);
            }
        });

        $("#auto-follow-interceptor-redirects").change(function () {
            var val = $("#auto-follow-interceptor-redirects").val();
            if (val === "true") {
                settings.setSetting("interceptorRedirect", true);
            }
            else {
                settings.setSetting("interceptorRedirect", false);
            }
        });

        $('#postman-proxy-url').change(function () {
            settings.setSetting("postmanProxyUrl", $('#postman-proxy-url').val());
        });

        $('#response-font-size').change(function () {
            settings.setSetting("responseFontSize", parseInt($('#response-font-size').val(), 10));
        });

        $('#xhr-timeout').change(function () {
            settings.setSetting("xhrTimeout", parseInt($('#xhr-timeout').val(), 10));
        });

        $('#variable-delimiter').change(function () {
            settings.setSetting("variableDelimiter", $('#variable-delimiter').val());
        });

        $('#language-detection').change(function () {
            settings.setSetting("languageDetection", $('#language-detection').val());
        });


        $('#have-donated').change(function () {
            var val = $('#have-donated').val();
            // console.log("Donated status changed");
            if (val === "true") {
                settings.setSetting("haveDonated", true);
                pm.mediator.trigger("donatedStatusChanged", true);
            }
            else {
                settings.setSetting("haveDonated", false);
                pm.mediator.trigger("donatedStatusChanged", false);
            }
        });

        $('#force-windows-line-endings').change(function () {
            var val = $('#force-windows-line-endings').val();
            if (val === "true") {
                settings.setSetting("forceWindowsLineEndings", true);
            }
            else {
                settings.setSetting("forceWindowsLineEndings", false);
            }
        });

        // TODO
        // This needs to be moved somewhere else
        $("#instant-modals").change(function () {
            var val = $('#instant-modals').val();
            if (val === "true") {
                settings.setSetting("instantModals", true);
                $(".fade").removeClass("fade").addClass("fade_disable");
            }
            else {
                settings.setSetting("instantModals", false);
                $(".modal-backdrop.in").addClass("fade");
                $(".fade_disable").removeClass("fade_disable").addClass("fade");
            }
        });

        $("#download-all-data").on("click", function() {
            pm.indexedDB.downloadAllData(function() {
                noty(
                {
                    type:'success',
                    text:'Saved the data dump',
                    layout:'topCenter',
                    timeout:750
                });
            });
        });

        $("#import-all-data-files-input").on("change", function(event) {
            // console.log("Process file and import data");
            var files = event.target.files;
            pm.indexedDB.importAllData(files, function() {
                $("#import-all-data-files-input").val("");
                noty(
                {
                    type:'success',
                    text:'Imported all data',
                    layout:'topCenter',
                    timeout:750
                });
            }, function(msg) {
                //failure callback
                $("#import-all-data-files-input").val("");
                noty(
                    {
                        type:'error',
                        text:'Error parsing JSON: ' + msg,
                        layout:'topCenter'
                   });
            });
        });

        $(document).bind('keydown', 'shift+/', function () {
            if(pm.app.isModalOpen()) {
                return;
            }

            $('#modal-settings').modal({
                keyboard: true
            });

            $('#modal-settings').modal('show');
            $('#modal-settings a[href="#settings-shortcuts"]').tab('show');
        });

        if (this.model.getSetting("usePostmanProxy") === true) {
            $('#postman-proxy-url-container').css("display", "block");
        }
        else {
            $('#postman-proxy-url-container').css("display", "none");
        }

        this.render();
    },

    render: function() {
        $('#history-count').val(this.model.getSetting("historyCount"));
        $('#auto-save-request').val(this.model.getSetting("autoSaveRequest") + "");
        $('#trim-keys-and-values').val(this.model.getSetting("trimKeysAndValues") + "");
        $('#retain-link-headers').val(this.model.getSetting("retainLinkHeaders") + "");
        $('#send-no-cache-header').val(this.model.getSetting("sendNoCacheHeader") + "");
        $('#send-postman-token-header').val(this.model.getSetting("sendPostmanTokenHeader") + "");
        $('#use-postman-interceptor').val(this.model.getSetting("useInterceptor") + "");
        $('#use-postman-proxy').val(this.model.getSetting("usePostmanProxy") + "");
        $('#postman-proxy-url').val(this.model.getSetting("postmanProxyUrl"));
        $('#xhr-timeout').val(this.model.getSetting("xhrTimeout"));
        $('#variable-delimiter').val(this.model.getSetting("variableDelimiter"));
        $('#language-detection').val(this.model.getSetting("languageDetection"));
        $('#have-donated').val(this.model.getSetting("haveDonated") + "");
        $("#instant-modals").val(this.model.getSetting("instantModals")+ "");
        $('#response-font-size').val(this.model.getSetting("responseFontSize")+ "");
    }
});

var ThemeSettingsTab = Backbone.View.extend({
	initialize: function() {
		var model = this.model;
		var view = this;		

		$('#postman-theme').change(function () {
            pm.mediator.trigger("switchTheme", $("#postman-theme").val());
            view.hideSettings();
        });

        $("body").on("click",".theme-thumbnail", function() {
            $(".theme-thumbnail").removeClass("selected-theme-thumb");
            $(this).addClass("selected-theme-thumb");
            pm.mediator.trigger("switchTheme", $(this).attr('data-theme'));
        });

        pm.mediator.on("purchaseComplete", function(newPurchase) {
            if (newPurchase.id === "collection-runner") {
                view.hidePurchaseMessage();
            }
        });

        pm.mediator.on("loadedPurchases", function(purchases) {
            if (purchases.isUpgradeAvailable("collection-runner")) {
                console.log("ThemeSettingsTab: Purchase is available");

                view.hidePurchaseMessage();
            }
            else {
                console.log("ThemeSettingsTab: Purchase is not available");

                // TODO: Theme can be activated
                view.hidePurchaseMessage();

                // view.showPurchaseMessage();

                if (pm.purchases.isTrialCompleted("collection-runner")) {
                    console.log("ThemeSettingsTab: Trial completed");
                }
            }
        });

        this.render();
	},

	hideSettings: function() {
		$("#modal-settings").modal("hide");
	},

	hidePurchaseMessage: function() {
		$("#settings-theme-buy-message").css("display", "none");
        $("#settings-theme-form").css("display", "block");
	},

	showPurchaseMessage: function() {		
        $("#settings-theme-form").css("display", "none");
        $("#settings-theme-buy-message").css("display", "block");
	},

	render: function() {
		$('#postman-theme').val(this.model.getSetting("postmanTheme"));
        $(".theme-thumbnail").removeClass("selected-theme-thumb");
        $(".theme-thumbnail[data-theme='"+this.model.getSetting("postmanTheme")+"']").addClass("selected-theme-thumb");
	}
});
var SearchForm = Backbone.View.extend({
    initialize: function() {
    	var wait;

    	var view = this;
    	var model = this.model;

    	$("#sidebar-search").on("keyup", function(event) {
            $("#sidebar-search-cancel").css("display", "block");
    		clearTimeout(wait);
    		wait = setTimeout(function() {
    			var searchTerm = $("#sidebar-search").val();

    			if (searchTerm !== model.get("term")) {
    				model.set("term", searchTerm);
    			}

                if (searchTerm === "") {
                    $("#sidebar-search-cancel").css("display", "none");
                }
    		}, 250);
    	});

    	$("#sidebar-search-cancel").on("click", function() {
    		$("#sidebar-search").val("");
    		view.revertSidebar();
    	});
    },

    revertSidebar: function() {
        $("#sidebar-search-cancel").css("display", "none");
    	var history = this.model.get("history");
    	var collections = this.model.get("collections");
    	history.revert();
    	collections.revert();
    }
});

var SearchState = Backbone.Model.extend({
    defaults: function() {
        return {
            term: "",            
            history: null,
            collections: null
        };
    },

    initialize: function(options) {
        this.on("change:term", this.onChangeSearchTerm, this);
    },

    onChangeSearchTerm: function() {
        this.filterSidebar(this.get("term"));
    },

    filterSidebar: function(term) {
        var history = this.get("history");
        var collections = this.get("collections");

        if (term === "") {
            history.revert();
            collections.revert();
        }
        else {
            history.filter(term);
            collections.filter(term);
        }
    } 
});
var Sidebar = Backbone.View.extend({
    initialize: function() {
        var history = this.model.get("history");
        var collections = this.model.get("collections");

    	var historySidebar = new HistorySidebar({model: history});
    	var collectionSidebar = new CollectionSidebar({model: collections});
    	var view = this;

    	view.searchState = new SearchState({
    		history: this.model.get("history"),
    		collections: this.model.get("collections")
    	});

    	var searchForm = new SearchForm({model: view.searchState});

    	var activeSidebarSection = pm.settings.getSetting("activeSidebarSection");

        $('#sidebar-toggle').on("click", function () {
            view.toggleSidebar();
        });

        this.model.set("width", $('#sidebar').width() + 10);

    	if (activeSidebarSection) {
    	    this.select(activeSidebarSection);
    	}
    	else {
    	    this.select("history");
    	}

    	$('#sidebar-selectors li').click(function () {
    	    var id = $(this).attr('data-id');
    	    view.select(id);
    	});

        pm.mediator.on("hideSidebar", this.hideSidebar, this);
        pm.mediator.on("showSidebar", this.showSidebar, this);

        history.on("loadRequest", this.onLoadHistoryRequest, this);
        collections.on("addCollectionRequest", this.onAddCollectionRequest, this);

        history.on("historyRequestAdded", this.onHistoryRequestAdded, this);
    },

    hideSidebar: function() {
        $("#sidebar").css("display", "none");
        $("#sidebar-filler").css("display", "none");
        $("#sidebar-toggle").css("display", "none");
        $("#sidebar-search-container").css("display", "none");
    },

    showSidebar: function() {
        $("#sidebar").css("display", "block");
        $("#sidebar-filler").css("display", "block");
        $("#sidebar-toggle").css("display", "block");
        $("#sidebar-search-container").css("display", "block");
    },

    onHistoryRequestAdded: function() {
        this.searchState.trigger("change:term");
    },

    onLoadHistoryRequest: function() {
        $('.sidebar-collection-request').removeClass('sidebar-collection-request-active');
    },

    onAddCollectionRequest: function() {
        this.select("collections");
    },

    minimizeSidebar:function () {
    	var model = this.model;

        model.set("width", $("#sidebar").width());

        var animationDuration = model.get("animationDuration");

        $('#sidebar-toggle').animate({left:"0"}, animationDuration, function () {
            pm.mediator.trigger("sidebarResize", {
                sidebarWidth: 0,
                sidebarOuterWidth: $('#sidebar-toggle').width()
            });
        });

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
            pm.mediator.trigger("sidebarResize", {
                sidebarWidth: sidebarWidth + 10,
                sidebarOuterWidth: sidebarWidth + $('#sidebar-toggle').width() + 10
            });
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
    },

    select:function (section) {
    	var currentSection = this.model.get("currentSection");

        $("#sidebar-selectors li").removeClass("active");
        $("#sidebar-selectors-" + section).addClass("active");

        pm.settings.setSetting("activeSidebarSection", section);

        $('#sidebar-section-' + currentSection).css("display", "none");
        $('#' + currentSection + '-options').css("display", "none");

        this.model.set("currentSection", section);

        $('#sidebar-section-' + section).css("display", "block");
        $('#' + section + '-options').css("display", "block");
    }
});

var SidebarState = Backbone.Model.extend({
    defaults: function() {
        return {
            currentSection:"history",
            isSidebarMaximized:true,
            sections:[ "history", "collections" ],
            width:0,
            animationDuration:250,
            history:null,
            collections:null
        };
    },

    initialize: function(options) {
    }
});
var TCPManager = Backbone.View.extend({
	initialize: function() {
		var model = this.model;
		var view = this;

		model.on("change", this.render, this);
		pm.mediator.on("refreshCollections", this.renderTargetMenu, this);
		pm.mediator.on("showTCPManager", this.show, this);

		$("#modal-tcp-manager .nav li").on("click", function() {
			view.updateModel();
		});

		$("#tcp-manager-save-filters").on("click", function() {
			view.updateModel();
			pm.mediator.trigger("notifySuccess", "Saved settings");
		});

		$("#postman-proxy-target").on("change", function() {
			view.updateModel();
		});

		$("#tcp-manager-connect-toggle").on("click", function() {
			var status = model.get("status");

			if (status === "connected") {
				tracker.sendEvent('proxy', 'disconnect');
                view.disconnect();
			}
			else if (status === "disconnected") {
				tracker.sendEvent('proxy', 'connect');
                view.connect();
			}
		});

		this.render();
	},

	updateModel: function() {
		var model = this.model;

		var port = parseInt($("#postman-proxy-port").val(), 10);
		model.set("host", $("#postman-proxy-host").val());
		model.set("port", port);

		var target_value = $("#postman-proxy-target").val();
		var target_type;
		var target_id;

		if (target_value === "history" || target_value === "history_history") {
			target_type = "history";
			target_id = "history";
		}
		else {
			target_type = "collection";
			target_id = target_value.split("_")[1];
		}

		model.set("target_type", target_type);
		model.set("target_id", target_id);

		var filters = {
			"url": $("#postman-proxy-filter-url").val(),
			"url_disabled": $("#postman-proxy-filter-url-disabled").val(),
			"methods": $("#postman-proxy-filter-methods").val()
		};

		model.set("filters", filters);
		model.save();
	},

	renderTargetMenu: function() {
		var model = this.model;

		var collections = pm.collections.getAllCollections();
		var collection;
		$("#postman-proxy-target").html("");

		var history = {
			"proxy_target_value": "history",
			"name": "History",
			"id": "history"
		};

		$('#postman-proxy-target').append(Handlebars.templates.item_tcp_reader_target(history));

		for(var i = 0; i < collections.length; i++) {
			collection = _.clone(collections[i].toJSON());
			collection["proxy_target_value"] = "collection";
			collection["name"] = "Collection: " + collection["name"];
			$('#postman-proxy-target').append(Handlebars.templates.item_tcp_reader_target(collection));
		}

		var target_value = model.get("target_type") + "_" + model.get("target_id");
		$("#postman-proxy-target").val(target_value);
	},

	connect: function() {
		this.updateModel();
		this.model.connect();
		$("#tcp-manager-connect-toggle").html("Disconnect");
	},

	disconnect: function() {
		this.model.disconnect();
		$("#tcp-manager-connect-toggle").html("Connect");
	},

	render: function() {
		var model = this.model;
		var status = model.get("status");

		if (status === "connected") {
			$("#modal-tcp-manager .status").html("Connected");
			$("#modal-tcp-manager .status").addClass("status-connected");
			$("#modal-tcp-manager .status").removeClass("status-disconnected");
			$("#tcp-manager-connect-toggle").html("Disconnect");
		}
		else if (status === "disconnected") {
			$("#modal-tcp-manager .status").html("Disconnected");
			$("#modal-tcp-manager .status").removeClass("status-connected");
			$("#modal-tcp-manager .status").addClass("status-disconnected");
			$("#tcp-manager-connect-toggle").html("Connect");
		}

		$("#postman-proxy-host").val(model.get("host"));
		$("#postman-proxy-port").val(model.get("port"));

		var target_value = model.get("target_type") + "_" + model.get("target_id");
		$("#postman-proxy-target").val(target_value);

		var filters = model.get("filters");
		$("#postman-proxy-filter-url").val(filters.url);
		$("#postman-proxy-filter-url-disabled").val(filters.url_disabled);
		$("#postman-proxy-filter-methods").val(filters.methods);
	},

	show: function() {
		$("#modal-tcp-manager").modal("show");
	}

});
var TCPReader = Backbone.Model.extend({
	defaults: function() {
		return {
			"socketId": null,
			"socketInfo": null,
			"host": "127.0.0.1",
			"port": "5005",
			"target_type": "history",
			"target_id": "",
			"status": "disconnected",
			"filters": {
				"url": "",
				"url_disabled": "",
				"methods": "",
				"status_codes": "",
				"content_type": ""
			}
		}
	},

	initialize: function() {
		var model = this;

		pm.storage.getValue("readerSettings", function(settings) {
			if (settings) {
				model.set("host", settings.host);
				model.set("port", settings.port);
				model.set("target_type", settings.target_type);
				model.set("target_id", settings.target_id);

				model.set("filters", settings.filters);
			}
		});
	},

	save: function() {
		var readerSettings = {
			"readerSettings": {
				"host": this.get("host"),
				"port": this.get("port"),
				"target_type": this.get("target_type"),
				"target_id": this.get("target_id"),
				"filters": this.get("filters")
			}
		};

		pm.storage.setValue(readerSettings, function() {
		});

	},

	writeResponse: function(socketId, data, keepAlive) {
		var model = this;
		var socket = chrome.socket;

		var header = stringToUint8Array(data);
		var outputBuffer = new ArrayBuffer(header.byteLength);
		var view = new Uint8Array(outputBuffer)
		var socketInfo = this.get("socketInfo");

		view.set(header, 0);

		function onAccept(acceptInfo) {
			model.readFromSocket(acceptInfo.socketId);
		}

		socket.write(socketId, outputBuffer, function(writeInfo) {
			socket.destroy(socketId);
			socket.accept(socketInfo.socketId, onAccept);
		});
	},

	isAllowed: function(request) {
		var filters = this.get("filters");
		var methods = filters.methods.split(",");

		function trim(s) {
			return s.trim().toUpperCase();
		}

		var filterMethods = _.each(methods, trim);

		var flagUrlContains = true;
		var flagUrlDisabled = true;
		var flagUrlMethods = true;

		var result;

		// console.log("Filters are", filters);

		if (filters.url === "") {
			flagUrlContains = true;
		}
		else {
			if (request.url.search(filters.url) >= 0) {
				flagUrlContains = true;
			}
			else {
				flagUrlContains = false;
			}
		}

		if (filters.url_disabled === "") {
			flagUrlDisabled = true;
		}
		else {
			if (request.url.search(filters.url_disabled) < 0) {
				flagUrlDisabled = true;
			}
			else {
				flagUrlDisabled = false;
			}
		}

		if (filterMethods.length > 0) {
			flagUrlMethods = _.indexOf(filterMethods, request.method.toUpperCase());
		}
		else {
			flagUrlMethods = true;
		}

		result = flagUrlMethods && flagUrlDisabled && flagUrlContains;
		return result;
	},

	addRequest: function(data) {
		var request = JSON.parse(data);

		var target_type = this.get("target_type");
		var collection;
		var target_id;

		// console.log("Settings are", this.toJSON());

		if (this.isAllowed(request)) {
			if (target_type === "history") {
				pm.history.addRequestFromJSON(data);
			}
			else {
				target_id = this.get("target_id");
				pm.collections.addRequestToCollectionId(request, target_id);
			}
		}
	},

	readFromSocket: function(socketId) {
		var model = this;

		var socket = chrome.socket;
		socket.read(socketId, function(readInfo) {
			try {
			    // console.log("READ", readInfo);
			    // Parse the request.
			    var data = arrayBufferToString(readInfo.data);			    
			    model.addRequest(data);
			    model.writeResponse(socketId, "received-request", false);
			}
			catch(e) {
			    // console.log("Something went wrong while reading a request", e);
			    model.writeResponse(socketId, "received-request", false);
			}
		});
	},

	onAccept: function(acceptInfo) {
		// console.log("ACCEPT", acceptInfo)
		this.readFromSocket(acceptInfo.socketId);
	},

	startListening: function() {
		var model = this;
		var socket = chrome.socket;
		var socketInfo;
		var socketId;

		var host = this.get("host");
		var port = this.get("port");

		function onAccept(acceptInfo) {
			// console.log("ACCEPT", acceptInfo)
			model.readFromSocket(acceptInfo.socketId);
		}

		chrome.socket.create('tcp', {}, function(_socketInfo) {
			model.set("socketInfo", _socketInfo);
			model.set("socketId", _socketInfo.socketId);

			socketInfo = _socketInfo;
			socketId = _socketInfo.socketId;
			// console.log("CONNECTED", _socketInfo);

			model.set("status", "connected");

			socket.listen(socketInfo.socketId, host, port, 50, function(result) {
				// console.log("LISTENING:", result);
				// this.set("status", "listening");
				socket.accept(socketInfo.socketId, onAccept);
			});
		});

		// console.log("Start reading TCP calls");
	},

	stopListening: function() {
		chrome.socket.destroy(this.get("socketId"));
		this.set("status", "disconnected");
	},

	connect: function() {
		this.startListening();
		// this.set("status", "connected");
	},

	disconnect: function() {
		this.stopListening();
		// this.set("status", "disconnected");
	}
});
var TCPReaderStatus = Backbone.View.extend({
	initialize: function() {
		var model = this.model;

		model.on("change", this.render, this);
		$('#tcp-reader-status').on("click", function () {
			tracker.sendEvent('proxy', 'click');
		    pm.mediator.trigger("showTCPManager");
		});
	},

	render: function() {
		var title = "Disconnected";
		var status = this.model.get("status");
		var model = this.model;
		if (status === "connected") {
			title = "Connected to " + model.get("host") + ":" + model.get("port");
			$("#tcp-reader-status img").attr("src", "img/v2/proxy_connected.png");
		}
		else if (status === "disconnected") {
			title = "Disconnected";
			$("#tcp-reader-status img").attr("src", "img/v2/proxy.png");
		}

		$("#tcp-reader-status").attr("data-original-title", title);
	}
});
// $(document).ready(function() {
// 	var socketId;
// 	var socketInfo;
// 	var socket = chrome.socket;
// 	var ci;
// 	var IP = "127.0.0.1";
// 	var PORT = 5005;

// 	var writeResponse = function(socketId, data, keepAlive) {
// 		var header = stringToUint8Array(data);
// 		var outputBuffer = new ArrayBuffer(header.byteLength);
// 		var view = new Uint8Array(outputBuffer)
// 		view.set(header, 0);
// 		socket.write(socketId, outputBuffer, function(writeInfo) {
// 			console.log("WRITE", writeInfo);
// 			socket.destroy(socketId);
// 			socket.accept(socketInfo.socketId, onAccept);
// 		});
// 	};

// 	function readFromSocket(socketId) {
// 	  //  Read in the data
// 		socket.read(socketId, function(readInfo) {
// 			console.log("READ", readInfo);
// 			// Parse the request.
// 			var data = arrayBufferToString(readInfo.data);
// 			console.log("DATA", data);
// 			pm.history.addRequestFromJSON(data);
// 			writeResponse(socketId, "It worked!", false);
// 		});
// 	};

// 	function onAccept(acceptInfo) {
// 		console.log("ACCEPT", acceptInfo)
// 		readFromSocket(acceptInfo.socketId);
// 	}

// 	chrome.socket.create('tcp', {}, function(_socketInfo) {
// 		socketInfo = _socketInfo;
// 		socketId = _socketInfo.socketId;
// 		ci = _socketInfo;
// 		console.log("CONNECTED", _socketInfo);

// 		socket.listen(socketInfo.socketId, IP, PORT, 50, function(result) {
// 			console.log("LISTENING:", result);
// 			socket.accept(socketInfo.socketId, onAccept);
// 		});
// 	});

// 	console.log("Start reading TCP calls");
// });
var PreRequestScripter = Backbone.Model.extend({
	defaults: function() {
		return {
			"sandbox": null
		};
	},

	runPreRequestScript: function(request, data, iteration, callback) {
		$("#prscript-error").hide();

		var prCode = request.get("preRequestScript");

		// Wrapper function
		var baseCode = "(function(){";
		baseCode += prCode;
		baseCode += "})()";

		var selectedEnv = pm.envManager.get("selectedEnv");
		var selectedEnvJson = {};
		var globals = getKeyValPairsAsAssociativeArray(pm.envManager.get("globals").get("globals"));

		if (selectedEnv) {
			selectedEnvJson = getKeyValPairsAsAssociativeArray(selectedEnv.toJSON().values);
		}

		var environment = {
			"request": request.getForPrscript(), // Get separately
			"environment": selectedEnvJson,
			"globals": globals
		};

		this.postCode(baseCode, environment);

		this.listenToOnce(pm.mediator, "resultReceivedPrscipt", function(data) {
			if (callback) {
				callback(data, "result");
			}
		});

		this.listenToOnce(pm.mediator, "resultErrorPrscipt", function(data) {
			if (callback) {
				callback(data, "error");
			}
		});
	},

	postCode: function(code, environment) {
		var sandbox = this.get("sandbox");
		var message = {
			command: "runcode",
			code: code,
			environment: environment,
			scriptType: "prscript"
		};

		sandbox.contentWindow.postMessage(message, '*');
	},

	initialize: function() {
		var model = this;
		
		var sandbox = document.getElementById("tester_sandbox");
		this.set("sandbox", sandbox);

		window.addEventListener('message', function(event) {			
			var type = event.data.type;

			if (event.data.type === "test_result") {
				pm.mediator.trigger("resultReceivedPrscipt", event.data.result);
			}
			if (event.data.type === "test_error" && event.data.scriptType=="prscript") {
				pm.mediator.trigger("resultErrorPrscript", event.data.errorMessage);
			}
			//All other events are handled in Tester.js
		});

		pm.mediator.on("runPreRequestScript", this.runPreRequestScript, this);

		pm.mediator.on("resultErrorPrscript", this.showPreRequestScriptError, this);
	},

	showPreRequestScriptError: function(msg) {
		$("#prscript-error").show().html("There was an error evaluating the Pre-request script. " + msg).css('display','inline-block');
	}
});
var TestPurchaser = Backbone.View.extend({
	initialize: function() {
		var view = this;

		pm.mediator.on("startPurchaseFlow", this.onStartPurchaseFlow, this);		

		this.purchaserView = new TestPurchaserWebView();
		
		pm.mediator.on("closeTestPurchaser", this.onCloseTestPurchaser, this);
		pm.mediator.on("purchaseComplete", this.onPurchaseComplete, this);		

		$("#modal-test-purchaser").on("shown", function () {		    
		    pm.app.trigger("modalOpen", "#modal-test-purchaser");
		});

		$("#modal-test-purchaser").on("hidden", function () {
		    pm.app.trigger("modalClose");
		});

		pm.mediator.on("onMessageExternal", function(request, sender, sendResponse) {			
			if (request) {
				if (request.postmanMessage) {
					if (request.postmanMessage.type === "purchase") {
						tracker.sendEvent('test_runner', 'collection_runner', 'purchase_complete');
						pm.mediator.trigger("purchaseComplete", request.postmanMessage.purchase);

						sendResponse({"result":"success"});

						$("#modal-jetpacks-about").modal("hide");
						$("#modal-jetpacks-intro").modal("show");
					}
				}
			}
		});
		
		$("body").on("click", ".buy-jetpacks", function() {
			view.purchase();
		});

		$("body").on("click", ".try-jetpacks", function() {
			view.startTrial();
		});
	},

	onCloseTestPurchaser: function() {
		// console.log("Hide modal");
		$("#modal-test-purchaser").modal("hide");
	},

	onPurchaseComplete: function(purchase) {
		if (purchase.id === "collection-runner") {
			// console.log("Time to hide modal");
			// $("#modal-test-purchaser").modal("hide");
		}
	},

	startTrial: function() {
		pm.mediator.trigger("startTrial", "collection-runner");
		$("#modal-jetpacks-about").modal("hide");
	},

	purchase: function() {
		pm.mediator.trigger("onStartPurchase", "collection-runner");

		var url = pm.webUrl + '/buy/jetpacks';
		url += "?key=collection-runner";
		url += "&is_beta=" + pm.arePurchasesInBeta;
		url += "&user_id=" + pm.user.get("id");
    	url += "&access_token=" + pm.user.get("access_token");
    	url += "&random=" + Math.random();
    	url += "&ga_client_id=" + pm.gaClientId;
    	url += "&app_name=" + app_name;
    	url += "&app_version=" + chrome.runtime.getManifest().version;
    	url += "&tracker_id=" + tracker_id;

		window.open(url);
	},

	onStartPurchaseFlow: function() {
		if (pm.purchases.isTrialCompleted("collection-runner")) {
			$("#modal-jetpacks-about .try-jetpacks").remove();
		}

		$("#modal-jetpacks-about").modal("show");
	}

});
var TestPurchaserWebView = Backbone.View.extend({
	initialize: function() {
		var model = this.model;
		var view = this;

		this.webview = document.getElementById("test-purchaser-webview");		
		this.webview.addEventListener("loadstart", this.onLoadStart);
		this.webview.addEventListener("loadstop", this.onLoadStop);		

		window.addEventListener("message", function(event) {
			if (event.hasOwnProperty("data")) {
				// console.log(event.data);
				if (event.data.message_type === "purchase") {
					tracker.sendEvent('test_runner', 'collection_runner', 'purchase_complete');
					pm.mediator.trigger("purchaseComplete", event.data.purchase);
				}
				else if (event.data.message_type === "token") {
					tracker.sendEvent('user', 'login', 'purchase');
					pm.mediator.trigger("receiveTokenFromPurchaseFlow", event.data.token);
				}
				else if (event.data.message_type == "finish_purchase") {
					pm.mediator.trigger("closeTestPurchaser");
				}
				
			}			
		});

		this.webview.addEventListener('newwindow', function(e) {
			var targetUrl = e.targetUrl;
			var a = document.createElement('a'); 
		    a.href = targetUrl; 
		    a.target='_blank'; 
		    a.click(); 
		});

		this.webview.addEventListener("contentload", function() {
			// console.log("Posting message");
			event.target.contentWindow.postMessage({}, "*");			
		});		
	},

	onContentLoad: function(event) {
		// console.log("Content load called");				
	},

	onLoadStart: function(event) {
		// console.log("onLoadStart");
		$("#modal-test-purchaser .preloader").css("display", "inline-block");
	},

	onLoadStop: function(event) {		
		// console.log("onLoadStop");
		$("#modal-test-purchaser .preloader").css("display", "none");
		event.target.executeScript({ code: "document.innerHTML = 'blah';" });
	},

	loadUrl: function(url) {
		this.webview.src = url;
	}
});
var TestResultViewer = Backbone.View.extend({
	initialize: function() {
		var model = this.model;

		model.on("change:testResults", this.renderResults, this);
		model.on("change:testErrors", this.renderErrors, this);

		$("#response-tests").on("click", ".know-more-collection-runner", function() {
			tracker.sendEvent('test_runner', 'know_more', 'test_result_viewer');
			pm.mediator.trigger("startPurchaseFlow", "test_runner");
		});
	},

	renderErrors: function(request) {
		// console.log("Render errors", request);
		if (pm.purchases.isUpgradeAvailable("collection-runner")) {
			if (request.get("testErrors")) {
				$('#response-tests').html("<h4>Test script execution failed</h4><h5>Error message:</h5>");
				$('#response-tests').append("<span class='test-error'>" + request.get("testErrors") + "</span>");	
			}	
		}
		else {
			this.renderPurchaseMessage();
		}		
	},

	renderPurchaseMessage: function() {
		$('#response-tests').html(Handlebars.templates.purchase_message_collection_runner({}));;

		// Deactivate trial button if trial completed
		$("#response-tests .try-jetpacks").remove();
	},

	renderResults: function() {
		if (pm.purchases.isUpgradeAvailable("collection-runner")) {
			var testResults = this.model.get("testResults");		

			if (testResults === null) {
				$('.response-tabs li[data-section="tests"]').html("Tests (0/0)");
				$('#response-tests').html("");
				return;
			}

			var d = "";
			var success = 0;
			var failure = 0;
			var total = 0;

			var results = [];
			var r;
			for (var key in testResults) {
			  if (testResults.hasOwnProperty(key)) {

			  	if (!!testResults[key]) {
			  		r = "pass";
			  	}
			  	else {
			  		r = "fail";
			  	}

			    results.push({
			    	key: key,
			    	value: r
			    });

			    if (!!testResults[key]) {
			    	success += 1;
			    }
			    else {
			    	failure += 1;
			    }

			    total += 1;
			  }
			}

			$('.response-tabs li[data-section="tests"]').css("display", "block");
			$('.response-tabs li[data-section="tests"]').html("Tests (" + success + "/" + total + ")");
			$('#response-tests').html(Handlebars.templates.response_tests({items: results}));
		}
		else {
			this.renderPurchaseMessage();
		}		
	}

});
var Tester = Backbone.Model.extend({
    defaults: function() {
        return {
            "sandbox": null
        };
    },

    runTest: function(request, data, iteration, callback) {
        $("#test-error").hide();

        var testCode = request.get("tests");

        // Wrapper function
        var baseCode = "(function(){var tests={};";
        baseCode += testCode;
        baseCode += "return tests;})()";

        var response = request.get("response");

        var selectedEnv = pm.envManager.get("selectedEnv");
        var selectedEnvJson = {};
        var globals = getKeyValPairsAsAssociativeArray(pm.envManager.get("globals").get("globals"));

        if (selectedEnv) {
            selectedEnvJson = getKeyValPairsAsAssociativeArray(selectedEnv.toJSON().values);
        }

        var environment = {
            "request": request.getForTester(), // Get separately
            "responseBody": response.get("text"),
            "responseHeaders": response.getHeadersAsKvPairs(), // TODO Get key value pairs
            "responseTime": response.get("time"),
            "responseCookies": response.get("cookies"),
            "responseCode": response.get("responseCode"),
            "environment": selectedEnvJson,
            "globals": globals,
            "data": data,
            "iteration": iteration
        };

        this.postCode(baseCode, environment);

        this.listenToOnce(pm.mediator, "resultReceived", function(data) {
            if (callback) {
                callback(data, "result");
            }
        });

        this.listenToOnce(pm.mediator, "resultError", function(data) {
            if (callback) {
                callback(data, "error");
            }
        });
    },

    postCode: function(code, environment) {
        var sandbox = this.get("sandbox");
        var message = {
            command: "runcode",
            code: code,
            environment: environment,
            scriptType: "test"
        };

        sandbox.contentWindow.postMessage(message, '*');
    },

    initialize: function() {
        var model = this;

        var sandbox = document.getElementById("tester_sandbox");
        this.set("sandbox", sandbox);

        window.addEventListener('message', function(event) {
            var type = event.data.type;

            if (event.data.type === "test_result") {
                pm.mediator.trigger("resultReceived", event.data.result);
            }
            if (event.data.type === "test_error" && event.data.scriptType=="test") {
                pm.mediator.trigger("resultError", event.data.errorMessage);
            }
            else if (type === "set_environment_variable") {
                pm.mediator.trigger("setEnvironmentVariable", event.data.variable);
            }
            else if (type === "set_global_variable") {
                pm.mediator.trigger("setGlobalVariable", event.data.variable);
            }
            else if (type === "clear_environment_variables") {
                pm.mediator.trigger("clearEnvironmentVariables");
            }
            else if (type === "clear_global_variables") {
                pm.mediator.trigger("clearGlobalVariables");
            }
        });

        pm.mediator.on("resultError", this.showTestScriptError, this);
        pm.mediator.on("runRequestTest", this.runTest, this);
    },

    showTestScriptError: function(msg) {
        $("#test-error").show().html("There was an error evaluating the test script. " + msg).css('display','inline-block');
    }
});
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
var DeleteUserCollectionModal = Backbone.View.extend({
    initialize: function() {
        $('#modal-delete-user-collection-yes').on("click", function () {
            var id = $(this).attr('data-collection-id');
            pm.mediator.trigger("deleteSharedCollection", id)
        });

        $("#modal-delete-user-collection").on("shown", function () {
            pm.app.trigger("modalOpen", "#modal-delete-user-collection");
        });

        $("#modal-delete-user-collection").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        pm.mediator.on("confirmDeleteSharedCollection", this.render, this);
    },

    render: function(id) {
        $('#modal-delete-user-collection-yes').attr("data-collection-id", id);
        $('#modal-delete-user-collection').modal("show");
    }
});

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
var UserCollections = Backbone.View.extend({
	initialize: function() {
		var model = this.model;

		model.on("login", this.render, this);
		model.on("logout", this.render, this);
		model.on("change:collections", this.render, this);

		var deleteUserCollectionModal = new DeleteUserCollectionModal();

		$("#user-collections-actions-upload-all").on("click", function() {
			// console.log("Upload all collections");
			pm.mediator.trigger("uploadAllLocalCollections");
		});

		$("#user-collections-actions-download-all").on("click", function() {
			// console.log("Download all collections");
			pm.mediator.trigger("downloadAllSharedCollections");
		});

		$("#user-collections-list").on("click", ".user-collection-action-download", function() {
			var id = parseInt($(this).attr("data-remote-id"), 10);
			pm.mediator.trigger("downloadSharedCollection", id);
		});

		$("#user-collections-list").on("click", ".user-collection-action-delete", function() {
			var id = $(this).attr("data-id");
			pm.mediator.trigger("confirmDeleteSharedCollection", id);
		});

		this.render();
	},

	render: function() {
		var id = this.model.get("id");
		var name = this.model.get("name");
		var expiredToken = this.model.get("expiredToken");


		if (id !== 0 && expiredToken === false) {
			$('#user-collections-list tbody').html("");
			$('#user-collections-list tbody').append(Handlebars.templates.user_collections_list({"items":this.model.get("collections")}));
		}
		else {
			$('#user-collections-list tbody').html("");
		}
	}
});
var UserStatus = Backbone.View.extend({
	initialize: function() {
		var view = this;
		var model = this.model;

		model.on("login", this.render, this);
		model.on("logout", this.render, this);

		$("#user-status-shared-collections").on("click", function() {
			$("#modal-user-collections").modal("show");
			return false;
		});

		$("#user-status-not-logged-in").on("click", function() {
			$("#user-status-not-logged-in").html("Loading...");
			model.login();
			return false;
		});

		$("#user-status-manage-profile").on("click", function() {
			view.openProfile();			
			return false;
		});

		$("#user-status-shared-collections").on("click", function() {
			// console.log("Open shared collections window");
		});

		$("#user-status-logout").on("click", function() {
			$("#user-status-not-logged-in").html("Log in");
			model.logout();
			return false;
		});

		this.render();
	},

	openProfile: function() {
		var url = pm.webUrl + '/signin-client';		
		url += "?user_id=" + pm.user.get("id");
    	url += "&access_token=" + pm.user.get("access_token");    	

    	console.log(url);

    	window.open(url);
	},

	render: function() {
		// console.log("UserStatus change triggered", this.model.get("id"));

		if (pm.features.isFeatureEnabled(FEATURES.USER)) {
			$("#user-status").css("display", "block");
		}

		var id = this.model.get("id");
		var name = this.model.get("name");
		var expiredToken = this.model.get("expiredToken");

		$("#user-status-not-logged-in").tooltip();

		if (id !== 0 && expiredToken === false) {
			$("#user-status-false").css("display", "none");
			$("#user-status-true").css("display", "block");
			$("#user-status-username").html(name);
		}
		else {
			$("#user-status-not-logged-in").html("Sign in");
			$("#user-status-false").css("display", "block");
			$("#user-status-true").css("display", "none");
			$("#user-status-username").html("");
		}
	}
});