import { createCanvas } from 'canvas';

/**
 * Contains various image utility methods
 */
class ImageUtil {
  static renderGuildIcon(acronym: string): Buffer {
    const width = 512;
    const height = 512;
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

export default ImageUtil;
