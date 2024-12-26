<?php

defined('BASEPATH') or exit('No direct script access allowed');

class Akses extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        if ($this->session->userdata('status') != "MASUK") {
            redirect(base_url("otentikasi"));
        }
        $this->load->model("Akses_model");
        $this->load->library('form_validation');
        $this->load->library('datatables');
        $this->load->model("LogActivity_model");
        $this->userID = $this->session->userdata('userID');
    }

    function getAkses()
    {
        $list = $this->Akses_model->get_datatables();
        $data = array();
        foreach ($list as $field) {
            $row = array();
            $row[] = $field->id;
            $row[] = $field->level;

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->Akses_model->count_all(),
            "recordsFiltered" => $this->Akses_model->count_filtered(),
            "data" => $data,
        );
        echo json_encode($output);
    }

    function getHakAkses()
    {
        $level = $this->input->post('level');
        $list = $this->Akses_model->getAllAkses($level);
        echo json_encode($list);
    }

    function getJenisAkses()
    { 
        $list = $this->Akses_model->getJenisAkses();
        echo json_encode($list);
    }

    function updateRuleAkses()
    {
        $field = $this->input->post('field');
        $value = $this->input->post('value');
        $jenisLevel = $this->input->post('level');
        $result = $this->Akses_model->updateRuleAkses($field,$value,$jenisLevel);
        echo json_encode($result);
    }

    function displayAkses()
    {
        $akses = $this->Akses_model->getAkses("admin", "master");
        if ($akses === 1) {
            echo '';
        } else {
            echo " style='display:none' ";
        }
    }

    public function store()
    {
        $akses = $this->Akses_model;
        $validation = $this->form_validation;
        $validation->set_rules($akses->rules());

        if ($validation->run()) {
            echo json_encode($akses->add());
            $this->LogActivity_model->saveLog($this->userID);
        }
    }

    public function update()
    {
        $akses = $this->Akses_model;
        $validation = $this->form_validation;
        $validation->set_rules($akses->rules());

        if ($validation->run()) {
            echo json_encode($akses->save());
            $this->LogActivity_model->saveLog($this->userID);
        }
    }

    public function destroy()
    {
        $id = $this->input->post('id');
        $data = $this->Akses_model->delete($id);
        echo json_encode($data);
        $this->LogActivity_model->saveLog($this->userID);
    }
}
