// import initialActivityLog from '../../presenter/initial_activity-log'

const ActivityLog = {
    async render() {
      return `  

        <h1 class="h3 mb-2 text-gray-800">Data User</h1>
      
      <!-- DataTales Example -->
      <div class="card shadow mb-4">
          <div class="card-header py-3">
             
          <button class="btn btn-success btn-condensed" id="create_data"><i class="fa fa-plus"></i> Tambah Data</button>
          <button class="btn btn-info btn-condensed" id="refresh"><i class="fa fa-refresh"></i> Refresh</button>
      
          </div>
          <div class="card-body">

              <div class="table-responsive">
                  <table class="table table-bordered" id="tableUser" width="100%" cellspacing="0">
                      <thead>
                          <tr>
                              <th>ID</th>
                              <th>user_id</th>
                              <th>Username</th>
                              <th>Level</th>
                              <th>Alamat</th>
                              <th>NoHp</th>
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
                  <form id="userForm" name="userForm" class="form-horizontal" data-action='multiple'">
                      <input type="hidden" name="user_id" id="user_id">
                      <div class="modal-body">
                          <div class="form-group">
                              <label for="nama_user" class="control-label col-xs-3">Nama User</label>
                              <div class="col-xs-9">
                                  <input name="nama_user" id="nama_user" class="form-control" type="text" placeholder="Nama User.." required>
                              </div>
                          </div>
                          <div class="form-group">
                              <label for="username" class="control-label col-xs-3">Username</label>
                              <div class="col-xs-9">
                                  <input name="username" id="username" class="form-control" type="text" placeholder="Username.." required>
                              </div>
                          </div>
                          <div class="form-group">
                              <label for="password" class="control-label col-xs-3">Password</label>
                              <div class="col-xs-9">
                                  <input name="password" id="password" class="form-control" type="password" placeholder="password **">
                              </div>
                          </div>
                          <div class="form-group">
                              <label for="level" class="control-label col-xs-3">Jenis User</label>
                              <div class="col-xs-9">
                                <select class="custom-select" name="level" id="level" required>
                                    <option value="-" selected disabled>Pilih Jenis</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Kasir">Kasir</option>
                                </select>
                            </div>
                          </div>
                          <div class="form-group">
                          <label for="alamat" class="control-label col-xs-3">Alamat</label>
                          <div class="col-xs-9">
                              <textarea name="alamat" id="alamat" class="form-control" required placeholder="Alamat.." style="resize: vertical;"></textarea>
                          </div>
                          <div class="form-group">
                              <label for="no_hp" class="control-label col-xs-3">No. Hp</label>
                              <div class="col-xs-9">
                                  <input name="no_hp" id="no_hp" class="form-control" type="tel" placeholder="No. Hp.." required>
                              </div>
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
        await initialSecurity.init({statePage : 'user'});
    },

   async _initialTable(){
       await initialUser.init();  
    },


  
    _errorContent(container) {
      const errorContent = document.getElementById('main-content');
      errorContent.innerHTML = `<div class="msg-failed">
                             <span class="fa fa-pencil"></span>
                              <p class="center">Maaf , Aplikasi tidak dapat di tampilkan. Periksa kembali internet anda ya &#128522</p>
                             </div>`;
    },

  };
  
  export default ActivityLog;
  

