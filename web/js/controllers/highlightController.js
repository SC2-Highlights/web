App.factory('Highlight', function($resource, configService){
	return $resource(
		configService.api_url + '/highlight/:id',
        null,
        {
            rate: { method:'PUT' }
        }
	);
});

App.factory('Event', function($resource, configService){
	return $resource(
		configService.api_url + '/event/:id'
	);
});

App.factory('RelatedHighlight', function($resource, configService){
	return $resource(
		configService.api_url + '/event/:id'
	);
});

App.controller('highlightController', function($sce, $scope, $routeParams, $rootScope, $location, Highlight, Event, RelatedHighlight, configService){
	$scope.showHighlight = function(highlightId) {
		$location.path('/highlight/' + highlightId);
	};

    $scope.rateHighlight = function(){
        Highlight.rate(
            {
                id: $scope.highlight.highlight_id
            },
            {
                rating: $scope.rate
            }
        );
    }

    // Rating
    $scope.rate = 0;
    $scope.max = 5;

    $scope.hoveringOver = function(value) {
        $scope.overStar = value;
    };

	var highlight = Highlight.get(
		{
			id: $routeParams.id
		},
		function () {
			if (!highlight.title) {
				$location.path("/404");
			}

			highlight.fullYtUrl = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + highlight.yt_url + '?autoplay=1&showinfo=0');
			highlight.url = configService.site_url + '/highlight/' + highlight.highlight_id;
			$scope.highlight = highlight;
			$rootScope.metaTitle = highlight.title;
			$scope.rate = highlight.userRating;

			var events = Event.get(
				{
					id: highlight.event_id
				},
				function () {
					$scope.events = events;
				}
			);

			var relatedHighlights = RelatedHighlight.query(
				{
					id: highlight.event_id
				},
				function () {
					$scope.relatedHighlights = relatedHighlights;
				}
			);
		}
	);
});

App.controller('HighlightListController', function($scope, Highlight, $location, $timeout, $filter){
    $scope.filterHighlights = function() {
        $scope.filteredHighlights = $filter('filter') ($scope.highlights, $scope.search);
        $scope.totalItems = $scope.filteredHighlights.length;
    }


    var highlights = Highlight.query(
		function(){
			$scope.highlights = highlights;
			$scope.filterHighlights();
		}
	);

	$scope.showHighlight = function(highlightId, event) {
		if(event.ctrlKey == 1){
			var win = window.open('/highlight/' + highlightId, '_blank');
			win.focus();
		} else {
			$location.path('/highlight/' + highlightId);
		}
	};

	$scope.currentPage = 1;
	$scope.maxSize = 5;
	$scope.itemsPerPage = 25;
	$scope.offset = 0;
	$scope.sort = 'date_added';
	$scope.direction = true;

	$scope.pageChanged = function() {
		$scope.offset = ($scope.currentPage - 1) * $scope.itemsPerPage;
	};

	$scope.changeSorting = function(newSort, direction) {
		if($scope.sort == newSort){
			$scope.direction = !$scope.direction;
		} else {
			$scope.sort = newSort;
			$scope.direction = true;
		}
	};
});