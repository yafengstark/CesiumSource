/**
 * Created by fengfeng043 on 2019/6/24.
 */
require.config({
    baseUrl : '../../../'
    // waitSeconds : 60
});
require(['Source/Cesium',
         'Apps/Utils/view-util'], function(Cesium, ViewUtil) {
    'use strict';
//Sandcastle_Begin
    var worldTerrain = Cesium.createWorldTerrain({
        requestWaterMask : true,
        requestVertexNormals : true
    });

    var viewer = new Cesium.Viewer('cesiumContainer', {
        terrainProvider : worldTerrain
    });
    var scene = viewer.scene;
    //
    fastLocation();
    mousePick();
    //
    readCzml();
    //
    /**
     * 快速定位
     */
    function fastLocation() {
        var viewModel = {
            lat : 30,
            lon : 120,
            ele : 150000,
            fly : function() {
                var latFloat = parseFloat(viewModel.lat);
                var lonFloat = parseFloat(viewModel.lon);
                var eleFloat = parseFloat(viewModel.ele);

                ViewUtil.fly(latFloat, lonFloat, eleFloat, viewer);
            }
        };
// Convert the viewModel members into knockout observables.
        Cesium.knockout.track(viewModel);
// Bind the viewModel to the DOM elements of the UI that call for it.
        var view = document.getElementById('fast-location');
        Cesium.knockout.applyBindings(viewModel, view);
    }

    /**
     * 鼠标选点
     */
    function mousePick() {
        var handler;
        var entity = viewer.entities.add({
            label : {
                show : false,
                showBackground : true,
                font : '14px monospace',
                horizontalOrigin : Cesium.HorizontalOrigin.LEFT,
                verticalOrigin : Cesium.VerticalOrigin.TOP,
                pixelOffset : new Cesium.Cartesian2(15, 0)
            }
        });
        var viewModel = {
            lat : 30,
            lon : 120,
            ele : 150000,
            height : 15000000,
            start : function() {
                console.log();
                handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
                var ellipsoid = viewer.scene.globe.ellipsoid;   //得到当前三维场景的椭球体
                handler.setInputAction(function(movement) {
                    var cartesian = viewer.camera.pickEllipsoid(movement.endPosition,
                        ellipsoid);// 直角坐标系坐标
                    if (cartesian) {
                        //将笛卡尔坐标转换为地理坐标
                        // Cartographic 地图的
                        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);// 得到弧度
                        var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(5);
                        var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(5);
                        // 相机高度
                        var height = Math.ceil(viewer.camera.positionCartographic.height);
                        //
                        // 获取某位置的高程
                        //根据经纬度计算出地形高度。

                        var cartographic2 = Cesium.Cartographic.fromDegrees(Cesium.Math.toDegrees(cartographic.longitude),
                            Cesium.Math.toDegrees(cartographic.latitude));// 地图坐标
                        // var terHigh =  viewer.scene.globe.getHeight(cartographic2); // 不管用
                        // var terHigh = cartographic.height;
                        /**
                         * [cartographic2] 位置数组
                         */
                        var promise = Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [cartographic2]);
                        Cesium.when(promise, function(updatedPositions) {
                            if (updatedPositions.length > 0) {
                                var position = updatedPositions[0];

                                var terHigh = (position.height ? position.height.toFixed(1) : 0);

                                viewModel.lat = latitudeString;
                                viewModel.lon = longitudeString;
                                viewModel.height = height;
                                viewModel.ele = terHigh; // 高程
                                // console.log(
                                //     'lng:' + Cesium.Math.toDegrees(position.longitude)+
                                //     ',lat:' + Cesium.Math.toDegrees(position.latitude) +
                                //     ',height:' + );
                            } else {
                                console.log('无法获取高程');
                            }
                        });
                        entity.position = cartesian;
                        entity.label.show = true;
                        entity.label.text =
                            '经度: ' + ('   ' + longitudeString) + '\u00B0' +
                            '\n纬度: ' + ('   ' + latitudeString) + '\u00B0' +
                            // '\n高程: ' + ('   ' +terHigh ) + '米'+
                            '\n视角高度: ' + ('   ' + height) + '米';
                    } else {
                        //
                        entity.label.show = false;
                    }
                }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
            },
            stop : function() {
                console.log();
                handler = handler && handler.destroy();
                entity.label.show = false;
            }
        };
        // 快捷键开始取消
        function hotkey() {
            var a = window.event.keyCode;
            if ((a === 83) && (event.shiftKey)) { // s
                viewModel.start();
            } else if ((a === 72 ) && (event.shiftKey)) { // h
                viewModel.stop();
            }
        }// end hotkey
        document.onkeydown = hotkey; //当onkeydown 事件发生时调用hotkey函数
// Convert the viewModel members into knockout observables.
        Cesium.knockout.track(viewModel);
// Bind the viewModel to the DOM elements of the UI that call for it.
        var view = document.getElementById('mouse-pick');
        Cesium.knockout.applyBindings(viewModel, view);
    }

    /**
     * czml可视化
     */
    function readCzml() {
        var viewModel = {
            lat : 30,
            lon : 120,
            ele : 150000,
            upload : function(file) {
                // 支持chrome IE10
                if (window.FileReader) {
                    // var file = input.files[0];
                    var filename = file.name.split(".")[0];
                    console.log("选择的文件名是"+ filename);
                    var reader = new FileReader();
                    reader.onload = function() {
                        console.log(this.result);
                        var testJson = eval("(" + this.result + ")");
                        viewer.dataSources.add(Cesium.CzmlDataSource.load(testJson));
                    };
                    reader.readAsText(file);
                }
                else {
                    alert('error');
                }
            }
        };
// Convert the viewModel members into knockout observables.
        Cesium.knockout.track(viewModel);
// Bind the viewModel to the DOM elements of the UI that call for it.
        var view = document.getElementById('visual-czml');
        Cesium.knockout.applyBindings(viewModel, view);
    }
});
