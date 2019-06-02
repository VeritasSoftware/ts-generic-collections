export interface IEnumerable<T> {
    any(predicate?: (item: T)=> boolean) : boolean;
    all(predicate?: (item: T)=> boolean) : boolean;
    first(predicate?: (item: T)=> boolean) : T;
    last() : T;
    singleOrDefault(predicate: (item: T)=> boolean) : T;    
    firstOrDefault(predicate: (item: T)=> boolean) : T;
    where(predicate: (item: T)=> boolean) : IEnumerable<T>;
    select<TResult>(predicate: (item: T)=> TResult) : IEnumerable<TResult>;
    join<TOuter, TMatch, TResult>(outer: IEnumerable<TOuter>, conditionInner: (item: T)=> TMatch, 
                                    conditionOuter: (item: TOuter)=> TMatch, select: (x: T, y:TOuter)=> TResult) : IEnumerable<TResult>;
    leftJoin<TOuter, TMatch, TResult>(outer: IEnumerable<TOuter>, conditionInner: (item: T)=> TMatch, 
                                    conditionOuter: (item: TOuter)=> TMatch, select: (x: T, y:TOuter)=> TResult) : IEnumerable<TResult>;                                    
    groupBy(predicate: (item: T) => Array<any>) : IEnumerable<IGroup<T>>;
    orderBy(comparer: IComparer<T>) : IEnumerable<T>;
    union(list: IEnumerable<T>) : IEnumerable<T>;
    forEach(predicate: (item: T)=> void) : void;
    length: number;
    toArray() : Array<T>;
    asEnumerable() : IEnumerable<T>;
}

export interface IGroup<T> {
    groups: any[];
    list: IEnumerable<T>;
}

export interface IComparer<T> {
    compare(x:T, y: T) : number;
}