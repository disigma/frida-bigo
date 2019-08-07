import {
    Bool, Enum, Float, Int, Int8, Int32, Struct, UInt, UInt16, UInt32, UInt8, Vector, CString
} from "./struct";

const SliceModeEnum = new Enum([
    "SM_SINGLE_SLICE",
    "SM_FIXEDSLCNUM_SLICE",
    "SM_RASTER_SLICE",
    "SM_SIZELIMITED_SLICE",
    "SM_RESERVED"
]);

const MAX_SPATIAL_LAYER_NUM = 4;
const MAX_QUALITY_LAYER_NUM = 4;

const MAX_NAL_UNITS_IN_LAYER = 128;

const SAVED_NALUNIT_NUM_TMP = ((MAX_SPATIAL_LAYER_NUM * MAX_QUALITY_LAYER_NUM) + 1 + MAX_SPATIAL_LAYER_NUM);

const MAX_SLICES_NUM_TMP = ((MAX_NAL_UNITS_IN_LAYER - SAVED_NALUNIT_NUM_TMP) / 3);

const SSliceArgument = new Struct({
    uiSliceMode: SliceModeEnum,
    uiSliceNum: UInt,
    uiSliceMbNum: new Vector(UInt, MAX_SLICES_NUM_TMP),
    uiSliceSizeConstraint: UInt
});

const EProfileIdc = new Enum({
    0: "PRO_UNKNOWN",
    66: "PRO_BASELINE",
    77: "PRO_MAIN",
    88: "PRO_EXTENDED",
    100: "PRO_HIGH",
    110: "PRO_HIGH10",
    122: "PRO_HIGH422",
    144: "PRO_HIGH444",
    244: "PRO_CAVLC444",
    83: "PRO_SCALABLE_BASELINE",
    86: "PRO_SCALABLE_HIGH"
});

const ELevelIdc = new Enum({
    0: "LEVEL_UNKNOWN",
    10: "LEVEL_1_0",
    9: "LEVEL_1_B",
    11: "LEVEL_1_1",
    12: "LEVEL_1_2",
    13: "LEVEL_1_3",
    20: "LEVEL_2_0",
    21: "LEVEL_2_1",
    22: "LEVEL_2_2",
    30: "LEVEL_3_0",
    31: "LEVEL_3_1",
    32: "LEVEL_3_2",
    40: "LEVEL_4_0",
    41: "LEVEL_4_1",
    42: "LEVEL_4_2",
    50: "LEVEL_5_0",
    51: "LEVEL_5_1",
    52: "LEVEL_5_2"
});

const ESampleAspectRatio = new Enum({
    0: "ASP_UNSPECIFIED",
    1: "ASP_1x1",
    2: "ASP_12x11",
    3: "ASP_10x11",
    4: "ASP_16x11",
    5: "ASP_40x33",
    6: "ASP_24x11",
    7: "ASP_20x11",
    8: "ASP_32x11",
    9: "ASP_80x33",
    10: "ASP_18x11",
    11: "ASP_15x11",
    12: "ASP_64x33",
    13: "ASP_160x99",
    255: "ASP_EXT_SAR"
});


const SSpatialLayerConfig = new Struct({
    iVideoWidth: Int,
    iVideoHeight: Int,
    fFrameRate: Float,
    iSpatialBitrate: Int,
    iMaxSpatialBitrate: Int,
    uiProfileIdc: EProfileIdc,
    uiLevelIdc: ELevelIdc,
    iDLayerQp: Int,
    sSliceArgument: SSliceArgument,
    bVideoSignalTypePresent: Bool,
    uiVideoFormat: UInt8,
    bFullRange: Bool,
    bColorDescriptionPresent: Bool,
    uiColorPrimaries: UInt8,
    uiTransferCharacteristics: UInt8,
    uiColorMatrix: UInt8,
    bAspectRatioPresent: Bool,
    eAspectRatio: ESampleAspectRatio,
    sAspectRatioExtWidth: UInt16,
    sAspectRatioExtHeight: UInt16
});

const EUsageType = new Enum([
    "CAMERA_VIDEO_REAL_TIME",
    "SCREEN_CONTENT_REAL_TIME",
    "CAMERA_VIDEO_NON_REAL_TIME",
    "SCREEN_CONTENT_NON_REAL_TIME",
    "INPUT_CONTENT_TYPE_ALL"
]);

const RC_MODES = new Enum({
    0: "RC_QUALITY_MODE",
    1: "RC_BITRATE_MODE",
    2: "RC_BUFFERBASED_MODE",
    3: "RC_TIMESTAMP_MODE",
    4: "RC_BITRATE_MODE_POST_SKIP"
});

const ECOMPLEXITY_MODE = new Enum([
    "LOW_COMPLEXITY",
    "MEDIUM_COMPLEXITY",
    "HIGH_COMPLEXITY"
]);

const EParameterSetStrategy = new Enum({
    0: "CONSTANT_ID",
    1: "INCREASING_ID",
    2: "SPS_LISTING",
    3: "SPS_LISTING_AND_PPS_INCREASING",
    6: "SPS_PPS_LISTING"
});

export const EncParamExt = new Struct({
    iUsageType: EUsageType,
    iPicWidth: Int,
    iPicHeight: Int,
    iTargetBitrate: Int,
    iRCMode: RC_MODES,
    fMaxFrameRate: Float,
    iTemporalLayerNum: Int,
    iSpatialLayerNum: Int,
    sSpatialLayers: new Vector(SSpatialLayerConfig, MAX_SPATIAL_LAYER_NUM),
    iComplexityMode: ECOMPLEXITY_MODE,
    uiIntraPeriod: UInt,
    iNumRefFrame: Int,
    eSpsPpsIdStrategy: EParameterSetStrategy,
    bPrefixNalAddingCtrl: Bool,
    bEnableSSEI: Bool,
    bSimulcastAVC: Bool,
    isPaddingFlag: Int,
    iEntropyCodingModeFlag: Int,
    bEnableFrameSkip: Bool,
    iMaxBitrate: Int,
    iMaxQp: Int,
    iMinQp: Int,
    uiMaxNalSize: UInt,
    bEnableLongTermReference: Bool,
    iLTRRefNum: Int,
    iLtrMarkPeriod: UInt,
    iMultipleThreadIdc: UInt16,
    bUseLoadBalancing: Bool,
    iLoopFilterDisableIdc: Int,
    iLoopFilterAlphaC0Offset: Int,
    iLoopFilterBetaOffset: Int,
    bEnableDenoise: Bool,
    bEnableBackgroundDetection: Bool,
    bEnableAdaptiveQuant: Bool,
    bEnableFrameCroppingFlag: Bool,
    bEnableSceneChangeDetect: Bool,
    bIsLosslessLink: Bool
});

const MAX_TEMPORAL_LAYER_NUM = 4;

export const SSpatialLayerInternal = new Struct({
    iActualWidth: Int32,
    iActualHeight: Int32,
    iTemporalResolution: Int32,
    iDecompositionStages: Int32,
    uiCodingIdx2TemporalId: new Vector(UInt8, (1 << MAX_TEMPORAL_LAYER_NUM) + 1),
    iHighestTemporalId: Int8,
    fInputFrameRate: Float,
    fOutputFrameRate: Float,
    uiIdrPicId: UInt16,
    iCodingIndex: Int32,
    iFrameIndex: Int32,
    bEncCurFrmAsIdrFlag: Bool,
    iFrameNum: Int32,
    iPOC: Int32
});

export const SWelsSvcCodingParam = new Struct({
    param: EncParamExt,
    sDependencyLayers: new Vector(SSpatialLayerInternal, MAX_TEMPORAL_LAYER_NUM),
    uiGopSize: UInt32,
    iLeft: Int32,
    iTop: Int32,
    iWidth: Int32,
    iHeight: Int32,
    pCurPath: CString,
    bDeblockingParallelFlag: Bool,
    iBitsVaryPercentage: Int32,
    iDecompStages: Int8,
    iMaxNumRefFrame: Int32,
});

export const ENCODER_OPTION = new Enum([
    "ENCODER_OPTION_DATAFORMAT",
    "ENCODER_OPTION_IDR_INTERVAL",
    "ENCODER_OPTION_SVC_ENCODE_PARAM_BASE",
    "ENCODER_OPTION_SVC_ENCODE_PARAM_EXT",
    "ENCODER_OPTION_FRAME_RATE",
    "ENCODER_OPTION_BITRATE",
    "ENCODER_OPTION_MAX_BITRATE",
    "ENCODER_OPTION_INTER_SPATIAL_PRED",
    "ENCODER_OPTION_RC_MODE",
    "ENCODER_OPTION_RC_FRAME_SKIP",
    "ENCODER_PADDING_PADDING",
    "ENCODER_OPTION_PROFILE",
    "ENCODER_OPTION_LEVEL",
    "ENCODER_OPTION_NUMBER_REF",
    "ENCODER_OPTION_DELIVERY_STATUS",
    "ENCODER_LTR_RECOVERY_REQUEST",
    "ENCODER_LTR_MARKING_FEEDBACK",
    "ENCODER_LTR_MARKING_PERIOD",
    "ENCODER_OPTION_LTR",
    "ENCODER_OPTION_COMPLEXITY",
    "ENCODER_OPTION_ENABLE_SSEI",
    "ENCODER_OPTION_ENABLE_PREFIX_NAL_ADDING",
    "ENCODER_OPTION_SPS_PPS_ID_STRATEGY",
    "ENCODER_OPTION_CURRENT_PATH",
    "ENCODER_OPTION_DUMP_FILE",
    "ENCODER_OPTION_TRACE_LEVEL",
    "ENCODER_OPTION_TRACE_CALLBACK",
    "ENCODER_OPTION_TRACE_CALLBACK_CONTEXT",
    "ENCODER_OPTION_GET_STATISTICS",
    "ENCODER_OPTION_STATISTICS_LOG_INTERVAL",
    "ENCODER_OPTION_IS_LOSSLESS_LINK",
    "ENCODER_OPTION_BITS_VARY_PERCENTAG",
]);

export const LAYER_NUM = new Enum([
    "SPATIAL_LAYER_0",
    "SPATIAL_LAYER_1",
    "SPATIAL_LAYER_2",
    "SPATIAL_LAYER_3",
    "SPATIAL_LAYER_ALL",
]);

export const SBitrateInfo = new Struct({
    iLayer: LAYER_NUM,
    iBitrate: Int
});
