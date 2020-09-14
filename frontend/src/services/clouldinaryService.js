import axios from 'axios'

export default {

    uploadImg
}

function uploadImg(file) {
    console.log(file)
    const CLOUD_NAME = 'dsqh7qhpg';
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'lh8fyiqe');
    return axios.post(UPLOAD_URL, formData)
}