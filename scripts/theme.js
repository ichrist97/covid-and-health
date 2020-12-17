//Define the components of a theme
function DefaultTheme() {
	//The colors the data is blended between
	//Primary A is the value for higher factor values
	this.primaryA = '#00355d'
	//Primary B is the color for lower factor values
	this.primaryB = '#deebf7'
	//A function for blending the primary color
	this.primaryBlend = t => d3.interpolateRgb(this.primaryA, this.primaryB)(t)

	//The color to display font in which is placed over data elements
	//Primary Font A is the value for higher factor values
	this.primaryFontA = '#ffffff'
	//Primary Font B is the value for lower factor values
	this.primaryFontB = '#343434'
	//The color to use for outlines around
	this.primaryOutline = '#ffffff'

	//The color the currently selected country is displayed in
	this.selection = '#e6550d'
	//The color used for hover effect over clickable data displays
	this.hover = '#fdae6b'

	//The normal color used for interactable ui elements
	this.button = '#ababab'
	//The color used for buttons when hovered over
	this.buttonHover = '#bcbcbc'
	//The color used for a currently active ui element
	this.buttonActive = '#e6550d'
	//The color to display the font in buttons is
	this.buttonFont = '#343434'

	//The color of the graph axis
	this.axis = '#ff0000'
	//The color of the background of each element of the dashboard
	this.background = '#232323'
	//The color to display font in
	this.font = '#ffffff'
}

//Define the default theme
const DEFAULT_THEME = new DefaultTheme()

//This is the currently active theme
let theme = DEFAULT_THEME

//The function to access the current theme
function Theme() {
	return theme
}

//The function to changes the current theme
function ChangeTheme(newTheme) {
	theme = newTheme
}

export { Theme, ChangeTheme, DEFAULT_THEME }
