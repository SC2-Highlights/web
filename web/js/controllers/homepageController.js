App.factory('HomepagePost',function($resource){
	return $resource(
		'http://api.sc2hl.com/blog/:id'
	);
});

App.controller('homepageController', function($sce, $scope, $location, $rootScope, Event, HomepagePost){
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

	var homepagePosts = HomepagePost.query(
		function(){
			$scope.homepagePosts = homepagePosts;
			$scope.totalItems = homepagePosts.length;
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