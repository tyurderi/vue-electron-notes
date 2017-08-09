<template>
    <div class="app column">
        <div class="head row">
            <div class="directory-column">
                <ul class="actions">
                    <li @click="createDirectory($store.getters.selectedDirectoryID)">
                        <i class="fa fa-pencil"></i>
                    </li>
                    <li @click="deleteDirectory($store.getters.selectedDirectoryID)">
                        <i class="fa fa-trash"></i>
                    </li>
                </ul>
            </div>
            <div class="items-column">
                <ul class="actions">
                    <!--<li @click="createItem($store.getters.selectedDirectoryID)">
                        <i class="fa fa-plus"></i>
                    </li>
                    <li @click="deleteItem($store.getters.selectedItemID)">
                        <i class="fa fa-trash"></i>
                    </li>-->
                    <li :class="{ disabled: !itemSelected }">
                        <i class="fa fa-lock"></i>
                    </li>
                    <li :class="{ disabled: !itemSelected }">
                        <i class="fa fa-unlock"></i>
                    </li>
                    <li :class="{ disabled: !itemSelected }">
                        <i class="fa fa-files-o"></i>
                    </li>
                </ul>
            </div>
            <div class="editor-column flex">
                <div class="search-input">
                    <input type="text" placeholder="Search for directories or notes..." />
                </div>
                <!--<div class="search-results">
                    <span class="no-results">Nothing found</span>
                </div>-->
            </div>
            <div class="title-column">
              notes
            </div>
        </div>
        <div class="body flex row">
             <div class="directory-column column">
                 <directory-tree :id="null" :key="null" class="flex"></directory-tree>

                 <button class="create center" @click="createDirectory(null)">
                     <i class="fa fa-plus"></i>
                 </button>
            </div>
            <item-list :items="items"></item-list>
            <div class="content-container column">
                <editor v-if="this.$store.getters.selectedItemID"
                        :key="this.$store.getters.selectedItemID"></editor>
            </div>
            <!--<div class="search-overlay"></div>-->
        </div>
        
        <div class="context-menu">
            <ul>
                <li>
                    <i class="fa fa-plus"></i>
                    <span>Add</span>
                </li>
                <li>
                    <i class="fa fa-trash"></i>
                    <span>Remove</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import DirectoryTree from '@/modules/DirectoryTree';
import ItemList from '@/modules/ItemList';
import Editor from '@/modules/Editor';

// used for encryption stuff
/*import _ from 'lodash';
import ItemEncryption from '@/components/ItemEncryption';
import vex from 'vex-js';
import bcrypt from 'bcryptjs';*/

export default {
    name: 'index',
    mounted()
    {
        this.$store.commit('LOAD');
        
        // Fix ids since they didn't fit well in the last version :/
        this.$store.commit('FIX_IDS');
        this.$store.commit('SAVE');
        
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            console.log('contextmenu, yo');
            console.log(e);
        }, false);
    },
    computed: {
        items()
        {
            return this.$store.getters.items.filter(item => {
                return item.directoryID === this.$store.getters.selectedDirectoryID;
            });
        },
        directorySelected()
        {
            return this.$store.getters.selectedDirectoryID;
        },
        itemSelected()
        {
            return this.$store.getters.selectedItemID;
        }
    },
    methods: {
        createDirectory(directoryID)
        {
            let directory = this.$directories.create(directoryID);
 
            this.$nextTick(() => {
                this.$directories.focusInput(directory);
            });
        },
        deleteDirectory(directoryID)
        {
            let directory = this.$store.getters.directories.find(d => d.id === directoryID);

            if (!directory || !confirm('Are you sure to delete this directory?'))
            {
                return;
            }
            
            this.$directories.remove(directory);
            this.$directories.clearSelect();
            this.$directories.save();
        },
        createItem(directoryID)
        {
            return this.$items.create(directoryID);
        },
        deleteItem(itemID)
        {
            let item = this.$store.getters.items.find(item => item.id === itemID);

            if (!item || !confirm('Are you sure to delete this item?'))
            {
                return;
            }
            
            this.$items.remove(item);
        },
        encryptItem(itemID)
        {
            /*let item = this.$store.getters.items.find(item => item.id === itemID);

            if (!item) return;
            
            if (item.encrypted === false)
            {
                vex.dialog.open({
                    message: 'Enter password to encrypt note',
                    input: '<input name="password" type="password" placeholder="Password" required />',
                    buttons: [
                        _.assign(vex.dialog.buttons.YES, { text: 'Encrypt' }),
                        _.assign(vex.dialog.buttons.NO, { text: 'Cancel' })
                    ],
                    callback: (data) =>
                    {
                        if (!data || !data.password)
                        {
                            return;
                        }

                        item.encrypted = true;
                        item.decrypted = true;
                        item.encryptedPassword = bcrypt.hashSync(data.password, 8);
                        item.decryptedPassword = data.password;
                        item.encryptedText     = ItemEncryption.encrypt(item.text, data.password);
                    }
                });
            }
            else if(item.encrypted === true && item.decrypted === true)
            {
                item.decrypted = false;
                item.decryptedPassword = '';
            }*/
        }
    },
    components: {
        DirectoryTree,
        ItemList,
        Editor
    }
}
</script>