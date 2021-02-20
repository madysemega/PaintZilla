export default {
    RGB_VALIDATOR: /^rgb\((\d{1,3}(?:\.\d+)?),\s*(\d{1,3}(?:\.\d+)?),\s*(\d{1,3}(?:\.\d+)?)\)$/,
    RGBA_VALIDATOR: /^rgba\((\d{1,3}(?:\.\d+)?),\s*(\d{1,3}(?:\.\d+)?),\s*(\d{1,3}(?:\.\d+)?),\s*(\d+(?:\.\d+)?)\)$/,
    HEX_TWO_VALIDATOR: /^[0-9a-fA-F]{2}$/,
    HEX_SIX_VALIDATOR: /^[0-9a-fA-F]{6}$/,
    INT_VALIDATOR: /^[0-9]*$/,
    DEC_VALIDATOR: /^\d+\.?\d*$/,
};
