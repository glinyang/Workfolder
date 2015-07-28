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