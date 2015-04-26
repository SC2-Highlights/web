App.factory('Search',function($resource){
	return $resource(
        'http://localhost:3000/highlight/search/:subject'
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