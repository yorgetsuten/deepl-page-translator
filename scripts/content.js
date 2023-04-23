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
    if (!/^(\d+|[,.!@#$%^&*()\-_=+[\]{};':"\\|<>\/?\s]+)$/.test(walker.currentNode.textContent)) {
      proxyArray = [...proxyArray, walker.currentNode]
      translateArray = [...translateArray, walker.currentNode.textContent]
    }
  }

  chrome.runtime.sendMessage({ type: 'translate', translateArray })

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'translated') {
      message.translatedArray.forEach(({index, translatedText}) => {
        proxyArray[index].textContent = translatedText
      })
    }
  })
})()
