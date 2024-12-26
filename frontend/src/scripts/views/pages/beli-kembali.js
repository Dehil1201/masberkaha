import initialBeliKembali from '../../presenter/transaksi/initial_beli-kembali.js'
import initialSecurity from '../../presenter/setting/initial_security.js'

const BeliKembali = {
	async render() {
    const view = /*html*/ ` <div class="page-content-wrap">
    <input type="hidden" id='kasir-id' value=''>
      <div class="row">
          <div class="col-md-12">
         <div class="card shadow mb-4">
          
          <a href="#collapseCardExample" class="d-block card-header py-3" data-toggle="collapse"
              role="button" aria-expanded="true" aria-controls="collapseCardExample">
              <h6 class="m-0 font-weight-bold text-primary">Transaksi Beli Kembali</h6>
          </a>
         
          <div class="collapse show" id="collapseCardExample">
              <div class="card-body">

              <form id='change-kasir'>
              <div class="form-row">
                <div class="col-md-3 mb-3">
                    <label>Username</label>
                    <select id='username' class="form-control" required>
                    </select>
                </div>
                <div class="col-md-3 mb-3">
                    <label>Password</label>
                    <input type="password" id='password' class="form-control" placeholder="Password" required>
                </div>
                <div class="col-md-3 mb-3">
                    <label>&nbsp;</label>
                    <div class="input-group">
                        <button type='submit' id="changeKasir" title="Ganti kasir" data-toggle="modal" class="btn btn-info ml-2" type="submit">
                        <i class="fas fa-chalkboard-teacher"></i> Ganti Kasir</button>
                    </div>
                </div>
                <div class="col-md-3 mb-3">
                    <label for="kasir-name">Kasir Aktif </label>
                    <h5 id='kasir-name'>???</h5>
                </div>
              </div>  
             </form>

              <div class="form-row">
                <div class="col-md-3 mb-3">
                    <label for="nota">Nota Dari Transaksi </label>
                    <input type="text" class="form-control" name="notaPenjualan" id="notaPenjualan" placeholder="Nota penjualan" required>
                </div>
                <div class="col-md-3 mb-3">
                    <label for="nota">Kode Barang </label>
                    <input type="text" class="form-control" name="kodeBarang" id="kodeBarang" placeholder="Kode barang" required>
                </div>
                <div class="col-md-3 mb-3">
                    <label>&nbsp;</label>
                    <div class="input-group mb-3">
                        <button id="pilihBarang" data-toggle="modal" title="Lihat Barang Yang Diluar" data-target="#modalBarang" class="btn btn-outline-info" type="button">
                        <i class="far fa-list-alt"></i> Barang Diluar [Ctrl+F6]</button>
                    </div>
                </div>
                <div class="col-md-3 mb-3">
                    <label for="tanggal">Tanggal</label>
                    <input type="date" class="form-control" id="tanggal" value='' required>
                </div>
              </div>
              </div>
          </div>
      </div>
                              <div class="col-md-12">
                              <p> Riwayat Pembelian </p>
                              <div style='overflow-x: auto;'>
                                  <div class="table-responsive" > 
                                      <table style='white-space: nowrap' class="table table-bordered" id="tablePenjualanDetail">
                                      <thead>
                                              <tr>
                                                  <th>Kode</th>
                                                  <th>Jenis</th>
                                                  <th>Nama keterangan</th>
                                                  <th>Foto</th>
                                                  <th>Berat</th>
                                                  <th>Kadar</th>
                                                  <th>Harga</th>
                                                  <th>Biaya Servis</th>
                                                  <th>Pot/Gram</th>
                                                  <th>Status</th>
                                                  <th>#</th>
                                              </tr>
                                          </thead>
                                          <tbody id="listPenjualanDetail">
                                          
                                          </tbody>
                                      </table>
                                  </div>
                              </div>
                              <div class="col-md-12">
                                 <p> Dijual Kembali</p>
                                  <div class="table-responsive">
                                      <table style='white-space: nowrap' class="table table-bordered">
                                      <thead>
                                              <tr>
                                                  <th>Kode</th>
                                                  <th>Jenis</th>
                                                  <th>Nama keterangan</th>
                                                  <th>Berat</th>
                                                  <th>Kadar</th>
                                                  <th>Harga</th>
                                                  <th>Potongan</th>
                                                  <th>Jumlah</th>
                                                  <th>Servis</th>
                                                  <th>Total</th>
                                                  <th>#</th>
                                              </tr>
                                          </thead>
                                          <tbody id="listBeliKembaliDetail">
                                          
                                          </tbody>
                                          <tfoot>
                                                <tr>
                                                    <th colspan="9" style="text-align:right">Total:</th>
                                                    <th id="total"></th>
                                                    <th></th>
                                                </tr>
                                            </tfoot>
                                      </table>
                                  </div></div>
                              </div>
                              <div class="form-row mt-4">
                              <div class="col-md-3 mb-3">
                                    <button type="button" id="openBayarBuyback" title="Buka form pembayaran" data-toggle="modal" data-target="#modalBayar" class="btn btn-primary ">
                                    <i class="fa fa-shopping-cart"></i>
                                    Pembayaran [End]</button>
                              </div>
                            </div>
                                   
                             <p class="text-right border-bottom  border-secondary">Keterangan Shortcut</p>
                              <div class="card">
                                  <div>
                                      <div class="col-md-12 ">
                                      <button type="button" class="btn btn-default  btn-notification ">
                                          <i class="fa fa-save"></i>
                                          <b>End </b> Pembayaran</button>
                                      </div>
                                  </div>
                              </div>
  
                          </div>
  
  
                      </div>
                  </div>
              </form>
  
          </div>
      </div>
  
  </div><div id="printResultNota"></div> ${this._modalBarangView()} ${this._modalPembayaranView()} ${this._modalImageView()}`;

		return view;
	},

	async afterRender() {
		await initialBeliKembali.init();
        await initialSecurity.init({statePage : 'transaksi_beli_kembali'});
	},

	async _initialTable() {

	},

	_modalNotaView() {
		return /*html*/ `<div class="modal " id="modalNota" tabindex="-1" role="dialog" aria-labelledby="EditPostLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content ">
                <div class="modal-header modal-header-primary">
                    <h5 class="modal-title" id="EditPostLabel"><i class="fa fa-check-square-o" aria-hidden="true"></i> Data Nota Tersedia</h5>
                    <button class="close" type="button" title="Close modal" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
    
            <div class="modal-body">
                <div class="table-responsive">
                <table class="table table-bordered" id="tableNota" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nota</th>
                            <th>Pelanggan</th>
                            <th>Tanggal</th>
                            <th>Total</th>
                            <th>Kasir</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                </table>
                </div>
            </div>
            </div>
        </div>
    </div>`
	},

	_modalImageView() {
		return /*html*/ `<div id="imageModal" class="modalImage">
        <img class="imgModal" id="imageView">
     <div id="caption"></div>`
	},

	_modalPembayaranView() {
		return /*html*/ `<div class="modal fade " id="modalBayar" tabindex="-1" role="dialog" aria-labelledby="EditPostLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
        
        <form id="transaksi-belikembali">
            <div class="modal-content ">
                <div class="modal-header modal-header-primary">
                    <h5 class="modal-title" id="EditPostLabel"><i class="fa fa-check-square-o" aria-hidden="true"></i> Pembayaran</h5>
                </div>
    
            <div class="modal-body">
                <div class="form-group row">
                  <label for="nama_pelanggan" class="col-sm-3 col-form-label">Faktur</label>
                    <div class="col-sm-9">
                    <input type="text" class="form-control" id="fakturBuyback" placeholder="Faktur" value="null" required readonly>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="grandTotal" class="col-sm-3 col-form-label">GrandTotal</label>
                    <div class="col-sm-9">
                    <input type="text" disabled readonly  class="form-control" id="grandTotal">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <input type="submit" title="Selesaikan Transaksi" class="btn btn-primary" value="Proses">
                <a class="btn btn-primary" href="#" id="inputBayar" style="display:none"><i class="fa fa-check-square-o" aria-hidden="true"></i> Simpan & Cetak</a>
                <button class="btn btn-danger" title="Batal transaksi" type="button" data-dismiss="modal"><i class="fa fa-window-close" aria-hidden="true"></i> Batal [Esc]</button>
            </div>
         </div>
        
        </form>
        </div></div>`
	},

    _modalBarangView() {
		return /*html*/ `<div class="modal fade " id="modalBarang" tabindex="-1" role="dialog" aria-labelledby="EditPostLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content ">
                <div class="modal-header modal-header-primary">
                    <h5 class="modal-title" id="EditPostLabel"><i class="fa fa-check-square-o" aria-hidden="true"></i> Data Barang Diluar / Terjual</h5>
                    <button class="close" title="Close Modal" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
    
            <div class="modal-body">
                <div class="table-responsive">
                <table class="table table-bordered" id="tableBarang" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Kode Barang</th>
                            <th>Nama Barang</th>
                            <th>Jenis Barang</th>
                            <th>Berat</th>
                            <th>%</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                </table>
                </div>
            </div>
            </div>
        </div>
    </div>`
	},

	_errorContent() {
		const errorContent = document.getElementById('main-content');
		errorContent.innerHTML = `<div class="msg-failed">
                             <span class="fa fa-pencil"></span>
                              <p class="center">Maaf , Aplikasi tidak dapat di tampilkan. Periksa kembali internet anda ya &#128522</p>
                             </div>`;
	},

};

export default BeliKembali;
