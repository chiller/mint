'use strict';

/* Services */

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


