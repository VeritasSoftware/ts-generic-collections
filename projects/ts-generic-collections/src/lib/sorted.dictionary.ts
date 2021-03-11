import { IEnumerable, IComparer, IEqualityComparer } from './interfaces';
import { List } from './list';
import { Group, objCompare, ITEM_NOT_FOUND_MSG, MULTIPLE_INSTANCES_FOUND_MSG } from './common';
import { IDictionary, Dictionary, KeyValuePair } from './dictionary';

class StringComparer<TKey, TValue> implements IComparer<KeyValuePair<TKey, TValue>> {
    compare(x: KeyValuePair<TKey, TValue>, y: KeyValuePair<TKey, TValue>) : number {
        var xKey = x.key as unknown as string;
        var yKey = y.key as unknown as string;

        if (xKey > yKey) {
            return 1;            
        }
        else if (xKey == yKey) {
            return 0;
        }
        else {
            return -1;
        }        
    }
}

class NumberComparer<TKey, TValue> implements IComparer<KeyValuePair<TKey, TValue>> {
    compare(x: KeyValuePair<TKey, TValue>, y: KeyValuePair<TKey, TValue>) : number {
        var xKey = x.key as unknown as number;
        var yKey = y.key as unknown as number;

        if (xKey > yKey) {
            return 1;            
        }
        else if (xKey == yKey) {
            return 0;
        }
        else {
            return -1;
        }       
    }
}

export class SortedDictionary<TKey, TValue> implements IDictionary<TKey, TValue>
{
    private list: Array<KeyValuePair<TKey, TValue>> = new Array<KeyValuePair<TKey, TValue>>();
    private comparer: IComparer<KeyValuePair<TKey, TValue>>;

    constructor(comparer: IComparer<KeyValuePair<TKey, TValue>> = null, list: Array<KeyValuePair<TKey, TValue>> = null) {
        if (list) {
            this.list = list;            
        }        

        this.comparer = comparer;

        if (this.list && this.list.length > 0)
        {
            if (this.comparer) {
                this.orderBy(this.comparer);
            }
            else {
                var value = this.list[0].key;
    
                if (typeof value === "string") {
                    this.comparer = new StringComparer<TKey, TValue>();

                    this.list = this.orderBy(this.comparer).toArray();
                }
                else if (typeof value === "number") {
                    this.comparer = new NumberComparer<TKey, TValue>();

                    this.list = this.orderBy(this.comparer).toArray();
                }
            }
        }
    }

    /* IList */

    add(key: TKey, value: TValue) : void {
        let pair = new KeyValuePair<TKey, TValue>(key, value);

        if (this.containsKey(key)) {
            throw "Duplicate key. Cannot add."
        }

        this.list.push(pair);

        if (this.comparer) {
            this.list = this.orderBy(this.comparer).toArray();
        }
    }

    addRange(items: KeyValuePair<TKey, TValue>[]) : void {
        items.forEach(x => this.add(x.key, x.value));
    }

    removeAt(index: number) : void {
        this.list.splice(index, 1);
    }

    clear() : void {
        this.list = new Array<KeyValuePair<TKey, TValue>>();
    }    

    remove(predicate: (item:KeyValuePair<TKey, TValue>) => boolean) : void {
        let temp = new Array<KeyValuePair<TKey, TValue>>();

        this.list.forEach(element => {
            if (!predicate(element))
            {
                temp.push(element);
            }
        });

        this.list = temp;
    }    

    containsKey(key: TKey) : boolean {
        return this.any(x => objCompare(x.key, key));
    }

    containsValue(value: TValue) : boolean {
        return this.any(x => objCompare(x.value, value));
    }

    tryGetValue(key: TKey) : TValue {
        let item = this.singleOrDefault(x => objCompare(x.key, key));

        if (item) {
            return item.value;
        }

        return null;
    }

    /* IEnumerable */

    asEnumerable() : IEnumerable<KeyValuePair<TKey, TValue>> {
        return this;
    }

    get length(): number {
        return this.list.length;
    }

    elementAt(index: number) : KeyValuePair<TKey, TValue> {
        try {
            return this.list[index];
        }
        catch (e) {
            return null;
        }
    }    

    any(predicate?: (item: KeyValuePair<TKey, TValue>)=> boolean) : boolean {
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

    all(predicate?: (item: KeyValuePair<TKey, TValue>)=> boolean) : boolean {
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

    single(predicate: (item: KeyValuePair<TKey, TValue>)=> boolean = null) : KeyValuePair<TKey, TValue> {
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

    first(predicate: (item: KeyValuePair<TKey, TValue>)=> boolean = null) : KeyValuePair<TKey, TValue> {
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
    
    last(predicate: (item: KeyValuePair<TKey, TValue>)=> boolean) : KeyValuePair<TKey, TValue> {
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

    singleOrDefault(predicate: (item: KeyValuePair<TKey, TValue>)=> boolean) : KeyValuePair<TKey, TValue> {
        let temp = new Array<KeyValuePair<TKey, TValue>>();

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

    firstOrDefault(predicate: (item: KeyValuePair<TKey, TValue>)=> boolean) : KeyValuePair<TKey, TValue> {        
        for (let i=0; i<this.length; i++) {
            let item = this.list[i];
            if (predicate(item))
            {
                return item;
            }
        }

        return null;
    }

    lastOrDefault(predicate: (item: KeyValuePair<TKey, TValue>)=> boolean) : KeyValuePair<TKey, TValue> {
        for (let i=this.length; i>=0; i--) {
            let item = this.list[i - 1];
            if (predicate(item))
            {
                return item;
            }
        }

        return null;
    }    

    where(predicate: (item: KeyValuePair<TKey, TValue>)=> boolean) : IDictionary<TKey, TValue> {
        let temp = new Dictionary<TKey, TValue>();

        this.list.filter(element => {
            if (predicate(element))
            {
                temp.add(element.key, element.value);
            }
        });

        return temp;
    }

    select<TResult>(predicate: (item: KeyValuePair<TKey, TValue>)=> TResult) : IEnumerable<TResult> {
        let temp = new List<TResult>();

        this.forEach(x => temp.add(predicate(x)));

        return temp;
    }

    forEach(predicate: (item: KeyValuePair<TKey, TValue>)=> void) : void {
        this.list.forEach(x => predicate(x));
    }

    toArray() : Array<KeyValuePair<TKey, TValue>> {
        return this.list.slice();
    }

    join<TOuter, TMatch, TResult>(outer: IEnumerable<TOuter>, conditionInner: (item: KeyValuePair<TKey, TValue>)=> TMatch, 
                                    conditionOuter: (item: TOuter)=> TMatch, select: (x: KeyValuePair<TKey, TValue>, y:TOuter)=> TResult, leftJoin: boolean = false) : IEnumerable<TResult> {
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

    groupBy(predicate: (item: KeyValuePair<TKey, TValue>) => Array<any>) : IEnumerable<Group<KeyValuePair<TKey, TValue>>> {
        let groups = {};
        this.list.forEach(function (o) {
          var group = JSON.stringify(predicate(o));
          groups[group] = groups[group] || [];
          groups[group].push(o);
        });
        let g = Object.keys(groups).map(function (group) {                
            let a = group.substr(1, group.length - 2);
            
            let grp= new Group<KeyValuePair<TKey, TValue>>(new List(a.split(',')).select(x => x.replace(/^(")?(.*?)(")?$/ig, "$2")).toArray(), 
                                    groups[group]);            

            return grp;
        });

        return new List<Group<KeyValuePair<TKey, TValue>>>(g);        
    }

    selectMany<TResult>(predicate: (item: KeyValuePair<TKey, TValue>)=> Array<TResult>) : IEnumerable<TResult> {
        return this.list.reduce((out, inx) => {
            var items = predicate(inx);
            out.addRange(items);
            return out;
          }, new List<TResult>(new Array<TResult>()));
    }

    orderBy(comparer: IComparer<KeyValuePair<TKey, TValue>>) : IEnumerable<KeyValuePair<TKey, TValue>> {
        let temp = this.list.sort((x,y) => comparer.compare(x, y));

        return new List<KeyValuePair<TKey, TValue>>(temp);
    }

    distinct(comparer: IEqualityComparer<KeyValuePair<TKey, TValue>>) : IEnumerable<KeyValuePair<TKey, TValue>> {
        let uniques = new List<KeyValuePair<TKey, TValue>>();
        this.forEach(x => {
            if (uniques.length > 0) {
                if (!uniques.any(y => comparer.equals(x, y)))
                {
                    uniques.add(x);
                }               
            }
            else {
                uniques.add(x);
            }            
        });

        return uniques;
    }

    union(list: IEnumerable<KeyValuePair<TKey, TValue>>) : IDictionary<TKey, TValue> {
         this.addRange(list.toArray());

         return this;
    }    

    reverse(): IEnumerable<KeyValuePair<TKey, TValue>> {
        return new List<KeyValuePair<TKey, TValue>>(this.list.slice().reverse());
    }

    skip(no: number) : IDictionary<TKey, TValue> {
        if (no > 0) {
            return new Dictionary(this.list.slice(no, this.list.length - 1));
        }
        
        return this;
    }

    take(no: number) : IDictionary<TKey, TValue> {
        if (no > 0) {
            return new Dictionary(this.list.slice(0, no));
        }        

        return this;
    }    

    sum(predicate: (item: KeyValuePair<TKey, TValue>)=> number) : number {
        let sum: number = 0;
        this.list.forEach(x => sum = sum + predicate(x));

        return sum;
    }

    avg(predicate: (item: KeyValuePair<TKey, TValue>)=> number) : number {        
        return this.sum(predicate) / this.length;
    }

    min(predicate: (item: KeyValuePair<TKey, TValue>)=> number) : number {
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
    
    max(predicate: (item: KeyValuePair<TKey, TValue>)=> number) : number {
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

    count(predicate: (item: KeyValuePair<TKey, TValue>)=> boolean = null) : number {
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