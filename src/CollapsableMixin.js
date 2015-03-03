var TransitionEvents = require('./utils/TransitionEvents');

/* This mixin keeps track of its own 'internal' expanded state.  This is to
 * help enable running css animations on the collapsable component.  The
 * expanded state /cannot/ bet set /before/ the mixin has had a chance to
 * ensure that dimensions have been set on the collaspable component.  This
 * is due to how browers interact with css transitions.  If the mixin does 
 * not share an 'expanded' state then it makes it a lot easier to handle the
 * order in which the dimension and `expanded` information is set.

 * This pattern requires the owner of this mixin to manually call the
 * internalToggle() function to toggle the expanded/collapsed state instead
 * of relying upon props propigation.
 *
 * It is suggested that the component which uses this mixin keep its own
 * expanded state (which could be from props or state) and call the
 * internalToggle() function in componentDidUpdate().  Ex:

   componentDidUpdate: function(prevProps, prevState){
     var wasExpanded = prevState.expanded;
     var isExpanded = this.state.expanded;
     if(wasExpanded != isExpanded){
       this.internalToggle();
     }
   }
*/
var CollapsableMixin = {
  getInitialState: function(){
    return {
      internalExpanded: this.props.expanded != null ? this.props.expanded : false,
      collapsing: false
    }
  },

  internalToggle: function(){
    this.state.internalExpanded
      ? this.handleCollapse()
      : this.handleExpand();
  },

  dimension: function(){
    return (typeof this.getCollapsableDimension === 'function')
      ? this.getCollapsableDimension()
      : 'height';
  },

  handleExpand: function(){
    var node = this.getCollapsableDOMNode();
    var dimension = this.dimension();

    // ensure node has dimension value, needed for animation
    node.style[dimension] = '0px';

    var complete = (function (){
      TransitionEvents.removeEndEventListener(
        node,
        complete
      );
      // remove dimension value - this ensures the collapsable item can grow
      // in dimension after initial display (such as an image loading)
      node.style[dimension] = '';
      this.setState({
        collapsing:false
      });
    }).bind(this);

    TransitionEvents.addEndEventListener(
      node,
      complete
    );

    this.setState({
      internalExpanded: true,
      collapsing: true
    });
  },

  handleCollapse: function(){
    var node = this.getCollapsableDOMNode();
    var dimension = this.dimension();
    var value = this.getCollapsableDimensionValue();

    // ensure node has dimension value, needed for animation
    node.style[dimension] = value + 'px';

    var complete = (function (){
      TransitionEvents.removeEndEventListener(
        node,
        complete
      );
      this.setState({
        collapsing: false
      });
    }).bind(this);

    TransitionEvents.addEndEventListener(
      node,
      complete
    );

    this.setState({
      internalExpanded: false,
      collapsing: true
    });
  },

  componentDidUpdate: function(prevProps, prevState){
    var wasExpanded = prevState.internalExpanded;
    var node = this.getCollapsableDOMNode();
    var dimension = this.dimension();
    var value = this.getCollapsableDimensionValue();

    // setting the dimension here starts the transition animation
    if(!wasExpanded && this.state.collapsing) {
      node.style[dimension] = value + 'px';
    } else if(wasExpanded && this.state.collapsing) {
      node.style[dimension] = '0px';
    }
  },

  getCollapsableClassSet: function (className) {
    var classes = {};

    if (typeof className === 'string') {
      className.split(' ').forEach(function (className) {
        if (className) {
          classes[className] = true;
        }
      });
    }

    classes.collapsing = this.state.collapsing;
    classes.collapse = !this.state.collapsing;
    classes['in'] = this.state.internalExpanded && !this.state.collapsing;

    return classes;
  }
};

module.exports = CollapsableMixin;
