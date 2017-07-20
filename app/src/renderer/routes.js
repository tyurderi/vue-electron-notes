export default [
    {
        path: '*',
        redirect: '/'
    },
    {
        path: '/',
        name: 'index',
        component: require('views/Index')
    },
]
