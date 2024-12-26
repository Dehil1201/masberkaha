import initialBarang from '../../presenter/master/initial_barang.js'
import initialSecurity from '../../presenter/setting/initial_security.js'
const Barang = {
	async render() {
		return `<h1 class="h3 mb-2 text-gray-800">Data Barang</h1>
      
        <!-- DataTales Example -->
        <div class="card shadow mb-4">
            <div class="card-header py-3">
            <div class="row">
              <div class="col-md-3">
                  <button class="btn btn-success btn-condensed form-control" id="create_data" title="Tambah Data Barang"><i class="fa fa-plus"></i> Tambah Data [F1]</button>
              </div>
              </div>
              </div>
            </div>
  
            <div class="card shadow mb-4">
  
              <a href="#collapseCardExample" class="d-block card-header py-3" data-toggle="collapse" role="button"
                  aria-expanded="true" aria-controls="collapseCardExample">
                  <h6 class="m-0 font-weight-bold text-primary">Filter Barang</h6>
              </a>
      
              <div class="collapse show" id="collapseCardExample">
                  <div class="card-body">
                      <form id="filterBarang">
                          <div class="form-group row">
                              <label for="pilih_jenis" class="col-sm-3 col-form-label">Filter Jenis</label>
                              <div class="col-sm-3">
                                  <select class='form-control' id="pilih_jenis"></select>
                              </div>
                          </div>
                          <div class="form-group row">
                              <label for="pilih_status" class="col-sm-3 col-form-label">Filter Status</label>
                              <div class="col-sm-3">
                              <select class='form-control' id="pilih_status">
                                  <option value=''> -- Pilih Status -- </option>
                                  <option value='nol'>0</option>
                                  <option value='1'>1</option>
                                  <option value='J'>J</option>
                                  <option value='S'>S</option>
                                  <option value='S1'>S1</option>
                                  <option value='R'>R</option>
                              </select>
                              </div>
                              <div class="col-sm-3">
                                  <button class="btn btn-success col-sm-12" type="submit" id="filterData" title="Filter Data"><i
                                          class="fas fa-search"></i> Filter [Ctrl + F9]</button>
                              </div>
                          </div>
                      </form>
                  </div>
              </div>
              </div>

          <div class="card-body">
            <div class="col-md-12">
                <div class="form-group row">
                    <label for="ganti_status" id='label_ganti_status' class="col-sm-2 col-form-label view-status">Ganti Status</label>
                    <div class="col-sm-2 view-status">
                        <select class='form-control' id="ganti_status"></select>
                    </div>
                    <div class="col-md-2 view-status">
                        <button class="btn btn-success form-control" id="btn_change_status" title="Proses Perubahan Status"><i class="fa fa-edit"></i> Proses [F2]</button>
                    </div>
                    <div class="col-md-3">
                        <button class="btn btn-info btn-condensed" id="refresh" title="Refresh Data Barang"><i class="fas fa-sync"></i> Refresh [Ctrl + F5]</button>
                    </div>
                    <div class="col-sm-3">
                        <span>Jumlah <span id="jenisBarang">Total</span></span> : <b><span id="jumlahBarang">null</span></b> - <b><span id="beratValue"></span> Gram </b>
                    </div>
                </div>   
            </div>
            <br>
              <div class="table-responsive">
                  <table class="table table-bordered table-hover" id="tableBarang" width="100%" cellspacing="0">
                      <thead>
                          <tr>
                              <th><input type="checkbox" id='select-all' /></th>
                              <th>Kode Barang</th>
                              <th>Nama Barang</th>
                              <th>Jenis Barang</th>
                              <th>Berat</th>
                              <th>Kadar</th>
                              <th>Status</th>
                              <th>HargaBeli</th>
                              <th>Harga Jual</th>
                              <th>Foto</th>
                              <th>Stok</th>
                              <th width='120'>Aksi</th>
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
      
      <!-- MODAL ADD -->
       <div class="modal fade bd-example-modal-lg" id="modalData" tabindex="-1" role="dialog" aria-labelledby="largeModal" aria-hidden="true">
          <div class="modal-dialog modal-lg">
              <div class="modal-content">
                  <div class="modal-header">
                 
                      <h3 class="modal-title" id="myModalLabel"></h3>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <form id="barangForm" name="barangForm" class="form-horizontal" data-action='multiple'">
                      <input type="hidden" name="barang_id" id="barang_id">
                      <div class="modal-body">
                        <div class="form-group">
                            <label for="kode_barang" class="control-label col-xs-3">Kode Barang</label>
                            <div class="row">
                                <div class="col-sm-12">
                                    <input name="kode_barang" id="kode_barang" class="form-control" type="text" placeholder="Kode Barang.." readonly required>
                                </div>
                            </div>
                          </div>
                          <div class="form-group">
                              <label for="jenis_barang" class="control-label col-xs-3">Jenis Barang</label>
                              <div class="col-xs-9">
                                <select class="custom-select" name="jenis_barang" id="jenis_barang"></select>
                              </div>
                          </div>
                          <div class="form-group">
                              <label for="nama_barang" class="control-label col-xs-3">Nama Barang</label>
                              <div class="col-xs-9">
                                  <input name="nama_barang" id="nama_barang" class="form-control" type="text" placeholder="Nama Barang.." required>
                              </div>
                          </div>
                          <div class="form-group" id="viewBerat">
                              <label for="berat" class="control-label col-xs-3">Berat</label>
                              <div class="col-xs-9">
                              <input name="berat" id="berat" class="form-control" type="number" min="0" pattern="[0-9]+([\.,][0-9]+)?" step="0.01" placeholder="berat..">
                                </div>
                          </div>
                          <div class="form-group" id="viewKadar">
                              <label for="kadar" class="control-label col-xs-3">Kadar</label>
                              <div class="col-xs-9">
                                  <input name="kadar" id="kadar" class="form-control" type="number" min="0" placeholder="Kadar..">
                              </div>
                          </div>
                          <div class="form-group" id="viewStok">
                            <label for="stok" class="control-label col-xs-3">Stok</label>
                            <div class="col-xs-9">
                                <input name="stok" id="stok" class="form-control" type="number" min="0" placeholder="stok..">
                            </div>
                          </div>
                          <div class="form-group" id='statusBarang'>
                              <label for="statusBarangValue" class="control-label col-xs-3">Status Barang</label>
                              <div class="col-xs-9">
                              <select class="custom-select" name="status_barang" id="statusBarangValue">
                                    <option value="" selected disabled>Pilih Status</option>
                                    <option value="0">0</option>
                                    <option value="1">1</option>
                                    <option value="R">R</option>
                                    <option value="S">S</option>
                                </select>  
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
                                        <div id="viewCurrentFoto" class="mx-auto mb-3"></div>
                                    </div>
                                    <div class="row">
                                        <div class="btn-group m-auto" role="group" aria-label="Camera Take">
                                            <button class="btn btn-primary " id="btnTake" type="button"> Ambil Gambar [F9]</button>
                                            <button class="btn btn-danger ml-2" id="btnAgain" type="button"> Coba Lagi [F4]</button>
                                            <button class="btn btn-warning ml-2" id="btnChangeFoto" type="button"> Ganti Foto </button>
                                        </div>
                                    <input name="old_foto" id="old_foto" class="form-control" type="hidden">
                                    </div>
                                </div>
                              </div>
                          </div>
                          <div class="form-group">
                              <label for="harga_beli" class="control-label col-xs-3">Harga Beli</label>
                              <div class="col-xs-9">
                                  <input name="harga_beli" id="harga_beli" class="form-control" type="text" placeholder="Harga beli..">
                              </div>
                          </div>
                          <div class="form-group">
                              <label for="harga_jual" class="control-label col-xs-3">Harga Jual</label>
                              <div class="col-xs-9">
                                  <input name="harga_jual" id="harga_jual" class="form-control" type="text" placeholder="Harga jual..">
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
      </div> ${this._modalImageView()}`;
	},

	_modalImageView() {
		return /*html*/ `<div id="imageModal" class="modalImage">
        <img class="imgModal" id="imageView">
     <div id="caption"></div>`
	},

	async afterRender() {
		await this._initialTable();
		await initialSecurity.init({
			statePage: 'barang'
		})
	},

	async _initialTable() {
		await initialBarang.init();
	},



	_errorContent(container) {
		const errorContent = document.getElementById('main-content');
		errorContent.innerHTML = `<div class="msg-failed">
                             <span class="fa fa-pencil"></span>
                              <p class="center">Maaf , Aplikasi tidak dapat di tampilkan. Periksa kembali internet anda ya &#128522</p>
                             </div>`;
	},

};

export default Barang;
