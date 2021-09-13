const urlConfig = require('../configs/');

window.addEventListener("message", (e) => {
    let iframeContainer = document.getElementById("companion-chatbot");
    iframeContainer.style.height = e.data.height;
    iframeContainer.style.width = e.data.width;
});

let iframeContainer = document.createElement("div");
iframeContainer.id = "companion-chatbot";

// Styles
iframeContainer.style.border = "0px none";
iframeContainer.style.backgroundColor = " transparent";
iframeContainer.style.pointerEvents = " none";
iframeContainer.style.zIndex = " 2147483639";
iframeContainer.style.position = " fixed";
iframeContainer.style.bottom = " 0px";
iframeContainer.style.width = " 100px";
iframeContainer.style.height = " 100px";
iframeContainer.style.overflow = " hidden";
iframeContainer.style.display = " grid";
iframeContainer.style.placeItems = " center";
iframeContainer.style.opacity = " 1";
iframeContainer.style.maxWidth = " 100%";
iframeContainer.style.right = " 0px";
iframeContainer.style.maxHeight = " 100%";

// Add iframe to IFrame Container
let iframe = document.createElement("iframe");
iframe.allowtransparency = "true";

console.log(chatbotId)

iframe.src = `http://${urlConfig.URL}/${chatbotId}`;
//styles

iframe.style.pointerEvents = "all";
iframe.style.background = "transparent";
iframe.style.border = "0px none";
iframe.style.float = "none";
iframe.style.width = "100%";
iframe.style.height = "100%";
iframe.style.margin = "0px";
iframe.style.padding = "0px";
iframe.style.minHeight = "0px";

iframeContainer.appendChild(iframe);

let script = document.getElementById("chatbot-script");
script.parentNode.insertBefore(iframeContainer, script);

