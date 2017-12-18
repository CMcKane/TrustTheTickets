import axios from 'axios';

const devURL = "http://127.0.0.1:5000";
//const devURL = "http://trustthetickets.com:5000";

/**
* This function makes backend calls that allow to pass parameters to the backend functions.
*/
export function TTTPost(path, json) {
  return axios.post(devURL + path, json);
}
/**
* This function makes backend calls without passing of parameters to the backend functions.
*/
export function TTTGet(path) {
  return axios.get(devURL + path);
}
/**
* Sets the location of the TTT Post file.
*/
export function TTTPostFile(path, formData) {
	return axios.post(devURL + path, formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        });
}
