import API_ENDPOINT from '../../config/globals/endpoint.js';
import ApiTransfer from '../../api/data-tranfer.js';
import FormatCurrency from '../../utils/initial-currency.js';
import ApiSaldo from './../../api/data-saldo.js';

function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}
const transferInitiator = {
	async init() {
		await this._syncSaldo();
		await this._show();
		await this._initialAddKas();
		await this._giveEventKas();
		this._setDate();
		this._getSourceKas();
		this._initialDelete();
		this._initFormatCurrency();
		await this._setListSaldo();
	},

	async _syncSaldo() {
		let scynch = await ApiSaldo.scynchSaldo();
	},

	async _setFaktur() {
		const faktur = await ApiTransfer.getFaktur();
		document.getElementById('fakturKas').value = faktur.data;
	},

	async _setPrice(idHtml) {
		FormatCurrency.initialCurrency({
			elmId: `${idHtml}`
		})
	},

	async _initFormatCurrency() {
		await this._setPrice('pemasukan');
		await this._setPrice('jumlah_transfer');
		await this._setPrice('pengeluaran');
	},

	async _setListSaldo() {
		let elmData = '';
		const dataList = await ApiTransfer.getListSaldo();
		dataList.forEach(data => {
			elmData += `<option value="${data.no_rekening}">${data.no_rekening} - ${data.an}</li>`;
		});
		$("#from_sumber").removeAttr('disabled', 'disabled').html('<option disabled selected value> -- Dari Sumber Rekening -- </option>' + elmData);

		await this._eventElementHtml(dataList);
	},

	async _eventElementHtml(dataList) {
		const dataListTemp = dataList;
		const evenChangeSaldo = async () => {
			let elmValue = document.getElementById('from_sumber').value;
			let elmData = ``;
			await this._syncSaldo();

			dataListTemp.forEach(data => {
				if (elmValue != data.no_rekening) {
					elmData += `<option value="${data.no_rekening}">${data.no_rekening} - ${data.an}</li>`;
				}
			});
			$("#to_sumber").removeAttr('disabled', 'disabled').html('<option disabled selected value> -- Ke Rekening -- </option>' + elmData);
			const noRekening = elmValue;
			const dataSaldo = await ApiTransfer.getSaldoByID(noRekening);
			document.getElementById('saldo_sumber_asal').value = await FormatCurrency.setValue(dataSaldo.saldo);
			document.getElementById('saldo_sumber_asal_fix').value = dataSaldo.saldo;
		}

		const eventJumlahTransfer = async () => {
			let saldoNow = document.getElementById('saldo_sumber_asal_fix').value;
			let countTransfer = await FormatCurrency.getValue(document.getElementById('jumlah_transfer').value);
			console.log(saldoNow)
			if (saldoNow < 0) {
				this._notification('Saldo sumber minus!', 'warning');
				document.getElementById("jumlah_transfer").value = 0;
			} else {
				let exchange = saldoNow - countTransfer;
				document.getElementById('sisa_saldo_pengirim').value = await FormatCurrency.setValue(exchange);
				if (parseInt(exchange) < 0) {
					document.getElementById('jumlah_transfer').value = await FormatCurrency.setValue(saldoNow);
					document.getElementById('sisa_saldo_pengirim').value = await FormatCurrency.setValue('0');
				}
			}
		}
		document.getElementById('jumlah_transfer').addEventListener('keyup', eventJumlahTransfer);
		document.getElementById('from_sumber').addEventListener('change', evenChangeSaldo);
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
				"url": `${API_ENDPOINT.LAPORAN_KAS}`,
				"data": {
					mode: 7,
					startDate: new Date().toISOString().split('T')[0],
					endDate: new Date().toISOString().split('T')[0]

				},
				"type": "POST"
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
					if (row[3] == 'TF') {
						condition = elmBtnAction
					} else if (row[3] == 'MTF') {
						condition = elmBtnAction
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

	async _initialAddKas() {
		document.getElementById('addKas').addEventListener('click', () => {
			this._setFaktur();
			$('#modalKas').on('shown.bs.modal', function () {
				$('#from_sumber').focus();
			});
			$('#modalKas').modal('show');
		});
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
				"url": `${API_ENDPOINT.LAPORAN_KAS}`,
				"data": {
					source: sourceDana,
					mode: modeTransaksi,
					startDate: starDateValue,
					endDate: endDateValue
				},
				"type": "POST"
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


					let condition = '';
					if (row[3] == 'TF') {
						condition = elmBtnAction;
					} else if (row[3] == 'MTF') {
						condition = elmBtnAction;
					}
					return `${condition}`
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


	async _getSourceKas() {
		let elmData = '';
		const dataSourceKas = await ApiTransfer.getSourceKas();
		dataSourceKas.data.forEach(data => {
			elmData += `<option value="${data[0]}">${data[0]} - ${(data[1] == null) ? '' : data[1]}</li>`;
		});
		$("#pilihSourceDana").html('<option selected value> -- Pilih Sumber Kas -- </option>' + elmData);
	},

	async _giveEventKas() {
		const eventKas = async (e) => {
			e.preventDefault();
			const result = await ApiTransfer.addKas({
				faktur: document.getElementById('fakturKas').value,
				date: document.getElementById('tanggal').value,
				pemasukan: 0,
				pengeluaran: await FormatCurrency.getValue(document.getElementById('jumlah_transfer').value),
				source: document.getElementById('from_sumber').value,
				mode: 'Transfer',
				referensi: 'TF',
				keterangan: document.getElementById('keterangan').value
			});

			const resultDebit = await ApiTransfer.addKas({
				faktur: 'M' + document.getElementById('fakturKas').value,
				date: document.getElementById('tanggal').value,
				pemasukan: await FormatCurrency.getValue(document.getElementById('jumlah_transfer').value),
				pengeluaran: 0,
				referensi: 'MTF',
				source: document.getElementById('to_sumber').value,
				mode: 'Menerima Transfer',
				keterangan: 'Menerima Transfer Dari ' + document.getElementById('from_sumber').value
			});


			if ((result.status == false) || (resultDebit.status == false)) {
				this._notification(`Ada masalah Dari Server .. Coba beberapa saat lagi`, 'error');
			} else {
				this._notification('Transfer berhasil', 'success');
			}
			await this._reset();
		}
		document.getElementById('kasForm').addEventListener('submit', eventKas);
	},

	async _setDate() {
		document.getElementById('startDate').valueAsDate = new Date();
		document.getElementById('endDate').valueAsDate = new Date();
		document.getElementById('tanggal').valueAsDate = new Date();
	},

	async _reset() {
		$('#modalKas').modal('hide');
		document.getElementById('kasForm').reset();
		this._setDate();
		await this._show();
		await this._setFaktur();
		await this._setListSaldo();
		await this._syncSaldo();
	},

	async _initialDelete() {
		$('#tableKas tbody').on('click', '#delete', function () {
			const table = $('#tableKas').DataTable();
			let data = table.row($(this).parents('tr')).data();

			swal.fire({
				title: 'Hapus',
				html: "Anda ingin menghapus data ini? <br> <strong>Faktur </strong>: " + data[2],
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Ya, Hapus!'
			}).then(async (result) => {
				if (result.value) {
					let id = data[0];
					let status = await ApiTransfer.deleteLaporanKas(id);
					let notaDeleted = data[2].includes("MTF");
					if (notaDeleted) {
						notaDeleted = data[2].replace('MTF', 'TF');
					} else {
						notaDeleted = data[2].replace('TF', 'MTF');
					}
					status = await ApiTransfer.deleteLaporanKasTransfer(notaDeleted);

					if (status === '200') {
						swal.fire({
							title: 'Hapus',
							text: 'Data berhasil dihapus',
							icon: 'success',
							timer: 2000
						});
						//refres manual 
						let oTable = $('#tableKas').dataTable();
						oTable.fnDraw(false);
						$(this).parents('tr').fadeOut(300);
					}
				};
			});
		});
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

export default transferInitiator;
