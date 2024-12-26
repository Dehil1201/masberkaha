<?php

defined('BASEPATH') or exit('No direct script access allowed');

class User extends CI_Controller
{
    public $userID;
    public function __construct()
    {
        parent::__construct();

        $this->load->model("User_model");
        $this->load->library('form_validation');
        $this->load->library('datatables');
        $this->load->model("LogActivity_model");
        $this->userID = $this->session->userdata('userID');
    }

    function getUser()
    {
        error_reporting(0);
        $this->load->helper("data_helper");
        $list = $this->User_model->get_datatables();
        $data = array();
        foreach ($list as $field) {
            $row = array();
            $row[] = $field->id;
            $row[] = $field->nama_user;
            $row[] = $field->username;
            $row[] = $field->level . '-' . getAksesID($field->level);
            $row[] = $field->alamat;
            $row[] = $field->no_hp;
            $row[] = $field->password;

            $data[] = $row;
        }

        $output = array(
            "draw" => $_POST['draw'],
            "recordsTotal" => $this->User_model->count_all(),
            "recordsFiltered" => $this->User_model->count_filtered(),
            "data" => $data,
        );
        echo json_encode($output);
    }

    public function store()
    {
        $user = $this->User_model;
        $validation = $this->form_validation;
        $validation->set_rules($user->rules());

        if ($validation->run()) {
            echo json_encode($user->add());
            $this->LogActivity_model->saveLog($this->userID);
        }
    }

    public function update()
    {
        $user = $this->User_model;
        $validation = $this->form_validation;
        $validation->set_rules($user->rules());

        if ($validation->run()) {
            echo json_encode($user->save());
            $this->LogActivity_model->saveLog($this->userID);
        }
    }

    public function changePassword()
    {
        $user = $this->User_model;

        $oldPassword = $this->input->post('old_password');
        $checkOldPass = $user->checkOldPassword($oldPassword);
        if ($checkOldPass > 0) {
            if ($user->change_password()) {
                $output = array(
                    "status" => true,
                    "message" => 'Password berhasil diubah! '
                );
                echo json_encode($output);
            } else {
                $output = array(
                    "status" => false,
                    "message" => 'Password gagal diubah!, ada masalah di server..'
                );
                echo json_encode($output);
            }
        } else {
            $output = array(
                "status" => false,
                "message" => 'Password lama salah!'
            );
            echo json_encode($output);
        }
        $this->LogActivity_model->saveLog($this->userID);
    }

    public function destroy()
    {
        $id = $this->input->post('id');
        $data = $this->User_model->delete($id);
        echo json_encode($data);
        $this->LogActivity_model->saveLog($this->userID);
    }
}
