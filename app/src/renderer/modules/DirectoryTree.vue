<template>
    <ul class="directory-tree">
        <li v-for="(item, key) in items" :key="key"
            class="directory-item"
            :class="{ active: item.id === selectedDirectoryID }">
            <div class="row" @click="select(item)">
                <span class="item-icon">
                    <span class="toggle-icon"  @click="item.opened = !item.opened" v-if="children(item.id).length > 0">
                        <i class="fa fa-chevron-right" v-if="!item.opened"></i>
                        <i class="fa fa-chevron-down" v-if="item.opened"></i>
                    </span>
                </span>
                <span class="item-name flex row" @dblclick="edit(item)">
                    <template v-if="item.editing">
                        <input type="text" v-model="item.name" class="flex" :data-id="item.id"
                            @blur="stopEdit(item)"
                            @keydown.enter.prevent="stopEdit(item)"
                            @keydown.esc.prevent="stopEdit(item)" />
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
        selectedDirectoryID() { return this.$store.getters.selectedDirectoryID }
    },
    methods: {
        select(directory)
        {
            this.$store.commit('SELECT_DIRECTORY', directory);

            let item = this.$store.getters.items.find(item => item.directoryID === directory.id);

            if (item)
            {
                this.$store.commit('SELECT_ITEM', item);
            }
            else
            {
                this.$store.commit('SELECT_ITEM', { id: null });
            }
        },
        edit(item)
        {
            item.editing = true;
            
            this.$nextTick(() => {
                document.querySelector('input[data-id="'+item.id+'"]').focus();
            })
        },
        stopEdit(item)
        {
            item.editing = false;

            if (item.name === '')
            {
                item.name = 'New folder';
            }

            this.$store.commit('SAVE');
        },
        children(id)
        {
            return this.$store.getters.directories.filter(d => d.parent === id);
        }
    }
}
</script>