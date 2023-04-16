chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['./scripts/content.js']
  })

  function executeTranslateScript(tabId) {
    chrome.scripting.executeScript({
      target: { tabId },
      files: ['./scripts/translate.js']
    })
    console.log('executeTranslateScript')
  }

  chrome.tabs.query({ url: '*://www.deepl.com/translator/*' })
    .then(async (tabs) => {
      if (tabs.length > 0) {
        executeTranslateScript(tabs[0].id)
      } else {
        executeTranslateScript(
          (await chrome.tabs.create({ url: 'https://www.deepl.com/translator', active: false })).id
        )
      }
    })
})

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'translate') {
    const { arrayToTranslate } = message
    chrome.runtime.sendMessage({ type: 'translate', arrayToTranslate })
  } else if (message.type === 'translated') {
    const { translatedArray, index } = message
    chrome.runtime.sendMessage({ type: 'translated', translatedArray, index })
    // chrome.tabs.query({ url: '*://www.deepl.com/translator/*' })
    //   .then(([tab]) => {
    //     chrome.tabs.sendMessage(tab.id, { type: 'translated', translatedArray, index })
    //   })
  }
})
