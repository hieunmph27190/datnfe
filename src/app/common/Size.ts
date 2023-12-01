
export class Size {
    'id': string;       // UUID sẽ được xử lý như một chuỗi trong TypeScript
    'code': string;
    'size': number;
    'type': number;
    'createDate': Date; // Timestamp được thay thế bằng Date trong TypeScript

    constructor(id: string, code: string, size: number, type: number, createDate: Date) {
        this['id'] = id;
        this['code'] = code;
        this['size'] = size;
        this['type'] = type;
        this['createDate'] = createDate;
}
}