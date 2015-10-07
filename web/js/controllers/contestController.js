App.factory('ContestService',function($resource, configService){
    return $resource(
        configService.api_url + '/contest'
    );
});

App.controller('contestController', function($sce, $scope, $location, $rootScope, $route, ContestService, configService) {

    $scope.contest = ContestService.get(function() {
        $scope.submitContest = function(data) {
            $scope.contest.data = data;
            $scope.contest.$save(
                function(data) {
                    $scope.success = true;
                    $scope.data = data.message;
                },

                function(error) {
                    $scope.success = false;
                    $scope.data = error.data.message;
                }
            )
        };
    });

    $scope.sendAnotherVideo = function () {
        $route.reload();
    };
});
