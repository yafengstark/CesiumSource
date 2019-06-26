/**
 * Created by fengfeng043 on 2019/6/24.
 */
require.config({
    baseUrl : '../../../Source'
    // waitSeconds : 60
});
require(['Cesium'], function(Cesium) {
    'use strict';
//Sandcastle_Begin
    // TODO: 左右分割，可以拖拽
    var viewer = new Cesium.Viewer('cesiumContainer', {
        infoBox : false,
        selectionIndicator : false,
        shadows : true,
        shouldAnimate : true
    });
});
