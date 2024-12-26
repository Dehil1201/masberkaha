import LaporanPerbarangInitiator from "../../presenter/utils/laporan-perbarang-presenter.js";
import initialSecurity from "../../presenter/setting/initial_security.js";
const LaporanBuybackPerbarang = {
	async render() {
		return `
        <h1 class="h3 mb-2 text-gray-800">Laporan Terima Kembali / Barang</h1>

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
                            <select class='form-control' id="pilihPelanggan"></select>
                        </div>
                        <div class="col-sm-2">
                            <select class='form-control' id="pilihUser"></select>
                        </div>
                    </div>
                    <div class="form-group row">
                        <label for="endDate" class="col-sm-2 col-form-label">Tanggal Akhir</label>
                        <div class="col-sm-3">
                            <input type="date" class="form-control" id="endDate">
                        </div>
                        <div class="col-sm-3">
                            <select class='form-control' id="pilihDevisi"></select>
                        </div>
                        <div class="col-sm-2">
                            <select class='form-control' id="pilihStatus">
                                    <option value=''> -- Pilih Status -- </option>
                                    <option value='nol'>0</option>
                                    <option value='1'>1</option>
                                    <option value='S'>S</option>
                                    <option value='R'>R</option>
                            </select>
                        </div>
                        <div class="col-sm-2">
                            <button class="btn btn-success col-sm-12" type="submit" id="filterData" title="Filter Data"><i
                                    class="fas fa-search"></i> Filter [F9]</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        </div>
        <div class="card shadow mb-4">
            <a href="#collapseInfoBuyback" class="d-block card-header py-3" data-toggle="collapse" role="button"
                aria-expanded="true" aria-controls="collapseInfoBuyback">
                <h6 class="m-0 font-weight-bold text-primary">Info Beli Kembali</h6>
            </a>

            <div class="collapse show" id="collapseInfoBuyback">

                <div class="card-body">
                    <div class="col-sm-12">
                        <div class="form-group row">
                            <div class="col-sm-12">
                                <table class="table">
                                    <tbody>
                                        <tr>
                                            <td style="width:200px;font-weight:700;border: none;">Emas Diterima</td>
                                            <td style="width:30px;border: none">:</td>
                                            <td style="border: none;" id="lblJumlahBuyback">null</td>
                                            <td style="width:200px;font-weight:700;border: none;">Potongan</td>
                                            <td style="width:30px;border: none">:</td>
                                            <td style="border: none;" id="totalPotongan">null</td>
                                        </tr>
                                        <tr>
                                            <td style="width:200px;font-weight:700;border: none;">Nominal Emas Diterima (Rp)
                                            </td>
                                            <td style="width:30px;border: none">:</td>
                                            <td style="border: none;" id="lblTotalBuybackRp">null</td>
                                            <td style="width:200px;font-weight:700;border: none;">Servis</td>
                                            <td style="width:30px;border: none">:</td>
                                            <td style="border: none;" id="totalServis">null</td>
                                        </tr>
                                        <tr>
                                            <td style="width:200px;font-weight:700;border: none;">Total Berat Emas Diterima</td>
                                            <td style="width:30px;border: none">:</td>
                                            <td style="border: none;" id="lblBeratBuyback">null</td>
                                            <td style="width:200px;font-weight:700;border: none;">Total Net (Rp)</td>
                                            <td style="width:30px;border: none">:</td>
                                            <td style="border: none;" id="lblTotalNet">null</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
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
                            <th>No.</th>
                            <th>Kode Barang</th>
                            <th>Nama Barang</th>
                            <th>Jenis Barang</th>
                            <th>Berat</th>
                            <th>Status</th>
                            <th>Harga Beli</th>
                            <th>Harga Jual</th>
                            <th>Total</th>
                            <th>Potongan</th>
                            <th>Servis</th>
                            <th>Total Net</th>
                            <th>Foto</th>
                            <th>#</th>
                          </tr>
                      </thead>
                      <tbody></tbody>
                      <tfoot>
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th>Total Berat</th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th>Total</th>
                            <th>Potongan</th>
                            <th>Servis</th>
                            <th>Total Net</th>
                            <th></th>
                        </tr>
                      </tfoot>
                  </table>
              </div>
          </div>
      </div> ${this._modalDetailPerbarangView()} ${this._modalImageView()}`;
	},

	_modalDetailPerbarangView() {
		return /*html*/ `<div class="modal fade " id="modalDetailPerbarang" tabindex="-1" role="dialog" aria-labelledby="EditPostLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content ">
                <div class="modal-header modal-header-primary">
                    <h5 class="modal-title" id="EditPostLabel"><i class="fa fa-check-square-o" aria-hidden="true"></i> Riwayat Transaksi </h5>
                    <button class="close" title="Close modal" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
    
            <div class="modal-body">
                <div class="table-responsive">
                <table class="table table-bordered" id="tableDetailPerbarang" width="100%" cellspacing="0">
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
    </div>`;
	},

    _modalImageView() {
		return /*html*/ `<div id="imageModal" class="modalImage">
                            <img class="imgModal" id="imageView">
                        <div id="caption"></div>`
	},

	async afterRender() {
		await this._initialTable();
		await initialSecurity.init({
			statePage: "laporan_buyback_perbarang",
		});
	},

	async _initialTable() {
		await LaporanPerbarangInitiator.initBuybackPerbarang();
		await LaporanPerbarangInitiator._setDate();
	},

	_errorContent(container) {
		const errorContent = document.getElementById("main-content");
		errorContent.innerHTML = `<div class="msg-failed">
                             <span class="fa fa-pencil"></span>
                              <p class="center">Maaf , Aplikasi tidak dapat di tampilkan. Periksa kembali internet anda ya &#128522</p>
                             </div>`;
	},
};

export default LaporanBuybackPerbarang;
