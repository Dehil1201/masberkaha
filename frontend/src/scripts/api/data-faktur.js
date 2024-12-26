 
import API_ENDPOINT from '../config/globals/endpoint.js';

class ApiFaktur {
	static async Pembelian(nota) {
		const myHeaders = new Headers();
		const formdata = new FormData();
		formdata.append("faktur", `${nota}`);

		const response = await fetch(API_ENDPOINT.DATA_PEMBELIAN_FAKTUR, {
			method: 'post',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

    static async Penjualan(nota) {
		const myHeaders = new Headers();
		const formdata = new FormData();
		formdata.append("faktur", `${nota}`);

		const response = await fetch(API_ENDPOINT.DATA_PENJUALAN_FAKTUR, {
			method: 'post',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

    static async Labarugi(nota) {
		const myHeaders = new Headers();
		const formdata = new FormData();
		formdata.append("faktur", `${nota}`);

		const response = await fetch(API_ENDPOINT.DATA_LABARUGI, {
			method: 'post',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

    static async PenjualanQuantity(nota) {
		const myHeaders = new Headers();
		const formdata = new FormData();
		formdata.append("faktur", `${nota}`);

		const response = await fetch(API_ENDPOINT.DATA_QUANTITY_FAKTUR, {
			method: 'post',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

    static async Buyback(nota) {
		const myHeaders = new Headers();
		const formdata = new FormData();
		formdata.append("faktur", `${nota}`);

		const response = await fetch(API_ENDPOINT.DATA_BUYBACK_FAKTUR, {
			method: 'post',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

	static async deleteDetailTransPembelian(kode_barang, faktur) {
		const myHeaders = new Headers();
		const formdata = new FormData();

		formdata.append("kode_barang", `${kode_barang}`);
		formdata.append("faktur", `${faktur}`);

		const response = await fetch(API_ENDPOINT.DELETE_TRANSACTIONS_DETAIL_PEMBELIAN, {
			method: 'POST',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

	static async deleteDetailTransPenjualan(kode_barang, faktur) {
		const myHeaders = new Headers();
		const formdata = new FormData();

		formdata.append("kode_barang", `${kode_barang}`);
		formdata.append("faktur", `${faktur}`);

		const response = await fetch(API_ENDPOINT.DELETE_TRANSACTIONS_DETAIL_PENJUALAN, {
			method: 'POST',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

	static async deleteDetailTransBuyback(kode_barang, faktur) {
		const myHeaders = new Headers();
		const formdata = new FormData();

		formdata.append("kode_barang", `${kode_barang}`);
		formdata.append("faktur", `${faktur}`);

		const response = await fetch(API_ENDPOINT.DELETE_TRANSACTIONS_DETAIL_BUYBACK, {
			method: 'POST',
			headers: myHeaders,
			body: formdata
		});
		return response.json();
	}

}

export default ApiFaktur;
