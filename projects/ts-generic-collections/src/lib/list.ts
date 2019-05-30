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

export class List<T> implements IList<T> {

    private list: Array<T> = new Array<T>();

    constructor(array: Array<T> = null) {
        if (array)
            this.list = array;
    }

    add(item: T) : IList<T> {
        this.list.push(item);
        return this;
    }

    remove(predicate: (t:T) => boolean) : List<T> {
        let temp = new Array<T>();

        this.list.forEach(element => {
            if (!predicate(element))
            {
                temp.push(element);
            }
        });

        return new List(temp);
    }

    first() : T {
        if (this.list.length <= 0) {
            return null;
        }
        return this.list[0];
    }
    
    last() : T {
        if (this.list.length <= 0) {
            return null;
        }
        return this.list[this.list.length - 1];
    }    

    singleOrDefault(predicate: (t: T)=> boolean) : T {
        let temp = new Array<T>();

        this.list.filter(element => {
            if (predicate(element))
            {
                temp.push(element);
            }
        });

        if (temp.length > 1) {
            throw "Multiple instances of entity found.";
        }

        return temp[0];
    }    

    firstOrDefault(predicate: (t: T)=> boolean) : T {
        let temp = new Array<T>();

        this.list.filter(element => {
            if (predicate(element))
            {
                temp.push(element);
            }
        });

        return temp[0];
    }

    where(predicate: (t: T)=> boolean) : IList<T> {
        let temp = new List<T>();

        this.list.filter(element => {
            if (predicate(element))
            {
                temp.add(element);
            }
        });

        return temp;
    }

    select<TResult>(predicate: (t: T)=> TResult) : IList<TResult> {
        let temp = new List<TResult>();

        this.forEach(x => temp.add(predicate(x)));

        return temp;
    }

    forEach(predicate: (t: T)=> void) : void {
        this.list.forEach(x => predicate(x));
    }


    length() : number {
        return this.list.length;
    }

    toArray() : Array<T> {
        return this.list;
    }

    join<TOuter, TMatch, TResult>(outer: IList<TOuter>, conditionInner: (t: T)=> TMatch, 
                                    conditionOuter: (t: TOuter)=> TMatch, select: (x: T, y:TOuter)=> TResult) : IList<TResult> {
        let resultList = new List<TResult>();

        this.list.forEach(x => {
            let outerEntries = outer.toArray().filter(y => conditionInner(x) === conditionOuter(y));

            outerEntries.forEach(z => resultList.add(select(x, z)));
        })

        return resultList;
    }

    groupBy<TGroup>(predicate: (t: T)=>TGroup) : IList<Group<TGroup, T>> {        
        const map = new Map();
        this.list.forEach((item) => {
             const key = predicate(item);
             const collection = map.get(key);
             if (!collection) {
                 map.set(key, [item]);
             } else {
                 collection.push(item);
             }
        });

        let groups = new List<Group<TGroup, T>>();

        let iterator = map.entries();
        
        for (let nextValue = iterator.next(); nextValue.done !== true; nextValue = iterator.next()) {            
            let group = new Group<TGroup, T>(nextValue.value[0], nextValue.value[1]);

            groups.add(group)
        }

        return groups;
    }

    union(list: IList<T>) : IList<T> {
         list.forEach(x => this.list.push(x));

         return this;
    }
}

export interface IGroup<TGroup, T> {
    group: TGroup;
    list: List<T>;
}

export class Group<TGroup, T> implements IGroup<TGroup, T> {
    group: TGroup;
    list: List<T> = new List<T>();

    constructor(group: TGroup, list: Array<T>) {
        this.group = group;
        this.list = new List<T>(list);
    }
}