const dropZone = document.getElementById('dropZone');
const fileContent = document.getElementById('fileContent');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');

const mainDiv = document.getElementById('mainDiv');
const div1 = document.getElementById("div1");
const wordP = document.getElementById("wordParagraph");
const skipBnt = document.getElementById("skipButton");
const notButton = document.getElementById("notButton");
const input = document.getElementById("vocabInput");
const definition = document.getElementById("definitionP");

//mainDiv.style.display = "flex";

let stopAction = false;
const obj = {};
let wordsArray = [];
let allWords = [];
let currentIndex = 0;
let currentword = "";

mainDiv.style.display = "none";

// Prevent default behavior for drag events
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => e.preventDefault());
    dropZone.addEventListener(eventName, (e) => e.stopPropagation());
});

// Add class when file is dragged over
['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
        dropZone.classList.add('dragover');
    });
});

// Remove class when drag is no longer active
['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
        dropZone.classList.remove('dragover');
    });
});

// Handle the file drop event
dropZone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'text/plain') {
        const file = files[0];
        processFile(file);
    } else {
        fileContent.textContent = 'Please drop a valid .txt file';
    }
});

// When button is clicked, trigger the file input click event
uploadBtn.addEventListener('click', () => {
    fileInput.click();
});

// Handle file selection through file input
fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file && file.type === 'text/plain') {
        processFile(file);
    } else {
        fileContent.textContent = 'Please select a valid .txt file';
    }
});

// Function to read and process the file content
function processFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        let lines = text.split('\n');
        lines.forEach(element => {
            let parts = element.split(":");
            if (parts.length === 2) {  // Ensure there is a key-value pair
                obj[parts[0].trim().toLowerCase()] = {definition: parts[1].trim().toLowerCase()} ;
                wordsArray.push(parts[0].trim().toLowerCase());
                allWords.push(parts[0].trim().toLowerCase());
            }
        });
        start(obj, wordsArray);
    };
    reader.readAsText(file);
    mainDiv.style.display = "flex";
}

function start(){
    if(stopAction) return;
    if(wordsArray.length <= 0){
        wordsArray = [...allWords];
    }
    chooseWord();
    displayWord();
}

function displayWord(){
    wordP.innerHTML = currentword;
}

function chooseWord(){
    let wordIndex = Math.floor(Math.random() * (wordsArray.length));
    currentIndex = wordIndex;
    currentword = wordsArray[wordIndex];
    return wordsArray[wordIndex];
}

skipBnt.onclick = function(){
    if(stopAction) return;
    start();
}

notButton.onclick = function(){
    if(stopAction) return;
    if(!obj[currentword]) return;
    delete obj[currentword];
    wordsArray.splice(currentIndex, 1);
    allWords.splice(allWords.indexOf(currentword), 1);
    start();
}
input.addEventListener("keyup", function(event){
    if(stopAction || allWords.length == 0) return;
    if(event.key === "Enter"){
        if(input.value.toLowerCase() == obj[currentword].definition){
            definition.innerHTML = `You guessed correctly: ${obj[currentword].definition}`;
            stopAction = true;
            wordsArray.splice(currentIndex,1);
            setTimeout(() => {
                stopAction = false;
                input.value = "";
                definition.innerHTML = "";
                if(wordsArray.length <= 0){
                    wordsArray = [...allWords];
                }
                start();
            }, 2000);
        }
        else{
            definition.innerHTML = `Correct definition: ${obj[currentword].definition}`;
            stopAction = true;
            setTimeout(() => {
                stopAction = false;
                input.value = "";
                definition.innerHTML = "";
                start();
            }, 2800);
        }
    }
});
div1.addEventListener("click", (click) => {
    if(stopAction) return;
    stopAction = true;
    definition.innerHTML = `Correct definition: ${obj[currentword].definition}`;
    setTimeout(() => {
        stopAction = false;
        input.value = "";
        definition.innerHTML = "";
        start();
    }, 2800);
});