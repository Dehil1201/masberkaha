/* eslint-disable new-cap */
import API_ENDPOINT from '../config/globals/endpoint.js';
import Autentication from '../utils/autentication.js';

class ApiHutang {
	static async getHutang() {
		try {
			const response = await fetch(API_ENDPOINT.LIST_HUTANG);
			const responseJson = await response.json();
			return responseJson;
		} catch (err) {
			Autentication.autoLogout();
			return {};
		}
	}

	static async getFaktur(fakturBeli) {
		const myHeaders = new Headers();
		const formdata = new FormData();
		formdata.append("fakturBeli", `${fakturBeli}`);
		try {
			const response = await fetch(API_ENDPOINT.FAKTUR_OTOMATIS_HUTANG, {
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

	static async getHutangRow(fakturBeli) {
		const myHeaders = new Headers();
		const formdata = new FormData();
		formdata.append("faktur_beli", `${fakturBeli}`);
		try {
			const response = await fetch(API_ENDPOINT.LIST_HUTANG_ROW, {
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

	static async transactionsHutang({
		faktur,
		fakturBeli,
		hutang_terbayar,
		bayar_tunai,
		hutang_sisa
	}) {
		const myHeaders = new Headers();
		const formdata = new FormData();

		formdata.append("faktur", `${faktur}`);
		formdata.append("faktur_beli", `${fakturBeli}`);
		formdata.append("hutang_terbayar", `${hutang_terbayar}`);
		formdata.append("bayar_tunai", `${bayar_tunai}`);
		formdata.append("hutang_sisa", `${hutang_sisa}`);
		const response = await fetch(API_ENDPOINT.INSERT_HUTANG, {
			method: 'POST',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

	static async deleteHutang(id) {
		let response = '';
		await $.ajax({
			type: "POST",
			url: `${API_ENDPOINT.DELETE_HUTANG}`,
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

export default ApiHutang;
