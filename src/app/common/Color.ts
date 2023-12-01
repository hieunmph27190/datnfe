
export class Color {
    'id': string;       // UUID sẽ được xử lý như một chuỗi trong TypeScript
    'code': string;
    'name': string;
    'type': number;
    'createDate': Date; // Timestamp được thay thế bằng Date trong TypeScript

    constructor(id: string, code: string, name: string, type: number, createDate: Date) {
        this['id'] = id;
        this['code'] = code;
        this['name'] = name;
        this['type'] = type;
        this['createDate'] = createDate;

}
}