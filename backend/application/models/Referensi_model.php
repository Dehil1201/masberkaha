<?php defined('BASEPATH') or exit('No direct script access allowed');

class Referensi_model extends CI_Model
{
    var $table = 'referensi';
    var $column_order = array('id', 'kode_referensi', 'nama_referensi','tipe');
    var $column_search = array('id', 'kode_referensi', 'nama_referensi');
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
                'field' => 'kode_referensi',
                'label' => 'Kode Referensi',
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
            'kode_referensi' => htmlspecialchars($post["kode_referensi"], ENT_QUOTES),
            'nama_referensi' => htmlspecialchars($post["nama_referensi"], ENT_QUOTES)
            
        ); 
        $this->db->insert($this->table, $data);
        return ($this->db->affected_rows() != 1) ? FALSE : TRUE;
    }

    public function save()
    {
        $post = $this->input->post();
        $data = array(
            'kode_referensi' => $post["kode_referensi"],
            'nama_referensi' => $post["nama_referensi"]
        );
        $this->db->where('id', $post['referensi_id']);
        $this->db->update($this->table, $data);
        return TRUE;
    }

    public function get_all_data()
    {
        $data= $this->db->query(" SELECT * from kode_referensi ")->result(); 
        return $data;
    }

    public function delete($id)
    {
        return $this->db->delete($this->table, array("id" => $id));
    }
}
