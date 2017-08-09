<template>
    <div class="items-column">
        <div class="item" v-for="(item, key) in items" :key="key"
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
            <!--<ul class="item-icons">
                <li v-if="item.encrypted && !item.decrypted"><i class="fa fa-lock"></i></li>
                <li v-if="item.encrypted && item.decrypted"><i class="fa fa-unlock"></i></li>
            </ul>-->
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
            this.$items.select(item);
        },
        selected(item)
        {
            return item.id === this.$store.getters.selectedItemID;
        }
    }
}
</script>