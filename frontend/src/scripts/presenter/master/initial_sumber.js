import API_ENDPOINT from '../../config/globals/endpoint.js';
import apiSumber from '../../api/data-saldo.js'
import ApiSaldo from '../../api/data-saldo.js';

const dataTableSumberInitiator = {

	async init() {
		await this._show();
		this._initialCreate();
		this._initialUpdate();
		this._initForSubmit();
		this._initialDelete();
		this._initialHistorySaldo();
		await this._syncSaldo();
	},

	async _show() {
		$('#titleDaftarRekening').html(`Daftar [Rekening] - ${$('#dayNow').html()}`);
		await this._syncSaldo();
		let table = await $('#tableSumber').DataTable({
			"processing": true,
			"destroy": true,
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			"serverSide": true,
			"ajax": {
				"url": `${API_ENDPOINT.LIST_SALDO}`,
				"type": "POST"
			},
			dom: "BPlfrtip",
			lengthChange: true,
			"lengthMenu": [25, 50, 100, 250],
			buttons: [
				'copy', 'csv', 'excel', 'pdf', 'print',
			],
			"columnDefs": [{
				"targets": -1,
				"data": null,
				"render": function (data, type, row) {

					let condition = '';
					if (row[1] !== '1101') {
						condition = `<div style="display:flex"><button style="margin:6px" class='btn btn-info btn-circle' id='edit' title='Edit data devisi'><i class='far fa-edit'></i></button>
						<button style="margin:6px" class='btn btn-danger btn-circle' id='delete' title='Hapus data devisi'><i class='fas fa-trash'></i></button>
						<button style="margin:6px" data-toggle='modal' data-target='#modalDetailHistorySaldo' title='Lihat Detail Transaksi' class='btn btn-primary btn-circle' id='view_detail'><i class='fas fa-eye'></i></button></div>`
					} else {
						condition = `<button style="margin:6px" data-toggle='modal' data-target='#modalDetailHistorySaldo' title='Lihat Detail Transaksi' class='btn btn-primary btn-circle' id='view_detail'><i class='fas fa-eye'></i></button></div>`;
					}
					return `${condition}`
				}
			},
			{
				"targets": [0],
				"visible": true,
				"searchable": false
			},
			{
				"targets": [3, 4, 5],
				"orderable": false,
				"searchable": false
			}
			]
		});

		$('#refresh').click(async () => {
			this._show();

			let oTable = $('#tableSumber').dataTable();
			oTable.fnDraw(false);
		});

		let btnStylePrint = document.querySelectorAll('.dt-button');
		for (let i = 0; i < btnStylePrint.length; i++) {
			btnStylePrint[i].classList.add("btn");
			btnStylePrint[i].classList.add("btn-light");
		}
	},

	async _syncSaldo() {
		await ApiSaldo.scynchSaldo();
	},

	async _syncData() {
		await this._syncSaldo();
		let oTable = $('#tableSumber').dataTable();
		oTable.fnDraw(false);
	},

	async _syncView() {
		$('#modalData').modal('hide');
		$('#SumberForm').trigger("reset");
	},


	async _initialUpdate() {
		$('#tableSumber tbody').on('click', '#edit', function () {

			$('#myModalLabel').html("Ubah Nama Saldo");
			const table = $('#tableSumber').DataTable();
			let data = table.row($(this).parents('tr')).data();
			$('#btn-save').html('<i class="fa fa-check-square-o"></i> Simpan');
			$('#btn-save').val('simpan');
			$('#modalData').modal('show');
			$('#saldo_id').val(data[0]);
			$('#no_rekening').val(data[1]);
			$('#an').val(data[2]);
			$('#jenis').val(data[7]);
			$('#no_rekening').prop("readonly", true);
			$('#SumberForm').attr("data-action", "update");
		});

	},

	async _initialCreate() {
		$('#modalData').on('shown.bs.modal', function () {
			$('#no_rekening').focus();
		});
		document.getElementById('create_data').addEventListener('click', () => {
			$('#btn-save').html('<i class="fa fa-check-square-o"></i> Tambah');
			$('#btn-save').val('tambah');
			$('#saldo_id').val('');
			$('#SumberForm').trigger("reset");

			$('#no_rekening').prop("readonly", false);
			$('#myModalLabel').html("Tambah Saldo");
			$('#modalData').modal('show');
			$('#SumberForm').attr("data-action", "create"); //for state create
		});
	},

	async _initialDelete() {
		$('#tableSumber tbody').on('click', '#delete', function () {
			const table = $('#tableSumber').DataTable();
			let data = table.row($(this).parents('tr')).data();

			swal.fire({
				title: 'Hapus',
				html: "Anda ingin menghapus data ini? <br> <strong>No Rekening</strong>: " + data[1],
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Ya, Hapus!'
			}).then(async (result) => {
				if (result.value) {
					let id = data[0];
					const status = await apiSumber.deleteSaldo(id);

					if (status === '200') {
						swal.fire({
							title: 'Hapus',
							text: 'Data berhasil dihapus',
							icon: 'success',
							timer: 2000
						});
						//refres manual 
						let oTable = $('#tableSumber').dataTable();
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
			timer: 1000
		})
	},

	async _initForSubmit() {
		const eventForm = async (e) => {
			e.preventDefault();
			const stateForm = document.getElementById('SumberForm').dataset.action;

			if (stateForm === 'create') {
				this._createSumber();
			} else if (stateForm === 'update') {
				this._updateSumber();
			}
			await this._syncData()
			document.getElementById('refresh').dispatchEvent(new Event('click'));
		}
		document.getElementById('SumberForm').addEventListener('submit', eventForm);
	},

	async _createSumber() {
		try {
			const status = await apiSumber.addSaldo(new FormData(document.getElementById('SumberForm')));
			if (status === '200') {
				this._notification('Succes Menambahkan Data', 'success');
				this._syncView();
			}
		} catch (error) {
			this._notification('Maaf Ada masalah Didalam Server Harap Mengisi Data Dengan Benar...', 'error');
		}

	},

	async _updateSumber() {
		const status = await apiSumber.updateSaldo(new FormData(document.getElementById('SumberForm')));
		if (status === '200') {
			this._notification('Succes Mengedit Data', 'success');
			this._syncView();
		} else if (status === '500') {
			this._notification('Maaf Ada masalah Didalam Server Harap Mengisi Dengan Benar...', 'error');
		}
	},

	async _initialHistorySaldo() {
		$('#tableSumber tbody').on('click', '#view_detail', async function () {
			$('#titleRiwayatTransaksi').html(`Riwayat Transaksi - ${$('#dayNow').html()}`);
			const table = $('#tableSumber').DataTable();
			let data = table.row($(this).parents('tr')).data();
			let noRekening = await data[1];
			// const result = await apiSumber.getInfoHistory(noRekening);

			const tableHistory = await $('#tableDetailHistorySaldo').DataTable({
				"processing": true,
				"destroy": true,
				"bInfo": false,
				searching: false,
				paginate: true,
				bFilter: true,
				"order": [
					[0, "desc"]
				],
				'language': {
					'loadingRecords': '&nbsp;',
					'processing': '<div class="spinner"></div>',
					"zeroRecords": "Barang ini belum pernah ada Transaksi!"
				},
				"serverSide": true,
				"ajax": {
					"url": `${API_ENDPOINT.GET_DETAIL_TRANSAKSI}`,
					"data": {
						no_rekening: noRekening
					},
					"type": "POST"
				},
				dom: 'Plfrtip',
				lengthChange: false,
				buttons: [
					'copy', 'csv', 'excel', 'pdf', 'print',
				],
				"columnDefs": [{
					"targets": [0],
					"visible": true,
					"searchable": false
				},]
			});

		});
	},
}




export default dataTableSumberInitiator;
