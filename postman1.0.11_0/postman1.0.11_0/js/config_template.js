// Constants
var POSTMAN_WEB_URL_PRODUCTION = "https://www.getpostman.com";
var POSTMAN_WEB_URL_STAGING = "https://stage.getpostman.com";
var POSTMAN_WEB_URL_DEV = "http://dev.getpostman.com";
var POSTMAN_WEB_URL_LOCAL = "http://localhost/postman/html";

var POSTMAN_INTERCEPTOR_ID_PRODUCTION = "aicmkgpgakddgnaphhhpliifpcfhicfo";
var POSTMAN_INTERCEPTOR_ID_STAGING = "flaanggmaikfebcchaambfkdefklniag";
var POSTMAN_INTERCEPTOR_ID_DEV = "cjjnlahgfafgalfgmabkndcldfdinjci";
var POSTMAN_INTERCEPTOR_ID_LOCAL = "lcjlpdnimfimebpailijjlpjbldigdjj";

var POSTMAN_INDEXED_DB_PRODUCTION = "postman";
var POSTMAN_INDEXED_DB_TESTING = "postman_test";

// Config variables
var postman_flag_is_testing = {{ is_testing }};
var postman_web_url = {{ web_url }};
var postman_all_purchases_available = {{ purchases }};
var postman_interceptor_id = {{ interceptor_id }};

var postman_trial_duration = 1209600000; // 14 days
// var postman_trial_duration = 1000 * 60 * 60 * 2;

var postman_database_name;

if (postman_flag_is_testing) {
	postman_database_name = POSTMAN_INDEXED_DB_TESTING;
}
else {
	postman_database_name = POSTMAN_INDEXED_DB_PRODUCTION;
}