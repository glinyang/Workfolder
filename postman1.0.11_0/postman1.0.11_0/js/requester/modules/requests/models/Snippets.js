var Snippet = Backbone.Model.extend({
	default: function() {
		return {
			"id": "",
			"name": "",
			"description": "",
			"version": "",
			"code": ""
		};
	},

	initialize: function() {		
	}
});

var Snippets = Backbone.Collection.extend({
	model: Snippet,

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
		this.add(postmanTestSnippets, { merge: true });
	},

	addSnippet: function(id) {
		var snippet = this.get(id);
		pm.mediator.trigger("addSnippetToEditor", snippet);
	}
})