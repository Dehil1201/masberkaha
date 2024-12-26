/* eslint-disable new-cap */
import API_ENDPOINT from '../config/globals/endpoint.js';
import Autentication from '../utils/autentication.js';
import FormatCurrency from '../utils/initial-currency.js';

class ApiBeliKembali {
	static async getPenjualanDetail(nota) {
		const myHeaders = new Headers();
		const formdata = new FormData();
		formdata.append("faktur", `${nota}`);

		const response = await fetch(API_ENDPOINT.LIST_PENJUALAN_DETAIL_NOTA, {
			method: 'post',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

	static async getNotaByKode(kodeBarang) {
		const myHeaders = new Headers();
		const formdata = new FormData();
		formdata.append("kode_barang", `${kodeBarang}`);

		const response = await fetch(API_ENDPOINT.GET_NOTA_PENJUALAN, {
			method: 'post',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

	static async checkBarangJual(kodeBarang) {
		const myHeaders = new Headers();
		const formdata = new FormData();
		formdata.append("kode_barang", `${kodeBarang}`);

		const response = await fetch(API_ENDPOINT.CHECK_BARANG_JUAL, {
			method: 'post',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

	static async getPembelianDetail(userId) {
		try {
			const response = await fetch(API_ENDPOINT.LIST_DETAIL_BELIKEMBALI(userId));
			const responseJson = await response.json();
			return responseJson;
		} catch (err) {
			return {};
		}
	}

	static async getFaktur(notaPenjualan) {
		const myHeaders = new Headers();
		const formdata = new FormData();
		formdata.append("notaPenjualan", `${notaPenjualan}`);
		try {
			const response = await fetch(API_ENDPOINT.FAKTUR_BELIKEMBALI, {
				method: 'POST',
				headers: myHeaders,
				body: formdata
			});
			const responseJson = await response.json();
			return responseJson;
		} catch (err) {
			return false;
		}
	}

	static async getFakturOldstok(kode_barang) {
		const myHeaders = new Headers();
		const formdata = new FormData();
		try {
			const response = await fetch(API_ENDPOINT.DATA_BUYBACK_OLDSTOK_FAKTUR, {
				method: 'POST',
				headers: myHeaders,
				body: formdata
			});
			const responseJson = await response.json();
			return responseJson;
		} catch (err) {
			return false;
		}
	}

	static async addDetail({
		notaPenjualan,
		idBarang,
		kodeBarang,
		user_id,
		harga_beli,
		berat,
		biaya_servis,
		potongan,
		status
	}) {
		const myHeaders = new Headers();
		const formdata = new FormData();
		formdata.append("nota", `${notaPenjualan}`);
		formdata.append("id_barang", `${idBarang}`);
		formdata.append("kode_barang", `${kodeBarang}`);
		formdata.append("user_id", `${user_id}`);
		formdata.append("harga_beli", `${harga_beli}`);
		formdata.append("berat", `${berat}`);
		formdata.append("biaya_servis", `${biaya_servis}`);
		if (potongan === null || potongan == '') {
			formdata.append("potongan", 0);
		} else {
			formdata.append("potongan", `${potongan}`);
		}
		formdata.append("status", `${status}`);
		const response = await fetch(API_ENDPOINT.ADD_DETAIL_BELIKEMBALI, {
			method: 'POST',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

	static async updateDetail(dataForm) {
		let formData = dataForm;
		let hargaNota = await FormatCurrency.getValue(document.getElementById('harga_nota').value);
		let potongan = await FormatCurrency.getValue(document.getElementById('potongan').value);
		let servis = await FormatCurrency.getValue(document.getElementById('servis').value);
		formData.set('harga_nota', hargaNota);
		formData.set('potongan', potongan);
		formData.set('servis', servis);
		let response = '';
		await $.ajax({
			url: API_ENDPOINT.UPDATE_DETAIL_BUYBACK,
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

	static async destroyDetail({
		notaPenjualan,
		kodeBarang
	}) {
		const myHeaders = new Headers();
		const formdata = new FormData();
		formdata.append("nota", `${notaPenjualan}`);
		formdata.append("kode_barang", `${kodeBarang}`);
		const response = await fetch(API_ENDPOINT.DESTROY_DETAIL_BELIKEMBALI, {
			method: 'POST',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

	static async getTotal() {
		try {
			const response = await fetch(API_ENDPOINT.TOTAL_DETAIL);
			const responseJson = await response.json();
			return responseJson;
		} catch (err) {
			Autentication.autoLogout();
			return {};
		}
	}

	static async transactionsPayment({
		nota,
		faktur,
		date,
		pengeluaran,
		grand_total,
		user_id,
		pelanggan_id
	}) {
		const myHeaders = new Headers();
		const formdata = new FormData();

		formdata.append("nota", `${nota}`);
		formdata.append("faktur", `${faktur}`);
		formdata.append("pengeluaran", `${pengeluaran}`);
		formdata.append("grand_total", `${grand_total}`);
		formdata.append("user_id", `${user_id}`);
		formdata.append("pelanggan_id", `${pelanggan_id}`);
		formdata.append("date", `${date}`);
		const response = await fetch(API_ENDPOINT.TRANSACTION_BELIKEMBALI, {
			method: 'POST',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

	static async getInfoTransaksiBuyback({
		startDate,
		endDate,
		user,
		pelanggan
	}) {
		try {
			const myHeaders = new Headers();
			const formdata = new FormData();
			if (startDate != null) {
				formdata.append("startDate", `${startDate}`);
				formdata.append("endDate", `${endDate}`);
			}
			if (user != null) {
				formdata.append("user", `${user}`);
			}
			if (pelanggan != null) {
				console.log(pelanggan)
				formdata.append("pelanggan", `${pelanggan}`);
			}
			const response = await fetch(API_ENDPOINT.INFO_TRANSAKSI_BUYBACK, {
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

		const response = await fetch(API_ENDPOINT.DELETE_TRANSACTIONS_BUYBACK, {
			method: 'POST',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

}

export default ApiBeliKembali;
