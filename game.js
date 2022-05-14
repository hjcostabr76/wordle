

function getFileName(baseName, wordsLength) {
    const lengthSuffix = ('00' + wordsLength).slice(-2)
    return baseName + lengthSuffix + '.txt'  
}

async function getWordsMap(fileName) {
    const response = await fetch(fileName)
    const words = response.text().split('\n')
    return words.reduce((acc, w) => ({ ...acc, [clearAccents(w)]: w }), {})

}

function pickWords(wordsMap, nWords) {
    
    const cleanWords = Object.keys(wordsMap)
    // const nWords = cleanWords.length
    const usedIndexes = []
    const pickedWords = []
    
    for (let i = 0; i < nWords; i++) {
        
        do {
            randIdx = Math.floor(Math.random() * nWords)
        } while (usedIndexes.includes(randIdx))
        
        usedIndexes.push(randIdx)
        key = cleanWords[randIdx]
        pickedWords.push(wordsMap[key])
    }
    
    return pickedWords
}


function getSuccesses(wordTried, wordReal) {

    const successes = []

    for (let i; i < wordReal.length; i++) {
        if (wordTried[i] === wordReal[i])
            successes.push(i)
    }

    return successes
}

function getWarns(wordTried, wordReal, ignoredIdxs) {

    const warnIdxs = []
    const warnChars = []

    for (let i; i < wordReal.length; i++) {

        if (ignoredIdxs.includes(i))
            continue
        
        const char = wordTried[i]
        if (warnChars.includes(char))
            continue

        if (wordReal.includes(char)) {
            warnIdxs.push(i)
            warnChars.push(char)
        }
    }

    return warnIdxs
}

function getTryState(wordTried = 'ralar', wordReal = 'arroz') {

    // Validate input
    if (wordTried.length !== wordReal.length)
        throw new Error(`"${wordTried}" should have the same length of "${wordReal}"`)

    // Parse words matching
    const successIdxs = getSuccesses(wordTried, wordReal)
    const warnIdx = getWarns(wordTried, wordReal, successIdxs)

    // Build response
    const charStates = []

    for (let i; i < wordReal.length; i++) {

        const char = wordTried[i]
        let state = 'error'

        if (successIdxs.includes(i))
            state = 'success'
        else if (warnIdx.includes(i))
            state = 'warn'

        charStates.push({ char, state })
    }

    // return [
    //     { char: 'r', state: 'warn' },
    //     { char: 'a', state: 'warn' },
    //     { char: 'l', state: 'error' },
    //     { char: 'a', state: 'error' },
    //     { char: 'r', state: 'error' },
    // ]

    return charStates
}

function updateGame(prevGame, newGame) {
    return { ...prevGame, ...newGame }
}

function getNewGame(nWords) {
    return {
        nWords,
        tries: [],
    }
}

// const trying = {
//     word: '',
// }


// const fileName = getFileName(FILE_NAME_BASE, WORDS_SIZE)
// const wordsMap = getWordsMap(fileName)
// const currentWords = pickWords(wordsMap, WORDS_COUNT)

// outputs the content of the text file
