'use strict';

/* Controllers */


function EditorCtrl($scope, socket, DocumentService, EntityService,PlumbService,ConnectionService, AQ) {
  DocumentService.query(function(response){
      $scope.docs=response
      $scope.loadDoc(0);
  });
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
  //TODO: this needsto be extracted from here
  socket.on('entity:create', function (data) {
      var entities = $scope.shared_document.entities;
      entities.push(data.obj);
      console.log(data.msg);
  });
  socket.on('entity:update', function (data) {
        var entities = $scope.shared_document.entities;
        var entity = AQ.find(entities, "_id", data.obj._id)
        console.log(entity);
        if (entity) {
          //TODO: this only updates position and title

          entities[entity].position = data.obj.position;
          entities[entity].title = data.obj.title;
          setTimeout(function(){jsPlumb.repaintEverything();},0);
        }
        console.log(data.msg);
    });
    socket.on('entity:delete', function (data) {
        var entities = $scope.shared_document.entities;
        var entity = AQ.find(entities, "_id", data.obj)
        if (entity) {
            jsPlumb.detachAllConnections($("#"+data.obj));
            entities.splice(entity,1);
        }
        console.log(data.msg);
    });
    socket.on('connection:create', function (data) {

        var c = AQ.findConnection($scope.shared_document.connections, data.obj);
        if (!c){
            $scope.shared_document.connections.push(data.obj);
            PlumbService.addPlumb(data.obj);
        }
        console.log(data.msg);

    });
    socket.on('connection:delete', function (data) {
    });
   //socket.on('chat', function (data) {
   //     console.log("on socket: "+data.msg);
   //});
  //shared-end



 
  $scope.addConnection = function() {
    if ($scope.selectedEntity && $scope.selectedEntity2) {
      var new_connection = {"from":$scope.selectedEntity._id, "to":$scope.selectedEntity2._id};
      $scope.shared_document.connections.push(new_connection)
      //TODO: only set up new ones
      //DocumentService.update($scope.shared_document)
       ConnectionService.save({_id: $scope.selectedEntity.document,"from":$scope.selectedEntity._id, "to":$scope.selectedEntity2._id });
       PlumbService.addPlumb(new_connection)
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
