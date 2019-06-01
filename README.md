# ts-generic-collections
# TypeScript library provides generic, strongly-typed, queryable collections

### The generic collections are:

*   List
*   Dictionary

### All collections implement interface IEnumerable\<T\>

```typescript
export interface IEnumerable<T> {
    first(predicate?: (item: T)=> boolean) : T;
    last() : T;
    singleOrDefault(predicate: (item: T)=> boolean) : T;    
    firstOrDefault(predicate: (item: T)=> boolean) : T;
    where(predicate: (item: T)=> boolean) : IEnumerable<T>;
    select<TResult>(predicate: (item: T)=> TResult) : IEnumerable<TResult>;
    join<TOuter, TMatch, TResult>(outer: IEnumerable<TOuter>, conditionInner: (item: T)=> TMatch, 
                                    conditionOuter: (item: TOuter)=> TMatch, select: (x: T, y:TOuter)=> TResult) : IEnumerable<TResult>;
    groupBy(predicate: (item: T) => Array<any>) : IEnumerable<Group<T>>;
    orderBy(comparer: IComparer<T>) : IEnumerable<T>;
    union(list: IEnumerable<T>) : IEnumerable<T>;
    forEach(predicate: (item: T)=> void) : void;
    length: number;
    toArray() : Array<T>;
    asEnumerable() : IEnumerable<T>;
}
```

## List

### List implements interface IList\<T\>

```typescript
export interface IList<T> extends IEnumerable<T> {
    add(item: T) : void;
    addRange(items: T[]) : void;
    remove(predicate: (item:T) => boolean) : void;
    clear() : void;
}
```

### You can create queries like below

Below query gets the owners by the sex of their pets.

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
                               .groupBy(x => [x.pet.sex])
                               .select(x =>  new OwnersByPetSex(x.groups[0], x.list.select(x => x.owner)));

    expect(ownersByPetSex.toArray().length === 2).toBeTruthy();

    expect(ownersByPetSex.toArray()[0].sex == Sex.F).toBeTruthy();
    expect(ownersByPetSex.toArray()[0].owners.length === 1).toBeTruthy();
    expect(ownersByPetSex.toArray()[0].owners.toArray()[0].name == "John Doe").toBeTruthy();

    expect(ownersByPetSex.toArray()[1].sex == Sex.M).toBeTruthy();
    expect(ownersByPetSex.toArray()[1].owners.length == 1).toBeTruthy();
    expect(ownersByPetSex.toArray()[1].owners.toArray()[0].name == "Jane Doe").toBeTruthy();                               
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

## Dictionary

### Dictionary implements interface IDictionary<TKey, TValue>

```typescript
export interface IDictionary<TKey, TValue> extends IEnumerable<KeyValuePair<TKey, TValue>> {
    add(key: TKey, value: TValue) : void;
    addRange(items: KeyValuePair<TKey, TValue>[]) : void;
    remove(predicate: (item:KeyValuePair<TKey, TValue>) => boolean) : void;
    clear() : void;
}
```

### You can browse more examples of queries below

[Unit Tests](https://github.com/VeritasSoftware/ts-generic-collections/blob/master/projects/ts-generic-collections/src/lib/list.spec.ts)


This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.2.2.