const API_URL = 'http://localhost:3030';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('submitBtn').addEventListener('click', Submission);
});

function showSuccessMessage(message) {
    swal.fire({
        title: "Success!",
        text: message,
        icon: "success",
    });
}


function Submission() {
    const formData = getFormDataWithFiles();

    axios.post(`${API_URL}/file`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
        .then(() => 
            setTimeout(() => {
                window.location.href = "/";
            }, 1000),
            showSuccessMessage('Submit successfully!'))
        .catch(error => {
            console.error('Error Submitting:', error);
            swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Error Submitting: ${error.message}`,
            })
        });
}

function getFormDataWithFiles() {
    const formData = new FormData();

    const resume = document.getElementById('resume').files[0];
    const transcript = document.getElementById('transcript').files[0];

    if (resume) formData.append('resume', resume);
    if (transcript) formData.append('transcript', transcript);

    return formData;
}
