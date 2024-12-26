import initialJenisUser from '../../presenter/master/initial_jenisuser.js';
import initialSecurity from '../../presenter/setting/initial_security.js';

const JenisUser = {
    async render() {
      return `  

        <h1 class="h3 mb-2 text-gray-800">Jenis User</h1>
      
      <!-- DataTales Example -->
      <div class="card shadow mb-4">
          <div class="card-header py-3">
             
          <button class="btn btn-success btn-condensed" id="create_data" title="Tambah Data Level User"><i class="fa fa-plus"></i> Tambah Data [F1]</button>
          <button class="btn btn-info btn-condensed" id="refresh" title="Refresh Data Level User"><i class="fas fa-sync"></i> Refresh [Ctrl + F5]</button>
      
          </div>
          <div class="card-body">

              <div class="table-responsive">
                  <table class="table table-bordered" id="tableJenisUser" width="100%" cellspacing="0">
                      <thead>
                          <tr>
                              <th>ID</th>
                              <th>Jenis User</th>
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
                  <form id="jenisUserForm" name="jenisUserForm" class="form-horizontal" data-action='multiple'">
                      <input type="hidden" name="akses_id" id="akses_id">
                      <div class="modal-body">
                          <div class="form-group">
                              <label for="level" class="control-label col-xs-3">Jenis User</label>
                              <div class="col-xs-9">
                                  <input name="level" id="level" class="form-control" type="text" placeholder="Jenis User" required>
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
    await initialSecurity.init({statePage : 'level_user'});
    },

    async _initialTable(){
        await initialJenisUser.init();
    },


  
    _errorContent(container) {
      const errorContent = document.getElementById('main-content');
      errorContent.innerHTML = `<div class="msg-failed">
                             <span class="fa fa-pencil"></span>
                              <p class="center">Maaf , Aplikasi tidak dapat di tampilkan. Periksa kembali internet anda ya &#128522</p>
                             </div>`;
    },

  };
  
  export default JenisUser;
  

