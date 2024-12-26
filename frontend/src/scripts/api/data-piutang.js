/* eslint-disable new-cap */
import API_ENDPOINT from '../config/globals/endpoint.js';
import Autentication from '../utils/autentication.js';

class ApiPiutang {
	static async getPiutang() {
		try {
			const response = await fetch(API_ENDPOINT.LIST_PIUTANG);
			const responseJson = await response.json();
			return responseJson;
		} catch (err) {
			Autentication.autoLogout();
			return {};
		}
	}

	static async getFaktur(fakturJual) {
		const myHeaders = new Headers();
		const formdata = new FormData();
		formdata.append("fakturJual", `${fakturJual}`);
		try {
			const response = await fetch(API_ENDPOINT.FAKTUR_OTOMATIS_PIUTANG, {
				method: 'POST',
				headers: myHeaders,
				body: formdata
			});
			const responseJson = await response.json();
			return responseJson;
		} catch (err) {
			Autentication.autoLogout();
			return {};
		}
	}

	static async getPiutangRow(fakturJual) {
		const myHeaders = new Headers();
		const formdata = new FormData();
		formdata.append("faktur_jual", `${fakturJual}`);
		try {
			const response = await fetch(API_ENDPOINT.LIST_PIUTANG_ROW, {
				method: 'POST',
				headers: myHeaders,
				body: formdata
			});
			const responseJson = await response.json();
			return responseJson;
		} catch (err) {
			// Autentication.autoLogout();
			// return {};
		}
	}

	static async transactionsPiutang({
		faktur,
		fakturJual,
		piutang_terbayar,
		bayar_tunai,
		piutang_sisa
	}) {
		const myHeaders = new Headers();
		const formdata = new FormData();

		formdata.append("faktur", `${faktur}`);
		formdata.append("faktur_jual", `${fakturJual}`);
		formdata.append("piutang_terbayar", `${piutang_terbayar}`);
		formdata.append("bayar_tunai", `${bayar_tunai}`);
		formdata.append("piutang_sisa", `${piutang_sisa}`);
		const response = await fetch(API_ENDPOINT.INSERT_PIUTANG, {
			method: 'POST',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

	static async deletePiutang(id) {
		let response = '';
		await $.ajax({
			type: "POST",
			url: `${API_ENDPOINT.DELETE_PIUTANG}`,
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

export default ApiPiutang;
