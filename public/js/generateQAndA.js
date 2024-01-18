let randomQACode = 0;

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
        const url = `/qa?qacode=${randomQACode}`;
        const response = await fetch(url, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
    } catch (error) {
        console.error('Error:', error);
    }
});