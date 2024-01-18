const extractQacodes = (qacodeData) => {
    return qacodeData.map(obj => obj.qacode);
};

let qaCodesPromise = new Promise(async (resolve, reject) => {
    try {
        const response = await fetch('/qacodes', {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
        const qaCodes = extractQacodes(data.data);
        console.log(qaCodes);

        resolve(qaCodes);
    } catch (error) {
        reject(error);
    }
});

window.qaCodesPromise = qaCodesPromise;
