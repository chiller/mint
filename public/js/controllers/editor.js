'use strict';

/* Controllers */
function setUpPlumbWithScope($scope) {
        jsPlumb.importDefaults({
          Connector:"StateMachine",
          PaintStyle:{ lineWidth:3, strokeStyle:"#ffa500" },
          Endpoint:[ "Dot", { radius:5 } ],
          EndpointStyle:{ fillStyle:"#ffa500" }
        });
          
        var shapes = $(".draggable");
       
        
        // loop through them and connect each one to each other one.
        for (var i = $scope.shared_document.connections.length - 1; i >= 0; i--) {
          
          var t = $scope.shared_document.connections[i]
           jsPlumb.connect({
              scope: t,
              source:$("#"+t.from.toString()), 
              target:$("#"+t.to.toString()),
              // here we supply a different anchor for source and for target, and we get the element's "data-shape"
              // attribute to tell us what shape we should use, as well as, optionally, a rotation value.
              anchors:[
                [ "Perimeter", { shape:"Rectangle" }],
                [ "Perimeter", { shape:"Rectangle" }]
              ]
            });   


         };   
        jsPlumb.bind('click', function (connection, e) {
          var conn_object = connection.scope;
          $scope.shared_document.connections.splice($scope.shared_document.connections.indexOf(conn_object), 1);
          jsPlumb.detach(connection);
          $scope.$apply();
          //TODO: propagate changes
        }); 
}

function EditorCtrl($scope, socket, EntityService) {

  EntityService.query(function(response){
    var entities = response;
    var connections = [
      {id: 1, 
        from:"5239bc6dd72e4bb612def3fc", 
        to:"5239c042d72e4bb612def3fd"},
    ]
    $scope.shared_document = {
      entities: entities,
      connections: connections
    }
    setTimeout(function(){
      setUpPlumbWithScope($scope);
    },1000)
  });

  
  $scope.selectEntity = function(i) {
    if ($scope.selectedEntity != $scope.shared_document.entities[i]) {
      $scope.selectedEntity2 = $scope.selectedEntity;
      $scope.selectedEntity = $scope.shared_document.entities[i]; 
    }
  }
  
  //shared
  socket.on('shared:update', function (data) {
    $scope.shared_document = data.shared_document
    setUpPlumbWithScope($scope);
    setTimeout(function(){jsPlumb.repaintEverything()}, 0);
  });
  //shared-end

    $scope.sendshared = function () {
    socket.emit('shared:update', {
      shared_document : $scope.shared_document
    });
  };

  $scope.addPlumb = function(connection) {
           var shapes = $(".draggable");
           jsPlumb.connect({
              source:$("#"+connection.from.toString()), 
              target:$("#"+connection.to.toString()),
              anchors:[
                [ "Perimeter", { shape:"Rectangle" }],
                [ "Perimeter", { shape:"Rectangle" }]
              ]
            });   
  }
 
  $scope.addConnection = function() {
    if ($scope.selectedEntity && $scope.selectedEntity2) {
      var new_connection = {"from":$scope.selectedEntity.id, "to":$scope.selectedEntity2.id};
      $scope.shared_document.connections.push(new_connection)
      //TODO: only set up new ones
      $scope.addPlumb(new_connection)
      $scope.sendshared();
    }
  }

  $scope.addEntity = function() {
    $scope.shared_document.entities.push({position: {'left':0, 'top':300 }, title:"untitled"})
  }

  $scope.deleteEntity = function(keyc) {
    
    if (keyc!=46) {return;}

    if ($scope.selectedEntity) {
      jsPlumb.detachAllConnections($("#"+$scope.selectedEntity.id.toString()));
      $scope.shared_document.entities.splice($scope.shared_document.entities.indexOf($scope.selectedEntity),1)  
      $scope.selectedEntity = null;
      
    }
    
  }
}
