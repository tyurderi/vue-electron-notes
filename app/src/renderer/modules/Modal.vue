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
                            <input v-if="field.type === 'text'" type="text" :name="field.name" :placeholder="field.placeholder" v-model="field.value" />
                            <input v-if="field.type === 'password'" type="password" :name="field.name" :placeholder="field.placeholder" v-model="field.value" />
                            <input v-if="field.type === 'email'" type="email" :name="field.name" :placeholder="field.placeholder" v-model="field.value" />
                            
                            
                        </template>
                    </div>
                    <div class="buttons" v-if="config.buttons">
                        <button v-for="button in config.buttons" @click="button.handler">
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
            fields: []
        },
        config: {}
    }),
    mounted()
    {
        this.$this = this;
        this.show({
            title: 'Enter password to encrypt the note',
            width: '400px',
            //height: '200px',
            fields: [
                {
                    name: 'password',
                    type: 'password',
                    placeholder: 'Password'
                }
            ],
            buttons: [
                {
                    label: 'Encrypt',
                    handler: (e, modal, w) => {
                        console.log(e);
                    }
                }
            ]
        });
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
        getValue(name)
        {
            let field = this.config.fields.find(n => n.name === name);
            
            return field ? field.value : null;
        }
    }
}
</script>