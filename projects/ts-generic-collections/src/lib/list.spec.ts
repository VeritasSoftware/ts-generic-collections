import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IList, List, IComparer } from './list';

describe('List', () => {

  beforeEach(async(() => {

  }));

  beforeEach(() => {

  });

  it('query', () => {
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
    let ownersWhoHaveMalePets = owners.join(pets, owner => owner.id, pet => pet.ownerId, (x, y) => new OwnerPet(x,y))
                                      .where(x => x.pet.sex == Sex.F)
                                      .select(x => x.owner);

    expect(ownersWhoHaveMalePets.length === 1).toBeTruthy();
    expect(ownersWhoHaveMalePets.toArray()[0].name = "John Doe").toBeTruthy();                      
  });

  it('add', () => {
    let list = new List<Owner>();

    let owner = new Owner();
    owner.name = "John Doe";

    //add
    list.add(owner);

    expect(list.length == 1).toBeTruthy();
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
    list = list.remove(owner => owner.name.includes('Doe'));

    expect(list.length === 0).toBeTruthy();
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
        expect(e == "Multiple instances of entity found.").toBeTruthy();
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
    pet.ownerId = 1;
    pet.name = "Bob";

    pets.add(pet);

    //join
    let ownerPets = owners.join(pets, owner => owner.id, pet => pet.ownerId, (x, y) => new OwnerPet(x,y));

    expect(ownerPets.toArray().filter(op => op.owner.name == "John Doe" && op.pet.name == "Bob").length == 1).toBeTruthy();
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
    expect(ownersByPetSex.toArray()[0].owners.length === 1).toBeTruthy();
    expect(ownersByPetSex.toArray()[0].owners.toArray()[0].name == "John Doe").toBeTruthy();

    expect(ownersByPetSex.toArray()[1].sex == Sex.M).toBeTruthy();
    expect(ownersByPetSex.toArray()[1].owners.length == 1).toBeTruthy();
    expect(ownersByPetSex.toArray()[1].owners.toArray()[0].name == "Jane Doe").toBeTruthy();
  });
  
  it('multiuple groupBy', () => {
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
    let ownersByPetSex = owners.join(pets, owner => owner.id, pet => pet.ownerId, (x, y) => new OwnerPet(x,y))
                               .groupBy(x => [x.pet.sex, x.pet.type])
                               .select(x =>  new OwnersByPetTypeAndSex(x.groups[1], x.groups[0], x.list.select(x => x.owner)));                               

    expect(ownersByPetSex.toArray().length === 2).toBeTruthy();
    
    expect(ownersByPetSex.toArray()[0].type == PetType.Cat).toBeTruthy();
    expect(ownersByPetSex.toArray()[0].sex == Sex.F).toBeTruthy();
    expect(ownersByPetSex.toArray()[0].owners.length === 1).toBeTruthy();
    expect(ownersByPetSex.toArray()[0].owners.toArray()[0].name == "John Doe").toBeTruthy();

    expect(ownersByPetSex.toArray()[1].type == PetType.Dog).toBeTruthy();
    expect(ownersByPetSex.toArray()[1].sex == Sex.M).toBeTruthy();
    expect(ownersByPetSex.toArray()[1].owners.length === 1).toBeTruthy();
    expect(ownersByPetSex.toArray()[1].owners.toArray()[0].name == "Jane Doe").toBeTruthy();
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
    owners: IList<Owner>;

    constructor(sex: Sex, owners: IList<Owner>) {
        this.sex = sex;
        this.owners = owners;
    }
}

class OwnersByPetTypeAndSex {
    type: PetType;
    sex: Sex;
    owners: IList<Owner>;

    constructor(type: PetType, sex: Sex, owners: IList<Owner>) {
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