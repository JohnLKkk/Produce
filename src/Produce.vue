<template>
  <div id="Produce" style="height: 100%;">
    <router-view/>
  </div>
</template>

<script>
import CommandManager from './editor/command/CommandManager'

export default {
  name: 'Produce',
  mounted () {
    window.addEventListener('keyup', this.keyupHandler);
    // window.addEventListener('keydown', this.keyupHandler);
  },
  destroyed () {
    window.removeEventListener('keyup', this.keyupHandler);
    // window.removeEventListener('keydown', this.keyupHandler);
  },
  methods: {
    keyupHandler :function(event) {
      if (event.ctrlKey && event.code === 'KeyZ') {
        this.undoHandler();
        event.preventDefault();
      }
      else if (event.ctrlKey && event.code === 'KeyY') {
        this.redoHandler();
        event.preventDefault();
      }
    },
    undoHandler :function() {
      // console.log('undo');
      CommandManager.getInstance().undoLastCommand();
    },
    redoHandler :function() {
      // console.log('redo');
      CommandManager.getInstance().redoLastCommand();
    }
  },
}
</script>

<style>
#Produce {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  margin-top: 60px;
}
</style>
