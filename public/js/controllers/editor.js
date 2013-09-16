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

              source:shapes[t.from],  // just pass in the current node in the selector for source 
              target:shapes[t.to],
              // here we supply a different anchor for source and for target, and we get the element's "data-shape"
              // attribute to tell us what shape we should use, as well as, optionally, a rotation value.
              anchors:[
                [ "Perimeter", { shape:"Rectangle" }],
                [ "Perimeter", { shape:"Rectangle" }]
              ]
            });   


         };    
}

function EditorCtrl($scope, socket) {

    var entities = [
    {position: {'left':100, 'top':100 }, title:"alma"},
    {position: {'left':200, 'top':100 }, title:"korte"},
    {position: {'left':300, 'top':100 }, title:"birs"},
    {position: {'left':300, 'top':300 }, title:"citrom"},
    {position: {'left':400, 'top':200 }, title:"lime"},
    {position: {'left':400, 'top':300 }, title:"pari"},
  ]
  var connections = [
    {"from":1, "to":2},
  ]

  setTimeout(function(){
    setUpPlumbWithScope($scope);
  },1000)

  $scope.shared_document = {
    entities: entities,
    connections: connections
  }
  $scope.selectEntity = function(i) {
    if ($scope.selectedEntity != i) {
      $scope.selectedEntity2 = $scope.selectedEntity;
      $scope.selectedEntity = i; 
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

 

  $scope.addconn = function() {

    $scope.shared_document.connections.push({"from":$scope.confrom, "to":$scope.conto})
    console.log($scope.shared_document);
    setUpPlumbWithScope($scope);
    $scope.sendshared();
  }

  $scope.addEntity = function() {
    $scope.shared_document.entities.push({position: {'left':0, 'top':300 }, title:"untitled"})
  }
}
