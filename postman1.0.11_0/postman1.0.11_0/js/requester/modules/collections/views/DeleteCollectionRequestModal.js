var DeleteCollectionRequestModal = Backbone.View.extend({
    initialize: function() {
        var model = this.model;

        model.on("deleteCollectionRequest", this.render, this);

        $('#modal-delete-collection-request-yes').on("click", function () {
            var id = $(this).attr('data-id');
            model.deleteCollectionRequest(id);
        });

        $("#modal-delete-collection-request").on('keydown', function (event) {
            if (event.keyCode === 13) {
                var id=$("#modal-delete-collection-request-yes").attr('data-id');
                model.deleteCollectionRequest(id);
                $("#modal-delete-collection-request").modal('hide');
                event.preventDefault();
                return false;
            }
        });
    },

    render: function(request) {
        $('#modal-delete-collection-request-yes').attr('data-id', request.id);
        $('#modal-delete-collection-request-name').html(request.name);
        $('#modal-delete-collection-request').modal('show');
    }
});
