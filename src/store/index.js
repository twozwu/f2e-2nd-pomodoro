import { createStore } from "vuex";
import dayjs from "dayjs";

function getIndex(state, id) {
  return state.todos.findIndex((item) => item.id === id);
}

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
    // loadToDos({ commit }) {
    //   commit("addTimes"); //呼叫mutation的addTimes
    // },
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
