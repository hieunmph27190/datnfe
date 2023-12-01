

export class DataTableReponse<T> {
    'draw': number;  // UUID được xử lý như một chuỗi
    'recordsTotal': number;
    'recordsFiltered': number;
    'data': T[];
}
