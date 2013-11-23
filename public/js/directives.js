'use strict';

/* Directives */


var ntmodule = angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };

  }])


 ntmodule.directive('ntDraggable', function($timeout) {

  return {
    template: "<div class='draggable' style='\
            top:{{entity.position.top}}px;\
    		left:{{entity.position.left}}px' \
        ng-class='{selected1 : entity==selectedEntity, selected2 : entity==selectedEntity2 }'\
        ng-click='selectEntity($index, $event)'\
        id={{entity._id}}>\
        <div class='entity_title'>{{entity.title}}</div>\
        <div class='entity_mark' style='background-color:#{{entity.mark}};'></div>\
        </div>",
    replace: true,
    link: function(scope, elm, attrs) {
      /*
      $(elm).draggable({
      	containment: ".container",
      	//use this for performance optimisation
      	grid: [5,5],
      	drag: 
      	function( event, ui ) {
      		jsPlumb.repaintEverything();
        }
      	,
      	stop:
      	function( event, ui ) {
      		//TODO: move this code to controller
          scope.shared_document.entities[scope.$index].position = ui.position 
      		//scope.sendshared();
            scope.$apply()
            jsPlumb.repaintEverything();
            scope.updateEntity(scope.$index);
        }});
      */
      jsPlumb.draggable(elm,
          {containment: ".container",
           stop: function( event, ui ) {
            scope.shared_document.entities[scope.$index].position = ui.position
            scope.$apply()
            scope.updateEntity(scope.$index);
        }} );

      jsPlumb.makeSource(elm.children()[0], {

            isSource:true
      });

        jsPlumb.makeTarget(elm.children()[0], {
        });



    }
  };
});
//angular.element(".container").scope()
ntmodule.directive('saveSelected', function(EntityService){
    return {
      link:function(scope, elm, attrs) {
        $(elm).blur(function(){
          EntityService.update(scope.selectedEntity)
        });    
      }
    };  
})


ntmodule.directive('saveSelectedCon', function(DocumentService){
    return {
        link:function(scope, elm, attrs) {
            $(elm).blur(function(){
                DocumentService.update(scope.shared_document)
                var cons = jsPlumb.getAllConnections();
                for(var i = 0; i< cons.length; i++) {
                    var con = cons[i];
                    if(con.scope.to == scope.selectedConnection.to && con.scope.from == scope.selectedConnection.from){
                       con.setLabel(scope.selectedConnection.label)
                   }
                }
            });
        }
    };
})


ntmodule.directive('saveSelectedTmp', function(DocumentService){
    return {
        link:function(scope, elm, attrs) {
            $(elm).blur(function(){
                DocumentService.update(scope.shared_document)

            });
        }
    };
})


ntmodule.directive('ntDelete', function(ConnectionDeleteService){
    return {
        link: function($scope, elm, attrs){
            console.log("ntDelete")
            angular.element(document).on("keydown", function(event){
                var doPrevent = false;
                if (event.keyCode === 8 || event.keyCode === 69) {
                    var d = event.srcElement || event.target;
                    if ((d.tagName.toUpperCase() === 'INPUT' && (d.type.toUpperCase() === 'TEXT' || d.type.toUpperCase() === 'PASSWORD' || d.type.toUpperCase() === 'FILE'))
                        || d.tagName.toUpperCase() === 'TEXTAREA') {
                        doPrevent = d.readOnly || d.disabled;
                    }
                    else {
                        doPrevent = true;
                    }
                }
                if (doPrevent) {
                    event.preventDefault();
                    if (event.keyCode === 8) {
                        if($scope.selectedEntity){
                            $scope.deleteEntity()
                        } else if($scope.selectedConnection){
                            var connection = $scope.selectedConnection_obj
                            var conn_object = $scope.selectedConnection_obj.scope;
                            $scope.shared_document.connections.splice($scope.shared_document.connections.indexOf(conn_object), 1);
                            jsPlumb.detach(connection);
                            $scope.$apply();
                            ConnectionDeleteService.delete({_id: $scope.shared_document._id, from:conn_object.from, to:conn_object.to});


                        }
                    } else if (event.keyCode === 69) {
                        $scope.addEntity();
                    }
                    return false
                }
            })
        }
    }
})