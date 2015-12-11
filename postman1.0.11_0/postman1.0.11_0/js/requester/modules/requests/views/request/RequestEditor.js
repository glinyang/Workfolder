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