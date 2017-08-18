<template>
    <transition name="modal">
        <div class="modal-wrapper" v-if="visible">
            <div class="modal"
                 :style="{ width: config.width || 'auto', height: config.height || 'auto' }">
                <div class="head" v-if="!config.customHeader">
                    <div class="head-title" v-if="config.title">{{ config.title }}</div>
                    <div class="close-button" v-if="config.closeButton" @click="close">
                        <i class="fa fa-times"></i>
                    </div>
                </div>
                <div class="body">
                    <div class="fields" v-if="config.fields">
                        <template v-for="field in config.fields">
                            <input v-if="field.type === 'text'" type="text" :name="field.name"
                                   :placeholder="field.placeholder" v-model="field.value"
                                   :autofocus="field.focus||false"
                                   @keydown.enter.prevent="dispatchSubmit"
                                   @keydown.esc.prevent="dispatchClose" />
                            
                            <input v-if="field.type === 'password'" type="password" :name="field.name"
                                   :placeholder="field.placeholder" v-model="field.value"
                                   :autofocus="field.focus||false"
                                   @keydown.enter.prevent="dispatchSubmit"
                                   @keydown.esc.prevent="dispatchClose" />
                            
                            <input v-if="field.type === 'email'" type="email" :name="field.name"
                                   :placeholder="field.placeholder" v-model="field.value"
                                   :autofocus="field.focus||false"
                                   @keydown.enter.prevent="dispatchSubmit"
                                   @keydown.esc.prevent="dispatchClose" />
                        </template>
                    </div>
                    <div class="buttons" v-if="config.buttons">
                        <button v-for="button in config.buttons" @click="dispatchClick(button)">
                            {{ button.label }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import _ from 'lodash';
export default {
    name: 'modal',
    data: () => ({
        $this: null,
        visible: false,
        defaultConfig: {
            title: '',
            customHeader: false,
            closeButton: true,
            width: 'auto',
            height: 'auto',
            buttons: [],
            fields: [],
            submitOnEnter: true,
            closeOnEsc: true
        },
        config: {}
    }),
    mounted()
    {
        this.$this   = this;
        global.modal = this;
    },
    methods: {
        show(config)
        {
            this.visible = true;
            this.config  = _.assign(this.defaultConfig, config);
            
            this.blur(true);
        },
        close()
        {
            this.visible = false;
            this.config  = null;
            
            this.blur(false);
        },
        blur(state)
        {
            let elements = document.querySelectorAll('.blurrable');
            
            elements.forEach((element) => {
                state === true
                    ? element.classList.add('blurred')
                    : element.classList.remove('blurred');
            });
        },
        dispatchClick(button)
        {
            if (typeof button.handler === 'function')
            {
                let values = {};
                
                this.config.fields.forEach((field) => {
                    values[field.name] = field.value;
                });
                
                button.handler(values);
            }
        },
        dispatchSubmit()
        {
            let button = this.config.buttons.find(n => n.type === 'submit');
            
            if (this.config.submitOnEnter && button)
            {
                this.dispatchClick(button);
            }
        },
        dispatchClose()
        {
            if (this.config.closeOnEsc)
            {
                this.close();
            }
        }
    }
}
</script>