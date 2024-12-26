import API_ENDPOINT from "../../config/globals/endpoint.js";
import FakturInitiator from "../utils/initial_faktur.js";
import ApiPenjualan from "../../api/data-penjualan.js";

function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}
const LaporanLabaRugi = {
	async _setDate() {
		document.getElementById('startDate').focus();
		document.getElementById('startDate').valueAsDate = new Date();
		document.getElementById('endDate').valueAsDate = new Date();
	},

	async initLabarugiNota() {
		await this._show();
		await this._refreshData();
		await this.initFilterLabaRugi();
		await this._initPrintFaktur();
		this._initialViewPenjualan();
	},

	async _refreshData() {
		document.getElementById('refresh').addEventListener('click', async () => {
			await this._show();
		});
	},

	async _show() {
		let table = await $('#kelolaTable').DataTable({
			"processing": true,
			"destroy": true,
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			"serverSide": true,
			"ajax": {
				"url": `${API_ENDPOINT.FILTER_DATA_LABARUGI}`,
				"data": {
					startDate: new Date().toISOString().split('T')[0],
					endDate: new Date().toISOString().split('T')[0]
				},
				"type": "POST"
			},
			lengthChange: true,
			"lengthMenu": [10, 50, 100, 250, 500, 1000],
			"fnDrawCallback": function (data) {
				var api = this.api();
				$(api.column(6).footer()).html('' + data.json.berat + '');
				$(api.column(7).footer()).html('' + data.json.subtotal + '');
				$(api.column(8).footer()).html('' + data.json.ongkos + '');
				$(api.column(9).footer()).html('' + data.json.grand_total + '');
				$(api.column(10).footer()).html('' + data.json.pokok_modal + '');
				$(api.column(11).footer()).html('' + data.json.labarugi + '');
				$(api.column(12).footer()).html('' + data.json.labarugi_ongkos + '');
				document.getElementById('jumlahNota').innerHTML = `${data.json.recordsFiltered}`;
				document.getElementById('subTotal').innerHTML = `${data.json.subtotal}`;
				document.getElementById('totalOngkos').innerHTML = `${data.json.ongkos}`;
				document.getElementById('totalPenjualan').innerHTML = `${data.json.grand_total}`;
				document.getElementById('totalBerat').innerHTML = `${data.json.berat} Gram`;
				document.getElementById('pokokModal').innerHTML = data.json.pokok_modal;
				document.getElementById('labaRugi').innerHTML = data.json.labarugi;
				document.getElementById('labaOngkos').innerHTML = data.json.labarugi_ongkos;
			},
			dom: "BPlfrtip",
			buttons: [
				'copy', 'csv', 'excel', 'pdf', 'print',
			],
			"columnDefs": [{
				"targets": -1,
				"data": null,
				"defaultContent": `<button title='Lihat Detail Penjualan' id='viewPenjualan' title='Tampilkan detail penjualan' class='btn btn-primary btn-circle'><i class='fas fa-eye'></i></button>`
			},
			{
				"targets": [0],
				"visible": true,
				"searchable": false,
				"orderable": false
			}
			]
		});
	},

	async _initialViewPenjualan() {
		await $('#kelolaTable tbody').on('click', '#viewPenjualan', async function (event) {
			$('#myModalLabel').html("Detail Transaksi Penjualan");
			event.preventDefault()
			event.stopPropagation();
			const table = await $('#kelolaTable').DataTable();
			let data = table.row($(this).parents('tr')).data();
			if (data[1].split('.')[0] == 'PJQ') {
				await FakturInitiator.initQuantity(data[2], 'printArea', 0);
			} else {
				await FakturInitiator.initViewLabaRugi(data[2]);
			}
			$('#modalPenjualan').modal('show');
		});
		this._initCetakStruk();
	},

	async initFilterLabaRugi() {
		const eventFilterPenjualan = async (e) => {
			e.preventDefault();
			await this._filterLabarugiNota();
			await this._initPrintFaktur();
		}

		document.getElementById('filterLabarugi').addEventListener('submit', eventFilterPenjualan);
	},

	async _filterLabarugiNota() {
		const starDateValue = await document.getElementById('startDate').value;
		const endDateValue = await document.getElementById('endDate').value;
		const statusPayment = await document.getElementById('pilih_pembayaran').value;
		await $('#kelolaTable').DataTable({
			"processing": true,
			"destroy": true,
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			"serverSide": true,
			"ajax": {
				"url": `${API_ENDPOINT.FILTER_DATA_LABARUGI}`,
				"data": {
					status_bayar: statusPayment,
					startDate: starDateValue,
					endDate: endDateValue
				},
				"type": "POST"
			},
			lengthChange: true,
			"lengthMenu": [25, 50, 100, 250, 500, 1000],
			"fnDrawCallback": function (data) {
				var api = this.api();
				$(api.column(6).footer()).html('' + data.json.berat + '');
				$(api.column(7).footer()).html('' + data.json.subtotal + '');
				$(api.column(8).footer()).html('' + data.json.ongkos + '');
				$(api.column(9).footer()).html('' + data.json.grand_total + '');
				$(api.column(10).footer()).html('' + data.json.pokok_modal + '');
				$(api.column(11).footer()).html('' + data.json.labarugi + '');
				$(api.column(12).footer()).html('' + data.json.labarugi_ongkos + '');
				document.getElementById('jumlahNota').innerHTML = `${data.json.recordsFiltered}`;
				document.getElementById('subTotal').innerHTML = `${data.json.subtotal}`;
				document.getElementById('totalOngkos').innerHTML = `${data.json.ongkos}`;
				document.getElementById('totalPenjualan').innerHTML = `${data.json.grand_total}`;
				document.getElementById('totalBerat').innerHTML = `${data.json.berat} Gram`;
				document.getElementById('pokokModal').innerHTML = data.json.pokok_modal;
				document.getElementById('labaRugi').innerHTML = data.json.labarugi;
				document.getElementById('labaOngkos').innerHTML = data.json.labarugi_ongkos;
			},
			dom: "BPlfrtip",
			buttons: [
				'copy', 'csv', 'excel', 'pdf', 'print',
			],
			"columnDefs": [{
				"targets": -1,
				"data": null,
				"defaultContent": `<button title='Lihat Detail Penjualan' id='viewPenjualan' title='Tampilkan detail penjualan' class='btn btn-primary btn-circle'><i class='fas fa-eye'></i></button>`
			},
			{
				"targets": [0],
				"visible": true,
				"searchable": false,
				"orderable": false
			}
			]
		});

		let btnStylePrint = document.querySelectorAll('.dt-button');
		for (let i = 0; i < btnStylePrint.length; i++) {
			btnStylePrint[i].classList.add("btn");
			btnStylePrint[i].classList.add("btn-light");
		}
	},

	async _initPrintFaktur() {
		await $('#kelolaTable tbody').on('click', '#printNota', async function (event) {
			event.preventDefault()
			event.stopPropagation();
			const table = await $('#kelolaTable').DataTable();
			let data = table.row($(this).parents('tr')).data();
			if (data[1].split('.')[0] == 'PJQ') {
				await FakturInitiator.initQuantity(data[1], 'printResultNota', 1);
			} else {
				await FakturInitiator.initPenjualan(data[1]);
			}
		});
	},

	async _initCetakStruk() {
		await $('#printStruk').on('click', async function (event) {
			event.preventDefault()
			event.stopPropagation();
			let data = document.getElementById('notaPenjualan').innerHTML;
			if (data.split('.')[0] == 'PJQ') {
				await FakturInitiator.initQuantity(data, 'printResultNota', 1);
			} else {
				await FakturInitiator.initPenjualan(data);
			}
		});
	},
}

export default LaporanLabaRugi;
