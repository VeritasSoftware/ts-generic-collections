# ts-generic-collections
# TypeScript library provides generic, strongly-typed collections with querying

### The generic collections are:

*   List

### List implements interface IList<T>

```typescript
export interface IList<T> {
    add(item: T) : IList<T>;
    remove(predicate: (item:T) => boolean) : IList<T>;
    first() : T;
    last() : T;
    singleOrDefault(predicate: (item: T)=> boolean) : T;    
    firstOrDefault(predicate: (item: T)=> boolean) : T;
    where(predicate: (item: T)=> boolean) : IList<T>;
    select<TResult>(predicate: (item: T)=> TResult) : IList<TResult>;
    join<TOuter, TMatch, TResult>(outer: IList<TOuter>, conditionInner: (item: T)=> TMatch, 
                                    conditionOuter: (item: TOuter)=> TMatch, select: (x: T, y:TOuter)=> TResult) : IList<TResult>;
    groupBy<TGroup>(predicate: (item: T)=>TGroup) : IList<Group<TGroup, T>>;
    union(list: IList<T>) : IList<T>;
    forEach(predicate: (item: T)=> void) : void;
    length() : number;
    toArray() : Array<T>;
}
```

### You can create queries like below

Below query gets the owners by the sex of the pets.

```typescript
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

    //query
    let ownersByPetSex = owners.join(pets, owner => owner.id, pet => pet.ownerId, (x, y) => new OwnerPet(x,y))
                               .groupBy(x => x.pet.sex)
                               .select(x =>  new OwnersByPetSex(x.group, x.list.select(y => y.owner)));
```

Entities for above example are:

```typescript
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
```

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.2.2.