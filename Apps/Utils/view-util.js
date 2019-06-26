/**
 * Created by fengfeng043 on 2019/6/26.
 */
define(['Source/Cesium'], function (Cesium){
    'use strict';
    /**
     * 跳转到某个位置
     * @param lat
     * @param lon
     * @param viewer 视角
     * @returns {*}
     */
    var fly = function (lat,lon, ele, viewer ){

        viewer.camera.flyTo({
            destination : Cesium.Cartesian3.fromDegrees(lon, lat, ele)
        });

    };

    return {
        fly: fly
    };

});
