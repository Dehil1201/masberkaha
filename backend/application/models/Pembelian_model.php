<?php defined('BASEPATH') or exit('No direct script access allowed');

class Pembelian_model extends CI_Model
{
    var $tableHead = 'pembelian';
    var $tableDet = 'pembelian_detail';
    var $tableFaktur = 'faktur';
    var $tableBarang = 'data_barang';
    var $tableHutang = 'hutang';
    var $tableBarangHistory = 'barang_history';
    var $column_order = array('id', 'faktur', 'date', 'jam', 'berat', 'grand_total', 'supplier_id', 'user_id');
    var $column_search = array('id', 'faktur');
    var $order = array('id' => 'asc');

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

    // Get Table Pembelian Head
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

    private function _get_datatables_query_filter($col, $val, $startDate, $endDate, $user, $supplier)
    {
        $this->db->from($this->tableHead);
        $this->db->where($col, $val);
        if ($user != "") {
            $this->db->where('user_id', $user);
        }
        if ($supplier != "") {
            $this->db->where('supplier_id', $supplier);
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

    function get_datatables_filter($col, $val, $startDate, $endDate, $user, $supplier)
    {
        $this->_get_datatables_query_filter($col, $val, $startDate, $endDate, $user, $supplier);
        if ($_POST['length'] != -1)
            $this->db->limit($_POST['length'], $_POST['start']);
        $query = $this->db->get();
        return $query->result();
    }

    function count_filtered_filter($col, $val, $startDate, $endDate, $user, $supplier)
    {
        $this->_get_datatables_query_filter($col, $val, $startDate, $endDate, $user, $supplier);
        $query = $this->db->get();
        return $query->num_rows();
    }

    public function count_all()
    {
        $this->db->from($this->tableHead);
        return $this->db->count_all_results();
    }

    // Get Table Pembelian Detail
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

    public function addTransactionsTunai($userID)
    {
        $faktur = $this->input->post('faktur', TRUE, NULL);
        $grandTotal = sumData('pembelian_detail', 'total', $userID);
        $session = $userID;
        $dataPembelian = array(
            'faktur' => $faktur,
            'supplier_id' => $this->input->post('supplier_id', TRUE, NULL),
            'date' => $this->input->post('date', TRUE, date('Y-m-d H:i:s')),
            'pengeluaran' => $this->input->post('pengeluaran', TRUE, $grandTotal),
            'grand_total' => $this->input->post('grand_total', TRUE, $grandTotal),
            'user_id' => $session,
            'status_bayar' => $this->input->post('status_bayar', TRUE, 1),
            'keterangan' => 'Pembelian : ' . $faktur,
            'created_at' => date('Y-m-d H:i:s'),
            'total_berat' => round($this->sumBeratPembelian($session), 2)
        );
        $dataFaktur = array(
            'faktur' => $faktur,
            'date' => $this->input->post('date', TRUE, date('Y-m-d H:i:s')),
            'pemasukan' => 0,
            'pengeluaran' => $this->input->post('pengeluaran', TRUE, $grandTotal),
            'grand_total' => $this->input->post('grand_total', TRUE, $grandTotal),
            'mode' => 'Pembelian',
            'referensi' => 'PB',
            'source' => '1101',
            'keterangan' => 'Pembelian : ' . $faktur,
            'created_at' => date('Y-m-d H:i:s')
        );
        $statusBeliDet = array(
            'faktur' => $this->input->post('faktur', TRUE, NULL),
            'status_proses' => 1,
            'date' => date('Y-m-d')
        );
        $statusBarangHistory = array(
            'faktur' => $this->input->post('faktur', TRUE, NULL),
            'status_proses' => 1,
            'pelanggan_supplier_id' => $this->input->post('supplier_id', TRUE, NULL),
            'date' => date('Y-m-d'),
            'created_at' => date('Y-m-d H:i:s')
        );

        $this->db->trans_start(); # Starting Transaction

        // Insert Data Pembelian
        $this->db->insert($this->tableHead, $dataPembelian);
        // Insert Data Faktur
        $this->db->insert($this->tableFaktur, $dataFaktur);
        // Change status pembelian detail
        $this->db->where('status_proses', 0)->where('session', $userID);
        $this->db->update($this->tableDet, $statusBeliDet);
        // Change status barang history
        $this->db->where('status_proses', 0)->where('session', $userID);
        $this->db->update($this->tableBarangHistory, $statusBarangHistory);

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
        $grandTotal = sumData('pembelian_detail', 'total', $userID);
        $session = $userID;
        $dataPembelian = array(
            'faktur' => $faktur,
            'supplier_id' => $this->input->post('supplier_id', TRUE, NULL),
            'date' => $this->input->post('date', TRUE, date('Y-m-d H:i:s')),
            'pengeluaran' => 0,
            'grand_total' => $this->input->post('grand_total', TRUE, $grandTotal),
            'user_id' => $session,
            'status_bayar' => $this->input->post('status_bayar', TRUE, 1),
            'keterangan' => 'Pembelian : ' . $faktur,
            'created_at' => date('Y-m-d H:i:s'),
            'total_berat' => round($this->sumBeratPembelian($session), 2)
        );
        $dataFaktur = array(
            'faktur' => $faktur,
            'date' => $this->input->post('date', TRUE, date('Y-m-d H:i:s')),
            'pemasukan' => 0,
            'pengeluaran' => 0,
            'grand_total' => $this->input->post('grand_total', TRUE, $grandTotal),
            'mode' => 'Pembelian',
            'referensi' => 'PB',
            'source' => '1101',
            'keterangan' => 'Pembelian : ' . $faktur,
            'created_at' => date('Y-m-d H:i:s')
        );
        $statusBeliDet = array(
            'faktur' => $this->input->post('faktur', TRUE, NULL),
            'status_proses' => 1,
            'date' => date('Y-m-d')
        );
        $statusBarangHistory = array(
            'faktur' => $this->input->post('faktur', TRUE, NULL),
            'status_proses' => 1,
            'pelanggan_supplier_id' => $this->input->post('supplier_id', TRUE, NULL),
            'date' => date('Y-m-d'),
            'created_at' => date('Y-m-d H:i:s')
        );
        $dataHutang = array(
            'faktur_beli' => $faktur,
            'supplier_id' => $this->input->post('supplier_id', TRUE, NULL),
            'hutang' => $this->input->post('hutang', TRUE, $grandTotal),
            'hutang_dibayar' => $this->input->post('hutang_dibayar', TRUE, 0),
            'hutang_sisa' => $this->input->post('hutang_sisa', TRUE, $grandTotal),
            'tempo' => $this->input->post('tempo', TRUE, date('Y-m-d')),
            'user_id' => $userID,
            'keterangan' => 'Hutang Pembelian : ' . $faktur,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d')
        );

        $this->db->trans_start(); # Starting Transaction

        // Insert Data Pembelian
        $this->db->insert($this->tableHead, $dataPembelian);
        // Insert Data Faktur
        $this->db->insert($this->tableFaktur, $dataFaktur);
        // Change status pembelian detail
        $this->db->where('status_proses', 0)->where('session', $userID);
        $this->db->update($this->tableDet, $statusBeliDet);
        // Change status barang history
        $this->db->where('status_proses', 0)->where('session', $userID);
        $this->db->update($this->tableBarangHistory, $statusBarangHistory);
        // Insert Data Hutang
        $this->db->insert($this->tableHutang, $dataHutang);

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
        $kodeBarang = $this->input->post('kode_barang', TRUE, NULL);
        $berat = $this->input->post('berat', TRUE, 0);
        $valueStok = $this->input->post('stok', TRUE, 1);
        $statusBarang = $this->input->post('status_barang', TRUE, 0);
        $hargaBeli = $this->input->post('harga_beli', TRUE, 0);
        $hargaJual = $this->input->post('harga_jual', TRUE, 0);
        $jenisBarang = $this->input->post('jenis_barang', TRUE, NULL);
        $foto = $this->input->post('foto', FALSE, NULL);
        $dataBarang = array(
            'kode_barang' => $kodeBarang,
            'nama_barang' => $this->input->post('nama_barang', TRUE, NULL),
            'jenis_barang' => $jenisBarang,
            'berat' => $berat,
            'kadar' => $this->input->post('kadar', TRUE, 0),
            'status' => $statusBarang,
            'harga_beli' => $hargaBeli,
            'nilai_beli' => (getDataField('jenis_barang', 'jenis_barang', $jenisBarang, 'penjualan_satuan') == 0) ? $hargaBeli * $berat : $hargaBeli * $valueStok,
            'harga_jual' => $hargaJual,
            'stok' => $valueStok,
            'nilai_stok' => $hargaJual,
            'foto' => $this->uploadFoto($foto, $kodeBarang),
            'status_check' => 0,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
            'tanggal_terima' => ($statusBarang == '1') ? date('Y-m-d H:i:s') : null
        );

        $this->db->trans_start(); # Starting Transaction

        // Insert Data Barang
        $this->db->insert($this->tableBarang, $dataBarang);
        // Insert Data Beli Detail
        $idBarang = getBarangID($kodeBarang, 'id');
        $dataBeliDet = array(
            'faktur' => '-',
            'id_barang' => $idBarang,
            'kode_barang' => $kodeBarang,
            'harga' => $hargaBeli,
            'qty' => $valueStok,
            'total' => (getDataField('jenis_barang', 'jenis_barang', $jenisBarang, 'penjualan_satuan') == 0) ? $hargaBeli * $berat : $hargaBeli * $valueStok,
            'status_proses' => '0',
            'session' => $userID,
            'date' => $this->input->post('date', TRUE, date('Y-m-d'))
        );
        $this->db->insert($this->tableDet, $dataBeliDet);
        // Insert Data History Barang
        $dataHistoryBarang = array(
            'id_barang' => $idBarang,
            'kode_barang' => $kodeBarang,
            'kode_jenis' => getDataField('jenis_barang', 'jenis_barang', getBarangID($kodeBarang, 'jenis_barang'), 'kode_jenis'),
            'faktur' => '-',
            'date' => date('Y-m-d'),
            'action' => 'Pembelian',
            'status_proses' => '0',
            'session' => $userID,
            'created_at' => date('Y-m-d H:i:s')
        );
        $this->db->insert($this->tableBarangHistory, $dataHistoryBarang);

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
        $foto = $this->input->post('foto', TRUE, NULL);

        $this->db->trans_start(); # Starting Transaction

        // Delete Data Barang
        $this->db->delete($this->tableBarang, array('kode_barang' => $kodeBarang));
        // Delete Foto Barang
        $this->_deleteImage($foto);
        // Delete Data Beli Detail
        $this->delBeliDetail($kodeBarang, $userID);
        // Delete Data History Barang
        $this->db->delete($this->tableBarangHistory, array('kode_barang' => $kodeBarang, 'action' => 'Pembelian', 'status_proses' => 0, 'session' => $userID));

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

    private function _deleteImage($foto)
    {
        if ($foto != NULL) {
            return array_map('unlink', glob(FCPATH . "uploads/foto/$foto"));
        }
    }

    public function delBeliDetail($kode, $userID)
    {
        return $this->db->delete($this->tableDet, array('kode_barang' => $kode, 'status_proses' => 0, 'session' => $userID));
    }

    public function sumWherePembelian($table, $colSum, $col, $id = null, $startDate = null, $endDate = null, $varDate = null)
    {
        $this->db->select_sum($colSum);
        $this->db->where($col, $id);
        if ($startDate != NULL) {
            $this->db->where("$varDate>=", $startDate)->where("$varDate<=", $endDate);
        }
        return $this->db->get($table)->row()->$colSum;
    }

    public function countNota($table, $startDate, $endDate)
    {
        $this->db->from($table);
        if ($startDate != NULL) {
            $this->db->where("date>=", $startDate)->where("date<=", $endDate);
        }
        return $this->db->count_all_results();
    }

    public function getDetail($nota)
    {
        $this->db->from($this->tableDet)->where('faktur', $nota)->where('status_proses', 1);
        $query = $this->db->get();
        return $query->result();
    }

    public function sumBeratPembelian($session)
    {
        $countDetail = countWhereDouble('pembelian_detail', 'status_proses', 0, 'session', $session);
        $listCount = $this->getDetailPrabeli($session);
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

    public function getDetailPrabeli($session)
    {
        $this->db->from($this->tableDet)->where('status_proses', 0)->where('session', $session);
        $query = $this->db->get();
        return $query->result();
    }

    public function getHead($nota)
    {
        $this->db->from($this->tableHead)->where('faktur', $nota);
        $query = $this->db->get();
        return $query->result();
    }

    public function delTransactions($faktur)
    {

        $this->db->trans_start(); # Starting Transaction

        // Delete Data Faktur
        $this->db->delete($this->tableFaktur, array('faktur' => $faktur));
        // Delete Data Hutang
        $countHutang = countWhere('hutang', 'faktur_beli', $faktur);
        if ($countHutang > 0) {
            $this->db->delete($this->tableHutang, array('faktur_beli' => $faktur));
        }
        // Delete Data Pembelian
        $this->db->delete($this->tableHead, array('faktur' => $faktur));
        // Delete Data History Barang
        $this->db->delete($this->tableBarangHistory, array('faktur' => $faktur));
        // Check Data Detail Pembelian
        $countDetail = countWhere('pembelian_detail', 'faktur', $faktur);
        $list = $this->getDetail($faktur);
        $data = array();
        foreach ($list as $field) {
            $data[] = array(
                "id_barang" => $field->id_barang,
                "kode_barang" => $field->kode_barang,
                "foto" => getBarangID($field->kode_barang, 'foto')
            );
        }
        for ($i = 0; $i < $countDetail; $i++) {
            // Delete Data Barang
            $this->db->delete($this->tableBarang, array("kode_barang" => $data[$i]['kode_barang']));
            // Delete Foto Barang
            $this->_deleteImage($data[$i]['foto']);
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

    public function sumWherePembelianFilter($colSum, $startDate = null, $endDate = null, $user = null, $supplier = null)
    {
        $this->db->select_sum($colSum);
        $this->db->from('pembelian');
        $this->db->join('pembelian_detail', 'pembelian.faktur = pembelian_detail.faktur');
        $this->db->where('status_proses', 1);
        if ($user != "") {
            $this->db->where('user_id', $user);
        }
        if ($supplier != "") {
            $this->db->where('supplier_id', $supplier);
        }
        if ($startDate != NULL) {
            $this->db->where("pembelian.date>=", $startDate)->where("pembelian.date<=", $endDate);
        }
        return $this->db->get()->row()->$colSum;
    }

    public function sumAllBeratPembelian($startDate = null, $endDate = null, $user = null, $supplier = null)
    {
        if ($startDate != NULL) {
            $countDetail = $this->countDetailPembelian($startDate, $endDate, $user, $supplier);
        } else {
            $countDetail = countWhere('pembelian_detail', 'status_proses', 1);
        }
        $listCount = $this->getAllDetail($startDate, $endDate, $user, $supplier);
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

    public function countDetailPembelian($startDate, $endDate, $user, $supplier)
    {
        $this->db->from($this->tableDet);
        $this->db->join('pembelian', 'pembelian.faktur = pembelian_detail.faktur');
        $this->db->where('status_proses', 1);
        if ($user != "") {
            $this->db->where('user_id', $user);
        }
        if ($supplier != "") {
            $this->db->where('supplier_id', $supplier);
        }
        if ($startDate != NULL) {
            $this->db->where("pembelian_detail.date>=", $startDate)->where("pembelian_detail.date<=", $endDate);
        }
        return $this->db->count_all_results();
    }

    public function getAllDetail($startDate, $endDate, $user, $supplier)
    {
        $this->db->from($this->tableDet);
        $this->db->join('pembelian', 'pembelian.faktur = pembelian_detail.faktur');
        $this->db->where('status_proses', 1);
        if ($user != "") {
            $this->db->where('user_id', $user);
        }
        if ($supplier != "") {
            $this->db->where('supplier_id', $supplier);
        }
        if ($startDate != NULL) {
            $this->db->where("pembelian_detail.date>=", $startDate)->where("pembelian_detail.date<=", $endDate);
        }
        $query = $this->db->get();
        return $query->result();
    }

    public function delDetailTransactions($kode_barang, $faktur)
    {
        $this->db->trans_start(); # Starting Transaction

        // Delete Data Beli Detail
        $this->db->delete($this->tableDet, array('kode_barang' => $kode_barang, 'faktur' => $faktur));
        // Delete Data History Barang
        $this->db->delete($this->tableBarangHistory, array('kode_barang' => $kode_barang, 'faktur' => $faktur));
        // Delete Data Barang
        $this->db->delete($this->tableBarang, array('kode_barang' => $kode_barang));
        // Jumlahkan total pembelian detail
        $totalDetail = $this->sumWherePembelian($this->tableDet, 'total', 'faktur', $faktur);
        // Update Data Pembelian
        $updateDataPembelian = array(
            'pengeluaran' => $totalDetail,
            'grand_total' => $totalDetail,
            'created_at' => date('Y-m-d H:i:s')
        );
        $this->db->where('faktur', $faktur);
        $this->db->update($this->tableHead, $updateDataPembelian);
        // Update Data Faktur
        $updateDataFaktur = array(
            'pengeluaran' => $totalDetail,
            'grand_total' => $totalDetail
        );
        $this->db->where('faktur', $faktur);
        $this->db->update($this->tableFaktur, $updateDataFaktur);
        // Update Data Hutang
        $countHutang = countWhere('hutang', 'faktur_beli', $faktur);
        if ($countHutang > 0) {
            $updateDataHutang = array(
                'hutang' => $totalDetail,
                'hutang_sisa' => $totalDetail,
                'updated_at' => date('Y-m-d')
            );
            $this->db->where('faktur_beli', $faktur);
            $this->db->update($this->tableHutang, $updateDataHutang);
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
}
