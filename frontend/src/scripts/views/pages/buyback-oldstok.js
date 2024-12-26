import initialBuybackOldstok from '../../presenter/transaksi/initial_buyback-oldstok.js'
import initialSecurity from '../../presenter/setting/initial_security.js'

const BuybackOldstok = {
    async render() {
        const view = /*html*/ `<div class="page-content-wrap">
        <input type="hidden" id='kasir-id' value=''>
    
        <div class="row">
            <div class="col-md-12">
                <div class="card shadow mb-4 ">
    
                    <a href="#collapseCardExample" class="d-block card-header py-3" data-toggle="collapse" role="button"
                        aria-expanded="true" aria-controls="collapseCardExample">
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
                                        <input type="password" id='password' class="form-control" placeholder="Password"
                                            required>
                                    </div>
                                    <div class="col-md-3 mb-3">
                                        <label>&nbsp;</label>
                                        <div class="input-group">
                                            <button type='submit' id="changeKasir" title="Ganti kasir" data-toggle="modal"
                                                class="btn btn-info ml-2" type="submit">
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
                                    <label for="tanggal">Tanggal</label>
                                    <input type="date" class="form-control" id="tanggal" value='' required>
                                </div>
                            </div>
                            <form id='show-barang'>
                                <div class="form-row">
                                    <div class="col-md-4 mb-3">
                                        <label for="kodeBarang">Kode Barang </label>
                                        <input type="text" class="form-control" name="kodeBarang" id="kodeBarang"
                                            placeholder="Kode barang" required>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label>&nbsp;</label>
                                        <div class="input-group mb-3">
                                            <button id="pilihBarang" data-toggle="modal" title="Lihat Barang Yang Diluar"
                                                data-target="#modalBarang" class="btn btn-outline-info" type="button">
                                                <i class="far fa-list-alt"></i> Barang Diluar [Ctrl+F6]</button>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label for="spinnner">&nbsp;</label>
                                        <div class="input-group mb-3">
                                            <span id="loading_check" class="loading_check"></span>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="col-md-12">
                    <div class="card shadow mb-4 ">
                        <a href="#collapseCardExample2" class="d-block card-header py-3" data-toggle="collapse"
                            role="button" aria-expanded="false" aria-controls="collapseCardExample2">
                            <h6 class="m-0 font-weight-bold text-primary">Dijual Kembali</h6>
                        </a>
                        <br>
                        <div class="col-md-12" id="collapseCardExample2">
                            <div class="table-responsive">
                                <table class="table table-bordered" id="tableListBuyback">
                                    <thead>
                                        <tr>
                                            <th>Kode</th>
                                            <th>Jenis</th>
                                            <th>Nama keterangan</th>
                                            <th>Foto</th>
                                            <th>Berat</th>
                                            <th>%</th>
                                            <th>Harga Nota</th>
                                            <th>Potongan</th>
                                            <th>Jumlah</th>
                                            <th>Servis</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>#</th>
                                        </tr>
                                    </thead>
                                    <tbody id="listBuybackOldstokDetail">
    
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th colspan="10" style="text-align:right">Total:</th>
                                            <th id="total"></th>
                                            <th></th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-row mt-4">
                    <div class="col-md-5 mb-3">
                        <button type="button" id="openBayarBuyback" title="Buka form pembayaran" data-toggle="modal"
                            data-target="#modalBayar" class="btn btn-primary "><i class="fa fa-shopping-cart"></i> Pembayaran [End]</button>
                        <button type="button" id="newKodeBarang" title="Input Kode Barang Baru" class="btn btn-success "><i class="fa fa-barcode"></i> Input Baru [B]</button>
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
    
    </div>
    <div id="printResultNota"></div> ${this._modalDetailBuyback()} ${this._modalBarangView()}  ${this._modalPembayaranView()} ${this._modalPrint()} ${this._modalPelangganView()} ${this._modalImageView()}`;

        return view;
    },

    async afterRender() {
        await initialBuybackOldstok.init();
        await initialSecurity.init({
            statePage: 'transaksi_beli_kembali'
        });
    },

    _modalDetailBuyback() {
        return `<div class="modal fade bd-example-modal-lg" id="modalDetail" tabindex="-1" role="dialog" aria-labelledby="largeModal" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title" id="myModalLabel">Edit Detail Terima Kembali</h3>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>  
                <form id="detailBuybackForm" name="detailBuybackForm" class="form-horizontal" data-action='multiple'">
                    <input type="hidden" name="kode_barang" id="kode_barang">
                     <div class="modal-body">
                         <div class="form-group">
                             <label for="berat" class="control-label col-xs-3">Berat</label>
                             <div class="col-xs-9">
                                 <input name="berat" id="berat" class="form-control" type="number" min="0" pattern="[0-9]+([\.,][0-9]+)?" step="0.01" placeholder="berat..">
                             </div>
                         </div>
                         <div class="form-group">
                             <label for="harga_nota" class="control-label col-xs-3">Harga Nota</label>
                             <div class="col-xs-9">
                                 <input name="harga_nota" id="harga_nota" class="form-control" type="text" placeholder="Harga nota..">
                             </div>
                         </div>
                         <div class="form-group">
                             <label for="potongan" class="control-label col-xs-3">Potongan</label>
                             <div class="col-xs-9">
                                 <input name="potongan" id="potongan" class="form-control" type="text" placeholder="Potongan..">
                             </div>
                         </div>
                         <div class="form-group">
                             <label for="servis" class="control-label col-xs-3">Biaya Servis</label>
                             <div class="col-xs-9">
                                 <input name="servis" id="servis" class="form-control" type="text" placeholder="Biaya servis..">
                             </div>
                         </div>
                         <div class="form-group">
                             <label for="status" class="control-label col-xs-3">Status</label>
                             <div class="col-xs-9">
                                 <select style="width: 60px;" class="form-control" name="status" id="status">
                                     <option value="1">1</option>
                                     <option value="S">S</option>
                                     <option value="R">R</option>
                                 </select>
                             </div>
                         </div>
                     </div>
    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-dismiss="modal" aria-hidden="true">Tutup</button>
                        <button type="submit" class="btn btn-info" id="btn-save">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    </div>`
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
                  <label for="fakturBuyback" class="col-sm-3 col-form-label">Faktur</label>
                    <div class="col-sm-9">
                    <input type="text" class="form-control" id="fakturBuyback" placeholder="Faktur" value="null" required readonly>
                    </div>
                </div>
                <div class="form-group row">
                  <label for="nama_pelanggan" class="col-sm-3 col-form-label">Nama Pelanggan</label>
                  <div class="col-sm-5">
                    <input type="hidden" class="form-control" id="idPelanggan" required>
                    <input type="text" class="form-control" id="namaPelanggan" placeholder="Silahkan pilih pelanggan" readonly required>
                  </div>
                    <button id="pilihPelanggan" title="Pilih pelanggan" data-toggle="modal" data-target="#modalPelanggan" class="btn btn-outline-info" type="button">
                    <i class="far fa-user"></i>
                    Pilih Pelanggan [Ctrl+F7]</button>
                </div>
                <div class="form-group row">
                    <label for="grandTotal" class="col-sm-3 col-form-label">GrandTotal (-)</label>
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

    _modalPelangganView() {
        return /*html*/ `<div class="modal fade " id="modalPelanggan" tabindex="-1" role="dialog" aria-labelledby="EditPostLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content ">
                <div class="modal-header modal-header-primary">
                    <h5 class="modal-title" id="EditPostLabel"><i class="fa fa-check-square-o" aria-hidden="true"></i> Pilih Pelanggan</h5>
                    <button class="close" title="Close Modal" type="button" data-dismiss="modal" aria-label="Close">
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
                                    <input type="text" class="form-control" id="kode_pelanggan" name="kode_pelanggan" placeholder="Kode Pelanggan" required readonly>
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
                                        <button class="btn btn-primary " title="Tambah pelanggan" type="submit"><i class="fas fa-plus"></i> Tambah</button>  
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

    _errorContent() {
        const errorContent = document.getElementById('main-content');
        errorContent.innerHTML = `<div class="msg-failed">
                             <span class="fa fa-pencil"></span>
                              <p class="center">Maaf , Aplikasi tidak dapat di tampilkan. Periksa kembali internet anda ya &#128522</p>
                             </div>`;
    },

};

export default BuybackOldstok;
