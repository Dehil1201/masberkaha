import API_ENDPOINT from '../../config/globals/endpoint.js';
import FormatCurrency from '../../utils/initial-currency.js';
import ApiBeliKembali from '../../api/data-belikembali.js';
import ApiBarang from './../../api/data-barang.js';
import CONFIG from '../../config/globals/config.js';
import UrlParser from '../../routes/url-parser.js';
import FakturInitiator from '../utils/initial_faktur.js'
import ApiUser from '../../api/data-user.js';
import ApiLogin from '../../api/data-login.js';
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
		this._giveEventGetDetail();
		await this._showBarang();
		await this._showMaster();
		this._chooseEvent();
		await this._initialPayment();
		await this._setDefault();
		this._setDate();
		this._syncData();
		this.isStillProcess();
		await this._renderUsername();
		await this._giveEventLogin();
		this._isStateKasir();
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
		document.getElementById('notaPenjualan').disabled = true
		document.getElementById('kodeBarang').disabled = true
		document.getElementById('openBayarBuyback').disabled = true
		document.getElementById('pilihBarang').disabled = true

	},

	_unDisabled() {
		document.getElementById('notaPenjualan').disabled = false
		document.getElementById('kodeBarang').disabled = false
		document.getElementById('openBayarBuyback').disabled = false
		document.getElementById('pilihBarang').disabled = false
	},

	async _showBarang() {
		document.getElementById('pilihBarang').addEventListener('click', () => {
			let oTable = $('#tableBarang').dataTable();
			oTable.fnDraw(false);
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
	},

	async _chooseEvent() {
		$('#tableBarang tbody').on('click', '#addBarang', async function () {
			let data = tableBarang.row($(this).parents('tr')).data();
			$('#kodeBarang').val(data[1]);
			$('#modalBarang').modal('hide');
			getDetailPenjualan();
		});
	},

	_giveEventLogin() {
		const eventLogin = async (e) => {
			e.preventDefault();
			const isLogin = await ApiLogin.LoginKasir({
				username: document.getElementById('username').value,
				password: document.getElementById('password').value,
			});

			if (isLogin.status == false) {
				this._notification('Username tidak ditemukan!', 'error');
			} else {
				if (isLogin.aunteticated === true || isLogin.status === 'MASUK') {

					document.getElementById('kasir-id').value = `${isLogin.userID}`;
					document.getElementById('kasir-name').innerHTML = `<b>${isLogin.nama}</b>`;
					this._isStateKasir();
					document.getElementById('kodeBarang').focus();
					this._notification('Berhasil Mengganti Kasir', 'success');
					await this._syncData();
				} else {
					this._notification('Password Salah', 'error');
					$('#tablePenjualanDetail').empty();
				}
				document.getElementById('change-kasir').reset();
			}
		}
		document.getElementById('change-kasir').addEventListener('submit', eventLogin);

		document.getElementById("openBayarBuyback").addEventListener('click', function () {
			$('#modalBayar').on('shown.bs.modal', function () {
				$('#fakturBuyback').focus();
			});
		});
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
			document.getElementById('total').innerHTML = await FormatCurrency.setValue(total);
		} else {
			document.getElementById('grandTotal').value = 0;
			document.getElementById('total').innerHTML = 0;
		}
	},

	async _setDefault() {
		const valueNota = document.getElementById('notaPenjualan').value;
		const result = await ApiBeliKembali.getPenjualanDetail(valueNota);
		if (result.status != false) {
			this._setTotal();
			await this._renderPenjualanDetail(result);
		} else {
			this._setTotal();
		}
	},

	async _giveEventGetDetail() {
		getDetailPenjualan = async () => {
			const condBarcode = document.getElementById('kodeBarang').value;
			if (condBarcode.length < 8) {
				document.getElementById("kodeBarang").value = condBarcode.substr(0, 1) + padLeadingZeros(condBarcode.substr(1, 7), 7);
			}
			const valueKode = document.getElementById('kodeBarang').value;
			let valueNota = document.getElementById('notaPenjualan').value;
			if (valueKode != '') {
				const result = await ApiBeliKembali.getNotaByKode(valueKode);
				if (result.data == null) {
					if (valueNota == '') {
						this._notification("Kode Barang tidak ada ditransaksi/sudah dijual!", 'error');
						this._resetValue();
						return
					} else {
						document.getElementById('kodeBarang').value = null;
						this._afterScan();
					}
				} else {
					document.getElementById('notaPenjualan').value = result.data;
					this._afterScan();
				}
			} else {
				this._afterScan();
			}
		}
		const barcodeToUpper = async () => {
			const condBarcode = document.getElementById('kodeBarang').value;
			document.getElementById("kodeBarang").value = condBarcode.toUpperCase();
			document.getElementById("notaPenjualan").value = null;
			document.getElementById('listPenjualanDetail').innerHTML = ``;
		}

		document.getElementById('kodeBarang').addEventListener('input', barcodeToUpper)
		document.getElementById('kodeBarang').addEventListener('change', getDetailPenjualan)
		document.getElementById('notaPenjualan').addEventListener('change', getDetailPenjualan)
	},

	async _printFaktur(faktur) {
		await $('#modalBayar').modal('hide');
		$('#modalBayar').on('hidden.bs.modal', function (e) {
			document.activeElement.blur();
			$('.swal2-confirm').focus();
		});
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
				await FakturInitiator.initBuyback(faktur, 'printResultNota', true)
				await this._reset();
			} else {
				await this._reset();
			};
		});

	},

	async _afterScan() {
		const valueNota = document.getElementById('notaPenjualan').value;
		if (valueNota != null) {
			const faktur = await ApiBeliKembali.getFaktur(valueNota);
			if (faktur != false) {
				document.getElementById('fakturBuyback').value = faktur.data;
			}
			const result = await ApiBeliKembali.getPenjualanDetail(valueNota);
			await this._renderPenjualanDetail(result);
		}
	},

	async _renderPenjualanDetail(result) {
		let elmHtml = ``
		if (result.status == false) {
			this._notification(`${result.message}`, 'error');
			elmHtml = ``;
			document.getElementById('notaPenjualan').value = null;
			document.getElementById('fakturBuyback').value = null;
		} else {
			await result.forEach(async (data) => {
				let condition = '';
				let name = '';
				if (data.checkBuyback == 1) {
					name = 'sudah dijual!'
					condition = 'disabled'
				} else {
					name = 'pilih'
				}
				elmHtml += `</tr>
                <td> ${data.kode_barang} </td>
                <td> ${data.jenis_barang} </td>
                <td> ${data.nama_barang} </td>
                <td> ${data.foto != null ? `<img id='foto' class='foto' src='${CONFIG.BASE_URL}uploads/foto/${data.foto}' width='50' alt='${data.foto}' title='Lihat foto - ${data.nama_barang}'</img>` : data.foto} </td>
                <td> <input style="width: 100px;" id="berat${data.id}" class="form-control" type="number" min="0" pattern="[0-9]+([\.,][0-9]+)?" step="0.01" value="${data.berat}"> </td>
                <td> ${data.kadar} </td>
                <td> ${data.total}  </td>
                <td> <input style="width: 120px;" type='text' id='biayaServis${data.id}' value='0' class='form-control' /> </td>
                <td> <input style="width: 120px;" type='text' id='potongan${data.id}' value='${data.potongan}' class='form-control' /> </td>
				<td> <select style="width: 60px;" class="form-control" id="ganti_status${data.id}"><option value="1">1</option><option value="R">R</option><option value="S">S</option></select> </td>
              
                <td> <button id='pilihNotaJual${data.kode_barang}' class='btn btn-primary btn-sm' ${condition}><i class='fas fa-check'></i> ${name}</button> </td>
                </tr>`
			});
		}

		document.getElementById('listPenjualanDetail').innerHTML = elmHtml;
		await this._afterRender(result);
		this._setImageView();
	},

	async _afterRender(result) {
		if (result.status != false) {
			result.forEach(async (data) => {
				await FormatCurrency.initialCurrency({
					elmId: `biayaServis${data.id}`
				})
				await FormatCurrency.initialCurrency({
					elmId: `potongan${data.id}`
				})
				document.getElementById(`pilihNotaJual${data.kode_barang}`).addEventListener('click', async () => {
					let berat = document.getElementById(`berat${data.id}`).value;
					if (berat != 0) {
						await this._addDetailPembelian({
							notaPenjualan: document.getElementById('notaPenjualan').value,
							idBarang: data.id_barang,
							kodeBarang: data.kode_barang,
							userIdValue: document.getElementById('user-id').value,
							hargaBeliValue: await FormatCurrency.getValue(data.total),
							beratValue: berat,
							biayaServisValue: await FormatCurrency.getValue(document.getElementById(`biayaServis${data.id}`).value),
							potonganValue: await FormatCurrency.getValue(document.getElementById(`potongan${data.id}`).value),
							status: document.getElementById(`ganti_status${data.id}`).value,
						});

						document.getElementById('kodeBarang').value = null;
						this.setCacheProcess(document.getElementById('notaPenjualan').value);
					} else {
						this._notification('Silahkan isi berat/susut', 'error');
					}
				})
			});
		}

	},

	async _addDetailPembelian({
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
			if (response.status) {
				this._notification(`${response.message}`, 'error');
			}
			await this._setDefault();
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
				this._notification(`${response.message}`, 'error');
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
           <td>${result.data[i][3]}</td>
           <td>${result.data[i][4]}</td>
           <td>${result.data[i][5]}</td>
           <td>${result.data[i][6]}</td>
           <td>${result.data[i][7]}</td>
           <td>${result.data[i][8]}</td>
           <td>${result.data[i][9]}</td>
           <td><button class='btn btn-danger btn-sm btn-circle' id='delete${result.data[i][0]}'><i class='fas fa-trash'></i></button></td>
           </tr>
           `
			}
		}

		if (elmHtml == ``) {
			this.removeCacheProcess();
			document.getElementById('notaPenjualan').readOnly = false;
			document.getElementById('kodeBarang').readOnly = false;
		} else {
			document.getElementById('notaPenjualan').readOnly = true;
			document.getElementById('kodeBarang').readOnly = true;
		}

		document.getElementById('listBeliKembaliDetail').innerHTML = elmHtml;
		this._deleteDetail(result);
	},

	async _deleteDetail(result) {
		for (let i = 0; i < result.data.length; i++) {
			document.getElementById(`delete${result.data[i][0]}`).addEventListener('click', async () => {
				swal.fire({
					title: 'Hapus',
					html: "Anda ingin menghapus data ini? <br> <strong>Keterangan Barang </strong>: " + result.data[i][2],
					icon: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: 'Ya, Hapus!'
				}).then(async (response) => {
					if (response.value) {
						const status = await this._destroyDetailPembelian({
							notaPenjualan: document.getElementById('notaPenjualan').value,
							kodeBarang: result.data[i][0],
						});
						if (status) {
							this._notification('Data berhasil dihapus', 'success');
							await this._setDefault();
							await this._syncData(document.getElementById('user-id').value);
						}
					};
				});
			})
		}
	},

	async _initialPayment() {
		const eventTransaction = async (e) => {
			e.preventDefault();
			e.stopPropagation();
			let grandTotal = await FormatCurrency.getValue(document.getElementById('grandTotal').value);
			const notaPenjualan = document.getElementById('notaPenjualan').value;
			const faktur = document.getElementById('fakturBuyback').value;
			if (faktur == null || faktur == 'null' || faktur == '') {
				this._notification('Nota/faktur transaksi kosong/tidak tersedia!', 'error');
			} else {
				try {
					if (grandTotal != 0) {
						await this._changeWeightBarang();
						const result = await ApiBeliKembali.transactionsPayment({
							nota: notaPenjualan,
							faktur: faktur,
							date: document.getElementById('tanggal').value,
							pengeluaran: grandTotal,
							grand_total: grandTotal,
							user_id: document.getElementById('user-id').value,
						});
						this._notification(`Transaksi Berhasil`, 'success');
						this.removeCacheProcess()
						/* -print-faktur- */

						await this._printFaktur(faktur);
					} else {
						this._notification(`Belum ada barang dipilih!`, 'error');
					}
				} catch (error) {
					console.log(error)
					this._notification(`${error}`, 'error');
				}
			}
		}
		document.getElementById('transaksi-belikembali').addEventListener('submit', eventTransaction);
	},

	async _changeWeightBarang() {
		const userId = document.getElementById('user-id').value;
		const result = await ApiBeliKembali.getPembelianDetail(userId);

		await result.data.forEach(async (data) => {
			await ApiBarang.updateWeightBarang({
				berat: data[3],
				kode_barang: data[0]
			});
		});
	},

	async _reset() {
		$('#modalBayar').modal('hide');
		document.getElementById('kasir-id').value = '';
		document.getElementById('kasir-name').innerHTML = `<b>???</b>`;
		document.getElementById('fakturBuyback').value = null;
		document.getElementById('notaPenjualan').value = null;
		document.getElementById('kodeBarang').value = null;
		document.getElementById('listPenjualanDetail').innerHTML = ``;
		await this.init();
	},

	async _resetValue() {
		document.getElementById('fakturBuyback').value = null;
		document.getElementById('notaPenjualan').value = null;
		document.getElementById('kodeBarang').value = null;
		document.getElementById('listPenjualanDetail').innerHTML = ``;
	},

	_notification(msg, status) {
		swal.fire({
			title: `${status}`,
			text: `${msg}`,
			icon: `${status}`,
			confirmButtonColor: '#4fa7f3'
		})
	},


	setCacheProcess(notaPembelian) {
		let result = this.checkStorage();
		if (result == null) {
			localStorage.setItem('beli_kembali', `${notaPembelian}`)
		}
	},

	checkStorage() {
		let storage = localStorage.getItem('beli_kembali');
		return storage
	},

	removeCacheProcess() {
		localStorage.removeItem('beli_kembali');
	},

	isStillProcess() {
		let dataNota = localStorage.getItem('beli_kembali')
		document.getElementById('notaPenjualan').value = dataNota;
		if (dataNota != null) {
			document.getElementById('notaPenjualan').dispatchEvent(new Event('change'));
		}
	}
}

export default BeliKembaliInitiator;
