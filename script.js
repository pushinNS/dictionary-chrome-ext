var modal = getModal();
var ref;
var selectedText;

function onSelectionHandler() {
	var selection = window.getSelection();
	selectedText = getTrimmedSelectionAsString(selection);
	if (isSelectedStringValid(selectedText)) {
		var element;
		if (modal) {
			element = modal;
		} else {
			initFirebase();
			element = document.createElement('div');
			constructElement(element);
		}
		document.body.appendChild(element);
		showModal(element);
		setModalPosition(element, selection);
	}
};

function constructElement(element) {
	element.id = 'modal';
	element.innerHTML = '<span id="modal-value">' + selectedText + '</span>';
}


document.body.addEventListener('mouseup', function (e) {
	var selection = window.getSelection();
	if (somethingIsSelected(selection)) {
		onSelectionHandler();
	} else {
		var target = e.target;
		if (e.target.id == 'modal') {
			saveToFirebase(selectedText, '');
			hideModal();
		} else {
			if (modal) {
				hideModal();
			}
		}
	}
});

function getModal() {
	return document.getElementById('modal');
}

function somethingIsSelected(selection) {
	return selection && getTrimmedSelectionAsString(selection) !== "";
}

function getTrimmedSelectionAsString(selection) {
	return selection.toString().trim();
}

function showModal(element) {
	modal = getModal();
	element.style.display = 'block';
}

function hideModal() {
	modal.style.display = 'none';
}

function setModalPosition(element, selection) {
	var r = selection.getRangeAt(0).getBoundingClientRect();
	element.style.top = (window.pageYOffset + r.top - r.height * 2 - 1) + 'px'
	element.style.left = (window.pageXOffset + r.left + r.width / 2 - 18) + 'px';
}

function initFirebase() {
	loadFirebaseScript();
	var config = {
		
	};
	firebase.initializeApp(config);
	ref = firebase.database().ref();
}

function isSelectedStringValid(s) {
	return s.search(/[a-zA-Z]/) !== -1 && s.length < 25;
}

function saveToFirebase(word, tr) {
	ref.child(word).set({ translation: tr });
}

function loadFirebaseScript() {
	var script = document.createElement('script');
	script.src = 'https://www.gstatic.com/firebasejs/5.0.2/firebase.js';
	document.getElementsByTagName('head')[0].appendChild(script);
}
