import { Role } from "./Role";

export class Customer {
    'userid': number;
    'email': string;
    'name': string;
    'password': string;
    'image': string;
    'address': string;
    'phone': string;
    'gender': boolean;
    'registerDate': Date;
    'status': boolean;
    'roles': Role[];
    'token': string;

    constructor(id: number) {
        this.userid = id;
    }
}
