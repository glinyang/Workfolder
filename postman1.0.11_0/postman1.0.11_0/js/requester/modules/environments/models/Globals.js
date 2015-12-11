
var Globals = Backbone.Model.extend({
    isLoaded: false,
    initializedSyncing: false,

    defaults: function() {
        return {
            "globals": [],
            "syncFileID": "postman_globals",
            "synced": false
        };
    },

    initialize:function () {
        this.set({"globals": []});

        var model = this;

        pm.appWindow.trigger("registerInternalEvent", "updatedGlobals", this.onUpdatedGlobals, this);

        pm.mediator.on("downloadGlobals", this.downloadGlobals, this);

        this.startListeningForFileSystemSyncEvents();

        pm.storage.getValue('globals', function(s) {
            if (s) {
                model.set({"globals": JSON.parse(s)});
            }
            else {
                model.set({"globals": []});
            }

            model.isLoaded = true;
            model.trigger("startSync");
        });
    },

    startListeningForFileSystemSyncEvents: function() {
        var model = this;
        var isLoaded = model.isLoaded;
        var initializedSyncing = model.initializedSyncing;

        pm.mediator.on("initializedSyncableFileSystem", function() {
            model.initializedSyncing = true;
            model.trigger("startSync");
        });

        this.on("startSync", this.startSyncing, this);
    },

    startSyncing: function() {
        var i = 0;
        var model = this;
        var globals;
        var synced;
        var syncableFile;

        if (this.isLoaded && this.initializedSyncing) {
            pm.mediator.on("addSyncableFileFromRemote", function(type, data) {
                if (type === "globals") {
                    model.onReceivingSyncableFileData(data);
                }
            });

            pm.mediator.on("updateSyncableFileFromRemote", function(type, data) {
                if (type === "globals") {
                    model.onReceivingSyncableFileData(data);
                }
            });

            pm.mediator.on("deleteSyncableFileFromRemote", function(type, id) {
                if (type === "globals") {
                    model.onRemoveSyncableFile(id);
                }
            });

            synced = pm.settings.getSetting("syncedGlobals");

            if (!synced) {
                this.addToSyncableFilesystem(this.get("syncFileID"));
            }
        }
        else {
        }
    },

    onReceivingSyncableFileData: function(data) {
        var globals = JSON.parse(data);
        this.mergeGlobals(globals);
    },

    onRemoveSyncableFile: function(id) {
        // console.log("Do nothing");
        // this.deleteEnvironment(id, true);
    },

    getAsSyncableFile: function(id) {
        var name = id + ".globals";
        var type = "globals";
        var data = JSON.stringify(this.get("globals"));

        return {
            "name": name,
            "type": type,
            "data": data
        };
    },

    addToSyncableFilesystem: function(id) {
        var model = this;

        var syncableFile = this.getAsSyncableFile(id);

        pm.mediator.trigger("addSyncableFile", syncableFile, function(result) {
            if(result === "success") {
                model.updateGlobalSyncStatus(id, true);
            }
        });
    },

    removeFromSyncableFilesystem: function(id) {
        var name = id + ".globals";
        pm.mediator.trigger("removeSyncableFile", name, function(result) {
            model.saveGlobals([]);
        });
    },

    updateGlobalSyncStatus: function(id, status) {
        pm.settings.setSetting("syncedGlobals", status);
    },

    onUpdatedGlobals: function(globals) {
        // console.log("Globals: This is ", this);
        // console.log("Globals are now", globals);
        this.set({"globals": globals});
    },

    downloadGlobals: function() {
        var name = "globals.postman_globals";
        var type = "application/json";

        globalsJSON = this.get("globals");

        var filedata = JSON.stringify(globalsJSON, null, '\t');

        pm.filesystem.saveAndOpenFile(name, filedata, type, function () {
            noty(
                {
                    type:'success',
                    text:'Saved globals to disk',
                    layout:'topCenter',
                    timeout:750
                });
        });
    },

    saveGlobals:function (globals) {
        var model = this;

        this.set({"globals": globals});

        var o = {'globals': JSON.stringify(globals)};

        pm.storage.setValue(o, function() {
            pm.appWindow.trigger("sendMessageObject", "updatedGlobals", globals);
            model.addToSyncableFilesystem(model.get("syncFileID"));
        });
    },

    clearGlobals: function () {
        var model = this;

        this.set({"globals": []});

        var o = {'globals': JSON.stringify([])};

        pm.storage.setValue(o, function() {
            pm.appWindow.trigger("sendMessageObject", "clearedGlobals", []);
            model.addToSyncableFilesystem(model.get("syncFileID"));
        });
    },

    mergeGlobals: function(globals) {
        this.set({"globals": globals});
        var o = {'globals': JSON.stringify(globals)};
        pm.storage.setValue(o, function() {
            pm.appWindow.trigger("sendMessageObject", "updatedGlobals", globals);
        });
    }
});