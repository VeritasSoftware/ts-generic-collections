import { IComparer, Group } from './common';

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