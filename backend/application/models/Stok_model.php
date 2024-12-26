<?php defined('BASEPATH') or exit('No direct script access allowed');

class Stok_model extends CI_Model
{
    var $tableHead = 'beli_kembali';
    var $tableDet = 'beli_kembali_detail';
    var $tablePenjualan = 'penjualan';
    var $tablePenjualanDet = 'penjualan_detail';
    var $tableFaktur = 'faktur';
    var $tableBarang = 'data_barang';
    var $tablePiutang = 'piutang';
    var $tableBarangHistory = 'barang_history';
    var $column_order = array('id', 'faktur', 'grand_total', 'user_id', 'status_bayar');
    var $column_search = array('id', 'kode_barang', 'nama_barang', 'jenis_barang');
    var $order = array('id' => 'asc');

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    // Get Table Barang Status Check
    private function _get_datatables_query_filter($col, $val)
    {
        $status = array('J', 'S', 'R');
        $this->db->from($this->tableBarang);
        $this->db->where($col, $val)->where_not_in('status', $status);
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

    function get_datatables_filter($col, $val)
    {
        $this->_get_datatables_query_filter($col, $val);
        if ($_POST['length'] != -1)
            $this->db->limit($_POST['length'], $_POST['start']);
        $query = $this->db->get();
        return $query->result();
    }

    function count_filtered_filter($col, $val)
    {
        $this->_get_datatables_query_filter($col, $val);
        $query = $this->db->get();
        return $query->num_rows();
    }

    public function count_all()
    {
        $this->db->from($this->tableBarang);
        return $this->db->count_all_results();
    }

    public function checkDataBarang()
    {
        $this->db->from($this->tableBarang);
        $this->db->where('kode_barang', $this->input->post('kode_barang', TRUE, NULL));
        return $this->db->count_all_results();
    }

    public function checkStatusCheckBarang()
    {
        $this->db->from($this->tableBarang);
        $this->db->where('kode_barang', $this->input->post('kode_barang', TRUE, NULL))->where('status_check', 1);
        return $this->db->count_all_results();
    }

    public function changeStatusCheck()
    {
        $data = array(
            'status_check' => 1,
            'last_check' => date('Y-m-d'),
        );
        $this->db->where('kode_barang', htmlspecialchars($this->input->post('kode_barang')));
        $this->db->update($this->tableBarang, $data);
        return ($this->db->affected_rows() == 1) ? TRUE : FALSE;
    }

    public function setDefaultCheck()
    {
        $this->db->update($this->tableBarang, ['status_check' => 0]);
        return ($this->db->affected_rows() >= 1) ? TRUE : FALSE;
    }
}
