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
    template: "<div class='draggable' style='top:{{entity.position.top}}px;\
    		left:{{entity.position.left}}px' \
        ng-class='{selected1 : entity==selectedEntity, selected2 : entity==selectedEntity2 }'\
        ng-click='selectEntity($index, $event)'\
        id={{entity._id}}>\
        <div class='entity_title'>{{entity.title}}</div></div>",
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
            //anchor:sourceAnchors,		// you could supply this if you want, but it was set in the defaults above.
            filter:function(evt, el) {
                var t = evt.target || evt.srcElement;
                return t.tagName !== "A";
            },
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

ntmodule.directive('onKeyupFn', function() {
    return function(scope, elm, attrs) {
        //Evaluate the variable that was passed
        //In this case we're just passing a variable that points
        //to a function we'll call each keyup
        var keyupFn = scope.$eval(attrs.onKeyupFn);
        angular.element(document).bind('keyup', function(evt) {
            //$apply makes sure that angular knows 
            //we're changing something
            scope.$apply(function() {
                keyupFn.call(scope, evt.which);
            });

        });
    };
});

