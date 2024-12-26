<?php defined('BASEPATH') or exit('No direct script access allowed');
class Otentikasi_model extends CI_Model{	
	function cek_login($table,$where){		
		return $this->db->get_where($table,$where);
	}	

	public function get($username){
        $this->db->where('username', $username);
        $result = $this->db->get('user')->row();
        return $result;
    }

    public function update_last_login($username)
    {
        $data = array(
            'last_login' => date('Y-m-d H:i:s')
        );
        $this->db->where('username', $username);
        $this->db->update('user', $data);
        return ($this->db->affected_rows() != 1) ? FALSE : TRUE;
    }
}