import API_ENDPOINT from '../../config/globals/endpoint.js';
import apiQuantity from '../../api/data-quantity.js';
import apiPelanggan from '../../api/datapelanggan.js';
import FormatCurrency from '../../utils/initial-currency.js';
import FakturInitiator from '../utils/initial_faktur.js'
import ApiLogin from '../../api/data-login.js';
import ApiUser from '../../api/data-user.js';
import ApiSettingApps from '../../api/data-setting-apps.js';

let tableBarang;

const dataTableQuantityInitiator = {

	async init() {
		this._setDefault();
		this._giveEventGetBarang();
		await this._showMaster();
		await this._showBarang();
		await this._setFaktur();
		await this._eventShowCredits();
		await this._giveEventDetail();
		await this._giveEventAddPelanggan();
		await this._initialPayment();
		this._initFormatCurrency();
		this._setDate();
		this._chooseEvent();
		this._markupHarga();
		this._giveEventLogin();
		this._autoKodePelanggan();
		await this._renderUsername();
		this._isAdminLogin();
		this._isStateKasir();
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
		document.getElementById('qty').disabled = true
		document.getElementById('colButtonMarkup').disabled = true
		document.getElementById('submit-add-barang').disabled = true
		document.getElementById('pilihBarang').disabled = true

	},

	_unDisabled() {
		document.getElementById('barcodeBarang').disabled = false
		document.getElementById('qty').disabled = false
		document.getElementById('colButtonMarkup').disabled = false
		document.getElementById('submit-add-barang').disabled = false
		document.getElementById('pilihBarang').disabled = false

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
					document.getElementById('barcodeBarang').focus();
					this._notification('Berhasil Mengganti Kasir', 'success', true);
					await this._syncData();
				} else {
					this._notification('Password Salah', 'error', true);
					$('#tableQuantityDetail').empty();
				}
				document.getElementById('change-kasir').reset();
			}
		}
		document.getElementById('change-kasir').addEventListener('submit', eventLogin);
	},

	async _giveEventGetBarang() {
		const getBarangRow = async () => {
			const valueBarcode = document.getElementById('barcodeBarang').value;
			const result = await apiQuantity.getBarangRowQuantity(valueBarcode);
			if (result != null) {
				document.getElementById('idBarang').value = result.id;
				document.getElementById('keteranganBarang').value = result.nama_barang;
				document.getElementById('hargaBarang').value = await FormatCurrency.setValue(result.harga_jual);
				document.getElementById('qty').value = 1;
			} else {
				this._notification(`Data barang ${valueBarcode} tidak ditemukan!`, 'error', true)
				document.getElementById("barcodeBarang").value = '';
			}
		}

		document.getElementById('barcodeBarang').addEventListener('change', getBarangRow)
	},

	async _giveEventDetail() {
		const eventDetail = async (e) => {
			e.preventDefault();
			const valueBarcode = document.getElementById('barcodeBarang').value;
			const result = await apiQuantity.getBarangRowQuantity(valueBarcode);
			if (result != null) {
				const result = await apiQuantity.addDetail({
					user_id: document.getElementById('kasir-id').value,
					idBarang: document.getElementById('idBarang').value,
					kodeBarang: document.getElementById('barcodeBarang').value,
					harga: await FormatCurrency.getValue(document.getElementById('hargaBarang').value),
					markupHarga: await FormatCurrency.getValue(document.getElementById('markupHarga').value),
					qty: document.getElementById('qty').value,
				});
				if (result.status == false) {
					this._notification(`${result.message}`, 'error', true);
				}
				this._setDefault();
				await this._syncData();
				document.getElementById('form-pilih-barang').reset();
			}
		}
		setTimeout(() => {
			document.getElementById('form-pilih-barang').addEventListener('submit', eventDetail);
		}, 1000);
	},

	async _setPrice(idHtml) {
		FormatCurrency.initialCurrency({
			elmId: `${idHtml}`
		})
	},

	async _initFormatCurrency() {
		await this._setPrice('hargaBarang');
		await this._setPrice('grandTotal');
		await this._setPrice('bayar');
		await this._setPrice('kembali');
	},

	async _setFaktur() {
		const faktur = await apiQuantity.getFaktur();
		document.getElementById('nota').value = faktur.data;
	},

	_setDate() {
		document.getElementById("tanggal").value = ApiSettingApps.todayDate();
	},

	_setDefault() {
		document.getElementById('colButtonMarkup').style.display = 'block';
		document.getElementById('markupHarga').value = 0;
		document.getElementById('colMarkup').style.display = 'none';
	},

	_notification(msg, status, confirm) {
		swal.fire({
			title: `${status}`,
			text: `${msg}`,
			icon: `${status}`,
			showConfirmButton: confirm,
			confirmButtonColor: '#4fa7f3',
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
				this._notification('Maaf Ada masalah Didalam Server ...', 'error', true);
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
				"url": `${API_ENDPOINT.LIST_BARANG_QUANTITY}`,
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
				"targets": [4, 5, 6, 8],
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
		let table = await $('#tableQuantityDetail').DataTable({
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
				"url": `${API_ENDPOINT.LIST_QUANTITY_DETAIL(document.getElementById('kasir-id').value)}`,
				"type": "POST"
			},
			lengthChange: false,
			"columnDefs": [{
				"targets": -1,
				"data": null,
				"defaultContent": `<div style="display:flex"><button class='btn btn-danger btn-sm btn-circle' id='delete'><i class='fas fa-trash'></i></button></div>`
			},
			{
				"targets": [7, 0],
				"visible": false
			},
			{
				"targets": 5,
				"render": function (data, type, row, meta) {
					return `<input type='number' class='form-control qtyDetail' id='qty${row[1]}' style='width:100px' value='${data}'/>`;
				}
			},
			],
			"drawCallback": function (settings) {
				$(".qtyDetail").on("keypress", function (e) {
					if (e.which == 13) {
						var $row = $(this).parents("tr");
						var data = table.row($row).data();
						data[5] = $(this).val();
						FormatCurrency.getValue(data[4]).then(function (harga) {
							const status = apiQuantity.updateQtyDetail({
								kodeBarang: data[1],
								qty: data[5],
								harga: harga
							});
							if (status) {
								swal.fire({
									title: 'Sukses',
									text: 'Jumlah Qty berhasil diperbarui',
									icon: 'success',
									showConfirmButton: false,
									timer: 2000
								});
								let oTable = $('#tableQuantityDetail').dataTable();
								oTable.fnDraw(false);
								$(this).parents('tr').fadeOut(300);
							}
						})
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
					.column(6)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				function splitCurrency(variable) {
					let reverse = variable.toString().split('').reverse().join(''),
						format = reverse.match(/\d{1,3}/g);
					format = format.join('.').split('').reverse().join('');
					return format
				}
				document.getElementById('lblTotal').innerHTML = 'Rp. ' + splitCurrency(total);
				document.getElementById('bayar').value = 'Rp. ' + splitCurrency(total);
				document.getElementById('grandTotal').value = 'Rp. ' + splitCurrency(total);
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

	async _autoKodePelanggan() {
		const kode = await apiPelanggan.getKodePelanggan();
		document.getElementById('kode_pelanggan').value = kode.data;
	},

	async _initialDelete() {
		$('#tableQuantityDetail tbody').on('click', '#delete', function () {
			const table = $('#tableQuantityDetail').DataTable();
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
					const valueHarga = data[7];
					const status = await apiQuantity.deleteDetail({
						user_id: document.getElementById('kasir-id').value,
						kodeBarang: data[1],
						harga_asal: valueHarga,
						qty: data[5]
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
						let oTable = $('#tableQuantityDetail').dataTable();
						oTable.fnDraw(false);
						$(this).parents('tr').fadeOut(300);
						document.getElementById('barcodeBarang').focus();
					}
				};
			});
		});
	},

	async _syncData() {
		let oTable = $('#tableQuantityDetail').dataTable();
		oTable.fnDraw(false);
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

	async _chooseEvent() {
		$('#tableBarang tbody').on('click', '#addBarang', async function () {
			let data = tableBarang.row($(this).parents('tr')).data();
			$('#idBarang').val(data[0]);
			$('#barcodeBarang').val(data[1]);
			$('#keteranganBarang').val(data[2]);
			$('#hargaBarang').val(await FormatCurrency.setValue(data[7]));
			$('#qty').val(1);
			$('#modalBarang').modal('hide');
		});

		$('#tablePelanggan tbody').on('click', '#addPelanggan', async function () {
			const table = $('#tablePelanggan').DataTable();
			let data = table.row($(this).parents('tr')).data();
			$('#namaPelanggan').val(data[2]);
			$('#idPelanggan').val(data[0]);
			$('#modalPelanggan').modal('hide');
		});
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
			let pelanggan = document.getElementById("namaPelanggan").value;
			if (grandTotal == 0) {
				this._notification(`Jumlah Pembayaran Belum Ada!`, 'warning', false);
			} else {
				try {
					let payValue = await FormatCurrency.getValue(document.getElementById('bayar').value);
					let exchange = payValue - grandTotal;
					let statusTransaction = document.getElementById('pilih_pembayaran').value;
					const faktur = document.getElementById('nota').value;
					let tempo = null;
					if (parseInt(exchange) < 0 && statusTransaction === '1') {
						throw ' Maaf Bayaran Anda Kurang :) '
					} else if (statusTransaction === '2') {
						tempo = document.getElementById('tempo').value;
					}
					const result = await apiQuantity.transactionsPayment({
						faktur: faktur,
						pelanggan_id: document.getElementById('idPelanggan').value,
						date: document.getElementById('tanggal').value,
						pemasukan: grandTotal,
						grand_total: grandTotal,
						bayar: payValue,
						kembali: exchange,
						user_id: document.getElementById('kasir-id').value,
						status_bayar: document.getElementById('pilih_pembayaran').value,
						tempo: tempo
					});
					this._notification(`Transaksi Berhasil`, 'success', false);
					/* -print-faktur- */
					await this._printFaktur(faktur);
					this._setFaktur();
				} catch (error) {
					this._notification(`${error}`, 'error', true);
				}
			}

			document.getElementById('bayar').addEventListener('keyup', eventBayar);
			document.getElementById('transaksi-quantity').addEventListener('submit', eventTransaction);
		}

		document.getElementById('bayar').addEventListener('keyup', eventBayar);
		document.getElementById('transaksi-quantity').addEventListener('submit', eventTransaction)
	},

	async _printFaktur(faktur) {
		await $('#modalBayar').modal('hide');

		$('#modalBayar').on('hidden.bs.modal', function (e) {

			document.activeElement.blur();
			$('.swal2-confirm').focus();
		})
		swal.fire({
			title: 'Cetak Print',
			html: "Apakah anda ingin mencetak data ini? <br> <strong>Keterangan  Faktur</strong>: " + faktur,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Ya, Cetak!'
		}).then(async (result) => {
			if (result.value) {
				$('#modalPrint').modal('show');
				await FakturInitiator.initQuantity(faktur, 'printResultNota', 1);
				await this._reset();
			} else {
				await this._reset();
			};
		});
		await $('#cetakStruk').on('click', async function (event) {
			event.preventDefault()
			event.stopPropagation();
			jQuery('#printResultNota').print();
		});
	},

	async _reset() {
		$('#tableQuantityDetail').empty();
		document.getElementById('kasir-id').value = '';
		$('#modalBayar').modal('hide');
		document.getElementById('transaksi-quantity').reset();
		document.getElementById('form-pilih-barang').reset();
		document.getElementById('jatuhTempo').innerHTML = '';
		document.getElementById("bayar").disabled = false;
		this._setDefault();
		this._setDate();
		this._isAdminLogin();
		this._isStateKasir();
		await this._showMaster();
		await this._showBarang();
	},


}

export default dataTableQuantityInitiator;
