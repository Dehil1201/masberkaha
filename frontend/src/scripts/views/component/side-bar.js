import CONFIG from "../../config/globals/config.js";

const SideBar = {
	async init() {
		const result = this._render();
		document.getElementById('wrapper').insertAdjacentHTML("afterbegin", result);
	},

	_render() {
		return /*html*/ `<ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
				<a class="sidebar-brand d-flex align-items-center justify-content-center" href="#/">
					<div class="sidebar-brand-icon">
						<img src="${CONFIG.BASE_IMAGE_URL}logo.png" style="width:60px;height:60px">
					</div>
					<div class="sidebar-brand-text mx-3">TOKO MAS BERKAH</div>
				</a>
	
				<hr class="sidebar-divider my-0">
	
				<li class="nav-item active">
					<a class="nav-link sidebar-custom" href="#/">
						<i class="fas fa-fw fa-tachometer-alt"></i>
						<span>Dashboard</span></a>
				</li>
	
				<hr class="sidebar-divider">
	
				<div class="sidebar-heading">
					Transaction
				</div>
	
				<li class="nav-item">
					<a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseMaster"
						aria-expanded="true" aria-controls="collapseMaster">
						<i class=" fas fa-fw fa-table"></i>
						<span>Master</span>
					</a>
					<div id="collapseMaster" class="collapse" aria-labelledby="headingMaster" data-parent="#accordionSidebar">
						<div class="bg-white py-2 collapse-inner rounded">
							<h6 class="collapse-header">Kelola Data</h6>
							<a class="collapse-item sidebar-custom item-master" href="#/barang">Data Barang</a>
							<a class="collapse-item sidebar-custom item-master"  href="#/jenisbarang">Data Devisi</a>
							<a class="collapse-item sidebar-custom item-master"  href="#/jenistransaksi">Data Jenis Transaksi</a>
							<a class="collapse-item sidebar-custom item-master" href="#/pelanggan">Data Customer</a>
							<a class="collapse-item sidebar-custom item-master " href="#/supplier">Data Supplier</a>
							<a class="collapse-item sidebar-custom item-master " href="#/level">Level User</a>
							<a class="collapse-item sidebar-custom item-master " href="#/user">Data Pemakai/User</a>
							<a class="collapse-item sidebar-custom item-master " href="#/barcode-barang">Cetak Barcode</a>
						</div>
					</div>
				</li>
	
				<li class="nav-item">
					<a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsePembelian"
						aria-expanded="true" aria-controls="collapsePembelian">
						<i class="fa fa-cubes"></i>
						<span>Nota Pembelian</span>
					</a>
					<div id="collapsePembelian" class="collapse" aria-labelledby="headingUtilities"
						data-parent="#accordionSidebar">
						<div class="bg-white py-2 collapse-inner rounded">
							<h6 class="collapse-header">Transaksi Pembelian</h6>
							<a class="collapse-item sidebar-custom item-pembelian" href="#/pembelian">Pembelian Barang</a>
							<a class="collapse-item sidebar-custom item-pembelian" href="#/data-pembelian">Laporan Pembelian</a>
							<a class="collapse-item sidebar-custom item-pembelian" href="#/beli-perbarang">Laporan Beli / Barang</a>
							<a class="collapse-item sidebar-custom item-pembelian" href="#/hutang">Pembayaran Tagihan</a>
						</div>
					</div>
				</li>
	
				<li class="nav-item">
					<a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsePenjualan"
						aria-expanded="true" aria-controls="collapsePenjualan">
						<i class="fa fa-shopping-cart"></i>
						<span>Nota Penjualan</span>
					</a>
					<div id="collapsePenjualan" class="collapse" aria-labelledby="headingUtilities"
						data-parent="#accordionSidebar">
						<div class="bg-white py-2 collapse-inner rounded">
							<h6 class="collapse-header">Transaksi Penjualan</h6>
							<a class="collapse-item sidebar-custom item-penjualan" href="#/penjualan">Penjualan Mas</a>
							<a class="collapse-item sidebar-custom item-penjualan" href="#/transaksi-quantity">Penjualan Lain</a>
							<a class="collapse-item sidebar-custom item-penjualan" href="#/data-penjualan">Laporan Penjualan</a>
							<a class="collapse-item sidebar-custom item-penjualan" href="#/jual-perbarang">Laporan Jual / Barang</a>
							<a class="collapse-item sidebar-custom item-penjualan" href="#/piutang">Transaksi Piutang</a>
						</div>
					</div>
				</li>
	
				<li class="nav-item">
					<a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseBuyback"
						aria-expanded="true" aria-controls="collapseBuyback">
						<i class="fa fa-money-bill-wave"></i>
						<span>Nota Beli Kembali</span>
					</a>
					<div id="collapseBuyback" class="collapse" aria-labelledby="headingUtilities"
						data-parent="#accordionSidebar">
						<div class="bg-white py-2 collapse-inner rounded">
							<h6 class="collapse-header">Transaksi Beli Kembali</h6>
							<!-- <a class="collapse-item sidebar-custom item-buyback" href="#/belikembali">Terima Kembali</a> -->
							<a class="collapse-item sidebar-custom item-buyback" href="#/buyback-oldstok">Terima Kembali</a>
							<a class="collapse-item sidebar-custom item-buyback" href="#/data-belikembali">Laporan Terima Kembali</a>
							<a class="collapse-item sidebar-custom item-buyback" href="#/buyback-perbarang">Laporan Terima / Barang</a>
						</div>
					</div>
				</li>

				<hr class="sidebar-divider">
				<div class="sidebar-heading">Tools & Report</div>

				<li class="nav-item">
					<a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseReport"
						aria-expanded="true" aria-controls="collapseReport">
						<i class="fas fa-fw fa-folder"></i>
						<span>Laporan Rekap</span>
					</a>
					<div id="collapseReport" class="collapse" aria-labelledby="headingPages" data-parent="#accordionSidebar">
						<div class="bg-white py-2 collapse-inner rounded">
							<h6 class="collapse-header">Pilih Laporan</h6>
							<a class="collapse-item sidebar-custom item-report " href="#/laporan-barang">Laporan Barang /<br>Histori </a>
							<a class="collapse-item sidebar-custom item-report " href="#/labarugi-nota">Laba Rugi</a>
						</div>
					</div>
				</li>

				<li class="nav-item">
					<a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseAkuntansi"
						aria-expanded="true" aria-controls="collapseAkuntansi">
						<i class="fa fa-shopping-cart"></i>
						<span>Neraca Keuangan</span>
					</a>
					<div id="collapseAkuntansi" class="collapse" aria-labelledby="headingUtilities"
						data-parent="#accordionSidebar">
						<div class="bg-white py-2 collapse-inner rounded">
							<h6 class="collapse-header">Akuntansi</h6>
							<a class="collapse-item sidebar-custom item-akuntansi" href="#/laporan-kas">Transaksi Non <br>Operasional</a>
							<a class="collapse-item sidebar-custom item-akuntansi" href="#/transfer-rekening">Transaksi Jurnal Umum</a>
							<!--<a class="collapse-item sidebar-custom item-akuntansi" href="#/non-operasi-akuntan"> Transaksi <b>Jurnal Umum</b></a>-->
							<a class="collapse-item sidebar-custom item-akuntansi" href="#/jurnal-umum">Jurnal Umum</a>
							<a class="collapse-item sidebar-custom item-akuntansi" href="#/sumber">Daftar Rekening</a>
							<a class="collapse-item sidebar-custom item-akuntansi" href="#/no-referensi">No Referensi</a>
							<a class="collapse-item sidebar-custom item-akuntansi" href="#/laporan-neraca">Laporan Neraca</a>
							<a class="collapse-item sidebar-custom item-akuntansi" href="#/laporan-jurnal">Laporan Jurnal Umum</a>
							<!-- <a class="collapse-item sidebar-custom item-akuntansi" href="#/labarugi-barang">Laba Rugi/Barang</a> -->
						</div>
					</div>
				</li>
	
				<li class="nav-item">
					<a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#kelolaDataCollapse"
						aria-expanded="true" aria-controls="collapseReport">
						<i class="fas fa-fw fa-hourglass-half"></i>
						<span>Kelola Data</span>
					</a>
					<div id="kelolaDataCollapse" class="collapse" aria-labelledby="headingPages" data-parent="#accordionSidebar">
						<div class="bg-white py-2 collapse-inner rounded">
							<h6 class="collapse-header">Pilih Data</h6>
							<a class="collapse-item sidebar-custom item-kelolaData " href="#/data-barangrusak">Data Barang Rusak</a>
							<a class="collapse-item sidebar-custom item-kelolaData " href="#/stok-opname">Stok opname</a>
							<a class="collapse-item sidebar-custom item-kelolaData " href="#/backup-restore">Backup Database</a>
						</div>
					</div>
				</li>
	
				<li class="nav-item">
					<a class="nav-link collapsed" href="#" data-toggle="collapse" data-target="#settingUtilitiesCollapse"
						aria-expanded="true" aria-controls="collapseReport">
						<i class="fas fa-fw fa-cog"></i>
						<span>Pengaturan</span>
					</a>
					<div id="settingUtilitiesCollapse" class="collapse" aria-labelledby="headingPages"
						data-parent="#accordionSidebar">
						<div class="bg-white py-2 collapse-inner rounded">
							<h6 class="collapse-header">Pilih Pengaturan</h6>
							<a class="collapse-item sidebar-custom item-setting" href="#/pengaturan">Aturan Harga[Transaksi]</a>
							<a class="collapse-item sidebar-custom item-setting " href="#/setharga"> Atur [Naik/Turun] Harga</a>
							<div class="collapse-divider"></div>
							<h6 class="collapse-header">Pengaturan Lainnya</h6>
							<a class="collapse-item sidebar-custom item-setting " href="#/akses">Aturan Hak Akses</a>
							<a class="collapse-item sidebar-custom item-setting " href="#/setting-toko">Pengaturan Toko</a>
						</div>
					</div>
				</li>
	
				<hr class="sidebar-divider d-none d-md-block">
	
				<div class="text-center d-none d-md-inline">
					<button class="rounded-circle border-0" id="sidebarToggle"></button>
				</div>
	
			</ul>`;
	},


	activateClick() {


	},
}


export default SideBar;
