import apiLaporanJurnal from '../../api/data-laporan.js';
import ApiSaldo from '../../api/data-saldo.js';
import ApiSettingApps from '../../api/data-setting-apps.js'

const LaporanJurnalInitiator = {

	async init() {
		await this._syncSaldo();
		await this._show();
		this._initCetakLaporanJurnal();
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

	async _initCetakLaporanJurnal() {
		const eventShowLaporanJurnal = async (e) => {
			e.preventDefault();
			const starDateValue = await document.getElementById('startDate').value;
			const endDateValue = await document.getElementById('endDate').value;
			const dataSettings = await ApiSettingApps.getSettingApps();
			const data = await apiLaporanJurnal.getLaporanAktivaPassiva(starDateValue, endDateValue);
			const dataOperasional = await apiLaporanJurnal.getLaporanNeraca(starDateValue, endDateValue);
			var editor = tinymce.get('laporanView');

			// Aktiva Lancar
			let elmAktivaLancar = ``;
			data.aktivaLancar.forEach((data) => {
				elmAktivaLancar += `<tr>
					<td style="font-size:14pt;width:300px">  ${data.no_rekening} - ${data.nama_jurnal} </td>
					<td style="font-size:14pt"><b> : Rp.${data.saldo} </b></td>
				</tr>`
			});

			// Aktiva Tetap
			let elmAktivaTetap = ``;
			data.aktivaTetap.forEach((data) => {
				elmAktivaTetap += `<tr>
					<td style="font-size:14pt;width:300px">  ${data.no_rekening} - ${data.nama_jurnal} </td>
					<td style="font-size:14pt"><b> : Rp.${data.saldo} </b></td>
				</tr>`
			});

			// Passiva
			let elmPassiva = ``;
			data.passiva.forEach((data) => {
				elmPassiva += `<tr>
					<td style="font-size:14pt;width:300px">  ${data.no_rekening} - ${data.nama_jurnal} </td>
					<td style="font-size:14pt"><b> : Rp.${data.saldo} </b></td>
				</tr>`
			});
			var content = `<html moznomarginboxes mozdisallowselectionprint>
			<div style="padding-bottom:5px;margin-bottom:5px">
				<b style="font-size:16px">${await dataSettings.nama_toko}</b>
				<br>
				${await dataSettings.alamat} Telp/HP ${await dataSettings.no_hp}</div>
			<table class="table" style="width:100%;">
				<tr>
					<td style="font-size:16px;text-align:center" colspan=3><b>LAPORAN JURNAL UMUM</b></td>
				</tr>
				<tr>
					<td style="font-size:16px;text-align:center"><b>${await dataOperasional.startDate}</b> s/d <b>${await dataOperasional.endDate}</b>
					</td>
				</tr>
			</table>
			<!-- AKTIVA -->
			<h4 class="text-primary col-md-2" style="padding: 5px;border-radius: 5px;text-transform: uppercase;">AKTIVA <br> - AKTIVA LANCAR</h4>
			<table class="table">
				<tbody>
					${elmAktivaLancar}
				</tbody>
			</table>
			<h4 class="text-primary col-md-2" style="padding: 5px;border-radius: 5px;text-transform: uppercase;"> - AKTIVA TETAP</h4>
			<table class="table">
				<tbody>
					${elmAktivaTetap}
				</tbody>
			</table>

			<!-- TOTAL AKTIVA -->
			<table class="table">
				<tbody>
					<tr>
						<td style="font-size:16pt;width:300px"><b> TOTAL AKTIVA</b> </td>
						<td style="font-size:16pt"><b> : Rp.${await data.totalAktiva} </b></td>
					</tr>
				</tbody>
			</table>
			
			<!-- PASSIVA -->
			<h4 class="text-primary col-md-2" style="padding: 5px;border-radius: 5px;text-transform: uppercase;">PASSIVA</h4>
			<table class="table">
				<tbody>
					${elmPassiva}
				</tbody>
			</table>

			<!-- TOTAL PASSIVA -->
			<table class="table">
				<tbody>
					<tr>
						<td style="font-size:16pt;width:300px"><b> TOTAL PASSIVA</b> </td>
						<td style="font-size:16pt"><b> : Rp.${await data.totalPassiva} </b></td>
					</tr>
				</tbody>
			</table>
			
			<!-- PENDAPATAN -->
			<h4 class="text-primary col-md-2" style="padding: 5px;border-radius: 5px;text-transform: uppercase;">PENDAPATAN TOTAL</h4>
			<table class="table">
				<tbody>
					<tr>
						<td style="font-size:14pt;width:300px">Piutang </td>
						<td style="font-size:16pt"><b> : Rp.${await dataOperasional.piutang} </b></td>
					</tr>
					<tr>
						<td style="font-size:14pt;width:300px">Pendapatan Penjualan </td>
						<td style="font-size:16pt"><b> : Rp.${await dataOperasional.penjualan} </b></td>
					</tr>
					<tr>
						<td style="font-size:14pt;width:300px"><b>Total Pendapatan</b> </td>
						<td style="font-size:16pt"><b> : Rp.${await dataOperasional.totalPemasukan} </b></td>
					</tr>
				</tbody>
			</table>
			
			<!-- BIAYA TOTAL -->
			<h4 class="text-primary col-md-2" style="padding: 5px;border-radius: 5px;text-transform: uppercase;">BIAYA TOTAL</h4>
			<table class="table">
				<tbody>
					<tr>
						<td style="font-size:14pt;width:300px">Pembelian </td>
						<td style="font-size:16pt"><b> : -Rp.${await dataOperasional.pembelian} </b></td>
					</tr>
					<tr>
						<td style="font-size:14pt;width:300px">Terima Kembali </td>
						<td style="font-size:16pt"><b> : -Rp.${await dataOperasional.buyback} </b></td>
					</tr>
					<tr>
						<td style="font-size:14pt;width:300px">Bayar Hutang </td>
						<td style="font-size:16pt"><b> : -Rp.${await dataOperasional.hutangDibayar} </b></td>
					</tr>
					<tr>
						<td style="font-size:14pt;width:300px">Hutang </td>
						<td style="font-size:16pt"><b> : -Rp.${await dataOperasional.hutangSisa} </b></td>
					</tr>
					<tr>
						<td style="font-size:14pt;width:300px"><b>Total Pengeluaran</b> </td>
						<td style="font-size:16pt"><b> : -Rp.${await dataOperasional.totalPengeluaran} </b></td>
					</tr>
				</tbody>
			</table>
			<br>
			<table class="table">
				<tbody>
					<tr>
						<td style="font-size:14pt;width:300px"><b>SALDO AKHIR</b> </td>
						<td style="font-size:16pt"><b> : Rp.${await dataOperasional.laba} </b></td>
					</tr>
					<tr>
						<td style="font-size:14pt;width:300px"><b>TOTAL AKTIVA + PASSIVA</b> </td>
						<td style="font-size:16pt"><b> : Rp.${await data.totalAktivaPassiva} </b></td>
					</tr>
				</tbody>
			</table>
			
			</html>`;
			editor.setContent(content);
			// await this._show();
			// window.open(`${API_ENDPOINT.LAPORAN_NERACA(starDateValue, endDateValue)}`, 'formpopup', "toolbar=no,scrollbars=yes,resizable=no,top=500,left=500,width=3800,height=4000");
		}

		document.getElementById('cetakLaporanJurnal').addEventListener('submit', eventShowLaporanJurnal);
	},
}

export default LaporanJurnalInitiator;
