App.factory('Search',function($resource, configService){
	return $resource(
        configService.api_url + '/highlight/search/:subject'
	);
});

App.controller('searchController', function($scope, $routeParams, $location, Search){
	$scope.subject = $routeParams.subject;

	var list = Search.query(
		{
			subject : $scope.subject
		},
		function(){
			$scope.list = list;
		}
	);

	$scope.showHighlight = function(highlightId) {
		$location.path('/highlight/' + highlightId);
	};
});