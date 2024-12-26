/* eslint-disable new-cap */
import API_ENDPOINT from '../config/globals/endpoint.js';

class ApiSaldo {

	static async addSaldo(dataForm) {
		let response = '';
		await $.ajax({
			url: API_ENDPOINT.ADD_SALDO,
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

	static async updateSaldo(dataForm) {
		let response = '';
		await $.ajax({
			url: API_ENDPOINT.UPDATE_SALDO,
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

	static async deleteSaldo(id) {
		let response = '';
		await $.ajax({
			type: "POST",
			url: `${API_ENDPOINT.DELETE_SALDO}`,
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

	static scynchSaldo() {
		let myHeaders = new Headers();
		let requestOptions = {
			method: 'GET',
			headers: myHeaders,
			redirect: 'follow'
		};

		let responseText = 'false'

		fetch(API_ENDPOINT.SYNCH_SALDO, requestOptions)
			.then(response => response.text())
			.then(result => responseText = result)
			.catch(error => console.log('error', error));

		if (responseText == 'true') {
			return true
		} else {
			return false
		}
	}
}

export default ApiSaldo;
