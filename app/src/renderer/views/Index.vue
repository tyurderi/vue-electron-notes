<template>
    <div class="app column">
        <div class="head row blurrable">
            <div class="directory-column">
                <ul class="actions">
                    <li @click="createItem($store.getters.selectedDirectoryID)"
                        :class="{ disabled: !directorySelected }">
                        <i class="fa fa-pencil"></i>
                    </li>
                    <li @click="deleteItem($store.getters.selectedItemID)"
                        :class="{ disabled: !itemSelected }">
                        <i class="fa fa-trash"></i>
                    </li>
                </ul>
            </div>
            <div class="items-column">
                <ul class="actions">
                    <li :class="{ disabled: !(item && !item.encrypted || item && item.decrypted) }" @click="encryptItem">
                        <i class="fa fa-lock"></i>
                    </li>
                    <li :class="{ disabled: !(item && item.encrypted && item.decrypted) }" @click="decryptItem">
                        <i class="fa fa-unlock"></i>
                    </li>
                    <li :class="{ disabled: !itemSelected }" @click="duplicateItem">
                        <i class="fa fa-files-o"></i>
                    </li>
                    <li :class="{ disabled: !itemSelected }" @click="archiveItem" v-if="$store.getters.itemView === 'default'">
                        <i class="fa fa-caret-square-o-down"></i>
                    </li>
                    <li :class="{ disabled: !itemSelected }" @click="unarchiveItem" v-else>
                        <i class="fa fa-caret-square-o-up"></i>
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
        <div class="body flex row blurrable">
             <div class="directory-column column">
                 <directory-tree :id="null" :key="null" class="flex"></directory-tree>

                 <button class="create center" @click="createDirectory">
                     <i class="fa fa-plus"></i>
                 </button>
            </div>
            <item-list :items="items"></item-list>
            <div class="content-container column flex">
                <editor v-if="this.$store.getters.selectedItemID"
                        :key="this.$store.getters.selectedItemID"></editor>
            </div>
            <!--<div class="search-overlay"></div>-->
        </div>
        
        <context-menu></context-menu>
        <modal ref="modal"></modal>
    </div>
</template>

<script>
import DirectoryTree from '@/modules/DirectoryTree';
import ItemList from '@/modules/ItemList';
import Editor from '@/modules/Editor';
import ContextMenu from '@/modules/ContextMenu';
import Modal from '@/modules/Modal';

// used for encryption stuff
import _ from 'lodash';
import ItemEncryption from '@/components/ItemEncryption';
import bcrypt from 'bcryptjs';

export default {
    name: 'index',
    data: () => ({
        contextMenu: null
    }),
    mounted()
    {
        this.$store.commit('LOAD');
        
        // Fix ids since they didn't fit well in the last version :/
        this.$store.commit('FIX_IDS');
        this.$store.commit('SAVE');
    
        console.log(this.$refs.modal);
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
        },
        item()
        {
            return this.$store.getters.items.find(n => n.id === this.itemSelected);
        }
    },
    methods: {
        createDirectory()
        {
            let directory = this.$directories.create();
    
            this.$nextTick(() => {
                this.$directories.focusInput(directory);
            });
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
        encryptItem()
        {
            let item = this.$store.getters.items.find(item => item.id === this.$store.getters.selectedItemID);
    
            if (!item) return;
            
            if (item.encrypted === true && item.decrypted === true)
            {
                item.decrypted         = false;
                item.decryptedPassword = '';
                item.text              = '';
            }
            else if(item.encrypted === false)
            {
                modal.show({
                    title: 'Enter password to encrypt the note',
                    width: '350px',
                    fields: [{ name: 'password', type: 'password', placeholder: 'Password', focus: true }],
                    buttons: [{
                        type: 'submit',
                        label: 'Encrypt',
                        handler: ({ password }) => {
                            if (password)
                            {
                                item.encrypted = true;
                                item.decrypted = true;
                                item.encryptedPassword = bcrypt.hashSync(password, 8);
                                item.decryptedPassword = password;
                                item.encryptedText     = ItemEncryption.encrypt(item.text, password);
                    
                                modal.close();
                            }
                        }
                    }]
                });
            }
        },
        decryptItem()
        {
            let item = this.$store.getters.items.find(item => item.id === this.$store.getters.selectedItemID);
            
            if (item && item.encrypted === true && item.decrypted === true)
            {
                item.encrypted = false;
                item.decrypted = false;
                item.encryptedPassword = '';
                item.decryptedPassword = '';
                item.encryptedText     = '';
            }
        },
        archiveItem()
        {
            let itemID = this.$store.getters.selectedItemID,
                item   = this.$store.getters.items.find(n => n.id === itemID);
            
            if (item)
            {
                item.archived = true;
                this.$nextTick(() => this.$items.selectBest());
            }
        },
        unarchiveItem()
        {
            let itemID = this.$store.getters.selectedItemID,
                item   = this.$store.getters.items.find(n => n.id === itemID);
    
            if (item)
            {
                item.archived = false;
                this.$nextTick(() => this.$items.selectBest());
            }
        },
        duplicateItem()
        {
        
        }
    },
    components: {
        DirectoryTree,
        ItemList,
        Editor,
        ContextMenu,
        Modal
    }
}
</script>