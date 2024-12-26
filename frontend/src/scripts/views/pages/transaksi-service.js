import initialServices from "../../presenter/transaksi/initial_services.js";


const TransaksiServices = {
	async render() {
		const view = `<div class="page-content-wrap">

        <div class="row">
            <div class="col-md-12">
            <h4 class="mb-3 font-weight-bold text-primary">Transaksi Servis</h4>
                <button class="btn btn-success btn-condensed" data-toggle="modal" data-target="#modalService"
                    id="create_data"><i class="fa fa-plus"></i> Tambah Data Servis [Ctrl+F6]</button>
    
                <div class="col-md-12 mt-2">
                    <div class="table-responsive">
                        <table class="table" id='table-services'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Faktur Servis</th>
                                    <th>Nama Pelanggan</th>
                                    <th>Tanggal</th>
                                    <th>Total Servis</th>
                                    <th>Kasir</th>
                                    <th>Kerusakan</th>
                                    <th>Status</th>
                                    <th>Keterangan</th>
                                </tr>
                            </thead>
                            <tbody id="listJasaServis"></tbody>
                        </table>
                    </div>
                </div>
    
                <p class="text-right border-bottom  border-secondary">Keterangan Shortcut</p>
                <div class="card">
                    <div>
                        <div class="col-md-12 ">
                            <button type="button" class="btn btn-default  btn-notification ">
                            <i class="fa fa-dollar"></i><b>Ctrl+F6</b> Tambah Data Servis </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </form>
    </div>
    </div>
    </div> ${this._modalAddTransaksiView()}  ${this._modalPelangganView()} `;
		return view;
	},

	async afterRender() {
		await initialServices.init(); await initialSecurity.init({
			statePage: 'transaksi_jasa_servis'
		});
	},

	_modalAddTransaksiView() {
		return `<div class="modal fade bd-example-modal-lg" id="modalService" tabindex="-1" role="dialog" aria-labelledby="largeModal" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
               
                    <h3 class="modal-title" id="myModalLabel">Tambah Data Service</h3>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>

                <form id="serviceForm" class="form-horizontal" ">
                    <div class="modal-body">

                       <div class="form-group row">
                            <label for="faktur" class="col-sm-3 col-form-label">Faktur</label>
                            <div class="col-sm-9">
                                <input name="faktur" id="faktur" class="form-control" type="text" required>
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="namaPelanggan" class="col-sm-3 col-form-label">Nama Pelanggan</label>
                            <div class="col-sm-5">
                                <input type="hidden" class="form-control" id="idPelanggan">
                                <input type="text" class="form-control" id="namaPelanggan" placeholder="Nama Pelanggan">
                            </div>
                            <button id="pilihPelanggan" data-toggle="modal" data-target="#modalPelanggan" class="btn btn-outline-info" type="button">
                            <i class="far fa-user"></i>
                            Pilih Pelanggan [Ctrl+F7]</button>
                      </div>

                        <div class="form-group row">
                            <label for="date" class="control-label col-sm-3">tanggal</label>
                            <div class="col-sm-9">
                            <input name="date" id="date" type='date' class="form-control">
                              </div>
                        </div>

                        <div class="form-group row">
                            <label for="kerusakan" class="col-sm-3 col-form-label">Kerusakan</label>
                            <div class="col-sm-9">
                                <input name="kerusakan" id="kerusakan" class="form-control" type="text" placeholder="Kerusakan.." required>
                            </div>
                        </div>

                        <div class="form-group row">
                        <label for="grandtotal" class="col-sm-3 col-form-label">GrandTotal</label>
                        <div class="col-sm-9">
                            <input name="grandTotal" id="grandTotal" class="form-control" type="text" placeholder="grandtotal" required>
                        </div>
                    </div>


                    <div class="form-group row">
                    <label for="bayar" class="col-sm-3 col-form-label">Bayar</label>
                    <div class="col-sm-9">
                        <input name="bayar" id="bayar" class="form-control" type="text"  required>
                    </div>
                </div>


                <div class="form-group row">
                <label for="kembalian" class="col-sm-3 col-form-label">Kembalian</label>
                <div class="col-sm-9">
                    <input name="kembalian" id="kembalian" class="form-control" type="text" disabled required>
                </div>
            </div>
                        
                        
                </div>
    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-dismiss="modal" aria-hidden="true">Tutup [Esc]</button>
                        <button type="submit" class="btn btn-info" id="btn-save">Simpan</button>
                    </div>

                </form>
            </div>
        </div>
    </div>`
	},

	_modalPelangganView() {
		return `<div class="modal fade " id="modalPelanggan" tabindex="-1" role="dialog" aria-labelledby="EditPostLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content ">
                <div class="modal-header modal-header-primary">
                    <h5 class="modal-title" id="EditPostLabel"><i class="fa fa-check-square-o" aria-hidden="true"></i> Pilih Pelanggan</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
    
            <div class="modal-body">
                <div class="table-responsive">
                <table class="table table-bordered table-sm" id="tablePelanggan" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nama</th>
                            <th>Alamat</th>
                            <th>Kota</th>
                            <th>No Hp</th>
                            <th>Email</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                </table>
                </div>
            </div>
            </div>
        </div>
    </div>`
	},

	_errorContent(container) {
		const errorContent = document.getElementById('main-content');
		errorContent.innerHTML = `<div class="msg-failed">
                             <span class="fa fa-pencil"></span>
                              <p class="center">Maaf , Aplikasi tidak dapat di tampilkan. Periksa kembali internet anda ya &#128522</p>
                             </div>`;
	},

};

export default TransaksiServices;
