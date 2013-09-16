'use strict';

/* Directives */


var ntmodule = angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };

  }])

 ntmodule.directive('ntdraggable', function() {

  return {
    link: function(scope, elm, attrs) {
      //var options = scope.$eval(attrs.andyDraggable); //allow options to be passed in
      //debugger
      jsPlumb.draggable($(elm),{stop:
      	function( event, ui ) {
      		console.log(scope.$index)
      		scope.seeds[scope.$index].text = "Lajos"
      		scope.$apply()
            
        }});
    }
  };
});

 ntmodule.directive('andyDraggable', function() {

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




