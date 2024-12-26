import API_ENDPOINT from '../../config/globals/endpoint.js';
import FormatCurrency from '../../utils/initial-currency.js';
import ApiTransaksiServices from './../../api/data-transaksi-services.js';
import UrlParser from '../../routes/url-parser.js';

const initialServices = {

	async init() {
		this._setDefault();
		await this._setFaktur();
		await this._showPelanggan();
		await this._chooseEvent();
		await this._setFormEvent();
		await this._showTransaksiServices();
		await this._setFormEvent();
		this._initialShortcut();
	},


	async _showPelanggan() {
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
					"visible": true,
					"searchable": false
				},
			]
		});
	},

	async _showTransaksiServices() {
		await $('#table-services').DataTable({
			"processing": true,
			"destroy": true,
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			"serverSide": true,
			"ajax": {
				"url": `${API_ENDPOINT.LIST_DATA_SERVICE}`,
				"type": "POST"
			},
			dom: 'Bfrtip',
			lengthChange: false,
			buttons: [
				'copy', 'csv', 'excel', 'pdf', 'print',
			],
			lengthChange: false,
			"columnDefs": [{
				"targets": [0],
				"visible": true,
				"searchable": false
			}, ]
		});

		let btnStylePrint = document.querySelectorAll('.dt-button');
		for (let i = 0; i < btnStylePrint.length; i++) {
			btnStylePrint[i].classList.add("btn");
			btnStylePrint[i].classList.add("btn-light");
		}
	},

	async _chooseEvent() {
		$('#tablePelanggan tbody').on('click', '#addPelanggan', async function () {
			const table = $('#tablePelanggan').DataTable();
			let data = table.row($(this).parents('tr')).data();
			$('#namaPelanggan').val(data[1]);
			$('#idPelanggan').val(data[1]);
			$('#modalPelanggan').modal('hide');
		});
	},

	async _setPrice(idHtml) {
		FormatCurrency.initialCurrency({
			elmId: `${idHtml}`
		})

	},

	async _setFaktur() {
		const faktur = await ApiTransaksiServices.getFaktur();
		document.getElementById('faktur').value = faktur.data;
	},

	_setDefault() {
		document.getElementById('date').valueAsDate = new Date();
	},


	async _setFormEvent() {
		await this._setPrice('grandTotal');
		await this._setPrice('bayar');
		await this._setPrice('kembalian');

		const eventBayar = async () => {
			let grandTotal = await FormatCurrency.getValue(document.getElementById('grandTotal').value);
			let payValue = await FormatCurrency.getValue(document.getElementById('bayar').value);
			let exchange = payValue - grandTotal;
			document.getElementById('kembalian').value = await FormatCurrency.setValue(exchange);

			if (parseInt(exchange) < 0) {
				document.getElementById('kembalian').value = await FormatCurrency.setValue('0');
			}
		}

		const eventForm = async (e) => {
			e.stopImmediatePropagation();;
			e.preventDefault();
			try {
				let grandTotal = await FormatCurrency.getValue(document.getElementById('grandTotal').value);
				let payValue = await FormatCurrency.getValue(document.getElementById('bayar').value);
				let exchange = payValue - grandTotal;

				if (parseInt(exchange) < 0) {
					throw ' Maaf Bayaran Anda Kurang :) ';
				}

				const result = await ApiTransaksiServices.transactionsPayment({
					faktur: document.getElementById('faktur').value,
					pelanggan_id: document.getElementById('idPelanggan').value,
					tanggal: document.getElementById('date').value,
					grand_total: grandTotal,
					bayar: payValue,
					kembali: exchange,
					user_id: document.getElementById('user-id').value,
					kerusakan: document.getElementById('kerusakan').value,
					status_servis: 1
				});



				this._notification(`Transaksi Berhasil`, 'success');
				await this._reset();
			} catch (error) {
				console.log(error)
				this._notification(`${error}`, 'error');
			}
		}

		document.getElementById('bayar').addEventListener('keyup', eventBayar);
		document.getElementById('serviceForm').addEventListener('submit', eventForm);

	},

	async _reset() {
		$('#modalService').modal('hide');
		document.getElementById('serviceForm').reset();
		await this.init();
	},

	_notification(msg, status) {
		swal.fire({
			title: `${status}`,
			text: `${msg}`,
			icon: `${status}`,
			confirmButtonColor: '#4fa7f3'
		});
	},

	async _initialShortcut() {
		const url = UrlParser.parseActiveUrlWithCombiner();
		if (url.includes('/tfservice')) {
			const eventShortcutServis = async (event) => {
				try {
					if (event.ctrlKey && event.key === "F6") {
						if (!(document.activeElement.hasAttribute('required'))) {
							document.getElementById('create_data').click();
						}
					} else if (event.ctrlKey && event.key === "F7") {
						if (!(document.activeElement.hasAttribute('required'))) {
							document.getElementById('pilihPelanggan').click();
						}
					}
				} catch (error) {
					console.log(error);
				}
			}
			document.addEventListener('keyup', eventShortcutServis);
		}
	},
}

export default initialServices;
