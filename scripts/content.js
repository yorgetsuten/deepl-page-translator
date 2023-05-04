let proxyArray = []
let translateArray = []
let translatedArray = []

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
  
    while (walker.nextNode()) {
      proxyArray = [...proxyArray, walker.currentNode]
      translateArray = [...translateArray, walker.currentNode.textContent]
    }
  
    chrome.runtime.sendMessage({ type: 'translate', translateArray })
  } else if (message.type === 'untranslate') {
    if (proxyArray[0].textContent === translatedArray[0]) {
      translateArray.forEach((untranslatedText, index) => {
        proxyArray[index].textContent = untranslatedText
      })
    } else {
      translatedArray.forEach((translatedText, index) => {
        proxyArray[index].textContent = translatedText
      })
    }
  } else if (message.type === 'translated') {
    message.translatedArray.forEach(({ translatedText, index }) => {
      proxyArray[index].textContent = translatedText
      translatedArray = [...translatedArray, translatedText]
    })
  }
})
