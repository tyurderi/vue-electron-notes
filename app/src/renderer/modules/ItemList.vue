<template>
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
</template>

<script>
import moment from 'moment';

export default {
    name: 'ItemList',
    props: [
        'items'
    ],
    methods: {
        formatDate(date)
        {
            return moment(date).format('MMMM Do YYYY, h:mm:ss a');
        }
    }
}
</script>