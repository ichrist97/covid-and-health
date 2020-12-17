import { FACTORS } from './data.js'

function setupFactors(dataContainer) {
	const { selectedFactor } = dataContainer
	const factors = Object.values(FACTORS)
	const container = document.querySelector('#factor-container')
	factors.forEach(factor => {
		const translation = translateFactor(factor)
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

function translateFactor(factor) {
	let translation
	switch (factor) {
		case 'smoking':
			translation = 'Raucher'
			break
		case 'obesity':
			translation = 'Übergewicht'
			break
		case 'alcohol':
			translation = 'Alkoholkonsum'
			break
		case 'hospitalBeds':
			translation = 'Anzahl Krankenbetten'
			break
		case 'healthSpendings':
			translation = 'Ausgaben Gesundheitswesen'
			break
		default:
			translation = ''
			break
	}
	return translation
}

export { setupFactors }
