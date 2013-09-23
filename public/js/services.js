'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
app.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

app.factory('DocumentService', ['$resource', function($resource){
  return $resource('/api/docs/:id', {id:'@_id'}, 
    { update: {method:'PUT' } , 
      query: {method:'GET', isArray: true}});
}]);

app.factory('EntityService', ['$resource', function($resource){
  return $resource('/api/entities/:id', {id:'@_id'}, 
    { update: {method:'PUT' } , 
      query: {method:'GET', isArray: true}});
}]);

app.factory('PlumbService', function ($rootScope) {
  return {
    setUpPlumbWithScope: function ($scope) {
        jsPlumb.importDefaults({
          Connector:"StateMachine",
          PaintStyle:{ lineWidth:3, strokeStyle:"#ffa500" },
          Endpoint:[ "Dot", { radius:5 } ],
          EndpointStyle:{ fillStyle:"#ffa500" }
        });
          
        var shapes = $(".draggable");
        jsPlumb.detachEveryConnection();
        
        // loop through them and connect each one to each other one.
        for (var i = $scope.shared_document.connections.length - 1; i >= 0; i--) {
          
          var t = $scope.shared_document.connections[i]
          if ($("#"+t.from.toString()).length == 0 || $("#"+t.to.toString()).length == 0) {
            //TODO: rethink this
            console.log("STALE CONNECTION")
            $scope.shared_document.connections.splice(i, 1)
            $scope.updateDocument();
            continue
          }
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
          $scope.updateDocument();
          //TODO: propagate changes
        }); 
    },
  addPlumb: function(connection) {
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
}})
