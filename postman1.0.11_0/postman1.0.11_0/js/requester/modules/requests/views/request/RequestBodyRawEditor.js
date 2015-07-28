var RequestBodyRawEditor = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;
        var body = this.model.get("body");

        body.on("change:data", this.onChangeBodyData, this);
        model.on("change:headers", this.onChangeHeaders, this);

        pm.mediator.on("switchCodeMirrorTheme", this.onSwitchCodeMirrorTheme, this);
    },

    onSwitchCodeMirrorTheme: function(theme) {
        var codeMirror = this.model.get("body").get("codeMirror");

        if (codeMirror) {
            codeMirror.setTheme("ace/theme/"+theme);
        }
    },

    onChangeHeaders: function() {
        var body = this.model.get("body");

        //Set raw body editor value if Content-Type is present
        var contentType = this.model.getHeaderValue("Content-Type");
        var editorMode = "text";
        var language = "text";

        if (contentType) {
            if (contentType.search(/json/i) !== -1 || contentType.search(/javascript/i) !== -1) {
                editorMode = 'javascript';
                language = contentType;
            }
            else if (contentType.search(/xml/i) !== -1) {
                editorMode = 'xml';
                language = contentType;
            }
            else if (contentType.search(/html/i) !== -1) {
                editorMode = 'xml';
                language = contentType;
            }
            else {
                editorMode = 'text';
                language = 'text';
            }
        }


        body.set("editorMode", editorMode);
        body.set("language", language);

        this.setEditorMode(editorMode, language, false);
    },

    resetBody: function() {
        this.loadRawData("");
    },

    onChangeBodyData: function() {
        var body = this.model.get("body");
        var mode = body.get("dataMode");
        var asObjects = body.get("asObjects");
        var data = body.get("data");

        // console.log("onChangeBodyData", body, data);

        var language = body.get("language");
        var editorMode = body.get("editorMode");

        if (mode === "raw") {
            if (typeof data === "string") {
                this.loadRawData(data);
            }
            else {
                this.loadRawData("");
            }
        }
        else {
            this.loadRawData("");
        }
    },

    initCodeMirrorEditor:function () {
        var model = this.model;
        var view = this;
        var body = this.model.get("body");
        var editorMode = body.get("editorMode");

        body.set("isEditorInitialized", true);

        var theme = pm.settings.getSetting("postmanCodeMirrorTheme");

        var bodyTextarea = document.getElementById("body");
        this.editor = ace.edit(bodyTextarea);

        pm.addFolderEditor = this.editor;
        var theme = (pm.settings.getSetting("postmanTheme")==="light")?"clouds":"monokai";
        this.editor.setTheme("ace/theme/"+theme);

        body.set("codeMirror", this.editor);


        var codemirror = this.editor;
        $("#body-data-container .aceeditor-div").resizable({
            stop: function() {
                codemirror.resize(true);
            }
        });

        if (editorMode) {
            if (editorMode === "javascript") {
               // codeMirror.setOption("mode", {"name":"javascript", "json":true});
                this.editor.getSession().setMode('ace/mode/javascript');
            }
            else if(editorMode === "text") {
                //codeMirror.setOption("mode", editorMode);
                this.editor.getSession().setMode('ace/mode/plain_text');
            }
            else if(editorMode === "xml") {
                //codeMirror.setOption("mode", editorMode);
                this.editor.getSession().setMode('ace/mode/xml');
            }

            if (editorMode === "text") {
                $('#body-editor-mode-selector-format').addClass('disabled');
            } else {
                $('#body-editor-mode-selector-format').removeClass('disabled');
            }
        }

        $("#body-data-container .CodeMirror-scroll").css("height", "200px");
    },

    setEditorMode:function (mode, language, toSetHeader) {
        var model = this.model;
        var body = model.get("body");
        var codeMirror = body.get("codeMirror");
        var isEditorInitialized = body.get("isEditorInitialized");

        var displayMode = $("#body-editor-mode-selector a[data-language='" + language + "']").html();

        $('#body-editor-mode-item-selected').html(displayMode);

        if (isEditorInitialized) {
            if (mode === "javascript") {
                codeMirror.getSession().setMode('ace/mode/javascript');
            }
            else if(mode === "text") {
                //codeMirror.setOption("mode", editorMode);
                codeMirror.getSession().setMode('ace/mode/plain_text');
            }
            else if(mode==="xml") {
                codeMirror.getSession().setMode('ace/mode/xml');
            }

            if (mode === "text") {
                $('#body-editor-mode-selector-format').addClass('disabled');
            } else {
                $('#body-editor-mode-selector-format').removeClass('disabled');
            }

            if (toSetHeader) {
                model.setHeader("Content-Type", language);
            }

            //codeMirror.refresh();
        }
    },

    autoFormatEditor:function (mode) {
        var model = this.model;
        var view = this;
        var body = model.get("body");
        var isEditorInitialized = body.get("isEditorInitialized");
        var codeMirror = body.get("codeMirror");

        var content = codeMirror.getValue(),
        validated = null, result = null;

        $('#body-editor-mode-selector-format-result').empty().hide();

        console.error("Auto format not currently supported for ace editor");
        return;

        if (isEditorInitialized) {
            // In case its a JSON then just properly stringify it.
            // CodeMirror does not work well with pure JSON format.
            if (mode === 'javascript') {

                // Validate code first.
                try {
                    validated = pm.jsonlint.instance.parse(content);
                    if (validated) {
                        content = JSON.parse(codeMirror.getValue());
                        codeMirror.setValue(JSON.stringify(content, null, 4), -1);
                    }
                } catch(e) {
                    result = e.message;
                    // Show jslint result.
                    // We could also highlight the line with error here.
                    $('#body-editor-mode-selector-format-result').html(result).show();
                }
            } else { // Otherwise use internal CodeMirror.autoFormatRage method for a specific mode.
                var totalLines = codeMirror.lineCount(),
                totalChars = codeMirror.getValue().length;

                codeMirror.autoFormatRange(
                    {line: 0, ch: 0},
                    {line: totalLines - 1, ch: codeMirror.getLine(totalLines - 1).length}
                );
            }
        }
    },

    loadRawData:function (data) {
        // console.log("loadRawData: data", data);
        var body = this.model.get("body");
        var isEditorInitialized = body.get("isEditorInitialized");
        var codeMirror = body.get("codeMirror");

        if (isEditorInitialized === true) {
            if (data) {
                codeMirror.setValue(data, -1);
            }
            else {
                codeMirror.setValue("", -1);
            }
        }
    },

    getRawData:function () {
        var model = this.model;
        var body = model.get("body");
        var isEditorInitialized = body.get("isEditorInitialized");
        var codeMirror = body.get("codeMirror");

        if (isEditorInitialized) {
            var data = codeMirror.getValue();

            if (pm.settings.getSetting("forceWindowsLineEndings") === true) {
                data = data.replace(/\r/g, '');
                data = data.replace(/\n/g, "\r\n");
            }

            return data;
        }
        else {
            return "";
        }
    }
});