import API_ENDPOINT from '../../config/globals/endpoint.js';
import FormatCurrency from '../../utils/initial-currency.js';
import ApiBeliKembali from '../../api/data-belikembali.js';
import ApiBarang from './../../api/data-barang.js';
import CONFIG from '../../config/globals/config.js';
import FakturInitiator from '../utils/initial_faktur.js'
import ApiUser from '../../api/data-user.js';
import ApiLogin from '../../api/data-login.js';
import ApiPelanggan from '../../api/datapelanggan.js';
import ApiSettingApps from '../../api/data-setting-apps.js';

function padLeadingZeros(num, size) {
	var s = num + "";
	while (s.length < size) s = "0" + s;
	return s;
}

let tableBarang;
let getDetailPenjualan;

const BeliKembaliInitiator = {

	async init() {
		// this._modalSync('#modalBarang');
		this._giveEventGetDetail();
		await this._showBarang();
		await this._showMaster();
		this._chooseEvent();
		this._autoKodePelanggan();
		await this._giveEventAddPelanggan();
		await this._initialPayment();
		await this._setDefault();
		this._initialShowBarang();
		this._setDate();
		this._syncData();
		await this._renderUsername();
		await this._giveEventLogin();
		this._initForSubmit();
		this._isAdminLogin();
		this._isStateKasir();
		this._initAddTransaction();
		this._initFormatCurrency();
	},

	async _setPrice(idHtml) {
		FormatCurrency.initialCurrency({
			elmId: `${idHtml}`
		})
	},

	async _initFormatCurrency() {
		await this._setPrice('harga_nota');
		await this._setPrice('potongan');
		await this._setPrice('servis');
	},

	async _modalSync(modalName) {
		$(`${modalName}`).on('shown.bs.modal', function () {
			var urlReplace = "#" + $(this).attr('id');
			history.pushState(null, null, urlReplace);
		});
		$(window).on('popstate', function () {
			if ($(`${modalName}:visible`).length) {
				$(`${modalName}`).eq($(`${modalName}:visible`).length - 1).modal('hide');
			}
		});
	},

	_isAdminLogin() {
		let level = document.getElementById('level-user').value;
		if (level == 1 || level == 6) {
			document.getElementById('kasir-id').value = level;
			document.getElementById('kasir-name').innerHTML = `<b>${(level == 6) ? 'Owner' : 'Admin'}</b> - ${$('#nama-user').html()}`;
			document.getElementById('username').disabled = true;
			document.getElementById('password').disabled = true;
			document.getElementById('kodeBarang').focus();
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
			if (data[3] !== 'admin' && data[3] !== 'owner') {
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

	_initAddTransaction() {
		document.getElementById("openBayarBuyback").addEventListener('click', () => {
			$('#modalBayar').on('shown.bs.modal', function () {
				$('#fakturBuyback').focus();
			});
		});
	},

	_disabled() {
		document.getElementById('openBayarBuyback').disabled = true
		document.getElementById('kodeBarang').disabled = true
		document.getElementById('pilihBarang').disabled = true
	},

	_unDisabled() {
		document.getElementById('openBayarBuyback').disabled = false
		document.getElementById('kodeBarang').disabled = false
		document.getElementById('pilihBarang').disabled = false
	},

	async _showBarang() {
		document.getElementById('pilihBarang').addEventListener('click', () => {
			let oTable = $('#tableBarang').dataTable();
			oTable.fnDraw(false);
			$('#modalBarang').on('shown.bs.modal', function () {
				const addBarang = document.getElementById('addBarang');
				if (addBarang !== null) {
					document.getElementById('addBarang').focus();
				}
			});
		});
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
				"url": `${API_ENDPOINT.LIST_BARANG}`,
				"data": {
					status: 3
				},
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
	},

	async _autoKodePelanggan() {
		const kode = await ApiPelanggan.getKodePelanggan();
		document.getElementById('kode_pelanggan').value = kode.data;
	},

	async _giveEventAddPelanggan() {
		const evenAddPelanggan = async (e) => {
			e.preventDefault();
			const result = await ApiPelanggan.addPelanggan(new FormData(document.getElementById('form-add-pelanggan')));
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

	async _chooseEvent() {
		$('#tableBarang tbody').on('click', '#addBarang', async function () {
			var urlReplace = "#/buyback-oldstok";
			history.pushState(null, null, urlReplace);
			let data = tableBarang.row($(this).parents('tr')).data();
			$('#kodeBarang').val(data[1]);
			$('#modalBarang').modal('hide');
			getDetailPenjualan();
		});

		$('#tablePelanggan tbody').on('click', '#addPelanggan', async function () {
			const table = $('#tablePelanggan').DataTable();
			let data = table.row($(this).parents('tr')).data();
			$('#namaPelanggan').val(data[2]);
			$('#idPelanggan').val(data[0]);
			$('#modalPelanggan').modal('hide');
		});

		document.getElementById("newKodeBarang").addEventListener('click', () => {
			document.getElementById('kodeBarang').focus();
		})
	},

	_giveEventLogin() {
		const eventLogin = async (e) => {
			e.preventDefault();
			const isLogin = await ApiLogin.LoginKasir({
				username: document.getElementById('username').value,
				password: document.getElementById('password').value,
			});

			if (isLogin.status == false) {
				this._notification('Username tidak ditemukan!', 'error', true);
			} else {
				if (isLogin.aunteticated === true || isLogin.status === 'MASUK') {
					document.getElementById('kasir-id').value = `${isLogin.userID}`;
					document.getElementById('kasir-name').innerHTML = `<b>${isLogin.nama}</b>`;
					this._isStateKasir();
					document.getElementById('kodeBarang').focus();
					this._notification('Berhasil Mengganti Kasir', 'success', true);
					await this._syncData();
				} else {
					this._notification('Password Salah', 'error', true);
					$('#tablePenjualanDetail').empty();
				}
				document.getElementById('change-kasir').reset();
			}
		}
		document.getElementById('change-kasir').addEventListener('submit', eventLogin);
	},

	async _setImageView() {
		var modal = document.getElementById('imageModal');
		var modalImg = document.getElementById("imageView");
		var captionText = document.getElementById("caption");
		$('.foto').on('click', function () {
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

	_setDate() {
		document.getElementById("tanggal").value = ApiSettingApps.todayDate();
	},

	async _setTotal() {
		const total = await ApiBeliKembali.getTotal();
		if (total != 0) {
			document.getElementById('grandTotal').value = await FormatCurrency.setValue(total);
			document.getElementById('total').innerHTML = '-' + await FormatCurrency.setValue(total);
		} else {
			document.getElementById('grandTotal').value = 0;
			document.getElementById('total').innerHTML = 0;
		}
	},

	async _setDefault() {
		let dataCache = localStorage.getItem('beli_kembali_data_lama');
		if (dataCache != null) {
			document.getElementById('fakturBuyback').value = dataCache;
			const valueKode = dataCache.replace("", "")
			const result = await ApiBeliKembali.checkBarangJual(valueKode);
			if (result.status) {
				await this._setTotal();
				await this._renderPenjualanDetail(result);
			} else {
				await this._setTotal();
			}
		} else {
			document.getElementById('fakturBuyback').value = dataCache;
		}
	},

	async _giveEventGetDetail() {
		getDetailPenjualan = async () => {
			const condBarcode = document.getElementById('kodeBarang').value;
			if (condBarcode.length < 8) {
				document.getElementById("kodeBarang").value = condBarcode.substr(0, 1) + padLeadingZeros(condBarcode.substr(1, 7), 7);
			}
			const valueKode = document.getElementById('kodeBarang').value;
			let elmLoading = ``;
			if (valueKode != '') {
				const result = await ApiBeliKembali.checkBarangJual(valueKode);
				elmLoading = `<div class="spinner-border text-primary" style="width: 2rem; height: 2rem;" role="status">
				<span class="sr-only">Loading...</span></div>`;
				if (result.status) {
					this._renderPenjualanDetail(result.data)
					elmLoading = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
					<circle class="path circle" fill="none" stroke="#73AF55" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1"/>
					<polyline class="path check" fill="none" stroke="#73AF55" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 "/>
					</svg>
					<span class="success">Data Barang Terdaftar!</span>`;
				} else {
					this._notification('Data barang tidak tersedia atau sudah terjual!', 'error', false)
					elmLoading = ``;
				}
			} else {
				this._notification('Kode barang tidak boleh kosong!', 'error', false)
				elmLoading = ``;
			}

			document.getElementById("loading_check").innerHTML = elmLoading;
		}

		const barcodeToUpper = async () => {
			const condBarcode = document.getElementById('kodeBarang').value;
			document.getElementById("kodeBarang").value = condBarcode.toUpperCase();
		}

		document.getElementById('kodeBarang').addEventListener('input', barcodeToUpper)
		document.querySelector('#kodeBarang').addEventListener('keypress', function (e) {
			if (e.key === 'Enter') {
				getDetailPenjualan();
			}
		});
	},

	async _renderPenjualanDetail(result) {
		const data = result
		let fakturValue;
		const faktur = await ApiBeliKembali.getFakturOldstok();
		if (faktur != false) {
			fakturValue = faktur.data;
			document.getElementById("fakturBuyback").value = faktur.data;
		}
		await this._addDetailBuyback({
			notaPenjualan: fakturValue,
			idBarang: data.id_barang,
			kodeBarang: data.kode_barang,
			userIdValue: document.getElementById('user-id').value,
			hargaBeliValue: data.total,
			beratValue: data.berat,
			biayaServisValue: 0,
			potonganValue: data.potongan,
			status: 1,
		});
		this.setCacheProcess(fakturValue)
		await this._setDefault();
		document.getElementById("kodeBarang").value = null;
		window.scrollTo(0, document.body.scrollHeight);
	},

	async _addDetailBuyback({
		notaPenjualan,
		idBarang,
		kodeBarang,
		userIdValue,
		hargaBeliValue,
		beratValue,
		biayaServisValue,
		potonganValue,
		status
	}) {
		try {
			const response = await ApiBeliKembali.addDetail({
				notaPenjualan: notaPenjualan,
				idBarang: idBarang,
				kodeBarang: kodeBarang,
				user_id: userIdValue,
				harga_beli: hargaBeliValue,
				berat: beratValue,
				biaya_servis: biayaServisValue,
				potongan: potonganValue,
				status: status
			});

			await this._syncData(userIdValue);
		} catch (error) {
			console.log(error);
		}
	},

	async _destroyDetailPembelian({
		notaPenjualan,
		kodeBarang
	}) {
		try {
			const response = await ApiBeliKembali.destroyDetail({
				notaPenjualan: notaPenjualan,
				kodeBarang: kodeBarang,
			});
			if (response.status) {
				this._notification(`${response.message}`, 'error', true);
			}
			await this._setDefault();
			await this._syncData(document.getElementById('user-id').value);
			return response;
		} catch (error) {
			console.log(error);
		}
	},

	async _syncData(user) {
		const result = await ApiBeliKembali.getPembelianDetail(user);
		let elmHtml = '';
		if (result == null) {
			elmHtml = ``
		} else {
			for (let i = 0; i < result.data.length; i++) {
				elmHtml += `<tr><td> ${result.data[i][0]}  </td>
			<td>${result.data[i][1]}</td>
			<td>${result.data[i][2]}</td>
			<td>
			 ${result.data[i][3] != null ? 
				`<img id='foto-focus' class='foto' src='${CONFIG.BASE_URL}uploads/foto/${result.data[i][3]}' 
				width='50' alt='${result.data[i][3]}' 
				title='Lihat foto - ${result.data[i][2]}'</img>` : result.data[i][3]} </td>
			<td>${result.data[i][4].replace(/,/g, '.')}</td>
			<td>${result.data[i][5]}</td>
			<td>${result.data[i][6]}</td>
			<td>${result.data[i][7]}</td>
			<td>-${result.data[i][8]}</td>
			<td>${result.data[i][9]}</td>
			<td>-${result.data[i][10]}</td>
			<td>${result.data[i][11]}</td>
			<td>
				<button class='btn btn-primary btn-sm btn-circle state-edit' id='edit${result.data[i][0]}'><i class='far fa-edit'></i></button>
				<button class='btn btn-danger btn-sm btn-circle state-delete' id='delete${result.data[i][0]}'><i class='fas fa-trash'></i></button>
			</td>
			</tr>
           `
			}
		}
		document.getElementById('listBuybackOldstokDetail').innerHTML = elmHtml;
		
		const itemPhoto = document.querySelectorAll("#foto-focus");

		for (let i = 0; i < itemPhoto.length; i++) {
			itemPhoto[i].addEventListener("mouseenter", function() {
			itemPhoto[i].className = "foto"
			});
		}

		this._showImage();
		this._updateDetail(result);
		this._deleteDetail(result);
	},

	async _showImage() {
		var modal = document.getElementById('imageModal');
		var modalImg = document.getElementById("imageView");
		var captionText = document.getElementById("caption");
		$('#listBuybackOldstokDetail').on('click', '.foto', function () {
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
		});
	},

	async _updateDetail(result) {
		for (let i = 0; i < result.data.length; i++) {
			document.getElementById(`edit${result.data[i][0]}`).addEventListener('click', async () => {
				$('#modalDetail').modal('show');
				$('#kode_barang').val(result.data[i][0]);
				$('#berat').val(result.data[i][4].replace(/,/g, '.'));
				$('#harga_nota').val(await FormatCurrency.setValue(await FormatCurrency.getValue(result.data[i][6])));
				$('#potongan').val(await FormatCurrency.setValue(await FormatCurrency.getValue(result.data[i][7].split("=")[0])));
				$('#servis').val(await FormatCurrency.setValue(await FormatCurrency.getValue(result.data[i][9])));
				$('#status').val(result.data[i][11]);
				$('#modalDetail').on('shown.bs.modal', function () {
					$('#berat').focus();
				});
			});
		}
	},

	async _initForSubmit() {
		const eventForm = async (e) => {
			e.preventDefault();
			const status = await ApiBeliKembali.updateDetail(new FormData(document.getElementById('detailBuybackForm')));
			if (status === '200') {
				this._notification('Succes Mengedit Data', 'success');
				await this._syncData(document.getElementById('user-id').value);
			} else if (status === '500') {
				this._notification('Maaf Ada masalah Didalam Server Harap Mengisi Dengan Benar...', 'error');
			}
			this._setDefault();
			$('#modalDetail').modal('hide');
			document.getElementById('kodeBarang').focus();
		}
		document.getElementById('detailBuybackForm').addEventListener('submit', eventForm);
	},

	async _deleteDetail(result) {
		for (let i = 0; i < result.data.length; i++) {
			document.getElementById(`delete${result.data[i][0]}`).addEventListener('click', async () => {

				const status = await this._destroyDetailPembelian({
					notaPenjualan: this.getNotaInCache(),
					kodeBarang: result.data[i][0],
				});
				if (status) {
					document.getElementById("kodeBarang").value = "";
					await this._setDefault();
					await this._syncData(document.getElementById('user-id').value);
				}

			});
		}
	},

	async _initialPayment() {
		const eventTransaction = async (e) => {
			e.preventDefault();
			e.stopPropagation();
			let grandTotal = await FormatCurrency.getValue(document.getElementById('grandTotal').value);
			const notaPenjualan = this.getNotaInCache();
			const faktur = document.getElementById('fakturBuyback').value;
			if (faktur == null || faktur == 'null' || faktur == '') {
				this._notification('Nota/faktur transaksi kosong/tidak tersedia!', 'error', false);
			} else {
				try {
					if (grandTotal != 0) {
						await this._changeDataBarang();
						const result = await ApiBeliKembali.transactionsPayment({
							nota: notaPenjualan,
							faktur: faktur,
							date: document.getElementById('tanggal').value,
							pengeluaran: grandTotal,
							grand_total: grandTotal,
							user_id: document.getElementById('user-id').value,
							pelanggan_id: document.getElementById('idPelanggan').value,
						});
						this._notification(`Transaksi berhasil diproses`, 'success', false);
						this.removeCacheProcess();
						await this._printFaktur(faktur);
					} else {
						this._notification(`Belum ada barang dipilih!`, 'error', false);
					}
				} catch (error) {
					console.log(error)
					this._notification(`lengkapi semuanya ya:)`, 'error', false);
				}
			}
		}
		document.getElementById('transaksi-belikembali').addEventListener('submit', eventTransaction);
	},

	async _changeDataBarang() {
		const userId = document.getElementById('user-id').value;
		const result = await ApiBeliKembali.getPembelianDetail(userId);

		await result.data.forEach(async (data) => {
			await ApiBarang.updateDataBarang({
				berat: data[4],
				hargaBeli: await FormatCurrency.getValue(data[6]),
				kode_barang: data[0]
			});
		});
	},

	async _reset() {
		$('#modalBayar').modal('hide');
		document.getElementById('kasir-id').value = '';
		document.getElementById('kasir-name').innerHTML = `<b>???</b>`;
		document.getElementById('fakturBuyback').value = null;
		document.getElementById('kodeBarang').value = null;
		document.getElementById('total').innerHTML = 0;
		await this.init();
	},

	async _resetValue() {
		document.getElementById('fakturBuyback').value = null;
		document.getElementById('kodeBarang').value = null;
	},

	_notification(msg, status, confirm) {
		swal.fire({
			title: `${status}`,
			text: `${msg}`,
			icon: `${status}`,
			confirmButtonColor: '#4fa7f3',
			showConfirmButton: confirm,
			timer: 2000
		})
	},

	setCacheProcess(notaPembelian) {
		let result = this.checkStorage();
		if (result == null) {
			localStorage.setItem('beli_kembali_data_lama', `${notaPembelian}`)
		}
	},

	checkStorage() {
		let storage = localStorage.getItem('beli_kembali_data_lama');
		return storage
	},

	removeCacheProcess() {
		localStorage.removeItem('beli_kembali_data_lama');
	},

	getNotaInCache() {
		let dataCache = localStorage.getItem('beli_kembali_data_lama');
		return dataCache;
	},


	async _initialShowBarang() {
		const eventShowBarang = async (e) => {
			e.preventDefault();
			e.stopPropagation();
		}
		document.getElementById('show-barang').addEventListener('submit', eventShowBarang);
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
				await FakturInitiator.initBuyback(faktur, 'printResultNota', true)
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
}

export default BeliKembaliInitiator;
