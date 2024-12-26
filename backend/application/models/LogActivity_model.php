<?php defined('BASEPATH') or exit('No direct script access allowed');

class LogActivity_model extends CI_Model
{
    var $table = 'log_activity';

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
        $this->load->helper('file');
    }

    public function saveLog($userID)
    {
        $action = $this->router->fetch_method();
        $module = $this->router->fetch_class();
        // $data = array(
        //     'user_id' => $userID,
        //     'action' => $action,
        //     'module' => $module,
        //     'message' => "Success " . $action . " to " . $module . " by userId " . $userID,
        //     'ip_address' => $this->input->ip_address(),
        //     'time' => date('Y-m-d H:i:s'),
        // );
        // $this->db->insert($this->table, $data);
        write_file(APPPATH . 'logs/log_activity.txt', date('Y-m-d H:i:s') . " -- " . $this->input->ip_address() . " -- Success $action to $module by userId $userID \n", "a+");
    }
}
