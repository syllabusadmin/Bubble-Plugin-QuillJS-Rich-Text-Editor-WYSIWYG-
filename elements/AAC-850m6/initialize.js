function(instance, context) {
  const BlockEmbed = Quill.import("blots/block/embed");
  instance.data.Delta = Quill.import("delta");

  // Generate a random number between 1 and 1,000,000 so the editor's ID is unique
  instance.data.randomId = `editor-${Math.floor(Math.random() * 1000000) + 1}`;
  instance.data.theInitialContent;
  instance.data.placeholder;
  instance.data.initialContent

  // Insert a div with the random ID
  instance.canvas.insertAdjacentHTML("beforeend", `<div id="${instance.data.randomId}"></div>`);

  // Remove the border from the div
  document.getElementById(`${instance.data.randomId}`).style.border = "none";

  // Initialize other variables
  instance.data.addedInitialContent = false;
  instance.data.isTyping = false;
  instance.data.typingTimeout;
  instance.data.quillContents;
  instance.data.handleQuillContentsChange;

  function handleBeforeUnload(event) {
    // check if the timeout exists
    if (instance.data.typingTimeout != null || navigator.onLine === false) {
      console.log(instance.data.typingTimeout)
      // prevent the page from unloading and display an alert
      event.preventDefault();
      event.returnValue = '';
    }
  }

  // add the beforeunload event listener
  window.addEventListener('beforeunload', handleBeforeUnload);

  //check to make sure there is no other element on page that has already defined our custom format
  if (!Quill.imports["formats/embedResponsive"]) {

    //creates embeddedable content using insertEmbed
    class EmbedResponsive extends BlockEmbed {
      static blotName = "embedResponsive";
      static tagName = "DIV";
      static className = "embedResponsive";

      static create(value) {
        let { url, height, width } = value
        const node = super.create(value);

        node.contentEditable = false;
        node.style.display = "flex";
        node.style.flexDirection = `column`

        //create iframe and horizontal arrow container
        const iFrameContainer = document.createElement("div");
        iFrameContainer.style.display = "flex";
        iFrameContainer.style.width = "fit-content"
        iFrameContainer.style.margin = "auto"
        iFrameContainer.style.gap = "10px"

        //create Iframe
        const iFrame = document.createElement("iframe");
        iFrame.setAttribute('frameborder', '0');
        iFrame.setAttribute('url', this.sanitize(url));
        iFrame.style.display = "block";
        iFrame.style.margin = "auto";
        iFrame.style.marginBottom = "10px"
        iFrame.setAttribute('src', this.sanitize(url));
        iFrame.setAttribute(`height`, height)
        iFrame.setAttribute(`width`, width)
        iFrame.classList.add("embedResponsive-item");
        node.appendChild(iFrameContainer);
        iFrameContainer.appendChild(iFrame);

        //create horizontal resizers
        const horizontalResizerContainer = document.createElement("div");
        horizontalResizerContainer.style.display = `flex`;
        horizontalResizerContainer.style.flexDirection = "column";
        horizontalResizerContainer.style.gap = "10px";
        horizontalResizerContainer.style.margin = "auto"

        const horizontalShrinkButton = document.createElement("button");
        horizontalShrinkButton.style.width = "22px";
        horizontalShrinkButton.style.padding = `0px`
        horizontalShrinkButton.style.margin = "auto";
        horizontalShrinkButton.style.background = `none`
        horizontalShrinkButton.style.border = `none`
        horizontalShrinkButton.style.cursor = `pointer`

        horizontalShrinkButton.insertAdjacentHTML(`beforeend`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --><path d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"/></svg>`)

        horizontalShrinkButton.addEventListener(`pointerdown`, e => {
          if (e.button === 0) {
            if (width > 450) {
              width -= 200;
              iFrame.setAttribute('width', width);
            }
            // Hide the horizontalShrinkButton when the width is below 300px.
            if (width <= 450) {
              horizontalShrinkButton.style.display = 'none';
            }
          }
        })

        const horizontalGrowButton = document.createElement("button");

        horizontalGrowButton.style.width = "22px";
        horizontalGrowButton.style.padding = `0px`
        horizontalGrowButton.style.margin = "auto";
        horizontalGrowButton.style.background = `none`
        horizontalGrowButton.style.border = `none`
        horizontalGrowButton.style.cursor = `pointer`

        horizontalGrowButton.insertAdjacentHTML(`beforeend`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --><path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/></svg>`)

        horizontalGrowButton.addEventListener(`pointerdown`, e => {
          if (e.button === 0) {
            width = width + 200
            iFrame.setAttribute(`width`, width)
            horizontalShrinkButton.style.display = 'block';
          }

        })

        horizontalResizerContainer.appendChild(horizontalGrowButton)
        horizontalResizerContainer.appendChild(horizontalShrinkButton)
        iFrameContainer.appendChild(horizontalResizerContainer)


        //create vertical resizers
        const verticalResizerContainer = document.createElement("div");
        const arrowDownButton = document.createElement("button");
        const arrowUpButton = document.createElement("button");

        verticalResizerContainer.style.display = `flex`
        verticalResizerContainer.style.justifyContent = `center`
        verticalResizerContainer.style.marginRight = `75px`
        verticalResizerContainer.style.width = `fit-content`
        verticalResizerContainer.style.gap = `10px`
        verticalResizerContainer.style.alignSelf = `center`
        verticalResizerContainer.style.cursor = `pointer`

        //shrink vertical button   
        arrowDownButton.style.width = "30px";
        arrowDownButton.style.padding = `0px`
        arrowDownButton.style.margin = "auto";
        arrowDownButton.style.background = `none`
        arrowDownButton.style.border = `none`
        arrowDownButton.style.cursor = `pointer`
        arrowDownButton.insertAdjacentHTML(`beforeend`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --><path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"/></svg>`)

        //grow vertical button
        arrowUpButton.style.width = "30px";
        arrowUpButton.style.padding = '0px'
        arrowUpButton.style.margin = "auto";
        arrowUpButton.style.border = `none`
        arrowUpButton.style.background = `none`
        arrowUpButton.style.cursor = `pointer`
        arrowUpButton.insertAdjacentHTML(`beforeend`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --><path d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"/></svg>`)

        arrowDownButton.addEventListener(`pointerdown`, e => {
          if (e.button === 0) {
            height += 250;
            iFrame.setAttribute('height', height);
            if (height >= 500) {
              arrowUpButton.style.display = 'block';
            }
          }
        })

        arrowUpButton.addEventListener(`pointerdown`, e => {
          if (e.button === 0) {
            if (height > 500) {
              height -= 250;
              iFrame.setAttribute(`height`, height);
            }
            if (height <= 500) {
              arrowUpButton.style.display = 'none';
            }
          }
        });

        //set the intial state of of the buttons based on the size of the iframe. They should be hidden if the iframe is at its minimum size
        if (iFrame.getAttribute(`width`) <= 450) {
          horizontalShrinkButton.style.display = 'none';
        }
        if (iFrame.getAttribute(`height`) <= 500) {
          arrowUpButton.style.display = 'none';
        }

        //add the resizers to the core node
        verticalResizerContainer.appendChild(arrowDownButton)
        verticalResizerContainer.appendChild(arrowUpButton)
        node.appendChild(verticalResizerContainer)
        return node;
      }

      static sanitize(url) {
        return url;
      }

      // CREATE THE VALUES THAT ARE RETURNED TO THE OBJECT
      static value(domNode) {
        let iFrameHeight = domNode.firstChild.firstChild.getAttribute(`height`)
        let iFrameWidth = domNode.firstChild.firstChild.getAttribute(`width`)
        let iFrameURL = domNode.firstChild.firstChild.getAttribute(`src`)
        return { url: iFrameURL, height: parseInt(iFrameHeight, 10), width: parseInt(iFrameWidth, 10) }
      }
    }

    Quill.register(EmbedResponsive);

  }

  instance.data.quill = new Quill(`#${instance.data.randomId}`, {
    modules: {
      toolbar: [
        [{ font: [] }, { size: [] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ script: 'super' }, { script: 'sub' }],
        [{ header: '1' }, { header: '2' }, 'blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['direction', { align: [] }],
        ['link', 'video'],
        ['clean']
      ]
    },
    theme: 'snow',
    bounds: instance.canvas,
    debug: 'warn'
  });

  instance.data.quill.on('editor-change', (eventName, ...args) => {
    if (eventName === 'text-change') {
      // If the text has changed, set a timeout to handle the change for performance
      instance.data.handleStopTyping();
    } else if (eventName === 'selection-change') {
      // Handle selection change

    }
  });

  instance.data.quill.root.addEventListener(`focus`, e => {
    instance.publishState(`focused`, true)
  })
  instance.data.quill.root.addEventListener(`blur`, e => {

    instance.publishState(`focused`, false)
  })

  instance.data.handleStopTyping = () => {
    // Clear the timeout and set a new one to handle the typing change
    clearTimeout(instance.data.typingTimeout);
    instance.data.typingTimeout = setTimeout(instance.data.handleTypingChange, 250);
  }

  instance.data.handleTypingChange = () => {
    // When the typing has stopped, trigger the "stopped_typing" event and update the Quill contents
    instance.triggerEvent('stopped_typing');
    instance.data.typingTimeout = null
    instance.data.quillContents = JSON.stringify(instance.data.quill.getContents())
    instance.publishState('delta', instance.data.quillContents);
    instance.publishState('html', instance.data.quill.root.innerHTML);
    instance.publishAutobinding(instance.data.quillContents)
  }

  instance.canvas.addEventListener('keyup', instance.data.handleStopTyping);
  instance.data.handleQuillContentsChange = (autoBindingValue) => {
    // When the Quill contents change, update the Quill editor
    if (autoBindingValue !== instance.data.quillContents) instance.data.quill.setContents(JSON.parse(autoBindingValue));

  }
}