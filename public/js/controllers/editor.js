'use strict';

/* Controllers */


function EditorCtrl($scope, $timeout, socket, DocumentService, EntityService,PlumbService,ConnectionService, AQ, $http) {

    $scope.showcode = false;
    $scope.togglecode = function() {
        $scope.showcode = !$scope.showcode;
    }

    $scope.marks = {};

    jsPlumb.importDefaults({
        Connector:["StateMachine",{ curviness:1 } ],
        PaintStyle:{ lineWidth:4, strokeStyle:"#52A529" },
        Endpoint:[ "Dot", { radius:1 } ],
        EndpointStyle:{ fillStyle:"#52A529" }   ,
        Anchor: "Continuous",
        Overlays : [
        [ "Arrow", {
            location:1,
            id:"arrow",
            foldback:0.8
            foldback:1
        } ]
        ]

    });

  jsPlumb.bind("beforeDrop", function(i,c) {

      var new_connection = {
      from: $("#"+i.sourceId).parent().attr('id'),
      to: $("#"+i.targetId).parent().attr('id')
        }
      console.log(i)
      $scope.shared_document.connections.push(new_connection)
      ConnectionService.save({_id: $scope.shared_document._id,"from":new_connection.from, "to":new_connection.to });
      PlumbService.addPlumb(new_connection)

      return false;
  })
  DocumentService.query(function(response){
      $scope.docs=response
      $scope.loadDoc(0);
  });
  $scope.init = function(id){
    DocumentService.get({id:id}, function(response){
        $scope.compile_result = " ";
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
    $scope.documentHash = []
    $scope.HASHARRAYLENGTH = 4
    $scope.selectedDocIndex = idx;
    $scope.init($scope.docs[idx]._id);
    socket.emit("room:change", {id: $scope.docs[idx]._id});
  }


  
  $scope.selectEntity = function(i) {
    $scope.selectedConnection = null;
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
        if (entity!=null) {
          entities[entity].position = data.obj.position;
          entities[entity].title = data.obj.title;
          setTimeout(function(){jsPlumb.repaintEverything();},0);
        }

    });
    socket.on('entity:delete', function (data) {
        var entities = $scope.shared_document.entities;
        var entity = AQ.find(entities, "_id", data.obj)
        console.log("*")
        if (entity!=null) {
            //debugger
            console.log("deleting"+entity.toString())
            jsPlumb.detachAllConnections($("#"+data.obj));
            entities.splice(entity,1);
        }
        console.log(data.msg);
    });
    socket.on('connection:create', function (data) {


        console.log("connection:create")
        var c = AQ.findConnection($scope.shared_document.connections, data.obj);
        if (c==null){
            $scope.shared_document.connections.push(data.obj);
            PlumbService.addPlumb(data.obj);
        }
        console.log(data.msg);

    });
    socket.on('connection:delete', function (data) {
        //TODO: optimise this
        var cons = jsPlumb.getAllConnections();
        for(var i = 0;i<cons.length;i++){
            if(cons[i].scope.from == data.obj.from && cons[i].scope.to == data.obj.to )
            {
                jsPlumb.detach(cons[i]);
                var c = AQ.findConnection($scope.shared_document.connections, data.obj);
                if (c!=null){
                    $scope.shared_document.connections.splice(c, 1);
                }
            }
        }
    });
   socket.on('chat', function (data) {
        console.log("chat: "+data.msg);
   });

    $scope.arrdiff = function (a1, a2)
    {
        var a=[], diff=[];
        for(var i=0;i<a1.length;i++)
            a[a1[i]]=true;
        for(var i=0;i<a2.length;i++)
            if(a[a2[i]]) delete a[a2[i]];
            else a[a2[i]]=true;
        for(var k in a)
            diff.push(k);
        return diff;
    }

    socket.on('sync', function (data) {

        console.log("sync: "+$scope.arrdiff(data.sync, $scope.documentHash));
        if($scope.arrdiff(data.sync, $scope.documentHash).length && $scope.documentHash.length == $scope.HASHARRAYLENGTH){
            $scope.conflict = true;
        }  else {
            $scope.conflict = false;
        }
    });
   $scope.sendChat = function(){
       socket.emit("chat", { "msg": $scope.message} , function(result){
           console.log(result)
       })
   }
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
    EntityService.save({position: {'left':300, 'top':300 }, title:"*", document: $scope.shared_document._id}, function(res){
    })
    
  }
  $scope.updateEntity = function(idx) {
    EntityService.update($scope.shared_document.entities[idx], function(){
            //console.log("success");
        })
  }
  $scope.deleteEntity = function() {

    if ($scope.selectedEntity) {
      jsPlumb.detachAllConnections($("#"+$scope.selectedEntity._id.toString()));
      var idx = $scope.shared_document.entities.indexOf($scope.selectedEntity);
      EntityService.delete({id: $scope.selectedEntity._id, document: $scope.selectedEntity.document}, function(){
        $scope.selectedEntity = null;
        //$scope.shared_document.entities.splice(idx,1)
      })
      
      
    }
    
  }

  $scope.compile = function(){
      $http.get('/api/compile/'+$scope.shared_document._id).
          success(function(data, status, headers, config) {

              $scope.compile_result = data.toString();
          })

  }

  $scope.$watch('shared_document.entities', function (newVal) {
      var entities = []
      if ($scope.shared_document){
          $scope.inactive = false;
          angular.forEach($scope.shared_document.entities, function(e){
            entities.push({
                _id: e._id,
                position: e.position,
                title: e.title
            })
          })
          entities.sort(function (a, b) {
              if (a._id > b._id)
                  return 1;
              if (a._id < b._id)
                  return -1;
              // a must be equal to b
              return 0;
          });
          $scope.documentHash.push(MD5(JSON.stringify(entities)).substring(0,6))
          if($scope.documentHash.length > $scope.HASHARRAYLENGTH){
              $scope.documentHash.shift();
          }
      }
  }, true);

  $scope.inactive = false;
  $scope.lastnow = new Date().getTime();
  $scope.check_put_comment_frequency = function(){
      var DELAY_MILISECONDS = 8000
      $scope.now = new Date().getTime()
      if ($scope.now > $scope.lastnow + DELAY_MILISECONDS){
          $scope.inactive = true
          socket.emit("sync",{"sync": $scope.documentHash}, function(result){

          })
      } else {
          $timeout($scope.check_put_comment_frequency, DELAY_MILISECONDS);
      }

  }
  $scope.$watch("inactive",function(newval){
     $scope.inactive = newval;
     $scope.lastnow = new Date().getTime();
     $scope.check_put_comment_frequency();
  })
}
