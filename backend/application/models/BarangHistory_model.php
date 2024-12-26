<?php defined('BASEPATH') or exit('No direct script access allowed');

class BarangHistory_model extends CI_Model
{
    var $table = 'barang_history';
    var $tablePembelianDet = 'pembelian_detail';
    var $tablePenjualanDet = 'penjualan_detail';
    var $tableBuybackDet = 'beli_kembali_detail';
    var $column_order = array('id', 'date', 'faktur', 'action');
    var $column_search = array('date', 'faktur', 'action');
    var $order = array('id' => 'asc');

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    private function _get_datatables_query($kode, $action)
    {
        $this->db->from($this->table);
        $this->db->where('kode_barang', $kode);
        $this->db->where('faktur !=', '-');
        if ($action != null) {
            $this->db->where('action', $action);
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

    function get_datatables($kode, $action)
    {
        $this->_get_datatables_query($kode, $action);
        if ($_POST['length'] != -1)
            $this->db->limit($_POST['length'], $_POST['start']);
        $query = $this->db->get();
        return $query->result();
    }

    function count_filtered($kode, $action)
    {
        $this->_get_datatables_query($kode, $action);
        $query = $this->db->get();
        return $query->num_rows();
    }

    public function count_all()
    {
        $this->db->from($this->table);
        return $this->db->count_all_results();
    }

    public function add($action, $userID)
    {
        $post = $this->input->post();
        $data = array(
            'id_barang' => htmlspecialchars($post["id_barang"], ENT_QUOTES),
            'kode_barang' => htmlspecialchars($post["kode_barang"], ENT_QUOTES),
            'faktur' => '-',
            'date' => date('Y-m-d H:i:s'),
            'action' => $action,
            'status_proses' => '0',
            'session' => $userID
        );
        $this->db->insert($this->table, $data);
        return ($this->db->affected_rows() != 1) ? FALSE : TRUE;
    }

    public function destroy($id)
    {
        $post = $this->input->post();
        return $this->db->delete($this->table, array('id_barang' => $id, 'status_proses' => 0, 'session' => htmlspecialchars($post["user_id"], ENT_QUOTES)));
    }

    public function changeStatusProses()
    {
        $post = $this->input->post();
        $data = array(
            'faktur' => $this->input->post('faktur', TRUE, NULL),
            'status_proses' => 1,
            'date' => date('Y-m-d H:i:s'),
            'created_at' => date('Y-m-d H:i:s')
        );
        $this->db->where('status_proses', 0)->where('session', htmlspecialchars($post["user_id"], ENT_QUOTES));
        return $this->db->update($this->table, $data);
    }

    public function getPembelianDetail($faktur, $kodeBarang)
    {
        $row = $this->db->select()->where('faktur', $faktur)->where('kode_barang', $kodeBarang)->get($this->tablePembelianDet)->row();
        if ($row != null) {
            return $row;
        } else {
            return null;
        }
    }

    public function getPenjualanDetail($faktur, $kodeBarang)
    {
        $row = $this->db->select()->where('faktur', $faktur)->where('kode_barang', $kodeBarang)->get($this->tablePenjualanDet)->row();
        if ($row != null) {
            return $row;
        } else {
            return null;
        }
    }

    public function getBuybackDetail($faktur, $kodeBarang)
    {
        $row = $this->db->select()->where('faktur', $faktur)->where('kode_barang', $kodeBarang)->get($this->tableBuybackDet)->row();
        if ($row != null) {
            return $row;
        } else {
            return null;
        }
    }
}
