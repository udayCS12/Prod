const quizDiv = document.getElementById("quiz");
const wingSl = document.getElementById("wingSl");
const loadingSpan = document.getElementById("loadingSpan");

let questions = [];

wingSl.onchange = async function () {
  quizDiv.innerHTML = "";
  loadingSpan.textContent = "Loading...";
  const wing = wingSl.value;
  let fileName;
  if (wing === "sax") {
    fileName = "sax1";
  } else if (wing === "gtw") {
    fileName = "gtw";
  }
  if (fileName) {
    questions = await fetchData(fileName);
    renderQuestions();
    loadingSpan.textContent = "";
  }
};

document.getElementById("testBtn").onclick = () => {
  const wing = wingSl.value;
  if (wing) {
    quizDiv.innerHTML = "<div id='report'></div><div id='testContainer'></div>";
    for (let i = questions.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1)); // 0 to i
      [questions[i], questions[j]] = [questions[j], questions[i]]; // swap
    }

    startTest(0);
  }
};

function renderQuestions() {
  let subject = "";
  let subjectDiv = "";
  let questionsContainer = "";

  questions.forEach((q, index) => {
    if (subject !== q.subject) {
      let displaying = false;
      const maxHeight = "500px";
      subject = q.subject;

      subjectDiv = document.createElement("div");
      subjectDiv.className = "subjectDiv";
      subjectDiv.classList.add(`subjectDiv_1`);
      quizDiv.appendChild(subjectDiv);

      const subjectHeading = document.createElement("h3");
      subjectHeading.className = "subjectHeading";
      subjectHeading.innerHTML = `<u>${subject}</u>`;
      subjectHeading.onclick = function () {
        const myQcontainer = document.getElementById(
          `questionsContainer_${index}`
        );
        const height = myQcontainer.style.offsetHeight;
        const qContainers = document.querySelectorAll(".questionsContainer");
        qContainers.forEach((qCont) => {
          qCont.style.display = "none";
        });
        if (displaying) {
          myQcontainer.style.display = "none";
          displaying = false;
        } else {
          myQcontainer.style.display = "block";
          displaying = true;
        }
      };
      subjectDiv.appendChild(subjectHeading);

      questionsContainer = document.createElement("div");
      questionsContainer.className = "questionsContainer";
      questionsContainer.id = `questionsContainer_${index}`;
      subjectDiv.appendChild(questionsContainer);
    }
    const qContainer = getEachQ(q, index);
    questionsContainer.appendChild(qContainer);
  });
}

function checkAnswer(index, selected, rprt) {
  const q = questions[index];
  if (rprt) {
    if (q.selected) {
      alert("Already answered!\nGo for next Question.");

      const radios = document.querySelectorAll(`input[name="q${index}"]`);

      radios.forEach((radio) => {
        radio.checked = radio.value === q.selected;
      });

      return;
    }
  }

  q.selected = selected;

  const correct = q.answer;
  const ansDiv = document.getElementById(`answer${index}`);
  if (selected === correct) {
    ansDiv.textContent = "✅ Correct!";
    ansDiv.style.color = "green";
    q.answered = "correct";
  } else {
    ansDiv.textContent = `❌ Wrong! Correct answer: ${correct}`;
    ansDiv.style.color = "red";
    q.answered = "wrong";
  }
  if (rprt) reportCard(index);
}

function getEachQ(q, index, rprt) {
  const qContainer = document.createElement("div");

  const qDiv = document.createElement("div");
  qDiv.className = "question";
  qDiv.innerHTML = `<p><b>Q${index + 1}:</b> ${q.question}</p>`;

  const optionsDiv = document.createElement("div");
  optionsDiv.className = "options";

  q.options.forEach((opt) => {
    const id = `q${index}_opt_${opt}`;
    optionsDiv.innerHTML += `
                    <label>
                      <input type="radio" name="q${index}" value="${opt}" onclick="checkAnswer(${index}, '${opt}', ${rprt})"> ${opt}
                    </label>
                  `;
  });

  const ansDiv = document.createElement("div");
  ansDiv.id = `answer${index}`;
  ansDiv.className = "answer";

  qContainer.appendChild(qDiv);
  qContainer.appendChild(optionsDiv);
  qContainer.appendChild(ansDiv);

  return qContainer;
}

function startTest(inx) {
  const q = questions[inx];
  const testContainer = document.getElementById("testContainer");
  testContainer.innerHTML = "";
  testContainer.appendChild(getEachQ(q, inx, true));

  const nextBtn = document.createElement("button");
  nextBtn.id = "nextBtn";
  nextBtn.textContent = "Next";
  nextBtn.onclick = function () {
    testContainer.innerHTML = "";
    startTest(inx + 1);
  };
  testContainer.appendChild(nextBtn);
}

async function fetchData(fileName) {
  const response = await fetch(`../data/${fileName}.json`);
  const data = await response.json();
  return data;
}

function reportCard(qNum) {
  const nCorrect = questions.filter((q) => q.answered === "correct").length;
  let percent = (nCorrect * 100) / (qNum + 1);
  percent = Math.round(percent * 100) / 100;

  const report = document.getElementById("report");
  report.innerHTML = `<b>${percent}%</b> <span>(${nCorrect}/${qNum + 1})`;

  return {
    attempted: qNum,
    correct: nCorrect,
    percent: `${percent}%`
  };
}
