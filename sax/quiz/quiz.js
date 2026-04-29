let questions = [];
      let indexes = [];
      let qNum = 0;
      let total = 0;
      let right = 0;
      let wrong = 0;
      let temporaryRight = 0;
      
      fetchQuestions()
      async function fetchQuestions(){
        questions = await fetchData();
        start();
      }
      
      async function fetchData(){
        const response = await fetch("../data/sax1.json");
        const data = await response.json();
        return data;
      }

      function start(){
        indexes = Array.from({ length: questions.length }, (_, i) => i);

        for (let i = indexes.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1)); // 0 to i
          [indexes[i], indexes[j]] = [indexes[j], indexes[i]]; // swap
        }

        total = indexes.length;
  
        const quizDiv = document.getElementById("quiz");        
  
        const tittleDiv = document.getElementById("tittle");
        tittleDiv.innerHTML += `<b> (Total:${total})</b>`;
  
        getQuestion(quizDiv);
      }
      
            
      function getQuestion(quizDiv) {
        const q = questions[indexes[qNum]];
        const index = indexes[qNum];
        const qDiv = document.createElement("div");
        qDiv.className = "question";
        qDiv.innerHTML = `<p><b>Q${qNum + 1}:</b> ${q.question}</p>`;

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

        const nextBtn = document.createElement("button");
        nextBtn.id = "nextBtn";
        nextBtn.textContent = "Next";
        nextBtn.onclick = function () {
          quizDiv.innerHTML = "";
          qNum++;
          right = temporaryRight;
          getQuestion(quizDiv);
        };

        qDiv.appendChild(optionsDiv);
        qDiv.appendChild(ansDiv);
        quizDiv.appendChild(qDiv);
        quizDiv.appendChild(nextBtn);
      }

      function checkAnswer(index, selected) {
        const correct = questions[index].answer;
        const ansDiv = document.getElementById(`answer${index}`);
        if (selected === correct) {
          ansDiv.textContent = `✅ Correct! (Q:${index+1})`;
          ansDiv.style.color = "green";
          q.answered = "correct";
          updateReport(true);
        } else {
          ansDiv.textContent = `❌ Wrong! Correct answer: ${correct} (Q:${index+1})`;
          ansDiv.style.color = "red";
          q.answered = "wrong";
          updateReport(false);
        }
      }

      function updateReport(ans) {
        const nCorrect = questions.filter((q)=>{
          returns q.answered = "correct";
        }).length();

        let percent = (nCorrect * 100) / (qNum + 1);
        percent = Math.round(percent * 100) / 100;

        const report = document.getElementById("report");
        report.innerHTML = `<b>${percent}%</b> <span>(${nCorrect}/${qNum + 1})`;
      }
