import UrlParser from "../routes/url-parser.js";

const ShorcutInitialize = {
	async initialShortcut() {
		const eventShortcut = async (event) => {
			const url = UrlParser.parseActiveUrlWithCombiner();
			if (!(document.activeElement.hasAttribute('required'))) {
				if (url.includes('/penjualan')) {
					this._shorcutPenjualan(event);
				} else if (url.includes('/pembelian')) {
					this._shorcutPembelian(event);
				} else if (url.includes('/belikembali')) {
					this._shorcutBeliKembali(event);
				} else if (url.includes('/buyback-oldstok')) {
					this._shorcutBeliKembaliOld(event);
				} else if (url.includes('/transaksi-quantity')) {
					this._shorcutTransaksiQuantity(event)
				} else if (url.includes('/barang')) {
					this._shorcutMasterBarang(event);
				} else if (url.includes('/jenisbarang') || url.includes('/pelanggan') || url.includes('/supplier') || url.includes('/level') || url.includes('/user') || url.includes('/sumber')) {
					this._shorcutMasterPublic(event);
				} else if (url.includes('/hutang') || url.includes('/piutang')) {
					this._shorcutHutangPiutang(event);
				} else if (url.includes('/data-barangrusak')) {
					this._shorcutKelolaDataPublic(event);
				} else if (url.includes('/stok-opname')) {
					this._shorcutStokOpname(event);
				} else if (url.includes('/laporan-kas') || url.includes('/transfer-rekening') || url.includes('/jurnal-umum')) {
					this._shorcutLaporanKas(event);
				} else if (url.includes('/data-penjualan') || url.includes('/data-pembelian') || url.includes('/data-belikembali') || url.includes('/laporan-barang') || url.includes('/labarugi-nota')) {
					this._shorcutKelolaDataFilter(event);
				} else if (url.includes('/laporan-neraca') || url.includes('/laporan-jurnal')) {
					this._shorcutKelolaDataFilter(event);
				} else if (url.includes('/barcode-barang')) {
					this._shorcutPrintNeraca(event);
				} else if (url.includes('/jual-perbarang') || url.includes('/beli-perbarang') || url.includes('/buyback-perbarang')) {
					this._shorcutPerbarang(event);
				}
			}

		}
		document.addEventListener('keyup', eventShortcut);
		this._disabledDefault();
	},

	_disabledDefault() {
		document.onkeydown = function (e) {
			if (e.ctrlKey &&
				(e.key === "W" ||
					e.key === "C" ||
					e.key === "V" ||
					e.key === "F5" ||
					e.key === "F10" ||
					e.key === "F4")) {
				return false;
			} else if (e.key === "F1") {
				return false;
			} else {
				return true;
			}
		}
	},

	_shorcutPenjualan(event) {
		if (event.ctrlKey && event.key === "F6") {
			document.getElementById('pilihBarang').click();
		} else if (event.ctrlKey && event.key === "F10") {
			document.getElementById('openCamera').click();
		} else if (event.key === "F10") {
			document.getElementById('scanBarcode').click();
		} else if (event.key === "F2") {
			document.getElementById('btnMarkup').click();
			document.getElementById('markupHarga').focus();
		} else if (event.key === "End") {
			document.getElementById('openBayarJual').click();
		} else if (event.ctrlKey && event.key === "F7") {
			document.getElementById('pilihPelanggan').click();
		} else if (event.key === "F9") {
			if (document.getElementById('barcodeBarang').value == '') {
				this._notification('Barcode Barang Tidak Boleh Kosong!', 'error')
			} else {
				document.getElementById('btnTake').click();
			}
		} else if (event.key === "B" || event.key === "b") {
			document.getElementById('barcodeBarang').focus();
		}
	},

	_shorcutTransaksiQuantity(event) {
		if (event.ctrlKey && event.key === "F6") {
			document.getElementById('pilihBarang').click();
		} else if (event.key === "F2") {
			document.getElementById('btnMarkup').click();
		} else if (event.key === "End") {
			document.getElementById('openBayarJual').click();
		} else if (event.ctrlKey && event.key === "F7") {
			document.getElementById('pilihPelanggan').click();
		} else if (event.key === "F9") {
			if (document.getElementById('barcodeBarang').value == '') {
				this._notification('Barcode Barang Tidak Boleh Kosong!', 'error')
			} else {
				document.getElementById('btnTake').click();
			}
		}
	},

	_shorcutPembelian(event) {
		if (event.ctrlKey && event.key === "F6") {
			document.getElementById('create_data').click();
		} else if (event.key === "End") {
			document.getElementById('openBayarBeli').click();
		} else if (event.ctrlKey && event.key === "F7") {
			document.getElementById('pilihSupplier').click();
		}
	},

	_shorcutBeliKembali(event) {
		if (event.key === "End") {
			document.getElementById('openBayarBuyback').click();
		} else if (event.ctrlKey && event.key === "F6") {
			document.getElementById('pilihBarang').click();
		} else if (event.ctrlKey && event.key === "F7") {
			document.getElementById('pilihPelanggan').click();
		}
	},

	_shorcutBeliKembaliOld(event) {
		if (event.key === "End") {
			document.getElementById('openBayarBuyback').click();
		} else if (event.ctrlKey && event.key === "F6") {
			document.getElementById('pilihBarang').click();
		} else if (event.ctrlKey && event.key === "F7") {
			document.getElementById('pilihPelanggan').click();
		} else if (event.key === "B" || event.key === "b") {
			document.getElementById('kodeBarang').focus();
		}
	},

	_shorcutMasterBarang(event) {
		if (event.ctrlKey && event.key === "F9") {
			document.getElementById('filterData').click();
		} else if (event.key === "F1") {
			document.getElementById('create_data').click();
		} else if (event.ctrlKey && event.key === "F5") {
			document.getElementById('refresh').click();
		} else if (event.key === "F2") {
			document.getElementById('btn_change_status').click();
		} else if (event.key === "F4") {
			document.getElementById('btnAgain').click();
		}
	},

	_shorcutMasterPublic(event) {
		if (event.key === "F1") {
			document.getElementById('create_data').click();
		} else if (event.ctrlKey && event.key === "F5") {
			document.getElementById('refresh').click();
		}
	},

	_shorcutKelolaDataPublic(event) {
		if (event.ctrlKey && event.key === "F5") {
			document.getElementById('refresh').click();
		}
	},

	_shorcutStokOpname(event) {
		if (event.ctrlKey && event.key === "F5") {
			document.getElementById('refresh').click();
		} else if (event.key === "F9") {
			document.getElementById('filterData').click();
		} else if (event.ctrlKey && event.key === "F10") {
			document.getElementById('recheckStok').click();
		}
	},

	_shorcutKelolaDataFilter(event) {
		if (event.ctrlKey && event.key === "F5") {
			document.getElementById('refresh').click();
		} else if (event.key === "F9") {
			document.getElementById('filterData').click();
		} else if (event.ctrlKey && event.key === "F10") {
			$(".buttons-print").click();
		}
	},

	_shorcutPerbarang(event) {
		if (event.ctrlKey && event.key === "F5") {
			document.getElementById('refresh').click();
		} else if (event.key === "F9") {
			document.getElementById('filterData').click();
		} else if (event.ctrlKey && event.key === "F10") {
			$(".buttons-print").click();
		}
	},

	_shorcutLaporanKas(event) {
		if (event.ctrlKey && event.key === "F5") {
			document.getElementById('refresh').click();
		} else if (event.key === "F9") {
			document.getElementById('filterData').click();
		} else if (event.key === "F1") {
			document.getElementById('addKas').click();
		}
	},

	_shorcutHutangPiutang(event) {
		if (event.ctrlKey && event.key === "F5") {
			document.getElementById('refresh').click();
		} else if (event.key === "F1") {
			document.getElementById('lunas').click();
		} else if (event.key === "F2") {
			document.getElementById('belumLunas').click();
		} else if (event.key === "F4") {
			document.getElementById('belumBayar').click();
		}
	},

	_shorcutPrintBarcode(event) {
		if (event.ctrlKey && event.key === "F10") {
			document.getElementById('print-out').click();
		} else if (event.ctrlKey && event.key === "F5") {
			document.getElementById('refresh').click();
		} else if (event.key === "F9") {
			document.getElementById('filterData').click();
		}
	},

	_shorcutPrintNeraca(event) {
		if (event.key === "F9") {
			document.getElementById('filterData').click();
		}
	},
}

export default ShorcutInitialize;
