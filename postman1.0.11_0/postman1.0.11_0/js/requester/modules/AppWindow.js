var AppWindow = Backbone.Model.extend({
    defaults: function() {
        return {
        	id:0,        	
            internalEvents: {}
        };
    },

    initialize: function(options) {
    	this.set("id", guid());        
    	this.initializeInternalMessaging();
    },

    onRegisterInternalEvent: function(e, func, context) {
        var internalEvents = this.get("internalEvents");
        internalEvents[e] = {
            "handler": func,
            "context": context
        }
    },

    sendMessageObject: function(e, object) {
    	var message = {
    		"id": this.get("id"),
    		"event": e,
    		"object": object
    	};

    	chrome.runtime.sendMessage(message);
    },

    initializeInternalMessaging: function() {
    	var model = this;
        this.on("registerInternalEvent", this.onRegisterInternalEvent, this);
    	this.on("sendMessageObject", this.sendMessageObject, this);

    	chrome.runtime.onMessage.addListener(function(message) {
    		if (model.get("id") !== message.id) {
                var internalEvents = model.get("internalEvents");
                if (message.event in internalEvents) {
                    var e = message.event;
                    var object = message.object;
                    _.bind(internalEvents[e].handler, internalEvents[e].context)(object);
                }
    		}
    	});
    }
});