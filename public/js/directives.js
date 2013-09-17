'use strict';

/* Directives */


var ntmodule = angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };

  }])

 ntmodule.directive('ntDraggable', function() {

  return {
    template: "<div class='draggable' style='top:{{entity.position.top}}px;\
    		left:{{entity.position.left}}px' \
        ng-class='{selected1 : entity==selectedEntity, selected2 : entity==selectedEntity2 }'\
        ng-click='selectEntity($index, $event)'\
        id={{entity.id}}>\
        {{entity.title}}</div>",
    link: function(scope, elm, attrs) {
      $(elm.children()[0]).draggable({
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
      		scope.shared_document.entities[scope.$index].position = ui.position 
      		scope.sendshared();
            scope.$apply()
            jsPlumb.repaintEverything();
        }});
    }
  };
});
//angular.element(".container").scope()
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

