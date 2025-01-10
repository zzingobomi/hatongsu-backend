import * as ExifReader from 'exifreader';

export interface ExifMetaData {
  make?: string;
  model?: string;
  dateTime?: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
  orientation?: number;
  width?: number;
  height?: number;
}

export async function extractExifMetaData(buffer: Buffer) {
  const tags = await ExifReader.load(buffer);

  const exifMetaData: ExifMetaData = {
    make: tags?.Make?.description?.toString(),
    model: tags?.Model?.description?.toString(),
    dateTime: tags?.DateTime?.description?.toString(),
    width:
      convertToNumber(tags?.ImageWidth) ||
      convertToNumber(tags?.PixelXDimension),
    height:
      convertToNumber(tags?.ImageLength) ||
      convertToNumber(tags?.PixelYDimension),
    orientation: convertToNumber(tags?.Orientation),
  };

  // GPS 정보 변환
  if (tags?.GPSLatitude && tags?.GPSLongitude) {
    const latitude = convertGpsToDecimal(tags.GPSLatitude);
    const longitude = convertGpsToDecimal(tags.GPSLongitude);

    if (latitude && longitude) {
      exifMetaData.gpsLatitude = latitude;
      exifMetaData.gpsLongitude = longitude;

      // GPS 기준점에 따라 남위/서경인 경우 음수로 변환
      if (tags.GPSLatitudeRef?.description === 'S') {
        exifMetaData.gpsLatitude *= -1;
      }
      if (tags.GPSLongitudeRef?.description === 'W') {
        exifMetaData.gpsLongitude *= -1;
      }
    }
  }

  return exifMetaData;
}

/**
 * EXIF 데이터를 숫자로 변환
 */
function convertToNumber(value: any): number | undefined {
  if (typeof value?.value === 'number') {
    return value.value;
  }
  if (typeof value?.description === 'number') {
    return value.description;
  }
  return undefined;
}

/**
 * GPS 데이터를 소수점 좌표로 변환
 */
function convertGpsToDecimal(gpsData: any): number | undefined {
  if (!gpsData?.value || !Array.isArray(gpsData.value)) return undefined;

  try {
    const [degrees, minutes, seconds] = gpsData.value.map((part) => {
      if (Array.isArray(part) && part.length === 2) {
        return part[0] / part[1];
      }
      return 0;
    });

    return degrees + minutes / 60 + seconds / 3600;
  } catch (error) {
    console.error('GPS 변환 중 오류:', error);
    return undefined;
  }
}
