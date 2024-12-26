/* eslint-disable new-cap */
import API_ENDPOINT from '../config/globals/endpoint.js';
import Autentication from '../utils/autentication.js';

class ApiUser {
  static async getUser() {
    try {
      const response = await fetch(API_ENDPOINT.LIST_USER);
      const responseJson = await response.json();
      return responseJson;
    } catch (err) {
      Autentication.autoLogout();
      return {};
    }
  }

  static async getAksesUser() {
    try {
      const response = await fetch(API_ENDPOINT.LIST_JENIS_AKSES);
      const responseJson = await response.json();
      return responseJson;
    } catch (err) {
      Autentication.autoLogout();
      return {};
    }
  }

  static async addUser(dataForm) {
    let response = '';
    await $.ajax({
      url: API_ENDPOINT.INSERT_USER,
      type: "POST",
      dataType: 'json',
      data: dataForm,
      contentType: false,
      cache: false,
      processData: false,
      success: (data) => {
        response = '200'; 
      },
      error: (data) => {
        response = '500';
      }
  });
  return response;
  }

  static async updateUser(dataForm) {
    let response = '';
    await $.ajax({
      url: API_ENDPOINT.UPDATE_USER,
      type: "POST",
      dataType: 'json',
      data: dataForm,
      contentType: false,
      cache: false,
      processData: false,
      success: (data) => {
        response = '200';
      },
      error: (data) => {
        response = '500';
      }
  });
  return response;
  }

  static async changePassword(dataForm) {
    let response = '';
    await $.ajax({
      url: API_ENDPOINT.CHANGE_USER_PASSWORD,
      type: "POST",
      dataType: 'json',
      data: dataForm,
      contentType: false,
      cache: false,
      processData: false,
      success: (data) => {
        response = data;
      },
      error: (data) => {
        response = '500';
      }
  });
  return response;
  }

  static async deleteUser(id){
    let response = '';
    await $.ajax({
      type: "POST",
      url: `${API_ENDPOINT.DELETE_USER}`,
      dataType: "JSON",
      data: {
          id: id
      },
      success: function(data) {
        response = '200';
      },
      error: (data) => {
        response = '500';
      }
    });

    return response;
  }
}

export default ApiUser;
