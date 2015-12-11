var DeleteCollectionModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;

        $('#modal-delete-collection-yes').on("click", function () {
            var id = $(this).attr('data-id');
            model.deleteCollection(id);
        });

        $("#modal-delete-collection").on("shown", function () {
            pm.app.trigger("modalOpen", "#modal-delete-collection");
        });

        $("#modal-delete-collection").on("hidden", function () {
            pm.app.trigger("modalClose");
        });

        $("#modal-delete-collection").on('keydown', function (event) {
            if (event.keyCode === 13) {
                var id=$("#modal-delete-collection-yes").attr('data-id');
                model.deleteCollection(id);
                $("#modal-delete-collection").modal('hide');
                event.preventDefault();
                return false;
            }
        });
    },

    render: function() {

    }
});
