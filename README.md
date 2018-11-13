- TypeScript
- C++ аддоны
- Express
- Node.js
- Socket.io
- Grunt автоматизация сборки 

## Установка
Настройка окружение для node-gyp
####Unix

- python (v2.7 recommended, v3.x.x is not supported)
- make
- A proper C/C++ compiler toolchain, like GCC
####Windows
`npm install --global --production windows-build-tools`

Подбробнее https://github.com/nodejs/node-gyp

`npm i`

## Старт

`npm run grunt` - копилиция и сборка всего проекта

`npm run grunt-watch` - живая пересборка проекта (livereload)