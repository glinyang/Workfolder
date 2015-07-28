var RequestPrscriptEditor = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        pm.mediator.on("refreshPrscriptLayout", this.onRefreshLayout, this);
        pm.mediator.on("addPrscriptSnippetToEditor", this.addPrscriptSnippetToEditor, this);

        var snippets = new PrscriptSnippets();
        this.snippetsList = new RequestPrscriptEditorSnippets({ model: snippets });

        this.model.on("startNew", this.onStartNew, this);

        pm.mediator.on("onHidePrscriptSnippets", function() {
            view.setLayout();
        });

        pm.mediator.on("purchaseComplete", function(newPurchase) {
            if (newPurchase.id === "collection-runner") {
                view.hidePurchaseMessage();
            }
        });

        pm.mediator.on("loadedPurchases", function(purchases) {
            if (purchases.isUpgradeAvailable("collection-runner")) {
                view.hidePurchaseMessage();
            }
            else {
                view.showPurchaseMessage();

                if (pm.purchases.isTrialCompleted("collection-runner")) {
                    $("#request-helper-prscript .try-jetpacks").remove();
                }
            }
        });

        pm.mediator.on("switchCodeMirrorTheme", this.onSwitchCodeMirrorTheme, this);

        $("#request-prscript-editor-snippets-maximize").on("click", function() {
            pm.settings.setSetting("hidePrscriptSnippets", false);
            pm.mediator.trigger("onShowPrscriptSnippets");
            view.setLayout();
        });

        $("#request-helper-prscript").on("click", ".know-more-collection-runner", function() {
            tracker.sendEvent('test_runner', 'know_more', 'test_editor');
            pm.mediator.trigger("startPurchaseFlow", "test_runner");
        });

        //Hack - codemirror rendering issues
        $('li[data-id="prscript"]').on("click",function() {
            var oldWidth = window.innerWidth;
            window.resizeTo(window.innerWidth-1);
            window.resizeTo(oldWidth);
        });

        setTimeout(function() {
            view.setLayout();
        }, 1000);

        if (!this.editor) {
            this.initializeEditor();
        }
    },

    onSwitchCodeMirrorTheme: function(theme) {        
        var codeMirror = this.editor;

        if (codeMirror) {
            //codeMirror.setOption("theme", theme);
            codeMirror.setTheme("ace/theme/"+theme);
        }        
    },

    clearTextarea: function() {
        if (this.editor) {
            this.editor.setValue("",1);
        }
    },

    hidePurchaseMessage: function() {
        var view = this;

        $(".request-prscript-purchase-message").css("display", "none");
        $(".request-prscript-wrapper").css("display", "block");
        setTimeout(function() {
            view.setLayout();
            view.loadPrscript();
        }, 1000);
    },

    showPurchaseMessage: function() {
        $(".request-prscript-purchase-message").css("display", "block");
        $(".request-prscript-wrapper").css("display", "none");
    },

    addPrscriptSnippetToEditor: function(snippet) {
        if (this.editor) {
            var code = this.editor.getValue();

            if(code !== "") {
                code += "\n\n";
            }

            code += snippet.get("code");
            this.editor.setValue(code,0);
        }
    },

    setLayout: function() {
        var areSnippetsHidden = pm.settings.getSetting("hidePrscriptSnippets");

        // TODO Change these to fluid layouts later
        var containerWidth = $(document).width() - 385;
        var testEditorWidth;

        if (!areSnippetsHidden) {
            testEditorWidth = containerWidth - 200;
            $("#request-prscript-editor-snippets-maximize").css("display", "none");
            $(".request-prscript-editor-snippets").css("display", "block");
        }
        else {
            testEditorWidth = containerWidth;
            $("#request-prscript-editor-snippets-maximize").css("display", "block");
            $(".request-prscript-editor-snippets").css("display", "none");
        }

        $(".request-prscript-editor-codemirror").css("width", testEditorWidth + "px");

        // Reenable resizing
        // $(".request-prscript-editor-codemirror").css("height", "300px");
        // $(".request-prscript-editor-snippets").css("height", "300px");
        $(".request-prscript-editor-snippets").css("width", "197px");
    },

    onRefreshLayout: function() {
        this.setLayout();
    },

    onStartNew: function() {
        this.hidePrscript();
    },

    initializeEditor: function() {
        var view = this;

        if (this.editor) {
            return;
        }

        view.setLayout();

        var theme = pm.settings.getSetting("postmanCodeMirrorTheme");

        this.editor = ace.edit(document.getElementById("prscript-aceeditor"));
        this.editor.getSession().setMode('ace/mode/javascript');

        var codeMirror = this.editor;

        $(".request-prscript-editor-codemirror").resizable({
            stop: function() {
                codeMirror.resize(true);
            }
        });

        this.editor.resize();

        setTimeout(function() {
            view.setLayout();
            pm.mediator.trigger("refreshPrscriptLayout");
        }, 750);
    },

    showPrscript: function() {
        $("#request-helper-prscript").css("display", "block");
    },

    hidePrscript: function() {
        $("#request-helper-prscript").css("display", "none");
    },

    loadPrscript: function() {
        var model = this.model;
        var view = this;

        // TODO Should only be called if the textarea is visible        
        if (!this.editor) {
            this.initializeEditor();
        }

        setTimeout(function() {
            view.editor.setValue("",0);
            if (model.get("preRequestScript")) {
                view.editor.setValue(model.get("preRequestScript"),-1);
            }
            else {
                view.editor.setValue("",-1);
            }
            //CodeMirror.commands["goDocStart"](view.editor);
            view.editor.gotoLine(0,0,false);
        }, 300);
    },

    updateModel: function() {
        if (this.editor) {
            this.model.set("preRequestScript", this.editor.getValue());
        }
    }

});
