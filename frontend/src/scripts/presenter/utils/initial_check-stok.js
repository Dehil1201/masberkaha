import API_ENDPOINT from '../../config/globals/endpoint.js';
import ApiCheckStok from '../../api/data-checkstok.js';

function padLeadingZeros(num, size) {
	var s = num + "";
	while (s.length < size) s = "0" + s;
	return s;
}

const CheckStokInitiator = {

	async init() {
		await this._show();
		await this._resetStatusCheck();
		this._initialCheckStok();
		this._syncData();
	},

	async _show() {
		let table = await $('#tableCheckStok').DataTable({
			"processing": true,
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			"serverSide": true,
			"ajax": {
				"url": `${API_ENDPOINT.LIST_STOK_UNCHECKED}`,
				"type": "POST"
			},
			dom: "BPlfrtip",
			lengthChange: true,
			"lengthMenu": [25, 50, 100, 250, 500, 1000],
			buttons: [
				'copy', 'csv', 'excel', 'pdf', 'print',
			],
			"columnDefs": [{
				"targets": [0],
				"visible": true,
				"searchable": false
			}]
		});

		$('#refresh').click(() => {
			let oTable = $('#tableCheckStok').dataTable();
			oTable.fnDraw(false);
		});

		let btnStylePrint = document.querySelectorAll('.dt-button');
		for (let i = 0; i < btnStylePrint.length; i++) {
			btnStylePrint[i].classList.add("btn");
			btnStylePrint[i].classList.add("btn-light");
		}
	},

	async _initialCheckStok() {
		const checkStok = async () => {
			const valueBarcode = document.getElementById('barcodeBarang').value;
			if (valueBarcode.length < 8) {
				document.getElementById("barcodeBarang").value = valueBarcode.substr(0, 1) + padLeadingZeros(valueBarcode.substr(1, 7), 7);
			}
			const barcodeBarang = document.getElementById('barcodeBarang').value;
			const result = await ApiCheckStok.checkStok(barcodeBarang);
			if (result == true) {
				this._notification(`Kode barang ${barcodeBarang} Berhasil dicheck`, 'success');
				await this._syncData();
			} else {
				this._notification(result.message, 'error');
				await this._syncData();
			}
		}

		const barcodeToUpper = async () => {
			const condBarcode = document.getElementById('barcodeBarang').value;
			document.getElementById("barcodeBarang").value = condBarcode.toUpperCase();
		}

		document.getElementById('barcodeBarang').addEventListener('input', barcodeToUpper)
		document.getElementById('barcodeBarang').addEventListener('change', checkStok)
	},

	async _resetStatusCheck() {
		document.getElementById('recheckStok').addEventListener('click', () => {
			swal.fire({
				title: 'Hapus',
				html: "Anda ingin Check Stok Dari Awal?",
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Ya, Hapus!'
			}).then(async (result) => {
				if (result.value) {
					const response = await ApiCheckStok.recheckStok();;
					if (response == false) {
						this._notification('Stok barang sudah di reset!', 'error')
					} else {
						this._notification('Data stok berhasil di reset, Silahkan check ulang', 'success')
						this._syncData();
					}
				};
			});
		});
	},

	async _syncData() {
		let oTable = $('#tableCheckStok').dataTable();
		oTable.fnDraw(false);
		document.getElementById("barcodeBarang").value = '';
	},

	_notification(msg, status) {
		swal.fire({
			title: `${status}`,
			text: `${msg}`,
			icon: `${status}`,
			showConfirmButton: false,
			timer: 1500
		})
	},
}

export default CheckStokInitiator;
