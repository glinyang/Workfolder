var RequestMetaViewer = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var view = this;

        model.on("loadRequest", this.render, this);
        model.on("change:name", this.render, this);
        model.on("change:description", this.render, this);

        this.requestSampleResponseList = new RequestSampleResponseList({model: this.model});

        $('.request-meta-actions-togglesize').on("click", function () {
            var action = $(this).attr('data-action');

            if (action === "minimize") {
                $(this).attr("data-action", "maximize");
                $('.request-meta-actions-togglesize span').removeClass("icon-circle-minus");
                $('.request-meta-actions-togglesize span').addClass("icon-circle-plus");
                $("#request-description-container").slideUp(100);
            }
            else {
                $('.request-meta-actions-togglesize span').removeClass("icon-circle-plus");
                $('.request-meta-actions-togglesize span').addClass("icon-circle-minus");                
                $(this).attr("data-action", "minimize");
                $("#request-description-container").slideDown(100);
            }
        });

        $('#request-description-container').on("click", "a", function() {            
            var url = $(this).attr("href");
            window.open(url);
            return false;
        });

        $('#request-meta').on("mouseenter", function () {
            $('.request-meta-actions').css("display", "block");
        });

        $('#request-meta').on("mouseleave", function () {
            $('.request-meta-actions').css("display", "none");
        });
    },

    show: function() {
        $("#request-description-container").css("display", "block");
        $('#request-meta').css("display", "block");
        $('#request-name').css("display", "block");
        $('#request-description').css("display", "block");
    },

    hide: function() {
        $('#request-meta').css("display", "none");
    },

    render: function() {
        var request = this.model;
        var isFromCollection = this.model.get("isFromCollection");

        if (isFromCollection) {
            this.show();

            var name = request.get("name");
            var description = _.clone(request.get("description"));

            var descriptionFormat = request.get("descriptionFormat");

            if(descriptionFormat === "markdown") {
                description = markdown.toHTML(description);
            }

            if (typeof name !== "undefined") {
                $('#request-meta').css("display", "block");
                $('#request-name').html(name);
                $('#request-name').css("display", "inline-block");
            }
            else {
                $('#request-meta').css("display", "none");
                $('#request-name').css("display", "none");
            }

            if (typeof description !== "undefined") {
                $('#request-description').html(description);
                $('#request-description').css("display", "block");
            }
            else {
                $('#request-description').css("display", "none");
            }

            $('.request-meta-actions-togglesize').attr('data-action', 'minimize');
            $('.request-meta-actions-togglesize span').attr('class', 'icon-circle-minus');
        }
        else {
            this.hide();
        }
    }
});