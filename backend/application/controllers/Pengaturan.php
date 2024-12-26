<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Pengaturan extends CI_Controller
{
    public $userID;
    public function __construct()
    {
        parent::__construct();
        if ($this->session->userdata('status') != "MASUK") {
            redirect(base_url("otentikasi"));
        }
        $this->load->model("Pengaturan_model");
        $this->load->library('form_validation');
        $this->load->library('datatables');
        $this->load->model("LogActivity_model");
        $this->userID = $this->session->userdata('userID');
    }

    function getAllPengaturan()
    {
        $list = $this->Pengaturan_model->getAllPengaturan();
        echo json_encode($list);
    }

    function displayDashboard()
    {
        $dashboard = $this->Pengaturan_model->getDashboard('total_barang');
        if ($dashboard === 1) {
            echo '';
        } else {
            echo " style='display:none' ";
        }
    }

    public function update()
    {
        $pengaturan = $this->Pengaturan_model;
        $check = $this->db->get("pengaturan")->num_rows();

        if ($check > 0) {
            echo json_encode($pengaturan->save());
            $this->LogActivity_model->saveLog($this->userID);
        } else {
            echo json_encode($pengaturan->add());
            $this->LogActivity_model->saveLog($this->userID);
        }
    }

    public function update_toko()
    {
        $pengaturan = $this->Pengaturan_model;
        $check = $this->db->get("pengaturan")->num_rows();

        if ($check > 0) {
            echo json_encode($pengaturan->save_toko());
            $this->LogActivity_model->saveLog($this->userID);
        } else {
            echo json_encode($pengaturan->add_toko());
            $this->LogActivity_model->saveLog($this->userID);
        }
    }

    public function updateHarga()
    {
        $val = '';
        $status = $this->input->post('status', TRUE, 0);
        if ($status == 1) {
            $val = '+';
        } elseif ($status == 2) {
            $val = '-';
        }
        echo json_encode($this->Pengaturan_model->updateHarga($val));
        $this->LogActivity_model->saveLog($this->userID);
    }

    public function updateHargaPasar()
    {
        echo json_encode($this->Pengaturan_model->updateHargaPasar());
        $this->LogActivity_model->saveLog($this->userID);
    }

    public function backupDatabase()
    {
        $this->load->dbutil();
        $this->load->helper('file');

        $config = array(
            'format'    => 'zip',
            'filename'    => 'Database_Asih.sql'
        );

        $backup = $this->dbutil->backup($config);

        $db_name = 'sidamas.backup-on-' . date("Y-m-d-H-i-s") . '.zip';
        // $save = FCPATH . 'uploads/' . $db_name;
        // write_file($save, $backup);
        $this->Pengaturan_model->backupDb();
        $this->load->helper('download');
        force_download($db_name, $backup);
    }

    public function backupDatabaseSqlite()
    {
        echo json_encode($this->Pengaturan_model->backupDb());
    }

    public function restoreDatabaseSqlite()
    {
        echo json_encode($this->Pengaturan_model->restoreDb());
    }

    public function emptyTable()
    {
        $table = $this->input->post('table', TRUE, null);
        if ($table === 'delete_all') {
            echo json_encode($this->Pengaturan_model->emptyAllTable());
        } else if ($table === 'delete_transaction') {
            echo json_encode($this->Pengaturan_model->emptyTransactionTable());
        } else if ($table === 'empty_price') {
            echo json_encode($this->Pengaturan_model->emptyPrice());
        } else {
            echo json_encode($this->Pengaturan_model->emptyTable($table));
        }
        $this->LogActivity_model->saveLog($this->userID);
    }
}
