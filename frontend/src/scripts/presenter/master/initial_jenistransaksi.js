import API_ENDPOINT from '../../config/globals/endpoint.js';
import apiJenisTransaksi from '../../api/data-jenistransaksi.js'

const dataTableJenisTransaksiInitiator = {

	async init() {
		await this._show();
		this._initialCreate();
		this._initialUpdate();
		this._initForSubmit();
		this._initialDelete();
	},

	async _show() {
		let table = await $('#tableJenisTransaksi').DataTable({
			"processing": true,
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			"serverSide": true,
			"ajax": {
				"url": `${API_ENDPOINT.LIST_JENISTRANSAKSI}`,
				"type": "POST"
			},
			dom: 'Bfrtip',
			lengthChange: false,
			buttons: [
				'copy', 'csv', 'excel', 'pdf', 'print',
			],
			"columnDefs": [{
					"targets": -1,
					"data": null,
					"defaultContent": `<div style="display:flex"><button style="margin:6px" class='btn btn-info btn-circle' id='edit' title='Edit data devisi'><i class='far fa-edit'></i></button>
                     <button style="margin:6px" class='btn btn-danger btn-circle' id='delete' title='Hapus data devisi'><i class='fas fa-trash'></i></button></div>`
				},
				{
					"targets": [0],
					"visible": true,
					"searchable": false
				},
			]
		});

		$('#refresh').click(() => {
			let oTable = $('#tableJenisTransaksi').dataTable();
			oTable.fnDraw(false);
		});

		let btnStylePrint = document.querySelectorAll('.dt-button');
		for (let i = 0; i < btnStylePrint.length; i++) {
			btnStylePrint[i].classList.add("btn");
			btnStylePrint[i].classList.add("btn-light");
		}
	},

	async _syncData() {
		let oTable = $('#tableJenisTransaksi').dataTable();
		oTable.fnDraw(false);
	},

	async _syncView() {
		$('#modalData').modal('hide');
		$('#jenisTransaksiForm').trigger("reset");
	},


	async _initialUpdate() {
		$('#tableJenisTransaksi tbody').on('click', '#edit', function () {
			$('#myModalLabel').html("Ubah Jenis Transaksi");
			const table = $('#tableJenisTransaksi').DataTable();
			let data = table.row($(this).parents('tr')).data();
			$('#btn-save').html('<i class="fa fa-check-square-o"></i> Simpan');
			$('#btn-save').val('simpan');
			$('#modalData').modal('show');
			$('#jenistransaksi_id').val(data[0]);
			$('#nama_transaksi').val(data[1]);
			$('#tipe_transaksi').val(data[2]);
			((data[3] == 1) ? $('#penjualan_satuan').prop('checked', true) : $('#penjualan_satuan').prop('checked', false));

			$('#jenisTransaksiForm').attr("data-action", "update");
		});

	},

	async _initialCreate() {
		$('#modalData').on('shown.bs.modal', function () {
			$('#nama_transaksi').focus();
		});
		document.getElementById('create_data').addEventListener('click', () => {
			$('#btn-save').html('<i class="fa fa-check-square-o"></i> Tambah');
			$('#btn-save').val('tambah');
			$('#jenistransaksi_id').val('');
			$('#jenisTransaksiForm').trigger("reset");
			$('#myModalLabel').html("Tambah Jenis Transaksi");
			$('#modalData').modal('show');
			$('#jenisTransaksiForm').attr("data-action", "create"); //for state create
		});
	},

	async _initialDelete() {
		$('#tableJenisTransaksi tbody').on('click', '#delete', function () {
			const table = $('#tableJenisTransaksi').DataTable();
			let data = table.row($(this).parents('tr')).data();

			swal.fire({
				title: 'Hapus',
				html: "Anda ingin menghapus data ini? <br> <strong>Nama Jenis Transaksi </strong>: " + data[1],
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Ya, Hapus!'
			}).then(async (result) => {
				if (result.value) {
					let id = data[0];
					const status = await apiJenisTransaksi.deleteJenisTransaksi(id);

					if (status === '200') {
						swal.fire({
							title: 'Hapus',
							text: 'Data berhasil dihapus',
							icon: 'success',
							showConfirmButton: false,
							timer: 1000
						});
						//refres manual 
						let oTable = $('#tableJenisTransaksi').dataTable();
						oTable.fnDraw(false);
						$(this).parents('tr').fadeOut(300);
					}
				};
			});
		});
	},

	async _initForSubmit() {
		const eventForm = async (e) => {
			e.preventDefault();
			const stateForm = document.getElementById('jenisTransaksiForm').dataset.action;

			if (stateForm === 'create') {
				this._createJenisTransaksi();
			} else if (stateForm === 'update') {
				this._updateJenisTransaksi();
			}
			await this._syncData()
			document.getElementById('refresh').dispatchEvent(new Event('click'));
		}
		document.getElementById('jenisTransaksiForm').addEventListener('submit', eventForm);
	},

	async _createJenisTransaksi() {
		try {
			const status = await apiJenisTransaksi.addJenisTransaksi(new FormData(document.getElementById('jenisTransaksiForm')));
			if (status === '200') {
				this._notification('Succes Menambahkan Data', 'success');
				this._syncView();
			}
		} catch (error) {
			this._notification('Maaf Ada masalah Didalam Server Harap Mengisi Data Dengan Benar...', 'error');
		}

	},

	async _updateJenisTransaksi() {
		const status = await apiJenisTransaksi.updateJenisTransaksi(new FormData(document.getElementById('jenisTransaksiForm')));
		if (status === '200') {
			this._notification('Succes Mengedit Data', 'success');
			this._syncView();
		} else if (status === '500') {
			this._notification('Maaf Ada masalah Didalam Server Harap Mengisi Dengan Benar...', 'error');
		}
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
}




export default dataTableJenisTransaksiInitiator;
