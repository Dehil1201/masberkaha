/* eslint-disable new-cap */
import API_ENDPOINT from '../config/globals/endpoint.js';
import Autentication from '../utils/autentication.js';

class ApiBarangRusak {
  static async getBarangRusak() {
    try {
      const response = await fetch(API_ENDPOINT.LIST_BARANG_RUSAK);
      const responseJson = await response.json();
      return responseJson;
    } catch (err) {
      Autentication.autoLogout();
      return {};
    }
  }
}

export default ApiBarangRusak;
