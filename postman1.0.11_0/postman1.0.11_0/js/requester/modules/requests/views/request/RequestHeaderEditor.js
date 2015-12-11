var RequestHeaderEditor = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;
        model.on("change:headers", this.onChangeHeaders, this);
        model.on("customHeaderUpdate", this.onCustomHeaderUpdate, this);
        model.on("loadRequest", this.onLoadRequest,this);
        var contentTypes = [
            "application/json"
        ];

        var params = {
            placeHolderKey:"Header",
            placeHolderValue:"Value",
            deleteButton:'<span class="icon-delete"/>',
            onInit:function () {
            },

            onAddedParam:function () {
                $("#headers-keyvaleditor .keyvalueeditor-key").catcomplete({
                    source:pm.headerPresets.getPresetsForAutoComplete(),
                    delay:50,
                    select:function (event, item) {
                        view.onHeaderAutoCompleteItemSelect(item.item);
                    }
                });
            },

            onDeleteRow:function () {
                var headers = view.getHeaderEditorParams();
                view.setHeadersInTextarea(headers);
                $('#headers-keyvaleditor-actions-open .headers-count').html(headers.length);
                model.set("headers", headers, { silent: true });
            },

            onFocusElement:function (event) {
                view.currentFocusedRow = $(event.currentTarget).parent()[0];

                var thisInputIsAValue = $(event.currentTarget).attr("class").search("keyvalueeditor-value") >= 0;

                if(thisInputIsAValue) {
                    var parent = view.currentFocusedRow;
                    var keyInput = $(parent).children(".keyvalueeditor-key")[0];
                    var keyValue = $(keyInput).val().toLowerCase();
                    if (keyValue === "content-type") {
                        $(event.currentTarget).autocomplete({
                            source: mediatypes,
                            delay: 50
                        });
                    }
                }

                $("#headers-keyvaleditor .keyvalueeditor-key").catcomplete({
                    source:pm.headerPresets.getPresetsForAutoComplete(),
                    delay:50,
                    select:function (event, item) {
                        _.bind(view.onHeaderAutoCompleteItemSelect, view)(item.item);
                    }
                });
            },

            onBlurElement:function () {
                $("#headers-keyvaleditor .keyvalueeditor-key").catcomplete({
                    source:pm.headerPresets.getPresetsForAutoComplete(),
                    delay:50,
                    select:function (event, item) {
                        view.onHeaderAutoCompleteItemSelect(item.item);
                    }
                });

                var headers = view.getHeaderEditorParams();
                view.setHeadersInTextarea(headers);
                $('#headers-keyvaleditor-actions-open .headers-count').html(headers.length);
                model.set("headers", headers, { silent: true });
            },

            onReset:function () {
                var headers = $('#headers-keyvaleditor').keyvalueeditor('getValues');
                $('#headers-keyvaleditor-actions-open .headers-count').html(headers.length);
                model.set("headers", headers, { silent: true });
            }
        };

        $('#headers-keyvaleditor').keyvalueeditor('init', params);

        $('#headers-keyvaleditor-actions-close').on("click", function () {
            $('#headers-keyvaleditor-actions-open').removeClass("active");
            view.closeHeaderEditor();
        });

        $('#headers-keyvaleditor-actions-open').on("click", function () {
            var isDisplayed = $('#headers-keyvaleditor-container').css("display") === "block";
            if (isDisplayed) {
                view.closeHeaderEditor();
            }
            else {
                view.openHeaderEditor();
            }
        });

        $("textarea#headers-direct").on("change",function() {
           view.onDirectHeaderInput(this.value.trim());
        });


        $(document).bind('keydown', 'h', function () {
            if(pm.app.isModalOpen()) {
                return;
            }

            var display = $("#headers-keyvaleditor-container").css("display");

            if (display === "block") {
                view.closeHeaderEditor();
            }
            else {
                view.openHeaderEditor();
                $('#headers-keyvaleditor div:first-child input:first-child').focus();
            }

            return false;
        });
    },

    onCustomHeaderUpdate: function() {
        this.openHeaderEditor();
    },

    onChangeHeaders: function() {
        var newHeaders = _.cloneDeep(this.model.get("headers"));
        $('#headers-keyvaleditor').keyvalueeditor('reset', newHeaders);
    },

    openHeaderEditor:function () {
        $('#headers-keyvaleditor-actions-open').addClass("active");
        var containerId = "#headers-keyvaleditor-container";
        $(containerId).css("display", "block");
    },

    closeHeaderEditor:function () {
        $('#headers-keyvaleditor-actions-open').removeClass("active");
        var containerId = "#headers-keyvaleditor-container";
        $(containerId).css("display", "none");
    },

    onLoadRequest: function(m) {
        var model = this.model;
        var headers = model.get("headers");
        this.setHeadersInTextarea(headers);
    },

    setHeaderValue:function (key, value) {
        var headers = this.model.get("headers");
        var origKey = key;
        key = key.toLowerCase();
        var found = false;
        for (var i = 0, count = headers.length; i < count; i++) {
            var headerKey = headers[i].key.toLowerCase();

            if (headerKey === key && value !== "text") {
                headers[i].value = value;
                found = true;
            }
        }

        var editorId = "#headers-keyvaleditor";
        if (!found && value !== "text") {
            var header = {
                "key":origKey,
                "name":origKey,
                "value":value
            };
            headers.push(header);
        }

        $(editorId).keyvalueeditor('reset', headers);
    },

    updateModel: function() {
        this.model.set("headers", this.getHeaderEditorParams(), {silent: true});
        var headers = this.model.get("headers");

        $('#headers-keyvaleditor-actions-open .headers-count').html(headers.length);
    },

	getHeaderEditorParams:function () {
		var hs = $('#headers-keyvaleditor').keyvalueeditor('getValues');
		var newHeaders = [];
		for (var i = 0; i < hs.length; i++) {
			var header = {
				key:hs[i].key,
				value:hs[i].value,
				name:hs[i].key,
				enabled: hs[i].enabled
			};

			newHeaders.push(header);
		}

		return newHeaders;
	},

    onHeaderAutoCompleteItemSelect:function(item) {
        if(item.type === "preset") {
            $(this.currentFocusedRow).remove();

            var preset = pm.headerPresets.getHeaderPreset(item.id);

            var headers = $('#headers-keyvaleditor').keyvalueeditor('getValues');
            var newHeaders = _.union(headers, preset.get("headers"));
            $('#headers-keyvaleditor').keyvalueeditor('reset', newHeaders);

            //Ensures that the key gets focus
            var element = $('#headers-keyvaleditor .keyvalueeditor-last input:first-child')[0];
            $('#headers-keyvaleditor .keyvalueeditor-last input:first-child')[0].focus();
            setTimeout(function() {
                element.focus();
            }, 10);

        }
    },

    //should be called when the textarea is updated
    onDirectHeaderInput:function(text) {
        //attempt to split text
        $("#headers-textarea-message").html("Enter headers in \"key\":\"value\" format.");
        $("#headers-textarea-message").removeClass('wrong-header');
        var lines = text.split("\n");
        var numLines = lines.length;
        var newHeaders=[];
        var kvpair = $('#headers-keyvaleditor');

        for(i=0;i<numLines;i++) {
            var newHeader={};
            var thisPair = lines[i].split(":");
            if(thisPair.length<2) {
                $("#headers-textarea-message").html('<span id="wrong-headers-format">Incorrect format for headers in line [  '+lines[i]+'  ]. Use \"key\":\"value\"</span>');
                $("#headers-textarea-message").addClass('wrong-header');
                continue;
            }
            newHeader["key"]=newHeader["name"]=thisPair.shift();
            newHeader["type"]="text";
            newHeader["value"]=thisPair.join(":").trim();
            newHeaders.push(newHeader);
        }

        kvpair.keyvalueeditor('reset', newHeaders);
    },

    //is called when a new header is added in the form
    setHeadersInTextarea: function(headers) {
        var ta = $("textarea#headers-direct");
        var numHeaders = headers.length;
        var str="";
        for(i=0;i<numHeaders;i++) {
            str+=headers[i]["key"]+": "+headers[i]["value"]+"\n";
        }
        ta.val(str);
        $("#headers-textarea-message").html("Enter headers in \"key\":\"value\" format.");
        $("#headers-textarea-message").removeClass('wrong-header');
        //#headers-textarea-message.wrong-header
    }


});