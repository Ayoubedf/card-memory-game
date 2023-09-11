const game = document.querySelector('.game');
const container = document.querySelector('.cards-container');
const controlPanel = document.querySelector('.control-panel');
const loadingSection = document.querySelector('.load');
const options = document.querySelectorAll('.option');
const timer = document.querySelector('.timer > .time');
const turnCounter = document.querySelector('.turn-count > .turn');
const matchCounter = document.querySelector('.match-count > .match');
const tbody = document.querySelector('#highscore tbody');
const scoreElement = document.querySelector('.score');
let time = 1 * 30 + 0;
let size;

let scores = JSON.parse(localStorage.getItem('scores')) || {
	'4*4': [],
	'4*5': [],
	'4*6': [],
	'5*6': [],
	'6*6': [],
};

const icons = [
	{
		icon: 'devicon-html5-plain colored',
		color: 'orangered',
		id: 0,
	},
	{
		icon: 'devicon-css3-plain colored',
		color: 'blue',
		id: 1,
	},
	{
		icon: 'devicon-javascript-plain colored',
		color: 'orange',
		id: 2,
	},
	{
		icon: 'devicon-vuejs-plain colored',
		color: '#47BA87',
		id: 3,
	},
	{
		icon: 'devicon-react-original colored',
		color: '#61DBFB',
		id: 4,
	},
	{
		icon: 'devicon-angularjs-plain colored',
		color: '#DD0031',
		id: 5,
	},
	{
		icon: 'devicon-php-plain colored',
		color: 'gray',
		id: 6,
	},
	{
		icon: 'devicon-python-plain',
		color: '#ffbf00',
		id: 7,
	},
	{
		icon: 'devicon-java-plain',
		color: '#0074BD',
		id: 8,
	},
	{
		icon: 'devicon-sass-original colored',
		color: '#DD0031',
		id: 9,
	},
	{
		icon: 'devicon-c-plain colored',
		color: 'orangered',
		id: 10,
	},
	{
		icon: 'devicon-cplusplus-plain colored',
		color: 'blue',
		id: 11,
	},
	{
		icon: 'devicon-csharp-plain',
		color: '#a73cdd',
		id: 12,
	},
	{
		icon: 'devicon-tailwindcss-plain colored',
		color: '#47BA87',
		id: 13,
	},
	{
		icon: 'devicon-docker-plain colored',
		color: 'gray',
		id: 14,
	},
	{
		icon: 'devicon-bootstrap-plain',
		color: '#6346b9',
		id: 15,
	},
	{
		icon: 'devicon-dart-plain colored',
		color: '#61DBFB',
		id: 16,
	},
	{
		icon: 'devicon-ruby-plain colored',
		color: '#DD0031',
		id: 17,
	},
];

onload = () => {
	loadingSection.style.display = 'none';
};

options.forEach((option) => {
	option.addEventListener('click', () => {
		if (!option.classList.contains('active')) {
			switch (option.dataset.size) {
				case '4*4':
					time = 30;
					break;
				case '4*5':
					time = 50;
					break;
				case '4*6':
					time = 60;
					break;
				case '5*6':
					time = 60 + 45;
					break;
				case '6*6':
					time = 2 * 60;
					break;
			}
			timer.textContent = '00:00';

			gameState = {
				arrange: [],
				match: [],
				tries: 0,
				time: time,
			};
			options.forEach((option) => {
				option.classList.remove('active');
			});
			option.classList.add('active');
			container.setAttribute('data-size', option.dataset.size);
		}
	});
});

function showHighscores() {
	scores[container.dataset.size] = scores[container.dataset.size].sort(
		(c, n) => c.tries + c.time / 10 - (n.tries + n.time / 10),
	);
	const p = document.querySelector('#highscore p');
	const table = document.querySelector('#highscore table');
	p.style.display = 'none';
	table.style.display = 'revert';
	const highscores = document.querySelector('#highscore');
	highscores.style.display = 'block';
	tbody.innerHTML = '';
	if (scores[container.dataset.size].length) {
		for (let i = 0; i < scores[container.dataset.size].length; i++) {
			if (i === 10) {
				break;
			}
			const ordinal = ['st', 'nd', 'rd'];
			const user = scores[container.dataset.size][i];
			const tr = document.createElement('tr');
			const position = document.createElement('td');
			position.textContent = ordinal[i] ? i + 1 + ordinal[i] : i + 1 + 'th';
			const name = document.createElement('td');
			name.textContent = user.name;
			const tries = document.createElement('td');
			tries.textContent = user.tries;
			const time = document.createElement('td');
			time.textContent = user.time;
			tr.appendChild(position);
			tr.appendChild(name);
			tr.appendChild(tries);
			tr.appendChild(time);
			tbody.appendChild(tr);
		}
	} else {
		const table = document.querySelector('#highscore table');
		const p = document.querySelector('#highscore p');
		table.style.display = 'none';
		p.style.display = 'revert';
	}
}

let array = [];
let gameState = {
	arrange: [],
	match: [],
	tries: 0,
	time: time,
};
let count;

function start() {
	game.style.display = 'grid';
	controlPanel.style.display = 'none';
	createCards(container.dataset.size);
	const cards = document.querySelectorAll('.card');
	showcards(gameState);
	showHighscores();

	count = setInterval(() => {
		gameState.time--;
		const min =
			gameState.time / 60 < 10
				? `0${Math.floor(gameState.time / 60)}`
				: Math.floor(gameState.time / 60);
		const sec =
			gameState.time % 60 < 10 ? `0${gameState.time % 60}` : gameState.time % 60;
		timer.textContent = `${min}:${sec}`;

		if (gameState.time <= 0) {
			clearInterval(count);
			scoreElement.textContent = 'you lose';
			scoreElement.style.setProperty('--scale', 1);
			container.style.pointerEvents = 'none';
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
					turnCounter.textContent = ++gameState.tries;
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
							gameState.match.push(+card.dataset.type);
							matchCounter.textContent = gameState.match.length;
							cards.forEach((e) => {
								if (card.dataset.type == e.dataset.type) {
									e.classList.add('matched');
								}
							});
							if (gameState.match.length === cards.length / 2) {
								scoreElement.textContent = `you scored ${time - gameState.time}sec with ${
									gameState.tries
								}turn`;
								scoreElement.style.setProperty('--scale', 1);
								container.style.pointerEvents = 'none';
								clearInterval(count);
								const modal = document.querySelector('.modal');
								modal.addEventListener('keypress', (e) => {
									if (e.key === 'Enter') {
										modal_confirm.click();
									}
								});
								async function showModal() {
									const modal_input = modal.querySelector('.modal_input');
									const name = modal_input.value;
									modal_input.value = '';
									return name;
								}
								const modal_confirm = modal.querySelector('.modal_confirm');
								modal_confirm.onclick = addScore;
								document.body.addEventListener('click', function (e) {
									if (e.target === modal) {
										addScore();
									}
								});
								function addScore() {
									showModal()
										.then((name) => {
											return name;
										})
										.then(updateScores);
									modal.close();
								}
								setTimeout(() => {
									modal.showModal();
								}, 500);
								function updateScores(name) {
									const score = {
										name: name || 'guest',
										tries: gameState.tries,
										time: time - gameState.time,
									};
									let already = false;
									for (const el of scores[container.dataset.size]) {
										if (score.name === el.name) {
											if (score.tries + score.time / 10 < el.tries + el.time / 10) {
												el.tries = score.tries;
												el.time = score.time;
											}
											already = true;
										}
									}
									if (!already) {
										scores[container.dataset.size].push(score);
									}
									localStorage.setItem('scores', JSON.stringify(scores));
									showHighscores();
								}
							}
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

	function showcards(data) {
		if (!data.tries) {
			cards.forEach((card) => card.classList.add('turn'));
			setTimeout(() => {
				cards.forEach((card) => {
					card.classList.remove('turn');
				});
				container.style.pointerEvents = 'auto';
			}, 1000);
		}
	}
}
function stop() {
	const highscores = document.querySelector('#highscore');
	highscores.style.display = 'none';
	clearInterval(count);
	array = [];
	gameState = {
		arrange: [],
		match: [],
		tries: 0,
		time: time,
	};
	matchCounter.textContent = gameState.match.length;
	turnCounter.textContent = gameState.tries;
	timer.textContent = '00:00';
	controlPanel.style.display = 'flex';
	game.style.display = 'none';
	scoreElement.style.setProperty('--scale', 0);
}
function createCards(cardsNumber) {
	container.innerHTML = '';
	const rows = cardsNumber.split('*')[0];
	const cols = cardsNumber.split('*')[1];
	container.style.cssText = `grid-template: repeat(${rows}, 1fr) / repeat(${cols}, 1fr);`;
	let j = 0;
	for (let i = 0; i < rows * cols; i++) {
		const iconClass = icons[j].icon;
		const iconColor = icons[j].color;
		const iconType = icons[j].id;
		if (i % 2) {
			j++;
		}
		const card = document.createElement('div');
		const frontFace = document.createElement('div');
		const icon = document.createElement('i');
		const backFace = document.createElement('div');
		card.setAttribute('data-type', iconType);
		card.setAttribute('data-id', i);

		frontFace.className = 'front-face face';
		iconClass.includes('colored') ? '' : (icon.style.color = iconColor);
		icon.className = `${iconClass}`;
		backFace.className = 'back-face face';
		frontFace.appendChild(icon);
		card.appendChild(frontFace);
		card.appendChild(backFace);
		card.className = 'card';
		container.appendChild(card);

		let order = Math.round(Math.random() * 1000);
		card.style.order = order;
		gameState.arrange.push(order);

		for (const type of gameState.match) {
			if (card.dataset.type == type) {
				card.classList.add('matched');
			}
		}
	}
}
