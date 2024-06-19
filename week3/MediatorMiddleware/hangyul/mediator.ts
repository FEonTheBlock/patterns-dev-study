interface Mediator {
    notify(sender: object, event: string): void;
  }
  
  class ConcreteMediator implements Mediator {
    private component1: Component1;
    private component2: Component2;
  
    constructor(c1: Component1, c2: Component2) {
      this.component1 = c1;
      this.component1.setMediator(this);
      this.component2 = c2;
      this.component2.setMediator(this);
    }
    public notify(sender: object, event: string): void {
      if (event === "A") {
        console.log("중재자는 A에 대하여 아래 동작을 수행합니다.");
        this.component2.doC();
      }
      if (event === "D") {
        console.log("중재자는 D에 대하여 아래 동작을 수행합니다.");
        this.component1.doB();
        this.component2.doC();
      }
    }
  }
  
  class BaseComponent {
    protected mediator: Mediator;
    constructor(mediator?: Mediator) {
      this.mediator = mediator!;
    }
    public setMediator(mediator: Mediator): void {
      this.mediator = mediator;
    }
  }
  
  class Component1 extends BaseComponent {
    public doA(): void {
      console.log("Component1이 A를 한다.");
      this.mediator.notify(this, "A");
    }
    public doB(): void {
      console.log("Component1이 B를 한다.");
      this.mediator.notify(this, "B");
    }
  }
  class Component2 extends BaseComponent {
    public doC(): void {
      console.log("Component2가 C를 한다.");
      this.mediator.notify(this, "C");
    }
    public doD(): void {
      console.log("Component2가 D를 한다.");
      this.mediator.notify(this, "D");
    }
  }
  
  const c1 = new Component1();
  const c2 = new Component2();
  const mediator = new ConcreteMediator(c1, c2);
  
  c1.doA();
  
  c2.doD();
  