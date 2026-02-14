/**
 * 웹 앱으로 배포하면 이 함수가 호출됩니다.
 * '강의장현황_한눈에보기' 시트의 데이터를 JSON으로 반환합니다.
 *
 * 배포 방법:
 * 1. Apps Script 편집기에서 이 함수를 기존 코드 아래에 추가
 * 2. [배포] > [새 배포] > 유형: 웹 앱
 * 3. 액세스 권한: "모든 사용자" 선택
 * 4. 배포 후 생성된 URL을 index.html의 APPS_SCRIPT_URL에 붙여넣기
 */
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var matrixSheet = ss.getSheetByName("강의장현황_한눈에보기");

  if (!matrixSheet) {
    return ContentService.createTextOutput(JSON.stringify({ error: "강의장현황_한눈에보기 시트를 찾을 수 없습니다." }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var allData = matrixSheet.getDataRange().getValues();
  var headers = allData[0]; // ["날짜", "요일", 601, 602, ...]
  var classrooms = [];
  for (var j = 2; j < headers.length; j++) {
    classrooms.push(String(headers[j]));
  }

  var schedule = [];
  for (var i = 1; i < allData.length; i++) {
    var row = allData[i];
    var dateVal = row[0];
    var dateStr = "";
    if (dateVal instanceof Date) {
      dateStr = Utilities.formatDate(dateVal, "Asia/Seoul", "yyyy-MM-dd");
    } else {
      dateStr = String(dateVal);
    }

    var entry = {
      date: dateStr,
      day: String(row[1]),
      rooms: {}
    };

    for (var j = 2; j < row.length; j++) {
      var cellValue = String(row[j] || "").trim();
      if (cellValue) {
        entry.rooms[String(headers[j])] = cellValue;
      }
    }

    schedule.push(entry);
  }

  var result = {
    classrooms: classrooms,
    schedule: schedule,
    updatedAt: new Date().toISOString()
  };

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
