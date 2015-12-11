var CollectionSidebar = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        model.on("add", this.renderOneCollection, this);
        model.on("remove", this.removeOneCollection, this);

        model.on("updateCollection", this.renderOneCollection, this);
        model.on("updateCollectionMeta", this.updateCollectionMeta, this);

        model.on("addCollectionRequest", this.addCollectionRequest, this);
        model.on("selectedCollectionRequest", this.selectedCollectionRequest, this);
        model.on("removeCollectionRequest", this.removeCollectionRequest, this);
        model.on("updateCollectionRequest", this.updateCollectionRequest, this);
        model.on("moveRequestToCollection", this.onMoveRequestToCollection, this);
        model.on("moveRequestToFolder", this.onMoveRequestToFolder, this);

        model.on("duplicateCollection", this.duplicateCollection, this);
        model.on("duplicateCollectionRequest", this.duplicateCollectionRequest, this);
        model.on("duplicateFolder", this.duplicateFolder, this);

        model.on("addFolder", this.onAddFolder, this);
        model.on("updateFolder", this.onUpdateFolder, this);
        model.on("deleteFolder", this.onDeleteFolder, this);

        model.on("filter", this.onFilter, this);
        model.on("revertFilter", this.onRevertFilter, this);

        $('#collection-items').html("");
        $('#collection-items').append(Handlebars.templates.message_no_collection({}));

        var $collection_items = $('#collection-items');

        $collection_items.on("mouseover", ".sidebar-collection .sidebar-collection-head", function () {
	        jQuery(".folder-head-actions,.collection-head-actions,.request-actions").hide();
            var actionsEl = jQuery('.collection-head-actions', this);
            actionsEl.css('display', 'block');
        });

        $collection_items.on("mouseleave", ".sidebar-collection .sidebar-collection-head", function () {
            var actionsEl = jQuery('.collection-head-actions', this);
            actionsEl.css('display', 'none');
        });

	    //$collection_items.on("mouseover", ".collection-head-actions>.tooltip", function () {
		 //   var actionsEl = jQuery(this);
	    //});


        $collection_items.on("mouseover", ".folder .folder-head", function () {
	        jQuery(".folder-head-actions,.collection-head-actions,.request-actions").hide();
            var actionsEl = jQuery('.folder-head-actions', this);
            actionsEl.css('display', 'block');
        });

        $collection_items.on("mouseleave", ".folder .folder-head", function () {
            var actionsEl = jQuery('.folder-head-actions', this);
            actionsEl.css('display', 'none');
        });

	    //$collection_items.on("mouseenter", ".folder-head-actions>.tooltip", function () {
		 //   var actionsEl = jQuery(this);
	    //});

        $collection_items.on("click", ".sidebar-collection-head-name", function () {
            var id = $(this).attr('data-id');
            view.toggleRequestList(id);
        });

        $collection_items.on("click", ".folder-head-name", function () {
            var id = $(this).attr('data-id');
            view.toggleSubRequestList(id);
        });

        $collection_items.on("click", ".collection-action-duplicate", function () {
            var id = $(this).attr('data-id');
            var c = model.get(id);
            model.trigger("duplicateCollection", c);
        });

        $collection_items.on("click", ".collection-head-actions .label", function () {
            var id = $(this).parent().parent().parent().attr('data-id');
            view.toggleRequestList(id);
        });

        $collection_items.on("click", ".collection-actions-add-folder", function () {
            var id = $(this).attr('data-id');
            var c = model.get(id);
            model.trigger("showAddFolderModal", c);
        });

        $collection_items.on("click", ".collection-actions-edit", function () {
            var id = $(this).attr('data-id');
            var c = model.get(id);
            model.trigger("showEditModal", c);
        });

        $collection_items.on("click", ".collection-actions-delete", function () {
            var id = $(this).attr('data-id');
            var name = $(this).attr('data-name');

            $('#modal-delete-collection-yes').attr('data-id', id);
            $('#modal-delete-collection-name').html(name);
        });

        $collection_items.on("click", ".folder-actions-edit", function () {
            var id = $(this).attr('data-id');
            var folder = model.getFolderById(id);
            model.trigger("showEditFolderModal", folder);
        });

        $collection_items.on("click", ".folder-actions-delete", function () {
            var id = $(this).attr('data-id');
            var name = $(this).attr('data-name');

            $('#modal-delete-folder-yes').attr('data-id', id);
            $('#modal-delete-folder-name').html(name);
        });

        $collection_items.on("click", ".collection-actions-download", function () {
            var id = $(this).attr('data-id');
            model.trigger("shareCollectionModal", id);
        });

        $('#collection-items').on("mouseover", ".sidebar-request", function () {
	        jQuery(".folder-head-actions,.collection-head-actions,.request-actions").hide();
            var actionsEl = jQuery('.request-actions', this);
            actionsEl.css('display', 'block');
        });

        $('#collection-items').on("mouseleave", ".sidebar-request", function () {
            var actionsEl = jQuery('.request-actions', this);
            actionsEl.css('display', 'none');
        });

        $('#collection-items').on("mouseenter", ".sidebar-collection-request",function() {
            $(this).toggleClass('hover');
        });

        $('#collection-items').on("mouseleave", ".sidebar-collection-request",function() {
            $(this).toggleClass('hover');
        });


        $collection_items.on("click", ".request-actions-load", function () {
            var id = $(this).attr('data-id');
            model.loadCollectionRequest(id);
            $('.sidebar-history-request').removeClass('sidebar-history-request-active');
        });

        $collection_items.on("click", ".request-actions-delete", function () {
            var id = $(this).attr('data-id');
            var request = model.getRequestById(id);            
            model.trigger("deleteCollectionRequest", request);
        });

        $collection_items.on("click", ".request-actions-edit", function () {
            var id = $(this).attr('data-id');
            var request = model.getRequestById(id);

            model.trigger("editCollectionRequest", request);
        });

        $collection_items.on("click", ".request-actions-duplicate", function () {
            var id = $(this).attr('data-id');
            var request = model.getRequestById(id);
            model.trigger("duplicateCollectionRequest", request);
        });

        $collection_items.on("click", ".folder-actions-duplicate", function () {
            var id = $(this).attr('data-id');
            var request = model.getFolderById(id);
            model.trigger("duplicateFolder", request);
        });
    },

    _updateSidebar: function() {
        $("#sidebar-section-collections a[rel='tooltip']").tooltip();
    },

    duplicateCollectionRequest: function(oldRequest) {
        if(!oldRequest) {
            return;
        }
        var collection = this.model.getCollectionById(oldRequest.collectionId);
        if(!collection) {
            return;
        }
        var oldId = oldRequest.id;

        var newRequest = _.clone(oldRequest);
        newRequest.name = oldRequest.name + " copy";
        newRequest.id = guid();

        var orderRequests = collection.get("order");
        var folders = collection.get("folders");

        if(orderRequests.indexOf(oldId)>=0) {
            this.model.addRequestToCollection(newRequest,collection, true);
            return;
        }
        else {
            var sidebar = this;
            _.each(folders,function(folder) {
                if(folder.order.indexOf(oldId)>=0) {
                    sidebar.model.addRequestToFolder(newRequest, collection.id, folder.id, true);
                    return;
                }
            });
        }
    },

    duplicateFolder: function(oldFolder) {
        var collection = this.model.getCollectionById(oldFolder.collection_id);
        if(!collection) {
            //error condition
            return;
        }

        var newFolder = this.cloneFolder(oldFolder);
        newFolder.name = oldFolder.name + " copy";

        this.model.addExistingFolder(collection.id, newFolder);

        //clone and add all requests of the folder
        var sidebar = this;
        _.each(oldFolder.order,function(requestId) {
            var oldRequest = sidebar.model.getRequestById(requestId);
            var newRequest = _.clone(oldRequest);
            newRequest.folderId=newFolder.id;
            newRequest.id = guid();
            sidebar.model.addRequestToFolder(newRequest,collection.id, newFolder.id, true);
        });
    },

    duplicateCollection: function(collection) {
        if(!collection) {
            return;
        }
        var newCollection = {};
        newCollection.id = guid();
        newCollection.name = collection.get("name") + " copy";
        newCollection.description = collection.get("description");
        newCollection.order = [];
        newCollection.timestamp = new Date().getTime();
        var sidebar = this;
        this.model.addCollectionToDataStore(newCollection,true, function() {
            var newCollection1 = sidebar.model.getCollectionById(newCollection.id);

            //Add all the folders
            var folderIdMap = {};
            _.each(collection.get("folders"),function(folder) {
                var newFolder = sidebar.cloneFolder(folder);
                folderIdMap[folder.id] = newFolder.id;
                sidebar.model.addExistingFolder(newCollection1.id, newFolder);
            });

            //Add add all requests
            var orderRequests = collection.get("order");
            var folders = collection.get("folders");
            var collectionRequests = collection.get("requests");

            //add root collection requests (those not in folders)
            _.each(orderRequests, function(requestId) {
                //find request with Id=requestId
                var thisRequest = _.find(collectionRequests, function(request){
                    return request.id==requestId
                });
                var newRequest = _.clone(thisRequest);
                newRequest.id = guid();
                newRequest.collectionId = newCollection1.id;
                sidebar.model.addRequestToCollection(newRequest,newCollection1, true);
            });

            //add requests in folders
            _.each(folders, function(folder) {
                _.each(folder.order, function(requestId) {
                    var thisRequest = _.find(collectionRequests, function(request){
                        return request.id==requestId
                    });
                    var newRequest = _.clone(thisRequest);
                    newRequest.id = guid();
                    newRequest.collectionId = newCollection1.id;
                    sidebar.model.addRequestToFolder(newRequest, newCollection1.id, folderIdMap[folder.id], true);
                });
            });

        });


    },

    cloneFolder: function(oldFolder) {
        var newFolder = _.clone(oldFolder);
        newFolder.id = guid();
        newFolder.order = [];
        return newFolder;
    },

    selectedCollectionRequest: function(request) {
        var id = request.id;
        $('.sidebar-collection-request').removeClass('sidebar-collection-request-active');
        $('#sidebar-request-' + id).addClass('sidebar-collection-request-active');
    },

    addRequestListeners:function () {
        $('#sidebar-sections').on("mouseenter", ".sidebar-request", function () {
            var actionsEl = jQuery('.request-actions', this);
            actionsEl.css('display', 'block');
        });

        $('#sidebar-sections').on("mouseleave", ".sidebar-request", function () {
            var actionsEl = jQuery('.request-actions', this);
            actionsEl.css('display', 'none');
        });
    },

    emptyCollectionInSidebar:function (id) {
        $('#collection-requests-' + id).html("");
    },

    removeOneCollection:function (model, pmCollection) {
        var collection = model.toJSON();
        $('#collection-' + collection.id).remove();

        if(pmCollection.length === 0) {
            $('#sidebar-section-collections .empty-message').css("display", "block");
        }
    },

    organizeRequestsInFolders: function(collection) {
        if(!("folders" in collection)) {
            return collection;
        }

        if(!("requests" in collection)) {
            return collection;
        }

        var folders = _.clone(collection["folders"]);
        var requests = _.clone(collection["requests"]);

        var folderCount = folders.length;
        var folder;
        var folderOrder;
        var id;
        var existsInOrder;
        var folderRequests;

        var newFolders = [];

        for(var i = 0; i < folderCount; i++) {
            folder = _.clone(folders[i]);
            folderOrder = folder.order;
            folderRequests = [];

            for(var j = 0; j < folderOrder.length; j++) {
                id = folderOrder[j];

                var index = arrayObjectIndexOf(requests, id, "id");

                if(index >= 0) {
                    folderRequests.push(requests[index]);
                    requests.splice(index, 1);
                }
            }

            folder["requests"] = this.orderRequests(folderRequests, folderOrder);
            newFolders.push(folder);
        }

        collection.folders = newFolders;
        collection.requests = requests;

        collection.requests = this.orderRequests(collection.requests, collection.order);

        return collection;
    },

    orderRequests: function(inRequests, order) {
        var requests = _.clone(inRequests);

        function requestFinder(request) {
            return request.id === order[j];
        }

        if (order.length === 0) {
            requests.sort(sortAlphabetical);
        }
        else {
            var orderedRequests = [];
            for (var j = 0, len = order.length; j < len; j++) {
                var element = _.find(requests, requestFinder);
                if(element) {
                    orderedRequests.push(element);
                }
            }

            requests = orderedRequests;
        }

        return requests;
    },

    renderOneCollection:function (model, pmCollection) {
        var folders = [];
        var wasOpen = false;
        var collection = _.clone(model.toJSON());

        collection = this.organizeRequestsInFolders(collection);

        $('#sidebar-section-collections .empty-message').css("display", "none");

        var currentEl = $("#collection-" + collection.id + " .sidebar-collection-head-dt");
        if (currentEl.length) {
            var currentClass = currentEl.attr("class");
            wasOpen = currentClass.search("open") >= 0;
        }

        this.renderCollectionContainerInSidebar(collection);
        this.renderFoldersInSidebar(collection);

        var requests = collection.requests;
        var targetElement = "#collection-requests-" + collection.id;

        this.renderRequestsInSidebar(targetElement, requests);

        if (wasOpen) {
            this.openCollection(collection.id, false);
        }
    },

    renderCollectionContainerInSidebar: function(collection) {
        var currentEl = $('#collection-' + collection.id);

        var collectionSidebarListPosition = -1;
        var insertionType;
        var insertTarget;

        var model = this.model;
        var view = this;
        var collections = this.model.toJSON();

        collectionSidebarListPosition = arrayObjectIndexOf(collections, collection.id, "id");

        if (currentEl.length) {
            if (collectionSidebarListPosition === 0) {
                if(collections[collectionSidebarListPosition + 1]) {
                    insertionType = "before";
                    insertTarget = $('#collection-' + collections[collectionSidebarListPosition + 1].id);
                }
                else {
                    insertionType = "none";
                }
            }
            else {
                insertionType = "after";
                insertTarget = $('#collection-' + collections[collectionSidebarListPosition - 1].id);
            }

            currentEl.remove();
        }
        else {
            //New element
            if (collectionSidebarListPosition === collections.length - 1) {
                insertionType = "append";
            }
            else {
                var nextCollectionId = collections[collectionSidebarListPosition + 1].id;
                insertTarget = $("#collection-" + nextCollectionId);

                if (insertTarget.length > 0) {
                    insertionType = "before";
                }
                else {
                    insertionType = "append";
                }
            }
        }

        if (insertionType) {
            if (insertionType === "after") {
                $(insertTarget).after(Handlebars.templates.item_collection_sidebar_head(collection));
            }
            else if (insertionType === "before") {
                $(insertTarget).before(Handlebars.templates.item_collection_sidebar_head(collection));
            }
            else {
                $("#collection-items").append(Handlebars.templates.item_collection_sidebar_head(collection));
            }
        } else {
            $("#collection-items").append(Handlebars.templates.item_collection_sidebar_head(collection));
        }

        // TODO Need a better way to initialize these tooltips
        setTimeout(function() {
            $('a[rel="tooltip"]').tooltip();
        },500);

        $('#collection-' + collection.id + " .sidebar-collection-head").droppable({
            accept: ".sidebar-collection-request",
            hoverClass: "ui-state-hover",
            drop: _.bind(this.handleRequestDropOnCollection, this)
        });
    },

    renderFoldersInSidebar: function(collection) {
        var folders;
        var targetElement;
        var folderContainer;
        var i;

        if("folders" in collection) {
            folders = collection["folders"];
            folders.sort(sortAlphabetical);

            folderContainer = "#folders-" + collection.id;
            $(folderContainer).append(Handlebars.templates.collection_sidebar_folders({"folders": folders}));

            $('#collection-' + collection.id + " .folder-head").droppable({
                accept: ".sidebar-collection-request",
                hoverClass: "ui-state-hover",
                drop: _.bind(this.handleRequestDropOnFolder, this)
            });

            for(i = 0; i < folders.length; i++) {
                targetElement = "#folder-requests-" + folders[i].id;
                this.renderRequestsInSidebar(targetElement, folders[i].requests);
            }
        }
    },

    renderRequestsInSidebar: function(targetElement, requests) {
        if (!requests) return;

        var view = this;

        var count = requests.length;
        var requestTargetElement;

        if (count > 0) {
            for (var i = 0; i < count; i++) {
                if (typeof requests[i].name === "undefined") {
                    requests[i].name = requests[i].url;
                }
                //requests[i].name = limitStringLineWidth(requests[i].name, 40);
                requestTargetElement = "#sidebar-request-" + requests[i].id;
                $(requestTargetElement).draggable({});
            }

            $(targetElement).html("");

            $(targetElement).append(Handlebars.templates.collection_sidebar_requests({"items":requests}));
            $(targetElement).sortable({
                delay: 150,
                update: _.bind(view.onUpdateSortableCollectionRequestList, view)
            });
        }
    },

    onUpdateSortableCollectionRequestList: function(event, ui) {
        //hack to prevent sortable and droppable being called immediately
        if(pm.requestTransferInProgress) {
           return;
        }

        var pmCollection = this.model;

        var isInFolder = $(event.target).attr("class").search("folder-requests") >= 0;

        if(isInFolder) {
            var folder_id = $(event.target).attr("data-id");
            var target_parent = $(event.target).parent(".folder-requests");
            var target_parent_collection = $(event.target).parents(".sidebar-collection");
            var collection_id = $(target_parent_collection).attr("data-id");
            var ul_id = $(target_parent.context).attr("id");
            var collection_requests = $(target_parent.context).children("li");
            var count = collection_requests.length;
            var order = [];

            for (var i = 0; i < count; i++) {
                var li_id = $(collection_requests[i]).attr("id");
                var request_id = $("#" + li_id + " .request").attr("data-id");
                order.push(request_id);
            }

            pmCollection.updateFolderOrder(collection_id, folder_id, order);
        }
        else {
            var target_parent = $(event.target).parents(".sidebar-collection-requests");
            var target_parent_collection = $(event.target).parents(".sidebar-collection");
            var collection_id = $(target_parent_collection).attr("data-id");
            var ul_id = $(target_parent.context).attr("id");
            var collection_requests = $(target_parent.context).children("li");
            var count = collection_requests.length;
            var order = [];

            for (var i = 0; i < count; i++) {
                var li_id = $(collection_requests[i]).attr("id");
                var request_id = $("#" + li_id + " .request").attr("data-id");
                order.push(request_id);
            }

            pmCollection.updateCollectionOrder(collection_id, order);
        }
        this._updateSidebar();
    },

    updateCollectionMeta: function(collection) {
        var id = collection.get("id");

        var currentClass = $("#collection-" + id + " .sidebar-collection-head-dt").attr("class");
        var collectionHeadHtml = '<span class="sidebar-collection-head-dt"><img src="img/dt.png"/></span>';
        collectionHeadHtml += " " + collection.get("name");

        $('#collection-' + collection.id + " .sidebar-collection-head-name").html(collectionHeadHtml);
        $('#select-collection option[value="' + collection.get("id") + '"]').html(collection.get("name"));

        if(currentClass.indexOf("open") >= 0) {
            $("#collection-" + id + " .sidebar-collection-head-dt").addClass("disclosure-triangle-open");
        }
        else {
            $("#collection-" + id + " .sidebar-collection-head-dt").addClass("disclosure-triangle-close");
        }
    },

    onAddFolder: function(collection, folder) {
        var folderContainer = "#folders-" + collection.id;
        $(folderContainer).append(Handlebars.templates.item_collection_folder(folder));

        $('#collection-' + collection.id + " .folder-head").droppable({
            accept: ".sidebar-collection-request",
            hoverClass: "ui-state-hover",
            drop: _.bind(this.handleRequestDropOnFolder, this)
        });
        this._updateSidebar();
    },

    onUpdateFolder: function(collection, folder) {
        $("#folder-" + folder.id + " .folder-head-name .name").html(folder.name);
    },

    onDeleteFolder: function(collection, id) {
        $("#folder-" + id).remove();
    },

    onMoveRequestToFolder: function(targetCollection, folder, request) {
        this.removeCollectionRequest(request.id);
        var targetElement = $("#folder-requests-" + folder.id);
        this.addRequestToFolder(folder, request);
        this._updateSidebar();
    },

    onMoveRequestToCollection: function(targetCollection, request) {
        this.removeCollectionRequest(request.id);

        var targetElement = "#collection-requests-" + request.collectionId;
        this.addRequestToList(targetElement, request);
        this._updateSidebar();
    },

    addRequestToList: function(targetElement, request) {
        var view = this;

        $('#sidebar-request-' + request.id).draggable({});

        if (typeof request.name === "undefined") {
            request.name = request.url;
        }

        //request.name = limitStringLineWidth(request.name, 43);

        $(targetElement).append(Handlebars.templates.item_collection_sidebar_request(request));

        request.isFromCollection = true;
        request.collectionRequestId = request.id;

        $(targetElement).sortable({
            delay: 150,
            update: _.bind(view.onUpdateSortableCollectionRequestList, view)
        });

        $('#collection-' + request.collectionId + " .sidebar-collection-head").droppable({
            accept: ".sidebar-collection-request",
            hoverClass: "ui-state-hover",
            drop: _.bind(this.handleRequestDropOnCollection, this)
        });
    },

    addRequestToFolder: function(folder, request) {
        var targetElement = "#folder-requests-" + folder.id;
        this.addRequestToList(targetElement, request);
    },

    addCollectionRequest: function(request) {
        var targetElement = "#collection-requests-" + request.collectionId;

        $('.sidebar-collection-request').removeClass('sidebar-collection-request-active');
        $('#sidebar-request-' + request.id).addClass('sidebar-collection-request-active');

        this.addRequestToList(targetElement, request);
        this.openCollection(request.collectionId);
        pm.mediator.trigger("loadRequest", request);
    },

    removeCollectionRequest: function(id) {
        $('#sidebar-request-' + id).remove();
    },

    updateCollectionRequest: function(request, noNotif) {
        if(typeof(noNotif)==='undefined') noNotif = false;

        var requestName;
        //requestName = limitStringLineWidth(request.name, 43);
        requestName = request.name;
        $('#sidebar-request-' + request.id + " .request .request-name").html(requestName);
        $('#sidebar-request-' + request.id + " .request .label").html(request.method);
            
        var labelClasses = ['GET', 'PUT', 'POST', 'DELETE'];

        for(var i = 0; i < labelClasses.length; i++) {
            $('#sidebar-request-' + request.id + " .request .label").removeClass('label-method-' + labelClasses[i]);    
        }        

        $('#sidebar-request-' + request.id + " .request .label").addClass('label-method-' + request.method);

        if(!noNotif) {
            noty({
            type:'success',
            text:'Saved request',
            layout:'topCenter',
            timeout:750
            });
        }
    },

    openCollection:function (id, toAnimate) {
        var target = "#collection-children-" + id;
        $("#collection-" + id + " .sidebar-collection-head-dt").removeClass("disclosure-triangle-close");
        $("#collection-" + id + " .sidebar-collection-head-dt").addClass("disclosure-triangle-open");

        if ($(target).css("display") === "none") {
            if(toAnimate === false) {
                $(target).css("display", "block");
            }
            else {
                $(target).slideDown(100, function () {
                });
            }
        }
    },

    toggleRequestList:function (id) {
        var target = "#collection-children-" + id;
        if ($(target).css("display") === "none") {
            $("#collection-" + id + " .sidebar-collection-head-dt").removeClass("disclosure-triangle-close");
            $("#collection-" + id + " .sidebar-collection-head-dt").addClass("disclosure-triangle-open");

            $(target).slideDown(100, function () {
            });
        }
        else {
            $("#collection-" + id + " .sidebar-collection-head-dt").removeClass("disclosure-triangle-open");
            $("#collection-" + id + " .sidebar-collection-head-dt").addClass("disclosure-triangle-close");
            $(target).slideUp(100, function () {
            });
        }
    },

    toggleSubRequestList: function(id) {
        var target = "#folder-requests-" + id;

        if ($(target).css("display") === "none") {
            $("#folder-" + id + " .folder-head-dt").removeClass("disclosure-triangle-close");
            $("#folder-" + id + " .folder-head-dt").addClass("disclosure-triangle-open");

            $(target).slideDown(100, function () {
            });
        }
        else {
            $("#folder-" + id + " .folder-head-dt").removeClass("disclosure-triangle-open");
            $("#folder-" + id + " .folder-head-dt").addClass("disclosure-triangle-close");
            $(target).slideUp(100, function () {
            });
        }
    },

    handleRequestDropOnCollection: function(event, ui) {
        var id = ui.draggable.context.id;
        var requestId = $('#' + id + ' .request').attr("data-id");
        var targetCollectionId = $($(event.target).find('.sidebar-collection-head-name')[0]).attr('data-id');
        this.model.moveRequestToCollection(requestId, targetCollectionId);
    },

    handleRequestDropOnFolder: function(event, ui) {
        var id = ui.draggable.context.id;
        var requestId = $('#' + id + ' .request').attr("data-id");
        var targetFolderId = $($(event.target).find('.folder-head-name')[0]).attr('data-id');        
        this.model.moveRequestToFolder(requestId, targetFolderId);
    },

    onFilter: function(filteredCollectionItems) {
        var collectionsCount = filteredCollectionItems.length;        

        for(var i = 0; i < collectionsCount; i++) {
            var c = filteredCollectionItems[i];
            var collectionDomId = "#collection-" + c.id;
            var collectionFoldersDomId = "#folders-" + c.id;
            var collectionChildrenDomId = "#collection-children-" + c.id;
            var dtDomId = "#collection-" + c.id + " .sidebar-collection-head-dt";

            if(c.toShow) {
                $(collectionDomId).css("display", "block");
                $(collectionChildrenDomId).css("display", "block");

                $(dtDomId).removeClass("disclosure-triangle-close");
                $(dtDomId).addClass("disclosure-triangle-open");

                var requests = c.requests;

                if(requests) {
                    var requestsCount = requests.length;
                    for(var j = 0; j < requestsCount; j++) {
                        var r = requests[j];
                        var requestDomId = "#sidebar-request-" + r.id;
                        if(r.toShow) {
                            $(requestDomId).css("display", "block");
                        }
                        else {
                            $(requestDomId).css("display", "none");
                        }
                    }
                }

                if("folders" in c) {
                    var folders = c["folders"];
                    for(var k = 0; k < folders.length; k++) {
                        var folderDomId = "#folder-" + folders[k].id;
                        var folderRequestsDomId = folderDomId + " .folder-requests";
                        var dtFolderDomId = folderDomId + " .folder-head .folder-head-dt";

                        if(folders[k].toShow) {
                            $(folderDomId).css("display", "block");
                            $(folderRequestsDomId).css("display", "block");
                            $(dtFolderDomId).removeClass("disclosure-triangle-close");
                            $(dtFolderDomId).addClass("disclosure-triangle-open");
                        }
                        else {
                            $(folderDomId).css("display", "none");
                            $(folderRequestsDomId).css("display", "none");
                            $(dtFolderDomId).addClass("disclosure-triangle-close");
                            $(dtFolderDomId).removeClass("disclosure-triangle-open");
                        }
                    }
                }
            }
            else {
                $(collectionDomId).css("display", "none");
                $(collectionChildrenDomId).css("display", "none");
                $(dtDomId).removeClass("disclosure-triangle-open");
                $(dtDomId).addClass("disclosure-triangle-close");
            }
        }
    },

    onRevertFilter: function() {
        $(".sidebar-collection").css("display", "block");
        $(".folder").css("display", "block");
        $(".sidebar-collection-request").css("display", "block");
    }
});