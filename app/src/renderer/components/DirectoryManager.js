export default class
{
    constructor($store)
    {
        this.$store = $store;
    }
    
    create(directoryID)
    {
        let parent    = this.all().find(d => d.id === directoryID),
            directory = {
                id: this.nextID(),
                parent: directoryID || null,
                name: 'New folder',
                editing: true,
                opened: false
            };
    
        this.add(directory);
    
        if (parent)
        {
            parent.opened = true;
        }
        
        this.save();
        
        return directory;
    }
    
    add(directory)
    {
        this.$store.commit('ADD_DIRECTORY', directory);
    }
    
    remove(directory)
    {
        let children = this.all().filter(c => c.parent === directory.id);
        
        if (children.length > 0)
        {
            children.forEach(c => this.remove(c));
        }
        
        this.$store.commit('REMOVE_DIRECTORY', directory);
    }
    
    all()
    {
        return this.$store.getters.directories;
    }
    
    nextID()
    {
        let id = this.$store.getters.nextID.directory + 1;
    
        this.$store.commit('SET_NEXT_ID', {
            type: 'directory',
            value: id
        });
    
        return id;
    }
    
    save()
    {
        this.$store.commit('SAVE');
    }
    
    select(directory)
    {
        this.$store.commit('SELECT_DIRECTORY', directory);
    }
    
    clearSelect()
    {
        this.select({ id: null })
    }
    
    focusInput(directory)
    {
        let input = document.querySelector('input[data-id="' + directory.id + '"]');
    
        if (input)
        {
            input.select();
            input.focus();
        }
    }
    
}