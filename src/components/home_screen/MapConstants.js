export const States = {NONE: 'NONE', AL: "AL", FL: "FL", VA: "VA"};
export const StateNames = {NONE: 'None', AL: "Alabama", FL: "Florida", VA: "Virginia"};
export const Districts = {AL: "AL-District", FL: "FL-District", VA: "VA-District"};
export const Precincts = {AL: "AL-Precinct", FL: "FL-Precinct", VA: "VA-Precinct"};
export const HeatMaps = {AL: "AL-HeatMap", FL: "FL-HeatMap", VA: "VA-HeatMap"};

export const StateLayers = {AL: "AL-Layer", FL: "FL-Layer", VA: "VA-Layer"};
export const DistrictLineLayers = {AL: "AL-Line-Layer", FL: "FL-Line-Layer", VA: "VA-Line-Layer"};
export const DistrictLayers = {AL: "AL-District-Layer", FL: "FL-District-Layer", VA: "VA-District-Layer"};
export const PrecinctLayers = {AL: "AL-Precinct-Layer", FL: "FL-Precinct-Layer", VA: "VA-Precinct-Layer"};
export const HeatMapLayers = {AL: "AL-HeatMap-Layer", FL: "FL-HeatMap-Layer", VA: "VA-HeatMap-Layer"};

export const StateCenters = {AL: [-86.68075561523438, 32.57631501316452], FL: [-82.87845611572266, 28.40022856730028], VA: [-79.42291259765625, 38.00321033702472]};
export const CountryCenter = [-82.994041442871, 32.99325130583]

export const SelectedColor = 'rgba(255,255, 0, .4)';
export const DefaultColor = 'rgba(200, 100, 255, .2)';
export const OutlineStateColor = 'rgba(200, 100, 255, 1)';
export const OutlineDistrictColor = 'rgba(0, 0, 0, 1)';
export const OutlinePrecinctColor = 'rgba(200, 100, 255, 1)';
export const SelectedFeatureColor = 'rgba(50, 50, 210, 0.4)';
export const OutlineSelectedFeatureColor = 'rgba(50, 50, 210, 1)';

export const EthnicGroup = {NONE: "NONE",BLACK: "BLACK", ASIAN: "ASIAN", HISPANIC: "HISPANIC", PACIFIC_ISLANDER: "PACIFIC_ISLANDER", NATIVE_AMERICAN: "NATIVE_AMERICAN",};
export const VADemographic = `
<div style="text-align: center;">Precinct 2 Demographics</div>
<table style="font-size:10px; padding: 0px !important;">
<tr>
  <th>Race</th>
  <th>Population</th>
</tr>
<tr>
  <td>White</td>
  <td>12401</td>
</tr>
<tr>
  <td>Black</td>
  <td>5835</td>
</tr>
<tr>
  <td>Hispanic</td>
  <td>2551</td>
</tr>
<tr>
  <td>Asian</td>
  <td>515</td>
</tr>
<tr>
  <td>American Indians</td>
  <td>84</td>
</tr>
<tr>
  <td>Pacific Islander</td>
  <td>243</td>
</tr>
</table>
`