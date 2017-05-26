angular.module('gateway', []).config(function($httpProvider) {

	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

}).controller('navigation',

function($http) {

	var self = this;
	self.iframe = 'home';
	self.showNavbar = false;

	var authenticate = function(credentials, callback) {

		var headers = credentials ? {
			authorization : "Basic "
					+ btoa(credentials.username + ":"
							+ credentials.password)
		} : {};

		self.user = ''
		$http.get('user', {
			headers : headers
		}).then(function(response) {
			var data = response.data;
			if (data.name) {
				self.authenticated = true;
				self.user = data.name
				self.admin = data && data.roles && data.roles.indexOf("ROLE_ADMIN")>-1;
			} else {
				self.authenticated = false;
				self.admin = false;
			}
			callback && callback(true);
		}, function() {
			self.authenticated = false;
			callback && callback(false);
		});

	}

	authenticate();

	self.credentials = {};
	self.login = function() {
		authenticate(self.credentials, function(authenticated) {
			self.authenticated = authenticated;
			self.error = !authenticated;
		})
	};
	
	self.iFrameUrl  = function(location) {
		if (location === 'admin') return "/admin/";
		if (location === 'user') return "/ui/";
		return "";
	}

	self.logout = function() {
		$http.post('logout', {}).finally(function() {
			self.authenticated = false;
			self.admin = false;
		});
	}

});
