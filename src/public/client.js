let store = Immutable.Map({
	user: { name: 'Student' },
	apod: '',
	rovers: ['Curiosity', 'Opportunity', 'Spirit'],
});

// add our markup to the page
const root = document.getElementById('root');

const updateStore = (store, newState) => {
	let newone = store.set('apod', newState);
	console.log('now i have updated store');
	render(root, newone);
};

const render = async (root, state) => {
	console.log('calling render');
	root.innerHTML = App(state);
};

// create content
const App = (state) => {
	console.log(state.get('apod'));
	if (!state.get('apod')) {
		getImageOfTheDay(state);
	} else {
		console.log('im returning img');
		console.log(state.get('apod').image.url);
		return `<img src= ${
			state.get('apod').image.url
		} width = "500" height = "600">`;
	}
};

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
	render(root, store);
});

// ------------------------------------------------------  COMPONENTS

// Example of a pure function that renders infomation requested from the backend

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
	// let { apod } = state;
	console.log('in the getimage blcok');
	fetch(`http://localhost:3000/apod`)
		.then((res) => res.json())
		.then((apod) => {
			console.log(apod);
			console.log('now update the stotre');
			updateStore(store, { apod });
		});
};
