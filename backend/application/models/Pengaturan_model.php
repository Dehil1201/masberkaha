<?php defined('BASEPATH') or exit('No direct script access allowed');

class Pengaturan_model extends CI_Model
{
    var $tablePengaturan = 'pengaturan';
    var $tableDashboard = 'dashboard';
    var $tableBarang = 'data_barang';

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function getAllPengaturan()
    {
        return $this->db->get($this->tablePengaturan)->row();
    }

    public function getDashboard($action)
    {
        return $this->db->get($this->tableDashboard)->row()->$action;
    }

    public function add()
    {
        $post = $this->input->post();
        $data = array(
            'id' => 1,
            'harga_potongan' => $this->input->post('harga_potongan', TRUE, 0),
            'updated_at' => date('Y-m-d H:i:s')
        );
        $this->db->insert($this->tablePengaturan, $data);
        return ($this->db->affected_rows() != 1) ? FALSE : TRUE;
    }

    public function save()
    {
        $post = $this->input->post();
        $data = array(
            'harga_potongan' => $this->input->post('harga_potongan', TRUE, 0),
            'updated_at' => date('Y-m-d H:i:s')
        );
        $this->db->where('id', $post['pengaturan_id']);
        $this->db->update($this->tablePengaturan, $data);
        return ($this->db->affected_rows() != 1) ? FALSE : TRUE;
    }


    public function add_toko()
    {
        $data = array(
            'id' => 1,
            'nama_toko' => $this->input->post('nama_toko', TRUE, null),
            'alamat' => $this->input->post('alamat', TRUE, null),
            'no_hp' => $this->input->post('no_hp', TRUE, null),
            'email' => $this->input->post('email', TRUE, null),
            'updated_at' => date('Y-m-d H:i:s')
        );
        $this->db->insert($this->tablePengaturan, $data);
        return ($this->db->affected_rows() != 1) ? FALSE : TRUE;
    }

    public function save_toko()
    {
        $post = $this->input->post();
        $data = array(
            'nama_toko' => $this->input->post('nama_toko', TRUE, null),
            'alamat' => $this->input->post('alamat', TRUE, null),
            'no_hp' => $this->input->post('no_hp', TRUE, null),
            'email' => $this->input->post('email', TRUE, null),
            'point_gram' => $this->input->post('point_gram', TRUE, null),
            'updated_at' => date('Y-m-d H:i:s')
        );
        $this->db->where('id', $post['pengaturan_id']);
        $this->db->update($this->tablePengaturan, $data);
        return ($this->db->affected_rows() != 1) ? FALSE : TRUE;
    }

    public function backupDb()
    {
        $data = array(
            'backup_database' => date("Y-m-d H:i:s")
        );
        $this->db->where('id', 1);
        $this->db->update($this->tablePengaturan, $data);
        return ($this->db->affected_rows() != 1) ? FALSE : TRUE;
    }

    public function restoreDb()
    {
        $output = '';
        $config['upload_path'] = FCPATH . '/db/';
        $config['allowed_types'] = '*';
        $config['file_name']            = 'db_sidamas.db';
        $config['overwrite'] = TRUE;

        $this->load->library('upload', $config);

        if (!$this->upload->do_upload('fileDb')) {
            $error = array('error' => $this->upload->display_errors());

            $output = array(
                "status" => false,
                "message" => "Database gagal di restore.. ",
                "problem" => $error
            );
        } else {
            $data = array(
                'restore_database' => date("Y-m-d H:i:s")
            );
            $this->db->where('id', 1);
            $this->db->update($this->tablePengaturan, $data);

            $output = array(
                "status" => true,
                "message" => "Database berhasil di restore.."
            );
        }
        return $output;
    }

    public function updateHarga($val)
    {
        $hargaPasar = $this->input->post('jumlah_harga', TRUE, 0);
        $status = array('J', 'S', 'R');
        $this->db->set("harga_jual", "harga_jual $val $hargaPasar", FALSE);
        $this->db->where_not_in('status', $status);
        $this->db->update($this->tableBarang);
        return ($this->db->affected_rows() == 1) ? FALSE : TRUE;
    }

    public function updateHargaPasar()
    {
        $hargaPasar = $this->input->post('harga_pasar', TRUE, 0);
        $status = array('J', 'S', 'R');

        $this->db->trans_start(); # Starting Transaction
        // Ubah Harga Pasar Pengaturan
        $this->db->set("harga_pasar", $hargaPasar, FALSE);
        $this->db->update($this->tablePengaturan);
        // Ubah Harga Jual Barang Instok
        $this->db->set("harga_jual", $hargaPasar, FALSE);
        $this->db->where_not_in('status', $status);
        $this->db->update($this->tableBarang);

        $this->db->trans_complete(); # Completing transaction

        if ($this->db->trans_status() === FALSE) {
            $this->db->trans_rollback();
            return FALSE;
        } else {
            $this->db->trans_commit();
            return TRUE;
        }
    }

    public function emptyTable($table)
    {
        return $this->db->empty_table($table);
    }

    public function emptyPrice()
    {
        $this->db->trans_start(); # Starting Transaction
        // Empty Transaction Table
        // Update harga jual to 0
        $status = array('1', '', '0');
        $this->db->set('harga_jual', 0, FALSE);
        $this->db->where_in('status', $status);
        $this->db->update($this->tableBarang);

        $this->db->trans_complete(); # Completing transaction

        if ($this->db->trans_status() === FALSE) {
            $this->db->trans_rollback();
            return FALSE;
        } else {
            $this->db->trans_commit();
            return TRUE;
        }
    }

    public function emptyTransactionTable()
    {
        $this->db->trans_start(); # Starting Transaction
        // Empty Transaction Table
        $startDate = $this->input->post('startDate', TRUE, null);
        $endDate = $this->input->post('endDate', TRUE, null);
        // Delete Barang History Periode
        $this->db->where("date>=", $startDate)->where("date<=", $endDate);
        $this->db->delete('barang_history');
        // Delete Faktur periode
        $this->db->where("date>=", $startDate)->where("date<=", $endDate);
        $this->db->delete('faktur');
        // Delete Hutang periode
        $this->db->where("created_at>=", $startDate)->where("created_at<=", $endDate);
        $this->db->delete('hutang');
        // Delete Beli Kembali periode
        $this->db->where("date>=", $startDate)->where("date<=", $endDate);
        $this->db->delete('beli_kembali');
        // Delete Beli Kembali Detail periode
        $this->db->where("date>=", $startDate)->where("date<=", $endDate);
        $this->db->delete('beli_kembali_detail');
        // Delete Pembelian periode
        $this->db->where("date>=", $startDate)->where("date<=", $endDate);
        $this->db->delete('pembelian');
        // Delete Pembelian Detail periode
        $this->db->where("date>=", $startDate)->where("date<=", $endDate);
        $this->db->delete('pembelian_detail');
        // Delete Penjualan periode
        $this->db->where("date>=", $startDate)->where("date<=", $endDate);
        $this->db->delete('penjualan');
        // Delete Penjualan Detail periode
        $this->db->where("date>=", $startDate)->where("date<=", $endDate);
        $this->db->delete('penjualan_detail');
        // Delete Piutang periode
        $this->db->where("created_at>=", $startDate)->where("created_at<=", $endDate);
        $this->db->delete('piutang');
        // Delete Quantity Detail periode
        $this->db->where("date>=", $startDate)->where("date<=", $endDate);
        $this->db->delete('quantity_detail');

        $this->db->trans_complete(); # Completing transaction

        if ($this->db->trans_status() === FALSE) {
            $this->db->trans_rollback();
            return FALSE;
        } else {
            $this->db->trans_commit();
            return TRUE;
        }
    }

    public function emptyAllTable()
    {
        $this->db->trans_start(); # Starting Transaction
        // Empty All Table
        $this->db->empty_table($this->tableBarang);
        $this->db->empty_table('pelanggan');
        $this->db->empty_table('supplier');
        $this->db->empty_table('jenis_barang');
        $this->db->empty_table('barang_history');
        $this->db->empty_table('faktur');
        $this->db->empty_table('hutang');
        $this->db->empty_table('beli_kembali');
        $this->db->empty_table('beli_kembali_detail');
        $this->db->empty_table('pembelian');
        $this->db->empty_table('pembelian_detail');
        $this->db->empty_table('penjualan');
        $this->db->empty_table('penjualan_detail');
        $this->db->empty_table('piutang');
        $this->db->empty_table('quantity_detail');
        // Update saldo to 0
        $this->db->set('saldo', 0, FALSE);
        $this->db->update('saldo');

        $this->db->trans_complete(); # Completing transaction

        if ($this->db->trans_status() === FALSE) {
            $this->db->trans_rollback();
            return FALSE;
        } else {
            $this->db->trans_commit();
            return TRUE;
        }
    }
}
