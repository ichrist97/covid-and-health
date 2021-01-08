//Define the components of a theme
function DefaultTheme() {
	//The colors the data is blended between
	//Primary A is the value for higher factor values
	this.primaryA = '#00355d'
	//Primary B is the color for lower factor values
	this.primaryB = '#9bb8d4'
	//A function for blending the primary color
	this.primaryBlend = t => d3.interpolateRgb(this.primaryA, this.primaryB)(t)

	//The color to display font in which is placed over data elements
	//Primary Font A is the value for higher factor values
	this.primaryFontA = '#575757'
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
	this.axis = '#575757'
	//The color of the background of each element of the dashboard
	this.background = '#ffffff'
	//The color to display font in
	this.font = '#575757'

	//Values for padding, margins etc.

	//The default duration for any transitions in ms
	this.transitionDuration = 500

	//The margin between the grid element and the content
	this.margin = 30
	this.marginLarge = 70

	//Different font sizes
	this.fontSizeAxis = 12
	this.fontSizeSmall = 12
	this.fontSizeDefault = 14

	//The min and max scales for scatter plot points
	this.minScatterPoint = 6
	this.maxScatterPoint = 36

	//The count and size of scatterplot legend elements
	this.scatterLegendCount = 5

	//Custom settings for the timeline
	this.timelineIndicator = 8
}

//Define the default theme
const DEFAULT_THEME = new DefaultTheme()

//This is the currently active theme
let currentTheme = DEFAULT_THEME

//The function to access the current theme
function theme() {
	return currentTheme
}

//The function to changes the current theme
function changeTheme(newTheme) {
	theme = newTheme
}

//Utility function for applying the current theme to an axis
function styleAxis(axis) {
	axis.selectAll('line').attr('stroke', currentTheme.axis)
	axis.selectAll('path').attr('stroke', currentTheme.axis)
	axis.selectAll('text').attr('fill', currentTheme.axis).style('font-size', currentTheme.fontSizeAxis)
}

export { theme, changeTheme, styleAxis, DEFAULT_THEME }
