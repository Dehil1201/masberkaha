import API_ENDPOINT from '../../config/globals/endpoint.js';
import apiJenisUser from '../../api/data-jenisuser.js'

const dataTableJenisUserInitiator = {

	async init() {
		await this._show();
		this._initialCreate();
		this._initialUpdate();
		this._initForSubmit();
		this._initialDelete();
	},

	async _show() {
		let table = await $('#tableJenisUser').DataTable({
			"processing": true,
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			"serverSide": true,
			"ajax": {
				"url": `${API_ENDPOINT.LIST_JENISUSER}`,
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
					"defaultContent": `<div style="display:flex"><button style="margin:6px" class='btn btn-info btn-circle' id='edit' title='Edit data level user'><i class='far fa-edit'></i></button>
                     <button style="margin:6px" class='btn btn-danger btn-circle' id='delete' title='Hapus data level user'><i class='fas fa-trash'></i></button></div>`
				},
				{
					"targets": [0],
					"visible": true,
					"searchable": false
				}
			]
		});

		$('#refresh').click(() => {
			let oTable = $('#tableJenisUser').dataTable();
			oTable.fnDraw(false);
		});

		let btnStylePrint = document.querySelectorAll('.dt-button');
		for (let i = 0; i < btnStylePrint.length; i++) {
			btnStylePrint[i].classList.add("btn");
			btnStylePrint[i].classList.add("btn-light");
		}
	},

	async _syncData() {
		let oTable = $('#tableJenisUser').dataTable();
		oTable.fnDraw(false);
	},

	async _syncView() {
		$('#modalData').modal('hide');
		$('#jenisUserForm').trigger("reset");
	},


	async _initialUpdate() {
		$('#tableJenisUser tbody').on('click', '#edit', function () {

			$('#myModalLabel').html("Ubah Jenis User");
			const table = $('#tableJenisUser').DataTable();
			let data = table.row($(this).parents('tr')).data();
			$('#btn-save').html('<i class="fa fa-check-square-o"></i> Simpan');
			$('#btn-save').val('simpan');
			$('#modalData').modal('show');
			$('#akses_id').val(data[0]);

			$('#level').val(data[1]);

			$('#jenisUserForm').attr("data-action", "update");
		});

	},

	async _initialCreate() {
		$('#modalData').on('shown.bs.modal', function () {
			$('#level').focus();
		});
		document.getElementById('create_data').addEventListener('click', () => {
			$('#btn-save').html('<i class="fa fa-check-square-o"></i> Tambah');
			$('#btn-save').val('tambah');
			$('#akses_id').val('');
			$('#jenisUserForm').trigger("reset");
			$('#myModalLabel').html("Tambah Jenis User");
			$('#modalData').modal('show');
			$('#jenisUserForm').attr("data-action", "create"); //for state create
		});
	},

	async _initialDelete() {
		$('#tableJenisUser tbody').on('click', '#delete', function () {
			const table = $('#tableJenisUser').DataTable();
			let data = table.row($(this).parents('tr')).data();

			swal.fire({
				title: 'Hapus',
				html: "Anda ingin menghapus data ini? <br> <strong>Nama Jenis User </strong>: " + data[1],
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Ya, Hapus!'
			}).then(async (result) => {
				if (result.value) {
					let id = data[0];
					const status = await apiJenisUser.deleteJenisUser(id);

					if (status === '200') {
						swal.fire({
							title: 'Hapus',
							text: 'Data berhasil dihapus',
							icon: 'success',
							showConfirmButton: false,
							timer: 1000
						});
						//refres manual 
						let oTable = $('#tableJenisUser').dataTable();
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
			const stateForm = document.getElementById('jenisUserForm').dataset.action;

			if (stateForm === 'create') {
				this._createJenisUser();
			} else if (stateForm === 'update') {
				this._updateJenisUser();
			}
			await this._syncData();
			document.getElementById('refresh').dispatchEvent(new Event('click'));
		}
		document.getElementById('jenisUserForm').addEventListener('submit', eventForm);
	},

	async _createJenisUser() {
		try {
			const status = await apiJenisUser.addJenisUser(new FormData(document.getElementById('jenisUserForm')));
			if (status === '200') {
				this._notification('Succes Menambahkan Data', 'success');
				this._syncView();
			}
		} catch (error) {
			this._notification('Maaf Ada masalah Didalam Server Harap Mengisi Data Dengan Benar...', 'error');
		}

	},

	async _updateJenisUser() {
		const status = await apiJenisUser.updateJenisUser(new FormData(document.getElementById('jenisUserForm')));
		if (status === '200') {
			this._notification('Succes Mengedit Data', 'success');
			this._syncView();
		} else if (status === '500') {
			this._notification('Maaf Ada masalah Didalam Server Harap Mengisi Dengan Benar...', 'error');
		}
	},
}




export default dataTableJenisUserInitiator;
