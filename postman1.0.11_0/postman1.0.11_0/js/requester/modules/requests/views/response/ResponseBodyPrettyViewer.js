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
