const API_URL = 'http://localhost:3030';

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    setupModalEvents();
});

function fetchProducts() {
    axios.get(`${API_URL}/files`)
    .then(response => {
        const data = response.data.data;
        renderfileTable(data);
    })
    .catch(error => console.error('Error fetching products:', error));
}

function renderfileTable(data) {
    const filesTable = document.querySelector('#filesTable');
    filesTable.innerHTML = '';

    data.forEach((file) => {
        const row = document.createElement('tr');
        if (file.resume === "/uploads/undefined"){
            file.resume = "Not yet submitting"
        }
        if (file.transcript === "/uploads/undefined"){
            file.transcript = "Not yet submitted"
        }

        row.innerHTML = `
            <td>${file.sub_id}</td>
            <td>${file.resume}</td>
            <td>${file.transcript}</td>
            <td class="container-btn">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </td>
        `;

        filesTable.appendChild(row);
        const editButton = row.querySelector('.edit-btn');
        const deleteButton = row.querySelector('.delete-btn');

        editButton.addEventListener('click', () => editProduct(file.sub_id));
        deleteButton.addEventListener('click', () => deleteProduct(file.sub_id));
    });
}


function editProduct(sub_id) {
    axios.get(`${API_URL}/file/${sub_id}`)
        .then(response => {
            const file = response.data.data;
            document.getElementById('sub_id').value = sub_id;
            document.getElementById('resume').src = `${file.resume}` || '';
            document.getElementById('transcript').src = `${file.transcript}` || '';

            openEditModal();
        })
        .catch(error => console.error('Error fetching submission data:', error));
}

function saveChanges() {
    const modal = document.getElementById('editModal');

    const sub_id = document.getElementById('sub_id').value;
    const resumeFile = document.getElementById('resume').files[0];
    const transcriptFile = document.getElementById('transcript').files[0];

    const formData = new FormData();
    formData.append('sub_id', sub_id);
    if (resumeFile) {
        formData.append('resume', resumeFile);
    }
    if (transcriptFile) {
        formData.append('transcript', transcriptFile);
    }

    axios.put(`${API_URL}/file`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
        .then(response => {
            swal.fire({
                title: 'Updated!',
                text: 'Resume and transcript updated successfully.',
                icon: 'success',
            }).then(() => {
                modal.style.display = 'none';
                fetchProducts();
            });
        })
        .catch(error => {
            swal.fire({
                title: 'Error!',
                text: error.response?.data?.message || 'Failed to update resume and transcript.',
                icon: 'error',
            });
        });
}


function openEditModal() {
    const modal = document.getElementById('editModal');
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('editModal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function setupModalEvents() {
    document.getElementById('saveChangesBtn').addEventListener('click', saveChanges);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
}

function deleteProduct(sub_id) {
    swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            axios.delete(`${API_URL}/file/${sub_id}`)
                .then(() => {
                    swal.fire({
                        title: "Deleted!",
                        text: "The file record has been deleted.",
                        icon: "success"
                    }).then(() => {
                        const row = document.querySelector(`tr[data-id="${sub_id}"]`);
                        if (row) row.remove();
                        fetchProducts();
                    });
                })
                .catch(error => {
                    console.error("Error deleting record:", error);
                    swal.fire({
                        title: "Error!",
                        text: "There was an issue deleting the record.",
                        icon: "error"
                    });
                });
        }
    });
}
