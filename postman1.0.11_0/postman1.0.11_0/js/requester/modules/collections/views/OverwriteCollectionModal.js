var OverwriteCollectionModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;

        model.on("overwriteCollectionChoice", this.render, this);

        $("#modal-overwrite-collection-duplicate").on("click", function() {
            var originalCollectionId = model.originalCollectionId;
            var toBeImportedCollection = model.toBeImportedCollection;
            toBeImportedCollection.id = guid();
            toBeImportedCollection.name = toBeImportedCollection.name + " copy";
            model.duplicateCollection(toBeImportedCollection);
        });

        $("#modal-overwrite-collection-overwrite").on("click", function() {
            var originalCollectionId = model.originalCollectionId;
            var toBeImportedCollection = model.toBeImportedCollection;
            model.overwriteCollection(toBeImportedCollection);
        });

    },

    render: function(collection) {
        var originalCollectionId = this.model.originalCollectionId;
        $("#existingCollectionName").html(this.model.getCollectionById(originalCollectionId).get("name"));
        $("#modal-overwrite-collection").modal("show");
    }
});
