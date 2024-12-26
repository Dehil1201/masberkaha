<?php defined('BASEPATH') or exit('No direct script access allowed');

class Penjualan_model extends CI_Model
{
    var $tableHead = 'penjualan';
    var $tableDet = 'penjualan_detail';
    var $tableQuantityDet = 'quantity_detail';
    var $tableFaktur = 'faktur';
    var $tableBarang = 'data_barang';
    var $tablePiutang = 'piutang';
    var $tablePelanggan = 'pelanggan';
    var $tableBarangHistory = 'barang_history';
    var $column_order = array('id', 'date', 'faktur', 'created_at', 'user_id', 'pelanggan_id', 'berat', 'subtotal', 'ongkos', 'grand_total');
    var $column_search = array('id', 'faktur');
    var $order = array('id' => 'desc');

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function rules()
    {
        return [
            [
                'field' => 'faktur',
                'label' => 'Faktur',
                'rules' => 'required'
            ]
        ];
    }

    // Get Table Penjualan Head
    private function _get_datatables_query()
    {
        $this->db->from($this->tableHead);
        $i = 0;
        foreach ($this->column_search as $item) // looping awal
        {
            if ($_POST['search']['value']) // jika datatable mengirimkan pencarian dengan metode POST
            {
                if ($i === 0) // looping awal
                {
                    $this->db->group_start();
                    $this->db->like($item, $_POST['search']['value']);
                } else {
                    $this->db->or_like($item, $_POST['search']['value']);
                }
                if (count($this->column_search) - 1 == $i)
                    $this->db->group_end();
            }
            $i++;
        }

        if (isset($_POST['order'])) {
            $this->db->order_by($this->column_order[$_POST['order']['0']['column']], $_POST['order']['0']['dir']);
        } else if (isset($this->order)) {
            $order = $this->order;
            $this->db->order_by(key($order), $order[key($order)]);
        }
    }

    function get_datatables()
    {
        $this->_get_datatables_query();
        if ($_POST['length'] != -1)
            $this->db->limit($_POST['length'], $_POST['start']);
        $query = $this->db->get();
        return $query->result();
    }

    function count_filtered()
    {
        $this->_get_datatables_query();
        $query = $this->db->get();
        return $query->num_rows();
    }

    private function _get_datatables_query_filter($col, $val, $startDate, $endDate, $user, $pelanggan)
    {
        $this->db->from($this->tableHead);
        $this->db->where($col, $val);
        if ($user != "") {
            $this->db->where('user_id', $user);
        }
        if ($pelanggan != "") {
            $this->db->where('pelanggan_id', $pelanggan);
        }
        $this->db->where('date>=', $startDate)->where('date<=', $endDate);
        $i = 0;
        foreach ($this->column_search as $item) // looping awal
        {
            if ($_POST['search']['value']) // jika datatable mengirimkan pencarian dengan metode POST
            {
                if ($i === 0) // looping awal
                {
                    $this->db->group_start();
                    $this->db->like($item, $_POST['search']['value']);
                } else {
                    $this->db->or_like($item, $_POST['search']['value']);
                }
                if (count($this->column_search) - 1 == $i)
                    $this->db->group_end();
            }
            $i++;
        }

        if (isset($_POST['order'])) {
            $this->db->order_by($this->column_order[$_POST['order']['0']['column']], $_POST['order']['0']['dir']);
        } else if (isset($this->order)) {
            $order = $this->order;
            $this->db->order_by(key($order), $order[key($order)]);
        }
    }

    function get_datatables_filter($col, $val, $startDate, $endDate, $user, $pelanggan)
    {
        $this->_get_datatables_query_filter($col, $val, $startDate, $endDate, $user, $pelanggan);
        if ($_POST['length'] != -1)
            $this->db->limit($_POST['length'], $_POST['start']);
        $query = $this->db->get();
        return $query->result();
    }

    function count_filtered_filter($col, $val, $startDate, $endDate, $user, $pelanggan)
    {
        $this->_get_datatables_query_filter($col, $val, $startDate, $endDate, $user, $pelanggan);
        $query = $this->db->get();
        return $query->num_rows();
    }

    public function count_all()
    {
        $this->db->from($this->tableHead);
        return $this->db->count_all_results();
    }

    // Get Table Penjualan Detail
    private function _get_datatables_query_detail($session)
    {
        $this->db->from($this->tableDet)->where('status_proses', 0)->where('session', $session);;
        $i = 0;
        foreach ($this->column_search as $item) // looping awal
        {
            if ($_POST['search']['value']) // jika datatable mengirimkan pencarian dengan metode POST
            {
                if ($i === 0) // looping awal
                {
                    $this->db->group_start();
                    $this->db->like($item, $_POST['search']['value']);
                } else {
                    $this->db->or_like($item, $_POST['search']['value']);
                }
                if (count($this->column_search) - 1 == $i)
                    $this->db->group_end();
            }
            $i++;
        }

        if (isset($_POST['order'])) {
            $this->db->order_by($this->column_order[$_POST['order']['0']['column']], $_POST['order']['0']['dir']);
        } else if (isset($this->order)) {
            $order = $this->order;
            $this->db->order_by(key($order), $order[key($order)]);
        }
    }

    function get_datatables_detail($session)
    {
        $this->_get_datatables_query_detail($session);
        if ($_POST['length'] != -1)
            $this->db->limit($_POST['length'], $_POST['start']);
        $query = $this->db->get();
        return $query->result();
    }

    function count_filtered_detail($session)
    {
        $this->_get_datatables_query_detail($session);
        $query = $this->db->get();
        return $query->num_rows();
    }

    public function count_all_detail()
    {
        $this->db->from($this->tableDet);
        return $this->db->count_all_results();
    }

    // Get Table Quantity Detail
    private function _get_datatables_query_quantity_detail($session)
    {
        $this->db->from($this->tableQuantityDet)->where('status_proses', 0)->where('session', $session);;
        $i = 0;
        foreach ($this->column_search as $item) // looping awal
        {
            if ($_POST['search']['value']) // jika datatable mengirimkan pencarian dengan metode POST
            {
                if ($i === 0) // looping awal
                {
                    $this->db->group_start();
                    $this->db->like($item, $_POST['search']['value']);
                } else {
                    $this->db->or_like($item, $_POST['search']['value']);
                }
                if (count($this->column_search) - 1 == $i)
                    $this->db->group_end();
            }
            $i++;
        }

        if (isset($_POST['order'])) {
            $this->db->order_by($this->column_order[$_POST['order']['0']['column']], $_POST['order']['0']['dir']);
        } else if (isset($this->order)) {
            $order = $this->order;
            $this->db->order_by(key($order), $order[key($order)]);
        }
    }

    function get_datatables_quantity_detail($session)
    {
        $this->_get_datatables_query_quantity_detail($session);
        if ($_POST['length'] != -1)
            $this->db->limit($_POST['length'], $_POST['start']);
        $query = $this->db->get();
        return $query->result();
    }

    function count_filtered_quantity_detail($session)
    {
        $this->_get_datatables_query_quantity_detail($session);
        $query = $this->db->get();
        return $query->num_rows();
    }

    public function count_all_quantity_detail()
    {
        $this->db->from($this->tableQuantityDet);
        return $this->db->count_all_results();
    }

    public function getDetail($nota)
    {
        $this->db->from($this->tableDet)->where('faktur', $nota)->where('status_proses', 1);
        $query = $this->db->get();
        return $query->result();
    }

    public function getDetailPrajual($session)
    {
        $this->db->from($this->tableDet)->where('status_proses', 0)->where('session', $session);
        $query = $this->db->get();
        return $query->result();
    }

    public function getDetailQuantity($nota)
    {
        $this->db->from($this->tableQuantityDet)->where('faktur', $nota)->where('status_proses', 1);
        $query = $this->db->get();
        return $query->result();
    }

    public function getDetailByKode($kodeBarang)
    {
        $this->db->from($this->tableDet)->where('kode_barang', $kodeBarang)->where('status_proses', 1)->where('status_jual', 0);
        $query = $this->db->get();
        return $query->result();
    }

    public function getHead($nota)
    {
        $this->db->from($this->tableHead)->where('faktur', $nota);
        $query = $this->db->get();
        return $query->result();
    }

    // Transaksi Penjualan Gram
    public function addTransactionsTunai($userID)
    {
        $faktur = $this->input->post('faktur', TRUE, NULL);
        $grandTotal = sumData('penjualan_detail', 'total', $userID);
        $idPelanggan = $this->input->post('pelanggan_id', TRUE, NULL);
        $pointPelanggan = $this->input->post('point', TRUE, 0);
        $statusFaktur = $this->input->post('status_faktur', TRUE, 0);
        $session = $userID;
        $dataPenjualan = array(
            'faktur' => $faktur,
            'pelanggan_id' => $idPelanggan,
            'date' => $this->input->post('date', TRUE, date('Y-m-d')),
            'pemasukan' => $this->input->post('pemasukan', TRUE, $grandTotal),
            'grand_total' => $this->input->post('grand_total', TRUE, $grandTotal),
            'bayar' => $this->input->post('bayar', TRUE, 0),
            'kembali' => $this->input->post('kembali', TRUE, 0),
            'user_id' => $session,
            'status_bayar' => $this->input->post('status_bayar', TRUE, 1),
            'keterangan' => 'Penjualan : ' . $faktur,
            'status_faktur' => $statusFaktur,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
            'total_berat' => round($this->sumBeratPenjualan($session), 2),
            'pokok_modal' => $this->sumPokokModal($session)
        );
        $dataFaktur = array(
            'faktur' => $faktur,
            'date' => $this->input->post('date', TRUE, date('Y-m-d')),
            'pemasukan' => $this->input->post('pemasukan', TRUE, $grandTotal),
            'pengeluaran' => 0,
            'grand_total' => $this->input->post('grand_total', TRUE, $grandTotal),
            'mode' => 'Penjualan',
            'referensi' => 'PJ',
            'source' => '1101',
            'keterangan' => 'Penjualan : ' . $faktur,
            'created_at' => date('Y-m-d H:i:s')
        );
        $statusJualDet = array(
            'faktur' => $faktur,
            'status_proses' => 1,
            'date' => date('Y-m-d'),
            'updated_at' => date('Y-m-d H:i:s')
        );
        $statusBarang = array(
            'faktur' => $this->input->post('faktur', TRUE, NULL),
            'status_proses' => 1,
            'pelanggan_supplier_id' => $idPelanggan,
            'date' => date('Y-m-d'),
            'created_at' => date('Y-m-d H:i:s')
        );

        $this->db->trans_start(); # Starting Transaction

        // Insert Data Penjualan
        $this->db->insert($this->tableHead, $dataPenjualan);
        // Insert Data Faktur
        $this->db->insert($this->tableFaktur, $dataFaktur);
        // Update Harga Jual Data Barang
        $countDetail = countWhereDouble('penjualan_detail', 'status_proses', 0, 'session', $session);
        $list = $this->getDetailPrajual($session);
        $data = array();
        foreach ($list as $field) {
            $data[] = array(
                "kode_barang" => $field->kode_barang,
                "harga" => $field->harga,
            );
        }
        for ($i = 0; $i < $countDetail; $i++) {
            $this->updateHargaBarang($data[$i]['harga'], $data[$i]['kode_barang']);
        }
        // Change status penjualan detail
        $this->db->where('status_proses', 0)->where('session', $userID);
        $this->db->update($this->tableDet, $statusJualDet);
        // Change status history barang
        $this->db->where('status_proses', 0)->where('session', $userID);
        $this->db->update($this->tableBarangHistory, $statusBarang);
        // Add Point Pelanggan
        if ($idPelanggan) {
            $this->db->where('id', $idPelanggan);
            $this->db->set('point', "point + $pointPelanggan", FALSE);
            $this->db->update($this->tablePelanggan);
        }
        $this->db->trans_complete(); # Completing transaction

        /*Optional*/

        if ($this->db->trans_status() === FALSE) {
            # Something went wrong.
            $this->db->trans_rollback();
            return FALSE;
        } else {
            # Everything is Perfect. 
            # Committing data to the database.
            $this->db->trans_commit();
            return TRUE;
        }
    }

    public function addTransactionsCredit($userID)
    {
        $faktur = $this->input->post('faktur', TRUE, NULL);
        $grandTotal = sumData('penjualan_detail', 'total', $userID);
        $bayar = $this->input->post('bayar', TRUE, 0);
        $idPelanggan = $this->input->post('pelanggan_id', TRUE, NULL);
        $pointPelanggan = $this->input->post('point', TRUE, 0);
        $statusFaktur = $this->input->post('status_faktur', TRUE, 0);
        $session = $userID;
        $dataPenjualan = array(
            'faktur' => $faktur,
            'pelanggan_id' => $idPelanggan,
            'date' => $this->input->post('date', TRUE, date('Y-m-d')),
            'pemasukan' => $bayar,
            'grand_total' => $this->input->post('grand_total', TRUE, $grandTotal),
            'bayar' => $bayar,
            'kembali' => 0,
            'user_id' => $session,
            'status_bayar' => $this->input->post('status_bayar', TRUE, 2),
            'keterangan' => 'Penjualan : ' . $faktur,
            'status_faktur' => $statusFaktur,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
            'total_berat' => round($this->sumBeratPenjualan($session), 2),
            'pokok_modal' => $this->sumPokokModal($session)
        );
        $dataFaktur = array(
            'faktur' => $faktur,
            'date' => $this->input->post('date', TRUE, date('Y-m-d')),
            'pemasukan' => $bayar,
            'pengeluaran' => 0,
            'grand_total' => $this->input->post('grand_total', TRUE, $grandTotal),
            'mode' => 'Penjualan',
            'referensi' => 'PJ',
            'source' => '1101',
            'keterangan' => 'Penjualan : ' . $faktur,
            'created_at' => date('Y-m-d H:i:s')
        );
        $statusJualDet = array(
            'faktur' => $this->input->post('faktur', TRUE, NULL),
            'status_proses' => 1,
            'date' => date('Y-m-d'),
            'updated_at' => date('Y-m-d H:i:s')
        );
        $statusBarangHistory = array(
            'faktur' => $this->input->post('faktur', TRUE, NULL),
            'status_proses' => 1,
            'pelanggan_supplier_id' => $idPelanggan,
            'date' => date('Y-m-d'),
            'created_at' => date('Y-m-d H:i:s')
        );
        $dataPiutang = array(
            'faktur_jual' => $faktur,
            'pelanggan_id' => $this->input->post('pelanggan_id', TRUE, NULL),
            'piutang' => $grandTotal,
            'piutang_dibayar' => $bayar,
            'piutang_sisa' => $grandTotal - $bayar,
            'tempo' => $this->input->post('tempo', TRUE, date('Y-m-d')),
            'user_id' => $userID,
            'keterangan' => 'Piutang Penjualan : ' . $faktur,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d')
        );

        $this->db->trans_start(); # Starting Transaction

        // Insert Data Penjualan
        $this->db->insert($this->tableHead, $dataPenjualan);
        // Insert Data Faktur
        $this->db->insert($this->tableFaktur, $dataFaktur);
        // Change status penjualan detail
        $this->db->where('status_proses', 0)->where('session', $userID);
        $this->db->update($this->tableDet, $statusJualDet);
        // Change status history barang
        $this->db->where('status_proses', 0)->where('session', $userID);
        $this->db->update($this->tableBarangHistory, $statusBarangHistory);
        // Insert Data Piutang
        $this->db->insert($this->tablePiutang, $dataPiutang);
        // Add Point Pelanggan
        if ($idPelanggan) {
            $this->db->where('id', $idPelanggan);
            $this->db->set('point', "point + $pointPelanggan", FALSE);
            $this->db->update($this->tablePelanggan);
        }
        // Update Harga Jual Data Barang
        $countDetail = countWhereDouble('penjualan_detail', 'status_proses', 0, 'session', $session);
        $list = $this->getDetailPrajual($session);
        $data = array();
        foreach ($list as $field) {
            $data[] = array(
                "kode_barang" => $field->kode_barang,
                "harga" => $field->harga,
            );
        }
        for ($i = 0; $i < $countDetail; $i++) {
            $this->updateHargaBarang($data[$i]['harga'], $data[$i]['kode_barang']);
        }

        $this->db->trans_complete(); # Completing transaction

        /*Optional*/

        if ($this->db->trans_status() === FALSE) {
            # Something went wrong.
            $this->db->trans_rollback();
            return FALSE;
        } else {
            # Everything is Perfect. 
            # Committing data to the database.
            $this->db->trans_commit();
            return TRUE;
        }
    }

    public function addTransactionsDetail($userID)
    {
        $idBarang = $this->input->post('id_barang', TRUE, NULL);
        $kodeBarang = $this->input->post('kode_barang', TRUE, NULL);
        $berat = getBarangID($kodeBarang, 'berat');
        $harga = $this->input->post('harga', TRUE, NULL);
        $ongkos = $this->input->post('ongkos', TRUE, 0);
        $markup = $this->input->post('markup_harga', TRUE, 0);
        $statusBarang = getDataField($this->tableBarang, 'kode_barang', $kodeBarang, 'status');
        $subHarga = ($harga + $markup);
        $dataJualDet = array(
            'faktur' => '-',
            'id_barang' => $idBarang,
            'kode_barang' => $kodeBarang,
            'harga' => $subHarga,
            'qty' => 1,
            'ongkos' => $ongkos,
            'markup_harga' => $markup,
            'subtotal' => $subHarga * $berat,
            'total' => ($subHarga * $berat) + $ongkos,
            'status_proses' => '0',
            'session' => $userID,
            'date' => $this->input->post('date', TRUE, date('Y-m-d')),
            'status_jual' => 0,
            'updated_at' => date('Y-m-d H:i:s'),
            'status_asal' => $statusBarang
        );
        $dataHistoryBarang = array(
            'id_barang' => $this->input->post('id_barang', TRUE, NULL),
            'kode_barang' => $this->input->post('kode_barang', TRUE, NULL),
            'kode_jenis' => getDataField('jenis_barang', 'jenis_barang', getBarangID($kodeBarang, 'jenis_barang'), 'kode_jenis'),
            'faktur' => '-',
            'date' => date('Y-m-d'),
            'action' => 'Penjualan',
            'status_proses' => '0',
            'session' => $userID,
            'created_at' => date('Y-m-d H:i:s')
        );

        $this->db->trans_start(); # Starting Transaction

        // Insert Data Jual Detail
        $this->db->insert($this->tableDet, $dataJualDet);
        // Change Status Data Barang
        $this->changeStatusBarang('J', $kodeBarang, true);
        // Insert Data History Barang
        $this->db->insert($this->tableBarangHistory, $dataHistoryBarang);
        // Change Harga Data Barang
        if ($markup != 0) {
            $this->db->where('kode_barang', $kodeBarang);
            $this->db->set('harga_jual', "harga_jual + $markup", FALSE);
            $this->db->update($this->tableBarang);
        }
        $this->db->trans_complete(); # Completing transaction 

        /*Optional*/

        if ($this->db->trans_status() === FALSE) {
            # Something went wrong.
            $this->db->trans_rollback();
            return FALSE;
        } else {
            # Everything is Perfect. 
            # Committing data to the database.
            $this->db->trans_commit();
            return TRUE;
        }
    }

    public function delTransactionsDetail($userID)
    {
        $kodeBarang = $this->input->post('kode_barang', TRUE, NULL);
        $hargaAsal = $this->input->post('harga_asal', TRUE, NULL);
        $statusAsal = $this->db->select()->where('kode_barang', $kodeBarang)->where('status_proses', 0)->where('session', $userID)->get($this->tableDet)->row()->status_asal;
        $statusAsal = ($statusAsal == null) ? 0 : (($statusAsal == '') ? 0 : $statusAsal);

        $this->db->trans_start(); # Starting Transaction

        // Delete Data Jual Detail
        $this->delJualDetail($kodeBarang, $userID);
        // Change Status Data Barang
        $this->changeStatusBarang($statusAsal, $kodeBarang, false);
        // Delete Data History Barang
        $this->db->delete($this->tableBarangHistory, array('kode_barang' => $kodeBarang, 'action' => 'Penjualan', 'status_proses' => 0, 'session' => $userID));
        $this->db->trans_complete(); # Completing transaction

        /*Optional*/

        if ($this->db->trans_status() === FALSE) {
            # Something went wrong.
            $this->db->trans_rollback();
            return FALSE;
        } else {
            # Everything is Perfect. 
            # Committing data to the database.
            $this->db->trans_commit();
            return TRUE;
        }
    }

    public function saveFoto()
    {
        $kodeBarang = $this->input->post('kode_barang', TRUE, NULL);
        $foto = $this->input->post('foto', FALSE, NULL);
        // Change Foto Data Barang
        if ($foto != NULL) {
            $this->db->trans_start(); # Starting Transaction
            $fotoValue = $this->uploadFoto($foto, $kodeBarang);
            $dataBarang = array(
                'foto' => $fotoValue,
                'updated_at' => date('Y-m-d H:i:s')
            );
            $this->db->where('kode_barang', $kodeBarang);
            $this->db->update($this->tableBarang, $dataBarang);
            $this->db->trans_complete(); # Completing transaction

            /*Optional*/

            if ($this->db->trans_status() === FALSE) {
                # Something went wrong.
                if ($fotoValue != null) {
                    $this->_deleteImage($fotoValue);
                }
                $this->db->trans_rollback();
                return array(
                    'status' => FALSE,
                    'message' => 'Gagal menyimpan foto!'
                );
            } else {
                # Everything is Perfect. 
                # Committing data to the database.
                $this->db->trans_commit();
                return array(
                    'status' => TRUE,
                    'foto' => $fotoValue,
                    'kode' => $kodeBarang,
                    'message' => 'Foto berhasil disimpan!'
                );
            }
        } else {
            return array(
                'status' => FALSE,
                'message' => 'Foto belum di capture!'
            );
        }
    }

    private function _deleteImage($foto)
    {
        if ($foto != NULL) {
            return array_map('unlink', glob(FCPATH . "uploads/foto/$foto"));
        }
    }

    public function delJualDetail($kode, $userID)
    {
        return $this->db->delete($this->tableDet, array('kode_barang' => $kode, 'status_proses' => 0, 'session' => $userID));
    }

    public function changeStatusBarang($status, $kodeBarang, $jual)
    {
        if ($jual) {
            $data = array(
                'status' => $status,
                'updated_at' => date('Y-m-d H:i:s'),
                'tanggal_jual' => date('Y-m-d H:i:s')
            );
        } else {
            $data = array(
                'status' => $status,
                'updated_at' => date('Y-m-d H:i:s'),
                'tanggal_jual' => null
            );
        }
        $this->db->where('kode_barang', $this->input->post('kode_barang', TRUE, $kodeBarang));
        return $this->db->update($this->tableBarang, $data);
    }

    public function updateHargaBarang($harga, $kodeBarang)
    {
        $data = array(
            'harga_jual' => $harga,
            'updated_at' => date('Y-m-d H:i:s')
        );
        $this->db->where('kode_barang', $kodeBarang);
        return $this->db->update($this->tableBarang, $data);
    }

    public function get_detail($nota)
    {
        $this->db->select('*');
        $this->db->from("penjualan_detail");
        $this->db->join('data_barang', 'data_barang.kode_barang = penjualan_detail.kode_barang');
        $this->db->where("penjualan_detail.faktur  = '$nota' ");
        $query = $this->db->get();
        return $query->result();
    }

    public function uploadFoto($image, $kodeBarang)
    {
        if ($image !== NULL) {
            $image = str_replace('data:image/jpeg;base64,', '', $image);
            $image = base64_decode($image);
            $filename = 'foto_' . time() . '-' . $kodeBarang . '.jpg';
            file_put_contents(FCPATH . '/uploads/foto/' . $filename, $image);
            return $filename;
        } else {
            return NULL;
        }
    }

    // Transaksi Penjualan Quantity
    public function addTransactionsQuantityTunai($userID)
    {
        $faktur = $this->input->post('faktur', TRUE, NULL);
        $grandTotal = sumData('quantity_detail', 'total', $userID);
        $idPelanggan = $this->input->post('pelanggan_id', TRUE, NULL);
        $dataPenjualan = array(
            'faktur' => $faktur,
            'pelanggan_id' => $idPelanggan,
            'date' => $this->input->post('date', TRUE, date('Y-m-d')),
            'pemasukan' => $this->input->post('pemasukan', TRUE, $grandTotal),
            'grand_total' => $this->input->post('grand_total', TRUE, $grandTotal),
            'bayar' => $this->input->post('bayar', TRUE, 0),
            'kembali' => $this->input->post('kembali', TRUE, 0),
            'user_id' => $userID,
            'status_bayar' => $this->input->post('status_bayar', TRUE, 1),
            'keterangan' => 'Penjualan : ' . $faktur,
            'status_faktur' => 1,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        );
        $dataFaktur = array(
            'faktur' => $faktur,
            'date' => $this->input->post('date', TRUE, date('Y-m-d')),
            'pemasukan' => $this->input->post('pemasukan', TRUE, $grandTotal),
            'pengeluaran' => 0,
            'grand_total' => $this->input->post('grand_total', TRUE, $grandTotal),
            'mode' => 'Penjualan',
            'referensi' => 'PJ',
            'source' => '1101',
            'keterangan' => 'Penjualan : ' . $faktur,
            'created_at' => date('Y-m-d H:i:s')
        );
        $statusJualDet = array(
            'faktur' => $faktur,
            'status_proses' => 1,
            'date' => date('Y-m-d'),
            'updated_at' => date('Y-m-d H:i:s')
        );
        $statusBarang = array(
            'faktur' => $this->input->post('faktur', TRUE, NULL),
            'status_proses' => 1,
            'pelanggan_supplier_id' => $idPelanggan,
            'date' => date('Y-m-d'),
            'created_at' => date('Y-m-d H:i:s')
        );

        $this->db->trans_start(); # Starting Transaction

        // Insert Data Penjualan
        $this->db->insert($this->tableHead, $dataPenjualan);
        // Insert Data Faktur
        $this->db->insert($this->tableFaktur, $dataFaktur);
        // Change status quantity detail
        $this->db->where('status_proses', 0)->where('session', $userID);
        $this->db->update($this->tableQuantityDet, $statusJualDet);
        // Change status history barang
        $this->db->where('status_proses', 0)->where('session', $userID);
        $this->db->update($this->tableBarangHistory, $statusBarang);

        $this->db->trans_complete(); # Completing transaction

        /*Optional*/

        if ($this->db->trans_status() === FALSE) {
            # Something went wrong.
            $this->db->trans_rollback();
            return FALSE;
        } else {
            # Everything is Perfect. 
            # Committing data to the database.
            $this->db->trans_commit();
            return TRUE;
        }
    }

    public function addTransactionsQuantityCredit($userID)
    {
        $faktur = $this->input->post('faktur', TRUE, NULL);
        $grandTotal = sumData('quantity_detail', 'total', $userID);
        $bayar = $this->input->post('bayar', TRUE, 0);
        $idPelanggan = $this->input->post('pelanggan_id', TRUE, NULL);
        $dataPenjualan = array(
            'faktur' => $faktur,
            'pelanggan_id' => $idPelanggan,
            'date' => $this->input->post('date', TRUE, date('Y-m-d')),
            'pemasukan' => $bayar,
            'grand_total' => $this->input->post('grand_total', TRUE, $grandTotal),
            'bayar' => $bayar,
            'kembali' => 0,
            'user_id' => $userID,
            'status_bayar' => $this->input->post('status_bayar', TRUE, 2),
            'keterangan' => 'Penjualan : ' . $faktur,
            'status_faktur' => 1,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        );
        $dataFaktur = array(
            'faktur' => $faktur,
            'date' => $this->input->post('date', TRUE, date('Y-m-d')),
            'pemasukan' => $bayar,
            'pengeluaran' => 0,
            'grand_total' => $this->input->post('grand_total', TRUE, $grandTotal),
            'mode' => 'Penjualan',
            'referensi' => 'PJ',
            'source' => '1101',
            'keterangan' => 'Penjualan : ' . $faktur,
            'created_at' => date('Y-m-d H:i:s')
        );
        $statusJualDet = array(
            'faktur' => $this->input->post('faktur', TRUE, NULL),
            'status_proses' => 1,
            'date' => date('Y-m-d'),
            'updated_at' => date('Y-m-d H:i:s')
        );
        $statusBarangHistory = array(
            'faktur' => $this->input->post('faktur', TRUE, NULL),
            'status_proses' => 1,
            'pelanggan_supplier_id' => $idPelanggan,
            'date' => date('Y-m-d'),
            'created_at' => date('Y-m-d H:i:s')
        );
        $dataPiutang = array(
            'faktur_jual' => $faktur,
            'pelanggan_id' => $this->input->post('pelanggan_id', TRUE, NULL),
            'piutang' => $grandTotal,
            'piutang_dibayar' => $bayar,
            'piutang_sisa' => $grandTotal - $bayar,
            'tempo' => $this->input->post('tempo', TRUE, date('Y-m-d')),
            'user_id' => $userID,
            'keterangan' => 'Piutang Penjualan : ' . $faktur,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d')
        );

        $this->db->trans_start(); # Starting Transaction

        // Insert Data Penjualan
        $this->db->insert($this->tableHead, $dataPenjualan);
        // Insert Data Faktur
        $this->db->insert($this->tableFaktur, $dataFaktur);

        // Change status quantity detail
        $this->db->where('status_proses', 0)->where('session', $userID);
        $this->db->update($this->tableQuantityDet, $statusJualDet);
        // Change status history barang
        $this->db->where('status_proses', 0)->where('session', $userID);
        $this->db->update($this->tableBarangHistory, $statusBarangHistory);
        // Insert Data Piutang
        $this->db->insert($this->tablePiutang, $dataPiutang);

        $this->db->trans_complete(); # Completing transaction

        /*Optional*/

        if ($this->db->trans_status() === FALSE) {
            # Something went wrong.
            $this->db->trans_rollback();
            return FALSE;
        } else {
            # Everything is Perfect. 
            # Committing data to the database.
            $this->db->trans_commit();
            return TRUE;
        }
    }

    public function addTransactionsQuantityDetail($userID)
    {
        $idBarang = $this->input->post('id_barang', TRUE, NULL);
        $kodeBarang = $this->input->post('kode_barang', TRUE, NULL);
        $harga = $this->input->post('harga', TRUE, NULL);
        $markup = $this->input->post('markup_harga', TRUE, 0);
        $qty = $this->input->post('qty', TRUE, 0);
        $subtotal = $harga * $qty;
        $dataJualQuantityDet = array(
            'faktur' => '-',
            'id_barang' => $idBarang,
            'kode_barang' => $kodeBarang,
            'harga' => $harga,
            'qty' => $qty,
            'markup_harga' => $markup,
            'total' => $subtotal + $markup,
            'status_proses' => '0',
            'session' => $userID,
            'date' => $this->input->post('date', TRUE, date('Y-m-d')),
            'updated_at' => date('Y-m-d H:i:s')
        );
        $dataHistoryBarang = array(
            'id_barang' => $this->input->post('id_barang', TRUE, NULL),
            'kode_barang' => $this->input->post('kode_barang', TRUE, NULL),
            'kode_jenis' => getDataField('jenis_barang', 'jenis_barang', getBarangID($kodeBarang, 'jenis_barang'), 'kode_jenis'),
            'faktur' => '-',
            'date' => date('Y-m-d'),
            'action' => 'Penjualan',
            'status_proses' => '0',
            'session' => $userID,
            'created_at' => date('Y-m-d H:i:s')
        );

        $this->db->trans_start(); # Starting Transaction

        // Insert Data Quantity Detail
        $this->db->insert($this->tableQuantityDet, $dataJualQuantityDet);
        // Change Stok Data Barang
        $this->changeStokBarang($qty, '-', $kodeBarang);
        // Insert Data History Barang
        $this->db->insert($this->tableBarangHistory, $dataHistoryBarang);
        // Change Harga Data Barang
        if ($markup != 0) {
            $this->db->where('kode_barang', $kodeBarang);
            $this->db->set('harga_jual', "harga_jual + $markup", FALSE);
            $this->db->update($this->tableBarang);
        }

        $this->db->trans_complete(); # Completing transaction

        /*Optional*/

        if ($this->db->trans_status() === FALSE) {
            # Something went wrong.
            $this->db->trans_rollback();
            return FALSE;
        } else {
            # Everything is Perfect. 
            # Committing data to the database.
            $this->db->trans_commit();
            return TRUE;
        }
    }

    public function delTransactionsQuantityDetail($userID)
    {
        $kodeBarang = $this->input->post('kode_barang', TRUE, NULL);
        $hargaAsal = $this->input->post('harga_asal', TRUE, NULL);
        $qty = $this->input->post('qty', TRUE, 0);
        $dataBarang = array(
            'harga_jual' => $hargaAsal,
        );

        $this->db->trans_start(); # Starting Transaction

        // Delete Data Quantity Detail
        $this->delQuantityDetail($kodeBarang, $userID);
        // Change Stok Data Barang
        $this->changeStokBarang($qty, '+', $kodeBarang);
        // Delete Data History Barang
        $this->db->delete($this->tableBarangHistory, array('kode_barang' => $kodeBarang, 'action' => 'Penjualan', 'status_proses' => 0, 'session' => $userID));
        // Change Harga Barang
        $this->db->where('kode_barang', $kodeBarang);
        $this->db->update($this->tableBarang, $dataBarang);
        $this->db->trans_complete(); # Completing transaction

        /*Optional*/

        if ($this->db->trans_status() === FALSE) {
            # Something went wrong.
            $this->db->trans_rollback();
            return FALSE;
        } else {
            # Everything is Perfect. 
            # Committing data to the database.
            $this->db->trans_commit();
            return TRUE;
        }
    }

    public function delQuantityDetail($kode, $userID)
    {
        return $this->db->delete($this->tableQuantityDet, array('kode_barang' => $kode, 'status_proses' => 0, 'session' => $userID));
    }

    public function changeStokBarang($qty, $con, $kodeBarang)
    {
        $this->db->set("stok", "stok $con $qty", false);
        $this->db->where('kode_barang', $kodeBarang);
        $this->db->update($this->tableBarang);
    }

    public function delTransactions($faktur)
    {
        $this->db->trans_start(); # Starting Transaction

        $idPelanggan = getDataField($this->tableHead, 'faktur', $faktur, 'pelanggan_id');
        $pointMember = getPengaturan('point_gram');
        $point = 0;
        $beratTotal = 0;
        // Delete Data Faktur
        $this->db->delete($this->tableFaktur, array('faktur' => $faktur));
        // Delete Data Piutang
        $countPiutang = countWhere('piutang', 'faktur_jual', $faktur);
        if ($countPiutang > 0) {
            $this->db->delete($this->tablePiutang, array('faktur_jual' => $faktur));
        }
        // Delete Data Penjualan
        $this->db->delete($this->tableHead, array('faktur' => $faktur));
        // Delete Data History Barang
        $this->db->delete($this->tableBarangHistory, array('faktur' => $faktur));
        // Check Data Detail Penjualan
        $countDetail = countWhere('penjualan_detail', 'faktur', $faktur);
        $list = $this->getDetail($faktur);
        $data = array();
        foreach ($list as $field) {
            $data[] = array(
                "id_barang" => $field->id_barang,
                "kode_barang" => $field->kode_barang,
                "markup_harga" => $field->markup_harga,
                "qty" => $field->qty,
                "status_asal" => $field->status_asal,
            );
        }
        for ($i = 0; $i < $countDetail; $i++) {
            // get berat
            $beratTotal += getDataField($this->tableBarang, 'kode_barang', $data[$i]['kode_barang'], 'berat');
            // Change Status Data Barang
            $this->changeStatusBarang(($data[$i]['status_asal'] == null) ? 0 : $data[$i]['status_asal'], $data[$i]['kode_barang'], false);
            // Change Harga Barang
            $markupHarga = $data[$i]['markup_harga'];
            if ($markupHarga != 0) {
                $this->db->where('kode_barang', $data[$i]['kode_barang']);
                $this->db->set('harga_jual', "harga_jual - $markupHarga", FALSE);
                $this->db->update($this->tableBarang);
            }
        }
        // Dec Point Pelanggan
        if ($idPelanggan) {
            for ($i = 0; $i < round($beratTotal);) {
                (++$i % $pointMember ? $i : $point++);
            }
            $this->db->where('id', $idPelanggan);
            $this->db->set('point', "point - $point", FALSE);
            $this->db->update($this->tablePelanggan);
        }
        // Delete Data Jual Detail
        $this->db->delete($this->tableDet, array('faktur' => $faktur));

        $this->db->trans_complete(); # Completing transaction

        /*Optional*/

        if ($this->db->trans_status() === FALSE) {
            # Something went wrong.
            $this->db->trans_rollback();
            return FALSE;
        } else {
            # Everything is Perfect. 
            # Committing data to the database.
            $this->db->trans_commit();
            return TRUE;
        }
    }

    public function delDetailTransactions($kode_barang, $faktur)
    {
        $this->db->trans_start(); # Starting Transaction

        $hargaPasar = getPengaturan('harga_pasar');
        // Delete Data Jual Detail
        $this->db->delete($this->tableDet, array('kode_barang' => $kode_barang, 'faktur' => $faktur));
        // Delete Data History Barang
        $this->db->delete($this->tableBarangHistory, array('kode_barang' => $kode_barang, 'faktur' => $faktur));
        // Change Data Barang
        $updateDataBarang = array(
            'status' => 0,
            'harga_jual' => $hargaPasar,
            'tanggal_jual' => null,
            'updated_at' => date('Y-m-d H:i:s')
        );
        $this->db->where('kode_barang', $kode_barang);
        $this->db->update($this->tableBarang, $updateDataBarang);
        // Jumlahkan total penjualan detail
        $totalDetail = $this->sumWherePenjualan($this->tableDet, 'total', 'faktur', $faktur);
        // Update Data Penjualan
        $updateDataPenjualan = array(
            'pemasukan' => $totalDetail,
            'grand_total' => $totalDetail,
            'bayar' => $totalDetail,
            'updated_at' => date('Y-m-d H:i:s')
        );
        $this->db->where('faktur', $faktur);
        $this->db->update($this->tableHead, $updateDataPenjualan);
        // Update Data Faktur
        $updateDataFaktur = array(
            'pemasukan' => $totalDetail,
            'grand_total' => $totalDetail
        );
        $this->db->where('faktur', $faktur);
        $this->db->update($this->tableFaktur, $updateDataFaktur);
        // Update Data Piutang
        $countPiutang = countWhere('piutang', 'faktur_jual', $faktur);
        if ($countPiutang > 0) {
            $updateDataPiutang = array(
                'piutang' => $totalDetail,
                'piutang_sisa' => $totalDetail,
                'updated_at' => date('Y-m-d')
            );
            $this->db->where('faktur_jual', $faktur);
            $this->db->update($this->tablePiutang, $updateDataPiutang);
        }

        $this->db->trans_complete(); # Completing transaction

        /*Optional*/

        if ($this->db->trans_status() === FALSE) {
            # Something went wrong.
            $this->db->trans_rollback();
            return FALSE;
        } else {
            # Everything is Perfect. 
            # Committing data to the database.
            $this->db->trans_commit();
            return TRUE;
        }
    }

    public function delTransactionsQuantity($faktur)
    {
        $this->db->trans_start(); # Starting Transaction

        // Delete Data Faktur
        $this->db->delete($this->tableFaktur, array('faktur' => $faktur));
        // Delete Data Piutang
        $countPiutang = countWhere('piutang', 'faktur_jual', $faktur);
        if ($countPiutang > 0) {
            $this->db->delete($this->tablePiutang, array('faktur_jual' => $faktur));
        }
        // Delete Data Penjualan
        $this->db->delete($this->tableHead, array('faktur' => $faktur));
        // Delete Data History Barang
        $this->db->delete($this->tableBarangHistory, array('faktur' => $faktur));
        // Check Data Detail Quantity
        $countDetail = countWhere('quantity_detail', 'faktur', $faktur);
        $list = $this->getDetailQuantity($faktur);
        $data = array();
        foreach ($list as $field) {
            $data[] = array(
                "id_barang" => $field->id_barang,
                "kode_barang" => $field->kode_barang,
                "markup_harga" => $field->markup_harga,
                "qty" => $field->qty
            );
        }
        for ($i = 0; $i < $countDetail; $i++) {
            // Change Stok Data Barang
            $this->changeStokBarang($data[$i]['qty'], '+', $data[$i]['kode_barang']);
            // Change Harga Barang
            $markupHarga = $data[$i]['markup_harga'];
            if ($markupHarga != 0) {
                $this->db->where('kode_barang', $data[$i]['kode_barang']);
                $this->db->set('harga_jual', "harga_jual - $markupHarga", FALSE);
                $this->db->update($this->tableBarang);
            }
        }
        // Delete Data Jual Detail
        $this->db->delete($this->tableQuantityDet, array('faktur' => $faktur));

        $this->db->trans_complete(); # Completing transaction

        /*Optional*/

        if ($this->db->trans_status() === FALSE) {
            # Something went wrong.
            $this->db->trans_rollback();
            return FALSE;
        } else {
            # Everything is Perfect. 
            # Committing data to the database.
            $this->db->trans_commit();
            return TRUE;
        }
    }

    public function sumWherePenjualan($table, $colSum, $col, $id = null, $startDate = null, $endDate = null, $varDate = null)
    {
        $this->db->select_sum($colSum);
        $this->db->where($col, $id);
        if ($startDate != NULL) {
            $this->db->where("$varDate>=", $startDate)->where("$varDate<=", $endDate);
        }
        return $this->db->get($table)->row()->$colSum;
    }

    public function sumWherePenjualanFilter($colSum, $startDate = null, $endDate = null, $user = null, $pelanggan = null)
    {
        $this->db->select_sum($colSum);
        $this->db->from('penjualan');
        $this->db->join('penjualan_detail', 'penjualan.faktur = penjualan_detail.faktur');
        $this->db->where('status_proses', 1);
        if ($user != "") {
            $this->db->where('user_id', $user);
        }
        if ($pelanggan != "") {
            $this->db->where('pelanggan_id', $pelanggan);
        }
        if ($startDate != NULL) {
            $this->db->where("penjualan.date>=", $startDate)->where("penjualan.date<=", $endDate);
        }
        return $this->db->get()->row()->$colSum;
    }

    public function sumAllBeratPenjualan($startDate = null, $endDate = null, $user = null, $pelanggan = null)
    {
        if ($startDate != NULL) {
            $countDetail = $this->countDetailPenjualan($startDate, $endDate, $user, $pelanggan);
        } else {
            $countDetail = countWhere('penjualan_detail', 'status_proses', 1);
        }
        $listCount = $this->getAllDetail($startDate, $endDate, $user, $pelanggan);
        $data = array();
        foreach ($listCount as $field) {
            $data[] = array(
                "kode_barang" => $field->kode_barang,
                "berat" => sumWhere('data_barang', 'berat', 'kode_barang', $field->kode_barang),
            );
        }
        $row = array();
        for ($i = 0; $i < $countDetail; $i++) {
            $row[] = $data[$i]['berat'];
        };
        return array_sum($row);
    }

    public function countDetailPenjualan($startDate, $endDate, $user, $pelanggan)
    {
        $this->db->from($this->tableDet);
        $this->db->join('penjualan', 'penjualan.faktur = penjualan_detail.faktur');
        $this->db->where('status_proses', 1);
        if ($user != "") {
            $this->db->where('user_id', $user);
        }
        if ($pelanggan != "") {
            $this->db->where('pelanggan_id', $pelanggan);
        }
        if ($startDate != NULL) {
            $this->db->where("penjualan_detail.date>=", $startDate)->where("penjualan_detail.date<=", $endDate);
        }
        return $this->db->count_all_results();
    }

    public function getAllDetail($startDate, $endDate, $user, $pelanggan)
    {
        $this->db->from($this->tableDet);
        $this->db->join('penjualan', 'penjualan.faktur = penjualan_detail.faktur');
        $this->db->where('status_proses', 1);
        if ($user != "") {
            $this->db->where('user_id', $user);
        }
        if ($pelanggan != "") {
            $this->db->where('pelanggan_id', $pelanggan);
        }
        if ($startDate != NULL) {
            $this->db->where("penjualan_detail.date>=", $startDate)->where("penjualan_detail.date<=", $endDate);
        }
        $query = $this->db->get();
        return $query->result();
    }

    public function countNota($table, $startDate, $endDate)
    {
        $this->db->from($table);
        if ($startDate != NULL) {
            $this->db->where("date>=", $startDate)->where("date<=", $endDate);
        }
        return $this->db->count_all_results();
    }

    public function sumBeratPenjualan($session)
    {
        $countDetail = countWhereDouble('penjualan_detail', 'status_proses', 0, 'session', $session);
        $listCount = $this->getDetailPrajual($session);
        $data = array();
        foreach ($listCount as $field) {
            $data[] = array(
                "kode_barang" => $field->kode_barang,
                "berat" => sumWhere('data_barang', 'berat', 'kode_barang', $field->kode_barang),
            );
        }
        $row = array();
        for ($i = 0; $i < $countDetail; $i++) {
            $row[] = $data[$i]['berat'];
        };
        return array_sum($row);
    }

    public function sumPokokModal($session)
    {
        $countDetail = countWhereDouble('penjualan_detail', 'status_proses', 0, 'session', $session);
        $listCount = $this->getDetailPrajual($session);
        $data = array();
        foreach ($listCount as $field) {
            $data[] = array(
                "kode_barang" => $field->kode_barang,
                "nilai_beli" => sumWhere('data_barang', 'nilai_beli', 'kode_barang', $field->kode_barang),
            );
        }
        $row = array();
        for ($i = 0; $i < $countDetail; $i++) {
            $row[] = $data[$i]['nilai_beli'];
        };
        return array_sum($row);
    }

    public function updateDetail()
    {
        $kodeBarang = $this->input->post('kode_barang', TRUE, 0);
        $ongkosVal = $this->input->post('ongkos', TRUE, 0);
        $harga = $this->input->post('harga', TRUE, 0);
        $berat = $this->input->post('berat', TRUE, 0);
        $updatePenjualanDet = array(
            'harga' => $harga,
            'ongkos' => $ongkosVal,
            'subtotal' => ($harga * $berat),
            'total' => (($harga * $berat) + $ongkosVal)
        );
        $this->db->where('kode_barang', $kodeBarang)->where('status_proses', 0);
        $this->db->update($this->tableDet, $updatePenjualanDet);
        return ($this->db->affected_rows() == 1) ? FALSE : TRUE;
    }

    public function updateQty()
    {
        $kodeBarang = $this->input->post('kode_barang', TRUE, 0);
        $harga = $this->input->post('harga', TRUE, 0);
        $qtyVal = $this->input->post('qty', TRUE, 0);
        $updateQty = array(
            'qty' => $qtyVal,
            'total' => ($qtyVal * $harga)
        );
        $this->db->trans_start(); # Starting Transaction

        // Update Stok Barang
        $this->changeStokBarang($qtyVal, '+', $kodeBarang);
        // Update Quantity Detail
        $this->db->where('kode_barang', $kodeBarang)->where('status_proses', 0);
        $this->db->update($this->tableQuantityDet, $updateQty);

        $this->db->trans_complete(); # Completing transaction

        /*Optional*/

        if ($this->db->trans_status() === FALSE) {
            # Something went wrong.
            $this->db->trans_rollback();
            return FALSE;
        } else {
            # Everything is Perfect. 
            # Committing data to the database.
            $this->db->trans_commit();
            return TRUE;
        }
    }

    public function getAllDataPenjualan($startDate, $endDate, $statusBayar)
    {
        $this->db->from($this->tableHead);
        if ($statusBayar != "") {
            $this->db->where('status_bayar', $statusBayar);
        }
        $this->db->where('date>=', $startDate)->where('date<=', $endDate);
        $query = $this->db->get();
        return $query->result();
    }
}