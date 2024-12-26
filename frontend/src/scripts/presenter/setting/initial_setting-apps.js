import ApiSettingApps from '../../api/data-setting-apps.js'
import FormatCurrency from '../../utils/initial-currency.js';

const initialSettingApps = {

	async init() {
		this._showData();
		await this._showData();
		await this._initFormatCurrency();
		await this._giveEvenForm();
		await this._giveEvenFormHargaPasar();
	},

	async _showData() {
		document.getElementById('harga_potongan').focus();
		const _data = await ApiSettingApps.getSettingApps();
		document.getElementById('id').value = _data.id;
		document.getElementById('harga_potongan').value = await FormatCurrency.setValue(_data.harga_potongan);
		document.getElementById('harga_pasar').value = await FormatCurrency.setValue(_data.harga_pasar);
	},

	async _setPrice(idHtml) {
		FormatCurrency.initialCurrency({
			elmId: `${idHtml}`
		})
	},

	async _initFormatCurrency() {
		await this._setPrice('harga_potongan');
		await this._setPrice('harga_pasar');
	},

	async _syncData() {
		this._showData();
	},

	_notification(msg, status) {
		swal.fire({
			title: `${status}`,
			text: `${msg}`,
			icon: `${status}`,
			showConfirmButton: false,
			timer: 2000
		})
	},

	async _giveEvenForm() {
		const eventForm = async (e) => {
			e.preventDefault();
			try {
				const result = await ApiSettingApps.updateSettingApps({
					id: document.getElementById('id').value,
					harga_potongan: await FormatCurrency.getValue(document.getElementById('harga_potongan').value),
				});
				if (result == true) {
					this._notification('Berhasil Update Harga Potongan!', 'success');
					this._showData();
				} else {
					this._notification('Perubahan Gagal Diproses!', 'error');
				}
			} catch (error) {
				console.log(error);
				this._notification('Maaf Ada masalah Didalam Server ...', 'error');
			}
		}

		document.getElementById('aturan').addEventListener('submit', eventForm);

	},

	async _giveEvenFormHargaPasar() {
		const eventFormHargaPasar = async (e) => {
			e.preventDefault();
			try {
				swal.fire({
					title: 'Update!',
					html: "Update Harga Pasaran? <br> <strong>Ini akan mengupdate semua harga jual stok barang!</strong>",
					icon: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: 'Ya'
				}).then(async (result) => {
					if (result.value) {
						await ApiSettingApps.updateHargaPasar({
							harga_pasar: await FormatCurrency.getValue(document.getElementById('harga_pasar').value),
						});
						this._notification(`Harga Pasaran Sukses Diperbarui`, 'success');
						this._showData();
					};
				});
			} catch (error) {
				console.log(error);
				this._notification('Maaf Ada masalah Didalam Server ...', 'error');
			}
		}

		document.getElementById('acuanPasar').addEventListener('submit', eventFormHargaPasar);
	},
}

export default initialSettingApps;
