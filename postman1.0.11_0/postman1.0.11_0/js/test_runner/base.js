"use strict";

var pm = {};

pm.targets = {
    CHROME_LEGACY_APP: 0,
    CHROME_PACKAGED_APP: 1
};

pm.target = pm.targets.CHROME_PACKAGED_APP;

pm.isTesting = postman_flag_is_testing;
pm.databaseName = postman_database_name;
pm.webUrl = postman_web_url;

pm.features = new Features();

pm.debug = false;

pm.indexedDB = {};
pm.indexedDB.db = null;
pm.indexedDB.modes = {
    readwrite:"readwrite",
    readonly:"readonly"
};

pm.fs = {};
pm.hasPostmanInitialized = false;

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

    function initializeTester() {
        var tester = new Tester();
        pm.tester = tester;
    }

    function initializePreRequestScripter() {
        var preRequestScripter = new PreRequestScripter();
        pm.preRequestScripter = preRequestScripter;
    }

    function initializePostmanAPI() {
        pm.api = new PostmanAPI();
    }

    function initializeCollections() {
        var pmCollections = new PmCollections();
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

        pm.envManager = variableProcessor;

        var appState = new AppState({
            "globals": globals,
            "environments": environments,
            "variableProcessor": variableProcessor
        });

        var appView = new TestRunApp({model: appState});
        pm.app = appView;

        var testRunAppHeader = new TestRunAppHeader({model: {}});
    }

	function initializeHelpers() {
		var basicAuthProcessor = new BasicAuthProcessor();
		var digestAuthProcessor = new DigestAuthProcessor();
		var oAuth1Processor = new OAuth1Processor();
		var oAuth2TokenFetcher = new OAuth2TokenFetcher();

		var helpers = new Helpers({
			"basicAuth": basicAuthProcessor,
			"digestAuth": digestAuthProcessor,
			"oAuth1": oAuth1Processor,
			"oAuth2": oAuth2TokenFetcher
		});

		pm.helperModel = helpers;
	}

    function initializeInterceptor() {
        console.log("Initialize interceptor");
        var interceptorIntro = new InterceptorIntro({model: {}});        
    }

    function initializeHeaderPresets() {
        pm.headerPresets = new HeaderPresets();
    }

    function initializeRequester() {
        var urlCache = new URLCache();
        pm.urlCache = urlCache;

        initializeExtensionListener();
    }

    function initializeStorage() {
        var storage = new Storage();
        pm.storage = storage;
    }

    function initializeRequestMethods() {
        var requestMethods = new RequestMethods();
        pm.methods = requestMethods;
    }

    function initializeExtensionListener() {
        chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
            pm.mediator.trigger("onMessageExternal", request, sender, sendResponse);
        });
    }

    function initializeUser() {
        var user = new User();
        pm.user = user;
    }

    function initializeTestRunner() {
    	var testRuns = new TestRuns();

    	var o = {
    		"collections": pm.collections,
    		"envManager": pm.envManager,
    		"testRuns": testRuns
    	};

        var testRunnerSidebarState = new TestRunnerSidebarState(o);
        var testRunnerSidebar = new TestRunnerSidebar({model: testRunnerSidebarState});

        var testRunnerState = new TestRunnerState(o);
        var testRunnerController = new TestRunnerController({model: testRunnerState});

    	pm.testRuns = testRuns;
    }

    pm.mediator = new Mediator();
    pm.appWindow = new AppWindow();

    initializeStorage();

    pm.settings = new Settings();

    pm.methods = new RequestMethods(function() {
        pm.settings.init(function() {
            // Initialize theme here
            pm.themeManager = new ThemeManager();
            
            pm.filesystem.init();
            pm.indexedDB.open(function() {
            	initializeTester();
                initializePreRequestScripter();
                initializeInterceptor();
                initializePostmanAPI();
                initializeRequester();
	            initializeHelpers();
                initializeHistory();
                initializeCollections();
                initializeEnvironments();
                initializeHeaderPresets();
                initializeUser();

                // Test runner specific initializations
                initializeTestRunner();

                pm.hasPostmanInitialized = true;
            });
        });
    });
};

$(document).ready(function () {
    pm.init();
});