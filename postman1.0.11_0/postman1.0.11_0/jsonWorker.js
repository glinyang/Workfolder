importScripts("js/libs/jsontree/default.js", "js/libs/jsontree/json-bigint.js", "js/libs/jsontree/jsonview.js")

onmessage = function (jsontext) {
	var retVal = jv_processJSON(jsontext.data);
	if(retVal === -1) {
		postMessage("error");
	}
	else {
		postMessage(retVal);
	}
};