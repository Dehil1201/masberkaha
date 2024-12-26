/* eslint-disable new-cap */
import API_ENDPOINT from '../config/globals/endpoint.js';
import Autentication from '../utils/autentication.js';

class ApiDashboard {
  static async getAmountBarang() {
    try {
      const response = await fetch(API_ENDPOINT.DASHBOARD_GET_AMOUNT_BARANG);
      const responseJson = await response.json();
      return responseJson;
    } catch (err) {
      Autentication.autoLogout();
      return {};
    }
  }

  static async getAmountSupplier() {
    try {
      const response = await fetch(API_ENDPOINT.DASHBOARD_GET_AMOUNT_SUPPLIER);
      const responseJson = await response.json();
      return responseJson;
    } catch (err) {
      Autentication.autoLogout();
      return {};
    }
  }

  static async getAmountUser() {
    try {
      const response = await fetch(API_ENDPOINT.DASHBOARD_GET_AMOUNT_USER);
      const responseJson = await response.json();
      return responseJson;
    } catch (err) {
      Autentication.autoLogout();
      return {};
    }
  }

  static async getAmountPelanggan() {
    try {
      const response = await fetch(API_ENDPOINT.DASHBOARD_GET_AMOUNT_PELANGGAN);
      const responseJson = await response.json();
      return responseJson;
    } catch (err) {
      Autentication.autoLogout();
      return {};
    }
  }



  static async getAmountPenjualanBulanan() {
    try {
      const response = await fetch(API_ENDPOINT.DASHBOARD_GET_AMOUNT_PENJUALAN_MONTHLY);
      const responseJson = await response.json();
      return responseJson;
    } catch (err) {
      Autentication.autoLogout();
      return {};
    }
  }


  static async getGraphPenjualan(state = 2) {
    let urlDaily = new URL(API_ENDPOINT.DASHBOARD_GET_GRAPH_PENJUALAN_DAILIY);
    let urlMonhly = new URL(API_ENDPOINT.DASHBOARD_GET_GRAPH_PENJUALAN_MONTHLY);
    try {
      let response;
      if (state == 1) {
        response = await fetch(urlDaily)
      } else if (state == 2) {
        response = await fetch(urlMonhly)
      }
      const responseJson = await response.json();
      return responseJson;
    } catch (err) {
      // Autentication.autoLogout();
      return {};
    }
  }

  static async getIncomeSource() {
    try {
      const response = await fetch(API_ENDPOINT.DASHBOARD_GET_INCOME_SOURCE);
      const responseJson = await response.json();
      return responseJson;
    } catch (err) {
      Autentication.autoLogout();
      return {};
    }
  }

  static async getCountInstok() {
    try {
      const response = await fetch(API_ENDPOINT.DASHBOARD_GET_COUNT_INSTOK);
      const responseJson = await response.json();
      return responseJson;
    } catch (err) {
      console.log(err);
      return {};
    }
  }

  static async getCountSold() {
    try {
      const response = await fetch(API_ENDPOINT.DASHBOARD_GET_COUNT_SOLD);
      const responseJson = await response.json();
      return responseJson;
    } catch (err) {
      console.log(err);
      return {};
    }
  }

  static async getAmountWeightSold() {
    try {
      const response = await fetch(API_ENDPOINT.DASHBOARD_GET_AMOUNT_WEIGHT_SOLD);
      const responseJson = await response.json();
      return responseJson;
    } catch (err) {
      console.log(err);
      return {};
    }
  }

  static async getApiServer() {
    try {
      const response = await fetch(API_ENDPOINT.IP_SERVER);
      const responseJson = await response.json();
      return responseJson;
    } catch (err) {
      console.log(err);
      return {};
    }
  }

}

export default ApiDashboard;
