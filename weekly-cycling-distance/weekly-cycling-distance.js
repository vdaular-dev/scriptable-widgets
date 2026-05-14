// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: bicycle;
//
// Weekly Cycing Distance
// https://github.com/doersino/scriptable-widgets/tree/main/weekly-cycling-distance
// - This is the code for a Scriptable widget, see https://scriptable.app.
// - It displays how many kilometers you've bicycled in the past 7 days,
//   comparing this figuere to the previous 7 days.
// - Since Scriptable can't access Health data directly, the relevant data must
//   be exported to a file via a Shortcuts Automation. See the link above for
//   more details.
// - Licensed under the MIT License.

// load data, written out regularly to the scriptable icloud directory using a shortcuts automation
// format: {"current":178.578236246203,"previous":305.833559967286} (meaning "current week, previous week")
// (annoyingly, scriptable can't access health directly)
const fileManager = FileManager.iCloud();
const dataFilePath = fileManager.joinPath(fileManager.documentsDirectory(), "weekly-cycling-distance.json");
await fileManager.downloadFileFromiCloud(dataFilePath);
const dataFileContents = fileManager.readString(dataFilePath);
const data = JSON.parse(dataFileContents);

// define widget
let widget = new ListWidget();
//widget.backgroundColor = new Color("#4D65BC");
widget.url = "x-apple-health://SampleType/HKQuantityTypeIdentifierDistanceCycling";  // via https://www.reddit.com/r/shortcuts/comments/1e4uk9z/all_health_related_xapplehealth_deeplink_available/

// set background gradient
// (roughly matches a blue tile in a shortcuts widget)
const gradient = new LinearGradient();
gradient.colors = [new Color("#6378C4"), new Color("#425BB7")];
gradient.locations = [0, 1];
gradient.startPoint = new Point(0, 0);  // top left
gradient.endPoint = new Point(1, 1);    // bottom right
widget.backgroundGradient = gradient;

// add symbol
let symbol = SFSymbol.named("bicycle");
symbol.applyLightWeight();
let image = widget.addImage(symbol.image);
image.tintColor = new Color("#fff");
image.imageOpacity = 0.7;
image.imageSize = new Size(48, 48);
image.rightAlignImage();

// visually align symbol more nicely
widget.setPadding(8, 16, 16, 12);

// widget.addSpacer(-20);  // negative spacing doesn't work, too bad

// add text
let currentHeading = widget.addText("7 DAYS");
currentHeading.textColor = new Color("#fff");
currentHeading.textOpacity = 0.7;
currentHeading.font = Font.mediumSystemFont(12);
currentHeading.leftAlignText();

let currentData = widget.addText(Math.round(data["current"] * 10) / 10 + " km");
currentData.textColor = new Color("#fff");
currentData.textOpacity = 1;
currentData.font = Font.lightSystemFont(26);
currentData.leftAlignText();

widget.addSpacer();

let previousHeading = widget.addText("PREVIOUSLY");
previousHeading.textColor = new Color("#fff");
previousHeading.textOpacity = 0.5;
previousHeading.font = Font.mediumSystemFont(12);
previousHeading.leftAlignText();

let previousData = widget.addText(Math.round(data["previous"] * 10) / 10 + " km");
previousData.textColor = new Color("#fff");
previousData.textOpacity = 0.5;
previousData.font = Font.regularSystemFont(18);
previousData.leftAlignText();

// request widget to be refreshed in an hour
widget.refreshAfterDate = new Date(Date.now() + 1000 * 60 * 60);

// set or preview widget
if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  widget.presentSmall();
}

Script.complete();
