
export class Customer {
    'id': string;          // UUID được xử lý như một chuỗi
    'type': number;
    'dateOfBirth': Date;   // Date trong Java được giữ nguyên trong TypeScript
    'email': string;
    'gender': boolean;     // Boolean trong Java tương đương với boolean trong TypeScript
    'image': string;       // Blob trong Java có thể được thay thế bằng một chuỗi mã hóa Base64 hoặc URL
    'name': string;
    'phoneNumber': string;
    'ward': string;
    'city': string;
    'district': string;
    'address': string;
    'createDate': Date;    // Timestamp được thay thế bằng Date
    'password': string;

    constructor(
        id: string, type: number, dateOfBirth: Date, email: string, gender: boolean,
        image: string, name: string, phoneNumber: string, ward: string,
        city: string, district: string, address: string, createDate: Date, password: string
    ) {
        this['id'] = id;
        this['type'] = type;
        this['dateOfBirth'] = dateOfBirth;
        this['email'] = email;
        this['gender'] = gender;
        this['image'] = image;
        this['name'] = name;
        this['phoneNumber'] = phoneNumber;
        this['ward'] = ward;
        this['city'] = city;
        this['district'] = district;
        this['address'] = address;
        this['createDate'] = createDate;
        this['password'] = password;
    }
}
