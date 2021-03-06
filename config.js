'use strict'

const path = require('path')

let config = {
    name: 'notes',
    port: 9090,
    building: {
        arch: 'x64',
        asar: true,
        dir: path.join(__dirname, 'app'),
        icon: path.join(__dirname, 'app/icons/icon.png'),
        ignore: /^\/(src|index\.ejs|icons)/,
        out: path.join(__dirname, 'builds'),
        overwrite: true,
        platform: process.env.PLATFORM_TARGET || 'all'
    }
}

config.building.name = config.name

module.exports = config
