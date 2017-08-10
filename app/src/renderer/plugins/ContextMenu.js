import Store from '@/store';

Store.registerModule('contextMenu', {
    namespaced: true,
    state: {
        open: false,
        pos: { x: 0, y: 0 },
        items: []
    },
    mutations: {
        OPEN(state, payload)
        {
            state.open  = true;
            state.pos   = payload.pos;
            state.items = payload.items;
        },
        CLOSE(state)
        {
            state.open  = false;
            state.items = [];
        }
    },
    getters: {
        open:  state => state.open,
        pos:   state => state.pos,
        items: state => state.items
    }
});

export default {
    install(Vue, options)
    {
        Vue.prototype.$contextMenu = {
            open(e, items)
            {
                Store.commit('contextMenu/OPEN', {
                    pos: { x: e.clientX, y: e.clientY },
                    items
                });
            },
            close()
            {
                Store.commit('contextMenu/CLOSE');
            },
            attach(items, isValid)
            {
                isValid = isValid || ((e) => { return true });
                
                document.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    
                    if (isValid(e))
                    {
                        Vue.prototype.$contextMenu.open(e, items);
                    }
                })
            },
            closeOnClick()
            {
                if (this.closeOnClickHandler)
                {
                    return;
                }
                
                document.addEventListener('click', (e) => {
                    this.close();
                });
                
                this.closeOnClickHandler = true;
            }
        };
        
        /*Vue.prototype.$contextMenu.attach([
            { icon: 'plus', label: 'Add', handler: function() { console.log('add') } },
            { icon: 'trash', label: 'Remove', handler: function() { console.log('remove') } }
        ]);*/
    
        Vue.prototype.$contextMenu.closeOnClick();
    }
}