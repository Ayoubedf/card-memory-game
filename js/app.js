const container = document.querySelector('.container');
const loadingSection = document.querySelector('.load');
const gameover = getComputedStyle(container, '::after');
const options = document.querySelectorAll('.option');
const timer = document.querySelector('.timer > .time');
const turnCounter = document.querySelector('.turn-count > .turn');
let turns = 0;
const matchCounter = document.querySelector('.match-count > .match');
const time = 1 * 60 + 0;
let remainingTime = time;
const id = infiniteNumbers();
const icons = [
	{
		icon: 'devicon-html5-plain colored',
		color: 'orangered',
		id: id.next().value,
	},
	{
		icon: 'devicon-css3-plain colored',
		color: 'blue',
		id: id.next().value,
	},
	{
		icon: 'devicon-javascript-plain colored',
		color: 'orange',
		id: id.next().value,
	},
	{
		icon: 'devicon-vuejs-plain colored',
		color: '#47BA87',
		id: id.next().value,
	},
	{
		icon: 'devicon-react-original colored',
		color: '#61DBFB',
		id: id.next().value,
	},
	{
		icon: 'devicon-angularjs-plain colored',
		color: '#DD0031',
		id: id.next().value,
	},
	{
		icon: 'devicon-php-plain colored',
		color: 'gray',
		id: id.next().value,
	},
	{
		icon: 'devicon-python-plain',
		color: '#ffbf00',
		id: id.next().value,
	},
	{
		icon: 'devicon-java-plain',
		color: '#0074BD',
		id: id.next().value,
	},
	{
		icon: 'devicon-sass-original colored',
		color: '#DD0031',
		id: id.next().value,
	},
	{
		icon: 'devicon-c-plain colored',
		color: 'orangered',
		id: id.next().value,
	},
	{
		icon: 'devicon-cplusplus-plain colored',
		color: 'blue',
		id: id.next().value,
	},
	{
		icon: 'devicon-csharp-plain',
		color: '#a73cdd',
		id: id.next().value,
	},
	{
		icon: 'devicon-tailwindcss-plain colored',
		color: '#47BA87',
		id: id.next().value,
	},
	{
		icon: 'devicon-docker-plain colored',
		color: 'gray',
		id: id.next().value,
	},
	{
		icon: 'devicon-bootstrap-plain',
		color: '#6346b9',
		id: id.next().value,
	},
	{
		icon: 'devicon-dart-plain colored',
		color: '#61DBFB',
		id: id.next().value,
	},
	{
		icon: 'devicon-ruby-plain colored',
		color: '#DD0031',
		id: id.next().value,
	},
];
let array = [];
let matches = [];

onload = () => {
	loadingSection.style.display = 'none';
};

options.forEach((option) => {
	option.addEventListener('click', () => {
		start(option.dataset.number, true);
	});
});
function* infiniteNumbers() {
	n = 0;
	while (true) {
		yield n++;
	}
}

start();
function start(cardsNumber = '4*4', restart) {
	createCards(cardsNumber);
	const cards = document.querySelectorAll('.card');
	if (restart) {
		remainingTime = time;
		turns = 0;
		turnCounter.textContent = turns;
		matches = [];
		matchCounter.textContent = matches.length;
		array = [];
	}
	if (!turns) {
		cards.forEach((card) => card.classList.add('turn'));
		setTimeout(() => {
			cards.forEach((card) => card.classList.remove('turn'));
			container.style.pointerEvents = 'auto';
		}, 1000);
	}
	const count = setInterval(() => {
		const min =
			remainingTime / 60 < 10
				? `0${Math.floor(remainingTime / 60)}`
				: Math.floor(remainingTime / 60);
		const sec =
			remainingTime % 60 < 10 ? `0${remainingTime % 60}` : remainingTime % 60;
		timer.textContent = `${min}:${sec}`;

		if (remainingTime <= 0) {
			clearInterval(count);
			container.style.setProperty('--content', `'you lose'`);
			container.style.setProperty('--scale', 1);
			container.style.pointerEvents = 'none';
		} else {
			remainingTime--;
		}
	}, 1000);
	cards.forEach((card, index) => {
		card.setAttribute('data-id', index);
		card.addEventListener('click', () => {
			let target = {
				type: card.dataset.type,
				id: card.dataset.id,
			};
			if (array.length < 2) {
				if (array.length === 0) {
					card.classList.add('turn');
					array.push(target);
				} else {
					container.style.pointerEvents = 'none';
					card.classList.add('turn');
					array.push(target);
					turnCounter.textContent = ++turns;
					if (card.dataset.id != array[0].id) {
						if (card.dataset.type != array[0].type) {
							setTimeout(() => {
								cards.forEach((card) => {
									if (card.dataset.type == array[0].type || card.dataset.type == array[1].type) {
										card.classList.remove('turn');
									}
								});
								array = [];
							}, 500);
						} else {
							array = [];
							matches.push(card.dataset.type);
							matchCounter.textContent = matches.length;
							cards.forEach((e) => {
								if (card.dataset.type == e.dataset.type) {
									e.classList.add('matched');
									if (matches.length === cards.length / 2) {
										container.style.setProperty(
											'--content',
											`'you scored: ${time - remainingTime++}sec with ${turns}turn'`,
										);
										container.style.setProperty('--scale', 1);
										container.style.pointerEvents = 'none';
										clearInterval(count);
									}
								}
							});
						}
					}
					container.style.pointerEvents = 'auto';
				}
			}
		});
	});
	options.forEach((option) => {
		option.addEventListener('click', () => {
			clearInterval(count);
		});
	});
}

function createCards(cardsNumber) {
	container.innerHTML = '';
	const rows = cardsNumber.split('*')[0];
	const cols = cardsNumber.split('*')[1];
	container.style.cssText = `grid-template: repeat(${rows}, 1fr) / repeat(${cols}, 1fr);`;
	let j = 0;
	for (let i = 0; i < rows * cols; i++) {
		let iconClass = icons[j].icon;
		let iconColor = icons[j].color;
		let iconType = icons[j].id;
		if (i % 2) {
			j++;
		}
		const card = document.createElement('div');
		const frontFace = document.createElement('div');
		const icon = document.createElement('i');
		const backFace = document.createElement('div');
		card.setAttribute('data-type', iconType);
		card.setAttribute('data-id', infiniteNumbers().next().value);
		card.style.order = Math.round(Math.random() * 100);
		frontFace.className = 'front-face face';
		iconClass.includes('colored') ? '' : (icon.style.color = iconColor);
		icon.className = `${iconClass}`;
		backFace.className = 'back-face face';
		frontFace.appendChild(icon);
		card.appendChild(frontFace);
		card.appendChild(backFace);
		card.className = 'card';
		container.appendChild(card);
	}
}
