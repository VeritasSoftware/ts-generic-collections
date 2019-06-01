import { IEnumerable, IComparer } from './interfaces';
import { List } from './list';
import { Group } from './common';

export interface IDictionary<TKey, TValue> extends IEnumerable<KeyValuePair<TKey, TValue>> {
    add(key: TKey, value: TValue) : void;
    addRange(items: KeyValuePair<TKey, TValue>[]) : void;
    remove(predicate: (item:KeyValuePair<TKey, TValue>) => boolean) : void;
    clear() : void;
}

export class Dictionary<TKey, TValue> implements IDictionary<TKey, TValue>
{
    list: Array<KeyValuePair<TKey, TValue>> = new Array<KeyValuePair<TKey, TValue>>();

    constructor(list: Array<KeyValuePair<TKey, TValue>> = null) {
        if (list) {
            this.list = list;
        }        
    }

    /* IList */

    add(key: TKey, value: TValue) : void {
        let pair = new KeyValuePair<TKey, TValue>(key, value);

        if (this.any(x => x.key === pair.key)) {
            throw "Duplicate key. Cannot add."
        }

        this.list.push(pair);
    }

    addRange(items: KeyValuePair<TKey, TValue>[]) : void {
        items.forEach(x => this.add(x.key, x.value));
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

    /* IEnumerable */

    asEnumerable() : IEnumerable<KeyValuePair<TKey, TValue>> {
        return this;
    }

    get length(): number {
        return this.list.length;
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

    first(predicate: (item: KeyValuePair<TKey, TValue>)=> boolean = null) : KeyValuePair<TKey, TValue> {
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
    
    last() : KeyValuePair<TKey, TValue> {
        if (this.list.length <= 0) {
            return null;
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
            throw "Multiple instances of entity found.";
        }

        return temp[0];
    }    

    firstOrDefault(predicate: (item: KeyValuePair<TKey, TValue>)=> boolean) : KeyValuePair<TKey, TValue> {
        let temp = new Array<KeyValuePair<TKey, TValue>>();

        this.list.filter(element => {
            if (predicate(element))
            {
                temp.push(element);
            }
        });

        return temp[0];
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
        return this.list;
    }

    join<TOuter, TMatch, TResult>(outer: IEnumerable<TOuter>, conditionInner: (item: KeyValuePair<TKey, TValue>)=> TMatch, 
                                    conditionOuter: (item: TOuter)=> TMatch, select: (x: KeyValuePair<TKey, TValue>, y:TOuter)=> TResult) : IEnumerable<TResult> {
        let resultList = new List<TResult>();

        this.list.forEach(x => {
            let outerEntries = outer.toArray().filter(y => conditionInner(x) === conditionOuter(y));

            outerEntries.forEach(z => resultList.add(select(x, z)));
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

            let grp= new Group<KeyValuePair<TKey, TValue>>(a.split(','), groups[group]);

            return grp;
        });

        return new List<Group<KeyValuePair<TKey, TValue>>>(g);        
    }

    orderBy(comparer: IComparer<KeyValuePair<TKey, TValue>>) : IEnumerable<KeyValuePair<TKey, TValue>> {
        let temp = this.list.sort((x,y) => comparer.compare(x, y));

        return new List<KeyValuePair<TKey, TValue>>(temp);
    }

    union(list: IEnumerable<KeyValuePair<TKey, TValue>>) : IDictionary<TKey, TValue> {
         list.forEach(x => this.list.push(x));

         return this;
    }    
}

export class KeyValuePair<TKey, TValue> {
    key: TKey;
    value: TValue;

    constructor(key: TKey, value: TValue) {
        this.key = key;
        this.value = value;
    }
}