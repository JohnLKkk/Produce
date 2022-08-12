let tmpComponent;

const ColorMath = {
  hsv_to_rgb: function(h, s, v) {
    const hi = Math.floor(h / 60) % 6;

    const f = h / 60 - Math.floor(h / 60);
    const p = v * (1.0 - s);
    const q = v * (1.0 - (f * s));
    const t = v * (1.0 - ((1.0 - f) * s));

    const c = [
      [v, t, p],
      [q, v, p],
      [p, v, t],
      [p, q, v],
      [t, p, v],
      [v, p, q]
    ][hi];

    return {
      r: c[0] * 255,
      g: c[1] * 255,
      b: c[2] * 255
    };
  },

  rgb_to_hsv: function(r, g, b) {
    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    const delta = max - min;
    let h;
    let s;

    if (max !== 0) {
      s = delta / max;
    } else {
      return {
        h: NaN,
        s: 0,
        v: 0
      };
    }

    if (r === max) {
      h = (g - b) / delta;
    } else if (g === max) {
      h = 2 + (b - r) / delta;
    } else {
      h = 4 + (r - g) / delta;
    }
    h /= 6;
    if (h < 0) {
      h += 1;
    }

    return {
      h: h * 360,
      s: s,
      v: max / 255
    };
  },

  rgb_to_hex: function(r, g, b) {
    let hex_r = (r * 255).toFixed(0).toString(16);
    let hex_g = (g * 255).toFixed(0).toString(16);
    let hex_b = (b * 255).toFixed(0).toString(16);
    return '#' + hex_r + hex_g + hex_b;
  },

  rgbToHex(r, g, b) {
    r = (r * 255).toFixed(0);
    g = (g * 255).toFixed(0);
    b = (b * 255).toFixed(0);
    if(r == 0 && g == 0 && b == 0){
      return '#000000';
    }
    return '#' + ((r << 16) | (g << 8) | b).toString(16);
  },

  hex_to_rgb: function(hex){
    let b = this.component_from_hex(hex, 0) / 255.0;
    let g = this.component_from_hex(hex, 1) / 255.0;
    let r = this.component_from_hex(hex, 2) / 255.0;
    return {r, g, b};
  },

  hexToRgba(hex, opacity) {
    return {r:parseInt("0x" + hex.slice(1, 3)) / 255.0, g:parseInt("0x" + hex.slice(3, 5)) / 255.0, b:parseInt("0x" + hex.slice(5, 7)) / 255.0};
  },

  component_from_hex: function(hex, componentIndex) {
    return (hex >> (componentIndex * 8)) & 0xFF;
  },

  hex_with_component: function(hex, componentIndex, value) {
    return value << (tmpComponent = componentIndex * 8) | (hex & ~(0xFF << tmpComponent));
  }
};

export default ColorMath;
