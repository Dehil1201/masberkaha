import API_ENDPOINT from "../../config/globals/endpoint.js";
import FakturInitiator from "./initial_faktur.js";
import PrintInitiator from "./initial_print.js";
import apiPenjualan from '../../api/data-penjualan.js';
import NotificationModal from "../../utils/initial_notification.js";
import ApiPembelian from "../../api/data-pembelian.js";
import ApiBeliKembali from "../../api/data-belikembali.js";
import ApiUser from "../../api/data-user.js";
import ApiSupplier from "../../api/data-supplier.js";
import ApiPelanggan from "../../api/datapelanggan.js";
import CONFIG from "../../config/globals/config.js";

function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}

function toIndoDate(dateStr) {
	var parts = dateStr.match(/\d+/g);
	return parts[2] + '-' + parts[1] + '-' + parts[0];
}

const KelolaDataInitiator = {
	async _setDate() {
		document.getElementById('startDate').focus();
		document.getElementById('startDate').valueAsDate = new Date();
		document.getElementById('endDate').valueAsDate = new Date();
	},

	// Pembelian
	async _showDataPembelian() {
		let table = await $('#kelolaTable').DataTable({
			"processing": true,
			"destroy": true,
			"order": [
				[0, "desc"]
			],
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			"serverSide": true,
			"ajax": {
				"url": `${API_ENDPOINT.FILTER_DATA_PEMBELIAN}`,
				"data": {
					startDate: new Date().toISOString().split('T')[0],
					endDate: new Date().toISOString().split('T')[0]
				},
				"type": "POST"
			},
			"fnDrawCallback": function (data) {
				var api = this.api();
				$(api.column(4).footer()).html('' + data.json.berat + '');
				$(api.column(5).footer()).html('' + data.json.grand_total + '');
				document.getElementById('jumlahNota').innerHTML = data.json.recordsFiltered;
				document.getElementById('totalPembelian').innerHTML = `${'' + data.json.grand_total + ''}`;
				document.getElementById('totalBerat').innerHTML = `${data.json.berat} Gram`;
			},
			dom: "BPlfrtip",
			lengthChange: true,
			"lengthMenu": [10, 50, 100, 250, 500, 1000],
			buttons: [{
				extend: 'excel',
				title: 'Laporan Pembelian',
				filename: 'laporan_pembelian',
				exportOptions: {
					columns: ':visible:not(:eq(-1))'
				}
			},
			{
				extend: 'print',
				text: 'Cetak Data [Ctrl + F10]',
				title: 'Laporan Pembelian',
				filename: 'laporan_pembelian',
				exportOptions: {
					columns: ':visible:not(:eq(-1))'
				},
				customize: function (win) {
					$(win.document.body)
						.css('font-size', '10pt')
						.css('text-align', 'center')
						.prepend(
							`<img src="${CONFIG.BASE_IMAGE_URL}logo.png" style="width:100px;height:100px">
							<div>Rekap Semua Laporan Pembelian</div>`
						);
					$(win.document.body).find('table').addClass('display').css('font-size', '12px');
					// $(win.document.body).find('tr:nth-child(odd) td').each(function (index) {
					// 	$(this).css('background-color', '#D0D0D0');
					// });
					$(win.document.body).find('h1').css('text-align', 'center');
				}
			},
			],
			"columnDefs": [{
				"targets": -1,
				"data": null,
				"orderable": false,
				"defaultContent": `<button title='Lihat Detail Pembelian' id='viewPembelian' title='Tampilkan detail pembelian' class='btn btn-primary btn-circle'><i class='fas fa-eye'></i></button>
									<button title='Print Nota' id='printNota' class='btn btn-primary btn-circle'><i class='fas fa-print'></i></button>
									<button class='btn btn-danger btn-circle' title='Hapus Data Pembelian' id='delete_pembelian'><i class='fas fa-trash'></i></button>`
			},
			{
				"targets": [0],
				"visible": true,
				"searchable": false
			},
			{
				"targets": [0, 3, 4],
				"orderable": false,
			}
			]
		});

		let btnStylePrint = document.querySelectorAll('.dt-button');
		for (let i = 0; i < btnStylePrint.length; i++) {
			btnStylePrint[i].classList.add("btn");
			btnStylePrint[i].classList.add("btn-light");
		}
	},

	async _refreshDataPembelian() {
		document.getElementById('refresh').addEventListener('click', async () => {
			$('#pilih_pembayaran').prop('selectedIndex', 0);
			$('#pilihUser').prop('selectedIndex', 0);
			$('#pilihSupplier').prop('selectedIndex', 0);
			await this._showDataPembelian();
		});
	},

	async initDataPembelian() {
		this._getUser();
		this._getSupplier();
		await this._showDataPembelian();
		await this._refreshDataPembelian();
		await this.initFilterPembelian();
		await this._initPrintFakturPembelian();
		this._initialDeletePembelian();
		this._initialViewPembelian();
	},

	async initFilterPembelian() {
		const eventFilterPembelian = async (e) => {
			e.preventDefault();
			await this._filterDataPembelian();
		}

		document.getElementById('filterPembelian').addEventListener('submit', eventFilterPembelian);
	},

	async _filterDataPembelian() {
		const starDateValue = await document.getElementById('startDate').value;
		const endDateValue = await document.getElementById('endDate').value;
		let tglAwal = toIndoDate(starDateValue);
		let tglAkhir = toIndoDate(endDateValue);

		const statusPayment = await document.getElementById('pilih_pembayaran').value;
		const user = await document.getElementById('pilihUser').value;
		const supplier = await document.getElementById('pilihSupplier').value;
		let table = await $('#kelolaTable').DataTable({
			"processing": true,
			"destroy": true,
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			"serverSide": true,
			"ajax": {
				"url": `${API_ENDPOINT.FILTER_DATA_PEMBELIAN}`,
				"data": {
					status_bayar: statusPayment,
					user: user,
					supplier: supplier,
					startDate: starDateValue,
					endDate: endDateValue
				},
				"type": "POST"
			},
			"fnDrawCallback": function (data) {
				var api = this.api();
				$(api.column(4).footer()).html('' + data.json.berat + '');
				$(api.column(5).footer()).html('' + data.json.grand_total + '');
				document.getElementById('jumlahNota').innerHTML = data.json.recordsFiltered;
				document.getElementById('totalPembelian').innerHTML = `${'' + data.json.grand_total + ''}`;
				document.getElementById('totalBerat').innerHTML = `${data.json.berat} Gram`;
			},
			dom: "BPlfrtip",
			lengthChange: true,
			"lengthMenu": [25, 50, 100, 250, 500, 1000],
			buttons: [{
				extend: 'excel',
				title: 'Laporan Pembelian',
				filename: 'laporan_pembelian',
				exportOptions: {
					columns: ':visible:not(:eq(-1))'
				}
			},
			{
				extend: 'print',
				title: 'Laporan Pembelian',
				text: 'Cetak Data [Ctrl + F10]',
				filename: 'laporan_pembelian',
				exportOptions: {
					columns: ':visible:not(:eq(-1))'
				},
				customize: function (win) {
					$(win.document.body)
						.css('font-size', '10pt')
						.css('text-align', 'center')
						.prepend(
							`<img src="${CONFIG.BASE_IMAGE_URL}logo.png" style="width:100px;height:100px">
							<div>Rekap Laporan Pembelian dari Tanggal ${tglAwal} - ${tglAkhir}</div>`
						);
					$(win.document.body).find('table').addClass('display').css('font-size', '12px');
					$(win.document.body).find('h1').css('text-align', 'center');
				}
			},
			],
			"columnDefs": [{
				"targets": -1,
				"data": null,
				"orderable": false,
				"defaultContent": `<button title='Lihat Detail Pembelian' id='viewPembelian' title='Tampilkan detail pembelian' class='btn btn-primary btn-circle'><i class='fas fa-eye'></i></button>
									<button title='Print Nota' id='printNota' class='btn btn-primary btn-circle'><i class='fas fa-print'></i></button>
									<button class='btn btn-danger btn-circle' title='Hapus Data Pembelian' id='delete_pembelian'><i class='fas fa-trash'></i></button>`
			},
			{
				"targets": [0],
				"visible": true,
				"searchable": false
			},
			{
				"targets": [0, 3, 4],
				"orderable": false,
			}
			]
		});

		let btnStylePrint = document.querySelectorAll('.dt-button');
		for (let i = 0; i < btnStylePrint.length; i++) {
			btnStylePrint[i].classList.add("btn");
			btnStylePrint[i].classList.add("btn-light");
		}
	},

	async _initialViewPembelian() {
		await $('#kelolaTable tbody').on('click', '#viewPembelian', async function (event) {
			$('#myModalLabel').html("Detail Transaksi Pembelian");
			event.preventDefault()
			event.stopPropagation();
			const table = await $('#kelolaTable').DataTable();
			let data = table.row($(this).parents('tr')).data();
			await PrintInitiator.initPembelianNew(data[1], false);
			$('#modalPembelian').modal('show');
		});
	},

	async _initialDeletePembelian() {
		$('#kelolaTable tbody').on('click', '#delete_pembelian', function (e) {
			e.stopPropagation();
			const table = $('#kelolaTable').DataTable();
			let data = table.row($(this).parents('tr')).data();

			swal.fire({
				title: 'Hapus',
				html: "Anda ingin menghapus/membatalkan transaksi ini? <br> <strong>Faktur </strong>: " + data[1],
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Ya, Hapus!'
			}).then(async (result) => {
				if (result.value) {
					let faktur = data[1];
					const status = await ApiPembelian.deleteTransactions(faktur);
					if (status) {
						swal.fire({
							title: 'Hapus',
							text: 'Data berhasil dihapus',
							icon: 'success',
							showConfirmButton: false,
							timer: 1000
						});
						//refres manual 
						let oTable = $('#kelolaTable').dataTable();
						oTable.fnDraw(false);
						$(this).parents('tr').fadeOut(300);
					} else {
						NotificationModal.show('Ada kesalahan server!', 'error');
					}
				};
			});
		});
	},

	async _initPrintFakturPembelian() {
		await $('#kelolaTable tbody').on('click', '#printNota', async function (event) {
			event.stopPropagation();
			$('#modalPrint').modal('show');
			const table = await $('#kelolaTable').DataTable();
			let data = table.row($(this).parents('tr')).data();
			await PrintInitiator.initPembelianNew(data[1], true);
		});
	},

	// Penjualan
	async _showDataPenjualan() {
		let table = await $('#kelolaTable').DataTable({
			"processing": true,
			"destroy": true,
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			"order": [
				[0, "desc"]
			],
			"serverSide": true,
			"ajax": {
				"url": `${API_ENDPOINT.FILTER_DATA_PENJUALAN}`,
				"data": {
					startDate: new Date().toISOString().split('T')[0],
					endDate: new Date().toISOString().split('T')[0]
				},
				"type": "POST"
			},
			"fnDrawCallback": function (data) {
				var api = this.api();
				$(api.column(6).footer()).html('' + data.json.berat + '');
				$(api.column(7).footer()).html('' + data.json.subtotal + '');
				$(api.column(8).footer()).html('' + data.json.ongkos + '');
				$(api.column(9).footer()).html('' + data.json.grand_total + '');
				document.getElementById('jumlahNota').innerHTML = data.json.recordsFiltered;
				document.getElementById('totalBerat').innerHTML = `${data.json.berat} Gram`;
				document.getElementById('subTotal').innerHTML = data.json.subtotal;
				document.getElementById('totalOngkos').innerHTML = data.json.ongkos;
				document.getElementById('totalPenjualan').innerHTML = data.json.grand_total;
			},
			dom: "BPlfrtip",
			lengthChange: true,
			"lengthMenu": [25, 50, 100, 250, 500, 1000],
			buttons: [{
				extend: 'excel',
				title: 'Laporan Penjualan',
				filename: 'laporan_penjualan',
				exportOptions: {
					columns: ':visible:not(:eq(-1))'
				}
			},
			{
				extend: 'print',
				text: 'Cetak Data [Ctrl + F10]',
				title: 'Laporan Penjualan',
				filename: 'laporan_penjualan',
				exportOptions: {
					columns: ':visible:not(:eq(-1))'
				},
				customize: function (win) {
					$(win.document.body)
						.css('font-size', '10pt')
						.css('text-align', 'center')
						.prepend(
							`<img src="${CONFIG.BASE_IMAGE_URL}logo.png" style="width:100px;height:100px">
							<div>Rekap Semua Laporan Penjualan</div>`
						);
					$(win.document.body).find('table').addClass('display').css('font-size', '12px');
					// $(win.document.body).find('tr:nth-child(odd) td').each(function (index) {
					// 	$(this).css('background-color', '#D0D0D0');
					// });
					$(win.document.body).find('h1').css('text-align', 'center');
				}
			},
			],
			"columnDefs": [{
				"targets": -1,
				"data": null,
				"orderable": false,
				"render": function (data, type, row, meta) {
					let elmFull = `<button title='Lihat Detail Penjualan' id='viewPenjualan' title='Tampilkan detail penjulan' class='btn btn-primary btn-circle'><i class='fas fa-eye'></i></button>
						<button title='Print Nota' id='printNota' class='btn btn-primary btn-circle'><i class='fas fa-print'></i></button>
						<button class='btn btn-danger btn-circle' title='Hapus Data Penjualan' id='delete_penjualan'><i class='fas fa-trash'></i></button>`

					let elmDeleteHide = `<button title='Lihat Detail Penjualan' id='viewPenjualan' title='Tampilkan detail penjulan' class='btn btn-primary btn-circle'><i class='fas fa-eye'></i></button>
						<button title='Print Nota' id='printNota' class='btn btn-primary btn-circle'><i class='fas fa-print'></i></button>`

					var temp = new Array();
					temp = row[1].split("-");
					let dateInSever = `${temp[1]}-${temp[0]}-${temp[2]}`
					let dateOld = new Date(dateInSever)
					dateOld.setDate(dateOld.getDate() + 3);
					let currentDate = new Date()
					if (dateOld >= currentDate) {
						return elmFull
					} else {
						return elmDeleteHide
					}
				}
			},

			{
				"targets": [7],
				"visible": true,
				"searchable": false
			},
			{
				"targets": [0, 3, 6, 7, 8],
				"orderable": false,
			}
			]
		});

		let btnStylePrint = document.querySelectorAll('.dt-button');
		for (let i = 0; i < btnStylePrint.length; i++) {
			btnStylePrint[i].classList.add("btn");
			btnStylePrint[i].classList.add("btn-light");
		}

	},

	async _refreshDataPenjualan() {
		document.getElementById('refresh').addEventListener('click', async () => {
			$('#pilih_pembayaran').prop('selectedIndex', 0);
			$('#pilihUser').prop('selectedIndex', 0);
			$('#pilihPelanggan').prop('selectedIndex', 0);
			await this._showDataPenjualan();
		});
	},

	async initDataPenjualan() {
		this._getUser();
		this._getPelanggan();
		await this._showDataPenjualan();
		await this._refreshDataPenjualan();
		await this.initFilterPenjualan();
		await this._initPrintFakturPenjualan();
		this._initialDeletePenjualan();
		this._initialViewPenjualan();
	},

	async initFilterPenjualan() {
		const eventFilterPenjualan = async (e) => {
			e.preventDefault();
			await this._filterDataPenjualan();

		}

		document.getElementById('filterPenjualan').addEventListener('submit', eventFilterPenjualan);
	},

	async _filterDataPenjualan() {
		const starDateValue = await document.getElementById('startDate').value;
		const endDateValue = await document.getElementById('endDate').value;
		let tglAwal = toIndoDate(starDateValue);
		let tglAkhir = toIndoDate(endDateValue);
		const statusPayment = await document.getElementById('pilih_pembayaran').value;
		const user = await document.getElementById('pilihUser').value;
		const pelanggan = await document.getElementById('pilihPelanggan').value;
		let table = await $('#kelolaTable').DataTable({
			"processing": true,
			"destroy": true,
			"order": [
				[0, "desc"]
			],
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			"serverSide": true,
			"ajax": {
				"url": `${API_ENDPOINT.FILTER_DATA_PENJUALAN}`,
				"data": {
					status_bayar: statusPayment,
					user: user,
					pelanggan: pelanggan,
					startDate: starDateValue,
					endDate: endDateValue
				},
				"type": "POST"
			},
			"fnDrawCallback": function (data) {
				var api = this.api();
				$(api.column(6).footer()).html('' + data.json.berat + '');
				$(api.column(7).footer()).html('' + data.json.subtotal + '');
				$(api.column(8).footer()).html('' + data.json.ongkos + '');
				$(api.column(9).footer()).html('' + data.json.grand_total + '');
				document.getElementById('jumlahNota').innerHTML = data.json.recordsFiltered;
				document.getElementById('totalBerat').innerHTML = `${data.json.berat} Gram`;
				document.getElementById('subTotal').innerHTML = data.json.subtotal;
				document.getElementById('totalOngkos').innerHTML = data.json.ongkos;
				document.getElementById('totalPenjualan').innerHTML = data.json.grand_total;
			},
			dom: "BPlfrtip",
			lengthChange: true,
			"lengthMenu": [25, 50, 100, 250, 500, 1000],
			buttons: [{
				extend: 'excel',
				title: 'Laporan Penjualan',
				filename: 'laporan_penjualan',
				exportOptions: {
					columns: ':visible:not(:eq(-1))'
				}
			},
			{
				extend: 'print',
				title: 'Laporan Penjualan',
				text: 'Cetak Data [Ctrl + F10]',
				filename: 'laporan_penjualan',
				exportOptions: {
					columns: ':visible:not(:eq(-1))'
				},
				customize: function (win) {
					$(win.document.body)
						.css('font-size', '10pt')
						.css('text-align', 'center')
						.prepend(
							`<img src="${CONFIG.BASE_IMAGE_URL}logo.png" style="width:100px;height:100px">
							<div>Rekap Laporan Penjualan dari Tanggal ${tglAwal} - ${tglAkhir}</div>`
						);
					$(win.document.body).find('table').addClass('display').css('font-size', '12px');
					$(win.document.body).find('h1').css('text-align', 'center');
				}
			},
			],
			"columnDefs": [{
				"targets": -1,
				"data": null,
				"orderable": false,
				"render": function (data, type, row, meta) {
					let elmFull = `<button title='Lihat Detail Penjualan' id='viewPenjualan' title='Tampilkan detail penjulan' class='btn btn-primary btn-circle'><i class='fas fa-eye'></i></button>
						<button title='Print Nota' id='printNota' class='btn btn-primary btn-circle'><i class='fas fa-print'></i></button>
						<button class='btn btn-danger btn-circle' title='Hapus Data Penjualan' id='delete_penjualan'><i class='fas fa-trash'></i></button>`

					let elmDeleteHide = `<button title='Lihat Detail Penjualan' id='viewPenjualan' title='Tampilkan detail penjulan' class='btn btn-primary btn-circle'><i class='fas fa-eye'></i></button>
						<button title='Print Nota' id='printNota' class='btn btn-primary btn-circle'><i class='fas fa-print'></i></button>`

					var temp = new Array();
					temp = row[1].split("-");
					let dateInSever = `${temp[1]}-${temp[0]}-${temp[2]}`
					let dateOld = new Date(dateInSever)
					dateOld.setDate(dateOld.getDate() + 3);
					let currentDate = new Date()
					if (dateOld >= currentDate) {
						return elmFull
					} else {
						return elmDeleteHide
					}
				}
			},
			{
				"targets": [0],
				"visible": true,
				"searchable": false
			},
			{
				"targets": [0, 3, 6, 7, 8],
				"orderable": false,
			}
			]
		});

		let btnStylePrint = document.querySelectorAll('.dt-button');
		for (let i = 0; i < btnStylePrint.length; i++) {
			btnStylePrint[i].classList.add("btn");
			btnStylePrint[i].classList.add("btn-light");
		}
	},

	async _initialViewPenjualan() {
		await $('#kelolaTable tbody').on('click', '#viewPenjualan', async function (event) {
			$('#myModalLabel').html("Detail Transaksi Penjualan");
			event.preventDefault()
			event.stopPropagation();
			const table = await $('#kelolaTable').DataTable();
			let data = table.row($(this).parents('tr')).data();
			if (data[2].split('.')[0] == 'PJQ') {
				await PrintInitiator.initQuantityNew(data[2], 'printArea', 0);
			} else {
				await FakturInitiator.initViewPenjualan(data[2]);
			}
			$('#modalPenjualan').modal('show');
		});
		this._initCetakStruk();
	},

	async _initialDeletePenjualan() {
		$('#kelolaTable tbody').on('click', '#delete_penjualan', function (e) {
			e.stopPropagation();
			const table = $('#kelolaTable').DataTable();
			let data = table.row($(this).parents('tr')).data();

			swal.fire({
				title: 'Hapus',
				html: "Anda ingin menghapus/membatalkan transaksi ini? <br> <strong>Faktur </strong>: " + data[2],
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Ya, Hapus!'
			}).then(async (result) => {
				if (result.value) {
					let faktur = data[2];
					const status = await apiPenjualan.deleteTransactions(faktur);
					if (status) {
						swal.fire({
							title: 'Hapus',
							text: 'Data berhasil dihapus',
							icon: 'success',
							showConfirmButton: false,
							timer: 1000
						});
						//refres manual 
						let oTable = $('#kelolaTable').dataTable();
						oTable.fnDraw(false);
						$(this).parents('tr').fadeOut(300);
					} else {
						NotificationModal.show('Ada kesalahan server!', 'error');
					}
				};
			});
		});
	},

	async _initPrintFakturPenjualan() {
		await $('#kelolaTable tbody').on('click', '#printNota', async function (event) {
			event.stopPropagation();
			const table = await $('#kelolaTable').DataTable();
			// $('#modalPrint').modal('show');
			let data = table.row($(this).parents('tr')).data();
			if (data[2].split('.')[0] == 'PJQ') {
				await PrintInitiator.initQuantityNew(data[2], 'printResultNota', 1);
			} else {
				await PrintInitiator.initPenjualanNew(data[2]);
			}
			// var mediaQueryList = window.matchMedia('print');
			// mediaQueryList.addListener(function (mql) {
			// 	if (mql.matches) {
			// 		console.log('before printing');
			// 	} else {
			// 		console.log('after printing');
			// 	}
			// });
		});
	},

	// Beli Kembali
	async _showDataBeliKembali() {
		const result = await ApiBeliKembali.getInfoTransaksiBuyback({
			startDate: new Date().toISOString().split('T')[0],
			endDate: new Date().toISOString().split('T')[0],
			user: null,
			pelanggan: null
		});

		document.getElementById('jumlahNota').innerHTML = `${result.jumlahNota}`;
		document.getElementById('totalBerat').innerHTML = `${result.totalBerat} Gram`;
		document.getElementById('totalBuyback').innerHTML = `${result.totalBuyback}`;
		let table = await $('#kelolaTable').DataTable({
			"processing": true,
			"destroy": true,
			"order": [
				[0, "desc"]
			],
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			"serverSide": true,
			"ajax": {
				"url": `${API_ENDPOINT.FILTER_DATA_BELIKEMBALI}`,
				"data": {
					startDate: new Date().toISOString().split('T')[0],
					endDate: new Date().toISOString().split('T')[0]
				},
				"type": "POST"
			},
			"fnDrawCallback": function (data) {
				var api = this.api();
				$(api.column(5).footer()).html('' + data.json.grand_total + '');
			},
			dom: "BPlfrtip",
			lengthChange: true,
			"lengthMenu": [25, 50, 100, 250, 500, 1000],
			buttons: [{
				extend: 'excel',
				title: 'Laporan Terima Kembali',
				filename: 'laporan_terima_kembali',
				exportOptions: {
					columns: ':visible:not(:eq(-1))'
				}
			},
			{
				extend: 'print',
				text: 'Cetak Data [Ctrl + F10]',
				title: 'Laporan Terima Kembali',
				filename: 'laporan_terima_kembali',
				exportOptions: {
					columns: ':visible:not(:eq(-1))'
				},
				customize: function (win) {
					$(win.document.body)
						.css('font-size', '10pt')
						.css('text-align', 'center')
						.prepend(
							`<img src="${CONFIG.BASE_IMAGE_URL}logo.png" style="width:100px;height:100px">
							<div>Rekap Semua Laporan Terima Kembali</div>`
						);
					$(win.document.body).find('table').addClass('display').css('font-size', '12px');
					// $(win.document.body).find('tr:nth-child(odd) td').each(function (index) {
					// 	$(this).css('background-color', '#D0D0D0');
					// });
					$(win.document.body).find('h1').css('text-align', 'center');
				}
			},
			],
			"columnDefs": [{
				"targets": -1,
				"data": null,
				"orderable": false,
				"render": function (data, type, row, meta) {
					let elmFull = `<button title='Lihat Detail Penjualan' id='viewBuyback' title='Tampilkan detail beli kembali' class='btn btn-primary btn-circle'><i class='fas fa-eye'></i></button>
					<button title='Print Nota' id='printBuyback' class='btn btn-primary btn-circle'><i class='fas fa-print'></i></button>
					<button class='btn btn-danger btn-circle' title='Hapus Data Terima Kembali' id='delete_buyback'><i class='fas fa-trash'></i></button>`

					let elmDeleteHide = `<button title='Lihat Detail Penjualan' id='viewBuyback' title='Tampilkan detail beli kembali' class='btn btn-primary btn-circle'><i class='fas fa-eye'></i></button>
					<button title='Print Nota' id='printBuyback' class='btn btn-primary btn-circle'><i class='fas fa-print'></i></button>`

					var temp = new Array();
					temp = row[3].split("-");
					let dateInSever = `${temp[1]}-${temp[0]}-${temp[2]}`
					let dateOld = new Date(dateInSever)
					dateOld.setDate(dateOld.getDate() + 3);
					let currentDate = new Date()
					if (dateOld >= currentDate) {
						return elmFull
					} else {
						return elmDeleteHide
					}
				}
			},
			{
				"targets": [0],
				"visible": true,
				"searchable": false
			},
			{
				"targets": [0, 4],
				"orderable": false
			},
			{
				"targets": [2],
				"visible": false
			}
			]
		});

		let btnStylePrint = document.querySelectorAll('.dt-button');
		for (let i = 0; i < btnStylePrint.length; i++) {
			btnStylePrint[i].classList.add("btn");
			btnStylePrint[i].classList.add("btn-light");
		}
	},

	async _refreshDataBeliKembali() {
		document.getElementById('refresh').addEventListener('click', async () => {
			$('#pilih_pembayaran').prop('selectedIndex', 0);
			$('#pilihUser').prop('selectedIndex', 0);
			$('#pilihPelanggan').prop('selectedIndex', 0);
			await this._showDataBeliKembali();
		});
	},

	async initDataBeliKembali() {
		this._getUser();
		this._getPelanggan();
		await this._showDataBeliKembali();
		await this._refreshDataBeliKembali();
		await this.initFilterBeliKembali();
		this._initialDeleteBuyback();
		this._initialViewBuyback();
		await this._initPrintBuyback();
	},

	async initFilterBeliKembali() {
		const eventFilterBeliKembali = async (e) => {
			e.preventDefault();
			await this._filterDataBeliKembali();
		}

		document.getElementById('filterPembelian').addEventListener('submit', eventFilterBeliKembali);
	},

	async _filterDataBeliKembali() {
		const starDateValue = await document.getElementById('startDate').value;
		const endDateValue = await document.getElementById('endDate').value;
		let tglAwal = toIndoDate(starDateValue);
		let tglAkhir = toIndoDate(endDateValue);
		const user = await document.getElementById('pilihUser').value;
		const pelanggan = await document.getElementById('pilihPelanggan').value;
		const result = await ApiBeliKembali.getInfoTransaksiBuyback({
			startDate: starDateValue,
			endDate: endDateValue,
			user: user,
			pelanggan: pelanggan
		});
		document.getElementById('jumlahNota').innerHTML = `${result.jumlahNota}`;
		document.getElementById('totalBerat').innerHTML = `${result.totalBerat} Gram`;
		document.getElementById('totalBuyback').innerHTML = `${result.totalBuyback}`;
		let table = await $('#kelolaTable').DataTable({
			"processing": true,
			"destroy": true,
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			"order": [
				[0, "desc"]
			],
			"serverSide": true,
			"ajax": {
				"url": `${API_ENDPOINT.FILTER_DATA_BELIKEMBALI}`,
				"data": {
					user: user,
					pelanggan: pelanggan,
					startDate: starDateValue,
					endDate: endDateValue
				},
				"type": "POST"
			},
			"fnDrawCallback": function (data) {
				var api = this.api();
				$(api.column(5).footer()).html('' + data.json.grand_total + '');
			},
			dom: "BPlfrtip",
			lengthChange: true,
			"lengthMenu": [25, 50, 100, 250, 500, 1000],
			buttons: [{
				extend: 'excel',
				title: 'Laporan Terima Kembali',
				filename: 'laporan_terima_kembali',
				exportOptions: {
					columns: ':visible:not(:eq(-1))'
				}
			},
			{
				extend: 'print',
				title: 'Laporan Terima Kembali',
				text: 'Cetak Data [Ctrl + F10]',
				filename: 'laporan_terima_kembali',
				exportOptions: {
					columns: ':visible:not(:eq(-1))'
				},
				customize: function (win) {
					$(win.document.body)
						.css('font-size', '10pt')
						.css('text-align', 'center')
						.prepend(
							`<img src="${CONFIG.BASE_IMAGE_URL}logo.png" style="width:100px;height:100px">
							<div>Rekap Laporan Terima Kembali dari Tanggal ${tglAwal} - ${tglAkhir}</div>`
						);
					$(win.document.body).find('table').addClass('display').css('font-size', '12px');
					$(win.document.body).find('h1').css('text-align', 'center');
				}
			},
			],
			"columnDefs": [{
				"targets": -1,
				"data": null,
				"orderable": false,
				"render": function (data, type, row, meta) {
					let elmFull = `<button title='Lihat Detail Penjualan' id='viewBuyback' title='Tampilkan detail beli kembali' class='btn btn-primary btn-circle'><i class='fas fa-eye'></i></button>
					<button title='Print Nota' id='printBuyback' class='btn btn-primary btn-circle'><i class='fas fa-print'></i></button>
					<button class='btn btn-danger btn-circle' title='Hapus Data Terima Kembali' id='delete_buyback'><i class='fas fa-trash'></i></button>`

					let elmDeleteHide = `<button title='Lihat Detail Penjualan' id='viewBuyback' title='Tampilkan detail beli kembali' class='btn btn-primary btn-circle'><i class='fas fa-eye'></i></button>
					<button title='Print Nota' id='printBuyback' class='btn btn-primary btn-circle'><i class='fas fa-print'></i></button>`

					var temp = new Array();
					temp = row[3].split("-");
					let dateInSever = `${temp[1]}-${temp[0]}-${temp[2]}`
					let dateOld = new Date(dateInSever)
					dateOld.setDate(dateOld.getDate() + 3);
					let currentDate = new Date()
					if (dateOld >= currentDate) {
						return elmFull
					} else {
						return elmDeleteHide
					}
				}
			},
			{
				"targets": [0],
				"visible": true,
				"searchable": false
			},
			{
				"targets": [0, 4],
				"orderable": false
			},
			{
				"targets": [2],
				"visible": false
			}
			]
		});

		let btnStylePrint = document.querySelectorAll('.dt-button');
		for (let i = 0; i < btnStylePrint.length; i++) {
			btnStylePrint[i].classList.add("btn");
			btnStylePrint[i].classList.add("btn-light");
		}

	},

	async _initialViewBuyback() {
		await $('#kelolaTable tbody').on('click', '#viewBuyback', async function (event) {
			$('#myModalLabel').html("Detail Transaksi Beli Kembali");
			event.preventDefault()
			event.stopPropagation();
			const table = await $('#kelolaTable').DataTable();
			let data = table.row($(this).parents('tr')).data();
			await PrintInitiator.initBuybackNew(data[1], 'printArea', false);
			$('#modalBuyback').modal('show');
		});
		this._initCetakStruk();
	},

	async _initialDeleteBuyback() {
		$('#kelolaTable tbody').on('click', '#delete_buyback', function (e) {
			e.stopPropagation();
			const table = $('#kelolaTable').DataTable();
			let data = table.row($(this).parents('tr')).data();
			swal.fire({
				title: 'Hapus',
				html: "Anda ingin menghapus/membatalkan transaksi ini? <br> <strong>Faktur </strong>: " + data[1],
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Ya, Hapus!'
			}).then(async (result) => {
				if (result.value) {
					let faktur = data[1];
					const status = await ApiBeliKembali.deleteTransactions(faktur);
					if (status) {
						swal.fire({
							title: 'Hapus',
							text: 'Data berhasil dihapus',
							icon: 'success',
							showConfirmButton: false,
							timer: 1000
						});
						//refres manual 
						let oTable = $('#kelolaTable').dataTable();
						oTable.fnDraw(false);
						$(this).parents('tr').fadeOut(300);
					} else {
						NotificationModal.show('Ada kesalahan server!', 'error');
					}
				};
			});
		});
	},

	async _initPrintBuyback() {
		await $('#kelolaTable tbody').on('click', '#printBuyback', async function (event) {
			event.preventDefault()
			event.stopPropagation();
			$('#modalPrint').modal('show');
			const table = await $('#kelolaTable').DataTable();
			let data = table.row($(this).parents('tr')).data();
			await PrintInitiator.initBuybackNew(data[1], 'printResultNota', true);
		});
	},

	async _initCetakStruk() {
		await $('#printStruk').on('click', async function (event) {
			event.preventDefault()
			event.stopPropagation();
			$('#modalPrint').modal('show');
			let data = document.getElementById('notaPenjualan').innerHTML;
			if (data.split('.')[0] == 'PJQ') {
				await PrintInitiator.initQuantityNew(data, 'printResultNota', 1);
			} else {
				await PrintInitiator.initPenjualanNew(data);
			}
		});
		await $('#cetakStruk').on('click', async function (event) {
			event.preventDefault()
			event.stopPropagation();
			jQuery('#printResultNota').print();
		});
	},

	async _getUser() {
		let elmData = '';
		const dataUser = await ApiUser.getUser();
		dataUser.data.forEach(data => {
			elmData += `<option value="${data[0]}">${data[1]}</li>`;
		});
		$("#pilihUser").html('<option selected value="">-- Pilih User --</option>' + elmData);
	},

	async _getSupplier() {
		let elmData = '';
		const dataSupplier = await ApiSupplier.getSupplier();
		dataSupplier.data.forEach(data => {
			elmData += `<option value="${data[0]}">${data[1]}</li>`;
		});
		$("#pilihSupplier").html('<option selected value="">-- Pilih Supplier --</option>' + elmData);
	},

	async _getPelanggan() {
		let elmData = '';
		const dataPelanggan = await ApiPelanggan.getPelanggan();
		dataPelanggan.data.forEach(data => {
			elmData += `<option value="${data[0]}">${data[2]}</li>`;
		});
		$("#pilihPelanggan").html('<option selected value="">-- Pilih Pelanggan --</option>' + elmData);
	},
}

export default KelolaDataInitiator;
