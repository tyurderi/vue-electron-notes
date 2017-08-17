<template>
    <div class="editor-column flex column">
        <!--<div v-if="item.encrypted && !item.decrypted">
            <span class="header">
                This note is encrypted. Do you want to <a @click="decrypt" href="#">decrypt</a>?
            </span>
        </div>-->
        <div class="column flex">
            <input type="text" v-model="item.title" ref="editorTitle" class="item-name"
                   @keydown.enter.prevent="$refs.editorText.focus()">

            <textarea class="item-text flex" v-model="item.text" ref="editorText"></textarea>
        </div>
    </div>
</template>

<script>
/*import ItemEncryption from '@/components/ItemEncryption';
import vex from 'vex-js';
import _ from 'lodash';
import bcrypt from 'bcryptjs';*/

export default {
    name: 'editor',
    mounted()
    {
        if (this.item.isNew && (this.item.encrypted === false || this.item.decrypted === true))
        {
            this.$refs.editorTitle.select();
            this.$refs.editorTitle.focus();
            
            this.item.isNew = false;
        }
    },
    watch: {
        item: {
            deep: true,
            handler(item)
            {
                if (this.saveLock === true)
                {
                    this.saveLock = false;
                    return;
                }
                
                clearTimeout(this.itemSaveTimeout);
                
                this.itemSaveTimeout = setTimeout(() => {
                    this.saveLock = true;
                    this.item.changed = new Date();
                    
                    this.$items.save();
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
    },
    methods: {
        decrypt()
        {
            /*vex.dialog.open({
                message: 'Enter password to decrypt note',
                input: '<input name="password" type="password" placeholder="Password" required />',
                buttons: [
                    _.assign(vex.dialog.buttons.YES, { text: 'Decrypt' }),
                    _.assign(vex.dialog.buttons.NO, { text: 'Cancel' })
                ],
                callback: (data) =>
                {
                    if (!data || !data.password)
                    {
                        return;
                    }

                    if (!bcrypt.compareSync(data.password, this.item.encryptedPassword))
                    {
                        console.log('wrong password!');
                        return;
                    }

                    this.item.decrypted = true;
                    this.item.text      = ItemEncryption.decrypt(this.item.encryptedText, data.password);
                    this.item.decryptedPassword = data.password;
                }
            });*/
        }
    }
}
</script>