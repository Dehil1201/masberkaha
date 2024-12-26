/* eslint-disable new-cap */
import API_ENDPOINT from '../config/globals/endpoint.js';
import Autentication from '../utils/autentication.js';

class ApiCheckStok {
	static async checkStok(barcodeBarang) {
		try {
		const myHeaders = new Headers();
		const formdata = new FormData();
		formdata.append("kode_barang", `${barcodeBarang}`);

		const response = await fetch(API_ENDPOINT.CHECK_STOK, {
			method: 'post',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
		} catch (error) {
			Autentication.autoLogout();
		}
		
	}

	static async recheckStok() {
		try {
		  const response = await fetch(API_ENDPOINT.RESET_CHECK_STOK);
		  const responseJson = await response.json();
		  return responseJson;
		} catch (err) {
		  Autentication.autoLogout();
		  return {};
		}
	   }
}

export default ApiCheckStok;
