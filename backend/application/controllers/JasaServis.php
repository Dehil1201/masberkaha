<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Jasaservis extends CI_Controller
{
    public $userID;
    public function __construct()
    {
        parent::__construct();
        if ($this->session->userdata('status') != "MASUK") {
            redirect(base_url("otentikasi"));
        }
        $this->load->model("JasaServis_model");
        $this->load->library('form_validation');
        $this->load->library('datatables');
        $this->load->model("LogActivity_model");
        $this->load->helper('data_helper');
        $this->load->helper("rupiah_helper");
        $this->load->helper("tgl_indo_helper");
        $this->userID = $this->session->userdata('userID');
        $this->penjualanModel = $this->JasaServis_model;
    }

    function getJasaServis()
    {
        error_reporting(0);
        $list = $this->penjualanModel->get_datatables();
        $data = array();
        foreach ($list as $field) {
            $row = array();
            $row[] = $field->id;
            $row[] = $field->faktur;
            $row[] = getPelangganID($field->pelanggan_id, 'nama_pelanggan');
            $row[] = shortdate_indo($field->date);
            $row[] = rupiah($field->grand_total);
            $row[] = getUserID($field->user_id, 'nama_user');
            $row[] = $field->kerusakan;
            $row[] = $field->status_servis;
            $row[] = $field->keterangan;

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->penjualanModel->count_all(),
            "recordsFiltered" => $this->penjualanModel->count_filtered(),
            "data" => $data,
        );
        echo json_encode($output);
    }

    function filterJasaServis()
    {
        error_reporting(0);
        $startDate = $this->input->post('startDate');
        $endDate = $this->input->post('endDate');
        $list = $this->penjualanModel->get_datatables_filter($startDate, $endDate);
        $data = array();
        foreach ($list as $field) {
            $row = array();
            $row[] = $field->id;
            $row[] = $field->faktur;
            $row[] = getPelangganID($field->pelanggan_id, 'nama_pelanggan');
            $row[] = shortdate_indo($field->date);
            $row[] = rupiah($field->grand_total);
            $row[] = getUserID($field->user_id, 'nama_user');
            $row[] = $field->kerusakan;
            $row[] = $field->status_servis;
            $row[] = $field->keterangan;

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->penjualanModel->count_all(),
            "recordsFiltered" => $this->penjualanModel->count_filtered_filter($startDate, $endDate),
            "data" => $data,
        );
        echo json_encode($output);
    }

    public function store()
    {
        $validation = $this->form_validation;
        $validation->set_rules($this->penjualanModel->rules());
        if ($validation->run()) {
            echo json_encode($this->penjualanModel->addTransactions($this->userID));
            $this->LogActivity_model->saveLog($this->userID);
        }
    }
}
