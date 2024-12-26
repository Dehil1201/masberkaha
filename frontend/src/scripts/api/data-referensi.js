/* eslint-disable new-cap */
import API_ENDPOINT from '../config/globals/endpoint.js';

class ApiReferensi {

	static async addReferensi(dataForm) {
		let response = '';
		await $.ajax({
			url: API_ENDPOINT.ADD_REFERENSI,
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

	static async updateReferensi(dataForm) {
		let response = '';
		await $.ajax({
			url: API_ENDPOINT.UPDATE_REFERENSI,
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

	static async deleteReferensi(id) {
		let response = '';
		await $.ajax({
			type: "POST",
			url: `${API_ENDPOINT.DELETE_REFERENSI}`,
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

export default ApiReferensi;
