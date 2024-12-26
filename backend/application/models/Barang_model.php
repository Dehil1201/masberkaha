<?php defined('BASEPATH') or exit('No direct script access allowed');

class Barang_model extends CI_Model
{
    var $table = 'data_barang';
    var $column_order = array('id', 'kode_barang', 'nama_barang', 'jenis_barang', 'berat', 'kadar', 'status', 'harga_beli', 'harga_jual');
    var $column_search = array('kode_barang', 'nama_barang');
    var $column_order_instok = array('id', 'kode_barang', 'nama_barang', 'jenis_barang', 'berat', 'status');
    var $column_search_instok = array('kode_barang', 'nama_barang', 'jenis_barang');
    var $column_order_quantity = array('id', 'kode_barang', 'nama_barang', 'jenis_barang', 'berat', 'status');
    var $column_search_quantity = array('kode_barang', 'nama_barang', 'jenis_barang');
    var $column_order_barcode = array('id', 'kode_barang', 'nama_barang', 'jenis_barang', 'berat', 'status', 'created_at');
    var $column_search_barcode = array('kode_barang', 'nama_barang', 'jenis_barang');
    var $order = array('id' => 'asc');

    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function rules()
    {
        return [
            [
                'field' => 'nama_barang',
                'label' => 'Nama Barang',
                'rules' => 'required'
            ]
        ];
    }

    private function _get_datatables_query($jenisValue, $statusValue)
    {
        $this->db->from($this->table);
        if ($jenisValue != NULL) {
            $this->db->where('jenis_barang', $jenisValue);
        }
        if ($statusValue != NULL) {
            if ($statusValue == 'stok') {
                $status = array('J', 'S', 'R');
                $this->db->where_not_in('status', $status);
            } else {
                $this->db->where('status', $statusValue);
            }
        }
        $i = 0;
        foreach ($this->column_search as $item) // looping awal
        {
            if ($_POST['search']['value']) // jika datatable mengirimkan pencarian dengan metode POST
            {
                if ($i === 0) // looping awal
                {
                    $this->db->group_start();
                    $this->db->like($item, $_POST['search']['value']);
                } else {
                    $this->db->or_like($item, $_POST['search']['value']);
                }
                if (count($this->column_search) - 1 == $i)
                    $this->db->group_end();
            }
            $i++;
        }

        if (isset($_POST['order'])) {
            $this->db->order_by($this->column_order[$_POST['order']['0']['column']], $_POST['order']['0']['dir']);
        } else if (isset($this->order)) {
            $order = $this->order;
            $this->db->order_by(key($order), $order[key($order)]);
        }
    }

    function get_datatables($jenisValue, $statusValue)
    {
        $this->_get_datatables_query($jenisValue, $statusValue);
        if ($_POST['length'] != -1)
            $this->db->limit($_POST['length'], $_POST['start']);
        $query = $this->db->get();
        return $query->result();
    }

    function count_filtered($jenisValue, $statusValue)
    {
        $this->_get_datatables_query($jenisValue, $statusValue);
        $query = $this->db->get();
        return $query->num_rows();
    }

    public function count_all()
    {
        $this->db->from($this->table);
        return $this->db->count_all_results();
    }

    // Get Barang Instok
    private function _get_datatables_query_instok($jenisBarang)
    {
        $listJenis = getWhere('jenis_barang', 'penjualan_satuan', 0);
        $listJenisBarang = array();
        foreach ($listJenis as $field) {
            $listJenisBarang[] = $field->jenis_barang;
        }
        $this->db->from($this->table);
        if ($jenisBarang == NULL || $jenisBarang == 'null') {
            $this->db->where_in('jenis_barang', $listJenisBarang);
            $status = array('J', 'S', 'R');
            $this->db->where_not_in('status', $status);
        } else {
            $this->db->where('jenis_barang', $jenisBarang);
        }
        $i = 0;
        foreach ($this->column_search_instok as $item) // looping awal
        {
            if ($_POST['search']['value']) // jika datatable mengirimkan pencarian dengan metode POST
            {
                if ($i === 0) // looping awal
                {
                    $this->db->group_start();
                    $this->db->like($item, $_POST['search']['value']);
                } else {
                    $this->db->or_like($item, $_POST['search']['value']);
                }
                if (count($this->column_search_instok) - 1 == $i)
                    $this->db->group_end();
            }
            $i++;
        }

        if (isset($_POST['order'])) {
            $this->db->order_by($this->column_order_instok[$_POST['order']['0']['column']], $_POST['order']['0']['dir']);
        } else if (isset($this->order)) {
            $order = $this->order;
            $this->db->order_by(key($order), $order[key($order)]);
        }
    }

    function get_datatables_instok($jenisBarang)
    {
        $this->_get_datatables_query_instok($jenisBarang);
        if ($_POST['length'] != -1)
            $this->db->limit($_POST['length'], $_POST['start']);
        $query = $this->db->get();
        return $query->result();
    }

    function count_filtered_instok($jenisBarang)
    {
        $this->_get_datatables_query_instok($jenisBarang);
        $query = $this->db->get();
        return $query->num_rows();
    }

    public function count_all_instok()
    {
        $this->db->from($this->table);
        return $this->db->count_all_results();
    }

    // Get Barang Quantity
    private function _get_datatables_query_quantity()
    {
        $listJenis = getWhere('jenis_barang', 'penjualan_satuan', 1);
        $jenisBarang = array();
        foreach ($listJenis as $field) {
            $jenisBarang[] = $field->jenis_barang;
        }
        $this->db->where_in('jenis_barang', $jenisBarang);
        $this->db->from($this->table);

        $i = 0;
        foreach ($this->column_search_quantity as $item) // looping awal
        {
            if ($_POST['search']['value']) // jika datatable mengirimkan pencarian dengan metode POST
            {
                if ($i === 0) // looping awal
                {
                    $this->db->group_start();
                    $this->db->like($item, $_POST['search']['value']);
                } else {
                    $this->db->or_like($item, $_POST['search']['value']);
                }
                if (count($this->column_search_quantity) - 1 == $i)
                    $this->db->group_end();
            }
            $i++;
        }

        if (isset($_POST['order'])) {
            $this->db->order_by($this->column_order_quantity[$_POST['order']['0']['column']], $_POST['order']['0']['dir']);
        } else if (isset($this->order)) {
            $order = $this->order;
            $this->db->order_by(key($order), $order[key($order)]);
        }
    }

    function get_datatables_quantity()
    {
        $this->_get_datatables_query_quantity();
        if ($_POST['length'] != -1)
            $this->db->limit($_POST['length'], $_POST['start']);
        $query = $this->db->get();
        return $query->result();
    }

    function count_filtered_quantity()
    {
        $this->_get_datatables_query_quantity();
        $query = $this->db->get();
        return $query->num_rows();
    }

    public function count_all_quantity()
    {
        $this->db->from($this->table);
        return $this->db->count_all_results();
    }

    // Get Barang Cetak Barcode
    private function _get_datatables_query_barcode($col, $val, $startDate, $endDate, $jenisVal)
    {
        $status = array('J', 'R');
        $this->db->from($this->table);
        if ($jenisVal == NULL || $jenisVal == 'null') {
            $this->db->where('jenis_barang IS NOT NULL', NULL, FALSE);
        } else {
            $this->db->where('jenis_barang', $jenisVal);
        }
        $this->db->where($col, $val);
        $this->db->where_not_in('status', $status);
        if ($startDate != NULL) {
            if ($val == '1') {
                $this->db->where('tanggal_terima>=', $startDate)->where('tanggal_terima<=', date('Y-m-d H:i:s', strtotime($endDate . ' +1 day')));
            } else {
                $this->db->where('updated_at>=', $startDate)->where('updated_at<=', date('Y-m-d H:i:s', strtotime($endDate . ' +1 day')));
            }
        }
        $i = 0;
        foreach ($this->column_search_barcode as $item) // looping awal
        {
            if ($_POST['search']['value']) // jika datatable mengirimkan pencarian dengan metode POST
            {
                if ($i === 0) // looping awal
                {
                    $this->db->group_start();
                    $this->db->like($item, $_POST['search']['value']);
                } else {
                    $this->db->or_like($item, $_POST['search']['value']);
                }
                if (count($this->column_search_barcode) - 1 == $i)
                    $this->db->group_end();
            }
            $i++;
        }

        if (isset($_POST['order'])) {
            $this->db->order_by($this->column_order_barcode[$_POST['order']['0']['column']], $_POST['order']['0']['dir']);
        } else if (isset($this->order)) {
            $order = $this->order;
            $this->db->order_by(key($order), $order[key($order)]);
        }
    }

    function get_datatables_barcode($col, $val, $startDate, $endDate, $jenisVal)
    {
        $this->_get_datatables_query_barcode($col, $val, $startDate, $endDate, $jenisVal);
        if ($_POST['length'] != -1)
            $this->db->limit($_POST['length'], $_POST['start']);
        $query = $this->db->get();
        return $query->result();
    }

    function count_filtered_barcode($col, $val, $startDate, $endDate, $jenisVal)
    {
        $this->_get_datatables_query_barcode($col, $val, $startDate, $endDate, $jenisVal);
        $query = $this->db->get();
        return $query->num_rows();
    }

    public function count_all_barcode()
    {
        $this->db->from($this->table);
        return $this->db->count_all_results();
    }

    // Get Table Barang Rusak
    private function _get_datatables_query_rusak()
    {
        $this->db->from($this->table);
        $this->db->where('status', 'R');
        $i = 0;
        foreach ($this->column_search as $item) // looping awal
        {
            if ($_POST['search']['value']) // jika datatable mengirimkan pencarian dengan metode POST
            {
                if ($i === 0) // looping awal
                {
                    $this->db->group_start();
                    $this->db->like($item, $_POST['search']['value']);
                } else {
                    $this->db->or_like($item, $_POST['search']['value']);
                }
                if (count($this->column_search) - 1 == $i)
                    $this->db->group_end();
            }
            $i++;
        }

        if (isset($_POST['order'])) {
            $this->db->order_by($this->column_order[$_POST['order']['0']['column']], $_POST['order']['0']['dir']);
        } else if (isset($this->order)) {
            $order = $this->order;
            $this->db->order_by(key($order), $order[key($order)]);
        }
    }

    function get_datatables_rusak()
    {
        $this->_get_datatables_query_rusak();
        if ($_POST['length'] != -1)
            $this->db->limit($_POST['length'], $_POST['start']);
        $query = $this->db->get();
        return $query->result();
    }

    function count_filtered_rusak()
    {
        $this->_get_datatables_query_rusak();
        $query = $this->db->get();
        return $query->num_rows();
    }

    public function count_all_rusak()
    {
        $this->db->from($this->table);
        return $this->db->count_all_results();
    }

    public function getBarangById($kodeBarang, $jenisBarang)
    {
        $this->db->from($this->table);
        $this->db->where('kode_barang', $kodeBarang);
        $this->db->where_not_in('status', array('J'));
        if ($jenisBarang != NULL) {
            $this->db->where('jenis_barang', $jenisBarang);
        } else {
            $this->db->where_not_in('jenis_barang', 'Lain-lain');
        }
        return $this->db->get()->row();
    }

    public function getBarangByIdQuantity($kodeBarang)
    {
        $listJenis = getWhere('jenis_barang', 'penjualan_satuan', 1);
        $jenisBarang = array();
        foreach ($listJenis as $field) {
            $jenisBarang[] = $field->jenis_barang;
        }
        $this->db->where('kode_barang', $kodeBarang);
        $this->db->where_in('jenis_barang', $jenisBarang);
        $this->db->from($this->table);
        return $this->db->get()->row();
    }

    public function add()
    {
        $kodeBarang = $this->input->post('kode_barang', TRUE, NULL);
        $berat = $this->input->post('berat', TRUE, 0);
        $valueStok = $this->input->post('stok', TRUE, 1);
        $hargaBeli = $this->input->post('harga_beli', TRUE, 0);
        $hargaJual = $this->input->post('harga_jual', TRUE, 0);
        $foto = $this->input->post('foto', FALSE, NULL);
        $data = array(
            'kode_barang' => $kodeBarang,
            'nama_barang' => $this->input->post('nama_barang', TRUE, NULL),
            'jenis_barang' => $this->input->post('jenis_barang', TRUE, NULL),
            'berat' => $berat,
            'kadar' => $this->input->post('kadar', TRUE, 0),
            'status' => '0',
            'harga_beli' => $hargaBeli,
            'nilai_beli' => $hargaBeli * $berat,
            'harga_jual' => $hargaJual,
            'stok' => $valueStok,
            'nilai_stok' => $hargaJual,
            'foto' => $this->uploadFoto($foto, $kodeBarang),
            'status_check' => 0,
            'created_at' => date('Y-m-d H:i:s')
        );
        $this->db->insert($this->table, $data);
        return ($this->db->affected_rows() != 1) ? FALSE : TRUE;
    }

    public function save()
    {
        $kodeBarang = $this->input->post('kode_barang', TRUE, NULL);
        $berat = $this->input->post('berat', TRUE, 0);
        $hargaJual = $this->input->post('harga_jual', TRUE, 0);
        $oldFoto = $this->input->post('old_foto', FALSE, NULL);
        $foto = $this->input->post('foto', FALSE, NULL);
        $post = $this->input->post();
        $this->db->trans_start(); # Starting Transaction

        // Delete Image
        if ($foto != NULL) {
            $this->_deleteImage($oldFoto);
            $fotoValue = $this->uploadFoto($foto, $kodeBarang);
        } else {
            $fotoValue = $oldFoto;
        }
        $data = array(
            'kode_barang' => $kodeBarang,
            'nama_barang' => $this->input->post('nama_barang', TRUE, NULL),
            'jenis_barang' => $this->input->post('jenis_barang', TRUE, NULL),
            'berat' => $berat,
            'status' =>  htmlspecialchars($post["status_barang"], ENT_QUOTES),
            'kadar' => $this->input->post('kadar', TRUE, 0),
            'harga_beli' => $this->input->post('harga_beli', TRUE, 0),
            'harga_jual' => $hargaJual,
            'foto' => $fotoValue,
            'updated_at' => date('Y-m-d H:i:s')
        );
        // Update Data
        $this->db->where('id', htmlspecialchars($this->input->post('barang_id')));
        $this->db->update($this->table, $data);

        $this->db->trans_complete(); # Completing transaction

        /*Optional*/

        if ($this->db->trans_status() === FALSE) {
            # Something went wrong.
            $this->db->trans_rollback();
            return FALSE;
        } else {
            # Everything is Perfect. 
            # Committing data to the database.
            $this->db->trans_commit();
            return TRUE;
        }
        return ($this->db->affected_rows() != 1) ? FALSE : TRUE;
    }

    public function changeData()
    {
        $data = array(
            'berat' => $this->input->post('berat', TRUE, NULL),
            'harga_beli' => $this->input->post('harga_beli', TRUE, NULL),
            'updated_at' => date('Y-m-d H:i:s')
        );
        $this->db->where('kode_barang', htmlspecialchars($this->input->post('kode_barang')));
        $this->db->update($this->table, $data);
    }

    public function changeStatus()
    {
        $post = $this->input->post();
        $data = array(
            'status' => htmlspecialchars($post["status_barang"], ENT_QUOTES),
            'updated_at' => date('Y-m-d H:i:s')
        );
        $this->db->where('kode_barang', $this->input->post('kode_barang', TRUE, NULL));
        $this->db->update($this->table, $data);
        return ($this->db->affected_rows() != 1) ? FALSE : TRUE;
    }

    public function delete($id)
    {
        $foto = $this->input->post('foto', TRUE, NULL);
        $this->db->trans_start(); # Starting Transaction

        // Delete Barang
        $this->db->delete($this->table, array("id" => $id));
        // Delete Image
        $this->_deleteImage($foto);
        $this->db->trans_complete(); # Completing transaction

        /*Optional*/

        if ($this->db->trans_status() === FALSE) {
            # Something went wrong.
            $this->db->trans_rollback();
            return FALSE;
        } else {
            # Everything is Perfect. 
            # Committing data to the database.
            $this->db->trans_commit();
            return TRUE;
        }
    }

    public function uploadFoto($image, $kodeBarang)
    {
        if ($image !== NULL) {
            $image = str_replace('data:image/jpeg;base64,', '', $image);
            $image = base64_decode($image);
            $filename = 'foto_' . time() . '-' . $kodeBarang . '.jpg';
            file_put_contents(FCPATH . '/uploads/foto/' . $filename, $image);
            return $filename;
        } else {
            return NULL;
        }
    }

    private function _deleteImage($foto)
    {
        if ($foto != NULL) {
            return array_map('unlink', glob(FCPATH . "uploads/foto/$foto"));
        }
    }

    public function sumWhereBarang($table, $colSum, $col, $id, $valStatus)
    {
        $this->db->select_sum($colSum);
        if ($id != NULL) {
            $this->db->where($col, $id);
        }
        if ($valStatus != NULL) {
            if ($valStatus == 'stok') {
                $status = array('J', 'S', 'R');
                $this->db->where_not_in('status', $status);
            } else {
                $this->db->where('status', $valStatus);
            }
        }
        return $this->db->get($table)->row()->$colSum;
    }
}
