import initialBarcodeBarang from '../../presenter/master/initial_barcodebarang.js'
import initialSecurity from '../../presenter/setting/initial_security.js'
const BarcodeBarang = {
	async render() {
		return `  

        <h1 class="h3 mb-2 text-gray-800">Cetak Barcode Barang</h1>
      
      <!-- DataTales Example -->
      <div class="card shadow mb-4">
          <div class="card-header py-3">
          <div class="card-body">
                    <form id="filterListBarang">
                        <div class="form-group row">
                            <label for="startDate" class="col-sm-2 col-form-label">Tanggal Awal</label>
                            <div class="col-sm-3">
                            <input type="date" class="form-control" id="startDate">
                            </div>
                            <div class="col-sm-3">
                            <select class='form-control' id="pilihTransaksi">
                                <option value=''>-- Pilih Status --</option>
                                <option value='1'>1</option>
                                <option value='2'>0</option>
                                <option value='3'>S</option>
                                <option value='4'>R</option>
                            </select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="endDate" class="col-sm-2 col-form-label">Tanggal Akhir</label>
                            <div class="col-sm-3">
                            <input type="date" class="form-control" id="endDate">
                            </div>
                            <div class="col-sm-3">
                                <select class='form-control' id="pilih_jenis"></select>
                            </div>
                            <div class="col-sm-3">
                                <button class="btn btn-success col-sm-12" type="submit" id="filterData" title="Filter Data"><i class="fas fa-search"></i> Filter [F9]</button>
                            </div>
                        </div>
                    </form>
                </div>
            <button class="btn btn-info btn-condensed" id="refresh" title="Refresh Data Barang"><i class="fas fa-sync"></i> Refresh [Ctrl + F5]</button>
            <input type="number" class="form" id="index-print-custom" placeholder='cetak ke ..'>

            <button class="btn btn-primary btn-condensed" id="print-out" title="Print Barcode"><i class='fas fa-print'></i> Print [Ctrl + F10]</button>
          </div>
          <div class="card-body">

              <div class="table-responsive">
                  <table class="table table-bordered" id="tableBarcodeBarang" width="100%" cellspacing="0">
                      <thead>
                          <tr>
                              <th width="10"><input type="checkbox" id='select-all' /></th>
                              <th>Kode Barang</th>
                              <th>Nama Barang</th>
                              <th>Jenis Barang</th>
                              <th>Berat</th>
                              <th>Kadar</th>
                              <th>Harga Jual</th>
                              <th>Status</th>
                              <th>Tanggal</th>
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
      <div id="printResultBarcode"></div>`;
	},

	async afterRender() {
		await this._initialTable();
		await initialSecurity.init({
			statePage: 'cetak_barcode'
		})
	},

	async _initialTable() {
		await initialBarcodeBarang.init();
	},



	_errorContent(container) {
		const errorContent = document.getElementById('main-content');
		errorContent.innerHTML = `<div class="msg-failed">
                             <span class="fa fa-pencil"></span>
                              <p class="center">Maaf , Aplikasi tidak dapat di tampilkan. Periksa kembali internet anda ya &#128522</p>
                             </div>`;
	},

};

export default BarcodeBarang;
