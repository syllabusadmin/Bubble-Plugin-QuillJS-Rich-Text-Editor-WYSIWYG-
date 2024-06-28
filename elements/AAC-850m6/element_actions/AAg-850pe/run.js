function(instance, properties, context) {

var container = instance.canvas;
var elements = container.querySelectorAll('.ql-container');
  elements.forEach(function(element) {
    element.style.height =  properties.height+'%';
  });

}