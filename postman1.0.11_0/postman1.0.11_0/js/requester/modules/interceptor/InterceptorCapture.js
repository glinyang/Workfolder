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