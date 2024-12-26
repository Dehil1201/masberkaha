<?php defined('BASEPATH') or exit('No direct script access allowed');

class DataHelper_model extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    public function lastInsert($table, $column, $type)
    {
        $row = $this->db->select($column)->like('faktur', $type . '.', 'after')->order_by($column, "DESC")->limit(1)->get($table)->row();
        if ($row != null) {
            return $row->$column;
        }
    }

    public function getRowField($table, $col, $value, $getCol)
    {
        $row = $this->db->select()->where($col, $value)->where('status_jual', 0)->get($table)->row();
        if ($row != null) {
            return $row->$getCol;
        } else {
            return null;
        }
    }

    public function getDataField($table, $col, $value, $getCol)
    {
        $row = $this->db->select()->where($col, $value)->get($table)->row();
        if ($row != null) {
            return $row->$getCol;
        } else {
            return null;
        }
    }

    public function getDataFieldDouble($table, $col1, $value1, $col2, $value2, $getCol)
    {
        $row = $this->db->select()->where($col1, $value1)->where($col2, $value2)->get($table)->row();
        if ($row != null) {
            return $row->$getCol;
        } else {
            return null;
        }
    }

    public function getAllData($table)
    {
        $data = $this->db->select()->get($table)->result();
        if ($data != null) {
            return $data;
        } else {
            return null;
        }
    }

    public function autoKode($table, $col, $type)
    {
        $check = $this->db->select($col)->from($table)->like($col, $type, 'after')->get()->num_rows();
        if ($check > 0) {
            $kode = $this->db->select($col)->from($table)->like($col, $type, 'after')->order_by($col, "DESC")->limit(1)->get()->row()->$col;
            $noUrut = (int) substr($kode, 3, 8);
            $noUrut++;
            $kode = $type . sprintf("%07d", $noUrut);
        } else {
            $kode = $type . '0000001';
        }
        return $kode;
    }

    public function fakturID($type)
    {
        $check = $this->db->get('faktur')->num_rows();
        $lastDateInsert = strtotime($this->lastInsert('faktur', "date", $type));
        $now = strtotime(date('Y-m-d'));

        if ($check > 0 && $lastDateInsert != NULL) {
            if ($now == $lastDateInsert) {
                $kode = $this->db->select('faktur')->from('faktur')->like('faktur', $type . '.', 'after')->order_by('faktur', "DESC")->limit(1)->get()->row()->faktur;
                $no = explode('.', $kode);
                $no = $no[2];
                $noUrut = (int) substr($no, 1, 4);
                $noUrut++;
                $fakturID = $type . '.' . date("ymdHis") . '.' . sprintf("%04d", $noUrut);
            } else {
                $fakturID = $type . '.' . date("ymdHis") . '.0001';
            }
        } else {
            $fakturID = $type . '.' . date("ymdHis") . '.0001';
        }
        return $fakturID;
        // return $this->lastInsert('faktur', "date") . " | " . $lastDateInsert . " | " . date('Y-m-d') . " | " . $now;
    }

    public function fakturData($type, $add)
    {
        $check = $this->db->get('faktur')->num_rows();

        if ($check > 0) {
            $fakturID =  $this->lastInsert('faktur', "id", $type);
            $fakturID = $fakturID + 1;
            $fakturID = $type . '.' . date("ymdHis") . '.' . sprintf("%04d", $fakturID);
        } else {
            $fakturID = $type . '.' . date("ymdHis") . '.0001';
        }
        return $fakturID . '-' . $add;
    }

    public function getData($table, $col, $kode)
    {
        $result = $this->db->get_where($table, [$col => $kode])->row();
        if ($result != null || $result != '') {
            return $result;
        } else {
            return null;
        }
    }

    public function getWhere($table, $col, $kode)
    {
        $result = $this->db->get_where($table, [$col => $kode])->result();
        if ($result != null || $result != '') {
            return $result;
        } else {
            return null;
        }
    }

    public function checkData($table, $col, $id, $userID)
    {
        $this->db->from($table);
        $this->db->where($col, $id)->where('status_proses', 0)->where('session', $userID);
        return $this->db->count_all_results();
    }

    public function checkBarangJual($table, $col, $id)
    {
        $this->db->from($table);
        $this->db->where($col, $id)->where('status', 'J');
        return $this->db->count_all_results();
    }

    public function checkDataBuyback($table, $col, $id, $faktur)
    {
        $this->db->from($table);
        $this->db->where($col, $id)->where('status_jual', 1)->where('faktur', $faktur);
        return $this->db->count_all_results();
    }

    public function checkFaktur($table, $col, $id)
    {
        $this->db->from($table);
        $this->db->where($col, $id)->where('status_faktur', 0);
        return $this->db->count_all_results();
    }

    public function countWhere($table, $col, $id)
    {
        $this->db->from($table);
        $this->db->where($col, $id);
        return $this->db->count_all_results();
    }

    public function countWhereDouble($table, $col1, $id1, $col2, $id2)
    {
        $this->db->from($table);
        $this->db->where($col1, $id1)->where($col2, $id2);
        return $this->db->count_all_results();
    }

    public function countInstok($table)
    {
        $this->db->from($table);
        $status = array('J', 'S', 'R');
        $this->db->where_not_in('status', $status);
        return $this->db->count_all_results();
    }

    public function countWhereBarang($table, $col, $val)
    {
        $this->db->from($table);
        if ($val != NULL) {
            $this->db->where($col, $val);
        } else {
            $status = array('J', 'S', 'R');
            $this->db->where_not_in('status', $status);
        }
        return $this->db->count_all_results();
    }

    public function checkStatusJual($table, $col, $id)
    {
        $this->db->from($table);
        $this->db->where($col, $id)->where('status_jual', 1);
        return $this->db->count_all_results();
    }

    public function countData($table)
    {
        return $this->db->count_all($table);
    }

    public function checkStatusDetail($table, $col, $id)
    {
        $this->db->from($table);
        $this->db->where($col, $id)->where('status_proses', 0)->where('faktur', '-');
        return $this->db->count_all_results();
    }

    public function sumWhere($table, $colSum, $col, $id)
    {
        $this->db->select_sum($colSum);
        $this->db->where($col, $id);
        return $this->db->get($table)->row()->$colSum;
    }

    public function sumData($table, $col, $userId)
    {
        $this->db->select_sum($col);
        $this->db->where('status_proses', 0)->where('faktur', '-')->where('session', $userId);
        return $this->db->get($table)->row()->$col;
    }

    public function sumIncome($table, $col, $ref)
    {
        $this->db->select_sum($col);
        $this->db->where('referensi', $ref);
        return $this->db->get($table)->row()->$col;
    }

    public function monthlySum($table, $col, $val)
    {
        $vbulan = date("m", strtotime($val));
        $vtahun = date("Y", strtotime($val));
        $this->db->select_sum($col);
        $this->db->where("strftime('%m',date)", $vbulan)->where("strftime('%Y',date)", $vtahun);
        return $this->db->get($table)->row()->$col;
    }

    public function grafikDataDaily($table, $col, $group)
    {
        $this->db->select($group);
        $this->db->select_sum($col);
        $this->db->group_by($group);
        $this->db->order_by($group, 'asc');
        $this->db->limit(14);
        return $this->db->get($table)->result();
    }

    public function grafikDataMonthly($table, $col, $group)
    {
        $startDate = date('Y-m-d', strtotime("-6 MONTH"));
        $endDate   = date('Y-m-d', strtotime("now"));
        $this->db->select($group);
        $this->db->select_sum($col);
        $this->db->where($group . '>=', $startDate)->where($group . '<=', $endDate);
        $this->db->group_by("strftime('%m-%Y', $group)");
        $this->db->order_by($group, 'asc');
        return $this->db->get($table)->result();
    }

    public function grafikDataYearly($table, $col, $group)
    {
        $this->db->select($group);
        $this->db->select_sum($col);
        $this->db->group_by('YEAR(' . ($group) . ')');
        $this->db->order_by($group, 'asc');
        return $this->db->get($table)->result();
    }

    public function IPServer()
    {
        $host = gethostname();
        $ip = gethostbyname($host);
        return $ip;
    }

    public function scynchSaldo()
    {
        $noRekeningSaldo = $this->db->get('saldo')->result();

        foreach ($noRekeningSaldo as $data) {
            // $saldo_now = $this->db->select_sum('pemasukan', 'total')->where('source', $data->no_rekening)->get('faktur')->row();
            $saldo_now = $this->db->query("SELECT SUM(pemasukan - pengeluaran) AS total FROM faktur WHERE source = '$data->no_rekening'")->row();
            // $should_saldo = ($saldo_now->total == null) ? 0 : $saldo_now->total;
            $should_saldo = ($saldo_now->total == null) ? 0 : (($data->jenis != "AKTIVA TETAP") ? $saldo_now->total : 0);
            $this->db->query("UPDATE saldo SET saldo = $should_saldo where no_rekening = '$data->no_rekening' ");
        }

        return true;
    }
}
