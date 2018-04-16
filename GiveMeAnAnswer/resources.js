// Declaration of the global giveMeAnAnswer object
(function () {
    window.giveMeAnAnswer = {
        /* Questions and answers depending on the type */
        qna: {
            multiple: [
                {
                    question: 'Which of the following allows only one event handler?',
                    options: [
                        { key: 'a', value: 'document.addEventListener(\'onclick\', myFunc);' },
                        { key: 'b', value: 'document.attachEvent(\'onclick\', myFunc);' },
                        { key: 'c', value: 'document.onclick = myFunc;' },
                        { key: 'd', value: 'document.registerEventHandler = myFunc;' }
                    ],
                    answer: 'c'
                },
                {
                    question: 'What does JSON stand for?',
                    options: [
                        { key: 'a', value: 'JavaScript Object Notation' },
                        { key: 'b', value: 'JavaScript Original Notation' },
                        { key: 'c', value: 'Jupiter Script On Note' },
                        { key: 'd', value: 'Jupiter Super Object Notation' }
                    ],
                    answer: 'a'
                },
                {
                    question: 'When using x-www-form-urlencoded POST request where should the data go?',
                    options: [
                        { key: 'a', value: 'In the header of the request' },
                        { key: 'b', value: 'In the body of the request' },
                        { key: 'c', value: 'In the URL itself' },
                        { key: 'd', value: 'In the domain of the request' }
                    ],
                    answer: 'b'
                },
                {
                    question: 'What does XML stand for?',
                    options: [
                        { key: 'a', value: 'Extensible Makeup Language' },
                        { key: 'b', value: 'Expensive Markup Language' },
                        { key: 'c', value: 'Extensible Markup Language' },
                        { key: 'd', value: 'Extended Markup Language' }
                    ],
                    answer: 'c'
                },
                {
                    question: 'How would you describe the execution model in JS?',
                    options: [
                        { key: 'a', value: 'It is single-threaded and has a synchronous execution model.' },
                        { key: 'b', value: 'It is multi-threaded and has a synchronous execution model.' },
                        { key: 'c', value: 'It is single-threaded and has an asynchronous execution model.' },
                        { key: 'd', value: 'It is multi-threaded and has an asynchronous execution model.' }
                    ],
                    answer: 'a'
                }
            ],
            trueorfalse: [
                {
                    question: 'China is the most populous country in the world.',
                    answer: true
                },
                {
                    question: 'Donald Trump is the best president USA has had.',
                    answer: false
                },
                {
                    question: 'Free Willy featured a killer whale as it\'s main "actor".',
                    answer: true
                },
                {
                    question: 'Kim Kardashian became famous for her infamous singing talents.',
                    answer: false
                },
                {
                    question: '1 == \'1\' && undefined == null',
                    answer: true
                }
            ],
            shortAnswer: [
                {
                    question: 'What is the capital of Djibouti?',
                    answer: 'djibouti'
                },
                {
                    question: 'How tall is Michael Jordan?',
                    answer: '1.98'
                },
                {
                    question: 'What is Superman\'s weakness?',
                    answer: 'kryptonite'
                },
                {
                    question: 'What is Batman\'s mobile called?',
                    answer: 'Batmobile'
                },
                {
                    question: 'How many penguins reside at the North Pole?',
                    answer: '0'
                }
            ]
        }
    };
})();
