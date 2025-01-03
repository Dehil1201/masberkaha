import initialSettingToko from '../../presenter/setting/initial_setting-toko.js';

import initialSecurity from '../../presenter/setting/initial_security.js';

const SettingToko = {
  async render() {
    return /*html*/`<div class="page-content-wrap">
    <div class="row">

        <div class="col-xl-7 col-lg-7">
            <div class="card shadow mb-4">
                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Pengaturan</h6>
                </div>
                <div class="card-body">
                    <form id="settingTokoForm" name="settingTokoForm" class="form-horizontal" data-action='multiple'">
                  <div class=" modal-body">
                        <div class="form-group row">
                            <label for="id" class="col-sm-3 col-form-label">Id</label>
                            <div class="col-sm-8">
                                <input type="id" name='id' class="form-control" id="id" readonly>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="nama_toko" class="col-sm-3 col-form-label">Nama Toko</label>
                            <div class="col-sm-8">
                                <input name="nama_toko" id="nama_toko" class="form-control" type="text"
                                    placeholder="Nama Toko.." required>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="alamat" class="col-sm-3 col-form-label">Alamat</label>
                            <div class="col-sm-8">
                                <textarea name="alamat" id="alamat" class="form-control" placeholder="Alamat.."
                                    style="resize: vertical;"></textarea>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="no_hp" class="col-sm-3 col-form-label">No. Hp/Telp</label>
                            <div class="col-sm-8">
                                <input name="no_hp" id="no_hp" class="form-control" type="tel" placeholder="No. Hp..">
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="email" class="col-sm-3 col-form-label">Email</label>
                            <div class="col-sm-8">
                                <input name="email" id="email" class="form-control" type="email" placeholder="Email..">
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="point_gram" class="col-sm-3 col-form-label">Setting Point Member / Gram</label>
                            <div class="col-sm-8">
                                <input type="number" name='point_gram' class="form-control" id="point_gram">
                            </div>
                        </div>
                        <div class="form-group row text-right">
                            <div class="col-sm-11">
                                <button type="submit" title="Proses Pengaturan Toko"
                                    class="btn btn-primary">Update</button>
                            </div>
                        </div>
                </div>
                </form>
            </div>
        </div>

        <div class="card shadow mb-4">
            <div class="card-header py-3">
                <h6 class="m-0 font-weight-bold text-primary">Hapus Database</h6>
            </div>
            <div class="card-body">
                <div class="col-md-6 mb-3">
                    <button class="btn btn-danger btn-condensed form-control text-left" id="delete_all"
                        title="Hapus Semua"><i class="fa fa-trash"></i> Hapus Semua</button>
                </div>
                <div class="col-md-6 mb-3">
                    <button class="btn btn-danger btn-condensed form-control text-left" id="delete_barang"
                        title="Kosongkan Barang"><i class="fa fa-trash"></i> Kosongkan Barang</button>
                </div>
                <div class="col-md-6 mb-3">
                    <button class="btn btn-danger btn-condensed form-control text-left" id="kosongkan_harga"
                        title="Kosongkan Harga"><i class="fa fa-trash"></i> Kosongkan Harga Jual (Stok)</button>
                </div>
                <div class="col-md-6 mb-3">
                    <button class="btn btn-danger btn-condensed form-control text-left" id="delete_transaksi"
                        title="Hapus Transaksi"><i class="fa fa-trash"></i> Hapus Transaksi</button>
                </div>
                <div class="col-md-6 mb-3">
                    <button class="btn btn-danger btn-condensed form-control text-left" id="delete_supplier"
                        title="Kosongkan Supplier"><i class="fa fa-trash"></i> Kosongkan Supplier</button>
                </div>
                <div class="col-md-6 mb-3">
                    <button class="btn btn-danger btn-condensed form-control text-left" id="delete_pelanggan"
                        title="Kosongkan Pelanggan"><i class="fa fa-trash"></i> Kosongkan Pelanggan</button>
                </div>
            </div>
        </div>
    </div>
    <div class="col-xl-5 col-lg-5">
        <div class="card shadow mb-4">
            <div class="card-header py-3">
                <h6 class="m-0 font-weight-bold text-primary">Informasi Tambahan</h6>
            </div>
            <div class="card-body">
            <p>Informasi Mengenai <strong>Status Barang</strong></p>
            <p><strong>- 0 = Barang yang masih belum terjual belikan.</strong></p>
            <p><strong>- 1 = Barang yang sudah terjual dan diterima kembali.</strong></p>
            <p><strong>- J = Barang yang sudah terjual.</strong></p>
            <p><strong>- S = Barang yang sedang diservis</strong></p>
            <p><strong>- S1 = Barang yang belum sempet diservis (antrean)</strong></p>
            <p><strong>- R = Barang yang rusak atau ancuran.</strong></p>
        </div>
    </div>
</div>
<!-- <div class="col-xl-5 col-lg-5">
        <div class="card shadow mb-4">
            <div class="card-header py-3">
                <h6 class="m-0 font-weight-bold text-primary">Ganti Logo</h6>
            </div>
            <div class="card-body">
                    <form id="uploadFormLogo" name="uploadFormLogo">
                        <div class="bgColor">
                            <div id="targetLayerLogo" style="text-align: center;"><img style="width:50%;height: 270px;" src="http://localhost/sidamas/images/logo.jpg" class="image-preview"></div>
                            <div id="uploadFormLayer">
                                <input name="logoID" type="text" class="inputFile" id="logoID" value="1"
                                    style="display:none">
                                <input name="logoImg" type="file" class="inputFile" id="logoImg">
                                <div id="submitButton"><input type="submit" value="Upload gambar"
                                        class="btn btn-primary btn-sm" style="margin-top:3px">
                                    <a href="#" id="delLogoImg" class="btn btn-danger btn-sm"><i
                                            class="fa fa-remove"></i> hapus</a>
                                </div>
                                <span id="processLogo" style="display: none;"><img src="images/system/ajax-loader.gif"
                                        style="width:30px"> process..</span>
                                <div id="imgdeleteLogo"></div>
                            </div>
                        </div>
                    </form>
            </div>
        </div>
    </div> -->
</div>
</div>`;
  },

  async afterRender() {
    await initialSettingToko.init();
    await initialSecurity.init({
      statePage: 'setting_toko'
    });
  },

  _errorContent(container) {
    const errorContent = document.getElementById('main-content');
    errorContent.innerHTML = `<div class="msg-failed">
                             <span class="fa fa-pencil"></span>
                              <p class="center">Maaf , Aplikasi tidak dapat di tampilkan. Periksa kembali internet anda ya &#128522</p>
                             </div>`;
  },

};

export default SettingToko;


