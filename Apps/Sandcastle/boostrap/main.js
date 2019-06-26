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
    //
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

});
