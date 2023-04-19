chrome.action.onClicked.addListener(async (contentTab) => {
  executeScript(contentTab.id, './scripts/content.js')
  executeScript((await getTranslatorTabId()), './scripts/translate.js')
})

chrome.runtime.onMessage.addListener((message) => {
  chrome.tabs.sendMessage(forwardTo(message.type), message)
})



let contentTabId
let translatorTabId

async function getTranslatorTabId() {
  const tabs = await chrome.tabs.query({ url: '*://www.deepl.com/translator*' })

  if (tabs.length === 0) {
    return (await
      chrome.tabs.create({ url: 'https://www.deepl.com/translator', active: false })
    ).id
  } else {
    return tabs[0].id
  }
}

function executeScript(tabId, script) {
  chrome.scripting.executeScript({
    target: {tabId},
    files: [script]
  })

  if (script === './scripts/content.js') {
    contentTabId = tabId
  } else if (script === './scripts/translate.js') {
    translatorTabId = tabId
  }
}

function forwardTo(type) {
  if (type === 'translate') {
    return translatorTabId
  } else if (type === 'translated') {
    return contentTabId
  }
}
