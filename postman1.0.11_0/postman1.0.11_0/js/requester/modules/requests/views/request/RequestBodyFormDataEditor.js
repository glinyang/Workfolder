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