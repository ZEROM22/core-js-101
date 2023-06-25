/* eslint-disable no-underscore-dangle */
/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea: () => height * width,
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */


const cssSelectorBuilder = {
  selector: '',

  element(value) {
    if (this._element) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    if (this._id
      || this._class
      || this._attr
      || this._pseudoClass
      || this._pseudoElement
    ) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element" if selector parts arranged in an invalid order.');

    const newBuilder = Object.create(cssSelectorBuilder);
    newBuilder.selector = this.selector + value;
    newBuilder._element = value;
    return newBuilder;
  },

  id(value) {
    if (this._id) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    if (this._class
      || this._attr
      || this._pseudoClass
      || this._pseudoElement
    ) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element" if selector parts arranged in an invalid order.');

    const newBuilder = Object.create(cssSelectorBuilder);
    newBuilder.selector = `${this.selector}#${value}`;
    newBuilder._id = value;
    return newBuilder;
  },

  class(value) {
    if (this._attr
      || this._pseudoClass
      || this._pseudoElement
    ) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element" if selector parts arranged in an invalid order.');

    const newBuilder = Object.create(cssSelectorBuilder);
    newBuilder.selector = `${this.selector}.${value}`;
    this._class = value;
    return newBuilder;
  },

  attr(value) {
    if (this._pseudoClass
      || this._pseudoElement
    ) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element" if selector parts arranged in an invalid order.');

    const newBuilder = Object.create(cssSelectorBuilder);
    newBuilder.selector = `${this.selector}[${value}]`;
    this._attr = value;
    return newBuilder;
  },

  pseudoClass(value) {
    if (this._pseudoElement) throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element" if selector parts arranged in an invalid order.');

    const newBuilder = Object.create(cssSelectorBuilder);
    newBuilder.selector = `${this.selector}:${value}`;
    this._pseudoClass = value;
    return newBuilder;
  },

  pseudoElement(value) {
    const newBuilder = Object.create(cssSelectorBuilder);
    newBuilder.selector = `${this.selector}::${value}`;
    if (this._pseudoElement) throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    newBuilder._pseudoElement = value;
    this._pseudoElement = value;
    return newBuilder;
  },

  combine(selector1, combinator, selector2) {
    const newBuilder = Object.create(cssSelectorBuilder);
    newBuilder.selector = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return newBuilder;
  },

  stringify() {
    this._element = null;
    this._id = null;
    this._class = null;
    this._attr = null;
    this._pseudoClass = null;
    this._pseudoElement = null;
    return this.selector;
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
