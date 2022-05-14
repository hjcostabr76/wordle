
const FILE_NAME_BASE = 'words-pt-br-utf8'

const ID_BACK = 'backspace'
const ID_SUBMIT = 'submit'
const ID_TRY_IDX = 'try_index'
const ID_CHAR_IDX = 'char_index'
const ID_WORDS_COUNT = 'words_count'
const ID_WORDS_LENGTH = 'words_length'
const ID_ALPHABET_CONTAINER = 'alphabet'
const ID_KEYBOARD_KEYS = 'keys'
const ID_KEYBOARD_ACTIONS = 'actions'

const ATTR_IDX = 'data-idx'
const CLASS_WARN = 'warn'
const CLASS_ERROR = 'error'
const CLASS_SUCCESS = 'success'

const CLASS_CONTAINER = 'container_tries'
const CLASS_COMBO_CHAR = 'combo_char'
const CLASS_COMBO_WORD = 'combo_word'

const CLASS_ALPHA_BTN = 'alpha_button'
const CLASS_ALPHA_LINE = 'alpha_line'
const CLASS_ALPHA_CHAR = 'alpha_char'
const CLASS_ALPHA_ACTION = 'alpha_action'

function clearAccents(raw) {
    // TODO: implement...
    return raw
}

function getElementByID(id) {
    const input = document.getElementById(id)
    if (!input)
        throw new Error(`Could't find "${id}" input`)
    return input
}

function getCurrentIdx() {
    return getElementByID(ID_CHAR_IDX).value
}

function incrementIdx() {
    const charIdxInput = getElementByID(ID_CHAR_IDX)
    const maxIdx = getElementByID(ID_WORDS_LENGTH)
    const newIndex = Math.min(+charIdxInput.value + 1, +maxIdx.value)
    console.log({ charIdxInput, maxIdx, newIndex })
    charIdxInput.value = newIndex
}

function getCharInputs(charIdx = undefined, comboIdx = undefined, containerIdx = undefined) {
    const queryContainer = containerIdx ? `.${CLASS_CONTAINER}[${ATTR_IDX}="${containerIdx}"]` : ''
    const queryCombo = comboIdx ? `.${CLASS_COMBO_WORD}[${ATTR_IDX}="${comboIdx}"]` : ''
    const queryWord = `.${CLASS_COMBO_CHAR}${charIdx ? `[${ATTR_IDX}="${charIdx}"]` : ''}`
    const queryInput = `${queryContainer} ${queryCombo} ${queryWord}`.trim()
    console.log({ queryInput })
    return document.querySelectorAll(queryInput)
}

function onLetterChange(containerIdx, comboIdx, charIdx) {

    const thisInputNode = getCharInputs(charIdx, comboIdx, containerIdx)
    if (thisInputNode.length !== 1)
        throw new Error(`Changed inputs should be exactly one! [${thisInput.length} found]`)

    const thisInput = thisInputNode[0]
    if (!/^[a-zA-Z]$/.test(thisInput.value))
        return thisInput.value = ""
    
    writeLetter(thisInput.value)
}

function writeLetter(char) {
    const allInputs = getCharInputs(getCurrentIdx())
    for (const [, input] of allInputs.entries())
        input.value = clearAccents(char).toUpperCase()
    incrementIdx()
}

function eraseLetter() {
    const allInputs = getCharInputs(getCurrentIdx())
    for (const [, input] of allInputs.entries())
        input.value = ''
}

function submitTry() {
    console.log({ msg: 'trying...' })
}

function buildAlphabet() {
    
    
    // Add keyboard keys
    const keyboardLines = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']
    const keysContainer = getElementByID(ID_KEYBOARD_KEYS)
    let foo = 0
    
    keyboardLines.map(alphaLine => {

        const lineContainer = document.createElement('div')
        lineContainer.className = CLASS_ALPHA_LINE
        keysContainer.appendChild(lineContainer)

        Array.from(alphaLine).map(alphaChar => {
            foo++

            // Add 01 key
            const char = document.createElement('button')
            char.className = `${CLASS_ALPHA_BTN} ${CLASS_ALPHA_CHAR}`
            char.innerText = alphaChar
            char.addEventListener('click', () => writeLetter(alphaChar))

            if (foo % 7 === 0)
                char.className = `${char.className} ${CLASS_SUCCESS}`
            else if (foo % 4 === 0)
                char.className = `${char.className} ${CLASS_ERROR}`

            lineContainer.appendChild(char)
        })
    })

    // Create backspace Button
    const backspace = document.createElement('button')
    backspace.innerText = '<'
    backspace.id = ID_BACK
    backspace.className = `${CLASS_ALPHA_BTN} ${CLASS_ALPHA_ACTION}`
    backspace.addEventListener('click', eraseLetter)
    
    // Create submit Button
    const submit = document.createElement('button')
    submit.innerText = 'enter'
    submit.id = ID_SUBMIT
    submit.className = `${CLASS_ALPHA_BTN} ${CLASS_ALPHA_ACTION}`
    submit.addEventListener('click', submitTry)
    
    // Add action buttons
    const actionsContainer = getElementByID(ID_KEYBOARD_ACTIONS)
    actionsContainer.appendChild(submit)
    actionsContainer.appendChild(backspace)
}


(() => {

    document.addEventListener('keypress', (event) => {
        if (event.target?.localName === 'body') // Assure we only handle text entered outside any input 
            writeLetter(event.key)
    })

    // console.log({foo: getCharInputs() })

    // getCharInputs().addEventListener('input', (event) => {
    //     console.log({ target: event.target })
    //     // console.log({ event })
    //     // const { key } = event
    //     // event.stopPropagation()
    // })

    buildAlphabet()
    console.log('App is ready!')
})()