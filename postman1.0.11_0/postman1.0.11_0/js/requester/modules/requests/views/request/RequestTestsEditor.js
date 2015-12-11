var RequestTestsEditor = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        pm.mediator.on("refreshLayout", this.onRefreshLayout, this);
        pm.mediator.on("addSnippetToEditor", this.addSnippetToEditor, this);

        var snippets = new Snippets();
        this.snippetsList = new RequestTestsEditorSnippets({ model: snippets });

        this.model.on("startNew", this.onStartNew, this);    

        pm.mediator.on("onHideSnippets", function() {
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
                    $("#request-tests .try-jetpacks").remove();
                }
            }
        });

        pm.mediator.on("switchCodeMirrorTheme", this.onSwitchCodeMirrorTheme, this);

        $("#request-tests-editor-snippets-maximize").on("click", function() {
            pm.settings.setSetting("hideSnippets", false);
            pm.mediator.trigger("onShowSnippets");
            view.setLayout();
        });

        $("#request-tests").on("click", ".know-more-collection-runner", function() {
            tracker.sendEvent('test_runner', 'know_more', 'test_editor');
            pm.mediator.trigger("startPurchaseFlow", "test_runner");
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
            codeMirror.setTheme("ace/theme/"+theme);
        }        
    },

    hidePurchaseMessage: function() {
        var view = this;

        $(".request-tests-purchase-message").css("display", "none");
        $(".request-tests-wrapper").css("display", "block");
        setTimeout(function() {
            view.setLayout();
            view.loadTests();
        }, 1000);
    },

    showPurchaseMessage: function() {
        $(".request-tests-purchase-message").css("display", "block");
        $(".request-tests-wrapper").css("display", "none");
    },

    addSnippetToEditor: function(snippet) {        
        if (this.editor) {
            var code = this.editor.getValue();

            if(code !== "") {
                code += "\n\n";    
            }
            
            code += snippet.get("code");
            this.editor.setValue(code,1);
        }
    },

    setLayout: function() {        
        var areSnippetsHidden = pm.settings.getSetting("hideSnippets");

        // TODO Change these to fluid layouts later
        var containerWidth = $(document).width() - 385;
        var testEditorWidth;

        if (!areSnippetsHidden) {
            testEditorWidth = containerWidth - 200;
            $("#request-tests-editor-snippets-maximize").css("display", "none");
            $(".request-tests-editor-snippets").css("display", "block");
        }
        else {
            testEditorWidth = containerWidth;
            $("#request-tests-editor-snippets-maximize").css("display", "block");
            $(".request-tests-editor-snippets").css("display", "none");
        }

        $(".request-tests-editor-codemirror").css("width", testEditorWidth + "px");

        // Reenable resizing
        // $(".request-tests-editor-codemirror").css("height", "300px"); 
        // $(".request-tests-editor-snippets").css("height", "300px");
        $(".request-tests-editor-snippets").css("width", "197px");
    },

    onRefreshLayout: function() {
        this.setLayout();
    },

    onStartNew: function() {
        this.hideTests();
    },

    initializeEditor: function() {
        var view = this;
        
        if (this.editor) {
            return;
        }

        view.setLayout();

        var theme = pm.settings.getSetting("postmanCodeMirrorTheme");

        this.editor = ace.edit(document.getElementById("tests-aceeditor"));
        this.editor.getSession().setMode('ace/mode/javascript');

        var codeMirror = this.editor;

        $(".request-tests-editor-codemirror").resizable({
            stop: function() {
                codeMirror.resize(true);
            }
        });

        this.editor.resize();

        setTimeout(function() {            
            view.setLayout();            
            pm.mediator.trigger("refreshLayout");
        }, 750);
    },

    showTests: function() {
        $("#request-tests").css("display", "block");    
    },

    hideTests: function() {        
        $("#request-tests").css("display", "none");
    },

    loadTests: function() {
        var model = this.model;
        var view = this;

        // TODO Should only be called if the textarea is visible        
        if (!this.editor) {
            this.initializeEditor();
        }

        setTimeout(function() {
            view.editor.setValue("",-1);
            if (model.get("tests")) {
                view.editor.setValue(model.get("tests"), -1);
            }
            else {
                view.editor.setValue("", -1);
            }

            view.editor.gotoLine(0,0,false);
        }, 250);
    },

    updateModel: function() {        
        if (this.editor) {            
            this.model.set("tests", this.editor.getValue());    
        }        
    }

});
