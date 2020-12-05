import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Queue } from './queue';

describe('Queue', () => {

  beforeEach(async(() => {

  }));

  beforeEach(() => {

  });

  it('instantiate queue from json', () => {
    let jsonOwnerArray = '[{"id":1, "name": "John Doe"},{"id":2, "name": "Jane Doe"}]';

    let ownerArray: Owner[] = JSON.parse(jsonOwnerArray);

    let list = new Queue(ownerArray);

    expect(list.toArray().length == 2);
  });

  it('enqueue', () => {
    let queue = new Queue<Owner>();

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
    let queue = new Queue<Owner>();

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

    expect(dequeued.name == "John Doe").toBeTruthy();
    expect(queue.toArray().length == 1).toBeTruthy();

    var dequeued2 = queue.dequeue();

    expect(dequeued2.name == "Jane Doe").toBeTruthy();
    expect(queue.toArray().length == 0).toBeTruthy();
  });
  
  it('peek', () => {
    let queue = new Queue<Owner>();

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

    expect(peeked.name == "John Doe").toBeTruthy();
    expect(queue.toArray().length == 2).toBeTruthy();
  });  

    
});

class Owner {
    id: number;
    name: string;
}
