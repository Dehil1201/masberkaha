import initialQuantity from '../../presenter/transaksi/initial_quantity.js'

import initialSecurity from '../../presenter/setting/initial_security.js'
const Quantity = {
	async render() {
		const view = /*html*/ ` <div class="page-content-wrap">
        <input type="hidden" id='kasir-id' value=''>
      <div class="row">
          <div class="col-md-12">
         <div class="card shadow mb-4">
          
          <a href="#collapseCardExample" class="d-block card-header py-3" data-toggle="collapse"
              role="button" aria-expanded="true" aria-controls="collapseCardExample">
              <h6 class="m-0 font-weight-bold text-primary">Transaksi Quantity</h6>
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
                <div class="col-md-4 mb-3">
                    <label for="nota">Nota </label>
                    <input type="text" class="form-control" id="nota" placeholder="Nota penjualan" value="PJ.210111181117.0366" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label for="tanggal">Tanggal</label>
                    <input type="date" class="form-control" id="tanggal" value='' required>
                </div>
              </div>
              </div>
          </div>
      </div>
        <form id="form-pilih-barang" autocomplete="off">
          <div class="form-row">
            <div class="col-md-3 mb-3">
            <label for="barcodeBarang">Barcode Barang</label>
                <div class="input-group mb-3">
                    <input type="hidden" id="idBarang" class="form-control" aria-describedby="basic-addon1">
                    <input type="text" id="barcodeBarang" class="form-control" placeholder="Input kode barang/barcode" aria-label="" aria-describedby="basic-addon1" required>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <label for="keteranganBarang">Keterangan Barang</label>
                <input type="text" class="form-control" id="keteranganBarang" placeholder="Keterangan barang" readonly required>
            </div>
            <div class="col-md-3 mb-3">
                <label>&nbsp;</label>
                <div class="input-group mb-3">
                    <button id="pilihBarang" title="Pilih barang" data-toggle="modal" data-target="#modalBarang" class="btn btn-outline-info" type="button">
                    <i class="far fa-list-alt"></i>
                    Pilih Barang [Ctrl+F6]</button>
                </div>
            </div>
            <div class="mb-3" id="imgView"></div>
          </div>
          
          <div class="form-row">
            <div class="col-md-3 mb-3">
              <label for="hargaBarang">Harga</label>
              <input type="text" class="form-control" id="hargaBarang" placeholder="Harga" readonly>
            </div>
            <div class="col-md-3 mb-3">
              <label for="hargaBarang">Jumlah</label>
              <input name="qty" id="qty" class="form-control" type="number" min="0" placeholder="Jumlah">
            </div>
            <div class="mb-3" id="colButtonMarkup">
                <label>&nbsp;</label>
                    <div class="input-group mb-3">
                        <button class="btn btn-primary " title="Markup/Naikan harga" id="btnMarkup" type="button"><i class="fas fa-dollar-sign"></i> Up [F2]</button>  
                    </div>
             </div>
            <div class="col-md-2 mb-2" id="colMarkup">
              <label for="markupHarga">Markup Harga</label>
              <input type="text" class="form-control" id="markupHarga" placeholder="Markup Harga">
            </div>
            <div class="col-md-3 mb-3">
            <label>&nbsp;</label>
                <div class="input-group mb-3">
                <button class="btn btn-primary " title="Tambahkan data barang" id='submit-add-barang' type="submit">
                <i class="fas fa-plus"></i> 
                Tambahkan Barang [Enter]</button>  
                </div>
             </div>
          </div>
          
        </form>

                              <div class="col-md-12">
                                  <div class="table-responsive">
                                      <table class="table table-bordered" id="tableQuantityDetail">
                                      <thead>
                                              <tr>
                                                <th>ID</th>
                                                <th>Kode</th>
                                                <th>Jenis</th>
                                                <th>Nama keterangan</th>
                                                <th>Harga</th>
                                                <th>Qty</th>
                                                <th>Total</th>
                                                <th>Harga Asal</th>
                                                <th>#</th>
                                              </tr>
                                          </thead>
                                          </tbody></tbody>
                                          <tfoot>
                                                <tr>
                                                    <th colspan="6" style="text-align:right">Grand Total:</th>
                                                    <th id="lblTotal"></th>
                                                </tr>
                                            </tfoot>
                                      </table>
                                  </div>
                              </div>
                              <div class="form-row mt-4">
                              <div class="col-md-3 mb-3">
                                    <button type="button" title="Buka form pembayaran" id="openBayarJual" data-toggle="modal" data-target="#modalBayar" class="btn btn-primary ">
                                    <i class="fa fa-shopping-cart"></i>
                                    Pembayaran [End]</button>
                              </div>
                            </div>
                                   

                             <p class="text-right border-bottom  border-secondary">Keterangan Shortcut</p>
                              <div class="card">
                                  <div>
                                      <div class="col-md-12 ">
                                          <button type="button" class="btn btn-default  btn-notification ">
                                              <i class="fa fa-dollar"></i><b>Ctrl+F6</b> Pilih Barang </button>
                                          <button type="button" class="btn btn-default   btn-notification ">
                                              <i class="fa fa-check-square-o"></i>
                                              <b>F2 </b> Up Harga/Ubah Harga</button>
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
  
  </div> ${this._modalBarangView()} ${this._modalPembayaranView()} ${this._modalPrint()} ${this._modalPelangganView()}`;

		return view;
	},

	async afterRender() {
		await this._initialTable();
		await initialSecurity.init({
			statePage: 'transaksi_quantity'
		});
	},

	async _initialTable() {
		await initialQuantity.init();

	},

	_modalBarangView() {
		return /*html*/ `<div class="modal fade " id="modalBarang" tabindex="-1" role="dialog" aria-labelledby="EditPostLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content ">
                <div class="modal-header modal-header-primary">
                    <h5 class="modal-title" id="EditPostLabel"><i class="fa fa-check-square-o" aria-hidden="true"></i> Data Barang Tersedia</h5>
                    <button class="close" title="Close modal" type="button" data-dismiss="modal" aria-label="Close">
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
                            <th>Status</th>
                            <th>HargaBeli</th>
                            <th>Harga Jual</th>
                            <th>Foto</th>
                            <th>Stok</th>
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

	_modalPelangganView() {
		return /*html*/ `<div class="modal fade " id="modalPelanggan" tabindex="-1" role="dialog" aria-labelledby="EditPostLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content ">
                <div class="modal-header modal-header-primary">
                    <h5 class="modal-title" id="EditPostLabel"><i class="fa fa-check-square-o" aria-hidden="true"></i> Pilih Pelanggan</h5>
                    <button class="close" title="Close modal" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="card shadow mb-4">

                <a href="#showAddPelanggan" class="d-block card-header py-3" data-toggle="collapse" role="button"
                    aria-expanded="true" aria-controls="showAddPelanggan">
                    <h6 class="m-0 font-weight-bold text-primary">Tambah Pelanggan</h6>
                </a>

                <div class="collapse show" id="showAddPelanggan">
                    <div class="card-body">
                        <form id="form-add-pelanggan">
                            <div class="form-row">
                                <div class="col-md-3">
                                    <label for="kode_pelanggan">Kode Pelanggan </label>
                                    <input type="text" class="form-control" id="kode_pelanggan" name="kode_pelanggan" placeholder="Kode Pelanggan" required>
                                </div>
                                <div class="col-md-3">
                                    <label for="nama_pelanggan">Nama Pelanggan</label>
                                    <input type="text" class="form-control" name="nama_pelanggan" id="nama_pelanggan" required>
                                </div>
                                <div class="col-md-4">
                                    <label for="alamat">Alamat</label>
                                    <input type="text" class="form-control" name="alamat" id="alamat" required>
                                </div>
                                <div class="col-md-2">
                                <label>&nbsp;</label>
                                    <div class="input-group">
                                        <button class="btn btn-primary " title="Tambah data pelanggan" type="submit"><i class="fas fa-plus"></i> Tambah</button>  
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
    
            <div class="modal-body">
                <div class="table-responsive">
                <table class="table table-bordered table-sm" id="tablePelanggan" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Kode</th>
                            <th>Nama</th>
                            <th>Alamat</th>
                            <th>Kota</th>
                            <th>No Hp</th>
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

	_modalPembayaranView() {
		return /*html*/ `<div class="modal fade " id="modalBayar" tabindex="-1" role="dialog" aria-labelledby="EditPostLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
        
        <form id="transaksi-quantity">
            <div class="modal-content ">
                <div class="modal-header modal-header-primary">
                    <h5 class="modal-title" id="EditPostLabel"><i class="fa fa-check-square-o" aria-hidden="true"></i> Pembayaran</h5>
                </div>
    
            <div class="modal-body">
                <div class="form-group row">
                  <label for="nama_pelanggan" class="col-sm-3 col-form-label">Nama Pelanggan</label>
                  <div class="col-sm-5">
                    <input type="hidden" class="form-control" id="idPelanggan" required>
                    <input type="text" class="form-control" id="namaPelanggan" placeholder="Silahkan pilih pelanggan" readonly required>
                  </div>
                    <button id="pilihPelanggan" data-toggle="modal" title="Pilih pelanggan" data-target="#modalPelanggan" class="btn btn-outline-info" type="button">
                    <i class="far fa-user"></i>
                    Pilih Pelanggan [Ctrl+F7]</button>
                </div>
                <div class="form-group row">
                    <label for="grandTotal" class="col-sm-3 col-form-label">GrandTotal</label>
                    <div class="col-sm-9">
                    <input type="text" disabled readonly  class="form-control" id="grandTotal">
                    </div>
                </div>
                <div class="form-group row">
                    <label for="pilih_pembayaran" class="col-sm-3 col-form-label">Pilih Pembayaran</label>
                    <div class="col-sm-9">
                    <select class='form-control' id="pilih_pembayaran">
                        <option value='1'>Tunai</option>
                        <option value='2'>Hutang</option>
                    </select>
                    </div>
                </div>
                <div class="form-group row" id="jatuhTempo"></div>
                <div class="form-group row">
                    <label for="bayar" class="col-sm-3 col-form-label">Di Bayar</label>
                    <div class="col-sm-9">
                    <input type="text"  class="form-control" id="bayar">
                    </div>
                </div>
                <div class="form-group row">
                    <label for="kembali" class="col-sm-3 col-form-label">Kembali</label>
                    <div class="col-sm-9">
                    <input type="text"  class="form-control" id="kembali">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <input type="submit" title="Selesaikan pembayaran" class="btn btn-primary" value="Simpan">
                <a class="btn btn-primary" href="#" title="Batalkan transaksi" id="inputBayar" style="display:none"><i class="fa fa-check-square-o" aria-hidden="true"></i> Simpan & Cetak</a>
                <button class="btn btn-danger" type="button" data-dismiss="modal"><i class="fa fa-window-close" aria-hidden="true"></i> Batal [Esc]</button>
            </div>
         </div>
        
        </form>
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

export default Quantity;
