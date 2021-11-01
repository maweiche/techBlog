const { response } = require("express");

async function newFormHandler(event) {
    event.preventDefault();

    const title = document.querySelector('input[name="post-title"]').value;
    const post_text = document.querySelector('textarea[name="post-text"]').value;

    const respons = await fetch(`/api/posts`, {
        method: 'POST',
        body: JSON.stringify({
            title,
            post_text
        }),
        headers: {
            'Content-Type': 'applications/json'
        }
    });
    if (response.ok) {
        document.location.replace('/dashboard/');
    } else {
        alert(respons.statusText);
    }
}

document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);