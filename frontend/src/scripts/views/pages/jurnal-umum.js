import jurnalUmumInitiator from "../../presenter/akuntansi/jurnal-umum-initiator.js";
import initialSecurity from '../../presenter/setting/initial_security.js'
const JurnalUmum = {
	async render() {
		const view = /*html*/ `<h1 class="h3 mb-2 text-gray-800">Jurnal Umum</h1>
        <div class="card shadow mb-4">
            <a href="#collapseCardExample" class="d-block card-header py-3" data-toggle="collapse"
                role="button" aria-expanded="true" aria-controls="collapseCardExample">
                <h6 class="m-0 font-weight-bold text-primary">Filter Jurnal Umum</h6>
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
                                    <option value=''>Semua Transaksi</option>
                                    <option value='1'>Penjualan</option>
                                    <option value='2'>Beli Kembali</option>
                                    <option value='3'>Pembelian</option>
                                    <option value='4'>Hutang Terbayar</option>
                                    <option value='5'>Piutang Terbayar</option>
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
                      <tfoot>
                      <tr>
                        <th></th>
                        <th></th>
                        <th>Total</th>
                        <th>Saldo Awal</th>
                        <th>Pemasukan</th>
                        <th>Pengeluaran</th>
                        <th></th>
                        <th></th>
                        <th></th>
                      </tr>
                      </tfoot>
                  </table>
              </div>
          </div>
      </div>`
		return view;
	},

	async afterRender() {
		await this._initialTable();
		await initialSecurity.init({
			statePage: 'jurnal_umum'
		})
	},

	async _initialTable() {
		await jurnalUmumInitiator.init();
	},



	_errorContent(container) {
		const errorContent = document.getElementById('main-content');
		errorContent.innerHTML = `<div class="msg-failed">
                             <span class="fa fa-pencil"></span>
                              <p class="center">Maaf , Aplikasi tidak dapat di tampilkan. Periksa kembali internet anda ya &#128522</p>
                             </div>`;
	},

};

export default JurnalUmum;
