

export interface Warehouse {
  id?:     number;
  code:    number;
  name:    string;
  addres:  string;
  country?: string;
  zip?:     number;
  list:    string[];
  latLng?: [number,number];
  // TODO:poner latitud y longitud como obligatoria
}

