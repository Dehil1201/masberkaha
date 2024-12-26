import API_ENDPOINT from '../../config/globals/endpoint.js';
import apiBarang from '../../api/data-barang.js';
import FormatCurrency from '../../utils/initial-currency.js';
import CONFIG from '../../config/globals/config.js';
import StorageBarang from '../../utils/storage_barang.js';

let foto = '';
let table;
let video;
const dataTableBarangInitiator = {

	async init() {
		StorageBarang.makeStore()
		await this._show();
		await this._showCamera();
		this._getJenisBarang();
		this._getGantiStatus();
		this._initialSwitchJenis();
		this._initialAutoBarcode();
		this._initialCreate();
		this._initialUpdate();
		this._initForSubmit();
		this._initialDelete();
		this._initialInput();
		this._initialChangeFoto();
		this._initSelectedBarang();
		this._giveEventStatusBarang();
		await this._checkAllEvent();
		await this.initFilterBarang();
		await this._refreshData();
	},

	async _refreshData() {
		document.getElementById('refresh').addEventListener('click', () => {
			$('#pilih_jenis').prop('selectedIndex', 0);
			$('#pilih_status').prop('selectedIndex', 0);
			this._show();
			this._resetStorageBarang()
			document.getElementById('label_ganti_status').innerHTML = 'Ganti Status'
		});
	},

	async _initialInput() {
		FormatCurrency.initialCurrency({
			elmId: 'harga_beli'
		})
		FormatCurrency.initialCurrency({
			elmId: 'harga_jual'
		})
	},

	async _show() {
		let elmBtnAction = ``;
		let level = (document.getElementById('level-user').value == 6) ? 'admin' : 'kasir'
		if (level !== 'admin') {
			elmBtnAction = ``
		} else {
			elmBtnAction = `<button class='btn btn-info btn-circle' title='Edit Data Barang' id='edit'><i class='far fa-edit'></i></button>
			<button class='btn btn-danger btn-circle' title='Hapus Data Barang' id='delete'><i class='fas fa-trash'></i></button>`
		}
		// $('#modalData').on('shown.bs.modal', function () {
		// 	var urlReplace = "#" + $(this).attr('id');
		// 	history.pushState(null, null, urlReplace);
		// });
		// $(window).on('popstate', function () {
		// 	if ($("#modalData:visible").length){
		// 		$("#modalData").eq($("#modalData:visible").length-1).modal('hide');
		// 	}
		// });
		$("#viewStok").hide();
		table = await $('#tableBarang').DataTable({
			"processing": true,
			"destroy": true,
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			pageLength: 50,
			"serverSide": true,
			"responsive": true,
			"ajax": {
				"url": `${API_ENDPOINT.LIST_BARANG}`,
				"type": "POST"
			},
			"fnDrawCallback": function (data) {
				document.getElementById('jumlahBarang').innerHTML = data.json.recordsFiltered;
				document.getElementById('beratValue').innerHTML = data.json.berat;
				let rowTable = data.aoData;
				const checked = document.getElementById('select-all').checked;
				if (checked) {
					document.getElementById('select-all').checked = false;
				}
				$('#tableBarang tbody tr').each(function (e) {
					if (rowTable[e] !== undefined) {
						let result = rowTable[e]._aData[1];
						let isChecked = StorageBarang.isReady(result);
						if (isChecked) {
							$(this).addClass('selected');
						}
					}
				})
			},
			dom: 'Plfrtip',
			lengthChange: true,
			"lengthMenu": [25, 50, 100, 250, 500, 1000],
			buttons: [
				'copy', 'csv', 'excel', 'pdf', 'print',
			],
			select: {
				style: 'multi',
				selector: 'td:first-child'
			},
			order: [
				[6, 'asc']
			],
			"columnDefs": [{
				"targets": 0,
				"orderable": false,
				className: 'select-checkbox',
				"data": null,
				"defaultContent": ``
			}, {
				"targets": -1,
				"data": null,
				"render": function (data, type, row) {

					let condition = '';
					if (row[6] !== 'J') {
						condition = elmBtnAction
					} else {
						condition = '';
					}
					return `${condition}`
				},
			},
			{
				"targets": 9,
				"data": "img",
				"render": function (data, type, row) {

					let condition = '';
					if (row[9] !== null) {
						condition = `<img id='foto' class='foto' src='${CONFIG.BASE_URL}uploads/foto/${row[9]}' width='50' alt='${row[9]}' title='Lihat foto - ${row[2]}'</img>`
					} else {
						condition = `${row[9]}`;
					}

					return `${condition}`
				},
			},
			{
				"targets": [0],
				"visible": true,
				"searchable": false
			},
			{
				"targets": [10],
				"visible": false,
				"searchable": false
			}
			]
		});

		let btnStylePrint = document.querySelectorAll('.dt-button');
		for (let i = 0; i < btnStylePrint.length; i++) {
			btnStylePrint[i].classList.add("btn");
			btnStylePrint[i].classList.add("btn-light");
		}
		this._setImageView();
	},

	async _setImageView() {
		var modal = document.getElementById('imageModal');
		var modalImg = document.getElementById("imageView");
		var captionText = document.getElementById("caption");
		$('#tableBarang tbody').on('click', '.foto', function () {
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

	async initFilterBarang() {
		const eventFilterBarang = async (e) => {
			e.preventDefault();
			this._resetStorageBarang()
			await this._filterDataBarang();
		}

		document.getElementById('filterBarang').addEventListener('submit', eventFilterBarang);
	},

	async _checkAllEvent() {
		const eventSelectAll = async () => {
			const element = document.querySelectorAll(".select-checkbox");
			const checked = document.getElementById('select-all').checked;
			for (let index = 1; index < element.length; index++) {
				const status = element[index].nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML;
				const kode_barang = element[index].nextElementSibling.innerHTML;
				if (checked) {
					if (!element[index].parentNode.classList.contains('selected')) {
						if (status !== 'J') {
							await StorageBarang.pushData(kode_barang, status);
							element[index].parentNode.classList.add('selected');
						}
					}
				} else {
					await StorageBarang.deleteData(kode_barang);
					element[index].parentNode.classList.remove('selected');
				}
				await this._renderCountStorageBarang();
			}
		}

		document.getElementById('select-all').addEventListener('change', eventSelectAll)

	},

	async _filterDataBarang() {
		let elmBtnAction = ``;
		let level = (document.getElementById('level-user').value == 6) ? 'admin' : 'kasir'
		if (level !== 'admin') {
			elmBtnAction = ``
		} else {
			elmBtnAction = `<button class='btn btn-info btn-circle' title='Edit Data Barang' id='edit'><i class='far fa-edit'></i></button>
							  <button class='btn btn-danger btn-circle' title='Hapus Data Barang' id='delete'><i class='fas fa-trash'></i></button>`
		}
		const jenisBarang = await document.getElementById('pilih_jenis').value;
		const statusBarang = await document.getElementById('pilih_status').value;
		(jenisBarang != null) ? document.getElementById('jenisBarang').innerHTML = jenisBarang : document.getElementById('jenisBarang').innerHTML = 'Total';
		await $('#tableBarang').DataTable({
			"processing": false,
			"destroy": true,
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>',
			},
			pageLength: 50,
			"serverSide": true,
			"ajax": {
				"url": `${API_ENDPOINT.FILTER_BARANG}`,
				"data": {
					jenis_barang: jenisBarang,
					status: statusBarang
				},
				"type": "POST"
			},
			"fnDrawCallback": function (data) {
				document.getElementById('jumlahBarang').innerHTML = data.json.recordsFiltered;
				document.getElementById('beratValue').innerHTML = data.json.berat;
				let rowTable = data.aoData;
				const checked = document.getElementById('select-all').checked;
				if (checked) {
					document.getElementById('select-all').checked = false;
				}
				$('#tableBarang tbody tr').each(function (e) {
					if (rowTable[e] !== undefined) {
						let result = rowTable[e]._aData[1];
						let isChecked = StorageBarang.isReady(result);
						if (isChecked) {
							$(this).addClass('selected');
						}
					}
				})
			},
			dom: 'Plfrtip',
			responsive: true,
			paginate: true,
			bFilter: true,
			info: true,
			lengthChange: true,
			"lengthMenu": [25, 50, 100, 250, 500, 1000],
			buttons: [
				'copy', 'csv', 'excel', 'pdf', 'print',
			],
			select: {
				style: 'multi',
				selector: 'td:first-child'
			},
			order: [
				[6, 'asc']
			],
			"columnDefs": [{
				"targets": 0,
				"orderable": false,
				className: 'select-checkbox',
				"data": null,
				"defaultContent": ``
			}, {
				"targets": -1,
				"data": null,
				"render": function (data, type, row) {

					let condition = '';
					if (row[6] !== 'J') {
						condition = elmBtnAction
					} else {
						condition = '';
					}
					return `${condition}`
				},
			},
			{
				"targets": 9,
				"data": "img",
				"render": function (data, type, row) {

					let condition = '';
					if (row[9] !== null) {
						condition = `<img id='foto' class='foto' src='${CONFIG.BASE_URL}uploads/foto/${row[9]}' width='50' alt='${row[9]}' title='Lihat foto - ${row[2]}'</img>`
					} else {
						condition = `${row[9]}`;
					}

					return `${condition}`
				},
			},
			{
				"targets": [0],
				"visible": true,
				"searchable": false
			},
			{
				"targets": [10],
				"visible": false,
				"searchable": false
			}
			]
		});

		let btnStylePrint = document.querySelectorAll('.dt-button');
		for (let i = 0; i < btnStylePrint.length; i++) {
			btnStylePrint[i].classList.add("btn");
			btnStylePrint[i].classList.add("btn-light");
		}

	},

	async _initialAutoBarcode() {

		const autoBarcode = async () => {
			let barcodeBarang = document.getElementById("kode_barang");
			let jenisBarang = document.getElementById('jenis_barang').value;
			const stateForm = document.getElementById('barangForm').dataset.action;
			if (stateForm === 'create') {
				if (jenisBarang == '') {
					barcodeBarang.value = null;
				} else {
					const response = await apiBarang.getJenisBarangRow(jenisBarang);
					const kode = await apiBarang.getKodeBarang(response[0].kode_jenis);
					barcodeBarang.value = kode.data;
				}
			}

		}

		document.getElementById('create_data').addEventListener("click", autoBarcode);
		document.getElementById('jenis_barang').addEventListener('change', autoBarcode);
	},

	async _initialSwitchJenis() {
		const switchJenis = async () => {
			let jenisBarang = document.getElementById('jenis_barang').value;
			const response = apiBarang.getJenisBarangRow(jenisBarang);
			response.then(function (result) {
				if (result[0].penjualan_satuan == 1) {
					$("#viewBerat").hide();
					$("#viewKadar").hide();
					$("#viewStok").show();
				} else {
					$("#viewBerat").show();
					$("#viewKadar").show();
					$("#viewStok").hide();
				}
			});
		}
		document.getElementById('jenis_barang').addEventListener('change', switchJenis)
	},

	async _initialChangeFoto() {
		const changeFoto = async () => {
			$('#btnTake').show();
			$('#btnAgain').show();
			$('#btnChangeFoto').hide();
			$('#viewCamera').show();
			$('#viewCurrentFoto').hide();
		}
		document.getElementById('btnChangeFoto').addEventListener("click", changeFoto);
	},

	async _syncData() {
		$('#pilih_jenis').prop('selectedIndex', 0);
		table.ajax.url(`${API_ENDPOINT.LIST_BARANG}`).load();
	},

	async _syncView() {
		$('#modalData').modal('hide');
		$('#barangForm').trigger("reset");
	},


	async _initialUpdate() {
		$('#tableBarang tbody').on('click', '#edit', function (e) {
			e.stopPropagation();
			$('#myModalLabel').html("Ubah Barang");
			const table = $('#tableBarang').DataTable();
			let data = table.row($(this).parents('tr')).data();
			const response = apiBarang.getJenisBarangRow(data[3]);
			response.then(function (result) {
				if (result[0].penjualan_satuan != 1) {
					$("#viewStok").hide();
				} else {
					$("#viewStok").show();
				}
			});
			$('#btn-save').html('<i class="fa fa-check-square-o"></i> Simpan');
			$('#btn-save').val('simpan');
			$('#modalData').modal('show');
			$('#barang_id').val(data[0]);
			$('#kode_barang').val(data[1]);
			$('#nama_barang').val(data[2]);
			$('#jenis_barang').val(data[3]);
			$('#berat').val(data[4]);
			$('#kadar').val(data[5]);
			$('#statusBarang').show();
			$('#statusBarangValue').val(data[6]);
			$('#harga_beli').val('Rp. ' + data[7]);
			$('#harga_jual').val('Rp. ' + data[8]);
			document.getElementById("old_foto").value = data[9];
			document.getElementById("stok").value = data[10];
			$('#btnTake').hide();
			$('#btnAgain').hide();
			$('#btnChangeFoto').show();
			video.play();
			foto = '';
			$('#viewCamera').hide();
			$('#viewCurrentFoto').show();
			if (data[9] != null) {
				$('#viewCurrentFoto').html(`<img id='currentFoto' class='container-fluid foto' src='${CONFIG.BASE_URL}uploads/foto/${data[9]}' width='50' alt='${data[9]}' title='Lihat foto - ${data[2]}'</img>`);
			} else {
				$('#viewCurrentFoto').html(`Foto tidak tersedia!`);
			}
			$('#barangForm').attr("data-action", "update");
		});

	},

	async _initialCreate() {
		$('#modalData').on('shown.bs.modal', function () {
			$('#jenis_barang').focus();
		});
		document.getElementById('create_data').addEventListener('click', () => {
			video.play();
			foto = '';
			$('#btnChangeFoto').hide();
			$('#viewCurrentFoto').hide();
			$('#btn-save').html('<i class="fa fa-check-square-o"></i> Tambah');
			$('#btn-save').val('tambah');
			$('#barang_id').val('');
			$('#statusBarang').hide();
			$('#barangForm').trigger("reset");
			$('#myModalLabel').html("Tambah Barang");
			$('#modalData').modal('show');
			$('#viewCamera').show();
			$('#btnTake').show();
			$('#btnAgain').show();
			$('#barangForm').attr("data-action", "create"); //for state create
		});
	},

	async _initialDelete() {
		$('#tableBarang tbody').on('click', '#delete', function (e) {
			e.stopPropagation();
			const table = $('#tableBarang').DataTable();
			let data = table.row($(this).parents('tr')).data();

			swal.fire({
				title: 'Hapus',
				html: "Anda ingin menghapus data ini? <br> <strong>Nama Barang </strong>: " + data[2],
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Ya, Hapus!'
			}).then(async (result) => {
				if (result.value) {
					let id = data[0];
					let foto = data[9];
					const status = await apiBarang.deleteBarang(id, foto);

					if (status === '200') {
						swal.fire({
							title: 'Hapus',
							text: 'Data berhasil dihapus',
							icon: 'success',
							showConfirmButton: false,
							timer: 1000
						});
						//refres manual 
						document.getElementById('refresh').click();
					}
				};
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

	_notification(msg, status) {
		swal.fire({
			title: `${status}`,
			text: `${msg}`,
			icon: `${status}`,
			showConfirmButton: false,
			timer: 1000
		})
	},

	async _getJenisBarang() {
		let elmData = '';
		const dataAkses = await apiBarang.getJenisBarang();
		dataAkses.data.forEach(data => {
			elmData += `<option value="${data[1]}">${data[1]}</li>`;
		});
		$("#jenis_barang").removeAttr('disabled', 'disabled').html('<option disabled selected value> -- Pilih Jenis Barang -- </option>' + elmData);
		$("#pilih_jenis").html('<option selected value>Pilih Jenis Barang </option>' + elmData);
	},

	async _getGantiStatus() {
		let level = (document.getElementById('level-user').value == 6) ? 'admin' : 'kasir'
		let elmData = '';
		if (level !== 'admin') {
			elmData = `<option value='0'>0</option>
			<option value='1'>1</option>`
		} else {
			elmData= `<option value='0'>0</option>
			<option value='1'>1</option>
			<option value='R'>R</option>
			<option value='S'>S</option>
			<option value='S1'>S1</option>`
		}
		$("#ganti_status").html(elmData);
	},

	async _initForSubmit() {
		const eventForm = async (e) => {
			e.preventDefault();
			const stateForm = document.getElementById('barangForm').dataset.action;

			if (stateForm === 'create') {
				this._createBarang();
			} else if (stateForm === 'update') {
				this._updateBarang();
			}
			await this._syncData()

			document.getElementById('refresh').dispatchEvent(new Event('click'));
		}
		document.getElementById('barangForm').addEventListener('submit', eventForm);
	},

	async _createBarang() {
		try {
			const status = await apiBarang.addBarang(new FormData(document.getElementById('barangForm')), foto);
			if (status === '200') {
				this._notification('Succes Menambahkan Data', 'success');
				await this._syncData();
				this._syncView();
			}
		} catch (error) {
			this._notification('Maaf Ada masalah Didalam Server Harap Mengisi Data Dengan Benar...', 'error');
		}

	},

	async _updateBarang() {

		const status = await apiBarang.updateBarang(new FormData(document.getElementById('barangForm')), foto);
		if (status === '200') {
			this._notification('Succes Mengedit Data', 'success');
			await this._syncData();
			this._syncView();
		} else if (status === '500') {
			this._notification('Maaf Ada masalah Didalam Server Harap Mengisi Dengan Benar...', 'error');
		}
	},

	async _initSelectedBarang() {
		$('#tableBarang tbody').on('click', '.select-checkbox', async function (e) {
			e.stopPropagation();
			const table = $('#tableBarang').DataTable();
			let data = table.row($(this).parents('tr')).data();

			if ($(this).parents('tr').hasClass("selected")) {
				if (data[6] !== 'J') {
					await StorageBarang.deleteData(data[1]);
					$(this).parents('tr').removeClass('selected');
					const countData = await StorageBarang.size();
					document.getElementById('label_ganti_status').innerHTML = ` Ganti Status ${countData == 0 ? '' : `${countData} Barang`}`

				}
			} else {
				if (data[6] !== 'J') {
					await StorageBarang.pushData(data[1], data[6]);
					$(this).parents('tr').addClass('selected');
					const countData = await StorageBarang.size();
					document.getElementById('label_ganti_status').innerHTML = ` Ganti Status ${countData == 0 ? '' : `${countData} Barang`}`

				}
			}


		});
	},

	async _resetStorageBarang() {
		await StorageBarang.makeStore();
		const countData = await StorageBarang.size();
		document.getElementById('label_ganti_status').innerHTML = ` Ganti Status ${countData == 0 ? '' : `${countData} Barang`}`
	},

	async _renderCountStorageBarang() {
		const countData = await StorageBarang.size();
		document.getElementById('label_ganti_status').innerHTML = ` Ganti Status ${countData == 0 ? '' : `${countData} Barang`}`
	},

	async _giveEventStatusBarang() {
		const evenStatusBarang = async () => {
			const statusChanged = document.getElementById('ganti_status').value;
			const dataResult = await StorageBarang.getData();
			if (dataResult.length > 0) {
				await dataResult.forEach(async (data) => {
					await apiBarang.changeStatusBarang({
						kode_barang: data.kode_barang,
						status_barang: statusChanged
					});
				});
				this._notification('Succes Mengedit Data', 'success');
				document.getElementById('refresh').dispatchEvent(new Event('click'));
			} else {
				this._notification('Tandai dahulu kode barangnya!', 'error');
			}
		}
		document.getElementById('btn_change_status').addEventListener('click', evenStatusBarang);

	},


}

export default dataTableBarangInitiator;
