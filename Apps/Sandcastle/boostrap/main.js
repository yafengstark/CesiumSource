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
    var viewer = new Cesium.Viewer('cesiumContainer', {
        infoBox : false,
        selectionIndicator : false,
        shadows : true,
        shouldAnimate : true
    });
    var scene = viewer.scene;
    //
    fastLocation();
    mousePick();
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
        var fastLocationView = document.getElementById('fast-location');
        Cesium.knockout.applyBindings(viewModel, fastLocationView);
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
            start : function() {
                console.log();
                handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
                handler.setInputAction(function(movement) {
                    var cartesian = viewer.camera.pickEllipsoid(movement.endPosition, scene.globe.ellipsoid);
                    if (cartesian) {
                        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                        var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(5);
                        var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(5);

                        viewModel.lat = latitudeString;
                        viewModel.lon = longitudeString;
                        //TODO: ele
                        entity.position = cartesian;
                        entity.label.show = true;
                        entity.label.text =
                            '经度: ' + ('   ' + longitudeString) + '\u00B0' +
                            '\n纬度: ' + ('   ' + latitudeString) + '\u00B0';
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
            }else if((a === 72 ) && (event.shiftKey)) { // h
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
});
