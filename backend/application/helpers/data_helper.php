<?php defined('BASEPATH') or exit('No direct script access allowed');

if (!function_exists('getBarangID')) {
    function getBarangID($kode, $col)
    {
        $CI = get_instance();
        $CI->load->model('DataHelper_model');
        return $CI->DataHelper_model->getData("data_barang", "kode_barang", $kode)->$col;
    }
}

if (!function_exists('getWhere')) {
    function getWhere($table, $col, $kode)
    {
        $CI = get_instance();
        $CI->load->model('DataHelper_model');
        return $CI->DataHelper_model->getWhere($table, $col, $kode);
    }
}

if (!function_exists('getFakturID')) {
    function getFakturID($fakturID, $col)
    {
        $CI = get_instance();
        $CI->load->model('DataHelper_model');
        return $CI->DataHelper_model->getData("faktur", "faktur", $fakturID)->$col;
    }
}

if (!function_exists('getAksesID')) {
    function getAksesID($aksesID)
    {
        $CI = get_instance();
        $CI->load->model('DataHelper_model');
        return $CI->DataHelper_model->getData("akses", "id", $aksesID)->level;
    }
}

if (!function_exists('getPelangganID')) {
    function getPelangganID($id, $col)
    {
        $CI = get_instance();
        $CI->load->model('DataHelper_model');
        return $CI->DataHelper_model->getData("pelanggan", "id", $id)->$col;
    }
}

if (!function_exists('getSupplierID')) {
    function getSupplierID($id, $col)
    {
        $CI = get_instance();
        $CI->load->model('DataHelper_model');
        return $CI->DataHelper_model->getData("supplier", "id", $id)->$col;
    }
}

if (!function_exists('getUserID')) {
    function getUserID($id, $col)
    {
        $CI = get_instance();
        $CI->load->model('DataHelper_model');
        return $CI->DataHelper_model->getData("user", "id", $id)->$col;
    }
}

if (!function_exists('getPengaturan')) {
    function getPengaturan($col)
    {
        $CI = get_instance();
        $CI->load->model('DataHelper_model');
        return $CI->DataHelper_model->getData("pengaturan", "id", 1)->$col;
    }
}

if (!function_exists('checkData')) {
    function checkData($table, $col, $kode, $userID)
    {
        $CI = get_instance();
        $CI->load->model('DataHelper_model');
        return $CI->DataHelper_model->checkData($table, $col, $kode, $userID);
    }
}

if (!function_exists('checkBarangJual')) {
    function checkBarangJual($table, $col, $kode)
    {
        $CI = get_instance();
        $CI->load->model('DataHelper_model');
        return $CI->DataHelper_model->checkBarangJual($table, $col, $kode);
    }
}

if (!function_exists('checkDataBuyback')) {
    function checkDataBuyback($table, $col, $kode, $faktur)
    {
        $CI = get_instance();
        $CI->load->model('DataHelper_model');
        return $CI->DataHelper_model->checkDataBuyback($table, $col, $kode, $faktur);
    }
}

if (!function_exists('checkFaktur')) {
    function checkFaktur($table, $col, $kode)
    {
        $CI = get_instance();
        $CI->load->model('DataHelper_model');
        return $CI->DataHelper_model->checkFaktur($table, $col, $kode);
    }
}

if (!function_exists('getRowField')) {
    function getRowField($table, $col, $val, $getCol)
    {
        $CI = get_instance();
        $CI->load->model('DataHelper_model');
        return $CI->DataHelper_model->getRowField($table, $col, $val, $getCol);
    }
}

if (!function_exists('getDataField')) {
    function getDataField($table, $col, $val, $getCol)
    {
        $CI = get_instance();
        $CI->load->model('DataHelper_model');
        return $CI->DataHelper_model->getDataField($table, $col, $val, $getCol);
    }
}

if (!function_exists('getDataFieldDouble')) {
    function getDataFieldDouble($table, $col1, $value1, $col2, $value2, $getCol)
    {
        $CI = get_instance();
        $CI->load->model('DataHelper_model');
        return $CI->DataHelper_model->getDataFieldDouble($table, $col1, $value1, $col2, $value2, $getCol);
    }
}

if (!function_exists('getAllData')) {
    function getAllData($table)
    {
        $CI = get_instance();
        $CI->load->model('DataHelper_model');
        return $CI->DataHelper_model->getAllData($table);
    }
}

if (!function_exists('countWhere')) {
    function countWhere($table, $col, $kode)
    {
        $CI = get_instance();
        $CI->load->model('DataHelper_model');
        return $CI->DataHelper_model->countWhere($table, $col, $kode);
    }
}

if (!function_exists('countWhereDouble')) {
    function countWhereDouble($table, $col1, $id1, $col2, $id2)
    {
        $CI = get_instance();
        $CI->load->model('DataHelper_model');
        return $CI->DataHelper_model->countWhereDouble($table, $col1, $id1, $col2, $id2);
    }
}

if (!function_exists('checkStatusJual')) {
    function checkStatusJual($table, $col, $kode)
    {
        $CI = get_instance();
        $CI->load->model('DataHelper_model');
        return $CI->DataHelper_model->checkStatusJual($table, $col, $kode);
    }
}

if (!function_exists('countData')) {
    function countData($table)
    {
        $CI = get_instance();
        $CI->load->model('DataHelper_model');
        return $CI->DataHelper_model->countData($table);
    }
}

if (!function_exists('checkStatusDetail')) {
    function checkStatusDetail($table, $col, $id)
    {
        $CI = get_instance();
        $CI->load->model('DataHelper_model');
        return $CI->DataHelper_model->checkStatusDetail($table, $col, $id);
    }
}

if (!function_exists('sumData')) {
    function sumData($table, $col, $id)
    {
        $CI = get_instance();
        $CI->load->model('DataHelper_model');
        return $CI->DataHelper_model->sumData($table, $col, $id);
    }
}

if (!function_exists('sumWhere')) {
    function sumWhere($table, $colSum, $col, $id)
    {
        $CI = get_instance();
        $CI->load->model('DataHelper_model');
        return $CI->DataHelper_model->sumWhere($table, $colSum, $col, $id);
    }
}
