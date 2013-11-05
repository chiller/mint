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
          //console.log(args)
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

app.factory('ConnectionService', ['$resource', function($resource){
    return $resource('/api/docs/:id/connections/', {id:'@_id'},
        { update: {method:'PUT' } ,
            query: {method:'GET', isArray: true}});
}]);

app.factory('ConnectionDeleteService', ['$resource', function($resource){
    return $resource('/api/docs/connections/delete/', {},
        { update: {method:'PUT' } ,
            query: {method:'GET', isArray: true}});
}]);

app.factory('AQ', function($rootScope){
    return {
       find: function(array, field, value) {
           for (var i=0;i<array.length;i++){
               if(array[i][field]==value) {
                   return i;
               }
           }
           return null;
    } , findConnection: function(array, connection){
            for (var i=0;i<array.length;i++){
                if(array[i]["from"]==connection.from && array[i]["to"]==connection.to) {
                    return i;
                }
            }
            return null;
        }
    }
});


app.factory('PlumbService',function ($rootScope, ConnectionDeleteService) {
  return {
    setUpPlumbWithScope: function ($scope) {



          
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
              label: t.label
            });   


         };   
        var deleteConnection = function(){
            var conn_object = connection.scope;
            $scope.shared_document.connections.splice($scope.shared_document.connections.indexOf(conn_object), 1);
            jsPlumb.detach(connection);
            $scope.$apply();
            //$scope.updateDocument();
            console.log(ConnectionDeleteService);
            ConnectionDeleteService.delete({_id: $scope.shared_document._id, from:conn_object.from, to:conn_object.to});
            //TODO: propagate changes
        }

        jsPlumb.bind('click', function (connection, e) {

            var idx = $scope.shared_document.connections.indexOf(connection.scope);
            $("path").each(function(){this.style.setProperty("stroke","#ffa500")})
            e.target.style.setProperty("stroke","#fc0")
            $scope.selectedConnection = $scope.shared_document.connections[idx];
            $scope.selectedConnection_obj = connection
            $scope.selectedEntity = null;
            $scope.$apply();
        }); 
    },
  addPlumb: function(connection) {
           var shapes = $(".draggable");
           jsPlumb.connect({
              scope: connection,
              curviness: 0,
              source:$("#"+connection.from.toString()),
              target:$("#"+connection.to.toString()),

            });   
  }
}},{$inject: ['ConnectionDeleteService']})

