import dataTableBarangInitiator from "../../presenter/laporan/initial_laporanbarang.js";
import initialSecurity from '../../presenter/setting/initial_security.js'
const LaporanBarang = {
	async render() {
		return `
        <h1 class="h3 mb-2 text-gray-800">Laporan Barang History</h1>

        <div class="card shadow mb-4">

        <a href="#collapseCardExample" class="d-block card-header py-3" data-toggle="collapse" role="button"
            aria-expanded="true" aria-controls="collapseCardExample">
            <h6 class="m-0 font-weight-bold text-primary">Filter Laporan Barang</h6>
        </a>

        <div class="collapse show" id="collapseCardExample">
            <div class="card-body">
                <form id="filterLaporanBarang">
                    <div class="form-group row">
                        <label for="startDate" class="col-sm-2 col-form-label">Tanggal Awal</label>
                        <div class="col-sm-3">
                            <input type="date" class="form-control" id="startDate">
                        </div>
                        <div class="col-sm-3">
                        <select class='form-control' id="pilihStatusBarang">
                            <option value=''>- Pilih Status -</option>
                            <option value='1'>0 - In Stok</option>
                            <option value='2'>1 - Diterima</option>
                            <option value='3'>J - Terjual</option>
                            <option value='4'>S - Servis</option>
                            <option value='5'>R - Rusak</option>
                        </select>
                        </div>
                        </div>
                        <div class="form-group row">
                        <label for="endDate" class="col-sm-2 col-form-label">Tanggal Akhir</label>
                        <div class="col-sm-3">
                            <input type="date" class="form-control" id="endDate">
                        </div>
                        <div class="col-sm-3">
                            <button class="btn btn-success col-sm-12" type="submit" id="filterData" title="Filter Data"><i
                                    class="fas fa-search"></i> Filter [F9]</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        </div>
        <div class="card shadow mb-4">

            <a href="#collapseHistory" class="d-block card-header py-3" data-toggle="collapse" role="button"
                aria-expanded="true" aria-controls="collapseHistory">
                <h6 class="m-0 font-weight-bold text-primary">Info Laporan Barang History</h6>
            </a>

            <div class="collapse show" id="collapseHistory">
                <div class="card-body">
                    <div class="form-group row">
                        <div class="col-sm-6">
                            <table class="table">
                                <tbody>
                                    <tr>
                                        <td style="width:200px;font-weight:700;border: none;">Stock Emas</td>
                                        <td style="width:30px;border: none">:</td>
                                        <td style="border: none;" id="lblTotalInstok">null</td>
                                    </tr>
                                    <tr>
                                        <td style="width:200px;font-weight:700;border: none;">Potensi Penerimaan Uang (Rp)</td>
                                        <td style="width:30px;border: none">:</td>
                                        <td style="border: none;" id="lblTotalInstokRp">null</td>
                                    </tr>
                                    <tr>
                                        <td style="width:200px;font-weight:700;border: none;">Total Berat Stock Emas</td>
                                        <td style="width:30px;border: none">:</td>
                                        <td style="border: none;" id="lblBeratInstok">null</td>
                                    </tr>
                                    <tr>
                                        <td style="width:200px;font-weight:700;border: none;">Emas Diterima</td>
                                        <td style="width:30px;border: none">:</td>
                                        <td style="border: none;" id="lblJumlahBuyback">null</td>
                                    </tr>
                                    <tr>
                                        <td style="width:200px;font-weight:700;border: none;">Nominal Emas Diterima (Rp)</td>
                                        <td style="width:30px;border: none">:</td>
                                        <td style="border: none;" id="lblTotalBuybackRp">null</td>
                                    </tr>
                                    <tr>
                                        <td style="width:200px;font-weight:700;border: none;">Total Berat Emas Diterima</td>
                                        <td style="width:30px;border: none">:</td>
                                        <td style="border: none;" id="lblBeratBuyback">null</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="col-sm-6">
                            <table class="table">
                                <tbody>
                                    <tr>
                                        <td style="width:200px;font-weight:700;border: none;">Jumlah Emas Terjual</td>
                                        <td style="width:30px;border: none">:</td>
                                        <td style="border: none;" id="lblJumlahTerjual">null</td>
                                    </tr>
                                    <tr>
                                        <td style="width:200px;font-weight:700;border: none;">Nominal Yang Diterima (Rp)</td>
                                        <td style="width:30px;border: none">:</td>
                                        <td style="border: none;" id="lblTotalTerjualRp">null</td>
                                    </tr>
                                    <tr>
                                        <td style="width:200px;font-weight:700;border: none;">Total Berat Emas Terjual</td>
                                        <td style="width:30px;border: none">:</td>
                                        <td style="border: none;" id="lblBeratTerjual">null</td>
                                    </tr>
                                    <tr>
                                        <td style="width:200px;font-weight:700;border: none;">Jumlah Emas Diservis</td>
                                        <td style="width:30px;border: none">:</td>
                                        <td style="border: none;" id="lblJumlahServis">null</td>
                                    </tr>
                                    <tr>
                                        <td style="width:200px;font-weight:700;border: none;">Jumlah Emas Rusak</td>
                                        <td style="width:30px;border: none">:</td>
                                        <td style="border: none;" id="lblJumlahRusak">null</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      
      <!-- DataTales Example -->
      <div class="card shadow mb-4">
        <div class="card-header py-3">
            <button class="btn btn-info btn-condensed" id="refresh" title="Refresh Data"><i class="fas fa-sync"></i> Refresh [Ctrl + F5]</button>
        </div>
          <div class="card-body">
              <div class="table-responsive">
                  <table class="table table-bordered" id="tableLaporanBarang" width="100%" cellspacing="0">
                      <thead>
                          <tr>
                            <th>ID</th>
                            <th>Kode Barang</th>
                            <th>Nama Barang</th>
                            <th>Jenis Barang</th>
                            <th>Berat</th>
                            <th>Kadar</th>
                            <th>Status</th>
                            <th>Tgl. Beli</th>
                            <th>Tgl. Jual</th>
                            <th>Tgl. Terima</th>
                            <th>#</th>
                          </tr>
                      </thead>
                  </table>
              </div>
          </div>
      </div> ${this._modalHistoryBarangView()}
`;
	},

	_modalHistoryBarangView() {
		return /*html*/ `<div class="modal fade " id="modalHistory" tabindex="-1" role="dialog" aria-labelledby="EditPostLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content ">
                <div class="modal-header modal-header-primary">
                    <h5 class="modal-title" id="EditPostLabel"><i class="fa fa-check-square-o" aria-hidden="true"></i> Riwayat Transaksi </h5>
                    <button class="close" title="Close modal" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
    
            <div class="modal-body">
            <table class="table">
                        <tr>
                            <td style="width:200px;font-weight:700">Kode Barang</td>
                            <td style="width:30px">:</td>
                            <td id="lblKodeBarang">null</td>
                            <td style="width:200px;font-weight:700">Barang Terjual</td>
                            <td style="width:30px">:</td>
                            <td id="lblTerjual">null</td>
                        </tr>
                        <tr>
                            <td style="font-weight:700">Keterangan Barang</td>
                            <td>:</td>
                            <td id="lblKetBarang">null</td>
                            <td style="width:200px;font-weight:700">Barang Diterima</td>
                            <td style="width:30px">:</td>
                            <td id="lblTerima">null</td>
                        </tr>
                        <tr>
                            <td style="font-weight:700">Berat</td>
                            <td>:</td>
                            <td id="lblBerat">null</td>
                            <td style="width:200px;font-weight:700">Harga</td>
                            <td style="width:30px">:</td>
                            <td id="lblHarga">null</td>
                        </tr>
                    </table>
                <div class="table-responsive">
                <table class="table table-bordered" id="tableHistoryBarang" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tanggal</th>
                            <th>Faktur</th>
                            <th>keterangan</th>
                            <th>Total</th>
                            <th>Ongkos</th>
                            <th>Potongan</th>
                            <th>Service</th>
                            <th>Net</th>
                        </tr>
                    </thead>
                </table>
                </div>
            </div>
            </div>
        </div>
    </div>`
	},


	async afterRender() {
		await this._initialTable();
		await initialSecurity.init({
			statePage: 'laporan_barang'
		})
	},

	async _initialTable() {
		await dataTableBarangInitiator.init();
	},



	_errorContent(container) {
		const errorContent = document.getElementById('main-content');
		errorContent.innerHTML = `<div class="msg-failed">
                             <span class="fa fa-pencil"></span>
                              <p class="center">Maaf , Aplikasi tidak dapat di tampilkan. Periksa kembali internet anda ya &#128522</p>
                             </div>`;
	},

};

export default LaporanBarang;
