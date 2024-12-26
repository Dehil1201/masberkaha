import ApiFaktur from "../../api/data-faktur.js";
import ApiSettingApps from '../../api/data-setting-apps.js'
import CONFIG from '../../config/globals/config.js';

const PrintInitiator = {
	async initPembelianNew(faktur, printStats) {
		const data = await ApiFaktur.Pembelian(faktur);
		this._makeViewFakturPembelian(data, printStats)
	},

	async initPenjualanNew(faktur) {
		let theme;
		const data = await ApiFaktur.Penjualan(faktur);
		if (parseInt(data.detailJual[0].kadar) < 700) {
			theme = { background: "#0bb10e", color: "#fff" }
			this._makeInvoiceUI(data, theme)
		} else {
			theme = { background: "#0bb10e", color: "#fff" }
			this._makeInvoiceUI(data, theme)
		}
	},

	async initQuantityNew(faktur, elmID, printStatus) {
		const data = await ApiFaktur.PenjualanQuantity(faktur);
		this._makeViewFakturPenjualanQuantity(data, elmID, printStatus)
	},
	
	
	
	
	async initBuybackNew(faktur, elmID, printStatus) {
		const data = await ApiFaktur.Buyback(faktur);
		this._makeViewFakturBuyback(data, elmID, printStatus)
	},

	async _makeViewFakturPembelian(data, printStats) {
		const dataSettings = await ApiSettingApps.getSettingApps();
		let dataDetailBeli = data.detailBeli;
		let dataHeadBeli = data.headBeli;

		let elmHeadBeli = '';
		let elmHeadBeliFooter = '';
		let elmPembelianDetail = '';
		let number = 0;

		let namaSupplier = ((dataHeadBeli.nama_supplier === null) ? '-' : dataHeadBeli.nama_supplier);
		let alamatSupplier = ((dataHeadBeli.nama_supplier === null) ? '-' : dataHeadBeli.alamat_supplier);
		let logo;
		if (this.fileExists(`${CONFIG.BASE_IMAGE_URL}logo.png`)) {
			logo = `<img src="${CONFIG.BASE_IMAGE_URL}logo.png" style="margin-top:20px;width:30px;height:30px">`;
		} else {
			logo = ``;
		}
		elmHeadBeli = `<table>
			<tr>
				<td>
					<p style="font-size:12px;font-family:arial;margin:0;padding-left:20px;">${logo}<br>
						<b>${dataSettings.nama_toko}</b><br>${dataSettings.alamat}<br>Telp. ${dataSettings.no_hp}
	
					</p>
				</td>
				<td>
					<table style="margin-left:70px">
						<tr>
							<td style="width:100px"><b>Tanggal</b></td>
							<td style="width:30px">:</td>
							<td>${dataHeadBeli.date}</td>
						</tr>
						<tr>
							<td><b>Supplier</b></td>
							<td style="width:30px">:</td>
							<td>${namaSupplier}</td>
						</tr>
						<tr>
							<td><b>Alamat</b></td>
							<td style="width:30px">:</td>
							<td>${alamatSupplier}</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
		<table class="table">
			<tr>
				<td style="width:150px"><b>Nota Pembelian :</b></td>
				<td id="notaPembelian">${dataHeadBeli.faktur}</td>
				<td><b>Status Bayar : </b></td>
				<td><b>${((dataHeadBeli.status = 1) ? "Lunas" : "Belum Lunas")}</b></td>
			</tr>
			</table>`

		elmHeadBeliFooter = `<table class="tableCheckout" cellspacing="0" cellpadding="0" border="0">
			<tr>
				<td style="width:150px"><b>Grand Total</b></td>
				<td style="width:30px">:</td>
				<td>${dataHeadBeli.grand_total}</td>
			</tr>
		</table></div>`

		await dataDetailBeli.forEach(data => {
			number++;
			elmPembelianDetail += `<tr>
			<td>${number}</td>
			<td>${data.kode_barang}</td>
			<td>${data.jenis_barang}</td>
			<td>${data.nama_barang}</td>
			<td>${data.berat}</td>
			<td>${data.kadar}</td>
			<td>${data.harga}</td>
			<td>${data.total}</td>
			${(!printStats) ? `<td><button class="btn btn-danger btn-sm btn-circle" id="delete_detail" title="Hapus Barang ${data.kode_barang}"><i class='fas fa-trash'></i></button></td>` : ``}
			</tr>`
		});

		let styleElement = `<style type="text/css">
		.notaDesign {
			margin-left : 230px;
			margin-right : 230px;
			font-size: 14px;
		}
		@media print {
			@page {
				size:  A4;
				margin: 0;
			}
		}
	
		.tableCheckout {
			float: right;
			margin-right: 55px;
		}
	
		.table {
			margin: 0;
			padding: 0;
		}
	
		.isi {
			border-top: 1px solid #000;
			text-align: center;
		}
	
		</style>`

		let elm = `${styleElement}
		<div class="notaDesign" id="notaPrint">
		${elmHeadBeli}
			<table class="table " id="dataPembelian" cellspacing="0" cellpadding="0" border="0">
				<thead>
					<tr>
						<th style="width:50px">No</th>
						<th>Kode</th>
						<th>Jenis</th>
						<th>Nama Keterangan</th>
						<th>Berat</th>
						<th>%</th>
						<th>Harga</th>
						<th>Jumlah</th>
						${(!printStats) ? `<th>Aksi</th>` : ``}
					</tr>
				</thead>
				<tbody>
					${elmPembelianDetail}
				</tbody>
			</table>
			${elmHeadBeliFooter}`;

		if (printStats) {
			document.getElementById('printResultNota').innerHTML = elm;
			this._print();
		} else {
			document.getElementById('printArea').innerHTML = elm;
		}
		await this._initialDeleteDetailPembelian();
	},

	async _makeViewFakturPenjualanQuantity(data, elmID, printStatus) {
		const dataSettings = await ApiSettingApps.getSettingApps();
		let dataDetailJual = data.detailJual;
		let dataHeadJual = data.headJual;

		let elmHeadJual = '';
		let elmHeadJualFooter = '';
		let elmPenjualanDetail = '';
		let number = 0;

		let namaPelanggan = ((dataHeadJual.nama_pelanggan === null) ? '-' : dataHeadJual.nama_pelanggan);
		let alamatPelanggan = ((dataHeadJual.nama_pelanggan === null) ? '-' : dataHeadJual.alamat_pelanggan);
		let logo;
		if (this.fileExists(`${CONFIG.BASE_IMAGE_URL}logo.png`)) {
			logo = `<img src="${CONFIG.BASE_IMAGE_URL}logo.png" style="margin-top:20px;width:80px;height:80px">`;
		} else {
			logo = ``;
		}
		elmHeadJual = `<table>
			<tr>
				<td>
					<p style="font-size:12px;font-family:arial;margin:0;padding-left:20px;">${logo}<br>
						<b>${dataSettings.nama_toko}</b><br>${dataSettings.alamat}<br>Telp. ${dataSettings.no_hp}
					</p>
				</td>
				<td>
					<table style="margin-left:70px">
						<tr>
							<td style="width:100px"><b>Tanggal</b></td>
							<td style="width:30px">:</td>
							<td>${dataHeadJual.date}</td>
						</tr>
						<tr>
							<td><b>Pelanggan</b></td>
							<td style="width:30px">:</td>
							<td>${namaPelanggan}</td>
						</tr>
						<tr>
							<td><b>Alamat</b></td>
							<td style="width:30px">:</td>
							<td>${alamatPelanggan}</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
		<table class="table">
			<tr>
				<td style="width: 130px;"><b>Nota Penjualan</b></td>
				<td>:</td>
				<td>${dataHeadJual.faktur} - ${dataHeadJual.kasir}</td>
				<td></td>
				<td><b>${((dataHeadJual.status = 1) ? "Lunas" : "Belum Lunas")}</b></td>
			</tr>
			</table>`

		elmHeadJualFooter = `<table class="tableCheckout" cellspacing="0" cellpadding="0" border="0">
			<tr>
				<td style="width:150px"><b>Grand Total</b></td>
				<td style="width:30px">:</td>
				<td>${dataHeadJual.grand_total}</td>
			</tr>
			<tr>
				<td style="width:150px"><b>Bayar</b></td>
				<td style="width:30px">:</td>
				<td>${dataHeadJual.bayar}</td>
			</tr>
			<tr>
				<td style="width:150px"><b>Kembali</b></td>
				<td style="width:30px">:</td>
				<td>${dataHeadJual.kembali}</td>
			</tr>
		</table></div>`

		await dataDetailJual.forEach(data => {
			number++;
			elmPenjualanDetail += `<tr>
			<td>${number}</td>
			<td>${data.kode_barang}</td>
			<td>${data.jenis_barang}</td>
			<td>${data.nama_barang}</td>
			<td>${data.harga}</td>
			<td>${data.qty}</td>
			<td>${data.total}</td>
			</tr>`
		});

		let styleElement = `<style type="text/css">
		.notaDesign {
			margin-left : 230px;
			margin-right : 230px;
			font-size: 14px;
		}
		.tableCheckout {
			float: right;
			margin-right: 55px;
		}
		.table {
			margin: 0;
			padding: 0;
		}
		.isi {
			border-top: 1px solid #000;
			text-align: center;
		}
		</style>`

		let elm = `${styleElement}
		<div class="notaDesign" id="notaPrint">
		${elmHeadJual}
			<table class="table " id="dataPenjualan" cellspacing="0" cellpadding="0" border="0">
				<thead>
					<tr>
						<th style="width:50px">No</th>
						<th>Kode</th>
						<th>Jenis</th>
						<th>Nama Keterangan</th>
						<th>Harga</th>
						<th>Qty</th>
						<th>Total</th>
					</tr>
				</thead>
				<tbody>
					${elmPenjualanDetail}
				</tbody>
			</table>
			${elmHeadJualFooter}`;

		document.getElementById(`${elmID}`).innerHTML = elm;
		if (printStatus == 1) {
			setTimeout(() => {
				this._print();
			}, 1000);
		}
	},

	async _makeViewFakturPenjualanSameOrigin(data) {
		let dataDetailJual = data.detailJual;
		let dataHeadJual = data.headJual;
		let nama_pelanggan = dataHeadJual.nama_pelanggan;
		let namaPelanggan = ((nama_pelanggan === null) ? '-' : nama_pelanggan);
		let alamatPelanggan = ((nama_pelanggan === null) ? '-' : dataHeadJual.alamat_pelanggan);

		let containerStyle = `<style type="text/css">
		#printResultNota{
			height: 100%; 
			font-weight : 900;
			color:black;
			background-position: center;
			background-repeat: no-repeat;
			background-size: contain;
			z-index:-1;
		}
		
		.date{
			position: absolute;
			left: 19.2cm;
			font-weight:700;
			top: 1.4cm;
			line-height: 0;
			font-size: 16px;
		}
		
		.date-end{
			position: absolute;
			left: 22.5cm;
			font-weight:700;
			top: 1.4cm;
			line-height: 0;
			font-size: 16px;
		}
		
		.name-pelanggan{
			position: absolute;
			left: 19.5cm;
			top: 2.1cm;
			font-size: 16px;
			line-height: 0;
		}
		
		.address{
			position: absolute;
			top: 3cm;
			left: 18.3cm;
			font-size: 16px;
			line-height: 0;
		}
		
		
		.faktur-code{
			position: absolute;
			top: 4.3cm;
			font-weight:700;
			left: 7.4cm;
			font-size: 16px;
			line-height: 0;
		}
		
		.table-detail{
			position: absolute;
			top: 5.3cm;
			left: 4.8cm;
			font-size: 16px;
			font-weight:700;
			border-collapse:separate; 
  			border-spacing: 0.11cm;
			
			
		}
		
		.qty{
			width: 1.2cm;
		}
		
		.name-barang{
			line-height: 1;
			width: 8.3cm;
			font-size:14px;
			letter-spacing: 2px;  
		}
		
		.berat{
			line-height: 1.5;
			width: 2cm;
		}
		
		.harga{
			width: 2.1cm;
		}
		
		.grand-total{
			font-weight:700;
			text-align:center;
			width: 2.7cm;
		}
		
		
		.tr-table{
			vertical-align: top;
		}
		
		
		.count-grand-total{
			position: absolute;
			top: 11cm;
			font-weight:700;
			left: 19.4cm;
			line-height: 0;
		  }
		  
		  .tip{
			  font-weight:700;
			  position: absolute;
			  top: 11.9cm;
			  left: 19.4cm;
			  line-height: 0;
		  }
		.container{
			position: relative;
				
			width: 15cm;
			height: 10.5cm;
			z-index: -1;
		}
	</style>`
		let footerElement = `</body></html>`
		let dateOrigin = dataHeadJual.date;
		let kasirName = dataHeadJual.kasir
		let date = this._convertDate(dateOrigin);
		let dateEnd = dateOrigin.substring(dateOrigin.length - 2, dateOrigin.length);
		let elmHead = `
				<p class="date">
					${date}
				</p>
				
				<p class="date-end">
				${dateEnd}
				</p>
				
				<p class="name-pelanggan">
				${namaPelanggan}
				</p>
				<p class="faktur-code">
					${dataHeadJual.faktur} - ${kasirName}
				</p>
				<p class="address">
				${alamatPelanggan}
				</p>`

		let contentDetail = ``

		await dataDetailJual.forEach((data) => {
			let kdBarang = data.kode_barang
			let namaBarang = data.nama_barang
			let jenis_barang = data.jenis_barang
			contentDetail += `
		<tr class="tr-table">
			<td class="qty">1</td>
			<td class="name-barang">${kdBarang} - ${jenis_barang} <br> ${namaBarang}</td>
			<td class="berat">${data.berat}</td>
			<td class="harga">${data.harga}</td>
			<td class="grand-total">${data.sub_total}</td>
		</tr>
		`
		});


		let elmDetail = `<table class="table-detail">
				${contentDetail}
		</table>`;


		let elmFooter = `
		<p class="count-grand-total">
			${dataHeadJual.grand_total}
		</p>
		<p class="tip">
			${dataHeadJual.ongkosTotal}
		</p>`;
		let elm = containerStyle + elmHead + elmDetail + elmFooter;
		document.getElementById('printResultNota').innerHTML = elm;
		this._print();
	},

	async _makeInvoiceUI(data, theme) {
		const dataSettings = await ApiSettingApps.getSettingApps();
		let dataDetailJual = data.detailJual;
		let dataHeadJual = data.headJual;
		let dateOrigin = dataHeadJual.date;
		let namaPelanggan = ((dataHeadJual.nama_pelanggan === null) ? '-' : dataHeadJual.nama_pelanggan);
		let logo;
		if (this.fileExists(`${CONFIG.BASE_IMAGE_URL}logo.png`)) {
			logo = `<img src="${CONFIG.BASE_IMAGE_URL}logo.png" style="margin-top:10px;width: 100;height: 100;">`;
		} else {
			logo = ``;
		}
		let contentHeader = ` 
	<style>
	.notaDesignInvoiceUi {
	width: 100%;
    max-width: 100%;
	height: 10.39cm;
	font-size: 14px;
	}

		.box {
	display: flex;
	flex-wrap: wrap;
	flex-direction: row;
	background-color: #23395d;
	}

		.box-header {
			background-color: ${theme.background}
	}
		.text-header {
			color: ${theme.color}
	}

		.box-gray {
	background-color: #e5e5e5;
	color : orange;
	font-size : 12px;
	}


		.lastly {
	margin-left: auto;
	height: 10px;
	width: 270px;
	}

		.lastly-gray {
	background-color: #e5e5e5;
	}

	.title {
		flex: 1 0 100%;
		text-align: center;
	}
	
	.first {
		color: white;
	}
	
	.text-secondary-900 {
		color: black;
	}
	
	.gray-header {
    background-color: #c4c4c4;
    position: absolute;
    width: 270px;
    height: 124px;
}
	
	.gray-content {
		background-color: ;
	}
	
	
	
	.bold {
	font-weight: bold;
	}
	
	.mg-left {
		margin-left: 20px;
		margin-bottom: -15px;
	}
	
	.mg-end {
		margin-left: 10px;
	}
	
	#table_report {
		padding-right: 20px;
		padding-left: 20px;
		background-color: white;
		color: #000;
		margin-bottom:9px;
	}
	
	#table_report td {
		text-align: center;
		vertical-align: middle;
		height: 50px;
		width: 50px;
	}
	
	#table_report th {
		background-color: #c4c4c4;
	}
	
	.barcode-invoice {
		width: 180px;
	}
	
	
	.image {
		width: 100px;
		height: 100px;
	}
	.logo {
		display: block;
		margin-top: 7px;
		position: absolute;
	}
	</style>
	<div class="notaDesignInvoiceUi  gray-content" id="notaPrint">
	
	<div class="box box-header" id="ubah_warna">
		<div class="first mg-left">
		<div class="logo">
		${logo}
		</div>
			<h3 class="text-header" style="font-size=30px;font-family: time new rowman;text-align: center;padding-top: 20px;margin-bottom: -23px;font-weight: bolder;">${dataSettings.nama_toko}</h3><br><p class="text-header" style="font-size:12px;font-family:arial;margin:0;padding-left:20px; width:1020px; text-align:center;">${dataSettings.alamat}<br>Telp. ${dataSettings.no_hp}
		</p>
		</div>
		<div class="lastly text-header" style="margin-top:10px;font-size: 14px; z-index:9999 margin-top:18px">
			<p>Tanggal : <b>${dateOrigin}</b><br>Tn/Ny : ${namaPelanggan} </p>
		</div>
		<div class="title bold text-header">
			<p>SURAT JAMINAN</p>
		</div>
	</div>
	
	<div class="box box-gray">
		<div class="first mg-left text-secondary-900">
		<p> No. Faktur : <b>${dataHeadJual.faktur}</b> </p>
		</div>
		<div class="lastly lastly-gray text-secondary-900">
		<p>Sales: ${dataHeadJual.kasir}  </p>
		</div>
	</div>
	
	<table id="table_report" class="box-shadow" width="100%s" align="center">
	<thead align="center">
	<tr>
		<th style="width:15%">Foto</th>
		<th style="width:15%">Kode BRG</th>
		<th style="width:25%">Nama Produk</th>
		<th style="width:10%">Berat</th>
		<th style="width:10%">Harga</th>
		<th style="width:10%">Ongkos</th>
		<th style="width:15%">Jumlah</th>
	</tr>
	</thead><tbody>`

		let contentItem = ``

		await dataDetailJual.forEach((data) => {
			contentItem += `
				<tr>
					<td><img src="${(this.fileExists(`${CONFIG.BASE_FOTO_URL}${data.foto}`) ? `${CONFIG.BASE_FOTO_URL}${data.foto}` : 'Tidak ada')}" style="width: 160px;height: 160px;padding:5px;border-radius:10px;"></td>
					<td><svg style="margin:0" id="barcode${data.kode_barang}"></svg></td>
					<td><b>${data.nama_barang}</b></td>
					<td><b>${data.berat} Gr</b></td>
					<td><b>${data.harga}</b></td>
					<td><b>${dataHeadJual.ongkosTotal}</b></td>
					<td><b>${data.sub_total}</b></td>
				</tr>
		`
		});

		let footer = `</tbody>
			</table>
				<div class="box box-gray">
					<div class="first mg-left bold text-secondary-900">
					<p><b>${dataHeadJual.terbilang}</b></p>
					</div>
					<div class="lastly lastly-gray" style="padding-right: 20px">
						<div class="gray-header box-shadow">
						<p style="padding: 5px;color:#000;font-size: 16px;">Total (Rp) : <b>${dataHeadJual.grand_total}</b></p>
						</div>
						<br>
						<br>
						<br>
                		<div class="container-barcode">
        				<svg id="barcodeInvoice"></svg>
        				</div>
					</div>
				</div>
		
			<div class="box box-gray">
				<div class="first  mg-left text-secondary-900 ">
				<p class="m-0">PERHATIAN</p>
			<ol>
				<li>Produk yang dibeli telah ditimbang dan disaksikan oleh pembeli</li>
				<li>Bila produk hendak dijual, surat jaminan ini <strong>WAJIB</strong> dibawa</li>
				<li>Terima reparasi dan pesanan</li>
				<li>Satu surat satu barang</li>
						<br>
						<br>
						<br>
			</ol>
			</div>
			
			
			
			<div class="box box-gray">
				<div class="first  mg-left text-secondary-900 ">
				<p class="m-0">Melayani Pembayaran Menggunakan :</p>
				
			<img src="${CONFIG.BASE_IMAGE_URL}bri.png" style="margin-top: 4px;width: 40px;">
			<img src="${CONFIG.BASE_IMAGE_URL}bca.png" style="margin-top: 4px;width: 40px;">
			<img src="${CONFIG.BASE_IMAGE_URL}bni.png" style="margin-top: 4px;width: 40px;">
			<img src="${CONFIG.BASE_IMAGE_URL}mandiri.png" style="margin-top: 4px;width: 40px;">
			<img src="${CONFIG.BASE_IMAGE_URL}mastercard.png" style="margin-top: 4px;width: 40px;">
			<img src="${CONFIG.BASE_IMAGE_URL}paypal.png" style="margin-top: 4px;width: 40px;">
			</div>
			
			
			<div class="lastly lastly-gray text-secondary-900 ">
				
				</div>
			</div>
		</div>`


		let elm = contentHeader + contentItem + footer;
		document.getElementById('printResultNota').innerHTML = elm;
		await this._initBarcodeInvoice(dataHeadJual.faktur)
		await this._afterRenderBarcode(dataDetailJual);

		this._print();
	},
	async _afterRenderBarcode(result) {
		await result.forEach(async (data) => {
			await JsBarcode(`#barcode${data.kode_barang}`, `${data.kode_barang}`, {
				width: 1,
				height: 30,
				margin: 15,
			});
		});
	},
	async _makeViewFakturBuyback(data, elmID, printStatus) {
		const dataSettings = await ApiSettingApps.getSettingApps();
		let dataDetailBuyback = data.detailBuyback;
		let dataHeadBuyback = data.headBuyback;

		let elmHeadBuyback = '';
		let elmHeadBuybackFooter = '';
		let elmBuybackDetail = '';
		let number = 0;

		let namaPelanggan = ((dataHeadBuyback.nama_pelanggan === null) ? '-' : dataHeadBuyback.nama_pelanggan);
		let alamatPelanggan = ((dataHeadBuyback.nama_pelanggan === null) ? '-' : dataHeadBuyback.alamat_pelanggan);
		let logo;
		if (this.fileExists(`${CONFIG.BASE_IMAGE_URL}logo.png`)) {
			logo = `<img src="${CONFIG.BASE_IMAGE_URL}logo.png" style="margin-top: 4px;width: 150;height: 150px;">`;
		} else {
			logo = ``;
		}
		elmHeadBuyback = `<table>
			<tr>
				<td>
					<p style="font-size:12px;font-family:arial;margin:0;padding-left:20px;">${logo}<br>
						<b>${dataSettings.nama_toko}</b><br>${dataSettings.alamat}<br>Telp. ${dataSettings.no_hp}
					</p>
				</td>
				<td>
					<table style="margin-left:70px">
						<tr>
							<td style="width:100px"><b>Tanggal</b></td>
							<td style="width:30px">:</td>
							<td>${dataHeadBuyback.date}</td>
						</tr>
						<tr>
							<td><b>Pelanggan</b></td>
							<td style="width:30px">:</td>
							<td>${namaPelanggan}</td>
						</tr>
						<tr>
							<td><b>Alamat</b></td>
							<td style="width:30px">:</td>
							<td>${alamatPelanggan}</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
		<table class="table" style="margin-left: 10px;">
			<tr>
				<td style="width: 130px;"><b>Nota Terima :</b></td>
				<td id="notaBuyback">${dataHeadBuyback.faktur}</td>
			</tr>
			</table>`

		elmHeadBuybackFooter = `<table class="tableCheckout" cellspacing="0" cellpadding="0" border="0">
			<tr>
				<td style="width:150px"><b>Grand Total</b></td>
				<td style="width:30px">:</td>
				<td>-${dataHeadBuyback.grand_total}</td>
			</tr>
		</table>
		<table class="table " style="margin: 0;">
			<tr>
				<td></td>
				<td></td>
				<td>
					<center>Hormat Kami</center>
				</td>
			</tr>
			<tr>
				<td></td>
				<td>
					<p style="font-size:12px;font-family:arial;text-align:center;margin:0">
						<b>TERIMA KASIH</b><br>ATAS KUNJUNGAN ANDA
					</p>
				</td>
				<td style="padding-top:30px">
					<center><b><span class="isi">Kasir : ${dataHeadBuyback.kasir}</span></b></center>
				</td>
			</tr>
		</table>
			</div>`
		const isDateMoreTreeDays = this._isDateMoreTreeDays(dataHeadBuyback.dateShort)
		await dataDetailBuyback.forEach(data => {
			number++;
			let dateShow = ``
			if (!isDateMoreTreeDays) {
				dateShow = `<td><button class="btn btn-danger btn-sm btn-circle" id="delete_detail" title="Hapus Barang ${data.kode_barang}"><i class='fas fa-trash'></i></button></td>`
			}
			elmBuybackDetail += `<tr>
			<td>${number}</td>
			<td>${data.kode_barang}</td>
			<td>${data.nama_barang}</td>
			${(!printStatus) ? `<td align="center">${data.status}</td>` : ``}
			<td>${data.berat}</td>
			<td>${data.harga_beli}</td>
			<td>${data.potongan}</td>
			<td>${data.biaya_servis}</td>
			<td>-${data.total}</td>
			${(!printStatus) ? dateShow : ``}
			</tr>`
		});

		let styleElement = `<style type="text/css">
		.notaDesign {
			margin-left : 230px;
			margin-right : 230px;
			font-size: 14px;
		}
		.tableCheckout {
			float: right;
			margin-right: 55px;
		}
		.table {
			margin: 0;
			padding: 0;
		}
		.isi {
			border-top: 1px solid #000;
			text-align: center;
		}
		</style>`

		let elm = `${styleElement}
		<div class="notaDesign" id="notaPrint">
		${elmHeadBuyback}
			<table class="table " id="dataBuyback" cellspacing="0" cellpadding="0" border="0">
				<thead>
					<tr>
						<th style="width:50px">No</th>
						<th>Kode</th>
						<th>Nama Barang</th>
						${(!printStatus) ? `<th>S</th>` : ``}
						<th>Berat</th>
						<th>Harga</th>
						<th>Potongan</th>
						<th>Servis</th>
						<th>Jumlah</th>
						${(!printStatus) ? `<th>Aksi</th>` : ``}
					</tr>
				</thead>
				<tbody>
					${elmBuybackDetail}
				</tbody>
			</table>${elmHeadBuybackFooter}`;
		document.getElementById(`${elmID}`).innerHTML = elm;
		if (printStatus) {
			this._print();
		}
		await this._initialDeleteDetailBuyback();
	},

	_print() {
		this.printDiv('printResultNota');
		document.getElementById('printResultNota').innerHTML = '';
	},

	async printDiv(elem) {
		var ua = navigator.userAgent;
		var mywindow = window.open();
		var is_chrome = Boolean(mywindow.chrome);
		mywindow.document.write(`<html><head><title>${document.title}</title>`);
		mywindow.document.write('<link rel="stylesheet" href="./src/styles/sb-admin-2.min.css" type="text/css" />');
		mywindow.document.write('</head><body >');
		mywindow.document.write(document.getElementById(elem).innerHTML);
		mywindow.document.write('</body></html>');

		if (is_chrome) {
			setTimeout(function () { // wait until all resources loaded 
				mywindow.document.close(); // necessary for IE >= 10
				mywindow.focus(); // necessary for IE >= 10
				mywindow.print(); // change window to winPrint
				if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)) console.log('mobile')
				//else
				//mywindow.close(); // change window to winPrint
			}, 250);
		} else {
			mywindow.document.close(); // necessary for IE >= 10
			mywindow.focus(); // necessary for IE >= 10
			mywindow.print();
			mywindow.close();
		}

		return true;
	},

	async _initBarcode(faktur) {
		await JsBarcode(`#barcodeNota`, `${faktur}`, {
			width: 1.5, height: 50, displayValue: false
		});
	},

	async _initBarcodeInvoice(faktur) {
		await JsBarcode(`#barcodeInvoice`, `${faktur}`, {
			width: 1,
			height: 50,
			displayValue: false
		});
	},

	fileExists(url) {
		var http = new XMLHttpRequest();
		http.open('HEAD', url, false);
		http.send();
		if (http.status == 200) {
			return true;
		} else {
			return false;
		}
	},

	_convertDate(date) {
		let patt1 = /[A-z]/g;
		let str = "" + date.match(patt1);


		let month = str.replace(/#|,/g, '');
		let monthIndo = {
			"Januari": 1,
			"Februari": 2,
			"Maret": 3,
			"April": 4,
			"Mei": 5,
			"Juni": 6,
			"Juli": 7,
			"Agustus": 8,
			"September": 9,
			"Oktober": 10,
			"November": 11,
			"Desember": 12
		};
		let dayConverted = date.substring(0, 2);
		let monthConverted = monthIndo[`${month}`]
		let result = "" + dayConverted + "-" + monthConverted;
		return result;
	},

	_isDateMoreTreeDays(rowDate = '') {
		var temp = new Array();
		temp = rowDate.split("-");
		let dateInSever = `${temp[1]}-${temp[0]}-${temp[2]}`
		let dateOld = new Date(dateInSever)
		dateOld.setDate(dateOld.getDate() + 3);

		let currentDate = new Date()
		if (dateOld >= currentDate) {
			return false
		} else {
			return true
		}
	},

	async _initialDeleteDetailPembelian() {
		$('#dataPembelian tbody').on('click', '#delete_detail', function (e) {
			e.stopPropagation();
			const table = $('#dataPembelian').DataTable();
			let data = table.row($(this).parents('tr')).data();

			swal.fire({
				title: 'Hapus',
				html: "Anda ingin menghapus/membatalkan barang ini? <br> <strong>Kode Barang </strong>: " + data[1],
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Ya, Hapus!'
			}).then(async (result) => {
				if (result.value) {
					let kode_barang = data[1];
					let faktur = $("#notaPembelian").html();
					const status = await ApiFaktur.deleteDetailTransPembelian(kode_barang, faktur);
					if (status) {
						swal.fire({
							title: 'Hapus',
							text: 'Data berhasil dihapus',
							icon: 'success',
							showConfirmButton: false,
							timer: 1000
						});
						//refres manual 
						let oTable = $('#dataPembelian').dataTable();
						oTable.fnDraw(false);
						$(this).parents('tr').fadeOut(300);
						$('#modalPembelian').modal('hide');
						document.getElementById('refresh').click();
					} else {
						NotificationModal.show('Ada kesalahan server!', 'error');
					}
				}
				;
			});
		});
	},

	async _initialDeleteDetailPenjualan() {
		$('#table_report tbody').on('click', '#delete_detail', function (e) {
			e.stopPropagation();
			const table = $('#table_report').DataTable();
			let data = table.row($(this).parents('tr')).data();

			swal.fire({
				title: 'Hapus',
				html: "Anda ingin menghapus/membatalkan barang ini? <br> <strong>Kode Barang </strong>: " + data[1],
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Ya, Hapus!'
			}).then(async (result) => {
				if (result.value) {
					let kode_barang = data[1];
					let faktur = $("#notaPenjualan").html();
					const status = await ApiFaktur.deleteDetailTransPenjualan(kode_barang, faktur);
					if (status) {
						swal.fire({
							title: 'Hapus',
							text: 'Data berhasil dihapus',
							icon: 'success',
							showConfirmButton: false,
							timer: 1000
						});
						//refres manual 
						let oTable = $('#table_report').dataTable();
						oTable.fnDraw(false);
						$(this).parents('tr').fadeOut(300);
						$('#modalPenjualan').modal('hide');
						document.getElementById('refresh').click();
					} else {
						NotificationModal.show('Ada kesalahan server!', 'error');
					}
				}
				;
			});
		});
	},

	async _initialDeleteDetailBuyback() {
		$('#dataBuyback tbody').on('click', '#delete_detail', function (e) {
			e.stopPropagation();
			const table = $('#dataBuyback').DataTable();
			let data = table.row($(this).parents('tr')).data();

			swal.fire({
				title: 'Hapus',
				html: "Anda ingin menghapus/membatalkan barang ini? <br> <strong>Kode Barang </strong>: " + data[1],
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Ya, Hapus!'
			}).then(async (result) => {
				if (result.value) {
					let kode_barang = data[1];
					let faktur = $("#notaBuyback").html();
					const status = await ApiFaktur.deleteDetailTransBuyback(kode_barang, faktur);
					if (status) {
						swal.fire({
							title: 'Hapus',
							text: 'Data berhasil dihapus',
							icon: 'success',
							showConfirmButton: false,
							timer: 1000
						});
						//refres manual 
						let oTable = $('#dataBuyback').dataTable();
						oTable.fnDraw(false);
						$(this).parents('tr').fadeOut(300);
						$('#modalBuyback').modal('hide');
						document.getElementById('refresh').click();
					} else {
						NotificationModal.show('Ada kesalahan server!', 'error');
					}
				}
				;
			});
		});
	},
}

export default PrintInitiator;
