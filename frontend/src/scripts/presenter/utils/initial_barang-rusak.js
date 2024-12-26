import API_ENDPOINT from '../../config/globals/endpoint.js';
const dataTableBarangRusakInitiator = {

	async init() {
		await this._show();
	},

	async _show() {
		let table = await $('#tableBarangRusak').DataTable({
			"processing": true,
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			"serverSide": true,
			"ajax": {
				"url": `${API_ENDPOINT.LIST_BARANG_RUSAK}`,
				"type": "POST"
			},
			dom: 'Bfrtip',
			lengthChange: false,
			buttons: [
				'copy', 'csv', 'excel', 'pdf', 'print',
			],
			"columnDefs": [
				{
					"targets": [0],
					"visible": true,
					"searchable": false
				}
			]
		});

		$('#refresh').click(() => {
			let oTable = $('#tableBarangRusak').dataTable();
			oTable.fnDraw(false);
		});

		let btnStylePrint = document.querySelectorAll('.dt-button');
		for (let i = 0; i < btnStylePrint.length; i++) {
			btnStylePrint[i].classList.add("btn");
			btnStylePrint[i].classList.add("btn-light");
		}
	},

	async _syncData() {
		let oTable = $('#tableBarangRusak').dataTable();
		oTable.fnDraw(false);
	},

	_notification(msg, status) {
		swal.fire({
			title: `${status}`,
			text: `${msg}`,
			icon: `${status}`,
			confirmButtonColor: '#4fa7f3'
		})
	},
}




export default dataTableBarangRusakInitiator;
