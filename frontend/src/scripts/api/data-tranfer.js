/* eslint-disable new-cap */
import API_ENDPOINT from '../config/globals/endpoint.js';
import Autentication from '../utils/autentication.js';

class ApiTransfer {

	static async getLaporanNeraca(startDate, endDate) {
		try {
			const myHeaders = new Headers();
			const formdata = new FormData();
			formdata.append("startDate", `${startDate}`);
			formdata.append("endDate", `${endDate}`);

			const response = await fetch(API_ENDPOINT.LAPORAN_NERACA, {
				method: 'post',
				headers: myHeaders,
				body: formdata
			});
			return response.json();
		} catch (err) {
			Autentication.autoLogout();
			return {};
		}
	}
	static async getFaktur() {
		try {
			const response = await fetch(API_ENDPOINT.FAKTUR_TRANSFER);
			const responseJson = await response.json();
			return responseJson;
		} catch (err) {
			Autentication.autoLogout();
			return {};
		}
	}

	static async getListSaldo() {
		try {
			const response = await fetch(API_ENDPOINT.GET_ALL_SALDO);
			const responseJson = await response.json();
			return responseJson;
		} catch (err) {
			Autentication.autoLogout();
			return {};
		}
	}

	static async getSaldoByID($noRekening) {
			const myHeaders = new Headers();
			const formdata = new FormData();
			formdata.append("no_rekening", `${$noRekening}`);
			const response = await fetch(API_ENDPOINT.GET_SALDO_BY_REKENING, {
				method: 'POST',
				headers: myHeaders,
				body: formdata
			});
			return response.json();
	}

	static async addKas({
		faktur,
		date,
		pemasukan,
		pengeluaran,
		source,
		mode,
		referensi,
		keterangan
	}) {
		const myHeaders = new Headers();
		const formdata = new FormData();

		formdata.append("faktur", `${faktur}`);
		formdata.append("date", `${date}`);
		formdata.append("pemasukan", `${pemasukan}`);
		formdata.append("pengeluaran", `${pengeluaran}`);
		formdata.append("source", `${source}`);
		formdata.append("referensi", `${referensi}`);
		formdata.append("mode", `${mode}`);
		formdata.append("keterangan", `${keterangan}`);

		const response = await fetch(API_ENDPOINT.ADD_KAS, {
			method: 'POST',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

	static async getInfoTransaksiBarang({
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
			const response = await fetch(API_ENDPOINT.LAPORAN_INFO_TRANSAKSI_BARANG, {
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

	static async getSourceKas() {
		try {
			const response = await fetch(API_ENDPOINT.LIST_SOURCE_KAS);
			const responseJson = await response.json();
			return responseJson;
		} catch (err) {
			return {};
		}
	}

	static async deleteLaporanKas(id) {
		let response = '';
		await $.ajax({
			type: "POST",
			url: `${API_ENDPOINT.DELETE_LAPORAN_KAS}`,
			dataType: "JSON",
			data: {
				id: id
			},
			success: function (data) {
				response = '200';
			},
			error: (data) => {
				response = '500';
			}
		});

		return response;
	}

	static async deleteLaporanKasTransfer(id) {
		let response = '';
		await $.ajax({
			type: "POST",
			url: `${API_ENDPOINT.DELETE_LAPORAN_KAS_BY_FAKTUR}`,
			dataType: "JSON",
			data: {
				id: id
			},
			success: function (data) {
				response = '200';
			},
			error: (data) => {
				response = '500';
			}
		});

		return response;
	}
}

export default ApiTransfer;
