/* eslint-disable new-cap */
import API_ENDPOINT from '../config/globals/endpoint.js';

class ApiLogin {

	static async Login({
		username,
		password
	}) {
		const myHeaders = new Headers();
		const formdata = new FormData();

		formdata.append("username", `${username}`);
		formdata.append("password", `${password}`);

		const response = await fetch(API_ENDPOINT.LOGIN, {
			method: 'POST',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

	static async LoginKasir({
		username,
		password
	}) {
		const myHeaders = new Headers();
		const formdata = new FormData();

		formdata.append("username", `${username}`);
		formdata.append("password", `${password}`);

		const response = await fetch(API_ENDPOINT.CHANGE_KASIR, {
			method: 'POST',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

	static async CheckingPassword({
		username,
		password
	}) {
		const myHeaders = new Headers();
		const formdata = new FormData();

		formdata.append("username", `${username}`);
		formdata.append("password", `${password}`);

		const response = await fetch(API_ENDPOINT.CHECKING_PASSWORD, {
			method: 'POST',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

	static async Logout() {
		try {
			const response = await fetch(API_ENDPOINT.LOGOUT);
			const responseJson = await response.json();
			return responseJson;
		} catch (err) {
			return {};
		}
	}


}

export default ApiLogin;
