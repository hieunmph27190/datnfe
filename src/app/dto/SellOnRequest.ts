import { SellOnProductRequest } from "./SellOnProductRequest";


export class SellOnRequest {
    'sanPhams': any[];
    'phoneNumber': string;
    'address': string;
    'city': string;
    'district': string;
    'ward': string;
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
      setCity(city: string) {
         this['city'] = city;
      }
      setDistrict(district: string) {
         this['district'] = district;
      }
      setWard(ward: string) {
         this['ward'] = ward;
      }


      setAddress(address: string) {
          this['address'] = address;
      }


      setNote(note: string) {
          this['note'] = note;
      }




}
