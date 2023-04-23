chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'translate') {
    const translateTextArea = document.querySelector('div[_d-id="1"]')
    const translatedTextArea = document.querySelector('div[_d-id="8"]')

    function joinStrings() {
      let joinedStrings = ['']

      message.translateArray.forEach((textToTranslate, index) => {
        if (joinedStrings.at(-1).length + textToTranslate.length + `{i:${index}}`.length < 5000) {
          joinedStrings[joinedStrings.length - 1] += `\n |i:${index}| ${textToTranslate}`
        } else {
          joinedStrings = [...joinedStrings, `\n |i:${index}| ${textToTranslate}`]
        }
      })

      return joinedStrings
    }

    function fillTranslateTextArea() {
      translateTextArea.textContent = joinedStrings[index]
      translateTextArea.dispatchEvent(new Event('input', { bubbles: true }))
    }

    function clearTranslateTextArea() {
      let clearButton = document.querySelector('button#translator-source-clear-button')

      if (clearButton) {
        clearButton.dispatchEvent(new Event('click', { bubbles: true }))
        return true
      }
    }

    let index = 0
    let skip = false
    let joinedStrings = joinStrings()

    const observer = new MutationObserver((mutations) => {
      if (mutations[0].target.attributes[0].nodeValue === 'false') {
        if (message.translateArray.length - 1 > index) {
          !skip ? index++ : skip = false
          fillTranslateTextArea()
        } else {
          observer.disconnect()
        }
      } else {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length > 0 && mutation.removedNodes.length === 0 && mutation.addedNodes[0].textContent) {
            let translatedArray = []

            mutation.addedNodes.forEach(({ textContent }) => {
              if (/\|i:(\d+)\|/g.test(textContent)) {
                const index = parseInt(textContent.match(/\|i:(\d+)\|/g)[0].split(':')[1])
                const translatedText = textContent.replace(/\|i:(\d+)\|/g, '')

                translatedArray = [...translatedArray, { index, translatedText }]
              } else {
                if (translatedArray.at(-1)) translatedArray.at(-1).translatedText += textContent
              }
            })

            chrome.runtime.sendMessage({ type: 'translated', translatedArray })
            clearTranslateTextArea()
          }
        })
      }
    })

    observer.observe(translatedTextArea, { childList: true })
    if (clearTranslateTextArea()) skip = true
    fillTranslateTextArea()
  }
})
