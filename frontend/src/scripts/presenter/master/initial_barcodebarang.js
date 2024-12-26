import API_ENDPOINT from '../../config/globals/endpoint.js';
import FormatBarcode from '../../utils/prints-barcode.js';
import apiBarang from '../../api/data-barang.js';

const dataTableBarcodeBarangInitiator = {

	async init() {
		await this._show();
		await FormatBarcode.makeStore();
		await this._initialChoose();
		await this._initialPrintSelected();
		this._setDate();
		await this._checkAllEvent();
		await this.initFilterListBarang();
		await this._refreshData();
		this._getJenisBarang();
	},

	async _refreshData() {
		document.getElementById('refresh').addEventListener('click', () => {
			this._show();
			$('#pilihTransaksi').prop('selectedIndex', 0);
			$('#pilih_jenis').prop('selectedIndex', 0);
			this._setDate();
		});
	},

	async _show() {
		document.getElementById('startDate').focus();
		let table = await $('#tableBarcodeBarang').DataTable({
			"pageLength": 50,
			"processing": true,
			"destroy": true,
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			"serverSide": true,
			"ajax": {
				"url": `${API_ENDPOINT.LIST_BARANG_BARCODE}`,
				"type": "POST"
			},
			"fnDrawCallback": function (data) {
				let rowTable = data.aoData;
				const checked = document.getElementById('select-all').checked;
				if (checked) {
					document.getElementById('select-all').checked = false;
				}
				$('#tableBarcodeBarang tbody tr').each(function (e) {
					if (rowTable[e] !== undefined) {
						let result = rowTable[e]._aData[1];
						let isChecked = FormatBarcode.isReady(result);
						if (isChecked) {
							$(this).addClass('selected');
						}
					}
				})
			},
			dom: 'Blfrtip',
			lengthChange: true,
			buttons: [
				'copy', 'csv', 'excel', 'pdf', 'print',
			],
			select: {
				style: 'multi',
				selector: 'td:first-child'
			},
			order: [
				[1, 'asc']
			],
			"columnDefs": [{
					"targets": 0,
					"orderable": false,
					className: 'select-checkbox',
					"data": null,
					"defaultContent": ``
				},
				{
					"targets": [0],
					"visible": true,
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

	async initFilterListBarang() {
		const eventFilterListBarang = async (e) => {
			e.preventDefault();
			await this._filterDataListBarang();
		}

		document.getElementById('filterListBarang').addEventListener('submit', eventFilterListBarang);
	},

	async _getJenisBarang() {
		let elmData = '';
		const dataAkses = await apiBarang.getJenisBarang();
		dataAkses.data.forEach(data => {
			elmData += `<option value="${data[1]}">${data[1]}</li>`;
		});
		$("#pilih_jenis").html('<option selected value>-- Semua Devisi --</option>' + elmData);
	},

	async _filterDataListBarang() {
		const starDateValue = await document.getElementById('startDate').value;
		const endDateValue = await document.getElementById('endDate').value;
		const modeTransaksi = await document.getElementById('pilihTransaksi').value;
		const jenisBarang = await document.getElementById('pilih_jenis').value;
		await $('#tableBarcodeBarang').DataTable({
			"pageLength": 50,
			"processing": true,
			"destroy": true,
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			"serverSide": false,
			"ajax": {
				"url": `${API_ENDPOINT.LIST_BARANG_BARCODE}`,
				"data": {
					mode: modeTransaksi,
					jenis_barang: jenisBarang,
					startDate: starDateValue,
					endDate: endDateValue
				},
				"type": "POST"
			},
			dom: 'Blfrtip',
			lengthChange: true,
			buttons: [
				'copy', 'csv', 'excel', 'pdf', 'print',
			],
			select: {
				style: 'multi',
				selector: 'td:first-child'
			},
			order: [
				[1, 'asc']
			],
			"columnDefs": [{
					"targets": 0,
					"orderable": false,
					className: 'select-checkbox',
					"data": null,
					"defaultContent": ``
				},
				{
					"targets": [0],
					"visible": true,
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

	async _setDate() {
		document.getElementById('startDate').valueAsDate = new Date();
		document.getElementById('endDate').valueAsDate = new Date();
	},

	async _initialChoose() {
		$('#tableBarcodeBarang tbody').on('click', '.select-checkbox', async function (e) {
			e.stopPropagation();
			const table = $('#tableBarcodeBarang').DataTable();
			let data = table.row($(this).parents('tr')).data();
			let kodeBarang = data[1];
			let beratBarang = data[4];
			let kadarBarang = data[5];
			let hargaJual = data[6];

			if ($(this).parents('tr').hasClass("selected")) {
				await FormatBarcode.deleteData(kodeBarang);

				$(this).parents('tr').removeClass('selected');
				const countData = await FormatBarcode.size();
				document.getElementById('print-out').innerHTML = ` Print ${countData == 0 ? ' [Ctrl + F10]': `${countData} Data [Ctrl + F10]`}`

			} else {
				await FormatBarcode.pushData({
					kode_barang: kodeBarang,
					berat: beratBarang,
					kadar: kadarBarang,
					harga_jual: hargaJual
				});
				$(this).parents('tr').addClass('selected');
				const countData = await FormatBarcode.size();
				document.getElementById('print-out').innerHTML = ` Print ${countData == 0 ? ' [Ctrl + F10]': `${countData} Data [Ctrl + F10]`}`
			}
		});
	},

	async _initialPrintSelected() {
		const eventPrint = async () => {
			const result = await FormatBarcode.getData();

			if (result.length == 0) {
				this._notification('Silahkan checklist dulu yang akan di cetak barcodenya!', 'error', true, 2500);
			} else {
				await this._renderBarcode(result);
				await this._afterRenderBarcode(result);
				await this._printOut();
			}
		}
		document.getElementById('print-out').addEventListener('click', eventPrint);
	},

	async _printOut() {
		jQuery('#printResultBarcode').print();
		document.getElementById('printResultBarcode').innerHTML = '';
	},

	async _renderBarcode(result) {

		let elmHtml = `<style type="text/css">
		pre{font-weight:700}
		@media print{
			@page{margin:0;size: A4;}
			
		}
		.pagebreak { 
			page-break-before: always;
			page-break-inside: avoid;
		}
		#printResultBarcode{
			padding : 0 0 0 4mm;
		}
		
		.container-barcode{
			width:21cm;
			height:16cm;
			box-sizing: border-box;
			margin-top:3mm;
			margin-left:21.3mm;
			margin-right:21.3mm;
		}

		</style>`;

		let indexCustom = document.getElementById('index-print-custom').value;
		if (indexCustom === '') {
			indexCustom = 0;
		} else {
			indexCustom = indexCustom - 1;
		}


		let number = 0;
		let fakeResult = [];
		for (let index = 0; index < indexCustom; index++) {
			let gold = {
				"kode_barang": `A0000126`,
				"berat": `1`,
				"kadar": `925`,
				"harga_jual": `Rp.35.000`
			}
			fakeResult.push(gold)

		}

		await result.forEach((data) => {
			fakeResult.push(data)
		})

		let elmContanainer = `<div class='col-sm-12'
		 style="
		 height:16cm;
		 box-sizing: border-box;
		 margin-top:8mm;
		 margin-left:-17mm;
		 margin-right:0;"
		id='print-result-barcode'>`;
		elmHtml += `${elmContanainer}`

		fakeResult.forEach((data) => {
		    console.log(data);
			let beratCustom = '';
			let hrLine = '';

			if (data.berat != '') {
				beratCustom = `${data.berat} g`;
				//hrLine = '<hr style="margin:0px; padding:0;border-top:solid 1px #000;">';
			}
			console.log(data)
			let elmHtmlConsistent = `<div class="node-barcode" 
				style="float: left;
				height:126px;
				width:140px;
				margin-top:4mm;
				margin-left: 10mm;
				margin-right: -7mm;
				pading:300px;
				box-sizing: border-box;
				margin-bottom :-15px;
				border:1px">
				<svg style="margin:0px;" id="barcode${data.kode_barang}"></svg>
				${hrLine}
					<div class="barcode-berat"><b>
						<span style="font-size:15pt; font-weight:700;color:#000;padding-left:15px;">${beratCustom}</span>
						</b> (${data.kadar})
						<span style="font-size:11pt;color:#000;padding-left:15px;">Rp.${data.harga_jual}</span>
						</b>
					</div>
				</div>`;

			if (number % 42 === 0) {
				if (number !== 0) {
					elmHtml += `</div><div class="pagebreak" style="margin-top : 0px;" ><div>
					${elmContanainer } ${elmHtmlConsistent}`
					
				} else {
					elmHtml += `${elmHtmlConsistent}`
				}
			} else {
				elmHtml += `${elmHtmlConsistent}`
			}
			number++;
		});



		document.getElementById('printResultBarcode').innerHTML = elmHtml + `</div>`;
	},

	async _afterRenderBarcode(result) {
		await result.forEach(async (data) => {
			await JsBarcode(`#barcode${data.kode_barang}`, `${data.kode_barang}`, {
				width: 1,
				height: 25,
				textPosition: "bottom",
				text: `${data.kode_barang}`,
				textAlign: "left",
				fontSize: 14,
				margin:14,
				fontOptions: "bold",
			});
		});
	},

	_notification(msg, status, button, timer) {
		swal.fire({
			title: `${status}`,
			text: `${msg}`,
			icon: `${status}`,
			showConfirmButton: `${button}`,
			timer: `${timer}`
		})
	},

	async _checkAllEvent() {
		const eventSelectAll = async () => {
			const element = document.querySelectorAll(".select-checkbox");
			const checked = document.getElementById('select-all').checked;
			for (let index = 1; index < element.length; index++) {
				const beratBarang = element[index].nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML;
				const kadarBarang = element[index].nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML;
				const hargaJual = element[index].nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML;
				const kodeBarang = element[index].nextElementSibling.innerHTML;
				if (checked) {
					if (!element[index].parentNode.classList.contains('selected')) {
						if (status !== 'J') {
							await FormatBarcode.pushData({
								kode_barang: kodeBarang,
								berat: beratBarang,
								kadar: kadarBarang,
								harga_jual: hargaJual
							});
							element[index].parentNode.classList.add('selected');
						}
					}
				} else {
					await FormatBarcode.deleteData(kodeBarang);
					element[index].parentNode.classList.remove('selected');
				}
				await this._renderCountStorageBarang();
			}
		}

		document.getElementById('select-all').addEventListener('change', eventSelectAll)

	},

	async _renderCountStorageBarang(count) {
		const countData = await FormatBarcode.size();
		document.getElementById('print-out').innerHTML = ` Print ${countData == 0 ? ' [Ctrl + F10]': `${countData} Data [Ctrl + F10]`}`
	}
}




export default dataTableBarcodeBarangInitiator;
