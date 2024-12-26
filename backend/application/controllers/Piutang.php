<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Piutang extends CI_Controller
{
    public $userID;
    public function __construct()
    {
        parent::__construct();
        if ($this->session->userdata('status') != "MASUK") {
            redirect(base_url("otentikasi"));
        }
        $this->load->model("Piutang_model");
        $this->load->library('form_validation');
        $this->load->library('datatables');
        $this->load->model("LogActivity_model");
        $this->load->helper('data_helper');
        $this->load->helper("rupiah_helper");
        $this->load->helper("tgl_indo_helper");
        $this->userID = $this->session->userdata('userID');
        $this->PiutangModel = $this->Piutang_model;
    }

    function getPiutang()
    {
        error_reporting(0);
        $status = htmlspecialchars($this->input->get("status"), ENT_QUOTES);
        if ($status == 1) {
            $col = 'piutang_sisa';
            $val = 0;
        } elseif ($status == 2) {
            $col = 'piutang_sisa > ';
            $val = 0;
        } elseif ($status == 3) {
            $col = 'piutang_dibayar';
            $val = 0;
        } else {
            $col = 'piutang > ';
            $val = 0;
        }
        $list = $this->PiutangModel->get_datatables($col, $val);
        $data = array();
        foreach ($list as $field) {
            $row = array();
            $row[] = $field->id;
            $row[] = shortdate_indo($field->created_at);
            $row[] = $field->faktur_jual;
            $row[] = rupiah($field->piutang);
            $row[] = rupiah($field->piutang_dibayar);
            $row[] = rupiah($field->piutang_sisa);
            $row[] = shortdate_indo($field->tempo);
            $row[] = getPelangganID($field->pelanggan_id, 'nama_pelanggan');
            $row[] = getUserID($field->user_id, 'nama_user');

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->PiutangModel->count_all(),
            "recordsFiltered" => $this->PiutangModel->count_filtered($col, $val),
            "data" => $data,
        );
        echo json_encode($output);
    }

    function getPiutangRow()
    {
        error_reporting(0);
        $fakturJual = $this->input->post('faktur_jual');
        $list = $this->PiutangModel->getPiutangRow($fakturJual);
        $output = array(
            "created_at" => shortdate_indo($list->created_at),
            "faktur_jual" => $list->faktur_jual,
            "piutang" => rupiah($list->piutang),
            "piutang_dibayar" => rupiah($list->piutang_dibayar),
            "piutang_sisa" => rupiah($list->piutang_sisa),
            "tempo" => $list->tempo,
            "pelanggan_id" => getPelangganID($list->pelanggan_id, 'nama_pelanggan'),
        );
        echo json_encode($output);
    }

    public function store()
    {
        $validation = $this->form_validation;
        $validation->set_rules($this->PiutangModel->rules());
        $userID = $this->userID;

        if ($validation->run()) {
            echo json_encode($this->PiutangModel->addTransactions($userID));
            $this->LogActivity_model->saveLog($this->userID);
        }
    }
}
