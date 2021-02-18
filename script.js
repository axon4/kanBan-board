const addButtons = document.querySelectorAll('.add-button:not(.solid)');
const saveItemButtons = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
const listColumns = document.querySelectorAll('.drag-item-list');
const backLogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const holdList = document.getElementById('hold-list');

let upDatedOnLoad = false;

let backLogListArray = new Array();
let progressListArray = new Array();
let completeListArray = new Array();
let holdListArray = new Array();
let listArrays = new Array();

let draggedItem;
let dragging = false;
let currentColumn;

function getSavedColumns() {
	if (localStorage.getItem('backLogItems') || localStorage.getItem('progressItems') || localStorage.getItem('completeItems') || localStorage.getItem('holdItems')) {
		backLogListArray = JSON.parse(localStorage.getItem('backLogItems'));
		progressListArray = JSON.parse(localStorage.getItem('progressItems'));
		completeListArray = JSON.parse(localStorage.getItem('completeItems'));
		holdListArray = JSON.parse(localStorage.getItem('holdItems'));
	} else {
		backLogListArray = ['go to the gym', 'sit back and relax'];
		progressListArray = ['work on my dreams', 'be better than yesterDay'];
		completeListArray = ['be cool', 'get stuff done'];
		holdListArray = ['not being cool', 'be lazy'];
	};
};

function upDateSavedColumns() {
	listArrays = [backLogListArray, progressListArray, completeListArray, holdListArray];

	const arrayNames = ['backLog', 'progress', 'complete', 'hold'];

	arrayNames.forEach((arrayName, i) => {
		localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[i]));
	});
};

function filterArray(array) {
	const filteredArray = array.filter(item => item != null);

	return filteredArray;
};

function createItemElement(columnElement, column, item, i) {
	const listElement = document.createElement('li');

	listElement.classList.add('drag-item');

	listElement.textContent = item;
	listElement.draggable = true;

	listElement.setAttribute('ondragstart', 'drag(event)');

	listElement.contentEditable = true;
	listElement.id = i;

	listElement.setAttribute('onfocusout', `upDateItem(${i}, ${column})`);
	columnElement.appendChild(listElement);
};

function upDateDOM() {
	if (!upDatedOnLoad) {
		getSavedColumns();
	};

	backLogList.textContent = '';

	backLogListArray.forEach((backLogItem, i) => {createItemElement(backLogList, 0, backLogItem, i)});
	backLogListArray = filterArray(backLogListArray);

	progressList.textContent = '';
	progressListArray.forEach((progressItem, i) => {createItemElement(progressList, 1, progressItem, i)});
	progressListArray = filterArray(progressListArray);

	completeList.textContent = '';
	completeListArray.forEach((completeItem, i) => {createItemElement(completeList, 2, completeItem, i)});
	completeListArray = filterArray(completeListArray);

	holdList.textContent = '';
	holdListArray.forEach((holdItem, i) => {createItemElement(holdList, 3, holdItem, i)});
	holdListArray = filterArray(holdListArray);

	upDatedOnLoad = true;
	upDateSavedColumns();
};

function upDateItem(ID, column) {
	const selectedArray = listArrays[column];
	const selectedColumnElement = listColumns[column].children;

	if (!dragging) {
		if (!selectedColumnElement[ID].textContent) {
			delete selectedArray[ID];
		} else {
			selectedArray[ID] = selectedColumnElement[ID].textContent;
		};

		upDateDOM();
	};
};

function addToColumn(column) {
	const itemText = addItems[column].textContent;
	const selectedArray = listArrays[column];

	selectedArray.push(itemText);

	addItems[column].textContent = '';

	upDateDOM();
};

function showInPutBox(column) {
	addButtons[column].style.visibility = 'hidden';
	saveItemButtons[column].style.display = 'flex';
	addItemContainers[column].style.display = 'flex';
};

function hideInPutBox(column) {
	addButtons[column].style.visibility = 'visible';
	saveItemButtons[column].style.display = 'none';
	addItemContainers[column].style.display = 'none';

	addToColumn(column);
};

function reBuildArrays() {
	backLogListArray = Array.from(backLogList.children).map(item => item.textContent);
	progressListArray = Array.from(progressList.children).map(item => item.textContent);
	completeListArray = Array.from(completeList.children).map(item => item.textContent);
	holdListArray = Array.from(holdList.children).map(item => item.textContent);

	upDateDOM();
};

function drag(event) {
	draggedItem = event.target;
	dragging = true;
};

function dragEnter(column) {
	listColumns[column].classList.add('over');

	currentColumn = column;
};

function allowDrop(event) {
	event.preventDefault();
};

function drop(event) {
	event.preventDefault();

	listColumns.forEach(column => {column.classList.remove('over')});

	const parent = listColumns[currentColumn];

	parent.appendChild(draggedItem);

	dragging = false;
	
	reBuildArrays();
};

upDateDOM();