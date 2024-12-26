<?php
class My404 extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        if ($this->session->userdata('status') != "MASUK") {
            redirect(base_url("otentikasi"));
        }
    }

    public function index()
    {
        $this->output->set_status_header('404');
        $this->load->view('errors/html/error_404');
    }
}
