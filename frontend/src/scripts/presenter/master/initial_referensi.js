import API_ENDPOINT from '../../config/globals/endpoint.js';
import ApiReferensi from '../../api/data-referensi.js';

const dataTableReferensiInitiator = {

	async init() {
		await this._show();
		// this._initialCreate();
		this._initialUpdate();
		this._initForSubmit();
		this._initialDelete();
	},

	async _show() {
		let table = await $('#tableReferensi').DataTable({
			"processing": true,
			"destroy":true,
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			"serverSide": true,
			"ajax": {
				"url": `${API_ENDPOINT.LIST_REFERENSI}`,
				"type": "POST"
			},
			dom: 'Bfrtip',
			lengthChange: false,
			buttons: [
				'copy', 'csv', 'excel', 'pdf', 'print',
			],
			"columnDefs": [
				{
					"targets": [0],
					"visible": true,
					"searchable": false
				}
			]
		});

		$('#refresh').click( async () => {
			this._show();
			
				let oTable = $('#tableReferensi').dataTable();
				oTable.fnDraw(false);
		});

		let btnStylePrint = document.querySelectorAll('.dt-button');
		for (let i = 0; i < btnStylePrint.length; i++) {
			btnStylePrint[i].classList.add("btn");
			btnStylePrint[i].classList.add("btn-light");
		}
	},

	
	async _syncData() {
		
			let oTable = $('#tableReferensi').dataTable();
			oTable.fnDraw(false);
	},

	async _syncView() {
		$('#modalData').modal('hide');
		$('#ReferensiForm').trigger("reset");
	},


	async _initialUpdate() {
		$('#tableReferensi tbody').on('click', '#edit', function () {

			$('#myModalLabel').html("Ubah Nama Referensi");
			const table = $('#tableReferensi').DataTable();
			let data = table.row($(this).parents('tr')).data();
			$('#btn-save').html('<i class="fa fa-check-square-o"></i> Simpan');
			$('#btn-save').val('simpan');
			$('#modalData').modal('show');
			$('#referensi_id').val(data[0]);
			$('#kode_referensi').val(data[1]);
			$('#nama_referensi').val(data[2]);
			$('#kode_referensi').prop( "readonly", true );
			$('#ReferensiForm').attr("data-action", "update");
		});

	},

	async _initialCreate() {

		document.getElementById('create_data').addEventListener('click', () => {
			$('#btn-save').html('<i class="fa fa-check-square-o"></i> Tambah');
			$('#btn-save').val('tambah');
			$('#referensi_id').val('');
			$('#ReferensiForm').trigger("reset");
			
			$('#kode_referensi').prop( "readonly", false );
			$('#myModalLabel').html("Tambah Referensi");
			$('#modalData').modal('show');
			$('#ReferensiForm').attr("data-action", "create"); //for state create
		});
	},

	async _initialDelete() {
		$('#tableReferensi tbody').on('click', '#delete', function () {
			const table = $('#tableReferensi').DataTable();
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
					const status = await ApiReferensi.deleteReferensi(id);

					if (status === '200') {
						swal.fire({
							title: 'Hapus',
							text: 'Data berhasil dihapus',
							icon: 'success',
							timer: 2000
						});
						//refres manual 
						let oTable = $('#tableReferensi').dataTable();
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
			const stateForm = document.getElementById('ReferensiForm').dataset.action;

			if (stateForm === 'create') {
				await this._createReferensi();
			} else if (stateForm === 'update') {
				await this._updateReferensi();
			}
			await this._syncData();
			document.getElementById('refresh').dispatchEvent(new Event('click'));
		}
		document.getElementById('ReferensiForm').addEventListener('submit', eventForm);
	},

	async _createReferensi() {
		try {
			const status = await ApiReferensi.addReferensi(new FormData(document.getElementById('ReferensiForm')));
			
            if (status === '200') {
				this._notification('Succes Menambahkan Data', 'success');
				this._syncView();
			}
		} catch (error) {
			this._notification('Maaf Ada masalah Didalam Server Harap Mengisi Data Dengan Benar...', 'error');
		}

	},

	async _updateReferensi() {
		const status = await ApiReferensi.updateReferensi(new FormData(document.getElementById('ReferensiForm')));

        if (status === '200') {
			this._notification('Succes Mengedit Data', 'success');
			this._syncView();
		} else if (status === '500') {
			this._notification('Maaf Ada masalah Didalam Server Harap Mengisi Dengan Benar...', 'error');
		}
	},
}




export default dataTableReferensiInitiator;
