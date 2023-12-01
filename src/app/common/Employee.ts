import { Role } from "./Role";

export class Employee {
    'id': string;          // UUID được xử lý như một chuỗi trong TypeScript
    'password': string;
    'type': number;
    'userName': string;
    'address': string;
    'dateOfBirth': Date;   // Date trong Java được giữ nguyên trong TypeScript
    'email': string;
    'gender': boolean;     // Boolean trong Java tương đương với boolean trong TypeScript
    'image': string;       // Blob trong Java có thể được thay thế bằng một chuỗi mã hóa Base64 hoặc URL
    'phoneNumber': string;
    'name': string;
    'createDate': Date;    // Timestamp được thay thế bằng Date
    'role': Role;          // Giả sử Role là một class khác bạn đã định nghĩa

    constructor(
        id: string, password: string, type: number, userName: string, address: string,
        dateOfBirth: Date, email: string, gender: boolean, image: string,
        phoneNumber: string, name: string, createDate: Date, role: Role
    ) {
        this['id'] = id;
        this['password'] = password;
        this['type'] = type;
        this['userName'] = userName;
        this['address'] = address;
        this['dateOfBirth'] = dateOfBirth;
        this['email'] = email;
        this['gender'] = gender;
        this['image'] = image;
        this['phoneNumber'] = phoneNumber;
        this['name'] = name;
        this['createDate'] = createDate;
        this['role'] = role;
    }
}
