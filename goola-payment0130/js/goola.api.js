
(function(api) {
	baseServerUrl = "/goola-web";
	mobileServerUrl = "/shop-admin"
	picUrl = "/image/";
	goola.extend(api, {
		rootUrl : baseServerUrl,
		baseServerUrl: baseServerUrl + "/v1",
		mobileServerUrl:mobileServerUrl+"/a",
		picUrl : picUrl

	})	
})(goola.api || (goola.api = {}));