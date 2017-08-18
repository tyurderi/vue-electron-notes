<template>
    <div class="editor-column flex column">
        <div class="column flex center password-form" v-if="item.encrypted && !item.decrypted">
            <span class="header">
                This note is encrypted.
            </span>
            <span class="input">
                <input type="password" name="password" v-model="decryptedPassword" placeholder="Enter password"
                       @keydown.enter.prevent="decrypt"/>
                <button @click.prevent="decrypt">
                    Decrypt
                </button>
            </span>
            <span class="invalid-password" v-if="invalidPassword">
                The password you entered is wrong.
            </span>
        </div>
        <div class="column flex" v-else>
            <input type="text" v-model="item.title" ref="editorTitle" class="item-name"
                   @keydown.enter.prevent="$refs.editorText.focus()">

            <textarea class="item-text flex" v-model="item.text" ref="editorText"></textarea>
        </div>
    </div>
</template>

<script>
import ItemEncryption from '@/components/ItemEncryption';
import _ from 'lodash';
import bcrypt from 'bcryptjs';

export default {
    name: 'editor',
    data: () => ({
        saveLock: false,
        decryptedPassword: '',
        invalidPassword: false
    }),
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
            if (!this.decryptedPassword || !bcrypt.compareSync(this.decryptedPassword, this.item.encryptedPassword))
            {
                this.invalidPassword = true;
                return;
            }
    
            this.saveLock        = true;
            this.invalidPassword = false;
            
            this.item.decrypted = true;
            this.item.text      = ItemEncryption.decrypt(this.item.encryptedText, this.decryptedPassword);
            this.item.decryptedPassword = this.decryptedPassword;
            this.decryptedPassword = '';
        }
    }
}
</script>