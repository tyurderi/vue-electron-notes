import Vue from 'vue';
import Vuex from 'vuex';
import settings from 'electron-settings';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        directories: [],
        selectedDirectoryID: null,
        items: [],
        selectedItemID: null
    },
    mutations: {
        LOAD(state)
        {
            state.directories = settings.get('directories') || [];
            state.items       = settings.get('items') || [];
        },
        SAVE(state)
        {
            settings.set('directories', state.directories);
            settings.set('items', state.items);
        },
        SELECT_DIRECTORY(state, payload)
        {
            state.selectedDirectoryID = payload.id;
        },
        ADD_DIRECTORY(state, payload)
        {
            state.directories.push(payload);
        },
        REMOVE_DIRECTORY(state, payload)
        {
            state.directories.splice(state.directories.indexOf(payload), 1);
        },

        SELECT_ITEM(state, payload)
        {
            state.selectedItemID = payload.id;
        },
        ADD_ITEM(state, payload)
        {
            state.items.push(payload);
        },
        REMOVE_ITEM(state, payload)
        {
            state.items.splice(state.items.indexOf(payload), 1);
        }
    },
    getters: {
        directories:        (state) => state.directories,
        selectedDirectoryID: (state) => state.selectedDirectoryID,

        items:          (state) => state.items,
        selectedItemID: (state) => state.selectedItemID
    }
});