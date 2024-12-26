import API_ENDPOINT from '../../config/globals/endpoint.js';
import apiHutang from '../../api/data-hutang.js'
import FormatCurrency from '../../utils/initial-currency.js';
let table;
let ajaxData = `${API_ENDPOINT.LIST_HUTANG}`;

function formatNumber(num) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
}

function reformatNumber(num) {
	const result = num.replace(/[^,\d]/g, '').toString();
	return result;
}

const dataTableHutangInitiator = {

	async init() {
		await this._show();
		await this._toolsSupport();
		this._initialViewPembelian();
		this._initialViewHutang();
		this._initialProcessTransactions();
	},

	async _show() {
		// this._modalSync('#modalPembelian');
		table = await $('#tableHutang').DataTable({
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
					"defaultContent": `<button class='btn btn-info btn-sm btn-circle' id='viewPembelian'><i class='fas fa-cog'></i></button>`
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
				let hutang = api
					.column(3)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				let hutang_dibayar = api
					.column(4)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);
				let hutang_sisa = api
					.column(5)
					.data()
					.reduce(function (a, b) {
						return intVal(a) + intVal(b);
					}, 0);

				// Update footer
				$(api.column(3).footer()).html(
					'' + formatNumber(hutang) + ''
				);
				$(api.column(4).footer()).html(
					'' + formatNumber(hutang_dibayar) + ''
				);
				$(api.column(5).footer()).html(
					'' + formatNumber(hutang_sisa) + ''
				);
			},
		});
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
				document.getElementById('hutangSisa').value = formatNumber(result);
			}
		});
	},

	async _syncData() {
		let oTable = $('#tableHutang').dataTable();
		oTable.fnDraw(false);
	},

	async _initialViewHutang() {
		document.getElementById('bayarHutang').addEventListener('click', () => {
			let fakturBeli = document.getElementById('lblFakturHutang').innerHTML;
			if (fakturBeli != null) {
				(async () => {
					try {
						const faktur = await apiHutang.getFaktur(fakturBeli);
						document.getElementById('fakturBayar').value = faktur.data;
						const response = await apiHutang.getHutangRow(fakturBeli);
						document.getElementById('hutangBayar').value = response.hutang_dibayar;
						document.getElementById('hutangSisa').value = response.hutang_sisa;
						document.getElementById('sisa').value = response.hutang_sisa;
					} catch (e) {
						console.log(e.stack);
					}
				})();
			}
			$('#myModalLabel2').html("Bayar Hutang");
			$('#modalHutang').modal('show');
		});
	},

	async _initialViewPembelian() {
		$('#tableHutang tbody').on('click', '#viewPembelian', function () {
			$('#myModalLabel').html("Data Hutang");
			const table = $('#tableHutang').DataTable();
			let data = table.row($(this).parents('tr')).data();
			(async () => {
				try {
					const faktur = await apiHutang.getFaktur(data[2]);
					document.getElementById('fakturBayar').value = faktur.data;
				} catch (e) {
					console.log(e.stack);
				}
			})();
			(async () => {
				try {
					const response = await apiHutang.getHutangRow(data[2]);
					document.getElementById('dateHutang').innerHTML = response.created_at;
					document.getElementById('lblFakturHutang').innerHTML = response.faktur_beli;
					document.getElementById('fakturHutang').value = response.faktur_beli;
					document.getElementById('lblHutang').value = response.hutang;
					document.getElementById('hutang').value = response.hutang;
					document.getElementById('lblHutangBayar').value = response.hutang_dibayar;
					document.getElementById('hutangBayar').value = response.hutang_dibayar;
					document.getElementById('lblHutangSisa').value = response.hutang_sisa;
					document.getElementById('hutangSisa').value = response.hutang_sisa;
					document.getElementById('sisa').value = response.hutang_sisa;
					document.getElementById('tempoHutang').innerHTML = response.tempo;
					document.getElementById('namaSupplier').innerHTML = response.supplier_id;
					if (response.hutang_sisa == 0) {
						$('#statusHutang').html('<input id="status" type="button" class="btn btn-success btn-sm" value="Lunas">');
					} else {
						$('#statusHutang').html('<input id="status" type="button" class="btn btn-warning btn-sm" value="Belum Lunas">');
					}
				} catch (e) {
					console.log(e.stack);
				}
			})();
			$('#modalPembelian').modal('show');
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
		$('#modalHutang').modal('hide');
		document.getElementById('bayarTunai').value = 0;
		await this._syncData();
	},

	async _initialProcessTransactions() {
		const eventTransaction = async (e) => {
			e.preventDefault();
			try {
				let hutangTerbayar = await FormatCurrency.getValue(document.getElementById('hutangBayar').value);
				let sisa = await FormatCurrency.getValue(document.getElementById('sisa').value);
				let hutangSisa = await FormatCurrency.getValue(document.getElementById('hutangSisa').value);
				let bayarTunai = await FormatCurrency.getValue(document.getElementById('bayarTunai').value);
				const faktur = document.getElementById('fakturBayar').value;
				const fakturHutang = document.getElementById('fakturHutang').value;

				if (parseInt(bayarTunai) > parseInt(sisa)) {
					this._notification(`Bayar Tunai Melebihi Sisa Hutang!`, 'warning');
					return;
				}
				const result = await apiHutang.transactionsHutang({
					faktur: faktur,
					fakturBeli: fakturHutang,
					hutang_terbayar: hutangTerbayar,
					bayar_tunai: bayarTunai,
					hutang_sisa: hutangSisa,
				});
				console.log(result);
				if (result == true) {
					this._notification(`Transaksi Berhasil`, 'success');
					(async () => {
						try {
							const response = await apiHutang.getHutangRow(fakturHutang);
							document.getElementById('lblHutangBayar').value = response.hutang_dibayar;
							document.getElementById('lblHutangSisa').value = response.hutang_sisa;
							document.getElementById('hutangBayar').value = response.hutang_dibayar;
							document.getElementById('hutangSisa').value = response.hutang_sisa;
							document.getElementById('sisa').value = response.hutang_sisa;
							if (response.hutang_sisa == 0) {
								$('#statusHutang').html('<input id="status" type="button" class="btn btn-success btn-sm" value="Lunas">');
							} else {
								$('#statusHutang').html('<input id="status" type="button" class="btn btn-warning btn-sm" value="Belum Lunas">');
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
		document.getElementById('hutangForm').addEventListener('submit', eventTransaction);
	},
}

export default dataTableHutangInitiator;
