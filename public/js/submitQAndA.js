const showHideSubmitButton = document.querySelector('#show-hide-submit');
const submitBox = document.querySelector('#submit-box');
let maxQACode = 0;
let newQACode = 0;
let submitQuestion = '';
let submitAnswer = '';
let questionBody = {};
let answerBody = {};
const submitAlertElement = document.querySelector('#submit-alert');

showHideSubmitButton.addEventListener('click', () => {

    const computedStyle = window.getComputedStyle(submitBox);

    submitBox.style.display = computedStyle.display === 'none' ? 'flex' : 'none';
    showHideSubmitButton.innerHTML = showHideSubmitButton.innerText === 'Show' ? 'Hide' : 'Show';
});

document.querySelector('#qa-submit-btn').addEventListener('click', async (qaCodes) => {
    //reset
    submitAlertElement.innerHTML = '';
    submitAlertElement.style.backgroundColor = '#e8aaaa';
    submitAlertElement.style.display = 'none';

    //validation
    submitQuestion = document.querySelector('#q-input').value;
    submitAnswer = document.querySelector('#a-input').value;

    if (!submitQuestion || !submitAnswer) {
        submitAlertElement.innerHTML = 'Question and answer field must be filled in';
        submitAlertElement.style.display = 'block';
        return;
    }
    if (submitQuestion.length > 300) {
        submitAlertElement.innerHTML = 'Question is too many characters';
        submitAlertElement.style.display = 'block';
        return;
    } else if (submitAnswer.length > 800) {
        submitAlertElement.innerHTML = 'Answer is too many characters';
        submitAlertElement.style.display = 'block';
        return;
    }

    //get unique code for question and answer
    qaCodes = await retrieveQACodes();
    maxQACode = Math.max(...qaCodes);
    newQACode = maxQACode + 1;

    //define request bodies
    questionBody = JSON.stringify({
        type: 'question',
        body: submitQuestion,
        qacode: newQACode
    });

    answerBody = JSON.stringify({
        type: 'answer',
        body: submitAnswer,
        qacode: newQACode
    });

    //send question
    try {
        const url = '/addQA';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: questionBody
        });

        if (!response.ok) {
            submitAlertElement.innerHTML = response.message;
            submitAlertElement.style.display = 'block';
            throw new Error(`Unexpected error. Status: ${response.status}`);
        } else {
            const responseBody = await response.json();
            submitAlertElement.innerHTML = responseBody.message;
            submitAlertElement.style.backgroundColor = '#87be87';
            submitAlertElement.style.display = 'block';
        }

    } catch (error) {
        submitAlertElement.innerHTML = error;
        submitAlertElement.style.display = 'block';
        console.error(error);
    }

    //send answer
    try {
        const url = '/addQA';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: answerBody
        });

        if (!response.ok) {
            submitAlertElement.innerHTML = response.message;
            submitAlertElement.style.display = 'block';
            throw new Error(`Unexpected error. Status: ${response.status}`);
        } else {
            const responseBody = await response.json();
            submitAlertElement.innerHTML = responseBody.message;
            submitAlertElement.style.backgroundColor = '#87be87';
            submitAlertElement.style.display = 'block';
            submitQuestion = document.querySelector('#q-input').value = '';
            submitAnswer = document.querySelector('#a-input').value = '';
        }

    }  catch (error) {
        submitAlertElement.innerHTML = error;
        submitAlertElement.style.display = 'block';
        console.error(error);
    }
});