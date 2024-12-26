import KelolaDataInitiator from "../../presenter/utils/kelola-data-presenter.js";
import initialSecurity from '../../presenter/setting/initial_security.js'
const DataPenjualan = {
    async render() {
        return `  

        <h1 class="h3 mb-2 text-gray-800">Kelola Data Penjualan</h1>

        <div class="card shadow mb-4">
            
            <a href="#collapseCardExample" class="d-block card-header py-3" data-toggle="collapse"
                role="button" aria-expanded="true" aria-controls="collapseCardExample">
                <h6 class="m-0 font-weight-bold text-primary">Filter Data Penjualan</h6>
            </a>

            <div class="collapse show" id="collapseCardExample">

                <div class="card-body">
                    <form id="filterPenjualan">
                        <div class="form-group row">
                            <label for="startDate" class="col-sm-3 col-form-label">Tanggal Awal</label>
                            <div class="col-sm-3">
                            <input type="date" class="form-control" id="startDate">
                            </div>
                            <div class="col-sm-3">
                                <select class='form-control' id="pilih_pembayaran">
                                    <option value=''>Semua Transaksi</option>
                                    <option value='1'>Tunai</option>
                                    <option value='2'>Non Tunai</option>
                                </select>
                            </div>
                            <div class="col-sm-3">
                                <select class='form-control' id="pilihPelanggan"></select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="endDate" class="col-sm-3 col-form-label">Tanggal Akhir</label>
                            <div class="col-sm-3">
                            <input type="date" class="form-control" id="endDate">
                            </div>
                            <div class="col-sm-3">
                                <select class='form-control' id="pilihUser"></select>
                            </div>
                            <div class="col-sm-3">
                                <button class="btn btn-success col-sm-12" type="submit" id="filterData" title="Filter Data"><i class="fas fa-search"></i> Filter [F9]</button>
                            </div>
                        </div>
                    </form>
                </div>

            </div>
        </div>
            
        <div class="card shadow mb-4">
            <a href="#collapseInfoPenjualan" class="d-block card-header py-3" data-toggle="collapse"
                role="button" aria-expanded="true" aria-controls="collapseInfoPenjualan">
                <h6 class="m-0 font-weight-bold text-primary">Info Penjualan</h6>
            </a>

            <div class="collapse show" id="collapseInfoPenjualan">

                <div class="card-body">
                    <div class="col-sm-12">
                        <div class="form-group row">
                            <div class="col-sm-2">
                                <label for="jumlahNota" class="col-form-label">Jumlah Nota <b> : <span id="jumlahNota">null</span></b></label>
                            </div>
                            <div class="col-sm-3">
                                <label for="totalBerat" class="col-form-label">Total Berat Terjual <b> : <span id="totalBerat">null Gram</span></b></label>
                            </div>
                            <div class="col-sm-2">
                                <label for="subTotal" class="col-form-label">Subtotal <b> : <span id="subTotal">null</span></b></label>
                            </div>
                            <div class="col-sm-2">
                                <label for="totalOngkos" class="col-form-label">Total Ongkos <b> : <span id="totalOngkos">null</span></b></label>
                            </div>
                            <div class="col-sm-3">
                                <label for="totalPenjualan" class="col-form-label">Total Penjualan <b> : <span id="totalPenjualan">null</span></b></label>
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
                  <table class="table table-bordered" id="kelolaTable" width="100%" cellspacing="0">
                      <thead>
                          <tr>
                            <th>No.</th> 
                            <th>Tanggal</th> 
                            <th>Faktur</th> 
                            <th>Jam</th> 
                            <th>User</th>
                            <th>Pelanggan</th>
                            <th>QTY</th> 
                            <th>Sub Total</th> 
                            <th>Ongkos</th> 
                            <th>Total</th> 
                            <th>Aksi</th>
                          </tr>
                      </thead>
                      <tbody></tbody>
                      <tfoot>
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th>Total Transaksi</th>
                            <th>Total Berat</th>
                            <th>Sub Total</th>
                            <th>Ongkos</th>
                            <th>Total</th>
                            <th></th>
                        </tr>
                      </tfoot>
                  </table>
              </div>
          </div>
      </div><div id="printResultNota"></div> ${this._modalPenjualanView()}`;
    },

    _modalPenjualanView() {
        return /*html*/ `<div class="modal fade bd-example-modal-lg" id="modalPenjualan" tabindex="-1" role="dialog" aria-labelledby="largeModal"
        aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
        
                    <h3 class="modal-title" id="myModalLabel"></h3>
                    <button type="button" title="Close modal" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div style="overflow-y: auto;height:500px;">
                    <div id="printArea" class="modal-body"></div>
                </div>
                <div class="modal-footer">
                <button type="button" title="Cetak Struk" id="printStruk" class="btn btn-success" aria-hidden="true"><i class="fas fa-print" aria-hidden="true"></i> Cetak Struk</button>
                <!-- <button type="button" title="Print penjualan" id="printPenjualan" onclick="jQuery('#printArea').print()" class="btn btn-primary" aria-hidden="true"><i class="fas fa-print" aria-hidden="true"></i> Print</button> -->
                <button type="button" title="Close modal" class="btn btn-danger" data-dismiss="modal" aria-hidden="true"><i class="fas fa-window-close" aria-hidden="true"></i> Tutup</button>
                </div>
            </div>
        </div>
        </div>`
    },

    _modalPrint() {
        return `<div class="modal fade bd-example-modal-lg" id="modalPrint" tabindex="-1" role="dialog" aria-labelledby="EditPostLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl" role="document">
            <div class="modal-content">
                <div class="modal-header modal-header-primary">
                    <h5 class="modal-title" id="EditPostLabel"><i class="fa fa-address-card-o " aria-hidden="true"></i> Transaksi </h5>
                </div>
                <div class="modal-body">
                    <div style="overflow-y: auto; height:450px; ">
                        <div id="printResultNota"></div>
                    </div>
    
                    <center>
                        <a class="btn btn-primary btn-sm" href="#" id="cetakStruk"><i class="fa fa-print" aria-hidden="true"></i> Cetak Struk</a>
                        <button class="btn btn-danger" type="button" data-dismiss="modal"><i class="fa fa-window-close" aria-hidden="true"></i> Batal</button>
                    </center>
                </div>
            </div>
        </div>
    </div>`
    },


    async afterRender() {
        await this._initialTable();
        await initialSecurity.init({
            statePage: 'kelola_penjualan'
        })
    },

    async _initialTable() {
        await KelolaDataInitiator.initDataPenjualan();
        await KelolaDataInitiator._setDate();
    },



    _errorContent(container) {
        const errorContent = document.getElementById('main-content');
        errorContent.innerHTML = `<div class="msg-failed">
                             <span class="fa fa-pencil"></span>
                              <p class="center">Maaf , Aplikasi tidak dapat di tampilkan. Periksa kembali internet anda ya &#128522</p>
                             </div>`;
    },

};

export default DataPenjualan;
