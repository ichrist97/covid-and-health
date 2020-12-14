//Defines an observable that allows functions to be added as subscribers
//This can be used to inform different parts of the visualization
//About changes to the underlying data and selections

//The observable constructor
function Observable() {
  this.observers = []

  this.subscribe = function (f) {
    this.observers.push(f)
  }

  this.unsubscribe = function (f) {
    this.observers = this.observers.filter(x => x !== f)
  }

  this.notify = function () {
    this.observers.forEach(x => x())
  }
}

//An observable constructor wrapping a data object
function ObservableData(defaultValue) {
  Observable.call(this)

  this.value = defaultValue

  this.update = function (value) {
    if (value == this.value) return
    console.log('selected: ' + value)

    this.value = value
    this.notify()
  }
}

export { ObservableData }
