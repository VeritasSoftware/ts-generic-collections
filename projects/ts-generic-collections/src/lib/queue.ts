import { objCompare } from './common';
import { List } from './list';

export interface IQueue<T> {    
    clear() : void;
    contains(item: T) : boolean;
    dequeue() : T;
    enqueue(item: T) : void;
    peek(): T;
    forEach(predicate: (item: T)=> void) : void;
    toArray(): Array<T>; 
}

export class Queue<T> implements IQueue<T> {
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
    dequeue() : T {
        if (this.list.length > 0)
        {            
            var element = this.list.elementAt(0);

            this.list.removeAt(0);

            return element;
        }

        return null;
    }
    enqueue(item: T) : void {
        this.list.add(item);
    }
    peek() : T {
        if (this.list.length > 0)
        {
            var element = this.list.elementAt(0);        

            return element;
        }

        return null;
    }
    forEach(predicate: (item: T)=> void) : void {
        this.list.forEach(predicate);
    }
    toArray() : Array<T> {
        return this.list.toArray();
    }
}