# ts-generic-collections
# TypeScript library provides generic, strongly-typed, queryable collections

[![Build Status](https://travis-ci.com/VeritasSoftware/ts-generic-collections.svg?branch=master)](https://travis-ci.com/VeritasSoftware/ts-generic-collections)

### The generic collections are:

*   List
*   Dictionary

### All collections implement interface IEnumerable\<T\>

```typescript
export interface IEnumerable<T> {
    elementAt(index: number) : T;
    any(predicate?: (item: T)=> boolean) : boolean;
    all(predicate?: (item: T)=> boolean) : boolean;
    single(predicate?: (item: T)=> boolean) : T;
    first(predicate?: (item: T)=> boolean) : T;
    last(predicate?: (item: T)=> boolean) : T;
    singleOrDefault(predicate: (item: T)=> boolean) : T;    
    firstOrDefault(predicate: (item: T)=> boolean) : T;
    lastOrDefault(predicate: (item: T)=> boolean) : T;
    where(predicate: (item: T)=> boolean) : IEnumerable<T>;
    select<TResult>(predicate: (item: T)=> TResult) : IEnumerable<TResult>;
    join<TOuter, TMatch, TResult>(outer: IEnumerable<TOuter>, conditionInner: (item: T)=> TMatch, 
                                    conditionOuter: (item: TOuter)=> TMatch, select: (x: T, y:TOuter)=> TResult, leftJoin?: boolean) : IEnumerable<TResult>; 
    groupBy(predicate: (item: T) => Array<any>) : IEnumerable<IGroup<T>>;
    orderBy(comparer: IComparer<T>) : IEnumerable<T>;
    distinct(comparer: IEqualityComparer<T>) : IEnumerable<T>;
    union(list: IEnumerable<T>) : IEnumerable<T>;
    skip(no: number) : IEnumerable<T>;
    take(no: number) : IEnumerable<T>;
    sum(predicate: (item: T)=> number) : number;
    avg(predicate: (item: T)=> number) : number;
    min(predicate: (item: T)=> number) : number;
    max(predicate: (item: T)=> number) : number;
    count(predicate?: (item: T)=> boolean) : number;
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

    //query to get owners by the sex/gender of their pets
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

### You can instantiate a List from JSON as shown below

```typescript
    let jsonOwnerArray = '[{"id":1, "name": "John Doe"},{"id":2, "name": "Jane Doe"}]';

    let ownerArray: Owner[] = JSON.parse(jsonOwnerArray);

    let list = new List(ownerArray);
```

### Entities for above example are

```typescript
class Owner {
    id: number;
    name: string;
}

class Pet {
    ownerId: number;
    name: string;
    sex: Sex;
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
```

## Dictionary

### Dictionary implements interface IDictionary<TKey, TValue>

```typescript
export interface IDictionary<TKey, TValue> extends IEnumerable<KeyValuePair<TKey, TValue>> {
    add(key: TKey, value: TValue) : void;
    addRange(items: KeyValuePair<TKey, TValue>[]) : void;
    remove(predicate: (item:KeyValuePair<TKey, TValue>) => boolean) : void;
    clear() : void;

    containsKey(key: TKey) : boolean;
    containsValue(value: TValue) : boolean;
    tryGetValue(key: TKey) : TValue;
}
```

### You can browse more examples of queries below

[**List**](https://github.com/VeritasSoftware/ts-generic-collections/blob/master/projects/ts-generic-collections/src/lib/list.spec.ts)

[**Dictionary**](https://github.com/VeritasSoftware/ts-generic-collections/blob/master/projects/ts-generic-collections/src/lib/dictionary.spec.ts)