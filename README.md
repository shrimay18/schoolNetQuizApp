#Quiz App 

#File Structure 
->quizSchoolNet
  ->public
  ->src
    ->components
        ->MockExamCard.tsx
    ->pages
        ->AnswerReviewPopup.tsx
        ->ExamDetails.tsx
        ->ExamPage.tsx
        ->MockExamCardHolder.tsx
        ->ResultPage.tsx
    ->App.tsx
    ->index.tsx
  ->package.json
  ->tailwind.config.js
  ->tsconfig.json


#Key features of the Quiz App:

-> Auto updation to next question once a answer is selected
-> Progress bar to check the number of question attempted 
-> Question pallete icon at the top right corner which shows the number of questions, questions marked for review & help navigate through different questions.
-> Moon icon to convert to dark mode and a sun icon to convert to light mode.
-> Timer to check amount of time left.
-> Green card if the answered question is correct & red color if the answered question is wrong in real time.
-> Book mark feature
-> Single choice, Multiple choice, True False all kinda question accomodated.
-> Animations used on result page to make it more attractive.

#Code flow 

-> The moment you enter the app , you are routed to /mock-exam page which has multiple mock exams . 
-> Once you click on start button in any of the mock exam , you are directed to /examId page i.e /example page in this app 
-> Now on clicking continue button you are navigated to /example/start page which hold questions which needs to be answered . 
-> On submission a result page pops up which has some animations , your test score, number of questions attempted & correct solution to each question. This page also has go back to home option in the navigation bar which takes users back to /mock-exam page .

#Error Handling 

-> If by any chance questions content is not received in the code then we direct user to page saying no exam found.
-> One cannot select multiple answers in a single question.
-> Once a answer is given user can change it .
-> In multiple correct solution if a user marks even a single incorrect solution then he/she can't attempt it further .
