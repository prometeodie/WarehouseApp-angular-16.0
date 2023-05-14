

export interface Warehouse {
  id:      number;
  code:    number;
  name:    string;
  addres:  string;
  country: string;
  zip:     number;
  list:    List[];
}

export interface List {
  cosa: string;
}
