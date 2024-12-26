<?php defined('BASEPATH') or exit('No direct script access allowed');

class Pelanggan_model extends CI_Model
{
    var $table = 'pelanggan';
    var $column_order = array('id', 'kode_pelanggan', 'nama_pelanggan', 'alamat', 'kota', 'no_hp', 'email','point');
    var $column_search = array('kode_pelanggan', 'nama_pelanggan', 'kota', 'email');
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
                'field' => 'nama_pelanggan',
                'label' => 'Nama Pelanggan',
                'rules' => 'required'
            ]
        ];
    }

    private function _get_datatables_query()
    {
        $this->db->from($this->table);
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

    public function count_all()
    {
        $this->db->from($this->table);
        return $this->db->count_all_results();
    }

    public function add()
    {
        $post = $this->input->post();
        $data = array(
            'kode_pelanggan' => htmlspecialchars($post["kode_pelanggan"], ENT_QUOTES),
            'nama_pelanggan' => $this->input->post('nama_pelanggan', TRUE, NULL),
            'alamat' => $this->input->post('alamat', TRUE, NULL),
            'kota' => $this->input->post('kota', TRUE, NULL),
            'no_hp' => $this->input->post('no_hp', TRUE, NULL),
            'email' => $this->input->post('email', TRUE, NULL),
            'point' => 0,
            'created_at' => date('Y-m-d H:i:s')
        );
        $this->db->insert($this->table, $data);
        return ($this->db->affected_rows() != 1) ? FALSE : TRUE;
    }

    public function save()
    {
        $post = $this->input->post();
        $data = array(
            'kode_pelanggan' => htmlspecialchars($post["kode_pelanggan"], ENT_QUOTES),
            'nama_pelanggan' => htmlspecialchars($post["nama_pelanggan"], ENT_QUOTES),
            'alamat' => htmlspecialchars($post["alamat"], ENT_QUOTES),
            'kota' => htmlspecialchars($post["kota"], ENT_QUOTES),
            'no_hp' => htmlspecialchars($post["no_hp"], ENT_QUOTES),
            'email' => htmlspecialchars($post["email"], ENT_QUOTES),
            'point' => htmlspecialchars($post["point"], ENT_QUOTES),
            'updated_at' => date('Y-m-d H:i:s')
        );
        $this->db->where('id', $post['pelanggan_id']);
        $this->db->update($this->table, $data);
        return ($this->db->affected_rows() != 1) ? FALSE : TRUE;
    }

    public function delete($id)
    {
        return $this->db->delete($this->table, array("id" => $id));
    }
}
