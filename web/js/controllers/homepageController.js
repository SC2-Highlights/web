App.factory('HomepagePost',function($resource, configService){
	return $resource(
		configService.api_url + '/blog/:id'
	);
});

App.factory('RecentHighlight', function($resource, configService) {
	return $resource(
		configService.api_url + '/blog/highlight/recent/:limit'
	);
});

App.factory('TopHighlight', function($resource, configService) {
	return $resource(
		configService.api_url + '/blog/highlight/top/:limit'
	);
});

App.factory('RandomHighlight', function($resource, configService) {
	return $resource(
		configService.api_url + '/blog/highlight/random/:limit'
	);
});

App.controller('homepageController', function($sce, $scope, $location, $rootScope, Event, RecentHighlight, TopHighlight, RandomHighlight){
	var events = Event.query(
		function(){
			$scope.events = events;
			$scope.upcoming = [];
			$scope.current = [];
			$scope.recent = [];
			var now = new Date().getTime() / 1000;

			events.forEach(function(entry){
				entry.unixStartTime = parseInt(moment(entry.start_date).format('X')) + 86400;
				entry.unixEndTime = parseInt(moment(entry.end_date).format('X')) + 86400;

				if(entry.unixStartTime > now){
					$scope.upcoming.push(entry);
				} else if(entry.unixEndTime > now){
					$scope.current.push(entry);
				} else if(entry.unixEndTime > (now - 2592000)){
					$scope.recent.push(entry);
				}
			})
		}
	);

	$scope.goToLink = function(link) {
		window.location = link;
	};

	$scope.skipValidation = function(value) {
		return $sce.trustAsHtml(value);
	};

	var recentHighlights = RecentHighlight.query(
		{
			limit: 3
		},

		function() {
			$scope.recentHighlights = recentHighlights;
		}
	);

	var topHighlights = TopHighlight.query(
		{
			limit: 3
		},

		function() {
			$scope.topHighlights = topHighlights;
		}
	);

	var randomHighlights = RandomHighlight.query(
		{
			limit: 3
		},

		function() {
			$scope.randomHighlights = randomHighlights;
		}
	);

});

App.controller('blogController', function($sce, $scope, $routeParams, $rootScope, $location, HomepagePost){
	var blog = HomepagePost.get(
		{
			id : $routeParams.blogId
		},
		function(){
			if(!blog.heading){
				$location.path("/404");
			}
			$scope.blog = blog;
			$rootScope.metaTitle = blog.heading;
		}
	);

	$scope.skipValidation = function(value) {
		return $sce.trustAsHtml(value);
	};
});