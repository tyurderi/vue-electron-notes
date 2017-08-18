<template>
    <div class="items-column column">
        <div class="items flex">
            <div class="item" v-for="(item, key) in sortedItems" :key="key"
                 :class="{ active: selected(item) }"
                 @click="select(item)">
                <div class="item-meta">
                    <div class="item-name">
                        {{ item.title }}
                    </div>
                    <div class="item-time">
                        {{ moment(item.created).format('MMMM Do YYYY, h:mm:ss a') }}
                    </div>
                </div>
                <ul class="item-icons">
                    <li v-if="item.encrypted && !item.decrypted"><i class="fa fa-lock"></i></li>
                    <li v-if="item.encrypted && item.decrypted"><i class="fa fa-unlock"></i></li>
                </ul>
            </div>
            <div class="no-items" v-if="!filteredItems.length">
                No items found
            </div>
        </div>
        <button class="toggle-archive" @click="toggleItemView"
                v-if="$store.getters.selectedDirectoryID && $store.getters.itemView === 'default' && archivedCount > 0">
             Archived ({{ archivedCount }})
         </button>
        <button class="toggle-archive" v-if="$store.getters.selectedDirectoryID && $store.getters.itemView === 'archived'"
                @click="toggleItemView">
            Go back
        </button>
    </div>
</template>

<script>
import moment from 'moment';

export default {
    name: 'ItemList',
    props: [
        'items'
    ],
    computed: {
        archivedCount()
        {
            return this.items.filter(item => item.archived === true).length;
        },
        filteredItems()
        {
            return this.$store.getters.itemView === 'default'
                ? this.items.filter(n => n.archived === false)
                : this.items.filter(n => n.archived === true);
        },
        sortedItems()
        {
            return this.filteredItems.sort((a, b) => {
                return moment(b.changed).unix() - moment(a.changed).unix();
            })
        }
    },
    methods: {
        moment,
        select(item)
        {
            this.$items.select(item);
        },
        selected(item)
        {
            return item.id === this.$store.getters.selectedItemID;
        },
        toggleItemView()
        {
            if (this.$store.getters.itemView === 'default')
            {
                this.$store.commit('SET_ITEM_VIEW', 'archived');
            }
            else
            {
                this.$store.commit('SET_ITEM_VIEW', 'default');
            }
    
            this.$items.selectBest();
        }
    }
}
</script>