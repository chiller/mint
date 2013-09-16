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
    		left:{{entity.position.left}}px'>{{entity.title}}</div>",
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




