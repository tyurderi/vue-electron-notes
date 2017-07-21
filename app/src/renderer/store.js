import Vue from 'vue';
import Vuex from 'vuex';
import settings from 'electron-settings';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        directories: [],
        selectedDirectoryID: null,
        items: [],
        selectedItemID: null,
        nextID: {
            directory: 0,
            item: 0
        }
    },
    mutations: {
        FIX_IDS(state)
        {
            if (settings.get('id_fix_executed') === true)
            {
                return;
            }

            // set new ids for directories
            state.directories.forEach((directory) => {
                let directoryID = ++state.nextID.directory;

                state.directories.forEach((childCategory) => {
                    if (childCategory.parent === directory.id) {
                        childCategory.parent = directoryID;
                    }
                });

                state.items.forEach((item) => {
                    if (item.directoryID === directory.id) {
                        item.directoryID = directoryID;
                    }
                });

                directory.id = directoryID;
            });

            // set new ids for items
            state.items.forEach((item) => {
                let itemID = ++state.nextID.item;

                // probably check for any dependencies to update them too

                item.id = ++state.nextID.item;
            });

            settings.set('id_fix_executed', true);
        },
        LOAD(state)
        {
            state.directories = settings.get('directories')    || [];
            state.items       = settings.get('items')          || [];
            state.nextID      = settings.get('auto_increment') || state.nextID;
        },
        SAVE(state)
        {
            settings.set('directories',    state.directories);
            settings.set('items',          state.items);
            settings.set('auto_increment', state.nextID);
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
        },

        SET_NEXT_ID(state, payload)
        {
            state.nextID[payload.type] = payload.value;
        }
    },
    getters: {
        directories:        (state) => state.directories,
        selectedDirectoryID: (state) => state.selectedDirectoryID,

        items:          (state) => state.items,
        selectedItemID: (state) => state.selectedItemID,

        nextID: (state) => state.nextID
    }
});