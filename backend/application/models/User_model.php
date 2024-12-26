<?php defined('BASEPATH') or exit('No direct script access allowed');

class User_model extends CI_Model
{
    var $table = 'user';
    var $column_order = array('id', 'nama_user', 'username', 'level', 'alamat', 'no_hp', 'last_login');
    var $column_search = array('id', 'nama_user', 'username', 'no_hp');
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
                'field' => 'nama_user',
                'label' => 'Nama user',
                'rules' => 'required'
            ]
        ];
    }

    public function rulesChangePassword()
    {
        return [
            [
                'field' => 'nama_user',
                'label' => 'Nama user',
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
            'nama_user' => htmlspecialchars($post["nama_user"], ENT_QUOTES),
            'username' => strtolower(htmlspecialchars($post["username"], ENT_QUOTES)),
            'password' => $post["password"],
            'level' => htmlspecialchars($post["level"], ENT_QUOTES),
            'alamat' => htmlspecialchars($post["alamat"], ENT_QUOTES),
            'no_hp' => htmlspecialchars($post["no_hp"], ENT_QUOTES),
            'created_at' => date('Y-m-d H:i:s')
        );
        $this->db->insert($this->table, $data);
        return ($this->db->affected_rows() != 1) ? FALSE : TRUE;
    }

    public function save()
    {
        $post = $this->input->post();
        $data = array(
            'nama_user' => htmlspecialchars($post["nama_user"], ENT_QUOTES),
            'username' => strtolower(htmlspecialchars($post["username"], ENT_QUOTES)),
            'level' => htmlspecialchars($post["level"], ENT_QUOTES),
            'alamat' => htmlspecialchars($post["alamat"], ENT_QUOTES),
            'no_hp' => htmlspecialchars($post["no_hp"], ENT_QUOTES),
            'updated_at' => date('Y-m-d H:i:s')
        );
        $this->db->where('id', $post['user_id']);
        $this->db->update($this->table, $data);
        return ($this->db->affected_rows() != 1) ? FALSE : TRUE;
    }

    public function delete($id)
    {
        return $this->db->delete($this->table, array("id" => $id));
    }

    public function checkOldPassword($oldPass)
    {
        $this->db->from($this->table);
        $this->db->where('password', $oldPass);
        return $this->db->count_all_results();
    }

    public function change_password()
    {
        $post = $this->input->post();
        $data = array(
            'password' => $post["new_password"],
            'updated_at' => date('Y-m-d H:i:s')
        );
        $this->db->where('id', $post['user_id_pass']);
        $this->db->update($this->table, $data);
        return ($this->db->affected_rows() != 1) ? FALSE : TRUE;
    }
}
