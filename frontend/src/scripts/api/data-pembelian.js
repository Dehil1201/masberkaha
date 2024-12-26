import API_ENDPOINT from '../config/globals/endpoint.js';
import Autentication from '../utils/autentication.js';
import FormatCurrency from '../utils/initial-currency.js';

class ApiPembelian {
  static async getPembelianDetail(user_id) {
    try {
        const response = await fetch(API_ENDPOINT.LIST_DETAIL_PEMBELIAN(user_id));
        const responseJson = await response.json();
        return responseJson;
      } catch (err) {
        Autentication.autoLogout();
        return {};
      }
 }

 static async getFaktur() {
  try {
    const response = await fetch(API_ENDPOINT.FAKTUR_PEMBELIAN);
    const responseJson = await response.json();
    return responseJson;
  } catch (err) {
    Autentication.autoLogout();
    return {};
  }
 }

  static async addDetail({FormData , user_id, foto}) {
      const myHeaders = new Headers();
	  let hargaBeli =  await FormatCurrency.getValue(document.getElementById('harga_beli').value);
	  let hargaJual =  await FormatCurrency.getValue(document.getElementById('harga_jual').value);
	  FormData.append("user_id", `${user_id}`);
	  FormData.append('foto', foto);
     
	  let formData = FormData; 
	  formData.set('harga_beli' ,hargaBeli);
	  formData.set('harga_jual' ,hargaJual);
   
      const response = await fetch(API_ENDPOINT.ADD_DETAIL_PEMBELIAN, {
          method: 'POST',
          headers: myHeaders,
          body:formData
      });
    return response.json();
  }

  static async deleteDetail({
		user_id,
		idBarang,
		kodeBarang,
		foto
	}) {
		const myHeaders = new Headers();
		const formdata = new FormData();

		formdata.append("id_barang", `${idBarang}`);
		formdata.append("kode_barang", `${kodeBarang}`);
		formdata.append("user_id", `${user_id}`);
		formdata.append("foto", `${foto}`);

		const response = await fetch(API_ENDPOINT.DESTROY_DETAIL_PEMBELIAN, {
			method: 'POST',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

	static async transactionsPayment({
        faktur, supplier_id, date, grand_total, user_id, status_bayar  , tempo ,
		hutang_dibayar, hutang_sisa
	}) {
		const myHeaders = new Headers();
		const formdata = new FormData();

		formdata.append("faktur", `${faktur}`);
		formdata.append("supplier_id", `${supplier_id}`);
		formdata.append("grand_total", `${grand_total}`);
		formdata.append("user_id", `${user_id}`);
		formdata.append("status_bayar", `${status_bayar}`);
        formdata.append("date", `${date}`);
        formdata.append("tempo", `${tempo}`);
		formdata.append("hutang_dibayar", `${hutang_dibayar}`);
        formdata.append("hutang_sisa", `${hutang_sisa}`);
        
		const response = await fetch(API_ENDPOINT.TRANSACTION_PEMBELIAN, {
			method: 'POST',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

	static async getInfoTransaksiPembelian({
		startDate,
		endDate
	}) {
		try {
			const myHeaders = new Headers();
			const formdata = new FormData();
			if (startDate != null) {
				formdata.append("startDate", `${startDate}`);
				formdata.append("endDate", `${endDate}`);
			}
			const response = await fetch(API_ENDPOINT.INFO_TRANSAKSI_PEMBELIAN, {
				method: 'POST',
				headers: myHeaders,
				body: formdata
			});
			const responseJson = await response.json();
			return responseJson;
		} catch (err) {
			// Autentication.autoLogout();
			return err;
		}
	}

	static async deleteTransactions(faktur) {
		const myHeaders = new Headers();
		const formdata = new FormData();

		formdata.append("faktur", `${faktur}`);

		const response = await fetch(API_ENDPOINT.DELETE_TRANSACTIONS_PEMBELIAN, {
			method: 'POST',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

}

export default ApiPembelian;
