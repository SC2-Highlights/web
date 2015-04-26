App.factory('ContactService',function($resource){
    return $resource(
        'http://api.sc2hl.com/contact'
    );
});

App.factory('SuggestService',function($resource){
    return $resource(
        'http://api.sc2hl.com/suggestion'
    );
});

App.controller('modalSuggestForm', function($scope, $modalInstance, SuggestService) {
    $scope.suggest = SuggestService.get(function(){
        $scope.submitSuggestion = function(data){
            $scope.suggest.error = false;
            $scope.suggest.data = data;
            $scope.suggest.$save(function(){
            }).then(function(returnData){
                $scope.message = returnData.message;
            })
        }
    });

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});

App.controller('modalContactForm', function($scope, $modalInstance, ContactService) {
    $scope.contact = ContactService.get(function(){
        $scope.submitContact = function(data){
            $scope.contact.error = false;
            $scope.contact.data = data;
            $scope.contact.$save(function(){
            }).then(function(returnData){
                $scope.message = returnData.message;
            })
        }
    });

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});