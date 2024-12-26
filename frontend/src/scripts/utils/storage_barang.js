const StorageBarang =  {
    
    async makeStore(){
        this._data = [];
    },

    isReady(kode){
        const result = this._data.map((e) => { return e.kode_barang; }).indexOf(`${kode}`);
        let value = false
        if (result != -1) {
            value = true
        }
        return value;
    },

    async pushData(kode_barang , status_barang){
        let gold = {
            "kode_barang": `${kode_barang}`,
            "status_barang": `${status_barang}`,
           }
        this._data.push(gold);
    },

    async deleteData(kode){
        let removeIndex = this._data.map((item)=> { return item.kode_barang; }).indexOf(`${kode}`);
        this._data.splice(removeIndex, 1)
    },

    async size(){
       return this._data.length
    },

    async getData(){
        return this._data;
    }
}


export default StorageBarang;