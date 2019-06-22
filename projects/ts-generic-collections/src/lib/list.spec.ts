import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { List, IList } from './list';
import { IEnumerable, IComparer, IEqualityComparer } from './interfaces';
import { ITEM_NOT_FOUND_MSG, MULTIPLE_INSTANCES_FOUND_MSG } from './common';

//using distribution
//import { List, IEnumerable, IComparer, IEqualityComparer, ITEM_NOT_FOUND_MSG, MULTIPLE_INSTANCES_FOUND_MSG  } from '../../../../dist/ts-generic-collections';

describe('List', () => {

  beforeEach(async(() => {

  }));

  beforeEach(() => {

  });

  it('instantiate list from json', () => {
    let jsonOwnerArray = '[{"id":1, "name": "John Doe"},{"id":2, "name": "Jane Doe"}]';

    let ownerArray: Owner[] = JSON.parse(jsonOwnerArray);

    let list = new List(ownerArray);

    var jane = list.singleOrDefault(x => x.id == 2);

    expect(list.length == 2);
    expect(jane.name == "Jane Doe");
  });

  it('add', () => {
    let list = new List<Owner>();

    let owner = new Owner();
    owner.name = "John Doe";

    //add
    list.add(owner);

    expect(list.length == 1).toBeTruthy();
  });

  it('addRange', () => {
    let list = new List<Owner>();

    let owner = new Owner();
    owner.name = "John Doe";

    list.add(owner);

    let array = new Array<Owner>();

    owner = new Owner();
    owner.name = "Jane Doe";

    array.push(owner);

    owner = new Owner();
    owner.name = "Peter Smith";

    array.push(owner);

    list.addRange(array);

    expect(list.length == 3);
  });  

  it('remove', () => {
    let list = new List<Owner>();

    let owner = new Owner();
    owner.name = "John Doe";
    list.add(owner);

    owner = new Owner();
    owner.name = "Jane Doe";
    list.add(owner);

    //remove
    list.remove(owner => owner.name.includes('Doe'));

    expect(list.length === 0).toBeTruthy();
  });

  it('elementAt', () => {
    let list = new List<Owner>();

    let owner = new Owner();
    owner.name = "John Doe";
    list.add(owner);

    owner = new Owner();
    owner.name = "Jane Doe";
    list.add(owner);

    //remove
    let result = list.elementAt(1);

    expect(result.name == "Jane Doe").toBeTruthy();
  });

  it('any', () => {
    let list = new List<Owner>();

    let owner = new Owner();
    owner.name = "John Doe";
    list.add(owner);

    owner = new Owner();
    owner.name = "Jane Doe";
    list.add(owner);

    //remove
    let result = list.any(x => x.name == "Jane Doe");

    expect(result).toBeTruthy();
  });

  it('all', () => {
    let list = new List<Owner>();

    let owner = new Owner();
    owner.name = "John Doe";
    list.add(owner);

    owner = new Owner();
    owner.name = "Jane Doe";
    list.add(owner);

    //remove
    let result = list.all(x => x.name.includes("Doe"));

    expect(result).toBeTruthy();
  });

  it('where', () => {
    let owners = new List<Owner>();

    let owner = new Owner();
    owner.id = 1;
    owner.name = "John Doe";
    owners.add(owner);

    owner = new Owner();
    owner.id = 2;
    owner.name = "Jane Doe";
    owners.add(owner);    

    let pets = new List<Pet>();

    let pet = new Pet();
    pet.ownerId = 2;
    pet.name = "Sam";
    pet.sex = Sex.M;

    pets.add(pet);

    pet = new Pet();
    pet.ownerId = 1;
    pet.name = "Jenny";
    pet.sex = Sex.F;

    pets.add(pet);

    //Get owners who have Female pets
    let ownersWhoHaveFemalePets = owners.join(pets, owner => owner.id, pet => pet.ownerId, (x, y) => new OwnerPet(x,y))
                                        .where(x => x.pet.sex == Sex.F)
                                        .select(x => x.owner);

    expect(ownersWhoHaveFemalePets.length === 1).toBeTruthy();
    expect(ownersWhoHaveFemalePets.toArray()[0].name = "John Doe").toBeTruthy();                      
  });
  
  it('singleOrDefault', () => {
    let list = new List<Owner>();

    let owner = new Owner();
    owner.name = "John Doe";
    list.add(owner);

    owner = new Owner();
    owner.name = "Jane Doe";
    list.add(owner);

    //singleOrDefault
    let ownerResult = list.singleOrDefault(owner => owner.name == 'John Doe');

    expect(ownerResult.name == "John Doe").toBeTruthy();
  });

  it('singleOrDefault fail', () => {
    let list = new List<Owner>();

    let owner = new Owner();
    owner.name = "John Doe";
    list.add(owner);

    owner = new Owner();
    owner.name = "Jane Doe";
    list.add(owner);    

    try
    {
        //singleOrDefault fail
        let ownerResult = list.singleOrDefault(owner => owner.name.includes('Doe'));    
    }
    catch(e) {
        expect(e == MULTIPLE_INSTANCES_FOUND_MSG).toBeTruthy();
    }    
  });

  it('single', () => {
    let list = new List<Owner>();

    let owner = new Owner();
    owner.name = "John Doe";
    list.add(owner);

    owner = new Owner();
    owner.name = "Jane Doe";
    list.add(owner);

    //single
    let ownerResult = list.single(owner => owner.name == 'John Doe');

    expect(ownerResult.name == "John Doe").toBeTruthy();
  });
  
  it('single fail', () => {
    let list = new List<Owner>();

    let owner = new Owner();
    owner.name = "John Doe";
    list.add(owner);

    owner = new Owner();
    owner.name = "Jane Doe";
    list.add(owner);

    try
    {
      //single
      let ownerResult = list.single(owner => owner.name == 'Peter Smith');
    }
    catch(e) {
      expect(e == ITEM_NOT_FOUND_MSG);
    }
  });  

  it('firstOrDefault', () => {
    let list = new List<Owner>();

    let owner = new Owner();
    owner.name = "John Doe";
    list.add(owner);

    owner = new Owner();
    owner.name = "Jane Doe";
    list.add(owner);

    //firstOrDefault
    let ownerResult = list.firstOrDefault(owner => owner.name.includes('Doe'));

    expect(ownerResult.name == "John Doe").toBeTruthy();
  });

  it('first', () => {
    let list = new List<Owner>();

    let owner = new Owner();
    owner.name = "John Doe";
    list.add(owner);

    owner = new Owner();
    owner.name = "Jane Doe";
    list.add(owner);

    //last
    let ownerResult = list.first(owner => owner.name.includes('Doe'));

    expect(ownerResult.name == "John Doe").toBeTruthy();
  });

  it('first fail', () => {
    let list = new List<Owner>();

    let owner = new Owner();
    owner.name = "John Doe";
    list.add(owner);

    owner = new Owner();
    owner.name = "Jane Doe";
    list.add(owner);

    try
    {
      //last
      let ownerResult = list.first(owner => owner.name == 'Peter Smith');
    }
    catch(e) {
      expect(e == ITEM_NOT_FOUND_MSG);
    }
  });
  
  it('lastOrDefault', () => {
    let list = new List<Owner>();

    let owner = new Owner();
    owner.name = "John Doe";
    list.add(owner);

    owner = new Owner();
    owner.name = "Jane Doe";
    list.add(owner);

    //firstOrDefault
    let ownerResult = list.lastOrDefault(owner => owner.name.includes('Doe'));

    expect(ownerResult.name == "Jane Doe").toBeTruthy();
  });

  it('last', () => {
    let list = new List<Owner>();

    let owner = new Owner();
    owner.name = "John Doe";
    list.add(owner);

    owner = new Owner();
    owner.name = "Jane Doe";
    list.add(owner);

    //last
    let ownerResult = list.last(owner => owner.name.includes('Doe'));

    expect(ownerResult.name == "Jane Doe").toBeTruthy();
  });

  it('last fail', () => {
    let list = new List<Owner>();

    let owner = new Owner();
    owner.name = "John Doe";
    list.add(owner);

    owner = new Owner();
    owner.name = "Jane Doe";
    list.add(owner);

    try
    {
      //last
      let ownerResult = list.last(owner => owner.name == 'Peter Smith');
    }
    catch(e) {
      expect(e == ITEM_NOT_FOUND_MSG);
    }
  });

  it('join', () => {
    let owners = new List<Owner>();

    let owner = new Owner();
    owner.id = 1;
    owner.name = "John Doe";
    owners.add(owner);

    owner = new Owner();
    owner.id = 2;
    owner.name = "Jane Doe";
    owners.add(owner);    

    let pets = new List<Pet>();

    let pet = new Pet();
    pet.ownerId = 2;
    pet.name = "Sam";

    pets.add(pet);

    pet = new Pet();
    pet.ownerId = 2;
    pet.name = "Pete";

    pets.add(pet);

    pet = new Pet();
    pet.ownerId = 1;
    pet.name = "Bob";

    pets.add(pet);

    //join
    let ownerPets = owners.join(pets, owner => owner.id, pet => pet.ownerId, (x, y) => new OwnerPet(x,y));

    expect(ownerPets.toArray().filter(op => op.owner.name == "John Doe" && op.pet.name == "Bob").length == 1).toBeTruthy();
    expect(ownerPets.toArray().filter(op => op.owner.name == "Jane Doe" && op.pet.name == "Sam").length == 1).toBeTruthy();
    expect(ownerPets.toArray().filter(op => op.owner.name == "Jane Doe" && op.pet.name == "Pete").length == 1).toBeTruthy();
  });

  it('leftJoin', () => {
    let owners = new List<Owner>();

    let owner = new Owner();
    owner.id = 1;
    owner.name = "John Doe";
    owners.add(owner);

    owner = new Owner();
    owner.id = 2;
    owner.name = "Jane Doe";
    owners.add(owner);    

    let pets = new List<Pet>();

    let pet = new Pet();
    pet.ownerId = 2;
    pet.name = "Sam";

    pets.add(pet);    

    //leftJoin
    let ownerPets = owners.join(pets, owner => owner.id, pet => pet.ownerId, (x, y) => new OwnerPet(x,y), true);

    expect(ownerPets.toArray().filter(op => op.owner.name == "John Doe" && !op.pet).length == 1).toBeTruthy();    
    expect(ownerPets.toArray().filter(op => op.owner.name == "Jane Doe" && op.pet.name == "Sam").length == 1).toBeTruthy();
  });  

  it('groupBy', () => {
    let owners = new List<Owner>();

    let owner = new Owner();
    owner.id = 1;
    owner.name = "John Doe";
    owners.add(owner);

    owner = new Owner();
    owner.id = 2;
    owner.name = "Jane Doe";
    owners.add(owner);    

    let pets = new List<Pet>();

    let pet = new Pet();
    pet.ownerId = 2;
    pet.name = "Sam";
    pet.sex = Sex.M;

    pets.add(pet);

    pet = new Pet();
    pet.ownerId = 2;
    pet.name = "Millie";
    pet.sex = Sex.F;

    pets.add(pet);

    pet = new Pet();
    pet.ownerId = 1;
    pet.name = "Jenny";
    pet.sex = Sex.F;

    pets.add(pet);

    //groupBy
    let ownersByPetSex = owners.join(pets, owner => owner.id, pet => pet.ownerId, (x, y) => new OwnerPet(x,y))
                               .groupBy(x => [x.pet.sex])                               
                               .select(x =>  new OwnersByPetSex(x.groups[0], x.list.select(x => x.owner)));

    expect(ownersByPetSex.toArray().length === 2).toBeTruthy();

    expect(ownersByPetSex.toArray()[0].sex == Sex.F).toBeTruthy();
    expect(ownersByPetSex.toArray()[0].owners.length === 2).toBeTruthy();
    expect(ownersByPetSex.toArray()[0].owners.toArray()[0].name == "John Doe").toBeTruthy();
    expect(ownersByPetSex.toArray()[0].owners.toArray()[1].name == "Jane Doe").toBeTruthy();

    expect(ownersByPetSex.toArray()[1].sex == Sex.M).toBeTruthy();
    expect(ownersByPetSex.toArray()[1].owners.length == 1).toBeTruthy();
    expect(ownersByPetSex.toArray()[1].owners.toArray()[0].name == "Jane Doe").toBeTruthy();
  });
  
  it('groupBy multiple fields', () => {
    let owners = new List<Owner>();

    let owner = new Owner();
    owner.id = 1;
    owner.name = "John Doe";
    owner.sex = Sex.M;
    owners.add(owner);

    owner = new Owner();
    owner.id = 2;
    owner.name = "Jane Doe";
    owner.sex = Sex.F;
    owners.add(owner);    

    let pets = new List<Pet>();

    let pet = new Pet();
    pet.ownerId = 2;
    pet.name = "Sam";
    pet.type = PetType.Dog;
    pet.sex = Sex.M;

    pets.add(pet);

    pet = new Pet();
    pet.ownerId = 1;
    pet.name = "Jenny";
    pet.type = PetType.Cat;
    pet.sex = Sex.F;

    pets.add(pet);

    //groupBy multiple
    let ownersByPetTypeAndSex = owners.join(pets, owner => owner.id, pet => pet.ownerId, (x, y) => new OwnerPet(x,y))
                                      .groupBy(x => [x.pet.sex, x.pet.type])
                                      .select(x =>  new OwnersByPetTypeAndSex(x.groups[1], x.groups[0], x.list.select(x => x.owner)));                               

    expect(ownersByPetTypeAndSex.toArray().length === 2).toBeTruthy();
    
    expect(ownersByPetTypeAndSex.toArray()[0].type == PetType.Cat).toBeTruthy();
    expect(ownersByPetTypeAndSex.toArray()[0].sex == Sex.F).toBeTruthy();
    expect(ownersByPetTypeAndSex.toArray()[0].owners.length === 1).toBeTruthy();
    expect(ownersByPetTypeAndSex.toArray()[0].owners.toArray()[0].name == "John Doe").toBeTruthy();

    expect(ownersByPetTypeAndSex.toArray()[1].type == PetType.Dog).toBeTruthy();
    expect(ownersByPetTypeAndSex.toArray()[1].sex == Sex.M).toBeTruthy();
    expect(ownersByPetTypeAndSex.toArray()[1].owners.length === 1).toBeTruthy();
    expect(ownersByPetTypeAndSex.toArray()[1].owners.toArray()[0].name == "Jane Doe").toBeTruthy();
  });  
  
  it('orderBy', () => {
    let owners = new List<Owner>();

    let owner = new Owner();
    owner.id = 1;
    owner.name = "John Doe";
    owners.add(owner);

    owner = new Owner();
    owner.id = 2;
    owner.name = "Jane Doe";
    owners.add(owner);    

    let pets = new List<Pet>();

    let pet = new Pet();
    pet.ownerId = 2;
    pet.name = "Sam";

    pets.add(pet);

    pet = new Pet();
    pet.ownerId = 2;
    pet.name = "Abby";

    pets.add(pet);

    pet = new Pet();
    pet.ownerId = 1;
    pet.name = "Jason";

    pets.add(pet);

    pet = new Pet();
    pet.ownerId = 1;
    pet.name = "Bob";

    pets.add(pet);

    //orderBy
    let ownerPets = owners.join(pets, owner => owner.id, pet => pet.ownerId, (x, y) => new OwnerPet(x,y))
                          .orderBy(new Comparer());                          

    expect(ownerPets.toArray()[0].owner.id == 1).toBeTruthy();
    expect(ownerPets.toArray()[0].pet.name == "Bob").toBeTruthy();

    expect(ownerPets.toArray()[1].owner.id == 1).toBeTruthy();
    expect(ownerPets.toArray()[1].pet.name == "Jason").toBeTruthy();

    expect(ownerPets.toArray()[2].owner.id == 2).toBeTruthy();
    expect(ownerPets.toArray()[2].pet.name == "Abby").toBeTruthy();
    
    expect(ownerPets.toArray()[3].owner.id == 2).toBeTruthy();
    expect(ownerPets.toArray()[3].pet.name == "Sam").toBeTruthy();
  });

  it('union', () => {
    let ownersA = new List<Owner>();

    let owner = new Owner();
    owner.id = 1;
    owner.name = "John Doe";    
    ownersA.add(owner);

    owner = new Owner();
    owner.id = 2;
    owner.name = "Jane Doe";
    ownersA.add(owner);    

    let ownersB = new List<Owner>();

    owner = new Owner();
    owner.id = 1;
    owner.name = "Peter";
    ownersB.add(owner);

    owner = new Owner();
    owner.id = 2;
    owner.name = "Meghan";
    ownersB.add(owner);    

    //union
    let ownersResult = ownersA.union(ownersB);

    expect(ownersResult.length === 4).toBeTruthy();
  });  

  it('distinct', () => {
    let numbers: number[] = [1, 2, 3, 1, 3];
    let list = new List(numbers);

    let distinct = list.distinct(new EqualityComparer());

    expect(distinct.length == 3);
    expect(distinct.elementAt(0) == 1);
    expect(distinct.elementAt(1) == 2);
    expect(distinct.elementAt(2) == 3);
  });  

  it('skip', () => {
    let numbers: number[] = [1, 2, 3]
    let list: IList<number> = new List(numbers);

    let result = list.skip(2);

    expect(result.length == 1);
  });

  it('take', () => {
    let numbers: number[] = [1, 2, 3]
    let list: IList<number> = new List(numbers);

    let result = list.take(2);

    expect(result.length == 2);
  });  

  it('skip and take', () => {
    let numbers: number[] = [1, 2, 3, 4]
    let list: IList<number> = new List(numbers);

    let result = list.skip(1).take(2);

    expect(result.length == 2);
  });

  it('sum', () => {
    let numbers: number[] = [1, 2, 3]
    let list: IList<number> = new List(numbers);

    let sum = list.sum(x => x);

    expect(sum == 6);
  });

  it('average', () => {
    let numbers: number[] = [1, 2, 3]
    let list: IList<number> = new List(numbers);

    let avg = list.avg(x => x);

    expect(avg == 2);
  });

  it('count', () => {
    let numbers: number[] = [1, 2, 3, 101, 102]
    let list: IList<number> = new List(numbers);

    let countNumbersGreaterThan100 = list.count(x => x > 100);

    expect(countNumbersGreaterThan100 == 2);
  });
  
  it('min', () => {
    let numbers: number[] = [5, 2, 1, 101, 102]
    let list: IList<number> = new List(numbers);

    let min = list.min(x => x);

    expect(min == 1);
  });

  it('max', () => {
    let numbers: number[] = [5, 2, 102, 102, 101]
    let list: IList<number> = new List(numbers);

    let max = list.max(x => x);

    expect(max == 102);
  });  
});

class Owner {
    id: number;
    name: string;
    sex: Sex;
}

enum PetType {
    Cat,
    Dog
}

class Pet {
    ownerId: number;
    name: string;
    sex: Sex;
    type: PetType;
}

enum Sex {
    M,
    F
}

class OwnerPet {
    owner: Owner;
    pet: Pet;

    constructor(owner: Owner, pet: Pet) {
        this.owner = owner;
        this.pet = pet;
    }
}

class OwnersByPetSex {
    sex: Sex;
    owners: IEnumerable<Owner>;

    constructor(sex: Sex, owners: IEnumerable<Owner>) {
        this.sex = sex;
        this.owners = owners;
    }
}

class OwnersByPetTypeAndSex {
    type: PetType;
    sex: Sex;
    owners: IEnumerable<Owner>;

    constructor(type: PetType, sex: Sex, owners: IEnumerable<Owner>) {
        this.type = type;
        this.sex = sex;
        this.owners = owners;
    }
}

class Comparer implements IComparer<OwnerPet> {
    compare(x: OwnerPet, y: OwnerPet) : number {
        if (x.owner.id > y.owner.id) {
            if (x.pet.name > y.pet.name) {
                return 1;
            }

            return 0;
        }

        return -1        
    }
}

class EqualityComparer implements IEqualityComparer<number> {
  equals(x: number, y: number) : boolean {
    return x == y;
  }
}