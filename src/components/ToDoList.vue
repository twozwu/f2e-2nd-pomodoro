<script setup>
import { ref, getCurrentInstance, computed } from 'vue'
import { useStore } from 'vuex'

const { proxy } = getCurrentInstance()
const store = useStore()

defineProps({
    listStatus: Boolean,
})

const vFocus = {
    mounted(el) {
        el.focus()
    }
}

if (localStorage.getItem('todos')) {
    store.commit('getToDos')
}

const toDoList = computed(() => store.state.todos)

const filterStatus = ref('active')
const todoFilter = {
    active: () => {
        return toDoList.value.filter((item) => !item.done)
    },
    complete: () => {
        return toDoList.value.filter((item) => item.done)
    }
}

//顯示過濾後的資料
const displayItems = computed(() => {
    return todoFilter[filterStatus.value]()
})

const mainInput = ref(null)
const templateContent = ref(null)
const todo = {
    add: () => {
        if (!mainInput.value) return
        const item = {
            id: Date.now(),
            content: mainInput.value,
            done: false
        }
        store.commit('add', item)
        proxy.$emitter.emit('chartUpdate')
        mainInput.value = null
    },
    checkboxToggle: (id) => {
        const item = store.getters.findItem(id)
        const data = {
            id: id,
            content: item.content,
            done: !item.done
        }
        store.commit('editDone', data)
        proxy.$emitter.emit('chartUpdate')
    },
    edit: (id) => {
        const item = store.getters.findItem(id)
        templateContent.value = { ...item }
    },
    editDone: (id) => {
        const data = {
            id: id,
            content: templateContent.value.content,
        }
        store.commit('editDone', data)
        proxy.$emitter.emit('chartUpdate')
        templateContent.value = null
    },
    editCancel: () => {
        templateContent.value = null
    },
    delete: (id) => {
        store.commit('delete', id)
        proxy.$emitter.emit('chartUpdate')
    }
}
</script>

<template>
    <div
        class="absolute h-screen shadow-2xl z-10 overflow-hidden w-1/2 py-28 px-10 -left-1/2 duration-500"
        :class="{ 'translate-x-full': listStatus }"
    >
        <div class="flex justify-between items-end">
            <span class="text-4xl font-bold">代辦清單</span>
            <div class="flex">
                <button
                    class="border-b-2 border-transparent hover:border-b-2 hover:border-secondary mr-3"
                    :class="{ 'text-gray-50/30': filterStatus !== 'active' }"
                    @click="filterStatus = 'active'"
                >未完成</button>
                <button
                    class="border-b-2 border-transparent hover:border-b-2 hover:border-secondary"
                    :class="{ 'text-gray-50/30': filterStatus !== 'complete' }"
                    @click="filterStatus = 'complete'"
                >已完成</button>
            </div>
        </div>
        <div class="relative flex items-center text-primary my-10">
            <input
                type="text"
                class="border rounded-full w-full py-4 px-8 outline-secondary"
                placeholder="新增代辦事項"
                v-model="mainInput"
                v-focus
                @keyup.enter="todo.add"
            />
            <button
                class="absolute bg-orange-400 rounded-full text-3xl text-white right-2 w-1/6 h-5/6"
                @click="todo.add"
            >+</button>
        </div>
        <div class="divide-y divide-gray-200/30 border-y border-gray-200/30 h-full overflow-y-auto">
            <div
                class="flex items-center justify- py-3"
                v-for="item in displayItems"
                :key="item.id"
            >
                <div class="flex items-center">
                    <label
                        :for="item.id"
                        class="w-7 h-7 border-2 rounded-full select-none mr-5"
                        @click="todo.checkboxToggle(item.id)"
                    >
                        <input
                            type="checkbox"
                            name
                            :id="item.id"
                            class="hidden"
                            v-model="item.done"
                        />
                        <span class="material-icons" :class="{ 'hidden': !item.done }">done</span>
                    </label>
                </div>
                <span
                    class="w-2/3"
                    :class="{ 'line-through': item.done }"
                    @dblclick="todo.edit(item.id)"
                    v-if="templateContent?.id !== item.id"
                >{{ item.content }}</span>
                <input
                    type="text"
                    class="text-primary py-1 px-2"
                    name
                    id
                    v-model="templateContent.content"
                    v-else
                    v-focus
                    @blur="todo.editCancel"
                    @keyup.enter="todo.editDone(item.id)"
                />
                <div class="flex items-center ml-auto">
                    <label :for="item.id - 1">
                        <button
                            class="rounded-full hover:bg-secondary mr-3 p-1"
                            @click="todo.edit(item.id)"
                        >
                            <img src="/images/icon-edit.svg" alt class />
                        </button>
                    </label>
                    <button
                        class="rounded-full hover:bg-secondary p-1"
                        @click="todo.delete(item.id)"
                    >
                        <img src="/images/icon-delete.svg" alt class />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>