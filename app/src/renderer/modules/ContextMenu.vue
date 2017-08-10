<template>
    <div class="context-menu" v-if="open && items && items.length > 0"
         :style="{ left: pos.x + 'px', top: pos.y + 'px' }">
        <ul>
            <li v-for="item in items" @click="item.handler">
                <i class="fa" :class="'fa-' + item.icon"></i>
                <span>{{ item.label }}</span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'context-menu',
    computed: {
        open()
        {
            return this.$store.getters['contextMenu/open'];
        },
        pos()
        {
            return this.$store.getters['contextMenu/pos'];
        },
        items()
        {
            return this.$store.getters['contextMenu/items'];
        }
    }
}
</script>