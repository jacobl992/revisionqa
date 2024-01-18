document.querySelector('#generateQuestion').addEventListener('click', async () => {
    try {
        const qacode = 1;  // Set your query parameter value
        const url = `/qa?qacode=${qacode}`;
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