function RestCtrl ($scope, $resource, Doc) {
    $scope.fetch = function(){Doc.query(function(response){
        $scope.docs = response;
    })};
    $scope.fetch()
    $scope.newDoc

    $scope.addDoc = function () {
        Doc.save($scope.newDoc);
        $scope.fetch();
    }





}