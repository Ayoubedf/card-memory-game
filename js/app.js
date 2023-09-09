const cards = document.querySelectorAll('.card');
const container = document.querySelector('.container');
const timer = document.querySelector('.timer > .time');
const turnCount = document.querySelector('.turn-count > .turn');
let turns = 0;
const matchCount = document.querySelector('.match-count > .match');
const gameover = document.querySelector('.gameover');
const time = 1 * 60 + 0;
let remainingTime = time;
const colors = [
	'orangered',
	'blue',
	'orange',
	'#47BA87',
	'gray',
	'#3674A5',
	'#61DBFB',
	'#DD0031',
];
let array = [];
let matches = [];

if (!matches.length) {
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
	if (remainingTime === 0) {
		clearInterval(count);
		gameover.textContent = 'you lose';
		gameover.classList.add('append');
		container.style.pointerEvents = 'none';
	}
	remainingTime--;
}, 1000);

for (let i = 0; i < cards.length; i += 2) {
	cards[i].setAttribute('data-type', i / 2);
	cards[i + 1].setAttribute('data-type', i / 2);
	cards[i].querySelector('.front-face').style.background = colors[i / 2];
	cards[i + 1].querySelector('.front-face').style.background = colors[i / 2];
	cards[i].style.order = Math.round(Math.random() * 100);
	cards[i + 1].style.order = Math.round(Math.random() * 100);
}
cards.forEach((card, index) => {
	let target = {
		type: card.dataset.type,
		id: card.dataset.id,
	};
	card.setAttribute('data-id', index);
	card.addEventListener('click', () => {
		if (array.length < 2) {
			if (array.length === 0) {
				card.classList.add('turn');
				array.push(target);
			} else {
				container.style.pointerEvents = 'none';
				card.classList.add('turn');
				array.push(target);
				turnCount.textContent = ++turns;
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
						matchCount.textContent = matches.length;
						cards.forEach((e) => {
							if (card.dataset.type == e.dataset.type) {
								e.classList.add('matched');
								if (matches.length === cards.length / 2) {
									gameover.innerHTML = `you win </br> you scored: ${
										time - remainingTime++
									}sec with ${turns}turn`;
									gameover.classList.add('append');
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
