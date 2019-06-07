import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Dictionary, KeyValuePair } from './dictionary';
import { IEnumerable, IComparer } from './interfaces';
import { IList, List } from './list';

describe('Dictionary', () => {

  beforeEach(async(() => {

  }));

  beforeEach(() => {

  });

  it('instantiate dictionary from json', () => {
    let jsonKeyValuePairArray = '[{"key": 1, "value": {"id":1, "name": "Mercedez", "model": "S 400", "country": "Germany", "isLuxury": true }},{"key": 2, "value": {"id":2, "name": "Ford", "model": "F 100", "country": "US", "isLuxury": false }}]';
    
    let keyValueArray: KeyValuePair<number, Car>[] = JSON.parse(jsonKeyValuePairArray);

    let list = new Dictionary<number, Car>(keyValueArray);

    var luxuryCars = list.where(x => x.value.isLuxury);

    expect(list.length == 1);
    expect(luxuryCars.toArray()[0].value.model == "Mercedez");
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

    let result = dictionary.groupBy(x => [x.key.country]);

    expect(result.toArray()[0].groups[0] == Country.Germany);
    expect(result.toArray()[1].groups[0] == Country.England);
  });
  
  it('groupBy multiple fields', () => {
    let dictionary = new Dictionary<Car, IList<Feature>>();

    let car = new Car(1, "Mercedez", "S 400", Country.Germany, true);
    let car2 = new Car(2, "Jaguar", "J 500", Country.England, true);
    let car3 = new Car(3, "Ford", "F 500", Country.US);

    let features = new List<Feature>();

    let feature = new Feature(1, "2 - Door");

    features.add(feature);

    feature = new Feature(1, "Sedan");

    features.add(feature);

    dictionary.add(car, features);

    features = new List<Feature>();

    feature = new Feature(1, "4 - Door");

    features.add(feature);

    feature = new Feature(1, "Sedan");

    features.add(feature);

    dictionary.add(car2, features);

    features = new List<Feature>();

    feature = new Feature(1, "4 - Door");

    features.add(feature);

    feature = new Feature(1, "Hatchback");

    features.add(feature);

    dictionary.add(car3, features);

    let result = dictionary.groupBy(x => [x.key.isLuxury, x.key.country]);

    expect(result.toArray().length == 2);

    expect(result.toArray()[0].groups[0] == false);
    expect(result.toArray()[0].groups[1] == Country.US);
    expect(result.toArray()[0].list.toArray()[0].key.id == 3);

    expect(result.toArray()[1].groups[0] == true);
    expect(result.toArray()[1].groups[1] == Country.England);
    expect(result.toArray()[1].list.toArray()[0].key.id == 2);    

    expect(result.toArray()[1].groups[0] == true);
    expect(result.toArray()[1].groups[1] == Country.Germany);
    expect(result.toArray()[1].list.toArray()[0].key.id == 1);    
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
    isLuxury: boolean;

    constructor(id: number, name: string, model: string, country: Country, isLuxury: boolean = false) {
        this.id = id;
        this.name = name;
        this.country = country;
        this.isLuxury = isLuxury;
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