'use strict';

/* Controllers */


function EditorCtrl($scope, socket, DocumentService, EntityService,PlumbService) {
  DocumentService.query(function(response){$scope.docs=response});
  $scope.init = function(id){
    DocumentService.get({id:id}, function(response){
      
      $scope.shared_document = response;
      
      EntityService.query({document:response._id },function(response){
        var entities = response;
        $scope.shared_document.entities = entities;
        //TODO: this is ugly
        setTimeout(function(){
          PlumbService.setUpPlumbWithScope($scope);
        },500)
      });

    })
  }
  $scope.addDoc = function() {
    $scope.newDoc.author="";
    DocumentService.save($scope.newDoc, function(res){
      $scope.docs.push(res)
    })
  }
  $scope.loadDoc = function(idx) {

    $scope.selectedDocIndex = idx;
    $scope.init($scope.docs[idx]._id);
  }


  
  $scope.selectEntity = function(i) {
    if ($scope.selectedEntity != $scope.shared_document.entities[i]) {
      $scope.selectedEntity2 = $scope.selectedEntity;
      $scope.selectedEntity = $scope.shared_document.entities[i]; 
    }
  }
  
  //shared
  socket.on('entity:create', function (data) {
      var entities = $scope.shared_document.entities;
      entities.push(data.obj);
      console.log("on socket: "+data.msg);
  });

   //socket.on('chat', function (data) {
   //     console.log("on socket: "+data.msg);
   //});
  //shared-end

    $scope.sendshared = function () {
    socket.emit('shared:update', {
      shared_document : $scope.shared_document
    });
  };

 
  $scope.addConnection = function() {
    if ($scope.selectedEntity && $scope.selectedEntity2) {
      var new_connection = {"from":$scope.selectedEntity._id, "to":$scope.selectedEntity2._id};
      $scope.shared_document.connections.push(new_connection)
      //TODO: only set up new ones
      DocumentService.update($scope.shared_document)
      PlumbService.addPlumb(new_connection)
      $scope.sendshared();
    }
  }
  $scope.updateDocument = function() {
    DocumentService.update($scope.shared_document)
  }
  $scope.addEntity = function() {
    EntityService.save({position: {'left':300, 'top':300 }, title:"untitled", document: $scope.shared_document._id}, function(res){
    })
    
  }
  $scope.updateEntity = function(idx) {
    EntityService.update($scope.shared_document.entities[idx], function(){
            console.log("success");
        })
  }
  $scope.deleteEntity = function(keyc) {
    //if (keyc!=46) {return;}

    if ($scope.selectedEntity) {
      jsPlumb.detachAllConnections($("#"+$scope.selectedEntity._id.toString()));
      var idx = $scope.shared_document.entities.indexOf($scope.selectedEntity);
      EntityService.delete({id: $scope.selectedEntity._id}, function(){
        $scope.selectedEntity = null;
        $scope.shared_document.entities.splice(idx,1)  
      })
      
      
    }
    
  }

}
