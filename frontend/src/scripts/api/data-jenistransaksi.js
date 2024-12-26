/* eslint-disable new-cap */
import API_ENDPOINT from '../config/globals/endpoint.js';
import Autentication from '../utils/autentication.js';

class ApiJenisTransaksi {
	static async getJenisTransaksi() {
		try {
			const response = await fetch(API_ENDPOINT.LIST_JENISTRANSAKSI);
			const responseJson = await response.json();
			return responseJson;
		} catch (err) {
			Autentication.autoLogout();
			return {};
		}
	}

	static async getJenisTransaksiRow(tipe) {
		try {
			const response = await fetch(API_ENDPOINT.GET_JENIS_TRANSAKSI_ROW(tipe));
			const responseJson = await response.json();
			return responseJson;
		} catch (err) {
			Autentication.autoLogout();
			return {};
		}
	}

	static async addJenisTransaksi(dataForm) {
		let response = '';
		await $.ajax({
			url: API_ENDPOINT.INSERT_JENISTRANSAKSI,
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

	static async updateJenisTransaksi(dataForm) {
		let response = '';
		await $.ajax({
			url: API_ENDPOINT.UPDATE_JENISTRANSAKSI,
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

	static async deleteJenisTransaksi(id) {
		let response = '';
		await $.ajax({
			type: "POST",
			url: `${API_ENDPOINT.DELETE_JENISTRANSAKSI}`,
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

export default ApiJenisTransaksi;
