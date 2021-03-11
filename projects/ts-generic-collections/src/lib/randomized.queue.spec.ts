import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomizedQueue } from './randomized.queue';

describe('Randomized Queue', () => {

  beforeEach(async(() => {

  }));

  beforeEach(() => {

  });

  it('instantiate queue from json', () => {
    let jsonOwnerArray = '[{"id":1, "name": "John Doe"},{"id":2, "name": "Jane Doe"}]';

    let ownerArray: Owner[] = JSON.parse(jsonOwnerArray);

    let list = new RandomizedQueue(ownerArray);

    expect(list.toArray().length == 2);
  });

  it('enqueue', () => {
    let queue = new RandomizedQueue<Owner>();

    let owner = new Owner();
    owner.name = "John Doe";

    //enqueue
    queue.enqueue(owner);

    expect(queue.toArray().length == 1).toBeTruthy();

    let owner2 = new Owner();
    owner2.name = "Jane Doe";

    //enqueue
    queue.enqueue(owner2);

    expect(queue.toArray().length == 2).toBeTruthy();
  });

  it('dequeue', () => {
    let queue = new RandomizedQueue<Owner>();

    let owner = new Owner();
    owner.name = "John Doe";

    //enqueue
    queue.enqueue(owner);

    let owner2 = new Owner();
    owner2.name = "Jane Doe";

    //enqueue
    queue.enqueue(owner2);

    expect(queue.toArray().length == 2).toBeTruthy();

    //dequeue
    var dequeued = queue.dequeue();

    expect(queue.toArray().length == 1).toBeTruthy();
  });
  
  it('peek', () => {
    let queue = new RandomizedQueue<Owner>();

    let owner = new Owner();
    owner.name = "John Doe";

    //enqueue
    queue.enqueue(owner);

    let owner2 = new Owner();
    owner2.name = "Jane Doe";

    //enqueue
    queue.enqueue(owner2);

    expect(queue.toArray().length == 2).toBeTruthy();

    //peek
    var peeked = queue.peek();

    expect(peeked.name == "John Doe" || peeked.name == "Jane Doe").toBeTruthy();
    expect(queue.toArray().length == 2).toBeTruthy();
  }); 
  
  it('peekAndDequeue', () => {
    let queue = new RandomizedQueue<Owner>();

    let owner = new Owner();
    owner.name = "John Doe";

    //enqueue
    queue.enqueue(owner);

    let owner2 = new Owner();
    owner2.name = "Jane Doe";

    //enqueue
    queue.enqueue(owner2);

    expect(queue.toArray().length == 2).toBeTruthy();

    //peek
    var peeked = queue.peek();

    expect(peeked.name == "John Doe" || peeked.name == "Jane Doe").toBeTruthy();
    expect(queue.toArray().length == 2).toBeTruthy();

    var dequeued = queue.dequeue();
    expect(dequeued.name == peeked.name);
    expect(queue.toArray().length == 1).toBeTruthy();
  }); 

  it('forEach', () => {
    let queue = new RandomizedQueue<Owner>();

    let owner = new Owner();
    owner.name = "John Doe";

    //enqueue
    queue.enqueue(owner);

    let owner2 = new Owner();
    owner2.name = "Jane Doe";

    //enqueue
    queue.enqueue(owner2);

    expect(queue.toArray().length == 2).toBeTruthy();

    let i: number = 0;
    //forEach
    queue.forEach(item => {
        i++;
    });

    expect(queue.toArray().length == i).toBeTruthy();
  }); 
    
});

class Owner {
    id: number;
    name: string;
}
