import initialSumber from '../../presenter/master/initial_sumber.js'
import initialSecurity from '../../presenter/setting/initial_security.js'

const Sumber = {
	async render() {
		return `<h1 class="h3 mb-2 text-gray-800" id="titleDaftarRekening">Daftar [Rekening]</h1>
      
      <div class="card shadow mb-4">
          <div class="card-header py-3">
             
          <button class="btn btn-success btn-condensed" id="create_data" title="Tambah Data Devisi"><i class="fa fa-plus"></i> Tambah Data [F1]</button>
          <button class="btn btn-info btn-condensed" id="refresh" title="Refresh Devisi"><i class="fas fa-sync"></i> Refresh [Ctrl + F5]</button>
      
          </div>
          <div class="card-body">

              <div class="table-responsive">
                  <table class="table table-bordered" id="tableSumber" width="100%" cellspacing="0">
                      <thead>
                          <tr>
                              <th>ID</th>
                              <th>No Rekening</th>
                              <th>Nama Jurnal</th>
                              <th>Saldo Awal</th>
                              <th>Debit</th>
                              <th>Kredit</th>
                              <th>Saldo Akhir</th>
                              <th>Jenis</th>
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
                  <form id="SumberForm" name="SumberForm" class="form-horizontal" data-action='multiple'">
                      <input type="hidden" name="saldo_id" id="saldo_id">
                      <div class="modal-body">
                          
                          <div class="form-group">
                              <label for="no_rekening" class="control-label col-xs-3">No Rekening</label>
                              <div class="col-xs-9">
                                  <input name="no_rekening" id="no_rekening" class="form-control" type="text" placeholder="No Rekening" required>
                              </div>
                          </div>
                          <div class="form-group">
                            <label for="an" class="control-label col-xs-3">Jenis</label>
                            <div class="col-xs-9">
                            <select class='form-control' id="jenis" name="jenis" required>
                                <option value="">--Pilih--</option>
                                <option>AKTIVA LANCAR</option>
                                <option>AKTIVA TETAP</option>
                                <option>PASSIVA</option>
                            </select>
                            </div>
                          </div>
                          <div class="form-group">
                              <label for="an" class="control-label col-xs-3">Nama Jurnal</label>
                              <div class="col-xs-9">
                                  <input name="an" id="an" class="form-control" type="text" placeholder="Nama Jurnal" required>
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
      <!--END MODAL ADD--> ${this._modalDetailHistorySaldo()}`;
	},

	_modalDetailHistorySaldo() {
		return /*html*/ `<div class="modal fade " id="modalDetailHistorySaldo" tabindex="-1" role="dialog" aria-labelledby="EditPostLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content ">
                <div class="modal-header modal-header-primary">
                    <h5 class="modal-title" id="titleRiwayatTransaksi"><i class="fa fa-check-square-o" aria-hidden="true"></i> Riwayat Transaksi </h5>
                    <button class="close" title="Close modal" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
    
            <div class="modal-body">
                <div class="table-responsive">
                <table class="table table-bordered" id="tableDetailHistorySaldo" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tanggal</th>
                            <th>Kode</th>
                            <th>Neraca</th>
                            <th>Nama Transaksi</th>
                            <th>Debet</th>
                            <th>Kredit</th>
                        </tr>
                    </thead>
                </table>
                </div>
            </div>
            </div>
        </div>
    </div>`;
	},

	async afterRender() {
		await this._initialTable();
		await initialSecurity.init({
			statePage: 'daftar_rekening'
		});
	},

	async _initialTable() {
		await initialSumber.init();
	},



	_errorContent(container) {
		const errorContent = document.getElementById('main-content');
		errorContent.innerHTML = `<div class="msg-failed">
                             <span class="fa fa-pencil"></span>
                              <p class="center">Maaf , Aplikasi tidak dapat di tampilkan. Periksa kembali internet anda ya &#128522</p>
                             </div>`;
	},

};

export default Sumber;
