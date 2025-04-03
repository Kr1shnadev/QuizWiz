const generatePDF = (sections, blueprint) => {
    const content = document.createElement('div');
    content.style.cssText = 'width: 8.27in; height: 11.69in; padding: 1in; box-sizing: border-box;';

    sections.forEach((section, sectionIndex) => {
        const sectionHeader = document.createElement('h2');
        sectionHeader.textContent = `Section ${section.sectionName}`;
        sectionHeader.style.cssText = 'margin-top: 30px; margin-bottom: 20px; font-size: 18px; font-weight: bold; border-bottom: 2px solid #1a237e; padding-bottom: 8px;';
        content.appendChild(sectionHeader);

        section.questions.forEach((question, questionIndex) => {
            const questionElement = document.createElement('div');
            questionElement.style.cssText = 'margin-bottom: 20px;';

            const questionText = document.createElement('p');
            questionText.innerHTML = `<strong>Q${questionIndex + 1}.</strong> ${question.text} <span style="font-size: 12px; color: #666;">[${question.marks} marks]</span>`;
            questionElement.appendChild(questionText);

            if (question.options) {
                const optionsList = document.createElement('div');
                optionsList.style.cssText = 'margin-left: 20px;';

                question.options.forEach((option, optionIndex) => {
                    optionsList.innerHTML += `<p style="margin-bottom: 8px; color: #333;"><strong>${String.fromCharCode(65 + optionIndex)}.</strong> ${option}</p>`;
                });
                questionElement.appendChild(optionsList);
            }

            content.appendChild(questionElement);
        });
    });

    const opt = {
        margin: [0.5, 0.5],
        filename: `${blueprint.examName.replace(/\s+/g, '_')}_question_paper.pdf`,
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(content).save().then(() => {
        document.body.removeChild(content);
    });
};

window.QuestionPaperGenerator = { generatePDF };