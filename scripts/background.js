let contentTabId
let translatorTabId

chrome.action.onClicked.addListener(async (contentTab) => {
  contentTabId = contentTab.id
  translatorTabId = await getTranslatorTabId()

  chrome.tabs.sendMessage(translatorTabId, { type: 'check' })
    .catch(({ message }) => {
      if (message === 'Could not establish connection. Receiving end does not exist.') {
        return executeScript(translatorTabId, './scripts/translate.js')
      }
    })
    .then(() => 
      chrome.tabs.sendMessage(contentTab.id, { type: 'untranslate' })
    )
    .catch(async ({ message }) => {
      if (message === 'Could not establish connection. Receiving end does not exist.') {
        await executeScript(contentTab.id, './scripts/content.js')
        chrome.tabs.sendMessage(contentTab.id, { type: 'walk' })
      }
    })
})

chrome.runtime.onMessage.addListener((message) => {
  chrome.tabs.sendMessage(forwardTo(message.type), message)
})

async function getTranslatorTabId() {
  const [tab] = await chrome.tabs.query({ url: '*://www.deepl.com/translator*' })

  if (!tab) {
    return (await chrome.tabs.create({ url: 'https://www.deepl.com/translator', active: false })).id
  } else {
    return tab.id
  }
}

async function executeScript(tabId, script) {
  return await chrome.scripting.executeScript({
    target: { tabId },
    files: [script]
  })
}

function forwardTo(type) {
  if (type === 'translate') {
    return translatorTabId
  } else if (type === 'translated') {
    return contentTabId
  }
}
