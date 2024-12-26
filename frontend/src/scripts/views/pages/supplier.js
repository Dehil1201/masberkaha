import initialSupplier from '../../presenter/master/initial_supplier.js';
import initialSecurity from '../../presenter/setting/initial_security.js';

const Supplier = {
    async render() {
      return `  

        <h1 class="h3 mb-2 text-gray-800">Data Supplier</h1>
      
      <!-- DataTales Example -->
      <div class="card shadow mb-4">
          <div class="card-header py-3">
             
          <button class="btn btn-success btn-condensed" id="create_data" title="Tambah Data Supplier"><i class="fa fa-plus"></i> Tambah Data [F1]</button>
          <button class="btn btn-info btn-condensed" id="refresh" title="Refresh Data Supplier"><i class="fas fa-sync"></i> Refresh [Ctrl + F5]</button>
      
          </div>
          <div class="card-body">

              <div class="table-responsive">
                  <table class="table table-bordered" id="tableSupplier" width="100%" cellspacing="0">
                      <thead>
                          <tr>
                              <th>ID</th>
                              <th>Nama</th>
                              <th>Alamat</th>
                              <th>Kota</th>
                              <th>No Hp</th>
                              <th>Email</th>
                              <th>Website</th>
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
                  <form id="supplierForm" name="supplierForm" class="form-horizontal" data-action='multiple'">
                      <input type="hidden" name="supplier_id" id="supplier_id">
                      <div class="modal-body">
                          <div class="form-group">
                              <label for="nama_supplier" class="control-label col-xs-3">Nama supplier</label>
                              <div class="col-xs-9">
                                  <input name="nama_supplier" id="nama_supplier" class="form-control" type="text" placeholder="Nama supplier.." required>
                              </div>
                          </div>
                          <div class="form-group">
                              <label for="kota" class="control-label col-xs-3">Kota</label>
                              <div class="col-xs-9">
                                  <input name="kota" id="kota" class="form-control" type="text" placeholder="Kota..">
                              </div>
                          </div>
                          <div class="form-group">
                              <label for="alamat" class="control-label col-xs-3">Alamat</label>
                              <div class="col-xs-9">
                                  <textarea name="alamat" id="alamat" class="form-control" placeholder="Alamat.." style="resize: vertical;"></textarea>
                              </div>
                          </div>
                          <div class="form-group">
                              <label for="no_hp" class="control-label col-xs-3">No. Hp</label>
                              <div class="col-xs-9">
                                  <input name="no_hp" id="no_hp" class="form-control" type="tel" placeholder="No. Hp..">
                              </div>
                          </div>
                          <div class="form-group">
                              <label for="email" class="control-label col-xs-3">Email</label>
                              <div class="col-xs-9">
                                  <input name="email" id="email" class="form-control" type="email" placeholder="Email..">
                              </div>
                          </div>
                          <div class="form-group">
                              <label for="website" class="control-label col-xs-3">Website</label>
                              <div class="col-xs-9">
                                  <input name="website" id="website" class="form-control" type="text" placeholder="Website..">
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
      </div>
      <!--END MODAL ADD-->
          `;
    },
  
    async afterRender() {
     await this._initialTable();
     await initialSecurity.init({statePage : 'supplier'});
    },

    async _initialTable(){
        await initialSupplier.init();
    },


  
    _errorContent(container) {
      const errorContent = document.getElementById('main-content');
      errorContent.innerHTML = `<div class="msg-failed">
                             <span class="fa fa-pencil"></span>
                              <p class="center">Maaf , Aplikasi tidak dapat di tampilkan. Periksa kembali internet anda ya &#128522</p>
                             </div>`;
    },

  };
  
  export default Supplier;
  

