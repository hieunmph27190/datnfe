import { SellOnProductRequest } from "./SellOnProductRequest";


export class SellOnRequest {
    'sanPhams': any[];  
    'phoneNumber': string;
    'address': string;
    'note': string;

     constructor(sanPhams: any[] ) {
        this['sanPhams'] = sanPhams;
      }

      setSanPhams(sanPhams: any[]) {
         this['sanPhams'] = sanPhams;
      }


      setPhoneNumber(phoneNumber: string) {
         this['phoneNumber'] = phoneNumber;
      }


      setAddress(address: string) {
          this['address'] = address;
      }


      setNote(note: string) {
          this['note'] = note;
      }




}
