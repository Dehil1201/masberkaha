<?php defined('BASEPATH') or exit('No direct script access allowed');

class BeliKembali_model extends CI_Model
{
    var $tableHead = 'beli_kembali';
    var $tableDet = 'beli_kembali_detail';
    var $tablePenjualan = 'penjualan';
    var $tablePenjualanDet = 'penjualan_detail';
    var $tableFaktur = 'faktur';
    var $tableBarang = 'data_barang';
    var $tablePiutang = 'piutang';
    var $tableBarangHistory = 'barang_history';
    var $column_order = array('id', 'faktur', 'nota', 'date', 'jam', 'grand_total', 'user_id', 'pelanggan_id');
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

    // Get Table BeliKembali Head
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

    private function _get_datatables_query_filter($startDate, $endDate, $user, $pelanggan)
    {
        $this->db->from($this->tableHead);
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

    function get_datatables_filter($startDate, $endDate, $user, $pelanggan)
    {
        $this->_get_datatables_query_filter($startDate, $endDate, $user, $pelanggan);
        if ($_POST['length'] != -1)
            $this->db->limit($_POST['length'], $_POST['start']);
        $query = $this->db->get();
        return $query->result();
    }

    function count_filtered_filter($startDate, $endDate, $user, $pelanggan)
    {
        $this->_get_datatables_query_filter($startDate, $endDate, $user, $pelanggan);
        $query = $this->db->get();
        return $query->num_rows();
    }

    public function count_all()
    {
        $this->db->from($this->tableHead);
        return $this->db->count_all_results();
    }

    // Get Table BeliKembali Detail
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

    public function getHead($nota)
    {
        $this->db->from($this->tableHead)->where('faktur', $nota);
        $query = $this->db->get();
        return $query->result();
    }

    public function getDetail($nota)
    {
        $this->db->from($this->tableDet)->where('faktur', $nota)->where('status_proses', 1);
        $query = $this->db->get();
        return $query->result();
    }

    public function addTransactionsTunai($userID, $status)
    {
        $faktur = $this->input->post('faktur', TRUE, NULL);
        $grandTotal = sumData('beli_kembali_detail', 'total', $userID);
        $idPelanggan = $this->input->post('pelanggan_id', TRUE, 0);
        $nota = htmlspecialchars($this->input->post('nota'));
        $session = $userID;
        $dataBeliKembali = array(
            'faktur' => $faktur,
            'nota' => $nota,
            'date' => $this->input->post('date', TRUE, date('Y-m-d')),
            'pengeluaran' => $this->input->post('pengeluaran', TRUE, $grandTotal),
            'grand_total' => $this->input->post('grand_total', TRUE, $grandTotal),
            'user_id' => $session,
            'pelanggan_id' => $idPelanggan,
            'keterangan' => 'Beli Kembali : ' . $nota,
            'created_at' => date('Y-m-d H:i:s')
        );
        $dataFaktur = array(
            'faktur' => $faktur,
            'date' => $this->input->post('date', TRUE, date('Y-m-d')),
            'pemasukan' => 0,
            'pengeluaran' => $this->input->post('pengeluaran', TRUE, $grandTotal),
            'grand_total' => $this->input->post('grand_total', TRUE, $grandTotal),
            'mode' => 'Beli Kembali',
            'source' => '1101',
            'referensi' => 'BK',
            'keterangan' => 'Beli Kembali : ' . $nota,
            'created_at' => date('Y-m-d H:i:s')
        );
        $statusBuybackDet = array(
            'faktur' => $faktur,
            'nota' => $nota,
            'status_proses' => 1,
            'pelanggan_id' => $this->input->post('pelanggan_id', TRUE, 0),
            'date' => date('Y-m-d')
        );
        $statusBarang = array(
            'faktur' => $faktur,
            'status_proses' => 1,
            'pelanggan_supplier_id' => $idPelanggan,
            'date' => date('Y-m-d'),
            'created_at' => date('Y-m-d H:i:s')
        );
        $statusFaktur = array(
            'status_faktur' => $status,
        );

        $this->db->trans_start(); # Starting Transaction

        // Insert Data Beli Kembali
        $this->db->insert($this->tableHead, $dataBeliKembali);
        // Insert Data Faktur
        $this->db->insert($this->tableFaktur, $dataFaktur);
        // Update Harga Jual Data Barang
        $countDetail = countWhereDouble($this->tableDet, 'status_proses', 0, 'session', $session);
        $list = $this->getDetailPrabuyback($session);
        $data = array();
        foreach ($list as $field) {
            $data[] = array(
                "kode_barang" => $field->kode_barang,
                "berat" => $field->berat,
                "status" => $field->status,
                "harga_beli" => $field->harga_beli,
            );
        }
        for ($i = 0; $i < $countDetail; $i++) {
            $this->updateBarang($data[$i]['harga_beli'], $data[$i]['berat'], $data[$i]['status'], $data[$i]['kode_barang']);
        }
        // Change status beli kembali detail
        $this->db->where('status_proses', 0)->where('session', $userID);
        $this->db->update($this->tableDet, $statusBuybackDet);
        // Change status barang
        $this->db->where('status_proses', 0)->where('session', $userID);
        $this->db->update($this->tableBarangHistory, $statusBarang);
        // Change status faktur penjualan
        $this->db->where('faktur', $nota);
        $this->db->update($this->tablePenjualan, $statusFaktur);

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

    public function testCase()
    {
        $list = $this->getDetailPrabuyback(1);
        $data = array();
        foreach ($list as $field) {
            $data[] = array(
                "kode_barang" => $field->kode_barang,
                "berat" => $field->berat,
                "status" => $field->status,
                "harga_beli" => ($field->harga_beli - $field->potgram),
            );
        }
        return var_dump($data);
    }

    public function addTransactionsDetail($userID)
    {
        $nota = htmlspecialchars($this->input->post('nota'));
        $idBarang = $this->input->post('id_barang', TRUE, NULL);
        $kodeBarang = $this->input->post('kode_barang', TRUE, NULL);
        $berat = $this->input->post('berat', TRUE, NULL);
        $potongan = $this->input->post('potongan', TRUE, 0);
        $potonganValue = $potongan * (($berat < 1) ? 1 : $berat);
        $hargaBeli = $this->input->post('harga_beli', TRUE, 0);
        $hargaKembali = (($hargaBeli * $berat) - $potonganValue);
        $biayaServis = $this->input->post('biaya_servis', TRUE, 0);
        $statusBarang = $this->input->post('status', TRUE, 1);
        $oldPriceBuy = getBarangID($kodeBarang, 'harga_beli');
        $dataBuybackDet = array(
            'faktur' => '-',
            'id_barang' => $idBarang,
            'kode_barang' => $kodeBarang,
            'status' => $statusBarang,
            'berat' => $berat,
            'harga_beli' => $hargaBeli,
            'old_price' => $oldPriceBuy,
            'potgram' => $potongan,
            'potongan' => $potonganValue,
            'harga_kembali' => $hargaKembali,
            'biaya_servis' => $biayaServis,
            'total' => $hargaKembali - $biayaServis,
            'status_proses' => '0',
            'session' => $userID,
            'date' => $this->input->post('date', TRUE, date('Y-m-d'))
        );
        $dataHistoryBarang = array(
            'id_barang' => $this->input->post('id_barang', TRUE, NULL),
            'kode_barang' => $kodeBarang,
            'kode_jenis' => getDataField('jenis_barang', 'jenis_barang', getBarangID($kodeBarang, 'jenis_barang'), 'kode_jenis'),
            'faktur' => '-',
            'date' => date('Y-m-d'),
            'action' => 'Beli Kembali',
            'status_proses' => '0',
            'session' => $userID,
            'created_at' => date('Y-m-d H:i:s')
        );
        $statusJual = array(
            'status_jual' => 1,
        );

        $this->db->trans_start(); # Starting Transaction

        // Insert Data Buyback Detail
        $this->db->insert($this->tableDet, $dataBuybackDet);
        // Change Status Data Barang
        $this->changeStatusBarang($statusBarang, $kodeBarang);
        // Insert Data History Barang
        $this->db->insert($this->tableBarangHistory, $dataHistoryBarang);
        // Change status jual penjualan detail
        $this->db->where('faktur', $nota)->where('kode_barang', $kodeBarang);
        $this->db->update($this->tablePenjualanDet, $statusJual);

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
        $nota = htmlspecialchars($this->input->post('nota'));
        $kodeBarang = $this->input->post('kode_barang', TRUE, NULL);
        $statusJual = array(
            'status_jual' => 0,
        );

        $this->db->trans_start(); # Starting Transaction

        // Delete Data Buyback Detail
        $this->delBuybackDetail($kodeBarang, $userID);
        // Insert Data Faktur
        $this->changeStatusBarang('J', $kodeBarang);
        // Delete Data History Barang
        $this->db->delete($this->tableBarangHistory, array('kode_barang' => $kodeBarang, 'action' => 'Beli Kembali', 'status_proses' => 0, 'session' => $userID));
        $this->db->where('faktur', $nota)->where('kode_barang', $kodeBarang);
        $this->db->update($this->tablePenjualanDet, $statusJual);

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

    public function delTransactions($faktur)
    {
        $this->db->trans_start(); # Starting Transaction

        // Delete Data Faktur
        $this->db->delete($this->tableFaktur, array('faktur' => $faktur));
        // Delete Data Beli Kembali
        $this->db->delete($this->tableHead, array('faktur' => $faktur));
        // Delete Data History Barang
        $this->db->delete($this->tableBarangHistory, array('faktur' => $faktur));
        // Check Data Detail Buyback
        $countDetail = countWhere($this->tableDet, 'faktur', $faktur);
        $list = $this->getDetail($faktur);
        $data = array();
        foreach ($list as $field) {
            $data[] = array(
                "id_barang" => $field->id_barang,
                "kode_barang" => $field->kode_barang,
                "harga_beli" => $field->harga_beli,
                "old_price" => $field->old_price,
            );
        }
        for ($i = 0; $i < $countDetail; $i++) {
            // Change Status Data Barang
            $this->changeStatusBarang('J', $data[$i]['kode_barang']);
            // Change Harga Barang
            $this->db->where('kode_barang', $data[$i]['kode_barang']);
            $this->db->set('harga_beli', $data[$i]['old_price'], FALSE);
            $this->db->update($this->tableBarang);
        }
        // Delete Data Buyback Detail
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

    public function delBuybackDetail($kode, $userID)
    {
        return $this->db->delete($this->tableDet, array('kode_barang' => $kode, 'status_proses' => 0, 'session' => $userID));
    }

    public function changeStatusBarang($status, $kodeBarang)
    {
        $data = array(
            'status' => $status,
            'updated_at' => date('Y-m-d H:i:s'),
            'tanggal_terima' => date('Y-m-d H:i:s')
        );
        $this->db->where('kode_barang', $this->input->post('kode_barang', TRUE, $kodeBarang));
        return $this->db->update($this->tableBarang, $data);
    }

    public function countNota($table, $startDate, $endDate, $user, $pelanggan)
    {
        $this->db->from($table);
        if ($user != "") {
            $this->db->where('user_id', $user);
        }
        if ($pelanggan != "") {
            $this->db->where('pelanggan_id', $pelanggan);
        }
        if ($startDate != NULL) {
            $this->db->where("date>=", $startDate)->where("date<=", $endDate);
        }
        return $this->db->count_all_results();
    }

    public function sumWhereBuyback($table, $colSum, $col, $id, $startDate = null, $endDate = null, $varDate = null, $user = null, $pelanggan = null)
    {
        $this->db->select_sum($colSum);
        $this->db->where($col, $id);
        if ($user != "") {
            $this->db->where('session', $user);
        }
        if ($pelanggan != "") {
            $this->db->where('pelanggan_id', $pelanggan);
        }
        if ($startDate != NULL) {
            $this->db->where("$varDate>=", $startDate)->where("$varDate<=", $endDate);
        }
        return $this->db->get($table)->row()->$colSum;
    }

    public function getDetailPrabuyback($session)
    {
        $this->db->from($this->tableDet)->where('status_proses', 0)->where('session', $session);
        $query = $this->db->get();
        return $query->result();
    }

    public function updateBarang($harga, $berat, $status, $kodeBarang)
    {
        $data = array(
            'harga_beli' => $harga,
            'nilai_beli' => ($harga * $berat),
            // 'harga_jual' => getPengaturan('harga_pasar'),
            'status' => $status,
            'updated_at' => date('Y-m-d H:i:s')
        );
        $this->db->where('kode_barang', $kodeBarang);
        return $this->db->update($this->tableBarang, $data);
    }

    public function delDetailTransactions($kode_barang, $faktur)
    {
        $this->db->trans_start(); # Starting Transaction

        // Get Data Buyback
        $oldPriceBuy = getDataFieldDouble($this->tableDet, 'kode_barang', $kode_barang, 'faktur', $faktur, 'old_price');
        // Delete Data Buyback Detail
        $this->db->delete($this->tableDet, array('kode_barang' => $kode_barang, 'faktur' => $faktur));
        // Delete Data History Barang
        $this->db->delete($this->tableBarangHistory, array('kode_barang' => $kode_barang, 'faktur' => $faktur));
        // Change Data Barang
        $updateDataBarang = array(
            'status' => 'J',
            'tanggal_terima' => null,
            'updated_at' => date('Y-m-d H:i:s'),
            'harga_beli' => $oldPriceBuy,
        );
        $this->db->where('kode_barang', $kode_barang);
        $this->db->update($this->tableBarang, $updateDataBarang);
        // Jumlahkan total penjualan detail
        $totalDetail = $this->sumWhereBuyback($this->tableDet, 'total', 'faktur', $faktur);
        // Update Data Buyback
        $updateDataBuyback = array(
            'pengeluaran' => $totalDetail,
            'grand_total' => $totalDetail,
            'created_at' => date('Y-m-d H:i:s')
        );
        $this->db->where('faktur', $faktur);
        $this->db->update($this->tableHead, $updateDataBuyback);
        // Update Data Faktur
        $updateDataFaktur = array(
            'pengeluaran' => $totalDetail,
            'grand_total' => $totalDetail
        );
        $this->db->where('faktur', $faktur);
        $this->db->update($this->tableFaktur, $updateDataFaktur);

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

    public function updateDetail()
    {
        $kodeBarang = $this->input->post('kode_barang', TRUE, 0);
        $berat = $this->input->post('berat', TRUE, 0);
        $hargaNota = $this->input->post('harga_nota', TRUE, 0);
        $potongan = $this->input->post('potongan', TRUE, 0);
        $potonganValue = $potongan * (($berat < 1) ? 1 : $berat);
        $hargaKembali = (($hargaNota * $berat) - $potonganValue);
        $servis = $this->input->post('servis', TRUE, 0);
        $status = $this->input->post('status', TRUE, 1);
        $updateBuybackDet = array(
            'berat' => $berat,
            'harga_beli' => $hargaNota,
            'potgram' => $potongan,
            'potongan' => $potonganValue,
            'harga_kembali' => $hargaKembali,
            'biaya_servis' => $servis,
            'total' => $hargaKembali - $servis,
            'status' => $status
        );
        $this->db->where('kode_barang', $kodeBarang)->where('status_proses', 0);
        $this->db->update($this->tableDet, $updateBuybackDet);
        return ($this->db->affected_rows() == 1) ? FALSE : TRUE;
    }
}
