

export class DataTableReponse<T> {
    'draw': number;  
    'recordsTotal': number;
    'recordsFiltered': number;
    'data': T[];
}
