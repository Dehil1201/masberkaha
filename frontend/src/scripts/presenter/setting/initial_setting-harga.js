import ApiSettingApps from '../../api/data-setting-apps.js'
import FormatCurrency from '../../utils/initial-currency.js';

const initialSettingHarga = {

	async init() {
		this._data = await ApiSettingApps.getSettingApps();
		document.getElementById('status-aksi').focus();
		await this._initialFormat();
		await this._giveEvenForm();
	},


	async _initialFormat() {
		await FormatCurrency.initialCurrency({
			elmId: 'jumlah_harga'
		});
	},

	async _syncData() {
		this._showData();
	},

	_notification(msg, status) {
		swal.fire({
			title: `${status}`,
			text: `${msg}`,
			icon: `${status}`,
			confirmButtonColor: '#4fa7f3'
		})
	},

	async _giveEvenForm() {
		const eventForm = async (e) => {
			e.preventDefault();
			let status = document.getElementById('status-aksi').value
			try {
				await ApiSettingApps.updateSettingHarga({
					status: status,
					jumlah_harga: await FormatCurrency.getValue(document.getElementById('jumlah_harga').value),
				});
				let aksi = ''
				if (status == 1) {
					aksi = 'Menaikan'
				} else if (status == 2) {
					aksi = 'Menurunkan'
				}
				this._notification(`Succes ${aksi} Semua Data Barang In Stok`, 'success');
			} catch (error) {
				console.log(error);
				this._notification('Maaf Ada masalah Didalam Server ...', 'error');
			}
		}

		document.getElementById('aturan').addEventListener('submit', eventForm);
	},
}




export default initialSettingHarga;
