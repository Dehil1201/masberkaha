import ApiSaldo from '../../api/data-saldo.js';
import API_ENDPOINT from '../../config/globals/endpoint.js';
import ApiLaporan from './../../api/data-tranfer.js';

function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}
const JurnalUmumInitiator = {
	async init() {
		await this._syncSaldo();
		await this._show();
		this._setDate();
		await this._getSourceKas();
	},

	async _syncSaldo() {
		await ApiSaldo.scynchSaldo();
	},

	async _getSourceKas() {
		let elmData = '';
		const dataSourceKas = await ApiLaporan.getSourceKas();
		dataSourceKas.data.forEach(data => {
			elmData += `<option value="${data[0]}">${data[0]} - ${(data[1] == null) ? '' : data[1]}</li>`;
		});
		$("#pilihSourceDana").html('<option selected value> -- Pilih Sumber Kas -- </option>' + elmData);
	},

	async _show() {
		document.getElementById('startDate').focus();
		const elmBtnAction = `<button class='btn btn-danger btn-circle' title='Hapus Data Kas' id='delete'><i class='fas fa-trash'></i></button>`
		await $('#tableKas').DataTable({
			"processing": true,
			"destroy": true,
			"order": [
				[0, "desc"]
			],
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			"serverSide": false,
			"ajax": {
				"url": `${API_ENDPOINT.LAPORAN_JURNAL_UMUM}`,
				"data": {
					startDate: new Date().toISOString().split('T')[0],
					endDate: new Date().toISOString().split('T')[0]
				},
				"type": "POST"
			},
			"fnDrawCallback": function (data) {
				var api = this.api();
				if (data.json != undefined) {
					$(api.column(4).footer()).html('' + formatNumber((data.json.debit) ? data.json.debit : 0) + '');
					$(api.column(5).footer()).html(`${(data.json.kredit == 0 || data.json.kredit == null) ? '' : '-'}` + formatNumber((data.json.kredit) ? data.json.kredit : 0) + '');
					$(api.column(3).footer()).html('Awal : ' + formatNumber((data.json.saldoAwal) ? data.json.saldoAwal : 0) + '');
					$(api.column(6).footer()).html('Akhir : ' + formatNumber((data.json.saldoAkhir) ? data.json.saldoAkhir : 0) + '');
				}
			},
			dom: 'Bfrtip',
			responsive: true,
			paginate: true,
			bFilter: true,
			info: false,
			lengthChange: false,
			buttons: [
				'copy', 'csv', 'excel', 'pdf', 'print',
			],
			"columnDefs": [{
				"targets": [0],
				"visible": true,
				"searchable": false
			},
			{
				"targets": -1,
				"data": null,
				"render": function (data, type, row) {

					let condition = '';
					if (row[3] !== 'KAS') {
						condition = '';
					} else {
						condition = ''
					}
					return `${condition}`
				},
			},
			{
				"targets": [4, 5, 6],
				"orderable": false
			}
			]
		});

		$('#refresh').click(() => {
			this._show();
			$('#pilihTransaksi').prop('selectedIndex', 0);
			this._setDate();
		});

		let btnStylePrint = document.querySelectorAll('.dt-button');
		for (let i = 0; i < btnStylePrint.length; i++) {
			btnStylePrint[i].classList.add("btn");
			btnStylePrint[i].classList.add("btn-light");
		}

		this.initFilterLaporanKas();
	},

	async initFilterLaporanKas() {
		const eventFilterLaporanKas = async (e) => {
			e.preventDefault();
			await this._filterDataLaporanKas();
		}

		document.getElementById('filterLaporanKas').addEventListener('submit', eventFilterLaporanKas);
	},

	async _filterDataLaporanKas() {
		const starDateValue = await document.getElementById('startDate').value;
		const endDateValue = await document.getElementById('endDate').value;
		const modeTransaksi = await document.getElementById('pilihTransaksi').value;
		const sourceDana = await document.getElementById('pilihSourceDana').value;
		const elmBtnAction = `<button class='btn btn-danger btn-circle' title='Hapus Data Kas' id='delete'><i class='fas fa-trash'></i></button>`
		await $('#tableKas').DataTable({
			"processing": true,
			"destroy": true,
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			"serverSide": false,
			"ajax": {
				"url": `${API_ENDPOINT.LAPORAN_JURNAL_UMUM}`,
				"data": {
					source: sourceDana,
					mode: modeTransaksi,
					startDate: starDateValue,
					endDate: endDateValue
				},
				"type": "POST"
			},
			"fnDrawCallback": function (data) {
				var api = this.api();
				if (data.json != undefined) {
					$(api.column(4).footer()).html('' + formatNumber((data.json.debit) ? data.json.debit : 0) + '');
					$(api.column(5).footer()).html(`${(data.json.kredit == 0 || data.json.kredit == null) ? '' : '-'}` + formatNumber((data.json.kredit) ? data.json.kredit : 0) + '');
					$(api.column(3).footer()).html('Awal : ' + formatNumber((data.json.saldoAwal) ? data.json.saldoAwal : 0) + '');
					$(api.column(6).footer()).html('Akhir : ' + formatNumber((data.json.saldoAkhir) ? data.json.saldoAkhir : 0) + '');
				}
			},
			dom: 'Bfrtip',
			responsive: true,
			paginate: true,
			bFilter: true,
			info: false,
			lengthChange: false,
			buttons: [
				'copy', 'csv', 'excel', 'pdf', 'print',
			],
			"columnDefs": [{
				"targets": [0],
				"visible": true,
				"searchable": false
			},
			{
				"targets": [4, 5, 6],
				"orderable": false
			},
			{
				"targets": -1,
				"data": null,
				"render": function (data, type, row) {

					return ``
				},
			},
			]
		});

		let btnStylePrint = document.querySelectorAll('.dt-button');
		for (let i = 0; i < btnStylePrint.length; i++) {
			btnStylePrint[i].classList.add("btn");
			btnStylePrint[i].classList.add("btn-light");
		}

	},

	async _setDate() {
		document.getElementById('startDate').valueAsDate = new Date();
		document.getElementById('endDate').valueAsDate = new Date();

	},

	_notification(msg, status) {
		swal.fire({
			title: `${status}`,
			text: `${msg}`,
			icon: `${status}`,
			showConfirmButton: false,
			timer: 1500
		})
	},
}

export default JurnalUmumInitiator;
