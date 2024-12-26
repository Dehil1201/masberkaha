import initialPembelian from '../../presenter/transaksi/initial_pembelian.js'

import initialSecurity from '../../presenter/setting/initial_security.js'

const Pembelian = {
	async render() {
		const view = `  <div class="page-content-wrap">

      <div class="row">
          <div class="col-md-12">
     <div class="card shadow mb-4">
          <!-- Card Header - Accordion -->
          <a href="#collapseCardExample" class="d-block card-header py-3" data-toggle="collapse"
              role="button" aria-expanded="true" aria-controls="collapseCardExample">
              <h6 class="m-0 font-weight-bold text-primary">Transaksi Pembelian</h6>
          </a>
          <!-- Card Content - Collapse -->
          <div class="collapse show" id="collapseCardExample">
              <div class="card-body">
              <div class="form-row">
                <div class="col-md-4 mb-3">
                    <label for="nota">Nota </label>
                    <input type="text" class="form-control" id="nota" placeholder="First name" value="null" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label for="tanggal">Tanggal</label>
                    <input type="date" class="form-control" id="tanggal" value='' required>
                </div>
              </div>
              </div>
          </div>
      </div>
      
      <button class="btn btn-success btn-condensed" data-toggle="modal" title="Tambah data pembelian" data-target="#modalBarang" id="create_data"><i class="fa fa-plus"></i> Tambah Data Pembelian [Ctrl+F6]</button>
                             
      
                            <div class="col-md-12 mt-2">
                                  <div class="table-responsive">
                                      <table class="table">
                                      <thead>
                                              <tr>
                                                <th>No.</th>
                                                <th>Kode</th>
                                                <th>Jenis</th>
                                                <th>Nama Barang</th>
                                                <th>Berat</th>
                                                <thStatus</th>
                                                <th>%</th>
                                                <th>Harga Beli</th>
                                                <th>Nilai Beli</th>
                                                <th>Harga Jual</th>
                                                <th>Qty</th>
                                                <th>#</th>
                                              </tr>
                                          </thead>
                                          <tbody id="listPembelian">
                                             
  
                                          </tbody>
                                          <tfoot>
                                          <th colspan='7' class='text-right'>Total</th>
                                          <th colspan='2' id='grandTotalTable'>1000 </th>
                                          </tfoot>
                                      </table>
                                  </div>
                              </div>
                              <div class="form-row">
                              <div class="col-md-3 mb-3">
                                    <button type="button" id="openBayarBeli" title="Buka pembayaran" data-toggle="modal" data-target="#modalBayar" class="btn btn-primary ">
                                    <i class="fa fa-shopping-cart"></i>
                                    Pembayaran [End]</button>
                              </div>
                            </div>
                             

                             <p class="text-right border-bottom  border-secondary">Keterangan Shortcut</p>
                              <div class="card">
                                  <div>
                                      <div class="col-md-12 ">
                                        <button type="button" class="btn btn-default  btn-notification ">
                                        <i class="fa fa-dollar"></i><b>Ctrl+F6</b> Tambah Data Pembelian </button>
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
  
  </div> ${this._modalPembayaranView()} ${this._modalPrint()} ${this._modalAddBarangView()}  ${this._modalSupplierView()} `;
		return view;
	},

	async afterRender() {
		await initialPembelian.init();
		await initialSecurity.init({
			statePage: 'transaksi_pembelian'
		});
	},

	_modalAddBarangView() {
		return `<div class="modal fade bd-example-modal-lg" id="modalBarang" tabindex="-1" role="dialog" aria-labelledby="largeModal" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
               
                    <h3 class="modal-title" id="myModalLabel">Tambah Data Pembelian Barang</h3>
                    <button type="button" title="Close modal" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>

                <form id="pembelianForm" name="pembelianForm" class="form-horizontal" ">
                    <div class="modal-body">
                    <div class="form-group">
                        <label for="kode_barang" class="control-label col-xs-3">Kode Barang</label>
                        <div class="col-xs-9">
                            <input name="kode_barang" id="kode_barang" class="form-control" type="text" placeholder="Kode Barang.." readonly required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="jenis_barang" class="control-label col-xs-3">Jenis Barang</label>
                        <div class="col-xs-9">
                          <select class="custom-select" required name="jenis_barang" id="jenis_barang"></select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="nama_barang" class="control-label col-xs-3">Nama Barang</label>
                        <div class="col-xs-9">
                            <input name="nama_barang" required id="nama_barang" class="form-control" type="text" placeholder="Nama Barang..">
                        </div>
                    </div>
                    <div class="form-group" id="viewBerat">
                        <label for="berat" class="control-label col-xs-3">Berat</label>
                        <div class="col-xs-9">
                        <input name="berat" id="berat" required class="form-control" type="number" min="0" pattern="[0-9]+([\.,][0-9]+)?" step="0.01" placeholder="berat..">
                        </div>
                    </div>
                    <div class="form-group" id="viewKadar">
                        <label for="kadar" class="control-label col-xs-3">Kadar</label>
                        <div class="col-xs-9">
                            <input name="kadar" id="kadar" required class="form-control" type="number" min="0" value="0" placeholder="Kadar..">
                        </div>
                    </div>
                    <div class="form-group" id='statusBarang'>
                        <label for="statusBarangValue" class="control-label col-xs-3">Status Barang</label>
                        <div class="col-xs-9">
                        <select class="custom-select" name="status_barang" id="statusBarangValue">
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="R">R</option>
                            <option value="S">S</option>
                        </select>  
                    </div>
                    </div>
                    <div class="form-group" id="viewStok">
                      <label for="stok" class="control-label col-xs-3">Stok</label>
                      <div class="col-xs-9">
                          <input name="stok" id="stok" required class="form-control" type="number" min="0" placeholder="stok..">
                      </div>
                    </div>
                    <div class="form-group">
                        <label for="foto" class="control-label col-xs-3">Ambil Foto</label>
                        <div class="col-xs-9">
                          <div class="container">
                              <div class="row">
                                <div id="viewCamera" class="mx-auto mb-3">
                                    <video autoplay="autoplay" playsinline="playsinline" style="width: 320px; height: 240px;"></video>
                                    <canvas class="d-none"></canvas>
                                </div>
                              </div>
                              <div class="row">
                                  <div class="btn-group m-auto" role="group" aria-label="Camera Take">
                                      <button class="btn btn-primary " title="Ambil gambar" id="btnTake" type="button"> Ambil Gambar [F9]</button>
                                      <button class="btn btn-danger ml-2" id="btnAgain" title="Coba lagi ambil gambar" type="button"> Coba Lagi </button>
                                  </div>
                              </div>
                          </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="harga_beli" class="control-label col-xs-3">Harga Beli</label>
                        <div class="col-xs-9">
                            <input name="harga_beli" required id="harga_beli" class="form-control" type="text" placeholder="Harga beli..">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="harga_jual" class="control-label col-xs-3">Harga Jual</label>
                        <div class="col-xs-9">
                            <input name="harga_jual" required id="harga_jual" class="form-control" type="text" placeholder="Harga jual..">
                        </div>
                    </div>
            </div>
    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" title="Close modal" data-dismiss="modal" aria-hidden="true">Tutup</button>
                        <button type="submit" class="btn btn-info" title="Tambah barang pembelian" id="btn-save">Simpan</button>
                    </div>

                </form>
            </div>
        </div>
    </div>`
	},

	_modalPembayaranView() {
		return `<div class="modal fade " id="modalBayar" tabindex="-1" role="dialog" aria-labelledby="EditPostLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
        
        <form id="transaksi-pembelian">
            <div class="modal-content ">
                <div class="modal-header modal-header-primary">
                    <h5 class="modal-title" id="EditPostLabel"><i class="fa fa-check-square-o" aria-hidden="true"></i> Pembayaran</h5>
                </div>
    
            <div class="modal-body">
                <div class="form-group row">
                  <label for="nama_pelanggan" class="col-sm-3 col-form-label">Nama Supplier</label>
                  <div class="col-sm-5">
                    <input type="hidden" class="form-control" id="idSupplier">
                    <input type="text" class="form-control" id="namaSupplier" placeholder="Nama Supplier">
                  </div>
                    <button id="pilihSupplier" title="Pilih supplier" data-toggle="modal" data-target="#modalSupplier" class="btn btn-outline-info" type="button">
                    <i class="far fa-user"></i>
                    Pilih Supplier [Ctrl+F7]</button>
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
                <div class="form-group row" id="sisaHutang"></div>
            </div>
            <div class="modal-footer">
                <input type="submit" title="Selesaikan Transaksi" class="btn btn-primary" value="Simpan">
                <a class="btn btn-primary" href="#" id="inputBayar" style="display:none"><i class="fa fa-check-square-o" aria-hidden="true"></i> Simpan & Cetak</a>
                <button class="btn btn-danger" title="Batal pembayaran" type="button" data-dismiss="modal"><i class="fa fa-window-close" aria-hidden="true"></i> Batal [Esc]</button>
            </div>
         </div>
        
        </form>
        </div>
    </div>`
	},

	_modalSupplierView() {
		return `<div class="modal fade " id="modalSupplier" tabindex="-1" role="dialog" aria-labelledby="EditPostLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
        
            <div class="modal-content ">
                <div class="modal-header modal-header-primary">
                    <h5 class="modal-title" id="EditPostLabel"><i class="fa fa-check-square-o" aria-hidden="true"></i> Pilih Supplier</h5>
                </div>
    
            <div class="modal-body">
            <div class="table-responsive">
            <table class="table table-bordered" id="tableSupplier" width="100%" cellspacing="0">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nama</th>
                        <th>Alamat</th>
                        <th>Kota</th>
                        <th>No Hp</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tfoot>
                    
                </tfoot>
                <tbody>
                  
                  
                   
                </tbody>
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

	_errorContent(container) {
		const errorContent = document.getElementById('main-content');
		errorContent.innerHTML = `<div class="msg-failed">
                             <span class="fa fa-pencil"></span>
                              <p class="center">Maaf , Aplikasi tidak dapat di tampilkan. Periksa kembali internet anda ya &#128522</p>
                             </div>`;
	},

};

export default Pembelian;
