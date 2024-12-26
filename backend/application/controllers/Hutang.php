<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Hutang extends CI_Controller
{
    public $userID;
    public function __construct()
    {
        parent::__construct();
        if ($this->session->userdata('status') != "MASUK") {
            redirect(base_url("otentikasi"));
        }
        $this->load->model("Hutang_model");
        $this->load->library('form_validation');
        $this->load->library('datatables');
        $this->load->model("LogActivity_model");
        $this->load->helper('data_helper');
        $this->load->helper("rupiah_helper");
        $this->load->helper("tgl_indo_helper");
        $this->userID = $this->session->userdata('userID');
        $this->HutangModel = $this->Hutang_model;
    }

    function getHutang()
    {
        error_reporting(0);
        $status = htmlspecialchars($this->input->get("status"), ENT_QUOTES);
        if ($status == 1) {
            $col = 'hutang_sisa';
            $val = 0;
        } elseif ($status == 2) {
            $col = 'hutang_sisa > ';
            $val = 0;
        } elseif ($status == 3) {
            $col = 'hutang_dibayar';
            $val = 0;
        } else {
            $col = 'hutang > ';
            $val = 0;
        }
        $list = $this->HutangModel->get_datatables($col, $val);
        $data = array();
        foreach ($list as $field) {
            $row = array();
            $row[] = $field->id;
            $row[] = shortdate_indo($field->created_at);
            $row[] = $field->faktur_beli;
            $row[] = rupiah($field->hutang);
            $row[] = rupiah($field->hutang_dibayar);
            $row[] = rupiah($field->hutang_sisa);
            $row[] = shortdate_indo($field->tempo);
            $row[] = getSupplierID($field->supplier_id, 'nama_supplier');
            $row[] = getUserID($field->user_id, 'nama_user');

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->HutangModel->count_all(),
            "recordsFiltered" => $this->HutangModel->count_filtered($col, $val),
            "data" => $data,
        );
        echo json_encode($output);
    }

    function getHutangRow()
    {
        $fakturBeli = $this->input->post('faktur_beli');
        $list = $this->HutangModel->getHutangRow($fakturBeli);
        $output = array(
            "created_at" => shortdate_indo($list->created_at),
            "faktur_beli" => $list->faktur_beli,
            "hutang" => rupiah($list->hutang),
            "hutang_dibayar" => rupiah($list->hutang_dibayar),
            "hutang_sisa" => rupiah($list->hutang_sisa),
            "tempo" => $list->tempo,
            "supplier_id" => ($list->supplier_id !== NULL) ? getSupplierID($list->supplier_id, 'nama_supplier') : '-',
        );
        echo json_encode($output);
    }

    public function store()
    {
        $validation = $this->form_validation;
        $validation->set_rules($this->HutangModel->rules());
        $userID = $this->userID;

        if ($validation->run()) {
            echo json_encode($this->HutangModel->addTransactions($userID));
            $this->LogActivity_model->saveLog($this->userID);
        }
    }
}
