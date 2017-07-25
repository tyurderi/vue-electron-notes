<template>
    <div class="items-container">
        <div class="item row" v-for="(item, key) in items" :key="key"
             :class="{ active: selected(item) }"
             @click="select(item)">
            <div class="col flex">
                <span class="item-title">
                    {{ item.title }}
                </span>
                <span class="item-date">
                    {{ moment(item.created).format('MMMM Do YYYY, h:mm:ss a') }}
                </span>
            </div>
            <ul class="item-icons">
                <li v-if="item.encrypted && !item.decrypted"><i class="fa fa-lock"></i></li>
                <li v-if="item.encrypted && item.decrypted"><i class="fa fa-unlock"></i></li>
            </ul>
        </div>
    </div>
</template>

<script>
import moment from 'moment';

export default {
    name: 'ItemList',
    props: [
        'items'
    ],
    methods: {
        moment,
        select(item)
        {
            this.$store.commit('SELECT_ITEM', item)
        },
        selected(item)
        {
            return item.id === this.$store.getters.selectedItemID;
        }
    }
}
</script>