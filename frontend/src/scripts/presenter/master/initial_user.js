import API_ENDPOINT from '../../config/globals/endpoint.js';
import apiUser from '../../api/data-user.js';
const dataTableUserInitiator = {

	async init() {
		await this._show();
		this._getLevelUser();
		this._initialCreate();
		this._initialUpdate();
		this._initForSubmit();
		this._initialDelete();
		this._initialChangePassword();
		this._initChangePasswordProcess();
	},

	async _show() {
		const level  = this._isAdminLogin();
		let table = await $('#tableUser').DataTable({
			"processing": true,
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			"serverSide": true,
			"ajax": {
				"url": `${API_ENDPOINT.LIST_USER}`,
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
				"defaultContent": `<div style="display:flex"><button style="margin:6px" class='btn btn-info btn-circle' id='edit' title='Edit data user'><i class='far fa-edit'></i></button>
                     <button style="margin:6px" class='btn btn-danger btn-circle' id='delete' title='Hapus data user'><i class='fas fa-trash'></i></button>
					 <button style="margin:6px" class='btn btn-warning btn-circle' id='change_password' title='Ganti Password'><i class='fas fa-key'></i></button></div>`
			},
			{
				"targets": 6,
				"render": function (data, type, row, meta) {
					
					 if (level == 1) {
						return `<p>${data}</p>`;
					 }else{
						return `<input type='password' class='form-control' style='width:100px' value='halo-kasir'/>`;
					 }
					
				}
			},
			{
				"targets": [0],
				"visible": true,
				"searchable": false
			}
			]
		});

		$('#refresh').click(() => {
			let oTable = $('#tableUser').dataTable();
			oTable.fnDraw(false);
		});

		let btnStylePrint = document.querySelectorAll('.dt-button');
		for (let i = 0; i < btnStylePrint.length; i++) {
			btnStylePrint[i].classList.add("btn");
			btnStylePrint[i].classList.add("btn-light");
		}
	},

	
	_isAdminLogin() {
		let level = document.getElementById('level-user').value;
		if (level == 1) {
			return 1
		} else {
			return 0
		}
	},

	async _syncData() {
		let oTable = $('#tableUser').dataTable();
		oTable.fnDraw(false);
	},

	async _syncView() {
		$('#modalData').modal('hide');
		$('#userForm').trigger("reset");
	},

	async _initialUpdate() {
		$('#tableUser tbody').on('click', '#edit', function () {
			$('#myModalLabel').html("Ubah User");
			const table = $('#tableUser').DataTable();
			let data = table.row($(this).parents('tr')).data();
			$('#btn-save').html('<i class="fa fa-check-square-o"></i> Simpan');
			$('#btn-save').val('simpan');
			$('#modalData').modal('show');
			$('#user_id').val(data[0]);
			$('#nama_user').val(data[1]);
			$('#username').val(data[2]);
			$('#level').val(data[3].split('-')[0]);
			$('#alamat').val(data[4]);
			$('#no_hp').val(data[5]);
			$('#password_field').hide();
			$('#userForm').attr("data-action", "update");
		});
	},

	async _initialChangePassword() {
		$('#tableUser tbody').on('click', '#change_password', function () {
			const table = $('#tableUser').DataTable();
			let data = table.row($(this).parents('tr')).data();
			$("#title-change-pass").html(`Ubah Password - ${data[2]}`)
			document.getElementById("passwordForm").reset();
			$('#modalChangePassword').modal('show');
			$('#user_id_pass').val(data[0]);
		});
	},

	async _initialCreate() {
		$('#modalData').on('shown.bs.modal', function () {
			$('#nama_user').focus();
		});
		document.getElementById('create_data').addEventListener('click', () => {
			$('#btn-save').html('<i class="fa fa-check-square-o"></i> Tambah');
			$('#btn-save').val('tambah');
			$('#user_id').val('');
			$('#userForm').trigger("reset");
			$('#myModalLabel').html("Tambah User");
			$('#modalData').modal('show');
			$('#password_field').show();
			$('#userForm').attr("data-action", "create"); //for state create
		});
	},

	async _initialDelete() {
		$('#tableUser tbody').on('click', '#delete', function () {
			const table = $('#tableUser').DataTable();
			let data = table.row($(this).parents('tr')).data();

			swal.fire({
				title: 'Hapus',
				html: "Anda ingin menghapus data ini? <br> <strong>Nama User </strong>: " + data[1],
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Ya, Hapus!'
			}).then(async (result) => {
				if (result.value) {
					let id = data[0];
					const status = await apiUser.deleteUser(id);

					if (status === '200') {
						swal.fire({
							title: 'Hapus',
							text: 'Data berhasil dihapus',
							icon: 'success',
							showConfirmButton: false,
							timer: 1000
						});
						//refres manual 
						let oTable = $('#tableUser').dataTable();
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
			confirmButtonColor: '#4fa7f3'
		})
	},

	async _getLevelUser() {
		let elmData = '';
		const levelUser = await apiUser.getAksesUser();
		levelUser.forEach(data => {
			elmData += `<option value="${data.id}">${data.level}</li>`;
        });
        
		$("#level").removeAttr('disabled', 'disabled').html('<option disabled selected value> -- Pilih Jenis User -- </option>' + elmData);
	},

	async _initForSubmit() {
		const eventForm = async (e) => {
			e.preventDefault();
			const stateForm = document.getElementById('userForm').dataset.action;

			if (stateForm === 'create') {
				this._createUser();
			} else if (stateForm === 'update') {
				this._updateUser();
			}
			await this._syncData();
			document.getElementById('refresh').dispatchEvent(new Event('click'));
		}
		document.getElementById('userForm').addEventListener('submit', eventForm);
	},

	async _initChangePasswordProcess() {
		const eventChangePassword = async (e) => {
			e.preventDefault();
			try {
				const newPass = document.getElementById('new_password').value;
				const confirmPass = document.getElementById('confirm_password').value;
				if (confirmPass != newPass) {
					this._notification('Password baru dan konfirmasi password tidak sama!', 'error');
				} else {
					const _data = await apiUser.changePassword(new FormData(document.getElementById('passwordForm')));
					if (_data.status === true) {
						this._notification(_data.message, 'success');
					} else {
						this._notification(_data.message, 'error');
					}
					$('.swal2-confirm').focus();
				}
			} catch (error) {
				this._notification('Maaf Ada masalah Didalam Server Harap Mengisi Data Dengan Benar...', 'error');
			}
		}
		document.getElementById('passwordForm').addEventListener('submit', eventChangePassword);
	},

	async _createUser() {
		try {
			const status = await apiUser.addUser(new FormData(document.getElementById('userForm')));
			if (status === '200') {
				this._notification('Succes Menambahkan Data', 'success');
				this._syncView();
			}
		} catch (error) {
			this._notification('Maaf Ada masalah Didalam Server Harap Mengisi Data Dengan Benar...', 'error');
		}

	},

	async _updateUser() {
		const status = await apiUser.updateUser(new FormData(document.getElementById('userForm')));
		if (status === '200') {
			this._notification('Succes Mengedit Data', 'success');
			this._syncView();
		} else if (status === '500') {
			this._notification('Maaf Ada masalah Didalam Server Harap Mengisi Dengan Benar...', 'error');
		}
	},
}




export default dataTableUserInitiator;
