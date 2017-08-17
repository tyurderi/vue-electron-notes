export default class
{
    constructor($store)
    {
        this.$store = $store;
    }
    /**
     * Creates a new, empty item which is associated to the given directory id.
     *
     * @param directoryID
     */
    create(directoryID)
    {
        if (!directoryID)
        {
            return false;
        }
        
        let item = {
            id: this.nextID(),
            title: 'New item',
            text: '',
            created: new Date(),
            changed: new Date(),
            directoryID: directoryID,
            encrypted: false,
            decrypted: false,
            encryptedPassword: '',
            encryptedText: '',
            isNew: true,
            archived: false
        };
        
        this.add(item)
            .select(item)
            .save();
        
        return true;
    }
    
    /**
     * Add an item to the store.
     * @param item
     */
    add(item)
    {
        this.$store.commit('ADD_ITEM', item);
        
        return this;
    }
    
    /**
     * Remove an item from the store.
     * @param item
     */
    remove(item)
    {
        this.$store.commit('REMOVE_ITEM', item);
        
        this.selectBest();
        this.save();
    }
    
    find(isItem)
    {
        return this.all().find(isItem);
    }
    
    /**
     * Select an item to edit.
     * @param item
     */
    select(item)
    {
        this.$store.commit('SELECT_ITEM', item);
        
        return this;
    }
    
    /**
     * Clear item selection
     * @returns {*}
     */
    clearSelect()
    {
        return this.select({ id: null });
    }
    
    /**
     * Select the best matching item id of the current opened directory.
     */
    selectBest()
    {
        let moment      = require('moment'),
            archived    = this.$store.getters.itemView === 'archived',
            directoryID = this.$store.getters.selectedDirectoryID,
            item        = this.$store.getters.items
                .sort((a, b) => {
                    return moment(b.changed).unix() - moment(a.changed).unix();
                })
                .find(item => {
                    return item.directoryID === directoryID && item.archived === archived;
                });
    
        this.select(item || { id: null });
    }
    
    /**
     * Save all items.
     */
    save()
    {
        this.$store.commit('SAVE');
        
        return this;
    }
    
    /**
     * Returns the next id for an item.
     */
    nextID()
    {
        let id = this.$store.getters.nextID.item + 1;
    
        this.$store.commit('SET_NEXT_ID', {
            type: 'item',
            value: id
        });
    
        return id;
    }
    
    all()
    {
        return this.$store.getters.items;
    }
}