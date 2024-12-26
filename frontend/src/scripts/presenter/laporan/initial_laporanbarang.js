import API_ENDPOINT from '../../config/globals/endpoint.js';
import ApiLaporan from '../../api/data-laporan.js';
import apiBarang from '../../api/data-barang.js';

function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
}
const dataTableBarangInitiator = {
	async init() {
		await this._show();
		await this._refreshData();
		await this._initialHistoryBarang();
		await this.initFilterLaporanBarang();
		this._setDate();
	},

	async _setDate() {
		document.getElementById('startDate').valueAsDate = new Date();
		document.getElementById('endDate').valueAsDate = new Date();
	},

	async _refreshData() {
		document.getElementById('refresh').addEventListener('click', async () => {
			$('#pilihStatusBarang').prop('selectedIndex', 0);
			this._setDate();
			await this._show();
		});
	},

	async _show() {
		document.getElementById('startDate').focus();
		let table = await $('#tableLaporanBarang').DataTable({
			"processing": true,
			"destroy": true,
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			"serverSide": true,
			"ajax": {
				"url": `${API_ENDPOINT.LAPORAN_BARANG}`,
				"type": "POST"
			},
			dom: "BPlfrtip",
			responsive: true,
			paginate: true,
			bFilter: true,
			info: false,
			lengthChange: true,
			"lengthMenu": [25, 50, 100, 250, 500, 1000],
			buttons: [
				'copy', 'csv', 'excel', 'pdf', 'print',
			],
			"columnDefs": [{
				"targets": [0],
				"visible": true,
				"searchable": false,
				"orderable": false
			},
			{
				"targets": [5, 7, 8, 9, -1],
				"orderable": false
			},
			{
				"targets": -1,
				"data": null,
				"render": function (data, type, row) {
					return `<button data-toggle='modal' data-target='#modalHistory' title='Lihat History' class='btn btn-primary btn-circle' id='history'><i class='fas fa-history'></i></button>`
				},
			},
			]
		});

		let btnStylePrint = document.querySelectorAll('.dt-button');
		for (let i = 0; i < btnStylePrint.length; i++) {
			btnStylePrint[i].classList.add("btn");
			btnStylePrint[i].classList.add("btn-light");
		}

		const result = await ApiLaporan.getInfoTransaksiBarang({
			startDate: null,
			endDate: null,
			status: null
		});
		// Instok
		document.getElementById('lblTotalInstok').innerHTML = `${result.countTotalInstok} Buah`;
		document.getElementById('lblTotalInstokRp').innerHTML = `${result.totalInstokRp}`;
		document.getElementById('lblBeratInstok').innerHTML = `${result.weightInstok} Gram`;
		// Terjual
		document.getElementById('lblJumlahTerjual').innerHTML = `${result.countSold} Buah`;
		document.getElementById('lblTotalTerjualRp').innerHTML = `${result.totalSoldRp}`;
		document.getElementById('lblBeratTerjual').innerHTML = `${result.weightSold} Gram`;
		// Buyback
		document.getElementById('lblJumlahBuyback').innerHTML = `${result.countBuyback} Buah`;
		document.getElementById('lblTotalBuybackRp').innerHTML = `${result.totalBuybackRp}`;
		document.getElementById('lblBeratBuyback').innerHTML = `${result.weightBuyback} Gram`;

		document.getElementById('lblJumlahServis').innerHTML = `${result.countServis} Buah`;
		document.getElementById('lblJumlahRusak').innerHTML = `${result.countRusak} Buah`;
	},

	async _initialHistoryBarang() {
		$('#tableLaporanBarang tbody').on('click', '#history', async function () {

			const table = $('#tableLaporanBarang').DataTable();
			let data = table.row($(this).parents('tr')).data();
			let kodeBarang = await data[1];
			const result = await apiBarang.getInfoHistory(kodeBarang);
			document.getElementById('lblKodeBarang').innerHTML = kodeBarang;
			document.getElementById('lblKetBarang').innerHTML = await data[2];
			document.getElementById('lblTerjual').innerHTML = result.countTerjual + ' kali';
			document.getElementById('lblTerima').innerHTML = result.countTerima + ' kali';
			document.getElementById('lblBerat').innerHTML = result.berat;
			document.getElementById('lblHarga').innerHTML = result.harga;

			const tableHistory = await $('#tableHistoryBarang').DataTable({
				"processing": true,
				"destroy": true,
				"bInfo": false,
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
					"url": `${API_ENDPOINT.LIST_HISTORY_BARANG}`,
					"data": {
						kode_barang: kodeBarang
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
				}]
			});

		});
	},

	async initFilterLaporanBarang() {
		const eventFilterLaporanBarang = async (e) => {
			e.preventDefault();
			e.stopPropagation();
			await this._filterDataLaporanBarang();
		}

		document.getElementById('filterLaporanBarang').addEventListener('submit', eventFilterLaporanBarang);
	},

	async _filterDataLaporanBarang() {
		const startDateValue = await document.getElementById('startDate').value;
		const endDateValue = await document.getElementById('endDate').value;
		const statusBarang = await document.getElementById('pilihStatusBarang').value;
		const result = await ApiLaporan.getInfoTransaksiBarang({
			startDate: startDateValue,
			endDate: endDateValue,
			status: statusBarang
		});
		// Instok
		document.getElementById('lblTotalInstok').innerHTML = `${result.countTotalInstok} Buah`;
		document.getElementById('lblTotalInstokRp').innerHTML = `${result.totalInstokRp}`;
		document.getElementById('lblBeratInstok').innerHTML = `${result.weightInstok} Gram`;
		// Terjual
		document.getElementById('lblJumlahTerjual').innerHTML = `${result.countSold} Buah`;
		document.getElementById('lblTotalTerjualRp').innerHTML = `${result.totalSoldRp}`;
		document.getElementById('lblBeratTerjual').innerHTML = `${result.weightSold} Gram`;
		// Buyback
		document.getElementById('lblJumlahBuyback').innerHTML = `${result.countBuyback} Buah`;
		document.getElementById('lblTotalBuybackRp').innerHTML = `${result.totalBuybackRp}`;
		document.getElementById('lblBeratBuyback').innerHTML = `${result.weightBuyback} Gram`;

		document.getElementById('lblJumlahServis').innerHTML = `${result.countServis} Buah`;
		document.getElementById('lblJumlahRusak').innerHTML = `${result.countRusak} Buah`;
		await $('#tableLaporanBarang').DataTable({
			"processing": true,
			"destroy": true,
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			"serverSide": true,
			"ajax": {
				"url": `${API_ENDPOINT.LAPORAN_BARANG}`,
				"data": {
					status: statusBarang,
					startDate: startDateValue,
					endDate: endDateValue
				},
				"type": "POST"
			},
			dom: "BPlfrtip",
			responsive: true,
			paginate: true,
			bFilter: true,
			info: false,
			lengthChange: true,
			"lengthMenu": [25, 50, 100, 250, 500, 1000],
			buttons: [
				'copy', 'csv', 'excel', 'pdf', 'print',
			],
			"columnDefs": [{
				"targets": [0],
				"visible": true,
				"searchable": false,
				"orderable": false
			},
			{
				"targets": [5, 7, 8, 9, -1],
				"orderable": false
			},
			{
				"targets": -1,
				"data": null,
				"render": function (data, type, row) {
					return `<button data-toggle='modal' data-target='#modalHistory' title='Lihat History' class='btn btn-primary btn-circle' id='history'><i class='fas fa-history'></i></button>`
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
}




export default dataTableBarangInitiator;
