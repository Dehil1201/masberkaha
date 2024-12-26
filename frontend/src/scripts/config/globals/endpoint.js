import CONFIG from './config.js';

const API_ENDPOINT = {
	IP_SERVER: `${CONFIG.BASE_URL}Overview/ipServer`,

	LIST_PELANGGAN: `${CONFIG.BASE_URL}pelanggan/getpelanggan`,
	UPDATE_PELANGGAN: `${CONFIG.BASE_URL}pelanggan/update`,
	INSERT_PELANGGAN: `${CONFIG.BASE_URL}pelanggan/store`,
	DELETE_PELANGGAN: `${CONFIG.BASE_URL}pelanggan/destroy`,
	AUTOKODE_PELANGGAN: `${CONFIG.BASE_URL}datahelper/autoKodePelanggan`,

	LIST_SUPPLIER: `${CONFIG.BASE_URL}supplier/getsupplier`,
	UPDATE_SUPPLIER: `${CONFIG.BASE_URL}supplier/update`,
	INSERT_SUPPLIER: `${CONFIG.BASE_URL}supplier/store`,
	DELETE_SUPPLIER: `${CONFIG.BASE_URL}supplier/destroy`,


	LIST_BARANG: `${CONFIG.BASE_URL}barang/getbarang`,
	FILTER_BARANG: `${CONFIG.BASE_URL}barang/filterBarang`,
	GET_BARANG_ROW: `${CONFIG.BASE_URL}barang/getBarangRow`,
	GET_BARANG_ROW_QUANTITY: `${CONFIG.BASE_URL}barang/getBarangRowQuantity`,
	LIST_BARANG_INSTOK: `${CONFIG.BASE_URL}barang/getbaranginstok`,
	LIST_BARANG_QUANTITY: `${CONFIG.BASE_URL}barang/getBarangQuantity`,
	LIST_BARANG_BARCODE: `${CONFIG.BASE_URL}barang/getbarangbarcode`,
	UPDATE_BARANG: `${CONFIG.BASE_URL}barang/update`,
	INSERT_BARANG: `${CONFIG.BASE_URL}barang/store`,
	DELETE_BARANG: `${CONFIG.BASE_URL}barang/destroy`,
	CHANGE_DATA_BARANG: `${CONFIG.BASE_URL}barang/changeDataBarang`,
	LIST_BARANG_RUSAK: `${CONFIG.BASE_URL}barang/getbarangrusak`,
	AUTOKODE_BARANG: `${CONFIG.BASE_URL}datahelper/autoKodeBarang`,
	CHANGE_STATUS_BARANG: `${CONFIG.BASE_URL}barang/changeStatusBarang`,


	LIST_JENISBARANG: `${CONFIG.BASE_URL}jenisbarang/getjenisbarang`,
	GET_JENIS_BARANG_ROW: (jenis) => `${CONFIG.BASE_URL}jenisbarang/getJenisBarangRow/${jenis}`,
	UPDATE_JENISBARANG: `${CONFIG.BASE_URL}jenisbarang/update`,
	INSERT_JENISBARANG: `${CONFIG.BASE_URL}jenisbarang/store`,
	DELETE_JENISBARANG: `${CONFIG.BASE_URL}jenisbarang/destroy`,

	LIST_JENISTRANSAKSI: `${CONFIG.BASE_URL}jenis_transaksi/getJenisTransaksi`,
	GET_JENIS_TRANSAKSI_ROW: (tipe) => `${CONFIG.BASE_URL}jenis_transaksi/getJenisTransaksiRow/${tipe}`,
	UPDATE_JENISTRANSAKSI: `${CONFIG.BASE_URL}jenis_transaksi/update`,
	INSERT_JENISTRANSAKSI: `${CONFIG.BASE_URL}jenis_transaksi/store`,
	DELETE_JENISTRANSAKSI: `${CONFIG.BASE_URL}jenis_transaksi/destroy`,

	LIST_JENISUSER: `${CONFIG.BASE_URL}akses/getakses`,
	UPDATE_JENISUSER: `${CONFIG.BASE_URL}akses/update`,
	INSERT_JENISUSER: `${CONFIG.BASE_URL}akses/store`,
	DELETE_JENISUSER: `${CONFIG.BASE_URL}akses/destroy`,

	LIST_USER: `${CONFIG.BASE_URL}user/getuser`,
	UPDATE_USER: `${CONFIG.BASE_URL}user/update`,
	CHANGE_USER_PASSWORD: `${CONFIG.BASE_URL}user/changePassword`,
	INSERT_USER: `${CONFIG.BASE_URL}user/store`,
	DELETE_USER: `${CONFIG.BASE_URL}user/destroy`,

	LIST_RULE_AKSES: `${CONFIG.BASE_URL}akses/getHakAkses`,
	LIST_JENIS_AKSES: `${CONFIG.BASE_URL}akses/getJenisAkses`,
	UPDATE_RULE_USER: `${CONFIG.BASE_URL}akses/updateRuleAkses`,

	LIST_PENJUALAN: `${CONFIG.BASE_URL}penjualan/getpenjualan`,
	LIST_PENJUALAN_DETAIL: (id) => `${CONFIG.BASE_URL}penjualan/getpenjualandetail/${id}`,
	FAKTUR_OTOMATIS: `${CONFIG.BASE_URL}datahelper/autoFakturJual`,
	TOTAL_DETAIL: `${CONFIG.BASE_URL}datahelper/sumBuyback`,
	ADD_DETAIL_PENJUALAN: `${CONFIG.BASE_URL}penjualan/storeDetail `,
	DELETE_DETAIL_PENJUALAN: `${CONFIG.BASE_URL}penjualan/destroyDetail`,
	TRANSACTION_PENJUALAN: `${CONFIG.BASE_URL}penjualan/store`,
	SAVE_FOTO_BARANG: `${CONFIG.BASE_URL}penjualan/saveFoto `,
	DELETE_TRANSACTIONS_PENJUALAN: `${CONFIG.BASE_URL}penjualan/destroyTransactions`,
	INFO_TRANSAKSI_PENJUALAN: `${CONFIG.BASE_URL}penjualan/infoTransaksiPenjualan`,
	UPDATE_DETAIL_PENJUALAN: `${CONFIG.BASE_URL}penjualan/updateDetail`,
	DELETE_TRANSACTIONS_DETAIL_PENJUALAN: `${CONFIG.BASE_URL}penjualan/destroyDetailTransactions`,
	CHECK_FOTO: (kodeBarang) => `${CONFIG.BASE_URL}datahelper/checkFoto/${kodeBarang}`,
	
	FAKTUR_OTOMATIS_QUANTITY: `${CONFIG.BASE_URL}datahelper/autoFakturQuantity`,
	LIST_QUANTITY_DETAIL: (id) => `${CONFIG.BASE_URL}penjualan/getquantitydetail/${id}`,
	ADD_DETAIL_QUANTITY: `${CONFIG.BASE_URL}penjualan/storeQuantityDetail `,
	DELETE_DETAIL_QUANTITY: `${CONFIG.BASE_URL}penjualan/destroyQuantityDetail`,
	TRANSACTION_QUANTITY: `${CONFIG.BASE_URL}penjualan/storeQuantity`,
	UPDATE_QTY_DETAIL_PENJUALAN: `${CONFIG.BASE_URL}penjualan/updateQtyDetail`,

	LIST_PIUTANG: `${CONFIG.BASE_URL}piutang/getpiutang`,
	LIST_PIUTANG_ROW: `${CONFIG.BASE_URL}piutang/getpiutangrow`,
	LIST_PIUTANG_LUNAS: `${CONFIG.BASE_URL}piutang/getpiutang?status=1`,
	FAKTUR_OTOMATIS_PIUTANG: `${CONFIG.BASE_URL}datahelper/autoFakturPiutang`,
	INSERT_PIUTANG: `${CONFIG.BASE_URL}piutang/store`,
	DELETE_PIUTANG: `${CONFIG.BASE_URL}piutang/destroy`,

	LIST_HUTANG: `${CONFIG.BASE_URL}hutang/gethutang`,
	LIST_HUTANG_ROW: `${CONFIG.BASE_URL}hutang/gethutangrow`,
	LIST_HUTANG_LUNAS: `${CONFIG.BASE_URL}hutang/gethutang?status=1`,
	FAKTUR_OTOMATIS_HUTANG: `${CONFIG.BASE_URL}datahelper/autoFakturHutang`,
	INSERT_HUTANG: `${CONFIG.BASE_URL}hutang/store`,
	DELETE_HUTANG: `${CONFIG.BASE_URL}hutang/destroy`,

	LIST_PENJUALAN_DETAIL_NOTA: `${CONFIG.BASE_URL}penjualan/getListDetail`,
	FAKTUR_BELIKEMBALI: `${CONFIG.BASE_URL}datahelper/autoFakturBeliKembali`,
	TRANSACTION_BELIKEMBALI: `${CONFIG.BASE_URL}belikembali/store`,
	ADD_DETAIL_BELIKEMBALI: `${CONFIG.BASE_URL}belikembali/storeDetail `,
	DESTROY_DETAIL_BELIKEMBALI: `${CONFIG.BASE_URL}belikembali/destroyDetail `,
	LIST_DETAIL_BELIKEMBALI: (id) => `${CONFIG.BASE_URL}belikembali/getBeliKembaliDetail/${id}`,
	GET_NOTA_PENJUALAN: `${CONFIG.BASE_URL}penjualan/getNotaByKode`,
	CHECK_BARANG_JUAL: `${CONFIG.BASE_URL}belikembali/checkBarangJual`,
	DATA_BUYBACK_FAKTUR: `${CONFIG.BASE_URL}belikembali/getFakturNotaBuyback`,
	DATA_BUYBACK_OLDSTOK_FAKTUR: `${CONFIG.BASE_URL}datahelper/autoFakturBuybackOldstok`,
	INFO_TRANSAKSI_BUYBACK: `${CONFIG.BASE_URL}belikembali/infoTransaksiBuyback`,
	DELETE_TRANSACTIONS_BUYBACK: `${CONFIG.BASE_URL}belikembali/destroyTransactions`,
	DELETE_TRANSACTIONS_DETAIL_BUYBACK: `${CONFIG.BASE_URL}belikembali/destroyDetailTransactions`,
	UPDATE_DETAIL_BUYBACK: `${CONFIG.BASE_URL}belikembali/updateDetail`,

	FAKTUR_PEMBELIAN: `${CONFIG.BASE_URL}datahelper/autoFakturBeli`,
	TRANSACTION_PEMBELIAN: `${CONFIG.BASE_URL}pembelian/store`,
	ADD_DETAIL_PEMBELIAN: `${CONFIG.BASE_URL}pembelian/storeDetail `,
	DESTROY_DETAIL_PEMBELIAN: `${CONFIG.BASE_URL}pembelian/destroyDetail `,
	LIST_DETAIL_PEMBELIAN: (id) => `${CONFIG.BASE_URL}pembelian/getPembelianDetail/${id}`,
	INFO_TRANSAKSI_PEMBELIAN: `${CONFIG.BASE_URL}pembelian/infoTransaksiPembelian`,
	DELETE_TRANSACTIONS_PEMBELIAN: `${CONFIG.BASE_URL}pembelian/destroyTransactions`,
	DELETE_TRANSACTIONS_DETAIL_PEMBELIAN: `${CONFIG.BASE_URL}pembelian/destroyDetailTransactions`,

	LIST_SETTING: `${CONFIG.BASE_URL}pengaturan/getAllPengaturan`,
	UPDATE_PENGATURAN: `${CONFIG.BASE_URL}pengaturan/update`,
	UPDATE_TOKO: `${CONFIG.BASE_URL}pengaturan/update_toko`,
	UPDATE_ALLBARANG: `${CONFIG.BASE_URL}pengaturan/updateharga`,
	UPDATE_HARGA_PASAR: `${CONFIG.BASE_URL}pengaturan/updateHargaPasar`,
	DASHBOARD_GET_AMOUNT_PELANGGAN: `${CONFIG.BASE_URL}Overview/countPelanggan`,
	DASHBOARD_GET_AMOUNT_BARANG: `${CONFIG.BASE_URL}Overview/countBarang`,
	DASHBOARD_GET_AMOUNT_USER: `${CONFIG.BASE_URL}Overview/countUser`,
	DASHBOARD_GET_AMOUNT_SUPPLIER: `${CONFIG.BASE_URL}Overview/countSupplier`,
	DASHBOARD_GET_AMOUNT_PENJUALAN_MONTHLY: `${CONFIG.BASE_URL}Overview/getMonthly`,
	DASHBOARD_GET_GRAPH_PENJUALAN_MONTHLY: `${CONFIG.BASE_URL}Overview/grafikPenjualanMonthly`,
	DASHBOARD_GET_GRAPH_PENJUALAN_DAILIY: `${CONFIG.BASE_URL}Overview/grafikPenjualanDaily`,
	DASHBOARD_GET_INCOME_SOURCE: `${CONFIG.BASE_URL}Overview/getIncomeSource`,
	DASHBOARD_GET_COUNT_INSTOK: `${CONFIG.BASE_URL}Overview/countInstok`,
	DASHBOARD_GET_COUNT_SOLD: `${CONFIG.BASE_URL}Overview/countTerjual`,
	DASHBOARD_GET_AMOUNT_WEIGHT_SOLD: `${CONFIG.BASE_URL}Overview/sumBeratTerjual`,

	LIST_HISTORY_BARANG: `${CONFIG.BASE_URL}baranghistory/getBarangHistory`,
	HISTORY_GET_INFO: (kodeBarang) => `${CONFIG.BASE_URL}baranghistory/getInfoHistory/${kodeBarang}`,

	KELOLA_DATA_PENJUALAN: `${CONFIG.BASE_URL}penjualan/getPenjualan`,
	KELOLA_DATA_PEMBELIAN: `${CONFIG.BASE_URL}pembelian/getPembelian`,
	KELOLA_DATA_BELIKEMBALI: `${CONFIG.BASE_URL}belikembali/getbelikembali`,
	FILTER_DATA_PENJUALAN: `${CONFIG.BASE_URL}penjualan/filterPenjualan`,
	FILTER_DATA_PEMBELIAN: `${CONFIG.BASE_URL}pembelian/filterPembelian`,
	FILTER_DATA_BELIKEMBALI: `${CONFIG.BASE_URL}belikembali/filterbelikembali`,
	KELOLA_DATA_LABARUGI: `${CONFIG.BASE_URL}penjualan/getLabaRugi`,
	FILTER_DATA_LABARUGI: `${CONFIG.BASE_URL}penjualan/filterLabaRugi`,

	LIST_CHECK_STOK: `${CONFIG.BASE_URL}Stok/getCheckStok`,
	LIST_STOK_UNCHECKED: `${CONFIG.BASE_URL}Stok/getStokUnchecked`,
	CHECK_STOK: `${CONFIG.BASE_URL}Stok/checkBarang`,
	RESET_CHECK_STOK: `${CONFIG.BASE_URL}Stok/resetStatusCheck`,

	LAPORAN_NERACA: `${CONFIG.BASE_URL}laporan/laporanNeraca`,
	LAPORAN_AKTIVA_PASSIVA: `${CONFIG.BASE_URL}laporan/laporanAktivaPassiva`,
	LAPORAN_KAS: `${CONFIG.BASE_URL}laporan/laporanKas`,
	LAPORAN_JURNAL_UMUM: `${CONFIG.BASE_URL}laporan/laporanJurnalUmum`,
	FAKTUR_KAS: `${CONFIG.BASE_URL}datahelper/autoFakturKas`,
	FAKTUR_TRANSFER: `${CONFIG.BASE_URL}datahelper/autoFakturTransfer`,

	ADD_KAS: `${CONFIG.BASE_URL}laporan/store `,
	UPDATE_KAS: `${CONFIG.BASE_URL}laporan/update `,
	LAPORAN_INFO_TRANSAKSI_BARANG: `${CONFIG.BASE_URL}laporan/infoTransaksiBarang`,
	LIST_SOURCE_KAS: `${CONFIG.BASE_URL}laporan/getSourceKas`,
	DELETE_LAPORAN_KAS: `${CONFIG.BASE_URL}laporan/destroy`,
	DELETE_LAPORAN_KAS_BY_FAKTUR: `${CONFIG.BASE_URL}laporan/destroyNota`,


	FAKTUR_SERVICE: `${CONFIG.BASE_URL}datahelper/autoFakturServis`,
	LIST_DATA_SERVICE: `${CONFIG.BASE_URL}jasaservis/getJasaServis`,
	TRANSACTION_SERVICES: `${CONFIG.BASE_URL}jasaservis/store`,

	LIST_PENJUALAN_QUANTITY: (id) => `${CONFIG.BASE_URL}quantity/getpenjualandetail/${id}`,


	LAPORAN_BARANG: `${CONFIG.BASE_URL}laporan/laporanBarang`,
	LAPORAN_JUAL_PERBARANG: `${CONFIG.BASE_URL}laporan/laporaJualPerbarang`,
	LAPORAN_BELI_PERBARANG: `${CONFIG.BASE_URL}laporan/laporaBeliPerbarang`,
	LAPORAN_BUYBACK_PERBARANG: `${CONFIG.BASE_URL}laporan/laporaBuybackPerbarang`,
	DETAIL_PERBARANG: `${CONFIG.BASE_URL}baranghistory/getHistoryPerbarang`,

	BACKUP_DATABASE: `${CONFIG.BASE_URL}pengaturan/backupDatabase`,
	BACKUP_DATABASE_SQLITE: `${CONFIG.BASE_URL}pengaturan/backupDatabaseSqlite`,
	RESTORE_DATABASE_SQLITE: `${CONFIG.BASE_URL}pengaturan/restoreDatabaseSqlite`,




	DATA_LABARUGI: `${CONFIG.BASE_URL}penjualan/getFakturLabarugi`,
	DATA_PENJUALAN_FAKTUR: `${CONFIG.BASE_URL}penjualan/getFakturNota`,
	DATA_PEMBELIAN_FAKTUR: `${CONFIG.BASE_URL}pembelian/getFakturNota`,
	DATA_QUANTITY_FAKTUR: `${CONFIG.BASE_URL}penjualan/getFakturNotaQuantity`,
	LOGIN: `${CONFIG.BASE_URL}otentikasi/aksi_login`,
	CHANGE_KASIR: `${CONFIG.BASE_URL}otentikasi/login_kasir`,
	CHECKING_PASSWORD: `${CONFIG.BASE_URL}otentikasi/checkingPasssword`,
	LOGOUT: `${CONFIG.BASE_URL}otentikasi/logout`,

	LIST_SALDO: `${CONFIG.BASE_URL}saldo/getSaldo`,
	ADD_SALDO: `${CONFIG.BASE_URL}saldo/add`,
	UPDATE_SALDO: `${CONFIG.BASE_URL}saldo/save`,
	DELETE_SALDO: `${CONFIG.BASE_URL}saldo/delete`,
	GET_ALL_SALDO: `${CONFIG.BASE_URL}saldo/getAll`,
	GET_SALDO_BY_REKENING: `${CONFIG.BASE_URL}saldo/getSaldoByRekening`,
	SYNCH_SALDO :`${CONFIG.BASE_URL}Overview/scynchSaldo`,
	GET_DETAIL_TRANSAKSI: `${CONFIG.BASE_URL}saldo/getDetailTransaksi`,

	// Database Management
	EMPTY_TABLE: `${CONFIG.BASE_URL}pengaturan/emptyTable`,


	LIST_REFERENSI: `${CONFIG.BASE_URL}Referensiakuntan/getReferensi`,
	ADD_REFERENSI: `${CONFIG.BASE_URL}Referensiakuntan/add`,
	UPDATE_REFERENSI: `${CONFIG.BASE_URL}Referensiakuntan/save`,
	DELETE_REFERENSI: `${CONFIG.BASE_URL}Referensiakuntan/delete`,
};

export default API_ENDPOINT;
