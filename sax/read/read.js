const quizDiv = document.getElementById("quiz");
let questions=[];

document.getElementById("doneBtn").onclick = async function(){
      quizDiv.innerHTML = "";
      const wing = document.getElementById("wingSl").value;
      let fileName;
      if(wing === "sax"){
            fileName = "sax1";
      }else if(wing === "gtw"){
            fileName = "gtw";
      }
      if(fileName){
            questions = await fetchData(fileName);
            renderQuestions();
      }
}


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
          qCont.style.height = "0px";
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

    const qDiv = document.createElement("div");
    qDiv.className = "question";
    qDiv.innerHTML = `<p><b>Q${index + 1}:</b> ${q.question}</p>`;

    const optionsDiv = document.createElement("div");
    optionsDiv.className = "options";

    q.options.forEach((opt) => {
      const id = `q${index}_opt_${opt}`;
      optionsDiv.innerHTML += `
                    <label>
                      <input type="radio" name="q${index}" value="${opt}" onclick="checkAnswer(${index}, '${opt}')"> ${opt}
                    </label>
                  `;
    });

    const ansDiv = document.createElement("div");
    ansDiv.id = `answer${index}`;
    ansDiv.className = "answer";

    questionsContainer.appendChild(qDiv);
    questionsContainer.appendChild(optionsDiv);
    questionsContainer.appendChild(ansDiv);
  });
}

function checkAnswer(index, selected) {
  const correct = questions[index].answer;
  const ansDiv = document.getElementById(`answer${index}`);
  if (selected === correct) {
    ansDiv.textContent = "✅ Correct!";
    ansDiv.style.color = "green";
  } else {
    ansDiv.textContent = `❌ Wrong! Correct answer: ${correct}`;
    ansDiv.style.color = "red";
  }
}

async function fetchData(fileName) {
  const response = await fetch(`../data/${fileName}.json`);
  const data = await response.json();
  return data;
}

/*
let questions = [];
fetchQuestions();
async function fetchQuestions() {
  questions = await fetchData();
  start();
}
*/
