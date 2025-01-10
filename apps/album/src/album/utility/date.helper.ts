import * as dayjs from 'dayjs';

// TODO: 시간 형식을 통일하던지 아니면 여기서 여러방식을 대응하던지 결정할것!

/**
 * 주어진 EXIF 날짜 문자열을 Date 객체로 변환합니다.
 *
 * @param exifDateTime - EXIF에서 추출된 날짜 문자열 (형식: "YYYY:MM:DD HH:mm:ss")
 * @returns 변환된 Date 객체. 유효하지 않을 경우 현재 시간을 반환합니다.
 */
export function parseExifDateTime(exifDateTime: string): Date {
  if (!exifDateTime) {
    return new Date();
  }

  const formattedDateTime = exifDateTime.replace(
    /(\d{4}):(\d{2}):(\d{2})/,
    '$1-$2-$3',
  );

  const parsedDate = dayjs(formattedDateTime, 'YYYY-MM-DD HH:mm:ss');

  return parsedDate.isValid() ? parsedDate.toDate() : new Date();
}
