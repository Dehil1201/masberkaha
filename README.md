Change to Separating Concept for Backend and Frontend

# sidamas
This project from toko mas asih  
Untuk kebutuhan api disesuai dengan nama controller..  

# Master  
store = menyimpan data  -> ex: base_url/pelanggan/store  
update = mengubah data  -> ex: base_url/pelanggan/update  
destroy = menghapus data  -> ex: base_url/pelanggan/destroy  

# auto faktur ->>  :  
auto faktur jual = faktur jual otomatis  -> ex: base_url/datahelper/autoFakturJual  
auto faktur beli = faktur beli otomatis  -> ex: base_url/datahelper/autoFakturBeli  
auto faktur beli kembali = faktur beli kembali otomatis  -> ex: base_url/datahelper/autoFakturBeliKembali  
auto faktur servis = faktur servis otomatis  -> ex: base_url/datahelper/autoFakturServis  
auto faktur hutang = faktur hutang otomatis  -> ex: base_url/datahelper/autoFakturHutang  
auto faktur piutang = faktur piutang otomatis  -> ex: base_url/datahelper/autoFakturPiutang  

# Transaksi Pembelian  
Untuk menambahkan transaksi ke table pembelian dan pembelian detail  
    + storeDetail = menambah barang ke keranjang -> ex: base_url/pembelian/storeDetail data needed {id_barang, kode_barang...etc(seperti data barang), user_id}  
    + destroyDetail = menghapus barang dari keranjang -> ex: base_url/pembelian/destroyDetail data needed {id_barang, kode_barang, user_id}  
    + store = membayar pembelian -> ex: base_url/pembelian/store data needed {faktur, supplier_id, date(Y-m-d), grand_total, user_id, status_bayar, keterangan}  
    <br><br>
Untuk mengambil data dari table pembelian dan pembelian detail  
    + getPenjualan = mengambil data pembelian head -> ex: base_url/pembelian/getPenjualan method GET   
    + getPenjualanDetail = mengambil data pembelian detail -> ex: base_url/pembelian/getPenjualanDetail?user_id=$user_id method GET   

# Transaksi Penjualan  
Untuk menambahkan transaksi ke table penjualan dan penjualan detail  
    + storeDetail = menambah barang ke keranjang -> ex: base_url/penjualan/storeDetail data needed {id_barang, kode_barang, user_id}  
    + destroyDetail = menghapus barang dari keranjang -> ex: base_url/penjualan/destroyDetail data needed {id_barang, kode_barang, user_id}  
    + store = membayar penjualan -> ex: base_url/penjualan/store data needed {faktur, pelanggan_id, date(Y-m-d), pemasukan, grand_total, bayar, kembali, user_id, status_bayar, keterangan}  
    <br><br>
Untuk mengambil data dari table penjualan dan penjualan detail  
    + getPenjualan = mengambil data penjualan head -> ex: base_url/penjualan/getPenjualan method GET   
    + getPenjualanDetail = mengambil data penjualan detail -> ex: base_url/penjualan/getPenjualanDetail?user_id=$user_id method GET   

# Transaksi Beli Kembali  
Untuk menambahkan transaksi ke table beli kembali dan beli kembali detail  
    + storeDetail = menambah barang ke keranjang -> ex: base_url/belikembali/storeDetail data needed {id_barang, kode_barang, user_id, harga_beli, berat, biaya_servis(optional)}  
    + destroyDetail = menghapus barang dari keranjang -> ex: base_url/belikembali/destroyDetail data needed {id_barang, kode_barang, user_id}  
    + store = membayar beli kembali -> ex: base_url/belikembali/store data needed {faktur, nota penjualan, date(Y-m-d), pengeluaran, user_id}  
    <br><br>
Untuk mengambil data dari table beli kembali dan beli kembali detail  
    + getBeliKembali = mengambil data beli kembali head -> ex: base_url/belikembali/getBeliKembali method GET   
    + getBeliKembaliDetail = mengambil data belikembali detail -> ex: base_url/belikembali/getBeliKembaliDetail?user_id=$user_id method GET   

# Dashboard  
Untuk menampilkan data-data dari database ini penjelasannya  
    + countBarang = mendapatkan jumlah barang -> ex: base_url/dashboard/countBarang  
    + countPelanggan = mendapatkan jumlah pelanggan -> ex: base_url/dashboard/countPelanggan  
    + countSupplier = mendapatkan jumlah supplier -> ex: base_url/dashboard/countSupplier  
    + countUser = mendapatkan jumlah user -> ex: base_url/dashboard/countUser  
    + getMonthly = mendapatkan omset penjualan bulan sekarang -> ex: base_url/dashboard/getMonthly  
    + grafikPenjualanDaily = mendapatkan omset penjualan harian -> ex: base_url/dashboard/grafikPenjualanDaily  
    <br><br>

# Kebutuhan Lain  
    + change Status Barang = untuk mengubah status barang -> ex: base_url/barang/changeStatusBarang data needed{status_barang, kode_barang}  
    <br><br>
    