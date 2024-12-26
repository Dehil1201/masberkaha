import initialCheckStok from '../../presenter/utils/initial_check-stok.js'
import initialSecurity from '../../presenter/setting/initial_security.js'

const CheckStok = {
	async render() {
		const view = /*html*/ ` <div class="page-content-wrap">
        <div class="row">
            <div class="col-md-12">
                <div class="card shadow mb-4">
    
                    <a href="#collapseCardExample" class="d-block card-header py-3" data-toggle="collapse" role="button"
                        aria-expanded="true" aria-controls="collapseCardExample">
                        <h6 class="m-0 font-weight-bold text-primary">Check Stok Barang</h6>
                    </a>
    
                    <div class="collapse show" id="collapseCardExample">
                        <div class="card-body">
                            <div class="form-row">
                                <div class="col-md-4 mb-3">
                                    <label for="barcodeBarang">Barcode Barang </label>
                                    <input type="text" class="form-control" name="barcodeBarang" id="barcodeBarang"
                                        placeholder="Barcode Barang" required>
                                </div>
                                <div class="col-md-3 mb-3">
                                <label>&nbsp;</label>
                                    <div class="input-group mb-3">
                                        <button class="btn btn-primary " id="recheckStok" type="button" title="Check Ulang Semua Data Barang"><i class="fas fa-check"></i> Check Ulang Semua Data [Ctrl + F10]</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card shadow mb-4">
            <a href="#collapseCheckBarang" class="d-block card-header py-3" data-toggle="collapse" role="button"
                aria-expanded="true" aria-controls="collapseCheckBarang">
                <h6 class="m-0 font-weight-bold text-primary">Barang Yang Belum Di Check</h6>
            </a>
            <div class="collapse show" id="collapseCheckBarang">
                <div class="card-header py-3">
                    <button class="btn btn-info btn-condensed" id="refresh" title="Refresh Data"><i class="fas fa-sync"></i> Refresh [Ctrl + F5]</button>
                </div>
                <div class="card-body">
    
                    <div class="table-responsive">
                        <table class="table table-bordered" id="tableCheckStok" width="100%" cellspacing="0">
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
                                    <th>Terakhir Check</th>
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
        </div>
    </div>`;

		return view;
	},

	async afterRender() {
        await initialCheckStok.init();
        await initialSecurity.init({statePage : 'stok_opname'})
	},

	async _initialTable() {

	},

	_errorContent() {
		const errorContent = document.getElementById('main-content');
		errorContent.innerHTML = `<div class="msg-failed">
                             <span class="fa fa-pencil"></span>
                              <p class="center">Maaf , Aplikasi tidak dapat di tampilkan. Periksa kembali internet anda ya &#128522</p>
                             </div>`;
	},

};

export default CheckStok;
