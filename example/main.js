import {Loop} from '../lib'

const target = document.getElementById('target')
const loop = new Loop(target)

loop.on('activity', () => {
  console.log('activity')
  target.classList.add('active')
})
loop.on('inactivity', () => {
  console.log('inactivity')
  target.classList.remove('active')
})
