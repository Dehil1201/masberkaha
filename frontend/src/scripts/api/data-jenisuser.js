/* eslint-disable new-cap */
import API_ENDPOINT from '../config/globals/endpoint.js';
import Autentication from '../utils/autentication.js';

class ApiJenisUser {
	static async getJenisUser() {
		try {
			const response = await fetch(API_ENDPOINT.LIST_JENISUSER);
			const responseJson = await response.json();
			return responseJson;
		} catch (err) {
			Autentication.autoLogout();
			return {};
		}
	}

	static async addJenisUser(dataForm) {
		try {
			let response = '';
		await $.ajax({
			url: API_ENDPOINT.INSERT_JENISUSER,
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
		} catch (error) {
			Autentication.autoLogout();
		}
		
	}

	static async updateJenisUser(dataForm) {
		let response = '';
		await $.ajax({
			url: API_ENDPOINT.UPDATE_JENISUSER,
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

	static async deleteJenisUser(id) {
		let response = '';
		await $.ajax({
			type: "POST",
			url: `${API_ENDPOINT.DELETE_JENISUSER}`,
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

export default ApiJenisUser;
