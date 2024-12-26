/* eslint-disable new-cap */
import API_ENDPOINT from '../config/globals/endpoint.js';
import Autentication from '../utils/autentication.js';

class ApiQuantity {
	static async getQuantityDetail(user_id) {
		const myHeaders = new Headers();
		const formdata = new FormData();
		formdata.append("user_id", `${user_id}`);

		const response = await fetch(API_ENDPOINT.LIST_QUANTITY_DETAIL, {
			method: 'GET',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

	static async getFaktur() {
		try {
			const response = await fetch(API_ENDPOINT.FAKTUR_OTOMATIS_QUANTITY);
			const responseJson = await response.json();
			return responseJson;
		} catch (err) {
			Autentication.autoLogout();
			return {};
		}
	}

	static async addDetail({ user_id, idBarang, kodeBarang, harga, markupHarga, qty }) {
		const myHeaders = new Headers();
		const formdata = new FormData();

		formdata.append("id_barang", `${idBarang}`);
		formdata.append("kode_barang", `${kodeBarang}`);
		formdata.append("user_id", `${user_id}`);
		formdata.append("harga", `${harga}`);
		formdata.append("markup_harga", `${markupHarga}`);
		formdata.append("qty", `${qty}`);

		const response = await fetch(API_ENDPOINT.ADD_DETAIL_QUANTITY, {
			method: 'POST',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

	static async getBarangRowQuantity(valueBarcode) {
		const myHeaders = new Headers();
		const formdata = new FormData();
		formdata.append("kode_barang", `${valueBarcode}`);

		const response = await fetch(API_ENDPOINT.GET_BARANG_ROW_QUANTITY, {
			method: 'POST',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

	static async deleteDetail({
		user_id,
		harga_asal,
		kodeBarang,
		qty,
	}) {
		const myHeaders = new Headers();
		const formdata = new FormData();

		formdata.append("kode_barang", `${kodeBarang}`);
		formdata.append("harga_asal", `${harga_asal}`);
		formdata.append("user_id", `${user_id}`);
		formdata.append("qty", `${qty}`);

		const response = await fetch(API_ENDPOINT.DELETE_DETAIL_QUANTITY, {
			method: 'POST',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

	static async transactionsPayment({
		faktur,
		pelanggan_id,
		date,
		pemasukan,
		grand_total,
		bayar,
		kembali,
		user_id,
		status_bayar,
		tempo
	}) {
		const myHeaders = new Headers();
		const formdata = new FormData();

		formdata.append("faktur", `${faktur}`);
		formdata.append("pelanggan_id", `${pelanggan_id}`);
		formdata.append("pemasukan", `${pemasukan}`);
		formdata.append("grand_total", `${grand_total}`);
		formdata.append("bayar", `${bayar}`);
		formdata.append("kembali", `${kembali}`);
		formdata.append("user_id", `${user_id}`);
		formdata.append("status_bayar", `${status_bayar}`);
		formdata.append("tempo", `${tempo}`);
		formdata.append("date", `${date}`);
		const response = await fetch(API_ENDPOINT.TRANSACTION_QUANTITY, {
			method: 'POST',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}
	static async updateQtyDetail({
		kodeBarang,
		qty,
		harga
	}) {
		const myHeaders = new Headers();
		const formdata = new FormData();

		formdata.append("kode_barang", `${kodeBarang}`);
		formdata.append("qty", `${qty}`);
		formdata.append("harga", `${harga}`);

		const response = await fetch(API_ENDPOINT.UPDATE_QTY_DETAIL_PENJUALAN, {
			method: 'POST',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}
}

export default ApiQuantity;
