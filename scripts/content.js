(() => {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    (node) => {
      if (
        node.parentElement.nodeName === 'SCRIPT' ||
        node.parentElement.nodeName === 'STYLE' ||
        node.parentElement.nodeName === 'CODE'
      ) {
        return NodeFilter.FILTER_REJECT
      } else {
        return NodeFilter.FILTER_ACCEPT
      }
    },
    false
  )

  let proxyArray = []
  let translateArray = []

  while (walker.nextNode()) {
    if (!/^[,.!@#$%^&*()\-_=+[\]{};':"\\|,.<>\/?\s]*$/.test(walker.currentNode.textContent)) {
      proxyArray = [...proxyArray, walker.currentNode]
      translateArray = [...translateArray, { 
        textToTranslate: walker.currentNode.textContent
      }]
    }
  }

  chrome.runtime.sendMessage({
    type: 'translate',
    translateArray: translateArray
      .map((el, index) => {return {...el, index}})
      .sort((a, b) => b.textToTranslate.length - a.textToTranslate.length)
  })

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type = 'translated') {
      message.translatedArray.forEach(({ translatedText, index }) => {
        proxyArray[index].textContent = translatedText
      })
    }
  })
})()
