let sayHiMixin = {
    sayHi() {
      console.log(`hello, ${this.name}`);
    },
    sayHiToUserName() {
      console.log(`hello, ${this.username}`);
    },
  };
  
  class Person {
    constructor(name) {
      this.name = name;
    }
  }
  
  class User extends Person {
    constructor(name, username) {
      super(name);
      this.username = username;
    }
  }
  
  Object.assign(User.prototype, sayHiMixin);
  
  new User("Hangyul").sayHi();
  new User("Hangyul", "Hanana").sayHiToUserName();
  