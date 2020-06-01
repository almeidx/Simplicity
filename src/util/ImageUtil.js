'use strict';

const { createCanvas } = require('canvas');

/**
 * Contains various image utility methods.
 * @class ImageUtil
 */
class ImageUtil {
  /**
   * Creates an instance of ImageUtil.
   */
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated`);
  }

  static renderGuildDefultIcon(acronym) {
    const width = 300;
    const height = 300;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#2C2F33';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#fff';
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillText(acronym, width / 2, height / 2);

    return canvas.toBuffer();
  }
}

module.exports = ImageUtil;
