import API_ENDPOINT from '../../config/globals/endpoint.js';
import apiJenisBarang from '../../api/data-jenisbarang.js'

const dataTableJenisBarangInitiator = {

	async init() {
		await this._show();
		this._inputToUpperCase();
		this._initialCreate();
		this._initialUpdate();
		this._initForSubmit();
		this._initialDelete();
	},

	async _show() {
		let table = await $('#tableJenisBarang').DataTable({
			"processing": true,
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			"serverSide": true,
			"ajax": {
				"url": `${API_ENDPOINT.LIST_JENISBARANG}`,
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
				{
					"targets": 3,
					"data": null,
					"render": function (data, type, row) {
						let condition = '';
						if (row[3] == 1) {
							condition = `YA`
						} else {
							condition = `TIDAK`;
						}
						return `${condition }`
					},
				},
			]
		});

		$('#refresh').click(() => {
			let oTable = $('#tableJenisBarang').dataTable();
			oTable.fnDraw(false);
		});

		let btnStylePrint = document.querySelectorAll('.dt-button');
		for (let i = 0; i < btnStylePrint.length; i++) {
			btnStylePrint[i].classList.add("btn");
			btnStylePrint[i].classList.add("btn-light");
		}
	},

	async _syncData() {
		let oTable = $('#tableJenisBarang').dataTable();
		oTable.fnDraw(false);
	},

	async _inputToUpperCase() {
		const jenisToUpper = async () => {
			const jenisBarang = document.getElementById('jenis_barang').value;
			document.getElementById("jenis_barang").value = jenisBarang.toUpperCase();
		}
		const kodeJenisToUpper = async () => {
			const kodeJenis = document.getElementById('kode_jenis').value;
			document.getElementById("kode_jenis").value = kodeJenis.toUpperCase();
		}

		document.getElementById('jenis_barang').addEventListener('input', jenisToUpper)
		document.getElementById('kode_jenis').addEventListener('input', kodeJenisToUpper)
	},

	async _syncView() {
		$('#modalData').modal('hide');
		$('#jenisBarangForm').trigger("reset");
	},


	async _initialUpdate() {
		$('#tableJenisBarang tbody').on('click', '#edit', function () {
			$('#myModalLabel').html("Ubah Jenis Barang");
			const table = $('#tableJenisBarang').DataTable();
			let data = table.row($(this).parents('tr')).data();
			$('#btn-save').html('<i class="fa fa-check-square-o"></i> Simpan');
			$('#btn-save').val('simpan');
			$('#modalData').modal('show');
			$('#jenisbarang_id').val(data[0]);
			$('#jenis_barang').val(data[1]);
			$('#kode_jenis').val(data[2]);
			((data[3] == 1) ? $('#penjualan_satuan').prop('checked', true) : $('#penjualan_satuan').prop('checked', false));

			$('#jenisBarangForm').attr("data-action", "update");
		});

	},

	async _initialCreate() {
		$('#modalData').on('shown.bs.modal', function () {
			$('#jenis_barang').focus();
		});
		document.getElementById('create_data').addEventListener('click', () => {
			$('#btn-save').html('<i class="fa fa-check-square-o"></i> Tambah');
			$('#btn-save').val('tambah');
			$('#jenisbarang_id').val('');
			$('#jenisBarangForm').trigger("reset");
			$('#myModalLabel').html("Tambah Jenis Barang");
			$('#modalData').modal('show');
			$('#jenisBarangForm').attr("data-action", "create"); //for state create
		});
	},

	async _initialDelete() {
		$('#tableJenisBarang tbody').on('click', '#delete', function () {
			const table = $('#tableJenisBarang').DataTable();
			let data = table.row($(this).parents('tr')).data();

			swal.fire({
				title: 'Hapus',
				html: "Anda ingin menghapus data ini? <br> <strong>Nama Jenis Barang </strong>: " + data[1],
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Ya, Hapus!'
			}).then(async (result) => {
				if (result.value) {
					let id = data[0];
					const status = await apiJenisBarang.deleteJenisBarang(id);

					if (status === '200') {
						swal.fire({
							title: 'Hapus',
							text: 'Data berhasil dihapus',
							icon: 'success',
							showConfirmButton: false,
							timer: 1000
						});
						//refres manual 
						let oTable = $('#tableJenisBarang').dataTable();
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
			const stateForm = document.getElementById('jenisBarangForm').dataset.action;

			if (stateForm === 'create') {
				this._createJenisBarang();
			} else if (stateForm === 'update') {
				this._updateJenisBarang();
			}
			await this._syncData()
			document.getElementById('refresh').dispatchEvent(new Event('click'));
		}
		document.getElementById('jenisBarangForm').addEventListener('submit', eventForm);
	},

	async _createJenisBarang() {
		try {
			const status = await apiJenisBarang.addJenisBarang(new FormData(document.getElementById('jenisBarangForm')), document.getElementById('penjualan_satuan').checked);
			if (status === '200') {
				this._notification('Succes Menambahkan Data', 'success');
				this._syncView();
			}
		} catch (error) {
			this._notification('Maaf Ada masalah Didalam Server Harap Mengisi Data Dengan Benar...', 'error');
		}

	},

	async _updateJenisBarang() {
		const status = await apiJenisBarang.updateJenisBarang(new FormData(document.getElementById('jenisBarangForm')), document.getElementById('penjualan_satuan').checked);
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




export default dataTableJenisBarangInitiator;
