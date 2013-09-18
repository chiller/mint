function RestCtrl ($scope, $resource, Doc) {
    $scope.fetch = function(){Doc.query(function(response){
        $scope.docs = response;
    })};
    $scope.fetch()
    $scope.newDoc
    $scope.selDoc = null;
    $scope.addDoc = function () {
        Doc.save($scope.newDoc, function(res){
            $scope.docs.push(res);    
        });
        
    }
    $scope.deleteDoc = function(doc) {

        Doc.delete({id:doc._id}, function(res, data, data2){
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
        Doc.update($scope.selDoc, function(){
            console.log("success");
        })
    }


}