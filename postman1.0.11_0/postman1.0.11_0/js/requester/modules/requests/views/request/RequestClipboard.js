var RequestClipboard = Backbone.View.extend({
    initialize: function() {
        var model = this.model;
        var response = model.get("response");

        $("#response-copy-button").on("click", function() {
            var scrollTop = $(window).scrollTop();
            if($("#currentPrettyMode").html()=="JSON") {
                var possiblyUncleanJSON=response.get("text");
                var cleanJSON = possiblyUncleanJSON.substring(possiblyUncleanJSON.indexOf('{'));
                copyToClipboard(vkbeautify.json(cleanJSON));
            }
            else {
                copyToClipboard(response.get("text"));
            }
            $(document).scrollTop(scrollTop);
        });
    }
})