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

export interface IGroup<T> {
    groups: any[];
    list: IEnumerable<T>;
}

export interface IComparer<T> {
    compare(x:T, y: T) : number;
}

export interface IEqualityComparer<T> {
    equals(x:T, y: T) : boolean;
}