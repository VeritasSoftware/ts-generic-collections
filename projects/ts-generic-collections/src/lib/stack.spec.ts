import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Stack } from './stack';

describe('Stack', () => {

  beforeEach(async(() => {

  }));

  beforeEach(() => {

  });

  it('instantiate stack from json', () => {
    let jsonOwnerArray = '[{"id":1, "name": "John Doe"},{"id":2, "name": "Jane Doe"}]';

    let ownerArray: Owner[] = JSON.parse(jsonOwnerArray);

    let stack = new Stack(ownerArray);

    expect(stack.toArray().length == 2);
  });

  it('push', () => {
    let stack = new Stack<Owner>();

    let owner = new Owner();
    owner.name = "John Doe";

    //push
    stack.push(owner);

    expect(stack.toArray().length == 1).toBeTruthy();

    let owner2 = new Owner();
    owner2.name = "Jane Doe";

    //push
    stack.push(owner2);

    expect(stack.toArray().length == 2).toBeTruthy();
  });

  it('pop', () => {
    let stack = new Stack<Owner>();

    let owner = new Owner();
    owner.name = "John Doe";

    //push
    stack.push(owner);

    let owner2 = new Owner();
    owner2.name = "Jane Doe";

    //push
    stack.push(owner2);

    expect(stack.toArray().length == 2).toBeTruthy();

    //pop
    var popped = stack.pop();

    expect(popped.name == "Jane Doe").toBeTruthy();
    expect(stack.toArray().length == 1).toBeTruthy();

    var popped2 = stack.pop();

    expect(popped2.name == "John Doe").toBeTruthy();
    expect(stack.toArray().length == 0).toBeTruthy();
  });
  
  it('peek', () => {
    let stack = new Stack<Owner>();

    let owner = new Owner();
    owner.name = "John Doe";

    //push
    stack.push(owner);

    let owner2 = new Owner();
    owner2.name = "Jane Doe";

    //push
    stack.push(owner2);

    expect(stack.toArray().length == 2).toBeTruthy();

    //peek
    var peeked = stack.peek();

    expect(peeked.name == "Jane Doe").toBeTruthy();
    expect(stack.toArray().length == 2).toBeTruthy();
  });  

  it('forEach', () => {
    let stack = new Stack<Owner>();

    let owner = new Owner();
    owner.name = "John Doe";

    //push
    stack.push(owner);

    let owner2 = new Owner();
    owner2.name = "Jane Doe";

    //push
    stack.push(owner2);

    expect(stack.toArray().length == 2).toBeTruthy();

    let i: number = 0;
    //forEach
    stack.forEach(item => {
        i++;
    });

    expect(stack.toArray().length == i).toBeTruthy();
  }); 
    
});

class Owner {
    id: number;
    name: string;
}
