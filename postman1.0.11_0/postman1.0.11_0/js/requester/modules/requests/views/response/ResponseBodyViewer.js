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