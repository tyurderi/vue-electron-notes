<template>
    <div class="editor column flex">
        <input type="text" v-model="item.title" ref="editorTitle"
               @keydown.enter.prevent="$refs.editorText.focus()">
        
        <textarea class="flex" v-model="item.text" ref="editorText"></textarea>
    </div>
</template>

<script>
export default {
    name: 'editor',
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
    computed: {
        item()
        {
            return this.$store.getters.items.find(item => {
                return item.id === this.$store.getters.selectedItemID;
            });
        }
    }
}
</script>