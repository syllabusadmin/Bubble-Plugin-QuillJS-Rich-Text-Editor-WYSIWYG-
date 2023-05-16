function(instance, properties, context) {
    
    

  //set intial delta content state
    if (!instance.data.initialContent){
        instance.publishState(`initial_delta_content`, properties.initial_content)
    }
    
    
  // Update the placeholder if it has changed
	if (instance.data.quill.root.dataset.placeholder != properties.placeholder) {
    	instance.data.placeholder = properties.placeholder ?? ""
    	instance.data.quill.root.dataset.placeholder = instance.data.placeholder
  	}
    
   
  // Handle changes to the Quill editor contents if autobinding is enabled
  // Possibly a bug with properties.autobinding. This is available even if the user turns off the feature.
 
    if(properties.autobinding){

        instance.data.handleQuillContentsChange(properties.autobinding)
    }
  // Handle changes to the Quill editor contents if intial content is set
    if(properties.initial_content){

        instance.data.handleQuillContentsChange(properties.initial_content)
    }
    
    if(!properties.autobinding && !properties.initial_content){

        instance.data.handleQuillContentsChange(JSON.stringify({"ops":[{"insert":"\n"}]}))
    }
    
    
    
	
}
