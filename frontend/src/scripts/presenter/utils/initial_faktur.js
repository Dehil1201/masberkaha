import ApiFaktur from "../../api/data-faktur.js";
import ApiSettingApps from '../../api/data-setting-apps.js'
import CONFIG from '../../config/globals/config.js';

const FakturInitiator = {
	async initPembelian(faktur, printStats) {
		const data = await ApiFaktur.Pembelian(faktur);
		this._makeViewFakturPembelian(data, printStats)
	},

	async initViewPenjualan(faktur) {
		const data = await ApiFaktur.Penjualan(faktur);
		this._makeViewFakturPenjualan(data)
	},

	async initPenjualan(faktur) {
		const data = await ApiFaktur.Penjualan(faktur);
		this._makeViewFakturPenjualanSameOrigin(data)
	},

	async initQuantity(faktur, elmID, printStatus) {
		const data = await ApiFaktur.PenjualanQuantity(faktur);
		this._makeViewFakturPenjualanQuantity(data, elmID, printStatus)
	},

	async initBuyback(faktur, elmID, printStatus) {
		const data = await ApiFaktur.Buyback(faktur);
		this._makeViewFakturBuyback(data, elmID, printStatus)
	},

	async initViewLabaRugi(faktur) {
		const data = await ApiFaktur.Labarugi(faktur);
		this._makeViewFakturLabarugi(data)
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
			logo = `<img src="${CONFIG.BASE_IMAGE_URL}logo.png" style="margin-top:20px;width:80px;height:80px">`;
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

	async _makeViewFakturPenjualan(data) {
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
					<p style="font-size:12px;font-family:arial;margin:0">${logo}<br>
						<b>${dataSettings.nama_toko}</b><br>${dataSettings.alamat}<br>Telp. ${dataSettings.no_hp}

					</p>
				</td>
				<td>
					<table style="margin-left:150px">
						<tr>
							<td style="width:150px"><b>Tanggal</b></td>
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
				<td style="width:150px"><b>Nota Penjualan</b></td>
				<td>:</td>
				<td id="notaPenjualan">${dataHeadJual.faktur}</td>
				<td style="width:150px"><b>Status Bayar</b></td>
				<td>:</td>
				<td><b>${((dataHeadJual.status = 1) ? "Lunas" : "Belum Lunas")}</b></td>
			</tr>
			</table>`

		elmHeadJualFooter = `<table class="tableCheckout" cellspacing="0" cellpadding="0" border="0">
			<tr>
				<td style="width:150px"><b>Sub Total</b></td>
				<td style="width:30px">:</td>
				<td>${dataHeadJual.subtotal}</td>
			</tr>
			<tr>
				<td style="width:150px"><b>Ongkos</b></td>
				<td style="width:30px">:</td>
				<td>${dataHeadJual.ongkosTotal}</td>
				<td style="width:150px"></td>
				<td style="width:150px"><b>Bayar</b></td>
				<td style="width:30px">:</td>
				<td>${dataHeadJual.bayar}</td>
			</tr>
			<tr>
				<td style="width:150px"><b>Grand Total</b></td>
				<td style="width:30px">:</td>
				<td>${dataHeadJual.grand_total}</td>
				<td style="width:150px"></td>
				<td style="width:150px"><b>Kembali</b></td>
				<td style="width:30px">:</td>
				<td>${dataHeadJual.kembali}</td>
			</tr>
		</table>
		<table class="table " style="margin: 0;">
			<tr>
				<td>
					<svg id="barcodeNota"></svg>
				</td>
				<td>
					<center>Hormat Kami</center>
				</td>
			</tr>
			<tr>
				<td>
					<p>
					<b>TERIMA KASIH ATAS KUNJUNGAN ANDA  &#128522;</b>
					</p>
				</td>
				<td style="padding-top:30px">
					<center><b><span class="isi">Kasir : ${dataHeadJual.kasir}</span></b></center>
				</td>
			</tr>
		</table>
			</div>`
		const isDateMoreTreeDays = this._isDateMoreTreeDays(dataHeadJual.dateShort)
		await dataDetailJual.forEach(data => {
			number++;
			let dateShow = ``
			if (!isDateMoreTreeDays) {
				dateShow = `<td><button class="btn btn-danger btn-sm btn-circle" id="delete_detail" title="Hapus Barang ${data.kode_barang}"><i class='fas fa-trash'></i></button></td>`
			}

			elmPenjualanDetail += `<tr>
			<td>${number}</td>
			<td>${data.kode_barang}</td>
			<td>${data.jenis_barang}</td>
			<td>${data.nama_barang}</td>
			<td>${data.berat}</td>
			<td>${data.kadar}</td>
			<td> ${data.foto != null ? `<img id='foto' class='foto' src='${CONFIG.BASE_URL}uploads/foto/${data.foto}' width='50' alt='${data.foto}' title='Lihat foto - ${data.nama_barang}'</img>` : data.foto} </td>
			<td>${data.harga}</td>
			<td>${data.sub_total}</td>
			${dateShow}
			</tr>`
		});

		let styleElement = `<style type="text/css">
		.notaDesign {
			height: 500px;
			margin: 0 65px;
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
						<th>Berat</th>
						<th>%</th>
						<th>Foto</th>
						<th>Harga</th>
						<th>Jumlah</th>
						<th>Aksi</th>
					</tr>
				</thead>
				<tbody>
					${elmPenjualanDetail}
				</tbody>
			</table>
			${elmHeadJualFooter}`;

		document.getElementById('printArea').innerHTML = elm;

		await this._initBarcode(dataHeadJual.faktur);
		await this._initialDeleteDetailPenjualan();
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
		let headElement = `<html moznomarginboxes="" mozdisallowselectionprint="">

		<head>
			<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
			<title> Test Print </title>
			<style type="text/css">
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
					left: 20.5cm;
					top: 1.3cm;
					line-height: 0;
					font-size: 16px;
				}
				
				.date-end{
					position: absolute;
					left: 23cm;
					top: 1.3cm;
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
					top: 4cm;
					left: 7.4cm;
					font-size: 16px;
					line-height: 0;
				}
				
				.table-detail{
					position: absolute;
					top: 5.12cm;
					left: 5.6cm;
					font-size: 16px;
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
				}
				
				.berat{
					line-height: 1.5;
					width: 2cm;
				}
				
				.harga{
					width: 2.1cm;
				}
				
				.grand-total{
					width: 2.7cm;
				}
				
				
				.tr-table{
					vertical-align: top;
				}
				
				
				.count-grand-total{
					position: absolute;
					top: 11cm;
					left: 20cm;
					line-height: 0;
				  }
				  
				  .tip{
					  position: absolute;
					  top: 11.6cm;
					  left: 20cm;
					  line-height: 0;
				  }
				.container{
					position: relative;
						
					width: 15cm;
					height: 10.5cm;
					z-index: -1;
				}
			</style>
		</head>
		<body onload="window.print();" cz-shortcut-listen="true">`
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
			left: 20.5cm;
			top: 1.3cm;
			line-height: 0;
			font-size: 16px;
		}
		
		.date-end{
			position: absolute;
			left: 23cm;
			top: 1.3cm;
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
			top: 4cm;
			left: 7.4cm;
			font-size: 16px;
			line-height: 0;
		}
		
		.table-detail{
			position: absolute;
			top: 5.12cm;
			left: 5.6cm;
			font-size: 16px;
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
		}
		
		.berat{
			line-height: 1.5;
			width: 2cm;
		}
		
		.harga{
			width: 2.1cm;
		}
		
		.grand-total{
			width: 2.7cm;
		}
		
		
		.tr-table{
			vertical-align: top;
		}
		
		
		.count-grand-total{
			position: absolute;
			top: 11cm;
			left: 20cm;
			line-height: 0;
		  }
		  
		  .tip{
			  position: absolute;
			  top: 11.6cm;
			  left: 20cm;
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
			logo = `<img src="${CONFIG.BASE_IMAGE_URL}logo.png" style="margin-top:20px;width:80px;height:80px">`;
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

	async _makeViewFakturLabarugi(data) {
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
					<p style="font-size:12px;font-family:arial;margin:0">${logo}<br>
						<b>${dataSettings.nama_toko}</b><br>${dataSettings.alamat}<br>Telp. ${dataSettings.no_hp}

					</p>
				</td>
				<td>
					<table style="margin-left:150px">
						<tr>
							<td style="width:150px"><b>Tanggal</b></td>
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
						<tr>
							<td><b>Kasir</b></td>
							<td style="width:30px">:</td>
							<td>${dataHeadJual.kasir}</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
		<table class="table">
			<tr>
				<td style="width:150px"><b>Nota Penjualan</b></td>
				<td>:</td>
				<td id="notaPenjualan">${dataHeadJual.faktur}</td>
			</tr>
			</table>`

		elmHeadJualFooter = `<table class="tableCheckout" cellspacing="0" cellpadding="0" border="0">
			<tr>
				<td style="width:150px"><b>Sub Total</b></td>
				<td style="width:30px">:</td>
				<td>${dataHeadJual.subtotal}</td>
				<td style="width:150px"></td>
				<td style="width:150px"><b>Pokok Modal</b></td>
				<td style="width:30px">:</td>
				<td>${dataHeadJual.pokokModal}</td>
			</tr>
			<tr>
				<td style="width:150px"><b>Ongkos</b></td>
				<td style="width:30px">:</td>
				<td>${dataHeadJual.ongkosTotal}</td>
				<td style="width:150px"></td>
				<td style="width:150px"><b>Laba Rugi</b></td>
				<td style="width:30px">:</td>
				<td>${dataHeadJual.labaRugi}</td>
			</tr>
			<tr>
				<td style="width:150px"><b>Grand Total</b></td>
				<td style="width:30px">:</td>
				<td>${dataHeadJual.grand_total}</td>
				<td style="width:150px"></td>
				<td style="width:150px"><b>Laba + Ongkos</b></td>
				<td style="width:30px">:</td>
				<td>${dataHeadJual.labaOngkos}</td>
			</tr>
		</table></div>`

		await dataDetailJual.forEach(data => {
			number++;
			elmPenjualanDetail += `<tr>
			<td>${number}</td>
			<td>${data.kode_barang}</td>
			<td>${data.nama_barang}</td>
			<td>${data.berat}</td>
			<td>${data.kadar}</td>
			<td>${data.harga}</td>
			<td>${data.total}</td>
			<td>${data.hargaModal}</td>
			<td>${data.pokokModal}</td>
			<td>${data.labaRugi}</td>
			<td>${data.ongkos}</td>
			<td>${data.labaOngkos}</td>
			</tr>`
		});

		let styleElement = `<style type="text/css">
		.notaDesign {
			height: 500px;
			margin: 0 65px;
			overflow-y: auto;
			width: 100%;
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
						<th>Nama Barang</th>
						<th>Berat</th>
						<th>%</th>
						<th>Harga</th>
						<th>Jumlah</th>
						<th>Hrg. Modal</th>
						<th>Pokok Modal</th>
						<th>Laba Rugi</th>
						<th>Ongkos</th>
						<th>Laba+Ongkos</th>
					</tr>
				</thead>
				<tbody>
					${elmPenjualanDetail}
				</tbody>
			</table>
			${elmHeadJualFooter}`;

		document.getElementById('printArea').innerHTML = elm;
	},

	async _initBarcode(faktur) {
		await JsBarcode(`#barcodeNota`, `${faktur}`, {
			width: 1.5,
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

	_print() {
		jQuery('#printResultNota').print();
		// document.getElementById('printResultNota').innerHTML = '';
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
				};
			});
		});
	},

	async _initialDeleteDetailPenjualan() {
		$('#dataPenjualan tbody').on('click', '#delete_detail', function (e) {
			e.stopPropagation();
			const table = $('#dataPenjualan').DataTable();
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
						let oTable = $('#dataPenjualan').dataTable();
						oTable.fnDraw(false);
						$(this).parents('tr').fadeOut(300);
						$('#modalPenjualan').modal('hide');
						document.getElementById('refresh').click();
					} else {
						NotificationModal.show('Ada kesalahan server!', 'error');
					}
				};
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
				};
			});
		});
	},
}

export default FakturInitiator;
