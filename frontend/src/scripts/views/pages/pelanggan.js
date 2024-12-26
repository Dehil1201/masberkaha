import initialPelanggan from '../../presenter/master/initial_pelanggan.js'

import initialSecurity from '../../presenter/setting/initial_security.js'
const Pelanggan = {
    async render() {
      return `  

        <h1 class="h3 mb-2 text-gray-800">Data Pelanggan</h1>
      
      <!-- DataTales Example -->
      <div class="card shadow mb-4">
          <div class="card-header py-3">
          <p class="col-sm-3 col-form-label">Cetak Kartu Member</p>
          <div class="form-group row ml-1">
                <div class="col-sm-4">
                    <input type="number" class="form-control" placeholder="dari" id="startNumberCard">
                </div>
                <div class="col-sm-4">
                    <input type="number" class="form-control" placeholder="sampai" id="endNumberCard">
                </div>
                <div class="col-sm-4">
                <button class="btn btn-info btn-condensed" id="printMemberCard" title="Cetak Kartu Member"><i class="fas fa-print"></i> Cetak Kartu Member</button>
                </div>
                             
          </div>
            
          <button class="btn btn-success btn-condensed" id="create_data" title="Tambah Data Pelanggan"><i class="fa fa-plus"></i> Tambah Data [F1]</button>
          <button class="btn btn-info btn-condensed" id="refresh" title="Refresh Data Pelanggan"><i class="fas fa-sync"></i> Refresh [Ctrl + F5]</button>
      
          </div>
          <div class="card-body">

              <div class="table-responsive">
                  <table class="table table-bordered" id="tablePelanggan" width="100%" cellspacing="0">
                      <thead>
                          <tr>
                              <th>ID</th>
                              <th>Kode Pelanggan</th>
                              <th>Nama</th>
                              <th>Alamat</th>
                              <th>Kota</th>
                              <th>No Hp</th>
                              <th>Email</th>
                              <th>Point</th>
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

    <div id="printResultMember"></div>

      
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
                  <form id="pelangganForm" name="pelangganForm" class="form-horizontal" data-action='multiple'">
                      <input type="hidden" name="pelanggan_id" id="pelanggan_id">
                      <div class="modal-body">
                          <div class="form-group">
                              <label for="kode_pelanggan" class="control-label col-xs-3">Kode Pelanggan</label>
                              <div class="col-xs-9">
                                  <input name="kode_pelanggan" id="kode_pelanggan" class="form-control" type="text" placeholder="Kode Pelanggan.." required>
                              </div>
                          </div>
                          <div class="form-group">
                              <label for="nama_pelanggan" class="control-label col-xs-3">Nama Pelanggan</label>
                              <div class="col-xs-9">
                                  <input name="nama_pelanggan" id="nama_pelanggan" class="form-control" type="text" placeholder="Nama Pelanggan.." required>
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
                          <label for="email" class="control-label col-xs-3">Point</label>
                          <div class="col-xs-9">
                              <input name="point" id="point" class="form-control" type="number" placeholder="Point .. ">
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
        await initialSecurity.init({statePage : 'pelanggan'});
    },

    async _initialTable(){
       await initialPelanggan.init();
       
    },


  
    _errorContent(container) {
      const errorContent = document.getElementById('main-content');
      errorContent.innerHTML = `<div class="msg-failed">
                             <span class="fa fa-pencil"></span>
                              <p class="center">Maaf , Aplikasi tidak dapat di tampilkan. Periksa kembali internet anda ya &#128522</p>
                             </div>`;
    },

  };
  
  export default Pelanggan;
  

