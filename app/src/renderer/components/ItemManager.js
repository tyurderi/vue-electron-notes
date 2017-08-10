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
            // data which will not be saved
            encrypted: false,
            decrypted: false,
            encryptedPassword: '',
            encryptedText: ''
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
        let directoryID = item.directoryID;
    
        this.$store.commit('REMOVE_ITEM', item);
    
        item = this.find(item => item.directoryID === directoryID);
    
        if (item)
        {
            this.select(item);
        }
        else
        {
            this.clearSelect();
        }
        
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