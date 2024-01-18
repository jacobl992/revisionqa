let randomQACode = 0;
const qaBoxElement = document.querySelector('#qa-box');
const questionElement = document.querySelector('#question-p');
const dbAnswerElement = document.querySelector('#db-answer');

function getRandomEntry(qaCodesArray) {
    const randomIndex = Math.floor(Math.random() * qaCodesArray.length);
    return qaCodesArray[randomIndex];
}

window.qaCodesPromise.then((qaCodes) => {
    randomQACode = getRandomEntry(qaCodes);
    console.log(randomQACode);
}).catch((error) => {
    console.error('Error:', error);
});
document.querySelector('#generateQuestion').addEventListener('click', async () => {
    try {
        qaBoxElement.style.display = 'none';
        const url = `/qa?qacode=${randomQACode}`;
        const response = await fetch(url, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
        questionElement.innerHTML = data.data[0].body
        qaBoxElement.style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
    }
});