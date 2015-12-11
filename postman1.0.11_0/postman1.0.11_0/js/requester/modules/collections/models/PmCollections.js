var PmCollections = Backbone.Collection.extend({
    originalCollectionId: "",
    toBeImportedCollection:{},

    model: PmCollection,

    isLoaded: false,
    initializedSyncing: false,
    syncFileTypeCollection: "collection",
    syncFileTypeCollectionRequest: "collection_request",

    comparator: function(a, b) {
        var counter;

        var aName = a.get("name");
        var bName = b.get("name");

        if (aName.length > bName.legnth)
            counter = bName.length;
        else
            counter = aName.length;

        for (var i = 0; i < counter; i++) {
            if (aName[i] == bName[i]) {
                continue;
            } else if (aName[i] > bName[i]) {
                return 1;
            } else {
                return -1;
            }
        }
        return 1;
    },

    initialize: function() {
        this.loadAllCollections();

        // TODO Add events for in-memory updates
        pm.appWindow.trigger("registerInternalEvent", "addedCollection", this.onAddedCollection, this);
        pm.appWindow.trigger("registerInternalEvent", "updatedCollection", this.onUpdatedCollection, this);
        pm.appWindow.trigger("registerInternalEvent", "deletedCollection", this.onDeletedCollection, this);

        pm.appWindow.trigger("registerInternalEvent", "addedCollectionRequest", this.onAddedCollectionRequest, this);
        pm.appWindow.trigger("registerInternalEvent", "updatedCollectionRequest", this.onUpdatedCollectionRequest, this);
        pm.appWindow.trigger("registerInternalEvent", "deletedCollectionRequest", this.onDeletedCollectionRequest, this);

        pm.mediator.on("addDirectoryCollection", this.onAddDirectoryCollection, this);
        pm.mediator.on("addResponseToCollectionRequest", this.addResponseToCollectionRequest, this);
        pm.mediator.on("updateResponsesForCollectionRequest", this.updateResponsesForCollectionRequest, this);
        pm.mediator.on("deletedSharedCollection", this.onDeletedSharedCollection, this);
        pm.mediator.on("overwriteCollection", this.onOverwriteCollection, this);
        pm.mediator.on("uploadAllLocalCollections", this.onUploadAllLocalCollections, this);
    },

    onAddedCollection: function(collection) {
        this.add(collection, { merge: true });
    },

    onUpdatedCollection: function(collection) {
        this.add(collection, { merge: true });
        this.trigger("updateCollection");
    },

    onDeletedCollection: function(id) {
        this.remove(id);
    },

    onAddedCollectionRequest: function(request) {
        var collection = this.get(request.collectionId);

        if (collection) {
            collection.addRequest(request);
        }
    },

    onUpdatedCollectionRequest: function(request) {
        var collection = this.get(request.collectionId);

        if (collection) {
            collection.updateRequest(request);
        }
    },

    onDeletedCollectionRequest: function(id) {
        var collection = this.get(request.collectionId);

        if (collection) {
            collection.deleteRequest(id);
        }
    },

    onUploadAllLocalCollections: function() {

        var uploaded = 0;
        var count = this.models.length;

        function callback() {
            uploaded++;

            if (uploaded === count) {
                pm.mediator.trigger("refreshSharedCollections");
            }
        }

        for(var i = 0; i < this.models.length; i++) {
            this.uploadCollection(this.models[i].get("id"), false, false, callback);
        }
    },

    getCollectionById: function(id) {
        for(var i = 0; i < this.models.length; i++) {
            if(id===this.models[i].get("id")) {
                return this.models[i];
            }
        }
        return null;
    },

    getAllCollections: function() {
        return this.models;
    },

    // Load all collections
    loadAllCollections:function () {
        var pmCollection = this;

        this.startListeningForFileSystemSyncEvents();

        pm.indexedDB.getCollections(function (items) {
            var itemsLength = items.length;
            var loaded = 0;

            function onGetAllRequestsInCollection(collection, requests) {
                var c = new PmCollection(collection);
                c.setRequests(requests);
                pmCollection.add(c, {merge: true});

                loaded++;

                for(var i = 0; i < requests.length; i++) {
                    pm.mediator.trigger("addToURLCache", requests[i].url);
                }

                if (loaded === itemsLength) {
                    pmCollection.isLoaded = true;
                    pmCollection.trigger("startSync");

                    pm.mediator.trigger("refreshCollections");
                    pm.mediator.trigger("loadedCollections");
                }
            }

            if (itemsLength === 0) {
                pmCollection.isLoaded = true;
                pmCollection.trigger("startSync");
            }
            else {
                for (var i = 0; i < itemsLength; i++) {
                    var collection = items[i];
                    pm.indexedDB.getAllRequestsInCollection(collection, onGetAllRequestsInCollection);
                }
            }
        });
    },

    startListeningForFileSystemSyncEvents: function() {
        var pmCollection = this;
        var isLoaded = pmCollection.isLoaded;
        var initializedSyncing = pmCollection.initializedSyncing;

        pm.mediator.on("initializedSyncableFileSystem", function() {
            pmCollection.initializedSyncing = true;
            pmCollection.trigger("startSync");
        });

        this.on("startSync", this.startSyncing, this);
    },

    startSyncing: function() {
        var i;
        var j;
        var pmCollection = this;
        var collection;
        var requests;
        var request;
        var synced;
        var syncableFile;

        if (this.isLoaded && this.initializedSyncing) {

            pm.mediator.on("addSyncableFileFromRemote", function(type, data) {
                if (type === "collection") {
                    pmCollection.onReceivingSyncableFileData(data);
                }
                else if (type === "collection_request") {
                    pmCollection.onReceivingSyncableFileDataForRequests(data);
                }
            });

            pm.mediator.on("updateSyncableFileFromRemote", function(type, data) {
                if (type === "collection") {
                    pmCollection.onReceivingSyncableFileData(data);
                }
                else if (type === "collection_request") {
                    pmCollection.onReceivingSyncableFileDataForRequests(data);
                }
            });

            pm.mediator.on("deleteSyncableFileFromRemote", function(type, id) {
                if (type === "collection") {
                    pmCollection.onRemoveSyncableFile(id);
                }
                else if (type === "collection_request") {
                    pmCollection.onRemoveSyncableFileForRequests(id);
                }
            });

            // And this
            for(i = 0; i < this.models.length; i++) {
                collection = this.models[i];
                synced = collection.get("synced");

                if (!synced) {
                    this.addToSyncableFilesystem(collection.get("id"));
                }

                requests = collection.get("requests");

                for(j = 0; j < requests.length; j++) {
                    request = requests[j];

                    if (request.hasOwnProperty("synced")) {
                        if (!request.synced) {
                            this.addRequestToSyncableFilesystem(request.id);
                        }
                    }
                    else {
                        this.addRequestToSyncableFilesystem(request.id);
                    }
                }
            }
        }
        else {
        }
    },

    onReceivingSyncableFileData: function(data) {
        var collection = JSON.parse(data);
        this.addCollectionFromSyncableFileSystem(collection);
    },

    onRemoveSyncableFile: function(id) {
        this.deleteCollectionFromDataStore(id, false, function() {
        });
    },

    onReceivingSyncableFileDataForRequests: function(data) {
        var request = JSON.parse(data);
        this.addRequestFromSyncableFileSystem(request);
    },

    onRemoveSyncableFileForRequests: function(id) {
        this.deleteRequestFromDataStore(id, false, false, function() {
        });
    },

    onOverwriteCollection: function(collection) {
        this.overwriteCollection(collection);
    },

    onDeletedSharedCollection: function(collection) {
        var c;
        var pmCollection = this;

        for(var i = 0; i < this.models.length; i++) {
            var c = this.models[i];
            if (c.get("remote_id") === collection.remote_id) {
                c.set("remote_id", 0);
                pmCollection.updateCollectionInDataStore(c.getAsJSON(), true, function (c) {
                });
                break;
            }
        }
    },

    getAsSyncableFile: function(id) {
        var collection = this.get(id);
        var name = id + ".collection";
        var type = "collection";

        var data = JSON.stringify(collection.toSyncableJSON());

        return {
            "name": name,
            "type": type,
            "data": data
        };
    },

    getRequestAsSyncableFile: function(id) {
        var request = this.getRequestById(id);
        var name = id + ".collection_request";
        var type = "collection_request";

        request.synced = true;

        var data = JSON.stringify(request);

        return {
            "name": name,
            "type": type,
            "data": data
        };
    },

    addToSyncableFilesystem: function(id) {
        var pmCollection = this;

        var syncableFile = this.getAsSyncableFile(id);
        pm.mediator.trigger("addSyncableFile", syncableFile, function(result) {
            if(result === "success") {
                pmCollection.updateCollectionSyncStatus(id, true);
            }
        });
    },

    removeFromSyncableFilesystem: function(id) {
        var name = id + ".collection";
        pm.mediator.trigger("removeSyncableFile", name, function(result) {
        });
    },

    addRequestToSyncableFilesystem: function(id) {
        var pmCollection = this;

        var syncableFile = this.getRequestAsSyncableFile(id);
        pm.mediator.trigger("addSyncableFile", syncableFile, function(result) {
            if(result === "success") {
                pmCollection.updateCollectionRequestSyncStatus(id, true);
            }
        });
    },

    removeRequestFromSyncableFilesystem: function(id) {
        var name = id + ".collection_request";
        pm.mediator.trigger("removeSyncableFile", name, function(result) {
        });
    },

    /* Base data store functions*/
    addCollectionToDataStore: function(collectionJSON, sync, callback) {
        var pmCollection = this;

        pm.indexedDB.addCollection(collectionJSON, function (c) {
            var collection = new PmCollection(c);

            pmCollection.add(collection, {merge: true});
            pm.appWindow.trigger("sendMessageObject", "addedCollection", collection);

            pm.mediator.trigger("refreshCollections");


            if (sync) {
                pmCollection.addToSyncableFilesystem(collection.get("id"));
            }

            if (callback) {
                callback(c);
            }
        });
    },

    updateCollectionInDataStore: function(collectionJSON, sync, callback) {
        var pmCollection = this;

        pm.indexedDB.updateCollection(collectionJSON, function (c) {
            var collection = pmCollection.get(c.id);
            pmCollection.add(collection, {merge: true});
            pm.appWindow.trigger("sendMessageObject", "updatedCollection", collection);

            pm.mediator.trigger("refreshCollections");

            if (sync) {
                pmCollection.addToSyncableFilesystem(collection.get("id"));
            }

            if (callback) {
                callback(c);
            }
        });
    },

    deleteCollectionFromDataStore: function(id, sync, callback) {
        var pmCollection = this;

        pm.indexedDB.deleteCollection(id, function () {
            pmCollection.remove(id);
            pm.appWindow.trigger("sendMessageObject", "deletedCollection", id);

            if (sync) {
                pmCollection.removeFromSyncableFilesystem(id);
            }

            pm.indexedDB.getAllRequestsForCollectionId(id, function(requests) {
                var deleted = 0;
                var requestCount = requests.length;
                var request;
                var i;

                if (requestCount > 0) {
                    for(i = 0; i < requestCount; i++) {
                        request = requests[i];

                        pm.indexedDB.deleteCollectionRequest(request.id, function (requestId) {
                            deleted++;

                            if (sync) {
                                pmCollection.removeRequestFromSyncableFilesystem(requestId);
                            }

                            if (deleted === requestCount) {
                                pm.mediator.trigger("refreshCollections");
                                if (callback) {
                                    callback();
                                }
                            }
                        });
                    }
                }
                else {
                    if (callback) {
                        callback();
                    }
                }
            });
        });
    },

    addRequestToDataStore: function(request, sync, callback) {
        var pmCollection = this;

        pm.indexedDB.addCollectionRequest(request, function (req) {
            pm.mediator.trigger("addToURLCache", request.url);

            var collection = pmCollection.get(request.collectionId);

            if (collection) {
                collection.addRequest(request);
                pm.appWindow.trigger("sendMessageObject", "addedCollectionRequest", request);
            }

            if (sync) {
                pmCollection.addRequestToSyncableFilesystem(request.id);
            }

            if (callback) {
                callback(request);
            }
        });
    },

    updateRequestInDataStore: function(request, sync, callback) {
        var pmCollection = this;

        if (!request.name) {
            request.name = request.url;
        }

        pm.indexedDB.updateCollectionRequest(request, function (req) {
            var collection = pmCollection.get(request.collectionId);

            if (collection) {
                collection.updateRequest(request);
                pm.appWindow.trigger("sendMessageObject", "updatedCollectionRequest", request);
            }

            if (sync) {
                pmCollection.addRequestToSyncableFilesystem(request.id);
            }

            if (callback) {
                callback(request);
            }
        });
    },

    deleteRequestFromDataStore: function(id, sync, syncCollection, callback) {
        var pmCollection = this;

        var request = this.getRequestById(id);

        var targetCollection;

        if (request) {
            targetCollection = this.get(request.collectionId);
        }

        pm.indexedDB.deleteCollectionRequest(id, function () {
            if (targetCollection) {
                targetCollection.deleteRequest(id);
                collection = targetCollection.getAsJSON();

                if (sync) {
                    pmCollection.removeRequestFromSyncableFilesystem(id);
                    pm.appWindow.trigger("sendMessageObject", "deletedCollectionRequest", id);
                }

                if(callback) {
                    callback();
                }

                // This is called because the request would be deleted from "order"
                pmCollection.updateCollectionInDataStore(collection, syncCollection, function(c) {
                });
            }
            else {
                if (sync) {
                    pmCollection.removeRequestFromSyncableFilesystem(id);
                }

                if(callback) {
                    callback();
                }
            }
        });
    },

    /* Finish base data store functions*/

    // Get collection by folder ID
    getCollectionForFolderId: function(id) {
        function existingFolderFinder(r) {
            return r.id === id;
        }

        for(var i = 0; i < this.length; i++) {
            var collection = this.models[i];
            var folders = collection.get("folders");
            var folder = _.find(folders, existingFolderFinder);
            if (folder) {
                return collection;
            }
        }

        return null;
    },

    // Add collection
    addCollection:function (name, description) {
        var pmCollection = this;

        var collection = {};

        if (name) {
            collection.id = guid();
            collection.name = name;
            collection.description = description;
            collection.order = [];
            collection.timestamp = new Date().getTime();

            pmCollection.addCollectionToDataStore(collection, true);
        }
    },

    addCollectionFromSyncableFileSystem:function (collection) {
        var pmCollection = this;

        pmCollection.addCollectionToDataStore(collection, false, function(c) {
            pm.indexedDB.getAllRequestsInCollection(c, function(c, requests) {
                var collectionModel = pmCollection.get(c.id);
                collectionModel.set("synced", true);
                collectionModel.setRequests(requests);
                pmCollection.trigger("updateCollection", collectionModel);
            });
        });
    },

    addRequestFromSyncableFileSystem: function(request) {
        var pmCollection = this;

        pmCollection.addRequestToDataStore(request, false, function(r) {
            var collectionModel = pmCollection.get(request.collectionId);
            var folderId;
            var folder;
            var requestLocation;

            if (collectionModel) {
                requestLocation = pmCollection.getRequestLocation(request.id);

                if (requestLocation.type === "collection") {
                    pmCollection.trigger("moveRequestToCollection", collectionModel, request);
                }
                else if (requestLocation.type === "folder") {
                    folder = pmCollection.getFolderById(requestLocation.folderId);
                    pmCollection.trigger("moveRequestToFolder", collectionModel, folder, request);
                }
            }

        });
    },

    // Deprecated
    // Rename this
    // Add collection data to the database with new IDs
    addAsNewCollection:function(collection) {
        var pmCollection = this;
        var folders = [];
        var folder;
        var order;
        var j, count;
        var idHashTable = {};

        var dbCollection = _.clone(collection);
        dbCollection["requests"] = [];

        pmCollection.addCollectionToDataStore(dbCollection, true, function(c) {
            var collectionModel;
            var requests;
            var ordered;
            var i;
            var request;
            var newId;
            var currentId;
            var loc;

            collectionModel = pmCollection.get(c.id);

            // Shows successs message
            pmCollection.trigger("importCollection", {
                type: "collection",
                name:collection.name,
                action:"added"
            });

            requests = [];

            ordered = false;

            // Check against legacy collections which do not have an order
            if ("order" in collection) {
                ordered = true;
            }
            else {
                ordered = false;
                collection["order"] = [];
                collection.requests.sort(sortAlphabetical);
            }

            // Change ID of request - Also need to change collection order
            // and add request to indexedDB
            for (i = 0; i < collection.requests.length; i++) {
                request = collection.requests[i];
                request.collectionId = collection.id;

                if(request.hasOwnProperty("rawModeData")) {
                    request.data = request.rawModeData;
                    delete request.rawModeData;
                }

                var newId = guid();
                idHashTable[request.id] = newId;

                if (ordered) {
                    currentId = request.id;
                    loc = _.indexOf(collection["order"], currentId);
                    collection["order"][loc] = newId;
                }
                else {
                    collection["order"].push(newId);
                }

                request.id = newId;

                if ("responses" in request) {
                    for (j = 0, count = request["responses"].length; j < count; j++) {
                        request["responses"][j].id = guid();
                        request["responses"][j].collectionRequestId = newId;
                    }
                }

                requests.push(request);
            }

            // Change order inside folders with new IDs
            if ("folders" in collection) {
                folders = collection["folders"];

                for(i = 0; i < folders.length; i++) {
                    folders[i].id = guid();
                    order = folders[i].order;
                    for(j = 0; j < order.length; j++) {
                        order[j] = idHashTable[order[j]];
                    }

                }
            }

            collectionModel.setRequests(requests);
            collectionModel.set("folders", folders);
            collectionModel.set("order", collection["order"]);


            // Check for remote_id

            if (pm.user.isLoggedIn()) {
                var remoteId = pm.user.getRemoteIdForCollection(c.id);
                collectionModel.set("remote_id", remoteId);
            }

            // Add new collection to the database
            pmCollection.updateCollectionInDataStore(collectionModel.getAsJSON(), true, function() {
                var i;
                var request;

                for (i = 0; i < requests.length; i++) {
                    request = requests[i];
                    pmCollection.addRequestToDataStore(request, true, function(r) {
                    });
                }

                pmCollection.trigger("updateCollection", collectionModel);
            });
        });
    },

    updateCollectionOrder: function(id, order) {
        var pmCollection = this;

        var targetCollection = pmCollection.get(id);
        targetCollection.set("order", order);

        pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), true, function (collection) {
        });
    },

    updateCollectionSyncStatus: function(id, status) {
        var pmCollection = this;

        var targetCollection = pmCollection.get(id);
        targetCollection.set("synced", status);

        pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), false, function (collection) {
        });
    },

    updateCollectionMeta: function(id, name, description) {
        var pmCollection = this;

        var targetCollection = pmCollection.get(id);
        targetCollection.set("name", name);
        targetCollection.set("description", description);

        pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), true, function (collection) {
            pmCollection.trigger("updateCollectionMeta", targetCollection);
        });
    },

    deleteCollection:function (id, sync, callback) {
        this.deleteCollectionFromDataStore(id, true, function() {
        });
    },

    // Get collection data for file
    getCollectionDataForFile:function (id, callback) {
        pm.indexedDB.getCollection(id, function (data) {
            var c = data;
            var i;
            var name;
            var type;
            var filedata;

            pm.indexedDB.getAllRequestsInCollection(c, function (collection, requests) {
                for (i = 0, count = requests.length; i < count; i++) {
                    requests[i]["synced"] = false;

                    if(requests[i]["dataMode"]==="raw") {
                        requests[i]["rawModeData"]=requests[i]["data"];
                        requests[i]["data"]=[];
                    }
                }

                if (collection.hasOwnProperty("remote_id")) {
                    delete collection['remote_id'];
                }

                //Get all collection requests with one call
                collection['synced'] = false;
                collection['requests'] = requests;

                name = collection['name'] + ".json";
                type = "application/json";

                filedata = JSON.stringify(collection, null, '\t');
                callback(name, type, filedata);
            });
        });
    },

    // Save collection as a file
    saveCollection:function (id) {
        this.getCollectionDataForFile(id, function (name, type, filedata) {
            var filename = name + ".postman_collection";
            pm.filesystem.saveAndOpenFile(filename, filedata, type, function () {
                noty(
                    {
                        type:'success',
                        text:'Saved collection to disk',
                        layout:'topCenter',
                        timeout:750
                    });
            });
        });
    },

    // Upload collection
    uploadCollection:function (id, isPublic, refreshSharedCollections, callback) {
        var pmCollection = this;

        this.getCollectionDataForFile(id, function (name, type, filedata) {
            pm.api.uploadCollection(filedata, isPublic, function (data) {
                var link = data.link;

                if (callback) {
                    callback(link);
                }

                if (refreshSharedCollections) {
                    pm.mediator.trigger("refreshSharedCollections");
                }

                var collection = pmCollection.get(id);
                var remote_id = parseInt(data.id, 10);
                collection.set("remote_id", remote_id);
                collection.set("remoteLink", link);
                pmCollection.updateCollectionInDataStore(collection.getAsJSON(), true, function (c) {
                });
            });
        });
    },

    escapeScript: function(str) {
        if(!str) return "";

        return str.replace(/[\\]/g, '\\\\')
            .replace(/[\/]/g, '\\/')
            .replace(/[\b]/g, '\\b')
            .replace(/[\f]/g, '\\f')
            .replace(/[\n]/g, '\\n')
            .replace(/[\r]/g, '\\r')
            .replace(/[\t]/g, '\\t');
    },

    // New version of overwrite collection
    overwriteCollection:function(collection) {
        var pmCollection = this;

        if (collection.hasOwnProperty("order")) {
            ordered = true;
        }
        else {
            ordered = false;
            collection["order"] = [];

            for (i = 0; i < collection["requests"].length; i++) {
                collection["order"].push(collection.requests[i].id);
            }
        }

        var dbCollection = _.clone(collection);

        // Do not save requests in the same IndexedDB table
        if ("requests" in collection) {
            delete dbCollection['requests'];
        }

        pmCollection.addCollectionToDataStore(dbCollection, true, function(c) {
            var collectionModel;
            var requests = collection.requests;
            var i;
            var request;

            collectionModel = pmCollection.get(collection.id);

            if (collection.hasOwnProperty("requests")) {
                for (i = 0; i < requests.length; i++) {
                    if(collection.requests[i].dataMode==="raw") {
                        if(collection.requests[i].hasOwnProperty("rawModeData")) {
                            collection.requests[i].data=collection.requests[i].rawModeData;
                        }
                    }
                    if(!collection.requests[i].hasOwnProperty("preRequestScript")) {
                        collection.requests[i]["preRequestScript"] = "";
                    }
                    if(!collection.requests[i].hasOwnProperty("tests")) {
                        collection.requests[i]["tests"] = "";
                    }
                }

                collectionModel.set("requests", collection.requests);

                for (i = 0; i < requests.length; i++) {
                    request = requests[i];
                    
                    pmCollection.addRequestToDataStore(request, true, function(r) {
                    });
                }
            }
            else {
                collectionModel.set("requests", []);
            }

            pmCollection.trigger("updateCollection", collectionModel);

            // Shows successs message
            pmCollection.trigger("importCollection", { type: "collection", name:collection.name, action:"added" });
        });
    },

    // Duplicate collection
    duplicateCollection:function(collection) {
        this.addAsNewCollection(collection);
    },

    // Merge collection
    // Being used in IndexedDB bulk import
    mergeCollection: function(collection) {
        var validationResult = pm.collectionValidator.validateJSON('c', collection, {correctDuplicates: true, validateSchema: false});
        if(validationResult.status == false) {
            noty(
                {
                    type: 'warning',
                    text: 'Invalid collection file: ' + validationResult.message,
                    layout: 'topCenter',
                    timeout: 5000
                }
            );
        }

        var pmCollection = this;

        //Update local collection
        var newCollection = {
            id: collection.id,
            name: collection.name,
            timestamp: collection.timestamp
        };

        var targetCollection;
        targetCollection = new PmCollection(newCollection);
        targetCollection.set("name", collection.name);

        targetCollection.set("requests", collection.requests);

        if ("order" in collection) {
            targetCollection.set("order", collection.order);
        }
        else {
            var order = [];
            var requests = targetCollection.get("requests");
            for(var j = 0; j < requests.length; j++) {
                order.push(requests[j].id);
            }

            targetCollection.set("order", order);
        }

        if ("folders" in collection) {
            targetCollection.set("folders", collection.folders);
        }

        pmCollection.add(targetCollection, {merge: true});
        pm.appWindow.trigger("sendMessageObject", "updatedCollection", targetCollection);

        pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), true, function (c) {
            var driveCollectionRequests = collection.requests;

            pm.indexedDB.getAllRequestsInCollection(collection, function(collection, oldCollectionRequests) {
                var updatedRequests = [];
                var deletedRequests = [];
                var newRequests = [];
                var finalRequests = [];
                var i = 0;
                var driveRequest;
                var existingRequest;
                var sizeOldRequests;
                var loc;
                var j;
                var sizeUpdatedRequests;
                var sizeNewRequests;
                var sizeDeletedRequests;
                var size = driveCollectionRequests.length;

                function existingRequestFinder(r) {
                    return driveRequest.id === r.id;
                }

                for (i = 0; i < size; i++) {
                    driveRequest = driveCollectionRequests[i];
                    driveRequest.preRequestScript = pmCollection.escapeScript(driveRequest.preRequestScript);
                    driveRequest.tests = pmCollection.escapeScript(driveRequest.tests);

                    existingRequest = _.find(oldCollectionRequests, existingRequestFinder);

                    if (existingRequest) {
                        updatedRequests.push(driveRequest);

                        sizeOldRequests = oldCollectionRequests.length;
                        loc = -1;
                        for (j = 0; j < sizeOldRequests; j++) {
                            if (oldCollectionRequests[j].id === existingRequest.id) {
                                loc = j;
                                break;
                            }
                        }

                        if (loc >= 0) {
                            oldCollectionRequests.splice(loc, 1);
                        }
                    }
                    else {
                        newRequests.push(driveRequest);
                    }
                }

                deletedRequests = oldCollectionRequests;

                sizeUpdatedRequests = updatedRequests.length;
                for(i = 0; i < sizeUpdatedRequests; i++) {
                    pmCollection.updateRequestInDataStore(updatedRequests[i], true);
                }

                sizeNewRequests = newRequests.length;
                for(i = 0; i < sizeNewRequests; i++) {
                    pmCollection.addRequestToDataStore(newRequests[i], true);
                }

                sizeDeletedRequests = deletedRequests.length;
                for(i = 0; i < sizeDeletedRequests; i++) {
                    pmCollection.deleteRequestFromDataStore(deletedRequests[i], true);
                }

                pmCollection.trigger("updateCollection", targetCollection);
            });
        });
    },

    // Merge multiple collections. Used in bulk data import
    mergeCollections: function (collections) {
        var pmCollection = this;

        var size = collections.length;
        for(var i = 0; i < size; i++) {
            var collection = collections[i];
            pmCollection.mergeCollection(collection, true);
        }
    },

    importCollectionData:function (collection, forceAdd) {
        var validationResult = pm.collectionValidator.validateJSON('c', collection, {correctDuplicates: true, validateSchema: false});
        if(validationResult.status == false) {
            noty(
                {
                    type: 'warning',
                    text: 'Invalid collection file: ' + validationResult.message,
                    layout: 'topCenter',
                    timeout: 5000
                }
            );
        }

        if(this.getCollectionById(collection.id)!==null) {
            this.originalCollectionId = collection.id;
            this.toBeImportedCollection = collection;
            this.trigger("overwriteCollectionChoice", collection);
        }
        else {
            this.overwriteCollection(collection);
        }
    },

    setNewCollectionId: function(collection) {
        var newId = guid();
        var numFolders = (collection.folders)?collection.folders.length:0;
        for(var i=0;i<numFolders;i++) {
            collection.folders[i].collection_id = newId;

        }

        var numRequests = (collection.requests)?collection.requests.length:0;
        for(var i=0;i<numRequests;i++) {
            collection.requests[i].collectionId = newId;
        }

        collection.id = newId;
    },

    onAddDirectoryCollection: function(collection) {
        this.setNewCollectionId(collection);
        this.addAsNewCollection(collection);
    },

    guessFileFormat: function(data, alreadyJson) {
        //check if it is JSON:
        var jsonObj;
        try {
            if(alreadyJson===true) {
                jsonObj = data;
            }
            else {
                jsonObj = JSON.parse(data);
            }
            if(jsonObj.hasOwnProperty("swaggerVersion")) return "SWAGGER1.2";
            if(jsonObj.hasOwnProperty("folders") || jsonObj.hasOwnProperty("requests") || jsonObj.hasOwnProperty("order")) return "COLLECTION";

            //Is JSON, but not collection or swagger
            return 0;
        }
        catch(e) {
            if(data instanceof Node) {
                var xs = new XMLSerializer();
                data = xs.serializeToString(data);
            }
            data = data.trim();
            var firstLine = data.split("\n")[0];
            if(firstLine.indexOf("#%RAML")===0) return "RAML";  //check raml = first line is #%RAML
            if(firstLine.toLowerCase().indexOf("curl")===0) return "CURL";
	        if(data.substring(0,5).indexOf("<")!==-1 && data.substring(0,400).indexOf("<application")!==-1) return "WADL";

            //Not JSON, and not raml, curl, wadl
            return 0;
        }
    },

    showImportError: function(type, message) {
        noty({
                type:'error',
                text:'Errow while importing '+type+': '+message,
                layout:'center',
                timeout:2000
            });
    },

    importData: function(data, format, alreadyJson) {
        var pmCollection = this;
        if(format==="SWAGGER1.2") {
            var swaggerJson = alreadyJson?data:JSON.parse(data);
            swaggerConverter.convertJSON(
                swaggerJson, 
                {
                    group: true,
                    test: false
                },  
                function(collection, env) {
                    pm.collections.importCollectionData(collection);
                }, function(errorMessage) {
                    pm.collections.showImportError("Swagger", errorMessage);
                }
            ); 
        }
        else if(format === "COLLECTION") {
            var collection = alreadyJson?data:JSON.parse(data);
            // collection.id = guid();
            pmCollection.importCollectionData(collection);
        }
        else if(format==="RAML") {
            ramlConverter.parseString(data, function(op, env) {
                pm.collections.importCollectionData(op);
            }, function(errorMessage) {
                if(errorMessage.indexOf("cannot fetch")!==-1) {
                    errorMessage = "External references are not supported yet. " + errorMessage;
                }
                pm.collections.showImportError("RAML", errorMessage);
            });
        }
        else if(format==="CURL") {
            try {
                var requestJSON = curlConverter.convertCurlToRequest(data);
                if (requestJSON.error) {
                    pm.collections.showImportError("Curl", requestJSON.error);
                }
                else {
                    var re = /\\n/gi
                    requestJSON.headers = requestJSON.headers.replace(re, "\n");
                    pm.mediator.trigger("loadRequest", requestJSON, true);
                    pmCollection.trigger("importCollection", {
                        type: "request",
                        name: (requestJSON.name != "" && requestJSON.name != null) ? requestJSON.name : requestJSON.url,
                        action: "added"
                    });
                }
            }
            catch(e) {
                pm.collections.showImportError("Curl", e.message);
            }
        }
        else if(format==="WADL") {
	        wadlConverter.convertXMLString(data,{},function(collection) {
		        pm.collections.importCollectionData(collection);
	        }, function(error) {
                pm.collections.showImportError("WADL", error);
            });
        }
        else {
            console.log("Unknown format");
        }
    },

    importFiles: function(files) {
        var pmCollection = this;
        for (var i = 0, f; f = files[i]; i++) {
            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function (theFile) {
                return function (e) {
                    // Render thumbnail.
                    var data = e.currentTarget.result;
                    try {
                        data = data.trim();
                        var fileFormat = pmCollection.guessFileFormat(data);
                        if(fileFormat===0) {
                            throw "Could not parse";
                        }
                        pmCollection.importData(data, fileFormat);
                    }
                    catch(e) {
                        pm.mediator.trigger("failedCollectionImport","format not recognized");
                    }
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsText(f);
        }
    },

    // Import multiple collections
    importCollections:function (files) {
        var pmCollection = this;

        // Loop through the FileList
        for (var i = 0, f; f = files[i]; i++) {
            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = (function (theFile) {
                return function (e) {
                    // Render thumbnail.
                    var data = e.currentTarget.result;
                    try {
                        data = data.trim();
                        var collection = jsonlint.parse(data);
                        // collection.id = guid();
                        pmCollection.importCollectionData(collection);
                    }
                    catch(e) {
                        pm.mediator.trigger("failedCollectionImport", "could not import collection - " + e.message);
                    }
                };
            })(f);

            // Read in the image file as a data URL.
            reader.readAsText(f);
        }
    },

    importFileFromUrl:function (url) {
        var pmCollection = this;

        $.ajax({
            type: 'GET',
            url: url,
            success: function(data) {
                try {
                    if(typeof data === "object" && !(data instanceof Node)) {
                        //already Json
                        var fileFormat = pmCollection.guessFileFormat(data, true);
                        if(fileFormat===0) {
                            throw "Could not parse";
                        }
                        pmCollection.importData(data, fileFormat, true);
                    }
                    else if(data instanceof Node) {
                        //it's an xml element. don't trim
                        var fileFormat = pmCollection.guessFileFormat(data, false);
                        if(fileFormat===0) {
                            throw "Could not parse";
                        }

                        var xs = new XMLSerializer();
                        data = xs.serializeToString(data);

                        pmCollection.importData(data, fileFormat, false);
                    }
                    else {
                        data = data.trim();
                        var fileFormat = pmCollection.guessFileFormat(data, false);
                        if(fileFormat===0) {
                            throw "Could not parse";
                        }
                        pmCollection.importData(data, fileFormat, false);
                    }
                }
                catch(e) {
                    pm.mediator.trigger("failedCollectionImport", "format not recognized");
                }
            }
        });
    },

    // Get request by ID
    getRequestById: function(id) {
        function existingRequestFinder(r) {
            return r.id === id;
        }

        for(var i = 0; i < this.models.length; i++) {
            var collection = this.models[i];

            var requests = collection.get("requests");

            var request = _.find(requests, existingRequestFinder);
            if (request) {
                return request;
            }
        }

        return null;
    },

    getRequestLocation: function(id) {
        var i;
        var collection;
        var indexCollection;
        var folders;
        var indexFolder;

        for(var i = 0; i < this.models.length; i++) {
            collection = this.models[i];

            indexCollection = _.indexOf(collection.get("order"), id);

            if (indexCollection >= 0) {
                return {
                    "type": "collection",
                    "collectionId": collection.get("id")
                };
            }
            else {
                folders = collection.get("folders");
                for(j = 0; j < folders.length; j++) {
                    indexFolder = _.indexOf(folders[j].order, id);

                    if (indexFolder >= 0) {
                        return {
                            "type": "folder",
                            "folderId": folders[j].id,
                            "collectionId": collection.get("id")
                        };
                    }
                }
            }
        }

        return {
            "type": "not_found"
        };
    },

    // Load collection request in the editor
    loadCollectionRequest:function (id) {
        var pmCollection = this;

        pm.indexedDB.getCollectionRequest(id, function (request) {
            request.isFromCollection = true;
            request.collectionRequestId = id;
            pm.mediator.trigger("loadRequest", request, true);
            pmCollection.trigger("selectedCollectionRequest", request);
        });
    },

    // For the TCPReader. Not for the current request
    addRequestToCollectionId: function(collectionRequest, collectionId) {
        var pmCollection = this;

        collectionRequest.collectionId = collectionId;

        var targetCollection = pmCollection.get(collectionId);
        targetCollection.addRequestIdToOrder(collectionRequest.id);


        pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), true, function() {
            pmCollection.addRequestToDataStore(collectionRequest, true, function(req) {
                pmCollection.trigger("addCollectionRequest", req);
            });
        });
    },

    // Add request to collection. For the current request
    addRequestToCollection:function (collectionRequest, collection, noNotif) {
        if(typeof(noNotif)==='undefined') noNotif = false;

        var pmCollection = this;

        if (collection.name) {
            collection.requests = [];
            collection.order = [collectionRequest.id];
            collection.timestamp = new Date().getTime();

            pmCollection.addCollectionToDataStore(collection, true, function(newCollection) {
                collectionRequest.collectionId = newCollection.id;

                pmCollection.addRequestToDataStore(collectionRequest, true, function(req) {
                    pmCollection.trigger("addCollectionRequest", req);
                    pmCollection.loadCollectionRequest(req.id);
                });
            });
        }
        else {
            collectionRequest.collectionId = collection.id;

            var targetCollection = pmCollection.get(collection.id);
            targetCollection.addRequestIdToOrder(collectionRequest.id);


            pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), true, function() {
                pmCollection.addRequestToDataStore(collectionRequest, true, function(req) {
                    pmCollection.trigger("addCollectionRequest", req);
                    pmCollection.loadCollectionRequest(req.id);
                });
            });
        }

        this.trigger("updateCollectionRequest", collectionRequest, noNotif);
        pm.mediator.trigger("updateCollectionRequest", collectionRequest);
    },


    // Add request to folder
    addRequestToFolder: function(collectionRequest, collectionId, folderId, noNotif) {
        if(typeof(noNotif)==='undefined') noNotif = false;

        var pmCollection = this;

        var collection = this.get(collectionId);
        collectionRequest.collectionId = collectionId;
        collection.addRequestIdToOrder(collectionRequest.id);

        pmCollection.addRequestToDataStore(collectionRequest, true, function(req) {
            pmCollection.moveRequestToFolder(req.id, folderId);
            pmCollection.loadCollectionRequest(req.id);
        });

        if(!noNotif) {
        noty(
            {
                type:'success',
                text:'Saved request',
                layout:'topCenter',
                timeout:750
            });
        }


    },


    addResponseToCollectionRequest: function(collectionRequestId, response) {
        var pmCollection = this;

        pm.indexedDB.getCollectionRequest(collectionRequestId, function (collectionRequest) {
            var responses;

            if (collectionRequest.hasOwnProperty("responses")) {
                responses = collectionRequest["responses"];
            }
            else {
                responses = [];
            }

            responses.push(response);

            pmCollection.updateRequestInDataStore(collectionRequest, true, function(request) {
                pmCollection.trigger("updateCollectionRequest", request);
                pm.mediator.trigger("updateCollectionRequest", request);
            });
        });
    },

    updateResponsesForCollectionRequest: function(collectionRequestId, responses) {
        var pmCollection = this;

        pm.indexedDB.getCollectionRequest(collectionRequestId, function (collectionRequest) {
            var c = _.clone(collectionRequest);
            c.responses = responses;
            pmCollection.updateRequestInDataStore(c, true, function(request) {
                pmCollection.trigger("updateCollectionRequest", request);
                pm.mediator.trigger("updateCollectionRequest", request);
            });
        });
    },

    // Update collection request
    updateCollectionRequest:function (collectionRequest) {
        var pmCollection = this;

        pm.indexedDB.getCollectionRequest(collectionRequest.id, function (req) {
            collectionRequest.name = req.name;
            collectionRequest.description = req.description;
            collectionRequest.collectionId = req.collectionId;
            collectionRequest.responses = req.responses;

            pmCollection.updateRequestInDataStore(collectionRequest, true, function(request) {
                pmCollection.trigger("updateCollectionRequest", request);
                pm.mediator.trigger("updateCollectionRequest", request);
            });
        });
    },

    updateCollectionRequestMeta: function(id, name, description) {
        var pmCollection = this;

        pm.indexedDB.getCollectionRequest(id, function (req) {
            req.name = name;
            req.description = description;

            pmCollection.updateRequestInDataStore(req, true, function(request) {
                pmCollection.trigger("updateCollectionRequest", request);
                pm.mediator.trigger("updateCollectionRequest", request);
            });
        });
    },

    updateCollectionRequestSyncStatus: function(id, status) {
        var pmCollection = this;

        pm.indexedDB.getCollectionRequest(id, function (req) {
            req.synced = status;

            pmCollection.updateRequestInDataStore(req, false, function(request) {
            });
        });
    },

    updateCollectionRequestTests: function(id, tests) {
        var pmCollection = this;

        pm.indexedDB.getCollectionRequest(id, function (req) {
            req.tests = tests;

            pmCollection.updateRequestInDataStore(req, true, function(request) {
                pmCollection.trigger("updateCollectionRequest", request);
                pm.mediator.trigger("updateCollectionRequest", request);
            });
        });
    },

    // Delete collection request
    deleteCollectionRequest:function (id, callback) {
        var pmCollection = this;

        pmCollection.deleteRequestFromDataStore(id, true, true, function() {
            pmCollection.trigger("removeCollectionRequest", id);

            if (callback) {
                callback();
            }
        });
    },

    moveRequestToFolder: function(requestId, targetFolderId) {
        pm.requestTransferInProgress = true;
        setTimeout(function() {
                        pm.requestTransferInProgress = false;
        },200);

        var pmCollection = this;
        var request = _.clone(this.getRequestById(requestId));
        var folder = this.getFolderById(targetFolderId);
        var targetCollection = this.getCollectionForFolderId(targetFolderId);

        if(targetCollection.id === request.collectionId) {
            targetCollection.addRequestIdToFolder(folder.id, request.id);
            pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), true, function() {
                pmCollection.trigger("moveRequestToFolder", targetCollection, folder, request);
            });
        }
        else {
            // Different collection
            pmCollection.deleteCollectionRequest(requestId, function() {
                request.id = guid();
                request.collectionId = targetCollection.get("id");

                targetCollection.addRequestIdToOrder(request.id);

                pmCollection.addRequestToDataStore(request, true, function(req) {
                    targetCollection.addRequestIdToFolder(folder.id, req.id);
                    var collection = targetCollection.getAsJSON();
                    pmCollection.updateCollectionInDataStore(collection, true, function(c) {
                        pmCollection.trigger("moveRequestToFolder", targetCollection, folder, request);
                    });
                });
            });

        }
    },

    moveRequestToCollection: function(requestId, targetCollectionId) {
        pm.requestTransferInProgress = true;
        setTimeout(function() {
            pm.requestTransferInProgress = false;
        },200);
        var pmCollection = this;
        var targetCollection = this.get(targetCollectionId);
        var request = _.clone(this.getRequestById(requestId));

        if(targetCollectionId === request.collectionId) {
            targetCollection.addRequestIdToOrder(request.id);

            pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), true, function(c) {
                pmCollection.trigger("moveRequestToCollection", targetCollection, request);
            });
        }
        else {
            var oldCollection = pmCollection.get(request.collectionId);

            pmCollection.deleteCollectionRequest(requestId, function() {
                request.id = guid();
                request.collectionId = targetCollectionId;

                targetCollection.addRequestIdToOrder(request.id);

                pmCollection.addRequestToDataStore(request, true, function(req) {
                    pmCollection.updateCollectionInDataStore(targetCollection.getAsJSON(), true, function(c) {
                        pmCollection.trigger("moveRequestToCollection", targetCollection, request);
                    });
                });
            });
        }
    },

    // Get folder by ID
    getFolderById: function(id) {
        function existingFolderFinder(r) {
            return r.id === id;
        }

        for(var i = 0; i < this.length; i++) {
            var collection = this.models[i];
            var folders = collection.get("folders");
            var folder = _.find(folders, existingFolderFinder);
            if (folder) {
                return folder;
            }
        }

        return null;
    },

    addFolder: function(parentId, folderName, description) {
        var collection = this.get(parentId);

        var newFolder = {
            "id": guid(),
            "name": folderName,
            "description": description,
            "order": []
        };

        collection.addFolder(newFolder);
        this.trigger("addFolder", collection, newFolder);
        this.updateCollectionInDataStore(collection.getAsJSON(), true);
    },

    addExistingFolder: function(parentId, folder) {
        var collection = this.get(parentId);
        collection.addFolder(folder);
        this.trigger("addFolder", collection, folder);
        this.updateCollectionInDataStore(collection.getAsJSON(), true);
    },

    updateFolderOrder: function(collectionId, folderId, order) {
        var folder = this.getFolderById(folderId);
        folder.order = order;
        var collection = this.get(collectionId);
        collection.editFolder(folder);

        this.updateCollectionInDataStore(collection.getAsJSON(), true);
    },

    updateFolderMeta: function(id, name, description) {
        var folder = this.getFolderById(id);
        folder.name = name;
        folder.description = description;
        var collection = this.getCollectionForFolderId(id);
        collection.editFolder(folder);
        this.trigger("updateFolder", collection, folder);

        this.updateCollectionInDataStore(collection.getAsJSON(), true);
    },

    deleteFolder: function(id) {
        var folder = this.getFolderById(id);
        var folderRequestsIds = _.clone(folder.order);
        var i;
        var collection;

        for(i = 0; i < folderRequestsIds.length; i++) {
            this.deleteRequestFromDataStore(folderRequestsIds[i], true, false);
        }

        collection = this.getCollectionForFolderId(id);
        collection.deleteFolder(id);

        this.trigger("deleteFolder", collection, id);
        this.updateCollectionInDataStore(collection.getAsJSON(), true);
    },

    filter: function(term) {
        term = term.toLowerCase();
        var collections = this.toJSON();
        var collectionCount = collections.length;
        var filteredCollections = [];
        var name;
        var requests;
        var requestsCount;
        var i, j, k, c, r, f;
        var folders;
        var folderOrder;
        var visibleRequestHash = {};

        for(i = 0; i < collectionCount; i++) {
            c = {
                id: collections[i].id,
                name: collections[i].name,
                requests: [],
                folders: [],
                toShow: false
            };

            name = collections[i].name.toLowerCase();

            if (name.search(term) >= 0) {
                c.toShow = true;
            }

            requests = collections[i].requests;

            if (requests) {
                requestsCount = requests.length;

                for(j = 0; j < requestsCount; j++) {
                    r = {
                        id: requests[j].id,
                        name: requests[j].name,
                        toShow: false
                    };

                    name = requests[j].name.toLowerCase();

                    if (name.search(term) >= 0) {
                        r.toShow = true;
                        c.toShow = true;
                        visibleRequestHash[r.id] = true;
                    }
                    else {
                        r.toShow = false;
                        visibleRequestHash[r.id] = false;
                    }

                    c.requests.push(r);
                }
            }

            if("folders" in collections[i]) {
                folders = collections[i].folders;
                for (j = 0; j < folders.length; j++) {
                    f = {
                        id: folders[j].id,
                        name: folders[j].name,
                        toShow: false
                    };

                    name = folders[j].name.toLowerCase();

                    if (name.search(term) >= 0) {
                        f.toShow = true;
                        c.toShow = true;
                    }

                    folderOrder = folders[j].order;

                    // Check if any requests are to be shown
                    for(k = 0; k < folderOrder.length; k++) {
                        if (visibleRequestHash[folderOrder[k]] === true) {
                            f.toShow = true;
                            c.toShow = true;
                            break;
                        }
                    }

                    c.folders.push(f);
                }
            }

            filteredCollections.push(c);
        }

        this.trigger("filter", filteredCollections);
        return filteredCollections;
    },

    revert: function() {
        this.trigger("revertFilter");
    }
});