import { objCompare } from './common';
import { List } from './list';

export interface IStack<T> {
    clear() : void;
    contains(item: T) : boolean;
    pop() : T;
    push(item: T) : void;    
    peek(): T;
    forEach(predicate: (item: T)=> void) : void;
    toArray(): Array<T>;    
}

export class Stack<T> implements IStack<T> {
    private list: List<T> = new List<T>();    

    constructor(array: Array<T> = null) {
        if (array)
            this.list = new List<T>(array);
    }
    
    clear(): void {
        this.list.clear();
    }
    contains(item: T): boolean {
        return this.list.any(x => objCompare(x, item));
    }
    pop(): T {
        if (this.list.length > 0) {

            var element = this.list.elementAt(this.list.length - 1);

            this.list.removeAt(this.list.length - 1);

            return element;
        }

        return null;
    }
    push(item: T): void {
        this.list.add(item);
    }
    peek(): T {
        if (this.list.length > 0) {
            var element = this.list.elementAt(this.list.length - 1);            

            return element;
        }

        return null;
    }
    forEach(predicate: (item: T) => void): void {
        this.list.reverse().forEach(predicate);
    }
    toArray(): T[] {
        var tmp = new List<T>(this.list.toArray());
        return tmp.reverse().toArray();
    }
    
}