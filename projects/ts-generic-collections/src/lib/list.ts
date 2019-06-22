import { IEnumerable, IComparer, IEqualityComparer } from './interfaces';
import { Group, objCompare, ITEM_NOT_FOUND_MSG, MULTIPLE_INSTANCES_FOUND_MSG } from './common';

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

    remove(predicate: (item:T) => boolean) : void {
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

    elementAt(index: number) : T {
        try {
            return this.list[index];
        }
        catch (e) {
            return null;
        }
    }

    any(predicate?: (item: T)=> boolean) : boolean {
        if (!predicate) {
            return this.list.length > 0;
        }

        for (let i=0; i<this.list.length; i++) {
            if (predicate(this.list[i]))
            {
                return true;
            }
        }
        return false;
    }

    all(predicate?: (item: T)=> boolean) : boolean {
        if (!predicate) {
            return this.list.length > 0;
        }
        
        for (let i=0; i<this.list.length; i++) {
            if (!predicate(this.list[i]))
            {
                return false;
            }
        }
        return true;
    }

    single(predicate: (item: T)=> boolean = null) : T {
        if (this.list.length <= 0) {
            throw ITEM_NOT_FOUND_MSG;
        }

        if (predicate) {
            let item = this.singleOrDefault(predicate);

            if (!item) {
                throw ITEM_NOT_FOUND_MSG;
            }

            return item;
        }
        
        return this.list[0];
    }

    first(predicate: (item: T)=> boolean = null) : T {
        if (this.list.length <= 0) {
            throw ITEM_NOT_FOUND_MSG;
        }

        if (predicate) {
            let item = this.firstOrDefault(predicate);

            if (!item) {
                throw ITEM_NOT_FOUND_MSG;
            }

            return item;
        }
        
        return this.list[0];
    }
    
    last(predicate: (item: T)=> boolean = null) : T {
        if (this.list.length <= 0) {
            throw ITEM_NOT_FOUND_MSG;
        }

        if (predicate) {
            let item = this.lastOrDefault(predicate);

            if (!item) {
                throw ITEM_NOT_FOUND_MSG;
            }

            return item;
        }

        return this.list[this.list.length - 1];
    }    

    singleOrDefault(predicate: (item: T)=> boolean) : T {
        let temp = new Array<T>();

        this.list.filter(element => {
            if (predicate(element))
            {
                temp.push(element);
            }
        });

        if (temp.length > 1) {
            throw MULTIPLE_INSTANCES_FOUND_MSG;
        }

        if (temp.length <= 0) {
            return null;
        }

        return temp[0];
    }    

    firstOrDefault(predicate: (item: T)=> boolean) : T {
        for (let i=0; i<this.length; i++) {
            let item = this.list[i];
            if (predicate(item))
            {
                return item;
            }
        }

        return null;
    }

    lastOrDefault(predicate: (item: T)=> boolean) : T {
        for (let i=this.length; i>=0; i--) {
            let item = this.list[i - 1];
            if (predicate(item))
            {
                return item;
            }
        }

        return null;
    }    

    where(predicate: (item: T)=> boolean) : IEnumerable<T> {
        let temp = new List<T>();

        this.list.filter(element => {
            if (predicate(element))
            {
                temp.add(element);
            }
        });

        return temp;
    }

    select<TResult>(predicate: (item: T)=> TResult) : IEnumerable<TResult> {
        let temp = new List<TResult>();

        this.forEach(x => temp.add(predicate(x)));

        return temp;
    }

    forEach(predicate: (item: T)=> void) : void {
        this.list.forEach(x => predicate(x));
    }

    toArray() : Array<T> {
        return this.list;
    }

    join<TOuter, TMatch, TResult>(outer: IEnumerable<TOuter>, conditionInner: (item: T)=> TMatch, 
                                    conditionOuter: (item: TOuter)=> TMatch, select: (x: T, y:TOuter)=> TResult, leftJoin: boolean = false) : IEnumerable<TResult> {
        let resultList = new List<TResult>();

        this.list.forEach(x => {
            let outerEntries = outer.toArray().filter(y => conditionInner(x) === conditionOuter(y));

            if (leftJoin && outerEntries && outerEntries.length <= 0) {
                resultList.add(select(x, null));
            }
            else {
                outerEntries.forEach(z => resultList.add(select(x, z)));
            }
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
        this.addRange(list.toArray());

         return this;
    }

    distinct(comparer: IEqualityComparer<T>) : IEnumerable<T> {
        let uniques = new List<T>();
        this.forEach(x => {
            uniques.forEach(y => {
                if (!comparer.equals(x, y)) {
                    uniques.add(x);
                }
            });
        });

        return uniques;
    }

    skip(no: number) : IEnumerable<T> {
        if (no > 0) {
            return new List(this.list.slice(no, this.list.length - 1));
        }
        
        return this;
    }

    take(no: number) : IEnumerable<T> {
        if (no > 0) {
            return new List(this.list.slice(0, no));
        }        

        return this;
    }

    sum(predicate: (item: T)=> number) : number {
        let sum: number = 0;
        this.list.forEach(x => sum = sum + predicate(x));

        return sum;
    }

    avg(predicate: (item: T)=> number) : number {        
        return this.sum(predicate) / this.length;
    }

    min(predicate: (item: T)=> number) : number {
        let min: number = 0;
        let i = 0;
        this.list.forEach(x => 
        {
            if (i == 0) {
                min = predicate(x);
            }
            else {
                let val = predicate(x);
                if (val < min) {
                    min = val;
                }
            }            
            i++;
        });

        return min;
    }
    
    max(predicate: (item: T)=> number) : number {
        let max: number = 0;
        let i = 0;
        this.list.forEach(x => 
        {
            if (i == 0) {
                max = predicate(x);
            }
            else {
                let val = predicate(x);
                if (val > max) {
                    max = val;
                }
            }            
            i++;
        });

        return max;
    }    
    
    count(predicate: (item: T)=> boolean = null) : number {
        if (!predicate) {
            return this.length;
        }

        let count: number = 0;
        this.list.forEach(x => {
            if(predicate(x)) {
                count++;
            }
        });

        return count;
    }

}