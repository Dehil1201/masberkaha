import Home from '../views/pages/overview.js';
import Penjualan from '../views/pages/penjualan.js';
import Pembelian from '../views/pages/pembelian.js';
import Hutang from '../views/pages/hutang.js';
import Piutang from '../views/pages/piutang.js';
import Pelanggan from '../views/pages/pelanggan.js';
import Supplier from '../views/pages/supplier.js';
import NotFound from '../views/pages/404.js';
import Barang from '../views/pages/barang.js';
import BarcodeBarang from '../views/pages/barcode-barang.js';
import JenisBarang from '../views/pages/jenis_barang.js';
import JenisUser from '../views/pages/jenis-user.js';
import User from '../views/pages/user.js';
import AksesView from '../views/pages/akses.js';
import notAcces from '../views/pages/not-access.js';
import ActivityLog from '../views/pages/activiy-log.js';
import SettingApps from '../views/pages/setting.js';
import SettingToko from '../views/pages/setting_toko.js';
import BuybackOldstok from '../views/pages/buyback-oldstok.js';
import BeliKembali from '../views/pages/beli-kembali.js';
import SettingHarga from '../views/pages/setharga.js';
import DataPenjualan from '../views/pages/data-penjualan.js';
import DataPembelian from '../views/pages/data-pembelian.js';
import DataBeliKembali from './../views/pages/data-belikembali.js';
import CheckStok from './../views/pages/check-stok.js';
import BarangRusak from './../views/pages/barang-rusak.js';
import LaporanNeraca from './../views/pages/laporan-neraca.js';
import LaporanKas from './../views/pages/laporan-kas.js';
import LaporanBarang from './../views/pages/laporan-barang.js';
import LabarugiNota from './../views/pages/labarugi-nota.js';
import TransaksiQuantity from '../views/pages/transaksi-quantity.js';
import TransaksiServices from './../views/pages/transaksi-service.js';
import Login from '../views/pages/login.js';
import BackupRestore from '../views/pages/backup-restore.js';
import Sumber from '../views/pages/sumber.js';
import JurnalUmum from './../views/pages/jurnal-umum.js';
import TransferAkuntan from './../views/pages/transfer-akuntan.js';
import Referensi from './../views/pages/no-referensi.js';
import LaporanJurnal from './../views/pages/laporan-jurnal.js';
import JualPerbarang from './../views/pages/jual-perbarang.js';
import BeliPerbarang from './../views/pages/beli-perbarang.js';
import BuybackPerbarang from './../views/pages/buyback-perbarang.js';
import JenisTransaksi from '../views/pages/jenis_transaksi.js';

const routes = {
	'/': Home, // default page
	'/dashboard': Home,
	'/penjualan': Penjualan,
	'/pembelian': Pembelian,
	'/hutang': Hutang,
	'/piutang': Piutang,
	'/pelanggan': Pelanggan,
	'/supplier': Supplier,
	'/jenisbarang': JenisBarang,
	'/jenistransaksi': JenisTransaksi,
	'/barang': Barang,
	'/barcode-barang': BarcodeBarang,
	'/user': User,
	'/level': JenisUser,
	'/akses': AksesView,
	'/500': notAcces,
	'/404': NotFound,
	'/activity-log': ActivityLog,
	'/pengaturan': SettingApps,
	'/setharga': SettingHarga,
	'/setting-toko': SettingToko,
	'/belikembali': BeliKembali,
	'/buyback-oldstok': BuybackOldstok,
	'/data-penjualan': DataPenjualan,
	'/data-pembelian': DataPembelian,
	'/data-belikembali': DataBeliKembali,
	'/stok-opname': CheckStok,
	'/data-barangrusak': BarangRusak,
	'/laporan-neraca': LaporanNeraca,
	'/laporan-kas': LaporanKas,
	'/laporan-barang': LaporanBarang,
	'/labarugi-nota': LabarugiNota,
	'/transaksi-quantity': TransaksiQuantity,
	'/tfservice': TransaksiServices,
	'/login': Login,
	'/backup-restore': BackupRestore,
	'/sumber': Sumber,
	'/jurnal-umum' : JurnalUmum,
	'/transfer-rekening' : TransferAkuntan,
	'/non-operasi-akuntan' : LaporanKas,
	'/no-referensi' : Referensi,
	'/laporan-jurnal' : LaporanJurnal,
	'/jual-perbarang' : JualPerbarang,
	'/beli-perbarang' : BeliPerbarang,
	'/buyback-perbarang' : BuybackPerbarang
};

export default routes;
