import { IEnumerable } from './interfaces';
import { List } from './list';

export interface IComparer<T> {
    compare(x:T, y: T) : number;
}

export interface IGroup<T> {
    groups: any[];
    list: IEnumerable<T>;
}

export class Group<T> implements IGroup<T> {
    groups: any[];
    list: IEnumerable<T> = new List<T>();

    constructor(groups: any[], list: Array<T>) {
        this.groups = groups;
        this.list = new List<T>(list);
    }
}