import initialHutang from '../../presenter/transaksi/initial_hutang.js'
import initialSecurity from '../../presenter/setting/initial_security.js'
const Hutang = {
	async render() {
		const view = /*html*/ `  
        <style>
            .modal-header-primary {
                color: #fff;
                background-color: #0C69D7;
            }
        </style>
        <h1 class="h3 mb-2 text-gray-800">Data Hutang</h1>
      
      <!-- DataTales Example -->
      <div class="card shadow mb-4">
          <div class="card-header py-3">
             
          <button class="btn btn-info btn-condensed" id="refresh" title="Refresh Data"><i class="fas fa-sync"></i> Refresh [Ctrl + F5]</button>
          <button class="btn btn-success btn-condensed" id="lunas" title="Tampilkan Lunas"><i class="fa fa-check"></i> Lunas [F1]</button>
          <button class="btn btn-warning btn-condensed" id="belumLunas" title="Tampilkan Belum Lunas"><i class="fa fa-window-close"></i> Belum Lunas [F2]</button>
          <button class="btn btn-danger btn-condensed" id="belumBayar" title="Tampilkan Belum Dibayar"><i class="fa fa-times"></i> Belum Dibayar [F4]</button>
      
          </div>
          <div class="card-body">

              <div class="table-responsive">
                  <table class="table table-bordered" id="tableHutang" width="100%" cellspacing="0">
                      <thead>
                          <tr>
                              <th>ID</th>
                              <th>Tanggal</th>
                              <th>Faktur</th>
                              <th>Hutang</th>
                              <th>Hutang Dibayar</th>
                              <th>Hutang Sisa</th>
                              <th>Tempo</th>
                              <th>Supplier</th>
                              <th>Kasir</th>
                              <th>Aksi</th>
                          </tr>
                      </thead>
                      <tfoot>
                        <tr>
                            <th style="width:50px"></th>
                            <th>Total</th>
                            <th></th>
                            <th>Hutang</th>
                            <th>Hutang Dibayar</th>
                            <th>Hutang Sisa</th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th style="width:30px"></th>
                            </tr>
                      </tfoot>
                  </table>
              </div>
          </div>
      </div> ${this._modalPembelianView()} ${this._modalHutangView()}`;
		return view;
	},

	async afterRender() {
		await this._initialTable();
		await initialSecurity.init({
			statePage: 'transaksi_hutang'
		})
	},

	async _initialTable() {
		await initialHutang.init();
	},

	_modalPembelianView() {
		return /*html*/ `<div class="modal fade bd-example-modal-lg" id="modalPembelian" tabindex="-1" role="dialog" aria-labelledby="largeModal"
        aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
        
                    <h3 class="modal-title" id="myModalLabel"></h3>
                    <button type="button" title="Close modal" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div style="overflow-y: auto;height:500px;">
                    <div id="printArea" class="modal-body">
                        <span style="font-size:20px">
                            <center>BUKTI PEMBAYARAN HUTANG</center>
                        </span>
                        <table class="table">
                            <tr>
                                <td style="width:200px">Tanggal</td>
                                <td style="width:30px">:</td>
                                <td id="dateHutang">null</td>
                                <td style="width:200px">Supplier</td>
                                <td style="width:30px">:</td>
                                <td id="namaSupplier">null</td>
                            </tr>
                            <tr>
                                <td>Faktur Hutang</td>
                                <td>:</td>
                                <td id="lblFakturHutang">null</td>
                                <td>Status</td>
                                <td>:</td>
                                <td id="statusHutang">null</td>
                            </tr>
                            <tr>
                                <td>Jatuh Tempo</td>
                                <td>:</td>
                                <td id="tempoHutang">null</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </table>
                        <div class="form-group row">
                            <label for="lblHutang" class="col-sm-2 ml-auto col-form-label"><b>Total Hutang</b></label>
                            <div class="col-sm-4">
                            <input id="lblHutang" class="form-control" value="0" readonly="">
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="lblHutangBayar" class="col-sm-2 ml-auto col-form-label"><b>Hutang Terbayar</b></label>
                            <div class="col-sm-4">
                            <input id="lblHutangBayar" class="form-control" value="0" readonly="">
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="lblHutangSisa" class="col-sm-2 ml-auto col-form-label"><b>Hutang Sisa</b></label>
                            <div class="col-sm-4">
                            <input id="lblHutangSisa" class="form-control" value="0" readonly="">
                            </div>
                        </div>
                        <style>
                            .isi {
                                border-top: 0px;
                                border-left: 0px;
                                border-right: 0px;
                                border-bottom: 1px solid #000;
                                text-align: center;
                            }
        
                            .isi2 {
                                width: 90px;
                                border-top: 0px;
                                border-left: 0px;
                                border-right: 0px;
                                border-bottom: 1px solid #000;
        
                            }
        
                            .tertanda>tr,
                            td {
                                border: none
                            }
                        </style>
        
                        <table class="table ">
                            <tr>
                                <td>
                                    <center><br><br>Dibayar oleh</center>
                                </td>
                                <td>
                                    <center><input class="isi" placeholder="">,<input class="isi2 datepicker-here"
                                            placeholder=""><br><br>Diterima oleh</center>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding-top:40px">
                                    <center><input class="isi"></center>
                                </td>
                                <td style="padding-top:40px">
                                    <center><input class="isi"></center>
                                </td>
                            </tr>
        
                        </table>
                    </div>
                </div>
    
                <div class="modal-footer">
                <button type="button" title="Bayar Hutang" id="bayarHutang" class="btn btn-success" aria-hidden="true"><i class="fas fa-check" aria-hidden="true"></i> Bayar Hutang</button>
                <button type="button" id="printHutang" title="Print Bukti Hutang" onclick="jQuery('#printArea').print()" class="btn btn-primary" aria-hidden="true"><i class="fas fa-print" aria-hidden="true"></i> Print</button>
                <button type="button" class="btn btn-danger" title="Close Modal" data-dismiss="modal" aria-hidden="true"><i class="fas fa-window-close" aria-hidden="true"></i> Tutup</button>
                </div>
            </div>
        </div>
        </div>`
	},

	_modalHutangView() {
		return /*html*/ `<div class="modal fade bd-example-modal-lg" id="modalHutang" tabindex="-1" role="dialog" aria-labelledby="largeModal"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header modal-header-primary">
                    <h3 class="modal-title" id="myModalLabel2"></h3>
                </div>
        
                <form id="hutangForm" name="hutangForm" class="form-horizontal">
                    <input type="hidden" name="hutang_id" id="hutang_id">
                    <div class="modal-body">
                        <div class="form-group row">
                            <label for="fakturBayar" class="col-sm-5 col-form-label"><b>Faktur Pembayaran</b></label>
                            <div class="col-sm-7">
                                <input id="fakturBayar" class="form-control" value="null">
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="fakturHutang" class="col-sm-5 col-form-label"><b>Faktur Hutang</b></label>
                            <div class="col-sm-7">
                                <input id="fakturHutang" class="form-control" value="null">
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="hutang" class="col-sm-5 col-form-label"><b>Total Hutang</b></label>
                            <div class="col-sm-7">
                                <input id="hutang" class="form-control" value="0" readonly>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="hutangBayar" class="col-sm-5 col-form-label"><b>Hutang Terbayar</b></label>
                            <div class="col-sm-7">
                                <input id="hutangBayar" class="form-control" value="0" readonly>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="hutangSisa" class="col-sm-5 col-form-label"><b>Hutang Sisa</b></label>
                            <div class="col-sm-7">
                                <input id="sisa" type="hidden">
                                <input id="hutangSisa" class="form-control" value="0" readonly>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="bayarTunai" class="col-sm-5 col-form-label"><b>Pembayaran Tunai</b></label>
                            <div class="col-sm-7">
                                <input id="bayarTunai" class="form-control" value="0">
                            </div>
                        </div>
                    </div>
        
                    <div class="modal-footer">
                    <button type="submit" title="Proses Transaksi" id="bayar" class="btn btn-success" aria-hidden="true"><i class="fas fa-check" aria-hidden="true"></i> Simpan</button>
                    <button type="button" class="btn btn-danger" title="Batalkan transaksi" data-dismiss="modal" aria-hidden="true"><i class="fas fa-window-close" aria-hidden="true"></i> Tutup</button>
                    </div>
        
                </form>
            </div>
        </div>
        </div>`
	},

	_errorContent() {
		const errorContent = document.getElementById('main-content');
		errorContent.innerHTML = `<div class="msg-failed">
                             <span class="fa fa-pencil"></span>
                              <p class="center">Maaf , Aplikasi tidak dapat di tampilkan. Periksa kembali internet anda ya &#128522</p>
                             </div>`;
	},

};

export default Hutang;
