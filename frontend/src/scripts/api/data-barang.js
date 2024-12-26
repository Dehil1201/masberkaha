/* eslint-disable new-cap */
import API_ENDPOINT from '../config/globals/endpoint.js';
import Autentication from '../utils/autentication.js';
import FormatCurrency from '../utils/initial-currency.js';

class ApiBarang {
	static async getBarang() {
		try {
			const response = await fetch(API_ENDPOINT.LIST_BARANG);
			const responseJson = await response.json();
			return responseJson;
		} catch (err) {
			Autentication.autoLogout();
			return {};
		}
	}

	static async getKodeBarang(kodeJenis) {
		try {
			const myHeaders = new Headers();
			const formdata = new FormData();
			formdata.append("kode_jenis", `${kodeJenis}`);
			const response = await fetch(API_ENDPOINT.AUTOKODE_BARANG, {
				method: 'POST',
				headers: myHeaders,
				body: formdata
			});
			const responseJson = await response.json();
			return responseJson;
		} catch (error) {
			Autentication.autoLogout();
			return {};
		}
	}

	static async getInfoHistory(kodeBarang) {
		try {
			const response = await fetch(API_ENDPOINT.HISTORY_GET_INFO(kodeBarang));
			const responseJson = await response.json();
			return responseJson;
		} catch (err) {
			return {};
		}
	}

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

	static async getJenisBarangRow(jenis) {
		try {
			const response = await fetch(API_ENDPOINT.GET_JENIS_BARANG_ROW(jenis));
			const responseJson = await response.json();
			return responseJson;
		} catch (err) {
			Autentication.autoLogout();
			return {};
		}
	}

	static async addBarang(dataForm, foto) {
		let response = '';
		let formData = dataForm;
		let hargaBeli = await FormatCurrency.getValue(document.getElementById('harga_beli').value);
		let hargaJual = await FormatCurrency.getValue(document.getElementById('harga_jual').value);
		formData.set('harga_beli', hargaBeli);
		formData.set('harga_jual', hargaJual);
		formData.set('foto', foto);
		await $.ajax({
			url: API_ENDPOINT.INSERT_BARANG,
			type: "POST",
			dataType: 'json',
			data: formData,
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
	static async changeStatusBarang({
		kode_barang,
		status_barang
	}) {
		const myHeaders = new Headers();
		const formdata = new FormData();

		formdata.append("kode_barang", `${kode_barang}`);
		formdata.append("status_barang", `${status_barang}`);
		const response = await fetch(API_ENDPOINT.CHANGE_STATUS_BARANG, {
			method: 'POST',
			headers: myHeaders,
			body: formdata
		});


	}

	static async updateBarang(dataForm, foto) {
		let formData = dataForm;
		let hargaBeli = await FormatCurrency.getValue(document.getElementById('harga_beli').value);
		let hargaJual = await FormatCurrency.getValue(document.getElementById('harga_jual').value);
		formData.set('harga_beli', hargaBeli);
		formData.set('harga_jual', hargaJual);
		formData.set('foto', foto);
		let response = '';
		await $.ajax({
			url: API_ENDPOINT.UPDATE_BARANG,
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

	static async updateDataBarang({
		berat,
		hargaBeli,
		kode_barang
	}) {
		try {
			const myHeaders = new Headers();
			const formdata = new FormData();
			formdata.append("berat", `${berat}`);
			formdata.append("harga_beli", `${hargaBeli}`);
			formdata.append("kode_barang", `${kode_barang}`);
			const response = await fetch(API_ENDPOINT.CHANGE_DATA_BARANG, {
				method: 'POST',
				headers: myHeaders,
				body: formdata
			});
		} catch (error) {
			Autentication.autoLogout();
		}
	}

	static async deleteBarang(id, foto) {
		let response = '';
		await $.ajax({
			type: "POST",
			url: `${API_ENDPOINT.DELETE_BARANG}`,
			dataType: "JSON",
			data: {
				id: id,
				foto: foto
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

export default ApiBarang;
