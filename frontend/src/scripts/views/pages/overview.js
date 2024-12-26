import OverviewInitiator from '../../presenter/overview-presenter.js';
import chartBar from '../../utils/initial-chart.js';

const Overview = {
	async render() {
		return `<div class="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 class="h3 mb-0 text-gray-800">Dashboard</h1>
        <a href="#/laporan-barang" class="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"><i
                class="fas fa-download fa-sm text-white-50"></i> Generate Report</a>
    </div>
    <div class="row">
    
        <div class="col-xl-3 col-md-6 mb-4" id='jumlah_pendapatan_penjualan_bulanan_dashboard'>
            <div class="card border-left-primary shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                Pendapatan Penjualan [Bulan ini]</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800" id='jumlah-pendapatan-bulanan'>Null</div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-calendar fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
    
        <div class="col-xl-3 col-md-6 mb-4" id='jumlah_user_dashboard'>
            <div class="card border-left-success shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                Jumlah User</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800" id='jumlah-user'>Null</div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-users fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
        <div class="col-xl-3 col-md-6 mb-4" id='jumlah_supplier_dashboard'>
            <div class="card border-left-danger shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-danger text-uppercase mb-1">
                                Jumlah Supplier</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800" id='jumlah-supplier'>-</div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-users-cog fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
        <div class="col-xl-3 col-md-6 mb-4" id='jumlah_pelanggan_dashboard'>
            <div class="card border-left-secondary shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-secondary text-uppercase mb-1">Jumlah Pelanggan
                            </div>
                            <div class="row no-gutters align-items-center">
                                <div class="col-auto">
                                    <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800" id="jumlah-pelanggan">-</div>
                                </div>
    
                            </div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-clipboard-list fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
        <div class="col-xl-3 col-md-6 mb-4" id='jumlah_barang_dashboard'>
            <div class="card border-left-warning shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                Jumlah Barang</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800" id='jumlah-barang'>Null</div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-table fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
        <div class="col-xl-3 col-md-6 mb-4" id='jumlah_barang_instok_dashboard'>
            <div class="card border-left-success shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                                Jumlah Barang Instok</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800" id='jumlah-barang-instok'>Null</div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-dolly-flatbed fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
        <div class="col-xl-3 col-md-6 mb-4" id='jumlah_barang_terjual_dashboard'>
            <div class="card border-left-danger shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-danger text-uppercase mb-1">
                                Jumlah Barang Terjual</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800" id='jumlah-barang-sold'>Null</div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-hand-holding-usd fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
        <div class="col-xl-3 col-md-6 mb-4" id='jumlah_berat_terjual_dashboard'>
            <div class="card border-left-primary shadow h-100 py-2">
                <div class="card-body">
                    <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                            <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                Jumlah Berat Terjual</div>
                            <div class="h5 mb-0 font-weight-bold text-gray-800" id='jumlah-berat-sold'>Null</div>
                        </div>
                        <div class="col-auto">
                            <i class="fas fa-balance-scale fa-2x text-gray-300"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="row">
        <div class="col-xl-12 col-lg-7" id="grafik_penjualan_bulanan_dashboard">
            <div class="card shadow mb-4">
                <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 class="m-0 font-weight-bold text-primary">Grafik Penjualan <span id="state-graph">Bulanan</span></h6>
                    <div class="dropdown no-arrow">
                        <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown"
                            aria-haspopup="true" aria-expanded="false">
                            <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                            aria-labelledby="dropdownMenuLink">
                            <div class="dropdown-header">Sumber Data:</div>
                            <a class="dropdown-item" href="#/data-penjualan">Kelola Data Penjualan</a>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <select class="form-select form-control col-5 mx-2 float-right select-siklus" style="max-width:220px"
                        aria-label="Pilih Siklus Grafik" id="siklus-grafik">
                        <option value="1">Harian</option>
                        <option selected value="2">Bulanan</option>
                    </select>
                    <div class="chart-area" style="position:unset">
                        <canvas id="chartPenjualan"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
	},

	async afterRender() {
		OverviewInitiator.init();
	},

	_errorContent(container) {
		const errorContent = document.getElementById('main-content');
		errorContent.innerHTML = `<div class="msg-failed">
                             <span class="fa fa-pencil"></span>
                              <p class="center">Maaf , Aplikasi tidak dapat di tampilkan. Periksa kembali internet anda ya &#128522</p>
                             </div>`;
	},

};

export default Overview;
