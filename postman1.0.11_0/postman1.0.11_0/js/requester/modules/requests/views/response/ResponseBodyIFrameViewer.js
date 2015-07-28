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