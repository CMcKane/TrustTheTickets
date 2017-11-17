import axios from 'axios';

const devURL = "http://127.0.0.1:5000";

export function TTTPost(path, json) {
  return axios.post(devURL + path, json);
}

export function TTTGet(path) {
  return axios.get(devURL + path);
}

export function TTTPostFile(path, formData) {
	return axios.post(devURL + path, formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        });
}
