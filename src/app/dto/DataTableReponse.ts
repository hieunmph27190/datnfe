

export class DataTableReponse<T> {
    'draw': number;  
    'recordsTotal': number;
    'recordsFiltered': number;
    "page":number;
    "size":number;
    "totalPage":number;
    'data': T[];
}
