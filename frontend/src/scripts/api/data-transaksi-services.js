/* eslint-disable new-cap */
import API_ENDPOINT from '../config/globals/endpoint.js';
import Autentication from '../utils/autentication.js';

class ApiTransaksiServices {
  static async getTransaksiServices() {
   
 }

 static async getFaktur() {
  try {
    const response = await fetch(API_ENDPOINT.FAKTUR_SERVICE);
    const responseJson = await response.json();
    return responseJson;
  } catch (err) {
    Autentication.autoLogout();
    return {};
  }
 }

 static async transactionsPayment({
        faktur , 
        pelanggan_id,
        tanggal ,
        grand_total , 
        bayar , 
        kembali , 
        user_id , 
        kerusakan,
        status_servis,
	}) {
		const myHeaders = new Headers();
		const formdata = new FormData();

		formdata.append("faktur", `${faktur}`);
		formdata.append("pelanggan_id", `${pelanggan_id}`);
		formdata.append("pemasukan", `${grand_total}`);
		formdata.append("tanggal", `${tanggal}`);
		formdata.append("grand_total", `${grand_total}`);
		formdata.append("bayar", `${bayar}`);
		formdata.append("kembali", `${kembali}`);
		formdata.append("user_id", `${user_id}`);
		formdata.append("kerusakan", `${kerusakan}`);
		formdata.append("status_servis", `${status_servis}`);
		
		const response = await fetch(API_ENDPOINT.TRANSACTION_SERVICES, {
			method: 'POST',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

}

export default ApiTransaksiServices;
