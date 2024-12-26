import transferInitiator from "../../presenter/akuntansi/transfer-initiator.js";
import initialSecurity from '../../presenter/setting/initial_security.js'
const TransferAkuntan = {
	async render() {
		const view = /*html*/ `<h1 class="h3 mb-2 text-gray-800">Transaksi Jurnal Umum</h1>
        <div class="card shadow mb-4">
            <a href="#collapseCardExample" class="d-block card-header py-3" data-toggle="collapse"
                role="button" aria-expanded="true" aria-controls="collapseCardExample">
                <h6 class="m-0 font-weight-bold text-primary">Filter Data Transaksi</h6>
            </a>
            <div class="collapse show" id="collapseCardExample">
                <div class="card-body">
                    <form id="filterLaporanKas">
                        <div class="form-group row">
                            <label for="startDate" class="col-sm-2 col-form-label">Tanggal Awal</label>
                            <div class="col-sm-3">
                                <input type="date" class="form-control" id="startDate">
                            </div>
                            <div class="col-sm-3">
                                <select class='form-control' id="pilihTransaksi">
                                    <option selected>-- Pilih Transaksi --</option>
                                    <option value='7'>[TF] Transfer</option>
                                    <option value='8'>[MTF] Menerima Transfer</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="endDate" class="col-sm-2 col-form-label">Tanggal Akhir</label>
                            <div class="col-sm-3">
                                <input type="date" class="form-control" id="endDate">
                            </div>
                            <div class="col-sm-3">
                                <select class='form-control' id="pilihSourceDana"></select>
                            </div>
                            <div class="col-sm-3">
                                <button class="btn btn-success col-sm-12" type="submit" id="filterData" title="Filter Data"><i class="fas fa-search"></i> Filter [F9]</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
          </div>
      
      <!-- DataTales Example -->
      <div class="card shadow mb-4">
            <div class="card-header py-3">
                <button class="btn btn-success btn-condensed" title="Transfer" id="addKas"><i class="fas fa-edit"></i> Tambah Transaksi [F1]</button>
                <button class="btn btn-info btn-condensed" id="refresh" title="Refresh Data"><i class="fas fa-sync"></i> Refresh [Ctrl + F5]</button>
            </div>
            <div class="card-body">
              <div class="table-responsive">
                  <table class="table table-bordered" id="tableKas" width="100%" cellspacing="0">
                      <thead>
                          <tr>
                            <th>ID</th>
                            <th>Tanggal</th>
                            <th>Faktur</th>
                            <th>Ref</th>
                            <th>Debit</th>
                            <th>Kredit</th>
                            <th>Sumber</th>
                            <th>Mode</th>
                            <th>Keterangan</th>
                            <th>#</th>
                          </tr>
                      </thead>
                      <tbody></tbody>
                     
                  </table>
              </div>
          </div>
      </div> ${this._modalAddKas()}`;
		return view;
	},

	_modalAddKas() {
		return /*html*/ `<div class="modal fade bd-example-modal-lg" id="modalKas" tabindex="-1" role="dialog" aria-labelledby="largeModal"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header modal-header-primary">
                    <h3 class="modal-title" id="myModalLabel2"></h3>
                </div>
        
                <form id="kasForm" name="kasForm" class="form-horizontal" data-action="multiple">
                    <div class="modal-body">
                        <div class="form-group row">
                            <label for="tanggal" class="col-sm-5 col-form-label"><b>Tanggal</b></label>
                            <div class="col-sm-7">
                                <input type="date" id="tanggal" name="tanggal" class="form-control">
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="fakturKas" class="col-sm-5 col-form-label"><b>Faktur Kas</b></label>
                            <div class="col-sm-7">
                                <input type="text" id="fakturKas" name="faktur" class="form-control" required>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="from-sumber" class="col-sm-5 col-form-label"><b>Dari Rekening</b></label>
                            <div class="col-sm-7">
                            <select class='form-control' id="from_sumber" required>
                               
                            </select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="saldo_sumber_asal" class="col-sm-5 col-form-label"><b>Saldo Sumber Pengirim</b></label>
                            <div class="col-sm-7">
                                <input type="text" id="saldo_sumber_asal" name="saldo_sumber_asal" class="form-control" value="0" readonly>
                                <input type="hidden" id="saldo_sumber_asal_fix" class="form-control" readonly>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="to-sumber" class="col-sm-5 col-form-label"><b>Ke Rekening</b></label>
                            <div class="col-sm-7">
                            <select class='form-control' id="to_sumber" required>
                            
                            </select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="jumlah_transfer" class="col-sm-5 col-form-label"><b>Jumlah Tranfer</b></label>
                            <div class="col-sm-7">
                                <input type="text" id="jumlah_transfer" name="jumlah_transfer" class="form-control" value="0">
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="sisa_saldo_pengirim" class="col-sm-5 col-form-label"><b>Sisa Saldo Pengirim</b></label>
                            <div class="col-sm-7">
                                <input type="text" id="sisa_saldo_pengirim" name="sisa_saldo_pengirim" class="form-control" readonly>
                            </div>
                        </div>
                       
                        <div class="form-group row">
                            <label for="keterangan Transfer" class="col-sm-5 col-form-label"><b>Keterangan</b></label>
                            <div class="col-sm-7">
                                <input type="text" id="keterangan" name="keterangan" class="form-control">
                            </div>
                        </div>
                    </div>
        
                    <div class="modal-footer">
                        <button type="submit" id="btn-save" class="btn btn-success" title="Selesaikan Transaksi" aria-hidden="true"><i class="fas fa-check" aria-hidden="true"></i></button>
                        <button type="button" class="btn btn-danger" data-dismiss="modal" title="Close Modal" aria-hidden="true"><i class="fas fa-window-close" aria-hidden="true"></i> Tutup</button>
                    </div>
        
                </form>
            </div>
        </div>
        </div>`
	},

	async afterRender() {
		await this._initialTable();
		await initialSecurity.init({
			statePage: 'transaksi_jurnal'
		})
	},

	async _initialTable() {
		await transferInitiator.init();
	},



	_errorContent(container) {
		const errorContent = document.getElementById('main-content');
		errorContent.innerHTML = `<div class="msg-failed">
                             <span class="fa fa-pencil"></span>
                              <p class="center">Maaf , Aplikasi tidak dapat di tampilkan. Periksa kembali internet anda ya &#128522</p>
                             </div>`;
	},

};

export default TransferAkuntan;
