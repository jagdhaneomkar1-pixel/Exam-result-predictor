const form = document.getElementById("predictor-form");
const attendance = document.getElementById("attendance");
const attendanceValue = document.getElementById("attendance-value");
const placeholder = document.getElementById("result-placeholder");
const resultContent = document.getElementById("result-content");
const resetButton = document.getElementById("reset-button");

attendance.addEventListener("input", () => {
  attendanceValue.value = `${attendance.value}%`;
  attendanceValue.textContent = `${attendance.value}%`;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("student-name").value.trim();
  const total = Number(document.getElementById("total-marks").value);
  const obtained = Number(document.getElementById("obtained-marks").value);
  const attendanceRate = Number(attendance.value);
  const preparation = Number(document.getElementById("preparation").value);
  const studyHours = Number(document.getElementById("study-hours").value);

  if (!Number.isFinite(total) || !Number.isFinite(obtained) || total < 1 || obtained < 0 || obtained > total) {
    alert("Please enter valid marks. Marks obtained must be between 0 and total marks.");
    return;
  }

  const currentPercent = (obtained / total) * 100;
  const attendanceBoost = ((attendanceRate - 50) / 50) * 4;
  const prepBoost = (preparation - 0.9) * 30;
  const studyBoost = (studyHours - 0.93) * 20;
  const estimatedPercent = Math.max(0, Math.min(100, currentPercent * 0.78 + 18 + attendanceBoost + prepBoost + studyBoost));
  const uncertainty = Math.max(3, 9 - (attendanceRate / 20) - (preparation * 2));
  const lowPercent = Math.max(0, estimatedPercent - uncertainty);
  const highPercent = Math.min(100, estimatedPercent + uncertainty);
  const lowScore = Math.round((lowPercent / 100) * total);
  const highScore = Math.round((highPercent / 100) * total);
  const roundedPercent = Math.round(estimatedPercent);

  let grade = "F";
  let summary = "Your estimate suggests you should focus on the basics and build a steady study routine.";
  if (roundedPercent >= 90) { grade = "A+"; summary = "Excellent estimated performance. Keep revising and practise under exam conditions."; }
  else if (roundedPercent >= 80) { grade = "A"; summary = "Very good estimated performance. Focus on accuracy and the topics you find hardest."; }
  else if (roundedPercent >= 70) { grade = "B"; summary = "Good progress. Regular revision and timed practice can help you improve further."; }
  else if (roundedPercent >= 60) { grade = "C"; summary = "A reasonable starting point. Strengthen weak topics and review mistakes each week."; }
  else if (roundedPercent >= 40) { grade = "D"; summary = "You may benefit from a more structured study plan and extra practice on key concepts."; }

  document.getElementById("greeting").textContent = name ? `${name}, your predicted result` : "Your predicted result";
  document.getElementById("score-low").textContent = lowScore;
  document.getElementById("score-high").textContent = highScore;
  document.getElementById("score-total").textContent = total;
  document.getElementById("grade-badge").textContent = grade;
  document.getElementById("progress-bar").style.width = `${roundedPercent}%`;
  document.getElementById("result-summary").textContent = `${summary} Estimated percentage: about ${roundedPercent}%.`;

  const tips = [];
  if (attendanceRate < 75) tips.push("Improve attendance where possible and collect notes for missed classes.");
  if (preparation < 0.9) tips.push("Make a topic-by-topic revision plan and start with the fundamentals.");
  if (studyHours < 0.93) tips.push("Try focused 25-minute study blocks with short breaks.");
  tips.push("Practise previous papers or sample questions and check every mistake.");
  tips.push("Sleep well before the exam and leave time for a final revision.");
  const tipsList = document.getElementById("tips-list");
  tipsList.replaceChildren(...tips.map((tip) => {
    const li = document.createElement("li");
    li.textContent = tip;
    return li;
  }));

  placeholder.hidden = true;
  resultContent.hidden = false;
});

resetButton.addEventListener("click", () => {
  form.reset();
  attendanceValue.value = `${attendance.value}%`;
  attendanceValue.textContent = `${attendance.value}%`;
  resultContent.hidden = true;
  placeholder.hidden = false;
  document.getElementById("progress-bar").style.width = "0";
});
