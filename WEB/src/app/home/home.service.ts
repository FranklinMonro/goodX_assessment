import { Injectable } from '@angular/core';

export interface DataType {
  value: string | number | boolean,
  name: string,
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor() { }

  public getRelaitionshipOptions = (): DataType[] => {
    return [
      { value: 'Husband', name: 'Husband' },
      { value: 'Wife', name: 'Wife' },
      { value: 'Son', name: 'Son' },
      { value: 'Daughter', name: 'Daughter' },
    ];
  };

  public getMainOptions = (): DataType[] => {
    return [
      { value: true, name: 'Yes' },
      { value: false, name: 'No' },
    ];
  };
}
