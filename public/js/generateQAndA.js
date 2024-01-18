let qaCodes = [];
let qaData = {};
let randomQACode = 0;
const qaBoxElement = document.querySelector('#qa-box');
const questionElement = document.querySelector('#question-p');
const dbAnswerElement = document.querySelector('#db-answer');

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
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
        return extractQacodes(data.data);
    } catch (error) {
        console.error('Error:', error);
    }
}
document.querySelector('#generateQuestion').addEventListener('click', async (qaCodes) => {
    //first part - getting list of poss Q's and A's
    qaCodes = await retrieveQACodes();
    randomQACode = getRandomEntry(qaCodes);

    //second part - selecting a Q and A
    try {
        qaBoxElement.style.display = 'none';
        const url = `/qa?qacode=${randomQACode}`;
        const response = await fetch(url, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        qaData = await response.json();
        console.log('Response data:', qaData);
        questionElement.innerHTML = qaData.data[0].body
        qaBoxElement.style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
    }
});