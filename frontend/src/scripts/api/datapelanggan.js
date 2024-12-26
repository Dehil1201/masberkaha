/* eslint-disable new-cap */
import API_ENDPOINT from '../config/globals/endpoint.js';
import Autentication from '../utils/autentication.js';

class ApiPelanggan {
  static async getPelanggan() {
    try {
      const response = await fetch(API_ENDPOINT.LIST_PELANGGAN);
      const responseJson = await response.json();
      return responseJson;
    } catch (err) {
      Autentication.autoLogout();
      return {};
    }
  }

  static async getKodePelanggan() {
    try {
      const response = await fetch(API_ENDPOINT.AUTOKODE_PELANGGAN);
      const responseJson = await response.json();
      return responseJson;
    } catch (err) {
      Autentication.autoLogout();
      return {};
    }
   }

  static async addPelanggan(dataForm) {
    let response = '';
    await $.ajax({
      url: API_ENDPOINT.INSERT_PELANGGAN,
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

  static async updatePelanggan(dataForm) {
    let response = '';
    await $.ajax({
      url: API_ENDPOINT.UPDATE_PELANGGAN,
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

  static async deletePelanggan(id){
    let response = '';
    await $.ajax({
      type: "POST",
      url: `${API_ENDPOINT.DELETE_PELANGGAN}`,
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

export default ApiPelanggan;
