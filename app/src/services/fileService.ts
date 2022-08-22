import axios from 'axios';
import { api } from './api';

/**
 * Upload a new file
 * @param {string} host
 * @param {FormData} formData
 * @returns {Promise}
 */
export const uploadFile = (
  host: string,
  formData: FormData
): Promise<{ message: string }> => {
  return axios
    .post(api.upload(host), formData)
    .then(({ data }) => data)
    .catch(({ response }) => {
      if (response.status === 409 && response.statusText === 'Conflict') {
        throw response;
      }
    });
};

/**
 * Download a file
 * @param {string} host
 * @param {string} fileName
 * @param {string} ipAddress
 * @returns {Blob}
 */
export const downloadFile = (
  host: string,
  fileName: string,
  ipAddress: string
): Promise<Blob> => {
  return axios
    .post(
      api.download(host),
      { fileName, ipAddress },
      {
        responseType: 'blob'
      }
    )
    .then(({ data }) => data);
};

/**
 * Retrieve file from the server / current node
 * @param {string} host
 * @param {string} token JWT
 * @param {string} fileName
 * @returns {Promise}
 */
export const openFile = (
  host: string,
  token: string,
  fileName: string
): Promise<Blob> => {
  return axios
    .get(api.file(host, fileName), {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    })
    .then(({ data }) => data)
    .catch(({ response }) => {
      throw response;
    });
};

/**
 * Remove file from the server / current node
 * @param {string} host
 * @param {string} token JWT
 * @param {string} fileName
 * @returns {Promise}
 */
export const deleteFile = (
  host: string,
  token: string,
  fileName: string
): Promise<{ message: string }> => {
  return axios
    .delete(api.file(host, fileName), {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(({ data }) => data)
    .catch(({ response }) => {
      throw response;
    });
};
