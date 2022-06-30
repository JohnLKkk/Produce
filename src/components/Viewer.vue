<template>
  <div class="window">
    <div class="topdeftoolbg2"></div>
    <div id="div_viewer" style="height: calc(100% - 30px)">
      <canvas id="canvas_viewer" style="padding: 0px;margin: 0px;position:absolute;left: 0px;top: 0px;background-color: aliceblue" tabindex="0"></canvas>
    </div>
  </div>
</template>

<script>
  import Try3d from "try3d/src/Try3d";
  import {EditorContext} from '../editor/EditorContext'
  import Material from '../editor/common/Material'
  import ShapeFactory from '../editor/common/ShapeFactory'
  import LightFactory from '../editor/common/LightFactory'
  import Viewer from '../editor/viewer/Viewer'
  import LeadingPrinciples from '../editor/leadingPrinciples/LeadingPrinciples'
  import ObjControl from '../editor/utils/ObjControl'

  export default {
    name: 'Viewer',
    data(){
      return {
        viewerEditor:null,
        renderer:{
          _scene:null,
          _engine:null,
        }
      }
    },
    methods:{
      init(){
        this.viewerEditor = new Viewer();
        // 创建场景对象(渲染器至少包含一个scene,否则,将什么事情都不做)
        let canvas = document.getElementById('canvas_viewer');
        let scene = new Try3d.Scene({cavnas:document.getElementById('canvas_viewer')});
        scene.getRender().setGammaFactor(1.0);
        scene.getCanvas().setClearColor(0.18, 0.18, 0.18, 0.53);
        this.setupPick(scene);

        // 定义一个根节点
        let rootNode = new Try3d.Node(scene, {id:EditorContext.S_ROOT_NODE});
        let worldRootNode = new Try3d.Node(scene, {id:EditorContext.S_WORLD_ROOT_NODE});
        worldRootNode.addChildren(rootNode);
        scene.addSceneNode(worldRootNode);

        // helper部件
        let helperNode = new Try3d.Node(scene, {id:EditorContext.S_HELPER_NODE});
        // 轴网
        let colorDef = Try3d.MaterialDef.parse(Try3d.Internal.S_COLOR_DEF_DATA);
        let grid = new Try3d.Grid(scene, {id:EditorContext.S_HELPER_GRID, width:1000, height:1000, widthSegments:250, heightSegments:250});
        let defaultColor = new Try3d.Material(scene, {id:"defaultColor", materialDef:colorDef});
        defaultColor.setParam('color', new Try3d.Vec4Vars().valueFromXYZW(1.0, 1.0, 1.0, 1.0));
        grid.setMaterial(defaultColor);
        grid.castShadow(false);
        grid.receiveShadow(false);
        helperNode.addChildren(grid);
        worldRootNode.addChildren(helperNode);


        // 创建一个box
        let box1Mat = Material.getBasicLightingMatIns(scene, true);
        let box = new Try3d.Box(scene, {id:'box_' + 0 + '_' + 0, xHalf:0.2, yHalf:0.2, zHalf:0.2});
        box1Mat.setParam('ambientColor', new Try3d.Vec4Vars().valueFromXYZW(0.25, 0.25, 0.25, 1.0));
        box1Mat.setParam('diffuseColor', new Try3d.Vec4Vars().valueFromXYZW(1, 1, 1, 1.0));
        box1Mat.setParam('specularColor', new Try3d.Vec4Vars().valueFromXYZW(1.0, 1.0, 1.0, 1.0));
        box1Mat.setParam('shininess', new Try3d.FloatVars().valueOf(64.0));
        box.setMaterial(box1Mat);
        rootNode.addChildren(box);

        // 创建一个directionalLight
        rootNode.addChildren(LightFactory.createDirectionalLight({scene}));

        // 创建一个控制器
        let sceneControl = new Try3d.SceneBrowsingController(scene, {id:'control'});
        sceneControl.lookScene(helperNode);
        sceneControl.setTargetDistance(3);
        sceneControl.setMaxDistance(100);
        sceneControl.setMinDistance(1);
        sceneControl.setZoomSpeed(10);
        sceneControl.setTargetAngle(Try3d.MoreMath.toRadians(45));
        sceneControl.setMinVerticalRotation(0.1);
        sceneControl._m_CanRotate = false;

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
        // 一些创建初始化工作...
        EditorContext.getInstance().initEditor();
        EditorContext.getInstance().notifyEvent(EditorContext.S_EVENT_SCENE_LOAD_END);
      },
      setupPick(scene){
        let mainCamera = scene.getComponent('mainCamera');
        let PICKABLE = new Try3d.Pickable(scene, {id:EditorContext.S_PICKABLE});
        mainCamera.addFilter(PICKABLE, 0);
        let SELECTED = new Try3d.SelectedFilter(scene, {id:'SELECTED'});
        mainCamera.addFilter(SELECTED, 0);
        SELECTED.getMaterial().setParam('outlineColor', new Try3d.Vec4Vars().valueFromXYZW(0, 0, 1, 1));
        mainCamera.lookAt(new Try3d.Vector3(2.950315, 1.5485021, -0.06550171), new Try3d.Vector3(-3.8440266, -1.997144, 0.06595602), new Try3d.Vector3(-0.44864178, 0.8937116, 2.2803247E-4));


        let input = Try3d.Input.getInput(scene, {id:scene.getId()});
        EditorContext.getInstance().registerEvent(LeadingPrinciples.S_LEADINGPRINCIPLES_EVENT_SELECTED, (result)=>{
          SELECTED.clearOutlineDrawables();
          if(!(result instanceof Try3d.Light)){
            SELECTED.pushOutlineDrawable(result);
          }
        });
        PICKABLE.on(Try3d.Pickable.S_EVENT_PICK_LISTENER, (id, result)=>{
          if(ObjControl.S_GIZMO_MAP.indexOf(result.getName()) > -1)return;
          SELECTED.clearOutlineDrawables();
          SELECTED.pushOutlineDrawable(result);
          EditorContext.getInstance().notifyEvent(Viewer.S_VIEWER_EVENT_SELECTED, [result]);
        });
        input.on('mousedown', (buttonId)=>{
          if(buttonId == Try3d.Input.S_MOUSE_BUTTON2_DOWN){
            let uv = input.getMouseCoords();
            PICKABLE.pick(uv[0], uv[1]);
          }
          // 以便用于清空回调
          // EditorContext.getInstance().notifyEvent(Viewer.S_VIEWER_EVENT_SELECTED, [null]);
        });
      }
    },
    mounted() {
      this.init();
      // this.setupPick();
    }
  }
</script>

<style scoped>
  .window{
    width: 100%;
    height: 100%;
    margin-right: 1px;
    margin-bottom: 1px;
    border-radius: 10px;
    background: rgba(66, 66, 66, 0.53);
  }
  .canvas{
    border-radius: 0 0 10px 10px;
  }
</style>
