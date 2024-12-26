/* eslint-disable new-cap */
import API_ENDPOINT from '../config/globals/endpoint.js';
import Autentication from '../utils/autentication.js';

class ApiJenisBarang {
	static async getJenisBarang() {
		try {
			const response = await fetch(API_ENDPOINT.LIST_JENISBARANG);
			const responseJson = await response.json();
			return responseJson;
		} catch (err) {
			Autentication.autoLogout();
			return {};
		}
	}

	static async addJenisBarang(dataForm, quantity) {
		let response = '';
		let formData = dataForm;
		formData.set('penjualan_satuan', (quantity) ? 1 : 0);
		await $.ajax({
			url: API_ENDPOINT.INSERT_JENISBARANG,
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

	static async updateJenisBarang(dataForm, quantity) {
		let response = '';
		let formData = dataForm;
		formData.set('penjualan_satuan', (quantity) ? 1 : 0);
		await $.ajax({
			url: API_ENDPOINT.UPDATE_JENISBARANG,
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

	static async deleteJenisBarang(id) {
		let response = '';
		await $.ajax({
			type: "POST",
			url: `${API_ENDPOINT.DELETE_JENISBARANG}`,
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

export default ApiJenisBarang;
