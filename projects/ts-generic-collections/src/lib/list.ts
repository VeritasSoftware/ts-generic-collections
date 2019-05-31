export interface IList<T> {
    add(item: T) : IList<T>;
    addRange(items: T[]) : IList<T>;
    remove(predicate: (item:T) => boolean) : IList<T>;
    first(predicate?: (item: T)=> boolean) : T;
    last() : T;
    singleOrDefault(predicate: (item: T)=> boolean) : T;    
    firstOrDefault(predicate: (item: T)=> boolean) : T;
    where(predicate: (item: T)=> boolean) : IList<T>;
    select<TResult>(predicate: (item: T)=> TResult) : IList<TResult>;
    join<TOuter, TMatch, TResult>(outer: IList<TOuter>, conditionInner: (item: T)=> TMatch, 
                                    conditionOuter: (item: TOuter)=> TMatch, select: (x: T, y:TOuter)=> TResult) : IList<TResult>;
    groupBy(predicate: (item: T) => Array<any>) : IList<Group<T>>;
    union(list: IList<T>) : IList<T>;
    forEach(predicate: (item: T)=> void) : void;
    length: number;
    clear() : IList<T>;
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

    get length(): number {
        return this.list.length;
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

    first(predicate: (t: T)=> boolean = null) : T {
        if (this.list.length <= 0) {
            return null;
        }

        if (predicate) {
            let item = this.firstOrDefault(predicate);

            if (!item) {
                throw "First item does not exist.";
            }
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

    clear() : IList<T> {
        this.list = new Array<T>();

        return this;
    }

    addRange(items: T[]) : IList<T> {
        items.forEach(x => this.add(x));

        return this;
    }

    groupBy(predicate: (item: T) => Array<any>) : IList<Group<T>> {
        let groups = {};
        this.list.forEach(function (o) {
          var group = JSON.stringify(predicate(o));
          groups[group] = groups[group] || [];
          groups[group].push(o);
        });
        let g = Object.keys(groups).map(function (group) {                
            let a = group.substr(1, group.length - 2);

            let grp= new Group<T>(a.split(','), groups[group]);

            return grp;
        });

        return new List<Group<T>>(g);        
    }

    union(list: IList<T>) : IList<T> {
         list.forEach(x => this.list.push(x));

         return this;
    }
}

export interface IGroup<T> {
    groups: any[];
    list: IList<T>;
}

export class Group<T> implements IGroup<T> {
    groups: any[];
    list: IList<T> = new List<T>();

    constructor(groups: any[], list: Array<T>) {
        this.groups = groups;
        this.list = new List<T>(list);
    }
}