import API_ENDPOINT from '../../config/globals/endpoint.js';
import apiPelanggan from '../../api/datapelanggan.js'
const dataTablePelangganInitiator = {

	async init() {
		await this._show();
		this._initialCreate();
		this._initialUpdate();
		this._initForSubmit();
		this._initialDelete();
		this._printMemberCard();
	},

	async _show() {
		let table = await $('#tablePelanggan').DataTable({
			"processing": true,
			'language': {
				'loadingRecords': '&nbsp;',
				'processing': '<div class="spinner"></div>'
			},
			"serverSide": true,
			"ajax": {
				"url": `${API_ENDPOINT.LIST_PELANGGAN}`,
				"type": "POST"
			},
			dom: 'Bfrtip',
			lengthChange: false,
			buttons: [
				'copy', 'csv', 'excel', 'pdf', 'print',
			],
			"columnDefs": [{
				"targets": -1,
				"data": null,
				"defaultContent": `<div style="display:flex"><button style="margin:6px" class='btn btn-info btn-circle' id='edit' title='Edit data pelanggan'><i class='far fa-edit'></i></button>
                     <button style="margin:6px" class='btn btn-danger btn-circle' id='delete' title='Hapus data pelanggan'><i class='fas fa-trash'></i></button></div>`
			},
			{
				"targets": [0],
				"visible": true,
				"searchable": false
			}
			]
		});

		$('#refresh').click(() => {
			let oTable = $('#tablePelanggan').dataTable();
			oTable.fnDraw(false);
		});

		let btnStylePrint = document.querySelectorAll('.dt-button');
		for (let i = 0; i < btnStylePrint.length; i++) {
			btnStylePrint[i].classList.add("btn");
			btnStylePrint[i].classList.add("btn-light");
		}
	},

	async _syncData() {
		let oTable = $('#tablePelanggan').dataTable();
		oTable.fnDraw(false);
	},

	async _syncView() {
		$('#modalData').modal('hide');
		$('#pelangganForm').trigger("reset");
	},

	async _setAutoKodePelanggan() {
		const kode = await apiPelanggan.getKodePelanggan();
		document.getElementById('kode_pelanggan').value = kode.data;
	},

	async _initialUpdate() {
		$('#tablePelanggan tbody').on('click', '#edit', function () {

			$('#myModalLabel').html("Ubah Pelanggan");
			const table = $('#tablePelanggan').DataTable();
			let data = table.row($(this).parents('tr')).data();
			$('#btn-save').html('<i class="fa fa-check-square-o"></i> Simpan');
			$('#btn-save').val('simpan');
			$('#modalData').modal('show');
			$('#pelanggan_id').val(data[0]);
			$('#kode_pelanggan').val(data[1]);
			$('#nama_pelanggan').val(data[2]);
			$('#kode_pelanggan').attr('readonly', true);
			$('#alamat').val(data[3]);
			$('#kota').val(data[4]);
			$('#no_hp').val(data[5]);
			$('#email').val(data[6]);
			$('#point').val(data[7]);
			$('#pelangganForm').attr("data-action", "update");
		});

	},

	async _initialCreate() {
		$('#modalData').on('shown.bs.modal', function () {
			$('#nama_pelanggan').focus();
		});
		document.getElementById('create_data').addEventListener('click', () => {
			this._setAutoKodePelanggan();
			$('#btn-save').html('<i class="fa fa-check-square-o"></i> Tambah');
			$('#btn-save').val('tambah');
			$('#pelanggan_id').val('');
			$('#pelangganForm').trigger("reset");
			$('#kode_pelanggan').attr('readonly', false);
			$('#myModalLabel').html("Tambah Pelanggan");
			$('#modalData').modal('show');
			$('#pelangganForm').attr("data-action", "create"); //for state create
		});
	},

	async _initialDelete() {
		$('#tablePelanggan tbody').on('click', '#delete', function () {
			const table = $('#tablePelanggan').DataTable();
			let data = table.row($(this).parents('tr')).data();

			swal.fire({
				title: 'Hapus',
				html: "Anda ingin menghapus data ini? <br> <strong>Nama Pelanggan </strong>: " + data[1],
				icon: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Ya, Hapus!'
			}).then(async (result) => {
				if (result.value) {
					let id = data[0];
					const status = await apiPelanggan.deletePelanggan(id);

					if (status === '200') {
						swal.fire({
							title: 'Hapus',
							text: 'Data berhasil dihapus',
							icon: 'success',
							showConfirmButton: false,
							timer: 1000
						});
						//refres manual 
						let oTable = $('#tablePelanggan').dataTable();
						oTable.fnDraw(false);
						$(this).parents('tr').fadeOut(300);
					}
				};
			});
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

	async _initForSubmit() {
		const eventForm = async (e) => {
			e.preventDefault();
			const stateForm = document.getElementById('pelangganForm').dataset.action;

			if (stateForm === 'create') {
				this._createPelanggan();
			} else if (stateForm === 'update') {
				this._updatePelanggan();
			}
			await this._syncData();
			document.getElementById('refresh').dispatchEvent(new Event('click'));
		}
		document.getElementById('pelangganForm').addEventListener('submit', eventForm);
	},

	async _createPelanggan() {
		const status = await apiPelanggan.addPelanggan(new FormData(document.getElementById('pelangganForm')));
		if (status === '200') {
			this._notification('Succes Menambahkan Data', 'success');
			this._syncView();
		} else {
			this._notification('Maaf Ada masalah Didalam Server ...', 'error');
		}
	},

	async _updatePelanggan() {
		const status = await apiPelanggan.updatePelanggan(new FormData(document.getElementById('pelangganForm')));
		if (status === '200') {
			this._notification('Succes Mengedit Data', 'success');
			this._syncView();
		} else {
			this._notification('Maaf Ada masalah Didalam Server ...', 'error');
		}
	},

	async _printMemberCard() {

		const printMemberCard = document.getElementById('printMemberCard')
		printMemberCard.addEventListener('click', async () => {
			let fromValue = document.getElementById("startNumberCard").value
			let toValue = document.getElementById('endNumberCard').value
			if (fromValue > toValue) {
				this._notification("maaf jumlah cetak data tidak valid")
			} else {
				let elmCss = `<style>
				.printResultNumber{
					text-align = center;
					pading : 10pt;
				}

				:root {
			--blue: hsl(212, 86%, 64%);
		}
				
				.container-new{
					margin-top:1cm;
					width: 8.56cm;
					color:black;
					height: 5.39cm;
					box-shadow: 0 1px 2px 0 rgba(0,0,0,.15);
					position: relative;
				}
				.headDesign{
					height: 1cm;
					text-align: center;
					font-weight: bold;
					line-height: 24pt;
				}
				.footerDesign{
					height: 1cm;
					width: 100%;
					position: absolute;
					box-shadow: 0 1px 2px 0 rgba(0,0,0,.15);
					bottom: 0;
					background-color: #4e73df
				}
				.box{
					border-top: 3px solid var(--blue);
				}
		
				.barcode{
					text-align: center;
				}
		
				.code-customer{
					margin-top:10px;
					margin-left: 5px;
					text-decoration: underline;
					font-size: 20pt;
					line-height: 0;
					text-align: center;
					font-weight: bold;
				}
				.container-barcode{
				   text-align: center;
				}</style>`;
				let elmCard = ``

				for (fromValue = fromValue; fromValue <= toValue; fromValue++) {
					var str = "" + fromValue
					var pad = "P000000"
					var ans = pad.substring(0, pad.length - str.length) + str
					elmCard += `<div class="container-new">
						<div class="headDesign box">Toko Mas Asih</div>
						<p class="code-customer">${ans}</p>
						<div class="container-barcode">
							<svg id="barcode${ans}"></svg>
						</div>
						<div class="footerDesign"></div>
					</div>`;
				}
				fromValue = document.getElementById("startNumberCard").value;
				document.getElementById('printResultMember').innerHTML = elmCss + elmCard;

				for (fromValue = fromValue; fromValue <= toValue; fromValue++) {
					console.log('hello')
					var str = "" + fromValue
					var pad = "P000000"
					var ans = pad.substring(0, pad.length - str.length) + str


					await JsBarcode(`#barcode${ans}`, `${ans}`, {
						width: 2,
						fontSize: 14,
						height: 40,
						text: `${ans}`,
						textAlign: "left",
						fontSize: 14,
						font: "arial",
						fontOptions: "bold",
						margin: 10,
						displayValue: false
					});
				}

				jQuery('#printResultMember').print();
				document.getElementById('printResultMember').innerHTML = '';
			}
		})

	},


}




export default dataTablePelangganInitiator;
