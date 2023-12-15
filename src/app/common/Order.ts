import { Customer } from "./Customer";
import { Employee } from "./Employee";

export class Order {
    'id': string;  // UUID được xử lý như một chuỗi
    'billCreateDate': Date; // Timestamp được thay thế bằng Date
    'paymentTime': Date;    // Tương tự như trên
    'paymentType': number;
    'type': number;
    'shipeFee': number;      // BigDecimal trong Java có thể được xử lý như một number hoặc string
    'paymentAmount': number; // Tương tự như trên
    'phoneNumber': string;
    'address': string;
    'note': string;
    'customer': Customer;   // Giả sử Customer là một class khác bạn đã định nghĩa
    'employee': Employee;   // Giả sử Employee là một class khác bạn đã định nghĩa
    'paymentEmployee': Employee; // Tương tự như trên

    constructor(
        id: string, billCreateDate: Date, paymentTime: Date, paymentType: number, type: number,
        shipFee: number, paymentAmount: number, phoneNumber: string, address: string, note: string,
        customer: Customer, employee: Employee, paymentEmployee: Employee
    ) {
        this['id'] = id;
        this['billCreateDate'] = billCreateDate;
        this['paymentTime'] = paymentTime;
        this['paymentType'] = paymentType;
        this['type'] = type;
        this['shipeFee'] = shipFee;
        this['paymentAmount'] = paymentAmount;
        this['phoneNumber'] = phoneNumber;
        this['address'] = address;
        this['note'] = note;
        this['customer'] = customer;
        this['employee'] = employee;
        this['paymentEmployee'] = paymentEmployee;
    }
}
