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