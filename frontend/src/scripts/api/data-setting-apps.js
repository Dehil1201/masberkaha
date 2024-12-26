/* eslint-disable new-cap */
import API_ENDPOINT from '../config/globals/endpoint.js';
import Autentication from '../utils/autentication.js';

class ApiSettingApps {
	static async getSettingApps() {
		try {
			const response = await fetch(API_ENDPOINT.LIST_SETTING);
			const responseJson = await response.json();
			return responseJson;
		} catch (err) {
			Autentication.autoLogout();
			return {};
		}
	}

	static async updateSettingApps({
		id,
		harga_potongan
	}) {
		const myHeaders = new Headers();
		const formdata = new FormData();
		formdata.append("pengaturan_id", `${id}`);
		formdata.append("harga_potongan", `${harga_potongan}`);

		const response = await fetch(API_ENDPOINT.UPDATE_PENGATURAN, {
			method: 'POST',
			headers: myHeaders,
			body: formdata,
			redirect: 'follow'
		});
		return response.json();
	}

	static async updateSettingHarga({
		jumlah_harga,
		status
	}) {
		const myHeaders = new Headers();
		const formdata = new FormData();
		formdata.append("jumlah_harga", `${jumlah_harga}`);
		formdata.append("status", `${status}`);

		const response = await fetch(API_ENDPOINT.UPDATE_ALLBARANG, {
			method: 'POST',
			headers: myHeaders,
			body: formdata,
			redirect: 'follow'
		});
		return response.json();
	}

	static async updateHargaPasar({
		harga_pasar
	}) {
		const myHeaders = new Headers();
		const formdata = new FormData();
		formdata.append("harga_pasar", `${harga_pasar}`);

		const response = await fetch(API_ENDPOINT.UPDATE_HARGA_PASAR, {
			method: 'POST',
			headers: myHeaders,
			body: formdata,
			redirect: 'follow'
		});
		return response.json();
	}

	static async updateSettingToko({
		id,
		nama_toko,
		alamat,
		no_hp,
		email,
		point_gram
	}) {
		const myHeaders = new Headers();
		const formdata = new FormData();
		formdata.append("pengaturan_id", `${id}`);
		formdata.append("nama_toko", `${nama_toko}`);
		formdata.append("alamat", `${alamat}`);
		formdata.append("no_hp", `${no_hp}`);
		formdata.append("email", `${email}`);
		formdata.append("point_gram", `${point_gram}`);

		const response = await fetch(API_ENDPOINT.UPDATE_TOKO, {
			method: 'POST',
			headers: myHeaders,
			body: formdata,
			redirect: 'follow'
		});
		return response.json();
	}

	static async emptyTable({
		table,
		startDate,
		endDate
	}) {
		const myHeaders = new Headers();
		const formdata = new FormData();
		formdata.append("table", `${table}`);
		formdata.append("startDate", `${startDate}`);
		formdata.append("endDate", `${endDate}`);

		const response = await fetch(API_ENDPOINT.EMPTY_TABLE, {
			method: 'POST',
			headers: myHeaders,
			body: formdata,
			redirect: 'follow'
		});
		return response.json();
	}

	static todayDate() {
		let today = new Date();
		let dd = today.getDate();
		let mm = today.getMonth() + 1; //January is 0!
		let yyyy = today.getFullYear();
		if (dd < 10) { dd = '0' + dd } if (mm < 10) { mm = '0' + mm } today = yyyy + '-' + mm + '-' + dd;
		return today;
	}
}

export default ApiSettingApps;
