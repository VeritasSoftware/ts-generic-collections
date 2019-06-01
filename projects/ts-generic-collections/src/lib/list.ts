import { IEnumerable } from './interfaces';
import { IComparer, Group } from './common';

export interface IList<T> extends IEnumerable<T> {
    add(item: T) : void;
    addRange(items: T[]) : void;
    remove(predicate: (item:T) => boolean) : void;
    clear() : void;    
}

export class List<T> implements IList<T> {

    private list: Array<T> = new Array<T>();

    constructor(array: Array<T> = null) {
        if (array)
            this.list = array;
    }

    /* IList */

    add(item: T) : void {
        this.list.push(item);
    }

    addRange(items: T[]) : void {
        items.forEach(x => this.add(x));
    }

    remove(predicate: (t:T) => boolean) : void {
        let temp = new Array<T>();

        this.list.forEach(element => {
            if (!predicate(element))
            {
                temp.push(element);
            }
        });

        this.list = temp;
    }

    clear() : void {
        this.list = new Array<T>();
    }

    /* IEnumerable */

    asEnumerable() : IEnumerable<T> {
        return this;
    }
    
    get length(): number {
        return this.list.length;
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

    where(predicate: (t: T)=> boolean) : IEnumerable<T> {
        let temp = new List<T>();

        this.list.filter(element => {
            if (predicate(element))
            {
                temp.add(element);
            }
        });

        return temp;
    }

    select<TResult>(predicate: (t: T)=> TResult) : IEnumerable<TResult> {
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

    join<TOuter, TMatch, TResult>(outer: IEnumerable<TOuter>, conditionInner: (t: T)=> TMatch, 
                                    conditionOuter: (t: TOuter)=> TMatch, select: (x: T, y:TOuter)=> TResult) : IEnumerable<TResult> {
        let resultList = new List<TResult>();

        this.list.forEach(x => {
            let outerEntries = outer.toArray().filter(y => conditionInner(x) === conditionOuter(y));

            outerEntries.forEach(z => resultList.add(select(x, z)));
        })

        return resultList;
    }

    groupBy(predicate: (item: T) => Array<any>) : IEnumerable<Group<T>> {
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

    orderBy(comparer: IComparer<T>) : IEnumerable<T> {
        let temp = this.list.sort((x,y) => comparer.compare(x, y));

        return new List<T>(temp);
    }

    union(list: IEnumerable<T>) : IEnumerable<T> {
         list.forEach(x => this.list.push(x));

         return this;
    }
}