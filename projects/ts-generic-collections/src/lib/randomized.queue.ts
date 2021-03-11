import { IQueue } from './queue';
import { objCompare } from './common';
import { List } from './list';

export class RandomizedQueue<T> implements IQueue<T> {
    private list: List<T> = new List<T>();  
    private peekIndex: number = -1;  

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
            var min = 0;
            var max = this.list.length;
            
            var index = this.peekIndex >= 0 ? this.peekIndex : Math.floor(Math.random() * (max - min)) + min;

            var element = this.list.elementAt(index);

            this.list.removeAt(index);

            this.peekIndex = -1;

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
            var min = 0;
            var max = this.list.length;

            this.peekIndex = Math.floor(Math.random() * (max - min)) + min;

            var element = this.list.elementAt(this.peekIndex);        

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