# The F2E 2nd 番茄鐘

DEMO：https://twozwu.github.io/f2e-2nd-pomodoro/

![](https://s3-us-west-2.amazonaws.com/thef2e-hexschool/works/12TXq64NZohgTVWLgqP3nVxWlxqlsPbrA3ST2hlg02JZUNnrIWIyBVTVQVV75wXMkJ5V7sYU6J7RQ2EboY54Hl1a8lb5Y0bRzDb0KUCkG6bmfXPLpjkV9XlDDApp4LO6.png)

設計稿：https://challenge.thef2e.com/user/3?schedule=2590#works-2590

整合 `to do list`、圖表套件`chart.js`、倒數計時等狀態改變

其中 `chart.js` 還要搭配 `Day.js` 靈活運用，才能顯示底下日期、切換

---

# template-vite-vue-tailwind-v3

- **template of:** vite + vue
- **tailwindcss:** v3.x
- **state management:** vuex

---

使用vuex狀態管理來聯絡各個組件的存取，各組件需要的常用功能皆存放在公共空間

// ../src/store/index.js

```javascript
export default createStore({
  state: {
    todos: [
      { id: 1645773585583, content: "構思番茄鐘 UI 介面", done: false },
      { id: 1645773685584, content: "學習 Javascript", done: false },
      { id: 1645773785585, content: "學習網頁切版", done: false },
      { id: 1646209885585, content: "已完成case", done: true },
    ],
  },
  mutations: {
    getToDos(state) {
      state.todos = JSON.parse(localStorage.getItem("todos"));
    },
    add(state, item) {
      state.todos.push(item);
      localStorage.setItem("todos", JSON.stringify(state.todos));
    },
    editDone(state, data) {
      const index = getIndex(state, data.id);
      state.todos[index].content = data.content;
      state.todos[index].done = data.done;
      localStorage.setItem("todos", JSON.stringify(state.todos));
    },
    delete(state, id) {
      const index = getIndex(state, id);
      state.todos.splice(index, 1);
      localStorage.setItem("todos", JSON.stringify(state.todos));
    },
  },
  actions: {
  },
  getters: {
    findItem(state) {
      return function findItem(id) {
        return state.todos.find((item) => item.id === id);
      };
    },
    todayJobs(state) {
      const todayTime = dayjs().startOf("day").valueOf();
      const todayToDos = state.todos.filter((todo) => todo.id > todayTime);
      const todayPacket = {
        active: todayToDos.filter((todo) => !todo.done),
        done: todayToDos.filter((todo) => todo.done),
      };
      return todayPacket;
    },
    thisWeekJobs: (state) => {
      const weekPacket = {
        active: state.todos.filter((todo) => !todo.done),
        done: state.todos.filter((todo) => todo.done),
      };
      return weekPacket;
    },
  },
});
```

## Started

```bash
yarn
# or `npm install`
```

---

## Develop

```bash
yarn dev
# or `npm run dev`
```

---

## Build

```bash
yarn build
# or `npm run build`
```

---

<p align="center">
<img src="./powered-by-vitawind-bright.png">
</p>
