import initialBarangRusak from '../../presenter/utils/initial_barang-rusak.js';
import initialSecurity from '../../presenter/setting/initial_security.js';
const BarangRusak = {
	async render() {
		return `  

        <h1 class="h3 mb-2 text-gray-800">Data Barang Rusak</h1>
      
      <!-- DataTales Example -->
      <div class="card shadow mb-4">
        <div class="card-header py-3">
            <button class="btn btn-info btn-condensed" id="refresh" title="Refresh Data"><i class="fas fa-sync"></i> Refresh [Ctrl + F5]</button>
        </div>
      <div class="card shadow mb-4">
          <div class="card-body">

              <div class="table-responsive">
                  <table class="table table-bordered" id="tableBarangRusak" width="100%" cellspacing="0">
                      <thead>
                          <tr>
                              <th>ID</th>
                              <th>Kode Barang</th>
                              <th>Nama Barang</th>
                              <th>Jenis Barang</th>
                              <th>Berat</th>
                              <th>Kadar</th>
                              <th>Status</th>
                              <th>HargaBeli</th>
                              <th>Harga Jual</th>
                          </tr>
                      </thead>
                      <tfoot>
                          
                      </tfoot>
                      <tbody>
                        
                        
                         
                      </tbody>
                  </table>
              </div>
          </div>
      </div>`;
	},

	async afterRender() {
		await this._initialTable();
		await initialSecurity.init({
			statePage: 'barang_rusak'
		})
	},

	async _initialTable() {
		await initialBarangRusak.init();
	},



	_errorContent(container) {
		const errorContent = document.getElementById('main-content');
		errorContent.innerHTML = `<div class="msg-failed">
                             <span class="fa fa-pencil"></span>
                              <p class="center">Maaf , Aplikasi tidak dapat di tampilkan. Periksa kembali internet anda ya &#128522</p>
                             </div>`;
	},

};

export default BarangRusak;
