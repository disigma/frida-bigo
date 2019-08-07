import {
    CString,
    Float,
    Int,
    Pointer,
    Struct,
    UInt,
    UInt32,
    UInt8,
    Vector
} from "./struct";

const x264_vui_t = new Struct({
    i_sar_height: Int,
    i_sar_width: Int,
    i_overscan: Int,
    i_vidformat: Int,
    b_fullrange: Int,
    i_colorprim: Int,
    i_transfer: Int,
    i_colmatrix: Int,
    i_chroma_loc: Int
});

const x264_analyse_t = new Struct({
    intra: UInt,
    inter: UInt,

    b_transform_8x8: Int,
    i_weighted_pred: Int,
    b_weighted_bipred: Int,
    i_direct_mv_pred: Int,
    i_chroma_qp_offset: Int,

    i_me_method: Int,
    i_me_range: Int,
    i_mv_range: Int,
    i_mv_range_thread: Int,
    i_subpel_refine: Int,
    b_chroma_me: Int,
    b_mixed_references: Int,
    i_trellis: Int,
    b_fast_pskip: Int,
    b_dct_decimate: Int,
    i_noise_reduction: Int,
    f_psy_rd: Float,
    f_psy_trellis: Float,
    b_psy: Int,

    b_mb_info: Int,
    b_mb_info_update: Int,

    i_luma_deadzone: new Vector(Int, 2),

    b_psnr: Int,
    b_ssim: Int
});

const x264_rc_t = new Struct({
    i_rc_method: Int,

    i_qp_constant: Int,
    i_qp_min: Int,
    i_qp_max: Int,
    i_qp_step: Int,

    i_bitrate: Int,
    f_rf_constant: Float,
    f_rf_constant_max: Float,
    f_rate_tolerance: Float,
    i_vbv_max_bitrate: Int,
    i_vbv_buffer_size: Int,
    f_vbv_buffer_init: Float,
    f_ip_factor: Float,
    f_pb_factor: Float,

    b_filler: Int,

    i_aq_mode: Int,
    f_aq_strength: Float,
    b_mb_tree: Int,
    i_lookahead: Int,

    b_stat_write: Int,
    psz_stat_out: CString,
    b_stat_read: Int,
    psz_stat_in: CString,

    f_qcompress: Float,
    f_qblur: Float,
    f_complexity_blur: Float,
    zones: Pointer,
    i_zones: Int,
    psz_zones: CString
});

const x264_crop_rect_t = new Struct({
    i_left: UInt,
    i_top: UInt,
    i_right: UInt,
    i_bottom: UInt
});

export const x264_param_t = new Struct({
    /* CPU flags */
    cpu: UInt,
    i_threads: Int,
    i_lookahead_threads: Int,
    b_sliced_threads: Int,
    b_deterministic: Int,
    b_cpu_independent: Int,
    i_sync_lookahead: Int,

    /* Video Properties */
    i_width: Int,
    i_height: Int,
    i_csp: Int,
    i_bitdepth: Int,
    i_level_idc: Int,
    i_frame_total: Int,

    /* NAL HRD */
    i_nal_hrd: Int,


    vui: x264_vui_t,

    /* Bitstream parameters */
    i_frame_reference: Int,
    i_dpb_size: Int,

    i_keyint_max: Int,
    i_keyint_min: Int,
    i_scenecut_threshold: Int,
    b_intra_refresh: Int,

    i_bframe: Int,
    i_bframe_adaptive: Int,
    i_bframe_bias: Int,
    i_bframe_pyramid: Int,
    b_open_gop: Int,
    b_bluray_compat: Int,
    i_avcintra_class: Int,
    // i_avcintra_flavor: Int,

    b_deblocking_filter: Int,
    i_deblocking_filter_alphac0: Int,
    i_deblocking_filter_beta: Int,

    b_cabac: Int,
    i_cabac_init_idc: Int,

    b_interlaced: Int,
    b_constrained_intra: Int,

    i_cqm_preset: Int,
    psz_cqm_file: CString,
    cqm_4iy: new Vector(UInt8, 16),
    cqm_4py: new Vector(UInt8, 16),
    cqm_4ic: new Vector(UInt8, 16),
    cqm_4pc: new Vector(UInt8, 16),
    cqm_8iy: new Vector(UInt8, 64),
    cqm_8py: new Vector(UInt8, 64),
    cqm_8ic: new Vector(UInt8, 64),
    cqm_8pc: new Vector(UInt8, 64),

    /* Log */
    pf_log: Pointer,
    p_log_private: Pointer,
    i_log_level: Int,
    b_full_recon: Int,
    psz_dump_yuv: CString,

    /* Encoder analyser parameters */
    analyse: x264_analyse_t,

    /* Rate control parameters */
    rc: x264_rc_t,

    crop_rect: x264_crop_rect_t,

    /* frame packing arrangement flag */
    i_frame_packing: Int,

    /* alternative transfer SEI */
    i_alternative_transfer: Int,

    b_aud: Int,
    b_repeat_headers: Int,
    b_annexb: Int,

    i_sps_id: Int,
    b_vfr_input: Int,

    b_pulldown: Int,
    i_fps_num: UInt32,
    i_fps_den: UInt32,
    i_timebase_num: UInt32,
    i_timebase_den: UInt32,

    b_tff: Int,

    b_pic_struct: Int,

    b_fake_interlaced: Int,

    b_stitchable: Int,

    b_opencl: Int,
    i_opencl_device: Int,
    opencl_device_id: Pointer,
    psz_clbin_file: CString,

    i_slice_max_size: Int,
    i_slice_max_mbs: Int,
    i_slice_min_mbs: Int,
    i_slice_count: Int,
    i_slice_count_max: Int,

    param_free: Pointer,

    nalu_process: Pointer
});
