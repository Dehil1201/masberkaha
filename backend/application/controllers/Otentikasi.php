<?php

class Otentikasi extends CI_Controller
{

	function __construct()
	{
		parent::__construct();
		$this->load->model('Otentikasi_model');
	}

	function index()
	{
		$data["title"] = "Login - SIDAMAS ~ Toko Mas";
		$this->load->view('otentikasi/login', $data);
	}

	function aksi_login()
	{
		$username = strtolower($this->input->post('username'));
		$password = $this->input->post('password');
		$user = $this->Otentikasi_model->get($username);
		if (empty($user)) {
			$output = array(
                "status" => FALSE,
                "message" => 'Username tidak ditemukan!'
            );
            echo json_encode($output);
		} else {
			if ($password === $user->password) {
				$session = array(
					'authenticated' => TRUE,
					'status' => 'MASUK',
					'levelID' => $user->level,
					'userID' => $user->id,
					'nama' => $user->nama_user,
					'username' => $user->username
				);
				$user = $this->Otentikasi_model->update_last_login($user->username);
				$this->session->set_userdata($session);
				echo json_encode($session);
			} else {
				$this->session->set_flashdata('message', 'Password salah');
				$loginFalse = array(
					'authenticated' => FALSE,
					'message' => 'Password salah!'
				);
				echo json_encode($loginFalse);
			}
		}
	}

	function login_kasir()
	{
		$username = strtolower($this->input->post('username'));
		$password = $this->input->post('password');
		$user = $this->Otentikasi_model->get($username);
		if (empty($user)) {
			$output = array(
                "status" => FALSE,
                "message" => 'Username tidak ditemukan!'
            );
            echo json_encode($output);
		} else {
			if ($password === $user->password) {
				$session = array(
					'authenticated' => TRUE,
					'status' => 'MASUK',
					'levelID' => $user->level,
					'userID' => $user->id,
					'nama' => $user->nama_user
				);
				$this->session->set_userdata($session);
				echo json_encode($session);
			} else {
				$this->session->set_flashdata('message', 'Password salah');
				$loginFalse = array(
					'authenticated' => FALSE,
					'message' => 'Password salah!'
				);
				echo json_encode($loginFalse);
			}
		}
	}

	public function checkingPasssword()
    {
        $username = strtolower($this->input->post('username'));
        $password = $this->input->post('password');
        $user = $this->Otentikasi_model->get($username);
        if ($password === $user->password) {
            $data = array(
                'authenticated' => TRUE
            );
            echo json_encode($data);
        } else {
            $data = array(
                'authenticated' => FALSE,
                'message' => 'Pin salah!'
            );
            echo json_encode($data);
        }
    }

	function logout()
	{
		$this->session->sess_destroy();
		return true;
	}
}
