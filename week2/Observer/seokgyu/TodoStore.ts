export type TodoItem = { content: string; id: string };
export type Subscriber = (props: TodoItem[]) => void;

type TodoStore = {
  todos: TodoItem[];
  subscribers: Subscriber[];

  notify: (todo: TodoItem[]) => void;
  subscribe: (callback: Subscriber) => void;
  unsubscribe: (callback: Subscriber) => void;

  getTodos: () => TodoItem[];
  addTodo: (todo: TodoItem) => void;
  removeTodo: (id: string) => void;
};

const TodoStore: TodoStore = Object.freeze({
  todos: [],
  subscribers: [],

  notify(todos: TodoItem[]) {
    this.subscribers.forEach((subscriber) => subscriber(todos));
  },

  subscribe(callback: Subscriber) {
    this.subscribers.push(callback);
  },

  unsubscribe(callback: Subscriber) {
    this.subscribers = this.subscribers.filter(
      (subscriber) => subscriber !== callback
    );
  },

  getTodos() {
    return this.todos;
  },

  addTodo(todo: TodoItem) {
    this.todos.push(todo);
    this.notify(this.todos);
  },

  removeTodo(id: string) {
    this.todos = this.todos.filter((todo) => id !== todo.id);
    this.notify(this.todos);
  },
});

export default TodoStore;
