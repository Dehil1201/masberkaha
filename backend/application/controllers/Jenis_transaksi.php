<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Jenis_transaksi extends CI_Controller
{
    public $userID;
    public function __construct()
    {
        parent::__construct();
        if ($this->session->userdata('status') != "MASUK") {
            redirect(base_url("otentikasi"));
        }
        $this->load->model("Jenis_transaksi_model");
        $this->load->library('form_validation');
        $this->load->library('datatables');
        $this->load->model("LogActivity_model");
        $this->userID = $this->session->userdata('userID');
    }

    function getJenisTransaksi()
    {
        error_reporting(0);
        $list = $this->Jenis_transaksi_model->get_datatables();
        $data = array();
        foreach ($list as $field) {
            $row = array();
            $row[] = $field->id;
            $row[] = $field->nama_transaksi;
            $row[] = $field->tipe;

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->Jenis_transaksi_model->count_all(),
            "recordsFiltered" => $this->Jenis_transaksi_model->count_filtered(),
            "data" => $data,
        );
        echo json_encode($output);
    }

    public function getJenisTransaksiRow($tipe = NULL)
    {
        $decodeTipe = utf8_decode(urldecode($tipe));
        echo json_encode($this->Jenis_transaksi_model->getJenisRow($decodeTipe));
    }

    public function store()
    {
        $jenis_transaksi = $this->Jenis_transaksi_model;
        $validation = $this->form_validation;
        $validation->set_rules($jenis_transaksi->rules());

        if ($validation->run()) {
            echo json_encode($jenis_transaksi->add());
            $this->LogActivity_model->saveLog($this->userID);
        }
    }

    public function update()
    {
        $jenis_transaksi = $this->Jenis_transaksi_model;
        $validation = $this->form_validation;
        $validation->set_rules($jenis_transaksi->rules());

        if ($validation->run()) {
            echo json_encode($jenis_transaksi->save());
            $this->LogActivity_model->saveLog($this->userID);
        }
    }

    public function destroy()
    {
        $id = $this->input->post('id');
        $data = $this->Jenis_transaksi_model->delete($id);
        echo json_encode($data);
        $this->LogActivity_model->saveLog($this->userID);
    }
}
