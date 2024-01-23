let qaCodes = [];
let qaData = {};
let questionObject = {};
let answerObject = {};
let randomQACode = 0;
const qaBoxElement = document.querySelector('#qa-box');
const questionElement = document.querySelector('#question-p');
const dbAnswerElement = document.querySelector('#db-answer');
const generateAlertBox = document.querySelector('#generate-alert');

document.querySelector('#show-hide-generate').addEventListener('click', () => {
    qaBoxElement.style.display = 'none';
    document.querySelector('#show-hide-generate').style.display = 'none';
});

const extractQacodes = (qacodeData) => {
    return qacodeData.map(obj => obj.qacode);
};
function getRandomEntry(qaCodesArray) {
    const randomIndex = Math.floor(Math.random() * qaCodesArray.length);
    return qaCodesArray[randomIndex];
}

async function retrieveQACodes (qaCodes) {
    try {
        const response = await fetch('/qacodes', {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Unexpected error. Status: ${response.status}`);
        }

        const qaCodeResponse = await response.json();
        console.log('Response data:', qaCodeResponse);
        return extractQacodes(qaCodeResponse.data);

    } catch (error) {
        console.error(error);
        generateAlertBox.innerHTML = error;
        generateAlertBox.style.display = 'block';
    }
}
document.querySelector('#generateQuestion').addEventListener('click', async (qaCodes) => {
    //first part - getting list of poss Q's and A's
    document.querySelector('#show-hide-generate').style.display = 'block';
    document.querySelector('#your-answer').value = '';
    qaCodes = await retrieveQACodes();
    randomQACode = getRandomEntry(qaCodes);

    //second part - selecting a Q and A
    try {
        qaBoxElement.style.display = 'none';
        dbAnswerElement.style.display = 'none';
        const url = `/qa?qacode=${randomQACode}`;
        const response = await fetch(url, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Unexpected error. Status: ${response.status}`);
        }

        qaData = await response.json();
        console.log('Response data:', qaData);
        questionObject = qaData.data.find(obj => obj.type === 'question');
        answerObject = qaData.data.find(obj => obj.type === 'answer');
        questionElement.innerHTML = questionObject.body;
        qaBoxElement.style.display = 'flex';
        document.querySelector('#display-db-answer').addEventListener('click', () => {
            dbAnswerElement.innerHTML = answerObject.body;
            dbAnswerElement.style.display = 'block';
        });
    } catch (error) {
        console.error(error);
        generateAlertBox.innerHTML = error;
        generateAlertBox.style.display = 'block';
    }
});