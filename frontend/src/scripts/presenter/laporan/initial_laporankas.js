import API_ENDPOINT from '../../config/globals/endpoint.js';
import ApiLaporan from '../../api/data-laporan.js';
import FormatCurrency from '../../utils/initial-currency.js';
import ApiTransfer from './../../api/data-tranfer.js';
import ApiSaldo from '../../api/data-saldo.js';
import ApiJenisTransaksi from '../../api/data-jenistransaksi.js';

function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}
function reformatCurrency(num) {
	return num.replace(/[^,\d]/g, '');
}

const dataTableKasInitiator = {
	async init() {
		await this._syncSaldo();
		await this._show();
		await this._initialAddKas();
		await this._initialUpdate();
		await this._initForSubmit();
		this._setDate();
		this._getSourceKas();
		this._getJenisTransaksi();
		this._initialDelete();
		this._initFormatCurrency();
		this._initialTipeKas();
		await this._setListSaldo();
		this._refreshData();
	},

	async _syncSaldo() {
		await ApiSaldo.scynchSaldo();
	},

	async _setFaktur() {
		const faktur = await ApiLaporan.getFaktur();
		document.getElementById('fakturKas').value = faktur.data;
	},

	async _setPrice(idHtml) {
		FormatCurrency.initialCurrency({
			elmId: `${idHtml}`
		})
	},

	async _initFormatCurrency() {
		await this._setPrice('pemasukan');
		await this._setPrice('pengeluaran');
	},


	async _setListSaldo() {
		let elmData = '';
		const dataAkses = await ApiTransfer.getListSaldo();
		dataAkses.forEach(data => {
			elmData += `<option value="${data.no_rekening}">${data.no_rekening} - ${data.an}</option>`;
		});
		$("#sumber_dana").removeAttr('disabled', 'disabled').html('<option disabled selected value> -- Pilih Rekening -- </option>' + elmData);

	},

	async _initialTipeKas() {
		const changeTipe = async () => {
			const faktur = await ApiLaporan.getFaktur();
			let fakturNow = faktur.data.replace('KAS.', '');
			let tipeKas = document.getElementById('tipe_kas').value;
			const jenisTransaksi = await ApiJenisTransaksi.getJenisTransaksiRow(tipeKas);
			let jenisKas = `<option value="">--Pilih--</option>`;
			jenisTransaksi.map(data => {
				jenisKas += `<option>${data.nama_transaksi}</option>`
			});

			if (tipeKas == 'Pemasukan') {
				document.getElementById('pemasukan').readOnly = false;
				document.getElementById('pengeluaran').readOnly = true;
				document.getElementById('pemasukan').focus();
				document.getElementById('pengeluaran').value = '0';
				document.getElementById('noref').value = 'PMNO';
				document.getElementById('fakturKas').value = 'PMNO.' + fakturNow;
				document.getElementById('lblSumberDana').innerHTML = 'Pemasukan';
				document.getElementById('lblJenisKas').innerHTML = 'Pemasukan';
				document.getElementById('inputJenisKas').style.display = null;
				document.getElementById('jenis_kas').innerHTML = jenisKas
			} else if (tipeKas == 'Pengeluaran') {
				document.getElementById('pemasukan').readOnly = true;
				document.getElementById('pengeluaran').readOnly = false;
				document.getElementById('pengeluaran').focus();
				document.getElementById('pemasukan').value = '0';
				document.getElementById('noref').value = 'PLNO'
				document.getElementById('fakturKas').value = 'PLNO.' + fakturNow;
				document.getElementById('lblSumberDana').innerHTML = 'Pengeluaran';
				document.getElementById('lblJenisKas').innerHTML = 'Pengeluaran';
				document.getElementById('inputJenisKas').style.display = null;
				document.getElementById('jenis_kas').innerHTML = jenisKas
			} else {
				document.getElementById('pengeluaran').readOnly = true;
				document.getElementById('pemasukan').readOnly = true;
				document.getElementById('inputJenisKas').style.display = 'none';
				document.getElementById('jenis_kas').innerHTML = ``
			}
		}
		document.getElementById('tipe_kas').addEventListener('change', changeTipe)
	},

	async _refreshData() {
		document.getElementById('refresh').addEventListener('click', async () => {
			this._syncSaldo();
			this._show();
			$('#pilihTipe').prop('selectedIndex', 0);
			$('#pilihTransaksi').prop('selectedIndex', 0);
			$('#pilihSourceDana').prop('selectedIndex', 0);
			this._setDate();
		});
	},

	async _show() {
		document.getElementById('startDate').focus();
		const elmBtnActionFull = `<div style="display:flex"><button style="margin:6px" class='btn btn-info btn-circle' id='edit' title='Edit data KAS'><i class='far fa-edit'></i></button>
							<button style="margin:6px" class='btn btn-danger btn-circle' id='delete' title='Hapus data KAS'><i class='fas fa-trash'></i></button></div>`
		const elmBtnActionPartial = `<button style="margin:6px" class='btn btn-danger btn-circle' id='delete' title='Hapus data KAS'><i class='fas fa-trash'></i></button></div>`
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
					if (row[3] === 'PMNO' || row[3] === 'PLNO') {
						condition = elmBtnActionFull
					} else {
						condition = elmBtnActionPartial;
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
				$('#tipe_kas').focus();
			});
			document.getElementById('inputJenisKas').style.display = 'none';
			document.getElementById('fakturKas').readOnly = false;
			document.getElementById('tipe_kas').readOnly = false;
			document.getElementById('tipe_kas').disabled = false;
			$('#user_id').val('');
			$('#kasForm').trigger("reset");
			$('#myModalLabel2').html("Tambah Transaksi");
			$('#modalKas').modal('show');
			$('#kasForm').attr("data-action", "create");
			document.getElementById('tanggal').valueAsDate = new Date();
		});
	},

	async _initialUpdate() {
		$('#tableKas tbody').on('click', '#edit', function () {
			$('#myModalLabel2').html("Ubah Transaksi");
			const table = $('#tableKas').DataTable();
			let data = table.row($(this).parents('tr')).data();
			let tipeKas = (data[3] === 'PMNO') ? 'Pemasukan' : 'Pengeluaran';
			let jenisKas = `<option value="">--Pilih--</option>`;
			$('#modalKas').modal('show');
			document.getElementById('tanggal').valueAsDate = new Date();
			document.getElementById('fakturKas').readOnly = true;
			document.getElementById('tipe_kas').disabled = true;
			document.getElementById('inputJenisKas').style.display = null;
			$('#fakturKas').val(data[2]);
			ApiJenisTransaksi.getJenisTransaksiRow(tipeKas).then(datas => {
				datas.map(row => {
					jenisKas += `<option ${(data[7] === row.nama_transaksi) ? 'selected' : ''}>${row.nama_transaksi}</option>`
				});
				$('#tipe_kas').val(tipeKas);
				if (tipeKas === 'Pemasukan') {
					document.getElementById('pemasukan').readOnly = false;
					document.getElementById('pengeluaran').readOnly = true;
					document.getElementById('jenis_kas').innerHTML = jenisKas
				} else if (tipeKas === 'Pengeluaran') {
					document.getElementById('pemasukan').readOnly = true;
					document.getElementById('pengeluaran').readOnly = false;
					document.getElementById('jenis_kas').innerHTML = jenisKas
				}
			});
			$('#pemasukan').val(reformatCurrency(data[4]));
			$('#pengeluaran').val(reformatCurrency(data[5]));
			$('#sumber_dana').val(data[6].split(' - ')[0]);
			$('#keterangan').val(data[8]);
			$('#kasForm').attr("data-action", "update");
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
		const modeTransaksi = await document.getElementById('pilihTipe').value;
		const jenisTransaksi = await document.getElementById('pilihTransaksi').value;
		const sourceDana = await document.getElementById('pilihSourceDana').value;
		const elmBtnActionFull = `<div style="display:flex"><button style="margin:6px" class='btn btn-info btn-circle' id='edit' title='Edit data KAS'><i class='far fa-edit'></i></button>
							<button style="margin:6px" class='btn btn-danger btn-circle' id='delete' title='Hapus data KAS'><i class='fas fa-trash'></i></button></div>`
		const elmBtnActionPartial = `<button style="margin:6px" class='btn btn-danger btn-circle' id='delete' title='Hapus data KAS'><i class='fas fa-trash'></i></button></div>`
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
					jenis: jenisTransaksi,
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
					let condition = '';
					if (row[3] === 'PMNO' || row[3] === 'PLNO') {
						condition = elmBtnActionFull
					} else {
						condition = elmBtnActionPartial;
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
		const dataSourceKas = await ApiLaporan.getSourceKas();
		dataSourceKas.data.forEach(data => {
			elmData += `<option value="${data[0]}">${data[0]} - ${(data[1] == null) ? '' : data[1]}</option>`;
		});
		$("#pilihSourceDana").html('<option selected value> -- Pilih Sumber Kas -- </option>' + elmData);
	},

	async _getJenisTransaksi() {
		let elmData = '';
		const dataJenisTransaksi = await ApiJenisTransaksi.getJenisTransaksi();
		dataJenisTransaksi.data.forEach(data => {
			elmData += `<option>${data[1]}</option>`;
		});
		$("#pilihTransaksi").html('<option selected value> -- Pilih Transaksi -- </option>' + elmData);
	},

	async _initForSubmit() {
		const eventForm = async (e) => {
			e.preventDefault();
			const stateForm = document.getElementById('kasForm').dataset.action;
			if (stateForm === 'create') {
				this._createKas();
			} else if (stateForm === 'update') {
				this._updateKas();
			}
			$('#modalKas').modal('hide');
			setTimeout(() => {
				document.getElementById('refresh').click();
				this._syncSaldo();
			}, 1500);
		}
		document.getElementById('kasForm').addEventListener('submit', eventForm);
	},

	async _createKas() {
		try {
			const result = await ApiLaporan.addKas({
				faktur: document.getElementById('fakturKas').value,
				date: document.getElementById('tanggal').value,
				pemasukan: await FormatCurrency.getValue(document.getElementById('pemasukan').value),
				pengeluaran: await FormatCurrency.getValue(document.getElementById('pengeluaran').value),
				source: document.getElementById('sumber_dana').value,
				mode: document.getElementById('jenis_kas').value,
				referensi: document.getElementById('noref').value,
				keterangan: document.getElementById('keterangan').value
			});

			if (result.status == false) {
				this._notification(`${result.message}`, 'error');
			} else {
				this._notification('Transaksi berhasil ditambahkan!', 'success');
				this._reset();
			}
		} catch (error) {
			this._notification('Maaf Ada masalah Didalam Server Harap Mengisi Data Dengan Benar...', 'error');
		}
	},

	async _updateKas() {
		const result = await ApiLaporan.updateKas({
			faktur: document.getElementById('fakturKas').value,
			date: document.getElementById('tanggal').value,
			pemasukan: await FormatCurrency.getValue(document.getElementById('pemasukan').value),
			pengeluaran: await FormatCurrency.getValue(document.getElementById('pengeluaran').value),
			source: document.getElementById('sumber_dana').value,
			mode: document.getElementById('jenis_kas').value,
			keterangan: document.getElementById('keterangan').value
		});

		if (result.status == false) {
			this._notification(`${result.message}`, 'error');
		} else {
			this._notification('Transaksi berhasil diupdate!', 'success');
			this._reset();
		}
	},

	async _setDate() {
		document.getElementById('startDate').valueAsDate = new Date();
		document.getElementById('endDate').valueAsDate = new Date();
		document.getElementById('tanggal').valueAsDate = new Date();
	},

	async _reset() {
		this._setDate();
		$('#tipe_kas').prop('selectedIndex', 0);
		document.getElementById("pemasukan").value = '0';
		document.getElementById("pengeluaran").value = '0';
		$('#jenis_kas').prop('selectedIndex', 0);
		document.getElementById("keterangan").value = '';
		document.getElementById('inputJenisKas').style.display = 'none';
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
					const status = await ApiLaporan.deleteLaporanKas(id);

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

export default dataTableKasInitiator;
