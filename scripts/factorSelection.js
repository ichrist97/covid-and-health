import { FACTORS, formatFactor } from './data.js'

function setupFactors(dataContainer) {
	const { selectedFactor } = dataContainer
	const factors = Object.values(FACTORS)
	const container = document.querySelector('#factor-selection')
	factors.forEach(factor => {
		const translation = formatFactor(factor)
		// create options in dom
		if (translation) {
			const item = document.createElement('div')
			item.className = 'factor'
			item.setAttribute('data-factor', factor)
			const text = document.createElement('p')
			text.innerText = translation
			item.appendChild(text)
			container.appendChild(item)

			// activate css for default selected factor
			if (factor === selectedFactor.value) {
				item.classList.add('checked')
			}

			// event listener for selecting factors
			item.addEventListener('click', event => {
				// deselect all checkboxes
				const allFactors = container.querySelectorAll('.factor')
				allFactors.forEach(factor => {
					factor.classList.remove('checked')
				})
				// select clicked factor
				const factorRoot = getFactorRoot(event.target)
				const factorName = factorRoot.getAttribute('data-factor')
				factorRoot.classList.add('checked')
				// update observable
				const selectionValue = factorName
				selectedFactor.update(selectionValue)
			})
		}
	})
}

function getFactorRoot(element) {
	// found root div of factor component
	if (element.tagName === 'DIV' && element.className.includes('factor')) {
		return element
	} else {
		return getFactorRoot(element.parentNode)
	}
}

export { setupFactors }
