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

function EditorCtrl($scope, socket) {

    var entities = [
    {id: 1, position: {'left':100, 'top':100 }, title:"alma"},
    {id: 2, position: {'left':200, 'top':100 }, title:"korte"},
    {id: 3, position: {'left':300, 'top':100 }, title:"birs"},
    {id: 4, position: {'left':300, 'top':300 }, title:"citrom"},
    {id: 5, position: {'left':400, 'top':200 }, title:"lime"},
    {id: 6, position: {'left':400, 'top':300 }, title:"pari"},
  ]
  var connections = [
    {id: 1, "from":1, "to":2},
  ]

  setTimeout(function(){
    setUpPlumbWithScope($scope);
  },1000)

  $scope.shared_document = {
    entities: entities,
    connections: connections
  }
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
    
    if (keyc!=68) {return;}

    if ($scope.selectedEntity) {
      jsPlumb.detachAllConnections($("#"+$scope.selectedEntity.id.toString()));
      $scope.shared_document.entities.splice($scope.shared_document.entities.indexOf($scope.selectedEntity),1)  
      $scope.selectedEntity = null;
      
    }
    
  }
}
