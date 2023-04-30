let proxyArray
let translateArray

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'walk') {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      (node) => {
        if (
          node.parentElement.nodeName === 'SCRIPT' ||
          node.parentElement.nodeName === 'STYLE' ||
          node.parentElement.nodeName === 'CODE' ||
          /^(\d+|[,.!@#$%^&*()\-_=+[\]{};':"\\|<>\/?\s]+)$/
            .test(node.textContent)
        ) 
          return NodeFilter.FILTER_REJECT
        else 
          return NodeFilter.FILTER_ACCEPT
      },
      false
    )

    proxyArray = []
    translateArray = []
  
    while (walker.nextNode()) {
      proxyArray = [...proxyArray, walker.currentNode]
      translateArray = [...translateArray, walker.currentNode.textContent]
    }
  
    chrome.runtime.sendMessage({ type: 'translate', translateArray })
  } else if (message.type === 'translated') {
    message.translatedArray.forEach(({ index, translatedText }) => {
      proxyArray[index].textContent = translatedText
    })
  }
})
