function initHelpModal() {
	const modalBackground = document.querySelector('.modal-background')
	const btn = document.getElementById('triggerHelp')
	// Get the <span> element that closes the modal
	const span = document.getElementsByClassName('close')[0]

	// When the user clicks on the button, open the modal
	btn.addEventListener('click', () => {
		modalBackground.style.display = 'flex'
	})

	// When the user clicks on <span> (x), close the modal
	span.addEventListener('click', () => {
		modalBackground.style.display = 'none'
	})

	// When the user clicks anywhere outside of the modal, close it
	modalBackground.addEventListener('click', event => {
		if (event.target == modalBackground) {
			modalBackground.style.display = 'none'
		}
	})

	// when user clicks tab change content
	const tabs = Array.from(document.getElementsByClassName('tab'))
	tabs.forEach(tab => {
		tab.addEventListener('click', event => {
			// deselect all tabs
			tabs.forEach(tabLink => tabLink.classList.remove('active'))

			// set tab as selected
			event.target.classList.add('active')

			// change content
			const tabName = event.target.getAttribute('data-tab')
			if (tabName) {
				selectTab(tabName)
			}
		})
	})

	// default select first tab
	tabs[0].classList.add('active')
	selectTab(tabs[0].getAttribute('data-tab'))
}

function selectTab(tab) {
	// deselect all tab contents
	Array.from(document.getElementsByClassName('tab-content')).forEach(tab => {
		tab.classList.remove('active')
	})

	// show selected tab content
	document.getElementById(tab).classList.add('active')
}

export { initHelpModal }
