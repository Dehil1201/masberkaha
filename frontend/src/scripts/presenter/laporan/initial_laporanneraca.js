import apiLaporanNeraca from '../../api/data-laporan.js';
import ApiSaldo from '../../api/data-saldo.js';
import ApiSettingApps from '../../api/data-setting-apps.js'

const LaporanNeracaInitiator = {

	async init() {
		await this._syncSaldo();
		await this._show();
		this._initCetakLaporanNeraca();
		this._setDate();
	},

	async _syncSaldo() {
		await ApiSaldo.scynchSaldo();
	},

	async _show() {
		tinymce.remove('#laporanView')
		tinymce.init({
			selector: 'textarea#laporanView',
			menubar: false,
			content_css: 'document',
			min_height: 500,
			plugins: 'print',
			visual: false,
			inline_styles: true,
			toolbar: 'undo redo | styleselect | fontsizeselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print',
			fontsize_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt'
		});
	},

	_setDate() {
		document.getElementById('startDate').focus();
		document.getElementById('startDate').valueAsDate = new Date();
		document.getElementById('endDate').valueAsDate = new Date();
	},

	async _initCetakLaporanNeraca() {
		const eventShowLaporanNeraca = async (e) => {
			e.preventDefault();
			const starDateValue = await document.getElementById('startDate').value;
			const endDateValue = await document.getElementById('endDate').value;
			const dataSettings = await ApiSettingApps.getSettingApps();
			const data = await apiLaporanNeraca.getLaporanNeraca(starDateValue, endDateValue);
			var editor = tinymce.get('laporanView');
			var content = `<html moznomarginboxes mozdisallowselectionprint>
			<div style="padding-bottom:5px;margin-bottom:5px">
				<b style="font-size:16px">${await dataSettings.nama_toko}</b>
				<br>
				${await dataSettings.alamat} Telp/HP ${await dataSettings.no_hp}</div>
			<table class="table" style="width:100%;">
				<tr>
					<td style="font-size:16px;text-align:center" colspan=3><b>LAPORAN NERACA</b></td>
				</tr>
				<tr>
					<td style="font-size:16px;text-align:center"><b>${await data.startDate}</b> s/d <b>${await data.endDate}</b>
					</td>
				</tr>
			</table>
			<!-- INVENTORY -->
			<h4 class="text-primary col-md-2" style="padding: 5px;border-radius: 5px;text-transform: uppercase;">INVENTORY</h4>
			<table class="table">
				<tbody>
					<tr>
						<td style="font-size:14px;width:300px">Total Emas (Inventory) </td>
						<td><b> : Rp.${await data.asetBarang} </b></td>
					</tr>
				</tbody>
			</table>
			
			<!-- PENDAPATAN -->
			<h4 class="text-primary col-md-2" style="padding: 5px;border-radius: 5px;text-transform: uppercase;">PENDAPATAN</h4>
			<table class="table">
				<tbody>
					<tr>
						<td style="font-size:14px;width:300px">Piutang </td>
						<td><b> : Rp.${await data.piutang} </b></td>
					</tr>
					<tr>
						<td style="font-size:14px;width:300px">Pendapatan Penjualan </td>
						<td><b> : Rp.${await data.penjualan} </b></td>
					</tr>
					<tr>
						<td style="font-size:14px;width:300px"><b>Total Pendapatan</b> </td>
						<td><b> : Rp.${await data.totalPemasukan} </b></td>
					</tr>
				</tbody>
			</table>
			
			<!-- PENGELUARAN -->
			<h4 class="text-primary col-md-2" style="padding: 5px;border-radius: 5px;text-transform: uppercase;">PENGELUARAN</h4>
			<table class="table">
				<tbody>
					<tr>
						<td style="font-size:14px;width:300px">Pembelian </td>
						<td><b> : -Rp.${await data.pembelian} </b></td>
					</tr>
					<tr>
						<td style="font-size:14px;width:300px">Terima Kembali </td>
						<td><b> : -Rp.${await data.buyback} </b></td>
					</tr>
					<tr>
						<td style="font-size:14px;width:300px">Bayar Hutang </td>
						<td><b> : -Rp.${await data.hutangDibayar} </b></td>
					</tr>
					<tr>
						<td style="font-size:14px;width:300px">Hutang </td>
						<td><b> : -Rp.${await data.hutangSisa} </b></td>
					</tr>
					<tr>
						<td style="font-size:14px;width:300px"><b>Total Pengeluaran</b> </td>
						<td><b> : -Rp.${await data.totalPengeluaran} </b></td>
					</tr>
				</tbody>
			</table>
			<br>
			<table class="table">
				<tbody>
					<tr>
						<td style="font-size:14px;width:300px"><b>SALDO AKHIR</b> </td>
						<td><b> : Rp.${await data.laba} </b></td>
					</tr>
				</tbody>
			</table>
			
			</html>`;
			editor.setContent(content);
			// await this._show();
			// window.open(`${API_ENDPOINT.LAPORAN_NERACA(starDateValue, endDateValue)}`, 'formpopup', "toolbar=no,scrollbars=yes,resizable=no,top=500,left=500,width=3800,height=4000");
		}

		document.getElementById('cetakLaporanNeraca').addEventListener('submit', eventShowLaporanNeraca);
	},
}

export default LaporanNeracaInitiator;
