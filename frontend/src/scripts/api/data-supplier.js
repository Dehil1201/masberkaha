/* eslint-disable new-cap */
import API_ENDPOINT from '../config/globals/endpoint.js';
import Autentication from '../utils/autentication.js';

class ApiSupplier {
  static async getSupplier() {
    try {
      const response = await fetch(API_ENDPOINT.LIST_SUPPLIER);
      const responseJson = await response.json();
      return responseJson;
    } catch (err) {
      Autentication.autoLogout();
      return {};
    }
  }

  static async addSupplier(dataForm) {
    let response = '';
    await $.ajax({
      url: API_ENDPOINT.INSERT_SUPPLIER,
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
        response = data;
      }
  });
  return response;
  }

  static async updateSupplier(dataForm) {
    let response = '';
    await $.ajax({
      url: API_ENDPOINT.UPDATE_SUPPLIER,
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
        response = data;
      }
  });
  return response;
  }

  static async deleteSupplier(id){
    let response = '';
    await $.ajax({
      type: "POST",
      url: `${API_ENDPOINT.DELETE_SUPPLIER}`,
      dataType: "JSON",
      data: {
          id: id
      },
      success: function(data) {
        response = '200';
      },
      error: (data) => {
        response = data;
      }
    });

    return response;
  }
}

export default ApiSupplier;
