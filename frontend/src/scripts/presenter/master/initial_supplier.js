import API_ENDPOINT from '../../config/globals/endpoint.js';
import apiSupplier from '../../api/data-supplier.js'
const SupplierInitiator = {

	async init() {
		await this._show();
		this._initialCreate();
		this._initialUpdate();
		this._initForSubmit();
		this._initialDelete();
	},

	async _show() {
		let table = await $('#tableSupplier').DataTable({
			"processing": true,
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			"serverSide": true,
			"ajax": {
				"url": `${API_ENDPOINT.LIST_SUPPLIER}`,
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
				"defaultContent": `<div style="display:flex"><button style="margin:6px" class='btn btn-info btn-circle' id='edit' title='Edit data supplier'><i class='far fa-edit'></i></button>
                     <button style="margin:6px" class='btn btn-danger btn-circle' id='delete' title='Hapus data supplier'><i class='fas fa-trash'></i></button></div>`
			},
			{
				"targets": [0],
				"visible": true,
				"searchable": false
			}
			]
		});

		$('#refresh').click(() => {
			let oTable = $('#tableSupplier').dataTable();
			oTable.fnDraw(false);
		});

		let btnStylePrint = document.querySelectorAll('.dt-button');
		for (let i = 0; i < btnStylePrint.length; i++) {
			btnStylePrint[i].classList.add("btn");
			btnStylePrint[i].classList.add("btn-light");
		}
	},

	async _syncData() {
		let oTable = $('#tableSupplier').dataTable();
		oTable.fnDraw(false);
	},

	async _syncView() {
		$('#modalData').modal('hide');
		$('#supplierForm').trigger("reset");
	},

	async _initialUpdate() {
		$('#tableSupplier tbody').on('click', '#edit', function () {

			$('#myModalLabel').html("Ubah Supplier");
			const table = $('#tableSupplier').DataTable();
			let data = table.row($(this).parents('tr')).data();
			$('#btn-save').html('<i class="fa fa-check-square-o"></i> Simpan');
			$('#btn-save').val('simpan');
			$('#modalData').modal('show');
			$('#supplier_id').val(data[0]);
			$('#nama_supplier').val(data[1]);
			$('#alamat').val(data[2]);
			$('#kota').val(data[3]);
			$('#no_hp').val(data[4]);
			$('#email').val(data[5]);
			$('#website').val(data[6]);
			$('#supplierForm').attr("data-action", "update");
		});

	},

	async _initialCreate() {
		$('#modalData').on('shown.bs.modal', function () {
			$('#nama_supplier').focus();
		});
		document.getElementById('create_data').addEventListener('click', () => {
			$('#btn-save').html('<i class="fa fa-check-square-o"></i> Tambah');
			$('#btn-save').val('tambah');
			$('#pelanggan_id').val('');
			$('#supplierForm').trigger("reset");
			$('#myModalLabel').html("Tambah Supplier");
			$('#modalData').modal('show');
			$('#supplierForm').attr("data-action", "create"); //for state create
		});
	},

	async _initialDelete() {
		$('#tableSupplier tbody').on('click', '#delete', function () {
			const table = $('#tableSupplier').DataTable();
			let data = table.row($(this).parents('tr')).data();

			swal.fire({
				title: 'Hapus',
				html: "Anda ingin menghapus data ini? <br> <strong>Nama Supplier </strong>: " + data[1],
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Ya, Hapus!'
			}).then(async (result) => {
				if (result.value) {
					let id = data[0];
					const status = await apiSupplier.deleteSupplier(id);

					if (status === '200') {
						swal.fire({
							title: 'Hapus',
							text: 'Data berhasil dihapus',
							icon: 'success',
							showConfirmButton: false,
							timer: 1000
						});
						//refres manual 
						let oTable = $('#tableSupplier').dataTable();
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
			const stateForm = document.getElementById('supplierForm').dataset.action;

			if (stateForm === 'create') {
				await this._createSupplier();
			} else if (stateForm === 'update') {
				await this._updateSupplier();
			}
			await this._syncData();
			document.getElementById('refresh').dispatchEvent(new Event('click'));

		}
		document.getElementById('supplierForm').addEventListener('submit', eventForm);
	},

	async _createSupplier() {
		const status = await apiSupplier.addSupplier(new FormData(document.getElementById('supplierForm')));
		if (status === '200') {
			this._notification('Succes Menambahkan Data', 'success');
			this._syncView();
		} else {
			this._notification('Maaf Ada masalah Didalam Server ...', 'error');
		}
	},

	async _updateSupplier() {
		const status = await apiSupplier.updateSupplier(new FormData(document.getElementById('supplierForm')));
		if (status === '200') {
			this._notification('Succes Mengedit Data', 'success');
			this._syncView();
		} else {
			this._notification('Maaf Ada masalah Didalam Server ...', 'error');
		}
	},
}




export default SupplierInitiator;
