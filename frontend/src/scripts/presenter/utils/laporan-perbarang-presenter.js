import API_ENDPOINT from "../../config/globals/endpoint.js";
import apiBarang from '../../api/data-barang.js';
import CONFIG from '../../config/globals/config.js';
import ApiUser from "../../api/data-user.js";
import ApiSupplier from "../../api/data-supplier.js";
import ApiPelanggan from "../../api/datapelanggan.js";
import ApiJenisBarang from "../../api/data-jenisbarang.js";

function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

function toIndoDate(dateStr) {
	var parts = dateStr.match(/\d+/g);
	return parts[2] + "-" + parts[1] + "-" + parts[0];
}

const KelolaDataInitiator = {
	async _setDate() {
		document.getElementById("startDate").focus();
		document.getElementById("startDate").valueAsDate = new Date();
		document.getElementById("endDate").valueAsDate = new Date();
	},

	// Pembelian Perbarang
	async _showLaporanBeliPerbarang() {
		document.getElementById('startDate').focus();
		let table = await $("#tableLaporanBarang").DataTable({
			processing: true,
			destroy: true,
			language: {
				loadingRecords: "&nbsp;",
				processing: '<div class="spinner"></div>',
			},
			order: [
				[0, "desc"]
			],
			serverSide: true,
			ajax: {
				"url": `${API_ENDPOINT.LAPORAN_BELI_PERBARANG}`,
				"data": {
					startDate: new Date().toISOString().split('T')[0],
					endDate: new Date().toISOString().split('T')[0]
				},
				type: "POST",
			},
			"fnDrawCallback": function (data) {
				var api = this.api();
				$(api.column(4).footer()).html('' + data.json.berat_total + '');
				$(api.column(7).footer()).html('' + data.json.grand_total + '');
				document.getElementById("totalPembelian").innerHTML = `${data.json.grand_total}`;
				document.getElementById("totalBerat").innerHTML = `${data.json.berat_total} Gram`;
			},
			dom: "BPlfrtip",
			responsive: true,
			paginate: true,
			bFilter: true,
			info: false,
			lengthChange: true,
			"lengthMenu": [25, 50, 100, 250, 500, 1000],
			buttons: [{
				extend: 'excel',
				title: 'Laporan Pembelian Per Barang',
				filename: 'laporan_pembelian_perbarang',
				exportOptions: {
					columns: ':visible:not(:eq(-1))'
				}
			},
			{
				extend: 'print',
				text: 'Cetak Data [Ctrl + F10]',
				title: 'Laporan Pembelian Per Barang',
				filename: 'laporan_pembelian_perbarang',
				exportOptions: {
					columns: ':visible:not(:eq(-1))'
				},
				customize: function (win) {
					$(win.document.body)
						.css('font-size', '10pt')
						.css('text-align', 'center')
						.prepend(
							`<img src="${CONFIG.BASE_IMAGE_URL}logo.png" style="width:100px;height:100px">
							<div>Rekap Semua Laporan Pembelian Per Barang</div>`
						);
					$(win.document.body).find('table').addClass('display').css('font-size', '14px').css('font-weight', '500');
					// $(win.document.body).find('tr:nth-child(odd) td').each(function (index) {
					// 	$(this).css('background-color', '#D0D0D0');
					// });
					$(win.document.body).find('h1').css('text-align', 'center');
				}
			},
			],
			columnDefs: [{
				targets: [0],
				visible: true,
				searchable: false,
			},
			{
				targets: [0, 5, 6, 8, -1],
				orderable: false,
			},
			{
				targets: -1,
				data: null,
				render: function (data, type, row) {
					return `<button data-toggle='modal' data-target='#modalDetailPerbarang' title='Lihat Detail' class='btn btn-primary btn-circle' id='detail_perbarang'><i class='fas fa-eye'></i></button>`;
				},
			},
			{
				"targets": 8,
				"render": function (data, type, row) {
					let condition = '';
					if (row[8] !== null) {
						condition = `<img id='foto' class='foto' src='${CONFIG.BASE_URL}uploads/foto/${row[8]}' width='50' alt='${row[8]}' title='Lihat foto - ${row[2]}'</img>`
					} else {
						// condition = `<img id='foto' class='foto' src='${CONFIG.BASE_URL}uploads/foto/foto_1618559979-C0006810.jpg' width='50' alt='${row[8]}' title='Lihat foto - ${row[2]}'</img>`
						condition = `${row[8]}`;
					}
					return `${condition}`
				},
			},
			],
		});

		let btnStylePrint = document.querySelectorAll(".dt-button");
		for (let i = 0; i < btnStylePrint.length; i++) {
			btnStylePrint[i].classList.add("btn");
			btnStylePrint[i].classList.add("btn-light");
		}
	},

	async initBeliPerbarang() {
		this._getUser();
		this._getSupplier();
		this._getDevisi();
		await this._showLaporanBeliPerbarang();
		await this._refreshBeliPerbarang();
		await this.initFilterBeliPerbarang();
		await this._initialHistoryBeliPerbarang();
		this._setImageView();
	},

	async _refreshBeliPerbarang() {
		document.getElementById("refresh").addEventListener("click", async () => {
			$('#pilihUser').prop('selectedIndex', 0);
			$('#pilihSupplier').prop('selectedIndex', 0);
			$('#pilihDevisi').prop('selectedIndex', 0);
			await this._showLaporanBeliPerbarang();
		});
	},

	async initFilterBeliPerbarang() {
		const eventFilterBeliPerbarang = async (e) => {
			e.preventDefault();
			e.stopPropagation();
			await this._filterBeliPerbarang();
		}

		document.getElementById('filterLaporanBarang').addEventListener('submit', eventFilterBeliPerbarang);
	},

	async _filterBeliPerbarang() {
		const startDateValue = await document.getElementById('startDate').value;
		const endDateValue = await document.getElementById('endDate').value;
		let tglAwal = toIndoDate(startDateValue);
		let tglAkhir = toIndoDate(endDateValue);
		const user = await document.getElementById('pilihUser').value;
		const supplier = await document.getElementById('pilihSupplier').value;
		const devisi = await document.getElementById('pilihDevisi').value;
		await $('#tableLaporanBarang').DataTable({
			"processing": true,
			"destroy": true,
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			order: [
				[0, "desc"]
			],
			"serverSide": true,
			"ajax": {
				"url": `${API_ENDPOINT.LAPORAN_BELI_PERBARANG}`,
				"data": {
					user: user,
					supplier: supplier,
					devisi: devisi,
					startDate: startDateValue,
					endDate: endDateValue
				},
				"type": "POST"
			},
			"fnDrawCallback": function (data) {
				var api = this.api();
				$(api.column(4).footer()).html('' + data.json.berat_total + '');
				$(api.column(7).footer()).html('' + data.json.grand_total + '');
				document.getElementById("totalPembelian").innerHTML = `${data.json.grand_total}`;
				document.getElementById("totalBerat").innerHTML = `${data.json.berat_total} Gram`;
			},
			dom: "BPlfrtip",
			responsive: true,
			paginate: true,
			bFilter: true,
			info: false,
			lengthChange: true,
			"lengthMenu": [25, 50, 100, 250, 500, 1000],
			buttons: [{
				extend: 'excel',
				title: 'Laporan Pembelian Per Barang',
				filename: 'laporan_pembelian_perbarang',
				exportOptions: {
					columns: ':visible:not(:eq(-1))'
				}
			},
			{
				extend: 'print',
				title: 'Laporan Pembelian Per Barang',
				text: 'Cetak Data [Ctrl + F10]',
				filename: 'laporan_pembelian_perbarang',
				exportOptions: {
					columns: ':visible:not(:eq(-1))'
				},
				customize: function (win) {
					$(win.document.body)
						.css('font-size', '10pt')
						.css('text-align', 'center')
						.prepend(
							`<img src="${CONFIG.BASE_IMAGE_URL}logo.png" style="width:100px;height:100px">
							<div>Rekap Laporan Pembelian Per Barang dari Tanggal ${tglAwal} - ${tglAkhir}</div>`
						);
					$(win.document.body).find('table').addClass('display').css('font-size', '14px').css('font-weight', '500');
					$(win.document.body).find('h1').css('text-align', 'center');
				}
			},
			],
			"columnDefs": [{
				"targets": [0],
				"visible": true,
				"searchable": false
			},
			{
				targets: [0, 5, 6, 8, -1],
				orderable: false,
			},
			{
				"targets": -1,
				"data": null,
				"render": function (data, type, row) {
					return `<button data-toggle='modal' data-target='#modalDetailPerbarang' title='Lihat Detail' class='btn btn-primary btn-circle' id='detail_perbarang'><i class='fas fa-history'></i></button>`
				},
			},
			{
				"targets": 8,
				"render": function (data, type, row) {
					let condition = '';
					if (row[8] !== null) {
						condition = `<img id='foto' class='foto' src='${CONFIG.BASE_URL}uploads/foto/${row[8]}' width='50' alt='${row[8]}' title='Lihat foto - ${row[2]}'</img>`
					} else {
						condition = `${row[8]}`;
					}
					return `${condition}`
				},
			},
			]
		});

		let btnStylePrint = document.querySelectorAll('.dt-button');
		for (let i = 0; i < btnStylePrint.length; i++) {
			btnStylePrint[i].classList.add("btn");
			btnStylePrint[i].classList.add("btn-light");
		}

	},

	async _initialHistoryBeliPerbarang() {
		$('#tableLaporanBarang tbody').on('click', '#detail_perbarang', async function () {
			const table = $('#tableLaporanBarang').DataTable();
			let data = table.row($(this).parents('tr')).data();
			let kodeBarang = await data[1];
			const result = await apiBarang.getInfoHistory(kodeBarang);

			const tableHistory = await $('#tableDetailPerbarang').DataTable({
				"processing": true,
				"destroy": true,
				"bInfo": false,
				searching: false,
				paginate: true,
				bFilter: true,
				"order": [
					[0, "desc"]
				],
				'language': {
					'loadingRecords': '&nbsp;',
					'processing': '<div class="spinner"></div>',
					"zeroRecords": "Barang ini belum pernah ada Transaksi!"
				},
				"serverSide": true,
				"ajax": {
					"url": `${API_ENDPOINT.DETAIL_PERBARANG}`,
					"data": {
						kode_barang: kodeBarang,
						action: 'Pembelian'
					},
					"type": "POST"
				},
				dom: 'Plfrtip',
				lengthChange: false,
				buttons: [
					'copy', 'csv', 'excel', 'pdf', 'print',
				],
				"columnDefs": [{
					"targets": [0],
					"visible": true,
					"searchable": false
				},
				{
					targets: [5, 6, 7, 8],
					visible: false,
				},
				]
			});

		});
	},

	// Penjualan Perbarang
	async _showLaporanJualPerbarang() {
		document.getElementById('startDate').focus();
		let table = await $("#tableLaporanBarang").DataTable({
			processing: true,
			destroy: true,
			language: {
				loadingRecords: "&nbsp;",
				processing: '<div class="spinner"></div>',
			},
			order: [
				[0, "desc"]
			],
			serverSide: true,
			ajax: {
				url: `${API_ENDPOINT.LAPORAN_JUAL_PERBARANG}`,
				data: {
					startDate: new Date().toISOString().split('T')[0],
					endDate: new Date().toISOString().split('T')[0]
				},
				type: "POST",
			},
			"fnDrawCallback": function (data) {
				let api = this.api();
				document.getElementById('lblJumlahTerjual').innerHTML = data.json.recordsFiltered;
				document.getElementById("lblTotalTerjualRp").innerHTML = `${data.json.grand_total}`;
				document.getElementById("lblBeratTerjual").innerHTML = `${data.json.berat_total} Gram`;
				document.getElementById("lblOngkos").innerHTML = `${data.json.ongkos_total}`;
				document.getElementById("lblTotalNet").innerHTML = `${data.json.total_net}`;
				$(api.column(4).footer()).html('' + data.json.berat_total + '');
				$(api.column(7).footer()).html('' + data.json.grand_total + '');
				$(api.column(8).footer()).html('' + data.json.ongkos_total + '');
				$(api.column(9).footer()).html('' + data.json.total_net + '');
			},
			dom: "BPlfrtip",
			responsive: true,
			paginate: true,
			bFilter: true,
			info: false,
			lengthChange: true,
			"lengthMenu": [25, 50, 100, 250, 500, 1000],
			buttons: [{
				extend: 'excel',
				title: 'Laporan Penjualan Per Barang',
				filename: 'laporan_penjualan_perbarang',
				exportOptions: {
					columns: ':visible:not(:eq(-1))'
				}
			},
			{
				extend: 'print',
				text: 'Cetak Data [Ctrl + F10]',
				title: 'Laporan Penjualan Per Barang',
				filename: 'laporan_penjualan_perbarang',
				exportOptions: {
					columns: ':visible:not(:eq(-1))'
				},
				customize: function (win) {
					$(win.document.body)
						.css('font-size', '10pt')
						.css('text-align', 'center')
						.prepend(
							`<img src="${CONFIG.BASE_IMAGE_URL}logo.png" style="width:100px;height:100px">
							<div>Rekap Semua Laporan Penjualan Per Barang</div>`
						);
					$(win.document.body).find('table').addClass('display').css('font-size', '14px').css('font-weight', '500');
					// $(win.document.body).find('tr:nth-child(odd) td').each(function (index) {
					// 	$(this).css('background-color', '#D0D0D0');
					// });
					$(win.document.body).find('h1').css('text-align', 'center');
				}
			},
			],
			columnDefs: [{
				targets: [0],
				visible: true,
				searchable: false,
			},
			{
				targets: [0, 5, 6, 8, 9, -1],
				orderable: false,
			},
			{
				targets: -1,
				data: null,
				render: function (data, type, row) {
					return `<button data-toggle='modal' data-target='#modalDetailPerbarang' title='Lihat Detail' class='btn btn-primary btn-circle' id='detail_perbarang'><i class='fas fa-eye'></i></button>`;
				},
			},
			{
				"targets": 10,
				orderable: false,
				"render": function (data, type, row) {
					let condition = '';
					if (row[10] !== null) {
						condition = `<img id='foto' class='foto' src='${CONFIG.BASE_URL}uploads/foto/${row[10]}' width='50' alt='${row[10]}' title='Lihat foto - ${row[2]}'</img>`
					} else {
						condition = `${row[10]}`;
					}
					return `${condition}`
				},
			},
			],
		});

		let btnStylePrint = document.querySelectorAll(".dt-button");
		for (let i = 0; i < btnStylePrint.length; i++) {
			btnStylePrint[i].classList.add("btn");
			btnStylePrint[i].classList.add("btn-light");
		}
	},

	async initJualPerbarang() {
		this._getUser();
		this._getPelanggan();
		this._getDevisi();
		await this._showLaporanJualPerbarang();
		await this._refreshJualPerbarang();
		await this.initFilterJualPerbarang();
		await this._initialHistoryJualPerbarang();
		this._setImageView();
	},

	async _refreshJualPerbarang() {
		document.getElementById("refresh").addEventListener("click", async () => {
			$('#pilihUser').prop('selectedIndex', 0);
			$('#pilihPelanggan').prop('selectedIndex', 0);
			$('#pilihDevisi').prop('selectedIndex', 0);
			await this._showLaporanJualPerbarang();
		});
	},

	async initFilterJualPerbarang() {
		const eventFilterJualPerbarang = async (e) => {
			e.preventDefault();
			e.stopPropagation();
			await this._filterJualPerbarang();
		}

		document.getElementById('filterLaporanBarang').addEventListener('submit', eventFilterJualPerbarang);
	},

	async _filterJualPerbarang() {
		const startDateValue = await document.getElementById('startDate').value;
		const endDateValue = await document.getElementById('endDate').value;
		let tglAwal = toIndoDate(startDateValue);
		let tglAkhir = toIndoDate(endDateValue);
		const user = await document.getElementById('pilihUser').value;
		const pelanggan = await document.getElementById('pilihPelanggan').value;
		const devisi = await document.getElementById('pilihDevisi').value;
		await $('#tableLaporanBarang').DataTable({
			"processing": true,
			"destroy": true,
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			order: [
				[0, "desc"]
			],
			"serverSide": true,
			"ajax": {
				"url": `${API_ENDPOINT.LAPORAN_JUAL_PERBARANG}`,
				"data": {
					user: user,
					pelanggan: pelanggan,
					devisi: devisi,
					startDate: startDateValue,
					endDate: endDateValue
				},
				"type": "POST"
			},
			"fnDrawCallback": function (data) {
				let api = this.api();
				document.getElementById('lblJumlahTerjual').innerHTML = data.json.recordsFiltered;
				document.getElementById("lblTotalTerjualRp").innerHTML = `${data.json.grand_total}`;
				document.getElementById("lblBeratTerjual").innerHTML = `${data.json.berat_total} Gram`;
				document.getElementById("lblOngkos").innerHTML = `${data.json.ongkos_total}`;
				document.getElementById("lblTotalNet").innerHTML = `${data.json.total_net}`;
				$(api.column(4).footer()).html('' + data.json.berat_total + '');
				$(api.column(7).footer()).html('' + data.json.grand_total + '');
				$(api.column(8).footer()).html('' + data.json.ongkos_total + '');
				$(api.column(9).footer()).html('' + data.json.total_net + '');
			},
			dom: "BPlfrtip",
			responsive: true,
			paginate: true,
			bFilter: true,
			info: false,
			lengthChange: true,
			"lengthMenu": [25, 50, 100, 250, 500, 1000],
			buttons: [{
				extend: 'excel',
				title: 'Laporan Penjualan Per Barang',
				filename: 'laporan_penjualan_perbarang',
				exportOptions: {
					columns: ':visible:not(:eq(-1))'
				}
			},
			{
				extend: 'print',
				title: 'Laporan Penjualan Per Barang',
				text: 'Cetak Data [Ctrl + F10]',
				filename: 'laporan_penjualan_perbarang',
				exportOptions: {
					columns: ':visible:not(:eq(-1))'
				},
				customize: function (win) {
					$(win.document.body)
						.css('font-size', '10pt')
						.css('text-align', 'center')
						.prepend(
							`<img src="${CONFIG.BASE_IMAGE_URL}logo.png" style="width:100px;height:100px">
							<div>Rekap Laporan Penjualan Per Barang dari Tanggal ${tglAwal} - ${tglAkhir}</div>`
						);
					$(win.document.body).find('table').addClass('display').css('font-size', '14px').css('font-weight', '500');
					$(win.document.body).find('h1').css('text-align', 'center');
				}
			},
			],
			"columnDefs": [{
				"targets": [0],
				"visible": true,
				"searchable": false
			},
			{
				targets: [0, 5, 6, 8, 9, -1],
				orderable: false,
			},
			{
				"targets": -1,
				"data": null,
				"render": function (data, type, row) {
					return `<button data-toggle='modal' data-target='#modalDetailPerbarang' title='Lihat Detail' class='btn btn-primary btn-circle' id='detail_perbarang'><i class='fas fa-history'></i></button>`
				},
			},
			{
				"targets": 10,
				orderable: false,
				"render": function (data, type, row) {
					let condition = '';
					if (row[10] !== null) {
						condition = `<img id='foto' class='foto' src='${CONFIG.BASE_URL}uploads/foto/${row[10]}' width='50' alt='${row[10]}' title='Lihat foto - ${row[2]}'</img>`
					} else {
						condition = `${row[10]}`;
					}
					return `${condition}`
				},
			},
			]
		});

		let btnStylePrint = document.querySelectorAll('.dt-button');
		for (let i = 0; i < btnStylePrint.length; i++) {
			btnStylePrint[i].classList.add("btn");
			btnStylePrint[i].classList.add("btn-light");
		}

	},

	async _initialHistoryJualPerbarang() {
		$('#tableLaporanBarang tbody').on('click', '#detail_perbarang', async function () {
			const table = $('#tableLaporanBarang').DataTable();
			let data = table.row($(this).parents('tr')).data();
			let kodeBarang = await data[1];
			const result = await apiBarang.getInfoHistory(kodeBarang);

			const tableHistory = await $('#tableDetailPerbarang').DataTable({
				"processing": true,
				"destroy": true,
				"bInfo": false,
				searching: false,
				paginate: true,
				bFilter: true,
				"order": [
					[0, "desc"]
				],
				'language': {
					'loadingRecords': '&nbsp;',
					'processing': '<div class="spinner"></div>',
					"zeroRecords": "Barang ini belum pernah ada Transaksi!"
				},
				"serverSide": true,
				"ajax": {
					"url": `${API_ENDPOINT.DETAIL_PERBARANG}`,
					"data": {
						kode_barang: kodeBarang,
						action: 'Penjualan'
					},
					"type": "POST"
				},
				dom: 'Plfrtip',
				lengthChange: false,
				buttons: [
					'copy', 'csv', 'excel', 'pdf', 'print',
				],
				"columnDefs": [{
					"targets": [0],
					"visible": true,
					"searchable": false
				},
				{
					targets: [6, 7],
					visible: false,
				},
				]
			});

		});
	},

	// Buyback Perbarang
	async _showLaporanBuybackPerbarang() {
		document.getElementById('startDate').focus();
		let table = await $("#tableLaporanBarang").DataTable({
			processing: true,
			destroy: true,
			language: {
				loadingRecords: "&nbsp;",
				processing: '<div class="spinner"></div>',
			},
			order: [
				[0, "desc"]
			],
			serverSide: true,
			ajax: {
				url: `${API_ENDPOINT.LAPORAN_BUYBACK_PERBARANG}`,
				data: {
					startDate: new Date().toISOString().split('T')[0],
					endDate: new Date().toISOString().split('T')[0]
				},
				type: "POST",
			},
			"fnDrawCallback": function (data) {
				let api = this.api();
				document.getElementById('lblJumlahBuyback').innerHTML = data.json.recordsFiltered;
				document.getElementById('lblTotalBuybackRp').innerHTML = `${data.json.grand_total}`;
				document.getElementById('lblBeratBuyback').innerHTML = `${data.json.berat_total} Gram`;
				document.getElementById("totalPotongan").innerHTML = `${data.json.potongan_total}`;
				document.getElementById("totalServis").innerHTML = `${data.json.servis_total}`;
				document.getElementById("lblTotalNet").innerHTML = `${data.json.total_net}`;
				$(api.column(4).footer()).html('' + data.json.berat_total + '');
				$(api.column(8).footer()).html('' + data.json.grand_total + '');
				$(api.column(9).footer()).html('' + data.json.potongan_total + '');
				$(api.column(10).footer()).html('' + data.json.servis_total + '');
				$(api.column(11).footer()).html('' + data.json.total_net + '');
			},
			dom: "BPlfrtip",
			responsive: true,
			paginate: true,
			bFilter: true,
			info: false,
			lengthChange: true,
			"lengthMenu": [25, 50, 100, 250, 500, 1000],
			buttons: [{
				extend: 'excel',
				title: 'Laporan Terima Kembali Per Barang',
				filename: 'laporan_buyback_perbarang',
				exportOptions: {
					columns: ':visible:not(:eq(-1))'
				}
			},
			{
				extend: 'print',
				text: 'Cetak Data [Ctrl + F10]',
				title: 'Laporan Terima Kembali Per Barang',
				filename: 'laporan_buyback_perbarang',
				exportOptions: {
					columns: ':visible:not(:eq(-1))'
				},
				customize: function (win) {
					$(win.document.body)
						.css('font-size', '10pt')
						.css('text-align', 'center')
						.prepend(
							`<img src="${CONFIG.BASE_IMAGE_URL}logo.png" style="width:100px;height:100px">
							<div>Rekap Semua Laporan Terima Kembali Per Barang</div>`
						);
					$(win.document.body).find('table').addClass('display').css('font-size', '14px').css('font-weight', '500');
					// $(win.document.body).find('tr:nth-child(odd) td').each(function (index) {
					// 	$(this).css('background-color', '#D0D0D0');
					// });
					$(win.document.body).find('h1').css('text-align', 'center');
				}
			},
			],
			columnDefs: [{
				targets: [0],
				visible: true,
				searchable: false,
			},
			{
				targets: [0, 6, 7, 9, 10, -1],
				orderable: false,
			},
			{
				targets: -1,
				data: null,
				render: function (data, type, row) {
					return `<button data-toggle='modal' data-target='#modalDetailPerbarang' title='Lihat Detail' class='btn btn-primary btn-circle' id='detail_perbarang'><i class='fas fa-eye'></i></button>`;
				},
			},
			{
				"targets": [8, 11],
				"render": function (data, type, row, meta) {
					if (type === 'display') {
						data = "-" + data;
					}
					return data;
				},
			},
			{
				"targets": 12,
				orderable: false,
				"render": function (data, type, row) {
					let condition = '';
					if (row[12] !== null) {
						condition = `<img id='foto' class='foto' src='${CONFIG.BASE_URL}uploads/foto/${row[12]}' width='50' alt='${row[12]}' title='Lihat foto - ${row[2]}'</img>`
					} else {
						condition = `${row[12]}`;
					}
					return `${condition}`
				},
			},
			],
		});

		let btnStylePrint = document.querySelectorAll(".dt-button");
		for (let i = 0; i < btnStylePrint.length; i++) {
			btnStylePrint[i].classList.add("btn");
			btnStylePrint[i].classList.add("btn-light");
		}
	},

	async initBuybackPerbarang() {
		this._getUser();
		this._getPelanggan();
		this._getDevisi();
		await this._showLaporanBuybackPerbarang();
		await this._refreshBuybackPerbarang();
		await this.initFilterBuybackPerbarang();
		await this._initialHistoryBuybackPerbarang();
		this._setImageView();
	},

	async _refreshBuybackPerbarang() {
		document.getElementById("refresh").addEventListener("click", async () => {
			$('#pilihUser').prop('selectedIndex', 0);
			$('#pilihPelanggan').prop('selectedIndex', 0);
			$('#pilihDevisi').prop('selectedIndex', 0);
			await this._showLaporanBuybackPerbarang();
		});
	},

	async initFilterBuybackPerbarang() {
		const eventFilterBuybackPerbarang = async (e) => {
			e.preventDefault();
			e.stopPropagation();
			await this._filterBuybackPerbarang();
		}

		document.getElementById('filterLaporanBarang').addEventListener('submit', eventFilterBuybackPerbarang);
	},

	async _filterBuybackPerbarang() {
		const startDateValue = await document.getElementById('startDate').value;
		const endDateValue = await document.getElementById('endDate').value;
		let tglAwal = toIndoDate(startDateValue);
		let tglAkhir = toIndoDate(endDateValue);
		const user = await document.getElementById('pilihUser').value;
		const pelanggan = await document.getElementById('pilihPelanggan').value;
		const devisi = await document.getElementById('pilihDevisi').value;
		const status = await document.getElementById('pilihStatus').value;
		await $('#tableLaporanBarang').DataTable({
			"processing": true,
			"destroy": true,
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			order: [
				[0, "desc"]
			],
			"serverSide": true,
			"ajax": {
				"url": `${API_ENDPOINT.LAPORAN_BUYBACK_PERBARANG}`,
				"data": {
					user: user,
					pelanggan: pelanggan,
					devisi: devisi,
					status: status,
					startDate: startDateValue,
					endDate: endDateValue
				},
				"type": "POST"
			},
			"fnDrawCallback": function (data) {
				let api = this.api();
				document.getElementById('lblJumlahBuyback').innerHTML = data.json.recordsFiltered;
				document.getElementById('lblTotalBuybackRp').innerHTML = `${data.json.grand_total}`;
				document.getElementById('lblBeratBuyback').innerHTML = `${data.json.berat_total} Gram`;
				document.getElementById("totalPotongan").innerHTML = `${data.json.potongan_total}`;
				document.getElementById("totalServis").innerHTML = `${data.json.servis_total}`;
				document.getElementById("lblTotalNet").innerHTML = `${data.json.total_net}`;
				$(api.column(4).footer()).html('' + data.json.berat_total + '');
				$(api.column(8).footer()).html('' + data.json.grand_total + '');
				$(api.column(9).footer()).html('' + data.json.potongan_total + '');
				$(api.column(10).footer()).html('' + data.json.servis_total + '');
				$(api.column(11).footer()).html('' + data.json.total_net + '');
			},
			dom: "BPlfrtip",
			responsive: true,
			paginate: true,
			bFilter: true,
			info: false,
			lengthChange: true,
			"lengthMenu": [25, 50, 100, 250, 500, 1000],
			buttons: [{
				extend: 'excel',
				title: 'Laporan Terima Kembali Per Barang',
				filename: 'laporan_buyback_perbarang',
				exportOptions: {
					columns: ':visible:not(:eq(-1))'
				}
			},
			{
				extend: 'print',
				title: 'Laporan Terima Kembali Per Barang',
				text: 'Cetak Data [Ctrl + F10]',
				filename: 'laporan_buyback_perbarang',
				exportOptions: {
					columns: ':visible:not(:eq(-1))'
				},
				customize: function (win) {
					$(win.document.body)
						.css('font-size', '10pt')
						.css('text-align', 'center')
						.prepend(
							`<img src="${CONFIG.BASE_IMAGE_URL}logo.png" style="width:100px;height:100px">
							<div>Rekap Laporan Terima Kembali Per Barang dari Tanggal ${tglAwal} - ${tglAkhir}</div>`
						);
					$(win.document.body).find('table').addClass('display').css('font-size', '14px').css('font-weight', '500');
					$(win.document.body).find('h1').css('text-align', 'center');
				}
			},
			],
			"columnDefs": [{
				"targets": [0],
				"visible": true,
				"searchable": false
			},
			{
				targets: [0, 6, 7, 9, 10, 11, -1],
				orderable: false,
			},
			{
				"targets": -1,
				"data": null,
				"render": function (data, type, row) {
					return `<button data-toggle='modal' data-target='#modalDetailPerbarang' title='Lihat Detail' class='btn btn-primary btn-circle' id='detail_perbarang'><i class='fas fa-history'></i></button>`
				},
			},
			{
				"targets": [8, 11],
				"render": function (data, type, row, meta) {
					if (type === 'display') {
						data = "-" + data;
					}
					return data;
				},
			},
			{
				"targets": 12,
				orderable: false,
				"render": function (data, type, row) {
					let condition = '';
					if (row[12] !== null) {
						condition = `<img id='foto' class='foto' src='${CONFIG.BASE_URL}uploads/foto/${row[12]}' width='50' alt='${row[12]}' title='Lihat foto - ${row[2]}'</img>`
					} else {
						condition = `${row[12]}`;
					}
					return `${condition}`
				},
			},
			]
		});

		let btnStylePrint = document.querySelectorAll('.dt-button');
		for (let i = 0; i < btnStylePrint.length; i++) {
			btnStylePrint[i].classList.add("btn");
			btnStylePrint[i].classList.add("btn-light");
		}

	},

	async _initialHistoryBuybackPerbarang() {
		$('#tableLaporanBarang tbody').on('click', '#detail_perbarang', async function () {
			const table = $('#tableLaporanBarang').DataTable();
			let data = table.row($(this).parents('tr')).data();
			let kodeBarang = await data[1];
			const result = await apiBarang.getInfoHistory(kodeBarang);

			const tableHistory = await $('#tableDetailPerbarang').DataTable({
				"processing": true,
				"destroy": true,
				"bInfo": false,
				searching: false,
				paginate: true,
				bFilter: true,
				"order": [
					[0, "desc"]
				],
				'language': {
					'loadingRecords': '&nbsp;',
					'processing': '<div class="spinner"></div>',
					"zeroRecords": "Barang ini belum pernah ada Transaksi!"
				},
				"serverSide": true,
				"ajax": {
					"url": `${API_ENDPOINT.DETAIL_PERBARANG}`,
					"data": {
						kode_barang: kodeBarang,
						action: 'Beli Kembali'
					},
					"type": "POST"
				},
				dom: 'Plfrtip',
				lengthChange: false,
				buttons: [
					'copy', 'csv', 'excel', 'pdf', 'print',
				],
				"columnDefs": [{
					"targets": [0],
					"visible": true,
					"searchable": false
				},
				{
					targets: [5],
					visible: false,
				},
				]
			});

		});
	},

	async _setImageView() {
		var modal = document.getElementById('imageModal');
		var modalImg = document.getElementById("imageView");
		var captionText = document.getElementById("caption");
		$('#tableLaporanBarang tbody').on('click', '.foto', function () {
			modal.style.display = "block";
			modalImg.src = this.src;
			modalImg.alt = this.alt;
			captionText.innerHTML = this.alt;
			console.log("test")
		})
		modal.addEventListener('click', async () => {
			imageView.className += " out";
			setTimeout(function () {
				modal.style.display = "none";
				imageView.className = "imgModal";
			}, 400);
		})
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

	async _getDevisi() {
		let elmData = '';
		const dataDevisi = await ApiJenisBarang.getJenisBarang();
		dataDevisi.data.forEach(data => {
			elmData += `<option value="${data[2]}">${data[1]}</li>`;
		});
		$("#pilihDevisi").html('<option selected value="">-- Pilih Devisi --</option>' + elmData);
	},
};

export default KelolaDataInitiator;
