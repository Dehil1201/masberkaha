import initialJenisBarang from '../../presenter/master/initial_jenisbarang.js'
import initialSecurity from '../../presenter/setting/initial_security.js'

const JenisBarang = {
    async render() {
      return `  

        <h1 class="h3 mb-2 text-gray-800">Jenis Barang/Devisi</h1>
      
      <!-- DataTales Example -->
      <div class="card shadow mb-4">
          <div class="card-header py-3">
             
          <button class="btn btn-success btn-condensed" id="create_data" title="Tambah Data Devisi"><i class="fa fa-plus"></i> Tambah Data [F1]</button>
          <button class="btn btn-info btn-condensed" id="refresh" title="Refresh Devisi"><i class="fas fa-sync"></i> Refresh [Ctrl + F5]</button>
      
          </div>
          <div class="card-body">

              <div class="table-responsive">
                  <table class="table table-bordered" id="tableJenisBarang" width="100%" cellspacing="0">
                      <thead>
                          <tr>
                              <th>ID</th>
                              <th>Jenis Barang</th>
                              <th>Kode Jenis</th>
                              <th>Penjualan Satuan</th>
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
                  <form id="jenisBarangForm" name="jenisBarangForm" class="form-horizontal" data-action='multiple'">
                      <input type="hidden" name="jenisbarang_id" id="jenisbarang_id">
                      <div class="modal-body">
                        <div class="form-group">
                            <label for="jenis_barang" class="control-label col-xs-3">Jenis Barang</label>
                            <div class="col-xs-9">
                                <input name="jenis_barang" id="jenis_barang" class="form-control" type="text" placeholder="Jenis Barang" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="kode_jenis" class="control-label col-xs-3">Kode Jenis</label>
                            <div class="col-xs-9">
                                <input name="kode_jenis" id="kode_jenis" class="form-control" type="text" placeholder="Kode Jenis" required>
                            </div>
                        </div>
                        <div class="form-group form-check">
                            <input type="checkbox" class="form-check-input" name="penjualan_satuan" id="penjualan_satuan">
                            <label class="form-check-label" for="penjualan_satuan"><b>Checklist bila termasuk jenis Penjualan Satuan!</b></label>
                        </div>
                      </div>
      
                      <div class="modal-footer">
                          <button type="button" class="btn btn-danger" data-dismiss="modal" aria-hidden="true">Tutup</button>
                          <button type="submit" class="btn btn-info" id="btn-save">Simpan</button>
                      </div>
                  </form>
              </div>
          </div>
      </div>
      <!--END MODAL ADD-->
          `;
    },
  
    async afterRender() {
    await  this._initialTable();
    await initialSecurity.init({statePage : 'jenis_barang'});
    },

    async _initialTable(){
       await initialJenisBarang.init();
    },


  
    _errorContent(container) {
      const errorContent = document.getElementById('main-content');
      errorContent.innerHTML = `<div class="msg-failed">
                             <span class="fa fa-pencil"></span>
                              <p class="center">Maaf , Aplikasi tidak dapat di tampilkan. Periksa kembali internet anda ya &#128522</p>
                             </div>`;
    },

  };
  
  export default JenisBarang;
  

