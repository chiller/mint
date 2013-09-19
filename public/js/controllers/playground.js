function RestCtrl ($scope, $resource, DocumentService) {
    $scope.fetch = function(){DocumentService.query(function(response){
        $scope.docs = response;
    })};
    $scope.fetch()
    $scope.newDoc
    $scope.selDoc = null;
    $scope.addDoc = function () {
        DocumentService.save($scope.newDoc, function(res){
            $scope.docs.push(res);    
        });
        
    }
    $scope.deleteDoc = function(doc) {

        DocumentService.delete({id:doc._id}, function(res, data, data2){
            if(res[0]) {
            idx = $scope.docs.indexOf(doc)
            $scope.docs.splice(idx,1);
            }
        } );
    }
    $scope.selectDoc = function(doc) {
        $scope.selDoc = doc;
    }
    $scope.updateDoc = function() {
        DocumentService.update($scope.selDoc, function(){
            console.log("success");
        })
    }


}