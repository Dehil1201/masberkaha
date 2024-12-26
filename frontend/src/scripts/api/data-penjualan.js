/* eslint-disable new-cap */
import API_ENDPOINT from '../config/globals/endpoint.js';
import Autentication from '../utils/autentication.js';

class ApiPenjualan {
	static async getPenjualanDetail(user_id) {
		const myHeaders = new Headers();
		const formdata = new FormData();
		formdata.append("user_id", `${user_id}`);

		const response = await fetch(API_ENDPOINT.LIST_PENJUALAN_DETAIL, {
			method: 'GET',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

	static async getFaktur() {
		try {
			const response = await fetch(API_ENDPOINT.FAKTUR_OTOMATIS);
			const responseJson = await response.json();
			return responseJson;
		} catch (err) {
			Autentication.autoLogout();
			return {};
		}
	}

	static async addDetail({
		user_id,
		idBarang,
		kodeBarang,
		harga,
		ongkos,
		markupHarga
	}) {
		const myHeaders = new Headers();
		const formdata = new FormData();

		formdata.append("id_barang", `${idBarang}`);
		formdata.append("kode_barang", `${kodeBarang}`);
		formdata.append("user_id", `${user_id}`);
		formdata.append("harga", `${harga}`);
		formdata.append("ongkos", `${ongkos}`);
		formdata.append("markup_harga", `${markupHarga}`);

		const response = await fetch(API_ENDPOINT.ADD_DETAIL_PENJUALAN, {
			method: 'POST',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

	static async saveFoto({
		kodeBarang,
		foto
	}) {
		const myHeaders = new Headers();
		const formdata = new FormData();

		formdata.append("kode_barang", `${kodeBarang}`);
		formdata.append("foto", `${foto}`);

		const response = await fetch(API_ENDPOINT.SAVE_FOTO_BARANG, {
			method: 'POST',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

	static async getBarangRow(valueBarcode) {
		const myHeaders = new Headers();
		const formdata = new FormData();
		formdata.append("kode_barang", `${valueBarcode}`);

		const response = await fetch(API_ENDPOINT.GET_BARANG_ROW, {
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
		foto,
	}) {
		const myHeaders = new Headers();
		const formdata = new FormData();

		formdata.append("kode_barang", `${kodeBarang}`);
		formdata.append("harga_asal", `${harga_asal}`);
		formdata.append("user_id", `${user_id}`);
		formdata.append("foto", `${foto}`);

		const response = await fetch(API_ENDPOINT.DELETE_DETAIL_PENJUALAN, {
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
		tempo,
		point
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
		formdata.append("point", `${point}`);
		const response = await fetch(API_ENDPOINT.TRANSACTION_PENJUALAN, {
			method: 'POST',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

	static async deleteTransactions(faktur) {
		const myHeaders = new Headers();
		const formdata = new FormData();

		formdata.append("faktur", `${faktur}`);

		const response = await fetch(API_ENDPOINT.DELETE_TRANSACTIONS_PENJUALAN, {
			method: 'POST',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

	static async getInfoTransaksiPenjualan({
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
			const response = await fetch(API_ENDPOINT.INFO_TRANSAKSI_PENJUALAN, {
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

	static async updateDetail({
		kodeBarang,
		ongkos,
		harga,
		berat
	}) {
		const myHeaders = new Headers();
		const formdata = new FormData();

		formdata.append("kode_barang", `${kodeBarang}`);
		formdata.append("ongkos", `${ongkos}`);
		formdata.append("harga", `${harga}`);
		formdata.append("berat", `${berat}`);

		const response = await fetch(API_ENDPOINT.UPDATE_DETAIL_PENJUALAN, {
			method: 'POST',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

	static async checkFoto(kodeBarang) {
		try {
			const response = await fetch(API_ENDPOINT.CHECK_FOTO(kodeBarang));
			const responseJson = await response.json();
			return responseJson;
		} catch (err) {
			return {};
		}
	}
}

export default ApiPenjualan;
