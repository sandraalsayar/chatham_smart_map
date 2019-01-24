<template>
    <div id='console'>
        <div style='height: 48px;'> </div>
        <LayerSelectionIndex></LayerSelectionIndex>
        <div style='height: 6px;'> </div>
        <MapLegend></MapLegend>
	</div>
</template>

<script>

import LayerSelectionIndex from './LayerSelectionIndex.vue';
import MapLegend from './MapLegend.vue';

export default {
	name: 'Console',
	components: {
        LayerSelectionIndex,
        MapLegend
    }
}

</script>

<style scoped>

    #console {
      position: absolute;
      width: 270px;
      margin: 10px;
      padding: 8px 8px;
      background-color: rgb(225,225,225);
      box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
      border-radius: 3px;
      z-index: 0;
    }

    .card {
      background-color: white;
      box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
      transition: 0.3s;
      border-radius: 3px;
      padding: 5px;
    }

    .card:hover {
      box-shadow: 0 10px 18px 0 rgba(0,0,0,0.2);
    }

    .card_heading {
      margin: 5px;
      margin-left: 0.7em;
    }

    #layers_list {
      list-style: none;
      padding-left: 5px;
    }

    #layers_list > li {
      padding-bottom: 8px;
      cursor: pointer;
    }

    #layers_list > li > * {
      display: inline-block;
      vertical-align: text-top;
    }

    .no_margin_heading {
      margin: 0.1em;
    }

    .colors {
      height: 12px;
    }

    .legend_row {
      margin: 5px;
    }

    .legend_text {
      overflow: hidden;
    }

    [data-layer^="layer_alt"] {
      display: none;
    }

    [data-layer="layer_alt_1"] > .colors {
      background: linear-gradient(to right, turquoise, deepskyblue , dodgerblue, navy);
    }

    [data-layer="layer_alt_2"] > .colors {
      background: linear-gradient(to right, coral, tomato, red, darkred);
    }

    .label {
      display: inline-block;
      text-align: center;
      font-size: 14px;
    }

    #sensor {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #007cbf;
      opacity: 0.8;
    }

    #low_risk_label {
      float: left;
    }

    #high_risk_label{
      float: right;
    }

    .third {
      width: 32%;
    }

    .mapboxgl-ctrl-top-left .mapboxgl-ctrl {
      margin: 20px 0 0 18px;
      width: 270px;
    }
</style>