<template>
    <div class="index">
        <div class="head row">
            <div class="directories-header">
                <ul class="actions row">
                    <li @click="createDirectory($store.getters.selectedDirectoryID)">
                        <i class="fa fa-plus"></i>
                    </li>
                    <li @click="deleteDirectory($store.getters.selectedDirectoryID)">
                        <i class="fa fa-trash"></i>
                    </li>
                </ul>
            </div>
            <div class="items-header">
                <ul class="actions row">
                    <li @click="createItem($store.getters.selectedDirectoryID)">
                        <i class="fa fa-plus"></i>
                    </li>
                    <li @click="deleteItem($store.getters.selectedItemID)">
                        <i class="fa fa-trash"></i>
                    </li>
                </ul>
            </div>
            <!--<div class="search-box">
                <input type="text" placeholder="Search" class="search-input" />
                <span class="search-icon">
                    <i class="fa fa-search"></i>
                </span>
            </div>-->
        </div>
        <div class="body row">
             <div class="directories-container column">
                 <directory-tree :id="null" :key="null" class="flex"></directory-tree>

                 <ul class="directory-actions">
                     <li @click="createDirectory(null)">
                         <span>Create</span>
                     </li>
                 </ul>
            </div>
            <div class="items-container">
                <div class="item" v-for="(item, key) in items" :key="key"
                     :class="{ active: item.id === $store.getters.selectedItemID }"
                    @click="$store.commit('SELECT_ITEM', item)">
                    <span class="item-title">
                        {{ item.title }}
                    </span>
                    <span class="item-date">
                        {{ formatDate(item.created) }}
                    </span>
                </div>
            </div>
            <div class="content-container column">
                <div class="editor column flex" v-if="item">
                    <input type="text" v-model="item.title" ref="editorTitle"
                        @keydown.enter.prevent="$refs.editorText.focus()">
                    <textarea class="flex" v-model="item.text" ref="editorText"></textarea>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DirectoryTree from '@/modules/DirectoryTree';
import moment from 'moment';

export default {
    name: 'index',
    mounted()
    {
        this.$store.commit('LOAD');
        
        // Fix ids since they didn't fit well in the last version :/
        this.$store.commit('FIX_IDS');
        this.$store.commit('SAVE');
    },
    computed: {
        items()
        {
            return this.$store.getters.items.filter(item => {
                return item.directoryID === this.$store.getters.selectedDirectoryID;
            });
        },
        item()
        {
            return this.$store.getters.items.find(item => {
                return item.id === this.$store.getters.selectedItemID;
            });
        }
    },
    watch: {
        item: {
            deep: true,
            handler(item) {
                clearTimeout(this.itemSaveTimeout);

                this.itemSaveTimeout = setTimeout(() => {
                    this.$store.commit('SAVE');
                }, 250);
            }
        }
    },
    methods: {
        getNextDirectoryID()
        {
            let id = this.$store.getters.nextID.directory + 1;
            
            this.$store.commit('SET_NEXT_ID', {
                type: 'directory',
                value: id
            });
            
            return id;
        },
        getNextItemID()
        {
            let id = this.$store.getters.nextID.item + 1;

            this.$store.commit('SET_NEXT_ID', {
                type: 'item',
                value: id
            });

            return id;
        },
        createDirectory(directoryID)
        {
            let parent     = this.$store.getters.directories.find(d => d.id === directoryID),
                category   = {
                    id: this.getNextDirectoryID(),
                    parent: directoryID || null,
                    name: 'New folder',
                    editing: true,
                    opened: false
                };

            this.$store.commit('ADD_DIRECTORY', category);

            if (parent)
            {
                parent.opened = true;
            }

            this.$nextTick(() => {
                let input = document.querySelector('input[data-id="'+category.id+'"]');

                if (input)
                {
                    input.select();
                    input.focus();
                }
            });

            this.$store.commit('SAVE');
        },
        deleteDirectory(directoryID, needConfirm)
        {
            let category = this.$store.getters.directories.find(d => d.id === directoryID);

            if (!category || needConfirm !== false && !confirm('Are you sure to delete this directory?'))
            {
                return;
            }

            let children = this.getDirectories(category.id);

            if (children.length > 0)
            {
                children.forEach(child => this.deleteDirectory(child.id, false));
            }

            this.$store.commit('REMOVE_DIRECTORY', category);
            this.$store.commit('SELECT_DIRECTORY', { id: null });

            this.$store.commit('SAVE');
        },
        getDirectories(id)
        {
            return this.$store.getters.directories.filter(d => d.parent === id);
        },
        createItem(directoryID)
        {
            if (!directoryID)
            {
                return;
            }
            
            let item = {
                id: this.getNextItemID(),
                title: 'New item',
                text: '',
                created: new Date(),
                changed: new Date(),
                directoryID: directoryID
            };

            this.$store.commit('ADD_ITEM', item);
            this.$store.commit('SELECT_ITEM', item);

            this.$nextTick(() => {
                this.$refs.editorTitle.select();
                this.$refs.editorTitle.focus();
            });

            this.$store.commit('SAVE');
        },
        deleteItem(itemID)
        {
            let item = this.$store.getters.items.find(item => item.id === itemID);

            if (!item || !confirm('Are you sure to delete this item?'))
            {
                return;
            }
            
            let directoryID = item.directoryID;

            this.$store.commit('REMOVE_ITEM', item);

            item = this.$store.getters.items.find(item => item.directoryID === directoryID);

            if (item)
            {
                this.$store.commit('SELECT_ITEM', item);
            }
            else
            {
                this.$store.commit('SELECT_ITEM', { id: null });
            }

            this.$store.commit('SAVE');
        },
        formatDate(date)
        {
            return moment(date).format('MMMM Do YYYY, h:mm:ss a');
        }
    },
    components: {
        DirectoryTree
    }
}
</script>