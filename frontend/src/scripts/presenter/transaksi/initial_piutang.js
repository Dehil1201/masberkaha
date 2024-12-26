import API_ENDPOINT from '../../config/globals/endpoint.js';
import apiPiutang from '../../api/data-piutang.js'
import FormatCurrency from '../../utils/initial-currency.js';
let table;
let ajaxData = `${API_ENDPOINT.LIST_PIUTANG}`;

function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
}

function reformatNumber(num) {
	const result = num.replace(/[^,\d]/g, '').toString();
	return result;
}

const dataTablePiutangInitiator = {

	async init() {
		await this._show();
		await this._toolsSupport();
		this._initialViewPenjualan();
		this._initialViewPiutang();
		this._initialProcessTransactions();
	},

	async _show() {
		table = await $('#tablePiutang').DataTable({
			"processing": true,
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			"createdRow": function (row, data, dataIndex) {
				if (data[4] == 0) {
					$(row).css('color', 'red');

				} else
				if (data[5] == 0) {
					$(row).css('color', 'black');

				}

			},
			select: false,
			"serverSide": true,
			"ajax": {
				"url": ajaxData,
				"type": "POST"
			},
			dom: 'Bfrtip',
			responsive: true,
			"paginate": true,
			"bFilter": true,
			"info": false,
			"bLengthChange": false,
			buttons: [
				'copy', 'csv', 'excel', 'pdf', 'print',
			],
			"columnDefs": [{
					"targets": -1,
					"data": null,
					"defaultContent": `<button class='btn btn-info btn-sm btn-circle' id='viewPenjualan'><i class='fas fa-cog'></i></button>`
				},
				{
					"targets": [0],
					"visible": true,
					"searchable": false
				},
				{
					"targets": [4, -1],
					"orderable": false
				}
			],
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
				let piutang = api
					.column(3)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				let piutang_dibayar = api
					.column(4)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				let piutang_sisa = api
					.column(5)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Update footer
				$(api.column(3).footer()).html(
					'' + formatNumber(piutang) + ''
				);
				$(api.column(4).footer()).html(
					'' + formatNumber(piutang_dibayar) + ''
				);
				$(api.column(5).footer()).html(
					'' + formatNumber(piutang_sisa) + ''
				);
			},
		});
	},

	async _toolsSupport() {
		$('#refresh').click(() => {
			table.ajax.url(ajaxData).load();
		});

		$('#lunas').click(() => {
			table.ajax.url(ajaxData + "?status=1").load();
		});
		$('#belumLunas').click(() => {
			table.ajax.url(ajaxData + "?status=2").load();
		});
		$('#belumBayar').click(() => {
			table.ajax.url(ajaxData + "?status=3").load();
		});

		let btnStylePrint = document.querySelectorAll('.dt-button');
		for (let i = 0; i < btnStylePrint.length; i++) {
			btnStylePrint[i].classList.add("btn");
			btnStylePrint[i].classList.add("btn-light");
		}

		FormatCurrency.initialCurrency({
			elmId: 'bayarTunai'
		})

		document.getElementById('bayarTunai').addEventListener('keyup', () => {
			var bayarTunai = $("#bayarTunai").val();
			var sisa = $("#sisa").val();

			var result = parseInt(reformatNumber(sisa)) - parseInt(reformatNumber(bayarTunai));
			if (!isNaN(result)) {
				document.getElementById('piutangSisa').value = formatNumber(result);
			}
		});
	},

	async _syncData() {
		let oTable = $('#tablePiutang').dataTable();
		oTable.fnDraw(false);
	},

	async _initialViewPenjualan() {
		$('#tablePiutang tbody').on('click', '#viewPenjualan', function () {
			$('#myModalLabel').html("Data Piutang");
			const table = $('#tablePiutang').DataTable();
			let data = table.row($(this).parents('tr')).data();
			(async () => {
				try {
					const faktur = await apiPiutang.getFaktur(data[2]);
					document.getElementById('fakturBayar').value = faktur.data;
				} catch (e) {
					console.log(e.stack);
				}
			})();
			(async () => {
				try {
					const response = await apiPiutang.getPiutangRow(data[2]);
					document.getElementById('datePiutang').innerHTML = response.created_at;
					document.getElementById('lblFakturPiutang').innerHTML = response.faktur_jual;
					document.getElementById('fakturPiutang').value = response.faktur_jual;
					document.getElementById('lblPiutang').value = response.piutang;
					document.getElementById('piutang').value = response.piutang;
					document.getElementById('lblPiutangBayar').value = response.piutang_dibayar;
					document.getElementById('piutangBayar').value = response.piutang_dibayar;
					document.getElementById('lblPiutangSisa').value = response.piutang_sisa;
					document.getElementById('piutangSisa').value = response.piutang_sisa;
					document.getElementById('sisa').value = response.piutang_sisa;
					document.getElementById('tempoPiutang').innerHTML = response.tempo;
					document.getElementById('namaPelanggan').innerHTML = response.pelanggan_id;
					if (response.piutang_sisa == 0) {
						$('#statusPiutang').html('<input id="status" type="button" class="btn btn-success btn-sm" value="Lunas">');
					} else {
						$('#statusPiutang').html('<input id="status" type="button" class="btn btn-warning btn-sm" value="Belum Lunas">');
					}
				} catch (e) {
					console.log(e.stack);
				}
			})();
			$('#modalPenjualan').modal('show');
		});

	},

	async _initialViewPiutang() {
		document.getElementById('bayarPiutang').addEventListener('click', () => {
			let fakturJual = document.getElementById('lblFakturPiutang').innerHTML;
			if (fakturJual != null) {
				(async () => {
					try {
						const faktur = await apiPiutang.getFaktur(fakturJual);
						document.getElementById('fakturBayar').value = faktur.data;
						const response = await apiPiutang.getPiutangRow(fakturJual);
						document.getElementById('piutangBayar').value = response.piutang_dibayar;
						document.getElementById('piutangSisa').value = response.piutang_sisa;
						document.getElementById('sisa').value = response.piutang_sisa;
					} catch (e) {
						console.log(e.stack);
					}
				})();
			}
			$('#myModalLabel2').html("Bayar Piutang");
			$('#modalPiutang').modal('show');
		});
	},

	_notification(msg, status) {
		swal.fire({
			title: `${status}`,
			text: `${msg}`,
			icon: `${status}`,
			confirmButtonColor: '#4fa7f3'
		})
	},

	async _reset() {
		$('#modalPiutang').modal('hide');
		document.getElementById('bayarTunai').value = 0;
		await this._syncData();
	},

	async _initialProcessTransactions() {
		const eventTransaction = async (e) => {
			e.preventDefault();
			try {
				let piutangTerbayar = await FormatCurrency.getValue(document.getElementById('piutangBayar').value);
				let piutangSisa = await FormatCurrency.getValue(document.getElementById('piutangSisa').value);
				let sisa = await FormatCurrency.getValue(document.getElementById('sisa').value);
				let bayarTunai = await FormatCurrency.getValue(document.getElementById('bayarTunai').value);
				const faktur = document.getElementById('fakturBayar').value;
				const fakturPiutang = document.getElementById('fakturPiutang').value;

				if (parseInt(bayarTunai) > parseInt(sisa)) {
					this._notification(`Bayar Tunai Melebihi Sisa Piutang!`, 'warning');
					return;
				}
				const result = await apiPiutang.transactionsPiutang({
					faktur: faktur,
					fakturJual: fakturPiutang,
					piutang_terbayar: piutangTerbayar,
					bayar_tunai: bayarTunai,
					piutang_sisa: piutangSisa,
				});
				if (result == true) {
					this._notification(`Transaksi Berhasil`, 'success');
					(async () => {
						try {
							const response = await apiPiutang.getPiutangRow(fakturPiutang);
							document.getElementById('lblPiutangBayar').value = response.piutang_dibayar;
							document.getElementById('lblPiutangSisa').value = response.piutang_sisa;
							document.getElementById('piutangBayar').value = response.piutang_dibayar;
							document.getElementById('piutangSisa').value = response.piutang_sisa;
							document.getElementById('sisa').value = response.piutang_sisa;
							if (response.piutang_sisa == 0) {
								$('#statusPiutang').html('<input id="status" type="button" class="btn btn-success btn-sm" value="Lunas">');
							} else {
								$('#statusPiutang').html('<input id="status" type="button" class="btn btn-warning btn-sm" value="Belum Lunas">');
							}
						} catch (e) {
							console.log(e.stack);
						}
					})();
					await this._reset();
				}
			} catch (error) {
				console.log(error)
				this._notification(`${error}`, 'error');
			}
		}
		document.getElementById('piutangForm').addEventListener('submit', eventTransaction);
	},
}

export default dataTablePiutangInitiator;
