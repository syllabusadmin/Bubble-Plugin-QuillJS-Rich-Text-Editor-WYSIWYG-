function(instance, properties, context) {
    
    
  // Get the current cursor index
  let index = instance.data.quill?.getSelection()?.index || instance.data.quill.getLength();
	
  
  
  // Insert the embed at the current index
  instance.data.quill.insertEmbed(index, "embedResponsive", {
    url: properties.URL,
    height: properties.height,
    width: properties.width
  });

  // Add a new line after the embed
  instance.data.quill.insertText(instance.data.quill.getLength(), "\n");
  instance.data.quill.insertText(instance.data.quill.getLength(), "\n");
}
