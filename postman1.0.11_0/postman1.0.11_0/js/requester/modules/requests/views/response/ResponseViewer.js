var ResponseViewer = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var responseModel = model.get("response");
        var view = this;

        this.defaultSection = "body";

        this.responseBodyViewer = new ResponseBodyViewer({model: this.model});
        this.responseHeaderViewer = new ResponseHeaderViewer({model: this.model});
        this.responseCookieViewer = new ResponseCookieViewer({model: this.model});
        this.responseMetaViewer = new ResponseMetaViewer({model: this.model});
        this.responseSaver = new ResponseSaver({model: this.model});

        this.testResultViewer = new TestResultViewer({model: this.model});

        responseModel.on("failedRequest", this.onFailedRequest, this);
        responseModel.on("clearResponse", this.clear, this);
        responseModel.on("sentRequest", this.onSentRequest, this);
        responseModel.on("loadResponse", this.load, this);

        $('#response-body-toggle').on("click", function () {
            view.responseBodyViewer.toggleBodySize();
        });

        $('#response-body-line-wrapping').on("click", function () {
            view.responseBodyViewer.toggleLineWrapping();
            return true;
        });

        $('#response-formatting').on("click", "a", function () {
            var previewType = $(this).attr('data-type');
            view.responseBodyViewer.changePreviewType(previewType);
        });

        $('#response-language').on("click", "a", function () {
            var language = $(this).attr("data-mode");
            view.responseBodyViewer.setMode(language);
        });

        $('#response-data,#response-headers').on("mousedown", ".cm-link", function () {
            var link = $(this).html();
            if(link[0]=='/') {
                var currentUrl = model.get("url");
                //get the first part of the URL (after http:// and before the first /)
                function getFirstPart(url) {
                    var indexOfTS = url.indexOf("//");
                    if(indexOfTS==-1) {
                        return url.split("/")[0];
                    }
                    else {
                        var fp = url.substring(indexOfTS+2);
                        return url.substring(0,indexOfTS)+"//"+fp.split("/")[0];
                    }

                }
                link = getFirstPart(currentUrl) + link;

            }
            var headers = $('#headers-keyvaleditor').keyvalueeditor('getValues');
            model.loadRequestFromLink(link, headers);
        });

        $('.response-tabs').on("click", "li", function () {
            var section = $(this).attr('data-section');
            pm.settings.setSetting("responsePreviewDataSection", section);

            if (section === "body") {
                view.showBody();
            }
            else if (section === "headers") {
                view.showHeaders();
            }
            else if (section === "cookies") {
                view.showCookies();
            }
            else if (section === "tests") {
                view.showTests();
            }
        });


        $(document).bind('keydown', 'f', function () {
            if(pm.app.isModalOpen()) {
                return;
            }

            view.responseBodyViewer.toggleBodySize();
        });

        //Helper funcs for detecting links in the response header - POSTman pull request 795
        var linkRegex = /(\s*<\s*)([^>]*)(\s*>[^,]*,?)/g;

        var linkFunc = function (all, pre_uri, uri, post_uri) {
            return Handlebars.Utils.escapeExpression(pre_uri)
                + "<span class=\"cm-link\">"
                + uri
                + "</span>"
                + Handlebars.Utils.escapeExpression(post_uri);
        };

        Handlebars.registerHelper('link_to_hyperlink', function(linkValue) {
            var output = linkValue.replace(linkRegex, linkFunc);
            return new Handlebars.SafeString(output);
        });
    },

    onSentRequest: function() {
        this.showScreen("waiting");
    },

    onFailedRequest: function(errorUrl) {
        $('#connection-error-url').html("<a href='" + errorUrl + "' target='_blank'>" + errorUrl + "</a>");
        this.showScreen("failed");
    },

    clear: function() {
        $('#response').css("display", "none");
    },

    load:function () {
        var model = this.model;
        var request = model;
        var response = model.get("response");
        var headers = response.get("headers");
        var time = response.get("time");

        var previewType = response.get("previewType");
        var language = response.get("language");
        var responseRawDataType = response.get("rawDataType");
        var responseData = response.get("responseData");
        var text = response.get("text");
        var method = request.get("method");
        var action = model.get("action");
        var presetPreviewType = pm.settings.getSetting("previewType");

        var activeSection = pm.settings.getSetting("responsePreviewDataSection");

        this.showScreen("success");

        $('#response').css("display", "block");
        $("#response-data").css("display", "block");

        if (action === "download") {
            this.showHeaders();
        }
        else {
            if (method === "HEAD") {
                this.showHeaders();
            }
            else {
                if (activeSection === "body") {
                    this.showBody();
                }
                else if (activeSection === "headers") {
                    this.showHeaders();
                }
                else if (activeSection === "tests") {
                    this.showTests();
                }
                else if (activeSection === "cookies") {
                    this.showCookies();
                }
                else {
                    this.showBody();
                }
            }
        }

        if (request.get("isFromCollection") === true) {
            $("#response-collection-request-actions").css("display", "block");
        }
        else {
            $("#response-collection-request-actions").css("display", "none");
        }

        response.trigger("finishedLoadResponse");
        $("#response-as-code, #response-as-code .CodeMirror, textarea#code-data-raw").css("font-size", pm.settings.getSetting("responseFontSize")+"px");
    },

    showHeaders:function () {
        $('.response-tabs li').removeClass("active");
        $('.response-tabs li[data-section="headers"]').addClass("active");
        $('#response-data-container').css("display", "none");
        $('#response-headers-container').css("display", "block");
        $('#response-cookies-container').css("display", "none");
        $('#response-tests-container').css("display", "none");
    },

    showBody:function () {
        $('.response-tabs li').removeClass("active");
        $('.response-tabs li[data-section="body"]').addClass("active");
        $('#response-data-container').css("display", "block");
        $('#response-headers-container').css("display", "none");
        $('#response-cookies-container').css("display", "none");
        $('#response-tests-container').css("display", "none");
    },

    showCookies:function () {
        $('.response-tabs li').removeClass("active");
        $('.response-tabs li[data-section="cookies"]').addClass("active");
        $('#response-data-container').css("display", "none");
        $('#response-headers-container').css("display", "none");
        $('#response-cookies-container').css("display", "block");
        $('#response-tests-container').css("display", "none");
    },

    showTests:function () {
        $('.response-tabs li').removeClass("active");
        $('.response-tabs li[data-section="tests"]').addClass("active");
        $('#response-data-container').css("display", "none");
        $('#response-headers-container').css("display", "none");
        $('#response-cookies-container').css("display", "none");
        $('#response-tests-container').css("display", "block");
    },

    showScreen:function (screen) {
        $("#response").css("display", "block");
        var active_id = "#response-" + screen + "-container";
        var all_ids = ["#response-waiting-container",
            "#response-failed-container",
            "#response-success-container"];
        for (var i = 0; i < 3; i++) {
            $(all_ids[i]).css("display", "none");
        }

        $(active_id).css("display", "block");
    }
});