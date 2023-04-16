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
    if (/^\s*\S+/.test(walker.currentNode.textContent)) {
      proxyArray = [...proxyArray, walker.currentNode]
      translateArray = [...translateArray, walker.currentNode.textContent]
    }
  }

  chrome.runtime.sendMessage({
    type: 'translate', 
    translateArray: translateArray.sort((a, b) => b.length - a.length)
  })

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type = 'translated') {
      for (let i = message.index - message.translatedArray.length - 1; i < message.index; i++) {
        proxyArray[i].textContent = translated
      }

      // for (let i = message.index - message.translatedArray.length - 1; i < message.index; i++) {
      //   proxyArray[i].textContent = translated
      // }
    }
  })
})()
