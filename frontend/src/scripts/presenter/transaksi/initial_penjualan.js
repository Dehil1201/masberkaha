import API_ENDPOINT from '../../config/globals/endpoint.js';
import ApiSettingApps from '../../api/data-setting-apps.js'
import apiPenjualan from '../../api/data-penjualan.js';
import apiPelanggan from '../../api/datapelanggan.js';
import FormatCurrency from '../../utils/initial-currency.js';
import CONFIG from '../../config/globals/config.js';
import ApiLogin from '../../api/data-login.js';
import NotificationModal from '../../utils/initial_notification.js';
import ApiUser from '../../api/data-user.js';
import UrlParser from '../../routes/url-parser.js';
import PrintInitiator from '../utils/initial_print.js';

let tableBarang;
let foto = '';
let video;
let beratTotal;
let point;

function padLeadingZeros(num, size) {
	var s = num + "";
	while (s.length < size) s = "0" + s;
	return s;
}

function joinCurrency(variable) {
	let reverse = variable.toString().split('').reverse().join(''),
		format = reverse.match(/\d{1,3}/g);
	format = format.join('.').split('').reverse().join('');
	return format
}

function reformatCurrency(num) {
	return num.replace(/[^,\d]/g, '');
}

let _pointMember;
const dataTablePenjualanInitiator = {
	async init() {
		const _data = await ApiSettingApps.getSettingApps();
		_pointMember = _data.point_gram;
		this._setDefault();
		this._giveEventGetBarang();
		await this._showMaster();
		await this._showBarang();
		await this._showCamera();
		await this._setFaktur();
		await this._eventShowCredits();
		await this._giveEventDetail();
		await this._giveEventAddPelanggan();
		await this._initialPayment();
		await this._giveEventSaveFoto();
		await this._initScanBarcode();
		this._initFormatCurrency();
		this._setDate();
		this._chooseEvent();
		this._giveEventSwitchHargaPasar();
		this._markupHarga();
		this._giveEventLogin();
		this._autoKodePelanggan();
		await this._renderUsername();
		this._isAdminLogin();
		this._isStateKasir();
		this._setImageViewDatatable();
		this._refreshDetailPenjualan();
		// await this._turnOnFlashLight();
		// this._setInitModal();
	},

	_isAdminLogin() {
		let level = document.getElementById('level-user').value;
		if (level == 1 || level == 6) {
			document.getElementById('kasir-id').value = level;
			document.getElementById('kasir-name').innerHTML = `<b>${(level == 6) ? 'Owner' : 'Admin'}</b> - ${$('#nama-user').html()}`;
			document.getElementById('username').disabled = true;
			document.getElementById('password').disabled = true;
			document.getElementById('barcodeBarang').focus();
			this._syncData();
		} else {
			document.getElementById('username').disabled = false;
			document.getElementById('password').disabled = false;
			document.getElementById('kasir-name').innerHTML = `<b>???</b>`;
		}
	},

	async _renderUsername() {
		let elmData = '';
		const dataAkses = await ApiUser.getUser();
		dataAkses.data.forEach((data) => {
			if (data[3] !== 'admin' || data[3] !== 'owner') {
				elmData += `<option value="${data[2]}">${data[2]}</li>`;
			}

		})
		$("#username").removeAttr('disabled', 'disabled').html('<option disabled selected value> -- Pilih Jenis Username -- </option>' + elmData);

	},

	_isStateKasir() {
		document.getElementById('username').focus();
		const kasirID = document.getElementById('kasir-id').value;
		if (kasirID === '') {
			this._disabled();
		} else {
			this._unDisabled();
		}
	},

	_disabled() {
		document.getElementById('barcodeBarang').disabled = true
		document.getElementById('colButtonMarkup').disabled = true
		document.getElementById('submit-add-barang').disabled = true
		document.getElementById('ongkosBikin').disabled = true
		document.getElementById('pilihBarang').disabled = true
		document.getElementById('openCamera').disabled = true
		document.getElementById('openBayarJual').disabled = true

	},

	_unDisabled() {
		document.getElementById('barcodeBarang').disabled = false
		document.getElementById('colButtonMarkup').disabled = false
		document.getElementById('submit-add-barang').disabled = false
		document.getElementById('ongkosBikin').disabled = false
		document.getElementById('pilihBarang').disabled = false
		document.getElementById('openBayarJual').disabled = false

	},

	_giveEventLogin() {
		const eventLogin = async (e) => {
			e.preventDefault();
			const isLogin = await ApiLogin.LoginKasir({
				username: document.getElementById('username').value,
				password: document.getElementById('password').value,
			});

			if (isLogin.status == false) {
				NotificationModal.show('Username tidak ditemukan!', 'error');
			} else {
				if (isLogin.aunteticated === true || isLogin.status === 'MASUK') {

					document.getElementById('kasir-id').value = `${isLogin.userID}`;
					document.getElementById('kasir-name').innerHTML = `<b>${isLogin.nama}</b>`;
					this._isStateKasir();
					document.getElementById('barcodeBarang').focus();
					NotificationModal.show('Berhasil Mengganti Kasir', 'success');
					await this._syncData();
				} else {
					NotificationModal.show('Password Salah', 'error');
					$('#tablePenjualanDetail').empty();
				}
				document.getElementById('change-kasir').reset();
			}
		}
		document.getElementById('change-kasir').addEventListener('submit', eventLogin);
	},

	async _giveEventSwitchHargaPasar() {
		const barcodeBarang = document.getElementById('barcodeBarang');
		const dataElm = document.getElementById('switch-harga-pasar');
		const harga = document.getElementById('hargaBarang');
		const switchHargaPasar = async () => {
			const valueChecked = dataElm.checked ? 1 : 0;
			if (valueChecked === 1) {
				const result = await ApiSettingApps.getSettingApps();
				harga.value = await FormatCurrency.setValue(result.harga_pasar);
				harga.focus();
			} else {
				const _result = await apiPenjualan.getBarangRow(barcodeBarang.value);
				if (_result !== null) {
					document.getElementById('hargaBarang').value = await FormatCurrency.setValue(_result.harga_jual);
					harga.focus();
				} else {
					harga.value = '';
					barcodeBarang.focus();
				}
			}
		}

		document.getElementById('switch-harga-pasar').addEventListener('click', switchHargaPasar)
	},

	async _giveEventGetBarang() {
		const swicthPasar = document.getElementById('switch-harga-pasar');
		const settings = await ApiSettingApps.getSettingApps();
		const getBarangRow = async (e) => {
			const valueBarcode = document.getElementById('barcodeBarang').value;
			if (valueBarcode.length < 8) {
				document.getElementById("barcodeBarang").value = valueBarcode.substr(0, 1) + padLeadingZeros(valueBarcode.substr(1, 7), 7);
			}
			const barcode = document.getElementById('barcodeBarang').value;
			const result = await apiPenjualan.getBarangRow(barcode);
			if (result != null) {
				const valueChecked = swicthPasar.checked ? 1 : 0;
				document.getElementById('idBarang').value = result.id;
				document.getElementById('keteranganBarang').value = result.nama_barang;
				if (valueChecked === 1) {
					document.getElementById('hargaBarang').value = await FormatCurrency.setValue(settings.harga_pasar);
				} else {
					document.getElementById('hargaBarang').value = await FormatCurrency.setValue(result.harga_jual);
				}
				const checkFoto = await apiPenjualan.checkFoto(barcode);
				document.getElementById('imgView').innerHTML = `<label>Foto</label><div class="input-group mb-3">${checkFoto != null ? `<img id='fotoBarang' class='foto' src='${CONFIG.BASE_URL}uploads/foto/${checkFoto}' width='50' alt='${checkFoto}' title='Lihat foto - ${result.nama_barang}'</img>` : 'Tidak ada'}</div>`;
				document.getElementById('openCamera').disabled = checkFoto != null ? true : false;
				if (checkFoto != null) {
					this._setImageView();
				}
			} else {
				if (e.type === "change") {
					this._notification(`Data barang ${barcode} tidak ditemukan!`, 'error')
					document.getElementById('form-pilih-barang').reset();
				}
			}
		}
		const barcodeToUpper = async () => {
			const condBarcode = document.getElementById('barcodeBarang').value;
			document.getElementById("barcodeBarang").value = condBarcode.toUpperCase();
		}

		document.getElementById('barcodeBarang').addEventListener('input', barcodeToUpper)
		document.getElementById('barcodeBarang').addEventListener('change', getBarangRow)
		document.getElementById('showBarang').addEventListener('click', getBarangRow)
	},

	async _giveEventDetail() {
		const eventDetail = async (e) => {
			e.preventDefault();
			const valueBarcode = document.getElementById('barcodeBarang').value;
			const _result = await apiPenjualan.getBarangRow(valueBarcode);

			setTimeout(async () => {
				if (_result != null) {
					const result = await apiPenjualan.addDetail({
						user_id: document.getElementById('kasir-id').value,
						idBarang: _result.id,
						kodeBarang: document.getElementById('barcodeBarang').value,
						harga: await FormatCurrency.getValue(document.getElementById('hargaBarang').value),
						ongkos: await FormatCurrency.getValue(document.getElementById('ongkosBikin').value),
						markupHarga: await FormatCurrency.getValue(document.getElementById('markupHarga').value)
					});
					if (result.status == false) {
						this._notification(`${result.message}`, 'error');
					}
					document.getElementById('imgView').innerHTML = ``;
					await this._setDefault();
					await this._syncData();
					document.getElementById('form-pilih-barang').reset();
					setTimeout(() => {
						let nodes = document.querySelectorAll('.ongkosDetail');
						var focusFirsrElement = nodes[0];
						focusFirsrElement.focus();
					}, 900)

				}
			}, 500);

		}

		document.getElementById('form-pilih-barang').addEventListener('submit', eventDetail);

	},

	async _giveEventSaveFoto() {
		const eventSaveFoto = async (e) => {
			e.preventDefault();
			if (foto != '') {
				const valueBarcode = document.getElementById('barcodeBarang').value;
				const result = await apiPenjualan.getBarangRow(valueBarcode);
				if (result != null) {
					const result = await apiPenjualan.saveFoto({
						kodeBarang: document.getElementById('barcodeBarang').value,
						foto: foto,
					});
					if (result.status == false) {
						this._notification(`${result.message}`, 'error');
					} else {
						document.getElementById('imgView').innerHTML = `<label>Foto</label><div class="input-group mb-3"><img id='fotoBarang' class='foto' src='${CONFIG.BASE_URL}uploads/foto/${result.foto}' width='50' alt='${result.message}' title='Lihat foto - ${result.kode}'></img></div>`;
						this._notification(`${result.message}`, 'success');
						document.getElementById('openCamera').disabled = true;
					}
				}
			} else {
				this._notification('Foto belum dicapture!', 'error');
				e.stopPropagation();
			}
		}
		document.getElementById('btnDone').addEventListener('click', eventSaveFoto);
	},

	async _setPrice(idHtml) {
		FormatCurrency.initialCurrency({
			elmId: `${idHtml}`
		})
	},

	async _initFormatCurrency() {
		await this._setPrice('ongkosBikin');
		await this._setPrice('hargaBarang');
		await this._setPrice('grandTotal');
		await this._setPrice('bayar');
		await this._setPrice('kembali');
	},

	async _setFaktur() {
		const faktur = await apiPenjualan.getFaktur();
		document.getElementById('nota').value = faktur.data;
	},

	_setDate() {
		document.getElementById("tanggal").value = ApiSettingApps.todayDate();
	},

	_setDefault() {
		document.getElementById('barcodeBarang').focus();
		document.getElementById('colButtonMarkup').style.display = 'block';
		document.getElementById('markupHarga').value = 0;
		document.getElementById('colMarkup').style.display = 'none';
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

	async _giveEventAddPelanggan() {
		const evenAddPelanggan = async (e) => {
			e.preventDefault();
			const result = await apiPelanggan.addPelanggan(new FormData(document.getElementById('form-add-pelanggan')));
			if (result === '200') {
				let oTable = $('#tablePelanggan').dataTable();
				oTable.fnDraw(false);
				document.getElementById('form-add-pelanggan').reset();
				this._autoKodePelanggan();
			} else {
				this._notification('Maaf Ada masalah Didalam Server ...', 'error');
			}
		}
		document.getElementById('form-add-pelanggan').addEventListener('submit', evenAddPelanggan);
	},

	async _showMaster() {
		tableBarang = await $('#tableBarang').DataTable({
			"processing": true,
			"destroy": true,
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			"serverSide": true,
			"ajax": {
				"url": `${API_ENDPOINT.LIST_BARANG_INSTOK}`,
				"type": "POST"
			},
			lengthChange: false,
			"columnDefs": [{
				"targets": -1,
				"orderable": false,
				"data": null,
				"defaultContent": `<button class='btn btn-primary btn-sm' id='addBarang'><i class='fas fa-check'></i> pilih</button>`
			},
			{
				"targets": [0],
				"visible": true,
				"searchable": false
			},
			{
				"targets": [6],
				"visible": false,
				"searchable": false
			}
			]
		});

		await $('#tablePelanggan').DataTable({
			"processing": true,
			"destroy": true,
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			"serverSide": true,
			"ajax": {
				"url": `${API_ENDPOINT.LIST_PELANGGAN}`,
				"type": "POST"
			},
			lengthChange: false,
			"columnDefs": [{
				"targets": -1,
				"orderable": false,
				"data": null,
				"defaultContent": `<button class='btn btn-primary btn-sm' id='addPelanggan'><i class='fas fa-check'></i> pilih</button>`
			},
			{
				"targets": [0],
				"visible": false,
				"searchable": false
			},
			]
		});
		document.getElementById("kembali").disabled = true;
	},

	async _show() {
		let table = await $('#tablePenjualanDetail').DataTable({
			"processing": true,
			"ordering": false,
			"destroy": true,
			"searching": false,
			"bInfo": false,
			"bPaginate": false,
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			"serverSide": true,
			"ajax": {
				"url": `${API_ENDPOINT.LIST_PENJUALAN_DETAIL(document.getElementById('kasir-id').value)}`,
				"type": "POST"
			},
			lengthChange: false,
			"columnDefs": [{
				"targets": -1,
				"data": null,
				"defaultContent": `<div style="display:flex"><button class='btn btn-danger btn-sm btn-circle' id='delete'><i class='fas fa-trash'></i></button></div>`
			},
			{
				"targets": [0, 10],
				"visible": false
			},
			{
				"targets": 9,
				"data": "img",
				"render": function (data, type, row) {
					let condition = '';
					if (row[9] !== null) {
						condition = `<img id='foto' class='foto' src='${CONFIG.BASE_URL}uploads/foto/${row[9]}' width='50' alt='${row[9]}' title='Lihat foto - ${row[2]}'</img>`
					} else {
						condition = `Tidak ada`;
					}
					return `${condition}`
				},
			},
			{
				"targets": 6,
				"render": function (data, type, row, meta) {
					return `<input type='number' class='form-control hargaDetail' id='harga${row[1]}' style='width:100px' value='${data}'/>`;
				}
			},
			{
				"targets": 7,
				"render": function (data, type, row, meta) {
					return `<input type='number' class='form-control ongkosDetail' id='ongkos${row[1]}' style='width:100px' value='${data}'/>`;
				}
			}
			],
			"drawCallback": function (settings) {
				$(".ongkosDetail").on("keypress", function (e) {
					if (e.which == 13) {
						var $row = $(this).parents("tr");
						var data = table.row($row).data();
						data[7] = $(this).val();
						const status = apiPenjualan.updateDetail({
							kodeBarang: data[1],
							ongkos: reformatCurrency(data[7]),
							harga: reformatCurrency(data[6]),
							berat: data[4]
						});
						if (status) {
							swal.fire({
								title: 'Sukses',
								text: 'Ongkos berhasil diperbarui',
								icon: 'success',
								showConfirmButton: false,
								timer: 2000
							});
							document.getElementById('refresh').click();
						}
						document.getElementById("barcodeBarang").focus()
					}

				}),
					$(".hargaDetail").on("keypress", function (e) {
						if (e.which == 13) {
							var $row = $(this).parents("tr");
							var data = table.row($row).data();
							data[6] = $(this).val();
							const status = apiPenjualan.updateDetail({
								kodeBarang: data[1],
								ongkos: reformatCurrency(data[7]),
								harga: reformatCurrency(data[6]),
								berat: data[4]
							});
							if (status) {
								swal.fire({
									title: 'Sukses',
									text: 'Harga berhasil diperbarui',
									icon: 'success',
									showConfirmButton: false,
									timer: 2000
								});
								document.getElementById('refresh').click();
							}
						}
					})
			},

			"footerCallback": function (row, data, start, end, display) {
				var api = this.api(),
					data;

				// Remove the formatting to get integer data for summation
				var intVal = function (i) {
					return typeof i === 'string' ?
						i.replace(/[\$,.]/g, '') * 1 :
						typeof i === 'number' ?
							i : 0;
				};

				// Total over all pages
				let total = api
					.column(8)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				let ongkos = api
					.column(7)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				beratTotal = api
					.column(4)
					.data()
					.reduce(function (a, b) {
						let result = (parseFloat(a) + parseFloat(b));
						// let result = (a) + (b);
						return Math.round(result * 100) / 100;
					}, 0);

				point = 0;
				for (let i = 0; i < Math.round(beratTotal);) {
					(++i % _pointMember ? i : point++)
				}
				document.getElementById('lblBeratTotal').innerHTML = beratTotal;
				document.getElementById('getPoint').innerHTML = ` (+${point} points)`;
				document.getElementById('lblSubtotal').innerHTML = 'Rp. ' + joinCurrency(total);
				document.getElementById('lblOngkos').innerHTML = 'Rp. ' + joinCurrency(ongkos);
				document.getElementById('lblTotal').innerHTML = 'Rp. ' + joinCurrency(total + ongkos);
				document.getElementById('bayar').value = 'Rp. ' + joinCurrency(total + ongkos);
				document.getElementById('grandTotal').value = 'Rp. ' + joinCurrency(total + ongkos);
			}
		});

		await this._initialDelete();
		document.getElementById("kembali").disabled = true;
		document.getElementById("openBayarJual").addEventListener('click', function () {
			$('#modalBayar').on('shown.bs.modal', function () {
				$('#bayar').focus();
			});
		});
	},

	async _refreshDetailPenjualan() {
		document.getElementById('refresh').addEventListener('click', async () => {
			await this._show();
		});
	},

	async _autoKodePelanggan() {
		const kode = await apiPelanggan.getKodePelanggan();
		document.getElementById('kode_pelanggan').value = kode.data;
	},

	async _initialDelete() {
		$('#tablePenjualanDetail tbody').on('click', '#delete', function () {
			const table = $('#tablePenjualanDetail').DataTable();
			let data = table.row($(this).parents('tr')).data();

			swal.fire({
				title: 'Hapus',
				html: "Anda ingin menghapus data ini? <br> <strong>Keterangan Barang </strong>: " + data[3],
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Ya, Hapus!'
			}).then(async (result) => {
				if (result.value) {
					const valueHarga = data[6].split('.').join('') - data[10];
					const status = await apiPenjualan.deleteDetail({
						id: data[11],
						user_id: document.getElementById('kasir-id').value,
						kodeBarang: data[1],
						harga_asal: valueHarga,
						foto: data[9],
					});
					if (status) {
						swal.fire({
							title: 'Hapus',
							text: 'Data berhasil dihapus',
							icon: 'success',
							showConfirmButton: false,
							timer: 2000
						});
						//refres manual 
						let oTable = $('#tablePenjualanDetail').dataTable();
						oTable.fnDraw(false);
						$(this).parents('tr').fadeOut(300);
						document.getElementById('barcodeBarang').focus();
					}
				};
			});
		});
	},

	async _syncData() {
		this._show();
	},

	async _eventShowCredits() {

		const eventCredits = async () => {
			const pembayaran = document.getElementById('pilih_pembayaran').value;
			if (pembayaran == 1) {
				document.getElementById('jatuhTempo').innerHTML = '';
				document.getElementById("bayar").value = document.getElementById("grandTotal").value;
			} else if (pembayaran == 2) {
				document.getElementById('jatuhTempo').innerHTML = `<label for="tempo" class="col-sm-3 col-form-label">Jatuh Tempo</label>
				<div class="col-sm-9">
				<input type="date" class="form-control" id="tempo" value='' required>
				</div>`;
				document.getElementById("bayar").value = 0;
			}
		}
		document.getElementById('pilih_pembayaran').addEventListener('change', eventCredits);
	},

	async _showBarang() {
		document.getElementById('pilihBarang').addEventListener('click', () => {
			let oTable = $('#tableBarang').dataTable();
			oTable.fnDraw(false);
			this._setDefault();
			$('#modalBarang').on('shown.bs.modal', function () {
				const addBarang = document.getElementById('addBarang');
				if (addBarang !== null) {
					document.getElementById('addBarang').focus();
				}
			});
		});
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
		document.getElementById('openCamera').addEventListener('click', () => {
			if (document.getElementById('barcodeBarang').value == '') {
				this._notification('Barcode Barang Tidak Boleh Kosong!', 'error')
			} else {
				$('#modalCamera').modal('show');
			}
		});
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

	async _initScanBarcode() {
		document.getElementById('scanBarcode').addEventListener('click', () => {
			$('#modalScanBarcode').modal('show');
		});

		function onScanSuccess(qrCodeMessage) {
			document.getElementById('barcodeBarang').value = qrCodeMessage;
			$('#modalScanBarcode').modal('hide');
			document.getElementById('showBarang').click();
		}

		// function onScanFailure(error) {
		// 	alert("Barcode Sulit Terbaca - " + error);
		// }

		var html5QrcodeScanner = new Html5QrcodeScanner(
			"viewScanBarcode", {
			fps: 25,
			qrbox: 300
		});
		html5QrcodeScanner.render(onScanSuccess);
	},

	async _turnOnFlashLight() {
		const SUPPORTS_MEDIA_DEVICES = 'mediaDevices' in navigator;

		const constraintsOn = {
			width: {
				min: 640,
				ideal: 1280
			},
			height: {
				min: 480,
				ideal: 720
			},
			advanced: [{
				width: 1920,
				height: 1280
			},
			{
				aspectRatio: 1.333
			},
			{
				torch: true
			}
			]
		};
		const constraintsOff = {
			width: {
				min: 640,
				ideal: 1280
			},
			height: {
				min: 480,
				ideal: 720
			},
			advanced: [{
				width: 1920,
				height: 1280
			},
			{
				aspectRatio: 1.333
			},
			{
				torch: false
			}
			]
		};


		if (SUPPORTS_MEDIA_DEVICES) {
			//Get the environment camera (usually the second one)
			let navig = await navigator.mediaDevices.enumerateDevices().then(devices => {

				const cameras = devices.filter((device) => device.kind === 'videoinput');

				if (cameras.length === 0) {
					throw 'No camera found on this device.';
				}
				const camera = cameras[cameras.length - 1];

				// Create stream and get video track
				navigator.mediaDevices.getUserMedia({
					video: {
						deviceId: camera.deviceId,
						facingMode: ['user', 'environment'],
						height: {
							ideal: 1080
						},
						width: {
							ideal: 1920
						}
					}
				}).then(stream => {
					const track = stream.getVideoTracks()[0];
					//Create image capture object and get camera capabilities
					const imageCapture = new ImageCapture(track)
					const photoCapabilities = imageCapture.getPhotoCapabilities().then(() => {

						//todo: check if camera has a torch

						//let there be light!
						const checkFlash = document.getElementById('onFlash');
						checkFlash.addEventListener('click', function () {
							const valueChecked = checkFlash.checked ? 1 : 0;
							console.log(valueChecked);
							if (valueChecked == 1) {
								track.applyConstraints(constraintsOn)
							} else {
								track.applyConstraints(constraintsOff)
							}
						});
					});
				});
			});
		}
	},

	async _chooseEvent() {
		const swicthPasar = document.getElementById('switch-harga-pasar');
		const settings = await ApiSettingApps.getSettingApps();
		$('#tableBarang tbody').on('click', '#addBarang', async function () {
			var urlReplace = "#/penjualan";
			history.pushState(null, null, urlReplace);
			const valueChecked = swicthPasar.checked ? 1 : 0;
			let data = tableBarang.row($(this).parents('tr')).data();
			$('#idBarang').val(data[0]);
			$('#barcodeBarang').val(data[1]);
			$('#keteranganBarang').val(data[2]);
			if (valueChecked === 1) {
				$('#hargaBarang').val(await FormatCurrency.setValue(settings.harga_pasar));
			} else {
				$('#hargaBarang').val(await FormatCurrency.setValue(data[7]));
			}
			const checkFoto = await apiPenjualan.checkFoto(data[1]);
			document.getElementById('imgView').innerHTML = `<label>Foto</label><div class="input-group mb-3">${checkFoto != null ? `<img id='fotoBarang' class='foto' src='${CONFIG.BASE_URL}uploads/foto/${checkFoto}' width='50' alt='${checkFoto}' title='Lihat foto - ${data[2]}'></img>` : `TIdak ada`}</div>`;
			document.getElementById('openCamera').disabled = data[8] != null ? true : false;
			$('#modalBarang').modal('hide');
			var modal = document.getElementById('imageModal');
			var modalImg = document.getElementById("imageView");
			var captionText = document.getElementById("caption");
			document.getElementById("fotoBarang").addEventListener('click', async () => {
				console.log("test")
				let barang = document.getElementById("fotoBarang");
				modal.style.display = "block";
				modalImg.src = barang.src;
				modalImg.alt = barang.alt;
				captionText.innerHTML = barang.alt;
			})
			modal.addEventListener('click', async () => {
				imageView.className += " out";
				setTimeout(function () {
					modal.style.display = "none";
					imageView.className = "imgModal";
				}, 400);
			});
			$('#modalBarang').on('hidden.bs.modal', function (e) {
				document.activeElement.blur();
				$('#ongkosBikin').focus();
			})
		});

		$('#tablePelanggan tbody').on('click', '#addPelanggan', async function () {
			const table = $('#tablePelanggan').DataTable();
			let data = table.row($(this).parents('tr')).data();
			$('#namaPelanggan').val(data[2]);
			$('#idPelanggan').val(data[0]);
			$('#modalPelanggan').modal('hide');
		});
	},

	async _setImageView() {
		var modal = document.getElementById('imageModal');
		var modalImg = document.getElementById("imageView");
		var captionText = document.getElementById("caption");
		document.getElementById("fotoBarang").addEventListener('click', async () => {
			let barang = document.getElementById("fotoBarang");
			modal.style.display = "block";
			modalImg.src = barang.src;
			modalImg.alt = barang.alt;
			captionText.innerHTML = barang.alt;
		})
		modal.addEventListener('click', async () => {
			imageView.className += " out";
			setTimeout(function () {
				modal.style.display = "none";
				imageView.className = "imgModal";
			}, 400);
		})
	},

	async _setImageViewDatatable() {
		var modal = document.getElementById('imageModal');
		var modalImg = document.getElementById("imageView");
		var captionText = document.getElementById("caption");
		$('#tablePenjualanDetail tbody').on('click', '.foto', function () {
			modal.style.display = "block";
			modalImg.src = this.src;
			modalImg.alt = this.alt;
			captionText.innerHTML = this.alt;
		})
		modal.addEventListener('click', async () => {
			imageView.className += " out";
			setTimeout(function () {
				modal.style.display = "none";
				imageView.className = "imgModal";
			}, 400);
		})
	},

	async _markupHarga() {
		document.getElementById('btnMarkup').addEventListener('click', async () => {
			document.getElementById('colButtonMarkup').style.display = 'none';
			document.getElementById('colMarkup').style.display = 'block';
			await this._setPrice('markupHarga');
		});
	},

	async _initialPayment() {
		const eventBayar = async () => {
			let grandTotal = await FormatCurrency.getValue(document.getElementById('grandTotal').value);
			let payValue = await FormatCurrency.getValue(document.getElementById('bayar').value);
			let exchange = payValue - grandTotal;
			document.getElementById('kembali').value = await FormatCurrency.setValue(exchange);

			if (parseInt(exchange) < 0) {
				document.getElementById('kembali').value = await FormatCurrency.setValue('0');
			}
		}


		const eventTransaction = async (e) => {
			e.preventDefault();
			let grandTotal = await FormatCurrency.getValue(document.getElementById('grandTotal').value);
			if (grandTotal == 0) {
				this._notification(`Jumlah Pembayaran Belum Ada!`, 'warning');
			} else {
				try {
					let payValue = await FormatCurrency.getValue(document.getElementById('bayar').value);
					let exchange = payValue - grandTotal;
					let statusTransaction = document.getElementById('pilih_pembayaran').value;
					let faktur = document.getElementById('nota').value;
					let tempo = null;
					if (parseInt(exchange) < 0 && statusTransaction === '1') {
						throw ' Maaf Bayaran Anda Kurang :) '
					} else if (statusTransaction === '2') {
						tempo = document.getElementById('tempo').value;
					}
					const result = await apiPenjualan.transactionsPayment({
						faktur: faktur,
						pelanggan_id: document.getElementById('idPelanggan').value,
						date: document.getElementById('tanggal').value,
						pemasukan: grandTotal,
						grand_total: grandTotal,
						bayar: payValue,
						kembali: exchange,
						user_id: document.getElementById('kasir-id').value,
						status_bayar: document.getElementById('pilih_pembayaran').value,
						tempo: tempo,
						point: point,
					});
					this._notification(`Transaksi Berhasil`, 'success');
					/* -print-faktur- */
					await this._printFaktur(faktur);
					await this._setFaktur();
				} catch (error) {
					this._notification(`${error}`, 'error');
				}
			}

			document.getElementById('bayar').addEventListener('keyup', eventBayar);
			document.getElementById('transaksi-penjualan').addEventListener('submit', eventTransaction);
		}

		document.getElementById('bayar').addEventListener('keyup', eventBayar);
		document.getElementById('transaksi-penjualan').addEventListener('submit', eventTransaction)
	},

	async _printFaktur(faktur) {
		await $('#modalBayar').modal('hide');
		$('#modalBayar').on('hidden.bs.modal', function (e) {
			document.activeElement.blur();
			$('.swal2-confirm').focus();
		});
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
				// $('#modalPrint').modal('show');
				await PrintInitiator.initPenjualanNew(faktur)
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

	async _reset() {
		$('#tablePenjualanDetail').empty();
		document.getElementById('kasir-id').value = '';
		$('#modalBayar').modal('hide');
		document.getElementById('transaksi-penjualan').reset();
		document.getElementById('form-pilih-barang').reset();
		document.getElementById('jatuhTempo').innerHTML = '';
		document.getElementById('imgView').innerHTML = ``;
		document.getElementById("bayar").disabled = false;
		this._setDefault();
		this._setDate();
		this._isAdminLogin();
		this._isStateKasir();
		await this._showMaster();
		await this._showBarang();
		document.getElementById('barcodeBarang').focus();
	},

	_setInitModal() {
		$('#modalBayar').on('shown.bs.modal', function () {
			var urlReplace = "#" + $(this).attr('id');
			history.pushState(null, null, urlReplace);
		});

		$('#modalBarang').on('shown.bs.modal', function () {
			var urlReplace = "#" + $(this).attr('id');
			history.pushState(null, null, urlReplace);
		});

		$('#modalPelanggan').on('shown.bs.modal', function () {
			var urlReplace = "#" + $(this).attr('id');
			history.pushState(null, null, urlReplace);
		});

		// $(window).on('popstate', function () {
		// 	if ($("#modalPelanggan:visible").length){
		// 		$("#modalPelanggan").eq($("#modalPelanggan:visible").length-1).modal('hide');
		// 		window.location.hash = '/penjualan';
		// 		setTimeout(() => {
		// 			$('#modalBayar').modal('show');
		// 		}, 500);
		// 	}
		// 	if ($("#modalBayar:visible").length){
		// 		$("#modalBayar").eq($("#modalBayar:visible").length-1).modal('hide');
		// 	}
		// 	if ($("#modalBarang:visible").length){
		// 		$("#modalBarang").eq($("#modalBarang:visible").length-1).modal('hide');
		// 	}
		// });


	}


}

export default dataTablePenjualanInitiator;
