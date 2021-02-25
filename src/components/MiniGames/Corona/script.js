import { toast } from 'react-toastify';
import _ from 'lodash';

const CHANCE_OF_BEING_ILL = 0.5;
var PERSON_ID = 0;
const PEOPLE_NUMBER = 60;
const TEST_NUMBER = 10;
const FIRST_NAMES = [
    'اصغر',
    'ممد',
    'نصرت',
    'منصوره',
    'اسماعیل',
    'مهری',
    'هاشم',
    'داریوش',
    'پریوش',
    'کوکب',
    'سکینه',
    'فتانه',
    'حشمت',
    'اشرف',
    'معصومه',
    'غلام',
    'ذبیح‌الله',
    'صفرعلی',
    'بیگُم',
    'مهین‌تاج',
    'شهپر',
    'مهوش',
];
const LAST_NAMES = [
    'فرهادی',
    'دلربا',
    'حدادی',
    'غلام‌رضایی',
    'کاکایی',
    'کربکندی',
    'بی‌طرف',
    'جعفری',
    'خان‌پور',
    'بقال‌زاده',
    'ماس‌بند',
    'بقولی‌زاده',
    'قلی‌پور',
    'تاتاری',
];

export const TESTS = [
    {
        diagnosis: 0.5,
        difficulty: 0.2,
        cost: 3000,
    },
    {
        diagnosis: 0.6,
        difficulty: 0.3,
        cost: 4000,
    },
    {
        diagnosis: 0.2,
        difficulty: 0.1,
        cost: 1000,
    },
    {
        diagnosis: 0.8,
        difficulty: 0.7,
        cost: 5000,
    },
    {
        diagnosis: 0.25,
        difficulty: 0.2,
        cost: 2000,
    },
    {
        diagnosis: 0.7,
        difficulty: 0.8,
        cost: 7000,
    },
    {
        diagnosis: 0.1,
        difficulty: 0.1,
        cost: 1000,
    },
    {
        diagnosis: 0.5,
        difficulty: 0.5,
        cost: 5000,
    },
    {
        diagnosis: 0.45,
        difficulty: 0.3,
        cost: 4500,
    },
    {
        diagnosis: 0.65,
        difficulty: 0.65,
        cost: 6500,
    },
]

class Person {
    constructor(isIll = Math.random() < CHANCE_OF_BEING_ILL, patience = 1) {
        this.firstName = FIRST_NAMES[PERSON_ID % FIRST_NAMES.length];
        this.lastName = LAST_NAMES[Math.floor(Math.random() * PERSON_ID) % LAST_NAMES.length];
        this.id = PERSON_ID++;
        this.isIll = isIll;
        this.patience = parseFloat(patience);
        this.x = Math.random() * (window.innerWidth - 100) + 50; // todo: better distribution
        this.y = Math.random() * (window.innerHeight * 2 - 100) + 50; // todo: better distribution
        this.isSelected = false;
        this.imageType = 'normal';
    }
}

class Test {
    constructor(diagnosis, difficulty, cost) {
        this.diagnosis = parseFloat(diagnosis);
        this.difficulty = parseFloat(difficulty);
        this.cost = parseInt(cost);
    }
}


export class Society {
    constructor(updateComponent) {
        this.budget = parseInt(100000);
        this._buildPeople();
        this._buildTests();
        this.selectedPeople = [];
        this.selectedTest = '';
        this.updateComponent = updateComponent;
    }

    _buildPeople() {
        let people = [];
        for (let i = 0; i < PEOPLE_NUMBER; i++) {
            people.push(new Person());
        }
        this.people = people;
    }

    _buildTests() {
        let tests = [];
        TESTS.forEach((test) => {
            tests.push(new Test(test.diagnosis, test.difficulty, test.cost));
        })
        this.tests = tests;
    }

    selectPerson(personID) {
        this.people[personID].isSelected = true;
        this.selectedPeople.push(personID);
        this.updateComponent(Math.random()); //todo: handle re-rendering in another way!
    }

    selectTest(testID) {
        this.selectedTest = testID;
        this.updateComponent(Math.random()); //todo: handle re-rendering in another way!
    }

    unselectPerson(personID) {
        for (var i = 0; i < this.selectedPeople.length; i++) {
            if (this.people[this.selectedPeople[i]].id === personID) {
                this.selectedPeople.splice(i, 1);
                this.people[personID].isSelected = false;
            }
        }
        this.updateComponent(Math.random()); //todo: handle re-rendering in another way!
    }

    takeTest() {
        const selectedTest = this.tests[this.selectedTest];
        if (selectedTest.cost * this.selectedPeople.length > this.budget) {
            toast.error('نمیشه آقا! هزینه‌ی تست‌ها بیشتر از بودجه‌ایه که داریم. برا همین آزمایش انجام نشد :(');
            return;
        }

        const realHealthyPeople = [];
        const realIllPeople = [];

        for (const personID of this.selectedPeople) {
            if (this.people[personID].patience - selectedTest.difficulty < 0) {
                toast.error('یکی از این بنده خداهایی که انتخاب کردی، صبر کافی نیست. برا همین آزمایش انجام نشد :(');
                return;
            }
            this.people[personID].patience -= selectedTest.difficulty;
            if (this.people[personID].isIll) {
                realIllPeople.push(personID)
            } else {
                realHealthyPeople.push(personID);
            }
        }
        this.budget -= selectedTest.cost * this.selectedPeople.length;

        let x = selectedTest.diagnosis * realIllPeople.length;
        let y = (1 - selectedTest.correctness) * x / selectedTest.correctness;

        const probableIllPeople = _getRandomSubset(x, realIllPeople).concat(_getRandomSubset(y, realHealthyPeople));
        probableIllPeople.forEach((probableIllID) => {
            console.log(probableIllID)
            const probableIllPerson = this.people[probableIllID];
            probableIllPerson.imageType = 'red';
        })
        this.selectedPeople.filter(personID => !probableIllPeople.includes(personID)).forEach((probableHealthyID) => {
            console.log(probableHealthyID)
            const probableHealthyPerson = this.people[probableHealthyID];
            probableHealthyPerson.imageType = 'green';
        })
        this.updateComponent(Math.random()); //todo: handle re-rendering in another way!
    }

    reset() {
        this.people.forEach((person) => {
            person.imageType = 'normal';
            person.isSelected = false;
        })
        this.selectedPeople = [];
        this.updateComponent(Math.random()); //todo: handle re-rendering in another way!
    }

    endGame() {

    }
}

const _getRandomSubset = (size, list) => {
    return _.shuffle(list).slice(0, size);
}

