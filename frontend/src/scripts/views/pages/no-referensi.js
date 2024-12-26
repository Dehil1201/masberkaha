import initialReferensi from '../../presenter/master/initial_referensi.js'
import initialSecurity from '../../presenter/setting/initial_security.js'

const Referensi = {
    async render() {
      return `  

        <h1 class="h3 mb-2 text-gray-800">No Referensi</h1>
      
      <div class="card shadow mb-4">
          <div class="card-header py-3">
             
            <button class="btn btn-info btn-condensed" id="refresh" title="Refresh Devisi"><i class="fas fa-sync"></i> Refresh [Ctrl + F5]</button>
      
          </div>
          <div class="card-body">

              <div class="table-responsive">
                  <table class="table table-bordered" id="tableReferensi" width="100%" cellspacing="0">
                      <thead>
                          <tr>
                              <th>ID</th>
                              <th>No Referensi</th>
                              <th>Nama Referensi</th>
                              <th>Tipe</th>
                              
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
                  <form id="ReferensiForm" name="ReferensiForm" class="form-horizontal" data-action='multiple'">
                      <input type="hidden" name="referensi_id" id="referensi_id">
                      <div class="modal-body">
                          
                          <div class="form-group">
                              <label for="kode_referensi" class="control-label col-xs-3">Kode Referensi</label>
                              <div class="col-xs-9">
                                  <input name="kode_referensi" id="kode_referensi" class="form-control" type="text" placeholder="No Referensi" required>
                              </div>
                          </div>
                          <div class="form-group">
                              <label for="nama_referensi" class="control-label col-xs-3">Nama Referensi</label>
                              <div class="col-xs-9">
                                  <input name="nama_referensi" id="nama_referensi" class="form-control" type="text" placeholder="Atas Nama" required>
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
     await  this._initialTable();
    await initialSecurity.init({statePage : 'no_referensi'});
    },

    async _initialTable(){
       await initialReferensi.init();
    },


  
    _errorContent(container) {
      const errorContent = document.getElementById('main-content');
      errorContent.innerHTML = `<div class="msg-failed">
                             <span class="fa fa-pencil"></span>
                              <p class="center">Maaf , Aplikasi tidak dapat di tampilkan. Periksa kembali internet anda ya &#128522</p>
                             </div>`;
    },

  };
  
  export default Referensi;
  

