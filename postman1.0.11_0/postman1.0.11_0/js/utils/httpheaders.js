var headerDetails = {
    "accept-ranges":"Content-Types that are acceptable",
    "access-control-allow-credentials":"Indicates whether or not the response to the request can be exposed when the credentials flag is true. When used as part of a response to a preflight request, this indicates whether or not the actual request can be made using credentials.",
    "access-control-allow-headers":"Used in response to a preflight request to indicate which HTTP headers can be used when making the actual request.",
    "access-control-allow-origin":"Specifies a URI that may access the resource. For requests without credentials, the server may specify '*' as a wildcard, thereby allowing any origin to access the resource.",
    "access-control-allow-methods":"Specifies the method or methods allowed when accessing the resource. This is used in response to a preflight request.",
    "access-control-expose-headers":"Lets a server whitelist headers that browsers are allowed to access.",
    "access-control-max-age":"Indicates how long the results of a preflight request can be cached in seconds.",
    "access-control-request-method":"Used when issuing a preflight request to let the server know what HTTP method will be used when the actual request is made.",
    "access-control-request-headers":"Used when issuing a preflight request to let the server know what HTTP headers will be used when the actual request is made.",
    "age":"The age the object has been in a proxy cache in seconds",
    "allow":"Valid actions for a specified resource. To be used for a 405 Method not allowed",
    "cache-control":"Tells all caching mechanisms from server to client whether they may cache this object. It is measured in seconds",
    "connection":"Options that are desired for the connection",
    "content-encoding":"The type of encoding used on the data.",
    "content-language":"The language the content is in",
    "content-length":"The length of the response body in octets (8-bit bytes)",
    "content-location":"An alternate location for the returned data",
    "content-md5":"A Base64-encoded binary MD5 sum of the content of the response",
    "content-disposition":"An opportunity to raise a \"File Download\" dialogue box for a known MIME type",
    "content-range":"Where in a full body message this partial message belongs",
    "content-type":"The mime type of this content",
    "date":"The date and time that the message was sent",
    "etag":"An identifier for a specific version of a resource, often a message digest",
    "expires":"Gives the date/time after which the response is considered stale",
    "last-modified":"The last modified date for the requested object, in RFC 2822 format",
    "link":"Used to express a typed relationship with another resource, where the relation type is defined by RFC 5988",
    "location":"Used in redirection, or when a new resource has been created.",
    "p3p":"This header is supposed to set P3P policy, in the form of P3P:CP=\"your_compact_policy\". However, P3P did not take off, most browsers have never fully implemented it, a lot of websites set this header with fake policy text, that was enough to fool browsers the existence of P3P policy and grant permissions for third party cookies.",
    "pragma":"Implementation-specific headers that may have various effects anywhere along the request-response chain.",
    "proxy-authenticate":"Request authentication to access the proxy.",
    "refresh":"Used in redirection, or when a new resource has been created. This refresh redirects after 5 seconds. This is a proprietary, non-standard header extension introduced by Netscape and supported by most web browsers.",
    "retry-after":"If an entity is temporarily unavailable, this instructs the client to try again after a specified period of time (seconds).",
    "server":"A name for the server",
    "set-cookie":"an HTTP cookie",
    "strict-transport-security":"A HSTS Policy informing the HTTP client how long to cache the HTTPS only policy and whether this applies to subdomains.",
    "trailer":"The Trailer general field value indicates that the given set of header fields is present in the trailer of a message encoded with chunked transfer-coding.",
    "transfer-encoding":"The form of encoding used to safely transfer the entity to the user. Currently defined methods are: chunked, compress, deflate, gzip, identity.",
    "vary":"Tells downstream proxies how to match future request headers to decide whether the cached response can be used rather than requesting a fresh one from the origin server.",
    "via":"Informs the client of proxies through which the response was sent.",
    "warning":"A general warning about possible problems with the entity body.",
    "www-authenticate":"Indicates the authentication scheme that should be used to access the requested entity.",
    "x-requested-with":"Mainly used to identify Ajax requests. Most JavaScript frameworks send this header with value of XMLHttpRequest",
    "x-do-not-track":"Requests a web application to disable their tracking of a user. Note that, as of yet, this is largely ignored by web applications. It does however open the door to future legislation requiring web applications to comply with a user's request to not be tracked. Mozilla implements the DNT header with a similar purpose.",
    "dnt":"Requests a web application to disable their tracking of a user. This is Mozilla's version of the X-Do-Not-Track header (since Firefox 4.0 Beta 11). Safari and IE9 also have support for this header. On March 7, 2011, a draft proposal was submitted to IETF.",
    "x-forwarded-for":"A de facto standard for identifying the originating IP address of a client connecting to a web server through an HTTP proxy or load balancer",
    "x-frame-options":"Clickjacking protection: \"deny\" - no rendering within a frame, \"sameorigin\" - no rendering if origin mismatch",
    "x-xss-protection":"Cross-site scripting (XSS) filter",
    "x-content-type-options":"The only defined value, \"nosniff\", prevents Internet Explorer from MIME-sniffing a response away from the declared content-type",
    "x-forwarded-proto":"A de facto standard for identifying the originating protocol of an HTTP request, since a reverse proxy (load balancer) may communicate with a web server using HTTP even if the request to the reverse proxy is HTTPS",
    "x-powered-by":"Specifies the technology (ASP.NET, PHP, JBoss, e.g.) supporting the web application (version details are often in X-Runtime, X-Version, or X-AspNet-Version)"
};

var restrictedChromeHeaders = [
    { label: "Accept-Charset", category: "Restricted HTTP Headers (Use Postman Interceptor extension)", type: "http" },
    { label: "Accept-Encoding", category: "Restricted HTTP Headers (Use Postman Interceptor extension)", type: "http" },
    { label: "Access-Control-Request-Headers", category: "Restricted HTTP Headers (Use Postman Interceptor extension)", type: "http" },
    { label: "Access-Control-Request-Method", category: "Restricted HTTP Headers (Use Postman Interceptor extension)", type: "http" },
    { label: "Connection", category: "Restricted HTTP Headers (Use Postman Interceptor extension)", type: "http" },
    { label: "Content-Length", category: "Restricted HTTP Headers (Use Postman Interceptor extension)", type: "http" },
    { label: "Cookie", category: "Restricted HTTP Headers (Use Postman Interceptor extension)", type: "http" },
    { label: "Cookie 2", category: "Restricted HTTP Headers (Use Postman Interceptor extension)", type: "http" },
    { label: "Content-Transfer-Encoding", category: "Restricted HTTP Headers (Use Postman Interceptor extension)", type: "http" },
    { label: "Date", category: "Restricted HTTP Headers (Use Postman Interceptor extension)", type: "http" },
    { label: "Expect", category: "Restricted HTTP Headers (Use Postman Interceptor extension)", type: "http" },
    { label: "Host", category: "Restricted HTTP Headers (Use Postman Interceptor extension)", type: "http" },
    { label: "Keep-Alive", category: "Restricted HTTP Headers (Use Postman Interceptor extension)", type: "http" },
    { label: "Origin", category: "Restricted HTTP Headers (Use Postman Interceptor extension)", type: "http" },
    { label: "Referer", category: "Restricted HTTP Headers (Use Postman Interceptor extension)", type: "http" },
    { label: "TE", category: "Restricted HTTP Headers (Use Postman Interceptor extension)", type: "http" },
    { label: "Trailer", category: "Restricted HTTP Headers (Use Postman Interceptor extension)", type: "http" },
    { label: "Transfer-Encoding", category: "Restricted HTTP Headers (Use Postman Interceptor extension)", type: "http" },
    { label: "Upgrade", category: "Restricted HTTP Headers (Use Postman Interceptor extension)", type: "http" },
    { label: "User-Agent", category: "Restricted HTTP Headers (Use Postman Interceptor extension)", type: "http" },
    { label: "Via", category: "Restricted HTTP Headers (Use Postman Interceptor extension)", type: "http" },
];

var allowedChromeHeaders = [
    //Standard headers
    { label: "Accept", category: "Allowed HTTP Headers", type: "http" },
    { label: "Accept-Language", category: "Allowed HTTP Headers", type: "http" },
    { label: "Authorization", category: "Allowed HTTP Headers", type: "http" },
    { label: "Cache-Control", category: "Allowed HTTP Headers", type: "http" },
    { label: "Content-MD5", category: "Allowed HTTP Headers", type: "http" },
    { label: "Content-Type", category: "Allowed HTTP Headers", type: "http" },
    { label: "From", category: "Allowed HTTP Headers", type: "http" },
    { label: "If-Match", category: "Allowed HTTP Headers", type: "http" },
    { label: "If-Modified-Since", category: "Allowed HTTP Headers", type: "http" },
    { label: "If-None-Match", category: "Allowed HTTP Headers", type: "http" },
    { label: "If-Range", category: "Allowed HTTP Headers", type: "http" },
    { label: "If-Unmodified-Since", category: "Allowed HTTP Headers", type: "http" },
    { label: "Max-Forwards", category: "Allowed HTTP Headers", type: "http" },
    { label: "Pragma", category: "Allowed HTTP Headers", type: "http" },
    { label: "Proxy-Authorization", category: "Allowed HTTP Headers", type: "http" },
    { label: "Range", category: "Allowed HTTP Headers", type: "http" },
    { label: "Warning", category: "Allowed HTTP Headers", type: "http" },

    //Non standard headers
    { label: "X-Requested-With", category: "Allowed HTTP Headers", type: "http" },
    { label: "X-Do-Not-Track", category: "Allowed HTTP Headers", type: "http" },
    { label: "DNT", category: "Allowed HTTP Headers", type: "http" }
];