import { FACTORS } from './data.js'

function setupFeatures(dataContainer) {
  const { selectedFactor } = dataContainer
  const features = Object.values(FACTORS)
  const container = document.querySelector('#health-features')
  features.forEach(feature => {
    // translation
    let translation
    switch (feature) {
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
        translation = 'Anzahl Krankenhäuserbetten'
        break
      case 'healthSpendings':
        translation = 'Ausgaben Gesundheitswesen'
        break
      default:
        translation = ''
        break
    }
    // create options in dom
    if (translation) {
      const item = document.createElement('input')
      item.type = 'checkbox'
      item.id = `${feature}-feature`
      item.value = feature
      container.appendChild(item)
      // item label
      const label = document.createElement('label')
      label.for = item.id
      label.innerText = translation
      container.appendChild(label)

      // event listener for selecting features
      item.addEventListener('change', event => {
        // deselect all checkboxes
        const allFeatures = container.querySelectorAll('input')
        allFeatures.forEach(checkbox => {
          checkbox.checked = false
        })
        // select clicked checkbox
        event.target.checked = true
        // update observable
        selectedFactor.update(event.target.value)
      })
    }
  })

  // default select first feature
  container.querySelectorAll('input')[0].checked = true
}

export { setupFeatures }
