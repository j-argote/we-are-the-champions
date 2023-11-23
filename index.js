import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js'
import { getDatabase, ref, push, onValue, update } from 'https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js'

//database configurations
const firebaseConfig = {
    databaseURL: "https://we-are-the-champions-685ad-default-rtdb.firebaseio.com/"
}

// database initialized
const app = initializeApp(firebaseConfig)
const database = getDatabase(app) 
const endorsementInDB = ref(database, "endorsements")

//ID's of html elements in use
const btnEl = document.querySelector("#btn-el")
const endorsementContainer = document.querySelector("#endorsement-container")
const txtareaEl = document.querySelector("#txtarea-el")
const fromEl = document.querySelector("#from-el")
const toEl = document.querySelector('#to-el')

btnEl.addEventListener("click", function() {
    const endorsement = txtareaEl.value
    const fromValue = fromEl.value
    const toValue = toEl.value

    if(endorsement == ""){
        return
    }
    else{
        push(endorsementInDB, {
            from: fromValue,
            to: toValue,
            message: endorsement,
            like: 0
        })
        clearInputs()
    }
})

onValue(endorsementInDB, function(snapshot) {
    const endorsementArray = Object.entries(snapshot.val())

    clearEndorsementContainer()

    //displays the endorsement by showing the most recent first
    for(let i = endorsementArray.length - 1; i >= 0; i--) {
        let item = endorsementArray[i]
        appendItemToEndorsementContainer(item)
    }
})

function clearInputs() {
    txtareaEl.value = ""
    fromEl.value = ""
    toEl.value = ""
}

function clearEndorsementContainer() {
    endorsementContainer.textContent = ""
}

function appendItemToEndorsementContainer(item) {
    const endorsementMainDiv = constructEndorsementElements(item)

    endorsementContainer.append(endorsementMainDiv)
}

function constructEndorsementElements(item) {
    const itemObj = item[1]
    const itemTo = itemObj.to
    const itemMessage = itemObj.message
    const itemFrom = itemObj.from
    const itemLike = itemObj.like

    const mainDiv = document.createElement("div")
    const newToH3 = document.createElement("h3")
    const newP = document.createElement("p")
    const newDiv = document.createElement("div")
    const newFromH3 = document.createElement("h3")
    const newLikesP = document.createElement("p")

    newToH3.textContent = `To ${itemTo}`
    newP.textContent = itemMessage
    newFromH3.textContent = `From ${itemFrom}`
    newLikesP.textContent = `❤️ ${itemLike}`

    mainDiv.className = "message-container"
    newDiv.className = "likes-container"
    newLikesP.className = "likes"

    mainDiv.append(newToH3)
    mainDiv.append(newP)
    mainDiv.append(newDiv)
    newDiv.append(newFromH3)
    newDiv.append(newLikesP)

    if(localStorage.getItem("likedMessage") == null){
        updateLike(newLikesP, item)
    }

    return mainDiv
}


function updateLike(likeEl, item) {
    if(localStorage.getItem("likedMessage") === true){
        return
    }
    const itemID = item[0]
    let itemLike = item[1].like + 1

    likeEl.addEventListener("click", function() {
        const exactIteminDB = ref(database, `endorsements/${itemID}`)
        const updates = {
            like: itemLike
        }
        localStorage.setItem("likedMessage", true)
        update(exactIteminDB, updates)
    })
}
