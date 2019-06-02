import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Dictionary, KeyValuePair } from './dictionary';
import { IEnumerable, IComparer } from './interfaces';
import { IList, List } from './list';

//import { IEnumerable, List, IComparer } from './list';

describe('Dictionary', () => {

  beforeEach(async(() => {

  }));

  beforeEach(() => {

  });

  it('add', () => {
    let dictionary = new Dictionary<Car, IList<Feature>>();

    let car = new Car(1, "Mercedez", "S 400", Country.Germany);

    let features = new List<Feature>();

    let feature = new Feature(1, "2 - Door Sedan");

    features.add(feature);

    dictionary.add(car, features);

    expect(dictionary.length == 1);
    expect(dictionary.containsKey(car));
    expect(dictionary.containsValue(features));
    expect(dictionary.tryGetValue(car).length == 1);
  });

  it('add fail', () => {
    let dictionary = new Dictionary<Car, IList<Feature>>();

    let car = new Car(1, "Mercedez", "S 400", Country.Germany);

    let features = new List<Feature>();

    let feature = new Feature(1, "2 - Door Sedan");

    features.add(feature);

    dictionary.add(car, features);

    car = new Car(1, "Mercedez", "S 400", Country.Germany);

    try {
        dictionary.add(car, features);
    }
    catch(e) {
        expect(e == "Duplicate key. Cannot add.");
    }
  });  

  it('remove', () => {
    let dictionary = new Dictionary<Car, IList<Feature>>();

    let car = new Car(1, "Mercedez", "S 400", Country.Germany);
    let car2 = new Car(2, "Jaguar", "J 500", Country.England);

    let features = new List<Feature>();

    let feature = new Feature(1, "2 - Door Sedan");

    features.add(feature);

    dictionary.add(car, features);

    features = new List<Feature>();

    feature = new Feature(2, "4 - Door Sedan");

    features.add(feature);

    dictionary.add(car2, features);

    expect(dictionary.length == 2);

    dictionary.remove(x => x.key.country == Country.Germany);

    expect(dictionary.length == 1);    
  });

  it('where', () => {
    let dictionary = new Dictionary<Car, IList<Feature>>();

    let car = new Car(1, "Mercedez", "S 400", Country.Germany);
    let car2 = new Car(2, "Jaguar", "J 500", Country.England);

    let features = new List<Feature>();

    let feature = new Feature(1, "2 - Door Sedan");

    features.add(feature);

    dictionary.add(car, features);

    features = new List<Feature>();

    feature = new Feature(2, "4 - Door Sedan");

    features.add(feature);

    dictionary.add(car2, features);

    let result = dictionary.where(x => x.value.any(x => x.name == "4 - Door Sedan"));

    expect(result.first().key.id == 2);
  });  

  it('singleOrDefault', () => {
    let dictionary = new Dictionary<Car, IList<Feature>>();

    let car = new Car(1, "Mercedez", "S 400", Country.Germany);
    let car2 = new Car(2, "Jaguar", "J 500", Country.England);

    let features = new List<Feature>();

    let feature = new Feature(1, "2 - Door Sedan");

    features.add(feature);

    dictionary.add(car, features);

    features = new List<Feature>();

    feature = new Feature(2, "4 - Door Sedan");

    features.add(feature);

    dictionary.add(car2, features);

    let result = dictionary.singleOrDefault(x => x.key.country == Country.Germany);

    expect(result.key.id == 1);    
  });

  it('firstOrDefault', () => {
    let dictionary = new Dictionary<Car, IList<Feature>>();

    let car = new Car(1, "Mercedez", "S 400", Country.Germany);
    let car2 = new Car(2, "Mercedez", "S 500", Country.Germany);

    let features = new List<Feature>();

    let feature = new Feature(1, "2 - Door Sedan");

    features.add(feature);

    dictionary.add(car, features);

    features = new List<Feature>();

    feature = new Feature(2, "4 - Door Sedan");

    features.add(feature);

    dictionary.add(car2, features);

    let first = dictionary.firstOrDefault(x => x.key.name == "Mercedez");

    expect(first.key.id = 1);
  });  

  it('singleOrDefault fail', () => {
    let dictionary = new Dictionary<Car, IList<Feature>>();

    let car = new Car(1, "Mercedez", "S 400", Country.Germany);
    let car2 = new Car(2, "Mercedez", "S 500", Country.Germany);

    let features = new List<Feature>();

    let feature = new Feature(1, "2 - Door Sedan");

    features.add(feature);

    dictionary.add(car, features);

    features = new List<Feature>();

    feature = new Feature(2, "4 - Door Sedan");

    features.add(feature);

    dictionary.add(car2, features);

    try {
        let single = dictionary.singleOrDefault(x => x.key.name == "Mercedez");
    }
    catch (e) {
        expect(e == "Multiple instances of entity found.");
    }    
  });

  it('join', () => {

  });

  it('groupBy', () => {

  });
  
  it('groupBy multiple fields', () => {

  });  
  
  it('orderBy', () => {
    let dictionary = new Dictionary<Car, IList<Feature>>();

    let car = new Car(1, "Mercedez", "S 400", Country.Germany);
    let car2 = new Car(2, "Jaguar", "J 500", Country.England);

    let features = new List<Feature>();

    let feature = new Feature(1, "2 - Door Sedan");

    features.add(feature);

    dictionary.add(car, features);

    features = new List<Feature>();

    feature = new Feature(2, "4 - Door Sedan");

    features.add(feature);

    dictionary.add(car2, features);

    let result = dictionary.orderBy(new ComparerByCarName());

    expect(result.toArray()[0].key.name == "Jaguar");
    expect(result.toArray()[1].key.name == "Mercedez");
  });

  it('union', () => {
    let dictionary = new Dictionary<Car, IList<Feature>>();

    let car = new Car(1, "Mercedez", "S 400", Country.Germany);
    let car2 = new Car(2, "Jaguar", "J 500", Country.England);

    let features = new List<Feature>();

    let feature = new Feature(1, "2 - Door Sedan");

    features.add(feature);

    dictionary.add(car, features);

    features = new List<Feature>();

    feature = new Feature(2, "4 - Door Sedan");

    features.add(feature);

    dictionary.add(car2, features);


    let dictionary2 = new Dictionary<Car, IList<Feature>>();

    car = new Car(1, "Volvo", "V 400", Country.Germany);
    car2 = new Car(2, "Ford", "F 500", Country.US);

    features = new List<Feature>();

    feature = new Feature(1, "2 - Door Sedan");

    features.add(feature);

    dictionary2.add(car, features);

    features = new List<Feature>();

    feature = new Feature(2, "4 - Door Sedan");

    features.add(feature);

    dictionary2.add(car2, features);

    let result = dictionary.union(dictionary2);

    expect(result.length == 4);    
  });  
});

enum Country {
    US,
    Germany,
    England
}

class Car {
    id: number;
    name: string;
    model: string;
    country: Country;

    constructor(id: number, name: string, model: string, country: Country) {
        this.id = id;
        this.name = name;
        this.country = country;
    }
}

class Feature {
    name: string;
    carId: number;

    constructor(carId: number, name: string) {
        this.carId = carId;
        this.name = name;
    }
}

class ComparerByCarName implements IComparer<KeyValuePair<Car, IList<Feature>>> {
    compare(x: KeyValuePair<Car, IList<Feature>>, y: KeyValuePair<Car, IList<Feature>>) : number {
        if (x.key.name > y.key.name) {            
            return 1;
        }

        return -1;        
    }
}