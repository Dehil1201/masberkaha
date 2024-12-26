<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Pelanggan extends CI_Controller
{
    public $userID;
    public function __construct()
    {
        parent::__construct();
        if ($this->session->userdata('status') != "MASUK") {
            redirect(base_url("otentikasi"));
        }
        $this->load->model("Pelanggan_model");
        $this->load->library('form_validation');
        $this->load->library('datatables');
        $this->load->model("LogActivity_model");
        $this->userID = $this->session->userdata('userID');
    }

    function getPelanggan()
    {
        error_reporting(0);
        $list = $this->Pelanggan_model->get_datatables();
        $data = array();
        foreach ($list as $field) {
            $row = array();
            $row[] = $field->id;
            $row[] = $field->kode_pelanggan;
            $row[] = $field->nama_pelanggan;
            $row[] = $field->alamat;
            $row[] = $field->kota;
            $row[] = $field->no_hp;
            $row[] = $field->email;
            $row[] = $field->point;

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->Pelanggan_model->count_all(),
            "recordsFiltered" => $this->Pelanggan_model->count_filtered(),
            "data" => $data,
        );
        echo json_encode($output);
    }

    public function store()
    {
        $pelanggan = $this->Pelanggan_model;
        $validation = $this->form_validation;
        $validation->set_rules($pelanggan->rules());

        if ($validation->run()) {
            echo json_encode($pelanggan->add());
            $this->LogActivity_model->saveLog($this->userID);
        }
    }

    public function update()
    {
        $pelanggan = $this->Pelanggan_model;
        $validation = $this->form_validation;
        $validation->set_rules($pelanggan->rules());

        if ($validation->run()) {
            echo json_encode($pelanggan->save());
            $this->LogActivity_model->saveLog($this->userID);
        }
    }

    public function destroy()
    {
        $id = $this->input->post('id');
        $data = $this->Pelanggan_model->delete($id);
        echo json_encode($data);
        $this->LogActivity_model->saveLog($this->userID);
    }
}
