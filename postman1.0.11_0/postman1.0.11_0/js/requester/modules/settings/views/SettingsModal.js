var SettingsModal = Backbone.View.extend({
    el: $("#modal-settings"),

    initialize: function() {
        var settings = this.model;
        var debugInfo = new DebugInfo({model: this.model});

        var themeSettingsTab = new ThemeSettingsTab({model: settings});

        this.model.on('change:items', this.render, this);

        $("#modal-settings").on("shown", function () {
            $("#history-count").focus();
            pm.app.trigger("modalOpen", "#modal-settings");
        });

        $("#modal-settings").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        $('#history-count').change(function () {
            settings.setSetting("historyCount", $('#history-count').val());
        });


        $('#auto-save-request').change(function () {
            var val = $('#auto-save-request').val();
            if (val === "true") {
                settings.setSetting("autoSaveRequest", true);
            }
            else {
                settings.setSetting("autoSaveRequest", false);
            }
        });

        $('#trim-keys-and-values').change(function () {
            var val = $('#trim-keys-and-values').val();
            if (val === "true") {
                settings.setSetting("trimKeysAndValues", true);
            }
            else {
                settings.setSetting("trimKeysAndValues", false);
            }
        });

        $('#retain-link-headers').change(function () {
            var val = $('#retain-link-headers').val();
            if (val === "true") {
                settings.setSetting("retainLinkHeaders", true);
            }
            else {
                settings.setSetting("retainLinkHeaders", false);
            }
        });

        $('#send-no-cache-header').change(function () {
            var val = $('#send-no-cache-header').val();
            if (val === "true") {
                settings.setSetting("sendNoCacheHeader", true);
            }
            else {
                settings.setSetting("sendNoCacheHeader", false);
            }
        });

        $('#send-postman-token-header').change(function () {
            var val = $('#send-postman-token-header').val();
            if (val === "true") {
                settings.setSetting("sendPostmanTokenHeader", true);
            }
            else {
                settings.setSetting("sendPostmanTokenHeader", false);
            }
        });

        $('#use-postman-proxy').change(function () {
            var val = $('#use-postman-proxy').val();
            if (val === "true") {
                settings.setSetting("usePostmanProxy", true);
            }
            else {
                settings.setSetting("usePostmanProxy", false);
            }
        });

        $("#auto-follow-interceptor-redirects").change(function () {
            var val = $("#auto-follow-interceptor-redirects").val();
            if (val === "true") {
                settings.setSetting("interceptorRedirect", true);
            }
            else {
                settings.setSetting("interceptorRedirect", false);
            }
        });

        $('#postman-proxy-url').change(function () {
            settings.setSetting("postmanProxyUrl", $('#postman-proxy-url').val());
        });

        $('#response-font-size').change(function () {
            settings.setSetting("responseFontSize", parseInt($('#response-font-size').val(), 10));
        });

        $('#xhr-timeout').change(function () {
            settings.setSetting("xhrTimeout", parseInt($('#xhr-timeout').val(), 10));
        });

        $('#variable-delimiter').change(function () {
            settings.setSetting("variableDelimiter", $('#variable-delimiter').val());
        });

        $('#language-detection').change(function () {
            settings.setSetting("languageDetection", $('#language-detection').val());
        });


        $('#have-donated').change(function () {
            var val = $('#have-donated').val();
            // console.log("Donated status changed");
            if (val === "true") {
                settings.setSetting("haveDonated", true);
                pm.mediator.trigger("donatedStatusChanged", true);
            }
            else {
                settings.setSetting("haveDonated", false);
                pm.mediator.trigger("donatedStatusChanged", false);
            }
        });

        $('#force-windows-line-endings').change(function () {
            var val = $('#force-windows-line-endings').val();
            if (val === "true") {
                settings.setSetting("forceWindowsLineEndings", true);
            }
            else {
                settings.setSetting("forceWindowsLineEndings", false);
            }
        });

        // TODO
        // This needs to be moved somewhere else
        $("#instant-modals").change(function () {
            var val = $('#instant-modals').val();
            if (val === "true") {
                settings.setSetting("instantModals", true);
                $(".fade").removeClass("fade").addClass("fade_disable");
            }
            else {
                settings.setSetting("instantModals", false);
                $(".modal-backdrop.in").addClass("fade");
                $(".fade_disable").removeClass("fade_disable").addClass("fade");
            }
        });

        $("#download-all-data").on("click", function() {
            pm.indexedDB.downloadAllData(function() {
                noty(
                {
                    type:'success',
                    text:'Saved the data dump',
                    layout:'topCenter',
                    timeout:750
                });
            });
        });

        $("#import-all-data-files-input").on("change", function(event) {
            // console.log("Process file and import data");
            var files = event.target.files;
            pm.indexedDB.importAllData(files, function() {
                $("#import-all-data-files-input").val("");
                noty(
                {
                    type:'success',
                    text:'Imported all data',
                    layout:'topCenter',
                    timeout:750
                });
            }, function(msg) {
                //failure callback
                $("#import-all-data-files-input").val("");
                noty(
                    {
                        type:'error',
                        text:'Error parsing JSON: ' + msg,
                        layout:'topCenter'
                   });
            });
        });

        $(document).bind('keydown', 'shift+/', function () {
            if(pm.app.isModalOpen()) {
                return;
            }

            $('#modal-settings').modal({
                keyboard: true
            });

            $('#modal-settings').modal('show');
            $('#modal-settings a[href="#settings-shortcuts"]').tab('show');
        });

        if (this.model.getSetting("usePostmanProxy") === true) {
            $('#postman-proxy-url-container').css("display", "block");
        }
        else {
            $('#postman-proxy-url-container').css("display", "none");
        }

        this.render();
    },

    render: function() {
        $('#history-count').val(this.model.getSetting("historyCount"));
        $('#auto-save-request').val(this.model.getSetting("autoSaveRequest") + "");
        $('#trim-keys-and-values').val(this.model.getSetting("trimKeysAndValues") + "");
        $('#retain-link-headers').val(this.model.getSetting("retainLinkHeaders") + "");
        $('#send-no-cache-header').val(this.model.getSetting("sendNoCacheHeader") + "");
        $('#send-postman-token-header').val(this.model.getSetting("sendPostmanTokenHeader") + "");
        $('#use-postman-interceptor').val(this.model.getSetting("useInterceptor") + "");
        $('#use-postman-proxy').val(this.model.getSetting("usePostmanProxy") + "");
        $('#postman-proxy-url').val(this.model.getSetting("postmanProxyUrl"));
        $('#xhr-timeout').val(this.model.getSetting("xhrTimeout"));
        $('#variable-delimiter').val(this.model.getSetting("variableDelimiter"));
        $('#language-detection').val(this.model.getSetting("languageDetection"));
        $('#have-donated').val(this.model.getSetting("haveDonated") + "");
        $("#instant-modals").val(this.model.getSetting("instantModals")+ "");
        $('#response-font-size').val(this.model.getSetting("responseFontSize")+ "");
    }
});
