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