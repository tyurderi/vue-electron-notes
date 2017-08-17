<template>
    <ul class="flex">
        <li v-for="(item, key) in items" :key="key"
            :class="{
                active: item.id === selectedDirectoryID,
                isPrivate: isPrivateMode && !(item.id === selectedDirectoryID)
            }">
            <div class="row" @click="select(item)">
                <span class="item-icon">
                    <span class="toggle-icon"  @click="item.opened = !item.opened" v-if="children(item.id).length > 0">
                        <i class="fa fa-chevron-right" v-if="!item.opened"></i>
                        <i class="fa fa-chevron-down" v-if="item.opened"></i>
                    </span>
                </span>
                <span class="item-name flex row" @dblclick="edit(item)" @contextmenu.prevent="openMenu($event, item)">
                    <template v-if="item.editing">
                        <input type="text" v-model="item.name" class="flex" :data-id="item.id"
                            @blur="stopEdit(item)"
                            @keydown.enter.prevent="stopEdit(item)"
                            @keydown.esc.prevent="stopEdit(item)"
                        />
                    </template>
                    <template v-else>
                        {{ item.name }}
                    </template>
                </span>
            </div>
            <directory-tree v-if="children(item.id) && item.opened" :id="item.id"></directory-tree>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'DirectoryTree',
    props: [
        /**
         * ID of the parent directory.
         */
        'id'
    ],
    computed: {
        items()
        {
            return this.children(this.id);
        },
        selectedDirectoryID() { return this.$store.getters.selectedDirectoryID },
        isPrivateMode() { return this.$store.getters.privateMode }
    },
    methods: {
        select(directory)
        {
            this.$directories.select(directory);

            let archived = this.$store.getters.itemView === 'archived',
                item     = this.$store.getters.items.find(item => item.directoryID === directory.id && item.archived === archived);
            
            this.$items.select(item || { id: null });
        },
        edit(item)
        {
            item.editing = true;
            
            this.$nextTick(() => {
                document.querySelector('input[data-id="' + item.id + '"]').focus();
            })
        },
        stopEdit(item)
        {
            item.editing = false;

            if (item.name === '')
            {
                item.name = 'New folder';
            }
            
            this.$items.save();
        },
        children(id)
        {
            return this.$store.getters.directories.filter(d => d.parent === id);
        },
        openMenu(e, item)
        {
            this.$contextMenu.open(e, [
                { icon: 'plus', label: 'Add', handler: this.onAdd.bind(this, item) },
                { icon: 'trash', label: 'Remove', handler: this.onRemove.bind(this, item) },
                {
                    icon: 'eye',
                    label: 'Toggle private mode',
                    handler: this.onTogglePrivateMode.bind(this)
                }
            ]);
        },
        onAdd(parent)
        {
            let directory = this.$directories.create(parent.id);
    
            this.$nextTick(() => {
                this.$directories.focusInput(directory);
            });
        },
        onRemove(parent)
        {
            let directory = this.$store.getters.directories.find(d => d.id === parent.id);
    
            if (!directory || !confirm('Are you sure to delete this directory?'))
            {
                return;
            }
    
            this.$directories.remove(directory);
            this.$directories.clearSelect();
            this.$directories.save();
        },
        onTogglePrivateMode()
        {
            let privateMode = this.$store.getters.privateMode;
            
            this.$store.commit('SET_PRIVATE_MODE', !privateMode);
        }
    }
}
</script>