<?php defined('BASEPATH') or exit('No direct script access allowed');

class Laporan_model extends CI_Model
{
    var $tableFaktur = 'faktur';
    var $tableSaldo = 'saldo';
    var $tableBarang = 'data_barang';
    var $tablePenjualanDet = 'penjualan_detail';
    var $tableBuybackDet = 'beli_kembali_detail';
    var $tableHistory = 'barang_history';
    var $column_order = array('id', 'date', 'faktur', 'referensi');
    var $column_search = array('faktur', 'keterangan', 'referensi');
    var $column_order_barang = array('id', 'kode_barang', 'nama_barang', 'jenis_barang', 'berat', 'status', 'harga_beli', 'harga_jual');
    var $column_search_barang = array('kode_barang', 'nama_barang', 'jenis_barang');
    var $column_order_history = array('barang_history.id', 'barang_history.kode_barang', 'data_barang.nama_barang', 'data_barang.jenis_barang', 'data_barang.berat', 'data_barang.status', '', 'total_beli');
    var $column_search_history = array('barang_history.kode_barang');
    var $order = array('id' => 'asc');
    var $order_history = array('barang_history.id' => 'desc');

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
                'label' => 'Faktur Kas',
                'rules' => 'required'
            ]
        ];
    }

    private function _get_datatables_query_filter($col, $val, $startDate, $endDate, $source, $jenis)
    {
        $this->db->from($this->tableFaktur);
        $this->db->where($col, $val);
        if ($source != NULL) {
            $this->db->where('source', $source);
        }
        if ($jenis != NULL) {
            $this->db->where('mode', $jenis);
        }
        if ($startDate != NULL) {
            $this->db->where('date>=', $startDate)->where('date<=', $endDate);
        }
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

    function get_datatables_filter($col, $val, $startDate, $endDate, $source, $jenis)
    {
        $this->_get_datatables_query_filter($col, $val, $startDate, $endDate, $source, $jenis);
        if ($_POST['length'] != -1)
            $this->db->limit($_POST['length'], $_POST['start']);
        $query = $this->db->get();
        return $query->result();
    }

    function count_filtered_filter($col, $val, $startDate, $endDate, $source, $jenis)
    {
        $this->_get_datatables_query_filter($col, $val, $startDate, $endDate, $source, $jenis);
        $query = $this->db->get();
        return $query->num_rows();
    }

    public function count_all()
    {
        $this->db->from($this->tableBarang);
        return $this->db->count_all_results();
    }

    // Get Barang Filter
    private function _get_datatables_query_barang($status, $startDate, $endDate)
    {
        $listJenis = getWhere('jenis_barang', 'penjualan_satuan', 0);
        $listJenisBarang = array();
        foreach ($listJenis as $field) {
            $listJenisBarang[] = $field->jenis_barang;
        }
        $this->db->where_in('jenis_barang', $listJenisBarang);
        $this->db->from($this->tableBarang);
        if ($status != NULL) {
            $this->db->where('status', $status);
        }
        // else {
        //     $status = array('S', 'R');
        //     $this->db->where_not_in('status', $status);
        // }
        if ($startDate != NULL && $status == '0') {
            $this->db->where('substr(created_at,1, 10)>=', $startDate)->where('substr(created_at,1, 10)<=', $endDate);
        } else if ($startDate != NULL && $status == 'J') {
            $this->db->where('substr(tanggal_jual,1, 10)>=', $startDate)->where('substr(tanggal_jual,1, 10)<=', $endDate);
        } else if ($startDate != NULL && $status == '1') {
            $this->db->where('substr(tanggal_terima,1, 10)>=', $startDate)->where('substr(tanggal_terima,1, 10)<=', $endDate);
        } else if ($startDate != NULL && $status == 'S') {
            $this->db->where('substr(tanggal_terima,1, 10)>=', $startDate)->where('substr(tanggal_terima,1, 10)<=', $endDate);
        } else if ($startDate != NULL && $status == 'R') {
            $this->db->where('substr(tanggal_terima,1, 10)>=', $startDate)->where('substr(tanggal_terima,1, 10)<=', $endDate);
        } else if ($startDate != NULL  && $status == NULL) {
            $this->db->where('substr(updated_at,1, 10)>=', $startDate)->where('substr(updated_at,1, 10)<=', $endDate);
        }
        $i = 0;
        foreach ($this->column_search_barang as $item) // looping awal
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
                if (count($this->column_search_barang) - 1 == $i)
                    $this->db->group_end();
            }
            $i++;
        }

        if (isset($_POST['order'])) {
            $this->db->order_by($this->column_order_barang[$_POST['order']['0']['column']], $_POST['order']['0']['dir']);
        } else if (isset($this->order)) {
            $order = $this->order;
            $this->db->order_by(key($order), $order[key($order)]);
        }
    }

    function get_datatables_barang($status, $startDate, $endDate)
    {
        $this->_get_datatables_query_barang($status, $startDate, $endDate);
        if ($_POST['length'] != -1)
            $this->db->limit($_POST['length'], $_POST['start']);
        $query = $this->db->get();
        return $query->result();
    }

    function count_filtered_barang($status, $startDate, $endDate)
    {
        $this->_get_datatables_query_barang($status, $startDate, $endDate);
        $query = $this->db->get();
        return $query->num_rows();
    }

    public function count_all_barang()
    {
        $this->db->from($this->tableBarang);
        return $this->db->count_all_results();
    }

    public function countWhereBarang($table, $col, $val, $startDate, $endDate, $valStatus)
    {
        $listJenis = getWhere('jenis_barang', 'penjualan_satuan', 0);
        $listJenisBarang = array();
        foreach ($listJenis as $field) {
            $listJenisBarang[] = $field->jenis_barang;
        }
        $this->db->from($table);
        if ($val != NULL) {
            $this->db->where($col, $val);
        } else {
            $status = array('J', 'S', 'R');
            $this->db->where_not_in('status', $status);
            $this->db->where_in('jenis_barang', $listJenisBarang);
        }
        if ($startDate != NULL && $valStatus == '0') {
            $this->db->where('substr(created_at,1, 10)>=', $startDate)->where('substr(created_at,1, 10)<=', $endDate);
        } else if ($startDate != NULL && $valStatus == 'J') {
            $this->db->where('substr(tanggal_jual,1, 10)>=', $startDate)->where('substr(tanggal_jual,1, 10)<=', $endDate);
        } else if ($startDate != NULL && $valStatus == '1') {
            $this->db->where('substr(tanggal_terima,1, 10)>=', $startDate)->where('substr(tanggal_terima,1, 10)<=', $endDate);
        } else if ($startDate != NULL && $valStatus == 'S') {
            $this->db->where('substr(tanggal_terima,1, 10)>=', $startDate)->where('substr(tanggal_terima,1, 10)<=', $endDate);
        } else if ($startDate != NULL && $valStatus == 'R') {
            $this->db->where('substr(tanggal_terima,1, 10)>=', $startDate)->where('substr(tanggal_terima,1, 10)<=', $endDate);
        } else if ($startDate != NULL  && $valStatus == NULL) {
            $this->db->where('substr(updated_at,1, 10)>=', $startDate)->where('substr(updated_at,1, 10)<=', $endDate);
        }
        return $this->db->count_all_results();
    }

    public function sumWhere($table, $colSum, $col, $val, $startDate, $endDate, $valStatus)
    {
        $listJenis = getWhere('jenis_barang', 'penjualan_satuan', 0);
        $listJenisBarang = array();
        foreach ($listJenis as $field) {
            $listJenisBarang[] = $field->jenis_barang;
        }
        $this->db->select_sum($colSum);
        if ($val != NULL) {
            $this->db->where($col, $val);
        } else {
            $status = array('J', 'S', 'R');
            $this->db->where_not_in('status', $status);
            $this->db->where_in('jenis_barang', $listJenisBarang);
        }
        if ($startDate != NULL && $valStatus == '0') {
            $this->db->where('substr(created_at,1, 10)>=', $startDate)->where('substr(created_at,1, 10)<=', $endDate);
        } else if ($startDate != NULL && $valStatus == 'J') {
            $this->db->where('substr(tanggal_jual,1, 10)>=', $startDate)->where('substr(tanggal_jual,1, 10)<=', $endDate);
        } else if ($startDate != NULL && $valStatus == '1') {
            $this->db->where('substr(tanggal_terima,1, 10)>=', $startDate)->where('substr(tanggal_terima,1, 10)<=', $endDate);
        } else if ($startDate != NULL  && $valStatus == NULL) {
            $this->db->where('substr(updated_at,1, 10)>=', $startDate)->where('substr(updated_at,1, 10)<=', $endDate);
        }
        return $this->db->get($table)->row()->$colSum;
    }

    // Get History Filter
    private function _get_datatables_query_history($action, $startDate, $endDate, $user, $pelsup, $devisi, $status)
    {
        $this->db->select('*');
        $this->db->select('(harga_beli * berat) as total_beli');
        $this->db->from($this->tableHistory);
        $this->db->join($this->tableBarang, "$this->tableBarang.kode_barang = $this->tableHistory.kode_barang");
        $this->db->where('action', $action);
        $this->db->where('status_proses', 1);
        if ($user != "") {
            $this->db->where('session', $user);
        }
        if ($pelsup != "") {
            $this->db->where('pelanggan_supplier_id', $pelsup);
        }
        if ($devisi != "") {
            $this->db->where('kode_jenis', $devisi);
        }
        if ($status != NULL) {
            if ($status == 'nol') {
                $this->db->where('status', 0);
            } else {
                $this->db->where('status', $status);
            }
        }
        if ($startDate != NULL) {
            $this->db->where('date>=', $startDate)->where('date<=', $endDate);
        }
        $i = 0;
        foreach ($this->column_search_history as $item) // looping awal
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
                if (count($this->column_search_history) - 1 == $i)
                    $this->db->group_end();
            }
            $i++;
        }

        if (isset($_POST['order'])) {
            $this->db->order_by($this->column_order_history[$_POST['order']['0']['column']], $_POST['order']['0']['dir']);
        } else if (isset($this->order_history)) {
            $order = $this->order_history;
            $this->db->order_by(key($order), $order[key($order)]);
        }
    }

    function get_datatables_history($action, $startDate, $endDate, $user, $pelsup, $devisi, $status)
    {
        $this->_get_datatables_query_history($action, $startDate, $endDate, $user, $pelsup, $devisi, $status);
        if ($_POST['length'] != -1)
            $this->db->limit($_POST['length'], $_POST['start']);
        $this->db->group_by("$this->tableHistory.kode_barang");
        $query = $this->db->get();
        return $query->result();
    }

    function count_filtered_history($action, $startDate, $endDate, $user, $pelsup, $devisi, $status)
    {
        $this->_get_datatables_query_history($action, $startDate, $endDate, $user, $pelsup, $devisi, $status);
        $this->db->group_by("$this->tableHistory.kode_barang");
        $query = $this->db->get();
        return $query->num_rows();
    }

    public function count_all_history()
    {
        $this->db->from($this->tableHistory);
        return $this->db->count_all_results();
    }

    public function sumDataLaporan($table, $col, $startDate, $endDate, $valDate)
    {
        $this->db->select_sum($col);
        $this->db->where($valDate . '>=', $startDate)->where($valDate . '<=', $endDate);
        return $this->db->get($table)->row()->$col;
    }

    public function sumAsetBarang($table, $col)
    {
        $listJenis = getWhere('jenis_barang', 'penjualan_satuan', 0);
        $listJenisBarang = array();
        foreach ($listJenis as $field) {
            $listJenisBarang[] = $field->jenis_barang;
        }
        $this->db->select_sum($col);
        $status = array('J', 'S', 'R');
        $this->db->where_in('jenis_barang', $listJenisBarang);
        $this->db->where_not_in('status', $status);
        return $this->db->get($table)->row()->$col;
    }

    public function getSourceKas()
    {
        $this->db->distinct();
        $this->db->select('source');
        $this->db->where('source IS NOT NULL', NULL);
        return $this->db->get($this->tableFaktur)->result();
    }

    public function add()
    {
        $pemasukan = $this->input->post('pemasukan', TRUE, 0);
        $pengeluaran = $this->input->post('pengeluaran', TRUE, 0);
        $grandTotal = ($pemasukan != 0) ? $pemasukan : $pengeluaran;
        $data = array(
            'faktur' => $this->input->post('faktur', TRUE, NULL),
            'date' => $this->input->post('date', TRUE, date('Y-m-d')),
            'pemasukan' => $pemasukan,
            'pengeluaran' => $pengeluaran,
            'grand_total' => $grandTotal,
            'source' => $this->input->post('source', TRUE, NULL),
            'mode' => $this->input->post('mode', TRUE, NULL),
            'referensi' => $this->input->post('referensi', TRUE, 'KAS'),
            'keterangan' => $this->input->post('keterangan', TRUE, NULL),
            'created_at' => date('Y-m-d H:i:s')
        );
        $this->db->insert($this->tableFaktur, $data);
        return ($this->db->affected_rows() != 1) ? FALSE : TRUE;
    }

    public function save()
    {
        $pemasukan = $this->input->post('pemasukan', TRUE, 0);
        $pengeluaran = $this->input->post('pengeluaran', TRUE, 0);
        $grandTotal = ($pemasukan != 0) ? $pemasukan : $pengeluaran;
        $data = array(
            'date' => $this->input->post('date', TRUE, date('Y-m-d')),
            'pemasukan' => $pemasukan,
            'pengeluaran' => $pengeluaran,
            'grand_total' => $grandTotal,
            'source' => $this->input->post('source', TRUE, NULL),
            'mode' => $this->input->post('mode', TRUE, NULL),
            'keterangan' => $this->input->post('keterangan', TRUE, NULL),
            'created_at' => date('Y-m-d H:i:s')
        );
        $this->db->where('faktur', $pemasukan = $this->input->post('faktur', TRUE, 0));
        $this->db->update($this->tableFaktur, $data);
        return ($this->db->affected_rows() != 1) ? FALSE : TRUE;
    }

    public function delete($id)
    {
        return $this->db->delete($this->tableFaktur, array("id" => $id));
    }

    public function deleteFaktur($id)
    {
        return $this->db->delete($this->tableFaktur, array("faktur" => $id));
    }

    public function getDaftarRekening($jenis)
    {
        $this->db->from($this->tableSaldo)->where('jenis', $jenis);
        $query = $this->db->get();
        return $query->result();
    }

    public function getSaldoByDate($jenis, $startDate = null, $endDate = null)
    {
        $noRekeningSaldo = $this->db->where('jenis', $jenis)->get('saldo')->result();
        $dataRekening = array();
        $startDate = date('Y-m-d', strtotime($startDate . ' -1 day'));
        $addQuery = "";
        if ($startDate != NULL) {
            $addQuery = "AND date >= '$startDate' AND date <= '$endDate'";
        }
        foreach ($noRekeningSaldo as $data) {
            $row = array();
            $saldo_now = $this->db->query("SELECT SUM(pemasukan - pengeluaran) AS total FROM faktur WHERE source = '$data->no_rekening' $addQuery")->row();
            $should_saldo = ($saldo_now->total == null) ? 0 : (($data->jenis != "AKTIVA TETAP") ? $saldo_now->total : 0);
            $rekening = $this->db->query("SELECT * FROM saldo WHERE no_rekening = '$data->no_rekening' ")->row();
            $row['no_rekening'] = $rekening->no_rekening;
            $row['an'] = $rekening->an;
            $row['saldo'] = $should_saldo;
            $dataRekening[] = $row;
        }

        return $dataRekening;
    }

    public function getPenjualanDetail($kodeBarang)
    {
        $row = $this->db->select()->where('kode_barang', $kodeBarang)->order_by('updated_at', 'desc')->get($this->tablePenjualanDet)->row();
        if ($row != null) {
            return $row;
        } else {
            return null;
        }
    }

    public function getBuybackDetail($kodeBarang)
    {
        $row = $this->db->select()->where('kode_barang', $kodeBarang)->order_by('date', 'desc')->order_by('id', 'desc')->get($this->tableBuybackDet)->row();
        if ($row != null) {
            return $row;
        } else {
            return null;
        }
    }

    public function getFaktur($kodeBarang)
    {
        $row = $this->db->select()->where('kode_barang', $kodeBarang)->order_by('date', 'desc')->get($this->tableHistory)->row();
        if ($row != null) {
            return $row;
        } else {
            return null;
        }
    }

    public function getDateHistory($action, $kodeBarang, $getCol)
    {
        $row = $this->db->select()->where('action', $action)->where('kode_barang', $kodeBarang)->order_by('date', 'desc')->get($this->tableHistory)->row();
        if ($row != null) {
            return $row->$getCol;
        } else {
            return null;
        }
    }

    public function queryManualPerbarang($action, $isQuery, $startDate, $endDate, $user = null, $pelsup = null, $devisi = null, $status = null)
    {
        $addQuery = "";
        if ($user != "") {
            $addQuery .= "AND session = '$user'";
        }
        if ($pelsup != "") {
            $addQuery .= "AND pelanggan_supplier_id = '$pelsup'";
        }
        if ($devisi != "") {
            $addQuery .= "AND kode_jenis = '$devisi'";
        }
        if ($status != NULL) {
            if ($status == 'nol') {
                $addQuery .= "AND data_barang.status = '0'";
            } else {
                $addQuery .= "AND data_barang.status = '$status'";
            }
        }
        if ($startDate != NULL) {
            $addQuery .= "AND date >= '$startDate' AND date <= '$endDate'";
        }
        $query = $this->db->query("SELECT $isQuery AS result FROM barang_history INNER JOIN data_barang ON data_barang.kode_barang = barang_history.kode_barang WHERE ACTION = '$action' $addQuery GROUP BY barang_history.kode_barang");
        return $query->result();
    }

    public function sumWhereBuyback($table, $colSum, $col, $id, $startDate = null, $endDate = null, $varDate = null, $user = null, $pelanggan = null, $devisi = null, $status = null)
    {
        $this->db->select_sum($colSum);
        $this->db->where($col, $id);
        if ($user != "") {
            $this->db->where('session', $user);
        }
        if ($pelanggan != "") {
            $this->db->where('pelanggan_id', $pelanggan);
        }
        if ($devisi != "") {
            $this->db->like('kode_barang', $devisi);
        }
        if ($status != "") {
            $this->db->where('status', $status);
        }
        if ($startDate != NULL) {
            $this->db->where("$varDate>=", $startDate)->where("$varDate<=", $endDate);
        }
        return $this->db->get($table)->row()->$colSum;
    }

    public function sumWhereHistory($colSum, $action, $startDate, $endDate, $user, $pelsup, $devisi)
    {
        $this->db->select('(harga_beli * berat) as total_beli');
        $this->db->select_sum($colSum);
        $this->db->from($this->tableHistory);
        $this->db->join($this->tableBarang, "$this->tableBarang.kode_barang = $this->tableHistory.kode_barang");
        $this->db->where('action', $action);
        if ($user != "") {
            $this->db->where('session', $user);
        }
        if ($pelsup != "") {
            $this->db->where('pelanggan_supplier_id', $pelsup);
        }
        if ($devisi != "") {
            $this->db->where('kode_jenis', $devisi);
        }
        if ($startDate != NULL) {
            $this->db->where('date>=', $startDate)->where('date<=', $endDate);
        }
        return $this->db->get()->row()->$colSum;
    }

    public function sumData($colSum, $col, $val, $startDate, $endDate, $source, $jenis)
    {
        $this->db->select_sum($colSum);
        $this->db->where($col, $val);
        if ($source != NULL) {
            $this->db->where('source', $source);
        }
        if ($jenis != NULL) {
            $this->db->where('mode', $jenis);
        }
        if ($startDate != NULL) {
            $this->db->where('date>=', $startDate)->where('date<=', $endDate);
        }
        return $this->db->get($this->tableFaktur)->row()->$colSum;
    }
}
