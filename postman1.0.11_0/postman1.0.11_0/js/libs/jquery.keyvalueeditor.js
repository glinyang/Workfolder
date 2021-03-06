(function ($) {

    var methods = {
        //Not sure if this is needed
        settings:function () {
        },

        //Initialization
        init:function (options) {
            methods.settings = $.extend({}, $.fn.keyvalueeditor.defaults, options);


            return this.each(function () {
                var $this = $(this);
                var data = $this.data('keyvalueeditor');

                $(this).tooltip({
                    selector: '[rel=tooltip]'
                });

                //Not already initialized
                if (!data) {
                    data = {
                        settings:methods.settings,
                        editor:$this
                    };

                    //if (data.settings.editableKeys) {
                        var modalHTML = methods.getModalHTML(data);
                        var h = "<div class='keyvalueeditor-form-div'>" + methods.getLastRow(data); + "</div>";
                        $this.append(h);
                        $this.append(modalHTML);
                    //}

                    $this.on("focus.keyvalueeditor", '.keyvalueeditor-last', data, methods.focusEventHandler);
                    $this.on("focus.keyvalueeditor", '.keyvalueeditor-row input', data, methods.rowFocusEventHandler);
                    $this.on("blur.keyvalueeditor", '.keyvalueeditor-row input', data, methods.blurEventHandler);
                    $this.on("change.keyvalueeditor", '.keyvalueeditor-valueTypeSelector ', data, methods.valueTypeSelectEventHandler);
                    $this.on("click.keyvalueeditor", '.keyvalueeditor-delete', data, methods.deleteRowHandler);
                    $this.on("click.keyvalueeditor", '.keyvalueeditor-toggle', data, methods.toggleRowHandler);

                    $this.on("click.keyvalueeditor",'.keyvalueeditor-rowcheck',data, methods.blurEventHandler);
                    $this.on("click.keyvalueeditor",'.keyvalueeditor-rowcheck',data, methods.rowToggleHandler);
                    $this.on("mouseover.keyvalueeditor",'.keyvalueeditor-row',data,methods.showRowControls);
                    $this.on("focus.keyvalueeditor",'.keyvalueeditor-row',data,methods.showRowControls);
                    $this.on("mouseout.keyvalueeditor",'.keyvalueeditor-row',data,methods.hideRowControls);
                    $this.on("blur.keyvalueeditor",'.keyvalueeditor-row',data,methods.hideRowControls);

                    $(this).find(".keyvalueeditor-submitBulk").on("click",function(event) {
                        methods.submitBulk(event);
                    });

                    $(this).data('keyvalueeditor', data);

                    $(this).find(".keyvalueeditor-form-div").sortable({ stop: function( event, ui ) {
                        methods.updateValues($(this).parent().data('keyvalueeditor'));
                    }});

                    methods.removeControlsFromLastRow($(this));

                }

            });
        },

        getLastRow:function (state) {
            var settings = state.settings;
            var pKey = settings.placeHolderKey;
            var pValue = settings.placeHolderValue;
            var valueTypes = settings.valueTypes;

            var key = "";
            var value = "";

            var h;

            h = '<div class="keyvalueeditor-row keyvalueeditor-last clearfix"><div class="keyvalueeditor-inputs">';

            h += '<input type="text" class="keyvalueeditor-key" placeHolder="' + pKey
                + '" name="keyvalueeditor-key"'
                + '"/>';
            h += '<input type="text" class="keyvalueeditor-value keyvalueeditor-value-text" placeHolder="' + pValue
                + '" name="keyvalueeditor-value"'
                + '"/>';
            

            if ($.inArray("file", valueTypes) >= 0) {
                h += '<input type="file" multiple class="keyvalueeditor-value keyvalueeditor-value-file" placeHolder="' + pValue
                    + '" name="keyvalueeditor-value'
                    + '" value="' + value
                    + '" style="display: none;"/>';

                h += '<select class="keyvalueeditor-valueTypeSelector"><option value="text" selected>Text</option>' +
                    '<option value="file">File</option></select>';
            }

            h += '</div><div class="keyvalueeditor-action-wrapper">';

            if(settings.editableKeys!=false) {
                if(settings.disableOption === true) h += '<input tabindex="-1" type="checkbox" class="keyvalueeditor-rowcontrol keyvalueeditor-rowcheck" checked="checked">  ';
                h += '<span tabindex="-1" class="keyvalueeditor-rowcontrol dragger"><div class="icon-move"></div></span>';
            }

            h += '</div>';

            h += methods.getToggleLink(state.settings.toggleButton);
            h += '</div>';
            return h;
        },


        getNewRow:function (key, value, type, isEnabled, state) {
            var settings = state.settings;
            var pKey = settings.placeHolderKey;
            var pValue = settings.placeHolderValue;
            var valueTypes = settings.valueTypes;

            key = key ? key : "";
            value = value ? value : "";

            key = key.replace(/'/g, "&apos;").replace(/"/g, "&quot;");
            value = value.replace(/'/g, "&apos;").replace(/"/g, "&quot;");

            var h;
            isEnabled = (isEnabled==undefined || isEnabled);
            var checked = (isEnabled)?'checked="checked"':'';
            var stikethrough='text-decoration:' + ((isEnabled)?'none':'line-through');

            h = '<div class="keyvalueeditor-row clearfix"><div class="keyvalueeditor-inputs">';
            h += '<input type="text" class="keyvalueeditor-key" style="'+stikethrough+'" placeHolder="' + pKey
                + '" name="keyvalueeditor-' + key
                + '" value="' + key + '"';

            if (!settings.editableKeys) {
                h += ' data-editable="false"';
                h += ' readonly="readonly"';
                h += '/>';
            }
            else {
                h += '"/>';
            }

            if ($.inArray("file", valueTypes) >= 0) {
                if (type === "file") {
                    h += '<input type="text" class="keyvalueeditor-value keyvalueeditor-value-text" style="display:none;'+stikethrough+'" placeHolder="' + pValue
                        + '" name="keyvalueeditor-' + value
                        + '" value="' + value
                         + '" />';

                    h += '<input type="file" multiple class="keyvalueeditor-value keyvalueeditor-value-file" placeHolder="' + pValue
                        + '" name="keyvalueeditor-' + value
                        + '" value="' + value
                        + '"/>';

                    h += '<select class="keyvalueeditor-valueTypeSelector"><option value="text">Text</option>' +
                        '<option value="file" selected>File</option></select>';
                }
                else {
                    h += '<input type="text" class="keyvalueeditor-value keyvalueeditor-value-text" style="'+stikethrough+'" placeHolder="' + pValue
                        + '" name="keyvalueeditor-' + value
                        + '" value="' + value
                        + '"/>';

                    h += '<input type="file" multiple class="keyvalueeditor-value keyvalueeditor-value-file" placeHolder="' + pValue
                        + '" name="keyvalueeditor-' + value
                        + '" value="' + value
                        + '" style="display: none;"/>';

                    h += '<select class="keyvalueeditor-valueTypeSelector"><option value="text" selected>Text</option>' +
                        '<option value="file">File</option></select>';
                }
            }
            else {
                h += '<input type="text" class="keyvalueeditor-value keyvalueeditor-value-text" style="'+stikethrough+'" placeHolder="' + pValue
                    + '" name="keyvalueeditor-' + value
                    + '" value="' + value
                    + '"/>';
            }


            h += '</div><div class="keyvalueeditor-action-wrapper">';

            if(settings.editableKeys!=false) {
                if(settings.disableOption === true) h += '<input tabindex="-1" type="checkbox" class="keyvalueeditor-rowcontrol keyvalueeditor-rowcheck" '+ checked + '>';
                h += '<span tabindex="-1" class="keyvalueeditor-rowcontrol dragger"><div class="icon-move"></div></span>';
            }
            
            h += methods.getDeleteLink(state);

            h += '</div>';
            h += '</div>';
            return h;
        },

        getDeleteLink:function (state) {
            if (state.settings.editableKeys) {
                return '<a tabindex="-1" class="keyvalueeditor-rowcontrol keyvalueeditor-delete">' + state.settings.deleteButton + '</a>';
            }
            else {
                return "";
            }
        },

        deleteRowHandler:function (event) {
            var parentDiv = $(this).parent().parent();

            var target = event.currentTarget;

            //check for next row
            if($(target).parent().next().length==1) {
                $(target).parent().next().find(".keyvalueeditor-rowcontrol").css('visibility','visible');
            }

            $(target).parent().parent().remove();
            var data = event.data;
            data.settings.onDeleteRow();
        },

        getToggleLink:function(toggleButton) {
            return '<a tabindex="-1" class="keyvalueeditor-toggle" rel="tooltip" data-placement="bottom" data-original-title="Bulk edit">' + toggleButton + '</a>';
        },

        getModalHTML: function(state) {
            var str = '<div class="keyvalueeditor-modal modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'
                +'<div class="modal-dialog">'
                +'<div class="modal-content">'
                + '<div class="modal-header">'
                +    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
                +    '<h4 class="modal-title" id="myModalLabel">Bulk edit</h4>'
                +'</div>'
                +'<div class="modal-body">'
                +"<textarea class='keyvalueeditor-textarea' rows='6' cols='55'></textarea>"
                +'</div>'
                +'<div class="modal-footer">'
                +    '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>'
                +    '<button type="button" class="btn btn-primary keyvalueeditor-submitBulk">Save and Close</button>'
                +'</div>'
                +'</div>'
                +'</div>'
                +'</div>'
            var elem = $(str);
            elem.data("editor",state.editor);
            return elem;
        },

        submitBulk: function(event) {
            var modalContent = $(event.currentTarget).parent().parent().parent();
            var editorDiv = modalContent.parent().data("editor");
            var textarea = modalContent.find('.keyvalueeditor-textarea')

            var data = editorDiv.data("keyvalueeditor");
            var text = textarea.val();
            var newFields = data.settings.textToFormFunction(text);
            data.editor.keyvalueeditor('reset',newFields);
            modalContent.parent().modal('hide');
            methods.updateValues(data);
        },

        toggleRowHandler:function (event) {
            //UPDATE BOTH
            var parentDiv=$(this).parent().parent().parent();
            var currentFormFields = methods.getAllValues(parentDiv);
            parentDiv.find(".keyvalueeditor-textarea").val( methods.settings.formToTextFunction(currentFormFields) );
            parentDiv.children(".keyvalueeditor-modal").modal();
        },

        valueTypeSelectEventHandler:function (event) {
            var target = event.currentTarget;
            var valueType = $(target).val();
            var valueTypes = event.data.settings.valueTypes;
            for (var i = 0; i < valueTypes.length; i++) {
                $(target).parent().find('.keyvalueeditor-value').css("display", "none");
            }
            $(target).parent().find('input[type="' + valueType + '"]').css("display", "inline-block");
        },

        focusEventHandler:function (event) {
            var editableKeys = event.data.settings.editableKeys;

            if (!editableKeys) {
                return;
            }

            var params = {key:"", value:""};
            var editor = event.data.editor;
            $(this).removeClass('keyvalueeditor-last');
            $(this).find(".keyvalueeditor-toggle").remove();
            $(this).find('input.keyvalueeditor-rowcheck , .keyvalueeditor-rowcontrol.dragger,.keyvalueeditor-delete').show();


            var row = methods.getLastRow(event.data);
            if (event.data.settings.valueTypes.length > 1) {
                $(this).find('span:last').after(methods.getDeleteLink(event.data));
            }
            else {
                $(this).find('span:last').after(methods.getDeleteLink(event.data));
            }

            $(this).find(".keyvalueeditor-rowcontrol").css('visibility','visible');

            row = $(row);
            row.find('input.keyvalueeditor-rowcheck , .keyvalueeditor-rowcontrol.dragger').hide();

            $(this).after(row);
        },

        rowFocusEventHandler:function (event) {
            var data = event.data;
            data.settings.onFocusElement(event);
        },

        blurEventHandler:function (event) {
            methods.updateValues(event.data);
        },

        rowToggleHandler:function (event) {
            if($(event.currentTarget).is(":checked")) {
                $(event.currentTarget).parent().parent().find("input[type='text']").css('text-decoration','none');
            }
            else {
                $(event.currentTarget).parent().parent().find("input[type='text']").css('text-decoration','line-through');
            }
        },

        updateValues: function(data) {
            data.settings.onBlurElement();
        },

        showRowControls: function(event, ui) {
            $(event.currentTarget).find(".keyvalueeditor-rowcontrol").css('visibility','visible');
        },
        hideRowControls: function(event, ui) {
            $(event.currentTarget).find(".keyvalueeditor-rowcontrol").css('visibility','hidden');
        },


        removeControlsFromLastRow: function(editorDiv) {
            editorDiv.find(".keyvalueeditor-last").find(".keyvalueeditor-rowcontrol").hide();
        },

        //For external use
        addParam:function (param, state) {
            if (typeof param === "object") {
                if(!("type" in param)) {
                    param.type = "text";
                }
                if(state.settings.encodeValues===true) {
                    var decodedKey;
                    try {
                        decodedKey = decodeURIComponent(param.key);
                    }
                    catch(e) {
                        decodedKey = param.key;
                    }

                    var decodedValue;
                    try {
                        decodedValue = decodeURIComponent(param.value);
                    } catch(e) {
                        decodedValue = param.value;
                    }

                    if (state.settings.editableKeys) {
                        $(state.editor).find('.keyvalueeditor-form-div .keyvalueeditor-last').before(methods.getNewRow(decodedKey, decodedValue, param.type, param.enabled, state));
                    }
                    else {
                        $(state.editor).find('.keyvalueeditor-form-div').append(methods.getNewRow(decodedKey, decodedValue, param.type, param.enabled, state));
                    }
                }
                else if(state.settings.encodeValues===false) {
                    if (state.settings.editableKeys) {
                        $(state.editor).find('.keyvalueeditor-form-div .keyvalueeditor-last').before(methods.getNewRow(param.key, param.value, param.type, param.enabled, state));
                    }
                    else {
                        $(state.editor).find('.keyvalueeditor-form-div').append(methods.getNewRow(param.key, param.value, param.type, param.enabled, state));
                    }
                }

            }
        },

        //Check for duplicates here
        addParams:function (params, state) {
            if (!state) {
                state = $(this).data('keyvalueeditor');
            }

            var count = params.length;
            for (var i = 0; i < count; i++) {
                var param = params[i];
                methods.addParam(param, state);
            }

        },

        getValues:function (parentDiv) {
            if(parentDiv==null) {
                parentDiv=$(this);
            }
            var pairs = [];
            var editableKeys = parentDiv.data("keyvalueeditor").settings.editableKeys;
	        var disableOption = parentDiv.data("keyvalueeditor").settings.disableOption;
            parentDiv.find('.keyvalueeditor-row').each(function () {
                var isEnabled = $(this).find('.keyvalueeditor-rowcheck').is(':checked') || (!editableKeys) || (!disableOption);
                var key = $(this).find('.keyvalueeditor-key').val();
                var valueText = $(this).find('.keyvalueeditor-value-text').val();

	            var fileInput=$(this).find('.keyvalueeditor-value-file');
	            var valueFile;
	            if(fileInput.length===0) {
		            valueFile="";
	            }
	            else {
	                valueFile = fileInput.val().split("\\").pop();
	            }

                var type = $(this).find('.keyvalueeditor-valueTypeSelector').val();
	            var value;
//                if(!isEnabled) {
//                    return true;
//                }
                if (type === undefined) {
                    type = "text";
                }

				if(type==='text') {
					value = valueText;
				}
	            else if(type==='file') {
					value = valueFile;
				}
	            else {
					console.log("FATAL - Invalid file type");
				}

                if (key) {
                    var pair = {
                        key:key.trim(),
                        value:value.trim(),
                        type:type,
                        name: key,
                        enabled: isEnabled
                    };

                    pairs.push(pair);
                }
            });

            return pairs;
        },

        getAllValues:function (parentDiv) {
            if(parentDiv==null) {
                parentDiv=$(this);
            }
            var pairs = [];
	        var disableOption = parentDiv.data("keyvalueeditor").settings.disableOption;
            parentDiv.find('.keyvalueeditor-row').each(function () {
                var isEnabled = $(this).find('.keyvalueeditor-rowcheck').is(':checked') || (!disableOption);
                var key = $(this).find('.keyvalueeditor-key').val();
                var value = $(this).find('.keyvalueeditor-value').val();
                var type = $(this).find('.keyvalueeditor-valueTypeSelector').val();

                if (type === undefined) {
                    type = "text";
                }

                if (key) {
                    var pair = {
                        key:key.trim(),
                        value:value.trim(),
                        type:type,
                        name: key,
                        enabled: isEnabled
                    };

                    pairs.push(pair);
                }
            });

            return pairs;
        },

        getElements:function () {
            var rows = [];
            var state = $(this).data('keyvalueeditor');
            var valueTypes = state.settings.valueTypes;
	        var disableOption = state.settings.disableOption;
            $(this).find('.keyvalueeditor-row').each(function () {
                var keyElement = $(this).find('.keyvalueeditor-key');
                var valueElement;
                var type = "text";
                if ($.inArray("file", valueTypes)) {
                    type = $(this).find('.keyvalueeditor-valueTypeSelector').val();
                    if (type === "file") {
                        valueElement = $(this).find('.keyvalueeditor-value-file');
                    }
                    else {
                        valueElement = $(this).find('.keyvalueeditor-value-text');
                    }
                }
                else {
                    valueElement = $(this).find('.keyvalueeditor-value-text');
                }

				var isEnabled = $(this).find(".keyvalueeditor-rowcheck").is(":checked") || (!disableOption);
                if (keyElement.val()) {
                    var row = {
                        keyElement:keyElement,
                        valueElement:valueElement,
                        valueType:type,
						enabled:isEnabled
                    };

                    rows.push(row);
                }
            });
            return rows;
        },

        clear:function (state) {
            $(state.editor).find('.keyvalueeditor-row').each(function () {
                $(this).remove();
            });
            $(state.editor).find(".keyvalueeditor-form-div").val("");
            if (state.settings.editableKeys) {
                var h = methods.getLastRow(state);
                $(state.editor).find(".keyvalueeditor-form-div").append(h);
            }

        },

        reset:function (params, state) {
            if(state==null) {
                state = $(this).data('keyvalueeditor');
            }
            methods.clear(state);
            if (params) {
                methods.addParams(params, state);
            }

            methods.removeControlsFromLastRow(state.editor);
            state.settings.onReset();
        },

        add:function (params) {
            var state = $(this).data('keyvalueeditor');
            methods.clear(state);
            if (params) {
                methods.addParams(params, state);
            }
            methods.removeControlsFromLastRow(state.editor);
        },

        destroy:function () {
            return this.each(function () {
                //unbind listeners if needed
            });
        }
    };

    $.fn.keyvalueeditor = function (method) {
        //Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.keyvalueeditor');
        }
    };

    $.fn.keyvalueeditor.defaults = {
        type:"normal",
        fields:2,
        deleteButton:"Delete",
        toggleButton:'<span class="icon-bulk-edit"/>',
        placeHolderKey:"Key",
        placeHolderValue:"Value",
        valueTypes:["text"],
        editableKeys:true,
        encodeValues: false,
	    disableOption: true,
        onInit:function () {
        },
        onReset:function () {
        },
        onFocusElement:function () {
        },
        onBlurElement:function () {
        },
        onDeleteRow:function () {
        },
        onAddedParam:function () {
        },
        textToFormFunction:function(text) {
            var lines = text.split("\n");
            var numLines = lines.length;
            var newHeaders=[];
            var i;
            for(i=0;i<numLines;i++) {
                var newHeader={};
                var thisPair = lines[i].split(":");
                if(thisPair.length==0) {
                    console.log("Incorrect format for " + lines[i]);
                    continue;
                }
                var key = thisPair.shift().trim();
                var value = thisPair.join(":").trim();
                var isEnabled=true;
                if(key.indexOf("//")==0) {
                    key=key.substring(2);
                    isEnabled=false;
                }
                newHeader["key"]=newHeader["name"]=key;
                newHeader["enabled"]=isEnabled;
                newHeader["type"]="text";
                newHeader["value"]=value;
                newHeaders.push(newHeader);
            }
            return newHeaders;
        },
        formToTextFunction:function(arr) {
            var text="";
            var len = arr.length;
            var i=0;
            for(i=0;i<len;i++) {
                if(arr[i]["enabled"]==false) text+="//";
                text+=arr[i]["key"]+": "+arr[i]["value"]+"\n";
            }
            return text;
        }
    };

})(jQuery);
