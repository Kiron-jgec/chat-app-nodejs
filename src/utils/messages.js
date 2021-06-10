

// time setup for messages

const generateNessaage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}


// time setup for location
const generateLocationMessaage = (username, url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}



module.exports = {
    generateNessaage,
    generateLocationMessaage
}