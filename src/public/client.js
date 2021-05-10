let store = Immutable.Map({
	user: { name: 'Student' },
	apod: '',
	rovers: ['Curiosity', 'Opportunity', 'Spirit'],
});

// add our markup to the page
const root = document.getElementById('root');

const updateStore = (store, newState) => {
	let newone = store.merge(newState);
	render(root, newone);
};

const render = async (root, state) => {
	root.innerHTML = App(state);
};

// create content
const App = (state) => {
	if (!state.get('apod')) {
		return `<h2> click one of the buttons above to explore </h2>`;
	} else {
		return `
		<h4>${state.get('apod').toJS().roverName}</h4>
		<h6>Launch Date: ${state.get('apod').toJS().launchDate}</h6>
		<h6>Landing Date: ${state.get('apod').toJS().landingDate}</h6>
		<h6>Status: ${state.get('apod').toJS().status}</h6>
		<h6>Date the most recent photos were taken: ${
			state.get('apod').toJS().date
		}</h6>
		<div class ="boxcontainer"> ${showImages(state)} </div>
		`;
	}
};
// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
	render(root, store);
	let btnSpirit = document.getElementById('btnspirit');
	let btnCuriosity = document.getElementById('btncuriosity');
	let btnOpportunity = document.getElementById('btnopportunity');
	btnCuriosity.addEventListener('click', () => getRoverData('Curiosity')); //non-array-func here will be called immediately
	btnSpirit.addEventListener('click', () => getRoverData('Spirit'));
	btnOpportunity.addEventListener('click', () => getRoverData('Opportunity'));
});

// ------------------------------------------------------  COMPONENTS

// Example of a pure function that renders infomation requested from the backend
const showImages = (state) => {
	return state
		.get('apod')
		.toJS()
		.imgs.reduce((acc, cur) => {
			acc += `<div class = "box"> <img src = "${cur}" width = 100%, height = 100% /> </div>`;
			return acc;
		}, '');
};

// ------------------------------------------------------  API CALLS

async function getRoverData(roverName) {
	const res = await fetch(`/rover/${roverName}`);
	const data = await res.json();
	const launchDate = data.latest_photos[0].rover.launch_date;
	const landingDate = data.latest_photos[0].rover.landing_date;
	const status = data.latest_photos[0].rover.status;
	const date = data.latest_photos[0].earth_date;
	const imgs = data.latest_photos.map((item) => {
		return item.img_src;
	});
	const apod = {
		roverName,
		launchDate,
		landingDate,
		status,
		date,
		imgs,
	};
	console.log({ apod });
	updateStore(store, { apod });
}
