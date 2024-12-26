import ApiPembelian from "../../api/data-pembelian.js";
import API_ENDPOINT from "../../config/globals/endpoint.js";
import FormatCurrency from "../../utils/initial-currency.js";
import CONFIG from "../../config/globals/config.js";
import apiBarang from "../../api/data-barang.js";
import dataTableBarangInitiator from "./../master/initial_barang.js";
import FakturInitiator from '../utils/initial_faktur.js';
import ApiSettingApps from '../../api/data-setting-apps.js';

let foto = '';
let video;

function reformatNumber(num) {
	const result = num.replace(/[^,\d]/g, '').toString();
	return result;
}
const pembelianInitiator = {
	async init() {
		await this._setDefault();
		await this._giveEventAddDetailPembelian();
		await this._renderDetailPembelian();
		await this._getSupplier();
		await this._initialPayment();
		await this._initialInput();
		await this._showCamera();
		this._getJenisBarang();
		this._initialSwitchJenis();
		this._initialAutoBarcode();
		this._initialAutoBarcode();
	},

	async _initialInput() {
		FormatCurrency.initialCurrency({
			elmId: "harga_beli",
		});
		FormatCurrency.initialCurrency({
			elmId: "harga_jual",
		});
		document.getElementById("openBayarBeli").addEventListener('click', function () {
			$('#modalBayar').on('shown.bs.modal', function () {
				$('#namaSupplier').focus();
			});
		});
	},

	async _initialAutoBarcode() {
		let barcodeBarang = document.getElementById("kode_barang");
		const autoBarcode = async () => {
			let jenisBarang = document.getElementById("jenis_barang").value;
			const response = await apiBarang.getJenisBarangRow(jenisBarang);
			let a = "" + Math.floor(Math.random() * 100000 + 1);
			let c = "" + Math.floor(Math.random() * 100000 + 1);
			if (jenisBarang == "") {
				barcodeBarang.value = "" + a + c;
			} else {
				barcodeBarang.value = `${response[0].kode_jenis}-` + a + c;
			}
		};
		const addKodeJenis = async () => {
			let jenisBarang = document.getElementById("jenis_barang").value;
			let stringBarcode = barcodeBarang.value;
			const response = await apiBarang.getJenisBarangRow(jenisBarang);
			if (stringBarcode.match(/-/i)) {
				let str = stringBarcode.split("-").pop();
				barcodeBarang.value = str.replace(/^/, `${response[0].kode_jenis}-`);
			} else {
				barcodeBarang.value = stringBarcode.replace(
					/^/,
					`${response[0].kode_jenis}-`
				);
			}
		};
		document.getElementById("autoBarcode").addEventListener("click", autoBarcode);
		document.getElementById("jenis_barang").addEventListener("change", addKodeJenis);
	},

	async _getJenisBarang() {
		$("#modalBarang").on("shown.bs.modal", function () {
			$("#jenis_barang").focus();
		});
		let elmData = "";
		const dataAkses = await apiBarang.getJenisBarang();
		dataAkses.data.forEach((data) => {
			elmData += `<option value="${data[1]}">${data[1]}</li>`;
		});
		$("#jenis_barang").removeAttr("disabled", "disabled").html("<option disabled selected value> -- Pilih Jenis Barang -- </option>" + elmData);
		$("#pilih_jenis").removeAttr("disabled", "disabled").html("<option disabled selected value>Pilih Jenis Barang </option>" + elmData);
	},

	async _initialAutoBarcode() {
		const autoBarcode = async () => {
			const _data = await ApiSettingApps.getSettingApps();
			document.getElementById('harga_jual').value = await FormatCurrency.setValue(_data.harga_pasar);
			let barcodeBarang = document.getElementById("kode_barang");
			let jenisBarang = document.getElementById("jenis_barang").value;
			if (jenisBarang == "") {
				barcodeBarang.value = null;
			} else {
				const response = await apiBarang.getJenisBarangRow(jenisBarang);
				const kode = await apiBarang.getKodeBarang(response[0].kode_jenis);
				barcodeBarang.value = kode.data;
			}
		};
		document.getElementById("create_data").addEventListener("click", autoBarcode);
		document.getElementById("jenis_barang").addEventListener("change", autoBarcode);
	},

	async _initialSwitchJenis() {
		const switchJenis = async () => {
			let jenisBarang = document.getElementById("jenis_barang").value;
			const response = apiBarang.getJenisBarangRow(jenisBarang);
			response.then(function (result) {
				if (result[0].penjualan_satuan == 1) {
					$("#viewBerat").hide();
					$("#viewKadar").hide();
					$("#viewStok").show();
					document.getElementById('berat').required = false;
					document.getElementById('kadar').required = false;
					document.getElementById('berat').value = 0;
					document.getElementById('kadar').value = 0;
				} else {
					$("#viewBerat").show();
					$("#viewKadar").show();
					$("#viewStok").hide();
					document.getElementById('stok').required = false;
					document.getElementById('stok').value = 0;
				}
			});
		};
		document.getElementById("jenis_barang").addEventListener("change", switchJenis);
	},

	async _showCamera() {
		const canvas = document.querySelector('canvas');
		video = document.querySelector('video');
		var shutter = new Audio();
		shutter.autoplay = false;
		shutter.src = navigator.userAgent.match(/Firefox/) ? `${CONFIG.BASE_FRONT_URL}vendor/webcamjs/shutter.ogg` : `${CONFIG.BASE_FRONT_URL}vendor/webcamjs/shutter.mp3`;
		const constraints = {
			video: {
				width: 320,
				height: 240,
				facingMode: 'environment'
			}
		};

		const startStream = async (constraints) => {
			const stream = await navigator.mediaDevices.getUserMedia(constraints);
			handleStream(stream);
		};

		const handleStream = (stream) => {
			video.srcObject = stream;
		};
		startStream(constraints);
		document.getElementById('btnTake').addEventListener('click', () => {
			shutter.currentTime = 0;
			canvas.width = video.videoWidth;
			canvas.height = video.videoHeight;
			canvas.getContext('2d').drawImage(video, 0, 0);
			video.pause();
			foto = canvas.toDataURL('image/jpeg');
			shutter.play();
		});
		document.getElementById('btnAgain').addEventListener('click', () => {
			foto = '';
			video.play();
		});
	},

	async _getSupplier() {
		await $("#tableSupplier").DataTable({
			processing: true,
			destroy: true,
			language: {
				loadingRecords: "&nbsp;",
				processing: '<div class="spinner"></div>',
			},
			serverSide: true,
			ajax: {
				url: `${API_ENDPOINT.LIST_SUPPLIER}`,
				type: "POST",
			},
			lengthChange: true,
			columnDefs: [{
				targets: -1,
				orderable: false,
				data: null,
				defaultContent: `<button class='btn btn-primary btn-sm' id='addSupplier'><i class='fas fa-check'></i> pilih</button>`,
			},
			{
				targets: [0],
				visible: true,
				searchable: false,
			},
			],
		});
		$("#tableSupplier tbody").on("click", "#addSupplier", async function () {
			const table = $("#tableSupplier").DataTable();
			let data = table.row($(this).parents("tr")).data();
			$("#namaSupplier").val(data[1]);
			$("#idSupplier").val(data[0]);
			$("#modalSupplier").modal("hide");
		});
	},

	async _setDefault() {
		$("#viewStok").hide();
		document.getElementById("tanggal").value = ApiSettingApps.todayDate();
		await dataTableBarangInitiator._getJenisBarang();
		await this._setFaktur();
		this._eventShowCredits();
	},

	async _setFaktur() {
		const faktur = await ApiPembelian.getFaktur();
		document.getElementById("nota").value = faktur.data;
	},

	async _giveEventAddDetailPembelian() {
		const eventDetailPembelian = async (e) => {
			e.preventDefault();
			try {
				await this._addDetailPembelian();
				await this._renderDetailPembelian();
				this._notification("Data berhasil dimasukan", "success");
			} catch (error) {
				console.log(error);
				this._notification("Rupanya ada masalah di server ..", "error");
			}
			document.getElementById("kode_barang").value = "";
			document.getElementById("nama_barang").value = "";
			$("#jenis_barang").prop("selectedIndex", 0);
			document.getElementById("berat").value = "";
			video.play();
		};

		document
			.getElementById("pembelianForm")
			.addEventListener("submit", eventDetailPembelian);
	},

	async _addDetailPembelian() {
		const status = await ApiPembelian.addDetail({
			FormData: new FormData(document.getElementById("pembelianForm")),
			user_id: document.getElementById("user-id").value,
			foto: foto,
		});
	},

	async _setPrice(idHtml) {
		FormatCurrency.initialCurrency({
			elmId: `${idHtml}`
		})
	},

	async _renderDetailPembelian() {
		const result = await ApiPembelian.getPembelianDetail(
			document.getElementById("user-id").value
		);

		let elmHtml = "";
		let grandTotal = 0;
		result.data.forEach((dataValue) => {
			elmHtml += `<tr>
            <td>${dataValue[0]}</td>
            <td>${dataValue[1]}</td>
            <td>${dataValue[2]}</td>
            <td>${dataValue[3]}</td>
            <td>${dataValue[4]}</td>
            <td>${dataValue[5]}</td>
            <td>${dataValue[6]}</td>
            <td>${dataValue[7]}</td>
            <td>${dataValue[8]}</td>
            <td>${dataValue[9]}</td>
            <td><button id='del-detail-beli${dataValue[0]}' class=' btn btn-danger btn-circle'><i class='fas fa-trash'></i></button> </td>
            </tr>`;
			grandTotal += parseInt(reformatNumber(dataValue[7]));
		});
		document.getElementById("listPembelian").innerHTML = elmHtml;
		document.getElementById("grandTotalTable").innerHTML = await FormatCurrency.setValue(grandTotal);
		document.getElementById("grandTotal").value = await FormatCurrency.setValue(grandTotal);
		await this._afterRender(result);
	},

	async _afterRender(result) {
		result.data.forEach((dataValue) => {
			document
				.getElementById(`del-detail-beli${dataValue[0]}`)
				.addEventListener("click", () => {
					const idBarangValue = dataValue[0];
					const kodeBarangValue = dataValue[1];
					const keteranganBarangValue = dataValue[3];
					const fotoValue = dataValue[9];
					let userId = document.getElementById("user-id").value;

					swal
						.fire({
							title: "Hapus",
							html: "Anda ingin menghapus data ini? <br> <strong>Keterangan Barang </strong>: " +
								keteranganBarangValue,
							icon: "warning",
							showCancelButton: true,
							confirmButtonColor: "#3085d6",
							cancelButtonColor: "#d33",
							confirmButtonText: "Ya, Hapus!",
						})
						.then(async (response) => {
							if (response.value) {
								await ApiPembelian.deleteDetail({
									user_id: userId,
									idBarang: idBarangValue,
									kodeBarang: kodeBarangValue,
									foto: fotoValue,
								});
								this._notification(`Data barang berhasil dihapus!`, "success");
								await this._renderDetailPembelian();
							}
						});
				});
		});
	},

	_notification(msg, status) {
		swal.fire({
			title: `${status}`,
			text: `${msg}`,
			icon: `${status}`,
			showConfirmButton: false,
			timer: 1000,
		});
	},

	async _eventShowCredits() {
		const eventCredits = async () => {
			const pembayaran = document.getElementById("pilih_pembayaran").value;
			if (pembayaran == 1) {
				document.getElementById("jatuhTempo").innerHTML = "";
				document.getElementById("sisaHutang").innerHTML = "";
			} else if (pembayaran == 2) {
				document.getElementById(
					"jatuhTempo"
				).innerHTML = `<label for="tempo" class="col-sm-3 col-form-label">Jatuh Tempo</label>
				<div class="col-sm-9">
				<input type="date" class="form-control" id="tempo" value='' required>
				</div>`;

				document.getElementById(
					"sisaHutang"
				).innerHTML = `<label for="tempo" class="col-sm-3 col-form-label">Bayar Sebagian</label>
				<div class="col-sm-9">
				<input type="text"  class="form-control" id="hutangDibayar">
				</div>`;
				this._setPrice('hutangDibayar');
			}
		};
		document
			.getElementById("pilih_pembayaran")
			.addEventListener("change", eventCredits);
	},

	async _initialPayment() {
		const eventTransaksi = async (e) => {
			e.preventDefault();
			let grandTotal = await FormatCurrency.getValue(
				document.getElementById("grandTotal").value
			);
			
			let hutangDibayar = document.getElementById("hutangDibayar") ? await FormatCurrency.getValue(
				document.getElementById("hutangDibayar").value
			) : 0

			let hutangSisa = grandTotal - hutangDibayar ;
		
			if (grandTotal == 0) {
				this._notification(`Jumlah Pembayaran Belum Ada!`, "warning");
			} else {
				let faktur = document.getElementById('nota').value;
				const result = await ApiPembelian.transactionsPayment({
					faktur: faktur,
					supplier_id: document.getElementById("idSupplier").value,
					date: document.getElementById("tanggal").value,
					grand_total: grandTotal,
					user_id: document.getElementById("user-id").value,
					status_bayar: document.getElementById("pilih_pembayaran").value,
					tempo: document.getElementById("tempo") ?
						document.getElementById("tempo").value : "0",
					hutang_dibayar : hutangDibayar,	
					hutang_sisa : hutangSisa,
				});
				if (result) {
					this._notification("Transaksi berhasil diproses", "success");
					await this._printFaktur(faktur);
				}
			}
		};

		document
			.getElementById("transaksi-pembelian")
			.addEventListener("submit", eventTransaksi);
	},

	async _reset() {
		$("#modalBayar").modal("hide");
		document.getElementById("transaksi-pembelian").reset();
		await this._renderDetailPembelian();
		$("#viewStok").hide();
		document.getElementById("tanggal").value = ApiSettingApps.todayDate();

		await this._setFaktur();
	},

	async _printFaktur(faktur) {
		await $('#modalBayar').modal('hide');
		$('#modalBayar').on('hidden.bs.modal', function (e) {
			document.activeElement.blur();
			$('.swal2-confirm').focus();
		})
		await swal.fire({
			title: 'Cetak Print',
			html: "Apakah anda ingin mencetak data ini? <br> <strong>Keterangan  Faktur</strong>: " + faktur,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Ya, Cetak!',
			focusConfirm: true
		}).then(async (result) => {
			if (result.value) {
				$('#modalPrint').modal('show');
				await FakturInitiator.initPembelian(faktur, true)
				await this._reset();
			} else {
				await this._reset();
			}
		});
		await $('#cetakStruk').on('click', async function (event) {
			event.preventDefault()
			event.stopPropagation();
			jQuery('#printResultNota').print();
		});
	},
};

export default pembelianInitiator;
