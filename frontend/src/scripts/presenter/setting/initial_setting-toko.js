import ApiLogin from '../../api/data-login.js';
import ApiSettingApps from '../../api/data-setting-apps.js'
import FormatCurrency from '../../utils/initial-currency.js';

const initialSettingToko = {

	async init() {
		await this._showData();
		await this._giveEvenForm();
		this._initButton();
	},

	async _showData() {
		const _data = await ApiSettingApps.getSettingApps();
		document.getElementById('id').value = _data.id;
		document.getElementById('nama_toko').value = _data.nama_toko;
		document.getElementById('alamat').value = _data.alamat;
		document.getElementById('no_hp').value = _data.no_hp;
		document.getElementById('email').value = _data.email;
		document.getElementById('point_gram').value = _data.point_gram;
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

	async _giveEvenForm() {
		const eventForm = async (e) => {
			e.preventDefault();
			try {
				await ApiSettingApps.updateSettingToko({
					id: document.getElementById('id').value,
					nama_toko: document.getElementById('nama_toko').value,
					alamat: document.getElementById('alamat').value,
					no_hp: document.getElementById('no_hp').value,
					email: document.getElementById('email').value,
					point_gram: document.getElementById('point_gram').value,
				});
				this._notification(`Succes, Pengaturan toko telah diubah..`, 'success');
			} catch (error) {
				console.log(error);
				this._notification('Maaf Ada masalah Didalam Server ...', 'error');
			}
		}

		document.getElementById('settingTokoForm').addEventListener('submit', eventForm);
	},

	async _initButton() {
		const deleteAll = async (e) => {
			e.preventDefault();
			this.checkPassword('delete_all');
		}
		const deletePelanggan = async (e) => {
			e.preventDefault();
			this.checkPassword('pelanggan');
		}
		const deleteSupplier = async (e) => {
			e.preventDefault();
			this.checkPassword('supplier');
		}
		const deleteBarang = async (e) => {
			e.preventDefault();
			this.checkPassword('data_barang');
		}
		const emptyPrice = async (e) => {
			e.preventDefault();
			this.checkPassword('empty_price');
		}
		const deleteTransaction = async (e) => {
			e.preventDefault();
			Swal.fire({
				title: "Silahkan Pilih Periode!",
				html: `<div class="form-group row">
					<div class="col-sm-5">
						<input type="date" class="form-control" id="startDate">
					</div>
					<label for="endDate" class="col-form-label font-weight-bold">s/d</label>
					<div class="col-sm-5">
						<input type="date" class="form-control" id="endDate">
					</div>
					<h3 class='m-1 mx-auto'>Masukan Password</h3>
				</div>`,
				customClass: 'swal2-overflow',
				onOpen: function () {
					document.getElementById('startDate').valueAsDate = new Date();
					document.getElementById('endDate').valueAsDate = new Date();
				},
				input: 'password',
				inputAttributes: {
					autocapitalize: 'off',
					required: true
				},
				showCancelButton: true,
				confirmButtonText: 'Ok',
				showLoaderOnConfirm: true,
				preConfirm: (password) => {
					const _result = ApiLogin.CheckingPassword({
						username: document.getElementById('is_username').value,
						password: password,
					});
					return _result;
				},
				allowOutsideClick: () => !Swal.isLoading()
			}).then((result) => {
				if (result.value.authenticated) {
					let startDate = $('#startDate').val();
					let endDate = $('#endDate').val();
					const isSuccess = ApiSettingApps.emptyTable({
						table: 'delete_transaction',
						startDate: startDate,
						endDate: endDate
					});
					return isSuccess;
				} else {
					this._notification("Password yang dimasukan salah!", 'error');
				}
			}).then((result) => {
				if (result) {
					this._notification("Sukses menghapus data!", 'success');
				} else {
					this._notification("Ada masalah server!", 'error');
				}
			})
		}

		document.getElementById('delete_all').addEventListener('click', deleteAll)
		document.getElementById('delete_pelanggan').addEventListener('click', deletePelanggan)
		document.getElementById('delete_supplier').addEventListener('click', deleteSupplier)
		document.getElementById('delete_barang').addEventListener('click', deleteBarang)
		document.getElementById('delete_transaksi').addEventListener('click', deleteTransaction)
		document.getElementById('kosongkan_harga').addEventListener('click', emptyPrice)
	},

	checkPassword(table) {
		Swal.fire({
			title: 'Masukan pin',
			input: 'password',
			inputAttributes: {
				autocapitalize: 'off',
				required: true
			},
			showCancelButton: true,
			confirmButtonText: 'Ok',
			showLoaderOnConfirm: true,
			preConfirm: (password) => {
				const _result = ApiLogin.CheckingPassword({
					username: document.getElementById('is_username').value,
					password: password,
				});
				return _result;
			},
			allowOutsideClick: () => !Swal.isLoading()
		}).then((result) => {
			if (result.value.authenticated) {
				const isSuccess = ApiSettingApps.emptyTable({
					table: table
				});
				return isSuccess;
			} else {
				this._notification("Password yang dimasukan salah!", 'error');
			}
		}).then((result) => {
			if (result) {
				this._notification("Sukses menghapus data!", 'success');
			} else {
				this._notification("Ada masalah server!", 'error');
			}
		})
	},
}

export default initialSettingToko;
