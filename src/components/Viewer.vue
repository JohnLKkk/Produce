<template>
  <div id="div_viewer" class="window">
    <canvas id="canvas_viewer" style="padding: 0px;margin: 0px;position:absolute;left: 0px;top: 0px;background-color: aliceblue" tabindex="0"></canvas>
  </div>
</template>

<script>
  import Try3d from "try3d/src/Try3d";
  import {EditorContext} from '../editor/EditorContext'

  export default {
    name: 'Viewer',
    data(){
      return {
        renderer:{
          _scene:null,
          _engine:null,
        }
      }
    },
    methods:{
      init(){
        // 创建场景对象(渲染器至少包含一个scene,否则,将什么事情都不做)
        let canvas = document.getElementById('canvas_viewer');
        let scene = new Try3d.Scene({cavnas:document.getElementById('canvas_viewer')});
        scene.getRender().setGammaFactor(1.0);
        scene.getCanvas().setClearColor(0.3, 0.3, 0.3, 1.0);

        // 定义一个根节点
        let rootNode = new Try3d.Node(scene, {id:'rootNode'});
        scene.addSceneNode(rootNode);

        // 基本部件
        // 轴网
        let colorDef = Try3d.MaterialDef.parse(Try3d.Internal.S_COLOR_DEF_DATA);
        let grid = new Try3d.Grid(scene, {id:'grid', width:500, height:500, widthSegments:250, heightSegments:250});
        let defaultColor = new Try3d.Material(scene, {id:"defaultColor", materialDef:colorDef});
        defaultColor.setParam('color', new Try3d.Vec4Vars().valueFromXYZW(1.0, 1.0, 1.0, 1.0));
        grid.setMaterial(defaultColor);
        rootNode.addChildren(grid);

        // 创建一个box
        let box1Mat = new Try3d.Material(scene, {id:'box1Mat', materialDef:colorDef});
        let box = new Try3d.Box(scene, {id:'box_' + 0 + '_' + 0, xHalf:0.2, yHalf:0.2, zHalf:0.2});
        box1Mat.setParam('color', new Try3d.Vec4Vars().valueFromXYZW(0.0, 0, 1.0, 1.0));
        box.setMaterial(box1Mat);
        let list = new Try3d.Node(scene, {id:'default-list'});
        list.addChildren(box);
        rootNode.addChildren(list);

        // 创建一个控制器
        let sceneControl = new Try3d.SceneBrowsingController(scene, {id:'control'});
        sceneControl.lookScene(list);
        sceneControl.setMaxDistance(100);
        sceneControl.setMinDistance(1);
        sceneControl.setZoomSpeed(10);
        sceneControl.setMinVerticalRotation(0.1);

        // 创建渲染器
        let renderEngine = new Try3d.RenderEngine();
        // 添加要渲染的场景对象
        renderEngine.addScene(scene);
        // 启动渲染器
        renderEngine.launch();

        this.renderer._scene = scene;
        this.renderer._engine = renderEngine;

        // 控制canvas大小
        let viewerResize = require("element-resize-detector");
        let maker = viewerResize();
        let dpr = window.devicePixelRatio;
        maker.listenTo(document.getElementById("div_viewer"), (element)=>{
          scene.getCanvas().resize(element.clientWidth, element.clientHeight);
        });

        // 全局上下文
        EditorContext.getInstance().setRenderer(this.renderer);
        EditorContext.getInstance().notifyEvent(EditorContext.S_EVENT_SCENE_LOAD_END);
      }
    },
    mounted() {
      this.init();
    }
  }
</script>

<style scoped>
  .window{
    width: 100%;
    height: 100%;
    margin-right: 1px;
    margin-bottom: 1px;
    border-radius: 0 0 10px 10px;
    background: rgba(66, 66, 66, 0.53);
  }
  .canvas{
    border-radius: 0 0 10px 10px;
  }
</style>
