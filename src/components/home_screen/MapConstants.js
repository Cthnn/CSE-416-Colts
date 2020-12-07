export const States = {NONE: 'NONE', AL: "AL", FL: "FL", VA: "VA"};
export const StateIds = {1: "Alabama", 12: "Florida", 51: "Virginia"};
export const StateNames = {NONE: 'None', AL: "Alabama", FL: "Florida", VA: "Virginia"};
export const Districts = {AL: "AL-District", FL: "FL-District", VA: "VA-District"};
export const Precincts = {AL: "AL-Precinct", FL: "FL-Precinct", VA: "VA-Precinct"};
export const HeatMaps = {AL: "AL-HeatMap", FL: "FL-HeatMap", VA: "VA-HeatMap"};
export const DistrictingType = {NONE: 'NONE', AVG: "Average", EX: "Extreme"};
export const CurrentEnactedDistrictingJobId = 0;
export const Completed = "COMPLETED";

export const StateLayers = {AL: "AL-Layer", FL: "FL-Layer", VA: "VA-Layer"};
export const DistrictLineLayers = {AL: "AL-Line-Layer", FL: "FL-Line-Layer", VA: "VA-Line-Layer"};
export const DistrictLayers = {AL: "AL-District-Layer", FL: "FL-District-Layer", VA: "VA-District-Layer"};
export const PrecinctLayers = {AL: "AL-Precinct-Layer", FL: "FL-Precinct-Layer", VA: "VA-Precinct-Layer"};
export const HeatMapLayers = {AL: "AL-HeatMap-Layer", FL: "FL-HeatMap-Layer", VA: "VA-HeatMap-Layer"};
export const SelectedFeatureLayer = 'selectedFeature';

export const DistrictingTypeLayers = {AVG: "Average-Districting", EX: "Extreme-Districting"};

export const StateCenters = {AL: [-86.68075561523438, 32.57631501316452], FL: [-82.87845611572266, 28.40022856730028], VA: [-79.42291259765625, 38.00321033702472]};
export const CountryCenter = [-82.994041442871, 32.99325130583]

export const SelectedColor = 'rgba(255,255, 0, .4)';
export const DefaultColor = 'rgba(200, 100, 255, .2)';
export const OutlineStateColor = 'rgba(200, 100, 255, 1)';
export const OutlineDistrictColor = 'rgba(0, 0, 0, 1)';
export const OutlinePrecinctColor = 'rgba(200, 100, 255, 1)';
export const SelectedFeatureColor = 'rgba(50, 50, 210, 0.4)';
export const OutlineSelectedFeatureColor = 'rgba(50, 50, 210, 1)';

export const EthnicGroups = {NONE: "NONE", WHITE: "WHITE", BLACK: "BLACK", NATIVE_AMERICAN: "NATIVE_AMERICAN", ASIAN: "ASIAN", PACIFIC_ISLANDER: "PACIFIC_ISLANDER",  HISPANIC: "HISPANIC"};
export const EthnicGroupNames = {NONE: "None", WHITE: "White American", BLACK: "Black or African American", NATIVE_AMERICAN: "Native American and Alaska Native", ASIAN: "Asian", PACIFIC_ISLANDER: "Native Hawaiian and Other Pacific Islander", HISPANIC: "Hispanic or Latino"};
export const EthnicGroupNicknames = {NONE: "None", WHITE: "White", BLACK: "Black", NATIVE_AMERICAN: "Native American", ASIAN: "Asian", PACIFIC_ISLANDER: "Pacific Islander", HISPANIC: "Latino"};
export const HeatMapMapping = {WHITE: "R2", BLACK: "R3",  NATIVE_AMERICAN: "R4", ASIAN: "R5", PACIFIC_ISLANDER: "R6", HISPANIC: "R8"};

export const CompactValues = {NONE: "0", SLIGHT: ".25", MODERATE: ".5", VERY: ".75"};
export const BoxPlotLabels = {ENACTED: "Enacted", AVG: "Average", EX: "Extreme"}